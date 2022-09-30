import {
  getExamineByAllApi,
  getFeedbackDetailsApi,
  submitFeedBackApi,
} from '@/apis/index.js';
import { ref, reactive } from 'vue';

export default () => {
  const activeId = ref(0);
  const peopleList = ref([]);
  const feedbackInfo = reactive({
    detail: {},
    list: [],
  });

  const pageParams = reactive({
    projectId: 1,
    state: 1,
    yearMonth: '2022-08-05',
    contactorId: 1,
  });

  // 安全返回数据函子
  function identityFunctor(data, initData) {
    return data ? data : initData;
  }

  const getFeedbackDetails = async ({
    contactorId,
    projectId,
    fillingTime,
    submitMember,
    state,
  }) => {
    const res = await getFeedbackDetailsApi({
      contactorId,
      projectId,
      fillingTime,
      submitMember,
      state,
    });

    feedbackInfo.detail = res.declarationPeriodVO;

    if (res.workingHourProjectManageVOS.length) {
      feedbackInfo.detail.projectName =
        res.workingHourProjectManageVOS[0].projectName;

      console.log(
        '%c [ res.workingHourProjectManageVOS[0].projectThirdTargets ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        res.workingHourProjectManageVOS[0].projectThirdTargets
      );
      const starNum = 4;
      res.workingHourProjectManageVOS[0].projectThirdTargets.forEach(
        (item, index) => {
          console.log(
            '%c [ item ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            item
          );
          item.workingHour.workEfficiency = identityFunctor(
            item.workingHour.workEfficiency,
            starNum
          );

          item.workingHour.taskCompletion = identityFunctor(
            item.workingHour.taskCompletion,
            starNum
          );

          item.workingHour.taskSatisfaction = identityFunctor(
            item.workingHour.taskSatisfaction,
            starNum
          );

          calcTotalWorkingHours(
            res.workingHourProjectManageVOS[0].projectThirdTargets,
            index
          );
        }
      );
      feedbackInfo.list =
        res.workingHourProjectManageVOS[0].projectThirdTargets;
    }

    console.log(
      '%c [ feedbackInfo.list ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      feedbackInfo.list
    );
  };

  const getExamineByAll = async () => {
    peopleList.value = await getExamineByAllApi(pageParams);
    console.log(
      '%c [ xxx ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      peopleList.value
    );
    const targetIndex = peopleList.value.findIndex(
      (item) => item.contactorId === pageParams.contactorId
    );
    // 数组换位
    [peopleList.value[0], peopleList.value[targetIndex]] = [
      peopleList.value[targetIndex],
      peopleList.value[0],
    ];

    return peopleList.value;
  };

  const initPageData = async () => {
    const list = await getExamineByAll();
    console.log(
      '%c [ xlistxx ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      list
    );
    activeId.value = list[0].contactorId;

    if (list.length > 0) {
      await getFeedbackDetails({
        contactorId: list[0].contactorId,
        projectId: pageParams.projectId,
        fillingTime: pageParams.yearMonth,
        submitMember: list[0].mailContactorName,
        state: pageParams.state,
      });
    }
  };

  // 星星数转换小数
  const transformWorkingHour = (num) => {
    const map = [0.3, 0.6, 0.8, 1, 1.2];
    return map[num - 1];
  };

  // 计算工时：贡献工时＝消耗工时×工作效率×完成度×满意度
  const calcTotalWorkingHours = (list, index) => {
    const a = list[index].workingHour.timeConsuming;
    const b = transformWorkingHour(list[index].workingHour.workEfficiency);
    const c = transformWorkingHour(list[index].workingHour.taskCompletion);
    const d = transformWorkingHour(list[index].workingHour.taskSatisfaction);

    list[index].workingHour.contributingHour = (a * b * c * d).toFixed(2);
  };

  // 评分变化的监听change
  const rateChange = (event, index, key) => {
    feedbackInfo.list[index].workingHour[key] = event.detail;
    calcTotalWorkingHours(feedbackInfo.list, index);
  };

  const commentChange = (event, index) => {
    feedbackInfo.list[index].workingHour.reviewComment = event.detail;
  };

  const tabClick = (tab) => {
    activeId.value = tab.contactorId;
    getFeedbackDetails({
      contactorId: tab.contactorId,
      projectId: pageParams.projectId,
      fillingTime: pageParams.yearMonth,
      submitMember: tab.mailContactorName,
      state: pageParams.state,
    });
  };

  // 提交反馈后，数组删除
  const delFeedbackList = (index) => {
    const tabIndex = peopleList.value.findIndex(
      (item) => item.contactorId === activeId.value
    );

    feedbackInfo.list.splice(index, 1);
    // 单纯删除该项
    if (feedbackInfo.list.length > 0) {
      // num - 1
      peopleList.value[tabIndex].count--;
    } else {
      // 删除并加载下一页tab
      // 如果当前tab的长度为1 就不删除加载下一页了
      if (peopleList.value.length > 1) {
        peopleList.value.splice(tabIndex, 1);
        // 如果tabIndex已经是数组最后一项，则加载前面一页，否则加载下一页，注意下标会偏移
        console.log(
          '%c [ tabIndex ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          tabIndex,
          peopleList.value.length
        );
        if (tabIndex >= peopleList.value.length) {
          tabClick(peopleList.value[tabIndex - 1]);
        } else {
          tabClick(peopleList.value[tabIndex]);
        }

        wx.pageScrollTo({
          scrollTop: 0,
        });
      } else {
        peopleList.value[tabIndex].count--;
      }
    }
  };

  // 提交反馈
  const submitFeedBack = async (index, state) => {
    // {
    //   "id":"7",
    //   "workEfficiency":"4",
    //   "taskCompletion":"4",
    //   "taskSatisfaction":"4",
    //   "reviewComment":"审核意见11111111",
    //   "contributingHour":"4.0",
    //   "state":"2"
    // }
    const info = feedbackInfo.list[index];
    const requestData = {
      id: info.workingHour.id,
      workEfficiency: info.workingHour.workEfficiency,
      taskCompletion: info.workingHour.taskCompletion,
      taskSatisfaction: info.workingHour.taskSatisfaction,
      reviewComment: info.workingHour.reviewComment,
      contributingHour: info.workingHour.contributingHour,
      state, // `state` '状态（1：待反馈，2：已反馈，3：已退回）'
    };

    if (requestData.contributingHour === null) {
      requestData.contributingHour = 'NaN';
    }

    if (isNaN(requestData.contributingHour) && requestData.state !== '3') {
      wx.showToast({
        title: '请填写评分',
        icon: 'error',
      });
      return;
    }
    submitFeedBackApi([requestData], () => {
      delFeedbackList(index);
    });
  };

  return {
    peopleList,
    initPageData,
    feedbackInfo,
    rateChange,
    submitFeedBack,
    commentChange,
    pageParams,
    getFeedbackDetails,
    tabClick,
    activeId,
  };
};

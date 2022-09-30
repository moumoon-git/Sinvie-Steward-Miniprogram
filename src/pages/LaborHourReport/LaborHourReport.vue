<!--工时填报-->
<template>
  <scroll-view class="laborHourReport">
    <!-- head -->
    <view class="header">
      <text class="header-left">月度报告</text>
      <view class="header-right">
        <view hover-class="button-hover-class" class="header-right-item" @click="toLaborHourStatistics">
          <image
            mode="heightFix"
            src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-statistic.svg"
            class="icon-statistic"
          ></image>
          <text>工时统计</text>
        </view>
        <view hover-class="button-hover-class" class="header-right-item" @click="handleShowCalendar">
          <image
            mode="heightFix"
            src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-calendar.svg"
            class="icon-calendar"
          ></image>
          <text>填报日历</text>
        </view>
      </view>
    </view>

    <!-- main -->
    <view class="main">
      <view class="main__statistics">
        <view class="main__statistics__top">
          <!-- 月份 -->
          <swiper
            v-if="monthsList.length > 0"
            :display-multiple-items="
              monthsList.length > 2 ? 3 : monthsList.length
            "
            class="months-swiper"
            :style="{
              width:
                monthsList.length > 2
                  ? '335rpx'
                  : 100 * monthsList.length + 'rpx',
            }"
          >
            <block v-for="item in monthsList" :key="item.month">
              <swiper-item
                :class="[
                  'months-swiper-item',
                  {
                    active:
                      item.year === activeMonth.year &&
                      item.month === activeMonth.month,
                  },
                ]"
                @click="handleToggleMonth(item)"
              >
                {{ `${item.month}月` }}
              </swiper-item>
            </block>
          </swiper>
          <text
            :class="[
              'reuse-btn',
              {
                'reuse-btn--active':
                  isHasDeclareData && !currentLaborHours.state,
              },
            ]"
            @click="handleReuse"
            >复用</text
          >
        </view>
        <view class="main__statistics__center">
          <view
            v-for="item in statistics.feedbackStatistics"
            :key="item.name"
            :data-redirectTo="'/pages/DeclarationRecord/DeclarationRecord'"
            @click="handleNavigate"
          >
            <text class="count">{{ statistics[item.code] }}</text>
            <text class="name">{{ item.name }}</text>
          </view>
        </view>
        <view class="main__statistics__bottom">
          <view
            v-for="item in statistics.workingHoursStatistics"
            :key="item.name"
            class="color-666"
          >
            {{ item.name }}：
            <text class="color-333">{{ statistics[item.code] }}</text>
          </view>
        </view>
      </view>
      <view class="main__add-projects">
        <view class="main__add-projects__top">
          <template v-if="laborHoursDayList.length > 0">
            <swiper
              :current="activeDateIndex"
              :display-multiple-items="0"
              class="laborHours-swiper"
              @change="handleSwiperChange"
            >
              <block v-for="item in laborHoursDayList" :key="item.date">
                <swiper-item class="laborHours-swiper-item">
                  <van-icon
                    name="arrow-left"
                    hover-class="button-hover-class"
                    :class="activeDateIndex === 0 ? 'color-ccc' : ''"
                    @click="handleToggleDay('last')"
                  />
                  <view>
                    日期：
                    <text class="color-333">{{
                      `${todayDate.year !== item.year ? item.year + '年' : ''}${
                        item.month
                      }月${item.day}日`
                    }}</text>
                  </view>
                  <view>
                    工时：
                    <text class="color-333">{{ item.totalTimeConsuming }}</text>
                  </view>
                  <view>
                    状态：
                    <text
                      :class="
                        item.state === 1 ? 'color-0091FF' : 'color-F66E6E'
                      "
                      >{{ item.state === 1 ? '已提交' : '未提交' }}</text
                    >
                  </view>
                  <van-icon
                    name="arrow"
                    hover-class="button-hover-class"
                    :class="
                      activeDateIndex === laborHoursDayList.length - 1
                        ? 'color-ccc'
                        : ''
                    "
                    @click="handleToggleDay('next')"
                  />
                </swiper-item>
              </block>
            </swiper>
          </template>
        </view>
        <view class="main__add-projects__center">
          <van-button
            plain
            type="primary"
            class="add-button"
            hover-class="none"
            @click="handleDeleteProjects"
          >
            <view hover-class="button-hover-class" class="add-button__content">
              <image
                mode="heightFix"
                :src="
                  laborHoursDayList[activeDateIndex].state === 1
                    ? 'http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-remove.svg'
                    : 'http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-remove-disabled.svg'
                "
                class="icon_remove"
              ></image>
              <text :class="laborHoursDayList[activeDateIndex].state === 1 ? 'color-0091FF' : 'color-ccc'">全部撤销</text>
            </view>
          </van-button>
          <van-button
            plain
            type="primary"
            class="add-button"
            hover-class="none"
            @click="handleAddProjects"
          >
            <view hover-class="button-hover-class" class="add-button__content">
              <image
                mode="heightFix"
                src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-add.svg"
                class="icon_remove"
              ></image>
              <text class="color-0091FF">添加工时</text>
            </view>
          </van-button>
        </view>
      </view>

      <view class="main__projects">
        <template v-if="isLoading">
          <Loading />
        </template>
        <template v-if="myProjectList.length > 0 && !isLoading">
          <ProjectsLaborHoursItem
            v-for="(item, index) in myProjectList"
            :key="item.id"
            ref="projectsLaborHoursItemRef"
            :index="index"
            :project="item"
            @declare-again="handleDeclareAgain(arguments)"
            @update-workingHour="handleUpdateWorkingHour"
            @add-third-target="handleAddThirdTarget"
            @delete-third-target="handleDeleteThirdTarget(arguments)"
            @remove-project="handleRemoveProject"
            @refresh="getInitData"
          />
        </template>
      </view>
    </view>

    <!-- footer -->
    <!-- <view v-if="!currentLaborHours.state" class="footer"> -->
    <view v-if="isShowDeclareBtn" class="footer">
      <view>已填工时：{{ totalHours }}小时</view>
      <van-button
        v-if="myProjectList.length === 0"
        disabled
        type="info"
        :class="[
          'submit-button',
          { 'submit-button--disabled': myProjectList.length === 0 },
        ]"
        @click="handleSaveWorkingHour"
        >申报</van-button
      >
      <van-button
        v-else
        type="info"
        :class="['submit-button']"
        @click="handleSaveWorkingHour"
        >申报</van-button
      >
    </view>
    <!-- 添加项目弹窗 -->
    <ProjectTargetList
      ref="projectTargetList"
      :defaultModule="defaultModule"
      :show="showProjectList"
      @close="handleClosePopup('showProjectList')"
      @submit="handleSubmitProjects"
    />
    <PopupEditProjectsLaborHours
      ref="PopupEditProjectsLaborHoursRef"
      :show="showEditLaborHours"
      :target="editedTarget"
      :laborHoursDayList="laborHoursDayList"
      :activeDateIndex="activeDateIndex"
      @close="handleClosePopup('showEditLaborHours')"
      @refresh="getInitData"
    />
    <van-dialog
      class="dialog"
      :show="vanDialog.show"
      :title="vanDialog.title"
      :message="vanDialog.message"
      :confirm-button-color="'#F85B47'"
      :confirm-button-text="'确定'"
      :cancel-button-text="'取消'"
      :show-cancel-button="true"
      @confirm="handleConfirmDelete"
      @cancel="handleVanDialogCancel"
    >
    </van-dialog>
    <Calendar
      ref="calendarRef"
      :show="showCalendar"
      :laborHoursDayList="laborHoursDayList"
      :activeDateIndex="activeDateIndex"
      @close="closCalendar"
      @confirm="confirmCalendar"
    />
    <van-notify ref="vanNotifyref" id="van-notify" />
  </scroll-view>
</template>

<script>
import { defineComponent } from 'vue';
import ProjectTargetList from './components/ProjectTargetList/ProjectTargetList.vue';
import ProjectsLaborHoursItem from './components/ProjectsLaborHoursItem/ProjectsLaborHoursItem.vue';
import PopupEditProjectsLaborHours from './components/PopupEditProjectsLaborHours/PopupEditProjectsLaborHours.vue';
import Calendar from './components/Calendar/Calendar.vue';
import {
  countByMonth,
  getProjectsByDate,
  saveWorkingHour,
  countByDate,
  declareMonth,
  multiplex,
  deleteWorkingHours
} from './assets/js/api.js';
import {
  getCurrentMonth,
  getCurrentDate,
  daysInMonth,
  addZero,
} from './assets/js/useHook.js';
import Loading from '../../components/loading/loading.vue';

export default defineComponent({
  name: 'home',
  components: {
    Loading,
    ProjectsLaborHoursItem,
    PopupEditProjectsLaborHours,
    ProjectTargetList,
    Calendar,
  },
  data() {
    return {
      // 当前选中的日期 默认：今天 (因为这个字段存的是下标，所以要-1)
      activeDateIndex: new Date().getDate() - 1,
      // van-dialog 弹窗配置
      vanDialog: {
        title: '提示',
        message: '是否撤销本日工时填报',
        show: false,
      },
      // 加载中
      isLoading: true,
      // 显示日历
      showCalendar: false,
      // 重新申报
      showEditLaborHours: false,
      // 打开弹窗默认显示的层级 project || target
      defaultModule: 'project',
      // 显示项目列表
      showProjectList: false,
      // 有申报数据的月份：年+月+日
      monthsList: [],
      // 当前选中的月份，数据来自monthsList
      activeMonth: {},
      // 工时统计
      statistics: {
        attendanceDay: 22, // 出勤天数
        notDeclaredDays: '-', // 未申报天数
        totalWorkingHours: 0, // 总工时
        feedback: 0, // 已反馈
        noFeedback: 0, // 待反馈
        returned: 0, // 已退回
        workingHoursStatistics: [
          {
            code: 'attendanceDay',
            name: '出勤天数',
          },
          {
            code: 'notDeclaredDays',
            name: '未申报天数',
          },
          {
            code: 'totalWorkingHours',
            name: '总工时',
          },
        ],
        // 反馈统计
        feedbackStatistics: [
          {
            code: 'feedback',
            name: '已反馈',
          },
          {
            code: 'noFeedback',
            name: '待反馈',
          },
          {
            code: 'returned',
            name: '已退回',
          },
        ],
      },
      // 选中月份的日期
      laborHoursDayList: [],
      // 当前申报数据
      currentLaborHours: {
        year: new Date().getFullYear(),
        month: addZero(new Date().getMonth() + 1),
        day: addZero(new Date().getDate()),
        state: null, // 状态
        totalTimeConsuming: '-',
      },
      // 选中的项目
      selectedProjects: [],
      // 选中的项目id
      selectedProjectsId: [],
      // 选中的项目的目标id
      selectedProjectTargetsId: [],
      // 我的项目
      myProjectList: [],
      // 已填工时
      totalHours: 0,
      // 今日日期的数据
      todayDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        days: daysInMonth(new Date().getFullYear(), new Date().getMonth() + 1),
      },
      // 被编辑的目标
      editedTarget: null,
      // 被编辑的目标下标
      editedTargetIndex: 0,
      // 是否有申报数据
      isHasDeclareData: false,
    };
  },
  watch: {},
  computed: {
    // 是否申报
    isShowDeclareBtn() {
      // 未申报的数据
      let undeclareNumber = 0;
      // 没有item.workingHour.id就是未申报过的数据
      if (this.myProjectList.length > 0) {
        this.myProjectList.forEach((el) => {
          undeclareNumber += el.projectThirdTargets.filter(
            (item) => !item.workingHour || !item.workingHour.id
          ).length;
        });
      }
      return undeclareNumber > 0;
    },
  },
  onLoad() {},
  onShow() {},
  mounted() {
    this.getInitData();
    this.getDeclareMonth(); // 获取有工时申报的月份
  },
  methods: {
    /**
     * @description 删除项目
     */
    async handleDeleteProjects() {
      // 未申报的不可删除
      if (this.laborHoursDayList[this.activeDateIndex].state !== 1) {
        return;
      }
      this.vanDialog.show = true;
    },

    /**
     * @description 确认删除
     */
    async handleConfirmDelete() {
      const data = this.getRequestData();
      const ids = data.map((el) => el.id).filter((el) => el);
      const result = await deleteWorkingHours(ids)
      if (result.data.code === 200) {
        wx.showToast({
          title: '撤销成功',
          icon: 'success',
        });
        // 获取初始数据
        this.getInitData();
        this.vanDialog.show = false;
      }
    },

    /**
     * @description 复用
     */
    async handleReuse() {
      // 只有历史存在申报数据和今日未提交的状态，才可点击服用按钮
      if (
        !(
          this.isHasDeclareData &&
          !this.laborHoursDayList[this.activeDateIndex].state
        )
      ) {
        return;
      }
      const date = `${this.currentLaborHours.year}-${this.currentLaborHours.month}-${this.currentLaborHours.day}`;
      const result = await multiplex(date);
      if (result.data.code === 200) {
        const { data } = result.data;
        if (data && data.length > 0) {
          this.myProjectList = data.map((el) => ({
            ...el,
            projectThirdTargets: el.projectThirdTargets.map((el2) => ({
              ...el2,
              workingHour: {
                ...el2.workingHour,
                id: null, // 清空id
                state: 1, // 状态改为待反馈
              },
            })),
          }));
          wx.showToast({
            title: '复用成功',
            icon: 'success',
          });
        }
      } else {
      }
    },
    /**
     * @description 设置默认的申报月份
     */
    setDefaultDeclareMonth() {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      // 测试数据
      this.monthsList = [
        {
          year: month === 12 || month === 1 || month === 2 ? year - 1 : year,
          month: month === 1 ? 11 : month === 2 ? 12 : month - 2,
          dayList: [],
        },
        {
          year: month === 12 || month === 1 ? year - 1 : year,
          month: month === 1 ? 12 : month - 1,
          dayList: [],
        },
        {
          year: year,
          month: month,
          dayList: [],
        },
      ];
      this.activeMonth = this.monthsList[this.monthsList.length - 1];
      this.getLaborHoursDayList();
    },
    /**
     * @description 获取有工时申报的月份
     */
    async getDeclareMonth() {
      const result = await declareMonth();
      if (result.data.code === 200) {
        this.monthsList =
          result.data.data && result.data.data.length > 0
            ? result.data.data.map((el) => ({
                ...el,
                dayList: [],
              }))
            : [];
        if (this.monthsList.length > 0) {
          // 是否有申报数据
          this.isHasDeclareData = true;
          this.activeMonth = this.monthsList[this.monthsList.length - 1];
          this.getLaborHoursDayList();
        } else {
          this.isHasDeclareData = false;
          this.setDefaultDeclareMonth();
        }
      } else {
        this.isHasDeclareData = false;
        this.setDefaultDeclareMonth();
      }
    },
    /**
     * @description 跳转到工时申报
     */
    toLaborHourStatistics() {
      wx.navigateTo({
        url: '/pages/LaborHourStatistics/LaborHourStatistics',
      });
    },
    /**
     * @description 切换月份
     */
    handleToggleMonth(item) {
      this.laborHoursDayList = item.dayList;
      this.activeDateIndex = this.laborHoursDayList.length - 1; // 默认到每月最后一天
      this.activeMonth = item;
      this.handleCountByMonth(); // 根据月份获取工时申报统计
    },
    /**
     * @description 左右切换日期
     */
    handleToggleDay(type) {
      // 上一个
      if (type === 'last') {
        if (this.activeDateIndex >= 1) {
          this.activeDateIndex -= 1;
        }
      } else {
        // 下一个
        if (this.activeDateIndex < this.laborHoursDayList.length - 1) {
          this.activeDateIndex += 1;
        }
      }
    },
    /**
     * @description 切换日期触发
     */
    handleSwiperChange(event) {
      this.activeDateIndex = event.detail.current;
      this.currentLaborHours = this.laborHoursDayList[event.detail.current];
      this.getInitData();
    },
    /**
     * @description 获取时间列表
     */
    getLaborHoursDayList() {
      this.laborHoursDayList = [];
      // 本月
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const days = daysInMonth(year, month);
      for (let i = 1; i <= days; i++) {
        if (i <= day) {
          this.laborHoursDayList.push({
            year,
            month: addZero(month),
            day: addZero(i),
            state: null, // 状态
            totalTimeConsuming: '-',
          });
        }
      }
      this.activeDateIndex = this.laborHoursDayList.length - 1;
      // monthsList 循环赋值 dayList
      this.monthsList = this.monthsList.map((el) => {
        let dayList = [];
        if (el.month !== month) {
          const days2 = daysInMonth(el.year, el.month);
          for (let i = 1; i <= days2; i++) {
            dayList.push({
              year: el.year, // 年
              month: addZero(el.month), // 月
              day: addZero(i), // 日
              state: null, // 状态
              totalTimeConsuming: '-', // 总耗时
            });
          }
        }
        return el.month !== month
          ? {
              year: el.year, // 年
              month: el.month, // 月
              dayList,
            }
          : {
              year: el.year, // 年
              month: el.month, // 月
              dayList: this.laborHoursDayList,
            };
      });
      this.handleCountByDate();
    },
    /**
     * @description 移除项目
     */
    handleRemoveProject(index) {
      this.myProjectList.splice(index, 1);
      this.countTotalHours();
      wx.showToast({
        title: '移除项目成功',
        icon: 'success',
      });
    },
    /**
     * @description 删除三级目标
     * @param projectIndex 项目下标
     * @param targetIndex 目标下标
     */
    handleDeleteThirdTarget([projectIndex, targetIndex]) {
      // 删除前将myProjectList数据更新
      this.myProjectList[projectIndex] = this.$refs[`projectsLaborHoursItemRef`][
        projectIndex
      ].getProjectThirdTargets();
      setTimeout(() => {
        this.myProjectList[projectIndex].projectThirdTargets.splice(
          targetIndex,
          1
        );
        this.countTotalHours();
        wx.showToast({
          title: '移除目标成功',
          icon: 'success',
        });
      });
    },
    /**
     * @description 添加三级目标
     */
    handleAddThirdTarget(item) {
      this.defaultModule = 'target';
      this.showProjectList = true;
      const selectedData = {
        project: {
          id: item.id,
          projectName: item.projectName,
        },
        thirdTargets: item.projectThirdTargets,
      };
      this.$refs.projectTargetList.setData(selectedData, 'target');
    },
    /**
     * @description van-dialog cancel 方法
     */
    handleVanDialogCancel() {
      this.vanDialog.show = false;
    },
    closedFunction() {
      wx.showToast({
        title: '功能暂未开放',
        icon: 'none',
      });
    },
    /**
     * @description 计算总工时
     */
    countTotalHours() {
      let totalHours = 0;
      this.myProjectList.forEach((el) => {
        el.projectThirdTargets.forEach((el2) => {
          totalHours += el2.workingHour.timeConsuming
        })
      })
      this.totalHours = totalHours;
    },
    /**
     * @description 更新工时
     */
    handleUpdateWorkingHour(index) {
      this.myProjectList[index] = this.$refs[`projectsLaborHoursItemRef`][
        index
      ].getProjectThirdTargets();
      // 计算总工时
      this.countTotalHours();
      if (this.totalHours > 24) {
        wx.showToast({
          title: '申报的工时超出24小时',
          icon: 'none',
        });
      }
    },
    /**
     * @description 生成保存接口的请求数据
     */
    getRequestData() {
      let data = [];
      this.myProjectList.forEach((item, index) => {
        item =
          this.$refs[`projectsLaborHoursItemRef`][
            index
          ].getProjectThirdTargets();
        const result = item.projectThirdTargets.map((el) => ({
          id: el.workingHour.id, // 工时id
          projectId: el.projectId, // 项目id
          thirdTargetId: el.id, // 目标id
          achievement: el.workingHour.achievement, // 工作内容
          timeConsuming: el.workingHour.timeConsuming, // 耗时
          selfAssessment: el.workingHour.selfAssessment, // 自评
          fallInTime: `${this.laborHoursDayList[this.activeDateIndex].year}-${
            this.laborHoursDayList[this.activeDateIndex].month
          }-${this.laborHoursDayList[this.activeDateIndex].day}`, // 填报时间
          picIds: el.workingHour.picIds || [],
          state: el.workingHour.id ? el.workingHour.state : null, // 新增不传，编辑时传
          reviewContactorId: el.mailContactorVO.id || '', // 审批人id
        }));
        data = data.concat(result);
      });
      return data;
    },
    /**
     * @description 获取初始数据
     */
    getInitData() {
      this.totalHours = 0;
      this.handleCountByMonth(); // 根据月份获取工时申报统计
      this.handleGetProjectsByDate(); // 根据日期查询工时申报
      this.handleCountByDate(); // 获取所选日期的总工时和状态
    },
    closCalendar() {
      this.showCalendar = false;
    },
    /**
     * @description 日历-确定
     */
    confirmCalendar(val) { 
      const date = new Date(val);
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate();
      // 如果是本月
      if (this.laborHoursDayList[0].year === year && Number(this.laborHoursDayList[0].month) === month) {
        this.activeDateIndex = day - 1;
      } else {
        // 非本月
        const monthsList = this.monthsList.map((el) => `${el.year}-${el.month}`);
        if (monthsList.includes(`${year}-${month}`)) {
          // 查询index
          const index = monthsList.findIndex((el) => el === `${year}-${month}`);
          // 切换到日历选中的月份
          this.laborHoursDayList = this.monthsList[index].dayList;
          this.activeDateIndex = day - 1;
          this.activeMonth = this.monthsList[index]; // 当前激活月
          this.handleCountByMonth(); // 根据月份获取工时申报统计
        }
      }
      this.showCalendar = false;
    },
    /**
     * @description 获取所选日期的总工时和状态
     */
    async handleCountByDate() {
      const date = `${this.currentLaborHours.year}-${this.currentLaborHours.month}-${this.currentLaborHours.day}`;
      const result = await countByDate(date);
      // console.log('获取所选日期的总工时和状态', result);
      if (result.data.code === 200) {
        const { totalTimeConsuming, state } = result.data.data;
        if (this.laborHoursDayList.length > 0) {
          // 耗时
          this.laborHoursDayList[this.activeDateIndex].totalTimeConsuming =
            totalTimeConsuming || 0;
          // 状态
          this.laborHoursDayList[this.activeDateIndex].state = state;
          this.currentLaborHours = this.laborHoursDayList[this.activeDateIndex];
        }
      } else {
        // this.$refs.vanNotifyref.setData({
        //   type: 'danger',
        //   message:
        //     result.data.message || result.data.msg || '获取总工时和状态失败',
        //   show: true,
        // });
        wx.showToast({
          title: '获取数据失败',
          icon: 'error',
        });
      }
    },
    /**
     * @description 显示日历
     */
    handleShowCalendar() {
      this.$refs.calendarRef.enableMonthList = this.monthsList;
      this.showCalendar = true;
    },
    /**
     * @description 根据月份获取工时申报统计
     */
    async handleCountByMonth() {
      const month = `${this.currentLaborHours.year}-${this.currentLaborHours.month}`;
      const result = await countByMonth(month);
      // console.log('根据月份获取工时申报统计', result);
      if (result.data.code === 200) {
        if (!result.data.data) {
          this.statistics.totalWorkingHours = 0;
          this.statistics.feedback = 0;
          this.statistics.noFeedback = 0;
          this.statistics.returned = 0;
          return;
        }
        const { totalWorkingHours, feedback, noFeedback, returned } =
          result.data.data;
        this.statistics.totalWorkingHours = totalWorkingHours || '-';
        this.statistics.feedback = feedback || 0;
        this.statistics.noFeedback = noFeedback || 0;
        this.statistics.returned = returned || 0;
      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: 'error',
        });
        // this.$refs.vanNotifyref.setData({
        //   type: 'danger',
        //   message:
        //     result.data.message || result.data.msg || '获取工时申报统计失败',
        //   show: true,
        // });
        this.statistics.totalWorkingHours = 0;
        this.statistics.feedback = 0;
        this.statistics.noFeedback = 0;
        this.statistics.returned = 0;
      }
    },
    /**
     * @description 根据日期查询工时申报
     */
    async handleGetProjectsByDate() {
      this.isLoading = true;
      const date = `${this.currentLaborHours.year}-${this.currentLaborHours.month}-${this.currentLaborHours.day}`;
      const result = await getProjectsByDate(date);
      // console.log('根据日期查询工时申报', result);
      if (result.data.code === 200) {
        this.myProjectList = result.data.data.map((el) => ({
            ...el,
            projectThirdTargets: el.projectThirdTargets.map((el2) => ({
              ...el2,
              workingHour: el2.workingHour || {
                id: '', // 工时id
                projectId: el2.projectId, // 项目id
                thirdTargetId: '', // 目标id
                achievement: '', // 工作内容
                timeConsuming: 0, // 耗时
                selfAssessment: 4, // 自评
                taskCompletion: 0, // 任务完成度
                taskSatisfaction: 0, // 任务满意度
                workEfficiency: 0, // 工作效率
                reviewComment: '', // 审核意见
                reviewContactorId: '', // 审核人id
                fallInTime: '', // 填报时间
                state: null, // 状态（1：待反馈，2：已反馈，3：已退回）（新增可不传）
                picIds: [], // 图片id数组
                attachments: [], // 图片
              }, // workingHour 为null说明是空表单，就要赋予初始值,
            })),
          }));
        this.isLoading = false;
      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: 'error',
        });
        // this.$refs.vanNotifyref.setData({
        //   type: 'danger',
        //   message: result.data.message || result.data.msg || '获取数据失败',
        //   show: true,
        // });
        this.myProjectList = [];
        this.isLoading = false;
      }
    },
    // 页面跳转
    handleNavigate(event) {
      wx.navigateTo({
        url: event.currentTarget.dataset.redirectto,
      });
    },
    /**
     * @description 重新申报
     */
    handleDeclareAgain([val, index]) {
      this.showEditLaborHours = true;
      this.editedTarget = val;
      this.editedTargetIndex = index;
    },
    /**
     * @description 关闭重新申报弹窗
     */
    handleClosePopup(show) {
      this[`${show}`] = false;
      if (show === 'showEditLaborHours') {
        setTimeout(() => {
          this.editedTarget = {}; // 初始化，不然重新申报的数据会有问题
        }, 200);
      }
    },
    /**
     * @description 添加项目
     */
    handleAddProjects() {
      this.defaultModule = 'project';
      this.showProjectList = true;
      if (this.myProjectList.length > 0) {
        const selectedData = this.myProjectList.map((el) => ({
          project: {
            id: el.id,
            projectName: el.projectName,
          },
          thirdTargets: el.projectThirdTargets.map((item) => item.id),
        }));
        this.$refs.projectTargetList.selectedProjects = selectedData;
        this.$refs.projectTargetList.setData({}, 'project');
      } else {
        this.$refs.projectTargetList.selectedProjects = [];
        this.$refs.projectTargetList.setData({}, 'project');
        this.$refs.projectTargetList.handleGetProjectList()
      }
    },
    /**
     * @description 获取选中的项目
     */
    handleSubmitProjects(val) {
      // 添加前将myProjectList数据更新
      this.myProjectList = this.myProjectList.map((item, index) => {
        return this.$refs[`projectsLaborHoursItemRef`][
          index
        ].getProjectThirdTargets();
      })
      const projectData = {
        fallInTime: null,
        id: val.project.id,
        projectName: val.project.projectName,
        projectThirdTargets: val.thirdTargets.map((el) => ({
          firstTargetId: el.firstTargetId,
          id: el.id,
          projectId: val.project.id,
          secondTargetId: el.secondTargetId,
          thirdTargetName: el.thirdTargetName,
          workingHour: {
            id: '', // 工时id
            projectId: val.project.id, // 项目id
            thirdTargetId: '', // 目标id
            achievement: '', // 工作内容
            timeConsuming: 0, // 耗时
            selfAssessment: 4, // 自评
            taskCompletion: 0, // 任务完成度
            taskSatisfaction: 0, // 任务满意度
            workEfficiency: 0, // 工作效率
            reviewComment: '', // 审核意见
            reviewContactorId: '', // 审核人id
            fallInTime: '', // 填报时间
            state: null, // 状态（1：待反馈，2：已反馈，3：已退回）（新增可不传）
            picIds: [], // 图片id数组
            attachments: [], // 图片
          }, // workingHour 为null说明是空表单，就要赋予初始值,,
          mailContactorVO: el.mailContactorVO,
        })),
      };
      if (this.myProjectList.length > 0) {
        const index = this.myProjectList.findIndex(
          (el) => el.id === projectData.id
        );
        // 如果 myProjectList 中已存在该项目了，则判断是否有选中的项目，没有就添加，有就不需要处理。
        if (index > -1) {
          projectData.projectThirdTargets.forEach((item, index2) => {
            const targetIndex = this.myProjectList[
              index
            ].projectThirdTargets.findIndex((el) => el.id === item.id);
            if (targetIndex === -1) {
              this.myProjectList[index].projectThirdTargets.push(
                projectData.projectThirdTargets[index2]
              );
            }
          });
        } else {
          this.myProjectList.push(projectData);
        }
      } else {
        this.myProjectList.push(projectData);
      }
    },
    /**
     * @description 申报工时
     */
    async handleSaveWorkingHour() {
      if (this.myProjectList.length === 0) {
        return;
      }
      const data = this.getRequestData();
      console.log('提交数据拉', data);
      if (data.length === 0) {
        wx.showToast({
          title: '请添加目标',
          icon: 'error',
        });
        return;
      }
      let errorData = data.filter((el) => {
        if (!el.achievement || !el.selfAssessment || !el.timeConsuming) {
          return el;
        }
      });
      // 提交，提交需至少存在一个项目，且该项目至少存在一个动作，且该动作的必填项已完成填报后才可提交，否则统一提示用户“请填报完整申报单”
      if (errorData.length > 0) {
        wx.showToast({
          title: '请正确填报',
          icon: 'error',
        });
        return;
      }
      const result = await saveWorkingHour(data);
      if (result.data.code === 200) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
        });
        // 获取初始数据
        this.getInitData();
      } else {
        wx.showToast({
          title: result.data.message || result.data.msg || '保存失败',
          icon: 'error',
        });
        // this.$refs.vanNotifyref.setData({
        //   type: 'danger',
        //   message: result.data.message || result.data.msg || '保存失败',
        //   show: true,
        // });
      }
    },
  },
});
</script>
<style lang="less">
@import './components/Calendar/styles/calendar.less';

.laborHourReport {
  .main__add-projects__center {
    display: flex;
    align-items: center;
    button:nth-child(1) {
      border-right: 1rpx solid #F5F5F5;
    }
    button {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
  .submit-button {
    width: 290rpx;
    height: 100%;

    button {
      width: 100%;
      height: 100%;
      font-size: 36rpx;
      font-weight: 500;
      color: #ffffff;
      line-height: 42rpx;
    }

    &--disabled {
      button {
        border: 1rpx solid #cccccc;
        background: #cccccc;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import './assets/styles/laborHourReport.less';
</style>

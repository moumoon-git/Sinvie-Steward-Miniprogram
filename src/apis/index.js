import request from '../utils/request/request.js';

export const demo = (data) => {
  const requestData = {
    openId: wx.getStorageSync('openId'),
    ...data,
  };
  return request.post({
    url: '',
    data: requestData,
  });
};

// 当前项目所有人员工时审核
export async function getExamineByAllApi(requestData) {
  // const requestData = {
  //   projectId: 2,
  //   state: 1,
  //   yearMonth: '2022-08-05',
  // };
  try {
    const response = await request.post({
      url: '/steward-manage/working/working-hour/getExamineByAll',
      data: requestData,
    });

    if (response.data.code === 200) {
      return response.data.data;
    }
    throw response.message;
  } catch (error) {
    wx.showToast({
      title: error,
      icon: 'error',
      duration: 1000,
    });
  }
}

// 当前项目所有人员工时审核
export async function getFeedbackDetailsApi({
  contactorId,
  projectId,
  fillingTime,
  submitMember,
  state,
}) {
  const requestData = {
    contactorId,
    projectId,
    state,
    fillingTime,
    submitMember,
  };
  try {
    const response = await request.post({
      url: '/steward-manage/working/working-hour/feedbackDetails',
      data: requestData,
    });

    if (response.data.code === 200) {
      return response.data.data;
    }
    throw response.message;
  } catch (error) {
    wx.showToast({
      title: error,
      icon: 'error',
      duration: 1000,
    });
  }
}

// 当前项目所有人员工时审核
export async function submitFeedBackApi(requestData, cb) {
  try {
    const response = await request.post({
      url: '/steward-manage/working/working-hour/updateState',
      data: requestData,
    });

    if (response.data.code === 200) {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 1000,
      });
      cb();
      return response.data.data;
    }
    throw response.message;
  } catch (error) {
    wx.showToast({
      title: error,
      icon: 'error',
      duration: 1000,
    });
  }
}

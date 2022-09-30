import request from '../../../..//utils/request/request';

// 【工时申报】-根据月份获取工时申报统计
export const countByMonth = (month) => {
  const requestData = {
    month,
  };
  return request.post({
    url: '/steward-manage/working/working-hour/countByMonth',
    data: requestData,
    method: 'get',
  });
};

// 【工时申报】-根据日期查询工时申报
export const getProjectsByDate = (date) => {
  const requestData = {
    date,
  };
  return request.post({
    url: '/steward-manage/working/working-hour/getByDate',
    data: requestData,
    method: 'get',
  });
};

// 【工时申报】-工时申报
export const saveWorkingHour = (workingHours) => {
  return request.post({
    url: '/steward-manage/working/working-hour/save',
    data: workingHours,
    method: 'post',
  });
};

// 【工时申报】-获取所选日期的总工时和状态
export const countByDate = (date) => {
  const requestData = {
    date,
  };
  return request.post({
    url: '/steward-manage/working/working-hour/countByDate',
    data: requestData,
    method: 'get',
  });
};

// 申报记录
export const recordByState = (data) => {
  return request.post({
    url: '/steward-manage/working/working-hour/recordByState',
    data: data,
    method: 'get',
  });
};

// 项目分组返回树形结构
export const getProjectList = () => {
  return request.post({
    url: '/steward-manage/project/commonUseThirdTarget/common/project/list',
    method: 'post',
  });
};

// 根据项目获取三级目标
export const getThirdTargets = (projectId) => {
  return request.post({
    url: `/steward-manage/project/commonUseThirdTarget/common/project/target/list?projectId=${projectId}`,
    method: 'get',
  });
};

// 根据项目获取一级二级三级目标
export const getTargets = (projectId) => {
  return request.post({
    url: `/steward-manage/project/commonUseThirdTarget/common/project/target/v2/list?projectId=${projectId}`,
    method: 'get',
  });
};


// 添加收藏项目和目标
export const addCollect = (data) => {
  return request.post({
    url: `/steward-manage/project/commonUseThirdTarget/collectItemOrAction`,
    data,
    method: 'post',
  });
};

// 移除收藏项目
export const removeCollectProject = (data) => {
  return request.post({
    url: '/steward-manage/project/commonUseThirdTarget/deleteItem',
    data,
    method: 'post',
  });
};

// 移除收藏目标
export const removeCollectTarget = (data) => {
  return request.post({
    url: '/steward-manage/project/commonUseThirdTarget/deleteAction',
    data,
    method: 'post',
  });
};

// 多文件上传
export const uploadFile = (upfileList) => {
  return request.post({
    url: '/steward-manage/minio/fileList',
    data: {
      upfileList
    },
    method: 'post',
  });
};

// 获取有工时申报的月份
export const declareMonth = () => {
  return request.post({
    url: '/steward-manage/working/working-hour/declareMonth',
    method: 'get',
  });
};

// 获取所选月份的每日审批状态
export const dailyState = (month) => {
  const requestData = {
    month,
  };
  return request.post({
    url: '/steward-manage/working/working-hour/dailyState',
    method: 'get',
    data: requestData
  });
};

// 复用上一次工时申报
export const multiplex = (date) => {
  const requestData = {
    date,
  };
  return request.post({
    url: '/steward-manage/working/working-hour/multiplex',
    method: 'get',
    data: requestData
  });
};

// 根据月份获取每日填报工时
export const getDailyWorkingHours = (month) => {
  const requestData = {
    month,
  };
  return request.post({
    url: '/steward-manage/working/working-hour/getDailyWorkingHours',
    method: 'get',
    data: requestData
  });
};

// 删除填报工时
export const deleteWorkingHours = (ids) => {
  return request.post({
    url: '/steward-manage/working/working-hour/delete',
    method: 'post',
    data: ids
  });
};








import request from '../../../..//utils/request/request';

// 【工时统计】-根据月份对各项目进行工时统计
export const getStatistics = (month) => {
  const requestData = {
    month,
  };
  return request.post({
    url: '/steward-manage/working/working-hour/statistics',
    data: requestData,
    method: 'get',
  });
};


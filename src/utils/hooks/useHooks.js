import { GD2Address } from '@/utils/utils.js';
import store from '@/store';
import config from '@/static/config/index.js';
/**
 * 串行实现异步的compose 我试验了好久 没想到参数里可以用await
 * @date 2021-11-23
 * @param {any} args fn传参的通用参数，格式需要放在最后以对象形式传{request}
 * @param {any} firstParams 初始参数
 * @param {any} ...fn 步骤函数
 * @returns {any}
 */
export const compose = ({ firstParams, ...args }, ...fn) => () =>
  fn.reduce(
    async (acc, cur) => await cur(await acc, { ...args }),
    Promise.resolve(firstParams)
  );

export const lazyCompose = (...fn) =>
  fn.reduce((acc, cur) => {
    return async (...args) => acc(await cur(...args));
  });

const loginCompose = lazyCompose(getUserInfoByOpenId, getOpenId);

// 登录主容器
export const useLogin = (request) => {
  return new Promise((resolve) => {
    // 登录验证
    wx.login({
      success: async (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log('wx.login res', res);
          // 先组合登录流程的compose
          // const process = await compose(
          //   {
          //     firstParams: res.code,
          //     request,
          //     // getOpenId函子的cb
          //     getOpenIdCallBack: (payload) => {
          //       wx.setStorageSync('userKeyWord', JSON.stringify(payload));
          //       wx.setStorageSync('openId', payload.openid);
          //     },
          //     // getUserInfoByOpenId函子的cb
          //     getUserInfoByOpenIdCallBack: (payload) => {
          //       wx.setStorageSync('token', payload.token);
          //       wx.setStorageSync('platformId', payload.platformId);
          //       wx.setStorageSync('userId', payload.data.id);
          //       wx.setStorageSync('invitation', payload.data.invitation);

          //       store.commit('SET_USER_INFO', {
          //         userName: payload.data.name,
          //         role: payload.data.mailGovernmentAgencyEntity
          //           ? payload.data.mailGovernmentAgencyEntity.name
          //           : '',
          //         avatar: payload.data.images,
          //       });
          //     },
          //   },
          //   getOpenId,
          //   getUserInfoByOpenId
          // );
          const userInfo = await loginCompose({
            code: res.code,
            request,
            // getOpenId函子的cb
            getOpenIdCallBack: (payload) => {
              wx.setStorageSync('userKeyWord', JSON.stringify(payload));
              wx.setStorageSync('openId', payload.openid);
            },
            // getUserInfoByOpenId函子的cb
            getUserInfoByOpenIdCallBack: (payload) => {
              wx.setStorageSync('token', payload.token);
              wx.setStorageSync('platformId', payload.platformId);
              wx.setStorageSync('userId', payload.data.id);
              wx.setStorageSync('invitation', payload.data.invitation);
              store.commit('SET_USER_INFO', {
                userName: payload.data.name,
                role: payload.data.mailGovernmentAgencyEntity
                  ? payload.data.mailGovernmentAgencyEntity.name
                  : '',
                avatar: payload.data.images,
                isOutreach: payload.data.isOutreach,
              });
            },
          });
          console.log(
            '%c [ userInfo ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            userInfo
          );
          resolve(userInfo);
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      },
    });
  });
};

// 1. 获取openId
async function getOpenId({
  code,
  request,
  getOpenIdCallBack,
  getUserInfoByOpenIdCallBack,
}) {
  const res = await request.get({
    url: '/sys/getOpenId',
    data: {
      code,
      key: config.secretKey,
    },
  });
  if (res.data.code === 0) {
    getOpenIdCallBack(res.data.data);
    return {
      openId: res.data.data.openid,
      request,
      getUserInfoByOpenIdCallBack,
    };
  }
  wx.showToast({
    title: res.data.msg,
    icon: 'error',
  });
  return null;
}

// 2. 获取用户信息
async function getUserInfoByOpenId({
  openId,
  request,
  getUserInfoByOpenIdCallBack,
}) {
  const res = await request.post({
    url: '/sys/wxLogin',
    data: {
      openId,
    },
  });
  if (res.data.code === 0) {
    getUserInfoByOpenIdCallBack(res.data);
    return res.data.data;
  }

  return null;
}

// 获取定位及位置信息
/**
 * 描述
 * @date 2021-11-30
 * @returns {any} { longitude, latitude, address }
 * ```js
 * const { longitude, latitude, address } = await getLocation();
 * ```
 */
export const getLocation = async (isGcj02 = false) => {
  const process = compose({ firstParams: isGcj02 }, getWxLocation, getAddress);
  return process();
};

// 1. 调用微信定位获取当前定位信息
function getWxLocation(isGcj02 = false) {
  return new Promise((resolve) => {
    uni.getLocation({
      type: isGcj02 ? 'gcj02' : 'wgs84',
      geocode: true,
      altitude: true,
      success: (res) => {
        console.log(
          '%c [ 定位 ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          res
        );
        resolve({
          longitude: res.longitude,
          latitude: res.latitude,
          isGcj02,
        });
      },
      fail: (res) => {
        resolve({
          longitude: null,
          latitude: null,
          isGcj02,
        });
        wx.showToast({
          title: '获取位置信息失败，无法提交！',
          icon: 'none',
        });
        console.log('fail', res);
      },
      complete: () => {},
    });
  });
}

// 2. 调用高德逆地理解析
async function getAddress({ longitude, latitude, isGcj02 }) {
  const address = await GD2Address({ longitude, latitude, isGcj02 }, () => {});
  return {
    longitude,
    latitude,
    address,
  };
}

// 获取腾讯 步行路线规划
export function getDirection({ from, to }) {
  return new Promise((resolve) => {
    // 84的坐标需要转换成gcj02 因为逆地理编码不支持84
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/walking/?from=${from.latitude},${from.longitude}&to=${to.latitude},${to.longitude}&key=${config.TXKey}`,
      method: 'GET',
      success: (res) => {
        // console.log(res, '地址');
        let polyline = res.data.result.routes[0].polyline;

        // 坐标解压
        for (let index = 2; index < polyline.length; index++) {
          polyline[index] = polyline[index - 2] + polyline[index] / 1000000;
        }

        // 重组为经纬度对象 方便路线直接使用
        let rePolyline = [];
        for (let index = 0; index < polyline.length; index += 2) {
          rePolyline.push({
            latitude: polyline[index],
            longitude: polyline[index + 1],
          });
        }

        // 添加起点终点经纬度
        rePolyline.unshift({
          latitude: from.latitude,
          longitude: from.longitude,
        });
        rePolyline.push({
          latitude: to.latitude,
          longitude: to.longitude,
        });

        resolve(rePolyline);
      },
      fail: (res) => {
        console.log(res);
      },
    });
  });
}

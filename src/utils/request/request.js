import config from '@/static/config/index.js';

const requestNormal = {
  get,
  post,
};

const request = ({
  baseUrl = '',
  url = '',
  data = {},
  header = {},
  method = '',
} = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl ? baseUrl + url : config.baseUrl + url,
      data,
      header,
      method,
      success: (res) => {
        // if (res.data.errorcode === 401) {
        //   wx.showModal({
        //     title: '没有权限',
        //     content: '是否需要登录？',
        //     success(res) {
        //       if (res.confirm) {
        //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        //         // updateManager.applyUpdate()
        //         console.log(
        //           '%c [ xxx ]',
        //           'font-size:13px; background:pink; color:#bf2c9f;',
        //           request
        //         );
        //         useLogin(requestNormal).then((userInfo) => {
        //           if (!userInfo) {
        //             return;
        //           }
        //           // 刷新页面
        //           getCurrentPages()[getCurrentPages().length - 1].onLoad();
        //         });
        //       }
        //     },
        //   });
        // } else {
        //   resolve(res);
        // }
        resolve(res);
      },
      fail: (res) => reject(res),
    });
  });
};

// get方法
function get({
  baseUrl = '',
  url = '',

  data = {},
  header = {
    'content-type': 'application/x-www-form-urlencoded',
  },
  method = 'GET',
} = {}) {
  return request({
    baseUrl,
    url,
    data,
    header: Object.assign(header, { satoken: wx.getStorageSync('satoken') }),
    method,
  });
}

function post({
  baseUrl = '',
  url = '',
  data = {},
  header = {
    'content-type': 'application/json',
  },
  method = 'POST',
} = {}) {
  return request({
    baseUrl,
    url,
    data,
    header: Object.assign(header, { satoken: wx.getStorageSync('satoken') }),
    method,
  });
}

export default requestNormal;

import config from '@/static/config/index.js';
import { wgs84togcj02 } from '@/utils/mapTransformApi.js';
// 高德地图经纬度转地址
export function GD2Address({ longitude, latitude, isGcj02 }, cb) {
  return new Promise((resolve) => {
    // 84的坐标需要转换成gcj02 因为逆地理编码不支持84
    if (!isGcj02) {
      let [mglng, mglat] = wgs84togcj02(longitude, latitude);
      longitude = mglng;
      latitude = mglat;
    }
    wx.request({
      url: `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${config.GDKey}&radius=1000&extensions=base`,
      method: 'GET',
      success: (res) => {
        console.log(res, '地址');
        cb(res.data.regeocode.formatted_address);
        resolve(res.data.regeocode.formatted_address);
      },
      fail: (res) => {
        console.log(res);
      },
    });
  });
}

// 计算2个经纬度的直线距离 km
export function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = (lat1 * Math.PI) / 180.0;
  var radLat2 = (lat2 * Math.PI) / 180.0;
  var a = radLat1 - radLat2;
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  s = s.toFixed(2); //保留两位小数
  // console.log('经纬度计算的距离:' + s);
  return s;
}

//格式化起始时间结束时间
export function dateFormatter(str) {
  //默认返回yyyy-MM-dd HH-mm-ss
  var hasTime = arguments[1] != false ? true : false; //可传第二个参数false，返回yyyy-MM-dd
  var d = new Date(str);
  var year = d.getFullYear();
  var month =
    d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
  var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
  var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
  if (hasTime) {
    return (
      [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
    );
  } else {
    return [year, month, day].join('-');
  }
}

/**
 * 防抖
 * @date 2022-01-27
 * @param {Function} fn 防抖的函数
 * @param {number} wait 防抖时间
 * @param {boolean} immediate 表示第一次是否立即执行
 * @returns {any}
 */
export function debounce(fn, wait = 50, immediate) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);

    // ------ 新增部分 start ------
    // immediate 为 true 表示第一次触发后执行
    // timer 为空表示首次触发
    if (immediate && !timer) {
      fn.apply(this, args);
    }
    // ------ 新增部分 end ------

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

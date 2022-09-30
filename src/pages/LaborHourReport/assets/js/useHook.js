/**
 * @description 数字小于10，前面补0
 * @param {number} val
 * @returns
 */
export const addZero = function(val) {
  return val >= 10 ? val : '0' + val;
};
/**
 * @description 获取当前时间 年月日时分秒
 */
export function getNowTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const seconds = date.getSeconds();
  return (
    year +
    '-' +
    addZero(month) +
    '-' +
    addZero(day) +
    ' ' +
    addZero(hour) +
    ':' +
    addZero(minute) +
    ':' +
    addZero(seconds)
  );
}

/**
 * @description 获取当前年-月
 * @returns yyyy-mm
 */
export function getCurrentMonth() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return year + '-' + addZero(month);
}
/**
 * @description 获取当前年-月-日
 * @returns yyyy-mm
 */
export function getCurrentDate(type) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (type === '月日') {
    return `${addZero(month)}月${addZero(day)}日`;
  } else {
    return `${year}-${addZero(month)}-${addZero(day)}`;
  }
}

/**
 * @description 不能输入中文/英文/特殊字符
 */
export function handleOnlyNumberInput(targetValue) {
  const reg1 = /[^\x00-\xff]/g; // 禁止输入中文
  const reg2 = /[A-Za-z]/g; // 禁止输入英文字母
  // 禁止输入特殊字符
  const reg3 = /[`~@#$%^&*()_\-+=<>?:"''!{}|,\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g;
  // 禁止输入特殊字符(可以输入-负号)
  const reg4 = /[`~@#$%^&*()_+=<>?:"''!{}|,\/;\\[\]·~！@#￥%……&*（）——+={}|《》？：“”【】、；‘’，。、]/g;
  return targetValue
    .replace(reg1, '')
    .replace(reg2, '')
    .replace(reg3, '');
}

/**
 * @param {Number} y 年
 * @param {Number} m 月
 * @description 获取月份一共有多少天
 */
export function daysInMonth(y, m) {
  let day = (y % 100 == 0) ? ((y % 400 == 0) ? 1 : 0) : ((y % 4 == 0) ? 1 : 0)
  var er = 28 + day;
  //  1   2   3   4   5   6   7   8   9   10  11  12
  var monthArr = [31, er, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return monthArr[m - 1];
}

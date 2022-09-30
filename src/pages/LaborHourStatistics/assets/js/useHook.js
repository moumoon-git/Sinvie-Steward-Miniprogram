/**
 * @description 数字小于10，前面补0
 * @param {number} val
 * @returns
 */
 export const addZero = function(val) {
  return val >= 10 ? val : '0' + val;
};
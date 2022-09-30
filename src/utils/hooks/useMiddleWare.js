import { reactive } from 'vue';

const middleWare = reactive({});

const useMiddleWare = () => {
  /**
   * 发布者
   * @date 2021-09-07
   * @param {any} eventName:string
   * @param {any} ...rest:any
   * @returns {any}
   */
  const $emit_phy = (eventName, ...rest) => {
    middleWare[eventName] && middleWare[eventName].forEach((fn) => fn(...rest));
  };

  /**
   * 订阅者
   * @date 2021-09-07
   * @param {any} eventName:string
   * @param {any} fn:注册的回调函数
   * @returns {any}
   */
  const $on_phy = (eventName, fn) => {
    if (middleWare[eventName]) {
      middleWare[eventName].push(fn);
    } else {
      middleWare[eventName] = [fn];
    }
  };

  /**
   * 移除单个订阅事件
   * @date 2021-09-07
   * @param {any} eventName:string
   * @param {any} fn:(
   * @returns {any}
   */
  const removeListener = (eventName, fn) => {
    if (middleWare[eventName]) {
      middleWare[eventName] = middleWare[eventName].filter((cb) => cb !== fn);
    }
  };

  /**
   * 清空MiddleWare
   * @date 2021-09-07
   * @returns {any}
   */
  const initMiddleWare = () => {
    for (const key in middleWare) {
      delete middleWare[key];
    }
  };

  return {
    $on_phy,
    $emit_phy,
    removeListener,
    initMiddleWare,
  };
};

export default useMiddleWare;

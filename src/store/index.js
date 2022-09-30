/*
 * @Descripttion: 
 * @version: 
 * @Date: 2021-11-17 19:09:53
 * @LastEditTime: 2022-05-13 16:55:53
 */
import { createStore } from 'vuex';

const store = createStore({
  state: {
    userInfo: {
      userName: '',
      role: '',
      avatar: 'init',
      isOutreach:'',
    },
  },
  mutations: {
    SET_USER_INFO(state, val) {
      state.userInfo = val;
    },
  },
  getters: {},
  actions: {},
});

export default store;

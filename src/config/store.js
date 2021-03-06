import Vue from 'vue'
import Vuex from 'vuex'
import {
  setStore,
  getStore,
  removeStore,
  modifyJson
} from '@/config/mUtils'
Vue.use(Vuex)
//全局变量
const state = {
  //页面加载时
  pageLoading: false,
  //数据加载时
  dataLoading: false,
  //当前页面路径
  path: '',
  //跳转页面动画模式
  direction: 'forward',
  //用户信息
  userInfo: {},
  shoppingInfo: {
    list: []
  },
  newsInfo: {},
  phoneInfo: {},
  mobileMode: { result: false },
}
//缓存浏览器的数据名称
const cacheNameList = ["userInfo", "shoppingInfo","newsInfo",'phoneInfo','mobileMode'];
//数据处理
const mutations = { //触发状态
  //取出缓存数据
  setCacheData(state) {
    for (var item of cacheNameList) {
      let getData = localStorage.getItem(item);
      if (getData) {
        state[item] = JSON.parse(getData);
      }
    }
  },
  //页面加载时
  setPageLoading(state, payload) {
    state.pageLoading = payload;
  },
  //数据加载时
  setDataLoading(state, payload) {
    state.dataLoading = payload;
  },
  //当前页面路径
  setPath(state, payload) {
    state.path = payload;
  },
  //跳转页面动画模式
  setDirection(state, payload) {
    state.direction = payload;
  },
  //储存用户信息
  setUserInfo(state, payload) {
    if (payload) {
      state.userInfo = modifyJson(payload, state.userInfo);
      setStore('userInfo', state.userInfo);
    }
  },
  //储存购物信息信息
  setShoppingInfo(state, payload) {
    if (payload) {
      state.shoppingInfo = modifyJson(payload, state.shoppingInfo);
      setStore('shoppingInfo', state.shoppingInfo);
    }
  },
  //储存消息信息
  setNewsInfo(state, payload) {
    if (payload) {
      state.newsInfo = modifyJson(payload, state.newsInfo);
      setStore('newsInfo', state.newsInfo);
    }
  },
  //储存平台电话信息
  setPhoneInfo(state, payload) {
    if (payload) {
      state.phoneInfo = modifyJson(payload, state.phoneInfo);
      setStore('phoneInfo', state.phoneInfo);
    }
  },
  //储存平台电话信息
  setMobileMode(state, payload) {
    if (payload) {
      state.mobileMode = modifyJson(payload, state.mobileMode);
      setStore('mobileMode', state.mobileMode);
    }
  },
  
  
}
//异步处理
const actions = {

}
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions
})

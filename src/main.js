// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//主组件
import App from './App'
import '@/iconfont/iconfont.css'
//vue路由
import router from './router'
//vuex配置文件
import store from '@/config/store'

import md5 from 'js-md5'
Vue.prototype.$md5 = md5

// if(document.documentElement.clientWidth<=768){
//   // 引用rem配置
//   import '@/config/rem'
// }


Vue.config.productionTip = false
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)
Vue.use(ELEMENT)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

import Vue from 'vue'
import Router from 'vue-router'
import {routerMode} from '@/config/env'
import store from '@/config/store'
Vue.use(Router)
//路由配置
const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/page/aalogin/login.vue'], resolve)
  },
  {
    path: '/wxlogin/:parameter',
    name: 'wxlogin',
    component: resolve => require(['@/page/aalogin/wxlogin.vue'], resolve)
  },
  {
    path: '/register',
    name: 'register',
    component: resolve => require(['@/page/aalogin/register.vue'], resolve)
  },
  {
    path: '/shareRegister/:shareCode',
    name: 'shareRegister',
    component: resolve => require(['@/page/aalogin/shareRegister.vue'], resolve)
  },
  {
    path: '/registerAngle/:shareCode',
    name: 'registerAngle',
    component: resolve => require(['@/page/aalogin/registerAngle.vue'], resolve)
  },
  
  {
    path: '/editPsd',
    name: 'editPsd',
    component: resolve => require(['@/page/account/editPsd.vue'], resolve)
  },
  {
    path: '/aggrement/:type',
    name: 'aggrement',
    component: resolve => require(['@/page/account/aggrement.vue'], resolve)
  },
  {
    path: '/home',
    name: 'home',
    component: resolve => require(['@/page/home/home.vue'], resolve)
  },
  {
    path: '/home2/:id',
    name: 'home2',
    component: resolve => require(['@/page/home/home2.vue'], resolve)
  },
  //商品列表
  {
    path: '/list',
    name: 'list',
    component: resolve => require(['@/page/home/list.vue'], resolve)
  },  
  //购物车列表
  {
    path: '/cartList',
    name: 'cartList',
    component: resolve => require(['@/page/home/cartList.vue'], resolve)
  },  
  //提交订单
  {
    path: '/subOrder/:subTime',
    name: 'subOrder',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/home/subOrder.vue'], resolve)
  },  
  //支付
  {
    path: '/pay/:id',
    name: 'pay',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/home/pay.vue'], resolve)
  },  
  //商品详情
  {
    path: '/goodsdetail/:id',
    name: 'goodsdetail',
    component: resolve => require(['@/page/home/goodsdetail.vue'], resolve)
  },
  //我的订单
  {
    path: '/orderList',
    name: 'orderList',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/order/orderList.vue'], resolve)
  },
  //订单详情
  {
    path: '/orderDetail/:id',
    name: 'orderDetail',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/order/orderDetail.vue'], resolve)
  },
  //订单评价
  {
    path: '/comment/:id',
    name: 'comment',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/order/comment.vue'], resolve)
  },
  //续租订单界面
  {
    path: '/renewalOrder/:id',
    name: 'renewalOrder',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/order/renewalOrder.vue'], resolve)
  },  
  //售后界面
  {
    path: '/service/:id/:sid',
    name: 'service',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/order/service.vue'], resolve)
  },
  //我的账户
  {
    path: '/account',
    name: 'account',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/account/account.vue'], resolve)
  },
  {
    path: '/moneyLog',
    name: 'moneyLog',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/account/moneyLog.vue'], resolve)
  },
  //我的销售
  {
    path: '/mysale',
    name: 'mysale',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/account/mysale.vue'], resolve)
  },
  //销售详情
  {
    path: '/saleDetail/:code/:name',
    name: 'saleDetail',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/account/saleDetail.vue'], resolve)
  },
  //我的金牌
  {
    path: '/mygold',
    name: 'mygold',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/account/mygold.vue'], resolve)
  },
  //我的客户
  {
    path: '/mycustomer',
    name: 'mycustomer',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/account/mycustomer.vue'], resolve)
  },
  //客户详情
  {
    path: '/customerDetail/:id/:name',
    name: 'customerDetail',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/account/customerDetail.vue'], resolve)
  },
  //账户设置-基础资料
  {
    path: '/accountSet',
    name: 'accountSet',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/accountSet/accountSet.vue'], resolve)
  },
  //账户设置-寄送地址
  {
    path: '/accountAddress',
    name: 'accountAddress',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/accountSet/accountAddress.vue'], resolve)
  },
  //账户设置-安全验证
  {
    path: '/accountSafe',
    name: 'accountSafe',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/accountSet/accountSafe.vue'], resolve)
  },
  //账户设置-企业信息
  {
    path: '/accountCompany',
    name: 'accountCompany',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/accountSet/accountCompany.vue'], resolve)
  },
  //消息中心
  {
    path: '/news',
    name: 'news',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/news/news.vue'], resolve)
  },
  //新闻中心
  {
    path: '/newsCenter',
    name: 'newsCenter',
    component: resolve => require(['@/page/news/newsCenter.vue'], resolve)
  },
  //加盟中心
  {
    path: '/joinCenter',
    name: 'joinCenter',
    component: resolve => require(['@/page/joinCenter/joinCenter.vue'], resolve)
  },
  {
    path: '/joinDes/:type',
    name: 'joinDes',
    component: resolve => require(['@/page/joinCenter/joinDes.vue'], resolve)
  },
  //入驻
  {
    path: '/join',
    name: 'join',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/joinCenter/join.vue'], resolve)
  },
  //天使入驻
  {
    path: '/joinAngle',
    name: 'joinAngle',
    meta: { requireAuth: true },
    component: resolve => require(['@/page/joinCenter/joinAngle.vue'], resolve)
  },
  
  //帮助中心
  {
    path: '/help',
    name: 'help',
    component: resolve => require(['@/page/help/help.vue'], resolve)
  },
  
  //分类
  {
    path: '/type',
    name: 'type',
    component: resolve => require(['@/page/mobile/type.vue'], resolve)
  },
  //个人中心-移动
  {
    path: '/mymobile',
    name: 'mymobile',
    component: resolve => require(['@/page/mobile/mymobile.vue'], resolve)
  },
  //资产
  {
    path: '/assets',
    name: 'assets',
    component: resolve => require(['@/page/mobile/assets.vue'], resolve)
  },
  //账户管理
  {
    path: '/myAccount',
    name: 'myAccount',
    component: resolve => require(['@/page/mobile/myAccount.vue'], resolve)
  },
  
];
let router = new Router({
  //模式
  mode: routerMode,
  //代码检查
  // strict: process.env.NODE_ENV !== 'production',
  //页面滚动
	scrollBehavior (to, from, savedPosition) {
	    if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
		  return { x: 0, y: to.meta.savedPosition ||0}
		}
  },
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  routes
});
//页面加载时
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
history.setItem('/type', 1)
history.setItem('/cart', 2)
history.setItem('/mymobile', 3)
//页面加载时
router.beforeEach(function (to, from, next) {
  store.commit('setPageLoading', true);
  store.commit('setPath',to.path)
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {  
    // //console.log('beforeEach获取当前的token是否存在'+store.state.userInfo.token)
    let userInfo = localStorage.getItem("userInfo")
    if (userInfo && userInfo!=null) {  
      // var htmlHref = window.location.href
      // htmlHref = htmlHref.replace(/^https:\/\/[^/]+/, "");
      // var addr = htmlHref.substr(htmlHref.lastIndexOf('/', htmlHref.lastIndexOf('/') - 1) + 1);
      // var index = addr.lastIndexOf("\/");
      // var addrLast = decodeURI(addr.substring(index + 1, addr.length));
      // var sdhObj,href,openid
      // if(addrLast.indexOf('?')>-1){
      //   sdhObj = addrLast.split('?')
      //   href = sdhObj[0]
      //   openid = sdhObj[1].split('=')[1]
      //   localStorage.setItem("openid",openid)
      // }else{
      //   href = addrLast
      // }
    }else {
      // var htmlHref = window.location.href
      // htmlHref = htmlHref.replace(/^http:\/\/[^/]+/, "");
      // var addr = htmlHref.substr(htmlHref.lastIndexOf('/', htmlHref.lastIndexOf('/') - 1) + 1);
      // var index = addr.lastIndexOf("\/");
      // var addrLast = decodeURI(addr.substring(index + 1, addr.length));
      // var sdhObj,href,openid
      // if(addrLast.indexOf('?')>-1){
      //   sdhObj = addrLast.split('?')
      //   href = sdhObj[0]
      //   openid = sdhObj[1].split('=')[1]
      //   localStorage.setItem("openid",openid)
      // }else{
      //   href = addrLast
      // }
      // let routerStr = htmlHref.split('?')[0].substring(1)  //截取掉‘/’

      let routerStr = (from.path).split('?')[0].substring(1)
      //console.log(routerStr)
      localStorage.setItem("routerHref", routerStr)
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }

	if (toIndex) {
	    if (toIndex > fromIndex || !fromIndex || (toIndex === '0' && fromIndex === '0')) {
	      store.commit('setDirection', 'forward')
	    } else {
	      store.commit('setDirection', 'reverse')
	    }
	} else {
	    ++historyCount
	    history.setItem('count', historyCount)
	    to.path !== '/' && history.setItem(to.path, historyCount)
	    store.commit('setDirection', 'forward')
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next();
  }

  next(vm => {
    console.warn(to.redirectedFrom)
    
  })
});
//页面销毁时
router.afterEach(function (to) {
  store.commit('setPageLoading',false);
});
export default router;

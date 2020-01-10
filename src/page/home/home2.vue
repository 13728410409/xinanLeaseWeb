<template>
  <div>
    <head-top></head-top>
    <div class="hometop2">
      <div class="container box">
        <router-link tag="div" to="/" class="img" title="信安首页"><img src="/static/icon/logo_black.png" alt=""></router-link>
        <div class="searchBox"><search></search></div>
        <div class="shoppingcartBox"><shoppingcart></shoppingcart></div> 
      </div>
    </div>
    <div class="hometop3">
      <div class="container box">
        <span class="title">{{name}}</span>
        <!-- <span class="nav active">企业特购</span>
        <span class="nav">热门服务</span>
        <span class="nav">超值套餐</span>
        <span class="nav">关于我们</span>
        <span class="nav">合作伙伴</span> -->
        <router-link tag="span" to="/newsCenter" class="nav">新闻中心</router-link>
        <span class="nav" @click="viewJoinInfo" v-if="!isLogin || userInfo.type!=4">加盟中心</span>
        
      </div>
    </div>
    <!-- 主菜单、轮播及信息 -->
    <div class="container bannerBox">
      <!-- 导航  -->
      <div class="nav " :class="navList.length>6?'scrollbar':''">
        <ul>
          <li v-for="(item,index) of navList" :key="index">
            <span class="name">{{item.name}}&nbsp;></span>
            <div class="list ellipsis">
              <span class="itm" v-for="(items,indexs) of navList[index].childMenu" v-if="indexs<2" :key="indexs" :title="items.name">{{items.name}}</span>
            </div>
            <div class="listmask">
              <span class="itms" v-for="(items,indexs) of navList[index].childMenu" :key="indexs" @click="goList(items)">
                {{items.name}}
              </span>
              <span class="itms" v-if="navList[index].childMenu==0">暂无分类</span>
            </div> 
          </li>
        </ul>
      </div>
      <div class="homeswiper">
        <div class="mainswiper">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item,index) of swiperList" :key="index" :style="{ backgroundImage:'url('+item.imgUrl+')'}" class="swiperSlide">
              <!-- <img class="swiper-img" :src="item.url" alt=""> -->
              <div v-if="item.jumpType==2" @click="viewDetail(item.record.id)" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;"></div>
              <div v-if="item.jumpType==1" @click="jump(item.record)" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;"></div>
            </swiper-slide>
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
        </div>
      </div>
      <!-- 新消息 -->
      <div class="newInfomation">
        <div class="welcome">
          <div class="img"><img src="/static/icon/logo.png" alt=""></div>
          <div class="info">
            <div class="tip">HI~欢迎来到信安！</div>
            <div class="opt" v-if="!isLogin">
              <router-link tag="span" to="/register">注册</router-link><i>|</i><router-link tag="span" to="/login">登录</router-link>
            </div>
            <div class="opt" v-if="isLogin"><div class="u">用户-{{userInfo.nickName}}</div></div>
          </div>
        </div>
        <div class="contact" :class="phoneInfo.list.length>1?'small':''">
          <div class="title">热线电话</div>
          <div class="tel">
            <div class="itm" v-for="(item,index) of phoneInfo.list" :key="index" v-if="index<2">{{item}}</div>
          </div>
        </div>
        <div class="service_goods">
          <div class="tab">
            <span :class="service_goods==1?'active':''" @click="selectService_goods(1)">服务内容</span><i>|</i>
            <span :class="service_goods==2?'active':''" @click="selectService_goods(2)">最新上架</span>
          </div>
          <ul class="list">
            <li  v-for="(item,index) of hList" :key="index" @click="viewDetail(item.id)"><span class="sign">HOT</span><div class="val ellipsis">{{item.name}}</div></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 商务首选 -->
    <div class="container main product"  v-for="(item,index) of productList" :key="index" v-if="productList.length!=0">
      <div class="typesign">
        <div class="title"><span>{{item.name}}</span><span class="circleBack"></span></div>
        <div class="signimg">
          <img :src="item.img" alt="">
        </div>
      </div>
      <div class="list" v-if="productList[index].goodsRankingDtoList.length!=0">
        <div class="itm" v-for="(items,indexs) of item.goodsRankingDtoList" :key="indexs" @click="viewDetail(items.id)" >
          <div class="img"><img :src="items.img" alt=""></div>
          <div class="info">
            <div class="des ellipsis4">{{items.name}}</div>
            <div class="price"><i>￥</i><span>{{items.money}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from '@/components/header/head'
import footGuide from '@/components/footer/footGuide'
import search from '@/components/search/search'
import shoppingcart from '@/components/shopping/shoppingcart'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mt_selectSecondMenu,mt_lunboselectSecondAll, mt_querySecondPage } from "@/api/home";
import { mt_queryHotOrNewGoods } from "@/api/common";
export default {
  name: 'home2',
  components: {
    headTop,
    footGuide,
    search,
    shoppingcart,
    swiper,
    swiperSlide
  },
  data() {
    return {
      name: '', //1级菜单名称
      navList: [],
      swiperList: [],
      swiperOption: {
        pagination: '.swiper-pagination',
        loop: true,
        autoplay: 5000,
        disableOnInteraction: false,
        paginationClickable: true,
        autoplayDisableOnInteraction: false,
      },
      // slideList: [],
      swiperOption1: {
        autoplay: false,
        disableOnInteraction: false,
        paginationClickable: true,
        autoplayDisableOnInteraction: false
      },
      service_goods: 1, //1服务内容  2最新上架
      hList: [],
      productList: [],
    }
  },
  computed: {
    ...mapState(['userInfo','phoneInfo'])
  },
  watch: {
    service_goods(val){
      console.log(val)
      this.hList = []
      this.getHotOrNewGoods(val)
    }
  },
  created(){
    let that = this
    // console.log(JSON.parse(localStorage.getItem('userInfo')).token)
    if(localStorage.getItem('userInfo')!=null){
      that.isLogin = JSON.parse(localStorage.getItem('userInfo')).token !=null ? true:false

    }
    if(localStorage.getItem('home2')!=null){
        that.name =  JSON.parse(localStorage.getItem('home2')).name
    }else{
        that.$confirm('当前地址有误, 立即返回首页?', '温馨提示', {
          confirmButtonText: '确定',
          showClose: false,
          showCancelButton: false,
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          that.$router.push('/')
        }).catch(() => {
            that.$router.push('/')       
        });
    }
    let pid = that.$route.params.id
    if(pid){
      that.getGoodsMenu(pid)
      that.getLunbo()
      that.getGoods(pid)
      that.getHotOrNewGoods(this.service_goods)
    }else{
      that.$confirm('当前地址有误, 立即返回首页?', '温馨提示', {
          confirmButtonText: '确定',
          showClose: false,
          showCancelButton: false,
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          that.$router.push('/')
        }).catch(() => {
            that.$router.push('/')       
        });
    }
  },
  mounted() {
    //获取用户信息
  },
  methods: {
    //获取二级菜单分类
    getGoodsMenu(id){
      let that = this
      mt_selectSecondMenu(id).then(data=>{
        // console.log(data.data)
        that.navList = data.data
      })
    },
    //获取二级轮播图
    getLunbo(){
      let that = this
      mt_lunboselectSecondAll(1,10).then(data=>{
        console.log(data.data)
        data.data.left.forEach(item=>{
          if(item.jumpType==2){
            item.record = JSON.parse(item.record)
          }
        })
        that.swiperList = data.data.left
      })
    },
    //获取热门商品 或者 最新商品的查询
    getHotOrNewGoods(type){
      let that = this
      mt_queryHotOrNewGoods(type).then(data=>{
        // console.log(data.data.data)
        that.hList = data.data.data
      })
    },
    //获取商品
    getGoods(id){
      let that = this
      mt_querySecondPage(id).then(data=>{
        console.log(data.data)
        that.productList = data.data
      })
    },
    //切换登录方式
    selectService_goods(val){
      this.service_goods = val
    },
    //查看详情
    viewDetail(val){
      this.$router.push('/goodsdetail/'+val)
    },
    jump(val){
      console.log(val)
    },
    //前往商品分类
    goList(value){
      console.log(value)
      this.$router.push({ name:'list', params:{ name : '', menuId: value.id  } })
    },
    //查看加盟信息
    viewJoinInfo(){
      let jsonUserInfo = localStorage.getItem('userInfo')
      if (jsonUserInfo!=null) {
        let userInfo = JSON.parse(jsonUserInfo)
        if(userInfo.angelState==3){
          if(userInfo.joinStatus == 0){
            this.$router.push('/joinCenter')
          }else{
            this.$router.push('/join')
          }
        }else{
          this.$router.push('/joinAngle')
        }
      } else {
        this.$router.push("/joinCenter");
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
@import "../../../node_modules/swiper/dist/css/swiper.min.css";
/deep/ .swiper-pagination-bullet-active {
  background-color: $mainColor !important;
}  
.hometop3{
  height: 40px;
  margin-bottom: 20px;
  background-color: #ffffff;
  .box{
    font-size: 0;
    span{
      height: 40px;
      line-height: 40px;
      font-size: 14px;
    }
    .title{
      display: inline-block;
      width: 190px;
      margin-right: 20px;
      padding-left: 18px;
      color: #ffffff;
      background-color: $mainColor;
      cursor: hand;
    }
    .nav{
      margin-right: 72px;
      color: #333333;
      &:hover,&.active{
        color: $mainColor;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
// 主菜单、轮播及信息
.bannerBox{
  display: flex;
  height: 480px;
  margin-bottom: 20px;
  .nav{
    flex: 190px 0 0;
    width: 190px;
    height: 480px;
    margin-right: 10px;
    background-color: #ffffff;
    position: relative;
    &.scrollbar{
      overflow-y: scroll;
    }
    li{
      padding: 22px 10px 0 20px;
      &:hover{
        cursor: pointer;
        box-shadow: 0px 0px 10px 0px rgba(210, 207, 207, 0.67);
        .list{
          border-bottom: none;
        }
      }
      .name{
        font-size: 14px;
        line-height: 14px;
      }
      .list{
        margin-top: 2px;
        padding-bottom: 14px;
        border-bottom: 1px solid #e8e8e8;
        &:last-child{
          border-bottom: none;
        }
        .itm{
          font-size: 12px;
          line-height: 12px;
          padding: 0 8px;
          color: #999999;
          border-left: 1px solid #999999;
          &:first-child{
            padding-left: 0;
            border-left: none;
          }
        }
      }
      .listmask{
        display: none;
        position: absolute;
        left: 190px;
        top: 0;
        z-index: 6;
        width: 1000px;
        height: 480px;
        padding: 20px;
        background-color: #ffffff;
        border-left: 1px solid #eaeaea;
        font-size: 0;
        .itms{
          font-size: 14px;
          line-height: 30px;
          margin-right: 20px;
          color: #666666;
          &:hover{
            cursor: pointer;
            color: $mainColor;
          }
        }
      }
      &:hover{
        .listmask{
          display: block;
        }
      }
    }
  }
  .homeswiper{
    flex: 1;
    width: 800px;
    height: 480px;
    background-color: #ffffff;
    .mainswiper{
      height: 480px;
      overflow: hidden;
      .swiperSlide{
        height: 480px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
    }
  }
  
  .newInfomation{
    flex: 0 0 190px;
    width: 190px;
    height: 480px;
    margin-left: 10px;
    padding: 0 12px;
    overflow: hidden;
    background-color: #ffffff;
    .welcome{
      display: flex;
      padding: 25px 0 22px 0;
      border-bottom: 1px solid #ebebeb;
      .img{
        flex: 0 0 45px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background-color: #ebebeb;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .info{
        margin-left: 10px;
        .tip{
          margin-top: 3px;
          font-size: 12px;
          line-height: 12px;
          color: #666666;
        }
        .opt{
          margin-top: 10px;
          font-size: 0;
          span{
            font-size: 12px;
            line-height: 14px;
            color: #333333;
            &:hover{
              color: $mainColor;
              cursor: pointer;
              text-decoration: underline;
            }
          }
          i{
            font-style: normal;
            font-size: 14px;
            line-height: 14px;
            padding: 0 6px;
            color: #333333;
          }
          .u{
            font-size: 10px;
          }
        }
      }
    }
    .contact{
      padding: 20px 0 15px 0;
      border-bottom: 1px solid #ebebeb;
      text-align: center;
      &.small{
        padding: 14px 0;
      }
      .title{
        font-size: 14px;
        line-height: 14px;
        color: #666666;
      }
      .tel{
        margin-top: 10px;
        .itm{
          font-size: 14px;
          line-height: 14px;
          margin-top: 4px;
          color: $mainColor;
          font-weight: bold;
          letter-spacing: 1px;
        }
      }
    }
    .service_goods{
      padding: 20px 0 24px 0; 
      .tab{
        font-size: 0;
        text-align: center;
        span{
          font-size: 14px;
          line-height: 14px;
          color: #333333;
          &:hover,&.active{
            color: $mainColor;
            cursor: pointer;
          }
        }
        i{
          font-style: normal;
          font-size: 14px;
          line-height: 14px;
          padding: 0 6px;
          color: #b7b7b7;
        }
      }
      .list{
        padding-top: 16px;
        li{
          display: flex;
          height: 18px;
          line-height: 18px;
          margin-bottom: 10px;
          .sign{
            flex: 32px 0 0;
            width: 32px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            background-color: rgba(240,130,0,0.2);
            border-radius: 2px;
            font-size: 12px;
            color: $mainColor;
          }
          .val{
            padding-left: 10px;
            font-size: 14px;
            line-height: 18px;
            color: #666666;
          }
        }
      }
    }
  }
}
// 排行榜
.main{
  margin-bottom: 20px;
  background-color: #ffffff;
  .title{
    padding-bottom: 18px;
    font-size: 0;
    line-height: 24px;
    span{
      display: inline-block;
      font-size: 24px;
      line-height: 24px;
      color: #333333;
      font-weight: bold;
      vertical-align: middle;
    }
    .circleBack{
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-left: 10px;
      background: url(/static/icon/circleBack.png) no-repeat center center;
    }
  }
  
}
.sort{
  padding: 20px;
  .list{
    display: flex;
    .itm{
      flex: 1;
      width: 224px;
      height: 296px;
      margin-right: 10px;
      padding: 20px;
      background-color: #ffffff;
      box-shadow: 0px 0px 5px 0px	rgba(208, 208, 208, 0.5);
      &:last-child{
        margin-right: 0;
      }
      &:hover{
        box-shadow: 0px 0px 5px 0px	rgba(200, 200, 200, 0.8);
      }
      .img{
        width: 100%;
        height: 184px;
        position: relative;
        img{
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%,-50%,0);
          max-width: 184px;
          max-height: 184px;
        }
      }
      .des{
        margin-top: 10px;
        font-size: 12px;
        color: #333333;
        line-height: 20px;
      }
      .price{

        margin-top: 12px;
        line-height: 18px;
        display: flex;
        i{
          font-size: 12px;
          color: $mainColor;
        }
        span{
          font-size: 18px;
          color: $mainColor;
        }
      }
    }
  }
}
.product{
  background-color: transparent;
  display: flex;
  .typesign{
    flex: 290px 0 0;
    width: 290px;
    height: 300px;
    padding: 20px;
    background-color: #ffffff;
    .signimg{
      padding: 0 18px;
      position: relative;
      img{
        max-width: 217px;
      }
    }
  }
  .list{
    flex: 1;
    width: 900px;
    height: 300px;
    margin-left: 10px;
    overflow: hidden;
    .itm{
      float: left;
      width: 293px;
      height: 146px;
      margin: 0 10px 10px 0;
      padding: 20px 10px;
      background-color: #ffffff;
      overflow: hidden;
      display: flex;
      &:nth-child(3n){
        margin-right: 0;
      }
      &:nth-child(4),&:nth-child(5),&:nth-child(6){
        margin-bottom: 0;
      }
      &:hover{
        box-shadow: 0px 0px 5px 0px	rgba(200, 200, 200, 0.8);
      }
      .img{
        flex: 110px 0 0;
        width: 110px;
        height: 106px;
        position: relative;
        img{
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%,-50%,0);
          max-width: 110px;
          max-height: 106px;
        }
      }
      .info{
        flex: 1;
        margin-left: 15px;
        .des{
          height: 86px;
          line-height: 20px;
          font-size: 13px;
          color: #333333;
          
        }
        .price{
          display: flex;
          height: 20px;
          line-height: 20px;
          i{
            font-size: 12px;
            color: $mainColor;
          }
          span{
            font-size: 18px;
            color: $mainColor;
          }
        }
      }
    }
  }
}


</style>

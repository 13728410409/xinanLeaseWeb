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
        <router-link tag="span" to="/newsCenter" class="nav">新闻中心</router-link>
        <span class="nav" @click="viewJoinInfo" v-if="!isLogin || userInfo.type!=4">加盟中心</span>
        
      </div>
    </div>
    <!-- 主菜单、轮播及信息 -->
    <div class="container bannerBox">
      <div class="nav ">
        <ul>
          <li v-for="(item,index) of navList" :key="index" @mouseover="hoverNav(index)" v-if="index < moreIndex" :class="currentIndex==index?'active':''">
            <div class="name">{{item.name}}</div>
            <img class="f" v-if="item.img!=''" :src="item.img" alt="">
            <img class="f" v-else src="../../../static/icon/logo.png" alt="">
            <div class="listmask" v-if="currentIndex==index" :style="{'height': rightHeight+'px'}">
              <div class="lItem" v-for="(items,indexs) of navList[index].childMenu" :key="indexs" @click="goList(items)">
                <div class="itms">{{items.name}}</div>
                <div class="img"><img :src="items.img" alt=""></div>
              </div>
              <div class="lItem" v-if="navList[index].childMenu.length==0">
                <span class="itms">暂无分类</span>
              </div>
            </div> 
          </li>
          <li  class="showMore" v-if="!showMore&&navList.length>7" @click="showMoreIndex" title="查看更多二级分类">更多分类</li>
        </ul>
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

      currentIndex: 0,
      rightHeight: 810,

      showMore: false,

      moreIndex: 7,
    }
  },
  computed: {
    ...mapState(['userInfo','phoneInfo'])
  },
  watch: {
    
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
    if(!this.showMore){
      this.moreIndex = 7
    }
  },
  mounted() {
    //获取用户信息
  },
  methods: {
    hoverNav(index){
      if(this.currentIndex!=index){
        this.currentIndex = index
      }
    },
    showMoreIndex(){
      this.showMore = true
      this.moreIndex = this.navList.length
      this.rightHeight = this.moreIndex * 110
    },
    //获取二级菜单分类
    getGoodsMenu(id){
      let that = this
      mt_selectSecondMenu(id).then(data=>{
        // console.log(data.data)
        that.navList = data.data
      })
    },
    
    //前往商品分类
    goList(value){
      // console.log(value)
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
  min-height: 810px;
  margin-bottom: 20px;
  .nav{
    flex: 190px 0 0;
    width: 190px;
    min-height: 770px;
    margin-right: 10px;
    background-color: #ffffff;
    border-right: 1px solid #eaeaea;
    position: relative;
    &.scrollbar{
      overflow-y: scroll;
    }
    li{
      padding: 14px 0;
      border-bottom: 1px solid #dddddd;
      &.active{
        box-shadow: 0px 0px 10px 0px rgba(210, 207, 207, 0.67);
        border-bottom: 1px solid #f08200;
      }
      &:last-child{
        border-bottom: none;
      }
      &.showMore{
        padding:0;
        line-height: 40px;
        font-size: 14px;
        color: #666666;
        text-align: center;
        &:hover{
          color: #f08200;
          cursor: pointer;
          text-decoration: underline;
        }
      }
      
      .name{
        font-size: 16px;
        font-weight: bold;;
        line-height: 16px;
        text-align: center;
        margin-bottom: 5px;
      }
      .f{
        display: block;
        width: 60px;
        height: 60px;
        margin: 0 auto;
      }
      
      .listmask{
        position: absolute;
        left: 190px;
        top: 0;
        z-index: 6;
        width: 1000px;
        min-height: 810px;
        padding: 14px 20px;
        background-color: #ffffff;
        
        font-size: 0;
        .lItem{
          float: left;
          width: 160px;
          height: 190px;
          padding: 10px;
          .itms{
            font-size: 14px;
            line-height: 30px;
            color: #333333;
            text-align: center;
            &:hover{
              cursor: pointer;
              color: $mainColor;
            }
          }
          .img{
            width: 140px;
            height: 140px;
            position: relative;
            img{
              position: absolute;
              left: 50%;
              top:50%;
              transform: translate3d(-50%,-50%,0);
              max-width: 100%;
              max-height: 100%;
            }
          }
          
        }
      }
    }
  }
}
</style>

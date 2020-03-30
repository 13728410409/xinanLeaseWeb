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
      <div class="nav" v-if="navList.length>0">
        <ul>
          <li v-for="(item,index) of navList" :key="index" v-if="index < moreIndex" :class="currentIndex==index?'active':''"  :title="item.name">
            <img class="fimg" v-if="item.img!=''" :src="item.img" @mouseover="hoverNav(index,item)">
            <img class="fimg" v-else src="../../../static/icon/logo.png" @mouseover="hoverNav(index,item)">
            <div class="name ellipsis" :title="item.name"  @mouseover="hoverNav(index,item)">{{item.name}}</div>
            <div class="listmask" v-if="currentIndex==index" :style="{'min-height': rightHeight+'px'}">
              <div class="eName">当前二级分类：{{currentName}}</div>
              <div class="box">
                <div class="lItem" v-for="(items,indexs) of navList[index].childMenu" :key="indexs" @click="goList(items)">
                  <div class="img"><img :src="items.img" alt=""></div>
                  <div class="itms">{{items.name}}</div>
                </div>
                <div class="lItem" v-if="navList[index].childMenu.length==0">
                  <div class="itms">暂无更多分类</div>
                </div>
              </div>
            </div> 
          </li>
          <li  class="showMore" v-if="!showMore&&navList.length>5" @click="showMoreIndex" title="查看更多二级分类">
            <span>更多分类</span>
            <!-- <img src="/static/icon/right.png" alt=""> -->
          </li>
        </ul>
      </div>
      <div v-if="navList.length==0" style="flex: 1;background-color:#ffffff;padding:16px;font-size:14px;color:#333333;">暂无“{{name}}”分类数据</div>
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
      currentName: '',
      rightHeight: 843,
      showMore: false,
      moreIndex: 5,
    }
  },
  computed: {
    ...mapState(['userInfo','phoneInfo'])
  },
  watch: {
    
  },
  created(){
    let that = this
    // //console.log(JSON.parse(localStorage.getItem('userInfo')).token)
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
  },
  mounted() {
    //获取用户信息
  },
  methods: {
    hoverNav(index,value){
      if(this.currentIndex!=index){
        let num = Math.ceil(value.childMenu.length/5)
        this.currentIndex = index
        this.currentName = value.name
        if(this.showMore==false && (num*266+40)>843){
          this.rightHeight = num*266+40
        }
        if(this.showMore==true && (num*266+40)>this.moreIndex * 151){
          this.rightHeight = num*266+40
        }
        if(this.showMore==true && (num*266+40)<this.moreIndex * 151){
          this.rightHeight = this.moreIndex * 151
        }
      }
    },
    showMoreIndex(){
      this.showMore = true
      this.moreIndex = this.navList.length
      this.rightHeight = this.moreIndex * 151
    },
    //获取二级菜单分类
    getGoodsMenu(id){
      let that = this
      mt_selectSecondMenu(id).then(data=>{
        // //console.log(data.data)
        that.navList = data.data
        if(data.data.length>0){
          that.currentName = that.navList[0].name
        }
      })
    },
    
    //前往商品分类
    goList(value){
      // //console.log(value)
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
    flex: 204px 0 0;
    width: 204px;
    min-height: 843px;
    margin-right: 10px;
    background-color: #ffffff;
    position: relative;
    &.scrollbar{
      overflow-y: scroll;
    }
    li{
      padding: 20px 0;
      border-bottom: 1px solid #ededed;
      &:last-child{
        border-bottom: none;
      }
      &.showMore{
        padding: 34px 0;
        height: 88px;
        font-size: 0;
        text-align: center;
        span{
          display: inline-block;
          font-size: 14px;
          line-height: 20px;
          color: #f08200;
          position: relative;
          &:hover{
            cursor: pointer;
            text-decoration: underline;
          }
          &::before{
            content: "";
            position: absolute;
            right: -25px;
            width: 20px;
            height: 20px;
            background: url('/static/icon/right.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        // img{
        //   display: inline-block;
        //   width: 20px;
        //   height: 20px;
        //   line-height: 88px;
        //   vertical-align: middle;
        // }
      }
      .fimg{
        display: block;
        width: 80px;
        height: 80px;
        margin: 0 auto;
      }
      .name{
        font-size: 14px;
        font-weight: bold;;
        line-height: 20px;
        text-align: center;
        margin-top: 10px;
        padding: 0 10px;
      }
      &.active{
        box-shadow: 0px 0px 10px 0px rgba(210, 207, 207, 0.67);
        border-bottom: 1px solid #ff7c00;
        .name{
          color: #f08200;
        }
      }
      .listmask{
        position: absolute;
        left: 220px;
        top: 0;
        z-index: 6;
        width: 1000px;
        min-height: 843px;
        background-color: #ffffff;
        .eName{
          font-size: 12px;
          line-height: 40px;
          color: #333333;
          padding-left: 16px;
          border-bottom: 1px solid #ededed;
        }
        .box{
          padding: 0 0 0 16px;
          .lItem{
            float: left;
            width: 180px;
            margin: 16px 16px 0 0;
            .img{
              width: 180px;
              height: 180px;
              position: relative;
              background-color: #f4f4f4;
              img{
                position: absolute;
                left: 50%;
                top:50%;
                transform: translate3d(-50%,-50%,0);
                max-width: 90%;
                max-height: 90%;
              }
            }
            .itms{
              margin-top: 16px;
              font-size: 14px;
              line-height: 14px;
              color: #333333;
              text-align: center;
              &:hover{
                cursor: pointer;
                color: $mainColor;
              }
            }
            
          }
        }
      }
    }
  }
}
</style>

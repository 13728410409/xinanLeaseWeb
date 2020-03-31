<template>
  <div>
    <head-top></head-top>
    <div class="hometop2">
      <div class="container box">
        <router-link tag="div" to="/" class="img" title="信安首页">
          <img src="/static/icon/logo_black.png" alt />
        </router-link>
        <div class="searchBox">
          <search></search>
        </div>
        <div class="shoppingcartBox">
          <shoppingcart></shoppingcart>
        </div>
      </div>
    </div>
    <div class="hometop3">
      <div class="container box">
        <span class="title">{{name2}}</span>
        <router-link tag="span" to="/newsCenter" class="nav">新闻中心</router-link>
        <span class="nav" @click="viewJoinInfo" v-if="!isLogin || userInfo.type!=4">加盟中心</span>
      </div>
    </div>
    <div class="container">
      <div class="listItem">
        <div class="eName">当前分类：{{name2}}</div>
        <div class="box">
          <div class="lItem" v-for="(item,index) of navList" :key="index" @click="goList(item)">
            <div class="img">
              <img v-if="item.img!=''" :src="item.img" />
              <img v-else src="/static/icon/logo.png" />
            </div>
            <div class="itms">{{item.name}}</div>
          </div>
          <div class="lItem" v-if="navList.length==0">
            <div class="noContent">暂无分类数据</div>
          </div>
        </div>
      </div>
    </div>

    <foot-guide></foot-guide>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import search from "@/components/search/search";
import shoppingcart from "@/components/shopping/shoppingcart";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { mt_selectSecondMenu, mt_selectFirstMenu } from "@/api/home";
import { mt_queryHotOrNewGoods } from "@/api/common";
export default {
  name: "home3",
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
      id1: "",
      id2: "",
      id3: '',
      name1: "", 
      name2: '',
      name3: '',
      navList: []
    };
  },
  computed: {
    ...mapState(["userInfo", "phoneInfo"])
  },
  watch: {},
  created() {
    this.id1 = this.$route.params.id1;
    this.id2 = this.$route.params.id2;
    if(this.id1){
      mt_selectFirstMenu().then(data => {
        data.data.forEach(item=>{
          if(item.id==this.id1){
            this.name1 = item.name
          }
        })
      });
    }
    this.getGoodsMenu(this.id1);
  },
  mounted() {
    //获取用户信息
  },
  methods: {
    //获取二级菜单分类
    getGoodsMenu(id) {
      let that = this;
      mt_selectSecondMenu(id).then(data => {
        // console.log(data.data);
        if (data.data.length > 0) {
          data.data.forEach(item => {
            if (item.id == that.id2) {
              that.name2 = item.name;
              that.navList = item.childMenu.length != 0 ? item.childMenu : [];
            }
          });
        }
      });
    },
    //前往商品分类
    goList(value) {
      // console.log(value)
      this.$router.push({
        name: "list",
        params: { 
          name: "", 
          menuId: value.id,
          id1: this.id1,
          name1: this.name1,
          id2: this.id2,
          name2: this.name2,
          id3: value.id,
          name3: value.name 
        }
      });
    },
    //查看加盟信息
    viewJoinInfo() {
      let jsonUserInfo = localStorage.getItem("userInfo");
      if (jsonUserInfo != null) {
        let userInfo = JSON.parse(jsonUserInfo);
        if (userInfo.angelState == 3) {
          if (userInfo.joinStatus == 0) {
            this.$router.push("/joinCenter");
          } else {
            this.$router.push("/join");
          }
        } else {
          this.$router.push("/joinAngle");
        }
      } else {
        this.$router.push("/joinCenter");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
@import "../../../node_modules/swiper/dist/css/swiper.min.css";
/deep/ .swiper-pagination-bullet-active {
  background-color: $mainColor !important;
}
.hometop3 {
  height: 40px;
  margin-bottom: 20px;
  background-color: #ffffff;
  .box {
    font-size: 0;
    span {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
    }
    .title {
      display: inline-block;
      width: 190px;
      margin-right: 20px;
      padding-left: 18px;
      color: #ffffff;
      background-color: $mainColor;
      cursor: hand;
    }
    .nav {
      margin-right: 72px;
      color: #333333;
      &:hover,
      &.active {
        color: $mainColor;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
// 主菜单、轮播及信息
.bannerBox {
  display: flex;
  min-height: 810px;
  margin-bottom: 20px;
  .nav {
    flex: 204px 0 0;
    width: 204px;
    min-height: 843px;
    margin-right: 10px;
    background-color: #ffffff;
    position: relative;
    &.scrollbar {
      overflow-y: scroll;
    }
    li {
      padding: 20px 0;
      border-bottom: 1px solid #ededed;
      &:last-child {
        border-bottom: none;
      }
      &.showMore {
        padding: 34px 0;
        height: 88px;
        font-size: 0;
        text-align: center;
        span {
          display: inline-block;
          font-size: 14px;
          line-height: 20px;
          color: #f08200;
          position: relative;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
          &::before {
            content: "";
            position: absolute;
            right: -25px;
            width: 20px;
            height: 20px;
            background: url("/static/icon/right.png") no-repeat;
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
      .fimg {
        display: block;
        width: 80px;
        height: 80px;
        margin: 0 auto;
      }
      .name {
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
        text-align: center;
        margin-top: 10px;
        padding: 0 10px;
      }
      &.active {
        box-shadow: 0px 0px 10px 0px rgba(210, 207, 207, 0.67);
        border-bottom: 1px solid #ff7c00;
        .name {
          color: #f08200;
        }
      }
      .listmask {
        position: absolute;
        left: 220px;
        top: 0;
        z-index: 6;
        width: 1000px;
        min-height: 843px;
        background-color: #ffffff;
        .eName {
          font-size: 12px;
          line-height: 40px;
          color: #333333;
          padding-left: 16px;
          border-bottom: 1px solid #ededed;
        }
        .box {
          padding: 0 0 0 16px;
          .lItem {
            float: left;
            width: 180px;
            margin: 16px 16px 0 0;
            .img {
              width: 180px;
              height: 180px;
              position: relative;
              background-color: #f4f4f4;
              img {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%, -50%, 0);
                max-width: 90%;
                max-height: 90%;
              }
            }
            .itms {
              margin-top: 16px;
              font-size: 14px;
              line-height: 14px;
              color: #333333;
              text-align: center;
              &:hover {
                cursor: pointer;
                color: $mainColor;
              }
            }
          }
        }
      }
    }
  }
  .listmask {
  }
}
.listItem {
  padding: 20px 0 30px 0;
  .eName {
    line-height: 30px;
    font-size: 16px;
    color: #333333;
  }
  .box {
    overflow: hidden;
    .lItem {
      float: left;
      width: 180px;
      margin: 16px 16px 0 0;
      .img {
        width: 180px;
        height: 180px;
        position: relative;
        background-color: #f4f4f4;
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          max-width: 90%;
          max-height: 90%;
        }
      }
      .itms {
        margin-top: 16px;
        font-size: 14px;
        line-height: 14px;
        color: #333333;
        text-align: center;
        &:hover {
          cursor: pointer;
          color: $mainColor;
        }
      }
    }
  }
}
.noContent {
  height: 200px;
}
</style>

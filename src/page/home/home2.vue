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
        <span class="title">{{name}}</span>
        <router-link tag="span" to="/newsCenter" class="nav">新闻中心</router-link>
        <span class="nav" @click="viewJoinInfo" v-if="!isLogin || userInfo.type!=4">加盟中心</span>
      </div>
    </div>
    <div class="container">
      <div class="listItem">
        <div class="eName">当前分类：{{name}}</div>
        <div class="box">
          <div class="lItem" v-for="(item,index) of navList" :key="index" @click="viewhome3(item)">
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
import {
  mt_selectSecondMenu,
  mt_lunboselectSecondAll,
  mt_querySecondPage
} from "@/api/home";
import { mt_queryHotOrNewGoods } from "@/api/common";
export default {
  name: "home2",
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
      pid: "",
      name: "", //1级菜单名称
      navList: []
    };
  },
  computed: {
    ...mapState(["userInfo", "phoneInfo"])
  },
  watch: {},
  created() {
    this.pid = this.$route.params.id;
    this.name = decodeURI(this.$route.params.name);
    this.getGoodsMenu(this.pid);
  },
  mounted() {
    //获取用户信息
  },
  methods: {
    //获取二级菜单分类
    getGoodsMenu(id) {
      let that = this;
      mt_selectSecondMenu(id).then(data => {
        // //console.log(data.data)
        if (data.data.length > 0) {
          that.navList = data.data;
        }
      });
    },
    // 查看三级菜单
    viewhome3(val) {
      // console.log(val);
      this.$router.push("/home3/" + this.pid+"/"+ val.id);
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

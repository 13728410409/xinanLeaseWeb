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
        <span class="title">商品分类</span>
        <!-- <span class="nav active">企业特购</span>
          <span class="nav">热门服务</span>
          <span class="nav">超值套餐</span>
        <span class="nav">关于我们</span>-->
        <span class="nav">
          <a href="#huoban">合作伙伴</a>
        </span>
        <span class="nav">
          <a href="#jiamengshang">全国加盟商</a>
        </span>
        <router-link tag="span" to="/newsCenter" class="nav">新闻中心</router-link>
        <span class="nav" @click="viewJoinInfo" v-if="!isLogin || userInfo.type!=4">加盟中心</span>
      </div>
    </div>
    <!-- 主菜单、轮播及信息 -->
    <div class="container bannerBox">
      <!-- 导航  -->
      <div class="nav">
        <ul>
          <li
            v-if="navList.length!==0 && index<6"
            v-for="(item,index) of navList"
            :key="index"
            @click="viewhome2(item)"
          >
            <span class="name">{{item.name}}</span>
            <!-- <div class="list ellipsis">
                <span class="itm" v-for="(items,indexs) of navList[index].list" v-if="indexs<2" :key="indexs" :title="items.name">{{items.name}}</span>
            </div>-->
          </li>
        </ul>
      </div>
      <!-- 轮播 -->
      <div class="homeswiper">
        <div class="mainswiper">
          <swiper v-if="swiperList.length > 0" :options="swiperOption" ref="mySwiper">
            <swiper-slide
              v-if="swiperList.length>0"
              v-for="(item,index) in swiperList"
              :key="index"
              :style="{ backgroundImage:'url('+item.imgUrl+')'}"
              class="swiperSlide"
            >
            <div v-if="item.jumpType==2" @click="viewDetail(item.record.id)" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;"></div>
            <div v-if="item.jumpType==1" @click="jump(item.record)" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;"></div>
              <!-- <img class="swiper-img" :src="item.url" alt=""> -->
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
      </div>
    </div>
    <!-- 排行榜 -->
    <div class="container main sort">
      <div class="title">
        <span>{{sortList.typeStr}}</span>
        <span class="circleBack"></span>
      </div>
      <div class="list">
        <div
          class="itm"
          v-if="sortList.goodsList.length!=0"
          v-for="(item,index) of sortList.goodsList"
          :key="index"
          @click="viewDetail(item.id)"
        >
          <div class="img">
            <img :src="item.img" />
          </div>
          <div class="des ellipsis2" :title="item.proIntroduction">{{item.proIntroduction}}</div>
          <div class="price">
            <i>￥</i>
            <span>{{item.money}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 商务首选 -->
    <div
      class="container main product"
      v-if="productList.length!==0"
      v-for="(item,index) of productList"
      :key="index">
      <div class="typesign">
        <div class="title">
          <span>{{item.typeStr}}</span>
          <span class="circleBack"></span>
        </div>
        <div class="signimg" v-for="(items,indexs) of item.goodsList" :key="indexs" v-if="indexs<1" @click="viewDetail(items.id)">
          <img :src="items.img" alt />
        </div>
      </div>

      <div class="list">
        <div
          class="itm"
          v-for="(items,indexs) of item.goodsList"
          v-if="indexs>=1"
          :key="indexs"
          @click="viewDetail(items.id)"
        >
          <div class="img">
            <img :src="items.img" alt />
          </div>
          <div class="info">
            <div class="des ellipsis4" :title="item.proIntroduction">{{items.proIntroduction}}</div>
            <div class="price">
              <i>￥</i>
              <span>{{items.money}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 合作伙伴 -->
    <div class="hzhb" style="margin-top:56px;">
      <div class="container box">
        <div class="title">
          <a href="#" name="huoban">合作伙伴</a>
        </div>
        <div class="list">
          <div
            class="itm"
            v-if="partnersList.length!==0"
            v-for="(item,index) of partnersList"
            :key="index"
          >
            <img :src="item.img" alt />
          </div>
        </div>
      </div>
    </div>
    <!-- 全国加盟商 -->
    <div class="hzhb">
      <div class="container box">
        <div class="title">
          <a href="#" name="jiamengshang">全国加盟商</a>
          <span class="contact">
            加盟热线
            <span>{{phoneInfo.hotPhone}}</span>
          </span>
        </div>
        <div class="list">
          <div
            class="itm"
            v-if="allianceBusiness"
            v-for="(item,index) of allianceBusiness"
            :key="index"
          >
            <img :src="item.logo" alt />
          </div>
        </div>
      </div>
    </div>
    <!-- 突出点 -->
    <div class="character">
      <div class="container box">
        <div class="item">
          <div class="icon">
            <img src="/static/icon/zlbz.png" alt />
          </div>
          <div class="name">质量保证</div>
          <div class="tx">正品保证、提供发票</div>
        </div>
        <div class="item">
          <div class="icon">
            <img src="/static/icon/jswl.png" alt />
          </div>
          <div class="name">急速物流</div>
          <div class="tx">如约送货、送货入户</div>
        </div>
        <div class="item">
          <div class="icon">
            <img src="/static/icon/tsfw.png" alt />
          </div>
          <div class="name">特色服务</div>
          <div class="tx">企业定制套餐</div>
        </div>
        <div class="item">
          <div class="icon">
            <img src="/static/icon/bzzx.png" alt />
          </div>
          <div class="name">帮助中心</div>
          <div class="tx">企业设备指南</div>
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
import { mt_selectFirstMenu, mt_lunbo, mt_queryHomeGoods } from "@/api/home";
import { mt_queryPartners, mt_queryAllianceBusiness } from "@/api/common";
let vm = null;
export default {
  name: "home",
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
      navList: [],
      swiperList: [],
      swiperOption: {
        pagination: '.swiper-pagination',
        notNextTick: true,
        // autoplay: 3000,
        direction: 'horizontal',
        grabCursor: true,
        setWrapperSize: true,
        autoHeight: true,
        paginationClickable: true,
        mousewheelControl: true,
        observeParents: true,
        loop: true,
      },
      sortList: { goodsList: [] },
      swiperOption1: {
        autoplay: false,
        slidesPerView: 4
      },

      productList: [],
      partnersList: [],
      allianceBusiness: []
    };
  },
  computed: {
    ...mapState(["userInfo", "phoneInfo"])
  },
  created() {
    vm = this
    if (
      localStorage.getItem("userInfo") != "null" &&
      localStorage.getItem("userInfo") != null
    ) {
      this.isLogin = this.userInfo.token != null ? true : false;
      this.userName = this.userInfo.phone;
    }
    //获取首页商品类型
    this.getGoodsMenu();
    //获取首页轮播图
    this.getLunbo();
    //获取商品
    this.getGoods();
    //获取合作伙伴
    this.getPartners();
    //获取首页加盟商
    this.getAllianceBusiness();
  },
  mounted() {
    //获取用户信息
  },
  methods: {
    //获取一级菜单分类
    getGoodsMenu() {
      let that = this;
      mt_selectFirstMenu().then(data => {
        // console.log(that.isArray(data.data))
        that.navList = data.data;
      });
    },
    //获取首页轮播图
    getLunbo() {
      let that = this;
      mt_lunbo().then(data => {
        // console.log(data.data)
        data.data.forEach(item=>{
          if(item.jumpType==2){
            item.record = JSON.parse(item.record)
          }
        })
        that.swiperList = data.data;
      });
    },
    //获取商品
    getGoods() {
      let that = this;
      mt_queryHomeGoods().then(data => {
        that.sortList = data.data[0];
        that.productList = [];
        that.productList.push(data.data[1]);
        that.productList.push(data.data[2]);
        console.log(that.productList);
      });
    },
    //获取合作伙伴
    getPartners() {
      let that = this;
      mt_queryPartners().then(data => {
        that.partnersList = data.data.data;
      });
    },
    //获取首页加盟商
    getAllianceBusiness() {
      let that = this;
      mt_queryAllianceBusiness().then(data => {
        // console.log(data.data.data);
        that.allianceBusiness = data.data.data;
      });
    },

    //切换登录方式
    selectService_goods(val) {
      this.service_goods = val;
    },
    // 查看二级菜单
    viewhome2(val) {
      localStorage.setItem("home2", JSON.stringify(val));
      this.$router.push("/home2/" + val.id);
    },
    //查看详情
    viewDetail(val) {
      this.$router.push("/goodsdetail/" + val);
    },
    jump(val){
      console.log(val)
    },
    //查看加盟信息
    viewJoinInfo() {
      let jsonUserInfo = localStorage.getItem('userInfo')
      if (jsonUserInfo!=null) {
        let userInfo = JSON.parse(jsonUserInfo)
        console.log(userInfo)
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
  height: 480px;
  margin-bottom: 20px;
  .nav {
    flex: 190px 0 0;
    width: 190px;
    height: 480px;
    margin-right: 10px;
    background-color: #ffffff;
    li {
      height: 80px;
      line-height: 80px;
      padding: 0 20px;
      &:hover {
        cursor: pointer;
        box-shadow: 0px 0px 10px 0px rgba(210, 207, 207, 0.67);
        .list {
          border-bottom: none;
        }
      }
      &:last-child {
        .name {
          border-bottom: none;
        }
      }
      .name {
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 14px;
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }
  .homeswiper {
    flex: 1;
    width: 1000px;
    height: 480px;
    background-color: #ffffff;
    .mainswiper {
      height: 480px;
      overflow: hidden;
      .swiperSlide {
        height: 480px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
    }
  }
}
// 排行榜
.main {
  margin-bottom: 20px;
  background-color: #ffffff;
  .title {
    padding-bottom: 18px;
    font-size: 0;
    line-height: 24px;
    span {
      display: inline-block;
      font-size: 24px;
      line-height: 24px;
      color: #333333;
      font-weight: bold;
      vertical-align: middle;
    }
    .circleBack {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-left: 10px;
      background: url(/static/icon/circleBack.png) no-repeat center center;
    }
  }
}
.sort {
  padding: 20px;
  .list {
    display: flex;
    .itm {
      flex: 1;
      width: 224px;
      min-height: 296px;
      margin-right: 10px;
      padding: 20px;
      background-color: #ffffff;
      box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.5);
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        box-shadow: 0px 0px 5px 0px rgba(200, 200, 200, 0.8);
      }
      .img {
        width: 100%;
        height: 184px;
        position: relative;
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          max-width: 184px;
          max-height: 184px;
        }
      }
      .des {
        margin-top: 10px;
        font-size: 12px;
        color: #333333;
        line-height: 20px;
      }
      .price {
        margin-top: 12px;
        line-height: 18px;
        display: flex;
        i {
          font-size: 12px;
          color: $mainColor;
        }
        span {
          font-size: 18px;
          color: $mainColor;
        }
      }
    }
  }
}
.product {
  background-color: transparent;
  display: flex;
  .typesign {
    flex: 290px 0 0;
    width: 290px;
    height: 300px;
    padding: 20px;
    background-color: #ffffff;
    .signimg {
      padding: 0 18px;
      position: relative;
      img {
        max-width: 217px;
      }
    }
  }
  .list {
    flex: 1;
    width: 900px;
    height: 300px;
    margin-left: 10px;
    overflow: hidden;
    .itm {
      float: left;
      width: 293px;
      height: 146px;
      margin: 0 10px 10px 0;
      padding: 20px 10px;
      background-color: #ffffff;
      overflow: hidden;
      display: flex;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &:nth-child(4),
      &:nth-child(5),
      &:nth-child(6) {
        margin-bottom: 0;
      }
      &:hover {
        box-shadow: 0px 0px 5px 0px rgba(200, 200, 200, 0.8);
      }
      .img {
        flex: 110px 0 0;
        width: 110px;
        height: 106px;
        position: relative;
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          max-width: 110px;
          max-height: 106px;
        }
      }
      .info {
        flex: 1;
        margin-left: 15px;
        .des {
          height: 80px;
          line-height: 20px;
          font-size: 13px;
          color: #333333;
        }
        .price {
          display: flex;
          height: 20px;
          line-height: 20px;
          i {
            font-size: 12px;
            color: $mainColor;
          }
          span {
            font-size: 18px;
            color: $mainColor;
          }
        }
      }
    }
  }
}
.character {
  background-color: #ffffff;
  .box {
    padding: 20px 0;
    display: flex;
    justify-content: justify-conten;
    .item {
      flex: 1;
      text-align: center;
      padding: 25px 0 30px 0;
      .icon {
        height: 50px;
        text-align: center;
      }
      .name {
        margin-top: 12px;
        font-size: 16px;
        line-height: 16px;
        color: #333333;
      }
      .tx {
        margin-top: 8px;
        font-size: 14px;
        line-height: 16px;
        color: #999999;
      }
    }
  }
}
.hzhb {
  background-color: #ffffff;
  .box {
    padding-bottom: 40px;
    border-bottom: 1px solid #eaeaea;
    .title {
      padding: 50px 0 35px 0;
      font-size: 24px;
      font-weight: bold;
      line-height: 24px;
      color: #333333;
      .contact {
        float: right;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        span {
          margin-left: 5px;
          font-size: 18px;
          font-weight: bold;
          color: $mainColor;
        }
      }
    }
    .list {
      overflow: hidden;
      .itm {
        float: left;
        width: 166px;
        height: 75px;
        margin: 0 40px 10px 0;
        padding: 2px 4px;
        background-color: #ffffff;
        // box-shadow: 0px 0px 3px 0px #d0d0d0;
        border-radius: 5px;
        text-align: center;
        &:nth-child(6n) {
          margin-right: 0;
        }
        img {
          display: inline-block;
          height: 100%;
        }
      }
    }
  }
}
</style>

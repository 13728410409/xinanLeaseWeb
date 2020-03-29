<template>
  <div class="assets">
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="wrapper" ref="wrapper" @scroll="gd_add">
        <div class="listItem">
          <div class="accountBox">
            <div class="itm">
              <div class="t">账户总额（元）</div>
              <div class="v">{{userInfoData.money}}</div>
              <!-- <view class="recharge" bindtap="recharge">充值</view> -->
            </div>
          </div>
          <div class="orderList">
            <div class="item" v-for="item of moneylogList" :key="index">
              <div class="l">
                <div class="title">{{item.changeType | filterChangeType}}</div>
                <div class="time">{{item.createTime | filterTime}}</div>
              </div>
              <div class="r">{{item.money}}</div>
            </div>
            <div class="noContent" v-if="moneylogList.length==0">暂无数据</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headertop from "@/components/mobile/header";
import { mt_getuserInfo, mt_leaseMoneyDetail } from "@/api/my";
import { formatDate } from "@/config/often";
export default {
  name: "assets",
  components: {
    headertop
  },
  data() {
    return {
      page: 1,
      limit: 15,
      list: [],
      count: 0,
      headValue: "我的资产",
      moneylogList: [],
      userInfoData: {}
    };
  },
  watch: {},
  filters: {
    // 1.充值 2.提现 3.收益
    filterChangeType(val) {
      if (val == 1) {
        return "充值";
      } else if (val == 2) {
        return "提现";
      } else if (val == 3) {
        return "下单";
      } else if (val == 4) {
        return "加盟入驻";
      } else if (val == 5) {
        return "天使入驻";
      } else {
        return "其它";
      }
    },
    filterTime(val) {
      return formatDate(val, "yyyy-MM-dd hh:mm:ss");
    },
  },
  created() {
    this.getUserInfo();
    this.getMoneyLog();
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取个人信息
    getUserInfo() {
      let that = this;
      mt_getuserInfo().then(data => {
        // console.log(data.data);
        that.userInfoData = data.data;
        that.setUserInfo(data.data);
      });
    },
    //加载更多商品
    gd_add() {
      let wrap_height = document.getElementsByClassName("wrapper")[0]
        .offsetHeight; //容器的高度
      let scroll_top = document.getElementsByClassName("wrapper")[0].scrollTop; //滚动条的scrolltop
      let scroll_height = document.getElementsByClassName("listItem")[0]
        .offsetHeight; //内容的高度
      let is_height = scroll_height - wrap_height - scroll_top;
      if (is_height <0.1 && this.count > this.moneylogList.length) {
        if(!this.scrollBottom){
           this.page++;
           this.getMoneyLog();
           this.scrollBottom = true
        }
      }
    },
    //获取订单流水记录
    getMoneyLog() {
      let that = this;
      mt_leaseMoneyDetail(that.page, that.limit).then(data => {
        console.log(data.data);
        that.moneylogList = that.moneylogList.concat(data.data.data)
        that.count = data.data.count;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.mobile {
  .wrapper {
    position: fixed;
    top: 44px;
    bottom: 0;
    z-index: 2;
    width: 100%;
    overflow: scroll;
    .accountBox {
      height: 70px;
      padding: 15px 15px 0 15px;
      background: linear-gradient(90deg, #eb3c3c, #f08200);
      color: #fff;
    }
    .accountBox .itm {
      text-align: left;
      font-weight: bold;
      position: relative;
    }
    .accountBox .itm .t {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #fff;
    }
    .accountBox .itm .v {
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
      font-size: 20px;
      color: #fff;
    }
    .accountBox .itm .recharge {
      position: absolute;
      top: 10px;
      right: 15px;
    }
    .orderList .item {
      background-color: #ffffff;
      padding: 5px 15px;
      display: flex;
      font-size: 13px;
      color: #333;
      border-bottom: 1px solid #ddd;
    }
    .orderList .item .l {
      flex: 1;
    }
    .orderList .item .l .title {
      line-height: 30px;
      height: 30px;
      font-size: 14px;
    }
    .orderList .item .l .time {
      line-height: 20px;
      height: 20px;
      color: #999;
    }
    .orderList .item .r {
      flex: 0 70px 0;
      line-height: 50px;
      text-align: right;
    }
  }
}
</style>

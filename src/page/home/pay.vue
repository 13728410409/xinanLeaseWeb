<template>
  <div class="pays">
    <div class="header">
      <router-link tag="div" to="/" class="img" title="信安首页">
        <img src="/static/icon/logo.png" alt />
        <span>信安IT租赁</span>
      </router-link>
      <div class="u">
        <router-link tag="span" to="/" v-if="isLogin">{{tip}}</router-link>
        <router-link tag="span" to="/orderList" v-if="isLogin">我的订单</router-link>
      </div>
    </div>
    <div class="pay">
      <div class="box" v-if="detail.order">
        <div class="orderInfo">
          <div class="t">
            <p v-if="detail.order.orderState==1">订单提交成功，请尽快付款！</p>
            <p v-if="detail.order.orderState>1">订单已付款！</p>
            <p v-if="detail.order">订单号：{{detail.order.orderNum}}</p>
          </div>
          <div class="m" v-if="detail.order.orderState==1">
            应付：
            <span>{{detail.order.money}}</span>元
          </div>
          <div class="m" v-if="detail.order.orderState>1">
            已付：
            <span>{{detail.order.money}}</span>元
          </div>
        </div>
        <div class="goodsInfo">
          <p
            v-if="detail.order.consignee"
          >收货地址：{{detail.addressV}}&nbsp;&nbsp;收货人：{{detail.order.consignee | filterName}}&nbsp;&nbsp;{{detail.order.consigneePhone | filterPhone}}</p>
          <p v-if="detail.gDes">商品名称：{{detail.gDes}}</p>
        </div>
        <div class="payWay" v-if="detail.order.orderState==1">
          <div class="tab">
            <span :class="payType==1? 'active':''" @click="selectPayType(1)">微信</span>
            <span :class="payType==2? 'active':''" @click="selectPayType(2)">点击使用支付宝</span>
            <span :class="payType==3? 'active':''" @click="selectPayType(3)">对公账户打款</span>
          </div>
          <div class="val" v-if="payType==1">
            <div id="qrCode" ref="qrCodeDiv" style="width: 170px;margin: 0 auto;"></div>
            <div class="tx">使用微信扫一扫支付</div>
          </div>

          <el-row class="itm bankInfo" v-if="payType==3">
            <el-col :span="24">
              <el-col :span="24" class="tip">请根据以下对公账户进行打款</el-col>
              <el-col :span="6" class="name">帐户名称：</el-col>
              <el-col :span="18" class="val">{{bankInfo.name}}</el-col>
              <el-col :span="6" class="name">收款账户：</el-col>
              <el-col :span="18" class="val">{{bankInfo.number}}</el-col>
              <el-col :span="6" class="name">银行账户：</el-col>
              <el-col :span="18" class="val">{{bankInfo.bankName}}</el-col>
              <el-col :span="6" class="name">银行地址：</el-col>
              <el-col :span="18" class="val">{{bankInfo.bankCity}}</el-col>
              <el-col :span="6" class="name">开户网点：</el-col>
              <el-col :span="18" class="val">{{bankInfo.bankDian}}</el-col>
              <!-- <div v-if="weixinFlag" id="qrCode1" ref="qrCode1" style="width: 170px;margin: 0 auto;"></div> -->
              <!-- <div class="btnRechargeStatus" @click="rechargeAccount">立即充值</div> -->
            </el-col>
          </el-row>
        </div>
      </div>
      <error v-else></error>
      <!-- <div id="qrCode" ref="qrCodeDiv" style="width: 170px;margin: 0 auto;"></div> -->
    </div>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import footGuide from "@/components/footer/footGuide";
import error from "@/components/error/error";
import axios from "axios";
import QRCode from "qrcodejs2";
import { httpUrl } from "@/api/httpUrl";
import {
  mt_getOrderDetail,
  mt_payByPc,
  mt_wxpayByPc,
  mt_validateIsPaySuccess,
  mt_querySystemBank
} from "@/api/order";
export default {
  name: "pay",
  components: {
    footGuide,
    error
  },
  data() {
    return {
      id: "",
      detail: {},
      isLogin: false,
      tip: "",
      payType: 1,
      bankInfo: {}, //对公账号信息

      lxtimer: null //轮询定时器
    };
  },
  watch: {},
  filters: {
    filterPhone(val) {
      return val.substr(0, 3) + "****" + val.substr(7);
    },
    filterName(val) {
      return new Array(val.length).join("*") + val.substr(-1);
    }
  },
  created() {
    //获取用户信息
    if (
      localStorage.getItem("userInfo") != "null" &&
      localStorage.getItem("userInfo") != null
    ) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.isLogin = userInfo.token != null ? true : false;
      this.tip =
        userInfo.nickName != null
          ? userInfo.nickName
          : userInfo.phone.substr(0, 3) + "****" + userInfo.phone.substr(7);
    }
    this.id = this.$route.params.id;
    this.getOrderDetail(this.id);
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取我的订单
    getOrderDetail(id) {
      let that = this;
      this.orderList = [];
      mt_getOrderDetail(id).then(data => {
        console.log(data.data);
        let gDes = "";
        if (data.data.order.id != "") {
          data.data.goods.forEach(item => {
            gDes += item.proIntroduction + ",";
          });
          data.data.gDes = gDes;
          that.detail = data.data;
          that.detail.addressV = data.data.order.address
            ? data.data.order.address.split(",").join("")
            : "";
          if (data.data.order.orderState == 2) {
            that.$message({
              message: "订单已支付成功，自动返回首页",
              type: "success",
              duration: 1000
            });
            setTimeout(() => {
              that.$router.push("/");
            }, 1000);
          } else if (data.data.order.orderState == 1) {
            that.getWxCodeUrl(that.id);
          }
        }
      });
    },
    selectPayType(type) {
      let that = this;
      if(that.payType!=type){
        that.payType = type;
        if (type == 1) {
          that.getWxCodeUrl(that.id);
        } else if (type == 2) {
          that.payAlipay();
          that.destriyQrcode()
          clearTimeout(that.lxtimer);
        } else if (type == 3) {
          that.querySystemBank();
          that.destriyQrcode()
          clearTimeout(that.lxtimer);
        }
      }
      
    },
    //微信支付
    getWxCodeUrl(id) {
      let that = this,
        title = "微信网页支付";
      mt_wxpayByPc(id, title).then(data => {
        console.log(data.data);
        data.data.forms = JSON.parse(data.data.form);
        that.useqrcode(data.data);
      });
    },
    //生成分享链接二维码
    useqrcode(url) {
      let that = this;
      setTimeout(function() {
        new QRCode(that.$refs.qrCodeDiv, {
          text: url.forms.code_url,
          width: 170,
          height: 170,
          colorDark: "#333333", //二维码颜色
          colorLight: "#ffffff", //二维码背景色
          correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
        });
        let timestamp = new Date().getTime() + 60 * 1000;
        that.validateIsPaySuccess(url.outTradeNo, timestamp);
      }, 100);
    },
    // 销毁微信二维码
    destriyQrcode() {
      // console.log('------销毁微信二维码-----')
      var wxcode = document.getElementById("qrCode");
      if(wxcode!=null){
        var childs = wxcode.childNodes;
        if (childs != null) {
          for (var i = childs.length - 1; i >= 0; i--) {
            wxcode.removeChild(childs[i]);
          }
        }
      }
    },
    // 支付宝支付
    payAlipay() {
      let that = this,
        title = "支付宝网页支付";
      mt_payByPc(that.id, title).then(data => {
        console.log(data.data);
        that.html = data.data.form;
        var form = data.data.form;
        const div = document.createElement("div");
        div.innerHTML = form;
        document.body.appendChild(div);
        document.forms[0].target = "_blank";
        document.forms[0].submit();
        clearTimeout(that.lxtimer);
        console.log(that.lxtimer)
        that
          .$confirm(
            "如果已经支付完成请点击下方‘支付完成’按钮！",
            "订单支付提示",
            {
              confirmButtonText: "支付完成",
              cancelButtonText: "取消",
              showClose: false
            }
          )
          .then(() => {
            let timestamp = new Date().getTime() + 60 * 1000;
            that.validateIsPaySuccess(data.data.outTradeNo, timestamp);
          })
          .catch(() => {
            clearTimeout(that.lxtimer);
          });
      });
    },
    //轮询微信支付是否成功
    validateIsPaySuccess(outTradeNo, time) {
      let that = this;
      let timestamp = new Date().getTime();
      if (timestamp <= time) {
        mt_validateIsPaySuccess(outTradeNo).then(data => {
          console.log(data);
          if (data.data == 1) {
            that.destriyQrcode();
            clearTimeout(that.lxtimer);
            that.$message.success("支付成功");
            that.$router.push("/orderList");
          } else {
            that.lxtimer = setTimeout(function() {
              that.validateIsPaySuccess(outTradeNo, time);
            }, 1000);
          }
        });
      } else {
        clearTimeout(that.lxtimer);
        that.$alert("操作超时，请点击重试支付", "订单支付提示", {
          confirmButtonText: "重新支付",
          showClose: false,
          callback: action => {
            // that.destriyQrcode();
            clearTimeout(that.lxtimer);
            if (that.payType == 1) {
              that.destriyQrcode();
              that.getWxCodeUrl(this.id);
            } else if (that.payType == 2) {
              that.payAlipay();
            }
          }
        });
      }
    },
    //获取对公账号信息
    querySystemBank() {
      mt_querySystemBank().then(data => {
        console.log(data.data);
        this.bankInfo = data.data;
        clearTimeout(this.lxtimer);
      });
    }
  },
  beforeDestroy() {
    // this.destriyQrcode()
    clearTimeout(this.lxtimer);
  },
  destroyed() {
    clearTimeout(this.lxtimer);
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.pays {
  background-color: #ffffff;
}
.header {
  width: 900px;
  margin: 0 auto;
  display: flex;
  font-size: 14px;
  color: #666666;
  .img {
    flex: 1;
    display: flex;
    padding: 2px 0;
    img {
      max-height: 42px;
    }
    span {
      margin-left: 8px;
      line-height: 46px;
    }
  }
  .u {
    display: flex;
    padding: 18px 0;
    span {
      line-height: 14px;
      padding: 0 15px;
      font-size: 14px;
      color: #666666;
      border-right: 1px solid #dddddd;
      &:last-child {
        border-right: none;
      }
      &:hover {
        cursor: pointer;
        color: $mainColor;
      }
    }
  }
}

.pay {
  background: url(/static/icon/pay_bg.jpg) no-repeat center -120px;
  background-size: 70%;
  .box {
    width: 900px;
    margin: 30px auto 50px;
    background-color: #fff;
    padding: 30px;
    box-shadow: 0 6px 32px rgba(0, 0, 0, 0.13);
    .orderInfo {
      display: flex;
      padding-bottom: 10px;
      border-bottom: 1px solid #f1f1f1;
      .t {
        flex: 1;
        p {
          line-height: 26px;
          height: 26px;
          overflow: hidden;
          color: #333;
          font-weight: 400;
          font-size: 14px;
        }
      }
      .m {
        span {
          color: #e31613;
          font-weight: bold;
        }
      }
    }
    .goodsInfo {
      padding: 20px 0;
      border-bottom: 1px solid #f1f1f1;
      p {
        line-height: 26px;
        overflow: hidden;
        color: #333;
        font-weight: 400;
        font-size: 14px;
      }
    }
    .payWay {
      padding: 20px 0;
      padding-bottom: 10px;
      .tab {
        line-height: 40px;
        span {
          display: inline-block;
          padding: 0 15px;
          line-height: 16px;
          height: 16px;
          font-size: 16px;
          border-right: 1px solid #dddddd;
          &:last-child {
            border-right: none;
          }
          &.active,
          &:hover {
            cursor: pointer;
            color: $mainColor;
          }
        }
      }
      .val {
        .tx {
          padding: 10px 0;
          text-align: center;
          font-size: 14px;
          color: #666666;
        }
      }
      .itm {
        width: 500px;
        margin: 0 auto;
        padding-top: 40px;
        margin-top: 20px;
        .name {
          line-height: 40px;
          font-size: 14px;
        }
        .val {
          line-height: 40px;
          font-size: 14px;
        }
        &.bankInfo {
          padding: 15px 0;
          border: 1px solid #f1f1f1;
          background-color: #f5f5f5;
          .tip {
            line-height: 40px;
            font-size: 14px;
            color: #f08200;
            padding-left: 30px;
          }
          .name {
            text-align: right;
            padding-right: 10px;
          }
          .val {
            padding-left: 10px;
          }
        }
      }
    }
  }
  .err {
    width: 900px;
    margin: 30px auto 50px;
    line-height: 600px;
    text-align: center;
    font-size: 14px;
  }
}
</style>

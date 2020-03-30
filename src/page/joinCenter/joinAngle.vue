<template>
  <div>
    <head-top></head-top>
    <account-head></account-head>
    <div class="company">
      <div class="container box">
        <div class="ownlist">
          <div class="aslide">
            <!-- <router-link tag="div" to="/accountSet" class="itm">返回</router-link> -->
            <div class="itm tit">加盟中心</div>
            <div class="itm active">天使入驻</div>
          </div>
          <div class="main">
            <div class="top">
              <div class="n">入驻信息</div>
              <div class="step">
                <el-steps :space="200" :active="step" finish-status="success">
                  <el-step title="填写资料"></el-step>
                  <el-step title="等待支付"></el-step>
                  <el-step title="加盟成功"></el-step>
                </el-steps>
              </div>
            </div>
            <div class="mInfo">
              <div class="cInfo" v-if="userInfo.angelState!=3">
                <div class="title">天使加盟费用缴纳</div>
                <div class="showInfo" v-if="userInfo.angelState!=1">
                  <div class="authenticationSuccess authenting" v-if="userInfo.angelState==0"></div>
                  <div class="topEwm">
                    <div class="img">
                      <span>微信企业付款码</span>
                      <div id="qrCode" ref="qrCodeDiv" style="width: 170px;height:170px;margin: 0 auto;"></div>
                      <span class="refresh" @click="getNewInfo">支付完成后请点击刷新</span>
                    </div>
                    <div class="alipay">
                      <span @click="payAlipay">立即支付宝支付</span>
                      <img src="/static/icon/alipay.png" alt @click="payAlipay" />
                    </div>
                  </div>
                </div>
                <div class="showInfo" v-if="userInfo.angelState==1">
                  <div class="authenticationSuccess"></div>
                  <div class="tip">尊敬的“{{tip}}”用户，您已成功在信安IT租赁平台加盟为天使！</div>
                  <div class="tip">每个被您邀请成功入驻金牌的用户都将给您带来收益</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import accountHead from "@/components/accountHead/accountHead";
import { checkDouble } from "@/config/often";
import QRCode from "qrcodejs2";
import { mt_getuserInfo, mt_wxpayByAngel, mt_alipayByAngel } from "@/api/my";
import cityData from "../../../static/other/city.json";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "goldjoin",
  components: {
    headTop,
    footGuide,
    accountHead
  },
  data() {
    return {
      step: 0, //步骤
      tip: '',
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  watch: {
    //监听图片变化
    yyzz(newValue, oldValue) {
      if (newValue != oldValue) {
        // //console.log(this.eHeadImg)
      }
    }
  },
  filters: {
    
  },
  created() {
    this.getUserInfo()
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo"]),
    //获取个人信息
    getUserInfo() {
      let that = this;
      mt_getuserInfo().then(data => {
        //console.log(data.data)
        that.setUserInfo(data.data);
        if(this.userInfo.angelState==0){
          this.step = 2
          this.getCompanyInfo();
        }else if(this.userInfo.angelState==1){
          this.step = 3
        }else if(this.userInfo.angelState==3){
          this.$message.warning('地址有误，返回首页')
          this.$router.push('/')
        }
        this.tip =  that.userInfo.nickName != null ? that.userInfo.nickName : that.userInfo.phone.substr(0, 3) + "****" + that.userInfo.phone.substr(7)
      });
    },
    //获取天使加盟信息
    getCompanyInfo() {
      let that = this;
      //console.log(this.userInfo.angelState)
      if(this.userInfo.angelState!=1){
        mt_wxpayByAngel().then(data => {
          // //console.log(data.data);
          data.data.forms = JSON.parse(data.data.form)
          that.useqrcode(data.data);
        });
      }
    },
    getNewInfo() {
      this.destriyQrcode();
      this.getUserInfo();
    },
    // 销毁微信二维码
    destriyQrcode() {
      // //console.log('------销毁微信二维码-----')
      var wxcode = document.getElementById("qrCode");
      var childs = wxcode.childNodes;
      if (childs != null) {
        for (var i = childs.length - 1; i >= 0; i--) {
          wxcode.removeChild(childs[i]);
        }
      }
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
      }, 100);
    },
    // 支付宝支付
    payAlipay() {
      let that = this;
      mt_alipayByAngel().then(data => {
        //console.log(data.data);
        that.html = data.data.form;
        var form = data.data.form;
        const div = document.createElement("div");
        div.innerHTML = form;
        document.body.appendChild(div);
        document.forms[0].target = '_blank'
        document.forms[0].submit();
        that.$confirm('如果已经支付完成请点击下方‘支付完成’按钮！', '天使加盟费支付提示', {
          confirmButtonText: '支付完成',
          cancelButtonText: '取消',
          showClose: false,
        }).then(() => {
          that.getCompanyInfo()
        }).catch(() => {
        }); 

      });
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
/deep/ .el-button--danger {
  color: #fff;
  background-color: $mainColor;
  border-color: $mainColor;
}
/deep/ .el-button--danger:hover {
  background-color: $mainHoverColor;
  border-color: $mainHoverColor;
}
.el-button--primary {
  background-color: $mainColor !important;
  border-color: $mainColor !important;
}
.el-button--primary:hover {
  background-color: $mainHoverColor !important;
  border-color: $mainHoverColor !important;
}
.company {
  padding: 30px 0 80px 0;
  .box {
    .ownlist {
      display: flex;
      .aslide {
        flex: 116px 0 0;
        width: 116px;
        padding-top: 15px;
        background-color: #ffffff;
        .itm {
          padding: 15px 0 15px 15px;
          font-size: 14px;
          line-height: 14px;
          color: #333333;
          &.active,
          &:hover {
            color: $mainColor;
            cursor: pointer;
          }
          &.tit {
            font-weight: bold;
            color: #333333;
          }
        }
      }
      .main {
        min-height: 700px;
        flex: 1;
        margin-left: 20px;
        padding: 20px;
        background-color: #ffffff;
        .top {
          display: flex;
          margin-bottom: 30px;
          .n {
            flex: 1;
            padding-top: 20px;
            font-size: 16px;
            line-height: 16px;
            color: #333333;
          }
          .step {
            flex: 500px 0 0;
            width: 500px;
          }
        }
        .mInfo {
          border: 1px solid #e6e6e6;
          .cInfo {
            .title {
              line-height: 40px;
              padding-left: 20px;
              font-size: 14px;
              font-weight: bold;
              color: #333333;
              background-color: #f7f7f7;
            }
            .vBox {
              padding: 20px;
              .input {
                margin-top: 30px;
                border: 1px solid #dddddd;
                &.noborder {
                  border: none;
                }
                input {
                  width: 100%;
                  height: 48px;
                  line-height: 48px;
                  outline: 0;
                  padding: 0 18px;
                  font-size: 14px;
                }
                .getCode {
                  display: block;
                  width: 118px;
                  height: 36px;
                  line-height: 36px;
                  margin-top: 6px;
                  text-align: center;
                  font-size: 14px;
                  color: #ffffff;
                  background-color: $mainColor;
                  border-radius: 4px;
                  &:hover {
                    cursor: pointer;
                    background-color: $mainHoverColor;
                  }
                }
                .btnlogin {
                  display: block;
                  width: 100%;
                  height: 48px;
                  line-height: 48px;
                  text-align: center;
                  background-color: $mainColor;
                  color: #ffffff;
                  font-size: 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  &:hover {
                    background-color: $mainHoverColor;
                  }
                }
              }
            }
            .showInfo {
              padding: 30px 20px;
              position: relative;
              .tip {
                font-size: 14px;
                color: #f08200;
                line-height: 30px;
                text-align: center;
              }
              .topEwm {
                text-align: center;
                font-size: 0;
                display: flex;
                .img {
                  flex: 1;
                  span {
                    display: inline-block;
                    line-height: 30px;
                    font-size: 14px;
                    color: #666666;
                  }
                  .refresh {
                    font-size: 14px;
                    color: #f08200;
                    line-height: 30px;
                    cursor: pointer;
                  }
                }
                .alipay {
                  flex: 1;
                  padding-top: 70px;
                  font-size: 18px;
                  font-weight: bold;
                  color: #333333;
                  img {
                    display: block;
                    margin: 0 auto;
                    width: 60px;
                    height: 60px;
                    cursor: pointer;
                  }
                  span {
                    display: inline-block;
                    line-height: 30px;
                    font-size: 14px;
                    color: #666666;
                    cursor: pointer;
                  }
                }
              }
              .authenticationSuccess {
                position: absolute;
                right: 20px;
                top: 30px;
                z-index: 99;
                width: 170px;
                height: 170px;
                background: url(/static/icon/success.png) no-repeat center
                  center;
                &.authenting {
                  background: url(/static/icon/authenting.png) no-repeat center
                    center;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="login">
    <div class="container">
      <div class="fl login_bg">
        <router-link tag="img" to="/" :src="logo_white" title="点击前往信安IT租赁首页"></router-link>
      </div>
      <div class="fr login_input">
        <div class="box">
          <div class="logo">
            <router-link tag="img" to="/" :src="logo_black" title="点击前往信安IT租赁首页"></router-link>
          </div>
          <div class="login_input_area">
            <div class="tab">
              <span :class="loginWay==1?'active':''" @click="selectloginway(1)">手机快捷登录</span>
              <span :class="loginWay==2?'active':''" @click="selectloginway(2)">账号密码</span>
            </div>
            <div class="input" v-if="loginWay==1">
              <input type="text" placeholder="输入手机号" maxlength="11" v-model="phone" />
            </div>
            <div class="input" v-if="loginWay==1">
              <el-row class="item">
                <el-col :span="16">
                  <input
                    type="text"
                    placeholder="输入验证码"
                    maxlength="6"
                    v-model="code"
                    @keyup.enter="login_but"
                  />
                </el-col>
                <el-col :span="8">
                  <span class="getCode" v-if="noClick" @click="sendMessage" title="点击发送短信验证码">发送验证码</span>
                  <span class="getCode gray" v-if="!noClick" title="请不要频繁发送短信哦！">{{countdown}}</span>
                </el-col>
              </el-row>
            </div>
            <div class="input" v-if="loginWay==2">
              <input type="text" placeholder="输入手机号" maxlength="11" v-model="phone" />
            </div>
            <div class="input" v-if="loginWay==2">
              <input
                type="password"
                placeholder="请输入密码"
                v-model="password"
                autocomplete="new-password"
                @keyup.enter="login_but"
              />
            </div>
            <div class="input noborder">
              <span class="btnlogin" @click="login_but">登录</span>
            </div>
            <div class="tip">
              <router-link tag="span" to="editPsd">修改密码</router-link>
              <router-link tag="span" to="register" class="reg">暂无账户？去注册</router-link>
            </div>
            <div class="agreement">
              登录即代表同意
              <el-button type="text" class="ud" @click="viewAgreement">《信安用户协议》</el-button>
            </div>
            <div class="fastLogin">
              <div class="title">
                <span>第三方登录</span>
              </div>
              <div class="loginBtn" @click="loginByWechat">
                <div class="img">
                  <img src="/static/icon/wechat_white.png" alt />
                </div>
                <span class="weixin">微信</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <foot-guide></foot-guide>
    <!-- 微信登录弹窗 -->
    <div class="login_box_wrapper" v-if="dialogWechat">
      <span class="close el-icon-close" title="关闭微信登录" @click="close"></span>
      <div
        id="login_container"
        style="position:absolute;left:50%;top:50%;transform: translate3d(-50%,-50%,0);"
      ></div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import footGuide from "@/components/footer/footGuide";
import { mt_register_code, mt_login, mt_loginByPhone } from "@/api/common";
const regSJH = /^[1][0-9]{10}$/;
import { mt_insertcart } from "@/api/common";
export default {
  name: "login",
  components: {
    footGuide
  },
  data() {
    return {
      logo_white: "/static/icon/logo_white.png",
      logo_black: "/static/icon/logo_black.png",
      isLogin: false,
      loginWay: 1, //1手机验证码登录  2账号密码登录
      phone: "",
      // 18569455937
      password: "",
      code: "",
      butState: false,
      dialogWechat: false,
      noClick: true, //是否点击获取短信
      countdown: 60, //多少秒后可以再次发送验证码
      iTime: Object //计时器
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {
    let openid = localStorage.getItem("openid");
  },
  mounted() {
    //获取用户信息
  },
  props: [],
  computed: {},
  methods: {
    ...mapMutations(["setUserInfo"]),
    back() {
      this.$router.go(-1);
    },
    //切换登录方式
    selectloginway(val) {
      this.loginWay = val;
    },
    //短信验证码计时器
    settime() {
      if (this.countdown == 1) {
        this.noClick = true;
        this.countdown = 60;
        this.clearTimer();
        return;
      } else {
        this.noClick = false;
        this.countdown--;
      }
      this.iTime = setTimeout(() => {
        this.settime();
      }, 1000);
    },
    //清除计时器
    clearTimer() {
      clearTimeout(this.iTime);
    },
    //发送短信
    sendMessage() {
      let that = this;
      if (regSJH.test(that.phone)) {
        //发送验证码请求
        mt_register_code(that.phone, 1).then(data => {
          console.log(data);
          that.code = "";
          that.settime();
          that.$message.success("短信发送成功");
        });
      } else {
        that.$message.error("请输入正确的手机号");
      }
    },
    //更新购物车
    updateCart(arr) {
      // console.log(this.userInfo)
      let token = JSON.parse(localStorage.getItem("userInfo")).token;
      // console.log(token)
      if (token) {
        mt_insertcart(arr).then(data => {
          console.log(data);
        });
      }
    },
    //确认登录
    login_but() {
      let that = this;
      let obj = localStorage.getItem("shoppingInfo");
      if (that.loginWay == 2) {
        //手机号、密码登录
        if (!regSJH.test(that.phone)) {
          that.$message.error("请输入正确的手机号");
        } else if (that.password === "") {
          that.$message.error("请输入密码");
        } else {
          that.butState = true;
          let psd = that.$md5(that.password);
          mt_login(that.phone, psd).then(data => {
            // console.log(data);
            that.setUserInfo(data.data);
            if (obj) {
              that.updateCart(obj);
            }
            let href =
              localStorage.getItem("routerHref") != null
                ? localStorage.getItem("routerHref")
                : "";
            that.$router.push("/" + href);
          });
        }
      } else if (that.loginWay == 1) {
        //手机号、验证码登录
        if (!regSJH.test(that.phone)) {
          that.$message.error("请输入正确的手机号");
        } else if (that.code === "") {
          that.$message.error("请输入验证码");
        } else {
          that.butState = true;
          mt_loginByPhone(that.phone, that.code).then(data => {
            // console.log(data.data);
            that.setUserInfo(data.data);
            if (obj) {
              that.updateCart(obj);
            }
            // console.log(localStorage.getItem("routerHref"));
            let href =
              localStorage.getItem("routerHref") != null
                ? localStorage.getItem("routerHref")
                : "";
            that.$router.push("/" + href);
          });
        }
      }
    },

    //微信登录
    loginByWechat() {
      let that = this;
      that.dialogWechat = true;
      setTimeout(function() {
        var obj = new WxLogin({
          self_redirect: false,
          id: "login_container",
          appid: "wxa8a5d1f439d19603",
          scope: "snsapi_login",
          redirect_uri: "http%3A%2F%2Fwww.xinanzulin.com%2Fapi%2FwxLogin",
          state: "",
          style: "black",
          href: ""
        });
      }, 50);

    },
    //关闭微信登录
    close() {
      this.dialogWechat = false;
    },
    //查看注册协议
    viewAgreement() {
      this.$router.push("/aggrement/1");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.login {
  background-color: #f6f6f6;
}

.container {
  height: 800px;
  margin: 100px auto 80px;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px rgba(200, 200, 200, 0.4);
  border-radius: 10px;
  .login_bg {
    width: 50%;
    height: 100%;
    background: url(/static/icon/login_bg.png) no-repeat;
    img {
      margin: 58px 0 0 36px;
    }
  }
  .login_input {
    width: 50%;
    height: 100%;
    padding-top: 62px;
    .box {
      width: 380px;
      margin: 0 auto;
    }
    .login_input_area {
      margin-top: 76px;
      .tab {
        display: flex;
        span {
          flex: 1;
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 16px;
          color: #333333;
          border-bottom: 1px solid #eaeaea;
          cursor: pointer;
          &.active {
            color: $mainColor;
            border-bottom: 1px solid $mainColor;
          }
        }
      }
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
          background-color: #ffffff;
          font-size: 14px;
          border-radius: 4px;
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
      .tip {
        line-height: 20px;
        margin-top: 10px;
        margin-right: 10px;
        span {
          font-size: 13px;
          color: #999999;
          &.reg {
            float: right;
          }
          &:hover {
            color: $mainColor;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
      .agreement {
        line-height: 16px;
        margin-top: 20px;
        text-align: center;
        font-size: 16px;
        color: #999999;
        .ud {
          color: $mainColor;
        }
      }
      .fastLogin {
        margin-top: 40px;
        .title {
          text-align: center;
          span {
            display: inline-block;
            width: 70px;
            font-size: 14px;
            color: #959595;
            position: relative;
            &:before {
              content: "";
              position: absolute;
              left: -110px;
              top: 10px;
              width: 100px;
              height: 1px;
              background-color: #eaeaea;
            }
            &:after {
              content: "";
              position: absolute;
              right: -110px;
              top: 10px;
              width: 100px;
              height: 1px;
              background-color: #eaeaea;
            }
          }
        }
        .loginBtn {
          display: flex;
          height: 48px;
          margin-top: 20px;
          border-radius: 4px;
          background-color: #47b247;
          font-size: 0;
          .img {
            flex: 1;
            height: 48px;
            background-color: #47b247;
            text-align: right;
            img {
              display: inline-block;
              width: 25px;
              height: 20px;
              position: relative;
              top: 14px;
            }
          }
          span {
            flex: 1;
            line-height: 48px;
            font-size: 16px;
            text-align: left;
            padding-left: 10px;
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.login_box_wrapper {
  position: absolute;
  top: 100px;
  left: 50%;
  width: 1200px;
  height: 800px;
  margin-left: -600px;
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    &:hover {
      cursor: pointer;
      color: #333333;
    }
  }
}
</style>

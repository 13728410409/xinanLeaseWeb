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
                <div class="registerTip">信安IT租赁欢迎注册</div>

                <div class="input">
                  <input type="text" placeholder="输入手机号" maxlength="11" v-model="phone" >
                </div>
                <div class="input">
                  <el-row class="item">
                    <el-col :span="16">
                      <input type="text" placeholder="输入验证码" maxlength="6" v-model="code"  @keyup.enter="register_but">
                    </el-col>
                    <el-col :span="8">
                      <span class="getCode" v-if="noClick" @click="sendMessage" title="点击发送短信验证码">发送验证码</span>
                      <span class="getCode gray" v-if="!noClick" title="请不要频繁发送短信哦！">{{countdown}}</span>
                    </el-col>
                  </el-row>
                </div>
                <div class="input">
                  <input type="password" placeholder="输入密码，不低于6位" v-model="password" autocomplete="new-password">
                </div>
                <div class="input">
                  <input type="password" placeholder="确认密码" v-model="password1" autocomplete="new-password"  @keyup.enter="register_but">
                </div>
                <div class="input noborder">
                  <span class="btnlogin" @click="register_but">注册</span>
                </div>
                <div class="tip">
                  <router-link tag="span" to="login">已有账户，去登录</router-link>
                </div>
                <div class="agreement">注册即代表同意<el-button type="text" class="ud" @click="viewAgreement">《信安用户协议》</el-button></div>
              </div>
            </div>
          </div>
        </div>
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import footGuide from '@/components/footer/footGuide'
import { mt_register_code, mt_register } from '@/api/common'
const regSJH = /^[1][0-9]{10}$/
export default {
  name: 'register',
  components: {
    footGuide
  },
  data() {
    return {
      logo_white: '/static/icon/logo_white.png',
      logo_black: '/static/icon/logo_black.png',
      phone: '',
      code: '',
      password: '',
      password1: '', //确认密码

      butState: false,

      noClick: true,    //是否点击获取短信
      countdown: 60,    //多少秒后可以再次发送验证码
      iTime: Object,    //计时器
    };
  },
  computed: {
    ...mapState(['userInfo','defaultInfo'])
  },
  created(){
  },
  mounted() {
    //获取用户信息
  },
  props: [],
  computed: {},
  methods: {
    //短信验证码计时器
    settime () {
      if (this.countdown == 1) {
        this.noClick = true
        this.countdown = 60
        this.clearTimer()
        return
      } else {
        this.noClick = false
        this.countdown--
      }
      this.iTime = setTimeout(() => { this.settime() },1000)
    },
    //清除计时器
    clearTimer (){
      clearTimeout(this.iTime)
    },
    //发送短信
    sendMessage () {
      let that = this 
      if (regSJH.test(that.phone)) {
        //发送验证码请求
        mt_register_code(that.phone,2).then(data => {
          console.log(data)
          that.code = ''
          that.settime()
          that.$message.success('短信发送成功');
        }) 
      } else {
        that.$message.error("请输入正确的手机号")
      }
    },
    //手机号确认注册
    register_but() {
      let that = this,state = true
      if(that.password==''&&that.password1==''){
        if (!regSJH.test(that.phone)) {
          state = false
          that.$message.error("请输入正确的手机号")
        }  else if (that.code === "") {
          state = false
          that.$message.error("请输入验证码")
        } 
      }else{
        if (!regSJH.test(that.phone)) {
          state = false
          that.$message.error("请输入正确的手机号")
        }  else if (that.code === "") {
          state = false
          that.$message.error("请输入验证码")
        } else if (that.password === ""||that.password.length<6) {
          state = false
          that.$message.error("请输入6位以上密码")
        } else if (that.password != that.password1 ) {
          state = false
          that.$message.error("两次密码不一致，请重新输入")
        } 
      }
      if (state) {
        let psd = that.$md5(that.password);
        mt_register(that.phone,that.code,psd).then(data => {
          console.log(data)
            that.$alert('账号注册成功，立即前往登录', '注册提示', {
              confirmButtonText: '确定',
              showClose: false,
              callback: action => {
                that.$router.push('/login')
              }
            });

        })   
      }

    },
    //查看注册协议
    viewAgreement(){
      this.$router.push('/aggrement/1')
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.login{
  background-color: #f6f6f6;
}
.container{
  height: 800px;
  margin: 100px auto 80px;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px rgba(200,200,200,0.4);
  border-radius: 10px;
  .login_bg{
    width: 50%;
    height: 100%;
    background: url(/static/icon/login_bg.png) no-repeat;
    img{
      margin: 58px 0 0 36px;
    }
  }
  .login_input{
    width: 50%;
    height: 100%;
    padding-top: 62px;
    .box{
      width: 380px;
      margin: 0 auto;
    }
    .login_input_area{
      margin-top: 76px;
      .tab{
        display: flex;
        span{
          flex: 1;
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 16px;
          color: #333333;
          border-bottom: 1px solid #eaeaea;
          cursor: pointer;
          &.active{
            color: $mainColor;
            border-bottom: 1px solid $mainColor;
          }
        }
      }
      .registerTip{
        font-size: 18px;
        color: $mainColor;
        text-align: center;
      }
      .input{
        margin-top: 30px;
        border: 1px solid #dddddd;
        &.noborder{
          border: none;
        }
        input{
          width: 100%;
          height: 48px;
          line-height: 48px;
          outline: 0;
          padding: 0 18px;
          background-color: #ffffff;
          font-size: 14px;
          border-radius: 4px;
        }
        .getCode{
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
          &:hover{
            cursor: pointer;
            background-color: $mainHoverColor;
          }
        }
        .btnlogin{
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
          &:hover{
            background-color: $mainHoverColor;
          }
        }
      }
      .tip{
        line-height: 20px;
        margin-top: 10px;
        margin-right: 10px;
        text-align: right;
        font-size: 13px;
        color: #999999;
        &:hover{
          color: $mainColor;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .agreement{
        line-height: 16px;
        margin-top: 20px;
        text-align: center;
        font-size: 16px;
        color: #999999;
        .ud{
          color: $mainColor;
        }
      }
      .fastLogin{
        margin-top: 40px;
        .title{
          text-align: center;
          span{
            display: inline-block;
            width: 70px;
            font-size: 14px;
            color: #959595;
            position: relative;
            &:before{
              content: '';
              position: absolute;
              left: -110px;
              top: 10px;
              width: 100px;
              height: 1px;
              background-color: #eaeaea;
            }
            &:after{
              content: '';
              position: absolute;
              right: -110px;
              top: 10px;
              width: 100px;
              height: 1px;
              background-color: #eaeaea;
            }
          }
        }
        .loginBtn{
          display: flex;
          height: 48px;
          margin-top: 20px;
          border-radius: 4px;
          background-color: #47b247;
          font-size: 0;
          .img{
            flex: 1;
            height: 48px;
            background-color: #47b247;
            text-align: right;  
            img{
              display: inline-block;
              width: 25px;
              height: 20px;
              position: relative;
              top: 14px;
            }
          }
          span{
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
.login_box_wrapper{
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
    .close{
      position: absolute;
      right: 20px;
      top: 20px;
      &:hover{
        cursor: pointer;
        color: #333333;
      }
    }
  }
</style>

<template>
  <div class="wxlogin">
    <div class="login_box">
      <div class="logo">
        <img src="/static/icon/logo.png">
      </div>
      <div class="tip">
        欢迎登录信安IT租赁平台
      </div>
      <div class="success">{{text}}</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { mt_getuserInfo } from '@/api/my'
export default {
  name: 'wxlogin',
  data() {
    return {
      text: '微信扫码成功,登陆中...'
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {
    let hrefValue = this.$route.params.parameter
    // console.log(hrefValue.length)
    if(hrefValue.length<10){
      if(hrefValue==2){
        this.text = '您的账户不存在，请先登录绑定微信'
        this.$message.warning('您的账户不存在，请先登录绑定微信')
      }else if(hrefValue==3){
        this.text = '您的账户已被禁用'
        this.$message.warning('您的账户已被禁用')
      }else if(hrefValue==4){
        this.text = '系统繁忙'
        this.$message.warning('系统繁忙')
      }
      this.$router.push('/login')
    }else{
      let data = {}
      if(hrefValue.indexOf("t=") != -1){
        let arr = hrefValue.split('&')
        let value = new Object();
        arr.forEach((item,index)=>{
          value[item.split('=')[0]] = item.split('=')[1]
        })
        let uinfo = {}
        uinfo.token = value.t
        this.setUserInfo(uinfo);
        mt_getuserInfo().then(data => {
          // console.log(data.data)
          this.setUserInfo(data.data);
          this.$router.push('/')
        });
      }else{
        this.$message.warning('访问地址有误')
        this.$router.push('/login')
      }
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.wxlogin {
  background-color: #f5f5f5;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url(/static/login_bg.jpg) no-repeat;
  background-size: 100% 100%;
  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 580px;
    height: 360px;
    padding-top: 10px;
    margin-left: -290px;
    margin-top: -180px;
    background: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    // animation: loginIn 1s ease;
    .logo{
      text-align: center;
      padding: 50px 0 20px 0;
      img{
        display: inline-block;
        max-height: 31px;
      }
    }
    .tip {
      margin-top: 20px;
      text-align: center;
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }
    .success{
      text-align: center;
      margin-top: 50px;
      color: $textColor;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>

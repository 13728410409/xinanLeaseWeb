<template>
  <header class="headBox">
    <!-- pc -->
    <div class="container box">
      <div class="list">
        <span v-if="!isLogin">
          <router-link tag="a" to="/login" class="border-r">登录</router-link>|
          <router-link tag="a" to="/register">免费注册</router-link>
        </span>
        <span v-if="isLogin">{{tip}}信安IT租赁欢迎您！</span>
        <router-link tag="span" to="/orderList" v-if="isLogin">我的订单</router-link>
        <router-link tag="span" to="/account" v-if="isLogin">我的账户</router-link>
        <!-- <span v-if="isLogin&&userInfo.type==1" @click="shareLink">分享链接</span> -->
        <!-- <span v-if="isLogin" v-clipboard:copy="userInfo.code" v-clipboard:success="onCopy"  v-clipboard:error="onError">复制邀请码</span> -->
        <span v-if="isLogin" v-clipboard:copy="websiteUrl+'/shareRegister/'+userInfo.code" v-clipboard:success="onCopy"  v-clipboard:error="onError">分享链接</span>
        <span v-if="isLogin&&userInfo.type==1" v-clipboard:copy="websiteUrl+'/registerAngle/'+userInfo.code" v-clipboard:success="onCopy"  v-clipboard:error="onError">天使加盟</span>
        <router-link tag="span" to="/news" v-if="isLogin">
          <i v-if="newsInfo && (newsInfo.myCount+newsInfo.sysCount) ==0" title="暂无消息">消息</i>
          <el-badge
            v-if="newsInfo && (newsInfo.myCount+newsInfo.sysCount)!=0"
            :value="(newsInfo.myCount+newsInfo.sysCount)"
            class="item"
            :title="'有'+(newsInfo.myCount+newsInfo.sysCount)+'条新消息，去查看'"
            style="height:20px;line-height:20px;"
          >消息</el-badge>
        </router-link>
        <router-link tag="span" to="/help">帮助中心</router-link>
        <i v-if="phoneInfo.list">咨询电话：{{phoneInfo.list[0]}}</i>
        <span @click="quit" v-if="isLogin">退出</span>
      </div>
    </div>
  </header>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { mt_commonPhone } from "@/api/common";
import { mt_queryUnRead } from "@/api/news";
import { websiteUrl } from '@/config/env'
export default {
  props: [],
  data() {
    return {
      websiteUrl: '',
      isLogin: false,
      tip: "",
      newsList: 0, //消息
      unread: false,
      count: ""
    };
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
          ? userInfo.nickName + "，"
          : userInfo.phone.substr(0, 3) +
            "****" +
            userInfo.phone.substr(7) +
            "，";
      this.getUnRead();
      this.websiteUrl = websiteUrl
    }
    this.getCommonPhone();
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo", "newsInfo",'phoneInfo'])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setNewsInfo", "setPhoneInfo"]),
    //获取热线电话
    getCommonPhone() {
      let that = this;
      mt_commonPhone(1, 100).then(data => {
        // console.log(data.data.data)
        let obj = {}
        obj.list = []
         data.data.data.forEach(item=>{
           if(item.type==2){
             obj.hotPhone = item.phone
           }else{
             obj.list.push(item.phone)
           }
         })
         that.setPhoneInfo(obj)
      });
    },
    //获取用户未读数
    getUnRead() {
      let that = this;
      mt_queryUnRead().then(data => {
        // console.log(data.data);
        that.setNewsInfo(data.data);
      });
    },
    shareLink(){
      this.$router.push({ name:'account', params:{ shareLink: 'mitaTrue' } })
    },
    //退出登录
    quit() {
      this.setUserInfo('')
      localStorage.removeItem("userInfo");
      localStorage.removeItem("newsInfo");
      localStorage.removeItem("historySearch");
      localStorage.removeItem("shoppingInfo");
      localStorage.removeItem("routerHref");
      this.$router.push("/login");
    },
    // 复制成功时的回调函数
    onCopy(e) {
      this.$message({
        message: "链接已复制！",
        type: "success",
        duration: 1000
      });
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message({
        message: "抱歉，复制失败！",
        type: "success",
        duration: 1000
      });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.headBox {
  background-color: #f2f2f2;
  .box {
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    text-align: right;
    font-size: 14px;
    color: #333333;
    .list {
      a {
        font-size: 14px;
        color: #333333;
        margin: 0 5px;
        &:hover {
          color: $mainColor;
          cursor: pointer;
        }
      }
      span {
        font-size: 14px;
        color: #333333;
        display: inline-block;
        margin-left: 10px;
        &:hover {
          color: $mainColor;
          cursor: pointer;
          div {
            color: $mainColor;
          }
        }
        i {
          font-style: normal;
        }
      }
      i {
        font-size: 14px;
        color: #333333;
        font-style: normal;
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }
}
</style>

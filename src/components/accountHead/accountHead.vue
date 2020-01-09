<template>
  <div class="ordertop">
    <div class="container box">
      <router-link tag="div" to="/" class="img" title="信安首页">
        <img src="/static/icon/logo_black.png" alt />
      </router-link>
      <div class="navs">
        <router-link tag="span" to="/home" class="nav">首页</router-link>
        <router-link tag="span" to="/accountSet" class="nav" :class="path=='accountCompany'||path=='accountAddress'||path=='accountSafe'?'active':''">账户安全</router-link>
        <router-link tag="span" to="/news" class="nav">消息中心</router-link>
        <router-link tag="span" to="/account" class="nav">账户中心</router-link>
        <span class="nav" :class="path=='joinCenter'||path=='join'||path=='joinAngle'?'active':''" @click="viewJoinInfo" v-if="userInfo.type!=4">加盟中心</span>
        <!-- <router-link tag="span" to="/joinCenter" class="nav" >加盟中心</router-link> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { jsGetAge, formatDate } from "@/config/often";
import inputFile from '@/components/common/inputFile'
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  components: {
    inputFile
  },
  props: {},
  data() {
    return {
     
    };
  },
  watch: {
   
  },
  filters: {
    
  },
  created() {
    this.path  = this.$route.name
  },
  mounted() {
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //查看加盟信息
    viewJoinInfo(){
      let jsonUserInfo = localStorage.getItem('userInfo')
      if (jsonUserInfo!=null) {
        let userInfo = JSON.parse(jsonUserInfo)
        if(userInfo.angelState==3){
          if(userInfo.joinStatus == 0 || userInfo.joinStatus == 3){
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
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";

</style>

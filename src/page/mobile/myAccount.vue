<template>
  <div>
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="ainfo">
        <div class="img">
          <img v-if="userInfo.headImg" :src="userInfo.headImg" />
          <img v-else src="/static/icon_m/default.png" />
        </div>
        <div class="info">昵称：{{userInfo.nickName}}</div>
      </div>
      <div class="lists">
        <router-link
          tag="div"
          to="/accountAddress"
          class="item"
          style="width: 100%;margin-bottom:10px;border-bottom:none;"
        >
          <div class="tx">收货地址</div>
          <div class="ti">管理我的地址</div>
          <div class="next">
            <img src="/static/icon_m/rightGray.png" />
          </div>
        </router-link>
        <router-link tag="div" to="/accountCompany" class="item" style="width: 100%;">
          <div class="tx">实名认证</div>
          <div class="ti" v-if="userInfo.status==1">审核中</div>
          <div class="ti" v-if="userInfo.status==2">已实名认证</div>
          <div class="ti" v-if="userInfo.status==3">认证失败</div>
          <div class="ti" v-if="userInfo.status==''||userInfo.status==null">未实名</div>
          <div class="next">
            <img src="/static/icon_m/rightGray.png" />
          </div>
        </router-link>
        <router-link
          tag="div"
          to="/editPsd"
          class="item"
          style="width: 100%;margin-bottom:10px;border-bottom:none;"
        >
          <div class="tx">修改登录密码</div>
          <div class="ti">点击去修改</div>
          <div class="next">
            <img src="/static/icon_m/rightGray.png" />
          </div>
        </router-link>
        <div class="item">
          <div class="tx">联系客服</div>
          <div class="ti">
            <a :href="'tel:'+phoneInfo.list[0]">立即咨询</a>
          </div>
          <div class="next">
            <img src="/static/icon_m/rightGray.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headertop from "@/components/mobile/header";
import { mt_getuserInfo } from "@/api/my";
import { mt_commonPhone } from "@/api/common";
export default {
  name: "myAccount",
  components: {
    headertop
  },
  data() {
    return {
      phone: "",
      headValue: "账户管理",
    };
  },
  watch: {},
  filters: {},
  created() {
    this.getUserInfo();
    this.getCommonPhone()
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo","phoneInfo", "mobileMode"])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setPhoneInfo"]),
    //获取个人信息
    getUserInfo() {
      let that = this;
      mt_getuserInfo().then(data => {
        // //console.log(data.data);
        that.setUserInfo(data.data);
      });
    },
    //获取热线电话
    getCommonPhone() {
      let that = this;
      mt_commonPhone(1, 100).then(data => {
        // //console.log(data.data.data)
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
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.mobile {
  .ainfo {
    margin: 12px 10px;
    padding: 15px;
    background: linear-gradient(90deg, #eb3c3c, #f08200);
    border-radius: 10px;
    display: flex;
  }
  .ainfo .img {
    flex: 45px 0 0;
    width: 45px;
    height: 45px;
  }
  .ainfo .img img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
  .ainfo .info {
    line-height: 45px;
    padding-left: 15px;
    font-size: 12px;
    color: #ffffff;
    opacity: 0.7;
  }
  .lists .item {
    display: flex;
    justify-content: flex-start;
    padding: 15px;
    border-bottom: 1px solid #eee;
    background-color: #fff;
  }
  .lists .item .tx {
    flex: 1;
    font-size: 15px;
    line-height: 15px;
    color: #161616;
  }
  .lists .item .ti {
    font-size: 12px;
    line-height: 15px;
    margin-right: 4px;
    color: #999999;
  }

  .lists .item .next {
    flex: 0 10px 0;
    display: flex;
    align-items: center;
    width: 10px;
  }

  .lists .item .next img {
    width: 6px;
    height: 11px;
  }
}
</style>

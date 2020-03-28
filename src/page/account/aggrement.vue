<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <div class="container aggrement">
        <span class="bb" @click="back" title="返回">返回</span>
        <div class="title">{{title}}</div>
        <div class="content" v-html="content"></div>
      </div>
    </div>
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="title" style="line-height: 60px;font-size: 18px;color:#333333;text-align: center;">{{title}}</div>
      <div class="content" v-html="content"  style="line-height: 60px;font-size: 13px;line-height:24px;padding: 0 15px;"></div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";
import headertop from "@/components/mobile/header";
import { mt_aggrement } from "@/api/common";
export default {
  name: "aggrement",
  components: {
    headertop
  },
  data() {
    return {
      type: 1,
      title: "信安租赁用户协议",
      content: "信安租赁用户协议",
      headValue: "用户协议"
    };
  },
  created() {},
  mounted() {
    this.viewAgreement();
  },
  computed: {
    ...mapState(["mobileMode"])
  },
  methods: {
    //去登录
    back() {
      this.$router.go(-1);
    },
    //查看注册协议
    viewAgreement() {
      let that = this;
      let title = "",
        content = "";
      mt_aggrement(that.type).then(data => {
        console.log(data.data);
        that.title = data.data.name;
        that.content = data.data.content;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.pc {
  .aggrement {
    min-height: 1080px;
    background-color: #f5f5f5;
    padding: 0 20px;
    position: relative;
    box-shadow: 0px 0px 20px 5px rgba(200, 200, 200, 0.4);
    .bb {
      position: absolute;
      left: 20px;
      top: 20px;
      z-index: 8;
      font-size: 14px;
      color: $mainColor;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .title {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      width: 100%;
      line-height: 60px;
      font-size: 20px;
      text-align: center;
    }
    .content {
      padding: 60px 0 20px 0;
      font-size: 14px;
      line-height: 24px;
    }
  }
}
</style>

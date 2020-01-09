<template>
  <div>
    <head-top></head-top>
    <account-head></account-head>
    <div class="joinDes">
      <div class="container box">
        <div class="title">{{data.type}}</div>
        <div class="cont" v-html="data.content"></div>
        <!-- <div class="btn" @click="join">立即入驻</div> -->
        <el-button type="primary" class="btn" @click="join">立即入驻</el-button>
      </div>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import accountHead from "@/components/accountHead/accountHead";
import { mt_queryJoinDescribe } from "@/api/my";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "joinDes",
  components: {
    headTop,
    footGuide,
    accountHead
  },
  data() {
    return {
      type: "",
      content: "",
      data: {}
    };
  },
  computed: {},
  watch: {
    
  },
  filters: {},
  created() {
    let type = this.$route.params.type;
    this.type = type != undefined ? type : 3;
    this.getData(this.type);
  },
  mounted() {},
  methods: {
    //获取入驻类型描述
    getData(type) {
      mt_queryJoinDescribe(type).then(data => {
        console.log(data);
        this.data = data.data;
      });
    },
    join() {
      console.log(this.type);
      this.$router.push({ name: "join", params: { type: this.type } });
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
/deep/ .el-input-group__prepend {
  padding: 0 10px !important;
  font-size: 12px;
}
.joinDes {
  padding: 30px 0 80px 0;
  background-color: #ffffff;
  .box {
    .title{
        line-height: 40px;
        font-size: 20px;
        color: #333333;
        font-weight: bold;
    }
    .cont{
        padding: 20px 0;
    }
    .btn{

    }
  }
}
</style>

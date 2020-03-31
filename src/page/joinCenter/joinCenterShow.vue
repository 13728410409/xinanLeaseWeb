<template>
  <div>
    <div class="pc">
      <head-top></head-top>
      <account-head></account-head>
      <!-- <div class="banner">
        <img src="/static/icon/joincenter.png" alt />
      </div>-->
      <div class="joinCenter">
        <div class="container box">
          <div class="item">
            <div class="name">金牌</div>
            <div class="cont" v-html="data1.content"></div>
            <el-button type="primary" class="val" @click="join(5)">立即入驻</el-button>
          </div>
          <div class="item">
            <div class="name">代理商</div>
            <div class="cont" v-html="data2.content"></div>
            <el-button type="primary" class="val" @click="join(3)">立即入驻</el-button>
          </div>
        </div>
      </div>
      <foot-guide></foot-guide>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import accountHead from "@/components/accountHead/accountHead";
import { mt_queryJoinDescribe } from "@/api/my";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "joinCenter",
  components: {
    headTop,
    footGuide,
    accountHead
  },
  data() {
    return {
      data1: "",
      data2: ""
    };
  },
  computed: {
    ...mapState(["userInfo", "newsInfo"])
  },
  watch: {},
  filters: {},
  created() {
    //console.log();
    this.getData();
    this.getData1();
  },
  mounted() {},
  methods: {
    //查看加盟信息
    join(type) {
      //console.log(type);
      // this.$router.push("joinDes/" + type);
      this.$router.push({ name: "join", params: { type: type } });
    },
    //获取入驻类型描述
    getData() {
      mt_queryJoinDescribe(5).then(data => {
        //console.log(data);
        this.data1 = data.data;
      });
    },
    getData1() {
      mt_queryJoinDescribe(3).then(data => {
        //console.log(data);
        this.data2 = data.data;
      });
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.pc {
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
  .banner {
    width: 100%;
    position: relative;
    padding-top: 23%;
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .joinCenter {
    padding: 30px 0 80px 0;
    background-color: #ffffff;
    .box {
      display: flex;
      width: 900px;
      margin: 50px auto;
      .item {
        flex: 1;
        text-align: center;
        .name {
          width: 200px;
          height: 200px;
          line-height: 200px;
          margin: 0 auto;
          background-color: #f08200;
          border-radius: 50%;
          font-size: 40px;
          color: #ffffff;
        }
        .cont {
          margin-top: 30px;
          padding: 0 40px;
          
        }
        .val {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>

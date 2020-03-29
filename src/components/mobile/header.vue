<!--移动端搜素弹窗组件-->
<template>
  <div class="headerm">
    <span class="back" @click="back"></span>{{text}}
    <span class="homeicon" @click="viewHome"></span>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default() {
        return ''
      }
    }
  },
  components: {
  },
  data() {
    return {
        text: ''
    };
  },
  created() {
      this.text = this.value
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //前往首页
    viewHome() {
      this.$router.push("/");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.headerm {
  width:100%;
  height: 44px;
  line-height: 44px;
  padding: 0 15px;
  font-size: 16px;
  color: #333333;
  text-align: center;
  position: relative;
  border-bottom: 1px solid #dddddd;
  background-color: #ffffff;
  .back {
    position: absolute;
    left: 0;
    top: 0;
    width: 44px;
    height: 44px;
    background: url(/static/icon_m/jt_left.png) no-repeat center center;
    background-size: 24px 24px;
  }
  .homeicon {
    position: absolute;
    right: 10px;
    top: 0;
    width: 30px;
    height: 44px;
    background: url(/static/icon_m/homeActive.png) no-repeat center center;
    background-size: 24px 24px;
  }
}
</style>

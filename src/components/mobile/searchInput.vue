<!--移动端搜素弹窗组件-->
<template>
  <common-fade>
    <div class="searchInput" v-if="showFlag">
      <header class="headerm">
        <span @click="hide"></span>搜索
      </header>
      <div class="type_search">
        <div class="searchBox">
          <div class="search1">
            <img src="/static/icon_m/search.png" />
          </div>
          <input class="input" v-model="wordkey" placeholder="输入搜索关键字" />
        </div>
        <span class="btn" @click="searchNow">搜索</span>
      </div>
    </div>
  </common-fade>
</template>
<script>
import CommonFade from "common/fadeAnimation";
export default {
  props: {
    wordkey: {
      type: String,
      default() {
        return "";
      }
    }
  },
  components: {
    CommonFade
  },
  data() {
    return {
      showFlag: false,
      wordkey: ""
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    searchNow() {
      if (this.wordkey != "") {
        this.showFlag = false;
        this.$emit("searchinput", this.wordkey);
      } else {
        alert("请输入关键字");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.searchInput {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 9999;
  background-color: #f7f7f7;
}
.headerm {
  height: 44px;
  line-height: 44px;
  padding: 0 15px;
  font-size: 16px;
  color: #333333;
  text-align: center;
  position: relative;
  border-bottom: 1px solid #dddddd;
  span {
    position: absolute;
    left: 0;
    top: 0;
    width: 44px;
    height: 44px;
    background: url(/static/icon/jt_left.png) no-repeat center center;
    background-size: 24px 24px;
  }
}
.type_search {
  width: 100%;
  padding: 8px 15px;
  display: flex;
  background-color: #ffffff;
}
.type_search .btn {
  flex: 40px 0 0;
  line-height: 30px;
  height: 30px;
  margin-left: 5px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #e93b3d;
  color: #ffffff;
  text-align: center;
}
.type_search .searchBox {
  flex: 1;
  margin-left: 10px;
  display: flex;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  background-color: #f5f5f5;
}
.type_search .searchBox .search1 {
  flex: 30px 0 0;
  width: 30px;
  padding: 5px 0 0 10px;
}
.type_search .searchBox .search1 img {
  width: 20px;
  height: 20px;
}
.type_search .searchBox .input {
  flex: 1;
  padding-left: 5px;
  font-size: 14px;
  color: #232326;
  height: 30px;
  line-height: 30px;
  background-color: #f5f5f5;
  outline: none;
}
</style>

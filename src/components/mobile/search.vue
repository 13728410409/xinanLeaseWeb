<template>
  <div class="type_search">
    <div class="typeImg" @click="viewType">
      <img class="type" src="/static/icon_m/typeWhite.png" />
    </div>
    <div class="searchBox" @click="goSearch">
      <div class="search">
        <img src="/static/icon_m/search.png" />
      </div>
      <div class="input">搜索</div>
    </div>
    <div class="homeIconBox" v-if="showHome" @click="viewHome">
      <img src="/static/icon_m/homeIcon.png" alt="">
    </div>
    <searchinput @searchinput="searchSure" ref="searchm"></searchinput>
  </div>
</template>
<script>
import searchinput from "@/components/mobile/searchInput";
export default {
  components: {
    searchinput
  },
  props: {
    homeState: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      showHome: false,
    };
  },
  watch: {},
  filters: {},
  created() {
    this.showHome = this.homeState
  },
  mounted() {},
  computed: {
  },
  methods: {
    //查看分类
    viewType() {
      this.$router.push("/type");
    },
    //前往首页
    viewHome() {
      this.$router.push("/");
    },
    //移动端搜索组件显示
    goSearch() {
      this.$refs.searchm.show();
    },
    searchSure(value){
      this.$emit("getKey", value);
      
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
/* 搜索 */
.type_search {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 44px;
  padding: 0 15px;
  background-color: #f08200;
  display: flex;
}

.type_search .typeImg {
  flex: 20px 0 0;
  width: 20px;
  height: 44px;
  padding-top: 12px;
}

.type_search .typeImg img {
  display: block;
  width: 20px;
  height: 20px;
}

.type_search .searchBox {
  flex: 1;
  margin: 7px 10px 0 10px;
  display: flex;
  border-radius: 10px;
  height: 30px;
  line-height: 30px;
  background-color: #fff;
}

.type_search .searchBox .search {
  flex: 30px 0 0;
  width: 30px;
  padding: 5px 0 0 10px;
}

.type_search .searchBox .search img {
  display: block;
  width: 20px;
  height: 20px;
}

.type_search .searchBox .input {
  flex: 1;
  padding-left: 5px;
  font-size: 14px;
  color: #999;
  height: 30px;
  line-height: 30px;
}
.type_search .homeIconBox{
  flex: 20px 0 0;
  position: relative;
  img{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 20px;
    height: 20px;
  }
}
</style>

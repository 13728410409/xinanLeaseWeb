<template>
  <div class="typeBox">
    <div class="type">
        <div class="aside">
        <div
            class="itm"
            :class="type==item.id?'active':''"
            v-for="(item,index) of navList"
            :key="index"
            v-if="index<6"
            @click="selectS(item.id)"
        >
            <span>{{item.name}}</span>
        </div>
        </div>
        <div class="main">
        <div class="itm" v-for="item of navList1" :key="index">
            <div class="title">{{item.name}}</div>
            <div class="box">
            <div class="item" v-for="items of item.childMenu" :key="indexs" @click="viewList(items)">
                <div class="img">
                <img :src="items.img" />
                </div>
                <div class="tn">{{items.name}}</div>
            </div>
            </div>
        </div>
    </div>
     <footerm></footerm>
  </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import footerm from "@/components/footer/footer";
import { mt_selectFirstMenu, mt_selectSecondMenu } from "@/api/home";
export default {
  name: "type",
  components: {
    footerm,
  },
  data() {
    return {
      navList: [],
      navList1: [],
      type: "",
      currentName: ""
    };
  },
  watch: {},
  filters: {},
  created() {
    this.getGoodsMenu1();
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取一级菜单分类
    getGoodsMenu1() {
      let that = this;
      mt_selectFirstMenu().then(data => {
        //console.log(data.data);
        that.navList = data.data;
        that.type = data.data[0].id;
        that.getGoodsMenu2(that.type);
      });
    },
    //获取二级菜单分类
    getGoodsMenu2(id) {
      let that = this;
      mt_selectSecondMenu(id).then(data => {
        // //console.log(data.data)
        that.navList1 = data.data;
        if (data.data.length > 0) {
          that.currentName = that.navList[0].name;
        }
      });
    },
    //选择大分类
    selectS(id) {
      if (id != this.type) {
        this.type = id
        this.getGoodsMenu2(this.type);
      }
    },
    //查看商品列表
    viewList(value) {
      this.$router.push({
        name: "list",
        params: { name: "", menuId: value.id }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.typeBox{
    padding-bottom: 50px;
}
.type {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 50px;
  right: 0;
  border-top: 1px solid #f1f1f1;
  
}
.aside {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 80px;
  background-color: #f8f8f8;
  /* border-right: 1px solid #f8f8f8; */
}
.aside .itm {
  height: 16.6%;
  position: relative;
}
.aside .itm span {
  display: inline-block;
  vertical-align: middle;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 100%;
  font-size: 14px;
  color: #333;
  text-align: center;
}
.aside .itm.active {
  background-color: #fff;
  position: relative;
}
.aside .itm.active::before {
  content: "";
  position: absolute;
  right: 1px;
  top: 0rpx;
  height: 100%;
  width: 1px;
  background-color: #f8f8f8;
}
.aside .itm.active text {
  color: #f08200;
}
.main {
  position: absolute;
  left: 80px;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 10px 0;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #ffffff;
}
.main .itm {
  margin-bottom: 10px;
  padding: 10px 7px 0;
}
.main .itm:last-child {
  margin-bottom: none;
}
.main .itm .title {
  line-height: 14px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}
.main .itm .box {
  padding: 7px 0;
  overflow: hidden;
}
.main .itm .box .item {
  float: left;
  width: 33.3%;
  padding: 0 4px;
}
.main .itm .box .item .img {
  width: 100%;
  height: 0;
  padding-top: 100%;
  position: relative;
}
.main .box .item img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  max-width: 100%;
  max-height: 100%;
}
.main .box .item .tn {
  height: 35px;
  margin-top: 2px;
  font-size: 12px;
  color: #666666;
  text-align: center;
}
</style>

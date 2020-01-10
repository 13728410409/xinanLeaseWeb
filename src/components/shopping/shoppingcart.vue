<template>
  <div class='shoppingcart'>
    <router-link tag="div" to="/cartList" class="cart" title="点击前往购物车">
      <span class="goodsNum">{{shoppingInfo.list.length}}</span>我的购物车
    </router-link>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { mt_selectAllcart, mt_insertcart } from "@/api/common";
export default {
  props: [],
  data() {
    return {
    };
  },
  created(){
    if(this.$route.name!='cartList'&&localStorage.getItem('userInfo')!=null){
      this.getCarList()
    }
  },
  mounted() {
    
  },
  computed: {   
    ...mapState(['userInfo','shoppingInfo'])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取购物车列表
    getCarList() {
      let that = this;
      mt_selectAllcart().then(data => {
        let arr = that.shoppingInfo.list !=null && that.shoppingInfo.list !=undefined ? that.shoppingInfo.list : []
        // console.log(data.data.data)
        if( arr.length < data.data.data.length && arr.length!=0){
          data.data.data.forEach(item => {
            item.address = JSON.parse(item.address);
            item.collocation = JSON.parse(item.collocation);
          });
          this.cartList = data.data.data;
          let obj = {};
          obj.list = data.data.data;
          this.setShoppingInfo(obj);
          that.updateCart(that.shoppingInfo);
        }
      });
    },
    //更新购物车
    updateCart(arr) {
      mt_insertcart(JSON.stringify(arr)).then(data => {
        // console.log(data);
      });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.shoppingcart {
  width: 140px;
  border: 1px solid #e8e8e8;
  &:hover{
    cursor: pointer;
    border: 1px solid $mainColor;
  }
  .cart{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: $mainColor;
    position: relative;
    padding-left: 54px;
    background: url(/static/icon/shoppingcart.png) no-repeat 19px center;
    .goodsNum{
      position: absolute;
      left: 30px;
      top: 4px;
      z-index: 3;
      height: 14px;
      line-height: 14px;
      padding: 0 5px;
      background-color: $mainColor;
      color: #ffffff;
      font-size: 12px;
      border-radius: 6px;
    }
  }
}
</style>

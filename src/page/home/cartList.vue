<template>
  <div>
    <head-top></head-top>
    <div class="hometop2">
      <div class="container box">
        <router-link tag="div" to="/" class="img" title="信安首页">
          <img src="/static/icon/logo_black.png" alt />
        </router-link>
        <div class="searchBox">
          <search></search>
        </div>
        <div class="shoppingcartBox">
          <shoppingcart></shoppingcart>
        </div>
      </div>
    </div>
    <div class="shoppingcartlist">
      <div class="container box">
        <div class="goods" v-if="cartList.length>0">
          <el-row class="itm title">
            <el-col :span="2" class="sel">
              <el-checkbox v-model="checkedAll" @change="checkAll">全选</el-checkbox>
            </el-col>
            <el-col :span="7">商品名称</el-col>
            <el-col :span="5">类型和尺寸</el-col>
            <el-col :span="2">价格</el-col>
            <el-col :span="3" class="number">数量</el-col>
            <el-col :span="3" class="number">租期</el-col>
            <el-col :span="2" class="delete">操作</el-col>
          </el-row>
          <el-row class="itm" v-for="(item,index) in cartList" :key="index">
            <el-col :span="2" class="sel">
              <el-checkbox v-model="item.selected" :data-num="index" @change="checkgood"></el-checkbox>
            </el-col>
            <el-col :span="7" class="gd">
              <div class="img" @click="viewDetail(item)">
                <img :src="item.img" alt />
              </div>
              <div class="info" @click="viewDetail(item)">
                <div class="des ellipsis2">{{item.des}}</div>
              </div>
            </el-col>
            <el-col :span="5" class="type">{{item.collocation.config}}</el-col>
            <el-col :span="2" class="price">
              <div>租金：￥{{item.rent}}</div>
              <div>押金：￥{{item.deposit}}</div>
              <!-- <div>押金：￥{{item.collocation.deposit*item.per}}</div> -->
            </el-col>
            <el-col :span="3" class="number">
              <el-input-number
                v-model="item.num"
                @change="changeNum(index,item)"
                size="mini"
                :min="1"
                :step="1"
                step-strictly
                label="数量"
              ></el-input-number>
            </el-col>
            <el-col :span="3" class="number">
              <el-select
                size="mini"
                v-model="item.leaseTerm"
                placeholder="请选择"
                @change="changeLeaseTerm(index,item)"
              >
                <el-option
                  v-for="items of item.leaseTermOptions"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" class="delete">
              <i class="el-icon-delete" title="点击删除" @click="deleteGood(index, item)"></i>
            </el-col>
          </el-row>
        </div>
        <el-row v-if="cartList.length==0">
          <div class="nogoods">
            购物车暂时没有商品
            <router-link tag="span" to="/" class="cart">去购物>></router-link>
          </div>
        </el-row>
        <div class="opt" v-if="cartList.length>0">
          <el-col :span="2" class="sel">
            <el-checkbox v-model="checkedAll" @change="checkAll">全选</el-checkbox>
          </el-col>
          <el-col :span="10" class="delAll">
            <span @click="delAll">删除选中的商品</span>
          </el-col>
          <el-col :span="10" class="totalInfo">
            <div class="totalInfo">
              <span class="num">
                已选中
                <i>{{selectedNum}}</i>件商品
              </span>
              <span class="deposit">
                押金：
                <i>￥{{deposit}}</i>
              </span>
              <span class="rent">
                租金：
                <i>￥{{rent}}</i>
              </span>
              <span class="totalPrice">
                总价：
                <i>￥{{totalPrice}}</i>
              </span>
            </div>
          </el-col>
          <el-col :span="2" class="settle">
            <span @click="subOrder">去结算</span>
          </el-col>
        </div>
      </div>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import search from "@/components/search/search";
import shoppingcart from "@/components/shopping/shoppingcart";
import { arrayRemove, uniq } from "@/config/often";
import { mt_selectAllcart, mt_insertcart, mt_deletecart } from "@/api/common";

export default {
  name: "cartList",
  components: {
    headTop,
    footGuide,
    search,
    shoppingcart
  },
  data() {
    return {
      // leaseTermOptions: [
      //   {
      //     value: 1,
      //     label: "1个月"
      //   },
      //   {
      //     value: 3,
      //     label: "3个月"
      //   },
      //   {
      //     value: 6,
      //     label: "6个月"
      //   },
      //   {
      //     value: 12,
      //     label: "1年"
      //   },
      //   {
      //     value: 36,
      //     label: "3年"
      //   }
      // ],

      cartList: [],
      checkedAll: false,

      selectedNum: 0,
      totalPrice: 0,
      deposit: 0, //押金
      rent: 0
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  watch: {
    //数量
    num(newVal, oldVal) {
      console.log(newVal);
    }
  },
  created() {
    let arr = [];
    Object.assign(arr, this.shoppingInfo.list);
    this.cartList = arr;
    let userInfo = localStorage.getItem('userInfo')
    console.log(userInfo)
    if (userInfo) {
      this.getCarList();
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取购物车列表
    getCarList() {
      let that = this;
      mt_selectAllcart().then(data => {
        console.log(data.data.data);
        let arr1 = data.data.data;
        arr1.forEach(item => {
          item.collocation = JSON.parse(item.collocation);
        });
        that.cartList = arr1;
        let obj = {};
        obj.list = arr1;
        that.setShoppingInfo(obj);
        that.computedPrice();
      });
    },
    //查看详情
    viewDetail(val) {
      console.log(val);
      this.$router.push("/goodsdetail/" + val.gid);
    },
    //全选
    checkAll() {
      let arr = this.cartList;
      if (this.checkedAll) {
        arr.forEach((item, index) => {
          item.selected = true;
        });
      } else {
        arr.forEach((item, index) => {
          item.selected = false;
        });
      }
      this.cartList = arr;
      this.computedPrice();
    },
    //更新购物车
    updateCart(arr) {
      let userInfo = localStorage.getItem('userInfo')
      console.log(userInfo)
      if (userInfo) {
        mt_insertcart(JSON.stringify(arr)).then(data => {
          console.log(data);
        });
      }
    },
    //单选
    checkgood(e) {
      this.computedPrice();
    },
    //删除商品
    deleteGood(index, value) {
      let that = this;
      // console.log(value);
      that
        .$confirm("是否确认把商品移除购物车?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let userInfo = localStorage.getItem('userInfo')
          console.log(userInfo)
          if(userInfo){
            that.deleteCart(value.id);
          }else{
            arrayRemove(that.cartList,value)
            let obj = {},
              arr = that.cartList;
            obj.list = arr;
            that.setShoppingInfo(obj);
          }
        })
        .catch(() => {});
    },
    //删除选中的商品
    delAll() {
      let that = this;
      that
        .$confirm("是否确认删除选中的商品?", "批量删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          // console.log(idarr);
          let userInfo = localStorage.getItem('userInfo')
          console.log(userInfo)
          if(userInfo){
            let objArr = that.cartList
            let idarr = []
            objArr.forEach(item => {
              if (item.selected) {
                idarr.push(item.id);
              }
            });
            that.deleteCart(idarr.join(","));
          }else{
            let objArr = that.cartList
            that.cartList.forEach(item => {
              if (item.selected) {
                arrayRemove(that.cartList,item)
                let obj = {},
                  arr = that.cartList;
                obj.list = arr;
                that.setShoppingInfo(obj);
              }
            });
          }
        })
        .catch(() => {});
    },
    deleteCart(ids) {
      console.log(ids);
      mt_deletecart(ids).then(data => {
        // console.log(data);
        this.$message.success("删除成功", 500);
        this.getCarList();
      });
    },
    //数量加减
    changeNum(index, item) {
      console.log(index);
      this.cartList[index].selected = true;
      this.computedPrice();
      let obj = {},
        arr = this.cartList;
      obj.list = arr;
      this.setShoppingInfo(obj);
      this.updateCart(obj);
      
    },
    //租期选择
    changeLeaseTerm(index, value) {
      // console.log(index);
      // console.log(value);
      this.cartList[index].selected = true;
      // console.log(this.cartList);
      value.leaseTermOptions.forEach(item=>{
        if(value.leaseTerm==item.value){
          this.cartList[index].rent = item.rentMoney
          this.cartList[index].deposit = item.depositMoney
        }
      })
      this.computedPrice();
      let obj = {},
        arr = this.cartList;
      obj.list = arr;
      this.setShoppingInfo(obj);
      this.updateCart(obj);
    },
    //计算价格
    computedPrice() {
      this.selectedNum = 0;
      this.deposit = 0
      this.rent = 0
      this.totalPrice = 0;
      console.log(this.cartList)
      this.cartList.forEach((item, index) => {
        if (item.selected) {
          this.selectedNum += 1;
          this.deposit += item.num * item.deposit;
          this.rent += item.rent * item.num * item.leaseTerm;
          this.totalPrice +=
            item.num * item.deposit +
            item.rent * item.num * item.leaseTerm ;
        }
      });
      if (this.selectedNum == this.cartList.length) {
        this.checkedAll = true;
      } else {
        this.checkedAll = false;
      }
    },
    subOrder() {
      let userInfo = localStorage.getItem("userInfo");
      if (userInfo != null && userInfo != undefined) {
        let status = JSON.parse(userInfo).status
        if (status == 2) {
          if (this.selectedNum > 0) {
            let subTime = new Date().getTime();
            let arr = [],
              obj = {};
            arr = this.cartList;
            arr.forEach((item, index) => {
              if (item.selected) {
                item.subTime = subTime;
              }
            });
            obj.list = arr;
            this.setShoppingInfo(obj);
            this.updateCart(obj);
            this.$router.push("/subOrder/" + subTime);
          } else {
            this.$message.warning("请先选择一个商品");
          }
        } else {
          this.$confirm("实名认证成功后才能下单", "信安提示", {
            confirmButtonText: "去实名",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$router.push("/accountCompany");
            })
            .catch(() => {});
        }
      } else {
        this.$confirm("下单需要登录，是否前往登录？", "登录提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showClose: false,
            type: "warning"
          })
            .then(() => {
              this.$router.push("/login");
            })
            .catch(() => {});

      }
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.shoppingcartlist {
  padding: 30px 0 50px 0;
  border-top: 2px solid $mainColor;
  .box {
    border: 1px solid #dddddd;
    .nogoods {
      background-color: #ffffff;
      padding: 120px 0;
      text-align: center;
      font-size: 14px;
      color: #333333;
      background-color: #ffffff;
      span {
        margin-left: 20px;
        color: #005ea7;
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }

    .goods {
      background-color: #ffffff;
      padding: 20px 20px 0 20px;
      .itm {
        padding: 20px 0;
        font-size: 14px;
        color: #666666;
        border-bottom: 1px solid #c4c4c4;
        &:first-child {
          padding: 0;
          border-bottom: none;
        }
        &:last-child {
          border-bottom: none;
        }
        .sel {
          padding-left: 20px;
        }
        .gd {
          display: flex;
          .img {
            flex: 80px 0 0;
            width: 80px;
            height: 80px;
            position: relative;
            img {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate3d(-50%, -50%, 0);
              max-width: 80px;
              max-height: 80px;
            }
          }
          .info {
            flex: 1;
            padding: 0 50px 0 20px;
            .des,
            .sign {
              font-size: 14px;
              line-height: 18px;
              color: #666666;
              &:hover {
                cursor: pointer;
                color: $mainColor;
              }
            }
            .sign {
              margin-top: 14px;
            }
          }
        }
        .type {
          padding-right: 50px;
          font-size: 14px;
          line-height: 18px;
          color: #666666;
        }
        .price {
          font-size: 14px;
          line-height: 18px;
          color: #333333;
        }
        .number,
        .delete {
          padding: 0 10px;
          text-align: center;
        }
        .delete {
          i {
            font-size: 20px;
            padding-top: 4px;
            &:hover {
              cursor: pointer;
              color: $mainColor;
            }
          }
        }
      }
      .title {
        height: 40px;
        line-height: 40px;
        background-color: #f7f7f7;
      }
    }
    .opt {
      background-color: #ffffff;
      height: 70px;
      padding: 15px 20px;
      border-top: 1px solid #c4c4c4;
      font-size: 14px;
      color: #666666;
      .sel {
        line-height: 40px;
        padding-left: 20px;
      }
      .delAll {
        line-height: 40px;
        span {
          &:hover {
            cursor: pointer;
            color: $mainColor;
          }
        }
      }
      .totalInfo {
        display: flex;
        text-align: right;
        line-height: 40px;
        span {
          color: #999999;
          margin-left: 20px;
          i {
            font-style: normal;
          }
          &.num {
            i {
              color: $mainColor;
            }
          }
          &.deposit {
            i {
              color: #333333;
            }
          }
          &.rent {
            i {
              color: #333333;
            }
          }
          &.totalPrice {
            i {
              color: $mainColor;
              font-weight: bold;
            }
          }
        }
      }
      .settle {
        line-height: 40px;
        span {
          display: inline-block;
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background-color: $mainColor;
          color: #ffffff;
          border-radius: 3px;
          &:hover {
            cursor: pointer;
            background-color: $mainHoverColor;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
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
          <div class="goods" v-if="cartList">
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
                    v-for="items of item.leaseTermOptions00"
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
            <el-col :span="8" class="delAll">
              <span @click="delAll">删除选中的商品</span>
            </el-col>
            <el-col :span="12" class="totalInfo">
              <div class="totalInfo">
                <span class="num">
                  已选中
                  <i>{{selectedNum}}</i>件商品
                </span>
                <span class="deposit">
                  押金：
                  <i>￥{{deposit |filterMoney2wei}}</i>
                </span>
                <span class="rent">
                  租金：
                  <i>￥{{rent |filterMoney2wei}}</i>
                </span>
                <span class="totalPrice">
                  总价：
                  <i>￥{{totalPrice |filterMoney2wei}}</i>
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
    <div class="mobile" v-if="mobileMode.result">
      <div class="headerm">购物车</div>
      <div class="main">
        <div class="item" v-for="(item,index) of cartList" :key="index">
          <div class="select" @click="selectedFood(index)">
            <img v-if="item.selected" src="/static/icon_m/selected.png" />
            <span v-else class="sl"></span>
          </div>
          <div class="img">
            <img :src="item.img" />
          </div>
          <div class="info">
            <div class="des ellipsis2">{{item.des}}</div>
            <div class="size ellipsis2">{{item.collocation.config}}，租期{{item.leaseTerm}}个月</div>
            <div class="price">
              ￥
              <span>{{item.rent}}</span>
              <span class="deposit">押金{{item.deposit}}/1台</span>
            </div>
            <el-input-number
              v-model="item.num"
              @change="changeNum(index,item)"
              size="mini"
              :min="1"
              :step="1"
              step-strictly
              label="数量"
              class="numInput"
              style="height:22px;line-height:20px;"
            ></el-input-number>
          </div>
        </div>
      </div>
      <div class="btn" v-if="cartList.length>0">
        <div class="price">
          <div class="select" @click="selectedAll">
            <img v-if="isAllSelected" src="/static/icon_m/selected.png" />
            <span v-else class="sl"></span>
          </div>
          <span class="ta" @click="selectedAll">全选</span>
          <span class="tn">合计：</span>
          <span class="p">
            ￥
            <span class="big">{{totalPrice}}</span>
          </span>
        </div>
        <div class="sub">
          <div class="delFood" @click="delAll">删除</div>
          <div class="subOrder" @click="subOrder">
            结算
            <span v-if="tNum>0">({{selectedNum}})</span>
          </div>
        </div>
      </div>

      <footerm></footerm>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import search from "@/components/search/search";
import shoppingcart from "@/components/shopping/shoppingcart";
import footerm from "@/components/footer/footer";
import { arrayRemove, uniq, accMul } from "@/config/often";
import { mt_selectAllcart, mt_insertcart, mt_deletecart } from "@/api/common";
export default {
  name: "cartList",
  components: {
    headTop,
    footGuide,
    search,
    shoppingcart,
    footerm
  },
  data() {
    return {
      cartList: [],
      checkedAll: false,
      selectedNum: 0,
      totalPrice: 0,
      deposit: 0, //押金
      rent: 0,
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  watch: {
    //数量
    num(newVal, oldVal) {
      console.log(newVal);
    }
  },
  filters: {
    filterMoney2wei(value) {
      return value.toFixed(2);
      // formatNum(value)
    }
  },
  created() {
    let arr = [];
    Object.assign(arr, this.shoppingInfo.list);
    this.cartList = arr;
    this.cartList.forEach(item => {
      item.leaseTermOptions00 = JSON.parse(item.leaseTermOptions);
      item.leaseTermOptions00.forEach(items => {
        if (item.leaseTerm == items.value) {
          item.rent = items.rentMoney;
          item.deposit = items.depositMoney;
        }
      });
    });
    // console.log(this.cartList)
    let userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      this.getCarList();
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //选择商品
    selectedFood(index) {
      let arr = this.cartList;
      arr[index].selected = !arr[index].selected;
      this.cartList = arr;
      let arr1 = [];
      arr.forEach(item => {
        arr1.push(item.selected);
      });
      // 是否全选了商品
      if (arr1.indexOf(false) > -1) {
        this.isAllSelected = false;
      } else {
        this.isAllSelected = true;
      }
      console.log(this.cartList);
      this.computedPrice();
    },
    // 全选商品
    selectedAll() {
      let arr = this.cartList;
      arr.forEach(item => {
        if (this.isAllSelected == true) {
          item.selected = false;
        } else {
          item.selected = true;
        }
      });
      this.cartList = arr;
      this.isAllSelected = !this.isAllSelected;
      this.computedPrice();
    },
    //获取购物车列表
    getCarList() {
      let that = this;
      mt_selectAllcart().then(data => {
        // console.log(data.data.data);
        let arr1 = data.data.data;
        arr1.forEach(item => {
          item.collocation = JSON.parse(item.collocation);
          item.leaseTermOptions00 = JSON.parse(item.leaseTermOptions);
          item.leaseTermOptions00.forEach(items => {
            if (item.leaseTerm == items.value) {
              item.rent = items.rentMoney;
              item.deposit = items.depositMoney;
            }
          });
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
      let userInfo = localStorage.getItem("userInfo");
      // console.log(arr)
      // console.log(JSON.stringify(arr))
      if (userInfo) {
        mt_insertcart(JSON.stringify(arr)).then(data => {
          // console.log(data);
        });
      }
    },
    //单选
    checkgood(e) {
      // console.log(this.cartList)
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
          let userInfo = localStorage.getItem("userInfo");
          console.log(userInfo);
          if (userInfo) {
            that.deleteCart(value.id);
          } else {
            arrayRemove(that.cartList, value);
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
      if (that.selectedNum > 0) {
        that
          .$confirm("是否确认删除选中的商品?", "批量删除提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            // console.log(idarr);
            let userInfo = localStorage.getItem("userInfo");
            console.log(userInfo);
            if (userInfo) {
              let objArr = that.cartList;
              let idarr = [];
              objArr.forEach(item => {
                if (item.selected) {
                  idarr.push(item.id);
                }
              });
              that.deleteCart(idarr.join(","));
            } else {
              let objArr = that.cartList;
              that.cartList.forEach(item => {
                if (item.selected) {
                  arrayRemove(that.cartList, item);
                  let obj = {},
                    arr = that.cartList;
                  obj.list = arr;
                  that.setShoppingInfo(obj);
                }
              });
            }
          })
          .catch(() => {});
      } else {
        if (!that.mobileMode.result) {
          that.$message.warning("请先选择一个商品");
        } else {
          alert("请先选择一个商品");
        }
      }
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
      value.leaseTermOptions00.forEach(item => {
        if (value.leaseTerm == item.value) {
          this.cartList[index].rent = item.rentMoney;
          this.cartList[index].deposit = item.depositMoney;
        }
      });
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
      this.deposit = 0;
      this.rent = 0;
      this.totalPrice = 0;
      // console.log(this.cartList)
      this.cartList.forEach((item, index) => {
        if (item.selected) {
          this.selectedNum += 1;
          this.deposit += item.num * item.deposit;
          this.rent += item.rent * item.num * item.leaseTerm;
          this.totalPrice +=
            item.num * item.deposit + item.rent * item.num * item.leaseTerm;
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
        let status = JSON.parse(userInfo).status;
        if (status == 2) {
          if (this.selectedNum > 0) {
            let subTime = new Date().getTime();
            let arr = [],
              obj = {};
            arr = this.cartList;
            // console.log(this.cartList)
            arr.forEach((item, index) => {
              if (item.selected) {
                item.subTime = subTime;
              }
            });
            obj.list = arr;
            // console.log(obj)
            this.setShoppingInfo(obj);
            // localStorage.setItem('shoppingInfo',JSON.stringify(obj))
            this.updateCart(obj);
            // console.log(subTime)
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
.pc {
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
}

@media screen and (max-width: 769px) {
  .headerm {
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    font-size: 16px;
    color: #333333;
    text-align: center;
    position: relative;
    border-bottom: 1px solid #dddddd;
  }
  .mobile {
    padding-bottom: 100px;
  }

  .main .item {
    margin-top: 10px;
    padding: 10px 15px;
    display: flex;
    justify-content: flex-start;
    background-color: #ffffff;
    border-bottom: 1px solid #f1f1f1;
  }
  .main .item .select {
    flex: 0 33px 0;
    display: flex;
    align-items: center;
    padding-right: 7px;
  }
  .main .item .select .sl {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1px solid #b4b4b4;
    border-radius: 50%;
  }
  .main .item .select img {
    width: 18px;
    height: 18px;
  }
  .main .item .img {
    flex: 94px 0 0;
    width: 94px;
    height: 94px;
  }
  .main .item .img img {
    width: 100%;
    height: 100%;
  }
  .main .item .info {
    flex: 1;
    height: 94px;
    padding-left: 8px;
    position: relative;
  }
  .main .item .info .des {
    max-height: 32px;
    line-height: 16px;
    font-size: 14px;
    color: #333333;
  }
  .main .item .info .size {
    margin-top: 5px;
    line-height: 12px;
    font-size: 12px;
    color: #666666;
  }
  .main .item .info .numInput {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100px;
    height: 23px;
    line-height: 23px;
    border-radius: 2px;
    text-align: center;
    /deep/ .el-input--mini .el-input__inner {
      height: 22px;
      line-height: 20px;
    }
  }
  .main .item .info .price {
    width: 100%;
    height: 20px;
    line-height: 20px;
    margin-top: 5px;
    font-size: 12px;
    color: #f63f45;
  }
  .main .item .info .price .deposit {
    display: inline-block;
    line-height: 20px;
    margin-left: 10px;
    font-size: 12px;
    font-weight: normal;
    color: #666666;
  }
  .main .item .info .price span {
    font-size: 14px;
    font-weight: bold;
  }
  .main .item .info .price .num {
    float: right;
    padding-right: 10px;
    font-size: 13px;
    font-weight: normal;
    color: #959595;
  }

  .btn {
    position: fixed;
    bottom: 50px;
    left: 0;
    z-index: 9;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    background-color: #ffffff;
  }
  .btn div {
    width: 50%;
    line-height: 44px;
  }
  .btn .price {
    display: flex;
    justify-content: flex-start;
    padding-left: 15px;
    font-size: 15px;
    color: #161616;
    border-top: 1px solid #eeeeee;
  }
  .btn .price .select {
    flex: 23px 0 0;
    display: flex;
    align-items: center;
  }
  .btn .price .select .sl {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1px solid #b4b4b4;
    border-radius: 50%;
    position: relative;
    top: -2px;
  }
  .btn .price .select img {
    width: 18px;
    height: 18px;
  }
  .btn .price .ta {
    font-size: 12px;
    color: #959595;
    margin-right: 6px;
  }
  .btn .price .tn {
    font-size: 13px;
    color: #161616;
  }
  .btn .price .p {
    flex: 1;
    color: #f63f45;
    font-size: 11px;
    font-weight: bold;
  }
  .btn .price .p .big {
    font-size: 18px;
  }
  .btn .sub {
    display: flex;
    justify-content: flex-start;
    text-align: center;
    font-size: 16px;
    color: #ffffff;
  }
  .btn .sub div {
    flex: 1;
    color: #ffffff;
  }
  .btn .sub .delFood {
    background-color: #ffbc31;
  }
  .btn .sub .subOrder {
    background-color: #f63f45;
  }
}
</style>

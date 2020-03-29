<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <head-top></head-top>
      <div class="ordertop">
        <div class="container box">
          <router-link tag="div" to="/" class="img" title="信安首页">
            <img src="/static/icon/logo_black.png" alt />
          </router-link>
          <div class="navs">
            <router-link tag="span" to="/home" class="nav">首页</router-link>
            <span class="nav" :class="type==1?'active':''" @click="selectType(1)">我的订单</span>
            <span class="nav" :class="type==2?'active':''" @click="selectType(2)">续租订单</span>
          </div>
        </div>
      </div>
      <div class="orderList">
        <div class="container box">
          <div class="searchBox">
            <el-row>
              <el-col :span="7" class="itm">
                <span class="name">订单编号：</span>
                <el-input v-model="orderNum" placeholder class="inp"></el-input>
              </el-col>
              <el-col :span="7" class="itm">
                <span class="name">商品名称：</span>
                <el-input v-model="goodName" placeholder class="inp"></el-input>
              </el-col>
              <el-col :span="7" class="itm">
                <span class="name">购买日期：</span>
                <el-date-picker
                  v-model="buyTime"
                  type="date"
                  format="yyyy-MM"
                  value-format="yyyy-MM"
                  placeholder="选择日期时间"
                  class="longInput"
                ></el-date-picker>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" @click="searchOrder">搜索</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="ownlist">
            <div class="aslide">
              <div class="itm tit">订单中心</div>
              <div class="itm" :class="type==1?'active':''" @click="selectType(1)">我的订单</div>
              <div class="itm" :class="type==2?'active':''" @click="selectType(2)">续租订单</div>
            </div>
            <div class="main">
              <div class="tab">
                <span :class="showStatus==''?'active':''" @click="changeStatus('')">全部</span>
                <span :class="showStatus==1?'active':''" @click="changeStatus(1)">待付款</span>
                <span :class="showStatus==2?'active':''" @click="changeStatus(2)">待发货</span>
                <span :class="showStatus==3?'active':''" @click="changeStatus(3)">待收货</span>
                <span :class="showStatus==5?'active':''" @click="changeStatus(5)">待评价</span>
                <span :class="showStatus==6?'active':''" @click="changeStatus(6)">售后</span>
              </div>
              <div class="list">
                <div class="table">
                  <el-row class="title">
                    <el-col :span="14" style="text-align:center;">订单详情</el-col>
                    <el-col :span="3">价格</el-col>
                    <el-col :span="2">状态</el-col>
                    <el-col :span="5">操作</el-col>
                  </el-row>
                  <el-row
                    class="itm"
                    v-for="item of orderList"
                    :key="index"
                    v-if="orderList.length>0"
                  >
                    <el-col :span="24" class="ttt" style="padding-left:10px;">
                      {{item.createTime}}
                      <span style="margin-left:20px;color:#999999;">订单号：</span>
                      {{item.orderNum}}
                    </el-col>
                    <el-col :span="24" style="display:flex;">
                      <el-col :span="14">
                        <div
                          class="ginfos"
                          v-for="(items,indexs) of item.leaseOrderGoods"
                          :key="indexs"
                        >
                          <el-col :span="4" class="itms" style="text-align:center;">
                            <img :src="items.goodsImg" alt />
                          </el-col>
                          <el-col :span="12" class="itms">
                            <div
                              style="font-size:12px;color:#333333;height:18px;line-height:18px;"
                            >{{items.goodsName}}</div>
                            <div
                              class="ellipsis2"
                              style="font-size:12px;color:#999999;height:30px;line-height:15px;"
                            >{{items.proIntroduction}}</div>
                            <div
                              style="font-size:12px;color:#999999;height:12px;line-height:12px;"
                            >{{items.dispose}}</div>
                          </el-col>
                          <el-col
                            :span="4"
                            class="itms"
                            style="padding-top:20px;text-align:center;"
                          >
                            <div v-if="type==1">x{{items.goodsNumber}}</div>
                            <div v-if="type==2&&items.deposit==0">续租：{{items.goodsNumber}}</div>
                            <div
                              v-if="type==2&&items.deposit>0"
                            >续租：{{items.goodsNumber - items.newNumber }}</div>
                            <div v-if="type==2&&items.deposit>0">新租：{{items.newNumber}}</div>
                          </el-col>
                          <el-col
                            :span="4"
                            class="itms"
                            style="padding-top:20px;text-align:center;"
                          >
                            <router-link
                              tag="span"
                              :to="'/service/'+item.id+'/'+items.id"
                              v-if="(item.state==4||item.state==5||item.state==6) && items.afterSalesState==0"
                            >售后</router-link>
                            <span v-if="items.afterSalesState==2">售后处理中</span>
                            <span v-if="items.afterSalesState==1">售后已处理</span>
                          </el-col>
                        </div>
                      </el-col>
                      <el-col :span="3" class="min">总额：￥{{item.money}}</el-col>
                      <el-col :span="2" class="min">{{item.state | filterStatus}}</el-col>
                      <el-col :span="5" class="min opt">
                        <router-link tag="span" :to="'/orderDetail/'+item.id">订单详情</router-link>
                        <router-link tag="span" :to="'/pay/'+item.id" v-if="item.state==1">去付款</router-link>
                        <span v-if="item.state>2&&item.state!=7" @click="viewLogistics(item)">物流</span>
                        <span v-if="item.state==3" @click="confirmOrder(item)">确认收货</span>
                        <router-link tag="span" :to="'/comment/'+item.id" v-if="item.state==5">评价</router-link>
                        <router-link
                          tag="span"
                          :to="'/renewalOrder/'+item.id"
                          v-if="item.state==4||item.state==5"
                        >续租</router-link>
                      </el-col>
                    </el-col>
                  </el-row>
                  <div class="noorder" v-if="orderList.length==0">暂无该状态订单</div>
                </div>
              </div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count"
                style="text-align:right;"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
      <foot-guide></foot-guide>
      <el-dialog
        title="物流信息"
        :visible.sync="dialogLogistics"
        width="70%"
        :close-on-click-modal="false"
      >
        <logistics :data="logistics"></logistics>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogLogistics = false">确认</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue" style="position:fixed;top:0;right:0;height:44px;z-index:2;"></headertop>
      <div class="tab">
        <div class="itm" :class="showStatus==''?'active':''" @click="changeStatus('')">
          <span>全部</span>
        </div>
        <div class="itm" :class="showStatus==1?'active':''" @click="changeStatus(1)">
          <span>待付款</span>
        </div>
        <div class="itm" :class="showStatus==2?'active':''" @click="changeStatus(2)">
          <span>待发货</span>
        </div>
        <div class="itm" :class="showStatus==3?'active':''" @click="changeStatus(3)">
          <span>待收货</span>
        </div>
        <div class="itm" :class="showStatus==5?'active':''" @click="changeStatus(5)">
          <span>待评价</span>
        </div>
        <div class="itm" :class="showStatus==6?'active':''" @click="changeStatus(6)">
          <span>售后</span>
        </div>
      </div>
      <div class="wrapper" ref="wrapper" @scroll="gd_add">
        <div class="listItem">
          <div class="itm" v-for="(item,index) of orderList" :key="index">
            <div class="top">
              <span class="tx">{{item.orderNum}}</span>
              <span class="status">{{item.state | filterStatus}}</span>
            </div>
            <div
              class="itms"
              v-for="(items,indexs) of item.leaseOrderGoods"
              :key="indexs"
              @click="viewOrder(item.id)"
            >
              <div class="middle">
                <div class="img">
                  <img :src="items.goodsImg" />
                </div>
                <div class="info">
                  <div class="title ellipsis-2">{{items.goodsName}}</div>
                  <div class="des ellipsis-2">{{items.dispose}}</div>
                  <div class="tx">
                    <span v-if="type==1">数量：{{items.goodsNumber}}</span>
                    <span v-if="type==2&&items.deposit==0">续租:{{items.goodsNumber}}</span>
                    <span
                      v-if="type==2&&items.deposit>0"
                    >续租:{{items.goodsNumber - items.newNumber}}，新租:{{items.newNumber}}，租期{{items.goodsCycle}}个月</span>
                    <router-link
                      tag="span"
                      :to="'/service/'+item.id+'/'+items.id"
                      v-if="(item.state==4||item.state==5||item.state==6) && items.afterSalesState==0"
                    >申请售后</router-link>
                    <span class="afterSalesState" v-if="items.afterSalesState==2">售后处理中</span>
                    <span class="afterSalesState" v-if="items.afterSalesState==1">售后已处理</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom">
              <span class="time">{{item.createTime}}</span>
              <span class="money">
                实付：
                <span>￥{{item.money}}</span>
              </span>
            </div>
            <div class="btn">
              <router-link tag="span" :to="'/orderDetail/'+item.id">订单详情</router-link>
              <router-link tag="span" :to="'/orderDetail/'+item.id" v-if="item.state==1">去付款</router-link>
              <span v-if="item.state>2&&item.state!=7" @click="viewLogistics(item)">物流</span>
              <span v-if="item.state==3" @click="confirmOrder(item)">确认收货</span>
              <router-link tag="span" :to="'/comment/'+item.id" v-if="item.state==5">评价</router-link>
              <router-link
                tag="span"
                :to="'/renewalOrder/'+item.id"
                v-if="item.state==4||item.state==5"
              >续租</router-link>
            </div>
          </div>
          <div class="noContent" v-if="orderList.length==0">暂无该状态订单</div>
        </div>
      </div>
      <el-dialog
        title="物流信息"
        :visible.sync="dialogLogistics"
        width="100%"
        :fullscreen="true"
        :close-on-click-modal="false"
      >
        <logistics :data="logistics"></logistics>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogLogistics = false">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import logistics from "@/components/logistics/logistics";
import headertop from "@/components/mobile/header";
import { formatDate } from "@/config/often";
import {
  mt_getOrder,
  mt_getReletOrderByUser,
  mt_getOrderDetail,
  mt_confirmOrder
} from "@/api/order";
export default {
  name: "orderList",
  components: {
    headTop,
    footGuide,
    logistics,
    headertop
  },
  data() {
    return {
      type: 1, //1我的订单  2续租订单
      headValue: "我的订单",
      orderNum: "",
      goodName: "",
      buyTime: "",

      orderList: [],
      showStatus: "",

      page: 1,
      limit: 4,
      count: "", //总数

      dialogLogistics: false,
      logistics: [],
      scrollBottom: false,
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  watch: {
    //我的订单和续租订单变化
    type(newVal, oldVal) {
      this.showStatus = "";
      this.page = 1;
      this.orderList = []
      if (newVal == 1) {
        this.getMyOrder();
      } else {
        this.getMyReletOrder();
      }
    },
    //状态值变化
    showStatus(newVal, oldVal) {
      this.page = 1;
      this.orderList = []
      if (this.type == 1) {
        this.getMyOrder();
      } else {
        this.getMyReletOrder();
      }
    }
  },
  filters: {
    filterStatus(value) {
      // 订单状态 0已取消 1待付款 2待发货 3待收货 4已完成 5待评价 6已申请售后
      if (value == 0) {
        return "已取消";
      } else if (value == 1) {
        return "待付款";
      } else if (value == 2) {
        return "待发货";
      } else if (value == 3) {
        return "待收货";
      } else if (value == 4) {
        return "已完成";
      } else if (value == 5) {
        return "待评价";
      } else if (value == 6) {
        return "已申请售后";
      } else if (value == 7) {
        return "待确认打款";
      }
    }
  },
  created() {
    if (this.$route.params.type != undefined && this.$route.params.type == 2) {
      this.type = 2;
      this.headValue = "续租订单";
    } else {
      this.headValue = "我的订单";
      this.showStatus =
        this.$route.params.status != undefined ? this.$route.params.status : "";
      this.getMyOrder();
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    viewOrder(id) {
      this.$router.push("/orderDetail/" + id);
    },
    //加载更多
    gd_add() {
      let wrap_height = document.getElementsByClassName("wrapper")[0]
        .offsetHeight; //容器的高度
      let scroll_top = document.getElementsByClassName("wrapper")[0].scrollTop; //滚动条的scrolltop
      let scroll_height = document.getElementsByClassName("listItem")[0]
        .offsetHeight; //内容的高度
      let is_height = scroll_height - wrap_height - scroll_top;
      if (is_height<0.1 && this.count > this.orderList.length) {
        if(!this.scrollBottom){
           this.page++;
           this.scrollBottom = true
          if (this.type == 1) {
            console.log("我的订单");
            this.getMyOrder();
          } else {
            console.log("我的续租订单");
            this.getMyReletOrder();
          }
        }
      }
    },
    //获取我的订单
    getMyOrder() {
      let that = this;
      mt_getOrder(
        that.page,
        that.limit,
        that.showStatus,
        that.goodName,
        that.orderNum,
        that.buyTime
      ).then(data => {
        // console.log(data.data.data);
        data.data.data.forEach(item => {
          item.createTime = formatDate(item.createTime, "yyyy-MM-dd hh:mm");
        });
        that.count = data.data.count;
        if (!that.mobileMode.result) {
          that.orderList = data.data.data;
        } else if (that.mobileMode.result) {
          that.orderList = that.orderList.concat(data.data.data);
          that.scrollBottom = false
        }
        console.log(that.orderList.length);
      });
    },
    //获取我的续租订单
    getMyReletOrder() {
      let that = this;
      mt_getReletOrderByUser(
        that.page,
        that.limit,
        that.showStatus,
        that.goodName,
        that.orderNum,
        that.buyTime
      ).then(data => {
        data.data.data.forEach(item => {
          item.createTime = formatDate(item.createTime, "yyyy-MM-dd hh:mm");
        });
        data.data.data.forEach(item => {
          item.leaseOrderGoods.forEach(items => {
            if (items.deposit > 0) {
              items.newNumber =
                Number(items.deposit) / Number(items.oldDeoisit);
            } else {
              items.newNumber = 0;
            }
          });
        });
        that.count = data.data.count;
        if (!that.mobileMode.result) {
          that.orderList = data.data.data;
        } else {
          that.orderList = that.orderList.concat(data.data.data);
          that.scrollBottom = false
        }
        console.log(that.orderList.length);
      });
    },
    //搜索订单
    searchOrder() {
      this.page = 1;
      this.getMyOrder();
    },
    //切换我的订单和续租订单
    selectType(val) {
      if (val != this.type) {
        this.type = val;
      }
    },
    //选择订单状态
    changeStatus(val) {
      if (val != this.showStatus) {
        this.showStatus = val;
      }
    },
    handleSizeChange(val) {
      this.limit = val;
      if (this.type == 1) {
        this.getMyOrder();
      } else {
        this.getMyReletOrder();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      if (this.type == 1) {
        this.getMyOrder();
      } else {
        this.getMyReletOrder();
      }
    },
    //查看物流
    viewLogistics(value) {
      // console.log(value.id);
      this.getOrderDetail(value.id);
      this.dialogLogistics = true;
    },
    //获取我的订单
    getOrderDetail(id) {
      let that = this;
      mt_getOrderDetail(id).then(data => {
        // console.log(data.data);
        that.logistics =
          data.data.express != null
            ? JSON.parse(data.data.express.content)
            : [];
      });
    },
    //确认收货
    confirmOrder(value) {
      let that = this;
      mt_confirmOrder(value.id).then(data => {
        console.log(data.data);
        that.$message.success("确认收货成功", 1000);
        that.page = 1;
        that.getMyOrder();
      });
    },
    
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.pc {
  .orderList {
    padding: 20px 0 80px 0;
    .box {
      .searchBox {
        .itm {
          display: flex;
          .name {
            flex: 80px 0 0;
            line-height: 40px;
            font-size: 14px;
            color: #333333;
          }
          .inp {
            width: 80%;
            padding-right: 40px;
          }
        }
      }
      .ownlist {
        display: flex;
        margin-top: 20px;
        .aslide {
          flex: 116px 0 0;
          width: 116px;
          padding-top: 15px;
          background-color: #ffffff;
          .itm {
            padding: 15px 0 15px 15px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            &.active,
            &:hover {
              color: $mainColor;
              cursor: pointer;
            }
            &.tit {
              font-weight: bold;
              color: #333333;
            }
          }
        }
        .main {
          flex: 1;
          margin-left: 20px;
          padding: 10px 20px 20px 20px;
          background-color: #ffffff;
          .tab {
            display: flex;

            margin-bottom: 10px;
            span {
              height: 30px;
              line-height: 30px;
              padding: 0 28px;
              margin-right: 5px;
              font-size: 14px;
              color: #666666;
              &:hover,
              &.active {
                cursor: pointer;
                color: $mainColor;
              }
              &.active {
                cursor: pointer;
                border-bottom: 1px solid $mainColor;
              }
            }
          }
          .list {
            min-height: 540px;
            margin-bottom: 20px;
            .table {
              font-size: 12px;
              .title {
                background-color: #f5f5f5;
                line-height: 34px;
                height: 34px;
                margin-bottom: 10px;
                div {
                  color: #333333;
                  padding-left: 10px;
                  border-right: 1px solid #f1f1f1;
                  &:last-child {
                    border-right: none;
                  }
                }
              }
              .itm {
                margin-bottom: 10px;
                border: 1px solid #dddddd;
                .ttt {
                  background-color: #f5f5f5;
                  line-height: 32px;
                  height: 32px;
                  color: #aaaaaa;
                }
                .ginfos {
                  display: flex;
                  padding: 10px 0;
                  border-bottom: 1px solid #f1f1f1;
                  &:last-child {
                    border-bottom: none;
                  }
                  .itms {
                    padding-left: 10px;
                    overflow: hidden;
                    img {
                      max-height: 50px;
                      margin-top: 5px;
                    }
                    span {
                      &:hover {
                        cursor: pointer;
                        color: $mainColor;
                      }
                    }
                  }
                }
                .min {
                  padding-top: 20px;
                  color: #666666;
                  padding-left: 10px;
                  border-left: 1px solid #f1f1f1;
                  span {
                    display: inline-block;
                    margin-bottom: 10px;
                    color: #333333;
                    margin-right: 10px;
                    &:last-child {
                      margin-right: 0;
                    }
                    &:hover {
                      cursor: pointer;
                      color: $mainColor;
                    }
                  }
                }
                &:last-child {
                  div {
                    border-bottom: none;
                  }
                }
                .opt {
                  // text-align: center;
                  span {
                  }
                }
              }
              .noorder {
                height: 540px;
                font-size: 14px;
                padding-top: 40px;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .mobile {
    padding-top: 88px;

    .tab {
      display: flex;
      height: 44px;
      background-color: #fff;
      position: fixed;
      top: 44px;
      left: 0;
      right: 0;
      z-index: 2;
      border-bottom: 1px solid #f1f1f1;
    }

    .tab .itm {
      flex: 1;
      text-align: center;
    }

    .tab .itm span {
      position: relative;
      display: inline-block;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: #666;
    }

    .tab .itm.active text {
      color: #f2270c;
    }

    .tab .itm.active span:before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #f2270c;
    }
    .wrapper {
      position: fixed;
      top: 88px;
      bottom: 0;
      z-index: 2;
      width: 100%;
      overflow: scroll;
    }
    .noContent {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .listItem .itm {
      margin: 15px 15px 0 15px;
      padding: 10px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    }

    .listItem .itm .top {
      display: flex;
      line-height: 24px;
    }

    .listItem .itm .top .tx {
      flex: 1;
      font-size: 14px;
      color: #333;
      max-width: 90%;
    }

    .listItem .itm .top .status {
      font-size: 14px;
      color: #999;
    }

    .listItem .itm .middle {
      display: flex;
      margin-top: 5px;
    }

    .listItem .itm .middle .img {
      flex: 75px 0 0;
      width: 75px;
      height: 75px;
    }

    .listItem .itm .middle .img img {
      width: 75px;
      height: 75px;
      border-radius: 2px;
    }

    .listItem .itm .middle .info {
      flex: 1;
      padding-left: 10px;
    }
    .listItem .itm .middle .info .title {
      max-height: 32px;
      line-height: 16px;
      margin-bottom: 3px;
      font-size: 12px;
      color: #666666;
    }
    .listItem .itm .middle .info .des {
      min-height: 24px;
      line-height: 12px;
      margin-bottom: 3px;
      font-size: 10px;
      color: #999999;
    }
    .listItem .itm .middle .info .tx {
      line-height: 10px;
      font-size: 10px;
      color: #999999;
    }
    .afterSalesState {
      float: right;
    }
    .afterSalesState.b {
      padding: 4px;
      color: #333333;
      background-color: #f5f5f5;
      border: 1rpx solid #dddddd;
    }
    .listItem .itm .bottom {
      padding: 6px 0;
      font-size: 14px;
      color: #999;
      line-height: 21px;
    }
    .listItem .itm .bottom .money {
      float: right;
    }
    .listItem .itm .bottom .time {
      font-size: 10px;
      color: #999999;
    }
    .listItem .itm .bottom .money span {
      color: #151515;
    }

    .listItem .itm .btn {
      display: flex;
      flex-direction: row-reverse;
      text-align: right;
      padding-top: 10px;
      font-size: 14px;
      color: #333;
      line-height: 30px;
      position: relative;
    }

    .listItem .itm .btn::before {
      content: "";
      height: 0;
      display: block;
      border-top: 1px solid #e5e5e5;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }

    .listItem .itm .btn span {
      text-align: center;
      line-height: 28px;
      padding: 0 15px;
      border-radius: 4px;
      margin-left: 8px;
      position: relative;
      border: 1px solid #ccc;
      color: #333;
    }
    .listItem .itm .btn .imp {
      border: 1px solid #f08200;
      color: #f08200;
    }
  }
}
</style>

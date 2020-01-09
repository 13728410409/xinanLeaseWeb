<template>
  <div>
    <head-top></head-top>
    <div class="ordertop">
      <div class="container box">
        <router-link tag="div" to="/" class="img" title="信安首页">
          <img src="/static/icon/logo_black.png" alt />
        </router-link>
        <div class="navs">
          <router-link tag="span" to="/home" class="nav">首页</router-link>
          <router-link tag="span" to="/orderList" class="nav">我的订单</router-link>
        </div>
      </div>
    </div>
    <div class="orderDetail">
      <div class="container box">
        <div class="main">
          <div class="stateCont">
            <div class="orderStatus">
              <div class="num">订单号：{{detail.orderNum}}</div>
              <div
                class="status"
                :class="detail.orderState==4?'complete':''"
              >{{detail.orderState | filterStatus}}</div>
              <router-link
                tag="div"
                :to="'/comment/'+ id"
                class="comment"
                v-if="detail.orderState==5"
                title="点击去评价"
              >评价</router-link>
              <router-link
                tag="div"
                :to="'/pay/'+ id"
                class="comment"
                v-if="detail.orderState==1"
                title="点击去评价"
              >立即付款</router-link>
            </div>
            <logistics :data="logistics" style="padding: 0 20px;"></logistics>
          </div>
          <div class="orderInfo">
            <div class="item">
              <div class="title">收货人信息</div>
              <div class="itm">
                <div class="n">收货人：</div>
                <div class="v">{{detail.consignee}}</div>
              </div>
              <div class="itm">
                <div class="n">地址：</div>
                <div class="v">{{detail.addressV}}</div>
              </div>
              <div class="itm">
                <div class="n">手机号码：</div>
                <div class="v" v-if="detail.consigneePhone">{{detail.consigneePhone | filterPhone}}</div>
              </div>
            </div>
            <div class="item">
              <div class="title">配送信息</div>
              <div class="itm">
                <div class="n">配送方式：</div>
                <div class="v">普通快递</div>
                <!-- <div class="v">{{detail.courierWay}}</div> -->
              </div>
              <div class="itm">
                <div class="n">运费：</div>
                <div class="v">￥0</div>
                <!-- <div class="v">￥{{detail.courierMoney}}</div> -->
              </div>
            </div>
            <div class="item">
              <div class="title">付款信息</div>
              <div class="itm">
                <div class="n">付款方式：</div>
                <div class="v">在线支付</div>
                <!-- <div class="v"v-if="detail.payType!=null">{{detail.payType}}</div> -->
                <!-- <div class="v" v-else>未支付</div> -->
              </div>
              <div class="itm">
                <div class="n">付款时间：</div>
                <div class="v" v-if="detail.payTime!=null">{{detail.payTime}}</div>
                <div class="v" v-else>未支付</div>
              </div>
              <div class="itm">
                <div class="n">租金：</div>
                <div class="v">￥{{detail.rent}}</div>
              </div>
              <div class="itm">
                <div class="n">押金：</div>
                <div class="v">￥{{detail.deposit}}</div>
              </div>
              <div class="itm">
                <div class="n">应支付金额：</div>
                <div class="v">￥{{detail.payMoney}}</div>
              </div>
            </div>
            <div class="item" v-if="detail.taxNum">
              <div class="title">发票信息</div>
              <div class="itm">
                <div class="n">发票类型：</div>
                <div class="v">{{detail.invoiceType}}</div>
              </div>
              <div class="itm">
                <div class="n">公司名称：</div>
                <div class="v">{{detail.name}}</div>
              </div>
              <div class="itm">
                <div class="n">公司税号：</div>
                <div class="v">{{detail.taxNum}}</div>
              </div>
              <div class="itm">
                <div class="n">公司地址：</div>
                <div class="v">{{detail.addressV}}</div>
              </div>
            </div>
            <div class="item" v-else>
              <div class="title">发票信息</div>
              <div class="itm">
                <div class="n">发票信息：</div>
                <div class="v">无发票信息</div>
              </div>
            </div>
          </div>
          <div class="goodsInfo">
            <el-row class="title">
              <el-col :span="10" class="im name">商品名称</el-col>
              <el-col :span="4" class="im orderNum">类型和尺寸</el-col>
              <el-col :span="3" class="im price">价格（元）</el-col>
              <el-col :span="2" class="im num">商品数量</el-col>
              <el-col :span="5" class="im opt">操作</el-col>
            </el-row>
            <div class="table">
              <el-row class="b" v-for="(item,index) of goods" :key="index">
                <el-col :span="10" class="name">
                  <div class="img">
                    <img :src="item.goodsImg" alt />
                  </div>
                  <div class="info">
                    <div class="name ellipsis" :title="item.goodsName">{{item.goodsName}}</div>
                    <div class="name ellipsis3" :title="item.proIntroduction">{{item.proIntroduction}}</div>
                  </div>
                </el-col>
                <el-col :span="4" class="im orderNum">{{item.dispose}}</el-col>
                <el-col :span="3" class="im price">
                  <div class="info">
                    <div class="size">租金：{{item.rent}}</div>
                    <div class="size">押金：{{item.deposit}}</div>
                  </div>
                </el-col>
                <el-col :span="2" class="im num">{{item.goodsNumber}}</el-col>
                <el-col :span="5" class="im opt">
                  <router-link
                    tag="div"
                    :to="'/renewalOrder/'+id"
                    v-if="detail.orderState==4||detail.orderState==5"
                    title="去续租订单"
                  >续租</router-link>
                  <router-link
                    tag="div"
                    :to="'/service/'+id+'/'+item.id"
                    v-if="detail.orderState==4||detail.orderState==5"
                    title="申请售后"
                  >申请售后</router-link>
                </el-col>
              </el-row>
              <div class="pinfo" style="text-align:left;font-size:14px;" v-for="(item,index) of goods" :key="index" v-if="index=1&&goods[0].remark!=''">
                <span>留言：{{item.remark}}</span>
              </div>
              <div class="pinfo">
                <ul>
                  <li class="itm">
                    <div class="n">商品租金：</div>
                    <div class="v">￥{{detail.rent}}</div>
                  </li>
                  <li class="itm">
                    <div class="n">商品押金：</div>
                    <div class="v">￥{{detail.deposit}}</div>
                  </li>
                  <li class="itm">
                    <div class="n">物品运费：</div>
                    <div class="v" v-if="detail.courierMoney!=null&&detail.courierMoney!=''">￥{{detail.courierMoney}}</div>
                    <div class="v" v-else>￥0</div>
                  </li>
                  <li class="itm">
                    <div class="n">商品总额：</div>
                    <div class="v">￥{{detail.money}}</div>
                  </li>
                </ul>
              </div>
            </div>
           
          </div>
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
import logistics from "@/components/logistics/logistics";
import { mt_getOrderDetail } from "@/api/order";
import {formatDate} from "@/config/often";
export default {
  name: "orderDetail",
  components: {
    headTop,
    footGuide,
    logistics
  },
  data() {
    return {
      id: "",
      detail: {}, //订单详情
      goods: [],
      logistics: [],
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  watch: {},
  filters: {
    // 0已取消 1待付款 2待发货 3待收货 4已完成 5待评价 6已申请售后
    filterStatus(value) {
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
      }
    },
    filterPhone(val) {
      return val.substr(0, 3) + "****" + val.substr(7);
    },
    filterTime(val) {
      return formatDate(val,'yyyy-MM-dd hh:mm')
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.getOrderDetail(this.id);
  },
  methods: {
    //获取我的订单
    getOrderDetail(id) {
      let that = this;
      mt_getOrderDetail(id).then(data => {
        console.log(data.data)
        that.logistics = data.data.express!=null ?  JSON.parse(data.data.express.content): []
        that.goods = data.data.goods;
        that.detail = data.data.order;
        that.detail.addressV = data.data.order.address.split(",").join("");
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.orderDetail {
  .box {
    padding: 20px 0;
    .main {
      .stateCont {
        display: flex;
        padding: 20px 0;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        .orderStatus {
          flex: 300px 0 0;
          width: 300px;
          padding: 20px;
          border-right: 1px solid #f1f1f1;
          text-align: center;
          .num {
            margin-bottom: 35px;
            font-size: 13px;
            line-height: 18px;
            color: #999999;
          }
          .status {
            margin-bottom: 30px;
            font-size: 20px;
            font-weight: bold;
            line-height: 20px;
            color: #71b247;
            &.complete {
              color: #71b247;
            }
          }
          .comment {
            display: inline-block;
            line-height: 30px;
            padding: 0 30px;
            font-size: 13px;
            color: $mainColor;
            border-radius: 3px;
            border: 1px solid $mainColor;
            &:hover {
              cursor: pointer;
              background-color: $mainColor;
              color: #ffffff;
            }
          }
        }
      }
      .orderInfo {
        display: flex;
        margin-top: 20px;
        padding: 20px 0;
        min-height: 250px;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        .item {
          flex: 1;
          border-right: 1px solid #f1f1f1;
          &:last-child {
            border-right: none;
          }
          .title {
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            margin-bottom: 15px;
            padding: 0 20px;
          }
          .itm {
            padding: 0 20px;
            display: flex;
            .n {
              flex: 84px 0 0;
              width: 84px;
              font-size: 12px;
              line-height: 24px;
              color: #666666;
            }
            .v {
              font-size: 12px;
              line-height: 24px;
              color: #666666;
            }
          }
        }
      }
      .goodsInfo {
        margin-top: 20px;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        .title {
          background-color: #f7f7f7;
          padding: 0 20px;
          .im {
            text-align: center;
            line-height: 34px;
            font-size: 14px;
            color: #333333;
          }
        }
        .table {
          line-height: 24px;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #333333;
          .b {
            padding-bottom: 40px;
            border-bottom: 1px solid #dddddd;
            .name {
              text-align: left;
              display: flex;
              .img {
                flex: 60px 0 0;
                width: 60px;
                height: 60px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .info {
                flex: 1;
                padding-left: 15px;
                .name {
                  font-size: 12px;
                  line-height: 20px;
                  color: #666666;
                  &:hover {
                    cursor: pointer;
                    color: $mainColor;
                  }
                }
                .size {
                  font-size: 12px;
                  line-height: 20px;
                  color: #999999;
                }
              }
            }
            .opt {
              div {
                margin-bottom: 10px;
                &:hover {
                  cursor: pointer;
                  color: $mainColor;
                  text-decoration: underline;
                }
              }
            }
          }
          .pinfo {
            padding-top: 30px;
            overflow: hidden;
            ul {
              float: right;
              .itm {
                width: 200px;
                display: flex;
                font-size: 12px;
                line-height: 24px;
                margin-bottom: 5px;
                &:last-child {
                  .n {
                    color: $mainColor;
                  }
                  .v {
                    font-size: 18px;
                    font-weight: bold;
                    color: $mainColor;
                  }
                }
                .n {
                  flex: 60px 0 0;
                  text-align: left;
                  color: #666666;
                }
                .v {
                  flex: 1;
                  width: 100%;
                  text-align: right;
                  color: #666666;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

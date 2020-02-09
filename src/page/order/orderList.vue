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
                      <div class="ginfos"  v-for="(items,indexs) of item.leaseOrderGoods" :key="indexs">
                        <el-col :span="4" class="itms"  style="text-align:center;">
                          <img :src="items.goodsImg" alt />
                        </el-col>
                        <el-col :span="13" class="itms">
                          <div style="font-size:12px;color:#333333;height:18px;line-height:18px;">{{items.goodsName}}</div>
                          <div class="ellipsis2" style="font-size:12px;color:#999999;height:30px;line-height:15px;">{{items.proIntroduction}}</div>
                          <div style="font-size:12px;color:#999999;height:12px;line-height:12px;">{{items.dispose}}</div>
                        </el-col>
                        <el-col :span="3" class="itms" style="padding-top:20px;text-align:center;">
                          <div v-if="type==1">x{{items.goodsNumber}}</div>
                          <div v-if="type==2&&items.deposit==0">续租：{{items.goodsNumber}}</div>
                          <div v-if="type==2&&items.deposit>0">续租：{{items.goodsNumber - items.newNumber }}</div>
                          <div v-if="type==2&&items.deposit>0">新租：{{items.newNumber}}</div>
                        </el-col>
                        <el-col :span="4" class="itms" style="padding-top:20px;text-align:center;">
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
                      <router-link tag="span" :to="'/orderDetail/'+item.id" >订单详情</router-link>
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
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import logistics from "@/components/logistics/logistics";
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
    logistics
  },
  data() {
    return {
      type: 1, //1我的订单  2续租订单

      orderNum: "",
      goodName: "",
      buyTime: "",

      orderList: [],
      showStatus: "",

      page: 1,
      limit: 10,
      count: "", //总数

      dialogLogistics: false,
      logistics: []
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  watch: {
    //我的订单和续租订单变化
    type(newVal, oldVal) {
      this.showStatus = '';
      this.page = 1;
      if (newVal == 1) {
        this.getMyOrder();
      } else {
        this.getMyReletOrder();
      }
    },
    //状态值变化
    showStatus(newVal, oldVal) {
      this.page = 1;
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
    this.getMyOrder();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取我的订单
    getMyOrder() {
      let that = this;
      // status,name,orderNum,createTime
      this.orderList = [];
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
          item.createTime = formatDate(item.createTime,'yyyy-MM-dd hh:mm')
        });
        that.orderList = data.data.data;
        that.count = data.data.count;
      });
    },
    //获取我的续租订单
    getMyReletOrder() {
      let that = this;
      // status,name,orderNum,createTime
      // page, limit, status,name,orderNum,createTime
      this.orderList = [];
      mt_getReletOrderByUser(
        that.page,
        that.limit,
        that.showStatus,
        that.goodName,
        that.orderNum,
        that.buyTime
      ).then(data => {
        console.log(data.data);
        data.data.data.forEach(item =>{
          item.leaseOrderGoods.forEach(items =>{
            if(items.deposit>0){
              items.newNumber = Number(items.deposit)/Number(items.oldDeoisit)
            }else{
              items.newNumber = 0
            }
          })
        })
        // data.data.forEach(item=>{

        // })
        that.orderList = data.data.data;
        that.count = data.data.count;
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
      console.log(value.id);
      this.getOrderDetail(value.id);
      this.dialogLogistics = true;
    },
    //获取我的订单
    getOrderDetail(id) {
      let that = this;
      mt_getOrderDetail(id).then(data => {
        console.log(data.data);
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
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
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
                &:last-child{
                  border-bottom: none;
                }
                .itms{
                  padding-left: 10px;
                  overflow: hidden;
                  img {
                    max-height: 50px;
                    margin-top: 5px;
                  }
                  span{
                    &:hover{
                      cursor: pointer;
                      color: $mainColor;
                    }
                  }
                }
                
              }
              .min{
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
</style>

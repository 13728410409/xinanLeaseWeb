<template>
  <div>
    <head-top></head-top>
    <account-head></account-head>
    <div class="account">
      <div class="container box">
        <div class="ownlist1">
          <div class="mybox">
            <div class="tab">
              <router-link tag="span" class="back" to="/mycustomer">返回上一页</router-link>
            </div>
            <div class="mylog">
              <div class="typesel">
                <div class="top">
                  <div class="typs">
                    <!-- <span :class="typesel==1?'active':''">金牌收益</span> -->
                    <span>我的客户：{{customername}}</span>
                  </div>
                  <div class="searchBytime">
                    <div class="input">
                      <el-input v-model="orderNum" placeholder="请输入订单编号"></el-input>
                    </div>
                    <el-date-picker
                      v-model="startTime"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                    <el-button type="primary" @click="search">查询</el-button>
                  </div>
                </div>
                <div class="blist"  :class="bList.length>0?'true':''">
                  <div class="tit">订单列表</div>
                  <div class="table">
                    <el-row class="title">
                      <el-col :span="2">序号</el-col>
                      <el-col :span="5">订单编号</el-col>
                      <el-col :span="4">租赁金额</el-col>
                      <el-col :span="4">分佣收益</el-col>
                      <el-col :span="5">收入时间</el-col>
                      <el-col :span="4">销售人员</el-col>
                    </el-row>
                    <el-row
                      class="itm"
                      v-for="(item,index) of bList"
                      :key="index"
                      v-if="bList.length>0"
                    >
                      <el-col :span="2">{{index+1}}</el-col>
                      <el-col :span="5">{{item.orderNum}}</el-col>
                      <el-col :span="4">{{item.money}}</el-col>
                      <el-col :span="4">{{item.earnings}}</el-col>
                      <el-col :span="5">{{item.createTime}}</el-col>
                      <el-col :span="4">{{item.saleName}}</el-col>
                    </el-row>
                  </div>
                </div>
                <div class="noorder" v-if="bList.length==0">暂无记录</div>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="page"
                  :page-size="limit"
                  layout="total, prev, pager, next, jumper"
                  :total="count"
                  style="text-align:right;padding:20px;"
                ></el-pagination>
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
import accountHead from "@/components/accountHead/accountHead";
import { formatDate } from "@/config/often";
import { mt_queryMyCustomerOrder } from "@/api/my";
export default {
  name: "mysale",
  components: {
    headTop,
    footGuide,
    accountHead
  },
  data() {
    return {
      customerId: "",
      customername: "", //金牌姓名
      orderNum: "", //订单编号
      startTime: '', //搜索日期
      bList: [
        // {
        //   companyName: "mita ", //公司名称
        //   money: 483, //订单金额
        //   startTime: null,
        //   orderNum: "20191206164851", //订单编号
        //   creator: null,
        //   id: null,
        //   orderId: null,
        //   userId: null,
        //   userType: null,
        //   earnings: 10, //收益
        //   saleName: "李四", //销售人员
        //   createTime: 1575888816000, //时间
        //   type: null //1直接收益 2间接收益(总代才有)
        // }
      ],
       page: 1,
      limit: 10,
      count: 0,
      
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  created() {
    console.log(this.$route.params);
    this.customerId = this.$route.params.id;
    this.customername = this.$route.params.name;
    this.getList();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //搜索
    search(){
      this.page = 1
      this.getList()
    },
    //获取我的客户订单
    getList() {
      let that = this;
      // creator,orderNum,startTime,page,limit
      mt_queryMyCustomerOrder(
        that.customerId,
        that.orderNum,
        that.startTime!=null?that.startTime:'',
        that.page,
        that.limit
      ).then(data => {
        console.log(data.data);
        data.data.data.forEach(item=>{
          item.createTime = formatDate(item.createTime,'yyyy-MM-dd hh:mm')
        })
        that.bList = data.data.data
        that.count = data.data.count
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.account {
  padding: 30px 0 80px 0;
  .table {
    border: 1px solid #e6e6e6;
    font-size: 14px;
    text-align: center;
    background-color: #ffffff;
    .title {
      background-color: #fafafa;
      line-height: 40px;
      height: 40px;
      div {
        color: #333333;
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        &:last-child {
          border-right: none;
        }
      }
    }
    .itm {
      div {
        line-height: 50px;
        height: 50px;
        color: #666666;
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        &:last-child {
          border-right: none;
        }
        img {
          max-height: 40px;
          margin-top: 5px;
        }
        span {
          display: inline-block;
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
  }
  .noorder {
    height: 340px;
    font-size: 14px;
    padding-top: 40px;
    text-align: center;
  }
  .ownlist1 {
    .mybox {
      width: 100%;
      background-color: #ffffff;
      .tab {
        border-bottom: 1px solid #e6e6e6;
        font-size: 0;
        padding: 0 30px;
        span {
          display: inline-block;
          line-height: 50px;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
          &.back {
            margin-right: 20px;
            font-weight: normal;
            &:hover {
              cursor: pointer;
              text-decoration: underline;
              color: $mainColor;
            }
          }
        }
      }
      .mylog {
        padding: 0 30px 30px 30px;
        .minfo {
          margin-bottom: 20px;
          padding-bottom: 30px;
          border-bottom: 1px dashed #dddddd;
          text-align: center;
          .val {
            font-size: 20px;
            line-height: 20px;
            font-weight: bold;
            color: #333333;
            margin-bottom: 15px;
          }
          .n {
            font-size: 14px;
            color: #333333;
            line-height: 14px;
          }
        }
        .typesel {
          .top {
            padding: 20px 0;
            display: flex;
            .typs {
              flex: 330px 0 0;
              width: 330px;
              height: 40px;
              font-size: 0;
              span {
                display: inline-block;
                line-height: 40px;
                text-align: center;
                font-size: 14px;
                color: #333333;
              }
            }
            .searchBytime {
              flex: 1;
              text-align: right;

              button {
                margin-left: 20px;
              }
              .input {
                display: inline-block;
                width: 200px;
              }
            }
          }
          .blist {
            &.true {
              min-height: 340px;
            }
            .tit {
              font-size: 14px;
              line-height: 14px;
              margin-bottom: 20px;
              color: #333333;
            }
          }
        }
      }
    }
  }
}
</style>
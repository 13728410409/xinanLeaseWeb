<template>
  <div>
    <head-top></head-top>
    <account-head></account-head>
    <div class="account">
      <div class="container box">
        <div class="ownlist1">
          <!-- <base-info></base-info> -->
          <div class="mybox">
            <div class="mylog">
              <div class="typesel">
                <div class="top">
                  <div class="typs">
                    <router-link tag="span" class="back" to="/account">返回上一页</router-link>
                    <span style="font-weight:bold;">交易记录</span>
                  </div>
                  <!-- <div class="searchBytime">
                    <div class="input">
                      <el-input v-model="phone" placeholder="请输入手机号"></el-input>
                    </div>
                    <el-button type="primary" @click="search">查询</el-button>
                  </div> -->
                </div>
                <div class="blist" :class="bList.length>0?'true':''">
                  <div class="table">
                    <el-row class="title">
                      <el-col :span="4">交易流水号</el-col>
                      <el-col :span="5">变动原因</el-col>
                      <el-col :span="3">金额</el-col>
                      <el-col :span="2">状态</el-col>
                      <el-col :span="5">创建时间</el-col>
                      <el-col :span="5">处理时间</el-col>
                    </el-row>
                    <el-row class="itm" v-for="item of bList" :key="index" v-if="bList.length>0">
                      <el-col :span="4">{{item.flowNum}}</el-col>
                      <el-col :span="5">{{item.changeType | filterChangeType}}</el-col>
                      <el-col :span="3">{{item.money}}</el-col>
                      <el-col :span="2">{{item.state | filterStatus}}</el-col>
                      <el-col :span="5">{{item.createTime | filterTime}}</el-col>
                      <el-col :span="5">{{item.createTime | filterTime}}</el-col>
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
const regSJH = /^[1][0-9]{10}$/; //手机号正则
import { formatDate } from "@/config/often";
import { mt_leaseMoneyDetail } from "@/api/my";
export default {
  name: "mysale",
  components: {
    headTop,
    footGuide,
    accountHead
  },
  data() {
    return {
      bList: [
        // {
        //   name: "北京某某科技",
        //   orderNum: "20191224412",
        //   goodType: "服务器",
        //   leaseProfit: 1000,
        //   oProfit: 100,
        //   time: "2019/01/25 12:01",
        //   saleName: "张三"
        // }
      ],
      page: 1, //第几页
      limit: 10, // 每页多少
      count: 0, //总数量
    };
  },
  filters:{
    filterTime(val) {
      return formatDate(val, "yyyy-MM-dd hh:mm:ss");
    },
    // 1.充值 2.提现 3.收益
    filterChangeType(val) {
      if (val == 1) {
        return "充值";
      } else if (val == 2) {
        return "提现";
      } else if (val == 3) {
        return "商品下单";
      }else if (val == 4) {
        return '加盟入驻'
      }else if (val == 5) {
        return '天使'
      }
    }
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //搜索
    search() {
      this.page = 1;
      this.getList();
    },
    //获取我的销售
    getList() {
      let that = this;
      mt_leaseMoneyDetail(that.page, that.limit).then(data => {
        console.log(data.data);
        that.bList = data.data.data;
        that.count = data.data.count;
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
/deep/ .el-button--danger {
  color: #fff;
  background-color: $mainColor;
  border-color: $mainColor;
}
/deep/ .el-button--danger:hover {
  background-color: $mainHoverColor;
  border-color: $mainHoverColor;
}
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
              flex: 230px 0 0;
              width: 230px;
              height: 40px;
              font-size: 0;
              span {
                display: inline-block;
                line-height: 40px;
                font-size: 14px;
                color: #333333;
                &.back {
                  margin-right: 20px;
                  &:hover {
                    cursor: pointer;
                    text-decoration: underline;
                    color: $mainColor;
                  }
                }
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
.infoList {
  .item {
    margin-bottom: 10px;
    .einp {
      width: 220px;
    }
    .name {
      line-height: 40px;
      padding-right: 30px;
      font-size: 14px;
      color: #333333;
      text-align: right;
    }
    .line40 {
      line-height: 40px;
    }
  }
}
</style>
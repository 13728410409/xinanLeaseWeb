<template>
  <div>
    <head-top></head-top>
    <account-head></account-head>
    <div class="account">
      <div class="container box">
        <div class="ownlist" v-if="userInfo.type==1">
          <div class="aslide">
            <div class="itm tit" title="查看账户中心">账户中心</div>
            <div class="itm" :class="type==1?'active':''" @click="selectType(1)">我的账户</div>
            <div class="itm" :class="type==2?'active':''" @click="selectType(2)">分享推广</div>
            <div class="itm" :class="type==3?'active':''" @click="selectType(3)">我要充值</div>
          </div>
          <div class="main">
            <div class="titleName">{{type | filterType }}</div>
            <div class="list" v-if="type==1">
              <div class="moneyNum">
                当前余额(元)
                <span>￥{{userInfoData.money}}</span>
                <span class="rec" @click="recharge11">充值</span>
              </div>
              <div class="table">
                <el-row class="title">
                  <el-col :span="5">交易流水号</el-col>
                  <el-col :span="5">变动原因</el-col>
                  <el-col :span="3">金额</el-col>
                  <el-col :span="3">状态</el-col>
                  <el-col :span="4">创建时间</el-col>
                  <el-col :span="4">处理时间</el-col>
                </el-row>
                <el-row
                  class="itm"
                  v-for="item of moneylogList"
                  :key="index"
                  v-if="moneylogList.length>0">
                  <el-col :span="5">{{item.flowNum}}</el-col>
                  <el-col :span="5">{{item.changeType | filterChangeType}}</el-col>
                  <el-col :span="3">{{item.money}}</el-col>
                  <el-col :span="3">{{item.state | filterStatus}}</el-col>
                  <el-col :span="4">{{item.createTime | filterTime}}</el-col>
                  <el-col :span="4">{{item.createTime | filterTime}}</el-col>
                </el-row>
                <div class="noorder" v-if="count==0">暂无订单</div>
              </div>
            </div>
            <div class="list" v-if="type==2">
              <div class="shareImg">
                <div id="qrCode" ref="qrCodeDiv" style="width: 170px;margin: 0 auto;"></div>
                <div
                  class="copy-btn"
                  v-clipboard:copy="shareUrl"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制</div>
                <div class="tx">{{shareUrl}}</div>
                <div
                  class="copy-btn copy-btn1"
                  v-clipboard:copy="shareUrl"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制</div>
              </div>
            </div>
            <div class="list" v-if="type==3">
              <div class="recharge">
                <el-row class="itm">
                  <el-col :span="4" class="name">充值金额：</el-col>
                  <el-col :span="20" class="val">
                    <el-input v-model="reMoneyNum" maxlength="6" placeholder="充值金额" class="einp"></el-input>
                  </el-col>
                </el-row>
                <el-row class="itm">
                  <el-col :span="4" class="name">充值方式：</el-col>
                  <el-col :span="20" class="val">
                    <el-radio-group v-model="payWay">
                      <el-radio :label="1">微信</el-radio>
                      <el-radio :label="2">支付宝</el-radio>
                      <el-radio :label="3">对公账户打款</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
                <el-row class="itm bankInfo" v-if="payWay==3">
                  <el-col :span="24">
                    <el-col :span="24" class="tip">请根据以下对公账户进行打款</el-col>
                    <el-col :span="6" class="name">帐户名称：</el-col>
                    <el-col :span="18" class="val">{{bankInfo.name}}</el-col>
                    <el-col :span="6" class="name">收款账户：</el-col>
                    <el-col :span="18" class="val">{{bankInfo.number}}</el-col>
                    <el-col :span="6" class="name">银行账户：</el-col>
                    <el-col :span="18" class="val">{{bankInfo.bankName}}</el-col>
                    <el-col :span="6" class="name">银行地址：</el-col>
                    <el-col :span="18" class="val">{{bankInfo.bankCity}}</el-col>
                    <el-col :span="6" class="name">开户网点：</el-col>
                    <el-col :span="18" class="val">{{bankInfo.bankDian}}</el-col>
                    <!-- <div v-if="weixinFlag" id="qrCode1" ref="qrCode1" style="width: 170px;margin: 0 auto;"></div> -->
                    <!-- <div class="btnRechargeStatus" @click="rechargeAccount">立即充值</div> -->
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-pagination
              v-if="type==1"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="count"
              style="text-align:right;padding:20px;"
            ></el-pagination>
          </div>
        </div>
        <div class="ownlist1" v-else>
          <base-info :data="userInfoData"></base-info>
          <div class="mybox">
            <div class="tab">
              <span class>我的收益</span>
              <router-link tag="span" to="moneyLog" class="moneyLog">交易记录</router-link>
              <span class="moneyLog" style="margin:0 20px;" @click="recharge11">充值</span>
            </div>
            <div class="mylog">
              <el-row class="minfo">
                <el-col :span="8">
                  <div class="val">{{accountDetail.allEarning}}</div>
                  <div class="n">总收益(元)</div>
                </el-col>
                <el-col :span="8">
                  <div class="val">{{accountDetail.monthEarning}}</div>
                  <div class="n">本月收益(元)</div>
                </el-col>
                <el-col :span="8">
                  <div class="val">{{accountDetail.lastMonthEarning}}</div>
                  <div class="n">上月收益(元)</div>
                </el-col>
              </el-row>
              <div class="typesel" v-if="userInfo.type!=4">
                <div class="top">
                  <div class="typs">
                    <span :class="typesel==1?'active':''" @click="selectTypesel(1)">我的收益</span>
                    <span v-if="userInfo.type==3" :class="typesel==2?'active':''" @click="selectTypesel(2)">金牌收益</span>
                  </div>
                  <div class="searchBytime">
                    <div class="input">
                      <el-input v-model="orderNum" placeholder="请输入订单编号"></el-input>
                    </div>
                    <el-date-picker
                      v-model="searchTime"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                    <el-button type="primary" @click="searchByTime">查询</el-button>
                  </div>
                </div>

                <div class="blist" :class="bList.length>0?'true':''">
                  <div class="table" v-if="userInfo.type!=9">
                    <el-row class="title">
                      <el-col :span="1">序号</el-col>
                      <el-col :span="5">金牌名称</el-col>
                      <el-col :span="4">订单编号</el-col>
                      <el-col :span="3">租赁金额</el-col>
                      <el-col :span="3">分佣金额</el-col>
                      <el-col :span="4">收入时间</el-col>
                      <el-col :span="4">销售人员</el-col>
                    </el-row>
                    <el-row
                      class="itm"
                      v-for="(item,index) of bList"
                      :key="index"
                      v-if="bList.length>0">
                      <el-col :span="1">{{index+1}}</el-col>
                      <el-col :span="5">{{item.companyName}}</el-col>
                      <el-col :span="4">{{item.orderNum}}</el-col>
                      <el-col :span="3">{{item.money}}</el-col>
                      <el-col :span="3">{{item.earnings}}</el-col>
                      <el-col :span="4">{{item.createTime}}</el-col>
                      <el-col :span="4">{{item.saleName}}</el-col>
                    </el-row>
                  </div>
                  <div class="table" v-if="userInfo.type==9">
                    <el-row class="title">
                      <el-col :span="2">序号</el-col>
                      <el-col :span="5">金牌名称</el-col>
                      <el-col :span="5">分佣金额</el-col>
                      <el-col :span="7">描述</el-col>
                      <el-col :span="5">收入时间</el-col>
                    </el-row>
                    <el-row class="itm" v-for="(item,index) of bList" :key="index" v-if="bList.length>0">
                      <el-col :span="2">{{index+1}}</el-col>
                      <el-col :span="5">{{item.companyName}}</el-col>
                      <el-col :span="5">{{item.earnings}}</el-col>
                      <el-col :span="7">{{item.subject}}</el-col>
                      <el-col :span="5">{{item.createTime}}</el-col>
                    </el-row>
                  </div>
                </div>
                <div class="noorder" v-if="bList.length==0">暂无记录</div>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="page"
                  :page-size="limit"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="bList.length"
                  style="text-align:right;padding:20px;"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <foot-guide></foot-guide>
    <pay ref="payCom" @completeOpt="completePay"></pay>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import accountHead from "@/components/accountHead/accountHead";
import baseInfo from "@/components/baseInfo/baseInfo";
import pay from '@/components/common/pay'
import QRCode from "qrcodejs2";
import { jsGetAge, formatDate } from "@/config/often";
import { websiteUrl } from '@/config/env'
import {
  mt_getuserInfo,
  mt_leaseMoneyDetail,
  mt_selectMyEarnings,
  mt_queryEarningPage
} from "@/api/my";
import { mt_querySystemBank } from '@/api/order'
const regJE = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/; //金额正则
const regMM = /^\d{6,8}$/; //密码正则
export default {
  name: "account",
  components: {
    headTop,
    footGuide,
    accountHead,
    baseInfo,
    pay
  },
  data() {
    return {
      type: "", //1我的账户  2分享推广  3我要充值
      userInfoData: {}, //个人信息
      moneylogList: [], //金额明细
      shareUrl: "", //分享链接
      reMoneyNum: "", //充值金额
      payWay: 0, //1微信  2支付宝 3企业对公账户
      bankInfo: {}, //对公账户信息
      accountDetail: { }, //账户信息
      typesel: 1, //1我的收益  2金牌收益
      searchTime: "", //搜索日期
      orderNum: "",
      bList: [],
      page: 1, //第几页
      limit: 10, // 每页多少
      count: "" //总数量
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  watch: {
    //侧边栏变化
    type(newVal, oldVal) {
      if (newVal == 1) {
        this.getMoneyLog();
      } else if (newVal == 2) {
        this.shareUrl = websiteUrl+'/shareRegister/'+this.userInfo.code
        this.useqrcode(this.shareUrl);
      } else if (newVal == 3) {
        if (oldVal == 2) {
          this.destriyQrcode();
        }
      } else if (newVal == 0) {
        this.getMyEarnings();
        this.getQueryEarningPage();
      }
    },
    //充值方式改变 1微信  2支付宝 3企业对公账户
    payWay(newVal, oldVal) {
      if (newVal == 3) {
        this.querySystemBank();
      }else{
        this.$refs.payCom.show()
      }
    },
    typesel(newVal, oldVal){
      this.page = 1
      this.getQueryEarningPage();
    },
  },
  filters: {
    filterType(value) {
      if (value == 1) {
        return "我的账户";
      } else if (value == 2) {
        return "分享推广";
      } else if (value == 3) {
        return "我要充值";
      }
    },
    filterStatus(value) {
      if (value == 1) {
        return "是";
      } else if (value == 0) {
        return "否";
      }
    },
    //余额
    filterMoney(val) {
      if (val != "" && val != null) {
        // console.log(formatDate(val,'yyyy-MM-dd'))
        return val;
      } else {
        return 0;
      }
    },
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
        return "下单";
      } else if (val == 4) {
        return "加盟入驻";
      } else if (val == 5) {
        return "天使入驻";
      }else{
        return '其它'
      }
    }
  },
  created() {
    this.getUserInfo();
    let shareLink = this.$route.params.shareLink != undefined&&this.$route.params.shareLink != null ? this.$route.params.shareLink : ''
    if(shareLink=='mitaTrue'){
      this.type = 2
    }else{
      if (this.userInfo.type == 1) {
        this.type = 1;
      } else {
        this.type = 0;
      }
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取个人信息
    getUserInfo() {
      let that = this;
      mt_getuserInfo().then(data => {
        // console.log(data.data)
        that.userInfoData = data.data;
        that.setUserInfo(data.data);
      });
    },
    //获取订单流水记录
    getMoneyLog() {
      let that = this;
      mt_leaseMoneyDetail(that.page, that.limit).then(data => {
        console.log(data.data);
        that.moneylogList = data.data.data;
        that.count = data.data.count;
      });
    },
    //获取收益总 本月 上月
    getMyEarnings() {
      let that = this;
      mt_selectMyEarnings().then(data => {
        // console.log(data.data);
        that.accountDetail = data.data;
      });
    },
    selectTypesel(val) {
      if (val != this.type) {
        this.typesel = val;
      }
    },
    //我的收益1 或金牌收益
    getQueryEarningPage() {
      let that = this;
      mt_queryEarningPage(
        that.typesel,
        that.searchTime!=null?that.searchTime:'',
        that.orderNum,
        that.page,
        that.limit
      ).then(data => {
        // console.log(data.data);
        data.data.data.forEach(item=>{
          item.createTime = formatDate(item.createTime,'yyyy-MM-dd hh:mm')
        })
        that.bList = data.data.data
        that.count = data.data.count;
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      if (this.type == 1) {
        this.getMoneyLog();
      } else {
        this.getQueryEarningPage();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      if (this.type == 1) {
        this.getMoneyLog();
      } else {
        this.getQueryEarningPage();
      }
    },
    //切换
    selectType(val) {
      if (val != this.type) {
        this.type = val;
      }
    },
    // 销毁微信二维码
    destriyQrcode() {
      // console.log('------销毁微信二维码-----')
      var wxcode = document.getElementById("qrCode");
      var childs = wxcode.childNodes;
      if (childs != null) {
        for (var i = childs.length - 1; i >= 0; i--) {
          wxcode.removeChild(childs[i]);
        }
      }
    },
    //生成分享链接二维码
    useqrcode(url) {
      let that = this;
      setTimeout(function() {
        new QRCode(that.$refs.qrCodeDiv, {
          text: url,
          width: 170,
          height: 170,
          colorDark: "#333333", //二维码颜色
          colorLight: "#ffffff", //二维码背景色
          correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
        });
        let timestamp = new Date().getTime() + 60 * 1000;
      }, 100);
    },
    // 复制成功时的回调函数
    onCopy(e) {
      this.$message({
        message: "内容已复制到剪切板！",
        type: "success",
        duration: 1000
      });
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message({
        message: "抱歉，复制失败！",
        type: "success",
        duration: 1000
      });
    },
    //获取对公账号信息
    querySystemBank(){
      mt_querySystemBank().then(data => {
        console.log(data.data)
        this.bankInfo = data.data
      })
    },
    // 销毁微信二维码
    destriyQrcode1() {
      // console.log('------销毁微信二维码-----')
      var wxcode = document.getElementById("qrCode1");
      var childs = wxcode.childNodes;
      if (childs != null) {
        for (var i = childs.length - 1; i >= 0; i--) {
          wxcode.removeChild(childs[i]);
        }
      }
    },
    // //充值
    // recharge(url) {
    //   let that = this;
    //   setTimeout(function() {
    //     new QRCode(that.$refs.qrCode1, {
    //       text: url,
    //       width: 170,
    //       height: 170,
    //       colorDark: "#333333", //二维码颜色
    //       colorLight: "#ffffff", //二维码背景色
    //       correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
    //     });
    //     let timestamp = new Date().getTime() + 60 * 1000;
    //   }, 100);
    // },
    //搜索
    searchByTime() {
      this.getQueryEarningPage()
    },
    
    //充值
    recharge11(){
      this.$refs.payCom.show()
    },
    //更新方法
    completePay(){
      if(this.userInfo.type==1){
        this.page = 1
        this.getMoneyLog()
      }else{
        this.$router.push('/moneyLog')
      }
    },

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
.el-button--primary {
  background-color: $mainColor !important;
  border-color: $mainColor !important;
}
.el-button--primary:hover {
  background-color: $mainHoverColor !important;
  border-color: $mainHoverColor !important;
}
.account {
  padding: 30px 0 80px 0;
  .box {
    .ownlist {
      display: flex;
      margin-bottom: 20px;
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
            font-size: 16px;
            font-weight: bold;
            color: #333333;
          }
        }
      }
      .main {
        flex: 1;
        margin-left: 20px;
        background-color: #ffffff;
        .titleName {
          line-height: 50px;
          padding-left: 20px;
          border-bottom: 10px solid #f6f6f6;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
        }
        .list {
          min-height: 504px;
          padding: 0 20px;
          .moneyNum {
            line-height: 60px;
            font-size: 14px;
            color: #666666;
            span {
              margin-left: 10px;
              font-size: 18px;
              font-weight: bold;
              color: $mainColor;
              &.rec{
                float:right;
                font-size: 16px;
                font-weight:normal;
                &:hover{
                  cursor: pointer;
                  text-decoration: underline;
                  color: $mainHoverColor;
                }
              }
            }
          }

          .shareImg {
            padding-top: 40px;
            .copy-btn {
              width: 170px;
              line-height: 40px;
              margin: 20px auto;
              text-align: center;
              font-size: 14px;
              background-color: $mainColor;
              color: #ffffff;
              border-radius: 3px;
              &:hover {
                cursor: pointer;
                background-color: $mainHoverColor;
              }
            }
            .tx {
              margin-top: 50px;
              text-align: center;
              font-size: 14px;
              color: #666666;
            }
            .copy-btn1 {
              background-color: #ffffff;
              border: 1px solid #3573d8;
              color: #3573d8;
              &:hover {
                background-color: #ffffff;
                border: 1px solid $mainColor;
                color: $mainColor;
              }
            }
          }
          .recharge {
            width: 500px;
            margin: 0 auto;
            padding-top: 40px;
            .itm {
              margin-bottom: 20px;
              .name {
                line-height: 40px;
                font-size: 14px;
              }
              .val {
                line-height: 40px;
                font-size: 14px;
              }
              &.bankInfo {
                padding: 15px 0;
                border: 1px solid #f1f1f1;
                background-color: #f5f5f5;
                .tip{
                  line-height: 40px;
                  font-size: 14px;
                  color: #f08200;
                  padding-left: 30px;
                }
                .name{
                  text-align: right;
                  padding-right: 10px;
                }
                .val{
                  padding-left: 10px;
                }
              }
            }
            // .btnRechargeStatus {
            //   width: 170px;
            //   line-height: 40px;
            //   margin: 30px auto;
            //   text-align: center;
            //   font-size: 14px;
            //   background-color: $mainColor;
            //   color: #ffffff;
            //   border-radius: 3px;
            //   &:hover {
            //     cursor: pointer;
            //     background-color: $mainHoverColor;
            //   }
            // }
          }
        }
      }
    }
    .table {
      border: 1px solid #e6e6e6;
      font-size: 14px;
      .title {
        background-color: #fafafa;
        line-height: 40px;
        height: 40px;
        div {
          color: #333333;
          padding-left: 10px;
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
          padding-left: 10px;
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
          }
          .moneyLog{
            float: right;
            color: $mainColor;
            &:hover{
              cursor: pointer;
              text-decoration: underline;
              color: $mainHoverColor;
            }
          }
        }
        .mylog {
          padding: 34px 30px 30px 30px;
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
                  width: 110px;
                  line-height: 40px;
                  text-align: center;
                  font-size: 14px;
                  color: #333333;
                  border: 1px solid #dddddd;
                  &.active {
                    border: none;
                    background-color: $mainColor;
                    color: #ffffff;
                    &:hover {
                      color: #ffffff;
                    }
                  }
                  &:hover {
                    cursor: pointer;
                    color: $mainColor;
                  }
                  &:first-child {
                    border-top-left-radius: 3px;
                    border-bottom-left-radius: 3px;
                  }
                  &:last-child {
                    border-top-right-radius: 3px;
                    border-bottom-right-radius: 3px;
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
            }
          }
        }
      }
    }
  }
}
</style>

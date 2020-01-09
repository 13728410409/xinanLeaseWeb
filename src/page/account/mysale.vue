<template>
  <div>
    <head-top></head-top>
    <account-head></account-head>
    <div class="account">
      <div class="container box">
        <div class="ownlist1">
          <!-- <base-info></base-info> -->
          <div class="mybox">
            <div class="tab">
              <router-link tag="span" class="back" to="/account">返回上一页</router-link>
              <!-- <span>新增销售</span> -->
              <span class="add" @click="addSale">添加销售人员</span>
            </div>
            <div class="mylog">
              <div class="typesel">
                <div class="top">
                  <div class="typs">
                    <!-- <span :class="typesel==1?'active':''">金牌收益</span> -->
                    <!-- <span>销售姓名：{{salename}}</span> -->
                  </div>
                  <div class="searchBytime">
                    <div class="input">
                      <el-input v-model="phone" placeholder="请输入手机号"></el-input>
                    </div>
                    <el-button type="primary" @click="search">查询</el-button>
                  </div>
                </div>
                <div class="blist">
                  <div class="tit">销售列表</div>
                  <div class="table">
                    <el-row class="title">
                      <el-col :span="1">序号</el-col>
                      <el-col :span="5">姓名</el-col>
                      <el-col :span="6">联系电话</el-col>
                      <el-col :span="6">租赁收益总额（元）</el-col>
                      <el-col :span="6">操作</el-col>
                    </el-row>
                    <el-row
                      class="itm"
                      v-for="(item,index) of bList"
                      :key="index"
                      v-if="bList.length>0"
                    >
                      <el-col :span="1">{{index+1}}</el-col>
                      <el-col :span="5">{{item.userName}}</el-col>
                      <el-col :span="6">{{item.phone}}</el-col>
                      <el-col :span="6">{{item.earningsMoney}}</el-col>
                      <el-col :span="6">
                        <el-button size="mini" @click="viewDetail(item)">详情</el-button>
                        <el-button
                          type="danger"
                          size="mini"
                          v-if="item.isEnable==1"
                          @click="toggle(item.id,item.isEnable)"
                        >停用</el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          v-if="item.isEnable==0"
                          @click="toggle(item.id,item.isEnable)"
                        >启用</el-button>
                      </el-col>
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
    <el-dialog
      title="添加销售人员"
      :visible.sync="dialogAddSale"
      width="440px"
      :close-on-click-modal="false"
    >
      <div class="infoList">
        <el-row class="item">
          <el-col :span="24">
            <el-col :span="6" class="name">姓名</el-col>
            <el-col :span="12" class="line40">
              <el-input v-model="sname" maxlength="20" placeholder="填写姓名" class="einp"></el-input>
            </el-col>
          </el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="24">
            <el-col :span="6" class="name">手机号</el-col>
            <el-col :span="12" class="line40">
              <el-input v-model="sphone" maxlength="11" placeholder="填写手机号" class="einp"></el-input>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddSale = false">取消</el-button>
        <el-button type="danger" @click="saveSale">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import accountHead from "@/components/accountHead/accountHead";
import { mt_queryMySales, mt_disableSale, mt_batchAddUser } from "@/api/my";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "mysale",
  components: {
    headTop,
    footGuide,
    accountHead
  },
  data() {
    return {
      phone: "", //输入手机号
      bList: [],
      page: 1,
      limit: 10,
      count: 0,

      dialogAddSale: false,
      sname: "",
      sphone: ""
    };
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
    //查看销售详情
    viewDetail(val) {
      console.log(val);
      this.$router.push("/saleDetail/" + val.code + "/" + val.nickName);
    },
    //搜索
    search() {
      this.page = 1;
      this.getList();
    },
    //获取我的销售
    getList() {
      let that = this;
      mt_queryMySales(that.phone, that.page, that.limit).then(data => {
        console.log(data.data);
        data.data.data.forEach(item=>{
          item.earningsMoney = item.earningsMoney!=null ? item.earningsMoney : 0
        })
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
    },
    //添加销售
    addSale() {
      this.dialogAddSale = true;
    },
    //确认添加销售
    // [{"userName":"2222","phone":"2222"},{"userName":"6666","phone":"6666"}]
    saveSale() {
      let that = this;
      if (that.sname == "") {
        that.$message.error("姓名填写不正确！");
      } else if (!regSJH.test(that.sphone)) {
        that.$message.error("手机号填写不正确！");
      } else {
        let data = {
          userName: this.sname,
          phone: this.sphone
        };
        let arr = [];
        arr.push(data);
        console.log(JSON.stringify(arr))
        mt_batchAddUser(JSON.stringify(arr)).then(data => {
          console.log(data);
          this.dialogAddSale = false;
          that.getList();
        });
      }
    },
    //启用与停用
    toggle(id, val) {
      let that = this,
        isEnable = "",
        title = "";
      if (val == 1) {
        isEnable = 0;
        title = "禁用";
      } else {
        isEnable = 1;
        title = "启用";
      }
      that
        .$confirm("是否确认" + title + "该销售账户", title + "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          mt_disableSale(id, isEnable).then(data => {
            console.log(data.data);
            that.$message.success(title + "成功", 1000);
            that.getList();
          });
        })
        .catch(() => {});
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
          &.add {
            float: right;
            color: #3573d8;
            font-weight: normal;
            &:hover {
              cursor: pointer;
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
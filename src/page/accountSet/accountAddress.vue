<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <head-top></head-top>
      <account-head></account-head>
      <div class="orderList">
        <div class="container box">
          <div class="ownlist">
            <div class="aslide">
              <div class="itm tit">账户设置</div>
              <router-link tag="div" to="/accountSet" class="itm">基础资料</router-link>
              <router-link tag="div" to="/accountAddress" class="itm active">寄送地址</router-link>
              <router-link tag="div" to="/accountSafe" class="itm">安全验证</router-link>
              <router-link tag="div" to="/accountCompany" class="itm">企业信息</router-link>
            </div>
            <div class="main">
              <div class="tab">
                <span class="add" title="点击新增收货地址" @click="add">新增收货地址</span>
                <span class="tip">
                  您已创建
                  <i>{{addressData.length}}</i>个收货地址
                </span>
              </div>
              <div class="table">
                <el-row class="content">
                  <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                      <el-table
                        :data="addressData"
                        border
                        style="width: 100%;min-height:574px;"
                        :header-cell-style="styleObj"
                        :cell-style="cellStyle"
                      >
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="consignee" label="收货人" min-width="140"></el-table-column>
                        <el-table-column prop="addressV" label="地址" min-width="400"></el-table-column>
                        <el-table-column prop="phone" label="联系方式" min-width="120"></el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="240">
                          <template slot-scope="scope">
                            <el-button size="small" @click="edit(scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="deleteA(scope.row)">删除</el-button>
                            <el-button type="danger" size="small" v-if="scope.row.isDefault==1">默认地址</el-button>
                            <el-button size="small" v-else @click="setDefault(scope.row)">设为默认</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <foot-guide></foot-guide>
      <!-- 地址管理弹窗 -->
      <el-dialog
        :title="title"
        :visible.sync="dialogPAddress"
        width="700px"
        :close-on-click-modal="false"
      >
        <div class="infoList">
          <el-row class="item">
            <el-col :span="4" class="name">
              <i>*</i>收货人
            </el-col>
            <el-col :span="8" class="line40">
              <el-input v-model="name" maxlength="12" placeholder="收货人" class="einp"></el-input>
            </el-col>
            <el-col :span="4" class="name">
              <i>*</i>联系方式
            </el-col>
            <el-col :span="8" class="line40">
              <el-input v-model="phone" maxlength="11" placeholder="联系方式" class="einp"></el-input>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="4" class="name">
              <i>*</i>所在地区
            </el-col>
            <el-col :span="20" class="line40">
              <el-cascader
                style="width: 100%;"
                :options="options"
                v-model="addressArr"
                @change="handleChange"
              ></el-cascader>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="4" class="name">
              <i>*</i>详细地址
            </el-col>
            <el-col :span="20">
              <el-input
                style="width: 100%;"
                type="textarea"
                :rows="2"
                placeholder="请输入详细地址"
                v-model="detailAddress"
                maxlength="30"
              ></el-input>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPAddress = false">取消</el-button>
          <el-button type="danger" @click="submit">确认</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="addressListBox">
        <div class="address">
          <div class="nbox">
            <div
              class="nzxItm"
              v-for="(item,index) of addressData"
              :key="index"
              @click="selectedAddressValue(item)"
            >
              <div class="ninfo">
                <div class="top" data-type="1">
                  <span>{{item.consignee}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.phones}}</span>
                </div>
                <div class="middle" v-if="item.address!=''">{{item.addressV}}</div>
              </div>
              <div class="nbtn">
                <span class="y" @click.stop="edit(item)">改</span>
                <span class="b" @click.stop="deleteA(item)">删</span>
              </div>
            </div>
            <div class="noContent" v-if="addressData.length==0">暂无收货地址</div>
          </div>
          <div class="submit" @click="add">
            <div>新增收货地址</div>
          </div>
        </div>
      </div>
      <!-- 地址管理弹窗 -->
      <el-dialog
        title="地址管理"
        :visible.sync="dialogPAddress"
        :fullscreen="true"
        :close-on-click-modal="false"
      >
        <div class="infoList">
          <el-row class="item">
            <el-col :span="24" class="line40">
              <el-input v-model="name" maxlength="12" placeholder="收货人" class></el-input>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24" class="line40">
              <el-input v-model="phone" maxlength="11" placeholder="联系方式" class></el-input>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24" class="line40">
              <el-cascader
                style="width: 100%;"
                :options="options"
                v-model="addressArr"
                @change="handleChange"
              ></el-cascader>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24">
              <el-input
                style="width: 100%;"
                type="textarea"
                :rows="2"
                placeholder="请输入详细地址"
                v-model="detailAddress"
                maxlength="30"
              ></el-input>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPAddress = false">取消</el-button>
          <el-button type="danger" @click="submit">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import accountHead from "@/components/accountHead/accountHead";
import headertop from "@/components/mobile/header";
import {
  mt_getAddressList,
  mt_addAddress,
  mt_editAddress,
  mt_deleteAddress,
  mt_setDefaultAddress
} from "@/api/my";
import cityData from "../../../static/other/city.json";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "accountAddress",
  components: {
    headTop,
    footGuide,
    accountHead,
    headertop
  },
  data() {
    return {
      addressData: [], //地址数组
      styleObj: {
        "background-color": "#f5f5f5",
        padding: "10px 0",
        "font-size": "14px",
        color: "#666666",
        "text-align": "center"
      },
      cellStyle: {
        "background-color": "#ffffff",
        padding: "10px 0",
        "text-align": "center"
      },

      opType: "", //操作类型  1添加  2修改
      editId: "", //修改地址id
      title: "",
      dialogPAddress: false, //新增地址弹窗是否显示
      name: "",
      phone: "",
      address: "",
      detailAddress: "",
      options: [],
      addressArr: [],
      headValue: "地址管理",
      addressListState: false //地址弹窗显示
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  watch: {
    //监听图片变化
    eHeadImg(newValue, oldValue) {
      if (newValue != oldValue) {
        // //console.log(this.eHeadImg)
      }
    }
  },
  filters: {},
  created() {
    // 组装地址数据
    let arrCity = [];
    // //console.log(cityData)
    cityData.forEach((item, index) => {
      arrCity.push({ value: item.name, label: item.name, children: [] });
      item.citys.forEach((items, indexs) => {
        arrCity[index].children.push({
          value: items.name,
          label: items.name,
          children: []
        });
        items.citys.forEach((itemss, indexss) => {
          arrCity[index].children[indexs].children.push({
            value: itemss.name,
            label: itemss.name
          });
        });
      });
    });
    this.options = arrCity;
    this.getAddressList();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取地址
    getAddressList() {
      let that = this;
      mt_getAddressList().then(data => {
        // //console.log(data.data.data);
        let arr = [];
        if (data.data.data.length > 0) {
          data.data.data.forEach(item => {
            item.addressArr = item.address.split(",");
            item.addressV = item.addressArr.join("");
            if (item.isDefault == 1) {
              arr.unshift(item);
            } else {
              arr.push(item);
            }
          });
          that.addressData = arr;
        } else {
          that.addressData = [];
        }
      });
    },
    //添加地址
    add(e) {
      this.title = "新增收货地址";
      this.addressArr = [];
      this.dialogPAddress = true;
      this.opType = 1;
      this.name = "";
      this.phone = "";
      this.detailAddress = "";
    },
    //删除地址
    deleteA(value) {
      let that = this;
      //console.log(value)
      that
        .$confirm("此操作将永久删除该地址，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          mt_deleteAddress(value.id).then(data => {
            // //console.log(data);
            if (!that.mobileMode.result) {
              that.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
            }
            that.getAddressList();
          });
        })
        .catch(() => {});
    },
    //修改地址
    edit(value) {
      // //console.log(value);
      this.title = "编辑收货地址";
      this.editId = value.id;
      this.addressArr = [];
      this.dialogPAddress = true;
      this.opType = 2;
      this.name = value.consignee;
      this.phone = value.phone;
      this.isDefault = value.isDefault;

      this.addressArr.push(value.addressArr[0]);
      this.addressArr.push(value.addressArr[1]);
      this.addressArr.push(value.addressArr[2]);
      this.detailAddress = value.addressArr[3];
    },
    //设为默认
    setDefault(value) {
      let that = this;
      // //console.log(value);
      mt_editAddress(
        value.id,
        value.consignee,
        value.phone,
        value.addressArr[0] +
          "," +
          value.addressArr[1] +
          "," +
          value.addressArr[2] +
          "," +
          value.addressArr[3],
        1
      ).then(data => {
        // //console.log(data);
        that.$message({
          message: "设为默认成功",
          type: "success",
          duration: 1000
        });
        that.getAddressList();
      });
    },
    //确认添加或修改地址
    submit() {
      let that = this;
      let aa = /[,]/g;
      if (that.name == "" || aa.test(that.name)) {
        if (!that.mobileMode.result) {
          that.$message({
            message: "收货人输入错误",
            type: "warning",
            duration: 1000
          });
        } else {
          alert("收货人输入错误");
        }
      } else if (that.phone == "") {
        if (!that.mobileMode.result) {
          that.$message({
            message: "手机号不能为空",
            type: "warning",
            duration: 1000
          });
        } else {
          alert("手机号不能为空");
        }
      } else if (!regSJH.test(that.phone)) {
        if (!that.mobileMode.result) {
          that.$message({
            message: "手机号格式不正确",
            type: "warning",
            duration: 1000
          });
        } else {
          alert("手机号格式不正确");
        }
      } else if (that.addressArr.length == 0) {
        if (!that.mobileMode.result) {
          that.$message({
            message: "所在地区不能为空",
            type: "warning",
            duration: 1000
          });
        } else {
          alert("所在地区不能为空");
        }
      } else if (that.detailAddress == "" || aa.test(that.detailAddress)) {
        if (!that.mobileMode.result) {
          that.$message({
            message: "详细地址输入错误",
            type: "warning",
            duration: 1000
          });
        } else {
          alert("详细地址输入错误");
        }
      } else {
        let tip = "";
        if (that.opType == 1) {
          mt_addAddress(
            that.name,
            that.phone,
            that.addressArr[0] +
              "," +
              that.addressArr[1] +
              "," +
              that.addressArr[2] +
              "," +
              that.detailAddress
          ).then(data => {
            if (!that.mobileMode.result) {
              that.$message({
                message: "添加收货地址成功",
                type: "success",
                duration: 1000
              });
            }
            that.dialogPAddress = false;
            that.getAddressList();
          });
        } else if (that.opType == 2) {
          // id,phone,contacts,province,city,county,address
          mt_editAddress(
            that.editId,
            that.name,
            that.phone,
            that.addressArr[0] +
              "," +
              that.addressArr[1] +
              "," +
              that.addressArr[2] +
              "," +
              that.detailAddress,
            that.isDefault
          ).then(data => {
            if (!that.mobileMode.result) {
              that.$message({
                message: "修改收货地址成功",
                type: "success",
                duration: 1000
              });
            }
            that.dialogPAddress = false;
            that.getAddressList();
          });
        }
      }
    },
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.pc {
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
  .orderList {
    padding: 30px 0 80px 0;
    .box {
      .ownlist {
        display: flex;
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
          min-height: 700px;
          flex: 1;
          margin-left: 20px;
          padding: 30px 30px 0 30px;
          background-color: #ffffff;
          .tab {
            margin-bottom: 20px;
            font-size: 0;
            span {
              display: inline-block;
              line-height: 40px;
              margin-right: 20px;
              font-size: 14px;
              color: #999999;
              &.add {
                padding: 0 22px;
                background-color: #fff6ec;
                border: 1px solid $mainColor;
                &:hover {
                  cursor: pointer;
                  background-color: $mainColor;
                  color: #ffffff;
                }
              }
              &.tip {
                font-size: 12px;
                color: #999999;
                i {
                  font-style: normal;
                  color: #3573d8;
                }
              }
            }
          }
          .table {
            .paginationdiv {
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
  .infoList {
    .item {
      margin-bottom: 20px;
      .einp {
        width: 200px;
      }
      .name {
        line-height: 40px;
        padding-right: 20px;
        font-size: 14px;
        color: #333333;
        text-align: right;
        i {
          font-style: normal;
          font-weight: bold;
          color: #e1481f;
          margin-right: 5px;
          position: relative;
          top: 3px;
        }
      }
      .line40 {
        line-height: 40px;
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .mobile{
    background-color: #f7f7f7;
    .noContent {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
  .addressListBox {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: #fff;
    .address {
      .nbox .nzxItm {
        background-color: #ffffff;
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px 0;
        display: flex;
        box-shadow: #ddd 0 0 5px;
      }
      .nbox .nzxItm:last-child {
        margin-bottom: 0;
      }
      .nbox .nzxItm .ninfo {
        flex: 1;
        padding-left: 10px;
      }
      .nbox .nzxItm .ninfo .top {
        height: 20px;
        line-height: 20px;
        overflow: hidden;
      }
      .nbox .nzxItm .ninfo .top span {
        float: left;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: bold;
      }
      .nbox .nzxItm .ninfo .top img {
        float: left;
        width: 6px;
        height: 10px;
        margin-left: 5px;
        position: relative;
        top: 5px;
      }
      .nbox .nzxItm .ninfo .middle {
        overflow: hidden;
        margin-bottom: 5px;
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        color: #666;
      }

      .nbox .nzxItm .nbtn {
        flex: 0 80px 0;
        width: 80px;
        padding-top: 12px;
        font-size: 0;
      }
      .nbox .nzxItm .nbtn span {
        display: inline-block;
        margin: 0 5px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        border-radius: 50%;
        text-align: center;
      }
      .nbox .nzxItm .nbtn span.y {
        background-color: #ffd200;
        color: #333;
      }
      .nbox .nzxItm .nbtn span.b {
        background-color: #00bcf4;
        color: #fff;
      }

      .submit {
        padding: 15px;
      }
      .submit div {
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin: 0 auto;
        text-align: center;
        font-size: 14px;
        color: #ffffff;
        background-color: #00bcf4;
        border-radius: 5px;
      }
      .nodata {
        padding: 5px 15px;
        font-size: 13px;
        text-align: center;
        color: #333333;
      }
    }
    /deep/ .el-input__inner,
    /deep/ .el-cascader-menu__item {
      font-size: 10px;
    }
  }
  .infoList {
    .item {
      margin-bottom: 20px;
      .einp {
        width: 200px;
      }
      .name {
        line-height: 40px;
        padding-right: 10px;
        font-size: 10px;
        color: #333333;
        text-align: right;
        i {
          font-style: normal;
          font-weight: bold;
          color: #e1481f;
          margin-right: 2px;
          position: relative;
          top: 3px;
        }
      }
      .line40 {
        line-height: 40px;
        /deep/ .el-input__inner {
          width: 100%;
          font-size: 10px;
        }
      }
    }
  }
}
</style>

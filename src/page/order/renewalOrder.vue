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
          <router-link tag="span" to="/orderList" class="nav">订单中心</router-link>
          <span class="nav active">续租</span>
        </div>
      </div>
    </div>
    <div class="lease">
      <div class="container box">
        <div class="item">
          <span class="n">订单编号</span>
          <span class="v">{{detail.orderNum}}</span>
        </div>
        <div class="item">
          <span class="n">租赁日期</span>
          <span class="v">{{detail.createTime | filterTime}}</span>
        </div>
        <div class="item">
          <span class="n">租赁公司</span>
          <span class="v">{{userInfo.companyName}}</span>
        </div>
        <div class="item">
          <span class="n">到期日期</span>
          <span class="v">{{detail.endTime}}</span>
        </div>
      </div>
    </div>
    <div class="orderlist">
      <div class="container box">
        <div class="tip">信安租赁续租</div>
        <div class="goods" v-if="goods.length>0">
          <el-row class="itm title">
            <!-- <el-col :span="2" class="sel">
              <el-checkbox v-model="checkedAll" @change="checkAll">全选</el-checkbox>
            </el-col>-->
            <el-col :span="9">商品名称</el-col>
            <el-col :span="5">类型和尺寸</el-col>
            <el-col :span="2">价格</el-col>
            <el-col :span="4" class="number">数量</el-col>
            <el-col :span="4" class="number">租期</el-col>
          </el-row>
          <el-row class="itm" v-if="goods.length>0" v-for="(item,index) in goods" :key="index">
            <!-- <el-col :span="2" class="sel">
              <el-checkbox v-model="item.selected" :data-num="index" @change="checkgood"></el-checkbox>
            </el-col>-->
            <el-col :span="9" class="gd">
              <div class="img">
                <img :src="item.goodsImg" alt />
              </div>
              <div class="info">
                <div class="name ellipsis" :title="item.goodsName">{{item.goodsName}}</div>
                <div class="des ellipsis3" :title="item.proIntroduction">{{item.proIntroduction}}</div>
              </div>
            </el-col>
            <el-col :span="5" class="type ellipsis4">{{item.dispose}}</el-col>
            <el-col :span="2" class="price">
              <div>￥{{item.rent}}</div>
              <div>￥{{item.deposit}}</div>
            </el-col>
            <el-col :span="4" class="number">
              <el-input-number
                v-model="item.goodsNumber"
                @change="changeNum(index,item)"
                size="mini"
                :min="1"
                :step="1"
                step-strictly
                label="数量"
              ></el-input-number>
            </el-col>
            <el-col :span="4" class="number">
              <el-select
                size="mini"
                v-model="item.goodsCycle"
                placeholder="请选择"
                @change="changeLeaseTerm(index,item)"
              >
                <el-option
                  v-for="(item,index) of item.leaseTermOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <!-- <el-col :span="2" class="delete">
              <i class="el-icon-delete" title="点击删除" @click="deleteGood(index, item)"></i>
            </el-col>-->
          </el-row>
        </div>

        <div class="oinfo">
          <div class="otitle">
            收货人信息
            <span v-if="!moreAddress&&addressList.length>1" @click="moreAddress=true">&nbsp;更多</span>
            <span v-if="moreAddress" @click="moreAddress=false">&nbsp;隐藏</span>
            <span class="fr" title="点击新增收货地址" @click="add">新增收货地址</span>
          </div>
          <div
            class="val receive"
            v-for="(item,index) of addressList"
            :key="index"
            v-if="addressList.length>0 && index<1"
          >
            <span
              class="select"
              :class="selectedAddress.id==item.id?'active':''"
              @click="selectAddress(item)"
              title="选择该地址"
            >{{item.consignee}}</span>
            <span class="name">{{item.consignee}}</span>
            <span class="address">{{item.addressV}}</span>
            <span class="phone">{{item.phone | filterPhone}}</span>
            <span class="edit fr" @click="edit(item)">编辑</span>
            <span class="setDefault fr" v-if="item.isDefault==0" @click="setDefault(item)">设为默认</span>
          </div>
          <div
            class="val receive"
            v-for="(item,index) of addressList"
            :key="index"
            v-if="addressList.length>0 && moreAddress && index>=1"
          >
            <span
              class="select"
              :class="selectedAddress.id==item.id?'active':''"
              @click="selectAddress(item)"
              title="选择该地址"
            >{{item.consignee}}</span>
            <span class="name">{{item.consignee}}</span>
            <span class="address">{{item.addressV}}</span>
            <span class="phone">{{item.phone | filterPhone}}</span>
            <span class="edit fr" @click="edit(item)">编辑</span>
            <span class="setDefault fr" v-if="item.isDefault==0" @click="setDefault(item)">设为默认</span>
          </div>
          <div class="noaddress" v-if="addressList.length == 0">暂无收货地址，请先新增收货地址</div>
        </div>

        <div class="opt" v-if="goods.length>0">
          <el-col :span="2" class="sel">
            &nbsp;
            <!-- <el-checkbox v-model="checkedAll" @change="checkAll">全选</el-checkbox> -->
          </el-col>
          <el-col :span="14" class="delAll">
            &nbsp;
            <!-- <span>删除选中的商品</span> -->
          </el-col>
          <el-col :span="6" class="totalInfo">
            <span class="num">
              已选中
              <i>{{selectedNum}}</i>件商品
            </span>
            <span class="totalPrice">
              总价：
              <i>￥{{totalPrice}}</i>
            </span>
          </el-col>
          <el-col :span="2" class="settle">
            <span @click="subOrder">去结算</span>
          </el-col>
        </div>
      </div>
    </div>
    <foot-guide></foot-guide>
    <!-- 地址管理弹窗 -->
    <el-dialog
      title="地址管理"
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
              placeholder="请输入内容"
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
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import cityData from "../../../static/other/city.json";
import { mt_queryReletOrderGoods, mt_renewalOrder } from "@/api/order";
import {
  mt_getAddressList,
  mt_addAddress,
  mt_editAddress,
  mt_setDefaultAddress
} from "@/api/my";
import { formatDate, accMul } from "@/config/often";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "renewalOrder",
  components: {
    headTop,
    footGuide
  },
  data() {
    return {
      orderId: "",
      detail: {},
      goods: [],

      selectedAddress: {}, //选择的地址
      addressList: [],
      moreAddress: false,
      dialogPAddress: false, //新增地址弹窗是否显示
      opType: "", //操作类型  1添加  2修改
      editId: "", //修改地址id
      name: "",
      phone: "",
      address: "",
      detailAddress: "",
      isDefault: false, //是否默认
      options: [],
      addressArr: [], //地址数组

      checkedAll: false,
      selectedNum: 0,
      totalPrice: 0
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
  filters: {
    filterTime(val) {
      return formatDate(val, "yyyy-MM-dd hh:mm");
    }
  },
  created() {
    // 组装地址数据
    let arrCity = [];
    // console.log(cityData)
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

    this.orderId = this.$route.params.id;
    this.getOrderDetail(this.orderId);
    this.getAddressList();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取地址
    getAddressList() {
      let that = this;
      mt_getAddressList().then(data => {
        // console.log(data.data.data);
        let arr = [];
        if (data.data.data.length > 0) {
          data.data.data.forEach(item => {
            item.addressArr = item.address.split(",");
            item.addressV = item.addressArr.join("");
            if (item.isDefault == 1) {
              arr.unshift(item);
              if (
                that.selectedAddress.phone == "" ||
                that.selectedAddress.phone == undefined
              ) {
                that.selectedAddress = item;
              }
            } else {
              arr.push(item);
            }
            if (that.selectedAddress.id == item.id) {
              that.selectedAddress = item;
            }
          });
          that.addressList = arr;
          if (
            that.selectedAddress.phone == "" ||
            that.selectedAddress.phone == undefined
          ) {
            that.selectedAddress = arr[0];
          }
        } else {
          that.addressList = [];
        }
      });
    },
    //选中地址
    selectAddress(val) {
      if (val.id != this.selectedAddress.id) {
        this.selectedAddress = val;
      }
    },
    //添加地址
    add(e) {
      this.addressArr = [];
      this.dialogPAddress = true;
      this.opType = 1;
      this.name = "";
      this.phone = "";
      this.detailAddress = "";
    },
    //修改地址
    edit(value) {
      console.log(value);
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
      console.log(value);
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
        console.log(data);
        that.$message({
          message: "设为默认成功",
          type: "success",
          duration: 1000
        });
        that.getAddressList();
      });
    },
    //当地址选择变化
    handleChange(value) {
      console.log(value);
      this.addressArr = value;
      // console.log(this.addressArr);
    },
    //确认添加或修改地址
    submit() {
      let that = this;
      let aa = /[,]/g;
      if (that.name == "" || aa.test(that.name)) {
        that.$message({
          message: "收货人输入错误",
          type: "warning",
          duration: 1000
        });
      } else if (that.phone == "") {
        that.$message({
          message: "手机号不能为空",
          type: "warning",
          duration: 1000
        });
      } else if (!regSJH.test(that.phone)) {
        that.$message({
          message: "手机号格式不正确",
          type: "warning",
          duration: 1000
        });
      } else if (that.addressArr.length == 0) {
        that.$message({
          message: "所在地区不能为空",
          type: "warning",
          duration: 1000
        });
      } else if (that.detailAddress == "" || aa.test(that.detailAddress)) {
        that.$message({
          message: "详细地址输入错误",
          type: "warning",
          duration: 1000
        });
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
            that.$message({
              message: "添加收货地址成功",
              type: "success",
              duration: 1000
            });
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
            that.$message({
              message: "修改收货地址成功",
              type: "success",
              duration: 1000
            });
            that.dialogPAddress = false;
            that.getAddressList();
          });
        }
      }
    },
    //获取我的订单
    getOrderDetail(id) {
      let that = this;
      mt_queryReletOrderGoods(id).then(data => {
        console.log(data.data);
        data.data.goods.forEach(item => {
          item.selected = true;
          item.leaseTermOptions = [];
          item.goodsCycle = Number(item.goodsCycle);
          JSON.parse(item.leaseTerm).forEach((items, indexs) => {
            item.leaseTermOptions.push({
              value: Number(items.value),
              label:
                Number(items.value) + "个月，打" + accMul(items.per, 10) + "折",
              per: items.per
            });
          });
        });
        that.goods = data.data.goods;
        that.detail = data.data.detail;
        that.computedPrice();
      });
    },

    //租期选择
    changeLeaseTerm(index, item) {
      this.goods[index].selected = true;
      this.computedPrice();
    },
    //数量加减
    changeNum(index, item) {
      this.goods[index].selected = true;
      this.computedPrice();
    },
    //计算价格
    computedPrice() {
      this.selectedNum = 0;
      this.totalPrice = 0;
      this.goods.forEach((item, index) => {
        if (item.selected) {
          this.selectedNum += 1;
          let per = 0;
          item.leaseTermOptions.forEach(items => {
            if (items.value == item.goodsCycle) {
              per = items.per;
            }
          });
          this.totalPrice +=
            accMul(item.goodsNumber * item.deposit, per) +
            accMul(item.rent * item.goodsNumber * item.goodsCycle, per);
        }
      });
      if (this.selectedNum == this.goods.length) {
        this.checkedAll = true;
      } else {
        this.checkedAll = false;
      }
    },
    //提交订单
    subOrder() {
      let that = this,
        state = true,
        title = "";
      console.log(this.goods);
      console.log(this.detail);
      let arr = [];
      that.goods.forEach(item => {
        let d = {
          goodsId: item.goodsId,
          goodsCycle: item.goodsCycle,
          goodsNumber: item.goodsNumber,
          courierWay: 1,
          courierMoney: 0,
          remark: "",
          deposit: item.deposit,
          rent: item.rent,
          dispose: item.dispose,
          per: item.per
        };
        arr.push(d);
      });
      let leaseOrderGoodsInfo = JSON.stringify(arr);
      console.log(that.selectedAddress);
      mt_renewalOrder(
        that.orderId,
        that.detail.addressId,
        leaseOrderGoodsInfo,
        that.detail.invoiceId != null ? that.detail.invoiceId : "",
        that.detail.invitationCode,
        that.detail.companyName != null ? that.detail.companyName : ""
      ).then(data => {
        console.log(data.data);
        that.$router.push("/pay/" + data.data);
      });
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.lease {
  padding: 20px 0 0 0;
  .box {
    display: flex;
    border: 1px solid #c4c4c4;
    .item {
      flex: 1;
      width: 25%;
      display: flex;
      line-height: 40px;
      .n {
        flex: 100px;
        width: 100px;
        padding-left: 20px;
        font-size: 14px;
        background-color: rgb(221, 221, 221);
      }
      .v {
        width: 60%;
        padding-left: 15px;
        font-size: 14px;
        background-color: #ffffff;
      }
    }
  }
}
.orderlist {
  padding: 20px 0 50px 0;
  .box {
    border: 1px solid #dddddd;
    .nogoods {
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
    .tip {
      font-size: 16px;
      color: #333333;
      font-weight: bold;
      padding: 20px 20px 0 20px;
      background-color: #ffffff;
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
            padding: 0 20px 0 20px;
            .des,
            .name {
              font-size: 13px;
              line-height: 20px;
              color: #666666;
              &:hover {
                cursor: pointer;
                color: $mainColor;
              }
            }
            .name {
              color: #333333;
            }
          }
        }
        .type {
          padding-right: 50px;
          font-size: 14px;
          line-height: 20px;
          color: #666666;
        }
        .price {
          font-size: 14px;
          line-height: 20px;
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
    .oinfo {
      padding: 15px;
      background-color: #ffffff;
      .noaddress {
        font-size: 14px;
        line-height: 14px;
        color: $mainColor;
      }
      .otitle {
        font-size: 14px;
        line-height: 14px;
        color: #333333;
        margin-bottom: 20px;
        span {
          font-size: 14px;
          color: #3573d8;
          &:hover {
            cursor: pointer;
            color: $mainColor;
          }
        }
      }
      .receive {
        margin-top: 10px;
        font-size: 0;
        padding-right: 60px;
        span {
          display: inline-block;
          font-size: 14px;
          line-height: 34px;
          color: #666666;
        }
        .select {
          margin-right: 32px;
          padding: 0 25px;
          line-height: 30px;
          border: 2px solid #dddddd;
          &.active,
          &:hover {
            cursor: pointer;
            border: 2px solid $mainColor;
            background-color: #ffffff;
          }
          &.active {
            background: url(/static/icon/selected.png) no-repeat right bottom;
          }
        }
        .name {
          margin-right: 30px;
        }
        .address {
          margin-right: 30px;
        }
        .edit,
        .setDefault {
          display: none;
          margin-left: 20px;
          &:hover {
            cursor: pointer;
            color: $mainColor;
          }
        }
        &:hover {
          background-color: #f7f7f7;
          .select {
            background-color: #ffffff;
          }
          .edit,
          .setDefault {
            display: block;
          }
        }
      }
      .way {
        span {
          display: inline-block;
          padding: 0 25px;
          line-height: 30px;
          font-size: 14px;
          color: #666666;
          border: 2px solid #dddddd;
          &.active {
            border: 2px solid $mainColor;
            background: url(/static/icon/selected.png) no-repeat right bottom;
          }
        }
      }
    }
    .opt {
      height: 70px;
      padding: 15px 20px;
      background-color: #ffffff;
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
</style>

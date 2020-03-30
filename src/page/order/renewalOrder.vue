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
              <el-col :span="4" class="number">租期(月)</el-col>
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
              <el-col :span="5" class="type ellipsis4">{{item.dispose.config}}</el-col>
              <el-col :span="2" class="price">
                <div>租金：￥{{item.rent}}</div>
                <div>押金：￥{{item.deposit}}</div>
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
                    v-for="item of item.leaseTermOptions"
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
              <span
                v-if="!moreAddress&&addressList.length>1"
                @click="moreAddress=true"
              >&nbsp;更多</span>
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
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="addressBox" @click="addressListToggle" v-if="selectedAddress.consignee">
        <div class="top">
          <div class="name">{{selectedAddress.consignee}}</div>
          <div class="phone">{{selectedAddress.phones}}</div>
        </div>
        <div class="bottom">{{selectedAddress.addressV}}</div>
      </div>
      <div class="addressBox" @click="addressListToggle" v-else>
        <div class="nodata">请选择地址</div>
      </div>
      <div class="addressListBox" v-if="addressListState">
        <header>
          <span class="back" @click="addressListToggle" style></span>我的地址
        </header>
        <div class="address">
          <div class="nbox">
            <div
              class="nzxItm"
              v-for="(item,index) of addressList"
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
            <div class="nodata" v-if="addressList.length==0">
              <span>暂无收货地址</span>
            </div>
          </div>
          <div class="submit" @click="add">
            <div>新增收货地址</div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="oInfo">
          <div class="n">
            订单编号：
            <span>{{detail.orderNum }}</span>
            <span
              style="color:#f08200;margin-left:8rpx;"
              v-clipboard:copy="detail.orderNum"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >复制</span>
          </div>
          <div class="n">
            租赁日期：
            <span>{{detail.createTime | filterTime}}</span>
          </div>
          <div class="n">
            租赁公司：
            <span>{{userInfo.companyName}}</span>
          </div>
          <div class="n">
            到期时间：
            <span>{{detail.endTime}}</span>
          </div>
        </div>
        <div class="item" v-for="(item,index) of goods" :key="index">
          <div class="img">
            <img :src="item.goodsImg" />
          </div>
          <div class="info">
            <div class="des ellipsis2">{{item.goodsName}}</div>
            <div class="size ellipsis">{{item.dispose.config}}</div>
            <div class="ss ellipsis">
              <el-input-number
                v-model="item.goodsNumber"
                @change="changeNum(index,item)"
                size="mini"
                :min="1"
                :step="1"
                step-strictly
                label="数量"
              ></el-input-number>
            <!-- 数量：{{item.goodsNumber}}，租期{{item.goodsCycle}}个月，{{item.dispose.config}} -->
            </div>
            <div class="ss ellipsis">
              <el-select
                  size="mini"
                  v-model="item.goodsCycle"
                  placeholder="请选择"
                  @change="changeLeaseTerm(index,item)"
                >
                  <el-option
                    v-for="item of item.leaseTermOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
            <!-- 数量：{{item.goodsNumber}}，租期{{item.goodsCycle}}个月，{{item.dispose}} -->
            </div>
            <div class="price">
              ￥
              <span>{{item.rent}}</span>
              <span class="deposit">押金{{item.deposit}}/1台</span>
            </div>
          </div>
        </div>
        <div class="priceInfo">
          <div class="itm">
            <div class="n b">实付金额</div>
            <div class="v">￥{{totalPrice}}</div>
          </div>
          <div class="sub">
            <div class="btn" @click="subOrder">提交订单</div>
          </div>
        </div>
        
      </div>

      <!-- 地址管理弹窗 -->
      <el-dialog
        title="地址管理"
        :visible.sync="dialogPAddress"
        :fullscreen="true"
        :close-on-click-modal="false">
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
import cityData from "../../../static/other/city.json";
import headertop from "@/components/mobile/header";
import { mt_queryReletOrderGoods, mt_renewalOrder } from "@/api/order";
import {
  mt_getAddressList,
  mt_addAddress,
  mt_editAddress,
  mt_setDefaultAddress,
  mt_deleteAddress
} from "@/api/my";
import { formatDate, accMul, compare } from "@/config/often";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "renewalOrder",
  components: {
    headTop,
    footGuide,
    headertop
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
      totalPrice: 0,
      headValue: '续租',
      addressListState: false //地址弹窗显示
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  watch: {
    //数量
    num(newVal, oldVal) {
      ////console.log(newVal);
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
    // ////console.log(cityData)
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
    //显示地址列表
    addressListToggle() {
      this.addressListState = !this.addressListState;
    },
    //选中
    selectedAddressValue(value) {
      ////console.log(value);
      this.selectedAddress = value;
      this.addressListState = false;
    },
    //获取地址
    getAddressList() {
      let that = this;
      mt_getAddressList().then(data => {
        // ////console.log(data.data.data);
        let arr = [];
        if (data.data.data.length > 0) {
          data.data.data.forEach(item => {
            item.addressArr = item.address.split(",");
            item.addressV = item.addressArr.join("");
            item.phones = item.phone.substr(0, 3) + "****" + item.phone.substr(7);
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
    //删除地址
    deleteA(value) {
      let that = this;
      ////console.log(value)
      that
        .$confirm("此操作将永久删除该地址，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          mt_deleteAddress(value.id).then(data => {
            // ////console.log(data);
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
      ////console.log(value);
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
      ////console.log(value);
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
        ////console.log(data);
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
      ////console.log(value);
      this.addressArr = value;
      // ////console.log(this.addressArr);
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
    //获取我的订单
    getOrderDetail(id) {
      let that = this;
      mt_queryReletOrderGoods(id).then(data => {
        ////console.log(data.data);
        data.data.goods.forEach(item => {
          item.selected = true;
          item.goodsCycle = Number(item.goodsCycle);
          item.dispose = JSON.parse(item.dispose);
          let leaseTermOptions = [];
          // ////console.log(this.collocation)
          item.dispose.value.forEach((item, index) => {
            leaseTermOptions.push({
              value: item.term,
              label: item.term + "个月",
              rentMoney: item.rentMoney,
              depositMoney: item.depositMoney
            });
          });
          leaseTermOptions.sort(compare("value"));
          item.leaseTermOptions = leaseTermOptions;
        });

        that.goods = data.data.goods;

        // that.goods.forEach((item, index) => {
        //   item.leaseTermOptions.forEach(items => {
        //     if (items.value == item.goodsCycle) {
        //       item.selectedGoodsCycle = items
        //     }
        //   });
        // });
        that.detail = data.data.detail;
        that.computedPrice();
      });
    },

    //租期选择
    changeLeaseTerm(index, value) {
      this.goods[index].selected = true;
      // ////console.log(this.goods)
      value.leaseTermOptions.forEach(item => {
        if (item.value == value.goodsCycle) {
          this.goods[index].rent = item.rentMoney;
          this.goods[index].deposit = item.depositMoney;
        }
      });
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
          this.totalPrice +=
            item.goodsNumber * item.deposit +
            item.rent * item.goodsNumber * item.goodsCycle;
        }
      });
      ////console.log(this.totalPrice)
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
      ////console.log(this.goods);
      ////console.log(this.detail);
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
          dispose: item.dispose.config,
          per: item.per
        };
        arr.push(d);
      });
      let leaseOrderGoodsInfo = JSON.stringify(arr);
      ////console.log(that.selectedAddress);
      mt_renewalOrder(
        that.orderId,
        that.detail.addressId,
        leaseOrderGoodsInfo,
        that.detail.invoiceId != null ? that.detail.invoiceId : "",
        that.detail.invitationCode,
        that.detail.companyName != null ? that.detail.companyName : ""
      ).then(data => {
        ////console.log(data.data);
        that.$router.push("/pay/" + data.data);
      });
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.pc {
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
}
@media screen and (max-width: 769px) {
  .mobile{
    background-color: #f7f7f7;
    .addressBox {
      width: 100%;
      padding: 12px 10px;
      background-color: #ffffff;
      border-bottom: 1px dashed #dddddd;
      .nodata {
        line-height: 49px;
        text-align: center;
      }
      .top {
        display: flex;
        line-height: 24px;
        font-size: 16px;
        font-weight: bold;
        color: #333333;
      }
      .top .name {
        margin-right: 10px;
      }
      .bottom {
        font-size: 12px;
        line-height: 20px;
        color: #666666;
      }
    }

  }
  .addressListBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: #fff;
    header {
      height: 44px;
      line-height: 44px;
      padding: 0 15px;
      font-size: 16px;
      color: #333333;
      text-align: center;
      position: relative;
      border-bottom: 1px solid #dddddd;
      span {
        position: absolute;
        left: 0;
        top: 0;
        width: 44px;
        height: 44px;
        background: url(/static/icon_m/jt_left.png) no-repeat center center;
        background-size: 24px 24px;
      }
    }
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

  .main .item {
      margin-top: 10px;
      padding: 10px 15px;
      display: flex;
      justify-content: flex-start;
      background-color: #ffffff;
      border-bottom: 1px solid #f1f1f1;
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
      min-height: 94px;
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
      line-height: 10px;
      font-size: 10px;
      color: #666666;
    }
    .main .item .info .ss {
      margin-top: 5px;
      line-height: 20px;
      font-size: 10px;
      color: #666666;
      /deep/ .el-input__inner{
        width: 130px !important;
      }
    }
    .main .item .info .price {
      width: 100%;
      height: 20px;
      line-height: 20px;
      margin-top: 5px;
      font-size: 8px;
      color: #f63f45;
    }
    .main .item .info .price .deposit {
      display: inline-block;
      line-height: 20px;
      margin-left: 10px;
      font-size: 10px;
      font-weight: normal;
      color: #666666;
    }
    .main .item .info .price text {
      font-size: 15px;
      font-weight: bold;
    }
    .main .item .info .price .num {
      float: right;
      padding-right: 10px;
      font-size: 13px;
      font-weight: normal;
      color: #959595;
    }

    .main .item .price .opNum {
      float: right;
      margin-right: 10px;
      display: flex;
      justify-content: flex-start;
      width: 100px;
      height: 23px;
      line-height: 23px;
      border: 1px solid #eeeeee;
      border-radius: 2px;
      text-align: center;
    }
    .main .item .price .opNum .wj {
      width: 30px;
      font-size: 23px;
      position: relative;
      top: -2px;
    }
    .main .item .price .opNum .reduce,
    .main .item .price .opNum .add {
      color: #959595;
    }
    .main .item .price .opNum .reduce.true,
    .main .item .price .opNum .add.true {
      color: #188dec;
    }
    .main .item .price .opNum .num {
      flex: 1;
      border-left: 1px solid #eeeeee;
      border-right: 1px solid #eeeeee;
      font-size: 13px;
      font-weight: bold;
      color: #2e2e2e;
    }
    .oInfo {
      padding: 10px 15px;
      background-color: #ffffff;
      margin-bottom: 10px;
    }
    .oInfo .n {
      line-height: 20px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #333333;
    }
    .oInfo .n span {
      color: #999999;
    }
    .oInfo .n .btn {
      float: right;
    }
    .oInfo .v .input {
      width: 100%;
      height: 40px;
      line-height: 15px;
      padding: 5px;
      border: 1px solid #dddddd;
      color: #666666;
    }
    .oInfo .v .input1 {
      width: 60%;
      height: 30px;
      line-height: 30px;
      padding: 0 5px;
      border: 1px solid #dddddd;
      color: #666666;
    }
    .oInfo .v .tx {
      margin-right: 10px;
      font-size: 13px;
      line-height: 20px;
      color: #999999;
    }
    .oInfo .v .radio {
      line-height: 20px;
      color: #1197d3;
      font-size: 12px;
    }

    .priceInfo {
      padding: 10px 15px;
      background-color: #ffffff;
    }
    .priceInfo .itm {
      display: flex;
      line-height: 21px;
    }
    .priceInfo .itm .n {
      flex: 1;
      color: #333333;
    }
    .priceInfo .itm .n.b {
      font-weight: bold;
    }
    .priceInfo .itm .v {
      color: #e93b3d;
    }
    .priceInfo .sub {
      margin-top: 15px;
    }
    .priceInfo .sub .btn {
      height: 46px;
      line-height: 46px;
      text-align: center;
      border-radius: 4px;
      font-size: 18px;
      color: #ffffff;
      background-color: #3884ff;
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

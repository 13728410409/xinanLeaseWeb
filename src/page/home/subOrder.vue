<template>
  <div>
    <head-top></head-top>
    <div class="hometop2">
      <div class="container box">
        <router-link tag="div" to="/" class="img" title="信安首页">
          <img src="/static/icon/logo_black.png" alt />
        </router-link>
        <div class="searchBox">
          <search></search>
        </div>
        <div class="shoppingcartBox">
          <shoppingcart></shoppingcart>
        </div>
      </div>
    </div>
    <div class="shoppingcartlist" v-if="!noData">
      <div class="container box">
        <div class="ot">填写并核对订单信息</div>
        <div class="goodsDetail">
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
          <div class="oinfo">
            <div class="otitle">支付方式</div>
            <div class="val way">
              <span class="active">在线支付</span>
            </div>
          </div>
          <div>
            <el-row class="itm title">
              <el-col :span="9">&nbsp;&nbsp;&nbsp;&nbsp;商品名称</el-col>
              <el-col :span="5">类型和尺寸</el-col>
              <el-col :span="3" class="number">价格</el-col>
              <el-col :span="3" class="number">租期</el-col>
              <el-col :span="4" class="number">数量</el-col>
            </el-row>
            <el-row class="itm" v-for="(item,index) in cartList" :key="index">
              <el-col :span="9" class="gd">
                <div class="img">
                  <img :src="item.img" alt />
                </div>
                <div class="info">
                  <div class="des">{{item.des}}</div>
                  <div class="sign">{{item.sign}}</div>
                </div>
              </el-col>
              <el-col :span="5" class="type">{{item.collocation.val}}</el-col>
              <el-col :span="3" class="number price" style="text-align: left;padding-left: 10px;">
                <div
                  style="color: #e1481f;"
                >租金：￥{{item.collocation.rent * item.per }}</div>
                <div
                  style="color: #e1481f;"
                >押金：￥{{item.collocation.deposit}}</div>
              </el-col>
              <el-col :span="3" class="number">
                <div style="color: #e1481f;">租期：{{item.leaseTerm}}个月</div>
              </el-col>
              <el-col :span="4" class="number">
                <el-input-number
                  v-model="item.num"
                  @change="changeNum(index,item)"
                  size="mini"
                  :min="1"
                  :step="1"
                  step-strictly
                  label="数量"
                ></el-input-number>
              </el-col>
              <!-- <el-col :span="2" class="delete">
                <i class="el-icon-delete"></i>
              </el-col> -->
              
            </el-row>
            <el-row class="itm"> 
              <el-col :span="24" class="leaveMsg">
                <el-col :span="12" class="inp">
                  <span>给平台留言：</span>
                  <el-input
                    type="textarea"
                    v-model="leaveMsg"
                    :rows="2"
                    placeholder="给平台留言"
                    class="textarea"
                  ></el-input>
                </el-col>
                <el-col :span="5" class="type">配送方式：快递</el-col>
                <el-col :span="2" class="price">￥{{freight}}</el-col>
              </el-col>
            </el-row>
          </div>
          <div class="oinfo" style="padding-top:30px;">
            <div class="otitle">发票信息</div>
            <div class="val invoice" v-if="invoice.taxNum!=''&&invoice.taxNum!=undefined">
              <span>类型：{{invoice.type | filterInvoiceType}}</span>
              <span>名称：{{invoice.name}}</span>
              <span>税号：{{invoice.taxNum}}</span>
              <span>地址：{{invoice.address}}</span>
              <span class="op edit" @click="editInvoice" title="点击编辑发票信息">编辑发票信息</span>
            </div>
            <div class="val invoice" v-else>
              <span>暂未添加发票信息</span>
              <span class="op add" @click="addInvoice" title="点击添加发票信息">添加发票信息</span>
            </div>
          </div>
          <div class="oinfo" style="padding-top:30px;">
            <div class="otitle">租赁协议</div>
            <div class="val lease">
              <div class="l" @click="viewLease">
                <el-radio-group v-model="radio">
                  <el-radio :label="1">默认选择接受《信安租赁协议》</el-radio>
                </el-radio-group>
              </div>
              <div class="code">
                <span>邀请码：</span>
                <el-input class="inp" v-model="invitationCode" placeholder="请输入邀请人的手机号"></el-input>
              </div>
            </div>
          </div>
          <div class="priceInfo">
            <div class="p">
              <span>商品租金：￥{{rent }}</span>
              <span>商品押金：￥{{deposit }}</span>
              <span>运费：￥{{freight}}</span>
            </div>
            <div class="ai">
              <div class="a" v-if="selectedAddress.addressV">确认地址：{{selectedAddress.addressV}}</div>
              <div class="a" v-else>确认地址：暂无</div>
              <div
                class="a"
                v-if="selectedAddress.phone"
              >收货人：{{selectedAddress.consignee}}&nbsp;&nbsp;&nbsp;&nbsp;{{selectedAddress.phone | filterPhone}}</div>
              <div class="a" v-else>收货人：暂无</div>
            </div>
            <div class="sbtn">
              <span class="v">
                总计：
                <i>￥{{totalPrice}}</i>
              </span>
              <span class="subOrder" @click="subOrder">提交订单</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <error v-else></error>

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

    <!-- 发票信息 -->
    <el-dialog
      title="发票信息"
      :visible.sync="dialogInvoice"
      width="1000px"
      :close-on-click-modal="false"
    >
      <div class="infoList">
        <el-row class="item">
          <el-col :span="3" class="name">
            <i>*</i>发票类型
          </el-col>
          <el-col :span="8" class="line40">
            <el-select v-model="invoicetype" placeholder="请选择">
              <el-option
                v-for="item in invoiceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="name">
            <i>*</i>公司名称
          </el-col>
          <el-col :span="8" class="line40">
            <el-input v-model="invoicename" placeholder="名称"></el-input>
          </el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="3" class="name">
            <i>*</i>公司税号
          </el-col>
          <el-col :span="8" class="line40">
            <el-input v-model="invoicetaxNum" placeholder="税号"></el-input>
          </el-col>
          <el-col :span="3" class="name">
            <i>*</i>公司地址
          </el-col>
          <el-col :span="8" class="line40">
            <el-input v-model="invoiceaddress" placeholder="填写寄送地址"></el-input>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInvoice = false">取消</el-button>
        <el-button type="danger" @click="submitInvoice">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="信安IT租赁协议"
      :visible.sync="centerDialogVisible"
      width="60%"
      class="leaseAggrement"
      center
    >
      <el-row>
        <el-col :span="12">甲方</el-col>
        <el-col :span="12">乙方</el-col>
      </el-row>
      <el-row>
        <div class="title">正文</div>
        <div class="cont">正文内容</div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import search from "@/components/search/search";
import shoppingcart from "@/components/shopping/shoppingcart";
import error from "@/components/error/error";
import cityData from "../../../static/other/city.json";
import { mt_selectAllcart, mt_insertcart, mt_deletecart, mt_getUserPostage } from "@/api/common";
import {
  mt_getAddressList,
  mt_addAddress,
  mt_editAddress,
  mt_setDefaultAddress
} from "@/api/my";
import { mt_createOrder } from "@/api/order";
import { mt_invoice, mt_getinvoice } from "@/api/home";
import { formatNum, accMul } from "@/config/often";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "subOrder",
  components: {
    headTop,
    footGuide,
    search,
    shoppingcart,
    error
  },
  data() {
    return {
      noData: false,
      addressList: [],
      moreAddress: false,
      cartList: [], //商品信息
      selectedAddress: {}, //选择的地址
      way: 1, //在线支付
      invoice: {}, //发票信息
      leaveMsg: '',
      radio: 1, //租赁协议
      invitationCode: "", //邀请码
      companyName: "",

      totalPrice: 0, //总费用
      rent: 0, //租金
      deposit: "", //押金
      freight: 0, //运费

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

      dialogInvoice: false,
      invoiceTypes: [
        {
          value: 1,
          label: "普通发票"
        },
        {
          value: 2,
          label: "增值税发票"
        }
      ],
      invoicetype: 1, //类型发票类型，1，普通发票，2增值税发票
      invoicename: "",
      invoicetaxNum: "",
      invoiceaddress: "",

      centerDialogVisible: false //信安租赁协议弹窗
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  watch: {
    //数量
    num(newVal, oldVal) {
      console.log(newVal);
    },
    $route() {
      this.subTime = this.$route.params.subTime;
      let obj = this.shoppingInfo;
      // console.log(this.shoppingInfo);
      if (obj) {
        // console.log(obj.list);
        if (this.subTime != "") {
          let arr = [];
          obj.list.forEach(item => {
            if (item.subTime == this.subTime) {
              item.leaveMsg = "";
              arr.push(item);
            }
          });
          this.cartList = arr;
          if (this.cartList.length == 0) {
            this.noData = true;
            setTimeout(() => {
              this.$router.push("/");
            }, 2000);
          }
        }
      }
    }
  },
  filters: {
    filterPhone(val) {
      return val.substr(0, 3) + "****" + val.substr(7);
    },
    filterMoney2wei(value) {
      return value.toFixed(2);
    },
    filterInvoiceType(value) {
      if (value == 1) {
        return "普通发票";
      } else if (value == 2) {
        return "增值税发票";
      }
    }
  },
  created() {
    // console.log(this.shoppingInfo);
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

    this.subTime = this.$route.params.subTime;
    let obj = this.shoppingInfo;
    // console.log(this.shoppingInfo);
    if (obj) {
      // console.log(obj.list);
      if (this.subTime != "") {
        let arr = [];
        obj.list.forEach(item => {
          if (item.subTime == this.subTime) {
            item.leaveMsg = this.leaveMsg
            arr.push(item);
          }
        });
        this.cartList = arr;
        if (this.cartList.length == 0) {
          this.noData = true;
          this.$message({
            message: "操作太频繁，自动返回首页",
            type: "warning",
            duration: 1000
          });
          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        }
      }
    }
    this.getUserPostage()   //计算运费
    
    this.getAddressList();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    getUserPostage(){
      mt_getUserPostage().then(data =>{
        console.log(data.data)
        let userPostage = data.data
        let arr = [];  
        console.log(this.cartList)
        this.cartList.forEach(item => {
          arr.push(item.gcreator);
        });
        console.log(arr)
        let creators = Array.from(new Set(arr))  //去重后的商家id集合

        let fprice = 0
        creators.forEach((item, index) => {
          userPostage.forEach((items,indexs)=>{
            if(item ==items.userId){
              fprice +=   items.money
            }
          })
        });
        console.log(fprice)
        this.freight = fprice
        this.computedPrice();  
      })
    },
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
      // console.log(value);
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
        // console.log(data);
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
      // console.log(value);
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
    //查看租赁协议
    viewLease() {
      // console.log(1111);
      this.centerDialogVisible = true

    },
    //数量加减
    changeNum(index, item) {
      console.log(index);
      this.cartList[index].selected = true
      this.computedPrice();
    },
    //计算价格
    computedPrice() {
      this.selectedNum = 0;
      this.rent = 0;
      this.deposit = 0;
      this.totalPrice = 0;
      this.cartList.forEach((item, index) => {
        this.selectedNum += 1;
        this.deposit += item.num * item.collocation.deposit;
        this.rent +=
          item.collocation.rent * item.num * item.leaseTerm * item.per;
        this.totalPrice +=
          item.num * item.collocation.deposit +
          item.collocation.rent * item.num * item.leaseTerm * item.per;
      });
    },
    //获取发票信息
    getInvoice() {
      let that = this;
      mt_getinvoice().then(data => {
        that.invoice = data.data;
      });
    },
    //添加发票信息
    addInvoice() {
      this.dialogInvoice = true;
      mt_getinvoice().then(data => {
        if (data.data.type != "" && data.data.type != undefined) {
          this.invoicetype = data.data.type;
          this.invoicename = data.data.name;
          this.invoicetaxNum = data.data.taxNum;
          this.invoiceaddress = data.data.address;
        }
      });
    },
    //编辑发票信息
    editInvoice() {
      this.dialogInvoice = true;
      this.invoicetype = this.invoice.type;
      this.invoicename = this.invoice.name;
      this.invoicetaxNum = this.invoice.taxNum;
      this.invoiceaddress = this.invoice.address;
    },
    //确认添加发票信息
    submitInvoice() {
      let that = this;
      if (that.invoicename == "") {
        that.$message({
          message: "公司名称不能为空",
          type: "warning",
          duration: 1000
        });
      } else if (that.invoicetaxNum == "") {
        that.$message({
          message: "公司税号不能为空",
          type: "warning",
          duration: 1000
        });
      } else if (that.invoiceaddress == "") {
        that.$message({
          message: "地址不能为空",
          type: "warning",
          duration: 1000
        });
      } else {
        // name,taxNum,type,id
        mt_invoice(
          that.invoicetype,
          that.invoicename,
          that.invoicetaxNum,
          that.invoiceaddress,
          that.invoice.id ? that.invoice.id : ""
        ).then(data => {
          // console.log(data)
          that.$message({
            message: "发票添加成功",
            type: "success",
            duration: 1000
          });

          that.dialogInvoice = false;
          that.getInvoice();
        });
      }
    },
    //提交订单
    subOrder() {
      let that = this,
        state = true,
        title = "";
      console.log(this.selectedAddress);
      if (
        that.selectedAddress.id == "" ||
        that.selectedAddress.id == undefined
      ) {
        state = false;
        title = "地址不能为空";
      }
      console.log(that.invoice);
      if (state) {
        // console.log(that.cartList);
        let arr = [];
        that.cartList.forEach(item => {
          let d = {
            goodsId: item.gid,
            goodsCycle: item.leaseTerm,
            goodsNumber: item.num,
            courierWay: 1,
            courierMoney: 0,
            remark: that.leaveMsg,
            deposit: item.collocation.deposit,
            rent: item.collocation.rent,
            dispose: item.collocation.val,
            per: item.per
          };
          arr.push(d);
        });
        let leaseOrderGoodsInfo = JSON.stringify(arr);
        // console.log(that.selectedAddress);
        mt_createOrder(
          that.selectedAddress.id,
          leaseOrderGoodsInfo,
          that.invoice.id ? that.invoice.id : "",
          that.invitationCode,
          that.companyName,
          that.freight
        ).then(data => {
          // console.log(data.data);
          that.remove();
          that.$router.push("/pay/" + data.data);
        });
      } else {
        that.$message({
          message: title,
          type: "warning",
          duration: 1000
        });
      }
    },
    // 移除购物车数据
    remove() {
      this.subTime = this.$route.params.subTime;
      let obj = [];
      obj = this.shoppingInfo;
      
      let arr = [],
        obh = {},
        val = "",ids = []
      obj.list.forEach(item => {
        console.log(item)
        if (item.subTime == this.subTime) {
          ids.push(item.id)
        }
      });
      this.deleteCart(ids.join(','))
    },
    //更新购物车
    updateCart(arr) {
      mt_insertcart(JSON.stringify(arr)).then(data => {
        console.log(data);
      });
    },
    deleteCart(ids) {
      console.log(ids)
      mt_deletecart(ids).then(data => {
        console.log(data);
        this.getCarList()
      });
    },
    //获取购物车列表
    getCarList() {
      let that = this;
      mt_selectAllcart().then(data => {
        console.log(data.data)
        let arr =
          that.shoppingInfo.list != null && that.shoppingInfo.list != undefined
            ? that.shoppingInfo.list
            : [];
        let arr1 = data.data.data;
        arr1.forEach(item => {
          item.address = JSON.parse(item.address);
          item.collocation = JSON.parse(item.collocation);
        });
        that.cartList = arr1;
        let obj = {};
        obj.list = arr1;
        that.setShoppingInfo(obj);
      });
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
.shoppingcartlist {
  background-color: #ffffff;
  padding: 30px 0 50px 0;
  border-top: 2px solid $mainColor;
  .box {
    .ot {
      line-height: 16px;
      margin-bottom: 20px;
      font-size: 16px;
      color: #333333;
    }
    .goodsDetail {
      padding: 20px;
      border: 1px solid #f0f0f0;
      .oinfo {
        margin-bottom: 30px;
        padding-bottom: 30px;
        border-bottom: 1px solid #e6e6e6;
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
        .invoice {
          font-size: 0;
          padding-left: 20px;
          overflow: hidden;
          span {
            display: inline-block;
            line-height: 30px;
            margin-right: 30px;
            font-size: 12px;
            color: #666666;
            &.op {
              float: right;
              line-height: 30px;
              padding: 0 20px;
              font-size: 12px;
              background-color: #c4c4c4;
              color: #333333;
              border-radius: 20px;
              cursor: pointer;
            }
            &.add {
              background-color: $mainColor;
              color: #ffffff;
            }
          }
        }
        .lease {
          padding-left: 20px;
          display: flex;
          line-height: 40px;
          .l {
            flex: 260px 0 0;
            width: 260px;
            font-size: 12px;
            color: #666666;
          }
          .code {
            flex: 1;
            display: flex;
            span {
              font-size: 12px;
              color: #666666;
            }
            .inp {
              width: 190px;
            }
          }
        }
      }
      .title {
        height: 40px;
        line-height: 40px;
        padding: 0 !important;
        background-color: #999999 !important;
        &.itm {
          color: #333333;
        }
      }
      .itm {
        padding: 20px 0 20px 20px;
        font-size: 14px;
        color: #666666;
        background-color: #f7f7f7;
        &:first-child {
          padding: 0;
          border-bottom: none;
        }
        &:last-child {
          padding-bottom: 0;
          .leaveMsg {
            border-bottom: none;
            padding-bottom: 30px;
          }
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
            padding: 0 50px 0 20px;
            .des,
            .sign {
              font-size: 14px;
              line-height: 18px;
              color: #666666;
              &:hover {
                cursor: pointer;
                color: $mainColor;
              }
            }
            .sign {
              margin-top: 14px;
            }
          }
        }
        .type {
          padding-right: 50px;
          font-size: 14px;
          line-height: 18px;
          color: #666666;
        }
        .price {
          font-size: 14px;
          line-height: 18px;
          color: #333333;
        }
        .number,
        .delete {
          text-align: center;
          i {
            font-size: 20px;
            padding-top: 4px;
            &:hover {
              cursor: pointer;
              color: $mainColor;
            }
          }
        }
        .leaveMsg {
          padding: 30px 0;
          border-top: 1px solid #c4c4c4;
          border-bottom: 2px solid #ffffff;
          .inp {
            display: flex;
            span {
              line-height: 40px;
              font-size: 12px;
              color: #666666;
            }
            .textarea {
              flex: 1;
              padding: 0 60px 0 10px;
            }
          }
          .type {
            line-height: 40px;
            font-size: 12px;
            color: #666666;
          }
          .price {
            line-height: 40px;
            font-size: 12px;
            color: #666666;
          }
        }
      }
      .priceInfo {
        text-align: right;
        .p {
          margin-bottom: 20px;
          font-size: 0;
          span {
            margin-left: 30px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
          }
        }
        .ai {
          .a {
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
          }
        }
        .sbtn {
          font-size: 0;
          margin-top: 40px;
          span {
            display: inline-block;
            font-size: 14px;
            line-height: 50px;
            margin-left: 30px;
            &.v {
              color: #666666;
              i {
                font-style: normal;
                font-size: 20px;
                color: $mainColor;
                font-weight: bold;
              }
            }
            &.subOrder {
              padding: 0 42px;
              background-color: $mainColor;
              color: #ffffff;
              border-radius: 3px;
              font-size: 18px;
              &:hover {
                cursor: pointer;
                background-color: $mainHoverColor;
              }
            }
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

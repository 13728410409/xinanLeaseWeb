<template>
  <div>

    <div class="pc" v-if="!mobileMode.result">
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
      <div class="hometop3">
        <div class="container box">
          <span class="title" @click="search">商品分类</span>
        </div>
      </div>
      <div class="goods">
        <div class="container box">
          <div class="step">
            <span @click="search">全部商品</span>&nbsp;&gt;&nbsp;
            <span>{{goodsInfo.name}}</span>
          </div>
          <div class="goodsinfo">
            <div class="carousel" style="height: 530px">
              <div class="gallery-top2">
                <div class="itmimg" :style="{ backgroundImage:'url('+currentImg+')'}">
                  <div
                    v-if="goodsInfo.video!=''&&goodsInfo.video!=null&&currentIndex==0"
                    @click="playVideo"
                    style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;"
                  ></div>
                  <img
                    v-if="goodsInfo.video!=''&&goodsInfo.video!=null&&currentIndex==0"
                    class="videoPlay"
                    src="/static/icon/video.png"
                    alt
                  />
                </div>
              </div>
              <div class="gallery-thumbs2">
                <div
                  class="itmimg"
                  :class="currentIndex==index?'active':''"
                  v-for="(item,index) of navlist"
                  :key="index"
                  :style="{ backgroundImage:'url('+item+')'}"
                  @mouseover="selectStyle(item,index)"
                ></div>
              </div>
            </div>
            <div class="goodsInfoDetail" v-if="goodsInfo.name">
              <div class="gname">{{goodsInfo.name}}</div>
              <div class="gprice">
                <span class="n">月租金：</span>
                <span class="val">￥{{rent}}</span>
                <span class="share" title="点击生成分享链接">分享</span>
              </div>
              <div class="item collocation">
                <div class="name">选择配置:</div>
                <div class="val">
                  <div
                    class="itm"
                    :class="collocation.config==item.config?'active':''"
                    v-for="(item,index) of testDataModel"
                    :key="index"
                    @click="selectcollocation(item)"
                  >{{item.config}}</div>
                </div>
              </div>
              <div class="item way">
                <div class="name">租赁方式:</div>
                <div class="vals">
                  <div class="ways">{{goodsInfo.goodsWay | filterWay}}</div>
                  <div class="price">
                    押金：
                    <span>￥{{deposit }}</span>
                  </div>
                </div>
                <div class="date">
                  <div class="name">租赁时间：</div>
                  <el-select v-model="leaseTerm" placeholder="请选择">
                    <el-option
                      v-for="item of goodsInfo.leaseTermOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="item startTime">
                <div class="name">开始日期：</div>
                <div class="val">
                  <el-date-picker
                    v-model="startTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions0"
                    class="longInput"
                  ></el-date-picker>
                </div>
              </div>
              <div class="item num">
                <div class="name">租赁数量：</div>
                <div class="val">
                  <el-input-number
                    v-model="num"
                    @change="changeNum"
                    size="small"
                    :min="1"
                    :step="1"
                    step-strictly
                    label="租赁数量"
                  ></el-input-number>
                </div>
              </div>
              <div class="tip">合计首期租金￥{{rent * leaseTerm * num }} 合计需支付押金￥{{ deposit * num }}</div>
              <div class="special">
                <span v-if="deposit==0">商品免押金</span>
                <span>起租时间{{goodsInfo.leaseTime}}个月</span>
              </div>
              <div class="opt">
                <span class="addCart" @click="addCart">加入购物车</span>
                <span class="placeOrder" @click="placeOrder">立即下单</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="parameter">
        <div class="container box">
          <div class="title">
            <span :class="showFlag==1?'active':''" @click="selectShowFlag(1)">产品参数</span>
            <span :class="showFlag==2?'active':''" @click="selectShowFlag(2)">产品评价</span>
          </div>
          <div class="bs" v-if="showFlag==1">
            <div class="item">
              <div class="name">属性参数</div>
              <div class="val detailsInfo">
                <div class="itm" v-for="item of attrList" :key="item">
                  <span class="n">{{item.attrName}}</span>
                  <span class="v">{{item.attrVal}}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="name">产品描述</div>
              <div class="val llist">
                <div class="t">产品介绍</div>
                <div class="b">{{goodsInfo.des}}</div>
              </div>
            </div>
            <div class="item">
              <div class="name">包装清单</div>
              <div class="val llist">
                <div class="t">包装清单</div>
                <div class="b">{{goodsInfo.packingList}}</div>
              </div>
            </div>
            <div class="item">
              <div class="name">售后保障</div>
              <div class="val llist">
                <div class="t">售后保障</div>
                <div class="b">{{goodsInfo.proAfterSales}}</div>
              </div>
            </div>
            <div class="item">
              <div class="name">咨询内容</div>
              <div class="val llist">
                <div class="t">咨询内容</div>
                <div class="consultBox">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="consultCont"
                    class="input"
                  ></el-input>
                  <span @click="consult">开始咨询</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="name">产品介绍</div>
              <div class="val">
                <img class="pimg" v-for="item of productImgs" :key="item" :src="item" alt />
              </div>
            </div>
          </div>
          <div class="bs" v-if="showFlag==2">
            <div class="level">
              <span class="name">产品评价({{commentList.length!=0?commentList.length:0}})</span>
              <span :class="commentType==1?'active':''" @click="selectComentType(1)">好评</span>
              <span :class="commentType==2?'active':''" @click="selectComentType(2)">中评</span>
              <span :class="commentType==3?'active':''" @click="selectComentType(3)">差评</span>
              <span :class="commentType==4?'active':''" @click="selectComentType(4)">有图</span>
            </div>
            <div class="clist">
              <div
                class="itm"
                v-for="(item,index) of commentList"
                :key="index"
                v-if="commentList.length>0"
              >
                <div class="uinfo">
                  <img :src="item.creatorImg" alt />
                  <span class="uname">{{item.creator}}</span>
                </div>
                <div class="cinfo">
                  <div class="score">
                    <el-rate
                      v-model="item.score"
                      disabled
                      text-color="#ff9900"
                      :colors="['#f08200', '#f08200', '#f08200']"
                      score-template="{value}"
                    ></el-rate>
                  </div>
                  <div class="des">{{item.comments}}</div>
                  <div class="imgs">
                    <el-image
                      class="img"
                      v-for="(items,indexs) of item.imgs"
                      :key="indexs"
                      :src="items"
                      :preview-src-list="item.imgs"
                    ></el-image>
                  </div>
                  <div class="time">{{item.time}}</div>
                </div>
              </div>
              <div class="noComment" v-if="commentList.length==0">暂无评价</div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-size="limit"
                layout="total, prev, pager, next, jumper"
                :total="count"
                v-if="commentList.length>0"
                style="text-align:right;"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div class="bottomsearch">
        <div class="container box">
          <div class="t">
            <i class="n">分&nbsp;&nbsp;类：</i>
            <span>不限</span>
            <span>电脑办公</span>
            <span>电脑配件</span>
            <span>手机</span>
            <span>打印机</span>
            <span>投影仪</span>
            <span>服务器</span>
          </div>
          <div class="search">
            <span>搜&nbsp;&nbsp;索：</span>
            <div class="s">
              <el-input placeholder="请搜索你要租赁的设备" v-model="searchWordKey">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <foot-guide></foot-guide>
    </div>

    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <!-- 轮播 -->
      <div class="navBox">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item,index) of navlist" :key="index">
            <img class="swiper-img" :src="item" alt />
            <div
              v-if="goodsInfo.video!=''&&goodsInfo.video!=null&&index==0"
              @click="playVideo"
              class="clk"
            ></div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="goodInfo">
        <div class="price">￥{{rent}}/月</div>
        <div class="des">{{goodsInfo.name}}</div>
      </div>
      <div class="goodselectPZ">
        <div class="itm" @click="showPzModal">
          <div class="name">配置</div>
          <div class="val">
            <span>{{collocation.config}}</span>
          </div>
          <div class="select">
            <img src="/static/icon_m/more.png" />
          </div>
        </div>
        <div class="itm" @click="showPzModal">
          <div class="name">租期</div>
          <div class="val">
            <span>{{leaseTerm}}月</span>
          </div>
          <div class="select">
            <img src="/static/icon_m/more.png" />
          </div>
        </div>
        <div class="itm">
          <div class="name">押金</div>
          <div class="val">
            <span>￥{{deposit}}</span>
          </div>
        </div>
        <div class="itm">
          <div class="name">数量</div>
          <div class="val n">
            <el-input-number
              v-model="num"
              @change="changeNum"
              size="mini"
              :min="1"
              :step="1"
              step-strictly
              label="租赁数量"
              style="height:22px;line-height:20px;"
            ></el-input-number>
          </div>
        </div>
        <div class="itm">
          <div class="name">开始日期</div>
          <div class="val">
            <el-date-picker
              v-model="startTime"
              type="date"
              size="mini"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
              :picker-options="pickerOptions0"
              class="longInput"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <div class="comment_detail">
        <div class="tabs">
          <div class="itm" :class="showFlag==1?'active':''" @click="selectShowFlag(1)">详情</div>
          <div class="itm" :class="showFlag==2?'active':''" @click="selectShowFlag(2)">评价</div>
        </div>
        <div class="comment" v-if="showFlag==2">
          <div class="level">
            <span class="itm" :class="commentType==1?'active':''" @click="selectComentType(1)">好评</span>
            <span class="itm" :class="commentType==2?'active':''" @click="selectComentType(2)">中评</span>
            <span class="itm" :class="commentType==3?'active':''" @click="selectComentType(3)">差评</span>
            <span class="itm" :class="commentType==4?'active':''" @click="selectComentType(4)">有图</span>
          </div>
          <div class="list">
            <div class="itm" v-for="(item,index) of commentList" :key="index">
              <div class="top">
                <div class="img">
                  <img v-if="item.creatorImg" :src="item.creatorImg" />
                  <img v-else src="/images/icon/default.png" />
                </div>
                <div class="name">{{item.creator}}</div>
                <div class="score">
                  <el-rate
                    v-model="item.score"
                    disabled
                    text-color="#ff9900"
                    :colors="['#f08200', '#f08200', '#f08200']"
                    score-template="{value}"
                  ></el-rate>
                </div>
                <div class="time">{{item.time}}</div>
              </div>
              <div class="cont" v-if="item.comments">{{item.comments}}</div>
              <div class="imgs">
                <div class="img" v-for="(items,indexs) of item.imgs" :key="indexs">
                  <img :src="items" />
                </div>
              </div>
            </div>
            <div
              style="font-size:13px;color:#666666;padding:20px 0;"
              v-if="commentList.length==0"
            >暂无评价</div>
          </div>
        </div>
        <div class="detail" v-if="showFlag==1">
          <div class="itm">
            <div class="title">
              <span>属性参数</span>
            </div>

            <div class="box">
              <div class="info" v-for="(item,index) of attrList" :key="index">
                <span class="name">{{item.attrName}}</span>
                <span class="val">{{item.attrVal}}</span>
              </div>
            </div>
          </div>
          <div class="itm">
            <div class="title">
              <span>产品介绍</span>
            </div>
            <div class="txbox">
              <div class="txdes">{{goodsInfo.des}}</div>
            </div>
          </div>
          <div class="itm">
            <div class="title">
              <span>包装清单</span>
            </div>
            <div class="txbox">
              <div class="txdes">{{goodsInfo.packingList}}</div>
            </div>
          </div>
          <div class="itm">
            <div class="title">
              <span>售后保障</span>
            </div>
            <div class="txbox">
              <div class="txdes">{{goodsInfo.proAfterSales}}</div>
            </div>
          </div>
          <div class="pdIntro">
            <img mode="widthFix" v-for="(item,index) of productImgs" :key="index" :src="item" />
          </div>
        </div>
      </div>

      <div class="opt">
        <div class="cart" @click="viewCartm">
          <span class="num">{{shoppingInfo.list.length}}</span>
          <img class="img" src="/static/icon_m/cartActive.png" />
          <div class="tx">购物车</div>
        </div>
        <div class="btn addCart" @click="addCart">加入购物车</div>
        <div class="btn buyNow" @click="placeOrder">立即购买</div>
      </div>
      <!-- 底部弹窗 -->
      <div class="commodity_screen" @click="hideModal" v-if="showModalStatus"></div>
      <div class="commodity_attr_box" v-if="showModalStatus">
        <div class="title">配置</div>
        <div class="collocation">
          <div
            class="itm"
            :class="collocation.config==item.config?'active':''"
            v-for="(item,index) of testDataModel"
            :key="index"
            @click="selectcollocation(item)"
          >{{item.config}}</div>
        </div>
        <div class="title">租期</div>
        <div class="time">
          <div
            class="itm"
            :class="leaseTerm==item.value?'active':''"
            v-for="(item,index) of goodsInfo.leaseTermOptions"
            :key="index"
            @click="selectleaseTerm(item)"
          >{{item.label}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import search from "@/components/search/search";
import shoppingcart from "@/components/shopping/shoppingcart";
import addressbox from "@/components/address/proviceCity";
import headertop from "@/components/mobile/header";
import {
  formatDate,
  isInArray,
  compare,
  formatNum,
  accMul
} from "@/config/often";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { mt_getGoodsById, mt_addCart } from "@/api/home";
import { mt_selectComment, mt_goodsinsert } from "@/api/order";
import { mt_insertcart, mt_selectAllcart } from "@/api/common";
import { mt_getuserInfo } from "@/api/my";

export default {
  name: "goodsdetail",
  components: {
    headTop,
    footGuide,
    search,
    shoppingcart,
    addressbox,
    swiper,
    swiperSlide,
    headertop
  },
  data() {
    return {
      goodsId: "",

      currentIndex: 0,
      currentImg: "",

      swiperOption: {
        pagination: ".swiper-pagination",
        notNextTick: true,
        // autoplay: 3000,
        direction: "horizontal",
        grabCursor: true,
        setWrapperSize: true,
        autoHeight: true,
        paginationClickable: true,
        mousewheelControl: true,
        observeParents: true,
        loop: true
      },

      goodsInfo: {},
      videoImg: "",
      attrList: [], //属性参数
      productImgs: [], //产品图片
      navlist: [],
      rent: 0, //每个月租金
      deposit: 0, //押金
      collocation: {}, //配置选择
      leaseTerm: 1, //租期
      per: 0, //优惠率
      addressArr: ["广东省", "深圳市"], //地址
      // addressArr: [], //地址
      startTime: "", //时间
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      num: 1, //数量
      showFlag: 1, //1显示产品参数  2显示产品评价
      commentType: 1, //评价类型 1好评 2中评 3差评
      commentList: [],
      page: 1,
      limit: 10,

      consultCont: "", //咨询内容
      searchWordKey: "", //搜索

      testDataModel: [
        {
          id: "1",
          config: "配置1",
          value: [{ term: 1, depositMoney: "300", rentMoney: "101" }]
        },
        {
          id: "2",
          config: "配置2",
          value: [
            { term: 3, depositMoney: "330", rentMoney: "102" },
            { term: 4, depositMoney: "400", rentMoney: "120" }
          ]
        },
        {
          id: "3",
          config: "配置3",
          value: [
            { term: 2, depositMoney: "350", rentMoney: "103" },
            { term: 3, depositMoney: "500", rentMoney: "130" },
            { term: 6, depositMoney: "600", rentMoney: "200" }
          ]
        }
      ], //配置信息

      headValue: "商品详情", //头部
      showModalStatus: false //配置弹窗显示状态
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  watch: {
    //租期变化
    leaseTerm(newVal, oldVal) {
      this.goodsInfo.leaseTermOptions.forEach(item => {
        if (item.value == newVal) {
          this.rent = item.rentMoney;
          this.deposit = item.depositMoney;
        }
      });
    },
    //数量
    num(newVal, oldVal) {},
    showFlag(newVal, oldVal) {
      if (newVal == 2) {
        this.selectComment();
      }
    }
  },
  filters: {
    filterWay(value) {
      if (value == "3") {
        return "即租即还";
      } else if (value == "4") {
        return "租完即送";
      } else if (value == "5") {
        return "固定租期";
      } else if (value == "6") {
        return "短期租赁";
      }
    },
    filterMoney2wei(value) {
      return value.toFixed(2);
      // formatNum(value)
    },
    filterPer(value) {
      return value.toFixed(1);
    }
  },
  created() {
    this.goodsId = this.$route.params.id;
    if (this.goodsId) {
      this.getGoodsById(this.goodsId);
    } else {
      that
        .$confirm("当前地址有误, 立即返回首页?", "温馨提示", {
          confirmButtonText: "确定",
          showClose: false,
          showCancelButton: false,
          closeOnClickModal: false,
          type: "warning"
        })
        .then(() => {
          that.$router.push("/");
        })
        .catch(() => {
          that.$router.push("/");
        });
    }
  },
  updated() {},
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    // 显示配置项遮罩层
    showPzModal() {
      this.showModalStatus = true;
    },
    //hideModal
    hideModal() {
      this.showModalStatus = false;
    },
    //选中配置
    selectcollocation(val) {
      if (this.collocation.config != val.config) {
        this.collocation = val;
        this.rent = val.value[0].rentMoney;
        this.deposit = val.value[0].depositMoney;
        this.leaseTerm = val.value[0].term;
        this.changeDateData();
      }
    },
    //选中时间
    selectleaseTerm(val) {
      // console.log(val);
      if (this.leaseTerm != val.value) {
        this.goodsInfo.leaseTermOptions.forEach(item => {
          if (item.value == val.value) {
            this.leaseTerm = val.value;
            this.rent = val.rentMoney;
            this.deposit = val.depositMoney;
          }
        });
      }
    },
    //移动端查看购物车
    viewCartm() {
      this.$router.push('/cartList')
    },
    //点击搜索
    search() {
      this.$router.push({ name: "list", params: { name: "", menuId: "" } });
    },
    //获取购物车列表
    getCarList() {
      let that = this;
      mt_selectAllcart().then(data => {
        // console.log(data.data.data);
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
    //商品详情
    getGoodsById(id) {
      let that = this;
      mt_getGoodsById(id).then(data => {
        // console.log(data.data);
        that.goodsInfo.des = data.data.proIntroduction;
        that.testDataModel = JSON.parse(data.data.dispose);
        that.attrList = JSON.parse(data.data.leaseAttr);
        that.productImgs = JSON.parse(data.data.leaseInfoImg);
        let arr = [];
        arr = JSON.parse(data.data.leaseImg);
        if (data.data.video != "" && data.data.video != null) {
          let res = data.data.video + "?vframe/jpg/offset/0";
          arr.unshift(res);
        }
        that.navlist = arr;
        // console.log(that.navlist);
        that.goodsInfo = data.data;
        that.init();
      });
    },
    selectStyle(value, index) {
      if (this.currentIndex != index) {
        this.currentIndex = index;
        this.currentImg = value;
      }
      // console.log(value)
    },
    //播放视频
    playVideo() {
      this.$alert(
        "<div style='width:500px;height:500px;'><video controls='controls' id='vide' style='margin:0 auto;display:block;max-width:100%;max-height:100%;'><source src=" +
          this.goodsInfo.video +
          " ref='video' type='video/mp4' /></video></div>",
        "商品视频",
        {
          showClose: false,
          dangerouslyUseHTMLString: true,
          callback: action => {
            if (action == "confirm") {
              // console.log(111);
              let vide = document.getElementById("vide");
              vide.pause();
            }
          }
        }
      );
    },
    // 初始化配置
    init() {
      this.currentIndex = 0;
      this.currentImg = this.navlist[0];
      var today = new Date().getTime();
      this.startTime = formatDate(today, "yyyy-MM-dd");
      this.leaseTime = formatDate(today, "yyyy-MM-dd"); //租赁开始日期
      this.collocation = this.testDataModel[0]; //配置
      console.log(this.collocation);
      this.rent = this.testDataModel[0].value[0].rentMoney;
      this.deposit = this.testDataModel[0].value[0].depositMoney;
      this.leaseTerm = this.testDataModel[0].value[0].term; //租期
      let pzList = [];
      this.changeDateData();
    },
    // 更新日期数据选项
    changeDateData() {
      let leaseTermOptions = [];
      // console.log(this.collocation)
      this.collocation.value.forEach((item, index) => {
        leaseTermOptions.push({
          value: item.term,
          label: item.term + "个月",
          rentMoney: item.rentMoney,
          depositMoney: item.depositMoney
        });
      });
      leaseTermOptions.sort(compare("value"));
      this.goodsInfo.leaseTermOptions = leaseTermOptions;
    },
    //选择配置
    selectcollocation(val) {
      if (this.collocation.config != val.config) {
        this.collocation = val;
        // testDataModel
        this.rent = val.value[0].rentMoney;
        this.deposit = val.value[0].depositMoney;
        this.leaseTerm = val.value[0].term;
        this.changeDateData();
      }
    },
    //地址选择
    sureAddress(value) {
      // console.log(value);
      this.addressArr = value;
    },
    //改变租赁数量
    changeNum() {
      // console.log(this.num);
    },
    //切换查看产品参数和产品评价
    selectShowFlag(val) {
      // console.log(val)
      if (this.showFlag != val) {
        this.showFlag = val;
      }
    },
    //加入购物车
    addCart(type) {
      let that = this;
      let subTime = new Date().getTime();
      // console.log(subTime)
      console.log(that.goodsInfo.leaseTermOptions)
      let data = {
        gid: that.goodsId,
        img: that.navlist[0],
        des: that.goodsInfo.name,
        num: that.num,
        way: that.goodsInfo.goodsWay,
        wayValue: that.wayValue,
        leaseTerm: that.leaseTerm,
        rent: that.rent,
        deposit: that.deposit,
        leaseTermOptions: JSON.stringify(that.goodsInfo.leaseTermOptions),
        startTime: that.startTime,
        collocation: that.collocation,
        subTime: subTime,
        selected: false,
        gcreator: that.goodsInfo.creator
      };
      let obj = {},
        arr = [];
      let shoppingInfo = localStorage.getItem("shoppingInfo");
      arr = shoppingInfo ? JSON.parse(shoppingInfo).list : [];
      // 购物车是否有数据
      if (shoppingInfo && JSON.parse(shoppingInfo).list.length > 0) {
        let ids = [];
        arr.forEach(item => {
          ids.push(item.gid);
        });
        if (isInArray(ids,  Number(that.goodsId))) {
          let state = false,ind = -1;
          arr.forEach((item, index) => {
            if (
              that.goodsId == item.gid &&
              that.leaseTerm == item.leaseTerm &&
              that.collocation.id == item.collocation.id 
            ) {
              console.log('同商品同配置，数量增加')
              state = true;
              ind = index;
            }
          });
          if (state) {
            arr[ind].num += that.num;
            arr[ind].subTime = subTime;
            obj.list = arr;
          } else {
            arr.unshift(data);
            obj.list = arr;
          }
        } else {
          arr.unshift(data);
          obj.list = arr;
        }
      } else {
        arr.unshift(data);
        obj.list = arr;
      }
      // console.log(obj.list)
      //存本地购物车缓存
      that.setShoppingInfo(obj);
      let userInfo = localStorage.getItem("userInfo");
      // console.log(userInfo)
      if (userInfo) {
        mt_insertcart(JSON.stringify(obj)).then(data => {
          that.getCarList();
        });
      }
      if (type == 2) {
        let userInfo = localStorage.getItem("userInfo");
        // console.log(userInfo);
        if (userInfo != null && userInfo != undefined) {
          mt_getuserInfo().then(data => {
            // console.log(data.data)
            that.setUserInfo(data.data);
            if (data.data.status == 2) {
              that.$router.push("/subOrder/" + subTime);
            } else {
              this.$confirm("实名认证成功后才能下单", "信安提示", {
                confirmButtonText: "去实名",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  that.$router.push("/accountCompany");
                })
                .catch(() => {});
            }
          });
        } else {
          that.$alert("下单需要登录，是否前往登录？", "登录提示", {
            confirmButtonText: "确定",
            showClose: false,
            callback: action => {
              that.$router.push("/login");
            }
          });
        }
      } else {
        if(!this.mobileMode.result){
          that.$message.success("加入购物车成功", 500);
        }else{
          alert('加入购物车成功')
        }
      }
    },
    //下单
    placeOrder() {
      this.addCart(2);
    },
    //咨询
    consult() {
      console.log(this.consultCont);
      let that = this;
      if (that.consultCont != "") {
        mt_goodsinsert(that.goodsId, that.consultCont).then(data => {
          console.log(data);
          that.consultCont = "";
          that.$message.success(
            "商品咨询提交成功，稍后平台会主动联系你！",
            500
          );
        });
      } else {
        that.$message.warning("咨询内容不能为空", 500);
      }
    },
    //切换评价类型
    selectComentType(val) {
      console.log(val);
      if (this.commentType != val) {
        this.commentType = val;
        this.page = 1;
        this.commentList = [];
        this.selectComment();
      }
    },
    //获取评价
    selectComment() {
      let that = this;
      mt_selectComment(
        that.page,
        that.limit,
        that.goodsId,
        that.commentType
      ).then(data => {
        // console.log(data.data)
        data.data.data.forEach(item => {
          item.imgs =
            item.img != "" && item.img != null ? JSON.parse(item.img) : [];
        });
        that.commentList = data.data.data;
        that.count = data.data.count;
      });
    }
  }
};
</script>>
<style>
.el-message-box {
  width: auto !important;
}
</style>
<style lang="scss" scoped>
@import "src/style/mixin";
@import "../../../node_modules/swiper/dist/css/swiper.min.css";
.pc {
  .gallery-thumbs .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.4;
  }
  .gallery-thumbs .swiper-slide-active {
    opacity: 1;
  }
  .hometop3 {
    height: 40px;
    background-color: #ffffff;
    border-bottom: 1px solid $mainColor;
    .box {
      font-size: 0;
      span {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
      }
      .title {
        display: inline-block;
        width: 190px;
        margin-right: 20px;
        padding-left: 18px;
        color: #ffffff;
        background-color: $mainColor;
        cursor: hand;
      }
      .nav {
        margin-right: 72px;
        color: #333333;
        &:hover,
        &.active {
          color: $mainColor;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
  .type {
    background-color: #ffffff;
    .box {
      padding-top: 20px;
      .title {
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        line-height: 14px;
        margin-bottom: 18px;
      }
      .condition {
        border: 1px solid #dddddd;
        .itm {
          display: flex;
          line-height: 36px;
          &:last-child {
            .name {
              span {
                border-bottom: none;
              }
            }
            .result {
              border-bottom: none;
            }
          }
          .name {
            flex: 120px 0 0;
            background-color: #f3f3f3;
            padding-left: 14px;
            display: flex;
            span {
              flex: 1;
              display: block;
              font-size: 12px;
              color: #666666;
              border-bottom: 1px dashed #dddddd;
            }
          }
          .result {
            flex: 1;
            overflow: hidden;
            padding-right: 134px;
            border-bottom: 1px dashed #dddddd;
            position: relative;
            span {
              float: left;
              width: 12.5%;
              line-height: 36px;
              padding-left: 16px;
              font-size: 12px;
              color: #333333;
              &:hover,
              &.active {
                cursor: pointer;
                color: $mainColor;
              }
            }
            .more {
              position: absolute;
              right: 0;
              height: 36px;
              line-height: 36px;
              padding-right: 15px;
              font-size: 14px;
              color: #333333;
              &:hover {
                color: $mainColor;
                cursor: pointer;
              }
            }
            .close {
              position: absolute;
              right: 0;
              bottom: 0;
              height: 36px;
              line-height: 36px;
              padding-right: 15px;
              font-size: 14px;
              color: #333333;
              &:hover {
                color: $mainColor;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .goods {
    background-color: #ffffff;
    padding-bottom: 100px;
    .box {
      .step {
        padding: 12px 0;
        font-size: 14px;
        line-height: 14px;
        color: #999999;
        span {
          color: #666666;
          &:hover {
            cursor: pointer;
            color: $mainColor;
            text-decoration: underline;
          }
        }
      }
      .goodsinfo {
        display: flex;
        padding: 14px 0;
        .carousel {
          flex: 450px 0 0;
          width: 450px;
          .gallery-top2 {
            width: 450px;
            height: 450px;
            border: 1px solid #dddddd;
            .itmimg {
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              position: relative;
              height: 100%;
              .videoPlay {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate3d(-50%, -50%, 0);
                width: 40px;
                height: 40px;
                cursor: pointer;
              }
            }
          }
          .gallery-thumbs2 {
            height: 60px;
            margin-top: 20px;
            overflow: hidden;
            .itmimg {
              float: left;
              width: 58px;
              height: 58px;
              margin-right: 15px;
              border: 1px solid #ffffff;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              position: relative;
              &.active {
                border-color: #f08200;
              }
            }
          }
          .gallery-top {
            width: 450px;
            height: 450px;
            border: 1px solid #dddddd;
            .itmimg {
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              position: relative;
              &.video {
                &:hover {
                  cursor: pointer;
                }
                .videoPlay {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate3d(-50%, -50%, 0);
                  width: 40px;
                  height: 40px;
                }
              }
              video {
                width: 100%;
                height: 100%;
              }
            }
          }
          .gallery-thumbs {
            height: 60px;
            margin-top: 20px;
            .itmimg {
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              position: relative;
              &.video {
                &:hover {
                  cursor: pointer;
                }
                .videoPlay {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate3d(-50%, -50%, 0);
                  width: 40px;
                  height: 40px;
                }
              }
            }
          }
        }
        .goodsInfoDetail {
          flex: 1;
          width: 750px;
          padding-left: 30px;
          .gname {
            font-size: 16px;
            line-height: 16px;
            color: #666666;
            font-weight: bold;
          }
          .gprice {
            display: flex;
            margin-top: 15px;
            font-size: 14px;
            color: #666666;
            line-height: 38px;
            .n {
              font-size: 14px;
              color: #666666;
            }
            .val {
              flex: 1;
              font-size: 20px;
              line-height: 38px;
              font-style: normal;
              color: $mainColor;
            }
            .share {
              flex: 60px 0 0;
              padding-left: 20px;
              width: 80px;
              line-height: 38px;
              font-size: 14px;
              background: url("/static/icon/share.png") no-repeat left center;
              &:hover {
                color: $mainColor;
                cursor: pointer;
              }
            }
          }
          .item {
            display: flex;
            margin-top: 20px;
            .name {
              flex: 80px 0 0;
              width: 80px;
              height: 38px;
              font-size: 14px;
              line-height: 38px;
              color: #999999;
              vertical-align: top;
            }
            .val {
              flex: 1;
            }
          }
          .collocation {
            padding-top: 20px;
            border-top: 1px solid #dddddd;
            .val {
              display: flex;
              flex-wrap: wrap;
              .itm {
                height: 38px;
                line-height: 38px;
                margin: 0 10px 10px 0;
                font-size: 14px;
                color: #666666;
                padding: 0 10px;
                border: 1px solid #c4c4c4;
                &.active,
                &:hover {
                  cursor: pointer;
                  color: $mainColor;
                  border: 1px solid $mainColor;
                }
              }
            }
          }
          .way {
            .vals {
              margin-right: 20px;
              padding: 10px 20px 10px 10px;
              border: 1px solid #dddddd;
              display: flex;
              font-size: 14px;
              color: #666666;
              .ways {
                height: 20px;
                line-height: 20px;
                margin-right: 10px;
                padding-right: 10px;
                border-right: 1px solid #c4c4c4;
              }
              .price {
                line-height: 20px;
                span {
                  color: $mainColor;
                }
              }
            }
            .date {
              flex: 1;
              width: 300px;
              font-size: 14px;
              color: #666666;
              display: flex;
            }
          }
          .startTime {
          }
          .num {
            .val {
              padding-top: 3px;
            }
          }
          .tip {
            margin-top: 20px;
            font-size: 14px;
            line-height: 14px;
            color: #3573d8;
          }
          .special {
            margin-top: 20px;
            font-size: 0;
            span {
              font-size: 14px;
              line-height: 38px;
              margin-right: 20px;
              padding: 0 30px;
              border: 1px solid $mainColor;
              color: $mainColor;
              display: inline-block;
            }
          }
          .opt {
            margin-top: 20px;
            padding-top: 30px;
            border-top: 1px dashed #dddddd;
            font-size: 0;
            span {
              width: 140px;
              line-height: 48px;
              margin-right: 20px;
              text-align: center;
              font-size: 14px;
              display: inline-block;
              &:hover {
                cursor: pointer;
              }
              &.addCart {
                color: $mainColor;
                background-color: #ffecd6;
                border: solid 1px $mainColor;
              }
              &.placeOrder {
                color: #ffffff;
                background-color: $mainColor;
                border: solid 1px $mainColor;
              }
            }
          }
        }
      }
    }
  }
  .parameter {
    background-color: #ffffff;
    .box {
      .title {
        background-color: #f7f7f7;
        border-bottom: 1px solid $mainColor;
        margin-bottom: 12px;
        span {
          display: inline-block;
          width: 106px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          color: #666666;
          &.active {
            background-color: $mainColor;
            color: #ffffff;
          }
          &:hover {
            cursor: pointer;
          }
        }
      }
      .bs {
        .item {
          margin-top: 30px;
          .name {
            line-height: 14px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #333333;
            font-weight: bold;
          }
          .val {
            font-size: 12px;
            color: #666666;
            &.detailsInfo {
              display: flex;
              flex-wrap: wrap;
              // border-top: 1px solid #c4c4c4;
              // border-left: 1px solid #c4c4c4;
              .itm {
                width: 50%;
                display: flex;
                background-color: #f9f9f9;
                // border-bottom: 1px solid #c4c4c4;
                &:first-child {
                  border-top: 1px solid #c4c4c4;
                }
                &:nth-child(2) {
                  border-top: 1px solid #c4c4c4;
                }
                &:last-child {
                }
                span {
                  flex: 1;
                  line-height: 40px;
                  text-align: center;
                  border-right: 1px solid #c4c4c4;
                  border-bottom: 1px solid #c4c4c4;
                  &.n {
                    background-color: #dddddd;
                  }
                }
              }
            }
            &.llist {
              border-top: 1px solid #c4c4c4;
              border-left: 1px solid #c4c4c4;
              div {
                &.t {
                  line-height: 40px;
                  padding-left: 24px;
                  border-right: 1px solid #c4c4c4;
                  border-bottom: 1px solid #c4c4c4;
                  background-color: #dddddd;
                }
                &.b {
                  line-height: 20px;
                  padding: 10px 0 10px 24px;
                  border-right: 1px solid #c4c4c4;
                  border-bottom: 1px solid #c4c4c4;
                }
                &.consultBox {
                  display: flex;
                  padding: 20px;
                  border-right: 1px solid #c4c4c4;
                  border-bottom: 1px solid #c4c4c4;
                  .input {
                    flex: 1;
                    margin-right: 20px;
                    border-style: none;
                  }
                  span {
                    flex: 150px 0 0;
                    line-height: 50px;
                    text-align: center;
                    background-color: $mainColor;
                    color: #ffffff;
                    font-size: 18px;
                    &:hover {
                      cursor: pointer;
                      background-color: $mainHoverColor;
                    }
                  }
                }
              }
            }
            .pimg {
              max-width: 100%;
              display: block;
              margin: 0 auto;
            }
          }
        }
        .level {
          line-height: 40px;
          margin-top: 20px;
          padding: 0 20px;
          background-color: #f7f7f7;
          font-size: 14px;
          color: #333333;
          span {
            margin-right: 40px;
            &.name {
              color: $mainColor;
              font-weight: bold;
            }
            &.active,
            &:hover {
              cursor: pointer;
              color: $mainColor;
            }
          }
        }
        .clist {
          .noComment {
            padding: 40px 0;
            font-size: 14px;
            color: #333333;
            text-align: center;
          }
          .itm {
            padding: 30px 0 20px 0;
            border-bottom: 1px solid #c4c4c4;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .uinfo {
              flex: 180px 0 0;
              display: flex;
              img {
                flex: 40px 0 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
              }
              .uname {
                flex: 1;
                padding-left: 10px;
                line-height: 40px;
                font-size: 14px;
                color: #666666;
              }
            }
            .cinfo {
              flex: 1;
              .score {
                height: 40px;
                padding-top: 10px;
              }
              .des {
                font-size: 14px;
                color: #333333;
                line-height: 30px;
              }
              .imgs {
                margin-top: 10px;
                font-size: 0;
                .img {
                  display: inline-block;
                  width: 80px;
                  height: 80px;
                  margin: 0 15px 15px 0;
                }
              }
              .time {
                font-size: 12px;
                color: #999999;
              }
            }
          }
        }
      }
    }
  }
  .bottomsearch {
    padding: 20px 0 80px 0;
    background-color: #ffffff;
    .box {
      padding: 20px;
      border: 1px solid #dddddd;
      background-color: #f7f7f7;
      .t {
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        color: #666666;
        .n {
          font-style: normal;
        }
        span {
          display: inline-block;
          padding: 0 15px;
          color: #3573d8;
          border-right: 1px solid #c4c4c4;
          &:last-child {
            border-right: none;
          }
          &:first-child {
            padding-left: 0;
          }
        }
      }
      .search {
        line-height: 40px;
        margin-top: 15px;
        font-size: 14px;
        color: #666666;
        display: flex;
        .n {
        }
        .s {
          padding-left: 15px;
        }
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .mobile {
    position: relative;
    padding-bottom: 50px;
    .navBox {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      overflow: hidden;
      /deep/ .swiper-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100% !important;
        height: 100% !important;
        background-color: #ffffff;
      }
      .swiper-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        .swiper-slide {
          width: 100%;
          height: 100%;
          position: relative;
          img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -50%, 0);
            max-width: 100%;
            max-height: 100%;
          }
          .clk {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2;
          }
        }
      }
    }

    /* 商品信息 */
    .goodInfo {
      margin-bottom: 10px;
      padding: 10px;
      background-color: #fff;
      .price {
        color: #e4393c;
        font-size: 16px;
        line-height: 1.3;
        font-weight: bold;
      }
      .goodInfo .des {
        font-size: 14px;
        line-height: 21px;
        color: #333;
      }
    }

    /* 配置及条件信息 */

    .goodselectPZ {
      padding: 0 10px;
      background-color: #fff;
      .itm {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #f1f1f1;
        &:last-child {
          border-bottom: none;
        }
      }
      .itm .name {
        min-width: 25px;
        font-size: 12px;
        line-height: 22px;
        color: #999;
      }

      .itm .val {
        flex: 1;
        padding-left: 10px;
        font-size: 12px;
        color: #333;
        line-height: 22px;
        padding-right: 10px;
        &.n {
          /deep/ .el-input--mini .el-input__inner {
            height: 22px;
            line-height: 20px;
          }
        }
      }

      .itm .select {
        flex: 0 0 30px;
        width: 30px;
      }

      .itm .select img {
        width: 15px;
        height: 15px;
      }
      .itm .tip {
        font-size: 12px;
        color: #999999;
        line-height: 22px;
      }
    }

    /* 评价与商品规格 */

    .comment_detail {
      margin-top: 10px;
      .tabs {
        display: flex;
        padding: 0 10px;
        background-color: #fff;
        border-bottom: 1px solid #f1f1f1;
        .itm {
          flex: 1;
          text-align: center;
          font-size: 14px;
          color: #252525;
          line-height: 44px;
        }
        .itm.active {
          color: #f08200;
        }
      }

      .comment {
        background-color: #fff;
        .level {
          display: flex;
          padding: 10px 30px;
        }
        .level .itm {
          flex: 1;
          width: 25%;
          font-size: 13px;
          line-height: 26px;
          text-align: center;
          color: #666;
        }

        .level .itm.active {
          background-color: #f08200;
          color: #fff;
          border-radius: 10px;
        }

        .list {
          padding: 0 10px;
        }

        .list .itm {
          padding: 10px 0;
          border-bottom: 1px solid #f1f1f1;
        }

        .list .itm:last-child {
          border-bottom: none;
        }

        .list .itm .top {
          display: flex;
        }

        .list .itm .top .img {
          flex: 25px 0 0;
          width: 25px;
        }

        .list .itm .top .img image {
          float: left;
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }

        .list .itm .top .name {
          margin-left: 10px;
          font-size: 12px;
          color: #333;
          line-height: 25px;
        }

        .list .itm .top .score {
          margin-left: 5px;
          padding-top: 6px;
        }

        .list .itm .top .time {
          flex: 1;
          line-height: 25px;
          text-align: right;
          font-size: 12px;
          color: #999;
        }

        .list .itm .cont {
          font-size: 14px;
          color: #333;
          line-height: 1.5;
          margin: 5px 0;
        }

        .list .itm .imgs {
          overflow: hidden;
        }

        .list .itm .imgs .img {
          float: left;
          width: 80px;
          height: 80px;
          margin-right: 5px;
          margin-bottom: 5px;
          border-radius: 2px;
        }

        .list .itm .imgs .img img {
          width: 100%;
          height: 100%;
        }
      }

      .detail {
        padding: 10px;
        background-color: #fff;
        .itm {
          margin-bottom: 10px;
        }

        .itm .title {
          border-top: 1px solid #f1f1f1;
          text-align: center;
          height: 6px;
          margin: 16px 0 10px;
        }

        .itm .title span {
          display: inline-block;
          font-size: 12px;
          height: 12px;
          line-height: 12px;
          position: relative;
          top: -11px;
          font-weight: 400;
          padding: 0 20px;
          background: #fff;
        }
        .itm .box .info {
          display: flex;
          font-size: 12px;
          line-height: 30px;
          color: #666666;
        }
        .itm .box .info .name {
          flex: 1;
          padding-left: 10px;
          border-top: 1px solid #dadada;
          border-left: 1px solid #dadada;
          border-right: 1px solid #dadada;
        }
        .itm .box .info .val {
          flex: 1;
          padding-left: 10px;
          border-top: 1px solid #dadada;
          border-right: 1px solid #dadada;
        }
        .itm .box .info:last-child .name,
        .itm .box .info:last-child .val {
          border-bottom: 1px solid #dadada;
        }
        .txbox {
          padding: 10px 0;
        }
        .txbox .txdes {
          font-size: 12px;
          line-height: 1.5;
          color: #666666;
        }
        .pdIntro img {
          display: block;
          margin: 0 auto;
          max-width: 100%;
        }
      }
    }
    .commodity_screen {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: #000;
      opacity: 0.2;
      overflow: hidden;
      z-index: 1000;
      color: #fff;
    }

    .commodity_attr_box {
      width: 100%;
      overflow: hidden;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 2000;
      background: #fff;
      padding-top: 10px;
      .title {
        padding: 0 15px;
        font-size: 12px;
        height: 40px;
        line-height: 40px;
        color: #999;
      }

      .collocation {
        padding: 0 15px;
        overflow: hidden;
      }

      .collocation .itm {
        float: left;
        margin: 0 20px 10px 0;
        padding: 5px 10px;
        text-align: center;
        font-size: 14px;
      }

      .collocation .itm.active,
      .time .itm.active {
        background-color: #f08200;
        color: #fff;
        border-radius: 3px;
      }

      .time {
        padding: 0 15px;
        overflow: hidden;
      }

      .time .itm {
        float: left;
        width: 33.3%;
        margin-bottom: 10px;
        padding: 5px 0;
        text-align: center;
        font-size: 14px;
      }
    }

    .opt {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99;
      height: 50px;
      background-color: #fff;
      border-top: 1px solid #f1f1f1;
      display: flex;
      .cart {
        flex: 75px 0 0;
        width: 75px;
        padding: 5px 0;
        text-align: center;
        position: relative;
      }

      .cart .num {
        position: absolute;
        right: 16px;
        top: 5px;
        font-size: 10px;
        line-height: 10px;
        padding: 0 3px;
        background-color: #e4393c;
        color: #fff;
        border-radius: 5px;
      }

      .cart .img {
        width: 25px;
        height: 25px;
      }

      .cart .tx {
        font-size: 12px;
        line-height: 12px;
        color: #999;
      }

      .btn {
        flex: 1;
        color: #fff;
        text-align: center;
        font-size: 16px;
        line-height: 50px;
      }

      .addCart {
        background-color: #f08200;
      }

      .buyNow {
        background-color: #e4393c;
      }
    }
  }
}
</style>

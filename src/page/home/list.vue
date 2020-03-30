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
            <search :name="name" @search="searchWordKeyChange"></search>
          </div>
          <div class="shoppingcartBox">
            <shoppingcart></shoppingcart>
          </div>
        </div>
      </div>
      <div class="hometop3">
        <div class="container box">
          <span class="title">商品分类</span>
        </div>
      </div>
      <div class="type">
        <div class="container box">
          <div class="step">
            <router-link tag="span" to="home">一级分类</router-link>&nbsp;&gt;&nbsp;
            <span @click="goHome2">二级分类</span>&nbsp;&nbsp;
            <i v-if="name!=''">“{{name}}”</i>
          </div>
          <!-- <div class="title" v-if="name!=''">“{{name}}”</div> -->
          <div class="condition">
            <div class="itm">
              <div class="name">
                <span>商品分类：</span>
              </div>
              <div class="result">
                <span :class="cond1.id==null?'active':''" @click="nolimit(1)">不限</span>
                <span
                  v-for="(item,index) of  condition.types"
                  :key="index"
                  v-if="index < 6 "
                  :class="cond1.id==item.id?'active':''"
                  data-cond="1"
                  @click="selectCond(1,item)"
                >{{item.name}}</span>
                <span
                  v-for="(item,index) of  condition.types"
                  :key="index"
                  v-if="showmore==1&&index>=6"
                  :class="cond1.id==item.id?'active':''"
                  data-cond="1"
                  @click="selectCond(1,item)"
                >{{item.name}}</span>
                <div
                  class="more"
                  v-if=" condition.types&&condition.types.length>6"
                  @click="showmoreClick(1)"
                >更多</div>
                <div class="close" v-if="showmore==1" @click="closemoreClick()">关闭</div>
              </div>
            </div>
            <div class="itm">
              <div class="name">
                <span>商品品牌：</span>
              </div>
              <div class="result">
                <span :class="cond2.id==null?'active':''" @click="nolimit(2)">不限</span>
                <span
                  v-for="(item,index) of condition.brands"
                  :key="index"
                  v-if="index < 6 "
                  :class="cond2.id==item.id?'active':''"
                  data-cond="2"
                  @click="selectCond(2,item)"
                >{{item.name}}</span>
                <span
                  v-for="(item,index) of condition.brands"
                  :key="index"
                  v-if="showmore==2&&index>=6"
                  :class="cond2.id==item.id?'active':''"
                  data-cond="2"
                  @click="selectCond(2,item)"
                >{{item.name}}</span>
                <div
                  class="more"
                  v-if="condition.brands&&condition.brands.length>6"
                  @click="showmoreClick(2)"
                >更多</div>
                <div class="close" v-if="showmore==2" @click="closemoreClick()">关闭</div>
              </div>
            </div>
            <div class="itm">
              <div class="name">
                <span>新旧：</span>
              </div>
              <div class="result">
                <span :class="cond3.id==null?'active':''" @click="nolimit(3)">不限</span>
                <span
                  v-for="(item,index) of condition.status"
                  :key="index"
                  v-if="index < 6 "
                  :class="cond3.id==item.id?'active':''"
                  data-cond="3"
                  @click="selectCond(3,item)"
                >{{item.name}}</span>
                <span
                  v-for="(item,index) of condition.status"
                  :key="index"
                  v-if="showmore==3&&index>=6"
                  :class="cond3.id==item.id?'active':''"
                  data-cond="3"
                  @click="selectCond(3,item)"
                >{{item.name}}</span>
                <div
                  class="more"
                  v-if="condition.status&&condition.status.length>6"
                  @click="showmoreClick(3)"
                >更多</div>
                <div class="close" v-if="showmore==3" @click="closemoreClick()">关闭</div>
              </div>
            </div>
            <div class="itm">
              <div class="name">
                <span>价格：</span>
              </div>
              <div class="result">
                <span :class="cond4.id==null?'active':''" @click="nolimit(4)">不限</span>
                <span
                  v-for="(item,index) of condition.moneys"
                  :key="index"
                  v-if="index < 6 "
                  :class="cond4.id==item.id?'active':''"
                  data-cond="4"
                  @click="selectCond(4,item)"
                >{{item.name}}</span>
                <span
                  v-for="(item,index) of condition.moneys"
                  :key="index"
                  v-if="showmore==4&&index>=6"
                  :class="cond4.id==item.id?'active':''"
                  data-cond="4"
                  @click="selectCond(4,item)"
                >{{item.name}}</span>
                <div
                  class="more"
                  v-if="condition.moneys&&condition.moneys.length>6"
                  @click="showmoreClick(4)"
                >更多</div>
                <div class="close" v-if="showmore==4" @click="closemoreClick()">关闭</div>
              </div>
            </div>
            <div class="itm">
              <div class="name">
                <span>租赁方式：</span>
              </div>
              <div class="result">
                <span :class="cond5.id==null?'active':''" @click="nolimit(5)">不限</span>
                <span
                  v-for="(item,index) of condition.ways"
                  :key="index"
                  v-if="index < 6 "
                  :class="cond5.id==item.id?'active':''"
                  data-cond="5"
                  @click="selectCond(5,item)"
                >{{item.name}}</span>
                <span
                  v-for="(item,index) of condition.ways"
                  :key="index"
                  v-if="showmore==5&&index>=6"
                  :class="cond5.id==item.id?'active':''"
                  data-cond="5"
                  @click="selectCond(5,item)"
                >{{item.name}}</span>
                <div
                  class="more"
                  v-if="condition.ways&&condition.ways.length>6"
                  @click="showmoreClick(5)"
                >更多</div>
                <div class="close" v-if="showmore==5" @click="closemoreClick()">关闭</div>
              </div>
            </div>
            <div class="itm">
              <div class="name">
                <span>适用人数：</span>
              </div>
              <div class="result">
                <span :class="cond6.id==null?'active':''" @click="nolimit(6)">不限</span>
                <span
                  v-for="(item,index) of condition.peoples"
                  :key="index"
                  v-if="index < 6 "
                  :class="cond6.id==item.id?'active':''"
                  data-cond="6"
                  @click="selectCond(6,item)"
                >{{item.name}}</span>
                <span
                  v-for="(item,index) of condition.peoples"
                  :key="index"
                  v-if="showmore==6&&index>=6"
                  :class="cond6.id==item.id?'active':''"
                  data-cond="6"
                  @click="selectCond(6,item)"
                >{{item.name}}</span>
                <div
                  class="more"
                  v-if="condition.peoples&&condition.peoples.length>6"
                  @click="showmoreClick(6)"
                >更多</div>
                <div class="close" v-if="showmore==6" @click="closemoreClick()">关闭</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods">
        <div class="container box">
          <div class="slide">
            <div class="title">精选商品</div>
            <div
              class="itm"
              v-for="(item,index) of spiritList"
              :key="index"
              v-if="index<4"
              @click="viewDetail(item)"
            >
              <div class="img">
                <img :src="item.img" alt />
              </div>
              <div class="price">￥{{item.money}}</div>
              <div class="des ellipsis2">{{item.name}}</div>
              <div class="num">
                已有
                <span>{{item.number}}</span>人评价
              </div>
            </div>
          </div>
          <div class="list">
            <div class="cond">
              <span :class="cond==1?'active':''" @click="condsort(1)">
                <i>销量</i>
              </span>
              <span :class="cond==2?'active':''" @click="condsort(2)">
                <i>价格</i>
              </span>
              <span :class="cond==3?'active':''" @click="condsort(3)">
                <i>新旧</i>
              </span>
              <span :class="cond==4?'active':''" @click="condsort(4)">
                <i>周期长短</i>
              </span>
            </div>
            <div class="product">
              <div class="itm" v-for="(item,index) of list" :key="index" @click="viewDetail(item)">
                <div class="img">
                  <img :src="item.img" alt />
                </div>
                <div class="price">￥{{item.money}}</div>
                <div class="des ellipsis" :title="item.name">{{item.name}}</div>
                <div class="num">
                  已有
                  <span>{{item.comments}}</span>人评价
                  <span style="float:right;color:#666666;">销量：{{item.salesVolume!=null?item.salesVolume:0}}</span>
                </div>
              </div>
              <div class="noContent" v-if="list.length==0">暂无该分类商品</div>
            </div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size="limit"
              layout="prev, pager, next, jumper"
              :total="count"
              style="margin-top:30px;"
            ></el-pagination>
          </div>
        </div>
      </div>
      <foot-guide></foot-guide>
    </div>
    <div class="mobile" v-if="mobileMode.result">
      <searchm :homeState="homeState" @getKey="searchWordKeyChange" ></searchm>
      <div class="condition_m">
        <div class="itm" :class="cond==1?'active':''" @click="condsort(1)">销量</div>
        <div class="itm" :class="cond==2?'active':''" @click="condsort(2)">价格</div>
        <div class="itm" :class="cond==3?'active':''" @click="condsort(3)">新旧</div>
        <div class="itm" :class="cond==4?'active':''" @click="condsort(4)">周期长短</div>
        <div class="itm" @click="toggleConditionMask">
          <span>筛选</span>
          <img src="/static/icon_m/screen.png" />
        </div>
      </div>
      <div class="wrapper" ref="wrapper" @scroll="gd_add">
        <div class="listItem">
          <div class="itm" v-for="(item,index) of list" :key="index" @click="viewDetail(item)">
            <div class="img">
              <img :src="item.img" />
            </div>
            <div class="info">
              <div class="name ellipsis">{{item.name}}</div>
              <div class="des ellipsis2">{{item.proIntroduction}}</div>
              <div class="price">￥{{item.money}}</div>
              <div class="num">{{item.comments}}条评价&nbsp;&nbsp;销量：{{item.salesVolume!=null?item.salesVolume:0}}</div>
            </div>
          </div>
          <div class="noContent" v-if="list.length==0">暂无该分类商品</div>
        </div>
      </div>
      <div class="listMask" v-if="conditionMask">
        <div class="mask" @click="toggleConditionMask"></div>
        <div class="container">
          <div class="title">商品分类</div>
          <div class="box">
            <div class="itm" :class="cond1.id==item.id?'active':''" v-for="(item,index) of condition.types" :key="index" @click="selectCond(1,item)">
              <span>{{item.name}}</span>
            </div>
          </div>
          <div class="title">商品品牌</div>
          <div class="box">
            <div class="itm" :class="cond2.id==item.id?'active':''" v-for="(item,index) of condition.brands" :key="index" @click="selectCond(2,item)">
              <span>{{item.name}}</span></div>
          </div>
          <div class="title">新旧</div>
          <div class="box">
            <div class="itm"  :class="cond3.id==item.id?'active':''" v-for="(item,index) of condition.status" :key="index" @click="selectCond(3,item)">
              <span>{{item.name}}</span></div>
          </div>
          <div class="title">价格</div>
          <div class="box">
            <div class="itm"  :class="cond4.id==item.id?'active':''" v-for="(item,index) of condition.moneys" :key="index" @click="selectCond(4,item)">
              <span>{{item.name}}</span></div>
          </div>
          <div class="title">租赁方式</div>
          <div class="box">
            <div class="itm"  :class="cond5.id==item.id?'active':''" v-for="(item,index) of condition.ways" :key="index" @click="selectCond(5,item)">
              <span>{{item.name}}</span></div>
          </div>
          <div class="title">适用人数</div>
          <div class="box">
            <div class="itm"   :class="cond6.id==item.id?'active':''" v-for="(item,index) of condition.peoples" :key="index" @click="selectCond(6,item)">
              <span>{{item.name}}</span></div>
          </div>
          <div class="btn">
            <div class="cancle" @click="resetSelect">重置</div>
            <div class="sure" @click="hideMask">确认</div>
          </div>
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
import searchm from "@/components/mobile/search";
import shoppingcart from "@/components/shopping/shoppingcart";
import {
  mt_getGoodsAttr,
  mt_getGoodsByCondition,
  mt_getGoodsBySelected,
  mt_selectFirstMenu
} from "@/api/home";

export default {
  name: "list",
  components: {
    headTop,
    footGuide,
    search,
    searchm,
    shoppingcart
  },
  data() {
    return {
      name: "", //搜索的名字
      menuId: "", //目录id
      money: "", //搜索的价格

      condition: {},
      showmore: 0,

      cond1: "", //分类
      cond2: "", //品牌
      cond3: "", //新旧
      cond4: "", //价格
      cond5: "", //租赁方式
      cond6: "", //适用人数
      cond: 1, //销量1 价格2  新旧3  周期长短4

      spiritList: [],
      list: [],

      page: 1,
      limit: 16,
      count: 0,
      homeState: true, //显示home图标
      conditionMask: false, //筛选弹窗是否显示
      scrollBottom: false,
    };
  },
  computed: {
    ...mapState(["userInfo", "mobileMode"])
  },
  created() {
    // //console.log(this.$route.params)
    this.name =
      this.$route.params.name != undefined && this.$route.params.name != null
        ? this.$route.params.name
        : "";
    this.menuId =
      this.$route.params.menuId != undefined &&
      this.$route.params.menuId != null
        ? this.$route.params.menuId
        : "";
    this.getGoodsAttr();
    this.getRecommend();

    // pc端额外请求以下接口
    if (!this.mobileMode.result) {
    }
  },
  mounted() {
    //获取用户信息
  },
  watch: {
    cond1(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page = 1;
        this.getList();
      }
    },
    cond2(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page = 1;
        this.getList();
      }
    },
    cond3(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page = 1;
        this.getList();
      }
    },
    cond4(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page = 1;
        this.getList();
      }
    },
    cond5(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page = 1;
        this.getList();
      }
    },
    cond6(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page = 1;
        this.getList();
      }
    },
    cond(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page = 1;
        this.getList();
      }
    }
  },
  methods: {
    //移动端 更多筛选条件显示隐藏
    toggleConditionMask() {
      this.conditionMask = !this.conditionMask;
    },
    hideMask(){
      this.conditionMask = false
    },
    //重置选项
    resetSelect(){
      this.conditionMask = false
      this.cond1= "" //分类
      this.cond2= "" //品牌
      this.cond3= "" //新旧
      this.cond4= "" //价格
      this.cond5= "" //租赁方式
      this.cond6= "" //适用人数
    },
    //获取商品分类
    getGoodsAttr() {
      let that = this;
      mt_getGoodsAttr().then(data => {
        // //console.log(data.data);
        data.data.moneys.forEach(item => {
          item.name = item.moneyBegin + "-" + item.moenyEnd + "元";
        });
        that.condition = data.data;
        //获取搜索数据
        that.getList();
      });
    },
    //获取精选商品
    getRecommend() {
      let that = this;
      mt_getGoodsBySelected().then(data => {
        // //console.log(data.data)
        that.spiritList = data.data;
      });
    },
    //选择条件
    selectCond(num, val) {
      if (num == 1) {
        this.cond1 = val;
      } else if (num == 2) {
        this.cond2 = val;
      } else if (num == 3) {
        this.cond3 = val;
      } else if (num == 4) {
        this.cond4 = val;
      } else if (num == 5) {
        this.cond5 = val;
      } else if (num == 6) {
        this.cond6 = val;
      }
    },
    //选择不限
    nolimit(num) {
      if (num == 1) {
        this.cond1 = "";
      } else if (num == 2) {
        this.cond2 = "";
      } else if (num == 3) {
        this.cond3 = "";
      } else if (num == 4) {
        this.cond4 = "";
      } else if (num == 5) {
        this.cond5 = "";
      } else if (num == 6) {
        this.cond6 = "";
      }
    },
    //显示更多
    showmoreClick(val) {
      this.showmore = val;
    },
    // 关闭显示更多
    closemoreClick() {
      this.showmore = 0;
    },
    //排序
    condsort(val) {
      this.cond = val;
    },
    //加载更多商品
    gd_add() {
      let wrap_height = document.getElementsByClassName("wrapper")[0]
        .offsetHeight; //容器的高度
      let scroll_top = document.getElementsByClassName("wrapper")[0].scrollTop; //滚动条的scrolltop
      let scroll_height = document.getElementsByClassName("listItem")[0]
        .offsetHeight; //内容的高度
      let is_height = scroll_height - wrap_height - scroll_top;
      if (is_height <0.1 && this.count > this.list.length) {
        if(!this.scrollBottom){
           this.page++;
           this.getList();
           this.scrollBottom = true
        }
      }
    },
    //查询商品信息
    getList() {
      let that = this;
      let id1 =
        that.cond1.id != null && that.cond1.id != undefined
          ? that.cond1.id
          : "";
      let id2 =
        that.cond2.id != null && that.cond2.id != undefined
          ? that.cond2.id
          : "";
      let id3 =
        that.cond3.id != null && that.cond3.id != undefined
          ? that.cond3.id
          : "";
      let id4 =
        that.cond4.id != null && that.cond4.id != undefined
          ? that.cond4.id
          : "";
      let id5 =
        that.cond5.id != null && that.cond5.id != undefined
          ? that.cond5.id
          : "";
      let id6 =
        that.cond6.id != null && that.cond6.id != undefined
          ? that.cond6.id
          : "";
      mt_getGoodsByCondition(
        id1,
        id2,
        id3,
        id4,
        id5,
        id6,
        that.name,
        that.menuId,
        that.money,
        that.cond,
        that.page,
        that.limit
      ).then(data => {
        // console.log(data.data);
        if(!that.mobileMode.result){
          that.list = data.data.data;
        }else{
          that.list = that.list.concat(data.data.data)
        }
        //console.log(that.page)
        that.count = data.data.count;
        that.scrollBottom = false
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
    //搜索
    searchWordKeyChange(val) {
      // console.log(val);
      this.page = 1
      this.list = []
      this.name = val;
      this.getList();
    },
    //查看详情
    viewDetail(value) {
      // //console.log(value);
      this.$router.push("/goodsdetail/" + value.id);
    },
    //前往二级
    goHome2() {
      if (localStorage.getItem("home2") != null) {
        let menuId = JSON.parse(localStorage.getItem("home2")).id;
        this.$router.push("/home2/" + menuId);
      } else {
        mt_selectFirstMenu().then(data => {
          localStorage.setItem("home2", JSON.stringify(data.data[0]));
          this.$router.push("/home2/" + data.data[0].id);
        });
      }
    },
    
  },
  updated() {

  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.pc {
  .noContent {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
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
        i {
          display: inline-block;
          font-style: normal;
          color: #666666;
        }
      }
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
                text-decoration: underline;
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
    padding: 20px 0;
    .box {
      display: flex;
      .slide {
        flex: 190px 0 0;
        border: 1px solid #dddddd;
        .title {
          padding: 0 15px;
          font-size: 16px;
          line-height: 42px;
          color: #333333;
          font-weight: bold;
        }
        .itm {
          padding: 15px 10px;
          &:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 5px rgba(200, 200, 200, 0.4);
          }
          .img {
            width: 170px;
            height: 170px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .price {
            font-size: 14px;
            line-height: 14px;
            margin-top: 13px;
            color: $mainColor;
            font-weight: bold;
          }
          .des {
            margin-top: 14px;
            font-size: 12px;
            line-height: 18px;
            color: #666666;
          }
          .num {
            margin-top: 15px;
            font-size: 12px;
            line-height: 12px;
            color: #666666;
            span {
              color: #3573d8;
            }
          }
        }
      }
      .list {
        flex: 1;
        margin-left: 10px;
        .cond {
          padding: 6px;
          overflow: hidden;
          span {
            float: left;
            height: 28px;
            padding: 0 10px;
            border-top: 1px solid #dddddd;
            border-bottom: 1px solid #dddddd;
            border-right: 1px solid #dddddd;
            &:first-child {
              border-left: 1px solid #dddddd;
            }
            cursor: pointer;
            i {
              display: inline-block;
              height: 28px;
              line-height: 28px;
              padding-right: 12px;
              font-size: 12px;
              font-style: normal;
              color: #666666;
              background: url(/static/icon/black_jiantou.png) no-repeat right
                center;
            }
            &.active {
              background-color: $mainColor;
              border: 1px solid $mainColor;
              i {
                color: #ffffff;
                background: url(/static/icon/white_jiantou.png) no-repeat right
                  center;
              }
            }
          }
        }
        .product {
          min-height: 1140px;
          overflow: hidden;
          .itm {
            float: left;
            width: 25%;
            padding: 15px 10px;
            &:hover {
              cursor: pointer;
              .des {
                color: $mainColor;
                text-decoration: underline;
              }
            }
            .img {
              width: 170px;
              height: 170px;
              line-height: 170px;
              img {
                max-width: 100%;
                max-height: 100%;
                vertical-align: middle;
              }
            }
            .price {
              font-size: 14px;
              line-height: 14px;
              margin-top: 13px;
              color: $mainColor;
              font-weight: bold;
            }
            .des {
              margin-top: 14px;
              font-size: 12px;
              line-height: 18px;
              color: #666666;
            }
            .num {
              margin-top: 15px;
              font-size: 12px;
              line-height: 12px;
              color: #666666;
              span {
                color: #3573d8;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .mobile {
    background-color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    .noContent {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .condition_m {
      position: fixed;
      left: 0;
      top: 44px;
      z-index: 2;
      width: 100%;
      display: flex;
      border-bottom: 1px solid #f1f1f1;
      background-color: #ffffff;
      .itm {
        flex: 1;
        padding: 8px 0;
        line-height: 12px;
        font-size: 12px;
        text-align: center;
        color: #666;
      }
      .itm.active {
        color: #f08200;
      }
      .itm span {
        display: inline-block;
        line-height: 12px;
        font-size: 12px;
      }
      .itm img {
        display: inline-block;
        width: 13px;
        height: 13px;
        margin-left: 2px;
        vertical-align: middle;
      }
    }
    
    .wrapper {
      position: fixed;
      top: 88px;
      bottom: 0;
      z-index: 2;
      width: 100%;
      overflow: scroll;
      .listItem {
        .itm {
          display: flex;
          padding: 5px 0 5px 10px;
          &:first-child {
            padding-top: 10px;
          }
          .img {
            flex: 120px 0 0;
            width: 120px;
            height: 120px;
          }

          .img img {
            max-height: 100%;
            max-width: 100%;
          }

          .info {
            flex: 1;
            padding: 0 10px;
          }
          .info .name {
            font-size: 14px;
            line-height: 14px;
            height: 14px;
            color: #333;
            overflow: hidden;
          }
          .info .des {
            margin-top: 8px;
            font-size: 12px;
            line-height: 16px;
            color: #999999;
            min-height: 32px;
          }

          .info .size {
            margin-top: 3px;
            height: 15px;
          }

          .info .size span {
            float: left;
            margin-right: 5px;
            padding: 0 5px;
            border-radius: 1px;
            font-size: 10px;
            height: 15px;
            line-height: 15px;
            color: #999;
            background-color: #f2f2f7;
          }

          .info .price {
            margin-top: 9px;
            font-size: 18px;
            font-weight: 400;
            color: #e93b3d;
          }

          .info .num {
            font-size: 12px;
            line-height: 1.2;
            color: #999;
          }
        }
      }
    }


    .listMask {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 99;
      animation: DSMask 0.4s cubic-bezier(0.215, 0.610, 0.355, 1.000);
      overflow: hidden;
    }

    .listMask .mask {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 99;
      background-color: rgba(0, 0, 0, 0.7);
      animation: DSContentBox 0.4s cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }

    .listMask .container {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      padding-bottom: 50px;
      background-color: #f7f7f7;
      border-top: 1px solid #f1f1f1;
      overflow-y: scroll;
      overflow-x: hidden;
    }

    .listMask .container .title {
      padding: 10px;
      line-height: 15px;
      font-size: 15px;
      color: #333;
      background-color: #fff;
      border-bottom: 1px solid #f1f1f1;
    }

    .listMask .container .box {
      margin-bottom: 10px;
      padding: 10px 0 0 10px;
      background-color: #fff;
      overflow: hidden;
      text-align: center;
    }

    .listMask .container .box .itm {
      float: left;
      width: 33.3%;
      padding-right: 10px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .listMask .container .box .itm span {
      position: relative;
      display: block;
      padding: 0 5px;
      font-size: 12px;
      color: #666;
      background-color: #f7f7f7;
      border-radius: 4px;
    }

    .listMask .container .box .itm.active span {
      background-color: #fdf0f0;
      color: #e93b3d;
    }

    .listMask .container .btn {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
      border-top: 1px solid #f1f1f1;
      background-color: #fff;
    }

    .listMask .container .btn div {
      float: left;
      width: 50%;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      color: #333;
    }

    .listMask .container .btn .sure {
      background-color: #f08200;
      color: #fff;
    }

    @keyframes DSMask {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    @keyframes DSContentBox {
      0% {
        opacity: 0;
        transform: translate(-150px, 0, 0);
      }

      100% {
        opacity: 1;
        transform: translate(0px, 0, 0);
      }
    }


    
  }
}
</style>

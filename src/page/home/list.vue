<template>
  <div>
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
        <!-- <span class="nav active">企业特购</span>
        <span class="nav">热门服务</span>
        <span class="nav">超值套餐</span>
        <span class="nav">关于我们</span>
        <span class="nav">合作伙伴</span> -->
      </div>
    </div>
    <div class="type">
      <div class="container box">
        <div class="title" v-if="name!=''">“{{name}}”</div>
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
              <div class="more" v-if=" condition.types&&condition.types.length>6" @click="showmoreClick(1)">更多</div>
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
              <div class="more" v-if="condition.brands&&condition.brands.length>6" @click="showmoreClick(2)">更多</div>
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
              <div class="more" v-if="condition.status&&condition.status.length>6" @click="showmoreClick(3)">更多</div>
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
              <div class="more" v-if="condition.moneys&&condition.moneys.length>6" @click="showmoreClick(4)">更多</div>
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
              <div class="more" v-if="condition.ways&&condition.ways.length>6" @click="showmoreClick(5)">更多</div>
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
              <div class="more" v-if="condition.peoples&&condition.peoples.length>6" @click="showmoreClick(6)">更多</div>
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
            <div class="itm" v-for="(item,index) of spiritList" :key="index" v-if="index<4" @click="viewDetail(item)">
              <div class="img"><img :src="item.img" alt=""></div>
              <div class="price">￥{{item.money}}</div>
              <div class="des ellipsis2">{{item.name}}</div>
              <div class="num">已有<span>{{item.number}}</span>人评价</div>
            </div>
        </div>
        <div class="list">
          <div class="cond">
            <span :class="cond==1?'active':''" @click="condsort(1)"><i>销量</i></span>
            <span :class="cond==2?'active':''" @click="condsort(2)"><i>价格</i></span>
            <span :class="cond==3?'active':''" @click="condsort(3)"><i>新旧</i></span>
            <span :class="cond==4?'active':''" @click="condsort(4)"><i>周期长短</i></span>
          </div>
          <div class="product">
            <div class="itm" v-for="(item,index) of list" :key="index" @click="viewDetail(item)">
              <div class="img"><img :src="item.img" alt=""></div>
              <div class="price">￥{{item.money}}</div>
              <div class="des ellipsis2">{{item.name}}</div>
              <div class="num">已有<span>{{item.comments}}</span>人评价</div>
            </div>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="limit"
            layout="prev, pager, next, jumper"
            :total="count">
          </el-pagination>
        </div>
      </div>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex"
import headTop from "@/components/header/head"
import footGuide from "@/components/footer/footGuide"
import search from "@/components/search/search"
import shoppingcart from "@/components/shopping/shoppingcart"
import { mt_getGoodsAttr, mt_getGoodsByCondition, mt_getGoodsBySelected } from "@/api/home"
export default {
  name: "list",
  components: {
    headTop,
    footGuide,
    search,
    shoppingcart
  },
  data() {
    return {

      name: "",    //搜索的名字
      menuId: '',   //目录id
      money: '',  //搜索的价格

      condition: {},
      showmore: 0,

      cond1: '',   //分类
      cond2: '',    //品牌
      cond3: '',   //新旧
      cond4: '',   //价格
      cond5: '',   //租赁方式
      cond6: '',   //适用人数
      cond: 1,    //销量1 价格2  新旧3  周期长短4

      spiritList: [],
      list: [],

      page: 1,
      limit: 16,
      count: 0,

    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {
    // console.log(this.$route.params)
    this.name = this.$route.params.name != undefined&&this.$route.params.name != null ? this.$route.params.name : ''
    this.menuId = this.$route.params.menuId != undefined&&this.$route.params.menuId != null ? this.$route.params.menuId : ''
    this.getGoodsAttr()
    this.getRecommend()
  },
  mounted() {
    //获取用户信息
  },
  watch:{
    cond1(newVal,oldVal){
      if(newVal!=oldVal){
        this.page = 1
        this.getList()
      }
    },
    cond2(newVal,oldVal){
      if(newVal!=oldVal){
        this.page = 1
        this.getList()
      }
    },
    cond3(newVal,oldVal){
      if(newVal!=oldVal){
        this.page = 1
        this.getList()
      }
    },
    cond4(newVal,oldVal){
      if(newVal!=oldVal){
        this.page = 1
        this.getList()
      }
    },
    cond5(newVal,oldVal){
      if(newVal!=oldVal){
        this.page = 1
       this.getList()
      }
    },
    cond6(newVal,oldVal){
      if(newVal!=oldVal){
        this.page = 1
       this.getList()
      }
    },
    cond(newVal,oldVal){
      if(newVal!=oldVal){
        this.page = 1
        this.getList()
      }
    },
  },
  methods: {
    //获取商品分类
    getGoodsAttr(){
      let that = this
      mt_getGoodsAttr().then(data=>{
        console.log(data.data)
        data.data.moneys.forEach(item=>{
          item.name = item.moneyBegin+'-'+ item.moenyEnd+'元'
        })
        that.condition = data.data
        //获取搜索数据
        that.getList()
      })
    },
    //获取精选商品
    getRecommend(){
      let that = this
      mt_getGoodsBySelected().then(data=>{
        // console.log(data.data)
        that.spiritList = data.data
      })
    },
    //选择条件
    selectCond(num, val) {
      if (num == 1) {
        this.cond1 = val;
      }else if (num == 2) {
        this.cond2 = val;
      }else if (num == 3) {
        this.cond3 = val;
      }else if (num == 4) {
        this.cond4 = val;
      }else if (num == 5) {
        this.cond5 = val;
      }else if (num == 6) {
        this.cond6 = val;
      }
    },
    //选择不限
    nolimit(num){
      if (num == 1) {
        this.cond1 = ''
      }else if (num == 2) {
        this.cond2 = ''
      }else if (num == 3) {
        this.cond3 = ''
      }else if (num == 4) {
        this.cond4 = ''
      }else if (num == 5) {
        this.cond5 = ''
      }else if (num == 6) {
        this.cond6 = ''
      }
    },
    //显示更多
    showmoreClick(val) {
      this.showmore = val;
    },
    // 关闭显示更多
    closemoreClick(){
        this.showmore = 0
    },
    //排序
    condsort(val){
      this.cond = val
    },
    //查询商品信息
    getList(){
      let that = this
      let id1 = that.cond1.id != null &&that.cond1.id != undefined ? that.cond1.id: ''
      let id2 = that.cond2.id != null &&that.cond2.id != undefined ? that.cond2.id: ''
      let id3 = that.cond3.id != null &&that.cond3.id != undefined ? that.cond3.id: ''
      let id4 = that.cond4.id != null &&that.cond4.id != undefined ? that.cond4.id: ''
      let id5 = that.cond5.id != null &&that.cond5.id != undefined ? that.cond5.id: ''
      let id6 = that.cond6.id != null &&that.cond6.id != undefined ? that.cond6.id: ''
      mt_getGoodsByCondition(id1,id2,id3,id4,id5,id6,that.name,that.menuId,that.money,that.cond,that.page,that.limit).then(data=>{
        // console.log(data.data)
        that.list = data.data.data
        that.count = data.data.count
      })
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList()
    },
    //搜索
    searchWordKeyChange(val){
      console.log(val)
      this.name = val
      this.getList()
    },
    //查看详情
    viewDetail(value){
      console.log(value)
      this.$router.push('/goodsdetail/'+value.id)
    },
  },
  updated(){

  },
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
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
              text-decoration: underline;
              color: $mainColor;
              cursor: pointer;
            }
          }
          .close{
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
.goods{
  background-color: #ffffff;
  padding: 20px 0;
  .box{
    display: flex;
    .slide{
      flex: 190px 0 0;
      border: 1px solid #dddddd;
      .title{
        padding: 0 15px;
        font-size: 16px;
        line-height: 42px;
        color: #333333;
        font-weight: bold;
      }
      .itm{
        padding:  15px 10px;
        &:hover{
          cursor: pointer;
          box-shadow: 0px 0px 10px 5px rgba(200,200,200,0.4);
        }
        .img{
          width: 170px;
          height: 170px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .price{
          font-size: 14px;
          line-height: 14px;
          margin-top: 13px;
          color: $mainColor;
          font-weight: bold;
        }
        .des{
          margin-top: 14px;
          font-size: 12px;
          line-height: 18px;
          color: #666666;
        }
        .num{
          margin-top: 15px;
          font-size: 12px;
          line-height: 12px;
          color: #666666;
          span{
            color: #3573d8;
          }
        }
      }
    }
    .list{
      flex: 1;
      margin-left: 10px;
      .cond{
        padding: 6px;
        overflow: hidden;
        span{
          float: left;
          height: 28px;
          padding: 0 10px;
          border-top: 1px solid #dddddd;
          border-bottom: 1px solid #dddddd;
          border-right: 1px solid #dddddd;
          &:first-child{
            border-left: 1px solid #dddddd;
          }
          cursor: pointer;
          i{
            display: inline-block;
            height: 28px;
            line-height: 28px;
            padding-right: 12px;
            font-size: 12px;
            font-style: normal;
            color: #666666;
            background: url(/static/icon/black_jiantou.png) no-repeat right center;
          }
          &.active{
            background-color: $mainColor;
            border: 1px solid $mainColor;
            i{
              color: #ffffff;
              background: url(/static/icon/white_jiantou.png) no-repeat right center;
            }
          }
        }      
      }
      .product{
        min-height: 1140px;
        overflow: hidden;
        .itm{
          float: left;
          width: 25%;
          padding:  15px 10px;
          &:hover{
            cursor: pointer;
            .des{
              color: $mainColor;
              text-decoration: underline;
            }
          }
          .img{
            width: 170px;
            height: 170px;
            line-height: 170px;
            img{
              max-width: 100%;
              max-height: 100%;
              vertical-align: middle;
            }
          }
          .price{
            font-size: 14px;
            line-height: 14px;
            margin-top: 13px;
            color: $mainColor;
            font-weight: bold;
          }
          .des{
            margin-top: 14px;
            font-size: 12px;
            line-height: 18px;
            color: #666666;
          }
          .num{
            margin-top: 15px;
            font-size: 12px;
            line-height: 12px;
            color: #666666;
            span{
              color: #3573d8;
            }
          }
        }
      }
    }
  }
}
</style>

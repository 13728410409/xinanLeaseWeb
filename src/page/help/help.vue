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
          <span class="nav active">信安帮助中心</span>
        </div>
      </div>
    </div>
    <div class="search">
      <div class="container box">
        <div class="inp">
          <input type="text" placeholder="请输入内容" v-model="searchKey" >
          <span @click="search">搜索</span>
        </div>
      </div>
    </div>
    <div class="help">
      <div class="container box">
        <div class="aslide">
          <div class="title">常见问题</div>
          <el-collapse v-model="activeNames" @change="handleChange" style="padding-left:20px;">
            <el-collapse-item
              :title="item.name"
              :name="index+1"
              v-for="(item,index) of list"
              :key="index">
              <div
                v-for="(items,indexs) of item.list"
                :key="indexs"
                class="itm"
                :class="currentWord == items.name?'active':''"
                @click="selItm(items.id,items.name)"
              >{{items.name}}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="main">
          <div class="title">关于<span>{{currentWord}}</span>问题</div>
          <div class="cont" v-html="currentCont"></div>
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
import { mt_questionselectAll } from "@/api/common";
export default {
  components: {
    headTop,
    footGuide
  },
  data() {
    return {
      list: [
        {
          name: "租赁指南",
          list: [
            {
              id: "1",
              name: "租赁流程",
              cont: "信安租赁是线上付租金押金，平台发货给用户1"
            },
            {
              id: "2",
              name: "常见问题",
              cont: "信安租赁是线上付租金押金，平台发货给用户2"
            },
            {
              id: "3",
              name: "开票说明",
              cont: "信安租赁是线上付租金押金，平台发货给用户3"
            }
          ]
        },
        {
          name: "配送方式",
          list: [
            {
              id: "4",
              name: "物流信息",
              cont: "信安租赁是线上付租金押金，平台发货给用户4"
            },
            {
              id: "5",
              name: "配送服务",
              cont: "信安租赁是线上付租金押金，平台发货给用户5"
            }
          ]
        },
        {
          name: "关于我们",
          list: [
            {
              id: "6",
              name: "企业概况",
              cont: "信安租赁是线上付租金押金，平台发货给用户8"
            },
            {
              id: "7",
              name: "公司地址",
              cont: "信安租赁是线上付租金押金，平台发货给用户9"
            },
            {
              id: "8",
              name: "服务网点",
              cont: "信安租赁是线上付租金押金，平台发货给用户10"
            },
            {
              id: "9",
              name: "加入我们",
              cont: "信安租赁是线上付租金押金，平台发货给用户11"
            }
          ]
        }
      ],

      activeNames: [1,2,3,4],   //默认打开第一个
      currentWord: '',  //标题
      currentCont: '',  //内容

      type: 1,
      searchKey: '', //搜索关键字
    };
  },
  watch: {},
  filters: {},
  created() {
    // console.log(this.$route.params)
    if(this.$route.params.type!=''&&this.$route.params.type!=null&&this.$route.params.type!=undefined){
      this.getData(this.$route.params.type,this.$route.params.name)
    }else{
      this.currentWord = this.list[0].list[0].name;
      this.currentCont = this.list[0].list[0].cont;
      this.getData(this.type,this.currentWord)
    }
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    search(){
      this.getData()
    },
    selItm(id,name) {
      if(this.currentWord!=name){
        this.getData(id,name)
      }
    },
    getData(type,name){
      let that = this;
      mt_questionselectAll(type,that.searchKey).then(data => {
        // console.log(data)
        this.currentWord = name
        if(data.data.data.length>0){
          this.currentCont = data.data.data[0].content
        }else{
          this.currentCont = '暂无数据'
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.search{
  .box{
    padding: 0 300px;
    .inp{
      display: flex;
      margin: 30px 0;
      
      input{
        flex: 1;
        display: inline-block;
        line-height: 50px;
        padding: 0 20px;
        border: 1px solid #dddddd;
        border-right: none;
        outline-style: none;
      }
      span{
        flex: 100px 0 0;
        width: 100px;
        line-height: 50px;
        text-align: center;
        background-color: $mainColor;
        font-size: 14px;
        color: #ffffff;
        &:hover{
          cursor: pointer;
          background-color: $mainHoverColor;
        }
      }
    }
  }
}
.help {
  .box {
    display: flex;
    padding-bottom: 30px;
    .aslide {
      flex: 210px 0 0;
      width: 210px;
      background-color: #ffffff;
      border: 1px solid #f1f1f1;
      .title{
        background-color: #eaeaea;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        padding-left: 20px;
      }
      .itm {
        font-size: 12px;
        line-height: 30px;
        &:hover,
        &.active {
          cursor: pointer;
          color: $mainColor;
          text-decoration: underline;
        }
      }
    }
    .main {
      flex: 1;
      margin-left: 20px;
      background-color: #ffffff;
      .title{
        background-color: #eaeaea;
        font-size: 14px;
        color: #666666;
        padding-left: 20px;
        line-height: 40px;
        span{
          margin: 0 5px;
          color: $mainColor;
        }
      }
      .cont{
        padding: 20px;
        font-size: 14px;
        color: #666666;
      }
    }
  }
}
</style>

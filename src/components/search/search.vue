<template>
  <div class='search'>
    <div class="input">
      <span class="search-img"></span>
      <input class="inputarea" type="text" v-model="wordkey" placeholder="请输入你要租赁的设备" @keyup.enter="search">
      <span class="search-btn" title="点击搜索" @click="search">搜索</span>
    </div>
    <div class="history">
      <span v-if="history.length > 0" v-for="(item,index) of history" :key="index" @click="seclectSearch(item)">{{item}}</span>
      <span v-if="history.length ==0" v-for="(item,index) of hotSearch" :key="index" @click="seclectSearch(item)">{{item}}</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    name: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      wordkey: '', 
      history: [],
      hotSearch: ['服务器', '电脑配件', '打印机', '投影仪'],
    };
  },
  watch: {
    name(val) {
      this.wordkey = val
      //console.log(val)
    },
  },
  created(){
    this.history = JSON.parse(localStorage.getItem('historySearch'))!=null ? JSON.parse(localStorage.getItem('historySearch')) : []
  },
  mounted() {
    //获取用户信息
  },
  computed: {   
    ...mapState(['userInfo'])
  },
  methods: {
    //点击搜索
    search(){
      if(this.wordkey!=''){
        //添加新搜索记录，置定在最前方
        if(this.history.includes(this.wordkey)){
          // 删除重复的历史搜索记录
          this.history.splice(this.history.findIndex(item => item === this.wordkey), 1)
        }
        //新增历史搜索记录
        this.history.unshift(this.wordkey)
        localStorage.setItem('historySearch',JSON.stringify(this.history))
      }
      if(this.$route.name=='list'){
        this.$emit('search',this.wordkey)
      }else{
        this.$router.push({ name:'list', params:{ name : this.wordkey, menuId: ''  } })
      }
    },
    seclectSearch(val){
      this.wordkey = val
      this.search()
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.search {
  width: 600px;
  position: relative;
  .input{
    display: flex;
    height: 40px;
    border: 3px solid $mainColor;
    .search-img{
      flex: 35px 0 0;
      background: url(/static/icon/search.png) no-repeat center center;
    }
    .inputarea{
      flex: 1;
      outline: none;
      font-size: 12px;
      color: #333333;
    }
    .search-btn{
      flex: 0 0 78px;
      line-height: 34px;
      text-align: center;
      background-color: $mainColor;
      color: #ffffff;
      font-size: 14px;
      letter-spacing: 2px;
      &:hover{
        cursor: pointer;
        background-color: $mainHoverColor;
      }
    }
  }
  .history{
    margin-top: 6px;
    span{
      margin-left: 10px;
      padding-right: 10px;
      font-size: 12px;
      color: #999999;
      border-right: 1px solid #999999;
      &:first-child{
        margin-left: 0;
      }
      &:last-child{
        border-right: none;
      }
      &:hover{
        cursor: pointer;
        color: $mainColor;
        text-decoration: underline;
      }
    }
  }
  .list{
    position: absolute;
    top: 40px;
    left: 0;
    z-index: 99;
    width: 600px;
    background-color: #ffffff;
    border: 1px solid #eaeaea;
    li{
      padding-left: 10px;
      font-size: 12px;
      color: #666666;
      line-height: 24px;
      &:hover{
        color: $mainColor;
        background-color: rgb(245,245,245);
      }
    }
    // box-shadow: 0px 0px 20px 5px rgba(200,200,200,0.4);
  }
}
</style>

<template>
  <div>
    <head-top></head-top>
    <account-head></account-head>
    <div class="news">
      <div class="container box">
        <div class="ownlist">
          <div class="aslide">
            <div class="itm tit">消息中心</div>
            <div class="itm" :class="type==2?'active':''" @click="selectNType(2)">
              <el-badge v-if="newsInfo && newsInfo.myCount!=0" :value="newsInfo.myCount" class="item tx" style="height:20px;line-height:20px;">我的消息</el-badge>
              <span class="tx" v-else>我的消息</span>
            </div>
            <div class="itm" :class="type==3?'active':''" @click="selectNType(3)">
              <el-badge v-if="newsInfo && newsInfo.sysCount!=0" :value="newsInfo.sysCount" class="item tx" style="height:20px;line-height:20px;">系统消息</el-badge>
              <span class="tx" v-else>系统消息</span>
            </div>
          </div>
          <div class="main">
            <div class="titleName">
              {{type | filterType}}
              <el-button
                v-if="!allReaded"
                size="mini"
                round
                @click="setAllReaded"
                title="点击标记全部为已读"
              >标记全部已读</el-button>
            </div>
            <div class="list">
              <div
                class="itm"
                :class="item.state==1?'isread':''"
                v-for="(item,index) of list"
                :key="index"
                v-if="list.length>0"
              >
                <div class="time">{{item.time}}</div>
                <div class="val">
                  <div class="top">
                    {{item.title}}
                    <!-- <i class="el-icon-close" @click="del(item,index)"></i> -->
                    <el-button
                      v-if="item.state==0"
                      size="mini"
                      round
                      @click="setReaded(item,index)"
                    >标记为已读</el-button>
                  </div>
                  <div class="cont">{{item.content}}</div>
                </div>
              </div>
              <div class="nodata" v-if="list.length==0">暂无消息</div>
            </div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="limit"
              layout="total, prev, pager, next, jumper"
              :total="count"
              style="text-align:right;padding:0 20px;"
            ></el-pagination>
          </div>
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
import accountHead from "@/components/accountHead/accountHead";
import { mt_getMsg, mt_alreadyRead, mt_readAll } from "@/api/news";
import { formatDate } from '@/config/often'
export default {
  name: "news",
  components: {
    headTop,
    footGuide,
    accountHead
  },
  data() {
    return {
      type: 2, //2我的消息  3系统消息
      allReaded: false,
      list: [],
      page: 1,
      limit: 10,
      count: "",
    };
  },
  watch: {
    type(newVal, oldVal) {
      this.page = 1
      this.getData();
    }
  },
  filters: {
    filterType(value) {
      if (value == 2) {
        return "我的消息";
      } else if (value == 3) {
        return "系统消息";
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo", "newsInfo"])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setNewsInfo"]),
    //选择消息类型
    selectNType(val) {
      if (this.type != val) {
        this.type = val;
      }
    },
    //获取消息
    getData() {
      let that = this;
      mt_getMsg(that.type, that.page, that.limit).then(data => {
        // console.log(data.data.data);
        data.data.data.forEach(item=>{
          item.time = formatDate(item.createTime,'yyyy-MM-dd hh:mm')
        })
        this.list = data.data.data
        this.count = data.data.count
        
      });
    },
    //标记为已读
    setReaded(value, index) {
      let that = this;
      mt_alreadyRead(value.id).then(data => {
        // console.log(data.data);
        that.list[index].state = 1;
        let arr = {};
          if(that.type==2){
            arr.myCount = that.newsInfo.myCount - 1
            arr.sysCount = that.newsInfo.sysCount 
          }else if(that.type==3){ 
            arr.myCount = that.newsInfo.myCount
            arr.sysCount = that.newsInfo.sysCount - 1
          }
          console.log(arr);
          that.setNewsInfo(arr);
      });
    },
    //标记全部已读
    setAllReaded() {
      let that = this;
      mt_readAll().then(data => {
        console.log(data);
        that.list.forEach(item => {
          item.state = 1;
        });
        let arr = {};
        arr.myCount = 0
        arr.sysCount = 0
        console.log(arr);
        that.setNewsInfo(arr);
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
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
.el-button--primary {
  background-color: $mainColor !important;
  border-color: $mainColor !important;
}
.el-button--primary:hover {
  background-color: $mainHoverColor !important;
  border-color: $mainHoverColor !important;
}
.news {
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
            .tx{
              color: $mainColor;
            cursor: pointer;
            }
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
        margin-left: 20px;
        background-color: #ffffff;
        .titleName {
          line-height: 28px;
          padding: 11px 20px;
          border-bottom: 10px solid #f6f6f6;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
          button {
            float: right;
          }
        }
        .list {
          min-height: 560px;
          padding: 20px;
          .nodata {
            font-size: 14px;
            color: #999999;
            text-align: center;
            line-height: 40px;
          }
          .itm {
            margin-bottom: 20px;
            &:last-child {
              margin-bottom: none;
            }
            .time {
              font-size: 12px;
              color: #999999;
              margin-bottom: 10px;
              text-align: center;
            }
            .val {
              background-color: #f3f3f3;
              padding: 0 20px;
              .top {
                padding: 20px 0 15px 0;
                border-bottom: 1px solid #e6e6e6;
                font-size: 14px;
                line-height: 28px;
                color: $mainColor;
                button {
                  float: right;
                  margin-right: 10px;
                }
                i {
                  float: right;
                  font-style: normal;
                  font-size: 16px;
                  line-height: 28px;
                  color: #999999;
                  &:hover {
                    transform: rotate(360deg);
                    transition: transform 1.5s linear;
                    cursor: pointer;
                    color: $mainColor;
                    font-weight: bold;
                  }
                }
              }
              .cont {
                padding: 20px 0;
                font-size: 14px;
                line-height: 20px;
                color: $mainColor;
              }
            }
            &.isread {
              .val {
                .top {
                  color: #333333 !important;
                }
                .cont {
                  color: #666666 !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

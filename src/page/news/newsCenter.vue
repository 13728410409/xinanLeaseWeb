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
            <span class="nav active">新闻中心</span>
            <span class="nav" @click="viewJoinInfo" v-if="!isLogin || userInfo.type!=4">加盟中心</span>
          </div>
        </div>
      </div>
      <div class="news">
        <div class="container box">
          <div class="ownlist">
            <div class="aslide">
              <div class="itm tit">新闻中心</div>
              <div class="itm" :class="type==1?'active':''" @click="selectNType(1)">
                <span class="tx">企业咨询</span>
              </div>
              <div class="itm" :class="type==2?'active':''" @click="selectNType(2)">
                <span class="tx">媒体报道</span>
              </div>
            </div>
            <div class="main">
              <div class="list">
                <div class="itm" v-for="(item,index) of list" :key="index" v-if="list.length>0">
                  <div class="time">{{item.time}}</div>
                  <div class="val">
                    <div class="top">{{item.title}}</div>
                    <div class="cont" v-html="item.content"></div>
                  </div>
                </div>
                <div class="nodata" v-if="list.length==0">暂无新闻数据</div>
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
    <div class="mobile news" v-if="mobileMode.result">
      <headertop :value="headValue" style="position:fixed;top:0;right:0;z-index:2;"></headertop>
      <div class="tab">
        <div :class="type==1?'active':''" @click="selectNType(1)">企业咨询</div>
        <div :class="type==2?'active':''" @click="selectNType(2)">媒体报道</div>
      </div>
      <div class="wrapper" ref="wrapper" @scroll="gd_add">
        <div class="listItem">
          <div v-for="(item,index) of list" :key="index" class="itm">
            <div class="tx">{{item.title}}</div>
            <div class="content" v-html="item.content"></div>
            <div class="tx">{{item.time}}</div>
          </div>
        </div>
      </div>
      <div class="noContent" v-if="list.length==0">暂无消息</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import headertop from "@/components/mobile/header";
import { formatDate } from "@/config/often";
import { mt_newselectAll } from "@/api/common";
export default {
  name: "newsCenter",
  components: {
    headTop,
    footGuide,
    headertop
  },
  data() {
    return {
      type: 1, //1企业咨询，2媒体报道
      title: "", //标题
      allReaded: false,
      list: [],
      page: 1,
      limit: 10,
      count: "",
      headValue: "消息",
      scrollBottom: false
    };
  },
  computed: {
    ...mapState(["userInfo", "mobileMode"])
  },
  watch: {
    type(newVal, oldVal) {
      this.page = 1;
      this.list = []
      this.getData();
    }
  },
  filters: {
    filterType(value) {
      if (value == 1) {
        return "我的消息";
      } else if (value == 2) {
        return "系统消息";
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    //选择消息类型
    selectNType(val) {
      if (this.type != val) {
        this.type = val;
      }
    },
    //加载更多
    gd_add() {
      let wrap_height = document.getElementsByClassName("wrapper")[0]
        .offsetHeight; //容器的高度
      let scroll_top = document.getElementsByClassName("wrapper")[0].scrollTop; //滚动条的scrolltop
      let scroll_height = document.getElementsByClassName("listItem")[0]
        .offsetHeight; //内容的高度
      let is_height = scroll_height - wrap_height - scroll_top;
      if (is_height < 0.1 && this.count > this.list.length) {
        if (!this.scrollBottom) {
          this.page++;
          this.scrollBottom = true;
          this.getData();
        }
      }
    },
    //获取消息
    getData() {
      let that = this;
      mt_newselectAll(that.type, that.title, that.page, that.limit).then(
        data => {
          // console.log(data.data.data)
          data.data.data.forEach(item => {
            item.time = formatDate(item.createTime, "yyyy-MM-dd hh:mm");
          });
          if (!that.mobileMode.result) {
            that.list = data.data.data;
          } else {
            that.list = that.list.concat(data.data.data);
            that.scrollBottom = false;
          }
          that.count = data.data.count;
          console.log(that.list)
        }
      );
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    //查看加盟信息
    viewJoinInfo() {
      let jsonUserInfo = localStorage.getItem("userInfo");
      if (jsonUserInfo != null) {
        let userInfo = JSON.parse(jsonUserInfo);
        if (userInfo.angelState == 3) {
          if (userInfo.joinStatus == 0) {
            this.$router.push("/joinCenter");
          } else {
            this.$router.push("/join");
          }
        } else {
          this.$router.push("/joinAngle");
        }
      } else {
        this.$router.push("/joinCenter");
      }
    }
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
                  color: #333333;
                }
                .cont {
                  padding: 20px 0;
                }
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
    .wrapper {
      position: fixed;
      top: 88px;
      bottom: 0;
      z-index: 2;
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    .noContent {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
  .news .tab {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    z-index: 2;
    height: 44px;
    line-height: 44px;
    background-color: #ffffff;
    display: flex;
  }
  .news .tab div {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #333333;
    position: relative;
    border-bottom: 1px solid #f1f1f1;
  }
  .news .tab div.active {
    border-bottom: 1px solid #f08200;
    color: #f08200;
  }
  .news .itm {
    padding: 10px;
    margin-top: 10px;
    background-color: #ffffff;
    border-bottom: 1px solid #eeeeee;
  }
  .news .itm .tx {
    font-size: 13px;
    color: #999999;
  }
  .news .itm .tx span {
    float: right;
  }
  .news .itm .content {
    font-size: 14px;
    color: #999999;
  }
  .backTop {
    position: fixed;
    right: 10px;
    bottom: 45px;
    z-index: 3;
    width: 50px;
    line-height: 23px;
    text-align: center;
    border-radius: 5px;
    background-color: #f08200;
    opacity: 0.8;
    font-size: 11px;
    font-weight: bold;
    color: #ffffff;
  }
}
</style>

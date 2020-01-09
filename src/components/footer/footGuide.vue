<template>
  <footer class="foot_guide">
    <div class="top">
      <div class="container">
        <div class="left fl">
          <router-link tag="div" to="/home" class="img">
            <img src="/static/icon/logo_white.png" alt />
          </router-link>
          <div class="contactWay">
            <span>联系我们</span>
            <span class="way">{{phoneInfo.hotPhone}}</span>
          </div>
          <div class="ewm">
            <img src="/static/icon/ewm.png" alt />
            <img src="/static/icon/ewm.png" alt />
          </div>
        </div>
        <div class="right fr">
          <div class="item" v-for="(item,index) of list" :key="index">
            <div class="title">{{item.name}}</div>
            <div
              class="val"
              v-for="(items,indexs) of item.list"
              :key="indexs"
              @click="help(items.id,items.name)"
            >{{items.name}}</div>
          </div>
          <div class="item" @click="help">
            <div class="title">新闻中心</div>
            <div class="val">企业资料</div>
            <div class="val">媒体报道</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="copyright">
        <span>信安租赁（深圳）有限公司</span>
        <span>深圳市南山区桃源街道红花岭工业区第五区B栋507-509</span>
        <!-- <span>某某某某某某</span>
        <span>某某某某某某</span>
        <span>某某某某某某</span> -->
      </div>
      <div class="copyright">
        <a href="http://icp.chinaz.com/%E7%B2%A4ICP%E5%A4%8719042723%E5%8F%B7-3">网站备案/许可证号：粤ICP备19042723号-3</a>
      </div>
    </div>
  </footer>
</template>
<script>
import { mapState } from "vuex";
export default {
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
      ]
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(['phoneInfo'])
  },
  methods: {
    help(id, name) {
      this.$router.push({ name: "help", params: { type: id, name: name } });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.foot_guide {
  background-color: #393939;
  .top {
    border-bottom: 1px solid #636161;
    .container {
      width: 1200px;
      margin: 0 auto;
      padding: 60px 0 38px 0;
      overflow: hidden;
      .left {
        width: 330px;
        border-right: 1px solid #636161;
        .img {
          margin-bottom: 32px;
        }
        .contactWay {
          overflow: hidden;
          span {
            float: left;
            display: inline-block;
            font-size: 14px;
            height: 24px;
            line-height: 24px;
            color: #ffffff;
            &.way {
              margin-left: 10px;
              font-size: 24px;
              color: $mainColor;
              font-weight: bold;
              letter-spacing: 3px;
            }
          }
        }
        .ewm {
          margin-top: 24px;
          padding-left: 36px;
          font-size: 0;
          img {
            display: inline-block;
            margin-right: 20px;
            width: 98px;
            height: 98px;
          }
        }
      }
      .right {
        display: flex;
        width: 870px;
        text-align: center;
        .item {
          flex: 1;
          .title {
            line-height: 20px;
            margin-bottom: 34px;
            font-size: 16px;
            color: #f7f7f7;
          }
          .val {
            margin-bottom: 6px;
            line-height: 20px;
            font-size: 14px;
            color: #cdcdcd;
            &:hover {
              cursor: pointer;
              color: $mainColor;
            }
          }
        }
      }
    }
  }
  .bottom {
    padding: 60px 0 38px 0;
    .copyright {
      line-height: 14px;
      margin-bottom: 16px;
      text-align: center;
      font-size: 14px;
      color: #cdcdcd;
      span {
        padding: 0 10px;
        border-right: 1px solid #636161;
        font-size: 14px;
        color: #cdcdcd;
        &:last-child {
          border-right: none;
        }
      }
      a{
        font-size: 14px;
        color: #cdcdcd;
        &:hover{
          color: #999999;
        }
      }
    }
  }
}
</style>

<template>
  <transition name="guide">
    <footer id="foot_guide">
      <div class="bottomNav">
        <router-link tag="div" to="/home">
          <i class="icon"></i>
          <span>首页</span>
        </router-link>
        <router-link tag="div" to="/type">
          <i class="icon"></i>
          <span>分类</span>
        </router-link>
        <router-link tag="div" to="/cartList">
          <i class="icon"></i>
          <span>购物车</span>
        </router-link>
        <router-link tag="div" to="/mymobile">
          <i class="icon"></i>
          <span>我的</span>
        </router-link>
      </div>
    </footer>
  </transition>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(["path"])
  },
  methods: {
    gotoAddress(path) {
      this.$router.push(path);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
#foot_guide {
  position: fixed;
  bottom: 0px;
  left: 0px;
  z-index: 5;
  width: 100%;
  height: 50px;
  .bottomNav {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #d6d7dc;
    display: flex;
    z-index: 3;
    div {
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 50px;
      i {
        display: block;
        width: 100%;
        height: 24px;
        text-align: center;
      }
      span {
        display: block;
        margin-top: 5px;
        font-size: 12px;
        line-height: 12px;
        color: #7f8699;
      }
      &.active {
        i,
        span {
          color: #f08200;
        }
      }
      &:nth-child(1) {
        i {
          background: url("/static/icon_m/home.png") no-repeat center
            center;
          background-size: 24px 24px;
        }
      }
      &:nth-child(2) {
        i {
          background: url("/static/icon_m/type.png") no-repeat center
            center;
          background-size: 24px 24px;
        }
      }
      &:nth-child(3) {
        i {
          background: url("/static/icon_m/cart.png") no-repeat center
            center;
          background-size: 24px 24px;
        }
      }
      &:nth-child(4) {
        i {
          background: url("/static/icon_m/my.png") no-repeat center center;
          background-size: 24px 24px;
        }
      }
      &.active {
        &:nth-child(1) {
          i {
            background: url("/static/icon_m/homeActive.png") no-repeat center
              center;
            background-size: 24px 24px;
          }
        }
        &:nth-child(2) {
          i {
            background: url("/static/icon_m/typeActive.png") no-repeat center
              center;
            background-size: 24px 24px;
          }
        }
        &:nth-child(3) {
          i {
            background: url("/static/icon_m/cartActive.png") no-repeat center
              center;
            background-size: 24px 24px;
          }
        }
        &:nth-child(4) {
          i {
            background: url("/static/icon_m/myActive.png") no-repeat center
              center;
            background-size: 24px 24px;
          }
        }
      }
    }
  }
}
// 接着为过渡类名添加规则
.guide-enter-active,
.guide-leave-active {
  transition: all 0.5s ease;
}

.guide-enter,
.guide-leave-active {
  opacity: 0;
}
</style>

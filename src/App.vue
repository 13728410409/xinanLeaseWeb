<template>
  <div id="app">
    <!--页面容器-->
    <!-- <transition :name="'pop-' + (direction === 'forward' ? 'in' : 'out')">
      <router-view class="router-view" v-if="fullWidth<=768"></router-view>
    </transition> -->
    <!-- <keep-alive   exclude="orderDetail,cartList">
    </keep-alive> -->
    
    <router-view class="router-view"></router-view>
    <loading :value="pageLoading || dataLoading"></loading>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import loading from '@/components/common/loading'
export default {
  components:{
    loading
  },
  data () {
    return {
      // fullWidth:document.documentElement.clientWidth
    }
  },
  computed:{
    ...mapState([
      'pageLoading',
      'dataLoading',
      'path',
      'direction'
    ]),
    // rightWidth(){
    //   let leftWidth = this.isCollapse ? '64' : '200';
    //   console.log(this.fullWidth)
    //   return (this.fullWidth-leftWidth)+'px'
    // }
  },
  created(){
    //  window.addEventListener('resize', this.handleResize)
    this.setCacheData();
  },
  beforeDestroy: function () {
    // window.removeEventListener('resize', this.handleResize)
  },
  methods:{
    // handleResize (event) {
    //   this.fullWidth = document.documentElement.clientWidth
    // },
    ...mapMutations([
      'setCacheData'
    ])
  },
  mounted(){

  }
}
</script>
<style lang="scss">
@import 'src/style/common';
/**
* vue-router transition
*/

.router-view {
  width: 100%;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  backface-visibility: hidden;
}

.pop-out-enter-active,
.pop-out-leave-active,
.pop-in-enter-active,
.pop-in-leave-active {
  will-change: transform;
  height: 100%;
  position: fixed;
  left: 0;
}

.pop-out-enter-active {
  animation-name: popInLeft;
}

.pop-out-leave-active {
  animation-name: popOutRight;
}

.pop-in-enter-active {
  perspective: 1000;
  animation-name: popInRight;
}

.pop-in-leave-active {
  animation-name: popOutLeft;
}

@keyframes popInLeft {
  from {
    transform: translate3d(-100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes popOutLeft {
  from {
    opacity: 1;
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes popInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes popOutRight {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>


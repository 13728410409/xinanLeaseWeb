<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <div class="title">
        物流信息
        <span v-if="logistics.length==0">：暂无物流信息</span>
      </div>
      <div class="logistics scrollbar">
        <div>
          <div class="itm" v-for="(item,index) of logistics" :key="index" v-if="logistics.length>0">
            <div :span="4" class="time">{{item.ftime}}</div>
            <div :span="20" class="cont">{{item.context}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile" v-if="mobileMode.result">
      <div class="title">
        物流信息
        <span v-if="logistics.length==0">：暂无物流信息</span>
      </div>
      <div class="logistics scrollbar">
        <div>
          <div class="itm" v-for="(item,index) of logistics" :key="index" v-if="logistics.length>0">
            <div :span="4" class="time">{{item.ftime}}</div>
            <div :span="20" class="cont">{{item.context}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { formatDate } from "@/config/often";
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      logistics: [] //物流详情
    };
  },
  watch: {
    data(val) {
      if (val != null && val.length > 0) {
        val.forEach(item => {
          item.time = formatDate(item.createTime, "yyyy-MM-dd hh:mm:ss");
        });
      }
      this.logistics = val;
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.pc {
  flex: 1;
  .title {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 10px;
    color: $mainColor;
  }
  .logistics {
    flex: 1;
    max-height: 200px;
    overflow-y: scroll;
    .itm {
      display: flex;
      &:first-child {
        .time,
        .cont {
          color: $mainColor;
        }
      }
      &:last-child {
        .cont {
          padding-bottom: 0;
        }
      }
      .time {
        flex: 140px 0 0;
        font-size: 12px;
        color: #333333;
        line-height: 20px;
        border-right: 1px solid #f1f1f1;
      }
      .cont {
        flex: 1;
        padding: 0 0 10px 20px;
        font-size: 12px;
        color: #333333;
        line-height: 20px;
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .mobile {
    .title {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 10px;
      color: $mainColor;
    }
    .logistics {
      // max-height: 200px;
      // overflow-y: scroll;
      .itm {
        &:first-child {
          .time,
          .cont {
            color: $mainColor;
          }
        }
        &:last-child {
          .cont {
            padding-bottom: 0;
          }
        }
        .time {
          font-size: 12px;
          color: #333333;
          line-height: 20px;
          border-right: 1px solid #f1f1f1;
        }
        .cont {
          padding: 0 0 10px 20px;
          font-size: 12px;
          color: #333333;
          line-height: 20px;
        }
      }
    }
  }
}
</style>

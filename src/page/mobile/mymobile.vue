<template>
  <div class="mobile">
    <div class="headerm">我的信安</div>

    <div class="headbox">
      <div class="set" v-if="userInfo.token" @click="viewAccount">
        <img src="/static/icon_m/set.png" />账号管理
      </div>
      <div class="infoBox">
        <div class="img">
          <img v-if="userInfo.headImg" :src="userInfo.headImg" />
          <img v-else src="/static/icon_m/default.png" />
        </div>
        <div class="info" v-if="userInfo.token">
          <div class="top">
            <div class="name">{{userInfo.nickName}}</div>
            <div class="level" v-if="userInfo.type">
              <img src="/static/icon_m/gold.png" />
              <span>{{JoinTypeText}}</span>
            </div>
          </div>
          <div class="middle">{{userInfo.phone |filterPhone}}</div>
          <div class="edit" @click="editInfo">
            <img src="/static/icon_m/edit.png" />编辑
          </div>
        </div>
        <div class="info" v-else>
          <router-link tag="div" class="btnlogin" to="/login" v-if="!userInfo.token">登录</router-link>
        </div>
      </div>
    </div>

    <div class="group">
      <div class="itm" @click="viewOrder(1)">
        <div class="img">
          <img src="/static/icon_m/order1.png" />
        </div>
        <div class="n">待付款</div>
      </div>
      <div class="itm" @click="viewOrder(3)">
        <div class="img">
          <img src="/static/icon_m/order2.png" />
        </div>
        <div class="n">待收货</div>
      </div>
      <div class="itm" @click="viewOrder(6)">
        <div class="img">
          <img src="/static/icon_m/order3.png" />
        </div>
        <div class="n">售后</div>
      </div>
      <div class="itm" @click="viewOrder('')">
        <div class="img">
          <img src="/static/icon_m/order4.png" />
        </div>
        <div class="n">全部订单</div>
      </div>
      <div class="itm" @click="viewReletOrder">
        <div class="img">
          <img src="/static/icon_m/order4.png" />
        </div>
        <div class="n">续租订单</div>
      </div>
    </div>

    <div class="group">
      <div class="box">
        <div class="itm">
          <div class="v" v-if="accountDetail.allEarning!=underfined">{{accountDetail.allEarning}}</div>
          <div class="v" v-else>0元</div>
          <div class="n">总收益</div>
        </div>
        <div class="itm">
          <div
            class="v"
            v-if="accountDetail.monthEarning!=underfined"
          >{{accountDetail.monthEarning}}元</div>
          <div class="v" v-else>0元</div>
          <div class="n">本月收益</div>
        </div>
        <div class="itm">
          <div
            class="v"
            v-if="accountDetail.lastMonthEarning!=underfined"
          >{{accountDetail.lastMonthEarning}}元</div>
          <div class="v" v-else>0元</div>
          <div class="n">上月收益</div>
        </div>
        <div class="itm" @click="viewAssets">
          <div class="v">
            <img src="/static/icon_m/profit.png" />
          </div>
          <div class="n">我的资产</div>
        </div>
      </div>
    </div>

    <div class="group other">
      <div class="itm" @click="viewNews">
        <div class="img">
          <img src="/static/icon_m/other1.png" />
        </div>
        <div class="n">
          消息
          <span
            v-if="userInfo.token && newsInfo && (newsInfo.myCount+newsInfo.sysCount) !=0"
            style="color:red;font-size:24rpx;"
          >{{newsInfo.myCount+newsInfo.sysCount}}</span>
        </div>
      </div>
      <div class="itm" @click="viewHelp">
        <div class="img">
          <img src="/static/icon_m/other2.png" />
        </div>
        <div class="n">帮助中心</div>
      </div>
      <div class="itm" v-if="userInfo.type !=9" @click="viewjoinCenter">
        <div class="img">
          <img src="/static/icon_m/other3.png" />
        </div>
        <div class="n">加盟中心</div>
      </div>
      <div class="itm" @click="viewNewsCenter">
        <div class="img">
          <img src="/static/icon_m/other4.png" />
        </div>
        <div class="n">新闻中心</div>
      </div>
    </div>

    <footerm></footerm>

    <!-- 修改个人信息弹窗 -->
    <el-dialog
      title="修改个人信息"
      :visible.sync="dialogPinfo"
      :fullscreen="true"
      :close-on-click-modal="false"
    >
      <div class="infoList">
        <el-row class="item">
          <el-col :span="24">
            <el-col :span="6" class="name">头像</el-col>
            <el-col :span="16" class="himg">
              <img v-if="eHeadImg" :src="eHeadImg" alt />
              <img v-else src="/static/icon/logo.png" alt />
              <div class="btnimg">
                选择图片
                <input-file
                  class="inp"
                  v-model="eHeadImg"
                  type="String"
                  :upType="upType"
                  :multiple="false"
                ></input-file>
              </div>
            </el-col>
          </el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="24">
            <el-col :span="6" class="name">昵称</el-col>
            <el-col :span="16" class="line40">
              <el-input v-model="eNickName" placeholder="昵称" class="einp"></el-input>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogPinfo = false">取消</el-button>
        <el-button size="small" type="danger" @click="save">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import footerm from "@/components/footer/footer";
import inputFile from "@/components/common/inputFile";
import {
  mt_getuserInfo,
  mt_getJinPaiInfo,
  mt_leaseMoneyDetail,
  mt_selectMyEarnings,
  mt_queryEarningPage
} from "@/api/my";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "mymobile",
  components: {
    footerm,
    inputFile
  },
  data() {
    return {
      JoinTypeText: "",
      dialogPinfo: false,
      accountDetail: {}
    };
  },
  watch: {},
  filters: {
    //手机号
    filterPhone(value) {
      if (regSJH.test(value)) {
        return value.substr(0, 3) + "****" + value.substr(7);
      } else {
        return value;
      }
    }
  },
  created() {
    if (this.userInfo.token != undefined) {
      this.getuserInfo();
      this.getJinPaiInfo();
    }
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    getuserInfo() {
      let that = this;
      mt_getuserInfo().then(data => {
        // console.log(data.data)
        that.setUserInfo(data.data);
        that.getMyEarnings(); //获取资产详情
        // that.getNews()   //获取消息
      });
    },
    //获取角色
    getJinPaiInfo() {
      let that = this;
      mt_getJinPaiInfo().then(data => {
        // console.log(data.data);
        data.data.forEach(item => {
          if (that.userInfo.type == item.type) {
            that.JoinTypeText = item.name;
          }
        });
      });
    },

    //编辑个人信息弹窗显示
    editInfo() {
      // console.log(this.userInfo)
      this.dialogPinfo = true;
      this.eHeadImg = this.userInfo.headImg;
      this.eNickName = this.userInfo.nickName;
      this.birthday = this.userInfo.birthday;
      this.gender = this.userInfo.gender;
    },
    //确认修改个人信息
    save() {
      let that = this;
      let state = true,
        title = "";
      if (that.eNickName == "" || that.eNickName == undefined) {
        state = false;
        title = "昵称不能为空";
      }
      if (state) {
        let hImg = "";
        if (that.eHeadImg == "" || that.eHeadImg == undefined) {
          hImg = "";
        } else {
          hImg = that.eHeadImg;
        }
        mt_edituserInfo(hImg, that.eNickName, that.birthday, that.gender).then(
          data => {
            // console.log(data);
            that.$message({
              message: "修改成功",
              type: "success",
              duration: 1000
            });
            that.dialogPinfo = false;
            that.getUserInfo();
          }
        );
      } else {
        that.$message({
          message: title,
          type: "warning",
          duration: 1000
        });
      }
    },
    //查看单
    viewOrder(type) {
      this.$router.push({
        name: "orderList",
        params: {
          status: type
        }
      });
    },
    //查看续租订单
    viewReletOrder() {
      this.$router.push({
        name: "orderList",
        params: {
          type: 2
        }
      });
    },
    //获取收益总 本月 上月
    getMyEarnings() {
      let that = this;
      mt_selectMyEarnings().then(data => {
        // console.log(data.data);
        that.accountDetail = data.data;
      });
    },
    //账户管理
    viewAccount() {
      alert("移动端界面优化中");
    },
    //查看我的资产记录
    viewAssets() {
      this.$router.push("/assets");
    },
    //查看消息
    viewNews() {
      this.$router.push("/news");
    },
    //帮助中心
    viewHelp() {
      this.$router.push("/help");
    },
    //新闻中心
    viewNewsCenter() {
      alert("移动端界面优化中");
    },
    //查看加盟信息
    viewjoinCenter() {
      alert("移动端界面优化中");
      // let jsonUserInfo = localStorage.getItem('userInfo')
      // if (jsonUserInfo!=null) {
      //   let userInfo = JSON.parse(jsonUserInfo)
      //   if(userInfo.angelState==3){
      //     if(userInfo.joinStatus == 0){
      //       this.$router.push('/joinCenter')
      //     }else{
      //       this.$router.push('/join')
      //     }
      //   }else{
      //     this.$router.push('/joinAngle')
      //   }
      // } else {
      //   this.$router.push("/joinCenter");
      // }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.mobile {
  .headerm {
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    font-size: 16px;
    color: #333333;
    text-align: center;
    position: relative;
    border-bottom: 1px solid #dddddd;
  }

  .headbox {
    padding: 30px 15px 15px 15px;
    margin-bottom: 15px;
    background: linear-gradient(90deg, #eb3c3c, #f08200);
    position: relative;
  }
  .headbox .set {
    position: absolute;
    right: 15px;
    top: 12px;
    font-size: 12px;
    line-height: 16px;
    color: #ffffff;
  }
  .headbox .set img {
    float: left;
    width: 16px;
    height: 16px;
  }
  .headbox .infoBox {
    display: flex;
  }
  .headbox .infoBox .img {
    flex: 60px 0 0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
  }
  .headbox .infoBox .img img {
    width: 60px;
    height: 60px;
  }
  .headbox .infoBox .img .inp {
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 2;
    width: 60px;
    height: 60px;
    opacity: 0;
  }
  .headbox .infoBox .info {
    flex: 1;
    padding-left: 15px;
  }
  .headbox .infoBox .info .btnlogin {
    width: 60px;
    line-height: 30px;
    height: 30px;
    text-align: center;
    font-size: 14px;
    color: #666666;
    background-color: #ffffff;
    border-radius: 5px;
    position: relative;
    top: 15px;
  }

  .headbox .infoBox .top {
    line-height: 21px;
    color: #ffffff;
    display: flex;
  }
  .headbox .infoBox .name {
    font-size: 14px;
    color: #ffffff;
  }

  .headbox .infoBox .level {
    margin-left: 10px;
    padding: 0 5px 0 0;
    font-size: 10px;
    background-color: #c8483f;
    border-radius: 12px;
    color: #ffffff;
  }
  .headbox .infoBox .level img {
    float: left;
    width: 21px;
    height: 21px;
  }
  .headbox .infoBox .middle {
    font-size: 12px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.7);
  }
  .headbox .infoBox .edit {
    width: 40px;
    line-height: 16px;
    font-size: 10px;
    color: #ffffff;
  }
  .headbox .infoBox .edit img {
    float: left;
    width: 16px;
    height: 16px;
  }
}

.infoList {
  .item {
    margin-bottom: 10px;
    .einp {
      width: 100%;
    }
    .name {
      line-height: 40px;
      padding-right: 20px;
      font-size: 14px;
      color: #333333;
      text-align: right;
    }
    .line40 {
      line-height: 40px;
    }
    .himg {
      height: 72px;
      position: relative;
      img {
        width: 72px;
        height: 72px;
        border-radius: 50%;
      }
      .btnimg {
        position: absolute;
        left: 92px;
        top: 21px;
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        background-color: $mainColor;
        color: #ffffff;
        cursor: pointer;
        border-radius: 3px;
        input {
          position: absolute;
          right: 0;
          width: 80px;
          height: 30px;
          opacity: 0;
        }
      }
    }
  }
}

.group {
  display: flex;
  padding: 14px 0;
  margin-bottom: 15px;
  background-color: #ffffff;
}
.group {
  display: flex;
}
.group .itm {
  flex: 1;
}
.group .itm .img {
  height: 32px;
  text-align: center;
  position: relative;
}
.group .itm .img img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 20px;
  height: 20px;
}
.group .itm .n {
  font-size: 12px;
  color: #666666;
  line-height: 24px;
  text-align: center;
}

.group {
  display: flex;
  padding: 14px 0;
}
.group .box {
  flex: 1;
  display: flex;
}
.group .box .itm {
  flex: 1;
  text-align: center;
  font-size: 12px;
}
.group .box .itm .v {
  height: 20px;
  line-height: 20px;
  color: #eb3c3c;
  position: relative;
}
.group .box .itm .v img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 20px;
  height: 20px;
}
.group .box .itm .n {
  color: #666666;
}
</style>

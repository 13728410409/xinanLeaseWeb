<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <head-top></head-top>
      <account-head></account-head>
      <!-- <div class="banner">
        <img src="/static/icon/joincenter.png" alt />
      </div> -->
      <div class="joinCenter">
        <div class="container box">
          <div class="sign">
            <img @click="joinshow" src="/static/icon/agentjoin.png" alt />
            <!-- <img @click="join(5)" src="/static/icon/goldjoin.png" alt /> -->
          </div>
          <div class="conact">
            <div class="title">输入您的电话&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们立即联系您</div>
            <el-row class="val">
              <el-col :span="24">
                <el-input placeholder v-model="companyName">
                  <template slot="prepend" style="padding:0 10px;">公司名称：</template>
                </el-input>
              </el-col>
            </el-row>
            <el-row class="val short">
              <el-col :span="7">
                <el-input placeholder v-model="phone" maxlength="11">
                  <template slot="prepend">手机号：</template>
                </el-input>
              </el-col>
              <el-col :span="7" class="mid">
                <el-input placeholder v-model="conact">
                  <template slot="prepend">联系人：</template>
                </el-input>
              </el-col>
              <el-col :span="7">
                <el-input placeholder v-model="email">
                  <template slot="prepend">邮箱：</template>
                </el-input>
              </el-col>
            </el-row>
            <el-row class="val">
              <el-col :span="24">
                <el-input
                  type="textarea"
                  placeholder="备注信息"
                  v-model="remark"
                  rows="4"
                  maxlength="200"
                  show-word-limit
                ></el-input>
              </el-col>
            </el-row>
            <div class="btn">
              <span @click="submit">提交</span>
            </div>
          </div>
        </div>
      </div>
      <foot-guide></foot-guide>
    </div>
    <div class="mobile news" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="item" @click="join(5)">
        <div class="name">金牌入驻</div>
        <div class="val" style="color:#959595;">立即申请</div>
        <div class="next">
          <img src="/static/icon_m/rightGray.png" />
        </div>
      </div>
      <div class="item" @click="join(3)">
        <div class="name">代理商</div>
        <div class="val" style="color:#959595;">立即申请</div>
        <div class="next">
          <img src="/static/icon_m/rightGray.png" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import accountHead from "@/components/accountHead/accountHead";
import headertop from "@/components/mobile/header";
import { mt_insertLeaseJoinUs } from "@/api/my";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "joinCenter",
  components: {
    headTop,
    footGuide,
    accountHead,
    headertop
  },
  data() {
    return {
      companyName: "",
      phone: "",
      email: "",
      conact: "",
      remark: "",
      headValue: "加盟中心"
    };
  },
  computed: {
    ...mapState(["userInfo", "newsInfo", "mobileMode"])
  },
  watch: {},
  filters: {},
  created() {
    //console.log();
  },
  mounted() {},
  methods: {
    //查看加盟信息
    join(type) {
      //console.log(type);
      this.$router.push("joinDes/" + type);
    },
    joinshow(){
      this.$router.push("joinCenterShow");
    },
    //提交咨询信息
    submit() {
      let that = this;
      if (!regSJH.test(that.phone)) {
        that.$message({
          message: "手机号格式不正确",
          type: "warning",
          duration: 1000
        });
      } else if (that.conact == "") {
        that.$message({
          message: "联系人不能为空",
          type: "warning",
          duration: 1000
        });
      } else {
        // companyName,  phone,  email,  contactName,  remark
        mt_insertLeaseJoinUs(
          that.companyName,
          that.phone,
          that.email,
          that.conact,
          that.remark
        ).then(data => {
          // //console.log(data)
          that.$message({
            message: "加盟咨询提交成功，稍后平台会主动联系你！",
            type: "success",
            duration: 2000
          });
          that.companyName = "";
          that.phone = "";
          that.eamil = "";
          that.conact = "";
          that.remark = "";
        });
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
  /deep/ .el-input-group__prepend {
    padding: 0 10px !important;
    font-size: 12px;
  }
  .banner {
    width: 100%;
    position: relative;
    padding-top: 23%;
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .joinCenter {
    padding: 30px 0 80px 0;
    background-color: #ffffff;
    .box {
      .sign {
        img {
          display: block;
          width: 100%;
          margin-bottom: 20px;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .conact {
        padding: 50px 200px;
        border: 1px solid #e6e6e6;
        .title {
          font-size: 24px;
          line-height: 24px;
          margin-bottom: 40px;
          color: #666666;
          font-weight: bold;
          text-align: center;
        }
        .val {
          margin-bottom: 30px;
          &.short {
            .mid {
              margin: 0 6%;
            }
          }
        }
        .btn {
          text-align: right;
          span {
            display: inline-block;
            line-height: 50px;
            padding: 0 46px;
            background-color: $mainColor;
            color: #ffffff;
            border-radius: 3px;
            font-size: 16px;
            letter-spacing: 10px;
            &:hover {
              cursor: pointer;
              background-color: $mainHoverColor;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .mobile {
    .item {
      display: flex;
      justify-content: flex-start;
      padding: 15px;
      background-color: #ffffff;
      border-bottom: 1px solid #eeeeee;
    }
    .item .name {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 15px;
      color: #000000;
    }
    .item .val {
      font-size: 15px;
      color: #252525;
      padding-right: 10px;
      position: relative;
    }
    .item .next {
      flex: 0 7px 0;
      display: flex;
      align-items: center;
      width: 10px;
    }
    .item .next img {
      width: 7px;
      height: 14px;
    }
  }
}
</style>

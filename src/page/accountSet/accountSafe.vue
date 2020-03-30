<template>
  <div>
    <head-top></head-top>
    <account-head></account-head>
    <!-- <div class="ordertop">
      <div class="container box">
        <router-link tag="div" to="/" class="img" title="信安首页">
          <img src="/static/icon/logo_black.png" alt />
        </router-link>
        <div class="navs">
          <router-link tag="span" to="/home" class="nav">首页</router-link>
          <router-link tag="span" to="/accountSet" class="nav active">账户安全</router-link>
          <router-link tag="span" to="/news" class="nav">消息中心</router-link>
          <router-link tag="span" to="/account" class="nav">账户中心</router-link>
          <router-link tag="span" to="/joinCenter" class="nav">加盟中心</router-link>
        </div>
      </div>
    </div> -->
    <div class="orderList">
      <div class="container box">
        <div class="ownlist">
          <div class="aslide">
            <div class="itm tit">账户设置</div>
            <router-link tag="div" to="/accountSet" class="itm">基础资料</router-link>
            <router-link tag="div" to="/accountAddress" class="itm">寄送地址</router-link>
            <router-link tag="div" to="/accountSafe" class="itm active">账户安全</router-link>
            <router-link tag="div" to="/accountCompany" class="itm">企业信息</router-link>
          </div>
          <div class="main">
            <div class="item">
              <div class="name">重设密码</div>
              <div class="info">
                <div class="tit">您的手机号：{{userInfo.phone | filterPhone}}</div>
                <div class="tip">如帐号不慎被盗，或者忘记密码，您可以通过该手机重设密码</div>
              </div>
              <div class="btn">
                <span title="点击修改登录密码" @click="edit">修改</span>
              </div>
            </div>
            <div class="item">
              <div class="name">微信绑定</div>
              <div class="info">
                <div class="tit">您的账户：{{userInfo.wechatUnionid | filterWx}}微信</div>
                <div class="tip">账户绑定微信后，可用微信快捷登录信安IT租赁</div>
              </div>
              <div class="btn" v-if="userInfo.wechatUnionid==null||userInfo.wechatUnionid==''">
                <span title="点击修改登录密码" @click="bind">绑定</span>
              </div>
            </div>
            <!-- <div class="item">
                <div class="name">邮箱验证</div>
                <div class="info">
                    <div class="tit">为进行邮箱验证</div>
                    <div class="tip">如帐号不慎被盗，或者忘记密码，您可以通过该邮箱重设密码</div>
                </div>
                <div class="btn"><span>修改</span></div>
            </div>-->
          </div>
        </div>
      </div>
    </div>
    <foot-guide></foot-guide>

    <!-- 手机验证修改密码弹窗 -->
    <el-dialog
      title="手机验证修改密码"
      :visible.sync="dialogEditPsd"
      width="420px"
      :close-on-click-modal="false">
      <div class="infoList">
        <div style="line-height:40px;margin-bottom:20px;padding-left: 15px;background-color:#f5f5f5;border: 1px solid #dddddd;">{{userInfo.phone | filterPhone}}</div>
        <div class="input">
          <el-row class="item">
            <el-col :span="16">
              <input
                type="text"
                placeholder="输入验证码"
                maxlength="6"
                v-model="code"/>
            </el-col>
            <el-col :span="8">
              <span class="getCode" v-if="noClick" @click="sendMessage" title="点击发送短信验证码">发送验证码</span>
              <span class="getCode gray" v-if="!noClick" title="请不要频繁发送短信哦！">{{countdown}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="input">
          <input type="password" placeholder="请输入密码" v-model="password" @keyup.enter="sureEdit" autocomplete="new-password" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditPsd = false">取消</el-button>
        <el-button type="danger" @click="sureEditPsd">确认</el-button>
      </span>
    </el-dialog>

    <!-- 手机验证弹窗 -->
    <el-dialog
      title="微信绑定"
      :visible.sync="dialogWX"
      width="420px"
      :close-on-click-modal="false">
      <div class="bind">
        <div id="qrCode" ref="qrCodeDiv" style="width: 170px;margin: 0 auto;"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogWX = false">取消</el-button>
        <el-button type="danger" @click="sureEdit">确认</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import accountHead from "@/components/accountHead/accountHead";
import { mt_register_code, mt_verifiByPhone, mt_updatePwd } from '@/api/common'
import { mt_getuserInfo } from "@/api/my"
import QRCode from "qrcodejs2";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "accountSafe",
  components: {
    headTop,
    footGuide,
    accountHead
  },
  data() {
    return {
      dialogEditPsd: false, //新增地址弹窗是否显示
      userInfoData: {},
      password: "",
      code: "",
      butState: false,

      noClick: true, //是否点击获取短信
      countdown: 60, //多少秒后可以再次发送验证码
      iTime: Object, //计时器

      dialogWX: false, 
      wx: 1,
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
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
    },
    filterWx(value) {
      if (value!=''&&value!=null) {
        return '已绑定'
      } else {
        return '尚未绑定'
      }
    },
  },
  created() {
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    edit() {
      this.dialogEditPsd = true;
    },
    //短信验证码计时器
    settime() {
      if (this.countdown == 1) {
        this.noClick = true;
        this.countdown = 60;
        this.clearTimer();
        return;
      } else {
        this.noClick = false;
        this.countdown--;
      }
      this.iTime = setTimeout(() => {
        this.settime();
      }, 1000);
    },
    //清除计时器
    clearTimer() {
      clearTimeout(this.iTime);
    },
    //发送短信
    sendMessage() {
      let that = this;
        //发送验证码请求
      mt_register_code(that.userInfo.phone,3).then(data => {
        //console.log(data)
          that.code = "";
          that.settime();
          that.$message.success("短信发送成功");
      });
    },
    //确认修改密码
    sureEditPsd() {
      let that = this;
      if (that.code == "") {
        that.$message({
          message: "验证码不能为空",
          type: "warning",
          duration: 1000
        });
      } else if (that.password == "") {
        that.$message({
          message: "密码不能为空",
          type: "warning",
          duration: 1000
        });
      } else {
        let psd = that.$md5(that.password);
        mt_updatePwd(that.userInfo.phone,that.code,psd).then(data => {
          //console.log(data)
          that.clearTimer()
            that.dialogEditPsd = false
            that.code = "";
            that.password = ''
            that.$message.success("密码修改成功");
        });
      }
    },
    sureEdit() {
        let that = this;
        that.$message.success("修改密码");
    },

    //微信绑定显示
    bind() {
      this.dialogWX = true;
      this.useqrcode('http://www.baidu.com')
    },
    
    // 销毁微信二维码
    destriyQrcode() {
      // //console.log('------销毁微信二维码-----')
      var wxcode = document.getElementById("qrCode");
      var childs = wxcode.childNodes;
      if (childs != null) {
        for (var i = childs.length - 1; i >= 0; i--) {
          wxcode.removeChild(childs[i]);
        }
      }
    },
    //生成分享链接二维码
    useqrcode(url) {
      let that = this;
      if(document.getElementById("qrCode")!=null){
          that.destriyQrcode()
      }
      setTimeout(function() {
        new QRCode(that.$refs.qrCodeDiv, {
          text: url,
          width: 170,
          height: 170,
          colorDark: "#333333", //二维码颜色
          colorLight: "#ffffff", //二维码背景色
          correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
        });
        let timestamp = new Date().getTime() + 60 * 1000;
      }, 100);
    },
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
.orderList {
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
        padding: 30px 30px 0 30px;
        background-color: #ffffff;
        .item{
            display: flex;
            margin-bottom: 20px;
            padding: 25px 30px;
            background-color: #f4f3f3;
            font-size: 14px;
            color: #333333;
            .name{
                flex: 120px 0 0;
                width: 120px;
                line-height: 40px;
                font-size: 14px;
                color: #333333;
            }
            .info{
                flex: 1;
                color: #333333;
                .tit{
                    font-size: 14px;
                    line-height: 14px;
                    color: $mainColor;
                }
                .tip{
                    margin-top: 12px;
                    line-height: 14px;
                }
            }
            .btn{
                color: $mainColor;
                line-height: 40px;
                &:hover{
                    cursor: pointer;
                    text-decoration: underline;
                    color: $mainHoverColor;
                }
            }
        }
      }
    }
  }
}
.infoList {
  .input{
    margin-bottom: 20px;
    border: 1px solid #dddddd;
    &.noborder{
        border: none;
    }
    input{
        width: 100%;
        height: 48px;
        line-height: 48px;
        outline: 0;
        padding: 0 18px;
        background-color: #ffffff;
        font-size: 14px;
        border-radius: 4px;
    }
    .getCode{
        display: block;
        width: 118px;
        height: 36px;
        line-height: 36px;
        margin-top: 6px;
        text-align: center;
        font-size: 14px;
        color: #ffffff;
        background-color: $mainColor;
        border-radius: 4px;
        &:hover{
        cursor: pointer;
        background-color: $mainHoverColor;
        }
    }
    .btnlogin{
        display: block;
        width: 100%;
        height: 48px;
        line-height: 48px;
        text-align: center;
        background-color: $mainColor;
        color: #ffffff;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        &:hover{
        background-color: $mainHoverColor;
        }
    }
  }
}
</style>

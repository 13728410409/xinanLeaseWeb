<template>
  <div>
    <head-top></head-top>
    <account-head></account-head>
    <div class="orderList">
      <div class="container box">
        <div class="ownlist">
          <div class="aslide">
            <div class="itm tit">账户设置</div>
            <router-link tag="div" to="/accountSet" class="itm active">基础资料</router-link>
            <router-link tag="div" to="/accountAddress" class="itm">寄送地址</router-link>
            <router-link tag="div" to="/accountSafe" class="itm">安全验证</router-link>
            <router-link tag="div" to="/accountCompany" class="itm">企业信息</router-link>
          </div>
          <div class="main">
            <el-row class="item">
              <el-col :span="2" class="name">头像：</el-col>
              <el-col :span="20" class="himg">
                <img v-if="headImg" :src="headImg" alt />
                <img v-else src="/static/icon/logo.png" alt />
                <div class="btnimg">
                  选择图片
                  <input-file
                    class="inp"
                    v-model="headImg"
                    type="String"
                    :upType="upType"
                    :multiple="false"
                  ></input-file>
                </div>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="24">
                <el-col :span="2" class="name">昵称：</el-col>
                <el-col :span="12" class="line40">
                  <el-input
                    v-if="nickName"
                    v-model="nickName"
                    maxlength="20"
                    placeholder="昵称"
                    class="einp"
                  ></el-input>
                  <el-input
                    v-else
                    v-model="nickName"
                    maxlength="20"
                    placeholder="暂未设置昵称，请输入"
                    class="einp"
                  ></el-input>
                </el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="24">
                <el-col :span="2" class="name">性别</el-col>
                <el-col :span="12" class="line40">
                  <el-radio-group v-model="gender" text-color="#f08200" fill="#f08200">
                    <el-radio :label="1" text-color="#f08200" fill="#f08200">男</el-radio>
                    <el-radio :label="2" text-color="#f08200" fill="#f08200">女</el-radio>
                    <el-radio :label="0" text-color="#f08200" fill="#f08200">保密</el-radio>
                  </el-radio-group>
                </el-col>
              </el-col>
            </el-row>
            <el-row class="item">
              <el-col :span="24">
                <el-col :span="2" class="name">生日</el-col>
                <el-col :span="12" class="line40">
                  <el-date-picker
                    v-model="birthday"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :picker-options="pickerOptions0"
                  ></el-date-picker>
                </el-col>
              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button type="danger" @click="save">保存</el-button>
            </span>
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
import inputFile from "@/components/common/inputFile";
import { mt_getuserInfo, mt_edituserInfo } from "@/api/my";
import { formatDate } from "@/config/often";
export default {
  name: "accountSet",
  components: {
    headTop,
    footGuide,
    accountHead,
    inputFile
  },
  data() {
    return {
      headImg: "",
      nickName: "",
      gender: "",
      birthday: ""
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  watch: {
    //监听图片变化
    headImg(newValue, oldValue) {
      if (newValue != oldValue) {
        
      }
    }
  },
  filters: {},
  created() {
    this.getUserInfo();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取个人信息
    getUserInfo() {
      let that = this;
      mt_getuserInfo().then(data => {
        //console.log(data.data);
        data.data.birthday =
          data.data.birthday != "" && data.data.birthday != undefined
            ? formatDate(data.data.birthday, "yyyy-MM-dd")
            : "";
        that.headImg =
          data.data.headImg != "" && data.data.headImg != undefined
            ? data.data.headImg
            : "";
        that.nickName = data.data.nickName;
        that.gender = Number(data.data.gender);
        that.birthday = data.data.birthday;
        that.setUserInfo(data.data);
      });
    },
    //确认修改个人信息
    save() {
      let that = this;
      let state = true,
        title = "";
      if (that.nickName == "" || that.nickName == undefined) {
        state = false;
        title = "昵称不能为空";
      } else if (that.birthday == "" || that.birthday == undefined) {
        state = false;
        title = "生日不能为空";
      }
      if (state) {
        let hImg = "";
        if (that.headImg == "" || that.headImg == undefined) {
          hImg = "";
        } else {
          hImg = that.headImg;
        }
        mt_edituserInfo(hImg, that.nickName, that.birthday, that.gender).then(
          data => {
            // //console.log(data);
            that.$message({
              message: "修改成功",
              type: "success",
              duration: 1000
            });
            this.dialogPinfo = false;
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
        padding: 40px 30px 0 30px;
        background-color: #ffffff;
        .item {
          margin-bottom: 20px;
          .einp {
            width: 220px;
          }
          .name {
            line-height: 40px;
            padding-right: 30px;
            font-size: 14px;
            color: #333333;
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
    }
  }
}
</style>

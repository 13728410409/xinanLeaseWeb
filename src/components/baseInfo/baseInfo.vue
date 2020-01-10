<template>
  <div class="userInfo">
    <div class="pInfo">
      <div class="img">
        <img v-if="userInfo.headImg" :src="userInfo.headImg" />
        <img v-else src="/static/icon/default.png" />
      </div>
      <div class="name">{{userInfo.nickName}}</div>
      <div class="phone">{{userInfo.phone | filterPhone}}</div>
    </div>
    <div class="oInfo">
      <div class="h">
        基本信息
        <span class="icon el-icon-edit" title="点击编辑个人信息" @click="editInfo">编辑</span>
      </div>
      <el-row class="info">
        <el-col :span="12" class="itm" v-if="userInfo.type!=9">公司名称：{{userInfo.companyName}}</el-col>
        <el-col :span="12" class="itm">公司级别：{{JoinTypeText}}</el-col>
        <el-col :span="12" class="itm">联系方式：{{userInfo.phone}}</el-col>
        <el-col :span="12" class="itm" v-if="userInfo.type!=9">公司地址：{{userInfo.companyAddress}}</el-col>
        <el-col :span="12" class="itm" v-if="userInfo.type!=4&&userInfo.type!=9">
          我的销售：{{userInfo.salesManNum}}人
          <router-link tag="span" to="/mysale" class="bind">去查看</router-link>
        </el-col>
        <el-col :span="12" class="itm">
          我的客户：{{userInfo.customerNum}}家
          <router-link tag="span" to="/mycustomer" class="bind">去查看</router-link>
        </el-col>
        <el-col :span="12" class="itm" v-if="userInfo.type==3||userInfo.type==9">
          我的金牌：{{userInfo.medalManNum}}人
          <router-link tag="span" to="/mygold" class="bind">去查看</router-link>
        </el-col>
      </el-row>
      <!-- 修改个人信息弹窗 -->
      <el-dialog
        title="修改个人信息"
        :visible.sync="dialogPinfo"
        width="40%"
        :close-on-click-modal="false"
      >
        <div class="infoList">
          <el-row class="item">
            <el-col :span="24">
              <el-col :span="4" class="name">头像</el-col>
              <el-col :span="12" class="himg">
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
              <el-col :span="4" class="name">昵称</el-col>
              <el-col :span="12" class="line40">
                <el-input v-model="eNickName" placeholder="昵称" class="einp"></el-input>
              </el-col>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPinfo = false">取消</el-button>
          <el-button type="danger" @click="save">确认修改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { jsGetAge, formatDate } from "@/config/often";
import inputFile from '@/components/common/inputFile'
const regSJH = /^[1][0-9]{10}$/; //手机号正则
import { mt_getuserInfo, mt_edituserInfo, mt_getJinPaiInfo } from "@/api/my"
export default {
  components: {
    inputFile
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // userInfo: {}, //个人信息

      dialogPinfo: false, //修改个人信息弹窗是否显示
      pickerOptions0: {
        disabledDate(time) {
          // return time.getTime() > Date.now()
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },

      eHeadImg: '',
      eNickName: '',
      gender: "",
      birthday: "",
      JoinTypeText: '',
    };
  },
  watch: {
    data(val) {
      // this.userInfo = val;
      // console.log(val);
    },
    //监听图片变化
    eHeadImg(newValue, oldValue) {
      if (newValue != oldValue) {
        // console.log(this.eHeadImg)
      }
    },
  },
  filters: {
    // filterType(value) {
    //   if (value==1) {
    //     return '普通用户'
    //   }else if (value==3) {
    //     return '代理商'
    //   }else if (value==4) {
    //     return '销售'
    //   }else if (value==5) {
    //     return '金牌A级'
    //   }else if (value==6) {
    //     return '金牌B级'
    //   }else if (value==7) {
    //     return '金牌C级'
    //   }else if (value==8) {
    //     return '金牌D级'
    //   }else if (value==9) {
    //     return '天使'
    //   }
    // },
    //手机号
    filterPhone(value) {
      if (regSJH.test(value)) {
        return value.substr(0, 3) + "****" + value.substr(7);
      } else {
        return value;
      }
    },
    //性别
    filterSex(val) {
      if (val == 1) {
        return "男";
      } else if (val == 2) {
        return "女";
      } else if (val == 0) {
        return "保密";
      }
    },
    //生日
    filterBir(val) {
      if (val != "" && val != null) {
        return formatDate(val, "yyyy-MM-dd");
      } else {
        return "暂未设置";
      }
    },
    //年龄
    filterAge(val) {
      if (val != "" && val != null) {
        return jsGetAge(formatDate(val, "yyyy-MM-dd"));
      } else {
        return "暂未设置";
      }
    }
  },
  created() {
    this.getJinPaiInfo()
  },
  mounted() {
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取角色
    getJinPaiInfo(){
      let that = this;
      mt_getJinPaiInfo(
      ).then(data => {
        // console.log(data.data);
        data.data.forEach(item=>{
          if(that.userInfo.type == item.type){
            that.JoinTypeText = item.name
          }
        })
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
    //获取个人信息
    getUserInfo() {
      let that = this;
      mt_getuserInfo().then(data => {
        // console.log(data.data)
        that.setUserInfo(data.data);
      });
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
        mt_edituserInfo(hImg, that.eNickName,that.birthday,that.gender).then(
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

  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.userInfo {
  width: 100%;
  height: 320px;
  margin-bottom: 20px;
  padding: 20px 0 20px 20px;
  background-color: #ffffff;
  display: flex;
  .pInfo {
    flex: 280px 0 0;
    width: 280px;
    height: 280px;
    background-color: $mainColor;
    .img {
      width: 92px;
      height: 92px;
      margin: 50px auto 0;
      padding: 5px;
      background-color: #ffffff;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .name {
      margin-top: 15px;
      text-align: center;
      font-size: 18px;
      line-height: 18px;
      color: #ffffff;
    }
    .phone {
      margin-top: 15px;
      text-align: center;
      font-size: 14px;
      line-height: 14px;
      color: #ffffff;
    }
  }
  .oInfo {
    flex: 1;
    font-size: 0;
    padding: 0 30px;
    .h {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #333333;
      border-bottom: 1px solid #e6e6e6;
      .icon {
        float: right;
        line-height: 50px;
        font-size: 14px;
        color: #3573d8;
        &:hover {
          cursor: pointer;
          color: $mainColor;
        }
      }
    }
    .info {
      padding-top: 15px;
      font-size: 0;
      .itm {
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        color: #333333;
        .bind {
          // font-weight: bold;
          color: #3573d8;
          margin-left: 20px;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
.infoList {
  .item {
    margin-bottom: 10px;
    .einp {
      width: 220px;
    }
    .name {
      line-height: 40px;
      padding-right: 30px;
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
</style>

<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <head-top></head-top>
      <account-head></account-head>
      <div class="company">
        <div class="container box">
          <div class="ownlist">
            <div class="aslide">
              <div class="itm tit">账户设置</div>
              <router-link tag="div" to="/accountSet" class="itm">基础资料</router-link>
              <router-link tag="div" to="/accountAddress" class="itm">寄送地址</router-link>
              <router-link tag="div" to="/accountSafe" class="itm">账户安全</router-link>
              <router-link tag="div" to="/accountCompany" class="itm active">企业信息</router-link>
            </div>
            <div class="main">
              <div class="top">
                <div class="n">企业信息</div>
                <div class="step">
                  <el-steps :space="200" :active="step" finish-status="success">
                    <el-step title="填写资料"></el-step>
                    <el-step title="等待审核"></el-step>
                    <el-step title="审核成功"></el-step>
                  </el-steps>
                </div>
              </div>
              <div class="mInfo" v-if="status==0||status==3">
                <div class="cInfo">
                  <div class="title">企业信息</div>
                  <div class="vBox">
                    <el-row>
                      <el-col :span="16">
                        <el-row class="itm">
                          <div class="n">选择企业类型：</div>
                          <div class="val ctype">
                            <span :class="ctype==1?'active':''" @click="selectCType(1)">公司</span>
                            <span :class="ctype==2?'active':''" @click="selectCType(2)">个体工商户</span>
                          </div>
                        </el-row>
                        <el-row class="itm">
                          <el-col :span="12">
                            <div class="n">企业名称：</div>
                            <div class="val">
                              <el-input v-model="companyName" placeholder="输入企业名称"></el-input>
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <div class="n">营业执照号：</div>
                            <div class="val">
                              <el-input v-model="businessCode" placeholder="输入营业执照号"></el-input>
                            </div>
                          </el-col>
                        </el-row>
                        <el-row class="itm">
                          <el-col :span="12">
                            <div class="n">法人姓名：</div>
                            <div class="val">
                              <el-input v-model="conact" placeholder="输入法人姓名"></el-input>
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <div class="n">法人手机号：</div>
                            <div class="val">
                              <el-input v-model="phone" maxlength="11" placeholder="输入手机号"></el-input>
                            </div>
                          </el-col>
                        </el-row>
                        <el-row class="itm">
                          <el-col :span="20">
                            <div class="n">注册地址：</div>
                            <div class="val">
                              <el-input v-model="address" placeholder="请输入详细地址"></el-input>
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="8" class="statusImg">
                        <img v-if="step==3" src="/static/icon/success.png" alt />
                      </el-col>
                    </el-row>
                    <el-row class="itm">
                      <el-col :span="24">
                        <div class="imgs">
                          <div class="img">
                            <img class="show" v-if="yyzz!=''" :src="yyzz" alt />
                            <img class="show" v-if="yyzz==''" src="/static/icon/yyzz.png" alt />
                            <input-file
                              class="uploadImg"
                              v-model="yyzz"
                              type="String"
                              :upType="upType"
                              :multiple="false"
                            ></input-file>
                          </div>
                          <div class="img">
                            <img class="show" v-if="zzjg!=''" :src="zzjg" alt />
                            <img class="show" v-if="zzjg==''" src="/static/icon/zzjg.png" alt />
                            <input-file
                              class="uploadImg"
                              v-model="zzjg"
                              type="String"
                              :upType="upType"
                              :multiple="false"
                            ></input-file>
                          </div>
                          <div class="img">
                            <img class="show" v-if="swdj!=''" :src="swdj" alt />
                            <img class="show" v-if="swdj==''" src="/static/icon/swdj.png" alt />
                            <input-file
                              class="uploadImg"
                              v-model="swdj"
                              type="String"
                              :upType="upType"
                              :multiple="false"
                            ></input-file>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div
                          class="zp"
                        >温馨提示：所有资质证明文件需加盖公章的复印件或彩色扫描件，大小均不超过1M。三件合一或五证合一的企业只需提供企业营业执照， 无需提供税务登记证和组织机构代码证</div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div class="cInfo">
                  <div class="title">法人信息</div>
                  <div class="vBox">
                    <el-row class="itm">
                      <el-col :span="14">
                        <div class="n">法人身份证正反面：</div>
                        <div class="val">
                          <div class="imgs">
                            <div class="img">
                              <img class="show" v-if="zhengmian!=''" :src="zhengmian" alt />
                              <img
                                class="show"
                                v-if="zhengmian==''"
                                src="/static/icon/zhengmian.png"
                                alt
                              />
                              <input-file
                                class="uploadImg"
                                v-model="zhengmian"
                                type="String"
                                :upType="upType"
                                :multiple="false"
                              ></input-file>
                            </div>
                            <div class="img">
                              <img class="show" v-if="fanmian!=''" :src="fanmian" alt />
                              <img
                                class="show"
                                v-if="fanmian==''"
                                src="/static/icon/fanmian.png"
                                alt
                              />
                              <input-file
                                class="uploadImg"
                                v-model="fanmian"
                                type="String"
                                :upType="upType"
                                :multiple="false"
                              ></input-file>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div class="cInfo">
                  <div class="title">推荐人</div>
                  <div class="vBox">
                    <el-input v-model="recommend" placeholder="推荐人编码(非必填）" style="width:220px;"></el-input>
                  </div>
                </div>
              </div>
              <div class="mInfo" v-if="status==1||status==2">
                <div class="cInfo">
                  <div class="title">认证信息</div>
                  <div class="showInfo">
                    <div class="authenticationSuccess" v-if="status==2"></div>
                    <div class="authenticationSuccess authenting" v-if="status==1"></div>
                    <el-row class="sitm">
                      <el-col :span="7" class="tx">
                        企业类型：
                        <span>{{authentication.type | filterCtype }}</span>
                      </el-col>
                      <el-col :span="7" class="tx">
                        企业名称：
                        <span>{{authentication.name }}</span>
                      </el-col>
                      <el-col :span="7" class="tx">
                        营业执照号：
                        <span>{{authentication.number }}</span>
                      </el-col>
                    </el-row>
                    <el-row class="sitm">
                      <el-col :span="7" class="tx">
                        联系人：
                        <span>{{authentication.contactsName }}</span>
                      </el-col>
                      <el-col :span="7" class="tx">
                        联系号码：
                        <span>{{authentication.contactsPhone }}</span>
                      </el-col>
                    </el-row>
                    <el-row class="sitm">
                      <el-col :span="24" class="tx">
                        注册地址：
                        <span>{{authentication.companyAddress }}</span>
                      </el-col>
                    </el-row>
                    <el-row class="sitm">
                      <el-col :span="24" class="t">营业执照</el-col>
                      <el-col :span="24" class="imgs">
                        <div class="img">
                          <img :src="authentication.imgs1.img1" alt />
                        </div>
                        <div class="img">
                          <img
                            v-if="authentication.imgs1.img2!=''"
                            :src="authentication.imgs1.img3"
                            alt
                          />
                        </div>
                        <div class="img">
                          <img
                            v-if="authentication.imgs1.img2!=''"
                            :src="authentication.imgs1.img3"
                            alt
                          />
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="sitm">
                      <el-col :span="24" class="t">法人身份证</el-col>
                      <el-col :span="16" class="imgs">
                        <div class="img">
                          <img :src="authentication.imgs2.positive" alt />
                        </div>
                        <div class="img">
                          <img :src="authentication.imgs2.negative" alt />
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
              <el-button
                type="primary"
                style="margin-top:20px;"
                @click="submit"
                v-if="status==0||status==3"
              >提交审核</el-button>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <foot-guide></foot-guide>
    </div>
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="top">
        <div class="mInfo" v-if="status==0||status==3">
          <div class="cInfo">
            <div class="vBox">
              <el-row>
                <el-col :span="24">
                  <el-row class="itm">
                    <div class="n">选择企业类型：</div>
                    <div class="val ctype">
                      <span :class="ctype==1?'active':''" @click="selectCType(1)">公司</span>
                      <span :class="ctype==2?'active':''" @click="selectCType(2)">个体工商户</span>
                    </div>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">企业名称：</div>
                      <div class="val">
                        <el-input v-model="companyName"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">营业执照号：</div>
                      <div class="val">
                        <el-input v-model="businessCode" placeholder="企业类型为个人可不填"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">法人姓名：</div>
                      <div class="val">
                        <el-input v-model="conact" placeholder="输入法人姓名"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">法人手机号：</div>
                      <div class="val">
                        <el-input maxlength="11" v-model="phone" placeholder="输入法人手机号"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">注册地址：</div>
                      <div class="val">
                        <el-input v-model="address" placeholder="请输入详细地址"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8" class="statusImg">
                  <img v-if="step==3" src="/static/icon/success.png" alt />
                </el-col>
              </el-row>
              <el-row class="itm">
                <el-col :span="24">
                  <div class="imgs">
                    <div class="img">
                      <img class="show" v-if="yyzz!=''" :src="yyzz" alt />
                      <img class="show" v-if="yyzz==''" src="/static/icon/yyzz.png" alt />
                      <input-file
                        class="uploadImg"
                        v-model="yyzz"
                        type="String"
                        :upType="upType"
                        :multiple="false"
                      ></input-file>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="itm">
                <el-col :span="24">
                  <div class="imgs">
                    <div class="img">
                      <img class="show" v-if="zzjg!=''" :src="zzjg" alt />
                      <img class="show" v-if="zzjg==''" src="/static/icon/zzjg.png" alt />
                      <input-file
                        class="uploadImg"
                        v-model="zzjg"
                        type="String"
                        :upType="upType"
                        :multiple="false"
                      ></input-file>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="itm">
                <el-col :span="24">
                  <div class="imgs">
                    <div class="img">
                      <img class="show" v-if="swdj!=''" :src="swdj" alt />
                      <img class="show" v-if="swdj==''" src="/static/icon/swdj.png" alt />
                      <input-file
                        class="uploadImg"
                        v-model="swdj"
                        type="String"
                        :upType="upType"
                        :multiple="false"
                      ></input-file>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div
                    class="zp"
                  >温馨提示：所有资质证明文件需加盖公章的复印件或彩色扫描件，大小均不超过1M。三件合一或五证合一的企业只需提供企业营业执照， 无需提供税务登记证和组织机构代码证</div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="cInfo">
            <div class="vBox">
              <el-row class="itm">
                <el-col :span="24">
                  <div class="n" v-if="ctype!=3">法人身份证正反面：</div>
                  <div class="n" v-else>个人身份证正反面：</div>
                  <div class="val">
                    <div class="imgs">
                      <div class="img">
                        <img class="show" v-if="zhengmian!=''" :src="zhengmian" alt />
                        <img class="show" v-if="zhengmian==''" src="/static/icon/zhengmian.png" alt />
                        <input-file
                          class="uploadImg"
                          v-model="zhengmian"
                          type="String"
                          :upType="upType"
                          :multiple="false"
                        ></input-file>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="itm">
                <el-col :span="24">
                  <div class="val">
                    <div class="imgs">
                      <div class="img">
                        <img class="show" v-if="fanmian!=''" :src="fanmian" alt />
                        <img class="show" v-if="fanmian==''" src="/static/icon/fanmian.png" alt />
                        <input-file
                          class="uploadImg"
                          v-model="fanmian"
                          type="String"
                          :upType="upType"
                          :multiple="false"
                        ></input-file>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="cInfo">
            <div class="vBox">
              <el-input v-model="recommend" placeholder="推荐人编码(非必填）" style="width:220px;"></el-input>
            </div>
          </div>
        </div>
        <div style="padding: 20px 15px;" v-if="status==0||status==3">
          <el-button
            type="primary"
            style="width: 100%;"
            @click="submit"
          >提交审核</el-button>
        </div>
        <div class="mInfo" v-if="status==1||status==2">
          <div class="infoShow">
            <div class="title sign" v-if="status==2">
              <span >实名认证成功</span>
            </div>
            <div class="title sign" v-if="status==1">
              <span>实名认证审核中</span>
            </div>
          </div>
          <div class="cInfo">
            <div class="showInfo">
              <div class="authenticationSuccess" v-if="status==2"></div>
              <div class="authenticationSuccess authenting" v-if="status==1"></div>

              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  企业类型：
                  <span>{{authentication.type | filterCtype }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  企业名称：
                  <span>{{authentication.name }}</span>
                </el-col>
              </el-row>

              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  营业执照号：
                  <span>{{authentication.number }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  联系人：
                  <span>{{authentication.contactsName }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  联系号码：
                  <span>{{authentication.contactsPhone }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  注册地址：
                  <span>{{authentication.companyAddress }}</span>
                </el-col>
              </el-row>

              <el-row class="sitm">
                <el-col :span="24" class="imgs">
                  <div class="img">
                    <img :src="authentication.imgs1.img1" alt />
                  </div>
                  <div class="img">
                    <img v-if="authentication.imgs1.img2!=''" :src="authentication.imgs1.img2" alt />
                  </div>
                  <div class="img">
                    <img v-if="authentication.imgs1.img2!=''" :src="authentication.imgs1.img3" alt />
                  </div>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="24" class="imgs">
                  <div class="img">
                    <img :src="authentication.imgs2.positive" alt />
                  </div>
                  <div class="img">
                    <img :src="authentication.imgs2.negative" alt />
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
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
import inputFile from "common/inputFile";
import {
  mt_queryCompanyInfo,
  mt_insertCompanyInfo,
  mt_getuserInfo
} from "@/api/my";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "accountCompany",
  components: {
    headTop,
    footGuide,
    accountHead,
    inputFile,
    headertop
  },
  data() {
    return {
      upType: "image/gif, image/jpg, image/jpeg, image/png",
      status: 0, //审核状态
      step: 1, //步骤

      ctype: 1, //1公司 2个体工商户
      companyName: "",
      businessCode: "",
      conact: "",
      phone: "",
      address: "",

      yyzz: "", //营业执照
      zzjg: "", //组织机构代码
      swdj: "", //税务登记证
      zhengmian: "", //身份证正面
      fanmian: "", //身份证反面

      recommend: "",

      authentication: {},
      headValue: "信安认证"
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  watch: {},
  filters: {
    filterCtype(value) {
      if (value == 1) {
        return "公司";
      } else {
        return "个体工商户";
      }
    }
  },
  created() {
    this.getCompanyInfo();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取个人信息
    getUserInfo() {
      let that = this;
      mt_getuserInfo().then(data => {
        // //console.log(data.data)
        that.userInfoData = data.data;
        that.setUserInfo(data.data);
      });
    },
    selectCType(val) {
      if (this.ctype != val) {
        this.ctype = val;
      }
    },
    //获取企业信息
    getCompanyInfo() {
      let that = this;
      mt_queryCompanyInfo().then(data => {
        // console.log(data.data);
        if (data.data) {
          data.data.imgs1 = JSON.parse(data.data.imgs);
          data.data.imgs2 = JSON.parse(data.data.legalManImgs);
          that.authentication = data.data;
          that.status = data.data.status;
          if (data.data.status == 0 || data.data.status == 3) {
            that.step = 1;
          } else if (data.data.status == 1) {
            that.step = 2;
          } else if (data.data.status == 2) {
            that.step = 3;
            that.getUserInfo();
          }
        }
      });
    },

    //提交申请
    submit() {
      let that = this,
        state = true,
        title = "";
      let imgs = { img1: that.yyzz, img2: that.zzjg, img3: that.swdj };
      let legalManImgs = { positive: that.zhengmian, negative: that.fanmian };
      if (that.companyName == "") {
        state = false;
        title = "企业名称不能为空";
      } else if (that.businessCode == "") {
        state = false;
        title = "营业执照不能为空";
      } else if (that.conact == "") {
        state = false;
        title = "法人姓名不能为空";
      } else if (!regSJH.test(that.phone)) {
        state = false;
        title = "法人手机号不正确";
      } else if (that.address == "") {
        state = false;
        title = "注册地址不能为空";
      } else if (imgs.img1 == "") {
        state = false;
        title = "营业执照不能为空";
      } else if (legalManImgs.positive == "") {
        state = false;
        title = "法人身份证正面不能为空";
      } else if (legalManImgs.negative == "") {
        state = false;
        title = "法人身份证反面不能为空";
      }
      if (state) {
        // type,name,number,companyAddress,contactsName,contactsPhone,imgs,legalManImgs
        mt_insertCompanyInfo(
          that.ctype,
          that.companyName,
          that.businessCode,
          that.address,
          that.conact,
          that.phone,
          JSON.stringify(imgs),
          JSON.stringify(legalManImgs),
          that.recommend
        ).then(data => {
          if (!that.mobileMode.result) {
            that.$message({
              message: "认证信息提交成功",
              type: "success",
              duration: 1000
            });
          } else {
            alert("认证信息提交成功");
          }
          // //console.log(data.data);
          that.getCompanyInfo();
        });
      } else {
        if (!that.mobileMode.result) {
          that.$message({
            message: title,
            type: "warning",
            duration: 1000
          });
        } else {
          alert(title);
        }
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
  .company {
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
          padding: 20px;
          background-color: #ffffff;
          .top {
            display: flex;
            margin-bottom: 30px;
            .n {
              flex: 1;
              padding-top: 20px;
              font-size: 16px;
              line-height: 16px;
              color: #333333;
            }
            .step {
              flex: 500px 0 0;
              width: 500px;
            }
          }
          .mInfo {
            border: 1px solid #e6e6e6;
            .cInfo {
              .title {
                line-height: 40px;
                padding-left: 20px;
                font-size: 14px;
                color: #333333;

                background-color: #f7f7f7;
              }
              .vBox {
                padding: 20px;
                .statusImg {
                  padding-top: 40px;
                  text-align: center;
                }
                .itm {
                  margin-bottom: 20px;
                  .n {
                    font-size: 14px;
                    line-height: 14px;
                    color: #666666;
                    margin-bottom: 15px;
                  }
                  .val {
                    padding-right: 40px;
                    &.ctype {
                      font-size: 0;
                      span {
                        display: inline-block;
                        width: 120px;
                        line-height: 36px;
                        margin-right: 20px;
                        text-align: center;
                        border: 1px solid #dddddd;
                        font-size: 14px;
                        color: #666666;
                        &.active,
                        &:hover {
                          cursor: pointer;
                          border: 1px solid $mainColor;
                          color: $mainColor;
                        }
                      }
                    }
                  }
                  .imgs {
                    display: flex;
                    .img {
                      flex: 1;
                      padding-right: 20px;
                      position: relative;
                      img {
                        width: 293px;
                        height: 200px;
                      }
                      .uploadImg {
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 2;
                        width: 293px;
                        height: 200px;
                        opacity: 0;
                      }
                    }
                  }
                  .zp {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #999999;
                  }
                }
              }
              .showInfo {
                padding: 30px 20px;
                position: relative;
                .authenticationSuccess {
                  position: absolute;
                  right: 20px;
                  top: 30px;
                  z-index: 99;
                  width: 170px;
                  height: 170px;
                  background: url(/static/icon/success.png) no-repeat center
                    center;
                  &.authenting {
                    background: url(/static/icon/authenting.png) no-repeat
                      center center;
                  }
                }
                .sitm {
                  margin-bottom: 20px;
                  .tx {
                    font-size: 14px;
                    line-height: 14px;
                    color: #999999;
                    span {
                      color: #666666;
                      font-weight: bold;
                    }
                  }
                  .imgs {
                    display: flex;
                    .img {
                      flex: 1;
                      padding-right: 20px;
                      position: relative;
                      .show {
                        width: 293px;
                        height: 200px;
                      }
                      img {
                        max-width: 100%;
                      }
                    }
                  }
                  .t {
                    font-size: 14px;
                    line-height: 14px;
                    color: #666666;
                    margin-bottom: 15px;
                  }
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
    background-color: #ffffff;
    .mInfo {
      .infoShow {
        padding: 20px 0;
      }
      .infoShow .title {
        text-align: center;
      }
      .infoShow .title.sign span {
        display: inline-block;
        font-size: 15px;
        line-height: 20px;
        color: rgb(255, 103, 1);
        position: relative;
      }
      .cInfo {
        title {
          line-height: 35px;
          padding: 0 15px;
          font-size: 14px;
          color: #f08200;
        }
        .vBox {
          padding: 10px 20px;
          .statusImg {
            padding-top: 40px;
            text-align: center;
          }
          .itm {
            margin-bottom: 20px;
            .n {
              font-size: 14px;
              line-height: 14px;
              color: #666666;
              margin-bottom: 5px;
            }
            .val {
              &.ctype {
                font-size: 0;
                span {
                  display: inline-block;
                  width: 28%;
                  line-height: 30px;
                  margin-right: 20px;
                  margin: 0 1.5%;
                  text-align: center;
                  border: 1px solid #dddddd;
                  font-size: 12px;
                  color: #666666;
                  &.active,
                  &:hover {
                    cursor: pointer;
                    border: 1px solid $mainColor;
                    color: $mainColor;
                  }
                }
              }
            }
            .imgs {
              display: flex;
              .img {
                flex: 1;
                padding-right: 20px;
                position: relative;
                img {
                  width: 293px;
                  height: 200px;
                }
                .uploadImg {
                  position: absolute;
                  left: 0;
                  top: 0;
                  z-index: 2;
                  width: 293px;
                  height: 200px;
                  opacity: 0;
                }
              }
            }
            .zp {
              margin-top: 20px;
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }
      .sitm {
        .tx {
          display: flex;
          justify-content: flex-start;
          padding: 0 15px;
          font-size: 14px;
          line-height: 35px;
          color: #333333;
          border-bottom: 1px solid #f1f1f1;
          width: 100%;
          span {
            flex: 1;
            text-align: right;
          }
        }
        .imgs {
          padding: 0 15px;
          .img {
            img {
              display: block;
              max-width: 100%;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
}
</style>

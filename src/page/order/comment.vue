<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <head-top></head-top>
      <div class="ordertop">
        <div class="container box">
          <router-link tag="div" to="/" class="img" title="信安首页">
            <img src="/static/icon/logo_black.png" alt />
          </router-link>
          <div class="navs">
            <router-link tag="span" to="/home" class="nav">首页</router-link>
            <router-link tag="span" to="/orderList" class="nav">我的订单</router-link>
            <router-link tag="span" to="/orderList" class="nav">续租订单</router-link>
          </div>
        </div>
      </div>
      <div class="comment">
        <div class="container box">
          <div class="main">
            <div class="l">
              <div class="imgs">
                <div class="box">
                  <div class="img">
                    <img v-for="(item,index) of goods" :key="index" :src="item.goodsImg" alt />
                  </div>
                </div>
              </div>
              <div class="name">
                <span
                  v-for="(item,index) in goods"
                  :key="index"
                  style="color:#f08200;"
                >“{{item.goodsName}}”</span>
                {{detail.name}}
              </div>
              <div class="price">￥{{detail.money}}</div>
              <!-- <div class="size">{{detail.typesize}}</div> -->
            </div>
            <div class="r">
              <div class="itm">
                <span class="n">评分：</span>
                <el-rate class="vv" v-model="score" @change="changeScore()"></el-rate>
              </div>
              <div class="itm">
                <span class="n">内容：</span>
                <el-input
                  type="textarea"
                  rows="5"
                  placeholder="分享心得"
                  v-model="cont"
                  maxlength="200"
                  show-word-limit
                ></el-input>
              </div>
              <div class="itm">
                <span class="n">图片：</span>
                <div class="v">
                  <el-row class="imgs">
                    <el-col :span="24">
                      <el-col
                        style="margin-bottom:20px;"
                        :span="6"
                        v-if="imgs.length!=0"
                        v-for="(item,index) of imgs"
                        :key="index"
                      >
                        <div class="showimg">
                          <img :src="item" alt />
                          <span
                            class="icon el-icon-circle-close"
                            @click="removeImg(index)"
                            title="移除图片，重新上传"
                          ></span>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div v-if="imgs.length<9" class="icon himg">
                          点击上传
                          <input-file
                            class="inp"
                            v-model="img"
                            type="String"
                            :upType="upType"
                            :length="9"
                            :multiple="false"
                          ></input-file>
                        </div>
                      </el-col>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
          <div class="opt">
            <span @click="submit">提交</span>
          </div>
        </div>
      </div>
      <foot-guide></foot-guide>
    </div>
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="box">
        <div class="itm">
          <el-rate class="vv" v-model="score" @change="changeScore()"></el-rate>
        </div>
        <div class="itm">
          <el-input
            type="textarea"
            rows="5"
            placeholder="请输入评价内容"
            v-model="cont"
            maxlength="200"
            show-word-limit
          ></el-input>
        </div>
        <div class="itm">
          <div class="v">
            <el-row class="imgs">
              <el-col :span="24">
                <el-col
                  style="margin: 0 15px 20px 0;"
                  :span="6"
                  v-if="imgs.length!=0"
                  v-for="(item,index) of imgs"
                  :key="index"
                >
                  <div class="showimg">
                    <img :src="item" alt />
                    <span
                      class="icon el-icon-circle-close"
                      @click="removeImg(index)"
                      title="移除图片，重新上传"
                    ></span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div v-if="imgs.length<9" class="icon himg">
                    <input-file
                      class="inp"
                      v-model="img"
                      type="String"
                      :upType="upType"
                      :length="9"
                      :multiple="false"
                    ></input-file>
                  </div>
                </el-col>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="opt">
          <span @click="submit">提交</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import inputFile from "@/components/common/inputFile";
import headertop from "@/components/mobile/header";
import { mt_insertComment } from "@/api/order";
import { mt_getOrderDetail } from "@/api/order";
export default {
  name: "sale",
  components: {
    headTop,
    footGuide,
    inputFile,
    headertop
  },
  data() {
    return {
      id: "",
      detail: {}, //订单详情

      score: 4, //评分
      cont: "", //内容
      imgs: [],
      img: "",
      headValue: "评价"
    };
  },
  watch: {
    //监听图片变化
    img(newValue, oldValue) {
      if (newValue != oldValue) {
        this.imgs.push(newValue);
      }
    }
  },

  mounted() {},
  computed: {
    ...mapState(["userInfo", "newsInfo", "mobileMode"])
  },
  created() {
    this.id = this.$route.params.id;
    if(!this.mobileMode.result){
      this.getOrderDetail(this.id);
    }
  },
  methods: {
    //获取我的订单
    getOrderDetail(id) {
      let that = this;
      mt_getOrderDetail(id).then(data => {
        //console.log(data.data);
        that.goods = data.data.goods;
        that.detail = data.data.order;
      });
    },
    //移除图片
    removeImg(index) {
      let arr = this.imgs;
      arr.splice(index, 1);
      this.imgs = arr;
    },
    //提交
    submit() {
      let that = this;
      if (that.cont == "") {
        that.$message({
          message: "内容不能为空",
          type: "warning",
          duration: 1000
        });
      } else {
        // goodsId,comments,score,img
        let img = "";
        if (that.imgs.length > 0) {
          img = that.imgs.join(",");
        }
        mt_insertComment(that.id, that.cont, that.score, img).then(data => {
          //console.log(data.data);
          
          if(!that.mobileMode.result){
            that.$message({
              message: "评论成功",
              type: "success",
              duration: 1000
            });
          }else{
            alert('评论成功')
          }
          that.$router.go(-1);
        });
      }
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.pc {
  .comment {
    padding: 20px 0;
    .box {
      .main {
        display: flex;
        padding: 20px;
        background-color: #ffffff;
        .l {
          flex: 300px 0 0;
          padding: 20px;
          text-align: center;
          .imgs {
            overflow: hidden;
            text-align: center;
            font-size: 0;
            .box {
              display: inline-block;
              width: 33.3%;
              .img {
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 100px;
                margin-bottom: 10px;
                img {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate3d(-50%, -50%, 0);
                  max-width: 100%;
                  max-height: 100%;
                }
              }
            }
          }

          .name {
            font-size: 12px;
            line-height: 20px;
            color: #333333;
            margin-bottom: 10px;
            padding: 0 15px;
          }
          .price {
            font-size: 12px;
            font-weight: bold;
            color: red;
            margin-bottom: 10px;
          }
          .size {
            font-size: 12px;
            line-height: 20px;
            color: #999999;
          }
        }
        .r {
          flex: 1;
          .itm {
            display: flex;
            .n {
              flex: 80px 0 0;
              line-height: 40px;
              margin-bottom: 20px;
              font-size: 14px;
              color: #666666;
            }
            .vv {
              height: 40px;
              padding-top: 10px;
            }
            .v {
              flex: 1;

              .imgs {
                margin-top: 20px;
                .showimg {
                  width: 120px;
                  height: 120px;
                  position: relative;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                  span {
                    position: absolute;
                    right: -25px;
                    top: 5px;
                    font-size: 20px;
                    color: #959595;
                    &:hover {
                      cursor: pointer;
                      color: $mainColor;
                    }
                  }
                }
                .himg {
                  width: 120px;
                  height: 120px;
                  line-height: 160px;
                  text-align: center;
                  font-size: 14px;
                  color: #999999;
                  background: #f0f0f0 url(/static/icon_m/uploadImg.png)
                    no-repeat 39px 32px;
                  border: 1px solid #dcdfe6;
                  position: relative;
                  .inp {
                    position: absolute;
                    right: 0;
                    width: 120px;
                    height: 120px;
                    opacity: 0;
                    z-index: 99;
                  }
                }
              }
            }
          }
        }
      }
      .opt {
        padding: 20px 0;
        text-align: center;
        margin-top: 30px;
        background-color: #ffffff;
        span {
          display: inline-block;
          height: 50px;
          line-height: 50px;
          padding: 0 58px;
          text-align: center;
          background-color: #f08200;
          color: #ffffff;
          border-radius: 3px;
          &:hover {
            cursor: pointer;
            background-color: $mainHoverColor;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .mobile {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    .box {
      .itm {
        margin-top: 10px;
        padding: 0 20px;
        .vv {
          height: 40px;
          padding-top: 10px;
        }
        .v {
          flex: 1;
          .imgs {
            margin-top: 20px;
            .showimg {
              position: relative;
              width: 100%;
              height: 0;
              padding-top: 100%;
              img {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                width: 100%;
                height: 100%;
              }
              span {
                position: absolute;
                right: -10px;
                top: 5px;
                font-size: 20px;
                color: #959595;
                &:hover {
                  cursor: pointer;
                  color: $mainColor;
                }
              }
            }
            .himg {
              position: relative;
              width: 100%;
              height: 0;
              padding-top: 100%;
              text-align: center;
              font-size: 14px;
              background: #ffffff url(/static/icon_m/photo.png) no-repeat center
                center;
              background-size: 30px 24px;
              border: 1px solid #cbcbcb;
              .inp {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                opacity: 0;
                z-index: 99;
                width: 100%;
              }
            }
          }
        }
      }
      .opt {
        padding: 10px 20px;
        margin-top: 20px;
        span {
          display: block;
          height: 50px;
          line-height: 50px;
          padding: 0 58px;
          text-align: center;
          background-color: #188dec;
          color: #ffffff;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>

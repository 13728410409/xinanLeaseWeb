<template>
  <div>
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
            <img :src="detail.img" alt />
            <div class="name">{{detail.name}}</div>
            <div class="price">￥{{detail.price}}</div>
            <div class="size">{{detail.typesize}}</div>
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
</template>
<script>
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import inputFile from "@/components/common/inputFile";
import { mt_insertComment } from "@/api/order"
export default {
  name: "sale",
  components: {
    headTop,
    footGuide,
    inputFile
  },
  data() {
    return {
      id: '',
      detail: {
        status: 5,
        orderNum: "201810222",
        img: "/static/photo/signimg2.png",
        price: 180,
        name:
          "三星(SAMSUNG)笔记本内存条DDR4 DDR3 DDR3L 4G8G16G兼容联想戴尔华硕惠普 DDR4 2666 1.2V【笔记本内存条】 8G",
        typesize: "19款13.3英寸",
        totalprice: 1180, //商品总额
        num: 1,
        invoice: {
          type: "普通发票",
          companyName: "深圳市米塔技术",
          dutyParagraph: "1234567899989",
          cont: "商品明细"
        }, //发票信息
        address: {
          id: "002",
          name: "masonzhou2",
          province: "广东省",
          city: "深圳市",
          county: "宝安区",
          detail: "资信达大厦211办公室",
          phone: "13728410404",
          default: false
        }, //收货人信息
        logisticsType: "普通快递", //配送方式
        freight: 0, //运费
        payWay: "在线支付",
        payTime: "2019-11-05 17:00:00",
        rent: 180, //租金
        deposit: 1000 //押金
      }, //订单详情
      
      score: 4, //评分
      cont: "", //内容
      imgs: [],
      img: ""
    };
  },
  computed: {
  },
  watch: {
    //监听图片变化
    img(newValue, oldValue) {
      if (newValue != oldValue) {
        this.imgs.push(newValue);
      }
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  mounted() {},
  methods: {
    changeScore() {
      // console.log(this.score);
    },
    //移除图片
    removeImg(index) {
      let arr = this.imgs;
      arr.splice(index, 1);
      this.imgs = arr;
    },
    //提交
    submit() {
      let that = this
      if (that.cont == "") {
        that.$message({
          message: "内容不能为空",
          type: "warning",
          duration: 1000
        });
      }else{
        // goodsId,comments,score,img
        let img = ''
        if(that.imgs.length>0){
          img = that.imgs.join(',')
        }
        mt_insertComment(that.id,that.cont,that.score,img).then(data=>{
          console.log(data.data)
          that.$message({
            message: "评论成功",
            type: "success",
            duration: 1000
          });
          that.$router.go(-1)
        })
      }
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.comment {
  padding: 20px 0;
  .box {
    .main {
      display: flex;
      padding: 20px;
      background-color: #ffffff;
      .l {
        flex: 300px 0 0;
        padding: 30px 60px;
        text-align: center;
        img {
          width: 100px;
          height: 100px;
          margin-bottom: 10px;
        }
        .name {
          font-size: 12px;
          line-height: 20px;
          color: #333333;
          margin-bottom: 10px;
        }
        .price {
          font-size: 12px;
          font-weight: bold;
          color: #333333;
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
                background: #f0f0f0 url(/static/icon/uploadImg.png) no-repeat
                  39px 32px;
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
        &:hover{
            cursor: pointer;
            background-color: $mainHoverColor;
        }
      }
    }
  }
}
</style>

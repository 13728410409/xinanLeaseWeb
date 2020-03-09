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
          <router-link tag="span" to="/orderList" class="nav">订单中心</router-link>
          <span class="nav active">售后</span>
        </div>
      </div>
    </div>
    <div class="lease">
      <div class="container box">
        <div class="item">
          <span class="n">订单编号</span><span class="v">{{detail.orderNum}}</span>
        </div>
        <div class="item">
          <span class="n">租赁日期</span><span class="v">{{detail.createTime | filterTime}}</span>
        </div>
        <div class="item">
          <span class="n">租赁公司</span><span class="v">{{userInfo.companyName}}</span>
        </div>
        <div class="item">
          <span class="n">到期日期</span><span class="v">{{detail.endTime}}</span>
        </div>
      </div>
    </div>
    <div class="service">
      <div class="container box">
        <div class="tip">信安租赁售后</div>
        <div class="des">售后范围描述：{{good.proAfterSales}}</div>
        <div class="input">
          <el-row class="type">
            <span>选择售后的商品：<span style="color:#f08200;">{{good.goodsName}}，{{good.dispose}}，{{good.proIntroduction}}</span></span>
          </el-row>
          <el-row class="type">
            <span>售后类型：</span>
            <el-select v-model="saleType" placeholder="请选择">
              <el-option
                v-for="(item,index) of options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-row>
          <el-row class="inpbox">
            <el-col class="t" v-if="saleType==1">上传损坏信息</el-col>
            <el-col class="t" v-if="saleType==2">终止租赁原因</el-col>
            <el-input class="textarea" type="textarea" :rows="4" placeholder="请输入" v-model="remark"></el-input>
          </el-row>
          <el-row class="imgs" v-if="saleType==1">
            <el-col :span="24">
              <el-col
                style="margin-bottom:20px;"
                :span="4"
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
              <el-col :span="10">
                <div v-if="imgs.length<9" class="icon himg">
                  点击上传
                  <input-file
                    class="inp"
                    v-model="img"
                    type="String"
                    :upType="upType"
                    :length="4"
                    :multiple="true"
                  ></input-file>
                </div>
              </el-col>
            </el-col>
          </el-row>
        </div>
        <div class="opt">
            <span @click="submit">确认提交</span>
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
import inputFile from "@/components/common/inputFile";
import { mt_queryReletOrderGoods, mt_after_sales } from "@/api/order";
import { formatDate } from "@/config/often";
export default {
  name: "sale",
  components: {
    headTop,
    footGuide,
    inputFile
  },
  data() {
    return {
      orderId: '',
      sid: '',
      detail: [],
      options: [
        {
          value: 1,
          label: "设备损坏"
        },
        {
          value: 2,
          label: "终止租赁"
        }
      ],  //类型
      good: {},  //售后的商品

      saleType: 1,  
      remark: "",

      imgs: [],
      img: ""
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo"])
  },
  watch: {
    //监听图片变化
    img(newValue, oldValue) {
      if (newValue != oldValue) {
        this.imgs.push(newValue);
      }
    }
  },
  filters: {
    filterTime(val) {
      return formatDate(val,'yyyy-MM-dd hh:mm')
    },
  },
  created() {
    this.orderId = this.$route.params.id;
    this.sid = this.$route.params.sid;
    this.getOrderDetail(this.orderId);
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //获取我的订单
    getOrderDetail(id) {
      let that = this;
      mt_queryReletOrderGoods(id).then(data => {
        console.log(data.data)
        that.detail = data.data.detail;
        if(data.data.goods.length==1){
          data.data.goods[0].dispose = JSON.parse(data.data.goods[0].dispose).config
           that.good = data.data.goods[0]
        }else{
          data.data.goods.forEach(item=>{
            item.dispose = JSON.parse(item.dispose).config
            if(item.id == that.sid){
              that.good = item
            }
          })
        }
      });
    },
    //移除图片
    removeImg(index) {
      let arr = this.imgs;
      arr.splice(index, 1);
      this.imgs = arr;
    },
    //提交
    submit(){
      let that = this,
        state = true,
        title = "";
        // orderGoodsId,type,img,remark
        if(that.saleType==1){
          if (that.imgs.length == 0) {
            state = false;
            title = "设备损坏图片不能为空";
          }else if(that.remark==''){
            state = false;
            title = "损坏信息描述不能为空";
          }
        }else{
          if(that.remark==''){
            state = false;
            title = "终止租赁原因不能为空";
          }
        }
        if (state) {
          mt_after_sales(that.sid,that.saleType,that.remark,JSON.stringify(that.imgs)).then(data => {
            console.log(data.data)
            this.$alert('售后申请提交成功，平台将派遣工作人员在24小时内与您联系，请保持电话畅通！', '售后提示！', {
              confirmButtonText: '确定',
              callback: action => {
                // this.$router.go(-1)
                this.$router.push('/orderList')
              }
            });
          });
        }else{
          that.$message({
            message: title,
            type: "warning",
            duration: 1000
          });
        }
        

    },
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.lease {
  padding: 20px 0 0 0;
  .box {
    display: flex;
    border: 1px solid #c4c4c4;
    .item {
      flex: 1;
      width: 25%;
      display: flex;
      line-height: 40px;
      .n {
        flex: 100px;
        width: 100px;
        padding-left: 20px;
        font-size: 14px;
        background-color: rgb(221, 221, 221);
      }
      .v {
        width: 60%;
        padding-left: 15px;
        font-size: 14px;
        background-color: #ffffff;
      }
    }
  }
}
.service {
  padding: 20px 0 50px 0;
  .box {
    border: 1px solid #dddddd;
    padding: 20px;
    background-color: #ffffff;
    .tip {
      font-size: 16px;
      line-height: 16px;
      color: #333333;
      font-weight: bold;
    }
    .des {
      margin-top: 20px;
      padding: 13px 24px;
      font-size: 14px;
      line-height: 24px;
      color: #666666;
      background-color: #f7f7f7;
    }
    .input {
      margin-top: 20px;
      padding-bottom: 30px;
      border: 1px solid #e6e6e6;
      background-color: #f7f7f7;
      .type {
        padding: 24px;
        border-bottom: 1px solid #e6e6e6;
        span {
          display: inline-block;
          font-size: 14px;
          color: #666666;
          line-height: 38px;
        }
      }
      .inpbox {
          padding: 0 24px;
          .t{
              padding: 22px 0 14px 0;
            font-size: 14px;
            line-height: 14px;
            color: #666666;
          }
          .textarea{
              font-size: 12px;
              color: #333333;
              outline: none;
          }
      }
      .imgs {
          margin-top: 20px;
          padding: 0 24px;
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
          background: #f0f0f0 url(/static/icon/uploadImg.png) no-repeat 39px 32px;
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
    .opt{
        line-height: 50px;
        margin-top: 30px;
        text-align: right;
        span {
          display: inline-block;
          height: 50px;
          line-height: 50px;
          padding: 0 58px;
          text-align: center;
          background-color: $mainColor;
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
</style>

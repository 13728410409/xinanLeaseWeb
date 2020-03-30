<template>
  <div>
    <el-dialog
      title="充值"
      :visible.sync="dialogPay"
      top="192px"
      width="40%"
      :close-on-click-modal='false'
      @close="close">
      <div class="payComponents">
        <el-row class="item">
          <el-col :span="5" class="name">充值类型</el-col>
          <el-col :span="16" class="line40">
            <el-radio-group v-model="payType" text-color='#ff6701' fill="#ff6701">
              <el-radio :label="1" text-color='#ff6701' fill="#ff6701">微信</el-radio>
              <el-radio :label="2" text-color='#ff6701' fill="#ff6701">支付宝</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="5" class="name">充值金额</el-col>
          <el-col :span="16" class="line40">
            <el-input v-model="reMoneyNum" maxlength="6" placeholder="输入充值金额"  class="einp"></el-input>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button  type="danger" @click="submit">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="微信扫码"
      :visible.sync="dialogWxPay"
      width="40%"
      :close-on-click-modal='false'
      @close="close1">
        <div class="payComponents">
          <div id="qrCode" ref="qrCodeDiv" style="width: 200px;margin: 0 auto;"></div>
          <div style="font-size: 14px;line-height:28px;color:#333333;text-align:center;padding: 7px 14px;">使用微信扫码支付</div>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios"
import qs from 'qs'
import { httpUrl } from '@/api/httpUrl'
import { mt_alipayRecharge, mt_wxpayRecharge, mt_validateIsPaySuccess } from '@/api/order'
import QRCode from 'qrcodejs2'
const regJE = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/  //金额正则
export default {
  props: {
  },
  data() {
    return {
      dialogPay: false,  //弹窗
      payType: 1, //充值方式  1微信  2支付宝
      reMoneyNum: '', //充值金额
      lxtimer: '', //轮询定时器
      dialogWxPay: false,  //微信二维码
    };
  },
  watch: {
    payType(newValue, oldValue){
      if(newValue!=oldValue){
        // //console.log(newValue)
      }
    },
  },
  computed: {},
  methods: {
    show(){
      this.payType = 1
      this.reMoneyNum = ''
      this.dialogPay = true
    },
    close(){
      this.dialogPay = false
    },
    close1(){
      this.dialogWxPay = false
      this.destriyQrcode()
    },
    // 销毁微信二维码
    destriyQrcode(){
      // //console.log('------销毁微信二维码-----')
      var wxcode = document.getElementById("qrCode")
      var childs = wxcode.childNodes
      if(childs!=null){
        for(var i = childs.length - 1; i >= 0; i--) { 
          wxcode.removeChild(childs[i])
        }
      }
      clearTimeout(this.lxtimer)
    },
    //生成二维码
    useqrcode(url){
      let that = this
      
      that.dialogWxPay = true
      setTimeout(function(){
        new QRCode(that.$refs.qrCodeDiv, {
          text: url.forms.code_url,
          width: 200,
          height: 200,
          colorDark: "#333333", //二维码颜色
          colorLight: "#ffffff", //二维码背景色
          correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
        })
        let timestamp =new Date().getTime() + 60*1000
        that.validateIsPaySuccess(url.outTradeNo,timestamp)
      },100)
    },
    //确定充值
    submit(){
      let that = this
      if (that.reMoneyNum === "") {
        that.$message.warning("请输入充值金额")
      } else if (!regJE.test(Number(that.reMoneyNum))) {
        that.$message.warning("充值金额输入有误")
      } else {
        let money = Number(that.reMoneyNum)
        // 清除二维码
        if(that.payType==1){
          // //console.log('微信充值')
          mt_wxpayRecharge('微信网页充值',money).then(data => {
            //console.log(data.data)
            data.data.forms = JSON.parse(data.data.form)
            that.useqrcode(data.data)
          })
        }else if(that.payType==2){
          mt_alipayRecharge('支付宝网页充值',money).then(data => {
            // //console.log(data.data)
            that.html = data.data.form;
            var form = data.data.form;
            const div = document.createElement("div");
            div.innerHTML = form;
            document.body.appendChild(div);
            document.forms[0].submit();
           
          })

          // axios.get(httpUrl.le_alipay,
          //   {
          //     params: {
          //       subject: title,
          //       totalAmount: money
          //     },
          //     headers: {
          //       'token': JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).token : '',
          //       'Content-Type': 'Multipart/form-data'
          //     }
          //   })
          // .then((res) =>{
          //     //console.log(res.data)
          //     if(res.data.code==200){
                
          //     }else if (res.data.code==401){
          //       that.$message.warning(res.data.msg)
          //       that.$router.push('/')
          //     }else{
          //       that.$message.warning(res.data.msg)
          //     }
          //   }).catch((res) =>{
          // })

        }
      }
    },
    //轮询微信支付是否成功
    validateIsPaySuccess(outTradeNo,time) {
      let that = this;
      let timestamp =new Date().getTime()
      if(timestamp<=time){
        mt_validateIsPaySuccess(outTradeNo).then(data => {
          //console.log(data)
          if (data.data==1) {
            that.close()
            that.close1()
            that.$message.success("微信支付成功");
            that.$emit('completeOpt')
          } else {
            that.lxtimer = setTimeout(function() {
              that.validateIsPaySuccess(outTradeNo, time);
            }, 1000);
          }
        });
      }else{
        clearTimeout(that.lxtimer)      
        that.$alert('操作超时，请刷新重试', '订单支付提示', {
          confirmButtonText: '确定',
          callback: action => {
            that.destriyQrcode();
            that.getOrderDetail(this.id);
          }
        })
      }
    }
  },
  beforeDestroy() {
    // this.destriyQrcode()
    clearTimeout(this.lxtimer)      
  }
};
</script>
<style scoped lang="scss">
@import "../../style/mixin";
/deep/ .el-button--danger {
  color: #fff;
  background-color: $mainColor;
  border-color: $mainColor;
}
/deep/ .el-button--danger:hover{
  background-color: $mainHoverColor;
  border-color: $mainHoverColor;  
}
.payComponents{
  .item{
    margin-bottom: 10px;
    .einp{
      width: 320px;
    }
    .name{
      line-height: 40px;
      padding-right: 30px;
      font-size: 14px;
      color: #333333;
      text-align: right;
    }
    .line40{
      line-height: 40px;
    }
  }
}

</style>

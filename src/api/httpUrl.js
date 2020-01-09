import { baseUrl, imgBaseUrl } from '@/config/env'
/*
* 配置API接口参数
*/

/* 配置接口 */
let httpUrl = {
  'mt_wxpay': baseUrl + '/api/wxpay/payByPc',     //微信支付
  'mt_alipay': baseUrl + '/api/pay/payByPc',     //支付宝支付
};
export {
    httpUrl
}


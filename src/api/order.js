import { async } from '@/config/fetch';

//创建订单
var mt_createOrder = (addressId,leaseOrderGoodsInfo,invoiceId,invitationCode,companyName,courierMoney) => async ('/api/order/createOrder', {
  addressId,leaseOrderGoodsInfo,invoiceId,invitationCode,companyName,courierMoney
},"POST");

//续租订单
var mt_renewalOrder = (reletId,addressId,leaseOrderGoodsInfo,invoiceId,invitationCode,companyName) => async ('/api/order/renewalOrder', {
  reletId,addressId,leaseOrderGoodsInfo,invoiceId,invitationCode,companyName
},"POST");

//获取我的订单
var mt_getOrder = (page, limit, status,name,orderNum,createTime) => async ('/api/order/getOrderByUser', {
  page, limit, status,name,orderNum,createTime
},"GET");

//获取我的续租订单
var mt_getReletOrderByUser = (page, limit, status,name,orderNum,createTime) => async ('/api/order/getReletOrderByUser', {
  page, limit, status,name,orderNum,createTime
},"GET");

//获取订单详情
var mt_getOrderDetail = (id) => async ('/api/order/getOrderDetail', {
  id
},"GET");

//查询续租订单原订单的商品
var mt_queryReletOrderGoods = (reletId) => async ('/api/order/queryReletOrderGoods', {
  reletId
},"GET");

//确认收货
var mt_confirmOrder = (orderId) => async ('/api/order/confirmOrder', {
  orderId
},"GET");

//订单申请售后
var mt_after_sales = (orderGoodsId,type,remark,img) => async ('/api/after_sales/insert', {
  orderGoodsId,type,remark,img
},"GET");

//评价商品
var mt_insertComment = (orderId,comments,score,img) => async ('/api/comment/insertComment', {
  orderId,comments,score,img
},"GET");


//查询商品评价   img:传值有图，不传无图
var mt_selectComment = (page,limit,goodsId,level,img) => async ('/web/comment/selectComment', {
  page,limit,goodsId,level,img
},"GET");

// 购物车添加商品
var mt_cartInsert = (goodsId, term, number) => async ('/api/cart/insert', {
  goodsId, term, number
},"GET");

// 商品咨询
var mt_goodsinsert = (goodsId, content) => async ('/api/leaseGoodsConsulting/insert', {
  goodsId, content
},"GET");


// 阿里pc订单支付
var mt_payByPc = (orderId, subject) => async ('/api/pay/payByPc', {
  orderId, subject
},"GET");

// 微信pc订单支付
var mt_wxpayByPc = (orderId, subject) => async ('/api/wxpay/payByNative', {
  orderId, subject
},"GET");

//支付是否成功
var mt_validateIsPaySuccess = (outTradeNo) => async ('/api/pay/payStatus', {
  outTradeNo
},"GET")

// 阿里pc充值
var mt_alipayRecharge = (subject, totalAmount) => async ('/api/pay/payByRecharge', {
  subject, totalAmount
},"GET");

// 微信pc充值
var mt_wxpayRecharge = (subject, totalAmount) => async ('/api/wxpay/payByPc', {
  subject, totalAmount
},"GET");

// 获取对公账户信息
var mt_querySystemBank = () => async ('/web/leaseSystemBank/querySystemBank', {
},"GET");

// 对公账户 打款确认
var mt_makeConfirm = (orderId,moneyRemark) => async ('/api/order/makeConfirm', {
  orderId,moneyRemark
},"GET");

export {
  mt_createOrder,
  mt_renewalOrder,
  mt_getOrder,
  mt_getReletOrderByUser,
  mt_getOrderDetail,
  mt_queryReletOrderGoods,
  mt_confirmOrder,
  mt_after_sales,
  mt_insertComment,
  mt_selectComment,
  mt_cartInsert,
  mt_goodsinsert,
  mt_payByPc,
  mt_wxpayByPc,
  mt_alipayRecharge,
  mt_wxpayRecharge,
  mt_validateIsPaySuccess,
  mt_querySystemBank,
  mt_makeConfirm
}

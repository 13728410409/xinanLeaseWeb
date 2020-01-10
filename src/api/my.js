import {
  async
} from '@/config/fetch';

//获取用户信息
var mt_getuserInfo = () => async ('/api/common/getUserInfo', {}, "GET", {
  'falseLoading': false
})

//编辑用户信息
var mt_edituserInfo = (headImg, nickName, newBirthday, gender) => async ('/api/common/updateUserInfo', {
  headImg,
  nickName,
  newBirthday,
  gender
}, "POST")

//获取交易记录
var mt_leaseMoneyDetail = (page, limit) => async ('/api/leaseMoneyDetail/selectAll', {
  page,
  limit
}, "GET")

//获取地址  type
var mt_getAddressList = () => async ('/api/address/selectAll', {}, "GET")

//添加地址
var mt_addAddress = (consignee, phone, address) => async ('/api/address/insert', {
  consignee,
  phone,
  address
}, "POST")

//修改地址
var mt_editAddress = (id, consignee, phone, address, isDefault) => async ('/api/address/update', {
  id,
  consignee,
  phone,
  address,
  isDefault
}, "POST")

//删除地址
var mt_deleteAddress = (id) => async ('/api/address/delete', {
  id
}, "GET")

//设为默认地址
var mt_setDefaultAddress = (id) => async ('/webUserAddresss/settingIsDefault', {
  id
}, "GET")

//企业信息填写
var mt_insertCompanyInfo = (type, name, number, companyAddress, contactsName, contactsPhone, imgs, legalManImgs, invitationCode) => async ('/api/common/insertCompanyInfo', {
  type,
  name,
  number,
  companyAddress,
  contactsName,
  contactsPhone,
  imgs,
  legalManImgs,
  invitationCode
}, "POST")

//查看企业信息
var mt_queryCompanyInfo = () => async ('/api/common/queryCompanyInfo', {}, "POST")

//修改企业信息
var mt_updateCompanyInfo = (type, name, number, companyAddress, contactsName, contactsPhone, imgs, legalManImgs) => async ('/api/common/updateCompanyInfo', {
  type,
  name,
  number,
  companyAddress,
  contactsName,
  contactsPhone,
  imgs,
  legalManImgs
}, "POST")


var mt_queryJoinDescribe = (type) => async ('/web/queryJoinDescribe', {
  type
}, "GET")

var mt_insertLeaseJoinUs = (companyName,  phone,  email,  contactName,  remark) => async ('/web/leaseJoinUs/insertLeaseJoinUs', {
  companyName,
  phone,
  email,
  contactName,
  remark
}, "POST")

//获取的角色
var mt_getJinPaiInfo = () => async ('/web/leaseJoinUs/getJinPaiInfo', {}, "GET")

//查询我的加盟信息
var mt_queryMyFranchise = () => async ('/api/joinUs/queryMyFranchise', {}, "GET")

//申请加盟
var mt_applyJoin = (type, name, number, userType, companyAddress, contactsName, contactsPhone, imgs, legalManImgs, companyInfo, invitationCode, agentRegion) => async ('/api/joinUs/applyJoin', {
  type,
  name,
  number,
  userType,
  companyAddress,
  contactsName,
  contactsPhone,
  imgs,
  legalManImgs,
  companyInfo,
  invitationCode,
  agentRegion
}, "POST")

// 加盟费微信支付
var mt_payJoinUs_wxpay = (firId) => async ('/api/wxpay/payJoinUs', {
  firId
}, "GET")

// 加盟费阿里支付
var mt_payJoinUs_alipay = (firId) => async ('/api/pay/payJoinUs', {
  firId
}, "GET")

// 天使微信支付
var mt_wxpayByAngel = () => async ('/api/wxpay/payByAngel', {
}, "GET")

// 天使支付宝充值
var mt_alipayByAngel = () => async ('/api/pay/payByAngel', {
}, "GET")


//我的收益统计
var mt_selectMyEarnings = () => async ('/api/earning/selectMyEarnings', {}, "GET")


//收益分页查询
var mt_queryEarningPage = (type, startTime, orderNum, page, limit) => async ('/api/earning/queryEarningPage', {
  type,
  startTime,
  orderNum,
  page,
  limit
}, "GET")

//分页查询我的客户
var mt_queryMyCustomer = (phone, page, limit) => async ('/api/common/queryMyCustomer', {
  phone,
  page,
  limit
}, "GET")

// 查看我的客户的订单
var mt_queryMyCustomerOrder = (creator, orderNum, startTime, page, limit) => async ('/api/order/queryMyCustomerOrder', {
  creator,
  orderNum,
  startTime,
  page,
  limit
}, "GET")

//我的销售分页查询接口
var mt_queryMySales = (phone, page, limit) => async ('/api/common/queryMySales', {
  phone,
  page,
  limit
}, "GET")

// 查询销售的订单
var mt_queryOrderByInvCode = (invitationCode, orderNum, startTime, page, limit) => async ('/api/order/queryOrderByInvCode', {
  invitationCode,
  orderNum,
  startTime,
  page,
  limit
}, "GET")

// 销售的启用禁用
var mt_disableSale = (id, isEnable) => async ('/api/common/disableSale', {
  id,
  isEnable
}, "GET")

// 批量新增销售
// [{"userName":"2222","phone":"2222"},{"userName":"6666","phone":"6666"}]
var mt_batchAddUser = (sales) => async ('/api/common/batchAddUser', {
  sales
}, "POST")

// 代理商区域内的金牌
var mt_queryMyMedal = (contactsPhone, page, limit) => async ('/api/common/queryMyMedal', {
  contactsPhone,
  page,
  limit
}, "GET")


export {
  mt_getuserInfo,
  mt_edituserInfo,
  mt_leaseMoneyDetail,
  mt_getAddressList,
  mt_addAddress,
  mt_editAddress,
  mt_deleteAddress,
  mt_setDefaultAddress,
  mt_insertCompanyInfo,
  mt_queryCompanyInfo,
  mt_queryJoinDescribe,
  mt_insertLeaseJoinUs,
  mt_getJinPaiInfo,
  mt_queryMyFranchise,
  mt_applyJoin,
  mt_payJoinUs_wxpay,
  mt_payJoinUs_alipay,
  mt_wxpayByAngel,
  mt_alipayByAngel,
  mt_selectMyEarnings,
  mt_queryEarningPage,
  mt_queryMyCustomer,
  mt_queryMyCustomerOrder,
  mt_queryMySales,
  mt_queryOrderByInvCode,
  mt_disableSale,
  mt_batchAddUser,
  mt_queryMyMedal
}

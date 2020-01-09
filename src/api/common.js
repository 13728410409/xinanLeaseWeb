import { async } from '@/config/fetch';

//发送短信验证码   1 登陆，2注册，3提示
var mt_register_code = (phone,type) => async ('/web/sms/sendMsgCode', {
  phone,type
},"GET");

//手机号、密码登录
var mt_login = (phone,password) => async ('/web/common/login', {
  phone,password
},"GET");

//手机号、验证码登录
var mt_loginByPhone = (phone,code) => async ('/web/common/loginByPhone', {
  phone,code
},"GET");

//账号（手机号）、密码注册用户
var mt_register = (phone,code,password,invitationCode) => async ('/web/common/registerByPassword', {
  phone,code,password,invitationCode
},"GET");

//邀请天使入驻
var mt_registerByAngel = (phone,code,invitCode) => async ('/web/common/registerByAngel', {
  phone,code,invitCode
},"GET");

//修改密码
var mt_updatePwd = (phone,vcode,password) => async ('/web/common/updatePwd', {
  phone,vcode,password
},"GET");

//获取热线电话
var mt_commonPhone = () => async ('/common/commonPhone', {
},"GET");


//获取七牛云上传token信息
var mt_getQnToken = () => async ('/web/qiniu/getUpToken', {},"GET");




//获取购物车列表
var mt_selectAllcart = () => async ('/api/cart/selectAll', {
  
},"GET");

//购物车 添加商品
var mt_insertcart = (list) => async ('/api/cart/insert', {
  list
},"POST");

//购物车 添加商品
var mt_deletecart = (ids) => async ('/api/cart/delete', {
  ids
},"GET");

//租赁指南
var mt_question = () => async ('/web/question/selectAll', {
},"GET");

//获取合作伙伴
var mt_queryPartners = () => async ('/web/queryPartners', {
},"GET");

//获取首页加盟商
var mt_queryAllianceBusiness = () => async ('/web/queryAllianceBusiness', {
},"GET");

//租赁指南
var mt_questionselectAll = (type,content) => async ('/web/question/selectAll', {
  type,content
},"GET");


//获取新闻中心数据
var mt_newselectAll = (type,title,page,limit) => async ('/web/new/selectAll', {
  type,title,page,limit
},"GET");


//获取热门商品 或者 最新商品的查询
// 1热门商品 2最新商品
var mt_queryHotOrNewGoods = (type) => async ('/web/goods/queryHotOrNewGoods', {
  type
},"GET");

//分享注册用户
var mt_invitation = (phone,code,uId,type,uType) => async ('/share/invitation', {
  phone,code,uId,type,uType
},"POST");

//web 绑定手机号 微信unionId
var mt_loginByWxAndPhone = (phone,code,unionId,nickname,sex) => async ('/loginByWxAndPhone', {
  phone,code,unionId,nickname,sex
},"POST");

//平台协议
var mt_aggrement = (type) => async ('/web/leaseUserAgreement/selectAll', {
  type
},"GET");


export {
  mt_register_code,
  mt_login,
  mt_loginByPhone,
  mt_register,
  mt_registerByAngel,
  mt_updatePwd,
  mt_commonPhone,
  mt_getQnToken,
  mt_selectAllcart,
  mt_insertcart,
  mt_deletecart,
  mt_question,
  mt_queryPartners,
  mt_queryAllianceBusiness,
  mt_questionselectAll,
  mt_newselectAll,
  mt_queryHotOrNewGoods,
  mt_invitation,
  mt_loginByWxAndPhone,
  mt_aggrement,
  
}
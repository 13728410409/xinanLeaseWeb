import { async } from '@/config/fetch';

//获取一级菜单
var mt_selectFirstMenu= () => async ('/web/goods_menu/selectFirstMenu', {
  
},"GET");

//首页轮播
var mt_lunbo = () => async ('/web/lunbo/selectFirstAll', {
},"GET");

//首页商品
var mt_queryHomeGoods= (page,limit) => async ('/web/goods/queryHomeGoods', {
  page,limit
},"GET");

//获取二级菜单
var mt_selectSecondMenu= (pid) => async ('/web/goods_menu/selectSecondMenu', {
  pid
},"GET");
//获取二级轮播
var mt_lunboselectSecondAll = () => async ('/web/lunbo/selectSecondAll', {
},"GET");

//获取二级类型各分类商品
var mt_querySecondPage= (menuId) => async ('/web/goods/querySecondPage', {
  menuId
},"GET");

//根据条件查询商品列表
var mt_getGoodsByCondition= (goodsType,goodsBrand,goodsStatus,goodsMoeny,goodsWay,goodsPeoples,name,menuId,money,goodSort,page,limit) => async ('/web/goods/getGoodsByCondition', {
  goodsType,goodsBrand,goodsStatus,goodsMoeny,goodsWay,goodsPeoples,name,menuId,money,goodSort,page,limit
},"POST");

//获取精选商品
var mt_getGoodsBySelected= () => async ('/web/goods/getGoodsBySelected', {
},"GET");


//商品详情
var mt_getGoodsById= (id) => async ('/web/goods/getGoodsById', {
  id
},"GET");

// 获取商品的属性
var mt_getGoodsAttr= () => async ('/web/goods/getGoodsAttr', {
},"GET");


//获取发票信息
var mt_getinvoice = () => async ('/api/invoice/selectOne', {
},"GET");

//发票新增或修改
var mt_invoice = (type,name,taxNum,address,id) => async ('/api/invoice/edit', {
  type,name,taxNum,address,id
},"POST");

export {
  mt_selectFirstMenu,
  mt_lunbo,
  mt_queryHomeGoods,
  mt_selectSecondMenu,
  mt_querySecondPage,
  mt_getGoodsByCondition,
  mt_getGoodsBySelected,
  mt_lunboselectSecondAll,
  mt_getGoodsById,
  mt_getGoodsAttr,
  mt_getinvoice,
  mt_invoice,
}

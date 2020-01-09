import { async } from '@/config/fetch';

//获取用户消息
var mt_getMsg = (type,page,limit) => async ('/api/notice/selectAll', {
  type,page,limit
},"GET");

var mt_alreadyRead = (id) => async ('/api/notice/read', {
 id
},"POST");

var mt_readAll = () => async ('/api/notice/readAll', {
 },"GET");

 //获取用户未读数
var mt_queryUnRead = () => async ('/api/notice/queryUnRead', {
},"GET");

export {
  mt_getMsg,
  mt_alreadyRead,
  mt_readAll,
  mt_queryUnRead,
}
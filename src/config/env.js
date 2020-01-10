/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

let baseUrl = ''; 
let websiteUrl = ''; 
let imgBaseUrl = '';
let routerMode = 'history';
if (process.env.NODE_ENV === 'development') {
	// baseUrl = 'http://192.168.5.3:8080' // 帅伟本地
	// baseUrl = 'http://192.168.5.74:8080' // 思洁本地
	// baseUrl = 'http://test.dbbst.com:8080'        //测试服务器
	baseUrl = 'https://www.xinanzulin.com/api'        //正式服务器

	websiteUrl = 'http://localhost:8080' // 地址
}else if(process.env.NODE_ENV === 'production'){
  baseUrl = 'https://www.xinanzulin.com/api'        //正式服务器
  websiteUrl = 'https://www.xinanzulin.com' // 地址
}
export {
	baseUrl,
	websiteUrl,
	routerMode,
	imgBaseUrl,
}
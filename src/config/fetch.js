import store from '@/config/store'
import router from '../router'
import { Message } from 'element-ui'
import {
  baseUrl
} from '@/config/env'

//请求方法
//noTip不显示提示         success请求成功执行的回调函数
//option{noTip:true,success:function(){}}
function async (url = '', data = {}, type = 'GET', options = {}, httpUrl = baseUrl) {
  let ajaxType = type.toUpperCase();
  url = httpUrl + url;
  let dataStr = ''; //数据拼接字符串
  if (type == 'FORM') {
    ajaxType = 'POST';
    dataStr = data;
  } else if (type == 'PUT') {
    if (options.putType == 'file') {
      dataStr = data;
    } else {
      dataStr = JSON.stringify(data);
    }

  } else {
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })
    //匹配最后一个&并去除
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
    }
    if (type == 'GET') {
      url = dataStr!=''&&dataStr!=null ? url + '?' + dataStr : url
      dataStr = "";
    } else if (type == 'JSONP') {
      url = url + '?' + dataStr + '&callback=process';
      dataStr = "";
    }
  }
  return new Promise((resolve, reject) => {
    // if (!options.load) {
    //   store.commit('setDataLoading', true)
    // }
    if (type == 'JSONP') {
      window.process = function (data) {
        resolve(data);
      }
      var script = document.createElement("script");
      script.src = url;
      
      document.head.appendChild(script);
      // 及时删除，防止加载过多的JS
      document.head.removeChild(script);
      // store.commit('setDataLoading', false);
    } else {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }
      requestObj.open(ajaxType, url, true);
      // requestObj.withCredentials = true;//通过将withCredentials属性设置为true，可以指定某个请求应该发送凭据
      if (type != 'FORM') {
        if (type == 'PUT' && options.putType != 'file') {
          requestObj.setRequestHeader("Content-Type", "application/json");
        } else if (type != 'PUT') {
          requestObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        }
      }
      if (options.language) {
        requestObj.setRequestHeader("Accept-Language", "zh-CN,zh;q=0.8");
      }
      if(httpUrl == baseUrl){
        let user_token = JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).token : '';
        // let user_token = userInfo.token
        if(user_token!=''){
          requestObj.setRequestHeader("user_token", user_token);
        }
      }
      requestObj.send(dataStr);
      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response;
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            if(handle(obj).code=='0000'){
              resolve(handle(obj))
            }else if(handle(obj).code=='1000'){
              localStorage.removeItem('userInfo')
              localStorage.removeItem('shoppingInfo')
              localStorage.removeItem('newsInfo')
              router.push('/login')
            }else{
              Message({
                showClose: true,
                message: handle(obj).info,
                type: 'warning',
                duration: 1000
              })
            }
          } else {
            reject(requestObj)
          }
          // store.commit('setDataLoading', false)
        }
      }
    }
  })
  //	}
  //数据处理
  function handle(obj) {
    // //console.log(obj)
    if (parseInt(obj.code) == 0) {
      return obj;
    } else if (parseInt(obj.code) == 1000) {
      // $vm.$router.push('/');
      return obj;
    } else {
      return obj;
    }
  }
}

export {
  async
}

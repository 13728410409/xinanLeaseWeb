import * as qiniu from "qiniu-js";
import axios from 'axios'
import { httpUrl } from '@/api/httpUrl'
import { mt_getQnToken } from '@/api/common'
export default function (files) {
  //文件名称随机数
  var randomChar = function (l, url = "") {
    const x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    var time = new Date();
    for (var i = 0; i < l; i++) {
      tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return (
      "upload/" +
      time.getFullYear() +
      time.getMonth() +
      "/" +
      time.getDate() +
      "/" +
      url +
      time.getTime() +
      tmp
    );
  };
  //获取token
  var storageArea = ''
  var getToken = function (callback) {
    mt_getQnToken().then(data => {
      //地区
      storageArea = data.data.storageArea
      //console.log(storageArea)
      callback(data.data);
    })    
    // axios.get(httpUrl.qnUpload,).then(data => {
    //     if (data.data.success == true) {
    //         callback(data.data.data);
    //     }else{
    //         this.prompt(data.info);
    //     }
    // }).catch(function(error) {});

  }

  const _this = this;
  //文件数据体长度
  var len = files.length;
  //token
  var token = "";
  //上传文件夹
  var folderPath = "";
  //访问前缀
  var visitPrefix = "";
  var region 
  
  if(storageArea=='huadong'){
    region = qiniu.region.z0
  }else if(storageArea=='huabei'){
    region = qiniu.region.z1
  }else if(storageArea=='huanan'){
    region = qiniu.region.z2
  }else if(storageArea=='beimei'){
    region = qiniu.region.na0
  }else if(storageArea=='dongnanya'){
    region = qiniu.region.as0
  }
  
  var config = {
    //表示是否使用 cdn 加速域名
    useCdnDomain: true,
    //qiniu.region.z0: 代表华东区域
    // qiniu.region.z1: 代表华北区域
    // qiniu.region.z2: 代表华南区域
    // qiniu.region.na0: 代表北美区域
    // qiniu.region.as0: 代表东南亚区域
    // region: qiniu.region.z0
    region: region
    //是否禁用日志报告
    // disableStatisticsReport: false
  };
  var putExtra = {
    //文件原文件名
    fname: "",
    // 用来放置自定义变量
    params: {},
    // 用来限制上传文件类型 ,限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
    mimeType: [] || null
  };
  return new Promise((resolve, reject) => {
    getToken(red => {
      token = red.upToken;
      folderPath = red.uuid;
      visitPrefix = red.domain;
      recursive(0);
    });
    //递归上传图片
    function recursive(i) {
      //文件上传配置
      var observable = qiniu.upload(
        files[i],
        randomChar(8),
        token,
        putExtra,
        config
      );
      //文件开始上传
      var subscription = observable.subscribe(
        res => {
          //图片上传进度
          // //console.log("图片上传进度", res.total.percent);
        },
        err => {
          //图片报错
          // //console.log(err);
          reject(err);
        },
        res => {
          resolve(visitPrefix + "/" + res.key, true);
          //图片上传完成
          if (i < len - 1) {
            recursive(i++);
          } else {
            // event.target.value = "";
          }
        }
      );
    }
  });
}

// 上传取消
// subscription.unsubscribe();

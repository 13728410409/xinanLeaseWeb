/**
* 公共方法
*
* 删除数组元素 用法：arrayRemove(arr, val)
*
* 检测数组否存在元素 用法：isInArray(arr, val)
*
* 添加删除class 用法： toggleClass(elements,cName)
*
* 过滤星期 [1,1,0,1,1,0,0] 返回星期一至星期五或星期一、星期三、星期四  用法： filterWeek(value)
*
*/

//时间戳转换为时间 formatDate('yyyy-MM-dd hh:mm:ss')
export function formatDate(date, fmt) {
  var date = new Date(date);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
export function computedStrLen(str) {
  if (str == null) return 0;
  if (typeof str != "string"){
    str += "";
  }
  return str.replace(/[^\x00-\xff]/g,"ab").length;
}

//补全输入的金额
// formatNum('13213.24'); //输出13,213.34
// formatNum('132134.2'); //输出132,134.20
// formatNum('132134'); //输出132,134.00
export function formatNum(str){
  // str = toString(str)
  var newStr = "";
  var count = 0;
  
  if(str.indexOf(".")==-1){
   for(var i=str.length-1;i>=0;i--){
    if(count % 3 == 0 && count != 0){
     newStr = str.charAt(i) + "," + newStr;
    }else{
     newStr = str.charAt(i) + newStr;
    }
    count++;
   }
   str = newStr + ".00"; //自动补小数点后两位
  }else{
   for(var i = str.indexOf(".")-1;i>=0;i--){
    if(count % 3 == 0 && count != 0){
     newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
    }else{
     newStr = str.charAt(i) + newStr; //逐个字符相接起来
    }
    count++;
   }
   str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
  }
  // return str
  console.log(Number(str))
  return Number(str)
}



// 删除数组中的某个元素
export function arrayRemove(arr, val) {
  var index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 判断数组中是否存在元素
export function isInArray(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (val === arr[i]) {
      return true;
    }
  }
  return false
}

//返回元素在数组中出现第一次的索引
export function firstShow(arr, item) {
  if (Array.prototype.indexOf) {
    return arr.indexOf(item);
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        console.log(i)
        return i;
      } else {
        return -1;
      }
    }
  }
}

//判断是否有class
function hasClass(obj, cls) {
  return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

//添加class
export function addClass(elements, cName) {
  if (!hasClass(elements, cName)) {
    elements.className += " " + cName
  }
}

//删除class
export function removeClass(elements, cName) {
  if (hasClass(elements, cName)) {
    // replace方法是替换
    elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ")
  }
}

//添加或删除某个class
export function toggleClass(elements, cName) {
  if (hasClass(elements, cName)) {
    removeClass(elements, cName)
  } else {
    addClass(elements, cName)
  }
}

//限制只能输入金额  小数点后只能有两位小数
export function checkInput(t) {
  let reg = /^[0-9]\d*(\.\d{1,2})?$|^[0]\.\d{1,2}$/g;
  return reg.test(t)
}
//限制只能输入大于等于0的数字
export function checkDouble(t) {
  let reg = /^[0-9]\d*$/g;
  return reg.test(t)
}

//过滤星期 [1,1,0,1,1,0,0] 返回星期一至星期五或星期一、星期三、星期四
export function filterWeek(value) {
  let state = true
  let num = 0
  let arr = new Array()
  for (let i = 0; i < value.length; i++) {
    if (value[i] == 1) {
      switch (i) {
        case 0: arr.push('星期一')
          break
        case 1: arr.push('星期二')
          break
        case 2: arr.push('星期三')
          break
        case 3: arr.push('星期四')
          break
        case 4: arr.push('星期五')
          break
        case 5: arr.push('星期六')
          break
        case 6: arr.push('星期日')
          break
      }
    }
  }
  for (let i = 0; i < value.length; i++) {
    if (value[i] == 1) {
      num++
    }
  }
  let arrLen = arr.length
  let index = firstShow(value, 1)
  if (arr.length == 1) {
    return arr[0]
  } else {
    for (let i = index; i < (num + index - 1); i++) {
      if (value[i] != value[i + 1]) {
        state = false
      }
    }
    if (state == true) {
      return arr[0] + '至' + arr[arrLen - 1]
    } else {
      let htm = ''
      for (let i = 0; i < arr.length; i++) {
        let str = ''
        if (i == arrLen - 1) {
          str = arr[i]
        } else {
          str = arr[i] + '、'
        }
        htm += str
      }
      return htm
    }
  }
}
//过滤星期 [1,1,0,1,1,0,0] 返回数组 ['星期一','星期三','星期四']
export function filterWeekArray(value) {
  let arr = new Array()
  for (let i = 0; i < value.length; i++) {
    if (value[i] == 1) {
      switch (i) {
        case 0: arr.push('星期一')
          break
        case 1: arr.push('星期二')
          break
        case 2: arr.push('星期三')
          break
        case 3: arr.push('星期四')
          break
        case 4: arr.push('星期五')
          break
        case 5: arr.push('星期六')
          break
        case 6: arr.push('星期日')
          break
      }
    }
  }
  return arr
}

//过滤星期['星期一','星期三','星期四'] 返回数组 [1,0,1,1,0,0,0]
export function filterWeekGDArr(value) {
  let arr = [0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < value.length; i++) {
    if (value[i] == '星期一') {
      arr[0] = 1
    } else if (value[i] == '星期二') {
      arr[1] = 1
    } else if (value[i] == '星期三') {
      arr[2] = 1
    } else if (value[i] == '星期四') {
      arr[3] = 1
    } else if (value[i] == '星期五') {
      arr[4] = 1
    } else if (value[i] == '星期六') {
      arr[5] = 1
    } else if (value[i] == '星期日') {
      arr[6] = 1
    }
  }
  return arr
}

//过滤星期[1,2,3,4,5,6,7] 返回数组['星期一','星期三','星期四']
export function filterNumberWeek(value) {
  let arr = new Array()
  for (let i = 0; i < value.length; i++) {
    if (value[i] == 1) {
      arr.push('星期一')
    } else if (value[i] == 2) {
      arr.push('星期二')
    } else if (value[i] == 3) {
      arr.push('星期三')
    } else if (value[i] == 4) {
      arr.push('星期四')
    } else if (value[i] == 5) {
      arr.push('星期五')
    } else if (value[i] == 6) {
      arr.push('星期六')
    } else if (value[i] == 7) {
      arr.push('星期日')
    }
  }
  return arr
}


//过滤星期['星期一','星期三','星期四'] 返回数组[1,2,3,4,5,6,7]
export function filterWeekNumber(value) {
  let arr = new Array()
  for (let i = 0; i < value.length; i++) {
    if (value[i] == '星期一') {
      arr.push(1)
    } else if (value[i] == '星期二') {
      arr.push(2)
    } else if (value[i] == '星期三') {
      arr.push(3)
    } else if (value[i] == '星期四') {
      arr.push(4)
    } else if (value[i] == '星期五') {
      arr.push(5)
    } else if (value[i] == '星期六') {
      arr.push(6)
    } else if (value[i] == '星期日') {
      arr.push(7)
    }
  }
  return arr
}



//生成a位随机数
export function getRandom(a) {
  let rand = "";
  for (var i = 0; i < a; i++) {
    var r = Math.floor(Math.random() * 10);
    rand += r;
  }
  return rand
}

//根据日期计算年龄 jsGetAge('yyyy-MM-dd')
export function jsGetAge(strBirthday) {
  var returnAge;
  var strBirthdayArr=strBirthday.split("-");
  var birthYear = strBirthdayArr[0];
  var birthMonth = strBirthdayArr[1];
  var birthDay = strBirthdayArr[2];
  
  var d = new Date();
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();
  
  if(nowYear == birthYear){
      returnAge = 0;//同年 则为0岁
  }
  else{
      var ageDiff = nowYear - birthYear ; //年之差
      if(ageDiff > 0){
          if(nowMonth == birthMonth) {
              var dayDiff = nowDay - birthDay;//日之差
              if(dayDiff < 0)
              {
                  returnAge = ageDiff - 1;
              }
              else
              {
                  returnAge = ageDiff ;
              }
          }
          else
          {
              var monthDiff = nowMonth - birthMonth;//月之差
              if(monthDiff < 0)
              {
                  returnAge = ageDiff - 1;
              }
              else
              {
                  returnAge = ageDiff ;
              }
          }
      }
      else
      {
          returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
      }
  }
  return returnAge;//返回周岁年龄
}

// 计算经纬度直线距离
export function getDistance(lat1,lng1,lat2,lng2) {
  var f = getRad((lat1 + lat2)/2);     
  var g = getRad((lat1 - lat2)/2);     
  var l = getRad((lng1 - lng2)/2);     
  var sg = Math.sin(g);     
  var sl = Math.sin(l);     
  var sf = Math.sin(f);     
  var s,c,w,r,d,h1,h2;     
  var a = 6378137.0;//The Radius of eath in meter.   
  var fl = 1/298.257;     
  sg = sg*sg;     
  sl = sl*sl;     
  sf = sf*sf;     
  s = sg*(1-sl) + (1-sf)*sl;     
  c = (1-sg)*(1-sl) + sf*sl;     
  w = Math.atan(Math.sqrt(s/c));     
  r = Math.sqrt(s*c)/w;     
  d = 2*w*a;     
  h1 = (3*r -1)/2/c;     
  h2 = (3*r +1)/2/s;     
  s = d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));   
  s = s/1000;   
  s = s.toFixed(2);//指定小数点后的位数。   
  return s; 
}
function getRad(d){   
  var PI = Math.PI;    
  return d*PI/180.0;    
}
export function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}
// 浮点乘法
export function accMul(arg1,arg2){ 
  var m=0,s1=arg1.toString(),s2=arg2.toString(); 
  try{m+=s1.split(".")[1].length}catch(e){} 
  try{m+=s2.split(".")[1].length}catch(e){} 
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
} 

export function uniq(array){
  var temp = [];
  var index = [];
  var l = array.length;
  for(var i = 0; i < l; i++) {
      for(var j = i + 1; j < l; j++){
          if (array[i] === array[j]){
              i++;
              j = i;
          }
      }
      temp.push(array[i]);
      index.push(i);
  }
  return temp;
}


export default {
  formatDate,
  formatNum,
  computedStrLen,
  arrayRemove,
  isInArray,
  firstShow,
  addClass,
  removeClass,
  toggleClass,
  checkInput,
  checkDouble,
  filterWeek,
  filterWeekArray,
  filterWeekGDArr,
  filterNumberWeek,
  filterWeekNumber,
  getRandom,
  jsGetAge,
  getDistance,
  compare,
  accMul,
  uniq
}
// import { parseTime } from '@/ruoyi'

import { downloadFile } from "@/api/proofDigital";
import { ElMessage, ElLoading,ElMessageBox } from 'element-plus';
import { saveAs } from 'file-saver';
import { blobValidate } from '@/utils/ruoyi'
import currency from 'currency.js'

export function showMoney(val){
  if (val=='-') {
    return val
  }
  return currency(val,{symbol:''}).format()
}

/**
 * 表格时间格式化
 */
export function formatDate(cellValue) {
  if (cellValue == null || cellValue == "") return "";
  var date = new Date(cellValue);
  var year = date.getFullYear();
  var month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
}
/**
 * 表格时间格式化(年月日)
 */
export function formatDates(cellValue) {
  if (cellValue == null || cellValue == "") return "";
  var date = new Date(cellValue);
  var year = date.getFullYear();
  var month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return year + "-" + month + "-" + day;
}
//近三个月时间
export function LastThreeMonths2() {
  return [
    formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90),
    formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000),
  ];
}
export function LastThreeMonths() {
  return [
    formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90),
    formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1),
  ];
}
/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  // if (option) {
  //   return parseTime(time, option)
  // } else {
  return (
    d.getMonth() +
    1 +
    "月" +
    d.getDate() +
    "日" +
    d.getHours() +
    "时" +
    d.getMinutes() +
    "分"
  );
  //   }
}
/**
 * 把时间里面的T替换成空格
 */
export function parseDate(date, flag) {
  if (date) {
    let dateStr = String(date).replace("T", " ");
    return dateStr;
  } else if (flag) {
    return "";
  } else {
    return "-";
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

// 获取文件名称
export function getFileName(name) {
  if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1);
  } else {
    return name;
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
// export function debounce(func, wait, immediate) {
//   let timeout, args, context, timestamp, result;

//   const later = function () {
//     // 据上一次触发时间间隔
//     const last = +new Date() - timestamp;

//     // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
//     if (last < wait && last > 0) {
//       timeout = setTimeout(later, wait - last);
//     } else {
//       timeout = null;
//       // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
//       if (!immediate) {
//         result = func.apply(context, args);
//         if (!timeout) context = args = null;
//       }
//     }
//   };

//   return function (...args) {
//     context = this;
//     timestamp = +new Date();
//     const callNow = immediate && !timeout;
//     // 如果延时不存在，重新设定延时
//     if (!timeout) timeout = setTimeout(later, wait);
//     if (callNow) {
//       result = func.apply(context, args);
//       context = args = null;
//     }
//     console.log('result',result)
//     return result;
//   };
// }
export const debounce = (fn, wait) => {
  var timer, startTimeStamp = 0;
  var context, args;

  var run = (timerInterval) => {
    timer = setTimeout(() => {
      var now = (new Date()).getTime();
      var interval = now - startTimeStamp
      if (interval < timerInterval) { // the timer start time has been reset, so the interval is less than timerInterval
        console.log('debounce reset', timerInterval - interval);
        startTimeStamp = now;
        run(wait - interval);  // reset timer for left time 
      } else {
        fn.apply(context, args);
        clearTimeout(timer);
        timer = null;
      }

    }, timerInterval);
  }

  return function () {
    context = this;
    args = arguments;
    var now = (new Date()).getTime();
    startTimeStamp = now;

    if (!timer) {
      console.log('debounce set', wait);
      run(wait);    // last timer alreay executed, set a new timer
    }

  }

}
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + "";
  const randomNum = parseInt((1 + Math.random()) * 65536) + "";
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => map[val.toLowerCase()] : (val) => map[val];
}

export const exportDefault = "export default ";

export const beautifierConf = {
  html: {
    indent_size: "2",
    indent_char: " ",
    max_preserve_newlines: "-1",
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "separate",
    brace_style: "end-expand",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: "110",
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
  js: {
    indent_size: "2",
    indent_char: " ",
    max_preserve_newlines: "-1",
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "normal",
    brace_style: "end-expand",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: "110",
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
};

// 首字母大小
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

// 下划转驼峰
export function camelCase(str) {
  return str.replace(/_[a-z]/g, (str1) => str1.substr(-1).toUpperCase());
}

export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
}
//将阿拉伯数字'1'转中文数'一'
export function toChineseNumber(n) {
  if (!Number.isInteger(n) && n < 0) {
    throw Error("请输入自然数");
  }
  const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const positions = [
    "",
    "十",
    "百",
    "千",
    "万",
    "十万",
    "百万",
    "千万",
    "亿",
    "十亿",
    "百亿",
    "千亿",
  ];
  const charArray = String(n).split("");
  let result = "";
  let prevIsZero = false;
  //处理0  deal zero
  for (let i = 0; i < charArray.length; i++) {
    const ch = charArray[i];
    if (ch !== "0" && !prevIsZero) {
      result += digits[parseInt(ch)] + positions[charArray.length - i - 1];
    } else if (ch === "0") {
      prevIsZero = true;
    } else if (ch !== "0" && prevIsZero) {
      result +=
        "零" + digits[parseInt(ch)] + positions[charArray.length - i - 1];
    }
  }
  //处理十 deal ten
  if (n < 100) {
    result = result.replace("一十", "十");
  }
  return result;
}
/**
 * @param {Object} newVal 修改过后的OBJ
 * @param {Object} oldVal 修改前的OBJ
 * @return {Object} obj 返回不同的属性
 */
export function checkChange(newVal, oldVal) {
  let obj = {};
  for (const key in newVal) {
    if (
      newVal[key] !== oldVal[key] &&
      newVal[key] != undefined &&
      newVal[key] != "-" &&
      !Array.isArray(newVal[key])
    ) {
      obj[key] = newVal[key];
    }
  }
  if (Object.keys(obj).length === 0) {
    return false;
  } else {
    obj.id = newVal.id;
    return obj;
  }
}
let downloadLoadingInstance;
//印前文件下载
export function downPrepressFile(list, name) {
  if (list.length == 0) {
    ElMessage.error("没有" + name);
    return;
  }
  downloadLoadingInstance = ElLoading.service({
    text: "文件下载中，请稍候",
    background: "rgba(0, 0, 0, 0.7)",
  });
  downloadFile({ fileUrls: list, name: name })
    .then(async (res) => {
      let fileName = "";
      try {
        let str = res.headers["content-disposition"]?.split("filename=")[1];
        if (str) {
          fileName = decodeURI(str);
        } else {
          fileName = false;
        }
      } catch (error) {
        fileName = false;
      }
      const isLogin = await blobValidate(res.data);
      if (isLogin) {
        const blob = new Blob([res.data]);
        saveAs(blob, fileName);
      } else {
        const resText = await res.data.text();
        const rspObj = JSON.parse(resText);
        const errMsg =
          errorCode[rspObj.code] || rspObj.msg || errorCode["default"];
        ElMessage.error(errMsg);
      }
      downloadLoadingInstance.close();
    })
    .catch((r) => {
      console.error(r);
      ElMessage.error("下载文件出现错误，请联系管理员！");
      downloadLoadingInstance.close();
    });
}
export function clearInput(e) {
  let key = e.key;
  if (key === "e" || key === "E" || key === "+" || key === "-") {
    e.returnValue = false;
    return false;
  }
  return true;
}
/**
 * 跳转到旧后台
 * @param {*} po
 * @returns
 */
export function toOldAdmin(po,type){
  if (!po) {
    return;
  }
  if(type==='1'){
    let str = po.split('-')[0]
    window.open(`${window.origin}/admin/design_demand/detail.html?id=${str}`,'_blank')
  }else{
    window.open(`${window.origin}/admin/order/detail/id/${po}.html`,'_blank')
  }
}
/**
 * 转换url的特殊字符串
 * @param {*} url
 * @returns
 */
export function senseUrl(url = "") {
  if (typeof url === "string") {
    let strList = ["+", " "];
    for (const item of strList) {
      url = url.replace(new RegExp("\\" + item, "g"), encodeURIComponent(item));
    }
  }
  return url;
}
export function getHour(time){
  if(!time) return 0
  let date1= time;  //开始时间
  let date2 = new Date();    //结束时间
  let date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数      
  let days=Math.floor(date3/(24*3600*1000))*24
  let leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
  let hours=Math.floor(leave1/(3600*1000))
  //计算相差分钟数
  let leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
  let minutes=(Math.floor(leave2/(60*1000))/60)
  return ((days+hours)+minutes).toFixed(1)
}

/**
 * 计算业务员是否含税金
 * @param {boolean} isTax //是否含税，true含税 false不含税
 * @param {number} price //输入的金额
 * @param {number} taxPoint //税点
 * @param {number} type //类型 1表示返回税金 2表示返回合同金额价格
 * @returns
 */
export function whetherThePriceIncludesTax(isTax, price, taxPoint, type) {
  let tax = 0; //税金
  let includesTax = 0; //
  if (isTax) {
    includesTax = Math.round((parseFloat(price) / (1 + taxPoint)) * 100) / 100;
    tax = Math.round((parseFloat(price) - includesTax) * 100) / 100;
  } else {
    tax = Math.round(parseFloat(price) * taxPoint * 100) / 100;
    includesTax = Math.round((parseFloat(price) + tax) * 100) / 100;
  }
  if (type === 1) {
    return tax;
  } else {
    return includesTax;
  }
}
/**
 * 导出下载excel文件
 * @param {Function} func 请求方法
 * @param {object} data 查询条件
 * @param {function} callBack 回调方法
 */
export function downloadExcel(func, data, callBack=() => {}) {
  return new Promise((resolve,reject) => {
    func(data).then(async res => {
      let fileName  = ''
        try {
          let str = res.headers['content-disposition']?.split('filename=')[1]
          if (str) {
            fileName  = decodeURI(str);
          }else{
            fileName  = false
          }
        } catch (error) {
          fileName  = false
        }
      const isLogin = await blobValidate(res.data);
      if (isLogin) {
        const blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
        saveAs(blob, fileName)
      } else {
        const resText = await res.data.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        ElMessage.error(errMsg);
      }
      callBack()
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}
//备注弹窗
export function CommentPopup(text,type){
  ElMessageBox.alert(text, type, {
    confirmButtonText: '关闭',
    callback: () => {}
  })
}
//富文本空校验
export function getText(str){
  if(!str) return ''
  return str
    .replace(/<[^<p>]+>/g, '')  // 将所有<p>标签 replace ''
    .replace(/<[</p>$]+>/g, '')  // 将所有</p>标签 replace ''
    .replace(/&nbsp;/gi, '')  // 将所有 空格 replace ''
    .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
    .replace(/^\s*|\s*$/g,"")
}

export function getNowDate(str=''){
  var date = new Date();
  var sign2 = ":";
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1; // 月
  var day = date.getDate(); // 日
  var hour = date.getHours(); // 时
  var minutes = date.getMinutes(); // 分
  var seconds = date.getSeconds() //秒
  var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
  var week = weekArr[date.getDay()];
  // 给一位数的数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + str + month + str + day  + hour + sign2 + minutes + sign2 + seconds;
}

/**
 * CRM修改数值
 * @param {*} info 
 * @param {*} type 
 * @returns 
 */
export function crmChangePrice(info,type){
  let num = 10000
  if(type=='cu'){
    num = 0.0001
  }
  if(typeof info === 'number'){
    return info * num
  }
  info.baseInfo.customerCreditQuota = (info.baseInfo?.customerCreditQuota * num)||0;
  if(info.management){
    info.management.previousYearSalesAmount = (info.management?.previousYearSalesAmount * num)||null;
  }
  info.baseInfo.packagingDemandScale = (info.baseInfo?.packagingDemandScale * num)||null
  info.baseInfo.registeredCapitalPaidAmount = (info.baseInfo?.registeredCapitalPaidAmount * num)||null;
  info.baseInfo.mortgagedAmount = (info.baseInfo?.mortgagedAmount * num)||null;
  info.baseInfo.customerFixedAssetsValuation = (info.baseInfo?.customerFixedAssetsValuation * num)||null;
  info.baseInfo.customerOwnedPropertyValuation = (info.baseInfo?.customerOwnedPropertyValuation * num)||null;
  return info
}

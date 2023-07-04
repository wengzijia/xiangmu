import {
  requestUrl,
  imageBaseUrl
} from "./request"
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 获取时间
function format(fmt) {
  const date = new Date()
  const o = {
    "Y+": date.getFullYear(),
    "M+": date.getMonth() + 1, // 月
    "D+": date.getDate(), // 日
    "h+": date.getHours(), // 时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "W": date.getDay() // 周
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, () => {
        if (k === 'W') { // 星期几
          const week = ['日', '一', '二', '三', '四', '五', '六']
          return week[o[k]]
        } else if (k === 'Y+' || RegExp.$1.length == 1) { // 年份 or 小于10不加0
          return o[k]
        } else {
          return ("00" + o[k]).substr(("" + o[k]).length) // 小于10补位0
        }
      })
    }
  }
  return fmt
}

/*函数节流*/
function throttle(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

// 工序遍历
const processMap = {
  1: '印刷',
  2: '覆膜',
  3: '过油',
  4: '模切',
  5: '粘盒',
  6: '烫金',
  7: '击凸',
  8: '击凹',
  9: '局部UV',
  10: '贴窗',
  11: '对裱卡纸',
  12: '压纹',
  45: '丝印单色',
  46: '丝印滴珠',
  47: '丝印磨砂',
  48: '除废',
  0: '切纸',
  28: '对裱坑纸',
  29: '折边',
  31: '成型',
  32: '折页',
  34: '装钉',
  36: '贴合',
  37: '裱绒',
  38: '底部背胶',
  39: '穿绳',
  40: '打鸡眼',
  41: '贴磁铁',
  43: '粘双面胶',
  49: 'CTP制版',
  50: '折光',
  51: '滚烫',
  52: '局部七彩UV',
  53: '发泡',
  54: '深压纹',
  55: '大版裱纸',
  56: '激光雕刻',
  57: 'V槽',
  58: '零件裱纸',
  59: '车线',
  60: '电脑绣花',
  61: '海绵裱合',
  62: '精装盒生产线',
  63: '预折',
  64: '丝印',
}

// 异常类型遍历
const anoTypeMap = {
    0:"覆错膜",
    1:"其他",
    2:"数量不足",
    3:"除废打坏",
    4:"原材料未到",
    5:"超线",
    6:"喇叭口",
    7:"上下线不齐",
    8:"印刷不合格",
    9:"纸张粘花",
    10:"找不到货",
    11:"烫金版不合格",
    12:"纸张变形",
    13:"转手工",
    14:"不用粘",
    15:"上工序下机数不对",
    16:"刀模错误",
    17:"啤爆",
    18:"没啤穿",
    19:"啤位不准",
    20:"击凸不准"
}

// 上传文件请求封装
function uploadFile(file) {
  console.log('file', file);
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      // url: requestUrl + '/api/bw/alibaba/oss/uploadFile', // 上传的服务器接口地址
      url: requestUrl + '/api/mes/bw/alibaba/oss/uploadFile', // 上传的服务器接口地址
      filePath: file,
      name: 'file', //上传的所需字段，后端提供
      header: {
        token
      },
      formData: {
        file: file,
        folder: "error/"
      },
      success: (res) => {
        // 上传完成操作
        const data = JSON.parse(res.data)
        console.log('data', data);
        resolve({
          url: imageBaseUrl + data.data
        })
      },
      fail: (err) => {
        //上传失败：修改pedding为reject
        reject(err)
      }
    });
  })
}

module.exports = {
  format,
  throttle,
  debounce,
  formatTime,
  processMap,
  anoTypeMap,
  uploadFile
}
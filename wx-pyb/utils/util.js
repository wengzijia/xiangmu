import { sizeMax } from "../api/orderDetailsApi";
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTime2 = date => {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return `${year}年${month}月${day}日`
}
const formatTime3 = date => {
  let year = date.getFullYear()
  let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;

  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return `${year}.${month}.${day}`
}
const formatTime4 = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('.')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const throttling = (fn, wait, immediate) => {
  var timer, timeStamp = 0;
  var context, args;

  var run = () => {
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args);
      }
      clearTimeout(timer);
      timer = null;
    }, wait);
  }

  return function () {
    context = this;
    args = arguments;
    if (!timer) {

      console.log("throttle, set");
      if (immediate) {
        fn.apply(context, args);
      }
      run();
    } else {
      console.log("throttle, ignore");
    }
  }

}
const debounce = (fn, wait) => {
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

const createQRCode = (data) => {
  var blob = new Blob([data], {
    type: image / png
  });
  const blobURL = window.URL.createObjectURL(blob);
  return blobURL
}

function copyQQ(app, modalFun) {
  wx.showModal({
    title: '在线客服',
    content: '添加客服QQ,在线咨询传文件\r\n      客服QQ：' + app.globalData.serviceQQ,
    confirmText: '复制QQ',
    confirmColor: '#ff0036',
    success(res) {
      if (res.confirm) {
        wx.setClipboardData({
          //准备复制的数据
          data: app.globalData.serviceQQ,
          success: function (res) {
            wx.hideLoading()
            modalFun({ contentText: '复制成功', icon: 'ac-icon-check' })
          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
function intercept(str) {
  let arr = str.split(';')
  let text = arr.filter(item => {
    if (item.includes('纸张材质')) {
      return item
    }
  })
  let g = ''
  if (g) {
    g = text[0].split(':')[1] + 'g'
  }
  return g
}

function paperSplitStr(e, goodsAttrText) {
  if (!e.boxtype) {
    if (goodsAttrText.indexOf('纸行名称') == -1 && e.addtime > 1629547810) {
      if (e.paper) {
        goodsAttrText = ((e.paper.paperShop ? ('纸行名称:' + e.paper.paperShop.split('-')[0] + ';') : '') + (e.paper.brand ? ('纸张品牌:' + e.paper.brand + ';') : '') + (e.paper.paperTonprice ? ('吨价/平方单价:' + e.paper.paperTonprice + '元;') : '')) + goodsAttrText
      } else {
        goodsAttrText = '订单数据异常!'
      }
    } else if (goodsAttrText.indexOf('吨价/平方单价')) {
      let str = '吨价/平方单价:' + e.paper.paperBaseprice + '元'
      let str2 = '吨价/平方单价:' + e.paper.paperTonprice + '元'
      goodsAttrText = goodsAttrText.replace(str, str2)
    }
    var arr = goodsAttrText.split(';')
    arr = arr.map(item => {
      return item.split(':')
    }).filter(s => { return s != "" })
    return arr
  }
}

//单款商品详情字符串分割

function splitStr(str, frontPaperMap = {}) {
  str = str.replaceAll('cross3', '跨三面贴窗')
  str = str.replaceAll('cross2', '跨二面贴窗')
  str = str.replaceAll('cross', '单面贴窗')
  // str=str.replaceAll('超高松','单铜')
  // console.log(99666,frontPaperMap);
  for (const key in frontPaperMap) {
    str = str.replaceAll(key, frontPaperMap[key])
  }
  let arr = str.split(';').map(item => {
    return item.split(':')
  })
  let text = arr.filter(s => { return s != "" })
  return text
}

//工序商品详情字符串分割

function processSplitStr(goodsAttr) {
  let attr = JSON.parse(goodsAttr)
  return attr.map(e => {
    let str = e.goodsAttr
    let arr = str.split(';').map(item => {
      return item.split(':')
    })
    let text = arr.filter(s => { return s != "" })
    e.goodsAttr = text
    return e
  })
}
//商品详情的版本类型将数字改成文字
//2022-04-29 shannon
function editVersionType(type) {
  let typeName = {
    0: '拼版_',
    1: '拼版_',
    'null': '拼版_',
    2: '自动专版_',
    3: '自定义专版_',
    4: '线下报价_',
    5: '线下报价_',
    6: '线下报价_'
  }
  return typeName[type]
}
function isIndexOf(val) {
  if (val.payType) {
    if (val.payType.indexOf('wxpay'.toLowerCase()) > -1) {
      val.payText = '微信支付'
    } else if (val.payType.indexOf('creditPur'.toLowerCase()) > -1) {
      val.payText = '信用支付'
    } else if (val.payType.indexOf('balance'.toLowerCase()) > -1) {
      val.payText = '余额支付'
    } else {
      val.payText = '其它支付'
    }
  } else {
    val.payText = '其它支付'
  }
}
//数字保留两位小数
function numberFormat(value) {
  let number = value.toFixed(2)
  return number
}
//把地址替换成数据库匹配的地址 选中时
function replaceAddress(str) {
  str = str.replace('内蒙古自治区', '内蒙古')
  str = str.replace('广西壮族自治区', '广西')
  str = str.replace('西藏自治区', '西藏')
  str = str.replace('宁夏回族自治区', '宁夏')
  str = str.replace('新疆维吾尔族自治区', '新疆')
  str = str.replace('香港特别行政区', '香港')
  str = str.replace('澳门特别行政区', '澳门')
  str = str.replace('红河哈尼族彝族自治州', '红河州')
  return str
}
// 回显时
function replaceAddress2(str) {
  str = str.replace('内蒙古', '内蒙古自治区')
  str = str.replace('广西', '广西壮族自治区')
  str = str.replace('西藏', '西藏自治区')
  str = str.replace('宁夏', '宁夏回族自治区')
  str = str.replace('新疆', '新疆维吾尔族自治区')
  str = str.replace('香港', '香港特别行政区')
  str = str.replace('澳门', '澳门特别行政区')
  str = str.replace('红河州', '红河哈尼族彝族自治州')
  return str
}
/**
 * 是否为代理商
 * @param {*} userInfo 
 * @returns 
 */
function isProxy(userInfo) {
  return userInfo.isAgent == 1
}
function add0(m) { return m < 10 ? '0' + m : m }
function format(shijianchuo) {
  // IOS端Date对象不兼容-符号
  shijianchuo = shijianchuo.replace(/-/g,'/')
  //shijianchuo是整数，否则要parseInt转换
 
  var time = new Date(shijianchuo);
  console.log(time)
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  console.log(y)
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
/**拼接刀模下载链接 */
// function daomoUrl({ knifeUrl, length, width, height, datastr, moldCateId }) {
//   let Url = ''
//   let knifeInputStr = 'long=' + length + '&width=' + width + '&height=' + height + '&';
//   if (moldCateId == 243) {
//     Url = 'https://www.aocai.cn/integrate/' + '?' + knifeInputStr + datastr + knifeUrl
//   } else if (moldCateId == 244) {
//     Url = 'https://www.aocai.cn/knifecardDrawer/' + '?' + knifeInputStr + 'ground_up=8&ground_down=8&ground_left=8&ground_right=8&' + datastr + knifeUrl + '&large=YES'
//   } else if (moldCateId == 245) {
//     // Url = 'https://www.aocai.cn/knifecardWorld/'+'?'+ knifeInputStr +'ground_up=8&ground_down=8&ground_left=8&ground_right=8&'+ datastr + knifeUrl+'&large=YES'
//   } else {
//     Url = 'https://www.aocai.cn/knifecardBox/' + '?' + knifeInputStr + datastr + knifeUrl
//   }
//   return Url
// }
/**拼接刀模下载链接 */
function daomoUrl({ knifeUrl, length, width, height, datastr, moldCateId }) {
  let Url = ''
  let obj = {}
  // 判断封套及特殊盒型
  let gid = 0
  if(knifeUrl.indexOf('https://www.xiaocaiyin.com/cutting/specialbox/')!=-1){
    gid = 684
    let arr = knifeUrl.split('?')
    if(arr.length==2){
      knifeUrl = arr[1]
    }
  } 
  let newstr = knifeUrl+'&'+datastr+'&'+'long=' + length + '&width=' + width + '&height=' + height
  newstr.split('&').filter(e=> e.length>0).forEach(e => {
    let s = e.split('=')
    if(s.length>1){
      obj[s[0]] = s[1]
    }
  })
  let newStr = ''
  for (const key2 in obj) {
    newStr+=`${key2}=${obj[key2]}&`
  }
  console.log('newStr',newStr)
  console.log('moldCateId',moldCateId)
  if (moldCateId == 243) {
    Url = 'https://www.aocai.cn/integrate/' + '?' + newstr
  } else if (moldCateId == 244) {
    Url = 'https://www.aocai.cn/knifecardDrawer/' + '?' + newstr + 'ground_up=8&ground_down=8&ground_left=8&ground_right=8&large=YES'
  } else if(gid==684){
    Url = 'https://admin.aocai.cn/cutting/specialbox/' + '?' + newstr
  } else
   {
    Url = 'https://www.aocai.cn/knifecardBox/' + '?' + newstr
  } 
  
  console.log('Url',Url)
  return Url
}

/** 精装盒专用 拼接刀模下载链接 */
function daomoUrlJing({ knifeUrl, length, width, height, datastr, module }) {
  // let Url = 'http://192.168.1.220/knife/hardcover/'
  let Url = 'https://admin.aocai.cn/knife/hardcover/'
  let knifeInputStr = 'make_long=' + length + '&make_width=' + width + '&make_height=' + height + '&';
  if (module == 'tian_ban' || module == 'tian_quan') { // 天盖面料半包 / 全包
    Url += 'canopyCover.php?' + knifeInputStr + datastr + knifeUrl
  } else if (module == 'tian_hui') { // 天盖灰板
    Url += 'canopyCore.php?' + knifeInputStr + datastr + knifeUrl
  } else if (module == 'tian_nei') { // 天盖面料全包内贴
    Url += 'canopyLining.php?' + knifeInputStr + datastr + knifeUrl
  } else if (module == 'di_ban' || module == 'di_quan') { // 地盒面料半包 / 全包
    Url += 'landCover.php?' + knifeInputStr + datastr + knifeUrl
  } else if (module == 'di_hui') { // 地盒灰板
    Url += 'landCore.php?' + knifeInputStr + datastr + knifeUrl
  } else if (module == 'di_nei') { // 地盒面料全包内贴
    Url += 'landLining.php?' + knifeInputStr + datastr + knifeUrl
  }
  console.log(Url);
  return Url
}

/**拼接刀模下载链接 */
function daomoUrl2({ knifeUrl, length, width, height, datastr, moldCateId, direction }) {
  let Url = ''
  let knifeInputStr = 'long=' + length + '&width=' + width + '&height=' + height + '&direction=' + direction + '&';
  if (moldCateId == 251) {
    Url = 'https://www.aocai.cn/knifeonePieceBox/' + '?' + knifeInputStr + datastr + knifeUrl
  } else {
    Url = 'https://www.aocai.cn/knifeprototype/' + '?' + knifeInputStr + datastr + knifeUrl
  }
  return Url
}

function deepGet(obj, keys, defaultVal) {
  return (
    (!Array.isArray(keys)
      ? keys.replace(/\[/g, '.').replace(/\]/g, '').split('.')
      : keys
    ).reduce((o, k) => (o || {})[k], obj) || defaultVal
  );
}
export function oversize(data,Boxname='') {
    if(!data) return false
    return new Promise((resolve, reject) => {
      sizeMax(data).then(res => {
        if (res.code === '000000') {
          for(let i=0;i<res.data.length;i++){
            if(res.data[i]&&res.data[i]?.sizeMax){
              let con='该商品包装尺寸过大，工厂无合适纸箱进行打包，建议下单后联系业务员定制纸箱发货。如未定制纸箱，则发货默认牛皮纸打包，请知悉。'
              if(Boxname) con=`【${res.data[i].name}】该商品包装尺寸过大，工厂无合适纸箱进行打包，建议下单后联系业务员定制纸箱发货。如未定制纸箱，则发货默认牛皮纸打包，请知悉。`
              wx.showModal({
                title: '温馨提示',
                showCancel: false, //隐藏取消按钮
                confirmColor:'#E9333F',
                content: con,
                success: function(res) {
                    if (res.confirm) {
                      resolve(res.data)
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                }
              })
              return
            }
          }
          resolve(res.data)
        } else {
          resolve('')
        }
      });
    })
}

module.exports = {
  formatTime: formatTime, format, copyQQ, numberFormat, formatTime2, formatTime3,formatTime4,
  throttling, debounce, createQRCode, intercept, splitStr, replaceAddress, replaceAddress2, paperSplitStr, processSplitStr, daomoUrl, daomoUrlJing, daomoUrl2, editVersionType,oversize,
  /**
   * 是否为代理商
   */
  isProxy,
  deepGet,
  isIndexOf
}




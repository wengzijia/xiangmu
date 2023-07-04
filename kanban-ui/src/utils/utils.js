import {Toast} from 'vant'
import store from '@/store';
import axios from 'axios';
import { BASEURL } from '@/store/global-constant'
import {getToken} from "@/utils/auth";
import SockJS from 'sockjs-client';
import WebStomp from 'webstomp-client';
/**
     * 转换时间显示格式
     */
 export function timestampToTime(time) {
  var date = new Date(time * ((time+'').length===13?1:1000)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = date.getDate() + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D +' '+ h + m + s;
}


/**
 * 防抖函数
 * @param {f} fn 
 * @param {*} wait 
 * @returns 
 */
 export function debounce(fn, wait) {
  let timer,
    startTimeStamp = 0;
  let context, args;
  let run = timerInterval => {
    timer = setTimeout(() => {
      let now = new Date().getTime();
      let interval = now - startTimeStamp;
      if (interval < timerInterval) {
        // the timer start time has been reset, so the interval is less than timerInterval
        // console.log('debounce reset',timerInterval-interval);
        // console.log('debounce wait',wait-interval);
        startTimeStamp = now;
        run(wait - interval); // reset timer for left time
      } else {
        fn.apply(context, args);
        clearTimeout(timer);
        timer = null;
      }
    }, timerInterval);
  };
  //  console.log('timer',timer);
  return function() {
    // console.log('thisthisthis',this);
    context = this;
    args = arguments;
    let now = new Date().getTime();
    startTimeStamp = now;
    if (!timer) {
      // console.log('debounce set', wait);
      run(wait); // last timer alreay executed, set a new timer
    }
  };
}

/**
 * 复制文本
 * @param {*} text 要复制的文本
 */
export function copyText(text='') {
  let  dom = document.createElement('textarea')
  dom.value = text
  dom.setAttribute('style', 'position: fixed; z-index: -2; right: 99999px')
  let body = document.querySelector('body')
  body.appendChild(dom)
  dom.select();
  document.execCommand("copy");
  Toast.success("复制成功");
  body.removeChild(dom)
}

/**
 * 单款商品详情字符串分割
 * @param {*} str 
 * @param {*} frontPaperMap 
 * @returns 
 */
 export function singleGoodsSplitStr(str){
	str=str.replace(new RegExp('cross3','g'),'跨三面贴窗')
	str=str.replace(new RegExp('cross2','g'),'跨二面贴窗')
	str=str.replace(new RegExp('cross','g'),'单面贴窗')
  let frontPaperMap = store.getters.frontPaperMap
	for (const key in frontPaperMap) {
		if(key){
      str=str.replace(new RegExp(key,'g'),frontPaperMap[key])
    }
	}
	let arr = str.split(';').map(item =>{
		return item.split(':')
	})
	return arr.filter(s=>{return s!=""})
}

/**
 * 买纸商品详情字符串分割
 * @param {*} str 
 * @param {*} frontPaperMap 
 * @returns 
 */
 export function paperGoodsSplitStr(str,item){
	let arr = str.split(';').map(item =>{
		return item.split(':')
	})
  let paperShop = ''
  if(item.paper&&item.paper.paperShop){
    paperShop = item.paper.paperShop.split('-')[0];
  }
  arr.unshift(['纸行名称',paperShop],item.paper&&item.paper.brand?['纸张品牌',item.paper.brand]:'',item.paper&&item.paper.paperTonprice?['吨价/平方单价',item.paper.paperTonprice]:'')
  arr.push(['印刷厂商',item.factoryName])
  if(item.paper&&item.paper.cuttingfee>0){
    arr.push(['纸行分切费',item.paper.cuttingfee])
  }
	return arr.filter(s=>{return s!=""})
}

/**
 * 
 * @param {*} str String,规范的省份名称
 * @returns  后台数据库匹配的省份名称
 */
export function replaceAddress(str){
  str=str.replace('内蒙古自治区','内蒙古')
	str=str.replace('广西壮族自治区','广西')
	str=str.replace('西藏自治区','西藏')
	str=str.replace('宁夏回族自治区','宁夏')
	str=str.replace('新疆维吾尔族自治区','新疆')
	str=str.replace('香港特别行政区','香港')
	str=str.replace('澳门特别行政区','澳门')
	return str
}

export function payTypeText(str){
  if (!str) {
    return "无";
  }
  str = str.toLocaleLowerCase() 
  if (str.indexOf("wxpay") !== -1) {
    return "微信支付";
  }
  if (str.indexOf("alipay") !== -1) {
    return "支付宝支付";
  }
  return '无'
}

/**
 * 下载文件
 * @param {*} res 
 * @param {*} type 
 * @param {*} name 
 */
 export function dowFile(res,type,name){
  const blob = new Blob([res], {
    type// word文档为msword,pdf文档为pdf
  })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, name)
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', name)
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}
export function generalDownloadFile3(url) {
  // const token = getToken2()
  const token = store.state.token
  console.log('parameter',parameter)
  return axios.request({
    url: url,
    method:'GET',
    params: parameter,
    data:parameter,
    responseType: 'blob',
    headers: {
      token: token,
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      withCredentials: true
    }
  }).then(res => {
    console.log('res',res);
    let fileName = parameter.fileName
    console.log('fileName',fileName);
    let time = new Date().getTime()
    let arr = fileName.split('.')
    dowFile(res.data,arr[arr.length-1],time+'.'+arr[arr.length-1])
  })
}
export function generalDownloadFile4(url) {
  const token = store.state.token
  return axios.request({
    url: BASEURL+url,
    method:'GET',
    responseType: 'blob',
    headers: {
      token: token,
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      withCredentials: true
    }
  }).then(res => {
    console.log('res',res);
      let fileName = new Date()
      dowFile(res.data,res.data.type,fileName)
  })
  // const xhr = new XMLHttpRequest();
  //     xhr.open('GET', url, true);
  //     xhr.responseType = 'blob';
  //     //xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');
  //     xhr.onload = () => {
  //       if (xhr.status === 200) {
  //         // 获取文件blob数据并保存
  //         var fileName = getFileName(url);
  //         // saveAs(xhr.response, fileName);
  //         dowFile(xhr.response,'pdf',fileName)
  //       }
  //     };

  //     xhr.send();
}
/**
 * 获取工艺类型
 * @param {*} type 
 */
 const craftObj={
  type_0:'切纸',
  type_1:'印刷',
  type_2:'覆膜',
  type_3:'过油',
  type_4:'啤',
  type_5:'粘盒',
  type_6:'烫金',
  type_7:'击凸',
  type_8:'击凹',
  type_9:'局部UV',
  type_10:'贴窗',
  type_11:'对裱卡纸',
  type_12:'压纹',
  type_45:'丝印单色',
  type_46:'丝印滴珠',
  type_47:'丝印磨砂',
  type_48:'除废'
}
export const getcraftTypes=(type)=>{
  return craftObj['type_'+type] || '未知'
}

const imgUrl = 'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'
/**
 * 处理图片，每张图片需要展示title
 * @param {*} imgArr 
 * @param {*} title 
 */
const  getImgList=(objImg,title)=>{
  if(!objImg || !objImg.smallImg || objImg.smallImg.length==0 ) return []
  const imgList = []
  objImg.smallImg.forEach((item,index)=>{
    imgList.push({url:imgUrl+item,title:title+'-'+(index+1),bigUrl:imgUrl+objImg.bigImg[index]})
  })
  return imgList
}

/**
 * 将大版图片，刀模图片，以及其他类型的图片全部合并一起
 * @param {*} data 
 * @returns 
 */
export const disposeImgs=(data)=>{
  const attributeId = store.state.device.attributeId
  const title = attributeId == 10 ? 'PO' :  '大版'
  let imgArr = []
  let groupImg =  data.groupImg//这是大图
  let groupSmallImage = data.groupSmallImage //这是缩略图
  if(groupImg)groupImg = data.groupImg.indexOf(',') !== -1 ? data.groupImg.split(',') :  [data.groupImg]
  if(groupSmallImage)groupSmallImage = data.groupSmallImage.indexOf(',') !== -1 ? data.groupSmallImage.split(',') :  [data.groupSmallImage]
  //缩略图可能为空
  //如果没有大图，缩略图肯定没有

  let obj={
    smallImg:groupSmallImage,
    bigImg:groupImg
  }
  if((!groupSmallImage||groupSmallImage.length==0)&&groupImg){
      obj.smallImg = groupImg
  }
  if((!groupImg||groupImg.length==0)&&groupSmallImage){
    obj.bigImg = groupSmallImage
  }
  
  imgArr = getImgList(obj,title)
  const groupDaomoFile = data.groupDaomoFile
  if(groupDaomoFile) {
    let imgList
    if(typeof groupDaomoFile == 'string' && groupDaomoFile.indexOf('[{') != -1) {
      imgList = JSON.parse(groupDaomoFile)
      imgList.forEach(item=>{
        let bigImg = item.images//大图
        let cover_images = item.cover_images //cover_images 缩略图
        if(item.images) bigImg = item.images.indexOf(',') !== -1 ? item.images.split(',') :  [item.images]
        if(item.cover_images) cover_images = item.cover_images.indexOf(',') !== -1 ? item.cover_images.split(',') :  [item.cover_images]
        let obj={
          smallImg:cover_images,
          bigImg:bigImg
        }
        if((!cover_images||cover_images.length==0)&&bigImg){
            obj.smallImg = bigImg
        }
        if((!bigImg||bigImg.length==0)&&cover_images){
          obj.bigImg = cover_images
        }
          
        imgArr = imgArr.concat(getImgList(obj,item.title))
      })
    }
  }
  // console.log('获取所有的图片：',imgArr)
  return imgArr
}

/**
     * 获取当前日期
     */
 export const getTodayTime=(flag,houserTime=' 09:00:00')=>{
  const myDate = new Date();
  const myYear = myDate.getFullYear() + "-"; //获取完整的年份(4位,1970-????)
  const myMonth = (myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1) + "-"; //获取当前月份(0-11,0代表1月)
  const myToday = myDate.getDate() + " ";//获取当前日(1-31)
  const h = (myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()) + ":";
  const m = (myDate.getMinutes() < 10 ? "0" + myDate.getMinutes() : myDate.getMinutes()) + ":";
  const s = myDate.getSeconds() < 10 ? "0" + myDate.getSeconds() : myDate.getSeconds();
  const today =flag ?   myYear +myMonth + myToday + h + m +s : myYear +myMonth + myToday + houserTime
  // console.log(today)
  return today
}
/**
 * 判断当前订单是今日订单还是明日订单
 * @param {订单携带的时间} date1 
 * @param {当前日期时间} date2 
 * @param {两者相减后的比较时间} difference
 */
 export const compareTime = (date1, date2,difference)=> {
  var startTime = new Date(date1);
  var endTime = new Date(date2);
  // console.log(startTime.getTime() < endTime.getTime())
  return difference ? startTime.getTime() - endTime.getTime() < difference * 24 * 3600 * 1000 :   startTime.getTime() < endTime.getTime()
}

/**
 * 
 * @param {当前工艺id} time2 
 * @param {当前订单数据} v 
 */
export const isTodayOrder = (attId,v) =>{
  const publickFunc = {
    default:()=>{//默认使用的处理方式
      return compareTime(v.deliveryDate,getTodayTime(true),1)
    },
    type_2:()=>{//覆膜工艺需要特殊处理
      return compareTime(v.nearFinishTime,getTodayTime())
    },
    type_5:()=>{//粘盒工艺需要特殊处理
      // ● 今日订单：
      //   ○ 普通盒型：交货日期在当天23：00前的订单
      //   ○ 特殊盒型（自定义盒型，特殊盒型）：交货日期在明天23：00前的订单
      //粘盒工艺区分特殊盒型和普通盒型
       return v.specialBoxFlag==1 ?compareTime(v.deliveryDate,getTodayTime(false,' 23:00:00'),1) : compareTime(v.deliveryDate,getTodayTime(false,' 23:00:00'))
    },
    type_6:()=>{//烫金工艺需要特殊处理
      return compareTime(v.nearFinishTime,getTodayTime())
    },
    type_64:()=>{//丝印工艺需要特殊处理
      return compareTime(v.deliveryDate,getTodayTime(false,' 23:00:00'))
    },

  }
  return publickFunc['type_'+attId] ?  publickFunc['type_'+attId]() :  publickFunc.default()

}

/**
 * 判断当前对象中是否有某个值
 * @param {当前对象（数组）} obj 
 * @param {需要比较的值} val 
 * @param {获取数据的key值} keys 
 * @returns 
 */
export const isHaveInfo = (obj,val,keys)=>{
  if(!obj||obj.length<1) return false
  return obj.some(item=>{
    return item[keys] == val
  })
}



var stompClient = null
var websocket
export const  connectWebSocket = () =>{
      if(stompClient)stompClient.disconnect()
      stompClient = null
      if(websocket)websocket.close()
      websocket = null
      console.log('当前环境：',process.env.NODE_ENV)
      websocket = process.env.NODE_ENV === 'development' ? new SockJS("http://192.168.6.45:9080/publicServer") : new SockJS("/publicServer");
      // websocket = new SockJS("http://192.168.6.45:9080/publicServer");
      const webStompOptions = {debug: false}
      stompClient = WebStomp.over(websocket, webStompOptions);
      const headers = {Authorization: getToken()}
      return new Promise((resolve, reject) => {
        resolve({websocket,stompClient})
      })
}
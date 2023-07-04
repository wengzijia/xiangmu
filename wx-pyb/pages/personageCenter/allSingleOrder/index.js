//index.js
import { getAllSupplierOrder, deleteOrder, SingcancelOrder,  createOrder1, singleWxPayUrl, DiffOrderPayUrl,singnCreatePayQrCode} from "../../../api/orderApi.js";
import { getCurrentUserInfo, userDefinedConfirm, prepressNotes } from "../../../api/orderApi.js";
import{splitStr,editVersionType,numberFormat} from "../../../utils/util";
//获取应用实例
const app = getApp()
import {data,methods} from '../../../utils/credit'
Page({
  data: {
    ...data,
    creditType:'supplier',
    creditCallBlack:'getAllOrder',//信用支付回调函数名称
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 0,
    keywords: '',
    orderData: [],
    height: 550,
    regInfo: { pageNumber: 1, pageSize: 20 },
    // regInfo: { pageNumber: 1, pageSize: 20, orderType:0},
    totalPrice: 0,
    list: [],
    listArr: [],
    Allchecked: false,
    suborderDiscountDetail: {},
    mxamount: [],
    more: false,
    fastLoading: true,
    modal: {
      show: false,//modal是否显示，默认false
      contentText: '',
      icon: '',
      iconSize: '',
      image: '',
      imageSize: ''
    },
    updateTime: '',
    update: false,
    orderType: 0,
    admin: false,
    headHeight:66,
 
    WXpayOrderSn:'',//合并支付单号
    isValue:'aa',
    imgBaseUrl:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
    value:false,
    pinbanObj:{},
    isCustom: true,
    showSearchType:false,
    searchType:{name:'订单编号',value:'orderNo'},
    searchTypeList:[
      {name:'订单编号',value:'orderNo'},
      {name:'商品名称',value:'customName'}
    ]
  },
  TimeID: -1,
  onLoad: function (options) {
    // console.log(options);
    //接收参数，显示对应状态订单
    this.setData({
      currentTab: options.type,
    })
    getCurrentUserInfo().then(res=>{
      if (res.success) {
        if (res.data.pybAdminMobile) {
          app.globalData.admin = true
          this.setData({
            admin: true,
            headHeight:66,
          })
        } else {
          app.globalData.admin = false
          this.setData({
            admin: false,
            headHeight:20,
          })
        }
      }
    })
  },
  ...methods,
  //预览图片
  previewImg:function(e){
    // console.log('previewImg',e);
    wx.previewImage({
      current: this.data.imgBaseUrl+e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [this.data.imgBaseUrl+e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },
  messageModel(title,content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function () { }
    })
  },
  /**
   * 分享订单
   */
  shareOrder(e) {
    if (e.currentTarget.dataset.iscustom == 0) {
      if (e.currentTarget.dataset.status == 1) {
        this.messageModel('温馨提示','订单中包括了自定义工艺,下单后进入评估报价,待评估完成后再计入订单金额一起支付吧!')
      } else if (e.currentTarget.dataset.status == 2) {
        this.messageModel('温馨提示','订单中包括了自定义工艺，下单后进入评估报价对参数有修改，请先确认再支付!')
      }
      return
    }
    console.log(e);
    wx.navigateTo({
      url: './share/index?data=' + e.currentTarget.dataset.sn + '&from=list'
    })
  },
  /**
   * 弹窗
   * @param {} param0 
   */
  modalFun: function ({ contentText, icon, iconSize, image, imageSize, time }) {
    var _this = this;
    this.setData({
      modal: {
        show: true,
        contentText, icon, iconSize, image, imageSize
      }
    })
    setTimeout(() => {
      _this.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
      })
    }, time ? time : 2000);
  },
  onPullDownRefresh() {
    // this.getOrder()
    this.getAllOrder();

  },
  onShow: function () {
    // this.setData({
    //   // app.globalData.admin
    //   admin: app.globalData.admin,
    //   headHeight:app.globalData.admin?66:20,
    // })
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
    this.getAllOrder();
    this.setData({
      height: wx.getSystemInfoSync().windowHeight - 98
    })
  },
  //跳转到物流页
  lookLogistics(e){
    wx.navigateTo({
      url:'./logistics/index?orderSn='+e.currentTarget.dataset.orderno
    })
  },
  loading: function () {
    var _this = this
    if (_this.data.fastLoading) {
      return false
    }
    if (this.data.orderData.length % 20!==0&&this.data.orderData.length % 20 < 20 ) {
      console.log(this.data.orderData.length);
      _this.setData({
        more: true
      })
      setTimeout(() => { _this.setData({ more: false }) }, 2000)
    } else {
      this.setData({
        fastLoading:true,
      })
      wx.showLoading({
        title: '加载中',
        icon: 'loading',
        mask: true
      });
      this.data.regInfo.pageNumber = this.data.orderData.length / 20 + 1;
      getAllSupplierOrder(this.data.regInfo).then(res => {
        if(res.data.length==0){
          this.setData({
            more:true,

            // fastLoading:true,
          })
          wx.hideLoading()
          setTimeout(() => { _this.setData({ more: false }) }, 2000)
          return false;
        }
        var orderdatarr = res.data.map(item => {
          item.value=false
          if (item.children) {
            item.children.map(e => {
              // let arr = e.goodsAttr.split(';')
              // arr = (arr.map(s => {
              //   return s.split(':')
              // })).filter(a => { return a != "" })
              e.versionType=editVersionType(e.versionType)
              console.log( e.priceinfoMap);
              let a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
              if(e.priceinfoMap){
                if(e.priceinfoMap.openSize){
                  e.priceinfoMap.openSize[0]=numberFormat(e.priceinfoMap.openSize[0])
                  e.priceinfoMap.openSize[1]=numberFormat(e.priceinfoMap.openSize[1])
                }
            }
            
              for(let key of a){
                // console.log(key[0]);
                if(key[0]=='纸张材质'){
                  if(key[1].indexOf('银') != -1 || key[1].indexOf('金') != -1){
                    console.log(123);
                    e.isValue='exist'
                  }else{
                    e.isValue='aa'
                  }
                }
              }
              console.log(123);
              if(e.priceinfoMap){
                if(e.priceinfoMap.greyVersion){
                  e.priceinfoMap.IsOpen=true
                  a = splitStr(e.priceinfoMap.competGoodsAttr,app.globalData.frontPaperMap);
                  e.priceinfoMap.pinbanObj = {
                    facialTissue: JSON.parse(e.priceinfoMap.facialTissue), // 面纸内贴
                    facialTissueResp: e.priceinfoMap.facialTissueResp?JSON.parse(e.priceinfoMap.facialTissueResp):'',
                    greyVersion: JSON.parse(e.priceinfoMap.greyVersion) // 灰板
                  }
                  for (let i = 0; i < e.priceinfoMap.pinbanObj.greyVersion.length; i++) {
                    const el = e.priceinfoMap.pinbanObj.greyVersion[i];
                    let ar = el.part.split('_')
                    el.title = this.findName(ar)
                  }
          
                  for (let i = 0; i < e.priceinfoMap.pinbanObj.facialTissue.length; i++) {
                    const el = e.priceinfoMap.pinbanObj.facialTissue[i];
                    let ar = el.part.split('_')
                    el.title = this.findName(ar)
                  }
                }else{
                 a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                 e.priceinfoMap.IsOpen=false
                }
               }
             
             e.goodsAttr = a;
              return e
            });
            item.confirmtime =  this.timestampToTime(item.confirmTime);
            // item.newMoney = item.amount - (item.bonusMoney||0)
            return item
          }
        })
        this.setData({
          fastLoading:false,
          orderData: this.data.orderData.concat(orderdatarr)
        });
        wx.hideLoading();
      })
    }
  },
  findName(ar) {
    let arr = [ { key: "floor", val: "地盒" }, { key: "canopy", val: "天盖" }, { key: "innerFrame", val: "内围框" }, { key: "leather", val: "皮壳", },
      { key: "innerBox", val: "内盒", }, { key: "cabinet", val: "柜桶", }, { key: "drawer", val: "抽屉", }]
    let str = ''

    for (let i = 0; i < ar.length; i++) {
      const el = ar[i];
      
      let obj = arr.find(ell => el.indexOf(ell.key) != -1 && el.indexOf('Face') == -1) // Face 内贴
      if (!obj) {
        continue
      }
      if (str.indexOf(obj.val) != -1) {
        str += '1'
        obj.val += '2'
      }
      if (i) {
        str+= '/'
      }
      str += obj.val
    }

    return str
  },
  //获取订单列表
  getAllOrder: function (exist) {
    let _this=this
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.setData({
      update: false,
      list:[]
    })
    clearInterval(this.data.updateTime)
    //判断请求对应状态的订单
    switch (this.data.currentTab) {
      case "1":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20, status: '1' }//待付款
        })
        break;
      case "2":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20, status: '2' },//待确认
          update: true
        })
        break;
      case "3":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20, status: '3' }//已发货
        })
        break;
      case "5":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20, status: '5' }//待发货
        })
        break;
      case "''":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20 },//全部 
        })
        break;
      // case "5":
      //   this.setData({
      //     regInfo: { pageNumber: 1, pageSize: 20, status: "confirmed" },//待结算
      //     update:true
      //   })
      //   break;
      default:
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20 },//全部 
        })
        break;
    }
    /**
     * 获取订单列表
     */
    getAllSupplierOrder(this.data.regInfo).then(res => {
      if (!res.data?.length) {
        wx.showToast({
          title: '列表为空',
          icon: 'none',
          duration: 2000
        })
      }
      if (!res.success) {
        wx.showModal({
          title: '请求失败',
          showCancel: false, //隐藏取消按钮
          content: '网络请求失败，请检查您的网络',
          success: function(res) {
              if (res.confirm) {
                  //   wx.hideLoading()
                  console.log('点击确认回调')
              } else {
                  console.log('点击取消回调')
              }
          }
      })
      }
      // res.data.forEach(item=>{
      //   for(key in item.){}
      // })
      this.setData({
        fastLoading:false,
        orderData: res.data.map(item => {
          item.value=false
          if (item.children) {
            item.children.map(e => {
                e.versionType=editVersionType(e.versionType)
                // console.log( e.priceinfoMap.openSize[0]);
              let a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
              
              if(e.priceinfoMap){
                if(e.priceinfoMap.openSize){
                  e.priceinfoMap.openSize[0]=numberFormat(e.priceinfoMap.openSize[0])
                  e.priceinfoMap.openSize[1]=numberFormat(e.priceinfoMap.openSize[1])
                }
                // 去除市场价 减少中台修改 
                if (e.priceinfoMap.paperTonsMaterPriceStr) {
                  let strArr =  e.priceinfoMap.paperTonsMaterPriceStr.split('/')
                  if(strArr.length>0){
                    e.priceinfoMap.paperTonsMaterPriceStr2 = String(e.priceinfoMap.paperTonsDiscountPrice)+'元/'+strArr[1]
                  }
                }
              }
              for(let key of a){
                // console.log(key[0]);
                if(key[0]=='纸张材质'){
                  if(key[1].indexOf('银') != -1 || key[1].indexOf('金') != -1){
                 
                    e.isValue='exist'
                  }else{
                    e.isValue='aa'
                  }
                }
              }
              if(e.priceinfoMap){
                if(e.priceinfoMap.greyVersion){
                 e.priceinfoMap.IsOpen=true
                 a = splitStr(e.priceinfoMap.competGoodsAttr,app.globalData.frontPaperMap);
                 e.priceinfoMap.pinbanObj = {
                  facialTissue: JSON.parse(e.priceinfoMap.facialTissue), // 面纸内贴
                  facialTissueResp: e.priceinfoMap.facialTissueResp?JSON.parse(e.priceinfoMap.facialTissueResp):'', // 费用
                  greyVersion: JSON.parse(e.priceinfoMap.greyVersion) // 灰板
                }
                
                for (let i = 0; i < e.priceinfoMap.pinbanObj.greyVersion.length; i++) {
                  const el = e.priceinfoMap.pinbanObj.greyVersion[i];
                  let ar = el.part.split('_')
                  el.title = this.findName(ar)
                }
        
                for (let i = 0; i < e.priceinfoMap.pinbanObj.facialTissue.length; i++) {
                  const el = e.priceinfoMap.pinbanObj.facialTissue[i];
                  let ar = el.part.split('_')
                  el.title = this.findName(ar)
                }
                }else{
                 a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                 e.priceinfoMap.IsOpen=false
                }
              }
               
              e.goodsAttr = a;
              e.confirmTime2 =  this.timestampToTime(e.confirmTime);
              return e
            });
            // item.newMoney = item.amount - (item.bonusMoney||0)
            item.confirmtime =  this.timestampToTime(item.confirmTime);
            return item
          }
        })
      });
      wx.hideLoading()
    console.log(exist)
    if(exist){
      if (exist.success) {
        _this.modalFun({ contentText: '取消成功', icon: 'ac-icon-check' })
      } else {
        _this.modalFun({ contentText: '订单取消失败，请稍后重试' })
      }
    }
      // 处理完成后，终止下拉刷新
      wx.stopPullDownRefresh()
      // //结算倒计时
      // if (this.data.currentTab=='0'||this.data.currentTab=='2'||this.data.currentTab=='5') {
      //   this.runTime()
      // }
    })
  },
//转换时间显示格式
timestampToTime: function(time) {
  var date = new Date(time * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
},

  //搜索
  getkeywords: function (e) {
    var val = e.detail.value;
    this.setData({
      keywords: val
    });
  },
  clearText: function () {
    this.setData({
      keywords: ''
    })
    this.getAllOrder()
  },
  search: function () {
    var keywords = this.data.keywords
    getAllSupplierOrder({ [this.data.searchType.value]: keywords, pageNumber: 1, pageSize: 40, orderType: this.data.orderType }).then(res => {
      this.setData({
        orderData: res.data.map(item => {
          if (item.children) {
            item.children.map(e => {
              e.versionType=editVersionType(e.versionType)
              // let arr = e.goodsAttr.split(';')
              // arr = (arr.map(s => {
              //   return s.split(':')
              // })).filter(a => { return a != "" })
              let a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
              if(e.priceinfoMap){
                if(e.priceinfoMap.openSize){
                  e.priceinfoMap.openSize[0]=numberFormat(e.priceinfoMap.openSize[0])
                  e.priceinfoMap.openSize[1]=numberFormat(e.priceinfoMap.openSize[1])
                }
            }
              for(let key of a){
                // console.log(key[0]);
                if(key[0]=='纸张材质'){
                  if(key[1].indexOf('银') != -1 || key[1].indexOf('金') != -1){
                    console.log(123);
                    e.isValue='exist'
                  }else{
                    e.isValue='aa'
                  }
                }
              }
              if(e.priceinfoMap){
                if(e.priceinfoMap.greyVersion){
                 e.priceinfoMap.IsOpen=true
                 a = splitStr(e.priceinfoMap.competGoodsAttr,app.globalData.frontPaperMap);
                 e.priceinfoMap.pinbanObj = {
                  facialTissue: JSON.parse(e.priceinfoMap.facialTissue), // 面纸内贴
                  facialTissueResp: e.priceinfoMap.facialTissueResp?JSON.parse(e.priceinfoMap.facialTissueResp):'',
                  greyVersion: JSON.parse(e.priceinfoMap.greyVersion) // 灰板
                }
                for (let i = 0; i < e.priceinfoMap.pinbanObj.greyVersion.length; i++) {
                  const el = e.priceinfoMap.pinbanObj.greyVersion[i];
                  let ar = el.part.split('_')
                  el.title = this.findName(ar)
                }
        
                for (let i = 0; i < e.priceinfoMap.pinbanObj.facialTissue.length; i++) {
                  const el = e.priceinfoMap.pinbanObj.facialTissue[i];
                  let ar = el.part.split('_')
                  el.title = this.findName(ar)
                }
                }else{
                 a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                 e.priceinfoMap.IsOpen=false
                }
               }
              e.goodsAttr = a;
              return e
            });
            // item.newMoney = item.amount - (item.bonusMoney||0)
            item.confirmtime =  this.timestampToTime(item.confirmTime);
            return item
          }
        })
      })
    })
  },
  //多选
  checkboxChange: function (e) {
    var arr = e.detail.value.map(item => {
      return this.data.orderData[item * 1]
    })
    if (e.length === this.data.orderData.length) {
      var allStatu = true
    } else {
      var allStatu = false
    }
    this.data.listArr = null
    this.setData({
      Allchecked: allStatu,
      listArr: arr
    })
    this.allCheckStatu(arr)
  },
  //算总价
  allCheckStatu: function (e) {
    var priceArr = e.map(item => { return item.amount * 1 - item.bonusMoney * 1}).reduce((prev, curr) => { return prev * 1 + curr * 1 }, 0)
    console.log(e);
    this.setData({
      list: e.map(item => { return item.orderNo }),
      totalPrice: priceArr,
    })
  },
  //全选
  allCheckboxChange: function () {
    var brick = this.data.orderData;
    if (!this.data.Allchecked) {
      this.allCheckStatu(this.data.orderData)
      brick = brick.map(item => { item.checked = true; return item })
    } else {
      this.allCheckStatu([])
      brick = brick.map(item => { item.checked = false; return item })
    }
    this.setData({
      Allchecked: !this.data.Allchecked,
      orderData: brick
    })
  },
  /** 
   * 合并支付
   */
  totalPay: function (e) {
    var _this = this
    if (this.data.list.length>8) {
      wx.showToast({
        title: '最多支持8个订单合并支付',
        icon: 'none',
        duration: 1500
      })
      return
    }
    
    for (let i = 0; i < this.data.listArr.length; i++) {
      const el = this.data.listArr[i];
      console.log('el', el, el.isCanPay, el.status);
      if (el.isCanPay == 0) {
        if (el.userDefinedPromptStatus == 1) {
          this.messageModel('温馨提示','订单中包括了自定义工艺,下单后进入评估报价,待评估完成后再计入订单金额一起支付吧!')
        } else if (el.userDefinedPromptStatus == 2) {
          this.messageModel('温馨提示','订单中包括了自定义工艺，下单后进入评估报价对参数有修改，请先确认再支付!')
        }
        return
      }
    }
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask: true
    });
    
    //合并订单
    createOrder1({ list: this.data.list }).then(res => {
      this.setData({
        WXpayOrderSn:res.data.orderNo //保存合并支付订单号
      })
      e.sn =  res.data.orderNo
      e.wxPayCallBlack = 'totalWxPay'
      e.isMergePay = true
      // this.getUserCreditPurchase(e)//信用支付
      
      this.totalWxPay()
    })
  },
  /** 合并支付 */
  totalWxPay(res){
    //调用微信支付
    singnCreatePayQrCode({ orderNo: this.data.WXpayOrderSn, payType: app.globalData.payType }).then(resp => {
      var payBean = JSON.parse(resp.data)
      wx.hideLoading();
      wx.requestPayment({
        'timeStamp': payBean.timeStamp,//时间戳
        'nonceStr': payBean.nonceStr,//随机字符串
        'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
        'signType': payBean.signType,//非必要——签名算法
        'paySign': payBean.paySign,//签名
        'success': function (e) {
          console.log(e);
          _this.getAllOrder()
          // wx.navigateTo({
          //   url: '../../turntable/index?orderNo='+res.data.orderNo
          // })
        },
        'fail': function (e) {
          wx.hideLoading()
          wx.showModal({
            title: "提示",
            content: "支付失败",
            showCancel: false,
            success: function () { }
          })
        }
      })
    })
  },
  /** 信用支付 */
  selectCredit(e){
    if (e.currentTarget.dataset.iscustom == 0) {
      if (e.currentTarget.dataset.status == 1) {
        this.messageModel('温馨提示','订单中包括了自定义工艺,下单后进入评估报价,待评估完成后再计入订单金额一起支付吧!')
      } else if (e.currentTarget.dataset.status == 2) {
        this.messageModel('温馨提示','订单中包括了自定义工艺，下单后进入评估报价对参数有修改，请先确认再支付!')
      }
      return
    }
    let bonusMoney=e.currentTarget.dataset.money
    e.sn =  e.currentTarget.dataset.sn
    e.wxPayCallBlack = 'WXpay'
    if (e.currentTarget.dataset.type == 'diff' && e.currentTarget.dataset.status=="nopaid") {
      wx.showModal({
        title: "提示",
        content: "请先支付主订单!",
        showCancel: false,
        success: function () { }
      })
      return
    }
    this.getUserCreditPurchase(e)
  },
  //调用微信支付
  WXpay: function (e) {
    let _this = this
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask: true
    });

    singleWxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType }).then(res => {
      var payBean = JSON.parse(res.data)
      wx.requestPayment({
        // 'appId':payBean.appid,
        'timeStamp': payBean.timeStamp,//时间戳
        'nonceStr': payBean.nonceStr,//随机字符串
        'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
        'signType': payBean.signType,//非必要——签名算法
        'paySign': payBean.paySign,//签名
        'success': function (res) {
          _this.getAllOrder();
        },
        fail: function (res) {
          wx.hideLoading()
          wx.showModal({
            title: "提示",
            content: "支付失败",
            showCancel: false,
            success: function () { }
          })
        }
      })
      wx.hideLoading();
    })
  },
  //支付补差价订单
  DiffOrderPay: function (e) {
    if (e.currentTarget.dataset.iscustom == 0) {
      if (e.currentTarget.dataset.status == 1) {
        this.messageModel('温馨提示','订单中包括了自定义工艺,下单后进入评估报价,待评估完成后再计入订单金额一起支付吧!')
      } else if (e.currentTarget.dataset.status == 2) {
        this.messageModel('温馨提示','订单中包括了自定义工艺，下单后进入评估报价对参数有修改，请先确认再支付!')
      }
      return
    }
    var _this = this
    if (e.currentTarget.dataset.status=="nopaid") {
      wx.showModal({
        title: "提示",
        content: "请先支付主订单!",
        showCancel: false,
        success: function () { }
      })
      return
    }
    // this.selectCredit(e)
    DiffOrderPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType }).then(res => {
      var payBean = JSON.parse(res.data)
      wx.hideLoading();
      wx.requestPayment({
        // 'appId':payBean.appid,
        'timeStamp': payBean.timeStamp,//时间戳
        'nonceStr': payBean.nonceStr,//随机字符串
        'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
        'signType': payBean.signType,//非必要——签名算法
        'paySign': payBean.paySign,//签名
        'success': function (res) {
          _this.getAllOrder()
        },
        'fail': function (res) {
          wx.hideLoading()
          wx.showModal({
            title: "提示",
            content: "支付失败",
            showCancel: false,
            success: function () { }
          })
        }
      })
    })
  },
  //tabs切换
  tabsCrount: function (e) {
    var _this = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      _this.setData({
        currentTab: e.currentTarget.dataset.current
      })
      _this.getAllOrder();
      
      // _this.getOrder()
    }
  },
  cancel: function (e) {
    var _this = this
    console.log("取消订单",e.currentTarget.dataset.sn);
    wx.showModal({
      title: '取消订单',
      confirmColor: '#02BB00',
      content: '确认取消此订单？',
      success: function (res) {
        if (res.confirm) {
          SingcancelOrder({ orderNo: e.currentTarget.dataset.sn }).then(res => {
            console.log(res)
            // 2022-05-04 shannon
            _this.getAllOrder(res);
            // if (res.success) {
            //   _this.modalFun({ contentText: '取消成功', icon: 'ac-icon-check' })
            // } else {
            //   _this.modalFun({ contentText: '订单取消失败，请稍后重试' })
            // }
            // _this.getOrder()
          

          })
        } else {
          // console.log('点击取消回调')
        }
      }
    })

  },
  delOrder: function (e) {
    var _this = this
    wx.showModal({
      title: '删除订单',
      confirmColor: '#02BB00',
      content: '确认删除此订单？',
      success: function (res) {
        if (res.confirm) {
          deleteOrder({ data: e.currentTarget.dataset.sn }).then(res => {
            _this.getOrder()
            if (res.success) {
              _this.modalFun({ contentText: '删除成功', icon: 'ac-icon-check' })
            } else {
              _this.modalFun({ contentText: '删除失败，' + res.message })
            }
          })
        }
      }
    })
  },
  /**
   * 查看制作文件
   * @param {*} options 
   */
    confirmedFile(options) {
      let sid = options.currentTarget.dataset.sid;
      let ordersn =  options.currentTarget.dataset.ordersn;
      let token = wx.getStorageSync('token')
      wx.navigateTo({
          url:`./orderDetails/checkFile/index?token=${token}&sn=${ordersn}&id=${sid}`
      })
    
  },
  // 查看上传文件
    //打开PDF
  lookPdf: function(e) {
      wx.showLoading({
          title: '加载文件中...',
          mask: true
      });
      // console.log("查看文件4444", e);
      // url: app.globalData.OSSFileUrl + e.currentTarget.dataset.url,
      wx.downloadFile({
          url: app.globalData.OSSFileUrl + e.currentTarget.dataset.url,
          success: function(res) {
              console.log('查看文件4444',res);
              wx.hideLoading()
              const filePath = res.tempFilePath
              wx.openDocument({
                  filePath: filePath,
                  fileType: 'pdf',
                  success: function(res) {
                      // console.log('打开文档成功')
                  }
              })
          },
          fail: function(res) {
              wx.hideLoading()
          }
      })
  },
  jumpBefore(e) {
    wx.navigateTo({
      url: './before/index?docId=' + e.currentTarget.dataset.docid
    })
  },
  runTime() {
    let _this = this
    let ti = 7 * 60 * 60 * 24
    this.setData({
      updateTime: setInterval(() => {
        // console.log(_this.data.orderData);
        _this.data.orderData.forEach((item, i) => {
          _this.setData({
            ['orderData[' + i + '].downTime']: ((item.confirmedTime + ti) - (new Date().getTime() / 1000)) > 0 ? ('结算倒计时:' + _this.timestampToTime((item.confirmedTime + ti) - new Date().getTime() / 1000)) : ''
          })
        });
      }, 1000)
    })
  },
  //转换时间显示格式
  // timestampToTime: function (time) {
  //   var D = (parseInt(time / 86400) > 0 ? parseInt(time / 86400) : 0) + '天';
  //   var h = (parseInt((time % 86400) / 3600) > 0 ? parseInt((time % 86400) / 3600) : 0) + '时';
  //   var m = (parseInt(((time % 86400) % 3600) / 60) > 0 ? parseInt(((time % 86400) % 3600) / 60) : 0) + '分';
  //   var s = (parseInt(((time % 86400) % 3600) % 60) > 0 ? parseInt(((time % 86400) % 3600) % 60) : 0) + '秒';
  //   return D + h + m + s;
  // },
  //跳转到订单详情
  getOrderDetails(e) {
    // const _this = this
    clearTimeout(this.TimeID)
    this.TimeID = setTimeout(function () {
      // console.log(e);
      wx.navigateTo({
        url: 'orderDetails/index?data=' + e.currentTarget.dataset.sn
      })
    }, 500)
  },
  myNavigateTo() {
    wx.navigateTo({
      url: './shareList/index?type=0'
    })
  },
  textChange(e) {
    let index=e.currentTarget.dataset.index
    let orderData=this.data.orderData
    var ischeck2 = orderData[index].value;
    orderData[index].value = !ischeck2;
    this.setData({
      orderData: orderData
    });
  },
  agreeChange(e) {
    console.log('e.currentTarget.dataset.posn', e.currentTarget.dataset.posn);
    userDefinedConfirm({poSn: e.currentTarget.dataset.posn}).then(res => {
      if (res.success) {
        // this.modalFun({ contentText: '修改成功', icon: 'ac-icon-check',time: 1000})
        this.getAllOrder()
      } else {
        this.modalFun({ contentText: '修改失败'})
      }
    })
  },
  canOrder(e) {
    wx.navigateTo({
      url: `../../Confirm/ConfirmSingleOrder/index?sn=${e.currentTarget.dataset.sn}&from=canOrder`,
    })
  },
  onHide() {
    clearInterval(this.data.updateTime)
  },
  onUnload() {
    clearInterval(this.data.updateTime)
  },
  showSearchTypeFun(){
    this.setData({
      showSearchType: !this.data.showSearchType
    })
  },
  searchTypeFun(e){
    this.setData({
      searchType: e.currentTarget.dataset.type,
      showSearchType: false
    })
    this.search()
  }
})

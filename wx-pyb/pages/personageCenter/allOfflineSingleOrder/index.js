//index.js
import { getOfflineCartByUid, updateOfflineCart } from "../../../api/orderApi.js";
import { getCurrentUserInfo } from "../../../api/orderApi.js";
import{ splitStr,editVersionType,numberFormat,oversize } from "../../../utils/util";
//获取应用实例
const app = getApp()
import { data, methods } from '../../../utils/credit'
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
  },
  TimeID: -1,
  onLoad: function (options) {
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
    this.getAllOrder();
  },
  onShow: function () {
    this.onShareAppMessage = () => ({ ...app.globalData.shareObj, imageUrl: '../../../image/share.png' })
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
      getOfflineCartByUid(this.data.regInfo).then(res => {
        if(res.data.length==0){
          this.setData({
            more:true,
          })
          wx.hideLoading()
          setTimeout(() => { _this.setData({ more: false }) }, 2000)
          return false;
        }
        var orderdatarr = res.data.map(item => {
          item.value=false
          if (item.children) {
            item.children.map(e => {
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
              e.goodsAttr2 = e.goodsAttr
              e.goodsAttr = a;
              return e
            });
            item.confirmtime =  this.timestampToTime(item.confirmTime);
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
      default:
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20 },//全部 
        })
        break;
    }
    /**
     * 获取订单列表
     */
    getOfflineCartByUid(this.data.regInfo).then(res => {
      if (!res.data) {
        wx.showToast({
          title: '列表为空',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          orderData:[]
        })
        return
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
      this.setData({
        fastLoading:false,
        orderData: res.data.map(item => {
          item.value=false
          if (item.children) {
            item.children.map(e => {
                e.versionType=editVersionType(e.versionType)
              let a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
              
              if(e.priceinfoMap){
                if(e.priceinfoMap.openSize){
                  e.priceinfoMap.openSize[0]=numberFormat(e.priceinfoMap.openSize[0])
                  e.priceinfoMap.openSize[1]=numberFormat(e.priceinfoMap.openSize[1])
                }
                if (e.priceinfoMap.paperTonsMaterPriceStr) {
                  let strArr =  e.priceinfoMap.paperTonsMaterPriceStr.split('/')
                  if(strArr.length>0){
                    e.priceinfoMap.paperTonsMaterPriceStr2 = String(e.priceinfoMap.paperTonsDiscountPrice)+'元/'+strArr[1]
                  }
                }
              }
              for(let key of a){
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
              e.goodsAttr2 = e.goodsAttr;
              e.goodsAttr = a;
              e.confirmTime2 =  this.timestampToTime(e.confirmTime);
              return e
            });
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
    }
  },
  onHide() {
    clearInterval(this.data.updateTime)
  },
  onUnload() {
    clearInterval(this.data.updateTime)
  },
  selectCredit(data) {
    // console.log('data',data.currentTarget.dataset.obj.children);
    let Odata=data.currentTarget.dataset.obj.children.map(e=>{
      return{
        goodsId: e.goodsId,
        goodsAttr: e.goodsAttr2
      }
    })
    oversize(Odata).then(()=>{
      let _data = data.currentTarget.dataset
      updateOfflineCart({data: _data.sn}).then(res => {
        wx.navigateTo({
          url: '../../Confirm/ConfirmSingleOrder/index?webfrom=5',
        })
      })
    })
  }
})

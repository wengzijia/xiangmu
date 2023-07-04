//index.js
import { getAllOrder, deleteOrder, cancelOrder,createWxPayUrl,createOrder,WxPayUrl,DiffOrderPayUrl,delivery } from "../../../api/orderApi.js";
//获取应用实例
const app = getApp()

Page({

  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 0,
    keywords: '',
    orderData: [],
    height: 550,
    regInfo: { pageNumber: 1, pageSize: 20, orderType:1},
    totalPrice:0,
    list:[],
    Allchecked:false,
    suborderDiscountDetail:{},
    mxamount:[],
    more:false,
    fastLoading:true,
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
    },
    updateTime:'',
    update:false,
    orderType:1
  },
  TimeID: -1,
  onLoad: function (options) {
    // console.log(options);
    //接收参数，显示对应状态订单
    this.setData({
      currentTab: options.type
    })
  },
  modalFun: function({contentText,icon,iconSize,image,imageSize,time}){
    var _this = this;
    this.setData({
      modal: {
        show: true,
        contentText,icon,iconSize,image,imageSize
      }
    })
    setTimeout(() => {
      _this.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
    }) }, time?time:2000);
  },
  onPullDownRefresh() {
    this.getOrder()
  },
  onShow: function () {
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
    this.getOrder()
    this.setData({
      height: wx.getSystemInfoSync().windowHeight - 50
    })
  },
  loading: function () {
    var that = this
    if (that.data.fastLoading) {
      return false
    }
    if (this.data.orderData.length % 20!==0&&this.data.orderData.length % 20 < 20) {
      that.setData({
        more:true
      })
      setTimeout(()=>{that.setData({more:false})},2000)
    } else {
      wx.showLoading({
        title: '加载中',
        icon: 'loading',
        mask:true
      });
      this.setData({
        fastLoading: true
    })
      this.data.regInfo.pageNumber = this.data.orderData.length / 20 + 1;
      getAllOrder(this.data.regInfo).then(res => {
        let ti = 7*60*60*24
        var orderdatarr = res.data.map(item=>{
          item.suborderDiscountDetail = JSON.parse(item.suborderDiscountDetail)
          if (item.confirmedTime>0&&((item.confirmedTime+ti)-new Date().getTime()/1000)) {
            item.downTime = this.timestampToTime((item.confirmedTime+ti)-new Date().getTime()/1000)
          }else{
            item.downTime = ''
          }
          return item
        })
        orderdatarr = orderdatarr.map(e =>{
          e.pickUpDate = ''
          if (e.status == 'paid'||e.status == 'confirmed') {
            let pickUp = ''
            if (e.miniEditionGoodsInfo.sendtime>0) {
              pickUp = this.coniventTime(e.miniEditionGoodsInfo.sendtime+e.totalTime*3600)
            }else{
              pickUp = this.coniventTime(e.addtime+e.totalTime*3600)
            }
            e.pickUp = pickUp
          }
          var goodsAttrText = e.miniEditionGoodsInfo[0].goodsAttr
          //判断是买纸订单还是整版订单
          // if (!e.boxtype) {
          //   if (goodsAttrText.indexOf('纸行名称') == -1&&e.addtime>1629547810) {
          //     goodsAttrText = '纸行名称:'+e.paper.paperShop+';纸张品牌:'+e.paper.brand+';吨价/平方单价:'+e.paper.paperTonprice+'元;'+goodsAttrText
          //   }else if(goodsAttrText.indexOf('吨价/平方单价')){
          //     let str = '吨价/平方单价:'+e.paper.paperBaseprice+'元'
          //     let str2 = '吨价/平方单价:'+e.paper.paperTonprice+'元'
          //     goodsAttrText = goodsAttrText.replace(str,str2)
          //   }
          // }
            var arr = goodsAttrText.split(';')
            arr.forEach((items,i)=>{
              if (items.indexOf('平方单价')!=-1) {
                arr.splice(i,1)
              }
            })
            // arr.splice(1,0,'纸张信息:'+e.paper.brand+e.paper.kg+'g'+e.paper.colour)
            arr =arr.map(item =>{
              return item.split(':')
            }).filter(s=>{return s!=""})
            e.miniEditionGoodsInfo[0].goodsAttr = arr
            return e
          
        })
        this.setData({
          fastLoading: false,
          orderData: this.data.orderData.concat(orderdatarr)
        })
        this.data.orderData.map((item,i)=>{
          if (item.pickUp) {
            // this.setData({
              this.getDelivery(item.pickUp,Math.ceil(item.totalTime/24),i)
            // })
            // console.log(this.data.orderData);
          }
        })
        wx.hideLoading();
      })
    }
  },
  //获取订单列表
  getOrder: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.setData({
      update:false
    })
    clearInterval(this.data.updateTime)
    //判断请求对应状态的订单
    switch (this.data.currentTab) { 
      case "1":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20, orderType:this.data.orderType, status: 'nopaid' }//待付款
        })
        break;
      case "2":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20, orderType:this.data.orderType, status: 'confirmed' },//待配送
          update:true
        })
        break;
      case "3":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20, orderType:this.data.orderType, status: 'shipped' }//已完成
        })
        break;
      case "4":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20, orderType:this.data.orderType, status: 'cancel' }//已取消
        })
        break;
      case "0":
        this.setData({
          regInfo: { pageNumber: 1, pageSize: 20, orderType:this.data.orderType },//全部 
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
    getAllOrder(this.data.regInfo).then(res => {
      wx.hideLoading()
      var orderdatarr = res.data.map(item=>{
          item.suborderDiscountDetail = JSON.parse(item.suborderDiscountDetail)
          return item
      })
      this.setData({
        fastLoading:false,
        orderData:orderdatarr.map(e =>{
          e.pickUpDate = ''
          if (e.status == 'paid'||e.status == 'confirmed') {
            let pickUp = ''
            if (e.miniEditionGoodsInfo.sendtime>0) {
              pickUp = this.coniventTime(e.miniEditionGoodsInfo.sendtime+e.totalTime*3600)
            }else{
              pickUp = this.coniventTime(e.addtime+e.totalTime*3600)
            }
            e.pickUp = pickUp
          }
            
            e.miniEditionGoodsInfo.map(item=>{
              let goodsAttrText = item.goodsAttr
            // if (!e.boxtype) {
            //   if (goodsAttrText.indexOf('纸行名称') == -1&&e.addtime>1629547810) {
            //     goodsAttrText = '纸行名称:'+e.paper.paperShop+';纸张品牌:'+e.paper.brand+';吨价/平方单价:'+e.paper.paperTonprice+'元;'+goodsAttrText
            //   }else if(goodsAttrText.indexOf('吨价/平方单价')){
            //     let str = '吨价/平方单价:'+e.paper.paperBaseprice+'元'
            //     let str2 = '吨价/平方单价:'+e.paper.paperTonprice+'元'
            //     goodsAttrText = goodsAttrText.replace(str,str2)
            //   }
            // }
              let arr = goodsAttrText.split(';')
              arr.forEach((items,i)=>{
                if (items.indexOf('吨价')!=-1) {
                  arr.splice(i,1)
                }
              })
              // arr.splice(1,0,'纸张信息:'+e.paper.brand+e.paper.kg+'g'+e.paper.colour)
              arr =(arr.map(s =>{
                return s.split(':')
              })).filter(e=>{return e!=""})
              item.goodsAttr = arr
              return item
            })
          // var goodsAttrText = e.miniEditionGoodsInfo[i].goodsAttr
          // if (goodsAttrText.indexOf('纸行名称') == -1&&e.addtime>1629547810) {
          //   goodsAttrText = '纸行名称:'+e.paper.paperShop+';纸张品牌:'+e.paper.brand+';吨价/平方单价:'+e.paper.paperTonprice+'元;'+goodsAttrText
          // }else if(goodsAttrText.indexOf('吨价/平方单价')){
          //   let str = '吨价/平方单价:'+e.paper.paperBaseprice+'元'
          //   let str2 = '吨价/平方单价:'+e.paper.paperTonprice+'元'
          //   goodsAttrText = goodsAttrText.replace(str,str2)
          // }

          // var arr = goodsAttrText.split(';')
          // // arr.splice(1,0,'纸张信息:'+e.paper.brand+e.paper.kg+'g'+e.paper.colour)
          // arr =(arr.map(item =>{
          //   return item.split(':')
          // })).filter(s=>{return s!=""})
          // e.miniEditionGoodsInfo[i].goodsAttr = arr
          return e
        }),
        list:[]        
      })
    // 处理完成后，终止下拉刷新
    this.data.orderData.forEach((item,i)=>{
      if (item.pickUp) {
        // console.log(this.data.orderData);
        // this.setData({
          this.getDelivery(item.pickUp,Math.ceil(item.totalTime/24),i)
        // })
      }
    })
    wx.stopPullDownRefresh()
    // //结算倒计时
    // if (this.data.currentTab=='0'||this.data.currentTab=='2'||this.data.currentTab=='5') {
    //   this.runTime()
    // }
    })
  },
  /**把秒转换成日期格式 */
  coniventTime:function(time){
    var date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ?'0'+date.getDate():date.getDate()+' '
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
  },
  /**计算货期(跳过节假日) */
  getDelivery(date,time,i){
    let data = {}
    data.date = date//2021-09-21  17:00:00
    data.deliveryDay = time//货期天数
    data.type = 3 //1:大货2:打样3:拼一版qq小程序
    delivery(data).then(res=>{
      if (res.success) {
        this.setData({
          ['orderData['+i+'].pickUpDate']:res.data.slice(0,10)
        })
      }else{
        return ''
      }
    })
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
  },
  search: function () {
    var keywords = this.data.keywords
    getAllOrder({ orderNo: keywords, pageNumber: 1, pageSize: 40, orderType:this.data.orderType }).then(res => {
      this.setData({
        orderData: res.data
      })
    })
  },
  //多选
  checkboxChange:function(e){
    var arr = e.detail.value.map(item=>{
      return this.data.orderData[item*1]
    })
    if (e.length === this.data.orderData.length) {
      var allStatu = true
    }else{
      var allStatu = false
    }
    this.setData({
      Allchecked:allStatu
    })
    this.allCheckStatu(arr)
  },
  //算总价
  allCheckStatu:function(e){ 
    var priceArr = e.map(item=>{return item.amount*1}).reduce((prev,curr)=>{return prev*1+curr*1},0)
    this.setData({
      list:e.map(item=>{return item.parentOrderNo}),
      totalPrice:priceArr,
    })
  },
  //全选
  allCheckboxChange:function(){
    var brick = this.data.orderData;
    if (!this.data.Allchecked) {
      this.allCheckStatu(this.data.orderData)
      brick = brick.map(item=>{item.checked = true; return item})
    }else{
      this.allCheckStatu([])
      brick = brick.map(item=>{item.checked = false; return item})
    }
    this.setData({
      Allchecked:!this.data.Allchecked,
      orderData:brick
    })
  },
  /**
   * 合并支付
   */
  totalPay:function(){
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask:true
    });
    //合并订单
    createOrder({list:this.data.list}).then(res =>{
      //调用微信支付
      createWxPayUrl({ orderNo: res.data.orderNo, payType: app.globalData.payType }).then(resp => {
        var payBean = JSON.parse(resp.data)
        wx.hideLoading();
        wx.requestPayment({
          'timeStamp': payBean.timeStamp,//时间戳
          'nonceStr': payBean.nonceStr,//随机字符串
          'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
          'signType': payBean.signType,//非必要——签名算法
          'paySign': payBean.paySign,//签名
          'success': function (e) {
            // console.log(e);
            this.getAllOrder()
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
    })
  },
  //调用微信支付
  WXpay: function (e) {
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask:true
    });
    WxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType }).then(res => {
      var payBean = JSON.parse(res.data)
      wx.requestPayment({
        // 'appId':payBean.appid,
        'timeStamp': payBean.timeStamp,//时间戳
        'nonceStr': payBean.nonceStr,//随机字符串
        'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
        'signType': payBean.signType,//非必要——签名算法
        'paySign': payBean.paySign,//签名
        'success': function (res) {
          this.getAllOrder()
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
  DiffOrderPay:function (e) {
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
            this.getAllOrder()
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
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
        orderData:[]
      })
      that.getOrder()
    }
  },
  cancel: function (e) {
    var that = this
    wx.showModal({
      title: '取消订单',
      confirmColor: '#02BB00',
      content: '确认取消此订单？',
      success: function (res) {
        if (res.confirm) {
          cancelOrder({ data: e.currentTarget.dataset.sn }).then(res => {
            if (res.success) {
              that.modalFun({contentText:'取消成功',icon:'ac-icon-check'})
            }else{
              that.modalFun({contentText:'订单取消失败，请稍后重试'})
            }
            that.getOrder()
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
              _this.modalFun({contentText:'删除成功',icon:'ac-icon-check'})
            }else{
              _this.modalFun({contentText:'删除失败，'+res.message})
            }
          })
        } 
      }
    })
  },
  runTime(){
    let _this = this
    let ti = 7*60*60*24
    this.setData({
      updateTime:setInterval(() => {
        // console.log(_this.data.orderData);
        _this.data.orderData.forEach((item,i) => {
          _this.setData({
            ['orderData['+i+'].downTime']: ((item.confirmedTime+ti)-(new Date().getTime()/1000))>0?('结算倒计时:'+_this.timestampToTime((item.confirmedTime+ti)-new Date().getTime()/1000)):''
          })
        });
      }, 1000)
    })
  },
  //转换时间显示格式
  timestampToTime: function (time) {
    var D = (parseInt(time/86400)>0?parseInt(time/86400):0 )+ '天';
    var h = (parseInt((time%86400)/3600)>0?parseInt((time%86400)/3600):0 )+ '时';
    var m = (parseInt(((time%86400)%3600)/60)>0?parseInt(((time%86400)%3600)/60):0) + '分';
    var s = (parseInt(((time%86400)%3600)%60)>0?parseInt(((time%86400)%3600)%60):0) + '秒';
    return  D + h + m + s;
  },
  //跳转到订单详情
  getOrderDetails(e) {
    const _this = this
    clearTimeout(this.TimeID)
    this.TimeID = setTimeout(function () {
      console.log(e);
      wx.navigateTo({
        url: 'orderDetails/index?data=' + e.currentTarget.dataset.sn
      })
    }, 500)
  },
  onHide() {
    clearInterval(this.data.updateTime)
  },
  onUnload() {
    clearInterval(this.data.updateTime)
  }
})

// page/component/new-pages/cart/cart.js
import { getShippingMode, getDefault, saveXcxOrdersRepurchase, getXcxReorderCartData, editXcxReorderGoods, createOrder } from "../../../api/cartApi.js";
import { createSingleOrder, singleWxPayUrl,SubOrderNoByOrderNo, getByUid, _getByUid, _update, saveAddress} from "../../../api/orderApi.js";
import { getMyList, getById,getDbUserInfo } from "../../../api/userApi"
import { splitStr, editVersionType, debounce,oversize} from "../../../utils/util";
import { areaList } from '@vant/area-data';
import { pinban, getPinBanParams, signByBehavior} from "../../../api/pinban.js";
import { customerOrderCouponDrawList } from "../../../api/couponApi.js";

//获取应用实例
const app = getApp()
import {data,methods} from '../../../utils/credit'
Page({
    /** 信用支付 */
    selectCredit(e){
      e.sn =  e.currentTarget.dataset.sn
      e.wxPayCallBlack = 'payOrder'
      console.log('e',e)
      this.getUserCreditPurchase(e)
    },
  ...methods,
  data: {
    ...data,
    areaList,
    creditType:'supplier',
    creditCallBlack:'toPage',//信用支付回调函数名称
    carts: [],
    totalPrice: 0,
    username: '',
    phone: '',
    remarks: '',
    address: null,//收货地址
    cuttingFeeprice: 0,
    discountsPaperprice: 0,
    isFrom: 0,
    priceArr: [],
    cprice: 0,
    differ: 0,
    totalOrder: '',
    pitCprice: 0,
    cutting: '',
    cartId: '',
    Interval: '',
    type: 1,
    modal: {
      show: false,//modal是否显示，默认false
      contentText: '',
      icon: '',
      iconSize: '',
      image: '',
      imageSize: ''
    },
    queryCount: 0,
    showModal: false,
    payRse: null,
    DistributionText: '物流配送',
    logisticsList: [],
    logistics: {}, // 选中的物流方式
    ConsignmentId: '',
    show: false,
    actions: [
      {
        name: '信用支付',
        subname: '描述信息'
      },
      {
        name: '微信支付',
      },
    ],
    bonusNum:0,
    bonusMoney:'',
    bonusId:'',
    bonusUseType:'',
    ByOrderNo:'',//子单号
    isCustom: true, // 是否有自定义工艺
    invoice: {
      invoiceType: 'CRM', // 'CRM' 电子 'paper' 纸质
      invoiceInfo: null,
      lookUp: 'firm'
    },
    invoiceInfo: null,
    show: false,
    saveCity: false,
    location: {
      contacts: '',
      city: '',
      address: '',
      mobile: '',
      values: null
    },
    more: false,
    isempty: false,
    payDisplay: false, // 是否阻止支付
    oldSn: '',
    isRestart: false,
    priceFluh: false,
    webfrom:'',
    flushOrderDataBool: true,
    noLines: false,
    couponData: [],
    coupon: {
      radio: '-1'
    },
    freeShipping: {
      couponType: ''
    },
    isOut: false,
    ifGetCouponData: null, // 是否获取优惠券 判断是否是第一次请求刷新
    loading: false, // 用于防止电脑端 点击穿透 在获取订单和优惠券信息时 触发了提交订单
    // active: 0,
  },

  onLoad: function (o) {
    wx.showShareMenu()
    if (o?.from == 'canOrder') {
      saveXcxOrdersRepurchase({orderNo: o.sn}).then(res => {
        if (res.code == '000000') {
          this.setData({
            checkedBoxList: res.data
          })
        } else {
          this.setData({
            payDisplay: true
          })
          wx.showModal({
            title: "提示",
            content: res.message,
            showCancel: false,
            success: function () {
            }
          })
        }
      })
    }
    this.setData({
      username: wx.getStorageSync('username'),
      phone: wx.getStorageSync('phone'),
      isFrom: o.isFrom * 1,
      canOrderSn: o?.sn,
      from: o?.from,
      webfrom: o.webfrom // 线下报价标识
    })
  },
  onShow() {
    this.data.loading = true
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
    // 获取当前选中地址
    this.getDefaultAddress()
    
    getByUid({pageNumber:1,pageSize:10}).then(res => {
      if (res.success && res.data?.length) {
        for (let i = 0; i < res.data.length; i++) {
          const el = res.data[i];
          if (el.defaultTemp) {
            el.invoiceVo.id = el.id
            this.setData({
              invoiceInfo: el.invoiceVo
            })
          }
        }
      }
    })
    this.getLocation()
  },
  getLocation() {
    // 获取发票地址
    _getByUid({}).then(res => {
      if (res.success && res.data.length) {
        let city =  res.data[0].city.split('-')
        let county = areaList.county_list
        res.data[0].values = Object.keys(county).find(e => county[e] == city[2])
        this.locationPopup(res.data[0])
      }
    })
  },
  //获取收货地址
  getAddress(id) {
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask: true
    });
    //根据收货地址id查收货地址详情，同时后台会重新计算运费
    getById({ id: id }).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.success && res.data != null) {
        this.setData({
          address: res.data,
          addAddres: false,
          DistributionText: res.data.province == '广东省' ? '物流配送' : '物流配送'
        })
        this.flush()
      } else {
        wx.removeStorageSync('addressId')
        this.getDefaultAddress()
      }
    }).catch(err => {
      wx.hideLoading()
    })
  },
  /**获取默认收货地址 */
  getDefaultAddress() {
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask: true
    });
    //不知道干啥的，照着官网每次获取收货地址调用一下
    getDefault().then(res => {
      wx.hideLoading()
      wx.showLoading({
        title: '',
        icon: 'loading',
        mask: true
      });
      //获取收货地址列表
      getMyList().then(resp => {
        wx.hideLoading()
        if (resp.data.length > 0) {
          this.setData({
            addAddres: false
          })
          this.getAddress(resp.data[0].id)
        } else if (resp.data.length < 1) {
          this.setData({
            addAddres: true,
            address:null
          })
          this.flush()
        }
      })
    })
  },
  /**添加收货地址 */
  myNavigateTo() {
    wx.navigateTo({
      url: "../../personageCenter/settings/address/NewAddress/index?type=add",
    });
  },
  toAddressList() {
    wx.navigateTo({
      url: "../../personageCenter/settings/address/index?type=selsect",
    });
  },
  /**
   * 消息提示
   * @param {Object} 
   */
  modalFun({ contentText, icon, iconSize, image, imageSize, time }) {
    var than = this;
    this.setData({
      modal: {
        show: true,
        contentText, icon, iconSize, image, imageSize
      }
    })
    setTimeout(() => {
      than.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
      })
    }, time ? time : 2000);
  },
  // 获取订单
  getcheckEdition(obj= { isFrom: this.data.isFrom * 1, isMakeUp: 0,invoiceType:2,bonusId:this.data.bonusId}) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let func = getShippingMode
    if (this.data.from == 'canOrder') { // 判断是否是一键翻单
      func = getXcxReorderCartData
      obj.carts = this.data.checkedBoxList
    }
    if (this.data.webfrom) { // 线下报价 为 5
      obj.webfrom = this.data.webfrom
    }
    // 未选择地址 或者地址不在省内
    if (this.data.addAddres || this.data.address.province != '广东省' ) {
      // 不包邮
      obj.isFreeQuota = 0
    }
    // 没有选择配送方式默认 包邮
    if (!this.data.logistics.shippingName || this.data.ifGetCouponData) {
      obj.isFreeQuota = 1
    }
    func(obj).then(res => {
      if (!res.success) {
        wx.showModal({
          title: '提示',
          content: '没有找到订单数据,请稍后重试！',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
        return false;
      }
      // console.log('moren->',res.data.shippingModeVos[0].orderShippingInfo[this.data.active]);
      this.setData({
        logisticsList: res.data.shippingModeVos[0].orderShippingInfo,
      })
      // 判断当前配送方式是否在这个地址存在
      let obj = this.data.logisticsList.find(e => e.id == this.data.logistics.id)
      if (!obj) { // 不存在直接清空
        console.log('清空');
        this.setData({
          logistics: {
            price: res.data.totalAmount
          }
        })
      } else { // 存在更新运费，和总价
        this.setData({
          logistics: { ...this.data.logistics, ...obj}
        })
        console.log('覆盖', this.data.logistics);
      }
      if (this.data.ifGetCouponData) {
        this.getCoupon()
      } else {
        this.data.ifGetCouponData = true
        this.data.loading = false
      }
      let checkedBoxList = []
      let carts = []
      if (this.data.priceFluh) { // 是否刷新价格
        let newArr = res.data.shippingModeVos[0].miniCartList
        let oldArr = this.data.carts
        for (let i = 0; i < newArr.length; i++) {
          const el = newArr[i];
          let index = oldArr.findIndex(e => e.id == el.id)
          // 商品总价
          oldArr[index].ownTakeDiscountGoodsTotal = el.ownTakeDiscountGoodsTotal
          oldArr[index].goodsTotal = el.goodsTotal
        }
        checkedBoxList = this.data.checkedBoxList
        carts = oldArr
      } else {
        res.data.shippingModeVos[0].miniCartList.map
        checkedBoxList = res.data.shippingModeVos[0].miniCartList.map(item => {return item.id})
        carts = res.data.shippingModeVos[0].miniCartList.map(item => {
          // 拼接商品名称 如 拼版_ 专版_
          item.versionType=editVersionType(item.versionType)
          let a = splitStr(item.goodsAttr, app.globalData.frontPaperMap);
          if(item.priceInfoMap){
            if(item.priceInfoMap.greyVersion){
              a = splitStr(item.priceInfoMap.competGoodsAttr,app.globalData.frontPaperMap);
            }else{
              a = splitStr(item.goodsAttr,app.globalData.frontPaperMap);
            }
           }
          item.newgoods = a;
          item.checked = true
          return item
        })
      }
      this.setData({
        payRse:null,
        oldSn: res.data.orderId,
        totalOrder: res.data,
        isRestart: false,
        isCustom: res.data.isCanPay == 0 ? true : false,
        checkedBoxList: checkedBoxList ,
        carts: carts,
        isOut: res.data.shippingModeVos[0].isOut
      })
    }).finally(() => {
      wx.hideLoading()
    })
  },
  // onClickLogistics(e) {
  //   console.log('clis', e);
  //   let el = this.data.logisticsList.find(item => item.shippingName == e.detail.title)
  //   this.setData({
  //     logistics: el,
  //     active: e.detail.index
  //   })
  //   this.getTotalPrice()
  // },
  formname(e) {
    this.setData({
      username: e.detail.value
    })
  },
  formphone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  formremarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  ordernow:debounce(function() {
    if (this.data.payDisplay) {
      return
    }
    if (!this.data.address) {
      this.modalFun({ contentText: '请选择收货地址', time: 1500 })
      return
    }
    if (!this.data.logistics.id) {
      this.modalFun({ contentText: '请选择配送方式', time: 1500 })
      return
    }
    if(this.data.address.province=="台湾省" || this.data.address.province=='澳门' || this.data.address.province=='香港' ){
      wx.showToast({
        icon:'none',
        mask:true,
        title: '超出配送范围~',
      })
      return
    }
    if (this.data.invoice.invoiceInfo != null && !this.data.invoiceInfo) {
      wx.showToast({
        icon:'none',
        mask:true,
        title: '请选择发票信息',
      })
      return
    }
    if (this.data.invoice.invoiceInfo != null && this.data.invoice.invoiceType == "paper" && this.data.location.contacts == '') {
      wx.showToast({
        icon:'none',
        mask:true,
        title: '请选择收票地址',
      })
      return
    }

    if (this.data.loading) {
      wx.showToast({
        icon:'none',
        mask:true,
        title: '正在获取数据,请稍等',
      })
      return
    }
    
    var nameReg = /^[\u4E00-\u9FA5]{2,15}$/;
    if (this.data.remarks.length > 120) {
      wx.showToast({
        title: '备注字数不能超过120个', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    } else {
      let Odata=[]
      let data = {
        addressReq: {
          consigneeName: this.data.address?.consigneeName,
          mobile: this.data.address?.mobile,
        },
        bonusId:this.data.bonusId,
        bonusUseType:this.data.bonusUseType,
        consigneeId: this.data.logistics.id != 35 ? this.data.address?.id : 1,//收货地址
        documentId: 0,
        formShippingItemVoList: [
          {
            list: this.data.checkedBoxList.map(item => {
              let obj =  this.data.carts.find(e =>e.id == item)
              Odata.push({
                goodsId: obj.goodsId,
                goodsAttr: obj.goodsAttr
              })
              return { cartId: item, customName: obj.customName, ordersGoodsId: obj.recId}
            }),
            shippingId: this.data.logistics.id,
            shippingName: this.data.logistics.shippingName,
            supplierId: this.data.logistics.shippingId,
            isOut: this.data.isOut
          }
        ],
        invoiceId: null,
        isEdit: "1",
        isMakeUp: 0,
        memo: this.data.remarks,
        oldSn: this.data.oldSn,
        senderId: 0,
        couponList: []
      }
      // 其他可选优惠券
      if (this.data.coupon.couponName) {
        data.couponList.push(this.data.coupon)
      }
      // 免邮券
      if (this.data.freeShipping?.couponType) {
        data.couponList.push(this.data.freeShipping)
      }
      data.couponList = data.couponList.map(e =>{
        if (Number(e.useMoney)) {
          return {
            couponPlanDrawId: e.id,
            couponType: e.couponType,
            couponPlanId: e.couponPlanId,
            useDiscountsMoney: e.useMoney
          }
        } else {
          return null
        }
      }).filter(e => e)
      if (this.data.invoiceInfo &&  this.data.invoice.invoiceInfo != null) {
        data.invoiceAddressId = this.data.location.id,
        data.invoiceId = this.data.invoiceInfo.id,
        data.invoiceCategory = this.data.invoice.invoiceType == "paper" ? '1' : '2',
        data.invoiceType = this.data.invoice.invoiceInfo == "general" ? 0 : 1
      }
     
      if (this.data.payRse&&this.data.payRse.success) {
        // 传入selectCredit的参数
        if(this.data.bonusId){
          this.payOrder()
        }else{
          let ev = {
            currentTarget:{
              dataset:{
                amount:this.data.totalPrice,
                sn: this.data.payRse.data,
              }
            },
            wxPayCallBlack:'payOrder'
          }
          this.selectCredit(ev)
        }
        return
      }
      let _this=this
      //保存地址id，下一次下单时默认选择
      oversize(Odata,true).then(()=>{
        wx.setStorageSync('addressId', _this.data.address?.id)
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        let _func = _this.data.from == 'canOrder' ?  createOrder : createSingleOrder
        _func(data).then(res => {
          if (res.success) {
            _this.setData({
              payRse: res
            })
            _this.saveReport('生成订单')
            SubOrderNoByOrderNo({data:res.data}).then(res=>{
              console.log(358,res);
              // 如果有自定义工艺则 直接跳转订单详情页
              if (_this.data.isCustom) {
                wx.redirectTo({
                  url: '../../personageCenter/allSingleOrder/orderDetails/index?data='+ res.data[0]
                })
                return
              }
              _this.setData({
                ByOrderNo:res.data[0]
              })
              
              if(_this.data.bonusId){
                _this.payOrder()
              }else{
                let ev = {
                  currentTarget:{
                    dataset:{
                      amount:_this.data.totalPrice,
                      sn: res.data,
                    }
                  },
                  wxPayCallBlack:'payOrder'
                }
                _this.selectCredit(ev)
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.message,
              success(res) {
                _this.flush()
              },
              fail: function () {
                _this.flush()
              }
            })
          }
          //2022-04-27 shannon
          wx.hideLoading()
        })
      })
    }
  }),
  payOrder: function () {
    let _this = this
    let res = _this.data.payRse
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    singleWxPayUrl({ orderNo: res.data, payType: app.globalData.payType }).then(resp => {
      wx.hideLoading()
      var payBean = JSON.parse(resp.data)
      if (!resp.success) {
        wx.showToast({
          title: resp.message,
          icon: 'error',
          duration: 2000,
          complete() {
            wx.redirectTo({
              url: '../../personageCenter/allSingleOrder/orderDetails/index?data='+ _this.data.ByOrderNo
            })
          }
        })
        return false
      }
      wx.requestPayment({
        'timeStamp': payBean.timeStamp,//时间戳
        'nonceStr': payBean.nonceStr,//随机字符串
        'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
        'signType': payBean.signType,//非必要——签名算法
        'paySign': payBean.paySign,//签名
        'success': function (res) {
          _this.saveReport('支付成功')
          
          wx.hideLoading()
          _this.setData({
            toastShow: true
          })
          wx.redirectTo({
            url: '../../personageCenter/allSingleOrder/orderDetails/index?data='+_this.data.ByOrderNo
          })
        },
        'fail': function (res) {
          console.log(JSON.stringify(res))
          console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: "提示",
            content: "支付失败",
            showCancel: false,
            success: function () {
              wx.redirectTo({
                url: '../../personageCenter/allSingleOrder/orderDetails/index?data='+_this.data.ByOrderNo
              })
            }
          })
        }
      })
    })
  },
  toPage(){
    let _this=this;
    wx.redirectTo({
      url: '../../personageCenter/allSingleOrder/orderDetails/index?data='+_this.data.ByOrderNo
    })
  },
  inputName(e) {
    console.log(e.currentTarget.dataset.key, e.detail.value);
    this.setData({
      ["carts["+e.currentTarget.dataset.key+"].customName"]: e.detail.value
    })
    console.log('this.data,',this.data.carts);
  },
  jumpInvoice(){
    wx.navigateTo({
      url: '../../personageCenter/invoice/index?from=detail'
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    let _this=this
    let res = this.data.payRse
    var ordernum = res.data[0].children[0]
    this.hideModal();
    wx.showToast({
      title: '取消支付订单',
      icon: 'none',
      duration: 2000,
      success: function () {
        if (res.data) {
          wx.redirectTo({
            url: '../../personageCenter/allSingleOrder/orderDetails/index?data='+_this.data.ByOrderNo
          })
        }
      }
    })
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    this.payOrder()
  },
  getTotalPrice() {
    var carts = this.data.carts;                  // 获取购物车列表
    var total = 0;
    carts.forEach(item => {
      total += item.ownTakeDiscountGoodsTotal
    })
    this.setData({
      pitCprice: total 
    })
  },

  locationPopup(data) {
    this.data.location = data
    this.data.location.contactsPopup = data.contacts
    this.data.location.mobilePopup = data.mobile
    this.data.location.cityPopup = data.city
    this.data.location.addressPopup = data.address
    this.setData({
      location: this.data.location
    })
  },
  //跳转使用优惠券
  goCoupon(e){
    // 需要增加收货人信息 未选择了配送方式
    if (this.data.addAddres || !this.data.logistics?.id) {
      wx.showToast({
        title: '请检查收货人信息和配送方式',
        icon: 'none'
      })
      return
    }
    let val=e.currentTarget.dataset.coupon.map(e => {return e.visibleStatus == 0 ? e : null}).filter(e => e)
    wx.navigateTo({
      url: './coupon/index?coupon='+JSON.stringify(val) + '&radio=' + this.data.coupon.radio,
    })
  },
  async saveReport(actionName){
    let  _this = this;
    if(_this.data.isFrom==0){
      let obj = {
          '生成订单':{
            "actionId": 2,
            "channel":800000
          },
          '支付成功':{
            "actionId": 3,
            "channel":800000
          }
      }
      if(obj[actionName]) {
        app.saveReport(obj[actionName])
      }
    }else{
      let cart = this.data.carts[0];
      
      if(!cart) return
      if(cart.versionType.indexOf('拼版')!=-1){
        let obj = {
          '生成订单':{
            "actionId": 3,
          },
          '支付成功':{
            "actionId": 4,
          }
        }
        app.saveReport({
          actionId:obj[actionName].actionId,
          channel:cart.goodsName.indexOf('卡纸盒')!=-1?600000:601000
        })
      }else{
        let obj = {
            '生成订单':{
              "actionId": 5,
            },
            '支付成功':{
              "actionId": 6,
            }
          }
        if(cart.versionType.indexOf('自动专版')!=-1){
          app.saveReport({
            goodsId:cart.goodsId,
            actionId:obj[actionName].actionId,
            type:'专版报价'
          })
        }else if(cart.versionType.indexOf('自定义专版')!=-1){
          app.saveReport({
            actionId:obj[actionName].actionId,
            channel:cart.goodsId==640?500800:501900
          })
        }
      }
    }
  }, 
   
  // 单选事件
  radioTap(e) {
    let data = e.currentTarget.dataset
    this.setData({
      ['invoice.'+data.key]: data.val
    })
    if (data.key == 'invoiceInfo' && data.val == 'special') {
      this.setData({
        ['invoice.invoiceType']: 'paper'
      })
    }
    this.flush()
  },
  inputVal(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      ['location.' + key]: value
    })
  },
  // 刷新
  flush() {
    let obj = {
      invoiceAddressId:this.data.location.id,
      isFrom: this.data.isFrom * 1,
      isMakeUp: 0,
      invoiceCategory: this.data.invoice.invoiceType == "paper" ? 1 : 2, // 发票类型 纸质 电子
      invoiceType: this.data.invoice.invoiceInfo == "general" ? 0 : 1, // 发票类型 普通 专用
      bonusId:this.data.bonusId, // 优惠券
    }

    if (this.data.invoice.invoiceInfo == null || this.data.invoiceInfo == null) {
      this.setData({
        more: false
      })
      this.getcheckEdition()
    } else {
      this.getcheckEdition(obj)
    }
  },
  showPopup(e) {
    let data = e.currentTarget.dataset
    if(data.key != 'saveCity') {
      this.locationPopup(this.data.location)
    }
    this.setData({[data.key]: true});
  },
  onClose(e) {
    let data = e.currentTarget.dataset
    this.setData({ [data.key]: false });
  },
  saveCity(e) {
    console.log(e.detail);
    this.setData({
      saveCity: false,
      values: e.detail.values[2].code,
      ['location.cityPopup']: e.detail.values.map(e => e.name).join('-')
    });
  },
  saveLocation() {
    let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
    if (!this.data.location.contactsPopup) {
      wx.showToast({
        title: '请填写收货人',
        icon: 'none'
      })
      return
    } else if (!reg.test(this.data.location.mobilePopup)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return
    } else if (!this.data.location.cityPopup) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      })
      return
    } else if (!this.data.location.addressPopup) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return
    }

    let obj = {...this.data.location}
    obj.contacts = this.data.location.contactsPopup
    obj.mobile = this.data.location.mobilePopup
    obj.city = this.data.location.cityPopup
    obj.address = this.data.location.addressPopup

    if (obj?.id) {
      _update({data: obj}).finally(() => {
        this.setData({
          show: false
        })
        this.getLocation()
        this.flush()
      })
    } else {
      saveAddress({data: obj}).finally(() => {
        this.setData({
          show: false
        })
        this.getLocation()
        this.flush()
      })
    }
  },
  clickMore() {
    this.setData({
      more: !this.data.more
    })
  },
  changeBox(event) {
    let list = this.data.carts
    let index = event.currentTarget.dataset.index
    list[index].checked = event.detail
    let checkedBoxList = this.data.checkedBoxList

    if (event.detail) {
      checkedBoxList.push(list[index].id)
    } else {
      let i = checkedBoxList.findIndex(e => e == list[index].id)
      checkedBoxList.splice(i,1)
    }
    let payDisplay = checkedBoxList.length ? false : true;

    this.setData({
      payDisplay: payDisplay,
      carts: list,
      checkedBoxList: checkedBoxList,
      priceFluh: true
    })
    if (checkedBoxList.length && !this.data.isRestart) {
      this.flush()
    }
  },
  // 拼版-卡纸-单铜纸 数量 不可少于 500 每次加减 1000
  // 拼版-内托 数量 不可少于 1000 每次加减 1000
  // 专版-卡纸 数量 不可少于 1000 每次加减 1
  numberChange:function(e){
    let data = e.currentTarget.dataset
    let val = this.data.carts[data.index].num
    this.data.carts[data.index].isRestart = true
    if (data.type=='add') {
      val += 1000
    }else if (data.type=='reduce'){
      val = val-1000
    } else if (data.type == 'input') {
      val = Number(e.detail.value)
    }
    if (val<1000) {
      if (data.attr.indexOf('超高松纸_350') != -1) {
        val = val>500?1000:500
      }else{
        val = 1000
      }
    }else if(val>99999000){
      val = 99999000
    }else{
      val = val%1000>500?(Math.floor(val/1000)+1)*1000:Math.floor(val/1000)*1000
    }
    if (this.data.carts[data.index]==val) {
      return
    }
    this.data.carts[data.index].num = val
    this.setData({
      carts: this.data.carts,
      isRestart: !(this.data.carts[data.index].versionType.indexOf('拼版') != -1 )
    })

    if (this.data.carts[data.index].versionType.indexOf('拼版') != -1 ) {
      editXcxReorderGoods({number: val,id: this.data.carts[data.index].id}).then(res => {
        this.flush()
      })
    }
  },
  restart() {
    if (this.data.payDisplay) {
      return
    }
    let carts = this.data.carts

    let data = {}
    wx.showLoading({
      title: '加载中...',
    })
    getPinBanParams(data).then(res => {
      if (res.success) {
        let obj ={
          fenqie_w : JSON.parse(res.data.paperSlit).map(item=>{return item.v}).join(','),//273,298.5,364,398,546, 597, 635, 660, 700, 711, 740, 787
          safe_distance_ka : res.data.horizontal+','+res.data.vertical, // '3,3',坑盒和卡盒字段不一样
          safe_distance_ken : res.data.pitHorizontal+','+res.data.pitVertical, // '3,3',坑盒和卡盒字段不一样
          place_holder : res.data.left+','+res.data.right+','+res.data.biteOpposite+','+res.data.bite,//'3, 3, 3, 10',
        }
        let promiseArr = carts.map(e => {
          if (e.goodsTag == 7) { // 专版-微坑盒
            obj.safe_distance = obj.safe_distance_ken
          } else { // 专版-卡纸
            obj.safe_distance = obj.safe_distance_ka
          }
          if (e.versionType.indexOf('拼版') != -1 ) {
            return new Promise((resolve, reject) => {
              console.log('拼版订单');
              resolve()
            })
          }
          // 5月份 修改以下 参数 改变 拼版接口参数
          let arr = ['表面处理:逆向UV;', '银卡纸', '白墨']
          let machine = false
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (e.goodsAttr.indexOf(el) != -1) {
              machine = true
              break;
            }
          }
          obj.machine = machine ? 'UV印刷机' : '普通印刷机'
          return new Promise((resolve, reject) => {
            pinban({...obj,pdf_path:e.cutModelUrl}).then(res => {
              let data = {
                id: e.id,
                number: e.num,
                pinBanStr: res.data,
                cutModelUrl: e.cutModelUrl
              }
              editXcxReorderGoods(data).then(res => {
                if (res.success) {
                  resolve()
                }
              })
              signByBehavior({moduleName:"pinban_fan",desc:JSON.stringify({pinban_single_web:{goodsId:e.goodsId,goodsAttr: e.goodsAttr,number: e.num,}})})
              // resolve()
            })
          })    
        })
        Promise.all(promiseArr).then(res => {
          this.flush()
        })
      }
    })
  },
  jumpLogistics() {
    let json = JSON.stringify(this.data.logisticsList)
    wx.navigateTo({
      url: './logistics/index?id=' + this.data.logistics.id + '&data=' + json,
    })
  },
  getCoupon() {
    // 需要增加收货人信息 未选择了配送方式
    if (this.data.addAddres || !this.data.logistics.id) {
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 请求之前，清空之前记录
    this.setData({
      freeShipping: {
        couponType: ''
      }
    })
    getDbUserInfo().then(res => {
      let obj= {
        systemType: this.data.from == 'canOrder' ? 'pinyiban_wx_offline' : 'pinyiban_wx',
        orderType: '1',
        goodsId: '',
        goodsSumMoney: 0,
        taxesSumMoney: this.data.logistics.taxSingle || 0,
        postageSumMoney: this.data.logistics.freeFreight || 0,
        uuid: res.data.uuid
      }
      let goods = this.data.carts.map(e=> {
        obj.goodsSumMoney += Number(e.goodsTotal)
        return e.goodsId
      }).join(',')
      obj.orderSumMoney = obj.goodsSumMoney + Number(obj.taxesSumMoney) + Number(obj.postageSumMoney)
      obj.goodsId = goods
      customerOrderCouponDrawList(obj).then(res => {
        // 满足包邮条件 没有额度 需要刷新 其他不需要
        // 满足包邮的前提 地址是广东省内
        if (res.code == 200 && this.data.address.province == '广东省') {
          this.data.flushOrderDataBool = true
          for (let i = 0; i < res.data?.length; i++) {
            const el = res.data[i];
            // 如果是免邮券 不刷新价格
            if (el.couponType == 'free_shipping_coupon') {
              this.data.flushOrderDataBool = false
              this.setData({
                freeShipping: el
              })
              res.data.splice(i,1)
              this.data.carts.map(e => {
                return e
              })
            }
          }
          if (this.data.flushOrderDataBool) {
            this.data.flushOrderDataBool = false
            this.data.noLines = true
            this.setData({
              freeShipping: {
                couponType: ''
              }
            })
          }
        }
        wx.hideLoading()
        if (this.data.ifGetCouponData) {
          this.data.ifGetCouponData = false
          this.flush()
        }
        this.setData({
          couponData: res.data || []
        })
      }).catch(() => {
        wx.hideLoading()
      })
    }).catch(() => {
      wx.hideLoading()
    })
  }
})
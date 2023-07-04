// pages/bill/index.js
import { customerBill, supplierBill,getSupplierBill, addOrderPay,setAddOrderPay, orderPaySuccess,getOrderPaySuccess} from '../../api/bill';
const app = getApp();
Page({
  /**
   * 页面的初始数据 
   */
  data: {
    active1: 1,
    active: 1,
    payVal: {},
    billList: [{ name: '待支付' }, { name: '已付款' }],
    navTab: ['客户账单', '加工商账单'],
    is_pay: 0,//是否支付：0.待支付，1.已支付
    sendList: [],
    currentTab: 1,
    show: false,
    show1: false,
    isProcessor: 0,
    marginrl: -32,
    isbg: 'none',
    scrollTop: 0,
    tabTop: 0,
    contMart:130,
    isInit: false,//客户账单进页面时隐藏
    isShow: false,//加工商进入页面时隐藏
    allList:
    {
      pending_settlement: '0',//待结算金额
      supplier_customer: [
        {
          "id": 0, //客户id
          "customer_name": "傲彩", //客户名
          "customer_uid": 0, //客户UID
          "customer_type": 2, //客户类型：1.其他客户，2.傲彩
          "customer_info": {
            "wx_portrait": null, //微信头像地址
            "wx_nickname": null, //微信昵称
            "user_tel": 'null' //手机号
          } //客户信息
        },
      ],//账单客户列表

    },//客户账单列表
    supplierList: [
      // {
      //   "years_month": "2022-04", //账单年月
      //   "supplier_id": 3, //加工商id
      //   "supplier_name": "展鹏印刷", //加工商名称
      //   "total_price": 111, //总金额
      //   "unpaid_price": 111, //待支付
      //   "paid_price": 0 //已支付
      // }
    ],//加工商列表
    shareList: {
      supplier_id: '',
      years_month: '',
      order_id: '',
      is_share: 0,
      share_id: ''
    },

    bill_type:null,//是否是印刷加工单账单--1：表示是
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if (typeof (options.isProcessor) != 'undefined') {
      _this.setData({
        isProcessor: options.isProcessor,
        //isProcessor: 0
      })
      //判断是加工商时的页面
      if (_this.data.isProcessor == 1 && _this.data.isProcessor == '1') {
        _this.setData({
          currentTab: 0,
          marginrl: 0,
          isbg: 'block',
          tabTop: 130,
          contMart:250
        })
      }
    }
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    _this.customerBill()
    this.setData({
      supplierList:[]
    })
    _this.supplierBill(_this.data.is_pay)
  },

 



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 跳转到客户账单月份列表/加工商账单月份详情
   */
  myNavigateTo(e) {
    let _this = this
    let customer = e.currentTarget.dataset.customer
    let url = e.currentTarget.dataset.url
    console.log(e)
    if (url == 'billList') {
      wx.navigateTo({ url: url + '/index?customer=' + JSON.stringify(customer) })
    } else {
      wx.navigateTo({
        url: url + '/index?customer=' + JSON.stringify(customer) + '&isPay=' + _this.data.is_pay
      })
    }
  },
  //客户账单和加工商账单之间的切换
  currentTab(e) {
    let _this = this
    let current = e.currentTarget.dataset.current
    if(_this.data.currentTab==current){
      return
    }
    if (current == 1) {
      this.setData({
        supplierList:[]
      })
      _this.supplierBill(_this.data.is_pay)
    } else {
      _this.customerBill()
    }
    _this.setData({
      currentTab: current
    })
  },
  //加工商账单下的待支付和已付清之间的切换
  detailTap(e) {
    console.log(e);
    if (this.data.is_pay == e.currentTarget.dataset.idx) return
    this.setData({
      is_pay: e.currentTarget.dataset.idx,
      supplierList: [],
      isShow: false
    })
    this.supplierBill(this.data.is_pay)
  },
 
  //关闭成功的弹框
  onClose(e) {
    let status = e.currentTarget.dataset.status
    if (status == 'bottom') return this.setData({ show: false })
    this.setData({
      show1: false,
      ['monthDetail.data']: [],
      supplierList:[]
    });
    this.supplierBill(this.data.is_pay)
    
  },
//掉起支付确认
  bindPay(e) {
    const {pay,status}  = e.currentTarget.dataset
    this.setData({
      ['shareList.supplier_id']: pay.supplier_id,
      ['shareList.years_month']: pay.years_month,
      bill_type:pay.bill_type
    })
    this.addOrderPay(status)
  },
  /**
   * 获取客户账单列表
   */
  customerBill: function () {
    let _this = this
    customerBill().then((resluts) => {
      console.log(resluts.data);
      if (resluts.code == 200) {
        _this.setData({
          allList: resluts.data
        })
      } else {
      }
      wx.hideLoading();
      _this.setData({
        isInit: true
      })
    }).catch(() => {
      console.log(resluts);
      wx.hideLoading();
      _this.setData({
        isInit: true
      })
    })
  },
  /**
 * 创建支付订单
 */
  addOrderPay(status) {
    let _this = this
    if(this.data.bill_type==1){
      setAddOrderPay(_this.data.shareList).then((resluts) => {
        if(resluts.code != 200) return wx.showToast({title: resluts.msg,icon: 'error',duration: 2000})         
        this.setData({
          payVal: resluts.data
        })
        this.payUp(status)
      }).catch(() => {})
      return 
    }
    addOrderPay(_this.data.shareList).then((resluts) => {
      if (resluts.code == 200) {
        _this.setData({
          payVal: resluts.data
        })
        _this.payUp(status)
        console.log(resluts.data)
      } else {
        wx.showToast({
          title: resluts.msg,
          icon: 'error',
          duration: 2000
        })
      }


    }).catch(() => {
    })
  },
  /**
* 模拟支付成功回调
*/
orderPaySuccess(e) {
  let _this = this
  wx.showLoading({title: '支付中...',icon: 'loading',mask: true});
  console.log(e)
  let status = e.currentTarget.dataset.status
  console.log(_this.data.payVal.pay_no);
  let data = {
    pay_no: _this.data.payVal.pay_no,
    amount:_this.data.payVal.price
  }
  
  if(this.data.bill_type==1){
    getOrderPaySuccess(data).then((resluts) => {
      wx.hideLoading()
      if(resluts.code != 200) return wx.showToast({  title: resluts.msg,icon: 'error',duration: 2000 })
        const payInfo = resluts.data
        wx.requestPayment({
          'timeStamp': payInfo.timeStamp,//时间戳
          'nonceStr': payInfo.nonceStr,//随机字符串
          'package': payInfo.package,//统一下单接口返回的 prepay_id 参数
          'signType': payInfo.signType,//签名算法
          'paySign': payInfo.paySign,//签名
          'success':  (res)=> {
            this.payUp('success')
          },
          'fail':  (res) =>{
            wx.showModal({
              title: "提示",
              content: "支付失败",
              showCancel: false,
              success:  () =>{ 
                this.setData({
                  show1: false,
                  show:false
                });
              }
            })
          }
        })
    }).catch(() => {wx.hideLoading()})
    return 
  }
  orderPaySuccess(data).then((resluts) => {
    if (resluts.code == 200) {
      let payInfo = resluts.data
      wx.requestPayment({
        'timeStamp': payInfo.timeStamp,//时间戳
        'nonceStr': payInfo.nonceStr,//随机字符串
        'package': payInfo.package,//统一下单接口返回的 prepay_id 参数
        'signType': payInfo.signType,//签名算法
        'paySign': payInfo.paySign,//签名
        'success': function (res) {
          _this.payUp('success')
        },
        'fail': function (res) {
         
          wx.showModal({
            title: "提示",
            content: "支付失败",
            showCancel: false,
            success: function () { 
              _this.setData({
                show1: false,
                show:false
              });
            }
          })
        }
      })
 
    } else {
      wx.showToast({
        title: resluts.msg,
        icon: 'error',
        duration: 2000
      })
    }

    wx.hideLoading()
  }).catch(() => {
    wx.hideLoading()
  })
},
  //支付确认弹款
  payUp(e) {
    let _this = this;
    console.log('我被点击了', e);
    if (e == 'gopay') {
      _this.setData({ show: true });
    } else {
      _this.setData({
        show: false,
        show1: true
      });

    }
  },
/**
 * 加工商账单
 * @param {*} is_pay 
 */
  supplierBill: function (is_pay) {
    let _this = this
    wx.showLoading({title: '加载中',icon: 'loading',mask: true});
    const params = {is_pay: is_pay}
    supplierBill(params).then((resluts) => {
      console.log(resluts.data);
      if (resluts.code == 200) {
        let newArr = this.data.supplierList
        newArr.push(...resluts.data)
        _this.setData({
          supplierList: newArr
        })
      } else {
      }
      wx.hideLoading();
      _this.setData({
        isShow: true
      })
    }).catch(() => {
      wx.hideLoading();
      _this.setData({
        isShow: true
      })
    })
    wx.showLoading({title: '加载中',icon: 'loading',mask: true});
    getSupplierBill(params).then(res=>{
      wx.hideLoading();
      if(res.code != 200) return 
      if( !res.data || res.data.length == 0) return 
      let newArr = this.data.supplierList
      newArr.unshift(...res.data)
      this.setData({
        supplierList:newArr
      })
    }).catch(() => {
      wx.hideLoading();
    })
  }

})
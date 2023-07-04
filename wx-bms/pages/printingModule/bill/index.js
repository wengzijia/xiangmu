// pages/bill/index.js
import { customerBill,getCustomerBill, supplierBill,getSupplierBill, addOrderPay, orderPaySuccess } from '../../../api/bill';
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
    currentTab: 0,
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
    allList:{
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
      {
        "years_month": "2022-04", //账单年月
        "supplier_id": 3, //加工商id
        "supplier_name": "展鹏印刷", //加工商名称
        "total_price": 111, //总金额
        "unpaid_price": 111, //待支付
        "paid_price": 0 //已支付
      }
    ],//加工商列表
    shareList: {
      supplier_id: '',
      years_month: '',
      order_id: '',
      is_share: 0,
      share_id: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('111111',options)
    if (typeof (options.isProcessor) != 'undefined') {
      this.setData({
        isProcessor: options.isProcessor,
      })
      //判断是加工商时的页面
      if (this.data.isProcessor == 1 && this.data.isProcessor == '1') {
        this.setData({
          currentTab: 0,
          marginrl: 0,
          isbg: 'block',
          tabTop: 130,
          contMart:250
        })
      }

      // this.setData({
      //   currentTab:options.isProcessor
      // })
    }
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    _this.customerBill()
    // _this.supplierBill(_this.data.is_pay)
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
    let _this = this;
    console.log(e);
    if (this.data.is_pay == e.currentTarget.dataset.idx) {
      return;
    }
    _this.setData({
      is_pay: e.currentTarget.dataset.idx,
      supplierList: []
    })
    _this.setData({
      isShow: false
    })
    _this.supplierBill(_this.data.is_pay)
  },
 
  //关闭成功的弹框
  onClose(e) {
    let _this = this
    let status = e.currentTarget.dataset.status
    if (status == 'bottom') {
      this.setData({ show: false });
    } else {
      this.setData({
        show1: false,
        ['monthDetail.data']: [],
      });
      _this.supplierBill(_this.data.is_pay)
    }
  },
//掉起支付确认
  bindPay(e) {
    let _this = this
    let pay = e.currentTarget.dataset.pay
    let status = e.currentTarget.dataset.status
    _this.setData({
      ['shareList.supplier_id']: pay.supplier_id,
      ['shareList.years_month']: pay.years_month,
    })
    _this.addOrderPay(status)
  },
  /**
   * 获取客户账单列表
   */
  customerBill: function () {
    getCustomerBill().then((resluts) => {
      console.log(resluts.data);
      wx.hideLoading();
      if(resluts.code != 200) return 
      this.setData({
        allList: resluts.data
      })
      this.setData({
        isInit: true
      })
    }).catch(() => {
      wx.hideLoading();
      this.setData({
        isInit: true
      })
    })
  },
  /**
 * 创建支付订单
 */
  addOrderPay(e) {
    let _this = this
    addOrderPay(_this.data.shareList).then((resluts) => {
      if (resluts.code == 200) {
        _this.setData({
          payVal: resluts.data
        })
        _this.payUp(e)
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
  wx.showLoading({
    title: '支付中...',
    icon: 'loading',
    mask: true
});
  let status = e.currentTarget.dataset.status
  console.log(_this.data.payVal.pay_no);
  let data = {
    pay_no: _this.data.payVal.pay_no,
    amount:_this.data.payVal.price
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
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    });
    let data = {
      is_pay: is_pay
    }
    getSupplierBill(data).then((resluts) => {
      console.log(resluts.data);
      if (resluts.code == 200) {
        _this.setData({
          supplierList: resluts.data
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
  }

})
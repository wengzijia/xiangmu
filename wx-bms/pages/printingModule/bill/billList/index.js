import { customerBillMonth,getCustomerBillMonth } from '../../../../api/bill'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    customer: '',
    billNeedVal: {},
    BillMonthList: {
      "total_price": 333, //总金额
      "unpaid_price": 333, //待支付
      "data": [
        {
          "years_month": "2022-04", //账单年月
          "supplier_id": 1, //供应商id
          "unpaid_price": 111, //待支付
          "paid_price": 0 //已支付
        },
        {
          "years_month": "2022-03", //账单年月
          "supplier_id": 1, //供应商id
          "unpaid_price": 222, //待支付
          "paid_price": 0 //已支付
        }
      ]
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    if (options.customer) {
      _this.setData({
        customer: JSON.parse(options.customer)
      })
    
    }
  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this=this
    _this.customerBillMonth(_this.data.customer)
  },

  /**
   * 跳转到账单详情
   */
  myNavigateTo(e) {
    let _this = this
    let detail = e.currentTarget.dataset.detail
    _this.setData({
      ['customer.years_month']: detail.years_month
    })
    wx.navigateTo({ url: '../billDetail/index?customer=' + JSON.stringify(_this.data.customer) })
  },
  /**
   * 获取客户月份列表
   */
  customerBillMonth(customer) {
    console.log(customer);
    wx.showLoading({
      title:'加载中...',
      mask:true
    });
    let _this = this
    let data = {
      customer_id: customer.id
    }
    getCustomerBillMonth(data).then((resluts) => {
      console.log(resluts.data);
      if (resluts.code == 200) {
        _this.setData({
          BillMonthList: resluts.data
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
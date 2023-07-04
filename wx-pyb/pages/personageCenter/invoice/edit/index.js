import { _saveOrUpdate } from "../../../../api/orderApi"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    invoiceVo: {
      invoiceName: '', //发票抬头
      invoiceCode: '', // 公司税号
      invoiceAddress: '', // 注册地址
      invoiceMobile: '', // 电话
      invoiceBank: '', // 开户银行
      invoiceBankcode: '', // 银行账户
    },
    error: {
      invoiceName: false, //发票抬头
      invoiceCode: false, // 公司税号
      invoiceAddress: false, // 注册地址
      invoiceMobile: false, // 电话
      invoiceBank: false, // 开户银行
      invoiceBankcode: false, // 银行账户
    },
    disabled: true,
    from: 'add',
    edit: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.from = options.from
    if(options.from == 'edit') {
      this.data.edit = JSON.parse(options.data)
      this.setData({
        invoiceVo:  this.data.edit.invoiceVo,
        disabled: false,
        checked: this.data.edit.defaultTemp ? true : false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  onChange() {
    this.setData({
      checked: !this.data.checked
    })
  },
  // 输入验证
  inputVal(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    if (key == 'invoiceCode') {
      value = value.toUpperCase()
      // let len = value.length
      // if (len == 15 || len == 18 || len == 20) {
      //   this.setData({
      //   ['error.invoiceCode']: true
      //   })
      //   return
      // }
    }
    this.setData({
      ['error.' + key]: this.validation(key, value),
      ['invoiceVo.' + key]: value
    })
    this.disabled()
  },
  // 校验
  validation(key, value) {
    let reg = null
    if (key == 'invoiceName') {
      reg = /^[\u4e00-\u9fa5]{1,}$/ 
    } else if (key == 'invoiceCode') {
      reg = /^([A-Za-z0-9]{15}|[A-Za-z0-9]{18}|[A-Za-z0-9]{20})$/
    } 
    // else if (key == 'invoiceMobile') {
    //   reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
    // } else if (key == 'invoiceBankcode') {
    //   reg = /^\d{14,18}$/
    // }
    if (reg) {
      return !reg.test(value)
    }
    if(key && !value) {
      return true
    } else {
      return false
    }
  },
  disabled() {
    let error = this.data.error
    let msg = false
    for (const key in error) {
      const el = this.validation(key, this.data.invoiceVo[key]);
      if (el) {
        msg = true
      }
    }
    this.setData({
      disabled: msg
    })
  },
  // 保存
  save() {
    if (this.data.disabled) {
      return
    }
    
    let obj = {
      data: {
        ...this.data.edit,
        invoiceType: 0,
        invoiceVo: this.data.invoiceVo,
        defaultTemp: this.data.checked ? 1 : 0
      }
    }
    wx.showLoading({
      title: '加载中...',
    })
    _saveOrUpdate(obj).then(res => {
      if (res.success) {
          wx.navigateBack({
            delta: 1
          })
      } else {
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        })
      }
    }).finally(() => {
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
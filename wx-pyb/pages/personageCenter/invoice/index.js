import { getByUid, _deleteById, updateDefault, getAllSupplierInvoiceOrder,getInvoiceInstructions } from "../../../api/orderApi"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showExplanation: false, // 开票说明是否展示
    list: [],
    active: 0,
    pageNumber: 1,
    pageSize: 10,
    from: '',
    explanationText: '',
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.from) {
      this.data.from = options.from
    }
  },
  getList(e) {
    let data = {
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize
    }
    let func = null
    if (this.data.active == 0) {
      func = getByUid;
      data = {
        pageNumber: this.data.pageNumber,
        pageSize: this.data.pageSize
      }
    }
    // else if (this.data.active == 1 || this.data.active == 2) {
    //   data = {
    //     createTime: (new Date(this.data.createTime)).toISOString(),
    //     endTime: (new Date(this.data.endTime)).toISOString(),
    //     xcxInvoiceType: this.data.type,
    //     invoiceStatus: this.data.active,
    //     pageNumber: this.data.pageNumber,
    //     pageSize: this.data.pageSize
    //   }
    //   func = getAllSupplierInvoiceOrder;
    // }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    func(data).then(res => {
      if(res.data && res.data.length) {
        if (this.data.active == 0) {
          this.setData({
            list: this.data.list.concat(res.data)
          })
        }
      }else {
        this.data.pageNumber--
      }
    }).finally(() => {
      wx.hideLoading()
    })
  },
  onChange(event) {
    this.setData({
      active: event.detail.index,
      list: [],
      pageNumber: 1
    })
    if (this.data.active == 0) {
      this.getList()
    } else {
      this.setData({
        
      })
    }
  },
  add() {
    wx.navigateTo({
      url: './edit/index?from=add'
    })
  },
  edit(e) {
    let item = e.currentTarget.dataset.item
    
    wx.navigateTo({
      url: './edit/index?from=edit&data=' + JSON.stringify(item)
    })
  },
  update(e) {
    if (this.data.from != 'detail') {
      return
    }
    let id = e.currentTarget.dataset.id
    updateDefault({data:{id: id}}).finally(() =>{
      wx.navigateBack({
        delta: 1
      })
    })
  },
  showDelete() {
    
  },
  _delete(e) {
    let id = e.currentTarget.dataset.id
    let defaultTemp = e.currentTarget.dataset.defaulttemp
    console.log(e);
    if (defaultTemp) {
      wx.showToast({
        title: '常用抬头，不可删除',
        icon: 'none'
      })
      return
    }
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除发票抬头吗',
      success (res) {
        if (res.confirm) {
          _deleteById({id: id}).then(res => {
            if (res.success) {
              wx.showToast({
                title: '删除成功'
              })
              that.data.pageNumber = 1
              that.data.list = []
              that.getList()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.showToast({
            title: '取消成功',
            icon: 'none'
          })
        }
      }
    })
  },
  explanation() {
    getInvoiceInstructions().then(res => {
      this.setData({
        showExplanation: true,
        explanationText: res.data
      })
    })
  },
  onClose(){
    this.setData({
      showExplanation: false
    })
  },
  loading() {
    console.log('下拉', this.data.pageNumber);
    this.data.pageNumber+=1
    this.getList()
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
    this.data.list = []
    this.data.pageNumber = 1
    this.data.active == 0 && this.getList()
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
// pages/placeOrder/index.js
// import info from '../../utils/processInfo'
import {machiningCategoryAttribute} from "../../api/placeOrder"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    processList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '获取数据中...',
    })
    this.getMachiningCategoryAttribute()
  },
    /**
     * 
     */
  toEditPage(e){
    console.log(e);
    wx.navigateTo({
      url:'./edit/index?type=add&id='+e.currentTarget.dataset.id+"&attrType="+e.currentTarget.dataset.type
    })
  },
  /**
   * 获取加工工序
   */
  getMachiningCategoryAttribute(){
    let _this = this;
    machiningCategoryAttribute({}).then(res=>{
      console.log('res',res)
      _this.setData({
        processList:res.data
      })
      wx.hideLoading()
    }).catch(()=>{
      wx.hideLoading()
    })
  }

});

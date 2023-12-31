// pages/tool/cutter/index.js
import {WEB_VIEW_BASE_URL} from '../../../utils/request'

Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        webUrl:''
    },
    bindGetMsg(e){
        console.log('接受数据',e)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log('options',options)
        const token = wx.getStorageSync('token');
        if(options.id){
          this.setData({
            webUrl:WEB_VIEW_BASE_URL+'/wxwt/h5/packPlan?token='+token+'&id='+options.id+'&userid='+wx.getStorageSync('selectCardId')
          })
        }
       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
// pages/tool/cutter/index.js
import {IMG_BASE_URL,TOOL_WEB_VIEW} from '../../../utils/request'
var token = wx.getStorageSync('token');
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        imgBaseUrl:IMG_BASE_URL,
        webUrl:''
    },
    bindGetMsg(e){
        console.log('接受数据',e)
    },
    /**
     * 生命周期函数--监听页面加载
     */
     onLoad: function (options) {
        const token = wx.getStorageSync('token');
        let ipInfo = wx.getStorageSync("ipInfo");
        this.setData({
            webUrl:TOOL_WEB_VIEW+'/wxpyb/h5/cutter/three?token='+token+'&ip='+ipInfo?.ip
        })
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
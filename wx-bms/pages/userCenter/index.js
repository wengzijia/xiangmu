// pages/userCenter/index.js
import { getWxUserInfo } from "../../api/login";

//获取应用实例
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLogin: false,//用户是否登录
        isProcessor: 0,//是否加工商
        userInfo: {
            wx_portrait: null,
            wx_portrait: null
        },//用户信息，头像，昵称
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        // console.log("token", wx.getStorageSync('token'));
        const token = wx.getStorageSync('token');
        this.setData({
            isLogin: token,
        });
        if (token) {
            this.getWxUserInfoFn();
        }else{
           this.myNavigateTo()
        }
    },
    myNavigateTo: function (e) {
        // console.log('isLogin',app.globalData.isLogin);
        const token = wx.getStorageSync('token');
        if (!token) {
            wx.showModal({
                title: '提示',
                // cancelText: '否', 
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#ff0036',
                content: '您未授权登录，无法访问该页面，请前往授权登录',
                success(res) {
                    if (res.confirm) {
                        wx.showLoading({
                            title: '跳转中', mask: true
                        })
                        let url = '../login/index'
                        wx.navigateTo({
                            url: url,
                            complete: () => {
                                wx.hideLoading()
                            }
                        })
                    }
                }
            })
            return;
        }
        else {
            // 判断是否是分享页进入
            if (e.currentTarget.dataset.type) {
                wx.navigateTo({ url: e.currentTarget.dataset.url + '?type=' + e.currentTarget.dataset.type + '&orderType=' + e.currentTarget.dataset.order })
            } else {
                wx.navigateTo({ url: e.currentTarget.dataset.url })
            }
        }
    },
    // 获取头像和昵称
    getHeader() {
        let text;
        if (!this.data.userInfo.wx_portrait || !this.data.userInfo.wx_nickname) {
            text = '您未授权微信头像和昵称，请前往授权'
        }
        wx.showModal({
            title: '提示',
            cancelText: '否',
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#ff0036',
            content: text,
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '跳转中',
                        mask: true
                    })
                    wx.navigateTo({
                        url: '../login/index?isNewUser=1',
                        complete: () => {
                            wx.hideLoading()
                        }
                    })
                }
            }
        });
        return;
    },
    // 获取当前用户信息
    getWxUserInfoFn() {
        getWxUserInfo().then((res) => {
            console.log("res", res.data);
            this.setData({
                userInfo: res.data,
                isProcessor: res.data.is_supplier,
            });
        })
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
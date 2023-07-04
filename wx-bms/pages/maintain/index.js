// pages/maintain/index.js
import {
  pilotInfo,
  uploadImg,
  editPilotInfo
} from "../../api/pilot.js"
import {
  deviceInfo
} from "../../api/device.js"
import {
  imageBaseUrl
} from '../../utils/request'
import { debounce } from  "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headPortrait: "", // 头像
    deviceId: '', // 设备id
    pilotId: '', // 机长id
    deviceInfo: {}, // 设备信息
    pilotInfo: {}, // 机长信息
    pilotName: '', // 机长名
    password: '', // 打卡密码
    imageBaseUrl:imageBaseUrl  // 图片域名
  },
  // 编辑图片
 editImg() {
    let _this = this;
    const token = wx.getStorageSync('token');
    wx.chooseMedia({
      count: 1,
      success(res) {
        let { tempFilePath } = res.tempFiles[0];
        console.log(tempFilePath);
        wx.uploadFile({
          filePath: tempFilePath,
          name: 'file',
          url: uploadImg,
          header:{token},
         success(res){
            let file = JSON.parse(res.data).data
            _this.setData({
              headPortrait:file
            })
          },
          fail(err){
            console.log(err);
          }
        })
      }
    })
  },
  // 获取设备信息
  async getDeviceInfo() {
    let _this = this;
    try {
      wx.showLoading({
        title: '获取中...'
      })
      let {
        code,
        data
      } = await deviceInfo(_this.data.deviceId);
      if (code === 200) {
        _this.setData({
          deviceInfo: data[0]
        })
      }
      console.log(data);
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },
  // 获取机长信息
  async getPilotInfo() {
    let _this = this;
    try {
      wx.showLoading({
        title: '获取中...',
      })
      let {
        code,
        data
      } = await pilotInfo(_this.data.pilotId);
      console.log('机长信息', data);
      if (code === 200) {
        _this.setData({
          pilotInfo: data,
          pilotName: data.operator_name,
          headPortrait:data.operator_url,
          password:data.operator_password
        })
      }
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },
  // 获取机长名
  getPilotName(e) {
    let _this = this;
    let {
      value
    } = e.detail
    _this.setData({
      pilotName: value.replace(/\s+/g, "").slice(0, 20) // 去除空格并截取20位
    })
    if (value.length > 20) {
      wx.showToast({
        title: '不能大于二十字',
        icon: "none"
      })
    }
  },
  // 获取密码
  getPassword(e) {
    let _this = this;
    let {
      value
    } = e.detail
    _this.setData({
      password: value
    })
  },
  // 确定(防抖)
  affirm:debounce(async function() {
    let _this = this;
    // 机长名或打卡密码为空,进行提示
    if (!_this.data.pilotName) {
      wx.showToast({
        title: '请输入机长名',
        icon: "none"
      })
      return
    } else if (!_this.data.password) {
      wx.showToast({
        title: '请设置打卡密码',
        icon: "none"
      })
      return
    }
    try {
      let param = {
        device_id: _this.data.deviceId,
        operator_name: _this.data.pilotName,
        operator_password: _this.data.password,
        operator_url: _this.data.headPortrait,
        operator_id: _this.data.pilotId
      }
      wx.showLoading({
        title: "保存中..."
      })
      let { code,data,msg } = await editPilotInfo(param);
      if(code===200){
      wx.showToast({
        title: data
      })
      setTimeout(function(){
        wx.hideLoading()
        wx.navigateBack({})
      },2000)
      }else{
        wx.showToast({
          title: "机长名重复,请修改",
          icon:'none'
        })
      }
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },500),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e);
    let _this = this;
    let {
      deviceId,
      pilotId
    } = e;
    _this.setData({
      deviceId,
      pilotId
    })
    // 获取机长信息
    this.getPilotInfo()
    // 获取设备信息
    this.getDeviceInfo()
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
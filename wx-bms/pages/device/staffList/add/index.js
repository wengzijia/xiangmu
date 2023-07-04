// pages/addPilot/index.js
import { deviceInfo } from "../../../../api/device.js"
import { addPilot } from "../../../../api/pilot.js"
import { uploadImg } from "../../../../api/pilot.js"
import {
  imageBaseUrl
} from '../../../../utils/request'
import { debounce } from "../../../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headPortrait:"", // 头像
    deviceName:'', // 设备名字
    deviceId:"", // 设备id
    pilotName:'', // 机长名
    password:'', // 密码
    imageBaseUrl:imageBaseUrl  // 图片域名
  },
  // 上传
  upload() {
    let _this = this;
    const token = wx.getStorageSync('token');
    wx.chooseMedia({
      count: 1,
      success(res) {
        let { tempFilePath } = res.tempFiles[0];
        console.log(tempFilePath);
        wx.uploadFile({
          filePath: tempFilePath, // 图片路径
          name: 'file',   // 传入后台的参数名
          url: uploadImg,  // 上传图片接口
          header:{token},  // 凭证
         success(res){
            let file = JSON.parse(res.data).data
            console.log(file);
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
  // 获取机长名
  getPilotName(e){
    let {
      value
    } = e.detail;
    let _this = this;
    _this.setData({
      pilotName: value.replace(/\s+/g, "").slice(0, 20) // 去除空格并截取10位
    })
    if (value.length > 20) {
      wx.showToast({
        title: '不能大于二十字',
        icon: "none"
      })
    }
  },
  // 获取密码
  getPassword(e){
    let {
      value
    } = e.detail;
    let _this = this;
    let reg = /([\u4e00-\u9fa5]{1,})/gi
    if(reg.test(value)) {
      wx.showToast({
        title: '无法使用中文作为密码',
        icon: "error"
      })
      _this.setData({
        password:_this.data.password
      })
    }else{
      _this.setData({
        password:value
      })
    }
    
    console.log(value);
  },
  // 确定(防抖)
  affirm:debounce(async function(){
      let _this = this;
      let reg = /([\u4e00-\u9fa5]{1,})/gi
      if(!_this.data.pilotName){
        wx.showToast({
          title: '请输入机长名',
          icon:'none'
        })
        return
      }else if(!_this.data.password){
        wx.showToast({
          title: '请设置打卡密码',
          icon:'none'
        })
        return
      }else if(reg.test(_this.data.password)){
        wx.showToast({
          title: '无法使用中文作为密码',
          icon: "error"
        })
        return
      }
      try{
      let param = {
        device_id:_this.data.deviceId,
        operator_name:_this.data.pilotName,
        operator_password:_this.data.password,
        operator_url:_this.data.headPortrait
      }
      wx.showLoading({
        title:"添加中..."
      })
      let {code,data,msg} = await addPilot(param);
      if(code === 200){
        wx.showToast({
          title: msg
        })
        setTimeout(function(){
          wx.navigateBack({})
        },1000)
      }else{
        wx.showToast({
          title: "机长名重复,请修改",
          icon:'none'
        })
      }
    }catch(err){
      console.log(err.message);
    }
  },500),
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
  //   let { deviceId } = e;
  //   let _this = this;
  //   _this.setData({
  //     deviceId
  //   })
  //   try{
  //     wx.showLoading({
  //       title:'获取中...'
  //     })
  //   let { code,data} = await deviceInfo(deviceId);
  //   if(code===200){
  //       _this.setData({
  //         deviceName:data[0]
  //       })
  //   }
  //   wx.hideLoading()
  // }catch(err){
  //   wx.hideLoading()
  //   console.log(err.message);
  // }
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
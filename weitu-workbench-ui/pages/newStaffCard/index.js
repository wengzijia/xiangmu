// pages/newStaffCard/index.js
import {
  addEmployee,
  getEmployeeInfo,
  updateEmployee
} from "../../api/nameCardSet"
import {
  imageBaseUrl,
  uploadFile
} from "../../utils/request.js";
import {
  debounce
} from "../../utils/util.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl,
    enterpriseCode: '',
    headImgs: '',
    id: '',
    AdminInfo: []
  },
  uploadFile,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if (options) {
      _this.setData({
        enterpriseCode: options.enterpriseCode,
        id: options.id
      })
      _this.EmployeeInfo(_this.data.id)
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
  EmployeeInfo(id) {
    let _this = this;
    getEmployeeInfo({ userId: id }).then((res) => {
      if (res.code == "000000") {
        _this.setData({
          AdminInfo: res.data,
          headImgs: imageBaseUrl+res.data.avatar,
          fullname: res.data.fullname,
          mobile: res.data.mobile,
          position: res.data.position,
          wechatCode: res.data.wechatCode,
          enterpriseCode: res.data.enterpriseCode
        })
      }
    }).catch(err => {
    })
  },
  getAddEmployee(params) {
    console.log('params', params);
    addEmployee({ ...params }).then((res) => {
      wx.hideLoading()
      if (res.code == "000000") {
        wx.showToast({
          title: '名片保存成功',
          duration: 1500,
          success: function () {
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/nameCardSet/index?topIndex=1',
              })
            }, 1500)
          }
        })
      }else{
      wx.showToast({
        title: res.message,
        icon:'none',
        duration: 1500,
      })
      }
      console.log(res);
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '数据保存错误，请联系管理员',
        duration: 1500,
      })
    })
  },
  getUpdateEmployee(params) {
    updateEmployee({ ...params }).then((res) => {
      wx.hideLoading()
      if (res.code == "000000") {
        wx.showToast({
          title: '名片修改成功',
          duration: 1500,
          success: function () {
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/nameCardSet/index?topIndex=1',
              })
            }, 1500)
          }
        })
      }else{
        wx.showToast({
          icon:'none',
          title: res.message,
          duration: 1500,
        })
      }
      console.log(res);
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '数据保存错误，请联系管理员',
        duration: 1500,
      })
    })
  },
  inputChange(e) {
    let _this = this;
    let key = e.currentTarget.dataset.key
    if (key == 'fullname') {
      _this.setData({
        [key]: e.detail.value.replace(/\s+/g, '').slice(0, 4) // 去掉空格并截取4个字
      })
    } else if (key == 'position') {
      _this.setData({
        [key]: e.detail.value.replace(/\s+/g, '').slice(0, 8) // 去掉空格并截取8个字
      })
    } else {
      _this.setData({
        [key]: e.detail.value.replace(/\s+/g, '')
      })
    }
  },
  headImgs:debounce(function(e) {
    let _this = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        console.log(res);
        let file = res.tempFiles[0]
        if(file.fileType!="image"){
          wx.showToast({
            title: '请上传图片文件！',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (file.size > 1024 * 1024 * 30) {
            wx.showToast({
              title: '文件超出最大限制！',
              icon: 'none',
              duration: 2000
            })
            return
          }
        _this.setData({
          headImgs: file.tempFilePath
        })
      }
    })
  },100),
 async submitNote() {
    let _this = this
    let params = {
      "avatar": _this.data.headImgs,
      "enterpriseCode": _this.data.enterpriseCode,
      "fullname": _this.data.fullname,
      "mobile": _this.data.mobile,
      "position": _this.data.position,
      "roleId": 2,
      "wechatCode": _this.data.wechatCode
    }
    console.log(params);
    if (!params.fullname) {
      wx.showToast({
        icon: 'none',
        title: '请输入姓名'
      })
    } else if (!params.position) {
      wx.showToast({
        icon: 'none',
        title: '请输入职位'
      })
    } else if (!params.wechatCode) {
      wx.showToast({
        icon: 'none',
        title: '请输入微信账号'
      })
    } else if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(params.mobile)) {
      wx.showToast({
        icon: 'none',
        title: '电话号码格式错误'
      })
    } else if (!params.avatar) {
      wx.showToast({
        icon: 'none',
        title: '请上传头像'
      })
    } else {
      if (params.avatar != _this.data.AdminInfo.avatar) {
        if (_this.data.AdminInfo.avatar&&params.avatar.indexOf(_this.data.AdminInfo.avatar) != -1) {
          params.avatar = _this.data.AdminInfo.avatar
        } else {
          params.avatar = await _this.uploadFile({
            userId: _this.data.enterpriseCode,
            filePath: params.avatar
          })
        }
      }
      wx.showLoading({
        title: '数据保存中...',
      })
      if (_this.data.id) {
        params.userId = _this.data.id
        _this.getUpdateEmployee(params)
      } else {
        _this.getAddEmployee(params)
      }
    }
  },
})
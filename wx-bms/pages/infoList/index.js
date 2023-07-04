// pages/infoList/index.js
import {
  getManufacturingProcedure
} from "../../api/processOrder.js"
import {
  addDevice,
  editDevice,
  deviceInfo
} from "../../api/device.js"
import {
  pilotList,
  getSupplierDeviceProductionStatus
} from "../../api/pilot.js"
import {
  imageBaseUrl
} from '../../utils/request'
import { debounce } from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0, // tab切换下标
    showProcess: false, // 是否显示工序
    status: [{
        index: 1,
        text: '开机'
      },
      {
        index: 0,
        text: '停机'
      },
    ],
    statusIndex: 1, // 状态下标
    statusIndex2:null,// 编辑时，数据库的状态下标
    isShowProcess: false, // 是否显示工序
    isShowHint: false, // 是否显示提示
    deviceName: "", // 设备名
    deviceModel: '', // 设备型号
    processname: '', // 默认工序
    process: [], // 所有工序
    processId: '', // 工序id
    deviceId: '', // 设备id
    pilotList: [], //  机长列表
    imageBaseUrl: imageBaseUrl, // 图片域名
    isShowBtn:false,//是否显示确认按钮
  },
  // 修改tab切换下标
  changeType: function (e) {
    console.log('sxs', this.data.deviceId);
    let _this = this;
    let {
      index
    } = e.currentTarget.dataset;
    // 阻止重复点击发多次请求
    if (_this.data.tabIndex == index) {
      return
    }
    // 修改下标
    if (_this.data.type === index || index === undefined) {
      return false;
    } else {
      _this.setData({
        tabIndex: index
      })
    }
    if (index == 1 && !_this.data.deviceName) {
      _this.setData({
        tabIndex: 0,
        isShowHint: true
      })
      setTimeout(function () {
        _this.setData({
          isShowHint: false
        })
      }, 3000)
      return
    }
    if (!_this.data.deviceId) {
      wx.showToast({
        title: '请确认设备信息',
        icon: 'none',
        mask: true
      })
      _this.setData({
        tabIndex: 0
      })
      return
    }
    if (index == 1 && _this.data.deviceId) {
      // 获取机长列表
      _this.getPilotList()
    }
  },
  // 获取设备名称
  getDeviceName(e) {
    let {
      value
    } = e.detail;
    this.setData({
      deviceName: value.replace(/\s+/g, "").slice(0, 20) // 去除空格并截取20位
    })
    if (value.length > 20) {
      wx.showToast({
        title: '不能大于二十字',
        icon: "none"
      })
    }
  },
  // 获取设备型号
  getDeviceModel(e) {
    let {
      value
    } = e.detail;
    this.setData({
      deviceModel: value.replace(/\s+/g, "").slice(0, 20) // 去除空格并截取20位
    })
    if (value.length > 20) {
      wx.showToast({
        title: '不能大于二十字',
        icon: "none"
      })
    }
  },
  // 获取所有工序
  async getAllProcess() {
    let _this = this;
    try {
      wx.showLoading({
        title: '获取中...'
      })
      let {
        data
      } = await getManufacturingProcedure();
      _this.setData({
        processname: data[0].machining_name,
        process: data,
        processId: data[0].machining_id
      })
      console.log('adg',_this.data.processname);
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },
  // 显示工序
  showProcess() {
    let _this = this;
    if(this.data.statusIndex2==1) return
    _this.setData({
      isShowProcess: true
    })
  },
  // 切换工序
  toggleProcess(e) {
    let {
      processname,
      processid
    } = e.currentTarget.dataset;
    let _this = this;
    _this.setData({
      isShowProcess: false,
      processname,
      processId: processid
    })
  },
  // 关闭工序
  closeProcess() {
    let _this = this;
    _this.setData({
      isShowProcess: false
    })
  },
  // 跳转到机长维修页
  skip(e) {
    let {
      pilotid
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/maintain/index?deviceId=${this.data.deviceId}&pilotId=${pilotid}`,
    })
  },
  // 跳转到添加机长页
  jump() {
    wx.navigateTo({
      url: `/pages/addPilot/index?deviceId=${this.data.deviceId}`,
    })
  },
  // 切换开关状态
  toggleState(e) {
    let {
      index
    } = e.currentTarget.dataset
    console.log(index);
    this.setData({
      statusIndex: index,
      
    })
    if(!this.data.isShowBtn){
      this.setData({
        isShowBtn: true
      })
    }
  },
  /** 查询机台状态 */
  async queryDevice(deviceParam){
    let _this = this;
    try {
      wx.showLoading({
        title: '查询数据中...',
      })
      let deviceRes = await getSupplierDeviceProductionStatus({'device_id':_this.data.deviceId})
      console.log('deviceRes',deviceRes.code=="3001")
      if(deviceRes.code=="3001"){ 
        wx.showModal({
          title: '提示',
          content: deviceRes.msg,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              _this.editDeviceFun(deviceParam)
            } else if (res.cancel) {
              wx.hideToast()
              wx.showToast({
                title: '取消编辑',
              })
              console.log('用户点击取消')
            }
          }
        })
      }else if(deviceRes.code!=200){
        wx.hideToast()
        wx.showToast({
          title: deviceRes.msg,
        })
      }else{
        _this.editDeviceFun(deviceParam)
      }
    } catch (error) {
      console.log('queryDevice',error)
    } 
   
  },
  /** 编辑机台信息 */
  async editDeviceFun(deviceParam){
    let _this = this;
    deviceParam.device_id = _this.data.deviceId;
        wx.showLoading({
          title: '保存中...',
        })
        let {
          code,
          data,
          msg
        } = await editDevice(deviceParam);
        if (code === 200) {
          wx.showToast({
            title: data,
            mask:true,
            complete() {
              setTimeout(() => {
                _this.setData({
                  tabIndex: 1
                })
                wx.showLoading({
                  title: "获取中..."
                })
              }, 1000)
            }
          })

          let result = await pilotList(_this.data.deviceId);
          if (result.code === 200) {
            _this.setData({
              pilotList: result.data,
              statusIndex2: _this.data.statusIndex
            })
          }
          console.log('sd', result);
          setTimeout(()=>{
            wx.hideLoading()
          },1000)
        } else {
          wx.showToast({
            title: msg,
            icon: "none"
          })
        }
  },
  // 确认(防抖)
   affirm:debounce(async function(){
    let _this = this;
    // 设备名称为空的时候提示
    if (!_this.data.deviceName) {
      _this.setData({
        isShowHint: true
      })
      setTimeout(function () {
        _this.setData({
          isShowHint: false
        })
      }, 3000)
      return
    }
    try {
      let deviceParam = {
        device_name: _this.data.deviceName,
        device_model: _this.data.deviceModel,
        attribute_id: _this.data.processId,
        status: _this.data.statusIndex
      }
      console.log('s', _this.data.deviceId);
      console.log('de', deviceParam);
      // 设备id为真请求编辑接口
      if (_this.data.deviceId) {
        if(_this.data.statusIndex2==1&&_this.data.statusIndex==0){
          _this.queryDevice(deviceParam)
        }else{
          _this.editDeviceFun(deviceParam)
        }
        
      } else {
        wx.showLoading({
          title: '保存中...',
        })
        let {
          code,
          data,
          msg
        } = await addDevice(deviceParam);
        if (code === 200) {
          wx.showToast({
            title: msg
          })
          _this.setData({
            deviceId: data.device_id,
            tabIndex: 1
          })
        } else {
          wx.showToast({
            title: msg,
            icon: "none"
          })
        }
      }
      setTimeout(function(){
        wx.hideLoading()
      },2000)
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },1000),
  // 获取机长列表
  async getPilotList() {
    let _this = this;
    try {
      wx.showLoading({
        title: '获取中...',
      })
      let {
        code,
        data
      } = await pilotList(_this.data.deviceId);
      if (code === 200) {
        _this.setData({
          pilotList: data
        })
      }
      console.log('ss', this.data.pilotList);
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
    let _this = this;
    let {
      deviceId
    } = e;
    _this.setData({
      deviceId
    })
    console.log('sx', _this.data.deviceId);
    // 获取所有工序
    await _this.getAllProcess()
    if (deviceId) {
      try {
        wx.showLoading({
          title: '获取中...',
          mask:true
        })
        let {
          code,
          data
        } = await deviceInfo(deviceId);
        if (code === 200) {
          _this.setData({
            deviceName: data[0].device_name,
            deviceModel: data[0].device_model,
            processname: data[0].attribute_name,
            statusIndex: data[0].status,
            processId: data[0].attribute_id,
            isShowBtn: data[0].status==0,
            statusIndex2:data[0].status,
          })
          console.log('ddf',_this.data.processname);
        }
        wx.hideLoading()
      } catch (err) {
        wx.hideLoading()
        console.log(err.message);
      }
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
    let _this = this;
    // 获取机长列表
    if (_this.data.tabIndex && _this.data.deviceId) {
      _this.getPilotList()
    }
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
// pages/nameCardSet/index.js
import {
  getRoles,
  getAdministratorInfo,
  addEmployee,
  addEnterpriseSetting,
  getAllEmployee,
  updateEmployee,
  deleteEmployee
} from "../../api/nameCardSet"

import {
  imageBaseUrl,
  uploadFile,
  staticFileBaseUrl
} from "../../utils/request.js";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticFileBaseUrl,
    imageBaseUrl,
    sellingPointList: [''],
    headImgs: '',
    logo: '',
    videos: '',
    Ishow: true,
    navShow: true,
    userRoles: [],
    topIndex: 0,
    addEmployee: [],
    AdminInfo: [],
    sellingList: [],
    AllEmployeeList: [],
    EditStatus: false,
    userId: '',
    loadingType: 0, //下拉数据的状态
    contentText: {
      contentrefresh: "正在加载...",
      contentnomore: "没有更多数据了"
    },
    pageNumber: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.sendRoles()
    if (options) {
      this.setData({
        topIndex: Number(options.topIndex || 0)
      })
    }
    this.AdministratorInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  //增加
  addList: function () {
    let _this = this;
    if (!_this.data.Ishow) {
      return
    }
    var sellingPointList = this.data.sellingPointList;
    var newData = '';
    if (sellingPointList.length > 7) {
      wx.showToast({
        title: '最多增加8个',
        icon: 'none',
        duration: 2000
      })
      return
    }
    sellingPointList.push(newData); //实质是添加sellingPointList数组内容，使for循环多一次
    this.setData({
      sellingPointList: sellingPointList,
    })
  },
  //下拉加载
  bindDownLoad: function () {
    let _this = this;
    if (_this.data.loadingType == 1) {
      return
    }
    _this.AllEmployee()
  },
  minusList(e) {
    let _this = this;
    if (!_this.data.Ishow) {
      return
    }
    let index = e.currentTarget.dataset.index
    let sellingPointList = this.data.sellingPointList
    if (sellingPointList.length == 1) {
      wx.showToast({
        icon: 'none',
        title: '最少要有一个卖点',
      })
      return
    }
    sellingPointList.splice(index, 1)
    this.setData({
      sellingPointList: sellingPointList
    })

  },
  bindNew() {
    let _this = this;
    wx.navigateTo({
      url: '/pages/newStaffCard/index?enterpriseCode=' + _this.data.AdminInfo.enterpriseCode,
    })
  },
  headImgs(e) {
    let _this = this;

    if (_this.data.Ishow) {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        success(res) {
          let file = res.tempFiles[0]
          if (file.fileType != "image") {
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
    } else {
      if (_this.data.headImgs) {
        wx.previewImage({
          current: _this.data.headImgs,
          urls: [_this.data.headImgs], // 需要预览的图片http链接列表
        })
      }

    }
  },
  bindPreview(e) {
    let img = e.currentTarget.dataset.img
    wx.previewImage({
      current: img,
      urls: [img], // 需要预览的图片http链接列表
    })
  },
  bindEdit(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/newStaffCard/index?id=' + id,
    })
  },
  uploadImg() {
    let _this = this;
    if (_this.data.Ishow) {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        success(res) {
          let file = res.tempFiles[0]
          _this.setData({
            logo: file.tempFilePath
          })
        }
      })
    }
  },
  uploadVideo() {
    let _this = this;
    if (_this.data.Ishow) {
      wx.chooseMedia({
        count: 1,
        mediaType: ['video'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        success(res) {
          let file = res.tempFiles[0]
          if (file.fileType != "video") {
            wx.showToast({
              title: '请上传视频文件！',
              icon: 'none',
              duration: 2000
            })
            return
          }
          if (file.size > 1024 * 1024 * 100) {
            wx.showToast({
              title: '文件超出最大限制！',
              icon: 'none',
              duration: 2000
            })
            return
          }
          _this.setData({
            videos: file.tempFilePath
          })
        }
      })
    } else {

    }

  },
  sendRoles() {
    getRoles().then((res) => {}).catch(err => {

    })
  },
  getAddEmployee(params, params2) {
    addEmployee({
      ...params
    }).then((res) => {
      if (res.code == "000000") {
        this.getAddEnterpriseSetting(params2)
      }
    }).catch(err => {

    }).finally(() => {
      wx.hideLoading()
    })
  },
  getAddEnterpriseSetting(params) {
    addEnterpriseSetting({
      ...params
    }).then((res) => {
      if (res.code == "000000") {
        wx.showToast({
          title: '保存成功',
        })
        this.AdministratorInfo()
      }
    }).catch(err => {

    })
  },
  inputChange(e) {
    let _this = this;
    let key = e.currentTarget.dataset.key;
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

  sellingPoint(e) {
    let _this = this;
    let val = e.detail.value.replace(/\s+/g, '')
    if (val.length > 15) {
      val = val.slice(0, 15)
    }
    _this.setData({
      [e.currentTarget.dataset.key + `[${e.currentTarget.dataset.index}]`]: val,
    });
  },
  async submitNote() {

    let _this = this
    let params = {
      "avatar": _this.data.headImgs,
      "enterpriseCode": _this.data.AdminInfo.enterpriseCode,
      "fullname": _this.data.fullname,
      "mobile": _this.data.AdminInfo.mobile,
      "position": _this.data.position,
      "roleId": 1,
      "wechatCode": _this.data.wechatCode
    }
    let params2 = {
      "enterpriseCode": _this.data.AdminInfo.enterpriseCode,
      "logo": _this.data.logo.replace(_this.data.imageBaseUrl,''),
      "promotionalVideo": _this.data.videos.replace(_this.data.imageBaseUrl,''),
      "sellingPoint": _this.data.sellingPointList.join(","),
      "slogan": _this.data.slogan
    }
    var arr = _this.data.sellingPointList.filter(s => s !== '')
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
    } else if (!params.avatar) {
      wx.showToast({
        icon: 'none',
        title: '请上传头像'
      })
    } else if (!params2.slogan) {
      wx.showToast({
        icon: 'none',
        title: '请输入企业Slogan'
      })
    } else if (!params2.sellingPoint) {
      wx.showToast({
        icon: 'none',
        title: '请输入卖点'
      })
    } else if (arr.length < _this.data.sellingPointList.length) {
      wx.showToast({
        icon: 'none',
        title: '请输入卖点'
      })
    } else {
      wx.showLoading({
        title: '数据保存中....',
      })
      try {
        params.userId = _this.data.userId || _this.data.AdminInfo.userId
        if (params.avatar != _this.data.AdminInfo.avatar) {

          if (_this.data.AdminInfo.avatar && params.avatar.indexOf(_this.data.AdminInfo.avatar) != -1) {
            params.avatar = _this.data.AdminInfo.avatar
          } else {
            params.avatar = await _this.uploadFile({
              userId: params.userId,
              filePath: params.avatar
            })
          }
        }
        if (params2.logo.includes('tmp/') || params2.logo.includes('wxfile://tmp')) {
          params2.logo = await _this.uploadFile({
            userId: params.userId,
            filePath: params2.logo
          })
        }
        if (params2.promotionalVideo.includes('tmp/') || params2.promotionalVideo.includes('wxfile://tmp')) {
          console.log('1111');
            params2.promotionalVideo = await _this.uploadFile({
              userId: params.userId,
              filePath: params2.promotionalVideo
            })
        }
        // if (params2.logo != _this.data.AdminInfo.logo) {
        //   if (_this.data.AdminInfo.logo && params2.promotionalVideo.indexOf(_this.data.AdminInfo.logo) != -1) {
        //     params2.logo = _this.data.AdminInfo.logo
        //   } else {
        //     params2.logo = await _this.uploadFile({
        //       userId: params.userId,
        //       filePath: params2.logo
        //     })
        //   }
        // }
        // if (params2.promotionalVideo != _this.data.AdminInfo.promotionalVideo) {
        //   if (_this.data.AdminInfo.promotionalVideo && params2.promotionalVideo.indexOf(_this.data.AdminInfo.promotionalVideo) != -1) {
        //     params2.promotionalVideo = _this.data.AdminInfo.promotionalVideo
        //   } else {
        //     params2.promotionalVideo = await _this.uploadFile({
        //       userId: params.userId,
        //       filePath: params2.promotionalVideo
        //     })
        //   }
        // }
        if (_this.data.EditStatus || _this.data.topIndex == 0) {
          _this.getUpdateEmployee(params, params2)
        } else {
          _this.getAddEmployee(params, params2)
        }
      } catch (error) {
        wx.showToast({
          icon: 'none',
          title: '文件上传失败',
        })
      }
    }
  },
  AdministratorInfo() {
    let _this = this;

    getAdministratorInfo().then((res) => {
      console.log('sffd', res);
      if (res.code == "000000") {
        _this.setData({
          AdminInfo: res.data,
          headImgs: res.data.avatar ? imageBaseUrl + res.data.avatar : '',
          sellingPointList: res.data.sellingPoint ? res.data.sellingPoint?.split(',') : [''],
          logo: res.data.logo ? imageBaseUrl + res.data.logo : '',
          videos: res.data.promotionalVideo ? imageBaseUrl + res.data.promotionalVideo : '',
          fullname: res.data.fullname,
          position: res.data.position,
          wechatCode: res.data.wechatCode,
          slogan: res.data.slogan,
          userId: res.data.userId
        })
        this.AllEmployee()
        if (res.data.slogan) {
          _this.setData({
            Ishow: false
          })
        } else {
          _this.setData({
            Ishow: true
          })
        }
      }
    }).catch(err => {})
  },
  /** 获取全部员工信息 */
  AllEmployee() {
    let _this = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    if (_this.data.loadingType == 1) {
      wx.hideLoading()
      return
    }
    let leng = _this.data.pageSize
    getAllEmployee({
      enterpriseCode: _this.data.AdminInfo.enterpriseCode,
      pageNumber: _this.data.pageNumber,
      pageSize: _this.data.pageSize
    }).then((res) => {
      if (res.code == "000000") {
        if (res.data.length == 0 || res.data.length != leng) {
          _this.setData({
            loadingType: 1
          })
        } else {
          this.setData({
            pageNumber: _this.data.pageNumber + 1
          })
        }
        if (res.data.length > 0) {
          res.data = res.data.map(e => {
            e.avatar = e.avatar ? imageBaseUrl + e.avatar : e.avatar;
            return e
          })
        }
        _this.setData({
          AllEmployeeList: [..._this.data.AllEmployeeList, ...res.data]
        })
      }
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    })
  },
  /** 更新员工信息 */
  getUpdateEmployee(params, params2) {
    let _this = this;
    updateEmployee({
      ...params
    }).then((res) => {
      if (res.code == "000000") {
        _this.setData({
          EditStatus: false
        })
        this.getAddEnterpriseSetting(params2)
      }
    }).catch(err => {}).finally(() => {
      wx.hideLoading()
    })
  },
  bindDeleteEmployee(e) {
    let id = e.currentTarget.dataset.id;
    deleteEmployee({
      userId: id
    }).then((res) => {
      if (res.code == "000000") {
        wx.showToast({
          title: '名片删除成功',
        })
        this.AdministratorInfo()
      }
    }).catch(err => {})
  },
  editNote() {
    let _this = this;
    _this.setData({
      Ishow: true,
      EditStatus: true
    })
  },
  uploadFile,

  toPage(event) {
    let {
      url
    } = event.currentTarget.dataset;
    if (url) {
      wx.showLoading({
        title: '跳转中',
        mask: true
      })
      wx.navigateTo({
        url: url,
        complete: () => {
          wx.hideLoading()
        }
      })
    }

  }
})
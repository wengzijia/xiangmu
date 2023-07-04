// pages/gallerySet/index.js
import {
  addAdSetting,
  addInformation,
  geinInformation,
} from "../../api/gallerySet"
import {
  areaList
} from '@vant/area-data'
import {
  uploadFile,
  imageBaseUrl
} from '../../utils/request'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl,
    carouselList: [], //轮播图
    factoryList: [], //工厂展示
    cooperationList: [], //合作案例
    show: false,
    areaList,
    areaListId: '',
    province: '',
    city: '',
    county: '',
    Ishow: false,
    Information: [],
    phone: '',
    detailedAddress: '',
    title: '',
    EditStatus: false,
    id: '',
    userInfo: {},
    delImgIdList: [],
    carouselClose: false,
    cooperationClose: false,
    factoryClose: false,
    addressName:"", // 地址名字
    address:"", // 地址
    longitudeLatitude:"" // 经纬度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(this.data.userInfo);
    this.getGeinInformation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },



  submitNote() {
    let _this = this;
    let carouselList = _this.data.carouselList;
    let cooperationList = _this.data.cooperationList;
    let factoryList = _this.data.factoryList;
    let ImgMerge = [...carouselList, ...cooperationList, ...factoryList];
    var arr = cooperationList.filter(s => s.title !== '')
    let params = {
      phone: _this.data.phone,
      detailedAddress: _this.data.detailedAddress,
      // title:_this.data.title,
      introduction: _this.data.introduction,
      addressName: _this.data.addressName,
      address: _this.data.address,
      longitudeLatitude: _this.data.longitudeLatitude
      // province: _this.data.province,
      // city: _this.data.city,
      // county: _this.data.county,
    }
    console.log('params',params);
    if (!carouselList || carouselList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请上传轮播图图片',
      })
    } else if (!cooperationList || cooperationList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请上传合作案例图片',
      })
    } else if (arr.length < cooperationList.length) {
      wx.showToast({
        icon: 'none',
        title: '请输入合作案例标题'
      })
    } else if (!factoryList || factoryList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请上传工厂展示图片',
      })
    } else if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(params.phone) && !/^(?:\d{3,5}-)\d{7,8}$/.test(params.phone)) {
      wx.showToast({
        icon: 'none',
        title: '联系电话格式错误',
      })
    } else if (!_this.data.addressName || !_this.data.address) {
      wx.showToast({
        icon: 'none',
        title: '请选择企业地址',
      })
    } else if (!params.detailedAddress) {
      wx.showToast({
        icon: 'none',
        title: '请输入详细地址',
      })
    } else if (!params.introduction) {
      wx.showToast({
        icon: 'none',
        title: '请输入详细描述',
      })
    } else {
      console.log(factoryList);
      params.id = _this.data.id
      let arr = ImgMerge.map(e => {
        return new Promise((resolve, reject) => {
          e.coverPath = e.coverPath.split(imageBaseUrl).filter(s => s).join()
          if (e.tempFilePath) {
            uploadFile({
              userId: _this.data.userInfo.id,
              filePath: e.tempFilePath
            }).then(res => {
              resolve({
                ...e,
                coverPath: res
              })
            }).catch(() => {
              reject()
            })
          } else {
            resolve({
              ...e
            })
          }

        })
      })
      Promise.all(arr).then(res => {
        if (_this.data.EditStatus) {
          params.id = _this.data.id
          _this.getAddInformation(params, res)
        } else {
          _this.getAddInformation(params, res)
        }
      })

    }
  },

  //上传轮播图
  bindCarousel(e) {
    let _this = this;
    let carouselList = _this.data.carouselList
    let isdel = _this.data.carouselList.filter(s => s.statusDel !== 1).length
    let index = e.currentTarget.dataset.index
    let src = e.currentTarget.dataset.src
    let list = e.currentTarget.dataset.list
    if (index != undefined && !_this.data.EditStatus) {
      _this.checkCarouseImgs(e)
      return
    }
    wx.chooseMedia({
      count: (4 - isdel),
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        if (res.tempFiles[0].size > 1024 * 1024 * 10) {
          wx.showToast({
            title: '文件超出最大限制！',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (index || index == 0) {
          carouselList[index].coverPath = res.tempFiles[0].tempFilePath
          carouselList[index].tempFilePath = res.tempFiles[0].tempFilePath
        } else {
          carouselList.push(...res.tempFiles)
          for (let i = 0; i < carouselList.length; i++) {
            carouselList[i].coverPath = carouselList[i].coverPath || carouselList[i].tempFilePath
            carouselList[i].type = 'Carousel'
          }
          isdel = carouselList.filter(s => s.statusDel !== 1).length
          if (isdel >= 4) {
            _this.setData({
              carouselClose: false
            })
          }
        }
        _this.setData({
          carouselList
        })
      }
    })
  },
  //上传工厂展示
  bindFactory(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index
    let isdel = _this.data.factoryList.filter(s => s.statusDel !== 1).length
    // if(index!=undefined&&!_this.data.EditStatus){
    //   return
    // }
    if (index != undefined && !_this.data.EditStatus) {
      _this.checkFactoryImgs(e)
      return
    }
    wx.chooseMedia({
      count: (4 - isdel),
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        let factoryList = _this.data.factoryList
        if (res.tempFiles[0].size > 1024 * 1024 * 10) {
          wx.showToast({
            title: '文件超出最大限制！',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (index || index == 0) {
          factoryList[index].coverPath = res.tempFiles[0].tempFilePath
          factoryList[index].tempFilePath = res.tempFiles[0].tempFilePath
        } else {
          factoryList.push(...res.tempFiles)
          for (let i = 0; i < factoryList.length; i++) {
            factoryList[i].coverPath = factoryList[i].coverPath || factoryList[i].tempFilePath
            factoryList[i].type = 'industry'
          }
          isdel = factoryList.filter(s => s.statusDel !== 1).length
          if (isdel >= 4) {
            _this.setData({
              factoryClose: false
            })
          }
        }
        _this.setData({
          factoryList
        })
      }
    })

  },
  bindCooperation(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index
    let cooperationList = _this.data.cooperationList
    let isdel = _this.data.cooperationList.filter(s => s.statusDel !== 1).length
    // if(!_this.data.EditStatus){
    //   return
    // }
    if (index != undefined && !_this.data.EditStatus) {
      _this.checkCooperationImgs(e)
      return
    }
    wx.chooseMedia({
      count: (8 - isdel),
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        if (res.tempFiles[0].size > 1024 * 1024 * 10) {
          wx.showToast({
            title: '文件超出最大限制！',
            icon: 'none',
            duration: 2000
          })
          return
        }
        let len = res.tempFiles.length
        res.tempFiles[len - 1].title = ""
        if (index || index == 0) {
          cooperationList[index].coverPath = res.tempFiles[0].tempFilePath
          cooperationList[index].tempFilePath = res.tempFiles[0].tempFilePath
        } else {
          cooperationList.push(...res.tempFiles)
          for (let i = 0; i < cooperationList.length; i++) {
            cooperationList[i].coverPath = cooperationList[i].coverPath || cooperationList[i].tempFilePath
            cooperationList[i].type = 'exhibition'
          }
          isdel = cooperationList.filter(s => s.statusDel !== 1).length
          console.log(isdel);
          if (isdel >= 8) {
            _this.setData({
              cooperationClose: false
            })
          }
        }
        _this.setData({
          cooperationList
        })
      }
    })

  },
  delCarouseImg(e) {
    let _this = this;
    let carouselList = _this.data.carouselList
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    if (id) {
      carouselList[index].statusDel = 1

    } else {
      carouselList.splice(index, 1)
    }
    _this.setData({
      carouselList,
      carouselClose: true
    })
  },
  delFactoryImg(e) {
    let _this = this;
    let factoryList = _this.data.factoryList
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    if (id) {
      factoryList[index].statusDel = 1
    } else {
      factoryList.splice(index, 1)
    }
    // factoryList.splice(index,1)
    _this.setData({
      factoryList,
      factoryClose: true
    })
  },
  delCooperationImg(e) {
    let _this = this;
    let cooperationList = _this.data.cooperationList
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    if (id) {
      cooperationList[index].statusDel = 1
    } else {
      cooperationList.splice(index, 1)
    }
    // if(id){
    //   this.getDelAdSetting(id)
    // }else{
    //   cooperationList.splice(index,1)
    // }
    _this.setData({
      cooperationList,
      cooperationClose: true
    })
  },
  checkCarouseImgs(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let carouselList = _this.data.carouselList.map(e => e.coverPath)
    _this.previewImage(carouselList[e.currentTarget.dataset.index], carouselList)
  },
  checkFactoryImgs(e) {
    let _this = this;
    let factoryList = _this.data.factoryList.map(e => e.coverPath)
    _this.previewImage(factoryList[e.currentTarget.dataset.index], factoryList)
  },
  checkCooperationImgs(e) {
    let _this = this;
    let cooperationList = _this.data.cooperationList.map(e => e.coverPath)
    _this.previewImage(cooperationList[e.currentTarget.dataset.index], cooperationList)
  },
  previewImage(current, urls) {
    wx.previewImage({
      current,
      urls, // 需要预览的图片http链接列表
    })
  },
  // bindCooperation(){
  //   wx.navigateTo({
  //     url: '/pages/addCooperation/index',
  //   })
  // },
  //打开/关闭省市区选择器弹窗
  showPopup: function (e) {
    let _this = this;
    if (!_this.data.Ishow) {
      return
    }
    if (!this.data.show) {
      for (const key in this.data.areaList.county_list) {
        if (this.data.areaList.county_list[key] === this.data.city) {
          this.setData({
            areaListId: key
          })
        }
      }
    }
    this.setData({
      show: !this.data.show
    })
  },
  //确认选择地区
  confirmArea: function (e) {
    this.setData({
      "province": e.detail.values[0].name,
      "city": e.detail.values[1].name,
      "county": e.detail.values[2].name,
      show: false
    })
  },
  bindTitle(e) {
    let _this = this;
    _this.setData({
      [e.currentTarget.dataset.key + `[${e.currentTarget.dataset.index}].title`]: e.detail.value,
    });
  },
  inputChange(e) {
    let _this = this;
    let key = e.currentTarget.dataset.key
    _this.setData({
      [key]: e.detail.value.replace(/\\n/g,'\n') // 添加换行符 
    })
  },
  getAddAdSetting(params, ) {
    let _this = this;
    addAdSetting(params).then((res) => {
      if (res.code == "000000") {
        wx.showToast({
          title: '保存成功',
        })
        _this.setData({
          Ishow: true
        })
        _this.getGeinInformation()
      } else {
        wx.showToast({
          title: res.message,
          icon: "error",
        })
      }
    }).catch(err => {

    })
  },
  getAddInformation(params, params2) {
    let _this = this;
    addInformation(params).then((res) => {
      if (res.code == "000000") {
        // if(_this.data.EditStatus){
        //   _this.getUpdateAdSetting(params2)
        // }else{
        _this.getAddAdSetting(params2)
        // }

      } else {
        wx.showToast({
          title: res.message,
          icon: "error",
        })
      }
    }).catch(err => {

    })
  },
  getGeinInformation() {
    let _this = this;
    geinInformation().then((res) => {
      if (res.code == "000000") {
        let Information = res.data
        let carouselList = []
        let cooperationList = []
        let factoryList = []

        if (Information.adSetting.Carousel) {
          carouselList = Information.adSetting.Carousel.map(e => {
            e.coverPath = imageBaseUrl + e.coverPath
            return e
          })
        }
        if (Information.adSetting.exhibition) {
          cooperationList = Information.adSetting.exhibition.map(e => {
            e.coverPath = imageBaseUrl + e.coverPath
            return e
          })
        }
        if (Information.adSetting.industry) {
          factoryList = Information.adSetting.industry.map(e => {
            e.coverPath = imageBaseUrl + e.coverPath
            return e
          })
        }
        _this.setData({
          carouselList,
          cooperationList,
          factoryList,
          phone: Information.information?.phone,
          province: Information.information?.province,
          city: Information.information?.city,
          county: Information.information?.county,
          // title:Information.information?.title,
          detailedAddress: Information.information?.detailedAddress,
          introduction: Information.information?.introduction,
          id: Information.information?.id,
          addressName: Information.information.addressName || "",
          address: Information.information.address || ""
        })
        if (Information.information?.phone) {
          _this.setData({
            Ishow: false
          })
        } else {
          _this.setData({
            Ishow: true
          })
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: "error",
        })
      }
    }).catch(err => {
      console.error(err)
      console.log('ddd')

    })
  },
  editNote() {
    let _this = this;
    _this.setData({
      Ishow: true,
      EditStatus: true
    })
  },

  preview() {
    wx.navigateTo({
      url: '/pages/gallerySet/gallery/index',
    })
  },

  //获取用户定位授权，地图选点
  getLocation: function () {
    let _this = this;
    if(!_this.data.Ishow){
      return
    }
    // 获取用户的当前设置
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          // 提前向用户发起授权请求
          wx.authorize({
            scope: 'scope.userLocation',
            success(res){

            },
            fail(res){
              wx.showModal({
                title: '提示',
                content: '系统需要获取该您当前的定位，请确保您的位置授权已开启',
                showCancel: false,
                success(res){
                  if (res.confirm) {
                    // 调起客户端小程序设置界面
                    wx.openSetting({

                    })
                  }
                }
              })
            }
          });
        }
        // 打开地图选择位置
        wx.chooseLocation({
          success(res){
            console.log(res)
            if (res.address != '' && res.name != '') {
              _this.setData({
                addressName: res.name,
                address: res.address,
                longitudeLatitude:res.longitude + ',' + res.latitude
              })
            }
          }
        })
      }
    })
  }

})
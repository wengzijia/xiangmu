// pages/shopSet/index.js
import {
  uploadFile,
  imageBaseUrl
} from "../../utils/request"
import {
  addOrUpdateCategory,
  addOrUpdateAdSettingBath,
  getAdSetting,
  getCategories,
  deleteAdSettingBath
} from "../../api/shopSet"
import {
  addEnterpriseSetting,
  getAdministratorInfo
} from "../../api/nameCardSet"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "", // 用户信息
    administratorData: null, // 管理员和企业信息
    imageBaseUrl: imageBaseUrl, // 图片域名
    carouselList: [], // 轮播图列表
    sortList: [], // 分类列表
    isEdit: false, // 是否可以编辑  true 不可以  false 可以
    isUpload: false, // 是否上传  false 不是  true 是
    watermark: "" //  水印地址
  },
  // 获取分类
  async getSort() {
    let _this = this;
    let param = {
      enterpriseCode: _this.data.userInfo.enterpriseCode
    }
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getCategories(param);
    console.log('data', data);
    if (code == '000000') {
      _this.setData({
        sortList: data
      })
      if (data.length) {
        _this.setData({
          isEdit: true
        })
      } else {
        _this.setData({
          isEdit: false
        })
      }
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
    let sortList = _this.data.sortList;
    console.log('fad', sortList.length);
    let sortLenth = 6 - sortList.length; // 长度
    for (let i = 0; i < sortLenth; i++) {
      console.log('length', sortList.length);
      sortList.push({
        enterpriseCode: wx.getStorageSync('userInfo').enterpriseCode,
        name: ""
      })
    }
    _this.setData({
      sortList
    })
    console.log('sortList', _this.data.sortList);
  },
  // 分类输入
  sortInput(e) {
    let {
      index
    } = e.currentTarget.dataset;
    let {
      value
    } = e.detail;
    console.log('index', index);
    console.log('value', value);
    let _this = this;
    _this.data.sortList[index].name = value.replace(/\s+/g, '').slice(0, 12); // 去掉空格并截取12个字
    _this.setData({
      sortList: _this.data.sortList
    })
    console.log('sortList', _this.data.sortList);
  },
  // 编辑方案
  editPlan(e) {
    console.log('e', e);
    let {
      id,
      name,
      path,
      enterprisecode
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/editProgram/index?id=${id}&name=${name}&path=${path}&enterprisecode=${enterprisecode}`
    })
  },
  // 预览
  previewClick() {
    let _this = this;
    wx.navigateTo({
      url: '/pages/previewPlan/index'
    })
  },
  //上传轮播图
  uploadCarousel(e) {
    let _this = this;
    // let len = _this.data.carouselList.length
    // let index = e.currentTarget.dataset.index
    if (_this.data.isEdit) {
      return
    }
    _this.setData({
      isUpload: true
    })
    wx.chooseMedia({
      // count: (4 - len),
      count: 4,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        console.log(res)
        let tempFiles = res.tempFiles;
        let uploadPromiseTask = [] //定义上传的promise任务栈
        let size = 1024 * 1024 * 2; // 大小
        let format = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG']; // 格式
        let fileList = tempFiles.filter(e => e.size <= size && format.includes(e.tempFilePath.substring(e.tempFilePath.lastIndexOf('.') + 1)));
        console.log('fileLen', _this.data.fileLen);
        for (let i = 0; i < tempFiles.length; i++) {
          console.log('1111');
          if (tempFiles[i].size > size) {
            wx.showToast({
              title: '您上传的文件大小超出了限制',
              icon: "none"
            })
          } else if (!format.includes(tempFiles[i].tempFilePath.substring(tempFiles[i].tempFilePath.lastIndexOf('.') + 1))) {
            wx.showToast({
              title: '您上传的文件超出了限制',
              icon: "none"
            })
          }
        }
        fileList.forEach(e => {
          if ((_this.data.carouselList.length + uploadPromiseTask.length) < 4) {
            uploadPromiseTask.push(uploadFile({
              userId: _this.data.userInfo.id,
              filePath: e.tempFilePath
            })) //push进每一张所需要的上传的图片promise栈
          }
        })
        Promise.all(uploadPromiseTask).then(res => {
          console.log('res', res);
          // 处理成展示的字段
          let data = res.map(e => {
            return {
              coverPath: e
            }
          })
          console.log('data', data);
          //全部上传完毕
          _this.setData({
            carouselList: [..._this.data.carouselList, ...data]
          })
          console.log('carouselList', _this.data.carouselList);
          wx.hideLoading()
        }).catch(error => {
          //存在有上传失败的文件
          wx.hideLoading()
          wx.showToast({
            title: '上传失败！',
            icon: 'none',
          })
        })
      }
    })
  },
  // 删除图片
  async deleteImg(e) {
    console.log('e', e);
    let {
      index
    } = e.currentTarget.dataset;
    console.log('index', index);
    let _this = this;
    let {
      id
    } = e.currentTarget.dataset;
    console.log('id', id);
    if (id) {
      let param = [{
        id
      }]
      let {
        code,
        data,
        message
      } = await deleteAdSettingBath(param);
      if (code == '000000') {
        wx.showToast({
          title: message,
          icon: "none"
        })
        _this.getCarousel()
      } else {
        wx.showToast({
          title: message,
          icon: "none"
        })
      }
    } else {
      _this.data.carouselList.splice(index, 1)
      _this.setData({
        carouselList: _this.data.carouselList
      })
    }
    console.log('carouselList', _this.data.carouselList);
  },
  // 添加轮播图
  async addCarousel() {
    let _this = this;
    let param = _this.data.carouselList.map(e => {
      console.log('e', e);
      return {
        id: e.id || "",
        coverPath: e.coverPath,
        enterpriseCode: _this.data.userInfo.enterpriseCode,
        type: "mallCarousel"
      }
    })
    console.log('param', param);
    wx.showLoading({
      title: "保存中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await addOrUpdateAdSettingBath(param);
    if (code == "000000") {

    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 获取轮播图
  async getCarousel() {
    let _this = this;
    let param = {
      enterpriseCode: _this.data.userInfo.enterpriseCode,
      type: "mallCarousel"
    }
    let {
      code,
      data,
      message
    } = await getAdSetting(param);
    if (code == '000000') {
      _this.setData({
        carouselList: data
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 获取管理员及企业信息
  async administratorInfo() {
    let _this = this;
    let {
      code,
      data,
      message
    } = await getAdministratorInfo();
    if (code == "000000") {
      _this.setData({
        administratorData: data,
        watermark: data.watermark
      })
    } else {
      wxx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 上传水印
  uploadImg() {
    let _this = this;
    if (_this.data.isEdit) {
      return
    }
    _this.setData({
      isUpload: true
    })
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      async success(res) {
        let file = res.tempFiles[0];
        let uploadParam = {
          userId: _this.data.userInfo.id,
          filePath: file.tempFilePath
        }
        let result = await uploadFile(uploadParam);
        console.log(result);
        _this.setData({
          watermark: result
        })
      }
    })
  },
  // 方案水印
  async planWatermark() {
    let _this = this;
    let params = {
      enterpriseCode: _this.data.userInfo.enterpriseCode, // 企业编码
      watermark: _this.data.watermark // 水印地址
    }
    let result = await addEnterpriseSetting(params);
  },
  // 保存
  async save() {
    let _this = this;
    let sortList = _this.data.sortList;
    let carouselList = _this.data.carouselList;
    if (!carouselList.some(item => item.coverPath)) {
      wx.showToast({
        title: '请上传轮播图',
        icon: "none"
      })
      return
    }
    if (!sortList.some(item => item.name)) {
      wx.showToast({
        title: '请输入分类标题',
        icon: "none"
      })
      return
    }
    // 添加轮播图
    await _this.addCarousel()
    // 方案水印
    await _this.planWatermark()
    let sortListParam = sortList.map(item => {
      return {
        enterpriseCode: item.enterpriseCode || "", // 企业编号
        name: item.name || "", // 类名
        id: item.id || "",
        path:item.path || ""
      }
    });
    console.log('sortListParam', sortListParam);
    wx.showLoading({
      title: "保存中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await addOrUpdateCategory(sortListParam);
    if (code == '000000') {
      _this.getCarousel()
      _this.getSort()
      _this.administratorInfo()
      _this.setData({
        isEdit: true
      })
      _this.drawCanvas()
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 重新编辑
  reEdit() {
    let _this = this;
    _this.setData({
      isEdit: false
    })
  },
  // 绘制canvas
  drawCanvas() {
    let _this = this;
    if(!_this.data.watermark) return;
    const query = wx.createSelectorQuery()
    query.select('#syCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        console.log('res', res)
        const ctx = canvas.getContext('2d')
        let img = canvas.createImage()
        const dpr = wx.getSystemInfoSync().pixelRatio
        console.log('dpr', dpr)
        let width = res[0].width * dpr;
        let height = res[0].height * dpr
        canvas.width = width
        canvas.height = height
        img.src = "https://alifile.xiaocaiyin.com/uploads/file/VO202212/VO/skin_605/%E6%95%88%E6%9E%9C%E5%9B%BE_520.png"
        img.onload = function () {
          ctx.drawImage(img, 0, 0, width, height);
          let watermarkImg = canvas.createImage();
          watermarkImg.src = _this.data.imageBaseUrl + _this.data.watermark;
          watermarkImg.onload = function ( ) {
            let maxHeight = 100;
            let imgWidth = watermarkImg.width / watermarkImg.height * maxHeight;
            ctx.globalAlpha = 0.5
            ctx.drawImage(watermarkImg, width / 2 - imgWidth / 2, height / 2 - maxHeight / 2,imgWidth,maxHeight);
          }
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      userInfo: wx.getStorageSync('userInfo')
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
  async onShow() {
    let _this = this;
    if (_this.data.isUpload) {
      return
    }
    // 获取轮播图
    _this.getCarousel()
    // 获取分类
    _this.getSort()
    // 获取管理员及企业信息
    await _this.administratorInfo()
    _this.drawCanvas()
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
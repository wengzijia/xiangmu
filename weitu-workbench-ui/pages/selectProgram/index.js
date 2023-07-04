// pages/selectProgram/index.js
// 图片域名
import {
  imageBaseUrl
} from '../../utils/request'
import {
  getCurrentAndParents,
  categoryList,
  pagePackScheme,
  addOrUpdateCategory
} from "../../api/shopSet"

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl, // 图片域名
    oneJiSortIndex: 0, // 一级分类下标
    twoJiSortIndex: 0, // 二级分类下标
    threeJiSortIndex: 0, // 三级分类下标
    sortIndex: "", // 分类下标
    sortName: "", // 分类名字
    sortParam: {
      categoryId: "",
      enterpriseCode: "",
      path: ""
    },
    planParam: {
      categoryIds: "", // 商品分类
      pageNumber: 1, // 页数
      pageSize: 10 // 页大小
    },
    categories: [], // 分类数据 
    categorySchemes: [], // 
    sortList: [], // 分类列表
    planList: [], // 方案列表
    threeJiSortName: "", // 三级分类名字
    isPullRefresh: true, // 下拉刷新是否触发
    selectData: [], // 多选框数据
    selectDataAll: []
  },
  // 一级分类切换
  oneJiSortCut(e) {
    console.log('e', e);
    let {
      index
    } = e.currentTarget.dataset;
    let _this = this;
    if (_this.data.oneJiSortIndex === index) return
    _this.setData({
      oneJiSortIndex: index,
      twoJiSortIndex: 0,
      threeJiSortIndex: 0
    })
    // 重置
    _this.reset()
    // 获取方案分页
    _this.getPlanList()
  },
  // 二级分类切换
  twoJiSortCut(e) {
    console.log('e', e);
    let {
      index
    } = e.currentTarget.dataset;
    let _this = this;
    if (_this.data.twoJiSortIndex === index) return
    _this.setData({
      twoJiSortIndex: index,
      threeJiSortIndex: 0
    })
    // 重置
    _this.reset()
    // 获取方案分页
    _this.getPlanList()
  },
  // 三级分类切换
  threeJiSortCut(e) {
    console.log('e', e);
    let {
      index,
      name
    } = e.currentTarget.dataset;
    let _this = this;
    if (_this.data.threeJiSortIndex === index) return
    _this.setData({
      threeJiSortIndex: index,
      threeJiSortName: name
    })
    // 重置
    _this.reset()
    // 获取方案分页
    _this.getPlanList()
  },
  // 获取分类
  async getSort() {
    let _this = this;
    wx.showLoading({
      title: "获取中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getCurrentAndParents(_this.data.sortParam);
    if (code == "000000") {
      console.log('app.globalData.programData', app.globalData.programData)
      if (app.globalData.isEditTwo) {
        _this.setData({
          selectDataAll: app.globalData.programData,
          schemeNum: app.globalData.programData.length
        })
      } else {

        // let arr = data.categorySchemes.filter(e =>{
        //   return !app.globalData.programData.find(s => e.schemeId==s.id)
        // })
        // arr = app.globalData.programData.concat(arr.map(e=> {
        //   return {
        //       id:e.schemeId,
        //       thumbnail:e.thumbnail
        //   }
        // }))
        _this.setData({
          selectDataAll: data.categorySchemes,
          schemeNum: data.categorySchemes.length
        })
      }
      _this.setData({
        categories: data.categories,
        categorySchemes: data.categorySchemes,

      })
      console.log('分类数据', data);
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 获取分类列表
  async getSortList() {
    let _this = this;
    wx.showLoading({
      title: "获取中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await categoryList();
    data.forEach(item => {
      _this.data.sortList.push(...item.packWebCategories)
    })

    if (code == "000000") {
      _this.setData({
        sortList: _this.data.sortList
      })
      // 获取方案分页
      _this.getPlanList()
      console.log('sortList', _this.data.sortList);
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 获取方案分页
  async getPlanList() {
    let _this = this;
    wx.showLoading({
      title: "获取中...",
      mask: true
    })
    let planParam = _this.data.planParam;
    console.log('planParam',this.data.sortList)
    let linkCategory = _this.data.sortList[_this.data.oneJiSortIndex]
    if(linkCategory.children){
      linkCategory = linkCategory.children[_this.data.twoJiSortIndex]
      if(linkCategory.children){
        linkCategory = linkCategory.children[_this.data.threeJiSortIndex]
      }
    }
    planParam.categoryIds = linkCategory.linkCategoryIds
    let arr = _this.data.selectData.filter(e => !_this.data.selectDataAll.find(s => s.id == e.id))
    _this.setData({
      selectDataAll: _this.data.selectDataAll.concat(arr)
    })
    let {
      code,
      data,
      message
    } = await pagePackScheme(planParam);
    if (code == "000000") {
      let selectData = [];
      data = data.map(e=>{
        if(e.goodsImg){
          e.goodsImg = JSON.parse(e.goodsImg)
        }
        return e
      })
      // 得在合并数据之前处理数据
      data = [..._this.data.planList, ...data]
      data = data.map(e => {
        if (_this.data.selectDataAll.find(s => s.id == e.id)) {
          console.log('ddd', e)
          selectData.push(e)
          e.checked = true
        } else {
          e.checked = false
        }
        return e
      })
      console.log(app.globalData.programData)
      console.log('data', data)
      _this.setData({
        selectData,
        planList: data,
        threeJiSortName: linkCategory.name
      })
      console.log('planList', _this.data.planList);
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 重置
  reset() {
    let _this = this;
    _this.setData({
      ['planParam.pageNumber']: 1,
      planList: []
    })
  },
  // 上拉加载更多
  scrollLoadMore(e) {
    let _this = this;
    _this.setData({
      isPullUp: true
    })
    _this.data.planParam.pageNumber++
    _this.getPlanList()
  },
  // 下拉刷新
  pullToRefresh(e) {
    let _this = this;
    // 复位
    _this.setData({
      isPullRefresh: false
    })
    _this.setData({
      ['planParam.pageNumber']: 1,
      planList: []
    })
    _this.getPlanList()
  },
  // 多选框改变
  orderSelectChange(e) {
    let {
      value
    } = e.detail;
    console.log('value', e);
    let _this = this;
    let selectData = value.map(e => {
      console.log('e', );
      let data = e.split('#');
      return {
        id: data[0],
        thumbnail: data[1]
      }
    })
    console.log('app', _this.data.selectData.length, selectData.length);
    if (_this.data.selectData.length > selectData.length) {
      let del = _this.data.selectData.find(e => !selectData.find(s => s.id == e.id))
      let selectDataAll = _this.data.selectDataAll.filter(e => e.id != del.id)
      console.log('selectDataAll', selectDataAll)
      _this.setData({
        selectDataAll,
        schemeNum: _this.data.schemeNum - 1
      })
    } else {
      let arr = selectData.filter(e => !_this.data.selectDataAll.find(s => s.id == e.id))
      let selectDataAll = _this.data.selectDataAll.concat(arr)
      _this.setData({
        selectDataAll,
        schemeNum: _this.data.schemeNum + 1
      })
    }

    _this.setData({
      selectData
    })
    console.log('selectData', _this.data.selectData);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log('e', e);
    let {
      id,
      enterprisecode,
      path,
      sortIndex,
      sortName
    } = e;
    let _this = this;
    app.globalData.sortIndex = sortIndex - 1;
    _this.setData({
      ['sortParam.categoryId']: id,
      ['sortParam.enterpriseCode']: enterprisecode,
      ['sortParam.path']: path,
      sortIndex,
      sortName,

    })
  },
  // 保存
  save() {
    let _this = this;
    // app.globalData.programData = _this.data.selectDataAll
    // app.globalData.schemeNum = _this.data.schemeNum 
    // let arr = _this.data.selectData.filter(e => !_this.data.selectDataAll.find(s => s.id==e.id))
    // app.globalData.programData = _this.data.selectDataAll.concat( arr) 
    // app.globalData.programData.push(_this.data.selectData);
    wx.showLoading({
      title: '保存中'
    })
    let obj = {
      ...app.globalData.schemeInfo,
      packSchemes: null,
      schemeNum: null,
      isEdit: null
    }
    obj.schemeCommands = _this.data.selectDataAll.map(e => {
      return {
        schemeId: e.id,
        categoryId: obj.id || "",
      }
    })
    addOrUpdateCategory([obj]).then(res => {
      console.log('dasdadadsad', res)
      if (res.code == '000000') {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.hideLoading()
          wx.navigateBack()
        }, 1000)

      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.hideLoading()
    })
    // 
    console.log('app.globalData.programData', obj);
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
    // 获取分类
    _this.getSort()
    // 获取分类列表
    _this.getSortList()
    _this.setData({
      // selectData:[...app.globalData.programData],
      // selectDataAll:[...app.globalData.programData],
      // schemeNum:app.globalData.schemeNum,
      schemeInfo: app.globalData.schemeInfo
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
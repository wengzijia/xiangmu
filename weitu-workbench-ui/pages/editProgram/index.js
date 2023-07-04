// pages/editProgram/index.js
// 图片域名
import {
  imageBaseUrl
} from '../../utils/request'
import {
  addOrUpdateCategory,
  getSchemeForFrontPage,
} from "../../api/shopSet"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl,
    yjSortName: "11", // 一级分类名字
    sortParam: {
      categoryId: "",
      enterpriseCode: "",
      path: "",
      size: 5
    },
    programData: [], // 方案数据
    sortIndex: "", // 分类下标
    EJSortData: [], // 二级分类数据
    EJSortParam: [], // 二级分类参数
    isNotEdit:true,
    addId:1,
    isShowSave:false // 是否显示保存按钮
  },
  // 获取二级分类
  async getEJSort() {
    let _this = this;
    wx.showLoading({
      title: "获取中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getSchemeForFrontPage(_this.data.sortParam);
    if (code == '000000') {
      data = data.map(e=>{
        e.packSchemes.map(item=>{
          if(item.goodsImg){
            item.goodsImg = JSON.parse(item.goodsImg)
          }
        })
        return e
      })
      console.log('data',data);
      _this.setData({
        EJSortData: data,
        EJSortParam: data
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 新增分类
  addSort() {
    let _this = this;
    let EJSortData = _this.data.EJSortData;
    let EJSortParam = JSON.parse(JSON.stringify(_this.data.EJSortParam))
    let obj = {
      enterpriseCode: _this.data.sortParam.enterpriseCode,
      id: "",
      name: "",
      addId:_this.data.addId,
      path:  _this.data.sortParam.path,
      pid:_this.data.sortParam.categoryId,
      schemeCommands: [{
        categoryId: "",
        schemeId: ""
      }]
    }
    EJSortData.push(obj)
    EJSortParam.push(obj)
    _this.setData({
      EJSortData,
      EJSortParam,  
      addId:_this.data.addId+1
    })
    console.log('删除EJSortData', _this.data.EJSortData);
    console.log('删除EJSortParam', _this.data.EJSortParam);
  },
  // 删除分类
  deleteSort(e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      // content: res.data.message||res.data.msg,
      content: '确认删除该二级分类吗?',
      success(res) {
          if (res.confirm) {
            let {
              index
            } = e.currentTarget.dataset;
            let obj = _this.data.EJSortData[index];
            obj.name='';
            addOrUpdateCategory([obj]).then(res=>{
              if(res.code=='000000'){
                wx.showToast({
                  title: '删除成功',
                  icon:'none'
                })
                _this.getEJSort()
              }else{
                wx.showToast({
                  title: res.message,
                  icon:'none'
                })
              }
            })
          }else{
            wx.showToast({
              title: '取消删除',
              icon:'none'
            })
          }
      },
      complete(){
      
      }
  });
    // let EJSortParam = _this.data.EJSortParam;
    // console.log('EJSortParam', EJSortParam);
    // if(_this.data.EJSortData[index].id){
    //   EJSortParam = EJSortParam.map(e =>{
    //     if(e.id==_this.data.EJSortData[index].id){
    //       e.name = ''
    //     }
    //     return e
    //   })
    // }else{
    //   EJSortParam = EJSortParam.filter(e =>{
    //     return e.addId!=_this.data.EJSortData[index].addId
    //   })
    // }
    
    // _this.setData({
    //   EJSortParam,
    //   EJSortData: EJSortData.filter((e, i) => i != index)
    // })
    // console.log('删除EJSortParam', EJSortParam);
    // console.log('删除EJSortData', _this.data.EJSortData);
  },
  // 二级分类输入
  EJSortInput(e) {
    let _this = this;
    let {
      index
    } = e.currentTarget.dataset;
    let {
      value
    } = e.detail;
    let EJSortData = _this.data.EJSortData;
    EJSortData[index].name = value.replace(/\s+/g, '').slice(0, 12); // 去掉空格并截取12个字
    _this.setData({
      EJSortData,
      isShowSave:true
    })
  },
  // 添加方案
  addPlan(e) {
    let _this = this;
    let {
      id,
      enterprisecode,
      path,
      sortname,
      sortindex
    } = e.currentTarget.dataset;
    app.globalData.sortIndex = sortindex-1
    let EJSortParam = _this.data.EJSortParam
    if(EJSortParam[app.globalData.sortIndex].isEdit){
      app.globalData.isEditTwo = true
    }else{
      app.globalData.isEditTwo = false
    }
    EJSortParam[app.globalData.sortIndex].isEdit = true;
    _this.setData({
      EJSortParam
    })
    if(!_this.data.EJSortData[app.globalData.sortIndex]?.packSchemes){
      _this.data.EJSortData[app.globalData.sortIndex].packSchemes = []
      _this.setData({
        EJSortData :_this.data.EJSortData
      })
    }
    app.globalData.programData = _this.data.EJSortData[app.globalData.sortIndex]?.packSchemes
    app.globalData.schemeNum = _this.data.EJSortData[app.globalData.sortIndex]?.schemeNum||0
    app.globalData.schemeInfo = _this.data.EJSortData[app.globalData.sortIndex]
    wx.navigateTo({
      url: `/pages/selectProgram/index?id=${id}&enterprisecode=${enterprisecode}&path=${path}&sortName=${sortname}&sortIndex=${sortindex}`
    })
  },
  // 保存
  async save(seeAllParams,isSeeAll) {
    let _this = this;
    if (!_this.data.EJSortData.every(e => e.name)) {
      wx.showToast({
        title: '请输入分类标题',
        icon: "none"
      })
      return
    }
    console.log('_this.data.EJSortParam',_this.data.EJSortParam)
    let EJSortParam = _this.data.EJSortParam.map(e=>{
      return {
        enterpriseCode: e.enterpriseCode,
        id: e.id,
        name:e.name,
        path: e.path,
        pid: e.pid,
        schemeCommands: [{
          categoryId:e.categoryId || '',
          schemeId:e.schemeId || ''
        }]
      }
    })
    console.log('EJSortParam',EJSortParam)
    // let EJSortParam = _this.data.EJSortParam.filter(e => e.id==''||e.name==''||e.isEdit)
    // console.log('_this.data.EJSortParam',_this.data.EJSortParam)
    // EJSortParam = EJSortParam.map(e => {
    //   console.log('e',e)
    //   let name = e.name||'';
    //   let obj = _this.data.EJSortData.find(s => s.id==e.id)
    //   if(e.id&&!obj){
    //     name = ''
    //   }
    //   let schemeCommands = e.packSchemes?.map(s =>{
    //     return {
    //       schemeId: s.id,
    //       categoryId: e.id || "",
    //       thumbnail:s.thumbnail
    //     }
    //   })
    //   if(obj){
    //     schemeCommands =  obj.packSchemes?.map(s =>{
    //       return {
    //         schemeId: s.id,
    //         categoryId: e.id || "",
    //         thumbnail:s.thumbnail
    //       }
    //     })
    //   }
    //   // if(e.addId){
    //   //   obj = _this.data.EJSortData.find(s => s.addId==e.addId)
    //   // }
    
    //   return {
    //     enterpriseCode: _this.data.sortParam.enterpriseCode,
    //     id: e.id || "",
    //     name,
    //     path: e.path || _this.data.sortParam.path,
    //     pid: _this.data.sortParam.categoryId,
    //     // schemeCommands
    //     schemeCommands: [{
    //       categoryId: "",
    //       schemeId: ""
    //     }]
    //   }
    // })
    _this.setData({
      EJSortParam
    })
    console.log('EJSortParam', EJSortParam);
    wx.showLoading({
      title:"保存中..."
    })
    let {
      code,
      data,
      message
    } = await addOrUpdateCategory(_this.data.EJSortParam);
    if (code == '000000') {
      app.globalData.programData = [];
      app.globalData.sortIndex = 0;
      _this.setData({
        isNotEdit:true
      })
      if(isSeeAll===true){
        setTimeout(()=>{
          _this.seeAll(seeAllParams)
        },500)
      }else{
        wx.navigateBack()
      }
     
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 查看全部
  seeAll(e) {
    let _this = this;
    console.log('e',e);
    let { id,enterprisecode,path,sortindex,sortname,schemenum } = e.currentTarget.dataset;
    if(_this.data.isNotEdit){
      app.globalData.sortIndex = sortindex-1
      app.globalData.programData = this.data.EJSortData[app.globalData.sortIndex]?.packSchemes
      app.globalData.schemeNum = this.data.EJSortData[app.globalData.sortIndex]?.schemeNum
      wx.navigateTo({
        url: `/pages/editPlan/index?id=${id}&enterprisecode=${enterprisecode}&path=${path}&sortIndex=${sortindex}&sortName=${sortname}&schemeNum=${schemenum}`
      })
    }else{
      // wx.showT({
      //   title: '未保存选择的方案信息,请保存后再查看',
      //   icon:'none'
      // })
      wx.showModal({
        title: '提示',
        content: '数据未保存,需要保存再继续查看。',
        confirmText:'确认保存',
        showCancel: true,
        success(res) {
            if (res.confirm) {
              setTimeout(()=>{
                _this.save(e,true)
              },1000)
            }
        },
        complete(){
        }
    });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log('e', e);
    let {
      id,
      name,
      path,
      enterprisecode
    } = e;
    let _this = this;
    _this.setData({
      yjSortName: name,
      ['sortParam.categoryId']: id,
      ['sortParam.path']: path,
      ['sortParam.enterpriseCode']: enterprisecode,
    })
    //  _this.getEJSort()
    console.log('sortParam', _this.data.sortParam);
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
    // 获取二级分类
    console.log('app.globalData.programData',app.globalData.programData)
    // let programData = app.globalData.programData
    // if(_this.data.EJSortData.length>0){
    //   let programData2 = _this.data.EJSortData[app.globalData.sortIndex]?.packSchemes
    // if(programData.length>0||programData.length!=programData2.length){
    //   let isNotEdit;
    //   if(_this.data.isNotEdit){
    //     if(programData.length!=programData2.length){
    //       isNotEdit = false
    //     }else{
    //       isNotEdit = programData.every(e=> programData2?.find(s => s.id==e.id))
    //     }
    //     _this.setData({
    //       isNotEdit
    //     })
    //     _this.data.EJSortData[app.globalData.sortIndex].isNotEdit = isNotEdit
    //     console.log('isNotEdit2',isNotEdit)
    //     console.log('isNotEdit',_this.data.isNotEdit)
    //   }
    //   console.log('EJSortData', _this.data.EJSortData);
    //   _this.data.EJSortData[app.globalData.sortIndex].schemeNum = app.globalData.schemeNum
    //   _this.data.EJSortData[app.globalData.sortIndex].packSchemes = [...programData]
    // }
    // _this.setData({
    //   EJSortData: _this.data.EJSortData
    // })
    
  // }
  _this.getEJSort()
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
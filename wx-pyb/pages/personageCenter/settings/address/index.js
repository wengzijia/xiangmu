

const app = getApp()
import { getMyList ,deleteById,addresssaveOrUpdate} from "../../../../api/userApi";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    startX: 0, //开始坐标
    startY: 0,
    selsect:false,
    radio:'',
    value:'',
    cacheList:[],
    timeOut:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'selsect') {
      this.setData({
        selsect:true
      })
    } else {
      this.setData({
        selsect:false
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressList();
  },

  onSearch(val){
    wx.showLoading({
      title:'加载中',
      mask:true
    })
    if (val.detail) {
      let arr = this.data.cacheList.filter(item=>{
      return item.consigneeName.indexOf(val.detail)!=-1
      })
      this.setData({
        addressList:arr
      })
      wx.hideLoading()
    }else{
      this.setData({
        addressList:this.data.cacheList
      })
      wx.hideLoading()
    }
    
  },
  onCancel(){
    this.setData({
      addressList:this.data.cacheList
    })
  },
  onNameChange(val){
    let _this = this
    clearTimeout(this.data.timeOut)
    if (val.detail){
      this.setData({
        timeOut:setTimeout(()=>{
          let arr = _this.data.cacheList.filter(item=>{
          return item.consigneeName.indexOf(val.detail)!=-1
          })
          _this.setData({
            addressList:arr
          })
        },500)
      })
    }else{
      this.setData({
        addressList:this.data.cacheList
      })
    }
    
  },
  default(e){
    // console.log('eeeeeeeeeeeeeee',e.currentTarget.dataset.index);
    let i = e.currentTarget.dataset.index
    let obj = this.data.addressList[i]
    obj.isDefault = 1
    addresssaveOrUpdate({data:obj}).then(res=>{
      if (res.success&&!this.data.selsect) {
        wx.showToast({
          title: '已设为默认地址',
          icon:'success',
          duration:2000,
          complete:()=>{
            this.getAddressList()
          }
        })
      }else{
        this.getAddressList()
      }
    })
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
    wx.setStorageSync('addressId', event.detail)
    this.confirmSelect()
  },
  //确认选择地址
  confirmSelect(){
    let _this = this
    wx.showLoading({
      title: '保存中',
      mask:true
    })
    addresssaveOrUpdate({data:{
      id:_this.data.radio,
      isDefault:1
    }}).then(res=>{
      wx.hideLoading()
      if (res.success) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
    
  },
  //跳转到地址详情
  add:function(e){
    let str = ''
    if (e.currentTarget.dataset.type=='add') {
      str = '?type=add'
    } else {
      str = '?id='+e.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: './NewAddress/index'+str+'&del='+(this.data.selsect?2:1),
    })
  },
  //删除事件
  del: function (e) {
    const _this = this
    wx.showModal({
      title: '删除地址',
      confirmColor: '#02BB00',
      content: '确认删除此地址？',
      success: function (res) {
        if (res.confirm) {
          deleteById({id:e.currentTarget.dataset.id}).then(resp => {
            _this.getAddressList();
          })
        } else {
          // console.log('点击取消回调')
        }
      }
    })    
  },
  /**
   * 获取收货地址列表
   */
  getAddressList(){
    getMyList().then(res=>{
      if (res.data) {
        console.log(res.data);
        this.setData({
          addressList:res.data,
          cacheList:res.data,
          radio:res.data[0]?res.data[0].id:''
        })
        if (res.data&&res.data[0]?.isDefault!=1&&this.data.selsect) {
          let obj = {
            target:{
              dataset:{
                index:0
              }
            }
          }
          this.default(obj)
        }
      }
    })
  },
   //手指触摸动作开始 记录起点X坐标
   touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.addressList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      addressList: this.data.addressList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.addressList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      addressList: that.data.addressList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
   angle: function (start, end) {
    var dX = end.X - start.X,
      dY = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(dY / dX) / (2 * Math.PI);
  },

})
// pages/personageCenter/settings/address/index.js
const app = getApp()
import {getById, addresssaveOrUpdate } from "../../../../../api/userApi";
import { replaceAddress,replaceAddress2 } from "../../../../../utils/util";
import { areaList } from '@vant/area-data'
import Toast from '@vant/weapp/toast/toast';

var addressList = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList,
    consigneeName:'',
    mobile:'',
    address:'',
    cityId:'',
    countyId:'',
    provinceId:'',
    isDefault:true,
    region: ['广东省', '广州市', '海珠区'],
    type:'add',
    id:'',
    delNum:1,
    show:false,
    areaListId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('areaList',this.data.areaList)
    console.log('options',options);
    this.setData({
      delNum:options.del
    })
    if (options.type!='add') {
      this.setData({
        type:'change',
        id:options.id,
      })
     
      this.getAddress()
    }
  },
  //打开/关闭省市区选择器弹窗
  showPopup:function(e){
    if (!this.data.show) {
      for (const key in this.data.areaList.county_list) {
        if (this.data.areaList.county_list[key] === this.data.region[2]) {
          this.setData({
            areaListId:key
          })
        }
      }
    }
    this.setData({
      show:!this.data.show
    })
  },
  //确认选择地区
  confirmArea:function(e){
    this.setData({
      "region[0]":e.detail.values[0].name,
      "region[1]":e.detail.values[1].name,
      "region[2]":e.detail.values[2].name,
      show:false
    })
  },
  /**获取地址详情 */
  getAddress:function(e){
    getById({id:this.data.id}).then(res=>{
      if (res.success) {
        this.setData({
          consigneeName:res.data.consigneeName,
          mobile:res.data.mobile,
          address:res.data.address,
          isDefault:res.data.isDefault==1?true:false,
          region: [replaceAddress2(res.data.province), replaceAddress2(res.data.city), replaceAddress2(res.data.county)],
        })
      }
    })
  },
  //地区选择改变
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  /**输入框失焦修改data值 */
  blurInput:function(e){
    if (this.data[e.currentTarget.dataset.key] != e.detail.value) {
      this.setData({
        [e.currentTarget.dataset.key]:e.detail.value
      })
    }
  },
  switchChange:function(e){
    this.setData({
      isDefault:e.detail.value
    })
  },
  /**验证输入 */
  verification:function(e){
    if (!/^(?:[\u4e00-\u9fa5·]{2,16})$/.test(this.data.consigneeName)) {
      return '姓名格式错误'
    }
    if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.data.mobile)) {
      return '手机号格式错误'
    }
    if (!this.data.address||this.data.length<4) {
      return '请输入详细地址'
    }
    let test = /\s+/g
    if (test.test(this.data.address)) {
      return '详细地址不能含有空格'
    }
  },
  /**提交 */
  submitadd:function(){
    let str = this.verification()
    
    if (str) {
      Toast.fail(str)
      return false
    }
    // console.log('this.data',replaceAddress(this.data.region[0]));

    let data = {
      data:{
        id:this.data.id?this.data.id:null,
        address: this.data.address,
        city: replaceAddress(this.data.region[1]),
        consigneeName: this.data.consigneeName,
        county: replaceAddress(this.data.region[2]),
        isDefault:this.data.isDefault?1:0,
        mobile: this.data.mobile,
        province: replaceAddress(this.data.region[0]),
      }
    }
    wx.showLoading({
      title: '保存中',
      mask:true
    })
    addresssaveOrUpdate(data).then(res=>{
      wx.hideLoading()
      let _this = this;
      if (res.success) {
        let text = '添加地址成功'
        if (this.data.type!='add') {
          text = '修改地址成功'
        }
        wx.setStorageSync('addressId', res.data)
        wx.showToast({
          title:text,
          icon:'success',
          duration:2000,
          complete:()=>{
            console.log('Number(_this.data.delNum)',Number(_this.data.delNum));
            wx.navigateBack({
            delta: Number(_this.data.delNum)
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})
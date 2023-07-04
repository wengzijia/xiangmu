import { getCurrentUserInfo,refereeUserList,refereeMonthList,saveUserExtractLog } from "../../../api/orderApi.js";
//获取应用实例
const app = getApp()
//frozenMoney:???-cash待提现
Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    user:[],
    profit:[],
    refereeOrder:{},
    currentTab:1,
    date:'2021',
    money:'',
    totalAmount:0,//
    orderCount:0,//订单总数
    totalMoney:0,//累计金额
    catchMoney:0,//待提现金额
    registCount:0,//下单数
    registTotalMoney:0,//总额
    active:999,
    extractTotal:0
  }, 
  //tabs切换
  tabsCrount: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  showInfo:function (e) {
    if (this.data.active==e.currentTarget.dataset.index) {
      this.setData({
        active:999
      })
    }else{
      this.setData({
        active:e.currentTarget.dataset.index
      })
    }
  },
  getUserProfile(){
    if (app.globalData.userInfo.nickName!='微信用户') {
      wx.navigateTo({
        url: 'recommendCode/index'
      })
    }else{
      wx.getUserProfile({
        desc: '用于生成推荐二维码', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          app.globalData.userInfo = res.userInfo
          wx.navigateTo({
            url: 'recommendCode/index'
          })
        },
        fail:(err)=>{
          wx.navigateTo({
            url: 'recommendCode/index'
          })
        }
      })
    }
  
  },
  // withdrawal:function(e){
  //   if (this.data.money>0) {
  //     saveUserExtractLog({data:{'money':this.data.money}}).then(res=>{
  //       if (res.message=='没有账号信息') {
  //         wx.showModal({
  //           title: '提示',
  //           confirmText:'去设置',
  //           content: '您还未设置收款账户',
  //           success: function (res) {
  //             if (res.confirm) {  
  //               wx.navigateTo({
  //                 url: '../settings/collection/index'
  //               })
  //             } else {   
  //               console.log('点击取消回调')
  //             }
  //           }
  //         })
  //       }
  //       if (res.success) {
  //         wx.showModal({
  //           title: '温馨提醒',
  //           showCancel:false,//隐藏取消按钮
  //           content: '提现申请提交成功，需财务审核。\r\n预计2~3个工作日到账~',
  //           success: function (res) {
  //             // if (res.confirm) {  
  //             //   //   wx.hideLoading()
  //             //   console.log('点击确认回调')
  //             // } else {   
  //             //   console.log('点击取消回调')
  //             // }
  //           }
  //         })
  //       }else{
  //         wx.showToast({
  //           title: res.message,
  //           icon: 'error',
  //           duration: 2000
  //         })
  //       }
  //       this.getUser()
  //       this.setData({
  //         money:''
  //       })
  //     })
  //   }else{
  //     wx.showModal({
  //       title: '温馨提醒',
  //       showCancel:false,//隐藏取消按钮
  //       content: '请填写提现金额',
  //       success: function (res) {
  //         // if (res.confirm) {  
  //           //   wx.hideLoading()
  //           // console.log('点击确认回调')
  //         // } else {   
  //           // console.log('点击取消回调')
  //         // }
  //       }
  //     })
  //   }
    
    
  // },
  onLoad:function () {
    this.getUser()
  },
  getUser:function(){
    //获取用户信息
    getCurrentUserInfo().then(res => {
      this.setData({
        userInfo:res.data
      }) 
      this.getProfit()
    }).then(() => {
      //推荐用户列表
      refereeUserList().then(res => {
        this.setData({
          user:res.data,
          registCount:this.toInteger(res.data.map(item=>{return item.orderCount*1}).reduce((prev,curr)=>{return prev*1 + curr*1},0))/100,
          registTotalMoney:this.toInteger(res.data.map(item=>{return item.totalAmount*1}).reduce((prev,curr)=>{return prev*1 + curr*1},0))/100
        })
      })      
    })
  },
  //要提现的金额
  withdrawalMoney:function(e){
    var val = e.detail.value;
    if (val*1>this.data.userInfo.cash*1) {
      val = this.data.userInfo.cash
    }
    this.setData({
      money: val
    });
  },
  //收益列表
  getProfit:function(){
      refereeMonthList({data:this.data.date*1}).then(res =>{
        this.setData({
          // profit:res.data.map(item =>{ item.dayCount.map(e=>{ e.day = e.day.slice(0,10); e.weight =  this.toInteger(e.weight) / 100; return e});return item}),
          profit:res.data.map(item =>{ item.dayCount.map(e=>{ e.day = e.day.slice(0,10); e.weight =  e.weight; return e});return item}),
          totalAmount:this.toInteger(res.data.map(item=>{return item.totalAmount*1}).reduce((prev,curr)=>{return prev*1 + curr*1},0))/100,
          orderCount:this.toInteger(res.data.map(item=>{return item.orderCount*1}).reduce((prev,curr)=>{return prev*1 + curr*1},0))/100,
        })
        this.setData({
          extractTotal:(this.toInteger(this.data.totalAmount)-this.toInteger(this.data.userInfo.cash))/100
        })
      })
  },
  /**
   *把数字*100转换成整数
    */
    toInteger:function(a){
    if (a && String(a).indexOf(".") + 1) {
        return Number((a+'00').slice(0,a.toString().indexOf('.')+3).replace(".",""))
      } else {
        return Number((a+'00'))
      }
  },
  explain:function(e){
    wx.navigateTo({
      url: '../document/index'
     })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    this.getUser()
  },
  getDetails:function (e) {
    //跳转到详情页
    wx.navigateTo({
     url: 'recommendDetails/index?data=' + e.currentTarget.dataset.mobile
    })
  },
  History:function(e){
    
    wx.navigateTo({
      url: 'withdrawalHistrys/index'
     })
  },
  setCode:function(e){

    wx.navigateTo({
      url: 'recommendCode/index'
    })
  }

})

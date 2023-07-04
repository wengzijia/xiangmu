//index.js
import { countDiscount, listAllDiscount } from "../../../api/orderApi.js";
//获取应用实例
const app = getApp()

Page({
  onShow() {
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    month: [],
    rebate: [],
    date: '2021',
    order: {},
    rebateOrder: {},
    currentTab: 0,
    active: 999,
    saveTotal: 0,
    rebatesaveTotal: 0,
    returnTotal: 0,
    modal: {
      show: false,//modal是否显示，默认false
      contentText: '',
      icon: '',
      iconSize: '',
      image: '',
      imageSize: ''
    }

  },
  //自定义弹窗组件
  modalFun: function ({ contentText, icon, iconSize, image, imageSize, time }) {
    var than = this;
    this.setData({
      modal: {
        show: true,
        contentText, icon, iconSize, image, imageSize
      }
    })
    setTimeout(() => {
      than.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
      })
    }, time ? time : 2000);
  },
  onLoad: function (route) {
    this.getData(route)
  },
  //tabs切换
  tabsCrount: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
        active: 999
      })
    }
  },
  getData: function (route) {
    // countDiscount({
    //   data: this.data.date,
    //   type: 'rebate'
    // }).then(res => {
    //   this.setData({
    //     rebateOrder: res.data
    //   })
    // })
    countDiscount({
      data: this.data.date,
      type: 'repaid'
    }).then(res => {
      this.setData({
        order: res.data
      })
    })
    /**
     * type: 'rebate'返利'repaid':省钱
     */
    // listAllDiscount({
    //   data: this.data.date,
    //   type: 'rebate'
    // }).then(res => {
    //   //如果从抽奖页过来，展开对应列
    //   if (route.sn) {
    //     try {
    //       var drawList = JSON.parse(wx.getStorageSync('drawSn'))
    //       if (drawList) {
    //         res.data=res.data.map((item, index) => { 
    //           item.children.map(g => { 
    //             if (drawList.indexOf(g.orderSn)!=-1) { 
    //               g.red = true ,
    //               this.setData({
    //                 active:index
    //               })
    //             }; 
    //             return g 
    //           }); 
    //           return item
    //         })
    //       }
    //     } catch (e) {
    //       // Do something when catch error
    //     }
    //   }
    //   let e = res.data
    //   e = res.data.map(item => { item.children.map(e => { e.weight = this.toInteger(e.weight ) / 100; return e }); return item })
    //   let arr = []
    //   res.data.map(item => {
    //     arr = arr.concat(item.children)
    //   })
    //   arr = arr.map(b => {
    //     if (b.status == 1 || b.status == 2) {
    //       return b.amount * 100
    //     }
    //   })
    //   let z = arr.reduce((prev, curr) => { return prev + curr }, 0)
    //   this.setData({
    //     rebate: e,
    //     rebatesaveTotal: this.toInteger(res.data.map(item => { return item.data.amount }).reduce((prev, curr) => { return prev + curr }, 0))/100,
    //     returnTotal: this.toInteger(z) / 100
    //   })
    // })
    listAllDiscount({
      data: this.data.date,
      type: 'repaid'
    }).then(res => {
      this.setData({
        month: res.data,
        saveTotal: this.toInteger(res.data.map(item => { return item.data.orderDiscountAmount }).reduce((prev, curr) => { return prev + curr }, 0))/100
      })
    })
  },/**
  *把数字*100转换成整数
   */
   toInteger:function(a){
   return Number((a+'00').slice(0,a.toString().indexOf('.')+3).replace(".",""))
 },
  /**
   * 修改年份
   * @param {*} e 
   */
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    this.getData()
  },
  /**
   * 点击显示订单编号
   * @param {*} e 
   */
  viewPO: function (e) {
    let array = this.data.rebate
    if (array[e.currentTarget.dataset.index].children[e.currentTarget.dataset.i].checked) {
      array[e.currentTarget.dataset.index].children[e.currentTarget.dataset.i].checked = false;
      this.setData({
        rebate: array
      })
    } else {
      array[e.currentTarget.dataset.index].children = array[e.currentTarget.dataset.index].children.map(e => { e.checked = false; return e });
      array[e.currentTarget.dataset.index].children[e.currentTarget.dataset.i].checked = true;
      this.setData({
        rebate: array
      })
    }

  },
  /**
   * 展开月份所有订单
   * @param {*} e 
   */
  showInfo(e) {
    // let arraya = this.data.rebate
    // arraya[e.currentTarget.dataset.index].children = arraya[e.currentTarget.dataset.index].children.map(item => { item.checked = false; return item });
    if (this.data.active == e.currentTarget.dataset.index) {
      this.setData({
        active: 999,
        // rebate: arraya
      })
    } else {
      this.setData({
        active: e.currentTarget.dataset.index
      })
    }
  }
})

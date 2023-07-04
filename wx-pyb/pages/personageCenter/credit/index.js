// pages/personageCenter/credit/index.js
import { getUserCreditPurchaseMonthlyStatementList,getCurrentTimeMillis,getUserCreditPurchaseDetail } from "../../../api/userApi.js";
import { getUserCreditPurchaseAllList } from "../../../api/credit";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[{name:'近期还款',id:0},{name:'全部账单',id:1}],
      creditId:0,
      surplus:'***',
      used:'***',
      total:'***',
      orderList:[],
      showPopup:false,//弹出层显示
      showDate:'2022年5月',
      screenDate:'',
      today: new Date().getTime(),
      currentDate: new Date().getTime(),
      minDate: new Date('2022-05-16').getTime(),
      maxDate: new Date().getTime(),
      amount:'***',
      billList:[],
      repayment:false,//还款按钮
      btnText:'立即',
      storage: 0, // 备用金
      status: 0, // 是否有权限
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      surplus:Number(app.globalData.credit.surplusAmount).toFixed(2),
      used:(app.globalData.credit.totalAmount - app.globalData.credit.surplusAmount).toFixed(2),
      total:Number(app.globalData.credit.totalAmount).toFixed(2),
      screenDate:this.formatTime(new Date().getTime())[1],
      showDate:this.formatTime(new Date().getTime())[0]
    })
    // this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    getCurrentTimeMillis().then(res=>{
      if (res.success) {
          this.setData({
            maxDate:res.data,
            today:res.data
          })
      }
      this.getMonthlyStatementList()
      this.getUserCredit()
    })
  },
  //下拉刷新
  onPullDownRefresh(){
    this.getMonthlyStatementList()
    this.getUserCredit()
  },
  getUserCredit(){
    //查询用户信用额度
    getUserCreditPurchaseDetail().then(res=>{
      if (res.success){
        if (res.data && Object.keys(res.data).length > 0){
          this.setData({
            surplus:Number(res.data.surplusAmount).toFixed(2),
            storage: Number(res.data.storageAmount).toFixed(2),
            used:(res.data.totalAmount - res.data.surplusAmount).toFixed(2),
            total:Number(res.data.totalAmount).toFixed(2),
            minDate:new Date(res.data.createTime).getTime(),
            status: res.data.status
          })
          this.getOrderList()
        }
      }else{
        app.globalData.credit = null
        this.setData({
          credit:false
        })
      }
    })
  },
  //获取月账单
  getMonthlyStatementList(){
    getUserCreditPurchaseMonthlyStatementList({}).then(res=>{
      if (res.success) {
        this.setData({
          billList:res.data.map(item=>{
            item.surplus = ((~~(item.amount*1000) - ~~(item.repaymentAmount*1000)- ~~(item.rebackAmount*1000))/1000).toFixed(2)
            item.month += 1
            if (item.month==13) {
              item.month = 1
              item.year += 1
            }
            // item.payStatus 0未还款 1已还款 2待还款 3已经超时，转到下个月账单
            if (item.payStatus==3) {
              item.overdue = '已转下月账单'
              item.disabled = true
            }
            // else{
            //   let day = Number(this.data.today) - Number(new Date(`${item.year}/${item.month}/15`).getTime())
            //   if (day>0) {
            //       if (new Date(this.data.today).getDate()!=15) {
            //         item.overdue = `逾期${Math.floor(day/1000/60/60/24)}天`
            //       } else {
            //         item.overdue = null
            //       }
            //   } else {
            //     item.overdue = null
            //   }
            // }
            return item
          }),
        })
        if (res.data[0]&&res.data[0].payStatus==2||res.data[0]&&res.data[0].payStatus==0) {
          this.setData({
            repayment:true
          })
          if (res.data[1]&&res.data[1].payStatus!==2&&res.data[0]&&res.data[0].payStatus==0) {
            this.setData({
              btnText:'提前'
            })
          }
        }
      }
    })
  },
  //触底加载上个月
  scrolltolower(){
    let year = new Date(this.data.screenDate).getFullYear()
    let month = new Date(this.data.screenDate).getMonth()
    if (month==0) {
      month = 12
      year-=1
    }
    if (month<new Date(this.data.minDate).getMonth()&&year==new Date(this.data.minDate).getFullYear()) {
      return
    }
    this.setData({
      screenDate:this.formatTime(new Date(year+'-'+month).getTime())[1]
    })
    this.getOrderList(1)
  },
  /**获取信用购订单 */
  getOrderList(e){
    getUserCreditPurchaseAllList({customDate:this.data.screenDate}).then(res=>{
      if (res.success) {
        let num = res.data.map(item=>{return (item.cancelCreditPurchaseLogs&&item.cancelCreditPurchaseLogs.length>0?0:item.amount*(item.changeType == 3?-1:1))}).reduce((pre,next)=>{pre+=next;return pre;}, 0)
        let obj = {
          total:num.toFixed(2),
          list:res.data,
          month:this.formatTime(new Date(this.data.screenDate).getTime())[0]
        }
        let arr = this.data.orderList
        let flag = true 
        arr.map(item=>{
          if (item.month==obj.month) {
            flag = false
          }
        })
        if (flag&&obj.list.length>0) {
          arr.push(obj)
          this.setData({
            orderList:arr
          })
        }
        
      } else {
        // 请求失败恢复月份
        if (e) {
          let year = new Date(this.data.screenDate).getFullYear()
          let month = new Date(this.data.screenDate).getMonth()+2
          if (month>12) {
            month = 1
            year+=1
          }
          this.setData({
            screenDate:this.formatTime(new Date(year+'-'+month).getTime())[1]
          })
        }
      }
    })
  },
  //跳转到订单详情
  toOrderDetail(e){
    if (!e.currentTarget.dataset.sn) {
      return
    }
    if (e.currentTarget.dataset.type=='1') {
      wx.navigateTo({
        url:`../allSingleOrder/orderDetails/index?data=${e.currentTarget.dataset.sn}`
      })
    }else{
      wx.navigateTo({
        url:`../allProcessOrder/orderDetails/index?data=${e.currentTarget.dataset.sn}`
      })
    }
  },
  showPopup(){
    this.setData({
      showPopup:true
    })
  },
  //关闭弹出层
  onClose(){
    this.setData({
      showPopup:false
    })
  },
  onInput(e){
    let time = this.formatTime(e.detail)[0]
    this.setData({
      orderList:[],
      currentDate:e.detail,
      showDate:time,
      screenDate:this.formatTime(e.detail)[1]
    })
    this.getOrderList()
    this.onClose()
  },
  formatTime(timeStamp){
    let time = new Date(timeStamp)
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    if (month<10) {
      month = '0'+month
    }
    return [year + '年' + month + '月',year + '-' + month]
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  //切换列表
  detailTap(e) {
    let _this = this;
    console.log(e);
    let id = e.currentTarget.dataset.idx;
    if (this.data.detailTap == id) {
      return;
    }
    _this.setData({
      creditId: id,
    })
  },
  //跳转换款页面
  bindPay(){
    let no,amount;
    if (this.data.billList[1]&&this.data.billList[1].payStatus==2) {
      no = this.data.billList[1].monthlyStatementNo
      amount = ((~~(this.data.billList[1].amount*1000) - ~~(this.data.billList[1].rebackAmount *1000) - ~~(this.data.billList[1].repaymentAmount*1000))/1000).toFixed(2)
    }else{
      no = this.data.billList[0].monthlyStatementNo
      amount = ((~~(this.data.billList[0].amount*1000) - ~~(this.data.billList[0].rebackAmount *1000) - ~~(this.data.billList[0].repaymentAmount*1000))/1000).toFixed(2)
    }
    // console.log('amount', amount)
    wx.navigateTo({
      url: `../../Confirm/Confirmcredit/index?no=${no}&amount=${amount}`,
    })
  }
})
import { listUserConsume, gainTopUpDetail } from "../../../../api/userApi.js";
import Toast from '@vant/weapp/toast/toast';
import { togetherEditionBalancePay } from "../../../../api/credit.js";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    option: [],
    option1: [
      { text: '全部', value: null },
      { text: '补扣', value: 5 },
      { text: '扣除', value: 7 },
      { text: '退还', value: 4 },
    ],
    option2: [
      { text: '全部', value: null },
      { text: '充值中', value: 0 },
      { text: '充值成功', value: 1 },
      { text: '充值失败', value: 2 },
    ],
    value: null,
    siftingOptions: ['近半年', '近7天', '近1个月', '自定义时间'],
    siftingBtn: '近半年',
    time: [],
    timeStatus: 'start',
    currentDate: new Date().getTime(),
    minDate: new Date().getTime()-(180*24*60*60*1000), 
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    req:{
      startTime: null,
      endTime: null,
      type: null,
      pageSize: 10,
      pageNumber: 1
    },
    endTimeStr: '',
    startTimeStr: '',
    orderList: [],
    showLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let time = new Date()
    let endTimeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
    time = new Date(time.getTime() - (180*24*60*60*1000))
    let startTimeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
    let timeArr = []
    timeArr.push(startTimeStr)
    timeArr.push(endTimeStr)
    this.setData({
      time: timeArr,
      endTimeStr: endTimeStr,
      startTimeStr: startTimeStr,
      option: this.data.option1
    })
    this.getOrders(this.data.req)
    app.saveReport({"actionId": 2,"channel":701000})
  },
  getOrders(req) {
    if (this.data.active ==0) {
      listUserConsume(req).then(res => {
        if (res.data.length == 0) {
          this.setData({
            orderList: [],
            total: 0
          })
          return
        }
        let orderList = this.data.orderList.concat(this.toProcessTime(res.data[0].list))
        this.setData({
          orderList: this._toFixed(orderList),
          total: res.data[0].sumConsume.toFixed(2)
        })
      })
    } else {
      gainTopUpDetail(req).then(res => {
        let orderList = this.data.orderList.concat(this.toProcessTime(res.data))
        
        this.setData({
          orderList: this._toFixed(orderList)
        })
      })
    }
  },
  _toFixed(orderList) {
    return orderList.map(e => {
      if (e.userMoney) {
        e.userMoney = Number(e.userMoney).toFixed(2)
      } else {
        e.userMoney = '0.00'
      }
      if (e.payPoints) {
        e.payPoints = Number(e.payPoints).toFixed(2)
      } else {
        e.payPoints = '0.00'
      }
      if (e.donateMoney) {
        e.donateMoney = Number(e.donateMoney).toFixed(2)
      } else {
        e.donateMoney = '0.00'
      }
      return e
    })
  },
  toProcessTime(data) {
    data = data.map(item => {
      let time
      if (item.changeTime) {
        time = new Date(item.changeTime*1000)
        let year = time.getFullYear()
        let month = time.getMonth()+1
        let date = time.getDate()
        let hours = time.getHours()
        let mintes = time.getMinutes()
        let seconds = time.getSeconds()
        item.changeTime = `${year}-${month<10?'0':''}${month}-${date<10?'0':''}${date} ${hours<10?'0':''}${hours}:${mintes<10?'0':''}${mintes}:${seconds<10?'0':''}${seconds}`
        
      }
      if (item.alreadyTime) {
        time = new Date(item.alreadyTime*1000)
        let year = time.getFullYear()
        let month = time.getMonth()+1
        let date = time.getDate()
        let hours = time.getHours()
        let mintes = time.getMinutes()
        let seconds = time.getSeconds()
        item.alreadyTime = `${year}-${month<10?'0':''}${month}-${date<10?'0':''}${date} ${hours<10?'0':''}${hours}:${mintes<10?'0':''}${mintes}:${seconds<10?'0':''}${seconds}`
      }
        return item
    })
    
    return data
  },
  onChange(event) {
    if (event.detail.index) {
      this.setData({
        option: this.data.option2
      })
    } else {
      this.setData({
        option: this.data.option1
      })
    }
    this.setData({
      active: event.detail.index,
      value: null,
      orderList: []
    })
    this.data.req.type = null
    this.data.req.pageNumber = 1
    this.getOrders(this.data.req)
  },
  changeOption(e) {
    this.data.req.type = e.detail
    this.data.orderList = []
    this.data.req.pageNumber = 1
    this.getOrders(this.data.req)
  },
  onInput(event) {
    if (this.data.siftingBtn != '自定义时间') {
      return
    }
    console.log('onInput');
    let time = new Date(event.detail)
    let timeData = this.data.time
    time = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
    if (this.data.timeStatus == 'start') {
      timeData[0] = time
    } else {
      timeData[1] = time
    }
    this.setData({
      time: timeData
    });
  },
  clickRadio(e) {
    console.log(e);
    let _data = e.currentTarget.dataset
    this.setData({
      currentDate: new Date(_data.val == 'start' ? this.data.time[0] : this.data.time[1]).getTime()
    })
    if(_data.key == 'siftingBtn' && _data.val != '自定义时间') {
      let time = new Date()
      let endTimeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
      let startTimeStr = ''
      if(_data.val == '近半年') {
        time = new Date(time.getTime() - (180*24*60*60*1000))
       startTimeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
      } else if (_data.val == '近7天') {
        time = new Date(time.getTime() - (7*24*60*60*1000))
        startTimeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
      } else if (_data.val == '近1个月') {
        time = new Date(time.getTime() - (30*24*60*60*1000))
        startTimeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
      }
      time = [startTimeStr, endTimeStr]
      
      this.setData({
        time: time,
      })
    }

    this.setData({
      [_data.key]: _data.val,
      // timeStatus: 'start'
    })
  },
  reset(){
    let time = [this.data.startTimeStr, this.data.endTimeStr]
    this.setData({
      time: time,
      siftingBtn: '自定义时间',
      timeStatus: 'start',
      currentDate: new Date(this.data.startTimeStr).getTime()
    })
    console.log('this.data.startTimeStr', this.data.time, this.data.currentDate);
  },
  onConfirm() {
    console.log('time', this.data.time[0]+' 00:00:00', this.data.time[1]+' 23:59:59');
    this.data.req.startTime = new Date(this.data.time[0]+' 00:00:00').getTime()/1000
    this.data.req.endTime = new Date(this.data.time[1]+' 23:59:59').getTime()/1000
    if (this.data.req.startTime > this.data.req.endTime) {
      // Toast.fi({contentText: '起始时间不可大于结束时间', time: 1500})
      Toast.fail({message:'起始时间不可大于结束时间',zIndex:1000});
      return
    }
    this.setData({
      startTimeStr: this.data.time[0],
      endTimeStr: this.data.time[1],
      orderList: [],
    })
    this.selectComponent('#dropdownItem').toggle();
    this.data.req.pageNumber = 1
    this.getOrders(this.data.req)
  },
  modalFun({contentText,icon,iconSize,image,imageSize,time}){
    var _this = this;
    this.setData({
      modal: {
        show: true,
        contentText,icon,iconSize,image,imageSize
      }
    })
    setTimeout(() => {
      _this.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
    }) }, time?time:2000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.showLoading) {
      return
    }
    this.data.showLoading = true

    this.data.req.pageNumber++
    this.getOrders(this.data.req)
    console.log('ssss');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
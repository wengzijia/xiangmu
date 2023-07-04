
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  // options: {
  //   addGlobalClass: true, // 是否引用全局样式
  // },
  data: {
    endTimeStr: '',
    startTimeStr: '',
    option: [
      { text: '全部', value: null },
      { text: '普通发票', value: 0 },
      { text: '专用发票', value: 1 },
    ],
    value: null, 
    siftingOptions: ['近半年', '近7天', '近1个月', '自定义时间'],
    siftingBtn: '近半年',
    time: [],
    timeStatus: 'start',
    thatDay: new Date().getDate(),
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
    timeDate: []
  },
  // 进入页面布局时
  attached() {
    this.refreshDate()
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
      option: this.data.option
    })
    console.log('创建组件', {
      endTimeStr: endTimeStr,
      startTimeStr: startTimeStr,
      option: this.data.option});
    this.triggerEvent('onSeach', { endTimeStr: endTimeStr, startTimeStr: startTimeStr, type: null})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      if (this.data.siftingBtn != '自定义时间') {
        return
      }
      console.log('onInput', event);
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
    refreshDate (){
      let date = new Date().getTime()
      let timeStr = ''
      let time = new Date(date-(180*24*60*60*1000))
      let timeDate = []
      timeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
      timeDate.push(timeStr) // 180 天 半年
      time = new Date(date-(7*24*60*60*1000))
      timeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
      timeDate.push(timeStr) // 7 天 一个星期
      time = new Date(date-(30*24*60*60*1000))
      timeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
      timeDate.push(timeStr) // 30 天 一个月
      console.log('refreshDate', timeDate);
      this.setData({
        timeDate: timeDate
      })
    },
    clickRadio(e) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      let _data = e.currentTarget.dataset
      console.log('this.data.time', this.data.time, '_data.val', _data.val, 'this.data.currentDate', this.data.currentDate);
      this.setData({ // 时间选择器 赋值
        currentDate: new Date(_data.val == 'start' ? this.data.time[0] : this.data.time[1]).getTime()
      })
      if(_data.key == 'siftingBtn' && _data.val != '自定义时间') {
        let time = new Date()
        if (time.getDate() != this.data.thatDay) { // 过了转钟，重新记录 筛选时间
          this.refreshDate()
        }
        let endTimeStr = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
        let startTimeStr = ''
        if(_data.val == '近半年') {
          startTimeStr = this.data.timeDate[0]
        } else if (_data.val == '近7天') {
          startTimeStr = this.data.timeDate[1]
        } else if (_data.val == '近1个月') {
          startTimeStr = this.data.timeDate[2]
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
      wx.hideLoading()
    },
    reset(){
      let time = [this.data.startTimeStr, this.data.endTimeStr]
      this.setData({
        time: time,
        siftingBtn: '自定义时间',
        timeStatus: 'start',
        currentDate: new Date(this.data.startTimeStr).getTime()
      })
    },
    onConfirm() {
      console.log('time', this.data.time[0]+' 00:00:00', this.data.time[1]+' 23:59:59');
      this.data.req.startTime = new Date(this.data.time[0]+' 00:00:00').getTime()/1000
      this.data.req.endTime = new Date(this.data.time[1]+' 23:59:59').getTime()/1000
      if (this.data.req.startTime > this.data.req.endTime) {
        wx.showToast({title: '起始时间不可大于结束时间',icon: 'none'})
        return
      }
      this.setData({
        startTimeStr: this.data.time[0],
        endTimeStr: this.data.time[1],
      })
      this.selectComponent('#dropdownItem').toggle();
      this.data.req.pageNumber = 1
      console.log('onSeach-', { endTimeStr: this.data.time[1], startTimeStr: this.data.time[0], type: this.data.req.type});
      this.triggerEvent('onSeach', { endTimeStr: this.data.time[1], startTimeStr: this.data.time[0], type: this.data.req.type})
    },
    changeOption(e) {
      this.data.req.type = e.detail
      this.data.req.pageNumber = 1
      console.log('onSeach--', { endTimeStr: this.data.time[1], startTimeStr: this.data.time[0], type: this.data.req.type});
      this.triggerEvent('onSeach', { endTimeStr: this.data.time[1], startTimeStr: this.data.time[0], type: this.data.req.type})
    },
  }
})

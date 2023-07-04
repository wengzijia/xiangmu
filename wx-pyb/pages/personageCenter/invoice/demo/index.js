// pages/personageCenter/invoice/demo/index.js
Component({
  /**
   * 组件的属性列表
   */  
  options: {
    addGlobalClass: true, // 是否引用全局样式
  },
  properties: {
    item: {
      type: Object,
      value:() => {
        return {}
      }
    },
    _index:{
      type: Number,
      value: 0
    },
    type: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgBaseUrl:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
    current: '',
    urls: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImg:function(e){
      // console.log('previewImg',e);
      wx.previewImage({
        current: this.data.imgBaseUrl+e.currentTarget.dataset.url, // 当前显示图片的http链接
        urls: [this.data.imgBaseUrl+e.currentTarget.dataset.url] // 需要预览的图片http链接列表
      })
    },
    //跳转到订单详情
    getOrderDetails(e) {
      wx.navigateTo({
        url: './details/index?orderNo=' + e.currentTarget.dataset.sn + '&type=' + this.data.type
      })
    },
  }
})

/**
 * 组件调用
 *  <paySelect bindonSelect='getSearchValue' list='{{creditActions}}'></paySelect>
 * 传入参数
 * list：选择列表
 * 回调事件
 * onSelect
 * 回调事件参数
 * inputVal
 * 
 */

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: { // 弹窗选项
      type: Array,
      value: ()=> []
    },
    show: { // 是否显示支付弹窗
      type: Boolean,
      default: false
    },
    bitSubscription: { // 是否打开订阅弹窗
      type: Boolean,
      default: true
    }
  },
  data: {
  },
  methods:{
    onClick(e){
      let item = e.currentTarget.dataset.item
      if (item.status == 0 && item.name == '余额支付') {
        wx.navigateTo({
          url: '/pages/personageCenter/stored/index'
        })
      } else {
        this.triggerEvent('onSelect', e)
      }
    },
    cancel(e) {
      this.triggerEvent('cancel', e)
    }
  },
  created(){
  
  }
})
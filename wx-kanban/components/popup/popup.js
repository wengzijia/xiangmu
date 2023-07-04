// components/popup.js
Component({
  // options:{
  //   addGlobalClass:true  // 解决子组件中全局样式不生效问题
  // },
  /**
   * 组件的属性列表
   */
  properties: {
    // 接受父组件传递的变量
    isDoneProHint: false, // 是否显示完成生产前置信息提示弹窗
    isAnoMsgHint: false, // 异常信息提示弹窗
    doneProHintData:null, // 完成生产提示数据
    anoMsgHintData:null // 异常信息提示数据
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 子组件自身声明的变量
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 完成生产前置信息提示弹窗关闭
    doneProHintClose(e) {
      this.triggerEvent('doneProHintClose');
    },
    // 异常信息提示弹窗关闭
    anoMsgHintClose(e) {
      this.triggerEvent('anoMsgHintClose');
    },
    // 完成生产前置信息提示弹窗确认
    doneProHintAffirm(e) {
      this.triggerEvent('doneProHintAffirm');
    },
    // 异常信息提示弹窗确认
    anoMsgHintAffirm(e) {
      this.triggerEvent('anoMsgHintAffirm');
    }
  }
})
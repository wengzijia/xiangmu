// 二维码de二维码刷新
export default {
  data() {
    return {};
  },
  methods: {
    //刷新支付二维码
    refreshCode() {
      // 当在http页面，大于10块不展示二维码，https正常展示
      if (process.env.VUE_APP_MODE === 'test' && this.activeMoney > 10) {
        this.isCodeLayer = true;
        return;
      }
      this.isCodeLayer = false;
      this.stopPolling();
    },
    // 5分钟后二维码失效，停止轮询，刷新继续
    stopPolling() {
      let _this = this;
      clearTimeout(this.aliTimer);
      _this.getOrderInfo(true);
      _this.aliTimer = setTimeout(() => {
        _this.isCodeLayer = true;
      }, 1000 * 300);
    }
  }
};

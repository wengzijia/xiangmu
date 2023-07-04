//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
  },
  onShow(){
    app.saveReport({
        actionId:1,
        channel: 101000
    })
  }
});

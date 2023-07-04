const { orderSubscribeMessage, listTemplateId } = require("../api/cartApi");
import {SUBSCRIBE_TYPE} from "./request.js"
const subscribeNews = (id) => {
  listTemplateId().then(res => {
    if (res.success) {
      let ar = []
      for (const key in res.data) {
        ar.push(res.data[key])
      }
      wx.requestSubscribeMessage({
        tmplIds: ar,
        success (res2) {
          let obj = {
            orderGoodsId: id,
            sendTypes: [],
            miniprogramState: SUBSCRIBE_TYPE
          }
          for (const key2 in res2) {
            if(res2[key2] != "accept") {
              continue
            }
            for (const key in res.data) {
              if (res.data[key] == key2) {
                obj.sendTypes.push(Number(key))
              }
            }
          }

          if (obj.sendTypes.length) {
            orderSubscribeMessage(obj).then(res2 => {
              if (!res2.success) {
                console.log('订单绑定订阅消息失败');
              }else {
                wx.showToast({
                  title: '消息通知订阅成功,请再次点击上传文件',
                  icon:'none',
                })
              }
            }).catch(err => {
              console.log('订单绑定订阅消息失败',err);
            })
          }
        }
      }) 
    }
  })
}

module.exports = {
  subscribeNews
}

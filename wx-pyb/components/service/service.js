import {IMG_BASE_URL} from '../../utils/request'
const app = getApp()
Component({
  
  data: {
    ballBottom: 0, 
    ballRight: 0, 
    screenHeight: 0, 
    screenWidth: 0, 
    imgBaseUrl:IMG_BASE_URL
  },

  methods: {
    ballMoveEvent: function (e) { 
      // console.log('我被拖动了....') 
      var touchs = e.touches[0]; 
      var clientX = touchs.clientX; 
      var clientY = touchs.clientY; 
      // console.log('clientX: ' + clientX) 
      // console.log('clientY: ' + clientY) 
    //  console.log('eeeeeeeeeeeee',e)
    //防止坐标越界,view宽高的一般 
      if (clientX < 30) return; 
      if (clientX > this.data.screenWidth - 30) return; 
      if (this.data.screenHeight - clientY <= 30) return; 
      if (clientY <= 30) return; 
    
    //这里用right和bottom.所以需要将clientX clientY转换 
      var x = this.data.screenWidth - clientX - 30; 
      var y = this.data.screenHeight - clientY - 30; 
      // console.log('x: ' + clientX) 
      // console.log('y: ' + clientY) 
      this.setData({ 
       ballBottom: y, 
       ballRight: x 
      }); 
     }, 
     
    //点击事件 
     ballClickEvent: function () { 
      console.log('点击了....') 
      // this.triggerEvent('copyQQ')
      app.saveReport({ 
        "actionId": 1,
        "channel": 102000,
      })
      wx.openCustomerServiceChat({
        extInfo: {url: 'https://work.weixin.qq.com/kfid/kfcbb29ea176f2e805c'},
        corpId: 'ww55f7241e7c825586',
        success(res) {},
        fail(err){
          console.log('openCustomerServiceChaterr',err)
        }
      })

     } 
  },
  attached : function () { //获取屏幕宽高 
    // console.log('884848484')
    var _this = this; 
    wx.getSystemInfo({ 
     success: function (res) { 
      //  console.log('windowHeight',res)
      _this.setData({ 
       screenHeight: res.windowHeight, 
       screenWidth: res.windowWidth, 
      }); 
     } 
    }); 
   }
  

})
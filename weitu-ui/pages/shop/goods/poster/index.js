// pages/tool/cutter/download/poster/index.js
import {getSchemeDetailBySchemeId} from '../../../../api/shop'
import {getWeChatMiniReferralCode} from '../../../../api/user';
import {imageBaseUrl,accountInfo,staticFileBaseUrl} from '../../../../utils/request'
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        packInfo:{},
        userInfo: {},
        mobile:'',
        codeBase64:'',
        imageBaseUrl,
        designIndex:0,
        employeeInfo:{},
        thumbnail:'',
        posterImagePath:'',
        goodsImagePath:'',
        showShare: false,
        showLoading:true,
        loadingText:"获取数据中...",
        showSetTips:false,
        options: [
          {
            name: '微信好友',
            icon: staticFileBaseUrl+'/static/wxwt/iweitu/share/wx.png',
            openType:'share'
          },
          {
            name: '生成海报',
            icon:  staticFileBaseUrl+'/static/wxwt/iweitu/share/poster.png',
          }
         
        ],
       
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let _this = this;
        console.log('options',options)
      
        let {id} = options
      getSchemeDetailBySchemeId({id:id||446}).then(res=>{
        if(res.success&&res.data){
          res.data.designList[_this.data.designIndex].designGoods = res.data.designList[_this.data.designIndex].designGoods.map(e =>{
            let arr = e.composeName.split('_')
            if(arr){
              e.boxName = arr[arr.length-1]
            }
            return e
          })
          
          _this.setData({
            packInfo:res.data,
            thumbnail:JSON.parse( res.data.designList[_this.data.designIndex].goodsImg).secondThumbnail
          })
          _this.getWeChatMiniReferralCode();
        }
      })
    },
    getWeChatMiniReferralCode:function(){
      let _this = this;
      let {employeeInfo,cardInfo,userInfo} = app.globalData
      // if(false&&accountInfo.miniProgram.envVersion=='develop'){
      //   employeeInfo = {"userId":"89059","fullname":"兔兔精","mobile":"17344515793","enterpriseCode":"HGS000001","position":"管理员","wechatCode":"A123456","avatar":"qcxyztTest/wxwt/89059/20230114/53RSmxeP7f59610443a2f258937452ebd722bd41f082.png","enterpriseName":"兔兔有限公司","slogan":"加油加油","sellingPoint":"质量好，优惠多","description":null,"promotionalVideo":"qcxyztTest/wxwt/89059/20230114/vRTEvSDYlmXie7a41b969f80fc7c2dd7e69fbe71cea0.mp4"}
      //   userInfo = {
      //     id:89063,
      //     mobile:18903034902,
      //     fullname:'兔兔精'
      //   }
      // }
      console.log('employeeInfo',employeeInfo)
      if(employeeInfo.userId){
        _this.setData({
          employeeInfo,
          cardInfo,
          userInfo
        })
        let formData = {
          "avatarUrl":imageBaseUrl+employeeInfo.avatar,
          "envVersion":accountInfo.miniProgram.envVersion,
          "mobile": employeeInfo.mobile,
          "salesperson":employeeInfo.userId,
          "recommender":userInfo.id,
          "pageUrl":"pages/nameCard/index",
          "rests":_this.data.packInfo.id
      }
        getWeChatMiniReferralCode(formData).then(res=>{
          _this.setData({
            codeBase64:res
          })
        })
        // _this.onShareAppMessage = function(){
        //   return {
        //     title	:'向您推荐包装方案',
        //     path:'/pages/nameCard/index?recommender='+userInfo.id+'&salesperson='+employeeInfo.userId+'&packid='+_this.data.packInfo.id,
        //     imageUrl: _this.data.imageBaseUrl+_this.data.thumbnail
        //   }
        // }
      }else{
        // wx.navigateBack()
      }
      },
      setWatermark(){
        let _this = this;
      let packInfo = _this.data.packInfo
      if(!packInfo.designList){
        setTimeout(()=>{
          _this.setWatermark()
        },500)
        return 
      }
      let thumbnail = JSON.parse(packInfo.designList[_this.data.designIndex].goodsImg).secondThumbnail
        const query = wx.createSelectorQuery()
        query.select('#myCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas = res[0].node
            console.log('res',res)
            const ctx = canvas.getContext('2d')
            let img = canvas.createImage()
            const dpr = wx.getSystemInfoSync().pixelRatio
            console.log('dpr',dpr)
            let width = res[0].width*dpr;
            let height = res[0].height*dpr
            canvas.width = width
            canvas.height = height
            img.src = _this.data.imageBaseUrl+thumbnail
            img.onload = function(){
              ctx.drawImage(img, 0, 0, width, height);
              console.log('_this.data.employeeInfo.watermark',_this.data.employeeInfo)
              if(_this.data.employeeInfo.watermark){
                let watermarkImage = canvas.createImage()
                watermarkImage.src = _this.data.imageBaseUrl+_this.data.employeeInfo.watermark
                watermarkImage.onload = function(){
                  console.log('watermarkImage',watermarkImage.width)
                  let maxHeight = 50*dpr;
                  let watermarkWidth =  maxHeight/watermarkImage.height*watermarkImage.width
                  ctx.globalAlpha = 0.5
                  ctx.drawImage(watermarkImage, canvas.width / 2-watermarkWidth/2, canvas.height / 2-maxHeight/2, watermarkWidth,maxHeight);
                  _this.generateShareImg({canvas,dpr,width:canvas.width/dpr,height: canvas.height/dpr})
                }
              }else{
                let fontSize = 25*dpr;
                ctx.font =`normal bold ${fontSize}px Arial` 
                //水平对齐方式
                ctx.textAlign = "center";
                //垂直对齐方式
                ctx.textBaseline = "middle";
                ctx.fillStyle = 'rgba(61, 126, 255,.25)'
                ctx.fillText('微图 - WEITU', width/2, height/2) // 水印在画布的位置x，y轴
                _this.generateShareImg({canvas,dpr,width:width,height:height})
              }
            }
            console.log('img',img)
            // _this.setPoster()
            
          })
      },
      /**
       * 生成小程序分享图片
       * @param {*} param0 
       */
      generateShareImg({canvas,dpr,width,height}){
        let _this = this;
        setTimeout(()=>{
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width,
            height,
            destWidth:width*dpr,
            destHeight:height*dpr,
              canvas:canvas,
              success: function(res) {
                  var tempFilePath = res.tempFilePath;
                  _this.setData({
                    goodsImagePath: tempFilePath,
                  });
                  _this.setData({
                    showLoading:false,
                    showShare:true
                  })
                  _this.onShareAppMessage = ()=>{
                    return {
                      imageUrl:tempFilePath,
                       title: _this.data.packInfo.schemeName,
                       path:`/pages/nameCard/index?packid=${_this.data.packInfo.id}&salesperson=${_this.data.employeeInfo.id}&recommender=${_this.data.userInfo.id}`,
                    }
                  }
              },
              fail: function(res) {
                  console.log(res);
              }
          });
        },300)
      },


      setPoster(){
        let _this = this;
        let packInfo = _this.data.packInfo;
      if(!packInfo.designList){
        setTimeout(()=>{
          _this.setPoster()
        },500)
        return 
      }
      /**
         * ctx 画布上下文
         * img 图片对象
         * （x, y）圆心坐标
         * radius 半径
         * 注意：绘制圆形头像之前，保存画笔；绘制完成后恢复
         * */
        function drawCircleImage(ctx, img, x, y, radius) {
          ctx.save();
          let size = 2 * radius;
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, x - radius, y - radius, size, size);
          ctx.restore();
      }

      let imageBaseUrl = _this.data.imageBaseUrl;
      let employeeInfo = _this.data.employeeInfo;
      let thumbnail = _this.data.thumbnail;
     
      let codeBase64 = _this.data.codeBase64;
        const query = wx.createSelectorQuery()
        query.select('#myCanvas2')
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas = res[0].node
         
            let canvasId = canvas.id
            console.log('res',res)
            const ctx = canvas.getContext('2d')
            
            const dpr = wx.getSystemInfoSync().pixelRatio
            console.log('dpr',dpr)
            let width = res[0].width*dpr;
            let height = res[0].height*dpr;
            let canvasX = 15*dpr ; 
            let canvasY = 15*dpr;
            // 整个canvas添加背景色
            canvas.width = width
            canvas.height = height;
            ctx.fillStyle = 'rgba(245, 247, 254,1)'
            ctx.fillRect(0, 0, width, height)
            
            // 绘制用户头像
            let avatar  = canvas.createImage()
            let avatarHeight = 40*dpr ;
            let radius = avatarHeight/2;
            let avatarHeight2 = avatarHeight+10*dpr+canvasX
            avatar.src = _this.data.imageBaseUrl+_this.data.employeeInfo.avatar
            avatar.onload = function(){
              drawCircleImage(ctx, avatar,canvasX+radius,canvasY+radius,radius)
            }
            // 绘制'微信好友 给你分享' 文字
            let fontSize = 16*dpr;
            ctx.font =`normal normal ${fontSize}px Arial` 
            ctx.fillStyle = '#333333'
            console.log('fontSize',fontSize)
            ctx.fillText('微信好友 给你分享',avatarHeight2, radius+fontSize/2+canvasY) // 水印在画布的位置x，y轴
           
            // 绘制商品图片
            let goodsImgSize = 343*dpr
            let frameHeight = avatarHeight2+goodsImgSize+2*dpr;     // 商品外围边框矩形高度
            let goodsImg = canvas.createImage()
            goodsImg.src = _this.data.imageBaseUrl+thumbnail
            goodsImg.onload = function(){
              let goodsImgX = 1*dpr+canvasX
              ctx.drawImage(goodsImg,goodsImgX,  avatarHeight2, goodsImgSize, goodsImgSize);
              console.log('_this.data.employeeInfo.watermark',_this.data.employeeInfo.watermark)
              if(_this.data.employeeInfo.watermark){
                console.log('_this.data.employeeInfo.watermark',_this.data.employeeInfo.watermark)
                 // 绘制水印
                let watermarkImage = canvas.createImage()
                watermarkImage.src = _this.data.imageBaseUrl+_this.data.employeeInfo.watermark
                watermarkImage.onload = function(){
                  let maxHeight = 50*dpr;
                  let watermarkWidth =  maxHeight/watermarkImage.height*watermarkImage.width
                  let watermarkX = goodsImgSize/2-watermarkWidth/2+goodsImgX;
                  let watermarkY = goodsImgSize/2-maxHeight/2+avatarHeight2;
                  ctx.globalAlpha = 0.5
                  ctx.drawImage(watermarkImage, watermarkX, watermarkY, watermarkWidth, maxHeight);
                  ctx.globalAlpha = 1
                }
                ctx.save()
              }else{
                let fontSize = 25*dpr;
                ctx.font =`normal bold ${fontSize}px Arial` 
                //水平对齐方式
                ctx.textAlign = "center";
                //垂直对齐方式
                ctx.textBaseline = "middle";
                ctx.fillStyle = 'rgba(61, 126, 255,.25)'
                ctx.fillText('微图 - WEITU',  goodsImgSize/2+goodsImgX, goodsImgSize/2+avatarHeight2) // 水印在画布的位置x，y轴
              }
             
              
              
            
              //水平对齐方式
              // ctx.textAlign = "center";
              //垂直对齐方式
              // ctx.textBaseline = "middle";
              // ctx.fillStyle = 'rgba(61, 126, 255,.25)'
              // console.log(avatarHeight,goodsImgSize)
              // let str = packInfo.schemeName;
              // for (var i = 0; i < str.length; i++){
              //   if (ctx.measureText(str.substring(0,i+1)).width>130){ 
              //     ctx.fillText(str.substring(0,i),50*rpx,195*rpx,100)
              //     ctx.fillText(str.substring(i),50*rpx,230*rpx,100)
              //     break
              //   }
              // }
            // 绘制商品名称
              let fontSize = 16*dpr;
              ctx.textAlign = "left";
              ctx.textBaseline = "alphabetic";
              ctx.fillStyle = 'rgba(51, 51, 51,1)'
              ctx.font =`600 ${fontSize}px Arial` 
              let nameMaxWidth = 315*dpr;
              let nameX = 14*dpr+canvasX;
              let nameY = avatarHeight2+goodsImgSize+nameX+fontSize;
              
              frameHeight = frameHeight+nameX+fontSize;
              let schemeName = packInfo.schemeName;
              function textWrap(str){
                for (let index = 0; index < str.length; index++) {
                  if (ctx.measureText(str.substring(0,index+1)).width>nameMaxWidth){ 
                    ctx.fillText(str.substring(0,index),nameX,nameY,nameMaxWidth)
                    nameY = nameY+fontSize+(5*dpr);
                    frameHeight = frameHeight+fontSize+5*dpr;
                    if(ctx.measureText(str.substring(index)).width>nameMaxWidth){
                      // 第二行依然超过最大长度就递归函数
                      textWrap(str.substring(index))
                    }else{
                      ctx.fillText(str.substring(index),nameX,nameY,nameMaxWidth)
                    }
                    break
                  }
                }
              }
              // 判断商品名称是否一行展示不完，展示不完就换行展示
              if(ctx.measureText(schemeName).width>nameMaxWidth){
                textWrap(schemeName)
              }else{
                ctx.fillText(schemeName,nameX,nameY,nameMaxWidth)
              }
              console.log('frameHeight',frameHeight)
              // 绘制￥
              frameHeight = frameHeight+41*dpr+10*dpr;
              let priceY = nameY+ 41*dpr;
              let priceX = nameX;
              fontSize = 12*dpr;
              ctx.font =`normal ${fontSize}px Arial` 
              ctx.fillStyle = 'rgba(255, 77, 107,1)'
              ctx.fillText('￥',priceX,priceY)
              
              // 绘制金额 
              let pirceWid = ctx.measureText('￥').width
              priceX = priceX + pirceWid + 2*dpr;
              fontSize = 24*dpr;
              ctx.font =`600 ${fontSize}px Arial` 
              ctx.fillStyle = 'rgba(255, 77, 107,1)'
              ctx.fillText(packInfo.price,priceX,priceY)

              // 绘制金额单位
              pirceWid = ctx.measureText(packInfo.price).width
              fontSize = 16*dpr;
              priceX = priceX + 4*dpr + pirceWid;
              ctx.font =`400 ${fontSize}px Arial` 
              ctx.fillStyle = 'rgba(51, 51, 51,1)'
              ctx.fillText("元/套起",priceX,priceY)

              // 下面设置“参考价格”提示语的相关参数，方便绘制矩形背景使用
              pirceWid = ctx.measureText("元/套起").width
              priceX = priceX + 10*dpr + pirceWid;
              fontSize = 12*dpr;
              ctx.font =`500 ${fontSize}px Arial` 
               // 绘制矩形边框，先绘制背景，再去绘制文字，不然文字会被覆盖
               let rectWid = ctx.measureText("参考价格").width+8*dpr;
               let pirceHeight = 18*dpr;
               ctx.lineWidth = 1*dpr;
               ctx.strokeStyle = 'rgba(233, 233, 233,1)';
               ctx.beginPath()
               let rectY = priceY-18*dpr
               let rectX = priceX-4*dpr
               ctx.moveTo(rectX+2*dpr,rectY)
               ctx.arcTo(rectX+rectWid,rectY,rectX+rectWid,rectY+pirceHeight,2*dpr)
               ctx.arcTo(rectX+rectWid,rectY+pirceHeight,rectX,rectY+pirceHeight,2*dpr)
               ctx.arcTo(rectX,rectY+pirceHeight,rectX,rectY,2*dpr)
               ctx.arcTo(rectX,rectY,rectX+rectWid,rectY,2*dpr)
              ctx.fillStyle="rgba(233, 233, 233,1)"   
              ctx.fill();
              ctx.stroke()
               // 绘制“参考价格”提示语
              ctx.fillStyle = 'rgba(51, 51, 51,1)'
              ctx.fillText("参考价格",priceX,priceY-5*dpr)


              // 绘制矩形边框
              ctx.lineWidth = 1*dpr;
              ctx.strokeStyle = '#e6e6e6';
              frameHeight = frameHeight+10*dpr;
              ctx.beginPath()
              ctx.moveTo(5*dpr+canvasX,avatarHeight2)
              let frameWidth = 345*dpr+canvasX;
              ctx.arcTo(frameWidth,avatarHeight2,frameWidth,frameWidth,5*dpr)
              ctx.arcTo(frameWidth,frameHeight,avatarHeight2,frameHeight,5*dpr)
              ctx.arcTo(canvasX,frameHeight,canvasX,frameWidth,5*dpr)
              ctx.arcTo(canvasX,avatarHeight2,frameWidth,avatarHeight2,5*dpr)
              ctx.stroke()
              
              // 绘制二维码
              let codeImg = canvas.createImage()
              codeImg.src = `data:image/png;base64,${_this.data.codeBase64}`
              let codeImgSize = 100*dpr;
              codeImg.onload = function(){
                ctx.drawImage(codeImg,  frameWidth/2-codeImgSize/2+canvasX/2, frameHeight+10*dpr, codeImgSize, codeImgSize);
              }
              ctx.save()
              fontSize = 12*dpr;
              ctx.font =`400 ${fontSize}px Arial` 
              ctx.fillStyle = 'rgba(51, 51, 51,1)'
              ctx.textAlign = "center";
              ctx.fillText("长按识别查看详情",frameWidth/2+canvasX/2, frameHeight+10*dpr+codeImgSize+fontSize+5*dpr,300*dpr)
              
            }
             //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
            _this.generatePosterImg({dpr,canvas})
         
  
          })
      },
      generatePosterImg({dpr,canvas}){
        let _this = this;
        setTimeout(function() {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 375,
            height: 700,
            destWidth:375*dpr,
            destHeight:700*dpr,
              canvas:canvas,
              success: function(res) {
                  var tempFilePath = res.tempFilePath;
                  _this.setData({
                    posterImagePath: tempFilePath,
                  });
                  _this.permissions()
              },
              fail: function(res) {
                  console.log(res);
              }
          });
      }, 300);
      },
      permissions(){
        let _this = this;
        wx.getSetting({
          success(res) {
            console.log('getSetting',res)
            if (res.authSetting['scope.writePhotosAlbum']) {
              _this.savePoster();
            }else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
              // 第一次运行，授权未定义，可以直接保存，系统会一次性询问用户权限
              _this.savePoster();
            } else {
              _this.showSetTips()
            }
          
          }})
      },
      savePoster(){
        let _this = this;
        wx.saveImageToPhotosAlbum({
          filePath:_this.data.posterImagePath,
          success(res) {
              wx.showToast({
                  title: '已保存到相册',
                  icon: 'success',
                  duration: 3000
              })
              setTimeout(()=>{
                _this.onCloseShare()
              },1500)
          }
      })
      },
      onCloseShare(event){
        console.log("event",event)
        this.setData({
          // showLoading:false,
          showShare:false
        })
        wx.navigateBack()
      },
      onSelectShare(event){
        console.log('event',event)
        if(event.detail.name=='生成海报'){
          this.setPoster()
        }
      },
      hideSetTips(){
        this.setData({
          showShare:true,
          showLoading:false,
          showSetTips:false
        })
      },
      showSetTips(){
        this.setData({
          showShare:false,
          showLoading:false,
          showSetTips:true
        })
      },
      openSetting(event){
        let _this = this;
        console.log('event',event)
        //  用户拒绝授权后，打开设置页可以看到授权提示开关
         wx.openSetting({
          success(res) { // 用户授权
            console.log('openSettingsuccess',res)
            // _this.hideSetTips()
            if (res.authSetting['scope.writePhotosAlbum']) {
              _this.savePoster();
            }else { // 用户拒绝授权
              wx.showToast({
                title: '权限不足',
              })
            }
          },
          fail(res) {
            console.log('openSetting',res)
            // _this.hideSetTips()
              wx.showToast({
                title: '设置失败',
              })
            }
        })
      },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      this.setWatermark()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.setData({
        employeeInfo:app.globalData.employeeInfo 
      })
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

    },
    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {}
    //   const promise = new Promise(resolve => {
    //     setTimeout(() => {
         
    //     }, 500)
    //   })
    //   return {
    //     title: "微信好友 给你分享",
    //     imageUrl:tempFilePath,
    //     title: "微信好友 给你分享",
    //     path:`/pages/nameCard/index?packid=${_this.data.packInfo.id}&salesperson=${_this.data.employeeInfo.id}&recommender=${_this.data.userInfo.id}`,
    //   }
    // }
})
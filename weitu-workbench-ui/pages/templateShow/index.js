// pages/templateShow/index.js
import {
  getWeChatMiniReferralCode
} from "../../api/workbench"
import {
  accountInfo,
  imageBaseUrl,
  staticFileBaseUrl 
} from '../../utils/request'
let App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true,
    imageBaseUrl: imageBaseUrl, // 图片域名
    referralCode: "", // 推荐码
    templateImg: "", // 模板图片
    userInfo: "", // 用户信息
    posterImagePath:'',
    showShare: true,
        showLoading:false,
        loadingText:"正在生成海报...",
        showSetTips:false,
        options: [
      
          {
            name: '保存海报',
            icon:  staticFileBaseUrl+'/static/wxwt/iweitu/share/dow.png',
          }
         
        ],
  },
  // 获取小程序推荐码
  async getReferralCode() {
    let _this = this;
    let userInfo = _this.data.userInfo;
    wx.showLoading({
      title: "获取推荐码中...",
      mask: true
    })
    let param = {
      mobile: userInfo.mobile, // 用户手机号
      avatarUrl: userInfo.avatar ? imageBaseUrl + userInfo.avatar : '',
      salesperson: userInfo.id, // 业务员
      envVersion: accountInfo.miniProgram.envVersion,
      pageUrl: "pages/nameCard/index"
    }
    console.log('envVersion', param.envVersion);
    let result = await getWeChatMiniReferralCode(param);
    _this.setData({
      referralCode: result
    })
 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    console.log('e', e);
    let _this = this;
    let templateNameMap = {
      1: "促销模板",
      2: "招聘模板",
      3: "招租模板",
      4: "我的企业模板"
    }
    wx.setNavigationBarTitle({
      title: templateNameMap[e.templateIndex]
    })
    _this.setData({
      templateImg: decodeURIComponent(e.templateimg),
      userInfo: App.globalData.userInfo
    })
    // 获取小程序推荐码
    _this.getReferralCode()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  bindShow() {
    let _this = this;
    _this.setData({
      isShow: false
    })
  },
  setPoster() {
    let _this = this;
    _this.setData({
      showLoading:true,
      showShare:false
    })
    const query = wx.createSelectorQuery()
    query.select('#myCanvas2')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        console.log('res', res)
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        let width = res[0].width * dpr;
        let height = res[0].height * dpr;
        console.log('dpr', width)
        let canvasX = 15 * dpr;
        let canvasY = 15 * dpr;
        canvas.width = width
        canvas.height = height;
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.save()
        // 绘制商品图片
        let templateImgWidth = 343 * dpr
        let templateImgHeight = 0
        let templateImg = canvas.createImage()
        templateImg.src = _this.data.templateImg
        console.log('templateImg', templateImg.width)
        templateImg.onload = function () {
          console.log('templateImg', templateImg.width)
          templateImgHeight = templateImgWidth / templateImg.width * templateImg.height
          // 绘制矩形边框
          ctx.lineWidth = 1 * dpr;
          ctx.strokeStyle = 'rgba(233, 66, 66,0)';
          ctx.beginPath()
          let r = 8 * dpr;
          ctx.moveTo(canvasX + r, canvasY)
          ctx.arcTo(canvasX + templateImgWidth, canvasY, canvasX + templateImgWidth, canvasX + templateImgHeight, r)
          ctx.arcTo(canvasX + templateImgWidth, canvasY + templateImgHeight, canvasX, canvasY + templateImgHeight, r)
          ctx.arcTo(canvasX, canvasY + templateImgHeight, canvasX, canvasY, r)
          ctx.arcTo(canvasX, canvasY, canvasX + templateImgWidth, canvasY, r)
          ctx.closePath();
          ctx.stroke()
          ctx.save()
          ctx.clip();
          ctx.drawImage(templateImg, canvasX, canvasY, templateImgWidth, templateImgHeight);
          ctx.restore(); // 返回上一状态
          // 绘制用户头像
          let avatar = canvas.createImage()
          let avatarMaxWidth = 40 * dpr;
          let avatarMaxHeight = 53 * dpr;
          avatar.src = _this.data.imageBaseUrl + _this.data.userInfo.avatar
          avatar.onload = function () {
            // 自适应宽高
            // if(avatar.width>avatar.height){
            //   let avatarHeight = avatarMaxWidth/avatar.width*avatar.height;
            //   ctx.drawImage(avatar,canvasX+10*dpr,  canvasY+templateImgHeight+30*dpr, avatarMaxWidth, avatarHeight);
            // }else{
            //   let avatarWidth = avatarMaxHeight/avatar.height*avatar.width;
            //   ctx.drawImage(avatar,canvasX+10*dpr,  canvasY+templateImgHeight+30*dpr, avatarWidth, avatarMaxHeight);
            // }
            // 写死宽高
            ctx.drawImage(avatar, canvasX + 10 * dpr, canvasY + templateImgHeight + 30 * dpr, avatarMaxWidth, avatarMaxHeight);
          }
          // 绘制用户名称
          let fontSize = 15 * dpr;
          ctx.textAlign = "left";
          ctx.textBaseline = "alphabetic";
          ctx.fillStyle = 'rgba(1, 1, 1,1)'
          ctx.font = `400 ${fontSize}px Arial`
          let nameMaxWidth = 120 * dpr;
          let nameX = canvasX + avatarMaxWidth + 20 * dpr;
          let nameY = canvasY + templateImgHeight + 40 * dpr;
          // frameHeight = frameHeight+nameX+fontSize;
          let str = _this.data.userInfo.fullname;
          console.log('_this.data.userInfo', _this.data.userInfo)

          function textWrap(str) {
            for (let index = 0; index < str.length; index++) {
              if (ctx.measureText(str.substring(0, index + 1)).width > nameMaxWidth) {
                ctx.fillText(str.substring(0, index), nameX, nameY, nameMaxWidth)
                nameY = nameY + fontSize + (5 * dpr);
                // frameHeight = frameHeight+fontSize+5*dpr;
                if (ctx.measureText(str.substring(index)).width > nameMaxWidth) {
                  // 第二行依然超过最大长度就递归函数
                  textWrap(str.substring(index))
                } else {
                  ctx.fillText(str.substring(index), nameX, nameY, nameMaxWidth)
                }
                break
              }
            }
          }
          // 判断字符串是否一行展示不完，展示不完就换行展示
          if (ctx.measureText(str).width > nameMaxWidth) {
            textWrap(str)
          } else {
            ctx.fillText(str, nameX, nameY, nameMaxWidth)
          }
          // 绘制职位名称
          ctx.fillStyle = 'rgba(119, 119, 119,1)'
          str = `(${_this.data.userInfo.position})`;
          nameY = nameY + fontSize + (5 * dpr);
          // 判断字符串是否一行展示不完，展示不完就换行展示
          if (ctx.measureText(str).width > nameMaxWidth) {
            textWrap(str)
          } else {
            ctx.fillText(str, nameX, nameY, nameMaxWidth)
          }
          // 绘制职位名称
          ctx.fillStyle = 'rgba(1, 1, 1,1)'
          str = _this.data.userInfo.enterprise.enterpriseName;
          fontSize = 12 * dpr
          ctx.font = `400 ${fontSize}px Arial`
          nameY = nameY + fontSize + (5 * dpr);
          // 判断字符串是否一行展示不完，展示不完就换行展示
          if (ctx.measureText(str).width > nameMaxWidth) {
            textWrap(str)
          } else {
            ctx.fillText(str, nameX, nameY, nameMaxWidth)
          }

          // 绘制文案
          ctx.fillStyle = 'rgba(61, 126, 255,1)'
          str = `推荐一个好物给您，长按识别查看详情吧~`;
          nameY = nameY + fontSize + (5 * dpr);
          console.log('templateImgHeight',templateImgHeight+140*dpr-fontSize*2+canvasY+5*dpr)
          console.log('templateImgHeight',nameY)
          // 画布位置 图片高度+二维码高度-文案字体高度（2行）
          let minNameY = canvasY+templateImgHeight+140*dpr-fontSize*2+5*dpr
          if (nameY < minNameY) {
            nameY = minNameY
          }
          nameX = canvasX + 10 * dpr
          nameMaxWidth = 170 * dpr
          // 判断字符串是否一行展示不完，展示不完就换行展示
          if (ctx.measureText(str).width > nameMaxWidth) {
            textWrap(str)
          } else {
            ctx.fillText(str, nameX, nameY, nameMaxWidth)
          }

          // 绘制二维码
          let codeImg = canvas.createImage()
          codeImg.src = `data:image/png;base64,${_this.data.referralCode}`
          let codeImgSize = 140 * dpr;
          codeImg.onload = function () {
            ctx.drawImage(codeImg, 210 * dpr, canvasY + templateImgHeight + 10 * dpr, codeImgSize, codeImgSize);
            // ctx.save()
            let bgWidth = canvasX
        
            // ctx.beginPath()
            let bgHeight = nameY+20*dpr
            _this.generatePosterImg({dpr,canvas,destHeight:bgHeight+canvasY})
          }
        }
      })
  },
  generatePosterImg({dpr,canvas,destHeight}){
    let _this = this;
    setTimeout(function() {
      console.log(' destHeight/dpr', destHeight/dpr)
      console.log( destHeight,dpr)
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 375,
        height: destHeight/dpr,
        destWidth:375*dpr,
        destHeight:destHeight,
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
          _this.hideSetTips()
      },
      fail(){
        wx.showToast({
          title: '保存失败',
          icon: 'success',
          duration: 3000
      })
      _this.onCloseShare()
      }
  })
  },
  onCloseShare(event){
    this.setData({
      showLoading:false,
      showShare:true
    })
  },
  onSelectShare(event){
    this.setPoster()
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
})
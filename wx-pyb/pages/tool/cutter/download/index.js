// pages/tool/cutter/index.js
import { IMG_BASE_URL, TOOL_WEB_VIEW } from "../../../../utils/request";
import { getShareLink, removeByUuid} from "../../../../api/tool.js";
var token = wx.getStorageSync("token");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: IMG_BASE_URL,
    webUrl: TOOL_WEB_VIEW + "/wxpyb/h5/cutter/download?token=" + token,
    cutterId: null,
    cutterInfo:{},
    steps: [
      {
        text: '选择盒型',
        // desc: '描述信息',
        // inactiveIcon: 'location-o',
        // activeIcon: 'success',
      },
      {
        text: '输入尺寸',
        // desc: '描述信息',
        // inactiveIcon: 'like-o',
        // activeIcon: 'plus',
      },
      {
        text: '下载刀模',
        // desc: '描述信息',
        // inactiveIcon: 'star-o',
        // activeIcon: 'cross',
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      cutterId: options.cutterId,
    });
    if(options.cutterId){
      getShareLink({
        data:options.cutterId
      }).then((res)=>{
        if(res.success&&res.data){
          let info = JSON.parse(res.data)
          _this.setData({
            cutterInfo:info
          })
          removeByUuid({
            data:options.cutterId
          })
          console.log('cutterInfo',info)
          // this.downloadCutter(info.url)
        }
      });
    }
    console.log("wx.env.USER_DATA_PATH", options);
  },
  bindGetMsg(options) {
    console.log("接受数据", options);
    let _this = this;
    let arr = options.detail.data;
    console.log("接受数据3333", arr[arr.length - 1]);
    let url = arr[arr.length - 1];
    // this.downloadCutter(url)
  },
  dowCutter(){
    let _this = this;
    _this.downloadCutter(_this.data.cutterInfo.url)
    app.saveReport({actionId:3,boxId:_this.data.cutterInfo.urlQuery.subCateId,type:'下载刀模'})
    //上报操作日志
    wx.request({
      url:'https://www.aocai.cn/api/v1/action/reported',
      header:{
        'Content-type': 'application/json;charset=UTF-8'
      },
      method:'post',
      data:{
        actionId: 4,
        appId: 2,
        channel: 3001,
        channelName: '下载刀模',
        appName:'拼一版小程序',
        actionName:"下载刀模",
        uid: app.globalData.userInfo.id||'',
      }
    })
  },
  downloadCutter(url){
    let _this = this;
    let obj = _this.getQuery(url);
    console.log("url", url);
    // 设置路径
    const fileExtName = ".pdf";
    const size = obj.long + "_" + obj.width + "_" + obj.height;
    const randfile =
      "XCY_" + _this.formatTime(new Date()) + "_" + size + fileExtName;
    const newPath = `${wx.env.USER_DATA_PATH}/${randfile}`;
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      filePath: newPath,
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.getSystemInfo({
            success: function (res) {
              if (
                res.platform !== "android" &&
                res.platform !== "ios" &&
                res.platform !== "devtools" &&
                _this.data.buttonStatu !== "disabled"
              ) {
                wx.saveFileToDisk({
                  filePath: newPath,
                  success(res) {
                    console.log(res);
                  },
                  fail(res) {
                    console.error(res);
                  },
                });
              } else {
                wx.openDocument({
                  // 打开下载文件
                  filePath: newPath,
                  showMenu: true,
                  fileType: "pdf",
                  success: function (res) {},
                });
              }
            }}
            )
          
        }
      },
      complete(res) {
        console.log("dcccxxx", res);
      },
    });
  },
  formatTime: function (date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const formatNumber = (n) => {
      n = n.toString();
      return n[1] ? n : "0" + n;
    };
    return (
      [year, month, day].map(formatNumber).join("") +
      "" +
      [hour, minute, second].map(formatNumber).join("")
    );
  },
  getQuery(url) {
    const index = url.indexOf("?");
    const obj = {};
    if (index === -1) return obj;
    const queryStr = url.slice(index + 1);
    const arr = queryStr.split("&");
    for (let item of arr) {
      const keyValue = item.split("=");
      obj[keyValue[0]] = keyValue[1];
    }
    return obj;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // setTimeout(() => {
    //     wx.navigateBack()
    // }, 1000);
    let cutterId = this.data.cutterId
    // if(cutterId){
    //   getShareLink({
    //     data:cutterId
    //   }).then((res)=>{
    //     if(res.success&&res.data){
    //       let info = JSON.parse(res.data)
    //       this.downloadCutter(info.url)
    //     }
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});

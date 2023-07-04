import {listSpecialEditionGoods} from "../../../api/orderApi"
import { PDF_URL, uploadWebURL } from '../../../utils/request';
// pages/categoryPages/exclusive/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */ 
  data: {
    currentTab:0,
    activeKey:0,
    sidebarList:[],
    title: '',
    daomoList:[],
    boxType:'',
    imgBaseUrl:'https://www.aocai.cn',
    height:657,
    with:375,
    isPc:false,
    path:'',//上传文件时的文件的本地缓存
    times:0,
    isNewPage: true,
    boxList:[],
    index:0,
    uploadWebURL,
    xhToken: wx.getStorageSync('token'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    listSpecialEditionGoods().then(res=>{
      if (res.success) {
        this.setData({
          boxList:res.data.map(item=>{
            item.name = item.data.name
            return item
          }),
          boxType:res.data[0],
          sidebarList:res.data[0].children,
          title: res.data[0].children[0].data.name,
          daomoList:res.data[0].children[0].goodsList
        })
        let type = Number(wx.getStorageSync('valuation'))
        wx.setStorageSync('moldCateId', res.data[type].children[0].data.moldCateId)
        wx.setStorageSync('goodsId',res.data[type].children[0].data.goodsId)
        if (type) {
          let obj = {detail:{value:type}}
          this.bindPickerChange(obj)
        }
      }else{
        wx.showModal({
          title: '请求失败',
          showCancel: false, //隐藏取消按钮
          content: '网络请求失败，请检查您的网络',
          success: function (res) {
            if (res.confirm) {
                //   wx.hideLoading()
                console.log('点击确认回调')
            } else {
                console.log('点击取消回调')
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  // onHide(){
  //   app.globalData.pdfPath = ''
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.pdfPath) {
      // wx.navigateTo({
      //   url:'./valuation/index'
      // })
      this.setData({
        current:1,
        path:app.globalData.pdfPath
      })
    }
    this.setData({
      height: wx.getSystemInfoSync().windowHeight - 50,
      with:wx.getSystemInfoSync().windowWidth,
    })
    if(this.data.isNewPage==false){
      this.setData({
        times:0,
        isNewPage:true
      })
    }
    
  },
  bindPickerChange: function(e) {
    this.setData({
      activeKey:0,
      index: e.detail.value,
      boxType:this.data.boxList[e.detail.value],
      daomoList:this.data.boxList[e.detail.value].children[0].goodsList
    })
    wx.setStorageSync('goodsId',this.data.boxList[e.detail.value].children[0].data.goodsId)
    if (e.detail.value==1) {
      this.setData({
        sidebarList:this.data.boxList[e.detail.value].children.filter(item=>{
          return item.data.name!='平粘盒'&&item.data.name!='自动锁底盒'
        })
      })
    }else{
      this.setData({
        sidebarList:this.data.boxList[e.detail.value].children,
      })
    }
  },
  //tabs切换
  tabsCrount: function (e) {
    var _this = this;
    let current=e.currentTarget.dataset.current
    if (this.data.currentTab === current) {
      return false;
    } else {
      if(current==0){
        _this.setData({
          times:0
        })
      }
      _this.setData({
        currentTab: current
      });
    }
  },
  sidebarCrount: function (e) {
    var _this = this;
    if (this.data.activeKey === e.currentTarget.dataset.current) {
      return false;
    } else {
      _this.setData({
        activeKey: e.currentTarget.dataset.current,
        daomoList:_this.data.sidebarList[e.currentTarget.dataset.current].goodsList,
        title: e.currentTarget.dataset.val
      });

      wx.setStorageSync('moldCateId', _this.data.sidebarList[e.currentTarget.dataset.current].data.moldCateId)
      wx.setStorageSync('goodsId',e.currentTarget.dataset.goodsid)
    }
  },
  toValuation: function(e){
    console.log(e);
    let obj =e.currentTarget.dataset.obj
    //封套特殊处理
    if(obj){
      if (obj.id==684) {
        wx.setStorageSync('goodsId',684)
      }
    }
   
    try {
      wx.setStorageSync('knifeUrl', e.currentTarget.dataset.url)
      wx.setStorageSync('img', JSON.stringify(e.currentTarget.dataset.img))
      wx.setStorageSync('daomo', JSON.stringify(e.currentTarget.dataset.obj))
    } catch (e) {console.log(e);}
    wx.showLoading({
        title: '跳转中',
        mask: true
    })
    let url = ''
    if (this.data.index === 1) {
      url = `./valuation-k`
    } else if (this.data.index === 2) {
      url = `./valuation-jing`
    } else {
      url = `./valuation`
    }
    url += `/index?title=${this.data.boxType.data.name}&type=${this.data.currentTab}&boxName=${this.data.title}`
    wx.navigateTo({
        url: url,
        complete: () => {
          this.setData({
            isNewPage: false //跳转下一步修改为false
          })
            wx.hideLoading()
        }
    })
    app.saveReport({
      goodsId:wx.getStorageSync('goodsId'),
      actionId:1,
      type:'专版报价'
    })
  },

  uploadeFile: function(e){
    let _this = this;
if(_this.data.times>4){
  wx.showToast({
    title: '上传次数过多，请进行下一步操作~',
    icon:'none',
  })
  console.log('第五次',_this.data.times)
  return
}
  app.saveReport({
    actionId:1,
    channel:this.data.index === 1?501900:500800
  })
    wx.getSystemInfo({
      success: function(res) {
        console.log('设备信息',res);
        if(res.platform!=='android'&&res.platform!=='ios'&&res.platform!=='devtools'){
          let url = `${_this.data.uploadWebURL}/static/pybupload/pybuploadfile.html?token=${_this.data.xhToken}&pageType=exclusive`
          wx.navigateTo({
              url:`./webview/index?url=${encodeURIComponent(url)}`
          })
        }else{

          wx.chooseMessageFile({
            count: 1,//能选择文件的数量
            type: 'file',//能选择文件的类型,这里只允许上传文件.还有视频,图片,或者都可以
            success(res) {
              var size = res.tempFiles[0].size;
              var filename = res.tempFiles[0].name;
              var newfilename = filename + "";
              // if (newfilename.indexOf(".pdf") == -1 && newfilename.indexOf(".cdr") == -1 && newfilename.indexOf(".ai") == -1 && newfilename.indexOf(".psd") == -1&&newfilename.indexOf(".PDF") == -1 && newfilename.indexOf(".CDR") == -1 && newfilename.indexOf(".AI") == -1 && newfilename.indexOf(".PSD") == -1) { //限制文件类型
              if(newfilename.indexOf(".pdf") == -1 && newfilename.indexOf(".PDF") == -1 ){
                wx.showToast({
                  title: '请上传PDF文件',
                  icon: 'error',
                  duration: 1500
                })
              } else {
                wx.showLoading({
                  title: '上传文件中...',
                  mask:true
                });
                wx.uploadFile({  
                  url: app.globalData.requestUrl+'/api/consumer/file/uploadCustomFile',//上传的路径                  
                  filePath: res.tempFiles[0].path,//刚刚在data保存的文件路径 
                  header: {
                    "Content-Type": "application/json;charset=UTF-8",
                    'sysType': 'pinyiban_wx',
                    'token': wx.getStorageSync('token')
                  },
                  name: 'file',
                  success(res) {
                    _this.setData({
                      times:_this.data.times + 1,
                    })
                    if (JSON.parse(res.data).success) {
                      console.log('666',JSON.parse(res.data).data);
                      app.globalData.pdfPath = JSON.parse(res.data).data
                    }
                    _this.setData({
                      path: JSON.parse(res.data).data,//将文件的路径保存在页面的变量上,方便 wx.uploadFile调用
                    })
                    console.log(_this.data.times);
                  },
                  complete(){
                    wx.hideLoading()
                  }
                })
                // _this.setData({
                //   path: res.tempFiles[0].path,//将文件的路径保存在页面的变量上,方便 wx.uploadFile调用
                // })
              }
            }
          })
        }
      }
    })
  },
  //打开PDF
  lookPdf: function (e) {
    wx.showLoading({
      title: '加载文件中...',                           
      mask:true 
    });
    wx.downloadFile({
      url: app.globalData.OSSFileUrl+this.data.path,
      success: function (res) {
        wx.hideLoading()
        const  filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType:'pdf',
          success: function (res) {
            // console.log('打开文档成功')
          }
        })
      },
      fail:function(res){
        wx.hideLoading()
      }
    })
  },
});

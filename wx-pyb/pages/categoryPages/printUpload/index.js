import {listSpecialEditionGoods,addTemplateEditionOrder,editionFiles} from "../../../api/orderApi"
import { PDF_URL, uploadWebURL } from '../../../utils/request';
// pages/categoryPages/exclusive/index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */ 
  data: {
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
    xh: false,
    xhToken: wx.getStorageSync('token'),
    show:true,
    buttonStatu: 'active',
    username:'',
    phone:'',
    orderNo:'',
    customerFile:'',
    orderDetail: '',
    poSns:'',
    isBind: false,
    modal: {
      show: false, //modal是否显示，默认false
      contentText: "",
      icon: "",
      iconSize: "",
      image: "",
      imageSize: "",
    },
    info:{},
    isLight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    let _this = this;
    _this.setData({
      username: wx.getStorageSync('username'),
      phone: wx.getStorageSync('phone'),
    })
    if(_this.data.username && _this.data.phone){
      _this.setData({
        isLight:1
      })
    }else{
      _this.setData({
        isLight:0
      })
    }
    try {
      _this.setData({
          xhToken: wx.getStorageSync('token')
      })
  } catch (error) {

  }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  onHide(){
    app.globalData.pdfPath = ''
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.pdfPath) {
      this.setData({
        customerFile:app.globalData.pdfPath
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
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    this.bindFile()
  },

  UPloadFile: function (e) {
    console.log('UPloadFile', e.currentTarget);
    var _this = this
    wx.getSystemInfo({
        success: function (res) {
              app.saveReport({
                actionId:3,
                channel: 900000
            })
            if (res.platform !== 'android' && res.platform !== 'ios'&& res.platform !== 'devtools' && _this.data.buttonStatu !== 'disabled') {
                _this.setData({
                    xh: true
                })
                let url = `${_this.data.uploadWebURL}/static/pybupload/pybuploadfile.html?token=${_this.data.xhToken}&pageType=exclusive`
                console.log(url)
                wx.navigateTo({
                    url:`/pages/categoryPages/exclusive/webview/index?url=${encodeURIComponent(url)}`
                })
                // wx.navigateTo({
                //     url:`./webView/index`  
                // })
            }
        }
    })
    if (_this.data.xh) {
        return
    }
    clearTimeout(_this.TimeID);
    _this.TimeID = setTimeout(function () {
        if (_this.data.buttonStatu == 'active') {
            _this.setData({
                uploadStatus: true
            })
            
            wx.chooseMessageFile({
                count: 1,
                //能选择文件的数量
                type: 'file',
                //能选择文件的类型,这里只允许上传文件.还有视频,图片,或者都可以
                success(res) {
                    var size = res.tempFiles[0].size;
                    var filename = res.tempFiles[0].name;
                    var newfilename = filename + "";
                    //限制文件类型
                    if (newfilename.indexOf(".pdf") == -1 && newfilename.indexOf(".cdr") == -1 && newfilename.indexOf(".ai") == -1 && newfilename.indexOf(".psd") == -1 && newfilename.indexOf(".PDF") == -1 && newfilename.indexOf(".CDR") == -1 && newfilename.indexOf(".AI") == -1 && newfilename.indexOf(".PSD") == -1) {
                        _this.alert();
                    } else {
                        wx.showLoading({
                            title: '上传文件中...',
                            mask: true,
                            success() {
                                wx.uploadFile({
                                    url: app.globalData.requestUrl + '/api/consumer/order/miniEditionSuborder/updatePdfFile1',
                                    //上传的路径                  
                                    filePath: res.tempFiles[0].path,
                                    //刚刚在data保存的文件路径 
                                    formData: {
                                        folder: 'uploads/agent',
                                        // orderNo: _this.data.orderNo
                                    },
                                    header: {
                                        "Content-Type": "application/json;charset=UTF-8",
                                        'sysType': 'pinyiban_wx',
                                        'token': wx.getStorageSync('token')
                                    },
                                    name: 'file',
                                    success(res) {
                                        console.log("上传文件", JSON.parse(res.data));
                                        _this.setData({
                                            customerFile: JSON.parse(res.data).data
                                        })                  
                                        wx.hideLoading() 
                                        _this.modalFun({ contentText: '上传成功', icon: 'ac-icon-check' })
                                        _this.setData({
                                            uploadStatus: false
                                        })
                                        // _this.getOrderDetails();
                                    },
                                    fail(err) {
                                        console.log('err', err);
                                        _this.setData({
                                            uploadStatus: false
                                        })
                                        wx.showModal({
                                            title: '提示',
                                            content: '文件上传失败!',
                                            showCancel: false,
                                            success(res) {
                                                if (res.confirm) {
                                                    _this.getOrderDetails();
                                                }
                                            }
                                        })
                                    },
                                })
                            }
                        });
                        _this.setData({
                            path: res.tempFiles[0].path,
                            //将文件的路径保存在页面的变量上,方便 wx.uploadFile调用
                            // filename: filename    //渲染到wxml方便用户知道自己选择了什么文件
                        })

                    }
                }
            })
        }
    }, 500);
},
  //打开PDF
  lookPdf: function (e) {
    wx.showLoading({
      title: '加载文件中...',                           
      mask:true 
    });
    wx.downloadFile({
      url: app.globalData.OSSFileUrl+this.data.customerFile,
      success: function (res) {
        console.log(res);
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
  formname(e) {
    let _this = this;
    _this.setData({
      username: e.detail.value
    })
    if(_this.data.username && _this.data.phone){
      _this.setData({
        isLight:1
      })
    }else{
      _this.setData({
        isLight:0
      })
    }
  },
  formphone(e) {
    let _this = this;
    _this.setData({
      phone: e.detail.value
    })
    if(_this.data.username && _this.data.phone){
      _this.setData({
        isLight:1
      })
    }else{
      _this.setData({
        isLight:0
      })
    }
  },
  bindNext:function(){
    let _this = this
    console.log(this.data)
    var nameReg = /^[\u4E00-\u9FA5]{2,15}$/;
    var phoneReg=/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
    if (!nameReg.test(this.data.username)) {
      wx.showToast({
        title: '请输入正确姓名', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    }else if (!phoneReg.test(this.data.phone)) {
      wx.showToast({
        title: '手机号格式错误', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
      return
    }else {
      wx.removeStorage({ key: 'username' })
      wx.removeStorage({ key: 'phone' })
      wx.setStorage({
        key: 'username',
        data: this.data.username
      })
      wx.setStorage({
        key: 'phone',
        data: this.data.phone
      })
      wx.showLoading({
        title: '正在提交',
        mask: true
      })
      
      // let info = {
      //   customer: _this.data.username,
      //   mobile: _this.data.phone,
      // }
      wx.hideLoading()
      _this.setData({
        show:false,
        "info.customer": _this.data.username,
        "info.mobile": _this.data.phone,
        // info:{
        //   customer: _this.data.username,
        //   mobile: _this.data.phone,
        // }
      })
      app.saveReport({
        actionId:2,
        channel: 900000
    })
    //   addTemplateEditionOrder(info).then(res=>{
    //     if (res.success) {
    //       wx.hideLoading()
    //       _this.setData({
    //         show:false,
    //         orderNo:res.data.data,
    //         poSns:res.data.children[0]
    //       })
    //     }else{
    //       _this.modalFun({ contentText: res.message, })
    //     }
    // })
    }
  },
  bindFile: function(e) {
    console.log("上传文件3333",this.data.customerFile);
    let _this = this;
    addTemplateEditionOrder({
        fileUrl: this.data.customerFile,
        customer: _this.data.info.customer,
        mobile: _this.data.info.mobile,
    }).then(res => {
      console.log(res.message)
      if(res.data){
        this.setData({ isBind: false })
        wx.redirectTo({
          url: '../../personageCenter/allPrintingOrder/index',
        })
        _this.modalFun({ contentText: res.message,icon: 'ac-icon-check' })
      }else{
        _this.modalFun({ contentText: res.message, })
      }
      wx.hideLoading()
    })
},
   /**
   * 消息提示
   * @param {Object}
   */
  modalFun({ contentText, icon, iconSize, image, imageSize, time }) {
    var _this = this;
    _this.setData({
      modal: {
        show: true,
        contentText,
        icon,
        iconSize,
        image,
        imageSize,
      },
    });
    setTimeout(
      () => {
        _this.setData({
          modal: {
            show: false, //modal是否显示，默认false
          },
        });
      },
      time ? time : 2000
    );
  },
  alert:function(){
    this.modalFun({contentText:'文件格式仅支持PDF/CDR/AI/PSD，大小不得超过100MB'})
  },
});

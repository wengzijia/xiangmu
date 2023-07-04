//index.js
import { sendFile } from "../../../../../api/orderDetailsApi"
import { ordersDetails,editionFiles,editFileLook,allot,confirmBluePaper,allotProcesse, getCurrentUserInfo} from "../../../../../api/orderApi"

import { requestUrl } from "../../../../../utils/request"
//获取应用实例
const app = getApp()
Page({
  onShow(){
    
  },
  data: {
    imgList:[],
    goodsInfo:{},
    orderInfo:{},
    btnText:'确认兰纸文件',
    showDialog:false,
    notConfirm:true,
    fileUrl:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'
  }, 
  onLoad: function (e) {
    console.log(e);
    let data = JSON.parse(e.data)
    let _this = this;
    _this.setData({
      orderSn:data.sn,
      goodsId:data.id,
      queryType:data.type
    })
    wx.showLoading({
      title: '加载中...',
    })
    _this.getOrderInfo()
  },
  showDialogFun() {
    let _this = this;
    if (_this.data.btnText === "确认兰纸文件") {
      _this.setData({
        showDialog:true
      })
      
    } else {
      _this.redirectTo();
    }
  },
   /**
     * 获取订单信息
     */
    getOrderInfo() {
      let _this = this;
      // let bl = [
      //   'uploads/guard/THUMB20220103/62280f0dc85c4676a1d53cdeba077f92.png',
      //   'uploads/guard/THUMB20220103/7f157467b97c4a5b8e155851505f0163.png',
      //   'uploads/guard/THUMB20220103/f14ac28671ff46bf9eef81dfa406e2b0.png'
      // ]
      // _this.setData({
      //   // goodsInfo:res.data,
      //   notConfirm: false,
      //   // imgList:goods.orderDocumentsInfo[0]?.layerImgList.map(e=> requestUrl+'/api/consumer/certifyFree/alibaba/oss/viewFile?fileName='+e)
      //   imgList:bl.map(e=> 'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+e)
      // })
      // console.log('sss',_this.data.orderSn);
      //     wx.hideLoading()
      ordersDetails({
        data: _this.data.orderSn,
      })
        .then((res) => {
          console.log(res);
          if (res.success) {
            _this.setData({
              orderInfo:res.data
            })
            if (!res.data.miniEditionGoodsInfo[0].coverPathList && res.data.miniEditionGoodsInfo[0].coverPathList.length==0) {
              _this.setData({
                btnText: "无法获取文件，请联系客服"
              })
              _this.myAlert("无法获取文件，请联系客服", "错误提示");
            }
            console.log(888,res.data.miniEditionGoodsInfo[0]);
            _this.setData({
               goodsInfo:res.data,
                // imgList:goods.orderDocumentsInfo[0]?.layerImgList.map(e=> requestUrl+'/api/consumer/certifyFree/alibaba/oss/viewFile?fileName='+e)
                // imgList:res.data?.miniEditionGoodsInfo[0].blueFileUrl.map(e=> 'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+e)
                imgList: res.data?.miniEditionGoodsInfo[0].coverPathList.map(e=> 'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+e)
                  //  imgList:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/uploads/guard/THUMB20220103/f14ac28671ff46bf9eef81dfa406e2b0.png'
              })
            console.log('sdfasd', this.data.imgList)
            
          } else {
            _this.myAlert(res.message, "错误提示");
          }
          
          // _this.pdfProp.pdfUrl = 'pdf/20211208/8afb7833e601422e9c29cab77f66378c/84848.pdf'
          _this.setData({
            notConfirm:false
          })
          wx.hideLoading()
        })
        .catch((err) => {
          wx.hideLoading()
          _this.myAlert("获取订单信息失败，请联系客服！", "错误提示");
        });
    },
    /**
     * 提示
     * @param {*} msg 
     * @param {*} title 
     */
    myAlert(msg,title = "提示",judge,id){
      let _this = this;
      wx.showModal({
        title: title,
        content:msg,
        showCancel:false,
        success (res) {
         if(judge){
           wx.setStorageSync('orderId',id)
          wx.redirectTo({
            url: '../../../../categoryPages/print/index?form=lanzhi',
          })
         }else{
          _this.redirectTo()
         }
        }
      })
    },
    /**
     * 跳转页面
     */
    redirectTo() {
      wx.navigateBack({
        delta: 1,
      });
    },
    /**
     * 查看全部图片
     */
    checkAll(e){
      let _this = this;
      let current= _this.data.imgList
      if(e.currentTarget.dataset.url) current = e.currentTarget.dataset.url
      wx.previewImage({
        current, // 当前显示图片的http链接
        urls:_this.data.imgList// 需要预览的图片http链接列表
      })
    },
     /**
     * 修改文件查看状态
     */
      lookFileStatus() {
        let _this = this;
        let goodsId = _this.data.goodsId;
        let val = 2;

        if (goodsId != undefined && goodsId != null) {
          editFileLook({
            isLook: val,
            orderGoodsId: goodsId,
          }).then((res) => {
            _this.sendFile();
          }).catch(()=>{
            wx.hideLoading()
            _this.myAlert('网络错误，请稍后重试', "错误提示");
          });
        }else{
          wx.hideLoading()
          _this.myAlert('获取信息失败，请稍后重试', "错误提示");
        }
      },
      /**
     * 确认文件
     */
    sendFile() {
      let _this = this;
      // confirmBluePaper() 确认兰纸请求
      wx.showLoading({
        title: '正在确认...',
      })
      confirmBluePaper({
        orderNo: _this.data.orderSn,
        orderGoodsId: _this.data.goodsId
      }).then((res) => {
        if (res.success) {
          ordersDetails({
            data: _this.data.orderSn,
          }).then((res) => {
            console.log(193,res.data,res.data.id);
              if (res.success) {
                _this.myAlert("已确认兰纸文件，立即下单",'','order',res.data.id);
                
              } else {
                _this.myAlert(res.message, "错误提示");
              }
              wx.hideLoading()
            })
            .catch((err) => {
              wx.hideLoading()
              _this.myAlert("网络失败");
            });
        } else {
          wx.hideLoading()
          _this.myAlert(res.message, "错误提示");
        }
      }).catch(()=>{
        wx.hideLoading()
        _this.myAlert('网络错误，请稍后重试', "错误提示");
      });
    },
})

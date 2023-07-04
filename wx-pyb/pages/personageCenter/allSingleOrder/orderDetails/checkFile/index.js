//index.js
import { sendFile } from "../../../../../api/orderDetailsApi"
import { getShareOrderDetails,editionFiles,editFileLook,allot } from "../../../../../api/orderApi"
import { cancelConfirmFile } from "../../../../../api/orderDetailsApi.js";
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
    btnText:'确认分层文件',
    showDialog:false,
    notConfirm:true,
    cancelTime:0
  }, 
  onLoad: function (e) {
    let _this = this;
    console.log('e',e);
    // thumbListByGoodsId({id:74907}).then(res=>{
    //   if(res.success&&res.data.length>1){
    //     _this.setData({
    //       imgList:res.data.map(e=> requestUrl+'/api/consumer/certifyFree/alibaba/oss/viewFile?fileName='+e.thumbUrl)
    //     })
    //     wx.previewImage({
    //       current: requestUrl+'/api/consumer/certifyFree/alibaba/oss/viewFile?fileName='+res.data[0].thumbUrl, // 当前显示图片的http链接
    //       urls:res.data.map(e=> requestUrl+'/api/consumer/certifyFree/alibaba/oss/viewFile?fileName='+e.thumbUrl)// 需要预览的图片http链接列表
    //     })
    //   }
    
    // })
    _this.setData({
      orderSn:e.sn,
      goodsId:e.id,
      queryType:e.type
    })
    wx.showLoading({
      title: '加载中...',
    })
    _this.getOrderInfo()
  },
  showDialogFun() {
    let _this = this;
    if (_this.data.btnText === "确认分层文件") {
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
      getShareOrderDetails({
        orderNo: _this.data.orderSn,
      })
        .then((res) => {
          console.log(res);
          if (res.success) {
            _this.setData({
              orderInfo:res.data
            })
            let goods  = res.data.children.find(
              (e) => e.id == _this.data.goodsId
            );
            if (goods.orderDocumentsInfo[0]?.layerImgList.length===0) {
              _this.setData({
                btnText: "无法获取文件，请联系客服"
              })
              _this.myAlert("无法获取文件，请联系客服", "错误提示");
            } else if (goods.confirmTime != "" && goods.confirmTime != 0) {
              _this.setData({
                btnText: "文件已确认,返回订单详情"
              })
            }
            _this.setData({
               goodsInfo:goods,
                // imgList:goods.orderDocumentsInfo[0]?.layerImgList.map(e=> requestUrl+'/api/consumer/certifyFree/alibaba/oss/viewFile?fileName='+e)
                imgList:goods.orderDocumentsInfo[0]?.layerImgList.map(e=> 'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+e),
                cancelTime: (goods.confirmTime*1000+1000*60*15)-new Date().getTime()
              })
            
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
    myAlert(msg,title = "提示"){
      let _this = this;
      wx.showModal({
        title: title,
        content:msg,
        showCancel:false,
        success (res) {
          _this.redirectTo()
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
      let current= _this.data.imgList[0]
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
        wx.showLoading({
          title: '正在修改...',
        })
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
      sendFile({
        orderGoodsId: _this.data.goodsId,
        orderId: _this.data.orderInfo.parentId,
        supOrderId: _this.data.goodsInfo.supOrderId,
      }).then((res) => {
        if (res.success) {
          getShareOrderDetails({
            orderNo: _this.data.orderSn,
          })
            .then((res) => {
              wx.hideLoading()
              if(_this.data.queryType!=='share'){
                allot({ orderNo: _this.data.orderInfo.orderNo }).then((res) => {
                  console.log("allotallotallot", res);
                });
              }
              if (res.success) {
                let good = res.data.children.find((e) => e.id == _this.data.goodsId);
                let msg = `您已确认分层文件，预计${
                  res.data.shippingName === "物流配送" ? "出货" : "提货"
                }日期：${good.outTime}. 立即返回`;
                _this.myAlert(msg, "确认提醒");
              } else {
                _this.myAlert("已确认分层文件，立即返回");
              }
            })
            .catch((err) => {
              wx.hideLoading()
              _this.myAlert("已确认分层文件，立即返回");
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
    /**
     * 撤回确认
     */
    cancelConfirmFileFun(){
      let _this = this;
      console.log('sid',_this.data.goodsInfo.id)
      wx.showModal({
          title: '提示',
          content: '是否取消确认文件?',
          success (res) {
            if (res.confirm) {
              cancelConfirmFile({data:_this.data.goodsInfo.id}).then(res=>{
                  if(res.success){
                    _this.myAlert("取消确认成功，立即返回");
                  }else{
                      wx.showToast({
                          title: '取消确认失败',
                          icon: 'error',
                          duration: 2000
                        })
                  }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      
    },
    /**
     * 倒计时结束
     */
    countDownFinish(){
      this.setData({
        cancelTime:0
      })
    }
})

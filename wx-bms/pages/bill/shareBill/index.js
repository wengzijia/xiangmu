// pages/bill/billDetail/index.js
const app = getApp();
import { getShareOrderBill, addOrderPay, orderPaySuccess } from "../../../api/bill";
import { imageBaseUrl } from "../../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl,
    currentTab: 0,
    show: false,//是否打开支付确认
    show1: false,//是否打开支付成功
    show2: false,//链接失效
    customer: {},
    detailTap: 0,
    inputVal: ' 订单编号和名称',
    name: '光明厂商',
    year: '2022-03',
    billDetail: {
      share_id: '', //分享id
      page_number: 1,
      limit_length: 10,
      attribute_id: "",
      attribute_type: ''
    },
    shareList: {
      supplier_id: '',
      years_month: '',
      order_id: '',
      is_share: 1,
      share_id: ''
    },
    payVal: {},

    monthDetail: {
      "attribute": [
        {
          "attribute_id": 0, //工序id
          "attribute_type": "", //工序类型：1.加工，2.原料
          "number": 1, //数量
          "attribute_name": "全部", //工序名称
          "title": "全部(0)"
        },
      ], //工序信息
      "data": [
      ], //返回数据
      "toHeader": {
        "unpaid_price": 0, //待支付
        "total_price": 0, //总金额
        "paid_price": 0 //已支付
      }, //头部数据
      "supplierInfo": {},
      "is_self": ''//是否是分享人
    },
    loadingType: 0,
    contentText: {
      contentrefresh: "正在加载...",
      contentnomore: "没有更多数据了"
    },
    shareId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this
    //傲彩用户的搜索框文字
    console.log(options);
    if (typeof (options.shareId) != 'undefined') {
      let shareId = options.shareId
      _this.setData({
        ['billDetail.share_id']: shareId,
        ['shareList.share_id']: shareId
      })
    }
    //69/65
    // _this.setData({
    //   ['billDetail.share_id']: 65,
    //   ['shareList.share_id']: 65
    // })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this
    _this.login()

  },


  /**
   * 选择图片
   * @param {*} e 
   */
  checkImg: function (e) {
    let _this = this;
    let src = e.currentTarget.dataset.src
    let list = e.currentTarget.dataset.list
    _this.previewImage(src, list)

  },
  /** 
     * 预览图片
     */
  previewImage: function (current, urls) {
    let _this = this;
    wx.previewImage({
      current: current,
      urls: urls
      // 需要预览的图片http链接列表
    })
  },
  //切换工序列表
  detailTap(e) {
    let _this = this;
    console.log(e);
    let id = e.currentTarget.dataset.idx;
    let type = e.currentTarget.dataset.type;
    if (this.data.detailTap == id) {
      return;
    }
    _this.setData({
      detailTap: id,
      ['billDetail.attribute_id']: id,
      ['billDetail.attribute_type']: type,

    })
    _this.updateIndex()
  },


  // 判断是否登录
  login(e) {
    console.log(e);
    let _this = this
    const token = wx.getStorageSync('token');
    console.log(app.globalData);
    let text;
    if (!token) {
      text = '请登陆后查看账单~'
      _this.isLogin(text)
    } else {
      _this.getShareOrderBill()
    }
  },
  /**
      * 进行授权登陆
      * @param {*} text 
      */
  isLogin(text) {
    let _this = this
    wx.showModal({
      title: '提示',
      cancelText: '否',
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#ff0036',
      content: text,
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '跳转中',
            mask: true
          })
          console.log('666')
          wx.navigateTo({
            url: '../../login/index?shareId=' + _this.data.shareList.share_id,
            complete: () => {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {

        }
      }
    });
    return;
  },
  /**
   * 客户账单月份详情
   */
  getShareOrderBill() {
    let _this = this
    wx.showLoading({
      title:'加载中...',
      mask:true
    });
    if (_this.data.loadingType == 1){
      wx.hideLoading()
      return
    }
  
    let leng = _this.data.billDetail.limit_length
    getShareOrderBill(_this.data.billDetail).then((resluts) => {
      console.log('分享账单返回数据旧：----：',resluts)
      if (resluts.code == 200) {
        if (resluts.data.data.length == 0 || resluts.data.data.length != leng) {
          _this.setData({
            loadingType: 1
          })
        }
        this.setData({
          'billDetail.page_number': _this.data.billDetail.page_number + 1
        })
        for (const item of resluts.data.data) {
          item.process_attr = JSON.parse(item.process_attr).filter(e => { return e.key != 'number' && e.key != 'back_number' && e.key != 'area' })
          item.order_file_url = item.order_file_url.split(",").map(n => {
            return _this.data.imageBaseUrl + n
          });
          let mapStatus = {
            1: '待加工',
            2: '未付款',
            3: '已付款'
          }
          item.status = mapStatus[item.status]
          let mapSettlement = {
            1: '未结算',
            2: '已结算'
          }
          item.is_settlement = mapSettlement[item.is_settlement]
        }
        _this.setData({
          ['monthDetail.attribute']: resluts.data.attribute,
          ['monthDetail.data']: [..._this.data.monthDetail.data, ...resluts.data.data],
          ['monthDetail.toHeader']: resluts.data.toHeader,
          ['monthDetail.supplierInfo']: resluts.data.supplierInfo,
          ['monthDetail.is_self']: resluts.data.is_self,
          ['shareList.supplier_id']: resluts.data.supplierInfo.supplier_id,
          ['shareList.years_month']: resluts.data.supplierInfo.years_month,
        })
      } else if (resluts.code == 4001) {
        _this.setData({
          show2: true
        }
        )
      }
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
    })
  },
  bindPay(e) {
    let id = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status
    let _this = this
    _this.setData({
      ['shareList.order_id']: id
    })
    _this.addOrderPay(status)
  },
  /**
 * 创建支付订单
 */
  addOrderPay(e) {
    let _this = this
    console.log(e);
    addOrderPay(_this.data.shareList).then((resluts) => {
      if (resluts.code == 200) {
        _this.setData({
          payVal: resluts.data
        })
        _this.payUp(e)
        console.log(resluts.data)
      } else {
        wx.showToast({
          title: resluts.msg,
          icon: 'error',
          duration: 2000
        })
      }
    }).catch(() => {
    })
  },
  /**
* 模拟支付成功回调
*/
orderPaySuccess(e) {
  let _this = this
  wx.showLoading({
    title: '支付中...',
    icon: 'loading',
    mask: true
});
  let status = e.currentTarget.dataset.status
  console.log(_this.data.payVal.pay_no);
  let data = {
    pay_no: _this.data.payVal.pay_no,
    amount:_this.data.payVal.price
  }
  orderPaySuccess(data).then((resluts) => {
    if (resluts.code == 200) {
      let payInfo = resluts.data
      wx.requestPayment({
        'timeStamp': payInfo.timeStamp,//时间戳
        'nonceStr': payInfo.nonceStr,//随机字符串
        'package': payInfo.package,//统一下单接口返回的 prepay_id 参数
        'signType': payInfo.signType,//签名算法
        'paySign': payInfo.paySign,//签名
        'success': function (res) {
          _this.payUp('success')
        },
        'fail': function (res) {
          console.log(JSON.stringify(res))
          wx.showModal({
            title: "提示",
            content: "支付失败",
            showCancel: false,
            success: function () { 
              _this.setData({
                show1: false,
                show:false
              });
            }
          })
        }
      })
    
    } else {
      wx.showToast({
        title: resluts.msg,
        icon: 'error',
        duration: 2000
      })
    }
wx.hideLoading()

  }).catch(() => {
wx.hideLoading()

  })
},
  //支付确认弹款
  payUp(e) {
    let _this = this;
    console.log();
    console.log(e);
    if (e == 'gopay') {
      _this.setData({ show: true });
    } else {
      _this.setData({
        show: false,
        show1: true
      });
    }
  },
  //刷新页面
  updateIndex() {
    let _this = this;
    _this.setData({
      ['monthDetail.data']: [],
      ['billDetail.page_number']: 1,
      loadingType: 0,
    });
    _this.getShareOrderBill()
  },
  onClose(e) {
    let _this = this
    let status = e.currentTarget.dataset.status
    if (status == 'bottom') {
      _this.setData({ show: false });
    } else if (status == 'middle') {
      _this.setData({ show1: false });
      _this.updateIndex()
    } else {
      _this.setData({ show2: false });
      wx.switchTab({
        url: '/pages/home/index',
      })
    }
  },
  
  //下拉加载
  bindDownLoad: function () {
    let _this = this;
    if (_this.data.loadingType == 1){
      return
    }
    _this.getShareOrderBill()
    console.log('下拉加载');
  },

})
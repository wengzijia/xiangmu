// pages/bill/billDetail/index.js
const app = getApp();
import { customerBillMonthDetails,getCustomerBillMonthDetails,setAddShareOrderBill, addShareOrderBill } from "../../../../api/bill";
import { getWxUserInfo } from "../../../../api/login";
import { imageBaseUrl } from "../../../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa:true,
    imageBaseUrl,//图片前缀
    currentTab: 0,
    customer: {},
    detailTap: 0,
    inputVal: '订单编号和名称',
    billDetail: {
      attribute_type: 0,//工序类型
      attribute_id: 0,//工序id
      group_sn: '',//单号/商品名称（模糊搜索
      page_number: 1,//页数
      limit_length: 10,//条数 默认10条
      customer_id: "",//客户id/傲彩为0
      years_month: ''//账单年月
    },//请求客户账单月份详情参数
    monthDetail: {
      "attribute": [
        {
          "attribute_id": 0, //工序id
          "attribute_type": "", //工序类型：1.加工，2.原料
          "number": 1, //数量
          "attribute_name": "全部", //工序名称
          "title": "全部(1)"
        },
      ], //工序信息
      "data": [

      ], //返回数据
      "toHeader": {
        "unpaid_price": 0, //待支付
        "total_price": 0, //总金额
        "paid_price": 0 //已支付
      } //头部数据
    },
    loadingType: 0,//下拉数据的状态
    contentText: {
      contentrefresh: "正在加载...",
      contentnomore: "没有更多数据了"
    },
    share_id: '', //分享id
    supplierName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    //傲彩用户的搜索框文字
    if (typeof (options.customer) != 'undefined') {
      let customer = JSON.parse(options.customer)
      _this.setData({
        ['billDetail.customer_id']: customer.id,
        ['billDetail.years_month']: customer.years_month,
        customer: JSON.parse(options.customer),
      })
    }
    //判断输入框显示的文字
    if (_this.data.customer.customer_type == 2) {
      _this.setData({
        inputVal: ' 请输入大版号/PO号',
      })
    } else {
      _this.setData({
        inputVal: ' 请输入订单编号/名称',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this
    console.log(_this.data.customer.customer_type);
    if (_this.data.customer.customer_type == 1) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
    _this.initUserInfo()
    _this.customerBillMonthDetails()
    _this.addShareOrderBill()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //搜索
  getkeywords: function (e) {
    let _this = this
    let val = e.detail.value;
    _this.setData({
      ['billDetail.group_sn']: val
    });
  },
  //清除搜索词
  clearText: function () {
    let _this = this
    _this.setData({
      ['billDetail.group_sn']: '',
    })
    _this.updateIndex()
  },
  //确认搜索内容
  search: function () {
    let _this = this
    _this.updateIndex()
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
    console.log(current);
    wx.previewImage({
      current: current,
      urls: urls
      // 需要预览的图片http链接列表
    })
  },
  //获取工序列表
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
      // ['billDetail.group_sn']: '',
      
    })
    _this.updateIndex()
  },


  /**
   * 客户账单月份详情
   */
  customerBillMonthDetails() {
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
    getCustomerBillMonthDetails(_this.data.billDetail).then((resluts) => {
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
          item.process_attr ?  item.process_attr = JSON.parse(item.process_attr).filter(e => { return e.key != 'number' && e.key != 'back_number' && e.key != 'area' }) : ''
          item.order_file_url ? item.order_file_url = item.order_file_url.split(",").map(n => {
            return _this.data.imageBaseUrl + n
          }) : ''
          for (const key in item.thumb) {
            item.thumb[key] = _this.data.imageBaseUrl + item.thumb[key]
          }
          let mapStatus = {
            1: '待加工',
            2: '未付款',
            3: '已付款'
          }
           item.status = mapStatus[item.status]
         let mapSettlement ={
           1:'未结算',
           2:'已结算'
         }
         item.is_settlement = mapSettlement[item.is_settlement]
        }
        _this.setData({
          ['monthDetail.attribute']: resluts.data.attribute,
          ['monthDetail.data']: [..._this.data.monthDetail.data,...resluts.data.data],
          ['monthDetail.toHeader']: resluts.data.toHeader,
        })
      } 
      wx.hideLoading();
    }).catch(() => {

      wx.hideLoading();
    })
  },
  //下拉加载
  bindDownLoad: function () {
    let _this = this;
    if (_this.data.loadingType == 1){
      return
    }
    _this.customerBillMonthDetails()
  },
  //刷新页面
  updateIndex() {
    let _this = this;
    _this.setData({
      ['monthDetail.data']: [],
      ['billDetail.page_number']: 1,
      loadingType: 0,
    });
    _this.customerBillMonthDetails()
  },
  /**
   * 
   * 添加分享账单
   */
  addShareOrderBill: function () {
    let _this = this
    let data = {
      customer_id: _this.data.customer.id,
      order_id: '',
      years_month: _this.data.customer.years_month
    }
    setAddShareOrderBill(data).then((resluts) => {
      console.log(resluts.data);

      if (resluts.code == 200) {
        _this.setData({
          share_id: resluts.data.share_id
        })

        //分享的厂商名字
        _this.onShareAppMessage = function () {
          console.log(_this.data.share_id);
          return {
            title: '请接收拼一版'  + _this.data.customer.years_month + '月的账单',
            path: '/pages/printingModule/bill/shareBill/index?shareId=' + _this.data.share_id,
            imageUrl:'../../../../image/bill/shareimg.png',
          }
        }
      } else {
      }
      wx.hideLoading();
      _this.setData({
        isShow: true
      })
    }).catch(() => {

      wx.hideLoading();
      _this.setData({
        isShow: true
      })
    })
  },
  //从上一页返回时刷新页面
  go_update(){
    let _this=this;
    _this.updateIndex()
  },
  //修改账单
  editBill(e) {
    let _this = this
    console.log(e.currentTarget.dataset)
    let item = e.currentTarget.dataset.item

    console.log(item.order_id)
    wx.navigateTo({
      url: `../../placeOrder/edit/index?id=${item.attribute_id}&orderId=${item.order_id}&customerId=${_this.data.billDetail.customer_id}&attrType=${item.attribute_type}&isEnabled=${e.currentTarget.dataset.isenabled}`,
    })
  },
  initUserInfo() {
    let _this = this
    getWxUserInfo().then((resluts) => {
      if (resluts.code == 200) {
        _this.setData({
          supplierName: resluts.data.company,
        })
      } else {
      }
    }).catch(() => {
    })
  }
})
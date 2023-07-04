// pages/placeOrder/index.js
import info from '../../utils/processInfo'
import {
  getWxUserInfo,
  getManufacturingProcedure,
  getOrderList,
  deleteOrder,
  paymentOrder,
  pay,
  changeProduction,
  revocationProduction
} from "../../api/processOrder.js"
import {
  imageBaseUrl
} from '../../utils/request'
import Toast from '@vant/weapp/toast/toast';
import {debounce} from "../../utils/util"

Page({
  data: {
    processingForm: ['本厂加工单', '外厂加工单'],
    workOrderIndex: 0, // 加工单下标
    orderStatus: [{
        type: 1,
        name: "待加工"
      },
      {
        type: 4,
        name: "生产中"
      },
      {
        type: 2,
        name: "待付款"
      },
      {
        type: 3,
        name: "已完成"
      },
      {
        type: 0,
        name: "全部"
      }
    ],
    // orderStatus: ['待加工', '待付款', '已完成', '全部'],
    orderIndex: 1, // 订单状态下标 
    processIndex: "all", // 工序状态下标
    is_supplier: "", // 是否加工商     1 是  0 否
    process: [], // 工序
    attribute_type: "", // 工序类型
    attribute_id: 0, // 工序id   0全部
    status: 1, // 默认待加工
    page_number: 1, // 页数
    limit_length: 10, // 条数
    group_sn: "", // 单号/商品名称（模糊搜索）
    orderData: [], // 订单数据
    process_attr: [], // 订单属性
    isPullRefresh: true, // 下拉刷新是否触发
    deleteShow: false, // 删除弹窗显示
    affirmShow: false, // 确认弹窗显示
    payShow: false, // 支付弹窗显示
    orderId: "", // 订单id
    bottom: "24", //  工序底部距离
    height: "calc(100vh - 376rpx)", // 滚动高度
    dataLength: "", // 数据长度
    price: "", // 价格
    yearsmonth: "", // 年月
    supplierid: "", // 供应商id
    order_id: "", // 去付款订单id
    previewShow: false, // 图片预览是否显示 
    showProcess: false, // 是否显示工序
    end: true, // 显示到底
    endText: "加载中...", // 结束文字
    isPullUp: false, // 是否上拉
    value: "", // 搜索框值
    isCancel: false, // 是否取消支付
    isTurnProductionShow: false, // 转生产弹窗显示
    isWithdrawProductionShow: false // 撤回生产弹窗显示
  },
  // 修改加工单下标
  changeType: function (e) {
    let {
      index
    } = e.currentTarget.dataset;
    // 阻止重复点击发多次请求
    if (this.data.workOrderIndex == index) {
      return
    }
    // 修改下标
    if (this.data.type === index || index === undefined) {
      return false;
    } else {
      this.setData({
        workOrderIndex: index
      })
    }
    // 控制工序底部距离和滚动高度
    if (this.data.workOrderIndex == 0) {
      if (this.data.process.length > 2) {
        this.setData({
          bottom: "24",
          height: "calc(100vh - 376rpx)"
        })
      } else {
        this.setData({
          bottom: "24",
          height: "calc(100vh - 276rpx)"
        })
      }
    } else {
      this.setData({
        bottom: "0",
        height: "calc(100vh - 270rpx)"
      })
    }
    // 重置
    this.reset()
    this.clear()
    this.setData({
      isPullUp: false,
      orderIndex: 1,
      status: 1
    })
    // 获取加工单
    this.getProcessOrder()
  },
  // 修改订单状态下标
  changeOrderStatus: function (e) {
    let {
      index
    } = e.currentTarget.dataset;
    console.log('eeeeeeee',e)
    //订单状态 0.全部，1.待加工，2.待付款，3.已完成
    // 设置订单状态
    this.setData({
      status: index,
      isPullUp: false
    })
    // 阻止重复点击发多次请求
    if (this.data.orderIndex == index) {
      return
    }
    // 修改下标
    if (this.data.type === index || index === undefined) {
      return false;
    } else {
      this.setData({
        orderIndex: index
      })
    }
    // 重置
    this.reset()
    this.clear()
    // 获取加工单
    this.getProcessOrder()
  },
  // 修改工序下标
  changeProcessStatus: function (e) {
    let {
      machining_id,
      is_material,
      alias
    } = e.currentTarget.dataset;
    this.setData({
      attribute_type: is_material,
      attribute_id: machining_id,
      isPullUp: false
    })
    // 阻止重复点击发多次请求
    if (this.data.processIndex == alias) {
      return
    }
    // 修改下标
    if (this.data.type === alias || alias === undefined) {
      return false;
    } else {
      this.setData({
        processIndex: alias
      })
    }
    // 重置
    this.reset()
    this.clear()
    // 获取加工单
    this.getProcessOrder()
  },
  scroll(event) {
    console.log('dsf', event.detail.index)
  },
  // 重置页码和清空加工单数据
  reset() {
    this.setData({
      page_number: 1,
      orderData: []
    })
  },
  // 清除搜索框值和搜索参数
  clear() {
    this.setData({
      value: "",
      group_sn: ""
    })
  },
  // 更改记账
  editOrder(e) {
    let {
      id,
      orderid,
      customerid,
      attrtype,
      isenabled
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../placeOrder/edit/index?id=${id}&orderId=${orderid}&customerId=${customerid}&attrType=${attrtype}&isEnabled=${isenabled}`,
    })
  },
  // 去记账
  toChargeUp(e) {
    let {
      id,
      orderid,
      customerid,
      attrtype,
      isenabled
    } = e.currentTarget.dataset
    if (this.data.orderIndex == 4) {
      isenabled = 1
    }
    wx.navigateTo({
      url: `../placeOrder/edit/index?id=${id}&orderId=${orderid}&customerId=${customerid}&attrType=${attrtype}&isEnabled=${isenabled}`,
    })
  },
  // 预览图片
  previewImage(e) {
    let {
      previewimage
    } = e.currentTarget.dataset
    if (previewimage[0]) {
      wx.previewImage({
        urls: previewimage // 需要预览的图片http链接列表
      })
      this.setData({
        previewShow: true
      })
    }
  },
  // 删除订单
  async deleteOrder() {
    let _this = this;
    try {
      wx.showLoading({
        title: '删除中...',
        mask: true
      })
      let {
        code,
        msg
      } = await deleteOrder(_this.data.orderId)
      if (code === 200) {
        setTimeout(function () {
          wx.showToast({
            title: msg
          })
        }, 100)
        // 关闭删除弹窗
        _this.deleteClose()
        // 重置
        _this.reset()
        // 重新发起请求
        _this.getProcessOrder()
      }
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },
  // 显示删除弹窗
  deletePopup(e) {
    let {
      orderid
    } = e.currentTarget.dataset
    if (orderid) {
      this.setData({
        deleteShow: true,
        orderId: orderid
      });
    }
  },
  // 关闭删除弹窗
  deleteClose() {
    this.setData({
      deleteShow: false
    });
  },
  // 显示确认弹窗
  affirmPopup(e) {
    let {
      price,
      supplierid,
      yearsmonth,
      orderid
    } = e.currentTarget.dataset
    this.setData({
      affirmShow: true,
      price,
      yearsmonth,
      supplierid,
      order_id: orderid
    });
  },
  // 去支付
  async toPayment() {
    let _this = this
    let param = {
      supplier_id: this.data.supplierid,
      years_month: this.data.yearsmonth,
      order_id: this.data.order_id,
      is_share: 0,
      share_id: ""
    }
    try {
      wx.showLoading({
        title: '支付中...',
        mask: true
      })
      // 创建支付订单
      let result = await paymentOrder(param)
      if (result.code === 200) {
        let {
          pay_no,
          price
        } = result.data
        let param = {
          pay_no,
          amount: price
        }
        // 支付
        let {
          code,
          data
        } = await pay(param);
        if (code === 200) {
          // 调取微信支付
          wx.requestPayment({
            nonceStr: data.nonceStr, //随机字符串
            package: data.package, //统一下单接口返回的 prepay_id 参数值
            signType: data.signType, //签名算法
            paySign: data.paySign, //签名
            timeStamp: data.timeStamp, //时间戳
            success(res) {
              _this.setData({
                isCancel: true
              })
              _this.payPopup()
            },
            fail(res) {
              _this.setData({
                isCancel: true
              })
              wx.showModal({
                title: "提示",
                content: "支付失败",
                showCancel: false
              })
            },
            complete() {
              _this.affirmClose()
            }
          })
        }
      }
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },
  // 关闭确认弹窗
  affirmClose() {
    this.setData({
      affirmShow: false
    });
  },
  // 显示支付弹窗
  payPopup() {
    this.setData({
      payShow: true
    });
  },
  // 关闭支付弹窗
  payClose() {
    // 待付款 支付 跳到已完成     全部支付就直接刷新页面
    if (this.data.orderIndex == 1) {
      this.setData({
        status: 3,
        orderIndex: 3
      });
    }
    this.setData({
      payShow: false
    });
    this.reset()
    this.clear()
    this.getProcessOrder()
  },
  // 搜索
  search(e) {
    let {
      detail
    } = e
    this.setData({
      group_sn: detail
    })
    this.reset()
    this.getProcessOrder()
  },
  // 取消搜索
  cancelSearch() {
    if (this.data.value) {
      this.setData({
        value: ""
      })
    }
    if (this.data.orderData.length > 0) {
      this.reset()
      this.setData({
        group_sn: ""
      })
      this.getProcessOrder()
    }
  },
  // 获取加工商本厂加工单
  async getProcessOrder() {
    let param = {
      attribute_type: this.data.attribute_type,
      attribute_id: this.data.attribute_id,
      status: this.data.status,
      is_supplier: this.data.is_supplier,
      page_number: this.data.page_number,
      limit_length: this.data.limit_length,
      group_sn: this.data.group_sn
    };
    if (this.data.is_supplier == 1 && this.data.workOrderIndex == 1 || this.data.is_supplier == 0) {
      param.attribute_type = ""
      param.attribute_id = 0
      param.is_supplier = 0
    }
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      let {
        data
      } = await getOrderList(param);
      // 判断长度显示结束文本
      if (data.length < this.data.limit_length) {
        this.setData({
          end: false,
          endText: "-已经到底了-"
        })
      } else {
        this.setData({
          end: false,
          endText: "加载中..."
        })
      }
      // this.setData({
      //   dataLength:data
      // })
      this.data.dataLength = data
      data.map(item => {
        // 图片转换为数组,并进行加工处理添加图片域名
        if(item.order_file_url.length>0){
          item.order_file_url = item.order_file_url.split(',').map(item => {
            // 路径包含uploads才进行处理
            if (item.indexOf('uploads') == 0) {
              return imageBaseUrl + item
            }
          })
        }else{
          item.order_file_url = []
        }
        if(item.group_daomo_file?.length>0){
          item.group_daomo_file = item.group_daomo_file.split(',').map(item => {
            // 路径包含uploads才进行处理
            if (item.indexOf('uploads') == 0) {
              return imageBaseUrl + item
            }
          })
        }else{
          item.group_daomo_file = []
        }
        
        // 转为对象并过滤掉key不等于number的  
        item.process_attr = JSON.parse(item.process_attr).filter(item => {
          return item.key !== "number" && !item.label.includes("制版数量")
        })
        // 匹配CTP制版 双面印刷就显示number+back_number  单面印刷显示 number  其他也是显示number
        if (item.attribute_name.includes("CTP制版")) {
          if (item.paper_type.includes("双面印刷")) {
            item.number = item.number + "+" + item.back_number
          } else {
            item.number = item.number
          }
        } else {
          item.number = item.number
        }
        // 匹配包含尺寸、长度的,添加单位(mm)
        item.process_attr = item.process_attr.map(item => {
          if (item.label.includes("尺寸") || item.label.includes("长度")) {
            item.value = item.value + "mm"
          }
          return item
        })
      })
      //展开运算符 合并数组
      if (this.data.isPullUp) {
        data = [...this.data.orderData, ...data]
        this.setData({
          orderData: data
        })
      } else {
        this.setData({
          orderData: data
        })
      }
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },
  // 上拉加载更多
  scrollLoadMore() {
    this.setData({
      isPullUp: true
    })
    // 优化
    if (this.data.dataLength.length > 0) {
      this.data.page_number++
      this.getProcessOrder()
    }
  },
  // 下拉刷新
  pullToRefresh() {
    // 重置
    this.reset()
    // 复位
    this.setData({
      isPullRefresh: false
    })
    this.getProcessOrder()
  },
  // 转生产弹窗确认
  turnProductionShow(e) {
    console.log(e);
    let {
      orderid
    } = e.currentTarget.dataset
    let _this = this;
    let orderInfo = _this.data.orderData.find(e => orderid == e.order_id )
    console.log('orderInfo',orderInfo)
    //需要第二种图片的工序信息
    let imgTowIds = [{
      attribute_type:1,
      attribute_id:4
    },{
      attribute_type:1,
      attribute_id:7
    },{
      attribute_type:1,
      attribute_id:8
    }]
    if(orderInfo.order_file_url.length==0){
      Toast.fail('请完善订单图片信息')
    }else if(imgTowIds.find(e => e.attribute_type==orderInfo.attribute_type&&e.attribute_id==orderInfo.attribute_id)&&orderInfo.group_daomo_file.length==0){
      Toast.fail('请完善订单图片信息')
    }else{
      _this.setData({
        isTurnProductionShow: true,
        orderId:orderid
      })
    } 
    
  },
  // 关闭生产弹窗
  turnProductionClose() {
    let _this = this;
    _this.setData({
      isTurnProductionShow: false
    })
  },
  // 转生产(防抖)
   turnProduction:debounce(async function(){
    let _this = this;
    try{
    wx.showLoading({
      title: '转生产中...'
    })
    let {
      code,
      data,
      msg
    } = await changeProduction(this.data.orderId);
    if(code === 200){
      wx.showToast({
        title: data,
        complete:()=>{
          setTimeout(function(){
            _this.setData({
              orderIndex: 4,
              status: 4
            })
            _this.reset()
            _this.getProcessOrder()
          },2000)
        }
      })
    }else{
        // wx.showToast({
        //   title: "转生产失败",
        //   icon:"none"
        // })
        Toast(msg)
    }
    _this.setData({
      isTurnProductionShow: false
    })
    setTimeout(function(){
      wx.hideLoading()
    },2000)
  }catch(err){
    wx.hideLoading()
    console.log(err.message);
  }
  },500),
  // 撤回生产弹窗
  withdrawProductionShow(e){
    let _this = this;
    let { orderid} = e.currentTarget.dataset;
    _this.setData({
      orderId:orderid,
      isWithdrawProductionShow:true
    })
  },
  // 关闭撤回生产弹窗
  withdrawProductionClose(){
    this.setData({
      isWithdrawProductionShow:false
    })
  },
  // 撤回生产(防抖)
  withdrawProduction:debounce(async function(){
    let _this = this;
    try{
    wx.showLoading({
      title:"撤回中..."
    })
    let { code,msg } = await  revocationProduction(_this.data.orderId);
    if(code === 200){
      wx.showToast({
        title: msg,
        complete(res){
          setTimeout(function(){
            _this.setData({
              orderIndex: 1,
              status: 1
            })
            _this.reset()
            _this.getProcessOrder()
          },2000)
        }
      })
    }else{
      wx.showToast({
        title: '已上机生产，不允许撤回',
        icon:'none'
      })
    }
    _this.setData({
      isWithdrawProductionShow:false
    })
    setTimeout(function(){
      wx.hideLoading()
    },2000)
  }catch(err){
    wx.hideLoading()
    console.log(err.message);
  }
  },500),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.data.orderStatus.splice(1,0,'生产中')
    // console.log('sd',this.data.orderStatus);
    // this.setData({
    //     orderStatus:this.data.orderStatus
    // })
    let {
      status
    } = options
    // 跳转到生产中列表
    if (status == 3) {
      status = 4
    }
    // 判断更改记账,去记账传过来的状态
    if (status) {
      this.setData({
        orderIndex: status,
        status: status
      })
      this.reset()
      this.getProcessOrder()
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
  async onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '提示',
        cancelText: '否',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#ff0036',
        content: "您未授权登录，无法访问该页面，请前往授权登录",
        success(res) {
          let {
            cancel,
            confirm
          } = res
          if (confirm) {
            wx.navigateTo({
              url: '../login/index',
            })
          }
        }
      })
      return
    }
    if (this.data.previewShow) {
      this.setData({
        previewShow: false
      })
      return
    }
    if (this.data.isCancel) {
      this.setData({
        isCancel: false
      })
      return
    }
    // 重置
    this.reset()
    this.clear()
    this.setData({
      isPullUp: false,
      attribute_id: 0,
      processIndex: "all"
    })
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      // 获取加工工序
      let result = await getManufacturingProcedure();
      // 添加全部工序
      result.data.unshift({
        alias: "all",
        is_material: 0,
        is_po_sn: 0,
        machining_id: 0,
        machining_name: "全部",
        machining_status: 1
      })
      let {
        data
      } = await getWxUserInfo();
      this.setData({
        is_supplier: data.is_supplier,
        process: result.data
      })
      // 工序长度小于3 隐藏工序 设置滚动高度
      if (this.data.process.length < 3) {
        this.setData({
          showProcess: false,
          height: "calc(100vh - 274rpx)"
        })
        if (this.data.is_supplier == 0) {
          this.setData({
            height: "calc(100vh - 180rpx)"
          })
        }
      } else {
        this.data.workOrderIndex == 1 ? this.setData({
          showProcess: true,
          bottom: "0",
          height: "calc(100vh - 270rpx)"
        }) : this.setData({
          showProcess: true,
          bottom: "24",
          height: "calc(100vh - 376rpx)"
        })
      }
      this.getProcessOrder()
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
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
  // go_update(){
  //   console.log('刷新');
  // }
})
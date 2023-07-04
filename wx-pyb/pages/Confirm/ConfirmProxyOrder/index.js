// page/component/new-pages/cart/cart.js
import { checkEdition, addEditionOrder, createWxPayUrl, createWxPayUrl2 } from "../../../api/cartApi.js";
import { createOrder,addEditionAndSupplierOrders,delivery } from "../../../api/orderApi.js";

const app = getApp()

Page({

  data: {
    carts: [],
    cartsObject:{},
    totalPrice: 0,
    username: '',
    phone: '',
    remarks: '',
    cuttingFeeprice:0,
    discountsPaperprice:0,
    isFrom:0,
    priceArr:[],
    cprice:0,
    differ:0,
    totalOrder:'',
    pitCprice:0,
    // orderTime:'',
    pickUpDate:'',
    modelNum:0,//模数
    modelNum2:0,//最大模数
    goods:null,
    goodsCache:null,
    endPrice:0,
    superOrderAttr:''
  },

  onLoad: function (o) {
    wx.showShareMenu()
    // console.log('ooooooo', o);
    this.getcheckEdition(o.isFrom == 1 ? 1 :0);
    this.setData({
      username: wx.getStorageSync('username'),
      phone: wx.getStorageSync('phone'),
      superOrderAttr: JSON.parse(wx.getStorageSync('superOrderAttr')),
      isFrom:o.isFrom,
      // pickUpDate:o.pickUpDate,
      endPrice:o.endPrice||0,
    })
    delivery({"deliveryDay": 7,"type": 1}).then(res=>{
      if (res.success) {
        this.setData({
          pickUpDate:res.data.split(' ')[0]
        })
      }
    })
  },
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  //添加商品
  addGoods(){
    let arr = this.data.carts
    let obj = this.data.cartsObject
    obj.model = null
    obj.number = null
    arr.push(JSON.parse(JSON.stringify(obj)))
    this.setData({
      carts:arr
    }) 
    // console.log('this.data.carts',this.data.carts);
  },
  //删除商品
  delGoods(){
    if (this.data.carts.length>1) {
      this.data.carts.splice(this.data.carts.length-1,1)
      this.setData({
        carts:this.data.carts
      }) 
    }
  },
  getcheckEdition(isFrom) {
    var cuttingFeep=0
    var discountsPaperp=0
    checkEdition({ isFrom }).then(res => {
      if (!res.success) {
        wx.showModal({
          title: '提示',
          content: '没有找到订单数据,请稍后重试！',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
        return false;
      }
      let obj = {
        sizeLength:null,//长
        sizeWidth:null,//宽
        model:null,//模数
        number:null,//数量
      }
      var size = ""
      var goodsStr = ""
      var modelNumber = 0
      var goods = res.data.cartEditions.map(e =>{
        e.discountDetail=JSON.parse(e.discountDetail)
        var arr = e.goodsAttr.split(';');
        arr.forEach((items,i)=>{
          if (items.indexOf('吨价')!=-1) {
            arr.splice(i,1)
          }
          if (items.indexOf('尺寸')!=-1) {
            size = items.split(':')[1]
            arr.splice(i,1)
          }
          if (items.indexOf('模数')!=-1) {
            modelNumber = Number(items.split(':')[1])
            arr.splice(i,1)
          }
        })
        goodsStr = JSON.parse(JSON.stringify(arr.join(';')))
        arr = arr.map(e =>{
          return e.split(':')
        })
        e.newgoods = arr.filter(s=>{return s!=""})
        return e
      })[0]
      let sizeArr = size.split('*')
      obj.sizeLength = sizeArr[0].split('.0')[0]
      obj.sizeWidth = sizeArr[1].split('.0')[0]
      this.setData({
        totalOrder:(res.data.totalAmount-this.data.endPrice).toFixed(2),
        cartsObject:JSON.parse(JSON.stringify(obj)),
        carts:[obj],
        goods:JSON.parse(JSON.stringify(goods)),
        goodsCache:goodsStr,
        modelNum2:modelNumber
      })
      // this.getTotalPrice()
    })
  },
  //盒型宽高
  inputVal(e){
    let index = e.currentTarget.dataset.key
    let value = Number(e.detail.value)
    let type = e.currentTarget.dataset.type
    let sizeObj = this.data.cartsObject
    let big = (sizeObj.sizeLength>sizeObj.sizeWidth)?sizeObj.sizeLength:sizeObj.sizeWidth
    let small = (sizeObj.sizeLength>sizeObj.sizeWidth)?sizeObj.sizeWidth:sizeObj.sizeLength
    if (!value) {
      value=null
    }
    this.setData({
      ["carts["+ index +"]."+type]:value
    })
    if ((this.data.carts[index].sizeLength*1>big||this.data.carts[index].sizeWidth*1>big)||(this.data.carts[index].sizeLength*1>small&&this.data.carts[index].sizeWidth*1>small)){
      wx.showToast({
        title: `尺寸不能超出${big}*${small}`, // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
      this.setData({
        ["carts["+ index +"]."+type]:null
      })
    }
  },
  //改变模数
  changeModel(e){
    let index = e.currentTarget.dataset.key
    let value = Number(e.detail.value)
    if (!value) {
      value=null
    }
    this.setData({
      ["carts["+ index +"].model"]:value
    })
    var num = 0
    this.data.carts.forEach(item=>{
      num+=Number(item.model)
    })
    if (num>this.data.modelNum2) {
      wx.showToast({
        title: '模数总数超过最大值', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
      value=(this.data.modelNum2-(num-value))
      this.setData({
        ["carts["+ index +"].model"]:value
      })
    }
    num=+Number(value)
    this.setData({
      modelNum:num
    })
    let flag = this.verificationNumber(index)
    if (flag) {
      this.setData({
        ["carts["+ index +"].number"]:flag||null
      })
      wx.showToast({
        title: '印刷数量超出最大数量', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    }
  },
  //改变印刷数量
  changeNumber(e){
    let index = e.currentTarget.dataset.key
    let value = Number(e.detail.value)
    if (!value) {
      value=null
    }
    this.setData({
      ["carts["+ index +"].number"]:value
    })
    let flag = this.verificationNumber(index)
    if (flag) {
      this.setData({
        ["carts["+ index +"].number"]:flag||null
      })
      wx.showToast({
        title: '印刷数量超出最大数量', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    }
  },
  //校验 (模数*印张数量>=印刷数量)
  verificationNumber(i){
    let MaxNumber = (this.data.carts[i].model||this.data.modelNum2)*this.data.goods.num
    let printingNumber = this.data.carts[i].number||0
    // console.log('校验',i,this.data.carts[i].model,this.data.goods.num,printingNumber);
    if (MaxNumber&&printingNumber&&(printingNumber>MaxNumber)) {
      return MaxNumber
    }else{
      return false
    }
  },
  //校验数据
  verificationCarts(){
    var modelNumber3 = 0
    let arr = this.data.carts.map((item,i)=>{
      modelNumber3+=Number(item.model)
      if ((!item.sizeLength)||(!item.sizeWidth)||(!item.model)||(!item.number)) {
        return i+1
      }else{
        return null
      }
    })
    arr = arr.filter(a=>a)
    if (arr.length>0) {
      return `第${arr.join('，')}个盒型有参数未填写`
    }
    if (modelNumber3>this.data.modelNum2) {
      return "超出最大模数"
    }
    if (modelNumber3!==this.data.modelNum2) {
      return `盒型模数总和与订单模数${this.data.modelNum2}不一致`
    }
  },
  coniventTime(time){
    var date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ?'0'+date.getDate():date.getDate()
    return Y + M + D;
  },
  formname(e) {
    this.setData({
      username: e.detail.value
    })
  },
  formphone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  formremarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },

  joinStr(i){
    let _this = this
    let obj = { 
      miniCart:{
        extendsStr:'0',
        goodsAttr: `展开尺寸:${Number(_this.data.carts[i].sizeLength).toFixed(2)}_${Number(_this.data.carts[i].sizeWidth).toFixed(2)};`+_this.data.superOrderAttr,//属性
        goodsId:640,
        isfrom:0,
        num:_this.data.carts[i].number,//商品数量
        totalTime:7*24,
        webfrom:1
      },
      number:_this.data.carts[i].model
    }
    return obj
  },

  

  ordernow() {
    let _this = this
    // console.log(this.data.username, this.data.phone)
    // this.data.username
    // if(this.data.username.length>=1&&this.data.phone.length==11&&this.data.username.length<15){
    // else 
    // var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    
    var nameReg = /^[\u4E00-\u9FA5]{2,15}$/;
    if (!nameReg.test(this.data.username)) {
      wx.showToast({
        title: '请输入正确姓名', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    }else if (!/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    }else if(this.data.remarks.length>120){
      wx.showToast({
        title: '备注字数不能超过120个', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    } else {
      // wx.removeStorage({ key: 'username' })
      // wx.removeStorage({ key: 'phone' })
      wx.setStorage({
        key: 'username',
        data: this.data.username
      })
      wx.setStorage({
        key: 'phone',
        data: this.data.phone
      })
      let msg = this.verificationCarts()
      if (msg) {
        wx.showToast({
          title:msg,
          icon: 'none',
          duration: 2000
        })
        return
      }
      console.log(msg);
      wx.showLoading({
        title:'正在提交',
        mask:true
      })
      
      // let obj = {"factoryId":0,"fnumber":1,"goodsAttr":"纸张材质:单铜纸_150;印张尺寸:501.00*500.00mm;面纸吨价:1000元;纸张费用:187.88元;印刷费用:100元;表处理费用:100元(哑胶);啤费用(含刀版):100元;粘盒费用:100元;","isFollowinfo":0,"isFrom":1,"moldNum":1,"number":"5000","paperId":0,"memo":"","type":0,"version":3}
      let arr = this.data.carts.map((item,i)=>{
        return  this.joinStr(i)
      })
      let data = {
        editionOrderReq:{ 
          customer: this.data.username, 
          mobile:this.data.phone, 
          memo: this.data.remarks, 
          isFrom: 1,
          amountNopaid:Number(this.data.endPrice)//尾款 
        },
        saveReqList:arr
      }
      addEditionAndSupplierOrders(data).then(res=>{
        wx.hideLoading();
        if(!res.success){
          // wx.fail({message:res.message})
          wx.showToast({
            title:res.message+'，请联系客服',
            icon: 'none',
            duration: 2000
          })
          return
        }
        var ordernum = res.data[0].children[0]
        // console.log('112223323',res,ordernum);
        wx.showModal({
          title: '订单提交成功！',
          content: '',
          confirmText:'去支付', 
          cancelText:'取消', 
          success (modalRes) {
            if (modalRes.confirm) {
              console.log('用户点击确定')
              if (res.data.length == 1) {
                createWxPayUrl({ orderNo: res.data[0].data, payType: app.globalData.payType }).then(res => {
                  var payBean = JSON.parse(res.data)
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': payBean.timeStamp,//时间戳
                    'nonceStr': payBean.nonceStr,//随机字符串
                    'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
                    'signType': payBean.signType,//非必要——签名算法
                    'paySign': payBean.paySign,//签名
                    'success': function (res) {
                      wx.hideLoading()
                      _this.setData({
                        toastShow: true
                      })
                      wx.redirectTo({
                        // url: '../turntable/index?data=' + ordernum
                        url:'../../personageCenter/newOrder/orderDetails/index?data=' + ordernum
                      })
                    },
                    'fail': function (res) {
                      console.log(JSON.stringify(res))
                      console.log(res)
                      wx.hideLoading()
                      wx.showModal({
                        title: "提示",
                        content: "支付失败",
                        showCancel: false,
                        success: function () { 
                          wx.redirectTo({
                            // url: '../personageCenter/allOrder/index?type=0'
                            url:'../../personageCenter/newOrder/orderDetails/index?data=' + ordernum
                          })
                        }
                      })
                    }
                  })
                })
              } else if (res.data.length > 1) {
                var allorder=[]
                res.data.forEach(e=>{
                  // console.log(e.data)
                  allorder.push(e.data)
                })

                createOrder({ list: allorder }).then(resp => {
                  createWxPayUrl2({ orderNo: resp.data.orderNo, payType: app.globalData.payType }).then(res => {
                    var payBean = JSON.parse(res.data)
                    console.log(res)
                    wx.requestPayment({
                      'timeStamp': payBean.timeStamp,//时间戳
                      'nonceStr': payBean.nonceStr,//随机字符串
                      'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
                      'signType': payBean.signType,//非必要——签名算法
                      'paySign': payBean.paySign,//签名
                      'success': function (res) {
                        wx.hideLoading()
                        _this.setData({
                          toastShow: true
                        })
                        wx.redirectTo({
                          url: '../../personageCenter/newOrder/index?type=0'
                          // url: '../turntable/index?orderNo='+resp.data.orderNo
                        })
                      },
                      'fail': function (res) {
                        console.log(JSON.stringify(res))
                        console.log(res)
                        wx.hideLoading()
                        wx.showModal({
                          title: "提示",
                          content: "支付失败",
                          showCancel: false,
                          success: function () {
                            wx.redirectTo({
                              url: '../../personageCenter/newOrder/index?type=0'
                              // url: '../turntable/index?orderNo='+resp.data.orderNo
                            })
                          }
                        })

                      }
                    })
                  })


                })
              }
            } else if (modalRes.cancel) {
              wx.showToast({
                title: '取消支付订单',
                icon: 'none',
                duration: 2000,
                success: function () {
                  if(res.data.length == 1){
                    wx.redirectTo({
                      url:'../../personageCenter/newOrder/orderDetails/index?data=' + ordernum
                    })
                  }else if(res.data.length > 1){
                    wx.redirectTo({
                      url: '../../personageCenter/newOrder/index?type=0'
                    })
                  }
                 
                }
              })
            
            }
          }
        })
      }).catch(err=>{
        console.log(err);
      })
    }

  },
  getTotalPrice() {
    var carts = this.data.carts;                  // 获取购物车列表
    var total = 0;
    var cprice=0;
    console.log('cartscartscarts',carts)
    var priceArr = [
      {title:'纸价',original:0 ,discount:0,count: 0},
      {title:'切纸价',original:0,discount:0,count:0},
      {title:'印刷费',original:0,discount:'',count:0},
    ]
    for (var i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].ischeck) {                     // 判断选中才会计算价格
        // total += carts[i].num * carts[i].goodsTotal;   // 所有价格加起来
        // total += carts[i].goodsTotal;   // 所有价格加起来
        total += carts[i].goodsTotal-carts[i].discountDetail.colorMoney-carts[i].discountDetail.spotMoney;   // 所有价格加起来
        cprice+=carts[i].discountDetail.priceOne+carts[i].discountDetail.cuttingFee-carts[i].discountDetail.price
        priceArr[0].original = priceArr[0].original+carts[i].discountDetail.paperPriceOne
        priceArr[0].discount = priceArr[0].discount+carts[i].discountDetail.paperPriceOne-carts[i].discountDetail.paperPrice
        priceArr[0].count = priceArr[0].count+carts[i].discountDetail.paperPrice

        priceArr[1].original = priceArr[1].original+carts[i].discountDetail.cuttingFee
        priceArr[1].discount = priceArr[1].discount+carts[i].discountDetail.cuttingFee
        
        priceArr[2].original = priceArr[2].original+carts[i].discountDetail.colorMoney
        priceArr[2].count = priceArr[2].count+carts[i].discountDetail.colorMoney
      }
    }
    // console.log('differ',this.data.differ)
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      priceArr,
      cprice,
      // pitCprice:Math.floor(this.data.differ*100-this.data.totalOrder*100)/100
    });
    // console.log('differ',this.data.differ,'pitCprice',this.data.differ*100,this.data.totalOrder)
  }

})
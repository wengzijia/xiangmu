//index.js
//获取应用实例
const app = getApp();
import {throttling,debounce,copyQQ} from '../../../utils/util'
import {
  listPark,
  listPaper,
  listTon,
  getLose,
  getPrice,
  countCart,
  checkPantone,
  getByUidGetFactory,
  getByUidGetPapertonprice,
  saveFactory,
  savePapertonprice,
  getByKey,
  listAllPaperShop,
  listPaperShopPaper
} from "../../../api/orderDetailsApi.js";
import {
  addEdition,
} from "../../../api/cartApi.js";
Page({
  data: {
    offerInfo: {
      materialType: {
        depend: [],
        list: [],
      },
      thickness: {
        depend: ["materialType"],
        list: [],
      },
      tonsPrice: {
        depend: ["materialType"],
        list: [],
        listStr: ``,
      },
      manufactureAddress: {
        depend: [],
        list: [],
      },
      manufacturers: {
        depend: ["manufactureAddress"],
        list: [],
        listStr: "",
      },
    },
    offerData: {
      thickness:'',
      materialType: "",
      manufactureAddress: "",
      address: "",
      tonsPrice: "",
      printingNum: '',
      manufacturers: "",
      letNumber: 0,
      sizeWidth: "",
      sizeLength: "",
      memo:'',
      brand:'',
      paperShop:'',
      paperShop2:'',
      factory:'',
      paperId:'',
      paperTonprice:0,
      sale:'',
      printId:'',
      factoryId:''
    },
    saleNameList:[],
    papertonPriceList:[],
    allEnterFactoryList:[],
    isColorNumBtn:false,
    isColorNumBtnArr:[],
    isShowIsChalk:false,
    msg: "",
    price: "0.00",
    originalPrice:"0.00",
    catchtou: false,
    cartCount: 0,
    countLoseTimeNum:null,
    countLoseTimer:null,
    editionTimeNum:null,
    editionTimer:null,
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
  },
    priceObj:{},
    priceArr:[],
    enterFactoryList:[],//印刷厂输入记录列表
    paperShopList:[],//纸行名称输入记录列表
    brandList:[],//纸张品牌输入记录列表
    isShowBottomView:false,//是否显示底部垫高组件
    DiscountPrice:0,//纸价优惠额度
    Discount:0,//纸价优惠额度
    paperShopList2:[],//纸行列表
    saleList:[],//业务员列表
    printList:[
      {name:'傲彩印刷',id:1},
    ],//印刷厂列表
  },
  onShow(){
    this.getCountCart();
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
    this.setData({
      papertonPriceList:[]
    })
  },
  onLoad: function (o) {
    if(o.paper!=='0'){
      let obj = {
        currentTarget:{
          dataset:{
            val:  o.paper,
            key:'paperShop2'
          }
        }
      }
      this.radioTap(obj)
    }
    wx.showShareMenu()
    this.getPaperShopList();
    this.getFactory()
  },
  other:function (params) {
    wx.redirectTo({
      url:'./other/index'
    })
  },
  /**
   * 获取纸行列表
   * @param {*} params 
   */
  getPaperShopList:function (params) {
    listAllPaperShop({}).then(res=>{
      if (res.success) {
        let arr = res.data.map(e =>{
          return e.saleList.map(e2=>{
            return e.paperShop+'_'+e2.name
          })
        })
        let arr2 = arr.reduce(function (a, b) { return a.concat(b)} )
        this.setData({
          paperShopList2:res.data,
          saleNameList:arr2,
        })
        if(this.data.offerData.paperShop2==''){
          let obj = {
            currentTarget:{
              dataset:{
                val: res.data[0].id,
                name: res.data[0].paperShop,
                key:'paperShop2'
              }
            }
          }
          this.radioTap(obj)
        }
        
      // this.getListPaper();
      }
    })
  },
  /**
   * tabs切换
   * @param {*} e 
   * @returns 
   */
  tabsCrount: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  /**
   * 消息提示
   * @param {Object} 
   */
  modalFun({contentText,icon,iconSize,image,imageSize,time}){
    var than = this;
    this.setData({
      modal: {
        show: true,
        contentText,icon,iconSize,image,imageSize
      }
    })
    setTimeout(() => {
      than.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
    }) }, time?time:2000);
  },
  /**
   * 获取纸张信息
   */
  getListPaper() {
    this.setData({
      "offerData.materialType":''
    })
    if (this.data.offerData.paperShop2=='other' || this.data.offerData.paperShop2=='jinfu' ) {
      listPaper({orderType:1}).then((res) => {
        if (res.success) {
          this.setData({
            "offerInfo.materialType.list": res.data.map((e) => {
              return { ...e, value: e.data.name, lable: e.data.name };
            }),
          });
        }
      });
    }else{
      listPaperShopPaper({data:this.data.offerData.paperShop2}).then((res) => {
        if (res.success) {
          this.setData({
            "offerInfo.materialType.list": res.data.map((e) => {
              return { ...e, value: e.data.name, lable: e.data.name };
            }),
          });
        }
      });
    }
  },
  /**
   * 获取园区信息
   */
  getListPark(bool) {
    var than = this;
    if(!bool){
      if(than.data.offerData.thickness==''||than.data.offerData.sizeWidth==''||than.data.offerData.sizeLength==''){
        return
      }
    }
    listPark({
      kg:than.data.offerData.thickness,
      width:than.data.offerData.sizeWidth,
      length:than.data.offerData.sizeLength
    }).then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        var data = res.data;
        var factoryList = []
        var listStr = ''
        var manufacturers = '';
        var manufactureAddress = than.data.offerData.manufactureAddress;
        var address = ''
        var factoryId = ''
        if(manufactureAddress==''){
          factoryList =  res.data[0].factoryList
          listStr = factoryList.map((e) => e.factoryName)
          .join()
        }else{
          var park = data.find(s =>  s.park.parkName==manufactureAddress)
          factoryList =  park.factoryList
          listStr = park.factoryList.map((e) => e.factoryName).join()
          var o = park.factoryList.find(s =>  s.factoryName=== than.data.offerData.manufacturers);
          manufacturers = o?.factoryName?o.factoryName: park.factoryList[0]?.factoryName
          address = o?.factoryAddress?o.factoryAddress: park.factoryList[0]?.factoryAddress
          factoryId = o?.factoryId?o.factoryId:park.factoryList[0]?.factoryId
        }
        than.setData({
          "offerInfo.manufactureAddress.list": data.map((e) => {
            return { ...e, value: e.park.parkName, lable: e.park.parkName };
          }),
          "offerInfo.manufacturers.list": factoryList,
          "offerInfo.manufacturers.listStr":listStr,
          'offerData.manufacturers':manufacturers,
          'offerData.address':address,
          "offerData.factoryId":factoryId
        });
    
        than.countPrice();
      }
      
    });
  },
  /**
   * 获取购物车合计
   */
  getCountCart() {
    countCart().then((res) => {
      if(res.success){
        this.setData({
          cartCount: res.data,
        });
      }
    });
  },
  /**进入订单须知 */
  notice: function () {
    wx.navigateTo({
      url: "../../orderNotice/index",
    });
  },
  /**进入购物车列表 */
  checkCart() {
    wx.switchTab({
      url: "/pages/singleCart/index",
    });
    // wx.navigateTo({
    //   url: '/pages/cart/index',
    // })
  },
  /**
   * 获取search的值
   * @param {*} e 
   */
  async getSearchValue(e){
    var key = e.currentTarget.dataset.key
    var value = e.detail;
    // console.log('this.data[key]',this.data[key]);
    this.setData({
      [key]:value||'',
      isShowBottomView:false
    });

    if (key=='offerData.factory') {
      if (!value) {
        this.setData({
          'offerData.factoryId':'',
          'priceObj.price':'',
          'priceObj.priceOne':'',
        })
        return
      }
      let fId = await this.setSaveFactory()
      this.setData({
        'offerData.factoryId':fId,
      })
      if (this.data.offerData.tonsPrice&&this.data.DiscountPrice) {
        this.setData({
          'offerData.paperTonprice':(this.data.offerData.tonsPrice*100 - this.data.DiscountPrice*100)/100
        })
      }
    }
    this.countPrice();
  },
  /**获取容器高度，使页面滚动到容器底部
   *  */ 
  pageScrollToBottom: function() {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function(rect){
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  /**
   * 输入框事件
   * @param {*} e
   * @returns 
   */
  async inputVal(e) {
    var than = this
    var key = e.currentTarget.dataset.key
    var value = e.detail.value;
    // if(value==''){
    //   return 
    // }
    if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.tonsPrice'){
      value = Number(e.detail.value)
      if (key=='offerData.tonsPrice') {
        if (value) {
          value = parseInt(value*100)/100
          this.setData({
            'offerData.tonsPrice': value,
            'offerData.paperTonprice':(value*100 - this.data.DiscountPrice*100)/100
          })
        } else {
          this.setData({
            'offerData.tonsPrice': ''
          })
        }
        this.countPrice();
      }
    }
     //如果传进来的值与之前的值一样，就直接退出操作
    await this.printBookmarks(this.data, 0,e.currentTarget.dataset.key.split("."));
    if(this.data.printInfo===value) {
      return
    }
    if (key && key!='offerData.tonsPrice') {
      this.setData({
        [key]:value||null
      });
      if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'){
        var width = this.data.offerData.sizeWidth
        var length = this.data.offerData.sizeLength
        var bool = false
        var contentText = ''
        if(length<1||width<1){
          bool = true
          contentText = '尺寸不能低于1mm'
        }
        if(length!==''&&width!==''&&bool){
          than.modalFun({contentText:contentText,time:1000})
          var list = than.data.offerInfo.manufactureAddress.list
          this.setData({
            "offerInfo.manufactureAddress.list": list.map((e) => {
              e.factoryList = []
              return e;
            }),
            "offerInfo.manufacturers.list": [],
            "offerInfo.manufacturers.listStr": '',
            "offerData.manufactureAddress":'',
            'offerData.manufacturers':'',
            price: '0.00' ,
            originalPrice: '0.00',
            'offerData.letNumber':0,
            priceArr:[],
            priceObj:{}
          });
        }else{
          than.countPrice()
        }
      }
    }
    var reg = /technology\.uv\.uvNum/g
    if(reg.test(key)){
      than.countPrice()
    }
    // console.log(487,key);
   if(key==='offerData.tonsPrice'&&this.data.offerData.factoryId&&this.data.DiscountPrice){
    // await than.setSavePapertonprice()
    this.setData({
      'offerData.paperTonprice': (value*100 - this.data.DiscountPrice*100)/100,
    }) 
    than.countPrice()
   }
  },
  /**
   * 获取吨价
   */
  getListTon() {
    var than = this;
    listTon({
      kg: than.data.offerData.thickness,
      language: "zh-cn",
      paperType: than.data.offerData.materialType,
    }).then((res) => {
      if (res.success) {
        if( res.data.length<1){
          than.modalFun({contentText:"该品类暂无纸张吨价信息",time:1000})
      
          than.setData({
            "offerInfo.tonsPrice.list": [],
            "offerInfo.tonsPrice.listStr": '',
            "offerData.tonsPrice": ''
          });
        }else{
          var arr = res.data.map((e) => ({
            ...e,
            value: e.id,
            lable: e.brand+'/'+e.colour+'  ￥'+e.paperTonprice+'/吨',
          }));
          than.setData({
            "offerInfo.tonsPrice.list": arr,
            "offerInfo.tonsPrice.listStr": arr.map((s) => s.lable).join(),
            "offerData.tonsPrice": arr[0]?arr[0].lable:'',
          });
        }
      }
    });
  },
  /**
   * 通过递归查找data里面具体的值,找到了就赋值给data里的printInfo
   * @param {Object} obj data  
   * @param {Number} index 传进来的arr的index 
   * @param {Array} arr 
   */
  printBookmarks:async function (obj, index,arr) {
    var i = index + 1;
    if (!arr[i]) {
      this.setData({
        printInfo :obj[arr[index]]
      })
    } else {
      await this.printBookmarks(obj[arr[index]], i,arr);
    }
  },
  /**
   * 印刷数量
   */
  changePrintingNum1(e) {
    if(this.data.offerData.printingNum==e.detail.value) {
      return
    }
    var num = Number(e.detail.value);
    if (num < 1) {
      num = '';
    }
    this.setData({
      "offerData.printingNum": num,
    });
    this.countPrice();
  },
  /**
   * 按钮选中
   * @param {*} e
   */
  async radioTap(e) {
    //如果传进来的值与之前的值一样，就直接退出操作
    if(this.data.offerData[e.currentTarget.dataset.key]===e.currentTarget.dataset.val) {
      return
    }
    this.setData({
      ["offerData." + e.currentTarget.dataset.key]: e.currentTarget.dataset.val,
    });
    /**纸张材质 */
    if (e.currentTarget.dataset.key === "materialType") {
      var obj = this.data.offerInfo.materialType.list.filter(
        (l) => l.lable === e.currentTarget.dataset.val
      )[0];
      this.setData({
        "offerInfo.thickness.list": obj.children.map((s) => ({
          ...s,
          value: s.kg,
          lable: s.name,
        })),
        "offerData.thickness": obj.children[0].kg,
        isShowIsChalk:e.currentTarget.dataset.val!='粉灰纸'&&e.currentTarget.dataset.val!='单铜纸'?true:false
      });
      getByKey({paperType:this.data.offerData.materialType,factoryId:this.data.offerData.factoryId}).then(res=>{
        console.log('优惠价格：',(this.data.offerData.tonsPrice*100 - res.data*100)/100);
        this.setData({
          DiscountPrice: res.data,
          'offerData.paperTonprice':(this.data.offerData.tonsPrice*100 - res.data*100)/100
        })
      })
    }else if (e.currentTarget.dataset.key === "manufactureAddress") { /**印刷厂商 */
      const obj = this.data.offerInfo.manufactureAddress.list.find(
        (s) => s.value === e.currentTarget.dataset.val
      );
      var valStr = "";
      var address = "";
      var factoryId = '';
      if (obj.factoryList[0]) {
        valStr = obj.factoryList[0].factoryName;
        address = obj.factoryList[0].factoryAddress;
        factoryId = obj.factoryList[0].factoryId
      }
      else{
        if(this.data.offerData.materialType===''){
          this.modalFun({contentText:'请选择纸张材质',time:1000})
        }else{
          this.modalFun({contentText:'定纸尺寸匹配不到对应的印刷厂商',time:1000})
        }
      }
      this.setData({
        "offerInfo.manufacturers.listStr": obj.factoryList
          .map((c) => c.factoryName)
          .join(),
        "offerInfo.manufacturers.list": obj.factoryList,
        "offerData.manufacturers": valStr,
        "offerData.address": address,
        "offerData.factoryId":factoryId
      });
    }else if(e.currentTarget.dataset.key === 'paperShop2'){
      this.setData({
        'priceObj.price':'',
        "priceObj.priceOne":'',
        'offerData.factoryId':'',
        'offerData.printId':'',
        'offerData.print':'',
        "offerData.paperShop":'',
        'offerData.paperTonprice':''
      })
      if(e.currentTarget.dataset.val=='other'){
        this.setData({
          "offerData.sale":'',
        })
      }else if(e.currentTarget.dataset.val=='jinfu'){
        this.setData({
          "offerData.sale":16,
        })
      }else{
        this.setData({
          "offerData.sale":'',
        })
     
      }
      await this.getListPaper()
      if (e.currentTarget.dataset.name=='九发纸业') {
        let list = this.data.paperShopList2.find(item=>{
          return item.id == e.currentTarget.dataset.val
        })
        this.setData({
          "offerData.paperShop":list.paperShop,
          saleList:list.saleList
        })
      }else if(e.currentTarget.dataset.val=='jinfu'){
        this.setData({
          "offerData.paperShop":'金福纸业',
        })
      }else{
        this.setData({
          "offerData.paperShop":''
        }) 
      }
    }else if(e.currentTarget.dataset.key === 'print'){
      this.setData({
        "offerData.printId":e.currentTarget.dataset.val,
        "offerData.factoryId":'',
        'offerData.factory':'',
        'offerData.paperTonprice':''
      })
      if (e.currentTarget.dataset.name!='其他印刷') {
        this.setData({
          "offerData.factoryId":1,
        })
      }else{
        this.setData({
          "offerData.factoryId":'',
        })
      }
      getByKey({paperType:this.data.offerData.materialType,factoryId:this.data.offerData.factoryId}).then(res=>{
        console.log('优惠价格：',(this.data.offerData.tonsPrice*100 - res.data*100)/100);
        this.setData({
          DiscountPrice: res.data,
          'offerData.paperTonprice':(this.data.offerData.tonsPrice*100 - res.data*100)/100
        })
      })
    }
    this.countPrice();
  },
  /**
   * 校验数据
   */
  verifyData() {
    var offer = this.data.offerData;
    if (offer.materialType === "") {
      return "请选择纸张材质";
    }
    if (offer.paperShop=='九发纸业'&&offer.sale === "") {
      return "请选择业务员";
    }
    if (offer.tonsPrice === "") {
      return "该纸张暂无吨价信息，请重新选择";
    }
    if (offer.sizeLength === "") {
      return "请输入开张尺寸长度";
    }
    if (offer.sizeWidth === "") {
      return "请输入开张尺寸宽度";
    }
    if (offer.printingNum === ""||offer.printingNum==0) {
      return "请输入印张数量";
    }
    if (offer.paperShop2=='other') {
      if(this.data.saleNameList.indexOf(offer.paperShop)!=-1){
        return "纸行名称校验错误，请重新输入";
      }
    }
    if (offer.paperShop2=='other') {
      if(this.data.saleNameList.indexOf(offer.paperShop)!=-1){
        return "纸行名称校验错误，请重新输入";
      }
    }
    if (!offer.brand) {
      return "请输入纸张品牌";
    }
  },
  /**
   * 拼接数据
   * @returns 属性字符串
   */
   joinStr() {
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    //纸行名称:${offer.paperShop};纸张品牌:${offer.brand};吨价/平方单价:${offer.tonsPrice}元;
    var attrStr = `纸张材质:${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalueFront};定纸尺寸:${Number(offer.sizeLength).toFixed(2)}*${Number(offer.sizeWidth).toFixed(2)}mm;`;
    
    return attrStr;
  },
  /**
   * 立即下单
   */
  placeOrder() {
    this.edition(1)
  },
  /**
   * 添加购物车
   */
  addEditionCart() {
    this.edition(0)
  },
  /**
   * @param {*} isFrom  0|1 |立即下单
   * @returns 
   */
 async edition(isFrom){
   var than = this
  var msg = this.verifyData();
    if (msg) {
      than.modalFun({contentText:msg,time:1000})
      return;
    }
    var offer = than.data.offerData;
    if (!offer.paperShop) {
      msg = "请输入纸行名称";
      than.modalFun({contentText:msg,time:1000})
      return;
    }
    if (!offer.brand) {
      msg =  "请输入纸张品牌";
      than.modalFun({contentText:msg,time:1000})
      return;
    }
    if (!this.data.offerData.printId) {
      msg =  "请选择印刷厂";
      than.modalFun({contentText:msg,time:1000})
      return;
    }
    if (this.data.offerData.printId=='other1'&&this.data.offerData.paperShop=="九发纸业"&&!offer.factory) {
      msg =  "请输入印刷厂名称";
      than.modalFun({contentText:msg,time:1000})
      return;
    }
    if(offer.sizeLength<1||offer.sizeWidth<1){
      than.modalFun({contentText:'尺寸不能低于1mm',time:1000})
      return
    }
    if (offer.paperShop2!='other'&&!offer.sale) {
      than.modalFun({contentText:'请选择业务员',time:1000})
      return
    }
    if (!this.data.offerData?.factoryId) {
      return
    }
    
    var attrStr = than.joinStr();
    let paperId = ''
      try {
        paperId = await than.setSavePapertonprice()
      } catch (error) {
        than.modalFun({contentText:error,time:1000})
        return 
      }
    
    var info = {
      factoryId: than.data.offerData.factoryId,//工厂地址ID
      fnumber: 1,//款数
      goodsAttr: attrStr,//属性
      isFollowinfo: 0,//是否着色
      isFrom:isFrom,//是否立即购买
      moldNum: 1,//模数
      number: than.data.offerData.printingNum,//商品数量
      paperId: paperId,//纸张品类ID
      memo:than.data.offerData.memo,
      type: 101,//纸张类型
      paperSaleId:than.data.offerData.sale//业务员Id
    };
    wx.showLoading({
      title: isFrom==0?'添加购物车':'正在下单',
      mask:true
    })
    // console.log('info',info);
   
    addEdition(info).then((res) => {
      if (res.success) {
        if(isFrom==1){
          wx.hideLoading()
          than.setData({
            papertonPriceList:[]
          })
          wx.navigateTo({
            url: "../../Confirm/ConfirmPaperOrder/index?isFrom=1",
          });
        }else{
          wx.hideLoading()
          than.modalFun({contentText:'已加入购物车',icon:'ac-icon-check',time:1000})
          than.getCountCart()
          than.setData({
            papertonPriceList:[]
          })
        }
        
      } else {
        wx.hideLoading()
        than.modalFun({contentText:res.message,time:2000})
      }
    }).catch((err)=>{
      wx.hideLoading()
    });
   
 },
  /**
   *  计算价格
   */
 async countPrice() {
   if (!this.data.offerData.factoryId) {
    console.log('停止计价','factoryId');
     return
   }
    var than = this;
    
    var msg = this.verifyData();
    var msg2 = ''
    var bool = false
    var offer = this.data.offerData;
    // if(offer.sizeLength>1100||offer.sizeWidth>1100){
    //   bool = true
    //   msg2 = '定纸尺寸不能超过1100*1100'
    // }
    if(offer.sizeLength<1||offer.sizeWidth<1){
      bool = true
      msg2 = '尺寸不能低于1mm'
      return
    }
  if(!offer.printId){
    console.log('停止计价','printId');
    return
  }
    if(msg||bool){
      this.setData({
        price: '0.00' ,
        originalPrice: '0.00',
        'offerData.letNumber':0,
        priceArr:[],
        priceObj: {}
      });
    
      if(msg2){
        than.modalFun({contentText:msg2,time:1000})
      }
      return
    }
      let paperId = ''
      try {
         paperId = await than.setSavePapertonprice()
      } catch (error) {
        // console.log('9946',error);
        // msg2 = error
        than.modalFun({contentText:error,time:1000})
        return 
      }
    var attrStr = than.joinStr();
    // var paper =  this.data.offerInfo.tonsPrice.list.find(s => s.lable===this.data.offerData.tonsPrice)
    wx.showLoading({
      title: '计价中',
      mask:true
    })
    getPrice({
      factoryId:than.data.offerData.factoryId,
      fnumber: 1,
      goodsAttr: attrStr,
      number: than.data.offerData.printingNum,
      paperId: paperId,
      type: 101,
    }).then((res) => {
      if (res.success) {
        var data = res.data
        var priceArr = [
          {title:'纸价',original:data.paperPriceOne ,discount:data.paperPriceOne-data.paperPrice,count: data.paperPrice},
          {title:'切纸价',original:data.cuttingFee,discount:data.cuttingFee,count:0},
          {title:'印刷费',original:data.colorMoney,discount:'',count:data.colorMoney},
        ]
        than.setData({
          price: data.price ,
          originalPrice: data.priceOne + data.cuttingFee,
          'offerData.letNumber':data.lose,
          priceObj:data,
          priceArr:data.paperPriceOne?priceArr:[],
          
        });
        wx.hideLoading()
      }else{
        wx.hideLoading()
        than.modalFun({contentText:res.message,time:2000})
      }
    }).catch((err)=>{
      wx.hideLoading()
    })
  },
  
  copyQQ:function(){
    let than = this;
    copyQQ(app,than.modalFun)
  },
  coupleBack:function(){
    wx.navigateTo({
      url: '../../coupleBack/index' 
    })
  },
  /**
   * 点击印刷厂输入框，显示底部垫高组件，并滑到底部
   */
  showBottomView(){
    this.pageScrollToBottom()
  },
  /**
   * 获取用户输入的印刷厂记录
   */
  getFactory(){
    getByUidGetFactory().then(res=>{
      if(res.success){
        let list = [...new Set((res.data.filter(e => e.title.trim()!='')).map(e => e.title))]
        this.setData({
          enterFactoryList:list.slice(0,5),
          allEnterFactoryList:this.data.allEnterFactoryList.concat(res.data),
        })
      }
    })
  },
  /**
   * 获取纸张品牌，纸行名称输入记录
   */
  getPapertonprice(bool){
  
    let than = this;
    getByUidGetPapertonprice({
      kg: than.data.offerData.thickness,
      language: "zh-cn", 
      paperType: than.data.offerData.materialType,
    }).then(res=>{
      if(res.success){
        let paperShopList = res.data.map(e=>{
          return e.paperShop    
        })
        let brandList = res.data.map(e=>{
          return e.brand
        })
        than.setData({
          paperShopList:paperShopList.slice(0,5),
          brandList:brandList.slice(0,5),
          papertonPriceList:than.data.papertonPriceList.concat(res.data)
        })
        if(bool===true){
          // console.log('bioo');
          this.countPrice()
        }
      }
      
    })
  },
  /**
   * 保存用户输入人园区信息
   */
  setSaveFactory(){
    let than = this;
   
    return new Promise((resolve, reject) => {
      saveFactory({data:{
        title:than.data.offerData.factory
      }}).then(res=>{
        // console.log(res);
        if(res.success){
          let list = than.data.allEnterFactoryList;
          list.push({title:than.data.offerData.factory,id:res.data})
          than.setData({
            allEnterFactoryList:list
          })
          // console.log('allEnterFactoryList',this.data.allEnterFactoryList);
          resolve(res.data)
        }else{
          reject(res.message)
        }
      }).catch(e=>{
        reject('保存园区信息错误')
      })
    })
    
  },
  /**
   * 保存用户输入的纸张信息
   */
  setSavePapertonprice(){
    let than = this;
    if (!this.data.offerData?.sale&&than.data.offerData.paperShop=="九发纸业") {
      return
    }
    let sale = this.data.saleList.find(item=>{
      return item.id == this.data.offerData.sale
    })
    if (!this.data.offerData.factoryId) {
      return
    }
    return new Promise((resolve, reject) => {
      let data = {
        brand:than.data.offerData.brand,
        paperShop:than.data.offerData.paperShop=="九发纸业"?than.data.paperShopList2.find(item=>{return item.id ==than.data.offerData.paperShop2}).paperShop+'_'+sale.name+'-'+sale.contactsMobile:than.data.offerData.paperShop,
        paperType:than.data.offerData.materialType,
        kg:than.data.offerData.thickness,
        paperBaseprice:Number(than.data.offerData.tonsPrice),
        paperId:(than.data.offerInfo.materialType.list.find(e=>e.value===than.data.offerData.materialType))?.data?.id,
        factoryId:than.data.offerData.factoryId
      }
      let list = than.data.papertonPriceList;
      // let obj = list.find(e => e.kg === data.kg&&e.paperType === data.paperType&&e.paperShop===data.paperShop&&e.brand===data.brand&&e.paperBaseprice===data.paperBaseprice)
      if(!data.paperBaseprice){
        reject('吨价不能为空')
      }else if(data.paperType==''||data.kg==''){
        reject('纸张信息不完善')
      }else{
        savePapertonprice({data}).then(res=>{
            if(res.success){
              than.setData({
                'offerData.paperId':res.data
              })
              list.push({...data,id:res.data})
              than.setData({
                papertonPriceList:list
              })
              resolve(res.data)
            }else{
              reject(res.message)
            }
        }).catch(()=>{
          reject('保存纸张信息错误')
        })
      }
    })
  },
});

//index.js
//获取应用实例
const app = getApp();
import {throttling,debounce,copyQQ} from '../../../utils/util'
import {
  listPaper,
  invoke,
  byBoxNameGetCraft,
  getPaperPrice
} from "../../../api/orderDetailsApi.js";
import {
  addEdition,
} from "../../../api/cartApi.js";
Page({
  data: {
    timeOut:'',
    currentTab: 1,
    postProcessing:[],
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
      /**纸张克重*/
      thickness:'',
      /**纸张材质*/
      materialType: "",
      /**整版模数 */
      editionNum:'',
      /**定纸数量*/
      printingNum: '',
      /**印张尺寸*/
      sizeWidth: "",
      /**印张尺寸*/
      sizeLength: "",
      manufactureAddress: "",
      address: "",
      /**吨价/平方单价 */
      tonsPrice: "",
      /**坑纸吨价 */
      pitPaperPrice:'',
      manufacturers: "",
      printingColorAreaStr: "",
      letNumber: 0,
      memo:'',
      brand:'',
      paperShop:'',
      factory:'',
      paperId:'',
      /**印刷费用 */
      printingPrice:'',
      /**面纸费用 */
      paperTonprice:'',
      /** 裱纸费用*/
      laminatingPrice:'',
      /**覆膜/过油费用 */
      coveredPrice:'',
      /**啤费用(含刀版) */
      beerPrice:'',
      /**粘盒费用 */
      stickyPrice:'',
      /**表处理费用 */
      surfacePrice:'',
      /**表处理工艺 */
      surface:''
    },
    /**面纸费用(优惠前) */
    paperTonprice:'',
    /**坑纸费用(优惠前) */
    pitPaperTonprice:'',
    /**标记,表示正在请求纸价 */
    flag1:true,
    /**标记,表示正在请求坑纸价 */
    flag2:false,
    papertonPriceList:[],
    allEnterFactoryList:[],
    isColorNumBtn:false,
    isColorNumBtnArr:[],
    isShowIsChalk:false,
    msg: "",
    price: "0.00",
    originalPrice:"0.00",
    catchtou: false,
    singleRow: "singleRow",
    printingColorAreaStr: "",
    cartCount: 0,
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
    differ:0,//纸张原价和优惠价的差价
    UV:false,
    orderTime:'',//货期
    pickUpDate:''
  },
  onLoad: function (option) {
    this.getListPaper();
    this.getPostProcessing()
  },
  /**获取后道工艺 */
  getPostProcessing: function(e){
    let data
    if (this.data.currentTab==1) {
      data = {boxName:'卡盒'}
    }else{
      data = {boxName:'坑盒'}
    }
    byBoxNameGetCraft(data).then(res=>{
      // console.log(res);
      if (res.data) {
        let data = res.data.map(item=>{
          item.value = ''
          return item
        })
        this.setData({
          postProcessing:data
        })
      }
      
    })
  },
  PostProcess:function(e){
    if(this.data.postProcessing[e.currentTarget.dataset.i].value==e.detail.value) {
      return false
    }
    // if (!e.detail.value) {
    //   return false
    // }
    var num = Number(e.detail.value);
    if (num < 1) {
      num = '';
    }
    this.setData({
      ['postProcessing'+`[${e.currentTarget.dataset.i}].value`]:num
    })
    this.countPrice();
  },
  checkTap:function(e){
    // if (this.data.postProcessing[e.currentTarget.dataset.i].checked) {
      this.setData({
        ['postProcessing'+`[${e.currentTarget.dataset.i}].checked`]:!this.data.postProcessing[e.currentTarget.dataset.i].checked
      })
    // } else {
      this.countPrice();
    // }
  },
  /**获取纸价和优惠后的纸价 */
  getAPaperPrice:function(e){
    console.log('纸价');
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    if (!(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalueFront||!offer.sizeLength||!offer.sizeWidth||!offer.tonsPrice) {
      return false
    }
    // if(this.data.currentTab==0&&(!offer.pitPaperPrice)){
    //   return false
    // } 
    var attrStr = `纸张材质:${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalueFront};印张尺寸:${Number(offer.sizeLength).toFixed(2)}*${Number(offer.sizeWidth).toFixed(2)}mm;`;
    if (e=='tons') {
      var tonsDtr = `吨价/平方单价:${offer.tonsPrice};`
      attrStr+=tonsDtr
      this.setData({
        flag1:true
      })
    }else{
      var tonsDtr = `吨价/平方单价:${offer.pitPaperPrice};`
      attrStr+=tonsDtr
      this.setData({
        flag2:true
      })
    }
    var data = {
      "factoryId": 0,
      "fnumber": 0,
      "goodsAttr": attrStr,
      "number": offer.printingNum,
      "paperId": 0,
      "type": 0
    }
    getPaperPrice(data).then(res=>{//oriPrice
      if (!res.success) {
        this.modalFun({contentText:res.message,time:1000})
        if (e=='tons'){
          this.setData({
            "offerData.tonsPrice":'',
            flag1:false
          })
        }else{
          this.setData({
            "offerData.pitPaperPrice":'',
            flag2:false
          })
        }
        return false
      }
      if (e=='tons'){
        this.setData({
          // "offerData.paperTonprice":res.data.disPrice.toFixed(2),
          paperTonprice:res.data.oriPrice.toFixed(2),
          flag1:false
        })
      }else{
        this.setData({
          // "offerData.pitPaperTonprice":res.data.disPrice.toFixed(2),
          pitPaperTonprice:res.data.oriPrice.toFixed(2),
          flag2:false
        })
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
      let data = {
        /**纸张克重*/
        thickness:'',
        /**纸张材质*/
        materialType: "",
        /**整版模数 */
        editionNum:'',
        /**定纸数量*/
        printingNum: '',
        /**印张尺寸*/
        sizeWidth: "",
        /**印张尺寸*/
        sizeLength: "",
        manufactureAddress: "",
        address: "",
        /**吨价/平方单价 */
        tonsPrice: "",
        /**坑纸吨价 */
        pitPaperPrice:'',
        manufacturers: "",
        letNumber: 0,
        memo:'',
        brand:'',
        paperShop:'',
        factory:'',
        paperId:'',
        /**印刷费用 */
        printingPrice:'',
        /**面纸费用 */
        paperTonprice:'',
        /** 裱纸费用*/
        laminatingPrice:'',
        /**覆膜/过油费用 */
        coveredPrice:'',
        /**啤费用(含刀版) */
        beerPrice:'',
        /**粘盒费用 */
        stickyPrice:'',
        /**表处理费用 */
        surfacePrice:'',
        /**表处理工艺 */
        surface:''
      }
      that.setData({
        currentTab: e.currentTarget.dataset.current,
        offerData:data,
        priceObj: {}
      })
    }
    this.getPostProcessing()
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
    listPaper({}).then((res) => {
      if (res.success) {
        this.setData({
          "offerInfo.materialType.list": res.data.map((e) => {
            return { ...e, value: e.data.name, lable: e.data.name };
          }),
        });
      }
    });
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
    // console.log('value',e);
    // if(value==''){
    //   return 
    // }
    if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.tonsPrice'||key=='offerData.laminatingPrice'||key=='offerData.printingPrice'||key=='offerData.coveredPrice'||key=='offerData.beerPrice'||key=='offerData.stickyPrice'){
      value = Number(e.detail.value)
    }

     //如果传进来的值与之前的值一样，就直接退出操作
    await this.printBookmarks(this.data, 0,e.currentTarget.dataset.key.split("."));
    if(this.data.printInfo===value) {
      return
    }
    if (key) {
      if (value<=0) {
        value=''
      }
      this.setData({
        [key]:value
      });
      
      /**重新计算纸价 */
      if(key=='offerData.tonsPrice'){
        this.getAPaperPrice('tons')
      }
      if(key=='offerData.pitPaperPrice'){
        this.getAPaperPrice('pit')
      }
      if(key=='offerData.sizeLength'||key=='offerData.sizeWidth'){
        this.getAPaperPrice('tons')
        this.getAPaperPrice('pit')
      }
      if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'){
        var width = this.data.offerData.sizeWidth
        var length = this.data.offerData.sizeLength
        var bool = false
        var contentText = ''
        // if(length>1100||width>1100){
        //   bool = true
        //   contentText = '定纸尺寸不能超过1100*1100'
        // }else 
        if(length<1||width<1){
          bool = true
          contentText = '尺寸不能低于1mm'
        }
        // console.log('8848',length);
        // console.log('8848',width);
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
          // this.getListPark();
        }
      }
    }
   than.countPrice()
  },
  /**
   * select选择
   * @param {*} e
   */
  getCurDomeDate: function (e) {
  
    if (e.detail) {
      this.setData({
        [e.currentTarget.dataset.key]: e.detail,
      });
    }

    this.countPrice();
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
    if (e.currentTarget.dataset.key=='offerData.printingNum') {
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
      this.getAPaperPrice('tons')
      if (this.data.currentTab==0) {
        this.getAPaperPrice('pit')
      }
      this.countPrice();
    }else if(e.currentTarget.dataset.key=='offerData.editionNum'){
      if(this.data.offerData.editionNum==e.detail.value) {
        return
      }
      var num = Number(e.detail.value);
      if (num < 1||num>15) {
        num = '';
      }
      this.setData({
        "offerData.editionNum": num,
      });
    this.getAPaperPrice('tons')
    if (this.data.currentTab==0) {
      this.getAPaperPrice('pit')
    }
    this.countPrice();
    }
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
      if (e.currentTarget.dataset.val.indexOf('金')!=-1 || e.currentTarget.dataset.val.indexOf('银')!=-1 ) {
        this.setData({
          "offerData.surface":''
        })
      }
      this.setData({
        "offerInfo.thickness.list": obj.children.map((s) => ({
          ...s,
          value: s.kg,
          lable: s.name,
        })),
        "offerData.thickness": obj.children[0].kg,
        isShowIsChalk:e.currentTarget.dataset.val!='粉灰纸'&&e.currentTarget.dataset.val!='单铜纸'?true:false,
        UV:e.currentTarget.dataset.val.indexOf('金')!=-1 || e.currentTarget.dataset.val.indexOf('银')!=-1 
      });
    }
    /**重新计算纸价 */
    // if (e.currentTarget.dataset.key=='materialType'||e.currentTarget.dataset.key=='thickness') {
      if (this.data.offerData.tonsPrice) {
        this.getAPaperPrice('tons')
      }
      if (this.data.offerData.pitPaperPrice) {
        this.getAPaperPrice('pit')
      }
    // }
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
    if (offer.sizeLength === "") {
      return "请输入印张尺寸长度";
    }
 
    if (offer.sizeWidth === "") {
      return "请输入印张尺寸宽度";
    }
   
    if (offer.printingNum === ""||offer.printingNum==0) {
      return "请输入印张数量";
    }
    // if (offer.printingNum === ""||offer.editionNum==0) {
    //   return "请输入整版模数";
    // }
    if (offer.tonsPrice === ""||offer.printingNum==0) {
      return "请输入吨价/平方单价";
    }
    if (this.data.currentTab==0) {
      if (offer.pitPaperPrice === ""||offer.printingNum==0) {
        return "请输入坑纸吨价/平方单价";
      }
      if (offer.laminatingPrice === ""||offer.printingNum==0) {
        return "请输入裱纸费用";
      }
    }
    if (offer.printingPrice === ""||offer.printingPrice==0) {
      return "请输入印刷费用";
    }
    if (offer.surfacePrice === ""||offer.surfacePrice==0) {
      return "请输入表处理费用";
    }
    if (offer.surface === "") {
      return "请选择表处理工艺";
    }
    // if (offer.coveredPrice === ""||offer.printingNum==0) {
    //   return "请输入覆膜/过油费用";
    // }
    if (offer.beerPrice === ""||offer.printingNum==0) {
      return "请输入啤费用";
    }
    if (offer.stickyPrice === ""||offer.printingNum==0) {
      return "请输入粘盒费用";
    }
    
  },
  /**
   * 拼接数据
   * @returns 属性字符串 
   */
   joinStr() {
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    // var attrStr = ``
    var attrStr = `纸张材质:${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalueFront};印张尺寸:${Number(offer.sizeLength).toFixed(2)}*${Number(offer.sizeWidth).toFixed(2)}mm;`;
    attrStr = attrStr +`面纸吨价:${offer.tonsPrice}元;`
    var threeStr = `纸张费用:${this.data.paperTonprice}元;`
    if (this.data.currentTab==0) {
      threeStr += `坑纸吨价:${offer.pitPaperPrice}元;坑纸费用:${this.data.pitPaperTonprice}元;裱纸费用:${offer.laminatingPrice}元;`
    }
    //覆膜/过油费用:${offer.coveredPrice}元;
    threeStr += `印刷费用:${offer.printingPrice}元;表处理费用:${offer.surfacePrice}元(${offer.surface});啤费用(含刀版):${offer.beerPrice}元;粘盒费用:${offer.stickyPrice}元;`
    var processingStr = '';
    this.data.postProcessing.forEach(item=>{
      if (item.checked&&item.value) {
        processingStr += item.craftName+'费用:'+item.value+'元;'
      }
    })
    attrStr += threeStr
    attrStr += processingStr
    return attrStr;
  },
  /**
   * 立即下单
   */
  placeOrder() {
    this.edition(1)
  },
  /**
   * 
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
    // if (offer.paperShop == "") {
    //   msg = "请输入纸行名称";
    //   than.modalFun({contentText:msg,time:1000})
    //   return;
    // }
    if(offer.sizeLength<1||offer.sizeWidth<1){
      than.modalFun({contentText:'尺寸不能低于1mm',time:1000})
      return
    }
    let tips=''
    for(let i=0;i<this.data.postProcessing.length;i++){
      if (this.data.postProcessing[i].checked&&!this.data.postProcessing[i].value) {
        tips = "请输入"+this.data.postProcessing[i].craftName+'费用'
        break;
      }
    };
    // this.data.postProcessing.forEach(item=>{
    //   if (item.checked&&!item.value) {
    //     tips = "请输入"+item.craftName+'费用'
    //   }
    // })
    if (tips) {
      than.modalFun({contentText:tips,time:1000})
      return false
    }
    wx.showLoading({
      title: isFrom==0?'添加购物车':'正在下单',
      mask:true
    })
    
    var attrStr = than.joinStr();
    var info = {
      factoryId: 0,//工厂地址ID
      fnumber: 1,//款数
      goodsAttr: attrStr,//属性
      isFollowinfo: 0,//是否着色
      isFrom:isFrom,//是否立即购买
      moldNum: 1,//模数
      number: than.data.offerData.printingNum,//商品数量
      paperId: 0,//纸张品类ID
      memo:than.data.offerData.memo,
      type: 0,//纸张类型
      version:3
    };
    // console.log('qqqqqqqqqqqqqqqqqq',info);
    addEdition(info).then((res) => {
      if (res.success) {
        if(isFrom==1){
          wx.hideLoading()
          wx.navigateTo({
            url: "../../Confirm/ConfirmOrder/index?isFrom=1&pickUpDate="+this.data.pickUpDate,
          });
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
   clearTimeout(this.data.timeOut)
    var than = this;
    // console.log('计价');
    var msg = this.verifyData();
    var msg2 = ''
    var bool = false
    var offer = this.data.offerData;
    if(offer.sizeLength<1||offer.sizeWidth<1){
      bool = true
      msg2 = '尺寸不能低于1mm'
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
    //改变上面选项需要等待纸张重新计价完成
    if (this.data.flag1||this.data.flag2) {
      this.setData({
        timeOut : setTimeout(()=>{than.countPrice()},500)
      })
      return false
    }
    var attrStr = than.joinStr();
    wx.showLoading({
      mask:true
    })
    invoke({
      factoryId:'',
      fnumber: 1,
      goodsAttr: attrStr,
      number: than.data.offerData.printingNum,
      paperId: 0,
      type: 0,
    }).then((res) => {
      wx.hideLoading()
      if (res.success) {
        var data = res.data
        than.setData({
          price: Math.ceil(data.price*100)/100 ,
          originalPrice: data.priceOne + data.cuttingFee,
          'offerData.letNumber':data.lose,
          priceObj:data,
          orderTime:Math.ceil(data.time/24),
          pickUpDate:data.out_time
          // priceArr:data.paperPriceOne?priceArr:[],
        });
      //  if (this.data.currentTab==0) {
      //    this.setData({
      //      'priceObj.priceOne':Math.floor(this.data.priceObj.price*100+(this.data.paperTonprice*100-this.data.offerData.paperTonprice*100)+(this.data.pitPaperTonprice*100-this.data.offerData.pitPaperTonprice*100))/100,
      //     //  differ:Math.floor((this.data.paperTonprice*100-this.data.offerData.paperTonprice*100)+(this.data.pitPaperTonprice*100-this.data.offerData.pitPaperTonprice*100))/100
      //    })
      //  } else {
      //   this.setData({
      //     'priceObj.priceOne':Math.floor(this.data.priceObj.price*100+(this.data.paperTonprice*100-this.data.offerData.paperTonprice*100))/100,
      //     // differ:Math.floor(this.data.paperTonprice*100-this.data.offerData.paperTonprice*100)/100
      //   })
      //  }
      }else{
        than.modalFun({contentText:res.message+'请稍后重试',time:2000})
      }
    });
  },
  
  coupleBack:function(){
    wx.navigateTo({
      url: '../../coupleBack/index' 
    })
  },
  notice:function() {
    wx.navigateTo({
      url: './tips/index'
    })
  },
  /**
   * 点击印刷厂输入框，显示底部垫高组件，并滑到底部
   */
  showBottomView(){
    this.setData({
      // isShowBottomView:true,//是否显示底部垫高组件
    })
    // this.pageScrollToBottom()
  },
});

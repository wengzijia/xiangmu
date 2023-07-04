//index.js
//获取应用实例
const app = getApp();
import {throttling,debounce,copyQQ} from '../../../utils/util'
import {
  listPaper,
  invoke,
  byBoxNameGetCraft,
  getPaperPrice,
  checkPrice
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
    start_price:'',
    end_price:'',
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
      surface:'',
      //放损
      dicnum:''
    },
    bpirce:0,
    /**面纸费用(优惠前) */
    paperTonprice:'',
    /**坑纸费用(优惠前) */
    pitPaperTonprice:'',
    /**标记,表示正在请求纸价 */
    flag1:true,
    /**标记,表示正在请求坑纸价 */
    flag2:false,
    /**标记,表示正在计价 */
    priceLoading:false,
    priceTime:'',
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
      ['postProcessing'+`[${e.currentTarget.dataset.i}].value`]:Math.floor(num)
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
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    console.log('纸价',offer.sizeLength);
    if (!offer.thickness||!(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalueFront||!offer.sizeLength||!offer.sizeWidth||!offer.tonsPrice) {
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
      console.log('attrStr',attrStr);
      console.log('sizeLength',offer.sizeLength);
    }
    var data = {
      "factoryId": 0,
      "fnumber": 0,
      "goodsAttr": attrStr,
      "number": Number(offer.printingNum)+Number(offer.dicnum),
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
        surface:'',
        //放损
        dicnum:''
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
    // console.log('value11',value);
    // if(value==''){
    //   return 
    // }
    if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.tonsPrice'||key=='offerData.laminatingPrice'||key=='offerData.printingPrice'||key=='offerData.coveredPrice'||key=='offerData.beerPrice'||key=='offerData.stickyPrice'||key=='offerData.dicnum'||key=='offerData.surfacePrice'){
      value = Number(e.detail.value)
    }
     //如果传进来的值与之前的值一样，就直接退出操作
    await this.printBookmarks(this.data, 0,e.currentTarget.dataset.key.split("."));
    if(this.data.printInfo===value) {
      return
    }
    let arr = e.currentTarget.dataset.key.split(".")
    if (this.data[arr[0]][arr[1]]==value) {
      return
    }
    if (key) {
      if (value<=0) {
        value=''
      }
      if(e.detail.value){
        if(key!='offerData.sizeLength'&&key!='offerData.sizeWidth'){
          console.log(key);
          this.setData({
            [key]:Math.floor(e.detail.value)
          });
        }else{
          this.setData({
            [key]:value
          });
        }
      }else{
        this.setData({
          [key]:""
        });
      }
      
      
      /**重新计算纸价 */
      if(key=='offerData.tonsPrice'){
        this.getAPaperPrice('tons')
      }
      if(key=='offerData.pitPaperPrice'){
        this.getAPaperPrice('pit')
      }
      if(key=='offerData.sizeLength'||key=='offerData.sizeWidth'){
        this.getAPaperPrice('tons')
        if(this.data.currentTab==0){
          this.getAPaperPrice('pit')
        }
      }
      if (key == 'offerData.dicnum') {
        this.getAPaperPrice('tons')
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
        "offerData.printingNum": Math.floor(num),
      });
      this.getAPaperPrice('tons')
      if (this.data.currentTab==0) {
        this.getAPaperPrice('pit')
      }
      this.countPrice();
    }else if(e.currentTarget.dataset.key=='offerData.editionNum'){
      console.log('e.detail.value',e.detail.value);
      if(this.data.offerData.editionNum==e.detail.value) {
        return
      }
      var num = Number(e.detail.value);
      if (num < 1||num>15) {
        num = '';
        this.modalFun({contentText:'模数不能小于1、大于15',time:1000})
      }
      this.setData({
        "offerData.editionNum": Math.floor(num),
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
      if(e.currentTarget.dataset.key=='surface'){

        this.setData({
         ['offerData.'+e.currentTarget.dataset.key]:''
        })
      }
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
    // console.log(offer.dicnum);
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
    if (offer.printingNum === ""||!offer.editionNum) {
      return "请输入整版模数";
    }
    if (!offer.dicnum) {
      return "请输入放损数";
    }
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
    // if (offer.surfacePrice === ""||offer.surfacePrice==0) {
    //   return "请输入表处理费用";
    // }
    if((offer.surfacePrice == ""||offer.surfacePrice==0)&&offer.surface !== ""){
      return "请输入表处理费用";
    }
    if ((offer.surfacePrice !== ""||offer.surfacePrice!=0)&&offer.surface === "") {
      return "请选择表处理工艺";
    }
    let postProcess = this.data.postProcessing
    console.log('PostProcess',postProcess)
    let process = postProcess.find(e => e.checked&&!e.value)
    if(process){
      return "请输入"+process.craftName+"费用";
    }
    
    // if (offer.coveredPrice === ""||offer.printingNum==0) {
    //   return "请输入覆膜/过油费用";
    // }
    // if (offer.beerPrice === ""||offer.printingNum==0) {
    //   return "请输入啤费用";
    // }
    // if (offer.stickyPrice === ""||offer.printingNum==0) {
    //   return "请输入粘盒费用";
    // }
    
  },
  /**
   * 拼接数据
   * @returns 属性字符串 
   */
   joinStr() {
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    var balancePayment=0
    var superOrderAttr = ''
    // var attrStr = ``
    var attrStr = `纸张材质:${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalueFront};定纸尺寸:${Number(offer.sizeLength).toFixed(2)}*${Number(offer.sizeWidth).toFixed(2)}mm;放损:${offer.dicnum};`;
    attrStr = attrStr +`面纸吨价:${offer.tonsPrice}元;`
    var threeStr = `纸张费用:${this.data.paperTonprice}元;`
    if (this.data.currentTab==0) {
      threeStr += `坑纸吨价:${offer.pitPaperPrice}元;坑纸费用:${this.data.pitPaperTonprice}元;裱纸费用:${offer.laminatingPrice}元;`
    }
    superOrderAttr += `印刷:单面印刷;印刷颜色:多色_CMYK;${offer.surfacePrice?('表面处理:'+ offer.surface)+';':'表面处理:无;'}${offer.stickyPrice?'粘合:粘;':'粘合:不粘;'}${offer.beerPrice?'啤:啤;':'啤:不啤;'}`
    //覆膜/过油费用:${offer.coveredPrice}元;
    threeStr += `印刷费用:${offer.printingPrice}元;表处理费用:${offer.surfacePrice||'0'}元(${offer.surface});啤费用(含刀版):${offer.beerPrice||'0'}元;粘盒费用:${offer.stickyPrice||'0'}元;模数:${offer.editionNum};`
    var processingStr = '';
    var processingprice=0;
    var superProcessingStr = '';
    this.data.postProcessing.forEach(item=>{
      if (item.checked&&item.value) {
        processingStr += item.craftName+'费用:'+item.value+'元;'
        processingprice+=item.value
        if (item.craftName.indexOf('烫金')!=-1) {
          superProcessingStr+='烫金1:跟样_10_10;'
        }else if (item.craftName.indexOf('击凸')!=-1) {
          superProcessingStr+='击凸1:10_10;'
        }else if (item.craftName.indexOf('局部UV')!=-1) {
          superProcessingStr+='局部UV1:10_10;'
        }else if (item.craftName.indexOf('压纹')!=-1) {
          superProcessingStr+='压纹:跟样;'
        }else if (item.craftName.indexOf('裱卡')!=-1) {
          superProcessingStr+='对裱:单铜纸_250;裱卡表处理:无;裱卡颜色:无;'
        }
      }
    })
    superOrderAttr += superProcessingStr
    try {
      wx.setStorageSync('superOrderAttr', JSON.stringify(superOrderAttr))
    } catch (e) {console.log(e);}
    attrStr += threeStr
    attrStr += processingStr
    balancePayment=Number(offer.surfacePrice)+Number(offer.beerPrice)+Number(offer.stickyPrice)
    // console.log('balancePayment',balancePayment);
    // console.log('processingStr',processingprice);
    this.setData({
      bprice: balancePayment+processingprice
    });
    
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
    //等待计价完成
    if (this.data.priceLoading) {
      this.setData({
        priceTime : setTimeout(()=>{than.edition(1)},500)
      })
      return false
    }
    
    wx.showLoading({
      title:'正在下单',
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
      number:  Number(offer.printingNum),//商品数量,//商品数量
      paperId: 0,//纸张品类ID
      memo:than.data.offerData.memo,
      type: 0,//纸张类型
      version:3,
      orderPrice:than.data.priceObj.price
    };
    checkPrice(info).then(res=>{
      if (res.success) {
        wx.hideLoading()
          if(res.data.pass){
            addEdition(info).then((res) => {
              if (res.success) {
                  wx.hideLoading()
                  wx.navigateTo({
                    url: "../../Confirm/ConfirmProxyOrder/index?isFrom=1&pickUpDate="+than.data.pickUpDate+"&endPrice="+than.data.end_price,
                  });
              } else {
                wx.hideLoading()
                than.modalFun({contentText:res.message,time:2000})
              }
            }).catch((err)=>{
              wx.hideLoading()
            });
          }else{
            than.modalFun({contentText:'金额审核不通过，请修改金额',time:2000})
          }
        
      } else {
        wx.hideLoading()
        than.modalFun({contentText:res.message,time:2000})
      }

    }).catch((err)=>{
      wx.hideLoading()
    });


    // console.log('qqqqqqqqqqqqqqqqqq',info);

   
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
    this.setData({
      priceLoading:true
    })
    // console.log('bprice',this.data.bprice);
    invoke({
      factoryId:'',
      fnumber: 1,
      goodsAttr: attrStr,
      number: Number(offer.printingNum)+Number(offer.dicnum),
      paperId: 0,
      type: 0,
    }).then((res) => {
      this.setData({
        priceLoading:false
      })
      wx.hideLoading()
      if (res.success) {
        var data = res.data
        let surfacePrice = offer.surfacePrice||0,beerPrice = offer.beerPrice||0,stickyPrice = offer.stickyPrice||0;
        // console.log('this.data.postProcessing',this.data.postProcessing)
        let priceList = this.data.postProcessing.map(e=>{
          if(!e.checked) return 0
          return e.value||0
        })
        let price666= priceList.reduce((a,b)=> a+b)
        // console.log('8896',surfacePrice,beerPrice,stickyPrice)
        let end_price = ((Number(surfacePrice)+Number(beerPrice)+Number(stickyPrice)+Number(price666))+'')
        // console.log('end_price',end_price)
        // console.log('end_price',data.price-end_price)
        end_price = Number(end_price)
        let start_price = Number((data.price-end_price))
        than.setData({
          price: data.price.toFixed(2) ,
          originalPrice: data.priceOne + data.cuttingFee,
          'offerData.letNumber':data.lose,
          priceObj:data,
          orderTime:Math.ceil(data.time/24),
          pickUpDate:data.out_time,
          end_price:end_price.toFixed(2),
          start_price:start_price.toFixed(2)
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

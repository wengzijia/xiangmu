//index.js
//获取应用实例
const app = getApp();
import {throttling,debounce,copyQQ,daomoUrl2,replaceAddress,numberFormat} from '../../../utils/util'
import {
  listPaper,
  listColorPaper, 
  invoke,
  byBoxNameGetCraft,
  getPriceSpecial,
  checkPantone,
  getPaperPrice,
  getFrontPaperMap,
  uploadAutoCutting,
  paperTypeInfo,
  pinBanFilmMulchingName,
  computeSize,
  saveEfficiencyParam
} from "../../../api/orderDetailsApi.js";
import {
  add,
  countCart,
  singUpdateCheck
} from "../../../api/cartApi.js";
import {
  pinban,
  getPinBanParams,
  signByBehavior
} from "../../../api/pinban.js";
import { areaList } from '@vant/area-data'
import Toast from '@vant/weapp/toast/toast';
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
      paperType: {
        list: [],
        listStr: ``,
      },
      inside: {
        list: [],
        listStr: ``,
      },
      core: {
        list: [],
        listStr: ``,
      },
    },
    offerData: {
      /**纸张克重*/
      thickness:'',
      /**纸张材质*/
      materialType: "",
      /**数量 */
      number:'',
      /**展开尺寸*/
      sizeWidth: "",
      /**展开尺寸*/
      sizeLength: "",
      sizeHeight:"",
      // manufactureAddress: "",
      address: "",
      //纸张克重id
      paperId:'',
      letNumber: 0,
      memo:'',
      brand:'',
      /**表处理工艺 */
      surface:'哑胶',
      paste:'',
      pasteWidth:'',/**贴窗尺寸*/
      pasteLength:'',/**贴窗尺寸*/
      printing:'多色_CMYK',//印刷
      paperType:'',//坑纸类型
      inside:'',//里纸
      core:'',//芯纸
    },
    offerData2:{
      //放损数量
      dlossPrice:0,
      //印刷费用
      printingPrice:'',
      //表处理费用
      surfacePrice:'',
      //刀版费用
      knifePrice:'',
      //啤费用
      beerPrice:'',
      //粘费用
      stickPrice:'',
      //配送费用
      deliveryPrice:'',
      //利润
      profit:'',
      //税率
      taxrate:'',
    },
    currentTab:'微坑盒',
    postProcessing:[],
    postTreatment:[],
    color:false,//加印白墨
    addColor:false,
    surfaceTreatment:[],
    pasteList:[
      {
        value:'cross',
        lable:'单面贴窗'
      },
      {
        value:'cross2',
        lable:'跨二面贴窗'
      },
      {
        value:'cross3',
        lable:'跨三面贴窗'
      },
    ],
    ambossList:[
      {
        value:'1#-10#',
        lable:'1#-10#'
      },
      {
        value:'11#-21#',
        lable:'11#-21#'
      },
      {
        value:'其他纹理',
        lable:'其他纹理'
      },
    ],
    ambossInfoList: [
    'YW20001','YW20002','YW20003','YW20004','YW20005'
    ,'YW20006','YW20007','YW20008','YW20009','YW20010'
    ],
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
    },
    quantity:[],
    quantityList:[],
    tips:false,
    paste:false,//是否贴窗
    gold:false,//是否烫金
    amboss: false, // 是否压纹
    colorList:[],//烫金颜色
    numberText:'最小印刷数量不能小于1000个',
    knifeUrl:'',
    img:'',
    daomo:'',
    defaultLength:'',
    defaultWidth:'',
    defaultHeight:'',
    thickness:'',
    auto:false,//是否自动拼版
    pinBanStr:'',//拼版计价字符串
    pinbanImg:'',//拼版图片
    flag2:false,//是否正在拼版
    region:['请选择', '请选择'],//位置
    goodsId:'',
    show:false,//显示省市区选择器
    areaList,
    areaListId:'',
    pinbanObj:null,
    imgBaseUrl:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
    pin:false,
    attrStr:'',//计价下单用参数串
    showReset:false,
    pdfUrl:'',//刀模pdf的oss地址
    PinBanParams:null,
    isShow:false, //是否是金银卡纸
    unitShow:false,
    unitShow2:false,
    unit:'吨',//其他纸张单价选择列表
    unitList:['吨','平方','张'],
    unitList2:['平方','张'],
    unit2:'平方',//其他纸张单价选择列表
    unitIndex:0,//其他纸张单价
    otherPaperIndex:0,//其他纸张单价
    otherPaper:{
      materialType:'',
      thickness:'',
      tonprice:''
    },
    spotColor:false,//专色
    spotColorArray:[1,2,3],
    spotColorIndex:0,
    pantoneColorList:[],//pantong色号列表
    // otherPaperType:false,
    otherPaperType:{
      inside:{
        materialType:'',
        thickness:'',
      },
      core:{
        materialType:'',
        thickness:'',
      },
      tonprice:''
    },
    surfaceHandle:{
      '单铜纸':[
        "哑胶",
        "光胶",
        "逆向UV",
        "光油",
        "哑油",
        "触感膜",
        "防刮花哑膜",
        "防刮花光膜",
        "镭射膜",
        "预涂哑膜",
        "预涂光膜",
        "吸塑油",
    ],
      '银卡纸':[
        "逆向UV",
        "哑胶",
        "光胶",
        "光油",
        "哑油",
        "触感膜",
        "防刮花哑膜",
        "防刮花光膜",
        "镭射膜",
        "预涂哑膜",
        "预涂光膜",
        // "吸塑油"
    ],
      '其他':[
        "哑胶",
        "光胶",
        "逆向UV",
        "光油",
        "哑油",
        "触感膜",
        "防刮花哑膜",
        "防刮花光膜",
        "镭射膜",
        "预涂哑膜",
        "预涂光膜",
        "UV光油"
    ],
    '粉灰纸':[
      "哑胶",
      "光胶",
      "逆向UV",
      "光油",
      "哑油",
      "触感膜",
      "防刮花哑膜",
      "防刮花光膜",
      "镭射膜",
      "预涂哑膜",
      "预涂光膜",
      "吸塑油",
  ]
    },
    pinbanCount:0,//拼版错误计数
    moreSurface:true,//取反，是否展示全部表处理
    pinBanFilmMulchingNameList:[],//后台表处理
    unitPrice:null,
    taxunitPrice:null,
    openSize: [],
    title: '微坑盒',
    _daomoUrl: '',
    moldCateId:0
  },
  onLoad: function (option) {
    console.log('option',option);
    //坑纸类型
    paperTypeInfo({}).then(res=>{
      if (res.success) {
        this.setData({
          "offerInfo.paperType.list": res.data.map((e) => {
            return { ...e, value: e.data.name, lable: e.data.name };
          }),
          "offerData.paperType":res.data[0].data.name,
          "offerInfo.inside.list":res.data[0].children.map((e) => {
            return { ...e, value: e.data.name, lable: e.data.name };
          }),
          "offerData.inside":res.data[0].children[0].data.name,
          "offerInfo.core.list":res.data[0].children[0].children.map((e) => {
            return { ...e, value: e.data.keyvalue, lable: e.data.name };
          }),
          "offerData.core":res.data[0].children[0].children[0].data.keyvalue
        })
      }
    })
    getPinBanParams({"data":"2"}).then(res=>{
      if (res.success) {
        let obj ={
          fenqie_w : JSON.parse(res.data.paperSlit).map(item=>{return item.v}).join(','),//273,298.5,364,398,546, 597, 635, 660, 700, 711, 740, 787
          safe_distance : res.data.pitHorizontal+','+res.data.pitVertical,//'3,3',坑盒和卡盒字段不一样
          place_holder : res.data.left+','+res.data.right+','+res.data.biteOpposite+','+res.data.bite,//'3, 3, 3, 10',
        }
        this.setData({
          PinBanParams:obj
        })
      //  console.log(JSON.parse(res.data.paperSlit)) 
        // res.data.paperSlitSilver
      }
    })
    // wx.setNavigationBarTitle({
    //   title: option.title+(!Number(option.type)?'自动专版':'自定义专版')
    // })
    this.getListPaper();
    this.getPostProcessing()
    this.setData({
      auto:!Number(option.type),
      title: option.boxName,
      currentTab:option.name
    })
    if (!Number(option.type)) {
      let dm = JSON.parse(wx.getStorageSync('daomo'))
      this.setData({
        daomo:dm,
        img:JSON.parse(wx.getStorageSync('img')),
        goodsId:option.gid,
        moldCateId:option.mid
      })
    }else{
      this.setData({
        daomo:{longMax:500,longMin:20,widthMin:15,widthMax:500,heightMin:20,heightMax:500},
        knifeUrl:wx.getStorageSync('knifeUrl'),
      })
    }
    this.defaultSize(option)
  },
  onShow(){
  },
  //展示全部表处理
  showSurface(){
    this.setData({
      moreSurface:!this.data.moreSurface
    })
  },


  //Picke选择器
  bindPickerChange: function(e) {
    if (e.currentTarget.dataset.key&&e.currentTarget.dataset.key=='spotColor') {
      let val = this.data.spotColorArray[e.detail.value]
      let i = val-this.data.pantoneColorList.length
      this.setData({
        spotColorIndex: e.detail.value,
      })
      if (i>0) {
        for(let j=0;j<i;j++){
          this.data.pantoneColorList.push({value:''})
          this.setData({
            pantoneColorList:this.data.pantoneColorList,
            priceObj:null,
            unitPrice:null
          })
        }
      }else if (i<0) {
        this.data.pantoneColorList.splice(val)
        this.setData({
          pantoneColorList:this.data.pantoneColorList
        })
        this.getpaperprice()
      }
    }else{
      if (e.currentTarget.dataset.key=='paper') {
        this.setData({
          otherPaperIndex: e.detail.value,
        })
      }else{
        this.setData({
          unitIndex: e.detail.value,
        })
      }
      this.getpaperprice()
    }
  },
  //默认尺寸
  defaultSize(option){
    let moldCateId = this.data.moldCateId
    if (option.title == "卡纸盒") {
      if (
        moldCateId == "241" ||
        moldCateId == "240" ||
        moldCateId == "242" ||
        moldCateId == "264" ||
        moldCateId == "239"
      ) {
        this.setData({
          // "offerData.sizeLength" : 80,
          // "offerData.sizeWidth" :60,
          // "offerData.sizeHeight" : 120,
          defaultLength : 80,
          defaultWidth : 60,
          defaultHeight : 120,
        })
      } else if (
        moldCateId == "245" ||
        moldCateId == "244" ||
        moldCateId == "254"
      ) {
        this.setData({
          // "offerData.sizeLength" : 140,
          // "offerData.sizeWidth" :55,
          // "offerData.sizeHeight" : 120,
          defaultLength : 140,
          defaultWidth : 55,
          defaultHeight : 120,
        })
      } else if (moldCateId == "243") {
        this.setData({
          // "offerData.sizeLength" : 120,
          // "offerData.sizeWidth" :80,
          // "offerData.sizeHeight" : 40,
          defaultLength : 120,
          defaultWidth : 80,
          defaultHeight : 40,
        })
      }
    }
  },
  //打开/关闭省市区选择器弹窗
  showPopup:function(e){
    if (!this.data.show) {
      for (const key in this.data.areaList.county_list) {
        if (this.data.areaList.county_list[key] === this.data.region[2]) {
          this.setData({
            areaListId:key
          })
        }
      }
    }
    this.setData({
      show:!this.data.show
    })
  },
  //确认选择地区
  confirmArea:function(e){
    console.log(e);
    this.setData({
      "region[0]":replaceAddress(e.detail.values[0].name),
      "region[1]":replaceAddress(e.detail.values[1].name),
      show:false,
      pin:true
    })
    this.countPrice(1)
  },
  // bindRegionChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     region: e.detail.value
  //   })
  // },
  /**判断自动拼版还是自定义拼版 */
  startPinBan:debounce(function(e){
  
    this.pinStr()
    
  },500),
  /**拼刀模下载链接 */
  async pinStr(){
    wx.showLoading({
      title:'拼版中~',
      mask:true,
    })
    if (!this.data.thickness&&this.data.offerData.materialType!='其他') {
      wx.hideLoading()
      console.log('没有纸张信息',this.data.thickness);
      // this.modalFun({contentText:'请选择纸张信息',time:1000})
      return
    }
    let moldCateId = this.data.moldCateId
    let direction = ''
    let str = this.data.offerData.paperType
    if (str!="其他") {
      if (str.indexOf('E')!=-1) {
        direction = 'E'
      }else if (str.indexOf('F')!=-1){
        direction = 'F'
      }else if (str.indexOf('B')!=-1){
        direction = 'F'
      }
    }else{
      direction = 'E'
    }
    let obj = {
      knifeUrl:this.data.daomo.daomoUrl,
      length:this.data.offerData.sizeLength,
      width:this.data.offerData.sizeWidth,
      height:this.data.offerData.sizeHeight,
      datastr:'thick='+this.data.thickness,
      moldCateId,
      direction,
    }
    if (this.data.offerData.materialType=='其他') {
      obj.datastr = 'thick=0.48'
    }
    let data = daomoUrl2(obj)
    this.data._daomoUrl = data
    await uploadAutoCutting({data:data}).then(res=>{
      if (res.success) {
        this.setData({
          pdfUrl:res.data
        })
        this.pinBan({path:res.data})
      }else{
        wx.hideLoading()
        Toast('该尺寸无法拼版,请重新填写')
      }
    })
  },
  getpricefn(){
    let _this=this
    getPriceSpecial({
      goodsId:_this.data.auto?_this.data.goodsId:640,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
      fnumber: 1,
      goodsAttr: _this.joinStr(),
      number: _this.data.offerData.number,
      cextends:1,
      type: 0,
      city:(_this.data.region[0]!='请选择'?_this.data.region[0]:'')+' '+(_this.data.region[1]!='请选择'?_this.data.region[1]:''),
      pinBanStr:_this.data.pinBanStr,
      openSize: _this.data.auto ? [] : _this.data.openSize,
      loseMap:{
        lose:_this.data.offerData2.dlossPrice||0
      }
    }).then((res) => {
      // _this.getCartCount()
      // wx.hideLoading()
      if (res.success) {
        console.log('计价结果',res);
        var data = res.data
        data.priceInfo.weight = res.data.priceInfo.weight.toFixed(2)
        let strArr =  data.priceInfo.paperTonsMaterPriceStr.split('/')
        if(strArr.length>0){
          data.priceInfo.paperTonsMaterPriceStr2 = String(data.priceInfo.paperTonsDiscountPrice)+'元/'+strArr[1]
        }
        
        console.log(data.priceInfo.openSize[0]);
        
        // data.priceInfo.openSize[0]=numberFormat(res.data.priceInfo.openSize[0])
        // data.priceInfo.openSize[1]=numberFormat(res.data.priceInfo.openSize[1])
        let pinbanObj 
        for(let val in data.pin_ban){
          pinbanObj = data.pin_ban[val][0]
        }
         pinbanObj.openSize[0]=numberFormat(res.data.priceInfo.openSize[0])
         pinbanObj.openSize[1]=numberFormat(res.data.priceInfo.openSize[1])
         pinbanObj.cut_lines=(pinbanObj.cut_lines/1000).toFixed(2)
        _this.setData({
          // price: Math.ceil(data.total_price*100)/100,
          pinbanImg:res.data.pin_ban.output_png_path,
        //originalPrice: data.priceOne + data.cuttingFee,
        // 'offerData.letNumber':data.lose,
          priceObj:data,
          // unitPrice:(data.total_price/_this.data.offerData.number).toFixed(2),
          orderTime:Number(data.time_normal),
        //   pickUpDate:data.out_time
        //   // priceArr:data.paperPriceOne?priceArr:[],
          pin:false,
        });
        if (!_this.data.pinbanObj) {
          _this.setData({
            pinbanObj:pinbanObj
          })
          // wx.pageScrollTo({
          //   scrollTop:0,
          //   duration:300
          // })
        }else{
          _this.setData({
            pinbanObj:pinbanObj
          })
        }
      console.log('priceObj',this.data.priceObj);
      this.getprice()
      }else{
        if(this.data?.priceObj?.priceInfo){
          console.log('dddd',this.data.priceObj.priceInfo);
          this.setData({
            ['priceObj.priceInfo']:null
          })
        }
        this.getprice()
        Toast.fail(res.message)
      }
    });
  },
  getprice(){
    let price = 0;
    let taxprice = 0;
    this.setData({
      price: 0 ,
      taxprice: 0,
      unitPrice:null,
      taxunitPrice:null
    });
    console.log(this.verifyData());
    if(this.data.priceObj?.priceInfo?.paperDiscountPrice&&this.verifyData()===1){
      console.log('111111111');
      for(let p in this.data.offerData2){
        console.log(this.data.offerData2[p]);
        if(p=='dlossPrice'||p=='taxrate'){
          continue
        }
        price+=Number(this.data.offerData2[p])
      }
      this.data.postProcessing.forEach(item=>{
        if (item.checked&&item.value) {
          price += Number(item.value)
        }
      })
      price+=Number(this.data.priceObj.priceInfo.paperDiscountPrice)+Number(this.data.priceObj.priceInfo.pitBoxPaperPrice)
      if(this.data.offerData2.taxrate){
        taxprice=price+(price*(this.data.offerData2.taxrate/100))
      }else{
        taxprice=0
      }

      this.setData({
        price: price,
        taxprice: taxprice,
        unitPrice:(price/this.data.offerData.number).toFixed(2),
        taxunitPrice:(taxprice/this.data.offerData.number).toFixed(2),
      });
    }
   

    console.log('price',price);
    // console.log(this.verifypaper());
    // if(this.verifypaper()){
    //   this.startPinBan()
    //   console.log(o);
    //   console.log('joinStr',this.joinStr());
    // }
  },
  /**拼版 */
  async pinBan({path,re}){
    let _this = this 
    this.joinStr()
    signByBehavior({moduleName:"pinban",desc:JSON.stringify({pinban_single_web:{goodsId:_this.data.auto?_this.data.goodsId:640,goodsAttr: _this.data.attrStr,number: _this.data.offerData.number,}})}).then()
    let obj ={
      fenqie_w : this.data.PinBanParams.fenqie_w||'635,660 ,700 ,711 ,740 ,787 ,840 ,889 ,960 ,965 ,1000 ,1092 ,1194',
      safe_distance : this.data.PinBanParams.safe_distance||'3,3',
      place_holder : this.data.PinBanParams.place_holder||'3, 3, 3, 10',
      pdf_path : path//.split('qcxyztTest/')[1]
    }
    await pinban(obj).then(res=>{
      // console.log('pinban',res);
      this.setData({
        flag2:false
      })
      
      if (res.po) {
        let arr = []
        for (const key in res.po) {
          arr.push(...res.po[key].split('*'))
        }
        this.setData({
          openSize: arr
        })
      }
      if (res.code==1) {
        if (Object.keys(res.data).length==0) {
          wx.hideLoading()
          this.modalFun({contentText:'该尺寸无法拼版,请重新填写',time:1000})
          // wx.showToast({
          //   title: '参数异常,请重试',
          //   icon: 'none',
          //   duration: 2000
          // })
          return
        }
        this.setData({
          pinBanStr:(res.data),
          showReset:false
        })
        this.getpricefn()
        // wx.pageScrollTo({
        //   scrollTop: 0,
        //   duration: 300
        // })
      } else {
        //拼版失败弹窗
        wx.hideLoading()
        wx.showToast({
          title: res.msg || '参数异常,请重试',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          pinbanObj:null
        })
        console.log('拼版失败',res);
        if (!this.data.auto) {
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },1500)
          
        }
      }
      wx.hideLoading()
    })
  },
  verifypaper(){
    var offer = this.data.offerData;
    if(!offer.materialType){
      return '请选择纸张'
    }
    if (offer.materialType === "其他") {
      if(!offer.procedureList.paperSurface){
        return false;
      }
      if(!offer.procedureList.paperGram){
        return false;
      }
      if(!this.data.otherPaper.tonprice){
        return false;
      }
     
    }
    if ((!this.data.auto&&(offer.sizeLength||offer.sizeWidth||offer.sizeHeight))||this.data.auto) {
      if (!offer.sizeLength) {
        return '请输入长';
      }
      if (!offer.sizeWidth) {
        return '请输入宽';
      }
      if (!offer.sizeHeight) {
        return '请输入高';
      }
      if (offer.sizeLength*1<10||offer.sizeWidth*1<10) {
        return '尺寸低于最小限制';
      }
    }

    // if (!this.data.offerData2.dlossPrice) {
    //   return '请输入放损数量';
    // }
    // if(!this.data.otherPaper.tonprice){
    //   return '请输入纸张单价';
    // }
    // if(!this.data.otherPaperType.tonprice){
    //   return '请输入坑纸单价';
    // }

    return 1

  },
  verifyData() {
    var offer = this.data.offerData;
    var offer2 = this.data.offerData2;
    // console.log('offerofferofferoffer' ,offer)
    // if (offer.materialType === "") {
    //   return "请选择纸张材质";
    // }
    // if (offer.materialType === "其他") {
    //   if(offer.procedureList.paperSurface==''){
    //     return "请输入纸张材质";
    //   }
    //   if(offer.procedureList.paperGram==''){
    //     return "请输入纸张克重";
    //   }
      // if(offer.procedureList.paperPrice==''){
      //   return "请输入纸张单价";
      // }
     
    // }

    // if ((!this.data.auto&&(offer.sizeLength||offer.sizeWidth||offer.sizeHeight))||this.data.auto) {
    //   if (offer.sizeLength === "") {
    //     return "请输入展开尺寸长度";
    //   }
    //   if (offer.sizeWidth === "") {
    //     return "请输入展开尺寸宽度";
    //   }
    //   if (offer.sizeHeight === "") {
    //     return "请输入展开尺寸高度";
    //   }
    //   if (offer.sizeLength*1<10||offer.sizeWidth*1<10) {
    //     return "尺寸低于最小限制";
    //   }
    // }
    if(!this.data.otherPaper.tonprice){
      return '请输入纸张单价';
    }if(!this.data.otherPaperType.tonprice){
      return '请输入坑纸单价';
    }
    // if (!offer2.dlossPrice) {
    //   return "请输入放损数量";
    // }
    if(!this.data.priceObj?.priceInfo?.paperDiscountPrice){
      return '面纸费用获取失败请重试'
    }
    if (!offer2.printingPrice) {
      return "请输入印刷费用";
    }
    if (!offer2.surfacePrice) {
      return "请输入表处理费用";
    }
    if (!offer2.knifePrice) {
      return "请输入刀版费用";
    }
    if (!offer2.beerPrice) {
      return "请输入啤费用";
    }
    if (!offer2.deliveryPrice) {
      return "请输入配送费用";
    }
    if (!offer2.profit) {
      return "请输入利润";
    }
    // if (!offer2.taxrate) {
    //   return "请输入税率";
    // }

    return 1
    
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
    this.getprice()
  },
  
  /**获取后道工艺 */
  getPostProcessing: function(e){
    let data
    let arr = [
      {boxtype: 2,craftName: "贴窗",id: 4,isDelete: 1,orderType: 1,paperId: 0,price: 0,priceName: "贴窗",sort: 0,key:'put',value:''},
      {boxtype: 2,craftName: "烫金",id: 5,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "烫金(含烫金版)",sort: 0,key:'gild',value:''},
      {boxtype: 2,craftName: "击凸",id: 6,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "击凸(含击凸版)",sort: 0,key:'emboss',value:''},
      {boxtype: 2,craftName: "击凹",id: 9,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "击凹(含击凹版)",sort: 0,key:'concave',value:''},
      {boxtype: 2,craftName: "局部UV",id: 7,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "局部UV",sort: 0,key:'localUv',value:''},
      {boxtype: 2,craftName: "开窗",id: 10,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "开窗",sort: 0,key:'wdow',value:''}
    ]
    // if (this.data.currentTab==1) {
      // data = {boxName:'卡盒'}
    // }else{
    data = {boxName:'坑盒'}
    // }
    // byBoxNameGetCraft(data).then(res=>{
      // console.log(res);
      // if (res.data) {
        // let data = res.data.map(item=>{
        //   item.value = ''
        //   return item
        // })
    this.setData({
      postProcessing:arr
    })
      // }
      
    // })
  },
  /**
   * 消息提示
   * @param {Object} 
   */
  modalFun({contentText,icon,iconSize,image,imageSize,time}){
    var _this = this;
    this.setData({
      modal: {
        show: true,
        contentText,icon,iconSize,image,imageSize
      }
    })
    setTimeout(() => {
      _this.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
    }) }, time?time:2000);
  },
  /**
   * 获取纸张信息
   */
  getListPaper() {
    // listPaper({
    listColorPaper({
      orderType: 7
    }).then((res) => {
      if (res.success) {
        this.setData({
          "offerInfo.materialType.list": res.data.map((e) => {
            return { ...e, value: e.data.name, lable: e.data.keyvalueFront || e.data.name };
          }),
        });
        // console.log('materialType',this.data.offerInfo.materialType.list);
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
  numberChange:function(e){
    let _this = this
    let val = this.data.offerData.number
    if (e?.currentTarget.dataset.type=='add') {
      val += 1000
    }else if (e?.currentTarget.dataset.type=='reduce'){
      val = val-1000
    }
    if (val<1000) {
      // if (_this.data.offerData.materialType=='单铜纸'&&_this.data.offerData.thickness=='350') {
      //   val = val>500?1000:500
      // }else{
      //   val = 1000
      // }
      val = 1000
    }else if(val>99999000){
      val = 99999000
    }else{
      val = val%1000>500?(Math.floor(val/1000)+1)*1000:Math.floor(val/1000)*1000
    }
    if (this.data.offerData.number==val) {
      return
    }
    this.setData({
      'offerData.number':val
    })
    this.getpaperprice()
  },
  /**
   * 输入框事件
   * @param {*} e
   * @returns 
   */
  async inputVal(e) {
    var _this = this
    var key = e.currentTarget.dataset.key
    var value = e.detail.value;
    // console.log('value',e);
    // if(value==''){
    //   return 
    // }
    if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.number'||key=='offerData.sizeHeight'){
      if ((key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.sizeHeight')&&this.data.pinbanObj) {
        this.setData({
          showReset:true,
          pinbanObj:null
        })
      }
      // console.log('eeeeeeeeee',e);
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
      if (key=='offerData.number') {
        if (value<1000) {
          // if (_this.data.offerData.materialType=='单铜纸'&&_this.data.offerData.thickness=='350') {
          //   value = value>500?1000:500
          // }else{
          //   value = 1000
          // }
          value = 1000
        }else if(value>99999999){
          value = 99999999
        }
        let oldValue = this.data.offerData.number
        if(value % 1 == 0) {
          this.setData({
            'offerData.number':value
          });
        } else {
          this.setData({
            'offerData.number': 1000
          })
        }
        if (oldValue==this.data.offerData.number) {
          return
        }
      }
      this.setData({
        [key]:value
      });
      /**尺寸限制 */
      if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.sizeHeight'){
        var width = this.data.offerData.sizeWidth
        var length = this.data.offerData.sizeLength
        var height = this.data.offerData.sizeHeight
        var daomo = this.data.daomo
        if (width&&(width>daomo.widthMax||width<daomo.widthMin)) {
          this.setData({
            "offerData.sizeWidth":this.data.defaultWidth
          })
          this.modalFun({contentText:'尺寸超出纸张大小',time:1000})
        }
        if (length&&(length>daomo.longMax||length<daomo.longMin)) {
          this.setData({
            "offerData.sizeLength":this.data.defaultLength
          })
          this.modalFun({contentText:'尺寸超出纸张大小',time:1000})
        }
        if (height&&(height>daomo.heightMax||height<daomo.heightMin)) {
          this.setData({
            "offerData.sizeHeight":this.data.defaultHeight
          })
          this.modalFun({contentText:'尺寸超出纸张大小',time:1000})
        }

        if (width && length && height && this.data.auto) {
          let obj = {
            goodAl: this.data.offerData.sizeLength,
            goodAw: this.data.offerData.sizeWidth,    
            goodAd: this.data.offerData.sizeHeight,
            goodAh: 0,
            goodAt: 0,
            goodAx: 0,
            goodBottom: 0,
            goodWaist: 0,
            zipval: 0,
            id: this.data.goodsId
          }
          computeSize(obj).then(res => {
            if (res.code === '999999') {
              this.modalFun({contentText: res.message, time:1000})
              return
            }
            this.setData({
              deploy: res.data
            })
          })
        }
        //更改纸张材质要重新生成刀模
        // this.startPinBan()
      }
    }
   _this.getpaperprice()
  },
  async priceinp(e) {
    var _this = this
    var key = e.currentTarget.dataset.key
    var value = e.detail.value;
    let index2 = e.currentTarget.dataset.index2
     //如果传进来的值与之前的值一样，就直接退出操作
    await this.printBookmarks(this.data, 0,e.currentTarget.dataset.key.split("."));
    console.log('213',this.data.printInfo,value);
    if(this.data.printInfo==value) {
      return
    }
    if (key) {
      if (value<=0) {
        value=''
      }
      if(key==='offerData2.taxrate'){
        if(value>99){
          value=''
        }
      }
      
      this.setData({
        [key]:Number(value)
      });
     
     
    }
    console.log('gggggg');
    this.getprice()

  },
  /**
   * 按钮选中
   * @param {*} e
   */
  async radioTap(e) {
    let _this = this
   
    //如果传进来的值与之前的值一样，就直接退出操作
    if(this.data.offerData[e.currentTarget.dataset.key]===e.currentTarget.dataset.val) {
      if (e.currentTarget.dataset.key === "surface"){
        this.setData({
          "offerData.surface":'',
        })
        this.countPrice()
      }
      return
    }
    this.setData({
      ["offerData." + e.currentTarget.dataset.key]: e.currentTarget.dataset.val,
    });
    /**纸张材质 */
    if ((e.currentTarget.dataset.key === "materialType"||e.currentTarget.dataset.key === "thickness"||e.currentTarget.dataset.val === "其他")&&this.data.pinbanObj) {
      this.setData({
        showReset:true,
        pinbanObj:null
      })
    }

    if (e.currentTarget.dataset.key === "materialType") {
      this.setData({
        amboss: false
      })
    }

    if (e.currentTarget.dataset.key === "materialType"&&e.currentTarget.dataset.val!='其他') {
      var obj = this.data.offerInfo.materialType.list.filter(
        (l) => l.value === e.currentTarget.dataset.val
      )[0];
      if (e.currentTarget.dataset.val.indexOf('金')!=-1 || e.currentTarget.dataset.val.indexOf('银')!=-1 ) {
        this.setData({
          "offerData.surface":'逆向UV',
          addColor:true,
          // isShow:true
        })
      }else{
        this.setData({
          "offerData.surface":'哑胶',
          addColor:false,
          // isShow:false,
          color:false
        })
        if (this.data.offerData.surface=='逆向UV'||this.data.offerData.surface=='逆向UV') {
          this.setData({
            "offerData.surface":''
          })
        }
      }
      let postTreatmentList = obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id})[0].craftList.map(item=>{
        item.checked = false
        return item
      })
      //一体成型盒不需要粘盒
      if (!postTreatmentList.find(item=>{return item.craftName=='粘盒'})&&this.data.goodsId!=948) {
        postTreatmentList.push({craftName:'粘盒',checked:true})
      }
      this.setData({
        "offerInfo.thickness.list": obj.children.map((s) => ({
          ...s,
          value: s.kg,
          lable: s.name,
        })),
        "offerData.thickness": obj.children[0].kg,
        thickness:obj.children[0].thickness,
        "offerData.paperId": obj.children[0].id,
        // postTreatment:obj.craftList,
        // quantity:obj.quantityList,
        postTreatment:postTreatmentList,
        quantity:obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id})[0].quantityList,
        quantityList:obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id}),
        isShowIsChalk:e.currentTarget.dataset.val!='粉灰纸'&&e.currentTarget.dataset.val!='单铜纸'?true:false,
        UV:e.currentTarget.dataset.val.indexOf('金')!=-1 || e.currentTarget.dataset.val.indexOf('银')!=-1,
        "offerData.pasteWidth":'',
        "offerData.pasteLength":'',
        // "offerData.number":""
      });
      // console.log('postTreatment',this.data.postTreatment);
      this.data.postTreatment.map(item=>{
        if (item.craftName=='贴窗'&&item.checked) {
          this.setData({
            paste:true
          })
        }else if (item.craftName=='贴窗'&&!item.checked){
          this.setData({
            paste:false
          })
        }
        if (item.craftName=='烫金'&&item.checked) {
          this.setData({
            gold:true,
            colorList:item.colorList
          })
        }else if (item.craftName=='烫金'&&!item.checked){
          this.setData({
            gold:false
          })
        }
      })
      let b = this.data.postTreatment.map(item=>{
        return item.craftName=='烫金'
      })
      if (b.craftName=='烫金') {
        this.setData({
          gold:true
        })
      }else{
        this.setData({
          gold:false
        })
      }
      this.numberChange()
      //更改纸张材质要重新生成刀模
      // this.startPinBan()
    }else if (e.currentTarget.dataset.key === "materialType"&&e.currentTarget.dataset.val=='其他'){
      var obj = this.data.offerInfo.materialType.list.find(
        (l) => l.value === e.currentTarget.dataset.val
      );
      let postTreatmentList = obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id})[0].craftList.map(item=>{
        item.checked = false
        return item
      })
      //一体成型盒不需要粘盒
      if (!postTreatmentList.find(item=>{return item.craftName=='粘盒'})&&this.data.goodsId!=948) {
        postTreatmentList.push({craftName:'粘盒',checked:true})
      }
      this.setData({
        postTreatment:postTreatmentList,
        "offerInfo.thickness.list": [],
        "offerData.pasteWidth":'',
        "offerData.pasteLength":'',
        "offerData.surface":'哑胶',
        paste:false,
        addColor:true,
        gold:false
        })
    }
    if (e.currentTarget.dataset.key === "materialType") {
      this.setData({
        surfaceTreatment:[]
      })
      let surfaceHandleList = _this.data.surfaceHandle[e.currentTarget.dataset.val]
      let surfaceHandleList2 = surfaceHandleList.filter(e => _this.data.pinBanFilmMulchingNameList.find(s => s==e))
      this.setData({
        surfaceTreatment:surfaceHandleList2.map(e => {
          return {value:e,lable:e}
        }),
      })
      // if (e.currentTarget.dataset.val=='其他') {
      //   this.setData({
      //     surfaceTreatment:this.data.surfaceHandle['其他'].map(item=>{
      //       return {value:item,lable:item}
      //     })
      //   })
      // }else if(e.currentTarget.dataset.val=='单铜纸'){
      //   this.setData({
      //     surfaceTreatment:this.data.surfaceHandle['单铜纸'].map(item=>{
      //       return {value:item,lable:item}
      //     })
      //   })
      // }else{
      //   this.setData({
      //     surfaceTreatment:this.data.surfaceHandle['银卡纸'].map(item=>{
      //       return {value:item,lable:item}
      //     })
      //   })
      // }
    }else if (e.currentTarget.dataset.key === "thickness"){
      //更改纸张材质要重新生成刀模
      // this.startPinBan()
      // if (this.data.offerData.materialType=='单铜纸'&&this.data.offerData.thickness=='350') {
      //   this.setData({
      //     numberText:'请输入1000的整倍数，最小印刷数量不能少于500'
      //   })
      // }else{
      //   this.setData({
      //     numberText:'请输入1000的整倍数'
      //   })
      // }
      var obj = this.data.quantityList.filter(
        (l) => l.miniEditionPaper.id === e.currentTarget.dataset.id
      )[0];
      // console.log(66666666666,obj);
      this.setData({
        quantity:obj.quantityList,
        thickness:obj.miniEditionPaper.thickness,
        "offerData.paperId":e.currentTarget.dataset.id,
        // "offerData.number":""
      })
      this.numberChange()
    }else if (e.currentTarget.dataset.key === "paperType") {
      if (e.currentTarget.dataset.val!="其他") {
        let obj = this.data.offerInfo.paperType.list.find(item=>{
          return item.data.name === e.currentTarget.dataset.val
        })
        this.setData({
          "offerData.inside":obj.children[0].data.name,
          "offerData.core":obj.children[0].children[0].data.keyvalue,
          "offerInfo.inside.list":obj.children.map((e) => {
            return { ...e, value: e.data.name, lable: e.data.name };
          }),
          "offerInfo.core.list":obj.children[0].children.map((e) => {
            return { ...e, value: e.data.keyvalue, lable: e.data.name };
          }),
        })
      }else{
        this.setData({
          otherPaperType:{
            inside:{
              materialType:'',
              thickness:'',
            },
            core:{
              materialType:'',
              thickness:'',
            },
          },
          "offerData.inside":'',
          "offerData.core":'',
        })
      }
    }else if (e.currentTarget.dataset.key === "inside") {
      let obj = this.data.offerInfo.inside.list.find(item=>{
        return item.data.name === e.currentTarget.dataset.val
      })
      console.log(obj);
      this.setData({
        "offerData.core":obj.children[0].data.keyvalue,
        "offerInfo.core.list":obj.children.map((e) => {
          return { ...e, value: e.data.keyvalue, lable: e.data.name };
        })
      })
    }else if (e.currentTarget.dataset.key === 'amboss') {
      console.log('e.currentTarget', e.currentTarget.dataset);
      let arr = this.data.ambossInfoList
      if (e.currentTarget.dataset.val === '1#-10#') {
        if (arr.length > 10) {
          arr.splice(0,1)
        }
        this.setData({
          ambossInfoList: arr.map((item,index) => {return 'YW' + (20001 + index)}),
          ["offerData.ambossInfo"]: ''
        })
      } else if (e.currentTarget.dataset.val === '11#-21#') {
        if (arr.length == 10) {
          arr.push('YW')
        }
        this.setData({
          ambossInfoList: arr.map((item,index) => {return 'YW' + (20011 + index)}),
          ["offerData.ambossInfo"]: ''
        })
      } else if (e.currentTarget.dataset.val == '其他纹理') {
        this.setData({
          ["offerData.ambossInfo"]: ''
        })
      }
    }
    // if (e.currentTarget.dataset.key === "paste") {
    //   this.setData({
    //   })
    // }
    this.countPrice()
  },

  getpaperprice(){
    console.log('uuuuuu');
   var _this = this;
   var msg = this.verifypaper();
   if(msg===1){
     this.setData({
       price: 0 ,
       taxprice: 0,
       originalPrice: 0,
       'offerData.letNumber':0,
       priceArr:[],
       priceObj:null,
       unitPrice:null,
       taxunitPrice:null
     });
     this.setData({
       pin:true
     })
     if(this.data.pinbanObj){
      this.getpricefn()
     }
   }else{
    if(this.data?.priceObj?.priceInfo){
      console.log('dddd',this.data.priceObj.priceInfo);
      this.setData({
        ['priceObj.priceInfo']:null
      })
    }
  }
  this.getprice()
  },
  checkTap2:function(e){
    this.setData({
      ['postProcessing'+`[${e.currentTarget.dataset.i}].checked`]:!this.data.postProcessing[e.currentTarget.dataset.i].checked
    })
    this.getprice()
  },
  checkTap:function(e){
    if (e.currentTarget.dataset.key === "postTreatment")  {
      this.setData({
        ['postProcessing'+`[${e.currentTarget.dataset.i}].checked`]:!this.data.postProcessing[e.currentTarget.dataset.i].checked
      })
    }else if(e.currentTarget.dataset.key === "color"){
      this.setData({
        color:!this.data.color
      })
      this.countPrice();
    }else if(e.currentTarget.dataset.key === "spotColor"){
      this.setData({
        spotColor:!this.data.spotColor
      })
      if (this.data.spotColor) {
        this.data.pantoneColorList.push({value:''})
        this.setData({
          pantoneColorList:this.data.pantoneColorList,
          priceObj:null,
          unitPrice:null
        })
        if (this.data.pinbanObj) {
          this.setData({
            showReset:true,
          })
        }
      }else{
        this.setData({
          pantoneColorList:[],
          spotColorIndex:0
        })
      }
      this.countPrice();
    }else if(e.currentTarget.dataset.key === "gold"){
      let a = 0
      this.data.colorList.forEach(item=>{
        if (item.checked) {
          a++
        }
      })
      //最多选两个
      if (a>1&&!this.data.colorList[e.currentTarget.dataset.i].checked) {
        return false
      }
      if (e.currentTarget.dataset.val=='其它金料'&&!this.data.colorList[e.currentTarget.dataset.i].checked) {
        // wx.showToast({
        //   title: '其他金料请联系客服登记，谢谢合作！',
        //   icon: 'none',
        //   duration: 2000
        // })
        this.modalFun({contentText:'其他金料请联系客服登记，谢谢合作！',time:1000})
      }
      this.setData({
        ['colorList'+`[${e.currentTarget.dataset.i}].checked`]:!this.data.colorList[e.currentTarget.dataset.i].checked
      })
      this.countPrice();
    }
  },
  checkTap2:function(e){
    this.setData({
      ['postProcessing'+`[${e.currentTarget.dataset.i}].checked`]:!this.data.postProcessing[e.currentTarget.dataset.i].checked
    })
    this.getprice()
  },

  
  //Panton色号
  changePantoneColor(e){
    let index2 = e.currentTarget.dataset.index2
    let val = e.detail.value
    checkPantone({list:[val]}).then(res=>{
      if(!res.success){
        this.modalFun({contentText:res.message,time:1000})
      }
    })
    this.setData({
      priceObj:null,
      unitPrice:null,
      ["pantoneColorList["+index2+"].value"]:val
    })
    this.countPrice()
  },
  /**
   * 拼接数据
   * @returns 属性字符串 
   */
   joinStr() {
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    var attrStr = ``//展开尺寸:500_500;纸张材质:超高松纸_350;表面处理:哑胶;印刷颜色:多色_CMYK;粘合:自动粘1处;0;
    if (offer.sizeLength||offer.sizeWidth||offer.sizeHeight) {
      attrStr += `成品尺寸:${Number(offer.sizeLength).toFixed(2)}_${Number(offer.sizeWidth).toFixed(2)}_${Number(offer.sizeHeight).toFixed(2)};`
    }

    if (this.data.auto) {
      if (this.data.deploy?.goodAl) {
        attrStr += `展开尺寸:${Number(this.data.deploy.goodAl).toFixed(2)}_${Number(this.data.deploy.goodAw).toFixed(2)};`;
      }
    } else {
      if (this.data.openSize.length) {
        attrStr += `展开尺寸:${Number(this.data.openSize[0]).toFixed(2)}_${Number(this.data.openSize[1]).toFixed(2)};`;
      }
    }
    
   //2022/06/11
    if (offer.materialType=='其他') {
      attrStr += `其他纸张;纸张材质:${this.data.otherPaper.materialType}_${this.data.otherPaper.thickness};${this.data.unit}:${this.data.otherPaper.tonprice};`
    }else{
      let str=""
      if(this.data.otherPaper.tonprice){
        console.log('czai');
        str=`其他纸张;${this.data.unit}:${this.data.otherPaper.tonprice};`
      }
      attrStr += `纸张材质:${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalue};${str}`;
    }
    // attrStr += `印刷颜色:${offer.printing};`
    // if (this.data.spotColor) {
    //   let pantoneStr = this.data.pantoneColorList.map(item=>{return item.value}).join(',')
    //   attrStr += `专色:${this.data.spotColorArray[this.data.spotColorIndex]},${pantoneStr};`
    // }
    // if(offer.surface){
    //   attrStr += `表面处理:${offer.surface};`
    // }else{
    //   attrStr += `表面处理:无;`
    // }
    if (offer.paperType!='其他') {
      let kstr=""
      if(this.data.otherPaperType.tonprice){
        kstr=`其他坑纸;坑纸${this.data.unit2}:${this.data.otherPaperType.tonprice};`
      }
      attrStr +=`坑纸类型:${offer.paperType}_${offer.inside}_${offer.core};${kstr}`
    } else {
      console.log('eee');
      attrStr += `坑纸类型:其他坑_${this.data.otherPaperType.inside.thickness+this.data.otherPaperType.inside.materialType}_${this.data.otherPaperType.core.thickness}_${this.data.otherPaperType.core.materialType};坑纸${this.data.unit2}:${this.data.otherPaperType.tonprice};`
    }
    // if (this.data.paste) {
    //   attrStr += `折线距:${offer.paste};贴窗:${offer.pasteLength}_${offer.pasteWidth};`
    // }

    // if (this.data.amboss && offer.amboss && offer.ambossInfo) {
    //   attrStr += `压纹:${offer.ambossInfo};`
    // }

    // attrStr += this.data.color?'加印白墨;':''
    // var nextStr = ''
    // if (this.data.postTreatment.length>0) {
    //   let obj = this.data.postTreatment.find(item=>item.craftName=='粘盒')
    //   if (obj&&obj.checked) {
    //     nextStr+='粘合:自动粘1处;'
    //   } else {
    //     nextStr+='粘合:不粘;'
    //   }
    //   this.data.postTreatment.map(item=>{
    //     if (item.checked) {
    //       if (item.craftName=='烫金') {
    //         // nextStr+='烫金1:1_1_1;'
    //         let index = 1
    //         this.data.colorList.forEach((item,i)=>{
    //           if (item.checked) {
    //             nextStr+=`烫金${index}:${item.name}_1_1;`
    //             index++
    //           }
    //         })
    //       }else if(item.craftName=='贴窗'||item.craftName=='粘盒'){
    //         nextStr+=''
    //       }else if(item.craftName!='压纹'){
    //         nextStr+=item.craftName+'1:1_1;'
    //       }
    //     }
    //   })
    // }else{
    //   nextStr+='粘合:不粘;'
    // }
    
    // if (nextStr) {
    //   attrStr += nextStr
    // }
    //覆膜/过油费用:${offer.coveredPrice}元;
    // threeStr += `印刷费用:${offer.printingPrice}元;表处理费用:${offer.surfacePrice}元(${offer.surface});啤费用(含刀版):${offer.beerPrice}元;粘盒费用:${offer.stickyPrice}元;`
    // var processingStr = '';
    // this.data.postProcessing.forEach(item=>{
    //   if (item.checked&&item.value) {
    //     processingStr += item.craftName+'费用:'+item.value+'元;'
    //   }
    // })
    // attrStr += threeStr
    // attrStr += processingStr
    this.setData({
      attrStr:attrStr
    })
    return attrStr;
  },
  /**
   * 立即下单
   */
  placeOrder() {
    this.edition(1)
  },
  showPopup1: function (e) {
    let type=e.currentTarget.dataset.type
    console.log('surfaceHandleList',type)
    this.setData({
      [type]: !this.data[type]
    })
  },
  /**
   * 添加购物车
   */
    addEditionCart() {
    this.edition(0)
  },
  /**
   * 
   * @param {*} isFrom  0|1 |立即下单
   * @returns 
   */
 async edition(isFrom){
   var _this = this
  var msg = this.verifyData();
    if (msg) {
      _this.modalFun({contentText:msg,time:1000})
      return;
    }
    var offer = _this.data.offerData;
    // if (offer.paperShop == "") {
    //   msg = "请输入纸行名称";
    //   _this.modalFun({contentText:msg,time:1000})
    //   return;
    // }
    // if(offer.sizeLength<1||offer.sizeWidth<1||offer.sizeHeight<1){
    //   // _this.modalFun({contentText:'尺寸不能低于1mm',time:1000})
    //   return
    // }
    let tips=''
    for(let i=0;i<this.data.postProcessing.length;i++){
      if (this.data.postProcessing[i].checked&&!this.data.postProcessing[i].value) {
        tips = "请输入"+this.data.postProcessing[i].craftName+'费用'
        break;
      }
    };
    if (tips) {
      _this.modalFun({contentText:tips,time:1000})
      return false
    }
    wx.showLoading({
      title: isFrom==0?'添加购物车':'正在下单',
      mask:true
    })
    var info = {
      miniCart: {
        extendsStr: "0",
        goodsAttr: _this.data.attrStr,
        goodsId: _this.data.auto?_this.data.goodsId:764,//盒型，自定义盒型640,坑盒自定义盒型764
        goodsTotal: _this.data.price,
        isfrom: isFrom,
        num: _this.data.offerData.number,
        totalTime: _this.data.orderTime,
        webfrom:1,
        versionType:_this.data.auto?2:3,
        pinBanStr:_this.data.priceObj.pin_ban,
        cutModelUrl:_this.data.auto?_this.data.pdfUrl:app.globalData.pdfPath
      },
      number: 1,
      openSize: _this.data.auto ? [] : _this.data.openSize,
      wxSpecialReq: {
        daomoMap: {'坑盒': this.data._daomoUrl}
      }
    };
    add(info).then(res => {
      wx.hideLoading()
      if (res.success) {
        if(isFrom==1){
          wx.hideLoading()
          wx.navigateTo({
            url: "../../../Confirm/ConfirmSingleOrder/index?isFrom=1&pickUpDate="+this.data.pickUpDate,
          });
        }else{
          singUpdateCheck({isCheck:true,list:[res.data[0].id]})
        }
        
      } else {
        wx.hideLoading()
        _this.modalFun({contentText:res.message,time:2000})
      }
    }).catch((err)=>{
      wx.hideLoading()
    });
   
 },
 valuation(e){
  var _this = this;
  let key = e.currentTarget.dataset.key
  var msg = this.verifypaper();
  if(key==1){
    console.log('111');
    if(this.data.offerData.sizeLength&&this.data.offerData.sizeWidth&&this.data.offerData.sizeHeight){
      this.pinStr()
    }
    app.saveReport({
      goodsId:this.data.goodsId,
      actionId:2,
      type:'拼版计价'
    })
  }else if(key==2){
    if(msg===1&&this.verifyData()===1){
      wx.showLoading({
        title:'生成报价单中~',
        mask:true,
      })
      this.data.postProcessing.forEach(e=>{
        if(e.checked&&e.value){
          this.data.priceObj.priceInfo[e.key]=e.value
        }
      })
      this.data.priceObj.priceInfo.print=this.data.offerData2.printingPrice;
      this.data.priceObj.priceInfo.lamination=this.data.offerData2.surfacePrice;
      this.data.priceObj.priceInfo.blade=this.data.offerData2.knifePrice;
      this.data.priceObj.priceInfo.pi=this.data.offerData2.beerPrice;
      this.data.priceObj.priceInfo.stick=this.data.offerData2.stickPrice||0;
      this.data.priceObj.priceInfo.deliveryPrice=this.data.offerData2.deliveryPrice;
      this.data.priceObj.priceInfo.profit=this.data.offerData2.profit;
      this.data.priceObj.priceInfo.taxrate=this.data.offerData2.taxrate;
      this.data.priceObj.priceInfo.mountingpitPrice=this.data.offerData2.mountingpitPrice;
      let data={
        cutModelUrl:this.data.pdfUrl,
        goodsAttr:this.data.attrStr,
        goodsId:this.data.goodsId,
        makeUpResult:this.data.pinBanStr,
        num:this.data.offerData.number,
        price:this.data.taxprice?this.data.taxprice:this.data.price,
        priceinfo:this.data.priceObj.priceInfo,
        unitPrice:this.data.taxprice?this.data.taxunitPrice:this.data.unitPrice
      }
      saveEfficiencyParam(data).then(res=>{
        console.log(res);
          if (res.success) {
            let name=this.data.postProcessing.map(e=>{
              let name=""
              if(e.checked){
                name=e.craftName
              }
              return name
            })
            let qdata={
              area:`${this.data.offerData.sizeLength}x${this.data.offerData.sizeWidth}x${this.data.offerData.sizeHeight}`,
              paperType:`${this.data.offerData.thickness}g${this.data.offerData.materialType} 坑纸类型:${this.data.offerData.paperType}_${this.data.offerData.inside}_${this.data.offerData.core}`,
              craft:name,
              goodsName:this.data.title,
              number:this.data.offerData.number,
              amount:this.data.taxprice?this.data.taxprice:this.data.price,
              unitPrice:this.data.taxprice?this.data.taxunitPrice:this.data.unitPrice,
              isTax:this.data.taxprice?1:0
            }
            wx.setStorageSync('qudata', JSON.stringify(qdata))
            wx.navigateTo({
              url:'../quotation/index?id='+res.data,
            })
          }else{
            Toast.fail(res.message)
          }
        wx.hideLoading()
      })
      app.saveReport({
        goodsId:this.data.goodsId,
        actionId:3,
        type:'拼版计价'
      })
    }else{
      let msg='请完善报单价'
      if(this.verifypaper()===1){
        msg=this.verifyData()
      }else{
        msg=this.verifypaper()
      }
      Toast.fail(msg)
    }
  }
 
 },
  /**
   *  计算价格
   */
 async countPrice(e) {
  var _this = this;
  // console.log('计价');
  var msg = this.verifyData();
  var msg2 = ''
  var bool = false
  var offer = this.data.offerData;
  if (!_this.data.pinBanStr) {
    console.log('停止计价','!_this.data.pinBanStr');
    return
  }
  if((offer.sizeLength||offer.sizeWidth||offer.sizeHeight)&&(offer.sizeLength<1||offer.sizeWidth<1||offer.sizeHeight<1)){
    bool = true
    msg2 = '尺寸不能低于1mm'
    return
  }
  if(offer.sizeLength&&offer.sizeWidth&&offer.sizeHeight&&(offer.sizeLength < offer.sizeWidth && offer.sizeHeight > 0)){
    bool = true
    msg2 = '盒子长不能小于宽'
    // return
  }
  if(msg||bool){
    this.setData({
      price: 0,
      taxprice: 0,
      originalPrice: '0.00',
      'offerData.letNumber':0,
      priceArr:[],
      priceObj:null,
      unitPrice:null,
      taxunitPrice:null
    });
    if(msg2){
      _this.modalFun({contentText:msg2,time:1000})
    }
    wx.hideLoading();
    return
  }
  if (_this.data.showReset) {
    console.log('停止计价','showReset');
    return
  }
  //  console.log('计价',e);
  //  if (!e&&this.data.pinbanObj) {
  //   this.setData({
  //     showReset:true
  //   })
  //  }
   
   if (!this.data.pin&&!this.data.pinbanObj) {
    console.log('停止计价','!this.data.pinbanObj');
     return
   }
   clearTimeout(this.data.timeOut)
    // if (!_this.data.pinBanStr) {
    //   console.log('停止计价','!_this.data.pinBanStr');
    //   return
    // }
    //改变上面选项需要等待纸张重新计价完成
    if (this.data.flag1||this.data.flag2) {
      this.setData({
        timeOut : setTimeout(()=>{_this.countPrice(e)},500)
      })
      return false
    }
    // var attrStr = _this.joinStr();
    _this.joinStr();
    wx.showLoading({
      mask:true
    })
    getPriceSpecial({
      goodsId:_this.data.auto?_this.data.goodsId:764,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640,坑盒自定义盒型764
      fnumber: 1,
      goodsAttr: _this.data.attrStr,
      number: _this.data.offerData.number,
      cextends:1,
      type: 0,
      city:(_this.data.region[0]!='请选择'?_this.data.region[0]:'')+' '+(_this.data.region[1]!='请选择'?_this.data.region[1]:''),
      pinBanStr:_this.data.pinBanStr,
      openSize: _this.data.auto ? [] : _this.data.openSize
    }).then((res) => {
      wx.hideLoading()
      if (res.success) {
        // console.log('计价结果',res);
        var data = res.data
        data.priceInfo.weight = res.data.priceInfo.weight.toFixed(2)
        let strArr =  data.priceInfo.paperTonsMaterPriceStr.split('/')
        if(strArr.length>0){
          data.priceInfo.paperTonsMaterPriceStr2 = String(data.priceInfo.paperTonsDiscountPrice)+'元/'+strArr[1]
        }
        
        // console.log(data.priceInfo.openSize[0]);
        
        // data.priceInfo.openSize[0]=numberFormat(res.data.priceInfo.openSize[0])
        // data.priceInfo.openSize[1]=numberFormat(res.data.priceInfo.openSize[1])
        let pinbanObj 
        for(let val in data.pin_ban){
          pinbanObj = data.pin_ban[val][0]
        }
         pinbanObj.openSize[0]=numberFormat(res.data.priceInfo.openSize[0])
         pinbanObj.openSize[1]=numberFormat(res.data.priceInfo.openSize[1])
        _this.setData({
          // price: Math.ceil(data.total_price*100)/100,
          pinbanImg:res.data.pin_ban.output_png_path,
        //originalPrice: data.priceOne + data.cuttingFee,
        // 'offerData.letNumber':data.lose,
          priceObj:data,
          // unitPrice:(data.total_price/_this.data.offerData.number).toFixed(2),
          orderTime:Number(data.time_normal),
        //   pickUpDate:data.out_time
        //   // priceArr:data.paperPriceOne?priceArr:[],
          pin:false,
        });
        if (!_this.data.pinbanObj) {
          _this.setData({
            pinbanObj:pinbanObj
          })
          // wx.pageScrollTo({
          //   scrollTop:0
          // })
        }else{
          _this.setData({
            pinbanObj:pinbanObj
          })
        }
        _this.setData({
          pinbanCount:0
        })
      }else{
        if (res.message=='没有符合的尺寸，请退出在重新计价'&&_this.data.pinbanCount<3) {
          _this.setData({
            pinbanCount:++_this.data.pinbanCount
          })
          _this.startPinBan()
        }else{
          _this.modalFun({contentText:res.message+'请稍后重试',time:2000})
        }
      }
    });
  },
  
  coupleBack:function(){
    wx.navigateTo({
      url: '../../../coupleBack/index' 
    })
  },
  notice:function() {
    wx.navigateTo({
      url: '../../edition/tips/index'
    })
  },
  jumpAmboss:function() {
    wx.navigateTo({
      url: '../ambossDetails/index'
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
  checkCart(){
    // wx.navigateTo({
    //   url: '../../singleCart/index'
    // });
    wx.switchTab({
      url: '/pages/singleCart/index',
    })
  },
  changeSelect(e){
    let val  = e.detail.value
    let key  = e.currentTarget.dataset.key
    let type = e.currentTarget.dataset.type
    let item = e.currentTarget.dataset.item
    this.onCancelPup(e)

    this.setData({
      [key]:val
    })
    this.getpaperprice()
  },
  onCancelPup(e) {
    let key = e.currentTarget.dataset.type
    this.setData({
      [key]: !this.data[key]
    })
  },
  preview(e){
    let img=e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img],
    })
    console.log(e);
  }
});

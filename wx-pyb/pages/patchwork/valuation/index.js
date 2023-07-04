//index.js
//获取应用实例
const app = getApp();
import {throttling,debounce,copyQQ,daomoUrl,replaceAddress,numberFormat,deepGet} from '../../../utils/util'
import {
  listPaper,
  listColorPaper, 
  invoke,
  byBoxNameGetCraft,
  getPriceSpecial,
  getPaperPrice,
  checkPantone,
  getFrontPaperMap,
  uploadAutoCutting,
  pinBanFilmMulchingName,
  computeSize,
  getAndSetConfig,
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
import {_option} from './text.js'
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    postProcessing:[],
    wordprice:{
      //烫金
      gild:0,
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
      printsize:'single', //印刷单双面
      printcolor:'four', //印刷颜色
      frontColor:'frontFour',//印刷正面颜色
      backColor:'backFour',//印刷背面颜色
      addChalk:'',//加印白墨
      frontAddChalk:'',//印刷正面加印白墨
      backAddChalk:'',//印刷背面加印白墨
      spot:'',//专色
      frontSpot:"", //正面专色
      backSpot:'',//背面专色
      printInput:'',
      procedureList:{
        pantoneColorList: [],
        pantoneColorList2: [],
        pantoneNumber:1,
        pantoneNumber2:1,
        frontPantoneColorList: [],
        frontPantoneNumber:1,
        backPantoneColorList: [],
        backPantoneNumber:1,
        unit:'吨',
        paperSurface:'',//输入的纸张材质
        paperGram:'',//输入的纸张克重
        paperPrice:'',//输入的纸张单价
      },
      paperList:['吨','平方','张'],
      framedCard: '', // 裱卡
      framedCard_finish: '', // 裱卡表面处理
    },
    currentTab:'卡纸盒',
    postTreatment:[],
    color:false,//加印白墨
    frontColor:false, //正面加印白墨
    backColor:false, //背面加印白墨
    spot:false,//专色
    frontSpot:false, //正面专色
    backSpot:false,//背面专色
    addColor:false,
    pinBanFilmMulchingNameList:[],
    surfaceTreatment:[
    
    ],
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
    isShow:false,//是否是金银卡纸
    // sizeLimit:{}
    printList:{
      size:[{value:'single',lable:'单面印刷'},{value:'double',lable:'双面印刷'}],
      color:[{value:'four',lable:'四色'},{value:'none',lable:'无'}],
      num:[ { name: '3', type: 3,val:'' },{ name: '2', type: 2,val:'' },{ name: '1', type: 1,val:'' },],
      frontColor:[{value:'frontFour',lable:'四色'},{value:'none',lable:'无'}],
      backColor:[{value:'backFour',lable:'四色'},{value:'none',lable:'无'}],
    },
    iscolorShow: false,  //是否显示弹框
    frontShow:false,
    backShow:false,
    unit:false,
    inputList:[1,2,3],
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
    ]
    },
    isMore:true,//是否，显示所有的表处理
    unitPrice:null,
    taxunitPrice:null,
    openSize: [],
    deploy: {}, // 展开
    framedCardList: _option,
    _finish: [],
    _printing: [],
    iscolorShow2: false,
    isFramedCardListShow: false,
    title: '双插盒',
    customFramedCard: false,
    _daomoUrl: '',
    moldCateId:0,
  },
  onLoad: function (option) {
    console.log('option',option);
    getPinBanParams({"data":"1"}).then(res=>{
      if (res.success) {
        let obj ={
          fenqie_w : JSON.parse(res.data.paperSlit).map(item=>{return item.v}).join(','),//273,298.5,364,398,546, 597, 635, 660, 700, 711, 740, 787
          safe_distance : res.data.horizontal+','+res.data.vertical,//'3,3',坑盒和卡盒字段不一样
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
    // this.getListSurface()

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
      console.log('option.goodsId',option.gid);
    }else{
      this.setData({
        daomo:{longMax:500,longMin:20,widthMin:15,widthMax:500,heightMin:20,heightMax:500},
        knifeUrl:wx.getStorageSync('knifeUrl'),
      })
    }
    this.defaultSize(option)
    getAndSetConfig({status:2,data: 2,secretKey:2}).then(res => {
      // console.log('sdf', JSON.stringify(_option));
      this.setData({
        framedCardList: res
      })
    })
  },
  onShow(){
    // this.getCartCount()
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
    // wx.showLoading({
    //   title:'拼版中~',
    //   mask:true,
    // })
    // this.setData({
    //   flag2:true
    // })
    //判断是自动拼版还是自定义拼版
    console.log('this.data.auto',this.data.auto);
    // if (this.data.auto) {
    this.pinStr()
    // } 
    // else {
    //   this.pinBan({path:app.globalData.pdfPath,re:e})
    // }
  },500),
  /**拼刀模下载链接 */
  async pinStr(){
    wx.showLoading({
      title:'拼版中~',
      mask:true,
    })
    if (!this.data.thickness&&this.data.offerData.materialType!='其他') {
      wx.hideLoading()
      console.log('没有纸张信息');
      // this.modalFun({contentText:'请选择纸张信息',time:1000})
      return
    }
    let moldCateId = this.data.moldCateId
    let obj = {
      knifeUrl:this.data.daomo.daomoUrl,
      length:this.data.offerData.sizeLength,
      width:this.data.offerData.sizeWidth,
      height:this.data.offerData.sizeHeight,
      datastr:'thick='+this.data.thickness,
      moldCateId,
    }
    let data = daomoUrl(obj)
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
      price+=Number(this.data.priceObj.priceInfo.paperDiscountPrice)
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
  /**获取购物车数量 */
  getCartCount(){
    countCart().then(res=>{
      this.setData({
        cartCount:res.data.cartCount
      })
    })
  },
  /**获取后道工艺 */

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
  getPostProcessing: function(e){
    let data
    let arr = [
      {boxtype: 2,craftName: "贴窗",id: 4,isDelete: 1,orderType: 1,paperId: 0,price: 0,priceName: "贴窗",sort: 0,key:'put',value:''},
      {boxtype: 2,craftName: "烫金",id: 5,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "烫金(含烫金版)",sort: 0,key:'gild',value:''},
      {boxtype: 2,craftName: "击凸",id: 6,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "击凸(含击凸版)",sort: 0,key:'emboss',value:''},
      {boxtype: 2,craftName: "击凹",id: 9,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "击凹(含击凹版)",sort: 0,key:'concave',value:''},
      {boxtype: 2,craftName: "局部UV",id: 7,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "局部UV",sort: 0,key:'localUv',value:''},
      {boxtype: 2,craftName: "开窗",id: 10,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "开窗",sort: 0,key:'wdow',value:''},
      {boxtype: 2,craftName: "压纹",id: 11,isDelete: 1,orderType: 1,paperId: null,price: null,priceName: "压纹",sort: 0,key:'veins',value:''}
    ]
    // if (this.data.currentTab=='卡纸盒') {
    data = {boxName:'卡盒'}
    this.setData({
      postProcessing:arr
    })
    // }else{
    //   this.setData({
    //     postProcessing:arr.splice(0,6)
    //   })
    //   data = {boxName:'坑盒'}
    // }
    // byBoxNameGetCraft(data).then(res=>{
    //   if (res.data) {
    //     let data = res.data.map(item=>{
    //       item.value = ''
    //       return item
    //     })
    //     this.setData({
    //       postProcessing:data
    //     })
    //   }
      
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
      orderType:5,
    }).then((res) => {
      if (res.success) {
        console.log(res.data);
        this.setData({
          "offerInfo.materialType.list": res.data.map((e) => {
            return { ...e, value: e.data.name, lable: e.data.keyvalueFront || e.data.name };
          }),
        });
      }
    });
  },
    /**
   * 获取表面处理
   */
  getListSurface() {
    // listPaper({
      pinBanFilmMulchingName({
    }).then((res) => {
      if (res.success) {
        this.setData({
          pinBanFilmMulchingNameList: res.data.map(e => e.value||e)
        })
        console.log('surface',res.data);
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
    let val = Number(this.data.offerData.number)
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
    }else if(val>99999999){
      val = 99999999
    }
    if (this.data.offerData.number==val) {
      return 
    }
    if (val % 1 == 0) {
      this.setData({
        'offerData.number':val
      })
    }
    _this.getpaperprice()

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
    let index2 = e.currentTarget.dataset.index2
     //如果传进来的值与之前的值一样，就直接退出操作
     if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.number'||key=='offerData.sizeHeight'){
      if ((key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.sizeHeight')&&this.data.pinbanObj) {
        this.setData({
          showReset:true,
          pinbanObj:null
        })
      }
      value = Number(e.detail.value)
    }
    let a = _this.data.offerData.address
    this.setData({
      'offerData.address':''
    })
    
    await this.printBookmarks(this.data, 0,e.currentTarget.dataset.key.split("."));
    console.log('eeeee',this.data.printInfo,value);
    if(this.data.printInfo===value) {
      return
    }
    console.log('pp');
    if (key) {
      if (value<=0) {
        value=''
      }
      if (key=='offerData.number') {
        if (value<1000) {
          value = 1000
        }else if(value>99999999){
          value = 99999999
        }else if (value%1 != 0) {
          return
        }
        let oldValue = this.data.offerData.number
        this.setData({
          'offerData.number':value
        });
        if (oldValue==this.data.offerData.number) {
          return
        }
      }
      if(key=='offerData.procedureList.paperGram'){
        console.log(value, 'sdfsd', _this.data.offerData.thickness);
        let  reg=/^[1-9]\d*$|^0$/;
        if(!reg.test(value)){
          value = ''
          this.modalFun({contentText:'纸张克重只能输入整数',time:1000})
        } else if (value >= 200) {
          // let index = this.data.postTreatment.findIndex(e => e.craftName == '裱卡')
          // index == -1 && this.data.postTreatment.push({craftName: '裱卡'})
          this.setData({
            // postTreatment: this.data.postTreatment,
            customFramedCard: true
          })
        } else if (value < 200) {
          // let index = this.data.postTreatment.findIndex(e => e.craftName == '裱卡')
          // index != -1 && this.data.postTreatment.splice(index,1)
          this.setData({
            // postTreatment: this.data.postTreatment,
            customFramedCard: false,
            isFramedCardListShow: false,
            'offerData.framedCard': ''
          })
        }
      }else if(key=='offerData.procedureList.paperPrice'){
        let  reg=/^[1-9]\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/
        if(!reg.test(value)){
          value = ''
          this.modalFun({contentText:'纸张单价只能输入数字',time:1000})
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
          console.log(this.data.offerData.sizeWidth);
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
          console.log('obj',obj);
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
   this.getpaperprice()
  },
  async inputVal2(e) {
    var _this = this
    var key = e.currentTarget.dataset.key
    var value = e.detail.value;
    let index2 = e.currentTarget.dataset.index2
    // if(key=='paperSurface'){
    //   this.setData({
    //     ["offerData.procedureList."+key]:value
    //   })
    //   this.countPrice()
    // }
    // if(key=='paperGram'){
    //   this.setData({
    //     ["offerData.procedureList."+key]:value
    //   })
    //   this.countPrice()
    // }

    // if(key=='paperPrice'){
    //   this.setData({
    //     ["offerData.procedureList."+key]:value
    //   })
    //   this.countPrice()
    // }
    if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.number'||key=='offerData.sizeHeight'){
      if ((key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.sizeHeight')&&this.data.pinbanObj) {
        this.setData({
          showReset:true,
          pinbanObj:null
        })
      }
      // this.getpaperprice()
      console.log('iiiii');
      // console.log('eeeeeeeeee',e);
      value = Number(e.detail.value)
    }
    // if(key=='offerData.procedureList.paperGram' || key=='offerData.procedureList.paperPrice'){
    //   value = Number(e.detail.value)
    // }
    let a = _this.data.offerData.address
    this.setData({
      'offerData.address':''
    })
    if (key=='offerData.number') {
      if (value<1000) {
        value = 1000
      }else if(value>99999999){
        value = 99999999
      }else if (value%1 != 0) {
        return
      }
      let oldValue = this.data.offerData.number
      this.setData({
        'offerData.number':value
      });
      if (oldValue==this.data.offerData.number) {
        return
      }
      this.countPrice()
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
      if(key=='offerData.procedureList.paperGram'){
        console.log(value, 'sdfsd', _this.data.offerData.thickness);
        let  reg=/^[1-9]\d*$|^0$/;
        if(!reg.test(value)){
          value = ''
          this.modalFun({contentText:'纸张克重只能输入整数',time:1000})
        } else if (value >= 200) {
          // let index = this.data.postTreatment.findIndex(e => e.craftName == '裱卡')
          // index == -1 && this.data.postTreatment.push({craftName: '裱卡'})
          this.setData({
            // postTreatment: this.data.postTreatment,
            customFramedCard: true
          })
        } else if (value < 200) {
          // let index = this.data.postTreatment.findIndex(e => e.craftName == '裱卡')
          // index != -1 && this.data.postTreatment.splice(index,1)
          this.setData({
            // postTreatment: this.data.postTreatment,
            customFramedCard: false,
            isFramedCardListShow: false,
            'offerData.framedCard': ''
          })
        }
      }else if(key=='offerData.procedureList.paperPrice'){
        let  reg=/^[1-9]\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/
        if(!reg.test(value)){
          value = ''
          this.modalFun({contentText:'纸张单价只能输入数字',time:1000})
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
          console.log(this.data.offerData.sizeWidth);
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
          console.log('obj',obj);
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
   _this.countPrice()
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
   * 输入色号
   * @param {*} e
   */
   async colorNumberVal(e) {
    var _this = this;
    await _this.printBookmarks(_this.data, 0,e.currentTarget.dataset.key.split("."));
    if(_this.data.printInfo[e.currentTarget.dataset.index].value==e.detail.value) return 
    if(e.detail.value=='') {
      _this.setData({
        [e.currentTarget.dataset.key + `[${e.currentTarget.dataset.index}].value`]: e.detail.value,
      });
    }else{
      checkPantone({list:[e.detail.value]}).then(res =>{
        if(!res.success){
          _this.modalFun({contentText:res.message,time:1000})
        }
        _this.setData({
          [e.currentTarget.dataset.key + `[${e.currentTarget.dataset.index}].value`]: e.detail.value,
        });
        _this.countPrice();
      })
    }
  },
  /**
   * 按钮选中
   * @param {*} e
   */
  async radioTap(e) {
    let _this = this;
    //如果传进来的值与之前的值一样，就直接退出操作
    if(this.data.offerData[e.currentTarget.dataset.key]===e.currentTarget.dataset.val) {
      if(e.currentTarget.dataset.key=='surface'){
        this.setData({
          'offerData.surface':''
        })
        this.countPrice()
      }
   
      return
    }
    this.setData({
      ["offerData." + e.currentTarget.dataset.key]: e.currentTarget.dataset.val,
    });
    /**纸张材质 */
    if ((e.currentTarget.dataset.key === "materialType"||e.currentTarget.dataset.key === "thickness")&&this.data.pinbanObj) {
      this.setData({
        showReset:true,
        pinbanObj:null
      })
    }
    if (e.currentTarget.dataset.key === "materialType") {
      this.data.customFramedCard = false
      if (e.currentTarget.dataset.val == '其他') {
        if (this.data.offerData.procedureList.paperGram >= 200) {
          this.data.customFramedCard = true
        } else {
          this.data.customFramedCard = false
        }
      }
      this.setData({
        amboss:false,
        customFramedCard: this.data.customFramedCard
      })
      var obj = this.data.offerInfo.materialType.list.filter(
        (l) => l.value === e.currentTarget.dataset.val
      )[0];
      
      let surfaceHandleList = _this.data.surfaceHandle[e.currentTarget.dataset.val]
      let surfaceHandleList2 = surfaceHandleList.filter(e => _this.data.pinBanFilmMulchingNameList.find(s => s==e))
      
      // let surface = ''
      // if (e.currentTarget.dataset.val.indexOf('银')!=-1) {
      //   surface = '逆向UV'
      // } else {
      //   surface = '哑胶'
      // }

      // this.setData({
      //   "offerData.surface": surface,
      //   surfaceTreatment:surfaceHandleList2.map(e => {
      //     return {value:e,lable:e}
      //   }),
      //   addColor:(e.currentTarget.dataset.val.indexOf('铜纸')==-1 ),
      //   isShow:true
      // })

      console.log(705,obj);
      let postTreatmentList = (obj.childrenThree.find(i=>{
          return i.miniEditionPaper.pid==obj.data.id
      }).craftList).map(item=>{
        item.checked = false
        return item
      })
      //一体成型盒不需要粘盒
      if (!postTreatmentList.find(item=>{return item.craftName=='粘盒'})&&this.data.goodsId!=942) {
        postTreatmentList.push({craftName:'粘盒',checked:true})
      }
      let quantityList = obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id})

      if (obj.children[0]?.kg < 200) {
        this.setData({
          isFramedCardListShow: false,
          'offerData.framedCard': ''
        })
      }
      postTreatmentList.push({craftName:'裱卡',checked:false})

      this.setData({
        "offerInfo.thickness.list": obj.children.map((s) => ({
          ...s,
          value: s.kg,
          lable: s.name,
        })),
        "offerData.thickness": obj.children[0]?.kg,
        thickness:obj.children[0]?.thickness,
        "offerData.paperId": obj.children[0]?.id,
        // postTreatment:obj.craftList, 
        // quantity:obj.quantityList,
        postTreatment:postTreatmentList,
        quantity:obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id})[0]?.quantityList,
        quantityList:obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id}),
        isShowIsChalk:e.currentTarget.dataset.val!='粉灰纸'&&e.currentTarget.dataset.val!='单铜纸'?true:false,
        // UV:e.currentTarget.dataset.val.indexOf('金')!=-1 || e.currentTarget.dataset.val.indexOf('银')!=-1,
        "offerData.pasteWidth":'',
        "offerData.pasteLength":'',
        isFramedCardListShow: false,
        'offerData.framedCard': ''
        
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
    }
    if (e.currentTarget.dataset.key === "thickness"){

      if (e.currentTarget.dataset.val < 200) {
        let list = this.data.postTreatment.map(e => {
          if (e.craftName == '裱卡') {
            e.checked = false
          }
          return e
        })
        console.log('list', list);
        this.setData({
          isFramedCardListShow: false,
          postTreatment: list
        })
      }

      var obj = this.data.quantityList.filter(
        (l) => l.miniEditionPaper.id === e.currentTarget.dataset.id
      )[0];
      // console.log(66666666666,obj);
      this.setData({
        quantity:obj.quantityList,
        thickness:obj.miniEditionPaper.thickness,
        "offerData.paperId":e.currentTarget.dataset.id,
        postTreatment: this.data.postTreatment,
        // "offerData.number":""
      })
      this.numberChange()
    }
    this.countPrice()
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
    }else if(e.currentTarget.dataset.key === "frontColor"){
      this.setData({
        frontColor:!this.data.frontColor
      })
      this.countPrice();
    }else if(e.currentTarget.dataset.key === "backColor"){
      this.setData({
        backColor:!this.data.backColor
      })
      this.countPrice();
    }else if(e.currentTarget.dataset.key=='spot'){
      this.setData({
        spot:!this.data.spot
      })
      if(this.data.spot){
        let i=this.data.offerData.procedureList.pantoneNumber
        for(let j=0;j<i;j++){
          this.data.offerData.procedureList.pantoneColorList.push({value:''})
          this.setData({
            "offerData.procedureList.pantoneColorList":this.data.offerData.procedureList.pantoneColorList
          })
        }
      }else{
        this.setData({
        'offerData.procedureList.pantoneColorList':[]
        })
      }
      this.countPrice();   
    }else if(e.currentTarget.dataset.key=='framedCard_spot'){
      this.setData({
        framedCard_spot:!this.data.framedCard_spot
      })
      if(this.data.framedCard_spot){
        let i=this.data.offerData.procedureList.pantoneNumber2
        for(let j=0;j<i;j++){
          this.data.offerData.procedureList.pantoneColorList2.push({value:''})
          this.setData({
            "offerData.procedureList.pantoneColorList2":this.data.offerData.procedureList.pantoneColorList2
          })
        }
      }else{
        this.setData({
        'offerData.procedureList.pantoneColorList2':[]
        })
      }
      this.countPrice();   
    }else if(e.currentTarget.dataset.key=='frontSpot'){
      this.setData({
        frontSpot:!this.data.frontSpot
      })
      if(this.data.frontSpot){ 
        let i=this.data.offerData.procedureList.frontPantoneNumber
        for(let j=0;j<i;j++){
          this.data.offerData.procedureList.frontPantoneColorList.push({value:''})
          this.setData({
            "offerData.procedureList.frontPantoneColorList":this.data.offerData.procedureList.frontPantoneColorList
          })
        }
      }else{
        this.setData({
        'offerData.procedureList.frontPantoneColorList':[]
        })
      }
      this.countPrice();   
    }else if(e.currentTarget.dataset.key=='backSpot'){
      this.setData({
        backSpot:!this.data.backSpot
      })
      if(this.data.backSpot){
        let i=this.data.offerData.procedureList.backPantoneNumber
        for(let j=0;j<i;j++){
          this.data.offerData.procedureList.backPantoneColorList.push({value:''})
          this.setData({
            "offerData.procedureList.backPantoneColorList":this.data.offerData.procedureList.backPantoneColorList
          })
        }
      }else{
        this.setData({
        'offerData.procedureList.backPantoneColorList':[]
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
    }else{
      let oldValue = deepGet(this.data,e.currentTarget.dataset.key,'')
      console.log('9898999',e.currentTarget.dataset.val,oldValue)
      this.setData({
        [e.currentTarget.dataset.key]:oldValue==e.currentTarget.dataset.val?'':e.currentTarget.dataset.val
      })
      
      this.addSpotList(e.currentTarget.dataset.key)
      this.countPrice();
    }
  },
  /** 选择专色 */
  addSpotList(key){
    let _this = this;
    let listKey = '';
    let numKey = '';
    let spot = deepGet(_this.data,key,'')
    const addList = ()=>{
      if(spot!=''){
        let i= deepGet(_this.data,numKey,0)
        let list =  deepGet(_this.data,listKey,[])
        for(let j=0;j<i;j++){
          list.push({value:''})
          _this.setData({
            [listKey]:list
          })
        }
      }else{
        _this.setData({
          [listKey]:[]
        })
      }
    }
    if(key=='offerData.spot'){
      numKey = 'offerData.procedureList.pantoneNumber'
      listKey = 'offerData.procedureList.pantoneColorList'
      addList()
    }else if(key=='offerData.framedCard_spot'){
      numKey = 'offerData.procedureList.pantoneNumber2'
      listKey = 'offerData.procedureList.pantoneColorList2'
      addList()
    }else if(key=='offerData.frontSpot'){
      numKey = 'offerData.procedureList.frontPantoneNumber'
      listKey = 'offerData.procedureList.frontPantoneColorList'
      addList()
    }else if(key=='offerData.backSpot'){
      numKey = 'offerData.procedureList.backPantoneNumber'
      listKey = 'offerData.procedureList.backPantoneColorList'
      addList()
    }
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
      if(!offer.procedureList.paperPrice){
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
    // if(!this.data.offerData.procedureList.paperPrice){
    //   return '请输入纸张单价'
    // }

    return 1

  },
  /**
   * 校验数据
   */
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
      if(offer.procedureList.paperPrice==''){
        return "请输入纸张单价";
      }
     
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
   
    // if (!offer2.dlossPrice) {
    //   return "请输入放损数量";
    // }
    if(!this.data.priceObj?.priceInfo?.paperDiscountPrice){
      return '纸张费用获取失败请重试'
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
  /**
   * 拼接数据
   * @returns 属性字符串 
   */
   joinStr() {
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    var attrStr = ``//展开尺寸:500_500;纸张材质:超高松纸_350;表面处理:哑胶;印刷颜色:多色_CMYK;粘合:自动粘1处;0;
    console.log('offer',offer)
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

    if(offer.materialType=='其他'){
      attrStr += `其他纸张;纸张材质:${offer.procedureList.paperSurface}_${offer.procedureList.paperGram};${offer.procedureList.unit}:${offer.procedureList.paperPrice};`;
    }else{
      let str=""
      if(this.data.offerData.procedureList.paperPrice){
        console.log('czai');
        str=`其他纸张;${this.data.offerData.procedureList.unit}:${this.data.offerData.procedureList.paperPrice};`
      }
      console.log('this.data.offerData.procedureList.paperPrice',this.data.offerData.procedureList.paperPrice);
      attrStr += `纸张材质:${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalue};${str}`;
    }
    // attrStr+=`印刷费用:${offer.printingPrice}元;表处理费用:${offer.surfacePrice}元(${offer.surface});啤费用:${offer.beerPrice}元;粘费用:${offer.stickyPrice}元;`
    // var processingStr = '';
    // this.data.postProcessing.forEach(item=>{
    //   if (item.checked&&item.value) {
    //     processingStr += item.craftName+'费用:'+item.value+'元;'
    //   }
    // })
    // attrStr+=processingStr

    
    
    // if (nextStr) {
    //   attrStr += nextStr
    // }
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
        goodsId: _this.data.auto?_this.data.goodsId:640,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
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
        daomoMap: {'卡盒': this.data._daomoUrl}
      }
    };
    add(info).then(res => {
      // _this.getCartCount()
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
      this.setData({
        ['priceObj.priceInfo']:null
      })
    }
  }
  this.getprice()
 },
 valuation(e){
  var _this = this;
  let key = e.currentTarget.dataset.key
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
    var msg = this.verifypaper();
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
            paperType:this.data.offerData.thickness+'g'+this.data.offerData.materialType,
            craft:name,
            goodsName:this.data.title,
            number:this.data.offerData.number,
            amount:this.data.taxprice?this.data.taxprice:this.data.price,
            unitPrice:this.data.taxprice?this.data.taxunitPrice:this.data.unitPrice,
            isTax:this.data.taxprice?1:0
          }
          console.log('nnnnnnn',qdata);
          wx.setStorageSync('qudata', JSON.stringify(qdata))
          wx.navigateTo({
            url:'../quotation/index?id='+res.data,
          })
        }else{
          Toast.fail(res.message)
        }
        wx.hideLoading()
      })
      // console.log('tj',data);
      // this.setData({
      //   price: 0 ,
      //   taxprice: 0 ,
      //   originalPrice: 0,
      //   'offerData.letNumber':0,
      //   priceArr:[],
      //   priceObj:null,
      //   unitPrice:null,
      //   taxunitPrice:null
      // });
      // this.setData({
      //   pin:true
      // })
      // this.startPinBan(e.currentTarget.dataset.re)
      
      // if(this.verifypaper){
      //   _this.modalFun({contentText:msg,time:1000})
      // }
      // return
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
   console.log('计价',e);
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
      goodsId:_this.data.auto?_this.data.goodsId:640,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
      fnumber: 1,
      goodsAttr: _this.data.attrStr,
      number: _this.data.offerData.number,
      cextends:1,
      type: 0,
      city:(_this.data.region[0]!='请选择'?_this.data.region[0]:'')+' '+(_this.data.region[1]!='请选择'?_this.data.region[1]:''),
      pinBanStr:_this.data.pinBanStr,
      openSize: _this.data.auto ? [] : _this.data.openSize
    }).then((res) => {
      // _this.getCartCount()
      wx.hideLoading()
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

        console.log('pinbanObj');
        
      }else{
        _this.modalFun({contentText:res.message+'请稍后重试',time:2000})
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
  preview(e){
    let img=e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img],
    })
    console.log(e);
  },
  //弹出配送方式的选择器
  showPopup1: function (e) {
    let type=e.currentTarget.dataset.type
    console.log('surfaceHandleList',type)
    this.setData({
      [type]: !this.data[type]
    })
    
    // switch(type){
    //   case 'iscolorShow':
    //     this.setData({
    //       iscolorShow: !this.data.iscolorShow
    //     })
    //     break;
    //   case 'frontShow':
    //     this.setData({
    //       frontShow: !this.data.frontShow
    //     })
    //     break;
    //   case 'backShow':
    //     this.setData({
    //       backShow: !this.data.backShow
    //     })
    //     break;
    //   case 'unit' :
    //     this.setData({
    //       unit:!this.data.unit
    //     })
    //   break;
    // } 
  },
  onCancelPup(e,a) {
    console.log('69111111111111111',e,a);
    let _this = this;
    if(e!=''&&e?.currentTarget.dataset.type){
      this.setData({
        [e.currentTarget.dataset.type]: !this.data[e.currentTarget.dataset.type]
      })
    }else{
      if(a){
        this.setData({
          [a]: !this.data[a]
        })
      }else{
        let arr= ['iscolorShow','iscolorShow2','frontShow','backShow','unit']
        let key = arr.find(e => _this.data[e])
          this.setData({
            [key]: !this.data[key]
          })
      }
     
    }
   
    // if(key=='frontShow'){
    //   this.setData({
    //     frontShow: !this.data.frontShow
    //   })
    // }else if(key=='backShow'){
    //   this.setData({
    //     backShow: !this.data.backShow
    //   })
    // }else if(key=='iscolorShow'){
    //   this.setData({
    //     iscolorShow:!this.data.iscolorShow
    //   })
    // }else{
    //   this.setData({
    //     unit:!this.data.unit
    //   })
    // }
  },
  changeSelect(e){
    let val  = e.detail.value
    let key  = e.currentTarget.dataset.key
    let type = e.currentTarget.dataset.type
    let item = e.currentTarget.dataset.item 
    console.log(1395,val,key,type,item);
    switch(item){
      case 'pantoneColorList':
        let i = val-this.data.offerData.procedureList.pantoneColorList.length
        if (i>0) {
          for(let j=0;j<i;j++){
            this.data.offerData.procedureList.pantoneColorList.push({value:''})
            this.setData({
              "offerData.procedureList.pantoneColorList":this.data.offerData.procedureList.pantoneColorList
            })
          }
        }else if (i<0) {
          this.data.offerData.procedureList.pantoneColorList.splice(val)
          this.setData({
            "offerData.procedureList.pantoneColorList":this.data.offerData.procedureList.pantoneColorList
          })
        }
        break;
      case 'pantoneColorList2':
        console.log('ssss');
        let ii = val-this.data.offerData.procedureList.pantoneColorList2.length
        if (ii>0) {
          for(let j=0;j<ii;j++){
            this.data.offerData.procedureList.pantoneColorList2.push({value:''})
            this.setData({
              "offerData.procedureList.pantoneColorList2":this.data.offerData.procedureList.pantoneColorList2
            })
          }
        }else if (ii<0) {
          this.data.offerData.procedureList.pantoneColorList2.splice(val)
          this.setData({
            "offerData.procedureList.pantoneColorList2":this.data.offerData.procedureList.pantoneColorList2
          })
        }
        break;
      case 'frontPantoneColorList':
        let frontI = val-this.data.offerData.procedureList.frontPantoneColorList.length
        if (frontI>0) {
          for(let j=0;j<frontI;j++){
            this.data.offerData.procedureList.frontPantoneColorList.push({value:''})
            this.setData({
              "offerData.procedureList.frontPantoneColorList":this.data.offerData.procedureList.frontPantoneColorList
            })
          }
        }else if (frontI<0) {
          this.data.offerData.procedureList.frontPantoneColorList.splice(val)
          this.setData({
            "offerData.procedureList.frontPantoneColorList":this.data.offerData.procedureList.frontPantoneColorList
          })
        }
        break;
      case 'backPantoneColorList':
        let backI = val-this.data.offerData.procedureList.backPantoneColorList.length
        if (backI>0) {
          for(let j=0;j<backI;j++){
            this.data.offerData.procedureList.backPantoneColorList.push({value:''})
            this.setData({
              "offerData.procedureList.backPantoneColorList":this.data.offerData.procedureList.backPantoneColorList
            })
          }
        }else if (backI<0) {
          this.data.offerData.procedureList.backPantoneColorList.splice(val)
          this.setData({
            "offerData.procedureList.backPantoneColorList":this.data.offerData.procedureList.backPantoneColorList
          })
        }
        break; 
    }
    this.setData({
      ["offerData.procedureList."+key]:val,
      unit:false
    })

    console.log(1464,this.data.offerData.procedureList.unit);
    // this.countPrice()
    this.getpaperprice('',type)
    // this.showSelect()
  },
    //Panton色号
    changePantoneColor(e){
      let index2 = e.currentTarget.dataset.index2
      let key = e.currentTarget.dataset.key
      let val = e.detail.value
      console.log(e.currentTarget.dataset);
      this.setData({
        ["offerData.procedureList."+key+"["+index2+"].value"]:val
      })
    },
    catchMore(){
      this.setData({
        isMore:!this.data.isMore
      })
    }
  // 微信获得经纬度
  // getLocation: function () {
  //   let _this = this;
  //    // 这里写你自己的秘钥
  //   qqmapsdk = new QQMapWX({
  //     key: '3THBZ-2GKL6-A5WSK-MCWC5-SMCEO-AYFYI' //自己的key秘钥 http://lbs.qq.com/console/mykey.html 在这个网址申请
  //   });
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function (res) {
  //       console.log("getLocation");
  //       console.log(res)
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       var speed = res.speed
  //       var accuracy = res.accuracy;
  //       _this.getLocal(latitude, longitude)
  //     },
  //     fail: function (res) {
  //       console.log('fail' + JSON.stringify(res))
  //     }
  //   })
  // },
  // // 获取当前地理位置
  // getLocal: function (latitude, longitude) {
  //   let _this = this;
  //   qqmapsdk.reverseGeocoder({
  //     location: {
  //       latitude: latitude,
  //       longitude: longitude
  //     },
  //     success: function (res) {
  //       console.log("getLocal");
  //       console.log(res);
  //       let province = res.result.ad_info.province
  //       let city = res.result.ad_info.city
  //       if (_this.data.serviceArea.indexOf(city)!=-1) {
  //         _this.setData({
  //           btnBan2:false,
  //           city: _this.data.serviceArea.indexOf(city),
  //           status:true
  //         })
  //       }else{
  //         _this.setData({
  //           btnBan2:true,
  //           status:false
  //         })
  //       }
  //       // _this.setData({
  //       //   province: province,
  //       //   city: city,
  //       //   latitude: latitude,
  //       //   longitude: longitude
  //       // })

  //     },
  //     fail: function (res) {
  //       console.log("fail");
  //       console.log(res);
  //     },
  //     complete: function (res) {
  //       // console.log(res);
  //     }
  //   });
  // },
});

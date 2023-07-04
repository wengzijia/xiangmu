//index.js
//获取应用实例
const app = getApp();
import {throttling,debounce,copyQQ,daomoUrl2,replaceAddress,numberFormat,oversize} from '../../../../utils/util'
import {IMG_BASE_URL} from '../../../../utils/request.js'
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
  getAndSetConfig
} from "../../../../api/orderDetailsApi.js";
import {
  add,
  countCart,
  singUpdateCheck,
  pageEmbossTexture
} from "../../../../api/cartApi.js";
import {
  pinban,
  getPinBanParams,
  signByBehavior
} from "../../../../api/pinban.js";
import { areaList } from '@vant/area-data'
import {_option} from '../valuation/text.js'
Page({
  data: {
    unitShow:false,
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
      customList: [''],
      paperList:['吨','平方','张'],
      framedCard: '', // 裱卡
      framedCard_finish: '', // 裱卡表面处理,
      customList: ['']
    },
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
        value:'选择纹理',
        lable:'选择纹理'
      },
      {
        value:'其他纹理',
        lable:'其他纹理'
      }
    ],
    ambossInfoList: [],
    ambossInfo:{},
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
    tips2:false,
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
    region:['', '',''],//位置
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
    unit:'吨',//其他纸张单价选择列表
    unitList:['吨','平方','张'],
    unit2:['平方','张'],//其他纸张单价选择列表
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
    openSize: [],
    custom: false,
    title: '微坑盒',
    _daomoUrl: '',
    showAmboss:'0',
    ifCustom: false, // 是否展示 自定义工艺选项
    framedCardList: _option,
    _finish: [],
    _printing: [],
    iscolorShow2: false,
    isFramedCardListShow: false,
    showLoading: false,
    loadingImg: '',
    loadingIndex: 0,
    framedCard_spot: '',
    pantoneNumber2: 1,
    pantoneColorList2:[],
    inputList:[1,2,3],
    camList: [],
    concaveList: [],
    machine: false
  },
  onLoad: function (option) {
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
    this.getListSurface()
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
    wx.setNavigationBarTitle({
      title: option.title+(!Number(option.type)?'自动专版':'自定义专版')
    })
    this.getListPaper();
    this.getPostProcessing()
    this.setData({
      auto:!Number(option.type),
      title: !Number(option.type) ? option.boxName : '自定义盒'
    })
    if (!Number(option.type)) {
      let dm = JSON.parse(wx.getStorageSync('daomo'))
      this.setData({
        daomo:dm,
        img:JSON.parse(wx.getStorageSync('img')),
        goodsId:wx.getStorageSync('goodsId')
      })
    }else{
      this.setData({
        daomo:{longMax:500,longMin:20,widthMin:15,widthMax:500,heightMin:20,heightMax:500},
        knifeUrl:wx.getStorageSync('knifeUrl'),
      })
    }
    this.defaultSize(option)
    // 自定义工艺 是否展示
    getAndSetConfig({status:2,data: 2,secretKey:2,key:1}).then(res => {
      this.setData({
        ifCustom: res
      })
    })
    // 一体成型坑盒 自定义坑盒 获取裱卡信息
    if (this.data.goodsId == '948' || !this.data.auto) {
      getAndSetConfig({status:2,data: 2,secretKey:2}).then(res => {
        this.setData({
          framedCardList: res
        })
      })
    }
  },
  onShow(){
    this.getCartCount()
    this.getEmboss()
  },
  //展示全部表处理
  showSurface(){
    this.setData({
      moreSurface:!this.data.moreSurface
    })
  },
  /**
   * 获取表面处理
  */
  getListSurface() {
      pinBanFilmMulchingName({
    }).then((res) => {
      if (res.success) {
        this.setData({
          pinBanFilmMulchingNameList: res.data.map(e => e.value||e)
        })
      }
    });
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
        this.countPrice()
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
      this.countPrice()
    }
  },
  //默认尺寸
  defaultSize(option){
    let moldCateId = wx.getStorageSync('moldCateId')
    if (option.title == "卡纸盒") {
      if (
        moldCateId == "241" ||
        moldCateId == "240" ||
        moldCateId == "242" ||
        moldCateId == "264" ||
        moldCateId == "239"
      ) {
        this.setData({
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
          defaultLength : 140,
          defaultWidth : 55,
          defaultHeight : 120,
        })
      } else if (moldCateId == "243") {
        this.setData({
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
      "region[2]":replaceAddress(e.detail.values[2].name),
      show:false,
      pin:true
    })
    this.countPrice(1)
  },
  /**判断自动拼版还是自定义拼版 */
  startPinBan:debounce(function(e){
    this.setData({
      loadingImg: IMG_BASE_URL + '/static/pybupload/picture/img/0-90.gif?' + this.data.loadingIndex,
      loadingIndex: this.data.loadingIndex + 1,
      flag2:true,
      showLoading: true
    })
    //判断是自动拼版还是自定义拼版
    console.log('自动',this.data.auto,app);
    if (this.data.auto) {
      this.pinStr()
    } else {
      this.pinBan({path:app.globalData.pdfPath,re:e})
    }
  },500),
  /**拼刀模下载链接 */
  async pinStr(){
    if (!this.data.thickness&&this.data.offerData.materialType!='其他') {
      this.setData({
        showLoading: false
      })
      console.log('没有纸张信息',this.data.thickness);
      this.modalFun({contentText:'请选择纸张信息',time:1000})
      return
    }
    let moldCateId = wx.getStorageSync('moldCateId')
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
        this.setData({
          showLoading: false
        })
        this.modalFun({contentText:'该尺寸无法拼版,请重新填写',time:1000})
      }
    })
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
      machine: this.data.machine ? 'UV印刷机' : '普通印刷机',
      pdf_path : path//.split('qcxyztTest/')[1]
    }
    await pinban(obj).then(res=>{
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
          this.setData({
            showLoading: false
          })
          this.modalFun({contentText:'该尺寸无法拼版,请重新填写',time:1000})
          return
        }
        this.setData({
          pinBanStr:(res.data),
          showReset:false,
          showLoading: false
        })
        this.countPrice(re)
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      } else {
        //拼版失败弹窗
        this.setData({
          showLoading: false
        })
        if (res.code == 404) {
          wx.showToast({
            title: '展开尺寸过大，无法上机',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.msg || '参数异常,请重试',
            icon: 'none',
            duration: 2000
          })
        }
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
  getPostProcessing: function(e){
    let data
    if (this.data.currentTab==1) {
      data = {boxName:'卡盒'}
    }else{
      data = {boxName:'坑盒'}
    }
    byBoxNameGetCraft(data).then(res=>{
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
    this.countPrice()
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
    if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.number'||key=='offerData.sizeHeight'){
      if ((key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.sizeHeight')&&this.data.pinbanObj) {
        this.setData({
          showReset:true,
          pinbanObj:null
        })
      }
      value = Number(e.detail.value)
    }
    if(key=='customList'){
      value = String(value)
      // 特殊字符 : ; # 自定义
      let arr = [';', '；', '#', '自定义', ':', '：']
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (value.indexOf(el) != -1) {
          value = ''
          this.modalFun({contentText:'不可输入特殊字符',time:1000})
          break
        } 
      }
      this.setData({
        ["offerData."+key+"["+index2+"]"]:value
      })
      this.countPrice()
    }
    if (key=='offerData.number') {
      if (value<1000) {
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
            goodAl: length,
            goodAw: width,    
            goodAd: height,
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
      }
    }
   _this.countPrice()
  },
  /**
   * 按钮选中
   * @param {*} e
   */
  async radioTap(e) {
    let _this = this
   
    //如果传进来的值与之前的值一样，就直接退出操作
    if(this.data.offerData[e.currentTarget.dataset.key]===e.currentTarget.dataset.val) {
      if(e.currentTarget.dataset.key === 'amboss'&&e.currentTarget.dataset.val == '选择纹理'){
        this.showAmbossFun()
      }
      return
    }
    // 5月份 修改 逆向UV 白墨 银卡纸 会改变拼版结果
    if (this.data.pinbanObj && e.currentTarget.dataset.key === 'surface') {
      if (this.data.offerData.surface == '逆向UV' || e.currentTarget.dataset.val == '逆向UV') {
        this.setData({ // 重新拼版
          showReset:true,
          pinbanObj:null
        })
      }
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
        amboss: false,
        camList: [],
        concaveList: []
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
        })
      }else{
        this.setData({
          "offerData.surface":'哑胶',
          addColor:false,
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
      // 一体成型盒 自定义盒型 添加裱卡
      if (this.data.goodsId == '948' || !this.data.auto) {
        postTreatmentList.push({craftName:'裱卡',checked:false})
      }
      if (this.data.ifCustom) {
        postTreatmentList.push({craftName:'自定义工艺',checked:false})
      }

      this.setData({
        "offerInfo.thickness.list": obj.children.map((s) => ({
          ...s,
          value: s.kg,
          lable: s.name,
        })),
        custom: false,
        'offerData.customList': [''],
        "offerData.thickness": obj.children[0].kg,
        thickness:obj.children[0].thickness,
        "offerData.paperId": obj.children[0].id,
        postTreatment:postTreatmentList,
        quantity:obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id})[0].quantityList,
        quantityList:obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id}),
        isShowIsChalk:e.currentTarget.dataset.val!='粉灰纸'&&e.currentTarget.dataset.val!='单铜纸'?true:false,
        UV:e.currentTarget.dataset.val.indexOf('金')!=-1 || e.currentTarget.dataset.val.indexOf('银')!=-1,
        "offerData.pasteWidth":'',
        "offerData.pasteLength":'',
      });
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
            colorList:[{
              chiled: item.colorList,
              showSize: false,
              length: '',
              width: ''
            }]
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
    }else if (e.currentTarget.dataset.key === "thickness"){
      //更改纸张材质要重新生成刀模
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
      this.setData({
        quantity:obj.quantityList,
        thickness:obj.miniEditionPaper.thickness,
        "offerData.paperId":e.currentTarget.dataset.id,
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
      if (e.currentTarget.dataset.val == '其他纹理') {
        this.setData({
          ["offerData.ambossInfo"]: ''
        })
      }else{
        this.setData({
          ["offerData.ambossInfo"]: ''
        })
        this.showAmbossFun()
      }
    }
    this.countPrice()
  },
  checkTap:function(e){
    // 5月份 修改 逆向UV 白墨 银卡纸 会改变拼版结果
    if (this.data.pinbanObj && e.currentTarget.dataset.key === 'color') {
      this.setData({
        showReset:true,
        pinbanObj:null
      })
    }
    if (e.currentTarget.dataset.key === "postTreatment")  {
      this.setData({
        ['postTreatment'+`[${e.currentTarget.dataset.i}].checked`]:!this.data.postTreatment[e.currentTarget.dataset.i].checked
      })
      let tipsList = ['烫金','击凸','击凹']
      let arr = []
      if (this.data.postTreatment[e.currentTarget.dataset.i].craftName=='烫金') {
        setTimeout(()=>{
          wx.pageScrollTo({
            selector:'.gold'
          });
        },300)
      }
      let _index = 0
      this.data.postTreatment.map(item=>{
        if (item.checked&&tipsList.indexOf(item.craftName)!=-1) {
          arr.push(item.craftName)
        }
        if (item.craftName!='粘盒'&&item.checked) {
          _index += 1
        }
        if (item.craftName=='贴窗'&&item.checked) {
          this.setData({
            paste:true
          })
        }else if (item.craftName=='贴窗'&&!item.checked) {
          this.setData({
            paste:false
          })
        }
        
        if (item.craftName=='压纹'&&item.checked) {
          this.setData({
            amboss:true
          })
        }else if (item.craftName=='压纹'&&!item.checked){
          this.setData({
            amboss:false,
            ['offerData.ambossInfo']: '',
            ['offerData.amboss']: ''
          })
        }

        if (item.craftName=='自定义工艺'&&item.checked) {
          this.setData({
            custom:true
          })
        }else if (item.craftName=='自定义工艺'&&!item.checked) {
          this.setData({
            custom:false
          })
        }
      })
      let craftName = this.data.postTreatment[e.currentTarget.dataset.i].craftName
      let checked = this.data.postTreatment[e.currentTarget.dataset.i].checked
      if (craftName=='烫金' && checked) {
        let colorList = this.data.postTreatment[e.currentTarget.dataset.i].colorList
        this.setData({
          gold:true,
          colorList:[{
            chiled: colorList.map(e => {e.checked = false; return e}),
            showSize: false,
            length: '',
            width: ''
          }]
        })
      }else if (craftName=='烫金' && !checked){
        this.setData({
          gold:false
        })
      }
      if (craftName=='击凸' && checked) {
        this.setData({
          camList: [{
            sizeLength: '',
            sizeWidth: ''
          }]
        })
      }else if (craftName=='击凸' &&! checked) {
        this.setData({
          camList: []
        })
      } 
      if (craftName=='击凹' && checked) {
        this.setData({
          concaveList: [{
            sizeLength: '',
            sizeWidth: ''
          }]
        })
      } else if (craftName=='击凹' &&! checked) {
        this.setData({
          concaveList: []
        })
      }
      if (_index > 1) {
        this.setData({
          tips2:true
        })
      }else{
        this.setData({
          tips2:false
        })
      }
      if (arr.length>0) {
        this.setData({
          tips:true
        })
      }else{
        this.setData({
          tips:false
        })
      }
      // 是否选中裱卡
      if (e.currentTarget.dataset.val=='裱卡') {
        if (this.data.postTreatment[e.currentTarget.dataset.i].checked) {
          this.setData({
            isFramedCardListShow: true,
            'offerData.framedCard': this.data.framedCardList[0].value,
            'offerData.framedCard_finish': this.data.framedCardList[0].finish[0].value,
            'offerData.framedCard_printing': this.data.framedCardList[0].printing[0].value,
            _finish: this.data.framedCardList[0].finish,
            _printing: this.data.framedCardList[0].printing
          })
        } else {
          this.setData({isFramedCardListShow: false,'offerData.framedCard': ''})
        }
      }
      this.countPrice();
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
          pantoneColorList2:[],
          pantoneColorList:[],
          spotColorIndex:0
        })
      }
      this.countPrice();
    }else if(e.currentTarget.dataset.key === "iscolorShow2"){
      this.setData({
        iscolorShow2:!this.data.iscolorShow2
      })
      if (this.data.iscolorShow2) {
        
      }else{
        this.setData({
          pantoneColorList2:[],
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
      // if (a>1&&!this.data.colorList[e.currentTarget.dataset.i].checked) {
      //   return false
      // }
      if (e.currentTarget.dataset.val=='其它金料'&&!this.data.colorList[e.currentTarget.dataset.i].checked) {
        this.modalFun({contentText:'其他金料请联系客服登记，谢谢合作！',time:1000})
      }
      this.setData({
        ['colorList'+`[${e.currentTarget.dataset.i}].checked`]:!this.data.colorList[e.currentTarget.dataset.i].checked
      })
      this.countPrice();
    }else if(e.currentTarget.dataset.key=='framedCard_spot'){
      this.setData({
        framedCard_spot:!this.data.framedCard_spot
      })
      if(this.data.framedCard_spot){
        let i=this.data.pantoneNumber2
        for(let j=0;j<i;j++){
          this.data.pantoneColorList2.push({value:''})
          this.setData({
            pantoneColorList2:this.data.pantoneColorList2
          })
        }
      }else{
        this.setData({
          pantoneColorList2:[]
        })
      }
      this.countPrice();   
    }
  },
  /**
   * 点击颜色
   */
  clickColor(e) {
    let el = e.currentTarget.dataset
    if (el.type == 'checked') { // 点击烫金颜色
      let bool = !this.data.colorList[el.i].chiled[el.index].checked
      this.data.colorList[el.i].chiled = this.data.colorList[el.i].chiled.map(e => {
        e.checked = false
        return e
      })
      this.data.colorList[el.i].chiled[el.index].checked = bool
      this.data.colorList[el.i].showSize = bool

      this.setData({
        ["colorList[" + el.i + "].chiled"]: this.data.colorList[el.i].chiled,
        ["colorList[" + el.i + "].showSize"]: bool
      })
    } else if (el.type == 'add') { // 增加事件
      if (el.key == 'checked') { // 烫金颜色
        let obj = JSON.parse(JSON.stringify(this.data.colorList[0]))
        obj.chiled = obj.chiled.map(e =>{
          e.checked = false
          return e
        })
        obj.showSize = false
        obj.length = ''
        obj.width = ''
        this.data.colorList.push(obj)
        this.setData({
          colorList: this.data.colorList
        })
      } else if (el.key == 'camList') { // 击凸
        this.data.camList.push({sizeLength:'',sizeWidth:''})
        this.setData({
          camList: this.data.camList
        })
      } else if (el.key == 'concaveList') { // 击凹
        this.data.concaveList.push({sizeLength:'',sizeWidth:''})
        this.setData({
          concaveList: this.data.concaveList
        })
      }
    } else if (el.type == 'minus') { // 删除事件
      if (el.key == 'checked') { // 烫金颜色
        if (this.data.colorList.length < 2) {
          this.data.colorList[0].length = ''
          this.data.colorList[0].width = ''
        } else {
          this.data.colorList.splice(el.i, 1)
        }
        this.setData({
          colorList: this.data.colorList
        })
      } else if (el.key == 'camList') { // 击凸
        if (this.data.camList.length < 2) {
          this.data.camList[0].sizeLength = ''
          this.data.camList[0].sizeWidth = ''
        } else {
          this.data.camList.splice(el.i, 1)
        }
        this.setData({
          camList: this.data.camList
        })
      } else if (el.key == 'concaveList') { // 击凹
        if (this.data.concaveList.length < 2) {
          this.data.concaveList[0].sizeLength = ''
          this.data.concaveList[0].sizeWidth = ''
        } else {
          this.data.concaveList.splice(el.i, 1)
        }
        this.setData({
          concaveList: this.data.concaveList
        })
      }
    } else if (el.type == 'digit') { // 输入尺寸事假
      this.setData({
        [el.arr +"[" + el.i + "]." + el.key]:  e.detail.value
      })
    }
    this.countPrice();
  },
  showPopup1: function (e) {
    let type=e.currentTarget.dataset.type
    console.log('surfaceHandleList',type)
    this.setData({
      [type]: !this.data[type]
    })
  },
  changeSelect(e){
    let val  = e.detail.value
    let key  = e.currentTarget.dataset.key
    let type = e.currentTarget.dataset.type
    let item = e.currentTarget.dataset.item

    switch(item){
      case 'pantoneColorList2':
        let i = val-this.data.pantoneColorList2.length
        if (i>0) {
          for(let j=0;j<i;j++){
            this.data.pantoneColorList2.push({value:''})
            this.setData({
              pantoneColorList2:this.data.pantoneColorList2
            })
          }
        }else if (i<0) {
          this.data.pantoneColorList2.splice(val)
          console.log('this.data.pantoneColorList2', this.data.pantoneColorList2, val);
          this.setData({
            pantoneColorList2:this.data.pantoneColorList2
          })
        }
        break;
    }
    this.onCancelPup(e)

    this.setData({
      [key]:val
    })
    console.log(this.data.unit);
    this.countPrice()
  },
  onCancelPup(e) {
    let key = e.currentTarget.dataset.type
    this.setData({
      [key]: !this.data[key]
    })
  },
  /**
   * 校验数据
   */
  verifyData() {
    var offer = this.data.offerData;
  
    if (offer.materialType === "其他") {
      if (!this.data.otherPaper.materialType) {
        return "请填写张材质";
      }
      if (!this.data.otherPaper.thickness) {
        return "请填写纸张克重";
      }
      if (!this.data.otherPaper.tonprice) {
        return "请填写纸张单价";
      }
    }else if (offer.materialType === "") {
      return "请选择纸张材质";
    }
    if ((!this.data.auto&&(offer.sizeLength||offer.sizeWidth||offer.sizeHeight))||this.data.auto) {
      if (offer.sizeLength === "") {
        return "请输入展开尺寸长度";
      }
      if (offer.sizeWidth === "") {
        return "请输入展开尺寸宽度";
      }
      if (offer.sizeHeight === "") {
        return "请输入展开尺寸高度";
      }
      if (offer.sizeLength*1<10||offer.sizeWidth*1<10) {
        return "尺寸低于最小限制";
      }
    }

    if((offer.sizeLength||offer.sizeWidth||offer.sizeHeight)&&(offer.sizeLength<1||offer.sizeWidth<1||offer.sizeHeight<1)){
      return '尺寸不能低于1mm'
    } 
    if(offer.sizeLength&&offer.sizeWidth&&offer.sizeHeight&&(offer.sizeLength < offer.sizeWidth && offer.sizeHeight > 0)){
      return '盒子长不能小于宽'
    }

    if (this.data.spotColor){
      let arr = this.data.pantoneColorList.filter(item=>item.value)
      if (arr.length!=this.data.pantoneColorList.length) {
        return "请填写PANTONE色号"
      }
    }
    if (offer.number === ""||offer.number==0) {
      return "请选择印刷数量";
    }
    if (offer.paperType === "其他") {
      if (!this.data.otherPaperType.inside.materialType||!this.data.otherPaperType.inside.thickness) {
        return "请填写里纸信息";
      }
      if (!this.data.otherPaperType.core.materialType||!this.data.otherPaperType.core.thickness) {
        return "请填写芯纸信息";
      }
      if (this.data.otherPaperType.tonprice=="") {
        return "请填写坑纸单价";
      }
    }

    if(this.data.framedCard_spot){
      var arr= this.data.pantoneColorList2.filter(s => s.value!=='')
      if(arr.length<this.data.pantoneNumber2){
         return "请输入裱卡印刷的专色";
      }
    }

    let  reg=/^[1-9]\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/
    let goodAl = Number(this.data.deploy?.goodAl || this.data.openSize[0])
    let goodAw = Number(this.data.deploy?.goodAw || this.data.openSize[1])
    if (this.data.gold) {
      let text = ''
      for (let i = 0; i < this.data.colorList.length; i++) {
        const el = this.data.colorList[i];
        let checked = false
        for (let ii = 0; ii < el.chiled.length; ii++) {
          const item = el.chiled[ii];
          checked = item.checked
          if (item.checked) {
            if (!el.length || !el.width) {
              text = '请输入烫金尺寸'
            } else if (Number(el.length) > goodAl || Number(el.width) >goodAw) {
              text = '烫金尺寸不可超过展开尺寸'
            } else if (Number(el.length) <= 0 || Number(el.width) <= 0) {
              text = '烫金尺寸不可小于或等于 0'
            } else if (!reg.test(el.length) || !reg.test(el.width)) {
              text = '烫金尺寸最多保留两位小数'
            }
            break
          }
        }
        if (!checked) {
          text = '请选择烫金颜色'
        }
      }
      if (text) {
        return text
      }
    }
    if (this.data.camList.length) {
      for (let i = 0; i < this.data.camList.length; i++) {
        const el = this.data.camList[i];
        if (!Number(el.sizeLength) || !Number(el.sizeWidth)) {
          return '请输入击凸尺寸'
        } else if (!reg.test(el.sizeLength) || !reg.test(el.sizeWidth)) {
          return '击凸尺寸最多保留两位小数'
        } else if (Number(el.sizeLength) > goodAl || Number(el.sizeWidth) > goodAw) {
          return '击凸尺寸不可超过展开尺寸'
        }
      }
    }
    if (this.data.concaveList.length) {
      for (let i = 0; i < this.data.concaveList.length; i++) {
        const el = this.data.concaveList[i];
        if (!Number(el.sizeLength) || !Number(el.sizeWidth)) {
          return '请输入击凹尺寸'
        } else if (!reg.test(el.sizeLength) || !reg.test(el.sizeWidth)) {
          return '击凹尺寸最多保留两位小数'
        } else if (Number(el.sizeLength) > goodAl || Number(el.sizeWidth) > goodAw) {
          return '击凹尺寸不可超过展开尺寸'
        }
      }
    }
    if (this.data.paste) {
      let text = ''
      if (offer.pasteLength === "") {
        text = "请输入贴窗尺寸长度";
      }else if (offer.pasteWidth === "") {
        text = "请输入贴窗尺寸宽度";
      }else if (offer.paste === "") {
        text = "请选择贴窗面";
      }
      if (text) {
        return text
      }
    }

    if (this.data.amboss) {
      if (offer.amboss) {
        if (offer.ambossInfo == "") {
          return "请选择压纹信息"
        }
      } else {
        return "请选择压纹编号"
      }
    }

    if (this.data.custom) {
      let custom = false
      this.data.offerData.customList.forEach(e => {
        if (e) {
          custom = true
        }
      })
      if (!custom) {
        return '请填写自定义工艺'
      }
    }
  },
  //Panton色号
  changePantoneColor(e){
    let index2 = e.currentTarget.dataset.index2
    let val = e.detail.value
    let key = e.currentTarget.dataset.key
    checkPantone({list:[val]}).then(res=>{
      if(!res.success){
        this.modalFun({contentText:res.message,time:1000})
      }
    })
    this.setData({
      priceObj:null,
      unitPrice:null,
      [key + "["+index2+"].value"]:val
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
      attrStr += `纸张材质:${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalue};`;
    }
    attrStr += `印刷颜色:${offer.printing};`
    if (this.data.spotColor) {
      let pantoneStr = this.data.pantoneColorList.map(item=>{return item.value}).join(',')
      // let val = this.data.framedCard_spot?"":"跟实物样:是;跟样类型:调色收费;服务:调色跟样;";
      // ${val}
      attrStr += `专色:${this.data.spotColorArray[this.data.spotColorIndex]},${pantoneStr};`
    }
    if(offer.surface){
      attrStr += `表面处理:${offer.surface};`
    }else{
      attrStr += `表面处理:无;`
    }
    if (offer.paperType!='其他') {
      attrStr +=`坑纸类型:${offer.paperType}_${offer.inside}_${offer.core};`
    } else {
      attrStr += `坑纸类型:其他坑_${this.data.otherPaperType.inside.thickness+this.data.otherPaperType.inside.materialType}_${this.data.otherPaperType.core.thickness}_${this.data.otherPaperType.core.materialType};坑纸${this.data.unit2[this.data.otherPaperIndex]}:${this.data.otherPaperType.tonprice};`
    }
    if (this.data.paste) {
      attrStr += `折线距:${offer.paste};贴窗:${offer.pasteLength}_${offer.pasteWidth};`
    }

    if (this.data.amboss && offer.amboss && offer.ambossInfo) {
      attrStr += `压纹:${offer.ambossInfo};`
    }

    attrStr += this.data.color?'加印白墨;':''
    var nextStr = ''
    if (this.data.postTreatment.length>0) {
      let obj = this.data.postTreatment.find(item=>item.craftName=='粘盒')
      if (obj&&obj.checked) {
        nextStr+='粘合:自动粘1处;'
      } else {
        nextStr+='粘合:不粘;'
      }
      this.data.postTreatment.map(item=>{
        if (item.checked) {
          if (item.craftName=='烫金') {
            for (let i = 0; i < this.data.colorList.length; i++) {
              const el = this.data.colorList[i];
              for (let ii = 0; ii < el.chiled.length; ii++) {
                const item = el.chiled[ii];
                if (item.checked) {
                  nextStr+=`烫金${i+1}:${item.name}_${el.length}_${el.width};`
                }
              }
            }
          } else if (item.craftName == '击凸' || item.craftName == '击凹'){
            let arr = item.craftName == '击凹' ? this.data.concaveList : this.data.camList
            for (let i = 0; i < arr.length; i++) {
              const el = arr[i];
              nextStr+=`${item.craftName}${i+1}:${el.sizeLength}_${el.sizeWidth};`
            }
          } else if(item.craftName=='贴窗'||item.craftName=='粘盒'||item.craftName=='自定义工艺'){
            nextStr+=''
          } else if(item.craftName!='压纹' && item.craftName!='裱卡'){
            nextStr+=item.craftName+'1:1_1;'
          }
        }
      })
    }else{
      nextStr+='粘合:不粘;'
    }

    if (this.data.isFramedCardListShow) {
      if (offer.framedCard) {
        attrStr += `对裱:${offer.framedCard};`
      }
      if (offer.framedCard_finish) {
        attrStr += `裱卡表处理:${offer.framedCard_finish};`
      }
      if (offer.framedCard_printing) {
        attrStr += `裱卡颜色:${offer.framedCard_printing};`
      }
      if (this.data.framedCard_spot) {
        let str = this.data.pantoneColorList2.map(e => e.value).join()
        attrStr += `裱卡专色1:${this.data.pantoneColorList2.length},${str};`
        // 跟实物样:是;跟样类型:调色收费;服务:调色跟样;
      }
    }
    
    if (nextStr) {
      attrStr += nextStr
    }

    if (this.data.custom) {
      offer.customList.forEach(e => {
        attrStr += '#自定义工艺#:' + e + ';'
      })
    }
    // 5月份 修改以下 参数 改变 拼版接口参数
    let arr = ['表面处理:逆向UV;', '银卡纸', '白墨']
    let machine = false
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      if (attrStr.indexOf(el) != -1) {
        machine = true
        break;
      }
    }
    this.setData({
      attrStr:attrStr,
      machine: machine
    })
    return attrStr;
  },
  /**
   * 立即下单
   */
  placeOrder() {
    this.edition(1)
    this.saveReport(4)
  },
  /**
   * 添加购物车
   */
  addEditionCart() {
    this.edition(0)
    this.saveReport(3)
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
    oversize([{
      goodsId: _this.data.auto?_this.data.goodsId:764,
      goodsAttr: _this.data.attrStr
    }]).then(()=>{
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
        _this.getCartCount()
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

    })
   
 },
 valuation(e){
  var _this = this;
  var msg = this.verifyData();
  if(msg){
    this.setData({
      price: '0.00' ,
      originalPrice: '0.00',
      'offerData.letNumber':0,
      priceArr:[],
      priceObj:null,
      unitPrice:null
    });
  
    if(msg){
      _this.modalFun({contentText:msg,time:1000})
    }
    return
  }
   this.setData({
     pin:true
   })
   this.startPinBan(e.currentTarget.dataset.re)
   this.saveReport(2)
 },
  /**
   *  计算价格
   */
 async countPrice(e) {
  var _this = this;
  var msg = this.verifyData();
  if (!_this.data.pinBanStr) {
    console.log('停止计价','!_this.data.pinBanStr');
    return
  }
  if(msg){
    this.setData({
      price: '0.00' ,
      originalPrice: '0.00',
      'offerData.letNumber':0,
      priceArr:[],
      priceObj:null,
      unitPrice:null
    });
    wx.hideLoading();
    return
  }
  if (_this.data.showReset) {
    console.log('停止计价','showReset');
    return
  }
   
   if (!this.data.pin&&!this.data.pinbanObj) {
    console.log('停止计价','!this.data.pinbanObj');
     return
   }
   clearTimeout(this.data.timeOut)
    //改变上面选项需要等待纸张重新计价完成
    if (this.data.flag1||this.data.flag2) {
      this.setData({
        timeOut : setTimeout(()=>{_this.countPrice(e)},500)
      })
      return false
    }

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
      city:(_this.data.region[0]!=''?_this.data.region[0]:'')+' '+(_this.data.region[1]!=''?_this.data.region[1]:'')+' '+(_this.data.region[2]!=''?_this.data.region[2]:''),
      pinBanStr:_this.data.pinBanStr,
      openSize: _this.data.auto ? [] : _this.data.openSize
    }).then((res) => {
      _this.getCartCount()
      wx.hideLoading()
      if (res.success) {

        var data = res.data
        data.priceInfo.weight = res.data.priceInfo.weight.toFixed(2)
        let strArr =  data.priceInfo.paperTonsMaterPriceStr.split('/')
        if(strArr.length>0){
          data.priceInfo.paperTonsMaterPriceStr2 = String(data.priceInfo.paperTonsDiscountPrice)+'元/'+strArr[1]
        }
        let pinbanObj 
        for(let val in data.pin_ban){
          pinbanObj = data.pin_ban[val][0]
        }
         pinbanObj.openSize[0]=numberFormat(res.data.priceInfo.openSize[0])
         pinbanObj.openSize[1]=numberFormat(res.data.priceInfo.openSize[1])
        _this.setData({
          price: Math.ceil(data.total_price*100)/100,
          pinbanImg:res.data.pin_ban.output_png_path,
          priceObj:data,
          unitPrice:(data.total_price/_this.data.offerData.number).toFixed(2),
          orderTime:Number(data.time_normal),
          pin:false,
        });
        if (!_this.data.pinbanObj) {
          _this.setData({
            pinbanObj:pinbanObj
          })
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
  /** 获取压纹 */
  getEmboss(){
    let _this = this;
    pageEmbossTexture({
      pageNumber:1,
      pageSize:100
    }).then(res=>{
      console.log(res)
      let ambossInfoList = res.data.map((e) => {
        let cartArr = e.embossTextureName.split("-");
        if (cartArr.length > 1) {
          let cart = cartArr[0];
          e.cart = cart;
          e.embossTextureName2 = cartArr[1];
        }
        return e;
      });
      _this.setData({
     
        ambossInfo:ambossInfoList[0],
        ambossInfoList
      })
    })
  },
  /**
   * 关闭纹理信息组件
   */
  showAmbossFun(){
    this.setData({
      showAmboss:'1'
    })
  },
  hidewAmbossFun(){
    this.setData({
      showAmboss:'0'
    })
  },
  radioAmbossFun(e){
    let _this = this;
    console.log(e)
    if(e.detail){
      let ambossInfo = _this.data.ambossInfoList.find(s => s.id ===e.detail);
      _this.setData({
        ambossInfo,
        ["offerData.ambossInfo"]:''+ambossInfo.embossTextureNo
      })
      _this.hidewAmbossFun()
    }
  },
  saveReport(actionId){
    let _this = this;
    app.saveReport(_this.data.goodsId!==640?{goodsId:_this.data.goodsId, actionId:actionId,type:'专版报价'}:{channel:500800})
  }
});

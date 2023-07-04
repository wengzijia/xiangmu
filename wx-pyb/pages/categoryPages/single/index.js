//index.js
//获取应用实例
const app = getApp();
import {throttling,debounce,copyQQ,replaceAddress,numberFormat,oversize} from '../../../utils/util'
import {
  listPaper,
  listColorPaper,
  invoke,
  byBoxNameGetCraft,
  getPriceV31,
  getPaperPrice,
  checkPantone,
  getFrontPaperMap,
  getAndSetConfig
} from "../../../api/orderDetailsApi.js";
import {
  add,
  countCart,
  singUpdateCheck
} from "../../../api/cartApi.js";
import { areaList } from '@vant/area-data'
import { signByBehavior } from "../../../api/pinban.js";

Page({
  data: {
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
      side: 'oneSide', /**印刷颜色 */
      sideColor: '多色_CMYK',
      sideColor2: '多色_CMYK',
      customList: [''],
      saas: false, // 服务 调色跟样
      saasBox: false, // 包装服务 
    },
    carton:false, // 包装服务 外箱套蛇皮袋
    postTreatment:[],
    color:false,//加印白墨
    addColor:false,
    surfaceTreatment:[
      {
        value:'哑胶',
        lable:'哑胶'
      },
      {
        value:'光胶',
        lable:'光胶'
      },
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
    printingColorList: [{lable:'单面印刷',value:'oneSide'}, {lable:'双面印刷', value: 'twoSide'}],
    cmykList: [{lable: '四色', value: '多色_CMYK'}, {lable: '无', value: '无'}],
    cmykColor: '单色',
    cmykShow: false,
    cmylColumns: ['青色(C)','品红(M)','黄色(Y)','黑色(K)'],
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
    colorList:[],//烫金颜色
    currentTab:'single',
    numberText:'请输入1000的整倍数',
    region:['', '',''],//位置
    goodsId:'',
    show:false,//显示省市区选择器
    areaList,
    areaListId:'',
    spotColor:false,//专色
    spotColorArray:[1,2],
    spotColorIndex:0,
    pantoneColorList:[],//pantong色号列表
    spotColor2:false,//专色
    spotColorArray2:[1,2],
    spotColorIndex2:0,
    pantoneColorList2:[],//pantong色号列表
    custom: false,
    ifCustom: false,
    sassColor: true,
    normalPrint:true
  },
  onLoad: function (option) {
    this.getListPaper();
    this.getPostProcessing()
    // 自定义工艺 是否展示
    getAndSetConfig({status:2,data: 2,secretKey:2,key:1}).then(res => {
      this.setData({
        ifCustom: res
      })
    })
  //   wx.showModal({
  //     title: '提示',
  //     cancelText: '否',
  //     showCancel: false,
  //     confirmText: '确定',
  //     confirmColor: '#ff0036',
  //     content: '1月15号后本通道可正常下单，年后开工第一时间安排生产！',
  //     success(res) {
  //     }
  // })
    
  },
  onShow(){
    this.getCartCount()
    
  },
  /**获取购物车数量 */
  getCartCount(){
    countCart().then(res=>{
      this.setData({
        cartCount:res.data.cartCount
      })
    })
  },
  //获取
  replaceStr(){
    getFrontPaperMap().then(res=>{
      
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
      orderType:3
    }).then((res) => {
      console.log(res)
      if (res.success) {
       res.data = res.data.filter(val=>{ return val.data.name!="其他"})
        this.setData({
          "offerInfo.materialType.list": res.data.map((e) => {
            console.log(e);
            return { ...e, value: e.data.name, lable: e.data.name };
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
      if (_this.data.offerData.materialType=='单铜纸'&&_this.data.offerData.thickness=='350') {
        val = val>500?1000:500
      }else{
        val = 1000
      }
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
    // console.log('value',e);
    // if(value==''){
    //   return 
    // }
    if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.number'){
      // console.log('eeeeeeeeee',e);
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
        if (_this.data.offerData.materialType=='单铜纸'&&_this.data.offerData.thickness=='350') {
          value = value>500?1000:500
        }else{
          value = 1000
        }
      }else if(value>99999000){
        value = 99999000
      }else{
        value = value%1000<500?Math.floor(value/1000)*1000:(Math.floor(value/1000)+1)*1000
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
      this.setData({
        [key]:value
      });
      
      /**重新计算纸价 */
      // if(key=='offerData.tonsPrice'){
      //   this.getAPaperPrice('tons')
      // }
      // if(key=='offerData.pitPaperPrice'){
      //   this.getAPaperPrice('pit')
      // }
      // if(key=='offerData.sizeLength'||key=='offerData.sizeWidth'){
      //   this.getAPaperPrice('tons')
      //   this.getAPaperPrice('pit')
      // }
      if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'){
        var width = this.data.offerData.sizeWidth
        var length = this.data.offerData.sizeLength
        var bool = false
        var contentText = ''
        // if(length>1100||width>1100){
        //   bool = true
        //   contentText = '定纸尺寸不能超过1100*1100'
        // }else 
        if(this.data.offerData.sizeLength&&this.data.offerData.sizeWidth){
           if ((this.data.offerData.sizeLength*1>1000||this.data.offerData.sizeWidth*1>1000)||(this.data.offerData.sizeLength*1>700&&this.data.offerData.sizeWidth*1>700)) {
          // return "尺寸超出纸张大小";
            this.modalFun({contentText:'尺寸超出纸张大小',time:1000})
          }
          if (this.data.offerData.sizeLength*1<10||this.data.offerData.sizeWidth*1<10) {
            // return "尺寸低于最小限制";
            this.modalFun({contentText:'低于最小限制10*10',time:1000})
          }
        }
       
        if(length<1||width<1){
          bool = true
          contentText = '尺寸不能低于1mm'
        }
      }
    }
   _this.countPrice()
  },
  onClose() {
    this.setData({
      cmykShow: false
    })
  },
  onConfirm(e) {
    this.setData({
      cmykShow: false,
      cmykColor: e.detail.value,
      ["offerData.sideColor2"]: '单色'
    })
    this.countPrice();
    this.isSassColor()
  },
  /**
   * 按钮选中
   * @param {*} e
   */
  async radioTap(e) {
    // 单色 弹窗
    if (e.currentTarget.dataset.key === "sideColor2" && e.currentTarget.dataset.val == '单色') {
      return this.setData({
        cmykShow: true,
      })
    }
    //如果传进来的值与之前的值一样，就直接退出操作
    if(this.data.offerData[e.currentTarget.dataset.key]===e.currentTarget.dataset.val) {
      return
    }
   
   
    if (e.currentTarget.dataset.key === "saas" && e.currentTarget.dataset.val) {
      wx.showModal({
        title: '服务提醒',
        content: '此服务只能把颜色调到接近而不是完全一样，上机过程中可以拍照确认，如果要求高建议做专色或者专版。',
        showCancel: false,
        confirmText: '知道了'
      })
    }
    this.setData({
      ["offerData." + e.currentTarget.dataset.key]: e.currentTarget.dataset.val,
    });
    /**纸张材质 */
    if (e.currentTarget.dataset.key === "materialType") {
      if (e.currentTarget.dataset.val=='银卡纸') {
        this.setData({
          spotColorArray: [1],
          pantoneColorList: [],
          spotColor: '',
          spotColorIndex: 0
        })
      } else {
        this.setData({
          spotColorArray: [1,2],
          pantoneColorList: [],
          spotColor: '',
          spotColorIndex: 0
        })
      }
      var obj = this.data.offerInfo.materialType.list.filter(
        (l) => l.lable === e.currentTarget.dataset.val
      )[0];
      if (e.currentTarget.dataset.val=='单铜纸'&&obj.children[0].kg=='350') {
        this.setData({
          numberText:'请输入1000的整倍数，最小印刷数量不能少于500'
        })
      }else{
        this.setData({
          numberText:'请输入1000的整倍数'
        })
      }
      if (e.currentTarget.dataset.val.indexOf('金')!=-1 || e.currentTarget.dataset.val.indexOf('银')!=-1 ) {
        this.setData({
          "offerData.surface":'逆向UV',
          surfaceTreatment:[{value:'逆向UV',lable:'逆向UV'}],
          addColor:true
        })
      }else{
        this.setData({
          "offerData.surface":'哑胶',
          addColor:false,
          surfaceTreatment:[
            {
              value:'哑胶',
              lable:'哑胶'
            },
            {
              value:'光胶',
              lable:'光胶'
            },
          ],
          color:false
        })
        if (this.data.offerData.surface=='逆向UV') {
          this.setData({
            "offerData.surface":''
          })
        }
      }
      let postTreatmentList = obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id})[0].craftList.map(item=>{item.checked=false; return item})
      if (!postTreatmentList.find(item=>{return item.craftName=='粘盒'})) {
        postTreatmentList.push({craftName:'粘盒',checked:true})
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
        "offerData.number":""
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
    }
    if (e.currentTarget.dataset.key === "thickness"){
      if (this.data.offerData.materialType=='单铜纸'&&this.data.offerData.thickness=='350') {
        this.setData({
          numberText:'请输入1000的整倍数，最小印刷数量不能少于500'
        })
      }else{
        this.setData({
          numberText:'请输入1000的整倍数'
        })
      }
      var obj = this.data.quantityList.filter(
        (l) => l.miniEditionPaper.id === e.currentTarget.dataset.id
      )[0];
      // console.log(66666666666,obj);
      this.setData({
        quantity:obj.quantityList,
        "offerData.paperId":e.currentTarget.dataset.id,
        "offerData.number":""
      })
      this.numberChange()
    }
    
    // if (e.currentTarget.dataset.key === "paste") {
    //   this.setData({
    //   })
    // }
    this.countPrice()
    this.isSassColor()
  },
  checkTap:function(e){
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
        if (item.checked && item.craftName != '粘盒') {
          _index+=1
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
      if (_index > 1) {
        this.setData({
          tips2:true
        })
      } else {
        this.setData({
          tips2: false
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
    } else if (e.currentTarget.dataset.key === "color"){
      this.setData({
        color:!this.data.color
      })
    } else if (e.currentTarget.dataset.key === "gold"){
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
    } else if (e.currentTarget.dataset.key === "spotColor"){
      this.setData({
        spotColor:!this.data.spotColor
      })
      // this.setData({
      //   normalPrint:false,
      //   'offerData.saas': true
      // })
      if (this.data.spotColor) {
        this.data.pantoneColorList.push({value:''})
        this.setData({
          pantoneColorList:this.data.pantoneColorList,
          priceObj:null,
          unitPrice:null,
          normalPrint:false,
          // 'offerData.saas': true
        })
        if (this.data.pinbanObj) {
          this.setData({
            showReset:true,
          })
        }
      }else{
        this.setData({
          pantoneColorList:[],
          spotColorIndex:0,
          normalPrint:true,
          // 'offerData.saas': false
        })
      }
    } else if (e.currentTarget.dataset.key === "spotColor2"){
      this.setData({
        spotColor2:!this.data.spotColor2
      })
      if (this.data.spotColor2) {
        this.data.pantoneColorList2.push({value:''})
        this.setData({
          pantoneColorList2:this.data.pantoneColorList2,
          priceObj:null,
          unitPrice:null
        })
        if (this.data.pinbanObj2) {
          this.setData({
            showReset:true,
          })
        }
      }else{
        this.setData({
          pantoneColorList2:[],
          spotColorIndex2:0
        })
      }
    } else if (e.currentTarget.dataset.key === "carton") {
      this.setData({
        carton: !this.data.carton
      })
    }
    this.countPrice();
    this.isSassColor()
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
    } else if (e.currentTarget.dataset.key&&e.currentTarget.dataset.key=='spotColor2') {
      let val = this.data.spotColorArray2[e.detail.value]
      let i = val-this.data.pantoneColorList2.length
      this.setData({
        spotColorIndex2: e.detail.value,
      })
      if (i>0) {
        for(let j=0;j<i;j++){
          this.data.pantoneColorList2.push({value:''})
          this.setData({
            pantoneColorList2:this.data.pantoneColorList2,
            priceObj:null,
            unitPrice:null
          })
        }
      }else if (i<0) {
        this.data.pantoneColorList2.splice(val)
        this.setData({
          pantoneColorList2:this.data.pantoneColorList2
        })
        this.countPrice()
      }
    }
  },
  //Panton色号
  changePantoneColor(e){
    let index2 = e.currentTarget.dataset.index2
    let key = e.currentTarget.dataset.key
    let val = e.detail.value
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
   * 校验数据
   */
  verifyData() {
    var offer = this.data.offerData;
  
    if (offer.materialType === "") {
      return "请选择纸张材质";
    }
    if (offer.sizeLength === "") {
      return "请输入展开尺寸长度";
    }
    if (offer.sizeWidth === "") {
      return "请输入展开尺寸宽度";
    }
    if ((offer.sizeLength*1>1000||offer.sizeWidth*1>1000)||(offer.sizeLength*1>700&&offer.sizeWidth*1>700)) {
      return "尺寸超出纸张大小";
    }
    if (offer.sizeLength*1<10||offer.sizeWidth*1<10) {
      return "尺寸低于最小限制";
    }
    if (offer.number === ""||offer.number==0) {
      return "请选择印刷数量";
    }
    if (offer.surface === "") {
      return "请选择表面处理";
    }
    if (this.data.spotColor) {
      let text = ''
      this.data.pantoneColorList.forEach(e => {
        if (e.value == '') {
          text = "请填写专色"
        }
      })
      if (text) {
        return text
      }
    }
    if (offer.side == 'twoSide' && this.data.spotColor2) {
      let text = ''
      this.data.pantoneColorList2.forEach(e => {
        if (e.value == '') {
          text = "请填写专色"
        }
      })
      if (text) {
        return text
      }
    }
    // if (offer.number === ""||offer.number==0) {
    //   return "请选择印刷数量";
    // }
    // if (offer.surface === "") {
    //   return "请选择表面处理";
    // }
    if (this.data.postTreatment.length>0) {
      let text = ''
      this.data.postTreatment.forEach(item=>{
        if (item.checked&&item.craftName=='烫金') {
          let arr = []
          this.data.colorList.forEach((items,i)=>{
            if (items.checked) {
              arr.push(items)
            }
          })
          if (arr.length<1) {
            text = '请选择烫金颜色'
          }
        }
      })
      if (text) {
        return text
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
  /**
   * 拼接数据
   * @returns 属性字符串 
   */
   joinStr() {
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    // var attrStr = ``//展开尺寸:500_500;纸张材质:超高松纸_350;表面处理:哑胶;印刷颜色:多色_CMYK;粘合:自动粘1处;0;
    var attrStr = `展开尺寸:${Number(offer.sizeLength).toFixed(2)}_${Number(offer.sizeWidth).toFixed(2)};纸张材质:${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalue};表面处理:${offer.surface};0;`;
    // attrStr = attrStr +`面纸吨价:${offer.tonsPrice}元;`
    // var threeStr = `纸张费用:${this.data.paperTonprice}元;`
    // if (this.data.currentTab==0) {
    //   threeStr += `坑纸吨价:${offer.pitPaperPrice}元;坑纸费用:${this.data.pitPaperTonprice}元;裱纸费用:${offer.laminatingPrice}元;`
    // }
    if (this.data.paste) {
      attrStr += `折线距:${offer.paste};贴窗:${offer.pasteLength}_${offer.pasteWidth};`
    }

    // 单双面 印刷
    if (offer.side == 'oneSide') {
      attrStr += `印刷:单面印刷;印刷颜色:${offer.sideColor};`
      if (this.data.spotColor) {
        console.log('pantoneColorList', this.data.spotColorArray);
        let pantoneStr = this.data.pantoneColorList.map(item=>{return item.value}).join(',')
        attrStr += `专色:${this.data.spotColorArray[this.data.spotColorIndex]},${pantoneStr};`
      }
    } else if (offer.side == 'twoSide') {
      attrStr += `印刷:双面印刷;`
      attrStr += `正面印刷颜色:${offer.sideColor};`
      if (this.data.spotColor) {
        let pantoneStr = this.data.pantoneColorList.map(item=>{return item.value}).join(',')
        attrStr += `正面专色:${this.data.spotColorArray[this.data.spotColorIndex]},${pantoneStr};`
      }
      attrStr += `反面印刷颜色:${offer.sideColor2 != '单色' ? offer.sideColor2 : '单色_' + this.data.cmykColor.slice(0,2)};`
      if (this.data.spotColor2) {
        let pantoneStr2 = this.data.pantoneColorList2.map(item=>{return item.value}).join(',')
        attrStr += `反面专色:${this.data.spotColorArray2[this.data.spotColorIndex2]},${pantoneStr2};`
      }
    }

    attrStr += this.data.color?'加印白墨;':''

    var nextStr = ''
    if (this.data.postTreatment.length>0) {
      let obj = this.data.postTreatment.find(item=>item.craftName=='粘盒')
      if (obj.checked) {
        nextStr+='粘合:自动粘1处;'
      } else {
        nextStr+='粘合:不粘;'
      }
      this.data.postTreatment.map(item=>{
        if (item.checked) {
          if (item.craftName=='烫金') {
            // nextStr+='烫金1:1_1_1;'
            let index = 1
            this.data.colorList.forEach((item,i)=>{
              if (item.checked) {
                nextStr+=`烫金${index}:${item.name}_1_1;`
                index++
              }
            })
          }else if(item.craftName=='贴窗'||item.craftName=='粘盒'||item.craftName=='自定义工艺'){
            nextStr+=''
          }else{
            nextStr+=item.craftName+'1:1_1;'
          }
        }
      })
    }
    
    if (nextStr) {
      attrStr += nextStr
    }
    console.log(this.data.spotColor2,this.data.spotColor);
    if (this.data.offerData.saas) {
      attrStr += '跟实物样:是;跟样类型:调色收费;服务:调色跟样;'
    }
    if (this.data.custom) {
      offer.customList.forEach(e => {
        attrStr += '#自定义工艺#:' + e + ';'
      })
    }
    // 包装服务
    attrStr += `包装服务:${offer.saasBox ? '盒子扎纸带' : '盒子扎皮筋'};`
    attrStr += `外箱套蛇皮袋:${this.data.carton ? '是' : '否'};`

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
    return attrStr;
  },
  isSassColor() {
    let data = this.data
    let sass = false
    if (data.color) { // 白墨
      sass = true
    } else if (data.spotColor) { // 正面专色
      sass = true
    } else if (data.spotColor2) { // 背面专色
      sass = true
    } else if (data.offerData.sideColor != '无') { // 正面印刷
      sass = true
    } else if (data.offerData.sideColor2 != '无' && data.offerData.side == 'twoSide') { // 背面印刷
      sass = true
    }
    this.setData({
      sassColor: sass,
      'offerData.saas': sass ? data.offerData.saas : false
    })
  },
  /**
   * 立即下单
   */
  placeOrder() {
    this.edition(1)
    app.saveReport({ 
      "actionId": 2,
      "channel": 600000,
    })
  },
  /**
   * 添加购物车
   */
  addEditionCart() {
    this.edition(0)
    app.saveReport({ 
      "actionId": 5,
      "channel": 600000,
    })
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
    if(offer.sizeLength<1||offer.sizeWidth<1){
      _this.modalFun({contentText:'尺寸不能低于1mm',time:1000})
      return
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
   var attrStr = _this.joinStr();
   oversize([{
      goodsId: 640,
      goodsAttr: attrStr
    }]).then(()=>{
      var info = {
        miniCart: {
          extendsStr: "0",
          goodsAttr: attrStr,
          goodsId: 640,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
          goodsTotal: _this.data.price,
          isfrom: isFrom,
          num: _this.data.offerData.number,
          totalTime: _this.data.orderTime*24,
          webfrom:1
        },
        number: 1
      };
      _this.addCardFn(info,isFrom)
    })
    // var info = {
    //   miniCart: {
    //     extendsStr: "0",
    //     goodsAttr: attrStr,
    //     goodsId: 640,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
    //     goodsTotal: _this.data.price,
    //     isfrom: isFrom,
    //     num: _this.data.offerData.number,
    //     totalTime: _this.data.orderTime*24,
    //     webfrom:1
    //   },
    //   number: 1
    // };
    // if(Osize&&Osize[0].sizeMax){
    //   wx.showModal({
    //     title: '温馨提示',
    //     showCancel: false, //隐藏取消按钮
    //     confirmColor:'#E9333F',
    //     content: '该商品包装尺寸过大，工厂无合适纸箱进行打包，建议下单后联系业务员定制纸箱发货。如未定制纸箱，则发货默认牛皮纸打包，请知悉。',
    //     success: function(res) {
    //         if (res.confirm) {
    //           _this.addCardFn(info,isFrom)
    //           // console.log('点击确认回调')
    //         } 
    //         // else {
    //         //     console.log('点击取消回调')
    //         // }
    //     }
    //   })

    // }else{
    //   _this.addCardFn(info,isFrom)
    // }

 },
 addCardFn(info,isFrom){
  var _this = this
  wx.showLoading({
    title: isFrom==0?'添加购物车':'正在下单',
    mask:true
  })
  add(info).then(res => {
    _this.getCartCount()
    wx.hideLoading()
    if (res.success) {
      if(isFrom==1){
        wx.hideLoading()
        wx.navigateTo({
          url: "../../Confirm/ConfirmSingleOrder/index?isFrom=1&pickUpDate="+this.data.pickUpDate,
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
  /**
   *  计算价格
   */
 async countPrice() {
   clearTimeout(this.data.timeOut)
    var _this = this;
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
        _this.modalFun({contentText:msg2,time:1000})
      }
      return
    }
    //改变上面选项需要等待纸张重新计价完成
    if (this.data.flag1||this.data.flag2) {
      this.setData({
        timeOut : setTimeout(()=>{_this.countPrice()},500)
      })
      return false
    }
    var attrStr = _this.joinStr();
    wx.showLoading({
      mask:true
    })
    let obj = {
      wx_pinban_V31: {
        goodsId:640,
        number: _this.data.offerData.number,
        goodsAttr: attrStr
      }
    }
    signByBehavior({
      moduleName: "wx-pinban",
      desc: JSON.stringify(obj)
    })
    getPriceV31({
      // factoryId:'',
      // fnumber: 1,
      // goodsAttr: attrStr,
      // number: _this.data.offerData.printingNum,
      // paperId: 0,
      // type: 0,
      // factoryId:'',
      goodsId:640,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
      fnumber: 1,
      goodsAttr: attrStr,
      number: _this.data.offerData.number,
      cextends:1,
      type: 0,
      city:(_this.data.region[0]!=''?_this.data.region[0]:'')+' '+(_this.data.region[1]!=''?_this.data.region[1]:'')+' '+(_this.data.region[2]!=''?_this.data.region[2]:''),//'广东省 深圳市'
    }).then((res) => {
      _this.getCartCount()
      wx.hideLoading()
      if (res.success) {
        var data = res.data
        data.priceInfo.weight=numberFormat(data.priceInfo.weight)
        _this.setData({
          price: Math.ceil(data.total_price*100)/100 ,
          originalPrice: data.priceOne + data.cuttingFee,
          'offerData.letNumber':data.lose,
          priceObj:data,
          orderTime:Math.ceil(data.time_slow/24),
          pickUpDate:data.out_time
          // priceArr:data.paperPriceOne?priceArr:[],
        });
   
      }else{
        _this.modalFun({contentText:res.message+'请稍后重试',time:2000})
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
      url: '../edition/tips/index'
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
  // 卡盒和坑盒之间的切换
  tabsCrount: function (e) {
    let _this = this;
      wx.showLoading({
        title:'页面正在跳转中...',
        mask:true
      })
    wx.navigateTo({
      url: '../singleTab/index',
      complete: () => {
        wx.hideLoading()
    }
    })     
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
});

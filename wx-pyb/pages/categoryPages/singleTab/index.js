//index.js
//获取应用实例
const app = getApp();
import {throttling,debounce,copyQQ,replaceAddress,numberFormat} from '../../../utils/util'
import {
  listPaper,
  listColorPaper,
  invoke,
  byBoxNameGetCraft,
  getPriceV31,
  getPaperPrice,
  getFrontPaperMap
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
      saasBox: false, // 包装服务
    },
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
    numberText:'请输入1000的整倍数',
    currentTab:'singleTab',
    region:['', '',''],//位置
    goodsId:'',
    show:false,//显示省市区选择器
    areaList,
    areaListId:'',
  },
  onLoad: function (option) {
    this.getListPaper();
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
      orderType: 6
    }).then((res) => {
      if (res.success) {
        this.setData({
          "offerInfo.materialType.list": res.data.map((e) => {
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
    // console.log('value',e);
    // if(value==''){
    //   return 
    // }
    if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'||key=='offerData.number'){
      value = Number(e.detail.value)
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
      if(key=='offerData.sizeWidth'||key=='offerData.sizeLength'){
        var width = this.data.offerData.sizeWidth
        var length = this.data.offerData.sizeLength
        var bool = false
        var contentText = ''
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
        // 输入尺寸判断 是否选中纸箱
        if (this.data.offerData.saasBox) {
          if (this.data.offerData.sizeLength > 400 || this.data.offerData.sizeWidth > 400
            || (this.data.offerData.sizeLength > 251 && this.data.offerData.sizeWidth > 251)) {
            this.modalFun({contentText:'没有该尺寸的纸箱,已调整为牛皮纸+蛇皮袋',time:1800})
            this.setData({
              'offerData.saasBox': false
            })
          }
        }
      }
    }
   _this.countPrice()
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
          "offerData.surface":'',
          surfaceTreatment:[{value:'逆向UV',lable:'逆向UV'}],
          addColor:true
        })
      }else{
        this.setData({
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
     
      this.setData({
        "offerInfo.thickness.list": obj.children.map((s) => ({
          ...s,
          value: s.kg,
          lable: s.name,
        })),
        "offerData.thickness": obj.children[0].kg,
        "offerData.paperId": obj.children[0].id,
        // postTreatment:obj.craftList,
        // quantity:obj.quantityList,
        quantity:obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id})[0].quantityList,
        quantityList:obj.childrenThree.filter(i=>{return i.miniEditionPaper.pid==obj.data.id}),
        isShowIsChalk:e.currentTarget.dataset.val!='粉灰纸'&&e.currentTarget.dataset.val!='单铜纸'?true:false,
        UV:e.currentTarget.dataset.val.indexOf('金')!=-1 || e.currentTarget.dataset.val.indexOf('银')!=-1,
        "offerData.number":""
      });
      this.numberChange()
    } else if (e.currentTarget.dataset.key === "thickness"){
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
    } else if (e.currentTarget.dataset.key === 'saasBox' && e.currentTarget.dataset.val) {
      if (this.data.offerData.sizeLength > 400 || this.data.offerData.sizeWidth > 400
        || (this.data.offerData.sizeLength > 251 && this.data.offerData.sizeWidth > 251)) {
        this.modalFun({contentText:'没有该尺寸的纸箱',time:1000})
        this.setData({
          ["offerData." + e.currentTarget.dataset.key]: false
        })
      }
    }
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
  },
  /**
   * 拼接数据
   * @returns 属性字符串 
   */
   joinStr() {
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    console.log('offer',offer)
    console.log('info',info)
    // var attrStr = ``//展开尺寸:500_500;纸张材质:超高松纸_350;表面处理:哑胶;印刷颜色:多色_CMYK;粘合:自动粘1处;0;
    // ${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalue}
    var attrStr = `展开尺寸:${Number(offer.sizeLength).toFixed(2)}_${Number(offer.sizeWidth).toFixed(2)};纸张材质:${offer.materialType};纸张克重:${offer.thickness}g白面白坑;`;
    attrStr += `打包方式:${offer.saasBox ? '纸箱' : '牛皮纸+蛇皮袋'};`
    return attrStr;
  },
  /**
   * 立即下单
   */
  placeOrder() {
    this.edition(1)
    app.saveReport({ 
      "actionId": 2,
      "channel": 601000,
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
   if(!_this.data.price){
     return
   }
  var msg = this.verifyData();
    if (msg) {
      _this.modalFun({contentText:msg,time:1000})
      return;
    }
    var offer = _this.data.offerData;
    if(offer.sizeLength<1||offer.sizeWidth<1){
      _this.modalFun({contentText:'尺寸不能低于1mm',time:1000})
      return
    }
    wx.showLoading({
      title: isFrom==0?'添加购物车':'正在下单',
      mask:true
    })
    
    var attrStr = _this.joinStr();
    var info = {
      miniCart: {
        extendsStr: "0",
        goodsAttr: attrStr,
        goodsId: 933,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
        goodsTotal: _this.data.price,
        isfrom: isFrom,
        num: _this.data.offerData.number,
        totalTime: _this.data.orderTime*24,
        webfrom:1
      },
      number: 1
    };
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
      title:'加载中...',
      mask:true
    })
    let obj = {
      wx_pinban_V31: {
        goodsId: 933,
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
      goodsId:933,//盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
      fnumber: 1,
      goodsAttr: attrStr,
      number: _this.data.offerData.number,
      cextends:1,
      type: 0,
      city:(_this.data.region[0]!=''?_this.data.region[0]:'')+' '+(_this.data.region[1]!=''?_this.data.region[1]:'')+' '+(_this.data.region[2]!=''?_this.data.region[2]:''),
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
    wx.switchTab({
      url: '/pages/singleCart/index',
    })
  },
  tabsCrount: function (e) {
    let _this = this;
      wx.showLoading({
        title:'页面正在跳转中...',
        mask:true
      })
    wx.navigateBack({
      delta:1,
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

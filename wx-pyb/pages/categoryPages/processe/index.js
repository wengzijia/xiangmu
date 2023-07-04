//index.js
//获取应用实例
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
import {throttling,debounce,copyQQ} from '../../../utils/util'
import {
  addEdition,
} from "../../../api/cartApi.js";
Page({ 
  data: {
    printingInfo:{
      pantone:{val:''},
    },
    select:false,
    printing:{//印刷工序参数
      type:'printing',
      processName:'印刷',
      sizeLength:'',
      sizeWidth:'',
      number:'',//数量
      printingMachineType:'',//印刷机类型
      thickness:'',//材质/克重
      printingMode:'单面印刷',//印刷方式
      printingColor:'',//印刷颜色
      pantoneNumber:0,//专色数量
      pantoneColorList:[],//pantone色号
      lookColor:false,//是否看色
      amount:'',//总价
      printingMachine:[//印刷机类型list
        {
          value:'普通印刷机',
          lable:'普通印刷机'
        },
        {
          value:'UV印刷机',
          lable:'UV印刷机'
        },
      ],
      printingModeList:[//印刷方式list
        {
          value:'单面印刷',
          lable:'单面印刷'
        },
      ],
    },
    number:'',
    isFollowinfo:0,
    procedureList:[]
  },
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  onLoad: function () {
    wx.showShareMenu()
    this.data.procedureList.push(this.data.printing)
    this.setData({
      procedureList:this.data.procedureList
    })
    console.log(59,this.data.procedureList);
  },
  other:function (params) {
    wx.redirectTo({
      url:'./other/index'
    })
  },
  //显示select
  showSelect(){
    this.setData({
      select:!this.data.select
    })
  },
  //改变select值
  changeSelect(e){
    console.log(74,e);
    let index = e.currentTarget.dataset.index
    let val = e.currentTarget.dataset.val
    let key = e.currentTarget.dataset.key
    this.setData({
      ["procedureList["+index+"]."+key]:val
    })
    console.log('procedureList',index,key,val);
    let i = val-this.data.procedureList[index].pantoneColorList.length
    console.log(i);
    console.log(81,this.data.procedureList);
 
    if (i>0) {
      for(let j=0;j<i;j++){
        this.data.procedureList[index].pantoneColorList.push({value:''})
        this.setData({
          ["procedureList["+index+"].pantoneColorList"]:this.data.procedureList[index].pantoneColorList
        })
      }
      // console.log( this.data.procedureList[index].pantoneColorList);
    }else if (i<0) {
      this.data.procedureList[index].pantoneColorList.splice(val)
      this.setData({
        ["procedureList["+index+"].pantoneColorList"]:this.data.procedureList[index].pantoneColorList
      })
    }
    this.showSelect()
  },
  //Panton色号
  changePantoneColor(e){
    let index = e.currentTarget.dataset.index
    let index2 = e.currentTarget.dataset.index2
    let key = e.currentTarget.dataset.key
    let val = e.detail.value
    this.setData({
      ["procedureList["+index+"]."+key+"["+index2+"].value"]:val
    })
  },
  checkTap(e){
    let index = e.currentTarget.dataset.index
    let key = e.currentTarget.dataset.key
    this.setData({
      ["procedureList["+index+"]."+key]:!this.data.procedureList[index][key]
    })
  },
  // changeAmount(e){
  //   let val = Number(e.detail.value)
  //   this.setData({
  //     amount:val
  //   })
  // },
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
  /**进入订单须知 */
  notice: function () {
    wx.navigateTo({
      url: "../notice/index",
    });
  },
  /**选择专色数量 */
  getCurDomeDateNumber:async function (e) {
      //如果传进来的值与之前的值一样，就直接退出操作
      var _this = this
      // await this.printBookmarks(this.data, 0,e.currentTarget.dataset.key.split("."));
      var val = Number(e.currentTarget.dataset.value)
      if(this.data.printInfo===val) {
        return
      }
      _this.setData({
        [e.currentTarget.dataset.key]: val
      });
      // _this.countPrice();
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
    var _this = this
    var key = e.currentTarget.dataset.key
    var value = e.detail.value;
    var index = e.currentTarget.dataset.index
    // if(value==''&&key!=='amount'){
    //   return 
    // }
    if(key=='sizeWidth'||key=='sizeLength'||key=='tonsPrice'){
      value = Number(e.detail.value)
    }
    //  //如果传进来的值与之前的值一样，就直接退出操作
    // await this.printBookmarks(this.data, 0,e.currentTarget.dataset.key.split("."));
    // if(this.data.printInfo===value) {
    //   return
    // }
    if (key) {
      this.setData({
        ["procedureList["+index+"]."+key]:value
      });
      if(key=='sizeWidth'||key=='sizeLength'){
        var width = this.data.procedureList[index].sizeWidth
        var length = this.data.procedureList[index].sizeLength
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
        if(length!==''&&width!==''&&bool){
          _this.modalFun({contentText:contentText,time:1000})
        }else{
          // _this.countPrice()
          // this.getListPark();
        }
      }
    }
    // var reg = /technology\.uv\.uvNum/g
    // if(reg.test(key)){
    //   _this.countPrice()
    // } 
  },


  /**
   * 是否加印白墨
   * @param {Object} e
   */
  async addChalk(e) {
    // await this.printBookmarks(this.data, 0,e.currentTarget.dataset.key.split("."));
    this.setData({
      [e.currentTarget.dataset.key+'.isChalk']: !this.data.printInfo.isChalk,
      [e.currentTarget.dataset.key+'.colorNum']: this.data.printInfo.isChalk&&this.data.printInfo.color=='无'?1:this.data.printInfo.colorNum,
    });
   
    // this.countPrice();
  },
  
  /**
   * 印刷数量
   */
  changePrintingNum(e) {
    let index = e.currentTarget.dataset.index
    if(this.data.procedureList[index].number==e.detail.value) {
      return
    }
    var num = Number(e.detail.value);
    if (num < 1) {
      num = '';
    }
    this.setData({
      ["procedureList["+index+"].number"]: num,
      number:num
    });
    // this.countPrice();
  },
  /**
   * 按钮选中
   * @param {*} e
   */
  async radioTap(e) {
    var index = e.currentTarget.dataset.index
    var key = e.currentTarget.dataset.key
    var val = e.currentTarget.dataset.val
    //如果传进来的值与之前的值一样，就直接退出操作
    if(this.data.procedureList[index][key]===val) {
      return
    }
    this.setData({
      ["procedureList["+index+"]." + key]: val,
    });
    // this.countPrice();
  },
  /**
   * 校验数据
   */
  verifyData() {
    var List = this.data.procedureList;
    let msg = ''
    List.map(item=>{
      switch (item.type) {
        case 'printing':
          msg = this.verifyPrinting(item)
          break;
      
        default:
          break;
      }
    })
    if (msg) {
      return msg
    }
  },
  //校验印刷参数
  verifyPrinting(e){
    if (e.sizeLength === "") {
      return "请输入开张尺寸长度";
    }
    if (e.sizeWidth === "") {
      return "请输入开张尺寸宽度";
    }
    if (e.number === ""||e.number==0) {
      return "请输入印张数量";
    }
    if (e.printingMachineType === "") {
      return "请选择印刷机型";
    }
    if (e.thickness === "") {
      return "请输入材质/克重";
    }
    if (e.pantoneNumber>0) {
      let arr = e.pantoneColorList.filter(item=>item.value)
      if (arr.length<e.pantoneColorList.length) {
        return "请输入PANTONE色号";
      }
    }
    if (e.amount==''||e.amount==0) {
      return "请输入印刷总价"
    }
  },
  /**
   * 拼接数据
   * @returns 属性字符串
   */
   joinStr() {
    var arr = this.data.procedureList.map(item=>{
      if (item.type=='printing'&&item.lookColor) {
        this.isFollowinfo=1
      }
      let obj = {
        processName:item.processName,
        goodsAttr:this.splicingGoodsAttr(item),
        number:item.number,
        amount:item.amount
      }
      return obj
    })
    return JSON.stringify(arr);
  },
  //拼字符串
  splicingGoodsAttr(e){
    let str = ''
    switch (e.type) {
      case 'printing':
        str = `开纸尺寸:${e.sizeLength}_${e.sizeWidth};纸张材质:${e.thickness};印刷:${e.printingMode};印刷颜色:多色_CMYK;印刷机型:${e.printingMachineType};`
        if (e.pantoneNumber>0) {
          let pantoneStr = e.pantoneColorList.map(item=>{return item.value}).join(',')
          str += `专色:${e.pantoneNumber},${pantoneStr};`
        }
        break;
    
      default:
        break;
    }
    return str
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
      Toast.fail(msg)
      // _this.modalFun({contentText:msg,time:1000})
      return;
    }
    wx.showLoading({
      title: isFrom==0?'添加购物车':'正在下单',
      mask:true
    })
    
    var attrStr = _this.joinStr();
    
    var info = {
      factoryId: 0,//工厂地址ID
      fnumber: 1,//款数
      goodsAttr: attrStr,//属性
      isFollowinfo: this.data.isFollowinfo,//是否看色
      isFrom:isFrom,//是否立即购买
      moldNum: 1,//模数
      number: this.data.number,//商品数量
      version:2
    };
    addEdition(info).then((res) => {
      if (res.success) {
        if(isFrom==1){
          // clearTimeout(timer)
          wx.hideLoading()
          _this.setData({
            papertonPriceList:[]
          })
          wx.navigateTo({
            url: "../../Confirm/ConfirmProcesseOrder/index?isFrom=1",
          });
        }else{
          // clearTimeout(timer)
          wx.hideLoading()
          _this.modalFun({contentText:'已加入购物车',icon:'ac-icon-check',time:1000})
          _this.getCountCart()
          _this.setData({
            papertonPriceList:[]
          })
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
//  async countPrice() {
//     var _this = this;
//     return
//   },
  
  copyQQ:function(){
    let _this = this;
    copyQQ(app,_this.modalFun)
  },
});

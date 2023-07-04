// page/component/new-pages/cart/cart.js
import { getCartByUid,updateNum,del,deleteByIds,singUpdateCheck,getUserCartEdition,updateCart,updateCheck } from "../../api/cartApi.js";
import { splitStr,editVersionType,oversize} from "../../utils/util"
const app = getApp() 
var timer;
Page({
  data: {
    carts: [],// 购物车列表
    // hasList: false,// 列表是否有数据
    totalPrice: 0,// 总价，初始为0
    selectAllStatus: false,// 全选状态，默认全选
    obj: {
      name: "hello"
    },
    statusnum:false,
    numdata:{
      id:'',
      num:0
    },
    win_scrollTop:0,
    pathid:null,
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
    },
    tabsIndex:'single',
    cartList:{
      single:[],
      paper:[]
    },
    sum:0,
    orderType:''
  },
  onLoad: function(options) {
    wx.showShareMenu()
  
    this.isIos()
   
    this.setData({
      pathid:options
    })
  },
  onShow(options) {
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
    if (!app.globalData.isLogin) {
      return false
    }
    this.getUserCartEditionfn()
   
    this.getTotalPrice();
    wx.showLoading({
      title: '正在加载中...',
    })
    app.saveReport({
      "actionId": 1,
      "channel":800000
    })
  },
  textPaste(e){
    let _data = e.currentTarget.dataset
    let msg = ''
    if (_data.val.length ==1) {
      msg = _data.val + ';'
    } else if (_data.val.length == 2) {
      msg = _data.val[0]+ ':' + _data.val[1] + ';'
    }
    console.log('msg', msg);
    wx.setClipboardData({
      data: msg
    })
  },
  longPress(e) {
    let _data = e.currentTarget.dataset
    let msg = ''
    _data.goods.forEach(e => {
      if (e.length ==1) {
        msg += e + ';'
      } else if (e.length == 2) {
        msg += e[0]+ ':' + e[1] + ';'
      }
    })
    console.log('longPress', msg);
    wx.setClipboardData({
      data: msg
    })
  },
  getStr(string,str){
    var str_before = string.split(str)[0];
    var str_after = string.split(str)[1];
    return str_before
  },
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
  changeTabs(e){
    this.setData({
      tabsIndex:e.currentTarget.dataset.type,
      carts:this.data.cartList[e.currentTarget.dataset.type],
      selectAllStatus:this.data.cartList[e.currentTarget.dataset.type].every(x=>x.ischeck)
    })
    this.getUserCartEditionfn()
    this.getTotalPrice();
    let report = {"single":800000,"paper":801000}
    app.saveReport({
      "actionId": 1,
      "channel":report[e.currentTarget.dataset.type]
    })
  },
  getUserCartEditionfn(){
    let p1 = getCartByUid()
    let p2 = getUserCartEdition()
    Promise.all([p1,p2]).then(res=>{
      wx.hideLoading()
      this.setData({
        "cartList.single":res[0].data.list.map(e=>{
          e.versionType=editVersionType(e.versionType)
          let a = splitStr(e.goodsAttr,app.globalData.frontPaperMap)
          if(e.priceInfoMap){
          if(e.priceInfoMap.greyVersion){
             e.priceInfoMap.IsOpen=true
             a = splitStr(e.priceInfoMap.competGoodsAttr,app.globalData.frontPaperMap);
          }else{
            e.priceInfoMap.IsOpen=false
            a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
          }
          }
            e.newgoods = a
          return e
        }),
        "cartList.paper":res[1].data.map(e =>{
          switch(e.orderType){
            case 4:
              e.ordertext='印刷加工'
              break;
              case 0:
              e.ordertext='我要买纸' 
              break;
          }
          switch (e.paper.formulaId) {
            case 0:
              e.paperuit = '自来'
              break;
            case 1:
              e.paperuit = '吨'
              break;
            case 2:
              e.paperuit = '平方'
              break;
            case 3:
              e.paperuit = '张'
              break;
          }
          if(e.paper && e.paper.paperShop){
            e.paper.paperShop = e.paper.paperShop.split('-')[0]
          }
          e.discountDetail = JSON.parse(e.discountDetail)
          var arr = e.goodsAttr.split(';').map(e =>{
            return e.split(':')
          }) 
          e.newgoods = arr.filter(s=>{return s!=""})
          return e
        })
      })
      var isyn = this.data.cartList[this.data.tabsIndex].every( x => {
        return x.ischeck==1;
      });
      if(res[1].data[0]){
      var flag = !!res[1].data[0].paperSaleId
    }
      var ckeck = false
      res[1].data.map(item=>{
        if (flag&&!item.paperSaleId || !flag && !!item.paperSaleId){
          ckeck = true
        }
      })
      if (ckeck) {
        isyn = false
        var arr = res[1].data.map(item =>{return item.id})
        updateCheck({isCheckAll:false,isCheck:false,list:arr})
      }
      this.setData({
        selectAllStatus:isyn,
        carts:this.data.cartList[this.data.tabsIndex]
      })
      this.getTotalPrice();
    })
  },
  getupdateNum(){
    if (this.data.tabsIndex=='paper'){
      updateNum(this.data.numdata).then(res=>{
        this.getUserCartEditionfn()
      })
    }else{
      updateCart(this.data.numdata).then(res=>{
        this.getUserCartEditionfn()
      })
    }
  },
  isIos(){
	var that = this
    wx.getSystemInfo({
      	success: function (res) {
        	if (res.platform == "ios" && res.windowHeight == 667 && res.windowWidth == 375){
          		that.setData({
            		isIphone : true
          		})
        	}else{
          		that.setData({
            		isIphone: false
          		})
        	}
      	}
    })
},
inputFocus(e) {
    var that = this
    var inputHeight = 0 //键盘弹起高度
    if (e.detail.height) {
      	inputHeight = e.detail.height
      	if (that.data.isIphone) {
	        if (210 < inputHeight && inputHeight < 220){ //对应机型获取键盘高度错误时
	        	inputHeight = e.detail.height + 42
	        }
      	}
    }
  },

  statusfn(e) {
    this.setData({
      statusname: '删除',
      statusnum: !this.data.statusnum
    });

    if (this.data.statusnum) {
      this.setData({
        statusname: '去结算',
      });
    }
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    let type=e.currentTarget.dataset.type;
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    var carts = this.data.carts;
    const ischeck = carts[index].ischeck;
    carts[index].ischeck = !ischeck;
    this.setData({
      carts: carts
    });
    if(type=='single'){
      singUpdateCheck({isCheck:carts[index].ischeck,list:[id]}).then(res=>{
      })
    }else{
      if (this.data.orderType=='paper') {
        if (carts[index].orderType!=0||!carts[index].paperSaleId) {
          var ischeck2 = carts[index].ischeck;
          carts[index].ischeck = !ischeck2;
          this.setData({
            carts: carts
          });
          this.modalFun({contentText:  '九发纸业/金福纸业 需单独结算订单~'})
          console.log('九发纸业/金福纸业 需单独结算订单~1');
          return
        }
      }else if (this.data.orderType=='printing'){
        if (carts[index].orderType!=4&&carts[index].paperSaleId) {
          var ischeck2 = carts[index].ischeck;
          carts[index].ischeck = !ischeck2;
          this.setData({
            carts: carts
          });
          this.modalFun({contentText:  '九发纸业/金福纸业 需单独结算订单~'})
          console.log('九发纸业/金福纸业 需单独结算订单~2');
          return
        }
      }
      updateCheck({isCheck:carts[index].ischeck,list:[id]}).then(res=>{
        if (!res.success) {
          carts[index].ischeck = !ischeck;
          this.setData({
            carts: carts
          });
          console.log('购物车状态更新失败');
        }
      })
    }

    console.log('carts[index]', carts[index]);
    
    var isyn = carts.every( x => {
      return x.ischeck==1;
    }); 
    this.setData({
      selectAllStatus:isyn
    })
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  delGoods(e) {
    var _this=this;
    let type=e.currentTarget.dataset.type;
    var dellist=[]
    var deldata = _this.data.carts.filter(val => {
      return val.ischeck
    });
    deldata.forEach(item => {
      dellist.push(item.id)
    })
    wx.showModal({
      title: '提示',
      content: '确定删除商品?',
      success: function (res) {
        if (res.confirm) {
          if(type=='single'){
            del({list:dellist}).then(res=>{
              if(res.code=='000000'){
                _this.modalFun({contentText:  '删除成功'})
                _this.getUserCartEditionfn()
              }else{
                _this.modalFun({contentText:  res.message})
              }
            })
          }else{
            deleteByIds({list:dellist}).then(res=>{
              if(res.code=='000000'){
                _this.modalFun({contentText:  '删除成功'})
                _this.getUserCartEditionfn()
              }else{
                _this.modalFun({contentText:  res.message})
              }
            })
          }
        } else if (res.cancel) {
        }
      }
    })
    
  },
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    var carts = this.data.carts;
    carts.splice(index, 1);
    this.setData({
      carts: carts
    });
    if (!carts.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
  },
  orderfn(e){
    let _this=this
      
    var ordern=_this.data.carts.filter(val=>{
      return val.ischeck
    })
    if(ordern.length>0){
      
      if (_this.data.tabsIndex=='single') {
        let Odata=ordern.map(e=>{
          return{
            goodsId:e.goodsId,
            id:e.id,
            goodsAttr:e.goodsAttr
          }
        })
        oversize(Odata).then(()=>{
          wx.showToast({
            icon:'loading',
             mask:true
           })
          wx.navigateTo({
            url: "../Confirm/ConfirmSingleOrder/index?isFrom=0",
            success:function(){
              wx.hideToast()
            }
          });
        })
      } else {
        let num=0
        _this.data.carts.map(e=>{
          _this.setData({
            sum:num+=Number(e.ischeck)
          })
        })
        if(_this.data.sum>8){
          wx.showToast({
            title: '最多支持选择8个商品合并结算',
            icon:'none',
            duration:1500
          })
          return
        }
        wx.navigateTo({
          url: "../Confirm/ConfirmPaperOrder/index?isFrom=0",
          success:function(){
            wx.hideToast()
          }
        });
      }
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let type=e.currentTarget.dataset.type
    var selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    var carts = this.data.carts;
    var alldata=[]
    if (type=='paper') {
      var order1=0,order2=0;
      carts.map(item=>{
       if (item.orderType==0&&item.paperSaleId) {
         order1++;
       } else {
         order2++;
       }
       return item
     })
     if (order1>0&&order2>0) {
       this.modalFun({contentText:  '九发纸业/金福纸业 需单独结算订单~'})
       return
     }
    }
    for (var i = 0; i < carts.length; i++) {
      carts[i].ischeck = selectAllStatus;
      alldata.push(carts[i].id)
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    if(type=='single'){
      singUpdateCheck({isCheckAll:selectAllStatus,isCheck:selectAllStatus,list:alldata}).then(res=>{
    
      })
    }else{
        updateCheck({isCheckAll:selectAllStatus,isCheck:selectAllStatus,list:alldata}).then(res=>{
  
      })
    }

    this.getTotalPrice();
  },

  /**
   * 改变数量事件
   */
  changeCount(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    var carts = this.data.carts;
    var num = carts[index].num;
    if (e.currentTarget.dataset.type=='add') {
      num = parseInt(num) + 1000;
    }else{
      num = parseInt(num) - 1000;
      if (num<1000) {
        return
      }
    }
    carts[index].num = num;
    var newdata={
      id:id,
      num:num
    }
    this.setData({
      carts: carts,
      numdata:newdata
    });
    clearTimeout(timer);
    timer = setTimeout(() => {
      this.getupdateNum()
    }, 500);
  },
  bindKeyInput: function (e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    var carts = this.data.carts;
    let value = e.detail.value;
    value = value%1000<500?Math.floor(value/1000)*1000:(Math.floor(value/1000)+1)*1000
    // if (this.data.tabsIndex=='paper') {
      carts[index].num = value;
      if(e.detail.value<1000){
        var newdata2={
          id:id,
          num:1000
        }
        this.setData({
          carts: carts,
          numdata:newdata2
        });
        this.getupdateNum()
        return
      }
      var newdata={
        id:id,
        num:value
      }
      this.setData({
        carts: carts,
        numdata:newdata
      });
      this.getupdateNum()
    // }else{

    // }
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    var carts = this.data.carts;        // 获取购物车列表
    var total = 0;
    for (var i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].ischeck) {                     // 判断选中才会计算价格
        total += carts[i].goodsTotal;   // 所有价格加起来
        // total += carts[i].goodsTotal-carts[i].discountDetail.colorMoney-carts[i].discountDetail.spotMoney;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
    if (this.data.tabsIndex=='paper') {
      var orderType='',order1=0,order2=0;
      var arr = carts.map(item=>{
        if (item.ischeck) {
          if (item.orderType==0&&item.paperSaleId) {
            order1++;
          } else {
            order2++;
          }
          return item
        }
      })
      arr = arr.filter(item=>item)
      if (arr.length==0) {
        this.setData({
          orderType:''
        })
        return
      }
      if (order1>0) {
        if (arr[0].paperSaleId) {
          orderType = 'paper'
        }else{
          orderType = 'printing'
        }
      }else if(order2>0){
        orderType = 'printing'
      }
      this.setData({
        orderType:orderType
      })
    }
  },

  tabsChange(e) {
    this.setData({
      tabsState: e.currentTarget.dataset.status
    })
    this.getUserCartEditionfn()
  }

})
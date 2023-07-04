// page/component/new-pages/cart/cart.js
import { getUserCartEdition,updateNum,deleteByIds,updateCheck } from "../../api/cartApi.js";
const app = getApp()
var timer;
Page({
  data: {
    carts: [],               // 购物车列表
    // hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: false,    // 全选状态，默认全选
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
    }

  },
  // modalFun({contentText,icon,iconSize,image,imageSize,time}){
  //   var than = this;
  //   this.setData({
  //     modal: {
  //       show: true,
  //       contentText,icon,iconSize,image,imageSize
  //     }
  //   })
  //   setTimeout(() => {
  //     than.setData({
  //       modal: {
  //         show: false,//modal是否显示，默认false
  //       }
  //   }) }, time?time:2000);
  // },
//   onShareAppMessage: function () {
//     return {
//       title: '测试标题',
//       desc: '测试内容内容',
//       path: '/pages/cart/index?id=123',
//       imageUrl:'https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2cf5e0fe9925bc319c88ee6c5edf8db1ca137069.jpg',
//       success: function(res){
// 　　　　　　// 转发成功之后的回调
// 　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
//               console.log('转发成功')
// 　　　　　　}
// 　　　　},
// 　　　　fail: function(res){
// 　　　　　　// 转发失败之后的回调
//            console.log('转发失败')
// 　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
//                 console.log('用户取消转发')
// 　　　　　　　　// 用户取消转发
// 　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
// 　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
//                  console.log('详细失败信息')
// 　　　　　　}
// 　　　　},
// 　　　　complete: function(){
// 　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
//           console.log('转发成不成功都会执行')
// 　　　　}
//     }
//   },
  onLoad: function(options) {
    // this.getUserCartEditionfn() 
    wx.showShareMenu()
  
    this.isIos()
   
    console.log('opt',options);
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
   
    // this.setData({
      // hasList: true,
      // carts: [
        // { id: 1, title: '微坑盒', con: '品类:吸塑内托;成品尺寸:100_ _100_ ,100;展开尺寸:200.00_ 200.00;吸 塑材质:PET;颜色:透明;材质厚度:0.25;0', num: 4, price: 13.59, selected: false },
        // { id: 2, title: '卡纸盒', con: '品类:吸塑内托;成品尺寸:100_ _100_ ,100;展开尺寸:200.00_ 200.00;', num: 1, price: 9.90, selected: false }
      // ]
    // });
    this.getTotalPrice();
    // app.ax.POST({
    //     url: '/api/consumer/cart/miniCartEdition/getUserCartEdition',
    //     params: this.data.regInfo,
    //     success(res) {
    //       console.log('888888999999999999', res)
    //     }
    //   })
  },
  getStr(string,str){
    var str_before = string.split(str)[0];
    var str_after = string.split(str)[1];
    return str_before
    // console.log('前：'+str_before+' - 后：'+str_after);
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
  getUserCartEditionfn(){
      getUserCartEdition().then(res => {
        console.log('getAllOrder',res);
        if(res.success){
        this.setData({
            carts: res.data.map(e =>{
              e.paper.paperShop = e.paper.paperShop.split('-')[0]
              e.discountDetail = JSON.parse(e.discountDetail)
              var arr = e.goodsAttr.split(';').map(e =>{
                return e.split(':')
              // }).concat([[e.paperName]])
              }) 
              // arr.splice(1,0,[['纸张品牌'],[e.paper.brand+'_'+e.paper.colour]])
              e.newgoods = arr.filter(s=>{return s!=""})
              return e
            })
        })
        console.log(this.data.carts)
        var isyn = res.data.every( x => {
          return x.ischeck==1;
        }); 
        this.setData({
          selectAllStatus:isyn
        })
        this.getTotalPrice()
      }
      })
  },
 
  getupdateNum(){
    updateNum(this.data.numdata).then(res=>{
      console.log(res)
      this.getUserCartEditionfn()

    })
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
    // var newdata = false
    // for (var i = 0; i < this.data.carts.length; i++) {
    //   this.data.carts[i].ischeck = newdata;
    // }
    //this.setData({
      //carts: this.data.carts,
      //totalPrice: 0
    //});
    this.setData({
      statusname: '删除',
      statusnum: !this.data.statusnum
    });

    if (this.data.statusnum) {
      this.setData({
        statusname: '去结算',
        // selectAllStatus: false,
      });
    }
    console.log(this.data.statusnum)
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    var carts = this.data.carts;
    const ischeck = carts[index].ischeck;
    carts[index].ischeck = !ischeck;
    this.setData({
      carts: carts
    });
    console.log(carts[index].ischeck)
    updateCheck({isCheck:carts[index].ischeck,list:[id]}).then(res=>{
      console.log(res)
    })
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
  del() {
    // console.log(this.data.carts.selected)
    var _this=this;
    var dellist=[]
    var deldata = _this.data.carts.filter(val => {
      return val.ischeck
    });
    deldata.forEach(item => {
      // console.log([item.id])
      dellist.push(item.id)
    })
    console.log(dellist)
    wx.showModal({
      title: '提示',
      content: '确定删除商品?',
      success: function (res) {
        if (res.confirm) {
          deleteByIds({list:dellist}).then(res=>{
            console.log(res)
            if(res.code=='000000'){
              // wx.showToast({
              //   title: '操作成功！', // 标题
              //   icon: 'success',  // 图标类型，默认success
              //   duration: 1500  // 提示窗停留时间，默认1500ms
              // })
              // than.modalFun({contentText:'删除成功',icon:'ac-icon-check'})
              // this.modalFun({contentText:  res.message})
              _this.modalFun({contentText:  '删除成功'})
              _this.getUserCartEditionfn()
            }else{
              // wx.showToast({
              //   title: '操作失败！', // 标题
              //   icon: 'none',  // 图标类型，默认success
              //   duration: 1500  // 提示窗停留时间，默认1500ms
              // })
              // than.modalFun({contentText:'删除失败',icon:''})
              // this.modalFun({contentText:  res.message})
              _this.modalFun({contentText:  res.message})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
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
    var ordern=this.data.carts.filter(val=>{
      return val.ischeck
    })
    console.log(ordern)
    if(ordern.length>0){
      // wx.navigateTo({
      //   url: '../ConfirmOrder/index'
      // })
      wx.navigateTo({
        url: "../Confirm/ConfirmPaperOrder/index?isFrom=0",
      });
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    var selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    var carts = this.data.carts;
    var alldata=[]
    for (var i = 0; i < carts.length; i++) {
      carts[i].ischeck = selectAllStatus;
      alldata.push(carts[i].id)
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    updateCheck({isCheckAll:selectAllStatus,isCheck:selectAllStatus,list:alldata}).then(res=>{
      console.log(res)
    })
    console.log(selectAllStatus)
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  // addCount(e) {
  //   const index = e.currentTarget.dataset.index;
  //   const id = e.currentTarget.dataset.id;
  //   var numdata=this.data.numdata
    
  //   var carts = this.data.carts;
  //   var num = carts[index].num;
  //   num = parseInt(num) + 1;
  //   carts[index].num = num;
  //   var newdata={
  //     id:id,
  //     num:num
  //   }
  //   this.setData({
  //     carts: carts,
  //     numdata:newdata
  //   });
  //   this.getupdateNum()
  // },

  // addCount: app.debounce(function (e) {   //防抖
  //   //  this.setData({ bankname: e.detail.value });
  //   const index = e.currentTarget.dataset.index;
  //   const id = e.currentTarget.dataset.id;
  //   var numdata=this.data.numdata
    
  //   var carts = this.data.carts;
  //   var num = carts[index].num;
  //   num = parseInt(num) + 1;
  //   carts[index].num = num;
  //   var newdata={
  //     id:id,
  //     num:num
  //   }
  //   this.setData({
  //     carts: carts,
  //     numdata:newdata
  //   });
  //   this.getupdateNum()
  // },500),


  addCount(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    var numdata=this.data.numdata
    var carts = this.data.carts;
    var num = carts[index].num;
    num = parseInt(num) + 1;
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

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    var numdata=this.data.numdata
   
    const obj = e.currentTarget.dataset.obj;
    var carts = this.data.carts;
    var num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    var newdata={
      id:id,
      num:num
    }
    console.log(num)
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
    // console.log(index)
    // console.log(e.detail.value)
    var carts = this.data.carts;
    var numdata=this.data.numdata
    var num = carts[index].num;
    num = e.detail.value;
    carts[index].num = num;
    if(e.detail.value<1){
      var newdata2={
        id:id,
        num:1
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
      num:e.detail.value
    }
    this.setData({
      carts: carts,
      numdata:newdata
    });
    console.log(this.data.numdata)
    this.getupdateNum()

  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    var carts = this.data.carts;                  // 获取购物车列表
    var total = 0;
    for (var i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].ischeck) {                     // 判断选中才会计算价格
        // total += carts[i].num * carts[i].goodsTotal;   // 所有价格加起来
        total += carts[i].goodsTotal-carts[i].discountDetail.colorMoney-carts[i].discountDetail.spotMoney;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  }

})
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    info:{},
    daomo:'',
    size:{
      sizeLength:"",
      sizeWidth:"",
      sizeHeight:"",
      number:""
    }
  },
  //事件处理函数
  bindViewTap: function () {
    
  },
  onLoad: function (e) {
    this.setData({
      info:JSON.parse(e.obj)
    })
    // console.log(this.data.info);

  },
  onShow(){
  },
  valuation: function(e){
    if(this.data.sizeLength&&this.data.sizeHeight&&this.data.sizeHeight&&this.data.number){
      console.log(this.data);
    }
    console.log(this.data);

  },
  async inputVal(e) {
    var _this = this
    var key = e.currentTarget.dataset.key
    var value = e.detail.value;
    let index2 = e.currentTarget.dataset.index2
    if (key=='size.number') {
      if (value<1000) {
        value = 1000
      }else if(value>99999999){
        value = 99999999
      }else if (value%1 != 0) {
        return
      }
      let oldValue = this.data.size.number
      this.setData({
        'size.number':value
      });
      if (oldValue==this.data.size.number) {
        return
      }
    }

    if (key) {
      if (value<=0) {
        value=''
      }
      this.setData({
        [key]:value
      });
     
      /**尺寸限制 */
      // if(key=='size.sizeWidth'||key=='size.sizeLength'||key=='size.sizeHeight'){
      //   var width = this.data.size.sizeWidth
      //   var length = this.data.size.sizeLength
      //   var height = this.data.size.sizeHeight
      //   var daomo = this.data.daomo
      //   if (width&&(width>daomo.widthMax||width<daomo.widthMin)) {
      //     this.setData({
      //       "size.sizeWidth":this.data.defaultWidth
      //     })
      //     this.modalFun({contentText:'尺寸超出纸张大小',time:1000})
      //   }
      //   if (length&&(length>daomo.longMax||length<daomo.longMin)) {
      //     this.setData({
      //       "size.sizeLength":this.data.defaultLength
      //     })
      //     this.modalFun({contentText:'尺寸超出纸张大小',time:1000})
      //   }
      //   if (height&&(height>daomo.heightMax||height<daomo.heightMin)) {
      //     this.setData({
      //       "size.sizeHeight":this.data.defaultHeight
      //     })
      //     this.modalFun({contentText:'尺寸超出纸张大小',time:1000})
      //   }
      //   if (width && length && height && this.data.auto) {
      //     let obj = {
      //       goodAl: length,
      //       goodAw: width,    
      //       goodAd: height,
      //       goodAh: 0,
      //       goodAt: 0,
      //       goodAx: 0,
      //       goodBottom: 0,
      //       goodWaist: 0,
      //       zipval: 0,
      //       id: this.data.goodsId
      //     }
      //     computeSize(obj).then(res => {
      //       if (res.code === '999999') {
      //         this.modalFun({contentText: res.message, time:1000})
      //         return
      //       }
      //       this.setData({
      //         deploy: res.data
      //       })
      //     })
      //   }
      //   //更改纸张材质要重新生成刀模
      //   // this.startPinBan()
      // }
    }
  },
  

 
  
})

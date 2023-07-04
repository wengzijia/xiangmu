// pages/placeOrder/edit/index.js
let avatar = "../../../image/palceOrder/logo.png";
import Toast from '@vant/weapp/toast/toast';
import info from '../../../utils/processInfo'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
    formdata: {
      orderName: "",
      customer: "",
      memo:""
    },
  
    attrList:[
        {
            /**参数标题 */
            label:"印刷类型",
            /**组件类型 */
            type:"radio",
            /**是否必填 */
            required:true,
            /**是否显示*/
            isShow:true,
            /** picker和单选组件选中后的值 */
            value:"普通印刷",
            /** 依赖数据组 {label:依赖参数标题,value:依赖选中的值} */
            parentAttr:[],
            /** 参数属性数组  radio */
            attr:[
                {
                    /**展示的值 */
                    label:"普通印刷",
                    /**实际组合需要的值 */
                    value:"普通印刷",
                    /** 多选时是否选中的值 */
                    isSelect:true

                },
                {
                    /**参数标题 */
                    label:"UV印刷",
                    /**参数标题 */
                    value:"UV印刷"
                }
            ]
        },
        {
            label:"上机机台",
            type:"radio",
            required:true,
            isShow:true,
            value:"对开",
            attr:[
                {
                    label:"对开",
                    value:"对开"
                },
                {
                    label:"四开",
                    value:"四开"
                },
                {
                    label:"六开",
                    value:"六开"
                }
            ]
        },
        {
            label:"印刷尺寸",
            type:"sizeInput",
            required:true,
            isShow:true,
            attr:[
                {
                    label:"长",
                    value:"",
                    unit:"X"
                },
                {
                    label:"高",
                    value:"",
                    unit:"mm"
                }
            ]
        },
        {
            label:"印刷数量",
            type:"input",
            required:false,
            isShow:true,
            value:"",
            attr:[
                {
                    label:"",
                    value:"",
                    unit:"张"
                },
                
            ]
        },
        {
            label:"印刷颜色",
            type:"checkbox",
            required:true,
            isShow:true,
            parentAttr:[
                {
                    label:"印刷类型",
                    value:"普通印刷"
                }
            ],
            value:"",
            attr:[
                {
                    label:"多色(CMYK)",
                    value:"多色(CMYK)",
                    isSelect:true
                },
                
            ]
        },
        {
            label:"印刷颜色",
            type:"checkbox",
            required:true,
            isShow:false,
            parentAttr:[
                {
                    label:"印刷类型",
                    value:"UV印刷"
                }
            ],
            values:['多色(CMYK)'],
            attr:[
                {
                    label:"多色(CMYK)",
                    value:true,
                    isSelect:true
                },
                {
                    label:"白墨",
                    value:false,
                    isSelect:false
                },
                {
                    label:"磨砂",
                    value:false,
                    isSelect:false
                },
            ]
        },
        {
            label:"专色数量",
            type:"picker",
            required:false,
            isShow:true,
            value:"0",
            isShowPicker:false,
            attr:[
                {
                    name:"0",
                    label:"0",
                    value:"0",
                },
                {
                    name:"1",
                    label:"1",
                    value:"1",
                },
                {
                    name:"2",
                    label:"2",
                    value:"2",
                },
                {
                    name:"3",
                    label:"3",
                    value:"3",
                },
                {
                    name:"4",
                    label:"4",
                    value:"4",
                },
                
            ]
        },
    ],
    showSelectCustomerValue: false,
    showSelectProOrderValue: false,
    proOrderSn: "",
    customerInfo: {
      name: "傲彩",
      wxName: "",
      avatar,
    },
    customerList: [
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
      {
        name: "傲彩",
        wxName: "",
        avatar,
      },
      {
        name: "张三",
        wxName: "法外狂徒",
        avatar,
      },
    ],
    proOrderSnList: [
     88888888888888,888889999999,999999999,66666666666
    ],
    photoList:[],
    processOptions:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.id){
      this.setData({
        processOptions:options,
        // attrList:info[options.id].list
      })
    }
    
    // console.log('88888',this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    this.setData({
      attrList:info[_this.data.processOptions.id||0].list
    })
    console.log('88888',this.data)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  /** 
   * 输入框通用输入事件 
   */
  inputChange(e){
    let _this = this;
    let key = e.currentTarget.dataset.key
    _this.setData({
        [key]:e.detail
    })
  },

  /**
   * 是否显示好友列表
   */
  isShowSelectCustomer() {
    let _this = this;
    _this.setData({
      showSelectCustomerValue: !_this.data.showSelectCustomerValue,
    });
  },

  /**
   * 选择客户
   * @param {*} e
   */
  selectCustomer(e) {
    let _this = this;
    this.setData({
      customerInfo: _this.data.customerList[e.currentTarget.dataset.index],
      showSelectCustomerValue: false,
    });
    console.log("eee", _this.data.customerInfo);
  },
  /**
   * 生产单号输入框输入事件
   */
  proOrderSnFun(e) {
    console.log("customer", e);
    this.setData({
      showSelectProOrderValue: e.detail.length >= 4,
    });
  },
  /**
   * 隐藏单号选择
   */
  hideSelectOrder(){
    let _this = this;
    _this.setData({
        showSelectProOrderValue: false
    });
  }, 
  /**
   * 选择单号
   * @param {*} e 
   */
  selectProOrderSn(e){
    console.log('66888',e)
    this.setData({
        proOrderSn:e.detail.value,
        showSelectProOrderValue:false
    })
  },
  /**
   * 拍照上传图片
   */
   photograph(){
    let _this = this;
    wx.chooseMedia({
        count: 5,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        success(res) {
          console.log(res)
          let photoList = _this.data.photoList
          photoList.push(...res.tempFiles)
          console.log('photoList',photoList)
          _this.setData({
            photoList
          })
        }
      })
   },
   /**
    * 删除图片
    * @param {*} e 
    */
   delPhotographImg(e){
    console.log('e',e)
    let _this = this;
    let photoList = _this.data.photoList
    photoList.splice(e.currentTarget.dataset.index,1)
    _this.setData({
        photoList
    })
   },
    /**
    * 查看图片
    * @param {*} e 
    */
   checkImgs(e){
    let photoList = this.data.photoList.map(e => e.tempFilePath)
    wx.previewImage({
        urls:photoList,
        current:photoList[e.currentTarget.dataset.index]
    })
   },
    /**
   * 按钮选中(单选)
   * @param {*} e
   */
  async radioTap(e) {
    console.log(e)
    let _this = this;
    let attrList = JSON.parse(JSON.stringify(_this.data.attrList))
    if(e.currentTarget.dataset.index||e.currentTarget.dataset.index===0){
        attrList[e.currentTarget.dataset.index].value = e.currentTarget.dataset.value
    }
    let attr = attrList[e.currentTarget.dataset.index]
    /** 处理数据之间的依赖关系 */
    for (const item of attrList) {
        if(item.parentAttr&&item.parentAttr.length>0){
           let item2 =  item.parentAttr.find(e => e.label===attr.label&&e.value===attr.value)
           if(item2){
               item.isShow = true
           }else {
            let item3 =  item.parentAttr.find(e => e.label===attr.label&&e.value!==attr.value)
            if(item3){
                item.isShow = false
            }
           }
        }
    }
    console.log('attrList',attrList)
    _this.setData({
        attrList
    })
    },
    /** 
     * 多选
     */
     checkeTap(e){
        console.log(e)
        let _this = this;
        let attrList = JSON.parse(JSON.stringify(_this.data.attrList))
        let dateset = e.currentTarget.dataset
        if( attrList[dateset.index].attr[dateset.index2].label==='多色(CMYK)'){//多色必选
            return
        }
        attrList[dateset.index].attr[dateset.index2].value = !attrList[dateset.index].attr[dateset.index2].value
        let attr = attrList[dateset.index]
        if(attr.required&&!attr.attr.find(e => e.value)){
            Toast.fail("至少要选择一项"+attrList[dateset.index].label)
            return
        }
        _this.setData({
            attrList
        })
     },
     /** 
     * 输入框事件
     */
    inputChange2(e){
        console.log(e)
        let _this = this;
        let attrList = JSON.parse(JSON.stringify(_this.data.attrList))
        let dataset = e.currentTarget.dataset
        if(dataset.index2||dataset.index2===0){
            console.log('8888')
            attrList[dataset.index].attr[dataset.index2].value = e.detail.value||e.detail
        }else{
            attrList[dataset.index].attr[0].value = e.detail.value||e.detail
        }
        _this.setData({
            attrList
        })
    },
    /**
     * 是否显示Picker
     */
    isShowPicker(e){
        console.log('e',e)
        let _this = this;
        let attrList = JSON.parse(JSON.stringify(_this.data.attrList))
        console.log('e',attrList)
        if(e.currentTarget.dataset.index){
            attrList[e.currentTarget.dataset.index].isShowPicker = !attrList[e.currentTarget.dataset.index].isShowPicker 
        }else {
            let index = attrList.findIndex(e => e.isShowPicker)
            if(index!=-1)  attrList[index].isShowPicker = !attrList[index].isShowPicker 
        }
        _this.setData({
            attrList
        })
    },
    
      /**
     * Picker选择
     */
    selectPicker(e){
        console.log(e)
        let _this = this;
        let attrList = JSON.parse(JSON.stringify(_this.data.attrList))
        let index = _this.data.attrList.findIndex(e => e.isShowPicker)
        if(index!=-1)  attrList[index].value = e.detail.value
        _this.setData({
            attrList
        })
    },
    /**
     * 校验提交数据
     */
    checkFormData(){

    }
    
});

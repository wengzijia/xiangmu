// pages/placeOrder/edit/index.js
let avatar = "../../../image/palceOrder/avatar.png";
let avatar2 = "../../../image/palceOrder/avatar2.png"
import {imageBaseUrl} from "../../../utils/request"
import Toast from '@vant/weapp/toast/toast';
import {debounce} from "../../../utils/util"
// import info from '../../../utils/processInfo'
import {customerList,queryOrder,newOrderConditions,uploadImg,addOrderBill,getOrderBill,editOrderBill} from "../../../api/placeOrder"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl,
    isShowSubmitBtn:false,
    formdata: {
      attribute_type:'1',//工序类型：1.加工，2.原料
      attribute_id:"",
      group_sn:"",
      goods_name:"",
      add_type:"",
      customer_id:"",
      price:"",
      number:"",
      back_number:"",
      unit_price:"",
      order_note:"",
      paper_type:"",
      area:"",
      operator_name:"",
      process_color:"",
      process_color_num:"",
      process_device_type:"",
      process_attr:"",
      order_file_url:"",
    
    },
    is_bw_push:"",
    avatar,avatar2,
    isShowPlaceAddr:false,//是否显示加工地
    attrList:[
    //   {
    //     label:"数量",
    //     type:"input",
    //     required:false,
    //     isShow:true,
    //     value:"",
    //     attr:[
    //         {
    //             label:"",
    //             value:"",
    //             unit:"张"
    //         },
            
    //     ]
    // }
    ],
    tipPrice:0,
    showSelectCustomerValue: false,
    showSelectProOrderValue: false,
    customerInfo: {
      "id": 0, //客户id
      "customer_name": "选择客户", //客户名
      "customer_uid": 0, //客户UID
      "customer_type": 0, //客户类型：1.其他客户，2.傲彩
      "wx_portrait": '', //微信头像
      "wx_nickname": null, //微信名
      "user_tel": "15121521511" //手机号
    },
    newCustomerId:null,
    customerList: [],
    proOrderSnList: [],
    proOrderInfoList:{},
    photoList:[],//大版图片
    photoKnifeList:[],//刀模图片
    processOptions:{},
    orderConditions:{},
    orderBill:{},
    processId:"",  // 工序id
    placeName:'傲彩产业园',  // 加工地名
    allPlaces:[
      {index:2,name:'傲彩产业园'},
      {index:1,name:'其他'}
    ],  // 所有加工地名
    isShowAllPlaces:false,  // 是否显示所有加工地名
    placesIndex:2, // 加工地下标
    isEnabled:"",  // 是否启用所属加工地     
    daomoFileNameObj:{//上传刀模图片的展示名称
      4:'刀模',
      7:'击凸版',
      8:'击凹版',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('sfds',options)
    if(options.id){
      this.setData({
        processOptions:options,
        processId:options.id,  // 工序id
        isEnabled: options.isEnabled  // 是否启用所属加工地
        // attrList:info[options.id].list
      })
    }
    
    // console.log('88888',this.data)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    // console.log("info",info.map(e => JSON.stringify(e.list)))
  
    if(_this.data.customerList.length==0){
      wx.showLoading({
        title: '获取数据中...',
      })
      _this.getCustomerList()
      if(_this.data.processOptions.id&&!_this.data.processOptions.orderId){
        _this.getNewOrderConditions()
      }else{
        _this.getOrder()
      }
    }
  },
  /**获取订单详情 */
  getOrder(){
    let _this = this;
    getOrderBill({
      order_id:_this.data.processOptions.orderId,
      order_type:_this.data.processOptions.customerId==0?1:2
    }).then(res=>{
      console.log('666',res)
      if(res.code==200){
        let photoList = []
        if(res.data.order_file_url&&res.data.order_file_url.length>0){
           photoList = (res.data.order_file_url.split(',')).map(e=>{
            return {tempFilePath:imageBaseUrl+e,isOss:true}
          })
        }
        let photoKnifeList =[]
        if(res.data.group_daomo_file&&res.data.group_daomo_file.length>0){
          photoKnifeList = (res.data.group_daomo_file.split(',')).map(e=>{
           return {tempFilePath:imageBaseUrl+e,isOss:true}
         })
       }
        _this.setData({
          orderBill:res.data,
          formdata:res.data,
          photoList,
          photoKnifeList,
          isShowSubmitBtn:(res.data.customer_id!=0&&res.data.status==1),
          placeName:res.data.processing_place == 2 ? '傲彩产业园' : '其他',
          placesIndex:res.data.processing_place
        })
        console.log('res.data.group_sn',res.data)
        if(res.data.group_sn){
          _this.proOrderSnFun({
            detail:res.data.po_sn||res.data.group_sn,
            hide:true
          })
        }
        _this.getNewOrderConditions()
      }
    })
  },
  /** 获取客户列表 */
  getCustomerList(){
    let _this = this;
    customerList({customer_type:2}).then(res=>{
      console.log('res',res)
      if(res.code==200){
        let customerList = res.data.map( e=> {
          if(e.customer_info&&e.customer_info[0]){
            e.customer_info = e.customer_info[0]
            e = {...e,...e.customer_info}
          }else if(e.customer_info&&e.customer_info.wx_nickname){
            e = {...e,...e.customer_info}
          }
          if(e.customer_type==1&&!e.wx_portrait){
            e.wx_portrait = avatar2
          }else if(e.customer_type!=1){
            e.wx_portrait = avatar
          }
          return e
        })
        console.log('customerList',customerList)
        if(_this.data.processOptions.customerId){
          _this.setData({
            customerInfo:customerList.find(e => e.id==_this.data.processOptions.customerId),
            customerList:customerList.filter(e=>{
              if(_this.data.processOptions.customerId==0){
                return e.id==0
              }else{
                return e.id!=0
              }
            })
          })
        }else if(_this.data.newCustomerId){
          console.log('_this.data.newCustomerId',_this.data.newCustomerId)
          _this.setData({
            customerInfo:customerList.find(e => e.id==_this.data.newCustomerId),
            customerList,
            isShowSubmitBtn:true,
            showSelectCustomerValue:false
          })
        }else{
          _this.setData({
            customerList,
          })
        }
        // console.log('customerList',customerList.find(e => e.id==_this.data.processOptions.customerId))
      }else{
        
      }
    })
  },
  /**
   * 获取工单参数
   */
  getNewOrderConditions(){
    let _this = this;
    newOrderConditions({
      attribute_type:_this.data.processOptions.attrType,
      attribute_id:_this.data.processOptions.id,
      type:null
    }).then((res)=>{
      console.log('eeee',res)
      let list = JSON.parse(res.data.list);
     
      //有操作员信息添加操作员信息
      if(res.data.list2?.operator_info){
       
        list = list.map(item =>{
          if(item.key==='operator_name'){
            item.attr = res.data.list2.operator_info.map(e =>{
              return {value:e.agentName,label:e.agentName,name:e.agentName}
            })
          }
          return item
        })
       
      }
      if(!_this.data.processOptions.orderId){
        _this.setData({
          attrList:list,
          orderConditions:res.data,
          isShowPlaceAddr: res.data.name=='覆膜'||res.data.name=='啤',
          is_bw_push:res.data.is_bw_push
        })
     
        wx.setNavigationBarTitle({
          title: "添加"+res.data.name+"订单"
        })
      }else{
        
        let process_attr = JSON.parse(_this.data.orderBill.process_attr)
        console.log('process_attr6666',process_attr)
    
        /** 订单数据回显 */
        let attrList = list.map(e=>{
          let item = e;
          console.log('item3333',item)
          let item2 = process_attr?.find(s => s.label==item.label&&s.key==item.key)
         
           console.log('process_attr',item2)
        if(item2){

          if(item.type!='checkbox'&&item2&&item2.value&&item.attr.find(v => v.label==item2.value)){
            // console.log('item',item)
            item.value = item2.value;
            item.attr =  item.attr.map(x=>{
              if(x.label==item2.value){
                x.value=item2.value
              }
              return x
            })
            
          }else if(item.type=='checkbox'){
            let arr = item2.value.split(',')
            item.attr =  item.attr.map(x=>{
              if(arr.find(c => c==x.label)){
                x.isSelect= true
              }else{
                x.isSelect= false
              }
              return x
            })
          }else  if(item.type=='sizeInput'){
            let arr = item2.value.split('*')
            item.attr =  item.attr.map((x,i)=>{
              x.value = arr[i]
              return x
            })
          }else if(item.type=='input'){
            // console.log('item',item)
            item.attr =  item.attr.map((x,i)=>{
              x.value =  item2.value
              return x
            })
          }else if(item.key=='other_craft_info'){
            item.value = _this.data.formdata[item.key];
            item.attr =  item.attr.map(x=>{
              if(x.label== _this.data.formdata[item.key]){
                x.value= _this.data.formdata[item.key]
              }
              return x
            })
          }
          if(item.parentAttr&&item.parentAttr.length>0){
            let attr = item.parentAttr.find(e => process_attr.find(s => s.label==e.label&&s.value==e.value))
              item.isShow = attr?true:false
          }
        }else{
          if(item.key=='number'){
            item.attr = item.attr.map((x,i)=>{
              x.value =  _this.data.formdata.number
              return x
            })
          }else if(item.key=='area'&&item.type=='sizeInput'){
            let arr =  _this.data.formdata.area.split('x')
            item.attr =  item.attr.map((x,i)=>{
              x.value = arr[i]
              return x
            })
          }else if(item.key='paper_type' ){
            item.value = _this.data.formdata[item.key];
            item.attr =  item.attr.map(x=>{
              if(x.label== _this.data.formdata[item.key]){
                x.value= _this.data.formdata[item.key]
              }
              return x
            })
          }
        }
          console.log('item',item)
          return item
        })
        // console.log('attrList',attrList)
          
        _this.setData({
          attrList:JSON.parse(JSON.stringify(attrList)),
          orderConditions:res.data,
          isShowPlaceAddr: res.data.name=='覆膜'||res.data.name=='啤',
          is_bw_push:res.data.is_bw_push
        })
     
        console.log('attrList',this.data.attrList)
        wx.setNavigationBarTitle({
          title: "编辑"+res.data.name+"工序订单"
        })
      }
      wx.hideLoading()
    }).catch((err)=>{
      console.log('err',err)
      wx.hideLoading()
    })
  },
  /** 
   * 提交数据 
   */
  async submitForm(e){
    console.log('996',e)
    let _this = this;
    let type = e.currentTarget.dataset.type;
    let customerInfo = _this.data.customerInfo;
    let attrList = _this.data.attrList;

    let check = _this.checkFormData(type);//校验数据
    if(check){
      Toast.fail(check)
      return
    }
    const toast = Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    let formdata = _this.data.formdata;
    formdata.add_type = customerInfo.id==0?1:type;
    formdata.attribute_id = _this.data.processOptions.id
    formdata.customer_id= customerInfo.id
    formdata.attribute_type = _this.data.processOptions.attrType
    
    console.log('formdata.price',formdata.price)
    let process_attr = attrList.filter(e => e.isShow).map(e=>{
      let item = {label:e.label,value:e.value,type:e.type,key:e.key}
      if(item.type==='sizeInput'){
        item.value = (e.attr.map(e => e.value)).join('*')
      }else if(item.type ==='input'){
        item.value = (e.attr[0].value)
      }else if(item.type ==='checkbox'){
        item.value = e.attr.filter(e => e.isSelect).map(e => e.label).join()
      }
      if(e.key){
        formdata[e.key] = item.value
      }
      return item
    })
    if(!formdata.price||formdata.price=='0') formdata.price = _this.data.tipPrice
    if(process_attr.length==0) {
      console.log(process_attr)
      Toast.fail("数据错误，请联系客服！")
      return
    }
    formdata.process_attr	= JSON.stringify(process_attr)	
    // 添加加工单参数
    let daomoFileName = _this.data.daomoFileNameObj[_this.data.processId]
    if(_this.data.is_bw_push && customerInfo.id != 0){
      formdata.processing_place = _this.data.placesIndex
    }
    console.log('process_attr',process_attr)
    console.log('formdata',formdata)
    
    /**
     * 上传图片
     */
    try {
      
      _this.uploadImgs().then(res=>{
        formdata.order_file_url = res.map(e => e.data).join()
        if(daomoFileName){
          _this.uploadKnifeImgs().then(res=>{
            formdata.group_daomo_file = res.map(e => e.data).join()
            _this.submitForm2({formdata,type,toast})
          })
        }else{
          _this.submitForm2({formdata,type,toast})
        }
      }).catch(err=>{
        toast.clear();
        Toast.fail('上传图片失败！');
      })

    } catch (error) {
        
    }
    
  },
  submitForm2({formdata,type,toast}){
    let _this = this;
    if(formdata.order_id){
      editOrderBill(formdata).then(res=>{
        toast.clear();
        if(res.code==200){
          Toast.success('已成功保存账单！');
          _this.toPage(type)
        }else{
          Toast.fail(res.msg||res.message);
        }
        console.log('56666',res)
      }).catch(err=>{
        toast.clear();
        Toast.fail('保存账单数据失败！');
      })
    }else{
      addOrderBill(formdata).then(res=>{
        toast.clear();
        if(res.code==200){
          Toast.success('已成功保存账单！');
          _this.toPage(type,'add')
        }else{
          Toast.fail(res.msg||res.message);
        }
        console.log('56666',res)
      }).catch(err=>{
        console.log('err',err)
        toast.clear();
        Toast.fail('保存账单数据失败！');
      })
    }
  },
  toPage(type,isAdd){
    let _this = this;
    // if(type!=3&&(_this.data.processOptions.id&&!_this.data.processOptions.orderId)){
    //   wx.reLaunch({
    //     url: '../../processOrder/index?status='+(Number(type)-1)
    //   })
    // }else if(type==3&&isAdd=='add'){
    //   wx.reLaunch({
    //     url: '../../processOrder/index?status='+(Number(type)-1)
    //   })
    // }else{
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      if(prevPage.go_update){
        // prevPage.go_update();
        prevPage.setData({
          status:(Number(type)-1),
          ['monthDetail.data']: [],
          ['billDetail.page_number']: 1,
          loadingType: 0,
        })
      }else if(prevPage.changeOrderStatus){
        let status = type!=4?(Number(type)-1):type
        prevPage.setData({
          status,
          orderIndex:status
        })
      }
      wx.navigateBack({
        delta: 1,
      })
    // }
  },
  /** 
   * 输入框通用输入事件 
   */
  inputChange(e){
    let _this = this;
    console.log('6665555e',e)
    let key = e.currentTarget.dataset.key
    _this.setData({
        [key]:e.detail
    })
    if(key==='formdata.unit_price'&&e.detail){
      _this.changeTotalPrice()
 
    }
  },
  /**
   * 修改总价
   * @returns 
   */
  changeTotalPrice:debounce(function(){
    let _this = this;
    console.log('2022',_this.data.formdata)
    // if(_this.data.formdata.price==''||_this.data.formdata.price==0){
      let unit_price = _this.data.formdata.unit_price
      let numberAttr = (_this.data.attrList.find(e => e.key == 'number'))
      let backNumberAttr = (_this.data.attrList.find(e => e.key == 'back_number'&&e.isShow))
      let length = 1;
      let width = 1
      let price = 0
      if(_this.data.orderConditions.name=='覆膜'){
        let areaAttr =  (_this.data.attrList.find(e => e.key == 'area'))?.attr
        if(areaAttr&&areaAttr[0].value!=''&&areaAttr[0].value!=0&&areaAttr[1].areaAttr!=''&&areaAttr[1].areaAttr!=0){
          length = areaAttr&&areaAttr[0].value/1000
          width = areaAttr&&areaAttr[1].value/1000
        }
      }
      if(unit_price!=''&&unit_price!=0){
     
        if(numberAttr&&numberAttr.attr[0]&&numberAttr.attr[0].value!=''&&numberAttr.attr[0].value!=0){
          price += (Math.floor((length*width*numberAttr.attr[0].value*unit_price) * 100) / 100 )
        }
        if(backNumberAttr&&backNumberAttr?.attr[0]&&backNumberAttr.attr[0].value!=''&&backNumberAttr.attr[0].value!=0){
          price += (Math.floor((length*width*backNumberAttr.attr[0].value*unit_price) * 100) / 100 )
        }
      }
     if(price){
      _this.setData({
        'tipPrice':price
      })
     }
    // }
  },500),
  /**
   * 显示好友列表
   */
  showSelectCustomer() {
    let _this = this;
    console.log('6666')
    if(_this.data.orderBill&&_this.data.orderBill.status&&_this.data.orderBill.status!=1) return
    _this.setData({
      showSelectCustomerValue: true
    });
  },

  
  /**
   * 关闭好友列表
   */
   hideSelectCustomer() {
    let _this = this;
    console.log('6666')
    if(_this.data.orderBill&&_this.data.orderBill.status&&_this.data.orderBill.status!=1) return
    _this.setData({
      showSelectCustomerValue:false,
    });
  },


  /**
   * 选择客户
   * @param {*} e
   */
  selectCustomer(e) {
    let _this = this;
    let customerInfo = _this.data.customerList[e.currentTarget.dataset.index]
    this.setData({
      customerInfo,
      showSelectCustomerValue: false,
      isShowSubmitBtn:customerInfo.id==0?false:true
    });
    if(customerInfo.id==0){
      // let index = _this.data.attrList.findIndex(e=> e.key==='operator_name')
      // if(index!=-1){
      //   _this.setData({
          
      //   })
      // }
      let attr = _this.data.attrList.map(e=>{
        if(e.key==='operator_name'&&e.attr.length>0) e.isShow = true;
        return e
      })
           _this.setData({
            attrList:attr
        })
    }else{
      let attr = _this.data.attrList.map(e=>{
        if(e.key==='operator_name') e.isShow = false;
        return e
      })
           _this.setData({
            attrList:attr
        })
    }

    console.log("eee", _this.data.customerInfo);
  },
  /**
   * 生产单号输入框输入事件
   */
  proOrderSnFun(e) {
    console.log("customer", e);
    let _this = this;
    if(e.detail.length >= 4){
      queryOrder({
        attribute_type:_this.data.processOptions.attrType,
        attribute_id:_this.data.processOptions.id,
        group_sn:e.detail
      }).then(res=>{
        console.log('zdsd',e.detail.length >= 4);
        _this.setData({
          showSelectProOrderValue: e.hide?false:e.detail.length >= 4,
          proOrderSnList:res.data.data,
          proOrderInfoList:res.data.cover_path
        });
      })
    }
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
        'formdata.group_sn':e.detail.value,
        showSelectProOrderValue:false
    })
  },
  /**
   * 拍照上传图片
   */
   photograph(){
    let _this = this;
    let len = _this.data.photoList.length
    if(len==5) return
    wx.chooseMedia({
        count: 5-len,
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
   * 拍照上传图片
   */
     photographKnife(){
      let _this = this;
      let len = _this.data.photoKnifeList.length
      console.log(' 5-len', 5-len,len)
      console.log(' 5-len2222', len)
      wx.chooseMedia({
          count: (5-len),
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          camera: 'back',
          success(res) {
            console.log(res)
            let photoKnifeList = _this.data.photoKnifeList
            photoKnifeList.push(...res.tempFiles)
            console.log('photoKnifeList',photoKnifeList)
            _this.setData({
              photoKnifeList
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
    * 删除刀模图片
    * @param {*} e 
    */
     delPhotographKnifeImg(e){
      console.log('e',e)
      let _this = this;
      let photoKnifeList = _this.data.photoKnifeList
      photoKnifeList.splice(e.currentTarget.dataset.index,1)
      _this.setData({
        photoKnifeList
      })
     },
   
    /**
    * 查看图片
    * @param {*} e 
    */
   checkImgs(e){
    let _this = this;
    let photoList = _this.data.photoList.map(e => e.tempFilePath)
    _this.previewImage(photoList[e.currentTarget.dataset.index],photoList)
   },

        /**
    * 查看刀模图片
    * @param {*} e 
    */
    checkKnifeImgs(e){
      let _this = this;
      let photoKnifeList = _this.data.photoKnifeList.map(e => e.tempFilePath)
      _this.previewImage(photoKnifeList[e.currentTarget.dataset.index],photoKnifeList)
     },
       


    /**
   * 按钮选中(单选)
   * @param {*} e
   */
   radioTap(e) {
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
        attrList[dateset.index].attr[dateset.index2].isSelect = !attrList[dateset.index].attr[dateset.index2].isSelect
        let attr = attrList[dateset.index]
        if(attr.required&&!attr.attr.find(e => e.isSelect)){
            Toast.fail("至少要选择一项"+attrList[dateset.index].label)
            return
        }
        _this.setData({
            attrList
        })
     },
     /** 
     * 工单参数输入框事件
     */
    inputChange2(e){
        console.log(e)
        let _this = this;
        let attrList = JSON.parse(JSON.stringify(_this.data.attrList))
        let dataset = e.currentTarget.dataset
        if(dataset.index2||dataset.index2===0){
            console.log('8888')
            let value = e.detail.value
            if(value||value===''){
              attrList[dataset.index].attr[dataset.index2].value = e.detail.value
            }else{
              attrList[dataset.index].attr[dataset.index2].value = e.detail
            }
            
        }else{
          let value = e.detail.value
          if(value||value===''){
            attrList[dataset.index].attr[0].value = value
          }else{
            attrList[dataset.index].attr[0].value = e.detail
          }
           
        }
        
        _this.setData({
            attrList
        })
        if(attrList[dataset.index].key=='number'||attrList[dataset.index].key=='back_number'){
          _this.changeTotalPrice()
        }
    },
    /**
     * 是否显示Picker
     */
    isShowPicker(e){
        console.log('e',e)
        let _this = this;
        if(this.data.formdata.processing_place==2&&this.data.formdata.status>1){
          return
        }
        let attrList = JSON.parse(JSON.stringify(_this.data.attrList))
       
        if(e.currentTarget.dataset.index>-1){
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
        console.log('我在哪呢')
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
    checkFormData(type){
      let _this = this;
      let regPos = /^\d+$/;//整数
      let regDecimal = /^([0-9]+[\d]*(.[0-9]{1,2})?)$/;//保留2位小数
      let regDecimal2 = /^([0-9]+[\d]*(.[0-9]{1,1})?)$/;//保留1位小数
      let customerInfo = _this.data.customerInfo;
      
      let formdata = _this.data.formdata;
      console.log('formdata',formdata)
      let proOrderInfoList = _this.data.proOrderInfoList
      console.log('proOrderInfoList',proOrderInfoList)
      if(customerInfo.customer_type==0){
        return "请选择客户"
      } 
      let po = proOrderInfoList[formdata.po_sn||formdata.group_sn]
      if(customerInfo.customer_type==2&&po!==''&&po!==null&&!po){
        return "请选择正确的生产单号"
      }
      // if(customerInfo.customer_type==1&&!formdata.goods_name){
      //   return "请输入商品名称"
      // }
      let attrList = _this.data.attrList;
      for (const attr of attrList) {
        if(attr.isShow&&attr.required){
        /**校验输入框 */
        if(attr.type=='input'){ 
          if(!attr.attr[0].value){
            return "请输入"+attr.label
          }else if(attr.key=='number'&&!regPos.test(attr.attr[0].value)){
            return "请输入正确"+attr.label
          }
        }else if(attr.type=='sizeInput'){
          let attr2 = attr.attr.find(e => !e.value)
          if(attr2){
            return "请输入完整的"+attr.label
          }
          if(attr.key=="area"){
            attr2 = attr.attr.find(e => !regDecimal2.test(e.value))
            if(attr2){
              return "请输入正确"+attr.label
            }
          }else{
            attr2 = attr.attr.find(e => !regPos.test(e.value))
            if(attr2){
              return "请输入正确"+attr.label
            }
          }
        }else if(attr.type=='picker'){
          if(!attr.value||(!attr.attr.find(e => e.value==attr.value))){
            return "请选择"+attr.label
          }
        }
      }
      }
      let photoList = _this.data.photoList
      if(customerInfo.customer_type==1&&((type==3  || type==4 ) &&photoList.length==0)){
        console.log('11',photoList.length);
        return "请至少上传一张图片"
      }
      let photoKnifeList = _this.data.photoKnifeList
      let daomoFileName = _this.data.daomoFileNameObj[_this.data.processId]
      if(customerInfo.customer_type==1&&((type==3  || type==4 ) &&photoKnifeList.length==0)&&daomoFileName){
        return `请至少上传一张${daomoFileName}图片`
      }
      if(type==3){
        if((formdata.unit_price==''||formdata.unit_price==0)&&(formdata.price==''||formdata.price==0)){
          return "请输入至少输入一个价格"
        }
      }
      if(formdata.unit_price!=''){
        if(!regDecimal.test(formdata.unit_price)||Number(formdata.unit_price)<=0){
          return "请输入正确的商品单价"
        }
      }
       if(formdata.price!=''){
        if(!regDecimal.test(formdata.price)||Number(formdata.price)<=0){
          return "请输入正确的商品总价"
        }
      }
      
      
      // if(type==3){
      //   if((formdata.price==''||formdata.price==0)&&formdata.unit_price!=''){
      //     if(!regPos.test(formdata.unit_price)||Number(formdata.unit_price)<=0){
      //       return "请输入正确的商品单价"
      //     }
      //   }else if((formdata.unit_price==''||formdata.unit_price==0)&&formdata.price!=''){
      //     if(!regPos.test(formdata.price)||Number(formdata.price)<=0){
      //       return "请输入正确的商品总价"
      //     }
      //   }else if(formdata.unit_price!=''&&formdata.price!=''){
      //     if(!regPos.test(formdata.unit_price)||Number(formdata.unit_price)<=0){
      //       return "请输入正确的商品单价"
      //     }
      //     if(!regPos.test(formdata.price)||Number(formdata.price)<=0){
      //       return "请输入正确的商品总价"
      //     }
      //   }
      // }
     
     

    },
   /**
     * 查看PO图片
     * @param {*} e 
     */
    ckeckImgPo: function (e) {
      let _this = this;
      _this.previewImage(_this.data.imageBaseUrl+e.currentTarget.dataset.url,[_this.data.imageBaseUrl+e.currentTarget.dataset.url])
    },
    /**
     * 查看图片
     * @param {*} e 
     */
    previewImage(current,urls){
      wx.previewImage({
        current,
        urls, // 需要预览的图片http链接列表
      })
    },
  /**上传多张图片 */
  uploadImgs(){
    let _this = this; 
    console.log('_this.data.photoList',_this.data.photoList)
    const token = wx.getStorageSync('token');
    let list = _this.data.photoList.slice(0,5)
    let photoList = list.map(e => {
      return new Promise((resolve,reject)=>{
            if(e.isOss){
              let arr = e.tempFilePath.split(imageBaseUrl)
              resolve({data:arr[arr.length-1]})
            }else{
              wx.uploadFile({
                url: uploadImg, //图片上传api
                filePath: e.tempFilePath,
                name: 'file',
                header:{token},
                success (res){
                  resolve(JSON.parse(res.data))
                },
                fail(err){
                  reject(err)
                }
              })
            }
      
      })
    })
    return Promise.all(photoList)
  },
  /**上传多张刀模图片 */
  uploadKnifeImgs(){
    let _this = this; 
    console.log('_this.data.photoList',_this.data.photoKnifeList)
    const token = wx.getStorageSync('token');
    let list = _this.data.photoKnifeList.slice(0,5)
    let photoKnifeList = list.map(e => {
      return new Promise((resolve,reject)=>{
            if(e.isOss){
              let arr = e.tempFilePath.split(imageBaseUrl)
              resolve({data:arr[arr.length-1]})
            }else{
              wx.uploadFile({
                url: uploadImg, //图片上传api
                filePath: e.tempFilePath,
                name: 'file',
                header:{token},
                success (res){
                  resolve(JSON.parse(res.data))
                },
                fail(err){
                  reject(err)
                }
              })
            }
      
      })
    })
    return Promise.all(photoKnifeList)
  },
  // 显示所有加工地
  showAllPlaces(){
    let _this = this;
    console.log('sdfd',_this.data.isEnabled);
    _this.setData({
      isShowAllPlaces:_this.data.isEnabled != 1   ? true : false         //  传 1  禁用弹窗  禁用所属加工地
    })
    console.log(this.data.isShowAllPlaces);
  },
  // 关闭所有加工地
  hideAllPlaces(){
    let _this = this;
    _this.setData({
      isShowAllPlaces:false
    })
  },
  // 选择加工地名
  selectPlaceName(e){
    let _this = this;
    let { index,name  } = e.currentTarget.dataset;
    _this.setData({
      placeName:name,
      placesIndex:index,
      isShowAllPlaces:false
    })
    console.log(_this.data.placeName,_this.data.placesIndex);
  },
  /**跳转到添加客户页 */
  addCustomer(){
    wx.navigateTo({
      url:'/pages/newClient/index'
    })
  },

});



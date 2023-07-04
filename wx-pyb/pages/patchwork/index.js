//index.js
//获取应用实例
import {listSpecialEditionGoods} from "../../api/orderApi"
import { IMG_BASE_URL } from "../../utils/request"
const app = getApp()
Page({
  data: {
    name:'',
    active:1,
    boxinfolist:[
      {name:'双插盒',id:1,img:'https://aocai.cn/uploads/picture/20190125/a5e83f555cf83ca55a41587426ef1ab9.png'},
      {name:'锁底盒',id:2,img:'https://aocai.cn/uploads/picture/20190125/a5e83f555cf83ca55a41587426ef1ab9.png'},
      {name:'自动锁底盒',id:3,img:'https://aocai.cn/uploads/picture/20190125/a5e83f555cf83ca55a41587426ef1ab9.png'}
    ],
    currentTab:0,
    activeKey:0,
    sidebarList:[],
    dialoglist:[],
    title: '',
    daomoList:[],
    boxType:'',
    imgBaseUrl:IMG_BASE_URL,
    height:657,
    with:375,
    isPc:false,
    path:'',//上传文件时的文件的本地缓存
    times:0,
    isNewPage: true,
    boxList:[],
    index:0,
    show:false,
    urlid:'',
    urlname:'',
    goodsId:0,
    moldCateId:0
  },
  //事件处理函数
  bindViewTap: function () {
    
  },
  onLoad: function () {
    listSpecialEditionGoods().then(res=>{
      if (res.success) {
        let data=res.data
        data[1].children=data[1].children.filter(e=>{
          return e.data.name!='平粘盒'&&e.data.name!='自动锁底盒'
        })
        console.log("data",data[1].children);
        this.setData({
          boxList:res.data.map(item=>{
            item.name = item.data.name
            return item
          }),
          boxType:res.data[0],
          sidebarList:data.slice(0,2),
          title: res.data[0].children[0].data.name,
          daomoList:res.data[0].children
        })
        console.log(res.data[0].children);
        app.saveReport({
          "actionId": 1,
          "channel":_this.data.activeKey==0?400000:401000
        })
        let type = Number(wx.getStorageSync('valuation'))
        wx.setStorageSync('moldCateId', res.data[type].children[0].data.moldCateId)
        wx.setStorageSync('goodsId',res.data[type].children[0].data.goodsId)
        if (type) {
          let obj = {detail:{value:type}}
          // this.bindPickerChange(obj)
        }
      }else{
        wx.showModal({
          title: '请求失败',
          showCancel: false, //隐藏取消按钮
          content: '网络请求失败，请检查您的网络',
          success: function (res) {
            if (res.confirm) {
                //   wx.hideLoading()
                console.log('点击确认回调')
            } else {
                console.log('点击取消回调')
            }
          }
        })
      }
    })
  },
  ishide(){
    return false
  },
  onShow(){
  },
  lefttap:function(e){
    this.setData({
      active:e.currentTarget.dataset.num
    })
  },
  
  sidebarCrount: function (e) {
    console.log('sss');
    var _this = this;
    console.log(e.currentTarget.dataset.current);
    console.log(_this.data.sidebarList[e.currentTarget.dataset.current]);
    if (this.data.activeKey === e.currentTarget.dataset.current) {
      return false;
    } else {
      _this.setData({
        activeKey: e.currentTarget.dataset.current,
        daomoList:_this.data.sidebarList[e.currentTarget.dataset.current].children,
        title: e.currentTarget.dataset.val
      });
      wx.setStorageSync('moldCateId', _this.data.sidebarList[e.currentTarget.dataset.current].data.moldCateId)
      wx.setStorageSync('goodsId',e.currentTarget.dataset.goodsid)
    }
    app.saveReport({
      "actionId": 1,
      "channel":_this.data.activeKey==0?400000:401000
    })
  },
  toValuation: function(e){
    console.log(e);
    let obj =e.currentTarget.dataset.obj
    let gid=obj.data.goodsId
    let moldCateId=obj.data.moldCateId
    if(obj.data.name==='封套及特殊盒型'){
      gid=684
    }
    this.setData({
      dialoglist: obj.goodsList,
      show:true,
      urlid:obj.data.pid,
      urlname:obj.data.name,
      goodsId:gid,
      moldCateId:moldCateId
    });
    // wx.navigateTo({
    //   url: './platesize/index',
    // })
  },
  offtext:function(){
    wx.navigateTo({
      url:'./quotationlist/index',
    })
  },
  tosize: function(e){
    // let obj = {
    //   id:e.currentTarget.dataset.obj.id,
    //   img:e.currentTarget.dataset.img
    // }
    console.log(e.currentTarget.dataset);
    console.log(this.data.urlid,this.data.urlname);
    let url=""
    let name="卡纸盒"
    try {
      wx.setStorageSync('knifeUrl', e.currentTarget.dataset.url)
      wx.setStorageSync('img', JSON.stringify(e.currentTarget.dataset.img))
      wx.setStorageSync('daomo', JSON.stringify(e.currentTarget.dataset.obj))
    } catch (e) {console.log(e);}
    // console.log(e.currentTarget.dataset.img);
    // return
    if(this.data.urlid==1){
      url+='./valuation'
      name="卡纸盒"
    }else{
      url+='./valuation-k'
      name='微坑盒'
    }
    url += `/index?title=${name}&type=0&boxName=${this.data.urlname}&gid=${this.data.goodsId}&mid=${this.data.moldCateId}`
    console.log(url);
    wx.navigateTo({
      url:url,
    })
    app.saveReport({
      goodsId:this.data.goodsId,
      actionId:1,
      type:'拼版计价'
    })
  },
  onClose: function(e){
    this.setData({
      show:false
    })
  }
})

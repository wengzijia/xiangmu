// pages/personageCenter/invoice/orderList/index.js
import { getAllSupplierOrder, getAllSupplierInvoiceOrder, WxPayUrl} from "../../../../api/orderApi";
import{splitStr,editVersionType,numberFormat,format} from "../../../../utils/util";
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true, // 是否引用全局样式
  },
  properties: {
    active: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   list: [],
   orderData: [],
   pageNumber: 1,
   pageSize: 10,
   createTime: '',
   endTime: '',
   type: '',
   noSend: false,
   invoiceInfo: {},
   invoicePopup: false
  },
  // ready() {
  //   this.setData({
  //     orderData: this.data.list.map(e => {
  //       e[e.title] = this.getAllOrder(e[e.title])
  //       return e
  //     })
  //   })
  // },
  /**
   * 组件的方法列表
   */
  methods: {
    findName(ar) {
      let arr = [ { key: "floor", val: "地盒" }, { key: "canopy", val: "天盖" }, { key: "innerFrame", val: "内围框" }, { key: "leather", val: "皮壳", },
        { key: "innerBox", val: "内盒", }, { key: "cabinet", val: "柜桶", }, { key: "drawer", val: "抽屉", }]
      let str = ''

      for (let i = 0; i < ar.length; i++) {
        const el = ar[i];
        let obj = arr.find(ell => el.indexOf(ell.key) != -1 && el.indexOf('Face') == -1) // Face 内贴
        if (!obj) {
          continue
        }
        if (str.indexOf(obj.val) != -1) {
          str += '1'
          obj.val += '2'
        }
        if (i) {
          str+= '/'
        }
        str += obj.val
      }
  
      return str
    },
    //获取订单列表
    getAllOrder: function (list) {
      return list.map(item => {
        item.value=false
        if (item.children) {
          item.children.map(e => {
              e.versionType=editVersionType(e.versionType)
              // console.log( e.priceinfoMap.openSize[0]);
            let a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
            
            if(e.priceinfoMap){
              if(e.priceinfoMap.openSize){
                e.priceinfoMap.openSize[0]=numberFormat(e.priceinfoMap.openSize[0])
                e.priceinfoMap.openSize[1]=numberFormat(e.priceinfoMap.openSize[1])
              }
              // 去除市场价 减少中台修改 
              if (e.priceinfoMap.paperTonsMaterPriceStr) {
                let strArr =  e.priceinfoMap.paperTonsMaterPriceStr.split('/')
                if(strArr.length>0){
                  e.priceinfoMap.paperTonsMaterPriceStr2 = String(e.priceinfoMap.paperTonsDiscountPrice)+'元/'+strArr[1]
                }
              }
            }
            for(let key of a){
              // console.log(key[0]);
              if(key[0]=='纸张材质'){
                if(key[1].indexOf('银') != -1 || key[1].indexOf('金') != -1){
               
                  e.isValue='exist'
                }else{
                  e.isValue='aa'
                }
              }
            }
            if(e.priceinfoMap){
              if(e.priceinfoMap.greyVersion){
               e.priceinfoMap.IsOpen=true
               a = splitStr(e.priceinfoMap.competGoodsAttr,app.globalData.frontPaperMap);
               e.priceinfoMap.pinbanObj = {
                facialTissue: JSON.parse(e.priceinfoMap.facialTissue), // 面纸内贴
                facialTissueResp: e.priceinfoMap.facialTissueResp?JSON.parse(e.priceinfoMap.facialTissueResp):'', // 费用
                greyVersion: JSON.parse(e.priceinfoMap.greyVersion) // 灰板
              }
              
              for (let i = 0; i < e.priceinfoMap.pinbanObj.greyVersion.length; i++) {
                const el = e.priceinfoMap.pinbanObj.greyVersion[i];
                let ar = el.part.split('_')
                el.title = this.findName(ar)
              }
      
              for (let i = 0; i < e.priceinfoMap.pinbanObj.facialTissue.length; i++) {
                const el = e.priceinfoMap.pinbanObj.facialTissue[i];
                let ar = el.part.split('_')
                el.title = this.findName(ar)
              }
              console.log(e);
              }else{
               a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
               e.priceinfoMap.IsOpen=false
              }
            }
             
            e.goodsAttr = a;
            e.confirmTime2 =  this.timestampToTime(e.confirmTime);
            return e
          });
          item.newMoney = item.amount - (item.bonusMoney||0)
          item.confirmtime =  this.timestampToTime(item.confirmTime);
          return item
        }
      })
    },
    //转换时间显示格式
    timestampToTime: function(time) {
      var date = new Date(time * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D + h + m + s;
    },
    loading: function() {
      this.data.pageNumber += 1
      this.getList()
    },
    onSeach(e) {
      this.setData({
        list: [],
        orderData: [],
        pageNumber: 1,
        createTime: e.detail.startTimeStr,
        endTime: e.detail.endTimeStr,
        type: e.detail.type,
        noSend: false
      })
      this.getList()
    },
    getList() {
      if (this.data.noSend) {
        return
      }
      console.log(this.data.endTime + ' 23:59:59')
      let data = {
        createTime: format(this.data.createTime + ' 00:00:00'),
        endTime: format(this.data.endTime + ' 23:59:59'),
        xcxInvoiceType: this.data.type,
        invoiceStatus: this.data.active,
        pageNumber: this.data.pageNumber,
        pageSize: this.data.pageSize
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      getAllSupplierInvoiceOrder(data).then(res => {
        if (res.success) {
          if (!res.data.length) {
            this.setData({
              noSend: true
            })
            return
          }
          let newList = res.data.map(e => {
            let key = Object.keys(e)
            e.title = key[0]
            e[e.title] = this.getAllOrder(e[e.title])
            return e
          })
          if (this.data.orderData.length && this.data.orderData[this.data.orderData.length-1].title == newList[0].title) {
            let oldList = this.data.orderData[this.data.orderData.length-1][newList[0].title]
            oldList = oldList.concat(newList[0][newList[0].title])
            this.data.orderData[this.data.orderData.length-1][newList[0].title] = oldList
            newList.splice(0,1)
            this.setData({
              orderData: this.data.orderData
            })
          }
          if (newList.length) {
            this.setData({
              orderData: this.data.orderData.concat(newList),
            })
          }
        }
      }).finally(() => {
        wx.hideLoading()
      })
    },
    checkInvoice(e) {
      console.log(e);
      let data = e.currentTarget.dataset
      if (data.einvoice) { // 电子发票
        wx.setStorageSync('einvoice',data.einvoice)
        wx.navigateTo({
          url: './einvoice/index'
        })
      } else {
        let invoiceInfo = {
          invoiceNote: data.invoicenote,
          invoiceExprNum: data.invoiceexprnum,
          invoiceExprType: data.invoiceexprtype,
        }
        this.setData({
          invoicePopup: true,
          invoiceInfo: invoiceInfo
        })
      }
    },
    onClose() {
      this.setData({
        invoicePopup: false
      })
    },
    copyBtn: function (e) {
      wx.setClipboardData({
        //准备复制的数据
        data: e.currentTarget.dataset.sn,
        success: function (res) {
          wx.showToast({title: '复制成功'})
        }
      })
    },
  }
})

//index.js
//获取应用实例
const app = getApp();
import {
  throttling,
  debounce,
  copyQQ,
  daomoUrl,
  replaceAddress,
  numberFormat,
  deepGet
} from '../../../utils/util'
import {
  getPriceSpecial,
  getUserPageList,
  getQuotationInfo
} from "../../../api/orderDetailsApi.js";
import {
  add,
  countCart,
  singUpdateCheck
} from "../../../api/cartApi.js";
import {
  pinban,
  getPinBanParams,
  signByBehavior
} from "../../../api/pinban.js";
import {
  areaList
} from '@vant/area-data'
import {
  _option
} from './text.js'
import Toast from '@vant/weapp/toast/toast';
import {
  IMG_BASE_URL,
  downloadFile
} from '../../../utils/request'
Page({
  data: {
    remarkslist: [{
        name: '报价单有效期',
        id: 1,
        value: ''
      },
      {
        name: '送货地址',
        id: 2,
        value: ''
      },
      {
        name: '送货方式',
        id: 3,
        value: ''
      },
      {
        name: '付款方式',
        id: 4,
        value: ''
      },
      {
        name: '交货时间',
        id: 5,
        value: ''
      }
    ],
    show: false,
    pageNumber: 1,
    pageSize: 10,
    offerData: {
      //报价单标题
      orderTitle: '',
      //采购单位
      contactCompany: '',
      //联系人
      contactName: '',
      //联系电话
      contactMobile: '',
      //销售单位
      saleCompany: '',
      //联系人
      saleName: '',
      //联系电话
      saleMobile: '',
      //产品名称
      productName: '',
      //材质工艺
      // craft:'',
    },
    id: '',
    qdata: {},
    qlist: [],
    imgBaseUrl: IMG_BASE_URL,
    onbottom: false
  },
  onLoad: function (option) {
    this.getUserPageListfn(1)
  },
  onShow() {
    // this.getCartCount()
  },
  onReachBottom() {
    console.log(1);
    if (this.data.onbottom) {
      this.data.pageNumber++
      this.getUserPageListfn(0)
    }

  },

  formatTime(timeStamp) {
    let time = new Date(timeStamp)
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    return [year + '年' + month + '月', year + '-' + month]
  },






  /**
   * 通过递归查找data里面具体的值,找到了就赋值给data里的printInfo
   * @param {Object} obj data  
   * @param {Number} index 传进来的arr的index 
   * @param {Array} arr 
   */
  printBookmarks: async function (obj, index, arr) {
    var i = index + 1;
    if (!arr[i]) {
      this.setData({
        printInfo: obj[arr[index]]
      })
    } else {
      await this.printBookmarks(obj[arr[index]], i, arr);
    }
  },

  getUserPageListfn(o) {
    getUserPageList({
      "pageNumber": this.data.pageNumber,
      "pageSize": this.data.pageSize
    }).then(res => {
      if (res.success) {
        console.log(res);
        let data = []
        if (o) {
          data = res.data
        } else {
          data = [...this.data.qlist, ...res.data]
        }
        this.setData({
          qlist: data
        })
        if (res.data.length === 10) {
          this.setData({
            onbottom: true
          })
        } else {
          this.setData({
            onbottom: false
          })
        }
      }
    })
  },
  downl(e) {
    let _this = this;
    // 设置路径
    let id = e.currentTarget.dataset.id;
    getQuotationInfo({
      id: id
    }).then(res => {
      console.log('res', res)
      if (res.success && res.data) {
        const fileType = "xls";
        const fileName = '报价单_' + res.data.orderNo + '.' + fileType;
        downloadFile({
          url: `/api/consumer/quotation/miniQuotationOrder/downloadExcelById?id=${id}`,
          fileName,
          fileType
        })
      }
    })
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
    let a = _this.data.offerData.address

    //如果传进来的值与之前的值一样，就直接退出操作
    await this.printBookmarks(this.data, 0, e.currentTarget.dataset.key.split("."));
    if (this.data.printInfo === value) {
      return
    }
    if (key) {
      if (value <= 0) {
        value = ''
      }
      this.setData({
        [key]: value
      });


    }
  },
  remarkfn(e) {
    if (this.data.remarkslist[e.currentTarget.dataset.i].value == e.detail.value) {
      return false
    }
    this.setData({
      ['remarkslist' + `[${e.currentTarget.dataset.i}].value`]: e.detail.value
    })
  },
  /**
   * 输入色号
   * @param {*} e
   */



  /**
   * 校验数据
   */
  verifyData() {
    for (let k in this.data.offerData) {
      if (!this.data.offerData[k]) {
        return false
      }
    }
    return true
  },
  /**
   * 拼接数据
   * @returns 属性字符串 
   */
  joinStr() {
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    var attrStr = `` //展开尺寸:500_500;纸张材质:超高松纸_350;表面处理:哑胶;印刷颜色:多色_CMYK;粘合:自动粘1处;0;
    console.log('offer', offer)
    if (offer.sizeLength || offer.sizeWidth || offer.sizeHeight) {
      attrStr += `成品尺寸:${Number(offer.sizeLength).toFixed(2)}_${Number(offer.sizeWidth).toFixed(2)}_${Number(offer.sizeHeight).toFixed(2)};`
    }

    if (this.data.auto) {
      if (this.data.deploy?.goodAl) {
        attrStr += `展开尺寸:${Number(this.data.deploy.goodAl).toFixed(2)}_${Number(this.data.deploy.goodAw).toFixed(2)};`;
      }
    } else {
      if (this.data.openSize.length) {
        attrStr += `展开尺寸:${Number(this.data.openSize[0]).toFixed(2)}_${Number(this.data.openSize[1]).toFixed(2)};`;
      }
    }

    if (offer.materialType == '其他') {
      attrStr += `其他纸张;纸张材质:${offer.procedureList.paperSurface}_${offer.procedureList.paperGram};${offer.procedureList.unit}:${offer.procedureList.paperPrice};`;
    } else {
      attrStr += `纸张材质:${(info.thickness.list.find(s => s.kg===offer.thickness)).keyvalue};`;
    }
    attrStr += `印刷费用:${offer.printingPrice}元;表处理费用:${offer.surfacePrice}元(${offer.surface});啤费用:${offer.beerPrice}元;粘费用:${offer.stickyPrice}元;`
    var processingStr = '';
    this.data.postProcessing.forEach(item => {
      if (item.checked && item.value) {
        processingStr += item.craftName + '费用:' + item.value + '元;'
      }
    })
    attrStr += processingStr



    if (nextStr) {
      attrStr += nextStr
    }
    this.setData({
      attrStr: attrStr
    })
    return attrStr;
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
  async edition(isFrom) {
    var _this = this
    var msg = this.verifyData();
    if (msg) {
      _this.modalFun({
        contentText: msg,
        time: 1000
      })
      return;
    }
    var offer = _this.data.offerData;
    // if (offer.paperShop == "") {
    //   msg = "请输入纸行名称";
    //   _this.modalFun({contentText:msg,time:1000})
    //   return;
    // }
    // if(offer.sizeLength<1||offer.sizeWidth<1||offer.sizeHeight<1){
    //   // _this.modalFun({contentText:'尺寸不能低于1mm',time:1000})
    //   return
    // }
    let tips = ''
    for (let i = 0; i < this.data.postProcessing.length; i++) {
      if (this.data.postProcessing[i].checked && !this.data.postProcessing[i].value) {
        tips = "请输入" + this.data.postProcessing[i].craftName + '费用'
        break;
      }
    };
    if (tips) {
      _this.modalFun({
        contentText: tips,
        time: 1000
      })
      return false
    }
    wx.showLoading({
      title: isFrom == 0 ? '添加购物车' : '正在下单',
      mask: true
    })
    var info = {
      miniCart: {
        extendsStr: "0",
        goodsAttr: _this.data.attrStr,
        goodsId: _this.data.auto ? _this.data.goodsId : 640, //盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
        goodsTotal: _this.data.price,
        isfrom: isFrom,
        num: _this.data.offerData.number,
        totalTime: _this.data.orderTime,
        webfrom: 1,
        versionType: _this.data.auto ? 2 : 3,
        pinBanStr: _this.data.priceObj.pin_ban,
        cutModelUrl: _this.data.auto ? _this.data.pdfUrl : app.globalData.pdfPath
      },
      number: 1,
      openSize: _this.data.auto ? [] : _this.data.openSize,
      wxSpecialReq: {
        daomoMap: {
          '卡盒': this.data._daomoUrl
        }
      }
    };
    add(info).then(res => {
      _this.getCartCount()
      wx.hideLoading()
      if (res.success) {
        if (isFrom == 1) {
          wx.hideLoading()
          wx.navigateTo({
            url: "../../../Confirm/ConfirmSingleOrder/index?isFrom=1&pickUpDate=" + this.data.pickUpDate,
          });
        } else {
          singUpdateCheck({
            isCheck: true,
            list: [res.data[0].id]
          })
        }

      } else {
        wx.hideLoading()
        _this.modalFun({
          contentText: res.message,
          time: 2000
        })
      }
    }).catch((err) => {
      wx.hideLoading()
    });

  },


  /**
   *  计算价格
   */
  async countPrice(e) {
    var _this = this;
    // console.log('计价');
    var msg = this.verifyData();
    var msg2 = ''
    var bool = false
    var offer = this.data.offerData;

    if (!_this.data.pinBanStr) {
      console.log('停止计价', '!_this.data.pinBanStr');
      return
    }
    if ((offer.sizeLength || offer.sizeWidth || offer.sizeHeight) && (offer.sizeLength < 1 || offer.sizeWidth < 1 || offer.sizeHeight < 1)) {
      bool = true
      msg2 = '尺寸不能低于1mm'
      return
    }
    if (offer.sizeLength && offer.sizeWidth && offer.sizeHeight && (offer.sizeLength < offer.sizeWidth && offer.sizeHeight > 0)) {
      bool = true
      msg2 = '盒子长不能小于宽'
      // return
    }
    if (msg || bool) {
      this.setData({
        price: '0.00',
        originalPrice: '0.00',
        'offerData.letNumber': 0,
        priceArr: [],
        priceObj: null,
        unitPrice: null
      });
      if (msg2) {
        _this.modalFun({
          contentText: msg2,
          time: 1000
        })
      }
      wx.hideLoading();
      return
    }
    if (_this.data.showReset) {
      console.log('停止计价', 'showReset');
      return
    }
    console.log('计价', e);
    //  if (!e&&this.data.pinbanObj) {
    //   this.setData({
    //     showReset:true
    //   })
    //  }

    if (!this.data.pin && !this.data.pinbanObj) {

      console.log('停止计价', '!this.data.pinbanObj');
      return
    }
    clearTimeout(this.data.timeOut)
    // if (!_this.data.pinBanStr) {
    //   console.log('停止计价','!_this.data.pinBanStr');
    //   return
    // }
    //改变上面选项需要等待纸张重新计价完成
    if (this.data.flag1 || this.data.flag2) {
      this.setData({
        timeOut: setTimeout(() => {
          _this.countPrice(e)
        }, 500)
      })
      return false
    }
    // var attrStr = _this.joinStr();
    _this.joinStr();
    wx.showLoading({
      mask: true
    })
    getPriceSpecial({
      goodsId: _this.data.auto ? _this.data.goodsId : 640, //盒型，小程序没有盒型，暂时写死双插盒id-938,自定义盒型640
      fnumber: 1,
      goodsAttr: _this.data.attrStr,
      number: _this.data.offerData.number,
      cextends: 1,
      type: 0,
      city: (_this.data.region[0] != '请选择' ? _this.data.region[0] : '') + ' ' + (_this.data.region[1] != '请选择' ? _this.data.region[1] : ''),
      pinBanStr: _this.data.pinBanStr,
      openSize: _this.data.auto ? [] : _this.data.openSize
    }).then((res) => {
      _this.getCartCount()
      wx.hideLoading()
      if (res.success) {
        console.log('计价结果', res);
        var data = res.data
        data.priceInfo.weight = res.data.priceInfo.weight.toFixed(2)
        let strArr = data.priceInfo.paperTonsMaterPriceStr.split('/')
        if (strArr.length > 0) {
          data.priceInfo.paperTonsMaterPriceStr2 = String(data.priceInfo.paperTonsDiscountPrice) + '元/' + strArr[1]
        }

        console.log(data.priceInfo.openSize[0]);

        // data.priceInfo.openSize[0]=numberFormat(res.data.priceInfo.openSize[0])
        // data.priceInfo.openSize[1]=numberFormat(res.data.priceInfo.openSize[1])
        let pinbanObj
        for (let val in data.pin_ban) {
          pinbanObj = data.pin_ban[val][0]
        }
        pinbanObj.openSize[0] = numberFormat(res.data.priceInfo.openSize[0])
        pinbanObj.openSize[1] = numberFormat(res.data.priceInfo.openSize[1])
        _this.setData({
          price: Math.ceil(data.total_price * 100) / 100,
          pinbanImg: res.data.pin_ban.output_png_path,
          //originalPrice: data.priceOne + data.cuttingFee,
          // 'offerData.letNumber':data.lose,
          priceObj: data,
          unitPrice: (data.total_price / _this.data.offerData.number).toFixed(2),
          orderTime: Number(data.time_normal),
          //   pickUpDate:data.out_time
          //   // priceArr:data.paperPriceOne?priceArr:[],
          pin: false,
        });
        if (!_this.data.pinbanObj) {
          _this.setData({
            pinbanObj: pinbanObj
          })
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
          })
        } else {
          _this.setData({
            pinbanObj: pinbanObj
          })
        }

      } else {
        _this.modalFun({
          contentText: res.message + '请稍后重试',
          time: 2000
        })
      }
    });
  },

  coupleBack: function () {
    wx.navigateTo({
      url: '../../../coupleBack/index'
    })
  },
  notice: function () {
    wx.navigateTo({
      url: '../../edition/tips/index'
    })
  },
  onClose: function (e) {
    this.setData({
      show: false
    })
  },
  jumpAmboss: function () {
    wx.navigateTo({
      url: '../ambossDetails/index'
    })
  },
  /**
   * 点击印刷厂输入框，显示底部垫高组件，并滑到底部
   */
  showBottomView() {
    this.setData({
      // isShowBottomView:true,//是否显示底部垫高组件
    })
    // this.pageScrollToBottom()
  },
  checkCart() {
    // wx.navigateTo({
    //   url: '../../singleCart/index'
    // });
    wx.switchTab({
      url: '/pages/singleCart/index',
    })
  },
  preview(e) {
    let obj = e.currentTarget.dataset.obj
    if (obj.remark) {
      obj.remark = JSON.parse(obj.remark).map(e=>{
				return e.split(':')
			})
    }
    this.setData({
      show: true,
      offerData: obj
    })
    console.log(this.data.offerData.remark);
  },
  //弹出配送方式的选择器
  showPopup1: function (e) {
    let type = e.currentTarget.dataset.type
    console.log('surfaceHandleList', type)
    this.setData({
      [type]: !this.data[type]
    })

    // switch(type){
    //   case 'iscolorShow':
    //     this.setData({
    //       iscolorShow: !this.data.iscolorShow
    //     })
    //     break;
    //   case 'frontShow':
    //     this.setData({
    //       frontShow: !this.data.frontShow
    //     })
    //     break;
    //   case 'backShow':
    //     this.setData({
    //       backShow: !this.data.backShow
    //     })
    //     break;
    //   case 'unit' :
    //     this.setData({
    //       unit:!this.data.unit
    //     })
    //   break;
    // } 
  },
  onCancelPup(e, a) {
    console.log('69111111111111111', e, a);
    let _this = this;
    if (e != '' && e?.currentTarget.dataset.type) {
      this.setData({
        [e.currentTarget.dataset.type]: !this.data[e.currentTarget.dataset.type]
      })
    } else {
      if (a) {
        this.setData({
          [a]: !this.data[a]
        })
      } else {
        let arr = ['iscolorShow', 'iscolorShow2', 'frontShow', 'backShow', 'unit']
        let key = arr.find(e => _this.data[e])
        this.setData({
          [key]: !this.data[key]
        })
      }

    }


  },

});
const app = getApp();
import {
  listColorPaper,
  getPaperAndPrintPrice,
  checkPantone,
  countCart
} from "../../../api/orderDetailsApi.js";
import { addEdition } from "../../../api/cartApi.js";
import { deepGet } from "../../../utils/util";
import {ordersDetails} from '../../../api/orderApi'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    offerData: {
      //来料方式
      papertype: "代采",
      /**纸张克重*/
      thickness: "",
      /**纸张材质*/
      materialType: "",
      // 来纸数量
      paperNum: "",
      //上机数量
      carNum: "",
      //纸张价格
      paperPrice: "",
      //印刷费用
      printPrice: "",
      /**开料尺寸*/
      sizeWidth: "",
      /**开料尺寸*/
      sizeLength: "",
      sheetLength: "",
      sheetWidth: "",
      paperList: ["吨", "平方", "张"],
      paperUit: "吨",
      //印刷机型对开机
      printType: "对开机",
      //印刷机型普通印刷
      paperMode: "普通印刷",
      //正反印
      doublePrint: "正反印",
      //单面四色
      printsize: "单面四色",
      printColor: "正常印",
      addChalk: "", //加印白墨
      addUV: "", //磨砂
      procedureList: {
        pantoneColorList: [],
        pantoneNumber: 1,
        backPantoneColorList: [],
        unit: "吨",
        paperSurface: "", //输入的纸张材质
        paperGram: "", //输入的纸张克重
      },
    },

    offerInfo: {
      materialType: [],
      thickness: [],
    },
    allPaperList: {
      mode: [
        { value: "代采", lable: "代采" },
        { value: "自来", lable: "自来" },
      ],
    },
    printList: {
      type: [
        { value: "对开机", lable: "对开机" },
        { value: "四开机", lable: "四开机" },
      ],
      mode: [
        { value: "普通印刷", lable: "普通印刷" },
        { value: "UV印刷", lable: "UV印刷" },
      ],
      size: [
        { value: "单面四色", lable: "单面四色", show:'单'},
        { value: "双面四色", lable: "双面四色", show:'双'},
      ],
      color: [
        { value: "正常印", lable: "正常印" },
        { value: "看色", lable: "看色" },
        { value: "跟色跟样", lable: "跟色跟样" },
      ],
      num: [
        { name: "3", type: 3, val: "" },
        { name: "2", type: 2, val: "" },
        { name: "1", type: 1, val: "" },
      ],
      doublePrint: [
        { value: "正反印", lable: "正反印" },
        { value: "自反印", lable: "自反印" },
        { value: "天地反", lable: "天地反" },
      ],
    },
    modal: {
      show: false, //modal是否显示，默认false
      contentText: "",
      icon: "",
      iconSize: "",
      image: "",
      imageSize: "",
    },
    inputList: [1, 2, 3],
    iscolorShow: false, //是否显示弹框
    spot: "", //专色
    addColor: false,
    isShow: true,
    editVal: "逆向UV",
    radio: "0",
    attrStr: "", //计价下单用参数串
    judge: "",
    toatlPrice: "",
    cartCount:'',
    judgeRoute:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(123,options);
    this.getListPaper();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(12345,this.data.judgeRoute);
    let orderNo = wx.getStorageSync('orderNo')
    // if(this.data.judgeRoute){
    //   console.log(1234);
    //   wx.navigateBack({
    //     delta: 2
    //   })
    // }
    // ordersDetails({
    //   data:orderNo
    // }).then(res=>{
    //   console.log('orderNo',res)
    //   if(res.data.isTemplate!=1){
    //       wx.navigateBack({
    //     delta: 1
    //   })
    //   }else{
    //   }
    //   this.getListPaper();
    // })
    this.getCartCount()
    app.saveReport({
      "actionId": 1,
      "channel": 900000,
    })
  },

  /**
   * 获取纸张信息
   */
  getListPaper() {
    // listPaper({
    listColorPaper({
      orderType: 4,
    }).then((res) => {
      if (res.success) {
        this.setData({
          "offerInfo.materialType": res.data.map((e) => {
            return { ...e, value: e.data.name, lable: e.data.name };
          }),
        });
      }
    });
  },
  /**
   * 按钮选中
   * @param {*} e
   */
  async radioTap(e) {
    let _this = this;
    let val = e.currentTarget.dataset.val;
    const key = e.currentTarget.dataset.key;
    //如果传进来的值与之前的值一样，就直接退出操作
    if (this.data[key] === val) {
      return;
    }
    this.setData({
      [key]: val,
    });
    /**纸张材质 */
    if (e.currentTarget.dataset.key === "offerData.materialType") {
      var obj = this.data.offerInfo.materialType.filter(
        (l) => l.lable === e.currentTarget.dataset.val
      )[0];
      this.setData({
        "offerInfo.thickness": obj.children.map((s) => ({
          ...s,
          value: s.kg,
          lable: s.name,
        })),
        "offerData.thickness": obj.children[0].kg,
        priceObj: {},
        "offerData.printPrice":'',
        "offerData.printsize":'单面四色',
        "offerData.addChalk":'',
        'offerData.addUV':'',
        "offerData.carNum":''
      });
      if (val.indexOf("铜纸") != -1) {
        this.setData({
          ["offerData.paperUit"]: "吨",
          addColor: false,
        });
      } else if (val.indexOf("银") != -1) {
        this.setData({
          ["offerData.paperUit"]: "平方",
          addColor: true,
        });
      } else {
        this.setData({
          addColor: false,
        });
      }
      this.setData({
        "offerInfo.thickness": obj.children.map((s) => ({
          ...s,
          value: s.kg,
          lable: s.name,
        })),
        "offerData.thickness": obj.children[0]?.kg,
      });
    }
    this.countPrice();
  },
  /**
   * 输入框事件
   * @param {*} e
   * @returns
   */
  async inputVal(e) {
    var _this = this;
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value.trim();
    let oldVlaue = deepGet(this.data, key);
    if (oldVlaue === value) {
      return;
    }

    if (key) {
      console.log(value);
      if (value <= 0) {
        value = "";
      }
      if (key == "offerData.procedureList.paperGram" && value) {
        let reg = /^[1-9]\d*$|^0$/;
        if (!reg.test(value)) {
          value = "";
          this.modalFun({ contentText: "纸张克重只能输入整数", time: 1000 });
        }
      } else if (key == "offerData.procedureList.paperPrice" && value) {
        let reg = /^[1-9]\d*(\.\d{1,2})?$|^0+(\.\d{1,2})?$/;
        if (!reg.test(value)) {
          value = "";
          this.modalFun({ contentText: "纸张单价只能输入数字", time: 1000 });
        }
      } else if (key == "offerData.paperNum" && value) {
        let reg = /^[1-9]\d*$|^0$/;
        if (!reg.test(value)) {
          value = "";
          this.modalFun({ contentText: "来纸数量只能输入整数", time: 1000 });
        }
        if(value>999999){
          value = 999999
        }   
      } else if (key == "offerData.carNum" && value) {
        let reg = /^[1-9]\d*$|^0$/;;
        if (!reg.test(value)) {
          value = "";
          this.modalFun({ contentText: "上机数量只能输入整数", time: 1000 });
        }
        if(value>999999){
          value = 999999
        } 
      }else if (
        key == "offerData.sizeLength" ||
        key == "offerData.sizeWidth" ||
        key == "offerData.paperNum" ||
        key == "offerData.paperPrice"
      ) {
        let obj = {
          paperPrice: "请输入纸张价格",
          paperNum: "请输入来纸数量",
          sizeWidth: "请输入开料尺寸宽度",
          sizeLength: "请输入开料尺寸长度",
        };
        if (value == "" || value == "0") {
          // this.modalFun({ contentText: obj[strArr[strArr.length-1]], time: 1000 });
          this.setData({
            priceObj: {},
          });
        }
      }
      /**开料尺寸限制 */
      if (
        key == "offerData.sizeWidth" ||
        key == "offerData.sizeLength" ||
        key == "offerData.sheetLength" ||
        key == "offerData.sheetWidth"||
        key == "offerData.paperPrice" ||
        key == "offerData.printPrice"
      ) {
        if (value > 999999 ) {
          this.setData({
            [key]: 999999,
          });
          this.countPrice();
          return;
        }
      }
      if (
        key == "offerData.sizeWidth" ||
        key == "offerData.sizeLength" ||
        key == "offerData.paperPrice" ||
        key == "offerData.sheetLength" ||
        key == "offerData.sheetWidth"  ||
        key=='offerData.printPrice'
       
      ) {
        if(value>0){
          value = parseFloat(Number(e.detail.value).toFixed(2));
        }
          if (!value) {
            this.setData({
              [key]: '',
            });
          }
      
        if (!value) {
          return;
        }
      }
      if (key == "offerData.paperPrice") {
        if (value > 999999) {
          value = 999999;
        }
        this.setData({
          "offerData.paperPrice": value,
        });
        this.countPrice();
        return;
      }
      this.setData({
        [key]: value,
      });
    }
    
    if(key=='offerData.paperNum' || key=='offerData.carNum'){
      if (
        this.data.offerData.carNum &&
        this.data.offerData.paperNum &&
        Number(this.data.offerData.carNum) < Number(this.data.offerData.paperNum)
      ) {
        this.modalFun({ contentText: "上机数量不小于来纸数量", time: 1000 });
      }
    }
    if(key=='offerData.underNum' || key=='offerData.carNum'){
      if (
        this.data.offerData.carNum &&
        this.data.offerData.underNum &&
        Number(this.data.offerData.carNum) < Number(this.data.offerData.underNum)
      ) {
        this.modalFun({ contentText: "上机数量不小于下机数量", time: 1000 });
      }
    }
    _this.countPrice();
  },
  /**
   *  计算价格
   */
  async countPrice() {
    var _this = this;
    var msg = await _this.verifyData();
    var msg2 = await _this.verifyData2();
    let offer =_this.data.offerData
    if (msg) {
      return;
    }
    if (msg2&&this.data.offerData.papertype == "自来") {
      // this.modalFun({ contentText: msg2, time: 1000 });
      return;
    }

    var attrStr = _this.joinStr();
    // var paper =  this.data.offerInfo.tonsPrice.find(s => s.lable===this.data.offerData.tonsPrice)
    if (offer.papertype == "代采") {
      _this.setData({
        judge: this.data.priceObj?.paperDiscountPrice
          ? offer.printPrice || ""
          : "",
      });
    } else {
      _this.setData({
        judge:offer.printPrice || "",
      });
    }

    getPaperAndPrintPrice({
      frontsNumber: offer.carNum, //上机数量量
      goodsAttr: attrStr,
      paperOnePrice: offer.paperPrice, //纸张价格:吨/平方
      printPrice: this.data.judge,
      // printPrice: this.data.priceObj?.paperDiscountOnePrice
      //   ? offer.printPrice || ""
      //   : "", //印刷费用
      //printPrice: offer.printPrice || "", //印刷费用
    }).then((res) => {
      _this.getCartCount()
      if (!res.success) {
        this.setData({
          priceObj: {},
        });
        _this.modalFun({ contentText: res.message, time: 1000 });
        return;
      } 
      var data = res.data;
      _this.setData({
        priceObj: data,
      });
      if (_this.data.priceObj && offer.carNum > 0 && offer.printPrice > 0) {
        this.setData({
          toatlPrice: this.data.priceObj.price,
        });
      }
      if (!data.printPrice && offer.carNum > 0 && offer.printPrice > 0) {
        _this.countPrice();
      }
    });
  },
  verifyData() {
    const offer = this.data.offerData;
    let flag =
      !this.data.priceObj || !this.data.priceObj?.paperDiscountOnePrice;
    if (flag && offer.materialType === "") {
      return "请选择纸张材质";
    }
    if (flag && offer.materialType === "其他") {
      if (offer.procedureList.paperSurface == "") {
        return "请输入纸张材质";
      }
      if (offer.procedureList.paperGram == "") {
        return "请输入纸张克重";
      }
      if (offer.papertype == "代采") {
        if (offer.paperPrice == "") {
          return "请输入纸张单价";
        }
      }
    }
    if (flag && !offer.sizeLength) {
      return "请输入开料尺寸长度";
    }
    if (flag && !offer.sizeWidth) {
      return "请输入开料尺寸宽度";
    }
    if (flag && !~~offer.paperNum) {
      return "请输入来纸数量";
    }
    if (flag && offer.papertype == "代采") {
      console.log(4389568687);
      if (!(offer.paperPrice > 0)) {
        return "请输入纸张价格";
      }
      if(offer.materialType=='单铜纸'){
        if (offer.paperPrice <100.1) {
          console.log(23222);
          return "单铜纸价格需高于100";
        }
      }
      if(offer.materialType=='银卡纸'){
        if (offer.paperPrice <0.021) {
          return "银卡纸价格需高于0.02";
        }
      }
    }
  },
  verifyData2() {
    var offer = this.data.offerData;
    if (offer.sizeLength < 1 || offer.sizeWidth < 1) {
      return "尺寸不能低于1mm";
    }
    if (
      offer.carNum &&
      offer.paperNum &&
      Number(offer.carNum) < Number(offer.paperNum)
    ) {
      return "上机数量不小于来纸数量";
    }
    if (
      offer.carNum &&
      offer.underNum &&
      Number(offer.carNum) < Number(offer.underNum)
    ) {
      return "上机数量不小于下机数量";
    }
    if (offer.materialType === "其他") {
      if (offer.procedureList.paperGram == "") {
        return "请输入纸张克重";
      }
      if (offer.procedureList.paperSurface == "") {
        return "请输入纸张材质";
      }
      if (offer.papertype == "代采") {
        if (offer.paperPrice == "") {
          return "请输入纸张单价";
        }
      }
    }
    if (!offer.carNum) {
      return "请输入上机数量";
    }
    if (!offer.underNum) {
      return "请输入下机数量";
    }
    // if (!offer.paperPrice) {
    //   return "请输入纸张价格";
    // }
    if (offer.spot) {
      let arr = offer.procedureList.pantoneColorList.filter(
        (item) => item.value
      );
      if (arr.length != offer.procedureList.pantoneColorList.length) {
        return "请填写PANTONE色号";
      }
    }
   
    
  },
  //单位选择器弹框
  showPopup1: function (e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      [type]: !this.data[type],
    });
  },
  changeSelect(e) {
    let val = e.detail.value;
    let key = e.currentTarget.dataset.key;
    let type = e.currentTarget.dataset.type;
    let item = e.currentTarget.dataset.item;
    switch (item) {
      case "pantoneColorList":
        let i = val - this.data.offerData.procedureList.pantoneColorList.length;
        if (i > 0) {
          for (let j = 0; j < i; j++) {
            this.data.offerData.procedureList.pantoneColorList.push({
              value: "",
            });
            this.setData({
              "offerData.procedureList.pantoneColorList":
                this.data.offerData.procedureList.pantoneColorList,
            });
          }
        } else if (i < 0) {
          this.data.offerData.procedureList.pantoneColorList.splice(val);
          this.setData({
            "offerData.procedureList.pantoneColorList":
              this.data.offerData.procedureList.pantoneColorList,
          });
        }
        break;
    }
    this.setData({
      ["offerData.procedureList." + key]: val,
    });
    this.countPrice();
    this.onCancelPup("", type);
    // this.showSelect()
  },
  onCancelPup(e, a) {
    let _this = this;
    if (e != "" && e?.currentTarget.dataset.type) {
      this.setData({
        [e.currentTarget.dataset.type]:
          !this.data[e.currentTarget.dataset.type],
      });
    } else {
      if (a) {
        this.setData({
          [a]: !this.data[a],
        });
      } else {
        let arr = ["iscolorShow", "frontShow", "backShow", "unit"];
        let key = arr.find((e) => _this.data[e]);
        this.setData({
          [key]: !this.data[key],
        });
      }
    }
  },
  /**
   * 消息提示
   * @param {Object}
   */
  modalFun({ contentText, icon, iconSize, image, imageSize, time }) {
    var _this = this;
    this.setData({
      modal: {
        show: true,
        contentText,
        icon,
        iconSize,
        image,
        imageSize,
      },
    });
    setTimeout(
      () => {
        _this.setData({
          modal: {
            show: false, //modal是否显示，默认false
          },
        });
      },
      time ? time : 2000
    );
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
        printInfo: obj[arr[index]],
      });
    } else {
      await this.printBookmarks(obj[arr[index]], i, arr);
    }
  },
  checkTap: function (e) {
    if (e.currentTarget.dataset.key == "spot") {
      this.setData({
        spot: !this.data.spot,
      });
      if (this.data.spot) {
        let i = this.data.offerData.procedureList.pantoneNumber;
        for (let j = 0; j < i; j++) {
          this.data.offerData.procedureList.pantoneColorList.push({
            value: "",
          });
          this.setData({
            "offerData.procedureList.pantoneColorList":
              this.data.offerData.procedureList.pantoneColorList,
          });
        }
      } else {
        this.setData({
          "offerData.procedureList.pantoneColorList": [],
        });
      }
      this.countPrice();
    } else {
      let oldValue = deepGet(this.data, e.currentTarget.dataset.key, "");
      this.setData({
        [e.currentTarget.dataset.key]:
          oldValue == e.currentTarget.dataset.val
            ? ""
            : e.currentTarget.dataset.val,
      });
      this.addSpotList(e.currentTarget.dataset.key);
      this.countPrice();
    }
  },
  /** 选择专色 */
  addSpotList(key) {
    let _this = this;
    let listKey = "";
    let numKey = "";
    let spot = deepGet(_this.data, key, "");
    const addList = () => {
      if (spot != "") {
        let i = deepGet(_this.data, numKey, 0);
        let list = deepGet(_this.data, listKey, []);
        for (let j = 0; j < i; j++) {
          list.push({ value: "" });
          _this.setData({
            [listKey]: list,
          });
        }
      } else {
        _this.setData({
          [listKey]: [],
        });
      }
    };
    if (key == "offerData.spot") {
      numKey = "offerData.procedureList.pantoneNumber";
      listKey = "offerData.procedureList.pantoneColorList";
      addList();
    }
  },
  /**
   * 输入色号
   * @param {*} e
   */
  async colorNumberVal(e) {
    var _this = this;
    await _this.printBookmarks(_this.data, 0, e.currentTarget.dataset.key.split("."));
    if (_this.data.printInfo[e.currentTarget.dataset.index].value == e.detail.value)
      return;
    if (e.detail.value == "") {
      _this.setData({
        [e.currentTarget.dataset.key + `[${e.currentTarget.dataset.index}].value`]:
          e.detail.value,
      });
    } else {
      checkPantone({ list: [e.detail.value] }).then((res) => {
        if (!res.success) {
          _this.modalFun({ contentText: res.message, time: 1000 });
          // _this.setData({
          //   [e.currentTarget.dataset.key + `[${e.currentTarget.dataset.index}].value`]:
          //   ''
          // });
          // return
        }
        _this.setData({
          [e.currentTarget.dataset.key + `[${e.currentTarget.dataset.index}].value`]:
            e.detail.value,
        });
        _this.countPrice();
      });
    }
  },
  /**
   * 拼接数据
   * @returns 属性字符串
   */
  joinStr() {
    var offer = this.data.offerData;
    var info = this.data.offerInfo;
    var attrStr = ``; //展开尺寸:500_500;纸张材质:超高松纸_350;表面处理:哑胶;印刷颜色:多色_CMYK;粘合:自动粘1处;0;
    if (offer.paperMode) {
      attrStr += `来料方式:${offer.papertype};`;
    }
    if (offer.sizeLength || offer.sizeWidth) {
      attrStr += `开料尺寸:${Number(offer.sizeLength).toFixed(2)}_${Number(
        offer.sizeWidth
      ).toFixed(2)};`;
    }
    // if(offer.papertype == '代采'){
    //   let judgeUit = ''
    //   if(offer.materialType == "其他"){
    //     judgeUit = offer.procedureList.unit
    //   }else{
    //     judgeUit = offer.paperUit
    //   }
    //   attrStr += `纸张价格:${offer.paperPrice}/${judgeUit};`
    // }
    attrStr += `来纸数量:${offer.paperNum};上机数量:${offer.carNum};下机数量:${offer.underNum};`;
    if (offer.materialType == "其他") {
      // attrStr += `其他纸张;纸张材质:${offer.procedureList.paperSurface}_${offer.procedureList.paperGram};${offer.procedureList.unit}:${offer.paperPrice};`;
      // attrStr += `其他纸张;纸张材质:${offer.procedureList.paperSurface}_${offer.procedureList.paperGram};${offer.procedureList.unit}:${offer.paperPrice};`;
        attrStr += `其他纸张;纸张材质:${offer.procedureList.paperSurface}_${offer.procedureList.paperGram};`;
      
    } else {
      attrStr += `纸张材质:${
        info.thickness.find((s) => s.kg === offer.thickness).keyvalueFront
      };`;
    }
 if(offer.papertype == '代采'){
      let judgeUit = ''
      if(offer.materialType == "其他"){
        judgeUit = offer.procedureList.unit
      }else{
        judgeUit = offer.paperUit
      }
      attrStr += `${judgeUit}:${offer.paperPrice};`
    }
    if (
      (this.data.priceObj &&
      this.data.priceObj.paperDiscountPrice > 0 &&
      this.data.offerData.carNum )||
      this.data.offerData.papertype == "自来"
    ) {
      attrStr += `印刷机型:${offer.printType}_${offer.paperMode};`;
      if (offer.printsize != "单面四色") {
        attrStr += `印刷方式:双面四色_${offer.doublePrint};`;
      } else {
        if(offer.addChalk){
          attrStr += `${offer.addChalk};`
        }
        if(offer.addUV){
          attrStr += `${offer.addUV};`
        }
        
        attrStr += `印刷方式:单面四色;`;
      }
      attrStr += `是否看色:${offer.printColor};`;
      if (this.data.offerData.procedureList.pantoneColorList.length > 0) {
        let str = this.data.offerData.procedureList.pantoneColorList
          .map((e) => e.value)
          .join();
        attrStr += `专色:${this.data.offerData.procedureList.pantoneColorList.length},${str};`;
      }
    }
    return attrStr;
  },
  onChange(event) {
    this.setData({
      radio: Number(event.detail),
    });
  },
  /**
   * 添加购物车
   */
  addEditionCart() {
    this.edition(0);
  },
  /**
   * 添加购物车/立即下单
   * @param {*} isFrom  0|1 |立即下单
   * @returns
   */
  async edition(isFrom) {
   
    var _this = this;
   
    var msg = await _this.verifyData();
    var msg2 = await _this.verifyData2();
    if (msg) {
      _this.modalFun({ contentText: msg, time: 1000 });
      return;
    }
    if (msg2) {
      _this.modalFun({ contentText: msg2, time: 1000 });
      return;
    }
    if (!this.data.offerData.printPrice) {
      this.modalFun({ contentText: '请输入印刷费用', time: 2000 });
      return ;
    }
    var attrStr = _this.joinStr();
    //下机数量可以在这里获取2022-11-08
    var info = {
      factoryId: 1, //工厂地址ID
      fnumber: 1, //款数
      goodsAttr: attrStr, //属性
      isFollowinfo: 0, //是否着色
      isFrom: isFrom, //是否立即购买
      moldNum: 1, //模数
      number: this.data.offerData.carNum, //上机数量
      // paperId: this.data.priceObj.paperId, //纸张品类ID
      paperOnePrice: this.data.priceObj.paperOnePrice,
      monthly: this.data.radio, //现结/月结
      version: 4,
      printPrice:this.data.offerData.printPrice //印刷价格
    };
    wx.showLoading({
      title: isFrom == 0 ? "添加购物车" : "正在下单",
      mask: true,
    });
    //2022-11-18
    // return
    addEdition(info)
      .then((res) => {
        _this.getCartCount()
        if (res.success) {
          if (isFrom == 1) {
            wx.hideLoading();
            _this.setData({
              papertonPriceList: [],
            });
            wx.navigateTo({
              url: "../../Confirm/ConfirmPaperOrder/index?isFrom=1",
            });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '已加入购物车',
              icon: 'success',
              duration: 2000,
              mask:true
            })
            // _this.modalFun({
            //   contentText: "已加入购物车",
            //   icon: "ac-icon-check",
            //   time: 1000,
            // });
            _this.getCountCart();
            _this.setData({
              papertonPriceList: [],
            });
          }
        } else {
          wx.hideLoading();
          _this.modalFun({ contentText: res.message, time: 2000 });
        }
      })
      .catch((err) => {
        wx.hideLoading();
      });
  },
  /**进入购物车列表 */
  checkCart() {
    wx.switchTab({
      url: "/pages/singleCart/index",
    });
  },
  /**
   * 立即下单
   */
  placeOrder() {
    this.edition(1);
  },
   /**获取购物车数量 */
   getCartCount(){
    countCart().then(res=>{
      this.setData({
        cartCount:res.data
      })
    })
  },
 
});

import { getCity, getProvince } from '@/utils/city';
import { getAreaName, getAreaNameList } from '@/utils/city';
import { listBasePack, xmlToPdf, getSchemeDetailBySchemeId, getParentsByBackCategoryId, getPrice, buyNow, listPackByUid, deleteBatchById, updateEditorDesignState } from '@/api/zbz/packCategoryApi';
import LoginForm from '@/components/common/LoginForm';
import checkDetail from '@/components/packages/checkDetail';
import packageLeft from '@/components/packages/packageLeft';
import packageRight from '@/components/packages/packageRight';
import { replaceAll } from '@/utils/objectUtil';
import { strEquals, startWith } from '@/utils/strUtil';
import { categoryData } from '@/utils/json/Category ';
import { setDocumentTitle } from '@/utils/domUtil';

import { debounce } from '@/utils/utils';

export default {
  components: {
    LoginForm,
    checkDetail,
    packageLeft,
    packageRight
  },
  data() {
    return {
      options: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          let provinceList = [];
          if (level == 0) {
            provinceList = getProvince();
          }
          if (level == 1) {
            provinceList = getCity(node.value);
          }
          if (level == 2) {
            provinceList = getCity(node.value);
          }
          let nodes = provinceList.map((item, index) => ({
            value: level == 0 ? index + '' : node.value + '_' + index,
            label: item,
            leaf: level >= 2
          }));
          resolve(nodes);
        }
      },
      imgSrc: 'http://alifile.xiaocaiyin.com/',
      ...{ categoryData },
      md: null,
      loading: false,
      showLoginDialog: false,
      data: [], //商品所有属性
      // url: '', //3d路径
      // type: 'img', //判断是pdf还是3d或img
      schemeNo: '',
      // provinceList: [],
      // cityList: [],
      // countyList: [],
      sendFormData: { provinceId: '', cityId: '', countyId: '' },
      dialogVisible: false,
      imgShow1: false,
      imgShow2: false,

      titleList: [],
      goodsList: [],
      detailsList: [],
      dialogTitle: '',
      //   radio: 3,
      designList: [],
      priceParms: {
        cextends: 1, //0是5天货期，1是7天货期
        city: '',
        language: 'zh-cn',
        number: 0,
        // idStr: '', // 复选框勾选后商品的id
        packGoodsList: [] // 复选框勾选后商品的id
      },

      buyParms: {
        adaptiveReq: {
          language: 'zh-cn',
          primaryIds: [], //主id
          secondIds: [] //次id
        },
        isAdaptiveProof: 1, // 1是需要，0不需要
        language: 'zh-cn',
        number: 0,
        // packDesignId: null, //购买图片id
        packGoodsList: [] // 勾选的id，包含主次id
      },
      day: 0,
      time: 0,
      primaryId: null,
      trim1: null,
      disableFlag: false,
      size: [],
      timer: '',
      inputFlag: true,
      packageLeftDta: {
        isShow: true,
        bigImg: '', //要放大查看的水印图片
        otherImg: [],
        allId: null, //复选款选中的id
        arrId: [],
        allImg: {},
        designVideo: null, //视频地址
        video_show: true,
        videoEnd: false, //播放是否结束
        typeImg: 'all', //缩略图显示,
        imAgeShow: true,
        plays: false,
        pause: true,
        frame_show: false,
        clickId: [],
        rightTop: 0,
        customList: [],
        customFlag: false,
        // length: 0,
        // width: 0,
        // height: 0,
        // thick: 0,
        // typeArg: '',
        isThree: false,
        skinFile: '',
        mould3d: '',
        previewImg: '',
        cutterModelUrl: '',
        showThree: true
      },
      packageRightData: {
        attribute: '',
        title: '',
        formName: '',
        formSize: '',
        ordImg: [],
        excImg: [],
        ordflag: false,
        excflag: false,
        ordId: '',
        excId: '',
        sum: '',
        minNumber: 0, //起订量,
        totalOld: 0,
        fee: 0, //物流费，
        messageTips: 0,
        payNumbers: 0,
        isCustomized: 0, //是否有定制款0是没有，1是有定制款
        isCustom: 0, //是否有自定义设计模板0是没有，1是有编辑
        customId: null,
        composeName: null,
        composePrice: null,
        composeNumber: null,
        customFlag: false,
        cusId: null,
        customList: [],
        cusFlag: false,
        editFlag: false
      },
      deleteParms: {
        isDeleteCustom: 1,
        list: [] //自定义设计风格的id多个
      }
    };
  },
  created() {
    // this.provinceList = getProvince();
    this.getSchemeDetailBySchemeIdFn(this.$route.query.id);
  },
  mounted() {
    //清除定时器
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.$refs.packageLeft.videoEndFn();
    }, 100);
  },
  beforeUpdate() {
    this.updateDate();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    ...{ replaceAll, strEquals, startWith, setDocumentTitle },
    uploadPDFFile(index, url) {
      let _this = this;
      xmlToPdf({ fileName: url }).then(res => {
        // console.log(res);
        if (res.code == '000000') {
          _this.$set(this.goodsList[index], 'pdfPath', res.data);
        }
      });
    },
    // 用户包装方案设计稿列表 ---自定义设计风格
    listPackByUidFn() {
      const parms = {
        data: {
          isCustom: 1,
          packSchemeId: this.$route.query.id
          // packSchemeId: 288
        }
      };
      listPackByUid(parms).then(res => {
        // console.log('listPackByUid自定义方案', res);
        if (res.code == '970005') {
          this.showLoginDialog = true;
        } else {
          let cusList = [];
          if (res.code == '000000') {
            let customData = res.data;
            this.packageRightData.customFlag = customData == null || customData?.length == 0 ? false : true;
            let i = 0;
            for (let item in customData) {
              i++;
              cusList.push(...customData[item]); //为获取自定义设计的id,用于重新设计或者在此基础上设计
              this.packageRightData.customList.push({ customVal: customData[item], id: 1000 + i });
            }
          } else {
            this.packageRightData.customFlag = false;
          }
          this.packageRightData.customFlag = this.packageRightData.customList?.length == 0 ? false : true;
          // 获取自定义设计的id,用于重新设计或者在此基础上设计
          cusList.map(e => {
            if (e.id != null) {
              this.deleteParms.list.push(e.id);
            }
          });
        }
      });
    },
    deleteBatchByIdFn() {
      deleteBatchById(this.deleteParms).then(res => {
        // console.log('deleteBatchById自定义方案', res);
      });
    },
    // 获取放大图片的区域
    getDom(domType, num) {
      if (domType == 'bigBox') {
        return this.$refs.bigBox;
      } else if (domType == 'bimg') {
        return this.$refs.bimg;
      }
    },
    // 获取右边的高度
    updateDate() {
      this.$nextTick(() => {
        this.packageLeftDta.rightTop = this.$refs.packageRight?.$el['offsetHeight'];
      });
    },
    // 播放视频
    play() {
      let _this = this;
      _this.packageLeftDta.plays = true;
      _this.packageLeftDta.pause = false;
      this.$nextTick(() => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // console.log('55555555', _this.md);
          _this.packageLeftDta.plays = false;
          _this.packageLeftDta.videoEnd = false;
          if (_this.packageLeftDta.md) {
            _this.packageLeftDta.md.play();
          }
          this.$refs.packageLeft.videoEndFn();
        }, 1000);
      });
    },
    handlerValue(val) {
      this.sendFormData.provinceId = val[0];
      this.sendFormData.cityId = val[1];
      this.sendFormData.countyId = val[2];
      this.selectCity();
    },
    selectCity(val, type) {
      let citys = '';
      if (this.sendFormData.countyId !== '') {
        citys = getAreaNameList(this.sendFormData.countyId).join(' ');
      }
      this.priceParms.city = citys;
      this.getPriceFn(1);
    },
    //展开,收起
    openImg(type) {
      if (type == 1) {
        this.imgShow1 = !this.imgShow1;
      } else {
        this.imgShow2 = !this.imgShow2;
      }
    },
    // 普通图片，独家图片选中
    radioSelected(id, type, designVideo, watermark) {
      let _this = this;
      //控制图片放大器
      _this.$set(_this.packageLeftDta, 'bigImg', watermark);
      if (_this.$refs.packageLeft.imgShow) {
        _this.packageLeftDta.isShow = true;
        _this.$refs.packageLeft.magnifyGlass();
      }

      let index;
      _this.packageLeftDta.typeImg = 'all';
      //   选择其他普通图片，独家图片时，把之前选中的初始化
      _this.packageLeftDta.arrId = [];
      _this.packageRightData.totalOld = 0;
      _this.packageRightData.sum = '';
      _this.priceParms.packGoodsList = [];
      _this.buyParms.packGoodsList = [];
      _this.goodsList.map(e => {
        e.price = '0.00';
      });
      // 默认展示全部3d效果
      _this.packageLeftDta.allId = id;
      _this.packageLeftDta.video_show = false;
      _this.packageLeftDta.showThree = false;
      clearTimeout(_this.timer);
      _this.timer = setTimeout(() => {
        _this.packageLeftDta.video_show = true;
        _this.packageLeftDta.showThree = true;
        _this.packageLeftDta.videoEnd = false;
      }, 0);
      _this.packageLeftDta.frame_show = true;

      if (type == 'ord') {
        _this.packageLeftDta.designVideo = designVideo;

        _this.packageRightData.ordId = id;
        // _this.buyParms.packDesignId = id;
        _this.packageRightData.ordflag = true;
        _this.packageRightData.excflag = false;
        _this.packageLeftDta.customFlag = false;
        _this.packageRightData.cusFlag = false;
        index = _this.designList.findIndex(item => item.id == id);
        _this.goodsList = _this.designList[index].designGoods.map(e => {
          let arr = e.composeName.split('_');
          e.newName = arr[arr.length - 1];
          e.goodsImg = e.goodsImg instanceof Object ? e.goodsImg : JSON.parse(e.goodsImg);
          return e;
        });
        _this.packageLeftDta.allImg = _this.designList[index].goodsImg;
        _this.goodsFn(1);
      } else if (type == 'exc') {
        _this.packageLeftDta.designVideo = designVideo;
        _this.packageRightData.excId = id;
        // _this.buyParms.packDesignId = id;
        _this.packageRightData.ordflag = false;
        _this.packageRightData.excflag = true;
        _this.packageLeftDta.customFlag = false;
        _this.packageRightData.cusFlag = false;

        index = _this.designList.findIndex(item => item.id == id);
        _this.goodsList = _this.designList[index].designGoods.map(e => {
          let arr = e.composeName.split('_');
          e.newName = arr[arr.length - 1];
          e.goodsImg = e.goodsImg instanceof Object ? e.goodsImg : JSON.parse(e.goodsImg);
          return e;
        });
        _this.packageLeftDta.allImg = _this.designList[index].goodsImg;
        _this.goodsFn(1);
      } else {
        //控制图片放大器
        _this.packageLeftDta.isShow = false;
        _this.$refs.packageLeft.removeEvent();
        // 选中自定义设计时候是按第一个来设计的
        _this.goodsList = _this.designList[0].designGoods;
        _this.packageRightData.cusId = id;
        _this.packageRightData.ordflag = false;
        _this.packageRightData.excflag = false;
        _this.packageLeftDta.customFlag = true;
        _this.packageRightData.cusFlag = true;
        _this.packageLeftDta.customList = designVideo;
        console.log('_this.packageLeftDta.customList', _this.packageLeftDta.customList);
        _this.packageLeftDta.customList.map((e, i) => {
          if (e.xmlPath != null) {
            let index = _this.goodsList.findIndex(item => e.packGoodsId == item.packGoodsId);
            _this.uploadPDFFile(index, e.xmlPath);
          }
          if (typeof e.extInfo === 'string') e.extInfo = e.extInfo ? JSON.parse(e.extInfo) : '';
          if (i == 0) {
            // console.log('e666666666666', e);
            _this.packageLeftDta.typeImg = e.id;
            if (e.packDesignEditBase.isThree == null) {
              _this.packageLeftDta.isThree = false;
              _this.packageLeftDta.cutterModelUrl = e.packDesignEditBase.cutterModelUrl;
              _this.packageLeftDta.previewImg = e.previewImg;
              // console.log(99999999999999999, _this.packageLeftDta.cutterModelUrl);
            } else {
              _this.packageLeftDta.isThree = true;
              // _this.packageLeftDta.isThree = e.packDesignEditBase.isThree;
              _this.packageLeftDta.skinFile = e.packDesignEditBase.skinFile;
              _this.packageLeftDta.mould3d = e.packDesignEditBase.mould3d;
              _this.packageLeftDta.previewImg = e.id == null ? e.packDesignEditBase.previewImg : e.previewImg;
              // _this.packageLeftDta.previewImg = e.previewImg;
            }
          }
        });
        _this.goodsFn(1);
      }

      // 视频播放的逻辑处理
      _this.timer = setTimeout(() => {
        // _this.videoEndFn();
        _this.$refs.packageLeft.videoEndFn();
      }, 1000);
      // console.log(' _this.goodsList555----', _this.goodsList);
    },
    changeStatus() {
      this.inputFlag = false;
      // console.log('调用了', this.inputFlag);
    },
    inputChang() {
      let _this = this;
      if (this.packageRightData.sum == '' || this.packageRightData.sum == null) {
        this.packageRightData.fee = 0;
        this.day = 0;
        this.time = 0;
        this.packageRightData.totalOld = 0;

        this.packageRightData.payNumbers = 1;
        this.packageRightData.messageTips = 0;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.packageRightData.payNumbers = 0;
        }, 3000);
      } else {
        this.priceParms.number = parseInt(this.packageRightData.sum);
        this.buyParms.number = parseInt(this.packageRightData.sum);
        // if (this.priceParms.idStr == '' || this.priceParms.idStr == null) {
        // czj  查找goodsList被选择的值
        let list = this.goodsList.filter(e => e.checked);
        // console.log('查找goodsList被选择的值', list);
        if (list.length == 0) {
          this.packageRightData.fee = 0;
          this.day = 0;
          this.time = 0;
          this.packageRightData.totalOld = 0;
        } else {
          _this.getPriceFn(1);
          // console.log('this.sum', this.packageRightData.sum);
        }
      }
    },
    // 选中复选框
    selectChecked(id) {
      let unIndex = this.packageLeftDta.arrId.findIndex(key => key == id);
      if (unIndex != -1) {
        this.packageLeftDta.arrId.splice(unIndex, 1);
        this.priceParms.packGoodsList.splice(unIndex, 1);
        // this.buyParms.packGoodsList.splice(unIndex, 1);
        let selectIndex = this.goodsList.findIndex(vo => vo.id == id);
        // console.log('selectIndex', selectIndex);
        this.goodsList[selectIndex].price = '0.00';
      } else {
        this.packageLeftDta.arrId.push(id);
        let obj = {
          goodsAttr: '',
          id: id
        };
        this.priceParms.packGoodsList.push(obj);
        // this.buyParms.packGoodsIdList.push(obj)
      }
      // console.log('复选框goodsList', this.goodsList);
      // console.log('unIndex', unIndex, id);
      // console.log('arrId88888', this.packageLeftDta.arrId);
      this.buyParms.packGoodsList = this.priceParms.packGoodsList;
      // this.buyParms.packGoodsIdList = this.packageLeftDta.arrId;
      // console.log('this.buyParms.packGoodsIdList', this.buyParms.packGoodsIdList);
      this.inputChang();
    },
    // 计价成功后的判断
    priceSucessFn(detailList, tabsType) {
      let _this = this;
      let goodsIndex = null;
      let priceIndex = null;
      let priceMax = 0;
      // let number = 0;
      let primaryArr = [];
      let secondIdsArr = [];
      detailList.map(key => {
        // 主次id
        if (key.unit_price > priceMax) {
          priceMax = key.unit_price;
          primaryArr.push(key.id);
        } else if (key.unit_price == priceMax) {
          priceMax = key.unit_price;
          //   1是卡纸盒，7是微坑盒，6是精装盒
          if (key.goodsTag == 1 || key.goodsTag == 7 || key.goodsTag == 6) {
            primaryArr.push(key.id);
          }
        }
        secondIdsArr.push(key.id);
        // czj goodsList查找与key对应的index
        let index = _this.goodsList.findIndex(item => key.id == item.id);
        if (tabsType == 2) {
          _this.$set(_this.goodsList[index], 'price2', key.unit_price);
          _this.$set(_this.goodsList[index], 'price_member2', key.price_member);
        } else {
          _this.$set(_this.goodsList[index], 'price', key.unit_price);
          _this.$set(_this.goodsList[index], 'price_member', key.price_member);
        }
      });
      this.primaryId = primaryArr.pop();
      this.buyParms.adaptiveReq.primaryIds = [this.primaryId];
      let secondIndex = secondIdsArr.findIndex(e => e == this.primaryId);
      secondIdsArr.splice(secondIndex, 1);
      this.buyParms.adaptiveReq.secondIds = secondIdsArr;
      _this.setTotalPrice(tabsType);
    },
    /** czj  设置总价 */
    setTotalPrice(tabsType) {
      let _this = this;
      _this.packageRightData.totalOld = _this.goodsList
        .filter(e => e.checked)
        .map(e => (tabsType == 2 ? e.price_member2 || e.price_member : e.price_member ? e.price_member : 0))
        .reduce((a, b) => a + b);
      // console.log('this.packageRightData.totalOld-----', this.packageRightData.totalOld);
    },
    /** czj  定制款书数据发生改变，重新计价 */
    resetUnitPrice(index) {
      let _this = this;
      // this.getPriceFn(1)
      let tabsType = _this.$refs.packageRight.tabsType;
      if (_this.goodsList[index].goodsAttr2 == _this.goodsList[index].goodsAttr) {
        if (tabsType == 2) {
          _this.$set(_this.goodsList[index], 'price2', _this.goodsList[index].price);
          _this.$set(_this.goodsList[index], 'price_member2', _this.goodsList[index].price_member);
        }
        _this.setTotalPrice(tabsType);
        return;
      }
      if (tabsType != 2) return;
      getPrice({
        ..._this.priceParms,
        packGoodsList: [
          {
            id: _this.goodsList[index].id,
            goodsAttr: _this.goodsList[index].goodsAttr2
          }
        ]
      })
        .then(res => {
          //   console.log('获取计价接口', res);
          if (res.code === '970006') {
            this.showLoginDialog = true;
          } else {
            if (res.code == '000000') {
              this.packageRightData.totalOld = res.data.total_old;
              this.time = res.data.time;
              this.packageRightData.fee = res.data.shipping_fee;
              this.day = res.data.day;
              this.priceSucessFn(res.data.detail, tabsType);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取计价接口 
    // status(是否弹出登录框)  0  不弹   1 弹
    getPriceFn: debounce(function (status) {
      let _this = this;
      let number;
      let lists = [];
      this.goodsList.map(key => {
        if (key.checked) {
          // 处理起订量的最小值是多少
          this.categoryData.forEach(e => {
            if (key.goodsId == e.goodsId) {
              key.minNumber = e.number;
              // console.log('  e.goodsId', e.goodsId);
              // console.log(' item.minNumber', e.goodsId, ':', key.minNumber);
            } else {
              key.minNumber = 100;
            }
          });
          lists.push(key.minNumber);
          if (lists.length) {
            number = Math.max(...lists);
            // console.log('调用了5555', this.inputFlag);
            // 默认开始小于10000取值10000
            if (this.inputFlag) {
              this.packageRightData.sum = number > 10000 ? number : 10000;
            }
            this.packageRightData.minNumber = number;
          }
        }
      });
      // 最低起订量
      if (!isNaN(_this.packageRightData.sum)) {
        if (_this.packageRightData.sum < this.packageRightData.minNumber) {
          _this.packageRightData.sum = parseInt(this.packageRightData.minNumber);
          _this.packageRightData.messageTips = 1;
          _this.packageRightData.payNumbers = 0;
          clearTimeout(_this.timer);
          _this.timer = setTimeout(() => {
            this.packageRightData.messageTips = 0;
          }, 3000);
          this.priceParms.number = this.packageRightData.minNumber;
          this.buyParms.number = parseInt(this.packageRightData.sum);
        } else {
          this.priceParms.number = parseInt(this.packageRightData.sum);
          this.buyParms.number = parseInt(this.packageRightData.sum);
        }
      }
      // console.log('this.priceParms777', this.priceParms);
      this.packageRightData.totalOld = 0;
      this.packageRightData.fee = 0;
      this.day = 0;
      this.time = 0;
      // czj  获取packageRight组件的tabsType判断是经典款还是定制款数据
      let tabsType = _this.$refs.packageRight.tabsType;
      // console.log('tabsType', tabsType);
      let packGoodsList = [];
      let filterList = _this.goodsList.filter(e => e.checked);
      if (tabsType == 2) {
        // czj  查找goodsAttr2===''的数据，如果是空字符串，代表属性不完善，无法计价
        let errGoods = filterList.find(e => e.goodsAttr2 === '');
        if (errGoods) {
          _this.$message.error(errGoods.composeName + '的属性不完善');
          return;
        }
        packGoodsList = filterList.map(e => {
          return {
            goodsAttr: e.goodsAttr2 || e.goodsAttr, //czj  如果又goodsAttr2就使用不然就使用goodsAttr
            id: e.id
          };
        });
      } else {
        packGoodsList = filterList.map(e => {
          return {
            goodsAttr: '',
            id: e.id
          };
        });
      }
      getPrice({ ..._this.priceParms, packGoodsList })
        .then(res => {
          //   console.log('获取计价接口', res);
          if (res.code === '970006') {
            // 是否弹出登录框   0  不弹   1 弹
            if (status == 1) {
              this.showLoginDialog = true;
            } else {
              _this.goodsList = _this.goodsList.map(item => {
                item.price_member = item.price * _this.priceParms.number;
                return item;
              });
              _this.setTotalPrice(1);
            }
          } else {
            if (res.code == '000000') {
              // this.packageRightData.totalOld = res.data.total_old;
              this.time = res.data.time;
              this.packageRightData.fee = res.data.shipping_fee;
              this.day = res.data.day;
              this.priceSucessFn(res.data.detail, tabsType);
            }
          }
        })
        .catch(err => {
          // console.log(err);
          // 不支持配送地区
          if (err.code === '910007') {
            this.packageRightData.fee = '910007';
          }
        });
    }, 500),
    // 立即购买
    buyNowFn() {
      // console.log('buyParms', this.buyParms);
      let _this = this;
      // czj  获取packageRight组件的tabsType判断是经典款还是定制款数据
      let tabsType = _this.$refs.packageRight.tabsType;
      // console.log('tabsType', tabsType);
      let packGoodsList = [];
      let filterList = _this.goodsList.filter(e => e.checked);
      if (tabsType == 2) {
        // czj  查找goodsAttr2===''的数据，如果是空字符串，代表属性不完善，无法计价
        let errGoods = filterList.find(e => e.goodsAttr2 === '');
        if (errGoods) {
          _this.$message.error(errGoods.composeName + '的属性不完善');
          return;
        }
        // 是自定义设计时下单
        if (this.packageLeftDta.customFlag) {
          packGoodsList = filterList.map(e => {
            return {
              goodsAttr: e.goodsAttr2 || e.goodsAttr, //czj  如果又goodsAttr2就使用不然就使用goodsAttr
              id: e.id,
              pdfPath: e.pdfPath
            };
          });
        } else {
          packGoodsList = filterList.map(e => {
            return {
              goodsAttr: e.goodsAttr2 || e.goodsAttr, //czj  如果又goodsAttr2就使用不然就使用goodsAttr
              id: e.id
            };
          });
        }
      } else {
        // 是自定义设计时下单
        if (this.packageLeftDta.customFlag) {
          packGoodsList = filterList.map(e => {
            return {
              goodsAttr: '',
              id: e.id,
              pdfPath: e.pdfPath
            };
          });
        } else {
          packGoodsList = filterList.map(e => {
            return {
              goodsAttr: '',
              id: e.id
            };
          });
        }
      }
      buyNow({ ...this.buyParms, cextends: this.priceParms.cextends, packGoodsList })
        .then(res => {
          if (res.code == '000000') {
            this.$router.push({
              path: '/cart/checkorder',
              query: {
                isCart: 0,
                isZbz: 2,
                isAdaptiveProof: this.buyParms.isAdaptiveProof
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.$report({
        channel: 161003,
        actionId: tabsType == 1 ? 3 : 4
      });
    },
    // 获取详情接口
    getSchemeDetailBySchemeIdFn(id) {
      let _this = this;
      getSchemeDetailBySchemeId({ id: id })
        .then(res => {
          // console.log('getSchemeDetailBySchemeIdFn', res);
          this.getParentsByCategoryIdFn(res.data.cateId);

          if (res.code == '000000') {
            if (res.data == null) {
              this.$message.error('数据为空值');
            } else {
              this.packageRightData.formName = res.data.packForm?.type;
              this.packageRightData.formSize = res.data.packForm?.size;
              this.packageRightData.attribute = res.data.attribute;
              this.packageRightData.isCustomized = res.data.isCustomized;
              this.packageRightData.isCustom = res.data.isCustom;
              this.schemeNo = res.data.schemeNo;
              this.packageRightData.title = res.data.schemeName;
              this.setDocumentTitle(this.packageRightData.title + '-傲彩aocai.cn');
              if (res.data.isCustom == 1) {
                this.listPackByUidFn();
              }
              if (res.data.designList.length == 0 || res.data.designList.length == null || res.data.designList.length == '') {
                this.$message.error('该商品已下架！');
                return;
              }
              this.designList = res.data.designList;
              this.designList.map(item => {
                item.goodsImg = item.goodsImg == null ? '' : JSON.parse(item.goodsImg);
                // this.packageLeftDta.otherImg.push(item.goodsImg.watermark)
                if (item.picType == '普通图案') {
                  this.packageRightData.ordImg.push(item);
                } else {
                  this.packageRightData.excImg.push(item);
                }
              });
              let objImg = {
                firstThumbnail: '',
                secondThumbnail: '',
                watermark: ''
              };
              this.goodsList = this.designList[0].designGoods.map(e => {
                let arr = e.composeName.split('_');
                e.newName = arr[arr.length - 1];
                e.goodsImg = e.goodsImg ? e.goodsImg : objImg;
                e.goodsImg = e.goodsImg instanceof Object ? e.goodsImg : JSON.parse(e.goodsImg);
                return e;
              });

              // 初始化选中普通或者独家图片
              if (this.packageRightData.ordImg.length == 0) {
                this.packageRightData.excId = this.packageRightData.excImg[0].id;
                this.packageRightData.ordflag = false;
                this.packageRightData.excflag = true;
                // console.log('this.excId', this.packageRightData.excId);
              } else {
                this.packageRightData.ordId = this.packageRightData.ordImg[0].id;
                this.packageRightData.ordflag = true;
                this.packageRightData.excflag = false;
              }
              this.packageLeftDta.allImg = this.designList[0].goodsImg;
              this.packageLeftDta.bigImg = this.designList[0].goodsImg.watermark;
              this.packageLeftDta.allId = this.designList[0].id;
              this.packageLeftDta.designVideo = this.designList[0].designVideo;
              // 初始化展示全部3d效果
              this.packageLeftDta.frame_show = true;
              this.packageRightData.ordflag = true;
              this.goodsFn(0);
              this.packageRightData.customId = this.goodsList[0].id;
              this.packageRightData.composeName = this.goodsList[0].composeName;
              this.packageRightData.composePrice = this.goodsList[0].price;
              this.packageRightData.composeNumber = this.goodsList[0].number;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 处理数据，  
    // status(是否弹出登录框)  0  不弹   1 弹
    goodsFn(status) {
      let attrList;
      let lists = [];
      this.goodsList.map(item => {
        this.$set(item, 'checked', true);
        item.attrList = [];
        // item.list = [];
        item.strSize = [];
        item.minNumber = 1;
        if (item.goodsAttr == '' || item.goodsAttr == null) {
          this.$message.error('此数据为空');
          return;
        } else {
          attrList = item.goodsAttr.split(';');
          // 删除最后一个空字符
          attrList.pop();
          attrList.map(key => {
            let p = key.indexOf(`\n`);
            if (p != -1) {
              let keys = key.substr(p + 1, key.length);
              key = keys;
              // console.log('key444', key);
            }
            item.attrList.push(key.split(':'));
            let sideSize = key.indexOf('成品尺寸');
            let upSize = key.indexOf('展开尺寸');

            if (sideSize != -1 || upSize != -1) {
              item.strSize.push(key.split(':')[1]);
            }
          });
        }
      });
      this.getPriceFn(status);
    },
    lookDetails(items) {
      this.dialogVisible = true;
      this.detailsList = items.attrList;
      this.dialogTitle = items.composeName;
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
    },
    // 导航栏
    getParentsByCategoryIdFn(id) {
      getParentsByBackCategoryId({ categoryId: id }).then(res => {
        this.titleList = res.data;
      });
    },
    // 输入数量，正则验证,跳转到下单页
    inputCounts() {
      let _this = this;
      // 验证非零的正整数
      const regular = /^\+?[1-9][0-9]*$/.test(this.packageRightData.sum);
      // console.log('验证非零的正整数', regular);
      if (!regular) {
        this.$message.error('请输入数字');
        this.packageRightData.sum = '';
      } else {
        if (_this.trim1) {
          clearTimeout(_this.trim1);
        }
        _this.trim1 = setTimeout(() => {
          _this.loading = false;
          if (_this.buyParms.adaptiveReq.primaryIds[0]) {
            _this.buyNowFn();
          } else {
            _this.$message({
              message: '计价完成，再下单',
              type: 'error'
            });
          }
        }, 1000);
      }
    },
    // 立即购买
    purchaseNow() {
      let tokens = localStorage.getItem('Access-Token');
      if (!tokens) {
        this.showLoginDialog = true;
        return;
      }
      // 判断所有方案没有勾选，返回true
      const flag = this.goodsList.every(item => item.checked === false);
      // 判断所有普通图案没有勾选，返回true
      const ordFlags = this.packageRightData.ordImg.every(key => key.id !== this.packageRightData.ordId);
      // 判断所有独有图案没有勾选，返回true
      const excFlags = this.packageRightData.excImg.every(key => key.id !== this.packageRightData.excId);
      this.loading = true;
      if (ordFlags && excFlags) {
        this.$message.error('请选择图案');
      } else {
        // 判断是否勾选，勾选其中一条执行立即购买
        if (flag) {
          this.$message.error('请勾选方案');
        } else {
          if (this.packageRightData.sum == '' || this.packageRightData.sum == null) {
            this.$message.error('请输入购买数量');
          } else {
            //数组对象中是否含有重复的值
            let goodsId = 0;
            const idx = this.goodsList.findIndex((value, index) => {
              if (value.goodsId == goodsId) {
                return index;
              } else {
                goodsId = value.goodsId;
              }
            });
            // console.log('ids', idx);
            //下单时，如果选中刀卡下单，必须刀卡一和刀卡二同时下单
            if (idx != -1) {
              const goodsflag1 = this.packageLeftDta.arrId.indexOf(this.goodsList[idx - 1].id);
              const goodsflag2 = this.packageLeftDta.arrId.indexOf(this.goodsList[idx].id);
              if (goodsflag1 != -1 && goodsflag2 == -1) {
                this.$message.error('请选中两个刀卡:' + this.goodsList[idx - 1].composeName);
              }
              if (goodsflag2 != -1 && goodsflag1 == -1) {
                this.$message.error('请选中两个刀卡:' + this.goodsList[idx].composeName);
              }
              // console.log('this.goodsList[idx].id', this.goodsList[idx].id);
              if ((goodsflag1 == -1 && goodsflag2 == -1) || (goodsflag2 != -1 && goodsflag1 != -1)) {
                this.inputCounts();
              }
            } else {
              this.inputCounts();
            }
          }
        }
      }
    },

    // 切换自定义设计 显示3d
    custom_preview_3d(item) {
      this.packageLeftDta.typeImg = item.id == null ? item.packDesignEditBase.id : item.id;
      if (item.packDesignEditBase.isThree != null) {
        this.packageLeftDta.isThree = true;
        this.packageLeftDta.skinFile = item.packDesignEditBase.skinFile;
        this.packageLeftDta.mould3d = item.packDesignEditBase.mould3d;
        this.packageLeftDta.previewImg = item.previewImg == null ? item.packDesignEditBase.previewImg : item.previewImg;
      } else {
        this.packageLeftDta.isThree = false;
        this.packageLeftDta.cutterModelUrl = item.packDesignEditBase.cutterModelUrl;
        this.packageLeftDta.previewImg = item.id == null ? item.packDesignEditBase.previewImg : item.previewImg;
      }
      this.$refs.packageLeft.removeEvent();
    },
    //点击3D图标
    model_preview_3d(type, id, designVideo, watermark) {
      let _this = this;
      _this.$set(_this.packageLeftDta, 'bigImg', watermark);
      _this.$refs.packageLeft.videoEndFn();
      _this.packageLeftDta.frame_show = true;
      _this.packageLeftDta.videoEnd = false;
      _this.packageLeftDta.video_show = false;
      let indexId = _this.packageLeftDta.clickId.indexOf(id);
      // 用于首次点击显示封面图片
      if (indexId == -1) {
        _this.packageLeftDta.clickId.push(id);
        _this.packageLeftDta.imAgeShow = true;
      } else {
        _this.packageLeftDta.imAgeShow = false;
      }
      // console.log('_this.clickId', _this.clickId);
      clearTimeout(_this.timer);
      _this.timer = setTimeout(() => {
        _this.$refs.packageLeft.videoEndFn();
        _this.packageLeftDta.imAgeShow = false;
      }, 1000);
      if (type == 'all') {
        _this.packageLeftDta.video_show = false;
        _this.timer = setTimeout(() => {
          _this.packageLeftDta.video_show = true;
        }, 0);
        _this.packageLeftDta.typeImg = 'all';
        _this.designVideo = designVideo;
      } else {
        _this.packageLeftDta.video_show = false;
        _this.packageLeftDta.typeImg = id + '';
        let i = _this.goodsList.findIndex(item => item.id == id);
      }
      console.log(' _this.typeImg0000', _this.packageLeftDta.typeImg);

      // 控制显示放大镜
      if (_this.$refs.packageLeft.imgShow) {
        _this.packageLeftDta.isShow = true;
        _this.$refs.packageLeft.magnifyGlass();
      }
    }
  }
};

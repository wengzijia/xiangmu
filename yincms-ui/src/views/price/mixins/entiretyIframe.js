import { radioSelect2, checkboxSelect2 } from '@/utils/price/goodPriceUtil';
import { checkToken } from '@/api/users/userApi';
import { querySizeData } from '@/api/price/priceApi';
import { iframeUrl, isReceive } from './url';
import { setSessionToken } from '../../../utils/auth';
import store from '@/store';
// 精装盒整体配件iframe页面的js文件
export default {
  data() {
    return {
      iframeId: '',
      commonFormDatainputValue: {},
      formDatainputValue: {},
      url: ''
    };
  },
  beforeMount() {
    // 后台管理系统访问时
    this.url = iframeUrl();
    if (this.$route.query.isCms) {
      setSessionToken(this.$route.query.token);
      checkToken().then(res => {
        if (res.code === '970007') {
          this.sendOpenMessage('getToken');
          return;
        }
      });
      window.addEventListener('message', e => {
        if (!isReceive(e.origin)) {
          return;
        }
        console.log('接收父级回参', e.data);
        if (e.data.type === 'isCmsPrice' && e.data.index === this.$route.query.index) {
          this.commonFormDatainputValue = e.data.commonFormDatainputValue;
          this.formDatainputValue = e.data.formDatainputValue;
          this.testData(e.data.commonFormDatainputValue, e.data.formDatainputValue);
        }
      });
      if (this.$route.query.from == 'wx') {
        store.dispatch('getHeaders');
      }
    }
  },
  watch: {
    'priceFormData.total_price': function(newValue) {
      console.log('total_price', newValue);
      if (this.formData.goodAttr) {
        this.sendOpenMessage('getGoodsInfo');
        if (this.$route.query.isCms) {
          this.sendOpenMessage('isCms');
        }
      }
      if (this.formData.goodAttr && newValue > 0) {
        this.sendOpenMessage('framfunct');
      }
    },
    'priceFormData.price': function(newValue) {
      this.$set(this.priceFormData, 'total_price', newValue);
    },
    'formData.goodAttr': function(newValue) {
      // console.log('goodAttr', newValue);
      this.sendOpenMessage('getGoodsInfo');
      if (this.$route.query.isCms) {
        this.sendOpenMessage('isCms');
      }
    },
    // 监听印刷数量，防止原本代码在输入错误时把印刷数量置零
    'priceFormData.yssl': function(newValue) {
      // console.log('yssl', newValue);
      if (newValue == 0) {
        this.$set(this.priceFormData, 'yssl', 500); //给印刷数量添加一个默认值
      }
    },
    'commonFormData.inputValues.5050_5051': function(newValue) {
      console.log('5050_5051', newValue);
      if (this.formData.goodAttr) this.sendOpenMessage('getGoodsInfo');
    },
    voList: function(newValue) {
      if (this.$route.query.parts || this.bindType === 'proof' || this.$route.query.isnum) return;
      this.testData(this.commonFormDatainputValue, this.formDatainputValue);
    }
  },
  directives: {
    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        // console.log(el, '绑定', binding);
        let width = '',
          height = '';
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value({ width: style.width, height: style.height }); // 关键(这传入的是函数,所以执行此函数)
          }
          width = style.width;
          height = style.height;
          // console.log('isReize',width)
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        // console.log(el, '解绑');
        clearInterval(el.__vueSetInterval__);
      }
    }
  },
  methods: {
    monResize(data) {
      let { width, height } = data;
      let _this = this;
      // console.log('width:', width, 'height:', height, '   dom尺寸方式改变');
      // console.log('_this.$route', _this.$route);
      window.parent.postMessage(
        {
          cmd: 'windowHeight',
          params: {
            height: height,
            cateId: _this.$route.query.cateId,
            subCateId: _this.$route.query.subCateId
          }
        },
        this.url
      );
    },
    getOpenMessage() {
      //接受父页面发来的消息
      let _this = this;
      window.addEventListener('message', event => {
        // 根据上面制定的结构来解析iframe内部发回来的数据
        if (!isReceive(event.origin)) {
          return;
        }
        const data = event.data;
        // console.log('da22222ta', data);
        let obj = {
          setIframeInfo() {
            _this.iframeId = data.params.iframeId;
          },
          setToken() {
            if (data.params.token) {
              setSessionToken(data.params.token);
              checkToken().then(res => {
                if (res.code === '970007') {
                  this.sendOpenMessage('getToken');
                  return;
                }
              });
            }
          }
        };
        if (!obj[data.cmd]) return;
        obj[data.cmd]();
      });
    },
    sendOpenMessage(key) {
      //向父页面发消息
      let _this = this;
      let attr = _this.formData.hxid ? _this.formData.goodAttr + _this.formData.hxid : _this.formData.goodAttr;
      if (_this.$route.path === '/proof/IndexIframe') {
        attr = attr + `${'配件type:' + _this.paperId + ';'}`;
      }

      let msgObj = {
        getIframeInfo: {
          cmd: 'getIframeInfo',
          params: {}
        },
        getGoodsInfo: {
          cmd: 'getGoodsInfo',
          params: {
            goodsAttr: attr,
            mtsl: _this.commonFormData.inputValues['5050_5051'], //每套数量
            goodsId: _this.formData.goodAttrVo.id,
            totalPrice: _this.priceFormData.total_price,
            cateId: _this.$route.query.cateId,
            subCateId: _this.$route.query.subCateId
          }
        },
        framfunct: {
          cmd: 'framfunct',
          params: {}
        },
        isCms: {
          goodsId: _this.formData.goodAttrVo.id,
          // hxid 铁盒的盒型标识
          goodsAttr: _this.formData.goodAttr + `${_this.hxid ? _this.hxid : ''}`,
          index: _this.$route.query.index, // 后台区分数据标记
          subCateId: _this.$route.query.subCateId,
          cateId: _this.$route.query.cateId,
          totalPrice: _this.priceFormData.total_price,
          formDatainputValue: _this.formData,
          commonFormDatainputValue: { inputValues: this.commonFormData.inputValues },
          extends: _this.priceFormData.extends
        },
        getToken: {
          cmd: 'getToken',
          params: {}
        }
      };
      window.parent.postMessage(msgObj[key], '*');
    },
    isCms() {
      if (this.$route.query.isCms) {
        this.tabType = 1;
      }
    },
    // 数据回显
    ...{ radioSelect2, checkboxSelect2 },
    testData(commonFormDatainputValue, formDatainputValue) {
      console.log('数据回显', commonFormDatainputValue, formDatainputValue);
      let _this = this;
      if (!commonFormDatainputValue || !formDatainputValue || (this.$route.query.isCms == 'add' && this.$route.query.flat == 'false')) {
        // 没有值，新增 不进行回显
        return;
      }

      if (this.$route.query.cateId === '3') {
        // 定制精装盒回显
        (commonFormDatainputValue.inputValues || commonFormDatainputValue.long) && _this.$set(_this, 'priceFormData', commonFormDatainputValue);
        _this.$set(_this, 'inputdata', formDatainputValue.inputdata); // 子集输入框
        _this.$set(_this, 'radiodata', formDatainputValue.radiodata);
        _this.$set(_this, 'checkdata', formDatainputValue.checkdata);
        _this.$set(_this, 'selectdata', formDatainputValue.selectdata);
        _this.$set(_this, 'data2', formDatainputValue.data2);
        _this.$set(_this, 'data', formDatainputValue.data);
        return;
      }

      if (this.$route.query.cateId === '10') {
        // 铁盒标识符
        _this.$set(_this, 'hxid', formDatainputValue.hxid);
      }
      if (_this.voList.length == 0) {
        return;
      }
      let o = formDatainputValue;
      // console.log('commonFormDatainputValue', commonFormDatainputValue, JSON.parse(_this.commonFormDatainputValue));
      (commonFormDatainputValue.inputValues || commonFormDatainputValue.long) && _this.$set(_this, 'commonFormData', commonFormDatainputValue);
      console.log('_this.voList', _this.voList);
      for (const vo of _this.voList) {
        // radio单选
        // console.log('vo.miniZtAttrGroup', vo.miniZtAttrGroup);
        if (vo.miniZtAttrGroup.id && o.radioSelectValues[vo.miniZtAttrGroup.id]) {
          _this.$set(_this.formData.radioSelectValues, vo.miniZtAttrGroup.id, o.radioSelectValues[vo.miniZtAttrGroup.id]);
          _this.radioSelect2(o.radioSelectValues[vo.miniZtAttrGroup.id]);
          console.log('_this.formData.radioSelectValues', _this.formData.radioSelectValues);
        }
        // checkbox  复选
        if (vo.miniZtAttrGroup.id && o.checkBoxSelectValues[vo.miniZtAttrGroup.id] && o.checkBoxSelectValues[vo.miniZtAttrGroup.id].length > 0) {
          for (let index = 0; index < o.checkBoxSelectValues[vo.miniZtAttrGroup.id].length; index++) {
            if (!_this.formData.checkBoxSelectValues[vo.miniZtAttrGroup.id]) {
              _this.$set(_this.formData.checkBoxSelectValues, vo.miniZtAttrGroup.id, []);
            }
            console.log('_this.formData.checkBoxSelectValues[vo.miniZtAttrGroup.id]', _this.formData.checkBoxSelectValues[vo.miniZtAttrGroup.id]);
            let index = _this.formData.checkBoxSelectValues[vo.miniZtAttrGroup.id].findIndex(e => e == o.checkBoxSelectValues[vo.miniZtAttrGroup.id][index]);
            index == -1 && _this.formData.checkBoxSelectValues[vo.miniZtAttrGroup.id].push(o.checkBoxSelectValues[vo.miniZtAttrGroup.id][index]);
            if (vo.miniZtAttrGroup.name == '丝印') {
              _this.checkboxSelect({ code: vo.miniZtAttrGroup.id, event: [o.checkBoxSelectValues[vo.miniZtAttrGroup.id][index]] });
            } else {
              _this.checkboxSelect2({ code: vo.miniZtAttrGroup.id, event: [o.checkBoxSelectValues[vo.miniZtAttrGroup.id][index]] });
            }
          }
        }
        // input 输入框
        if (vo.miniZtAttrGroup.groupType == 'input' && vo.attrList.length > 0) {
          for (const vo2 of vo.attrList) {
            _this.$set(_this.formData.inputValues, vo2.groupId + '_' + vo2.id, o.inputValues[vo2.groupId + '_' + vo2.id]);
            if (o.inputValues['10000' + vo2.groupId + '_1000' + vo2.id]) {
              _this.addCopyGroupCk(vo.miniZtAttrGroup.parentAttrId, true);
            }
          }
        }
        if (vo.miniZtAttrGroup.groupType == 'input' && vo.attrList.length > 0) {
          for (const vo2 of vo.attrList) {
            _this.$set(_this.formData.inputValues, vo2.groupId + '_' + vo2.id, o.inputValues[vo2.groupId + '_' + vo2.id]);
          }
        }
        if (vo.miniZtAttrGroup.name == '印刷颜色' && vo.attrList.length > 0) {
          if (o.yslx == 'sm') {
            _this.$set(_this.formData, 'zmys', o.zmys);
            _this.$set(_this.formData, 'fmys', o.fmys);
          } else if (o.yslx == 'dm') {
            _this.$set(_this.formData, 'dmys', o.dmys);
          }
        }
        if (vo.miniZtAttrGroup.name == '印刷工艺' && vo.attrList.length > 0) {
          if (o.yslx == 'sm') {
            _this.$set(_this.formData, 'zmys', o.zmys);
            _this.$set(_this.formData, 'fmys', o.fmys);
          } else if (o.yslx == 'dm') {
            _this.$set(_this.formData, 'dmys', o.dmys);
          }
        }
      }
      if (_this.$route.query.cateId == 10) {
        let inputarr = Object.keys(formDatainputValue.inputValues);
        let data = {
          addNumber: 5,
          dataLength: 10,
          goodsId: 0,
          maxScope: 100,
          minScope: 0,
          sizeLong: formDatainputValue.inputValues[inputarr[0]],
          sizeWidth: formDatainputValue.inputValues[inputarr[1]],
          type: ''
        };

        querySizeData(data).then(res => {
          let cclist = res.data;
          this.$refs.PriceMajor.cclist = cclist;
          let obj = cclist.find(e => e.size == formDatainputValue.inputValues[inputarr[0]] + 'x' + formDatainputValue.inputValues[inputarr[1]]);
          this.$refs.PriceMajor.ccdata = obj.id;
          this.$refs.PriceMajor.tgclick && this.$refs.PriceMajor.tgclick(obj);
        });
      }

      if (_this.$route.query.cateId == 1) {
        _this.getpaperId();
        _this.priceValuation2();
      } else {
        _this.priceValuation();
      }

      let arr = formDatainputValue.goodAttr.split(';');
      arr.forEach(e => {
        if (e.indexOf('纸张材质') != -1) {
          _this.$set(_this, 'dataval', e);
          _this.$refs?.PriceRight?.setradio(e);
        }
      });

      _this.$set(_this.formData, 'bqys', o.bqys);
      // _this.getprice();
      // 回显完成后 清空数据
      this.commonFormDatainputValue = null;
      this.formDatainputValue = null;
    }
  },
  mounted() {
    this.getOpenMessage();
    let cateId = this.$route.query.cateId;
    let subCateId = this.$route.query.subCateId;
    if (cateId === '3' || (cateId === '70' && subCateId === '85') || this.$route.query.isnum) {
      // 精装盒，刀卡 共同不需要初始化
      return;
    }
    // this.sendOpenMessage('getIframeInfo')
    // 重新初始数据，以便精装盒整体配件使用
    let numberObj = this.commonVoList.find(e => e.code == 'YSSL');
    this.$set(this.commonFormData.inputValues, `${numberObj?.attrList[0]?.groupId}_${numberObj?.attrList[0]?.id}`, 5000);
    if (this.$route.path.indexOf('proof') != -1) {
      this.$set(this.priceFormData, 'yssl', 1); //给印刷数量添加一个默认值
    } else if (cateId == '10') {
      this.$set(this.priceFormData, 'yssl', 5000); //给印刷数量添加一个默认值
    } else {
      this.$set(this.priceFormData, 'yssl', 1000); //给印刷数量添加一个默认值
    }

    this.$set(this.commonFormData.inputValues, '5050_5051', '1');
    // 不用额外添加 每套数量字段
    if (cateId === '100' && this.$route.query.isCms) {
      return;
    }

    let size = this.commonVoList.find(e => e.code === 'SIZE' || e.code === 'BJ1_SIZE');
    let mtsl = { groupType: 'input', name: '每套数量', code: 'MTSL', id: 5050, attrList: [{ id: 5051, code: 'MTSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5050 }] };
    // 精装盒牛油纸
    if (this.$route.query.cateId == '152' && this.$route.query.subCateId == '153') {
      mtsl = { groupType: 'input', name: '每套数量', code: 'MTSL', id: 5050, attrList: [{ id: 5051, code: 'MTSL', defaultValue: '0', suffix: '张', name: '张', inputTips: '张', groupId: 5050 }] };
    }
    // 非双驳盒 非外箱
    if (!(cateId === '2' && subCateId === '31') || !cateId === '70') {
      this.commonVoList = [];
      size && this.commonVoList.push(size);
    }
    mtsl && this.commonVoList.push(mtsl);
  }
};

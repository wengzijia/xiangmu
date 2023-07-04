import { priceInitUtil, radioSelect2, checkboxSelect2, commonValuation } from '../price/goodPriceUtil';
import { quickInitUtil } from '../price/quickPriceUtil';
import { craftInitUtil } from '../price/craftUtil';
import goodsSizeInfo from '../components/goodsSizeInfo.vue';
export default {
  components: {
    goodsSizeInfo
  },
  props: {
    baseIds: {
      type: Object,
      default: () => {
        return {
          cateId: '1',
          subCateId: '15',
          goodsId: ''
        };
      }
    },
    oldFormData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    activeCustomId: Number,
    customId: Number
  },
  data() {
    return {
      // 成品尺寸和展开尺寸信息
      goodsSizeInfo: {
        name: '',
        value: ''
      }
    };
  },
  watch: {
    activeCustomId: function(newVal) {
      console.log('dddd', this);
      if (newVal === this.customId) {
        priceInitUtil(this);
        quickInitUtil(this);
        craftInitUtil(this);
      }
    }
  },
  methods: {
    setFormData(commonFormDatainputValue, formDatainputValue) {
      console.log('数据回显', commonFormDatainputValue, formDatainputValue);
      let _this = this;

      if (!commonFormDatainputValue || !formDatainputValue) {
        return;
      }
      if (this.cateId === '3') {
        // 精品盒回显
        _this.$set(_this, 'priceFormData', commonFormDatainputValue);
        _this.$set(_this, 'inputdata', formDatainputValue.inputdata); // 子集输入框
        _this.$set(_this, 'radiodata', formDatainputValue.radiodata);
        _this.$set(_this, 'checkdata', formDatainputValue.checkdata);
        _this.$set(_this, 'selectdata', formDatainputValue.selectdata);
        // _this.$set(_this, 'data2', formDatainputValue.data2);
        // _this.$set(_this, 'data', formDatainputValue.data);
        return;
      }
      if (_this.formVoList.length == 0) {
        return;
      }
      if (this.cateId === '10') {
        // 铁盒标识符
        _this.$set(_this, 'hxid', formDatainputValue.hxid);
      }
      let o = formDatainputValue;
      // console.log('commonFormDatainputValue', commonFormDatainputValue, JSON.parse(_this.commonFormDatainputValue));
      _this.$set(_this, 'commonFormData', commonFormDatainputValue);
      console.log('_this.voList', _this.voList);
      for (const vo of _this.voList) {
        // radio单选
        if (vo.miniZtAttrGroup.id && o.radioSelectValues[vo.miniZtAttrGroup.id]) {
          _this.$set(_this.formData.radioSelectValues, vo.miniZtAttrGroup.id, o.radioSelectValues[vo.miniZtAttrGroup.id]);
          _this.radioSelect2(o.radioSelectValues[vo.miniZtAttrGroup.id]);
        }
        // checkbox  复选
        if (vo.miniZtAttrGroup.id && o.checkBoxSelectValues[vo.miniZtAttrGroup.id] && o.checkBoxSelectValues[vo.miniZtAttrGroup.id].length > 0) {
          for (let index = 0; index < o.checkBoxSelectValues[vo.miniZtAttrGroup.id].length; index++) {
            if (!_this.formData.checkBoxSelectValues[vo.miniZtAttrGroup.id]) {
              _this.$set(_this.formData.checkBoxSelectValues, vo.miniZtAttrGroup.id, []);
            }
            _this.formData.checkBoxSelectValues[vo.miniZtAttrGroup.id].push(o.checkBoxSelectValues[vo.miniZtAttrGroup.id][index]);
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
          }
        }
      }
      console.log('goodSize', o.goodSize);
      _this.$set(_this.formData, 'goodSize', o.goodSize);
      _this.$set(_this.formData, 'goodSizeTwo', o.goodSizeTwo);

      if (_this.cateId == 1) {
        _this.getpaperId();
        _this.priceValuation2();
      } else {
        _this.priceValuation();
      }
      _this.$set(_this.formData, 'bqys', o.bqys);
      commonValuation().then(res => {
        console.log('dcccccccccccccccccc', res);
        let arr = res.split(':');
        if (arr.length > 1) {
          _this.goodsSizeInfo = {
            name: arr[0],
            value: arr[1].replace(/_/g, 'X').replace(/;/g, 'mm'),
            goodSize: o.goodSize
          };
        }
      });
    },
    ...{ radioSelect2, checkboxSelect2 }
  }
};

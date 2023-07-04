import { radioSelect2, checkboxSelect2 } from '@/utils/price/goodPriceUtil';

export default {
  data() {
    return {
      // tabType: '1',
      commonFormDatainputValue: '{"inputValues":{"5000_5001":"100","9000_9001":"1","100_101":"100","100_102":"100","100_103":"100"}}',
      formDatainputValue:
        '{"cateName":"卡纸盒","subCateName":"双插盒","showMsg":true,"loading":false,"zcjgpb":"","inputValues":{"8275_34025":"100","8275_34026":"100","100008275_100034025":"200","100008275_100034026":"200","4860_23112":"111","4860_23113":"111","100004860_100023112":"222","100004860_100023113":"222"},"radioSelectValues":{"4757":"4757_22623","4758":"4758_22624","4759":"4759_22625","4760":"4760_22628","4859":"4859_23099","6763":"6763_30154","6764":"6764_30160","6996":"6996_30799","100004859":"100004859_100023099","100004860":"100004860_100023112","100008275":"100008275_100034025"},"checkBoxSelectValues":{"4858":["4858_34000","4858_23098"],"4859":[],"4860":[],"4861":[],"4863":[],"4864":[],"4866":[],"4867":[],"4868":[],"4869":[],"4871":[],"4874":[],"8262":["8262_34024"]},"oldCheckBoxSelectVals":{"4858":["4858_34000","4858_23098"],"4859":[],"4860":[],"4861":[],"4863":[],"4864":[],"4866":[],"4867":[],"4868":[],"4869":[],"4871":[],"4874":[],"8262":["8262_34024"]},"selectSelectValues":{},"yslx":"dm","dmys":{"scCount":0,"pantoneList":[],"pantone":"","jybm":false,"jybmVal":false,"jybm2":false},"zmys":{"scCount":0,"pantoneList":[],"pantone":"","jybm":false,"jybmVal":false,"jybm2":false},"fmys":{"scCount":0,"pantoneList":[],"pantone":"","jybm":false,"jybmVal":false,"jybm2":false},"bqys":{"scCount":0,"pantoneList":[],"pantone":"","jybm":false,"jybmVal":false,"jybm2":false},"ysm":{"scCount":1,"value":"","list":[{"widthVal":0,"longVal":0},{"widthVal":0,"longVal":0},{"widthVal":0,"longVal":0},{"widthVal":0,"longVal":0},{"widthVal":0,"longVal":0},{"widthVal":0,"longVal":0}]},"sgYsys":{"scCount":0,"pantoneList":[],"pantone":"","jybm":false,"jybmVal":false,"jybm2":false},"xgYsys":{"scCount":0,"pantoneList":[],"pantone":"","jybm":false,"jybmVal":false,"jybm2":false},"showLoginDialog":false,"goodSize":{"goodAl":"415.00","goodAw":"330.00","otherMap":{}},"goodAttr":"成品尺寸:100_100_100;展开尺寸:415.00_330.00;印刷:单面印刷;印刷颜色:多色_CMYK;表面处理:哑胶;背面处理:无;烫金1:Foil 金色_111_111;烫金2:Foil 金色_222_222;局部UV1:100_100;局部UV2:200_200;1;粘合:自动粘1处;纸张材质:单铜纸_325;材质标识:4759_22625;","goodAttrVo":{"id":938,"coverPath":"/uploads/picture/20190125/a5e83f555cf83ca55a41587426ef1ab9.png","goodAl":1,"goodAw":1,"goodAd":1,"goodAt":0,"goodAx":0,"goodAh":0,"goodAr":0,"goodAlMin":12,"goodAlMax":300,"goodAwMin":12,"goodAwMax":200,"goodAdMin":40,"goodAdMax":400,"goodAtMin":null,"goodAtMax":null,"goodAxMin":null,"goodAxMax":null,"goodAhMin":null,"goodAhMax":null,"goodArMin":null,"goodArMax":null},"appendsDesc":{"goodAl":"x","goodAw":"x","goodAd":"mm","goodAt":"x","goodAx":"x","goodAh":"x","goodAr":"x"},"goodSizeTwo":{"goodAl":0,"goodAw":0,"otherMap":{}}}'
    };
  },
  methods: {
    ...{ radioSelect2, checkboxSelect2 },
    testData(commonFormDatainputValue, formDatainputValue) {
      let _this = this;
      if (!commonFormDatainputValue || !formDatainputValue) {
        return;
      }
      let o = formDatainputValue;
      console.log('commonFormDatainputValue', JSON.parse(_this.commonFormDatainputValue));
      _this.$set(_this, 'commonFormData', commonFormDatainputValue);

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
      if (_this.$route.query.cateId == 1) {
        _this.getpaperId();
        _this.priceValuation2();
      } else {
        _this.priceValuation();
      }
      _this.$set(_this.formData, 'bqys', o.bqys);
    }
    // getattrfn() {
    //   getAttr({ po_sn: this.$route.query.po_sn }).then((res) => {
    //     console.log('getattr', res);
    //     this.commonFormDatainputValue=JSON.stringify(res.data.commonFormData)
    //     this.formDatainputValue=JSON.stringify(res.data.formData)
    //     this.testData()
    //   });
    // },
  }
};

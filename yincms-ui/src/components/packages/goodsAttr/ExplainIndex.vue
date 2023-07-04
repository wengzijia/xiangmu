<!-- fengjianbo -->
<template>
  <div>
    <el-row>
      <el-col v-loading="formData.loading">
        <div class="guigeLt">
          <goods-size-info :goodsSizeInfo="goodsSizeInfo"></goods-size-info>
          <!-- 专业计价 -->
          <price-major-group
            :priceValuation="priceValuation"
            :removeCopyGroupCk="removeCopyGroupCk"
            :addCopyGroupCk="addCopyGroupCk"
            :radioSelect="radioSelect"
            :addCopyGroupRd="addCopyGroupRd"
            :removeCopyGroupRd="removeCopyGroupRd"
            :selectSelect="selectSelect"
            :checkboxSelect="checkboxSelect"
            :form-data.sync="formData"
            :form-vo-list.sync="formVoList"
            :group-vo-list.sync="groupVoList"
            :bindType="bindType"
            :baseIds="baseIds"
          ></price-major-group>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getVoList, getBySubBindId, getByGoodsId, computeSize } from '@/api/product/attrApi';
import {
  priceInitUtil,
  addCopyGroupCk,
  removeCopyGroupCk,
  addCopyGroupRd,
  removeCopyGroupRd,
  commonDataChange,
  checkboxSelect,
  selectSelect,
  radioSelect,
  addCart,
  addQuote,
  getCommonVoList,
  getSubName,
  commonValuation,
  numberChange,
  otherInputChange,
  getGoodAttrInfo,
  cateChange,
  getPagerCate,
  reSetSize,
  loadCommonDefault,
  priceSynFunction
} from './price/goodPriceUtil';
import { defaultFormData, defaultPriceFormData, radioSelect2, checkboxSelect2 } from './price/goodPriceUtil';
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { craftInitUtil, isCopyCraft } from './price/craftUtil';
import PriceMajorGroup from './components/PriceMajorGroup';
import { getAreaName } from '@/utils/city';
import { priceInvoke } from '@/api/price/priceApi';
import { debounce } from '@/utils/utils';
import setFormData from './mixins/setFromData.js';
export default {
  mixins: [setFormData],
  name: 'ExplainIndex',

  components: {
    PriceMajorGroup
  },
  data() {
    return {
      ...JSON.parse(JSON.stringify(defaultFormData)),
      bindType: 'cate', // 绑定类型,cate:商品计价
      fixedstatus: 'false',
      fixednum: 0,
      marginnum: 0,
      divheight: 0
    };
  },
  async created() {
    let _this = this;
    _this.cateId = _this.baseIds.cateId;
    _this.subCateId = _this.baseIds.subCateId;
    _this.goodsId = _this.baseIds.goodsId;
    _this.whereBindId = _this.subCateId;
    priceInitUtil(_this);
    craftInitUtil(_this);
    _this.initPage();
    await cateChange();
    // 调用了getBySubBindId(获取商品),并在接口那边赋值
    await getGoodAttrInfo();
    reSetSize();

    // setTimeout(()=>{
    // _this.setFormData({"inputValues":{"5000_5001":"100","100_101":"100","100_102":"100"}}, JSON.parse(JSON.stringify(_this.oldFormData)));
    // },2000)
    if (_this.oldFormData.commonFormDatainputValue) {
      let formData = JSON.parse(JSON.stringify(_this.oldFormData));
      _this.setFormData(formData.commonFormDatainputValue, JSON.parse(JSON.stringify(formData.formDatainputValue)));
    }
  },
  mounted() {
    // const scrollDiv = document.querySelector('body');
    // this.divheight = document.querySelector('.guigeLt').clientHeight;
    // // const fixedstatus = document.querySelector('.fixedstatus').clientHeight;
    // this.fixednum = document.querySelector('.fixedstatus').clientHeight;
    // const divclass = document.querySelector('.guigeRtWrap');
    // let _this = this;
    // scrollDiv.onscroll = function() {
    //   if (_this.divheight > _this.fixednum + 50) {
    //     if (document.documentElement.scrollTop > 350) {
    //       divclass.classList.add('fixedclass');
    //       if (document.documentElement.scrollTop > _this.divheight - _this.fixednum + 350) {
    //         divclass.classList.remove('fixedclass');
    //         // fixedstatus.style.marginTop = _this.divheight - 594 + 'px';
    //         _this.marginnum = _this.divheight - _this.fixednum;
    //       } else {
    //         // fixedstatus.style.marginTop = 0;
    //         _this.marginnum = 0;
    //       }
    //       // console.log(this.fixedstatus)
    //     } else {
    //       divclass.classList.remove('fixedclass');
    //     }
    //   }
    // };
  },
  watch: {
    subCateId: {
      async handler() {
        // this.whereBindId = this.subCateId;
        // this.formVoList = [];
        // this.voList = [];
        // await cateChange();
        // // 调用了getBySubBindId(获取商品),并在接口那边赋值
        // await getGoodAttrInfo();
        // reSetSize();
        // setTimeout(()=>{
        // this.divheight = document.querySelector('.guigeLt').clientHeight;
        // this.fixednum = document.querySelector('.fixedstatus').clientHeight;
        // console.log('watch', this.divheight);
        // },0)
      }
    }
  },
  methods: {
    ...{ startWith, endWith },
    ...{ addCopyGroupCk, removeCopyGroupCk, addCopyGroupRd, removeCopyGroupRd, addCart, addQuote, numberChange, otherInputChange, checkboxSelect, selectSelect, radioSelect },
    ...{ isCopyCraft },
    /**
     * 初始化页面数据
     */
    initPage() {
      getPagerCate();
      this.whereBindId = this.subCateId;
      this.commonVoList = getCommonVoList(this.cateId, this.subCateId);
      this.clearData();
      reSetSize();
      getSubName();
      if (strEquals(this.cateId, '13')) {
        this.formData.dmys.jybm = true;
      }
    },
    /**
     * 清理数据
     */
    clearData() {
      this.$set(this, 'formVoList', []);
      this.$set(this, 'voList', []);
      this.$set(this, 'formData', JSON.parse(JSON.stringify(defaultFormData.formData)));
      this.$set(this, 'commonFormData', JSON.parse(JSON.stringify(defaultFormData.commonFormData)));
      this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(defaultPriceFormData)));
      loadCommonDefault();
    },
    /**
     * 潘通色修改
     */
    pantoneChange() {
      this.priceValuation();
    },
    /**
     * 印刷数量校验并更正为最小值
     */
    ysslCheck() {
      let that = this;
      let val = that.priceFormData.yssl;
      let yssl = that.commonVoList.find(e => e.code === 'YSSL');
      let attr = yssl.attrList[0];
      let data = {
        data: that.commonFormData.inputValues,
        dataKey: attr.groupId + '_' + attr.id
      };
      if (strEquals(that.subCateId, '51') || strEquals(that.subCateId, '120')) {
        if (parseInt(val) < 1000) {
          data.data[data.dataKey] = '1000';
        } else {
          data.data[data.dataKey] = '' + Math.ceil(parseInt(val) / 1000) * 1000;
        }
      } else if (strEquals(that.subCateId, '52')) {
        if (parseInt(val) < 1000) {
          data.data[data.dataKey] = '1000';
        } else {
          data.data[data.dataKey] = '' + Math.ceil(parseInt(val) / 1000) * 1000;
        }
      } else if (strEquals(that.subCateId, '55')) {
        const attr = [100, 200, 500, 1000, 2000, 3000, 5000, 10000];
        if (parseInt(val) > 10000) {
          if (parseInt(val) % 100 != 0) {
            data.data[data.dataKey] = '100';
            that.$message({ type: 'error', message: '数量必须是100的整数倍数' });
          }
        } else {
          for (let i = 0; i < attr.length; i++) {
            if (parseInt(val) <= attr[i]) {
              data.data[data.dataKey] = attr[i] + '';
              break;
            }
          }
        }
      } else if (strEquals(that.cateId, '70') || strEquals(that.subCateId, '36') || strEquals(that.subCateId, '37') || strEquals(that.subCateId, '38')) {
        if (strEquals(that.subCateId, '85') || strEquals(that.subCateId, '96')) {
          if (parseInt(val) < 1) {
            that.$message({ type: 'error', message: '1个起印' });
            data.data[data.dataKey] = '1';
          }
        } else {
          if (parseInt(val) < 50) {
            that.$message({ type: 'error', message: '50个起印' });
            data.data[data.dataKey] = '50';
          }
        }
      } else if (strEquals(that.cateId, '5') && strEquals(that.subCateId, '40')) {
        if (parseInt(val) < 1) {
          that.$message({ type: 'error', message: '1个起印' });
          data.data[data.dataKey] = '1';
        }
      } else if (strEquals(that.subCateId, '48')) {
        if (parseInt(val) < 1) {
          that.$message({ type: 'error', message: '1个起印' });
          data.data[data.dataKey] = '1';
        }
      } else if (strEquals(that.subCateId, '82')) {
        if (parseInt(val) < 500) {
          data.data[data.dataKey] = '500';
          that.$message({ type: 'error', message: '500个起印' });
        } else {
          console.log(Math.ceil(parseInt(val) / 500) * 500);
          data.data[data.dataKey] = '' + Math.ceil(parseInt(val) / 500) * 500;
        }
      } else if (strEquals(that.cateId, '86') || strEquals(that.cateId, '121')) {
        if (parseInt(val) < 1) {
          data.data[data.dataKey] = '1';
          that.$message({ type: 'error', message: '箱数不能小于1' });
        }
      } else if (strEquals(that.cateId, '10')) {
        if (parseInt(val) < 5000) {
          data.data[data.dataKey] = '5000';
          that.$message({ type: 'error', message: '5000个起印' });
        }
      } else if (parseInt(val) < 100) {
        that.$message({ type: 'error', message: '100个起印' });
        data.data[data.dataKey] = '100';
      }
      // if (strEquals(that.cateId, '10')) {
      //   if (parseInt(val) > 5000) {
      //     data.data[data.dataKey] = '' + Math.ceil(parseInt(val) / 500) * 500;
      //   }
      // }
      if (strEquals(that.cateId, '6') && strEquals(that.subCateId, '101')) {
        if (parseInt(val) > 3000) {
          that.$message({ type: 'error', message: '订购数量不能超过3000个' });
          data.data[data.dataKey] = 3000;
        }
      }
      return data.data[data.dataKey];
    },
    /**
     * 计价方法
     */
    async priceValuation(dataval, val, unit, id) {
      // 折页说明书限制折叠次数不能超10折
      if (this.subCateId == '47' && val > 10 && id) {
        this.$message({ type: 'error', message: '最大不能超过10折' });
        this.formData.inputValues[id] = 10;
      }
      await priceSynFunction(this.priceValuationNew);
    },
    priceValuationNew: debounce(async function() {
      if (!this.formData.goodAttrVo.id) {
        return false;
      }
      const _this = this;
      const provinceId = _this.priceFormData.provinceId;
      const cityId = _this.priceFormData.cityId;
      const yssl = _this.priceFormData.yssl;
      const tkks = _this.priceFormData.tkks;
      const extendsStr = _this.priceFormData.extends;
      _this.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      _this.priceFormData.provinceId = provinceId;
      _this.priceFormData.cityId = cityId;
      _this.priceFormData.yssl = yssl;
      _this.priceFormData.tkks = tkks;
      _this.priceFormData.extends = extendsStr;
      _this.priceFormData.priceProgress = true;
      let isVerify = false;
      let strVal = '';
      if (this.commonVoList.length > 0) {
        strVal = await commonValuation();
        if (strVal) {
          if (this.formData.goodSize.goodAl > 0) {
            strVal += '展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
          }
          if (strEquals(this.cateId, '3') && this.formData.goodSize.otherMap.outlong) {
            const otherMap = this.formData.goodSize.otherMap;
            strVal += '天盒面纸展开尺寸:' + otherMap.longFaceTop + '_' + otherMap.widthFaceTop + ';';
            strVal += '天盒灰板展开尺寸:' + otherMap.longGreyTop + '_' + otherMap.widthGreyTop + ';';
            strVal += '地盒面纸展开尺寸:' + otherMap.longFaceBut + '_' + otherMap.widthFaceBut + ';';
            strVal += '地盒灰板展开尺寸:' + otherMap.longGreyBut + '_' + otherMap.widthGreyBut + ';';
            strVal += '成品外尺寸:' + otherMap.outlong + '_' + otherMap.outwidth + '_' + otherMap.outheight + ';';
          }
          isVerify = true;
        }
      } else {
        isVerify = true;
      }

      if (isVerify) {
        let attrList = [];
        for (let i = 0; i < this.formVoList.length; i++) {
          const item = this.formVoList[i];
          if (this.formVoList[i].miniZtAttrGroup.code === 'SIZE') {
            attrList = this.formVoList[i].attrList;
          } else if (this.formVoList[i].miniZtAttrGroup.code === 'YSSL') {
            const attrItem = this.formVoList[i].attrList[0];
            const inputValue = this.formData.inputValues[attrItem.groupId + '_' + attrItem.id];
            if (!inputValue || parseInt(inputValue) === 0) {
              return false;
            }
          }
          if (item.miniZtAttrGroup.required === 1) {
            if (item.miniZtAttrGroup.groupType === 'input') {
              for (let j = 0; j < item.attrList.length; j++) {
                const attrItem = item.attrList[j];
                const inputValue = this.formData.inputValues[attrItem.groupId + '_' + attrItem.id];
                if (!inputValue) {
                  return;
                }
              }
            }
          }
        }
        if (attrList.length > 0) {
          let resultData = { success: true };
          let reqParam = { id: this.formData.goodAttrVo.id };
          for (let j = 0; j < attrList.length; j++) {
            if (this.formData.inputValues[attrList[j].groupId + '_' + attrList[j].id]) {
              if (attrList[j].code === 'CPCC_L') {
                if (this.formData.inputValues[attrList[j].groupId + '_' + attrList[j].id]) {
                  reqParam['goodAl'] = this.formData.inputValues[attrList[j].groupId + '_' + attrList[j].id];
                } else {
                  return false;
                }
              } else if (attrList[j].code === 'CPCC_W') {
                if (this.formData.inputValues[attrList[j].groupId + '_' + attrList[j].id]) {
                  reqParam['goodAw'] = this.formData.inputValues[attrList[j].groupId + '_' + attrList[j].id];
                } else {
                  return false;
                }
              }
            }
          }
          resultData = await computeSize(reqParam).then(res => {
            return res;
          });
          if (resultData.success) {
            this.$set(this.formData.goodSize, 'goodAl', resultData.data.goodAl);
            this.$set(this.formData.goodSize, 'goodAw', resultData.data.goodAw);
          }
          if (this.formData.goodSize.goodAl > 0) {
            strVal += '展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
          }
        }
        const dataResult = await this.dataChange();
        if (dataResult) {
          strVal += dataResult;
        } else {
          _this.priceFormData.priceProgress = false;
          console.log('错了');
          this.$emit('setGoodsAttr', '');
          return false;
        }
        if (this.subCateId === '47' && strVal.indexOf('折叠次数') === -1) {
          if (strVal.indexOf('折页方式:十字折') !== -1) {
            strVal += '折叠次数:2;';
          } else {
            strVal += '折叠次数:1;';
          }
        } else if (strEquals(this.cateId, '9') && strEquals(this.subCateId, '46')) {
          if (strVal.indexOf('开孔形状:') === -1) {
            strVal += '开孔形状:不开孔;';
          }
          if (strVal.indexOf('开孔数:') === -1) {
            strVal += '开孔数:0;';
          }
        }
        if (!strEquals(this.cateId, '3')) {
          strVal = this.sortAttrStr(strVal, '展开尺寸:');
          strVal = this.sortAttrStr(strVal, '成品尺寸:');
        }

        strVal += '0;';
        let city = '';
        if (this.priceFormData.provinceId !== '') {
          city += getAreaName('province', this.priceFormData.provinceId);
        }
        if (this.priceFormData.cityId !== '') {
          if (city !== '') {
            city += ' ';
          }
          city += getAreaName('city', this.priceFormData.cityId);
        }
        if (strEquals(this.cateId, '81') && strEquals(this.subCateId, '82')) {
          strVal = '品类:注塑杯' + strVal;
          if (strVal.indexOf('印刷颜色:无') == '-1' || strVal.indexOf('专色') != '-1') {
            if (parseInt(_this.priceFormData.yssl) < 5000) {
              _this.commonFormData.inputValues['5000_5001'] = 5000;
              _this.priceFormData.yssl = 5000;
              this.$message({ type: 'error', message: '定制5000个起订' });
            }
          }
          var PrintColor = 0;
          var SpotColor = 0;
          if (strVal.indexOf('印刷颜色:单色') != -1) {
            PrintColor = 1;
          } else if (strVal.indexOf('印刷颜色:双色') != -1) {
            PrintColor = 2;
          } else if (strVal.indexOf('印刷颜色:三色') != -1) {
            PrintColor = 3;
          } else if (strVal.indexOf('印刷颜色:多色') != -1) {
            PrintColor = 4;
          }
          if (strVal.indexOf('专色:1') != -1) {
            SpotColor = 1;
          } else if (strVal.indexOf('专色:2') != -1) {
            SpotColor = 2;
          } else if (strVal.indexOf('专色:3') != -1) {
            SpotColor = 3;
          } else if (strVal.indexOf('专色:4') != -1) {
            SpotColor = 4;
          } else if (strVal.indexOf('专色:5') != -1) {
            SpotColor = 5;
          } else if (strVal.indexOf('专色:6') != -1) {
            SpotColor = 6;
          }
          if (PrintColor + SpotColor > 6) {
            this.$message({ type: 'error', message: '印刷颜色不能大于六种色，请调整印刷颜色' });
            _this.priceFormData.priceProgress = false;
            return false;
          }
        }
        console.log(strVal);
        let yssl2 = this.ysslCheck();
        if (Number(yssl2) > Number(this.priceFormData.yssl)) this.priceFormData.yssl = yssl2;
        _this.priceFormData.priceProgress = false;
        this.$emit('setGoodsAttr', strVal);

        // priceInvoke({ goodsId: this.formData.goodAttrVo.id, goodsAttr: strVal, number: this.priceFormData.yssl, fnumber: this.priceFormData.tkks, cextends: this.priceFormData.extends, city: city })
        //   .then(res => {
        //     if (res.code === '970006') {
        //       this.formData.showLoginDialog = true;
        //     } else {
        //       this.priceFormData = Object.assign({}, this.priceFormData, res.data);
        //       this.formData.goodAttr = strVal;
        //     }
        //     _this.priceFormData.priceProgress = false;
        //   })
        //   .catch(res => {
        //     _this.formData.goodAttr = strVal;
        //     _this.priceFormData.priceProgress = false;
        //   });
      } else {
        _this.priceFormData.priceProgress = false;
      }
    }, 500),
    sortAttrStr(strVal, attrName) {
      if (strVal.indexOf(attrName) !== -1) {
        const attrStartIndex = strVal.indexOf(attrName);
        const attrEndIndex = strVal.indexOf(';', attrStartIndex);
        const newStr = strVal.substring(attrStartIndex, attrEndIndex + 1) + strVal.substring(0, attrStartIndex) + strVal.substring(attrEndIndex + 1);
        return newStr;
      }
      return strVal;
    },
    /**
     * 数据修改
     */
    async dataChange() {
      let strVal = await commonDataChange();
      return strVal;
    }
  }
};
</script>
<style>
.fixedclass {
  position: fixed;
  top: 46px;
  background: #fff;
  z-index: 99;
  border: 1px solid #dbe0e4;
}
</style>

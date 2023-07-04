<!-- fengjianbo -->
<template>
  <div v-resize="monResize">
    <el-row>
      <el-col v-loading="formData.loading">
        <div class="comBox guigeBox cardBox needhide">
          <div class="guigeLt">
            <!-- 公用部分 -->
            <price-common
              v-if="isFlat"
              :number-change="numberChange"
              :addCommonSize="addCommonSize"
              :removeCommonSize="removeCommonSize"
              :otherInputChange="otherInputChange"
              :form-data.sync="formData"
              :common-form-data.sync="commonFormData"
              :common-vo-list.sync="commonVoList"
              :price-valuation="priceValuation"
            ></price-common>
            <!-- 专业报价 -->
            <price-major
              :priceValuation="priceValuation"
              :removeCopyGroupCk="removeCopyGroupCk"
              :addCopyGroupCk="addCopyGroupCk"
              :addCopyGroupRd="addCopyGroupRd"
              :removeCopyGroupRd="removeCopyGroupRd"
              :radioSelect="radioSelect"
              :selectSelect="selectSelect"
              :checkboxSelect="checkboxSelect"
              :form-data.sync="formData"
              :form-vo-list.sync="formVoList"
              :bindType="bindType"
              :disabledObj="disabledObj"
            ></price-major>
          </div>
          <price-right v-if="!isCMS" class="fixedstatus" :style="'margin-top:' + marginnum + 'px'" :priceFormData.sync="priceFormData" :addCart="addCart" :addQuote="addQuote" :priceValuation="priceValuation"></price-right>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  priceInitUtil,
  addCopyGroupCk,
  removeCopyGroupCk,
  addCopyGroupRd,
  removeCopyGroupRd,
  commonValuation,
  commonDataChange,
  checkboxSelect,
  selectSelect,
  radioSelect,
  getCommonVoList,
  getSubName,
  reSetSize,
  getCateVoList,
  getPagerCate,
  cateChange,
  getGoodAttrInfo,
  numberChange,
  otherInputChange,
  addCart,
  addQuote,
  getAttrValue,
  priceSynFunction,
  addCommonSize,
  removeCommonSize,
  checkboxSelect2,
  radioSelect2
} from '@/utils/price/goodPriceUtil';
import { defaultFormData, defaultPriceFormData } from '@/utils/price/goodPriceUtil';
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { craftInitUtil, isCopyCraft } from '@/utils/price/craftUtil';
import LoginForm from '@/components/common/LoginForm';
import PriceRight from '@/components/price/PriceRight';
import PriceMajor from '@/components/price/PriceMajor';
import PriceCommon from '@/components/price/PriceCommon';
import { getAreaName } from '@/utils/city';
import { quickInitUtil, quickRadioClick, quickViewCartonLists } from '@/utils/price/quickPriceUtil';
import { debounce, diffTime } from '@/utils/utils';
import entiretyIframe from './mixins/entiretyIframe';
import { priceInvoke } from '@/api/price/priceApi';
import { checkToken } from '@/api/users/userApi';

export default {
  components: {
    PriceRight,
    PriceMajor,
    PriceCommon
  },
  mixins: [entiretyIframe],
  data() {
    return {
      ...JSON.parse(JSON.stringify(defaultFormData)),
      bindType: 'cate', // 绑定类型,cate:商品计价
      isCommonSize: false,
      quickVoList: JSON.parse(JSON.stringify(quickViewCartonLists)), // 快捷报价属性
      quickFormData: { radioSelectValues: {} },
      ysm: {
        scCount: 1,
        value: '',
        list: [
          { widthVal: 0, longVal: 0 },
          { widthVal: 0, longVal: 0 },
          { widthVal: 0, longVal: 0 },
          { widthVal: 0, longVal: 0 },
          { widthVal: 0, longVal: 0 },
          { widthVal: 0, longVal: 0 }
        ]
      },
      zmys: {
        scCount: 0,
        pantoneList: [],
        pantone: '',
        jybm: false,
        jybmVal: false,
        jybm2: false
      },
      fixedstatus: 'false',
      marginnum: 0,
      fixednum: 0,
      divheight: 0,
      isCMS: false, // 判断是否为后台显示,后台显示部分模块
      isFlat: true,
      disabledObj: {
        disabledArr: [],
        pDisabledArr: [],
        pass: []
      }
    };
  },
  created() {
    if (this.$route.path === '/isCms/cartonIndex') {
      this.isCMS = true;
      localStorage.setItem('Access-Token', this.$route.query.token);
      checkToken().then(res => {
        if (res.code === '970007') {
          window.parent.postMessage({ cmd: 'getToken', params: {} }, '*');
          return;
        }
      });
    }
    if (!this.$route.query.cateId) {
      this.$router.push({ path: '/isCms/cartonIndex?cateId=1&subCateId=15' });
    }
    if (this.$route.query.flat === 'true') {
      this.isFlat = false;
    }
    // 页面是可编辑
    let cateId = this.$route.query.cateId;
    if (cateId === '70') {
      // 外箱
      this.disabledObj.disabledArr = ['纸张类型', '坑纸类型', '面纸材质', '芯纸', '里纸材质', '外层芯纸', '隔纸', '内层芯纸', '外层隔纸', '中层芯纸', '内层隔纸'];
      // this.disabledObj.pDisabledArr = ['纸张克重/厚度', '纸张材质']
      // this.disabledObj.pass = ['表面处理']
    }

    priceInitUtil(this);
    quickInitUtil(this);
    craftInitUtil(this);
    this.initPage();
    this.tabType = '1';
  },
  watch: {
    $route(to) {
      this.initPage();
      getGoodAttrInfo();
    },
    tabType: {
      handler() {
        //印刷面计算
        if (!this.$route.query.subCateId == '85') {
          if (this.tabType == 0) {
            this.formData.ysm.scCount = 0;
          } else {
            if (this.formData.ysm.scCount == 0) {
              this.formData.ysm.scCount = 1;
            }
          }
        }
        reSetSize();
        this.priceValuation();
        setTimeout(() => {
          if (!this.isCMS) {
            this.divheight = document.querySelector('.guigeLt').clientHeight;
            this.fixednum = document.querySelector('.fixedstatus').clientHeight;
          }
          // console.log('watch',this.divheight)
        }, 0);
      }
    },
    subCateId: {
      async handler() {
        this.whereBindId = this.subCateId;
        this.$set(this, 'formVoList', []);
        this.$set(this, 'voList', []);
        await cateChange();
        await getGoodAttrInfo(true);
        reSetSize();
        // setTimeout(()=>{
        if (!this.isCMS) {
          this.divheight = document.querySelector('.guigeLt').clientHeight;
          this.fixednum = document.querySelector('.fixedstatus').clientHeight;
        }
        // },0)
      }
    }
  },
  methods: {
    ...{ startWith, endWith },
    ...{
      checkboxSelect,
      selectSelect,
      radioSelect,
      removeCopyGroupCk,
      checkboxSelect2,
      radioSelect2,
      addCopyGroupCk,
      getCateVoList,
      numberChange,
      otherInputChange,
      addCart,
      addQuote,
      addCopyGroupRd,
      removeCopyGroupRd,
      addCommonSize,
      removeCommonSize
    },
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
      !this.isCMS && getSubName();
    },
    /**
     * 清理数据
     */
    clearData() {
      this.priceFormData.yssl = 100;
      this.tabType = '0';
      this.$set(this, 'formVoList', []);
      this.$set(this, 'voList', []);
      this.$set(this, 'formData', JSON.parse(JSON.stringify(defaultFormData.formData)));
      if (this.tabType == 0) {
        this.formData.ysm.scCount = 0;
      }
      if (this.$route.query.subCateId == '85') {
        this.ysm.scCount = 0;
        this.formData.ysm.scCount = 0;
        this.$set(this.quickFormData, 'radioSelectValues', { 1: 1 });
      } else {
        this.ysm.scCount = 0;
        // this.$set(this.quickFormData, 'radioSelectValues', { 1: 1, 5: 11, 6: 14, 7: 17 });
        this.$set(this.quickFormData, 'radioSelectValues', { 1: 1, 5: 11, 6: 16 });
      }

      this.zmys.scCount = 0;

      console.log(this.quickFormData);
      this.$set(this, 'commonFormData', JSON.parse(JSON.stringify(defaultFormData.commonFormData)));
      this.loadCommonDefault();
      this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(defaultPriceFormData)));
      quickRadioClick(1);
    },
    loadCommonDefault() {
      for (let i = 0; i < this.commonVoList.length; i++) {
        const commonVo = this.commonVoList[i];
        for (let j = 0; j < commonVo.attrList.length; j++) {
          const attrItem = commonVo.attrList[j];
          if (attrItem.defaultValue !== null && attrItem.defaultValue !== undefined) {
            this.$set(this.commonFormData.inputValues, attrItem.groupId + '_' + attrItem.id, attrItem.defaultValue);
          }
        }
      }
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
      if (!yssl) return '';
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
    async priceValuation() {
      await priceSynFunction(this.priceValuationNew);
    },
    priceValuationNew: debounce(async function() {
      const _this = this;
      const provinceId = _this.priceFormData.provinceId;
      const cityId = _this.priceFormData.cityId;
      const yssl = _this.priceFormData.yssl;
      const tkks = _this.priceFormData.tkks;
      const extendsStr = _this.priceFormData.extends;
      var status = 1;
      _this.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      _this.priceFormData.provinceId = provinceId;
      _this.priceFormData.cityId = cityId;
      _this.priceFormData.yssl = yssl;
      _this.priceFormData.tkks = tkks;
      _this.priceFormData.extends = extendsStr;
      let strVal = await commonValuation();
      _this.priceFormData.priceProgress = true;
      if (strVal) {
        if (strVal === ';') {
          strVal = '';
        }
        if (strEquals(this.cateId, '10')) {
          strVal += '品类:铁罐;';
        } else if (strEquals(this.cateId, '8')) {
          strVal += '品类:胶片盒;';
        } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '39')) {
          strVal += '品类:吸塑内托;';
        } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '36')) {
          strVal += '品类:EVA内托;';
        } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '37')) {
          strVal += '品类:海绵内托;';
        } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '38')) {
          strVal += '品类:珍珠棉内托;';
        } else if (strEquals(this.cateId, '5') && strEquals(this.subCateId, '40')) {
          strVal += '品类:数码不干胶;';
        } else if (strEquals(this.cateId, '5') && strEquals(this.subCateId, '41')) {
          strVal += '品类:传统不干胶;';
        } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '42')) {
          strVal += '品类:传统吊牌;';
        } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '43')) {
          strVal += '品类:数码吊牌;';
        } else if (strEquals(this.cateId, '7') && strEquals(this.subCateId, '55')) {
          strVal += '品类:固定尺寸手提袋;';
        } else if (strEquals(this.cateId, '11') && strEquals(this.subCateId, '51')) {
          strVal += '品类:纸杯;';
        } else if (strEquals(this.cateId, '12') && strEquals(this.subCateId, '52')) {
          strVal += '品类:纸巾盒;';
        } else if (strEquals(this.cateId, '70')) {
          strVal += '品类:外箱;';
        }

        if (this.formData.goodSize.goodAl > 0) {
          if (strEquals(this.subCateId, '85') || strEquals(this.subCateId, '96')) {
            // strVal += '刀卡1展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
          } else {
            strVal += '展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
          }
        }
        // strVal += '成品内尺寸2:66_66;展开尺寸2:96.00_96.00;';
        if (strEquals(this.subCateId, '85')) {
          if (_this.formData.goodSizeTwo.goodAl && _this.formData.goodSizeTwo.goodAw) {
            strVal += '刀卡二尺寸:' + _this.commonFormData.inputValues['200_201'] + '_' + _this.commonFormData.inputValues['200_202'] + ';';
            //strVal += '刀卡2展开尺寸:' + _this.formData.goodSizeTwo.goodAl + '_' + _this.formData.goodSizeTwo.goodAw + ';';
          } else {
            _this.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
            return false;
          }
        }
        const dataResult = await this.dataChange();
        if (dataResult) {
          strVal += dataResult;
        } else {
          _this.priceFormData.priceProgress = false;
          return false;
        }
        if (strEquals(this.cateId, '1')) {
          if (strVal.indexOf('粘合:') === -1) {
            strVal += '粘合:不粘;';
          }
        } else if (strEquals(this.cateId, '2') && strEquals(this.subCateId, '31')) {
          strVal += '驳数:双驳;';
          strVal += '粘合:粘;';
        } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '35')) {
          strVal += '粘合:无;';
        } else if (strEquals(this.cateId, '5') && strEquals(this.subCateId, '40')) {
          strVal += '粘合:无;';
        } else if (strEquals(this.cateId, '5') && strEquals(this.subCateId, '41')) {
          strVal += '粘合:无;';
        } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '43') && strVal.indexOf('开孔形状:不开孔;') !== -1) {
          strVal += '开孔数:0;';
        } else if (strEquals(this.cateId, '9') && strEquals(this.subCateId, '46')) {
          strVal += '开孔形状:不开孔;开孔数:0;';
        }

        if (strEquals(this.cateId, '70') && this.formData.ysm.scCount > 0) {
          for (let i = 0; i < this.formData.ysm.scCount; i++) {
            const item = this.formData.ysm.list[i];
            if (item.longVal && item.widthVal) {
              strVal += '实际印刷尺寸' + (i + 1) + ':' + item.longVal + '_' + item.widthVal + ';';
            } else {
              this.$message({ type: 'error', message: '请将实际印刷尺寸填写完整' });
              status = 0;
            }
          }
        }
        if (strEquals(this.cateId, '70') || (strEquals(this.cateId, '2') && strEquals(this.subCateId, '31'))) {
          strVal = getAttrValue(this.cateId, this.subCateId, strVal);
          if (strEquals(this.subCateId, '85') || strEquals(this.subCateId, '96')) {
            strVal += ';';
          }
        }
        strVal += this.priceFormData.extends + ';';

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
        strVal = this.sortAttrStr(strVal, '品类:');
        console.log(strVal);
        if (status == 1) {
          let yssl2 = this.ysslCheck();
          if (Number(yssl2) > Number(this.priceFormData.yssl)) this.priceFormData.yssl = yssl2;
          _this.priceFormData.total_price = 1;
          let extend = this.priceFormData.extends;
          // if (this.$route.query.isnum) {
          //   let newTime = diffTime(extend, this.priceFormData.yssl, strVal, this.$route.query.cateId);
          //   let oldStr = ';' + extend + ';';
          //   let newStr = ';' + newTime + ';';
          //   extend = newTime;
          //   _this.priceFormData.extends = newTime;
          //   strVal = strVal.replace(oldStr, newStr);
          // }
          priceInvoke({ goodsId: this.formData.goodAttrVo.id, goodsAttr: strVal, number: this.priceFormData.yssl, fnumber: this.priceFormData.tkks, cextends: this.priceFormData.extends, city: city })
            .then(res => {
              if (res.code === '970006') {
                this.formData.showLoginDialog = true;
              } else {
                this.priceFormData = Object.assign({}, this.priceFormData, res.data);
                this.formData.goodAttr = strVal;
              }
              _this.priceFormData.priceProgress = false;
            })
            .catch(res => {
              _this.formData.goodAttr = strVal;
              _this.priceFormData.priceProgress = false;
            });
        } else {
          _this.formData.goodAttr = strVal;
          _this.priceFormData.priceProgress = false;
        }
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
.block-row .EattrMgroup {
  display: inline-block;
}
.block-row .Eattrrow {
  display: block;
  float: none;
}
.fixedclass {
  position: fixed;
  top: 46px;
  background: #fff;
  z-index: 99;
  border: 1px solid #dbe0e4;
}
.tooltext {
  color: red;
  cursor: pointer;
}
.toolbox {
  margin-top: 10px;
}
</style>
<style src="../../static/mulindex/css/public.css"></style>
<style src="../../static/mulindex/css/attr.css"></style>

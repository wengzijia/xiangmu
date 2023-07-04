<!-- fengjianbo -->
<template>
  <div>
    <el-row>
      <el-col v-loading="formData.loading">
        <div class="comBox guigeBox cardBox needhide">
          <div class="guigeLt">
            <h1 class="flex guigeH1">
              <span class="geH1Lt">{{ cateName }}-{{ subCateName }}规格选择 </span>
              <span class="lookBnt"><router-link :to="'/goods/goodsDesc?gid=' + formData.goodAttrVo.id">查看产品详情</router-link></span>
            </h1>
            <!-- 公用部分 -->
            <price-common :number-change="numberChange" :otherInputChange="otherInputChange" :form-data.sync="formData" :common-form-data.sync="commonFormData" :common-vo-list.sync="commonVoList" :price-valuation="priceValuation"></price-common>
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
            ></price-major-group>
          </div>
          <price-right :priceFormData.sync="priceFormData" :addCart="addCart" :priceValuation="priceValuation"></price-right>
        </div>
      </el-col>
    </el-row>

    <login-form :dialogVisible.sync="formData.showLoginDialog"></login-form>
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
  getCommonVoList,
  getSubName,
  commonValuation,
  numberChange,
  otherInputChange,
  getGoodAttrInfo,
  cateChange,
  getPagerCate,
  reSetSize,
  loadCommonDefault
} from '@/utils/price/goodPriceUtil';
import { defaultFormData, defaultPriceFormData } from '@/utils/price/goodPriceUtil';
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { craftInitUtil, isCopyCraft } from '@/utils/price/craftUtil';
import PriceMajorGroup from '@/components/price/PriceMajorGroup';
import PriceRight from '@/components/price/PriceRight';
import PriceCommon from '@/components/price/PriceCommon';
import LoginForm from '@/components/common/LoginForm';
import { getAreaName } from '@/utils/city';
import { priceInvoke } from '@/api/price/priceApi';
export default {
  components: {
    PriceRight,
    PriceMajorGroup,
    PriceCommon,
    LoginForm
  },
  data() {
    return {
      ...JSON.parse(JSON.stringify(defaultFormData)),
      bindType: 'cate' // 绑定类型,cate:商品计价
    };
  },
  created() {
    priceInitUtil(this);
    craftInitUtil(this);
    this.initPage();
  },
  mounted() {},
  watch: {
    $route(to) {
      this.initPage();
    },
    subCateId: {
      async handler() {
        this.whereBindId = this.subCateId;
        this.formVoList = [];
        this.voList = [];
        await cateChange();
        await getGoodAttrInfo();
        reSetSize();
      }
    }
  },
  methods: {
    ...{ startWith, endWith },
    ...{ addCopyGroupCk, removeCopyGroupCk, addCopyGroupRd, removeCopyGroupRd, addCart, numberChange, otherInputChange, checkboxSelect, selectSelect, radioSelect },
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
     * 计价方法
     */
    async priceValuation() {
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
        const result = await this.dataChange();
        if (result) {
          strVal += result;
        } else {
          return false;
        }
        if (this.subCateId === '47' && strVal.indexOf('折叠次数') === -1) {
          strVal += '折叠次数:1;';
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
        console.log(strVal);
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
        _this.priceFormData.priceProgress = false;
      }
    },
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

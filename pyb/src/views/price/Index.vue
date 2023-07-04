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
            ></price-major>
          </div>
          <price-right :priceFormData.sync="priceFormData" :addCart="addCart" :priceValuation="priceValuation"></price-right>
        </div>
        <login-form :dialogVisible.sync="formData.showLoginDialog"></login-form>
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
  getAttrValue,
  isReInSize,
  getOtherMsg
} from '@/utils/price/goodPriceUtil';
import { defaultFormData, defaultPriceFormData } from '@/utils/price/goodPriceUtil';
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { craftInitUtil, isCopyCraft } from '@/utils/price/craftUtil';
import LoginForm from '@/components/common/LoginForm';
import PriceRight from '@/components/price/PriceRight';
import PriceMajor from '@/components/price/PriceMajor';
import PriceCommon from '@/components/price/PriceCommon';
import { getAreaName } from '@/utils/city';
import { priceInvoke } from '@/api/price/priceApi';
export default {
  components: {
    LoginForm,
    PriceRight,
    PriceMajor,
    PriceCommon
  },
  data() {
    return {
      ...JSON.parse(JSON.stringify(defaultFormData)),
      bindType: 'cate', // 绑定类型,cate:商品计价
      isCommonSize: false
    };
  },
  created() {
    // document.title = '11拼一版(原小彩印)(www.aocai.cn) - 做包装上拼一版';

    if (!this.$route.query.cateId) {
      this.$router.push({ path: '/price/cartIndex?cateId=1&subCateId=15' });
    }
    priceInitUtil(this);
    craftInitUtil(this);
    this.initPage();
  },
  mounted() {},
  watch: {
    $route(to) {
      this.initPage();
      getGoodAttrInfo();
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
    ...{ checkboxSelect, selectSelect, radioSelect, removeCopyGroupCk, addCopyGroupCk, getCateVoList, numberChange, otherInputChange, addCart, addCopyGroupRd, removeCopyGroupRd },
    ...{ isCopyCraft },
    /**
     * 初始化页面数据
     */
    initPage() {
      getPagerCate();
      this.whereBindId = this.subCateId;
      this.commonVoList = getCommonVoList(this.cateId, this.subCateId);
      reSetSize();
      this.clearData();
      if (strEquals(this.cateId, '8')) {
        this.formData.dmys.jybm = true;
      }
      getSubName();
    },
    /**
     * 清理数据
     */
    clearData() {
      this.$set(this, 'formVoList', []);
      this.$set(this, 'voList', []);
      this.$set(this, 'formData', JSON.parse(JSON.stringify(defaultFormData.formData)));
      this.$set(this, 'commonFormData', JSON.parse(JSON.stringify(defaultFormData.commonFormData)));
      this.loadCommonDefault();
      this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(defaultPriceFormData)));
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
     * 计价方法
     */
    async priceValuation() {
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
        } else if (strEquals(this.cateId, '70') && strEquals(this.subCateId, '71')) {
          strVal += '品类:外箱;';
        }

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
        strVal += await this.dataChange();
        if (strEquals(this.cateId, '1')) {
          if (strVal.indexOf('粘合:') === -1) {
            strVal += '粘合:不粘;';
          }
        } else if (strEquals(this.cateId, '2') && strEquals(this.subCateId, '31')) {
          strVal += '驳数:双驳;';
          strVal += '粘合:粘;';
        } else if (strEquals(this.cateId, '2') && strEquals(this.subCateId, '32')) {
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
            }
          }
        }
        if (strEquals(this.cateId, '70') || (strEquals(this.cateId, '2') && strEquals(this.subCateId, '31'))) {
          strVal = getAttrValue(this.cateId, this.subCateId, strVal);
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

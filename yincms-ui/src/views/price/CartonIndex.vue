<!-- fengjianbo -->
<template>
  <div>
    <el-row>
      <el-col v-loading="formData.loading">
        <div class="comBox guigeBox cardBox needhide">
          <div class="guigeLt">
            <div class="cardtabT flex">
              <ul class="cardtabT_ul">
                <li :class="tabType === '0' ? 'curr' : ''" @click="tabType = '0'">快捷报价</li>
                <li :class="tabType === '1' ? 'curr' : ''" @click="tabType = '1'">专业报价</li>
              </ul>
              <span class="lookBnt"><router-link :to="'/goods/goodsDesc?gid=' + formData.goodAttrVo.id" target="_blank">查看产品详情</router-link></span>
            </div>
            <!-- 公用部分 -->
            <price-common
              :number-change="numberChange"
              :addCommonSize="addCommonSize"
              :removeCommonSize="removeCommonSize"
              :otherInputChange="otherInputChange"
              :form-data.sync="formData"
              :common-form-data.sync="commonFormData"
              :common-vo-list.sync="commonVoList"
              :price-valuation="priceValuation"
            ></price-common>
            <!-- 快捷报价 -->
            <el-form class="EattrMain" v-if="tabType === '0'" ref="formData" :model="quickFormData" label-width="130px" @submit.native.prevent size="small">
              <template v-for="(item, index) in quickVoList">
                <template>
                  <el-form-item
                    :key="'quick_' + index"
                    v-if="(item.code === 'ZZLX' || item.code === 'YSBCL') && (item.parentAttrId === 0 || item.parentAttrId === quickFormData.radioSelectValues[1])"
                    :class="item.code === 'YSBCL' ? ' block-row' : ''"
                  >
                    <template slot="label">
                      <div class="EattrLab"><span class="red">*</span>{{ item.name }}</div>
                    </template>
                    <el-radio-group size="small" class="flex EattrMgroup " v-model="quickFormData.radioSelectValues[item.id]" button-style="solid" @change="curQuickRadioClick">
                      <el-row class="Eattrrow" v-for="attr in item.attrList" :key="'quick_attr_' + attr.id">
                        <template v-if="attr.remark !== '' && attr.remark != null">
                          <el-tooltip class="item" effect="light" placement="top-start">
                            <template slot="content">
                              <span v-html="attr.remark"></span>
                            </template>
                            <el-radio-button :label="attr.id">{{ attr.name }}</el-radio-button>
                          </el-tooltip>
                        </template>
                        <template v-else>
                          <el-radio-button :label="attr.id">{{ attr.name }}</el-radio-button>
                        </template>
                      </el-row>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    :key="'quick_' + index"
                    v-else-if="item.show && $route.query.subCateId !== '85' && $route.query.subCateId !== '96' && (item.code === 'YSYS' || item.code === 'YSDS' || item.code === 'YSSS' || (item.code === 'YSBCLS' && $route.query.subCateId !== '73'))"
                  >
                    <template slot="label">
                      <div v-if="item.name" class="EattrLab"><span class="red">*</span>{{ item.name }}</div>
                    </template>
                    <template v-if="item.groupType == 'radio' && item.show">
                      <el-radio-group size="small" :class="item.name === '' ? 'oAtrLayer' : ''" class=" EattrMgroup" v-model="quickFormData.radioSelectValues[item.id]" button-style="solid" @change="curQuickRadioClick">
                        <el-row class="Eattrrow" v-for="attr in item.attrList" :key="'quick_attr_' + attr.id">
                          <template v-if="attr.remark !== '' && attr.remark != null">
                            <el-tooltip class="item" effect="light" placement="top-start">
                              <template slot="content">
                                <span v-html="attr.remark"></span>
                              </template>
                              <el-radio-button :label="attr.id">{{ attr.name }}</el-radio-button>
                            </el-tooltip>
                          </template>
                          <template v-else>
                            <el-radio-button :label="attr.id">{{ attr.name }}</el-radio-button>
                          </template>
                        </el-row>
                      </el-radio-group>
                    </template>
                    <template v-else-if="item.groupType == 'checkbox' && item.show">
                      <el-checkbox-group size="small" class="oAtrLayer EattrMgroup" style="height: 41px" v-model="quickFormData.radioSelectValues[item.id]" button-style="solid" @change="curQuickRadioClicks({ event: $event, code: item.id })">
                        <el-row class="Eattrrow" v-for="attr in item.attrList" :key="'attr_' + attr.id">
                          <template v-if="attr.remark !== '' && attr.remark != null">
                            <el-tooltip class="item" effect="light" placement="top-start">
                              <template slot="content">
                                <div v-html="attr.remark"></div>
                              </template>
                              <el-checkbox-button :label="attr.id">{{ attr.name }}</el-checkbox-button>
                            </el-tooltip>
                          </template>
                          <el-checkbox-button v-else :label="attr.id">{{ attr.name }}</el-checkbox-button>
                        </el-row>
                      </el-checkbox-group>
                    </template>
                    <span class="colorNumbr" v-if="item.code === 'YSYS'">
                      专色数量:
                      <el-select v-model="zmys.scCount" style="width:100px" @change="zmySelects">
                        <el-option label="0" :value="0"></el-option>
                        <el-option label="1" :value="1"></el-option>
                        <el-option label="2" :value="2"></el-option>
                        <el-option label="3" :value="3"></el-option>
                        <el-option label="4" :value="4"></el-option>
                      </el-select>
                    </span>
                    <span v-if="item.code === 'YSYS' && $route.query.subCateId !== '85'" class="EattrMgroup colorNumbr">
                      印刷面:
                      <el-select v-model="ysm.scCount" style="width:100px" @change="ysmSelects">
                        <el-option label="0" :value="0"></el-option>
                        <el-option label="1" :value="1"></el-option>
                        <el-option label="2" :value="2"></el-option>
                        <el-option label="3" :value="3"></el-option>
                        <el-option label="4" :value="4"></el-option>
                        <el-option label="5" :value="5"></el-option>
                        <el-option label="6" :value="6"></el-option>
                      </el-select>
                    </span>
                  </el-form-item>
                </template>
              </template>
              <el-form-item>
                <div class="PantoneDv" v-if="zmys.scCount > 0">
                  <label>请填写PANTONE色号:</label>
                  <el-input class="PantoneDvtx" v-for="(item, index) in zmys.scCount" :key="item" v-model="zmys.pantoneList[index]" @change="priceValuation" />
                  <p class="toolbox">
                    <span class="red">*</span>官方默认以潘通色卡版本“
                    <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                      <template slot="content">
                        <div class="EattrMtips" style="width:400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                      </template>
                      <span class="tooltext">Pantone LCC, 2019.</span>
                    </el-tooltip>
                    ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
                  </p>
                </div>
                <div class="PantoneDv">
                  <ul>
                    <li class="flex inputBx onetx" v-for="(item, index) in ysm.scCount" :key="index">
                      <label>实际印刷尺寸{{ index + 1 }}</label>
                      <el-input class="PantoneDvtx noMrgin" v-model="formData.ysm.list[index]['longVal']" @change="priceValuation">
                        <template slot="append">x</template>
                      </el-input>
                      <el-input class="PantoneDvtx" v-model="formData.ysm.list[index]['widthVal']" @change="priceValuation">
                        <template slot="append">mm</template>
                      </el-input>
                    </li>
                  </ul>
                </div>
              </el-form-item>
            </el-form>
            <!-- 专业报价 -->
            <price-major
              v-else
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
          <price-right class="fixedstatus" :style="'margin-top:' + marginnum + 'px'" :priceFormData.sync="priceFormData" :addCart="addCart" :addQuote="addQuote" :priceValuation="priceValuation" :goodsId="formData.goodAttrVo.id"></price-right>
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
  addQuote,
  getAttrValue,
  isReInSize,
  getOtherMsg,
  priceSynFunction,
  addCommonSize,
  removeCommonSize,
  defaultYs,
  getPantoneStr
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
import { computeSize } from '@/api/product/attrApi';
import { quickInitUtil, quickViewList, quickRadioClick, quickViewCartonLists } from '@/utils/price/quickPriceUtil';
import store from '@/store';
import { debounce } from '@/utils/utils';
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
      divheight: 0
    };
  },
  created() {
    if (!this.$route.query.cateId) {
      this.$router.push({ path: '/price/cartIndex?cateId=1&subCateId=15' });
    }

    priceInitUtil(this);
    quickInitUtil(this);
    craftInitUtil(this);
    this.initPage();
  },
  mounted() {
    const scrollDiv = document.querySelector('body');
    this.divheight = document.querySelector('.guigeLt').clientHeight;
    this.fixednum = document.querySelector('.fixedstatus').clientHeight;
    // const fixedstatus = document.querySelector('.fixedstatus');
    const divclass = document.querySelector('.guigeRtWrap');
    let _this = this;
    scrollDiv.onscroll = function() {
      if (_this.divheight > _this.fixednum + 50) {
        if (document.documentElement.scrollTop > 350) {
          divclass.classList.add('fixedclass');
          if (document.documentElement.scrollTop > _this.divheight - _this.fixednum + 350) {
            divclass.classList.remove('fixedclass');
            // fixedstatus.style.marginTop = _this.divheight - 594 + 'px';
            _this.marginnum = _this.divheight - _this.fixednum;
          } else {
            // fixedstatus.style.marginTop = 0;
            _this.marginnum = 0;
          }
          // console.log(this.fixedstatus)
        } else {
          divclass.classList.remove('fixedclass');
        }
      }
    };
  },
  watch: {
    $route(to) {
      this.initPage();
      getGoodAttrInfo();
      // setTimeout(()=>{
      //   this.divheight = document.querySelector('.guigeLt').clientHeight;
      //   this.fixednum = document.querySelector('.fixedstatus').clientHeight;
      //   console.log('watch',this.divheight)
      // },0)
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
          this.divheight = document.querySelector('.guigeLt').clientHeight;
          this.fixednum = document.querySelector('.fixedstatus').clientHeight;
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
        this.divheight = document.querySelector('.guigeLt').clientHeight;
        this.fixednum = document.querySelector('.fixedstatus').clientHeight;
        console.log('watch', this.divheight);
        // },0)
      }
    }
  },
  methods: {
    ...{ startWith, endWith },
    ...{ checkboxSelect, selectSelect, radioSelect, removeCopyGroupCk, addCopyGroupCk, getCateVoList, numberChange, otherInputChange, addCart, addQuote, addCopyGroupRd, removeCopyGroupRd, addCommonSize, removeCommonSize },
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
    },
    /**
     * 清理数据
     */
    clearData() {
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
        // if (strEquals(that.subCateId, '85') || strEquals(that.subCateId, '96')) {
        //   if (parseInt(val) < 1) {
        //     that.$message({ type: 'error', message: '1个起印' });
        //     data.data[data.dataKey] = '1';
        //   }
        // } else {
        if (parseInt(val) < 100) {
          that.$message({ type: 'error', message: '100个起印' });
          data.data[data.dataKey] = '100';
        }
        // }
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
      const countyId = _this.priceFormData.countyId;
      const yssl = _this.priceFormData.yssl;
      const tkks = _this.priceFormData.tkks;
      const extendsStr = _this.priceFormData.extends;
      var status = 1;
      _this.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      _this.priceFormData.provinceId = provinceId;
      _this.priceFormData.cityId = cityId;
      _this.priceFormData.countyId = countyId;
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
        if (this.tabType === '0') {
          strVal += await this.quickPrice();
          //专色
          if (this.zmys.scCount > 0) {
            strVal += await getPantoneStr(this.zmys, '专色');
          }
          //印刷面
          if (this.ysm.scCount > 0) {
            var a = 0;
            for (let i = 0; i < this.ysm.scCount; i++) {
              const item = this.formData.ysm.list[i];
              if (item.longVal && item.widthVal) {
                strVal += '实际印刷尺寸' + (i + 1) + ':' + item.longVal + '_' + item.widthVal + ';';
              } else {
                this.$message({ type: 'error', message: '请将实际印刷尺寸填写完整' });
                status = 0;
              }
            }
          }
          strVal += '0;';
        } else {
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
        }

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
        if (this.priceFormData.countyId !== '') {
          if (city !== '') {
            city += ' ';
          }
          city += getAreaName('county', this.priceFormData.countyId);
        }
        strVal = this.sortAttrStr(strVal, '品类:');
        console.log(strVal);
        if (status == 1) {
          let yssl2 = this.ysslCheck();
          if (Number(yssl2) > Number(this.priceFormData.yssl)) this.priceFormData.yssl = yssl2;
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
    /**
     * 快捷计价
     */
    async quickPrice() {
      let strVal = '';
      let newstr = '';
      for (let i = 0; i < this.quickVoList.length; i++) {
        const attrList = this.quickVoList[i].attrList;
        for (let j = 0; j < attrList.length; j++) {
          if (attrList[j].actualValue) {
            for (const inx in this.quickFormData.radioSelectValues) {
              // console.log('iiiiiii',i);
              if (i < 5) {
                if (attrList[j].id === this.quickFormData.radioSelectValues[inx]) {
                  strVal += attrList[j].actualValue;
                  strVal += ';';
                  break;
                }
              } else {
                if (i == 5) {
                  if (attrList[j].id === this.quickFormData.radioSelectValues[inx]) {
                    strVal += attrList[j].actualValue;
                    if (attrList[j].id == 16) {
                      strVal += ';';
                    }
                    break;
                  }
                }
                if (i == 6) {
                  if (attrList[j].id === this.quickFormData.radioSelectValues[inx]) {
                    strVal += attrList[j].actualValue;
                    strVal += ';';
                    break;
                  }
                }
                if (i == 7 && inx == 8) {
                  if (attrList[j].id == 21 || attrList[j].id == 22 || attrList[j].id == 23 || attrList[j].id == 24) {
                    for (let n = 0; n < this.quickFormData.radioSelectValues[inx].length; n++) {
                      if (attrList[j].id === this.quickFormData.radioSelectValues[inx][n]) {
                        strVal += attrList[j].actualValue;
                        if (n == this.quickFormData.radioSelectValues[inx].length - 1) {
                          strVal += ';';
                        }
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (this.$route.query.subCateId == '73') {
        newstr = strVal.replace('粘合:胶粘;', '');
      } else {
        newstr = strVal;
      }
      return newstr;
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
    },
    curQuickRadioClick(event) {
      quickRadioClick(event);
      this.priceValuation();
    },
    curQuickRadioClicks(e) {
      if (e.event.length > 2) {
        this.$message({ type: 'error', message: '最多可选择2个，如要继续，请取消当前选中的某一个选项', duration: 1500 });
        this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(defaultPriceFormData)));
        return false;
      } else if (e.event.length < 2) {
        this.$message({ type: 'error', message: '最少可选择2个，如要继续，请取消当前选中的某一个选项', duration: 1500 });
        this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(defaultPriceFormData)));
        return false;
      }
      this.priceValuation();
    },
    ysmSelects() {
      if (this.ysm.scCount == 0) {
        if (this.quickFormData.radioSelectValues[6] != 16) {
          this.$message({ type: 'error', message: '有印刷，印刷面不能为0', duration: 1500 });
          this.ysm.scCount = 1;
          return false;
        }
      }
      this.priceValuation();
    },
    zmySelects() {
      this.priceValuation();
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

<!-- fengjianbo -->
<template>
  <div ref="tree">
    <el-row>
      <el-col v-loading="formData.loading">
        <div class=" guigeBox cardBox needhide">
          <div class="guigeLt">
            <goods-size-info :goodsSizeInfo="goodsSizeInfo"></goods-size-info>
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
              :getraradiofn="getraradiofn"
              :priceFormData.sync="priceFormData"
              :addService="addService"
              :baseIds="baseIds"
            >
              <template v-slot:zzzl>
                <el-radio-group size="small" class="EattrMgroup" v-model="dataval" v-show="newlist.length > 1" @change="priceValuationNew">
                  <template v-for="item in newlist">
                    <el-row class="Eattrrow" :key="item.id" v-if="item.isPack == 1">
                      <el-radio-button :label="item.actualValue">{{ item.name }}</el-radio-button>
                    </el-row>
                  </template>
                </el-radio-group>
              </template>
            </price-major>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  priceInitUtil,
  numberChange,
  otherInputChange,
  removeCopyGroupCk,
  addCopyGroupCk,
  addCopyGroupRd,
  removeCopyGroupRd,
  commonValuation,
  commonDataChange,
  checkboxSelect,
  selectSelect,
  radioSelect,
  getCommonVoList,
  addCart,
  addQuote,
  getGoodAttrInfo,
  cateChange,
  getPagerCate,
  getSubName,
  reSetSize,
  priceSynFunction
} from './price/goodPriceUtil';

import { defaultFormData, defaultPriceFormData, radioSelect2, checkboxSelect2 } from './price/goodPriceUtil';
import { quickInitUtil, quickViewList, quickRadioClick, cartQuickRadioClick } from './price/quickPriceUtil';
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { craftInitUtil, isCopyCraft } from './price/craftUtil';
import { priceInvoke } from '@/api/price/priceApi';
import { getAreaName } from '@/utils/city';
import PriceMajor from './components/PriceMajor';
import { getPaper } from '@/api/product/attrApi';
import { debounce } from '@/utils/utils';
import setFormData from './mixins/setFromData.js';
export default {
  mixins: [setFormData],
  name: 'CartIndex',
  components: {
    PriceMajor
  },
  data() {
    return {
      dataval: '',
      ...JSON.parse(JSON.stringify(defaultFormData)),
      bindType: 'cate', // 绑定类型,cate:商品计价
      quickVoList: JSON.parse(JSON.stringify(quickViewList)), // 快捷报价属性
      quickFormData: { radioSelectValues: {} },
      fixedstatus: 'false',
      fixednum: 0,
      marginnum: 0,
      divheight: 0,
      newlist: [],
      newstatus: true,
      datas: '',
      loadingstatus: true,
      curquick: '',
      curquickstatus: true,
      bis1: '外箱套蛇皮袋:否;',
      bis2: '外箱贴标签:否;',
      formVoListId: '',
      isShort: false,
      oldDatas: ''
    };
  },
  async created() {
    // console.log(this.dataval);
    // if (!this.cateId) {
    //   this.$router.push({ path: '/price/cartIndex?cateId=1&subCateId=15' });
    // }
    let _this = this;
    _this.cateId = _this.baseIds.cateId;
    _this.subCateId = _this.baseIds.subCateId;
    _this.goodsId = _this.baseIds.goodsId;
    priceInitUtil(this);
    quickInitUtil(this);
    craftInitUtil(this);
    this.getPaperfn('4759_22625');
    this.initPage();
    this.whereBindId = this.subCateId;
    this.$set(this, 'formVoList', []);
    this.$set(this, 'voList', []);
    await cateChange();
    await getGoodAttrInfo(true);
    reSetSize();
    if (_this.oldFormData.commonFormDatainputValue) {
      let formData = JSON.parse(JSON.stringify(_this.oldFormData));
      _this.setFormData(formData.commonFormDatainputValue, JSON.parse(JSON.stringify(formData.formDatainputValue)));
    }
  },
  mounted() {
    const scrollDiv = document.querySelector('body');
    // this.fixednum = document.querySelector('.fixedstatus')?.clientHeight;
    // const divclass = document.querySelector('.fixedstatus');
    // scrollDiv.onscroll = () => {
    //   const divheight = document.querySelector('.guigeLt')?.clientHeight;
    //   const guigeRtWrap = document.querySelector('.guigeRtWrap')?.clientHeight;
    //   if (document.documentElement.scrollTop > 350) {
    //     if (document.documentElement.scrollTop > divheight + 350 - guigeRtWrap) {
    //       divclass.style.marginTop = divheight - guigeRtWrap + 'px';
    //     } else {
    //       divclass.style.marginTop = document.documentElement.scrollTop - 350 + 'px';
    //     }
    //   } else {
    //     divclass.style.marginTop = 0;
    //   }
    // };
  },
  watch: {
    // $route(to) {
    //   this.initPage();
    //   // 切换盒型不显示牛皮纸短货期
    //   this.isShort = false;
    //   this.formVoListId = '';
    // },
    // tabType: {
    //   handler() {
    //     // this.priceValuation(this.$refs.PriceRight.getraradio());
    //     // setTimeout(() => {
    //     //   this.divheight = document.querySelector('.guigeLt').clientHeight;
    //     //   this.fixednum = document.querySelector('.fixedstatus').clientHeight;
    //     // }, 0);
    //     // if (this.cateId == 1 && this.tabType == 1) {
    //     //   if (Object.values(this.formData.radioSelectValues)[2] == '4759_22625') {
    //     //     this.$refs.PriceRight.setradio('纸张材质:单铜纸_350');
    //     //     this.dataval = '纸张材质:单铜纸_350;';
    //     //     console.log(325);
    //     //   } else if (Object.values(this.formData.radioSelectValues)[2] == '4759_22626') {
    //     //     this.$refs.PriceRight.setradio('纸张材质:单铜纸_400');
    //     //     this.dataval = '纸张材质:单铜纸_400;';
    //     //     console.log(365);
    //     //   } else if (Object.values(this.formData.radioSelectValues)[2] == '4759_32419') {
    //     //     this.$refs.PriceRight.setradio('纸张材质:单铜纸_300');
    //     //     this.dataval = '纸张材质:单铜纸_300;';
    //     //     console.log(275);
    //     //   }
    //     //   // this.$refs.PriceRight.setradio('纸张材质:单铜纸_325');
    //     //   // this.initPage()
    //     //   this.curquickstatus = true;
    //     //   let radioValue = Object.values(this.formData.radioSelectValues)[2];
    //     //   console.log('ssss', radioValue);
    //     //   radioValue && this.getPaperfn(radioValue);
    //     // } else if (this.cateId == 1 && this.tabType == 0) {
    //     //   // this.$refs.PriceRight.setradio('纸张材质:单铜纸_325');
    //     //   this.curquickstatus = false;
    //     //   let qdata = this.getquickId(Object.values(this.quickFormData.radioSelectValues)[0]).flat();
    //     //   console.log(qdata);
    //     //   this.curquick = qdata[0].getid;
    //     //   if (this.curquick == '4759_22625') {
    //     //     this.$refs.PriceRight.setradio('纸张材质:单铜纸_350');
    //     //     this.dataval = '纸张材质:单铜纸_350;';
    //     //     console.log(325);
    //     //   } else if (this.curquick == '4759_22626') {
    //     //     this.$refs.PriceRight.setradio('纸张材质:单铜纸_400');
    //     //     this.dataval = '纸张材质:单铜纸_400;';
    //     //     console.log(365);
    //     //   }
    //     //   this.getPaperfn(qdata[0].getid);
    //     // }
    //   }
    // },
    // subCateId: {
    //   async handler() {
    //     // this.whereBindId = this.subCateId;
    //     // this.$set(this, 'formVoList', []);
    //     // this.$set(this, 'voList', []);
    //     // await cateChange();
    //     // await getGoodAttrInfo(true);
    //     // reSetSize();
    //   }
    // },
    newlist: {
      handler(newval) {
        if (newval.length) {
          let _this = this;
          let goodAttr = _this.formData.goodAttr || _this.oldFormData.formDatainputValue.goodAttr;
          let arr = goodAttr.split(';');
          let zzcz = arr.find(e => e.indexOf('纸张材质') !== -1);
          if (newval.find(e => e.actualValue === zzcz)) {
            this.dataval = zzcz;
          } else {
            this.dataval = newval[newval.length - 1]?.actualValue;
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...{ startWith, endWith, strEquals },
    ...{ removeCopyGroupCk, addCopyGroupCk, removeCopyGroupRd, addCopyGroupRd, numberChange, otherInputChange, addCart, addQuote, checkboxSelect, selectSelect, radioSelect, getGoodAttrInfo, cateChange, getPagerCate },
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
      // 判断是否为后台管理系统访问
    },
    /**
     * 清理数据
     */
    clearData() {
      this.tabType = '1';
      this.$set(this, 'formVoList', []);
      this.$set(this, 'voList', []);
      this.$set(this, 'formData', JSON.parse(JSON.stringify(defaultFormData.formData)));
      this.$set(this.quickFormData, 'radioSelectValues', { 1: 1 });
      this.$set(this, 'commonFormData', JSON.parse(JSON.stringify(defaultFormData.commonFormData)));
      this.loadCommonDefault();
      this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(defaultPriceFormData)));
      cartQuickRadioClick(1);
    },

    // 专业报价
    proQuotation(type) {
      if (type == '0') {
        this.tabType = '0';
        this.isShort = false;
        this.priceFormData.extends = '1';
      } else if (type == '1') {
        this.tabType = '1';
        // 不是牛皮纸选项初始化
        if (this.cateId == 1 && this.formVoListId.indexOf('4757') != -1 && this.formVoListId !== '4757_22880') {
          this.priceFormData.extends = '1';
          this.isShort = false;
        } else {
          if (this.formVoListId == '4757_22880') {
            this.isShort = true;
          }
        }
      }
    },
    // 新增服务
    addService(type, val) {
      if (type == 1) {
        if (!strEquals(val, this.priceFormData.radioService)) {
          this.$set(this.priceFormData, 'radioService', val);
        }
      } else {
        console.log('新增服务val', val);
        this.$set(this.priceFormData, 'checkedService', val);
      }
      // console.log('新增服务', this.priceFormData.radioService);
      // this.priceValuation(this.radio);
      this.priceValuation(this.getraradiofn());
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
    getPaperfn(data) {
      console.log('ddddcccc0');
      if (data === this.oldDatas) return; //判断本次请求的数据是否与上一次的一样，一样就不发送请求
      this.oldDatas = data;
      getPaper({ data: data }).then(res => {
        if (data == '4759_22625' || data == '4759_22626' || data == '4759_32419') {
          this.newlist = res.data.children;
        } else {
          this.newlist = [res.data.data];
        }
        this.loadingstatus = false;
      });
      if (this.tabType == '0') {
        setTimeout(() => {
          let qdata = this.getquickId(Object.values(this.quickFormData.radioSelectValues)[0]).flat();
          this.curquick = qdata[0].getid;
        }, 500);
      }
    },
    getraradiofn() {
      return this.dataval;
    },
    getpaperId() {
      // this.newlist = [];
      this.loadingstatus = true;
      let newlist = this.formVoList.filter(e => {
        return e.miniZtAttrGroup.actualValue == 'superior';
      });
      if (this.curquickstatus == false) {
        this.datas = this.curquick;
      } else if (this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id] == '4758_22624') {
        this.datas = this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id + 1];
      } else {
        this.datas = this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id];
      }
      console.log('41d154as4d5sa341d634as53d');
      if (this.newstatus) {
        this.getPaperfn(this.datas);
        // getPaper({ data: this.datas }).then(res => {
        //   if (this.datas == '4759_22625' || this.datas == '4759_22626' || this.datas == '4759_32419') {
        //     this.newlist = res.data.children;
        //   } else {
        //     this.newlist = [res.data.data];
        //   }
        //   this.loadingstatus = false;
        // });
      }
    },
    // emptyPaperId() {
    //   this.$refs.child.emptyId();
    // },
    priceValuation2() {
      // this.$refs.PriceRight.PaperChange2();
      this.priceValuationNew();
    },
    /**
     * 计价方法
     */
    async priceValuation(dataval) {
      this.dataval = dataval || '';
      await priceSynFunction(this.priceValuationNew);
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
    priceValuationNew: debounce(async function() {
      const _this = this;
      const provinceId = _this.priceFormData.provinceId;
      const radioService = _this.priceFormData.radioService;
      const checkedService = _this.priceFormData.checkedService;
      const cityId = _this.priceFormData.cityId;
      const yssl = _this.priceFormData.yssl;
      const tkks = _this.priceFormData.tkks;
      const extendsStr = _this.priceFormData.extends;
      _this.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      _this.priceFormData.radioService = radioService;
      _this.priceFormData.checkedService = checkedService;
      _this.priceFormData.provinceId = provinceId;
      _this.priceFormData.cityId = cityId;
      _this.priceFormData.yssl = yssl;
      _this.priceFormData.tkks = tkks;
      _this.priceFormData.extends = extendsStr;
      _this.formData.goodAttr = '';
      _this.priceFormData.priceProgress = true;
      let strVal = await commonValuation();
      if (strVal) {
        // if (this.tabType == '0') {
        //   this.curquickstatus = false;
        // } else {
        this.curquickstatus = true;
        // }
        this.getpaperId();
        // _this.newlist = [];
        // _this.loadingstatus = true;
        strVal += '展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
        // if (this.tabType === '0') {
        //   strVal += await this.quickPrice();
        // } else {
        const dataResult = await this.dataChange();
        if (dataResult) {
          strVal += dataResult;
        } else {
          _this.priceFormData.priceProgress = false;
          console.log('错了');
          this.$emit('setGoodsAttr', '');
          return false;
        }
        // }
        // if(this.formData.radioSelectValues['4759']&&this.formData.radioSelectValues['4759']=='4759_22625'){
        //   this.$refs.child.setradio('纸张材质:单铜纸_305');
        //   this.dataval='纸张材质:单铜纸_305;'
        // }else if(this.formData.radioSelectValues['4759']&&this.formData.radioSelectValues['4759']=='4759_22626'){
        //   this.$refs.child.setradio('纸张材质:单铜纸_305');
        //   this.dataval='纸张材质:单铜纸_305;'
        // }

        if (strEquals(_this.subCateId, '17')) {
          strVal += this.priceFormData.extends + ';粘合:自动锁底;';
        } else if (strEquals(_this.subCateId, '19') || strEquals(_this.subCateId, '21')) {
          strVal += this.priceFormData.extends + ';粘合:无;';
        } else {
          strVal += this.priceFormData.extends + ';粘合:自动粘1处;';
        }
        if (this.cateId == 1) {
          if (this.priceFormData.yssl >= 10000) {
            this.priceFormData.extends = 1;
          }
          if (this.datas == '4759_22625' || this.datas == '4759_22626' || this.datas == '4759_32419') {
            strVal += this.dataval ? this.dataval + ';' : '';
          }
          strVal += this.datas ? '材质标识:' + this.datas + ';' : '';
          // let bis1 = '外箱套蛇皮袋:否;';
          // let bis2 = '外箱贴标签:否;';
          // 加上包装服务
          if (this.priceFormData.checkedService.length > 0) {
            this.priceFormData.checkedService.map(item => {
              console.log(item);
              if (item == '1') {
                this.bis1 = '外箱套蛇皮袋:是;';
              }
              //  else if (item == '2') {
              //   this.bis2 = '外箱贴标签:是;';
              // }
            });
          } else {
            this.bis1 = '外箱套蛇皮袋:否;';
            // this.bis2 = '外箱贴标签:否;';
          }
          strVal += this.priceFormData.radioService ? '包装服务:' + this.priceFormData.radioService + ';' + this.bis1 : '';
          // strVal += this.priceFormData.radioService ? '包装服务:' + this.priceFormData.radioService + ';' + this.bis1 + this.bis2 : '';
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
        console.log(strVal);
        let yssl2 = this.ysslCheck();
        if (yssl2 && Number(yssl2) > Number(this.priceFormData.yssl)) this.priceFormData.yssl = yssl2;
        this.$emit('setGoodsAttr', strVal);
        _this.priceFormData.priceProgress = false;
        // console.log(JSON.stringify(this.formData));
        // this.formData.goodAttr = '';
        // priceInvoke({ goodsId: this.formData.goodAttrVo.id, goodsAttr: strVal, number: this.priceFormData.yssl, fnumber: this.priceFormData.tkks, cextends: this.priceFormData.extends, city: city })
        //   .then(res => {
        //     if (res.code === '970006') {
        //       _this.formData.showLoginDialog = true;
        //     } else {
        //       _this.priceFormData = Object.assign({}, this.priceFormData, res.data);
        //       _this.formData.goodAttr = strVal;
        //     }
        //     _this.priceFormData.priceProgress = false;
        //     _this.newstatus = false;
        //     // this.$refs.child.newlistfn2(res.data.paperVoList);
        //     _this.newlist = res.data.paperVoList;
        //     // if(this.datas=='4759_22625'||this.datas=='4759_22626'||this.datas=='4759_22627'||this.datas=='4759_32419'){
        //     //   this.newlist=res.data.children
        //     // }else{
        //     //   this.newlist = [res.data.data];
        //     // }
        //     _this.loadingstatus = false;
        //     // console.log('false', this.newlist);
        //   })
        //   .catch(res => {
        //     _this.formData.goodAttr = strVal;
        //     _this.priceFormData.priceProgress = false;
        //   });
        // _this.newstatus = false;
      } else {
        _this.priceFormData.priceProgress = false;
        _this.newstatus = true;
      }
    }, 500),
    /**
     * 快捷计价
     */
    quickPrice() {
      let strVal = '';
      for (let i = 0; i < this.quickVoList.length; i++) {
        const attrList = this.quickVoList[i].attrList;
        for (let j = 0; j < attrList.length; j++) {
          if (attrList[j].actualValue) {
            for (const inx in this.quickFormData.radioSelectValues) {
              if (attrList[j].id === this.quickFormData.radioSelectValues[inx]) {
                strVal += attrList[j].actualValue;
                strVal += ';';
                break;
              }
            }
          }
        }
      }
      strVal += '印刷:单面印刷;';
      return strVal;
    },
    getquickId(event) {
      let qId = this.quickVoList.map(e => {
        return e.attrList.filter(n => {
          return n.id == event;
        });
      });
      return qId;
    },
    /**
     * 数据修改
     */
    async dataChange() {
      let strVal = await commonDataChange();
      return strVal;
    },
    curQuickRadioClick(event) {
      let data3 = this.getquickId(event);
      console.log(data3.flat(1)[0].getid);
      console.log(event);
      if (event == 1) {
        // this.$refs.PriceRight.setradio('纸张材质:单铜纸_350');
        this.dataval = '纸张材质:单铜纸_350';
      } else if (event == 2) {
        // this.$refs.PriceRight.setradio('纸张材质:单铜纸_400');
        this.dataval = '纸张材质:单铜纸_400';
      }
      cartQuickRadioClick(event);
      if (this.newstatus) {
        getPaper({ data: data3.flat(1)[0].getid }).then(res => {
          if (data3.flat(1)[0].getid == '4759_22625' || data3.flat(1)[0].getid == '4759_22626' || data3.flat(1)[0].getid == '4759_32419') {
            this.newlist = res.data.children;
          } else {
            this.newlist = [res.data.data];
          }
          this.curquick = data3.flat(1)[0].getid;
          this.curquickstatus = true;
          this.loadingstatus = false;
        });
      } else {
        this.curquick = data3.flat(1)[0].getid;
        this.curquickstatus = false;
        this.priceValuation(this.getraradiofn());
      }
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
.addwhite .el-checkbox-button__inner {
  padding: 0 15px;
  height: 33px;
  line-height: 33px;
  box-sizing: border-box;
}
.checked_box .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: inherit;
  color: #333;
  border-color: #e60021;
}
.checked_box .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #000;
  font-weight: bold;
}
.checked_box .el-checkbox__inner:hover {
  border-color: #ff0036;
}
.checked_box .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #ff0036;
}
</style>

<!-- fengjianbo -->
<template>
  <div ref="tree" v-resize="monResize">
    <el-row>
      <el-col v-loading="formData.loading">
        <div class="comBox guigeBox cardBox needhide">
          <div class="guigeLt">
            <!-- <div class="cardtabT flex">
              <ul class="cardtabT_ul">
                <li :class="tabType === '0' ? 'curr' : ''" @click="tabType = '0'">快捷报价</li>
                <li :class="tabType === '1' ? 'curr' : ''" @click="tabType = '1'">专业报价</li>
              </ul>
              <span class="lookBnt"><router-link :to="'/goods/goodsDesc?gid=' + formData.goodAttrVo.id" target="_blank">查看产品详情</router-link></span>
            </div> -->
            <!-- 公用部分 -->
            <price-common :number-change="numberChange" :otherInputChange="otherInputChange" :price-valuation="priceValuation" :form-data.sync="formData" :common-form-data.sync="commonFormData" :common-vo-list.sync="commonVoList"></price-common>

            <!-- 快捷报价 -->
            <el-form class="EattrMain" v-if="tabType === '0'" ref="formData" :model="quickFormData" label-width="130px" @submit.native.prevent size="small">
              <template v-for="(item, index) in quickVoList">
                <el-form-item :key="'quick_' + index" v-if="item.parentAttrId === 0 || item.parentAttrId === quickFormData.radioSelectValues[1]" :class="item.code === 'YSBCL' ? ' block-row' : ''">
                  <template slot="label">
                    <div class="EattrLab"><span class="red">*</span>{{ item.name }}</div>
                  </template>
                  <el-radio-group size="small" class="EattrMgroup" v-model="quickFormData.radioSelectValues[item.id]" button-style="solid" @change="curQuickRadioClick">
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
              </template>
              <el-form-item>
                <div class="Pantips" style="width: 80%">
                  <span class="red">温馨提示:</span> 如果您的设计文件中使用了三色或四色混合(浅灰、灰、深灰、黑)、暗红色、浅红色、墨绿色、蓝紫色、深紫色、深褐色、咖啡色等色，建议您选择专色印刷，否则出现色差问题不予受理。
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
              :getraradiofn="getraradiofn"
              :priceFormData.sync="priceFormData"
              :addService="addService"
            ></price-major>
          </div>
          <!-- <div  class="fixedstatus" ref="PriceRight">

          </div> -->
          <price-right
            ref="PriceRight"
            class="fixedstatus"
            :style="'margin-top:' + marginnum + 'px;display:none;'"
            :newlist="newlist"
            :loadingstatus="loadingstatus"
            :priceFormData.sync="priceFormData"
            :addCart="addCart"
            :addQuote="addQuote"
            :priceValuation="priceValuation"
          ></price-right>
          <!--  <login-form :dialogVisible.sync="formData.showLoginDialog"></login-form> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import {
//   priceInitUtil,
//   numberChange,
//   otherInputChange,
//   removeCopyGroupCk,
//   addCopyGroupCk,
//   addCopyGroupRd,
//   removeCopyGroupRd,
//   commonValuation,
//   commonDataChange,
//   checkboxSelect,
//   selectSelect,
//   radioSelect,
//   getCommonVoList,
//   addCart,
//   addQuote,
//   getGoodAttrInfo,
//   cateChange,
//   getPagerCate,
//   getSubName,
//   reSetSize,
//   priceSynFunction
// } from '@/utils/price/goodPriceUtil';
// import { defaultFormData, defaultPriceFormData } from '@/utils/price/goodPriceUtil';
// import { quickInitUtil, quickViewList, quickRadioClick, cartQuickRadioClick } from '@/utils/price/quickPriceUtil';
// import { startWith, endWith, strEquals } from '@/utils/strUtil';
// import { craftInitUtil, isCopyCraft } from '@/utils/price/craftUtil';
// import { priceInvoke } from '@/api/price/priceApi';
// import { getAreaName } from '@/utils/city';
// import PriceRight from '@/components/price/PriceRight';
// import PriceMajor from '@/components/price/PriceMajor';
// import PriceCommon from '@/components/price/PriceCommon';
// import LoginForm from '@/components/common/LoginForm';
// import { getPaper } from '@/api/product/attrApi';
import entiretyIframe from './mixins/entiretyIframe';
import cartIndex from './mixins/cartIndex';
export default {
  mixins: [entiretyIframe, cartIndex],
  mounted() {
    this.priceFormData.radioService = '';
    this.bis1 = '';
  }
  // components: {
  //   PriceRight,
  //   PriceMajor,
  //   PriceCommon,
  //   // LoginForm
  // },
  // data() {
  //   return {
  //     dataval: '',
  //     ...JSON.parse(JSON.stringify(defaultFormData)),
  //     bindType: 'cate', // 绑定类型,cate:商品计价
  //     quickVoList: JSON.parse(JSON.stringify(quickViewList)), // 快捷报价属性
  //     quickFormData: { radioSelectValues: {} },
  //     fixedstatus: 'false',
  //     fixednum: 0,
  //     marginnum: 0,
  //     divheight: 0,
  //     newlist: [],
  //     newstatus: true,
  //     datas: '',
  //     loadingstatus: true,
  //     curquick: '',
  //     curquickstatus: true
  //   };
  // },
  // created() {
  //   // console.log(this.dataval);
  //   if (!this.$route.query.cateId) {
  //     this.$router.push({ path: '/price/cartIndex?cateId=1&subCateId=15' });
  //   }
  //   priceInitUtil(this);
  //   quickInitUtil(this);
  //   craftInitUtil(this);
  //   this.getPaperfn('4759_22625');
  //   this.initPage();
  // },
  // mounted() {
  //   const scrollDiv = document.querySelector('body');
  //   this.divheight = document.querySelector('.guigeLt').clientHeight;
  //   this.fixednum = document.querySelector('.fixedstatus').clientHeight;
  //   const divclass = document.querySelector('.guigeRtWrap');
  //   let _this = this;
  //   scrollDiv.onscroll = function () {
  //     if(_this.tabType==0) return
  //     // console.log(_this.divheight)
  //     if (_this.divheight > _this.fixednum + 50) {
  //       if (document.documentElement.scrollTop > 350) {
  //         divclass.classList.add('fixedclass');
  //         if (document.documentElement.scrollTop > _this.divheight - _this.fixednum + 350) {
  //           divclass.classList.remove('fixedclass');
  //           // fixedstatus.style.marginTop = _this.divheight - 594 + 'px';
  //           _this.marginnum = _this.divheight - _this.fixednum;
  //         } else {
  //           // fixedstatus.style.marginTop = 0;
  //           _this.marginnum = 0;
  //         }
  //         // console.log(this.fixedstatus)
  //       } else {
  //         divclass.classList.remove('fixedclass');
  //       }
  //     }

  //     // console.log('onscroll',_this.divheight);
  //   };
  // },
  // watch: {
  //   $route(to) {
  //     this.initPage();
  //   },
  //   tabType: {
  //     handler() {
  //       this.priceValuation(this.$refs.PriceRight.getraradio());
  //       setTimeout(() => {
  //         this.divheight = document.querySelector('.guigeLt').clientHeight;
  //         this.fixednum = document.querySelector('.fixedstatus').clientHeight;
  //       }, 0);
  //       if (this.$route.query.cateId == 1 && this.tabType == 1) {
  //         if(Object.values(this.formData.radioSelectValues)[2]=='4759_22625'){
  //           this.$refs.PriceRight.setradio('纸张材质:单铜纸_325');
  //           this.dataval='纸张材质:单铜纸_325;'
  //           console.log(325);
  //         }else if(Object.values(this.formData.radioSelectValues)[2]=='4759_22626'){
  //           this.$refs.PriceRight.setradio('纸张材质:单铜纸_365');
  //           this.dataval='纸张材质:单铜纸_365;'
  //           console.log(365);
  //         }else if(Object.values(this.formData.radioSelectValues)[2]=='4759_32419'){
  //           this.$refs.PriceRight.setradio('纸张材质:单铜纸_275');
  //           this.dataval='纸张材质:单铜纸_275;'
  //           console.log(275);
  //         }
  //         // this.$refs.PriceRight.setradio('纸张材质:单铜纸_325');
  //         // this.initPage()
  //         console.log(Object.values(this.formData.radioSelectValues)[2]);
  //         this.curquickstatus = true;
  //         this.getPaperfn(Object.values(this.formData.radioSelectValues)[2]);

  //       } else if (this.$route.query.cateId == 1 && this.tabType == 0) {
  //         // this.$refs.PriceRight.setradio('纸张材质:单铜纸_325');
  //         this.curquickstatus = false;
  //         let qdata = this.getquickId(Object.values(this.quickFormData.radioSelectValues)[0]).flat();
  //         console.log(qdata);
  //         this.curquick = qdata[0].getid;
  //         if(this.curquick=='4759_22625'){
  //           this.$refs.PriceRight.setradio('纸张材质:单铜纸_325');
  //           this.dataval='纸张材质:单铜纸_325;'
  //           console.log(325);
  //         }else if(this.curquick=='4759_22626'){
  //           this.$refs.PriceRight.setradio('纸张材质:单铜纸_365');
  //           this.dataval='纸张材质:单铜纸_365;'

  //           console.log(365);
  //         }
  //         this.getPaperfn(qdata[0].getid);
  //       }
  //     }
  //   },
  //   subCateId: {
  //     async handler() {
  //       this.whereBindId = this.subCateId;
  //       this.$set(this, 'formVoList', []);
  //       this.$set(this, 'voList', []);
  //       await cateChange();
  //       await getGoodAttrInfo(true);
  //       reSetSize();
  //     }
  //   }
  // },
  // methods: {
  //   ...{ startWith, endWith, strEquals },
  //   ...{ removeCopyGroupCk, addCopyGroupCk, removeCopyGroupRd, addCopyGroupRd, numberChange, otherInputChange, addCart, addQuote, checkboxSelect, selectSelect, radioSelect, getGoodAttrInfo, cateChange, getPagerCate },
  //   ...{ isCopyCraft },
  //   /**
  //    * 初始化页面数据
  //    */
  //   initPage() {
  //     getPagerCate();
  //     this.whereBindId = this.subCateId;
  //     this.commonVoList = getCommonVoList(this.cateId, this.subCateId);
  //     this.clearData();
  //     reSetSize();
  //     getSubName();
  //   },
  //   /**
  //    * 清理数据
  //    */
  //   clearData() {
  //     this.tabType = '0';
  //     this.$set(this, 'formVoList', []);
  //     this.$set(this, 'voList', []);
  //     this.$set(this, 'formData', JSON.parse(JSON.stringify(defaultFormData.formData)));
  //     this.$set(this.quickFormData, 'radioSelectValues', { 1: 1 });
  //     this.$set(this, 'commonFormData', JSON.parse(JSON.stringify(defaultFormData.commonFormData)));
  //     this.loadCommonDefault();
  //     this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(defaultPriceFormData)));
  //     cartQuickRadioClick(1);
  //   },
  //   loadCommonDefault() {
  //     for (let i = 0; i < this.commonVoList.length; i++) {
  //       const commonVo = this.commonVoList[i];
  //       for (let j = 0; j < commonVo.attrList.length; j++) {
  //         const attrItem = commonVo.attrList[j];
  //         if (attrItem.defaultValue !== null && attrItem.defaultValue !== undefined) {
  //           this.$set(this.commonFormData.inputValues, attrItem.groupId + '_' + attrItem.id, attrItem.defaultValue);
  //         }
  //       }
  //     }
  //   },
  //   /**
  //    * 潘通色修改
  //    */
  //   pantoneChange() {
  //     this.priceValuation();
  //   },
  //   getPaperfn(data) {
  //     getPaper({ data: data }).then(res => {
  //       if (data == '4759_22625' || data == '4759_22626' || data == '4759_32419') {
  //         this.newlist = res.data.children;
  //       } else {
  //         this.newlist = [res.data.data];
  //       }
  //       this.loadingstatus = false;
  //     });
  //     if (this.tabType == '0') {
  //       setTimeout(() => {
  //         let qdata = this.getquickId(Object.values(this.quickFormData.radioSelectValues)[0]).flat();
  //         this.curquick = qdata[0].getid;
  //       }, 500);
  //     }
  //   },
  //   getraradiofn() {
  //     return this.$refs.PriceRight.getraradio();
  //   },
  //   getpaperId() {
  //     // this.newlist = [];
  //     this.loadingstatus = true;
  //     let newlist = this.formVoList.filter(e => {
  //       return e.miniZtAttrGroup.actualValue == 'superior';
  //     });
  //     if (this.curquickstatus == false) {
  //       this.datas = this.curquick;
  //     } else if (this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id] == '4758_22624') {
  //       this.datas = this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id + 1];
  //     } else {
  //       this.datas = this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id];
  //     }

  //     if (this.newstatus) {
  //       getPaper({ data: this.datas }).then(res => {
  //         if (this.datas == '4759_22625' || this.datas == '4759_22626' || this.datas == '4759_32419') {
  //           this.newlist = res.data.children;
  //         } else {
  //           this.newlist = [res.data.data];
  //         }
  //         this.loadingstatus = false;
  //       });
  //     }
  //   },
  //   // emptyPaperId() {
  //   //   this.$refs.child.emptyId();
  //   // },
  //   priceValuation2() {
  //     this.$refs.PriceRight.PaperChange2();
  //   },
  //   /**
  //    * 计价方法
  //    */
  //   async priceValuation(dataval) {
  //     this.dataval = dataval || '';
  //     await priceSynFunction(this.priceValuationNew);
  //   },
  //   async priceValuationNew() {
  //     const _this = this;
  //     const provinceId = _this.priceFormData.provinceId;
  //     const cityId = _this.priceFormData.cityId;
  //     const yssl = _this.priceFormData.yssl;
  //     const tkks = _this.priceFormData.tkks;
  //     const extendsStr = _this.priceFormData.extends;
  //     _this.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
  //     _this.priceFormData.provinceId = provinceId;
  //     _this.priceFormData.cityId = cityId;
  //     _this.priceFormData.yssl = yssl;
  //     _this.priceFormData.tkks = tkks;
  //     _this.priceFormData.extends = extendsStr;
  //     _this.formData.goodAttr = '';
  //     _this.priceFormData.priceProgress = true;
  //     let strVal = await commonValuation();
  //     if (strVal) {
  //       if (this.tabType == '0') {
  //         this.curquickstatus = false;
  //       } else {
  //         this.curquickstatus = true;
  //       }
  //       this.getpaperId();
  //       // _this.newlist = [];
  //       // _this.loadingstatus = true;
  //       strVal += '展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
  //       if (this.tabType === '0') {
  //         strVal += await this.quickPrice();
  //       } else {
  //         const dataResult = await this.dataChange();
  //         if (dataResult) {
  //           strVal += dataResult;
  //         } else {
  //           _this.priceFormData.priceProgress = false;
  //           return false;
  //         }
  //       }
  //       // if(this.formData.radioSelectValues['4759']&&this.formData.radioSelectValues['4759']=='4759_22625'){
  //       //   this.$refs.child.setradio('纸张材质:单铜纸_305');
  //       //   this.dataval='纸张材质:单铜纸_305;'
  //       // }else if(this.formData.radioSelectValues['4759']&&this.formData.radioSelectValues['4759']=='4759_22626'){
  //       //   this.$refs.child.setradio('纸张材质:单铜纸_305');
  //       //   this.dataval='纸张材质:单铜纸_305;'
  //       // }

  //       if (strEquals(_this.subCateId, '17')) {
  //         strVal += this.priceFormData.extends + ';粘合:自动锁底;';
  //       } else if (strEquals(_this.subCateId, '19') || strEquals(_this.subCateId, '21')) {
  //         strVal += this.priceFormData.extends + ';粘合:无;';
  //       } else {
  //         strVal += this.priceFormData.extends + ';粘合:自动粘1处;';
  //       }
  //       if (this.$route.query.cateId == 1) {
  //         if (this.priceFormData.yssl >= 10000) {
  //           this.priceFormData.extends = 1;
  //         }
  //         if (this.datas == '4759_22625' || this.datas == '4759_22626' || this.datas == '4759_32419') {
  //           strVal += this.dataval ? this.dataval + ';' : '';
  //         }
  //         strVal += this.datas ? '材质标识:' + this.datas + ';' : '';
  //       }

  //       let city = '';
  //       if (this.priceFormData.provinceId !== '') {
  //         city += getAreaName('province', this.priceFormData.provinceId);
  //       }
  //       if (this.priceFormData.cityId !== '') {
  //         if (city !== '') {
  //           city += ' ';
  //         }
  //         city += getAreaName('city', this.priceFormData.cityId);
  //       }
  //       console.log(strVal);
  //       // console.log(JSON.stringify(this.formData));
  //       // this.formData.goodAttr = '';
  //       priceInvoke({ goodsId: this.formData.goodAttrVo.id, goodsAttr: strVal, number: this.priceFormData.yssl, fnumber: this.priceFormData.tkks, cextends: this.priceFormData.extends, city: city })
  //         .then(res => {
  //           if (res.code === '970006') {
  //             _this.formData.showLoginDialog = true;
  //           } else {
  //             _this.priceFormData = Object.assign({}, this.priceFormData, res.data);
  //             _this.formData.goodAttr = strVal;
  //           }
  //           _this.priceFormData.priceProgress = false;
  //           _this.newstatus = false;
  //           // this.$refs.child.newlistfn2(res.data.paperVoList);
  //           _this.newlist = res.data.paperVoList;
  //           // if(this.datas=='4759_22625'||this.datas=='4759_22626'||this.datas=='4759_22627'||this.datas=='4759_32419'){
  //           //   this.newlist=res.data.children
  //           // }else{
  //           //   this.newlist = [res.data.data];
  //           // }
  //           _this.loadingstatus = false;
  //           // console.log('false', this.newlist);
  //         })
  //         .catch(res => {
  //           _this.formData.goodAttr = strVal;
  //           _this.priceFormData.priceProgress = false;
  //         });
  //     } else {
  //       _this.priceFormData.priceProgress = false;
  //       _this.newstatus = true;
  //     }
  //   },
  //   /**
  //    * 快捷计价
  //    */
  //   quickPrice() {
  //     let strVal = '';
  //     for (let i = 0; i < this.quickVoList.length; i++) {
  //       const attrList = this.quickVoList[i].attrList;
  //       for (let j = 0; j < attrList.length; j++) {
  //         if (attrList[j].actualValue) {
  //           for (const inx in this.quickFormData.radioSelectValues) {
  //             if (attrList[j].id === this.quickFormData.radioSelectValues[inx]) {
  //               strVal += attrList[j].actualValue;
  //               strVal += ';';
  //               break;
  //             }
  //           }
  //         }
  //       }
  //     }
  //     strVal += '印刷:单面印刷;';
  //     return strVal;
  //   },
  //   getquickId(event) {
  //     let qId = this.quickVoList.map(e => {
  //       return e.attrList.filter(n => {
  //         return n.id == event;
  //       });
  //     });
  //     return qId;
  //   },
  //   /**
  //    * 数据修改
  //    */
  //   async dataChange() {
  //     let strVal = await commonDataChange();
  //     return strVal;
  //   },
  //   curQuickRadioClick(event) {
  //     let data3 = this.getquickId(event);
  //     console.log(data3.flat(1)[0].getid);
  //     console.log(event);
  //     if(event==1){
  //       this.$refs.PriceRight.setradio('纸张材质:单铜纸_325');
  //     }else if(event==2){
  //       this.$refs.PriceRight.setradio('纸张材质:单铜纸_365');
  //     }
  //     cartQuickRadioClick(event);
  //     if (this.newstatus) {
  //       getPaper({ data: data3.flat(1)[0].getid }).then(res => {
  //         if (data3.flat(1)[0].getid == '4759_22625' || data3.flat(1)[0].getid == '4759_22626' || data3.flat(1)[0].getid == '4759_32419') {
  //           this.newlist = res.data.children;
  //         } else {
  //           this.newlist = [res.data.data];
  //         }
  //         this.curquick = data3.flat(1)[0].getid;
  //         this.curquickstatus = true;
  //         this.loadingstatus = false;
  //       });
  //     } else {
  //       this.curquick = data3.flat(1)[0].getid;
  //       this.curquickstatus = false;
  //       this.priceValuation(this.getraradiofn());
  //     }
  //   }
  // }
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
<style src="../../static/mulindex/css/public.css"></style>
<style src="../../static/mulindex/css/attr.css"></style>

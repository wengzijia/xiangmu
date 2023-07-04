<!-- fengjianbo -->
<template>
  <div>
    <el-row>
      <el-col v-loading="formData.loading">
        <div class="comBox guigeBox cardBox needhide" v-if="$route.query.subCateId == 127">
          <div class="guigeLt">
            <h1 class="flex guigeH1">
              <span class="geH1Lt">精装盒-定制精装盒规格选择 </span>
              <span class="lookBnt"><router-link :to="'/goods/goodsDesc?gid=' + formData.goodAttrVo.id" target="_blank">查看产品详情</router-link></span>
            </h1>
            <!-- <price-commontwo ref="childMethod" :fdata="fdata"></price-commontwo> -->
            <div class="dcardtabB">
              <div class="guigeImg" style="top: 68px">
                <img @mouseout="abc(false)" :class="showClass ? 'rotatemg' : ''" src="@/static/index/img/hardcover.png" />
              </div>
              <el-form class="guigeTop" ref="formData" :model="fdata" label-width="130px" @submit.native.prevent size="small" style="min-height: 130px; height: 130px">
                <br />
                <el-form-item :required="true" key="common" label="订购数量">
                  <div>
                    <div class="flex inputBx">
                      <div class="inputBxrow inputBxrowSize">
                        <el-input v-model="fdata.num" style="width: 180px" size="small">
                          <template slot="append">套</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item :required="true" label="设计稿">
                  <el-radio-group class="EattrMgroup" size="small" v-model="fdata.dnum" button-style="solid">
                    <el-row class="Eattrrow">
                      <el-radio-button size="small" label="有设计稿或包装样">有设计稿或包装样</el-radio-button>
                    </el-row>
                    <!-- <el-row class="Eattrrow">
                      <el-radio-button size="small" label="有包装样品">有包装样品</el-radio-button>
                    </el-row> -->
                    <el-row class="Eattrrow">
                      <el-radio-button size="small" label="需要包装设计">需要包装设计</el-radio-button>
                    </el-row>
                  </el-radio-group>
                </el-form-item>
                <br />
                <el-form-item label="描述设计需求" v-if="fdata.dnum == '需要包装设计'">
                  <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" placeholder="请描述您希望包装达成什么效果；如：这款产品主打创新和科技感... 包装需要突出科技和创新... 要显得高端大气... 主色调为红色..." v-model="fdata.textarea">
                  </el-input>
                </el-form-item>
                <el-form-item label="上传文件" v-if="fdata.dnum == '有设计稿或包装样'">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="MyHeader"
                    action="/api/consumer/proof/miniProof/uploadProofFile"
                    :on-change="handlechange"
                    :on-success="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :limit="1"
                    :auto-upload="false"
                  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="产品名称">
                  <el-input style="width: 200px" placeholder="输入产品名称" v-model="fdata.productname"> </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <PriceRighttwo class="fixedstatus" :priceFormData.sync="priceFormData" :hardcover="hardcover"></PriceRighttwo>
        </div>
        <div class="comBox guigeBox cardBox needhide" v-else>
          <div class="guigeLt">
            <h1 class="flex guigeH1">
              <span class="geH1Lt"><span v-if="$route.query.disposable" @click="$router.push('/disposable')" style="cursor: pointer">一次性餐饮包装--</span>{{ cateName }}-{{ subCateName }}规格选择 </span>
              <span class="lookBnt" v-if="$route.query.cateId != '122'"><router-link :to="'/goods/goodsDesc?gid=' + formData.goodAttrVo.id" target="_blank">查看产品详情</router-link></span>
            </h1>
            <!-- 公用部分 -->
            <price-common
              ref="PriceCommon"
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
              ref="PriceMajor"
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
              :SLXNumName="SLXNum"
              @setX="changeSLX"
              @event1="change($event)"
              :getraradiofn="getraradiofn"
              :priceFormData.sync="priceFormData"
              :addService="addService"
            ></price-major>
          </div>
          <price-right
            class="fixedstatus"
            :style="'margin-top:' + marginnum + 'px'"
            :newlist="newlist"
            :loadingstatus="loadingstatus"
            ref="PriceRight"
            :priceFormData.sync="priceFormData"
            :addCart="addCart"
            :addQuote="addQuote"
            :priceValuation="priceValuation"
            :goodsId="formData.goodAttrVo.id"
            :formData.sync="formData"
            :isShort="isShort"
          ></price-right>
        </div>
        <login-form :dialogVisible.sync="formData.showLoginDialog"></login-form>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <p style="text-align: center">询价单提交成功，我们会尽快联系您~</p>
      <p style="text-align: center">若您有其他的需求点击联系<span style="cursor: pointer;" class="red" @click="qiyu">在线客服</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogbtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   priceInitUtil,
//   addCopyGroupCk,
//   removeCopyGroupCk,
//   addCopyGroupRd,
//   removeCopyGroupRd,
//   commonValuation,
//   commonDataChange,
//   checkboxSelect,
//   selectSelect,
//   radioSelect,
//   getCommonVoList,
//   getSubName,
//   reSetSize,
//   getCateVoList,
//   getPagerCate,
//   cateChange,
//   getGoodAttrInfo,
//   numberChange,
//   otherInputChange,
//   addCart,
//   addQuote,
//   getAttrValue,
//   isReInSize,
//   getOtherMsg,
//   priceSynFunction,
//   addCommonSize,
//   removeCommonSize
// } from '@/utils/price/goodPriceUtil';
// import { defaultFormData, defaultPriceFormData } from '@/utils/price/goodPriceUtil';
// import { startWith, endWith, strEquals } from '@/utils/strUtil';
// import { craftInitUtil, isCopyCraft } from '@/utils/price/craftUtil';
// import LoginForm from '@/components/common/LoginForm';
// import PriceRight from '@/components/price/PriceRight';
// import PriceMajor from '@/components/price/PriceMajor';
// import PriceRighttwo from '@/components/price/PriceRighttwo';
// import PriceCommon from '@/components/price/PriceCommon';
// import { getAreaName } from '@/utils/city';
// import { priceInvoke } from '@/api/price/priceApi';
// import { computeSize } from '@/api/product/attrApi';
// import { getPaper } from '@/api/product/attrApi';
// import { addHardcoverOrder } from '@/api/order/orderApi';
// export default {
//   components: {
//     LoginForm,
//     PriceRight,
//     PriceMajor,
//     PriceCommon,
//     PriceRighttwo
//   },
//   data() {
//     return {
//       ...JSON.parse(JSON.stringify(defaultFormData)),
//       bindType: 'cate', // 绑定类型,cate:商品计价
//       isCommonSize: false,
//       number: 10,
//       SLXNum: 0,
//       fixedstatus: 'false',
//       hxid: '',
//       dataval: '',
//       newlist: [],
//       newstatus: true,
//       datas: '',
//       loadingstatus: true,
//       showClass: false,
//       fixednum: 0,
//       marginnum: 0,
//       divheight: 0,
//       fdata: {
//         num: '',
//         dnum: '有设计稿或包装样',
//         textarea: '',
//         productname: ''
//       },
//       filestatus: false,
//       centerDialogVisible: false,
//       fileList: [],
//       MyHeader: {
//         token: localStorage.getItem('Access-Token')
//       }
//     };
//   },
//   created() {
//     if (!this.$route.query.cateId) {
//       this.$router.push({ path: '/price/cartIndex?cateId=1&subCateId=15' });
//     }
//     if (this.$route.query.cateId == 122) {
//       if (!sessionStorage.getItem('size')) {
//         this.$router.push({ path: '/ironActivity' });
//       }
//     }
//     priceInitUtil(this);
//     craftInitUtil(this);
//     if (this.$route.query.cateId == 1) {
//       this.getPaperfn('4759_22625');
//     }
//     this.initPage();
//   },

//   watch: {
//     $route(to) {
//       this.initPage();
//       getGoodAttrInfo();
//       this.hxid = '';
//     },
//     subCateId: {
//       async handler() {
//         this.whereBindId = this.subCateId;
//         this.formVoList = [];
//         this.voList = [];
//         await cateChange();
//         await getGoodAttrInfo();
//         reSetSize();
//         // setTimeout(() => {
//         this.divheight = document.querySelector('.guigeLt').clientHeight;
//         this.fixednum = document.querySelector('.fixedstatus').clientHeight;
//         // console.log('watch', this.divheight);
//         // }, 100);
//       }
//     }
//   },
//   mounted() {
//     if (this.$route.query.cateId == '122' || this.$route.query.disposable) {
//       console.log('onscroll');
//     } else {
//       const scrollDiv = document.querySelector('body');
//       this.divheight = document.querySelector('.guigeLt').clientHeight;
//       this.fixednum = document.querySelector('.fixedstatus').clientHeight;
//       const divclass = document.querySelector('.guigeRtWrap');
//       let _this = this;
//       scrollDiv.onscroll = function() {
//         if (_this.divheight > _this.fixednum + 50) {
//           if (document.documentElement.scrollTop > 350) {
//             divclass.classList.add('fixedclass');
//             if (document.documentElement.scrollTop > _this.divheight - _this.fixednum + 350) {
//               divclass.classList.remove('fixedclass');
//               _this.marginnum = _this.divheight - _this.fixednum;
//             } else {
//               _this.marginnum = 0;
//             }
//           } else {
//             divclass.classList.remove('fixedclass');
//           }
//         }
//       };
//     }
//   },
//   methods: {
//     ...{ startWith, endWith },
//     ...{ checkboxSelect, selectSelect, radioSelect, removeCopyGroupCk, addCopyGroupCk, getCateVoList, numberChange, otherInputChange, addCart, addQuote, addCopyGroupRd, removeCopyGroupRd, addCommonSize, removeCommonSize },
//     ...{ isCopyCraft },
//     /**
//      * 初始化页面数据
//      */
//     async initPage() {
//       getPagerCate();
//       this.whereBindId = this.subCateId;
//       this.commonVoList = getCommonVoList(this.cateId, this.subCateId);
//       reSetSize();
//       this.clearData();
//       if (strEquals(this.cateId, '8') || strEquals(this.subCateId, '40')) {
//         this.formData.dmys.jybm = true;
//       }
//       await getSubName();
//     },
//     SelectEgg() {
//       this.formData.radioSelectValues[7732] = '7732_32636';
//       this.radioSelect('7732_32636');
//     },
//     change(data) {
//       this.hxid = data;
//       // console.log('子组件传来的值', this.hxid);
//     },
//     /**
//      * 清理数据
//      */
//     clearData() {
//       this.$set(this, 'formVoList', []);
//       this.$set(this, 'voList', []);
//       this.$set(this, 'formData', JSON.parse(JSON.stringify(defaultFormData.formData)));
//       this.$set(this, 'commonFormData', JSON.parse(JSON.stringify(defaultFormData.commonFormData)));
//       this.loadCommonDefault();
//       this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(defaultPriceFormData)));
//       if (this.$route.query.subCateId == '101') {
//         this.priceFormData.time_normal = 168;
//         this.priceFormData.days_normal = 7;
//       }
//     },
//     abc(val) {
//       const _this = this;
//       _this.showClass = true;
//       setTimeout(function() {
//         _this.showClass = false;
//       }, 800);
//     },
//     loadCommonDefault() {
//       for (let i = 0; i < this.commonVoList.length; i++) {
//         const commonVo = this.commonVoList[i];
//         for (let j = 0; j < commonVo.attrList.length; j++) {
//           const attrItem = commonVo.attrList[j];
//           if (attrItem.defaultValue !== null && attrItem.defaultValue !== undefined) {
//             this.$set(this.commonFormData.inputValues, attrItem.groupId + '_' + attrItem.id, attrItem.defaultValue);
//           }
//         }
//       }
//     },
//     /**
//      * 潘通色修改
//      */
//     pantoneChange() {
//       this.priceValuation();
//     },
//     getraradiofn() {
//       return this.$refs.PriceRight.getraradio();
//     },
//     getPaperfn(data) {
//       getPaper({ data: data }).then(res => {
//         if (data == '4759_22625' || data == '4759_22626' || data == '4759_32419') {
//           this.newlist = res.data.children;
//         } else {
//           this.newlist = [res.data.data];
//         }
//         this.loadingstatus = false;
//       });
//     },
//     getpaperId() {
//       // this.newlist = [];
//       this.loadingstatus = true;
//       let newlist = this.formVoList.filter(e => {
//         return e.miniZtAttrGroup.actualValue == 'superior';
//       });
//       if (this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id] == '4758_22624') {
//         this.datas = this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id + 1];
//       } else {
//         this.datas = this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id];
//       }
//       if (this.newstatus) {
//         getPaper({ data: this.datas }).then(res => {
//           if (this.datas == '4759_22625' || this.datas == '4759_22626' || this.datas == '4759_32419') {
//             this.newlist = res.data.children;
//           } else {
//             this.newlist = [res.data.data];
//           }
//           this.loadingstatus = false;
//         });
//       }
//     },
//     handleRemove(file, fileList) {
//       console.log(file, fileList);
//       console.log(this.fileList);
//       this.fileList = [];
//       this.filestatus = false;
//     },
//     handlePreview(file, fileList) {
//       console.log(file);
//       if (file.code == '000000') {
//         this.fileList = [{ name: fileList.name, url: file.data }];
//         this.addHardcoverOrderfn();
//       } else if (file.code === '970005') {
//         this.formData.showLoginDialog = true;
//       } else {
//         this.fileList = [];
//         this.$message({
//           message: file.message,
//           type: 'error'
//         });
//       }
//       console.log(fileList);
//       console.log(this.fileList);
//     },
//     addHardcoverOrderfn() {
//       let data = {
//         customName: this.fdata.productname,
//         designFile: this.fileList.length > 0 ? this.fileList[0].url : '',
//         number: this.fdata.num,
//         goodsAttr: this.fdata.dnum,
//         memo: this.fdata?.textarea || '',
//         cateId: 127,
//         address: this.fdata.address,
//         designpaperFrom: this.fdata.dnum == '有设计稿或包装样' ? 0 : 1
//       };
//       addHardcoverOrder(data).then(res => {
//         if (res.code == '000000') {
//           // console.log(res);
//           this.centerDialogVisible = true;
//         } else if (res.code == '970005') {
//         //   console.log('');
//         } else {
//           this.$message({
//             message: res.message,
//             type: 'error'
//           });
//         }
//       });
//     },
//     handlechange() {
//       this.filestatus = true;
//     },
//     submitUpload() {
//       console.log('fileListfileList', this.fileList);
//       this.$refs.upload.submit();
//     },
//     hardcover(address) {
//       console.log('this.fileList.length', this.fileList.length);
//       this.fdata.address = address;
//       if (this.fdata.dnum == '有设计稿或包装样' && this.filestatus) {
//         this.submitUpload();
//       } else {
//         // if (this.fdata.num && this.fdata.productname && ((this.fdata.dnum == '有设计稿' && this.fileList.length > 0) || (this.fdata.dnum == '包装设计' && this.fdata.textarea) || this.fdata.dnum == '有包装样品')) {
//         if (this.fdata.num && this.fdata.productname && (this.fdata.dnum == '有设计稿或包装样' || this.fdata.dnum == '需要包装设计')) {
//           this.addHardcoverOrderfn();
//         } else {
//           this.$message({
//             message: '请选择完整',
//             type: 'error'
//           });
//         }
//       }
//     },
//     dialogbtn() {
//       this.centerDialogVisible = false;
//       this.$router.go(0);
//     },
//     priceValuation2() {
//       this.$refs.PriceRight.PaperChange2();
//     },
//     // zhupdatefalse(){
//     //   this.$refs.PriceRight.zhupdate1();
//     // },
//     // zhupdatetrue(){
//     //   this.$refs.PriceRight.zhupdate2();
//     // },
//     /**
//      * 计价方法
//      */
//     async priceValuation(dataval) {
//       // console.log('priceValuationformData', this.formData.goodAttr);
//       //  if (this.$route.query.cateId == 10 && this.formData.goodAttr.indexOf("材质") < 0) {
//       //  this.$message({ type: 'error', message: '请完善信息' });
//       //  return
//       //  }
//       this.dataval = dataval || '';
//       await priceSynFunction(this.priceValuationNew);
//     },
//     async priceValuationNew() {
//       const _this = this;
//       const provinceId = _this.priceFormData.provinceId;
//       const cityId = _this.priceFormData.cityId;
//       const yssl = _this.priceFormData.yssl;
//       const tkks = _this.priceFormData.tkks;
//       const extendsStr = _this.priceFormData.extends;
//       _this.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
//       _this.priceFormData.provinceId = provinceId;
//       _this.priceFormData.cityId = cityId;
//       _this.priceFormData.yssl = yssl;
//       _this.priceFormData.tkks = tkks;
//       _this.priceFormData.extends = extendsStr;
//       let strVal = await commonValuation();
//       _this.priceFormData.priceProgress = true;
//       if (strVal) {
//         if (this.$route.query.cateId == 1) {
//           this.getpaperId();
//           // console.log('strVal',strVal);
//         }
//         if (strVal === ';') {
//           strVal = '';
//         }
//         if (strEquals(this.cateId, '10')) {
//           strVal += '品类:铁罐;';
//         } else if (strEquals(this.cateId, '8')) {
//           strVal += '品类:胶片盒;';
//         } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '39')) {
//           strVal += '品类:吸塑内托;';
//         } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '36')) {
//           strVal += '品类:EVA内托;';
//         } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '37')) {
//           strVal += '品类:海绵内托;';
//         } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '38')) {
//           strVal += '品类:珍珠棉内托;';
//         } else if (strEquals(this.cateId, '5') && strEquals(this.subCateId, '40')) {
//           strVal += '品类:数码不干胶;';
//         } else if (strEquals(this.cateId, '5') && strEquals(this.subCateId, '41')) {
//           strVal += '品类:传统不干胶;';
//         } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '101')) {
//           strVal += '品类:传统胶印吊牌;';
//         } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '14006')) {
//           strVal += '品类:新增吊牌;';
//         } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '42')) {
//           strVal += '品类:传统吊牌;';
//         } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '43')) {
//           strVal += '品类:数码吊牌;';
//         } else if (strEquals(this.cateId, '7') && strEquals(this.subCateId, '55')) {
//           strVal += '品类:固定尺寸手提袋;';
//         } else if (strEquals(this.cateId, '11') && strEquals(this.subCateId, '51')) {
//           strVal += '品类:纸杯;';
//         } else if (strEquals(this.cateId, '12') && strEquals(this.subCateId, '52')) {
//           strVal += '品类:纸巾盒;';
//         } else if (strEquals(this.cateId, '70')) {
//           strVal += '品类:外箱;';
//         } else if (strEquals(this.cateId, '86')) {
//           strVal += '品类:塑料盒;';
//         } else if (strEquals(this.cateId, '121')) {
//           strVal += '品类:塑料托盘;';
//         }

//         if (this.formData.goodSize.goodAl > 0) {
//           if (strEquals(this.subCateId, '85')) {
//             // strVal += '刀卡1展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
//           } else {
//             strVal += '展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
//           }
//         }
//         if (strEquals(this.cateId, '122')) {
//           let msize = sessionStorage.getItem('size').replace(/\*/g, '_');
//           strVal += '尺寸:' + msize + ';';
//         }
//         // strVal += '成品内尺寸2:66_66;展开尺寸2:96.00_96.00;';
//         if (strEquals(this.subCateId, '85')) {
//           if (_this.formData.goodSizeTwo.goodAl && _this.formData.goodSizeTwo.goodAw) {
//             strVal += '刀卡二尺寸:' + _this.commonFormData.inputValues['200_201'] + '_' + _this.commonFormData.inputValues['200_202'] + ';';
//             //strVal += '刀卡2展开尺寸:' + _this.formData.goodSizeTwo.goodAl + '_' + _this.formData.goodSizeTwo.goodAw + ';';
//           } else {
//             _this.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
//             return false;
//           }
//         }

//         if (strEquals(this.cateId, '3') && this.formData.goodSize.otherMap.outlong) {
//           const otherMap = this.formData.goodSize.otherMap;
//           strVal += '天盒面纸展开尺寸:' + otherMap.longFaceTop + '_' + otherMap.widthFaceTop + ';';
//           strVal += '天盒灰板展开尺寸:' + otherMap.longGreyTop + '_' + otherMap.widthGreyTop + ';';
//           strVal += '地盒面纸展开尺寸:' + otherMap.longFaceBut + '_' + otherMap.widthFaceBut + ';';
//           strVal += '地盒灰板展开尺寸:' + otherMap.longGreyBut + '_' + otherMap.widthGreyBut + ';';
//           strVal += '成品外尺寸:' + otherMap.outlong + '_' + otherMap.outwidth + '_' + otherMap.outheight + ';';
//         }
//         const dataResult = await this.dataChange();

//         if (dataResult) {
//           strVal += dataResult;
//         } else {
//           _this.priceFormData.priceProgress = false;
//           return false;
//         }
//         if (strEquals(this.cateId, '1')) {
//           if (strVal.indexOf('粘合:') === -1) {
//             strVal += '粘合:不粘;';
//           }
//         } else if (strEquals(this.cateId, '2') && strEquals(this.subCateId, '31')) {
//           strVal += '驳数:双驳;';
//           strVal += '粘合:粘;';
//         } else if (strEquals(this.cateId, '4') && strEquals(this.subCateId, '35')) {
//           strVal += '粘合:无;';
//         } else if (strEquals(this.cateId, '5') && strEquals(this.subCateId, '40')) {
//           strVal += '粘合:无;';
//         } else if (strEquals(this.cateId, '5') && strEquals(this.subCateId, '41')) {
//           strVal += '粘合:无;';
//         } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '43') && strVal.indexOf('开孔形状:不开孔;') !== -1) {
//           strVal += '开孔数:0;';
//         } else if (strEquals(this.cateId, '9') && strEquals(this.subCateId, '46')) {
//           strVal += '开孔形状:不开孔;开孔数:0;';
//         }
//         if (this.$route.query.cateId == 1) {
//           if (this.priceFormData.yssl >= 10000) {
//             this.priceFormData.extends = 1;
//           }
//           if (this.datas == '4759_22625' || this.datas == '4759_22626' || this.datas == '4759_32419') {
//             strVal += this.dataval ? this.dataval + ';' : '';
//           }
//           strVal += this.datas ? '材质标识:' + this.datas + ';' : '';
//         }
//         if (this.$route.query.subCateId == 42&&this.formData.bkstatus) {
//           strVal += '对裱:'+this.formData.bkkg+';裱卡表处理:'+this.formData.bkbmcl+';';
//         }
//         if (strEquals(this.cateId, '70') && this.formData.ysm.scCount > 0) {
//           for (let i = 0; i < this.formData.ysm.scCount; i++) {
//             const item = this.formData.ysm.list[i];
//             if (item.longVal && item.widthVal) {
//               strVal += '实际印刷尺寸' + (i + 1) + ':' + item.longVal + '_' + item.widthVal + ';';
//             }
//           }
//         }
//         if (strEquals(this.cateId, '70') || (strEquals(this.cateId, '2') && strEquals(this.subCateId, '31'))) {
//           strVal = getAttrValue(this.cateId, this.subCateId, strVal);
//           if (strEquals(this.subCateId, '85')) {
//             strVal += ';';
//           }
//         }
//         strVal += this.priceFormData.extends + ';';

//         let city = '';
//         if (this.priceFormData.provinceId !== '') {
//           city += getAreaName('province', this.priceFormData.provinceId);
//         }
//         if (this.priceFormData.cityId !== '') {
//           if (city !== '') {
//             city += ' ';
//           }
//           city += getAreaName('city', this.priceFormData.cityId);
//         }
//         strVal = this.sortAttrStr(strVal, '品类:');
//         // if(this.$route.query.cateId==10 && strVal.indexOf("材质")<0){
//         //   this.$message({ type: 'error', message: '请完善材质信息' });
//         //   // return
//         // }
//         console.log(strVal);
//         this.formData.hxid = this.hxid;
//         // console.log(JSON.stringify(this.formData));
//         // console.log(JSON.stringify(this.commonFormData));
//         priceInvoke({ goodsId: this.formData.goodAttrVo.id, goodsAttr: strVal + this.hxid, number: this.priceFormData.yssl, fnumber: this.priceFormData.tkks, cextends: this.priceFormData.extends, city: city })
//           .then(res => {
//             if (res.code === '970006') {
//               this.formData.showLoginDialog = true;
//             } else {
//               this.priceFormData = Object.assign({}, this.priceFormData, res.data);
//               this.formData.goodAttr = strVal;
//             }
//             _this.priceFormData.priceProgress = false;
//             _this.newstatus = false;
//             _this.newlist = res.data.paperVoList;
//             _this.loadingstatus = false;
//           })
//           .catch(res => {
//             _this.formData.goodAttr = strVal;
//             _this.priceFormData.priceProgress = false;
//           });
//       } else {
//         _this.priceFormData.priceProgress = false;
//         _this.newstatus = true;
//       }
//     },
//     sortAttrStr(strVal, attrName) {
//       if (strVal.indexOf(attrName) !== -1) {
//         const attrStartIndex = strVal.indexOf(attrName);
//         const attrEndIndex = strVal.indexOf(';', attrStartIndex);
//         const newStr = strVal.substring(attrStartIndex, attrEndIndex + 1) + strVal.substring(0, attrStartIndex) + strVal.substring(attrEndIndex + 1);
//         return newStr;
//       }
//       return strVal;
//     },
//     /**
//      * 数据修改
//      */
//     async dataChange() {
//       let strVal = await commonDataChange();
//       return strVal;
//     },
//     changeSLX(val) {
//       // console.log(val);
//       this.SLXNum = val;
//       this.$refs.PriceCommon.setSLXNumValue(val);
//       this.$refs.PriceRight.setSLXNumValue(val);
//       console.log('SLXn', this.SLXNum);
//     }
//   }
// };
import price from './mixins/Index';
import qiyu from '@/mixins/qiyu';
export default {
  mixins: [price, qiyu]
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

<!-- fengjianbo -->
<template>
  <div>
    <el-row>
      <el-col v-loading="formData.loading">
        <div class="guigeLt">
          <goods-size-info :goodsSizeInfo="goodsSizeInfo"></goods-size-info>
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
            :SLXNumName="SLXNum"
            @setX="changeSLX"
            @event1="change($event)"
            :getraradiofn="getraradiofn"
            :priceFormData.sync="priceFormData"
            :addService="addService"
            :baseIds="baseIds"
          ></price-major>
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
  isReInSize,
  getOtherMsg,
  priceSynFunction,
  addCommonSize,
  removeCommonSize
} from './price/goodPriceUtil';
import { defaultFormData, defaultPriceFormData, radioSelect2, checkboxSelect2 } from './price/goodPriceUtil';
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { craftInitUtil, isCopyCraft } from './price/craftUtil';
import PriceMajor from './components/PriceMajor';
import { getAreaName } from '@/utils/city';
import { priceInvoke } from '@/api/price/priceApi';
import { computeSize } from '@/api/product/attrApi';
import { getPaper } from '@/api/product/attrApi';
import { addHardcoverOrder } from '@/api/order/orderApi';
import { debounce } from '@/utils/utils';
import setFormData from './mixins/setFromData.js';
export default {
  mixins: [setFormData],
  name: 'Index',
  components: {
    PriceMajor
  },
  data() {
    return {
      ...JSON.parse(JSON.stringify(defaultFormData)),
      bindType: 'cate', // 绑定类型,cate:商品计价
      isCommonSize: false,
      number: 10,
      SLXNum: 0,
      fixedstatus: 'false',
      hxid: '',
      dataval: '',
      newlist: [],
      newstatus: true,
      datas: '',
      loadingstatus: true,
      showClass: false,
      fixednum: 0,
      marginnum: 0,
      divheight: 0,
      fdata: {
        num: '',
        dnum: '有设计稿或包装样',
        textarea: '',
        productname: ''
      },
      filestatus: false,
      centerDialogVisible: false,
      fileList: [],
      bis1: '外箱套蛇皮袋:否;',
      bis2: '外箱贴标签:否;',
      MyHeader: {
        token: localStorage.getItem('Access-Token')
      },
      formVoListId: '',
      isShort: false
    };
  },
  async created() {
    let _this = this;
    _this.cateId = _this.baseIds.cateId;
    _this.subCateId = _this.baseIds.subCateId;
    _this.goodsId = _this.baseIds.goodsId;
    // if (!this.cateId) {
    //   this.$router.push({ path: '/price/cartIndex?cateId=1&subCateId=15' });
    // }
    // if (this.cateId == 122) {
    //   if (!sessionStorage.getItem('size')) {
    //     this.$router.push({ path: '/ironActivity' });
    //   }
    // }
    priceInitUtil(this);
    craftInitUtil(this);
    if (this.cateId == 1) {
      this.getPaperfn('4759_22625');
    }
    this.initPage();
    this.whereBindId = this.subCateId;
    this.formVoList = [];
    this.voList = [];
    await cateChange();
    await getGoodAttrInfo();
    reSetSize();
    //  名片和联单调用计价接口
    // if (this.cateId == '143' || this.cateId == '145') {
    //   this.priceValuation();
    // }
    if (_this.oldFormData.commonFormDatainputValue) {
      let formData = JSON.parse(JSON.stringify(_this.oldFormData));
      _this.setFormData(formData.commonFormDatainputValue, JSON.parse(JSON.stringify(formData.formDatainputValue)));
    }
  },

  watch: {
    // $route(to) {
    //   this.initPage();
    //   getGoodAttrInfo();
    //   this.hxid = '';
    //   // 切换盒型不显示牛皮纸短货期
    //   this.isShort = false;
    //   //  名片和联单调用计价接口
    //   // if (this.cateId == '143' || this.cateId == '145') {
    //   //   this.priceValuation();
    //   // }
    // },
    // subCateId: {
    //   async handler() {
    //     // this.whereBindId = this.subCateId;
    //     // this.formVoList = [];
    //     // this.voList = [];
    //     // await cateChange();
    //     // await getGoodAttrInfo();
    //     // reSetSize();
    //     // setTimeout(() => {
    //     // this.divheight = document.querySelector('.guigeLt')?.clientHeight;
    //     // this.fixednum = document.querySelector('.fixedstatus')?.clientHeight;
    //     // console.log('watch', this.divheight);
    //     // }, 100);
    //   }
    // }
  },
  mounted() {
    // if (this.cateId == '122' || this.disposable) {
    //   console.log('onscroll');
    // } else {
    //   const scrollDiv = document.querySelector('body');
    //   this.fixednum = document.querySelector('.fixedstatus').clientHeight;
    //   const divclass = document.querySelector('.fixedstatus');
    //   scrollDiv.onscroll = () => {
    //     const divheight = document.querySelector('.guigeLt')?.clientHeight;
    //     const guigeRtWrap = document.querySelector('.guigeRtWrap')?.clientHeight;
    //     if (document.documentElement.scrollTop > 350) {
    //       if (document.documentElement.scrollTop > divheight + 350 - guigeRtWrap) {
    //         divclass.style.marginTop = divheight - guigeRtWrap + 'px';
    //       } else {
    //         divclass.style.marginTop = document.documentElement.scrollTop - 350 + 'px';
    //       }
    //     } else {
    //       divclass.style.marginTop = 0;
    //     }
    //   };
    // }
  },
  methods: {
    ...{ startWith, endWith },
    ...{ checkboxSelect, selectSelect, radioSelect, removeCopyGroupCk, addCopyGroupCk, getCateVoList, numberChange, otherInputChange, addCart, addQuote, addCopyGroupRd, removeCopyGroupRd, addCommonSize, removeCommonSize },
    ...{ isCopyCraft },
    /**
     * 初始化页面数据
     */
    async initPage() {
      getPagerCate();
      this.whereBindId = this.subCateId;
      this.commonVoList = getCommonVoList(this.cateId, this.subCateId);
      console.log('this.commonVoList', this.commonVoList);
      reSetSize();
      this.clearData();
      if (strEquals(this.cateId, '8') || strEquals(this.subCateId, '40')) {
        this.formData.dmys.jybm = true;
      }
      await getSubName();
    },
    SelectEgg() {
      this.formData.radioSelectValues[7732] = '7732_32636';
      this.radioSelect('7732_32636');
    },
    change(data) {
      this.hxid = data;
      // console.log('子组件传来的值', this.hxid);
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
      if (this.subCateId == '101') {
        this.priceFormData.time_normal = 168;
        this.priceFormData.days_normal = 7;
      }
    },
    abc(val) {
      const _this = this;
      _this.showClass = true;
      setTimeout(function() {
        _this.showClass = false;
      }, 800);
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
            // 修改名片和联单印刷数量默认值
            if (this.cateId == '145') {
              attrItem.defaultValue = 50;
            } else if (this.cateId == '143') {
              attrItem.defaultValue = 100;
            }
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
    getraradiofn() {
      // if (this.isCms) return;
      // return this.$refs.PriceRight.getraradio();
    },
    getPaperfn(data) {
      getPaper({ data: data }).then(res => {
        if (data == '4759_22625' || data == '4759_22626' || data == '4759_32419') {
          this.newlist = res.data.children;
        } else {
          this.newlist = [res.data.data];
        }
        this.loadingstatus = false;
      });
    },
    getpaperId() {
      // this.newlist = [];
      this.loadingstatus = true;
      let newlist = this.formVoList.filter(e => {
        return e.miniZtAttrGroup.actualValue == 'superior';
      });
      if (this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id] == '4758_22624') {
        this.datas = this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id + 1];
      } else {
        this.datas = this.formData.radioSelectValues[newlist[0].miniZtAttrGroup.id];
      }
      if (this.newstatus) {
        getPaper({ data: this.datas }).then(res => {
          if (this.datas == '4759_22625' || this.datas == '4759_22626' || this.datas == '4759_32419') {
            this.newlist = res.data.children;
          } else {
            this.newlist = [res.data.data];
          }
          this.loadingstatus = false;
        });
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log(this.fileList);
      this.fileList = [];
      this.filestatus = false;
    },
    handlePreview(file, fileList) {
      console.log(file);
      if (file.code == '000000') {
        this.fileList = [{ name: fileList.name, url: file.data }];
        this.addHardcoverOrderfn();
      } else if (file.code === '970005') {
        this.formData.showLoginDialog = true;
      } else {
        this.fileList = [];
        this.$message({
          message: file.message,
          type: 'error'
        });
      }
      console.log(fileList);
      console.log(this.fileList);
    },
    addHardcoverOrderfn() {
      let data = {
        customName: this.fdata.productname,
        designFile: this.fileList.length > 0 ? this.fileList[0].url : '',
        number: this.fdata.num,
        goodsAttr: this.fdata.dnum,
        memo: this.fdata?.textarea || '',
        cateId: 127,
        address: this.fdata.address,
        designpaperFrom: this.fdata.dnum == '有设计稿或包装样' ? 0 : 1
      };
      addHardcoverOrder(data).then(res => {
        if (res.code == '000000') {
          // console.log(res);
          this.centerDialogVisible = true;
        } else if (res.code == '970005') {
          //   console.log('');
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      });
    },
    handlechange() {
      this.filestatus = true;
    },
    submitUpload() {
      console.log('fileListfileList', this.fileList);
      // this.$refs.upload.submit();
    },
    hardcover(address) {
      console.log('this.fileList.length', this.fileList.length);
      this.fdata.address = address;
      if (this.fdata.dnum == '有设计稿或包装样' && this.filestatus) {
        this.submitUpload();
      } else {
        // if (this.fdata.num && this.fdata.productname && ((this.fdata.dnum == '有设计稿' && this.fileList.length > 0) || (this.fdata.dnum == '包装设计' && this.fdata.textarea) || this.fdata.dnum == '有包装样品')) {
        if (this.fdata.num && this.fdata.productname && (this.fdata.dnum == '有设计稿或包装样' || this.fdata.dnum == '需要包装设计')) {
          this.addHardcoverOrderfn();
        } else {
          this.$message({
            message: '请选择完整',
            type: 'error'
          });
        }
      }
    },
    dialogbtn() {
      this.centerDialogVisible = false;
      this.$router.go(0);
    },
    priceValuation2() {
      if (this.isCms) return;
      // this.$refs.PriceRight.PaperChange2();
    },
    // zhupdatefalse(){
    //   this.$refs.PriceRight.zhupdate1();
    // },
    // zhupdatetrue(){
    //   this.$refs.PriceRight.zhupdate2();
    // },
    /**
     * 计价方法
     */
    async priceValuation(dataval, val, unit, id) {
      // console.log('priceValuationformData', this.formData.goodAttr);
      //  if (this.cateId == 10 && this.formData.goodAttr.indexOf("材质") < 0) {
      //  this.$message({ type: 'error', message: '请完善信息' });
      //  return
      //  }
      // 传统标签限制间距最大值
      if (this.$route.query.subCateId == '41' && unit == 'mm' && id) {
        if (val == '') {
          // 左右间距输入框id
          let leftRightSpacing = ['16821_53460', '18141_57596', '18148_57603', '18152_57610', '18156_57617'];
          // 上下间距输入框id
          let upDownSpacing = ['16822_53461', '18142_57597', '18149_57604', '18153_57611', '18157_57618'];
          if (leftRightSpacing.includes(id)) {
            this.formData.inputValues[id] = 3;
          } else if (upDownSpacing.includes(id)) {
            this.formData.inputValues[id] = 5;
          }
        } else if (val > 5) {
          this.$message({ type: 'error', message: '最大不能超过5mm' });
          this.formData.inputValues[id] = 5;
        }
      }
      // 坑纸内托粘合限制
      if (this.subCateId == '34' && val > 3 && unit == '粘位' && id) {
        this.$message({ type: 'error', message: '最大不能超过3个粘位' });
        this.formData.inputValues[id] = 3;
      }
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
        // 联单印刷数量限制
      } else if (strEquals(that.cateId, '145')) {
        if (parseInt(val) < 50) {
          that.$message({ type: 'error', message: '50本起订' });
          data.data[data.dataKey] = 50;
        }
        return false;
      } else if (parseInt(val) < 100) {
        that.$message({ type: 'error', message: '100个起印' });
        data.data[data.dataKey] = 100;
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
      let strVal = await commonValuation();
      _this.priceFormData.priceProgress = true;
      if (strVal) {
        if (this.cateId == 1) {
          this.getpaperId();
          // console.log('strVal',strVal);
        }
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
        } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '101')) {
          strVal += '品类:传统胶印吊牌;';
        } else if (strEquals(this.cateId, '6') && strEquals(this.subCateId, '14006')) {
          strVal += '品类:新增吊牌;';
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
        } else if (strEquals(this.cateId, '86')) {
          strVal += '品类:塑料盒;';
        } else if (strEquals(this.cateId, '121')) {
          strVal += '品类:塑料托盘;';
        } else if (strEquals(this.cateId, '143')) {
          strVal += '品类:名片;';
        } else if (strEquals(this.cateId, '145')) {
          strVal += '品类:联单;';
        }

        if (this.formData.goodSize.goodAl > 0) {
          // 由于subCateId=24牛皮纸的短货期，赋值了长宽，所以这里不需要拼接
          if (strEquals(this.subCateId, '85') || strEquals(this.subCateId, '24')) {
            // strVal += '刀卡1展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
          } else {
            strVal += '展开尺寸:' + this.formData.goodSize.goodAl + '_' + this.formData.goodSize.goodAw + ';';
          }
        }
        if (strEquals(this.cateId, '122')) {
          let msize = sessionStorage.getItem('size').replace(/\*/g, '_');
          strVal += '尺寸:' + msize + ';';
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

        if (strEquals(this.cateId, '3') && this.formData.goodSize.otherMap.outlong) {
          const otherMap = this.formData.goodSize.otherMap;
          strVal += '天盒面纸展开尺寸:' + otherMap.longFaceTop + '_' + otherMap.widthFaceTop + ';';
          strVal += '天盒灰板展开尺寸:' + otherMap.longGreyTop + '_' + otherMap.widthGreyTop + ';';
          strVal += '地盒面纸展开尺寸:' + otherMap.longFaceBut + '_' + otherMap.widthFaceBut + ';';
          strVal += '地盒灰板展开尺寸:' + otherMap.longGreyBut + '_' + otherMap.widthGreyBut + ';';
          strVal += '成品外尺寸:' + otherMap.outlong + '_' + otherMap.outwidth + '_' + otherMap.outheight + ';';
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
        if (this.cateId == 1) {
          if (this.priceFormData.yssl >= 10000) {
            this.priceFormData.extends = 1;
          }
          if (this.datas == '4759_22625' || this.datas == '4759_22626' || this.datas == '4759_32419') {
            strVal += this.dataval ? this.dataval + ';' : '';
          }
          strVal += this.datas ? '材质标识:' + this.datas + ';' : '';
        }

        // if (this.subCateId == 42 && this.formData.bkstatus) {
        //   strVal += '对裱:' + this.formData.bkkg + ';裱卡表处理:' + this.formData.bkbmcl + ';';
        // }
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
          if (strEquals(this.subCateId, '85')) {
            strVal += ';';
          }
        }
        strVal += this.priceFormData.extends + ';';
        // 加上包装服务
        if (this.cateId == 1 || this.cateId == 2) {
          // let bis1 = '外箱套蛇皮袋:否;';
          // let bis2 = '外箱贴标签:否;';
          if (this.priceFormData.checkedService.length > 0) {
            this.priceFormData.checkedService.map(item => {
              if (item == '1') {
                this.bis1 = '外箱套蛇皮袋:是;';
              }
              //  else if (item == '2') {
              //   bis2 = '外箱贴标签:是;';
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
        strVal = this.sortAttrStr(strVal, '品类:');
        // if(this.cateId==10 && strVal.indexOf("材质")<0){
        //   this.$message({ type: 'error', message: '请完善材质信息' });
        //   // return
        // }
        if (this.subCateId == '29' || this.subCateId == '30' || this.subCateId == '31') {
          strVal = strVal.replace('印刷类型:拼版印刷;', '');
        }
        // 添加名片尺寸参数
        let cardSize = this.cateId == '143' && this.subCateId == '144' ? '名片尺寸:90_54;' : '';
        strVal += cardSize;
        console.log(strVal);
        let yssl2 = this.ysslCheck();
        if (yssl2 && Number(yssl2) > Number(this.priceFormData.yssl)) this.priceFormData.yssl = yssl2;
        this.formData.hxid = this.hxid;
        // console.log(JSON.stringify(this.formData));
        // console.log(JSON.stringify(this.commonFormData));
        // priceInvoke({ goodsId: this.formData.goodAttrVo.id, goodsAttr: strVal + this.hxid, number: this.priceFormData.yssl, fnumber: this.priceFormData.tkks, cextends: this.priceFormData.extends, city: city })
        //   .then(res => {
        //     if (res.code === '970006') {
        //       this.formData.showLoginDialog = true;
        //     } else {
        //       this.priceFormData = Object.assign({}, this.priceFormData, res.data);
        //       this.formData.goodAttr = strVal;
        //     }
        //     _this.priceFormData.priceProgress = false;
        //     _this.newstatus = false;
        //     _this.newlist = res.data.paperVoList;
        //     _this.loadingstatus = false;
        //   })
        //   .catch(res => {
        //     _this.formData.goodAttr = strVal;
        //     _this.priceFormData.priceProgress = false;
        //   });
        _this.priceFormData.priceProgress = false;
        _this.$emit('setGoodsAttr', strVal + _this.hxid);
      } else {
        console.log('dasdasdcasdasdasd');
        _this.priceFormData.priceProgress = false;
        _this.newstatus = true;
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
    },
    changeSLX(val) {
      // console.log(val);
      this.SLXNum = val;
      // this.$refs.PriceCommon?.setSLXNumValue(val);
      // this.$refs.PriceRight?.setSLXNumValue(val);
      console.log('SLXn', this.SLXNum);
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

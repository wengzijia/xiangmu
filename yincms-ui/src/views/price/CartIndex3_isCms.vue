<!-- fengjianbo -->
<template>
  <div ref="tree" v-resize="monResize">
    <el-row>
      <el-col v-loading="formData.loading">
        <div class="comBox guigeBox cardBox needhide">
          <div class="guigeLt">
            <!-- 公用部分 -->
            <price-common
              v-if="isFlat"
              :number-change="numberChange"
              :otherInputChange="otherInputChange"
              :price-valuation="priceValuation"
              :form-data.sync="formData"
              :common-form-data.sync="commonFormData"
              :common-vo-list.sync="commonVoList"
            ></price-common>

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
              :getraradiofn="getraradiofn"
              :disabledObj="disabledObj"
              :priceFormData.sync="priceFormData"
              :addService="addService"
            ></price-major>
          </div>
          <price-right
            ref="PriceRight"
            class="fixedstatus"
            :style="'margin-top:' + marginnum + 'px'"
            :newlist="newlist"
            :loadingstatus="loadingstatus"
            :priceFormData.sync="priceFormData"
            :addCart="addCart"
            :addQuote="addQuote"
            :priceValuation="priceValuation"
            :goodsId="formData.goodAttrVo.id"
            :formData.sync="formData"
            :isShort="isShort"
          ></price-right>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import entiretyIframe from './mixins/entiretyIframe';
import cartIndex from './mixins/cartIndex';

export default {
  mixins: [cartIndex, entiretyIframe],
  data() {
    return {
      isFlat: true,
      disabledObj: {
        disabledArr: ['纸张材质', '纸张厚度/克重', '印刷类型', '纸张克重/厚度'],
        pDisabledArr: ['纸张材质'],
        pass: ['背面处理']
      }
    };
  },
  created() {
    if (this.$route.query.flat === 'true') {
      this.isFlat = false;
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
<style src="../../static/mulindex/css/public.css"></style>
<style src="../../static/mulindex/css/attr.css"></style>

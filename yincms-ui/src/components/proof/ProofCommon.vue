<template>
  <div class="cardtabB">
    <div class="guigeImg">
      <img :src="formData.goodAttrVo.coverPath" @mouseout="abc(false)" :class="showClass ? 'rotatemg' : ''" />
    </div>
    <el-form class="guigeTop" ref="formData" :model="formData" label-width="130px" @submit.native.prevent size="small">
      <template v-for="(item, index) in commonVoList">
        <!-- 共用部分 -->
        <el-form-item :key="'common_' + index" :label="item.name" v-show="item.name!=='同款款数'">
          <div v-if="item.groupType === 'input'">
            <div class="flex inputBx" v-if="item.code === 'SIZE'">
              <template v-if="formData.goodAttrVo.id">
                <template v-for="attr in item.attrList">
                  <div class="inputBxrow inputBxrowSize" :key="attr.id" v-if="formData.goodAttrVo.id && formData.goodAttrVo[attr.code] === 1">
                    <el-input
                      v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]"
                      :placeholder="attr.inputTips"
                      size="small"
                      @change="numberChange($event, { data: commonFormData.inputValues, name: attr.name, dataKey: attr.groupId + '_' + attr.id, min: formData.goodAttrVo[attr.code + 'Min'], max: formData.goodAttrVo[attr.code + 'Max'] })"
                    >
                      <template slot="append">{{ formData.goodAttrVo[attr.code] === 1 ? formData.appendsDesc[attr.code] : attr.suffix }}</template>
                    </el-input>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="inputBxrow" v-for="attr in item.attrList" :key="attr.id">
                  <el-input v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small" @change="priceValuation">
                    <template slot="append">{{ attr.suffix }}</template>
                  </el-input>
                </div>
              </template>
            </div>
            <div class="flex inputBx" v-else>
              <div class="inputBxrow" v-for="attr in item.attrList" :key="attr.id">
                <el-input
                  v-if="attr.max"
                  v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]"
                  :placeholder="attr.inputTips"
                  :disabled="$route.query.cateId === '70' ? true : false"
                  size="small"
                  @change="numberChange($event, { data: commonFormData.inputValues, name: attr.name, dataKey: attr.groupId + '_' + attr.id, min: attr.min, max: attr.max }, 'yssl')"
                >
                  <template slot="append">{{ attr.suffix }}</template>
                </el-input>
                <el-input v-else v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small" @change="priceValuation">
                  <template slot="append">{{ attr.suffix }}</template>
                </el-input>
              </div>
              <span v-if="item.code === 'TKKS' && ($route.query.cateId === '1' || $route.query.cateId === '2' || $route.query.cateId === '6' || $route.query.cateId === '8')" class="f12 C9">（同个订单多款设计文件请打包或放在同个文件里上传）</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="item.code === 'SIZE' && formData.goodSize.goodAl" :key="'common_size_' + index" label="展开尺寸"> {{ formData.goodSize.goodAl }}mm*{{ formData.goodSize.goodAw }}mm </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PriceCommon',
  props: {
    commonVoList: Array,
    commonFormData: Object,
    formData: Object,
    priceValuation: Function,
    numberChange: Function,
    otherInputChange: Function
  },
  data() {
    return {
      showClass: false
    };
  },
  methods: {
    abc(val) {
      const _this = this;
      _this.showClass = true;
      setTimeout(function() {
        _this.showClass = false;
      }, 800);
    }
  }
};
</script>
<style>
.inputBx {
  width: 75%;
  display: block;
}
.inputBxrow {
  display: inline-block;
  height: 32px;
}
.inputBxrowSize:nth-child(4) {
  margin-top: 15px;
  border-left: 1px solid #dcdfe6;
}
</style>

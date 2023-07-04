<template>
  <div class="cardtabB">
    <div class="guigeImg">
      <img :src="formData.goodAttrVo.coverPath" @mouseout="abc(false)" :class="showClass ? 'rotatemg' : ''" />
    </div>

    <el-form class="guigeTop" ref="formData" :model="formData" label-width="130px" @submit.native.prevent size="small">
      <template v-for="(item, index) in commonVoList">
        <!-- 共用部分 -->
        <el-form-item :required="true" :key="'common_' + index" :label="item.name">
          <template slot="label">
            {{ item.name }}
            <el-tooltip v-if="item.code === 'TKKS'" width="200" class="item" effect="light" placement="top-start">
              <div slot="content">同款指参数工艺及数量相同，仅设计稿内容不同的{{ $route.query.cateId === '13' ? formData.subCateName : formData.cateName }}</div>
              <em class="guigeTis">?</em>
            </el-tooltip>
          </template>
          
          <div v-if="item.groupType === 'input'">
            <!-- <div class="flex inputBx" v-if="item.code === 'SIZE'">
              <template v-if="formData.goodAttrVo.id">
                <template v-for="attr in item.attrList">
                  <div class="inputBxrow inputBxrowSize" :key="attr.id" v-if="formData.goodAttrVo.id && formData.goodAttrVo[attr.code] === 1">
                    <el-input
                      v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]"
                      :placeholder="attr.inputTips"
                      style="width: 180px;"
                      size="small"
                      @change="numberChange($event, { data: commonFormData.inputValues, code: attr.code, name: attr.name, dataKey: attr.groupId + '_' + attr.id, min: formData.goodAttrVo[attr.code + 'Min'], max: formData.goodAttrVo[attr.code + 'Max'] })"
                    >
                      <template slot="append">{{ formData.goodAttrVo[attr.code] === 1 ? formData.appendsDesc[attr.code] : attr.suffix }}</template>
                    </el-input>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="inputBxrow" v-for="attr in item.attrList" :key="attr.id">
                  <el-input v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small"
                            @change="priceValuation">
                    <template slot="append">{{ attr.suffix }}</template>
                  </el-input>
                </div>
              </template>
            </div> -->
            <div class="flex inputBx" >
            <!-- <div class="flex inputBx" v-else> -->
              <div class="inputBxrow" v-for="attr in item.attrList" :key="attr.id">
                <el-input
                  v-if="attr.max"
                  v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]"
                  :placeholder="attr.inputTips"
                  size="small"
                  @change="numberChange($event, { data: commonFormData.inputValues, name: attr.name, dataKey: attr.groupId + '_' + attr.id, min: attr.min, max: attr.max }, 'yssl')"
                >
                  <template slot="append">{{ attr.suffix }}</template>
                </el-input>
                <el-input v-else v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small"
                          @change="otherInputChange($event, { data: commonFormData.inputValues, code: item.code, name: attr.name, dataKey: attr.groupId + '_' + attr.id})">
                  <template slot="append">{{ attr.suffix }}</template>
                </el-input>
                <span v-if="item.code === 'YSSL' && $route.query.cateId === '1'" style="font-size: 10px;color: red">（1000个起印，请输入1000的整数倍）</span>
                <!-- <span v-if="item.code === 'YSSL' && $route.query.cateId === '1'" style="font-size: 10px;color: #9a9a9a">（1000个起印，请输入1000的整数倍）</span> -->
                <span v-if="item.code === 'YSSL' && $route.query.cateId === '70'" style="font-size: 10px;color: #9a9a9a">（50个起订）</span>
                <span v-if="item.code === 'YSSL' && $route.query.cateId === '3'" style="font-size: 10px;color: #9a9a9a">（20个起订）</span>
                <span v-if="item.code === 'YSSL' && ($route.query.cateId === '5' || $route.query.cateId === '6' || $route.query.cateId === '9')" style="font-size: 12px;color: #F00">（该品类无备品，请评估下单数量）</span>
              </div>
            </div>
            <span v-if="item.code === 'YSSL' && $route.query.subCateId === '55'" class="plspn f12 C9">(可输入100,200,500,1000,2000,3000,5000,10000以上的10000整数倍)</span>
            <span v-if="item.code === 'YSSL' && $route.query.subCateId === '49'" class="plspn f12 C9">(100个起订,可输入500以上的500整数倍)</span>
            <span v-if="item.code === 'YSSL' && $route.query.subCateId === '51'" class="plspn f12 C9">(2500个起订,可输入2500,5000,7500,10000以上的10000整数倍)</span>
            <span v-if="item.code === 'YSSL' && $route.query.subCateId === '52'" class="plspn f12 C9">(1000个起订,可输入1000,2000,3000,5000；10000以上的1000整数倍)</span>
          </div>
        </el-form-item>
        <!-- <el-form-item v-if="item.code === 'SIZE' && formData.goodSize.goodAl" :key="'common_size_' + index" label="展开尺寸"> {{ formData.goodSize.goodAl }}mm*{{ formData.goodSize.goodAw }}mm </el-form-item> -->
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
  border-left: 1px solid #DCDFE6;
}
</style>

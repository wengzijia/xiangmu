<template>
  <div>
    <template v-for="(groupItem, index) in groupVoList">
      <div :key="'div_' + index" class="hardList">
        <h2 v-if="groupItem.name" class="flex hardH2">
          <span class="geH1Lt">{{ groupItem.name }}</span>
        </h2>
        <div style="color:red;margin: 10px 0 -10px 64px;" v-if="$route.query.cateId == '9' && groupItem.name == ''">说明书使用的是最广泛高松纸材质，与实际克重有差异，如有影响建议您选用更高克重材质</div>
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
          :form-vo-list.sync="groupItem.list"
          :bindType="bindType"
          :disabledObj="disabledObj"
        ></price-major>
        <div v-if="strEquals(groupItem.name, '印刷层信息')" class="Pantips" style="margin-left: 130px;">
          <span class="red">温馨提示:</span> 如果您的设计文件中使用了三色或四色混合(浅灰、灰、深灰、黑)、暗红色、浅红色、墨绿色、蓝紫色、深紫色、深褐色、咖啡色等色，建议您选择专色印刷，否则出现色差问题不予受理。
        </div>
      </div>
      <div :key="'div_2' + index" class="hardList" style="padding: 15px 15px;" v-if="strEquals(groupItem.name, '热封底层信息') && strEquals($route.query.cateId, '13')">材质结构配比&厚度:{{ formData.zcjgpb }}</div>
    </template>
  </div>
</template>

<script>
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { isCopyCraft } from '@/utils/price/craftUtil';
import PriceMajor from '@/components/price/PriceMajor';
export default {
  name: 'PriceMajorGroup',
  components: { PriceMajor },
  props: {
    formVoList: Array,
    formData: Object,
    groupVoList: Array,
    priceValuation: Function,
    removeCopyGroupCk: Function,
    removeCopyGroupRd: Function,
    addCopyGroupCk: Function,
    addCopyGroupRd: Function,
    radioSelect: Function,
    selectSelect: Function,
    checkboxSelect: Function,
    bindType: String,
    disabledObj: Object
  },
  watch: {},
  data() {
    return {};
  },
  methods: {
    ...{ startWith, endWith, strEquals },
    ...{ isCopyCraft },
    parentRadioSelect(param) {
      this.radioSelect(param);
    }
  }
};
</script>

<style scoped></style>

<template>
  <el-form class="donwitem" ref="formData" :model="formData" label-width="130px" size="small" @submit.native.prevent>
    <el-form-item v-for="(item, index) in formVoList" :key="index">
      <template slot="label">
        <div class="EattrLab">
          <span class="red" v-if="item.miniZtAttrGroup.required === 1 && item.miniZtAttrGroup.showName === 1">*</span>
          {{ item.miniZtAttrGroup.showName === 1 ? item.miniZtAttrGroup.name : '' }}
        </div>
      </template>
      <div v-if="item.miniZtAttrGroup.groupType == 'input'">
        <div style="float: left; margin-left: 0px;" v-for="attr in item.attrList" :key="attr.id">
          <el-input v-model="formData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" style="width: 120px;" size="small" @change="inputChange({ value: $event, id: attr.groupId + '_' + attr.id })">
            <template slot="append">{{ attr.suffix }}</template>
          </el-input>
        </div>
      </div>
      <div v-else-if="item.miniZtAttrGroup.groupType == 'radio'">
        <el-radio-group size="small" v-model="formData.radioSelectValues[item.miniZtAttrGroup.id]" @change="radioSelect" button-style="solid">
          <span v-for="attr in item.attrList" :key="'attr_' + attr.id">
            <template v-if="attr.remarsk != '' && attr.remark != null">
              <el-tooltip class="item" effect="light" placement="top-start">
                <template slot="content">
                  <span v-html="attr.remark">{{ attr.remark }}</span>
                </template>
                <el-radio-button :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-radio-button>
              </el-tooltip>
            </template>
            <template v-else>
              <el-radio-button :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-radio-button>
            </template>
          </span>
        </el-radio-group>
      </div>
      <div v-else-if="item.miniZtAttrGroup.groupType == 'select'">
        <el-select size="small" v-model="formData.selectSelectValues[item.miniZtAttrGroup.id]" placeholder="请选择" @change="selectSelect">
          <el-option v-for="(attr, index) in item.attrList" :key="index" :label="attr.name" :value="attr.groupId + '_' + attr.id"> </el-option>
        </el-select>
      </div>
      <div v-if="item.miniZtAttrGroup.reminder != null && item.miniZtAttrGroup.reminder != ''">
        {{ item.miniZtAttrGroup.reminder }}
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CutterMajor',
  props: {
    formData: Object,
    formVoList: Array,
    changeParam: Function,
    selectSelect: Function,
    radioSelect: Function,
    inputChange: Function
  }
};
</script>
<style>
.donwitem .el-form-item {
  margin-bottom: 10px;
}
.donwitem .el-form-item__label {
  text-align: left;
}
.donwitem .el-select .el-input.is-focus .el-input__inner {
  border-color: #dcdfe6;
}
.el-select-dropdown__item.selected {
  color: #e60021;
}
</style>

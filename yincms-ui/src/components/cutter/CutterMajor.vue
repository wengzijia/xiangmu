<template>
  <el-form class="donwitem" ref="formData" :model="formData" label-width="130px" size="small" @submit.native.prevent>
    <template v-for="(item, index) in formVoList">
      <el-form-item :key="index" v-if="item.attrList.length > 0">
        <template slot="label">
          <div class="EattrLab">
            <span class="red" v-if="item.miniZtAttrGroup.required === 1 && item.miniZtAttrGroup.showName === 1">*</span>
            {{ item.miniZtAttrGroup.showName === 1 ? item.miniZtAttrGroup.name : '' }}
          </div>
        </template>
        <div v-if="item.miniZtAttrGroup.groupType == 'input'">
          <div style="float: left; margin-left: 0px" v-for="attr in item.attrList" :key="attr.id">
            <el-input v-model="formData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" style="width: 120px" size="small" @change="inputChange({ value: $event, id: attr.groupId + '_' + attr.id })">
              <template slot="append">{{ attr.suffix }}</template>
            </el-input>
          </div>
        </div>
        <div v-else-if="item.miniZtAttrGroup.groupType == 'radio'">
          <span v-if="$route.query.cateId == '3' && item.miniZtAttrGroup.name.indexOf('纸板厚度') > -1">
            <span v-if="item.miniZtAttrGroup.name == '皮壳纸板厚度' || item.miniZtAttrGroup.name == '柜桶纸板厚度' || item.miniZtAttrGroup.name == '天盖纸板厚度'"> {{ thickness1 }}mm </span>
            <span v-else> {{ thickness2 }}mm </span>
          </span>

          <el-radio-group v-else size="small" v-model="formData.radioSelectValues[item.miniZtAttrGroup.id]" @change="radioSelect" button-style="solid">
            <span v-for="attr in item.attrList" :key="'attr_' + attr.id">
              <template v-if="attr.remarsk != '' && attr.remark != null">
                <el-tooltip class="item" effect="light" placement="top-start">
                  <template slot="content">
                    <span v-html="attr.remark"></span>
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
    </template>
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
    inputChange: Function,
    tparam: Object
  },
  mounted() {
    // if(this.$route.query.subCateId=='128'){
    //   setTimeout(() => {
    //     console.log(11111111,this.tparam);
    //   }, 1000);
    // }
  },
  computed: {
    thickness1() {
      var GA = 0;
      var GT = 0;
      if (this.tparam.t2 == '双灰纸板') {
        GA = 1.55;
      } else if (this.tparam.t2 == '灰底白板' || this.tparam.t2 == '灰底黑板') {
        GA = 1.45;
      } else if (this.tparam.t2 == '粉灰纸板') {
        GA = 1.4;
      }
      if (this.tparam.t1 == 600) {
        GT = 0.6;
      } else if (this.tparam.t1 == 800) {
        GT = 0.8;
      } else if (this.tparam.t1 == 1000) {
        GT = 1.0;
      } else if (this.tparam.t1 == 1200) {
        GT = 1.2;
      } else if (this.tparam.t1 == 1400) {
        GT = 1.4;
      } else if (this.tparam.t1 == 1600) {
        GT = 1.6;
      } else if (this.tparam.t1 == 1800) {
        GT = 1.8;
      }
      let G = GA * GT;
      return G.toFixed(2);
    },
    thickness2() {
      var GA = 0;
      var GT = 0;
      if (this.tparam.t4 == '双灰纸板') {
        GA = 1.55;
      } else if (this.tparam.t4 == '灰底白板' || this.tparam.t4 == '灰底黑板') {
        GA = 1.45;
      } else if (this.tparam.t4 == '粉灰纸板') {
        GA = 1.4;
      }
      if (this.tparam.t3 == 600) {
        GT = 0.6;
      } else if (this.tparam.t3 == 800) {
        GT = 0.8;
      } else if (this.tparam.t3 == 1000) {
        GT = 1.0;
      } else if (this.tparam.t3 == 1200) {
        GT = 1.2;
      } else if (this.tparam.t3 == 1400) {
        GT = 1.4;
      } else if (this.tparam.t3 == 1600) {
        GT = 1.6;
      } else if (this.tparam.t3 == 1800) {
        GT = 1.8;
      }
      let G = GA * GT;
      return G.toFixed(2);
    }
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

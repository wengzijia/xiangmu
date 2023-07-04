<template>
  <div>
    <el-form :model="accountingFormData" ref="accountingFormRef" :rules="rules" :validate-on-rule-change="false">
      <el-form-item label="" prop="conclusion">
        <el-radio-group v-model="accountingFormData.conclusion" @change="radioChange">
          <template v-for="(item, index) in operations" :key="item.label">
            <el-radio :label="item.label">{{ item.value }}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input type="textarea" rows="3" v-model="accountingFormData.remark" maxlength="200" :formatter="formatInput"
          placeholder="请在此添加备注" show-word-limit></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="auditAndRemark">
import { reactive, ref } from 'vue';

const props = defineProps({
  operations: {
    type: Array,
    default: () => [
      { label: "6", value: "通过" },
      { label: "3", value: "驳回至加工商" },
      { label: "9", value: "作废" },
    ]
  },
  selected: {
    type: String,
    default: "6"
  }
});

const accountingFormRef = ref()
let accountingFormData = ref({
  conclusion: props.selected,//结论
  remark: ''//备注
});
const rules = reactive({
  remark: [{ required: false, message: '请在此添加备注', trigger: 'blur' }]
})
const formatInput = (val) => {
  val = val.replace(/^\s*|\s*$/g, "");
  accountingFormData.remark = val;
  return val
}
const radioChange = (val) => {
  if (val == "6") {
    accountingFormRef.value.clearValidate()
    rules.remark[0].required = false
  }
  else rules.remark[0].required = true
}
const handleValid = async () => {
  let data
  await accountingFormRef.value.validate((valid, fields) => {
    if (valid) {
      data = accountingFormData.value
    } else {
      console.log('error submit!', fields)
    }
  })
  return data
}
const resetForm = () => {
  radioChange(props.selected)
  accountingFormRef.value.resetFields()
}
defineExpose({
  handleValid,
  resetForm
})
</script>

<style lang="scss" scoped></style>
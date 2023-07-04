<template>
  <el-dialog v-model="dialogFileType" title="确定退回文件推送前?" width="600px" :before-close="cancel">
    <el-form
      ref="formTransfer"
      :model="fileParam"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- 备注 -->
      <el-form-item label="备注:" prop="remark">
        <el-input
          v-model.trim="fileParam.remark"
          type="textarea"
          placeholder="请输入退回文件推送前备注内容"
          autocomplete="off"
          show-word-limit
          maxlength="300"
          resize="none"
          rows="6"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="backFileAffirm()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import {
  returnBeforeSend,
} from "@/api/structural/selfWork";

import { ElMessage } from "element-plus";
import { getDeptUser } from "@/api/system/user";
import { toRef } from "@vue/reactivity";
import useAppStore from "@/store/modules/user";

const appStore = useAppStore();
const name = ref('')
name.value = appStore.$state.name
const { proxy } = getCurrentInstance();
const receiver = ref([])
const props = defineProps({
    dialogFileType:{
        type:Boolean,
        default:false,
    },
    dialogId:{
        type:String,
        default:''
    },
})
const dialogId = toRef(props,"dialogId")
defineEmits(["update:dialogFileType"])
const data = reactive({
//参数
  fileParam: {
    id: "", // id
    remark: "", // 备注
  },
});
const { fileParam, } = toRefs(data);
// 确认
const backFileAffirm = () => {
  fileParam.value.id = dialogId.value
  proxy.$refs["formTransfer"].validate((valid) => {
    if (valid) {
      returnBeforeSend({
        ...fileParam.value,
      }).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
           proxy.$emit('changeList')
        } else {
          ElMessage.error(res.msg);
        }
        cancel();
      });
    } else {

    }
  });
};

function cancel(){
proxy.$emit('update:dialogFileType')
proxy.resetForm('formTransfer')
}
</script>


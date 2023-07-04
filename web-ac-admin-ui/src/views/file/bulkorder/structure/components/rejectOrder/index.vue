<template>
  <div>
    <el-dialog
      v-model="dialogType"
      title="驳回"
      width="600px"
      :before-close="cancel"
    >
      <el-form
        ref="formRefusal"
        :rules="refusalRules"
        :model="refusalParams"
        label-width="100px"
        class="demo-ruleForm"
      > 
      <template v-if="isEditor">
        <el-form-item label="驳回原因:" prop="remark">
          <Editor v-model:html="refusalParams.remark" ></Editor>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="驳回原因:" prop="remark">
          <el-input
            v-model.trim="refusalParams.remark"
            type="textarea"
            placeholder="请填写驳回原因"
            autocomplete="off"
            show-word-limit
            maxlength="500"
            resize="none"
            rows="6"
          />
        </el-form-item>
        <el-form-item prop="img">
          <div class="upload">
            <FileUpload
              :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']"
              :fileSize="200"
              type=""
              name="上传图片附件"
              v-model:modelValue="refusalParams.img"
              del
            />
          </div>
        </el-form-item>
      </template>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="refusalAffirm()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { rejectStructural } from "@/api/structural/structuralList";
import { ElMessage } from "element-plus";
import { getText } from "@/utils/index"
import Editor from "@/components/Editor"
const { proxy } = getCurrentInstance();
const props = defineProps({
  dialogType: {
    type: Boolean,
    default: false,
  },
  dialogId: {
    type: String,
    default: "",
  },
  isEditor:{
    type: Boolean,
    default: false,
  }
});
const dialogId = toRef(props, "dialogId");
let fileList = ref([]);
const validateFirstEditor = (rule, value, callback) => {
  if (value == ""||!getText(value)) {
    // console.log(getText(value));
    callback(new Error("请填写驳回原因"));
  } else {
    callback();
  }
};
defineEmits(["update:dialogType"]);
const data = reactive({
  // 驳回参数
  refusalParams: {
    id: "", // id
    remark: "", // 备注
    img:''
  },
  refusalRules: {
    remark: [
        { 
            required: true,
            validator: validateFirstEditor,
            trigger: "blur", 
        }
    ],
  },
});
const { refusalParams, refusalRules } = toRefs(data);
// 驳回确认
const refusalAffirm = () => {
  refusalParams.value.id = dialogId.value;
  proxy.$refs["formRefusal"].validate(async (valid) => {
    if (valid) {
      try {
        let { code, msg } = await rejectStructural({
          ...refusalParams.value,
        });
        if (code == 200) {
          proxy.$emit("changeList");
          ElMessage.success(msg);
        } else {
          ElMessage.error(msg);
        }
        proxy.resetForm("formRefusal");
        proxy.$emit("update:dialogType", false);
      } catch (err) {
        proxy.resetForm("formRefusal");
        proxy.$emit("update:dialogType", false);
      }
    } else {
    }
  });
};
function cancel() {
  proxy.resetForm("formRefusal");
  proxy.$emit("update:dialogType", false);
}
</script>
<style scoped></style>

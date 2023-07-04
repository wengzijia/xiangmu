<template>
  <div>
    <el-dialog
      v-model="dialogType"
      :title="title"
      width="800px"
      :before-close="cancel"
    >
      <el-form
        ref="formRefusal"
        :rules="refusalRules"
        :model="refusalParams"
        label-width="120px"
        class="demo-ruleForm"
      > 
        <el-form-item label="驳回原因分类" prop="refuseClassification" v-if="classification">
          <el-checkbox-group v-model="refusalParams.refuseClassification">
            <p><el-checkbox label="尺寸差异" /></p>
            <p><el-checkbox label="结构类型与订单不符" /></p>
            <p><el-checkbox label="结构不符合生产规范" /></p>
            <p><el-checkbox label="其他" /></p>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="驳回备注说明:" prop="remark">
          <Editor v-model:html="refusalParams.remark" ></Editor>
        </el-form-item>
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
import Editor from "@/components/Editor"
import { ElMessage } from "element-plus";
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
  classification:{
    type:Boolean,
    default:false
  },
  title:{
    type:String,
    default:"驳回"
  }
});
const dialogId = toRef(props, "dialogId");
let fileList = ref([]);
defineEmits(["update:dialogType"]);
const validateFirstEditor = (rule, value, callback) => {
  if (value == ""||!getText(value)) {
    console.log(getText(value));
    callback(new Error("驳回备注说明"));
  } else {
    callback();
  }
};
const getText = (str) => {
  return str
    .replace(/<[^<p>]+>/g, '')  // 将所有<p>标签 replace ''
    .replace(/<[</p>$]+>/g, '')  // 将所有</p>标签 replace ''
    .replace(/&nbsp;/gi, '')  // 将所有 空格 replace ''
    .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
    .replace(/^\s*|\s*$/g,"")
}
const data = reactive({
  // 驳回参数
  refusalParams: {
    id: "", // id
    remark: "", // 备注
    img:'',
    refuseClassification:[]
  },
  refusalRules: {
    remark: [
        { 
            required: true,
            validator: validateFirstEditor,
            trigger: "blur", 
        }
    ],
    refuseClassification:[{ required: props.classification, message: "请选择驳回原因分类", trigger: "blur" }]
  },
});
const { refusalParams, refusalRules } = toRefs(data);
// 驳回确认
const refusalAffirm = () => {
  refusalParams.value.id = dialogId.value;
  let data = JSON.parse(JSON.stringify(refusalParams.value))
  if(props.classification){
    data.refuseClassification=data.refuseClassification.toString()
  }else{
    delete data.refuseClassification
  }
  proxy.$refs["formRefusal"].validate(async (valid) => {
    if (valid) {
      try {
        let { code, msg } = await rejectStructural({
          ...data,
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

<template>
  <el-dialog v-model="dialogTransferType" title="转移结构单" width="600px" :before-close="cancel">
    <el-form
      ref="formTransfer"
      :model="transferParam"
      label-width="100px"
      class="demo-ruleForm"
      :rules="transferRules"
    >
      <el-form-item label="账号:" prop="userId">
        <el-select
          v-model="transferParam.userId"
          :placeholder="text==1?'请选择接受账号':'请选择要转入的处理人'"
          style="width: 600px"
          filterable
        >
          <el-option
            v-for="item in receiver"
            v-show="item.userName!=name"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <!-- 转单备注 -->
      <el-form-item label="转单备注:" prop="remark">
        <el-input
          v-model.trim="transferParam.remark"
          type="textarea"
          placeholder="请填写转单原因"
          autocomplete="off"
          show-word-limit
          maxlength="500"
          resize="none"
          rows="6"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="transferAffirm()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import {
  transferStructural,
} from "@/api/structural/structuralList";
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
    dialogTransferType:{
        type:Boolean,
        default:false,
    },
    dialogId:{
        type:String,
        default:''
    },
    deptId:{
      type:String,
      default:''
    },
    text:{
      type:String,
      default:'1'
    }
})
const dialogId = toRef(props,"dialogId")
const deptId = toRef(props,"deptId")
defineEmits(["update:dialogTransferType"])
const data = reactive({
  // 驳回参数
  refusalParams: {
    id: '', // id
    remark: "", // 备注
  },
// 转移结构单参数
  transferParam: {
    id: "", // id
    userId: "", // 账号
    remark: "", // 备注
  },
   transferRules: {
    userId: [{ required: true, message: "请选择接受账号", trigger: "change" }],
  },
    refusalRules: {
    remark: [{ required: true, message: "请填写驳回原因", trigger: "blur" }],
  },
  
});
const { refusalParams,refusalRules,transferParam,transferRules } = toRefs(data);
DeptUser();

//获取账号
function DeptUser() {
  getDeptUser({ deptId: deptId.value }).then((res) => {
    if (res.code === 200) {
      receiver.value = res.data;
       } else {
      ElMessage.error(res.msg);
    }
  });
}
// 转移结构单确认
const transferAffirm = () => {
  transferParam.value.id = dialogId.value
  proxy.$refs["formTransfer"].validate((valid) => {
    if (valid) {
      transferStructural({
        ...transferParam.value,
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
proxy.$emit('update:dialogTransferType')
proxy.resetForm('formTransfer')
}
</script>


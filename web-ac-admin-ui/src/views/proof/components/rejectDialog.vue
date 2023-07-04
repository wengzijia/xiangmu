<template>
    <div>
        <span @click="openRejectDialog">驳回</span>
        <el-dialog
          v-model="dialogVisible"
          title="驳回"
          width="600px"
          destroy-on-close
          append-to-body
        >
        <el-form :model="dialogForm" label-width="120px" :rules="rules" ref="dialogFormRef">
          <el-form-item v-if="currentNodeId>0" label="驳回节点" prop="preNodeIndex">
            <el-select
              v-model="dialogForm.preNodeIndex"
              class="headerinp"
              placeholder="请选择驳回节点"
            >
              <template v-for="item in taskList" :key="item.value">
                <el-option
                  :label="item.key"
                  :value="item.value"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item  label="驳回原因" prop="remark">
            <el-input v-model.trim="dialogForm.remark" placeholder="请填写驳回原因" maxlength="500" show-word-limit :rows="4"
              type="textarea" clearable style="width:400px;" />
              <div v-if="img" style="margin-top:10px;">
                <FileUpload
                  :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']"
                  :fileSize="200"
                  type=""
                  name="上传图片附件"
                  v-model:modelValue="dialogForm.remarkImages"
                  del
                />
              </div>
          </el-form-item>
        </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="dialogConfirm">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { getTaskList } from "@/api/file-task/proof/index"

const emit = defineEmits()
const props = defineProps({
  activityId:{
    type:String,
    default:''
  },
  scope:{
    type:Object,
    default:{}
  },
  img:{
    type:Boolean,
    default:true
  },
  disabled:{
    type:Boolean,
    default:false
  },
})
const { activityId,scope,disabled } = toRefs(props)
const data = reactive({
  dialogForm:{
    remark:'',//驳回原因
    remarkImages:'',//驳回图片
    preNodeIndex:null,//驳回节点
  }
})
const { dialogForm } = toRefs(data)
const dialogVisible = ref(false)
const dialogFormRef = ref(null)
const taskList = ref([])
const currentNodeId = ref(0)//订单当前节点

const rules = reactive({
  remark: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' },],
  preNodeIndex:[{ required: true, message: '请选择驳回节点', trigger: 'change' }]
})
watch(dialogVisible,val=>{
  if (val) {
    getList()
  }
})
//根据activityId获取订单前面的节点
function getList() {
  getTaskList(activityId.value).then(res=>{
    if (res.code==200) {
      taskList.value = res.data.nodes
      currentNodeId.value = res.data.currentNodeId
    }
  })
}
//打开驳回弹窗
function openRejectDialog(){
  if (disabled.value) {
    return
  }
  dialogVisible.value = true
}
//校验提交驳回表单
async function dialogConfirm() {
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      emit('callBack',{...dialogForm.value,...scope.value,activityId:activityId.value,remark:dialogForm.value.remark})
      dialogVisible.value = false
    } else {
      console.log('提交失败,校验不通过', fields)
    }
  })

}
</script>
<style>
    
</style>
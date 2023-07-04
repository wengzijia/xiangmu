<template>
  <div class="drawer">
    <el-form v-if="drawerType!=='subedit'" :model="form" ref="consumablesForm" :rules="rules" label-width="100px">
      <el-form-item label="耗材名称" prop="consumablesName">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.consumablesName" maxlength="50" show-word-limit placeholder="请输入耗材名称"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.consumablesName||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="耗材类别" prop="consumablesTypeId">
        <div v-show="!disabled" style="width:100%">
          <el-select v-model="form.consumablesTypeId" placeholder="请选择耗材类别" >
            <el-option v-for="item in ConsumablesTypeList" :key="item.id" :label="item.consumablesTypeName"
              :value="item.id" />
          </el-select>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.materialTypeName||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="规格" prop="spec">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.spec" maxlength="50" show-word-limit placeholder="请输入规格"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.spec||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="计价单位" prop="priceUnit">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.priceUnit" maxlength="50" show-word-limit placeholder="请输入计价单位"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.priceUnit||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item>
        <div v-show="!disabled">
          <el-button @click="cancel">取消</el-button>
          <el-button v-if="drawerType=='add'||drawerType=='copy'" type="primary" @click="confirmChange(consumablesForm)" v-hasPermi="['maintain:add']">提交审批</el-button>
          <el-button v-else type="primary" @click="confirmChange(consumablesForm)" v-hasPermi="['maintain:change']">提交审批</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { checkChange } from '@/utils'
import { reactive, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addConsumables, changeConsumables } from '@/api/basicDatabase'
import { GetConsumablesTypeList } from "../getList";
const ConsumablesTypeList = ref([]);
const props = defineProps({
  drawerType: {
    type: String,
    default: 'add'
  },
  drawerData: {
    type: Object
  }
})
const { drawerData } = toRefs(props)
const drawerType = toRef(props, 'drawerType')
const disabled = ref(true)
const MaterialTypeList = ref([])
const MaterialSubclassList = ref([])
const fileList = ref([])
const data = reactive({
  form: {},
})
const { form } = toRefs(data)
const emit = defineEmits();
const consumablesForm = ref(null)
if (drawerData.value) {
  form.value = JSON.parse(JSON.stringify(drawerData.value))
}
watch(drawerType, (val) => {
  changeDisabled(val)
})
watch(drawerData, (val) => {
  form.value = val
})
const rules = reactive({
  consumablesName: [{ required: true, message: '请输入耗材名称', trigger: 'blur' },],
  consumablesTypeId: [{ required: true, message: '请输入耗材类别', trigger: 'blur' },],
})
function changeDisabled(val) {
  switch (val) {
    case 'add':
    getConsumablesTypeList()
      disabled.value = false
      break;
    case 'edit'://编辑
    getConsumablesTypeList()
      disabled.value = false
      break;
    case 'view'://查看更多
      disabled.value = true
      break;
    case 'copy'://复制
    getConsumablesTypeList()
      disabled.value = false
      break;
    default:
      disabled.value = true
      break;
  }
}
changeDisabled(drawerType.value)
function confirmChange(formRef) {
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm(
        '操作立即生效，是否继续？',
        '确定提交审核吗？',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          switch (drawerType.value) {
            case 'add':
              addTable()
              break;
            case 'edit'://编辑
              editTable()
              break;
            case 'copy'://复制
              addTable()
              break;

            default:
              break;
          }
        })
        .catch(() => { })
    } else {
      return false
    }
  })
}
//提交表单编辑内容
 function editTable() {
  let data = checkChange(form.value, drawerData.value)
  if (!data) {
    ElMessage({
      type: 'error',
      message: '数据未修改',
    })
    return
  }
  changeConsumables(data).then(res => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '修改成功',
      })
    }
  }).finally(()=>{
    emit('closeDrawer')
  })
}
 function addTable() {
  addConsumables(form.value).then(res => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '添加成功',
      })
      emit('closeDrawer')
    }
  })
}
//取消编辑
function cancel() {
  ElMessageBox.confirm(
    '退出后，已编辑的内容不会被保存。',
    '确定退出编辑吗？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    emit('closeDrawer')
  })
    .catch(() => {

    })
}
getConsumablesTypeList();
//获得所有耗材类别
async function getConsumablesTypeList() {
  ConsumablesTypeList.value = await GetConsumablesTypeList();
}

</script>

<style lang="scss" scoped>
.drawer {
  .drawer-upload {
    :deep(.el-upload--picture-card) {
      width: 80px;
      height: 80px;
    }

    :deep(.el-upload-list--picture-card .el-upload-list__item) {
      width: 80px;
      height: 80px;
    }
  }

  .confirm-dialog {
    :deep(.el-dialog) {
      margin-top: 30vh;
    }
  }
}
</style>
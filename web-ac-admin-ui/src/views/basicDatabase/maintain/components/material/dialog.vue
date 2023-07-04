<template>
  <div class="drawer">
    <el-form v-if="drawerType!=='subedit'" :model="form" ref="materialForm" :rules="rules" label-width="100px">
      <el-form-item label="物料名称" prop="materialInfoName">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.materialInfoName" maxlength="50" show-word-limit  placeholder="请输入物料名称"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.materialInfoName||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="材质类别" prop="materialTypeId">
        <div v-show="!disabled" style="width:100%">
          <el-select v-model="form.materialTypeId" placeholder="请选择材质类别" @change="getMaterialSubclassList">
            <el-option v-for="item in MaterialTypeList" :key="item.id" :label="item.materialTypeName"
              :value="item.id" />
          </el-select>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.materialTypeName||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item v-show="!disabled" label="材质小类" prop="materialSubclassId">
        <div v-show="!disabled" style="width:100%">
          <el-select v-model="form.materialSubclassId" placeholder="请选择材质小类" @change="getMaterialList">
            <el-option v-for="item in MaterialSubclassList" :key="item.id" :label="item.materialSubclassName"
              :value="item.id" />
          </el-select>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.materialSubclassName||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="纸品牌" prop="brand">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.brand" maxlength="50" show-word-limit  placeholder="请输入纸品牌"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.brand||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="材质" prop="materialSpecsId">
        <div v-show="!disabled" style="width:100%">
          <el-select v-model="form.materialSpecsId" placeholder="请选择材质">
            <el-option v-for="item in MaterialList" :key="item.id" :label="item.materialSpecsNo+'/'+item.materialName+'/'+item.weight"
              :value="item.id" class="option-ovf"/>
          </el-select>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.materialName||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="挺度" prop="stiffness">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.stiffness" maxlength="50" show-word-limit placeholder="请输入挺度"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.stiffness||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="含水量" prop="waterContent">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.waterContent" maxlength="50" show-word-limit placeholder="请输入含水量"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.waterContent||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="纸白度" prop="paperWhiteness">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.paperWhiteness" maxlength="50" show-word-limit placeholder="请输入纸白度"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.paperWhiteness||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="抗压程度" prop="compressiveStrength">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.compressiveStrength" maxlength="50" show-word-limit placeholder="请输入抗压程度"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.compressiveStrength||'-'}}</div>
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
          <el-button v-if="drawerType=='add'||drawerType=='copy'" type="primary" @click="confirmChange(materialForm)" v-hasPermi="['maintain:add']">提交审批</el-button>
          <el-button v-else type="primary" @click="confirmChange(materialForm)" v-hasPermi="['maintain:change']">提交审批</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { checkChange } from '@/utils'
import { reactive, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addMaterial, changeMaterial,getMaterialSpecsSubclass } from '@/api/basicDatabase'
import {GetMaterialTypeList,GetMaterialSubclassList} from '../getList'
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
const MaterialList = ref([])
const fileList = ref([])
const data = reactive({
  form: {},
})
const { form } = toRefs(data)
const emit = defineEmits();
const materialForm = ref(null)
if (drawerData.value) {
  form.value = JSON.parse(JSON.stringify(drawerData.value))
  if (drawerData.value.materialTypeId||drawerData.value.materialTypeId===0) {
    getMaterialSubclassList(true)
    getMaterialList(true)
  }
}
watch(drawerType, (val) => {
  changeDisabled(val)
})
watch(drawerData, (val) => {
  form.value = val
})
const rules = reactive({
  materialInfoName: [{ required: true, message: '请输入物料名称', trigger: 'blur' },],
  materialTypeId: [{ required: true, message: '请选择物料类别', trigger: 'blur' },],
  materialSubclassId: [{ required: true, message: '请选择材质小类', trigger: 'blur' },],
  brand: [{ required: true, message: '请输入纸品牌', trigger: 'blur' },],
  materialSpecsId: [{ required: true, message: '请选择材质', trigger: 'blur' },],
})
function changeDisabled(val) {
  switch (val) {
    case 'add':
    getMaterialTypeList()
      disabled.value = false
      break;
    case 'edit'://编辑
    getMaterialTypeList()
      disabled.value = false
      break;
    case 'view'://查看更多
      disabled.value = true
      break;
    case 'copy'://复制
    getMaterialTypeList()
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
  changeMaterial(data).then(res => {
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
  addMaterial(form.value).then(res => {
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
getMaterialTypeList();
//获得所有材质类别
async function getMaterialTypeList() {
  MaterialTypeList.value = await GetMaterialTypeList()
}
//获得材质小类集合
async function getMaterialSubclassList(auto) {
  if (auto!==true) {
    form.value.materialSubclassId = null
    form.value.materialId = null
  }
  MaterialSubclassList.value = await GetMaterialSubclassList(form.value.materialTypeId)
}
function getMaterialList(auto){
  if (auto!==true) {
    form.value.materialId = null
  }
  if (form.value.materialSubclassId) {
    getMaterialSpecsSubclass(form.value.materialSubclassId).then(res=>{
      if (res.code===200) {
        MaterialList.value = res.data
      }
    })
  } else {
    MaterialList.value = []
  }
  
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
.option-ovf{
  max-width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
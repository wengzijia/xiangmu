<template>
  <div class="drawer">
    <el-form v-if="drawerType!=='subedit'" :model="form" ref="materialQualityForm" :rules="rules" label-width="100px">
      <el-form-item label="示例图片">
        <div v-show="!disabled" style="display:flex;">
          <div class="preview-img" v-if="fileList.length==0&&form.imageUrl&&form.imageUrl!='-'">
              <el-popconfirm title="确认删除图片?" @confirm="delImg">
                  <template #reference>
                      <el-icon v-show="!disabled" class="close-btn"><CircleClose /></el-icon>
                  </template>
              </el-popconfirm>
              <el-image :preview-src-list="[ossBaseUrl+form.imageUrl]" style="width: 80px; height: 80px;" :src="ossBaseUrl+form.imageUrl" fit="contain" />
          </div>
          <el-upload ref="upload" v-model:file-list="fileList" list-type="picture-card" class="drawer-upload" action="" multiple
            :on-preview="handlePictureCardPreview" :auto-upload="false" :limit="1" :on-exceed="handleExceed" :on-change="checkFile">
            <el-icon>
              <Plus />
            </el-icon>
            <template #tip>
              <div class="el-upload__tip">
                请上传jpg、jpeg、png格式，大小不超过2M
              </div>
            </template>
          </el-upload>
          <el-dialog v-model="dialogVisible" width="800px">
            <div style="text-align:center;">
              <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:720px;" />
            </div>
          </el-dialog>
        </div>
        <div v-show="disabled">
          <el-image v-if="form.imageUrl" :preview-src-list="[ossBaseUrl+form.imageUrl]"
            style="width: 80px; height: 80px" :src="ossBaseUrl+form.imageUrl" fit="contain" />
            <div v-else>暂无图片</div>
        </div>
      </el-form-item>
      <el-form-item label="材质名称" prop="materialName">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.materialName" maxlength="50" show-word-limit  placeholder="请输入材质名称"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.materialName||'-'}}</div>
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
      <el-form-item label="材质小类" prop="materialSubclassId">
        <div v-show="!disabled" style="width:100%">
          <el-select v-model="form.materialSubclassId" placeholder="请选择材质小类">
            <el-option v-for="item in MaterialSubclassList" :key="item.id" :label="item.materialSubclassName"
              :value="item.id" />
          </el-select>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.materialSubclassName||'-'}}</div>
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
      <el-form-item label="计价方式">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.priceMethod" maxlength="50" show-word-limit placeholder="请输入计价方式"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.priceMethod||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="行业常见称呼">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.appellation" maxlength="50" show-word-limit placeholder="请输入行业常见称呼"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.appellation||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="用途说明">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.usageDescription" maxlength="300" show-word-limit placeholder="请输入用途说明"/>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.usageDescription||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="不适用工艺">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.unsuitedCraftStr" maxlength="300" show-word-limit placeholder="请输入不适用工艺"/>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.unsuitedCraftStr||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="定义">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.definition" type="textarea" maxlength="300" :autosize="{ minRows: 4, maxRows: 6 }" show-word-limit placeholder="请输入定义"/>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.definition||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="其他注意事项">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.note" type="textarea" maxlength="300" show-word-limit placeholder="请输入其他注意事项"/>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.note||'-'}}</div>
        </div>
      </el-form-item>
      <div v-if="drawerType=='add'||drawerType=='copy'" class="parts-spec">
        <span style="font-size:14px;"><span style="color:#ff0036;">*&nbsp;</span>规格</span>
        <span style="font-size:12px;">必须填写任意一项</span>
      </div>
      <el-form-item v-if="drawerType=='add'||drawerType=='copy'" label="克重">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.weight" maxlength="50" show-word-limit />
        </div>
      </el-form-item>
      <el-form-item v-if="drawerType=='add'||drawerType=='copy'" label="厚度">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.thickness" maxlength="50" show-word-limit />
        </div>
      </el-form-item>
      <el-form-item>
        <div v-if="!disabled">
          <el-button @click="cancel">取消</el-button>
          <el-button v-if="drawerType=='add'||drawerType=='copy'" type="primary" @click="confirmChange(materialQualityForm)" v-hasPermi="['maintain:add']">提交审批</el-button>
          <el-button v-else type="primary" @click="confirmChange(materialQualityForm)" v-hasPermi="['maintain:change']">提交审批</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="drawerType=='view'" style="border-top:1px solid #ebebeb;padding-top:20px;padding-left:10px;">
      <div v-for="(item,index) in drawerData.materialSpecsList" :key="item.id" class="spec-show-list">
        <div style="width:280px;display: flex;">
          <div style="margin-right:14px;width:50px;">规格{{index+1}}:</div>
          <div style="width:190px;">材质规格编码：{{item.materialSpecsNo||'-'}}</div>
        </div>
        <div style="width:100px;">克重：{{item.weight||'-'}}</div>
        <div style="width:100px;">厚度：{{item.thickness||'-'}}</div>
      </div>
    </div>
    <div v-if="drawerType=='subedit'">
      <specifications :id="drawerData.id" @closeDrawer="closeDrawer"></specifications>
    </div>
  </div>
</template>

<script setup>
import { checkChange } from '@/utils'
import { reactive, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox, genFileId  } from 'element-plus'
import { addMaterialQuality, changeMaterialQuality, uploadefile } from '@/api/basicDatabase'
import specifications from './specifications'
import {GetMaterialTypeList,GetMaterialSubclassList} from '../getList'
import {UploadImg} from '../upload'

const props = defineProps({
  drawerType: {
    type: String,
    default: 'add'
  },
  drawerData: {
    type: Object
  }
})
const ossBaseUrl = 'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'
const { drawerData } = toRefs(props)
const drawerType = toRef(props, 'drawerType')
const disabled = ref(true)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const MaterialTypeList = ref([])
const MaterialSubclassList = ref([])
const fileList = ref([])
const data = reactive({
  form: {},
})
const { form } = toRefs(data)
const emit = defineEmits();
const materialQualityForm = ref(null)
if (drawerData.value) {
  form.value = JSON.parse(JSON.stringify(drawerData.value))
  if (drawerData.value.materialTypeId||drawerData.value.materialTypeId===0) {
    getMaterialSubclassList(true)
  }
}
watch(drawerType, (val) => {
  changeDisabled(val)
})
watch(drawerData, (val) => {
  form.value = val
})
const rules = reactive({
  weight: [{ required: true, message: '请输入克重', trigger: 'blur' },],
  thickness: [{ required: true, message: '请输入厚度', trigger: 'blur' },],
  priceUnit: [{ required: true, message: '请输入计价单位', trigger: 'blur' }],
  materialName: [{ required: true, message: '请输入材质名称', trigger: 'blur' }],
  materialTypeId: [{ required: true, message: '请选择材质类别', trigger: 'blur' }],
  materialSubclassId: [{ required: true, message: '请选择材质小类', trigger: 'blur' }],

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
      form.value.thickness = form.value.weight = ''
      disabled.value = false
      break;
    case 'subedit'://规格管理
      disabled.value = false
      break;

    default:
      disabled.value = true
      break;
  }
}
changeDisabled(drawerType.value)

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
function confirmChange(formRef) {
  if (drawerType.value=='add'&&!form.value.weight&&!form.value.thickness) {
    ElMessage({
      type: 'error',
      message: '规格不能为空',
    })
    return
  }
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm(
        drawerType.value==='edit'?'变更材质数据将同步影响引用此材质的物料以及配件数据，是否继续？':'操作立即生效，是否继续？',
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
      console.log('error submit!')
      return false
    }
  })
}
//提交表单编辑内容
async function editTable() {
    if (fileList.value.length > 0) {
      form.value.imageUrl = await UploadImg(fileList.value[0].raw)
    }
  let data = checkChange(form.value, drawerData.value)
  if (!data) {
    ElMessage({
      type: 'error',
      message: '数据未修改',
    })
    return
  }
  // ElMessageBox.confirm(
  //   '变更材质数据将同步影响引用此材质的物料以及配件数据，',
  //   '是否继续？',
  //   {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning',
  //   }
  // ).then(() => {
    changeMaterialQuality(data).then(res => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: '修改成功',
        })
      }
    }).finally(()=>{
      close()
    })
  // })
}
async function addTable() {
  let data = {
    materialName:form.value.materialName,
    materialSubclassId:form.value.materialSubclassId,
    priceUnit:form.value.priceUnit,
    materialSpecs:{
      weight:form.value.weight||undefined,
      thickness:form.value.thickness||undefined
    },
    priceMethod:form.value.priceMethod||undefined,
    appellation:form.value.appellation||undefined,
    usageDescription:form.value.usageDescription||undefined,
    unsuitedCraftStr:form.value.unsuitedCraftStr||undefined,
    definition:form.value.definition||undefined,
    note:form.value.note||undefined,
  }
  if (!!form.value.imageUrl) {
    data.imageUrl = form.value.imageUrl
  }
  if (fileList.value.length > 0) {
    data.imageUrl = await UploadImg(fileList.value[0].raw)
  }
  addMaterialQuality(data).then(res => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '添加成功',
      })
      close()
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
    close()
  })
    .catch(() => {

    })
}
//获得所有材质类别
async function getMaterialTypeList() {
  MaterialTypeList.value = await GetMaterialTypeList()
}
//获得材质小类集合
async function getMaterialSubclassList(auto) {
  if (auto!==true) {
    form.value.materialSubclassId = null
  }
  MaterialSubclassList.value = await GetMaterialSubclassList(form.value.materialTypeId)
}
function close(){
  fileList.value = []
  dialogImageUrl.value = null
  emit('closeDrawer')
}
const upload = ref()
const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}
function checkFile(file){
  if (file.raw.type !== 'image/jpeg'&&file.raw.type !== 'image/png') {
    ElMessage.error('请上传jpg/png格式图片!')
    upload.value.clearFiles()
  } else if (file.raw.size / 1024 / 1024 > 2) {
    ElMessage.error('图片不能大于2MB!')
    upload.value.clearFiles()
  }
}
function closeDrawer(){
  emit('closeDrawer')
}
function delImg(){
  form.value.imageUrl = ''
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
  .parts-spec{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .spec-show-list{
    width: 600px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:14px;
    margin-bottom: 10px;
  }
  .spec-show-list>div{
    word-break: break-all;
    margin-right: 10px;
  }
  .preview-img{
    width: 80px;
    height: 80px;
    margin-right: 12px;
    display: inline-block;
    position: relative;
    .close-btn{
        cursor: pointer;
        &:hover{
            color: red;
        }
        position: absolute;
        font-size: 20px;
        top: 0;
        right: 0;
        z-index: 2;
    }
  }
}
</style>
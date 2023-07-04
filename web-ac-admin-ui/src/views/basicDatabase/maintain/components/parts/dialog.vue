<template>
  <div class="drawer">
    <el-form v-if="drawerType!=='subedit'" :model="form" ref="materialQualityForm" :rules="rules" label-width="100px">
      <el-form-item label="示例图片">
        <div v-if="!disabled" style="display:flex;">
          <div class="preview-img" v-if="fileList.length==0&&form.imgUrl&&form.imgUrl!='-'">
            <el-popconfirm title="确认删除图片?" @confirm="delImg">
                <template #reference>
                    <el-icon v-show="!disabled" class="close-btn"><CircleClose /></el-icon>
                </template>
            </el-popconfirm>
            <el-image :preview-src-list="[ossBaseUrl+form.imgUrl]" style="width: 80px; height: 80px;" :src="ossBaseUrl+form.imgUrl" fit="contain" />
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
        <div v-if="disabled">
          <el-image v-if="form.imgUrl" :preview-src-list="[ossBaseUrl+form.imgUrl]"
            style="width: 80px; height: 80px" :src="ossBaseUrl+form.imgUrl" fit="contain" />
            <div v-else>暂无图片</div>
        </div>
      </el-form-item>
      <el-form-item label="配件名称" prop="accessoryName">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.accessoryName" maxlength="50" show-word-limit  placeholder="请输入配件名称"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.accessoryName||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item v-if="disabled" label="配件编码" prop="accessoryNo">
        <div style="width:100%">
          <div>{{drawerData.accessoryNo||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item v-if="disabled" label="材质名称" prop="materialName">
        <div v-show="disabled">
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
      <el-form-item v-show="!disabled" label="材质小类" prop="materialSubclassId">
        <div style="width:100%">
          <el-select v-model="form.materialSubclassId" placeholder="请选择材质小类" @change="getMaterialList">
            <el-option v-for="item in MaterialSubclassList" :key="item.id" :label="item.materialSubclassName"
              :value="item.id" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item v-if="!disabled" label="材质" prop="materialId">
        <div style="width:100%">
          <el-select v-model="form.materialId" placeholder="请选择材质">
            <el-option v-for="item in MaterialList" :key="item.id" :label="item.materialNo+'/'+item.materialName"
              :value="item.id" class="option-ovf"/>
          </el-select>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.materialSubclassName||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="计量单位" prop="measurementUnit">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.measurementUnit" maxlength="50" show-word-limit placeholder="请输入计量单位"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.measurementUnit||'-'}}</div>
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
      <el-form-item label="其他注意事项">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.note" type="textarea" maxlength="300" show-word-limit placeholder="请输入其他注意事项"/>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.note||'-'}}</div>
        </div>
      </el-form-item>
      <div v-if="drawerType=='add'||drawerType=='copy'" class="parts-spec">
        <span style="font-size:16px;"><span style="color:#ff0036;">*&nbsp;</span>规格</span>
        <span style="font-size:12px;">必须填写任意一项</span>
      </div>
      <el-form-item v-if="drawerType=='add'||drawerType=='copy'" label="规格" prop="spec">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.spec" maxlength="50" show-word-limit placeholder="请输入规格"/>
        </div>
      </el-form-item>
      <el-form-item v-if="drawerType=='add'||drawerType=='copy'" label="颜色" prop="color">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.color" maxlength="50" show-word-limit placeholder="请输入颜色"/>
        </div>
      </el-form-item>
      <el-form-item v-if="drawerType=='add'||drawerType=='copy'" label="重量" prop="weight">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.weight" maxlength="50" show-word-limit placeholder="请输入重量"/>
        </div>
      </el-form-item>
      <el-form-item>
        <div v-show="!disabled">
          <el-button @click="cancel">取消</el-button>
          <el-button v-if="drawerType=='add'||drawerType=='copy'" type="primary" @click="confirmChange(materialQualityForm)" v-hasPermi="['maintain:add']">提交审批</el-button>
          <el-button v-else type="primary" @click="confirmChange(materialQualityForm)" v-hasPermi="['maintain:change']">提交审批</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="drawerType=='view'">
      <div v-for="(item,index) in drawerData.accessorySpecList" :key="item.id" class="spec-show-list">
        <div style="width:50px;">规格{{index+1}}:</div>
        <div style="width:190px;">配件规格编码：{{item.accessorySpecNo||'-'}}</div>
        <div style="width:140px;">规格：{{item.spec||'-'}}</div>
        <div style="width:100px;">颜色：{{item.color||'-'}}</div>
        <div style="width:100px;">重量：{{item.weight||'-'}}</div>
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
import { addAccessory, changeAccessory, getSubClass, uploadefile } from '@/api/basicDatabase'
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
const MaterialList = ref([])
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
    getMaterialList(true)
  }
  // if (form.value.imgUrl) {
  //   fileList.value[0] = {url:ossBaseUrl+form.value.imgUrl,imgUrl:form.value.imgUrl}
  // }
}
watch(drawerType, (val) => {
  changeDisabled(val)
})
watch(drawerData, (val) => {
  form.value = val
})
const rules = reactive({
  accessoryName:[{ required: true, message: '请输入配件名称', trigger: 'blur' },],
  materialTypeId: [{ required: true, message: '请选择材质类别', trigger: 'blur' }],
  materialSubclassId: [{ required: true, message: '请选择材质小类', trigger: 'blur' }],
  materialId:[{ required: true, message: '请选择材质', trigger: 'blur' },],
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
      form.value.spec = form.value.color = form.value.weight = ''
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
  if (drawerType.value=='add'&&!form.value.color&&!form.value.spec&&!form.value.weight) {
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
      console.log('error submit!')
      return false
    }
  })
}
//提交表单编辑内容
async function editTable() {
  if (fileList.value.length > 0) {
    form.value.imgUrl = await UploadImg(fileList.value[0].raw)
  }
  let data = checkChange(form.value, drawerData.value)
  if (!data) {
    ElMessage({
      type: 'error',
      message: '数据未修改',
    })
    return
  }
  changeAccessory(data).then(res => {
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
//添加配件
async function addTable() {
  let data = {
    accessoryName:form.value.accessoryName,
    accessorySpec:{
      color:form.value.color||undefined,
      spec:form.value.spec||undefined,
      weight:form.value.weight||undefined
    },
    materialId:form.value.materialId,
    measurementUnit:form.value.measurementUnit||undefined,
    note:form.value.note||undefined,
    usageDescription:form.value.usageDescription||undefined
  }
  if (!!form.value.imgUrl) {
    data.imgUrl = form.value.imgUrl
  }
  if (fileList.value.length > 0) {
    data.imgUrl = await UploadImg(fileList.value[0].raw)
  }
  addAccessory(data).then(res => {
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
//获取材质列表
function getMaterialList(auto){
  if (auto!==true){
    form.value.materialId = null
  }
  getSubClass(form.value.materialSubclassId).then(res=>{
    if (res.code===200) {
      MaterialList.value = res.data
    }
  })
}
const upload = ref()
const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}
function checkFile(file){
  if (file.raw.type !== 'image/jpeg' &&file.raw.type !== 'image/png') {
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
  form.value.imgUrl = ''
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
    display: flex;
    font-size:14px;
    margin-bottom: 6px;
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
.option-ovf{
  max-width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
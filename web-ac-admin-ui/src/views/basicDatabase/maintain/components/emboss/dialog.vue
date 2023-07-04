<template>
  <div class="drawer">
    <el-form :model="form" ref="embossForm" :rules="rules" label-width="100px">
      <el-form-item label="纹理示例图片">
        <div v-if="!disabled" style="display:flex;">
          <!-- <div v-if="fileList.length==0&&form.imageUrl&&form.imageUrl!='-'"><el-image :preview-src-list="[ossBaseUrl+form.imageUrl]"
            style="width: 80px; height: 80px; margin-right: 12px;" :src="ossBaseUrl+form.imageUrl" fit="contain" /></div> -->
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
          <div v-if="form.imageUrl&&form.imageUrl?.length>0&&form.imageUrl!='-'">
            <el-image :preview-src-list="[ossBaseUrl+form.imageUrl]" style="width: 80px; height: 80px"
              :src="ossBaseUrl+form.imageUrl" fit="contain" />
          </div>
          <div v-else>暂无图片</div>
        </div>
      </el-form-item>
      <el-form-item label="纹理名称" prop="embossTextureName">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.embossTextureName" maxlength="50" show-word-limit placeholder="请输入纹理名称"/>
        </div>
        <div v-show="disabled" style="width:100%">
          <div>{{drawerData.embossTextureName||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item label="适用工艺">
        <div v-show="!disabled" style="width:100%">
          <el-input v-model.trim="form.suitedCraftStr" maxlength="50" show-word-limit placeholder="请输入适用工艺"/>
        </div>
        <div v-show="disabled">
          <div>{{drawerData.suitedCraftStr||'-'}}</div>
        </div>
      </el-form-item>
      <el-form-item>
        <div v-show="!disabled">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" v-if="drawerType=='add'||drawerType=='copy'" @click="confirmChange(embossForm)" v-hasPermi="['maintain:add']">提交审批</el-button>
          <el-button type="primary" v-else @click="confirmChange(embossForm)" v-hasPermi="['maintain:change']">提交审批</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { checkChange } from '@/utils'
import { reactive, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox, genFileId  } from 'element-plus'
import { addTexture, changeTexture, } from '@/api/basicDatabase'
import { UploadImg } from '../upload'

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
const fileList = ref([])
const data = reactive({
  form: {},
})
const { form } = toRefs(data)
const emit = defineEmits();
const embossForm = ref(null)
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
  embossTextureName: [{ required: true, message: '请输入纹理名称', trigger: 'blur' },],
})
function changeDisabled(val) {
  switch (val) {
    case 'add':
      disabled.value = false
      break;
    case 'edit'://编辑
      disabled.value = false
      break;
    case 'copy'://复制
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
  changeTexture(data).then(res => {
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
    embossTextureName: form.value.embossTextureName,
    suitedCraftStr: form.value.suitedCraftStr || undefined
  }
  if (!!form.value.imageUrl) {
    data.imageUrl = form.value.imageUrl
  }
  if (fileList.value.length > 0) {
    data.imageUrl = await UploadImg(fileList.value[0].raw)
  }
  addTexture(data).then(res => {
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
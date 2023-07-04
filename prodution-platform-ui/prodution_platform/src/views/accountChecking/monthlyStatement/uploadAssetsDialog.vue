<template>
  <!-- 启动核算弹出框 -->
  <ACDialog title="上传付款凭证" width="40%" v-model="uploadDialogVisible" @close="uploadDialogVisible = false"
    @bottom-btn-click="handleSubmit">
    <template #default>
      <div class="ac-dialog-title dialog-title">是否确认已付款，若已付款请上传付款凭证<span style="color:var(--default-main-color)">（{{fileList.length}}/4）</span></div>
      <div class="fileUpload-box">
        <el-upload ref="uploadRef" v-model:file-list="fileList" action="#" :before-upload="beforeUpload"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.JPG,.JPEG,.PBG,.GIF,.BMP,.WEBP" :on-exceed="handleExceed"
          :on-success="handleUploadSuccess" :on-error="handleUploadError" list-type="picture-card" :auto-upload="false"
          :limit="4" multiple :class="{ 'hidden-tirgger': fileList?.length > 3 }">
          <el-icon>
            <Plus />
          </el-icon>
          <template #tip>
            <div class="el-upload__tip">
              <el-tag type="warning">最多上传4张图片</el-tag>
            </div>
          </template>
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
      </div>
      <div class="remark-box">
        <div>备注：</div>
        <el-input type="textarea" placeholder="请在此添加备注" rows="3" v-model.trim="dialogParams.remark" maxlength="200"
          show-word-limit></el-input>
      </div>
      <el-dialog v-model="imgViewerVisible" custom-class="preview-dialog">
        <!-- <img class="preImg" :src="dialogImageUrl" alt="Preview Image" /> -->
        <ACImgViewer v-model="imgViewerVisible" :imgs="[imgViewerUrls]"></ACImgViewer>
      </el-dialog>
    </template>
  </ACDialog>

</template>

<script setup name="uploadAssetsDialog">
import { ref } from 'vue';
import ACDialog from '@/components/ACDialog.vue'
import { ElMessage, ElLoading } from "element-plus";
import { Delete, Download, MessageBox, Plus, ZoomIn } from '@element-plus/icons-vue'
import { uploadFile, confirmSettlement } from "@/api/modules/accountChecking";
import ACImgViewer from '@/components/ACImgViewer.vue'

/******************组件********************/
const uploadDialogVisible = ref(false);
let dialogParams = reactive({
  remark: ""
});
const emit = defineEmits(['success'])
const loadingInstance = ref()
const handleSubmit = ({ confirm }) => {
  if (confirm) {
    if (fileList.value.length < 1) return ElMessage.warning('请至少添加一张付款凭证')
    let queue = fileList.value.map(e => {
      return submitUpload(e.raw)
    })
    Promise.all(queue).then(res => {
      let files = res.filter(el => !!el).map(item => item.fileUrl)
      submitData(files)
    })
    return
  } else {
    uploadDialogVisible.value = false
  }
}
/* watch(() => loadingInstance.value,
  (newVal, oldVal) => {
    if (newVal.value !== "checked") return
    let data = {
      fileList:fileList.value,
      ...dialogParams
    }
    emit("getSuccessData", data)
    uploadDialogVisible.value = false
  }
) */
watch(() => uploadDialogVisible.value,
  (newVal, oldVal) => {
    if (!newVal.value) {
      fileList.value = []
      dialogParams.remark = ""
    }
  }
)
//打开弹出框（供父级界面调用）
const openDialog = (params) => {
  Object.assign(dialogParams, params)
  uploadDialogVisible.value = true
}
defineExpose({
  openDialog
})


/********************上传*********************/
const fileList = ref([])
const dialogVisible = ref(false)
const uploadRef = ref()
const handleRemove = (file) => {
  console.log(file, fileList.value)
  fileList.value = fileList.value.filter(item => item.name !== file.name)
}
const beforeUpload = (rawFile) => {
  console.warn(666, rawFile);
  let typeList = ["image/bmp", "image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"]
  if (!typeList.includes(rawFile.type)) {
    ElMessage.error('上传图片格式不对')
    return false
  }
  return true
}
const handleExceed = () => {
  ElMessage({
    message: '最多上传四张凭证',
    offset: 90,
    type: 'error',
  })
}
const submitUpload = async (val) => {
  let form = new FormData()
  form.append("type", 4)
  form.append("file", val)
  const res = await uploadFile(form)
  let { code, message = '服务错误', data } = res
  if (code !== window.HTTP_SUCCESS) {
    ElMessage.error({ message })
    return false
  }
  return data
}
const submitData = (file) => {
  loadingInstance.value = ElLoading.service({ fullscreen: false })
  let payload = {
    payVoucherImg: file.toString(),
    remark: dialogParams.remark,
    settlementId: dialogParams.id
  }
  confirmSettlement(payload).then(res => {
    let { code, message = '服务错误', data } = res
    if (code !== window.HTTP_SUCCESS) {
      return ElMessage.error({ message })
    }
    emit("success", data)
    uploadDialogVisible.value = false
  }).finally(e => loadingInstance.value.close())
}

const dialogImageUrl = ref('')
const imgViewerVisible = ref(false)
const imgViewerUrls = ref([])
const handlePictureCardPreview = (file) => {
  console.warn(file);
    imgViewerVisible.value = true
    imgViewerUrls.value = [file.url]
  // dialogImageUrl.value = file.url
  // dialogVisible.value = true
}
const handleUploadSuccess = () => {
  loadingInstance.value.close()
  loadingInstance.value = "checked"
}
const handleUploadError = () => {
  loadingInstance.value.close()
  ElMessage({
    message: '上传失败，请重试',
    offset: 90,
    type: 'error',
  })
}


</script>
<style  lang="scss">
.preImg {
  width: fit-content;
  height: fit-content;
  max-width: 70vw;
  max-height: 70vh;
}
.preview-dialog {
  width: fit-content !important;
  height: fit-content !important;
  min-width: 30vw;
  min-height: 30vh;
  background: unset;
  box-shadow: none;
  .el-dialog__header {
    background: unset;
    display: none;
  }
  .el-dialog__body {
    background: unset;
  }
}
</style>
<style lang="scss" scoped>
.dialog-title {
  font-size: 14px;
  color: #333;
  line-height: 21px;
  margin-top: 0;
  margin-bottom: 16px;
}


.ac-dialog-title {
  &.center {
    text-align: center;
  }
}

.fileUpload-box {
  width: 100%;

  .el-tag {
    width: 100%;
  }

  :deep(.hidden-tirgger) {
    .el-upload--picture-card {
      display: none;
    }
  }
}

.remark-box {
  margin-top: 20px;
}
</style>
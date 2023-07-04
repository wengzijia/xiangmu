<template>
    <div>
        <div>方案设计</div>
        <el-form :model="drawerFormData" label-width="140px" ref="dialogForm">
            <el-form-item label="设计需求:">
              <div>
                <div v-for="(item, i) in drawerFormData.categoryList" :key="i">
                    <div><b style="color:#409EFF;margin-right: 4px;">|</b>{{ item.goodsName }}：</div>
                    <div style="text-indent:2em;word-break:break-all;" v-html="item.designRequirementRtf"  @click="imgViewer"></div>
                    <div v-if="item.designRequirementAttachmentList.length">
                        <div>附件:</div>
                        <div v-for="(file, index) in item.designRequirementAttachmentList" :key="index">
                            <span style="margin-right: 10px;word-break: break-all;">{{ getFileName(file) }}</span>
                            <singDownFile :url="file"/>
                        </div>
                    </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="方案设计:">
                <div v-for="(item, i) in drawerFormData.categoryList" :key="i">
                    <crmFileUpload down v-model:modelValue="item.designFileUrl" showFile />
                    <span>{{ item.goodsName }}</span>
                </div>
            </el-form-item>
            <el-form-item label="提交时间:">
                <div v-if="drawerFormData?.categoryList?.length">
                    {{ parseDate(drawerFormData?.categoryList[0]?.updateTime) }}
                </div>
                <span v-else>-</span>
            </el-form-item>
        </el-form>
        <div>客户确认结果</div>
        <el-form v-if="activeName == '1'" :model="drawerFormData" label-width="140px" ref="dialogForm">
            <el-form-item label="是否通过:">
                <template #label>
                    <span><span style="color:red">*</span>是否通过:</span>
                </template>
                <el-select v-model="passed" placeholder="请选择客户是否通过" clearable style="width:252px;">
                    <el-option label="同意" :value="true" />
                    <el-option label="不同意" :value="false" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="passed" label="客户确认凭证：">
              <template #label>
                  <span style="color: red;">* </span>
                  <span>客户确认凭证:</span>
              </template>
                <crmFileUpload style="width: 400px" v-model:modelValue="drawerFormData.customerConfirmCertificateUrl"
                :disabled="drawerFormData.disabled" :showFile="drawerFormData.disabled" replace
                name="上传确认凭证" :fileType="['jpg','jpeg','png']" :del="true" :fileSize="10"></crmFileUpload>
            </el-form-item>
            <el-form-item v-if="passed===false" label="备注原因:">
                <template #label>
                    <span><span style="color:red">*</span>备注原因:</span>
                </template>
                <el-input v-model.trim="drawerFormData.customerConfirmRejectReason"  maxlength="300" show-word-limit/>
            </el-form-item>
        </el-form>
        <el-form v-if="activeName == '2'" :model="drawerFormData" label-width="130px" ref="dialogForm">
            <el-form-item label="是否通过:">
                <div>{{ drawerFormData.customerConfirmStatus == '2' ? '同意' : '不同意' }}</div>
            </el-form-item>
            <el-form-item v-if="drawerFormData.customerConfirmStatus == '2'" label="客户确认凭证:">
              <crmFileUpload style="width: 400px" v-model:modelValue="drawerFormData.customerConfirmCertificateUrl"
                :disabled="drawerFormData.disabled" :showFile="drawerFormData.disabled" replace
                name="上传确认凭证" :fileType="['jpg','jpeg','png']" :del="true" :fileSize="10"></crmFileUpload>
            </el-form-item>
            <el-form-item v-if="drawerFormData.customerConfirmStatus != '2'" label="备注原因:">
                <div style="word-break:break-all;">{{ drawerFormData.submitDesignProposalRejectReason }}</div>
            </el-form-item>
            <el-form-item label="审核时间:">
                <div>{{ parseDate(drawerFormData.customerConfirmTime) }}</div>
            </el-form-item>
        </el-form>
        <div v-if="activeName == '1'&&drawerFormData?.id" class="form-tool-bar">
            <div style="min-width:160px;width:160px;">
                <el-button @click="clear">取消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </div>
        <div v-if="activeName == '2'" class="form-tool-bar">
            <el-button @click="clear" type="primary">关闭</el-button>
        </div>
        <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" ></el-image-viewer>
    </div>
</template>

<script setup>
import { getConfirmsDetail,confirmsDesign } from "@/api/crm/customer/index";
import { getFileName, parseDate } from "@/utils/index";
// import { BASE_FILE_URL } from "@/store/global-constant";
import { ElMessage } from 'element-plus';
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue"
import { reactive } from "vue";
import singDownFile from "@/components/singDownFile"
const props = defineProps({
    activeName: {
        type: String,
        default: ''
    },
    id:{
        type: String,
        default: ''
    }
})
const data = reactive({
    drawerFormData:{}
})
const { drawerFormData } = toRefs(data)
const passed = ref(null)
const { proxy } = getCurrentInstance();
const emit = defineEmits()

function getDetail(){
    if (!props.id) {
        return
    }
  getConfirmsDetail(props.id).then(res=>{
    if (res.code==200) {
      let obj = res.data
      if (obj.categoryList) {
        obj.categoryList = obj.categoryList.map(item=>{
          if (item.designRequirementAttachment) {
            item.designRequirementAttachmentList = item.designRequirementAttachment.split(',')
          }else{
            item.designRequirementAttachmentList = []
          }
          return item
        })
      }else{
        obj.categoryList = []
      }
      drawerFormData.value = obj
      if (obj.customerConfirmCertificateUrl) {
        drawerFormData.value.disabled = true
      }
    }
  })
}
getDetail()
function submit(){
  if (passed.value===null) {
    ElMessage.error('请选择确认结果')
    return
  }
  if (passed.value&&!drawerFormData.value.customerConfirmCertificateUrl) {
    ElMessage.error('请上传客户确认凭证')
    return    
  }
  if (!passed.value&&!drawerFormData.value.customerConfirmRejectReason) {
    ElMessage.error('请填写备注原因')
    return    
  }
  proxy.$modal.loading('确认中，请稍候...')
  confirmsDesign({
    "customerConfirmCertificateName": drawerFormData.value.customerConfirmCertificateUrl?getFileName(drawerFormData.value.customerConfirmCertificateUrl):'',//客户确认凭证名称
    "customerConfirmCertificateUrl": drawerFormData.value.customerConfirmCertificateUrl,//客户确认凭证url
    "customerConfirmRejectReason": drawerFormData.value.customerConfirmRejectReason,//备注原因
    "id": drawerFormData.value.id,
    "passed": passed.value
  }).then(res=>{
    if (res.code==200) {
    //   drawer.value = false
    //   getList()
        emit('closeDrawer',true)
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
  })
}

// 富文本内容图片放大
let isPreviewImgShow = ref(false)
let previewList = ref([])
function imgViewer(e){
  if (e.target.tagName == 'IMG') {
    previewList.value = [e.target.src]
    isPreviewImgShow.value = true
  }
}
function closeImgViewer(){
  isPreviewImgShow.value = false
}

function clear(){
  emit('closeDrawer',false)
}
</script>

<style lang="scss" scoped>
.form-tool-bar {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
}
</style>
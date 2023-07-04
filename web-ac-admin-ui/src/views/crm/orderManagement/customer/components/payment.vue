<template>
    <div>
        <div style="margin: 10px 0;">对账单{{activeName == '1'?'确认':''}}</div>
        <el-form :model="drawerFormData" label-width="140px" ref="dialogForm">
            <el-form-item label="对账单:">
                <span style="word-break: break-all;">{{drawerFormData.task?.generalAccountStatementName||'-'}}</span>
                <singDownFile :url="drawerFormData.task?.generalAccountStatementUrl"></singDownFile>
            </el-form-item>
            <el-form-item label="订单总价:">
                <div>
                    {{showMoney(drawerFormData.task?.orderTaxInclusiveTotalPrice||'-')}}
                </div>
            </el-form-item>
            <el-form-item label="尾款最晚日期:">
                <div>
                  {{drawerFormData?.performancePaymentRecord?.finalPaymentLatestDate||'-'}}
                </div>
            </el-form-item>
            <el-form-item label="备注:">
                <div style="word-break:break-all;">
                  {{drawerFormData.task?.submitGeneralAccountStatementRemark||'-'}}
                </div>
            </el-form-item>
        </el-form>
        <div style="margin: 10px 0;">客户确认结果</div>
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
                <el-input v-model.trim="drawerFormData.customerConfirmRejectReason" maxlength="300" show-word-limit />
            </el-form-item>
        </el-form>
        <el-form v-if="activeName == '2'" :model="drawerFormData" label-width="140px" ref="dialogForm">
            <el-form-item label="是否通过:">
                <div>{{ drawerFormData?.task?.customerConfirmStatus == '2' ? '同意' : '不同意' }}</div>
            </el-form-item>
            <el-form-item v-if="drawerFormData?.task?.customerConfirmStatus == '2'" label="客户确认凭证:">
                <crmFileUpload v-if="drawerFormData?.task" style="width: 400px" v-model:modelValue="drawerFormData.task.customerConfirmCertificateUrl"
                  :disabled="drawerFormData.disabled" showFile down
                  name="上传确认凭证" :fileType="['jpg','jpeg','png']" :del="true" :fileSize="10"></crmFileUpload>
            </el-form-item>
            <el-form-item v-if="drawerFormData?.task?.customerConfirmStatus != '2'" label="备注原因:">
                <div style="word-break:break-all;">{{ drawerFormData?.task?.customerConfirmRejectReason ||'-'}}</div>
            </el-form-item>
            <el-form-item label="审核时间:">
                <div>{{ parseDate(drawerFormData?.task?.customerConfirmTime) }}</div>
            </el-form-item>
        </el-form>
        <div v-if="activeName == '1'&&drawerFormData?.id" class="form-tool-bar">
            <div style="min-width:160px;width:160px;">
                <el-button @click="clear">取消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </div>
        <div v-if="activeName == '2'"  class="form-tool-bar">
            <el-button @click="clear" type="primary">关闭</el-button>
        </div>
        <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" ></el-image-viewer>
    </div>
</template>

<script setup>
import { getConfirmsAccountDetail,confirmsAccountStatement } from "@/api/crm/customer/index";
import { getFileName, parseDate } from "@/utils/index";
import { ElMessage } from 'element-plus';
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue";
import singDownFile from "@/components/singDownFile";
import { reactive } from "vue";
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
  getConfirmsAccountDetail(props.id).then(res=>{
    if (res.code==200) {
      let obj = res.data
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
  confirmsAccountStatement({
    "customerConfirmCertificateName": drawerFormData.value.customerConfirmCertificateUrl?getFileName(drawerFormData.value.customerConfirmCertificateUrl):'',//客户确认凭证名称
    "customerConfirmCertificateUrl": drawerFormData.value.customerConfirmCertificateUrl,//客户确认凭证url
    "customerConfirmRejectReason": drawerFormData.value.customerConfirmRejectReason,//备注原因
    "id": drawerFormData.value.task.id,
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
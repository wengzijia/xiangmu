<template>
  <div>
    <el-drawer v-model="isAuditPayment" direction="rtl" size="600px" title="付款凭证审核">
      <template #default>
        <div>
          <el-form label-width="134px" class="auditPayment" size="default" status-icon>
            <el-form-item v-if="auditInfo.auditStatus != 1" label="审核结果：">
              <div>
                <DictText dict="crm_audit_status" :value="auditInfo.auditStatus" />
              </div>
            </el-form-item>

            <el-form-item label="上传付款凭证：">
              <div>
                <img v-if="isImg(auditInfo.paymentUrl)" class="imgs" :src="BASE_FILE_URL + auditInfo.paymentUrl" alt="" />
                <span v-else>{{ auditInfo.paymentName }}</span>
                <span class="downLoadFiles" @click="singleDownloadFn(auditInfo.paymentUrl)">下载</span>
              </div>
            </el-form-item>
            <el-form-item label="是否删除：">
              <div>{{ auditInfo.deleted ? '是' : '否' }}</div>
            </el-form-item>
            <el-form-item label="付款流水号：">
              <div>{{ auditInfo.paymentSerialNumber }}</div>
            </el-form-item>
            <el-form-item label="实际付款金额：">
              <div>{{ showMoney(auditInfo.settlementAmount) }}</div>
            </el-form-item>
            <el-form-item label="实际付款时间：">
              <span>{{
                formatDate(auditInfo.realityPaymentTime)
              }}</span>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto" v-if="auditAndLook == '1'">
          <el-button @click="cancelClick">审核不通过</el-button>
          <el-button type="primary" @click="confirmClick">审核通过</el-button>
        </div>
        <div style="flex: auto" v-if="auditAndLook == '2'">
          <el-button type="primary" @click="isAuditPayment = false">关闭</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { BASE_FILE_URL } from '@/store/global-constant'
import { ElMessage } from 'element-plus'
import { auditPaymentRecord } from '@/api/orderManagement/performancePayment'
import { formatDate } from '@/utils/index'
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { crm_audit_status } = proxy.useDict('crm_audit_status')
const emits = defineEmits(['lookPaymentRecord'])

const data = reactive({
  auditInfo: '',
  isAuditPayment: false,
  auditAndLook: '',
  formData: {
    id: '',
    passed: false,
  },
  fileList: [],
})
const { isAuditPayment, formData, auditAndLook, auditInfo, fileList } =
  toRefs(data)
const dd = {
  fileName: 'string',
}
const singleDownloadFn = (paymentUrl) => {
  window.location.href =
    '/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName=' +
    paymentUrl
}

// 审核接口
const auditPaymentRecordFn = (flag) => {
  formData.value.passed = flag
  auditPaymentRecord(formData.value).then((res) => {
    // console.log('res====', res)
    if (res.code == 200) {
      ElMessage.success('付款凭证审核成功')
      emits('lookPaymentRecord', 1)
    }
  })
}
const isImg = (url) => {
  return url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg')
}
// 审核不通过
const cancelClick = () => {
  isAuditPayment.value = false
  auditPaymentRecordFn(false)
}
// 审核通过
const confirmClick = () => {
  isAuditPayment.value = false
  auditPaymentRecordFn(true)
}
// 控制弹框显示和接受父组件的传值
const paymentShow = (item, type) => {
  isAuditPayment.value = true
  auditInfo.value = item
  formData.value.id = item.id
  auditAndLook.value = type
}
defineExpose({
  paymentShow,
})
</script>

<style>
.auditPayment .el-form-item__label {
  font-weight: 700;
}

.imgs {
  width: 200px;
  height: 90px;
  margin-right: 10px;
}

.downLoadFiles {
  color: #409eff;
  cursor: pointer;
  margin-left: 10px;
}</style>

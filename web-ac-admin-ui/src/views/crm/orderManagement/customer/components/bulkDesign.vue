<template>
    <div>
        <div>大货方案设计</div>
        <template v-for="(item, index) in drawerFormData" :key="index">
            <el-form label-width="130px" :disabled="item.task.customerConfirmsStatus == '2'">
                <el-card style="margin:10px">
                    <el-form-item label="大货工单号:">
                        <template #label>
                            <span style="font-size: 16px;font-weight: 600;">大货工单号:</span>
                        </template>
                        <div style="font-size: 16px;font-weight: 600;">{{ item?.bulkBusinessKey }}</div>
                    </el-form-item>
                    <el-form-item label="品类:">
                        <span v-for="(a, i) in item.categoryList">{{ a.goodsName }}<span
                                v-if="i < item.categoryList.length - 1">/</span></span>
                    </el-form-item>
                    <el-form-item label="大货生产数量:">
                        <span v-for="(a, i) in item.categoryList">{{ a.bulkProdQuantity }}<span
                                v-if="i < item.categoryList.length - 1">/</span></span>
                    </el-form-item>
                    <el-form-item label="提交时间:">
                        <div>{{ item.startTime }}</div>
                    </el-form-item>
                    <el-form-item label="方案设计:">
                        <crmFileUpload v-for="(a, i) in item.categoryList" :key="i" style="width: 400px"
                            v-model:modelValue="a.bulkDesignFileUrl" name="立即上传" :disabled="true"
                            :fileType="['pdf', 'png', 'jpg', 'mp4', 'zip', 'rar']" :fileSize="50" replace showFile>
                        </crmFileUpload>
                    </el-form-item>
                    <div style="margin-bottom: 20px;">客户确认结果</div>
                    <el-form-item v-if="activeName == '1'" label="是否通过:">
                        <template #label>
                            <span><span style="color:red">*</span>是否通过:</span>
                        </template>
                        <el-select v-model="item.passed" placeholder="请选择客户是否通过" clearable style="width:320px;">
                            <el-option label="同意" :value="true" />
                            <el-option label="不同意" :value="false" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="item.passed && activeName == '1'"
                        label="客户确认凭证：">
                        <template #label>
                            <span style="color: red;">* </span>
                            <span>客户确认凭证:</span>
                        </template>
                        <crmFileUpload style="width: 400px" v-model:modelValue="item.customerConfirmCertificateUrl"
                            :disabled="item.disabled || item.task.customerConfirmsStatus == '2'" :showFile="item.disabled || item.task.customerConfirmsStatus == '2'"
                            replace name="上传确认凭证" :fileType="['jpg', 'jpeg', 'png']" :del="true" :fileSize="10">
                        </crmFileUpload>
                    </el-form-item>
                    <el-form-item v-if="item.passed === false && activeName == '1'" label="备注原因:">
                        <template #label>
                            <span><span style="color:red">*</span>备注原因:</span>
                        </template>
                        <el-input v-model.trim="item.customerConfirmRejectReason" maxlength="300" show-word-limit :disabled="item.disabled || item.task.customerConfirmsStatus == '2'"/>
                    </el-form-item>
                    <el-form-item v-if="activeName == '2'" label="是否通过:">
                        <div>
                            <DictTag style="display: inline-block;" :value="item?.task?.customerConfirmsStatus"
                                :options="crm_customer_confirm_status" />
                        </div>
                    </el-form-item>
                    <el-form-item v-if="activeName == '2' && item?.task?.customerConfirmsStatus == '2'" label="客户确认凭证:">
                        <crmFileUpload style="width: 400px" v-model:modelValue="item.task.customerConfirmCertificateUrl"
                            :disabled="item.disabled" showFile name="上传确认凭证" :fileType="['jpg', 'jpeg', 'png']" :del="true"
                            :fileSize="10"></crmFileUpload>
                    </el-form-item>
                    <el-form-item v-if="activeName == '2' && item?.task?.customerConfirmsStatus != '2'" label="备注原因:">
                        <div style="word-break:break-all;">{{ item?.task?.customerConfirmsRejectReason || '-' }}</div>
                    </el-form-item>
                    <el-form-item v-if="activeName == '2'||(item?.task?.customerConfirmsTime&&activeName == '1')" label="审核时间:">
                        <div>{{ parseDate(item?.task?.customerConfirmsTime) }}</div>
                    </el-form-item>
                </el-card>
            </el-form>
        </template>
        <!-- <el-form v-if="activeName == '2'" :model="item" label-width="130px" ref="dialogForm">
            <el-form-item label="是否通过:">
                <div>{{ item.customerConfirmStatus == '2' ? '同意' : '不同意' }}</div>
            </el-form-item>
            <el-form-item label="客户确认凭证:">
              <crmFileUpload style="width: 400px" v-model:modelValue="item.customerConfirmCertificateUrl"
                :disabled="item.disabled" showFile 
                name="上传确认凭证" :fileType="['jpg','jpeg','png']" :del="true" :fileSize="2"></crmFileUpload>
            </el-form-item>
            <el-form-item label="审核时间:">
                <div>{{ parseDate(item.customerConfirmTime) }}</div>
            </el-form-item>
        </el-form> -->
        <div v-if="activeName == '1' && drawerFormData?.length" style="min-width:160px;width:100%;text-align: right;">
            <el-button @click="clear">取消</el-button>
            <el-button type="primary" @click="confirm">提交审核</el-button>
        </div>
        <div v-if="activeName == '2'" style="min-width:160px;width:100%;text-align: right;">
            <el-button @click="clear" type="primary">关闭</el-button>
        </div>
    </div>
</template>

<script setup>
import { getCustomerConfirmsDetail, customerConfirmsBulkFileDesign } from "@/api/crm/customer/index"
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue"
import { ElMessage } from "element-plus";
import { getFileName, parseDate } from "@/utils/index";
const props = defineProps({
    activeName: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: ''
    }
})
const data = reactive({
    drawerFormData: {}
})
const { drawerFormData } = toRefs(data)
const emit = defineEmits()
const { proxy } = getCurrentInstance()
const {
    crm_customer_confirm_status,
} = proxy.useDict(
    "crm_customer_confirm_status",
)

function getDetail() {
    if (!props.id) {
        return
    }
    getCustomerConfirmsDetail(props.id).then(res => {
        if (res.code == 200) {
            drawerFormData.value = res.data.map(item => {
                if (item.task.customerConfirmsStatus == '2') {
                    item.passed = true
                } else {
                    item.passed = ''
                }
                return item
            })

        }
    })
}
getDetail()
function confirm() {
    let flag = 0
    drawerFormData.value.map((item, index) => {
        if ((item.passed && !item.customerConfirmCertificateUrl) || (!item.passed && !item.customerConfirmRejectReason) || (item.passed !== true && item.passed !== false)) {
            flag = index + 1
        }
    })
    if (flag) {
        let str = ''
        if (drawerFormData.value[flag - 1].passed) {
            str = `请上传第${flag}个订单的客户确认凭证`
        } else {
            str = `请填写第${flag}个订单的备注原因`
        }
        ElMessage.error(str)
        return
    }
    let taskList = drawerFormData.value.filter(item => { return item.task.customerConfirmsStatus != '2' }).map(item => {
        let obj = {
            "customerConfirmCertificateName": item.customerConfirmCertificateUrl ? getFileName(item.customerConfirmCertificateUrl) : '',
            "customerConfirmCertificateUrl": item?.customerConfirmCertificateUrl,
            "customerConfirmRejectReason": item?.customerConfirmRejectReason,
            "id": item.task.id,
            "passed": item.passed
        }
        return obj
    })
    proxy.$modal.loading('数据提交中，请稍候...')
    customerConfirmsBulkFileDesign({
        recordId: props.id,
        taskList: taskList
    }).then(res => {
        if (res.code == 200) {
            ElMessage.success('提交成功！')
            emit('closeDrawer', true)
        }
    }).finally(() => {
        proxy.$modal.closeLoading()
    })
}
function clear() {
    emit('closeDrawer', false)
}
</script>

<style lang="scss" scoped></style>
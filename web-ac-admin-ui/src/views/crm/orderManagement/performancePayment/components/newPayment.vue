<template>
	<div>
		<el-drawer v-model="isNewPayment" direction="rtl" size="600px" title="新增付款凭证" @close="cancelClick">
			<template #default>
				<div>
					<el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="134px" class="demo-ruleForm"
						size="default" status-icon>
						<el-form-item label="上传付款凭证：" prop="paymentUrl">
							<crmFileUpload v-model:modelValue="ruleForm.paymentUrl" name="上传文件"
								:fileType="['pdf', 'png', 'jpg', 'jpeg']" :fileSize="50" :del="true" replace>
							</crmFileUpload>
						</el-form-item>
						<el-form-item label="付款流水号：" prop="paymentSerialNumber">
							<el-input v-model="ruleForm.paymentSerialNumber" placeholder="请输入客户付款流水号" maxlength="15" />
						</el-form-item>
						<el-form-item label="本单结算金额：" prop="settlementAmount">
							<el-input v-model="ruleForm.settlementAmount" placeholder="请输入实际结算金额" maxlength="15" />
						</el-form-item>
						<el-form-item label="实际付款时间：" prop="realityPaymentTime">
							<el-date-picker style="width: 423px" v-model="ruleForm.realityPaymentTime" type="datetime"
								placeholder="请选择实际付款时间" size="default" format="YYYY-MM-DD HH:mm:ss"
								value-format="YYYY-MM-DD HH:mm:ss" />
						</el-form-item>
					</el-form>
				</div>
			</template>
			<template #footer>
				<div style="flex: auto">
					<el-button @click="cancelClick">取消</el-button>
					<el-button type="primary" @click="confirmClick">提交审核</el-button>
				</div>
			</template>
		</el-drawer>
	</div>
</template>

<script setup>
import crmFileUpload from '@/components/FileUpload/crmFileUpload.vue'
import { ElMessage, ElLoading } from 'element-plus'
import { paymentRecord } from '@/api/orderManagement/performancePayment'
import { validateForms } from '@/utils/form'
const route = useRoute()
const emits = defineEmits(['performancePaymentDetailsFn'])
const ruleFormRef = ref()
const data = reactive({
	isNewPayment: false,
})
const { isNewPayment } = toRefs(data)
const ruleForm = reactive({
	paymentName: '', //付款凭证名称
	paymentSerialNumber: '', //付款流水号
	paymentUrl: '', //付款凭证url
	performancePaymentRecordId: '', //履约付款记录id
	realityPaymentTime: '', //实际付款时间
	settlementAmount: '', //结算金额
})
// 保留两位小数
const validateMoney = (rule, value, callback) => {
	let reg = /^[0-9]\d{0,11}(\.\d{1,2})?$/
	if (value === '' || value === null) {
		callback(new Error('请输入实际结算金额'))
	} else {
		if (!reg.test(value)) {
			callback(new Error('整数最大12位，小数点最大2位'))
		} else {
			callback()
		}
	}
}
const rules = reactive({
	paymentUrl: [
		{
			required: true,
			message: '请上传付款凭证',
			trigger: 'change',
		},
	],
	paymentSerialNumber: [
		{
			required: true,
			message: '请输入客户付款流水号',
			trigger: 'blur',
		},
	],
	settlementAmount: [
		{
			required: true,
			// message: '请输入实际结算金额',
			validator: validateMoney,
			trigger: 'blur',
		},
	],
	realityPaymentTime: [
		{
			required: true,
			message: '请选择实际付款时间',
			trigger: 'change',
		},
	],
})
// 获取路径的名字
const fileName = (url) => {
	if (url) {
		let urlList = url.split('/')
		return urlList[urlList.length - 1].replace('filemanage', '')
	}
}

const cancelClick = () => {
	isNewPayment.value = false
	ruleFormRef.value.resetFields()
	ruleForm.paymentName = ''
	ruleForm.performancePaymentRecordId = ''
}
// 新增付款凭证记录
const paymentRecordFn = () => {
	const loading = ElLoading.service({
		lock: true,
		text: 'Loading',
		background: 'rgba(0, 0, 0, 0.7)',
	})
	ruleForm.paymentName = fileName(ruleForm.paymentUrl)
	ruleForm.performancePaymentRecordId = route.query.id
	paymentRecord(ruleForm).then((res) => {
		// console.log('res----', res)
		if (res.code == '200') {
			loading.close()
			emits('performancePaymentDetailsFn')
			cancelClick()
			ElMessage.success('新增付款凭证成功!')
		}
	})
}
const confirmClick = () => {
	let formRefs = [ruleFormRef.value]
	validateForms(formRefs)
		.then(() => {
			paymentRecordFn()
		})
		.catch((err) => {
			console.log(err)
		})
}
const paymentShow = () => {
	isNewPayment.value = true
}
defineExpose({
	paymentShow,
})
</script>

<style scoped></style>

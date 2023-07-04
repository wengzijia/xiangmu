<template>
	<div class="lookDetail">
		<el-drawer
			v-model="isTask"
			direction="rtl"
			size="600px"
			:title="title"
			@close="cancelClick"
		>
			<template #default>
				<div>
					<div class="tips" v-if="orderInfo.orderStatus == '2'">
						<el-icon style="font-size: 14px"
							><WarningFilled
						/></el-icon>
						<span style="margin-left: 8px"
							>订单已完成订单中止只能拒绝</span
						>
					</div>
					<el-form
						:model="formData"
						:rules="rules"
						label-width="150px"
						ref="supplyRef"
					>
						<el-form-item label="变更类型：" prop="applyType">
							<div v-if="orderType == '2'">
								<DictTag
									:value="formData.applyType"
									:options="crm_apply_type"
								/>
							</div>
							<el-select
								v-if="orderType == '1'"
								v-model="formData.applyType"
								class="m-2"
								style="width: 440px"
								placeholder="所有"
								clearable
							>
								<el-option
									v-for="item in crm_apply_type"
									:key="item.id"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
						<el-form-item
							label="订单编号："
							v-if="orderType == '1'"
							prop="orderBusinessKey"
						>
							<el-input
								v-model.trim="formData.orderBusinessKey"
								:maxlength="50"
								placeholder="请输入需要变更的订单编号"
								@input="preApplicationDataFn"
							/>
						</el-form-item>
						<el-form-item
							v-if="orderType == '1' && preOrderData"
							label="方案设计领取人："
						>
							<span>{{
								preOrderData.designerName
									? preOrderData.designerName
									: '-'
							}}</span>
						</el-form-item>
						<el-form-item
							v-if="orderType == '1' && preOrderData"
							label="打样领取人："
						>
							<span>{{
								preOrderData.proofingSupplyChainSpecialistName
									? preOrderData.proofingSupplyChainSpecialistName
									: '-'
							}}</span>
						</el-form-item>
						<el-form-item
							v-if="orderType == '1' && preOrderData"
							label="大货领取人："
						>
							<span>{{
								preOrderData.bulkSupplyChainSpecialistName
									? preOrderData.bulkSupplyChainSpecialistName
									: '-'
							}}</span>
						</el-form-item>
						<el-form-item
							v-if="
								orderType == '2' && orderInfo.applyStatus != '1'
							"
							label="审批结果："
						>
							<span>
								<DictTag
									:value="orderInfo.applyStatus"
									:options="crm_orderChange_status"
								/>
							</span>
						</el-form-item>
					</el-form>
				</div>
			</template>
			<template #footer>
				<div v-if="orderType == '1'" style="flex: auto">
					<el-button @click="cancelClick">取消</el-button>
					<el-button type="primary" @click="confirmClick"
						>确认</el-button
					>
				</div>
				<div v-if="orderType == '2' && orderInfo.applyStatus == '1'">
					<el-button
						@click="auditOrderFn(false)"
						>拒绝</el-button
					>
					<el-button
						type="primary"
						@click="auditOrderFn(true)"
						>通过</el-button
					>
				</div>
				<div v-if="orderType == '2' && orderInfo.applyStatus != '1'">
					<el-button
						type="primary"
						@click="cancelClick"
						>关闭</el-button
					>
				</div>
			</template>
		</el-drawer>
	</div>
</template>

<script setup>
import {
	newChangeOrder,
	auditOrder,
	preApplicationData,
} from '@/api/orderManagement/changeOrder'
import { validateForms } from '@/utils/form'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { crm_apply_type, crm_orderChange_status } = proxy.useDict(
	'crm_apply_type',
	'crm_orderChange_status'
)
const supplyRef = ref()
const emits = defineEmits(['orderChangeRecordFn'])
const taskData = reactive({
	orderType: '1',
	title: '',
	isTask: false,
	preOrderData: '',
	isApplying: false,
	procStatus: '',
	orderInfo: '',
	formData: {
		applyType: '', //申请类型
		orderId: '', //订单id
		orderType: '', //订单类型
		orderBusinessKey: '', //订单编号
	},
	auditParm: {
		id: '', //订单变更记录id
		passed: false,
	},
})
const {
	auditParm,
	orderInfo,
	title,
	formData,
	isTask,
	orderType,
	preOrderData,
	isApplying,
	procStatus,
} = toRefs(taskData)
const rules = reactive({
	applyType: [
		{
			required: true,
			message: '请选择订单',
			trigger: 'change',
		},
	],
	orderBusinessKey: [
		{
			required: true,
			message: '请输入订单编号',
			trigger: 'change',
		},
	],
})
// 根据订单编号查询订单变更申请前数据
const preApplicationDataFn = () => {
	if (
		formData.value.orderBusinessKey != '' &&
		formData.value.orderBusinessKey != null
	) {
		preApplicationData(formData.value.orderBusinessKey).then((res) => {
			if (res.code == 200) {
				preOrderData.value = res.data
				formData.value.orderId = res.data?.id
				formData.value.orderType = res.data?.procType
				isApplying.value = res.data?.applying //订单是否正在申请变更审批中
				procStatus.value = res.data?.procStatus //订单是否正在申请变更审批中
			}
		})
	}
}

// 外部弹出的取消按钮
function cancelClick() {
	isTask.value = false
	preOrderData.value = ''
	formData.value.applyType = ''
	supplyRef.value.resetFields()
}
watch(isTask,(val)=>{
	if (!val) {
		orderInfo.value = ''
	}
})
// 审批订单变更
const auditOrderFn = (type) => {
	if (orderInfo.value.orderStatus == '2'&&type) {
		ElMessageBox.confirm('订单已完成请直接拒绝审批申请。', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
		return
	}
	auditParm.value.passed = type
	ElMessageBox.confirm('操作立即生效，是否继续？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then((res) => {
		auditOrder(auditParm.value).then((res) => {
			if (res.code == 200) {
				ElMessage({
					message: '审核成功',
					type: 'success',
				})
				cancelClick()
				emits('orderChangeRecordFn', 1)
			}
		})
	})
}
//  新建订单变更
const newChangeOrderFn = () => {
	delete formData.value.orderBusinessKey
	newChangeOrder(formData.value).then((res) => {
		if (res.code == 200) {
			ElMessage({
				message: '新建订单变更成功',
				type: 'success',
			})
			cancelClick()
			emits('orderChangeRecordFn', 1)
		}
	})
}
// 确认
function confirmClick() {
	let formRefs = [supplyRef.value]
	validateForms(formRefs)
		.then(() => {
			if (!formData.value.orderId) {
				ElMessageBox.confirm('该订单不存在，请输入正确的订单号', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				})
				return
			}

			if (procStatus.value == '1') {
				if (isApplying.value) {
					ElMessageBox.confirm(
						'订单正在申请变更审批中，请勿重复发起',
						{
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							type: 'warning',
						}
					)
				} else {
					if (
						formData.value.orderType == 'bulk_order' &&
						!preOrderData.proofingSupplyChainSpecialistName
					) {
						ElMessageBox.confirm(
							'订单目前尚未流转申请立即生效是否继续？',
							{
								confirmButtonText: '确认',
								cancelButtonText: '取消',
								type: 'warning',
							}
						).then((res) => {
							newChangeOrderFn()
						})
					} else {
						newChangeOrderFn()
					}
				}
			} else {
				ElMessageBox.confirm('订单已完成或已关闭，请选择其他订单', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				})
			}
		})
		.catch((err) => {
			console.log(err)
		})
}
//显示弹窗
const taskShow = (type, item) => {
	isTask.value = true
	orderType.value = type
	if (type == '1') {
		title.value = '新建变更申请'
	} else {
		title.value = '变更详情'
		orderInfo.value = item
		formData.value.applyType = item.applyType
		auditParm.value.id = item.id
	}
}
defineExpose({
	taskShow,
})
</script>

<style scoped>
.lookDetail :deep(.el-form-item__label) {
	font-weight: 700;
}
.btnSelect > p {
	color: #ff3399;
	font-size: 12px;
	margin: 0;
}
.input-select {
	margin-bottom: 20px;
}
.laypage {
	display: flex;
	justify-content: right;
	margin-top: 20px;
}
.tips {
	font-size: 12px;
	color: #999;
	background: #d9d9d9;
	padding: 2px 56px;
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}
</style>

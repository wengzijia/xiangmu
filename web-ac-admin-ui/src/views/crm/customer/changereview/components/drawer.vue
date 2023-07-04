<template>
	<div class="lookDetail">
		<!-- <el-drawer
			v-model="isTable"
			direction="rtl"
			title="基础信息"
			size="600px"
			@close="cancelClick"
		> -->
			<!-- <template #default> -->
				<div>
					<el-form
						ref="ruleFormRef"
						:model="ruleForm"
						:rules="rules"
						label-width="120px"
						class="demo-ruleForm"
						size="default"
						status-icon
					>
						<el-form-item label="选择客户：" prop="customerId">
							<el-select
								v-model="ruleForm.customerId"
								placeholder="请选择客户"
								style="width: 423px"
								clearable
								filterable
							>
								<div
									v-if="isMounted && isTable"
									v-infinite-scroll="load"
									style="overflow: auto; height: 130px"
								>
									<!-- <div  v-infinite-scroll="load" style="overflow: auto; height: 130px"> -->
									<el-option
										v-for="item in customerList"
										:key="item.id"
										:label="item.customerName"
										:value="item.customerId"
										@click="
											selectCustom(
												item.customerNumber,
												item.customerName,
												item.moreSettlementMethod
											)
										"
									/>
								</div>
							</el-select>
						</el-form-item>
						<el-form-item
							label="结算方式："
							prop="settlementMethod"
						>
							<el-radio-group v-model="ruleForm.settlementMethod">
								<el-radio :label="1">立结</el-radio>
								<el-radio
									v-if="ruleForm.customerSettlementMethod"
									:label="ruleForm.customerSettlementMethod"
								>
									<DictTag
										:value="
											ruleForm.customerSettlementMethod
										"
										:options="crm_payment_type"
									/>
								</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item
							label="设计服务合同："
							prop="designServiceContractUrl"
						>
							<file-upload
								v-model:modelValue="
									ruleForm.designServiceContractUrl
								"
								name="上传合同"
								:fileType="['pdf', 'png', 'jpg', 'jpeg']"
								:fileSize="50"
								:del="true"
								replace
							></file-upload>
						</el-form-item>
						<el-form-item
							label="合同编号"
							prop="designServiceContractNo"
						>
							<el-input
								v-model="ruleForm.designServiceContractNo"
								maxlength="50"
								placeholder="请输入合同编号"
								show-word-limit
								type="text"
							/>
						</el-form-item>
						<el-form-item
							label="设计文件："
							prop="designFileUrl"
						>
							<file-upload
								v-model:modelValue="ruleForm.designFileUrl"
								name="上传客户提供设计文件"
								:fileType="['pdf', 'png', 'jpg', 'jpeg']"
								:fileSize="50"
								:del="true"
								replace
							>
							</file-upload>
						</el-form-item>

						<el-form-item label="品类：" prop="category">
							<el-select
								v-model="ruleForm.category"
								placeholder="请选择品类"
								style="width: 423px"
								clearable
								filterable
							>
								<el-option
									v-for="emo in crm_category_type"
									:key="emo.id"
									:label="emo.label"
									:value="emo.value"
								/>
							</el-select>
						</el-form-item>
						<el-form-item label="数量：" prop="quantity">
							<el-input
								v-model.number="ruleForm.quantity"
								placeholder="请输入打样数量"
								maxlength="9"
							/>
						</el-form-item>
						<el-form-item
							label="设计服务费："
							prop="designServiceTaxInclusiveFee"
						>
							<div>
								<el-input
									style="width: 384px"
									v-model="
										ruleForm.designServiceTaxInclusiveFee
									"
									placeholder="请输入设计服务费（含税）"
									maxlength="15"
								/>
								<el-tooltip
									class="box-item"
									effect="dark"
									placement="top-end"
								>
									<template #content
										>与客户签订最终成交金额，包含设计、<br />打样费用（不包含物流费，含税）
									</template>
									<el-icon class="icons">
										<WarningFilled />
									</el-icon>
								</el-tooltip>
							</div>
						</el-form-item>
						<el-form-item
							label="税金："
							prop="designServiceTaxes"
						>
							<el-input
								v-model="ruleForm.designServiceTaxes"
								placeholder="请输入包含税金额度"
								maxlength="15"
							/>
						</el-form-item>
						<!-- <el-form-item label="开票类主体：" prop="invoiceEntity">
							<el-select
								v-model="ruleForm.invoiceEntity"
								placeholder="请选择开票主体"
								style="width: 423px"
								clearable
								filterable
								@change="changeInvoiceEntity"
							>
								<el-option
									v-for="e in crmInvoiceConfigList"
									:key="e.id"
									:label="e.invoiceEntity"
									:value="e.invoiceEntity"
								/>
							</el-select>
						</el-form-item> -->
						<el-form-item
							v-if="ruleForm.invoiceEntityList"
							label="开票类型："
							prop="invoiceType"
						>
							<div>
								<el-select
									v-model="ruleForm.invoiceType"
									placeholder="请选择开票类型"
									style="width: 384px"
									clearable
									filterable
								>
									<el-option
										v-for="e in ruleForm.invoiceEntityList"
										:key="e.id"
										:label="invoiceTypeName(e.invoiceType)"
										:value="e.invoiceType"
									/>
								</el-select>
								<el-tooltip
									class="box-item"
									effect="dark"
									placement="top-end"
								>
									<template #content
										>普票税点：3%<br />专票税点：13%
									</template>
									<el-icon class="icons">
										<WarningFilled />
									</el-icon>
								</el-tooltip>
							</div>
						</el-form-item>

						<el-form-item
							label="设计需求："
							prop="designRequirementRtf"
						>
							<el-input
								v-model="ruleForm.designRequirementRtf"
								placeholder="请输入设计需求"
								type="textarea"
								:rows="3"
								resize="none"
								maxlength="2000"
								style="margin-bottom: 6px"
							/>
							<file-upload
								v-model:modelValue="
									ruleForm.designRequirementAttachment
								"
								name="上传附件"
								:fileType="['png', 'jpg', 'jpeg']"
								:fileSize="2"
								:del="true"
								replace
								:isShowTip="false"
							>
							</file-upload>
						</el-form-item>
						<!-- <el-form-item
							label="业务员："
							prop="businessStaffName"
						>
							<span v-if="isRoles" class="customer">{{
								ruleForm.businessStaffName
							}}</span>
							<el-select
								v-else
								v-model="ruleForm.businessStaffId"
								placeholder="请选择业务员"
								style="width: 423px"
								clearable
								filterable
							>
								<el-option
									v-for="item in salesmanList"
									:key="item.userId"
									:label="item.nickName"
									:value="item.userId"
									@click="
										getSalesman(
											item.nickName,
											item.userId,
											1
										)
									"
								/>
							</el-select>
						</el-form-item> -->
					</el-form>
					<h3>
						收货地址<span style="font-size: 14px; color: #aaa"></span>
					</h3>
					<el-form
						ref="addressFormRef"
						:model="addressForm"
						:rules="rules"
						label-width="120px"
						class="demo-addressForm"
						size="default"
						status-icon
					>
						<el-form-item label="收货人：" prop="consigneeName">
							<el-input
								v-model="addressForm.consigneeName"
								placeholder="请输入收货人"
							/>
						</el-form-item>
						<el-form-item label="联系电话：" prop="consigneePhone">
							<el-input
								v-model="addressForm.consigneePhone"
								placeholder="请输入联系电话"
								maxlength="13"
							/>
						</el-form-item>
						<el-form-item
							label="收货地址："
							prop="consigneeAddress"
						>
							<el-input
								v-model="addressForm.consigneeAddress"
								placeholder="请输入收货地址"
							/>
						</el-form-item>
						<!-- <el-form-item
							label="业务员："
							prop="businessStaffName"
						>
							<span v-if="isRoles" class="customer">{{
								addressForm.businessStaffName
							}}</span>
							<el-select
								v-if="!isRoles"
								v-model="addressForm.businessStaffId"
								placeholder="请选择业务员"
								style="width: 423px"
								clearable
								filterable
							>
								<el-option
									v-for="item in saleList"
									:key="item.userId"
									:label="item.nickName"
									:value="item.userId"
									@click="
										getSalesman(
											item.nickName,
											item.userId,
											2
										)
									"
								/>
							</el-select>
						</el-form-item> -->
					</el-form>
				</div>
			<!-- </template> -->
			<!-- <template #footer> -->
				<!-- <div style="flex: auto">
					<el-button @click="cancelClick">取消</el-button>
					<el-button type="primary" @click="confirmClick()"
						>生成订单</el-button
					>
				</div> -->
			<!-- </template> -->
		<!-- </el-drawer> -->
	</div>
</template>

<script setup>
import {
	customerBaseInfo,
	crmProjectDesignOrderProc,
	crmBulkOrderProc,
	crmBulkDesignProdOrderProc,
	crmInvoiceConfig,
} from '@/api/orderManagement/subOrder'
import { validateForms, checkPhone, debounce } from '@/utils/form'
import { onMounted, onUnmounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()
// const { crm_category_type, crm_invoice_type, crm_payment_type, crm_saleman } =
// 	proxy.useDict(
// 		'crm_category_type',
// 		'crm_invoice_type',
// 		'crm_payment_type',
// 		'crm_saleman'
// 	)
// const props = defineProps({
// 	salesmanList: {
// 		type: Array,
// 		default: null,
// 	},
// 	isRoles: {
// 		type: Boolean,
// 		default: false,
// 	},
// })
// 接收父组件传来的方法
const emits = defineEmits(['crmOrderProcView'])
const ruleFormRef = ref()
const addressFormRef = ref()
let isTable = ref(true)
const orderType = reactive({
	orderTitle: '',
	type: null,
	addreeTxt: '',
	invoiceName: '',
	customerList: [],
	crmInvoiceConfigList: [], //查询开票主体信息
	saleList: [],
})
// 电话号码校验
const validatePhone = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入联系电话'))
	} else {
		// console.log('22222222---',value);
		if (checkPhone(value + '')) {
			callback()
		} else {
			callback(new Error('请输入有效的号码！'))
		}
	}
}
// 保留两位小数
const validateMoney = (rule, value, callback) => {
	let reg = /^[1-9]\d{0,11}(\.\d{1,2})?$/
	// let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
	if (value === '' || value === null) {
		callback(new Error('请输入包含税金额度'))
	} else {
		if (!reg.test(value)) {
			callback(new Error('整数最大12位，小数点最大2位'))
		} else {
			callback()
		}
	}
}
const validateMoney1 = (rule, value, callback) => {
	let reg1 = /^[1-9]\d{0,11}(\.\d{1,2})?$/
	// let reg1 = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
	if (value === '' || value === null) {
		callback(new Error('请输入设计服务费（含税）'))
	} else {
		if (!reg1.test(value)) {
			callback(new Error('整数最大12位，小数点最大2位'))
		} else {
			callback()
		}
	}
}
const validateNumber = (rule, value, callback) => {
	let reg2 = /^([1-9][0-9]*)$/ //正整数
	if (value === '' || value === null) {
		callback(new Error('请输入打样数量'))
	} else {
		if (!reg2.test(value)) {
			callback(new Error('请输入正整数'))
		} else {
			callback()
		}
	}
}
const ruleForm = reactive({
	customerId: '', //客户id
	customerName: '', //客户姓名
	designServiceContractUrl: '', //设计服务合同url
	designServiceContractNo: '', //设计服务合同编号
	designServiceContractName: '', //设计服务合同名称
	designFileUrl: '', //设计文件
	category: '', //品类
	quantity: '', //数量
	designServiceTaxInclusiveFee: '', //设计服务费(含税)
	designServiceTaxes: '', //设计服务税金
	invoiceType: '', //开票类型
	invoiceEntity: '', //开票主体
	invoiceEntityList: '', //选择开票主体后获取开票类型
	designRequirementRtf: '', //需求说明
	designRequirementAttachment: '', //需求附件
	businessStaffName: '', //业务员
	businessStaffId: '', //业务员id
	customerNumber: '', //客户编号
	settlementMethod: 1, //结算方式
	customerSettlementMethod: '', //根据选择客户获取动态结算方式
})
const addressForm = reactive({
	consigneeName: '', //收货人
	consigneePhone: '', //联系电话
	consigneeAddress: '', //收货地址
	businessStaffName: '', //业务员
	businessStaffId: '', //业务员id
})
const invoiceForm = reactive({
	invoiceCompanyName: '', //开票单位名称
	invoiceTaxpayerRegistrationNumber: '', //纳税人识别号
	invoiceEmail: '', //邮箱号
	invoiceRegisteredAddress: '', //注册地址
	invoicePhone: '', //联系电话
	invoiceDepositBank: '', //开户银行
	invoiceBankAccount: '', //开会账号
})
const rules = reactive({
	customerId: [
		{
			required: true,
			message: '请选择客户',
			trigger: 'blur',
		},
	],
	settlementMethod: [
		{
			required: true,
			message: '请选择结算方式',
			trigger: 'change',
		},
	],
	designServiceContractUrl: [
		{
			required: true,
			message: '请上传设计服务合同文件',
			trigger: 'change',
		},
	],
	designServiceContractNo: [
		{
			required: true,
			message: '请输入请输入合同编号',
			trigger: 'blur',
		},
	],
	designFileUrl: [
		{
			required: true,
			message: '请上传设计文件',
			trigger: 'change',
		},
	],
	category: [
		{
			required: true,
			message: '请选择品类',
			trigger: 'change',
		},
	],
	quantity: [
		{
			required: true,
			// message: '请输入打样数量',
			validator: validateNumber,
			trigger: 'blur',
		},
		{ type: 'number', message: '请输入数字' },
	],
	designServiceTaxInclusiveFee: [
		{
			required: true,
			// message: '请输入设计服务费（含税）',
			validator: validateMoney1,

			trigger: 'change',
		},
		// { type: 'number', message: '请输入数字' },
	],
	designServiceTaxes: [
		{
			required: true,
			// message: '请输入包含税金额度',
			validator: validateMoney,

			trigger: 'change',
		},
		// { type: 'number', message: '请输入数字' },
	],
	invoiceType: [
		{
			required: true,
			message: '请选择开票类型',
			trigger: 'change',
		},
	],
	invoiceEntity: [
		{
			required: true,
			message: '请选择开票主体',
			trigger: 'change',
		},
	],
	designRequirementRtf: [
		{
			required: true,
			message: '请输入设计需求',
			trigger: 'blur',
		},
	],
	businessStaffName: [
		{
			required: true,
			message: '请选择业务员',
			trigger: 'change',
		},
	],
	consigneeName: [
		{
			required: true,
			message: '请输入收货人',
			trigger: 'blur',
		},
	],
	consigneePhone: [
		{
			required: true,
			validator: validatePhone,
			trigger: 'blur',
		},
		// { type: 'number', message: '请输入数字' },
	],
	consigneeAddress: [
		{
			required: true,
			message: '请输入收货地址',
			trigger: 'blur',
		},
	],
})

// const { crmInvoiceConfigList } = toRefs(ruleForm)
const { crmInvoiceConfigList, customerList, saleList, invoiceName } =
	toRefs(orderType)
// 判断为业务员时，给参数赋值
// const isCustomer = () => {
// 	if (props.isRoles) {
// 		ruleForm.businessStaffId = saleList.value[0].userId
// 		ruleForm.businessStaffName = saleList.value[0].nickName
// 		addressForm.businessStaffId = saleList.value[0].userId
// 		addressForm.businessStaffName = saleList.value[0].nickName
// 	}
// }
// watch(isTable, (val) => {
	// saleList.value = props.salesmanList
	// isCustomer()
	// console.log('orderType.saleList----', orderType.saleList)
// })
const getSalesman = (nickName, userId, type) => {
	if (type == 1) {
		ruleForm.businessStaffId = userId
		ruleForm.businessStaffName = nickName
	} else {
		addressForm.businessStaffId = userId
		addressForm.businessStaffName = nickName
	}
}
// 分页查询客户基础信息的传参
const baseParms = reactive({
	size: 4,
	current: 1,
})
const isMounted = ref(false)
let timer = null
onMounted(() => {
	timer = setTimeout(() => {
		isMounted.value = true
	}, 3500)
})
onUnmounted(() => {
	clearTimeout(timer)
})
// 选择客户信息滚动底部时调用接口
// const load = debounce(() => {
// 	// console.log('load---')
// 	baseParms.current += 1
// 	customerBaseInfoFn()
// }, 300)

function load() {
	baseParms.current += 1
	customerBaseInfoFn()
}

// 分页查询客户基础信息
const customerBaseInfoFn = () => {
	customerBaseInfo(baseParms)
		.then((res) => {
			customerList.value.push(...res.data.records)
		})
		.catch((err) => {
			console.log(err)
		})
}
// customerBaseInfoFn()
// 查询开票主体
// const crmInvoiceConfigFn = () => {
// 	crmInvoiceConfig().then((res) => {
		// console.log('开票主体数据--', res)
		// crmInvoiceConfigList.value = res.data
// 	})
// }
// crmInvoiceConfigFn()
// 封装返回开票类型
const invoiceTypeName = (type) => {
  let invoiceName =crm_invoice_type.value.find((item)=>item.value==type)
  // console.log("22222222",crm_invoice_type.value);
	// console.log("invoiceName---",invoiceName);
	return invoiceName.label
}

const changeInvoiceEntity = (val) => {
  let invoiceItem=  crmInvoiceConfigList.value.find(item=>item.invoiceEntity==val);
  ruleForm.invoiceEntityList=invoiceItem.invoiceTypeList
	ruleForm.invoiceType =invoiceItem.invoiceTypeList[0].invoiceType
  // console.log('ruleForm.invoiceEntityList',ruleForm.invoiceEntityList);
  // console.log('ruleForm.invoiceType',ruleForm.invoiceType);
}
// 获取路径的名字
const fileName = (url) => {
	if (url) {
		let urlList = url.split('/')
		return urlList[urlList.length - 1].replace('filemanage', '')
	}
}

// 新增方案设计订单
const crmProjectDesignOrderProcFn = () => {
	ruleForm.designServiceContractName = fileName(
		ruleForm.designServiceContractUrl
	)
	// 删除对象不需要传值的属性customerList,designFileUrl
	delete ruleForm.designFileUrl
	delete ruleForm.invoiceEntityList
	delete ruleForm.customerSettlementMethod

	const objTarget = Object.assign({ ...addressForm }, ruleForm)
	// console.log("ruleForm---",ruleForm);
	// console.log("objTarget---",objTarget);
	crmProjectDesignOrderProc(objTarget)
		.then((res) => {
			if (res.code == 200) {
				// isTable.value = false
				emits('crmOrderProcView', 1)
				cancelClick()
        ElMessage({
					message: '新增方案设计订单成功',
					type: 'success',
				})
				// console.log('新增方案设计订单--', res)
			}
		})
		.catch((err) => {
			console.log(err)
		})
}
// 新增大货订单
const crmBulkOrderProcFn = () => {
	// 删除对象不需要传值的属性customerList,
	delete ruleForm.designServiceTaxInclusiveFee
	delete ruleForm.designRequirementRtf
	delete ruleForm.designRequirementAttachment
	delete ruleForm.designServiceContractUrl
	delete ruleForm.designServiceContractName
	delete ruleForm.invoiceEntityList
	delete ruleForm.designServiceContractNo
	delete ruleForm.customerSettlementMethod
	delete ruleForm.designServiceTaxes
	const objTarget = Object.assign({ ...ruleForm }, addressForm)
	// console.log('ruleForm---', ruleForm)
	// console.log('objTarget---', objTarget)
	crmBulkOrderProc(objTarget)
		.then((res) => {
			// console.log('crmBulkOrderProc-----', res)
			if (res.code == 200) {
				// isTable.value = false
				emits('crmOrderProcView', 1)
				cancelClick()
        ElMessage({
					message: '新增大货订单成功',
					type: 'success',
				})
			}
		})
		.catch((err) => {
			console.log(err)
		})
}
// 新增大货设计生产订单
const crmBulkDesignProdOrderProcFn = () => {
	ruleForm.designServiceContractName = fileName(
		ruleForm.designServiceContractUrl
	)
	// 删除对象不需要传值的属性
	delete ruleForm.designFileUrl
	delete ruleForm.crmInvoiceConfigList
	delete ruleForm.invoiceEntityList
	delete ruleForm.customerSettlementMethod
	const objTarget = Object.assign({ ...addressForm }, ruleForm)
	// console.log('ruleForm---', ruleForm)
	// console.log('objTarget---', objTarget)
	crmBulkDesignProdOrderProc(objTarget)
		.then((res) => {
			// console.log('crmBulkDesignProdOrderProc---', res)
			if (res.code == 200) {
				// isTable.value = false
				emits('crmOrderProcView', 1)
				cancelClick()
        ElMessage({
					message: '新增大货设计生产订单成功',
					type: 'success',
				})
			}
		})
		.catch((err) => {
			console.log(err)
		})
}

// 选择客户
const selectCustom = (customerNumber, customerName, moreSettlementMethod) => {
	ruleForm.customerNumber = customerNumber
	ruleForm.customerName = customerName
	ruleForm.customerSettlementMethod = moreSettlementMethod
	// console.log("ruleForm.customerSettlementMethod-",ruleForm.customerSettlementMethod);
}
// 取消按钮
const cancelClick = () => {
	isTable.value = false
	if (!ruleFormRef.value || !addressFormRef.value) return
	ruleFormRef.value.resetFields()
	addressFormRef.value.resetFields()
	addressForm.businessStaffId = ''
	ruleForm.businessStaffId = ''
	ruleForm.designRequirementAttachment = ''

	// console.log("addressFormRef--",addressForm);
}
// 生成订单按钮
const confirmClick = () => {
	// console.log('ruleForm.----', ruleForm)
	// crmBulkDesignProdOrderProcFn()

	submitForm()
}
const submitForm = debounce(async () => {
	let formRefs = [ruleFormRef.value, addressFormRef.value]
	validateForms(formRefs)
		.then(() => {
			// console.log(111113333338888);
			// if (orderType.type == 1) {
				crmProjectDesignOrderProcFn()
			// } else if (orderType.type == 2) {
			// 	crmBulkOrderProcFn()
			// } else {
			// 	crmBulkDesignProdOrderProcFn()
			// }
		})
		.catch((err) => {
			console.log(err)
		})
}, 100)

//暴露给父组件的方法控制显示与隐藏
// const dialogShow = (type, order) => {
// 	isTable.value = type
// 	if (order == 1) {
// 		orderType.orderTitle = '新建方案设计订单'
// 		orderType.type = 1
// 		orderType.addreeTxt = '（用于样品的收货地址）'
// 	} else if (order == 2) {
// 		orderType.orderTitle = '新建大货订单'
// 		orderType.type = 2
// 		orderType.addreeTxt = '（用于样品、大货的收货地址）'
// 	} else {
// 		orderType.orderTitle = '新建大货设计生产订单'
// 		orderType.type = 3
// 		orderType.addreeTxt = '（用于样品、大货的收货地址）'
// 	}
// }

// defineExpose({
// 	dialogShow,
// })
</script>

<style lang="scss" scoped>
.icons {
	color: #b3b3b3;
	font-size: 22px;
	vertical-align: middle;
	margin-left: 10px;
	cursor: pointer;
}

.lookDetail :deep(.el-form-item__label) {
	font-weight: 700;
}

.customer {
	color: #b3b3b3;
	user-select: none;
}
</style>

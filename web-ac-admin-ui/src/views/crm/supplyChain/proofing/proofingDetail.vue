<template>
	<div class="proofingContent">
		<el-card style="margin: 10px">
			<h4 style="font-size: 20px; position: relative">
				<span class="rightTxt">订单编号：</span>{{ orderDetail.orderBusinessKey }}
				<div class="suppContract">
					<!-- 合同签订 -->
					<span v-if="orderDetail.proofingStatus == '2'">已交付</span>
					<span v-else>{{ statusList[taskList.length - 1]?.sameLevelWholeTaskName }}</span>
					<!-- <img src="" alt="" /> -->
				</div>
			</h4>
			<p>
				<span class="rightTxt">打样工单号：</span>{{ orderDetail.businessKey }}
			</p>
			<ul class="userInfo">
				<li>
					<div>
						<span class="rightTxt">客户编号：</span>
						<el-link type="primary" :underline="false"
							@click="gotoCustomerDetail">{{ orderDetail.customerNumber }}</el-link>
						<!-- <span>{{ orderDetail.customerNumber }}</span> -->
					</div>
					<div>
						<span class="rightTxt">业务员：</span>
						<span>{{ orderDetail.businessStaffName }}</span>
					</div>
				</li>
				<li>
					<div>
						<span class="rightTxt">客户名称：</span>
						<span>{{ orderDetail.customerName }}</span>
					</div>
					<div>
						<span class="rightTxt">供应链专员：</span>
						<span>{{ orderDetail.supplyChainSpecialistName }}</span>
					</div>
				</li>
				<li>
					<div class="category">
						<span class="rightTxt">品类：</span>
						<div class="cateName">
							<div v-for="item in orderDetail.categoryList" :key="item.id">
								{{ item.goodsName }} （数量：{{
									item.proofingQuantity
								}}）
							</div>
						</div>
					</div>
					<div>
						<span class="rightTxt">领取时间：</span>
						<span>{{ parseDate(orderDetail.receiveTime) }}</span>
					</div>
				</li>
			</ul>
		</el-card>
		<el-card style="margin: 10px; min-height: 600px">
			<h4 class="progress">打样进度</h4>
			<ul class="progressBox">
				<li v-for="(item, index) in statusList" :key="item.id" :class="stateType == item.taskDefKey ? 'active' : ''"
					@click="handleStatus(item.taskDefKey,index)">
					<span class="step">{{ index + 1 }}</span>
					<span class="textBox"><span>{{ item.sameLevelWholeTaskName }}</span>
						<el-icon style="font-size: 20px">
							<DArrowRight />
						</el-icon></span>
				</li>
			</ul>
			<!-- 供应商合同签订 -->
			<div v-if="stateType == 'contract_with_supplier'">
				<!-- <div>
					<h3>成本预估</h3>
					<div style="display: flex;flex-wrap: wrap;">
						<div v-for="(item, index) in proofTask.contract_with_supplier?.taskCategoryList" :key="index" class="category-box">
							<div style="border-bottom: #333 1px solid;font-size: 16px;line-height: 30px;padding: 0 20px;">
								{{ item.goodsName }}
							</div>
							<div style="display: flex; padding: 10px">
								<div
									style="min-width: 80px;flex: 1;text-align: right;line-height: 40px;margin-right: 10px;">
									<span style="color: #ff0036">*</span>参数属性
								</div>
								<div style="width: 100%;">
									<el-input v-model="item.goodsAttr" :rows="8" type="textarea" placeholder="请输入参数属性"
										:disabled="proofTask.contract_with_supplier?.taskStatus != '1'" resize="none" />
								</div>
							</div>
							<div style="display: flex; padding: 10px">
								<div
									style="min-width: 80px;flex: 1;text-align: right;line-height: 40px;margin-right: 10px;">
									<span style="color: #ff0036">*</span>出货时间
								</div>
								<div style="width: 100%;">
									<el-radio-group v-model="item.cextends" class="ml-4"
										:disabled="proofTask.contract_with_supplier?.taskStatus != '1'">
										<el-radio label="1" size="large">长货期</el-radio>
										<el-radio label="2" size="large">短货期</el-radio>
									</el-radio-group>
								</div>
							</div>
							<div v-if="proofTask.contract_with_supplier?.taskStatus == '1'" class="form-tool-bar">
								<div style="min-width:160px;width:160px;">
									<el-button @click="clearPrice(index)">重置</el-button>
									<el-button type="primary" @click="getPrice(index)">提交</el-button>
								</div>
							</div>
							<div
								style="border-top: #333 1px solid;font-size: 16px;line-height: 30px;padding: 0 20px;display: flex;position: absolute;bottom: 0;width: 100%;">
								<div style="width: 50%;">成本预估：<span style="color: #ff0036;font-size: 20px;">{{
									item.estimateCostFee || 0
								}}</span></div>
							</div>
						</div>
					</div>
				</div> -->
				<h3>打样合同详情</h3>
				<el-form @submit.native.prevent class="step1" :model="proofTask.contract_with_supplier" label-width="160px" :disabled="proofTask.contract_with_supplier?.taskStatus != '1'"
					:rules="rules" ref="contractRef">
					<el-form-item label="状态：">
						<span>
							<DictTag v-if="proofTask.contract_with_supplier" :value="proofTask.contract_with_supplier.contractWithSupplierStatus"
								:options="crm_proof_suppliercontract_status" />
						</span>
					</el-form-item>
					<el-form-item label="选择打样供应商：" prop="proofingSupplierId">
						<el-select style="width: 400px" v-model="proofTask.contract_with_supplier.proofingSupplierId" class="m-2"
							placeholder="选择打样供应商" size="large">
							<el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName"
								:value="item.id">
								<span style="float: left">{{ item.supplierName }}</span>
								<span v-show="item.recommend"
									style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">推荐</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="上传供应商合同：" prop="supplierContractUrl">
						<crmFileUpload style="width: 400px" v-model:modelValue="proofTask.contract_with_supplier.supplierContractUrl"
							:disabled="proofTask.contract_with_supplier?.taskStatus != '1'" :showFile="proofTask.contract_with_supplier?.taskStatus != '1'"
							name="立即上传" :fileType="['pdf', 'doc']" :fileSize="50" :del="true" replace v-hasPermi="['@Contract(view:down)']"></crmFileUpload>
					</el-form-item>
					<el-form-item label="供应商预估打样费：" prop="supplierProofingTaxInclusiveFee">
						<el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99"
							:controls="false" style="width: 400px" placeholder="请输入供应商预估打样费（含税）"
							v-model="proofTask.contract_with_supplier.supplierProofingTaxInclusiveFee" />
					</el-form-item>
					<el-form-item label="税金：" prop="supplierProofingTaxes">
						<el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99"
							:controls="false" style="width: 400px" placeholder="请输入包含税金额度"
							v-model="proofTask.contract_with_supplier.supplierProofingTaxes" />
					</el-form-item>
					<el-form-item label="供应商成本核算表：" prop="supplierCostCalculateExcelUrl">
						<crmFileUpload style="width: 400px" v-model:modelValue="proofTask.contract_with_supplier.supplierCostCalculateExcelUrl"
							:disabled="proofTask.contract_with_supplier?.taskStatus != '1'" :showFile="proofTask.contract_with_supplier?.taskStatus != '1'" name="上传"
							:fileType="['xls']" :del="true" replace v-hasPermi="['@Contract(view:down)']"></crmFileUpload>
					</el-form-item>
					<el-form-item label="预计货期：" prop="expectedDeliveryDate">
						<el-date-picker style="width: 400px" v-model="proofTask.contract_with_supplier.expectedDeliveryDate" type="date"
							placeholder="请选择预计货期" />
					</el-form-item>
				</el-form>
				<h4 class="progress">收货地址：</h4>
				<p>
					<span class="addr"> 收货人：</span>
					{{ orderInfo.consigneeName }}
				</p>
				<p>
					<span class="addr">收货人联系电话：</span>
					{{ orderInfo.consigneePhone }}
				</p>
				<p>
					<span class="addr">收货地址：</span>
					{{ (orderInfo.province||'') + ' ' + (orderInfo.city||'') + ' ' + (orderInfo.district||'') + ' ' + (orderInfo.consigneeAddress||'-') }}
				</p>
				<div v-if="proofTask.contract_with_supplier?.taskStatus == '1'" class="form-tool-bar">
					<div style="min-width:160px;width:160px;">
						<!-- <el-button @click="">取消</el-button> -->
						<el-button type="primary" @click="signContract">提交审核</el-button>
					</div>
				</div>
			</div>
			<!-- 合同部门审核 -->
			<div v-show="stateType == 'contract_dept_audit'" class="audit">
				<p>
					<span class="addr">审核状态：</span>
					<span v-if="!proofTask.contract_dept_audit?.contractDeptAuditStatus">未审核</span>
					<DictTag style="display: inline-block;" :value="proofTask.contract_dept_audit?.contractDeptAuditStatus"
						:options="crm_contract_examine_status" />
				</p>
				<p>
					<span class="addr">审核人：</span>
					{{ proofTask.contract_dept_audit?.contractDeptAuditPersonName || '-' }}
				</p>
				<p>
					<span class="addr">审核时间：</span>
					{{ parseDate(proofTask.contract_dept_audit?.contractDeptAuditTime) }}
				</p>
			</div>
			<!-- 合同财务审核 -->
			<div v-show="stateType == 'contract_audit'" class="audit">
				<p>
					<span class="addr">审核状态：</span>
					<span v-if="!proofTask.contract_audit?.contractAuditStatus">未审核</span>
					<DictTag style="display: inline-block;" :value="proofTask.contract_audit?.contractAuditStatus"
						:options="crm_contract_examine_status" />
				</p>
				<p>
					<span class="addr">审核人：</span>
					{{ proofTask.contract_audit?.contractAuditPersonName || '-' }}
				</p>
				<p>
					<span class="addr">审核时间：</span>
					{{ parseDate(proofTask.contract_audit?.contractAuditTime) }}
				</p>
			</div>
			<!-- 样品发货 -->
			<div v-show="stateType == 'proofing_delivery'">
				<p class="status"><span class="addr">状态：</span>
					<DictTag style="display: inline-block;" :value="proofTask.proofing_delivery?.proofingDeliveryStatus"
						:options="crm_delive_status" />
				</p>
				<div>
					<h4 class="txtHead">打样发票</h4>
					<div class="status" style="display: flex">
						<span class="addr"><span style="color:#ff0036;margin-right:3px;">*</span>供应商发票：</span>
						<crmFileUpload v-if="proofTask.proofing_delivery?.supplierInvoiceUrl||proofTask.proofing_delivery?.taskStatus == '1'" style="width: 400px" v-model:modelValue="proofTask.proofing_delivery.supplierInvoiceUrl" name="上传"
							:disabled="proofTask.proofing_delivery?.taskStatus != '1'" :showFile="proofTask.proofing_delivery?.taskStatus != '1'"
							:fileType="['pdf', 'png', 'jpg', 'jpeg']" :fileSize="50" :del="true" replace>
						</crmFileUpload>
						<span v-if="!proofTask.proofing_delivery?.supplierInvoiceUrl&&proofTask.proofing_delivery?.taskStatus != '1'">-</span>
					</div>
				</div>
				<div>
					<h4 class="txtHead">物流费用</h4>
					<el-form @submit.native.prevent class="step1" :model="proofTask.proofing_delivery" label-width="160px"
						:disabled="proofTask.proofing_delivery?.taskStatus != '1'" :rules="rules" ref="deliveRef">
						<el-form-item label="物流单号：" prop="logisticsNumber">
							<el-input style="width: 400px" :maxlength="50" placeholder="请输入打样发货物流单号"
								v-model="proofTask.proofing_delivery.logisticsNumber" />
						</el-form-item>
						<el-form-item label="物流费：" prop="logisticsTaxInclusiveFee">
							<el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99"
								:controls="false" style="width: 400px" placeholder="请输入物流费用金额（含税）"
								v-model.number="proofTask.proofing_delivery.logisticsTaxInclusiveFee" />
						</el-form-item>
						<el-form-item label="税金：" prop="logisticsTaxes">
							<el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99"
								:controls="false" style="width: 400px" placeholder="请输入包含税金额度"
								v-model.number="proofTask.proofing_delivery.logisticsTaxes" />
						</el-form-item>
						<el-form-item label="物流单据：" prop="logisticsDocumentsUrl">
							<crmFileUpload v-if="proofTask.proofing_delivery?.logisticsDocumentsUrl||proofTask.proofing_delivery?.taskStatus == '1'" style="width: 400px" v-model:modelValue="proofTask.proofing_delivery.logisticsDocumentsUrl"
								name="立即上传" :disabled="proofTask.proofing_delivery?.taskStatus != '1'"
								:showFile="proofTask.proofing_delivery?.taskStatus != '1'" :fileType="['pdf', 'png', 'jpg', 'jpeg']"
								:fileSize="2" :del="true" replace v-hasPermi="['@Contract(view:down)']"></crmFileUpload>
								
							<span v-if="!proofTask.proofing_delivery?.logisticsDocumentsUrl&&proofTask.proofing_delivery?.taskStatus != '1'">-</span>
						</el-form-item>
					</el-form>
				</div>
				<!-- 取消和提交按钮 -->
				<div v-if="proofTask.proofing_delivery?.taskStatus == '1'" class="submit">
					<!-- <el-button>取消</el-button> -->
					<el-button type="primary" @click="delivery">提交审核</el-button>
				</div>
			</div>
			<!-- 客户确认 -->
			<div v-show="stateType == 'customer_confirms'">
				<p class="status"><span class="addr">*是否通过：</span>
					<DictTag style="display: inline-block;" :value="proofTask.customer_confirms?.customerConfirmStatus"
						:options="crm_customer_confirm_status" />
				</p>
				<p class="status">
					<span class="addr">客户确认凭证：</span>
					<ImagePreview v-if="proofTask.customer_confirms?.customerConfirmCertificateUrl"
						:src="proofTask.customer_confirms?.customerConfirmCertificateUrl" :width="300" :height="200"></ImagePreview>
					<span v-else>-</span>
				</p>
				<p class="status">
					<span class="addr">审核时间：</span>
					<span v-if="proofTask.customer_confirms?.customerConfirmTime">{{ parseDate(proofTask.customer_confirms?.customerConfirmTime) }}</span>
					<span v-else>-</span>
				</p>
			</div>
			<!-- 收货地址 -->
			<div class="address" v-show="stateType == 'proofing_delivery'">
				<h4 class="progress">收货地址：</h4>
				<p>
					<span class="addr"> 收货人：</span>
					{{ orderInfo.consigneeName }}
				</p>
				<p>
					<span class="addr">收货人联系电话：</span>
					{{ orderInfo.consigneePhone }}
				</p>
				<p>
					<span class="addr">收货地址：</span>
					{{ (orderInfo.province||'') + ' ' + (orderInfo.city||'') + ' ' + (orderInfo.district||'') + ' ' + (orderInfo.consigneeAddress||'-') }}
				</p>
			</div>
		</el-card>
		<!-- 驳回记录 -->
		<el-card style="margin: 10px" v-if="stateType == 'contract_with_supplier' && contractAuditList?.length">
			<h4 class="recordTxt">驳回记录：</h4>
			<div v-for="(item, i) in contractAuditList" :key="i" class="record">
				<p class="history-item">
					<span class="item-label">驳回类型：</span>
					<span class="item-content"><DictTag :value="item?.contractRejectType" :options="crm_ContractRejectionType" /></span>
				</p>
				<p class="history-item">
					<span class="item-label">驳回人：</span>
					<span class="item-content">{{ item.contractAuditPersonName||item.contractDeptAuditPersonName }}</span>
				</p>
				<p class="history-item">
					<span class="item-label" style="word-break:break-all;">驳回原因：</span>
					<span class="item-content" style="word-break:break-all;">{{ item.contractAuditRejectReason }}</span>
				</p>
				<p class="history-item">
					<span class="item-label">驳回时间：</span>
					<span class="item-content">{{ parseDate(item.contractAuditTime||item.contractDeptAuditTime) }}</span>
				</p>
				<p class="history-item">
					<span class="item-label">合同：</span>
					<span class="item-content">
						<span>{{ item.supplierContractName }}</span>
						<singDownFile :url="item.supplierContractUrl" />
					</span>
					
				</p>
			</div>
		</el-card>
		<el-card style="margin: 10px" v-if="stateType == 'proofing_delivery' && customerConfirmsList?.length">
			<h4 class="recordTxt">驳回记录：</h4>
			<div class="record" v-for="(item, i) in customerConfirmsList" :key="i">
				<p>
					<span class="rightTxt">*是否通过：</span>
					<DictTag style="display: inline-block;" :value="item.customerConfirmStatus"
						:options="crm_customer_confirm_status" />
				</p>
				<p>
					<span class="rightTxt">*备注原因：</span>
					<span style="word-break:break-all;">{{ item.customerConfirmRejectReason }}</span>
				</p>
				<p>
					<span class="rightTxt">审核时间：</span>
					{{ parseDate(item.dueTime) }}
				</p>
			</div>
		</el-card>
	</div>
</template>

<script setup>
import {
	processTaskConfig,
	proofingProcAll,
	proofingProcOrder
} from '@/api/orderManagement/proofing'
import { getProofingDetail, proofInvoke, contractWithSupplier, proofingDelivery, getOrderDetail, contractAudit, customerConfirms, getDesignOrderDetail, getBulkDesignOrderDetail } from "@/api/crm/supplyChain/proofing";
import { getSupplier } from "@/api/crm/supplier/index";
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue"
import { ElMessage } from 'element-plus';
import { getFileName, parseDate } from "@/utils/index"
import { parseTime } from "@/utils/ruoyi"
import { BASE_FILE_URL } from "@/store/global-constant";
import singDownFile from "@/components/singDownFile";
// import { useRouter, useRoute } from "vue-router";

const route = useRoute()
const router = useRouter()

// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const {
	crm_invoke_uuid,
	crm_proof_suppliercontract_status,
	crm_contract_examine_status,
	crm_delive_status,
	crm_customer_confirm_status,
	crm_ContractRejectionType
} = proxy.useDict(

	"crm_invoke_uuid",
	"crm_proof_suppliercontract_status",
	"crm_contract_examine_status",
	"crm_delive_status",
	"crm_customer_confirm_status",
	"crm_ContractRejectionType"
)
const data = reactive({
	statusList: [],
	orderDetail: {},
	orderInfo: {},
	proofTask:{
        contract_with_supplier:{
			proofingSupplierId: null,
			supplierContractUrl: null,
			supplierProofingTaxInclusiveFee: null,
			supplierProofingTaxes: null,
			supplierCostCalculateExcelUrl: null,
			expectedDeliveryDate: null,
		},
        contract_dept_audit:null,
        contract_audit:null,
        proofing_delivery:{
			supplierInvoiceUrl: null,
			logisticsDocumentsUrl: null,
			logisticsNumber: null,
			logisticsTaxInclusiveFee: 0,
			logisticsTaxes: 0,
			supplierInvoiceName: null,
		},
		customer_confirms:null
    }
})
const { statusList, orderDetail, orderInfo,proofTask } = toRefs(data)
const stateType = ref(0)
const taskList = ref([])
const supplierList = ref([])//供应商列表
const contractAuditList = ref([])//供应商合同签订驳回记录
const customerConfirmsList = ref([])//样品发货驳回记录
const maxIndex = ref(0)//可进入的流程
// 根据流程类型获得节点配置集合
const processTaskConfigFn = (procType) => {
	processTaskConfig(procType).then((res) => {
		// console.log('根据流程类型获得节点配置集合res----------', res)
		statusList.value = res.data
		statusList.value.splice(0, 1) //删除第一个节点
		// proofingProcAllFn(statusList.value[0].id)
		if (route.query.id) {
			getDetail(route.query.id)
		}
	})
}
processTaskConfigFn(route.query.procType)

// 通过订单id获得打样数据，包括打样流程，打样流程品类
const proofingProcOrderFn = (id, orderType) => {
	proofingProcOrder(id, { orderType }).then((res) => {
		// console.log('res=======', res)
	})
}
const handleStatus = (taskDefKey,index) => {
	if (index > maxIndex.value) {
		return
	}
	stateType.value = taskDefKey
}
const onSubmit = () => {
	console.log('submit!')
}

//获取详情
function getDetail(id) {
	getProofingDetail(id).then((res) => {
		if (res.code == 200) {
			let obj = res.data
			obj.taskList.splice(0, 1)
			if (!obj.taskList[0]?.taskCategoryList) {
				obj.taskList[0].taskCategoryList = obj.categoryList.map(item => {
					item.cextends = '1'
					item.invoke = false
					return item
				})
			}
			taskList.value = obj.taskList
			stateType.value = taskList.value[taskList.value.length-1].taskDefKey
			if (statusList.value?.length) {
				maxIndex.value = statusList.value.findIndex(item=>{return item.taskDefKey == taskList.value[taskList.value.length-1].taskDefKey})
			}
			orderDetail.value = obj
			getSupplierList()
			getOrderInfo(res.data.processParentId, res.data.parentProcType)
			setProcessList()
		}
	})
}
//把后端返回的list根据taskDefKey赋值给proofTask对应的流程(key)
function setProcessList(){
    statusList.value.map(item=>{
        let obj = taskList.value.find(data=>{return data.taskDefKey===item.taskDefKey})
        if (obj) {
            proofTask.value[item.taskDefKey] = obj
        }
    })
}
function getOrderInfo(id, type) {
	switch (type) {
		case 'project_design_order':
			getDesignOrderDetail(id).then(res => {
				if (res.code == 200) {
					orderInfo.value = res.data
				}
			})
			break;
		case 'bulk_order':
			getOrderDetail(id).then(res => {
				if (res.code == 200) {
					orderInfo.value = res.data
				}
			})
			break;
		case 'bulk_design_prod_order':
			getBulkDesignOrderDetail(id).then(res => {
				if (res.code == 200) {
					orderInfo.value = res.data
				}
			})
			break;

		default:
			break;
	}

}
const contractRef = ref(null)
//签订合同
function signContract() {
	// let flag = false
	// let invoke = false
	// taskList.value[0].taskCategoryList.map(item => {
	// 	if (!item.goodsAttr) {
	// 		flag = true
	// 	}
	// })
	// taskList.value[0].taskCategoryList.map(item => {
	// 	if (!item.invoke) {
	// 		invoke = true
	// 	}
	// })
	// if (flag) {
	// 	ElMessage.error('请输入成本预估参数属性')
	// 	return
	// }
	// if (invoke) {
	// 	ElMessage.error('有未计价的品类')
	// 	return
	// }
	if (!contractRef.value) return
	contractRef.value.validate((valid, fields) => {
		if (valid) {
			let data = {
				categoryList: taskList.value[0].taskCategoryList.map(item => {
					let obj = {
						// "cextends": item.cextends,
						// "estimateCostFee": item?.estimateCostFee || 0,
						// "estimateShippingFee": item?.estimateShippingFee || 0,
						// "goodsAttr": item.goodsAttr,
						"proofingCategoryId": item.id,
						// "ztQuoteRecordId": item?.ztQuoteRecordId,
						// "ztQuoteSucceed": item.ztQuoteSucceed || false
					}
					return obj
				}),
				"expectedDeliveryDate": parseTime(proofTask.value.contract_with_supplier.expectedDeliveryDate, '{y}-{m}-{d}'),//预计货期
				"id": taskList.value[0].id,//节点ID
				"proofingSupplierId": proofTask.value.contract_with_supplier.proofingSupplierId,//打样供应商id
				"proofingSupplierName": supplierList.value.find(item => { return item.id == proofTask.value.contract_with_supplier.proofingSupplierId })?.supplierName,//打样供应商姓名
				"supplierContractName": getFileName(proofTask.value.contract_with_supplier.supplierContractUrl),//供应商合同名称
				"supplierContractUrl": proofTask.value.contract_with_supplier.supplierContractUrl,//供应商合同url
				"supplierCostCalculateExcelName": getFileName(proofTask.value.contract_with_supplier.supplierCostCalculateExcelUrl),//供应商成本核算表名称
				"supplierCostCalculateExcelUrl": proofTask.value.contract_with_supplier.supplierCostCalculateExcelUrl,//供应商成本核算表url
				"supplierProofingTaxInclusiveFee": proofTask.value.contract_with_supplier.supplierProofingTaxInclusiveFee,//供应商打样费(含税)
				"supplierProofingTaxes": proofTask.value.contract_with_supplier.supplierProofingTaxes//供应商打样费税金
			}
			contractWithSupplier(data).then(res => {
				if (res.code == 200) {
					ElMessage.success('提交成功！')
					getDetail(route.query.id)
				}
			})
		} else {
			console.log('表单校验不通过');
			return false
		}
	})

}
const checklogisticsTaxInclusiveFee = (rule, value, callback) => {
	if (!value) {
		return callback(new Error('请输入物流费用金额（含税）'))
	}
	if (typeof (value) != 'number') {
		return callback(new Error('请输入数字'))
	}
	if (value < 0) {
		return callback(new Error('请输入大于0的数字'))
	}
	callback()
}
const rules = reactive({
	expectedDeliveryDate: [{ required: true, message: '请选择预计货期', trigger: 'change', }],
	proofingSupplierId: [{ required: true, message: '请选择打样供应商', trigger: 'change', }],
	supplierContractUrl: [{ required: true, message: '请上传供应商合同', trigger: 'change', }],
	supplierCostCalculateExcelUrl: [{ required: true, message: '请上传供应商成本核算表', trigger: 'change', }],
	supplierProofingTaxInclusiveFee: [{ required: true, message: '请输入供应商预估打样费(含税)', trigger: 'blur', }],
	supplierProofingTaxes: [{ required: true, message: '请输入供应商预估打样费税金', trigger: 'blur', }],
	logisticsNumber: [{ required: true, message: '请输入物流单号', trigger: 'blur', }],
	logisticsTaxInclusiveFee: [{ required: true, validator: checklogisticsTaxInclusiveFee, trigger: 'blur', }],
	logisticsTaxes: [{ required: true, message: '请输入税金', trigger: 'blur', }],
	logisticsDocumentsUrl: [{ required: true, message: '请上传物流单据', trigger: 'change', }],
})
//获取供应商列表
function getSupplierList() {
	let obj = {
		goodsIdList: orderDetail.value.categoryList
			.map((item) => {
				return item.goodsId
			})
			.filter((a) => a),
		cooperativeProc: '1',
		current: 1,
		size: 20,
	}
	getSupplier(obj).then((res) => {
		if (res.code == 200) {
			supplierList.value = res.data.records
		}
	})
}
//清除计价
function clearPrice(index) {
	taskList.value[0].taskCategoryList[index].estimateCostFee = 0
	taskList.value[0].taskCategoryList[index].estimateShippingFee = 0
	taskList.value[0].taskCategoryList[index].ztQuoteRecordId = ''
	taskList.value[0].taskCategoryList[index].ztQuoteSucceed = false
	taskList.value[0].taskCategoryList[index].goodsAttr = ''
	taskList.value[0].taskCategoryList[index].cextends = '1'
}
//计价
function getPrice(index) {
	let obj = taskList.value[0].taskCategoryList[index]
	if (!obj.goodsAttr) {
		return
	}
	proxy.$modal.loading('计价中，请稍候...')
	proofInvoke({
		"cextends": obj.cextends,
		"city": (orderDetail.value.province || '') + (orderDetail.value.city ? ' ' : '') + (orderDetail.value.city || ''),
		"fnumber": 1,
		"goodsAttr": obj.goodsAttr,
		"goodsId": obj.goodsId,
		// "categoryId":obj.goodsId,
		"number": obj.proofingQuantity,
		// "uuId": crm_invoke_uuid.value[0].value,
	}).then(res => {
		if (res.success&&res.data?.price) {
			taskList.value[0].taskCategoryList[index].estimateCostFee = res.data.price
			// taskList.value[0].taskCategoryList[index].estimateShippingFee = res.data.shipping_fee
			taskList.value[0].taskCategoryList[index].ztQuoteRecordId = 0
			taskList.value[0].taskCategoryList[index].ztQuoteSucceed = true
		} else {
			taskList.value[0].taskCategoryList[index].ztQuoteSucceed = false
		}

	}).catch(err => {
		taskList.value[0].taskCategoryList[index].ztQuoteSucceed = false
	}).finally(() => {
		taskList.value[0].taskCategoryList[index].invoke = true
		proxy.$modal.closeLoading()
	})
}
const deliveRef = ref(null)
//发货
function delivery() {
	if (!proofTask.value.proofing_delivery.supplierInvoiceUrl) {
		ElMessage.error('请上传供应商发票')
		return
	}
	if (!deliveRef.value) return
	deliveRef.value.validate((valid, fields) => {
		if (valid) {
			proofingDelivery({
				"id": taskList.value[3]?.id || orderDetail.value.taskList[4]?.id,//样品发货流程id
				"logisticsDocumentsName": getFileName(proofTask.value.proofing_delivery.logisticsDocumentsUrl),
				"logisticsDocumentsUrl": proofTask.value.proofing_delivery.logisticsDocumentsUrl,
				"logisticsNumber": proofTask.value.proofing_delivery.logisticsNumber,
				"logisticsTaxInclusiveFee": proofTask.value.proofing_delivery.logisticsTaxInclusiveFee,
				"logisticsTaxes": proofTask.value.proofing_delivery.logisticsTaxes,
				"supplierInvoiceName": getFileName(proofTask.value.proofing_delivery.supplierInvoiceUrl),
				"supplierInvoiceUrl": proofTask.value.proofing_delivery.supplierInvoiceUrl
			}).then(res => {
				if (res.code == 200) {
					ElMessage.success('提交成功！')
					getDetail(route.query.id)
				}
			})
		}
	})

}
function contractHistory() {
	contractAudit(route.query.id).then(res => {
		if (res.code == 200) {
			contractAuditList.value = res.data
		}
	})
}
contractHistory()
function customerConfirmsHistory() {
	customerConfirms(route.query.id).then(res => {
		if (res.code == 200) {
			customerConfirmsList.value = res.data
		}
	})
}
customerConfirmsHistory()
//跳转到客户详情
function gotoCustomerDetail() {
	const url = router.resolve({
		path: '/crm/customer/customerDetail',
		query: { id: orderDetail.value.customerId }
	})
	window.open(url.href, '_blank')
}
</script>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
	text-align: left;
}

.category-box {
	width: 370px;
	height: 440px;
	display: inline-block;
	margin: 12px;
	border: #333 1px solid;
	border-radius: 10px;
	position: relative;
}

.form-tool-bar {
	margin-top: 20px;
	width: 100%;
	display: flex;
	flex-direction: row-reverse;
	margin-bottom: 10px;
}

li {
	list-style: none;
}

.proofingContent {
	font-size: 14px;
}

.suppContract {
	width: 100px;
	height: 100px;
	color: #333;
	border: 1px dashed #333;
	border-radius: 50%;
	position: absolute;
	top: -22px;
	right: 0;
	text-align: center;
	padding-top: 28px;
	transform: rotate(45deg);
}

.rightTxt {
	display: inline-block;
	width: 100px;
	text-align: right;
	min-width: 100px;
}

.userInfo {
	display: flex;
	margin-top: 20px;
}

.userInfo li {
	flex: 1;
}

.userInfo li>div {
	margin-top: 20px;
}

.userInfo .category {
	display: flex;
}

.userInfo .category .cateName {
	display: flex;
	flex-direction: column;
}

.progress {
	font-size: 20px;
	margin-left: 20px;
}

.progressBox {
	/* height: 60px; */
	padding: 20px 0;
	display: flex;
	user-select: none;
	color: #aaa;
	font-size: 18px;
	border-bottom: 1px solid #ddd;
}

.progressBox li {
	flex: 1;
	cursor: pointer;
	display: flex;
}

.step {
	padding: 10px 16px;
	border: 1px solid #aaa;
	border-radius: 50%;
	margin-right: 10px;
}

.textBox {
	display: flex;
	align-items: center;
}

.progressBox .active {
	color: #007feb;
}

.progressBox .active .step {
	border: 1px solid #007feb;
}

.step1 {
	margin: 40px 100px;
}

.address {
	padding: 0 100px;
}

.address>h4 {
	margin: 0;
	font-size: 18px;
}

.address>p {
	margin: 20px 0;
}

.addr {
	width: 150px;
	display: inline-block;
	text-align: right;
}

.submit {
	text-align: right;
}

.recordTxt {
	margin: 0 100px;
	font-size: 18px;
}

.record {
	width: 540px;
	margin: 10px 120px;
	padding: 10px 30px;
	background: #fbfbfb;
	border: 1px solid #ddd;
	border-radius: 6px;
}

.record>p {
	margin: 20px 0;
}

.record .rightTxt {
	width: 100px;
	display: inline-block;
	text-align: right;
}

.download {
	color: #3fa2fe;
	margin-left: 10px;
	cursor: pointer;
}

.audit {
	margin: 20px 0;
}

.audit>p {
	margin: 20px 0;
}

.status {
	margin: 20px 100px;
}

.txtHead {
	font-size: 18px;
	margin: 10px 100px;
}
.history-item{
	display: flex;
	.item-label{
		width: 76px;
		text-align: right;
	}
	.item-content{
		flex: 1;
	}
}
</style>

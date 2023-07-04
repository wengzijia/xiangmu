<template>
	<div class="proofingContent">
		<el-card style="margin: 10px">
			<h4 style="font-size: 20px; position: relative">
				<span class="rightTxt">订单编号：</span>{{ orderDetail.orderBusinessKey }}
				<div class="suppContract">
					<!-- 合同签订 -->
					<span v-if="orderDetail.bulkStatus=='2'">已交付</span>
					<span v-else>{{ orderStatus }}</span>
					<!-- <img src="" alt="" /> -->
				</div>
			</h4>
			<p>
				<span class="rightTxt">大货工单号：</span>{{ orderDetail.bulkBusinessKey }}
			</p>
			<ul class="userInfo">
				<li>
					<div>
						<span class="rightTxt">客户编号：</span>
						<el-link type="primary" :underline="false" @click="gotoCustomerDetail">{{orderDetail.customerNumber}}</el-link>
						<!-- <span>{{ orderDetail.customerNumber }}</span> -->
					</div>
					<div>
						<span class="rightTxt">业务员：</span>
						<span>{{ orderDetail.businessStaffName }}</span>
					</div>
					<div>
						<span class="rightTxt">转大货生产时间：</span>
						<span>{{ orderDetail.startTime }}</span>
					</div>
				</li>
				<li>
					<div>
						<span class="rightTxt">客户名称：</span>
						<span>{{ orderDetail.customerName }}</span>
					</div>
					<div class="category">
						<span class="rightTxt">品类：</span>
						<div class="cateName">
							<div v-for="(item,i) in orderDetail.categoryList" :key="item.id">
								{{ item.goodsName }}  <span v-if="i<orderDetail.categoryList.length-1">/ </span>
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="category">
						<span class="rightTxt">大货供应商：</span>
						<div class="cateName">
							{{ orderDetail.bulkSupplierName ||'-'}}
						</div>
					</div>
					<div>
						<span class="rightTxt">大货生产数量：</span>
						<span v-for="(item,i) in orderDetail.categoryList" :key="item.id">
							{{ item.bulkProdQuantity }} <span v-if="i<orderDetail.categoryList.length-1">/ </span>
						</span>
					</div>
				</li>
			</ul>
		</el-card>
		<el-card style="margin: 10px; min-height: 600px">
			<h4 class="progress">大货生产进度</h4>
			<ul class="progressBox">
				<li v-for="(item, index) in statusList" :key="item.id" :class="stateType == index ? 'active' : ''"
					@click="handleStatus(index)">
					<span class="step">{{ index + 1 }}</span>
					<span class="textBox"><span>{{ item.label }}</span>
						<el-icon style="font-size: 20px">
							<DArrowRight />
						</el-icon></span>
				</li>
			</ul>
			<!-- 供应商合同签订 -->
			<div v-if="stateType == 0">
				<!-- <div>
					<h3>
						<span>成本预估</span>
					</h3>
					<div style="display: flex;flex-wrap: wrap;">
						<div v-for="(item, index) in orderDetail?.categoryList" :key="index" class="category-box">
							<div style="border-bottom: #333 1px solid;font-size: 16px;line-height: 30px;padding: 0 20px;">
								{{ item.goodsName }}
							</div>
							<div style="display: flex; padding: 10px">
								<div style="min-width: 80px;flex: 1;text-align: right;line-height: 40px;margin-right: 10px;">
									<span style="color: #ff0036">*</span>参数属性
								</div>
								<div style="width: 100%;">
									<el-input v-model="item.goodsAttr" :rows="8" type="textarea" placeholder="请输入参数属性"
										:disabled="task1[0]?.taskStatus != '1'" resize="none" />
								</div>
							</div>
							<div style="display: flex; padding: 10px">
								<div style="min-width: 80px;flex: 1;text-align: right;line-height: 40px;margin-right: 10px;">
									<span style="color: #ff0036">*</span>出货时间
								</div>
								<div style="width: 100%;">
									<el-radio-group v-model="item.cextends" class="ml-4"
										:disabled="task1[0]?.taskStatus != '1'">
										<el-radio label="1" size="large">长货期</el-radio>
										<el-radio label="2" size="large">短货期</el-radio>
									</el-radio-group>
								</div>
							</div>
							<div v-if="task1[0]?.taskStatus == '1'" class="form-tool-bar">
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
								<div style="width: 50%;">运费预估：<span>{{ item.estimateShippingFee || 0 }}</span></div>
							</div>
						</div>
					</div>
				</div> -->
				<h3>大货报价</h3>
				<el-form @submit.native.prevent class="step1" :model="startForm" label-width="180px" :disabled="task1[0]?.taskStatus != '1'"
					:rules="rules" ref="formRef">
					<el-form-item label="选择大货供应商：" prop="bulkSupplierId">
						<el-select style="width: 400px" v-model="startForm.bulkSupplierId" class="m-2"
							placeholder="选择大货供应商" size="large">
							<el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName"
								:value="item.id">
								<span style="float: left">{{ item.supplierName }}</span>
								<span v-show="item.recommend"
									style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">推荐</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="成本核算表：" prop="costCalculateExcelUrl">
						<crmFileUpload v-if="task1[0]?.taskStatus == '1'" style="width: 400px" v-model:modelValue="startForm.costCalculateExcelUrl"
							:disabled="task1[0]?.taskStatus != '1'" :showFile="task1[0]?.taskStatus != '1'"
							name="立即上传" :fileType="['xls', 'xlsx']" :fileSize="50" :del="true" replace></crmFileUpload>
						<span v-else>{{getFileName(startForm?.costCalculateExcelUrl||'-')}} <singDownFile :url="startForm.costCalculateExcelUrl"  v-hasPermi="['@contract(view:down)']"/></span>
					</el-form-item>
					<el-form-item label="大货生产费：" prop="bulkProdTaxInclusiveFee">
						<el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false"  style="width: 400px" placeholder="请输入大货生产费（含税）"
							v-model="startForm.bulkProdTaxInclusiveFee" />
					</el-form-item>
					<el-form-item label="大货生产费税金：" prop="bulkProdTaxes">
						<el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false"  style="width: 400px" placeholder="请输入包含税金额度"
							v-model="startForm.bulkProdTaxes" />
					</el-form-item>
					<el-form-item label="大货物流费(预估)：" prop="bulkLogisticsTaxInclusiveFee">
						<el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false"  style="width: 400px" placeholder="请输入预估大货物流费"
							v-model="startForm.bulkLogisticsTaxInclusiveFee" />
					</el-form-item>
					<el-form-item label="大货物流费税金(预估)：" prop="bulkLogisticsTaxes">
						<el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false"  style="width: 400px" placeholder="请输入包含税金额度"
							v-model="startForm.bulkLogisticsTaxes" />
					</el-form-item>
					<el-form-item label="大货生产货期：" prop="bulkProdDaysNumber">
						<el-input-number @keydown="clearInput" :min="0" :max="9999" :controls="false" style="width: 400px" v-model="startForm.bulkProdDaysNumber"
							placeholder="请输入大货生产所需天数" />
					</el-form-item>
				</el-form>
				<!-- <h3>收货地址</h3> -->
				<div v-if="task1[0]?.taskStatus == '1'" class="form-tool-bar">
					<div style="min-width:160px;width:160px;">
						<!-- <el-button @click="">取消</el-button> -->
						<el-button type="primary" @click="signContract">提交审核</el-button>
					</div>
				</div>
			</div>
			<!-- 合同审核 -->
			<div v-if="stateType == 1" class="audit">
				<contract :contract="task2" :orderDetail="orderDetail" :orderInfo="orderInfo"></contract>
			</div>
			<!-- 大货设计 -->
			<div v-if="stateType == 2">
				<design :design="task3" @getTask3="getTask3"></design>
			</div>
			<!-- 大货生产 -->
			<div v-if="stateType == 3">
				<el-form class="step1" @submit.native.prevent :model="deliveForm" label-width="180px" :disabled="task4?.taskList[0]?.taskStatus != '1'" :rules="rules "
					ref="deliveRef">
					<div>大货发票:</div>
					<el-form-item label="供应商发票：" prop="supplierInvoiceUrl">
						<template #label>
							<span style="color:red;margin-right: 10px;">*</span>
							<span>供应商发票：</span>
						</template>
						<crmFileUpload style="width: 400px" v-model:modelValue="deliveForm.supplierInvoiceUrl"
							:disabled="task4?.taskList[0]?.taskStatus != '1'" :showFile="task4?.taskList[0]?.taskStatus != '1'"
							name="立即上传" :fileType="['pdf', 'png', 'jpg']" :fileSize="50" :del="true" replace></crmFileUpload>
					</el-form-item>
					<div>大货物流:</div>
					<el-form-item label="物流单号：" prop="logisticsNumber">
						<el-input style="width: 400px" :maxlength="50" placeholder="请输入物流单号"
							v-model.trim="deliveForm.logisticsNumber" />
					</el-form-item>
					<el-form-item label="物流费：" prop="bulkLogisticsTaxInclusiveFee">
						<el-input-number v-if="editable1" @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false"  style="width: 400px" placeholder="请输入物流费"
							v-model="deliveForm.bulkLogisticsTaxInclusiveFee" />
						<span v-else>
							<span>{{ deliveForm.bulkLogisticsTaxInclusiveFee }}</span>
							<el-link v-if="task4?.taskList[0]?.taskStatus == '1'" :underline="false" type="primary" @click="editable1 = true" style="margin-left: 10px;">修改</el-link>
						</span>
					</el-form-item>
					<el-form-item label="物流税金：" prop="bulkLogisticsTaxes">
						<el-input-number v-if="editable2" @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false"  style="width: 400px" placeholder="请输入物流税金"
							v-model="deliveForm.bulkLogisticsTaxes" />
							<span v-else>
								<span>{{ deliveForm.bulkLogisticsTaxes }}</span>
								<el-link v-if="task4?.taskList[0]?.taskStatus == '1'" :underline="false" type="primary" @click="editable2 = true" style="margin-left: 10px;">修改</el-link>
							</span>
					</el-form-item>
					<el-form-item label="物流单据：" prop="logisticsDocumentsUrl">
						<template #label>
							<span style="color:red;margin-right: 10px;">*</span>
							<span>物流单据：</span>
						</template>
						<crmFileUpload v-if="task4?.taskList[0]?.taskStatus == '1'" style="width: 400px" v-model:modelValue="deliveForm.logisticsDocumentsUrl"
							:disabled="task4?.taskList[0]?.taskStatus != '1'" :showFile="task4?.taskList[0]?.taskStatus != '1'"
							name="立即上传" :fileType="['pdf', 'png', 'jpg']" :fileSize="50" :del="true" replace ></crmFileUpload>
							<span v-else>{{getFileName(deliveForm.logisticsDocumentsUrl||'-')}} <singDownFile :url="deliveForm.logisticsDocumentsUrl"  v-hasPermi="['@contract(view:down)']"/></span>
					</el-form-item>
				</el-form>
				<div v-if="task4.taskList[0]?.taskStatus == '1'" class="form-tool-bar">
					<div style="min-width:160px;width:160px;">
						<!-- <el-button @click="">取消</el-button> -->
						<el-button type="primary" :loading="commonLoading" @click="submit">提交审核</el-button>
					</div>
				</div>
			</div>
			<!-- 收货地址 -->
			<div class="address" v-show="stateType == 0||stateType == 3">
				<h4 class="progress">收货地址：</h4>
				<p>
					<span class="addr"> 收货人：</span>
					{{orderInfo.consigneeName||'-'}}
				</p>
				<p>
					<span class="addr">收货人联系电话：</span>
					{{orderInfo.consigneePhone||'-'}}
				</p>
				<p>
					<span class="addr">收货地址：</span>
					{{orderInfo.province+' '+orderInfo.city+' '+orderInfo.district+' '+orderInfo.consigneeAddress}}
				</p>
			</div>
		</el-card>
	</div>
</template>

<script setup>
import { invoke,  getOrderDetail,getBulkDesignOrderDetail } from "@/api/crm/supplyChain/proofing";
import { getBulkDetail,sourcingSupplier,getBulkContractDetail,getBulkQuoteDetail,getBulkProductionDetail,bulkDelivery } from "@/api/crm/supplyChain/production";
import { getSupplier } from "@/api/crm/supplier/index";
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { getFileName } from "@/utils/index"
import { parseTime } from "@/utils/ruoyi"
import { watch } from 'vue';
import contract from "./components/contract.vue"
import design from "./components/design.vue"
import {useAutoLoading} from "@/hooks/buttonLoading"
import singDownFile from "@/components/singDownFile";
const [commonLoading, fetch] = useAutoLoading();
// import { useRouter, useRoute } from "vue-router";

const route = useRoute()
const router = useRouter()

// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { 
	crm_bulk_order,
	crm_invoke_uuid,
} = proxy.useDict(
	"crm_bulk_order",
	"crm_invoke_uuid",
)
const data = reactive({
	statusList: [],
	startForm: {
		"bulkLogisticsTaxInclusiveFee":null,//大货物流费(预估)
		"bulkLogisticsTaxes": null,//大货物流费税金(预估)
		"bulkProdDaysNumber": null,//大货生产货期
		"bulkProdTaxInclusiveFee": null,//大货生产费
		"bulkProdTaxes": null,//大货生产费税金
		"bulkSupplierId": null,//大货供应商id
		"bulkSupplierName": null,//大货供应商姓名
		"costCalculateExcelName":null,//成本核算表名称
		"costCalculateExcelUrl": null,//成本核算表url
		logisticsNumber:null,//物流单号
		bulkLogisticsTaxInclusiveFee:null,//物流费
		bulkLogisticsTaxes:null,//物流税金
	},
	orderDetail: {},
	deliveForm: {
    	supplierInvoiceUrl:null,
		logisticsDocumentsUrl: null,
		logisticsNumber: null,
		logisticsTaxInclusiveFee: 0,
		logisticsTaxes: 0,
		supplierInvoiceName: null,
		bulkLogisticsTaxInclusiveFee:null,//物流费
		bulkLogisticsTaxes:null,//物流税金
  	},
	orderInfo:{},
	task1:{taskList:[]},//大货报价
	task2:{taskList:[]},//大货合同
	task3:{taskList:[]},//大货设计
	task4:{taskList:[]},//大货生产
})
const { statusList, startForm, orderDetail, deliveForm, orderInfo,task1,task2,task3,task4 } = toRefs(data)
const stateType = ref(0)
const supplierList = ref([])//供应商列表
const procLength = ref(1)
const orderStatus = ref('大货报价')
const editable1 = ref(false)//是否修改物流费
const editable2 = ref(false)//是否修改物流税金
if (route.query.id) {
	getDetail(route.query.id)
	// getBulkContractDetail(route.query.id)
}
// // 根据流程类型获得节点配置集合
// const processTaskConfigFn = (procType) => {
// 	processTaskConfig(procType).then((res) => {
// 		// console.log('根据流程类型获得节点配置集合res----------', res)
// 		statusList.value = res.data
// 		statusList.value.splice(0, 1) //删除第一个节点
// 		// proofingProcAllFn(statusList.value[0].id)
// 	})
// }
// processTaskConfigFn(route.query.procType)
watch(crm_bulk_order,(val)=>{
	let arr = JSON.parse(JSON.stringify(val))
	arr.splice(0, 1)
	arr.splice(-1, 1)
	statusList.value = arr
})
if (crm_bulk_order.value?.length) {
	let arr = JSON.parse(JSON.stringify(crm_bulk_order.value))
	arr.splice(0, 1)
	arr.splice(-1, 1)
	statusList.value = arr
}

const handleStatus = (index) => {
	if (!(index < procLength.value)) {
		return
	}
	stateType.value = index
}

//获取详情
function getDetail(id) {
	//获取报价信息
	getBulkDetail(id).then((res) => {
		if (res.code == 200) {
			let obj = res.data
			obj.taskList.splice(0, 1)
			if (obj.categoryList.length) {
				obj.categoryList = obj.categoryList.map(item=>{
					if (!item.cextends) {
						item.cextends = '1'
						item.invoke = false
					}
					return item
				})
			}
			
			task1.value = obj.taskList
			startForm.value = res.data
			orderDetail.value = obj
			if (res.data.parentProcType == 'bulk_design_prod_order') {
				getBulkDesignOrderDetail(res.data.processParentId).then(res=>{
					if (res.code==200) {
						orderInfo.value = res.data
					}
				})
			} else {
				getOrderDetail(res.data.processParentId).then(res=>{
					if (res.code==200) {
						orderInfo.value = res.data
					}
				})
			}
			
			getSupplierList()
			switch (res.data.bulkCurrentTaskDefKey) {
				case 'bulk_contract':
					getProc(1)
					stateType.value = 1
					procLength.value = 2
					orderStatus.value = '大货合同'
					break;
				case 'bulk_design':
					getProc(2)
					stateType.value = 2
					procLength.value = 3
					orderStatus.value = '大货设计'
					break;
				case 'bulk_production':
					getProc(3)
					stateType.value = 3
					procLength.value = 4
					orderStatus.value = '大货生产'
					break;
			
				default:
					break;
			}
		}
	})
}
//获取设计信息
function getTask3(){
	getBulkQuoteDetail(route.query.id).then(res=>{
		if (res.code==200&&res.data) {
			let obj = res.data
			let index = obj.taskList.findIndex(item=>{return item.taskDefKey=='bulk_file_design'})
			if (index>-1&&!obj.taskList[index]?.taskCategoryList?.length) {
				obj.taskList[index].taskCategoryList = orderDetail.value.categoryList
			}
			task3.value = obj
		}
	})
}
//获取大货生产信息
function getTask4(){
	getBulkProductionDetail(route.query.id).then(res=>{
		if (res.code==200&&res.data) {
			task4.value = res.data
			deliveForm.value = res.data
		}
	})	
}
function getProc(num){
	//获取合同信息
	getBulkContractDetail(route.query.id).then(res=>{
		if (res.code==200&&res.data) {
			task2.value = res.data
		}
	})
	if (num > 1) {
		//获取设计信息
		getTask3()
	}
	if (num>2) {
		getTask4()
	}
}
const formRef = ref(null)
//签订合同
function signContract() {
	// let flag = false
	// let invoke = false
	// orderDetail.value.categoryList.map(item => {
	// 	if (!item.goodsAttr) {
	// 		flag = true
	// 	}
	// })
	// orderDetail.value.categoryList.map(item => {
	// 	if (!item.invoke) {
	// 		invoke = true
	// 	}
	// })
	// if (invoke) {
	// 	ElMessage.error('有未计价的品类')
	// 	return
	// }
	// if (flag) {
	// 	ElMessage.error('请输入成本预估参数属性')
	// 	return
	// }
	if(!startForm.value.costCalculateExcelUrl){
		ElMessage.error('请上传成本核算表')
		return
	}
	if (!formRef.value) return
	formRef.value.validate((valid, fields) => {
		if (valid) {
			let data = {
				categoryList: orderDetail.value.categoryList.map(item => {
					let obj = {
						// "cextends": item.cextends,
						// "estimateCostFee": item?.estimateCostFee||0,
						// "estimateShippingFee": item?.estimateShippingFee||0,
						// "goodsAttr": item.goodsAttr,
						"id": item.id,
						// "ztQuoteRecordId": item?.ztQuoteRecordId,
						// "ztQuoteSucceed": item.ztQuoteSucceed || false
					}
					return obj
				}),
				"bulkLogisticsTaxInclusiveFee": startForm.value.bulkLogisticsTaxInclusiveFee,//大货物流费(预估)
				"bulkLogisticsTaxes": startForm.value.bulkLogisticsTaxes,//大货物流费税金(预估)
				"bulkProdDaysNumber": startForm.value.bulkProdDaysNumber,//大货生产货期
				"bulkProdTaxInclusiveFee": startForm.value.bulkProdTaxInclusiveFee,//大货生产费
				"bulkProdTaxes": startForm.value.bulkProdTaxes,//大货生产费税金
				"bulkSupplierId": startForm.value.bulkSupplierId,//大货供应商id
				"bulkSupplierName": supplierList.value.find(item => { return item.id == startForm.value.bulkSupplierId })?.supplierName,//大货供应商姓名
				"costCalculateExcelName": getFileName(startForm.value.costCalculateExcelUrl),//成本核算表名称
				"costCalculateExcelUrl": startForm.value.costCalculateExcelUrl,//成本核算表url
				"id": task1.value[0].id,//
			}
			sourcingSupplier(data).then(res => {
				if (res.code == 200) {
					ElMessage.success('提交成功！')
					getDetail(route.query.id)
				}
			})
		} else {
			console.log('表单校验不通过',fields);
			return false
		}
	})

}
// const checklogisticsTaxInclusiveFee = (rule, value, callback)=>{
//   if (!value) {
//     return callback(new Error('请输入物流费用金额（含税）'))
//   }
//   if (typeof(value)!='number') {
//     return callback(new Error('请输入数字'))
//   }
//   if (value<0) {
//     return callback(new Error('请输入大于0的数字'))
//   }
//   callback()
// }
const rules = reactive({
	bulkProdDaysNumber: [{ required: true, message: '请输入预计货期', trigger: 'blur', }],
	bulkSupplierId: [{ required: true, message: '请选择大货供应商', trigger: 'change', }],
	// supplierContractUrl: [{ required: true, message: '请上传供应商合同', trigger: 'change', }],
	costCalculateExcelUrl: [{ required: true, message: '请上传成本核算表', trigger: 'change', }],
	bulkProdTaxInclusiveFee: [{ required: true, message: '请输入大货生产费', trigger: 'blur', }],
	bulkProdTaxes: [{ required: true, message: '请输入大货生产费税金', trigger: 'blur', }],
	bulkLogisticsTaxInclusiveFee: [{ required: true, message: '请输入大货物流费(预估)', trigger: 'blur', }],
	bulkLogisticsTaxes: [{ required: true, message: '请输入大货物流费税金(预估)', trigger: 'blur', }],
	// logisticsTaxInclusiveFee: [{required: true,validator: checklogisticsTaxInclusiveFee, trigger: 'blur', }],
	logisticsNumber:[{required: true, message: '请输入物流单号', trigger: 'blur',}]
	// logisticsTaxes: [{ required: true, message: '请输入税金', trigger: 'blur', }],
	// logisticsDocumentsUrl: [{ required: true, message: '请上传物流单据', trigger: 'change', }],
})
//获取供应商列表
function getSupplierList() {
	let obj = {
		goodsIdList: orderDetail.value.categoryList
			.map((item) => {
				return item.goodsId
			})
			.filter((a) => a),
		cooperativeProc: '2',
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
	orderDetail.value.categoryList[index].estimateCostFee = 0
	orderDetail.value.categoryList[index].estimateShippingFee = 0
	orderDetail.value.categoryList[index].ztQuoteRecordId = ''
	orderDetail.value.categoryList[index].ztQuoteSucceed = false
	orderDetail.value.categoryList[index].goodsAttr = ''
	orderDetail.value.categoryList[index].cextends = '1'
}
//计价
function getPrice(index) {
	let obj = orderDetail.value.categoryList[index]
	if (!obj.goodsAttr) {
		return
	}
	proxy.$modal.loading('计价中，请稍候...')
	invoke({
		"cextends": obj.cextends,
		"city": (orderDetail.value.province || '') + (orderDetail.value.city ?' '+orderDetail.value.city : '') + (orderDetail.value.district ? ' '+orderDetail.value.district : ''),
		"fnumber": 1,
		"goodsAttr": obj.goodsAttr,
		"goodsId": obj.goodsId,
		// "categoryId":obj.goodsId,
		"number": obj.bulkProdQuantity,
		// "uuId": crm_invoke_uuid.value[0].value,
	}).then(res => {
		if (res.success) {
			orderDetail.value.categoryList[index].estimateCostFee = res.data.total_price
			orderDetail.value.categoryList[index].estimateShippingFee = res.data.shipping_fee
			orderDetail.value.categoryList[index].ztQuoteRecordId = res.data.paperVoList.find(item => { item.price == res.data.total_price }).id,
			orderDetail.value.categoryList[index].ztQuoteSucceed = true
		} else {
			orderDetail.value.categoryList[index].ztQuoteSucceed = false
		}

	}).catch(err => {
		orderDetail.value.categoryList[index].ztQuoteSucceed = false
	}).finally(() => {
		orderDetail.value.categoryList[index].invoke = true
		proxy.$modal.closeLoading()
	})
}
const deliveRef = ref(null)
function submit(){
	if (!deliveForm.value.supplierInvoiceUrl) {
		ElMessage.error('请上传供应商发票')
		return
	}
	if (!deliveForm.value.logisticsDocumentsUrl) {
		ElMessage.error('请上传物流单据')
		return 
	}
  	if (!deliveRef.value) return
	  ElMessageBox.confirm(
    '请再次核对发货人联系方式及地址正确。',
    '确认提交',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
		delivery()
    })
    .catch(()=>{})
}
//发货
function delivery() {
	deliveRef.value.validate((valid, fields)=>{
    if (valid) {
		fetch(bulkDelivery({
			"bulkLogisticsTaxInclusiveFee": deliveForm.value.bulkLogisticsTaxInclusiveFee,
			"bulkLogisticsTaxes": deliveForm.value.bulkLogisticsTaxes,
			"id": task4.value?.taskList[0].id,
			"logisticsDocumentsName": getFileName(deliveForm.value.logisticsDocumentsUrl),
			"logisticsDocumentsUrl": deliveForm.value.logisticsDocumentsUrl,
			"logisticsNumber": deliveForm.value.logisticsNumber,
			"supplierInvoiceName": getFileName(deliveForm.value.supplierInvoiceUrl),
			"supplierInvoiceUrl": deliveForm.value.supplierInvoiceUrl
      })).then(res => {
        if (res.code==200) {
          ElMessage.success('提交成功！')
          getDetail(route.query.id)
        }
      })
    }else{
		console.log('校验失败',fields);
	}
  })
	
}
//跳转到客户详情
function gotoCustomerDetail(){
	const url = router.resolve({
		path:'/crm/customer/customerDetail',
		query:{id:orderDetail.value.customerId}
	})
	window.open(url.href,'_blank')
}
</script>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner){
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
	padding-top: 34px;
	transform: rotate(45deg);
}

.rightTxt {
	display: inline-block;
	width: 120px;
	text-align: right;
	min-width: 120px;
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
</style>

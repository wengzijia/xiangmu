<template>
	<div>
		<el-card style="margin: 10px">
			<el-form
				inline
				:model="formData"
				class="demo-form-inline"
				label-width="120px"
				ref="queryRef"
			>
				<el-form-item label="客户信息:" prop="customerInfo">
					<el-input
						v-model="formData.customerInfo"
						placeholder="请输入客户编号/客户名称"
						clearable
						style="width: 252px"
					/>
				</el-form-item>
				
				<el-form-item label="归属部门:" prop="acDataSepDeptId">
					<el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
						<el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="业务员:" prop="businessStaffId">
					<el-select
						v-model="formData.businessStaffId"
						placeholder="所有业务员"
						clearable
						filterable
						style="width: 252px"
					>
						<el-option
							v-for="item in salesmanList"
							:key="item.userId"
							:label="item.nickName"
							:value="item.userId"
						/>
					</el-select>
				</el-form-item>

				<el-form-item label="订单信息:" prop="enabled">
					<el-input
						v-model="formData.orderInfo"
						placeholder="请输入订单编号/合同编号"
						clearable
						style="width: 252px"
					/>
				</el-form-item>

				<el-form-item label="审核人:" prop="enabled">
					<el-select
						v-model="formData.accountStatementAuditerId"
						placeholder="所有审核人"
						clearable
						filterable
						style="width: 252px"
					>
						<el-option
							v-for="item in assigneeList"
							:key="item.assigneeId"
							:label="item.assigneeName"
							:value="item.assigneeId"
						/>
					</el-select>
				</el-form-item>

				<el-form-item label="提交审核时间:">
					<!-- <el-date-picker
						v-model="datePicker"
						type="datetimerange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 252px"
					></el-date-picker> -->
					<dateTimePicker ref="dateRef" :dateType="'datetimerange'"
						v-model:startTime="formData.submitAuditTimeStart" v-model:endTime="formData.submitAuditTimeEnd">
					</dateTimePicker>
				</el-form-item>

				<el-form-item label="审核时间:">
					<!-- <el-date-picker
						v-model="datePicker2"
						type="datetimerange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 252px"
					></el-date-picker> -->
					<dateTimePicker ref="dateRef1" :dateType="'datetimerange'"
						v-model:startTime="formData.accountStatementAuditTimeStart" v-model:endTime="formData.accountStatementAuditTimeEnd" :isThreeMonths="false">
					</dateTimePicker>
				</el-form-item>

				<!-- <el-form-item label="结算方式:" prop="enabled">
					<el-select
						v-model="formData.settlementMethod"
						placeholder="所有方式"
						clearable
						filterable
						style="width: 252px"
					>
						<template v-if="risklist?.more_settlement_method">
							<el-option
								v-for="items in risklist.more_settlement_method"
								:key="items.id"
								:label="items.optionDesc"
								:value="items.id"
							/>
						</template>
					</el-select>
				</el-form-item> -->
			</el-form>
			<div class="btnBox">
				<el-button @click="resetQuery">重置</el-button>
				<el-button type="primary" @click="search">搜索</el-button>
			</div>
		</el-card>
		<el-card style="margin: 10px">
			<div class="tool-bar" style="float: right;">
				<el-button @click="exportExcel">导出</el-button>
			</div>
			<el-table
				:data="tableData"
				style="width: 100%"
				v-loading="loading"
				row-key="id"
			>
				<el-table-column
					prop="orderBusinessKey"
					label="订单编号"
					width="180"
				/>
				<el-table-column width="140">
					<template #header>
						合同编号
						<el-tooltip
							class="box-item"
							effect="dark"
							placement="bottom-end"
						>
							<template #content
								>方案设计订单展示设计合同，<br />其他订单展示大货合同
							</template>
							<el-icon class="icons">
								<WarningFilled />
							</el-icon>
						</el-tooltip>
					</template>
					<template #default="scope">
						{{scope.row.contractNo}}
					</template>
				</el-table-column>
				
				<el-table-column
					prop="customerName"
					label="客户名称"
					width="180"
				/>
				<el-table-column
					prop="orderTaxInclusiveTotalPrice"
					label="订单总价"
					width="180"
				>
					<template #default="scope">
						<div style="text-align: right;height: 100%;display: block;">
							{{
							showMoney(scope.row.orderTaxInclusiveTotalPrice
							? scope.row.orderTaxInclusiveTotalPrice
							: '-')
							}}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="订单类型" width="140">
					<template #default="scope">
						<DictTag
							style="display: inline-block"
							:value="scope.row.parentProcType"
							:options="crm_order_type"
						/>
					</template>
				</el-table-column>

				<!-- <el-table-column label="结算方式" width="140">
					<template #default="scope">
						<settlementMethod
							v-if="risklist?.more_settlement_method"
							:methodId="scope.row.settlementMethod"
							:methodList="risklist.more_settlement_method"
						/>
					</template>
				</el-table-column> -->

				<el-table-column label="业务员" width="140">
					<template #default="scope">
						<div>{{ scope.row.businessStaffName || '-' }}</div>
					</template>
				</el-table-column>

				<el-table-column label="审核状态" width="140">
					<template #default="scope">
						<DictTag
							style="display: inline-block"
							:value="scope.row.accountStatementAuditStatus"
							:options="basic_approval_status"
						/>
					</template>
				</el-table-column>

				<el-table-column label="审核人" width="140">
					<template #default="scope">
						<div>
							{{ scope.row.accountStatementAuditerName || '-' }}
						</div>
					</template>
				</el-table-column>

				<el-table-column label="提交审核时间" width="200">
					<template #default="scope">
						<div>
							{{
								formatDate(
									scope.row.submitGeneralAccountStatementTime
								) || '-'
							}}
						</div>
					</template>
				</el-table-column>

				<el-table-column label="审核时间" width="200">
					<template #default="scope">
						<div>
							{{
								formatDate(
									scope.row.accountStatementAuditTime
								) || '-'
							}}
						</div>
					</template>
				</el-table-column>

				<el-table-column label="操作" fixed="right">
					<template #default="scope">
						<!-- <el-link :underline="false" type="primary" @click="editfn(1,scope.row.processParentId,scope.row.procId)">审核</el-link> -->
						<el-link
							v-if="scope.row.accountStatementAuditStatus == 1"
							:underline="false"
							type="primary"
							@click="editfn('1', scope.row)"
							>审核</el-link
						>
						<el-link
							v-else
							:underline="false"
							type="info"
							@click="editfn('2', scope.row)"
							>查看</el-link
						>
					</template>
				</el-table-column>
			</el-table>
			<div class="pages" style="position: relative">
				<pagination
					background
					layout="total, sizes, prev, pager, next, jumper"
					v-model:page="formData.current"
					:total="total"
					v-model:limit="formData.size"
					:pageSizes="[20, 30, 50, 100]"
				/>
			</div>
		</el-card>
		<el-drawer
			v-model="drawer"
			:title="istype == '1' ? '审核' : '审核结果'"
			direction="rtl"
			:before-close="handleClose"
			size="600px"
		>
			<template #default>
				<div>
					<drawerbox
						ref="newo"
						:istype="istype"
						:listdata="listdata"
						:detaildata="detaildata"
						:risklist="risklist"
						:prodata="prodata"
						:bgoodsdata="bgoodsdata"
						@cancelClick="cancelClick"
					></drawerbox>
				</div>
			</template>
			<template #footer>
				<div style="flex: auto">
					<el-button @click="drawer = false">{{istype=='1'?'取消':'关闭'}}</el-button>
					<el-button
						type="primary"
						@click="confirmClick(true)"
						v-if="istype == '1'"
						>确定</el-button
					>
				</div>
			</template>
		</el-drawer>
	</div>
</template>

<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import { reactive, toRefs } from 'vue'
import drawerbox from './components/drawer.vue'
import { formatDate, formatDates,LastThreeMonths } from '@/utils'
import useUserStore from '@/store/modules/user'
import {
	GetAccountStatementAudit,
	assigneeType,
	exportAccountStatementAuditList
} from '@/api/crm/finance/contract'
import {
	gradingCalculateConfig,
} from '@/api/orderManagement/customer/index'
import { getcrmprojectdesignorderprocid } from '@/api/crm/order/contract'
import { bulkAllData } from '@/api/orderManagement/costComposition'
import {
	bulkDesignProdOrderProc,
	bulkOrderProc,
} from '@/api/orderManagement/subOrder'
import { ElMessageBox,ElMessage } from 'element-plus'
import { proofingProcOrder } from '@/api/orderManagement/proofing'
import { parseTime } from '@/utils/ruoyi'
import useCrmOption from "@/store/modules/crmSelectOption"
const option = useCrmOption()
const deptList = computed(()=> option.deptList)
const salesmanList = computed(()=>option.salesmanList)
const deptDisabled = ref(false)
const { proxy } = getCurrentInstance()
const { crm_order_type, crm_payment_type, basic_approval_status,crm_acColumn } =
proxy.useDict('crm_order_type', 'crm_payment_type', 'basic_approval_status','crm_acColumn')
const roles = computed(() => useUserStore().roles) //获取角色
const formData = ref({
	current: 1,
	size: 20,
	customerInfo: null, //客户信息
	settlementMethod: null, //结算方式
	accountStatementAuditerId: null, //对账单审核人id
	businessStaffId: null, //业务员id
	submitAuditTimeStart: formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90), //申请时间
	submitAuditTimeEnd: formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000), //申请结束时间
	accountStatementAuditTimeStart: formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90), //对账单审核时间开始时间
	accountStatementAuditTimeEnd: formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000), //对账单审核时间结束时间
	acColumn:null
})
const acDataSepDeptId = ref('')
option.setDeptId(formData.value.acDataSepDeptId);
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
}).finally(()=>{
	getList()
})
watch(crm_acColumn,(val)=>{
	formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
const drawer = ref(false)
const istype = ref('1')
const isoperation = ref(1)
const processParentId = ref('')
const detaildata = ref(null)
const rejdata = ref(null)
const listdata = ref(null)
const prodata = ref(null)
const bgoodsdata = ref(null)
const risklist = ref(null)
const datePicker = ref(LastThreeMonths())
const datePicker2 = ref(LastThreeMonths())
const isSearch = ref(false);
const dateRef = ref(null)
const dateRef1 = ref(null)
const tableData = ref([
	{
		applyTime: '',
		businessStaffId: '1',
		businessStaffName: '222',
		cancelTime: '',
		cancelerId: '',
		cancelerName: '',
		createBy: '',
		createTime: '',
		customerId: '',
		customerName: '客户',
		customerNumber: '',
		deleted: true,
		id: '',
		invoiceAmount: 10,
		invoiceBankAccount: '',
		invoiceCompanyName: '',
		invoiceConsigneeAddress: '',
		invoiceConsigneeName: '',
		invoiceConsigneePhone: '',
		invoiceDepositBank: '',
		invoiceEmail: '',
		invoiceEntity: '',
		invoiceEntityId: 0,
		invoiceName: '',
		invoicePhone: '',
		invoiceRegisteredAddress: '',
		invoiceStatus: '',
		invoiceTime: '2022-12-12',
		invoiceType: '1',
		invoiceUrl: '',
		invoicerId: '',
		invoicerName: '',
		orderNumber: '',
		taxpayerRegistrationNumber: '',
		updateBy: '',
		updateTime: '',
	},
])
const editdata = ref(null)
const loading = ref(false)
const total = ref(0)
const drawerTitle = ref('新增客户')
const newo = ref(null)
const salesValue = ref('')
// const salesmanList = ref([]) //业务员
const assigneeList = ref([]) //对账单审核人
const form = reactive({
	name: '',
	region: '',
	date1: '',
	date2: '',
	delivery: false,
	type: [],
	resource: '',
	desc: '',
})
let dranum = ref(1)
const onSubmit = () => {
	console.log('submit!')
}
// 对账单审核人
const assigneeTypeFn = () => {
	assigneeType(3).then((res) => {
		// console.log('对账单审核人', res)
		if (res.code == 200) {
			assigneeList.value = res.data
		}
	})
}
assigneeTypeFn()
function changeDept(val){
  option.setDeptId(val)
  formData.value.businessStaffId = null
}
/** 重置按钮操作 */
function resetQuery() {
	// proxy.resetForm("formRef");
  dateRef.value.initTime(1)
  dateRef1.value.initTime(1)
	formData.value = {
		current: 1,
		size: 20,
		customerInfo: null, //客户信息
		settlementMethod: null, //结算方式
		accountStatementAuditerId: null, //对账单审核人id
		businessStaffId: null, //业务员id
		submitAuditTimeStart: formatDate(dateRef.value.start), //申请时间
		submitAuditTimeEnd: formatDate(dateRef.value.end), //申请结束时间
		accountStatementAuditTimeStart: formatDate(dateRef1.value.start), //对账单审核时间开始时间
		accountStatementAuditTimeEnd: formatDate(dateRef1.value.end), //对账单审核时间结束时间
		acColumn : crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value,
		acDataSepDeptId:acDataSepDeptId.value
	}
	// datePicker.value = LastThreeMonths()
	// datePicker2.value = LastThreeMonths()
	// search();
}
//搜索
function search() {
	formData.value.current = 1 //页码
	// formData.value.size = 20 //分页大小
	// if (datePicker.value?.length > 0) {
	// 	formData.value.submitAuditTimeStart =
	// 		formatDate(datePicker.value[0])
	// 	formData.value.submitAuditTimeEnd =
	// 		formatDate(datePicker.value[1])
	// } else {
	// 	formData.value.submitAuditTimeStart =
	// 		formData.value.submitAuditTimeEnd = null
	// }
	// if (datePicker2.value?.length > 0) {
	// 	formData.value.accountStatementAuditTimeStart =
	// 		formatDate(datePicker2.value[0])
	// 	formData.value.accountStatementAuditTimeEnd =
	// 		formatDate(datePicker2.value[1])
	// } else {
	// 	formData.value.accountStatementAuditTimeStart =
	// 		formData.value.accountStatementAuditTimeEnd = null
	// }
  isSearch.value = true
	getList()
}

onMounted(() => {
  /**
   * 监听对象数据的变化
   */
  watch(
    [
      () => formData.value.current,
      () => formData.value.size,
      () => formData.value.acColumn,
    ],
    (val, oval) => {
      // console.log('id555555555监听对象数据的变化', val, 'ovaloval----', oval)
      // 判断没有点击筛选按钮时，之前填写的参数初始化
      if (!isSearch.value) {
        dateRef.value.initTime(1)
  		dateRef1.value.initTime(1)
        formData.value.customerInfo= null //客户信息
        formData.value.settlementMethod= null //结算方式
        formData.value.accountStatementAuditerId= null //对账单审核人id
        formData.value.businessStaffId= null //业务员id
        formData.value.submitAuditTimeStart= formatDate(dateRef.value.start) //申请时间
        formData.value.submitAuditTimeEnd= formatDate(dateRef.value.end) //申请结束时间
		formData.accountStatementAuditTimeStart = formatDate(dateRef1.value.start) //对账单审核时间开始时间
		formData.accountStatementAuditTimeEnd = formatDate(dateRef1.value.end) //对账单审核时间结束时间
      }
    //   if (formData.value.acColumn) {
        getList();
    //   }
    },
    {
    //   immediate: true,
      deep: true, //开启深度监听,能够侦听到对象属性值的变化
    }
  )

})

function exportExcel(){
	if(!tableData.value?.length){
		ElMessage.error('暂无数据导出')
		return
	}
	exportAccountStatementAuditList(formData.value,`对账单审核${parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`)
}

function getList() {
	GetAccountStatementAudit(formData.value)
		.then((res) => {
			tableData.value = res.data.records
			total.value = res.data.total
			// console.log('GET分页查询订单', data.tabList)
		})
		.catch((err) => {
			console.log('报错-----', err)
		})
}
// const handleSelectionChange = (val) => {
//   console.log(val);
// }

//状态修改
function handleStatusChange(row) {
	// let text = row.status ? "启用" : "停用";
	// proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"客户吗?').then(function () {
	//   return changeStatus(row.userId, row.status);
	// }).then(() => {
	//   proxy.$modal.msgSuccess(text + "成功");
	// }).catch(function () {
	//   row.status = row.status ? false : true;
	// });
}
gradingCalculateConfig().then((res) => {
	risklist.value = res.data
})
const handleClose = (done) => {
	ElMessageBox.confirm('确定关闭?')
		.then(() => {
			done()
		})
		.catch(() => {
			// catch error
		})
}
const draclick = (num) => {
	// newo.value.demofn()
	// setTimeout(() => {
	//   if(num==1){
	//     newo.value.initdata()
	//   }else{
	//     newo.value.setdata()
	//   }
	// }, 100);

	drawer.value = true
}
const editfn = (is, e) => {

	istype.value = is
	listdata.value = e
	
	// drawer.value = true
	if (
		e.parentProcType == 'project_design_order' ||
		e.parentProcType == 'bulk_design_prod_order'
	) {
		if (e.parentProcType == 'project_design_order') {
			getcrmprojectdesignorderprocid(e.processParentId)
				.then((res) => {
					if (res.code === 200) {
						drawer.value = true
						detaildata.value = res.data
					}
				})
				.catch((err) => {
					detaildata.value = null
				})
		}
		if (e.parentProcType == 'bulk_design_prod_order') {
			bulkDesignProdOrderProc(e.processParentId).then((res) => {
				if (res.code === 200) {
					drawer.value = true
					detaildata.value = res.data
				}
			})
			bulkAllData(e.processParentId, {
				orderType: e.parentProcType,
			}).then((res) => {
				bgoodsdata.value = res.data
			})
		}
	} else if (e.parentProcType == 'bulk_order') {
		bulkOrderProc(e.processParentId).then((res) => {
			drawer.value = true
			detaildata.value = res.data
		})
		bulkAllData(e.processParentId, { orderType: e.parentProcType }).then((res) => {
			bgoodsdata.value = res.data
		})
	}
	//打样流程
	proofingProcOrder(e.processParentId, { orderType: e.parentProcType }).then(
		(res) => {
			prodata.value = res.data
		}
	)
}
function cancelClick() {
	getList()
	drawer.value = false
}
function confirmClick(flag) {
	newo.value.confirmClick()
}
// const allSalesmanModule = () => {
// 	roleKey('crmCustomerBusinessStaff')
// 		.then((res) => {
// 			salesmanList.value = res.data
// 		})
// 		.catch((err) => {
// 			// console.log('报错-----', err)
// 			ElMessage.error(err.msg)
// 		})
// }
// allSalesmanModule()
</script>

<style lang="scss" scoped>
.btnBox {
	text-align: right;
	padding-right: 38px;
}
.tool-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}
</style>

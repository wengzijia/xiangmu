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
				<el-form-item label="申请人:" prop="businessStaffId">
					<el-select
						:disabled="isSaleman"
						v-model="formData.businessStaffId"
						placeholder="所有申请人"
						clearable
						filterable
						style="width: 252px"
					>
						<el-option
							v-for="item in AList"
							:key="item.assigneeId"
							:label="item.assigneeName"
							:value="item.assigneeId"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="开票人:"
					prop="enabled"
					v-if="cpagestatus != 1"
				>
					<el-select
						v-model="formData.invoicerId"
						placeholder="所有开票人"
						clearable
						filterable
						style="width: 252px"
					>
						<!-- <el-option v-for="item in receiver" :key="item.userId" :label="item.nickName" :value="item.userId" /> -->
						<el-option
							v-for="item in DList"
							:key="item.assigneeId"
							:label="item.assigneeName"
							:value="item.assigneeId"
						/>
					</el-select>
				</el-form-item>

				<!-- <el-form-item label="开票主体:" prop="businessStaffId">
					<el-select
						:disabled="isSaleman"
						v-model="formData.businessStaffId"
						placeholder="所有开票主体"
						clearable
						filterable
						style="width: 252px"
					>
						<el-option
							v-for="item in AList"
							:key="item.assigneeId"
							:label="item.assigneeName"
							:value="item.assigneeId"
						/>
					</el-select>
				</el-form-item>

				<el-form-item label="开票类型:" prop="businessStaffId">
					<el-select
						:disabled="isSaleman"
						v-model="formData.businessStaffId"
						placeholder="所有开票类型"
						clearable
						filterable
						style="width: 252px"
					>
						<el-option
							v-for="item in AList"
							:key="item.assigneeId"
							:label="item.assigneeName"
							:value="item.assigneeId"
						/>
					</el-select>
				</el-form-item> -->

	

				<!-- v-if="crmInvoiceConfigList.length > 0" -->
				<el-form-item label="开票主体：" prop="invoiceEntity">
					<el-select v-model="formData.invoiceEntityId" @change="changeInvoiceType" placeholder="请选择开票主体 (与合同主体一致)" clearable
						filterable style="width: 252px">
						<el-option v-for="e in crmInvoiceConfigList" :key="e.id" :label="e.invoiceEntity" :value="e.id"/>

					</el-select>
				</el-form-item>

				<el-form-item label="开票类型：" prop="invoiceType" v-if="formData?.invoiceEntityId&&invotypelist?.length">
					<el-select
						v-model="formData.invoiceType"
						placeholder="所有开票类型"
						clearable
						filterable
						style="width: 252px"
					>
						<el-option
							v-for="item in invotypelist"
							:key="item.id" :label="invoiceTypeName(item.invoiceType)"
                    		:value="item.invoiceType"
						/>
					</el-select>
				</el-form-item>

				<el-form-item label="申请时间" v-show="cpagestatus">
					<!-- <el-date-picker
						v-model="datePicker"
						type="datetimerange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 252px"
					></el-date-picker> -->
          <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.applyTimeStart"
            v-model:endTime="formData.applyTimeEnd"></dateTimePicker>
				</el-form-item>

				<el-form-item label="开票时间:" v-show="cpagestatus != 1">
					<!-- <el-date-picker
						v-model="datePicker2"
						type="datetimerange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 252px"
					></el-date-picker> -->
          <dateTimePicker ref="dateRef1" :dateType="'datetimerange'" v-model:startTime="formData.invoiceTimeStart"
            v-model:endTime="formData.invoiceTimeEnd"></dateTimePicker>
				</el-form-item>

				<el-form-item label="取消时间:" v-show="cpagestatus == 3">
					<!-- <el-date-picker
						v-model="datePicker3"
						type="datetimerange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 252px"
					></el-date-picker> -->
          <dateTimePicker ref="dateRef2" :dateType="'datetimerange'" v-model:startTime="formData.cancelTimeStart"
            v-model:endTime="formData.cancelTimeEnd"></dateTimePicker>
				</el-form-item>
			</el-form>
			<div class="btnBox">
				<el-button @click="resetQuery('1')">重置</el-button>
				<el-button type="primary" @click="search">搜索</el-button>
			</div>
		</el-card>
		<el-card style="margin: 10px">
			<div class="tool-bar">
				<el-tabs
					v-model="cpagestatus"
					class="demo-tabs"
					@tab-click="handleClick"
					style="width: 100%"
				>
					<!-- <el-tab-pane :label="item.label" :name="item.value" v-for="item in crm_ContractPaginationStatus" :key="item.value"></el-tab-pane> -->
					<el-tab-pane label="待开票" name="1"></el-tab-pane>
					<el-tab-pane label="已开票" name="2"></el-tab-pane>
					<el-tab-pane label="已取消" name="3"></el-tab-pane>
				</el-tabs>
				<div style="width:158px;height:45px;">
					<!-- <crmFileUpload
						v-model:modelValue="invoiceUrl"
						name="导入发票物流信息"
						:isShowTip="false"
						:FileListShow="false"
						:fileType="[]"
						:fileSize="50"
						:del="true"
						replace
					></crmFileUpload> -->
					<el-upload
						v-model:file-list="invoiceUrl"
						class="upload-demo"
						action="/ac-inner/customer-crm/crm-invoice-record/import/financial-invoice"
						multiple
						:headers="headers"
						:limit="99"
						:show-file-list="false"
						:on-exceed="handleExceed"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload"
					>
						<el-button type="primary">导入发票物流信息</el-button>
						<template #tip>
						
						</template>
					</el-upload>
<!-- 
					<el-upload
						class="upload-demo"
						action="/ac-inner/customer-crm/crm-invoice-record/import/financial-invoice"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload"
					>	
						<el-button type="primary">Click to upload</el-button>
					</el-upload> -->
				</div>
				
				<el-button @click="exportExcel" style="margin-bottom:12px;margin-left:15px;">导出</el-button>
				<el-button style="margin-bottom:12px;" v-hasPermi="['crm:finance:bill:add']" @click="draclick(1)">申请开票</el-button>
			</div>
			<el-table
				:data="tableData"
				style="width: 100%"
				v-loading="loading"
				row-key="id"
			>	
				<el-table-column prop="businessKey" label="开票申请单编号" width="180" />

				<el-table-column
					prop="customerName"
					label="客户名称"
					width="180"
				/>
				<el-table-column prop="orderQuantity" label="订单数量" />

				<el-table-column prop="invoiceEntity" width="220" label="开票主体" />
				
				<!-- <el-table-column label="开票类型" width="140">
					<template #default="scope">
						<DictTag
							style="display: inline-block"
							:value="scope.row.invoiceType"
							:options="crm_invoice_type"
						/>
						{{scope.row.invoiceType}}
					</template>
				</el-table-column> -->
				<el-table-column label="开票类型" width="140">
					<template #default="scope">
						<DictTag
							style="display: inline-block"
							:value="scope.row.invoiceType"
							:options="crm_invoice_type"
						/>
					</template>
				</el-table-column>

				<el-table-column
					prop="invoiceAmount"
					label="开票金额"
					width="150"
				>
				<template #default="scope">
					<div style="text-align: right;height: 100%;display: block;">
						{{
						showMoney(scope.row.invoiceAmount
						? scope.row.invoiceAmount
						: '-')
						}}
					</div>
				</template>
				</el-table-column>

				<el-table-column label="申请人" width="140">
					<template #default="scope">
						<div>{{ scope.row.businessStaffName || '-' }}</div>
					</template>
				</el-table-column>

				<el-table-column
					label="开票人"
					width="140"
					v-if="cpagestatus != 1"
				>
					<template #default="scope">
						<div>{{ scope.row.invoicerName || '-' }}</div>
					</template>
				</el-table-column>

				<el-table-column label="申请时间" width="200">
					<template #default="scope">
						<div>{{ formatDate(scope.row.applyTime) || '-' }}</div>
					</template>
				</el-table-column>

				<el-table-column
					label="开票时间"
					width="200"
					v-if="cpagestatus != 1"
				>
					<template #default="scope">
						<div>
							{{ formatDate(scope.row.invoiceTime) || '-' }}
						</div>
					</template>
				</el-table-column>

				<el-table-column
					label="取消人"
					width="140"
					v-if="cpagestatus == 3"
				>
					<template #default="scope">
						<div>{{ scope.row.cancelerName || '-' }}</div>
					</template>
				</el-table-column>

				<el-table-column
					label="取消时间"
					width="200"
					v-if="cpagestatus == 3"
				>
					<template #default="scope">
						{{ formatDate(scope.row.cancelTime) }}
					</template>
				</el-table-column>

				<el-table-column label="操作" fixed="right">
					<template #default="scope">
						<template v-if="cpagestatus == 1">
							<el-link
								v-hasPermi="['crm:finance:bill:verify']"
								:underline="false"
								type="primary"
								@click="
									editfn(
										2,
										scope.row.id,
										scope.row.invoiceType,
										scope.row.processParentId,
										scope.row.customerId
									)
								"
								>财务开票</el-link
							>
						</template>
						<template v-else-if="cpagestatus == 2">
							<el-link
								:underline="false"
								type="primary"
								@click="
									editfn(
										3,
										scope.row.id,
										scope.row.invoiceType,
										scope.row.processParentId,
										scope.row.customerId
									)
								"
								style="margin-right: 10px"
								>查看</el-link
							>
							<el-link
								v-hasPermi="['crm:finance:bill:verify']"
								:underline="false"
								type="primary"
								@click="ICancel(scope.row.id)"
								>取消开票</el-link
							>
						</template>
						<template v-else>
							<el-link
								:underline="false"
								type="primary"
								@click="
									editfn(
										3,
										scope.row.id,
										scope.row.invoiceType,
										scope.row.processParentId,
										scope.row.customerId

									)
								"
								>查看</el-link
							>
						</template>
						<!-- <el-link v-if="cpagestatus==1||cpagestatus==2" :underline="false" type="primary" @click="editfn(1,scope.row.processParentId,scope.row.procId)">{{cpagestatus==1?'签订':'重新签订'}}</el-link> -->
						<!-- <el-link v-else :underline="false" type="primary" style="color:#999;">详情</el-link> -->
						<!-- <el-link v-else :underline="false" type="primary" @click="editfn(2,scope.row.processParentId,scope.row.procId)" style="margin-left: 8px">查看</el-link> -->
						<!-- <el-link v-else :underline="false" type="primary" style="margin-left: 8px;color:#999;">审核</el-link> -->
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
			:title="getTitle(istype)"
			direction="rtl"
			:before-close="handleClose"
			size="750px"
		>
			<template #default>
				<div>
					<new-order
						ref="newo"
						:status="cpagestatus"
						:istype="istype"
						:isoperation="isoperation"
						:processParentId="processParentId"
						:cid="cId"
						:rejdata="rejdata"
						:invoiceType="iType"
						:isSaleman="isSaleman"
						:userId="userId"
						@cancelClick="cancelClick"
					>
					</new-order>
				</div>
			</template>
			<template #footer>
				<div style="flex: auto">
					<el-button @click="drawer = false">{{istype==3?'关闭':'取消'}}</el-button>
					<el-button
						type="primary"
						@click="confirmClick(true)"
						:disabled="!newo?.invoicedata.length"
						v-if="cpagestatus == 1||istype==1"
						>
						确定
					</el-button>
				</div>
			</template>
		</el-drawer>
	</div>
</template>

<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import { reactive } from 'vue'
import newOrder from './components/newOrder.vue'
import { formatDate } from '@/utils'
import { parseTime } from '@/utils/ruoyi'
import useUserStore from '@/store/modules/user'
import { roleKey,crmInvoiceConfig } from '@/api/orderManagement/subOrder'
import { useIsCrmSaleman } from '@/hooks/selectCrmSaleman'
import { GetInvoiceRecord, InvoiceCancel,Getassignee,exportInvoiceList } from '@/api/crm/finance/contract'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from "@/utils/auth";
const [isSaleman, userId] = useIsCrmSaleman('crmCustomerBusinessStaff')
const { proxy } = getCurrentInstance()
const {
	// crm_contract_type,
	// basic_approval_category,
	// crm_saleman,
	// crm_ContractPaginationStatus,
	crm_invoice_type,
} = proxy.useDict(
	// 'crm_contract_type',
	// 'basic_approval_category',
	// 'crm_saleman',
	// 'crm_ContractPaginationStatus',
	'crm_invoice_type'
)

const province = ref('')
const city = ref('')
const district = ref('')

const roles = computed(() => useUserStore().roles) //获取角色
const formData = ref({
	current: 1,
	size: 20,
	customerInfo: null, //客户信息
	invoicerId: null, //开票人id
	businessStaffId: isSaleman?userId:'', //业务员id
	applyTimeStart: null, //申请时间
	applyTimeEnd: null, //申请结束时间
	invoiceTimeStart: null, //开票开始时间
	invoiceTimeEnd: null, //开票结束时间
	cancelTimeStart: null, //取消开始时间
	cancelTimeEnd: null, //取消结束时间
	invoiceEntityId:null,
	invoiceType:null
})
const headers = {
	Authorization: 'Bearer ' + getToken(),
	token: localStorage.getItem('Access-Token'),
}
const invoiceUrl = ref([])
const drawer = ref(false)
const istype = ref(1)
const isoperation = ref(1)
const processParentId = ref('')
const detaildata = ref(null)
const rejdata = ref(null)
const isSearch = ref(false);
const dateRef = ref(null)
const dateRef1 = ref(null)
const dateRef2 = ref(null)
// const datePicker = ref(LastThreeMonths())
// const datePicker2 = ref(LastThreeMonths())
// const datePicker3 = ref(LastThreeMonths())
const crmInvoiceConfigList = ref([])
const tableData = ref()
const editdata = ref(null)
const loading = ref(false)
const total = ref(0)
const drawerTitle = ref('新增客户')
const newo = ref(null)
const salesValue = ref('')
const invotypelist = ref(null)
const salesmanList = ref([])
const AList = ref([])
const DList = ref([])
const cpagestatus = ref('1')
const cId=ref('')
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
const iType = ref('')
let dranum = ref(2)
const onSubmit = () => {
	console.log('submit!')
}
const btnfn = () => {
	province.value = '广东省'
	city.value = '深圳市'
}
Getassignee(1).then(res=>{
	AList.value=res.data
	//申请人
})
Getassignee(2).then(res=>{
	DList.value=res.data
	//开票人
})
const crmInvoiceConfigFn = (type) => {
  crmInvoiceConfig('').then((res) => {
    // console.log('开票主体数据--', res)
    crmInvoiceConfigList.value = res.data
  })
}
crmInvoiceConfigFn()

const changeInvoiceType = (val) => {
	formData.value.invoiceType=null
	if (val) {
		let invoiceItem = crmInvoiceConfigList.value.find(
			(item) => item.id == val
		)
		invotypelist.value = invoiceItem?.invoiceTypeList
		// formData.value.invoiceType = invoiceItem.invoiceTypeList[0].invoiceType
		// formData.value.invoiceEntityId = invoiceItem?.id
	} else {
		invotypelist.value = null
		// formData.value.invoiceType = ''
		// formData.value.invoiceEntityId = ''
	}
	// console.log(invoiceItem?.invoiceTypeList);

//   if (val == 4) {
//     formData.invoiceType = 0
//     formData.invoiceEntityId = ''
//     crmInvoiceConfigList.value = []
//   } else {
//     crmInvoiceConfigFn(val)
//   }
}


const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const handleAvatarSuccess = (
  response,
  uploadFile
) => {
  if(uploadFile.response.code===200){
	getList(cpagestatus.value)
	// ElMessage.success(uploadFile.response.msg)
	ElMessage.success('导入成功')
  }else{
	ElMessage.error(uploadFile.response.msg)
  }
}
const invoiceTypeName = (type) => {
  let invoiceName = crm_invoice_type.value.find((item) => item.value == type)
  return invoiceName.label
}
const beforeAvatarUpload = (rawFile) => {
//   if (rawFile.type !== 'image/jpeg') {
//     ElMessage.error('Avatar picture must be JPG format!')
//     return false
//   } else if (rawFile.size / 1024 / 1024 > 2) {
//     ElMessage.error('Avatar picture size can not exceed 2MB!')
//     return false
//   }
//   return true
}

/** 重置按钮操作 */
function resetQuery(num) {
	// proxy.resetForm("formRef");
  dateRef.value.initTime(1)
  dateRef1.value.initTime(1)
  dateRef2.value.initTime(1)
	formData.value = {
		current: 1,
		size: 20,
		customerInfo: null, //客户信息
		invoicerId: null, //开票人id
		businessStaffId: isSaleman?userId.toString():'', //业务员id
		applyTimeStart: formatDate(dateRef.value.start), //申请时间
		applyTimeEnd: formatDate(dateRef.value.end), //申请结束时间
		invoiceTimeStart: cpagestatus.value!=1?formatDate(dateRef1.value.start):null, //开票开始时间
		invoiceTimeEnd: cpagestatus.value!=1?formatDate(dateRef1.value.end):null, //开票结束时间
		cancelTimeStart: cpagestatus.value==3?formatDate(dateRef2.value.start):null, //取消开始时间
		cancelTimeEnd: cpagestatus.value==3?formatDate(dateRef2.value.end):null, //取消结束时间
		invoiceEntityId:null,
		invoiceType:null
	}
	// datePicker.value = LastThreeMonths()
	// datePicker2.value = LastThreeMonths()
	// datePicker3.value = LastThreeMonths()
	// cpagestatus.value = num
	// search();
}
//搜索
function search() {
	// formData.value.current = 1 //页码
	// formData.value.size = 20 //分页大小
	// if (datePicker.value?.length > 0) {
	// 	formData.value.applyTimeStart =
	// 		formatDate(datePicker.value[0])
	// 	formData.value.applyTimeEnd =
	// 		formatDate(datePicker.value[1])
	// } else {
	// 	formData.value.applyTimeStart = formData.value.applyTimeEnd = null
	// }
	// if (cpagestatus.value!=1&&datePicker2.value?.length > 0) {
	// 	formData.value.invoiceTimeStart =
	// 		formatDate(datePicker2.value[0])
	// 	formData.value.invoiceTimeEnd =
	// 		formatDate(datePicker2.value[1])
	// } else {
	// 	formData.value.invoiceTimeStart = formData.value.invoiceTimeEnd =
	// 		null
	// }
	// if (cpagestatus.value==3&&datePicker3.value?.length > 0) {
	// 	formData.value.cancelTimeStart =
	// 		formatDate(datePicker3.value[0])
	// 	formData.value.cancelTimeEnd =
	// 		formatDate(datePicker3.value[1])
	// } else {
	// 	formData.value.cancelTimeStart = formData.value.cancelTimeEnd = null
	// }

	// console.log('fffff', formData.value)
  isSearch.value = true
	getList(cpagestatus.value)
}
onMounted(() => {
  /**
   * 监听对象数据的变化
   */
  watch(
    [
      () => formData.value.current,
      () => formData.value.size,
      () => cpagestatus.value,
    ],
    (val, oval) => {
      // 判断没有点击筛选按钮时，之前填写的参数初始化
      if (!isSearch.value) {
        // console.log('88888', formatDate(dateRef.value.start))
        dateRef.value.initTime(1)
        dateRef1.value.initTime(1)
        dateRef2.value.initTime(1)
        formData.value.customerInfo= null //客户信息
        formData.value.invoicerId=null //开票人id
        formData.value.businessStaffId= isSaleman?userId.toString():'' //业务员id
        formData.value.applyTimeStart=formatDate(dateRef.value.start) //申请时间
        formData.value.applyTimeEnd= formatDate(dateRef.value.end) //申请结束时间
        formData.value.invoiceTimeStart= cpagestatus.value!=1?formatDate(dateRef1.value.start):null //开票开始时间
        formData.value.invoiceTimeEnd=cpagestatus.value!=1?formatDate(dateRef1.value.end):null  //开票结束时间
        formData.value.cancelTimeStart= cpagestatus.value==3?formatDate(dateRef2.value.start):null//取消开始时间
        formData.value.cancelTimeEnd=cpagestatus.value==3?formatDate(dateRef2.value.end):null //取消结束时间
		formData.value.invoiceEntityId= null //
        formData.value.invoiceType=null //

      }
      getList(cpagestatus.value);
    },
    {
      immediate: true,
      deep: true, //开启深度监听,能够侦听到对象属性值的变化
    }
  )
})
function exportExcel(){
	if(!tableData.value?.length){
		ElMessage.error('暂无数据导出')
		return
	}
	exportInvoiceList({ invoiceStatus: cpagestatus.value, ...formData.value },`发票列表-${(cpagestatus.value=='1'?'待开票':cpagestatus.value=='2'?'已开票':'已取消')+parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`)
}
function getList(num) {
	GetInvoiceRecord({ invoiceStatus: cpagestatus.value, ...formData.value })
		.then((res) => {
			tableData.value = res.data.records
			total.value = res.data.total
		})
		.catch((err) => {
			console.log('报错-----', err)
		})
}
const handleClick = (tab, event) => {
	cpagestatus.value = tab.paneName
  formData.value.applyTimeStart=formatDate(dateRef.value.start) //申请时间
  formData.value.applyTimeEnd= formatDate(dateRef.value.end) //申请结束时间
  formData.value.invoiceTimeStart= cpagestatus.value!=1?formatDate(dateRef1.value.start):null //开票开始时间
  formData.value.invoiceTimeEnd=cpagestatus.value!=1?formatDate(dateRef1.value.end):null  //开票结束时间
  formData.value.cancelTimeStart= cpagestatus.value==3?formatDate(dateRef2.value.start):null//取消开始时间
  formData.value.cancelTimeEnd=cpagestatus.value==3?formatDate(dateRef2.value.end):null //取消结束时间
	// console.log(event)
	// resetQuery(tab.paneName)
	// console.log(tab.paneName)
}
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
	istype.value = num
	drawer.value = true
}
const ICancel = (id) => {
	ElMessageBox.confirm(
		'取消开票后对应订单开票记录将被取消，操作立即生效是否继续？',
		'确定取消开票?'
		)
		.then(() => {
			InvoiceCancel(id).then((res) => {
				if (res.code === 200) {
					cancelClick()
					ElMessage.success('取消成功')
				}
			})
		})
		.catch(() => {
			// catch error
		})
}
const getTitle = (num) =>{
	let name=''
	if(num==1){
		name='申请发票'
	}else{
		if(dranum.value===2){
			name='开票'
		}else{
			name='查看发票'
		}
	}
	return name
}
const editfn = (is, id, invoiceType, pid,cid) => {
	draclick(is)
	// drawer.value = true
	dranum.value=is
	processParentId.value = id
	cId.value=cid
	iType.value = invoiceType
	// getcrmprojectdesignorderprocid(pid)
	// 	.then((res) => {
	// 		console.log('res', res)
	// 		if (res.code === 200) {
	// 			drawer.value = true
	// 			detaildata.value = res.data
	// 		}
	// 	})
	// 	.catch((err) => {
	// 		detaildata.value = null
	// 	})
	// getdesignservicecontractid(procId)
	// 	.then((res) => {
	// 		if (res.code === 200) {
	// 			rejdata.value = res.data
	// 		}
	// 	})
	// 	.catch((err) => {
	// 		rejdata.value = null
	// 	})
}
function cancelClick() {
	getList(cpagestatus.value)
	drawer.value = false
}
function confirmClick(flag) {
	newo.value.confirmClick()
}
const allSalesmanModule = () => {
	roleKey('crmCustomerBusinessStaff')
		.then((res) => {
			salesmanList.value = res.data
		})
		.catch((err) => {
			// console.log('报错-----', err)
			ElMessage.error(err.msg)
		})
}
allSalesmanModule()
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

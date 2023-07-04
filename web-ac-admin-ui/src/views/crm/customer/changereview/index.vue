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

				<!-- <el-form-item label="业务员:" prop="businessStaffId">
          <el-select
            :disabled="isBusinessStaff"
            v-model="formData.businessStaffId"
            placeholder="所有"
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
        </el-form-item> -->
        <el-form-item label="归属部门:" prop="acDataSepDeptId">
          <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
            <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
				<el-form-item label="业务员:" prop="businessStaffId">
					<el-select
						:disabled="isSaleman"
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
				<el-form-item label="类型:" prop="customerType">
					<el-select
						v-model="formData.applyTye"
						class="m-2"
						placeholder="所有类型"
						clearable
					>
						<el-option
							v-for="item in crm_change_type"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="审核状态:" prop="customerGrading">
					<!-- <el-select
            v-model="formData.approvalStatus"
            placeholder="所有"
            clearable
            filterable
            style="width: 252px"
          > -->
					<el-select
						v-model="formData.approvalStatus"
						class="m-2"
						placeholder="所有状态"
						clearable
					>
						<el-option
							v-for="item in crm_audit_status"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
					<!-- </el-select> -->
				</el-form-item>
				<el-form-item label="审核人:" prop="enabled">
					<el-select
						v-model="formData.approvalerId"
						placeholder="所有审核人"
						clearable
						filterable
						style="width: 252px"
					>
						<el-option v-for="item in approvalerList" :key="item.userId" :label="item.assigneeName" :value="item.assigneeId" />
					</el-select>
				</el-form-item>
				<el-form-item label="审核时间:">
					<el-date-picker
						v-model="datePicker"
						type="daterange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 252px"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<div class="btnBox">
				<el-button @click="resetQuery">重置</el-button>
				<el-button type="primary" @click="search">搜索</el-button>
			</div>
		</el-card>
		<el-card style="margin: 10px">
			<div class="tool-bar">
				<div>客户列表</div>
				<!-- <div>
          <el-button>导出</el-button>
          <el-button @click="draclick(1)">新增用户</el-button>
        </div> -->
			</div>
			<el-table
				:data="tableData"
				style="width: 100%"
				v-loading="loading"
				row-key="id"
			>
				<el-table-column
					prop="customerNumber"
					label="客户编号"
					width="180"
				/>
				<el-table-column
					prop="customerName"
					label="客户名称"
					width="180"
				/>
				<el-table-column label="提交审核时间" width="200">
					<template #default="scope">
						<div>{{ formatDate(scope.row.appleTime) || '-' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="类型" width="140">
					<template #default="scope">
						<DictTag
							style="display: inline-block"
							:value="scope.row.applyTye"
							:options="crm_change_type"
						/>
					</template>
				</el-table-column>
				<el-table-column label="审核状态" width="160">
					<template #default="scope">
						<DictTag
							style="display: inline-block"
							:value="scope.row.approvalStatus"
							:options="crm_audit_status"
						/>
					</template>
				</el-table-column>
				<el-table-column label="审核人" width="140">
					<template #default="scope">
						<div>{{ scope.row.approvalerName || '-' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="审核时间" width="200">
					<template #default="scope">
						<div>
							{{ formatDate(scope.row.approvalTime) || '-' }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="业务员" width="140">
					<template #default="scope">
						<div>{{ scope.row.businessStaffName || '-' }}</div>
					</template>
				</el-table-column>

				<el-table-column label="操作" fixed="right">
					<template #default="scope">
						<el-link
							:underline="false"
							type="primary"
							@click="editfn(1, scope.row.id,scope.row.applyTye)"
							>详情</el-link
						>
						<el-link
							v-hasPermi="['crm:customer:examine']"
							v-if="scope.row.approvalStatus == 1"
							:underline="false"
							type="primary"
							@click="editfn(2, scope.row.id,scope.row.applyTye)"
							style="margin-left: 8px"
							>审核</el-link
						>
						<el-link
							v-hasPermi="['crm:customer:examine']"
							v-else
							:underline="false"
							type="primary"
							style="margin-left: 8px; color: #999"
							>审核</el-link
						>
					</template>
				</el-table-column>
			</el-table>
			<div class="pages" style="position: relative">
				<pagination
					background
					layout="total, sizes, prev, pager, next, jumper"
					v-model:page="formData.current"
					@pagination="getList"
					:total="total"
					v-model:limit="formData.size"
					:pageSizes="[20, 30, 50, 100]"
				/>
			</div>
		</el-card>
		<el-drawer
			v-model="drawer"
			:title="drawerTitle"
			direction="rtl"
			size="60%"
			:before-close="handleClose"
		>
			<template #default>
				<div>
					<new-order
						ref="newo"
						:dranum="dranum"
						:editdata="editdata"
						@cancelClick="cancelClick"
					>
					</new-order>
				</div>
			</template>
			<template #footer>
				<div style="flex: auto" v-if="dranum === 2">
					<el-button @click="confirmClick(false)">不通过</el-button>
					<el-button type="primary" @click="confirmClick(true)"
						>审核通过</el-button
					>
				</div>
				<!-- <div style="flex: auto"> -->
					<el-button v-if="dranum==1" @click="drawer=false">关闭</el-button>
				<!-- </div> -->
			</template>
		</el-drawer>
	</div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import newOrder from './components/newOrder.vue'
import { formatDate, formatDates, LastThreeMonths,LastThreeMonths2 } from '@/utils'
import useUserStore from '@/store/modules/user'
import { roleKey } from '@/api/orderManagement/subOrder'
import {
	changeStatus,
	Getcustomerapply,
	Getcustomerapplyid,
	getApprovaler,
} from '@/api/orderManagement/customer/index'
import { useIsCrmSaleman } from '@/hooks/selectCrmSaleman'
import { ElMessageBox } from 'element-plus'
import useCrmOption from "@/store/modules/crmSelectOption"
const option = useCrmOption()
const salesmanList = computed(() => option.salesmanList)
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const [isSaleman, userId] = useIsCrmSaleman('crmCustomerBusinessStaff')
const { proxy } = getCurrentInstance()
const { crm_audit_status, crm_change_type, crm_saleman,crm_acColumn } =
	proxy.useDict(
		'crm_audit_status',
		'crm_change_type',
		'crm_saleman',
		'crm_acColumn'
	)
const roles = computed(() => useUserStore().roles) //获取角色
const data = reactive({
	formData: {
		current: 1,
		size: 20,
		customerInfo: null, //客户信息
		approvalStatus: null, //审批状态
		approvalerId: null, //审批人id
		businessStaffId: isSaleman?userId:'', //业务员id
		applyTye: null, //申请类别
		approvalStartTime:null,// formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90), //审批时间开始时间
		approvalEndTime:null,// formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000), //审批时间结束时间
		acColumn:null
	},
})

const datePicker = ref([])
const { formData } = toRefs(data)
const tableData = ref([])
const editdata = ref(null)
const loading = ref(false)
const total = ref(0)
const isBusinessStaff = ref(false)
const drawerTitle = ref('修改详情')
const drawer = ref(false)
const newo = ref(null)
watch(crm_acColumn,(val)=>{
	formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
// const salesmanList = ref([])
const acDataSepDeptId = ref('')
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
}).finally(()=>{
	getList()
})
function changeDept(val){
  option.setDeptId(val)
  formData.value.businessStaffId = null
}
const approvalerList = ref([])
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
/** 重置按钮操作 */
function resetQuery() {
	// proxy.resetForm("formRef");
	data.formData = {
		current: 1,
		size: 20,
		customerInfo: null, //客户信息
		approvalStatus: null, //审批状态
		approvalerId: null, //审批人id
		businessStaffId: isSaleman?userId:'', //业务员id
		applyTye: null, //申请类别
		approvalStartTime:null,// formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90), //审批时间开始时间
		approvalEndTime:null,// formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000), //审批时间结束时间
		acDataSepDeptId:acDataSepDeptId.value,
		acColumn:formData.value.acColumn
	}
	datePicker.value = []//[new Date(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90),new Date(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000)]//LastThreeMonths2()
	getList();
}
//搜索
function search() {
	formData.value.current = 1 //页码
	formData.value.size = 20 //分页大小
	if (datePicker.value?.length > 0) {
		formData.value.approvalStartTime =
			formatDates(datePicker.value[0]) + ' 00:00:00'
		formData.value.approvalEndTime =
			formatDates(datePicker.value[1]) + ' 23:59:59'
	} else {
		formData.value.approvalStartTime = formData.value.approvalEndTime = null
	}
	getList()
}
function getList() {
	Getcustomerapply(formData.value)
		.then((res) => {
			tableData.value = res.data.records
			total.value = res.data.total
			// console.log('GET分页查询订单', data.tabList)
		})
		.catch((err) => {
			console.log('报错-----', err)
		})
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
const editfn = (is, id,type) => {
	dranum.value = is
	let t1=type==1?'新增':'修改'
	let t2=is==1?'详情':'审核'
	drawerTitle.value=is==1?t1+t2:t2+'-'+t1
	Getcustomerapplyid({ id: id })
		.then((res) => {
			if (res.code === 200) {
				editdata.value = res.data
				editdata.value.id = id
				draclick()
			}
		})
		.catch((err) => {
			console.log('报错-----', err)
		})
}
function cancelClick() {
	getList()
	drawer.value = false
}
function confirmClick(flag) {
	if (flag) {
		ElMessageBox.confirm('是否确认审核通过？', '操作立即生效，是否继续?')
			.then(() => {
				newo.value.confirmClick(flag)
			})
			.catch(() => {
				// catch error
			})
	} else {
		ElMessageBox.confirm('是否确认退回申请单？', '操作立即生效，是否继续?')
			.then(() => {
				newo.value.confirmClick(flag)
			})
			.catch(() => {
				// catch error
			})
	}
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

function getApprovalerList(){
	getApprovaler().then(res=>{
		if(res.code==200){
			approvalerList.value = res.data
		}
	})
}
getApprovalerList()
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

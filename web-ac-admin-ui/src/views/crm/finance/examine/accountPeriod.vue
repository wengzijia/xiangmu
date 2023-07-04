<template>
  <div>

    <list-layout>
      <template #header>
        <div class="top-bar" style="display: flex;">
        	<el-form
				inline
				:model="formData"
				class="demo-form-inline"
				label-width="120px"
				ref="queryRef"
			>
				<el-form-item label="客户信息" prop="customerInfo">
					<el-input
						v-model="formData.customerInfo"
						placeholder="请输入客户编号/客户名称"
						clearable
						style="width: 252px"
					/>
				</el-form-item>
        <el-form-item label="申请部门" prop="acDataSepDeptId">
          <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
            <el-option v-for="item in option.deptList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
				<el-form-item label="申请人" prop="bindingBusinessStaffId">
					<el-select
						:disabled="isSaleman"
						v-model="formData.applicantId"
						placeholder="所有业务经理"
						clearable
						filterable
						style="width: 252px"
					>
						<el-option
							v-for="item in option.salesmanList"
							:key="item.userId"
							:label="item.nickName"
							:value="item.userId"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="审核状态" prop="customerGrading">
					<!-- <dictSelect v-model="formData.flag" dict='crm_finance_approve_status'></dictSelect> -->
					<el-select
						v-model="formData.flag"
						class="m-2"
						placeholder="所有状态"
						clearable
            style="width: 252px"
					>
						<el-option
							label="待审批"
							:value="false"
						/>
            <el-option
							label="已审批"
							:value="true"
						/>
					</el-select>
				</el-form-item>
			
				<el-form-item label="申请时间">
            <datePicker dateType='daterange' :isAddTime='true' :width='252' v-model:startTime='formData.appleTimeStart' v-model:endTime='formData.appleTimeEnd' :dateRange='30'></datePicker>
				</el-form-item>
			</el-form>
            <div class="btnBox">
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" @click="getList">搜索</el-button>
            </div>
        </div>
      </template>
      <template #table-header>
        财务审批列表
      </template>
      <template #table-content='scoped'>
        <el-table
        :height='scoped.tableHeight'
				:data="tableData"
				style="width: 100%"
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
					
				/>
				<el-table-column label="申请类型" >
					<template #default="scope">
						<DictTag
							style="display: inline-block"
							:value="scope.row.applyType"
							:options="crm_custom_apply_type"
						/>
					</template>
				</el-table-column>
				<el-table-column label="申请业务经理" width="140">
					<template #default="scope">
						<div>{{ scope.row.applicantName || '-' }}</div>
					</template>
				</el-table-column>
        <el-table-column label="申请时间" width="200">
					<template #default="scope">
						<div>{{ formatDate(scope.row.deptAppleTime) || '-' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="审批时间" width="200">
					<template #default="scope">
						<div>{{ formatDate(scope.row.approvalTime) || '-' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="状态" >
					<template #default="scope">
						<span v-if="scope.row.financeBaseInfoApprovalStatus==2&&scope.row.financeAccountApprovalStatus==3">基本信息审核通过/账期申请审核不通过</span>
						<DictText  v-else :value='scope.row.financeAccountApprovalStatus' dict='crm_finance_approve_status'></DictText>
						
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" >
					<template #default="scope">
						<el-link
							v-if="tableType==1"
							v-hasRole="['crmFinancialStaff']"
							:underline="false"
							type="primary"
							@click="getApplyDept(scope.row.id)"
							style="margin-left: 8px"
							>审核</el-link
						>
					</template>
				</el-table-column>
			</el-table>
      </template>
      <template #pagination>
          <pagination
          style="margin-top: 0;height: auto;"
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-model:page="formData.current"
          @pagination="getList"
          :total="total"
          v-model:limit="formData.size"
          :pageSizes="[10, 20, 50, 100]"
        />
      </template>
    </list-layout>
		<el-dialog :title='dialogTitle' append-to-body v-model="showEdit" :width='customerInfo.applyType==1?"920px":"1840px"' top='50px' destroy-on-close>
			<el-tabs
				v-model="tabsActiveName"
				type="card"
				class="demo-tabs"
				@tab-click="getContactsList"
			>
				<el-tab-pane label="基本信息" name="basicInformation">
					<div style="height: 66vh;overflow: auto;">
						<div style="display: flex;">
							<div style="flex: 1;margin: 0 10px;" v-if='customerInfo.applyType==2&&resetInfo'>
								<div class="basic-information-title">修改前</div>
							<basicInformation :scroll="false" v-model:customer='customerInfo.deptBefore' :edit='false' :creditQuotaEdit='false'>
									<template #examine >
										<div  v-if="customerInfo.applyType==2&&customerInfo.financeBaseInfoApprovalStatus!=2" style="height:32px;margin-top: 10px;">
								</div>
								</template>
							</basicInformation>
						</div>
						<div style="flex: 1;margin: 0 10px;"  v-if='resetInfo'>
							<div
                  class="basic-information-title"
                  v-if="customerInfo.applyType == 2"
									style='background-color: #95f204;'
                >
                  修改后
                </div>
							<basicInformation :applyId="customerInfo.id" :scroll="customerInfo.applyType==1"  :beforeData="customerInfo.deptBefore" :customer='customerInfo.deptAfter' :edit='false' :creditQuotaEdit='true' :isFinanceExamine='true'>
								<template #examine >
									<div v-if="customerInfo.applyType==2&&customerInfo.financeBaseInfoApprovalStatus!=2" style="display: flex;justify-content: flex-end;margin-top: 10px;">
										<el-button type='warning' @click="applyDept(false,'customerfinanceBaseInfo')">退回修改</el-button>
										<el-button type='primary' @click="applyDept(true,'customerfinanceBaseInfo')">资料修改审批通过</el-button>
									</div>
								</template>
							</basicInformation>
						</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="联系信息" name="contacts">
					<contacts  v-if='tabsActiveName=="contacts"&&resetInfo&&customerBaseInfo.contactsList' v-model:customer="customerBaseInfo" :edit='false' ></contacts>
				</el-tab-pane>
		
			</el-tabs>
			
			<div style="display: flex;justify-content:space-between;padding: 10px 0;">
				<div>
					<!-- <el-button type='success'>同意业务经理绑定该客户</el-button> -->
				</div>
				<div v-if="customerInfo.applyType==1">
					<el-button type='warning' @click="applyDept(false,'customerfinanceAll')">审批不通过</el-button>
					<el-button type='primary' @click="applyDept(true,'customerfinanceAll')">审批通过</el-button>
				</div>
				<div v-if="customerInfo.applyType==2">
					<el-button type='warning' @click="applyDept(false,'customerfinanceAccount')">授信和账期不修改，审核完成</el-button>
					<el-button type='primary' @click="applyDept(true,'customerfinanceAccount')">提交授信和账期修改，审核完成</el-button>
				</div>
			</div></el-dialog>
  </div>
</template>

<script setup>
import {getFinanceList,getCrmCustomerApply,customerfinanceAccount,customerfinanceAll,customerfinanceBaseInfo,getCrmCustomer} from '@/api/crm/customer/newIndex'
import useCrmOption from "@/store/modules/crmSelectOption"
import datePicker from "@/components/datePicker/index"
import { debounce,formatDate, formatDates, LastThreeMonths,LastThreeMonths2,crmChangePrice } from '@/utils'
import { ElMessage, ElLoading } from 'element-plus'
import basicInformation from "@/views/crm/customer/list/components/basicInformation.vue"
import contacts from '@/views/crm/customer/list/components/contacts.vue'

const option = useCrmOption()
const acDataSepDeptId = ref('')
const deptDisabled = ref(false);
const isSaleman = ref(false);
const { proxy } = getCurrentInstance()
const { crm_audit_status, crm_custom_apply_type, crm_saleman,crm_acColumn } =
	proxy.useDict(
		'crm_audit_status',
		'crm_custom_apply_type',
		'crm_saleman',
		'crm_acColumn'
	)
option.getDept().then(res=>{
  // if (res?.data) {
  //   formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
  //   deptDisabled.value = true
  // }else{
  //   formData.value.acDataSepDeptId = option.deptList[0].id
  // } 
  changeDept(formData.value.acDataSepDeptId)
}).finally(()=>{
  
})

function changeDept(val){
  option.setDeptId(val)
  console.log('option.deptList',option.deptList)
  formData.value.bindingBusinessStaffId = null
  getList()
}
let fromOrgin = {
    flag: false, // 是否审核完成
    acDataSepDeptId:'',//部门id
    acColumn:'',//部门id
    customerInfo:'',//部门id
    bindingBusinessStaffId:'',//bindingBusinessStaffId
    appleTimeStart:'',//部门id
    appleTimeEnd:'',//部门id
    approvalStatus:'',//部门id
    acDataSepDeptId:'',//部门id
    current: 1, // 页数
    size: 20, // 每页条数
  }
const formData =  ref({
	...fromOrgin
})

watch(crm_acColumn,(val)=>{
	formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
const total = ref(1000)
function handleSizeChange(){

}

function resetQuery(){
	formData.value = {...fromOrgin}
	getList()
}
function search(){
  getList()
}
let tableData = ref([
		
		])
let tableType = ref('1')
let getList = () => {
	tableType.value = !formData.value.flag?1:2
  getFinanceList(formData.value).then(res=>{
    console.log('getList',res)
    tableData.value = res.data.records
		total.value = res.data.total
  })
}
const dialogTitle = ref("");
function getApplyDept(id){
	tabsActiveName.value = 'basicInformation'
	getCrmCustomerApply(id).then(res=>{
		console.log("dsadsa",res)
		if(!res.data.deptBefore.management)res.data.deptBefore.management = {}
		res.data.deptAfter = crmChangePrice(res.data.deptAfter,'cu')
		if (res.data.applyType == 1) {
      dialogTitle.value = "审核申请账期";
      res.data.deptBefore = {};
    } else {
      dialogTitle.value = "审核修改信息";
      res.data.deptBefore = crmChangePrice(res.data.deptBefore, "cu");
    }
		customerInfo.value = res.data
		showEdit.value = true
	})
}

const showEdit = ref(false)
const customerInfo = ref({})
const applyDept = debounce(function (flag,funt){
	// if(flag&&funt!='customerfinanceBaseInfo'&&!customerInfo.value.deptAfter.baseInfo.financeApprovalOaNumber){
	// 	ElMessage.error('请输入财务OA审批编号')
	// 	return
	// }
	let obj = {customerfinanceAccount,customerfinanceBaseInfo,customerfinanceAll}
	obj[funt]({
	"baseInfo": {
		"customerCreditQuota": crmChangePrice(Number(customerInfo.value.deptAfter.baseInfo.customerCreditQuota)),
		"financeApprovalOaNumber": customerInfo.value.deptAfter.baseInfo.financeApprovalOaNumber,
		"moreSettlementMethodId": customerInfo.value.deptAfter.baseInfo.moreSettlementMethodId
	},
	flag,
	"id":customerInfo.value.id
}).then(res=>{
	console.log(res)
	if(res.code==200){
		getList()
		if(flag){
			ElMessage.success('审批通过成功')
		}else{
			if(funt==='customerfinanceAccount'){
				ElMessage.success('财务审核完成')
			}else{
				ElMessage.error('退回修改成功')
			}
			
		}
	}
	if(funt!='customerfinanceBaseInfo'||flag==false) showEdit.value = false
	
})
},200)

const tabsActiveName = ref('basicInformation')
const resetInfo = ref(true)
// 取消本次编辑，重置信息
const resetInfoFun = function(){
	resetInfo.value = false
	getApplyDept(customerInfo.value.id)
}

const customerBaseInfo = ref({});//联系信息
const getContactsList = ()=>{
	getCrmCustomer(customerInfo.value.customerId).then(res=>{
		console.log('customerInfo.value.id',customerInfo.value.id)
		customerBaseInfo.value = res.data
	})
}

</script>

<style scoped lang="scss">
.header-form{
  flex: 1;
}
.btnBox{
  // flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  .el-button{
    margin: 0;
    margin-bottom:18px;
    margin-left:18px;
  }
}
.basic-information-title{
	background-color: #80ffff;
	text-align: center;
	// color: #fff;
	font-size: 16px;
	padding: 10px;
}
</style>
<template>
    <div>
        <div class="processContent">
            <ul class="steps">
                <li v-for="(e, i) in processList" :key="e.id" :class="taskDefKey == e.taskDefKey ? 'active' : ''"
                    @click="setStepIndex(e.taskDefKey)">
                    <div :class="[
                        'baseCss',
                        stepProcess >= i + 1 ? 'line' : 'stepStatus',
                        stepProcess >= i ? 'stepActive ' : 'stepStatus',
                    ]">
                        <span class="online"></span>
                    </div>
                    <span>{{ e.name }}</span>
                </li>
            </ul>
            <div class="rightContent">
                <div class="programDesign" v-show="taskDefKey == 'bulk_contract'">
                    <div class="everyRaw">
                        <span class="alignRight">大货合同状态：</span>
                        <span v-if="contractTask.bulk_contract">
                            <DictTag style="display: inline-block;" :value="contractTask.bulk_contract?.bulkContractStatus"
						:options="crm_ContractPaginationStatus" />
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">上传时间：</span>
                        <span v-if="contract.taskList?.length>1">{{ parseDate(contractTask.bulk_contract?.submitBulkContractTime)  || '-'}} </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">上传人：</span>
                        <span v-if="contract.taskList?.length>1">{{ contractTask.bulk_contract?.assigneeName  || '-'}} </span>
                        <span v-else>-</span>
                    </div>
                </div>
                <div v-show="taskDefKey == 'bulk_contract_dept_audit'">
                    <div class="everyRaw">
                        <span class="alignRight">审核状态：</span>
                        <span v-if="contractTask.bulk_contract_dept_audit">
                            <DictTag style="display: inline-block;" :value="contractTask.bulk_contract_dept_audit?.contractDeptAuditStatus"
						:options="crm_contract_examine_status" />
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">审核人：</span>
                        <span v-if="contractTask.bulk_contract_dept_audit">
                            {{ contractTask.bulk_contract_dept_audit?.contractDeptAuditPersonName ||'-'}}
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">审核时间：</span>
                        <span v-if="contractTask.bulk_contract_dept_audit">
                            {{ parseDate(contractTask.bulk_contract_dept_audit?.contractDeptAuditTime) }}
                        </span>
                        <span v-else>-</span>
                    </div>
                </div>
                <div v-show="taskDefKey == 'bulk_contract_audit'">
                    <div class="everyRaw">
                        <span class="alignRight">审核状态：</span>
                        <span v-if="contractTask.bulk_contract_audit">
                            <DictTag style="display: inline-block;" :value="contractTask.bulk_contract_audit?.bulkContractAuditStatus"
						:options="crm_contract_examine_status" />
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">审核人：</span>
                        <span v-if="contractTask.bulk_contract_audit">
                            {{ contractTask.bulk_contract_audit?.bulkContractAuditPersonName ||'-'}}
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">审核时间：</span>
                        <span v-if="contractTask.bulk_contract_audit">
                            {{ parseDate(contractTask.bulk_contract_audit?.auditBulkContractTime) }}
                        </span>
                        <span v-else>-</span>
                    </div>
                </div>
                <div v-show="taskDefKey == 'before_prod_first_payment_condition'">
                    <!-- <div>需先支付合同金额20%的款项才能进行大货设计与生产。可在订单中新建支付单</div> -->
                    <div class="red-tips"><el-icon :size="16" class="red-warning"><WarningFilled /></el-icon> 需先支付大货合同金额{{parseInt(orderInfo?.firstPaymentRatio*100)||'30'}}%的款项才能进行大货设计与生产。可在订单中新建支付单</div>
                    <div class="everyRaw">
                        <span class="alignRight">合计已支付金额：</span>
                        <span v-if="contractTask.before_prod_first_payment_condition">
                            <!-- <span>{{ ~~((contract.paidAmount*1/contract.contractTaxInclusiveTotalPrice*1)*100) }}%</span> -->
                            <span>{{ ~~((contract.paidAmount/contract.contractTaxInclusiveTotalPrice)*100) }}%</span>
                            <!-- {{contract?.paidAmountRate}}% -->
                        </span>
                        <span v-else>-</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRefs, watch } from 'vue';
import { parseDate } from "@/utils/index"

const { proxy } = getCurrentInstance()
const { 
	crm_ContractPaginationStatus,
    crm_contract_examine_status
} = proxy.useDict(
	"crm_ContractPaginationStatus",
    "crm_contract_examine_status"
)
const props = defineProps({
    contract:{
        type:Object,
        default:{
            taskList:[]
        }
    },
    orderDetail:{
        type:Object,
        default:null
    },
    orderInfo:{
        type:Object,
        default:null
    },
})
const { contract } = toRefs(props)
const stepProcess = ref(0)

const processList = ref([
    {
        name:'大货合同',
        id:1,
        taskDefKey:'bulk_contract',
    },
    {
        name:'大货合同部门审核',
        id:2,
        taskDefKey:'bulk_contract_dept_audit',
    },
    {
        name:'大货合同财务审核',
        id:2,
        taskDefKey:'bulk_contract_audit',
    },
    {
        name:'生产前首付款条件',
        id:3,
        taskDefKey:'before_prod_first_payment_condition',
    },
])
const taskDefKey = ref('bulk_contract')
const data = reactive({
    contractTask:{
        bulk_contract:null,
        bulk_contract_dept_audit:null,
        bulk_contract_audit:null,
        before_prod_first_payment_condition:null,
    }
})
const { contractTask } = toRefs(data)
watch(contract,(val)=>{
    if (val.taskList?.length) {
        // stepProcess.value = val.taskList.length-2
        stepProcess.value = processList.value.findIndex(item=>{return item.taskDefKey==val.taskList[val.taskList.length-1].taskDefKey})
        if (stepProcess.value<0) {
            stepProcess.value = 0
        }
        setProcessList()
    }
})
if (contract.value.taskList?.length) {
    // stepProcess.value = contract.value.taskList.length-2    
    stepProcess.value = processList.value.findIndex(item=>{return item.taskDefKey==contract.value.taskList[contract.value.taskList.length-1].taskDefKey})
    if (stepProcess.value<0) {
            stepProcess.value = 0
        }
    setProcessList()
}
function setStepIndex(key){
    taskDefKey.value = key
}
//把后端返回的list根据taskDefKey赋值给contractTask对应的流程(key)
function setProcessList(){
    processList.value.map(item=>{
        let obj = contract.value.taskList.find(data=>{return data.taskDefKey===item.taskDefKey})
        if (obj) {
            contractTask.value[item.taskDefKey] = obj
        }
    })
    taskDefKey.value = contract.value.taskList[contract.value.taskList.length-1].taskDefKey
    if (taskDefKey.value =='cost_structure') {
        taskDefKey.value = 'bulk_contract'
    }
}
</script>

<style lang="scss" scoped>

.processContent {
	display: flex;
}

.steps li {
	width: 300px;
	padding: 10px 10px 30px;
	cursor: pointer;
	user-select: none;
	display: flex;
	align-items: center;
}

.steps .active {
	background: #f9f9f9;
}

.steps li .baseCss {
	width: 14px;
	height: 14px;
	border-radius: 50%;
	margin-right: 10px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.steps li .stepStatus {
	border: 1px solid #d7d7d7;
}

.steps li .stepActive {
	background: #d7d7d7;
}

.steps li .stepStatus:after {
	content: '';
	border: 1px solid #d7d7d7;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	display: inline-block;
}

.steps li .baseCss .online {
	height: 43px;
	position: absolute;
	top: 14px;
	left: 6px;
}

.steps li .stepStatus .online {
	border-right: 1px dashed #d7d7d7;
}

.steps li .line .online {
	border-right: 1px solid #d7d7d7;
}

.steps li:last-child .baseCss .online {
	border-right: 0;
}

.rightContent {
	background: #f9f9f9;
	flex: 1;
	padding: 20px;
}

.rightContent .programDesign h3 {
	margin-top: 0;
}

.download {
	color: #1890ff;
	margin-left: 10px;
}

.everyRaw {
	margin: 20px;
}

.alignRight {
	display: inline-block;
	width: 130px;
	text-align: right;
}

.rejectRecord li {
	border: 1px solid #ddd;
	width: 500px;
	border-radius: 6px;
	background: #fbfbfb;
	margin-bottom: 10px;
}

.files {
	display: flex;
}

.image {
	width: 150px;
	height: 100px;
	vertical-align: top;
}

.boxType {
	width: 100%;
	background: #f9f9f9;
	border: 1px solid #ddd;
	padding: 20px;
	border-radius: 6px;
}

.boxType li {
	flex: 1;
}

.boxType li .head {
	display: flex;
	align-items: center;
}

.boxType .blueIcon {
	display: inline-block;
	width: 4px;
	height: 20px;
	background: #1890ff;
	margin-right: 10px;
}

.boxType .boxNumber {
	display: flex;
	margin: 10px 20px;
}

.boxType .boxNumber p {
	flex: 0 0 300px;
}

.headNumber {
	display: flex;
	justify-content: space-between;
	margin-top: 26px;
}

.detailedInfo .proofTitle {
	display: flex;
	align-content: center;
	margin-left: 20px;
}

.detailedInfo .proofTitle::before {
	content: '';
	display: inline-block;
	width: 4px;
	height: 20px;
	margin-right: 10px;
	background: #ff3399;
}

.detailedInfo .information {
	margin: 0 30px;
}

.proofPrice li {
	width: 500px;
	margin: 10px 60px;
	background: #f9f9f9;
	border: 1px solid #ddd;
	border-radius: 6px;
	margin-bottom: 10px;
}

.proofPrice li .proofNumber {
	margin: 0;
	padding: 10px;
	border-bottom: 1px solid #ddd;
}
.red-tips{
    color: #FF0036;
    background-color: rgb(250, 217, 224);
    padding-left: 20px;
    font-size: 13px;
    line-height: 18px;
}
.red-warning{
    position: relative;
    top: 2px;
}
</style>
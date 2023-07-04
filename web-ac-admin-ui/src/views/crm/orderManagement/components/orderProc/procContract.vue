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
                <div class="programDesign" v-show="taskDefKey == 'cost_structure'">
                    <div class="everyRaw">
                        <span class="alignRight">全成本核算表：</span>
                        <span v-if="contractTask?.cost_structure" style="flex: 1;word-break: break-all;">
                           {{ drawerFormData?.allCostCalculateExcelName || '待上传'}}
                           <singDownFile :url="drawerFormData?.allCostCalculateExcelUrl"></singDownFile>
                        </span>
                        <span v-else>-</span>
                    </div>
                    <template v-if="route.query.procType!='bulk_order'">
                        <div>设计服务费</div>
                        <div class="everyRaw">
                            <span class="alignRight">设计服务费：</span>
                            <span v-if="contractTask?.cost_structure">{{ showMoney(contractTask?.cost_structure?.designTaxInclusiveCostFee) }} </span>
                            <span v-else>-</span>
                        </div>
                    </template>
                    
                    <div>打样成本</div>
                    <div class="info-box" v-for="(item,i) in proofList" :key="i">
                        <div class="info-head">打样工单号：{{ item.businessKey }}</div>
                        <el-form :model="item" label-width="160px" >
                            <el-form-item label="品类:">
                                <span>{{ item.goodsName || '-'}}</span>
                            </el-form-item>
                            <el-form-item label="打样数量:">
                                <span>{{ item.proofingQuantity || '-'}}</span>
                            </el-form-item>
                            <el-form-item label="供应商打样费:">
                                <span>{{ showMoney(item.supplierProofingTaxInclusiveFee)}}<span v-if="item.supplierProofingTaxInclusiveFee">(含税)</span></span>
                            </el-form-item>
                            <el-form-item label="打样成本核算表:">
                                <div style="word-break: break-all;">
                                    <span>{{ item.supplierCostCalculateExcelName || '-'}}</span>
                                    <singDownFile :url="item.supplierCostCalculateExcelUrl" v-hasPermi="['@downFile']"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="打样物流费:">
                                <span>{{ showMoney(item.logisticsTaxInclusiveFee) }}<span v-if="item.logisticsTaxInclusiveFee">(含税)</span></span>
                            </el-form-item> 
                            <el-form-item label="打样物流单据:">
                                <div style="word-break: break-all;">
                                    <span>{{ item.logisticsDocumentsName || '-' }}</span>
                                    <singDownFile :url="item.logisticsDocumentsUrl" v-hasPermi="['@downFile']"/>
                                </div>
                            </el-form-item> 
                        </el-form>
                    </div>
                    <div style="margin-top: 20px;">大货成本</div>
                    <div class="info-box" v-for="(item,i) in bulkList" :key="i">
                        <div class="info-head">大货工单号：{{ item.bulkBusinessKey }}</div>
                        <el-form :model="item" label-width="160px" >
                            <el-form-item label="品类:">
                                <span>{{ item.goodsName || '-'}}</span>
                            </el-form-item>
                            <el-form-item label="大货生产数量:">
                                <span>{{ item.bulkProdQuantity || '-'}}</span>
                            </el-form-item>
                            <el-form-item label="大货生产费:">
                                <span>{{ showMoney(item.bulkProdTaxInclusiveFee) }}<span v-if="item.bulkProdTaxInclusiveFee">(含税)</span></span>
                            </el-form-item>
                            <el-form-item label="大货物流费(预估):">
                                <span>{{ showMoney(item.bulkLogisticsTaxInclusiveFee)}}<span v-if="item.bulkLogisticsTaxInclusiveFee">(含税)</span></span>
                            </el-form-item>
                            <el-form-item label="大货成本核算表(预估):">
                                <div style="word-break: break-all;">
                                    <span>{{ item.costCalculateExcelName || '-'}}</span>
                                    <singDownFile :url="item.costCalculateExcelUrl" v-hasPermi="['@downFile']"/>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="programDesign" v-show="taskDefKey == 'bulk_contract'">
                    <div class="everyRaw">
                        <span class="alignRight">合同/采购单：</span>
                        <span v-if="contractTask?.bulk_contract" style="flex: 1;word-break: break-all;">
                            <span style="margin-right: 10px;">{{ contractTask?.bulk_contract?.bulkContractName ||'-' }}</span>
                            <singDownFile :url="contractTask?.bulk_contract?.bulkContractUrl" v-hasPermi="['@downFile']"></singDownFile>
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">合同编码：</span>
                        <span v-if="contractTask?.bulk_contract" style="flex: 1;">{{ contractTask?.bulk_contract?.bulkContractNo  || '-'}} </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">合同总价：</span>
                        <span v-if="contractTask?.bulk_contract" style="flex: 1;">
                            <span v-if="contractTask?.bulk_contract?.contractTaxInclusiveTotalPrice||contractTask?.bulk_contract?.contractTaxInclusiveTotalPrice===0">{{ showMoney(contractTask?.bulk_contract?.contractTaxInclusiveTotalPrice)  }}</span>
                            <span v-else>-</span>
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">税金：</span>
                        <span v-if="contractTask?.bulk_contract" style="flex: 1;">
                            <span v-if="contractTask?.bulk_contract?.contractTaxes||contractTask?.bulk_contract?.contractTaxes===0">{{ showMoney(contractTask?.bulk_contract?.contractTaxes) }}</span>
                            <span v-else>-</span>
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">预计交货日期：</span>
                        <span v-if="contractTask?.bulk_contract" style="flex: 1;">{{ contractTask?.bulk_contract?.expectedDeliveryDate || '-'}} </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">合同签订日期：</span>
                        <span v-if="contractTask?.bulk_contract" style="flex: 1;">{{ contractTask?.bulk_contract?.contractSignDate || '-'}} </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">首付款比例：</span>
                        <span style="flex: 1;">{{ parseInt(contractTask?.bulk_contract?.firstPaymentRatio*100)||'-'}}% </span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">首付款最晚日期：</span>
                        <span v-if="contractTask?.bulk_contract" style="flex: 1;">{{ contractTask?.bulk_contract?.firstPaymentLatestDate || '-'}} </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">尾款最晚日期：</span>
                        <span v-if="contractTask?.bulk_contract" style="flex: 1;">{{ contractTask?.bulk_contract?.finalPaymentLatestDate || '-'}} </span>
                        <span v-else>-</span>
                    </div>
                    <!-- 驳回记录 -->
                    <div style="margin: 10px" v-if="contractAuditList.length">
                        <div class="recordTxt">驳回记录：</div>
                        <div v-for="(item,i) in contractAuditList" :key="i" class="record">
                            <p>
                                <span class="rightTxt">驳回人：</span>
                                {{item.bulkContractRejectPersonName}}
                            </p>
                            <p>
                                <span class="rightTxt">驳回原因：</span>
                                <span style="word-break:break-all;">{{item.bulkContractRejectReason||'-'}}</span>
                            </p>
                            <p>
                                <span class="rightTxt">驳回时间：</span>
                                {{parseDate(item.bulkContractRejectTime)}}
                            </p>
                            <p style="display: flex;">
                                <span class="rightTxt">合同：</span>
                                <span style="flex: 1;word-break: break-all;">{{item.bulkContractRejectName||'-'}}</span>
                                <singDownFile :url="item.bulkContractRejectUrl" v-hasPermi="['@downFile']"/>
                            </p>
                        </div>
                    </div>
                </div>
                <div v-show="taskDefKey == 'bulk_contract_dept_audit'">
                    <div class="everyRaw">
                        <span class="alignRight">审核状态：</span>
                        <span v-if="contractTask?.bulk_contract_dept_audit" style="flex: 1;">
                            <DictTag style="display: inline-block;" :value="contractTask?.bulk_contract_dept_audit?.contractDeptAuditStatus"
						:options="crm_contract_examine_status" />
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">审核人：</span>
                        <span v-if="contractTask?.bulk_contract_dept_audit&&contractTask?.bulk_contract_dept_audit?.contractDeptAuditPersonName" style="flex: 1;">
                            {{ contractTask?.bulk_contract_dept_audit?.contractDeptAuditPersonName }}
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">审核时间：</span>
                        <span v-if="contractTask?.bulk_contract_dept_audit" style="flex: 1;">
                            {{ parseDate(contractTask?.bulk_contract_dept_audit?.contractDeptAuditTime) }}
                        </span>
                        <span v-else>-</span>
                    </div>
                </div>
                <div v-show="taskDefKey == 'bulk_contract_audit'">
                    <div class="everyRaw">
                        <span class="alignRight">审核状态：</span>
                        <span v-if="contractTask?.bulk_contract_audit" style="flex: 1;">
                            <DictTag style="display: inline-block;" :value="contractTask?.bulk_contract_audit?.bulkContractAuditStatus"
						:options="crm_contract_examine_status" />
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">审核人：</span>
                        <span v-if="contractTask?.bulk_contract_audit&&contractTask?.bulk_contract_audit?.bulkContractAuditPersonName" style="flex: 1;">
                            {{ contractTask?.bulk_contract_audit?.bulkContractAuditPersonName }}
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">审核时间：</span>
                        <span v-if="contractTask?.bulk_contract_audit" style="flex: 1;">
                            {{ parseDate(contractTask?.bulk_contract_audit?.auditBulkContractTime) }}
                        </span>
                        <span v-else>-</span>
                    </div>
                </div>
                <div v-show="taskDefKey == 'before_prod_first_payment_condition'">
                    <div class="red-tips">
                        <el-icon :size="16" class="red-warning"><WarningFilled /></el-icon>
                        <span>需先支付合同金额{{parseInt(orderDetail.firstPaymentRatio*100)||'30'}}%的款项才能进行大货设计与生产。可在订单中新建支付单</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">合计已支付金额：</span>
                        <span v-if="contractTask?.before_prod_first_payment_condition" style="flex: 1;">
                            <span>{{ showMoney(drawerFormData.paidAmount) }}</span> 
                            <span>（{{ ~~((drawerFormData.paidAmount*1/drawerFormData.contractTaxInclusiveTotalPrice*1)*100) }}%）</span>
                            <!-- {{drawerFormData?.paidAmountRate}}% -->
                        </span>
                        <span v-else>-</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getBulkContractOrderProc } from "@/api/crm/order/detail"
import {getdesignservicecontractid } from "@/api/crm/order/contract"
import { useRoute } from 'vue-router'
import singDownFile from "@/components/singDownFile"
import crmProcStore from "@/store/modules/crmProc"
import { parseDate } from "@/utils/index"
const proc = crmProcStore()
const props = defineProps({
    orderDetail: {
        type: Object,
        default: {}
    },
})
// const data = reactive({
//     drawerFormData:{}
// })
const { proxy } = getCurrentInstance()
const {
    crm_ContractPaginationStatus,
    crm_contract_examine_status
} = proxy.useDict(
    "crm_ContractPaginationStatus",
    "crm_contract_examine_status"
)
const { orderDetail } = toRefs(props)
const taskDefKey = ref('cost_structure')
const data = reactive({
    contractTask:{
        cost_structure:null,
        bulk_contract:null,
        bulk_contract_dept_audit:null,
        bulk_contract_audit:null,
        before_prod_first_payment_condition:null,
    }
})
const { contractTask } = toRefs(data)
const contractAuditList = ref([])//驳回记录
// const { drawerFormData } = toRefs(data)
const processList = ref([
    {
        name:'成本构成',
        id:1,
        taskDefKey:'cost_structure'
    },
    {
        name:'大货合同',
        id:2,
        taskDefKey:'bulk_contract'
    },
    {
        name:'大货合同部门审核',
        id:3,
        taskDefKey:'bulk_contract_dept_audit'
    },
    {
        name:'大货合同财务审核',
        id:4,
        taskDefKey:'bulk_contract_audit'
    },
    {
        name:'生产前首付款条件',
        id:5,
        taskDefKey:'before_prod_first_payment_condition'
    },
])
const stepProcess = ref(0)
const route = useRoute()
const drawerFormData = computed(()=>proc.contract)
const proofList = computed(()=>proc.proof)
const bulkList = computed(()=>proc.valuation)
function getDetail(){
    if (!route.query.id) {
        return
    }
    proc.getProof(route.query.id, { orderType: orderDetail.value.procType })
    proc.getValuation(route.query.id, { orderType: orderDetail.value.procType })
    proc.getContract(route.query.id, { orderType: orderDetail.value.procType }).then(()=>{
        stepProcess.value = processList.value.findIndex(item=>{return item.taskDefKey==drawerFormData.value.taskList[drawerFormData.value.taskList.length-1].taskDefKey})
        setProcessList()
        // stepProcess.value = drawerFormData.value.taskList.length - 1
        contractHistory(drawerFormData.value.id)
    })
}
getDetail()
function setStepIndex(key){
    taskDefKey.value = key
}

//把后端返回的list根据taskDefKey赋值给contractTask对应的流程(key)
function setProcessList(){
    processList.value.map(item=>{
        let obj = drawerFormData.value.taskList.find(data=>{return data.taskDefKey===item.taskDefKey})
        if (obj) {
            contractTask.value[item.taskDefKey] = obj
        }
    })
    taskDefKey.value = drawerFormData.value.taskList[drawerFormData.value.taskList.length-1].taskDefKey
}
//设计方案驳回记录
function contractHistory(id) {
	getdesignservicecontractid(id).then(res=>{
		if (res.code == 200) {
			contractAuditList.value = res.data
		}
	})
}
</script>

<style lang="scss" scoped>
.record,.info-box{
    border: #d7d7d7 1px solid;
    width: 600px;
    border-radius: 6px;
    margin-top: 10px;
    padding:0 10px;
}
.info-box{
    padding: 0;
}
.info-head{
    border-bottom: #d7d7d7 1px solid;
    padding: 10px 20px;
}
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
    display: flex;
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
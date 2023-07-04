<template>
    <div class="processContent">
        <ul class="steps">
            <li v-for="(e, i) in processList" :key="e.id" :class="stepIndex == i ? 'active' : ''"
                @click="stepIndex = i">
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
            <div v-show="stepIndex == 0">
                <div>对账单</div>
                <div class="everyRaw">
                    <span class="alignRight">对账单:</span>
                    <span v-if="drawerFormData?.taskList?.length" style="word-break: break-all;">
                        {{ drawerFormData?.taskList[0]?.generalAccountStatementName || '-' }}
                        <singDownFile :url="drawerFormData?.taskList[0]?.generalAccountStatementUrl"></singDownFile>
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">订单总价:</span>
                    <span v-if="drawerFormData?.taskList?.length">
                        {{ showMoney(drawerFormData?.taskList[0]?.orderTaxInclusiveTotalPrice) || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">尾款最晚日期:</span>
                    <span>
                        {{ drawerFormData?.performancePaymentRecord?.finalPaymentLatestDate || '-' }}
                    </span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">备注:</span>
                    <span v-if="drawerFormData?.taskList?.length" style="word-break: break-all;">
                        {{ drawerFormData?.taskList[0]?.submitGeneralAccountStatementRemark || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
                <template v-if="generalStatementHistory.length">
                    <div style="margin-bottom: 10px;">驳回记录</div>
                    <div v-for="item in generalStatementHistory" :key="item.id" class="record-item">
                        <div class="everyRaw">
                            <span class="alignRight">驳回人:</span>
                            <span>
                                {{ item.submitGeneralAccountStatementRejecterName || '-' }}
                            </span>
                        </div>
                        <div class="everyRaw">
                            <span class="alignRight">驳回原因:</span>
                            <span style="word-break:break-all;">
                                {{ item.submitGeneralAccountStatementRejectReason || '-' }}
                            </span>
                        </div>
                        <div class="everyRaw">
                            <span class="alignRight">驳回时间:</span>
                            <span>
                                {{ parseDate(item.submitGeneralAccountStatementRejectTime) || '-' }}
                            </span>
                        </div>
                        <div class="everyRaw">
                            <span class="alignRight">对账单:</span>
                            <span style="word-break: break-all;">
                                {{ item.submitGeneralAccountStatementRejectName || '-' }}
                                <singDownFile :url="item.submitGeneralAccountStatementRejectUrl"></singDownFile>
                            </span>
                        </div>
                    </div>
                </template>
            </div>
            <div v-show="stepIndex == 1">
                <div class="everyRaw">
                    <span class="alignRight">审核状态：</span>
                    <span v-if="drawerFormData.taskList?.length>1">
                        <DictTag style="display: inline-block;" :value="drawerFormData?.taskList[1]?.accountStatementAuditStatus"
                    :options="crm_contract_examine_status" />
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">审核时间：</span>
                    <span v-if="drawerFormData.taskList?.length>1">
                        {{parseDate(drawerFormData?.taskList[1]?.accountStatementAuditTime)||'-'}}
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <div v-show="stepIndex == 2">
                <div class="everyRaw">
                    <span class="alignRight">是否通过：</span>
                    <span v-if="drawerFormData.taskList?.length>2">
                        <DictTag style="display: inline-block;" :value="drawerFormData?.taskList[2]?.customerConfirmStatus"
                    :options="crm_customer_confirm_status" />
                    </span>
                    <span v-else>-</span>
                </div>
                <template v-if="customerConfirmsRecord.length">
                    <div style="margin-bottom: 10px;">审核记录</div>
                    <div v-for="item in customerConfirmsRecord" :key="item.id" class="record-item">
                        <div class="everyRaw">
                            <span class="alignRight">是否通过:</span>
                            <span>
                                <DictTag style="display: inline-block;" :value="item?.customerConfirmStatus"
                    :options="crm_customer_confirm_status" />
                            </span>
                        </div>
                        <div v-if="item.customerConfirmStatus=='3'" class="everyRaw">
                            <span class="alignRight">备注原因:</span>
                            <span style="word-break:break-all;">
                                {{ item.customerConfirmRejectReason || '-' }}
                            </span>
                        </div>
                        <div v-if="item.customerConfirmStatus=='2'" class="everyRaw">
                            <span class="alignRight">客户确认凭证:</span>
                            <span style="word-break: break-all;">{{ item.customerConfirmCertificateName || '-' }}</span>
                            <singDownFile :url="item.customerConfirmCertificateUrl"/>
                        </div> 
                        <div class="everyRaw">
                            <span class="alignRight">审核时间:</span>
                            <span>
                                {{ parseDate(item.customerConfirmTime) || '-' }}
                            </span>
                        </div>
                    </div>
                </template>
            </div>
            <div v-show="stepIndex == 3">
                <div class="everyRaw">
                    <span class="alignRight">订单总价：</span>
                    <span>
                        {{ showMoney(drawerFormData.orderTaxInclusiveTotalPrice) || '-'}}
                    </span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">合计已付：</span>
                    <span>
                        {{ showMoney(drawerFormData.performancePaymentRecord?.paidAmount) || '-'}}
                    </span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">首付最晚日期：</span>
                    <span>
                        {{ drawerFormData.performancePaymentRecord?.firstPaymentLatestDate || '-'}}
                    </span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">尾款最晚日期：</span>
                    <span>
                        {{ drawerFormData.performancePaymentRecord?.finalPaymentLatestDate || '-'}}
                    </span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">拖欠首付款：</span>
                    <span>
                        {{ drawerFormData.performancePaymentRecord?.defaultFirstPayment?'是':'否'}}
                    </span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">拖欠尾款：</span>
                    <span>
                        {{ drawerFormData.performancePaymentRecord?.defaultFinalPayment?'是':'否'}}
                    </span>
                </div>
                <template v-if="accountPaymentRecord.length">
                    <div style="margin-bottom: 10px;">驳回记录</div>
                    <div v-for="item in accountPaymentRecord" :key="item.id" class="record-item">
                        <!-- <div class="everyRaw">
                            <span class="alignRight">是否通过:</span>
                            <span v-if="item.financialAuditStatus">
                                <DictTag style="display: inline-block;" :value="item?.financialAuditStatus" :options="crm_customer_confirm_status" />
                            </span>
                            <span v-else>-</span>
                        </div> -->
                        <div class="everyRaw">
                            <span class="alignRight">备注原因:</span>
                            <span style="word-break:break-all;">
                                {{ item.paymentRejectReason || '-' }}
                            </span>
                        </div>
                        <div class="everyRaw">
                            <span class="alignRight">审核时间:</span>
                            <span>
                                {{ parseDate(item.paymentRejectTime) || '-' }}
                            </span>
                        </div>
                    </div>
                </template>
            </div>
            <div v-show="stepIndex == 4">
                <div class="everyRaw">
                    <span class="alignRight">确认状态：</span>
                    <span v-if="drawerFormData.taskList?.length>4">
                        <DictTag style="display: inline-block;" :value="drawerFormData?.taskList[4]?.financialAuditStatus"
                                :options="crm_customer_confirm_status" />
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">确认时间：</span>
                    <span v-if="drawerFormData.taskList?.length>4">
                        {{parseDate(drawerFormData?.taskList[4]?.financialAuditTime)|| '-'}}
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import singDownFile from "@/components/singDownFile"
import crmProcStore from "@/store/modules/crmProc"
import { parseDate } from "@/utils/index"
import { getSubmitGeneralAccountStatement,getAccountCustomerConfirmsRecord,getAccountPaymentRecord } from "@/api/crm/order/detail";
const proc = crmProcStore()
const props = defineProps({
    orderDetail: {
        type: Object,
        default: {}
    },
})
const generalStatementHistory = ref([])
const customerConfirmsRecord = ref([])
const accountPaymentRecord = ref([])
const { orderDetail } = toRefs(props)
const { proxy } = getCurrentInstance()
const {
    crm_contract_examine_status,
    crm_customer_confirm_status
} = proxy.useDict(
    "crm_contract_examine_status",
    "crm_customer_confirm_status"
)
const route = useRoute()
const processList = ref([
    {
        name: '提交总对账单',
        id: 1
    },
    {
        name: '对账单审核',
        id: 2
    },
    {
        name: '对账单客户确认',
        id: 3
    },
    {
        name: '付款进度',
        id: 4
    },
    {
        name: '订单确认',
        id: 5
    },
])
const stepIndex = ref(0)
const stepProcess = ref(0)
const drawerFormData = computed(() => proc.payment)
function getDetail() {
    if (!route.query.id) {
        return
    }
    proc.getPayment(route.query.id, { orderType: orderDetail.value.procType }).then(()=>{
        stepIndex.value = drawerFormData.value.taskList.length - 1
        stepProcess.value = drawerFormData.value.taskList.length - 1
        getGeneralStatementHistory(drawerFormData.value.id)
        if (drawerFormData.value.taskList.length>2) {
            getCustomerConfirmsRecord(drawerFormData.value.id)
        }
        if (drawerFormData.value.taskList.length>3) {
            getPaymentRecord(drawerFormData.value.id)
        }
    })
}
getDetail()
//查询提交总对账单节点驳回记录
function getGeneralStatementHistory(id){
    getSubmitGeneralAccountStatement(id).then(res=>{
        if (res.code==200) {
            generalStatementHistory.value = res.data
        }
    })
}
//查询对账单客户确认审核记录
function getCustomerConfirmsRecord(id){
    getAccountCustomerConfirmsRecord(id).then(res=>{
        if (res.code==200) {
            customerConfirmsRecord.value = res.data
        }
    })
}
//查询履约付款(付款进度)驳回记录
function getPaymentRecord(id){
    getAccountPaymentRecord(id).then(res=>{
        if (res.code==200) {
            accountPaymentRecord.value = res.data
        }
    })
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
    margin-right: 10px;
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

.submit {
    text-align: right;
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
.record-item{
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
}
</style>
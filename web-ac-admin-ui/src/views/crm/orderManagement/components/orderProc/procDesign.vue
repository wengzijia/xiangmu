<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane v-for="(item, index) in drawerFormData" :key="index" :label="'大货工单号：' + item.bulkBusinessKey"
                :name="index">
                <div style="display: flex;">
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
                        <div v-show="taskDefKey == 'supplier_contract'">
                            <div>大货工单号：{{ item.bulkBusinessKey }}</div>
                            <div class="everyRaw">
                                <span class="alignRight">供应商合同:</span>
                                <span>
                                    <span style="word-break: break-all;">{{designTask.supplier_contract?.supplierContractName || '-' }}</span>
                                    <singDownFile :url="designTask.supplier_contract?.supplierContractUrl"  v-hasPermi="['@downFile']"></singDownFile>
                                </span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">供应商合同货期:</span>
                                <span>
                                    {{designTask.supplier_contract?.supplierContractDeliveryDate || '-' }}
                                </span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">上传时间:</span>
                                <span v-if="designTask.supplier_contract">
                                    {{ parseDate(designTask.supplier_contract?.supplierContractUploadTime) || '-' }}
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">上传人:</span>
                                <span v-if="designTask.supplier_contract">
                                    {{ designTask.supplier_contract?.supplierContractUploaderName || '-' }}
                                </span>
                                <span v-else>-</span>
                            </div>
                        </div>
                        <div v-show="taskDefKey == 'supplier_contract_dept_audit'">
                            <div>大货工单号：{{ item.bulkBusinessKey }}</div>
                            <div class="everyRaw">
                                <span class="alignRight">审核状态：</span>
                                <span v-if="designTask.supplier_contract_dept_audit?.contractDeptAuditStatus">
                                    <DictTag style="display: inline-block;" :value="designTask.supplier_contract_dept_audit?.contractDeptAuditStatus"
                                :options="crm_contract_examine_status" />
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">审核人：</span>
                                <span v-if="designTask.supplier_contract_dept_audit">
                                    {{ designTask.supplier_contract_dept_audit?.contractDeptAuditPersonName ||'-'}}
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">审核时间：</span>
                                <span v-if="designTask.supplier_contract_dept_audit">
                                    {{ parseDate(designTask.supplier_contract_dept_audit?.contractDeptAuditTime) }}
                                </span>
                                <span v-else>-</span>
                            </div>
                        </div>
                        <div v-show="taskDefKey == 'supplier_contract_audit'">
                            <div>大货工单号：{{ item.bulkBusinessKey }}</div>
                            <div class="everyRaw">
                                <span class="alignRight">审核状态：</span>
                                <span v-if="designTask.supplier_contract_audit?.supplierContractAuditStatus">
                                    <DictTag style="display: inline-block;" :value="designTask.supplier_contract_audit?.supplierContractAuditStatus"
                                :options="crm_contract_examine_status" />
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">审核人：</span>
                                <span v-if="designTask.supplier_contract_audit">
                                    {{ designTask.supplier_contract_audit?.supplierContractAuditerName  ||'-'}}
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">审核时间：</span>
                                <span v-if="designTask.supplier_contract_audit">
                                    {{ parseDate(designTask.supplier_contract_audit?.supplierContractAuditTime) }}
                                </span>
                                <span v-else>-</span>
                            </div>
                        </div>
                        <div v-show="taskDefKey == 'bulk_file_design'">
                            <div class="everyRaw">
                                <span class="alignRight">品类：</span>
                                <span v-if="designTask.bulk_file_design">
                                    {{designTask.bulk_file_design?.goodsName || '-'}}
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">大货生产数量：</span>
                                <span v-if="designTask.bulk_file_design">
                                    {{ designTask.bulk_file_design?.bulkProdQuantity || '-'}}
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">设计状态：</span>
                                <span v-if="designTask.bulk_file_design">
                                    {{ designTask.bulk_file_design?.taskCategoryList&&designTask.bulk_file_design?.taskCategoryList[0]?.bulkDesignFileUrl?'已提交':'待提交'}}
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">大货设计文件：</span>
                                <div v-if="designTask.bulk_file_design" style="display: inline-block;">
                                    <div v-for="e in designTask.bulk_file_design?.taskCategoryList">
                                        <span style="word-break: break-all;">{{ e.bulkDesignFileName || '-'}}</span>
                                        <singDownFile :url="e.bulkDesignFileUrl" />
                                    </div>
                                    <span v-if="!designTask.bulk_file_design.taskCategoryList?.length">-</span>
                                </div>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">提交时间：</span>
                                <span v-if="designTask.bulk_file_design">
                                    {{ parseDate(designTask.bulk_file_design?.bulkFileDesignSubmitTime) || '-'}}
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">供应链专员：</span>
                                <span v-if="designTask.bulk_file_design">
                                    {{ item?.supplyChainSpecialistName || '-'}}
                                </span>
                                <span v-else>-</span>
                            </div>
                        </div>
                        <div v-show="taskDefKey == 'customer_confirms_bulk_file_design'">
                            <div class="everyRaw">
                                <span class="alignRight">确认状态：</span>
                                <span v-if="designTask.customer_confirms_bulk_file_design">
                                    <!-- {{ design?.taskList[3]?.customerConfirmsStatus }} -->
                                    <DictTag style="display: inline-block;" :value="designTask.customer_confirms_bulk_file_design?.customerConfirmsStatus"
                                :options="crm_customer_confirm_status" />
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">确认凭证：</span>
                                <span v-if="designTask.customer_confirms_bulk_file_design?.customerConfirmCertificateUrl" style="word-break: break-all;flex: 1;">
                                    {{ designTask.customer_confirms_bulk_file_design?.customerConfirmCertificateName }} 
                                    <singDownFile :url="designTask.customer_confirms_bulk_file_design?.customerConfirmCertificateUrl" />
                                    <!-- <el-link v-if="design?.taskList[3]?.customerConfirmCertificateUrl" :href="BASE_FILE_URL+design?.taskList[3]?.customerConfirmCertificateUrl">下载</el-link> -->
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="everyRaw">
                                <span class="alignRight">确认时间：</span>
                                <span v-if="designTask.customer_confirms_bulk_file_design" style="flex: 1;">
                                    {{ parseDate(designTask.customer_confirms_bulk_file_design?.customerConfirmsTime) }}
                                </span>
                                <span v-else>-</span>
                            </div>
                            <!-- 审核记录 -->
                            <div style="margin: 10px" v-if="auditList[index]?.length">
                                <div class="recordTxt">审核记录</div>
                                <div v-for="(item,i) in auditList[index]" :key="i" class="record">
                                    <div>
                                        <p style="display: flex;">
                                            <span class="rightTxt">是否通过：</span>
                                            <DictTag style="display: inline-block;" :value="item.customerConfirmsStatus"
                                            :options="crm_customer_confirm_status" />
                                        </p>
                                        <p v-if="item.customerConfirmsStatus==3" style="display: flex;">
                                            <span class="rightTxt">备注原因：</span>
                                            <span style="word-break:break-all;flex: 1;">{{item.customerConfirmsRejectReason||'-'}}</span>
                                        </p>
                                        <p v-if="item.customerConfirmsStatus==2" style="display: flex;">
                                            <span class="rightTxt">确认凭证：</span>
                                            <span style="flex: 1;">
                                                <span style="word-break: break-all;">{{ item.customerConfirmCertificateName }}</span>
                                                <singDownFile :url="item.customerConfirmCertificateUrl" />
                                            </span>
                                        </p>
                                        <p style="display: flex;">
                                            <span class="rightTxt">审核时间：</span>
                                            <span style="flex: 1;">{{parseDate(item.customerConfirmsTime)}}</span>
                                        </p>  
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { getBulkDesignOrderProc } from "@/api/crm/order/detail"
import { useRoute } from 'vue-router'
import singDownFile from "@/components/singDownFile"
import crmProcStore from "@/store/modules/crmProc"
import { parseDate } from "@/utils/index"
import { bulkConfirmsHistory } from "@/api/crm/supplyChain/production"
const proc = crmProcStore()
const props = defineProps({
    orderDetail: {
        type: Object,
        default: {}
    },
})
const { proxy } = getCurrentInstance()
const {
    crm_contract_examine_status,
    crm_customer_confirm_status,
    crm_design_status
} = proxy.useDict(
    "crm_contract_examine_status",
    "crm_customer_confirm_status",
    "crm_design_status"
)
const processList = ref([
    {
        name: '供应商合同',
        id: 1,
        taskDefKey:'supplier_contract'
    },
    {
        name: '供应商合同部门审核',
        id: 2,
        taskDefKey:'supplier_contract_dept_audit'
    },
    {
        name: '供应商合同财务审核',
        id: 2,
        taskDefKey:'supplier_contract_audit'
    },
    {
        name: '大货文件设计',
        id: 3,
        taskDefKey:'bulk_file_design'
    },
    {
        name: '客户确认大货文件设计',
        id: 4,
        taskDefKey:'customer_confirms_bulk_file_design'
    },
])
const stepProcess = ref(0)
const { orderDetail } = toRefs(props)
const route = useRoute()
const activeName = ref(0)
const drawerFormData = computed(() => proc.design)
const taskDefKey = ref('supplier_contract')
const data = reactive({
    designTask:{
        supplier_contract:null,
        supplier_contract_dept_audit:null,
        supplier_contract_audit:null,
        bulk_file_design:null,
        customer_confirms_bulk_file_design:null,
    }
})
const { designTask } = toRefs(data)
watch(activeName,(val)=>{
    setProcessList(val)
})
function getDetail() {
    if (!route.query.id) {
        return
    }
    proc.getDesign(route.query.id, { orderType: orderDetail.value.procType }).then(async ()=>{
        // stepIndex.value = drawerFormData.value[0].taskList.length - 1
        // stepProcess.value = drawerFormData.value[0].taskList.length - 1
        await getHistory()
        setProcessList(0)
    })
}
getDetail()
function setStepIndex(key){
    taskDefKey.value = key
}

function setProcessList(i){
    processList.value.map(item=>{
        let obj = drawerFormData.value[i].taskList.find(data=>{return data.taskDefKey===item.taskDefKey})
        if (obj) {
            if (item.taskDefKey=='customer_confirms_bulk_file_design') {
                obj.history =  auditList.value[i]
            }
            designTask.value[item.taskDefKey] = obj
        }
    })
    stepProcess.value = processList.value.findIndex(item=>{return item.taskDefKey==drawerFormData.value[i].taskList[drawerFormData.value[i].taskList.length-1].taskDefKey})
    taskDefKey.value = drawerFormData.value[i].taskList[drawerFormData.value[i].taskList.length-1].taskDefKey
}
const auditList = ref([])
//客户确认设计方案审核记录
function getHistory(){
    drawerFormData.value.map((item,i)=>{
        if (item.taskList.find(data=>{return data.taskDefKey==='customer_confirms_bulk_file_design'})) {
            bulkConfirmsHistory(item.bulkQuoteId).then(res=>{
                if (res.code==200) {
                    auditList.value[i] = res.data
                }
            })
        }else{
            auditList.value[i] = ''
        }
    })
    
}
</script>

<style lang="scss" scoped>
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
.record{
    border: #d7d7d7 1px solid;
    width: 600px;
    border-radius: 6px;
    margin-top: 10px;
    margin-left: 30px;
    padding:0 10px;
}
.rightTxt{
    width: 100px;
    text-align: right;
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
</style>
<template>
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
            <!-- 设计服务合同 -->
            <div v-show="taskDefKey == 'design_service_contract'">
                <div>设计服务合同</div>
                <div class="everyRaw">
                    <span class="alignRight">设计服务合同:</span>
                    <span v-if="designTask.design_service_contract" style="flex: 1;">
                        {{ designTask.design_service_contract?.designServiceContractName || '-' }}
                        <singDownFile :url="designTask.design_service_contract?.designServiceContractUrl"  style="margin-left: 10px;"/>
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">合同编号:</span>
                    <span v-if="designTask.design_service_contract" style="flex: 1;">
                        {{ designTask.design_service_contract?.designServiceContractNo || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">设计服务费:</span>
                    <span v-if="designTask.design_service_contract" style="flex: 1;">
                        <span v-if="designTask.design_service_contract?.designServiceTaxInclusiveFee||designTask.design_service_contract?.designServiceTaxInclusiveFee===0" style="margin-right: 10px;">{{ showMoney(drawerFormData.taskList[0].designServiceTaxInclusiveFee)}}</span>
                        <span v-else style="margin-right: 10px;">-</span>
                        <el-tooltip v-if="designTask.design_service_contract?.designServiceTaxInclusiveFee" :content="`${route.query.procType=='project_design_order'?'与客户签订最终成交全额，':''}包含设计、打样费用(不包含物流费，含税)`" placement="top">
                            <el-icon color="#b3b3b3" :size="18" style="vertical-align: middle;margin-top: -2px;">
                                <WarningFilled ></WarningFilled>
                            </el-icon>
                        </el-tooltip>
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">税金:</span>
                    <span v-if="designTask.design_service_contract&&(designTask.design_service_contract?.designServiceTaxes||designTask.design_service_contract?.designServiceTaxes===0)" style="flex: 1;">
                        {{ showMoney(designTask.design_service_contract?.designServiceTaxes) }}
                    </span>
                    <span v-else>-</span>
                </div>
                <!-- 驳回记录 -->
                <div style="margin: 10px" v-if="contractAuditList.length">
                    <div class="recordTxt">驳回记录：</div>
                    <div v-for="(item,i) in contractAuditList" :key="i" class="record">
                        <p>
                            <span class="rightTxt">驳回人：</span>
                            {{item.designServiceContractRejectPersonName}}
                        </p>
                        <p>
                            <span class="rightTxt">驳回原因：</span>
                            <span style="word-break:break-all;">{{item.designServiceContractRejectReason}}</span>
                        </p>
                        <p>
                            <span class="rightTxt">驳回时间：</span>
                            {{parseDate(item.designServiceContractRejectTime)}}
                        </p>
                        <p>
                            <span class="rightTxt">合同：</span>
                            <span>{{item.designServiceContractRejectName}}</span>
                            <singDownFile :url="item.designServiceContractRejectUrl"/>
                            <!-- <el-link :href="BASE_FILE_URL+item.supplierContractUrl" target="_blank" class="download">下载</el-link> -->
                        </p>
                    </div>
                </div>
            </div>
            <!-- 设计服务合同部门审核 -->
            <div v-show="taskDefKey == 'design_service_contract_dept_audit'">
                <div class="everyRaw">
                    <span class="alignRight">审核状态：</span>
                    <span v-if="designTask.design_service_contract_dept_audit?.contractDeptAuditStatus" style="flex: 1;">
                        <DictTag style="display: inline-block;"
                            :value="designTask.design_service_contract_dept_audit?.contractDeptAuditStatus"
                            :options="crm_contract_examine_status" />
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">审核人：</span>
                    <span v-if="designTask.design_service_contract_dept_audit" style="flex: 1;">
                        {{ designTask.design_service_contract_dept_audit?.contractDeptAuditPersonName || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">审核时间：</span>
                    <span v-if="designTask.design_service_contract_dept_audit" style="flex: 1;">
                        {{ parseDate(designTask.design_service_contract_dept_audit?.contractDeptAuditTime) || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <!-- 设计服务合同财务审核 -->
            <div v-show="taskDefKey == 'design_service_contract_audit'">
                <div class="everyRaw">
                    <span class="alignRight">审核状态：</span>
                    <span v-if="designTask.design_service_contract_audit?.designServiceContractAuditStatus" style="flex: 1;">
                        <DictTag style="display: inline-block;"
                            :value="designTask.design_service_contract_audit?.designServiceContractAuditStatus"
                            :options="crm_contract_examine_status" />
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">审核人：</span>
                    <span v-if="designTask.design_service_contract_audit" style="flex: 1;">
                        {{ designTask.design_service_contract_audit?.designServiceContractAuditPersonName || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">审核时间：</span>
                    <span v-if="designTask.design_service_contract_audit" style="flex: 1;">
                        {{ parseDate(designTask.design_service_contract_audit?.auditDesignServiceContractTime) || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <!-- 设计师接单 -->
            <div v-show="taskDefKey == 'designer_take_orders'">
                <div class="everyRaw">
                    <span class="alignRight">接单设计师：</span>
                    <span v-if="designTask.designer_take_orders" style="flex: 1;">
                        {{ drawerFormData?.designerName || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">接单时间：</span>
                    <span v-if="designTask.designer_take_orders" style="flex: 1;">
                        {{ parseDate(drawerFormData?.receiveTime) || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
            </div>
            <!-- 提交设计方案 -->
            <div v-show="taskDefKey == 'submit_design_proposal'">
                <div class="everyRaw">
                    <span class="alignRight">提交时间：</span>
                    <span v-if="designTask.submit_design_proposal" style="flex: 1;">
                        {{ parseDate(designTask.customer_confirms_design_proposal?.submitCustomerConfirmTime) || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
                <template v-if="designTask.submit_design_proposal">
                    <div v-for="(item, i) in designTask.submit_design_proposal?.taskCategoryList" :key="i">
                        <el-tabs v-model="tabs" class="demo-tabs">
                            <el-tab-pane :label="item.goodsName" name="1"></el-tab-pane>
                        </el-tabs>
                        <div class="everyRaw" style="display: flex;">
                            <span class="alignRight">设计文件：</span>
                            <div v-if="item.designFileName" style="display: block;flex: 1;">
                               <span v-for="(url,index) in item.designFileUrl.split(',')" :key="index">
                                    <span style="word-break: break-all;">{{ getFileName(url) || '-' }}</span>
                                    <singDownFile :url="url"  style="margin-left: 10px;"/>
                                    <br/>
                                </span> 
                            </div>
                            <span v-else>-</span>
                        </div>
                        <div class="everyRaw">
                            <span class="alignRight" style="display: inline-block;min-width: 130px;">设计需求：</span>
                            <div v-if="item.designRequirementRtf" style="flex: 1;">
                                <!-- <div>{{ item.goodsName }}：</div> -->
                                <div v-html="item.designRequirementRtf" @click="imgViewer" style="word-break: break-all;"></div>
                                <div v-if="item.designRequirementAttachment" style="margin-top: 10px;display: flex;align-items: center;">
                                    <span>附件:</span>
                                    <span style="word-break: break-all;">{{ getFileName(item.designRequirementAttachment) }}</span>
                                    <singDownFile :url="item.designRequirementAttachment"  style="margin-left: 10px;"/>
                                </div>
                            </div>
                            <span v-else>-</span>
                        </div>
                    </div>
                </template>
            </div>
            <!-- 客户确认设计方案 -->
            <div v-show="taskDefKey == 'customer_confirms_design_proposal'">
                <div class="everyRaw">
                    <span class="alignRight">确认状态：</span>
                    <span v-if="designTask.customer_confirms_design_proposal" style="flex: 1;">
                        <DictTag style="display: inline-block;" :value="designTask.customer_confirms_design_proposal?.customerConfirmStatus"
                            :options="crm_customer_confirm_status" />
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">确认凭证：</span>
                    <span v-if="designTask.customer_confirms_design_proposal&&designTask.customer_confirms_design_proposal?.customerConfirmCertificateUrl" style="word-break: break-all;flex: 1;">
                        {{ designTask.customer_confirms_design_proposal?.customerConfirmCertificateName }}
                        <singDownFile :url="designTask.customer_confirms_design_proposal?.customerConfirmCertificateUrl" />
                    </span>
                    <span v-else>-</span>
                </div>
                <div class="everyRaw">
                    <span class="alignRight">确认时间：</span>
                    <span v-if="designTask.customer_confirms_design_proposal" style="flex: 1;">
                        {{ parseDate(designTask.customer_confirms_design_proposal?.customerConfirmTime) || '-' }}
                    </span>
                    <span v-else>-</span>
                </div>
                <!-- 审核记录 -->
                <div style="margin: 10px" v-if="auditList?.length">
                    <div class="recordTxt">审核记录</div>
                    <div v-for="(item,i) in auditList" :key="i" class="record">
                        <div>
                            <p style="display: flex;">
                                <span class="rightTxt">是否通过：</span>
                                <DictTag style="display: inline-block;flex: 1;" :value="item.customerConfirmStatus"
                                :options="crm_customer_confirm_status" />
                            </p>
                            <p v-if="item.customerConfirmStatus==3" style="display: flex;">
                                <span class="rightTxt">备注原因：</span>
                                <span style="word-break:break-all;flex: 1;">{{item.submitDesignProposalRejectReason||'-'}}</span>
                            </p>
                            <p v-if="item.customerConfirmStatus==2" style="display: flex;">
                                <span class="rightTxt">确认凭证：</span>
                                <span style="flex: 1;">
                                    <span style="word-break: break-all;">{{ item.customerConfirmCertificateName }}</span>
                                    <singDownFile :url="item.customerConfirmCertificateUrl" />
                                </span>
                            </p>
                            <p style="display: flex;">
                                <span class="rightTxt">审核时间：</span>
                                <span style="flex: 1;">{{parseDate(item.customerConfirmTime)}}</span>
                            </p>  
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer"></el-image-viewer>
    </div>
</template>

<script setup>
import { 
    // getDesignProc, 
    // getSubmitDesignProposal,
    // getDesignContractRecord,
    getConfirmsDesignProposal
} from "@/api/crm/order/detail"
import {getdesignservicecontractid } from "@/api/crm/order/contract"
import { computed, reactive, toRefs } from "vue";
import { useRoute } from 'vue-router'
import singDownFile from "@/components/singDownFile"
import crmProcStore from "@/store/modules/crmProc"
import { parseDate, getFileName} from "@/utils/index"
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
    crm_customer_confirm_status
} = proxy.useDict(
    "crm_contract_examine_status",
    "crm_customer_confirm_status"
)
const route = useRoute()
const { orderDetail } = toRefs(props)
const tabs = ref('1')
const processList = ref([
    {
        name: '设计服务合同',
        id: 1,
        taskDefKey:'design_service_contract',
    },
    {
        name: '设计服务合同部门审核',
        id: 2,
        taskDefKey:'design_service_contract_dept_audit',
    },
    {
        name: '设计服务合同财务审核',
        id: 2,
        taskDefKey:'design_service_contract_audit',
    },
    {
        name: '设计师接单',
        id: 3,
        taskDefKey:'designer_take_orders',
    },
    {
        name: '提交设计方案',
        id: 4,
        taskDefKey:'submit_design_proposal',
    },
    {
        name: '客户确认设计方案',
        id: 5,
        taskDefKey:'customer_confirms_design_proposal',
    },
])
const taskDefKey = ref('design_service_contract')
const data = reactive({
    designTask:{
        design_service_contract:null,
        design_service_contract_dept_audit:null,
        design_service_contract_audit:null,
        designer_take_orders:null,
        submit_design_proposal:null,
        customer_confirms_design_proposal:null,
    }
})
const { designTask } = toRefs(data)
const stepProcess = ref(0)
const contractAuditList = ref([])//供应商合同签订驳回记录
const auditList = ref([])//审核记录

const drawerFormData = computed(()=>proc.conceptualDesign)
function setStepIndex(key){
    taskDefKey.value = key
}
function getProc() {
    proc.getConceptualDesign(route.query.id, { orderType: orderDetail.value.procType }).then(()=>{
        // stepProcess.value = drawerFormData.value.taskList.length - 1
        stepProcess.value = processList.value.findIndex(item=>{return item.taskDefKey==drawerFormData.value.taskList[drawerFormData.value.taskList.length-1].taskDefKey})
        contractHistory(drawerFormData.value.id)
        getAuditList(drawerFormData.value.id)
        setProcessList()
    })
}
getProc()
//把后端返回的list根据taskDefKey赋值给designTask对应的流程(key)
function setProcessList(){
    processList.value.map(item=>{
        let obj = drawerFormData.value.taskList.find(data=>{return data.taskDefKey===item.taskDefKey})
        if (obj) {
            designTask.value[item.taskDefKey] = obj
        }
    })
}
// 富文本内容图片放大
let isPreviewImgShow = ref(false)
let previewList = ref([])
function imgViewer(e) {
    if (e.target.tagName == 'IMG') {
        previewList.value = [e.target.src]
        isPreviewImgShow.value = true
    }
}
function closeImgViewer() {
    isPreviewImgShow.value = false
}
//设计方案驳回记录
function contractHistory(id) {
	getdesignservicecontractid(id).then(res=>{
		if (res.code == 200) {
			contractAuditList.value = res.data
		}
	})
}
//客户确认审核记录
function getAuditList(id){
    getConfirmsDesignProposal(id).then(res=>{
        if (res.code == 200) {
            auditList.value = res.data
        }
    })
}
</script>

<style lang="scss" scoped>
.processContent {
    display: flex;
}
.record{
    border: #d7d7d7 1px solid;
    width: 600px;
    border-radius: 6px;
    margin-top: 10px;
    margin-left: 30px;
    padding:0 10px;
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
.rightTxt{
    width: 100px;
    text-align: right;
}
</style>
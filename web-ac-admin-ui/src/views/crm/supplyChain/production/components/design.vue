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
                <!-- 供应商合同 -->
                <div class="programDesign" v-show="taskDefKey == 'supplier_contract'">
                    <el-form @submit.native.prevent class="step1" :model="design" label-width="160px" :disabled="designTask.supplier_contract?.taskStatus != '1'"
								 ref="deliveRef">
						<el-form-item label="上传供应商合同：" prop="supplierContractUrl">
                            <template #label>
                                <span style="color: red;margin-right: 10px;">*</span>
                                <span>上传供应商合同：</span>
                            </template>
                            <crmFileUpload v-if="designTask.supplier_contract?.taskStatus == '1'" style="width: 400px" v-model:modelValue="designTask.supplier_contract.supplierContractUrl" name="立即上传" :disabled="designTask.supplier_contract?.taskStatus != '1'"
                                    :fileType="['pdf', 'word', ]" :fileSize="50" replace ></crmFileUpload>
                            <span v-else>{{ designTask.supplier_contract?.supplierContractName }} <singDownFile :url="designTask.supplier_contract?.supplierContractUrl"  v-hasPermi="['@contract(view:down)']"/></span>
						</el-form-item>
						<el-form-item label="供应商合同货期：" prop="logisticsTaxInclusiveFee">
                            <template #label>
                                <span style="color: red;margin-right: 10px;">*</span>
                                <span>供应商合同货期：</span>
                            </template>
                            <el-date-picker
                                v-if="designTask.supplier_contract"
                                v-model="designTask.supplier_contract.supplierContractDeliveryDate"
                                type="date"
                                placeholder="请选择供应商合同货期"
                            />
						</el-form-item>
						<el-form-item label="上传时间：" v-if="designTask.supplier_contract?.taskStatus != '1'">
                           {{ parseDate(designTask.supplier_contract?.supplierContractUploadTime) }}
						</el-form-item>
						<el-form-item label="上传人："  v-if="designTask.supplier_contract?.taskStatus != '1'">
                            {{ designTask.supplier_contract?.supplierContractUploaderName }}
						</el-form-item>
					</el-form>
                    <!-- 取消和提交按钮 -->
                    <div class="submit" v-if="designTask.supplier_contract?.taskStatus == '1'">
                        <el-button type="primary" :loading="commonLoading" @click="submitContract" >提交审核</el-button>
                    </div>
                    <div v-if="ContractHistory?.length" style="margin-top: 10px;">
                        <div>驳回记录</div>
                        <div v-for="(item,i) in ContractHistory" :key="i" class="history-box">
                            <el-form label-width="120px">
                                <el-form-item label="驳回类型:">
                                    <span><DictTag :value="item?.contractRejectType" :options="crm_ContractRejectionType" /></span>
                                </el-form-item>
                                <el-form-item label="驳回人:">
                                    <span>{{ item.supplierContractAuditerName||item.contractDeptAuditPersonName || '-'}}</span>
                                </el-form-item>
                                <el-form-item label="驳回原因:">
                                    <span style="word-break:break-all;">{{ item.supplierContractAuditRejectReason  || '-'}}</span>
                                </el-form-item>
                                <el-form-item label="驳回时间:">
                                    <span>{{ parseDate(item.supplierContractAuditTime||item.contractDeptAuditTime)}}</span>
                                </el-form-item>
                                <el-form-item label="合同:">
                                    <span style="margin-right: 10px;">{{ item.supplierContractName  || '-'}}</span><singDownFile :url="item.supplierContractUrl" />
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <!-- <div v-if="ContractHistory?.length" style="margin-top: 10px;">
                        <div>驳回记录</div>
                        <div v-for="(item,i) in ContractHistory" :key="i" class="history-box">
                            <el-form label-width="120px">
                                <el-form-item label="驳回人:">
                                    <span>{{ item.supplierContractAuditerName || '-'}}</span>
                                </el-form-item>
                                <el-form-item label="驳回原因:">
                                    <span style="word-break:break-all;">{{ item.supplierContractAuditRejectReason  || '-'}}</span>
                                </el-form-item>
                                <el-form-item label="驳回时间:">
                                    <span>{{ parseDate(item.supplierContractAuditTime)}}</span>
                                </el-form-item>
                                <el-form-item label="合同:">
                                    <span style="margin-right: 10px;">{{ item.supplierContractName  || '-'}}</span><singDownFile :url="item.supplierContractUrl" />
                                </el-form-item>
                            </el-form>
                        </div>
                    </div> -->
                </div>
                <!-- 供应商合同部门审核 -->
                <div v-show="taskDefKey == 'supplier_contract_dept_audit'">
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
                <!-- 供应商合同财务审核 -->
                <div v-show="taskDefKey == 'supplier_contract_audit'">
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
                            {{ designTask.supplier_contract_audit?.supplierContractAuditerName ||'-'}}
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
                <!-- 大货文件设计 -->
                <div v-show="taskDefKey == 'bulk_file_design'">
                    <div>大货设计</div>
                    <el-form @submit.native.prevent class="step1" :model="design" label-width="160px" :disabled="designTask.bulk_file_design?.taskStatus != '1'" ref="deliveRef">
                        <template v-if="designTask.bulk_file_design">
                            <div v-for="(item,index) in designTask.bulk_file_design?.taskCategoryList" :key="index">
                                <div>{{item.goodsName}}</div>
                                <el-form-item label="设计方案：">
                                    <multifile :url="item.projectDesignFileUrl"/>
                                    <!-- <span>{{ item.projectDesignFileName }}</span> 
                                    <singDownFile :url="item.projectDesignFileUrl"/> -->
                                    <!-- <el-link :href="BASE_FILE_URL+item.projectDesignFileUrl">下载</el-link> -->
                                </el-form-item>
                                <el-form-item label="设计文件：" prop="bulkDesignFileUrl">
                                    <crmFileUpload style="width: 400px" v-model:modelValue="item.bulkDesignFileUrl" name="立即上传" :disabled="designTask.bulk_file_design?.taskStatus != '1'"
                                            :fileType="['pdf', 'png', 'jpg', 'mp4', 'zip', 'rar' ]" :fileSize="50"  replace></crmFileUpload>
                                </el-form-item>
                                <el-form-item label="提交时间：" v-if="designTask.bulk_file_design?.taskStatus != '1'">
                                    {{parseDate(designTask.bulk_file_design?.bulkFileDesignSubmitTime)}}
                                </el-form-item>
                            </div>
                            <!-- 取消和提交按钮 -->
                            <div class="submit" v-if="designTask.bulk_file_design?.taskStatus == '1'&&designTask.bulk_file_design?.taskCategoryList">
                                <el-button type="primary" :loading="commonLoading" @click="submitDesign" >提交</el-button>
                            </div>
                        </template>
                        <template v-else>
                            <div>品类名字</div>
                                <el-form-item label="设计方案：" prop="logisticsTaxInclusiveFee">
                                    <span>-</span>
                                </el-form-item>
                                <el-form-item label="设计文件：" prop="supplierContractUrl">
                                    <span>-</span>
                                </el-form-item>
                                <el-form-item label="提交时间：" prop="logisticsTaxInclusiveFee">
                                    <span>-</span>
                                </el-form-item>
                        </template>
					</el-form>
                    <div v-if="DesignHistory?.length" style="margin-top: 10px;">
                        <div>驳回记录</div>
                        <div v-for="(item,i) in DesignHistory" :key="i" class="history-box">
                            <el-form label-width="120px">
                                <el-form-item label="驳回原因:">
                                    <span style="word-break:break-all;">{{ item.customerConfirmsRejectReason  || '-'}}</span>
                                </el-form-item>
                                <el-form-item label="驳回时间:">
                                    <span>{{ parseDate(item.customerConfirmsTime)}}</span>
                                </el-form-item>
                                <el-form-item label="设计文件:">
                                    <div>
                                        <div v-for="(file,index) in item.taskCategoryList" :key="index" style="line-height:16px;margin-bottom: 10px;">
                                            <div>{{ file.goodsName }}</div>
                                            <span style="margin-right: 10px;">{{ file.bulkDesignFileName  || '-'}}</span><singDownFile :url="file.bulkDesignFileUrl" />  
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <!-- 客户确认大货文件设计 -->
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
                        <span v-if="designTask.customer_confirms_bulk_file_design?.customerConfirmCertificateUrl">
                            {{ designTask.customer_confirms_bulk_file_design?.customerConfirmCertificateName }} 
                            <singDownFile :url="designTask.customer_confirms_bulk_file_design?.customerConfirmCertificateUrl" />
                            <!-- <el-link v-if="design?.taskList[3]?.customerConfirmCertificateUrl" :href="BASE_FILE_URL+design?.taskList[3]?.customerConfirmCertificateUrl">下载</el-link> -->
                        </span>
                        <span v-else>-</span>
                    </div>
                    <div class="everyRaw">
                        <span class="alignRight">确认时间：</span>
                        <span v-if="designTask.customer_confirms_bulk_file_design">
                            {{ parseDate(designTask.customer_confirms_bulk_file_design?.customerConfirmsTime) }}
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
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue"
import { supplierContract, bulkDesignFile,bulkDesignHistory,bulkContractHistory,bulkConfirmsHistory} from "@/api/crm/supplyChain/production";
import { getFileName,parseDate } from "@/utils/index"
import { parseTime } from "@/utils/ruoyi"
import { ElMessage } from 'element-plus';
import {BASE_FILE_URL} from "@/store/global-constant";
import singDownFile from "@/components/singDownFile"
import {useAutoLoading} from "@/hooks/buttonLoading"
import multifile from "@/components/singDownFile/multifile.vue"
const [commonLoading, fetch] = useAutoLoading();
const route = useRoute()
const { proxy } = getCurrentInstance()
const { 
	crm_contract_examine_status,
    crm_customer_confirm_status,
    crm_ContractRejectionType
} = proxy.useDict(
	"crm_contract_examine_status",
    "crm_customer_confirm_status",
    "crm_ContractRejectionType"
)
const props = defineProps({
    design:{
        type:Object,
        default:{}
    }
})
const { design } = toRefs(props)
const stepProcess = ref(0)
const DesignHistory = ref([])
const ContractHistory = ref([])
const ConfirmsHistory = ref([])
const taskDefKey = ref('supplier_contract')
const emit = defineEmits()
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
const processList = ref([
    {
        name:'供应商合同',
        id:1,
        taskDefKey:'supplier_contract',
    },
    {
        name:'供应商合同部门审核',
        id:2,
        taskDefKey:'supplier_contract_dept_audit',
    },
    {
        name:'供应商合同财务审核',
        id:2,
        taskDefKey:'supplier_contract_audit',
    },
    {
        name:'大货文件设计',
        id:3,
        taskDefKey:'bulk_file_design',
    },
    {
        name:'客户确认大货文件设计',
        id:4,
        taskDefKey:'customer_confirms_bulk_file_design',
    },
])
watch(design,(val)=>{
    if (val.taskList?.length) {
        stepProcess.value = processList.value.findIndex(item=>{return item.taskDefKey==val.taskList[val.taskList.length-1].taskDefKey})
        getBulkContractHistory()
        if (val.taskList.length>2) {
            getBulkDesignHistory()
        }
        setProcessList()
    }
})
if (design.value.taskList?.length) {
    stepProcess.value = processList.value.findIndex(item=>{return item.taskDefKey==design.value.taskList[design.value.taskList.length-1].taskDefKey})
    setProcessList()
}
function setStepIndex(key){
    taskDefKey.value = key
}
//把后端返回的list根据taskDefKey赋值给designTask对应的流程(key)
function setProcessList(){
    processList.value.map(item=>{
        let obj = design.value.taskList.find(data=>{return data.taskDefKey===item.taskDefKey})
        if (obj) {
            designTask.value[item.taskDefKey] = obj
        }
    })
    //初始化的时候默认显示最后一个task节点
    taskDefKey.value = design.value.taskList[design.value.taskList.length-1].taskDefKey
}
function submitContract(){
    if (!designTask.value.supplier_contract?.supplierContractUrl) {
        ElMessage.error('请上传供应商合同')
        return 
    }
    if (!designTask.value.supplier_contract?.supplierContractDeliveryDate) {
        ElMessage.error('请选择供应商合同货期')
        return 
    }
    fetch(supplierContract({
        "id": design.value?.taskList[0].id,
        "supplierContractDeliveryDate": parseTime(designTask.value.supplier_contract.supplierContractDeliveryDate,'{y}-{m}-{d}'),
        "supplierContractName": getFileName(designTask.value.supplier_contract.supplierContractUrl),
        "supplierContractUrl": designTask.value.supplier_contract.supplierContractUrl
    })).then(res=>{
        if (res.code==200) {
            emit('getTask3')
            ElMessage.success('提交成功')
        }
    })
}
//提交大货设计
function submitDesign() {
    let categoryList = []
    try {
        categoryList = designTask.value.bulk_file_design.taskCategoryList.map(item=>{
            return {
                bulkDesignFileName:getFileName(item.bulkDesignFileUrl),
                bulkDesignFileUrl:item.bulkDesignFileUrl,
                bulkQuoteCategoryId:item.id
            }
        })
    } catch (error) {
        categoryList = []
    }
    if (!categoryList.length) {
        ElMessage.error('请上传设计文件')
        return
    }
    let newArr = categoryList.map(item=>{
        return item.bulkDesignFileName
    })
    if (newArr.length!=[...new Set(newArr)].length) {
        ElMessage.error('存在相同文件名，请更换文件名称重试')
        return
    }
    let obj = {
        "categoryList": categoryList,
        "id": designTask.value.bulk_file_design.id
    }
    fetch(bulkDesignFile(obj)).then(res=>{
        if (res.code==200) {
            emit('getTask3')
            ElMessage.success('提交成功')
        }
    })
}
//获取供应商合同驳回数据
function getBulkContractHistory(){
    bulkContractHistory(route.query.id).then(res=>{
        if (res.code==200) {
            ContractHistory.value = res.data
        }
    })
}
//大货文件设计驳回数据
function getBulkDesignHistory(){
    bulkDesignHistory(route.query.id).then(res=>{
        if (res.code==200) {
            DesignHistory.value = res.data
        }
    })
}
//客户确认设计方案审核记录
function getBulkConfirmsHistory(){
    bulkConfirmsHistory(route.query.id).then(res=>{
        if (res.code==200) {
            ConfirmsHistory.value = res.data
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
.history-box{
    border: #d7d7d7 1px solid;
    border-radius: 6px;
    padding: 10px;
    margin: 10px auto;
}
</style>
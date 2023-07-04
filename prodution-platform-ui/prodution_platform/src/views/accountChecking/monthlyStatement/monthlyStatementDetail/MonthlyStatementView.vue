<template>
    <!-- fullscreen  -->
    <ACDialog class="ms-view-dialog" lock-scroll title="查看" width="1500px" height="800px" v-model="dialogVisible"
        @close="dialogVisible = false">

        <div class="ms-view-page" ref="msViewPageRef">

            <section class="sec-wrap">
                <header class="sec-title">计费规则</header>
                <ChargingRuleCard :rule="chargeRule"></ChargingRuleCard>
            </section>

            <section class="sec-wrap">
                <header class="sec-title">加工费明细
                    <span class="btn-link"
                        @click.stop="openNewPage(`/accountChecking/editRecordTable?businessType=1&id=${dialogParams.id}`)">查看修改记录<el-icon
                            size="14px">
                            <ArrowRight />
                        </el-icon></span>
                </header>
                <ProcessingFeeDetailsCard v-if="detailInfo.attributeId" :mainAccountInfo="detailInfo" ref="processingFeeDetailsCardRef" :tableData="tableData" :editing="editing"
                    :errorFields="errorFields" @input-change="handleValidField"></ProcessingFeeDetailsCard>
            </section>

            <section class="sec-wrap sec-flow" v-if="accountAuditRecordData.length > 0 || settleAuditRecordData.length > 0">
                <template v-if="accountAuditRecordData.length > 0">
                    <h2 class="sec-title">账单审核流程</h2>
                    <div class="flow-chart">
                        <AuditFlowChart strippedDown :data="accountAuditRecordData"></AuditFlowChart>
                    </div>
                </template>

                <template v-if="settleAuditRecordData.length > 0">
                    <h2 class="sec-title">账单结算流程</h2>
                    <div class="flow-chart">
                        <AuditFlowChart strippedDown :data="settleAuditRecordData" flowType="settle"></AuditFlowChart>
                    </div>
                </template>  
            </section>

            <section v-show="editing">
                <header class="sec-title">备注 <span class="required">*</span></header>
                <div>
                    <el-input class="input-textarea" :class="{ 'is-error': !!errorFields.remark }" ref="remarkRef1"
                        type="textarea" rows="3" v-model.trim="editFormData.remark" maxlength="200" show-word-limit
                        @change="handleValidField({ field: 'remark', value: editFormData.remark })" placeholder="请在此添加备注"></el-input>
                </div>
            </section>

            <section v-show="pageStatus == 3">
                <header class="sec-title">核算结论</header>
                <el-form v-if="!dialogParams.isErrorPage" :model="accountingFormData" ref="accountingFormRef"
                    scroll-to-error>
                    <el-form-item label="" prop="conclusion"
                        :rules="[{ required: true, message: '请选择结论', trigger: ['blur', 'change'] }]">
                        <el-radio-group v-model="accountingFormData.conclusion" ref="conclusionRef">
                            <el-radio :label="1">通过核算</el-radio>
                            <el-radio :label="2">驳回至采购</el-radio>
                            <el-radio :label="3">驳回至加工商</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注:" prop="remark"
                        :rules="[{ required: accountingFormData.conclusion !==1, message: '请在此添加备注', trigger: ['blur', 'change'] }]">
                        <el-input class="input-textarea" ref="remarkRef2" type="textarea" rows="3"
                            v-model.trim="accountingFormData.remark" maxlength="200" show-word-limit placeholder="请在此添加备注"></el-input>
                    </el-form-item>
                </el-form>
            </section>
            <section v-if="!!dialogParams.isErrorPage" style="max-width: 700px;">
                <header class="sec-title">核算结论</header>
                <auditAndRemark ref="auditAndRemarkRef"></auditAndRemark>
            </section>
        </div>

        <template #footer>
            <div v-if="!props.readOnly">
                <!--  //pageStatus页面状态：0-仅查看(无按钮），1-可编辑（未打开编辑），2-可编辑（已打开编辑），3-可编辑+可审核(未打开编辑)，4-可编辑+可审核(已打开编辑) -->
                <span class="ac-dialog-footer" v-if="!dialogParams.isErrorPage" v-show="pageStatus > 0">
                    <el-button class="confirm-button" v-show="editing" type="primary" @click="handleSave">
                        保存
                    </el-button>
                    <el-button class="confirm-button" v-show="pageStatus == 3" type="primary" @click="handleAudit">
                        确定
                    </el-button>
                    <el-button :class="(pageStatus == 3) ? 'cancel-button' : 'confirm-buttonn'"
                        v-show="pageStatus == 1 || pageStatus == 3" :type="(pageStatus == 3) ? '' : 'primary'"
                        @click="hanldeEdit">
                        编辑
                    </el-button>
                    <el-button class="cancel-button" @click="handleCancel">取消</el-button>
                </span>
                <span class="ac-dialog-footer" v-else>
                    <el-button class="confirm-button" type="primary" @click="handleErrorPageSave">
                        保存
                    </el-button>
                    <el-button class="cancel-button" @click="handleCancel">取消</el-button>
                </span>
            </div>
            <div v-else></div>
        </template>
    </ACDialog>
</template>

<script setup>
import { ref, computed, nextTick, getCurrentInstance } from 'vue'
import ACDialog from '@/components/ACDialog.vue'
import AuditFlowChart from '@/components/auditFlowChart/index.vue'
import { openNewPage } from "@/utils/commonApi"
import { getUserInfo } from '@/utils/commonApi'
import Schema from 'async-validator';
import ChargingRuleCard from '@/layout/accountCheckingLayout/card/ChargingRuleCard.vue'
import ProcessingFeeDetailsCard from '@/layout/accountCheckingLayout/card/ProcessingFeeDetailsCard.vue'
import auditAndRemark from '@/views/accountChecking/abnormalProcessFee/components/auditAndRemark.vue'
import { msDetail, auditAccounting, saveBill } from '@/api/modules/accountChecking'
import { billAudit } from "@/api/modules/accountChecking"
import {useBroadcast} from '@/hooks/component/useBroadcast'

let {postRefreshPendingListMessage,postRefreshMonthlyStatementListMessage}  = useBroadcast()

const { proxy: $vue } = getCurrentInstance()
const dialogVisible = ref(false) //弹框显示

const emits = defineEmits(['refreshTable', 'complete'])

const props = defineProps({
    //只读模式
    readOnly: {
        type: Boolean,
        default: false
    }
})

//弹框参数
let dialogParams = ref({
    // billStatus: 2, //账单状态:1 待核算,2.核算中
    // auditStatus: 2,//账单核算流程状态: 2 财务审核
})

const {
    isIndustrFinance //产业园财务标识
} = getUserInfo()

const editing = ref(false);//是否处于编辑状态
//页面状态：0-仅查看(无按钮），1-可编辑（未打开编辑），2-可编辑（已打开编辑），3-可编辑+可审核(未打开编辑)，4-可编辑+可审核(已打开编辑)
const pageStatus = computed(() => {
    //账单待核算状态下，产业园财务可对于加工费明细进行二次编辑
    if (dialogParams.value.status === 1 && isIndustrFinance) {
        return editing.value ? 2 : 1
    }

    //核算中状态下，进行判断是否需要产业园财务审核，可以二次编辑 
    //status 状态：1.待核算，2.已结款，3.驳回修改，6.核算中，7.待结款，8.结款中，9.作废
    //rejectStatus:	驳回状态：1.未驳回，2.已驳回
    if (dialogParams.value.status === 6 && dialogParams.value.rejectStatus === 1 && isIndustrFinance) {
        return editing.value ? 4 : 3
    }
    return 0;
})

// 异常页面进入
const auditAndRemarkRef = ref()
const handleErrorPageSave = () => {
    auditAndRemarkRef.value.handleValid().then(e => {
        if (!e) return console.warn(e);
        let payload = {
            isErrorPage: true,
            chooseIds: dialogParams.value.selectRowIds,
            manufacturerId: dialogParams.value.manufacturerId,
            auditStatus: e.conclusion,
            remark: e.remark
        }
        billAudit(payload).then(res => {
            let { code, message = '服务错误' } = res
            if (code !== window.HTTP_SUCCESS) {
                return ElMessage.error(message)
            } else {
                $vue.$message.success({ message: '提交成功' })
                dialogVisible.value = false
                emits("complete", true)
                auditAndRemarkRef.value.resetForm()
                closeMe()
            }
        })
    })
}


//重置界面数据
const msViewPageRef = ref()
const resetPage = () => {
    chargeRule.value = {}
    editFormData.value = {}
    accountingFormData.value = {
        conclusion:1
    }
    accountAuditRecordData.value.length = 0
    editing.value = false
    tableData.value.length = 0
    if (accountingFormRef.value) accountingFormRef.value.resetFields()
    if (auditAndRemarkRef.value) auditAndRemarkRef.value.resetForm()
    if (msViewPageRef.value) {
        nextTick(p => msViewPageRef.value.scrollTo(0, 0))
    }
}

//打开弹出框（供父级界面调用）
const openDialog = (params) => {
    resetPage()
    dialogParams.value = params
    dialogVisible.value = true
    loadData()

     //刷新消息列表
     postRefreshPendingListMessage();
}

//加载数据
const detailInfo = ref({}) //明细
const chargeRule = ref({});//计费规则
const tableData = ref([]);//加工费明细
let accountAuditRecordData = ref([]);//核算流程数据
let settleAuditRecordData = ref([]);//结算流程数据
const loadData = async () => {
    let {id:billDetailId,industrialParkId,isErrorPage} = dialogParams.value
    let { code, data, message } = await msDetail({
        billDetailId,
        industrialParkId,
        isErrorPage
    });
    if (code !== window.HTTP_SUCCESS) {
        return $vue.$message.error({ message })
    }

    let { billRuleVO, billRuleVersion, settleAuditRecords,accountAuditRecords } = data || {}
    accountAuditRecordData.value = accountAuditRecords||[]
    settleAuditRecordData.value = settleAuditRecords||[]
    if (data.status == 3 || data.status == 6) {
        let item = {
            auditUserName: "",
            roleName: "",
            auditStatus: 99 // 审核中
        }
        //需显示审核中
        if (data.status == 3) {//加工商确认中
            item.auditUserName = "加工商"
            item.orgCode = 'manufacturer'
        }
        if (data.status == 6 && data.rejectStatus == 2) {//采购审核中
            item.auditUserName = "采购"
        }
        if (data.status == 6 && data.rejectStatus == 1) {//产业园财务核算中
            item.auditUserName = "产业园财务"
        }
        accountAuditRecordData.value.push(item)
    }
    if (data.status == 8) { // 结款中
        if (data.cwAuditStatus == 3 && [1, 3].includes(data.supplierAuditStatus)) {
            settleAuditRecordData.value.push({
                auditUserName: "财务",
                roleName: "",
                businessType: 3,
                auditStatus: 99 // 审核中
            })
        }
        if (data.supplierAuditStatus == 3 && [1, 3].includes(data.cwAuditStatus)) {
            settleAuditRecordData.value.push({
                orgCode: 'manufacturer',
                auditUserName: "加工商",
                roleName: "",
                businessType: 3,
                auditStatus: 99 // 审核中
            })
        }
        if (data.settlePaymentType == 1 && data.settleStatus == 2) {
            settleAuditRecordData.value.push({
                auditUserName: "产业园财务",
                roleName: "",
                businessType: 3,
                auditStatus: 100 // 付款中
            })
        }
        if (data.settlePaymentType == 2 && data.settleStatus == 2) {
            settleAuditRecordData.value.push({
                auditUserName: "总部财务",
                roleName: "",
                businessType: 3,
                auditStatus: 100 // 付款中
            })
        }
    }
    chargeRule.value = {
        verison: billRuleVO?.version || billRuleVersion || '',
        detail: billRuleVO?.formulaDesc || '该加工商该工序暂时没有与之对应的计价公式',
        time: billRuleVO?.enableTime || ''
    }
    ////账单状态:1.待核算，2.已结款，3.驳回修改，6.核算中，7.待结款，8.结款中，9.作废
    dialogParams.value.billStatus = 6 // data.status 
    //审核状态：-1未审核(默认)/提交审核， 1.采购经理通过，2.采购经理不通过，3.产业园财务通过，4.产业园财务不通过，5.驳回给加工商， 6.驳回给采购，7.作废
    dialogParams.value.auditStatus = -1 // accountAuditRecords && accountAuditRecords.length>0 && accountAuditRecords[accountAuditRecords.length-1].auditStatus || -1
    detailInfo.value = data
    tableData.value.length = 0
    tableData.value.push({
        ...data
    })

    //待编辑的数据
    let { afterProcessCost, extraCost } = data || {}
    let afterProcessCostValue = Number.parseFloat(afterProcessCost)
    let extraCostValue = Number.parseFloat(extraCost)
    editFormData.value = {
        afterProcessCost:Number.isNaN(afterProcessCostValue)?'':afterProcessCost+'',
        extraCost:Number.isNaN(extraCostValue)?'':extraCost+'',
    }

    console.log(333,data,editFormData.value)
}

//编辑模式的数据
const numberReg = /^(0|(\d{1,9}))(\.*\d{1,2})?$/
const remarkFormRef = ref()
const editFormRules = reactive({
    //加工费(改后)
    afterProcessCost: [
        { type: 'string', pattern: numberReg, message: '加工费(改后)必须为数字：最多9位整数，2位小数', trigger: ['blur', 'change'] },
    ],
    //额外费用
    extraCost: [
        { required: true, message: '请输入额外费用', trigger: ['blur', 'change'] },
        { type: 'string', pattern: numberReg, message: '额外费用必须为数字：最多9位整数，2位小数', trigger: ['blur', 'change'] },
    ],
    //备注
    remark: [
        { required: true, message: '请输入备注', trigger: ['blur', 'change'] },
    ]
})

const editFormValidator = new Schema(editFormRules);

const editFormData = ref({})
const remarkRef1 = ref()
const processingFeeDetailsCardRef = ref()
//处理错误显示
const handleValidErrors = ({ field, message }) => {
    switch (field) {
        case 'remark':
            remarkRef1.value.focus()
            remarkRef1.value.blur()
            $vue.$message.error({ message })
            break
        default:
            processingFeeDetailsCardRef.value.handleValidErrors({ field, message })
            break
    }
}

const errorFields = ref({})
const validField = (fieldName) => {
    return new Promise((resove, reject) => {
        editFormValidator.validate(editFormData.value, (errors, fields) => {
            if (!errors || errors.length == 0 || fieldName !== errors[0].field) {
                errorFields.value = {}
                resove()
            } else {
                reject({ errors, fields })
            }
        })
    })
}

//验证单个字段
const handleValidField = ({ field, value }) => {
    editFormData.value[field] = value
    validField(field).then(p => {
    }).catch(({ errors, fields }) => {
        let ok = true
        errors.forEach(item => {
            if (ok) {
                console.log('111 error submit!', fields)
                errorFields.value = fields
                handleValidErrors(item)
                ok = false
            }
        })
    })
}

//点击保存按钮
const handleSave = async () => {
    //console.log(9999,unref,unref(editFormData.value))
    editFormValidator.validate(unref(editFormData.value), async (errors, fields) => {
        if (!errors) {
            errorFields.value = {}
            let { id } = dialogParams.value
            let { afterProcessCost,//加工费(改后)
                extraCost,//额外费用
                remark//备注
            } = editFormData.value

            let afterProcessCostValue = Number.isNaN(Number.parseFloat(afterProcessCost))?null:Number.parseFloat(afterProcessCost)
            let extraCostValue = Number.isNaN(Number.parseFloat(extraCost))?null:Number.parseFloat(extraCost)

            let { code, data, message } = await saveBill({
                afterProcessCost:afterProcessCostValue,
                extraCost:extraCostValue,
                id,
                remark,
            })
            if (code === window.HTTP_SUCCESS) {
                $vue.$message.success({ message: '保存成功' })
                emits('refreshTable')
                editFormData.value = {}
                loadData();
                editing.value = false;
            } else {
                return $vue.$message.error({ message })
            }
        } else {
            console.log('handleSave error submit!', fields)
            errorFields.value = fields
            let ok = true
            errors.forEach(item => {
                if (ok) {
                    handleValidErrors(item)
                    ok = false
                }
            })
        }
    })
}

//点击编辑按钮
const hanldeEdit = () => {
    editing.value = true
    msViewPageRef.value.scrollTo(0, 0)
}

//审批
const accountingFormRef = ref()
const accountingFormData = ref({  conclusion:1});
const conclusionRef = ref()
const remarkRef2 = ref()
//点击确定按钮（审批）
const handleAudit = async () => {
    accountingFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            let { id, manufacturerId } = dialogParams.value
            let { conclusion, remark } = accountingFormData.value
            let status = 7
            //通过核算：7,驳回至采购：6,驳回至加工商:3
            switch (conclusion) {
                case 1:
                    status = 7 //通过核算
                    break;
                case 2:
                    status = 6 // 驳回至采购
                    break;
                case 3:
                    status = 3 //驳回至加工商
                    break;
            }
            let { code, data, message } = await auditAccounting({
                chooseIds: [id],
                manufacturerId,
                auditStatus: status,
                remark,
            })
            if (code === window.HTTP_SUCCESS) {
                $vue.$message.success({ message: '提交成功' })
                emits('refreshTable')
                accountingFormRef.value.resetFields()
                dialogVisible.value = false
                closeMe()
            } else {
                return $vue.$message.error({ message })
            }
        } else {
            console.log('handleAudit error submit!', fields)
        }
    })
}

//取消
const handleCancel = () => {
    if (editing.value) {
        editing.value = false
        editFormData.value.remark = ''
        loadData()
        return
    }
    accountingFormRef.value?.resetFields()
    auditAndRemarkRef.value?.resetForm()
    dialogVisible.value = false
}

//关闭弹框
const closeMe =()=>{
    //判定依据：从待办过来的都会带有billNum参数
    let canClose = (window.location.search||'').indexOf('billNum')>-1;
    if(canClose){
        //刷新月结账单列表
        postRefreshMonthlyStatementListMessage();
        //刷新消息列表
        postRefreshPendingListMessage();
        //关闭窗口
        window.setTimeout(window.close,1000)
    }
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped>
.ms-view-dialog {

    .el-dialog__body {
        padding: 16px 0;
    }

    .el-table__header th {
        background-color: #F2F2F2 !important;
    }

    .required{
        color: var(--el-color-danger);
    }
}

.ms-view-page {
    padding: 0 32px;
    max-height: 700px;
    height: 700px;
    overflow-y: scroll;
}

.is-error .el-input__wrapper {
    box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}

.el-textarea.is-error .el-textarea__inner {
    box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}
</style>

<style lang="scss" scoped>
.sec-wrap {
    margin-bottom: 17px;
}

.sec-title {
    position: relative;
    font-size: 15px;
    font-weight: 600;
    color: #333;
    line-height: 24px;
    margin-bottom: 8px;
}

.flow-chart {
    width: 50%;
}

.input-textarea {
    max-width: 700px;
}

.btn-link {
    position: absolute;
    right: 0;
    color: var(--vt-c-theme-colors);
    font-size: 14px;
    font-weight: 400;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &:hover {
        opacity: 0.75;
    }
}
</style>
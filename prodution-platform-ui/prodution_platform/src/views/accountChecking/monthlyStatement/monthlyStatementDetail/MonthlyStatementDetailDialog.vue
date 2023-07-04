<template>
    <div>
        <!-- 添加备注弹出框 -->
        <ACDialog title="添加备注" width="30%" v-model="editRemarkVisible" @close="editRemarkVisible = false"
            @bottom-btn-click="handleAddRemark">
            <div class="ac-dialog-title dialog-title">已选择{{ dialogParams.selectRowCount }}条账单，请添加备注：</div>
            <el-form :model="remarkFormData" ref="remarkFormRef">
                <el-form-item label="备注:" prop="remark"
                    :rules="[{ required: true, message: '请在此添加备注', trigger: ['blur', 'change'] }]">
                    <el-input type="textarea" rows="3" v-model.trim="remarkFormData.remark" maxlength="200" show-word-limit
                        placeholder="请在此添加备注"></el-input>
                </el-form-item>
            </el-form>
        </ACDialog>

        <!-- 启动核算弹出框 -->
        <ACDialog title="启动核算" width="40%" v-model="accountingVisible" @close="accountingVisible = false"
            @bottom-btn-click="handleAccounting">

            <template v-if="accountingStatusNotMatch">
                <div class="ac-dialog-title  center">
                    <!-- 已剔除15条【待核算】状态外的其它账单，剩余85条【待核算】状态账单，是否继续进行核算 -->
                    {{ accountingConfirmMessage }}
                </div>
            </template>

            <template v-else>
                <div class="ac-dialog-title dialog-title">已选择{{ accountingConfirmParams.chooseIds?.length ||
                    dialogParams.selectRowCount }}条账单，请确认核算结论：</div>
                <el-form :model="accountingFormData" ref="accountingFormRef">
                    <el-form-item label="" prop="conclusion"
                        :rules="[{ required: true, message: '请选择结论', trigger: ['blur', 'change'] }]">
                        <el-radio-group v-model="accountingFormData.conclusion" @change="handleConclusionChange">
                            <el-radio :label="1">通过核算</el-radio>
                            <el-radio :label="2">驳回至采购</el-radio>
                            <el-radio :label="3">驳回至加工商</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注:" prop="remark" :rules="accountingRemarkCheckRule">
                        <el-input type="textarea" rows="3" v-model.trim="accountingFormData.remark" maxlength="200"
                            show-word-limit placeholder="请在此添加备注"></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </ACDialog>

        <!-- 启动结款弹出框 -->
        <ACDialog title="启动结款" width="70%" class="settlement-dialog" v-model="settlementVisible"
            @close="settlementVisible = false" @bottom-btn-click="handleConfirmSettlement">
            <template v-if="settlementStatusNotMatch">
                <div class="ac-dialog-title  center">
                    <!-- 已剔除15条非【待结款】状态的账单，剩余85条【待结款】账单 -->
                    {{ settlementConfirmMessage }}
                </div>
            </template>
            <template v-else>
                <div class="ac-dialog-title dialog-title">已选择{{ settlementConfirmParams.chooseIds?.length ||
                    dialogParams.selectRowCount }}条账单，是否启动结款？</div>
                <div class="table-title">加工费月结账单</div>
                <el-table :data="settlementTableData" :header-cell-style="{ color: '#333' }" border>
                    <el-table-column prop="paymentNum" label="付款单号" width="120" align="center" />
                    <el-table-column prop="manufacturerName" label="加工商" min-width="120" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.manufacturerName || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="attributeName" label="工艺" width="100" align="center" />
                    <el-table-column prop="totalAmount" label="总金额" min-width="100" align="center" />
                    <el-table-column prop="totalProcessCost" label="总加工费(初始)" min-width="150" align="center" />
                    <el-table-column prop="totalAfterProcessCost" label="总加工费(改后)" min-width="150" align="center">
                        <template #default="scope">
                            {{ scope.row.totalAfterProcessCost || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceAmount" label="差异金额" min-width="120" align="center" >
                        <template #default="scope">
                            {{ defaultZero(scope.row.varianceAmount) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceRate" label="差异率" min-width="100" align="center">
                        <template #default="scope">
                            {{ scope.row.varianceRate ? (scope.row.varianceRate + '%') : '0.00%' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="extraCost" label="额外费用" min-width="110" align="center" >
                        <template #default="scope">
                            {{ defaultZero(scope.row.extraCost) }}
                        </template>
                    </el-table-column>

                </el-table>
                <el-form class="settlement-form" :model="settlementFormData" ref="settlementFormRef">
                    <el-form-item label="备注:" prop="remark">
                        <el-input type="textarea" rows="3" v-model.trim="settlementFormData.remark" maxlength="200"
                            show-word-limit placeholder="请在此添加备注"></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </ACDialog>

        <!-- 导出弹出框 -->
        <ACDialog title="导出" width="38%" v-model="exportVisible" @close="exportVisible = false"
            @bottom-btn-click="handleConfirmExport">
            <div class="ac-dialog-title center">
                是否确认导出“{{ dialogParams.title }}”-已选中{{ dialogParams.exportCount }}条数据
            </div>
        </ACDialog>

    </div>
</template>

<script setup>
/**
 * 月结账单详情列表-弹出框
 */
import ACDialog from '@/components/ACDialog.vue'
import { appendRemark, preBillAuditCheck, startAccounting, preSettlementCheck, startSettlement, msExport, msBillStatistics } from '@/api/modules/accountChecking'
import { getSettlementInfo } from '@/api/modules/settlement'
import { getManufacturerDetail } from '@/api/modules/processor'
import { defaultZero } from '@/utils/util.js'

const { proxy: $vue } = getCurrentInstance()
//添加备注弹出框
const editRemarkVisible = ref(false);
//启动核算弹出框
const accountingVisible = ref(false);
//启动结款弹出框
const settlementVisible = ref(false);
//导出弹出框
const exportVisible = ref(false);

let dialogParams = reactive({
    selectRowCount: 1,//选择的行数
});

const emits = defineEmits(['refreshTable'])

let statusStatistics = {};
//打开弹出框（供父级界面调用）
const openDialog = async (type, params) => {
    Object.assign(dialogParams, params)

    console.log(3333, params)
    //type:0 填写备注，1.启动核算，2.启动结款,3.导出
    if (type == 0) {
        remarkFormRef.value?.resetFields()
    } if (type == 1) {
        accountingRemarkCheckRule.value.length = 0
        accountingFormRef.value?.resetFields()
        accountingStatusNotMatch.value = false
        let pass = await checkNotAllWaitToAccounting()
        if (!pass) return;
    } else if (type == 2) {
        settlementFormRef.value?.resetFields()
        settlementStatusNotMatch.value = false
        let pass = await checkNotAllWaitToSettlement()
        if (!pass) return;
    } else if (type == 3) {
        //获取导出数据总行数
        let { code, data, message } = await msBillStatistics({
            ...dialogParams.searchParams,
        })
        if (code !== window.HTTP_SUCCESS) {
            return $vue.$message.error({ message })
        }
        const count = data || 0
        dialogParams.exportCount = count
    }

    let visibles = [editRemarkVisible, accountingVisible, settlementVisible, exportVisible]
    visibles[type].value = true
}


//=============添加备注============================
const remarkFormRef = ref()
let remarkFormData = ref({
    remark: ''//备注
})
const handleAddRemark = async ({ confirm }) => {
    if (confirm) {
        remarkFormRef.value.validate(async (valid, fields) => {
            if (valid) {
                let { code, data, message } = await appendRemark({
                    ...dialogParams.searchParams,
                    remark: remarkFormData.value.remark
                })
                if (code === window.HTTP_SUCCESS) {
                    remarkFormRef.value.resetFields();
                    editRemarkVisible.value = false
                    $vue.$message.success({ message: '添加成功' })
                    emits('refreshTable')
                } else {
                    $vue.$message.error({ message })
                }
            } else {
                console.log('error submit!', fields)
            }
        })
    }
}

//==============启动核算===========================
const accountingFormRef = ref()
let accountingStatusNotMatch = ref(false)
let accountingConfirmMessage = ref('') //确认提示信息
let accountingConfirmParams = ref({})//确认提交参数
let accountingFormData = ref({
    conclusion: 1,//结论
    remark: ''//备注
});

//备注必填控制
let accountingRemarkCheckRule = ref([]);
let handleConclusionChange = () => {
    accountingFormRef.value.clearValidate()
    accountingRemarkCheckRule.value.length = 0
    if (accountingFormData.value.conclusion !== 1) {
        accountingRemarkCheckRule.value.push({ required: true, message: '请添加备注', trigger: ['blur', 'change'] })
    }
}

//检查是否有不是待核算状态
const checkNotAllWaitToAccounting = async () => {
    accountingConfirmParams.value.chooseIds = null //重置数据

    const params = {
        ...dialogParams.searchParams,
        auditStatus: 7,
    }
    const { code, data, message } = await preBillAuditCheck(params)
    if (code === window.HTTP_SUCCESS) {
        accountingVisible.value = true
        return true
    } else if (code === 'S-000033') {
        if (data && data.length > 0) {
            accountingVisible.value = true
            //账单状态剔除：已剔除15条【待核算】状态外的其它账单，剩余85条【待核算】状态账单，是否继续进行核算
            accountingConfirmMessage.value = message;
            accountingStatusNotMatch.value = true;
            accountingConfirmParams.value.chooseIds = data //返回值是：【待核算】状态的数据的id数组
            return true
        } else {
            $vue.$message.error({ message: '请选择【待核算】账单进行核算' });
            accountingVisible.value = false
            return false;
        }
    } else if (code === 'S-000031') {
        $vue.$message.error({ message: '请选择【待核算】账单进行核算' });
        accountingVisible.value = false
        return false;
    } else {
        $vue.$message.error({ message })
        return false;
    }
}

const handleAccounting = async ({ confirm }) => {
    if (confirm) {
        if (!accountingStatusNotMatch.value) {
            accountingConfirmMessage.value = ''
            accountingFormRef.value.validate(async (valid, fields) => {
                if (valid) {
                    let { conclusion, remark } = accountingFormData.value
                    let { billId, selectRowIds } = dialogParams
                    let status = 7
                    //status 通过核算：7,驳回至采购：6,驳回至加工商:3
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

                    const chooseIds = accountingConfirmParams.value.chooseIds
                    const params = {
                        ...dialogParams.searchParams,
                        auditStatus: status,
                        remark,
                        'chooseIds': chooseIds || dialogParams.searchParams.chooseIds,
                        selectAll: chooseIds && chooseIds.length > 0 ? false : dialogParams.searchParams.selectAll,
                    }

                    accountingConfirmParams.value = params
                    const { code, data, message } = await startAccounting(params)
                    if (code === window.HTTP_SUCCESS) {
                        accountingFormRef.value.resetFields()
                        accountingVisible.value = false
                        $vue.$message.success({ message: '提交成功' })
                        emits('refreshTable')
                    } else {
                        $vue.$message.error({ message })
                    }
                } else {
                    console.log('error submit!', fields)
                    return false
                }
            })
        } else {
            accountingStatusNotMatch.value = false
        }
    }
}

//============启动结款===============================
let settlementTableData = ref([])
let settlementStatusNotMatch = ref(false) //选中的数据是否都是这个状态
let settlementFormRef = ref()
let settlementFormData = ref({ remark: '' })
let settlementConfirmMessage = ref('') //确认提示信息
let settlementConfirmParams = ref({})//确认提交参数

//查询结款单信息（加工费月结账单）
const querySettlementInfo = async () => {
    const chooseIds = settlementConfirmParams.value.chooseIds
    const params = {
        ...dialogParams.searchParams,
        'chooseIds': chooseIds || dialogParams.searchParams.chooseIds,
        selectAll: chooseIds && chooseIds.length > 0 ? false : dialogParams.searchParams.selectAll,
    }
    let { code, data, message } = await getSettlementInfo({ ...params, })
    if (code !== window.HTTP_SUCCESS) {
        return $vue.$message.error({ message })
    }
    settlementTableData.value.length = 0
    settlementTableData.value.push(data)
    dialogParams.searchParams.paymentNum = data.paymentNum //付款单号
}

//检查是否有不是[待结款]状态
const checkNotAllWaitToSettlement = async () => {
    const params = {
        ...dialogParams.searchParams,
    }
    let { code, data, message } = await preSettlementCheck(params)
    console.log(111, code === 'S-000034', (data && data.length > 0))
    if (code === window.HTTP_SUCCESS) {
        settlementVisible.value = true
        querySettlementInfo()
        return true
    } else if (code === 'S-000034') {
        if (data && data.length > 0) {
            settlementVisible.value = true
            //已剔除15条非【待结款】状态的账单，剩余85条【待结款】账单
            settlementConfirmMessage.value = message;
            settlementStatusNotMatch.value = true;
            settlementConfirmParams.value.chooseIds = data //返回值是：【待结款】状态的数据的id数组
            querySettlementInfo()
            return false
        } else {
            settlementVisible.value = false
            $vue.$message.error({ message: '请选择【待结款】账单进行结款' });
            return false;
        }
    } else {
        console.log(333)
        $vue.$message.error({ message })
        return false;
    }
}

/**
 * 检查加工商的状态是否正常,只是提示不影响后续流程
 */
const manufacturerInfo = ref({})
const checkManufacturer = async () => {
    let { code, data, message = '服务错误' } = await getManufacturerDetail(dialogParams.searchParams.manufacturerId)
    if (code !== window.HTTP_SUCCESS) {
        return $vue.$message.error({ message })
    }
    manufacturerInfo.value = data
    //enableStatus	状态：1启用，2禁用
    if (data.enableStatus == 2) {
        ElMessage({
            message: '加工商已被禁用',
            type: 'warning',
        })
    }
}

const handleConfirmSettlement = async ({ confirm }) => {
    if (confirm) {
        if (!settlementStatusNotMatch.value) {
            
            settlementConfirmMessage.value = ''
            settlementFormRef.value.validate(async (valid, fields) => {
                if (valid) {
                    //检查加工商的状态是否正常,只是提示不影响后续流程
                    await checkManufacturer();
                    let { remark } = settlementFormData.value
                    const chooseIds = settlementConfirmParams.value.chooseIds
                    const params = {
                        ...dialogParams.searchParams,
                        remark,
                        'chooseIds': chooseIds || dialogParams.searchParams.chooseIds,
                        selectAll: chooseIds && chooseIds.length > 0 ? false : dialogParams.searchParams.selectAll,
                    }
                    let { code, data, message } = await startSettlement(params)
                    if (code === window.HTTP_SUCCESS) {
                        settlementFormRef.value.resetFields()
                        settlementVisible.value = false
                        $vue.$message.success({ message: '提交成功' })
                        emits('refreshTable')
                    } else {
                        $vue.$message.error({ message })
                    }
                } else {
                    console.log('error submit!', fields)
                    return false
                }
            })
        } else {
            settlementStatusNotMatch.value = false
        }
    }
}

//============导出==================================
const handleConfirmExport = async ({ confirm }) => {
    if (confirm) {
        let res = await msExport({
            ...dialogParams.searchParams,
        })
        if (res.code) {
            let { code, data, message } = res
            if (code !== window.HTTP_SUCCESS) {
                return $vue.$message.error({ message })
            }
        } else {
            exportVisible.value = false
            $vue.$message.success({ message: '导出成功' })
            emits('refreshTable')
        }
    }
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped>
.dialog-title {
    font-size: 14px;
    color: #333;
    line-height: 21px;
    margin-top: 0;
    margin-bottom: 16px;
}

.ac-dialog-title {
    &.center {
        text-align: center;
    }
}

.settlement-dialog {
    font-size: 16px;

    .dialog-title {
        font-size: 16px;
        margin-top: 0;
        margin-bottom: 17px;
    }

    .settlement-form {
        width: 60%;
        margin-top: 16px;
    }
}

.table-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    line-height: 24px;
    margin-bottom: 7px;
}
</style>
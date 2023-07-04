<template>
    <div class="settlement-detail-setttlement-tab">
        <section class="sec-wrap">
            <header class="sec-title">结款单信息
                <span class="btn-link abs"
                    @click.stop="openNewPage(`/accountChecking/editRecordTable?businessType=2&id=${billId}`)">查看修改记录<el-icon
                        size="14px">
                        <ArrowRight />
                    </el-icon></span>
            </header>
            <div class="table-wrap">
                <el-table :data="docTableData" :header-cell-style="{ color: '#333' }" border>
                    <el-table-column prop="paymentNum" label="付款单号" width="120" align="center" />
                    <el-table-column prop="manufacturerName" label="加工商" align="center" />
                    <el-table-column prop="attributeName" label="工艺" width="80" align="center" />
                    <el-table-column prop="totalAmount" label="总金额" width="120" align="center" />
                    <el-table-column prop="totalProcessCost" label="总加工费(初始)" min-width="140" align="center" />
                    <el-table-column prop="totalAfterProcessCost" label="总加工费(改后)" min-width="140" align="center">
                        <template #default="scope">
                            {{ scope.row.totalAfterProcessCost || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceAmount" label="差异金额" min-width="120" align="center">
                        <template #default="scope">
                            {{ scope.row.varianceAmount || '0.00' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceRate" label="差异率" min-width="100" align="center">
                        <template #default="scope">
                            {{ scope.row.varianceRate ? (scope.row.varianceRate + '%') : '0.00' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="extraCost" label="额外费用" min-width="120" align="center">
                        <template #default="scope">
                            {{ scope.row.extraCost || '0.00' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="deductionCost" label="扣款金额" width="110" align="center" />
                    <el-table-column prop="writeoffCost" label="预付款核销" width="110" align="center" />
                    <el-table-column prop="invoiceCost" label="开票金额" width="110" align="center" />
                    <el-table-column prop="meetCost" label="应付金额" width="110" align="center" />
                </el-table>
            </div>
        </section>

        <section class="sec-wrap">
            <el-form ref="editFormRef" :model="formData" :hide-required-asterisk="!editable" status-icon
                :rules="verifyRules" label-width="120px" class="form" :scroll-to-error="true">
                <header class="sec-title">付款信息</header>
                <el-form-item label="收款人">
                    <label>{{ formData.payeeName }}</label>
                    <span v-if="editable" class="btn-link" @click="handleOpenChangeAccountDialog">切换账户</span>
                </el-form-item>
                <el-form-item label="账号">
                    <label>{{ formData.paymentAccount }}</label>
                </el-form-item>
                <el-form-item label="开户行">
                    <label>{{ formData.paymentBank }}</label>
                </el-form-item>
                <el-form-item label="付款方式" prop="paymentType">
                    <!-- 付款方式：1.产业园付款,2.总部付款 -->
                    <el-radio-group :disabled="!editable" v-model="formData.paymentType">
                        <el-radio :label="1">产业园付款</el-radio>
                        <el-radio :label="2">总部付款</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="editable">
                    <header class="sec-title">修改结款单信息</header>
                    <el-form-item label="总加工费(改后)" prop="totalAfterProcessCost">
                        <el-input class="input" v-model.trim="formData.totalAfterProcessCost" placeholder="请输入"
                            @change="handleInputChange('totalAfterProcessCost')"
                            @input="handleInput('totalAfterProcessCost')"></el-input>
                    </el-form-item>
                    <el-form-item label="额外费用" prop="extraCost">
                        <el-input class="input" v-model.trim="formData.extraCost" placeholder="请输入"
                            @change="handleInputChange('extraCost')" @input="handleInput('extraCost')"></el-input>
                    </el-form-item>
                </template>
                <header class="sec-title">预付款核销</header>
                <el-form-item label="本次核销金额" prop="writeoffCost">
                    <el-input v-if="editable" class="input" v-model.trim="formData.writeoffCost" placeholder="请输入"
                        @change="handleInputChange('writeoffCost')" @input="handleInput('writeoffCost', 9)"></el-input>
                    <label v-else>{{ formData.writeoffCost }}</label>
                </el-form-item>
                <template v-if="editable">
                    <header class="sec-title">备注</header>
                    <el-form-item label="备注:" prop="remark">
                        <el-input type="textarea" rows="3" placeholder="请在此添加备注" v-model.trim="formData.remark"
                            maxlength="200" show-word-limit></el-input>
                    </el-form-item>
                </template>
                <header class="sec-title">开票信息</header>
                <el-form-item label="是否开票" prop="isTax">
                    <!-- 是否开票：1是，2否 -->
                    <el-radio-group :disabled="!editable" v-model="formData.isTax" @change="handleTaxChange">
                        <el-radio :label="1">开票</el-radio>
                        <el-radio :label="2">不开票</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="formData.isTax == 1">
                    <el-form-item label="收费税点">
                        <label>{{ taxPointShow }}%</label>
                    </el-form-item>
                    <el-form-item label="开票税率">
                        <label>{{ taxRateShow }}%</label>
                    </el-form-item>
                    <el-form-item label="收费税点金额">
                        <label>{{ taxAmount }}元</label>
                    </el-form-item>
                </template>
            </el-form>
        </section>

        <section class="sec-wrap sec-flowchart" v-if="settleAuditRecordData.length > 0">
            <header class="sec-title">结款单结算流程</header>
            <div class="flow-chart">
                <AuditFlowChart strippedDown :data="settleAuditRecordData" flowType="settle"></AuditFlowChart>
            </div>
        </section>

        <section class="sec-wrap" v-if="detailInfo.payVoucherImgList?.length > 0">
            <header class="sec-title">付款凭证</header>
            <div class="img-list">
                <div class="img-item" v-for="(item) in detailInfo.payVoucherImgList" :key="item"
                    @click="handlePreviewImg(improveImgUrl(item))">
                    <img class="img" :src="improveImgUrl(item)" />
                    <SvgIcon class="icon-preview" color="var(--default-main-color)" name="imgPreview" w="20px" h="20px" />
                </div>
            </div>
        </section>
        <div class="tab-footer" v-if="pageStatus == 1">
            <el-button class="reset_button" @click="handleCancelAudit">放弃修改</el-button>
            <el-button class="reset_button" @click="handleEdit">保存修改</el-button>
            <el-button class="search_button" type="primary" @click="handleSubmit">提交审核</el-button>
        </div>
        <div class="tab-footer" v-else-if="pageStatus == 2">
            <el-button class="search_button" type="primary" @click="handleShowAuditDialog(true)">审核通过</el-button>
            <el-button class="reset_button" @click="handleShowAuditDialog(false)">审核不通过</el-button>
        </div>
        <div class="tab-footer" v-else-if="pageStatus == 3">
            <el-button class="search_button" type="primary" @click="handleUpload">已结款</el-button>
        </div>

        <ChangeAccountDialog ref="changeAccountDialogRef" @changeAccount="handleChangeAccount"></ChangeAccountDialog>

        <UploadAssetsDialog ref="uploadAssetsDialogRef" @success="handleUploadSuccess"></UploadAssetsDialog>

        <ACImgViewer v-model="imgViewerVisible" :imgs="[imgViewerUrls]"></ACImgViewer>

        <ACDialog title="审核" width="700px" v-model="auditDialogVisible" @close="auditDialogVisible = false"
            :close-on-click-modal="false" @bottom-btn-click="handleAudit">
            <div class="ac-dialog-title dialog-title">是否确认审核{{ auditPass ? '通过' : '不通过' }}</div>
            <el-form :model="auditFormData" ref="auditFormRef">
                <el-form-item label="备注:" prop="remark"
                    :rules="[{ required: !auditPass, message: '请在此添加备注', trigger: ['blur', 'change'] }]">
                    <el-input type="textarea" rows="3" placeholder="请在此添加备注" v-model.trim="auditFormData.remark"
                        maxlength="200" show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </ACDialog>
    </div>
</template>

<script setup>
import { parseTime } from '@/utils/util'
import AuditFlowChart from '@/components/auditFlowChart/index.vue'
import ChangeAccountDialog from './ChangeAccountDialog.vue'
import ACImgViewer from '@/components/ACImgViewer.vue'
import { getDetail, settlementList, auditSettlement, updateSettlement, submitSettlement } from "@/api/modules/settlement"
import { openNewPage, getUserInfo } from "@/utils/commonApi"
import { getManufacturerDetail } from '@/api/modules/processor'
import UploadAssetsDialog from '@/views/accountChecking/monthlyStatement/uploadAssetsDialog.vue'
import { trimToNumber, trimLastDigit, improveImgUrl } from '@/utils/util'
import { useBroadcast } from '@/hooks/component/useBroadcast'
import { numberFloor } from '@/utils/number'
import { calcVariance } from '@/views/accountChecking/monthlyStatement/monthlyStatementDetail/varianceRate'

let { postRefreshPendingListMessage, postRefreshSettlementListMessage } = useBroadcast()

const { proxy: $vue } = getCurrentInstance()

const props = defineProps({
    params: {
        type: Object,
        default: () => { }
    }
})

let { id: billId } = props.params

const {
    isIndustrFinance, //产业园财务标识
    userRoleList,
} = getUserInfo()

//结款单信息
const detailInfo = ref({
    settleAuditRecord: []
})
const docTableData = ref([])

//表单信息
const formData = ref({})
//表单校验
const numberReg = /^(0|(\d{1,9}))(\.*\d{1,2})?$/
const verifyRules = ref({
    //付款方式
    paymentType: [
        { required: true, message: '请选择付款方式', trigger: ['change'] },
    ],
    //总加工费(改后)
    totalAfterProcessCost: [
        { type: 'string', pattern: numberReg, message: '请输入数字,最多9位整数,2位小数', trigger: ['blur', 'change'] },
    ],
    //额外费用
    extraCost: [
        { type: 'string', pattern: numberReg, message: '请输入数字,最多9位整数,2位小数', trigger: ['blur', 'change'] },
    ],
    //本次核销金额
    writeoffCost: [
        { type: 'string', pattern: numberReg, message: '请输入数字,最多9位整数,2位小数', trigger: ['blur', 'change'] },
    ],
    //是否开票
    isTax: [

    ],
})
//加载数据
let settleAuditRecordData = ref([]);//流程数据
const loadData = async () => {
    let { code, data, message = '服务错误' } = await getDetail({ id: billId })

    if (code !== window.HTTP_SUCCESS) {
        return $vue.$message.error({ message })
    }

    let images = data.payVoucherImg || '';
    data.payVoucherImgList = images ? images.split(',') : [] //付款凭证图片
    detailInfo.value = data
    settleAuditRecordData.value = data.settleAuditRecord//流程数据
    if (data.status == 1) {
        if (data.cwAuditStatus == 3 && [1, 3].includes(data.supplierAuditStatus)) {
            settleAuditRecordData.value.push({
                // orgCode: 'manufacturer',
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
    } else if (data.status == 2) {
        if (data.paymentType == 1) {
            settleAuditRecordData.value.push({
                auditUserName: "产业园财务",
                roleName: "",
                businessType: 3,
                auditStatus: 100 // 付款中
            })
        }
        if (data.paymentType == 2) {
            settleAuditRecordData.value.push({
                auditUserName: "总部财务",
                roleName: "",
                businessType: 3,
                auditStatus: 100 // 付款中
            })
        }
    }
    //构造表格数据
    docTableData.value.length = 0
    docTableData.value.push(data)

    //可编辑数据
    let { manufacturerId, paymentAccountId, payeeName, paymentAccount, paymentBank,
        paymentType, totalAfterProcessCost, extraCost,
        writeoffCost, isTax } = data
    formData.value = {
        paymentAccountId, payeeName, paymentAccount, paymentBank, paymentType,
        totalAfterProcessCost, extraCost, writeoffCost, isTax
    }
    manufacturerIdRef.value = manufacturerId
    queryManufacturerDetail()
}

/**
 * 查询加工商信息
 */
const manufacturerInfo = ref({})
const queryManufacturerDetail = async () => {
    let { code, data, message = '服务错误' } = await getManufacturerDetail(manufacturerIdRef.value)
    if (code !== window.HTTP_SUCCESS) {
        return $vue.$message.error({ message })
    }
    data.loaded = true
    manufacturerInfo.value = data
    calcInvoiceCost()
}

onMounted((p) => {
    loadData()
})

//页面状态：0 仅查看，1.产业园财务修改,2.总部财务审核,3.上传付款凭证
const pageStatus = computed(() => {
    /* 
    字段说明：
    status	        状态：1.待付款，2.付款中，3.已付款
    cwAuditStatus	总部财务审核状态：-1:未处理，1.通过，2.不通过 3.审核中
    supplierAuditStatus	加工商审核状态：-1:未处理，1.通过，2.不通过 3.审核中
    */
    let { status, cwAuditStatus, supplierAuditStatus } = detailInfo.value

    //角色（ 总部财务id:17）
    let isHGFinancial = ref(false)  //总部财务
    let isParkFinancial = ref(isIndustrFinance) //产业园财务
    userRoleList.forEach(item => {
        if (item.roleId == 17) isHGFinancial.value = true
    })

    /* console.log('pageStatus-status,cwAuditStatus,supplierAuditStatus', status,cwAuditStatus,supplierAuditStatus)
    console.log('pageStatus-是否总部财务', isHGFinancial.value)
    console.log('pageStatus-是否产业园财务', isParkFinancial.value) */

    /*
    可修改场景：
    1)生成结款单后，【待付款】状态下，产业园财务可修改
    2)提交审核后，总部财务或加工商审核不通过，产业园财务可以继续修改
    */
    if (isParkFinancial.value && (status === 1) && (cwAuditStatus === -1)) {
        return 1
    }
    if (isParkFinancial.value && (cwAuditStatus === 2 || supplierAuditStatus == 2)) {
        return 1
    }

    /* 
    审核场景：
    总部财务审核：产业园财务提交审核，为【待付款】状态下，由总部财务审核
    */
    if (isHGFinancial.value && status == 1 && (cwAuditStatus === 3)) {
        return 2;
    }

    /**
     * 上传凭证场景:
     * 总部财务上传付款凭证: 产业员财务提交审核时，选择总部付款，当加工商和总部财务都审批通过后需要总部财务上传付款凭证
     * 产业园财务上传付款凭证: 产业员财务提交审核时，选择产业园付款，当加工商和总部财务都审批通过后需要产业园财务上传付款凭证
     */
    let { paymentType } = detailInfo.value; // 付款方式：1 产业园付款，2 总部付款
    if (status !== 3 && ((isParkFinancial.value && paymentType === 1) || (isHGFinancial.value && paymentType === 2)) && (cwAuditStatus === 1 && supplierAuditStatus === 1)) {
        return 3;
    }
    return 0;
})

// 显示的税点
const taxPointShow = computed(() => {
    //修改状态下 读取加工商配置的税点(数字是百分比单位 所以不用*100)
    return Number(editable.value ? manufacturerInfo.value.taxPoint : docTableData.value[0].taxPoint).toFixed(2)
});

// 显示的税率
const taxRateShow = computed(() => {
    //修改状态下 读取加工商配置的税率(数字是小数 所以要*100 转化为百分比)
    return Number((editable.value ? manufacturerInfo.value.taxRate : docTableData.value[0].taxRate) * 100).toFixed(2)
});

// 是否可编辑
const editable = computed(p => {
    return pageStatus.value == 1
})

//表单数据改变 反馈到最上面的表格中
watch(() => formData.value, (newValue, oldValue) => {
    if (!editable.value) return
    //计算关联更新
    let tableRow = docTableData.value[0] || {}
    Object.assign(tableRow, formData.value)
    let processCostValue = Number.parseFloat(tableRow.totalProcessCost)
    let afterProcessCostValue = Number.parseFloat(tableRow.totalAfterProcessCost)
    let extraCostValue = Number.parseFloat(tableRow.extraCost)
    if (Number.isNaN(afterProcessCostValue)) {
        tableRow.varianceAmount = '0.00'
        tableRow.varianceRate = '0.00'
    }
    else {
        let { varianceNum, varianceRate } = calcVariance(afterProcessCostValue, processCostValue)
        //差异金额 = 总加工费(改后) -总加工费(改前)
        tableRow.varianceAmount = varianceNum
        //差异率 = 差异金额/总加工费(改前)
        tableRow.varianceRate = varianceRate
    }
    //总金额：以“加工费+额外费用”计算
    tableRow.totalAmount = ((!Number.isNaN(afterProcessCostValue) ? afterProcessCostValue : (processCostValue || 0)) + (extraCostValue || 0)).toFixed(2)

    if (manufacturerInfo.value.loaded) {
        //开票金额
        tableRow.invoiceCost = formData.value.isTax === 1 ? calcInvoiceCost() : '0.00'
        calcMeetCost(tableRow)
    }
}, {
    deep: true
})

//计算应付金额
let calcMeetCost = (tableRow) => {
    //应付金额 = 总金额-扣款金额- 预付款核销 + 税点金额
    tableRow.meetCost = (parseFloat(tableRow.totalAmount || 0) - parseFloat(tableRow.deductionCost || 0) - parseFloat(tableRow.writeoffCost || 0)
        + ((formData.value.isTax == 1) ? Number.parseFloat(taxAmount.value) : 0)).toFixed(2)
}

/**
 * 开票金额计算
 * 以“（总金额-扣款金额-预付款核销）*收费税点“计算，收费税点在加工商信息中展示，待选择开票后进行计算，计算结果保留两位小数。非负数，整数部分最大为十位数。
 */
let calcInvoiceCost = p => {
    let tableRow = docTableData.value[0]
    let { totalAmount, deductionCost, writeoffCost } = tableRow
    let finalInvoiceCost = '0.00'
    if (editable.value) {
        let taxPoint = Number.parseFloat(taxPointShow.value)
        if (!Number.isNaN(taxPoint)) {
            finalInvoiceCost = numberFloor(((totalAmount || 0) - (deductionCost || 0) - (writeoffCost || 0)) * ((taxPoint || 0) / 100)).toFixed(2)
        }
        //编辑模式下 以这里实时计算的开票金额为准(覆盖表格的数据)
        let tableRow = docTableData.value[0] || {}
        //开票金额
        tableRow.invoiceCost = formData.value.isTax === 1 ? finalInvoiceCost : '0.00'
        //应付金额
        calcMeetCost(tableRow)
    } else {
        finalInvoiceCost = Number(tableRow.invoiceCost).toFixed(2)
    }
    return finalInvoiceCost;
}

/**
 * 税点金额计算 = 开票金额
 */
let taxAmount = computed(p => {
    let tableRow = docTableData.value[0]
    return tableRow.invoiceCost
})

/**
 * 输入框格式化
 */
const handleInput = (field) => {
    formData.value[field] = trimToNumber(formData.value[field], 9, 2, false)
}

const handleInputChange = (field) => {
    //输入确定后，截取尾部的小数点
    let value = trimLastDigit(formData.value[field])
    formData.value[field] = value
    //fix:1006034 用户删除了加工费（改后）的数值，就直接变为0
    if (field == 'extraCost' && Number.isNaN(Number.parseFloat(formData.value[field]))) {
        value = '0.00'
        formData.value[field] = value
    }
    if (field == 'totalAfterProcessCost' && Number.isNaN(Number.parseFloat(formData.value[field]))) {
        value = '0.00'
        formData.value[field] = value
    }
}

//切换账户
const accountId = ref(0)
const manufacturerIdRef = ref(0)
const changeAccountDialogRef = ref()
const handleOpenChangeAccountDialog = () => {
    changeAccountDialogRef.value.openDialog({
        selectedAccountId: formData.value.paymentAccountId,
        manufacturerID: manufacturerIdRef.value,
    });
}
const handleChangeAccount = async (selectedAccount) => {
    let { manufacturerAccountId, payeeName, paymentAccount, paymentBank } = selectedAccount
    Object.assign(formData.value, { paymentAccountId: manufacturerAccountId, payeeName, paymentAccount, paymentBank })
    accountId.value = manufacturerAccountId
}

//切换开票
const handleTaxChange = () => {
    //查询最新的税点和税率
    queryManufacturerDetail()
}

//检查错误码后刷新界面数据
const checkErrorCodeAndRefresh = (code, message) => {
    /*
     S-000019  未找到加工商数据
     S-000036  结款单当前状态不支持该操作  这时候刷新后，页面的按钮也应该变化
     S-000039  加工商未配置默认收款账户信息
     S-000050  加工商已被删除，请重新调整
     S-000051   流程状态已修改请重新审核 */
    if (['S-000019', 'S-000036', 'S-000039', 'S-000050','S-000051'].indexOf(code) > -1) {
        ElMessageBox.alert(message, '提示', {
            confirmButtonText: '好的',
            callback: (action) => {
                loadData()
            },
        })
        return true;
    }
    return false
}

//修改
const editFormRef = ref()
const handleEdit = () => {
    editFormRef.value.validate((valid, fields) => {
        if (valid) {
            $vue.$yun.showModal({
                title: '保存修改',
                content: '是否保存本次修改结果？',
            }).then((res) => {
                if (res.type == 'confirm') {
                    doEdit()
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
const doEdit = async (accountConfirmed) => {
    if(!accountConfirmed){
        //检查加工商的账户是否被删除
        if(!await checkManufacturer(()=>doEdit(true))) return;
    }
    let { paymentNum, manufacturerId } = detailInfo.value
    let { code, message = '服务错误', data } = await updateSettlement({
        id: billId, paymentNum, manufacturerId,
        ...formData.value
    })
    if (code !== window.HTTP_SUCCESS) {
        if (checkErrorCodeAndRefresh(code, message)) {
            return
        }
        $vue.$message.error({ message})
    } else {
        editFormRef.value.resetFields()
        loadData()
        $vue.$message.success({ message: '修改成功' })
    }
}
//放弃修改
const handleCancelAudit = () => {
    $vue.$yun.showModal({
        title: '放弃修改',
        content: '是否放弃保存本次修改结果？',
    }).then((res) => {
        if (res.type == 'confirm') {
            editFormRef.value.resetFields()
            loadData()
        }
    })
}


//产业园财务-提交审核
const handleSubmit = () => {
    editFormRef.value.validate((valid, fields) => {
        if (valid) {
            $vue.$yun.showModal({
                title: '提交审核',
                content: '是否提交审核？',
            }).then((res) => {
                if (res.type == 'confirm') {
                    doSubmit()
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

//检查加工商是否正常
const checkManufacturer = async(callback)=>{
    let { code, data, message = '服务错误' } = await getManufacturerDetail(manufacturerIdRef.value)
    if (code !== window.HTTP_SUCCESS) {
         $vue.$message.error({ message })
         return false;
    }
    if(!data){
        $vue.$message.error({ message:'未查询到加工商信息' })
      return false;
    }

    let accounts = data.manufacturerAccountList ||[]
    if (accounts.findIndex(p => p.manufacturerAccountId ==  (formData.value.paymentAccountId+'')) == -1) {
        ElMessageBox.confirm(
            '付款账户已被删除，是否使用默认账户？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }
        ).then(() => {
            callback && callback()
        })
        return false;
    }

    return true
}

const doSubmit = async (accountConfirmed) => {
    if(!accountConfirmed){
        //检查加工商的账户是否被删除
        if(!await checkManufacturer(()=>doSubmit(true))) return;
    }
    let { paymentNum, manufacturerId } = detailInfo.value
    let { code, message = '服务错误', data } = await submitSettlement({
        id: billId, paymentNum, manufacturerId, ...formData.value,
        taxPoint: taxPointShow.value, //接口单位是百分比，所以不需要转化
        taxRate: (taxRateShow.value / 100).toFixed(2) //接口单位是小数，所以要转化一下。
    })
    if (code !== window.HTTP_SUCCESS) {
        if (checkErrorCodeAndRefresh(code, message)) {
            return
        } 
        $vue.$message.error({ message})
    } else {
        //loadData()
        $vue.$message.success({ message: '提交成功' })
        closeMe()
    }
}

//总部财务-审核
const auditPass = ref(true);
const auditFormData = ref({})
const auditDialogVisible = ref(false)
const auditFormRef = ref();
const handleShowAuditDialog = (pass) => {
    auditPass.value = pass
    auditDialogVisible.value = true
    auditFormRef.value && auditFormRef.value.resetFields()
}

const handleAudit = async ({ confirm }) => {
    if (!confirm) return
    auditFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            let { code, data, message = '服务错误' } = await auditSettlement({
                id: billId,
                auditStatus: auditPass.value ? 1 : 2,//审核状态：1.通过，2.不通过
                remark: auditFormData.value.remark,
                maxAuditId:detailInfo.value.maxAuditId,
            })
            if (code === window.HTTP_SUCCESS) {
                auditFormRef.value.resetFields();
                auditDialogVisible.value = false
                $vue.$message.success({ message: '提交成功' })
                closeMe()
            } else {
                if (checkErrorCodeAndRefresh(code, message)) {
                    return
                }
                $vue.$message.error({ message})
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

//图片查看
const imgViewerVisible = ref(false)
const imgViewerUrls = ref([])
const handlePreviewImg = (url) => {
    imgViewerVisible.value = true
    imgViewerUrls.value = [url]
}

//上传付款凭证
const uploadAssetsDialogRef = ref()
const handleUpload = () => {
    uploadAssetsDialogRef.value.openDialog({
        id: billId
    })
}


//上传成功，刷新界面
const handleUploadSuccess = () => {
    window.location.href =  window.location.href;
}

//关闭弹框
const closeMe = () => {
    //判定依据：从待办过来的都会带有billNum参数
    //let canClose = (window.location.search||'').indexOf('billNum')>-1;
    //if(canClose){
    postRefreshSettlementListMessage()
    //刷新消息列表
    postRefreshPendingListMessage();
    //关闭窗口
    window.setTimeout(window.close, 1500)
    //}
}

</script>

<style lang="scss" scoped>
.settlement-detail-setttlement-tab {
    position: relative;
    margin: 0 0;
    height: calc(100vh - 240px);
    overflow-y: scroll;
}

.sec-wrap {
    margin: 0 32px 36px 32px;
}

.sec-flowchart {
    max-width: 50%;
}

.sec-title {
    line-height: 24px;
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
}

.bill-no {
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    line-height: 21px;
    margin-bottom: 12px;
}

.form {
    width: 50%;
}

.input {
    max-width: 200px;
}

.ac-description {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;

    &__item {
        margin: 0;
        padding: 0;
        font-size: 14px;
        color: #333;
        line-height: 21px;
        white-space: nowrap;
        margin-right: 10px;
        margin-bottom: 8px;
    }

    &__content {
        display: inline-block;
        margin: 0 0 0 8px;
        padding: 0;
        margin-right: 60px;
        font-size: 14px;
        color: #666;
        line-height: 21px;
        white-space: nowrap;
        min-width: 147px;
    }
}

:deep(.el-table th.el-table__cell) {
    background-color: #F2F2F2;
}

.btn-link {
    margin-left: 8px;
    color: var(--vt-c-theme-colors);
    font-size: 14px;
    font-weight: 400;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &.abs {
        position: absolute;
        right: 32px;
    }

    &:hover {
        opacity: 0.75;
    }
}

.tab-footer {
    position: fixed;
    bottom: 40px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba($color: #FFF, $alpha: 0.8);

    .el-button {
        margin: 0 40px;
    }
}

.img-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    .img-item {
        position: relative;
        width: 200px;
        height: 150px;
        margin-right: 16px;
        cursor: pointer;

        .icon-preview {
            position: absolute;
            right: 4px;
            bottom: 4px;
            cursor: pointer;

            &:hover {
                opacity: 0.75;
            }
        }
    }

    .img {
        width: 200px;
        height: 150px;
        object-fit: cover;
        overflow: hidden;
        margin: 0 12px 12px 0;
    }
}

.dialog-title {
    font-size: 14px;
    color: #333;
    line-height: 21px;
    margin-top: 0;
    margin-bottom: 16px;
}
</style>
<template>
    <div class="unitChargeDetailContainer">
        <CommonBreadCrumb :first="'计费规则配置'" :marginBottom="'16px'" />
        <div class="unitChargeDetailBox">
            <div class="leftContainer">
                <div class="detailText">计费详情</div>
                <div class="detailBox">
                    <div class="titleBox">
                        <div>工艺:</div>
                        <div>计价公式:</div>
                        <div>提审时间:</div>
                        <div>加工商:</div>
                        <div>状态:</div>
                    </div>
                    <div class="contentBox">
                        <div>{{ chargingRuleInfo.attributeName }}</div>
                        <div>{{ chargingRuleInfo.formulaDesc }}</div>
                        <div :style="{ opacity: !!chargingRuleInfo.submitAuditTime ? 1 : 0 }">{{
                            chargingRuleInfo.submitAuditTime || "占位" }}</div>
                        <div>{{ `${chargingRuleInfo.manufacturerName}` }}</div>
                        <div :style="{ color: hisStatusColorMap(chargingRuleInfo.ruleStatus) }">{{
                            statusDescFn(chargingRuleInfo.ruleStatus) }}</div>
                    </div>
                </div>
                <div class="tableBox">
                    <uniPriceRuleTable :tableData="ruleTableData" :attributeId="chargingRuleInfo.attributeId" >
                    </uniPriceRuleTable>
                </div>
                <div class="footer" v-if="chargingRuleInfo.ruleStatus == 2 && chargingRuleInfo.auditStatus == -1">
                    <div class="submitBox">
                        <el-button type="primary" class="search_button passAudit" @click="audit(1)">审核通过</el-button>
                        <el-button type="primary" class="noPassAudit" @click="audit(2)">审核不通过</el-button>
                    </div>
                </div>
            </div>
            <div class="rightContainer">
                <!-- 审核流程容器 -->
                <div class="auditFlowContainer">
                    <div class="auditHeadBox">
                        <div class="text">审核流程</div>
                        <div class="operateBox" @click="changeShowType">
                            <template v-if="!showFlag">
                                <div class="text">收起</div>
                                <img class="img" src="@/assets/images/up.png" alt="">
                            </template>
                            <template v-if="showFlag">
                                <div class="text">展开</div>
                                <img class="img" src="@/assets/images/down.png" alt="">
                            </template>
                        </div>
                    </div>
                    <div class="auditFlowBox">
                        <!-- 空流程提示 -->
                        <div class="emptyFlowBox" v-if="!recordListData?.length">
                            <img class="img" src="@/assets/images/emptyFlow.png" alt="">
                            <div class="text">暂无审核流程~</div>
                        </div>
                        <!-- 正常审核流程 -->
                        <div class="flowBox" v-if="recordListData?.length && !showFlag">
                            <el-steps direction="vertical">
                                <el-step v-for="(item, index) in recordListData" :key="item.id">
                                    <template v-slot:icon>
                                        <img class="statusImg"
                                            :src="getImageUrl(auditStatusImg(item.auditStatus, index == recordListData.length - 1))"
                                            alt="">
                                    </template>
                                    <template v-slot:title>
                                        <div class="itemBox">
                                            <div class="headBox">
                                                <div class="name">
                                                    <span v-if="item.auditUserName">
                                                        {{ item.auditUserName }}-
                                                    </span>
                                                    {{ item.roleName }}
                                                </div>
                                                <div class="tiemBox">
                                                    <div class="title">{{ item.auditStatus !== -1 ? '审核时间' : '提交时间' }}:
                                                    </div>
                                                    <div class="time">{{ item.auditTime || '-' }}</div>
                                                </div>
                                                <div class="resultBox">
                                                    <div class="title">流程状态:</div>
                                                    <div class="result" :style="{ color: auditStatuColor }">{{
                                                        auditStatuDesc(item.auditStatus, index == recordListData.length - 1)
                                                    }}</div>
                                                </div>
                                            </div>
                                            <div class="reasonBox">
                                                {{ item.remark }}
                                            </div>
                                        </div>
                                    </template>
                                </el-step>
                            </el-steps>
                        </div>
                        <!-- 收起审核流程 -->
                        <div class="putAwayFlowBox" v-if="recordListData?.length && showFlag">
                            <el-steps direction="vertical">
                                <el-step>
                                    <template v-slot:icon>
                                        <img class="statusImg"
                                            :src="getImageUrl(auditStatusImg(recordListData[0].auditStatus, false))" alt="">
                                    </template>
                                    <template v-slot:title>
                                        <div class="itemBox">
                                            <div class="headBox">
                                                <div class="name">
                                                    <span v-if="recordListData[0].auditUserName">
                                                        {{ recordListData[0].auditUserName }}-
                                                    </span>
                                                    {{ recordListData[0].roleName }}
                                                </div>
                                                <div class="tiemBox">
                                                    <div class="title">{{ recordListData[0].auditStatus !== -1 ? '审核时间' :
                                                        '提交时间' }}:</div>
                                                    <div class="time">{{ recordListData[0].auditTime || '-' }}</div>
                                                </div>
                                                <div class="resultBox">
                                                    <div class="title">流程状态:</div>
                                                    <div class="result" :style="{ color: auditStatuColor }">{{
                                                        auditStatuDesc(recordListData[0].auditStatus, false) }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="reasonBox">
                                                {{ recordListData[0].remark }}
                                            </div>
                                        </div>
                                    </template>
                                </el-step>
                                <el-step>
                                    <template v-slot:icon>
                                        <img class="statusImg" src="../../assets/images/greenRound.png" alt="">
                                    </template>
                                    <template v-slot:title>
                                        <div class="unfoldBox">
                                            共收起{{ recordListData.length - 2 }}个审核流程
                                        </div>
                                    </template>
                                </el-step>
                                <el-step>
                                    <template v-slot:icon>
                                        <img class="statusImg"
                                            :src="getImageUrl(auditStatusImg(recordListData[recordListData.length - 1].auditStatus, true))"
                                            alt="">
                                    </template>
                                    <template v-slot:title>
                                        <div class="itemBox">
                                            <div class="headBox">
                                                <div class="name">
                                                    <span v-if="recordListData[recordListData.length - 1].auditUserName">
                                                        {{ recordListData[recordListData.length - 1].auditUserName }}-
                                                    </span>
                                                    {{ recordListData[recordListData.length - 1].roleName }}
                                                </div>
                                                <div class="tiemBox">
                                                    <div class="title">{{ recordListData[recordListData.length -
                                                        1].auditStatus !== -1 ? '审核时间' : '提交时间' }}:</div>
                                                    <div class="time">{{
                                                        recordListData[recordListData.length - 1].auditTime || '-' }}</div>
                                                </div>
                                                <div class="resultBox">
                                                    <div class="title">流程状态:</div>
                                                    <div class="result" :style="{ color: auditStatuColor }">{{
                                                        auditStatuDesc(recordListData[recordListData.length -
                                                            1].auditStatus, true)
                                                    }}</div>
                                                </div>
                                            </div>
                                            <div class="reasonBox">
                                                {{ recordListData[recordListData.length - 1].remark }}
                                            </div>
                                        </div>
                                    </template>
                                </el-step>
                            </el-steps>
                        </div>
                    </div>
                </div>
                <!-- 历史版本容器 -->
                <div class="versionContainer">
                    <div class="headBox">
                        <div class="text">历史版本</div>
                        <div class="catBox" @click="toPage">
                            <div class="text">查看全部历史</div>
                            <img class="img" src="@/assets/images/right.png" alt="">
                        </div>
                    </div>
                    <div class="versionsTableBox">
                        <el-table :data="historyTableData" border @row-click="jumpPage" :row-style="rowStyle">
                            <el-table-column label="版本号" align="center">
                                <template #default="scope">
                                    <div>{{ scope.row.version == chargingRuleInfo.version ? `V${scope.row.version}（当前版本）` :
                                        `V${scope.row.version}` }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="创建时间" align="center">
                                <template #default="scope">
                                    <div>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" align="center">
                                <template #default="scope">
                                    <div :style="{ color: hisStatusColorMap(scope.row.ruleStatus) }">
                                        {{ statusDescFn(scope.row.ruleStatus) }}
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <!-- 审核弹框 -->
        <div class="popupContainer">
            <el-dialog v-model="showPop" :show-close="false" :destroy-on-close="true" :close-on-click-modal="false" width="700">
                <template #header>
                    <div class="hintBox">
                        <div class="text" v-if="auditStatus == 1">审核通过</div>
                        <div class="text" v-if="auditStatus == 2">审核不通过</div>
                        <img class="closeImg" src="@/assets/images/close.png" alt="" @click="colsePop">
                    </div>
                </template>
                <div class="hintContent" v-if="auditStatus == 1">是否确认审核通过？</div>
                <div class="hintContent" v-if="auditStatus == 2">是否确认审核不通过？若确认请填写备注</div>
                <el-form :inline="true" ref="ruleFormRef" :model="formParam" :rules="rules" class="infoFormBox">
                    <el-form-item label="备注:" prop="remarks">
                        <el-input v-model.trim="formParam.remarks" placeholder="请在此添加备注" resize="none" show-word-limit
                            type="textarea" class="remarks" maxlength="200"
                            input-style="width: 596px;height: 120px;color:#333333;" />
                    </el-form-item>
                </el-form>
                <div class="btnBox">
                    <el-button type="primary" class="search_button confirm" @click="confirm(ruleFormRef)">确定</el-button>
                    <el-button type="primary" plain class="cancel" @click="colsePop">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script name="unitChargeRuleAuditCGJLDetail" setup>
import { ElMessage } from "element-plus";
import uniPriceRuleTable from "@/views/unitChargeRule/components/uniPriceRuleTable.vue"
import { getParkDetail, getAuditRecordList, getBillRuleHisPage, auditBillRuleHttp } from "@/api/modules/unitChargeRule"
import { ref, reactive, computed, watch } from "vue";
import { setLoginModule, getUserInfo, openNewPage } from "@/utils/commonApi"
import { useRoute, useRouter } from "vue-router";
import { parseTime } from "@/utils/util";
import {useBroadcast} from '@/hooks/component/useBroadcast'

import greenRound from '../../assets/images/greenRound.png';
import redRound from '../../assets/images/redRound.png';
import yellowRound from '../../assets/images/yellowRound.png';
const ruleFormRef = ref();
let formParam = reactive({
    remarks: ""
})
// 获取计价公式
const route = useRoute()
const router = useRouter()

let chargingRuleInfo = reactive({})
const ruleTableData = ref([])
const getDetailInfoFn = async () => {
    const res = await getParkDetail({ id: route.query.id })
    if (res.code !== '000000') return ElMessage.error(res.message)
    Object.assign(chargingRuleInfo, res.data);
    ruleTableData.value = res.data.attributeTypes;
    if (res.data.attributeTypes) {
        ruleTableData.value.push({
            typeName: '折扣优惠',
            preferentialWay: res.data.preferentialWay == 1 ? "无优惠" : "加工费折扣",
            discountVal: Number(res.data.discountVal).toFixed(2)
        });
    }
}

// 获取审批历史记录
const recordListData = ref([])
const getAuditRecordListFn = async () => {
    const res = await getAuditRecordList({ id: route.query.id })
    if (res.code !== '000000') return ElMessage.error(res.message)
    recordListData.value = res.data
    if (chargingRuleInfo.ruleStatus == 2) {
        if (chargingRuleInfo.auditStatus == -1) {
            recordListData.value.push({
                auditUserName: "",
                roleName: "采购经理",
                auditStatus: 5
            })
        } else if (chargingRuleInfo.auditStatus == 1) {
            recordListData.value.push({
                auditUserName: "",
                roleName: "产业园财务",
                auditStatus: 5
            })
        }
    }
}
const showFlag = ref(false)
watch(() => recordListData.value.length, () => {
    if (recordListData.value?.length > 3) showFlag.value = true
})
const changeShowType = () => {
    if (!recordListData.value?.length || recordListData.value?.length < 4) return
    showFlag.value = !showFlag.value
}

// 历史版本分页查询
const historyTableData = ref([])
const getBillRuleHistPageFn = async () => {
    const res = await getBillRuleHisPage({
        attributeId: chargingRuleInfo.attributeId,
        language: "zh-cn",
        manufacturerId: chargingRuleInfo.manufacturerId,
        pageNumber: 1,
        pageSize: 3,
        valuationFormulaId: chargingRuleInfo.valuationFormulaId
    })
    if (res.code !== '000000') return ElMessage.error(res.message)
    historyTableData.value = res.data.items;
}


// 初始化页面数据
function initPageFn() {
    getDetailInfoFn().then(() => {
        getBillRuleHistPageFn()
        getAuditRecordListFn()
    })
}
initPageFn()

let auditStatuColor = ""
let auditStatusImg = (val, last) => {
    if (val == -1) {
        auditStatuColor = "#666666"
        return greenRound
    }
    if (val == 5) {
        auditStatuColor = "#F9B300"
        return yellowRound
    }
    // 1.采购经理通过，2.采购经理不通过，3.产业园财务通过，4.产业园财务不通过
    if (val % 2 === 0) {
        auditStatuColor = "#F14932"
        return redRound
    } else {
        auditStatuColor = "#338F7A"
        return greenRound
    }
}
function auditStatuDesc(val, last) {
    if (val == -1) {
        return "提交审核"
    }
    if (val == 5) {
        return "审核中"
    }
    // 1.采购经理通过，2.采购经理不通过，3.产业园财务通过，4.产业园财务不通过
    if (val % 2 === 0) {
        return "审核不通过"
    } else {
        return "审核通过"
    }
}
const hisStatusColorMap = (val) => {
    if (val === 1) return "#338F7A"
    if (val === 2) return "#F9B300"
    return "#666666"
}
const statusColor = computed(() => {
    let map = {
        3: "#F14932",
        2: "#F9B300",
        4: "#338F7A",
        1: "#338F7A"
    }
    return map[chargingRuleInfo.ruleStatus]
})
const statusDescFn = (type) => {
    let map = {
        1: "草稿",
        2: "审核中",
        3: "未启用",
        4: "启用中",
        5: "已失效"
    }
    return map[type]
}


// 备注校验
const validateRemarks = (rule, value, callback) => {
    if (auditStatus.value == 2 && value == '') {
        callback(new Error('请输入备注'))
    } else {
        callback()
    }
}
// 审核状态
let auditStatus = ref("")
// 规则
let rules = reactive({
    remarks: {
        required: computed(() => {
            return auditStatus.value == 2 ? true : false
        }), validator: validateRemarks, trigger: 'blur'
    }
});

// 是否显示弹窗
let showPop = ref(false)
// 引入本地图片
function getImageUrl(url) {
    return new URL(url, import.meta.url).href;
}
// 跳转页面
const toPage = () => {
    let pathInfo = router.resolve({ //使用resolve
        name: 'historyVersionList',    //这里是跳转页面的name
        // path: '/unitChargeRule/historyVersionList',
        path: `/${setLoginModule()}/unitChargeRule/historyVersionList`,
        query: {
            attributeId: chargingRuleInfo.attributeId, // 工艺id
            manufacturerId: chargingRuleInfo.manufacturerId, // 加工商类型id
            valuationFormulaId: chargingRuleInfo.valuationFormulaId, // 计价公式id
            version: chargingRuleInfo.version,
            detail: "/unitChargeRule/unitChargeRuleAuditCGJLDetail"
        }
    })
    window.open(pathInfo.href, '_blank')
};
// 当前行跳转
const jumpPage = (row) => {
    if (row.version == chargingRuleInfo.version) {
        return
    }
    openNewPage(`/unitChargeRule/unitChargeRuleAuditCGJLDetail?id=${row.id}`)
}
const rowStyle = (row) => {
  if (row.row.version == chargingRuleInfo.version) {
    return { cursor: "not-allowed" }
  } else {
    return { cursor: "pointer" }
  }
}
// 审核
const audit = (status) => {
    // 2 审核不通过  1 审核通过
    auditStatus.value = status
    showPop.value = true
}
// 保存
const confirm = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid, fields) => {
        if (valid) {
            let params = {
                auditStatus: auditStatus.value,
                billRuleId: chargingRuleInfo.id,
                enableTime: parseTime(new Date()),
                remark: formParam.remarks
            }
            let { code, message } = await auditBillRuleHttp(params);
            if (code == '000000') {
                let channel = new BroadcastChannel("channel-unitChargeRuleListAuditCGJL");
                channel.postMessage({ refreshData: true })
                ElMessage.success('成功')
                //刷新待办列表
                let {postRefreshPendingListMessage}  = useBroadcast()
                postRefreshPendingListMessage();
                colsePop()
                setTimeout(() => {
                    channel.close()
                    window.close()
                }, 1000)
            } else {
                ElMessage.error(message)
            }
        } else {
            console.log("error submit!", fields);
        }
    });
};
// 关闭弹窗
const colsePop = () => {
    showPop.value = false
    ruleFormRef.value.resetFields()
}
</script>
<style lang="scss">
.discountSelect {

    // 修改下拉框宽度
    .el-select-dropdown {
        width: 120px !important;
        min-width: 120px !important;
    }
}
</style>
<style lang="scss" scoped>
.unitChargeDetailContainer {
    padding: 16px 24px 0 24px;

    .unitChargeDetailBox {
        box-sizing: border-box;
        height: calc(100vh - 110px);
        overflow: auto;
        display: flex;
        padding-bottom: 14px;

        .leftContainer {
            width: 66%;
            margin-right: 24px;
            position: relative;
            // width: 1240px;
            // height: 960px;
            background-color: #FFFFFF;
            padding: 20px 24px 40px 16px;
            color: #333333;
            box-sizing: border-box;

            .versions {
                font-size: 18px;
                font-weight: 700;
            }

            .detailText {
                margin-top: 16px;
                font-weight: 700;
            }

            .detailBox {
                display: flex;

                .titleBox {
                    text-align: right;

                    div {
                        font-size: 14px;
                        margin-top: 16px;
                        line-height: 19px;
                    }
                }

                .contentBox {
                    div {
                        font-size: 14px;
                        color: #666666;
                        margin-top: 16px;
                        margin-left: 8px;
                        line-height: 19px;
                    }
                }
            }

            .tableBox {
                margin-top: 20px;
                max-height: 470px;
                height: calc(100% - 300px);
                overflow: auto;

                &:deep(.el-table__header) {
                    th {
                        // background-color: #f2f2f2;
                        color: #333333;
                        font-weight: 400;
                    }
                }

                // 鼠标经过背景透明
                &:deep(tr:hover>td.el-table__cell) {
                    background-color: transparent;
                }

                &:deep(.el-table__row) {
                    td {
                        padding: 0;

                        .cell {
                            padding: 0;
                        }
                    }
                }

                // 阶梯回显
                .ladderEchoBox {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    color: #333333;

                    .publicLi:first-child {
                        div {
                            background-color: #F2F2F2;
                        }
                    }

                    .publicLi {
                        display: flex;

                        div {
                            flex: 1;
                            border-bottom: 1px solid #E0E0E0;
                            padding: 6px 0;
                        }

                        div:nth-child(even) {
                            border-left: 1px solid #E0E0E0;
                            border-right: 1px solid #E0E0E0;
                        }

                        div:last-child {
                            border-right: 0;
                        }
                    }

                    .publicLi:last-child {
                        div {
                            border-bottom: 0;
                        }
                    }

                }

                // 折扣优惠回显
                .discountEchoBox {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    color: #333333;

                    .publicLi:first-child {
                        div {
                            background-color: #F2F2F2;
                        }
                    }

                    .publicLi {
                        display: flex;

                        div {
                            flex: 1;
                            border-bottom: 1px solid #E0E0E0;
                            padding: 6px 0;
                        }

                        div:nth-child(even) {
                            border-left: 1px solid #E0E0E0;
                            border-right: 1px solid #E0E0E0;
                        }

                        div:last-child {
                            border-right: 0;
                        }
                    }

                    .publicLi:last-child {
                        div {
                            border-bottom: 0;
                        }
                    }
                }
            }
        }

        .rightContainer {
            flex: 1;
            display: flex;
            flex-direction: column;
            // width: 608px;
            // height: 960px;
            background-color: #FFFFFF;
            // margin-left: 24px;
            box-sizing: border-box;
            padding: 20px 16px 64px 16px;
            overflow: auto;

            .auditFlowContainer {
                height: 80%;
                overflow: auto;
                border-bottom: 1px solid #F2F2F2;

                .auditHeadBox {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 16px;

                    .operateBox {
                        display: flex;
                        align-items: center;

                        .text {
                            font-size: 14px;
                            color: #666666;
                        }

                        .img {
                            width: 20px;
                            height: 20px;
                        }
                    }
                }

                .auditFlowBox {
                    height: calc(100% - 38px);
                    // height: 556px;
                    overflow-y: auto;

                    // 空流程提示
                    .emptyFlowBox {
                        width: 140px;
                        height: 173px;
                        margin: 80px auto 0;
                        text-align: center;

                        .img {
                            width: 140px;
                            height: 140px;
                        }

                        .text {
                            font-size: 14px;
                            color: #666666;
                        }
                    }

                    // 正常审核流程
                    .flowBox {
                        .el-step {

                            &:first-child {
                                :deep(.el-step__title) {
                                    margin-top: 8px;
                                }
                            }

                            &:last-child {
                                .itemBox {
                                    margin-bottom: 40px !important
                                }
                            }
                        }

                        &:deep(.el-step__line) {
                            width: 0;
                            border-left: 2px dashed #338F7A;
                            background-color: transparent;
                        }

                        .statusImg {
                            width: 20px;
                            height: 20px;
                        }

                        .itemBox {
                            color: #333333;
                            font-size: 12px;
                            font-weight: 400;
                            padding: 8px 12px;
                            border-radius: 4px;
                            border: 1px solid #E0E0E0;
                            margin-bottom: 32px;

                            .headBox {
                                display: flex;
                                justify-content: space-between;

                                .name {
                                    min-width: 130px;
                                }

                                .tiemBox {
                                    display: flex;
                                    min-width: 185px;

                                    .title {
                                        // white-space: nowrap;
                                    }

                                    .time {
                                        color: #666666;
                                        margin-left: 8px;
                                        // white-space: nowrap;
                                    }
                                }

                                .resultBox {
                                    display: flex;
                                    min-width: 121px;

                                    .result {
                                        color: #338F7A;
                                        margin-left: 8px;
                                    }
                                }
                            }

                            .reasonBox {
                                color: #999999;
                                margin-top: 8px;
                                word-break: break-all;
                            }
                        }
                    }

                    // 收起审核流程
                    .putAwayFlowBox {
                        margin-top: 16px;

                        &:deep(.el-step__line) {
                            width: 0;
                            border-left: 2px dashed #338F7A;
                            background-color: transparent;
                        }

                        .statusImg {
                            width: 20px;
                            height: 20px;
                        }

                        .itemBox {
                            color: #333333;
                            font-size: 12px;
                            font-weight: 400;
                            padding: 8px 12px;
                            border-radius: 4px;
                            border: 1px solid #E0E0E0;
                            margin-bottom: 32px;

                            .headBox {
                                display: flex;
                                justify-content: space-between;

                                .name {
                                    min-width: 130px;
                                }

                                .tiemBox {
                                    display: flex;
                                    min-width: 185px;

                                    .title {
                                        // white-space: nowrap;
                                    }

                                    .time {
                                        color: #666666;
                                        margin-left: 8px;
                                        // white-space: nowrap;
                                    }
                                }

                                .resultBox {
                                    display: flex;
                                    min-width: 121px;

                                    .result {
                                        color: #338F7A;
                                        margin-left: 8px;
                                    }
                                }
                            }

                            .reasonBox {
                                color: #999999;
                                margin-top: 8px;
                                word-break: break-all;
                            }
                        }

                        .unfoldBox {
                            color: #999999;
                            font-size: 14px;
                            margin-bottom: 71px;
                        }
                    }
                }
            }

            .versionContainer {
                height: 28%;
                margin-top: 40px;

                .headBox {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .text {
                        font-size: 16px;
                        color: #333333;
                    }

                    .catBox {
                        display: flex;
                        align-items: center;

                        .text {
                            font-size: 14px;
                            color: #666666;
                        }

                        .img {
                            width: 16px;
                            height: 16px;
                        }
                    }
                }

                .versionsTableBox {
                    overflow: auto;
                    height: calc(100% - 36px);
                    margin-top: 16px;

                    &:deep(.el-table__header) {
                        th {
                            background-color: #f2f2f2;
                            color: #333333;
                            font-weight: 400;
                        }
                    }

                    .el-table {
                        height: 100%;
                    }
                }
            }
        }
    }

    .footer {
        // position: fixed;
        // bottom: 0;
        // left: 0;
        // width: 100%;
        // background-color: #fff;
        // height: 152px;
        // z-index: 999;
        position: absolute;
        bottom: 40px;
        width: calc(100% - 40px);

        .submitBox {
            width: 100%;
            display: flex;
            justify-content: center;

            .noPassAudit {
                width: 96px;
                height: 32px;
                color: var(--vt-c-theme-colors);
                background-color: #FFFFFF;
                border-color: var(--vt-c-theme-colors) !important;
                margin-left: 120px;

                &:hover {
                    opacity: 0.5;
                }
            }

            .passAudit {
                width: 96px;
                height: 32px;
            }
        }

    }

    // 弹窗容器
    .popupContainer {
        &:deep(.el-dialog__header) {
            margin-right: 0;
            padding: 5px 24px;
            background-color: var(--vt-c-theme-colors);
            height: 40px;
            box-sizing: border-box;
        }

        .hintBox {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 30px;

            .text {
                color: #FFFFFF;
            }

            .closeImg {
                width: 30px;
                height: 30px;
            }
        }

        &:deep(.el-dialog__body) {
            padding: 15px 32px 32px 32px;
        }

        .hintContent {
            // margin-left: 7px;
            font-size: 14px;
            color: #333333;
        }

        .infoFormBox {
            margin-top: 16px;

            &:deep(.el-form-item__label) {
                color: #333333;
            }

            .remarks {}
        }

        .btnBox {
            margin-top: 204px;
            text-align: center;

            .confirm {
                width: 96px;
                height: 32px;
            }

            .cancel {
                width: 96px;
                height: 32px;
                background-color: #FFFFFF;
                color: var(--vt-c-theme-colors);
                border-color: var(--vt-c-theme-colors);
                margin-left: 80px;

                &:hover {
                    opacity: 0.5;
                }
            }
        }
    }
}
</style>
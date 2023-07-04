<template>
    <div class="settlement-basic-info-tab">
        <section class="sec-wrap">
            <header class="sec-title">基本信息</header>
            <div class="bill-no">付款单号：{{ basicInfo.paymentNum }}</div>
            <div class="ac-description">
                <span class="ac-description__item">账单月份:<label class="ac-description__content">{{ basicInfo.billMonth
                }}</label>
                </span>
                <span class="ac-description__item">加工商:<label class="ac-description__content">{{ basicInfo.manufacturerName
                }}</label>
                </span>
                <span class="ac-description__item">工艺:<label class="ac-description__content">{{ basicInfo.attributeName
                }}</label>
                </span>
                <span class="ac-description__item">所属产业园:<label class="ac-description__content">{{
                    basicInfo.industrialParkName }}</label>
                </span>
                <span class="ac-description__item">结款方式: <label class="ac-description__content">
                        <!-- 结款方式：1.月结,2.周结,3.现结,4.预付款 -->
                        {{ { '1': '月结', '2': '周结', '3': '现结', '4': '预付款' }[basicInfo.settlementType + ''] || '-' }}
                    </label>
                </span>
                <span class="ac-description__item">状态:<label class="ac-description__content label-status">
                        <!-- 状态：1.待付款，2.付款中，3.已付款 -->
                        {{ { '1': '待付款', '2': '付款中', '3': '已付款' }[basicInfo.status + ''] }}</label>
                </span>
            </div>
        </section>

        <section class="sec-wrap commonTableListBox">
            <header class="sec-title">计费规则</header>
            <div class="content_box">
                <div class="table_box" id="processTableWrap">
                    <el-table v-if="ruleList.length > 0" :data="ruleList" :header-cell-style="{ color: '#333' }" border>
                        <el-table-column prop="formulaDesc" label="公式详情" align="center" />
                        <el-table-column prop="version" label="计费规则版本" width="160" align="center" >
                            <template #default="scope">
                                <span>{{'V'+scope.row.version}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="enableTime" label="启用时间" width="160" align="center">
                            <template #default="scope">
                                <span>{{ parseTime(scope.row.enableTime, '{y}-{m}-{d}') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120" align="center">
                            <template #default="scope">
                                <el-button class="edit_buttom" type="primary" size="small"
                                    @click="handleViewRule(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <noData v-else text="该加工商该工艺暂时没有与之对应的计价公式" height="300px"></noData>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { parseTime } from '@/utils/util'
import { getBaseInfo } from "@/api/modules/settlement"
import { openNewPage } from "@/utils/commonApi"

const { proxy: $vue } = getCurrentInstance()

const payTypeMap = {
    1: '现金支付',
    2: '银行卡支付',
    3: '支付宝支付(转账)',
    4: '微信支付(转账)',
    5: '微信支付'
}

const props = defineProps({
    billId: {
        type: String,
        default: () => { }
    },
})

const basicInfo = ref({
})

//计费规则
const ruleList = ref([])

const loadData = async () => {
    let { code, data, message = '服务错误' } = await getBaseInfo({ id: props.billId })

    if (code !== window.HTTP_SUCCESS) {
        return $vue.$message.error({ message })
    }
    let { billRuleList = [], ...base } = data;
    basicInfo.value = {
        ...base
    }
    ruleList.value.push(...billRuleList)
}

//查看
const handleViewRule = (row) => {
    openNewPage(`/accountChecking/settlement/chargingRules?id=${row.id}&billDetailId=${row.billDetailId}`)
}

onMounted(async (p) => {
    await loadData()
})

</script>

<style  lang="scss">
@import "@/assets/css/listTable.scss";
</style>

<style lang="scss" scoped>

.commonTableListBox{
    padding: 0!important;
    .content_box{
        margin: 0!important;
        padding: 0!important;
    }
}
.settlement-basic-info-tab {
    margin: 0 0 0 0;
    height: calc(100vh - 240px);
    overflow-y: scroll;
}

.sec-wrap {
    margin: 0 32px 36px 32px!important;
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
}</style>
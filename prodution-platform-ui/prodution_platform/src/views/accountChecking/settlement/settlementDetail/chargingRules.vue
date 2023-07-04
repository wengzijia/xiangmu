<template>
    <div class="settlement-charging-rule-page">
        <h1 class="rule-version">V{{ ruleDetail.version }}</h1>
        <h2 class="rule-title">计费规则详情</h2>
        <div class="ac-description">
            <span class="ac-description__item">工艺:<label class="ac-description__content">{{ ruleDetail.attributeName
            }}</label>
            </span>
            <span class="ac-description__item flex-1">计价公式:<label class="ac-description__content">{{ ruleDetail.formulaDesc
            }}</label>
            </span>
            <span class="ac-description__item">创建时间:<label class="ac-description__content">{{
                parseTime(ruleDetail.createTime,
                    '{y}-{m}-{d} {h}:{i}') }}</label>
            </span>
        </div>
        <div class="ac-description">
            <span class="ac-description__item">加工商:<label class="ac-description__content">{{ ruleDetail.manufacturerName
            }}</label>
            </span>
            <span class="ac-description__item flex-1">状态:<label class="ac-description__content label-status"
                    :style="colorMap[ruleDetail.ruleStatus]">{{ statusMap[ruleDetail.ruleStatus] }}</label>
            </span>
            <span class="ac-description__item">启用时间:<label class="ac-description__content">{{
                parseTime(ruleDetail.enableTime,
                    '{y}-{m}-{d}') }}
                    <template v-if="ruleDetail.ruleStatus == 3 && ruleDetail.auditStatus == 3">（未到启用时间）</template>
                </label>
            </span>
        </div>
        <div class="rule-table">
            <uniPriceRuleTable :tableData="ruleDetail.attributeTypes" :attributeId="ruleDetail.attributeId"></uniPriceRuleTable>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { parseTime } from '@/utils/util'
import uniPriceRuleTable from "@/views/unitChargeRule/components/uniPriceRuleTable.vue"
import { getParkDetail, getBillRuleDetailByOrder } from "@/api/modules/unitChargeRule";
import { useRoute } from "vue-router";

const route = useRoute();
let { id, billDetailId } = route.query;
const { proxy: $vue } = getCurrentInstance()

// 状态处理成文字
let statusMap = {
    1: "草稿",
    2: "审核中",
    3: "未启用",
    4: "启用中",
    5: "已失效",
};

// 文字颜色处理
let colorMap = {
    1: "color:#338F7A;",
    2: "color:#F9B300;",
};

const ruleDetail = ref({})

onMounted(() => {
    /* getParkDetail({ id }).then(res => {
        let { code, data, message } = res
        if (code !== window.HTTP_SUCCESS) {
            return $vue.$message.error({ message })
        }
        ruleDetail.value = data
    }); */
    getBillRuleDetailByOrder({ billRuleId:id,billDetailId }).then(res => {
        let { code, data, message } = res
        if (code !== window.HTTP_SUCCESS) {
            return $vue.$message.error({ message })
        }
        if (data.attributeTypes) {
            data.attributeTypes.push({
            typeName: '折扣优惠',
            preferentialWay: data.preferentialWay == 1 ? "无优惠" : "加工费折扣",
            discountVal: Number(data.discountVal).toFixed(2)
        });
    }
        ruleDetail.value = data
    });
})
</script>

<style lang="scss">
.settlement-charging-rule-page {
    max-height: calc(100vh - 120px);
    overflow-y: scroll;
    padding: 32px 40px;

    .rule-version {
        font-size: 17px;
        font-weight: 600;
        color: #333333;
        line-height: 27px;
        margin: 0 0 16px 0;
    }

    .rule-title {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        line-height: 24px;
        margin: 0 0 16px 0;
    }

    .rule-table {
        margin-top: 8px;
        max-width: 1162px;
    }
}
</style>

<style lang="scss" scoped>
.ac-description {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: nowrap;

    &__item {
        margin: 0;
        padding: 0;
        font-size: 14px;
        color: #333;
        line-height: 21px;
        white-space: nowrap;
        margin-right: 10px;
        margin-bottom: 8px;
        min-width: 410px;
    }

    .flex-1 {
        flex: 1;
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
    }

    .label-status {
        color:#666;
    }
}</style>
<template>
    <div class="settlement-detail-page">
        <CommonBreadCrumb :first="'结款单列表'" second="结款单详情页" :marginBottom="'16px'" />
        <div class="divider" />
        <el-tabs v-model="activeTabName" class="settlement-tabs" @tab-click="handleTabClick">
            <el-tab-pane label="基本信息" name="basic" lazy>
                <BasicTab :billId="billId"></BasicTab>
            </el-tab-pane>
            <el-tab-pane label="加工费账单明细" name="procss" lazy>
                <ProcessTab v-if="basicInfo.attributeId && industrialParkId" :basicInfo="basicInfo" ref="processTabRef" :params="{id:billId,industrialParkId}"></ProcessTab>
            </el-tab-pane>
            <!--  <el-tab-pane label="扣款账单明细" name="deduction">
                
            </el-tab-pane> -->
            <el-tab-pane label="结款单明细" name="settlement">
                <SettlementTab :params="{id:billId}"></SettlementTab>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import BasicTab from './components/BasicTab.vue'
import ProcessTab from './components/ProcessTab.vue'
import SettlementTab from './components/SettlementTab.vue'
import { getBaseInfo } from "@/api/modules/settlement"
import { useRoute } from "vue-router";

const { proxy: $vue } = getCurrentInstance()
const route = useRoute()

// 结款单id
const billId = route.query.id
const industrialParkId = ref('')

const activeTabName = ref('settlement')
const processTabRef = ref()
const handleTabClick = (tab, event) => {
    //console.log(tab.paneName, event)
    if(tab.paneName=='procss'){
        //processTabRef.value.autoAdjustTableHeight()
    }
}
const basicInfo = ref({})
const loadData = async () => {
    let { code, data, message = '服务错误' } = await getBaseInfo({id:billId})

    if (code !== window.HTTP_SUCCESS) {
        return $vue.$message.error({ message })
    }
    basicInfo.value = data
    industrialParkId.value = data.industrialParkId
}

onMounted(async (p) => {
    await loadData()
})
</script>

<style lang="scss" scoped>
.settlement-detail-page {
    padding: 18px 32px 0 32px;
    background-color: #FFF;

    .divider {
        border-top: 1px solid #F2F2F2;
    }
}

:deep(.el-tabs__item) {
    height: 58px;
    font-size: 16px;
    line-height: 24px;
    padding: 20px 20px 14px 20px;
    margin: 0 98px 0 32px;

    &:hover {
        color: var(--default-main-color);
    }

    &.is-active {
        color: var(--default-main-color);
    }
}

/* :deep(.el-tabs__header) {
    border-top: 2px solid #F2F2F2;
} */

:deep(.el-tabs__active-bar) {
    background-color: var(--default-main-color);
}

:deep(.el-tabs__active-bar) {
    bottom: 14px;
    height: 1px;
}

:deep(.el-tabs__nav-wrap) {
    &::after {
        background-color: transparent;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
        bottom: 8px;
        height: 60px;
    }
}

.settlement-tabs {
    margin: 0 -32px;
}
</style>
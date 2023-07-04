<template>
    <div>
        <template v-if="tableData.length && tableData[0].billNum">
            <el-table :data="tableData" :header-cell-style="{ color: '#333' }" border>
                <el-table-column prop="billNum" label="对账单号" width="140" align="center" />
                <el-table-column prop="manufacturerName" label="加工商" width="120" align="center" />
                <el-table-column prop="attributeName" label="工艺" width="120" align="center" />
                <el-table-column prop="billDate" label="日期" width="120" align="center" />
                <el-table-column prop="groupSn" label="大版/PO号" width="180" align="center" />
                <el-table-column prop="totalAmount" label="总金额" width="120" align="center" />
                <el-table-column prop="processCost" label="加工费(初始)" width="120" align="center" />
                <el-table-column prop="afterProcessCost" label="加工费(改后)" width="120" align="center">
                    <template #default="scope">
                        <el-input v-if="editing" :class="{ 'is-error': !!errorFields.processingCharges }"
                            ref="processingChargesRef" v-model="scope.row.afterProcessCost" size="small"
                            @input="handleInput('afterProcessCost', scope.row)"
                            @change="handleValidField('afterProcessCost', scope.row)" />
                        <span v-else>{{ defaultZero(scope.row.afterProcessCost, '--') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="varianceAmount" label="差异金额" width="120" align="center" />
                <el-table-column prop="varianceRate" label="加工费差异率" width="120" align="center">
                    <template #default="scope">
                        {{ scope.row.varianceRate ? (scope.row.varianceRate + '%') : '0' }}
                    </template>
                </el-table-column>
                <el-table-column prop="extraCost" label="额外费用" align="center">
                    <template #default="scope">
                        <el-input v-if="editing" :class="{ 'is-error': !!errorFields.extraFee }" ref="extraFeeRef"
                            v-model="scope.row.extraCost" size="small" @input="handleInput('extraCost', scope.row)"
                            @change="handleValidField('extraCost', scope.row)" />
                            <span v-else>{{ defaultZero(scope.row.extraCost) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-table class="table-2" :data="tableData" :header-cell-style="{ color: '#333' }" border>
                <el-table-column prop="lowestConsume" label="最低消费" width="160" align="center">
                    <template #default="scope">
                        {{ defaultZero(scope.row.lowestConsume) }}
                    </template>
                </el-table-column>
                <el-table-column prop="orderNumber" label="订单数量" width="100" align="center" />
                <el-table-column prop="goodNumber" label="良品数" width="100" align="center" />
                 <!-- 动态字段-开始 -->
                 <template v-for="(field,index) in dynamicTableFields">
                    <el-table-column :prop="field.prop"  :label="field.label" :minWidth="field.minWidth" align="center" >
                    <template #default="scope">
                        {{ field.render && field.render(scope) || scope.row[field.prop] }}
                    </template>
                </el-table-column>
                </template>
                <!-- 动态字段-结束 -->
            </el-table>
        </template>
        <template v-else>
            <NoData text="暂时没有对应的加工费明细" height="163px"></NoData>
        </template>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import NoData from '@/components/noData.vue'
import { trimToNumber, trimLastDigit, numberFixed2 } from '@/utils/util.js'
import { defaultZero } from '@/utils/util.js'
import {dynamicFieldsForMonthlyStatement} from '@/views/accountChecking/monthlyStatement/monthlyStatementDetail/accountCheckingMap'
import {numberFloor} from '@/utils/number'
import {calcVariance} from '@/views/accountChecking/monthlyStatement/monthlyStatementDetail/varianceRate'

const { proxy: $vue } = getCurrentInstance()

const props = defineProps({
    //编辑状态
    editing: {
        type: Boolean,
        required: true,
        default: () => ({})
    },
    //账单详情
    mainAccountInfo:{
        type: Object,
        required: true,
        default: () => {}
    },
    //表格数据
    tableData: {
        type: Array,
        required: true,
        default: () => []
    },
    //编辑时错误字段信息
    errorFields: {
        type: Object,
        required: true,
        default: () => {}
    },
})

const processingChargesRef = ref()
const extraFeeRef = ref()
const dynamicTableFields =ref(dynamicFieldsForMonthlyStatement(props.mainAccountInfo.attributeId))

//处理错误显示
const handleValidErrors = ({ field, message }) => {
    switch (field) {
        case 'afterProcessCost':
            processingChargesRef.value.focus()
            $vue.$message.error({ message })
            break;
        case 'extraCost':
            extraFeeRef.value.focus();
            $vue.$message.error({ message })
            break;
    }
}

//事件传递
const emit = defineEmits(['inputChange'])
const handleValidField = (field, row) => {
    let value = trimLastDigit(row[field])
    row[field] = value
    
    //fix:1006034 用户删除了加工费（改后）的数值，就直接变为0
    if(field=='extraCost' && Number.isNaN(Number.parseFloat(row.extraCost))){
        value ='0.00'
        row.extraCost =value
    }
    if(field=='afterProcessCost' && Number.isNaN(Number.parseFloat(row.afterProcessCost))){
        value ='0.00'
        row.afterProcessCost =value
    }

    emit('inputChange', { field, value })
    calcValues(field)

}

const handleInput = (field, row) => {
    row[field] = trimToNumber(row[field],9,2, false)
}

//计算关联字段数据
const calcValues = (field) => {
    let row = props.tableData && props.tableData[0] || {}
    let processCostValue = Number.parseFloat(row.processCost)
    let afterProcessCostValue = Number.parseFloat(row.afterProcessCost)
    let extraCostValue = Number.parseFloat(row.extraCost)
    //console.log("calcValues-111", processCostValue, afterProcessCostValue, extraCostValue)

    let {varianceNum, varianceRate} = calcVariance(afterProcessCostValue,processCostValue)
    row.varianceAmount = varianceNum//差异金额
    row.varianceRate = varianceRate//差异率

    //console.log("calcValues-333", afterProcessCostValue, row.processCost, extraCostValue)
    row.totalAmount = ((!Number.isNaN(afterProcessCostValue) ? afterProcessCostValue : (processCostValue||0)) + (extraCostValue || 0)).toFixed(2)
}

//翻译列表字段（长（改后）、宽（改后））
const renderLengthAndwidth = function (row, key) {
    //长（改后）、宽（改后）：未修改时显示”--“，若只修改其中一个，另外一个展示”初始“值
    if (!row.afterLength && !row.afterWidth) {
        return '--'
    } else {
        return row[key] || '初始'
    }
}

//对外方法
defineExpose({
    //处理验证错误
    handleValidErrors
})
</script>

<style lang="scss">
.is-error .el-input__wrapper {
    box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}

.el-textarea.is-error .el-textarea__inner {
    box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}
</style>

<style lang="scss" scoped>
.table-2 {
    margin-top: 20px;
}
</style>
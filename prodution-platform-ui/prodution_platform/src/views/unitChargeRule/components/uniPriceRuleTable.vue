
<template>
    <div class="page_box">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="typeName" label="类型" width="120px" align="center">
                <template #default="scope">
                    <div style="color: #333333;">{{ scope.row.typeName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="单价规则" align="center">
                <template #default="scope">
                    <!-- 阶梯回显 -->
                    <template v-if="scope.row.typeName !== '折扣优惠' && tableData.length">
                        <ul>
                            <li class="publicLi">
                                <div class="td-first-fixed">
                                    数量阶梯
                                </div>
                                <!-- <div>
                                  
                                    最低消费(元)
                                </div> -->

                                <!-- <div v-if="scope.row.billRuleDetails[0] && scope.row.billRuleDetails[0].machineAdjustCost">
                                    基础调机费
                                </div>
                                <div v-if="scope.row.billRuleDetails[0] && scope.row.billRuleDetails[0].modNum">
                                    基础模数
                                </div>
                                <div v-if="scope.row.billRuleDetails[0] && scope.row.billRuleDetails[0].machineAdjustPrice">
                                    调机费单价
                                </div> -->

                                <!-- <div>
                                    单价({{ scope.row.billRuleDetails[0].unitPriceUnit == 1 ? '元/平方米' : '元/公斤' }})
                                    单价(元/平方米)
                                    单价({{ getUnits(scope.row.billRuleDetails[0].unitPriceUnit) }})
                                </div> -->

                                <div v-for="val in attributeIdHeader(attributeId)">{{ val.title }}</div>

                            </li>
                            <li class="publicLi" v-for="(item, index) in scope.row.billRuleDetails" :key="item.id">
                                <div class="td-first-fixed">{{ item.gradStart }} - {{ item.gradEnd || "无上限" }}</div>
                                <!-- <div>{{ item.lowestConsume }}</div> -->
                                <!-- <div>{{ item.unitPrice }}</div> -->
                                <div v-for="val in attributeIdHeader(attributeId)">{{ item[val.key] }}</div>

                            </li>
                        </ul>
                    </template>
                    <!-- 折扣优惠回显 -->
                    <template v-else>
                        <ul class="discountEchoBox">
                            <li class="publicLi">
                                <div class="td-first-fixed">优惠方式</div>
                                <div>折扣</div>
                                <!--  自动补齐剩余的列，这样和上面的表格中的数据列数对齐 -->
                                <template v-for="(val, index) in attributeIdHeader(attributeId)">
                                    <!--  排除已有的第1,2列 -->
                                    <div v-if="index > 0"></div>
                                </template>
                            </li>
                            <li class="publicLi">
                                <div class="td-first-fixed">{{ scope.row.preferentialWay }}</div>
                                <div>{{ scope.row.discountVal == false ? '--' : scope.row.discountVal }}</div>
                                <!--  自动补齐剩余的列，这样和上面的表格中的数据列数对齐 -->
                                <template v-for="(val, index) in attributeIdHeader(attributeId)">
                                    <!--  排除已有的第1,2列 -->
                                    <div v-if="index > 0"></div>
                                </template>
                            </li>
                        </ul>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script name="unitPriceTable" setup>
import { ref } from "vue";
import { attributeIdHeader } from "@/utils/maps/commonMap"

const props = defineProps({
    tableData: {
        type: Array,
        default: () => []
    },
    attributeId: {
        type: String,
        default: ''
    }
});
const getUnits = (type) => {
    const units = {
        1: '元/平方米',
        2: '元/个',
        3: '分/个'
    }
    return units[type] || '元/平方米'
}

</script>

<style lang="scss" scoped>
.page_box {
    height: 100%;

    :deep(.el-table) {
        height: 100%;
    }

    :deep(.el-table__body-wrapper) {
        height: calc(100% - 40px);
    }

    :deep(.el-table__header) {
        .cell {
            color: #333 !important;
            font-weight: 500 !important;
        }
    }
}

ul {
    padding-inline-start: 0;
    margin: 0;
}

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

.td-first-fixed {
    width: 200px;
    padding: 6px 0;
    flex: none !important;
}
</style>
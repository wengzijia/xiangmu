<template>
    <div class="commonTableListBox">
        <div class="select_bottom">
            <div class="select_group">
                <el-form :inline="true" :model="searchData" class="demo-form-inline" style="width:100%;"
                    ref="searchFormRef">
                    <el-form-item label="对账单号" prop="billNum"
                        :rules="[{ type: 'string', pattern: /\d{4,}/, message: '请输入至少四位数字进行搜索', trigger: ['blur', 'change'] }]">
                        <el-input style="width:200px" v-model="searchData.billNum" placeholder="请输入,最少4位"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="大版/PO号" prop="groupOrPoSn"
                        :rules="[{ type: 'string', pattern: /\d{4,}/, message: '请输入至少四位数字进行搜索', trigger: ['blur', 'change'] }]">
                        <el-input style="width:200px" v-model="searchData.groupOrPoSn" placeholder="请输入,最少4位"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="账单日期">
                        <el-date-picker v-model="searchData.billDateRange" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY年MM月DD日" value-format="YYYY-MM-DD"
                            @calendar-change="calendarChange"></el-date-picker>
                        <!--限制时间范围 :disabled-date="searchItemParams.disabledDate"  -->
                    </el-form-item>
                    <el-form-item style="float: right;margin-right: 0;" class="selecct_item_serachBox">
                        <el-button type="primary" class="search_button" @click="handleSearch"><el-icon :size="16">
                                <Search />
                            </el-icon>查询</el-button>
                        <el-button class="reset_button" @click="handleReset"><el-icon :size="16">
                                <Refresh />
                            </el-icon>重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="content_box">
            <div class="table_box" id="processTableWrap">
                <el-table ref="multipleTableRef" :data="tableData" :header-cell-style="{ color: '#333' }" border
                    :default-sort="{ prop: 'billDate', order: 'ascending' }" height="100%"
                    :row-class-name="tableRowClassName" @sort-change="sortChange"
                    @row-click="row => handleOpenViewDialog(row)">
                    <el-table-column prop="billNum" label="对账单号" width="160" align="center" fixed="left" />
                    <el-table-column prop="billDate" label="账单日期" width="120" align="center" fixed="left"
                        sortable="custom" />
                    <el-table-column prop="groupSn" label="大版/PO号" width="170" align="center" fixed="left" />
                    <el-table-column prop="totalAmount" label="总金额" min-width="120" align="center" fixed="left"
                        sortable="custom" />
                    <el-table-column prop="processCost" label="加工费(初始)" min-width="150" align="center" />
                    <el-table-column prop="afterProcessCost" label="加工费（改后）" min-width="150" align="center">
                        <template #default="scope">
                            {{ defaultZero(scope.row.afterProcessCost, '--') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceAmount" label="差异金额" min-width="120" align="center">
                        <template #default="scope">
                            {{ defaultZero(scope.row.varianceAmount) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceRate" label="差异率" min-width="120" align="center" sortable="custom">
                        <template #default="scope">
                            {{ scope.row.varianceRate ? (scope.row.varianceRate + '%') : '0.00%' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="extraCost" label="额外费用" min-width="120" align="center">
                        <template #default="scope">
                            {{ defaultZero(scope.row.extraCost) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="lowestConsume" label="最低消费" min-width="120" align="center">
                        <template #default="scope">
                            {{ defaultZero(scope.row.lowestConsume) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNumber" label="订单数量" min-width="120" align="center" />
                    <el-table-column prop="goodNumber" label="良品数" min-width="120" align="center" />
                    <!-- 动态字段-开始 -->
                    <template v-for="(field, index) in dynamicTableFields">
                        <el-table-column :prop="field.prop" :label="field.label" :minWidth="field.minWidth" align="center">
                            <template #default="scope">
                                {{ field.render && field.render(scope) || scope.row[field.prop] }}
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 动态字段-结束 -->
                    <!--  <el-table-column prop="unitPriceUnit" label="单价（平方）" min-width="120" align="center" />
                    <el-table-column prop="length" label="长（初始）" min-width="120" align="center">
                        <template #default="scope">
                            {{ scope.row['length'] || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="width" label="宽（初始）" min-width="120" align="center">
                        <template #default="scope">
                            {{ scope.row.width || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="squareNum" label="平方数（初始）" min-width="140" align="center" />
                    <el-table-column prop="afterLength" label="长（改后）" min-width="120" align="center">
                        <template #default="scope">
                            {{ renderLengthAndwidth(scope.row, 'afterLength') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="afterWidth" label="宽（改后）" min-width="120" align="center">
                        <template #default="scope">
                            {{ renderLengthAndwidth(scope.row, 'afterWidth') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="afterSquareNum" label="平方数（改后）" min-width="140" align="center">
                        <template #default="scope">
                            {{ scope.row.afterSquareNum || '--' }}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="status" label="状态" min-width="120" align="center" fixed="right"
                        sortable="custom">
                        <template #default="scope">
                            {{ statusMap[scope.row.status + ''] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80" align="center" fixed="right">
                        <template #default="scope">
                            <el-button class="edit_buttom" type="primary" size="small"
                                @click="handleOpenViewDialog(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="footer">
            <Pagination @dropDownValueChange="hanldePaginationChange" v-if="tableData && tableData.length > 0"
                :pageNumber="pageData.pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>

        <MonthlyStatementView ref="monthlyStatementViewRef" readOnly :close-on-click-modal="true"></MonthlyStatementView>
    </div>
</template>
  
<script setup>
/**
 * 结款单详情=》加工费账单明细列表
 */
import { onMounted, ref, defineExpose, getCurrentInstance } from "vue";
import Pagination from "@/layout/commonLayout/pageIndex.vue";
import { parseTime } from "@/utils/util"
import { ElMessage, rowProps } from "element-plus";
import { useTableSort } from '@/hooks/component/useTable'
import MonthlyStatementView from '@/views/accountChecking/monthlyStatement/monthlyStatementDetail/MonthlyStatementView.vue'
import { msDetailList } from '@/api/modules/accountChecking'
import { dynamicFieldsForMonthlyStatement } from '@/views/accountChecking/monthlyStatement/monthlyStatementDetail/accountCheckingMap'
import { defaultZero } from '@/utils/util.js'

const { proxy: $vue } = getCurrentInstance()

const props = defineProps({
    params: {
        type: Object,
        default: () => { }
    },
    basicInfo: {
        type: Object,
        default: () => { }
    }
})

let { id: billId, industrialParkId } = props.params

const dynamicTableFields = ref(dynamicFieldsForMonthlyStatement(props.basicInfo.attributeId))

// 账单日期选择控件
const dateRange = { min: null, max: null }
const calendarChange = ([min, max]) => {
    dateRange.min = min;
    dateRange.max = max;
}

// 搜索条件选项
const searchItemParams = {
    // 状态列表值
    statusList: [
        { label: '待核算', value: 1 },
        { label: '已结款', value: 2 },
        { label: '驳回修改', value: 3 },
        { label: '核算中', value: 6 },
        { label: '待结款', value: 7 },
        { label: '结款中', value: 8 },
        { label: '作废', value: 9 },
    ],
    //支付方式
    paymentModeList: [
        { label: '状态1', value: '1' },
        { label: '状态2', value: '2' },
        { label: '状态3', value: '3' },
    ],
    // 账单日期选择：限定在1个月内
    disabledDate: (time) => {
        if (dateRange.min) {
            return time.getTime() < dateRange.min.getTime() || time.getTime() > addMonth(dateRange.min, 1)
        } else if (dateRange.max) {
            return time.getTime() < addMonth(dateRange.max, -1) || time.getTime() > dateRange.max.getTime()
        }
    }
}

const statusMap = {}
searchItemParams.statusList.forEach(p => statusMap[p.value + ''] = p.label)

defineExpose({
    //动态调节列表高度
    autoAdjustTableHeight: () => {
       
    }
})

let appHeight = ref(800);
onMounted(() => {
    appHeight.value = document.querySelector('#app').clientHeight
    getTableList()
});

const pageData = ref({
    pageNumber: 1,
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 0,
})

const createData = () => ({
    industrialParkId,
    billDateRange: [],//账单日期
    attributeIdList: [],//工艺
    billMonth: '',//账单月份
    billNum: '',//对账单号
    groupOrPoSn: '',//大版/PO号
    manufacturerId: '',//加工商id
    manufacturerName: '',//加工商名称
    sortAsc:true,//排序
    sortColumn:"bill_date",
})
// 搜索条件
const searchData = ref(createData());

//过滤条件改变
const handleFilter = () => {
    pageData.value.pageNumber = 1
    getTableList()
}

//选择产业园
const selectPark = (val) => {
    searchData.value.industrialParkId = val
    //更换了产业园就清空加工商条件
    searchData.value.manufacturerName = ''
    handleSearch()
}

const searchFormRef = ref()
//点击查询
const handleSearch = () => {
    searchFormRef.value.validate((valid, fields) => {
        if (valid) {
            pageData.value.pageNumber = 1
            getTableList()
        } else {
            console.log('error submit!', fields)
        }
    })
}

// 点击重置
const handleReset = () => {
    Object.assign(searchData.value, createData())
    handleSearch()
};

//表格数据
const tableData = ref([]);
function getTableList() {
    const { pageNumber, pageSize } = pageData.value
    const { billDateRange } = searchData.value
    const [billDateStr, billDateEnd] = billDateRange || []
    msDetailList({
        pageNumber, pageSize, ...searchData.value,
        settlementId: billId, billDateStr, billDateEnd,
        ...{
            billNum: searchData.value.billNum?.length >= 4 ? searchData.value.billNum : null,
            groupOrPoSn: searchData.value.groupOrPoSn?.length >= 4 ? searchData.value.groupOrPoSn : null,
        }
    }).then(res => {
        let { code, message = '服务错误', data } = res
        if (code !== window.HTTP_SUCCESS) {
            return $vue.$message.error({ message })
        }
        const { items, totalCount } = data || {}
        //转换加工商
        tableData.value = items
        pageData.value.totalCount = totalCount || 0
    })
}

//突出显示某一行数据
const tableRowClassName = ({ row, rowIndex }) => {
    // TODO 判断差异率大于10%就显示红色
    if (row.varianceRate > 10) {
        return 'warning-row'
    }
    return ''
}

/**
 * 自定义排序功能
 */
const sortChange = (sort) => {
    useTableSort(sort, searchData)
    handleSearch()
}

//弹出查看界面
const monthlyStatementViewRef = ref();
const handleOpenViewDialog = (row) => {
    row = unref(row);
    monthlyStatementViewRef.value.openDialog(row);
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

//分页数据变化
const hanldePaginationChange = (val) => {
    pageData.value = Object.assign(pageData.value, val)
    getTableList()
}
</script>
  
<style  lang="scss">
@import "@/assets/css/listTable.scss";

.el-table .warning-row .cell {
    color: #F14932;
}

//禁用状态下更明显
.el-radio__input {
        color:red;
        &.is-disabled.is-checked .el-radio__inner{
            border-color: var(--el-color-primary) !important;
            background: var(--el-color-primary) !important;
        }
    }
</style>

<style lang="scss" scoped>
.commonTableListBox {
    margin-bottom: 0px;
    padding-top: 0;
    padding-bottom: 0px;
    height: calc(100vh - 260px);
    overflow-y: scroll;

   

    .content_box {
        padding: 0;
    }

    .stop_buttom_color {
        border-color: #999 !important;
        color: #666 !important;
    }
}

.ac-dialog-title {
    line-height: 62px;

    &.center {
        text-align: center;
    }
}
</style>

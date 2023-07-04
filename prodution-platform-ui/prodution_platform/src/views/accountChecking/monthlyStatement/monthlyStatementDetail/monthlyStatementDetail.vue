<template>
    <div class="commonTableListBox">
        <CommonBreadCrumb :first="'月结账单列表'" :second="secondTitle" :marginBottom="'16px'" />
        <SearchBox @toggleExpanded="handleSearchToggleExpanded">
            <div class="select_top select_top_border">
                <div class="select_group">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline" style="width:100%;">
                        <el-form-item label="状态">
                            <el-select v-model="searchData.status" placeholder="全部" @change="handleFilter" clearable>
                                <el-option v-for="item in searchItemParams.statusList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="select_bottom">
                <div class="select_group">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline" style="width:100%;" ref="searchFormRef">
                        <el-form-item label="对账单号" prop="billNum"  :rules="[{type: 'string', pattern:/\d{4,}/, message: '请输入至少四位数字进行搜索', trigger: ['blur', 'change']}]">
                            <el-input v-model.trim="searchData.billNum" placeholder="请输入,最少4位" maxlength="30"
                                clearable  style="width:192px"></el-input>
                        </el-form-item>
                        <el-form-item label="大版/PO号" prop="groupOrPoSn" :rules="[{type: 'string', pattern:/\d{4,}/, message: '请输入至少四位数字进行搜索', trigger: ['blur', 'change']}]">
                            <el-input v-model.trim="searchData.groupOrPoSn" placeholder="请输入,最少4位" maxlength="30"
                                clearable  style="width:192px"></el-input>
                        </el-form-item>
                        <el-form-item label="金额差异率">
                            <ACRangeInput unit="%" v-model="searchData.varianceRate" fieldName="金额差异率"></ACRangeInput>
                        </el-form-item>
                        <el-form-item label="账单日期">
                            <el-date-picker v-model="searchData.billDateRange" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY年MM月DD日"
                                value-format="YYYY-MM-DD" @calendar-change="calendarChange" clearable></el-date-picker>
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
        </SearchBox>

        <div class="content_box">
            <TableTitleBar>
                <template v-slot:left>
                    <div class="table-title-select-all">
                        <el-switch v-model="rowAllSelected" @change="handleSelectAll" />
                        全部选中，开启即选中当前筛选条件下所有账单
                    </div>
                </template>
                <template v-slot:center>
                    <div class="table-title">{{ secondTitle }}</div>
                </template>
                <template v-slot:right>
                    <div class="ac-table-title__button-group">
                        <el-button link @click="handleOpenDialog(0)">
                            <el-icon size="16">
                                <Edit />
                            </el-icon> 添加备注</el-button>
                        <el-button link @click="handleOpenDialog(3)">
                            <SvgIcon color="var(--default-main-color)" name="export" w="16px" h="16px" /> 导出
                        </el-button>
                        <el-button link @click="handleOpenDialog(2)">
                            <SvgIcon color="var(--default-main-color)" name="money" w="16px" h="16px" /> 启动结款
                        </el-button>
                        <el-button link @click="handleOpenDialog(1)">
                            <SvgIcon color="var(--default-main-color)" name="listChecking" w="16px" h="16px" /> 启动核算
                        </el-button>
                    </div>
                </template>
            </TableTitleBar>
            <div class="table_box" id="tableWrap">
                <el-table ref="multipleTableRef" :data="tableData" :header-cell-style="{ color: '#333' }" border
                    :height="tableAutoHeight" @sort-change="sortChange" @select="handleSelectRow"
                    :row-class-name="tableRowClassName" @select-all="handleTableSelectAllRow"
                    @row-click="row => handleOpenViewDialog(row)">
                    <el-table-column type="selection" width="55" fixed="left"> </el-table-column>
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
                    <template v-for="(field,index) in dynamicTableFields">
                        <el-table-column :prop="field.prop"  :label="field.label" :minWidth="field.minWidth" align="center" >
                        <template #default="scope">
                            {{ field.render && field.render(scope) || scope.row[field.prop] }}
                        </template>
                    </el-table-column>
                    </template>
                    <!-- 动态字段-结束 -->
                    
                    <el-table-column prop="status" label="状态" min-width="120" align="center" fixed="right"
                        sortable="custom">
                        <template #default="scope">
                            {{ statusMap[scope.row.status + ''] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80" align="center" fixed="right">
                        <template #default="scope">
                            <el-button class="edit_buttom" type="primary" size="small"
                                @click.stop="handleOpenViewDialog(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="footer">
            <Pagination @dropDownValueChange="hanldePaginationChange" v-if="tableData && tableData.length > 0"
                :pageNumber="pageData.pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>

        <MonthlyStatementDetailDialog ref="monthlyStatementDetailDialogRef" @refreshTable="handleSearch">
        </MonthlyStatementDetailDialog>
        <MonthlyStatementView ref="monthlyStatementViewRef" @refreshTable="handleSearch"></MonthlyStatementView>
    </div>
</template>
  
<script setup>
/**
 * 月结账单列表
 */
import { onMounted, ref, unref, nextTick, getCurrentInstance } from "vue";
import Pagination from "@/layout/commonLayout/pageIndex.vue";
import { parseTime } from "@/utils/util"
import { ElMessage } from "element-plus";
import { useTable, useTableSort } from '@/hooks/component/useTable'
import SearchBox from '@/components/table/SearchBox.vue'
import TableTitleBar from '@/components/table/TableTitleBar.vue'
import ACRangeInput from '@/components/ACRangeInput.vue'
import MonthlyStatementDetailDialog from './MonthlyStatementDetailDialog.vue'
import MonthlyStatementView from './MonthlyStatementView.vue'
import { openNewPage } from "@/utils/commonApi"
import { addMonth } from '@/utils/util'
import { useRoute, useRouter } from "vue-router"
import { msDetailList, mainBillDetail } from "@/api/modules/accountChecking"
import { defaultZero } from '@/utils/util.js'
import {dynamicFieldsForMonthlyStatement} from '@/views/accountChecking/monthlyStatement/monthlyStatementDetail/accountCheckingMap'

const { proxy: $vue } = getCurrentInstance()

const route = useRoute()
const router = useRouter()

let manufacturerId = ref(route.query.manufacturerId)
let industrialParkId = ref(route.query.industrialParkId)

// 从列表传递过来：面包屑的二级标题
const secondTitle = ref(route.query.pageTitle)
// 对账单号
let initBillNum = route.query.billNum

// 表格自动高度
let { tableAutoHeight, heightAutoAdjustDelay } = useTable({ fixHeader: true })

//切换搜索框折叠状态
const handleSearchToggleExpanded = (expanded) => {
    tableAutoHeight.value = ''
    //切换搜索框折叠状态时需要再次动态计算表格高度
    heightAutoAdjustDelay({})
}

// 账单日期选择控件
const dateRange = { min: null, max: null }
const calendarChange = ([min, max]) => {
    dateRange.min = min;
    dateRange.max = max;
}

// 搜索条件选项
const searchItemParams = {
    // 状态列表值
    //状态：1.待核算，2.已结款，3.驳回修改，6.核算中，7.待结款，8.结款中，9.作废
    statusList: [
        { label: '待核算', value: 1 },
        { label: '核算中', value: 6 },
        { label: '驳回修改', value: 3 },
        { label: '作废', value: 9 },
        { label: '待结款', value: 7 },
        { label: '结款中', value: 8 },
        { label: '已结款', value: 2 },
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

onMounted(() => {
    getMainBillDetail()
    if (industrialParkId.value) getTableList();
});

const dynamicTableFields =ref([])
const getMainBillDetail = async () => {
    const oldIndustrialParkId =  industrialParkId.value
    console.log(666,route.query.billId)
    mainBillDetail({
        billId: route.query.billId,
    }).then(res => {
        let { code, message = '服务错误', data } = res
        if (code !== window.HTTP_SUCCESS) {
            return $vue.$message.error({ message })
        }
        secondTitle.value = data.billName
        industrialParkId.value = data.industrialParkId
        manufacturerId.value = data.manufacturerId
        dynamicTableFields.value = dynamicFieldsForMonthlyStatement(parseInt(data.attributeId))
        console.log(111,dynamicTableFields.value);
        if(!oldIndustrialParkId) getTableList();
    })
}

// 分页参数
const pageData = ref({
    pageNumber: 1,
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 0,
})

const createData = () => ({
    status:null,//状态
    billDateRange: '',//账单月份
    groupOrPoSn: '',//po号
    billNum:'',//对账单号
    varianceRate: [],//金额差异率
})

// 搜索条件
const searchData = ref( Object.assign(createData(),{billNum:initBillNum}))

//记录选中的行
const selectedRowSet = new Set()

//重新加载列表数据
const reloadTableData = () => {
    selectedRowSet.clear()//重置选中行
    pageData.value.pageNumber = 1
    tableData.value.length = 0
    rowAllSelected.value = false
    getTableList()
}

// 过滤条件改变
const handleFilter = () => {
    reloadTableData()
}

const searchFormRef = ref()
// 点击查询
const handleSearch = () => {
    searchFormRef.value.validate((valid, fields) => {
        if (valid) {
            reloadTableData()
        } else {
            console.log('error submit!', fields)
        }
    })
}

// 点击重置
const handleReset = () => {
    Object.assign(searchData.value, createData(), { status: '' })
    reloadTableData()
};

//表格数据
const tableData = ref([]);
function getTableList(reSelectRows) {
    const { pageNumber, pageSize } = pageData.value
    const { billDateRange, billNum, groupOrPoSn, varianceRate, status, sortAsc, sortColumn } = searchData.value
    const [billDateStr, billDateEnd] = billDateRange || []
    const [varianceRateStr, varianceRateEnd] = varianceRate
    msDetailList({
        billId: route.query.billId,
        pageNumber, pageSize, status, billNum, groupOrPoSn, billDateStr, billDateEnd, varianceRateStr, varianceRateEnd,
        sortAsc, sortColumn,
        industrialParkId: industrialParkId.value,
        ...{
            billNum:searchData.value.billNum?.length>=4?searchData.value.billNum:null,
            groupOrPoSn:searchData.value.groupOrPoSn?.length>=4?searchData.value.groupOrPoSn:null,
        }
    }).then(res => {
        let { code, message = '服务错误', data } = res
        if (code !== window.HTTP_SUCCESS) {
            return $vue.$message.error({ message })
        }
        const { items, totalCount } = data || {}
        tableData.value = items
        pageData.value.totalCount = totalCount || 0
        nextTick(() => {
            reSelectRows && reSelectRows();
            //待办查询时：主动弹出查看
            if (initBillNum && totalCount > 0) {
                Object.assign(items[0],{
                    industrialParkId:industrialParkId.value,
                    manufacturerId:manufacturerId.value
                 })
                handleOpenViewDialog(items[0])
                initBillNum = null //控制只弹出1次
            }
        })
    })
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
    //不规则排序字段转换map
    const convertMap = {
    }
    useTableSort(sort, searchData)
    reloadTableData()
}

//分页数据变化
const hanldePaginationChange = (val) => {
    let { pageSizeChanged } = unref(val);
    if (pageSizeChanged) {
         //pageSize改变时：取消全选,并回到第一页
        rowAllSelected.value = false
        //改变页码
        pageData.value = Object.assign(pageData.value, val)
        reloadTableData()
    }else{
        //改变页码
        pageData.value = Object.assign(pageData.value, val)
        let reSelectRowsFunc;
        if (rowAllSelected.value) {
            //全部选中
            reSelectRowsFunc = () => {
                tableData.value.forEach((row) => {
                    multipleTableRef.value.toggleRowSelection(row, true)
                })
            }
        } else {
            //翻页回到之前的页，重新选中之前选中的行
            reSelectRowsFunc = () => {
                if (selectedRowSet.size > 0) {
                    tableData.value.forEach((row) => {
                        if (selectedRowSet.has(row.id)) {multipleTableRef.value.toggleRowSelection(row, true)}
                    })
                }
            }
        }
        getTableList(reSelectRowsFunc)
    }
}

//控制【全部选中】
const rowAllSelected = ref(false);
const multipleTableRef = ref();
const handleSelectAll = () => {
    if (rowAllSelected.value) {
        tableData.value.forEach((row) => {
            multipleTableRef.value.toggleRowSelection(row, true)
            selectedRowSet.add(row.id)
        })
    } else {
        multipleTableRef.value.clearSelection()
        selectedRowSet.clear();
    }
}

//列表单选
const handleSelectRow = (selection, row) => {
    let selected = selection.indexOf(row) > -1;
    if (!selected) {
        rowAllSelected.value = false
        //if (selectedRowSet.has(row.id)) selectedRowSet.delete(row.id)
        selectedRowSet.clear()
        selection.forEach((item) => {
           selectedRowSet.add(item.id)
        })
    } else {
        selectedRowSet.add(row.id)
    }
}

//列表全选
const handleTableSelectAllRow = (selection) => {
    if (!selection.length) {
        rowAllSelected.value = false
        tableData.value.forEach((row) => {
            if (selectedRowSet.has(row.id)) selectedRowSet.delete(row.id)
        })
    } else {
        selection.forEach(row => {
            selectedRowSet.add(row.id)
        })
    }
}

//弹出对话框
const monthlyStatementDetailDialogRef = ref();
//type:0 填写备注，1.启动核算，2.启动结款,3.导出
const handleOpenDialog = async (type) => {
    let rows = selectedRowSet;

    if ((!rowAllSelected.value && rows.size == 0) || (rowAllSelected.value && !tableData.value.length)) {
        return $vue.$message.error({ message: '请先选择需要操作的账单记录' })
    }

    let selectRowIds = [...rows];
    const { billDateRange, varianceRate, ...otherParams } = searchData.value
    const [billDateStr, billDateEnd] = billDateRange || []
    const [varianceRateStr, varianceRateEnd] = varianceRate

    const params = {
        rowAllSelected,
        selectRowIds,
        //选择的行数
        selectRowCount: rowAllSelected.value ? pageData.value.totalCount : rows.size,
        title: secondTitle,
        searchParams: {
            billDateEnd,
            billDateStr,
            billId: route.query.billId,
            chooseIds: rowAllSelected.value ? [] : selectRowIds,
            manufacturerId: manufacturerId.value,
            industrialParkId: industrialParkId.value,
            selectAll: rowAllSelected.value,
            varianceRateEnd,
            varianceRateStr,
            ...otherParams,
        }
    }
    monthlyStatementDetailDialogRef.value.openDialog(type, params);
}

//弹出查看界面
const monthlyStatementViewRef = ref();
const handleOpenViewDialog = (row) => {
    monthlyStatementViewRef.value.openDialog(unref(row));
}

</script>
  
<style  lang="scss">
@import "@/assets/css/listTable.scss";

.el-table .warning-row .cell {
    color: #F14932;
}
</style>

<style lang="scss" scoped>
.commonTableListBox {
    .content_box {
        padding-top: 20px;
    }

    .table-title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .table-title-select-all {
        font-size: 13px;
        font-weight: 400;
        color: #666;
    }
}
</style>
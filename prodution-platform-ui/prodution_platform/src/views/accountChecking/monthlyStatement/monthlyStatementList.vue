<template>
    <div class="commonTableListBox">
        <CommonBreadCrumb first="生产加工对账" marginBottom="16px" />
        <IndustrialParkSelect v-model="searchData.industrialParkId" @change="selectPark" />
        <SearchBox @toggleExpanded="handleSearchToggleExpanded">
            <div class="select_top select_top_border">
                <div class="select_group">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline" style="width:100%;">
                        <el-form-item label="工艺">
                            <TechnologySelect v-model="searchData.attributeIdList" @change="handleFilter" />
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="select_bottom">
                <div class="select_group">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline" style="width:100%;">
                        <el-form-item label="账单名称">
                            <el-input v-model.trim="searchData.billName" placeholder="请输入" clearable style="width:192px"></el-input>
                        </el-form-item>
                        <ManufacturerNameSelect :industrialParkId="searchData.industrialParkId"
                            v-model="searchData.manufacturerName" @select="HandleSelectManufacturer" />
                        <el-form-item label="账单月份">
                            <el-date-picker v-model="searchData.billMonth" type="month" placeholder="请选择月份"
                                format="YYYY年MM月" value-format="YYYY-MM"></el-date-picker>
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
            <div class="table_box" id="tableWrap">
                <el-table :data="tableData" :header-cell-style="{ color: '#333' }" border :height="tableAutoHeight"
                    @sort-change="sortChange"
                    :row-class-name="tableRowClassName" @row-click="row => handleView(row)">
                    <el-table-column prop="billName" label="账单名称" min-width="180" align="center" />
                    <el-table-column prop="manufacturerName" label="加工商" min-width="140" align="center" sortable="custom"
                        show-overflow-tooltip>
                        <template #default="scope">
                            <span>{{ scope.row.manufacturerName || '--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="billMonth" label="账单月份" width="150" align="center" sortable="custom" />
                    <el-table-column prop="attributeName" label="工艺" width="80" align="center" />
                    <el-table-column prop="totalCount" label="总账单数" min-width="110" align="center" sortable="custom" />
                    <el-table-column prop="toCalculateCount" label="待核算账单数" min-width="120" align="center" />
                    <el-table-column prop="totalAmount" label="总金额" min-width="90" align="center" />
                    <el-table-column prop="totalProcessCost" label="总加工费(初始)" min-width="140" align="center" />
                    <el-table-column prop="totalAfterProcessCost" label="总加工费(改后)" min-width="140" align="center">
                        <template #default="scope">
                            {{ defaultZero(scope.row.totalAfterProcessCost,'--') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalVarianceAmount" label="差异金额(总)" min-width="120" align="center" >
                        <template #default="scope">
                            {{ defaultZero(scope.row.totalVarianceAmount) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalVarianceRate" label="差异率(总)" min-width="100" align="center">
                        <template #default="scope">
                            {{ scope.row.totalVarianceRate ? (scope.row.totalVarianceRate + '%') : '0.00%' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalExtraCost" label="额外费用(总)" min-width="110" align="center" >
                        <template #default="scope">
                            {{ defaultZero(scope.row.totalExtraCost) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160" align="center" fixed="right">
                        <template #default="scope">
                            <el-button class="edit_buttom" type="primary" size="small"
                                @click.stop="handleView(scope.row)">查看</el-button>
                            <el-button class="edit_buttom" type="primary" size="small"
                                @click.stop="handleExport(scope.row)">导出</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="footer">
            <Pagination @dropDownValueChange="hanldePaginationChange" v-if="tableData && tableData.length > 0"
                :pageNumber="pageData.pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>

        <!-- 导出弹出框 -->
        <ACDialog title="导出" width="500px" v-model="exportVisible" @close="exportVisible = false"
            @bottom-btn-click="handleConfirmExport">
            <div class="ac-dialog-title center">是否确认导出“{{ currentRow.billName }}”共{{ currentRow.exportCount }}条数据</div>
        </ACDialog>
    </div>
</template>
  
<script setup>
/**
 * 月结账单列表
 */
import Pagination from "@/layout/commonLayout/pageIndex.vue";
import { parseTime } from "@/utils/util"
import { ElMessage, rowProps } from "element-plus";
import { useTable, useTableSort } from '@/hooks/component/useTable'
import TechnologySelect from '@/layout/accountCheckingLayout/select/TechnologySelect.vue'
import ManufacturerNameSelect from '@/layout/accountCheckingLayout/select/ManufacturerNameSelect.vue'
import IndustrialParkSelect from '@/layout/accountCheckingLayout/select/IndustrialParkSelect.vue'
import SearchBox from '@/components/table/SearchBox.vue'
import { openNewPage } from "@/utils/commonApi"
import { msList, msExport, msBillStatistics } from "@/api/modules/accountChecking"
import { defaultZero } from '@/utils/util.js'
import { useBroadcast } from '@/hooks/component/useBroadcast'
const {listenMonthlyStatementListChannel} = useBroadcast()

const { proxy: $vue } = getCurrentInstance()


// 表格自动高度
let { tableAutoHeight, heightAutoAdjustDelay } = useTable({ fixHeader: true })

//切换搜索框折叠状态
const handleSearchToggleExpanded = (expanded) => {
    tableAutoHeight.value = ''
    //切换搜索框折叠状态时需要再次动态计算表格高度
    heightAutoAdjustDelay({})
}

let channel = ""
onMounted(() => {
    //由于接口需要先知道产业园id，所以要等产业园组件先获取到数据，触发change反馈到界面上来
    //getTableList()

    channel = listenMonthlyStatementListChannel((data)=> {
        console.log('触发消息--MonthlyStatementList--：', data)
        if (data.refreshData) setTimeout(() => {
            handleSearch()
        }, 10);
    });
});

onUnmounted(()=>{
    channel.close();
})

const pageData = ref({
    pageNumber: 1,
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 0,
})

const createData = () => ({
    attributeIdList: [],//工艺
    industrialParkId: null,//产业园
    billMonth: null,//账单月份
    billName: null,//账单名称
    manufacturerId: null,//加工商id
    manufacturerName: null,//加工商名称
   /*  sortColumn: 'bill_month', //默认排序字段：账单月份
    sortAsc: 0,//默认排序方向:倒序 */
})
// 搜索条件
const searchData = ref(createData());

//重新加载列表数据
const reloadTableData = () => {
    pageData.value.pageNumber = 1
    tableData.value.length = 0
    getTableList()
}

//过滤条件改变
const handleFilter = () => {
    reloadTableData()
}

//选择产业园
const selectPark = (val) => {
    searchData.value.industrialParkId = Number.parseInt(val)
    //更换了产业园就清空加工商条件
    searchData.value.manufacturerName = ''
    searchData.value.manufacturerId = ''
    handleSearch()
}

//下拉选择加工商
const HandleSelectManufacturer = (item) => {
    searchData.value.manufacturerId = item.manufacturerId ? Number.parseInt(item.manufacturerId) : null,
        searchData.value.manufacturerName = item.manufacturerName
}

//点击查询
const handleSearch = () => {
    reloadTableData()
}

// 点击重置
const handleReset = () => {
    let {industrialParkId} = searchData.value
    Object.assign(searchData.value, createData(),{industrialParkId})
    reloadTableData()
};

//表格数据
const tableData = ref([]);
function getTableList() {
    const { pageNumber, pageSize } = pageData.value
    msList({
        pageNumber, pageSize, ...searchData.value,
        manufacturerName: searchData.value.manufacturerId ? '' : searchData.value.manufacturerName
    }).then(res => {
        let { code, message = '服务错误', data } = res
        if (code !== window.HTTP_SUCCESS) {
            return $vue.$message.error({ message })
        }
        const { items, totalCount } = data || {}
        tableData.value = items
        pageData.value.totalCount = totalCount || 0
    })
}

//突出显示某一行数据
const tableRowClassName = ({ row, rowIndex }) => {
    // TODO 判断差异率大于10%就显示红色
    if (row.totalVarianceRate >10) {
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
        'manufacturerName': 'manufacturer'
    }
    useTableSort(sort, searchData, convertMap)
    reloadTableData()
}

//查看
const handleView = (row) => {
    openNewPage(`/accountChecking/monthlyStatementDetail?billId=${row.id}&pageTitle=${row.billName}&billMonth=${row.billMonth}&manufacturerId=${row.manufacturerId}&industrialParkId=${row.industrialParkId}`)
}

//导出
let exportVisible = ref(false)
let currentRow = ref({});
const handleExport = async (row) => {
    currentRow.value = row
    let { code, data, message } = await msBillStatistics({
        billId: currentRow.value.id,
        selectAll: true,
    })
    if (code !== window.HTTP_SUCCESS) {
        return $vue.$message.error({ message })
    }

    const count = data || 0
    currentRow.value.exportCount = count
    exportVisible.value = true
}

//导出确认
const handleConfirmExport = async ({ confirm }) => {
    if (confirm) {
        let res = await msExport({
            billId: currentRow.value.id,
            selectAll: true,
        })
        if (res.code) {
            let { code, data, message } = res
            if (code !== window.HTTP_SUCCESS) {
                return $vue.$message.error({ message })
            }
        } else {
            exportVisible.value = false
            $vue.$message.success({ message: '导出成功' })
        }
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
</style>

<style lang="scss" scoped>
.commonTableListBox {
    .content_box {
        padding-top: 20px;
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

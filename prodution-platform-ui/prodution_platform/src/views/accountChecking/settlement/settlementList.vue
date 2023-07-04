<template>
    <div class="commonTableListBox">
        <CommonBreadCrumb first="生产加工对账" marginBottom="16px" />
        
        <SearchBox @toggleExpanded="handleSearchToggleExpanded">
            <div class="select_top select_top_border">
                <div class="select_group">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline" style="width:100%;">
                        <el-form-item label="所属产业园">
                            <IndustrialParkSelect static v-model="searchData.industrialParkId" clearable @change="selectPark" />
                        </el-form-item>
                        <el-form-item label="工艺">
                            <TechnologySelect v-model="searchData.attributeIdList" @change="handleFilter" />
                        </el-form-item>
                        <el-form-item label="结款方式">
                            <el-select v-model="searchData.settlementType" placeholder="全部" @change="handleFilter"  clearable>
                                <el-option v-for="item in searchItemParams.settlementTypeList" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
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
                    <el-form :inline="true" :model="searchData"  class="demo-form-inline" style="width:100%;" ref="searchFormRef">
                        <el-form-item label="付款单号" prop="paymentNum"  :rules="[{type: 'string', pattern:/\d{4,}/, message: '请输入至少四位数字进行搜索', trigger: ['blur', 'change']}]">
                            <el-input v-model.trim="searchData.paymentNum" placeholder="请输入,最少4位" clearable style="width:200px"></el-input>
                        </el-form-item>
                        <ManufacturerNameSelect :industrialParkId="searchData.industrialParkId"
                            v-model="searchData.manufacturerName" @select="HandleSelectManufacturer"/>
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
                    <el-table-column prop="paymentNum" label="付款单号" width="120" align="center" />
                    <el-table-column prop="billMonth" label="账单月份" width="110" align="center" sortable="custom" />
                    <el-table-column prop="manufacturerName" label="加工商" min-width="140" align="center" sortable="custom">
                        <template #default="scope">
                            <span>{{ scope.row.manufacturerName || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="attributeName" label="工艺" width="80" align="center" />
                    <el-table-column prop="industrialParkName" label="所属产业园" width="120" align="center" />
                    <el-table-column prop="settlementType" label="结款方式" min-width="90" align="center">
                        <template #default="scope">
                            <!-- 1.月结,2.周结,3.现结,4.预付款 -->
                            <span>{{ { '1': '月结', '2': '周结', '3': '现结', '4': '预付款' }[scope.row.settlementType + ''] || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="总金额" min-width="90" align="center" />
                    <el-table-column prop="totalProcessCost" label="总加工费(初始)" min-width="120" align="center" />
                    <el-table-column prop="totalAfterProcessCost" label="总加工费(改后)" min-width="140" align="center">
                        <template #default="scope">
                            {{ defaultZero(scope.row.totalAfterProcessCost,'--') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceAmount" label="差异金额" min-width="90" align="center">
                        <template #default="scope">
                            {{ defaultZero(scope.row.varianceAmount) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceRate" label="差异率" min-width="90" align="center">
                        <template #default="scope">
                            {{ scope.row.varianceRate ? (scope.row.varianceRate + '%') : '0.00%' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="deductionCost" label="扣款金额" min-width="100" align="center" />
                    <el-table-column prop="extraCost" label="额外费用" min-width="90" align="center">
                        <template #default="scope">
                            {{ defaultZero(scope.row.extraCost) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="writeoffCost" label="预付款核销" min-width="100" align="center" />
                    <el-table-column prop="invoiceCost" label="开票金额" min-width="100" align="center" />
                    <el-table-column prop="meetCost" label="应付金额" min-width="100" align="center" />
                    <el-table-column prop="status" label="状态" min-width="80" align="center"  sortable="custom" fixed="right">
                        <template #default="scope">
                            <!-- 1.待付款，2.付款中，3.已付款 -->
                            <span>{{ { '1': '待付款', '2': '付款中', '3': '已付款' }[scope.row.status + ''] || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80" align="center" fixed="right">
                        <template #default="scope">
                            <el-button class="edit_buttom" plain size="small"
                                @click.stop="handleView(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="footer">
            <Pagination @dropDownValueChange="hanldePaginationChange" v-if="tableData && tableData.length > 0"
                :pageNumber="pageData.pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>
    </div>
</template>
  
<script setup>
/**
 * 结款单列表
 */
import Pagination from "@/layout/commonLayout/pageIndex.vue";
import { parseTime } from "@/utils/util"
import { ElMessage, rowProps } from "element-plus";
import { useTable, useTableSort } from '@/hooks/component/useTable'
import TechnologySelect from '@/layout/accountCheckingLayout/select/TechnologySelect.vue'
import ManufacturerNameSelect from '@/layout/accountCheckingLayout/select/ManufacturerNameSelect.vue'
import IndustrialParkSelect from '@/layout/accountCheckingLayout/select/IndustrialParkSelect.vue'
import SearchBox from '@/components/table/SearchBox.vue'
import { openNewPage } from '@/utils/commonApi'
import { settlementList } from '@/api/modules/settlement'
import { defaultZero } from '@/utils/util.js'

const { proxy: $vue } = getCurrentInstance()

// 表格自动高度
let { tableAutoHeight, heightAutoAdjustDelay } = useTable({ fixHeader: true })

//切换搜索框折叠状态
const handleSearchToggleExpanded = (expanded) => {
    tableAutoHeight.value = ''
    //切换搜索框折叠状态时需要再次动态计算表格高度
    heightAutoAdjustDelay({})
}


// 搜索条件选项
const searchItemParams = {
    // 状态：下拉单选，选项为待付款，付款中，已付款，全部（初始选中待付款）
    // 	/字典：1.待付款，2.付款中，3.已付款
    statusList: [
        { label: '待付款', value: '1' },
        { label: '付款中', value: '2' },
        { label: '已付款', value: '3' },
    ],
    //结款方式： 下拉单选，项为月结，现结，全部（初始选中全部） 
    //字典： （1.月结,2.周结,3.现结,4.预付款）
    settlementTypeList: [
        { label: '月结', value: '1' },
        { label: '现结', value: '3' },
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

let channel = ''
onMounted(() => {
    getTableList()
    channel = new BroadcastChannel("channel-accountChecking-settlementList");
    channel.addEventListener("message", function (e) {
        if (e.data.refreshData) reloadTableData()
    });
});

onUnmounted(()=>{
    channel.close()
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
    status: '1',//状态 初始选中待付款
    settlementType: null,//结款方式
    paymentNum: null,//付款单号
    manufacturerId: null,//加工商id
    manufacturerName: null,//加工商名称
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
    handleSearch()
}

//下拉选择加工商
const HandleSelectManufacturer = (item) => {
    searchData.value.manufacturerId = item.manufacturerId ? Number.parseInt(item.manufacturerId) : null,
        searchData.value.manufacturerName = item.manufacturerName
}

const searchFormRef = ref()
//点击查询
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
    Object.assign(searchData.value, createData(),{status:null})
    reloadTableData()
};

//表格数据
const tableData = ref([]);
function getTableList() {
    const { pageNumber, pageSize } = pageData.value
    let params = {
        pageNumber, pageSize, ...searchData.value,
        paymentNum:searchData.value.paymentNum?.length>=4?searchData.value.paymentNum:null,
    };
    settlementList(params).then(res => {
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
        'manufacturerName': 'manufacturer_first'
    }
    useTableSort(sort, searchData, convertMap)
    reloadTableData()
}

//查看
const handleView = (row) => {
    openNewPage(`/accountChecking/settlementDetail?id=${row.id}`)
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

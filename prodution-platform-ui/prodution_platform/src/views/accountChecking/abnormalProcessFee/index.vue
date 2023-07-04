<template>
    <div class="commonTableListBox">
        <CommonBreadCrumb :first="'生产加工对账'" :marginBottom="'16px'" />
        <IndustrialParkSelect v-model="searchData.industrialParkId" @change="selectPark" />
        <SearchBox>
            <div class="select_top">
                <div class="select_group">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline" style="width:100%;">
                        <el-form-item label="工艺">
                            <TechnologySelect v-model="searchData.attributeIdList" @change="handleFilter" />
                        </el-form-item>
                        <el-form-item label="结款方式">
                            <el-select v-model="searchData.paymentTypeList" multiple collapse-tags collapse-tags-tooltip
                                placeholder="全部" disabled>
                                <el-option v-for="item in paymentTypeOptions" :key="item.key" :label="item.value"
                                    :value="item.key" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="select_bottom">
                <div class="select_group">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline" style="width:100%;"
                        ref="searchFormRef">
                        <el-form-item label="对账单号" prop="billNum"
                            :rules="[{ type: 'string', pattern: /\d{4,}/, message: '请输入至少四位数字进行搜索', trigger: ['blur', 'change'] }]">
                            <el-input v-model.trim="searchData.billNum" placeholder="请输入,最少4位" maxlength="30" clearable
                                style="width:192px"></el-input>
                        </el-form-item>
                        <el-form-item label="大版号/PO号" prop="groupOrPoSn"
                            :rules="[{ type: 'string', pattern: /\d{4,}/, message: '请输入至少四位数字进行搜索', trigger: ['blur', 'change'] }]">
                            <el-input v-model.trim="searchData.groupOrPoSn" placeholder="请输入,最少4位" maxlength="30" clearable
                                style="width:192px"></el-input>
                        </el-form-item>

                        <ManufacturerNameSelect :industrialParkId="searchData.industrialParkId"
                            v-model.trim="searchData.manufacturerName" @select="manufacturerNameSelect" />

                        <el-form-item label="账单时间">
                            <el-date-picker v-model.trim="searchData.billDateRange" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY年MM月DD日"
                                :disabled-date="searchData.disabledDate" value-format="YYYY-MM-DD"
                                @calendar-change="calendarChange" @change="calendarChangeVal"></el-date-picker>
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
            <div class="content__button-group">
                <el-button link @click="handleOpenDialog(1)">
                    <SvgIcon color="var(--default-main-color)" name="audit" w="16px" h="16px" /> 审核
                </el-button>
            </div>
            <div class="table_box" id="getTableHeight">
                <el-table :data="tableData" :header-cell-style="{ color: '#333' }" border @sort-change="sortChange"
                    @select="handleSelectRow" @select-all="handleTableSelectAllRow" :row-class-name="tableRowClassName"
                    row-key="billNum" @row-click="row => handleOpenViewDialog(row)" height="100%" ref="multipleTableRef">
                    <el-table-column reserve-selection type="selection" width="55"></el-table-column>
                    <el-table-column prop="billNum" label="对账单号" width="160" align="center" fixed="left" />
                    <el-table-column prop="billDate" label="账单日期" width="160" align="center" fixed="left" />
                    <el-table-column prop="groupSn" label="大版/PO号" width="180" align="center" fixed="left" />
                    <el-table-column prop="totalAmount" label="总金额" min-width="100" align="center" fixed="left" />
                    <el-table-column prop="manufacturerName" label="加工商" min-width="260" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.manufacturerName || '--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="attributeName" label="工艺" width="100" align="center" />
                    <el-table-column prop="processCost" label="加工费(初始)" min-width="150" align="center" />
                    <el-table-column prop="afterProcessCost" label="加工费(改后)" min-width="150" align="center">
                        <template #default="scope">
                            <span>{{ defaultZero(scope.row.afterProcessCost, '--') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceAmount" label="差异金额" min-width="120" align="center">
                        <template #default="scope">
                            <span>{{ defaultZero(scope.row.varianceAmount) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="varianceRate" label="差异率" min-width="100" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.varianceRate ? (scope.row.varianceRate + '%') : '0' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="extraCost" label="额外费用" min-width="120" align="center">
                        <template #default="scope">
                            <span>{{ defaultZero(scope.row.extraCost) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNumber" label="订单数量" min-width="100" align="center" />
                    <el-table-column prop="lowestConsume" label="最低消费" min-width="100" align="center">
                        <template #default="scope">
                            <span>{{ defaultZero(scope.row.lowestConsume) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodNumber" label="良品数" min-width="100" align="center" />
                    <el-table-column prop="paymentType" label="结款方式" min-width="100" align="center">
                        <template #default="scope">
                            <span>{{ paymentTypeOptions.find(e => e.key == scope.row.paymentType)?.value || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" align="center" fixed="right">
                        <template #default="scope">
                            <el-button class="edit_buttom" type="primary" size="small"
                                @click.stop="handleOpenViewDialog(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="footer">
            <Pagination @dropDownValueChange="pageSizeChange" v-if="tableData && tableData.length > 0"
                :pageNumber="pageData.pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>
        <audit-dialog ref="auditDialogRef" @complete="handleSearch"></audit-dialog>
        <MonthlyStatementView ref="monthlyStatementViewRef" @complete="handleSearch"></MonthlyStatementView>
    </div>
</template>

<script setup>
/**
* 月结账单列表
*/
import { onMounted, ref, nextTick } from "vue";
import Pagination from "@/layout/commonLayout/pageIndex.vue";
import { msDetailList, mainBillDetail } from "@/api/modules/accountChecking"
import { parseTime, addMonth } from "@/utils/util"
import MonthlyStatementView from '../monthlyStatement/monthlyStatementDetail/MonthlyStatementView.vue'
import auditDialog from './auditDialog.vue'
import { ElMessage } from "element-plus";
import TechnologySelect from '@/layout/accountCheckingLayout/select/TechnologySelect.vue'
import ManufacturerNameSelect from '@/layout/accountCheckingLayout/select/ManufacturerNameSelect.vue'
import IndustrialParkSelect from '@/layout/accountCheckingLayout/select/IndustrialParkSelect.vue'
import SearchBox from '@/components/table/SearchBox.vue'
import { defaultZero } from '@/utils/util.js'
import { openNewPage } from "@/utils/commonApi"
import { useRoute, useRouter } from "vue-router"
const route = useRoute()

// 对账单号
let billNumber = route.query.billNum

onMounted(() => {
    if (route.query.billId) {
        getMainBillDetail()
    } else {
        getTableList()
    }
});
const paymentTypeOptions = [
    { key: 1, value: "月结" },
    { key: 2, value: "周结" },
    { key: 3, value: "现结" },
    { key: 4, value: "预付款" },
]
const pageData = ref({
    pageNumber: 1,
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 0,
})
// 账单日期选择控件
const dateRange = { min: null, max: null }
const calendarChange = ([min, max]) => {
    dateRange.min = min;
    dateRange.max = max;
}
const calendarChangeVal = (val) => {
    console.warn(val);
    if (!val) calendarChange([null, null])
}
const manufacturerNameSelect = (val) => {
    searchData.value.manufacturerId = val.manufacturerId
    searchData.value.manufacturerName = val.manufacturerName
}
// 搜索条件
const searchData = ref({
    attributeIdList: [],//工艺
    industrialParkId: '',//产业园
    billNum: billNumber,
    groupOrPoSn: "",
    paymentTypeList: [1],
    manufacturerName: '',//加工商名称
    manufacturerId: '',//加工商名称
    billDateRange: "",
    // 账单日期选择：限定在1个月内
    disabledDate: (time) => {
        if (dateRange.min) {
            return time.getTime() < dateRange.min.getTime() || time.getTime() > addMonth(dateRange.min, 1)
        } else if (dateRange.max) {
            return time.getTime() < addMonth(dateRange.max, -1) || time.getTime() > dateRange.max.getTime()
        }
    }
});

//过滤条件改变
const handleFilter = () => {
    pageData.value.pageNumber = 1
    getTableList()
}

//选择产业园
const selectPark = (val) => {
    searchData.value.industrialParkId = val;
    //更换了产业园就清空加工商条件
    searchData.value.manufacturerName = '';
    searchData.value.manufacturerId = '';
    handleSearch()
}

const searchFormRef = ref()
//点击查询
const handleSearch = () => {
    searchFormRef.value.validate((valid, fields) => {
        if (valid) {
            pageData.value.pageNumber = 1
            getTableList()
            multipleTableRef.value.clearSelection()
        } else {
            console.log('error submit!', fields)
        }
    })
}

// 点击重置
const handleReset = () => {
    Object.assign(searchData.value, {
        attributeIdList: [],//工艺
        billNum: "",
        groupOrPoSn: "",
        paymentTypeList: [1],
        manufacturerName: '',//加工商名称
        manufacturerId: '',//加工商ID
        billDateRange: "",
    })
    calendarChange([null, null])
    pageData.value.pageNumber = 1
    handleSearch()
};

const tableData = ref([])
//表格数据
function getTableList() {
    const { pageNumber, pageSize } = pageData.value
    const { billDateRange, billNum, groupOrPoSn, paymentTypeList, status, manufacturerId, manufacturerName, attributeIdList, industrialParkId } = searchData.value
    const [billDateStr, billDateEnd] = billDateRange || []
    msDetailList({
        isErrorPage: true,
        pageNumber, pageSize, status, billNum, groupOrPoSn, billDateStr, billDateEnd, paymentTypeList, manufacturerId, attributeIdList, industrialParkId,
        manufacturerName: manufacturerId ? "" : manufacturerName
    }).then(res => {
        let { code, message = '服务错误', data } = res
        if (code !== window.HTTP_SUCCESS) {
            return ElMessage.error(message)
        }
        const { items, totalCount } = data || {}
        tableData.value = items || []
        pageData.value.totalCount = totalCount || 0
        nextTick(() => {
            if (billNumber && totalCount > 0) {
                Object.assign(items[0], {
                    industrialParkId: searchData.value.industrialParkId,
                    manufacturerId: searchData.value.manufacturerId
                })
                handleOpenViewDialog(items[0])
                billNumber = null
            }
        })
    })
}

const getMainBillDetail = async () => {
    mainBillDetail({
        billId: route.query.billId,
    }).then(res => {
        let { code, message = '服务错误', data } = res
        if (code !== window.HTTP_SUCCESS) {
            return $vue.$message.error({ message })
        }
        searchData.value.industrialParkId = data.industrialParkId
        searchData.value.manufacturerId = data.manufacturerId
        getTableList();
    })
}
//突出显示某一行数据
const tableRowClassName = ({ row, rowIndex }) => {
    // TODO 判断差异率大于10%就显示红色
    if (row.varianceRate > 0) {
        return 'warning-row'
    }
    return ''
}
/**
 * 自定义排序功能
 */
const sortChange = (row, column) => {
    const { order, prop } = row || {}
    if (order) {
        const params = {
            sortAsc: order ? order == 'ascending' : '',
            sortColumn: order ? prop.replace(/([A-Z])/g, "_$1").toLowerCase() : '' //驼峰转换下划线
        }
        Object.assign(searchData.value, params)
    } else {
        delete searchData.value.sortAsc
        delete searchData.value.sortColumn
    }
    getTableList()
}
//列表单选
const handleSelectRow = (selection, row) => {
    //取消全选
    let selected = selection.indexOf(row) > -1;

}
//列表全选
const handleTableSelectAllRow = (selection) => {
}

//分页模块改变的值
const pageSizeChange = (val) => {
    //console.log('改变分页模块的值：', val)
    pageData.value = Object.assign(pageData.value, val)
    getTableList()
}

const multipleTableRef = ref();
const auditDialogRef = ref();
//type:0 填写备注，1.启动核算，2.启动结款,3.导出
const handleOpenDialog = (type) => {
    let selectedRows = multipleTableRef.value.getSelectionRows();
    console.log(selectedRows);
    if (!selectedRows.length) {
        return ElMessage({
            showClose: true,
            message: '请先选择要操作的数据',
            type: 'error',
        })
    }

    let selectRowIds = selectedRows.map(p => p.id);

    const params = {
        selectRowIds,
        manufacturerId: selectedRows[0].manufacturerId, // id相同
        //选择的行数
        selectRowCount: selectedRows.length
    }
    auditDialogRef.value.openDialog(type, params);
}

const monthlyStatementViewRef = ref();
const handleOpenViewDialog = (row) => {
    row = unref(row);
    row.billStatus = 2 //账单状态:1 待核算,2.核算中
    row.auditStatus = 2 //账单核算流程状态: 2 财务审核
    row.isErrorPage = true
    row.selectRowIds = [row.id];
    monthlyStatementViewRef.value.openDialog(row);
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

        .content__button-group {
            float: right;
            margin-bottom: 8px;
        }

        .table_box {
            height: calc(100% - 24px);
        }
    }

    .stop_buttom_color {
        border-color: #999 !important;
        color: #666 !important;
    }

}
</style>
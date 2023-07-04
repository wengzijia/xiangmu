<template>
    <div class="commonTableListBox">
        <CommonBreadCrumb :first="'计费规则配置'" :marginBottom="'16px'" />
        <el-select v-model="parkCode" placeholder="全部" @change="selectPark" style="width: 200px; position: absolute;top: 54px; right: 24px;">
            <el-option v-for="item in parkList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="select_box">
            <div class="select_top">
                <div class="select_group">
                    <el-form :inline="true" ref="processorFormRef" :model="processorParam" class="demo-form-inline"
                        style="width:100%;" @submit.prevent>
                        <!-- <el-form-item label="加工商" prop="processorName">
                            <el-select v-model="processorParam.processorName" filterable clearable @change="searchChange"
                                :filter-method="searchFilter" placeholder="请输入" class="nameInput">
                                <el-option v-for="item in processorList" :key="item.manufacturerId"
                                    :label="item.manufacturerName" :value="item.manufacturerName" />
                            </el-select>
                        </el-form-item> -->
                        <filterable @dropFilterableChange="fruitFilterableChange"
                            :manufacturerName="processorParam.processorName" :defaultValuelist="processorList" />
                        <el-form-item style="float: right;margin-right: 0;" class="selecct_item_serachBox">
                            <el-button type="primary" class="search_button" @click="query"><el-icon :size="16">
                                    <Search />
                                </el-icon>查询</el-button>
                            <el-button class="reset_button" @click="reset"><el-icon :size="16">
                                    <Refresh />
                                </el-icon>重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="select_bottom">
                <div class="select_group">
                    <el-form :inline="true" ref="craftFormRef" :model="listParam" class="demo-form-inline"
                        style="width:100%;">
                        <el-form-item label="工艺" prop="attributeIds">
                            <el-select v-model="listParam.attributeIds" multiple collapse-tags collapse-tags-tooltip
                                placeholder="全部" @change="selectChange">
                                <el-option v-for="item in craftList" :key="item.attributeId" :label="item.attributeName"
                                    :value="item.attributeId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态" prop="ruleStatus">
                            <el-select v-model="listParam.ruleStatus" placeholder="全部" @change="selectChange">
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="content_box" style="padding: 20px 20px 76px 20px;">
            <div class="table_box" id="getTableHeight">
                <el-table :data="tableList" border :height="tableHeight" :span-method="objectSpanMethod"
                    @row-click="row => tableJump(row)" @sort-change="sort">
                    <!-- sortable="custom" -->
                    <el-table-column label="加工商" align="center">
                        <template #default="scope">
                            <div style="color: #333333;">{{ scope.row.manufacturerName }}</div>
                            <!-- <div style="color: #333333;">{{ scope.row.manufacturerName + '-' + scope.row.relationName }}</div> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="工艺" align="center">
                        <template #default="scope">
                            <div style="color: #333333;">{{ scope.row.attributeName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="公式详情" width="480px" align="center">
                        <template #default="scope">
                            <div style="color: #333333;">{{ scope.row.formulaDesc }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="计费规则版本" width="140px" align="center">
                        <template #default="scope">
                            <div style="color: #333333;">{{ 'V' + scope.row.version }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="140px" align="center">
                        <template #default="scope">
                            <div style="color:#666666;" :style="colorMap[scope.row.ruleStatus]">{{
                                statusMap[scope.row.ruleStatus] }}</div>
                        </template>
                    </el-table-column>
                    <!-- sortable="custom" -->
                    <el-table-column label="启用时间" width="280px" align="center">
                        <template #default="scope">
                            <div style="color: #333333;">{{ parseTime(scope.row.enableTime, '{y}-{m}-{d}') ||
                                '-' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140px" align="center">
                        <template #default="scope">
                            <el-button class="edit_buttom" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="footer">
            <pageIndex @dropDownValueChange="fruitValueChange" v-if="tableList && tableList.length > 0"
                :pageNumber="pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>
    </div>
</template>
  
<script name="unitChargeRuleListCG" setup>
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import filterable from "@/layout/commonLayout/filterable.vue";
import { onMounted, ref, onUnmounted } from 'vue'
import { getAllManufacturerList, getAttList, getBillRulePage } from "@/api/modules/unitChargeRule";
import { getIndustrialParkList } from "@/api/modules/processor";
import { ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import router from "@/router";
import { parseTime } from "@/utils/util"
import { getMergeItem, openNewPage } from "@/utils/commonApi"

// 加工商表单ref
const processorFormRef = ref();
// 工艺表单ref
const craftFormRef = ref();
// 加工商列表
let processorList = ref([])
// 工艺列表
let craftList = ref([])
// 状态列表 启用中/审核中/未启用
const statusList = reactive([
    {
        label: "全部", value: ""
    },
    {
        label: "草稿", value: "1"
    },
    {
        label: "审核中", value: "2"
    },
    {
        label: "未启用", value: "3"
    },
    {
        label: "启用中", value: "4"
    }
])
// 产业园切换
const parkCode =ref('1')

const parkList = ref([
    {
        label: "麻奢产业园", value: "1"
    },
    {
        label: "世发产业园", value: "2"
    },
    {
        label: "单工序外发", value: "3"
    },
    {
        label: "整单外发", value: "4"
    }
])
const getParkList = () => {
    let temp = []
    getIndustrialParkList().then(res=> {
        console.log(res)
        if(res.data && res.data.length) {
            res.data.map(item => {
                temp.push({label: item.parkName,value: item.id})
            })
            temp.push({label: '单工序外发',value: '111111'})
            temp.push({label: '整单外发',value: '222222'})
            // temp.push({label: '未入驻',value: '333333'})
            parkList.value = temp
            parkCode.value = temp[0].value
            listParam.relationId = temp[0].value
        }
    })
}
const selectPark =(val) => {
    console.log(val);
    processorParam.processorName =''
    if(val == '111111') {
        listParam.manufacturerType = '3'
        listParam.relationId = '-1'
    } else if( val == '222222') {
        listParam.manufacturerType = '4'
        listParam.relationId = '-1'
    } else if( val == '333333') {
        listParam.manufacturerType = '2'
        listParam.relationId = '-1'
    } else {
        listParam.manufacturerType = '1'
        listParam.relationId = val
    }
    getProcessorList()
    query()
}
// 加工商参数
let processorParam = reactive({
    processorName: ""
})

// 表格列表
let tableList = ref([])
let pageNumber = ref(1)
let pageData = reactive({
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 0
})
// 列表参数
let listParam = reactive({
    attributeIds: [], // 工艺id集合
    manufacturerName: "", // 加工商名称
    // sortType: 0, // 排序类型：0.按加工商首字母正序，1.按时间(审核列表是按创建时间，其他列表是按启用时间)正序
    pageNumber: 1, // 当前页
    pageSize: 15, // 显示条数
    ruleStatus: "", // 状态
    relationId: parkCode.value,
    manufacturerType:'1'
})
// 状态处理成文字
let statusMap = {
    1: "草稿",
    2: "审核中",
    3: "未启用",
    4: "启用中",
    5: "已失效"
}
// 文字颜色处理
let colorMap = {
    1: "color:#338F7A",
    2: "color:#F9B300;"
}
var tableHeight = ref()
let channel = ""
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
    getCraftList()
    getProcessorList()
    getParkList()
    getTableList().finally(() => {
        if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
    })
    window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
        return (() => {
            if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
        })();
    };
    channel = new BroadcastChannel("channel-unitChargeRuleListCG");
    channel.addEventListener("message", function (e) {
        if (e.data.refreshData) {
            getCraftList()
            getProcessorList()
            getTableList()
        }
    });
});
onUnmounted(() => {
    channel.close();
})
// 获取加工商列表
async function getProcessorList() {
    let { code, data, message } = await getAllManufacturerList({relationId: listParam.relationId, manufacturerType:listParam.manufacturerType,ruleStatus:listParam.ruleStatus});
    if (code == '000000') {
        processorList.value = data
    } else {
        ElMessage.error(message)
    }
}
// 获取工艺列表
async function getCraftList() {
    let { code, data, message } = await getAttList();
    if (code == '000000') {
        craftList.value = data
    } else {
        ElMessage.error(message)
    }
}
// 获取表格列表
async function getTableList() {
    let { code, data, message } = await getBillRulePage(listParam);
    if (code == '000000') {
        tableList.value = data.items
        pageData.totalCount = data.totalCount
        pageNumber.value = data.pageNumber
        pageData.pageSize = data.pageSize
    } else {
        ElMessage.error(message)
    }
}

/**
 * 加工商搜索框组件传回来的值
 * @param {*} val 
 */
const fruitFilterableChange = (val) => {
    console.log(val, '输入框的值')
    processorParam.processorName = val
}

//下拉框切换选项触发
const selectChange = (val) => {
    listParam.pageNumber = 1
    getTableList()
}
//查询按钮
const query = () => {
    listParam.pageNumber = 1
    listParam.manufacturerName = processorParam.processorName
    getTableList()
}
// 点击重置
const reset = () => {
    // 表单清除需要再标签加上prop
    processorFormRef.value.resetFields()
    craftFormRef.value.resetFields()
    processorParam.processorName = ""
    listParam.manufacturerName = ""
    listParam.pageNumber = 1
    getTableList()
};

//分页模块改变的值
const fruitValueChange = (val) => {
    console.log('改变分页模块的值：', val)
    listParam.pageNumber = val.pageNumber
    listParam.pageSize = val.pageSize
    getTableList()
}

// ascending 表示升序，descending 表示降序，null 表示还原为原始顺序
const sortMap = {
    "ascending": 0,
    "descending": 1
}

//合并项操作
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (columnIndex === 0) {
        const _row = getMergeItem(tableList.value, ['manufacturerName'])[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        }
    }
    if (columnIndex === 1) {
        const _row = getMergeItem(tableList.value, ['manufacturerName', 'attributeId'])[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        }
    }
    if (columnIndex === 2) {
        const _row = getMergeItem(tableList.value, ['manufacturerName', 'attributeId', 'formulaDesc'])[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        }
    }
}
// 排序
function sort(e) {
    let { column, prop, order } = e
    if (order) {
        listParam.sortType = sortMap[order]
        getTableList()
    } else {
        listParam.sortType = 0
    }
}

// 表格跳转
const tableJump = (row) => {
    // window.open(`/unitChargeRule/unitChargeRuleCGDetail?id=${row.id}`, '_blank')
    openNewPage(`/unitChargeRule/unitChargeRuleCGDetail?id=${row.id}`)
}

</script>
  
<style lang="scss" scoped>
@import "@/assets/css/listTable.scss";
</style>
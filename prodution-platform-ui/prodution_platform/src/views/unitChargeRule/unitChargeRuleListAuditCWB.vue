<template>
    <div class="commonTableListBox">
        <CommonBreadCrumb :first="'计费规则配置'" :marginBottom="'16px'" />
        <el-select v-model="parkCode" placeholder="全部" @change="selectPark" style="width: 200px; position: absolute;top: 54px; right: 24px;">
            <el-option v-for="item in parkList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="select_box">
            <div class="select_top">
                <div class="select_group">
                    <el-form :inline="true" :model="nameParam" class="demo-form-inline" style="width:100%;"  @submit.prevent>
                        <!-- <el-form-item label="加工商">
                            <el-select v-model="nameParam.name" filterable clearable placeholder="请输入" class="nameInput">
                                <el-option v-for="item in nameList" :key="item.manufacturerId"
                                    :label="item.manufacturerName" :value="item.manufacturerName" />
                            </el-select>
                        </el-form-item> -->

                        <filterable @dropFilterableChange="fruitFilterableChange"
                            :manufacturerName="nameParam.name" :defaultValuelist="nameList" />
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
                    <el-form :inline="true" :model="listParam" class="demo-form-inline" style="width:100%;">
                        <el-form-item label="工艺">
                            <el-select v-model="listParam.attributeIds" class="typeSelect" placeholder="全部" collapse-tags
                                multiple collapse-tags-tooltip clearable @change="selectChange">
                                <el-option v-for="item in typeList" :key="item.attributeId" :label="item.attributeName"
                                    :value="item.attributeId" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="content_box">
            <div class="table_box" id="getTableHeight">
                <el-table ref="tableRef" :data="tableData" border :height="tableHeight"
                    @row-click="(row) => toValidDetail(row)" @sort-change="sort"
                    :default-sort="{ prop: 'manufacturerName', order: 'ascending' }">
                    <!-- sortable="custom" -->
                    <el-table-column prop="manufacturerName" label="加工商" width="160px"  align="center">
                        <template #default="scope">
                            <div style="color: #333333;">{{ `${scope.row.manufacturerName}` }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="attributeName" label="工艺" width="160px" align="center">
                        <template #default="scope">
                            <div style="color: #333333;">{{ scope.row.attributeName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="公式详情" min-width="200px" align="center">
                        <template #default="scope">
                            <div style="color: #333333;">
                                {{ scope.row.formulaDesc }}
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="计费规则版本" width="120px" align="center">
                        <template #default="scope">
                            <div style="color: #333333;">
                                {{ `V${scope.row.version}` }}
                            </div>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="状态" width="120px" align="center">
                        <template #default="scope">
                            <div style="color: #F9B300;">{{ '审核中' }}</div>
                            <!-- auditStatus	审核状态：1.采购经理通过，2.采购经理不通过，3.产业园财务通过，4.产业园财务不通过 -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="创建时间" width="180px" align="center">
                        <template #default="scope">
                            <div style="color: #333333;">{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100px" align="center">
                        <template #default="scope">
                            <el-button class="audit" size="small">审核</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="footer">
            <pageIndex @dropDownValueChange="fruitValueChange" v-if="tableData && tableData.length > 0"
                :pageNumber="pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>
    </div>
</template>
    
<script name="unitChargeRuleListAuditCWB" setup>
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import { onMounted, ref, reactive, watch, onUnmounted } from 'vue'
import { ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import { getUnitBillRuleListHttp, getAllManufacturerList, getAttList } from "@/api/modules/unitChargeRule"
import { getIndustrialParkList } from "@/api/modules/processor";
import { parseTime } from "@/utils/util"
import { openNewPage } from "@/utils/commonApi"
import filterable from "@/layout/commonLayout/filterable.vue";


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
    nameParam.name = ''
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
    getName()
    query()
}

// 产业园名称
let nameParam = reactive({
    name: ""
})

watch(() => nameParam.name, (val) => {
    listParam.manufacturerName = val
})


const fruitFilterableChange = (val) => {
    console.log(val, '输入框的值')
    nameParam.name = val
}

// 产业园列表参数
let listParam = reactive({
    language: "zh-cn",
    ruleStatus: 2, // 1.草稿，2.审核中，3.未启用，4.启用中，5.已失效
    manufacturerName: "",
    attributeIds: [],
    pageNumber: 1, // 当前页
    pageSize: 15, // 显示条数
    sortType: 0,
    relationId: parkCode.value,
    manufacturerType: '1'
})

let pageNumber = ref(1)
let pageData = reactive({
    pageSize: 2,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 0
})

//获取表格数据
let tableData = ref([]);

var tableHeight = ref()
let channel = ""
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
    getParkList()
    tableHeight.value = document.getElementById('getTableHeight').clientHeight
    window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
        return (() => {
            tableHeight.value = document.getElementById('getTableHeight').clientHeight
        })();
    };
    channel = new BroadcastChannel("channel-unitChargeRuleListAuditCWB");
    channel.addEventListener("message", function (e) {
        if (e.data.refreshData) getTableList()
    });
});
onUnmounted(() => {
    channel.close();
})

// 审核详情
const toValidDetail = (row) => {
    // window.open(`/unitChargeRule/unitChargeRuleAuditCWDetail?id=${row.id}`, '_blank')
    openNewPage(`/unitChargeRule/unitChargeRuleAuditCWDetail?id=${row.id}`)
}

// 选择改变
const selectChange = () => {
    listParam.pageNumber = 1
    getTableList()
}

// 获取产业园名称
let nameList = ref([])
async function getName() {
    let { code, data, message } = await getAllManufacturerList({relationId: listParam.relationId, manufacturerType:listParam.manufacturerType,ruleStatus:listParam.ruleStatus});
    if (code == '000000') {
        nameList.value = data
    } else {
        ElMessage.error(message)
    }
}

// 获取工艺表列表
const typeList = ref([])
async function getAttListFn() {
    let { code, data, message } = await getAttList();
    if (code !== '000000') return ElMessage.error(message)
    typeList.value = data;
}

// 获取单价计费规则审核列表
async function getTableList() {
    let { code, data, message } = await getUnitBillRuleListHttp(listParam);
    if (code == '000000') {
        tableData.value = data.items || []
        pageData.totalCount = data.totalCount
        pageNumber.value = data.pageNumber
        pageData.pageSize = data.pageSize
    } else {
        ElMessage.error(message)
    }
}

// 初始化页面数据
function initPageData() {
    getAttListFn().then(() => getTableList())
    getName()
}
initPageData()

//分页模块改变的值
const fruitValueChange = (val) => {
    console.log('改变分页模块的值：', val)
    listParam.pageNumber = val.pageNumber
    listParam.pageSize = val.pageSize
    getTableList()
}

const query = () => {
    listParam.pageNumber = 1
    listParam.manufacturerName = nameParam.name
    getTableList()
}

// 重置
const reset = () => {
    nameParam.name = ""
    listParam.manufacturerName = ""
    listParam.attributeIds = []
    listParam.pageNumber = "1"
    listParam.sortType = 0
    getTableList()
}

// ascending 表示升序，descending 表示降序，null 表示还原为原始顺序
const sortMap = {
    "ascending": true,
    "descending": false
}
// 排序
let tableRef = ref()
function sort(e) {
    let {  prop, order } = e
    if (order === "ascending") {
        if (prop == "manufacturerName") {
            listParam.sortType = 0
        } else if (prop == "updateTime") {
            listParam.sortType = 1
        } else if (prop == "attributeName") {
            listParam.sortType = 2
        }
    } else {
        listParam.sortType = 0
        tableRef.value.sort('manufacturerName', 'ascending')
    }
    getTableList()
}

</script>
    
<style lang="scss" scoped>
@import "@/assets/css/listTable.scss";

.commonTableListBox {
    .audit {
        color: var(--vt-c-theme-colors);

        background-color: transparent;
        border-color: var(--vt-c-theme-colors);

        &:hover {
            opacity: 0.5;
        }
    }

    .content_box {
        padding: 20px 20px 76px 20px;
    }

    .table_box {

        &:deep(.el-table__header) {
            th {
                background-color: #f2f2f2;
                color: #333333;
                font-weight: 400;

                .descending {
                    display: none;
                }
            }
        }
    }
}
</style>
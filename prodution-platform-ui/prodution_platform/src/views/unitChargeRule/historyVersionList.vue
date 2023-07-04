<template>
    <div class="user_manage_page">
        <CommonBreadCrumb :first="'计费规则配置'" :marginBottom="'16px'" />
        <div class="content_box">
            <div class="title">历史版本</div>
            <div class="table_box" id="getTableHeight">
                <el-table :data="versionsData" border :height="tableHeight" :row-style="cellStyle" @row-click="row => toPage(row)">
                    <el-table-column label="版本号" align="center">
                        <template #default="scope">
                            <div>
                                <span v-if="scope.row.version">{{ 'V' + scope.row.version }}</span>
                                <span v-if="scope.row.version == version">（当前版本）</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" align="center">
                        <template #default="scope">
                            <div>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="最近更新时间" align="center">
                        <template #default="scope">
                            <div>{{ parseTime( scope.row.auditStatus == 1 || scope.row.auditStatus == 3 ? scope.row.createTime : scope.row.updateTime, '{y}-{m}-{d} {h}:{i}') }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center">
                        <template #default="scope">
                            <div style="color:#666666;" :style="colorMap[scope.row.ruleStatus]">{{
                                statusMap[scope.row.ruleStatus] }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <el-button class="look" size="small" v-if="scope.row.version != version">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="footer">
            <pageIndex @dropDownValueChange="fruitValueChange" v-if="versionsData.length" :pageNumber="pageNumber"
                :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>
    </div>
</template>
    
<script name="historyVersionList" setup>
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getBillRuleHisPage } from "@/api/modules/unitChargeRule";
import { parseTime } from "@/utils/util"
import {openNewPage } from "@/utils/commonApi"
const router = useRouter();
const route = useRoute();
let { attributeId, manufacturerId, valuationFormulaId, version, detail } = route.query;

// 状态处理成文字
let statusMap = {
    1: "草稿",
    2: "审核中",
    3: "未启用",
    4: "启用中",
    5: "已失效",
};

// 列表参数
let listParam = reactive({
    attributeId, // 工艺id
    manufacturerId, // 加工商id
    valuationFormulaId, // 计价公式id
    pageNumber: 1, // 当前页
    pageSize: 15 // 显示条数
})

let pageNumber = ref(1)
let pageData = reactive({
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 0
})

// 文字颜色处理
let colorMap = {
    1: "color:#338F7A",
    2: "color:#F9B300;"
}

// 历史版本数据
let versionsData = ref([])

//获取表格数据
let tableData = ref([]);

var tableHeight = ref()
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
    tableHeight.value = document.getElementById('getTableHeight').clientHeight
    window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
        return (() => {
            tableHeight.value = document.getElementById('getTableHeight').clientHeight
        })();
    };
});

// 获取历史版本数据
async function getHistoryVersions() {
    let { code, data, message } = await getBillRuleHisPage(listParam);
    if (code == '000000') {
        versionsData.value = data.items
        pageData.totalCount = data.totalCount
        pageNumber.value = data.pageNumber
        pageData.pageSize = data.pageSize
    } else {
        ElMessage.error(message)
    }
}

getHistoryVersions()

const cellStyle = (row) => {
  if (row.row.version == version) {
    return { cursor: "not-allowed" }
  } else {
    return { cursor: "pointer" }
  }
}

//分页模块改变的值
const fruitValueChange = (val) => {
    console.log('改变分页模块的值：', val)
    listParam.pageNumber = val.pageNumber
    listParam.pageSize = val.pageSize
    getHistoryVersions()
}


const toPage = (row) => {
    console.log('row', row);
    if (row.version == version) {
        return
    }
    // window.open(`${detail}?id=${row.id}`, '_blank')
    openNewPage(`${detail}?id=${row.id}`)
}

</script>
    
<style lang="scss" scoped>
.user_manage_page {
    height: 100%;
    overflow: hidden;
    padding: 16px 24px 24px 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .content_box {
        padding: 20px 40px 100px 40px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 4px;
        position: relative;
        flex: 1;
        overflow: hidden;

        .title {
            color: #333333;
            font-weight: 700;
        }

        .table_box {
            width: 100%;
            // height: calc(100% - 16px);
            height: 100%;
            overflow: hidden;
            margin-top: 16px;

            &:deep(.el-table__header) {
                th {
                    background-color: #f2f2f2;
                    color: #333333;
                }
            }

            // .statusName {
            //     position: relative;
            //     padding-left: 20px;
            // }

            // .statusName::after {
            //     position: absolute;
            //     content: '';
            //     width: 6px;
            //     height: 6px;
            //     background: var(--vt-c-theme-colors);
            //     ;
            //     border-radius: 50%;
            //     left: 0;
            //     top: 50%;
            //     transform: translateY(-50%);
            // }

            .look {
                color: var(--vt-c-theme-colors);
                background-color: transparent;
                border-color: var(--vt-c-theme-colors);
                width: 44px;
                height: 25px;

                &:hover {
                    opacity: 0.5;
                }
            }

        }
    }


    .footer {
        position: fixed;
        right: 56px;
        bottom: 40px;
    }
}
</style>
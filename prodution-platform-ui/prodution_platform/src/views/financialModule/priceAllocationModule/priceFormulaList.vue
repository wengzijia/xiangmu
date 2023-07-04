<template>
    <div class="commonTableListBox">
        <CommonBreadCrumb :first="'计价标准配置'" :marginBottom="'16px'" />
        <div class="select_box">
            <div class="select_bottom">
                <div class="select_group">
                    <el-form :inline="true" :model="selectData" class="demo-form-inline" style="width:100%;">
                        <el-form-item label="工艺">
                            <el-select v-model="selectData.attributeIds" multiple collapse-tags collapse-tags-tooltip
                                placeholder="全部" @change="switchingData">
                                <el-option v-for="item in attributeIdsArr" :key="item.attributeId"
                                    :label="item.attributeName" :value="item.attributeId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="selectData.exprStatus" placeholder="请选择状态" @change="switchingData">
                                <el-option v-for="item in statusArr" :key="item" :label="item.label" :value="item.type" />
                            </el-select>
                        </el-form-item>

                        <el-form-item style="float: right;margin-right: 0;" class="selecct_item_serachBox">

                            <el-button class="reset_button" @click="handleResetSelecter"><el-icon :size="16">
                                    <Refresh />
                                </el-icon>重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

        <div class="content_box">
            <div class="table_box" id="getTableHeight">
                <el-table :data="tableData" :span-method="objectSpanMethod" :header-cell-style="{ color: '#333' }" border
                    :height="tableHeight">
                    <el-table-column prop="attributeName" label="工艺" width="160" align="center" />
                    <el-table-column prop="formulaDesc" label="公式详情" min-width="300" align="center" />
                    <el-table-column prop="exprStatus" label="状态" width="120" align="center">
                        <template #default="scope">
                            <span>{{
                                scope.row.exprStatus == 1 ? '启用中' : '禁用中'
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200" align="center">
                        <template #default="scope">
                            <div style="color: #333;">{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') || '-' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="manufacturerName" label="加工商" min-width="160" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.manufacturerName || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center">
                        <template #default="scope">
                            <el-button class="edit_buttom" size="small"
                                :class="{ stop_buttom_color: scope.row.exprStatus == 1 }"
                                @click="handleEditUser(scope.row)">{{ scope.row.exprStatus == 1 ? '禁用' : '启用'
                                }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>


        </div>

        <div class="footer">
            <pageIndex @dropDownValueChange="fruitValueChange" v-if="tableData && tableData.length > 0"
                :pageNumber="pageData.pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>
        <priceFormulaListDialog :dialogData="dialogData" @setDialogBtn="getDialogBtn" v-if="dialogDataFlag" />
    </div>
</template>
  
<script name="PriceFormulaList" setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import priceFormulaListDialog from "@/layout/financialLayout/priceFormulaListDialog.vue";
import { getAttriList } from "@/api/modules/processor";
import { getValuationFormulaPage, updateExprStatus, validExprStatus } from "@/api/modules/financia"
import { getMergeItem } from "@/utils/commonApi"
import { parseTime } from "@/utils/util"
import { ElMessage } from "element-plus";
import router from "@/router";
const { proxy } = getCurrentInstance()
let dialogDataFlag = ref(false)
const dialogData = ref({})
var tableHeight = ref()
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
    if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
    window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
        return (() => {
            if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
        })();
    };
    getTableList()
    getAttributeIdsList()
});
const pageData = ref({
    pageNumber: 1,
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 300
})
const selectData = ref({
    attributeIds: [],
    exprStatus: '',
});
//选择工艺选项数组
const attributeIdsArr = ref([]);
function getAttributeIdsList() {
    getAttriList().then(res => {
        if (res.code != '000000') return
        attributeIdsArr.value = res.data || []
    })
}
//选择状态选项数组
const statusArr = ref([
    { label: "全部", type: '' },
    { label: "启用中", type: 1 },
    { label: "禁用中", type: 2 }
]);
//下拉框切换选项触发
const switchingData = () => {
    pageData.value.pageNumber = 1
    getTableList()
}
// 点击重置
const handleResetSelecter = () => {
    selectData.value = { attributeIds: [], exprStatus: '' }
    pageData.value.pageNumber = 1
    getTableList()
};
//获取表格数据
const tableData = ref([]);
/**
 * 获取加工商列表数据
 */
function getTableList() {
    const { pageNumber, pageSize } = pageData.value
    const { attributeIds, exprStatus } = selectData.value
    const params = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        attributeIds: attributeIds
    }
    if (exprStatus) params.exprStatus = exprStatus
    getValuationFormulaPage(params).then(res => {
        console.log(res)
        if (!res || res.code != '000000') return ElMessage({
            showClose: true,
            message: res?.message || '服务错误',
            type: 'error',
        })
        const { items, totalCount } = res.data || {}
        items.forEach(item => {
            const { manufacturerList } = item
            const manufacturerListName = []
            if (manufacturerList && manufacturerList.length > 0) {
                manufacturerList.forEach(val => {
                    manufacturerListName.push(val.manufacturerName)
                })
            }
            item.manufacturerName = manufacturerListName ? manufacturerListName.join('、') : ''
        })
        tableData.value = items
        pageData.value.totalCount = totalCount || 0
    })
}

//合并项操作
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (columnIndex === 0) {
        const _row = getMergeItem(tableData.value, ['attributeId'])[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
            rowspan: _row,
            colspan: _col,
        }
    }
}

let updateExprStatusParams = {}
/**
 * 点击启用或者禁用按钮
 * @param {*} index 
 * @param {*} row 
 */
const handleEditUser = (row) => {
    const { exprStatus, attributeId, id, manufacturerList } = row
    //如果是启用该公式，弹框提示用户是否启用
    updateExprStatusParams = { exprStatus: exprStatus == 1 ? 2 : 1, attributeId, id }
    if (manufacturerList && manufacturerList.length > 0) updateExprStatusParams.manufacturerIds = manufacturerList.map(item => { return item.manufacturerId })
    //该公式当前状态是禁用，反之点击的按钮就是启用
    if (exprStatus == 2) return yunShowModal({ content: '是否确定启用此公式，如确定启用，可根据此公式配置单价计费规则!' }, updateExprStatusParams)
    //如果是禁用该公式，先判断是否有加工商使用该公式，如果有，弹框提示有哪些加工商正在使用，如果没有，提示用户是否禁用即可
    validExprStatus(updateExprStatusParams).then(res => {
        console.log('判断是否有加工商使用该公式：', res)
        const { code, message, data } = res || {}
        if (code == '000000') return yunShowModal({ content: '是否确定禁用此公式，若禁用此公式会导致以此公式配置相应单价计费规则都无法使用!', cancel: '取消' }, updateExprStatusParams)
        if (code == 'S-000006') {//表示有加工商使用该公式，需要弹框提示用户
            dialogDataFlag.value = true
            return dialogData.value = { message, data }
        }
        ElMessage({ showClose: true, message: message || '服务错误', type: 'error' })
    })

};
function yunShowModal(obj, params) {
    proxy.$yun.showModal({
        cancel: obj.cancel || '暂不启用',
        content: obj.content,
    }).then(res => {
        console.log(res)
        if (res.type == 'confirm') {
            updateExprStatus(params).then(res => {
                if (res.code != '000000') return ElMessage({
                    showClose: true,
                    message: res?.message || '服务错误',
                    type: 'error',
                })
                getTableList()

            })
        }
    })
}
const getDialogBtn = (val) => {
    dialogDataFlag.value = false
    if (val) updateExprStatus(updateExprStatusParams).then(res => {
        if (res.code != '000000') return ElMessage({
            showClose: true,
            message: res?.message || '服务错误',
            type: 'error',
        })
        getTableList()

    })
}
//分页模块改变的值
const fruitValueChange = (val) => {
    console.log('改变分页模块的值：', val)
    pageData.value = Object.assign(pageData.value, val)
    getTableList()
}
</script>
  
<style lang="scss" scoped>
@import "@/assets/css/listTable.scss";

.commonTableListBox {
    .content_box {
        padding-top: 20px;
    }

    .stop_buttom_color{
        border-color:#999 !important;
        color: #666 !important;
    }

}
</style>
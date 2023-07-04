<template>
    <div class="formulaConfigurationBox commonTableListBox">
        <CommonBreadCrumb :first="'计价标准配置'" :marginBottom="'16px'" />
        <div class="select_box">
            <div class="select_top">
                <div class="select_group">
                    <el-form :inline="true" @submit.prevent :model="defaultValue" class="demo-form-inline" style="width:100%;">
                        <!-- <el-form-item label="加工商">
                            <el-select v-model="defaultValue.manufacturerName" @change="searchChange"
                                :filter-method="searchFilter" style="height:28px;line-height:28px;" clearable filterable
                                placeholder="请输入" no-match-text="无匹配项">
                                <el-option v-for="item in processorArr" :key="item.manufacturerId"
                                    :label="item.manufacturerName" :value="item.manufacturerName" />
                            </el-select>
                        </el-form-item> -->
                        <filterable  @dropFilterableChange="fruitFilterableChange" :manufacturerName="defaultValue.manufacturerName" :defaultValuelist="processorArr" />
                        
                        <el-form-item style="float: right;margin-right: 0;" class="selecct_item_serachBox">
                            <el-button type="primary" class="search_button" @click="handleSubmitSelecter"><el-icon
                                    :size="16">
                                    <Search />
                                </el-icon>查询</el-button>
                            <el-button class="reset_button" @click="handleResetSelecter"><el-icon :size="16">
                                    <Refresh />
                                </el-icon>重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
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
                    </el-form>
                </div>
            </div>

        </div>
        <div class="content_box">
            <div class="table_box" id="getTableHeight">
                <el-table :data="tableData" :span-method="objectSpanMethod" :header-cell-style="{ color: '#333' }"
                    :height="tableHeight" border>
                    <el-table-column prop="attributeName" label="工艺" width="160" align="center" />
                    <el-table-column prop="formulaDesc" label="公式详情" min-width="260" align="center" />
                    <el-table-column prop="exprStatus" label="状态" width="120" align="center">
                        <template #default="scope">
                            <span>{{
                                scope.row.exprStatus == 1 ? '启用中' : '禁用中'
                            }}</span>
                        </template>
                    </el-table-column>
                  
                    <el-table-column prop="manufacturerName" label="加工商" min-width="200" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.manufacturerName || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center">
                        <template #default="scope">
                            <el-button class="edit_buttom" size="small"
                                @click="handleEditUser(scope.$index, scope.row)">关联加工商</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
        <div class="footer">
            <pageIndex @dropDownValueChange="fruitValueChange" v-if="tableData && tableData.length > 0"
                :pageNumber="pageData.pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>

        <formulaConfigurationDialog v-if="dialogDataFlag" :dialogData="dialogData" @setDialogBtn="getDialogBtn" :processorArr='processorArr' />
    </div>
</template>
  
<script name="FormulaConfiguration" setup>
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import filterable from "@/layout/commonLayout/filterable.vue";
import formulaConfigurationDialog from "@/layout/financialLayout/formulaConfigurationDialog.vue";
import { onMounted, ref } from 'vue'
import { getAllManufacturerList, getAttriList } from "@/api/modules/processor";
import { getManufacturerValuationFormulaPage } from "@/api/modules/financia"
import { getMergeItem } from "@/utils/commonApi"
import router from "@/router";
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
    getProcessorNameList()
});
const pageData = ref({
    pageNumber: 1,
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 400
})
const selectData = ref({
    attributeIds: [],//工艺id
    pageNumber: 1,
    pageSize: 15,
});
const defaultValue =ref({
    manufacturerName:''
})
//选择工艺选项数组
const attributeIdsArr = ref([]);
let defaultValuelist = [] //存放初始选项的搜索值
//下拉框切换选项触发
const switchingData = () => {
    console.log(selectData.value)
    pageData.value.pageNumber = 1
    getTableList()
}
//点击查询
const handleSubmitSelecter = () =>{
    pageData.value.pageNumber = 1
    selectData.value.manufacturerName = defaultValue.value.manufacturerName
    getTableList()
}
// 点击重置
const handleResetSelecter = () => {
    selectData.value = { attributeIds: [], manufacturerName: '' }
    defaultValue.value.manufacturerName = ''
    pageData.value.pageNumber = 1
    getTableList()
    console.log('点击重置', selectData.value)
};
const processorArr = ref([])
/**
 * 获取 加工商名称/工艺名称 数据
 */
function getProcessorNameList() {
    getAllManufacturerList().then(res => {
        if (res.code != '000000') return
        processorArr.value = res.data
        defaultValuelist = res.data
    })
    getAttriList().then(res => {
        console.log(res)
        if (res.code != '000000') return
        attributeIdsArr.value = res.data || []

    })
}
//获取表格数据
const tableData = ref([]);
/**
 * 获取加工商列表数据
 */
function getTableList() {
        selectData.value.pageNumber = pageData.value.pageNumber
        selectData.value.pageSize = pageData.value.pageSize
        getManufacturerValuationFormulaPage(selectData.value).then(res => {
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
                        const {relationName,manufacturerName} = val
                        // const name = relationName ? manufacturerName + '-' + relationName : manufacturerName
                        if(manufacturerName)manufacturerListName.push(manufacturerName)
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
/**
 * 加工商搜索框组件传回来的值
 * @param {*} val 
 */
 const fruitFilterableChange = (val) =>{
    console.log(val,'输入框的值')
    defaultValue.value.manufacturerName = val
}

// let searchFlag = true //标记是否从下拉框选择值
// let searchValue = '' //存放搜索框输入值
// /**
//  * 下拉选择时触发
//  * @param {*} e 
//  */
// const searchChange = (e) => {
//     searchFlag = true
//     searchValue = ''
// }
// /**
//  * 自定义搜索方法
//  * @param {*} e 
//  */
// const searchFilter = (e) => {
//     if(!e&&defaultValue.value.manufacturerName)e=defaultValue.value.manufacturerName
//     if (e) {
//         searchValue = e
//         processorArr.value = defaultValuelist.filter(item => {
//             if (item.manufacturerName.includes(e)) return item
//         })
//         searchFlag = false
//     } else {
//         processorArr.value = defaultValuelist
//     }
//     //当用户输入值进行搜索，如果未从搜索项选择值，就将输入的值进行赋值
//     if (!searchFlag) defaultValue.value.manufacturerName = searchValue
// }



//关联加工商
const handleEditUser = (index, row) => {
    //dialogDataFlag
    dialogDataFlag.value = true
    dialogData.value = row
};
const getDialogBtn = (val) =>{
    dialogDataFlag.value = false
    if(val)getTableList()
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
}
</style>
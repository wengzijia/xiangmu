<template>
    <div class="commonTableListBox">
        <CommonBreadCrumb :first="'加工商管理'" :marginBottom="'16px'" />
        <div class="select_box">
            <div class="select_top">
                <div class="select_group">
                    <el-form @submit.prevent :inline="true" :model="defaultValue" class="demo-form-inline" style="width:100%;">
                        <filterable  @dropFilterableChange="fruitFilterableChange" :manufacturerName="defaultValue.manufacturerName" :defaultValuelist="processorArr" />
                        <!-- <el-form-item label="手机号">
                            <el-input v-model="defaultValue.userMobile" maxlength="11" placeholder="请输入" />
                        </el-form-item> -->
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

                        <el-form-item label="加工商类型">
                            <el-select v-model="selectData.manufacturerType" placeholder="请选择加工商类型" @change="switchingData">
                                <el-option v-for="item in manufacturerTypeArr" :key="item" :label="item.label"
                                    :value="item.type" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="所属产业园">
                            <el-select v-model="selectData.parkId" placeholder="请选择所属产业园" @change="switchingData">
                                <el-option v-for="item in parkIdArr" :key="item" :label="item.parkName" :value="item.id" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="状态">
                            <el-select v-model="selectData.enableStatus" placeholder="请选择状态" @change="switchingData">
                                <el-option v-for="item in statusArr" :key="item" :label="item.label" :value="item.type" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="content_box">
            <div @click="openPage()" class="add">
                <p @click="handleAddNewUser" class="reset_button" style="background-color:transparent !important;">
                    <span>+</span>
                    添加加工商
                </p>
            </div>
            <div class="table_box" id="getTableHeight">
                <!--:default-sort="{ prop: 'sortable', order: 'descending' }"  @sort-change="sortChange" sortable="custom" sortable="custom"  -->
                <el-table :data="tableData" @row-click="row => openPage(row.manufacturerId,0)" @sort-change="sortChange"
                    :header-cell-style="{ color: '#333' }"  border
                    :height="tableHeight">
                    <el-table-column prop="manufacturerName"  label="加工商名称" align="center" sortable="custom" />
                    <el-table-column prop="manufacturerAttributes_val" label="工艺" min-width="180" align="center" />
                    <el-table-column prop="corpName" label="法人" align="center" />
                    <el-table-column prop="telephone" label="电话" align="center" />
                    <el-table-column prop="manufacturerTypeNames_val" label="加工商类型" align="center" />
                    <el-table-column prop="parkNames_val" label="所属产业园" align="center" />
                    <el-table-column prop="enableStatus_val" label="状态" align="center" />
                    <el-table-column prop="createUserName" label="创建人" align="center" />
                    <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" align="center" >
                        <template #default="scope">
                            <div style="color: #333;">{{ parseTime(scope.row.createTime, '{y}-{m}-{d}  {h}:{i}') || '-' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160" align="center">
                        <template #default="scope">
                            <el-button class="edit_buttom" size="small"
                                @click="openPage(scope.row.manufacturerId,1)">编辑</el-button>
                            <!-- <el-button :class="{edit_buttom:scope.row.enableStatus==2}" size="small" 
                                    @click="handleEditUser(scope.$index, scope.row)">{{scope.row.enableStatus==1?'禁用':'启用' }}</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="footer">
            <pageIndex @dropDownValueChange="fruitValueChange" v-if="tableData && tableData.length > 0"
                :pageNumber="pageData.pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
        </div>
    </div>
</template>
  
<script name="ProcessorList" setup>
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import filterable from "@/layout/commonLayout/filterable.vue";
import { onMounted, ref } from 'vue'
import { getManufacturerPage, getAllManufacturerList, getIndustrialParkList, getAttriList } from "@/api/modules/processor";
import { ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import { openNewPage } from "@/utils/commonApi"

import { parseTime } from "@/utils/util";
const pageData = ref({
    pageNumber: 1,
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 0
})
const selectData = ref({
    attributeIds: [],//工艺id
    enableStatus: "",//状态：1禁用，2启用,空是查询所有
    manufacturerType: "",//加工商类型
    parkId: '',//所属产业园
    userMobile: null,
    manufacturerName: null,//加工商名称
    pageNumber: pageData.value.pageNumber,
    pageSize: pageData.value.pageSize,
});

const defaultValue = ref({
    userMobile: null,
    manufacturerName: null,//加工商名称
    newJgs: null
})

var tableHeight = ref()
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
    getProcessorNameList()
    getTableList()
    if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
    window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
        return (() => {
            if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
        })();
    };
});

/**
 * 自定义排序功能
 */
const sortChange = (row, column) => {
    const { order, prop } = row || {}
    console.log(order)
    console.log(prop)
    if (order) {
        const params = {
            sortAsc: order ? order == 'ascending' : '',
            sortColumn: order ? prop.replace(/([A-Z])/g, "_$1").toLowerCase() : '' //驼峰转换下划线
        }

        Object.assign(selectData.value, params)
    } else {
        delete selectData.value.sortAsc
        delete selectData.value.sortColumn
    }
    getTableList()

}
//获取表格数据
const tableData = ref([]);
/**
 * 获取加工商列表数据
 */
function getTableList() {
    selectData.value.pageNumber = pageData.value.pageNumber,
        selectData.value.pageSize = pageData.value.pageSize,
        getManufacturerPage(selectData.value).then(res => {
            console.log(res)
            if (res.code != '000000') return ElMessage({
                showClose: true,
                message: res.message || '服务错误',
                type: 'error',
            })
            const { items, totalCount } = res.data || {}
            items.forEach(item => {
                const { manufacturerAttributes, manufacturerTypeNames, parkNames, enableStatus } = item
                const manufacturerAttributesName = []
                if (manufacturerAttributes && manufacturerAttributes.length > 0) {
                    manufacturerAttributes.forEach(val => {
                        manufacturerAttributesName.push(val.attributeName)
                    })
                }
                item.manufacturerAttributes_val = manufacturerAttributesName.join(' ')
                item.manufacturerTypeNames_val = manufacturerTypeNames ? manufacturerTypeNames.join('/') : ''
                item.parkNames_val = parkNames ? parkNames.join('/') : ''
                item.enableStatus_val = enableStatus == 1 ? '启用' : '禁用'

            })
            tableData.value = items
            pageData.value.totalCount = totalCount || 0
        })
}
//选择工艺选项数组
const attributeIdsArr = ref([]);
//选择状态选项数组
const statusArr = ref([
    { label: "全部", type: "" },
    { label: "启用中", type: 1 },
    { label: "禁用中", type: 2 }
]);
//选择类型选项数组
const manufacturerTypeArr = ref([
    { label: "全部", type: "" },
    { label: "产业园", type: 1 },
    { label: "单工序外发", type: 3 },
    { label: "未入驻", type: 2 },
    { label: "整单外发", type: 4 }
]);

const parkIdArr = ref([{ id: '', parkName: '全部' }])

const processorArr = ref([])

/**
 * 获取 加工商名称/产业园名称/工艺名称 数据
 */
function getProcessorNameList() {
    getAllManufacturerList().then(res => {
        if (res.code != '000000') return
        processorArr.value = res.data
    })
    getIndustrialParkList().then(res => {
        console.log(res)
        if (res.code != '000000') return
        res.data.unshift({ id: '', parkName: '全部' })
        parkIdArr.value = res.data
    })
    getAttriList().then(res => {
        console.log(res)
        if (res.code != '000000') return
        attributeIdsArr.value = res.data || []

    })
}


/**
 * 加工商搜索框组件传回来的值
 * @param {*} val 
 */

const fruitFilterableChange = (val) =>{
    console.log(val,'输入框的值')
    defaultValue.value.manufacturerName = val
}



// 手机号码自定义验证规则
const validMobile = (rule, value, callback) => {
    if (!value) {
        callback();
    } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
    } else {
        callback();
    }
};


//下拉框切换选项触发
const switchingData = (val) => {
    pageData.value.pageNumber = 1
    getTableList()
}
//查询按钮
const handleSubmitSelecter = () => {
    pageData.value.pageNumber = 1
    selectData.value.userMobile = defaultValue.value.userMobile
    selectData.value.manufacturerName = defaultValue.value.manufacturerName
    getTableList()
}

// 点击重置
const handleResetSelecter = () => {
    const obj = {
        attributeIds: [],
        enableStatus: "",
        manufacturerType: "",
        parkId: '',
        userMobile: null,
        manufacturerName: null,
    }
    pageData.value.pageNumber = 1
    Object.assign(selectData.value, obj)
    defaultValue.value = {
        userMobile: null,
        manufacturerName: null,//加工商名称
    }
    console.log('点击重置', selectData.value)
    handleSubmitSelecter()
};

// 点击新增加工商按钮事件--或者编辑按钮
const openPage = (manufacturerId,type) => {
    const url = manufacturerId ? `/processorModule/addProcessor?manufacturerId=${manufacturerId}&type=${type}` : '/processorModule/addProcessor'
    openNewPage(url)
}
//禁用或启用按钮事件
const handleEditUser = (index, row) => {
    console.log("handleEditUser", index, row);
    // router.push({ name: "AddProcessor", query: { manufacturerId: row.manufacturerId } });
};

//分页模块改变的值
const fruitValueChange = (val) => {
    console.log('改变分页模块的值：', val)
    pageData.value = Object.assign(pageData.value, val)
    getTableList()
}



</script>
  
<style lang="scss" scoped>
@import "@/assets/css/listTable.scss";
</style>
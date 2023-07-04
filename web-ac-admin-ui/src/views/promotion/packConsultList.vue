<!-- 包装方案咨询列表 -->
<template>
  <div>
    <listLayout>
      <template #header>
        <div class="header-form">
          <el-form :inline="true" :model="listParam" class="filterForm" ref="workOrderFormRef" label-width="96px"  style="flex:1;">
            <el-form-item label="提交时间" prop="poNo">
                <el-date-picker
                  v-model="listParam.createTime"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="/"
                  start-placeholder="开始日期"
                  end-placeholder="最后日期"
                />
            </el-form-item>
            <el-form-item label="用户端" prop="client">
                <el-select v-model="listParam.client" >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="PC端" value="PC"></el-option>
                  <el-option label="WAP端" value="WAP"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="专题" prop="webCateId">
              <el-select v-model="listParam.webCateId" >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="化妆品专题" value="1"></el-option>
                  <el-option label="3C数码专题" value="75"></el-option>
                  <el-option label="端午礼品专题" value="437"></el-option>
                </el-select>
            </el-form-item>
          </el-form>
          <div class="btnBox" style="width: 140px;display: flex;">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </div>
        </div>
      </template>
      <template #table-header>
        <div class="title">包装方案咨询列表</div>
      </template>
      <template #table-content='scope' >
        <el-table :data="tableData" style="width: 100%" :height='scope.tableHeight'>
          <el-table-column prop="client" label="渠道" width="100" >
            <template #default="{row}">
              <span>{{row.client}}端</span>
            </template>
          </el-table-column>
          <el-table-column prop="cateName" label="专题" width="180" />
          <el-table-column prop="mobile" label="联系电话" />
          <el-table-column prop="customerName" label="联系姓名" />
          <el-table-column prop="createTime" label="提交时间" />
        </el-table>
      </template>
      <template #pagination>
        <el-pagination v-model:current-page="listParam.pageNumber" v-model:page-size="listParam.pageSize" background
            layout="total, sizes, prev, pager, next, jumper" :total="total" @current-change="search" @size-change='search'/>
      </template>
    </listLayout>
  </div>
</template>

<script setup>
import listLayout from '@/components/ParentView/listLayout.vue'
import { pageListCustomer } from "@/api/consumer/promotion";

let listParam = ref({
  "client": "",
  "createTimeEnd": "",
  "createTimeStart": "",
  createTime:[],
  "pageNumber": 1,
  "pageSize": 10,
  "webCateId": ''
})

let total = ref(0)
let tableData = ref([])
function search() {
  if(listParam.value.createTime&&listParam.value.createTime.length>0){
    listParam.value.createTimeStart = listParam.value.createTime[0]+' 00:00:00'
    listParam.value.createTimeEnd = listParam.value.createTime[1]+' 23:59:59'
  }else{
    listParam.value.createTimeStart = ''
    listParam.value.createTimeEnd = ''
  }
  pageListCustomer(listParam.value).then(res=>{
    tableData.value = res.data
    total.value = res.totalCount
})
}
search()
function reset() {
  listParam.value = {
    "client": "",
    "createTimeEnd": "",
    "createTimeStart": "",
    createTime:[],
    "pageNumber": 1,
    "pageSize": 10,
    "webCateId": ''
  }
}
</script>
<style lang="scss">
.header-form{
  display: flex;
}
</style>
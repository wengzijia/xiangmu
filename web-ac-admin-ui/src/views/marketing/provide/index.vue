<template>
  <List :listArr="listArr" :tableData="tableData.records" :total="tableData.total" :searchArr="searchArr" @refer="search">
    <template #btns-item>
      <el-button @click="download">导出</el-button>
    </template>
    <template #footer-left>
      <div>
        总优惠券数量：{{ tableData.total }} 张
      </div>
    </template>
  </List>
</template>


<script setup>
import { ref } from 'vue'
import List from '../components/List'
import { listArr, searchArr } from './configure.js'
import { drawPage, miniCouponType, exportDrawPage } from '@/api/marketing/marketing.js'
import { downloadExcel } from '@/utils/index'

miniCouponType().then(res => {
  searchArr[1].arr = [{label: '全部', value: ''}]
  searchArr[1].arr = searchArr[1].arr.concat(res.data.map(el => {
    return {
      value: el.couponType,
      label: el.couponName
    }
  }))
})

let searchData = {}
const search = (data) => {
  searchData = data
  getList(data)
}

const tableData = ref([])
const getList = (data) => {
  drawPage(data).then(res => {
    tableData.value = res.data
  })
}

const download = () => {
  downloadExcel(exportDrawPage,searchData)
}

</script>
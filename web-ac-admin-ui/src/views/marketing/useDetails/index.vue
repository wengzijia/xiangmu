<template>
  <div class="app-container app-container_bg">
    <List ref="apListRef" :listArr="listArr" :searchArr="searchArr" :tableData="tableData.records" :searchData="searchData" :total="tableData.total" @refer="search">
      <template #col-useTime="{row}">
        {{ formatDate(row.useTime * 1000) }}        
      </template>
    </List>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import List from '../components/List'
import { useDetail, miniCouponType } from '@/api/marketing/marketing.js'
import { useRoute } from 'vue-router'
import { formatDate } from '@/utils/index.js'
import { listArr, searchArr } from './configure.js'

const route = useRoute()
const searchData = ref({
  couponType: route.query?.couponType || ''
})

const search = (el) => {
  getList(el)
}

miniCouponType().then(res => {
  searchArr[1].arr = [{label: '全部', value: ''}]
  searchArr[1].arr = searchArr[1].arr.concat(res.data.map(el => {
    return {
      value: el.couponType,
      label: el.couponName
    }
  }))
})

const apListRef = ref()

const tableData = ref([])
const getList = (data) => {
  useDetail(data).then(res => {
    tableData.value = res.data
  })
}
</script>
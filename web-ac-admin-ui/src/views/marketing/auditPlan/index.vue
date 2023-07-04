<template>
    <List :searchArr="searchArr" :listArr="listArr" :tableData="listData.records" @refer="search" :total="listData.total" >
      <template #col-name="{ row }">
        <p>{{row.name}}--</p>
      </template>
      <template #col-discountType="{ row }">
        <span v-if="row.discountType == 1">定额现金券</span>
        <span v-else-if="row.discountType == 2">限额现金券</span>
        <span v-else-if="row.discountType == 3">限比例现金券</span>
        <span v-else-if="row.discountType == 4">满减券</span>
        <span v-else-if="row.discountType == 5">折扣券</span>
      </template>
      <template #col-useEffectivityType="{ row }">
        <span v-if="row.useEffectivityType == 1">{{ formatDate(row.startEffectivityTime*1000) }} 至 {{ formatDate(row.endEffectivityTime*1000) }}</span>
        <span v-else-if="row.useEffectivityType == 2">领取后{{ row.useEffectivityDay }}天有效</span>
      </template>
      <template #col-auditStatus="{ row }">
        <el-tag v-if="row.auditStatus == 0" type="warning">待审核</el-tag>
        <el-tag v-else-if="row.auditStatus == 1">审核通过</el-tag>
        <el-tag v-else-if="row.auditStatus == 2" type="danger">审核失败</el-tag>
      </template>
      <template #col-yue="{ row }">
        <div style="display: flex;flex-wrap:wrap">
          <el-button text @click="jump('view', row)" type='primary' style="margin:0;padding: 8px;">查看</el-button>
          <el-button text @click="jump('audit', row)" type='primary' v-if="row.auditStatus == 0" style="margin:0;padding: 8px;">审核</el-button>
          <el-button text @click="jumpDetails(row)" type='primary' style="margin:0;padding: 8px;" v-if="row.auditStatus == 1">明细</el-button>
        </div>
      </template>
    </List>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import List from '../components/List'
import { searchArr, listArr } from './configure.js'
import { couponPlanPage, miniCouponType } from '@/api/marketing/marketing.js'
import { formatDate } from '@/utils/index.js'

const listData = ref({})

const router = useRouter()
const route = useRoute()

let miniCoupon = []
let orderCodeType = []

miniCouponType().then(res => {
  searchArr[2].arr = [{label: '全部', value: ''}]
  searchArr[3].arr = [{label: '全部', value: ''}]
  searchArr[2].arr = searchArr[2].arr.concat(res.data.map(el => {
    orderCodeType = orderCodeType.concat(roverRepeat(el.orderCodeTypeList))
    return {
      value: el.couponType,
      label: el.couponName
    }
  }))
  miniCoupon = res.data
  searchArr[3].arr = searchArr[3].arr.concat(orderCodeType)
})
// 去重
const roverRepeat = (arr) => {
  for (let i = 0; i < arr.length;) {
    const el = arr[i];
    if (orderCodeType.findIndex(e => e.code == el.code) != -1) {
      arr.splice(i,1)
    } else {
      i += 1
      el.value = el.code
      el.label = el.desc
    }
  }
  return arr
}
const search = (el) => {
  getList(el)
}

const jump = (from, data) => {
  let url = `/marketing/createCoupon?from=${from}`
  if (from != 'add') {
    url += `&id=${data.id}`
  }
  router.push(url)
}

const jumpDetails = (data) => {
  let url = `/acwebadmin/marketing/planDetails?planName=${data.planName}&couponType=${data.couponType}&planSerial=${data.planSerial}`
  window.open(url)
}

const getList = (obj= {
    couponType: "",
    issueStatus: "",
    orderCodeType: "",
    planName: "",
    planSerial: "",
    current: 1,
    size: 10
  }) => {
  listData.value.records = []
  couponPlanPage(obj).then(res => {
    listData.value = res.data
    listData.value.records.map(el => {
      let obj = miniCoupon.find(e => e.couponType == el.couponType)
      el.systemType = obj.systemTypeList?.map(e => {return e.desc}).join(',')
      return el
    })
  })
}

</script>
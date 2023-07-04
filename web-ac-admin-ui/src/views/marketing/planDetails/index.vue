<template>
  <List ref="apListRef" :listArr="listArr" :tableData="tableData.records" :total="tableData.total" :searchArr="searchArr" :searchData="searchData" @refer="search">
    <template #receiverPersonId="{ row }">
      <el-select v-model="row.receiverPersonId" filterable placeholder="请输入领取人手机号" remote :remote-method="changePhone" :teleported='false'
        v-el-select-loadmore="loadmore">
        <el-option
          v-for="(it,index) in mobile"
          :key="index"
          :label="it.label"
          :value="it.value"
        />
      </el-select>
    </template>
    <template #usePersonId="{ row }">
      <el-select v-model="row.usePersonId" filterable placeholder="请输入使用用户手机号" remote :remote-method="changePhone" :teleported='false'
        v-el-select-loadmore="loadmore">
        <el-option
          v-for="(it,index) in mobile"
          :key="index"
          :label="it.label"
          :value="it.value"
        />
      </el-select>
    </template>
    <template #btns-item>
      <el-button @click="detailsExport">导出</el-button>
    </template>
    <template #footer-left>
      <div>
        总优惠金额：{{ tableData.totalMoney }} 元
      </div>
    </template>
  </List>
</template>


<script setup>
import { ref } from 'vue'
import List from '../components/List'
import { listArr, searchArr } from './configure.js'
import { couponPlanDetail, miniCouponType, couponPlanDetailExport, listAllPage } from '@/api/marketing/marketing.js'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import { downloadExcel } from '@/utils/index.js'

const route = useRoute()

const searchData = ref({
  planName: route.query?.planName || '',
  couponType: route.query?.couponType || '',
  planSerial: route.query?.planSerial || ''
})

const search = (el) => {
  getList(el)
}

miniCouponType().then(res => {
  searchArr[2].arr = [{label: '全部', value: ''}]
  searchArr[2].arr = searchArr[2].arr.concat(res.data.map(el => {
    return {
      value: el.couponType,
      label: el.couponName
    }
  }))
})

const apListRef = ref()
const detailsExport = () => {
  var downloadLoadingInstance = ElLoading.service({ text: "文件下载中，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  downloadExcel(couponPlanDetailExport, apListRef.value.formData).finally(() => {
    downloadLoadingInstance.close();
  })
}

const tableData = ref([])
const getList = (data) => {
  couponPlanDetail(data).then(res => {
    tableData.value = res.data
  })
}

const mobile = ref([])
const getMobileData = {
    pageNum: 1,
    pagesize: 10,
    phoneNumber: ''
  }
let time = null
const getMobile = () => {
  if (time) {
    return
  }
  time = setTimeout(() => {
    listAllPage(getMobileData).then(res => {
      res.rows = res.rows.map(e => {
        let obj = { value: e.userId }
        if (e.isMember == 1) {
          obj.label = (e.adminMobile || e.phoneNumber || e.qqMobile)+ ' (后台)'
        } else if (e.phoneNumber) {
          obj.label = e.phoneNumber + '(官网)'
        } else if (e.qqMobile) {
          obj.label = e.qqMobile + '(微信)'
        }
        if (!obj.label) {
          return null
        }
        return obj
      }).filter(e => e)
      if (getMobileData.pageNum == 1) {
        mobile.value = res.rows
      } else {
        mobile.value = mobile.value.concat(res.rows)
      }
    }).finally(() => {
      time = null
    })
  }, 100)
  
}
getMobile()
const loadmore = () => {
  getMobileData.pageNum += 1
  getMobile()
}

const changePhone = (value) => {
  getMobileData.pageNum = 1
  if (value) {
    getMobileData.phoneNumber = value
  }
  getMobile()
}

</script>
<style scoped>
:deep(.el-card) {
  overflow: unset;
}
</style>
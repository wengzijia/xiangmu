<template>
  <List :searchArr="searchArr" :listArr="listArr" :tableData="listData.records" @refer="search" :total="listData.total">
    <template #tableTitle>
      <div style="font-size: 16px;font-weight: 400;margin-bottom: 16px;">
        优惠券计划管理
      </div>
    </template>
    <template #btns-item>
      <el-button @click="jump('add')">创建优惠券计划</el-button>
    </template>
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
    <template #col-status="{ row }">
      <el-tag v-if="row.status == 1">启用中</el-tag>
      <el-tag v-else-if="row.auditStatus == 2" type="danger">已终止</el-tag>
      <el-tag v-else-if="row.status == 0" type="warning">待审核</el-tag>
      <el-tag v-else-if="row.status == 3" type="danger">已完结</el-tag>
      <el-tag v-else type="danger">已终止</el-tag>
    </template>
    <template #col-yue="{ row }">
      <div style="display: flex;flex-wrap:wrap">
        <el-button text @click="jump('view', row)" type='primary' style="margin:0;padding: 8px;">查看</el-button>
        <el-button text @click="jump('edit', row)" type='primary' style="margin:0;padding: 8px;" v-if="row.status == 0">编辑</el-button>
        <el-button text @click="jumpDetails(row)" type='primary' style="margin:0;padding: 8px;" v-if="row.status != 0">明细</el-button>
        <el-button text @click="revampStatus(row.id, 1)" type='primary' style="margin:0;padding: 8px;" v-if="row.status == 2">启用</el-button>
        <el-button text @click="revampStatus(row.id, 3)" type='primary' style="margin:0;padding: 8px;" v-if="row.status == 0">删除</el-button>
        <el-button text @click="revampStatus(row.id, 2)" type='primary' style="margin:0;padding: 8px;" v-if="row.status == 1">终止</el-button>
        <el-button text @click="jump('copy', row)" type='primary' style="margin:0;padding: 8px;">复制</el-button>
      </div>
    </template>
    <template #footer-left>
      <div>
        总预计营销费用：{{ listData.totalMoney }} 元
      </div>
    </template>
  </List>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import List from '../components/List'
import { searchArr, listArr } from './configure.js'
import { couponPlanPage, miniCouponType, couponPlanBreakOrDel } from '@/api/marketing/marketing.js'
import { formatDate } from '@/utils/index.js'
import { ElMessage, ElMessageBox } from 'element-plus';

const listData = ref({})

const router = useRouter()

let miniCoupon = []
let orderCodeType = []
// 获取优惠券类型
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
// 查询
const search = (el) => {
  getList(el)
}
// 跳转计划详情
const jump = (from, data) => {
  let url = `/marketing/createCoupon?from=${from}`
  if (from != 'add') {
    url += `&id=${data.id}`
  }
  router.push(url)
}
// 跳转明细
const jumpDetails = (data) => {
  let url = `/acwebadmin/marketing/planDetails?planName=${data.planName}&couponType=${data.couponType}&planSerial=${data.planSerial}`
  window.open(url)
}
// 获取列表数据
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
// 2 终止 或 3 删除
const revampStatus = (id, status) => {
  ElMessageBox.confirm(
    `是否继续执行${status == 1 ? '启动' : status == 2 ? '终止' : '删除'}操作`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      couponPlanBreakOrDel({id,auditStatus: status}).then(res => {
        if (res.code == 200) {
          let text = status == 1 ? '计划已启动' : status == 2 ? '计划已终止' : '删除成功'
          ElMessage.success(text)
          getList()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消操作',
      })
    })
  
}
</script>
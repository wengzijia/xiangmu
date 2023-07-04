<template>
  <div class="app-container app-container_bg">
    <div style="background-color: #fff;">
      <div style="padding: 16px;border-bottom: 1px solid #C1CBDB;font-size: 16px;">
        优惠券额度控制
      </div>
      <div style="padding: 20px">
        <div id="header">
          <div style="margin-bottom: 10px;">
            <span style="color: red;margin-right: 3px;">*</span>
            <span class="title" style="font-weight: 400;">优惠券总营销费用</span>
            <el-input v-model="totalCost.quotaMoney" :disabled="!totalCost.edit" @input="inputVal(totalCost)" type="number" style="width: 230px;margin: 0 10px;">
              <template #append>
                元
              </template>
            </el-input>
            <el-button v-if="!totalCost.edit" @click="totalCost.edit = !totalCost.edit" text type='primary'>配置</el-button>
            <el-button v-if="totalCost.edit" @click="config(totalCost)" text type='primary'>确认设置</el-button>
            <el-button v-if="totalCost.edit" @click="getList" text type='primary'>取消设置</el-button>
          </div>
          <div class="hint">
            说明：已领取优惠券金额费用超过设置阀值，所有优惠券则不可领取，已领取的可使用。已领取优惠券总优惠金额费用指优惠券开始领取之日截止到当前时间累计已领取金额之和
          </div>
          <div class="title">
            优惠券种类限制额度
          </div>
          <div class="hint">
            说明：该类型优惠券已领取优惠金额超过设置阀值，该类型优惠券则不可领取，已领取的可使用。该类型优惠券已领取优惠金额指该类型优惠券开始领取之日截止到当前时间累计已领取金额之和
          </div>
        </div>
        <Table :listArr="listArr" :tableData="tableData" :tableHeight="visualHeight" :pagination="false">
          <template #col-quotaStatus="{row}">
            <div>
              <el-radio-group v-model="row.quotaStatus" style="display: flex;" :disabled="!row.edit">
                <el-radio :label="1">无限制</el-radio>
                <el-radio :label="2">限制</el-radio>
                <el-input v-if="row.quotaStatus == 2" v-model="row.quotaMoney" @input="inputVal(row)" type="number" style="width:230px" :disabled="!row.edit">
                  <template #append>
                    元
                  </template>
                </el-input>
                <el-input v-else value="-" style="width:230px" :disabled="!row.edit">
                  <template #append>
                    元
                  </template>
                </el-input>
              </el-radio-group>
            </div>
          </template>
          <template #col-yue="{row}">
            <el-button v-if="!row.edit" @click="row.edit = !row.edit" text type='primary'>配置</el-button>
            <el-button v-if="row.edit" @click="config(row)" text type='primary'>确认设置</el-button>
            <el-button v-if="row.edit" @click="getList" text type='primary'>取消设置</el-button>
          </template>
        </Table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import Table from '../components/Table'
import { listArr } from './configure.js'
import { getCouponQuotaConfig, miniCouponType, updateCouponQuota } from '@/api/marketing/marketing.js'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const totalCost = ref(0)

const getList = () => {
  const couponType = miniCouponType()
  const couponQuotaConfig = getCouponQuotaConfig()
  Promise.all([couponQuotaConfig, couponType]).then(res => {
    let config = res[0].data
    let type = res[1].data

    tableData.value = config.couponQuotaConfigList.map(el => {
      let obj = type.find(e => e.couponType == el.couponType)
      el.typeName = obj.couponName
      el.couponRule = obj.couponRule
      el.oldQuotaMoney = el.quotaMoney
      el.edit = false
      return el
    })

    totalCost.value = config.totalQuota
    totalCost.value.oldQuotaMoney = config.totalQuota.quotaMoney
    totalCost.value.edit = false
  })
}

getList()

const config = (item, bool) => {
  let obj = {
    couponType: item.couponType,
    id: item.id,
    quotaMoney: item.quotaMoney,
    quotaStatus: item.quotaStatus,
    quotaType: item.quotaType
  }
  updateCouponQuota(obj).then(res => {
    getList()
    item.edit = false
    ElMessage.success('修改成功')
  })
}
// 输入验证
const inputVal = (item) => {
  let num = item.quotaMoney + ''
  if (num.length > 8) {
    item.quotaMoney = Number(num.slice(0,8))
    ElMessage.warning('最多输入八位')
  }
  let reg = /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/
  if (!reg.test(item.quotaMoney)) {
    ElMessage.error('请检查输入的内容格式是否正确')
  }
}

const visualHeight = ref(0)
const onSize = () => {
  let clientHeight = document.body.clientHeight
  let header = document.getElementById('header')?.scrollHeight || 0
  // 40 整体的内边距;40标题内边距;20是表格头占据的;50是最顶部的标题栏;53标题；
  visualHeight.value = clientHeight - (header + 40 + 40 + 53 + 50 + 20)
}

onBeforeMount(() => {
  window.addEventListener('resize', onSize)
  nextTick(() => {
    onSize()
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', onSize)
})
</script>

<style scoped>
.title {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}
.hint {
  color: #909399;
  font-size: 14px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E4E7ED;
  margin-bottom: 20px;
}

</style>
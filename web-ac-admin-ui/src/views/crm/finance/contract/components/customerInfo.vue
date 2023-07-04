<template>
    <div v-show="customer?.baseInfo">
      <div>客户信息</div>
      <el-form-item label="客户名称:">
        <div>{{ customer?.baseInfo?.customerName }}</div>
      </el-form-item>
      <el-form-item label="客户评级:">
        <div>{{ customer?.statisticsInfo?.customerGrading }}</div>
      </el-form-item>
      <el-form-item label="更多结算方式:">
        <span v-if="!customer?.baseInfo?.moreSettlementMethodId">立结</span>
        <settlementMethod  v-else :methodId="customer?.baseInfo?.moreSettlementMethodId" :methodList="methodList" />
      </el-form-item>
      <el-form-item label="授信额度:">
        <div>{{ showMoney(customer?.baseInfo?.customerCreditQuota) }}</div>
      </el-form-item>
    </div>
</template>

<script setup>
import settlementMethod from '@/components/settlementMethod/index.vue'

const props = defineProps({
  customer: {
    type: Object,
    default: {}
  },
  methodList:{
    type: Array,
    default:[]
  }
})
const { customer,methodList } = toRefs(props)
</script>

<style lang="sass" scoped>

</style>
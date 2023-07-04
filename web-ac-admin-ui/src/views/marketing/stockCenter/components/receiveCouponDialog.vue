<template>
  <el-dialog v-model="props.visible" title="领取优惠券" width="50%" :before-close="handleClose">
    <div>
      <p>当前领取券 {{ counponData.couponPlanAvailable.couponName }}</p>
      <p>使用规则 {{ counponData.couponPlanAvailable.couponRule }}</p>
      <p>领取有效期 {{ formatDate(counponData.couponPlanAvailable.startGetTime*1000) }} - {{ formatDate(counponData.couponPlanAvailable.endGetTime*1000) }}</p>
      <p v-if="counponData.couponPlanAvailable.useEffectivityDay">使用有效期 领取后{{ counponData.couponPlanAvailable.useEffectivityDay }} 天有效。截止到最后一天的23:59:59</p>
      <p v-else>使用有效期 {{ formatDate(counponData.couponPlanAvailable.startEffectivityTime*1000) }} - {{ formatDate(counponData.couponPlanAvailable.endEffectivityTime*1000) }}</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="receiveCounpon">
          确认领取
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { formatDate } from '@/utils/index.js'
import { gainCouponPlanDraw } from '@/api/marketing/marketing.js'
import { ElMessage } from 'element-plus';

  const props = defineProps({
    counponData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: String,
      default: ''
    }
  })

  const emits = defineEmits()

  const handleClose = () => {
    emits('close')
  }

  // 领取优惠券
  const receiveCounpon = () => {
    gainCouponPlanDraw({couponType: props.data}).then(res => {
      if (res.code == 200) {
        ElMessage.success('领取成功')
        handleClose()
      }
    })
  }
</script>
<template>
  <el-dialog v-model="props.visible" title="赠送优惠券" width="50%" :before-close="handleClose">
    <div>
      <el-form>
        <el-form-item label="客户渠道">
          <el-select v-model="formData.orderFrom">
            <el-option v-for="(item,index) in systemOption" :key="index" :value="item.code" :label="item.desc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指定会员">
          <el-select v-model="formData.possessorId" filterable placeholder="请输入客户手机号" remote :remote-method="changeValue" :teleported='false'
            v-el-select-loadmore="loadmore">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.phoneNumber"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div>
      说明：仅限指定你名下客户，赠送优惠券
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="givingCounpon">
          确认赠送
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { miniCouponType, getMobileNumberPage, givePresentedCouponPlanDraw, } from '@/api/marketing/marketing.js'
import { getInfo } from '@/api/login'
import { onMounted } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  couponListItem: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emits = defineEmits()

const handleClose = () => {
  emits('close')
}

const formData = ref({})
let obj = {
  orderFrom: '',
  phoneNumber: '',
  pageNum: 1,
  pagesize: 10,
  nid: ''
}
let couponTypeList = []
// 赠送优惠券
onMounted(() => {
  formData.value.id = props.couponListItem.id
  formData.value.possessorId = ''
  getInfo().then(res => {
    obj.nid = res.user.userId
    if (couponTypeList.length == 0) {
      miniCouponType().then(res => {
        couponTypeList = res.data
        findSystem(props.couponListItem.couponType)
      })
    } else {
      findSystem(props.couponListItem.couponType)
    }
  })
})

// 查找优惠券平台
const systemOption = ref([])
const findSystem = (type) => {
  systemOption.value = couponTypeList.find(e => e.couponType == type).systemTypeList.map(e => {
    let obj = {...e}
    if (e.sysType == 'aocai_gw' || e.sysType == 'aocai_gw_offline' ) {
      obj.code = 1
    } else if (e.sysType == 'pinyiban_wx' || e.sysType == 'pinyiban_wx_offline') {
      obj.code = 2
    }
    return obj
  })
  formData.value.orderFrom = systemOption.value[0].code
  obj.orderFrom = formData.value.orderFrom
  getMobile(obj, true)
}

const changeValue = (val) => {
  obj.phoneNumber = val
  getMobile(obj)
}
// 获取客户手机号
const options = ref([])
const getMobile = (obj, type=true) => {
  if (formData.value.orderFrom == null) {
    return
  }
  if (props.couponListItem.couponType == 'big_customer_sample_coupon') {
    delete obj.nid
  }
  obj.orderFrom = formData.value.orderFrom
  if (type) { // 非下拉动作，清空请求条件
    options.value = []
    obj.pageNum = 1
  }
  getMobileNumberPage(obj).then(res => {
    if (res.code == 200 && res.rows.length) {
      options.value = options.value.concat(res.rows)
    }
  })
}
// 下拉-下一页
const loadmore = () => {
  if (obj.orderFrom) {
    obj.pageNum += 1
    getMobile(obj, false)
  }
}
// 赠送优惠券
const givingCounpon = () => {
  if (!formData.value.possessorId) {
    ElMessage.error('请指定会员')
    return
  }
  givePresentedCouponPlanDraw({possessorId:formData.value.possessorId, couponPlanDrawId: formData.value.id}).then(res => {
    if (res.code == 200) {
      formData.value.possessorId = ''
      handleClose()
    }
  })
}
</script>

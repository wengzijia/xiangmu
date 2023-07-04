<template>
  <div class="app-container app-container_bg">
    <div style="background-color: #fff;">
      <div style="font-size: 16px;font-weight: 400;border-bottom: 1px solid #C1CBDB;margin-bottom: 24px;padding: 16px;">
        创建优惠券计划
      </div>
      <div style="padding: 24px;">
        <el-form ref="ruleFormRef" :model="formData" :disabled="allDisabled" :rules="rules" status-icon label-width="120px">
          <el-form-item label="优惠券计划名称" prop="planName">
            <el-input v-model="formData.planName" @input="checkName" style="width: 300px;" show-word-limit maxlength="24"></el-input>
          </el-form-item>
          <el-form-item label="优惠券类型" prop="couponType">
            <el-select v-model="formData.couponType" >
              <el-option v-for="(item,index) in couponTypeArr" @click="clickCouponType(item)" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用规则说明">
            <template #label>
              <label>使用规则说明</label>
            </template>
            <span>{{ formData.couponRule }}</span>
          </el-form-item>
          <el-form-item label="使用订单类型">
            <template #label>
              <label>使用订单类型</label>
            </template>
            <span>{{ formData.orderCodeType}}</span>
          </el-form-item>
          <el-form-item label="优惠券面值规则" required>
            <template #label>
              <label>优惠券面值规则</label>
            </template>
            <el-radio-group v-model="formData.radioRule" @change="changeRadioRule" style="flex-wrap: nowrap;display: grid;font-size: inherit;">
              <div v-if="ruleIsEditCom[1]" style="display: flex;align-items: center;margin-bottom: 20px;">
                <el-radio :label="1">
                  <span>现金券</span>
                </el-radio>
                <el-select v-model="formData.discountType">
                  <el-option v-for="(item,index) in discountTypeArr" :disabled="item.disabled" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span v-if="formData.discountType != 1" style="margin-left:10px;">限单次最大抵扣金额</span>
                <el-form-item prop="discountMoney1">
                  <el-input v-model.number="formData.discountMoney1" @input="countRoughlyMoney" maxlength="4" style="width: 270px;margin-left: 10px;">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </div>
              <div v-if="formData.discountType == 3 & ruleIsEditCom[1]" style="display: flex;align-items: center;margin-left: 96px;margin-bottom: 20px;">
                <span style="margin-right: 10px;">并且不超过订单比例</span>
                <el-form-item prop="ratio1">
                  <el-input v-model.number="formData.ratio1" style="width:240px">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </div>
              <div style="display: flex;margin-bottom: 20px;" v-if="ruleIsEditCom[4]">
                <el-radio :label="4" >
                  <span>满减券</span>
                </el-radio>
                <span style="margin-right: 10px;">满</span>
                <el-form-item prop="satisfyMoney4">
                  <el-input  v-model.number="formData.satisfyMoney4" maxlength="9">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
                <span style="margin: 0 10px;">减</span>
                <el-form-item prop="discountMoney4">
                  <el-input v-model.number="formData.discountMoney4" @input="countRoughlyMoney" maxlength="4">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </div>
              <div v-if="ruleIsEditCom[5]" style="display: flex;align-items: center;margin-bottom: 20px;">
                <el-radio :label="5">
                  <div>
                    <span>折扣券</span>
                  </div>
                </el-radio>
                <div style="display: flex;align-items: center;">
                  <span style="margin-right: 10px;">满</span>
                  <el-form-item prop="satisfyMoney5">
                    <el-input v-model.number="formData.satisfyMoney5" maxlength="9" style="width:240px">
                      <template #append>元</template>
                    </el-input>
                  </el-form-item>
                  <span style="margin: 0 10px;">折扣比例</span>
                  <el-form-item prop="ratio5">
                    <el-input v-model.number="formData.ratio5" maxlength="2" style="width:240px">
                      <template #append>%</template>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
              <div v-if="ruleIsEdit(5)" style="display: flex;align-items: center;margin-left: 96px;">
                <span style="margin-right: 10px;">限单次最大抵扣金额</span>
                <el-form-item prop="discountMoney5">
                  <el-input v-model.number="formData.discountMoney5" @input="countRoughlyMoney" maxlength="4" style="width:240px">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="优惠券面值">
            <template #label>
              <label>优惠券面值</label>
            </template>
            <span v-if="(formData.radioRule == 1 && formData.discountType == 1) || formData.radioRule == 4">定额,限单次最大抵扣金额{{
              formData.radioRule == 1 ? (formData.discountMoney1 || 0) : (formData.discountMoney4 || 0) }}元</span>
            <span v-else>不定额,限单次最大抵扣金额{{
              formData.radioRule == 1 ? (formData.discountMoney1 || 0) :  (formData.discountMoney5 || 0) }}元</span>
          </el-form-item>
          <el-form-item label="领取时间" prop="getTime">
            <template #label>
              <label>领取时间</label>
            </template>
            <div style="width: 500px;">
              <el-date-picker
                v-model="formData.getTime"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="diffTime(true)"
              />
            </div>
          </el-form-item>
          <el-form-item label="使用有效期" required>
            <el-radio-group v-model="formData.radioTime" @change="clickValidity" style="flex-wrap: nowrap;display: grid;font-size: inherit;">
              <div style="display: flex;align-items: center;">
                <el-radio :label="1">
                  <span>固定时段内有效</span>
                </el-radio>
                <div style="width: 500px;" v-if="formData.radioTime == 1">
                  <el-form-item prop="effectivityTime">
                    <el-date-picker
                      v-model="formData.effectivityTime"
                      type="datetimerange"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      @change="diffTime(false)"
                      :default-time="defaultTime2"
                    />
                  </el-form-item>
                </div>
              </div>
              <div style="display: flex;margin-top: 20px;">
                <el-radio :label="2">
                  <span>领取后</span>
                </el-radio>
                <el-form-item v-if="formData.radioTime == 2" prop="useEffectivityDay">
                  <el-input v-model.number="formData.useEffectivityDay" maxlength="4" placeholder="请输入大于0的整数" style="width: 240px;">
                    <template #append>天</template>
                  </el-input>
                </el-form-item>
                <span style="margin: 0 10px;">有效截止到最后一天的23:59:59</span>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发行总量" prop="totalTensor">
            <el-input v-model.number="formData.totalTensor" maxlength="7" @input="countRoughlyMoney" style="width:240px">
              <template #append>张</template>
            </el-input>
          </el-form-item>
          <el-form-item label="预计费用">
            <template #label>
              <label>预计费用</label>
            </template>
            <span :style="formData.roughlyMoney > 99999 ? 'color:#f56c6c' : ''">
              {{ formData.roughlyMoney || 0 }} 元
            </span>
          </el-form-item>
          <el-form-item label="使用商品">
            <template #label>
              <label>使用商品</label>
            </template>
            {{ formData.goodstagType }}
          </el-form-item>
          <el-form-item label="使用平台">
            <template #label>
              <label>使用平台</label>
            </template>
            {{ formData.systemType }}
          </el-form-item>
        </el-form>
        <!-- 按钮区 -->
        <div style="margin-left: 150px;">
          <!-- <el-button>提交审核</el-button> -->
          <el-button v-if="route.query.from == 'add' || route.query.from == 'copy'" @click="createCoupon" type="primary" plain>创建计划</el-button>
          <el-button v-if="route.query.from == 'edit'" @click="updateDetail" type="primary" plain>提交审核</el-button>
          <el-button v-if="route.query.from == 'audit'" @click="auditPlan(1)" type="success" plain>审核通过</el-button>
          <el-button v-if="route.query.from == 'audit'" @click="auditPlan(2)" type="danger" plain>审核不通过</el-button>
          <el-button @click="$router.back()" plain>{{ allDisabled ? '返回' : '取消' }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { couponPlanDetails, miniCouponType, updateCouponPlan, addCouponPlan,
          couponPlanAudit } from '@/api/marketing/marketing.js'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { formatDates } from '@/utils/index';

const route = useRoute()
const router = useRouter()
// 现金券 类型
const discountTypeArr = ref([
  {
    label: '定额',
    value: 1
  },
  {
    label: '不定额-限金额',
    value: 2
  },
  {
    label: '不定额-限比例',
    value: 3
  }
])
const couponTypeArr = ref([])
const formData = ref({
  radioRule: 1,
  discountType: 1,
  radioTime: 1
})
// 获取优惠券类型
const miniCoupon = miniCouponType().then(res => {
  couponTypeArr.value = res.data.map(el => {
      return {
        ...el,
        value: el.couponType,
        label: el.couponName
      }
    })
})
// 获取优惠券计划详情
const getDetails = () => {
  const couponPlan = couponPlanDetails({id:route.query.id})
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  Promise.all([miniCoupon, couponPlan]).then(res => {
    formData.value = res[1].data
    echoProcessData()
  }).finally(() => {
    loading.close()
  })
}
// 回显数据处理
const echoProcessData = () => {
  // 优惠规则处理
  if (formData.value.discountType > 3) {
    formData.value.radioRule = formData.value.discountType
    formData.value.discountType = 1
    if (formData.value.radioRule == 4) {
      formData.value.discountMoney4 = formData.value.discountMoney
      formData.value.satisfyMoney4  = formData.value.satisfyMoney
    } else {
      formData.value.discountMoney5 = formData.value.discountMoney
      formData.value.satisfyMoney5 = formData.value.satisfyMoney
      formData.value.ratio5 = formData.value.ratio
    }
  } else {
    formData.value.radioRule = 1
    formData.value.discountMoney1 = formData.value.discountMoney
    formData.value.satisfyMoney1 = formData.value.satisfyMoney
    formData.value.ratio1 = formData.value.ratio
  }
  // 使用有效期处理
  formData.value.radioTime = formData.value.useEffectivityType

  // 时间处理
  if (formData.value.useEffectivityType == 1) {
    formData.value.effectivityTime = [formData.value.startEffectivityTime*1000, formData.value.endEffectivityTime*1000]
    formData.value.useEffectivityDay = ''
  }
  formData.value.getTime =[formData.value.startGetTime*1000,formData.value.endGetTime*1000]

  let obj =  couponTypeArr.value.find(e => e.couponType == formData.value.couponType)
  formData.value.systemType = obj.systemTypeList.map(e => {return e.desc}).join('/')
  formData.value.goodstagType = obj.goodstagTypeList.map(e => {return e.cateName}).join('/') || '全品类' 
  formData.value.orderCodeType = obj.orderCodeTypeList.map(e => {return e.desc}).join('/')
  formData.value.couponRule = obj.couponRule
  // 根据当前类型进行规则限制
  formData.value.faceValueRuleTypes = obj.faceValueRuleTypes
}
// 发送数据处理
const sendProcessData = (func) => {
  let obj = {}
  let data = formData.value
  obj = {
    couponRule: data.couponRule, // 优惠券规则
    couponType: data.couponType, // 优惠券类型
    planName: data.planName, // 计划名称
    totalTensor: data.totalTensor, // 发行量总数
    startGetTime: new Date(data.getTime[0]).getTime()/1000 , // 领取开始时间
    endGetTime: new Date(data.getTime[1]).getTime()/1000, // 领取结束时间
    useEffectivityType: data.radioTime, // 使用时间
  }
  if (route.query.from != 'id') {
    obj.id = data.id
  }
  // 使用时间
  if (data.radioTime == 1) {
    obj.startEffectivityTime = new Date(data.effectivityTime[0]).getTime()/1000
    obj.endEffectivityTime = new Date(data.effectivityTime[1]).getTime()/1000
  } else {
    obj.useEffectivityDay = data.useEffectivityDay
  }
  // 优惠券面值规则
  if (data.radioRule == 4 || data.radioRule == 5) {
    if (data.radioRule == 4) {
      if (Number(data.discountMoney4) > Number(data.satisfyMoney4)) {
        ElMessage.error('优惠金额不能大于满足金额')
        return
      }
      obj.discountType = 4
      obj.discountMoney = data.discountMoney4
      obj.satisfyMoney = data.satisfyMoney4
    } else {
      obj.discountType = 5
      obj.discountMoney = data.discountMoney5
      obj.satisfyMoney = data.satisfyMoney5
      obj.ratio = data.ratio5
    }
  } else {
      obj.discountType = data.discountType
      obj.discountMoney = data.discountMoney1
      obj.satisfyMoney =  data.satisfyMoney1
      obj.ratio = data.ratio1
  }
  func(obj).then(res => {
    router.back()
  })
}
// 优惠券类型 选择事件
const clickCouponType = (el) => {
  // 使用平台
  formData.value.systemType = el.systemTypeList.map(e => {return e.desc}).join('/')
  // 使用商品
  formData.value.goodstagType = el.goodstagTypeList.map(e => {return e.cateName}).join('/') || '全品类'
  // 使用订单类型
  formData.value.orderCodeType = el.orderCodeTypeList.map(e => {return e.desc}).join('/')
  // 规则说明
  formData.value.couponRule = el.couponRule
  // 规则可选类型
  formData.value.faceValueRuleTypes = el.faceValueRuleTypes
  // 默认为第一个值
  formData.value.radioRule = Number(el.faceValueRuleTypes[0])
}
// 根据优惠券类型，返回输入展示规则
const ruleIsEditCom = computed(() => {
  let arr = []
  arr[1] = ruleIsEdit(1)
  arr[2] = ruleIsEdit(2)
  arr[3] = ruleIsEdit(3)
  arr[4] = ruleIsEdit(4)
  arr[5] = ruleIsEdit(5)
  console.log('ruleIsEditCom', arr);
  return arr
})

const ruleIsEdit = (num) => {
  if (!formData.value.faceValueRuleTypes || formData.value.faceValueRuleTypes.findIndex(e => e == 0) != -1) { // 0 为全部
    return true
  }
  // 默认选择返回的第一个
  if (formData.value.faceValueRuleTypes[0] == 4 || formData.value.faceValueRuleTypes[0] == 5) {
    formData.value.radioRule = Number(formData.value.faceValueRuleTypes[0])
  } else {
    formData.value.radioRule = 1
    formData.value.discountType = Number(formData.value.faceValueRuleTypes[0])
  }
  if (num == 1) {
    let i = 0
    discountTypeArr.value = discountTypeArr.value.map(el => {
      if (formData.value.faceValueRuleTypes.findIndex(e => e == el.value) == -1) {
        el.disabled = true
        i++
      } else {
        el.disabled = false
      }
      return el
    })
    if (i == 3) {
      return false
    }
  } else if (formData.value.faceValueRuleTypes.findIndex(e => e == num) == -1) {
    return false
  }
  return true
}
// 是否不可编辑
const allDisabled = ref(false)
if (route.query.from == 'view') {
  allDisabled.value = true
  getDetails()
} else if (route.query.from == 'edit' || route.query.from == 'copy') {
  getDetails()
} else if (route.query.from == 'audit') {
  allDisabled.value = true
  getDetails()
}
// 计算预算费用
const countRoughlyMoney = () => {
  let data = formData.value
  if (data.radioRule == 4 || data.radioRule == 5) { // 1定额,2限制金额,3限制比例,4满减卷,5折扣卷
    if (data.radioRule == 4) {
       formData.value.roughlyMoney = Number(data.discountMoney4) * Number(formData.value.totalTensor)
    } else {
      formData.value.roughlyMoney = Number(data.discountMoney5) * Number(formData.value.totalTensor)
    }
  } else {
    formData.value.roughlyMoney = Number(data.discountMoney1)  * Number(formData.value.totalTensor)
  }
}
// 编辑保存计划
const updateDetail = () => {
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      sendProcessData(updateCouponPlan)
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 创建新计划
const createCoupon = () => {
  if (formData.value.roughlyMoney > 99999) {
    ElMessageBox.confirm(
      '预计营销金额已超过十万, 请确认是否要创建该计划',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        create()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消成功',
        })
      })
  } else {
    create()
  }
}
const create = () => {
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      sendProcessData(addCouponPlan)
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 审核计划
const auditPlan = (auditStatus) => {
  couponPlanAudit({id: formData.value.id, auditStatus: auditStatus}).then(res => {
    if(res.code == 200) {
      auditStatus == 1 ? ElMessage.success('审核通过') : ElMessage.success('审核不通过')
      router.back()
    }
  })
}
// 检验名称中是否包含特殊字符
const checkName = () => {
  let arr = ['%', '&', '+', '#']
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (formData.value.planName.indexOf(el) != -1) {
      formData.value.planName = ''
      return ElMessage.error('不可输入特殊字符')
    }
  }
}

const integerReg = (val) => {
  let reg = /^[1-9]\d*$/
  return reg.test(val)
}
// 优惠规则校验
const checkMoney = (rule, value, callback) => {
  // 判断当前验证数据是否被选择
  if (rule.field != ('satisfyMoney' + formData.value.radioRule) && rule.field != ('discountMoney' + formData.value.radioRule) && rule.field != ('ratio' + formData.value.radioRule)) {
    return callback()
  }
  // 判断当前输入的内容是否需要验证
  let str = rule.field.indexOf('ratio') == -1 ? '金额' : '比例'
  if(!value) {
    return callback(new Error('请填写' + str))
  } else if (!integerReg(value)) {
    return callback(new Error(str + '只能填写正整数'))
  }
  return callback()
}
// 有效期校验
const checkValidity = (rule, value, callback) => {
  if ((rule.field == 'effectivityTime' && formData.value.radioTime != 1) || (rule.field == 'useEffectivityDay' && formData.value.radioTime != 2)) {
    return callback()
  }
  // 判断当前输入的内容是否需要验证
  let str = rule.field.indexOf('effectivityTime') != -1 ? '请选择' : '请填写'
  if(!value) {
    return callback(new Error(str + '有效期时间'))
  } else if (rule.field == 'useEffectivityDay' && !integerReg(value)) {
    return callback(new Error(str + '有效期时间'))
  }
  return callback()
}
// 有效期 单选事件
const clickValidity = (val) => {
  console.log(val, 'asd');
  if (val == 1) {
    formData.value.useEffectivityDay = null
    ruleFormRef.value.validateField('effectivityTime')
    ruleFormRef.value.clearValidate('useEffectivityDay')
  } else {
    formData.value.effectivityTime = null
    ruleFormRef.value.validateField('useEffectivityDay')
    ruleFormRef.value.clearValidate('effectivityTime')
  }
}
// 优惠券规则 单选事件
const changeRadioRule = (val) => {
  // formData.value.radioRule = val
  formData.value.radioRule = Number(val)
  console.log(val, '=====', formData.value.radioRule);
  let str = [`discountMoney${val}`,`satisfyMoney${val}`,`ratio${val}`]
  let arr = ['discountMoney1','ratio1',
              'discountMoney4','satisfyMoney4',
              'discountMoney5','satisfyMoney5','ratio5'].filter(e => e.indexOf(val) == -1)
  for (let i = 0; i < str.length; i++) {
    const el = str[i];
    if (el == 'ratio2' || el == 'satisfyMoney1') {
      continue;
    }
    if (formData.value.discountType != 3 && el == 'ratio1') {
      continue;
    }
    ruleFormRef.value.validateField(el)
  }
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (formData.value.discountType != 3 && el == 'ratio1') {
      continue;
    }
    ruleFormRef.value.clearValidate(el)
  }
}
// 表单效验规则
const ruleFormRef = ref()
const rules = reactive({
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  couponType: [{ required: true, message: '请选择类型', trigger: 'change' }],
  getTime: [{ required: true, message: '请选择领取时间', trigger: 'change' }],
  totalTensor: [{ required: true, message: '请填写发行总量', trigger: 'change' }
                ,{ type: 'number', message: '请填写正整数' }],
  discountMoney1: [{ validator: checkMoney, trigger: ['change','blur'] }],
  discountMoney4: [{ validator: checkMoney, trigger: ['change','blur'] }],
  discountMoney5: [{ validator: checkMoney, trigger: ['change','blur'] }],
  satisfyMoney4: [{ validator: checkMoney, trigger: ['change','blur'] }],
  satisfyMoney5: [{ validator: checkMoney, trigger: ['change','blur'] }],
  ratio1: [{ validator: checkMoney, trigger: ['change','blur'] }],
  ratio5: [{ validator: checkMoney, trigger: ['change','blur'] }],
  effectivityTime: [{ validator: checkValidity, trigger: 'change' }],
  useEffectivityDay: [{ validator: checkValidity, trigger: 'change' }],
})

// 对比时间 val = true -> 领取时间
const diffTime = (val) => {
  if (formData.value.effectivityTime && formData.value.getTime) {
    if (val && !(formData.value.getTime[1] <= formData.value.effectivityTime[1])) {
      formData.value.getTime = null
      ElMessage.error('领取时间结束时间不得大于有效期结束时间')
    } else if (!(formData.value.getTime[1] <= formData.value.effectivityTime[1])) {
      formData.value.effectivityTime = null
      ElMessage.error('有效期结束时间不得小于领取结束时间')
    }
  }
  if (formData.value.effectivityTime) {
    let time = new Date(formatDates(formData.value.effectivityTime[1]) + ' 23:59:59')
    if (formData.value.effectivityTime[1].getTime() != time.getTime()) {
      ElMessageBox.alert('结束时间只能为当天的 23:59:59', "提示")
      formData.value.effectivityTime[1] = time
    }
  }
}
const defaultTime2 = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]

</script>

<style scoped>
:deep(.el-input__suffix) {
  color: #67C23A;
}
</style>
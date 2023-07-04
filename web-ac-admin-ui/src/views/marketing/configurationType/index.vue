<template>
  <div class="app-container app-container_bg">
    <div style="padding: 20px;background-color: #fff;">
      <div style="margin-bottom: 16px;">
        优惠券类型配置
      </div>
      <Table :listArr="listArr" :tableData="tableData" :pagination="false" :tableHeight="visualHeight">
        <template #col-gainType="{row}">
          <div>
            <el-radio-group v-model="row.gainType" class="ml-4" :disabled="!row.edit">
              <el-radio :label="1" size="large">限制最大值</el-radio>
              <el-checkbox-group v-if="row.gainType == 1" v-model="row.goodstag" :disabled="!row.edit" >
                
                <div style="display: flex;align-items: center;">
                  <el-checkbox :label="1">
                    <span>限制最大数量，单人限领取</span>
                  </el-checkbox>
                  <el-input v-model="row.ruleMax1" @input="inputRule(row, 'ruleMax1')" :disabled="!row.edit" style="width: 90px;margin-left: 8px;">
                    <template #append>
                      张
                    </template>
                  </el-input>
                  <span class="span_text">每</span>
                  <el-input v-model="row.ruleMonth1" @input="inputRule(row, 'ruleMonth1')" :disabled="!row.edit" style="width: 110px;">
                    <template #append>
                      个月
                    </template>
                  </el-input>
                  <span class="span_text">内</span>
                </div>
                <div style="display: flex;align-items: center;">
                  <el-checkbox :label="2" style="margin-top: 10px;">
                    <span>限制最大额度，单人限额度</span>
                  </el-checkbox>
                  <el-input v-model="row.ruleMax2" @input="inputRule(row, 'ruleMax2')" :disabled="!row.edit" style="width: 90px;margin-left: 8px;">
                    <template #append>
                      元
                    </template>
                  </el-input>
                  <span class="span_text">每</span>
                  <el-input v-model="row.ruleMonth2" @input="inputRule(row, 'ruleMonth2')" :disabled="!row.edit" style="width: 110px;">
                    <template #append>
                      个月
                    </template>
                  </el-input>
                  <span class="span_text">内</span>
                </div>
                <div v-if="row.couponType == 'adjustment_coupon'" style="display: flex;align-items: center;">
                  <el-checkbox :label="3" style="margin-top: 10px;">
                      <span>需要审批，单次优惠金额超</span>
                  </el-checkbox>
                  <el-input v-model="row.ruleMax3" @input="inputRule(row, 'ruleMax3')" :disabled="!row.edit" style="width: 90px;margin-left: 8px;margin-right: 24px;">
                    <template #append>
                      元
                    </template>
                  </el-input>
                </div>
              </el-checkbox-group>
              <el-radio :label="2" size="large">无限制</el-radio>
            </el-radio-group>
          </div>
        </template>
        <template #col-useType="{row}">
          <div>
            <el-radio-group v-model="row.useType" class="ml-4" :disabled="!row.edit" >
              <el-radio :label="1" size="large">限制最大值</el-radio>
                <el-checkbox-group v-if="row.useType == 1" v-model="row.use" :disabled="!row.edit"  >
                  <div style="display: flex;align-items: center;">
                    <el-checkbox :label="1">
                        <span>限制最大数量，单人限领取</span>
                    </el-checkbox>
                    <el-input v-model="row.useRuleMax1" @input="inputRule(row, 'useRuleMax1')" :disabled="!row.edit" style="width: 90px;margin-left: 8px;">
                      <template #append>
                        张
                      </template>
                    </el-input>
                    <span class="span_text">每</span>
                    <el-input v-model="row.useRuleMonth1" @input="inputRule(row, 'useRuleMonth1')" :disabled="!row.edit" style="width: 110px;">
                      <template #append>
                        个月
                      </template>
                    </el-input>
                    <span class="span_text">内</span>
                  </div>
                  <div style="display: flex;align-items: center;">
                    <el-checkbox :label="2" style="margin-top: 10px;">
                      <span>限制最大额度，单人限额度</span>
                    </el-checkbox>
                    <el-input v-model="row.useRuleMax2" @input="inputRule(row, 'useRuleMax2')" :disabled="!row.edit" style="width: 90px;margin-left: 8px;">
                      <template #append>
                        元
                      </template>
                    </el-input>
                    <span class="span_text">每</span>
                    <el-input v-model="row.useRuleMonth2" @input="inputRule(row, 'useRuleMonth2')" :disabled="!row.edit" style="width: 110px;">
                      <template #append>
                        个月
                      </template>
                    </el-input>
                    <span class="span_text" style="">内</span>
                  </div>
                </el-checkbox-group>
              <el-radio :label="2" size="large">无限制</el-radio>
            </el-radio-group>
          </div>
        </template>
        <template #col-yue="{ row }">
          <div style="display: flex;flex-wrap:wrap">
            <el-button v-if="!row.edit" @click="row.edit = true" text type='primary' style="margin:0;padding: 8px;">设置</el-button>
            <el-button v-if="row.edit" @click="edit(row)" text type='primary' style="margin:0;padding: 8px;">确认设置</el-button>
            <el-button v-if="row.edit" @click="getList" text type='primary' style="margin:0;padding: 8px;">取消设置</el-button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Table from '../components/Table'
import { listArr } from './configure.js'
import { getCouponKindConfigList, updateCouponKindConfig } from "@/api/marketing/marketing.js"
import { onBeforeMount } from 'vue'
import { ElMessage } from 'element-plus'

const tableData = ref([])

const inputRule = (row, key) => {
  let oldVal = row[key]
  let rule = /^[0-9]*$/
  if (!rule.test(oldVal) || oldVal == 0) {
    row[key] = ''
  }
}

const getList = () => {
  tableData.value = null
  tableData.value = []
  getCouponKindConfigList().then(res => {
    tableData.value = res.data.map(el => {
      if (el.gainType == 1 && el.gainTypeList?.length) {
        el.goodstag = []
        for (let i = 0; i < el.gainTypeList.length; i++) {
          const e = el.gainTypeList[i];
          el.goodstag.push(e.ruleType)
          el[`ruleMax${e.ruleType}`] = e.ruleMax
          el[`ruleMonth${e.ruleType}`] = e.ruleMonth
        }
      } else {
        el.gainTypeList = []
      }

      if (el.useType == 1 && el.useTypeList?.length) {
        el.use = []
        for (let i = 0; i < el.useTypeList.length; i++) {
          const e = el.useTypeList[i];
          el.use.push(e.ruleType)
          el[`useRuleMax${e.ruleType}`] = e.ruleMax
          el[`useRuleMonth${e.ruleType}`] = e.ruleMonth
        }
      } else {
        el.useTypeList = []
      }

      el.edit = false
      return el
    })

  })
}

const edit = (item) => {
  let error = false
  if (item.gainType == 1) {
    if (item.goodstag?.length) { // 当前是否有选中  领取
      item.gainTypeList = item.gainTypeList?.map(el => { // 如果原有的在现在选中不存在则增加删除标识
        el.isDel = 0
        if (item.goodstag.findIndex(e => e == el.ruleType) == -1) {
          el.isDel = 1
        } else { // 如果存在则更新数据
          if (!item[`ruleMax${el.ruleType}`] || !item[`ruleMonth${el.ruleType}`]) {
            error = true
          }
          el.ruleMax = item[`ruleMax${el.ruleType}`]
          el.ruleMonth = item[`ruleMonth${el.ruleType}`]
        }
        return el
      })
      for (let i = 0; i < item.goodstag.length; i++) {
        const el = item.goodstag[i];
        if (item.gainTypeList.findIndex(e => el == e.ruleType) == -1) {
          if (!item[`ruleMax${el}`] || (!item[`ruleMonth${el}`] && el != 3)) {
            error = true
          }
          item.gainTypeList.push({
            type: 1,
            ruleType: el,
            ruleMax: item[`ruleMax${el}`],
            ruleMonth: item[`ruleMonth${el}`]
          })
        }
      }
    } else {
      // return ElMessage.error('修改失败，请选择完整。')
      error = true
    }
  }
  if (error) {
    return ElMessage.error('修改失败，请填写完整。')
  }
  if (item.useType == 1) {
    if (item.use?.length) { // 当前是否有选中  领取
      item.useTypeList = item.useTypeList?.map(el => { // 如果原有的在现在选中不存在则增加删除标识
        if (item.use.findIndex(e => e == el.ruleType) == -1) {
          el.isDel = 1
        } else { // 如果存在则更新数据
          if (!item[`useRuleMax${el.ruleType}`] || !item[`useRuleMonth${el.ruleType}`]) {
            error = true
          }
          el.ruleMax = item[`useRuleMax${el.ruleType}`]
          el.ruleMonth = item[`useRuleMonth${el.ruleType}`]
        }
        return el
      })
      for (let i = 0; i < item.use.length; i++) {
        const el = item.use[i];
        if (item?.useTypeList?.findIndex(e => el == e.ruleType) == -1) {
          if (!item[`useRuleMax${el}`] || !item[`useRuleMonth${el}`]) {
            error = true
          }
          item.useTypeList.push({
            type: 1,
            ruleType: el,
            ruleMax: item[`useRuleMax${el}`],
            ruleMonth: item[`useRuleMonth${el}`]
          })
        }
      }
    } else {
      // return ElMessage.error('修改失败，请选择完整。')
      error = true
    }
  }
  // 检查是否有填写 未选中的
  if (!error) {
    // 可选择的最长为 3
    for (let i = 0; i < 3; i++) {
      if (item.gainType == 1 && item.goodstag && item.goodstag.findIndex(e => e == i) == -1) {
        if (item[`ruleMax${i}`] || item[`ruleMonth${i}`]) {
          error = true
        }
      }
      if (item.useType == 1 && item.use && item.use.findIndex(e => e == i) == -1) {
        if (item[`useRuleMax${i}`] || item[`useRuleMonth${i}`]) {
          error = true
        }
      }
    }
  }
  if (error) {
    return ElMessage.error('修改失败，请填写完整。')
  }
  delete item['edit']
  delete item['ruleMax1']
  delete item['ruleMax2']
  delete item['ruleMax3']
  delete item['ruleMonth1']
  delete item['ruleMonth2']
  delete item['useRuleMax1']
  delete item['useRuleMax2']
  delete item['useRuleMonth1']
  delete item['useRuleMonth2']
  delete item['goodstag']
  delete item['use']
  updateCouponKindConfig(item).then(() => {
    item.edit = false
    ElMessage.success('修改成功')
  }).catch((err) => {
    item.edit = false
    ElMessage.error('修改失败', err.msg)
  }).finally(() => {
    getList()
  })
}

const visualHeight = ref(0)
const onSize = () => {
  let clientHeight = document.body.clientHeight
  // 40 整体的内边距;40标题内边距;50是最顶部的标题栏;37标题；
  visualHeight.value = clientHeight - (40 + 40 + 37 + 50)
}

onBeforeMount(() => {
  window.addEventListener('resize', onSize)
  nextTick(() => {
    onSize()
  })
  getList()
})
onUnmounted(() => {
  window.removeEventListener('resize', onSize)
})
</script>

<style scoped>
:deep(.el-input-group__append) {
  padding: 0 5px !important;
}
:deep(.el-radio-group) {
  display: table-caption;
}
.span_text {
  width: 35px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  text-align: center;
}
</style>
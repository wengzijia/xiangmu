<template>
  <div class="app-container">
    <!-- 数据概况 -->
    <div>
      <div>
        数据概况
      </div>
      <div style="display: flex;flex-wrap: wrap;" id="dataSurvey">
        <div v-for="(item,index) in dataSurvey" :key="index" class="border" style="margin-right: 16px;margin-top: 16px;">
          <div class="size_14">
            {{ item.name }}
          </div>
          <div class="size_24">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
    <!-- 查询条件 -->
    <div style="margin-top: 24px;" id="search">
      <el-form v-model="form" inline>
        <el-form-item label="优惠券计划编号">
          <el-input v-model="form.planSerial"></el-input>
        </el-form-item>
        <el-form-item label="优惠券计划名称">
          <el-input v-model="form.planName"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select v-model="form.couponType">
            <el-option v-for="(item,index) in couponType" :key="index" :value="item.couponType" :label="item.couponName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <template #label>
            <label>创建时间</label>
          </template>
          <el-date-picker
            v-model="timeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item>
          <div>
            <el-button @click="search" type="primary">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-form-item>
      </el-form >
    </div>
    <!-- 列表展示 -->
    <div style="margin-top: 24px;">
      <el-table :data="tableData.records" :style="tableStyle">
        <el-table-column prop="planSerial" label="优惠券计划编号" />
        <el-table-column prop="planName" label="优惠券计划名称" />
        <el-table-column prop="couponTypeName" label="优惠券类型" />
        <el-table-column prop="useOrderType" label="使用订单类型" />
        <el-table-column prop="discountMoney" label="面额" />
        <el-table-column prop="totalTensor" label="发行量" />
        <el-table-column prop="notReceivedTensor" label="未领取" />
        <el-table-column prop="notSpentTensor" label="未使用" />
        <el-table-column prop="using" label="使用中" />
        <el-table-column prop="spentTensor" label="已使用" />
        <el-table-column prop="expiredTensor" label="已过期" />
        <el-table-column prop="cancellationTensor" label="已作废" />
        <el-table-column label="操作列" >
          <template #default="{row}">
            <el-button text type="primary" @click="jumpDetails(row)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: space-between;margin-top: 16px;">
        <div>

        </div>
        <el-pagination
          :current-page="form.current"
          :page-size="form.size"
          :page-sizes="[10, 200, 300, 400]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { miniCouponType, dataOverview, grant } from '@/api/marketing/marketing'
import {useRouter} from "vue-router"

const router = useRouter()

const form = ref({
  beginCreateTime: '',
  couponType: '',
  current: 1,
  endCreateTime: '',
  planName: '',
  planSerial: '',
  size: 10,
  total: 0
})

const couponType = ref([])
miniCouponType().then(res => {
  couponType.value = res.data
})

dataOverview().then(res => {
  dataSurvey.value = dataSurvey.value.map(el => {
    el.value = res.data[el.key]
    return el
  })
})

const timeArr = ref([
  new Date(new Date().getTime() - (180 * 86400000)),
  new Date(),
])

const changeTime = () => {
  form.value.beginCreateTime = (new Date(timeArr.value[0]) / 1000).toFixed(0)
  form.value.endCreateTime = (new Date(timeArr.value[1]) / 1000).toFixed(0)
}

// 表格样式
const tableStyle = ref({
	width:'100%',
	// height: `${Math.floor(window.innerHeight * 0.44)}px`,
	height: `${Math.floor(window.innerHeight * 0.6)}px`,
  background: '#fff'
})
const tableData = ref([])
const getList = () => {
  grant(form.value).then(res => {
    tableData.value = res.data
    form.value.total = res.data.total
  })
}

const jumpDetails = (data) => {
  let url = `/acwebadmin/marketing/planDetails?planName=${data.planName}&couponType=${data.couponType}&planSerial=${data.planSerial}`
  window.open(url)
}

const search = () => {
  form.value.current = 1
  getList()
}

const reset = () => {
  form.value = {
    beginCreateTime: '',
    couponType: '',
    current: 1,
    endCreateTime: '',
    planName: '',
    planSerial: '',
    size: 10
  }
  timeArr.value = [
    new Date(new Date().getTime() - (180 * 86400000)),
    new Date()
  ]
  changeTime()
}

changeTime()
getList()
// 分页 size 调整
const handleSizeChange = (val) => {
  form.value.size = val
  getList()
}
// 分页跳转
const handleCurrentChange = (val) => {
  form.value.current = val
  getList()
}

const dataSurvey = ref([
  {
    value: 0,
    name: '发行量(张)',
    key: 'circulation'
  }, {
    value: 0,
    name: '未使用(张)',
    key: 'notUsed'
  }, {
    value: 0,
    name: '已使用(张)',
    key: 'used'
  // }, {
  //   value: 0,
  //   name: '已过期(张)',
  //   key: 'expired'
  }, {
    value: '0%',
    name: '领取率',
    key: 'drawRate'
  }, {
    value: '0%',
    name: '使用率',
    key: 'useRate'
  }, {
    value: '0%',
    name: '费效率',
    key: 'costRate'
  }
])

</script>

<style scoped>
.border {
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #DCDFE6;
  padding: 20px;
  width: 260px;
  height: 100px;
}
.size_14 {
  color: #606266;
  font-size: 14px;
}
.size_24 {
  color: #303133;
  font-size: 24px;
  margin-top: 10px;
}
</style>
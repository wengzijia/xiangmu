<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div style="display: flex;align-items: center;justify-content: space-between;">
      <div>
        优惠券使用总览
      </div>
      <div style="display: flex;margin-right: 140px;">
        <el-radio-group v-model="tabPosition" @change="changeTime" style="margin-bottom: 30px">
          <el-radio-button label="30">近30天</el-radio-button>
          <el-radio-button label="60">近60天</el-radio-button>
          <el-radio-button label="90">近90天</el-radio-button>
          <el-radio-button label="custom">自定义</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-if="tabPosition == 'custom'"
          style="margin-left: 10px;"
          v-model="timeZones"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="changeZones"
        />
      </div>
    </div>
    <!-- 数据概况 -->
    <div style="margin-top: 24px;">
      <div>
        数据概况
      </div>
      <div style="display: flex;margin-top: 16px;">
        <div class="border">
          <div class="size_14">
            优惠券使用量（张）
          </div>
          <div class="size_24">
            {{ option.couponUseCount }}
          </div>
        </div>
        <div class="border" style="margin-left: 16px;">
          <div class="size_14">
            用券优惠金额（元）
          </div>
          <div class="size_24">
            {{ option.couponUseAmount }}
          </div>
        </div>
        <div class="border" style="margin-left: 16px;">
          <div class="size_14">
            用券订单总额（元）
          </div>
          <div class="size_24">
            {{ option.couponUseOrderAmount }}
          </div>
        </div>
      </div>
    </div>
    <!-- 优惠类型占比 -->
    <div style="margin-top: 24px;">
      <div>
        优惠类型占比<span style="font-size: 14px;color: #909399">(各类已使用优惠券金额占总优惠金额比率)</span>
      </div>
      <div style="display: flex;">
        <div id="main" style="height:600px;flex: 1.3;"></div>
        <div style="flex: 1;">
          <el-table :data="option.couponUseTotalListVos" :style="tableStyle">
            <el-table-column prop="couponTypeName" label="优惠类型" />
            <el-table-column prop="discountAmount" label="总优惠金额" />
            <el-table-column prop="ratio" label="占比" />
            <el-table-column width="100" label="操作列">
              <template #default="{row}">
                <el-button text type="primary" @click="jumpDetails(row)">明细</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import * as echarts from 'echarts';
import { onBeforeMount, ref } from 'vue';
import { used } from "@/api/marketing/marketing.js"
import { useRouter } from 'vue-router';

const router = useRouter()

const option = ref({data: []})
// 表格样式
const tableStyle = {
	width:'100%',
	height: `${Math.floor(window.innerHeight * 0.63)}px`
}

const tabPosition = ref('30')

onBeforeMount(() => {
  changeTime()
})

const changeTime = () => {
  if (tabPosition.value == 'custom') {
    return
  } else {
    let obj = {
      beginUseDate: parseInt((new Date().getTime() - 86400000 * Number(tabPosition.value)) / 1000),
      endUseDate: parseInt(new Date().getTime() / 1000)
    }
    getDate(obj)
  }
}

const timeZones = ref('')
const changeZones = () => {
  let obj = {
    beginUseDate: parseInt(new Date(timeZones.value[0]).getTime() / 1000),
    endUseDate: parseInt(new Date(timeZones.value[1]).getTime() / 1000)
  }
  getDate(obj)
}

const jumpDetails = (data) => {
  console.log(data);
  let url = `/marketing/useDetails?couponType=${data.couponType}`
  router.push(url)
}


const getDate = (date = {
  beginUseDate: 0,
  endUseDate: 0
}) => {
  used(date).then(res => {
    option.value = res.data
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    let options = option.value.couponUseTotalListVos.sort((a,b) => {return b.discountAmount - a.discountAmount}).map(e => {
      return {
        value: e.discountAmount,
        name: e.couponTypeName + ' ' + e.ratio
      }
    })
    // 绘制图表
    myChart.setOption({
      title: {
        text: '优惠券类型占比',
        left: 'center',
        top: 'center'
      },
      series: [
        {
          type: 'pie',
          data: options,
          radius: ['40%', '70%']
        }
      ]
    });
  })
}

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
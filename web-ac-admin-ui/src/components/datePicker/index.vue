<template>
  <div>
    <el-date-picker :style="'width: '+width+'px'" v-model="valueTime" :type="dateType" range-separator="→" start-placeholder="开始日期"
      end-placeholder="结束日期" :default-time="defaultTime" @change="timeFormat(valueTime)" />
  </div>
</template>

<script setup >
import { formatDate, formatDates } from '@/utils/index'
const props = defineProps({
  dateType: {
    type: String,
    default: '',
  },
  startTime: {
    type: String,
    default: '',
  },
  endTime: {
    type: String,
    default: '',
  },
  isThreeMonths: {
    type: Boolean,
    default: true,
  },
  dateRange: {
    type: Number,
    default: 0,
  },
  width:{
    type: Number,
    default: 360,
  },
  isAddTime:{
    type: Boolean,
    default: false,
  }
})
const emits = defineEmits(['update:startTime', 'update:endTime'])
let currentTime = new Date(new Date().toLocaleDateString()).getTime()
let dayTime = 60*60*1000*24;
let start = new Date(currentTime-dayTime*(props.dateRange||90))
let end = new Date(currentTime+dayTime-1000)
const defaultTime = [
  new Date(currentTime),
  new Date(end),
] // '00:00:00', '23:59:59'
let valueTime = ref(props.isThreeMonths ? [start, end] : null)
const {startTime,endTime} = toRefs(props)
watch([startTime,endTime],([val1,val2])=>{
  valueTime.value = [val1,val2] 
})
if (startTime.value&&endTime.value) {
  valueTime.value = [startTime.value,endTime.value] 
}

/**
 * 处理选着的时间格式
 **/
const timeFormat = (value) => {
  if (!value) {
    emits('update:startTime', null)
    emits('update:endTime', null)
    return
  }
  if (props.dateType == 'datetimerange') {
    emits('update:startTime', formatDate(value.length?value[0].getTime():null))
    emits('update:endTime', formatDate(value.length?value[1].getTime():null))
  } else {
    let startTime = formatDates(value[0].getTime())
    let endTime = formatDates(value[1].getTime())
    if(props.isAddTime){
      startTime = startTime+' 00:00:00' 
      endTime = endTime+' 23:59:59' 
    }
    emits('update:startTime', startTime)
    emits('update:endTime', endTime)
  }
}
// 初始化值
const initTime=(type)=>{
  if(type==1){
      valueTime.value = [start, end] 
    }else{
      valueTime.value = []
    }
    timeFormat(valueTime.value)
}
defineExpose({
  start,
  end,
  initTime
})
</script>

<style scoped ></style>
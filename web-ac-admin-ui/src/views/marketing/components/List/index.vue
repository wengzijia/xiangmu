<template>
  <listLayout :hide-header="props.searchArr.length ? true : false">
    <!-- 查询 -->
    <template #header>
      <el-form v-model="formData" :inline="true">
        <el-form-item v-for="(item,index) in searchArr" style="font-weight: 700;" :key="index" :label="item.label">
          <template #default>
            <slot :name="`${item.key}`" :row="formData">
              <el-input v-if="item.type == 'input'" clearable v-model="formData[item.key]"></el-input>
              <el-select v-else-if="item.type == 'select'" v-model="formData[item.key]">
                <el-option
                  v-for="(it,index) in item.arr"
                  :key="index"
                  :label="it.label"
                  :value="it.value"
                />
              </el-select>
              <el-date-picker
                v-else-if="item.type == 'datePicker'"
                v-model="formData[item.key]"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="clickDatePicker(item)"
              />
            </slot>
          </template>
        </el-form-item>
      </el-form>
      <!-- 按钮区 -->
      <slot name="btns">
        <div style="text-align: right;">
          <el-button type="primary" @click="refer">查询</el-button>
          <el-button @click="reset();refer()">清空</el-button>
          <slot name="btns-item"></slot>
        </div>
      </slot>
    </template>
    <!-- 列表展示 -->
    <template #table-header>
      <slot :name="'tableTitle'"></slot>
    </template>
    <template #table-content='tableHeight'>
      <Table v-if="props.listArr.length" :tableData="props.tableData" :listArr="props.listArr" :tableHeight="tableHeight.tableHeight" :pagination="false" :first="false">
        <el-table-column v-for="(item,index) in props.listArr" :key="index" :prop="item.key" :width="item.width" :fixed="item.fixed" >
          <!-- 自定义表头 -->
          <template v-slot:header>
            <slot :name="`col-${item.key}-header`">
              {{ item.label }}
            </slot>
          </template>
          <!-- 自定义列 -->
          <template #default="{ row }">
            <slot :name="`col-${item.key}`" :row="row">{{ row[item.key] }}</slot>
          </template>
        </el-table-column>
      </Table>
    </template>
    <template #footer>
      <!-- 分页 -->
      <div v-if="props.pagination" style="display: flex;justify-content: space-between;align-items: center;margin-top: 20px;">
        <slot name="footer-left">
          <div></div>
        </slot>
        <el-pagination
          v-model:current-page="formData.current"
          v-model:page-size="formData.size"
          :page-sizes="props.sizesArr"
          layout="total, sizes, prev, pager, next, jumper"
          :total="props.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </listLayout>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import listLayout from '@/components/ParentView/listLayout.vue'
import Table from '../Table/index.vue'

const props = defineProps({
  searchArr: { // 配置查询条件
    type: Array,
    default: () => {
      return []
    }
  },
  listArr: { // 表格表头数据
    type: Array,
    default: () => {
      return []
    }
  },
  tableData: { // 表格数据
    type: Array,
    default: () => {
      return []
    }
  },
  pagination: { // 是否展示分页功能
    type: Boolean,
    default: true
  },
  sizesArr: { // 可分页数码
    type: Array,
    default: () => {
      return [10,100, 200, 300, 400]
    }
  },
  total: { // 列表总数
    type: Number,
    default: 0
  },
  first: { // 是否首次渲染 触发刷新
    type: Boolean,
    default: true
  },
  searchData: { // 查询条件初始数据
    type: Object,
    default: () => {
      return {}
    }
  }
})

const searchArr = ref([]) // 查询表单 循环
const tableArr = ref([]) // 表格列 循环

const formData = ref({
  size: 10,
  current: 1
})

onBeforeMount(() => {
  searchArr.value = props.searchArr
  tableArr.value = props.listArr
  for (let i = 0; i < searchArr.value.length; i++) {
    const el = searchArr.value[i];
    if (props.searchData[el.key]) {
      setTimeout(() => {
        formData.value[el.key] = props.searchData[el.key]
      }, 300)
    } else {
      formData.value[el.key] = ''
    }
  }
  setTimeout(() => {
    formData.value = {...formData.value, ...props.searchData}
  }, 330)
  if (props.first) {
    setTimeout(() => {
      refer()
    }, 400)
  }
})

const emits = defineEmits(['refer'])

// 分页 size 调整
const handleSizeChange = (val) => {
  formData.value.size = val
  refer()
}
// 分页跳转
const handleCurrentChange = (val) => {
  formData.value.current = val
  emits('refer', formData.value)
}
// 重置事件
const reset = () => {
  for (const key in formData.value) {
    formData.value[key] = ''
  }
  console.log(formData.value);
  formData.value.size = 10
  formData.value.current = 1
}
// 查询事件
const refer = () => {
  formData.value.current = 1
  emits('refer', formData.value)
}
// 时间选择器 事件
const clickDatePicker = (el) => {
  if (formData.value[el.key].length) {
    formData.value[el.start] = new Date(formData.value[el.key][0]).getTime() / 1000
    formData.value[el.end] = new Date(formData.value[el.key][1]).getTime() / 1000
  } else {
    formData.value[el.start] = ''
    formData.value[el.end] = ''
  }
}

defineExpose({
  formData,
})
</script>
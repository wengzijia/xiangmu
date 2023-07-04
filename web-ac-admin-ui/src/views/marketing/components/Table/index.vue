<template>
  <el-table :data="props.tableData" id="table" :height='props.tableHeight'>
    <slot>
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
    </slot>
  </el-table>

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

<script setup>
const props = defineProps({
  tableData: {
    type: Array,
    default: () => {
      return []
    }
  },
  tableHeight: {
    type: [Number, String],
    default: 500
  },
  listArr: { // 表格表头数据
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
})

onBeforeMount(() => {
  if (props.first) {
    setTimeout(() => {
      refer()
    }, 400)
  }
})

const formData = ref({
  current: 1,
  size: 10
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
// 查询事件
const refer = () => {
  formData.value.current = 1
  emits('refer', formData.value)
}
</script>

<template>
  <div>
    <el-tooltip v-if="content?.length>15" class="box-item" effect="dark" placement="top">
      <template #content>
        <div style="max-width:300px">
          {{content}}
        </div>
      </template>
      <div class="overflow-tooltip">{{content}}</div>
    </el-tooltip>
    <div v-else>
      <div v-if="!content&&content!==0">-</div>
      <div v-else class="overflow-tooltip">{{content}}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 数据
  content: {
    type: String,
    default: '-',
  },
})
</script>

<style scoped>
.overflow-tooltip {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
<template>
    <div class="ac-img-viewer-box">
      <el-image-viewer
        v-if="state.visible"
        :url-list="props.imgs"
        @close="close"
      />
    </div>
  </template>
   
  <script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { useVModel } from '@vueuse/core'
  const props = defineProps<{
    modelValue: boolean
    imgs: string[]
  }>()
  const emits = defineEmits<{
    (e: 'update:modelValue', data: boolean)
  }>()
  const state = reactive({
    imgList: [],
    // 相当于是set 与 get
    visible: useVModel(props, 'modelValue', emits),
  })
   
  // 点击关闭的时候，连同小图一起关闭
  function close() {
    state.visible = false
  }
  </script>
   
  <style scoped></style>
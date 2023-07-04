<template>
  <div>
    <div v-html="html"  @click="imgViewer"  class="remark"></div>
    <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" teleported ></el-image-viewer>
  </div>
</template>

<script setup>
import { ElImageViewer } from "element-plus"

let props = defineProps({
  html:''
})
// 富文本内容图片放大
let isPreviewImgShow = ref(false)
let previewList = ref([])
function imgViewer(e){
  if (e.target.tagName == 'IMG') {
    previewList.value = [e.target.src]
    isPreviewImgShow.value = true
  }
}
function closeImgViewer(){
  isPreviewImgShow.value = false
}
</script>

<style>
.remark p{
  margin: 0;
}
</style>
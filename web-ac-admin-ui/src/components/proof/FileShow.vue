<!-- 上下布局的el-card组件，内容通过插槽嵌入 -->
<template>
  <div class="file">
    <div class="title">{{title}}</div>
    <a :href="fileurl" target="_blank" class="fileurl">{{filename}}</a>
  </div>
</template>

<script setup>
import { BASE_FILE_URL } from "@/store/global-constant";
const props = defineProps({
    title:{
        type:String,
        default:''
    },
    filename:{
        type:String,
        default:''
    },
    fileurl:{
        type:String,
        default:''
    }
})
</script>

<style lang="scss" scoped>
.file{
  display: flex;
  .fileurl{
    color: #409eff;
    text-decoration:underline;
  }
  .title{
    max-width: 100px;
    white-space: nowrap;
  }
}
</style>

<template>
  <el-tag v-if="row.threeDayFlag==1" effect="dark" style="background-color: #6d0295;border-color:#6d0295;margin-left:5px;" >三天货期</el-tag>
</template>

<script setup>
import { ElTag } from "element-plus";
const props = defineProps({
 name: {
   type: String,
   default: "structuralFollow",
 },
 id: {
   type: String,
   default: "",
 },
 row:{
   type:Object,
   default:()=>{
     return {}
   }
 }
});

</script>

<style>

</style>
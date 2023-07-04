<template>
   <el-tag v-if="row.followInfoFlag" effect="dark" type='warning' style="margin-left:5px;cursor: pointer;"  @click='showFollowInfoFlag'>{{type==='1'?'注意跟色跟样':'已登记跟样要求'}}</el-tag>
</template>

<script setup>
import { structuralFollow} from "@/api/structural/selfWork";
import { prepressFollow } from "@/api/prepress";
import { craftCheckFollow } from '@/api/craftCheck'
import { bulkorderFollow } from '@/api/outworkManage/outworkFileBench'
import { ElMessage,ElMessageBox,ElTag } from "element-plus";
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
  },
  type:{
    type: String,
    default: "1",
  }
});
function showFollowInfoFlag(){
  console.log(props)
  let obj = {
    structuralFollow,
    prepressFollow,
    craftCheckFollow,
    bulkorderFollow
  }
  let id = props.row.id
  if(props.name=='prepressFollow') id = props.row.activityId
  obj[props.name]({id}).then(res=>{
    if(res.code==200){
      // isShowFollowInfoFlag.value = true;
      // followInfo.value = res.data
      ElMessageBox({
        title:'跟色跟样信息',
        'showConfirmButton':false,
        "showCancelButton":true,
        'cancelButtonText':'关闭',
        // 'confirmButtonText':'关闭',
        callback(){

        },
        draggable:true,
        message:()=>{
          return h(
            'div',null,[
            h('div',{style:`border-left: 2px solid #ff3399;padding-left: 8px;margin-bottom: 10px ;font-size: 16px;`},'跟样类型'),
            h('div',{style:'padding-left: 8px;'},res.data.types.map(e =>{
              return h(ElTag,{effect:"dark",style:`margin:0 10px 10px 0;`}, { default: () => e })
            })),
            h('div',{style:`border-left: 2px solid #ff3399;padding-left: 8px;margin-bottom: 10px ;font-size: 16px;`},'跟样备注'),
            h('div',{style:'padding-left: 8px;'},h('span',null,res.data.remark)),
            ]
          )
        }
      })
    }else{
      ElMessage.error(res.msg)
    }
  })
}
</script>

<style>

</style>
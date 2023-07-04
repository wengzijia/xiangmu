<template>
    <el-link
                type="primary"
                :underline="false"
                class="mar_10"
                :disabled='props.row.status != 0'
                @click="receive"
                >领取</el-link
              >
</template>

<script setup>
import { ElMessage,ElMessageBox } from "element-plus";
let emits = defineEmits(['updatelist']);
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
  getTask:{
    type:Function,
    default:()=>{}
  }
});
const { proxy } = getCurrentInstance();
const receive = function(){
  ElMessageBox({
    title:'确定领取数码打印任务',
        'showConfirmButton':true,
        "showCancelButton":true,
        'cancelButtonText':'取消',
        'confirmButtonText':'确认领取',
        draggable:true,
        message:'领取后请及时完成任务，请勿长时间搁置',
        
  }).then(() => {
    proxy.$modal.loading('加载中，请稍候...')
    props.getTask(props.id).then(res=>{
      if(res.code==200){
        ElMessage({
          type: 'success',
          message: '成功领取任务',
        })
        emits('updatelist')
      }else{
        ElMessage({
          type: 'error',
          message: res.msg,
        })
        emits('updatelist')
      }
    }).catch(() => {
      ElMessage({
        type: 'error',
        message: '领取任务失败，请联系管理员',
      })
    }).finally(()=>{
      proxy.$modal.closeLoading()
    })
  })  
  .catch((error) => {
    console.log('error',error)
    ElMessage({
      type: 'info',
      message: '取消领取任务',
    })
  })
}
</script>

<style lang="scss" scoped>

</style>
<template>
 <div v-if="row.orderType=='3'">
                      <el-button
                        class="downBtn"
                        text
                        v-if="row.sendSampleStatus==1"
                        @click="getSuppliersFun"
                        >推送吸塑样品</el-button
                      >
                      <el-button
                        class="downBtn"
                        text
                        v-else-if="row.sendSampleStatus==2"
                        @click="cancelSendSampleFun"
                        >撤回产前样</el-button
                      >
                      <el-button
                        class="downBtn"
                        text
                        v-else-if="row.sendSampleStatus==3"
                        @click="finishFun"
                        >确认大货生产</el-button
                      > 
    <el-dialog v-model='isShowSuppliers' :modal-append-to-body="true" append-to-body width='800px' title='选择供应商，并确认' :before-close='closeFun'>
      <div class="blister-nato-dialog-box">
        <el-form>
          <el-form-item label='选择供应商：'>
            <el-radio-group v-model="suppliers" >
              <el-radio v-for="item in suppliersList" :key="item.id" :label="item.id" size="default" border>{{ item.shopname }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label='产前样数量：'>
            <el-input  v-model.number="sampleNum" :max='99999' :min='0'></el-input>
          </el-form-item>
      
        </el-form>
        <div style="text-align: right;">
              <el-button type='primary' @click="sendSampleFun">立即提交</el-button>
            </div>
  </div>
    </el-dialog>
   </div>
</template>

<script setup>
import { sendSample,cancelSendSample,finish } from "@/api/structural/selfWork";
import {
  getSuppliers
} from "@/api/structural/structuralList";

import { ElMessage, ElMessageBox } from "element-plus";
const props = defineProps({
  row:{
    type:Object,
    default:()=>{
      return {}
    }
  }
})
const emits = defineEmits();
let isShowSuppliers = ref(false)
let suppliersList = ref([])
let suppliers = ref('')
let sampleNum = ref(0)
/** 获取供应商 */
const getSuppliersFun  = function(){
  getSuppliers().then(res=>{
    if(res.code==200){
      suppliersList.value = res.data
      isShowSuppliers.value = true
    }else{
      ElMessage.error(res.msg)
    }
  })
}
/** 推送 */
const sendSampleFun = function(){
  if(suppliers.value==''){
    ElMessage.error('请选择选择供应商')
    return
  }
  if(sampleNum.value==''||!Number(sampleNum.value)>0){
    ElMessage.error('请输入产前样数量')
    return
  }
  if(Number(sampleNum.value)>99999){
    ElMessage.error('产前样数量过大')
    return
  }
  sendSample({
    "activityId": props.row.activityId,
    "sampleNum": sampleNum.value,
    "supplierIds": [suppliers.value]
  }).then(res=>{
    if(res.code==200){
      ElMessage.success('推送成功！')
      isShowSuppliers.value = false
      emits('updateList')
    }else{
      ElMessage.error(res.msg)
    }
  })
}

/** 未提交数据，阻止关闭 */
const closeFun = function(){
  ElMessageBox.confirm(
    '数据未保存，是否关闭?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      isShowSuppliers.value = false
    })
    .catch(() => {
     
    })
}
/** 退回产前样 */
const cancelSendSampleFun = function(){
  ElMessageBox.confirm(
    '确定要退回产前样吗?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      console.log('ddddd')
      cancelSendSample(props.row.activityId).then(res=>{
        if(res.code==200){
          ElMessage.success('成功撤回')
          emits('updateList')
        }else{
          ElMessage.error(res.msg)
        }
      })
    })
    .catch(() => {
     
    })
  
}
/** 客户已确认，完成结构工单 */
const finishFun = function(){
  if(!props.row.isUpload){
    ElMessage.error('请上传文件后再执行完成操作！')
    return
  }
  ElMessageBox.confirm(
    '请确认检查结构文件。操作立即生效是否继续？',
    '确定完成结构文件任务?',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      finish({ id: props.row.id }).then(res=>{
        if(res.code==200){
          ElMessage.success('确认成功')
          emits('updateList')
        }else{
          ElMessage.error(res.msg)
        }
      })
    })
    .catch(() => {
     
    })

}
</script>

<style lang="scss">
.blister-nato-dialog-box{
  .el-radio{
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
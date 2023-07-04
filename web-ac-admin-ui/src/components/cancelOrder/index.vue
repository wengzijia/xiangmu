<template>
  <el-table :data="revokeData" style="width: 100%;height: 500px;" ref="multipleTable">
    <el-table-column label="PO号" width="200">
      <template #default="scope">
        <div>{{ scope.row.poNo }}</div>
      </template>
    </el-table-column>
    <el-table-column label="撤单申请部门" width="130">
      <template #default="scope">
        <div>{{ scope.row.applyDept }}</div>
      </template>
    </el-table-column>
    <el-table-column label="申请人" width="130">
      <template #default="scope">
        <div>{{ scope.row.applyUser }}</div>
      </template>
    </el-table-column>
    <el-table-column label="申请时间" width="200">
      <template #default="scope">
        <div>{{ replaceT(scope.row.createTime) }}</div>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="120">
      <template #default="scope">
        <div>{{ statusMap[scope.row.status] }}</div>
      </template>
    </el-table-column>
     <el-table-column label="撤单备注" width="200">
      <template #default="scope">
        <!-- <div v-html="scope.row.remark"  @click="imgViewer"  class="remark"></div> -->
        <HtmlImaagePriview :html='scope.row.remark'></HtmlImaagePriview>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180" fixed="right">
      <template #default="scope">
        <div>
          <el-link
            type="primary"
            :underline="false"
            class="canMar_10"
            :disabled="revokeBtnDisabled(scope.row.status)"
            @click="
              isAgreeRevoke({
                data: scope.row,
                type: 1,
              })
            "
            >同意撤单</el-link
          >
          <!-- <el-link
            type="primary"
            :underline="false"     
            class="canMar_10"
            :disabled="revokeBtnDisabled(scope.row.status)"
            @click="
              isAgreeRevoke({
                data: scope.row,
                type: 2,
              })
            "
            >不同意</el-link
          > -->
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- 撤单消息分页 -->
</template>
<script setup>
import { toRefs } from 'vue';

const { proxy } = getCurrentInstance();
const props = defineProps({
  revokeData: {
    type: Array,
    default: null,
  },
  
});
const {revokeData} = toRefs(props)
const pageSize = ref(10);
const currentPage = ref(1);
let statusMap = {
  0: "待审批",
  1: "已同意",
  2: "不同意",
};
// 撤单消息按钮禁用
function revokeBtnDisabled(status) {
  // 待审核激活      0待审批，1已同意，2不同意
  if (status == 0) {
    return false;
  }
  return true;
}
function isAgreeRevoke(data){
proxy.$emit('getRevoke',data)
}
function replaceT(val){
      return val?.replace("T", " ");
}
const multipleTable = ref(null)
watch(revokeData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
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
<style scoped>
.canMar_10{
  margin-right:10px ;
}

</style>
<style >
  .remark img{
  width: 200px;
    display: block;
    margin: 10px;
}
.remark{
   word-break: break-all;
}
/* .remark p{
  word-break: break-all;
} */
</style>
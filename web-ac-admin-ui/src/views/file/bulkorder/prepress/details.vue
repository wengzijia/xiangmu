<template>
  <div>
    <el-card style="margin:10px">
      <div class="details-header flex-jc-sb">
        <div>
          <div>PO号: <b>{{details.poNo}}</b></div>
          <!-- <div style="font-size:14px;margin-top:4px;">下个状态:</div> -->
        </div>
        <h2><DictTag :value="details.status" :options="prepress_status"/></h2>
      </div>
      <div>
        <div class="content-head">
          <div>
            <div style="display: block;width:100%;">
              <div>订单号码: {{details.orderNo||'-'}}</div>
              <!-- <div>打样单号: {{details.proofNo||'-'}}</div> -->
            </div>
          </div>
          <div>推送印前时间:{{details.createTime||'-'}}</div>
          <div style="border:none;">业务员:{{details.salesman||'-'}}</div>
        </div>
        <div class="attribute">
          <div style="margin-bottom:10px;">参数详情:</div>
          <div>{{details.productAttr||'-'}}</div>
        </div>
        <div class="log">
          <el-table :data="details.logs" style="width: 100%">
            <el-table-column prop="opsName" label="操作人">
              <template #default="scope">
            <div>{{scope.row.opsName||'-'}}</div>
          </template>
            </el-table-column>
            <el-table-column prop="opsTime" label="操作时间" >
              <template #default="scope">
            <!-- <div>{{scope.row.opsTime||'-'}}</div> -->
              <span>{{parseDate(scope.row.opsTime)}}</span>
          </template>
            </el-table-column>
            <el-table-column prop="opsComment" label="操作内容" >
              <template #default="scope">
            <div>{{scope.row.opsComment||'-'}}</div>
          </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" >
              <template #default="scope">
            <div v-html="scope.row.remark || '-'" class="remark"  @click="imgViewer"></div>
          </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" ></el-image-viewer>
  </div>
</template>

<script setup>
import { getPrepressDetailById } from '@/api/prepress';
import { ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router';
import { parseDate } from "@/utils/index";
const { proxy } = getCurrentInstance();
const { prepress_status, } = proxy.useDict("prepress_status",);
const router = useRouter()
const route = useRoute()

const data = reactive({
  details: {}
})
const { details } = toRefs(data)
if (route.query.id) {
  getDetails()
}
function getDetails() {
  if (!route.query.id) {
    return
  }
  getPrepressDetailById(route.query.id).then(res => {
    if (res.code == 200) {
      details.value = res.data
    }
  })
}
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

<style lang="scss" scoped>
h2{
  padding-right: 20px;
}
.details-header {
  margin-bottom: 10px;
}

.content-head {
  display: flex;
  width: 100%;
  border: 1px solid var(--el-border-color);
  &>div {
    width: 33%;
    height: 100px;
    display: flex;
    padding-left: 16px;
    align-items: center;
    border-right: 1px solid var(--el-border-color);
  }
}

.flex-jc-sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.attribute {
  width: 100%;
  padding: 16px;
  margin-top: 20px;
  border: 1px solid var(--el-border-color);
}
.log{
  margin-top: 20px;
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
</style>
<template>
<div>
    <div class="top-bar">
      <div class="titleBox">
        <div class="detailText">正稿单详情：</div>
        <div class="status">
          <!-- {{detailData.status}} -->
          <DictTag :value="detailData.status" :options="ac_original_status"/>
        </div>
      </div>
    </div>
    <!-- 详情信息 -->
    <el-card style="margin:10px" class="detailsBox">
      <div class="detailsInfo">
        <!-- 单号 -->
        <div class="odd item">
          <div class="outworkOdd">正稿单号:{{detailData.taskNo}}</div>
          <div class="orderOdd">订单号码:{{detailData.orderNo}}</div>
          <!-- <div class="proofingOdd">打样编号:{{detailData.proofNo}}</div> -->
        </div>
        <!-- 正稿时间 -->
        <div class="outworkTime item">
          <div class="time">推送正稿时间:{{detailData.createTime}}</div>
        </div>
        <!-- 业务员 -->
        <div class="salesmanBox item">
          <div class="salesman">业务员:{{detailData.salesman}}</div>
        </div>
      </div>
    </el-card>
    <!-- 商品信息 -->
    <el-card style="margin:10px" class="infoBox">
        <div class="goodsInfo">
          <div>商品信息:</div>
          <div>{{detailData.productAttr}}</div>
        </div>
    </el-card>
    <!-- 历史时间线 -->
    <el-card style="margin:10px" class="historyTimeLineBox">
        <div class="historyTimeLine">
          <div class="text">历史时间线：</div>
          <el-table :data="detailData.designLogVOS" style="width: 100%">
            <el-table-column label="操作人">
              <template #default="scope">
                <div>{{scope.row.opsName}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作时间">
              <template #default="scope">
                <div>{{scope.row.opsTime}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作内容">
              <template #default="scope">
                <div>{{scope.row.opsComment}}</div>
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template #default="scope">
               <div v-html="scope.row.remark || '-'" class="remark" @click="imgViewer"></div>
              </template>
            </el-table-column>
          </el-table>
        </div>
    </el-card>
    <!-- 返回 -->
    <div style="text-align:center;"><el-button size="large" @click="backPage">返回</el-button></div>
    <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" ></el-image-viewer>
</div>
</template>
<script setup>
import {getDetail} from "@/api/outworkManage/outworkDetail"
const { proxy } = getCurrentInstance();
const { ac_original_status } = proxy.useDict("ac_original_status");
const router = useRouter()
const route = useRoute()
// 接受传过来的参数
let {taskId,menuName} = route.query
// 详情数据
let detailData = ref({})
// 详情列表数据
async function detailListData(id){
  let {code,data} = await getDetail({taskId:id})
  if(code === 200){
    detailData.value = data
  }
}
detailListData(taskId)
// 返回上个页面
const backPage = ()=>{
    if(menuName == '正稿文件列表'){
      router.replace({path: 'artwork'});
    }else if(menuName == '我的正稿文件列表'){
      router.replace({path: 'artworkList'});
    }
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
.top-bar {
  padding: 0 20px;
  .titleBox {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
}
// 详情信息
.detailsBox{
  .detailsInfo{
    display: flex;
    border: 1px solid #ccc;
    .item{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .outworkTime{
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
  }
}
// 商品信息
.infoBox{
  .goodsInfo{
    border: 1px solid #ccc;
  }
}
// 历史时间线
.historyTimeLineBox{
  .historyTimeLine{
    border: 1px solid #ccc;
  }
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
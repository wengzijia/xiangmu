<template>
  <div>
    <div class="top-bar">
      <div class="titleBox">
        <div>
          <div class="detailText">PO号:{{detailData.poNo}}</div>
          <!-- <div class="detailText">下个状态:{{detailData.nextNode || "-"}}</div> -->
        </div>

        <div class="status"><DictTag :value="detailData.status" :options="ac_structure_status"/></div>
      </div>
    </div>
    <!-- 详情信息 -->
    <el-card style="margin: 10px" class="detailsBox">
      <div class="detailsInfo">
        <!-- 单号 -->
        <div class="odd item">
          <div class="orderOdd">订单号码:{{ detailData.orderNo }}</div>
          <!-- <div class="proofingOdd">打样单号:{{ detailData.proofNo || "-"}}</div> -->
        </div>
        <!-- 正稿时间 -->
        <div class="outworkTime item">
          <div class="time">推送结构时间:{{ detailData.createTime }}</div>
        </div>
        <!-- 业务员 -->
        <div class="salesmanBox item">
          <div class="salesman">业务员:{{ detailData.salesman }}</div>
        </div>
      </div>
    </el-card>
    <!-- 商品信息 -->
    <el-card style="margin: 10px" class="infoBox">
      <div class="goodsInfo">
        <div class="goodsDetail">参数详情:</div>
        <div style="line-height:2">{{ detailData.productAttr }}</div>
      </div>
    </el-card>
    <!-- 历史时间线 -->
    <el-card style="margin: 10px" class="historyTimeLineBox">
      <div class="historyTimeLine">
        <el-table :data="detailData.historyLog" style="width: 100%">
          <el-table-column label="操作人" width="500">
            <template #default="scope">
              <div>{{ scope.row.opsName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作时间">
            <template #default="scope">
              <div>{{ scope.row.opsTime }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作内容">
            <template #default="scope">
              <div>{{ scope.row.opsComment }}</div>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="500">
            <template #default="scope">
              <div v-html="scope.row.remark || '-'" class="remark" @click="imgViewer"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" ></el-image-viewer>
  </div>
</template>
  <script setup>
import { getInfo } from "@/api/structural/structuralList";
import { useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
const {  ac_structure_status } = proxy.useDict(
  "ac_structure_status"
);
// 接受id参数
let { taskId, menuName } = route.query;
// 详情数据
let detailData = ref({});
// 详情列表数据
function getDetailList(id) {
  getInfo({ id: id }).then((res) => {
    if (res.code == 200) {
      if (res.data) {
        detailData.value = res.data;
      }
    } else {
    }
  });
}
getDetailList(taskId);
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
    align-items: center;
    .detailText {
      padding-top: 10px;
    }
    .status {
      color: #333;
      font-weight: 600;
      font-size: 21px;
    }
  }
}
// 详情信息
.detailsBox {
  .detailsInfo {
    display: flex;
    border: 1px solid #ccc;
    border-radius: 10px;
    // align-items: center;
    .item {
      flex: 1;
      padding: 10px;
    }
    .outworkTime {
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
  }
}
// 商品信息
.infoBox {
  .goodsInfo {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 16px;
    .goodsDetail {
      margin-bottom: 10px;
    }
  }
}
// 历史时间线
.historyTimeLineBox {
  .historyTimeLine {
    // border: 1px solid #ccc;
    // border-radius: 10px;
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
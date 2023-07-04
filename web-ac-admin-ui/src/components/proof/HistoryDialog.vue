<!-- 上下布局的el-card组件，内容通过插槽嵌入 -->
<template>
  <el-dialog v-model="historyShow" title="处理历史" :close-on-click-modal="false" destroy-on-close align-center
      width="auto" class="historyPopupBox" @close="closefn">
      <el-table :data="historyListData" style="width: 100%; height: 620px" row-key="startTime" v-if="type==1">
        <!-- <el-table-column label="PO号" width="200">
          <template #default="scope">
            <div>
              <span style="color: #303133; cursor: pointer" @click="jumpPage(scope.row.orderNo)">{{ scope.row.poNo
              }}</span>
              <el-icon style="color: #409eff; margin-left: 5px; cursor: pointer" v-if="scope.row.poNo"
                v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">
                <CopyDocument />
              </el-icon>
            </div>
            <div style="margin-top: 4px" v-if="scope.row.proofingType">
              <el-tag hit>{{ proofTypeMap[scope.row.proofingType] }}</el-tag>
            </div>
            <div style="margin-top: 4px" v-if="scope.row.productName">
              <el-tag hit>{{ scope.row.productName }}</el-tag>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="操作人" width="164">
          <template #default="scope">
            <div style="color: #303133">{{ scope.row.opsName||'-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="180">
          <template #default="scope">
            <div style="color: #303133">{{ scope.row.opsTime||'-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作内容" width="260">
          <template #default="scope">
            {{scope.row.opsComment||'-'}}
          </template>
        </el-table-column>
        <el-table-column label="备注" width="260">
          <template #default="scope">
            <div v-if="hideremark">
              <el-link type="primary" :underline="false">备注详情</el-link>
            </div>
            <div v-else>{{ scope.row.remark||'-' }}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="historyListData" style="width: 100%; height: 620px" row-key="startTime" v-else>
        <el-table-column label="PO号" width="200">
          <template #default="scope">
            <div>
              <span style="color: #303133; cursor: pointer" @click="jumpPage(scope.row.orderNo)">{{ scope.row.poNo
              }}</span>
              <el-icon style="color: #409eff; margin-left: 5px; cursor: pointer" v-if="scope.row.poNo"
                v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">
                <CopyDocument />
              </el-icon>
            </div>
            <div style="margin-top: 4px" v-if="scope.row.proofingType">
              <el-tag hit>{{ proofTypeMap[scope.row.proofingType] }}</el-tag>
            </div>
            <div style="margin-top: 4px" v-if="scope.row.productName">
              <el-tag hit>{{ scope.row.productName }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="处理节点" width="164">
          <template #default="scope">
            <div style="color: #303133">{{ scope.row.nodeName||'-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="推送时间" width="180">
          <template #default="scope">
            <div style="color: #303133">{{ scope.row.pushTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="领取时间" width="260">
          <template #default="scope">
            <template v-if="scope.row.nodeName != '打样发货'">
              <template v-if="scope.row.producerName && scope.row.startTime">
                <div style="color: #606266">领取人:</div>
                <div style="color: #303133">{{ scope.row.producerName }}</div>
                <div style="color: #606266">领取时间:</div>
                <div style="color: #303133">{{ scope.row.startTime }}</div>
              </template>
              <template v-else>
                <!-- <div>未领取</div> -->
                <div>-</div>
              </template>
            </template>
            <div v-if="scope.row.nodeName == '打样发货'">-</div>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="260">
          <template #default="scope">
            <div v-if="scope.row.producerName && scope.row.finishTime">
              <div style="color: #606266">提交人:</div>
              <div style="color: #303133">{{ scope.row.producerName }}</div>
              <div style="color: #606266">提交时间:</div>
              <div style="color: #303133">{{ scope.row.finishTime }}</div>
            </div>
            <div v-else>-</div>
            <!-- <div v-else>未提交</div> -->
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <div>{{ scope.row.status||'-' }}</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div class="laypage">
                <el-pagination v-model:current-page="historyParam.current" v-model:page-size="historyParam.size" background
                    layout="total, prev, pager, next" :total="historyTotal" />
            </div> -->
  </el-dialog>
</template>

<script setup>
import { BASE_FILE_URL } from "@/store/global-constant";
const props = defineProps({
    historyListData:{
        type:Array,
        default:[]
    },
    historyShow:{
        type:Boolean,
        default:false
    },
    type:{
      type:String,
      default:1
    },
    hideremark:{
      type:Boolean,
      default:false
    }
    // fileurl:{
    //     type:String,
    //     default:''
    // }
})
const emits = defineEmits(['update:historyShow']);
let proofTypeMap = {
  1: "用户打样",
  2: "原创设计打样",
  3: "大货适配打样",
  4: "设计制作打样",
  5: "内部打样",
  6: "大货下单打样",
  7: "精装盒内部",
  8: "精装盒大货",
  9: "精装盒原创设计",
};
const jumpPage = (id) => {
  window.open(
    `${window.origin}/admin/design_demand/detail.html?id=${id}`,
    "_blank"
  );
};
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}
const closefn = () =>{
  emits("update:historyShow", false);
}

</script>

<style lang="scss" scoped>
.historyPopupBox {
    .laypage {
      position: relative;
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
</style>

<template>
  <div class="proofWorkorder">
    <listLayout>
      <template #header>
        <div class="filterContainer">
          <el-form :inline="true" :model="listParam" class="filterForm" ref="workOrderFormRef" label-width="96px">
            <el-form-item label="PO号" prop="poNo">
              <el-input v-model="listParam.poNo" placeholder="请输入" clearable />
            </el-form-item>
            <!-- <el-form-item label="盒型类型" prop="poNo">
                        <el-select v-model="listParam.holdType" placeholder="全部">
                            <el-option label="Zone one" value="shanghai" />
                            <el-option label="Zone two" value="beijing" />
                        </el-select>
                    </el-form-item> -->
            <el-form-item label="业务员" prop="salesman">
              <el-input v-model="listParam.salesman" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="推送打样日期">
              <el-date-picker v-model="proofDate" type="daterange" start-placeholder="开始日期" range-separator="至"
                end-placeholder="结束日期" value-format="YYYY-MM-DD" :disabled-date="disabledDate" />
            </el-form-item>
            <el-form-item label="当前节点" prop="currentNodeId">
              <el-select v-model="listParam.currentNodeId" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option v-for="item in proof_current_node" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="当前领取人" prop="producerId">
              <el-select v-model="listParam.producerId" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option v-for="item in receiverList" :key="item.userId" :label="item.nickName" :value="item.userId" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="最近领取日期" prop="poNo">
                        <el-date-picker v-model="receiveDate" type="daterange" start-placeholder="开始日期" range-separator="至"
                            end-placeholder="结束日期" value-format="YYYY-MM-DD"
                            :disabled-date="disabledDate" />
                    </el-form-item> -->
            <el-form-item label="状态" prop="status">
              <el-select v-model="listParam.status" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option v-for="item in proof_workOrder_status" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item>
                        <el-button type="primary" @click="onSubmit">搜索</el-button>
                        <el-button type="default" @click="onSubmit">重置</el-button>
                    </el-form-item> -->
          </el-form>
          <div class="btnBox">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="default" @click="reset">重置</el-button>
          </div>
        </div>
      </template>
      <template #table-header>
        <div class="headBox">
          <div class="listText">打样工单列表</div>
          <span>
            <el-button @click="materialDialog = true">导出用料数据</el-button>
            <el-button @click="openPopup(1)">导出作业数据</el-button>
          </span>
        </div>
      </template>
      <template #table-content='tableHeight'>
        <div class="proofTable">
          <el-table :data="workOrderListData" :height='tableHeight.tableHeight' row-key="activityId">
            <el-table-column label="PO号" width="210">
              <template #default="scope">
                <div class="poContainer">
                  <div class="poBox">
                    <span class="poHao" @click="jumpPage(scope.row.orderNo)">{{
                      scope.row.poNo
                    }}</span>
                    <!-- 需要再el-table标签上绑定key  row-key="activityId" 不然复制会有问题 -->
                    <el-icon class="copy" v-if="scope.row.poNo" v-copyText="scope.row.poNo"
                      v-copyText:callback="copyTextSuccess">
                      <CopyDocument />
                    </el-icon>
                  </div>
                  <div style="margin-top: 4px">
                    <el-tag hit>{{
                      proofTypeMap[scope.row.proofingType]
                    }}</el-tag>
                  </div>
                  <div style="margin-top: 4px">
                    <el-tag hit>{{ scope.row.productName }}</el-tag>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="打样工单参数">
              <template #default="scope">
                <div class="paramBox">
                  <!-- <div style="color:#606266;">品类:</div>
                                <div style="color: #303133;">吸塑内托</div> -->
                  <div class="parameterlay">
                    <!-- {{ addLineFeed(scope.row.productAttr) }} -->
                    <OrderAttrShow class="parameterlay" :attr="scope.row.productAttr" :activityId="scope.row.activityId"
                      type="proofWorkorder"
                      :lineFeed="(scope.row.productName && !(scope.row.productName.indexOf('精装盒') != -1 || scope.row.productName.indexOf('双驳盒') != -1))">
                    </OrderAttrShow>

                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="业务员" width="180">
              <template #default="scope">
                <p v-show="scope.row.salesman">
                  <span class="TimeTitle">业务员：</span><br />
                  <span class="TimeCon">{{ scope.row.salesman || "-" }}</span>
                </p>
                <p v-show="scope.row.pushTime">
                  <span class="TimeTitle">推送打样时间：</span>
                  <br />
                  <span class="TimeCon">{{ scope.row.pushTime || "-" }}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="文件下载">
              <template #default="scope">
                <template v-if="scope.row.files.length > 0">
                  <div class="fileDownload" v-for="(item, index) in scope.row.files" :key="index">
                    <div class="title">{{ item.fileType }}：</div>
                    <div class="name">
                      <a :href="senseUrl(BASE_FILE_URL + item.fileAddress)" target="_blank">{{ item.fileName }}</a>
                    </div>
                  </div>
                </template>
                <div v-else>未上传</div>
              </template>
            </el-table-column>
            <el-table-column label="当前节点" width="160">
              <template #default="scope">
                <DictTag :value="scope.row.currentNodeId" :options="proof_current_node" style="font-weight: 700" />
                <template v-if="scope.row.currentNodeId != '7'">
                  <template v-if="scope.row.producerName && scope.row.startTime">
                    <div style="color: #606266">领取人:</div>
                    <div style="color: #303133">{{ scope.row.producerName }}</div>
                    <div style="color: #606266">领取时间:</div>
                    <div style="color: #303133">{{ scope.row.startTime }}</div>
                  </template>
                  <template v-else>
                    <div>未领取</div>
                  </template>
                </template>
                <div v-if="scope.row.currentNodeId == '7'">-</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="160">
              <template #default="scope">
                <el-tag hit :type="statusColorMap[scope.row.status]">{{
                  statusMap[scope.row.status]
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
              <template #default="scope">
                <div style="color: #409eff; cursor: pointer" @click="openPopup(2, scope.row.activityId)">
                  处理历史
                </div>
                <!-- 进行中才显示 -->
                <div style="color: #409eff; cursor: pointer" v-if="scope.row.status == 0"
                  @click="openPopup(3, scope.row.activityId, scope.row.orderNo, scope.row.poNo)">
                  撤销打样
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
        </div>
      </template>
      <template #pagination>
        <div class="laypage">
          <el-pagination v-model:current-page="listParam.current" v-model:page-size="listParam.size" background
            layout="total, prev, pager, next" :total="total" />
        </div>
      </template>
    </listLayout>

    <!-- 历史弹窗 -->
    <HistoryDialog v-if="historyDialog" :historyListData="historyListData" type="2" v-model:historyShow="historyDialog" />
    <!-- 弹窗 -->
    <el-dialog v-model="showDialog" :title="popupStatus == 1 ? '选择要导出的打样作业的起止日期' : '提示'" width="25%"
      :close-on-click-modal="false" destroy-on-close @close="closePopup">
      <div v-if="popupStatus == 1">
        <el-form ref="exportFormRef" :model="exportParam" :rules="exportRules" status-icon>
          <el-form-item label="起止日期" prop="startStopDate">
            <el-date-picker v-model="exportParam.startStopDate" type="datetimerange" start-placeholder="开始日期"
              range-separator="至" end-placeholder="结束日期" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="defaultTime" />
          </el-form-item>
        </el-form>
      </div>
      <div v-if="popupStatus == 3">确认撤销打样工单PO{{ withdrawParam.poNo }}，撤回至推送打样前吗？</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closePopup">取消</el-button>
          <el-button type="primary" @click="commit(exportFormRef)">
            确定提交
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="materialDialog" title="导出用料" width="560px"
      :close-on-click-modal="false" destroy-on-close >
      <div>
        <el-form ref="materialsRef" :model="materialParam" status-icon>
          <el-form-item label="选择要导出的表格日期" prop="exportDate" :rules="[
            {
              required: true,
              message: '请选择要导出的表格日期',
              trigger: ['blur', 'change'],
            },
          ]">
            <el-date-picker v-model="materialParam.exportDate" type="daterange" start-placeholder="开始日期"
              range-separator="至" end-placeholder="结束日期" 
              :default-time="defaultTime"
               />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="materialDialog = false">取消</el-button>
          <el-button type="primary" @click="exportMaterials">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 域名
import { BASE_FILE_URL } from "@/store/global-constant";
import { formatDates, senseUrl } from "@/utils/index";
import { parseTime } from '@/utils/ruoyi'
import { getDeptUser } from "@/api/system/user";
import OrderAttrShow from "@/components/OrderAttrShow/order.vue"
import {
  getWorkorderList,
  getHistoryList,
  violentWithdrawal,
  exportProofOrderList,
  exportMaterialsList
} from "@/api/proofWorkorder/index";
import { ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();
const { proof_current_node, prepress_department, proof_workOrder_status } =
  proxy.useDict(
    "proof_current_node",
    "prepress_department",
    "proof_workOrder_status"
  );
// 领取人列表
let receiverList = ref([]);
let workOrderFormRef = ref();

const data = reactive({
  materialParam:{
    date:[]
  }
})
const {materialParam} = toRefs(data)
const materialDialog = ref(false)//导出用料弹窗

const deptId = ref("");
watch(prepress_department, (val) => {
  deptId.value = val.find((item) => {
    return item.label == "masterList";
  }).value;
  receive();
});
if (prepress_department.value.length > 0) {
  deptId.value = prepress_department.value.find((item) => {
    return item.label == "masterList";
  }).value;
  receive();
}
// 获取领取人
async function receive() {
  if (!deptId.value) {
    return;
  }
  let { code, data } = await getDeptUser({ deptId: deptId.value });
  if (code === 200) {
    receiverList.value = data;
  }
}

// 默认时分秒格式
const defaultTime = [
  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
] // '00:00:00', '23:59:59'

// 时间限制
let disabledDate = (time) => {
  return (
    time.getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000 ||
    time.getTime() > new Date().getTime()
  );
};
// 推送打样日期
let proofDate = ref([
  formatDates(new Date().getTime() - 3600 * 1000 * 24 * 7),
  formatDates(new Date().getTime()),
]);
// 领取日期
// let receiveDate = ref([formatDates(new Date().getTime() - 3600 * 1000 * 24 * 7), formatDates(new Date().getTime())])
// 总数
let total = ref(0);
// 列表参数
let listParam = reactive({
  poNo: "", // po号
  salesman: "", // 业务员
  producerId: "", // 领取人ID
  currentNodeId: "", // 当前节点ID
  status: "0", // 状态
  startPushTime: proofDate.value[0] + " 00:00:00", // 推送开始时间
  endPushTime: proofDate.value[1] + " 23:59:59", // 推送结束时间
  current: 1, // 页数
  size: 10, // 每页条数
});
// 历史参数
let historyParam = reactive({
  activityId: "",
  // current: 1, // 页数
  // size: 10, // 每页条数
});
// 打样部强制撤回参数
let withdrawParam = reactive({
  activityId: "", // 流程ID
  orderNo: "", // 订单编号
  poNo: "", // po号
});
// 历史弹窗
let historyDialog = ref(false);
// 历史总数
// let historyTotal = ref(0)
// 是否显示弹窗
let showDialog = ref(false);
// 弹窗状态 1 导出作业数据  2 处理历史  3 撤销打样
let popupStatus = ref(1);
// 导出ref
let exportFormRef = ref()
// 导出表单校验
let exportRules = reactive({
  startStopDate: [{
    required: true,
    message: '请选择日期时间',
    trigger: 'change',
  }]
})
// 导出参数
let exportParam = reactive({
  startStopDate: [], // 起止日期
  finishTimeStart: "", // 完成时间开始时间
  finishTimeEnd: "" // 完成时间结束时间
})
// 工单列表数据
let workOrderListData = ref([]);
// 打样类型处理
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
// 状态处理
let statusMap = {
  0: "进行中",
  1: "已完成",
  2: "已中止",
};
// 状态颜色处理
let statusColorMap = {
  0: "",
  1: "success",
  2: "danger",
};
// 历史列表数据
let historyListData = ref([]);

// 设置时间
function setTime() {
  listParam.startPushTime =
    proofDate.value?.length > 0 ? proofDate.value[0] + " 00:00:00" : "";
  listParam.endPushTime =
    proofDate.value?.length > 0 ? proofDate.value[1] + " 23:59:59" : "";
}

// 设置导出时间
function setExportTime() {
  if (exportParam.startStopDate?.length > 0) {
    exportParam.finishTimeStart = exportParam.startStopDate[0]
    exportParam.finishTimeEnd = exportParam.startStopDate[1]
  } else {
    exportParam.finishTimeStart = ""
    exportParam.finishTimeEnd = ""
  }
}

// 获取工单列表
const workOrderList = () => {
  getWorkorderList(listParam)
    .then((res) => {
      console.log("res", res);
      if (res.code == "200") {
        workOrderListData.value = res.data.records;
        total.value = res.data.total;
      } else {
        ElMessage({
          message: res.msg,
          type: "error",
        });
      }
    })
    .catch((err) => {
      console.log("报错了", err);
    });
};

workOrderList();

// 获取历史列表
const historyList = () => {
  getHistoryList(historyParam)
    .then((res) => {
      if (res.code == "200") {
        historyListData.value = res.data;
      } else {
        ElMessage({
          message: res.msg,
          type: "error",
        });
      }
    })
    .catch((err) => {
      console.log("报错了", err);
    });
};

// 打样部强制撤回
const withdraw = () => {
  violentWithdrawal(withdrawParam)
    .then((res) => {
      if (res.code == "200") {
        ElMessage({
          message: res.msg || '撤回成功',
          type: "success",
        });
        workOrderList();
      } else {
        ElMessage({
          message: res.msg,
          type: "error",
        });
      }
      showDialog.value = false
    })
    .catch((err) => {
      console.log("报错了", err);
      showDialog.value = false
    });
};

function addLineFeed(str) {
  let newStr = "";
  if (str) {
    newStr = str.replace(/;/g, "\n");
  } else {
    newStr = str;
  }
  return newStr;
}

/** 复制代码成功 */
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}

// 搜索
const search = () => {
  setTime();
  workOrderList();
};

// 重置
const reset = () => {
  workOrderFormRef.value.resetFields();
  proofDate.value = [
    formatDates(new Date().getTime() - 3600 * 1000 * 24 * 7),
    formatDates(new Date().getTime()),
  ];
  setTime();
  workOrderList();
};
// 监听页数改变
watch(
  () => listParam.current,
  (val, oldval) => {
    workOrderList();
  }
);

// watch(()=>historyParam.current, (val,oldval) => {
//     historyList()
// })

// 打开弹窗
const openPopup = (status, id, orderNo, poNo) => {
  popupStatus.value = status;
  // 1 导出作业数据  2 处理历史  3 撤销打样
  if (status == 1) {
    showDialog.value = true;
  } else if (status == 2) {
    historyDialog.value = true;
    historyParam.activityId = id;
    historyList();
  } else if (status == 3) {
    showDialog.value = true;
    withdrawParam.activityId = id;
    withdrawParam.orderNo = orderNo;
    withdrawParam.poNo = poNo;
  }
};
// 关闭弹窗
const closePopup = () => {
  if (popupStatus.value == 1) {
    exportFormRef.value.resetFields();
  }
  showDialog.value = false;
};

// 跳转页面
const jumpPage = (id) => {
  window.open(
    `${window.origin}/admin/design_demand/detail.html?id=${id}`,
    "_blank"
  );
};

function exportExcel() {
  if (!workOrderListData.value?.length) {
    ElMessage.error('暂无数据导出')
    return
  }
  let param = {
    finishTimeStart: exportParam.finishTimeStart,
    finishTimeEnd: exportParam.finishTimeEnd
  }
  return exportProofOrderList(param, `打样作业数据导出-${parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')}.xlsx`)
}
// 提交事件
const commit = (formEl) => {
  if (popupStatus.value == 1) {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
      if (valid) {
        setExportTime()
        exportExcel()?.finally(() => {
          exportFormRef.value.resetFields()
          showDialog.value = false;
        })
      } else {
        console.log('error submit!', fields)
      }
    })
  } else {
    withdraw()
  }
}
//导出用料
function exportMaterials(){
  proxy.$refs["materialsRef"].validate((valid,fi) => {
      if (valid) {
        let param = {
          startTime: parseTime(materialParam.value.exportDate[0],'{y}-{m}-{d}'+' 00:00:00'),
          endTime: parseTime(materialParam.value.exportDate[1],'{y}-{m}-{d}'+' 23:59:59')
        }
        exportMaterialsList(param,`用料数据导出-${parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')}.xlsx`)
      } else {
        console.log('error submit!',fi)
      }
    })
}
</script>

<style lang="scss" scoped>
.proofWorkorder {
  // height: calc(100vh - 50px);
  // display: flex;
  // flex-direction: column;
  // overflow: hidden;

  .listText{
    font-weight: 600;
  }
  .filterContainer {
    display: flex;

    .filterForm {
      // &:deep(.el-form-item__label) {
      //   font-weight: Hweight;
      //   color: #303133;
      // }

      &:deep(.el-input) {
        width: 264px;
      }

      &:deep(.el-date-editor) {
        width: 264px;
      }

      &:deep(.el-form-item) {
        margin-right: 16px;
      }

      &:deep(.el-form-item:last-child) {
        margin-right: 0px;
      }

      &:deep(.el-button:first-child) {
        margin-left: 0px;
      }

      &:deep(.el-button) {
        margin-left: 6px;
      }
    }

    .btnBox {
      display: flex;
      align-items: flex-end;
      margin-bottom: 18px;
    }
  }


  .listText{
    font-weight: 600;
  }

  .headBox {
    display: flex;
    justify-content: space-between;
  }

  .proofTable {
    margin-top: 16px;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .poContainer {
      .poBox {
        .poHao {
          color: #303133;
          font-size: 14px;
          cursor: pointer;
        }

        .copy {
          color: #409eff;
          margin-left: 4px;
          cursor: pointer;
        }
      }
    }

    .paramBox {
      display: flex;
      font-size: 14px;
    }

    .fileDownload {
      display: flex;

      .title {
        color: #606266;
      }

      .name {
        color: #409eff;
        text-decoration: underline;
        cursor: pointer;
        flex: 1;
      }
    }
  }



  // 历史弹窗
  .historyPopupBox {
    .laypage {
      position: relative;
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
}
</style>
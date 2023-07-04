<template>
  <div>
    <listLayout>
      <template #header>
        <div>
          <div class="top-bar">
            <el-form
              :inline="true"
              :model="termParams"
              class="demo-form-inline filterForm"
              label-width="120px"
              ref="formRef"
            >
              <el-form-item label="PO号" prop="poNo">
                <el-input
                  v-model.trim="termParams.poNo"
                  placeholder="请输入PO号"
                  clearable
                  class="headerinp"
                />
              </el-form-item>
              <el-form-item label="结构状态" prop="status">
                <el-select
                  v-model="termParams.status"
                  placeholder="所有状态"
                  clearable
                  class="headerinp"
                >
                  <el-option label="未领取" :value="1" />
                  <el-option label="已领取" :value="2" />
                  <el-option label="被驳回" :value="4" />
                  <el-option label="已撤回" :value="9" />
                </el-select>
              </el-form-item>
              <el-form-item label="业务员" prop="salesman">
                <el-input
                  v-model.trim="termParams.salesman"
                  placeholder="请输入业务员名称"
                  clearable
                  class="headerinp"
                />
              </el-form-item>
            </el-form>
            <div class="form-tool-bar">
              <div style="min-width: 160px; width: 160px">
                <el-button @click="resetFormParams">重置</el-button>
                <el-button type="primary" @click="search">搜索</el-button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #table-header>
        <div class="top-bar">
          <div class="titleBox">
            <div class="listText">
              打样结构工作台
              <el-badge :value="revokeMsgCount||0" :max="99" class="msgbtn" @click="isRevokeShow = true">
                <el-button type="warning">撤单消息</el-button>
              </el-badge>
            </div>
            <div class="disposeBox">
              <Counter :processing="processing" :toBeProcessed="pending"/>
            </div>
            
            <!-- <div class="message" style="font-size:16px;" > -->
              <!-- 撤单消息(<span v-if="!revokeMsgCount">0</span>
              <el-badge is-dot class="item" v-if="revokeMsgCount > 0">{{
                revokeMsgCount
              }}</el-badge
              >) -->
              
            <!-- </div> -->
            <!-- <el-button class="getTask" type="primary" @click="receiveTask"
            >领取任务</el-button
          > -->
          </div>
        </div>
      </template>
      <!--结构文件列表  -->
      <template #table-content="tableHeight">
        <div class="outworkListBox">
          <el-table
            :data="tableData"
            :height="tableHeight.tableHeight"
            scrollbar-always-on
            row-key="id"
            ref="multipleTable"
          >
            <el-table-column label="PO号" width="300">
              <template #default="scope">
                <div>
                  <!-- <span class="turn" v-if="scope.row.orderFlag == 1">翻</span> -->
                  <!-- <span>{{ scope.row.poNo || "-" }}</span>
                <el-icon
                  v-copyText="scope.row.poNo"
                  v-copyText:callback="copyTextSuccess"
                  v-if="scope.row.poNo"
                  class="gesture"
                >
                  <CopyDocument />
                </el-icon> -->
                  <poView :po-no="scope.row.poNo"></poView>
                  <div style="display: flex">
                    <div v-for="(item, index) in ac_proof_type" :key="index">
                      <el-tag
                        class="mx-1"
                        hit
                        v-if="item.value == scope.row.proofingType"
                      >
                        {{ item.label }}
                      </el-tag>
                    </div>
                    <el-tag
                      effect="dark"
                      style="margin-left: 5px; cursor: pointer"
                      @click="seeNote(scope.row.combinationInformation)"
                      >组合信息</el-tag
                    >
                    <el-tag
                      style="margin-left: 5px"
                      v-if="scope.row.transfer == '是'"
                      effect="dark"
                      >转单</el-tag
                    >
                  </div>
                  <!-- <div
                    style="margin-top: 5px"
                    v-if="scope.row.allowModificationOfDie"
                  >
                    <el-tag hit class="mx-1">
                      {{
                        scope.row.allowModificationOfDie == 1 ? "允" : "不"
                      }}许对设计文件、刀模文件进行生产规范化修正
                    </el-tag>
                  </div> -->
                  <div style="margin-top: 5px">
                    <el-tag hit>{{ scope.row.productName }}</el-tag>
                    <followInfoFlag
                      :row="scope.row"
                      name="structuralFollow"
                    ></followInfoFlag>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="工单参数">
              <template #default="scope">
                <OrderAttrShow
                  :attr="scope.row.productAttr"
                  :activityId="scope.row.id"
                  type="structure"
                  :lineFeed="
                    scope.row.productName &&
                    !(
                      scope.row.productName.indexOf('精装盒') != -1 ||
                      scope.row.productName.indexOf('双驳盒') != -1
                    )
                  "
                ></OrderAttrShow>
                <!-- <div>
                <el-link
                  @click="seeAll(scope.row.productAttr)"
                  :underline="false"
                >
                  <span class="property">{{
                    scope.row.productAttr || "-"
                  }}</span> 
                </el-link>
              </div> -->
              </template>
            </el-table-column>
            <el-table-column label="业务员">
              <template #default="scope">
                <p v-show="scope.row.salesman">
                  <span class="TimeTitle">业务员：</span><br/>
                  <span class="TimeCon">{{ scope.row.salesman || "-" }}</span>
                </p>
                <p v-show="scope.row.createTime">
                  <span class="TimeTitle">推送结构时间</span>
                  <br/>
                  <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                </p>
                <!-- <div>推送人：{{ scope.row.fileSender || "-" }}</div> -->
              </template>
            </el-table-column>
            
            <el-table-column label="文件下载" width="380">
              <template #default="scope">
                <!-- <div v-if="scope.row.customerFiles?.length > 0">
                  <template
                    v-for="(item, index) in scope.row.customerFiles"
                    :key="index"
                  >
                    <el-popover
                      placement="top-start"
                      trigger="hover"
                      :content="item.fileName"
                    >
                      <template #reference>
                        <div
                          class="text-overflow"
                          style="width: 180px"
                          @click="openFile(item.fileAddress)"
                        >
                          <span v-if="scope.row.customerFiles.length > 1"
                            >部件{{ toChineseNumber(index + 1) }}:</span
                          >
                          {{ item.fileName }}
                          <div style="font-size: 13px; color: #409eff">
                            {{ item.uploadTime }}
                          </div>
                        </div>
                      </template>
                    </el-popover>
                  </template>
                </div> -->
                <div v-if="scope.row.customerFiles?.length > 0">
                  <template
                    v-for="(item, index) in scope.row.customerFiles"
                    :key="index"
                  >   
                    <span v-if="scope.row.customerFiles.length > 1">部件{{ toChineseNumber(index + 1) }}:</span>
                    <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                  </template>
                </div>
                <!-- <div v-else>-</div> -->
              </template>
            </el-table-column>
            <!-- <el-table-column label="数量">
              <template #default="scope">
                <div>{{ scope.row.productNumber || "-" }}</div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="商品名称" width="200">
            <template #default="scope">
              <div>{{ scope.row.productName || "-" }}</div>
            </template>
          </el-table-column> -->
            <!-- <el-table-column label="组合信息" width="200">
            <template #default="scope">
              <div >
                <el-link
                  @click="seeNote(scope.row.combinationInformation)"
                  :underline="false"
                  type="primary"
                  :disabled="!scope.row.combinationInformation"
                >
                  查看
                </el-link>
              </div>
          
            </template>
          </el-table-column> -->
            
            
            <!-- <el-table-column label="文件推送人" width="90">
            <template #default="scope">
              <div>
                {{ scope.row.fileSender || "-" }}
              </div>
            </template>
          </el-table-column> -->
            <!-- <el-table-column label="设计正稿文件" width="200">
            <template #default="scope">
              <div v-if="scope.row.originalDTO" class="gesture">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  v-for="(item, index) in scope.row.originalDTO.annexes"
                  :key="item.fileAddress"
                  :content="item.fileName"
                >
                  <template #reference>
                    <div
                      class="text-overflow gesture"
                      style="width: 180px"
                      @click="openFile(item.fileAddress)"
                    >
                      <span v-if="scope.row.originalDTO.annexes.length > 1"
                        >部件{{ toChineseNumber(index + 1) }}:</span
                      >
                      {{ item.fileName }}
                    </div>
                  </template>
                </el-popover>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column> -->

            <!-- <el-table-column label="是否转单" width="200">
            <template #default="scope">
              <div>{{ scope.row.transfer || "-" }}</div>
            </template>
          </el-table-column> -->
            <!-- <el-table-column label="转单备注" width="200">
            <template #default="scope">
              <div v-if="!scope.row.transferRemark">-</div>
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="scope.row.transferRemark"
                popper-class="popper_note"
                v-if="scope.row.transferRemark"
              >
                <template #reference>
                  <div class="text-overflow" style="width: 153px">
                    {{ scope.row.transferRemark }}
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column> -->
            <!-- <el-table-column label="正稿备注" width="200">
            <template #default="scope">
              <div v-if="scope.row.originalDTO">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="scope.row.originalDTO.originalRemark"
                  v-if="scope.row.originalDTO.originalRemark"
                  popper-class="popper_note"
                >
                  <template #reference>
                    <div class="text-overflow" style="width: 300px">
                      {{ scope.row.originalDTO.originalRemark }}
                    </div>
                  </template>
                </el-popover>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column> -->
            <el-table-column label="工单状态">
              <template #default="scope">
                <div>
                  <DictTag :value="scope.row.status" :options="ac_structure_status"/>
                </div>
                <!-- <div>
                  <div>推送结构时间:</div>
                  {{ scope.row.createTime || "-" }}
                </div> -->
              </template>
            </el-table-column>
            <!-- <el-table-column label="客户源文件上传时间" width="200">
            <template #default="scope">
              <div v-if="scope.row.customerFiles.length > 0">
                {{ scope.row.customerFiles[0].uploadTime }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column> -->
            <!-- <el-table-column label="推送结构时间" width="200">
            <template #default="scope">
              <div>{{ scope.row.createTime || "-" }}</div>
            </template>
          </el-table-column> -->

          <el-table-column label="备注">
              <template #default="scope">
                <div>
                  <RemarkDialog
                    :order="scope.row"
                    type="structure"
                    :proxyType="ac_remark_type"
                    @changeRemark="changeRemark"
                  />
                </div>
                <div>
                  <el-link
                    v-if="
                      scope.row.transfer == '是' && scope.row.transferRemark
                    "
                    type="primary"
                    :underline="false"
                    @click="showAttr(scope.row.transferRemark)"
                    >转单备注</el-link
                  >
                </div>
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <div class="operate">
                  <template v-if="scope.row.status != 1">
                    <p>
                      <el-link
                        type="primary"
                        :underline="false"
                        class="mar_10"
                        @click="uploadOutwork(scope.row)"
                        >上传结构</el-link
                      >
                    </p>
                    <p>
                      <el-link
                        type="primary"
                        :underline="false"
                        class="mar_10"
                        :disabled="!scope.row.isUpload"
                        @click="done(scope.row.id, scope.row.activityId)"
                        >完成</el-link
                      >
                    </p>
                    
                  </template>
                  <p v-if="scope.row.status == 1">
                    <el-link
                      type="primary"
                      :underline="false"
                      class="mar_10"
                      @click="receiveTask(scope.row.id)"
                      >领取</el-link
                    >
                  </p>
                  <p>
                    <el-link
                      type="primary"
                      :underline="false"
                      class="mar_10"
                      >
                      <!-- @click="reject(scope.row.id, scope.row.poNo)" -->
                      <rejectDialog :activityId="scope.row.activityId" @callBack="refusalAffirm" :scope="scope.row"/>
                      </el-link
                    >
                  </p>
                  <div v-if="scope.row.status != 1">
                      <el-link
                        type="primary"
                        :underline="false"
                        class="mar_10"
                        @click="transferSheet(scope.row.id)"
                        >转移处理人</el-link
                      >
                  </div>
                  <!-- <el-popover placement="bottom" width="300px;" trigger="click" v-if="false">
                    <template #reference>
                      <el-button size="small" style="margin-left: 10px">
                        <el-icon>
                          <More />
                        </el-icon>
                      </el-button>
                    </template>
                    <div class="downBoX">
                      <div>
                        <el-button
                          class="downBtn"
                          text
                          @click="reject(scope.row.id, scope.row.poNo)"
                          >驳回</el-button
                        >
                      </div>
                      <div v-if="scope.row.status != 1">
                        <el-button
                          class="downBtn"
                          text
                          @click="transferSheet(scope.row.id)"
                          >转移处理人</el-button
                        >
                      </div>
                    </div>
                  </el-popover> -->
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template #pagination>
        <!-- 工作台分页 -->
        <div class="prooflaypage">
          <pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            v-model:page="termParams.current"
            @pagination="handleSizeChange(1)"
            :total="total"
            v-model:limit="termParams.size"
            :pageSizes="[10, 20, 50, 100]"
          />
        </div>
      </template>
    </listLayout>
    <!-- 撤单消息弹窗 -->
    <div class="revokeMessage">
      <el-dialog v-model="isRevokeShow" title="撤单消息" width="1200px">
        <!-- 撤单消息列表 -->
        <cancelOrder
          :revokeData="revokeData"
          @getRevoke="getRevoke"
        ></cancelOrder>
        <div>
          <pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            v-model:page="revokeParams.current"
            @pagination="handleSizeChange(2)"
            :total="revokeTotal"
            v-model:limit="revokeParams.size"
            :pageSizes="[10, 20, 50, 100]"
          />
        </div>
        <!-- <div class="alignRight" style="padding-top: 20px">
          <el-button type="primary" @click="isRevokeShow = false"
            >关闭</el-button
          >
        </div> -->
      </el-dialog>
    </div>
    <!-- 信息组合弹框 -->
    <div class="is-align-center">
      <el-dialog v-model="isNoteShow" title="信息组合" width="600px">
        <div style="line-height: 2">{{ NoteContent }}</div>
        <template #footer>
          <span>
            <el-button type="primary" @click="isNoteShow = false"
              >关闭</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 属性弹框 -->
    <div class="is-align-center">
      <el-dialog v-model="isAttrShow" title="属性详情" width="600px">
        <div style="line-height: 2">{{ attrContent }}</div>
        <template #footer>
          <span>
            <el-button type="primary" @click="isAttrShow = false"
              >关闭</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 完成任务弹窗 -->
    <div class="doneTask">
      <el-dialog
        v-model="isDoneTaskShow"
        title="确定完成结构文件任务？"
        width="600px"
      >
        <div>请确认检查结构文件。操作立即生效是否继续？</div>
        <div class="alignRight" style="padding-top: 20px">
          <el-button @click="isDoneTaskShow = false">取消</el-button>
          <el-button type="primary" @click="doneAffirm">确定</el-button>
          <el-button type="primary" @click="taskAffirm"
            >确定并领取本po印前任务</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!-- 驳回弹窗 -->
    <div class="is-align-center">
      <rejectOrder
        v-model:dialog-type="isRefusalShow"
        :dialogId="rejectId"
        @changeList="getAllList()"
      ></rejectOrder>
    </div>
    <!-- 转移结构单弹窗 -->
    <div class="is-align-center">
      <transferOrder
        v-if="deptId"
        v-model:dialog-transfer-type="isTransferShow"
        :dialogId="transferId"
        :deptId="deptId"
        text="2"
        @changeList="getAllList()"
      ></transferOrder>
    </div>
    <!-- 退回文件推送前弹窗 -->
    <div class="is-align-center">
      <backFileOrder
        v-model:dialog-file-type="isBackFile"
        :dialogId="backFileId"
        @changeList="getAllList()"
      ></backFileOrder>
    </div>
    <!-- :key="timer" -->
    <component
      :is="dialogList"
      v-model:drawer-type="isShow"
      :drawerData="drawerData"
      :poNo="rowPoNo"
      @changelist="change('不是首次')"
    >
    </component>
  </div>
</template>
<script setup>
// 域名
import { BASE_FILE_URL } from "@/store/global-constant";
import { zipDownload } from "@/api/download";
import cancelOrder from "@/components/cancelOrder";
import rejectOrder from "../file/bulkorder/structure/components/rejectOrder";
import transferOrder from "../file/bulkorder/structure/components/transferOrder";
import backFileOrder from "../file/bulkorder/structure/components/backFileOrder";
import { toChineseNumber, senseUrl } from "@/utils/index";
import { useRouter } from "vue-router";
import {
  getCancelMsg,
  submitMsgOps,
  getTask,
  finish,
  getSelfWorkList,
  getSelfWorkSpace,
  getAnnexByOriginalId,
  msgCount,
  preGetTask,
} from "@/api/structural/selfWork";
import checkAppNewVersion from "@/utils/checkAppNewVersion.js";
import {
  rejectStructural,
  transferStructural,
  getTaskCount,
} from "@/api/structural/structuralList";
import { ElMessage, ElMessageBox } from "element-plus";
import OrderAttrShow from "@/components/OrderAttrShow/order.vue";
import RemarkDialog from "@/components/RemarkDialog/remark.vue";
import { ref } from "@vue/reactivity";
import poView from "./components/poView.vue";
import rejectDialog from "./components/rejectDialog.vue";
import Counter from "@/components/proof/Counter.vue"
const router = useRouter();
const { proxy } = getCurrentInstance();
const { prepress_department, ac_proof_type, ac_remark_type,ac_structure_status } = proxy.useDict(
  "prepress_department",
  "ac_proof_type",
  "ac_remark_type",
  "ac_structure_status"
);
// 撤单消息状态对应文字
let statusMap = {
  0: "待审批",
  1: "已同意",
  2: "不同意",
};
const uploadref = ref(null);
const isShow = ref(false);
// 撤单总条数
let revokeTotal = ref(0);
// 领取人
let receiver = ref([]);
// 总条数
let total = ref(0);
//撤单消息数量
let revokeMsgCount = ref("");
let rowId = ref("");
let rowPoNo = ref("");
// 撤单数据
let revokeData = ref([]);
// 表格数据
let tableData = ref([]);
// 是否显示属性弹框
let isAttrShow = ref(false);
let isNoteShow = ref(false);
let NoteContent = ref("");
// 属性内容
let attrContent = ref("");
let isRevokeShow = ref(false);
// 是否显示上传弹窗
let isUploadShow = ref(false);
// 是否显示完成任务弹窗
let isDoneTaskShow = ref(false);
let isAnnexVOS = ref(true);
// 是否显示驳回弹窗
let isRefusalShow = ref(false);
// 是否显示转移单弹窗
let isTransferShow = ref(false);
//是否显示退回文件推送前
let isBackFile = ref(false);
//驳回id
const rejectId = ref("");
//转移id
const transferId = ref("");
const backFileId = ref("");
const data = reactive({
  drawerData: {},
  termParams: {
    current: 1, // 页数
    size: 10, // 每页条数
    proofType: 1, //打样类型：1打样，0大货
    poNo: null, //PO号
    salesman: null, //业务员
    status: null, //印前状态
  },
  //撤单参数
  revokeParams: {
    current: 1, // 页数
    size: 10, // 每页条数
    type: 1, //0大货 1打样
  },
  // 撤单消息结果参数
  btnResultParams: {
    msgId: "", // 消息ID
    result: "", //  1同意 2拒绝
    structuralId: "",
  },
  // 完成结构单参数
  doneParams: {
    taskId: "", // id
    activityId: "", //activityId
  },
});
const { drawerData, termParams, revokeParams, btnResultParams, doneParams } =
  toRefs(data);
const deptId = ref("");
watch(prepress_department, (val) => {
  if (val.length > 0) {
    deptId.value = val.find((item) => {
      return item.label == "structural_proof";
    }).value;
  }
});
const multipleTable = ref(null);
watch(tableData, () => {
  nextTick(() => {
    multipleTable.value.setScrollTop(0);
    multipleTable.value.setScrollLeft(0);
  });
});
if (prepress_department.value.length > 0) {
  deptId.value = prepress_department.value.find((item) => {
    return item.label == "structural_proof";
  }).value;
}
const timer = ref("");
const formRef = ref();
// 账号列表
let accountList = ref([]);
// 转移结构单参数
var BoxName = ref("");
let uploadsFile = ref([]);
let inputVal = ref([]);
let uploadParam = ref([]);
//回显结构文件
let echoFileData = ref([]);
// 处理中
let processing = ref(0);
// 待处理
let pending = ref(0);
// 获取撤单消息数据
function revokeListData() {
  getCancelMsg(revokeParams.value).then((res) => {
    if (res.code == 200) {
      if (res.data) {
        revokeData.value = res.data.records;
        revokeTotal.value = res.data.total;
      }
    } else {
    }
  });
}
function handleSizeChange(val) {
  if (val == 2) {
    revokeListData();
  } else {
    getList();
  }
}
//重置表单
function resetFormParams() {
  proxy.resetForm("formRef");
  search();
}
//搜索
function search() {
  termParams.value.current = 1; //页码
  termParams.value.size = 20; //分页大小
  getList();
  disposeData()
}

//转单备注
function showAttr(text) {
  ElMessageBox.alert(text, "转单备注", {
    confirmButtonText: "关闭",
    callback: () => {},
  });
}
// 获取结构文件工作台数据
function getList() {
  // getSelfWorkList(termParams.value).then((res) => {
  getSelfWorkSpace(termParams.value).then((res) => {
    if (res.code == 200) {
      if (res.data) {
        tableData.value = res.data.records;
        total.value = res.data.total;
      }
    } else {
      ElMessage.error(res.msg);
    }
  });
}
function disposeData() {
  let param = {
    poNo: termParams.value.poNo, // po号(订单编号)
    salesman: termParams.value.salesman, // 业务员
    status: termParams.value.status, // 正稿文件状态值
    proofType: 1, //0大货 1打样
  };
  getTaskCount(param).then((res) => {
    if (res.code === 200) {
      processing.value = res.data.processingCount;
      pending.value = res.data.waitingCount;
      // disposeData()
    } else {
      ElMessage.error(res.msg);
    }
  });
}
disposeData()
getAllList();
// 领取任务
function receiveTask(id) {
  try {
    let obj = { proofType: 1 };
    if (id) {
      obj.id = id;
    }
    getTask(obj).then((res) => {
      if (res.code == 200) {
        ElMessage.success("领取成功");
        getAllList();
      } else {
        ElMessage.error(res.msg);
      }
    });
  } catch (err) {}
}
function getAllList() {
  getList();
  getMsgCount();
}
function getMsgCount() {
  msgCount({ type: 1 }).then((res) => {
    if (res.code == 200) {
      revokeMsgCount.value = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
}
/** 复制代码成功 */
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}

// 查看
function seeAll(value) {
  if (value) {
    isAttrShow.value = true;
    attrContent.value = value;
  }
}
function seeNote(value) {
  if (value) {
    isNoteShow.value = true;
    NoteContent.value = value;
  }
}

// 是否同意撤单
function getRevoke(val) {
  let { data, type } = val;
  let { id, structuralId } = data;
  btnResultParams.value.msgId = id;
  btnResultParams.value.structuralId = structuralId;
  btnResultParams.value.result = type;
  submitMsgOps(btnResultParams.value).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg);
      getAllList();
    } else {
      ElMessage.error(res.msg);
    }
    getMsgCount();
    isRevokeShow.value = false;
  });
}
watch(isRevokeShow, (val) => {
  if (!val) {
    revokeParams.value.current = 1;
    revokeParams.value.size = 10;
  } else {
    revokeListData();
  }
});

// 上传结构
const uploadOutwork = (row) => {
  rowId.value = row.id;
  rowPoNo.value = row.poNo;
  getFileData(row.id, row.poNo, "");
  // timer.value = new Date().getTime();
  // BoxName.value = row.orderType == 1 ? "otherBox" : "cardBox";
};
// 撤单消息按钮禁用
function revokeBtnDisabled(status) {
  // 待审核激活      0待审批，1已同意，2不同意
  if (status == 0) {
    return false;
  }
  return true;
}
// 是否禁用完成按钮
let isDoneDisabled = (annexVOS) => {
  // 没有结构文件禁用
  if (annexVOS == null) {
    return true;
  }
  return false;
};
// 是否禁用下载客户源文件按钮
function downDisabled(file, status) {
  if (status == 0 || status == 1) {
    if (file && file.length > 0) {
      return false;
    } else {
      return true;
    }
  }
}
// 下载文件
async function downFile(file, status) {
  // 0 客户源文件    1 正稿文件
  let name = "";
  if (status == 1) {
    name = "正稿文件";
  } else {
    name = "客户文件";
  }
  if (status == 0 || (status == 1 && file && file.length > 0)) {
    let fileParam = {
      fileList: [],
      name: name,
    };
    file.forEach((item) => {
      fileParam.fileList.push(item.fileAddress);
    });
    let result = await zipDownload(fileParam, name + ".zip");
  }
}

// 完成
const done = (id, activityId) => {
  doneParams.value.taskId = id;
  doneParams.value.activityId = activityId;
  isDoneTaskShow.value = true;
};
// 驳回
const reject = (id, poNo) => {
  rejectId.value = id;
  isRefusalShow.value = true;
};
// 转移结构单
const transferSheet = (id) => {
  isTransferShow.value = true;
  transferId.value = id;
};
// 转移结构单
const backFile = (id) => {
  isBackFile.value = true;
  backFileId.value = id;
};
// 完成任务确认
const doneAffirm = function () {
  proxy.$modal.loading("加载中，请稍候...");
  finish({ id: doneParams.value.taskId })
    .then((res) => {
      try {
        if (res.code === 200) {
          ElMessage.success("确认成功");
          isDoneTaskShow.value = false;
          getList();
        } else {
          ElMessage.error(res.msg);
        }
      } catch (err) {
        ElMessage.error(err.message);
      }
    })
    .catch(() => {
      isDoneTaskShow.value = false;
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
};
// 确定并领取本po印前任务
const taskAffirm = function () {
  proxy.$modal.loading("加载中，请稍候...");
  finish({ id: doneParams.value.taskId })
    .then((res) => {
      try {
        if (res.code === 200) {
          preGetTask(doneParams.value.activityId, { type: 1 }) //0大货印前，1打样印前
            .then((res) => {
              try {
                if (res.code === 200) {
                  isDoneTaskShow.value = false;
                  ElMessage.success("打样印前领取成功");
                  nextTick(() => {
                    router.push({
                      path: "proofPrepressWorkbench",
                    });
                  });
                } else {
                  isDoneTaskShow.value = false;
                  ElMessage.error(res.msg);
                }
              } catch (err) {
                ElMessage.error(err.message);
              }
            })
            .catch(() => {
              isDoneTaskShow.value = false;
            });
        } else {
          isDoneTaskShow.value = false;
          ElMessage.error(res.msg);
        }
      } catch (err) {
        ElMessage.error(err.message);
      }
    })
    .catch(() => {
      isDoneTaskShow.value = false;
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
  // window.open("/acwebadmin/proofOrder/proofPrepressWorkbench");
};
// 打开文件
function openFile(url) {
  window.open(senseUrl(BASE_FILE_URL + url), "_blank");
}
let dialogList = computed(() => {
  checkAppNewVersion();
  // if (BoxName.value) {
    return defineAsyncComponent(() =>
      import(
        // `../file/bulkorder/structure/components/boxType/${BoxName.value}.vue`
        `../file/bulkorder/structure/components/boxType/ProofcardBox.vue`
      )
    );
  // }
});
// 获取正稿文件数据
function getFileData(id, poNo, status) {
  getAnnexByOriginalId({ id: id, poNo: poNo }).then((res) => {
    if (res.code == 200) {
      let annexVOS = res.data.annexVOS;
      if (annexVOS) {
        uploadsFile.value = annexVOS.map((item) => {
          return [
            {
              position: item.position,
              length: item.length,
              name: item.fileName,
              fileAddress: item.fileAddress,
              sort: item.sort,
            },
          ];
        });
        inputVal.value = annexVOS.map((item) => {
          return {
            position: item.position,
            length: item.length,
            sort: item.sort,
          };
        });
      } else {
        uploadsFile.value = [];
        inputVal.value = [];
      }
      drawerData.value = {
        uploadsFile: uploadsFile.value,
        originalId: id,
        dataVal: res.data,
        poNo: poNo,
        inputVal: inputVal.value,
        type: false,
      };
      if (status) {
        isShow.value = false;
      } else {
        nextTick(() => {
          isShow.value = true;
        });
      }
    } else {
    }
  });
}
function change(val) {
  getAllList();
  getFileData(rowId.value, rowPoNo.value, val);
}
function changeRemark() {
  getAllList();
}
// 驳回确认
function refusalAffirm (data) {
  let params = {
    id:data.id,
    remark:data.remark,
    img:data.remarkImages.remarkImages,
    preNodeIndex:data.preNodeIndex
  }
  proxy.$modal.loading('数据提交中，请稍候...')
  rejectStructural(params).then(res=>{
    if(res.code == 200){
      ElMessage.success('驳回成功')
      getAllList()
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
  })
}
</script>

<style lang="scss" scoped>
.artwork-workbench {
  .alignRight {
    display: flex;
    justify-content: right;
  }
  .top-bar {
    .titleBox {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
    .btnBox {
      text-align: right;
      padding-right: 38px;
    }
  }
  // 结构列表
  .outworkListBox {
    .turn {
      display: inline-block;
      width: 20px;
      line-height: 20px;
      background-color: #ff3399;
      color: #ffffff;
      text-align: center;
    }
    .operate {
      .public {
        margin-left: 20px;
      }
      // .downBoX {
      //   display: flex;
      //   align-items: center;
      //   flex-direction: column;
      //   .downBtn {
      //     margin-left: 0;
      //     margin-top: 10px;
      //   }
      // }
    }
    .property {
      display: -webkit-box;
      -webkit-line-clamp: 6;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }

 
  // 完成任务弹窗
  .doneTask {
    .btnBox {
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
}

// 公共类
/* 单行文字溢出时出现省略号，需设定宽度 */
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gesture {
  cursor: pointer;
}
</style>
<style lang="scss">
.disposeBox{
  display: flex;
}
.is-align-center {
  .el-overlay-dialog {
    display: flex;
    .el-dialog {
      margin: auto;
    }
  }
}
.mar_10 {
  margin-right: 10px;
}
.msgbtn{
  margin-left: 10px;
}
.listText{
  font-weight: 600;
}
.titleBox {
  display: flex;
  justify-content: space-between;
}
.red{
  color: #F56C6C;
}
.form-tool-bar {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
}
</style>
<style>
.popper_note {
  max-width: 400px !important;
  width: 400px !important;
  word-break: break-all;
}
</style>

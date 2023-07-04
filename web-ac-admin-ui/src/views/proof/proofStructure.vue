<template>
  <div class="artwork-workbench">
    <listLayout>

      <template #header>
        <div class="top-bar">
          <el-form inline :model="formParams" class="condition filterForm" ref="queryRef" label-width="110px">
            <!-- 大货订单类型 -->
            <el-form-item label="品类" prop="orderType">
              <el-select
                v-model="formParams.orderType"
                class="headerinp"
                placeholder="全部品类"
                clearable
                
              >
                <el-option
                  v-for="item in ac_original_order_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="打样编号:" style="width: 280px" prop="proofNo">
              <el-input
                v-model.trim="formParams.proofNo"
                placeholder="请输入打样编号"
                clearable
              />
            </el-form-item> -->
            <!-- PO编号 -->
            <el-form-item label="PO号" prop="poNo">
              <el-input
                v-model.trim="formParams.poNo"
                placeholder="请输入PO号"
                clearable
                class="headerinp"
              />
            </el-form-item>
            <!-- 业务员 -->
            <el-form-item label="业务员" prop="salesman">
              <el-input
                v-model.trim="formParams.salesman"
                placeholder="请输入业务员名称"
                clearable
                class="headerinp"
              />
            </el-form-item>
            <!-- 结构任务领取人 -->
            <el-form-item
              label="结构任务领取人"
              prop="producerId"
            >
              <el-select
                v-model="formParams.producerId"
                placeholder="所有领取人"
                clearable
                filterable
                class="headerinp"
              >
                <el-option
                  v-for="item in receiver"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <!-- 结构状态 -->
            <el-form-item label="结构状态" prop="status">
              <el-select
                v-model="formParams.status"
                class="headerinp"
                placeholder="所有状态"
                clearable
                filterable
              >
                <el-option
                  v-for="item in ac_structure_status"
                  v-show="item.label!='已退回' && item.label!='客户撤单'"
                  :key="item.value"
                  :label="item.label=='已撤回'?'被撤回':item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="btnBox">
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
        </div>
      </template>

      <template #table-header>
        <div class="titleBox">
          <div class="listText">打样结构列表</div>
          <div class="disposeBox">
            <Counter :processing="processing" :toBeProcessed="pending"/>
          </div>
        </div>
      </template>

      <!-- 结构文件任务列表  -->
      <template #table-content='tableHeight'>
        <div class="outworkListBox">
          <el-table
            :data="tableData"
            :height='tableHeight.tableHeight'
            row-key="id"
            ref="multipleTable"
          >
            <el-table-column label="PO号">
              <template #default="scope">
                <div>
                  <poView :po-no="scope.row.poNo"></poView>
                  <!-- <span>{{ scope.row.poNo || "-" }}</span>
                  <el-icon
                    v-copyText="scope.row.poNo"
                    v-copyText:callback="copyTextSuccess"
                    v-if="scope.row.poNo"
                    class="gesture"
                    ><CopyDocument
                  /></el-icon> -->
                <div v-for="(item,index) in ac_proof_type"  :key="index"> 
                      <el-tag hit v-if="item.value==scope.row.proofingType"> {{item.label}} </el-tag>
                    </div>
                </div>
                <div style="margin-top: 4px">
                  <el-tag hit>{{scope.row.productName}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="打样编号" width="200">
              <template #default="scope">
                <div class="gesture" v-if="scope.row.proofNo">
                  <span @click="getProofDetail(scope.row.proofNo)" style="color:#409EFF">{{ scope.row.proofNo || "-" }}</span>
                  <el-icon
                    v-copyText="scope.row.proofNo"
                    v-copyText:callback="copyTextSuccess"
                    class="gesture"
                    ><CopyDocument
                  /></el-icon>
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="商品名称" width="200">
              <template #default="scope">
                <div>
                  <span>{{ scope.row.productName || "-" }}</span>
                </div>
              </template>
            </el-table-column> -->
            
            <el-table-column label="工单参数">
              <template #default="scope">
                <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.id"  type="structure" :lineFeed="(scope.row.productName&&!(scope.row.productName.indexOf('精装盒')!=-1||scope.row.productName.indexOf('双驳盒')!=-1))"></OrderAttrShow>
                <!-- <div>
                  <el-link
                    @click="seeAll(scope.row.productAttr)"
                    :underline="false"
                  >
                    <span class="property">{{ scope.row.productAttr || "-" }}</span>
                  </el-link>
                </div> -->
              </template>
            </el-table-column>

            <el-table-column label="业务员">
              <template #default="scope">
                <div>
                  <p v-show="scope.row.salesman">
                    <span class="TimeTitle">业务员：</span><br/>
                    <span class="TimeCon">{{ scope.row.salesman || "-" }}</span>
                  </p>
                  <p v-show="scope.row.createTime">
                    <span class="TimeTitle">推送时间：</span>
                    <br/>
                    <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                  </p>
                </div>
              </template>
            </el-table-column>

            <!-- <el-table-column label="推送结构时间" width="200">
              <template #default="scope">
                <div>
                  <span>{{ scope.row.createTime || "-" }}</span>
                </div>
              </template>
            </el-table-column> -->

            <el-table-column label="文件下载" width="380">
              <template #default="scope">
                <div v-if="scope.row.customerFiles?.length > 0" >
                  <template
                    v-for="(item, index) in scope.row.customerFiles"
                    :key="index"
                  >   
                    <!-- <span v-if="scope.row.customerFiles.length > 1">部件{{ toChineseNumber(index + 1) }}:</span> -->
                    <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                  </template>
                </div>
                <div v-if="scope.row.annexVOS?.length > 0">
                  <template
                    v-for="(item, index) in scope.row.annexVOS"
                    :key="index"
                  >   
                    <span v-if="scope.row.annexVOS.length > 1">部件{{ toChineseNumber(index + 1) }}:</span>
                    <FileShow title="打样结构：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                  </template>
                </div>
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
            <!-- <el-table-column label="结构文件上传状态" width="200">
              <template #default="scope">
                <div v-if="scope.row.uploadStatus">已上传</div>
                <div v-else>未上传</div>
              </template>
            </el-table-column> -->
     
            <!-- <el-table-column label="结构文件上传时间" width="200">
              <template #default="scope">
                <div>{{ scope.row.uploadTime || "-" }}</div>
              </template>
            </el-table-column> -->
            <el-table-column label="工单状态/耗时(小时)">
              <template #default="scope">
                <!-- <div style="display:flex;"><DictTag :value="scope.row.status" :options="ac_structure_status"/>/{{scope.row.duration}}</div> -->
                <div style="display:flex;">
                  <span v-if="scope.row.status==6">被撤回</span>
                  <DictTag v-else :value="scope.row.status" :options="ac_structure_status"/>
                  <span v-if="scope.row.status==1">
                    /{{getHour(scope.row.createTime)}}
                  </span>
                  <span v-else-if="scope.row.status==2||scope.row.status==4">
                    /{{getHour(scope.row.startTime)}}
                  </span>
                  <template v-else>
                    <span v-if="scope.row?.duration">/{{scope.row?.duration}}</span>
                  </template>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="领取人" width="200">
              <template #default="scope">
                <div>{{ scope.row.producer || "-" }}</div>
              </template>
            </el-table-column> -->

            <!-- <el-table-column
              label="正稿备注"
              width="310"
              :show-overflow-tooltip="true"
            >
              <template #default="scope">
                <span>{{ scope.row.originalRemark || "-" }}</span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column fixed="right" label="操作" width="240">
              <template #default="scope">
                <div class="operate">
                  <el-link
                    type="primary"
                    :underline="false"
                    class="mar_10"
                    @click="reject(scope.row.id, scope.row.poNo)"
                    >驳回</el-link
                  >
                  <el-popover placement="bottom" width="300px;" trigger="click">
                    <template #reference>
                      <el-button
                        @click="isShowDownBtn = scope.row.id"
                        size="small"
                        style="margin-left: 10px"
                      >
                        <el-icon><More /></el-icon>
                      </el-button>
                    </template>
                    <div class="downBoX">
                      <div>
                        <el-button
                          class="downBtn"
                          text
                          :disabled="downDisabled(scope.row.customerFiles, 0)"
                          @click="downFile(scope.row.customerFiles, 0)"
                          >客户源文件详情下载</el-button
                        >
                      </div>
                      <div>
                        <el-button
                          class="downBtn"
                          text
                          :disabled="downDisabled(scope.row.annexVOS, 1)"
                          @click="downFile(scope.row.annexVOS, 1)"
                          >下载结构文件</el-button
                        >
                      </div>
                    </div>
                  </el-popover>
                </div>
              </template>
            </el-table-column> -->
            <el-table-column
              label="备注"
              :show-overflow-tooltip="true"
              width="100"
            >
              <template #default="scope">
                <div>
                  <el-link
                    v-if="scope.row.orderRemark"
                    type="primary"
                    :underline="false"
                    @click="CommentPopup(scope.row.orderRemark,'订单备注')"
                    >订单备注</el-link
                  >
                </div>
                <div>
                  <el-link
                    v-if="scope.row.originalRemark"
                    type="primary"
                    :underline="false"
                    @click="CommentPopup(scope.row.originalRemark,'正稿备注')"
                    >正稿备注</el-link
                  >
                </div>
                
              </template>
            </el-table-column>
            
            <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <div style="color: #409eff; cursor: pointer" @click="openPopup(scope.row.id)">
                处理历史
              </div>
            </template>
          </el-table-column>
          </el-table>
        </div>
      </template>

      <!-- 分页 -->
      <template #pagination>
        <div class="prooflaypage">
          <pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            v-model:page="formParams.current"
            @pagination="handleSizeChange()"
            :total="total"
            v-model:limit="formParams.size"
            :pageSizes="[10, 20, 50, 100]"
          />
        </div>
      </template>
    </listLayout>
    <!-- 属性弹框 -->
    <div class="is-align-center">
      <el-dialog v-model="isAttrShow" title="属性详情" width="600px">
        <el-scrollbar style="height: 400px">
          <div>{{ attrContent }}</div>
        </el-scrollbar>
        <template #footer>
          <span>
            <el-button type="primary" @click="isAttrShow = false"
              >关闭</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>

    <!-- 历史弹窗 -->
    <HistoryDialog v-if="historyDialog" :historyListData="detailData" v-model:historyShow="historyDialog"/>

    <!-- 结构驳回弹窗 -->
    <div class="is-align-center">
      <rejectOrder
        v-model:dialog-type="isRefusalShow"
        :dialogId="rejectId"
        @changeList="getAllList()"
      ></rejectOrder>
    </div>
    <div class="is-align-center">
      <transferOrder
        v-if="deptId"
        v-model:dialog-transfer-type="isTransferShow"
        :dialogId="transferId"
        :deptId="deptId"
        @changeList="getAllList()"
      ></transferOrder>
    </div>
  </div>
</template>

<script setup>
import { toChineseNumber,senseUrl,CommentPopup,getHour } from "@/utils/index";
import { BASE_FILE_URL } from "@/store/global-constant";
import rejectOrder from "../file/bulkorder/structure/components/rejectOrder";
import transferOrder from "../file/bulkorder/structure/components/transferOrder";
import { getPage, getTaskCount, getInfo } from "@/api/structural/structuralList";
import { getDeptUser } from "@/api/system/user";
import { ElMessage } from "element-plus";
import { zipDownload } from "@/api/download";
import OrderAttrShow from "@/components/OrderAttrShow/order.vue";
import { nextTick, watch } from 'vue';
import poView from "./components/poView.vue"
import Counter from "@/components/proof/Counter.vue"
const { proxy } = getCurrentInstance();
const { ac_original_order_type, ac_structure_status, prepress_department,ac_proof_type } =
  proxy.useDict(
    "ac_original_order_type",
    "ac_structure_status",
    "prepress_department",
    "ac_proof_type"
  );
const router = useRouter();
const rejectId = ref("");
const transferId = ref("");
// 总条数
let total = ref(0);
const data = reactive({
  formParams: {
    orderType: "", // 大货订单类型值
    poNo: "", // po号(订单编号)
    proofNo: "", //打样编号
    status: "",
    receiverValue: "", // 领取人值
    salesman: "", // 业务员
    current: 1, // 页数
    size: 10, // 每页条数
    proofType: 1, //打样类型：1打样，0大货
  },
});
const { formParams } = toRefs(data);
const deptId = ref("");
watch(prepress_department, (val) => {
  if(val.length>0){
  deptId.value = val.find((item) => {
    return item.label == "structural_proof";
  }).value;
  DeptUser();
  }

});
if (prepress_department.value.length > 0) {
  deptId.value = prepress_department.value.find((item) => {
    return item.label == "structural_proof";
  }).value;
  DeptUser();
}
// 领取人
let receiver = ref([]);
// 表格数据
const tableData = ref([]);
const multipleTable = ref(null)
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
// 处理中
let processing = ref(0);
// 待处理
let pending = ref(0);
let isRefusalShow = ref(false);
let isTransferShow = ref(false);
// 是否显示属性弹框
let isAttrShow = ref(false);
let detailData = ref([])
// 属性内容
let attrContent = ref("");
let isShowDownBtn = ref(0);
let historyDialog = ref(false)
// 获取结构列表数据
function getList() {
  getPage({
    ...formParams.value,
  }).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.records;
      total.value = res.data.total;
    }
  });
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  search();
}
// 搜索
function search() {
  formParams.value.current = 1;
  getAllList();
  // disposeData();
}
const openPopup = (id) => {
    getInfo({ id: id }).then((res) => {
      if (res.code == 200) {
        if (res.data) {
          detailData.value = res.data.historyLog;
          historyDialog.value = true;
        }
      }
    });
};
/** 复制代码成功 */
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}

// 查看全部
function seeAll(value) {
  if (value) {
    isAttrShow.value = true;
    attrContent.value = value;
  }
}
//驳回结构单
function reject(id, poNo) {
  rejectId.value = id;
  isRefusalShow.value = true;
}
// 转移结构单
const transferSheet = (id) => {
  isTransferShow.value = true;
  transferId.value = id;
};
// 打开文件
function openFile(url) {
  window.open(senseUrl(BASE_FILE_URL + url), "_blank");
}
// 下载文件
async function downFile(file, status) {
  // 0 客户源文件    1 结构文件
  let name = "";
  if (status == 1) {
    name = "结构文件";
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
// 处理数据
function disposeData() {
  let param = {
    poNo: formParams.value.poNo, // po号(订单编号)
    orderType: formParams.value.orderType, // 大货订单类型值
    salesman: formParams.value.salesman, // 业务员
    proofNo: formParams.value.proofNo,
    status: formParams.value.status, // 正稿文件状态值
    producerId: formParams.value.producerId, // 领取人id
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
function handleSizeChange() {
  getAllList();
}
getAllList();
function getAllList() {
  getList();
  disposeData();
}
//任务领取人
// DeptUser();
function DeptUser() {
  getDeptUser({ deptId: deptId.value }).then((res) => {
    if (res.code === 200) {
      receiver.value = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
}
// 下载禁用
function downDisabled(file, status) {
  if (status == 0 || status == 1) {
    if (file && file.length > 0) {
      return false;
    } else {
      return true;
    }
  }
}

function getProofDetail(id) {
  window.open("/admin/design_demand/detail.html?id=" + id, "_blank");
}
</script>

<style lang="scss" scoped>
.disposeBox{
  display: flex;
}
.listText{
  font-weight: 600;
}
.red{
  color: #F56C6C;
}
.artwork-workbench {
  .top-bar {
    // .condition{
      // display: flex;
      // &:deep(.el-form-item__label) {
      //   font-weight: 400;
      //   color: #303133;
      // }
    // }
    .btnBox {
      text-align: right;
      padding-right: 38px;
    }
  }
  .titleBox {
    display: flex;
    justify-content: space-between;
  }
  // 结构列表
  .outworkListBox {
    .operate {
      .public {
        margin-left: 20px;
      }
      .downBoX {
        text-align: center;
        .downBtn {
          margin-left: 0;
          margin-top: 10px;
        }
      }
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
  // 撤回结构弹窗
  .revokeOutwork {
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
:deep(.el-popper) {
  max-width: 400px;
  word-break: break-all;
}
</style>
<style lang="scss">
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
.gesture {
  cursor: pointer;
}
</style>

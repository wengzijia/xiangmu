<template>
  <div class="artwork-workbench">
    <listLayout>
      <template #header>
        <div class="top-bar">
          <el-form inline :model="formParams" class="condition filterForm" ref="queryRef">
            <el-form-item label="品类:" prop="orderType">
              <el-select
                v-model="formParams.orderType"
                class="headerinp"
                placeholder="全部品类"
                clearable
              >
                <el-option
                  v-for="item in digitalType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="PO号:" prop="poNo">
              <el-input
                v-model.trim="formParams.poNo"
                placeholder="请输入PO号"
                clearable
                class="headerinp"
              />
            </el-form-item>
            <!-- <el-form-item label="打样编号:" prop="proofNo">
              <el-input
                v-model.trim="formParams.proofNo"
                placeholder="请输入打样编号"
                clearable
              />
            </el-form-item> -->
            <el-form-item label="状态:" prop="status">
              <el-select
                v-model="formParams.status"
                class="headerinp"
                placeholder="全部状态"
                clearable
              >
                <template v-for="item in ac_digital_print_status" :key="item.value">
                  <el-option
                    v-if="
                      item.value != 0 &&
                      item.value != 2 &&
                      item.value != 3 &&
                      item.value != 5 &&
                      item.value != 6
                    "
                    :label="item.label"
                    :value="item.value"
                  />
                </template>
              </el-select>
            </el-form-item>
            <!-- <el-form-item>
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item> -->
          </el-form>
          <div style="display: flex;justify-content: space-between;">
            <el-button type="success" @click="toPage('/admin/proofingbigversion/grouplist.html')">大版订单列表</el-button>
            <div class="btnBox">
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </div>
          </div>
        </div>
      </template>
      <template #table-header>
      <div class="top-bar">
        <div class="titleBox">
          <div class="listText">
            数码打印工作台
            <el-badge :value="revokeMsgCount||0" :max="99" class="msgbtn" @click="showDialog">
              <el-button type="warning">撤单消息</el-button>
            </el-badge>
          </div>
          <div class="disposeBox">
            <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>
          </div>
        </div>
      </div>
    </template>
      <!-- <div class="titleBox">
        <div class="listText">数码打印列表</div>
      </div> -->
      <!-- <template #table-header> -->
        <!-- <div class="top-bar"> -->
        <!-- <el-link :underline="false" @click="showDialog" style="font-size:16px;">撤单消息<span>({{revokeMsgCount}})</span><span v-if="revokeMsgCount" class="red-dot"></span></el-link> -->
        <!-- <el-button type="primary" @click="Task">领取任务</el-button> -->
        <!-- </div> -->
      <!-- </template> -->
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
          <div class="alignRight" style="padding-top: 20px">
            <el-button type="primary" @click="isRevokeShow = false"
              >关闭</el-button
            >
          </div>
        </el-dialog>
      </div>
      <!-- 结构文件任务列表  -->
      <template #table-content='tableHeight'>
      <div class="outworkListBox">
        <el-table :data="tableData" :height='tableHeight.tableHeight' row-key="activityId">
          <el-table-column label="PO号" width="300">
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
              </div>
              <div>
                <DictTag
                  :value="scope.row.proofingType"
                  :options="ac_proof_type"
                />
              </div>
              <!-- <div v-if="scope.row.allowModificationOfDie" style="margin-top:5px">
                <el-tag hit style="font-size: 12px;">{{(scope.row.allowModificationOfDie==1?'允':'不')}}许对设计文件、刀模文件进行生产规范化修正</el-tag>
              </div> -->
              <div style="margin-top: 5px">
                <el-tag>{{scope.row.productName}}</el-tag>
                <followInfoFlag  :row="scope.row" name="prepressFollow"></followInfoFlag>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="打样编号" width="200">
            <template #default="scope">
              <div>
                <span>{{ scope.row.proofNo || "-" }}</span>
                <el-icon
                  v-copyText="scope.row.proofNo"
                  v-copyText:callback="copyTextSuccess"
                  v-if="scope.row.proofNo"
                  class="gesture"
                  ><CopyDocument
                /></el-icon>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="工单参数" width="310">
            <template #default="scope">
              <OrderAttrShow
                :attr="scope.row.productAttr"
                :activityId="scope.row.activityId"
                :lineFeed="(scope.row.productName&&!(scope.row.productName.indexOf('精装盒')!=-1||scope.row.productName.indexOf('双驳盒')!=-1))"
              ></OrderAttrShow>
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
                  <span class="TimeTitle">推送打印时间：</span>
                  <br/>
                  <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="文件下载" width="300">
            <template #default="scope">
              <div
                v-if="
                  scope.row.customerFile &&
                  jsonParse(scope.row.customerFile).length > 0
                "
                class="gesture"
              >
                <template
                  v-for="(item, index) in jsonParse(scope.row.customerFile)"
                  :key="index"
                >
                <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                  <!-- <el-popover
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
                        <span v-if="scope.row.customerFile.length > 1"
                          >部件{{ toChineseNumber(index + 1) }}:</span
                        >
                        {{ item.fileName }}
                      </div>
                    </template>
                  </el-popover> -->
                </template>
              </div>
              <div v-if="scope.row.structuralFileUrl&&jsonParse(scope.row.structuralFileUrl.length)" class="gesture">
                <template v-for="(item, index) in jsonParse(scope.row.structuralFileUrl)" :key="index">
                      <FileShow title="打样结构：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                </template>
              </div>
              <div v-if="scope.row.orPrepressFile.length" class="gesture">
                <template v-for="(item, index) in scope.row.orPrepressFile" :key="index">
                      <FileShow title="打样印前：" :filename="item.name" :fileurl="senseUrl(BASE_FILE_URL + item.url)"/>
                </template>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="品类" width="200">
            <template #default="scope">
              <div>
                <span>{{ scope.row.productName || "-" }}</span>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="数量">
            <template #default="scope">
              <div>
                <span>{{ scope.row.productNumber || "-" }}</span>
              </div>
            </template>
          </el-table-column> -->

          <!-- <el-table-column label="印前文件状态" width="120">
            <template #default="scope">
              <template v-for="item in prepress_file_status">
                <el-tag
                  :key="item.value"
                  v-if="scope.row.prepressFileStatus == item.value"
                  >{{ item.label }}</el-tag
                >
              </template>
            </template>
          </el-table-column> -->
          <!-- <el-table-column
            label="印前备注"
            width="200"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span>{{ scope.row.prepressRemark || "-" }}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column
            label="结构备注"
            width="200"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span>{{ scope.row.structuralRemark || "-" }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="备注" width="150">
            <template #default="scope">
              <RemarkDialog
                :order="scope.row"
                :perperss_remark_type="perperss_remark_type"
                :showButton="scope.row?.remarkFlag == 2"
                type="digital"
                @getList="getList"
              />
              <div>
                <el-link
                  v-if="scope.row.prepressRemark"
                  type="primary"
                  :underline="false"
                  @click="showAttr(scope.row.prepressRemark,'印前备注')"
                  >印前备注</el-link
                >
              </div>
              <div>
                <el-link
                  v-if="scope.row.structuralRemark"
                  type="primary"
                  :underline="false"
                  @click="showAttr(scope.row.structuralRemark,'结构备注')"
                  >结构备注</el-link
                >
              </div>
              <div>
                <el-link
                  v-if="scope.row.customerNote"
                  type="primary"
                  :underline="false"
                  @click="showAttr(scope.row.customerNote,'客户订单备注')"
                  >客户订单备注</el-link
                >
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="文件推送人" width="90">
            <template #default="scope">
              <div>{{ scope.row.fileSender || "-" }}</div>
            </template>
          </el-table-column> -->
          
          <el-table-column label="打印状态" width="150">
            <template #default="scope">

              <div>
                <!-- 打印状态: -->
                <template v-for="item in ac_digital_print_status">
                  <span :key="item.value" v-if="scope.row.status == item.value">{{
                    item.label
                  }}</span>
                </template>
              </div>

              <!-- <div v-if="scope.row.finishTime">
                打印时间:{{ scope.row.finishTime || "-" }}
              </div>
              
              <div v-if="scope.row.timeConsum">
                打样耗时（小时）:{{ scope.row.timeConsum || "-" }}
              </div> -->
            </template>
          </el-table-column>
          <!-- <el-table-column label="业务备注" width="310" :show-overflow-tooltip="true">
            <template #default="scope">
              <span>{{ scope.row.salesmanNote || "-" }}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column
            label="客户订单备注"
            width="310"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span>{{ scope.row.customerNote || "-" }}</span>
            </template>
          </el-table-column> -->
          
          <!-- <el-table-column label="数码打印时间">
            <template #default="scope">
              <div>{{ scope.row.finishTime || "-" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="数码打样耗时（小时）" width="170">
            <template #default="scope">
              <div>{{ scope.row.timeConsum || "-" }}</div>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <div class="operate">
                <p>
                <el-link
                  type="primary"
                  :underline="false"
                  class="mar_10"
                  :disabled="disabled(scope.row.status)"
                  ><rejectDialog :activityId="scope.row.activityId" @callBack="refusalAffirm" :scope="scope.row" :disabled="disabled(scope.row.status)" /></el-link
                >
                  <!-- @click="reject(scope.row)" -->
                </p>
                <receiveBtn  class="mar_10" v-if="scope.row.status==0" :row="scope.row" :getTask="getTask" :id='scope.row.activityId' @updatelist="getList"></receiveBtn>
                <el-link
                  v-else
                  type="primary"
                  :underline="false"
                  class="mar_10"
                  :disabled="printAble(scope.row.status)||!scope.row.isInputMaterials"
                  @click="PrintSheet(scope.row.activityId)"
                  >打印</el-link
                >
                <p>
                  <inputMaterials :activityId="scope.row.activityId" @callBack="getList" :disabled="printAble(scope.row.status)"/>
                </p>
                <!-- <el-popover placement="bottom" width="300px;" trigger="click" v-if="false">
                  <template #reference>
                    <el-button
                      @click="isShowDownBtn = scope.row.activityId"
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
                        :disabled="downDisabled(scope.row.orPrepressFile, 3)"
                        @click="prepressDownload(scope.row)"
                        >下载印前</el-button
                      >
                    </div>
                    <div>
                      <el-button
                        class="downBtn"
                        text
                        :disabled="downDisabled(scope.row, 1)"
                        @click="
                          structuralDownload(
                            scope.row
                          )
                        "
                        >下载结构</el-button
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
      <!-- 分页 -->
      <template #pagination>
      <div class="prooflaypage">
        <pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-model:page="formParams.pageNum"
          @pagination="handleSizeChange()"
          :total="total"
          v-model:limit="formParams.pageSize"
          :pageSizes="[10, 20, 50, 100]"
        />
      </div>
      </template>
    </listLayout>
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

    <!-- 驳回弹窗 -->
    <div class="is-align-center">
      <el-dialog
        v-model="isRefusalShow"
        title="驳回"
        width="600px"
        :before-close="cancel"
      >
        <el-form
          ref="formRefusal"
          :rules="refusalRules"
          :model="refusalParams"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="驳回原因:" prop="remark">
            <el-input
              v-model.trim="refusalParams.remark"
              type="textarea"
              placeholder="请填写驳回原因"
              autocomplete="off"
              show-word-limit
              maxlength="500"
              resize="none"
              rows="6"
            />
            <div style="margin-top: 10px">
              <FileUpload
                :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']"
                :fileSize="200"
                type=""
                name="上传图片附件"
                v-model:modelValue="refusalParams.remarkImages"
                del
              />
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="refusalAffirm()">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="is-align-center">
      <el-dialog
        v-model="isPrintShow"
        title="确定数码打印已完成?"
        width="500px"
        :before-close="PrintCancel"
      >
        <el-form
          ref="formDeliver"
          :model="PrintParam"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div>操作立即生效是否继续?</div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="PrintCancel">取消</el-button>
            <el-button type="primary" @click="PrintAffirm()">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import cancelOrder from "@/components/cancelOrder";
import { BASE_FILE_URL } from "@/store/global-constant";
import { zipDownload } from "@/api/download";
import { toChineseNumber,senseUrl} from "@/utils/index";
import {
  getmyWorkList,
  turnDown,
  downloadFile,
  print,
  getTask,
  getMsgCount,
  getCancelMsg,
  submitMsgOps,
  getTaskCount
} from "@/api/proofDigital/index";

import { downloadZip,download } from "@/utils/request2";
import { getToken } from "@/utils/auth";
import { ElMessage,ElMessageBox } from "element-plus";
import OrderAttrShow from "@/components/OrderAttrShow";
import RemarkDialog from "@/components/RemarkDialog";
import receiveBtn from "@/components/proof/receiveBtn.vue";
import poView from "./components/poView.vue"
import rejectDialog from "./components/rejectDialog.vue";
import inputMaterials from "./components/inputMaterials.vue";
import Counter from "@/components/proof/Counter.vue"
const { proxy } = getCurrentInstance();
const { ac_digital_print_status, prepress_file_status, perperss_remark_type, ac_proof_type } =
  proxy.useDict(
    "ac_digital_print_status",
    "prepress_file_status",
    "perperss_remark_type",
    "ac_proof_type"
  );
const digitalType = [
  { label: "基础品类", value: "0" },
  { label: "精装盒品类", value: "1" },
];
const router = useRouter();
// 总条数
let total = ref(0);
const diverStatus = ref(1);
const data = reactive({
  formParams: {
    proofNo: "", // 打样单号
    poNo: "", // po号(订单编号)
    status: "", //数码打印状态
    orderType: "", //数码类型
    pageNum: 1, // 页数
    pageSize: 10, // 每页条数
  },
  PrintParam: {
    activityId: "",
  },
  // 驳回参数
  refusalParams: {
    poNo: "", // poNo
    remark: "", // 备注
    activityId: "", //文件制作流程ID
    orderNo: "", //订单号
    remarkImages: "", //驳回图片
    type: "", //订单类型：0大货 1打样
  },
  refusalRules: {
    remark: [{ required: true, message: "请填写驳回原因", trigger: "blur" }],
  },
  revokeParams: {
    current: 1, // 页数
    size: 20, // 每页条数
  },
});
const { formParams, refusalParams, refusalRules, PrintParam, revokeParams } = toRefs(data);
// 表格数据
const tableData = ref([]);
const revokeData = ref([]);// 撤单数据
const revokeTotal = ref(0)//撤单消息总数
const revokeMsgCount = ref(0)//撤单消息数量
const isRevokeShow = ref(false)
let isRefusalShow = ref(false);
let isPrintShow = ref(false);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
let isShowDownBtn = ref(0);
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理

// 获取结构列表数据
function getList() {
  getmyWorkList({
    ...formParams.value,
  }).then((res) => {
    if (res.code === 200) {
      
      tableData.value = res.data.rows.map((item) => {
        let reg = new RegExp("<.+?>", "g");
        item.salesmanNote = item.salesmanNote.replace(reg, "");
        if (item.prepressFile && item.prepressFile.length > 0) {
          item.prepressFile = JSON.parse(item.prepressFile);
        item.structureFile = item.prepressFile.map((e) => {
          return e.structureFile;
        }).filter(a=>a);
        item.orPrepressFile = item.prepressFile.map((e) => {
          return e.prepressFile;
        }).filter(a=>a);
        }
        if (item.structuralFile && item.structuralFile.length > 0) {
          item.structuralFile = JSON.parse(item.structuralFile);
        }
        return item;
      });
      total.value = res.data.total;
    }
  });
  getRevokeMsgCount()
}
function showAttr(text,type){
  ElMessageBox.alert(text, type, {
    confirmButtonText: '关闭',
    callback: () => {}
  })
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  search();
}
// 搜索
function search() {
  formParams.value.pageNum = 1;
  getList();
  getCount()
}

/** 复制代码成功 */
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}
// 处理数据
function getCount(){
  getTaskCount({position:1,...formParams.value}).then(res=>{
    if (res.code==200) {
      processing.value = res.data.processingCount
      toBeProcessed.value = res.data.waitingCount
    }
  })
}
getCount()
// 查看全部
function seeAll(value) {
  if (value) {
    isAttrShow.value = true;
    attrContent.value = value;
  }
}
//驳回
function reject(row) {
  refusalParams.value.poNo = row.poNo;
  refusalParams.value.activityId = row.activityId;
  refusalParams.value.orderNo = row.orderNo;
  refusalParams.value.type = row.type;
  isRefusalShow.value = true;
}
// 快递单号
const PrintSheet = (activityId) => {
  isPrintShow.value = true;
  PrintParam.value.activityId = activityId;
};

function handleSizeChange() {
  getList();
}
getList();
// 驳回确认
const refusalAffirm = (data) => {
  let params = {
    activityId:data.activityId,
    orderNo:data.orderNo,
    poNo:data.poNo,
    type:data.type,
    remark:data.remark,
    remarkImages:data.remarkImages.remarkImages?.split(',').filter(a=>a),
    preNodeIndex:data.preNodeIndex
  }
  proxy.$modal.loading('数据提交中，请稍候...')
  turnDown(params).then(res=>{
    if(res.code == 200){
      ElMessage.success('驳回成功')
      getList()
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
  })
};

const PrintAffirm = () => {
  try {
    print(PrintParam.value.activityId).then((res) => {
      if (res.code === 200) {
        ElMessage.success("打印成功");
        getList();
      }
      isPrintShow.value = false;
    });
  } catch (err) {
    isPrintShow.value = false;
  }
};

function cancel() {
  proxy.resetForm("formRefusal");
  isRefusalShow.value = false;
}
function PrintCancel() {
  isPrintShow.value = false;
}
// 下载禁用
function downDisabled(file, status) {
  switch (status) {
    case 1:
      if (file.structuralFile || file.structureFile.length>0) {
        return false;
      } else {
        return true;
      }
      break;
    default:
      if (file && file.length > 0) {
        return false;
      }
      return true;
      break;
  }
}
function jsonParse(val) {
  if (val) {
    return JSON.parse(val);
  } else {
    return "";
  }
}
// 下载结构文件
function structuralDownload(row) {
  console.log('row',row)
  let fileList = []
  if(row.customerFile){
    let arr = JSON.parse(row.customerFile)
    fileList = [].concat(fileList,arr.map(e => e.fileAddress))
  }
  if(row.structuralFileUrl){
    let arr = JSON.parse(row.structuralFileUrl)
    fileList = [].concat(fileList,arr.map(e => e.fileAddress))
  }else{
    let arr = row.structureFile
    fileList = [].concat(fileList,arr.map(e => e.url))
  } 
  downloadZip('/alibaba/oss/zipDownload',{
      fileList,
      "name": "结构文件"
        },'结构文件.zip',{token:getToken()})
  
}
// 下载印前文件
function prepressDownload(row) {
  let arr = row.orPrepressFile
  console.log(arr)
  let index = 0;
  function dowFile(){
    let url = arr[index].url
    index = index+1
    let type = url.split('.')
    download('/alibaba/oss/downloadFile',{fileName:url},'印前文件.'+type[type.length-1],{token:getToken()}).then(res=>{
      if(arr[index]){
        dowFile()
      }
    })
  }
  dowFile()
}
// 打开文件
function openFile(url) {
  window.open(senseUrl(BASE_FILE_URL+url), "_blank");
}
function printAble(status) {
  if (status == 1 || status == 4) {
    return false;
  } else {
    return true;
  }
}
function disabled(status) {
  if (status == 1 || status ==4) {
    return false;
  } else {
    //置灰
    return true;
  }
}
function toPage(url){
  window.open(url)
}
//显示撤单消息dialog
function showDialog(){
  if (revokeData.value.length == 0) {
    return
  }else{
    isRevokeShow.value = true
    getRevokeListData()
  }
}
watch(isRevokeShow,(val)=>{
  if (!val) {
    revokeParams.value.current = 1
    revokeParams.value.size = 20
    getRevokeListData()
    getList()
  }
})
// 获取撤单消息数据
function getRevokeListData() {
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
//获取撤单消息数量
function getRevokeMsgCount() {
  getMsgCount({ type: 1 }).then((res) => {
    if (res.code == 200) {
      revokeMsgCount.value = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
}
// 是否同意撤单
function getRevoke(val) {
  let { data, type } = val;
  let { id, structuralId } = data;
  let params = {
    msgId:id,
    structuralId:structuralId,
    result:type
  }
  proxy.$modal.loading('数据提交中，请稍候...')
  submitMsgOps(params).finally(()=>{
    proxy.$modal.closeLoading()
    isRevokeShow.value = false;
    getRevokeListData()
    getList()
  })
}
</script>

<style lang="scss" scoped>
.disposeBox{
  display: flex;
}
.artwork-workbench {
  .top-bar {
    // .condition{
    //   display: flex;
    // }
    .btnBox {
      text-align: right;
      padding-right: 38px;
      margin-bottom: 10px;
    }
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
      -webkit-line-clamp: 4;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }
  // 分页
  .laypage {
    display: flex;
    justify-content: right;
    margin-top: 20px;
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

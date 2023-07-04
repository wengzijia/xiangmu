<template>
  <div class="artwork-workbench">
    <listLayout>
    <template #header>
      <div class="top-bar">
        <el-form inline :model="formParams" class="condition filterForm" ref="queryRef" label-width="100px">
          <el-form-item label="PO号:" prop="poNo">
            <el-input
              v-model.trim="formParams.poNo"
              placeholder="请输入PO号"
              class="headerinp"
              clearable
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
              <el-option
                v-for="item in ac_digital_print_status"
                v-show="item.label!='客户撤单'"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="数码类型:" prop="orderType">
            <el-select
              v-model="formParams.orderType"
              class="headerinp"
              placeholder="全部类型"
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
          <!-- <el-form-item>
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item> -->
        </el-form>
        <div class="btnBox">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>
    </template>
    <!-- <div class="titleBox">
      <div class="listText">数码打印列表</div>
    </div> -->
    <template #table-header>
      <div class="top-bar">
        <div class="titleBox">
          <div class="listText">
            数码打印列表
          </div>
          <div class="disposeBox">
            <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>
          </div>
        </div>
      </div>
    </template>
    <!-- 结构文件任务列表  -->
    <template #table-content="tableHeight">
      <div class="outworkListBox">
        <el-table :data="tableData" :height="tableHeight.tableHeight" row-key="activityId" ref="multipleTable">
          <el-table-column label="PO号" width="200">
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
              <div v-for="(item, index) in ac_proof_type" :key="index">
                    <el-tag
                      hit
                      v-if="item.value == scope.row.proofingType"
                    >
                      {{ item.label }}
                    </el-tag>
                  </div>

                  <div style="margin-top: 4px">
                  <el-tag hit>{{scope.row.productName}}</el-tag>
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
              <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.activityId" :lineFeed="(scope.row.productName&&!(scope.row.productName.indexOf('精装盒')!=-1||scope.row.productName.indexOf('双驳盒')!=-1))"></OrderAttrShow>
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
          <!-- <el-table-column label="品类" width="200">
            <template #default="scope">
              <div>
                <span>{{ scope.row.productName || "-" }}</span>
              </div>
            </template>
          </el-table-column> -->
          

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

          <el-table-column label="文件下载" width="350">
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
                  <!-- <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="item.fileName"
                  > -->
                    <!-- <template #reference> -->
                      <!-- <div
                        class="text-overflow"
                        style="width: 180px"
                        @click="openFile(item.fileAddress)"
                      > -->
                        <!-- <span v-if="scope.row.customerFile.length > 1"
                          >部件{{ toChineseNumber(index + 1) }}:</span
                        > -->
                        <!-- {{ item.fileName }} -->
                      <!-- </div> -->
                      <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                    <!-- </template> -->
                  <!-- </el-popover> -->
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
          <!-- <el-table-column label="印前文件状态" width="200">
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

          <!-- <el-table-column label="数码打印领取人" width="200">
            <template #default="scope">
              <div>{{ scope.row.producerName || "-" }}</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="印前备注" :show-overflow-tooltip="true">
            <template #default="scope">
              <span>{{ scope.row.prepressRemark || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结构备注" :show-overflow-tooltip="true">
            <template #default="scope">
              <span>{{ scope.row.structuralRemark || "-" }}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="数码打印状态" width="200">
            <template #default="scope">
              <template v-for="item in ac_digital_print_status">
                <el-tag :key="item.value" v-if="scope.row.status == item.value">{{
                  item.label
                }}</el-tag>
              </template>
            </template>
          </el-table-column> -->
          <el-table-column label="备注">
            <template #default="scope">
              <RemarkDialog :order="scope.row" :showButton="(scope.row?.remarkFlag==2)" type="digital" @getList="getList" :perperss_remark_type="perperss_remark_type"/>
              <div v-if="scope.row.prepressRemark">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="CommentPopup(scope.row.prepressRemark,'印前备注')"
                  >印前备注</el-link>
              </div>
              <div v-if="scope.row.structuralRemark">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="CommentPopup(scope.row.structuralRemark,'结构备注')"
                  >结构备注</el-link>
              </div>
              <div v-if="scope.row.customerNote">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="CommentPopup(scope.row.customerNote,'客户订单备注')"
                  >客户订单备注</el-link>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="数量">
            <template #default="scope">
              <div>
                <span>{{ scope.row.productNumber || "-" }}</span>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="业务备注" width="310" :show-overflow-tooltip="true">
            <template #default="scope">
              <span>{{ scope.row.salesmanNote || "-" }}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="客户订单备注" :show-overflow-tooltip="true">
            <template #default="scope">
              <span>{{ scope.row.customerNote || "-" }}</span>
            </template>
          </el-table-column> -->
         
          
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <div class="operate">
                <!-- <p>
                  <el-link
                    type="primary"
                    :underline="false"
                    class="mar_10"
                    :disabled="disabled(scope.row.status)"
                    @click="reject(scope.row)"
                    >驳回</el-link
                  >
                </p> -->
                <!-- <el-link
                  type="primary"
                  :underline="false"
                  class="mar_10"
                  @click="receiveSheet(scope.row.activityId)"
                  :disabled="scope.row.status != 0"
                  >领取</el-link
                > -->
                <!-- <p><receiveBtn  :row="scope.row" :getTask="getTask" :id='scope.row.activityId' @updatelist="getList"></receiveBtn></p> -->
                <div style="color: #409eff; cursor: pointer" @click="historical(scope.row.activityId)">
                  处理历史
                </div>
                <el-popover v-if="false" placement="bottom" width="300px;" trigger="click">
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
                        @click="structuralDownload(scope.row)"
                        >下载结构</el-button
                      >
                    </div>
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template #pagination>
      <!-- 分页 -->
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
      <el-dialog v-model="isAttrShow" title="参数详情" width="600px">
        <el-scrollbar style="margin-right: 20px;height: 450px;">
          <div style="line-height: 2">{{ attrContent }}</div>
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
    <HistoryDialog v-if="historyDialog" :historyListData="historyListData" v-model:historyShow="historyDialog" />
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
            <div style="margin-top:10px;">
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
        v-model="isDeliverShow"
        title="确定领取数码打印任务?"
        width="500px"
        :before-close="receiveCancel"
      >
        <el-form
          ref="formDeliver"
          :model="receiveParam"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div>领取后请及时完成任务，请勿长时间搁置。</div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="receiveCancel">取消</el-button>
            <el-button type="primary" @click="receiveAffirm()"
              >确定领取</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { BASE_FILE_URL } from "@/store/global-constant";
import { zipDownload } from "@/api/download";
import { toChineseNumber,senseUrl,CommentPopup } from "@/utils/index";
import {
  getDigitalList,
  turnDown,
  getTask,
  downloadFile,
  getTaskCount,
  getLogs
} from "@/api/proofDigital/index";
// import { downloadZip,download } from "@/utils/request";

import { ElMessage } from "element-plus";
import OrderAttrShow from "@/components/OrderAttrShow"
import RemarkDialog from "@/components/RemarkDialog";
import { nextTick, watch } from 'vue';
import { downloadZip,download } from "@/utils/request2";
import { getToken } from "@/utils/auth";
import receiveBtn from "@/components/proof/receiveBtn.vue";
import poView from "./components/poView.vue"
import Counter from "@/components/proof/Counter.vue"
const { proxy } = getCurrentInstance();
const { ac_digital_print_status, prepress_file_status,perperss_remark_type,ac_proof_type } = proxy.useDict(
  "ac_digital_print_status",
  "prepress_file_status",
  "perperss_remark_type",
  "ac_proof_type"
);
const digitalType = [
  { label: "大货数码", value: "0" },
  { label: "精装盒打样数码", value: "1" },
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
  receiveParam: {
    activityId: "",
  },
  // 驳回参数
  refusalParams: {
    poNo: "", // poNo
    remark: "", // 备注
    activityId: "", //文件制作流程ID
    orderNo:'', //订单号
    remarkImages:'',//驳回图片
    type:'' //订单类型：0大货 1打样
  },
  refusalRules: {
    remark: [{ required: true, message: "请填写驳回原因", trigger: "blur" }],
  },
});
const { formParams, refusalParams, refusalRules, receiveParam } = toRefs(data);
// 表格数据
const tableData = ref([]);
let isRefusalShow = ref(false);
let isDeliverShow = ref(false);
let historyDialog = ref(false);
// 历史列表数据
let historyListData = ref([]);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
let isShowDownBtn = ref(0);
const multipleTable = ref(null)
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
// 获取结构列表数据
function getList() {
  getDigitalList({
    ...formParams.value,
  }).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.rows.map(item=>{
        let reg = new RegExp("<.+?>","g")
        item.salesmanNote = item.salesmanNote.replace(reg,'')
        if (item.prepressFile && item.prepressFile.length > 0) {
        item.prepressFile = JSON.parse(item.prepressFile);
        item.cuttingFile = item.prepressFile.map((e) => {
          return e.cuttingFile;
        }).filter(a=>a);
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

        return item
      })
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
  formParams.value.pageNum = 1;
  getList();
  getCount()
}

/** 复制代码成功 */
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}
function historical(id){
  getLogs(id).then((res) => {
    if (res.code == 200) {
      if (res.data) {
        historyListData.value = res.data;
        historyDialog.value = true;
      }
    }
  });
}
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
  refusalParams.value.type = row.type
  isRefusalShow.value = true;
}
// 快递单号
const receiveSheet = (activityId) => {
  isDeliverShow.value = true;
  receiveParam.value.activityId = activityId;
};

function handleSizeChange() {
  getList();
}
getList();
// 驳回确认
const refusalAffirm = () => {
  proxy.$refs["formRefusal"].validate(async (valid) => {
    if (valid) {
      try {
        let params = {
          ...refusalParams.value
        }
       
        params.remarkImages = refusalParams.value.remarkImages?.split(',').filter(a=>a)
        let { code, msg } = await turnDown(params);
        if (code == 200) {
          getList();
          ElMessage.success('驳回成功');
        } else {
          // ElMessage.error(msg);
        }
        proxy.resetForm("formRefusal");
        isRefusalShow.value = false;
      } catch (err) {
        proxy.resetForm("formRefusal");
        isRefusalShow.value = false;
      }
    } else {
    }
  });
};

const receiveAffirm = () => {
  try {
    getTask(receiveParam.value.activityId).then((res) => {
      if (res.code === 200) {
        ElMessage.success("领取成功");
        getList();
      }
      isDeliverShow.value = false;
    });
  } catch (err) {
    isDeliverShow.value = false;
  }
};

function cancel() {
  refusalParams.value.remarkImages=[]
  proxy.resetForm("formRefusal");
  isRefusalShow.value = false;
}
// 处理数据
function getCount(){
  getTaskCount(formParams.value).then(res=>{
    if (res.code==200) {
      processing.value = res.data.processingCount
      toBeProcessed.value = res.data.waitingCount
    }
  })
}
getCount()
function receiveCancel() {
  isDeliverShow.value = false;
}
// 下载禁用
function downDisabled(file, status) {
  
  switch (status) {
    case 1:
      if (file.structuralFile || file.structureFile.length>0) {
        console.log(21123);
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
  window.open(senseUrl(BASE_FILE_URL + url), "_blank");
}
function disabled(status){

  if (status == 1 || status ==4 || status == 0) {
    return false;
  } else {
    //置灰
    return true;
  }

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
      -webkit-line-clamp: 6;
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
:deep(.el-popper){
  max-width:400px;
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

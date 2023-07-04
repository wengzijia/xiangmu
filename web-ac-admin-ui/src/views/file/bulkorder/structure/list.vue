<template>
  <div>
    <div class="artwork-workbench">
      <listLayout>
      <template #header>
        <div class="top-bar">
          <el-form inline :model="formParams" class="condition" label-width="115px" ref="queryRef">
            <!-- 大货订单类型 -->
            <el-form-item
              label="品类:"
              prop="orderType"
            >
              <el-select
                v-model="formParams.orderType"
                class="headerinp"
                clearable
                placeholder="全部品类"
              >
                <el-option
                  v-for="item in ac_original_order_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click="orderTypeChange(item.value)"
                />
              </el-select>
            </el-form-item>
            <!-- PO编号 -->
            <el-form-item label="PO号:" prop="poNo">
              <el-input
                v-model.trim="formParams.poNo"
                placeholder="请输入PO号"
                clearable
                class="headerinp"
              />
            </el-form-item>
            <!-- 结构状态 -->
            <el-form-item label="结构状态:" prop="status">
              <el-select
                v-model="formParams.status"
                class="headerinp"
                placeholder="所有状态"
                clearable
              >
                <template v-for="item in ac_structure_status" :key="item.value">
                  <el-option
                    v-if="item.label != '未领取'"
                    :label="item.label"
                    :value="item.value"
                    @click="outworkStatusChange(item.value)"
                  />
                </template>
              </el-select>
            </el-form-item>
            <!-- 结构完成时间 -->
            <el-form-item label="结构完成时间:">
              <el-date-picker
                class="headerinp"
                v-model="donetime"
                type="daterange"
                unlink-panels
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <!-- 业务员 -->
            <el-form-item label="业务员:" prop="salesman">
              <el-input
                class="headerinp"
                v-model.trim="formParams.salesman"
                placeholder="请输入业务员名称"
              />
            </el-form-item>
          </el-form>
          <div class="btnBox">
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
        </div>
      </template>
      <!-- 列表文字和导出 -->
      <template #table-header>
        <div class="titleBox">
          <div class="listText">我的结构文件列表</div>
          <div class="disposeBox">
            <el-button @click="expExcel">导出</el-button>
          </div>
        </div>
      </template>
      <!-- 空状态 -->
      <!-- <el-empty description="暂无数据" /> -->
      <!-- 结构文件列表  -->
      <template #table-content='tableHeight'>
      <div class="outworkListBox">
        <el-table :data="tableData" :height='tableHeight.tableHeight' scrollbar-always-on row-key="id" ref="multipleTable">
          <el-table-column label="PO号" width="200">
            <template #default="scope">
              <div>
                <poView :po-no="scope.row.poNo" type="2"></poView>
                <!-- <span>{{ scope.row.poNo || "-" }}</span>
                <el-icon
                  v-copyText="scope.row.poNo"
                  v-copyText:callback="copyTextSuccess"
                  v-if="scope.row.poNo"
                  class="gesture"
                >
                  <CopyDocument />
                </el-icon> -->
              </div>
              <el-tag hit>{{scope.row.productName}}</el-tag>
              <div style="margin-top: 5px" v-if="scope.row.isAgain">
                <el-tag style="background:#169BD5;color:#fff;">翻单订单</el-tag>
              </div>
              <div class="divsn" v-if="scope.row.originalBulkOrderNumber">
                <p>原大货订单号：</p>
                <poView :po-no="scope.row.originalBulkOrderNumber" type="2" :copy="false"></poView>
              </div>
              <div class="divsn" v-if="scope.row.associatedTrackingNumber">
                <p>关联打样订单号：</p>
                <poView :po-no="scope.row.associatedTrackingNumber" :copy="false"></poView>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="业务员" width="200px">
            <template #default="scope">
              <div>
                <p v-show="scope.row.salesman">
                  <span class="TimeTitle">业务员：</span><br/>
                  <span class="TimeCon">{{ scope.row.salesman || "-" }}</span>
                </p>
                <p v-show="scope.row.createTime">
                  <span class="TimeTitle">推送结构时间：</span>
                  <br/>
                  <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工单参数" width="310">
            <template #default="scope">
                 <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.id"  type="structure"></OrderAttrShow>
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
          <el-table-column label="文件下载" >
            <template #default="scope">
              <div v-if="scope.row.customerFiles?.length > 0"  class="gesture">
                <template
                  v-for="(item, index) in scope.row.customerFiles"
                  :key="index"
                >
                  <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                </template>
            </div>
            <div v-if="scope.row.productName.indexOf('精装盒')>-1">
              <el-button
                :disabled="downDisabled(scope.row.annexVOS, 1)"
                @click="downFile(scope.row.annexVOS, 1,scope.row.poNo)"
                >下载结构文件</el-button
              >
            </div>
            <template v-else>
              <div v-if="scope.row.annexVOS?.length > 0" class="gesture">
                <FileShow
                  v-for="item in scope.row.annexVOS"
                  :key="item.fileAddress"
                  :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"
                  title="结构文件："
                ></FileShow>
              </div>
            </template>

            </template>
          </el-table-column>
          <el-table-column label="状态/耗时(小时)" width="150">
            <template #default="scope">
              <div>
                {{ scope.row.status || "-" }}
                <span v-show="scope.row?.duration">/{{scope.row?.duration}}</span>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="业务员" width="200">
            <template #default="scope">
              <div>{{ scope.row.salesman || "-" }}</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="结构文件" width="200">
            <template #default="scope">
              <div v-if="scope.row.annexVOS?.length > 0">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  v-for="(item, index) in scope.row.annexVOS"
                  :key="item.sort"
                  :content="item.fileName"
                >
                  <template #reference>
                    <div
                      class="text-overflow gesture"
                      style="width: 180px"
                      @click="openFile(item.fileAddress)"
                    >
                      <span v-if="scope.row.annexVOS.length > 1"
                        >部件{{ toChineseNumber(index + 1) }}:</span
                      >
                      {{ item.fileName }}
                    </div>
                  </template>
                </el-popover>
              </div>
              <div v-if="scope.row.annexVOS == null">-</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="涂胶水位置" width="200">
            <template #default="scope">
              <div v-if="scope.row.annexVOS?.length > 0">
                <div v-if="judgeShow(scope.row.annexVOS, 'position')">
                  <div
                    placement="top-start"
                    trigger="hover"
                    v-for="(item, index) in scope.row.annexVOS"
                    :key="item.sort"
                  >
                    <div
                      class="text-overflow"
                      style="width: 180px"
                      v-if="item.position"
                    >
                      <span v-if="scope.row.annexVOS.length > 1"
                        >部件{{ toChineseNumber(index + 1) }}:</span
                      >
                      {{ item.position }}
                    </div>
                  </div>
                </div>
                <div v-else>-</div>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="是否转单" width="200">
            <template #default="scope">
              <div>{{ scope.row.transfer || "-" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="客户源文件上传时间" width="200">
              <template #default="scope" >
              <div v-if="scope.row.customerFiles.length>0">
                {{ scope.row.customerFiles[0].uploadTime  }}
              </div>
              <div v-else> - </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="结构文件上传时间" width="200">
            <template #default="scope">
              <div>{{ scope.row.uploadTime || "-" }}</div>
            </template> -->
            <!-- <template #default="scope">
              <div
                v-show="scope.row.annexVOS.length > 0"
                v-for="item in scope.row.annexVOS"
                :key="item.sort"
              >
                {{ item.updateTime || "-" }}
              </div>
              <div v-if="scope.row.annexVOS == null">-</div>
            </template> -->
          <!-- </el-table-column> -->
          <el-table-column label="备注" width="200">
            <template #default="scope">
              <div v-if="scope.row.orderRemark">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="CommentPopup(scope.row.orderRemark,'订单备注')"
                  >订单备注</el-link>
              </div>
              <div v-if="scope.row.remark">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="remarkclick(scope.row.remark)"
                  >结构备注</el-link>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="结构完成时间" width="200">
            <template #default="scope">
              <div>{{ scope.row.finishTime || "-" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="结构耗时(小时)" width="200">
            <template #default="scope">
              <div>{{ scope.row.duration || "-" }}</div>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="240">
            <template #default="scope">
              <div class="operate">
                <!-- <el-link
                  type="primary"
                  :underline="false"
                  class="mar_10"
                  @click="catDetail(scope.row.id)"
                  >查看详情</el-link
                > -->
                <div style="color: #409eff; cursor: pointer" @click="historical(scope.row.id)">
                  处理历史
                </div>
                <el-link
                  v-if="scope.row.status=='已完成'"
                  type="primary"
                  :underline="false"
                  class="mar_10"
                  @click="withdraw(scope.row.id)"
                  >撤回结构</el-link
                >
                <el-popover placement="bottom" width="300px;" trigger="click" v-if="false">
                  <template #reference>
                    <el-button size="small" style="margin-left: 10px">
                      <el-icon>
                        <More />
                      </el-icon>
                    </el-button>
                  </template>
                  <div>
                    <el-button
                      text
                      :disabled="downDisabled(scope.row.customerFiles, 0)"
                      @click="downFile(scope.row.customerFiles, 0)"
                      >下载客户源文件</el-button
                    >
                  </div>
                  <div>
                    <el-button
                      text
                      :disabled="downDisabled(scope.row.annexVOS, 1)"
                      @click="downFile(scope.row.annexVOS, 1)"
                      >下载结构文件</el-button
                    >
                  </div>
                </el-popover>
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
      <!-- <div style="height: 800px">
        <iframe :src="pdfSrc" frameborder="0" style="width:100%; height: 100%"></iframe>
      </div> -->
      <!-- 属性弹框 -->
      <div class="is-align-center">
        <el-dialog v-model="isAttrShow" title="属性详情" width="600px">
         <div style="line-height:2">{{ attrContent }}</div>
          <template #footer>
            <span>
              <el-button type="primary" @click="isAttrShow = false"
                >关闭</el-button
              >
            </span>
          </template>
        </el-dialog>
      </div>
      <HistoryDialog v-if="historyDialog" :historyListData="historyListData" hideremark v-model:historyShow="historyDialog" />
      <!-- 撤回结构弹窗 -->
      <div class="revokeOutwork">
        <el-dialog v-model="isRevokeShow" title="撤回" width="800px" destroy-on-close :before-close="cancel">
          <!-- <div>是否立即发起撤单申请</div> -->
          <el-form
            :rules="refusalRules"
            :model="cancelParam"
            ref="formRefusal"
            label-width="120px"
            class="demo-ruleForm"
          > 
            <el-form-item label="撤回原因:" prop="remark" style="margin-top:20px">
            <!-- <el-input
                v-model.trim="cancelParam.remark"
                type="textarea"
                placeholder="请输入撤单备注内容"
                autocomplete="off"
                show-word-limit
                maxlength="300"
                resize="none"
                rows="6"
              /> -->
                <Editor v-model:html="cancelParam.remark" ></Editor>
            </el-form-item>
          </el-form>

          <div class="btnBox">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="withdrawAffirm">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-dialog v-model="RemarkShow" title="结构备注" :close-on-click-modal="false" destroy-on-close align-center
          width="800px" class="historyPopupBox">
          <Editor v-model:html="remarkTxt" :edit="false"></Editor>
      </el-dialog>
      <!-- <EditorRemark v-if="RemarkShow" :remarkTxt="remarkTxt" v-model:RemarkShow="RemarkShow"/> -->
    </div>
  </div>
</template>
<script setup>
// 域名
import { BASE_FILE_URL } from "@/store/global-constant";
import Editor from "@/components/Editor"
import { download } from "@/utils/request";
import {
  getStructuralList,
  getExport,
  getStructuralCancel,
} from "@/api/structural/myStructural";
import { getInfo } from "@/api/structural/structuralList";
import { refusalOutwork, exp } from "@/api/outworkManage/myOutworkList";
import { agreeModifyRemark } from "@/api/outworkManage/outworkFileBench";
import { formatDates,senseUrl,CommentPopup } from "@/utils/index";
import { zipDownload } from "@/api/download";
import { toChineseNumber,getNowDate,getText } from "@/utils/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { reactive, toRefs } from "@vue/reactivity";
import OrderAttrShow from "@/components/OrderAttrShow/order.vue"
import { nextTick, watch } from 'vue';
import poView from "../../../proof/components/poView.vue"
const { proxy } = getCurrentInstance();
const { ac_original_order_type, ac_structure_status } = proxy.useDict(
  "ac_original_order_type",
  "ac_structure_status"
);
const router = useRouter();
// 绑定的时间值(默认三个月)
let donetime = ref([
  formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),
  formatDates(new Date().getTime() + 3600 * 1000 * 24 * 1),
]);
// 表格数据
let tableData = ref([]);
// 总条数
let total = ref(0);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
// 撤回正稿id
let withdrawId = ref("");
let RemarkShow = ref(false);
let remarkTxt = ref("");
// 是否显示正稿驳回弹窗
let isRevokeShow = ref(false);
const data = reactive({
  formParams: {
    poNo: "", // po号(订单编号)
    orderType: "1", // 大货订单类型值
    salesman: "", // 业务员
    startTime: formatDates(new Date(donetime.value[0]).getTime()), // 开始时间
    endTime: formatDates(new Date(donetime.value[1]).getTime()), // 结束时间
    status: "", // 正稿文件状态值
    current: 1, // 页数
    size: 10, // 每页条数
    proofType:0, //打样类型：1打样，0大货
  },
   cancelParam:{
    id:'',
    remark:''
  }
});
const validateFirstEditor = (rule, value, callback) => {
  if (value == ""||!getText(value)) {
    console.log(getText(value));
    callback(new Error("请填写撤回原因"));
  } else {
    callback();
  }
};
let refusalRules={
  remark: [
      { 
          required: true,
          validator: validateFirstEditor,
          trigger: "blur", 
      }
  ]
}
let historyListData = ref([]);
let historyDialog = ref(false);
const { formParams,cancelParam } = toRefs(data);
const multipleTable = ref(null)
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
// 获取结构列表数据
function getList() {
  getStructuralList(formParams.value).then((res) => {
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
const remarkclick = (data) => {
  RemarkShow.value=true
  remarkTxt.value=data
}
getList();
// 大货订单类型改变
const orderTypeChange = (value) => {};
// 正稿文件状态改变
const outworkStatusChange = (value) => {};
// 设置时间
function setTime() {
  formParams.value.startTime =
    donetime.value && donetime.value[0]
      ? formatDates(new Date(donetime.value[0]).getTime())
      : ""; // 开始时间
  formParams.value.endTime =
    donetime.value && donetime.value[1]
      ? formatDates(new Date(donetime.value[1]).getTime())
      : ""; // 结束时间
}
function resetQuery() {
  proxy.resetForm("queryRef");
  donetime.value = [
    formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),
    formatDates(new Date().getTime() + 3600 * 1000 * 24 * 1),
  ]; // 绑定的时间值(默认三个月)
  setTime();
  search();
}
// 搜索
const search = () => {
  setTime();
  formParams.value.current = 1;
  getList();
};
function historical(id){
  getInfo({id}).then((res) => {
    if (res.code == 200) {
      if (res.data) {
        historyListData.value = res.data.historyLog;
        historyDialog.value = true;
      }
    }
  });
}
// 导出excel
async function expExcel() {
  setTime();
  let param = {
    poNo: formParams.value.poNo, // po号(订单编号)
    orderType: formParams.value.orderType, // 大货订单类型值
    salesman: formParams.value.salesman, // 业务员
    startTime: formParams.value.startTime, // 开始时间
    endTime: formParams.value.endTime, // 结束时间
    status: formParams.value.status, // 正稿文件状态值
    proofType:0, 
  };
  download(
    "/file-task/structural-design/self-design/export",
    param,
    `我的结构文件列表_${formatDates(new Date().getTime())}.xlsx`
  );
}
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

// 获取路径的名字
function fileName(url) {
  if (url) {
    let urlList = url.split("filemanage");
    return urlList[urlList.length - 1];
  }
}

// 格式校验
function checkFormat(data, status) {
  // 1 图片  2 视频
  // 图片格式
  let imgReg = /.(png|jpeg|jpg)$/i;
  // 视频格式
  let videoReg = /.mp4$/i;
  if (status == 1 && imgReg.test(data)) {
    return true;
  }
  if (status == 2 && videoReg.test(data)) {
    return true;
  }
  return false;
}
// 查看详情
const catDetail = (id) => {
  router.push({
    path: "structureDetails",
    query: { taskId: id, menuName: "我的结构文件列表" },
  });
};

// 撤回结构
function withdraw(id) {
  withdrawId.value = id;
  isRevokeShow.value = true;
}

// 撤回结构确认
function withdrawAffirm() {
  proxy.$refs["formRefusal"].validate(async (valid) => {
    if (valid) {
      try {
        cancelParam.value.id = withdrawId.value
        getStructuralCancel({...cancelParam.value}).then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.msg);
            getList();
          }
          isRevokeShow.value = false;
        });
      } catch (err) {
        isRevokeShow.value = false;
      }
    } else {
    }
  });
  return
  
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

// 下载文件
async function downFile(file, status,po='') {
  // 0 客户源文件    1 结构文件
  let name = "";
  if (status == 1) {
    name = po+"-"+getNowDate();
  } else {
    name = "客户源文件";
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
function handleSizeChange(){
    getList();
}
function cancel(){
  isRevokeShow.value = false
  cancelParam.value.remark=""
}
// 打开文件
function openFile(url) {
  window.open(senseUrl(BASE_FILE_URL + url), "_blank");
}
function judgeShow(val, judge) {
  let isShow = false;
  if (judge == "length") {
    return (isShow = val.some((item) => {
      return item.length;
    }));
  } else {
    return (isShow = val.some((item) => {
      return item.position;
    }));
  }
}
</script>

<style lang="scss" scoped>
.artwork-workbench {
  .top-bar {
    // .condition{
    //   display: flex;
    // }
    .btnBox {
      text-align: right;
      padding-right: 38px;
    }
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
.divsn{
  p{
    font-weight: 600;
    margin: 5px 0 0 0;
    height: 17px;
  }
  span{
    color: #409EFF;
  }
}
  // 列表
  .outworkListBox {
    .turn {
      display: inline-block;
      width: 20px;
      line-height: 20px;
      background-color: #ff3399;
      color: #ffffff;
      text-align: center;
      margin-right: 4px;
    }
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
  // 设计制作需求描述弹窗
  .resourceBox {
    .nameBox {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      margin-top: 20px;
    }
  }
  // 撤回正稿弹窗
  .revokeOutwork {
    .btnBox {
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
  // 备注授权弹窗
  .mandate {
    .mandateBtn {
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
/*  鼠标按下手势  */
.gesture {
  cursor: pointer;
}
.mar_10 {
  margin-right: 10px;
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
</style>
<style >
.popper_note {
  max-width:400px !important;
  width:400px !important;
  word-break: break-all;
}
</style>

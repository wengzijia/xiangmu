<!-- 打样数码切割列表 -->
<template>
  <div>
    <div class="proofElCutBox">
      <listLayout>
      <template #header>
      <div class="top-bar">
        <el-form
          inline
          :model="formParams"
          class="condition filterForm"
          label-width="80px"
          ref="formRef"
        >
          <!-- PO号 -->
          <el-form-item label="PO号:" prop="poNo">
            <el-input
              class="headerinp"
              v-model.trim="formParams.poNo"
              clearable
              placeholder="请输入PO号"
            />
          </el-form-item>
          <!-- 打样编号 -->
          <!-- <el-form-item label="打样编号:" prop="proofNo">
          <el-input
            style="width:252px;"
            v-model.trim="formParams.proofNo"
            clearable
            placeholder="请输入打样编号"
          />
        </el-form-item> -->
          <!-- 状态 -->
          <el-form-item label="状态:" prop="status">
            <el-select
              class="headerinp"
              v-model="formParams.status"
              clearable
              filterable
              placeholder="全部状态"
            >
              <el-option
                v-for="item in ac_cutting_list_status" v-show="item.label!='客户撤单'"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- 数码类型 -->
          <el-form-item label="数码类型:" prop="orderType">
            <el-select
              class="headerinp"
              v-model="formParams.orderType"
              clearable
              filterable
              placeholder="全部类型"
            >
              <el-option
                v-for="item in technoTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btnBox">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>
      </template>
      <template #table-header>
      <div class="top-bar">
        <div class="titleBox">
          <div class="listText">
            数码切割列表
          </div>
          <div class="disposeBox">
            <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>            
          </div>
        </div>
      </div>
    </template>
      <!-- 打样数码切割列表  -->
      <template #table-content='tableHeight'>
      <div class="proofElCutList">
        <el-table
          :data="tableData"
          :height='tableHeight.tableHeight'
          scrollbar-always-on
          row-key="activityId"
          ref="multipleTable"
        >
          <el-table-column label="PO号" width="200">
            <template #default="scope">
              <div>
                <poView :po-no="scope.row.poNo"></poView>
                <!-- <span>{{ scope.row.poNo || "-" }}</span>
                <el-icon
                  v-copyText="scope.row.poNo"
                  v-copyText:callback="copyTextSuccess"
                  ><CopyDocument
                /></el-icon> -->
              </div>
              <div>
                <!-- <el-tag v-if="scope.row.proofingType" effect="dark">{{
                  scope.row.proofingType < 2
                    ? "大货免费打样"
                    : scope.row.proofingType < 3
                    ? "打样订单"
                    : "内部打样"
                }}</el-tag> -->
                <DictTag
                :value="scope.row.proofingType"
                :options="ac_proof_type"
              />
              </div>
              <div style="margin-top:10px;">
                <el-tag v-if="scope.row.productName">{{scope.row.productName}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工单参数" width="310">
            <template #default="scope">
              <OrderAttrShow
                :attr="scope.row.productAttr"
                :activityId="scope.row.activityId"
                :lineFeed="(scope.row.productName&&!(scope.row.productName.indexOf('精装盒')!=-1||scope.row.productName.indexOf('双驳盒')!=-1))"
              ></OrderAttrShow>
              <!-- <el-link v-if="scope.row.productAttr" :underline="false" @click="seeAll(scope.row.productAttr)">
              <div class="property">{{scope.row.productAttr}}</div>
            </el-link>
            <div v-else>-</div> -->
            </template>
          </el-table-column>
          <!-- <el-table-column label="品类">
            <template #default="scope">
              <div>{{ scope.row.productName || "-" }}</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="数量">
            <template #default="scope">
              <div>{{ scope.row.productNumber || "-" }}</div>
            </template>
          </el-table-column> -->
        
          <el-table-column label="业务员">
            <template #default="scope">
              <!-- <div v-if="scope.row.producerName">数码切割领取人:{{ scope.row.producerName || "-" }}</div>
              <div>
                数码切割状态:
                <DictTag
                  :value="scope.row.status"
                  :options="ac_cutting_list_status"
                />
              </div> -->
              <p v-show="scope.row.salesman">
                <span class="TimeTitle">业务员:</span><br/>
                <span class="TimeCon">{{ scope.row.salesman || "-" }}</span>
              </p>
              <p v-show="scope.row.createTime">
                  <span class="TimeTitle">推送切割时间：</span>
                <br/>
                <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
              </p>
              <p v-show="scope.row.pushTime">
                <span class="TimeTitle">数码切割领取人:</span>
                <br/>
                <span class="TimeCon">{{ scope.row.producerName || "-" }}</span>
              </p>
              <p>
                <span class="TimeTitle">数码切割状态:</span>
                <br/>
                <span class="TimeCon">
                  <el-tag hit><DictTag
                    :value="scope.row.status"
                    :options="ac_cutting_list_status"
                  /></el-tag>
                </span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="文件下载" width="380">
            <template #default="scope">
              <!-- <div
                v-if="
                  scope.row.structureFile && scope.row.structureFile.length > 0
                "
              >
               <div v-for="(item, index) in scope.row.structureFile"  :key="index">
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="fileName(item.url)"
                  >
                    <template #reference>
                      <div class="text-overflow gesture">
                        <a
                          :href="BASE_FILE_URL + item.url"
                          target="_blank"
                        >
                          {{ fileName(item.name) }}</a
                        >
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div> -->
              <div
                v-if="
                   scope.row.customerFile && JSON.parse(scope.row.customerFile) &&
                  JSON.parse(scope.row.customerFile).length > 0
                "
              >
                <template
                  v-for="(item, index) in JSON.parse(scope.row.customerFile)"
                  :key="index"
                >
                  <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                </template>
              </div>
              <div
                v-if="
                  scope.row.structuralFile &&
                  scope.row.structuralFile.length > 0
                "
              >
                <div
                  v-for="(item, index) in scope.row.structuralFile"
                  :key="index"
                >
                  <!-- <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="fileName(item.fileAddress)"
                  >
                    <template #reference>
                      <div class="text-overflow gesture">
                        <a
                          :href="senseUrl(BASE_FILE_URL + item.fileAddress)"
                          target="_blank"
                        >
                        {{ fileName(item.fileName) }}</a
                        >
                      </div>
                    </template>
                  </el-popover> -->
                  <FileShow title="打样结构：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                </div>
              </div>
              <div
                v-else-if="
                  scope.row.structureFile && scope.row.structureFile.length > 0
                "
              >
                <div
                  v-for="(item, index) in scope.row.structureFile"
                  :key="index"
                >
                  <!-- <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="item.url"
                  >
                    <template #reference>
                      <div class="text-overflow gesture">
                        <a :href="senseUrl(BASE_FILE_URL + item.url)" target="_blank">
                          {{ item.name }}</a
                        >
                      </div>
                    </template>
                  </el-popover> -->
                  <FileShow title="打样结构：" :filename="item.name" :fileurl="senseUrl(BASE_FILE_URL + item.url)"/>
                  
                </div>
              </div>
              <div v-if="scope.row.orPrepressFile&&scope.row.orPrepressFile.length" class="gesture">
                <template v-for="(item, index) in scope.row.orPrepressFile" :key="index">
                      <FileShow title="打样印前：" :filename="item.name" :fileurl="senseUrl(BASE_FILE_URL + item.url)"/>
                </template>
              </div>

              <div
                v-if="scope.row.cuttingFile && scope.row.cuttingFile.length > 0"
              >
                <div
                  v-for="(item, index) in scope.row.cuttingFile"
                  :key="index"
                >
                  <FileShow title="数码切割：" :filename="item.name" :fileurl="senseUrl(BASE_FILE_URL + item.url)"/>
                </div>
                <!-- :content="fileName(item.cuttingFile.url)" -->
              </div>

              
            </template>
          </el-table-column>

          <!-- <el-table-column label="切割文件" width="210">
            <template #default="scope">
              <div
                v-if="scope.row.cuttingFile && scope.row.cuttingFile.length > 0"
              >
                <div
                  v-for="(item, index) in scope.row.cuttingFile"
                  :key="index"
                >
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="item.url"
                  >
                    <template #reference>
                    
                      <div class="text-overflow gesture">
                        <a :href="senseUrl(BASE_FILE_URL + item.url)" target="_blank">
                        {{item.name}}</a
                        >
                      </div>
                    </template>
                  </el-popover>
                </div> -->
                <!-- :content="fileName(item.cuttingFile.url)" -->
              <!-- </div>
              <div v-else>-</div>
            </template>
          </el-table-column> -->
          
          <!-- <el-table-column label="印前备注">
            <template #default="scope">
              <div v-if="scope.row.prepressRemark">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="scope.row.prepressRemark"
                  popper-class="popper_note"
                >
                  <template #reference>
                    <div class="text-overflow" style="width: 153px">
                      {{ scope.row.prepressRemark }}
                    </div>
                  </template>
                </el-popover>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="结构备注">
            <template #default="scope">
              <div v-if="scope.row.structuralRemark">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="scope.row.structuralRemark"
                  popper-class="popper_note"
                >
                  <template #reference>
                    <div class="text-overflow" style="width: 153px">
                      {{ scope.row.structuralRemark }}
                    </div>
                  </template>
                </el-popover>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="数码切割状态">
            <template #default="scope">
              <DictTag
                :value="scope.row.status"
                :options="ac_cutting_list_status"
              />
            </template>
          </el-table-column> -->
          <el-table-column label="备注" width="120px">
            <template #default="scope">
              <RemarkDialog
                :order="scope.row"
                :showButton="scope.row?.remarkFlag == 2"
                type="cutting"
                @getList="getList"
                :perperss_remark_type="perperss_remark_type"
              />
              <div>
                <el-link
                  v-if="scope.row.customerNote"
                  type="primary"
                  :underline="false"
                  @click="showAttr(scope.row.customerNote,'客户订单备注')"
                  >客户订单备注</el-link
                >
              </div>
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
            </template>
          </el-table-column>
          <el-table-column label="印前文件状态">
            <template #default="scope">
              <div>
                <DictTag :value="scope.row.status" :options="ac_cutting_list_status"/>
                <!-- {{ prepressStatusMap[scope.row.prepressFileStatus] || "-" }} -->
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="业务备注" width="200">
          <template #default="scope">
            <div v-if="scope.row.salesmanNote">
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="scope.row.salesmanNote"
                popper-class="popper_note"
              >
                <template #reference>
                  <div class="text-overflow" style="width: 153px">
                    {{ scope.row.salesmanNote }}
                  </div>
                </template>
              </el-popover>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column> -->
          <!-- <el-table-column label="客户订单备注">
            <template #default="scope">
              <div v-if="scope.row.customerNote">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="scope.row.customerNote"
                  popper-class="popper_note"
                >
                  <template #reference>
                    <div class="text-overflow" style="width: 153px">
                      {{ scope.row.customerNote }}
                    </div>
                  </template>
                </el-popover>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="业务员">
            <template #default="scope">
              <div>{{ scope.row.salesman || "-" }}</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="客户源文件" width="210">
            <template #default="scope">
              <div
                v-if="
                   scope.row.customerFile && JSON.parse(scope.row.customerFile) &&
                  JSON.parse(scope.row.customerFile).length > 0
                "
              >
                <template
                  v-for="(item, index) in JSON.parse(scope.row.customerFile)"
                  :key="index"
                >
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="fileName(item.fileName)"
                  >
                    <template #reference>
                      <div
                        class="text-overflow gesture"
                        :style="
                          JSON.parse(scope.row.customerFile).length > 1
                            ? 'width:180px;'
                            : 'width:190px;'
                        "
                      >
                        <a
                          :href="senseUrl(BASE_FILE_URL + item.fileAddress)"
                          target="_blank"
                          ><span
                            v-if="JSON.parse(scope.row.customerFile).length > 1"
                            >部件{{ toChineseNumber(item.sort) }}:</span
                          >
                          {{ fileName(item.fileName) }}</a
                        >
                      </div>
                    </template>
                  </el-popover>
                </template>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <div class="operate">
                <!-- <p>
                <el-link
                  type="primary"
                  :underline="false"
                  :style="
                    rejectDisabled(scope.row.status)
                      ? 'color:#9fceff;cursor: not-allowed;'
                      : ''
                  "
                     :disabled="disabled(scope.row.status)"
                  @click="
                    reject(
                      scope.row.status,
                      scope.row.activityId,
                      scope.row.orderNo,
                      scope.row.poNo,
                      scope.row.type
                    )
                  "
                  >驳回</el-link
                >
                </p> -->
                <!-- <el-link
                  style="margin: 0 10px"
                  type="primary"
                  :underline="false"
                  :disabled="!!scope.row.status"
                  @click="receive(scope.row.activityId)"
                  >领取</el-link
                > -->
                <!-- <receiveBtn :row="scope.row" :getTask="getTask" :id='scope.row.activityId' @updatelist="getList"></receiveBtn> -->
                <div style="color: #409eff; cursor: pointer" @click="historical(scope.row.activityId)">
                  处理历史
                </div>
                <el-popover v-if="false" placement="bottom" width="300px;" trigger="click">
                  <template #reference>
                    <el-button
                      @click="isShowDownBtn = scope.row.id"
                      size="small"
                    >
                      <el-icon><More /></el-icon>
                    </el-button>
                  </template>
                  <div class="downBoX">
                    <div>
                      <el-button
                        class="downBtn"
                        text
                        @click="downCut(scope.row, 2)"
                          :disabled="downDisabled(scope.row.orPrepressFile, 3)"
                        >下载印前文件</el-button
                      >
                    </div>
                    <div>
                      <el-button
                        class="downBtn"
                        text
                        :disabled="downDisabled(scope.row, 1)"
                        @click="
                          downCut(
                            scope.row,
                            4,
                            scope.row.structuralFile
                          )
                        "
                        >下载结构文件</el-button
                      >
                    </div>
                    <div>
                      <el-button
                        class="downBtn"
                        text
                        :disabled="downDisabled(scope.row.cuttingFile, 3)"
                        @click="downCut(scope.row, 1)"
                        >下载切割文件</el-button
                      >
                    </div>
                    <div>
                      <el-button
                        class="downBtn"
                        text
                        :disabled="downDisabled(scope.row.customerFile, 3)"
                        @click="downCut(scope.row, 3)"
                        >下载客户文件</el-button
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
      <!-- 分页 -->
      <template #pagination>
      <div class="prooflaypage">
        <el-pagination
          v-model:currentPage="formParams.pageNum"
          v-model:page-size="formParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>
      </template>
      </listLayout>
      <!-- 属性弹框 -->
      <div class="is-align-center">
        <el-dialog v-model="isAttrShow" title="属性详情" width="600px">
          <el-scrollbar style="margin-right: 20px; height: 450px">
            <p style="line-height: 2">{{ attrContent }}</p>
          </el-scrollbar>
          <template #footer>
            <div>
              <el-button type="primary" @click="isAttrShow = false"
                >关闭</el-button
              >
            </div>
          </template>
        </el-dialog>
      </div>
      <!-- 打样数码切割驳回弹窗 -->
      <div class="is-align-center">
        <el-dialog
          v-model="isRefusalShow"
          title="驳回"
          width="600px"
          @close="closePopup(0)"
        >
          <el-form
            ref="rejectRef"
            :model="refusalParam"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="驳回原因:"
              prop="remark"
              :rules="[{ required: true, message: '请填写驳回原因' }]"
            >
              <el-input
                v-model.trim="refusalParam.remark"
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
                  v-model:modelValue="refusalParam.remarkImages"
                  del
                />
              </div>
            </el-form-item>
            <div style="display: flex; justify-content: right">
              <el-button @click="cancelPopup(0)">取消</el-button>
              <el-button type="primary" @click="refusalAffirm(rejectRef)"
                >确定</el-button
              >
            </div>
          </el-form>
        </el-dialog>
      </div>
      <!-- 历史弹窗 -->
      <HistoryDialog v-if="historyDialog" :historyListData="historyListData" v-model:historyShow="historyDialog" />
      <!-- 领取弹窗 -->
      <div class="is-align-center">
        <el-dialog
          v-model="isReceiveShow"
          title="确定领取数码切割任务?"
          width="600px"
        >
          <div>领取后请及时完成任务,请勿长时间搁置。</div>
          <div class="receiveBtnBox">
            <el-button @click="isReceiveShow = false">取消</el-button>
            <el-button type="primary" @click="receiveConfirm"
              >确定领取</el-button
            >
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
// 域名
import { BASE_FILE_URL } from "@/store/global-constant";
import { getCutList, turnDown, getTask,getTaskCount,getLogs } from "@/api/proofElCut/cutList";
// 打包下载
// import { downloadZip } from "@/utils/request";
// 将阿拉伯数字'1'转中文数'一'
import { toChineseNumber,senseUrl,CommentPopup } from "@/utils/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import OrderAttrShow from "@/components/OrderAttrShow";
import RemarkDialog from "@/components/RemarkDialog";
import { nextTick, watch } from 'vue';
import { downloadZip,download } from "@/utils/request2";
import { getToken } from "@/utils/auth";
import receiveBtn from "@/components/proof/receiveBtn.vue";
import poView from "./components/poView.vue"
import Counter from "@/components/proof/Counter.vue"
const router = useRouter();
const { proxy } = getCurrentInstance();
const { ac_cutting_list_status, perperss_remark_type, ac_proof_type } = proxy.useDict(
  "ac_cutting_list_status",
  "perperss_remark_type",
  "ac_proof_type"
);
// 印前状态处理
let prepressStatusMap = reactive({
  0: "未上传",
  1: "部分上传",
  2: "已上传",
});

const data = reactive({
  // 表单参数
  formParams: {
    poNo: "", // po号
    proofNo: "", // 打样编号
    status: "", // 状态
    orderType: "", // 数码类型
    pageNum: 1, // 页码
    pageSize: 10, // 页大小
  },
  // 驳回参数
  refusalParam: {
    activityId: "", // 文件制作流程ID
    orderNo: "", // 订单号
    poNo: "", // po号
    remark: "", // 驳回备注
    remarkImages: '', //驳回图片
    type: "", // 订单类型: 0 大货 1 打样
  },
});
const { formParams, refusalParam } = toRefs(data);
// 总条数
let total = ref(0);
// 数码类型列表
let technoTypeList = reactive([
  { label: "大货数码", value: 0 },
  { label: "精装盒打样数码", value: 1 },
]);
const multipleTable = ref(null)
// 表单ref
const formRef = ref("");
// 驳回ref
const rejectRef = ref("");

// 打样数码切割列表状态
let listStatus = ref([]);
// 领取参数
let receiverId = ref("");
// 表格数据
let tableData = ref([]);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
// 是否显示正稿驳回弹窗
let isRefusalShow = ref(false);
// 是否显示领取弹窗
let isReceiveShow = ref(false);

let historyDialog = ref(false);
// 历史列表数据
let historyListData = ref([]);
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
// 清空表单
function clearForm(val) {
  proxy.resetForm(val);
}

// 获取路径的名字
function fileName(url) {
  if (url && url.includes("filemanage/")) {
    let urlList = url.split("filemanage/");
    return urlList[urlList.length - 1];
  }
  return url;
}

// 获取打样数码切割列表数据
async function getList() {
  let { code, data } = await getCutList(formParams.value);
  if (code == 200) {
    tableData.value = data.rows.map((item) => {
      let reg = new RegExp("<.+?>", "g");
      item.salesmanNote = item.salesmanNote.replace(reg, "");
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
      // item.salesmanNote = item.salesmanNote.replace(/\s*/g,"")
      return item;
    });
    total.value = data.total;
    // console.log("tableData", tableData.value);
  }
  // console.log("data", data);
}

getList();

// 领取
function receive(id) {
  receiverId.value = id;
  isReceiveShow.value = true;
}

// 确定领取
async function receiveConfirm() {
  try {
    let { code, msg } = await getTask(receiverId.value);
    if (code === 200) {
      ElMessage.success("领取成功");
      isReceiveShow.value = false;
      getList();
    }
  } catch (err) {
    console.log(err.message);
    // ElMessage.error('领取失败')
    isReceiveShow.value = false;
  }
}

// 关闭弹窗
const closePopup = (type) => {
  console.log("关闭了");
  // 0 驳回
  if (type == 0) {
    clearForm("rejectRef");
    isRefusalShow.value = false;
  }
};
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
// 取消弹窗
function cancelPopup(type) {
  // 0 驳回
  if (type == 0) {
    clearForm("rejectRef");
    isRefusalShow.value = false;
  }
}

// 领取禁用
function collectDisabled(status) {
  // 0未领取、1未切割、2已切割、3已驳回、4被驳回、5客户撤单
  let disabledStatus = [1, 2, 3, 4, 5];
  if (disabledStatus.includes(status)) return;
  return false;
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
      }else{
        return true;
      }
      break;
  }
}

// 重置
const reset = () => {
  clearForm("formRef");
  search();
};
// 搜索
const search = () => {
  formParams.value.pageNum = 1;
  getList();
  getCount()
};
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

// 页数改变
function currentChange(value) {
  console.log("页数改变", value);
  formParams.value.pageNum = value;
  getList();
}

// 每页条数改变
function sizeChange(value) {
  console.log("每页条数改变", value);
  formParams.value.pageSize = value;
  getList();
}

// 驳回禁用
function rejectDisabled(status) {
  //   0未领取、1未切割、2已切割、3已驳回、4被驳回、5客户撤单
  // 禁用状态
  let disableStatus = [2, 3, 5];
  if (disableStatus.includes(status)) {
    return true;
  }
  return false;
}

// 驳回
const reject = (status, id, orderNo, poNo, type) => {
  if (rejectDisabled(status)) {
    ElMessage.error("已流转至下个流程，禁止操作");
    return;
  }
  refusalParam.value.activityId = id;
  refusalParam.value.orderNo = orderNo;
  refusalParam.value.poNo = poNo;
  refusalParam.value.type = type;
  isRefusalShow.value = true;
};

// 驳回确认
function refusalAffirm(formEl) {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        let params = {
          ...refusalParam.value,
        };
        params.remarkImages = refusalParam.value.remarkImages?.split(",").filter(a=>a);
        let { code, msg } = await turnDown(params);
        if (code == 200) {
          ElMessage.success("驳回成功");
          isRefusalShow.value = false;
          getList();
        }
      } catch (err) {
        // ElMessage.error('驳回失败')
        isRefusalShow.value = false;
      }
    } else {
      return false;
    }
  });
}

// 下载文件
function downFile(data, status, id) {
  // 0 下载印前文件 1 下载结构文件 2 下载切割文件  3 下载客户文件
  if (data && data.length > 0) {
    if (status == 0) {
      downloadZip(
        `/file-task/cutting/downloadPrepressFile/${id}`,
        "",
        "印前文件.zip"
      );
    } else {
      let statusMap = {
        1: "结构文件",
        2: "切割文件.zip",
        3: "客户文件",
      };
      let fileDTO = {
        name: statusMap[status],
        fileUrls: [],
      };
      data.forEach((item) => {
        fileDTO.fileUrls.push(item.fileAddress);
      });
      downloadZip(
        "/file-task/cutting/downloadFile",
        fileDTO,
        statusMap[status]
      );
    }
  }
}
function showAttr(text,type){
  ElMessageBox.alert(text, type, {
    confirmButtonText: '关闭',
    callback: () => {}
  })
}
function downCut(row, status, data) {
  if ( status==1||status == 2) {
        let arr = status==1?row.cuttingFile: row.orPrepressFile;
        let filename = status==1?'切割文件.':'印前文件.'
        console.log(arr)
        let index = 0;
        function dowFile(){
          let url = arr[index].url
          index = index+1
          let type = url.split('.')
          download('/alibaba/oss/downloadFile',{fileName:url},filename+type[type.length-1],{token:getToken()}).then(res=>{
            if(arr[index]){
              dowFile()
            }
          })
        }
        dowFile()
  } else {
    let fileList = []
    if(row.customerFile){
      let arr = JSON.parse(row.customerFile)
      fileList = [].concat(fileList,arr.map(e => e.fileAddress))
    }
    if(status!=3){
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
    }else{
      downloadZip('/alibaba/oss/zipDownload',{
        fileList,
        "name": "客户文件"
          },'客户文件.zip',{token:getToken()})
    }
  }
}
function disabled(status) {
  if (status == 0 || status == 1 || status == 4) {
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
.proofElCutBox {
  .top-bar {
    // .condition{
    //   display: flex;
    // }
    .btnBox {
      text-align: right;
      padding-right: 38px;
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
  // 打样数码切割列表
  .proofElCutList {
    margin-top: 20px;
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
  .receiveBtnBox {
    display: flex;
    justify-content: right;
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
<style>
.popper_note {
  max-width: 400px !important;
  width: 400px !important;
  word-break: break-all;
}
</style>

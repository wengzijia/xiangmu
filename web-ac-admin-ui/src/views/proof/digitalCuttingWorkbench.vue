<!-- 我的数码切割工作台 -->
<template>
  <div>
    <div class="myElCutBench">
      <listLayout>
      <template #header>
      <div class="top-bar">
        <el-form inline :model="formParams" class="condition filterForm" label-width="80px" ref="formRef">
          <!-- PO号 -->
          <el-form-item label="PO号:" prop="poNo">
            <el-input class="headerinp" v-model.trim="formParams.poNo" clearable placeholder="请输入PO号" />
          </el-form-item>
          <!-- 打样编号 -->
          <!-- <el-form-item label="打样编号:" prop="proofNo">
            <el-input class="headerinp" v-model.trim="formParams.proofNo" clearable placeholder="请输入打样编号" />
          </el-form-item> -->
          <!-- 状态 -->
          <el-form-item label="状态:" prop="status">
            <el-select
              class="headerinp"
              clearable
              filterable
              placeholder="全部状态"
              v-model="formParams.status"
            >
              <el-option
                v-for="item in ac_cutting_bench_status"
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
              clearable
              filterable
              placeholder="全部类型"
              v-model="formParams.orderType"
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
            数码切割工作台
            <el-badge :value="revokeMsgCount||0" :max="99" class="msgbtn" @click="showDialog">
              <el-button type="warning">撤单消息</el-button>
            </el-badge>
          </div>
          <!-- <el-link :underline="false" @click="showDialog" style="font-size:16px;">撤单消息<span>({{revokeMsgCount}})</span><span v-if="revokeMsgCount" class="red-dot"></span></el-link> -->
          <!-- <el-button type="primary" @click="Task">领取任务</el-button> -->
          <div class="disposeBox">
            <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>
          </div>
        </div>
      </div>
    </template>
      <!-- 我的数码切割工作台列表  -->
      <template #table-content='tableHeight'>
      <div class="myElCutBenchList">
        <el-table :data="tableData" :height='tableHeight.tableHeight' scrollbar-always-on row-key="activityId">
          <el-table-column label="PO号" width="300">
            <template #default="scope">
              <div>
                <poView :po-no="scope.row.poNo"></poView>
                <!-- <span>{{ scope.row.poNo || "-" }}</span>
                <el-icon
                  v-copyText="scope.row.poNo"
                  v-copyText:callback="copyTextSuccess"
                  v-if="scope.row.poNo"
                  >
                  <CopyDocument/>
                </el-icon> -->
              </div>
              <div v-for="(item, index) in ac_proof_type" :key="index">
                  <el-tag
                    class="mx-1"
                    hit
                    v-if="item.value == scope.row.proofingType"
                  >
                    {{ item.label }}
                  </el-tag>
                </div>
                <!-- <div v-if="scope.row.allowModificationOfDie" style="margin-top:5px">
                  <el-tag  hit style="font-size: 12px;">{{(scope.row.allowModificationOfDie==1?'允':'不')}}许对设计文件、刀模文件进行生产规范化修正</el-tag>
                </div> -->
                <div style="margin-top: 5px">
                  <el-tag hit>{{scope.row.productName}}</el-tag>
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
                  ><CopyDocument
                /></el-icon>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="工单参数" width="310">
            <template #default="scope">
              <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.activityId" :lineFeed="(scope.row.productName&&!(scope.row.productName.indexOf('精装盒')!=-1||scope.row.productName.indexOf('双驳盒')!=-1))"></OrderAttrShow>
              <!-- <el-link v-if="scope.row.productAttr"  :underline="false" @click="seeAll(scope.row.productAttr)">
                <div class="property">{{scope.row.productAttr}}</div>
              </el-link>
              <div v-else>-</div> -->
            </template>
          </el-table-column>

          <el-table-column label="业务员">
            <template #default="scope">
              <!-- <div>{{scope.row.salesman || '-'}}</div> -->
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
                <span class="TimeTitle">文件推送人:</span>
                <br/>
                <span class="TimeCon">{{ scope.row.fileSender || "-" }}</span>
              </p>
              <p v-if="scope.row.status">
                <span class="TimeTitle">数码切割状态:</span>
                <br/>
                <span class="TimeCon">
                  <!-- <DictTag :value="scope.row.status" :options="ac_cutting_bench_status"/> -->
                  <el-tag hit><DictTag
                    :value="scope.row.status"
                    :options="ac_cutting_bench_status"
                  /></el-tag>
                </span>
              </p>
            </template>
          </el-table-column>

          <el-table-column label="文件下载" width="380">
            <template #default="scope">
              <div v-if="scope.row.customerFile && JSON.parse(scope.row.customerFile) && JSON.parse(scope.row.customerFile).length > 0">
              <template v-for="(item,index) in JSON.parse(scope.row.customerFile)" :key="index">
                <!-- <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="fileName(item.fileName)">
                <template #reference>
                  <div  class="text-overflow gesture" :style="JSON.parse(scope.row.customerFile).length > 1 ? 'width:180px;' : 'width:190px;'">
                    <a :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank"><span v-if="JSON.parse(scope.row.customerFile).length > 1">部件{{toChineseNumber(item.sort)}}:</span> {{fileName(item.fileName)}}</a>
                  </div>
                </template>
                </el-popover> -->
                <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
              </template>
            </div>
            <div v-if="scope.row.structuralFile&&scope.row.structuralFile.length" class="gesture">
              <template v-for="(item, index) in scope.row.structuralFile" :key="index">
                    <FileShow title="打样结构：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
              </template>
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
          <!-- <el-table-column label="品类" width="200">
            <template #default="scope">
              <div>{{ scope.row.productName || "-" }}</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="数量" >
            <template #default="scope">
              <div>{{ scope.row.productNumber || "-" }}</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="印前文件状态"  width="120">
            <template #default="scope">
              <div>{{ prepressStatusMap[scope.row.prepressFileStatus] || "-" }}</div>
            </template>
          </el-table-column> -->
          <el-table-column label="备注" width="150px">
            <template #default="scope">
              <RemarkDialog :order="scope.row" :showButton="(scope.row?.remarkFlag==2)" type="cutting" :perperss_remark_type="perperss_remark_type" @getList="getList"/>
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
          
          <!-- <el-table-column label="文件推送人" width="90px">
            <template #default="scope">
              <div>{{scope.row.fileSender||'-'}}</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="印前备注" width="200">
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
          </el-table-column> -->
          <!-- <el-table-column label="结构备注" width="200">
            <template #default="scope">
              <div v-if="scope.row.structuralRemark">
                <el-popover
                placement="top-start"
                trigger="hover"
                :content="scope.row.structuralRemark"
                popper-class="popper_note">
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
          <!-- <el-table-column label="数码切割状态" width="120">
            <template #default="scope">
             <DictTag :value="scope.row.status" :options="ac_cutting_bench_status"/>
            </template>
          </el-table-column> -->
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
          <!-- <el-table-column label="客户订单备注" width="200">
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
          
          <!-- <el-table-column label="转数码切割时间" width="200">
            <template #default="scope">
              <span>{{parseDate(scope.row.createTime)}}</span>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <div class="operate">
                <receiveBtn  v-if="scope.row.status==0" :row="scope.row" :getTask="getTask" :id='scope.row.activityId' @updatelist="getList"></receiveBtn>
                <el-link type="primary" v-else :underline="false" style="margin-right:10px"  :style="btnDisabled(scope.row.status,0) ? 'color:#9fceff;cursor: not-allowed;' : ''"  @click="done(scope.row.activityId,scope.row.status,0)">完成</el-link>
                <p>
                  <el-link type="primary" 
                    :underline="false" 
                    :disabled="disabled(scope.row.status)" 
                    :style="btnDisabled(scope.row.status,1) ? 'color:#9fceff;cursor: not-allowed;' : ''"  
                    
                    >
                    <rejectDialog :activityId="scope.row.activityId" @callBack="refusalAffirm" :scope="scope.row" :disabled="disabled(scope.row.status)" />
                  </el-link></p>
                <!-- <el-link type="primary" :underline="false" @click="upCutFile(scope.row.activityId,scope.row.partNum)">@click="reject(scope.row.status,scope.row.activityId,scope.row.orderNo,scope.row.poNo,scope.row.type,1)"上传切割文件</el-link> -->
                <el-popover placement="bottom" width="300px;" trigger="click" v-if="false">
                  <template #reference>
                    <el-button @click="isShowDownBtn = scope.row.id" size="small" style="margin-left: 10px">
                      <el-icon><More /></el-icon>
                    </el-button>
                  </template>
                  <div class="downBoX">
                    <div><el-button class="downBtn" text :disabled="downDisabled(scope.row.orPrepressFile, 3)" @click="downCut(scope.row,2)">下载印前文件</el-button></div>  
                    <div><el-button class="downBtn" text :disabled="downDisabled(scope.row, 1)"  @click="downCut(scope.row,4,scope.row.structuralFile)">下载结构文件</el-button></div>  
                    <div><el-button class="downBtn" text :disabled="downDisabled(scope.row.cuttingFile, 3)"    @click="downCut(scope.row,1)">下载切割文件</el-button></div>  
                    <div><el-button class="downBtn" text :disabled="downDisabled(scope.row.customerFile,3)"   @click="downCut(scope.row,3)">下载客户文件</el-button></div>
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      </template>
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
              @pagination="getRevokeListData"
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
      <!-- <div style="height: 800px">
        <iframe :src="pdfSrc" frameborder="0" style="width:100%; height: 100%"></iframe>
      </div> -->
      <!-- 属性弹框 -->
      <div class="is-align-center">
        <el-dialog v-model="isAttrShow" title="属性详情" width="600px">
          <p style="line-height:2;">{{ attrContent }}</p>
          <template #footer>
            <div>
              <el-button type="primary" @click="isAttrShow = false"
                >关闭</el-button
              >
            </div>
          </template>
        </el-dialog>
      </div>
      <!-- 完成弹窗 -->
      <div class="is-align-center">
        <el-dialog v-model="isDoneShow" title="确定数码切割已完成?" width="600px">
          <div>操作立即生效是否继续?</div>
          <div class="receiveBtnBox">
            <el-button @click="isDoneShow = false">取消</el-button>
            <el-button type="primary" @click="doneConfirm">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 打样数码切割驳回弹窗 -->
      <div class="is-align-center">
        <el-dialog v-model="isRefusalShow" title="驳回" width="600px" @close="closePopup(0)">
          <el-form
          ref="rejectRef"
          :model="refusalParam"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="驳回原因:"
            prop="remark"
            :rules="[
              { required: true, message: '请填写驳回原因' }
            ]"
          >
            <el-input
              v-model.trim="refusalParam.remark"
              type="textarea"
              placeholder="请填写驳回原因"
              autocomplete="off"
              show-word-limit
              maxlength="500"
              resize='none'
              rows="6"
            />
            <div style="margin-top:10px;">
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
            <div style="display:flex;justify-content:right;">  
              <el-button  @click="cancelPopup(0)">取消</el-button>
              <el-button type="primary" @click="refusalAffirm(rejectRef)">确定</el-button>
            </div>
        </el-form>
        </el-dialog>
      </div>
      <!-- 上传切割文件弹窗 -->
      <div class="upCutFileProp">
        <el-drawer v-model="isUpCutFileShow" title="上传切割文件" size="600px">
          <div class="unitsBox">
            <!-- 部件 -->
            <div class="units" v-for="(item,index) in annexCount" :key="index">
              <div>部件{{item}}:</div>
              <div class="cutBox">
                <div class="file">切割文件:</div>
                  <div class="upload">
                    <FileUpload
                      :fileType="['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc','dxf','tif','ard','zip','rar']"
                      :fileSize="200"
                      name='上传文件'
                      del
                      v-model:modelValue="fileList[index]"
                      replace
                    />
                  </div>
                </div>
            </div>
          </div>
          <div class="cutBtnBox">
            <el-button @click="isUpCutFileShow = false">取消</el-button>
            <el-button type="primary" @click="saveFileList">保存</el-button>
          </div>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script setup>
// 域名
import cancelOrder from "@/components/cancelOrder";
import {BASE_FILE_URL} from "@/store/global-constant"
import { 
  getBenchList,
  finish,
  saveCutFile,
  getAnnexInfo,
  downloadCuttingFile,
  getMsgCount,
  getCancelMsg,
  submitMsgOps } from "@/api/proofElCut/workbench";
import { turnDown,getTask,getTaskCount } from "@/api/proofElCut/cutList";
// 打包下载
// import {downloadZip} from  '@/utils/request'
// 将阿拉伯数字'1'转中文数'一'
import { toChineseNumber,parseDate,senseUrl  } from '@/utils/index'
import { ElMessage,ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';
import OrderAttrShow from "@/components/OrderAttrShow"
import RemarkDialog from "@/components/RemarkDialog";
import receiveBtn from "@/components/proof/receiveBtn.vue";
import { downloadZip,download } from "@/utils/request2";
import { getToken } from "@/utils/auth";
import poView from "./components/poView.vue"
import rejectDialog from "./components/rejectDialog.vue";
import Counter from "@/components/proof/Counter.vue"
const router = useRouter()
const { proxy } = getCurrentInstance();
const { ac_cutting_bench_status,perperss_remark_type,ac_proof_type } = proxy.useDict("ac_cutting_bench_status","perperss_remark_type","ac_proof_type");

// 印前状态处理
let prepressStatusMap = reactive({
   0:"未上传",
   1:"部分上传",
   2:"已上传"
})

// 数据参数
const data = reactive({
  // 表单参数
  formParams:{
    poNo: "", // po号
    proofNo: "", // 打样编号
    status: "", // 状态
    orderType: "", // 数码类型
    pageNum: 1, // 页码
    pageSize: 10, // 页大小
  },
  // 完成参数
  doneParam:{
    activityId:""
  },
   // 驳回参数
  refusalParam:{
    activityId:'', // 文件制作流程ID
    orderNo:'', // 订单号
    poNo:'', // po号
    remark:'', // 驳回备注
    remarkImages:'',//驳回图片
    type:'' // 订单类型: 0 大货 1 打样
  },
  // 保存切割文件参数
  saveCutFileParam:{
    activityId:'',// 文件制作流程ID
    files:[]  // 文件
  },
  revokeParams: {
    current: 1, // 页数
    size: 20, // 每页条数
  },
})

const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理
const { formParams,doneParam,refusalParam,saveCutFileParam,revokeParams } = toRefs(data)
const revokeData = ref([]);// 撤单数据
const revokeTotal = ref(0)//撤单消息总数
const revokeMsgCount = ref(0)//撤单消息数量
const isRevokeShow = ref(false)

// 总条数
let total = ref(0);
// 数码类型列表
let technoTypeList = reactive([
  { label: "大货数码", value: 0 },
  { label: "精装盒打样数码", value: 1 }
]);
// 数码切割工作台状态
let benchStatus = reactive([
  { label: "所有状态", value: 0 },
  { label: "未领取", value: 1 },
  { label: "已领取", value: 2 },
  { label: "已驳回", value: 3 },
  { label: "被驳回", value: 4 },
  { label: "已撤回", value: 6 },
  { label: "客户撤单", value: 7 },
  { label: "检测中", value: 8 },
  { label: "检测失败", value: 9 },
  { label: "已完成", value: 5 }
]);

// 表格数据
let tableData = ref([]);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
// 是否显示切割驳回弹窗
let isRefusalShow = ref(false)
// 是否显示完成弹窗
let isDoneShow = ref(false)
// 是否显示上传切割文件弹窗
let isUpCutFileShow = ref(false)
// 表单ref
const formRef = ref("");
// 驳回ref
const rejectRef = ref("")
// 文件列表
let fileList = ref([])
// 部件数量
let annexCount = ref(0)
// 清空表单
function clearForm(val){
  proxy.resetForm(val);
}

// 获取路径的名字
function fileName(url) {
  if (url&&url.includes('filemanage')) {
    let urlList = url.split('filemanage');
    return urlList[urlList.length - 1];
  }
  return url
}
function showAttr(text,type){
  ElMessageBox.alert(text, type, {
    confirmButtonText: '关闭',
    callback: () => {}
  })
}
// 获取我的数码切割工作台
async function getList() {
  let { code, data } = await getBenchList(formParams.value);
  if (code == 200) {
    tableData.value = data.rows.map(item=>{
        let reg = new RegExp("<.+?>","g")
        item.salesmanNote = item.salesmanNote.replace(reg,'')
        if (item.prepressFile && item.prepressFile.length > 0) {
        item.prepressFile = JSON.parse(item.prepressFile);
        item.cuttingFile = item.prepressFile.map((e) => {
              return e.cuttingFile;
            }).filter(a=>a)
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

    total.value = data.total;
    // console.log("tableData", tableData.value);
  }
  getRevokeMsgCount()
}

getList();

// 关闭弹窗
const closePopup = (type)=>{
  // 0 驳回
  if(type == 0){
    clearForm('rejectRef')
    isRefusalShow.value = false
  }
}
function jsonParse(val) {
  if (val) {
    return JSON.parse(val);
  } else {
    return "";
  }
}
// 取消弹窗
function cancelPopup(type){
  // 0 驳回
  if(type == 0){
    clearForm('rejectRef')
    isRefusalShow.value = false
  }
}

// 按钮禁用
function btnDisabled(status,type){
  //   0未领取、1未切割、2已切割、3已驳回、4被驳回、5客户撤单
  //  0 完成  1 驳回
  if(type == 0){
    // 完成状态
    let doneStatus = [1,4]  // 允许点击
    if(!doneStatus.includes(status)){
      return true
    }
  }else if(type == 1){
    // 驳回状态
    let rejectStatus = [2,3,5] // 禁止点击
    if(rejectStatus.includes(status)){
      return true
    }
  }
  return false
}

// 下载禁用
function downDisabled(file,status){
  // 0 下载印前文件 1 下载结构文件 2 下载切割文件  3 下载客户文件
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

// 重置
const reset = () => {
  clearForm('formRef')
  search()
};
// 搜索
const search = () => {
  formParams.value.pageNum = 1;
  getList();
  getCount()
};
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
  formParams.value.pageNum = value;
  getList();
}

// 每页条数改变
function sizeChange(value) {
  formParams.value.pageSize = value;
  getList();
}



// 完成事件
function done(id,status,type){
  if(type == 0 && btnDisabled(status)){
    ElMessage.error('请先上传切割文件后重试')
    return
  }
  doneParam.value.activityId = id
  isDoneShow.value = true
}

// 完成确认
async function doneConfirm(){
  try{
    let {code,msg} = await finish(doneParam.value.activityId)
    if(code == 200){
      getList()
      isDoneShow.value = false
      ElMessage.success('完成成功')
    }
  }catch(err){
    isDoneShow.value = false
    // ElMessage.error('完成失败')
  }
}

// 驳回
const reject = (status,id,orderNo,poNo,type,val)=>{
  if(val == 1 && btnDisabled(status)){
    ElMessage.error('已流转至下个流程，禁止操作')
    return
  }
  refusalParam.value.activityId = id
  refusalParam.value.orderNo = orderNo
  refusalParam.value.poNo = poNo
  refusalParam.value.type = type
  isRefusalShow.value = true
} 

// 驳回确认
 function refusalAffirm (data) {
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
}


// 下载文件
async function downFile(data,status,id){
  // 0 下载印前文件 1 下载结构文件 2 下载切割文件  3 下载客户文件
  if(data && data.length > 0){
    if(status == 0){
      let result = await downloadZip(`/file-task/cutting/downloadPrepressFile/${id}`,'',"印前文件.zip")
    }else{
      let statusMap = {
        1:'结构文件.zip',
        2:'切割文件.zip',
        3:'客户文件.zip'
      }
      let fileDTO = {
        name:statusMap[status],
        fileUrls:[]
      }
      data.forEach(item=>{
        fileDTO.fileUrls.push(item.fileAddress)
      })
      let result = await downloadZip("/file-task/cutting/downloadFile",fileDTO,statusMap[status])
    }
  }
}

// 上传切割文件
const upCutFile = (id,num)=>{
  saveCutFileParam.value.activityId = id
  annexCount.value = num
  isUpCutFileShow.value = true
  getFileData(id)
}

// 获取切割文件数据
async function getFileData(id){
  let {code,data}= await getAnnexInfo(id)
  if(code === 200){
     fileList.value = data.map(item =>{
      return [
        {
          name:item.fileName,
          fileAddress: item.fileAddress,
          sort:item.sort
        }
      ]
     })
  }
}

// 上传切割保存
async function saveFileList(){
  try{
    // 文件数据
    let val = fileList.value;
    // 用来判断长度
    let arr = fileList.value.filter(item=>item)  // 返回真的数据
    if(arr.length < annexCount.value){
      ElMessage.error('请上传所需文件')
      return
    }
    // 处理成统一数据格式
    val = val.map((item,index)=>{
      if(!item[0].name){
        item=[{
              name:item,
              fileAddress:item,
              sort:index+1
            }]
      }
      return item
    })
    // 处理后端所需要的数据格式
    saveCutFileParam.value.files=val.map(item=>{
      return {
        fileName:item[0].name,
        file:item[0].fileAddress,
        sort:item[0].sort
      }
    })
    let {code,data,msg} = await saveCutFile(saveCutFileParam.value)
    if(code===200){
        ElMessage.success('保存成功')
        isUpCutFileShow.value = false
        getList()
    }
  }catch(err){
    ElMessage.success('保存失败')
  }
}
function disabled(status) {
  if (status == 1 || status == 4) {
    return false;
  } else {
    //置灰
    return true;
  }
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
        "name": "客户源文件"
          },'客户源文件.zip',{token:getToken()})
    }
  }
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
// function downCut(activityId, status, data) {
//   if (status == 1) {
//     downloadZip(
//       `/file-task/cutting/downloadCuttingFile/${activityId}?fileType=切割文件`,
//       "",
//       "切割文件.zip"
//     );
//   } else if (status == 2) {
//     downloadZip(
//       `/file-task/cutting/downloadPrepressFile/${activityId}`,
//       "",
//       "印前文件.zip"
//     );
//   } else {
//     if (data) {
//       let fileDTO = {
//         name: "结构文件.zip",
//         fileUrls: [],
//       };
//       data.forEach((item) => {
//         fileDTO.fileUrls.push(item.fileAddress);
//       });
//       let result = downloadZip(
//         "/file-task/cutting/downloadFile",
//         fileDTO,
//         "结构文件.zip"
//       );
//     } else {
//       downloadZip(
//         `/file-task/cutting/downloadCuttingFile/${activityId}?fileType=结构文件`,
//         "",
//         "结构文件.zip"
//       );
//     }
//   }
// }
</script>

<style lang="scss" scoped>
.myElCutBench {
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
  // 我的数码切割工作台列表
  .myElCutBenchList {
    margin-top: 20px;
    .turn{
      display: inline-block;
      width: 20px;
      line-height: 20px;
      background-color: #ff3399;
      color: #FFFFFF;
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
  .receiveBtnBox{
    display: flex;
    justify-content: right;
  }
    // 上传切割文件弹窗
  .upCutFileProp{
    :deep(.el-drawer__header){
      margin-bottom: 0 !important;
    }
    .unitsBox{
      // margin: 20px 0;
      font-size: 14px;
      .units{
        .cutBox{
          display: flex; 
          .file{
            line-height: 32px;
            width:70px;
            flex-shrink:0;
            margin-right: 8px;
            &::before{
              content: "*";
              color: red;
              margin-right: 4px;
            }
          }
        }
      }
    }
    .cutBtnBox{
      position: fixed;
      bottom: 20px;
      right: 20px;
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
.disposeBox{
  display: flex;
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

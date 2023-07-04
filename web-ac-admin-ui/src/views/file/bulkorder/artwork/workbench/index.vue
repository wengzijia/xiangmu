<template>
<div>
  <el-card style="margin: 10px" class="artwork-workbench">
    <div class="top-bar">
      <div class="titleBox">
      <div class="message" @click="revokeMessage">
        撤单消息(<span v-if="revokeAmount < 1">{{revokeAmount}}</span><el-badge is-dot class="item" v-if="revokeAmount > 0">{{revokeAmount}}</el-badge>)
      </div>
      <el-button class="getTask"  type="primary"  @click="receiveTask">领取任务</el-button>
    </div>
    </div>
    <!-- 正稿文件列表  -->
    <div class="outworkListBox">
      <el-table :data="tableData" style="width: 100%;height:680px" scrollbar-always-on row-key="id">
        <el-table-column label="PO号" width="300">
          <template #default="scope">
            <div>
              <span class="turn" v-if="scope.row.orderFlag == 1">翻</span>
              <span>{{ scope.row.poNo || "-" }}</span>
              <el-icon
                v-copyText="scope.row.poNo"
                v-copyText:callback="copyTextSuccess"
                v-if="scope.row.poNo"
                ><CopyDocument
              /></el-icon>
              <div style="margin-top:5px" v-if="scope.row.allowModificationOfDie">
                <el-tag class="mx-1" effect="dark">
                  {{scope.row.allowModificationOfDie==1?"允":'不'}}许对设计文件、刀模文件进行生产规范化修正
                </el-tag>
                <followInfoFlag style="margin-top:5px" :row="scope.row" name='bulkorderFollow'></followInfoFlag>
                <ThreeDayFlag  style="margin-top:5px" :row="scope.row" ></ThreeDayFlag>
                </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="正稿编号" width="200">
          <template #default="scope">
            <div>
              <span>{{ scope.row.taskNo || "-" }}</span>
              <el-icon
                v-copyText="scope.row.taskNo"
                v-copyText:callback="copyTextSuccess"
                v-if="scope.row.taskNo"
                ><CopyDocument
              /></el-icon>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="订单参数" width="310">
          <template #default="scope">
            <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.id" type="artwork"></OrderAttrShow>
            <!-- <el-link v-if="scope.row.productAttr" :underline="false" @click="seeAll(scope.row.productAttr)">
                <div class="property">{{scope.row.productAttr}}</div>
            </el-link>
            <div v-else>-</div> -->
          </template>
        </el-table-column>
        <el-table-column label="客户源文件" width="210">
          <template #default="scope">
            <div v-if="scope.row.customerFiles?.length > 0">
              <el-popover
                placement="top-start"
                trigger="hover"
                v-for="item in scope.row.customerFiles" :key="item.sort"
                :content="fileName(item.fileAddress)"
                >
              <template #reference>
                <div  class="text-overflow gesture" :style="scope.row.customerFiles?.length > 1 ? 'width:180px;' : 'width:190px;'">
                  <a :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank"><span v-if="scope.row.customerFiles?.length > 1">部件{{toChineseNumber(item.sort)}}:</span> {{fileName(item.fileAddress)}}</a>
                </div>
              </template>
              </el-popover>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <!-- 12/08 -->
        <el-table-column label="设计制作需求描述" width="200">
          <template #default="scope">
            <!-- <div v-if="(scope.row.demandDesc?.note || scope.row.demandDesc?.files?.length > 0 )||(scope.row.demandDesc?.note && scope.row.demandDesc?.files?.length > 0 )"><el-button type="primary" text @click="catDepictDetail(scope.row.demandDesc.note,scope.row.demandDesc.files)">查看详情</el-button></div> -->
           <div v-if="scope.row.demandDesc"><el-button type="primary" text @click="catDepictDetail(scope.row.demandDesc,'')">查看详情</el-button></div>
            <div v-else>-</div>
          </template>
        </el-table-column>
         <el-table-column label="备注" width="200">
            <template #default="scope">
              <div>
                <RemarkDialog :order="scope.row" type="artwork" @changeRemark="changeRemark" :proxyType="ac_remark_type"/>
                 
              </div>
            </template>
          </el-table-column>
             <el-table-column label="业务员" width="200">
            <template #default="scope">
               <div>{{ scope.row.salesman || "-" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="文件推送人" width="200">
            <template #default="scope">
             <div>{{ scope.row.fileSender || "-" }}</div>
            </template>
          </el-table-column>
        <el-table-column label="是否转单" width="200">
          <template #default="scope">
            <div>{{ scope.row.transfer || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="转单备注" width="200" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="scope.row.transferRemark">
              <!-- <el-popover
                placement="top-start"
                trigger="hover"
                :content="scope.row.transferRemark"
                v-if="scope.row.transferRemark"
              >
                <template #reference>
                  <div class="text-overflow" style="width: 153px"> -->
                    {{ scope.row.transferRemark }}
                  <!-- </div>
                </template>
              </el-popover> -->
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="设计正稿文件" width="200">
          <template #default="scope">
            <div v-if="scope.row.annexVOS?.length > 0">
            <el-popover
              placement="top-start"
              trigger="hover"
              v-for="item in scope.row.annexVOS" :key="item.sort"
              :content="item.fileName"
               >
            <template #reference>
              <div  class="text-overflow gesture" style="width:180px;">
                <a :href="item.fileAddress" target="_blank">{{item.fileName}}</a>
              </div>
             </template>
            </el-popover>
            </div>
           <div v-if="scope.row.annexVOS == null">-</div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="设计正稿文件上传时间" width="200">
          <template #default="scope">
            <div v-show="scope.row.annexVOS.length > 0" v-for="item in scope.row.annexVOS" :key="item.sort">{{item.updateTime || '-'}}</div>
            <div v-if="scope.row.annexVOS == null">-</div>
          </template>
        </el-table-column> -->
        <el-table-column label="客户源文件上传时间" width="200">
          <template #default="scope">
            <div v-if="scope.row.customerFiles?.length > 0">
              <div>{{scope.row.customerFiles[scope.row.customerFiles.length - 1].uploadTime}}</div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="正稿任务领取时间" width="200">
          <template #default="scope">
            <div>{{ scope.row.startTime || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template #default="scope">
            <div class="operate">
              <el-link type="primary" :underline="false"  @click="uploadOutwork(scope.row.id)">上传正稿</el-link>
              <el-link type="primary" :underline="false" class="public" :disabled="isDoneDisabled(scope.row.annexVOS)" @click="done(scope.row.id)">完成</el-link>
              <el-popover placement="bottom" width="300px;" trigger="click">
                <template #reference>
                  <el-button size="small" style="margin-left: 10px">
                    <el-icon><More /></el-icon>
                  </el-button>
                </template>
                <div class="downBoX">
                  <div><el-button class="downBtn" text @click="reject(scope.row.id,scope.row.poNo)">驳回</el-button></div>
                   <div>
                      <el-button
                        class="downBtn"
                        text
                        @click="fileBack(scope.row.id)"
                        >退回文件推送前</el-button
                      >
                    </div>
                  <div><el-button class="downBtn" text @click="transferSheet(scope.row.id)">转移正稿单</el-button></div>
                  <!-- <div><el-button class="downBtn" text :disabled="btnDisabled(scope.row.remarkFlag,2)" @click="remarksMandate(scope.row.poNo)">修改备注授权{{scope.row.remarkFlag}}</el-button></div> -->
                  <div><el-button class="downBtn" text :disabled="btnDisabled(scope.row.customerFiles,3)" @click="downFile(scope.row.customerFiles)">下载客户源文件</el-button></div>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 工作台分页 -->
      <div class="laypage">
        <el-pagination
          v-model:currentPage="termParam.current"
          v-model:page-size="termParam.size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange($event,0)"
          @current-change="currentChange($event,0)"
        />
      </div>
    </div>
    <!-- 上传正稿弹窗 -->
    <div class="uploadOutwork">
      <el-drawer v-model="isUploadShow" title="上传正稿文件" size="600px">
        <div class="unitsBox">
          <!-- 部件 -->
          <div class="units" v-for="(item,index) in annexCount" :key="index">
            <div>部件{{item}}:</div>
            <div class="outwork">
              <div class="file">正稿文件:</div>
              <div class="upload">
                <FileUpload
                  :fileType="['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc','dxf','tif','ard']"
                  :fileSize="200"
                  name='上传正稿'
                  del
                  v-model:modelValue="fileList[index]"
                  replace
                />
              </div>
            </div>
          </div>
        </div>
        <div><b>正稿备注:</b></div>
        <el-form style="width:500px;">
        <el-form-item label="正稿备注:" >
          <el-input
            v-model.trim="uploadParam.remark"
            type="textarea"
            placeholder="请输入正稿备注"
            autocomplete="off"
            show-word-limit
            maxlength="300"
            resize='none'
            rows="6"
          />
        </el-form-item>
        </el-form>
        <div class="outworkBtnBox">
          <el-button @click="isUploadShow = false">取消</el-button>
          <el-button type="primary" @click="saveFileList">保存</el-button>
        </div>
      </el-drawer>
    </div>
    <!-- 撤单消息弹窗 -->
    <div class="revokeMessage">
      <el-dialog v-model="isRevokeShow" title="撤单消息" width="1200px">
        <!-- 撤单消息列表 -->
        <cancelOrder
          :revokeData="revokeData"
          @getRevoke="getRevoke"
        ></cancelOrder>
        <!-- 撤单消息分页 -->
        <div class="laypage">
          <el-pagination
            v-model:currentPage="revokeParams.current"
            v-model:page-size="revokeParams.size"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="revokeTotal"
            @size-change="sizeChange($event,1)"
            @current-change="currentChange($event,1)"
          />
        </div>
        <div class="alignRight" style="margin-top:20px;">
          <el-button type="primary" @click="isRevokeShow = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 属性弹框 -->
    <div class="is-align-center">
      <el-dialog v-model="isAttrShow" title="属性详情" width="600px">
        <p style="line-height:2;">{{ attrContent }}</p>
        <template #footer>
          <span>
            <el-button type="primary" @click="isAttrShow = false"
              >关闭</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 设计制作需求描述弹窗 -->
    <div class="resourceBox">
      <el-dialog v-model="depictParam.isDepictShow" title="设计制作需求描述详情" width="600px">
        <el-scrollbar max-height="600px">
          <div style="font-size:20px;" v-html="depictParam.content" @click="imgViewer"></div>
          <!-- <div v-if="depictParam.resource && depictParam.resource.length > 0">
            <div v-for="(item,index) in depictParam.resource" :key="index">
              <div class="nameBox">
                <div class="name text-overflow">{{item.substring(item.lastIndexOf('/')+1)}}</div>
                <a v-if="item" :href="item" target="_blank"><el-icon><Download /></el-icon></a>
              </div>
              <el-image
                v-if="checkFormat(item,1)"
                style="margin-top:10px;"
                :src="item"
                fit="cover"
              />
              <video v-if="checkFormat(item,2)" width="500" height="240" controls :src="item"></video>
            </div>
          </div> -->
        </el-scrollbar>
        <template #footer>
          <span>
            <el-button type="primary" @click="depictParam.isDepictShow = false"
              >关闭</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 完成任务弹窗 -->
    <div class="doneTask">
      <el-dialog v-model="isDoneTaskShow" title="确定完成正稿文件任务？" width="600px">
        <div>请确认检查正稿文件。完成后需业务员确定才能推送下游节点，请及时通知业务员。</div>
        <div class="doneTaskBtn" style="margin-top:20px;">
          <el-button @click="isDoneTaskShow = false">取消</el-button>
          <el-button type="primary" @click="doneAffirm">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 正稿驳回弹窗 -->
    <div class="is-align-center">
      <el-dialog v-model="isRefusalShow" title="正稿驳回" width="600px" @close="closePopup(0)">
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
        </el-form-item>
        <div class="alignRight">
          <el-button  @click="cancelPopup(0)">取消</el-button>
          <el-button type="primary" @click="refusalAffirm(rejectRef)">确定</el-button>
        </div>
      </el-form>
      </el-dialog>
    </div>
    <!-- 退回弹窗 -->
    <div class="is-align-center">
      <el-dialog v-model="isBackShow" title="确定退回文件推送前?" width="600px" @close="closePopup(2)">
        <el-form
        ref="backFileRef"
        :model="backParam"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="备注:"
          prop="remark"
        >
          <el-input
            v-model.trim="backParam.remark"
            type="textarea"
            placeholder="请输入退回文件推送前备注内容"
            autocomplete="off"
            show-word-limit
            maxlength="500"
            resize='none'
            rows="6"
          />
        </el-form-item>
        <div class="alignRight">
          <el-button  @click="cancelPopup(2)">取消</el-button>
          <el-button type="primary" @click="backAffirm(backFileRef)">确定</el-button>
        </div>
      </el-form>
      </el-dialog>
    </div>
    <!-- 转移正稿单弹窗 -->
    <div class="transferBox">
      <el-dialog v-model="isTransferShow" title="转移正稿单" width="600px" @close="closePopup(1)">
        <el-form
        ref="transferRef"
        :model="transferParam"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 账号 -->
        <!-- <el-form-item
          label="账号:"
          prop="userAccount"
          :rules="[
            { required: true, message: '请填写账号' }
          ]"
        >
          <el-input
            v-model="transferParam.userAccount"
            type="text"
            placeholder="请输入接收人"
            autocomplete="off"
          />
        </el-form-item> -->
        <el-form-item label="账号:" prop="userId" :rules="[{ required: true, message: '请选择接受账号' }]">
            <el-select clearable filterable v-model="transferParam.userId"  placeholder="请选择接受账号" style="width:400px">
              <el-option
                v-for="item in accountList"
                v-show="item.userName!=name"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
        </el-form-item>
        <!-- 转单备注 -->
        <el-form-item label="转单备注:" prop="remark">
          <el-input
            v-model.trim="transferParam.remark"
            type="textarea"
            placeholder="请填写转单原因"
            autocomplete="off"
            show-word-limit
            maxlength="500"
            resize='none'
            rows="6"
            style="width:400px;"
          />
        </el-form-item>
          <div class="transferBtn">
            <el-button  @click="cancelPopup(1)">取消</el-button>
            <el-button type="primary" @click="transferAffirm(transferRef)">确定</el-button>
          </div>
      </el-form>
      </el-dialog>
    </div>
    <!-- 备注授权弹窗 -->
    <div class="remarkBox">
      <el-dialog v-model="isRemarksMandateShow" title='确定授权业务员修改 “设计制作需求描述” 备注？' width="600px">
        <div>操作立即生效是否继续？</div>
        <div class="mandateBtn">
          <el-button @click="isRemarksMandateShow = false">取消</el-button>
          <el-button type="primary" @click="remarkAffirm">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
  <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" ></el-image-viewer>
</div>
</template>

<script setup>
import { uploadefile } from "@/api/upload";
import cancelOrder from "@/components/cancelOrder";
// 域名
import {BASE_FILE_URL} from "@/store/global-constant"
import {getMsgCount,getCancelMsg,submitMsgOps,getTask,getSelfWorkList,saveFile,getAnnexByOriginalId,finish,refusalOutwork,transferOutwork,returnBeforeSend,agreeModifyRemark } from "@/api/outworkManage/outworkFileBench"
import { getDeptUser } from "@/api/system/user";
import { ElMessage ,ElMessageBox, genFileId} from 'element-plus'
import { zipDownload } from "@/api/download"
// 将阿拉伯数字'1'转中文数'一'
import { toChineseNumber,senseUrl  } from '@/utils/index'
import { ref } from "@vue/reactivity";
import useAppStore from "@/store/modules/user";
import OrderAttrShow from "@/components/OrderAttrShow/order.vue"
import RemarkDialog from "@/components/RemarkDialog/remark.vue";
import ThreeDayFlag from "@/components/fileTag/threeDayFlag.vue";
const appStore = useAppStore();
const name = ref('')
name.value = appStore.$state.name
const { proxy } = getCurrentInstance();

const { prepress_department,ac_remark_type} = proxy.useDict("prepress_department","ac_remark_type");
// 撤单消息状态对应文字
let statusMap = {
   0:'待审批',
   1:'已同意',
   2:'不同意'
}
const uploadref = ref(null);
// 条件参数
let termParam = reactive({
  current: 1, // 页数
  size: 10, // 每页条数
});
// 撤单消息数量
let revokeAmount = ref(0);
// 撤单条件参数
let revokeParams = ref({
  current: 1, // 页数
  size: 10, // 每页条数
});
// 撤单消息结果参数
let btnResultParam = reactive({
  msgId:'', // 消息ID
  originalId:'', // 正稿工单id
  result:'' //  1同意 2拒绝
})
// 撤单总条数
let revokeTotal = ref(0);
// 总条数
let total = ref(0);
let uploadFile = ref()
let upload = ref('')
// 撤单数据
let revokeData = ref([])
// 表格数据
let tableData = ref([]);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
let isRevokeShow = ref(false)
// 是否显示上传正稿弹窗
let isUploadShow = ref(false)
// 是否显示完成任务弹窗
let isDoneTaskShow = ref(false)
// 是否显示正稿驳回弹窗
let isRefusalShow = ref(false)
let isBackShow = ref(false)
// 是否显示转移正稿单弹窗
let isTransferShow = ref(false)
// 是否显示备注授权弹窗
let isRemarksMandateShow = ref(false)
// 驳回ref
const rejectRef = ref("")
// 转移ref
const transferRef = ref("")
const backFileRef = ref("")
// 设计制作需求描述参数
let depictParam = reactive({
  isDepictShow:false, // 是否显示描述弹窗
  content:"", // 内容
  resource:[] // 资源
})
// 正稿驳回参数
let refusalParam = reactive({
  originalId:'', // id
  poNo:'', // po号
  remark:'' // 备注
})
let backParam = reactive({
  originalId:'', // id
  remark:'' // 备注
})
// 账号列表
let accountList = ref([])

// 转移正稿单参数
let transferParam = reactive({
  originalId:'', // id
  userId:'', // 账号id
  remark:'' // 备注
})

// 备注授权参数
let remarkParam = reactive({
  poNo:''  // po号
})

// 上传正稿参数
let uploadParam =  reactive({
    files:[],
    originalId:'',
    remark:''
})

// 完成正稿单参数
let doneParam = reactive({
  taskId:'', // id
})

// 清空表单
function clearForm(val){
  proxy.resetForm(val);
}

// token
let MyHeader =  reactive({
    token: localStorage.getItem('Access-Token')
})
// 文件列表
let fileList = ref([])
// 部件数量
let annexCount = ref(0)
// 获取撤单消息数量
async function revokeMsgCount(){
  let {code,data} = await getMsgCount()
  if(code===200){
    revokeAmount.value = data
  }
}

revokeMsgCount()

// 获取撤单消息列表
async function revokeListData(){
  let {code,data} = await getCancelMsg(revokeParams)
  if(code === 200){
    revokeData.value = data.records
    revokeTotal.value = data.total
  }
}

// 撤单消息
function revokeMessage(){
  isRevokeShow.value = true
  revokeListData()
}
watch(isRevokeShow, (val) => {
  if (!val) {
    revokeParams.value.current = 1;
    revokeParams.value.size = 10;
  }
});


// 获取正稿文件工作台数据
async function worktableData() {
  let { code, data } = await getSelfWorkList(termParam);
  if (code === 200) {
    tableData.value = data.records;
    total.value = data.total;
  }
}
worktableData();

// 所有请求
function allReq(){
  revokeListData()  // 撤单消息列表
  worktableData()   // 正稿文件工作台数据
  revokeMsgCount()  // 撤单消息数量
}

//数组对象方法排序:从小到大
function sortByKey(array,key){
    return array.sort(function(a,b){   
      var x=a[key];//如果要从大到小,把x,y互换就好
      var y=b[key];
      return ((x<y)?-1:((x>y)?1:0));
   });
}

// 领取任务
async function receiveTask(){
  try{
    let {code,msg} = await getTask()
    if(code == 200){
      ElMessage.success(msg||'领取成功')
      revokeListData()
      worktableData()
    }
  }catch(err){
  }

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

// 获取路径的名字
function fileName(url) {
  if (url.lastIndexOf("/") > -1) {
    return url.slice(url.lastIndexOf("/") + 1);
  }
  return url
}

// 查看设计制作需求描述
function catDepictDetail(content,resource){
  if(!content) return
  depictParam.content = content
  depictParam.resource = resource
  depictParam.isDepictShow = true
}

// 格式校验
function checkFormat(data,status){
  // 1 图片  2 视频
  // 图片格式
  let imgReg = /.(png|jpeg|jpg)$/i
  // 视频格式
  let videoReg = /.mp4$/i
  if(status == 1 && imgReg.test(data)){
    return true
  }
  if(status == 2 && videoReg.test(data)){
    return true
  }
  return false
}

// 是否同意撤单
async function getRevoke(value){
  try{
    let {data,type } = value
    let {id,originalId} = data
    btnResultParam.msgId = id
    btnResultParam.originalId = originalId
    btnResultParam.result = type
    let {code,msg} = await submitMsgOps(btnResultParam)
    if(code === 200){
      ElMessage.success(msg||'操作成功！')
      allReq()
    }
  }catch(err){
    allReq()
  }
}

// 撤单消息按钮禁用
function revokeBtnDisabled(status){
  // 待审核激活      0待审批，1已同意，2不同意
  if(status == 0){
    return false
  }
  return true
}

// 是否禁用完成按钮
let isDoneDisabled = (annexVOS)=>{
  // 没有正稿文件禁用
  if(annexVOS == null){
    return true
  }
  return false
}

// 是否禁用按钮
function btnDisabled(data,status){
  // 0 驳回   1 转移正稿单  2 修改备注授权 3 下载客户源文件
  if(status == 2){
  // 1未申请，2发起申请，3同意申请，4拒绝申请
    if(data == 2){
      return false
    }else{
      return true
    }
  }
  if(data&&data.length > 0 && status==3){
    return false
  }
  return true
}

// 下载客户源文件
async function downFile(file){
  if(file && file.length > 0){
    let fileParam = {
        fileList:[],
        name:'客户源文件'
    }
    file.forEach(item=>{
      fileParam.fileList.push(item.fileAddress)
    })
    let result = await zipDownload(fileParam,'客户源文件.zip')
  }
}

// 完成
const done = (id)=>{
  doneParam.taskId = id
  isDoneTaskShow.value = true
}
// 驳回
const reject = (id,poNo)=>{
  refusalParam.originalId = id
  refusalParam.poNo = poNo
  isRefusalShow.value = true
} 
// 退回
const fileBack = (id)=>{
  backParam.originalId = id
  isBackShow.value = true
} 
const deptId = ref('')
watch(prepress_department,(val)=>{
  deptId.value = val.find(item=>{return item.label=="original"}).value
})
if (prepress_department.value.length>0) {
  deptId.value = prepress_department.value.find(item=>{return item.label=="original"}).value
}
// 获取账号列表
async function allAccount(){
  if (!deptId.value) {
    return
  }
  let {code,data} = await getDeptUser({deptId:deptId.value})
  if(code === 200){
    accountList.value = data
  }
}

// 转移正稿单
const transferSheet = (id)=>{
  isTransferShow.value = true
  transferParam.originalId = id
  // 获取所有账号
  allAccount()
}
// 备注授权
const remarksMandate = (poNo)=>{
  isRemarksMandateShow.value = true
  remarkParam.poNo = poNo
}

// 每页条数改变
function sizeChange(size,status) {
  // 0 工作台条数   1 撤单消息条数
  if(status == 0){
    termParam.size = size;
    worktableData();
  }
  if(status == 1){
    revokeParams.size = size;
    revokeListData();
  }
}

// 页数改变
function currentChange(size,status) {
  worktableData();
    // 0 工作台页数   1 撤单消息页数
  if(status == 0){
    termParam.current = size;
    worktableData();
  }
  if(status == 1){
    revokeParams.current = size;
    revokeListData();
  }
}

// 完成任务确认
const doneAffirm = async function(){
  try{
    let {code,msg} = await finish(doneParam.taskId)
    if(code === 200){
      ElMessage.success(msg||'操作成功！')
      isDoneTaskShow.value = false
      worktableData();
    }
  }catch(err){
    isDoneTaskShow.value = false
    worktableData();
  }
}

// 关闭弹窗
const closePopup = (type)=>{
  // 0 驳回   1 转移
  if(type == 0){
    clearForm('rejectRef')
    isRefusalShow.value = false
  }else if(type == 1){
    clearForm('transferRef')
    isTransferShow.value = false
  }else if(type ==2){
    clearForm('backFileRef')
    isBackShow.value = false
    
  }
}

// 取消弹窗
function cancelPopup(type){
  // 0 驳回   1 转移
  if(type == 0){
    clearForm('rejectRef')
    isRefusalShow.value = false
  }else if(type == 1){
    clearForm('transferRef')
    isTransferShow.value = false
  }else if(type == 2){
     clearForm('backFileRef')
    isBackShow.value = false
  }
}

// 驳回确认
const refusalAffirm = (formEl) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      try{
        let {code,msg}= await  refusalOutwork(refusalParam)
        if(code == 200){
          ElMessage.success(msg||'操作成功！')
          isRefusalShow.value = false
          worktableData()
        }
      }catch(err){
        isRefusalShow.value = false
        worktableData()
      }
    } else {
      return false
    }
  })
}

// 转移正稿单确认
const transferAffirm = (formEl) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      try{
        let {code,msg} = await transferOutwork(transferParam)
        if(code== 200){
          ElMessage.success(msg||'操作成功！')
          isTransferShow.value = false
          worktableData()
        }
      }catch(err){
        isTransferShow.value = false
        worktableData()
      }
    } else {
      return false
    }
  })
}
function changeRemark(){
    isRemarksMandateShow.value = false
      worktableData()
}
// 备注授权确认
const remarkAffirm = async ()=>{
  try{
    let {code,msg} = await agreeModifyRemark(remarkParam)
    if(code == 200){
      ElMessage.success(msg||'操作成功！')
      isRemarksMandateShow.value = false
      worktableData()
    }
  }catch(err){
    isRemarksMandateShow.value = false
    worktableData()
  }
}
//退回确认
const backAffirm = async ()=>{
   try{
    let {code,msg} = await returnBeforeSend(backParam)
    if(code == 200){
      ElMessage.success(msg||'操作成功！')
      isBackShow.value = false
      worktableData()
    }
  }catch(err){
    isBackShow.value = false
    worktableData()
  }
}
// 文件超出提示
// const fileExceed = function(files,index){
//   uploadref.value[index].clearFiles()
//   uploadParam.files = uploadParam.files.filter(i=>i.sort != index + 1)
//   console.log('超出',uploadParam.files);
//   const file = files[0];
//   console.log('file',file)
//   file.uid = genFileId()
//   console.log('uid',file.uid);
//   uploadref.value[index].handleStart(file)
//   uploadref.value[index].submit()
// }
// 上传文件 格式和大小判断
// const beforeUpload = function(file){
//   const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
//   const whiteList = ['jpg', 'png', 'jpeg', 'pdf','doc','docx','JPG', 'PNG', 'JPEG','PDF','DOCX','DOC'];
//   if (whiteList.indexOf(fileSuffix) === -1) {
//     ElMessage.error('上传格式只能是jpg、jpeg、png、PDF、Word');
//     return false
//   }
//   const isLt2M = file.size / 1024 / 1024 < 50;
//   if (!isLt2M) {
//     ElMessage.error('上传文件大小不能超过 50MB');
//     return false
//   }
// }

// 上传成功
// const uploadSuccess = function(e,index){
//   let {code,data} = e
//   if(code === "000000"){
//     uploadParam.files.push({
//         fileName:fileName(data),
//         fileAddress:data,
//         sort:index+1
//     })
//     console.log('uploadParam2',uploadParam.files);
//   }
// }

const fileError = (file) => {
}

// 删除文件
// const fileRemove = (e,item) => {
//   uploadParam.files = uploadParam.files.filter(i=>i.sort != item)
//   console.log('file',uploadParam.files);
// }

// 上传正稿
const uploadOutwork = (id)=>{
  uploadParam.originalId = id
  isUploadShow.value = true
  getFileData(id)
}

// 获取正稿文件数据
async function getFileData(id){
  let {code,data}= await getAnnexByOriginalId({originalId:id})
  if(code === 200){
    //  data.annexVOS = sortByKey(data.annexVOS,'sort')
     annexCount.value = data.annexCount
     uploadParam.remark = data.remark
     fileList.value = data.annexVOS.map(item =>{
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

// 上传正稿保存
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
    uploadParam.files=val.map(item=>{
      return {
        fileName:item[0].name,
        fileAddress:item[0].fileAddress,
        sort:item[0].sort
      }
    })
    proxy.$modal.loading('正在保存文件，请稍候...')
    saveFile(uploadParam).then(res=>{
      if(res.code===200){
          ElMessage.success(res.msg)
          isUploadShow.value = false
          worktableData()
      }
    }).finally(()=>{
      proxy.$modal.closeLoading()
    })
  }catch(err){
  }
}
 // 打开文件
function openFile(url){
  window.open(url, "_blank");
}
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
.artwork-workbench {
  .alignRight{
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
  // 正稿列表
  .outworkListBox {
    .turn{
      display: inline-block;
      width: 20px;
      line-height: 20px;
      background-color: #ff3399;
      color: #FFFFFF;
      text-align: center;
      margin-right: 4px;
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
    .property{
      display: -webkit-box;
      -webkit-line-clamp: 6;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }
  // 上传正稿弹窗
  .uploadOutwork{
    :deep(.el-drawer__header){
      margin-bottom: 0 !important;
    }
    .unitsBox{
      // margin: 20px 0;
      font-size: 14px;
      .units{
        .outwork{
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
    .outworkBtnBox{
      position:fixed;
      bottom: 20px;
      right: 20px;
    }
  }
  // 分页
  .laypage {
    display: flex;
    justify-content: right;
    margin-top: 20px;
  }
  // 设计制作需求描述弹窗
  .resourceBox{
    .nameBox{
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      margin-top: 20px;
    }
  }
  // 完成任务弹窗
  .doneTask{
    .doneTaskBtn{
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
  // 转移正稿单弹窗
  .transferBox{
    .transferBtn{
      display: flex;
      justify-content: right;
      margin-right: 58px;
    }
  }
  // 备注授权弹窗
  .remarkBox{
    .mandateBtn{
      display: flex;
      justify-content: right;
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
.gesture{
  cursor: pointer;
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
</style>
<template>
  <div>
    <listLayout>
      <template #header>
        <div class="top-bar">
          <el-form :inline="true" :model="formData" class="demo-form-inline filterForm" label-width="120px" ref="formRef">
            <el-form-item label="PO号" prop="poNo">
              <el-input v-model.trim="formData.poNo" placeholder="请输入PO号" clearable class="headerinp" />
            </el-form-item>
            <el-form-item label="印前状态" prop="status">
              <el-select v-model="formData.status" placeholder="所有状态" clearable class="headerinp">
                <el-option v-for="item in prepress_status" v-show="item.label!='待客户确认'&&item.label!='客户已确认'&&item.label!='已退回订单' && item.label!='客户撤单' && item.label!='已驳回' && item.label!='已完成' && item.label != '转正稿中'" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="业务员" prop="salesman">
              <el-input v-model.trim="formData.salesman" placeholder="请输入业务员名称" clearable class="headerinp" />
            </el-form-item>
          </el-form>
          <div class="form-tool-bar">
            <div style="min-width:160px;width:160px;">
              <el-button @click="resetFormParams">重置</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </div>
          </div>
        </div>
      </template>
        <template #table-header>
          <div class="top-bar">
          <!-- <el-link :underline="false" @click="showDialog" style="font-size:16px;">撤单消息<span>({{revokeNum}})</span><span v-if="revokeNum" class="red-dot"></span></el-link> -->
          <!-- <el-button type="primary" @click="Task">领取任务</el-button> -->
            <div class="titleBox">
              <div class="listText">
                  打样印前工作台
                  <el-badge :value="revokeNum||0" :max="99" class="msgbtn" @click="showDialog">
                    <el-button type="warning">撤单消息</el-button>
                  </el-badge>
              </div>
              <div class="disposeBox">
                <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>
              </div>
            </div>
          </div>
            
          
        </template>
        <template #table-content='tableHeight'>
          <div>
            <el-table :data="tableData" :height='tableHeight.tableHeight' v-loading="loading" row-key="id" ref="multipleTable">
              <el-table-column label="PO号" width="300px">
                <template #default="scope">
                  <poView :po-no="scope.row.poNo"></poView>
                  <!-- <el-link :underline="false" v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">
                    {{scope.row.poNo}}
                    <el-icon>
                      <CopyDocument />
                    </el-icon>
                  </el-link> -->
                    <div style="display: flex;">
                      <div v-for="(item, index) in ac_proof_type" :key="index">
                        <el-tag
                          hit
                          v-if="item.value == scope.row.proofingType"
                        >
                          {{ item.label }}
                        </el-tag>
                      </div>
                      <el-tag effect="dark" style="margin-left:5px;cursor: pointer;" @click="seeNote(scope.row.combinationInformation)">组合信息</el-tag>
                      <el-tag v-if="scope.row.isTransfer" style="margin-left:5px;" effect="dark">转单</el-tag>
                    </div>
                  <!-- <div v-if="scope.row.allowModificationOfDie" style="margin-top:5px">
                    <el-tag hit>{{(scope.row.allowModificationOfDie==1?'允':'不')}}许对设计文件、刀模文件进行生产规范化修正</el-tag>
                  </div> -->
                  <div style="margin-top: 5px">
                    <el-tag hit>{{scope.row.productName}}</el-tag>
                    <followInfoFlag  :row="scope.row" name="prepressFollow"></followInfoFlag>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column label="打样编号" width="200px">
                <template #default="scope">
                  <el-link :underline="false" v-copyText="scope.row.proofNo" v-copyText:callback="copyTextSuccess">
                    {{scope.row.proofNo}}
                    <el-icon>
                      <CopyDocument />
                    </el-icon>
                  </el-link>
                </template>
              </el-table-column> -->
              <el-table-column label="工单参数" width="300px">
                <template #default="scope">
                  <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.activityId" :lineFeed="(scope.row.productName&&!(scope.row.productName.indexOf('精装盒')!=-1||scope.row.productName.indexOf('双驳盒')!=-1))"></OrderAttrShow>
                  <!-- <el-link :underline="false" @click="showAttr(scope.row.productAttr)">
                    <div class="overflow-tooltip">{{scope.row.productAttr}}</div>
                  </el-link> -->
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
                      <span class="TimeTitle">推送印前时间：</span>
                      <br/>
                      <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                    </p>
                  </div>
                  <!-- <div>{{scope.row.salesman||'-'}}</div>
                  <div>推送人：{{scope.row.fileSender||'-'}}</div> -->
                </template>
              </el-table-column>
              <el-table-column label="文件下载" width="380px">
                <template #default="scope">
                  <div v-for="(item,index) in scope.row.customerFileList" :key="index">
                    <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress)">{{item.fileName}}</el-link> -->
                    <!-- <el-link :underline="false" :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank">{{item.fileName}}</el-link> -->
                    <!-- <div style="font-size: 13px;color: #409EFF;">{{parseDate(item.uploadTime)}}</div> -->
                    <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                  </div>
                  <div v-for="(item,index) in scope.row.structuralFile" :key="index">
                    <FileShow title="打样结构：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                  </div>
                  <div v-for="(item,index) in scope.row.originalFile" :key="index">
                    <FileShow title="设计正稿文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                  </div>
                  <!-- <div v-if="!scope.row.customerFileList">-</div> -->
                </template>
              </el-table-column>
              <!-- <el-table-column label="设计正稿文件" width="140px">
                <template #default="scope">
                  <div v-for="(item,index) in scope.row.originalFile" :key="index"> -->
                    <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress)">{{item.fileName}}</el-link> -->
                    <!-- <el-link :underline="false" :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank">{{item.fileName}}</el-link>
                  </div>
                  <div v-if="!scope.row.originalFile">-</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="结构文件" width="160px">
                <template #default="scope">
                  <div v-for="(item,index) in scope.row.structuralFile" :key="index"> -->
                    <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress)">{{item.fileName}}</el-link> -->
                    <!-- <el-link :underline="false" :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank">{{item.fileName}}</el-link>
                  </div>
                  <div v-if="!scope.row.structuralFile">-</div>
                  <div style="font-size: 13px;color: #409EFF;">
                    <div style="color: #333;">推送印前时间：</div>{{scope.row.createTime}}
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column label="工单状态">
                <template #default="scope">
                  <DictTag :value="scope.row.status" :options="prepress_status"/>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template #default="scope">
                  <RemarkDialog :order="scope.row" :showButton="(scope.row?.remarkFlag==2)" type="prepress" :perperss_remark_type="perperss_remark_type" @getList="getList"/>
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
                      v-if="scope.row.isTransfer&&scope.row.transferRemark"
                      type="primary"
                      :underline="false"
                      @click="showAttr(scope.row.transferRemark,'转单备注')"
                      >转单备注</el-link
                    >
                  </div>
                </template>
              </el-table-column>
            
              <!-- <el-table-column label="组合信息" width="140px">
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
              <!-- <el-table-column label="印前上传时间" width="160px">
                <template #default="scope">
                  <div>{{scope.row.uploadTime||'-'}}</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="文件推送人" width="90px">
                <template #default="scope">
                  <div>{{scope.row.fileSender||'-'}}</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="是否转单" width="140px">
                <template #default="scope">
                  <div>{{scope.row.isTransfer?'是':'否'}}</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="转单备注" width="140px" :show-overflow-tooltip="true">
                <template #default="scope">
                  <div>{{scope.row.transferRemark||'-'}}</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="正稿备注" width="140px" :show-overflow-tooltip="true">
                <template #default="scope">
                  <div>{{scope.row.originalRemark||'-'}}</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="结构备注" width="140px" :show-overflow-tooltip="true">
                <template #default="scope">
                  <div>{{scope.row.structuralRemark||'-'}}</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="客户源文件上传时间" width="160px">
                <template #default="scope">
                  <div v-for="(item,index) in scope.row.customerFileList" :key="index">
                    <span>{{parseDate(item.uploadTime)}}</span>
                  </div>
                  <div v-if="!scope.row.customerFileList">-</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="推送印前时间" width="160px">
                <template #default="scope">
                  <div>{{scope.row.createTime||'-'}}</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="印前领取时间" width="160px">
                <template #default="scope">
                  <div>{{scope.row.startTime||'-'}}</div>
                </template>
              </el-table-column> -->
              <el-table-column fixed="right" label="操作">
                <template #default="scope">
                  <template v-if="scope.row.status!=0">
                    <p>
                      <el-link type="primary" :disabled="scope.row.status!=1&&scope.row.status!=3&&scope.row.status!=11" :underline="false" @click="toUpload(scope.row)">上传印前</el-link>
                    </p>
                    <p>
                      <el-link type="primary" :disabled="!scope.row.fileStatus" :underline="false" @click="complete(scope.row.activityId)">完成</el-link>
                    </p>
                  </template>
                  <template v-if="scope.row.status==0">
                    <p>
                    <el-link
                      type="primary"
                      :underline="false"
                      class="mar_10"
                      @click="Task(scope.row.activityId)"
                      >领取</el-link
                    >
                    </p>
                  </template>
                  <p>
                    <el-link type="primary" :underline="false"  command="">
                      <!-- @click="rejectDialog(scope.row)" -->
                      <rejectDialog :activityId="scope.row.activityId" @callBack="reject" :scope="scope.row"/>
                    </el-link>
                  </p>
                  <p><el-link type="primary" :underline="false" v-if="scope.row.status!=0" @click="transferDialog(scope.row)" command="">转移处理人</el-link></p>
                  <!-- <el-dropdown v-if="false" trigger="click" @command="(e)=>{downFile(scope.row,e)}">
                    <span class="el-dropdown-link">
                      <el-button size="small">
                        <el-icon>
                          <More />
                        </el-icon>
                      </el-button>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="rejectDialog(scope.row)" command="">驳回</el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.status!=0" @click="transferDialog(scope.row)" command="">转移处理人</el-dropdown-item>
                        <el-dropdown-item command="customerFile">下载客户源文件</el-dropdown-item>
                        <el-dropdown-item command="originalFileUrl">下载正稿文件</el-dropdown-item>
                        <el-dropdown-item command="structuralFileUrl">下载结构文件</el-dropdown-item>
                        <el-dropdown-item command="poxmlUrl">下载poxml</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template #pagination>
          <div class="prooflaypage">
            <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.pageNum"
              @pagination="getList" :total="total" v-model:limit="formData.pageSize" :pageSizes="[20, 30, 50, 100]" />
          </div>
        </template>
    </listLayout>
        <el-dialog
          v-model="dialogVisible"
          :title="dialogType=='reject'?'驳回':'转移印前单'"
          width="600px"
          destroy-on-close
        >
        <el-form :model="dialogForm" label-width="120px" :rules="rules" ref="dialogFormRef">
          <el-form-item v-if="dialogType=='reject'" label="驳回原因" prop="remark">
            <el-input v-model.trim="dialogForm.remark" placeholder="请填写驳回原因" maxlength="500" show-word-limit :rows="4"
              type="textarea" clearable style="width:400px;" />
              <div style="margin-top:10px;">
                <FileUpload
                  :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']"
                  :fileSize="200"
                  type=""
                  name="上传图片附件"
                  v-model:modelValue="dialogForm.remarkImages"
                  del
                />
              </div>
          </el-form-item>
          <el-form-item v-if="dialogType!='reject'" label="账号" prop="username">
            <el-select v-model="dialogForm.username" placeholder="请选择要转入的处理人" filterable >
              <el-option v-for="item in deptUserList" v-show="item.userName!=name" :key="item" :label="item.nickName" :value="item.userName" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogType!='reject'" label="转单备注">
            <el-input 
            v-model.trim="dialogForm.transferRemark" 
            placeholder="请填写转单原因"
            maxlength="500"
            :rows="4"
            show-word-limit
            type="textarea"/>
          </el-form-item>
        </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="dialogConfirm">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
        <el-dialog v-model="isRevokeShow" title="撤单消息" width="1200px">
          <!-- 撤单消息列表 -->
          <cancelOrder
            :revokeData="revokeData"
            @getRevoke="getRevoke"
          ></cancelOrder>
          <div style="position: relative">
            <pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              v-model:page="revokeParams.pageNum"
              @pagination="getCancellationMessage"
              :total="revokeTotal"
              v-model:limit="revokeParams.pageSize"
              :pageSizes="[10, 20, 50, 100]"
            />
          </div>
          <div class="alignRight" style="padding-top: 20px">
            <el-button type="primary" @click="isRevokeShow = false"
              >关闭</el-button
            >
          </div>
        </el-dialog>
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

        <uploadFilecop v-if="isShow" v-model:isShow="isShow" :data="dialogData" :dialogId="dialogId" @saveCallback="getList"/>
</div>
</template>

<script setup>
import { getTask,getTask2, getMyTaskList,getMyTaskWork,finishPrepress,rejectPrepress,transferTask,cancellationMessage,cancellationMessageSum,doNotAgreeToCancelTheOrder,agreeToWithdraw,getDeptUser,downloadPoxml,getCountOfStatus } from '@/api/prepress';
import { ElMessage, ElMessageBox,ElLoading } from 'element-plus';
import { useRouter, useRoute} from 'vue-router';
import {downPrepressFile,parseDate,senseUrl} from "@/utils/index"
import { blobValidate } from '@/utils/ruoyi'
import { saveAs } from 'file-saver';
import {BASE_FILE_URL} from "@/store/global-constant";
import cancelOrder from "@/components/cancelOrder";
import useAppStore from "@/store/modules/user";
import RemarkDialog from "@/components/RemarkDialog";
import OrderAttrShow from "@/components/OrderAttrShow"
import {nextTick} from "vue"
import poView from "./components/poView.vue"
import rejectDialog from "./components/rejectDialog.vue";
import uploadFilecop from './uploadePrepressFile/uploadFile2.vue'
import Counter from "@/components/proof/Counter.vue"
const appStore = useAppStore();
const name = ref('')
name.value = appStore.$state.name
const route = useRoute();
const router = useRouter();
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理

const isShow=ref(false)
const dialogData=ref(null)
const dialogId=ref('')
const tableData = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isNoteShow = ref(false)
const data = reactive({
  dialogForm: {
    username:'',//接收账号
    transferRemark: '',//驳回原因
    remarkImages:null,//驳回图片
    activityId:'',
    poNo:''
  },//撤单参数
  revokeParams: {
    pageNum: 1, // 页数
    pageSize: 20, // 每页条数
  },
  formData: {
    pageNum: 1,//页码
    pageSize: 20,//分页大小
    poNo: null,//PO号
    salesman: null,//业务员
    status: null,//印前状态
    type: 1//印前类型0大货，1打样
  },
});
const { dialogForm,revokeParams,formData } = toRefs(data);
const total = ref(0)
const revokeData = ref([])//撤单列表
const isRevokeShow = ref(false)
const dialogType = ref('reject')
const deptUserList = ref([])//印前领取人列表
const { proxy } = getCurrentInstance();
const { prepress_department,perperss_remark_type,ac_proof_type,prepress_status } = proxy.useDict("prepress_department","perperss_remark_type",'ac_proof_type','prepress_status');
const deptId = ref('')
const revokeTotal = ref(0)
const revokeNum = ref(0)
watch(prepress_department,(val)=>{
  deptId.value = val.find(item=>{return item.label=="prepress_proof"}).value
  getDeptUserList()
})
watch(dialogVisible,(val)=>{
  if (val) {
    dialogForm.value.remark = null
    dialogForm.value.username = null
    dialogForm.value.transferRemark = null
    dialogForm.value.remarkImages = null
  }
})
watch(isRevokeShow,(val)=>{
  if (!val) {
    revokeParams.value.pageNum = 1
    revokeParams.value.pageSize = 20
    getCancellationMessage()
    getList()
  }
})
const multipleTable = ref(null)
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
if (prepress_department.value.length>0) {
  deptId.value = prepress_department.value.find(item=>{return item.label=="prepress_proof"}).value
  getDeptUserList()
}
const NoteContent = ref('')
function seeNote(value) {
  if (value) {
    isNoteShow.value = true
    NoteContent.value = value;
  }
}
//获取印前领取人列表
function getDeptUserList(){
  if (!deptId.value) {
    return
  }
  getDeptUser(deptId.value).then(res=>{
    if (res.code==200) {
      deptUserList.value = res.data
    }
  })
}
function Task(id) {
  // getTask(obj).then(res => {
    proxy.$modal.loading('加载中，请稍候...')
    getTask2({type:1},id).then(res => {
    if (res.code == 200) {
      // if (res.data == '没有可领取的任务了') {
      //   ElMessage({
      //     type: "error",
      //     message: res.data,
      //   })
      // } else {
        getList()
         ElMessage({
          type: 'success',
          message: '领取成功',
        })
      // }
    }
  }).finally(()=>{
      proxy.$modal.closeLoading()
    })
}
//重置表单
function resetFormParams() {
  proxy.resetForm("formRef");
  search();
}
//搜索
function search() {
  formData.value.pageNum = 1//页码
  formData.value.pageSize = 20//分页大小
  getList()
  getCount()
}
function getList() {
  loading.value = true
  // getMyTaskList({type:1}).then(res => {
    getMyTaskWork(formData.value).then(res => {
    if (res.code==200) {
        total.value = res.data.total
      // tableData.value = res.data.map(item=>{
      tableData.value = res.data.rows.map(item=>{
        if (item.originalFileUrl) {
          item.originalFile = JSON.parse(item.originalFileUrl)
        }
        if (item.customerFile) {
          item.customerFileList = JSON.parse(item.customerFile)
        }
        if (item.structuralFileUrl) {
          item.structuralFile = JSON.parse(item.structuralFileUrl)
        }
        return item
      })
    }
  }).finally(()=>{
    loading.value = false
  })
}
getList()
//完成
function complete(id){
  ElMessageBox.confirm(
    '请确认检查印前文件。操作立即生效是否继续？',
    '确定完成印前文件任务？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      proxy.$modal.loading('加载中，请稍候...')
      finishPrepress({type:1},id).then(res=>{
        if (res.code==200) {
          ElMessage({
            type: 'success',
            message: '成功',
          })
          getList()
        }
      }).finally(()=>{
        proxy.$modal.closeLoading()
      })
    })
    .catch(() => {
     
    })
  
}
// 处理数据
function getCount(){
  getCountOfStatus({position:1,...formData.value}).then(res=>{
    if (res.code==200) {
      processing.value = res.data.processing
      toBeProcessed.value = res.data.toBeProcessed
    }
  })
}
getCount()
//获取撤单消息
function getCancellationMessage() {
  cancellationMessageSum({type:1}).then(res=>{
    if(res.code==200){
      revokeNum.value = res.data||0
    }
  })
  //type  0大货印前，1打样印前
  cancellationMessage({type:1,...revokeParams.value}).then(res=>{
    if (res.code==200) {
      revokeData.value = res.data.rows
      revokeTotal.value = res.data.total
    }
  })
}
getCancellationMessage()
//跳转到上传文件页面
function toUpload(data){
  // let path = ''
  // let structuralFile = []
  dialogId.value=data.activityId
  isShow.value=true
  dialogData.value=data.structuralFileUrl
  // switch (data.orderType) {
  //   case 1:
  //   path = '/proofOrder/proofUploadFile1'
  //   structuralFile = data.structuralFileUrl
  //     break;
  //   case 0:
  //   path = '/proofOrder/proofUploadFile2'
  //   structuralFile = data.structuralFileUrl||null
  //     break;
  //   case 2:
  //   path = '/proofOrder/proofUploadFile2'
  //   structuralFile = data.structuralFileUrl||null
  //     break;
  //   default:
  //   ElMessage({
  //     type: 'error',
  //     message: '错误,未知盒型',
  //   })
  //     break;
  // }
  // if (!path) return;
  // router.push({
  //   path:path,
  //   query:{id:data.activityId,num:data.productNumber,goodsId:data.goodsId,structuralFile}
  // })
}
function showAttr(text,type){
  ElMessageBox.alert(text, type, {
    confirmButtonText: '关闭',
    callback: () => {}
  })
}
//复制成功提示
function copyTextSuccess() {
  ElMessage({
    type: 'success',
    message: '复制成功',
  })
}
//下载文件
function downFile(data,type) {
  let arr = []
  if (type) {
    switch (type) {
      case 'customerFile':
      try {
        arr = JSON.parse(data.customerFile).map(item=>{return item.fileAddress})
        downPrepressFile(arr,'客户文件')
      } catch (error) {
        ElMessage.error('没有客户文件')
      }
      break;
    case 'originalFileUrl':
      try {
        arr = JSON.parse(data.originalFileUrl).map(item=>{return item.fileAddress})
        downPrepressFile(arr,'正稿文件')
      } catch (error) {
        ElMessage.error('没有正稿文件')
      }
      break;
    case 'structuralFileUrl':
      try {
        arr = JSON.parse(data.structuralFileUrl).map(item=>{return item.fileAddress})
        let arr2 = JSON.parse(data.customerFile).map(item=>{return item.fileAddress})
        arr = [].concat(arr,arr2)
        downPrepressFile(arr,'结构文件')
      } catch (error) {
        ElMessage.error('没有结构文件')
      }
      break;
    case 'poxmlUrl':
      try {
        if (!data.poxmlUrl) {
          downXML(data)
        } else {
          arr = [data.poxmlUrl]
          downPrepressFile(arr,'poxml文件')
        }
      } catch (error) {
        ElMessage.error('没有poxml文件')
      }
      break;
    
      default:
        break;
    }
  }

}
//下载文件
function urlDownFile(url,name){
  downPrepressFile([url],name)
}

//转移印前单弹窗
function transferDialog(data){
  dialogType.value = 'transfer'
  dialogForm.value.activityId = data.activityId
  dialogForm.value.poNo = data.poNo
  dialogVisible.value = true
}
// //驳回弹窗
// function rejectDialog(data){
//   dialogType.value = 'reject'
//   dialogForm.value.activityId = data.activityId
//   dialogForm.value.poNo = data.poNo
//   dialogForm.value.orderNo = data.orderNo
//   dialogVisible.value = true
// }
const rules = reactive({
  remark: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' },],
  username: [{ required: true, message: '请选择接收账号', trigger: 'change' }],
})
const formRef = ref(null)
const dialogFormRef = ref(null)
async function dialogConfirm() {
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      dialogVisible.value = false
      // if (dialogType.value == 'transfer') {
      //   transfer()
      // } else {
      //   reject()
      // }
      switch (dialogType.value) {
        case 'transfer':
          transfer()
          break;
        case 'reject':
          reject()
          break;
        // case 'structure':
        //   rejectStructure()
        //   break;
        // case 'rejectSend':
        //   rejectFileSend()
        //   break;
      
        default:
          break;
      }
    } else {
      console.log('提交失败,校验不通过', fields)
    }
  })

}
//驳回
function reject(data) {
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
  rejectPrepress(params).then(res=>{
    if(res.code == 200){
      ElMessage.success('驳回成功')
    }
  }).finally(()=>{
    getList()
    proxy.$modal.closeLoading()
  })
}
//转移印前单
function transfer(){
  // formRef.value.validate((valid, fields) => {
  //   if (valid) {
      let data = {
        "activityId": dialogForm.value.activityId,
        "poNo":dialogForm.value.poNo,
        "transferRemark": dialogForm.value.transferRemark,
        "username": dialogForm.value.username,
        "type":dialogForm.value.type
      }
      transferTask(data).then(res=>{
        if (res.code==200) {
          ElMessage({
            type:'success',
            message:'转移成功'
          })
          dialogVisible.value = false
          getList()
        }
      })
    // } else {
    //   console.log('提交失败,校验不通过', fields)
    // }
  // })
}
//显示撤单消息dialog
function showDialog(){
  if (revokeData.value.length == 0) {
    return
  }else{
    isRevokeShow.value = true
    getCancellationMessage()
  }
}
//撤单消息弹窗操作回调
function getRevoke({ data, type }){
  if (type==1) {
    agree(data.activityId)
  }else{
    doNotAgree(data.activityId)
  }
}
//不同意撤单
function doNotAgree(id) {
  doNotAgreeToCancelTheOrder(id).then(res=>{
    if (res.code==200) {
      ElMessage({
        type:'success',
        message:'已拒绝'
      })
    }
  }).finally(()=>{
    getCancellationMessage()
  })
}
//同意撤单
function agree(id) {
  agreeToWithdraw(id).then(res=>{
    if (res.code==200) {
      ElMessage({
        type:'success',
        message:'已同意'
      })
    }
  }).finally(()=>{
    getCancellationMessage()
    getList()
  })
}
function dotNum(data) {
  let num = data.filter(item=>!item.status).length||0
  return num
}

let downloadLoadingInstance = null
//下载poxml
function downXML(scope){
  // return
  downloadLoadingInstance = ElLoading.service({ text: "文件下载中，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  let data = {
    "activityId": scope.activityId,
    // "fileGroup": '1',
    "goodsId": scope.goodsId,
    "orderType": scope.orderType,
    "poNo": scope.poNo,
    "productAttr": scope.productAttr,
    "productNumber": scope.productNumber
  }
  downloadPoxml(data).then(async (res) => {
    let fileName  = ''
      try {
        let str = res.headers['content-disposition']?.split('filename=')[1]
        if (str) {
          fileName  = decodeURI(str);
        }else{
          fileName  = false
        }
      } catch (error) {
        fileName  = false
      }
    const isLogin = await blobValidate(res.data);
    if (isLogin) {
      const blob = new Blob([res.data])
      saveAs(blob, fileName )
    } else {
      const resText = await res.data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
  })
  .catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
  }).finally(()=>{
    downloadLoadingInstance.close()
  })
}
</script>

<style lang="scss" scoped>
.artwork-workbench {
  .top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    padding: 0 10px;
  }

  .btnMt {
    margin-top: 10px;
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
.overflow-tooltip{
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}
.form-tool-bar {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
}
.overflow-tooltip{
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

:deep(.el-popper){
  max-width:400px;
  word-break: break-all;
}
.red-dot{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: rgb(247, 70, 70);
  position: relative;
  top: -4px;
}
.alignRight{
  text-align: right;
}
.disposeBox{
  display: flex;
}
</style>
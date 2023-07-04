<template>
  <div class="artwork-workbench">
    <listLayout>
    <template #header>
      <div class="top-bar">
        <el-form :inline="true" :model="formData" class="demo-form-inline" label-width="120px" ref="formRef">
          <el-form-item label="品类" prop="orderType">
            <el-select v-model="formData.orderType" placeholder="全部品类" clearable style="width:252px;">
              <!-- <el-option label="精装盒" value="1" />
              <el-option label="大货" value="0" /> -->
              <el-option
                v-for="item in ac_original_order_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="PO号" prop="poNo">
            <el-input v-model.trim="formData.poNo" placeholder="请输入PO号" clearable style="width:252px;" />
          </el-form-item>
          <el-form-item label="业务员" prop="salesman">
            <el-input v-model.trim="formData.salesman" placeholder="请输入业务员名称" clearable style="width:252px;" />
          </el-form-item>
          <el-form-item label="印前状态" prop="status">
            <el-select v-model="formData.status" placeholder="" clearable style="width:252px;">
              <el-option v-for="item in prepress_status" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="印前任务领取人" prop="producer">
            <el-select v-model="formData.producer" placeholder="印前任务领取人" clearable filterable style="width:252px;">
              <el-option v-for="item in deptUserList" :key="item" :label="item.nickName" :value="item.nickName" />
            </el-select>
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
        <div class="titleBox">
          <div class="listText">
            印前文件列表
          </div>
          <!-- <div class="disposeBox">
            <div class="distitle">
              <div>
                处理中：<span>{{ processing }}</span> 
              </div>
              <div>
                待处理：<span>{{ toBeProcessed }}</span>
              </div>
            </div>
          </div> -->
          <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>
        </div>
      </div>
    </template>
    <template #table-content='tableHeight'>
      <el-table :data="tableData" :height='tableHeight.tableHeight' v-loading="loading" row-key="activityId" ref="multipleTable">
        <el-table-column label="PO号" width="200">
          <template #default="scope">
            <poView :po-no="scope.row.poNo" type="2"></poView>
            <!-- <el-link :underline="false" v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">
              {{scope.row.poNo}}
              <el-icon>
                <CopyDocument />
              </el-icon>
            </el-link> -->
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
          </template>
        </el-table-column>
        <el-table-column label="工单参数" width="300px">
          <template #default="scope">
            <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.activityId"></OrderAttrShow>
            <!-- <el-link :underline="false" @click="showAttr(scope.row.productAttr)">
              <div class="overflow-tooltip">{{scope.row.productAttr}}</div>
            </el-link> -->
          </template>
        </el-table-column>
        <el-table-column label="文件下载" width="400">
          <template #default="scope">
            <!-- <div>{{scope.row.customerFile}}</div> -->
            <!-- <div v-for="(item,index) in scope.row.customerFileList" :key="index"> -->
              <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress,item.fileName)">{{item.fileName}}</el-link> -->
              <!-- <el-link :underline="false" :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank">{{item.fileName}}</el-link>
            </div> -->
            <div v-if="scope.row.customerFileList?.length > 0"  class="gesture">
              <template
                v-for="(item, index) in scope.row.customerFileList"
                :key="index"
              >
                <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
              </template>
              <div v-if="scope.row.productName.indexOf('精装盒')===-1"><el-tag effect="dark" style="cursor: pointer;" @click="threeDownFile(scope.row)">一键三连下载</el-tag></div>
              <!-- <div v-if="scope.row.productName.indexOf('精装盒')>-1"><el-tag effect="dark" style="cursor: pointer;" @click="hbthreeDownFile(scope.row)">文件下载</el-tag></div> -->
            </div>

            <div v-if="scope.row.annexs?.length > 0"  class="gesture">
              <template
                v-for="(item, index) in scope.row.annexs"
                :key="index"
              > 
                <FileShow v-if="item?.fileType&&(item?.fileType=='PDF文件'||item?.fileType=='印前文件')" title="印前文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
              </template>
            </div>

            <el-button v-if="scope.row.productName.indexOf('精装盒')>-1" @click="fliedlo(scope.row)">文件下载</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="印前领取人" width="140">
          <template #default="scope">
            <div>{{scope.row.producerName||'-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="印前文件状态" width="120">
          <template #default="scope">
            <DictTag :value="scope.row.fileStatus" :options="prepress_file_status"/>
          </template>
        </el-table-column> -->
        <el-table-column label="状态/耗时(小时)" width="150">
          <template #default="scope">
            <div style="display:flex;">
              <DictTag :value="scope.row.status" :options="prepress_status"/>
              <span v-if="scope.row.status==0">
                /{{getHour(scope.row.createTime)}}
              </span>
              <span v-else-if="scope.row.status==1||scope.row.status==3||scope.row.status==11">
                /{{getHour(scope.row.startTime)}}
              </span>
              <template v-else>
                <span v-if="scope.row?.timeConsum">/{{scope.row?.timeConsum}}</span>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="scope.row.orderRemark">
              <el-link
                type="primary"
                :underline="false"
                @click="CommentPopup(scope.row.orderRemark,'订单备注')"
                >订单备注</el-link>
            </div>
            <div v-if="scope.row.structuralRemark">
              <el-link
                  v-if="scope.row.structuralRemark"
                  type="primary"
                  :underline="false"
                  @click="remarkclick(scope.row.structuralRemark)">
                  结构备注
              </el-link>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否转单">
          <template #default="scope">
            <div>{{scope.row.isTransfer?'是':'否'}}</div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="转单备注" width="140px" :show-overflow-tooltip="true">
          <template #default="scope">
            <div>{{scope.row.transferRemark||'-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="正稿备注" width="140px" :show-overflow-tooltip="true">
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
              <span>{{parseDate(item.uploadTime,true)}}</span>
            </div>
            <div v-if="!scope.row.customerFileList">-</div>
          </template>
        </el-table-column>
        <el-table-column label="印前领取时间" width="160px">
          <template #default="scope">
            <div>{{scope.row.startTime||'-'}}</div>
          </template>
        </el-table-column> -->
        <el-table-column width="200" label="操作" fixed="right">
          <template #default="scope">
            <div><el-link :underline="false" type="primary" @click="showDialog(scope.row,'reject')" v-if="scope.row.status==0||scope.row.status==1||scope.row.status==3||scope.row.status==11">驳回至结构</el-link></div>
            <div><el-link :underline="false" type="primary" @click="showDialog(scope.row,'rejectSend')" v-if="scope.row.status==0||scope.row.status==1||scope.row.status==3||scope.row.status==11">驳回至业务</el-link></div>
            <div><el-link :underline="false" type="primary" @click="toDetail(scope.row.activityId)">处理历史</el-link></div>
            <el-dropdown trigger="click" @command="(e)=>{downFile(scope.row,e)}" v-if="false">
              <span class="el-dropdown-link">
                <el-button size="small">
                  <el-icon>
                    <More />
                  </el-icon>
                </el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="customerFile">下载客户源文件</el-dropdown-item>
                  <el-dropdown-item command="PDF文件">下载印前文件</el-dropdown-item>
                  <el-dropdown-item command="3D视频文件">下载视频文件</el-dropdown-item>
                  <el-dropdown-item command="report文件">下载Report文件</el-dropdown-item>
                  <!-- <el-dropdown-item :disabled="scope.row.status!=1" command="transfer">转移印前单</el-dropdown-item> -->
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #pagination>
      <div class="prooflaypage">
        <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.pageNum"
          @pagination="handleSizeChange" :total="total" v-model:limit="formData.pageSize" :pageSizes="[20, 30, 50, 100]" />
      </div>
    </template>
    </listLayout>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="800" align-center destroy-on-close>
      <div>
        <el-form :model="dialogForm" label-width="120px" ref="dialogFormRef" :rules="rules">
          <!-- <el-form-item v-if="dialogType=='reject'" label="驳回原因" prop="remark"> -->
            <el-form-item label="驳回原因分类" prop="refuseClassification" v-if="dialogType=='reject'||dialogType=='rejectSend'">
              <el-checkbox-group v-model="dialogForm.refuseClassification">
                <p><el-checkbox label="尺寸差异" /></p>
                <p><el-checkbox label="结构类型与订单不符" /></p>
                <p><el-checkbox label="结构不符合生产规范" /></p>
                <p><el-checkbox label="其他" /></p>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="驳回备注说明:" prop="remark">
              <Editor v-model:html="dialogForm.remark" ></Editor>
            </el-form-item>
            <!-- <el-input v-model.trim="dialogForm.remark" placeholder="请填写驳回原因" maxlength="500" show-word-limit :rows="4"
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
            </div> -->
          <!-- </el-form-item> -->
          <el-form-item v-if="dialogType!='reject'&&dialogType!='rejectSend'" label="账号" prop="account">
            <el-select v-model="dialogForm.account" placeholder="请选择接收账号" clearable style="width:400px;">
              <el-option v-for="item in deptUserList" v-show="item.userName!=name" :key="item.value" :label="item.nickName" :value="item.userName" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogType!='reject'&&dialogType!='rejectSend'" label="转单备注">
            <el-input v-model.trim="dialogForm.transferRemark" placeholder="请填写转单原因" maxlength="500" show-word-limit
              type="textarea" clearable style="width:400px;" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="RemarkShow" title="结构备注" :close-on-click-modal="false" destroy-on-close align-center
        width="800px" class="historyPopupBox">
        <Editor v-model:html="remarkTxt" :edit="false"></Editor>
    </el-dialog>

    <HistoryDialog v-if="historyDialog" hideremark :historyListData="historyListData" v-model:historyShow="historyDialog" />

    <FileDialog v-if="preileDialog" v-model:preileDialog="preileDialog" dld :DialogData="dialogData2" :queryData="queryData"/>
  </div>
</template>

<script setup>
import { getPrepressDetailById, getPrepressList, rejectPrepress, transferTask,getCountOfStatus,returnFileBeforePushing,getPrepressFile } from '@/api/prepress';
import { getDeptUser } from "@/api/system/user";
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';
import {downPrepressFile,parseDate,senseUrl,CommentPopup,getText,getHour} from "@/utils/index"
import {BASE_FILE_URL} from "@/store/global-constant"
import { watch, nextTick} from 'vue';
import useAppStore from "@/store/modules/user";
import OrderAttrShow from "@/components/OrderAttrShow"
import poView from "../../../proof/components/poView.vue"
import Counter from "@/components/proof/Counter.vue"
import Editor from "@/components/Editor"
import FileDialog from "./uploadFile3.vue"
import { zipDownload } from '@/api/download'

const appStore = useAppStore();
const name = ref('')
name.value = appStore.$state.name
const tableData = ref([])
var dialogTitle = ref('驳回')
var dialogType = ref('reject')
const data = reactive({
  formData: {
    pageNum: 1,//页码
    pageSize: 20,//分页大小
    poNo: null,//PO号
    salesman: null,//业务员
    status: null,//印前状态
    producer: null,//印前领取人
    orderType: '1',//订单类型
    type: 0//印前类型0大货，1打样
  },
  dialogForm: {
    remark: null,//驳回原因
    refuseClassification:[],
    account:null,
    remarkImages:'',//驳回图片
    transferRemark:null,
  },
  dialogData: {}
});
const { formData, dialogForm, dialogData } = toRefs(data);
const { proxy } = getCurrentInstance();
const { prepress_status,prepress_file_status,prepress_department,ac_original_order_type } = proxy.useDict("prepress_status","prepress_file_status","prepress_department","ac_original_order_type");
const router = useRouter()
const loading = ref(false)
const total = ref(0)
var dialogVisible = ref(false)
const deptUserList = ref([])//印前领取人列表
const deptId = ref('')
let RemarkShow = ref(false);
let remarkTxt = ref("");
let historyListData = ref([]);
let historyDialog = ref(false);

const preileDialog = ref(false)
const dialogData2 = ref(null)
const queryData = ref(null)

watch(prepress_department,(val)=>{
  deptId.value = val.find(item=>{return item.label=="prepress_bulk"}).value
  getDeptUserList()
})
watch(dialogVisible,(val)=>{
  if (val) {
    dialogForm.value.remark = null
    dialogForm.value.account = null
    dialogForm.refuseClassification=[]
    dialogForm.value.transferRemark = null
    dialogForm.value.remarkImages = ''
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
  deptId.value = prepress_department.value.find(item=>{return item.label=="prepress_bulk"}).value
  getDeptUserList()
}
function handleSizeChange(val) {
  getList()
}
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理
//获取印前文件列表
function getList() {
  loading.value = true
  getCount()
  getPrepressList(formData.value).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows.map(item=>{
        item.customerFileList = JSON.parse(item.customerFile)
        return item
      })
      total.value = res.data.total
    }
  })
  .finally(()=>{
    loading.value = false
  })
}
getList()
function getCount(){
  getCountOfStatus(formData.value).then(res=>{
    if (res.code==200) {
      processing.value = res.data.processing
      toBeProcessed.value = res.data.toBeProcessed
    }
  })
}
const fliedlo = (data) => {
  getPrepressFile(data.activityId).then((res) => {
    if (res.code == 200) {
      queryData.value=data
      dialogData2.value = res.data;
      preileDialog.value=true;
    }
  })
}
//复制成功提示
function copyTextSuccess() {
  ElMessage({
    type: 'success',
    message: '复制成功',
  })
}
function hbthreeDownFile(data) {
  // let arr = []
  // try {
  //   JSON.parse(data.structuralFileUrl).forEach((item) => {
  //     if (item.fileAddress) {
  //       arr.push(item.fileAddress)
  //     }
  //   });
  // } catch (error) {}
  // try {
  //   JSON.parse(data.customerFile).forEach((item) => {
  //     if (item.fileAddress) {
  //       arr.push(item.fileAddress)
  //     }
  //   });
  // } catch (error) {}
  // try {
  //   data?.annexs.forEach((e) => {
  //     if (e?.fileType&&e?.fileType == '印前文件') {
  //       arr.push(e?.fileAddress)
  //     }
  //   });
  // } catch (error) {
  //   console.log('添加印前文件错误',error);
  // }
  
  // data?.poxmlUrl && arr.push(data.poxmlUrl)
  // let str = '一键三连'+parseTime(new Date(),'{y}{m}{d}{h}{i}')
  // var newArr = [...new Set(arr)]
  downloadComponentPoXml({
    "activityId": data.activityId,
    "associatedTrackingNumber": data.associatedTrackingNumber,
    "componentId": 0,
    "poNo": ""
  }).then(res=>{
    console.log(res);
  })
}
function threeDownFile(data) {
  let arr = []
  try {
    JSON.parse(data.structuralFileUrl).forEach((item) => {
      if (item.fileAddress) {
        arr.push(item.fileAddress)
      }
    });
  } catch (error) {}
  try {
    JSON.parse(data.customerFile).forEach((item) => {
      if (item.fileAddress) {
        arr.push(item.fileAddress)
      }
    });
  } catch (error) {}
  try {
    data?.annexs.forEach((e) => {
      if (e?.fileType&&e?.fileType == '印前文件') {
        arr.push(e?.fileAddress)
      }
    });
    // arr.push(data.annexs?.find(e => e.fileType == '印前文件')?.fileAddress)
  } catch (error) {
    console.log('添加印前文件错误',error);
  }
  
  data?.poxmlUrl && arr.push(data.poxmlUrl)
  // let str = '一键三连'+parseTime(new Date(),'{y}{m}{d}{h}{i}')
  var newArr = [...new Set(arr)]
  zipDownload({ fileList: newArr, name: data.poNo }, data.poNo+'.zip')
}
//驳回
function confirmReject() {
  rejectPrepress({
    "activityId": dialogData.value.activityId,
    "poNo": dialogData.value.poNo,//PO号
    "remark": dialogForm.value.remark,//驳回原因
    remarkImages:dialogForm.value.remarkImages?.split(',').filter(a=>a),
    orderNo:dialogData.value.orderNo,//订单号
    refuseClassification:dialogForm.value.refuseClassification.toString(),
    type:0,//订单类型：0大货 1打样
  }).then(res => {
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '驳回成功',
      })
      getList()
    }
  })
}
function transferOrder() {
  transferTask({
    "activityId": dialogData.value.activityId,
    "transferRemark": dialogForm.value.transferRemark,//转单备注
    "username": dialogForm.value.account,//接收人
    "type":dialogForm.value.type
  }).then(res => {
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '转移成功',
      })
    }
  })
}
//弹窗显示商品属性
function showAttr(text) {
  ElMessageBox.alert(text, '属性详情', {
    confirmButtonText: '关闭',
    callback: () => { }
  })
}
//跳转详情
function toDetail(id) {
  getPrepressDetailById(id).then(res => {
    if (res.code == 200) {
      historyDialog.value = true
      historyListData.value = res.data.logs
    }
  })
  // router.push({
  //   path: '/prepress/prepressDetails',
  //   query: { id: id }
  // })
}
//下载文件
function downFile(data, type) {
  let arr = []
  switch (type) {
    case 'customerFile':
      try {
        arr = JSON.parse(data.customerFile).map(item=>{return item.fileAddress})
        downPrepressFile(arr,'客户源文件')
      } catch (error) {
        console.log('下载客户源文件失败',error);
        ElMessage.error('没有客户源文件')
      }
      break;
    case 'transfer':
      showDialog(data, type)
      break;
    case 'PDF文件':
      arr = data.annexs.filter(item=>{return (item.fileType == '印前文件'||item.fileType == 'PDF文件')}).map(item=>{return item.fileAddress})
      downPrepressFile(arr,'印前文件')
      break;
    case '3D视频文件':
      arr = data.annexs.filter(item=>{return item.fileType == '3D视频文件'}).map(item=>{return item.fileAddress})
      downPrepressFile(arr,'视频文件')
      break;
    case 'report文件':
      arr = data.annexs.filter(item=>{return item.fileType == 'report文件'}).map(item=>{return item.fileAddress})
      downPrepressFile(arr,'Report文件')
      break;

    default:
      break;
  }
}
//下载文件
function urlDownFile(url,name){
  downPrepressFile([url],name)
}
//显示驳回/转移弹窗
function showDialog(data, type) {
  dialogData.value = data
  dialogType.value = type
  if (type == 'transfer') {
    dialogTitle.value = '转移印前单'
  } else if (type == 'rejectSend'){
    dialogTitle.value = '驳回至业务'
  } else {
    dialogTitle.value = '驳回'
  }
  dialogVisible.value = true
}
const validateFirstEditor = (rule, value, callback) => {
  if (value == ""||!getText(value)) {
    callback(new Error("驳回备注说明"));
  } else {
    callback();
  }
};
const rules = reactive({
  remark: [
        { 
            required: true,
            validator: validateFirstEditor,
            trigger: "blur", 
        }
    ],
  refuseClassification:[{ required: true, message: "请选择驳回原因分类", trigger: "blur" }],
  account: [{ required: true, message: '请选择接收账号', trigger: 'change' }],
})
const dialogFormRef = ref(null)
async function dialogConfirm() {
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      dialogVisible.value = false
      if (dialogType.value == 'transfer') {
        transferOrder()
      } else if(dialogType.value == 'rejectSend'){
        rejectFileSend()
      }else {
        confirmReject()
      }
    } else {
      console.log('提交失败,校验不通过', fields)
    }
  })

}
//退回文件推送前
function rejectFileSend() {
  returnFileBeforePushing({
    activityId: dialogData.value.activityId,
    orderNo: dialogData.value.orderNo,
    poNo: dialogData.value.poNo,
    remark: dialogForm.value.remark,
    refuseClassification:dialogForm.value.refuseClassification.toString(),
    type: 0,
  })
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "退回成功",
        });
      }
    })
    .finally(() => {
      dialogVisible.value = false;
      getList();
    });
}
const remarkclick = (data) => {
  RemarkShow.value=true
  remarkTxt.value=data
}
//获取印前领取人列表
function getDeptUserList(){
  if (!deptId.value) {
    return
  }
  getDeptUser({deptId:deptId.value}).then(res=>{
    if (res.code==200) {
      deptUserList.value = res.data
    }
  })
}
/** 重置按钮操作 */
function resetFormParams() {
  proxy.resetForm("formRef");
  search();
}
//搜索
function search() {
  formData.value.pageNum = 1//页码
  formData.value.pageSize = 20//分页大小
  getList()
}
</script>

<style lang="scss" scoped>
@import './style.css';

.artwork-workbench {
  .state {
    width: 140px;
    display: flex;
    justify-content: space-between;
  }
  .status-bar{
    display: flex;
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    margin: 6px 0;
    padding: 0 8px;
  }
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
</style>
<template>
  <div class="artwork-workbench">
    <listLayout>
      <template #header>
        <div class="top-bar">
          <el-form :inline="true" :model="formData" class="demo-form-inline filterForm" label-width="120px" ref="formRef">
            <!-- <el-form-item label="打样编号" prop="proofNo">
              <el-input v-model.trim="formData.proofNo" placeholder="请输入打样编号" clearable style="width:252px;" />
            </el-form-item> -->
            <el-form-item label="品类" prop="orderType">
              <el-select v-model="formData.orderType" placeholder="全部品类" clearable class="headerinp">
                <!-- <el-option label="精装盒" value="精装盒" />
                <el-option label="大货" value="大货" /> -->
                <el-option
                  v-for="item in ac_original_order_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="PO号" prop="poNo">
              <el-input v-model.trim="formData.poNo" placeholder="请输入PO号" clearable class="headerinp" />
            </el-form-item>
            <el-form-item label="业务员" prop="salesman">
              <el-input v-model.trim="formData.salesman" placeholder="请输入业务员名称" clearable class="headerinp" />
            </el-form-item>
            <el-form-item label="印前状态" prop="status">
              <el-select v-model="formData.status" placeholder="所有状态" clearable class="headerinp">
                <el-option v-for="item in prepress_status" v-show="item.label!='待客户确认'&&item.label!='客户已确认'&&item.label!='已退回订单' && item.label!='客户撤单'&&item.label != '转正稿中'" :key="item.value" :label="item.label=='已撤回'?'被撤回':item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="印前领取人" prop="producer">
              <el-select v-model="formData.producer" placeholder="所有领取人" clearable filterable class="headerinp">
                <el-option v-for="item in deptUserList" :key="item.value" :label="item.nickName" :value="item.nickName" />
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
            打样印前列表
          </div>
          <div class="disposeBox">
            <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>            
          </div>
        </div>
      </div>
      </template>
      <template #table-content='tableHeight'>
        <div>
          <el-table :data="tableData" :height='tableHeight.tableHeight' v-loading="loading" row-key="activityId"  ref="multipleTable">
            <el-table-column label="PO号" width="200">
              <template #default="scope">
                <poView :po-no="scope.row.poNo"></poView>
                <!-- <el-link :underline="false" v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">
                  {{scope.row.poNo}}
                  <el-icon>
                    <CopyDocument />
                  </el-icon>
                </el-link> -->
                <div v-for="(item, index) in ac_proof_type" :key="index">
                      <el-tag
                        hit
                        v-if="item.value == scope.row.proofingType"
                      >
                        {{ item.label }}
                      </el-tag>
                    </div>
                <div style="margin-top: 4px" v-show="scope.row.productName">
                  <el-tag hit>{{scope.row.productName}}</el-tag>
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
                <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.activityId" :lineFeed="(scope.row.productAttr&&!(scope.row.productAttr.indexOf('面料1')!=-1))"></OrderAttrShow>
                <!-- <el-link :underline="false" @click="showAttr(scope.row.productAttr)">
                  <div class="overflow-tooltip">{{scope.row.productAttr}}</div>
                </el-link> -->
              </template>
            </el-table-column>
             <el-table-column label="业务员">
              <template #default="scope">
                <p v-show="scope.row.salesman">
                  <span class="TimeTitle">业务员：</span><br/>
                  <span class="TimeCon">{{ scope.row.salesman || "-" }}</span>
                </p>
                <p v-show="scope.row.createTime">
                  <span class="TimeTitle">推送时间：</span>
                  <br/>
                  <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="文件下载" width="380">
              <template #default="scope">
                <!-- <div>{{scope.row.customerFile}}</div> -->
                <div v-for="(item,index) in scope.row.customerFileList" :key="index">
                  <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress,item.fileName)">{{item.fileName}}</el-link> -->
                  <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                </div>
      
                <div v-if="scope.row.structuralFileUrl&&jsonParse(scope.row.structuralFileUrl.length)" class="gesture">
                  <template v-for="(item, index) in jsonParse(scope.row.structuralFileUrl)" :key="index">
                        <FileShow title="打样结构：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                  </template>
                </div>
                <!-- <div v-if="scope.row.annexVOS?.length > 0">
                  <template
                    v-for="(item, index) in scope.row.annexVOS"
                    :key="index"
                  >   
                    <span v-if="scope.row.annexVOS.length > 1">部件{{ toChineseNumber(index + 1) }}:</span>
                    <FileShow title="结构文件:" :filename="item.fileName" :fileurl="item.fileAddress"/>
                  </template>
                </div> -->
                <!-- <div v-if="!scope.row.customerFileList.length">-</div> -->
              </template>
            </el-table-column>
            <!-- <el-table-column label="客户源文件上传时间" width="160">
              <template #default="scope">
                <div v-for="(item,index) in scope.row.customerFileList" :key="index">
                  <span>{{parseDate(item.uploadTime,true)}}</span>
                </div>
                <div v-if="!scope.row.customerFileList.length">-</div>
              </template>
            </el-table-column>
            <el-table-column label="是否转单" width="140">
              <template #default="scope">
                <div>{{scope.row.isTransfer?'是':'否'}}</div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="转单备注" :show-overflow-tooltip="true">
              <template #default="scope">
                <div>{{scope.row.transferRemark||'-'}}</div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="印前文件状态">
              <template #default="scope">
                <DictTag :value="scope.row.fileStatus" :options="prepress_file_status"/>
              </template>
            </el-table-column> -->
            <el-table-column label="工单状态/耗时(小时)">
              <template #default="scope">
                <div style="display:flex;">
                  <span v-if="scope.row.status==5">被撤回</span>
                  <DictTag v-else :value="scope.row.status" :options="prepress_status"/>
                  <span v-if="scope.row.status==0">
                    /{{getHour(scope.row.createTime)}}
                  </span>
                  <span v-else-if="scope.row.status==1||scope.row.status==3">
                    /{{getHour(scope.row.startTime)}}
                  </span>
                  <template v-else>
                    <span v-if="scope.row?.timeConsum">/{{scope.row?.timeConsum}}</span>
                  </template>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="印前领取人" width="140">
              <template #default="scope">
                <div>{{scope.row.producerName||'-'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="印前领取时间" width="160">
              <template #default="scope">
                <div>{{scope.row.startTime||'-'}}</div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="订单备注" :show-overflow-tooltip="true">
              <template #default="scope">
                <div>
                  {{scope.row.orderRemark||'-'}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="正稿备注" :show-overflow-tooltip="true">
              <template #default="scope">
                <div>{{scope.row.originalRemark||'-'}}</div>
              </template>
            </el-table-column> -->
            <el-table-column label="备注">
              <template #default="scope">
                <div>
                  <el-link
                    v-if="scope.row.structuralRemark"
                    type="primary"
                    :underline="false"
                    @click="CommentPopup(scope.row.structuralRemark,'结构备注')"
                    >结构备注</el-link>
                </div>
                <div>
                  <el-link
                    v-if="scope.row.transferRemark"
                    type="primary"
                    :underline="false"
                    @click="CommentPopup(scope.row.transferRemark,'转单备注')"
                    >转单备注</el-link>
                </div>
                <div>
                  <el-link
                    v-if="scope.row.transferRemark"
                    type="primary"
                    :underline="false"
                    @click="CommentPopup(scope.row.transferRemark,'转单备注')"
                    >转单备注</el-link>
                </div>
                <div>
                  <el-link
                    v-if="scope.row.originalRemark"
                    type="primary"
                    :underline="false"
                    @click="CommentPopup(scope.row.originalRemark,'正稿备注')"
                    >正稿备注</el-link>
                </div>
                <div>
                  <el-link
                    v-if="scope.row.orderRemark"
                    type="primary"
                    :underline="false"
                    @click="CommentPopup(scope.row.orderRemark,'订单备注')"
                    >订单备注</el-link>
                </div>

                
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <p><el-link :underline="false" type="primary" @click="toDetail(scope.row.activityId)">处理历史</el-link></p>
                <!-- <el-link :underline="false" type="primary" @click="showDialog(scope.row,'reject')" style="margin-left:10px;">驳回</el-link> -->
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
                      <!-- <el-dropdown-item command="3D视频文件">下载视频文件</el-dropdown-item>
                      <el-dropdown-item command="report文件">下载Report文件</el-dropdown-item> -->
                      <!-- <el-dropdown-item :disabled="scope.row.status!=1" command="transfer">转移印前单</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template #pagination>
        <div class="prooflaypage">
          <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.pageNum"
            @pagination="handleSizeChange" :total="total" v-model:limit="formData.pageSize" :pageSizes="[20, 30, 50, 100]" />
        </div>
      </template>
    </listLayout>

    <!-- 历史弹窗 -->
    <HistoryDialog v-if="historyDialog" :historyListData="detailData" v-model:historyShow="historyDialog"/>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="600" align-center destroy-on-close>
      <div>
        <el-form :model="dialogForm" label-width="120px" ref="dialogFormRef" :rules="rules">
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
          <el-form-item v-if="dialogType!='reject'" label="账号" prop="account">
            <el-select v-model="dialogForm.account" placeholder="请选择接收账号" clearable style="width:400px;">
              <el-option v-for="item in deptUserList" v-show="item.userName!=name" :key="item.value" :label="item.nickName" :value="item.userName" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogType!='reject'" label="转单备注">
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
  </div>
</template>

<script setup>
import { getPrepressDetailById, getPrepressList, rejectPrepress, transferTask,getDeptUser,getCountOfStatus } from '@/api/prepress';
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';
import {downPrepressFile,parseDate,senseUrl,CommentPopup,getHour} from "@/utils/index"
import {BASE_FILE_URL} from "@/store/global-constant"
import useAppStore from "@/store/modules/user";
import OrderAttrShow from "@/components/OrderAttrShow"
import { nextTick, watch } from 'vue';
import poView from "./components/poView.vue"
import Counter from "@/components/proof/Counter.vue"
const appStore = useAppStore();
const name = ref('')
name.value = appStore.$state.name

const tableData = ref([])
var dialogTitle = ref('驳回')
var dialogType = ref('reject')
const data = reactive({
  formData: {
    proofNo:null,//打样编号
    pageNum: 1,//页码
    pageSize: 20,//分页大小
    poNo: null,//PO号
    salesman: null,//业务员
    status: null,//印前状态
    producer: null,//印前领取人
    orderType: null,//订单类型
    type: 1//印前类型0大货，1打样
  },
  dialogForm: {
    remark: '',//驳回原因
    remarkImages:null,//驳回图片
  },
  dialogData: {},
});
const { formData, dialogForm, dialogData } = toRefs(data);
const { proxy } = getCurrentInstance();
const { prepress_status,prepress_file_status,prepress_department,ac_original_order_type,ac_proof_type } = proxy.useDict("prepress_status","prepress_file_status","prepress_department","ac_original_order_type","ac_proof_type");
const router = useRouter()
const loading = ref(false)
const total = ref(0)
const dialogVisible = ref(false)
const deptUserList = ref([])//印前领取人列表
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理
const deptId = ref('')
let detailData = ref([])
let historyDialog = ref(false)
watch(prepress_department,(val)=>{
  deptId.value = val.find(item=>{return item.label=="prepress_proof"}).value
  getDeptUserList()
})
watch(dialogVisible,(val)=>{
  if (val) {
    dialogForm.value.remark = null
    dialogForm.value.account = null
    dialogForm.value.transferRemark = null
    dialogForm.value.remarkImages = null
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
function handleSizeChange(val) {
  getList()
}
function jsonParse(val) {
  if (val) {
    return JSON.parse(val);
  } else {
    return "";
  }
}
//获取印前文件列表
function getList() {
  getCount()
  loading.value = true
  getPrepressList(formData.value).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows.map((item,i)=>{
        if (item.customerFile) {
          item.customerFileList = JSON.parse(item.customerFile)
        }else{
          item.customerFileList = []
        }
        return item
      })
      total.value = res.data.total
      // processing.value = res.data.processing
      // toBeProcessed.value = res.data.toBeProcessed
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
//复制成功提示
function copyTextSuccess() {
  ElMessage({
    type: 'success',
    message: '复制成功',
  })
}
//驳回
function confirmReject() {
  proxy.$modal.loading('加载中，请稍候...')
  rejectPrepress({
    "activityId": dialogData.value.activityId,
    "poNo": dialogData.value.poNo,//PO号
    "remark": dialogForm.value.remark,//驳回原因
    orderNo:dialogData.value.orderNo,//订单号
    remarkImages:dialogForm.value.remarkImages?.split(',').filter(a=>a),
    type:1,//订单类型：0大货 1打样
  }).then(res => {
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '驳回成功',
      })
      getList()
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
  })
}
function transferOrder() {
  proxy.$modal.loading('加载中，请稍候...')
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
  }).finally(()=>{
    proxy.$modal.closeLoading()
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
  getPrepressDetailById(id).then((res) => {
    if (res.code == 200) {
      if (res.data) {
        detailData.value = res.data.logs;
        historyDialog.value = true;
      }
    }
  });
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
        downPrepressFile(arr,'客户文件')
      } catch (error) {
        console.log('下载客户文件失败',error);
        ElMessage.error('没有客户文件')
      }
      break;
    case 'originalFileUrl':
      try {
        arr = JSON.parse(data.originalFileUrl).map(item=>{return item.fileAddress})
        downPrepressFile(arr,'正稿文件')
      } catch (error) {
        console.log('下载正稿文件失败',error);
        ElMessage.error('没有正稿文件')
      }
      break;
    case 'structuralFileUrl':
      try {
        arr = JSON.parse(data.structuralFileUrl).map(item=>{return item.fileAddress})
        downPrepressFile(arr,'结构文件')
      } catch (error) {
        console.log('下载结构文件失败',error);
        ElMessage.error('没有结构文件')
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
  } else {
    dialogTitle.value = '驳回'
  }
  dialogVisible.value = true
}
const rules = reactive({
  remark: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' },],
  account: [{ required: true, message: '请选择接收账号', trigger: 'change' }],
})
const dialogFormRef = ref(null)
async function dialogConfirm() {
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      dialogVisible.value = false
      if (dialogType.value == 'transfer') {
        transferOrder()
      } else {
        confirmReject()
      }
    } else {
      console.log('提交失败,校验不通过', fields)
    }
  })

}
//获取印前领取人列表
function getDeptUserList(){
  if(!deptId.value) return;
  getDeptUser(deptId.value).then(res=>{
    if (res.code==200) {
      deptUserList.value = res.data
    }
  })
}
getDeptUserList()
/** 重置按钮操作 */
let formRef = ref(null)
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
.disposeBox{
  display: flex;
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
.artwork-workbench {
  .state {
    width: 140px;
    display: flex;
    justify-content: space-between;
  }
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
</style>
<template>
  <div class="artwork-workbench">
    <listLayout>
      <template #header>
        <div class="top-bar">
          <el-form :inline="true" :model="formData" label-width="120px" ref="formRef" class="demo-form-inline filterForm">
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
            <el-form-item label="印前完成时间">
              <template #label>
                <span>印前完成时间</span>
              </template>
              <el-date-picker
                v-model="datePicker"
                type="daterange"
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="headerinp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="业务员" prop="salesman">
              <el-input v-model.trim="formData.salesman" placeholder="请输入业务员名称" clearable class="headerinp" />
            </el-form-item>
            <el-form-item label="印前状态" prop="status">
              <el-select v-model="formData.status" placeholder="所有状态" clearable class="headerinp">
                <el-option v-for="item in prepress_status" v-show="item.label!='未领取'&&item.label!='待客户确认'&&item.label!='客户已确认'&&item.label!='已退回订单'&& item.label!='客户撤单'&&item.label != '转正稿中'"  :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="印前领取人">
              <el-select v-model="formData.producer" placeholder="印前制作人" clearable style="width:252px;">
                <el-option v-for="item in deptUserList" :key="item" label="1" value="1" />
              </el-select>
            </el-form-item> -->
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
        <div class="tool-bar">
          <div class="listText">我的印前文件列表</div>
          <div><el-button @click="downExcel">导出</el-button></div>
        </div>
      </template>
      <template #table-content="tableHeight">
        <div>
          <el-table :data="tableData" :height="tableHeight.tableHeight" row-key="activityId" ref="multipleTable">
            <el-table-column label="PO号" width="200px">
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
            <el-table-column width="300px" label="工单参数">
              <template #default="scope">
                <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.activityId" :lineFeed="(scope.row.productAttr&&!(scope.row.productAttr.indexOf('面料1')!=-1))"></OrderAttrShow>
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
                    <span class="TimeTitle">推送时间：</span>
                    <br/>
                    <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="文件下载" width="380">
              <template #default="scope">
                <!-- <div>{{scope.row.customerFile}}</div> -->
                <div v-for="(item,index) in scope.row.customerFileList" :key="index">
                  <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                </div>
                <div v-if="scope.row.structuralFileUrl&&jsonParse(scope.row.structuralFileUrl.length)" class="gesture">
                  <template v-for="(item, index) in jsonParse(scope.row.structuralFileUrl)" :key="index">
                        <FileShow title="打样结构：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                  </template>
                </div>
                <!-- <div v-if="!scope.row.customerFileList.length">-</div> -->
              </template>
            </el-table-column>
            <!-- <el-table-column label="印前文件状态">
              <template #default="scope">
                <div>{{scope.row.fileStatus==0?'未上传':scope.row.fileStatus==1?'部分上传':'已上传'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="印前耗时">
              <template #default="scope">
                <div>{{scope.row.timeConsum||'-'}}</div>
              </template>
            </el-table-column> -->
            <el-table-column label="备注">
              <template #default="scope">
                <div v-if="!scope.row.transferRemark">-</div>
                <div v-if="scope.row.transferRemark">
                  <el-link
                    v-if="scope.row.transferRemark"
                    type="primary"
                    :underline="false"
                    @click="CommentPopup(scope.row.transferRemark,'转单备注')"
                    >转单备注</el-link
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="印前状态">
              <template #default="scope">
                <DictTag :value="scope.row.status" :options="prepress_status"/>
              </template>
            </el-table-column>
            <el-table-column label="是否转单">
              <template #default="scope">
                <div>{{scope.row.isTransfer?'是':'否'}}</div>
              </template>
            </el-table-column>
            
            <!-- <el-table-column label="客户源文件上传时间" width="160">
              <template #default="scope">
                <div v-for="(item,index) in scope.row.customerFileList" :key="index">
                  <span>{{parseDate(item.uploadTime,true)}}</span>
                </div>
                <div v-if="!scope.row.customerFileList.length">-</div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="印前领取时间" width="160">
              <template #default="scope">
                <span>{{parseDate(scope.row.startTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="印前完成时间" width="160">
              <template #default="scope">
                <span>{{parseDate(scope.row.finishTime)}}</span>
              </template>
            </el-table-column> -->
            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <p><el-link :underline="false" type="primary" @click="toDetail(scope.row.activityId)">处理历史</el-link></p>
                <p><el-link :underline="false" :disabled="scope.row.status==3" type="primary" @click="rejectDialog(scope.row)">撤回印前</el-link></p>
                <el-dropdown v-if="false" trigger="click" @command="(e)=>{downFile(scope.row,e)}">
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
                      <el-dropdown-item command="originalFileUrl">下载正稿文件</el-dropdown-item>
                      <el-dropdown-item command="structuralFileUrl">下载结构文件</el-dropdown-item>
                      <el-dropdown-item command="PDF文件">下载印前PDF文件</el-dropdown-item>
                      <!-- <el-dropdown-item command="3D视频文件">下载印前3D视频文件</el-dropdown-item>
                      <el-dropdown-item command="report文件">下载印前report文件</el-dropdown-item> -->
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
    <el-dialog v-model="isRevokeShow" title="确定撤回印前?" width="800px" destroy-on-close>
      <div style="margin-bottom:10px;">是否立即发起撤单申请</div>
      <div>
          <el-form :model="dialogForm" label-width="70px" ref="dialogFormRef" >
            <el-form-item label="撤回原因" prop="remark">
              <Editor v-model:html="dialogForm.remark"></Editor>
              <!-- <el-input v-model.trim="dialogForm.remark" placeholder="请填写撤回原因" maxlength="500" show-word-limit :rows="4"
                type="textarea" clearable style="width:400px;" /> -->
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="isRevokeShow = false">取消</el-button>
            <el-button type="primary" @click="reject">确定</el-button>
          </span>
        </template>
    </el-dialog>
    
  </div>
</template>

<script setup>
import { getFinishedList, withdrawWithUnaccalimed,getDeptUser, exportExcel,getPrepressDetailById } from '@/api/prepress';
import { formatDates,downPrepressFile,parseDate,senseUrl,CommentPopup } from '@/utils';
import { ElMessage, ElMessageBox,ElLoading } from 'element-plus';
import { useRouter } from 'vue-router';
import {BASE_FILE_URL} from "@/store/global-constant"
import useUserStore from '@/store/modules/user'
import { saveAs } from 'file-saver';
import { blobValidate } from '@/utils/ruoyi'
import OrderAttrShow from "@/components/OrderAttrShow"
import Editor from "@/components/Editor"
import { nextTick, watch } from 'vue';
import poView from "./components/poView.vue"
const { proxy } = getCurrentInstance();
const { prepress_status,prepress_department,ac_original_order_type,ac_proof_type } = proxy.useDict("prepress_status","prepress_department","ac_original_order_type","ac_proof_type");
const tableData = ref([])
const total = ref(0)
const router = useRouter()
const data = reactive({
  details: {},
  formData: {
    proofNo:null,//打样编号
    pageNum: 1,
    pageSize: 20,
    poNo: null,//PO号
    orderType: null,//大货订单类型
    salesman: '',//业务员
    startTime: null,//开始时间
    endTime: null,//结束时间
    status: null,//印前状态
    type: 1//印前类型：0大货印前,1打样印前
  },
  dialogForm: {
    remark:''
  }
})
let detailData = ref([])
let historyDialog = ref(false)
const { details, formData, dialogForm} = toRefs(data)
var datePicker = ref([(new Date().getTime() - 3600 * 1000 * 24 * 90),(new Date().getTime()+3600 * 1000 * 24 * 1)])//日期选择器绑定的值
var deptUserList = ref([])//印前领取人列表
const deptId = ref('')
const isRevokeShow = ref(false)
watch(prepress_department,(val)=>{
  deptId.value = val.find(item=>{return item.label=="prepress_proof"}).value
  getDeptUserList()
})
if (prepress_department.value.length>0) {
  deptId.value = prepress_department.value.find(item=>{return item.label=="prepress_proof"}).value
  getDeptUserList()
}
const multipleTable = ref(null)
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
const userInfo = computed(() => useUserStore().userInfo)
//获取印前已完成列表
function getList() {
  getFinishedList(formData.value).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows.map(item=>{
        if (item.customerFile) {
          item.customerFileList = JSON.parse(item.customerFile)
        }else{
          item.customerFileList = []
        }
        return item
      })
      total.value = res.data.total
    }
  })
}
// getList()
search();
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
//弹窗展示商品属性
function showAttr(text) {
  ElMessageBox.alert(text, '属性详情', {
    confirmButtonText: '关闭',
    callback: () => { }
  })
}
function rejectDialog(data) {
  dialogForm.value = data
  isRevokeShow.value = true
}
//撤单
function reject(data) {
      withdrawWithUnaccalimed({
        "activityId": dialogForm.value.activityId,
        "applyDept": '打样印前制作部',//deptId.value
        "applyDesc": "",
        "applyUser": userInfo.value.userName,
        "remark": dialogForm.value.remark,
        poNo:dialogForm.value.poNo
      }).then(res=>{
        if (res.code==200) {
          ElMessage({
            type: 'success',
            message: '撤回成功',
          })
           isRevokeShow.value = false
        }
         
      }).catch(() => {
        isRevokeShow.value = false
       })
    
}
/** 重置按钮操作 */
function resetFormParams() {
  proxy.resetForm("formRef");
  datePicker.value = [(new Date().getTime() - 3600 * 1000 * 24 * 90),(new Date().getTime()+3600 * 1000 * 24 * 1)]
  search();
}
//搜索
function search() {
  formData.value.pageNum = 1//页码
  formData.value.pageSize = 20//分页大小
  if (datePicker.value?.length>0) {
    formData.value.startTime = formatDates(datePicker.value[0])+' 00:00:00'
    formData.value.endTime = formatDates(datePicker.value[1])+' 23:59:59'
  }else{
    formData.value.startTime = formData.value.endTime = null
  }
  getList()
}
//获取印前领取人列表
function getDeptUserList(){
  getDeptUser(deptId.value).then(res=>{
    if (res.code==200) {
      deptUserList.value = res.data
    }
  })
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
//导出Excel
function downExcel(){
  if (datePicker.value?.length>0) {
    formData.value.startTime = formatDates(datePicker.value[0])+' 00:00:00'
    formData.value.endTime = formatDates(datePicker.value[1])+' 23:59:59'
  }else{
    formData.value.startTime = formData.value.endTime = null
  }
  var downloadLoadingInstance = ElLoading.service({ text: "文件下载中，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  exportExcel(formData.value).then( async res=>{
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
      saveAs(blob, fileName)
    } else {
      const resText = await res.data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}
</script>

<style lang="scss" scoped>
.artwork-workbench {
  .state {
    width: 140px;
    display: flex;
    justify-content: space-between;
  }

  .btnMt {
    margin-top: 10px;
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
.tool-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.listText{
  font-weight: 600;
}

</style>
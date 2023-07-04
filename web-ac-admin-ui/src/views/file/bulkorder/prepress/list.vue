<template>
  <div class="artwork-workbench">
    <listLayout>
      <template #header>
        <div class="top-bar">
          <el-form :inline="true" :model="formData" label-width="120px" ref="formRef" class="demo-form-inline">
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
            <el-form-item label="印前完成时间">
              <template #label>
                <span style="font-weight: 700;">印前完成时间</span>
              </template>
              <el-date-picker
                v-model="datePicker"
                type="daterange"
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:252px;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="印前状态" prop="status">
              <el-select v-model="formData.status" placeholder="所有状态" clearable style="width:252px;">
                <el-option 
                v-for="item in prepress_status" 
                v-show="item.label!='未领取'" 
                :key="item.id" 
                :label="item.label" 
                :value="item.value" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="印前领取人" prop="producer">
              <el-select v-model="formData.producer" placeholder="印前制作人" clearable style="width:252px;">
                <el-option v-for="item in deptUserList" :key="item" :label="item.nickName" :value="item.userName" />
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
        <!-- <div class="tool-bar">
          <div>我的印前文件列表</div>
          <div><el-button @click="downExcel">导出</el-button></div>
        </div> -->
        <div class="titleBox">
          <div class="listText">
            我的印前文件列表
          </div>
          <div><el-button @click="downExcel">导出</el-button></div>
        </div>
      </template>
      <template #table-content='tableHeight'>
        <el-table :data="tableData" :height='tableHeight.tableHeight'  row-key="activityId" ref="multipleTable">
          <el-table-column label="PO号" width="200">
            <template #default="scope">
              <!-- <el-link :underline="false" v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">
                {{scope.row.poNo}}
                <el-icon>
                  <CopyDocument />
                </el-icon>
              </el-link> -->
              <poView :po-no="scope.row.poNo" type="2"></poView>
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
          <el-table-column width="300px" label="工单参数">
            <template #default="scope">
              <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.activityId"></OrderAttrShow>
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
            </template>
          </el-table-column>
          <el-table-column label="文件下载" width="410">
            <template #default="scope">
              <!-- <div>{{scope.row.customerFile}}</div> -->
              <div v-for="(item,index) in scope.row.customerFileList" :key="index">
                <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress,item.fileName)">{{item.fileName}}</el-link> -->
                <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>

              </div>
              <!-- <div v-if="!scope.row.customerFileList">-</div> -->
              <div v-if="scope.row.productName.indexOf('精装盒')===-1">
                <el-tag effect="dark" style="cursor: pointer;" @click="threeDownFile(scope.row)">一键三连下载
                </el-tag>
              </div>
              <el-button v-if="scope.row.productName.indexOf('精装盒')>-1" @click="fliedlo(scope.row)">文件下载</el-button>

            </template>
          </el-table-column>
          <!-- <el-table-column label="印前文件状态" width="120">
            <template #default="scope">
              <div>{{scope.row.fileStatus==0?'未上传':scope.row.fileStatus==1?'部分上传':'已上传'}}</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="印前耗时">
            <template #default="scope">
              <div>{{scope.row.timeConsum||'-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="业务员">
            <template #default="scope">
              <div>{{scope.row.salesman||'-'}}</div>
            </template>
          </el-table-column> -->
          <el-table-column label="状态/耗时(小时)">
            <template #default="scope">
              <!-- <div>
                <DictTag :value="scope.row.status" :options="prepress_status"/>
                {{scope.row.timeConsum||'-'}}

              </div> -->
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
              <!-- <div>{{scope.row.transferRemark||'-'}}</div> -->
              <div v-if="scope.row.orderRemark">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="CommentPopup(scope.row.orderRemark,'订单备注')"
                  >订单备注</el-link>
              </div>
              <div v-if="scope.row.structuralRemark">
                <el-link
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
          </el-table-column>
          <el-table-column label="转单备注" :show-overflow-tooltip="true">
            <template #default="scope">
              <div>{{scope.row.transferRemark||'-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="客户源文件上传时间" width="160">
            <template #default="scope">
              <div v-for="(item,index) in scope.row.customerFileList" :key="index">
                <span>{{parseDate(item.uploadTime,true)}}</span>
              </div>
              <div v-if="!scope.row.customerFileList">-</div>
            </template>
          </el-table-column>
          <el-table-column label="印前领取时间" width="160">
            <template #default="scope">
              <div>{{scope.row.startTime||'-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="印前完成时间" width="160">
            <template #default="scope">
              <div>{{scope.row.finishTime||'-'}}</div>
            </template>
          </el-table-column> -->
          <el-table-column width="200" fixed="right" label="操作">
            <template #default="scope">
              <div><el-link :underline="false" type="primary" @click="toDetail(scope.row.activityId)">处理历史</el-link></div>
              <div><el-link :underline="false" v-if="scope.row.status==4" :disabled="scope.row.status==3" type="primary" @click="rejectDialog(scope.row)">撤回印前</el-link></div>
              <!-- <el-dropdown trigger="click" @command="(e)=>{downFile(scope.row,e)}">
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
                    <el-dropdown-item command="3D视频文件">下载印前3D视频文件</el-dropdown-item>
                    <el-dropdown-item command="report文件">下载印前report文件</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown> -->
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
    <el-dialog v-model="isRevokeShow" title="撤回" width="800px">
      <!-- <div style="margin-bottom:10px;">是否立即发起撤单申请</div> -->
      <div>
          <el-form :model="dialogForm" :rules="rules" label-width="90px" ref="dialogFormRef" >
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
    
    <el-dialog v-model="RemarkShow" title="结构备注" :close-on-click-modal="false" destroy-on-close align-center
        width="800px" class="historyPopupBox">
        <Editor v-model:html="remarkTxt" :edit="false"></Editor>
    </el-dialog>

    <HistoryDialog v-if="historyDialog" hideremark :historyListData="historyListData" v-model:historyShow="historyDialog" />

    <FileDialog v-if="preileDialog" v-model:preileDialog="preileDialog" dld :DialogData="dialogData2" :queryData="queryData"/>
  </div>
</template>

<script setup>
import { getFinishedList, withdrawWithUnaccalimed,exportExcel,getPrepressDetailById,getPrepressFile } from '@/api/prepress';
import { getDeptUser } from "@/api/system/user";
import { formatDates,downPrepressFile,parseDate,senseUrl,getHour,CommentPopup,getText } from '@/utils';
import { ElMessage, ElMessageBox,ElLoading } from 'element-plus';
import { useRouter } from 'vue-router';
import useUserStore from '@/store/modules/user';
import {BASE_FILE_URL} from "@/store/global-constant";
import { saveAs } from 'file-saver';
import { blobValidate } from '@/utils/ruoyi'
import OrderAttrShow from "@/components/OrderAttrShow"
import { nextTick, watch } from 'vue';
import Editor from "@/components/Editor"
import poView from "../../../proof/components/poView.vue"
import FileDialog from "./uploadFile3.vue"
import { zipDownload } from '@/api/download'
const { proxy } = getCurrentInstance();
const { prepress_status,prepress_department,ac_original_order_type } = proxy.useDict("prepress_status","prepress_department","ac_original_order_type");
const tableData = ref([])
const total = ref(0)
const router = useRouter()
const data = reactive({
  details: {},
  formData: {
    pageNum: 1,
    pageSize: 20,
    poNo: null,//PO号
    orderType: '1',//大货订单类型
    salesman: '',//业务员
    startTime: null,//开始时间
    endTime: null,//结束时间
    status: null,//印前状态
    type: 0//印前类型：0大货印前
  },
  dialogForm: {
    remark:''
  }
})

const preileDialog = ref(false)
const dialogData2 = ref(null)
const queryData = ref(null)

let RemarkShow = ref(false);
let remarkTxt = ref("");
const deptId = ref('')
const isRevokeShow = ref(false)
const activityId = ref('')
let historyListData = ref([]);
let historyDialog = ref(false);
const validateFirstEditor = (rule, value, callback) => {
  if (value == ""||!getText(value)) {
    callback(new Error("撤回原因"));
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
  ]
});
watch(prepress_department,(val)=>{
  deptId.value = val.find(item=>{return item.label=="prepress_bulk"}).value
  getDeptUserList()
})
if (prepress_department.value.length>0) {
  deptId.value = prepress_department.value.find(item=>{return item.label=="prepress_bulk"}).value
  getDeptUserList()
}
const multipleTable = ref(null)
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
  })
})
const userInfo = computed(() => useUserStore().userInfo)
const { details, formData, dialogForm } = toRefs(data)
var datePicker = ref([(new Date().getTime() - 3600 * 1000 * 24 * 90),(new Date().getTime()+3600 * 1000 * 24 * 1)])//日期选择器绑定的值
var deptUserList = ref([(new Date().getTime() - 3600 * 1000 * 24 * 90),(new Date().getTime()+3600 * 1000 * 24 * 1)])//印前领取人列表
//获取印前已完成列表
function getList() {
  proxy.$modal.loading('数据加载中，请稍候...')
  getFinishedList(formData.value).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.rows.map(item=>{
        item.customerFileList = JSON.parse(item.customerFile)
        return item
      })
      total.value = res.data.total
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
  })
}
// getList()
search()
//下载文件
function downFile(data,type) {
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
//下载文件
function urlDownFile(url,name){
  downPrepressFile([url],name)
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
const remarkclick = (data) => {
  RemarkShow.value=true
  remarkTxt.value=data
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
//弹窗展示商品属性
function showAttr(text) {
  ElMessageBox.alert(text, '属性详情', {
    confirmButtonText: '关闭',
    callback: () => { }
  })
}
function rejectDialog(data) {
  // activityId.value = data.activityId
  dialogForm.value = data
  isRevokeShow.value = true
}
//驳回
const dialogFormRef = ref(null);
async function reject(data) {
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      proxy.$modal.loading('正在撤回印前，请稍候...')
      withdrawWithUnaccalimed({
        "activityId": dialogForm.value.activityId,
        "applyDept": '印前制作部',//deptId.value
        "applyDesc": "",
        "applyUser": userInfo.value.userName,
        "remark": dialogForm.value.remark,
        poNo:dialogForm.value.poNo
      }).then(res=>{
        if (res.code==200) {
          ElMessage({
            type: 'success',
            message: '申请成功',
          })
          getList()
          isRevokeShow.value = false
        }
      }).finally(()=>{
        proxy.$modal.closeLoading()
      })
    } else {
      console.log("提交失败,校验不通过", fields);
    }
  });
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
  if(!deptId.value) return;
  getDeptUser({deptId:deptId.value}).then(res=>{
    if (res.code==200) {
      deptUserList.value = res.data
    }
  })
}
getDeptUserList()
function handleSizeChange(val) {
  getList()
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
          fileName  = '印前文件列表.xlsx'
        }
      } catch (error) {
        fileName  = '印前文件列表.xlsx'
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
//复制成功提示
function copyTextSuccess() {
  ElMessage({
    type: 'success',
    message: '复制成功',
  })
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

  .btnMt {
    margin-top: 10px;
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
.tool-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  padding:4px 16px;
}
.titleBox {
  display: flex;
  justify-content: space-between;
}
.listText{
  font-weight: 600;
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
<template>
  <div>
    <listLayout>
      <template #header>
        <div>
          <el-form :inline="true" :model="formData" label-width="120px" ref="formRef">
            <el-form-item label="品类:" prop="orderType">
              <el-select v-model="formData.orderType" placeholder="全部品类" clearable style="width:252px;">
                <!-- <el-option label="大货" :value="1" />
                <el-option label="精装盒" :value="2" /> -->
                <el-option
                  v-for="item in ac_original_order_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="PO号:" prop="poNo" >
              <el-input v-model.trim="formData.poNo" type="text" placeholder="请输入PO号" clearable style="width:252px;" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="正稿任务领取人:" prop="originalUser">
              <el-input v-model.trim="formData.originalUser" type="text" placeholder="请输入正稿任务领取人名称" clearable style="width:252px;"></el-input>
            </el-form-item> -->
            
            <el-form-item label="推送审核时间:">
              <template #label>
                <span style="font-weight: 700;">推送审核时间</span>
              </template>
              <el-date-picker
                v-model="pushTime"
                type="daterange"
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @calendar-change="timechange"
                :disabled-date="disabledDate"
                :clearable="false"
                style="width:252px;"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <div class="form-tool-bar">
            <div style="min-width:160px;width:160px;">
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </div>
          </div>
        </div>
      </template>
      <template #table-header>
        <div class="top-bar">
          <div class="listText">
                工艺审核工作台
            <el-badge :value="msgCount||0" :max="99" class="msgbtn" @click="showDialog">
              <el-button type="warning">撤单消息</el-button>
            </el-badge>
          </div>
          <!-- <div style="display: flex;">
            <div style="margin-right:5px;line-height: 32px;">
              处理中：<span class="red">{{ processing }}</span>
              待处理：<span class="red">{{ toBeProcessed }}</span>
            </div> -->
            <!-- <el-button type="primary" @click="Task">领取任务</el-button> -->
          <!-- </div> -->
          <div class="disposeBox">
            <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>
          </div>
        </div>
      </template>
      <template #table-content='tableHeight'>
        <el-table :data="tableData" :height='tableHeight.tableHeight' row-key="id" ref="multipleTable">
          <el-table-column label="PO号">
            <template #default="scope">
              <!-- <el-link :underline="false" v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">
                {{scope.row.poNo}}
                <el-icon>
                  <CopyDocument />
                </el-icon>
              </el-link> -->
              <poView :po-no="scope.row.poNo"></poView>
              <div>
                <followInfoFlag  :row="scope.row" name='craftCheckFollow' type="2"></followInfoFlag>
                <!-- <ThreeDayFlag  style="margin-top:5px" :row="scope.row" ></ThreeDayFlag> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工单参数">
            <template #default="scope">
              <!-- <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.activityId"></OrderAttrShow> -->
                    <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.id" type="processAudit"></OrderAttrShow>
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
                    <span class="TimeTitle">推送审核时间：</span>
                    <br/>
                    <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                  </p>
                </div>
              </template>
            </el-table-column>
          <el-table-column label="文件下载">
            <template #default="scope">
              <div :underline="false" v-for="(item,index) in scope.row.customerFiles" :key="index">
                <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress)">{{item.fileName}}</el-link> -->
                <!-- <el-link :underline="false" :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank">{{item.fileName}}</el-link> -->
                <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
              </div>
              <div v-if="!scope.row.customerFiles||scope.row.customerFiles?.length<1">-</div>
            </template>
          </el-table-column>
          <el-table-column label="工单状态">
              <template #default="scope">
                <DictTag :value="scope.row.status" :options="ac_craft_status"/>
                <div v-if="scope.row.status">
                  审核人：{{scope.row.reviewer||'-'}}
                </div>
              </template>
            </el-table-column>
          <!-- <el-table-column label="设计正稿文件">
            <template #default="scope">
              <div :underline="false" v-for="(item,index) in scope.row.checkFiles" :key="index"> -->
                <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress)">{{item.fileName}}</el-link> -->
                <!-- <el-link :underline="false" :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank">{{item.fileName}}</el-link>
              </div>
              <div v-if="!scope.row.checkFiles||scope.row.checkFiles?.length<1">-</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="正稿任务领取人">
            <template #default="scope">
              <div>{{scope.row.originalUser||'-'}}</div>
            </template>
          </el-table-column> -->
            <!-- <el-table-column label="业务员" width="200">
              <template #default="scope">
                <div>{{ scope.row.salesman || "-" }}</div>
              </template>
            </el-table-column>
            <el-table-column label="文件推送人" width="200">
              <template #default="scope">
                <div>
                  {{ scope.row.fileSender || "-" }}
                </div>
              </template>
            </el-table-column> -->
          <!-- <el-table-column label="推送审核时间" width="160">
            <template #default="scope">
              <div>{{scope.row.createTime||'-'}}</div>
            </template>
          </el-table-column> -->
          <el-table-column width="140px" fixed="right" label="操作">
            <template #default="scope">
              <el-link :underline="false" type="primary" :disabled="scope.row.status!=1" @click="openDialog(scope.row,'check')">审核</el-link>
              <div><el-link :underline="false" type="primary" :disabled="scope.row.status!=0" @click="Task(scope.row.id)">领取</el-link></div>
              <div style="color: #409eff; cursor: pointer" @click="historical(scope.row.id)">
                处理历史
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pagination>
        <div class="prooflaypage">
          <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
            @pagination="handleSizeChange" :total="total" v-model:limit="formData.size" :pageSizes="[20, 30, 50, 100]" />
        </div>
      </template>
    </listLayout>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="800" align-center destroy-on-close>
      <div>
        <el-form v-if="dialogType=='reject'" :model="dialogForm" label-width="120px" ref="dialogFormRef" :rules="rules">
          <el-form-item label="驳回原因" prop="remark">
            <el-input v-model.trim="dialogForm.remark" placeholder="请填写驳回原因" maxlength="500" show-word-limit :rows="4"
              type="textarea" clearable style="width:400px;" />
          </el-form-item>
        </el-form>
        <div v-else>
          <el-scrollbar style="margin-right: 20px;height: 680px;">
            <el-form label-width="90px">
              <el-form-item label="订单参数:">
                <span style="line-height: 20px;">{{dialogData.productAttr}}</span>
              </el-form-item>
              <el-form-item label="客户源文件:">
                <div v-for="(item,index) in dialogData.customerFiles" :key="index">
                  <div >
                    <el-link :underline="false">{{item.fileName}}</el-link>
                    <el-link :underline="false" style="margin-left: 20px;" @click="urlDownFile(item.fileAddress)">下载文件<el-icon><Download /></el-icon></el-link>
                  </div>
                  <div v-if="item.url">
                    <el-image
                      style="width: 480px; height: 280px"
                      :src="BASE_FILE_URL+item.url"
                      :preview-src-list="[BASE_FILE_URL+item.url]"
                      fit="contain"
                    />
                  </div>
                </div>
              </el-form-item>
              <el-form-item v-for="(item,index) in craftList" :key="index" style="margin-bottom: 10px;" :label="'部件'+(index+1)+':'">
                <div>
                  <el-link :underline="false" @click="urlDownFile(item.fileAddress)">{{item.fileName}}</el-link>
                </div>
                <div v-if="item.url">
                  <el-image
                    style="width: 480px; height: 280px"
                    :src="BASE_FILE_URL+item.url"
                    :preview-src-list="[BASE_FILE_URL+item.url]"
                    fit="contain"
                  />
                </div>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
      <template #footer>
        <span v-if="dialogType=='reject'" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="reject">确定</el-button>
        </span>
        <span v-if="dialogType!='reject'" class="dialog-footer">
          <el-button @click="openDialog(dialogData,'reject')">驳回</el-button>
          <el-button type="primary" @click="pass">通过审核</el-button>
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
            v-model:page="revokeParams.current"
            @pagination="getCancellationMessage"
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
      <el-dialog v-model="isShowPass" title="确认通过" width="600px" align-center destroy-on-close >
        <el-form>
          <el-form-item label='备注：'>
            <el-input type='textarea' v-model="passRemarkInfo.remark" maxlength='500' show-word-limit ></el-input>
          </el-form-item>
          <el-form-item label='附件：'>
            <el-upload
            class="upload-demo"
            style="display:inline-block;width: 100%;"
            action=""
            accept='.png,.jpg,.jpeg'
            :auto-upload='false'
            :on-change="fileListChange"
            :show-file-list="true"
            v-model:file-list="passFiles"

          > 
            <el-button type="primary">上传附件</el-button>
            <div>

            </div>
            <template #tip>
              <div>仅支持上传jpg、jpeg、png格式，大小不超过50M</div>
            </template>
    
          </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <div>
            <el-button @click="isShowPass = false">取消</el-button>
            <el-button @click="pass2">确定通过</el-button>
          </div>
        </template>
      </el-dialog>
      <HistoryDialog v-if="historyDialog" :historyListData="historyListData" v-model:historyShow="historyDialog" />

  </div>
</template>

<script setup>
import { getCraftcheckList,craftCheck,rejectCraft,passCraft,passCraftV2,getCancelMsg,submitMsgOps,craftCheckMsgCount,getCraftTask,getTaskCount,getLogs } from '@/api/craftCheck';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDates,senseUrl } from '@/utils';
import { BASE_FILE_URL } from '@/store/global-constant';
import { useRouter } from 'vue-router';
import cancelOrder from "@/components/cancelOrder";
import OrderAttrShow from "@/components/OrderAttrShow/order.vue"
import {downPrepressFile} from "@/utils/index"
import {download} from  '@/utils/request'
import { nextTick, watch } from 'vue';
import { uploadefile } from '@/api/upload';
import ThreeDayFlag from "@/components/fileTag/threeDayFlag.vue";
import poView from "../../../proof/components/poView.vue"
import Counter from "@/components/proof/Counter.vue"
const { proxy } = getCurrentInstance();
const { ac_original_order_type,ac_craft_status } = proxy.useDict("ac_original_order_type","ac_craft_status");
const data = reactive({
  formData: {
    current:1,
    position:1,
    size:20,
    poNo:'',//po号
    // originalUser:'',//正稿任务领取人
    status:'',//0未领取，1审核中，2审核通过，3审核不通过，审核工作台查询时，此字段默认带status=1审核中过来
    orderType:'1',//0大货 1精装盒
    startPushTime:null,//推送开始时间
    endPushTime:null,//推送结束时间
  },
  dialogData:{},
  dialogForm:{
    remark:''
  },
  revokeParams:{
    current:1,
    size:20,
  }
});
const { formData, dialogData,dialogForm,revokeParams} = toRefs(data);
// const pushTime = ref([(new Date().getTime() - 3600 * 1000 * 24 * 90),(new Date().getTime()+3600 * 1000 * 24 * 1)]);//推送审核时间
const pushTime = ref([]);//推送审核时间
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('驳回')
const dialogType = ref('')
const craftList = ref([])
const total = ref(0)
const msgCount = ref(0)
const router = useRouter();
const rules = reactive({
  remark: [{ required: true, message: '请填写驳回原因', trigger: 'blur' }],
})
const isRevokeShow = ref(false)
const revokeData = ref([])//撤单列表
const revokeTotal = ref(0)
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理
let historyDialog = ref(false);
// 历史列表数据
let historyListData = ref([]);
let minDate = ref('')
let maxDate = ref('')

const multipleTable = ref(null)
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
onBeforeMount (() => {
	// pushTime.value = [(new Date().getTime() - 3600 * 1000 * 24 * 7),(new Date().getTime()+3600 * 1000)]
	pushTime.value = []
  search();
  getTaskCountfn()
})
//审核
function check(id) {
  craftCheck({id:id}).then(res=>{
    if (res.code==200) {
      try {
        craftList.value = res.data.map(item=>{
          let type = item.fileAddress.slice(item.fileAddress.lastIndexOf(".") + 1).toLowerCase()
          if (type=='png'||type=='jpg') {
            item.url = item.fileAddress
          }else{
            item.url = false
          }
          return item
        })
      } catch (error) {
        craftList.value = []
      }
    }
  })
}
watch(isRevokeShow,(val)=>{
  if (!val) {
    revokeParams.value.current = 1;
    revokeParams.value.size = 10;
    getCount()
    getList()
  }
})

//获取撤单消息数量
function getCount(){
  craftCheckMsgCount().then(res=>{
    if (res.code==200) {
      msgCount.value = res.data
    }
  })
}
getCount()
//弹窗显示商品属性
function showAttr(text) {
  ElMessageBox.alert(text, '属性详情', {
    confirmButtonText: '关闭',
    callback: () => { }
  })
}
//获取撤单消息
function getCancellationMessage(){
  proxy.$modal.loading('加载中，请稍候...')
  getCancelMsg(revokeParams.value).then(res=>{
    if (res.code==200) {
      revokeData.value = res.data.records
      revokeTotal.value = res.data.total
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
  })
}
//提交撤单结果
function getRevoke({ data, type }){
  proxy.$modal.loading('加载中，请稍候...')
  submitMsgOps({msgId:data.id,result:type,taskId:data.taskId}).then(res=>{
    if (res.code==200) {
      ElMessage({
        type:'success',
        message:'提交成功'
      })
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
    getCancellationMessage()
  })
}
//显示撤单消息dialog
function showDialog(){
  getCancellationMessage()
  isRevokeShow.value = true
}
//撤单消息红点
function dotNum(data) {
  let num = data.filter(item=>!item.status).length||''
  return num
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("formRef");
  pushTime.value = []
  search();
}
//复制成功提示
function copyTextSuccess() {
  ElMessage({
    type: 'success',
    message: '复制成功',
  })
}
function handleSizeChange(val) {
  getList()
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
function timechange(val){
  minDate.value = val[0];
  maxDate.value = val[1];
}
const disabledDate = (time) => {
  if (minDate.value && !maxDate.value) {
    const range = 31 * 24 * 3600 * 1000; // 要更改禁用的日期范围只要修改这里的代码就可以
    const minTime = minDate.value.getTime();
    const newTime = time.getTime();
    return newTime > minTime + range || newTime < minTime - range;
  }
  return false;
}
//查询列表
function getList() {
  getCraftcheckList(formData.value).then(res=>{
    if (res.code==200) {
      tableData.value = res.data.records
      total.value = res.data.total
    }
  })
}
// getList();
//搜索
function search() {
  if (pushTime.value?.length>0) {
    formData.value.startPushTime = formatDates(pushTime.value[0])+' 00:00:00'
    formData.value.endPushTime = formatDates(pushTime.value[1])+' 23:59:59'
  }else{
    formData.value.startPushTime = formData.value.endPushTime = null
  }
  getList()
  getTaskCountfn()
}

//打开弹窗
function openDialog(data,type){
  if (type == 'reject') {
    dialogTitle.value = '驳回'
  }else{
    dialogTitle.value = '工艺审核'
    check(data.id)
  }
  dialogType.value = type
  dialogData.value = data
  dialogData.value.customerFiles = data.customerFiles.map(item=>{
    let type = item.fileAddress.slice(item.fileAddress.lastIndexOf(".") + 1).toLowerCase()
    if (type=='png'||type=='jpg') {
      item.url = item.fileAddress
    }else{
      item.url = false
    }
    return item
  })
  dialogVisible.value = true
}
// 处理数据
function getTaskCountfn(){
  getTaskCount({position:1,...formData.value}).then(res=>{
    if (res.code==200) {
      processing.value = res?.data?.processingCount
      toBeProcessed.value = res?.data?.waitingCount
    }
  })
}
//驳回
function reject(){
  if (!dialogForm.value.remark) {
    ElMessage({
      type: 'error',
      message: '请填写驳回原因',
    })
    return
  }
  rejectCraft({
    id:dialogData.value.id,
    remark:dialogForm.value.remark
  }).then(res=>{
    if (res.code==200) {
      ElMessage({
        type: 'success',
        message: '已驳回',
      })
      // router.go(0)
    }
  }).finally(()=>{
    dialogVisible.value = false
    getList()
  })
}
//通过
let isShowPass = ref(false);
let passRemarkInfo = ref({
	"files": [],
	"id": 0,
	"remark": "",
})
let passFiles = ref([])
watch(isShowPass,(value)=>{
  console.log('isShowPass',value)
  if(!value){
    passRemarkInfo.value = {
      "files": [],
      "id": 0,
      "remark": "",
    }
    passFiles.value = []
  }
})
const fileListChange = function(e,list){
  console.log(e)
  let isError = false
  let fileType = ['image/png','image/jpeg']
  let maxSize = 1024*1024*50;
  if(!fileType.find(s => s==e.raw.type)){
    isError = true
    ElMessage({
        type: 'error',
        message: '请上传JPG，PNG格式的图片',
      })
  }else  if(e.raw.size>maxSize){
    isError = true
    ElMessage({
        type: 'error',
        message: '请上传文件最大不能超过50MB',
      })
    }
  
  
      nextTick(()=>{
        if(list.length>1){
          let len = 1
          if(isError) len = 2;
          passFiles.value = passFiles.value.splice(len)
        }else if(isError){
          passFiles.value = passFiles.value.splice(1)
        }
      })
 
}
async function pass2(){
  proxy.$modal.loading('正在保存数据，请稍候...')
  if(passFiles.value.length>0){
    try {
      let formData = new FormData()
      formData.append('file',passFiles.value[0].raw)
      let res = await uploadefile(formData)
      passRemarkInfo.value.files = [res.data]
    } catch (error) {
      ElMessage({
          type: 'error',
          message: '文件上传失败，请重试~',
        })
        return
    }
  }
  passCraftV2(passRemarkInfo.value).then(res=>{
    if (res.code==200) {
      ElMessage({
        type: 'success',
        message: '审核通过',
      })
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
    isShowPass.value = false
    getList()
  })
}
function pass(){
  passRemarkInfo.value.id = dialogData.value.id
  dialogVisible.value = false
  nextTick(()=>{
    isShowPass.value = true
  })
  // 
  // passCraft(dialogData.value.id).then(res=>{
  //   if (res.code==200) {
  //     ElMessage({
  //       type: 'success',
  //       message: '审核通过',
  //     })
  //     // router.go(0)
  //   }
  // }).finally(()=>{
  //   proxy.$modal.closeLoading()
  //   dialogVisible.value = false
  //   getList()
  // })
}
//下载文件
function urlDownFile(url,name){
  // let param = {
  //   "fileName":url
  // }
  //     download(
  //   "/alibaba/oss/downloadFile",
  //   param,
  //   `我的结构文件列表_${formatDates(new Date().getTime())}.xlsx`
  // );
   downPrepressFile([url],name||'客户源文件')
   // window.open(BASE_FILE_URL+url)
}
//领取任务
function Task(id){
  getCraftTask({id}).then(res => {
    if (res.code == 200) {
      if (res.data == '没有可领取的任务了') {
        ElMessage({
          type: 'error',
          message: res.data,
        })
      } else {
         ElMessage({
          type: 'success',
          message:"领取成功" ,
        })
        getList()
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.form-tool-bar {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 20px;
}
.overflow-tooltip{
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
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
.top-bar{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.msgbtn{
  margin-left: 10px;
}
.listText{
  font-weight: 600;
}
.alignRight{
  text-align: right;
}
.red{
  color: #F56C6C;
}
.disposeBox{
  display: flex;
}
</style>
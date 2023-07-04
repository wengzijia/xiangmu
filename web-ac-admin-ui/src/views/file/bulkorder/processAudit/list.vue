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
            <el-form-item label="PO号:" prop="poNo">
              <el-input v-model.trim="formData.poNo" type="text" placeholder="请输入PO号" clearable style="width:252px;" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="正稿任务领取人:" prop="originalUser">
              <el-input v-model.trim="formData.originalUser" type="text" placeholder="请输入正稿任务领取人名称" clearable style="width:252px;"></el-input>
            </el-form-item> -->
            <el-form-item label="审核状态:" prop="status">
              <el-select v-model="formData.status" placeholder="所有状态" clearable style="width:252px;">
                <el-option v-for="item in ac_craft_status" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="推送审核时间:">
              <el-date-picker
                v-model="pushTime"
                type="daterange"
                range-separator="→"
                @calendar-change="timechange"
                :disabled-date="disabledDate"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                style="width:252px;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="工艺审核时间:">
              <el-date-picker
                v-model="checkTime"
                type="daterange"
                range-separator="→"
                @calendar-change="timechange"
                :disabled-date="disabledDate"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
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
        <div class="titleBox">
          <div class="listText">工艺审核列表</div>
          <div class="disposeBox">
            <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>
          </div>
        </div>
      </template>
      <template #table-content='tableHeight'>
        <div>
          <el-table :data="tableData" :height='tableHeight.tableHeight' v-loading="loading" row-key="id" ref="multipleTable">
            <el-table-column label="PO号">
              <template #default="scope">
                <!-- <el-link :underline="false" v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">
                  {{scope.row.poNo}}
                  <el-icon>
                    <CopyDocument />
                  </el-icon>
                </el-link> -->
                <poView :po-no="scope.row.poNo"></poView>
              </template>
            </el-table-column>
            <el-table-column width="" label="工单参数">
              <template #default="scope">
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
            <!-- <el-table-column label="设计正稿文件">
              <template #default="scope">
                <div :underline="false" v-for="(item,index) in scope.row.checkFiles" :key="index"> -->
                  <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress)">{{item.fileName}}</el-link> -->
                  <!-- <el-link :underline="false" :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank">{{item.fileName}}</el-link>
                </div>
                <div v-if="!scope.row.checkFiles||scope.row.checkFiles?.length<1">-</div>
              </template>
            </el-table-column> -->
            <el-table-column label="工单状态">
              <template #default="scope">
                <DictTag :value="scope.row.status" :options="ac_craft_status"/>
                <div v-if="scope.row.status&&scope.row.status!=4">
                  审核人：{{scope.row.reviewer||'-'}}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="正稿任务领取人">
              <template #default="scope">
                <div>{{scope.row.originalUser||'-'}}</div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="推送审核时间">
              <template #default="scope">
                <div>{{scope.row.createTime||'-'}}</div>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="工艺审核时间">
              <template #default="scope">
                <div>{{scope.row.checkTime||'-'}}</div>
              </template>
            </el-table-column> -->
            <el-table-column width="140px" fixed="right" label="操作">
              <template #default="scope">
                <!-- <el-link :underline="false" type="primary" :disabled="scope.row.status!=0" @click="receive(scope.row.id)">领取</el-link> -->
                <div style="color: #409eff; cursor: pointer" @click="historical(scope.row.id)">
                  处理历史
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template #pagination>
        <div class="prooflaypage">
          <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
            @pagination="handleSizeChange" :total="total" v-model:limit="formData.size" :pageSizes="[20, 30, 50, 100]" />
        </div>
      </template>
    </listLayout>
    <HistoryDialog v-if="historyDialog" :historyListData="historyListData" v-model:historyShow="historyDialog" />
  </div>
</template>

<script setup>
import { getCraftcheckList,getCraftTask,getTaskCount,getLogs } from '@/api/craftCheck';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDates,senseUrl } from '@/utils';
import { BASE_FILE_URL } from '@/store/global-constant';
import OrderAttrShow from "@/components/OrderAttrShow/order.vue";
import { nextTick, ref, watch } from 'vue';
import poView from "../../../proof/components/poView.vue"
import Counter from "@/components/proof/Counter.vue"
const data = reactive({
  formData: {
    current:1,
    position:0,
    size:20,
    poNo:'',//po号
    // originalUser:'',//正稿任务领取人
    status:'0',//0未领取，1审核中，2审核通过，3审核不通过，审核工作台查询时，此字段默认带status=1审核中过来
    orderType:'1',//0大货 1精装盒
    startPushTime:null,//推送开始时间
    endPushTime:null,//推送结束时间
    startCheckTime:null,//审核开始时间
    endCheckTime:null,//审核结束时间
  },
});


const { formData, } = toRefs(data);
const pushTime = ref([(new Date().getTime() - 3600 * 1000 * 24 * 7),(new Date().getTime()+3600 * 1000)]);//推送审核时间
const checkTime = ref([]);//工艺审核时间
const total = ref(0)
const tableData = ref([]);
const loading = ref(false);
const { proxy } = getCurrentInstance();
const { ac_craft_status,ac_original_order_type } = proxy.useDict("ac_craft_status","ac_original_order_type");
const multipleTable = ref(null)
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理
let historyDialog = ref(false);
let minDate = ref('')
let maxDate = ref('')
// 历史列表数据
let historyListData = ref([]);
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
onBeforeMount (() => {
	resetQuery()
})
const disabledDate = (time) => {
  // 只能选择当前时间的前一个月的和当天之前的
  // let threeDate = new Date()
  // threeDate.setMonth(threeDate.getMonth() - 1)
  // return (
  //   time.getTime() < threeDate.getTime() ||
  //   time.getTime() > new Date().getTime()
  // )
  if (minDate.value && !maxDate.value) {
    const range = 31 * 24 * 3600 * 1000; // 要更改禁用的日期范围只要修改这里的代码就可以
    const minTime = minDate.value.getTime();
    const newTime = time.getTime();
    return newTime > minTime + range || newTime < minTime - range;
  }
  return false;
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("formRef");
  checkTime.value = []
  pushTime.value = [(new Date().getTime() - 3600 * 1000 * 24 * 7),(new Date().getTime()+3600 * 1000)]
  search();
}
function handleSizeChange(val) {
  getList()
}
function getList() {
  loading.value = true
  getCraftcheckList(formData.value).then(res=>{
    if (res.code==200) {
      tableData.value = res.data.records
      total.value = res.data.total
    }
  }).finally(()=>{
    loading.value = false
  })
}
// getList();
//复制成功提示
function copyTextSuccess() {
  ElMessage({
    type: 'success',
    message: '复制成功',
  })
}
//搜索
function search() {
  formData.value.current = 1//页码
  formData.value.size = 20//分页大小
  if (pushTime.value?.length>0) {
    formData.value.startPushTime = formatDates(pushTime.value[0])+' 00:00:00'
    formData.value.endPushTime = formatDates(pushTime.value[1])+' 23:59:59'
  }else{
    formData.value.startPushTime = formData.value.endPushTime = null
  }
  
  
  getList()
  getCount()
}
function timechange(val){
  minDate.value = val[0];
  maxDate.value = val[1];
}
// 处理数据
function getCount(){
  getTaskCount(formData.value).then(res=>{
    if (res.code==200) {
      processing.value = res?.data?.processingCount
      toBeProcessed.value = res?.data?.waitingCount
    }
  })
}
// getCount()
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
//领取任务
function receive(id){
  getCraftTask({id}).then(res=>{
    if (res.code==200) {
      getList()
      ElMessage({
        type: 'success',
        message: '领取成功',
      })
     resetQuery()
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
//下载文件
function urlDownFile(url){
  window.open(senseUrl(BASE_FILE_URL+url))
}
</script>

<style lang="scss" scoped>
.disposeBox{
  display: flex;
}
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
</style>
<template>
<div>
  <el-card style="margin: 10px" class="artwork-workbench">
    <div class="top-bar">
      <el-form inline :model="termParam" class="condition" label-width="116px">
        <!-- 正稿编号 -->
        <!-- <el-form-item label="正稿编号:" style="width: 300px">
          <el-input v-model="termParam.taskNo" placeholder="请输入正稿编号" />
        </el-form-item> -->
        <!-- PO编号 -->
        <el-form-item label="PO号:">
          <el-input style="width:252px;" clearable v-model.trim="termParam.poNo" placeholder="请输入PO号" />
        </el-form-item>
        <!-- 正稿提交时间 -->
        <el-form-item label="正稿提交时间:" style="font-weight: 700;">
          <el-date-picker style="width:252px;" v-model="donetime" type="daterange" unlink-panels range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态:">
          <el-select
            style="width:252px;"
            clearable
            v-model="termParam.status"
            filterable
            :reserve-keyword="false"
            placeholder="所有状态"
            class="m-2"
          >
            <el-option
              v-for="item in ac_original_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click="outworkStatusChange(item.value)"
            />
          </el-select>
        </el-form-item>
        <!-- 正稿任务领取人: -->
        <el-form-item label="正稿任务领取人:">
          <el-select
            style="width:252px;"
            clearable
            filterable
            placeholder="所有领取人"
            v-model="termParam.producerId"
            class="m-2"
          >
            <el-option
              v-for="item in receiverList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
              @change="receiverChange(item.userId)"
            />
          </el-select>
        </el-form-item>
        <!-- 业务员 -->
        <el-form-item label="业务员:">
          <el-input
            style="width:252px;"
            clearable
            v-model.trim="termParam.salesman"
            placeholder="请输入业务员名称"
          />
        </el-form-item>
        <!-- 客户会员名 -->
        <el-form-item label="客户会员名:">
          <el-input
            style="width:252px;"
            clearable
            v-model.trim="termParam.customerName"
            placeholder="请输入客户会员名"
          />
        </el-form-item>
      </el-form>
      <div class="btnBox">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="screening">筛选</el-button>
      </div>
    </div>
    <!-- 检测列表  -->
    <div class="detectionListBox">
      <el-table :data="tableData" style="width: 100%;height: 580px;" scrollbar-always-on row-key="id">
        <el-table-column label="PO号" width="200">
          <template #default="scope">
            <div>
              <!-- <span class="turn" v-if="scope.row.orderFlag == 1">翻</span> -->
              <span>{{ scope.row.poNo || "-" }}</span>
              <el-icon
                v-copyText="scope.row.poNo"
                v-copyText:callback="copyTextSuccess"
                v-if="scope.row.poNo"
                ><CopyDocument
              /></el-icon>
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
        <el-table-column label="订单参数" width="340">
          <template #default="scope">
        
                  <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.id" type="artwork"></OrderAttrShow>
            <!-- <el-link v-if="scope.row.productAttr" :underline="false" @click="seeAll(scope.row.productAttr)">
              <div class="attrBox">
                <div class="attrText text-overflow">{{scope.row.productAttr}}</div>
              </div>
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
                :content="fileName(item.fileName)"
                >
              <template #reference>
                <div  class="text-overflow gesture" :style="scope.row.customerFiles?.length > 1 ? 'width:180px;' : 'width:190px;'">
                  <a :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank"><span v-if="scope.row.customerFiles?.length > 1">部件{{toChineseNumber(item.sort)}}:</span> {{fileName(item.fileName)}}</a>
                </div>
              </template>
              </el-popover>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="正稿提交时间" width="200">
          <template #default="scope">
            <div>{{ scope.row.uploadTime || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="正稿备注" width="200">
          <template #default="scope">
            <div v-if="scope.row.remark">
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="scope.row.remark"
                v-if="scope.row.remark"
                popper-class="popper_note"
              >
                <template #reference>
                  <div class="remarks text-overflow">
                    {{ scope.row.remark }}
                  </div>
                </template>
              </el-popover>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="正稿任务状态" width="200">
          <template #default="scope">
            <DictTag :value="scope.row.status" :options="ac_original_status"/>
          </template>
        </el-table-column>
        <el-table-column label="客户会员名" width="200">
          <template #default="scope">
            <div>{{ scope.row.customerName || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="业务员" width="200">
          <template #default="scope">
            <div>{{ scope.row.salesman || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="正稿任务领取人" width="200">
          <template #default="scope">
            <div v-if="scope.row.producer">
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="scope.row.producer"
                v-if="scope.row.producer"
              >
                <template #reference>
                  <div class="text-overflow" style="width: 153px">
                    {{ scope.row.producer }}
                  </div>
                </template>
              </el-popover>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <div class="operate">
              <el-link type="primary" :underline="false" @click="detection({id:scope.row.id,status:scope.row.status})">正稿检测</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="laypage">
        <el-pagination
          v-model:currentPage="termParam.current"
          v-model:page-size="termParam.size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>
    </div>
    <!-- <div style="height: 800px">
      <iframe :src="pdfSrc" frameborder="0" style="width:100%; height: 100%"></iframe>
    </div> -->
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
    <!-- 正稿检测弹窗 -->
    <div class="detection">
      <el-dialog v-model="isDetectionShow" title="正稿检测" width="600px">
        <el-scrollbar max-height="600px" style="padding-right: 10px;">
          <div class="content" v-for="item in accessory" :key="item.sort">
            <div class="titleVessel">
              <div class="title">
                <div>部件{{item.sort}}:</div>
                <div class="name text-overflow">{{fileName(item.fileName)}}</div>
              </div>
              <a v-if="item.fileAddress" :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank"><el-icon><Download /></el-icon></a>
            </div>
            <el-image
              v-if="checkFormat(item.fileAddress)"
              style="margin-top:10px;"
              :src="BASE_FILE_URL+item.fileAddress"
              :preview-src-list="[BASE_FILE_URL+item.fileAddress]"
              fit="cover"
            />
          </div>
        </el-scrollbar>
        <div class="btnBox">
          <el-button  v-if="detectionStatus == 8" @click="resultChange(2)">拒绝</el-button>
          <el-button type="primary" v-if="detectionStatus == 8" @click="resultChange(1)">通过检测</el-button>
          <el-button @click="isDetectionShow = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</div>
</template>

<script setup>
// 域名
import {BASE_FILE_URL} from "@/store/global-constant"
import { getDetectionList,getOriginalAnnex,checkResult } from "@/api/outworkManage/outworkDetection";
import { getDeptUser } from "@/api/system/user";
import {formatDates,senseUrl} from "@/utils/index"
import { ElMessage ,ElMessageBox} from 'element-plus'
import OrderAttrShow from "@/components/OrderAttrShow/order.vue"
// 将阿拉伯数字'1'转中文数'一'
import { toChineseNumber  } from '@/utils/index'
const { proxy } = getCurrentInstance();
const { ac_original_status,prepress_department } = proxy.useDict("ac_original_status","prepress_department");
const route = useRoute()
// 接受传过来的参数
let {po} = route.query
console.log('po',po);

// 绑定的时间值(默认三个月)
let donetime = ref([formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),formatDates(new Date().getTime()+3600 * 1000 * 24 * 1)])
// 条件参数
let termParam = reactive({
  // taskNo: "", // 正稿编号
  // orderType: 0, // 大货订单类型值
  poNo: "", // po号(订单编号)
  startTime:formatDates( new Date(donetime.value[0]).getTime()), // 开始时间
  endTime:formatDates( new Date(donetime.value[1]).getTime()), // 结束时间
  status: '8', // 正稿文件状态值
  producerId: "", // 领取人id
  salesman: "", // 业务员
  customerName:"", // 客户会员名称
  current: 1, // 页数
  size: 20, // 每页条数
});
// 总条数
let total = ref(0);
// 正稿文件状态
let outworkStatus = ref([
  // { label: "所有状态", value: 0 },
  // { label: "未领取", value: 1 },
  // { label: "已领取", value: 2 },
  // { label: "已驳回", value: 3 },
  // { label: "被驳回", value: 4 },
  // { label: "已撤回", value: 6 },
  // { label: "客户撤单", value: 7 },
  // { label: "待检测", value: 8 },
  // { label: "检测失败", value: 9 },
  // { label: "已完成", value: 5 }
]);
// 领取人
let receiverList = ref([]);

// 表格数据
let tableData = ref([]);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
// 检测状态
let detectionStatus = ref('')
// 正稿工单id
let taskId = ref('')
// 提交检测参数
let submitParam = reactive({
  originalId:'', // 正稿工单id
  remark:'', // 审核备注信息：同意直接填充同意，拒绝提交审核拒绝备注信息
  result:'' // 1同意 2拒绝
})
// 是否显示正稿检测弹窗
let isDetectionShow = ref(false)
// 待审核正稿附件
let accessory = ref([])
const deptId = ref('')
watch(prepress_department,(val)=>{
  deptId.value = val.find(item=>{return item.label=="original"}).value
  receive()
})
if (prepress_department.value.length>0) {
  deptId.value = prepress_department.value.find(item=>{return item.label=="original"}).value
  receive()
}
// 获取领取人
async function receive(){
  if (!deptId.value) {
    return
  }
  let {code,data} = await  getDeptUser({deptId:deptId.value})
  if(code === 200){
    receiverList.value = data
  }
}

// receive()

// 获取路径的名字
function fileName(url) {
  if (url.lastIndexOf("/") > -1) {
    return url.slice(url.lastIndexOf("/") + 1);
  }
  return url
}

// 获取检测列表数据
async function detectionListData() {
  try{
    let { code, data } = await getDetectionList(termParam);
    if (code == 200) {
      tableData.value = data.records;
      total.value = data.total;
    }
  }catch(err){
    console.log(err.message);
  }
}

if(po){
  termParam.poNo = po
  detectionListData();
}else{
  detectionListData();
}


// 正稿文件状态改变
const outworkStatusChange = (value) => {};

// 正稿领取人改变
const receiverChangeChange = (id) => {};

// 设置时间
function setTime(){
  termParam.startTime = donetime.value&&donetime.value[0] ? formatDates( new Date(donetime.value[0]).getTime()) : '';  // 开始时间
  termParam.endTime = donetime.value&&donetime.value[1] ? formatDates( new Date(donetime.value[1]).getTime()) : '';  // 结束时间
}

// 重置
const reset = () => {
  // termParam.taskNo = ""; // 正稿编号
  // termParam.orderType = 0; // 大货订单类型值
  termParam.poNo = ""; // po号(订单编号)
  donetime.value = [formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),formatDates(new Date().getTime()+3600 * 1000 * 24 * 1)]; // 绑定的时间值(默认三个月)
  setTime()
  termParam.status = '8'; // 正稿文件状态值
  termParam.producerId = ""; // 领取人id
  termParam.salesman = ""; // 业务员
  termParam.customerName = ""; // 客户会员名称
  screening()
};
// 搜索
const screening = () => {
  termParam.current = 1 
  setTime()
  detectionListData();
};

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

// 格式校验
function checkFormat(data){
  let reg = /.(png|jpeg|jpg)$/i
  if(reg.test(data)){
    return true
  }
  return false
}

// 正稿检测
const detection = async function(datum){
    let {id,status} = datum
    taskId.value = id
    detectionStatus.value = status
    let {code,data} = await getOriginalAnnex({taskId:id})
    if(code === 200){
      accessory.value = data
    }
    isDetectionShow.value = true
    console.log('sd',accessory.value);
}

// 每页条数改变
function sizeChange(value) {
  console.log("每页条数改变", value);
  termParam.size = value;
  detectionListData();
}

// 页数改变
function currentChange(value) {
  console.log("页数改变", value);
  termParam.current = value;
  detectionListData();
}

// 打开文件
function openFile(url){
  console.log('url',url);
  window.open(senseUrl(BASE_FILE_URL + url), "_blank");
}

// 审核结果改变
async function resultChange(status){
  try{
    //通过检测 
    if(status==1){
      submitParam.originalId = taskId.value
      submitParam.remark = ""
      submitParam.result = 1
    }
    // 拒绝
    if(status == 2){
      submitParam.originalId = taskId.value
      submitParam.remark = ""
      submitParam.result = 2
    }
    proxy.$modal.loading('正在检测中，请稍候...')
    checkResult(submitParam).then(res=>{
      if(res.code === 200){
        ElMessage.success(res.msg)
        isDetectionShow.value = false
        detectionListData();
      }
    }).finally(()=>{
      proxy.$modal.closeLoading()
    })
  }catch(err){
    isDetectionShow.value = false
    detectionListData();
    console.log(err.message);
  }
}

</script>

<style lang="scss" scoped>
.artwork-workbench {
  .top-bar {
    // .condition{
    //   display: flex;
    // }
    .btnBox {
      text-align: right;
      padding-right: 38px;
    }
  }
  .titleBox {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  // 检测列表
  .detectionListBox {
    margin-top: 20px;
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
      .downBoX {
        text-align: center;
        .downBtn {
          margin-left: 0;
          margin-top: 10px;
        }
      }
    }
    // 属性
    .attrBox {
        display: flex;
        .attrText{
            max-width: 282px;
        }
        .cat{
            color: #2494ff;
        }
    }
    // 备注
    .remarks{
        width: 150px;
    }
  }
  // 分页
  .laypage {
    display: flex;
    justify-content: right;
    margin-top: 20px;
  }
  // 正稿检测弹窗
  .detection{
    .content{
      margin-top: 20px;
      .titleVessel{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        .title{
          display: flex;
          align-items: center;
          .name{
            max-width: 400px;
            margin-left: 20px;
          }
        }
      }
    }
    .btnBox{
      display: flex;
      justify-content: right;
      margin-top: 20px;
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
.popper_note {
  max-width:400px !important;
  width:400px !important;
  word-break: break-all;
}
</style>
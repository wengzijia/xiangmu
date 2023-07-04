<template>
<div>
  <el-card style="margin: 10px" class="artwork-workbench">
    <div class="top-bar">
      <el-form inline :model="termParam" class="condition" label-width="120px">
        <!-- 正稿编号 -->
        <!-- <el-form-item label="正稿编号:" style="width: 240px">
          <el-input v-model="termParam.taskNo" placeholder="请输入正稿编号" />
        </el-form-item> -->
        <!-- PO号 -->
        <el-form-item label="PO号:">
          <el-input style="width:252px;" clearable v-model.trim="termParam.poNo" placeholder="请输入PO号" />
        </el-form-item>
        <!-- 大货订单类型 -->
        <el-form-item label="品类:">
          <el-select
            clearable
            v-model="termParam.orderType"
            class="m-2"
            placeholder="全部品类"
            style="width:252px;"
          >
            <el-option
              v-for="item in ac_original_order_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click="orderTypeChange(item.value)"
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
        <!-- 正稿文件状态 -->
        <el-form-item label="正稿文件状态:">
          <el-select
            style="width:252px;"
            clearable
            filterable
            v-model="termParam.status"
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
            v-model="termParam.producerId"
            placeholder="所有领取人"
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
      </el-form>
      <div class="btnBox">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <!-- 列表文字和处理 -->
    <div class="titleBox">
      <div class="listText">正稿文件列表</div>
      <div class="disposeBox">
        <span class="inProgress">处理中:{{ processing }}</span>
        <span class="pending">待处理:{{ pending }}</span>
      </div>
    </div>
    <!-- 空状态 -->
    <!-- <el-empty description="暂无数据" /> -->
    <!-- 正稿文件列表  -->
    <div class="outworkListBox">
      
      <el-table :data="tableData" style="width: 100%;height: 580px;" scrollbar-always-on  row-key="id" ref="multipleTable">
        <el-table-column label="PO号" width="200">
          <template #default="scope">
            <div>
              <span class="turn" v-if="scope.row.orderFlag == 1">翻</span>
              <span>{{ scope.row.poNo || "-" }}</span>
              <el-icon
                :name="scope.row.poNo"
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
        <el-table-column label="订单参数" width="310">
          <template #default="scope">
                  <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.id" type="artwork"></OrderAttrShow>
              <!-- <el-link v-if="scope.row.productAttr" :underline="false" @click="seeAll(scope.row.productAttr)">
                <div class="property">{{scope.row.productAttr}}</div>
              </el-link>
              <div v-else>-</div> -->
          </template>
        </el-table-column>
        <el-table-column label="客户源文件" width="210" >
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
        <el-table-column label="设计制作需求描述" width="200">
          <template #default="scope">
            <div v-if="scope.row.demandDesc"><el-button type="primary" text @click="catDepictDetail(scope.row.demandDesc,'')">查看详情</el-button></div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="设计正稿文件" width="210">
          <template #default="scope">
            <div v-if="scope.row.annexVOS?.length > 0">
              <el-popover
                placement="top-start"
                trigger="hover"
                v-for="item in scope.row.annexVOS" :key="item.sort"
                :content="fileName(item.fileName)"
                >
              <template #reference>
                <div  class="text-overflow gesture" :style="scope.row.annexVOS?.length > 1 ? 'width:180px;' : 'width:190px;'">
                    <a :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank"><span v-if="scope.row.annexVOS?.length > 1">部件{{toChineseNumber(item.sort)}}:</span> {{fileName(item.fileName)}}</a>
                  </div>
              </template>
              </el-popover>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="是否转单" width="200">
          <template #default="scope">
            <div>{{ scope.row.transfer || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="转单备注" width="200" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{scope.row.transferRemark||'-'}}</span>
            <!-- <div v-if="scope.row.transferRemark">
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="scope.row.transferRemark"
              >
                <template #reference>
                  <div class="text-overflow" style="width: 153px">
                    {{ scope.row.transferRemark }}
                  </div>
                </template>
              </el-popover>
            </div>
            <div v-else>-</div> -->
          </template>
        </el-table-column>
        <el-table-column label="正稿任务状态" width="200">
          <template #default="scope">
            <DictTag :value="scope.row.status" :options="ac_original_status"/>
          </template>
        </el-table-column>
        <el-table-column label="正稿任务领取人" width="200">
          <template #default="scope">
            <div>{{ scope.row.producer || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="客户源文件上传时间" width="200">
          <template #default="scope">
            <div v-if="scope.row.customerFiles?.length > 0">
              <div>{{scope.row.customerFiles[scope.row.customerFiles.length - 1].uploadTime}}</div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="设计正稿文件上传时间" width="200">
          <template #default="scope">
            <div v-if="scope.row.annexVOS?.length > 0">
              <div>{{scope.row.annexVOS[scope.row.annexVOS.length - 1].updateTime}}</div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="正稿任务领取时间" width="200">
          <template #default="scope">
            <div>{{ scope.row.startTime || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <div class="operate">
              <el-link type="primary" :underline="false" @click="catDetail(scope.row.id)">查看详情</el-link>
              <el-link type="primary" :underline="false" class="public" :disabled="rejectDisabled(scope.row.status)" @click="reject(scope.row.id,scope.row.poNo)">驳回</el-link>
              <el-popover placement="bottom" width="300px;" trigger="click">
                <template #reference>
                  <el-button @click="isShowDownBtn = scope.row.id" size="small" style="margin-left: 10px">
                    <el-icon><More /></el-icon>
                  </el-button>
                </template>
                <div class="downBoX">
                    <div><el-button class="downBtn" text :disabled="downDisabled(scope.row.customerFiles,0)" @click="downFile(scope.row.customerFiles,0)">下载客户源文件</el-button></div>  
                    <div><el-button class="downBtn" text :disabled="downDisabled(scope.row.annexVOS,1)" @click="downFile(scope.row.annexVOS,1)">下载设计正稿文件</el-button></div>  
                    <div><el-button class="downBtn" text :disabled="transferDisabled(scope.row.status)" @click="transferSheet(scope.row.id)">转移正稿单</el-button></div>  
                </div>
              </el-popover>
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
    <!-- 设计制作需求描述弹窗 -->
    <div class="resourceBox">
      <el-dialog v-model="depictParam.isDepictShow" title="设计制作需求描述详情" width="600px">
        <el-scrollbar max-height="600px">
          <div class="depictContent" v-html="depictParam.content"  @click="imgViewer"></div>
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
    <!-- 正稿驳回弹窗 -->
    <div class="is-align-center"> 
      <el-dialog v-model="isRefusalShow" title="正稿驳回" width="600px"  @close="closePopup(0)">
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
         <el-form-item prop="img">
          <div class="upload">
            <FileUpload
              :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']"
              :fileSize="200"
              type=""
              name="上传图片附件"
              v-model:modelValue="refusalParam.img"
              del
            />
          </div>
        </el-form-item>
        <div style="display: flex;justify-content: right;">
         <el-form-item>
            <el-button  @click="cancelPopup(0)">取消</el-button>
            <el-button type="primary" @click="refusalAffirm(rejectRef)">确定</el-button>
          </el-form-item>
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
        <el-form-item  label="账号:"  prop="userId" :rules="[{ required: true, message: '请选择接受账号' }]">
            <el-select  clearable filterable v-model="transferParam.userId"  placeholder="请选择接受账号" style="width:400px;">
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
  </el-card>
  <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" ></el-image-viewer>
</div>
</template>

<script setup>
// 域名
import {BASE_FILE_URL} from "@/store/global-constant"
import {getOutworkList,getDisposeData,refusalOutwork,transferOutwork } from "@/api/outworkManage/outworkList";
import { getDeptUser } from "@/api/system/user";
import { singleDownload,zipDownload } from "@/api/download"
import { ElMessage ,ElMessageBox} from 'element-plus'
// 将阿拉伯数字'1'转中文数'一'
import { toChineseNumber,senseUrl  } from '@/utils/index'
import useAppStore from "@/store/modules/user";
import OrderAttrShow from "@/components/OrderAttrShow/order.vue"
import { nextTick, watch } from 'vue';

const appStore = useAppStore();
const name = ref('')
name.value = appStore.$state.name
const router = useRouter()
const { proxy } = getCurrentInstance();
const { ac_original_order_type,ac_original_status,prepress_department } = proxy.useDict("ac_original_order_type","ac_original_status","prepress_department");

// 条件参数
let termParam = reactive({
  // taskNo: "", // 正稿编号
  poNo: "", // po号(订单编号)
  orderType: "", // 大货订单类型值
  salesman: "", // 业务员
  status: "", // 正稿文件状态值
  producerId: "", // 领取人id
  current: 1, // 页数
  size: 10, // 每页条数
});
// 总条数
let total = ref(0);
// 大货订单类型
let orderTypeList = ref([
  // { label: "全部类型", value: 0 },
  // { label: "大货", value: 1 },
  // { label: "精装盒", value: 2 },
]);
// 正稿文件状态
let outworkStatus = ref([
  // { label: "所有状态", value: 0 },
  // { label: "未领取", value: 1 },
  // { label: "已领取", value: 2 },
  // { label: "已驳回", value: 3 },
  // { label: "被驳回", value: 4 },
  // { label: "已撤回", value: 6 },
  // { label: "客户撤单", value: 7 },
  // { label: "检测中", value: 8 },
  // { label: "检测失败", value: 9 },
  // { label: "已完成", value: 5 }
]);
// 领取人列表
let receiverList = ref([]);
// 账号列表
let accountList = ref([])
// 表格数据
let tableData = ref([]);
// 处理中
let processing = ref(0);
// 待处理
let pending = ref(0);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
// 是否显示下载按钮
let isShowDownBtn = ref(0);
// 是否显示正稿驳回弹窗
let isRefusalShow = ref(false)
// 驳回ref
const rejectRef = ref("")
// 转移ref
const transferRef = ref("")
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
  remark:'', // 备注
  img:'', //图片
})
// 是否显示转移正稿单弹窗
let isTransferShow = ref(false)
// 转移正稿单参数
let transferParam = reactive({
  originalId:'', // id
  userId:'', // 账号id
  remark:'' // 备注
})

// 清空表单
function clearForm(val){
  proxy.resetForm(val);
}

const deptId = ref('')
watch(prepress_department,(val)=>{
  deptId.value = val.find(item=>{return item.label=="original"}).value
  receive()
})
if (prepress_department.value.length>0) {
  deptId.value = prepress_department.value.find(item=>{return item.label=="original"}).value
  receive()
}
const multipleTable = ref(null)
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
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

// 获取正稿列表数据
async function outworkListData() {
  let { code, data } = await getOutworkList(termParam);
  if (code == 200) {
    tableData.value = data.records;
    total.value = data.total;
    console.log("tableData", tableData.value);
  }
  console.log("data", data);
}

outworkListData();

// 处理数据
async function disposeData(){
  let param = reactive({
      // taskNo:termParam.taskNo, // 正稿编号
      poNo:termParam.poNo, // po号(订单编号)
      orderType:termParam.orderType, // 大货订单类型值
      salesman:termParam.salesman, // 业务员
      status:termParam.status, // 正稿文件状态值
      producerId:termParam.producerId // 领取人id
  })
  console.log('param',param);
  let {code,data} = await getDisposeData(param)
  if(code==200){
    processing.value = data.processingCount
    pending.value = data.waitingCount
  }
}

disposeData()

// 获取账号列表
async function allAccount(){
  let {code,data} = await getDeptUser({deptId:deptId.value})
  if(code === 200){
    accountList.value = data
  }
}

// 驳回禁用
function rejectDisabled(status){
  // 已驳回(2) 已完成(5) 客户撤单(7)
  if(status == 3 || status == 4 || status == 7){
    return true
  }
  return false
}

// 下载禁用
function downDisabled(file,status){
  // 0 客户源文件    1 设计正稿文件
  if(status == 0 && file && file.length > 0){
    return false
  }
  if(status == 1 && file && file.length > 0){
    return false
  }
  return true
}

// 下载文件
async function downFile(file,status){
  // 0 客户源文件    1 设计正稿文件
  if(status == 0 && file && file.length > 0){
    console.log('file',file);
    let fileParam = {
      fileList:[],
      name:'客户源文件'
    }
    file.forEach(item=>{
      fileParam.fileList.push(item.fileAddress)
    })
    console.log('fileList',fileParam);
    let result = await zipDownload(fileParam,'客户源文件.zip')
  }
  if(status == 1 && file && file.length > 0){
    let fileParam = {
      fileList:[],
      name:'正稿文件'
    }
    file.forEach(item=>{
      fileParam.fileList.push(item.fileAddress)
    })
    console.log('fileList',fileParam);
    let result = await zipDownload(fileParam,'设计正稿文件.zip')
  }
}

// 转移正稿单禁用
function transferDisabled(status){
  // 已领取
  if(status=='2'){
    return false
  }
  return true
}

// 大货订单类型改变
const orderTypeChange = (value) => {
  console.log("value", value);
};

// 正稿文件状态改变
const outworkStatusChange = (value) => {};

// 正稿领取人改变
const receiverChangeChange = (id) => {};

// 重置
const reset = () => {
  // termParam.taskNo = ""; // 正稿编号
  termParam.poNo = ""; // po号(订单编号)
  termParam.orderType = ""; // 大货订单类型值
  termParam.salesman = ""; // 业务员
  termParam.status = ""; // 正稿文件状态值
  termParam.producerId = ""; // 领取人值
  search()
};
// 搜索
const search = () => {
  termParam.size = 10;
  termParam.current = 1;
  outworkListData();
  disposeData()
};

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

// 获取路径的名字
function fileName(url) {
  if (url.lastIndexOf("/") > -1) {
    return url.slice(url.lastIndexOf("/") + 1);
  }
  return url
}

// 查看设计制作需求描述
function catDepictDetail(content,resource){
  // console.log('resource',resource);
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

// 每页条数改变
function sizeChange(value) {
  console.log("每页条数改变", value);
  termParam.size = value;
  outworkListData();
  disposeData()
}

// 页数改变
function currentChange(value) {
  console.log("页数改变", value);
  termParam.current = value;
  outworkListData();
  disposeData()
}

// 驳回
const reject = (id,poNo)=>{
  refusalParam.originalId = id
  refusalParam.poNo = poNo
  isRefusalShow.value = true
} 

// 关闭弹窗
const closePopup = (type)=>{
  console.log('关闭了');
  // 0 驳回   1 转移
  if(type == 0){
    clearForm('rejectRef')
    isRefusalShow.value = false
  }else if(type == 1){
    clearForm('transferRef')
    isTransferShow.value = false
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
  }
}


// 驳回确认
 function refusalAffirm (formEl) {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
     try{
      let {code,msg} = await  refusalOutwork(refusalParam)
      if(code == 200){
        ElMessage.success(msg)
        isRefusalShow.value = false
        outworkListData()
        disposeData()
      }
     }catch(err){
        isRefusalShow.value = false
        outworkListData()
        disposeData()
        console.log(err.message);
     }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// 转移正稿单
const transferSheet = (id)=>{
  isTransferShow.value = true
  transferParam.originalId = id
  // 获取所有账号
  allAccount()
}
const setKey = (row)=>{
  console.log('row',row)
  return row.id
}
// 转移正稿单确认
const transferAffirm = (formEl) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      try{
        let {code,msg} = await transferOutwork(transferParam)
        if(code== 200){
          ElMessage.success(msg)
          isTransferShow.value = false
          outworkListData()
          disposeData()
        }
      }catch(err){
        isTransferShow.value = false
        outworkListData()
        disposeData()
        console.log(err.message);
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}

// 查看详情
const catDetail = (id)=>{
    const { href } = router.resolve({
                path: 'outworkDetails',
                query: {
                    taskId: id,
                    menuName:'正稿文件列表'
                }
            });
    window.open(href, "_blank");
}

// 打开文件
function openFile(url){
  console.log('url',url);
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
:deep(.el-popper){
  max-width:400px;
  word-break: break-all;
}
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
    .disposeBox {
      .pending {
        margin-left: 30px;
      }
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
  // 设计制作需求描述弹窗
  .resourceBox{
    .depictContent{
      font-size: 20px;
    }
    .nameBox{
      display: flex;
      justify-content: space-between;
      font-size: 20px;
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
</style>
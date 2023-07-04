<template>
<div>
  <el-card style="margin: 10px" class="artwork-workbench">
    <div class="top-bar">
      <el-form inline :model="termParam" class="condition" label-width="102px">
        <!-- 正稿编号 -->
        <!-- <el-form-item label="正稿编号:" style="width: 240px">
          <el-input v-model="termParam.taskNo" placeholder="请输入正稿编号" />
        </el-form-item> -->
        <!-- PO编号 -->
        <el-form-item label="PO号:">
          <el-input style="width:252px;" clearable v-model.trim="termParam.poNo" placeholder="请输入PO号" />
        </el-form-item>
        <!-- 大货订单类型 -->
        <el-form-item label="品类:">
          <el-select
            style="width:252px;"
            clearable
            v-model="termParam.orderType"
            placeholder="全部品类"
            class="m-2"
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
        <!-- 正稿完成时间 -->
        <el-form-item label="正稿完成时间:" style="font-weight: 700;">
          <el-date-picker style="width:252px;"  v-model="donetime" type="daterange" unlink-panels range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <!-- 正稿文件状态 -->
        <el-form-item label="正稿状态:">
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
              v-show="item.label!='未领取'&&item.label!='已驳回'"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click="outworkStatusChange(item.value)"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btnBox">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <!-- 列表文字和导出 -->
    <div class="titleBox">
      <div class="listText">已正稿列表</div>
      <div class="disposeBox">
        <el-button @click="expExcel">导出</el-button>
      </div>
    </div>
    <!-- 空状态 -->
    <!-- <el-empty description="暂无数据" /> -->
    <!-- 正稿文件列表  -->
    <div class="outworkListBox">
      <el-table :data="tableData" style="width: 100%;height: 560px;" scrollbar-always-on row-key="id" ref="multipleTable">
        <el-table-column label="PO号" width="200">
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
            <!-- <div v-if="(scope.row.demandDesc.note || scope.row.demandDesc.files?.length > 0 )||(scope.row.demandDesc.note && scope.row.demandDesc.files?.length > 0 )"><el-button type="primary" text @click="catDepictDetail(scope.row.demandDesc.note,scope.row.demandDesc.files)">查看详情</el-button></div> -->
             <div v-if="scope.row.demandDesc"><el-button type="primary" text @click="catDepictDetail(scope.row.demandDesc,'')">查看详情</el-button></div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="设计正稿文件" width="210">
          <template #default="scope">
            <div  v-if="scope.row.annexVOS?.length > 0" >
              <el-popover
                placement="top-start"
                trigger="hover"
                v-for="item in scope.row.annexVOS" :key="item.sort"
                :content="fileName(item.fileName)"
              >
              <template #reference>
                <div  class="text-overflow gesture" :style="scope.row.annexVOS?.length > 1 ? 'width:180px;' : 'width:190px;'">
                  <a :href="senseUrl(BASE_FILE_URL+item.fileAddress)" target="_blank"><span v-if="scope.row.annexVOS?.length > 1">部件{{toChineseNumber(item.sort)}}:</span> {{fileName(item.fileAddress)}}</a>
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
        <el-table-column label="转单备注" width="200"  :show-overflow-tooltip="true">
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
        <el-table-column label="业务员" width="200">
          <template #default="scope">
            <div>{{ scope.row.salesman || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200">
          <template #default="scope">
            <DictTag :value="scope.row.status" :options="ac_original_status"/>
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
        <el-table-column label="正稿完成时间" width="200">
          <template #default="scope">
            <div>{{ scope.row.finishTime || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="正稿耗时(小时)" width="200">
          <template #default="scope">
            <div>{{ scope.row.duration || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template #default="scope">
            <div class="operate">
              <el-link type="primary" :underline="false" @click="catDetail(scope.row.id)">查看详情</el-link>
              <el-link type="primary" :underline="false" class="public"  @click="withdraw(scope.row.id)">撤回正稿</el-link>
            <el-popover placement="bottom" width="300px;" trigger="click">
              <template #reference>
                  <el-button
                @click="isShowDownBtn = scope.row.id"
                size="small"
                style="margin-left: 10px"
              >
                <el-icon>
                  <More />
                </el-icon>
              </el-button>
              </template>
              <div><el-button text :disabled="btnDisabled(scope.row.customerFiles,0)" @click="downFile(scope.row.customerFiles,0)">下载客户源文件</el-button></div>
              <div><el-button text :disabled="btnDisabled(scope.row.annexVOS,1)" @click="downFile(scope.row.annexVOS,1)">下载设计正稿文件</el-button></div>
              <div><el-button class="downBtn" text :disabled="btnDisabled(scope.row.remarkFlag,2)" @click="remarksMandate(scope.row.poNo)">修改备注授权</el-button></div>
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
    <!-- 撤回正稿弹窗 -->
    <div class="revokeOutwork">
      <el-dialog v-model="isRevokeShow" title="确定撤回正稿?" width="600px">
        <div>是否立即发起撤单申请?</div>
           <el-form-item label="备注:" prop="remark" style="margin-top:20px">
            <el-input
              v-model.trim="cancelParam.remark"
              type="textarea"
              placeholder="请输入撤单备注内容"
              autocomplete="off"
              show-word-limit
              maxlength="300"
              resize="none"
              rows="6"
            />
          </el-form-item>
        <div class="btnBox">
          <el-button @click="isRevokeShow = false">取消</el-button>
          <el-button type="primary" @click="withdrawAffirm">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 备注授权弹窗 -->
    <div class="mandate">
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
// 下载
import { download } from "@/utils/request"
// 域名
import {BASE_FILE_URL} from "@/store/global-constant"
import { getOutworkList,refusalOutwork,exp } from "@/api/outworkManage/myOutworkList";
import {agreeModifyRemark } from "@/api/outworkManage/outworkFileBench"
import {formatDates} from "@/utils/index"
import { singleDownload,zipDownload } from "@/api/download"
import { ElMessage ,ElMessageBox} from 'element-plus'
// 将阿拉伯数字'1'转中文数'一'
import { toChineseNumber,senseUrl  } from '@/utils/index'
import { nextTick, watch } from 'vue';

import OrderAttrShow from "@/components/OrderAttrShow/order.vue"
const { proxy } = getCurrentInstance();
const { ac_original_order_type,ac_original_status } = proxy.useDict("ac_original_order_type","ac_original_status");
const router = useRouter();

// 绑定的时间值(默认三个月)
let donetime = ref([formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),formatDates(new Date().getTime()+3600 * 1000 * 24 * 1)])
// console.log('donetime',donetime[0]);
// console.log('donetime',donetime[1]);
// 条件参数
let termParam = reactive({
  // taskNo: "", // 正稿编号
  poNo: "", // po号(订单编号)
  orderType: "", // 大货订单类型值
  salesman: "", // 业务员
  startTime:formatDates( new Date(donetime.value[0]).getTime()), // 开始时间
  endTime:formatDates( new Date(donetime.value[1]).getTime()), // 结束时间
  status: "", // 正稿文件状态值
  // receiverValue: "", // 领取人值
  current: 1, // 页数
  size: 10, // 每页条数
});
// 总条数
let total = ref(0);
// 大货订单类型
let orderTypeList = ref([
  // { label: "全部类型", value: 0 },
  // { label: "大货", value: 1 },
  // { label: "精装盒", value: 2 }
]);
// 正稿文件状态
let outworkStatus = ref([
  // { label: "所有状态", value: 0 },
  // { label: "已领取", value: 2 },
  // { label: "被驳回", value: 4 },
  // { label: "已撤回", value: 6 },
  // { label: "客户撤单", value: 7 },
  // { label: "检测中", value: 8 },
  // { label: "检测失败", value: 9 },
  // { label: "已完成", value: 5 }
]);

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
let isRevokeShow = ref(false)
const formRef = ref()
// 正稿驳回内容
let refusalContent = reactive({
  cause: ''
})
// 是否显示备注授权弹窗
let isRemarksMandateShow = ref(false)
// 设计制作需求描述参数
let depictParam = reactive({
  isDepictShow:false, // 是否显示描述弹窗
  content:"", // 内容
  resource:[] // 资源
})
// 撤回正稿id
let withdrawId = ref('')
// 备注授权参数
let remarkParam = reactive({
  poNo:''  // po号
})
const data = reactive({
   cancelParam:{
    taskId:'',
    remark:''
  }
});
const { cancelParam } = toRefs(data);
const multipleTable = ref(null)
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
  })
})
// 获取正稿列表数据
async function outworkListData() {
  let { code, data } = await getOutworkList(termParam);
  if (code == 200) {
    tableData.value = data.records;
    total.value = data.total;
    // console.log("tableData", tableData.value);
  }
  // console.log("data", data);
}

outworkListData();

// 大货订单类型改变
const orderTypeChange = (value) => {
  // console.log("value", value);
};

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
  termParam.poNo = ""; // po号(订单编号)
  termParam.orderType = ""; // 大货订单类型值
  termParam.salesman = ""; // 业务员
  donetime.value = [formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),formatDates(new Date().getTime()+3600 * 1000 * 24 * 1)]; // 绑定的时间值(默认三个月)
  setTime()
  termParam.status = ""; // 正稿文件状态值
  // termParam.receiverValue = ""; // 领取人值
  search();
};
// 搜索
const search = () => {
  termParam.size = 10;
  termParam.current = 1;
  setTime()
  outworkListData();
};

// 下载Excel
function isExcel (type, name, data) {
   const link = document.createElement('a')
   const blob = new Blob([data])
   link.style.display = 'none'
   link.href = URL.createObjectURL(blob)
   link.setAttribute('download', `${name}.` + type)
   document.body.appendChild(link)
   link.click()
   document.body.removeChild(link)
 }

// 导出excel
async function expExcel(){
  setTime()
  let param = {
      poNo: termParam.poNo, // po号(订单编号)
      orderType:termParam.orderType, // 大货订单类型值
      salesman: termParam.salesman, // 业务员
      startTime:termParam.startTime, // 开始时间
      endTime:termParam.endTime, // 结束时间
      status:termParam.status, // 正稿文件状态值
  }
  // let data = await exp(param)
  // isExcel('xlsx',`已正稿列表_${formatDates(new Date().getTime())}`, data);
  download('/file-task/original-design/self-finished/export',param,`已正稿列表_${formatDates(new Date().getTime())}.xlsx`)
}

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
  // console.log("每页条数改变", value);
  termParam.size = value;
  outworkListData();
}

// 页数改变
function currentChange(value) {
  // console.log("页数改变", value);
  termParam.current = value;
  outworkListData();
}

// 查看详情
const catDetail = (id)=>{
    const { href } = router.resolve({
                path: 'outworkDetails',
                query: {
                    taskId: id,
                    menuName:'我的正稿文件列表'
                }
            });
    window.open(href, "_blank");
}

// 撤回正稿
function withdraw(id){
  withdrawId.value = id
  isRevokeShow.value = true
}

// 撤回正稿确认
async function withdrawAffirm(){
  try{
     cancelParam.value.taskId = withdrawId.value
    let {code,msg} = await refusalOutwork({...cancelParam.value})
    if(code === 200){
      ElMessage.success(msg)
      isRevokeShow.value = false
      outworkListData()
    }
  }catch(err){
    isRevokeShow.value = false
    outworkListData()
  }
}

watch(isRevokeShow,(val)=>{
  if(!val){
    cancelParam.value.remark = ''
  }
})
// 下载禁用
function btnDisabled(data,status){
  // 0 客户源文件    1 设计正稿文件  2 修改备注授权
  if(status == 0 && data && data.length > 0){
    return false
  }
  if(status == 1 && data && data.length > 0){
    return false
  }
  if(status == 2){
  // 1未申请，2发起申请，3同意申请，4拒绝申请
    if(data == 2){
      return false
    }else{
      return true
    }
  }
  return true
}


// 下载文件
async function downFile(file,status){
  // 0 客户源文件    1 设计正稿文件
  if(status == 0 && file && file.length > 0){
    // console.log('file',file);
    let fileParam = {
      fileList:[],
      name:'客户源文件'
    }
    file.forEach(item=>{
      fileParam.fileList.push(item.fileAddress)
    })
    // console.log('fileList',fileParam);
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
    // console.log('fileList',fileParam);
    let result = await zipDownload(fileParam,'设计正稿文件.zip')
  }
}

// 备注授权
const remarksMandate = (poNo)=>{
  isRemarksMandateShow.value = true
  remarkParam.poNo = poNo
}

// 备注授权确认
const remarkAffirm = async ()=>{
  try{
    let {code,msg} = await agreeModifyRemark(remarkParam)
    if(code == 200){
      ElMessage.success(msg)
      isRemarksMandateShow.value = false
      outworkListData()
    }
  }catch(err){
    isRemarksMandateShow.value = false
    outworkListData()
  }
}

// 打开文件
function openFile(url){
  // console.log('url',url);
  window.open(senseUrl(BASE_FILE_URL + url), "_blank");
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
    .nameBox{
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      margin-top: 20px;
    }
  }
  // 撤回正稿弹窗
  .revokeOutwork{
    .btnBox{
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
  // 备注授权弹窗
  .mandate{
    .mandateBtn{
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
</style>
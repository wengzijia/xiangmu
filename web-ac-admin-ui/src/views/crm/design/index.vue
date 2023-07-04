<template>
  <div class="crm-design">
    <el-card style="margin: 10px">
      <!-- <div>合同审核</div> -->
      <el-form :inline="true" :model="formData" label-width="120px" ref="formRef">
        <el-form-item label="客户信息:" prop="customerInfo">
          <el-input v-model.trim="formData.customerInfo" placeholder="请输入客户编号/客户名称" clearable style="width:252px;" />
        </el-form-item>
        <el-form-item label="归属部门:" prop="dept">
          <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
            <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务员:" prop="businessStaffId">
          <el-select v-model="formData.businessStaffId" placeholder="所有业务员" clearable style="width:252px;">
            <el-option v-for="item in salesmanList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="activeName != '1'" label="设计师:" prop="designerId">
          <el-select v-model="formData.designerId" placeholder="所有设计师" :disabled="isDesigner" clearable style="width:252px;">
            <el-option v-for="item in designerList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="转设计时间:" prop="turnDesignTime">
          <!-- <el-date-picker v-model="formData.turnDesignTime" type="datetimerange" range-separator="→"
            start-placeholder="开始日期" end-placeholder="结束日期" style="width:360px;"></el-date-picker> -->
            <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.turnDesignTime[0]"
              v-model:endTime="formData.turnDesignTime[1]" ></dateTimePicker>
        </el-form-item>
        <el-form-item label="设计完成时间:" prop="endTime">
          <!-- <el-date-picker v-model="formData.endTime" type="datetimerange" range-separator="→" start-placeholder="开始日期"
            end-placeholder="结束日期" style="width:360px;"></el-date-picker> -->
            <dateTimePicker ref="dateRef1" :dateType="'datetimerange'" :isThreeMonths="false" v-model:startTime="formData.endTime[0]"
              v-model:endTime="formData.endTime[1]" ></dateTimePicker>
        </el-form-item>
      </el-form>
      <div class="form-tool-bar">
        <div style="min-width:160px;width:160px;">
          <el-button @click="resetFormParams">重置</el-button>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>
    </el-card>
    <el-card style="margin: 10px;overflow: hidden;flex: 1;" v-loading="loading" id="designListCard">
      <div style="position: relative;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="全部" name="0"></el-tab-pane>
          <el-tab-pane label="待领取" name="1"></el-tab-pane>
          <el-tab-pane label="已领取" name="2"></el-tab-pane>
          <el-tab-pane label="被驳回" name="3"></el-tab-pane>
          <el-tab-pane label="客户确认" name="4"></el-tab-pane>
          <el-tab-pane label="已完成" name="5"></el-tab-pane>
          <el-tab-pane label="已中止" name="6"></el-tab-pane>
        </el-tabs>
        <div style="display: inline-block;position: absolute;right: 0;top: 0;">
          <el-button style="width: 80px;" @click="exportExcel">导出</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%;" :height="tableHeight" row-key="id">
        <el-table-column prop="orderBusinessKey" label="订单编号" width="160" />
        <el-table-column prop="customerName" label="客户名称" />
        <el-table-column prop="businessStaffName" label="业务员" />
        <el-table-column v-if="activeName != '1'" prop="designerName" label="设计师" >
          <template #default="scope">
            {{scope.row.designerName||'-'}}
          </template>
        </el-table-column>
        <el-table-column v-if="activeName == '4' || activeName == '5'" prop="designTaxInclusiveCostFee" label="方案设计成本费" >
          <template #default="scope">
            {{ showMoney(scope.row.designTaxInclusiveCostFee) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeName == '0'" prop="designStatus" label="设计状态">
          <template #default="scope">
            <DictTag :value="scope.row.designStatus" :options="crm_design_status" />
          </template>
        </el-table-column>
        <el-table-column prop="turnDesignTime" label="转设计时间" width="160">
          <template #default="scope">
            {{ parseDate(scope.row.turnDesignTime) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeName == '4'" prop="submitCustomerConfirmTime" label="提交设计时间" width="160">
          <template #default="scope">
            {{ parseDate(scope.row.submitCustomerConfirmTime) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeName == '2'" prop="receiveTime" label="领取时间" width="160">
          <template #default="scope">
            {{ parseDate(scope.row.receiveTime) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeName == '6'" prop="closedApplicanterName" label="中止申请人" />
        <el-table-column v-if="activeName == '6'" prop="closedTime" label="中止时间" width="160">
          <template #default="scope">
            {{ parseDate(scope.row.closedTime) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeName == '3'" prop="submitDesignProposalRejectTime" label="驳回时间" width="160">
          <template #default="scope">
            {{ parseDate(scope.row.submitDesignProposalRejectTime) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeName == '3'" label="驳回原因" :show-overflow-tooltip="true" width="800px">
          <template #default="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.submitDesignProposalRejectReason"
              placement="top-start"
              append-to=".crm-design"
            >
              <span class="overflow-tooltip">{{ scope.row.submitDesignProposalRejectReason }}</span>
            </el-tooltip>
            
          </template>
        </el-table-column>
        <el-table-column v-if="activeName == '5' || activeName == '0'" prop="endTime" label="设计完成时间" width="160">
          <template #default="scope">
            {{ parseDate(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeName != '6'"  label="操作" width="140" fixed="right">
          <template #default="scope">
            <div>
              <el-link v-if="scope.row.designStatus == 2 || scope.row.designStatus == 3" :underline="false"
                type="primary" @click="showDrawer(scope.row)">提交设计</el-link>
              <el-link v-if="scope.row.designStatus == 4 || scope.row.designStatus == 5 || scope.row.designStatus == 6" :underline="false"
                type="primary" @click="showDrawer(scope.row,true)">查看设计</el-link>
              <el-link v-if="scope.row.designStatus == 1" :underline="false" type="primary"
                @click="receive(scope.row)">领取</el-link>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <el-button size="small">
                      <el-icon>
                        <More />
                      </el-icon>
                    </el-button>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="viewDemand(scope.row)">查看设计需求</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" style="position: relative;top: -20px;">
        <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
          @pagination="handleSizeChange" :total="total" v-model:limit="formData.size" :pageSizes="[20, 30, 50, 100]" />
      </div>
    </el-card>
    <el-drawer v-model="drawer" :title="drawerTitle" :size="600" direction="rtl" ref="drawerref">
      <el-form :model="drawerFormData" label-width="90px" :rules="rules" ref="dialogForm">
        <el-form-item v-if="(drawerFormData?.designStatus == 2 || drawerFormData?.designStatus == 3)" label="设计成本:"
          prop="designTaxInclusiveCostFee">
          <el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999.99" :controls="false" v-model="drawerFormData.designTaxInclusiveCostFee" style="width: 240px;" placeholder="请输入方案设计成本费"/>
        </el-form-item>
        <el-form-item v-if="drawerFormData?.designStatus == 2 || drawerFormData?.designStatus == 3" label="税金:"
          prop="designCostTaxes">
          <el-input-number @keydown="clearInput" :precision="2" :min="0" :max="999999999.99" :controls="false" v-model="drawerFormData.designCostTaxes" style="width: 240px;" placeholder="请输入包含税金额度"/>
        </el-form-item>
        <div>设计需求</div>
        <el-form-item label="" v-for="(item, i) in category" :key="i">
          <div>
            <div >
              <div>{{ item.goodsName }}：</div>
              <div v-html="item.designRequirementRtf" @click="imgViewer" style="word-break: break-all;"></div>
            </div>
            <div style="display: block;">
              <span style="margin-top: 10px;">附件:</span>
                <div v-if="item.designRequirementAttachment" style="word-break: break-all;">
                  <span style="margin-right: 10px;">{{ getFileName(item.designRequirementAttachment) }}</span>
                  <singDownFile :url="item?.designRequirementAttachment" />
                </div>
              <span v-if="!item.designRequirementAttachment" style="margin-left: 10px;">-</span>
            </div>
          </div>
        </el-form-item>
        <div v-if="drawerFormData?.designStatus == 2 || drawerFormData?.designStatus == 3">提交设计</div>
        <template v-if="drawerFormData?.designStatus == 2 || drawerFormData?.designStatus == 3">
          <div v-for="(item, i) in categoryList" :key="i">
            <el-tabs v-model="tabs" class="demo-tabs">
              <el-tab-pane :label="item.goodsName" name="1"></el-tab-pane>
            </el-tabs>
            <el-form-item label="提交设计">
              <template #label>
                <span><span style="color:red">*</span>提交设计</span>
              </template>
              <crmFileUpload :fileType="['png', 'jpg', 'jpeg', 'pdf']" :fileSize="50" :limit="5" del
                v-model:modelValue="item.designFileUrl" />
            </el-form-item>
          </div>
        </template>
        <template v-if="drawerFormData?.designStatus == 4 || drawerFormData?.designStatus == 5">
          <div v-for="(item, i) in categoryList" :key="i">
            <el-tabs v-model="tabs" class="demo-tabs">
              <el-tab-pane :label="item.goodsName" name="1"></el-tab-pane>
            </el-tabs>
            <el-form-item label="方案设计">
              <crmFileUpload :fileType="['png', 'jpg', 'jpeg', 'pdf']" :fileSize="50" :limit="5" showFile down
                v-model:modelValue="item.designFileUrl" />
            </el-form-item>
          </div>
        </template>
      </el-form>
      <div v-if="rejectList.length > 0">
        <div>驳回记录</div>
        <el-form v-for="(item, i) in rejectList" :key="i" class="history-box">
          <el-form-item label="驳回人:">
            <div>{{ item.submitDesignProposalRejectPersonName || '-' }}</div>
          </el-form-item>
          <el-form-item label="驳回原因:">
            <div style="word-break: break-all;">{{ item.submitDesignProposalRejectReason ||'-' }}</div>
          </el-form-item>
          <el-form-item label="驳回时间:">
            <div>{{ parseDate(item.submitDesignProposalRejectTime) || '-' }}</div>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-tool-bar">
        <div v-if="drawerFormData?.designStatus == 2 || drawerFormData?.designStatus == 3"
          style="min-width:160px;width:160px;">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
        <div v-else>
          <el-button @click="drawer = false" type="primary">关闭</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer v-model="demandDrawer" title="设计需求" :size="600" direction="rtl" >
      <div class="demand-box">
        <div class="demand-title">设计需求</div>
        <el-form style="margin-left: 20px;">
          <el-form-item label="" v-for="(item, i) in designRequirement" :key="i">
            <div>
            <div>
              <div>{{ item.goodsName }}：</div>
              <div v-html="item.designRequirementRtf" @click="imgViewer" style="word-break: break-all;"></div>
            </div>
            <div style="display: block;">
              <span style="margin-top: 10px;">附件:</span>
                <div v-if="item.designRequirementAttachment" style="word-break: break-all;">
                  <span style="margin-right: 10px;">{{ getFileName(item.designRequirementAttachment) }}</span>
                  <singDownFile :url="item?.designRequirementAttachment" />
                </div>
              <span v-if="!item.designRequirementAttachment" style="margin-left: 10px;">-</span>
            </div>
          </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-tool-bar">
          <el-button @click="demandDrawer = false" type="primary">关闭</el-button>
      </div>
    </el-drawer>
    <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" ></el-image-viewer>
  </div>
</template>

<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import { getDesignList, getDesignCategoryTask, submitDesign, takeDesigner, getDesignProposal, getDesignRequirement, exportDesignProcList } from "@/api/crm/design/index";
import { getDesignOrderProc, } from "@/api/crm/finance/contract";
import { formatDate, parseDate,getFileName} from '@/utils';
import { parseTime } from "@/utils/ruoyi"
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue"
import { ElMessage, ElMessageBox } from "element-plus";
// import { BASE_FILE_URL } from "@/store/global-constant"
import { getProjectDesignOrderProc } from "@/api/crm/order/detail"
// import {roleKey,} from '@/api/orderManagement/subOrder'
import useCrmOption from "@/store/modules/crmSelectOption"
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
import singDownFile from "@/components/singDownFile"
import { useTableHeight} from '@/hooks/useTableHeight'
const [isDesigner,userId] = useIsCrmSaleman('crmProjectDesigner')
const option = useCrmOption()
const salesmanList = computed(()=>option.salesmanList)
const designerList = computed(()=>option.designerList) 
// option.getOptionList('crmCustomerBusinessStaff')
// option.getOptionList('crmProjectDesigner')
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const dateRef=ref(null)
const dateRef1=ref(null)
// getDesignList
const data = reactive({
  formData: {
    current: 1,//页码
    size: 20,//分页大小
    customerInfo: null,//客户信息
    businessStaffId: null,//业务员
    businessKeyInfo: null,//订单信息
    turnDesignTime: [formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90),formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000)],//转设计时间
    endTime: ['',''],//设计完成时间
    contractAuditPersonId: null,//审核人
    contractType: null,//结算方式
    designerId:userId,//设计师
  },
  drawerFormData: {
    designCostTaxes:null,
    designTaxInclusiveCostFee:null
  }
});
const { formData, drawerFormData } = toRefs(data);
const loading = ref(false);
const drawer = ref(false);
const demandDrawer = ref(false)
const tableData = ref([]);
const total = ref(0);
const category = ref([])
const categoryList = ref([])
const rejectList = ref([])
const designRequirement = ref([])//设计需求
const drawerTitle = ref('提交设计')
const { proxy } = getCurrentInstance();
const tabs = '1'
const {
  crm_design_status,
  crm_acColumn
} = proxy.useDict(
  "crm_design_status",
  "crm_acColumn"
);
option.setDeptId(formData.value.acDataSepDeptId);
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = res.data.id
    deptDisabled.value = true
  }
}).finally(()=>{
  getList()
})
watch(crm_acColumn,(val)=>{
	formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
const activeName = ref('0');
const dialogForm = ref(null)
const salesValue = ref('')
const designer = ref('')
const rules = reactive({
  designCostTaxes: [{ required: true, message: '请输入税金', trigger: 'blur' },],
  designTaxInclusiveCostFee: [{ required: true, message: '请输入设计成本', trigger: 'blur' },],
})
watch(activeName, (val) => {
  formData.value.endTime[0]=null
  formData.value.endTime[1]=null
  dateRef.value.initTime(1)
  search()
});
watch(drawer, (val) => {
  if (!val) {
    drawerFormData.value = null
    // drawerFormData.value.designCostTaxes = null
    categoryList.value = []
  }
});
const {tableHeight} = useTableHeight('designListCard')
function changeDept(val){
  option.setDeptId(val)
  formData.value.businessStaffId = null
}

/** 重置按钮操作 */
function resetFormParams() {
  proxy.resetForm("formRef");
  dateRef.value.initTime(1)
  dateRef1.value.initTime()
  // formData.value.turnDesignTime = [(new Date().getTime() - 1000 * 60 * 60 * 24 * 90),(new Date().getTime())]
  search();
};

//页码/分页大小改变事件
function handleSizeChange(val) {
  getList()
};

//搜索
function search() {
  formData.value.current = 1//页码
  formData.value.size = 20//分页大小
  getList()
};

function exportExcel(){
  if(!tableData.value?.length){
    ElMessage.error('暂无数据导出')
    return
  }
  let params = {
    ...formData.value
  }
  if (formData.value.turnDesignTime?.length > 0 && formData.value.turnDesignTime[0]) {
    params.turnDesignTimeStart =formData.value.turnDesignTime[0]? formatDate(formData.value.turnDesignTime[0]):formatDate(dateRef.value.start)// + ' 00:00:00'
    params.turnDesignTimeEnd = formData.value.turnDesignTime[1]?formatDate(formData.value.turnDesignTime[1]):formatDate(dateRef.value.end)// + ' 23:59:59'
  }else{
    params.turnDesignTimeStart = null
    params.turnDesignTimeEnd = null
  }
  if (formData.value.endTime?.length > 0) {
    params.endTimeStart = formatDate(formData.value.endTime[0])// + ' 00:00:00'
    params.endTimeEnd = formatDate(formData.value.endTime[1])// + ' 23:59:59'
    
  }
  if (activeName.value != '0') {
    params.designStatus = activeName.value
  } else {
    params.designStatus = null
  }
  if(activeName.value == '1'){
    params.designerId = null
  }
  params.turnDesignTime = params.endTime = undefined
  let status = ''
  switch (activeName.value) {
    case '0':
    status = '全部'
      break;
    case '1':
    status = '待领取'
      break;
    case '2':
    status = '已领取'
      break;
    case '3':
    status = '被驳回'
      break;
    case '4':
    status = '客户确认'
      break;
    case '5':
    status = '已完成'
      break;
    case '6':
    status = '已中止'
      break;
  
    default:
      break;
  }
  exportDesignProcList(params,`方案设计-${status+parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`)
}

//获取列表
function getList() {
  loading.value = true
  let params = {
    ...formData.value
  }
  if (formData.value.turnDesignTime?.length > 0 && formData.value.turnDesignTime[0]) {
    params.turnDesignTimeStart =formData.value.turnDesignTime[0]? formatDate(formData.value.turnDesignTime[0]):formatDate(dateRef.value.start)// + ' 00:00:00'
    params.turnDesignTimeEnd = formData.value.turnDesignTime[1]?formatDate(formData.value.turnDesignTime[1]):formatDate(dateRef.value.end)// + ' 23:59:59'
  }else{
    params.turnDesignTimeStart = null
    params.turnDesignTimeEnd = null
  }
  if (formData.value.endTime?.length > 0) {
    params.endTimeStart = formatDate(formData.value.endTime[0])// + ' 00:00:00'
    params.endTimeEnd = formatDate(formData.value.endTime[1])// + ' 23:59:59'
    
  }
  if (activeName.value != '0') {
    params.designStatus = activeName.value
  } else {
    params.designStatus = null
  }
  if(activeName.value == '1'){
    params.designerId = null
  }
  params.turnDesignTime = params.endTime = undefined
  getDesignList(params).then(res => {
    if (res.code == 200) {
      tableData.value = res.data.records
      total.value = res.data.total
    }
  }).finally(() => {
    loading.value = false
  })
};
// onMounted(()=>{
//   getList();
// })
const ShowFile = ref(false)
//打开抽屉
function showDrawer(data,look) {
  drawer.value = true
  drawerFormData.value = data
  if (look) {
    ShowFile.value = true
    drawerTitle.value = '设计需求'
  }else{
    ShowFile.value = false
    if (data.designStatus == 2 || data.designStatus == 3) {
      drawerTitle.value = '提交设计'
    } else {
      drawerTitle.value = '查看设计'
    }
  }
  getDesignCategory()
};
const drawerref = ref(null)
//提交
function submit() {
  proxy.$refs["dialogForm"].validate(valid => {
    if (valid) {
      let arr = categoryList.value.map(item => { return item.designFileUrl })//.filter(a => a)
      let length = arr.filter(a => a)
      if (length.length != categoryList.value.length) {
        ElMessage.error('请上传全部设计文件')
        return
      }
      //不能上传同名文件
      let newArr = []
      arr.map(item=>{
        let url = item.split(',')
        newArr = [...newArr,...url]
      })
      // let urlList =  [...new Set(newArr)]
      let urlList =  newArr.map(file=>{
        return getFileName(file)
      })
      urlList = [...new Set(urlList)]
      if (newArr.length!=urlList.length) {
        ElMessage.error('存在相同文件名，请更换文件名称重试。')
        return
      }
      proxy.$modal.loading('数据提交中，请稍候...')
      submitDesign({
        categoryList: categoryList.value.map(item => { item.goodsName = undefined; item.designFileName = getFileName(item.designFileUrl); return item }),
        designCostTaxes: drawerFormData.value.designCostTaxes,
        designTaxInclusiveCostFee: drawerFormData.value.designTaxInclusiveCostFee,
        id: drawerFormData.value.id
      }).then(res => {
        if (res.code == 200) {
          ElMessage.success('提交成功！')
          getList();
        }
      }).finally(() => {
        drawer.value = false
        proxy.$modal.closeLoading()
      })
    }else{
      const el = document.getElementsByClassName('el-drawer__body')[0]
      scrollToTop(el)
    }
  })

};
//滚动到顶部
const scrollToTop = (el) => {
  if (!el)
    return;
  const beginTime = Date.now();
  const beginValue = el.scrollTop;
  const frameFunc = () => {
    if (!el)
      return;
    const progress = (Date.now() - beginTime) / 500;
    if (progress < 1) {
      el.scrollTop = beginValue * (1 - easeInOutCubic(progress));
      requestAnimationFrame(frameFunc);
    } else {
      el.scrollTop = 0;
    }
  };
  requestAnimationFrame(frameFunc);
};

const cubic = (value) => {
  return value ** 3;
};
const easeInOutCubic = (value) => value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

//获取品类信息
function getDesignCategory(params) {
  if (!drawerFormData.value.id) {
    return
  }
  if (drawerFormData.value.parentProcType=='project_design_order') {
    getDesignOrderProc(drawerFormData.value.processParentId).then(res => {
      if (res.code == 200) {
        category.value = res.data.categoryList
        categoryList.value = res.data.categoryList.map(item => {
          let obj = {
            designFileName: "",
            designFileUrl: "",
            orderCategoryId: item.id,
            goodsName: item.goodsName
          }
          return obj
        })
        getDesignCategoryTask(drawerFormData.value.id).then(res => {
          if (res.code == 200&&res.data.length) {
            categoryList.value = res.data
          }
        })
      }
    })
  } else if(drawerFormData.value.parentProcType=='bulk_design_prod_order'){
    getProjectDesignOrderProc(drawerFormData.value.processParentId).then(res => {
      if (res.code == 200&&res.data) {
        category.value = res.data.categoryList
        categoryList.value = res.data.categoryList.map(item => {
          let obj = {
            designFileName: "",
            designFileUrl: "",
            orderCategoryId: item.id,
            goodsName: item.goodsName,
            ...item
          }
          return obj
        })
      }
    })
  }
  if (drawerFormData.value.designStatus == 3 || drawerFormData.value.designStatus == 4 || drawerFormData.value.designStatus == 5 || drawerFormData.value.designStatus == 6) {
    getDesignProposal(drawerFormData.value.procId).then(res => {
      if (res.code == 200) {
        rejectList.value = res.data
      }
    })
  }
}
//领取任务
function receive(data) {
  ElMessageBox.confirm(
    '确定领取任务?',
    '领取后请及时完成方案设计并上传提交',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      proxy.$modal.loading('领取中，请稍候...')
      takeDesigner(data.id).then(res => {
        if (res.code == 200) {
          ElMessage.success('领取成功！')
          getList();
        }
      }).finally(() => {
        proxy.$modal.closeLoading()
      })
    })
    .catch(() => { })
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
//查看设计需求
function viewDemand(scope){
  demandDrawer.value = true
  getDesignRequirement(scope.processParentId,{orderType:scope.parentProcType}).then(res=>{
    if(res.code==200){
      designRequirement.value = res.data
    }
  })
}

</script>
<style>
.el-table td.el-table__cell div{
  box-sizing: border-box;
}
.crm-design .el-popper{
  max-width:400px;
  word-break: break-all;
}
/* :deep(.el-popper){
  max-width:400px;
  word-break: break-all;
} */
</style>
<style lang="scss" scoped>
.crm-design{
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
}
:deep(.el-input-number .el-input__inner){
    text-align: left;
}
.overflow-tooltip{
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6 ;
  -webkit-box-orient: vertical;
  white-space:normal ;
}

.form-tool-bar {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
}
.history-box{
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin: 10px 0;
  padding: 0 16px;
}
.demand-box{
  padding: 0px 20px;
}
.demand-title{
  border-left: 2px solid rgb(255, 51, 153);
  padding-left: 6px;
}
</style>
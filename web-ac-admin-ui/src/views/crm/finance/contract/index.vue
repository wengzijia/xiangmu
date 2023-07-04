<template>
    <div>
      <el-card style="margin: 10px">
        <!-- <div>合同审核</div> -->
        <el-form :inline="true" :model="formData" label-width="120px" ref="formRef">
          <el-form-item label="客户信息:" prop="customerInfo">
            <el-input v-model.trim="formData.customerInfo" placeholder="请输入客户编号/客户名称" clearable style="width:252px;" />
          </el-form-item>
          <el-form-item label="归属部门:" prop="acDataSepDeptId">
            <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
              <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务员:" prop="businessStaffId">
            <el-select v-model="formData.businessStaffId" placeholder="所有业务员" clearable style="width:252px;">
              <el-option v-for="item in salesmanList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号:" prop="businessKeyInfo">
            <el-input v-model.trim="formData.businessKeyInfo" placeholder="请输入订单编号、打样/大货工单号" clearable style="width:252px;" />
          </el-form-item>
          <el-form-item label="申请时间:" prop="apply">
            <!-- <template #label>
              <span style="font-weight: 700;">申请时间</span>
            </template> -->
            <!-- <el-date-picker v-model="formData.apply" type="datetimerange" range-separator="→" start-placeholder="开始日期"
              end-placeholder="结束日期" style="width:360px;"></el-date-picker> -->
              <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.apply[0]"
              v-model:endTime="formData.apply[1]" ></dateTimePicker>
          </el-form-item>
          <el-form-item label="审核时间:" prop="examine">
            <!-- <template #label>
              <span style="font-weight: 700;">审核时间</span>
            </template> -->
            <!-- <el-date-picker v-model="formData.examine" type="datetimerange" range-separator="→" start-placeholder="开始日期"
              end-placeholder="结束日期" style="width:360px;"></el-date-picker> -->
              <dateTimePicker ref="dateRef1" :dateType="'datetimerange'" :isThreeMonths="false"  v-model:startTime="formData.examine[0]"
              v-model:endTime="formData.examine[1]" ></dateTimePicker>
          </el-form-item>
          <el-form-item label="审核人:" prop="contractAuditPersonId">
            <el-select v-model="formData.contractAuditPersonId" placeholder="所有" clearable style="width:252px;">
              <el-option v-for="item in financialStaffList" :key="item.assigneeId" :label="item.assigneeName" :value="item.assigneeId" />
            </el-select>
          </el-form-item>
          <el-form-item label="合同类型:" prop="contractType">
            <el-select v-model="formData.contractType" placeholder="所有" clearable style="width:252px;">
              <el-option v-for="item in crm_contract_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="form-tool-bar">
          <div style="min-width:160px;width:160px;">
            <el-button @click="resetFormParams">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
        </div>
      </el-card>
      <el-card style="margin: 10px">
        <div style="text-align: right;margin-bottom:10px;"><el-button @click="exportExcel">导出</el-button></div>
        <el-table :data="tableData" style="width: 100%;height: 540px;" row-key="id" v-loading="loading" ref="multipleTable">
          <el-table-column prop="orderBusinessKey" label="订单编号" width="160" />
          <el-table-column prop="businessKey" label="打样/大货工单号" width="160" >
            <template #default="scope">{{ scope.row.businessKey||'-' }}</template>
          </el-table-column>
          <el-table-column prop="customerName" label="客户名称" />
          <el-table-column prop="contractType" label="合同类型">
            <template #default="scope">
              <DictTag :value="scope.row.contractType" :options="crm_contract_type" />
            </template>
          </el-table-column>
          <el-table-column prop="businessStaffName" label="业务员" />
          <el-table-column prop="contractAuditStatus" label="审核状态" width="100">
            <template #default="scope">
              <DictTag :value="scope.row.contractAuditStatus" :options="crm_contract_examine_status" />
            </template>
          </el-table-column>
          <el-table-column prop="contractAuditPersonName" label="审核人" >
            <template #default="scope">{{ scope.row.contractAuditPersonName||'-' }}</template>
          </el-table-column>
          <el-table-column prop="submitContractTime" label="提交审核时间" width="160">
            <template #default="scope">{{ parseTime(scope.row.submitContractTime) }}</template>
          </el-table-column>
          <el-table-column prop="auditContractTime" label="审核时间" width="160">
            <template #default="scope">{{ parseTime(scope.row.auditContractTime)||'-' }}</template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <div>
                <el-link v-if="(scope.row.taskStatus!=toBeReviewed)" :underline="false" type="primary" @click="showDrawer(scope.row,'show')">查看</el-link>
                <el-link v-else :underline="false" type="primary" @click="showDrawer(scope.row,'edit')">审核</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages" style="position: relative;">
          <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
            @pagination="handleSizeChange" :total="total" v-model:limit="formData.size" :pageSizes="[20, 30, 50, 100]" />
        </div>
      </el-card>
      <el-drawer v-model="drawer" destroy-on-close :title="drawerType=='edit'?'审核':'查看'" :size="600" direction="rtl">
        <template #header="{close}">
          <div><DictTag :value="drawerFormData.contractType" :options="crm_contract_type" style="display: inline-block;"/>审核</div>
        </template>
        <el-form :model="drawerFormData" label-width="150px" ref="dialogForm">
          <div>{{drawerType=='edit'?'审核':'审核结果'}}</div>
          <el-form-item label="审核结果:">
            <template #label>
              <span style="color:red;margin-right: 4px;">* </span>
              <span>审核结果:</span>
            </template>
            <div v-if="drawerType=='edit'">
              <el-radio-group v-model="examine">
                <el-radio :label="0" size="large">审核不通过</el-radio>
                <el-radio :label="1" size="large">审核通过</el-radio>
              </el-radio-group>
            </div>
            <div v-else>
              <DictTag :value="drawerFormData.contractAuditStatus" :options="crm_contract_examine_status" />
            </div>
          </el-form-item>
          <el-form-item v-show="(examine == 0)&&drawerType=='edit'" label="审核不通过原因:">
            <template #label>
              <span style="color:red;margin-right: 4px;">* </span>
              <span>审核不通过原因:</span>
            </template>
            <div>
              <el-input v-model.trim="remake" placeholder="请输入审核不通过原因" show-word-limit maxlength="300" clearable
                style="width:252px;" />
            </div>
          </el-form-item>
          <el-form-item v-show="drawerType!='edit'&&drawerFormData.contractAuditStatus=='3'" label="审核不通过原因:">
            <template #label>
              <span style="color:red;margin-right: 4px;">* </span>
              <span>审核不通过原因:</span>
            </template>
            <div>
              <span style="word-break:break-all;">{{ drawerFormData.designServiceContractRejectReason||drawerFormData.contractAuditRejectReason ||drawerFormData.supplierContractAuditRejectReason||drawerFormData.bulkContractRejectReason||'-'}}</span>
            </div>
          </el-form-item>
        </el-form>
        <div>
          <orderInfo :drawerFormData="drawerFormData" @setDrawerFormData="setDrawerFormData"></orderInfo>
        </div>
        <div v-if="drawerType=='edit'" class="form-tool-bar">
          <div style="min-width:160px;width:160px;">
            <el-button @click="drawer = false">取消</el-button>
            <el-button :disabled="loading" type="primary" @click="check">提交</el-button>
          </div>
        </div>
        <div v-else class="form-tool-bar">
          <div style="min-width:160px;width:160px;">
            <el-button @click="drawer = false" type="primary">关闭</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </template>
  
<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import { getDesignTask } from "@/api/crm/design";
import { getAuditList, bulkContractAudit, designContractAudit, proofContractAudit,supplierContractAudit,assigneeType,exportContractAuditList,getAuditer } from "@/api/crm/finance/contract";
import { formatDate, } from '@/utils';
import { ElMessage, ElMessageBox } from 'element-plus'
import { watch } from "vue";
import orderInfo from "./components/orderInfo.vue";
import { parseTime } from "@/utils/ruoyi"
import useCrmOption from "@/store/modules/crmSelectOption"
import {gradingCalculate,} from '@/api/orderManagement/subOrder'
const option = useCrmOption()
const salesmanList = computed(()=>option.salesmanList)
const financialStaffList = ref([])
function getFinancialStaffList(){
	getAuditer().then(res=>{
		if (res.code==200) {
			financialStaffList.value = res.data
		}
	})
}
getFinancialStaffList()
// option.getOptionList('crmCustomerBusinessStaff')
// option.getOptionList('crmFinancialStaff')
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const dateRef = ref(null)
const dateRef1 = ref(null)
  // getAuditList
  const data = reactive({
    formData: {
      current: 1,//页码
      size: 20,//分页大小
      customerInfo: null,//客户信息
      businessStaffId: null,//业务员
      businessKeyInfo: null,//订单信息
      apply: ['',''],//申请时间
      examine: [],//审核时间
      contractAuditPersonId: null,//审核人
      contractType: null,//结算方式
      acDataSepDeptId:null,//部门id
    },
    drawerFormData: {}
  });
  const { formData, drawerFormData } = toRefs(data);
  const loading = ref(false)
  const drawer = ref(false)//抽屉是否展示
  const drawerType = ref('edit')
  const tableData = ref([])
  const examine = ref(0)//审核是否通过
  const remake = ref('')//驳回原因
  // const methodList = ref ([])//结算方式
  const total = ref(0)
  const auditId = ref('')
  const { proxy } = getCurrentInstance();
  const {
    crm_contract_type,
    crm_acColumn,
    crm_contract_examine_status,
  } = proxy.useDict(
    "crm_contract_type",
    "crm_acColumn",
    "crm_contract_examine_status"
  );
option.setDeptId(formData.value.acDataSepDeptId);
const acDataSepDeptId = ref('')
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
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
  const toBeReviewed = ref('1')
  watch(crm_contract_examine_status,(val)=>{
    toBeReviewed.value = val.find(item=>{ return item.label == '待审核'}).value
  })
  watch(drawer,(val)=>{
    remake.value = null
    if (!val) {
      drawerFormData.value = {}
    }
  })
  const multipleTable = ref(null)
  watch(tableData,()=>{
    nextTick(()=>{
      multipleTable.value.setScrollTop(0)
      multipleTable.value.setScrollLeft(0)
    })
  })
  function changeDept(val){
  option.setDeptId(val)
  formData.value.businessStaffId = null
}
  /** 重置按钮操作 */
  function resetFormParams() {
    proxy.resetForm("formRef");
    dateRef.value.initTime(1)
    dateRef1.value.initTime()
    formData.value.acDataSepDeptId = acDataSepDeptId.value
    // formData.value.apply = [(new Date().getTime() - 1000 * 60 * 60 * 24 * 90),(new Date().getTime())]
    search();
  }
  
  //页码/分页大小改变事件
  function handleSizeChange(val) {
    getList()
  }
  
  //搜索
  function search() {
    formData.value.current = 1//页码
    formData.value.size = 20//分页大小
    getList()
  }

  function exportExcel(){
    if(!tableData.value?.length){
      ElMessage.error('暂无数据导出')
      return
    }
    let params = {
      ...formData.value
    }
    if (formData.value.apply?.length > 0) {
      params.submitContractTimeStart =formData.value.apply[0]? formatDate(formData.value.apply[0]):formatDate(dateRef.value.start)// + ' 00:00:00'
      params.submitContractTimeEnd = formData.value.apply[1]?formatDate(formData.value.apply[1]):formatDate(dateRef.value.end)// + ' 23:59:59'
    }
    if (formData.value.examine?.length > 0) {
      params.auditContractTimeStart = formData.value.examine[0]?formatDate(formData.value.examine[0]):''// + ' 00:00:00'
      params.auditContractTime =formData.value.examine[1]? formatDate(formData.value.examine[1]):''// + ' 23:59:59'
    }
    params.apply = params.examine = undefined
    exportContractAuditList(params,`合同审核列表${parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`)
  }
  
  //获取列表
  function getList() {
    loading.value = true
    let params = {
      ...formData.value
    }
    if (formData.value.apply?.length > 0) {
      params.submitContractTimeStart =formData.value.apply[0]? formatDate(formData.value.apply[0]):formatDate(dateRef.value.start)// + ' 00:00:00'
      params.submitContractTimeEnd = formData.value.apply[1]?formatDate(formData.value.apply[1]):formatDate(dateRef.value.end)// + ' 23:59:59'
    }
    if (formData.value.examine?.length > 0) {
      params.auditContractTimeStart = formData.value.examine[0]?formatDate(formData.value.examine[0]):''// + ' 00:00:00'
      params.auditContractTime =formData.value.examine[1]? formatDate(formData.value.examine[1]):''// + ' 23:59:59'
    }
    params.apply = params.examine = undefined
    getAuditList(params).then(res => {
      if (res.code == 200) {
        tableData.value = res.data.records
        total.value = res.data.total
      }
    }).finally(() => {
      loading.value = false
    })
  }
// onMounted(()=>{
//   getList()})
  //打开抽屉
  function showDrawer(data,type) {
    drawerFormData.value = data
    drawer.value = true
    drawerType.value = type
    auditId.value = data.id
  }

  function check(){
    if(!examine.value&&!remake.value){
      ElMessage.error('请输入审核不通过原因')
      return
    }
    submit()
  }
  //提交
  function submit() {
    ElMessageBox.confirm(
      '操作立即生效是否继续?',
      '是否立即提交',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        loading.value = true
        let obj = {
          "id": auditId.value,
          "passed": (examine.value == 1),
          "rejectReason": examine.value == 0 ? remake.value : ''
        }
        new Promise((resolve, reject) => {
          // "1", "设计服务合同"
          // "2", "供应商合同(打样)"
          // "3", "供应商合同(大货)"
          // "4", "大货合同"
          switch (drawerFormData.value.contractType) {
            case '1':
              resolve(designContractAudit(obj))
              break;
            case '2':
              resolve(proofContractAudit(obj))
              break;
            case '3':
              resolve(supplierContractAudit(obj))
              break;
            case '4':
              resolve(bulkContractAudit(obj))
              break;
    
            default:
              break;
          }
        }).then(res => {
          if (res.code == 200) {
            ElMessage.success('审核完成!')
          }
          remake.value = ''
          getList();
        }).finally(() => {
          loading.value = false
          drawer.value = false
        })
      })
      .catch(() => { })
  }

function setDrawerFormData(data){
  drawerFormData.value = {...drawerFormData.value,...data}
}
</script>
  
<style lang="scss" scoped>
  .form-tool-bar {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 10px;
  }
</style>
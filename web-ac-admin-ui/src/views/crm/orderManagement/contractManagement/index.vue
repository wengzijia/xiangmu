<template>
  <div>
    <el-card style="margin: 10px">
      <el-form inline :model="formData" class="demo-form-inline" label-width="120px" ref="queryRef">
        <el-form-item label="客户信息:" prop="customerInfo">
          <el-input v-model="formData.customerInfo" placeholder="请输入客户编号/客户名称" clearable style="width: 252px" />
        </el-form-item>
        <el-form-item label="归属部门:" prop="acDataSepDeptId">
          <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
            <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务员:" prop="businessStaffId">
          <el-select :disabled="isSaleman" v-model="formData.businessStaffId" placeholder="所有业务员" clearable filterable
            style="width: 252px">
            <el-option v-for="item in salesmanList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
        </el-form-item>

        <el-form-item label="驳回人:" prop="enabled" v-if="cpagestatus == 2">
          <el-select v-model="formData.contractRejectPersonId" placeholder="所有驳回人" clearable filterable
            style="width: 252px">
            <el-option v-for="item in rejlist" :key="item.assigneeId" :label="item.assigneeName"
              :value="item.assigneeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间:" v-show="cpagestatus != 2">
          <!-- <el-date-picker
            v-model="datePicker"
            type="datetimerange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 252px"
          ></el-date-picker> -->
          <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.contractStartTimeStart"
            v-model:endTime="formData.contractStarTimeEnd"></dateTimePicker>
        </el-form-item>

        <el-form-item label="驳回时间:" v-show="cpagestatus == 2">
          <!-- <el-date-picker v-model="datePicker2" type="datetimerange" range-separator="→" start-placeholder="开始日期"
            end-placeholder="结束日期" style="width: 252px"></el-date-picker> -->
          <dateTimePicker ref="dateRef1" :dateType="'datetimerange'"
            v-model:startTime="formData.contractRejectTimeStart" v-model:endTime="formData.contractRejectTimeEnd">
          </dateTimePicker>
        </el-form-item>

        <el-form-item label="提交时间:" v-show="cpagestatus == 3 || cpagestatus == 4">
          <dateTimePicker ref="dateRef2" :dateType="'datetimerange'"
            v-model:startTime="formData.submitContractTimeStart" v-model:endTime="formData.submitContractTimeEnd">
          </dateTimePicker>
          <!-- <el-date-picker v-model="datePicker3" type="datetimerange" range-separator="→" start-placeholder="开始日期"
            end-placeholder="结束日期" style="width: 252px"></el-date-picker> -->
        </el-form-item>

        <el-form-item label="签订日期:" v-show="cpagestatus == 4">
          <!-- <el-date-picker v-model="datePicker4" type="daterange" range-separator="→" start-placeholder="开始日期"
            end-placeholder="结束日期" style="width: 252px"></el-date-picker> -->
          <dateTimePicker ref="dateRef3" :dateType="'daterange'" v-model:startTime="formData.contractSignDateStart"
            v-model:endTime="formData.contractSignDateEnd">
          </dateTimePicker>
        </el-form-item>


      </el-form>
      <div class="btnBox">
        <el-button @click="resetQuery('1')">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </el-card>
    <el-card style="margin: 10px">
      <div class="tool-bar">
        <el-tabs v-model="cpagestatus" class="demo-tabs" @tab-click="handleClick" style="width:100%">
          <el-tab-pane :label="item.label" :name="item.value" v-for="item in crm_ContractPaginationStatus"
            :key="item.value"></el-tab-pane>
        </el-tabs>
        <!-- <div>
          <el-button>导出</el-button>
          <el-button @click="draclick(1)">新增用户</el-button>
        </div> -->
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading" row-key="id" class="contable">
        <el-table-column prop="orderBusinessKey" label="订单编号" width="180" />
        <el-table-column prop="customerName" label="客户名称" width="180" />
        <el-table-column label="类型" width="140">
          <template #default="scope">
            <DictTag style="display: inline-block;" :value="
              scope.row.contractType
            " :options="crm_contract_type" />
          </template>
        </el-table-column>
        <el-table-column label="业务员" width="140">
          <template #default="scope">
            <div>{{ scope.row.businessStaffName || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="200">
          <template #default="scope">
            <div>{{ formatDate(scope.row.contractStartTime) || "-" }}</div>
          </template>
        </el-table-column>

        <el-table-column label="驳回时间" width="200" v-if="cpagestatus == 2">
          <template #default="scope">
            <div>{{ formatDate(scope.row.contractRejectTime) || "-" }}</div>
          </template>
        </el-table-column>

        <el-table-column label="驳回类型" width="200" v-if="cpagestatus == 2">
          <template #default="scope">
            <div>
              <!-- {{ scope.row.contractRejectType || "-" }} -->
              <DictTag style="display: inline-block;" :value="scope.row.contractRejectType" :options="crm_ContractRejectionType" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="驳回原因" width="200" height="200" v-if="cpagestatus == 2">
          <template #default="scope">
            <p style="max-height:150px;overflow:auto;">
              {{ scope.row.contractRejectReason }}
            </p>
          </template>
        </el-table-column>

        <el-table-column label="提交时间" width="200" v-if="cpagestatus == 3 || cpagestatus == 4">
          <template #default="scope">
            <div>{{ formatDate(scope.row.submitContractTime) || "-" }}</div>
          </template>
        </el-table-column>

        <el-table-column label="审核类型" width="200" v-if="cpagestatus == 3">
          <template #default="scope">
            <div>
              <!-- {{ scope.row.auditingType || "-" }} -->
              <DictTag style="display: inline-block;" :value="scope.row.auditingType" :options="crm_ContractReviewType" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="合同签订日期" width="200" v-if="cpagestatus == 4">
          <template #default="scope">
            <div>{{ scope.row.contractSignDate || "-" }}</div>
          </template>
        </el-table-column>


        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-link v-if="cpagestatus == 1 || cpagestatus == 2" :underline="false" type="primary"
              @click="editfn(cpagestatus, scope.row.processParentId, scope.row.procId, scope.row.parentProcType, scope.row.id, scope.row.contractType, scope.row.expectedNeedDaysNumber,scope.row.customerId)">{{
                cpagestatus == 1 ? '签订' : '重新签订' }}</el-link>
            <!-- <el-link v-else :underline="false" type="primary" style="color:#999;">详情</el-link> -->
            <el-link v-else :underline="false" type="primary"
              @click="editfn(2, scope.row.processParentId, scope.row.procId, scope.row.parentProcType, scope.row.id, scope.row.contractType, scope.row.expectedNeedDaysNumber,scope.row.customerId)"
              style="margin-left: 8px">查看</el-link>
            <!-- <el-link v-else :underline="false" type="primary" style="margin-left: 8px;color:#999;">审核</el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" style="position: relative">
        <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
           :total="total" v-model:limit="formData.size" :pageSizes="[20, 30, 50, 100]" />
      </div>
    </el-card>
    <el-drawer v-model="drawer" :title="getTitle()" direction="rtl" :before-close="handleClose" size="600px">
      <template #default>
        <div>
          <new-order ref="newo" :status="cpagestatus" :istype="istype" :isoperation="isoperation"
            :processParentId="processParentId" :detaildata="detaildata" :rejdata="rejdata" :bulkdata="bulkdata"
            :ctype="ctype" :nid="nid" :mtxt="mtxt" :enn="enn" :contype="contype" :userid="userid" :methodList="methodList" @cancelClick="cancelClick">
          </new-order>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">关闭</el-button>
          <el-button type="primary" @click="confirmClick(true)" v-if="cpagestatus == 1 || cpagestatus == 2">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import { reactive, ref, toRefs } from "vue";
import newOrder from './components/newOrder.vue'
import { formatDate, formatDates, LastThreeMonths, LastThreeMonths2 } from '@/utils';
import useUserStore from '@/store/modules/user'
import { roleKey, bulkDesignProdOrderProc, bulkOrderProc, rejecterlist,gradingCalculate } from '@/api/orderManagement/subOrder'
import {
  changeStatus,
  Getcustomerapply,
  Getcustomerapplyid,
  AddCustomer
} from "@/api/orderManagement/customer/index";
import { management, getcrmprojectdesignorderprocid, getdesignservicecontractid, bulkcontract } from "@/api/crm/order/contract"
import { ElMessageBox } from "element-plus";
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
import useCrmOption from "@/store/modules/crmSelectOption"
const option = useCrmOption()
const salesmanList = computed(() => option.salesmanList)
// option.getOptionList('crmCustomerBusinessStaff')
const [isSaleman, userId] = useIsCrmSaleman('crmCustomerBusinessStaff')
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const { proxy } = getCurrentInstance();
const {
  crm_contract_type,
  basic_approval_category,
  crm_ContractPaginationStatus,
  crm_ContractRejectionType,
  crm_ContractReviewType,
  crm_acColumn
} = proxy.useDict(
  "crm_contract_type",
  "basic_approval_category",
  "crm_ContractPaginationStatus",
  "crm_ContractRejectionType",
  "crm_ContractReviewType",
  "crm_acColumn"
)
const roles = computed(() => useUserStore().roles) //获取角色
const dateRef = ref(null)
const dateRef1 = ref(null)
const dateRef2 = ref(null)
const dateRef3 = ref(null)
let timestart=formatDate(LastThreeMonths2()[0]);
let timeend=formatDate(LastThreeMonths2()[1]);
const formData = ref({
  current: 1,
  size: 20,
  customerInfo: null, //客户信息
  contractRejectPersonId: null, //驳回人id
  businessStaffId: isSaleman ? userId : '', //业务员id
  contractStartTimeStart: timestart, //合同开始时间
  contractStarTimeEnd: timeend, //合同结束时间
  contractRejectTimeStart: null, //驳回开始时间
  contractRejectTimeEnd: null, //驳回结束时间
  submitContractTimeStart: null, //提交开始时间
  submitContractTimeEnd: null, //提交结束时间
  contractSignDateStart: null, //签订开始时间
  contractSignDateEnd: null, //签订结束时间
});
const drawer = ref(false);
const istype = ref(1);
const isoperation = ref(1);
const processParentId = ref('')
const nid = ref('')
const detaildata = ref(null)
const rejdata = ref(null)
const bulkdata = ref(null)
const ctype = ref('1')

// const datePicker = ref(LastThreeMonths())
// const datePicker2 = ref(LastThreeMonths())
// const datePicker3 = ref(LastThreeMonths())
// const datePicker4 = ref(LastThreeMonths2())
// console.log('LastThreeMonths2',LastThreeMonths2());
const rejlist = ref([])
const tableData = ref([]);
const editdata = ref(null)
const loading = ref(false);
const isSearch = ref(false);
const total = ref(0);
const contype = ref('1')
const isBusinessStaff = ref(false);
const drawerTitle = ref("新增客户");
const newo = ref(null)
const salesValue = ref('')
const cpagestatus = ref('1')
const mtxt = ref([])
const enn = ref('')
const userid=ref('')
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
let dranum = ref(1)
const acDataSepDeptId = ref('')
option.setDeptId(formData.value.acDataSepDeptId);
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
}).finally(()=>{
  search()
})
watch(crm_acColumn,(val)=>{
  formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
const onSubmit = () => {
  console.log('submit!')
}
function changeDept(val){
  option.setDeptId(val)
  formData.value.businessStaffId = null
}
const methodList=ref(null)
gradingCalculate().then((res) => {
  methodList.value = res.data.more_settlement_method
})
/** 重置按钮操作 */
function resetQuery (num) {
  // proxy.resetForm("formRef");
  dateRef.value.initTime(1)
  dateRef1.value.initTime(1)
  dateRef2.value.initTime(1)
  dateRef3.value.initTime(1)
  formData.value = {
    current: 1,
    size: 20,
    customerInfo: null, //客户信息
    contractRejectPersonId: null, //驳回人id
    businessStaffId: isSaleman ? userId : '', //业务员id
    contractStartTimeStart: cpagestatus.value == 2 ? null : formatDate(dateRef.value.start), //合同开始时间
    contractStarTimeEnd: cpagestatus.value == 2 ? null : formatDate(dateRef.value.end), //合同结束时间
    contractRejectTimeStart: cpagestatus.value == 2 ? formatDate(dateRef1.value.start) : null, //驳回开始时间
    contractRejectTimeEnd: cpagestatus.value == 2 ? formatDate(dateRef1.value.end) : null, //驳回结束时间
    submitContractTimeStart: cpagestatus.value == 3 || cpagestatus.value == 4 ? formatDate(dateRef2.value.start) : null, //提交开始时间
    submitContractTimeEnd: cpagestatus.value == 3 || cpagestatus.value == 4 ? formatDate(dateRef2.value.end) : null, //提交结束时间
    contractSignDateStart: cpagestatus.value == 4 ? formatDates(dateRef3.value.start) : null, //签订开始时间
    contractSignDateEnd: cpagestatus.value == 4 ? formatDates(dateRef3.value.end) : null, //签订结束时间
    acColumn : crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value,
    acDataSepDeptId:acDataSepDeptId.value
  };
  // datePicker.value = LastThreeMonths()
  // datePicker2.value = LastThreeMonths()
  // datePicker3.value = LastThreeMonths()
  // datePicker4.value = LastThreeMonths()
  // cpagestatus.value = num
  // search();
}
//搜索
function search () {
  formData.value.current = 1; //页码
  formData.value.size = 20; //分页大小
  // if (cpagestatus.value!=2&&datePicker.value?.length>0) {
  //   formData.value.contractStartTimeStart = formatDate(datePicker.value[0])
  //   formData.value.contractStarTimeEnd = formatDate(datePicker.value[1])
  // }else{
  //   formData.value.contractStartTimeStart = formData.value.contractStarTimeEnd = null
  // }
  // if (cpagestatus.value==2&&datePicker2.value?.length>0) {
  //   formData.value.contractRejectTimeStart = formatDate(datePicker2.value[0])
  //   formData.value.contractRejectTimeEnd = formatDate(datePicker2.value[1])
  // }else{
  //   formData.value.contractRejectTimeStart = formData.value.contractRejectTimeEnd = null
  // }
  // if ((cpagestatus.value==3||cpagestatus.value==4)&&datePicker3.value?.length>0) {
  //   formData.value.submitContractTimeStart = formatDate(datePicker3.value[0])
  //   formData.value.submitContractTimeEnd = formatDate(datePicker3.value[1])
  // }else{
  //   formData.value.submitContractTimeStart = formData.value.submitContractTimeEnd = null
  // }
  // if (cpagestatus.value==4&&datePicker4.value?.length>0) {
  //   formData.value.contractSignDateStart = formatDates(datePicker4.value[0])+' 00:00:00'
  //   formData.value.contractSignDateEnd = formatDates(datePicker4.value[1])+' 23:59:59'
  // }else{
  //   formData.value.contractSignDateStart = formData.value.contractSignDateEnd = null
  // }
  // console.log('fffff',formData.value);
        // dateRef.value.initTime(1)
        // dateRef1.value.initTime(1)
        // dateRef2.value.initTime(1)
        // dateRef3.value.initTime(1)
  isSearch.value = true
  getList(cpagestatus.value)
}
// getList(cpagestatus.value);

onMounted(() => {
  /**
   * 监听对象数据的变化
   */
  watch(
    [
      () => formData.value.current,
      () => formData.value.size,
      // () => cpagestatus.value,
      // () => formData.value.acColumn,
    ],
    (val, oval) => {
      // console.log('id555555555监听对象数据的变化', val, 'ovaloval----', oval)
      // 判断没有点击筛选按钮时，之前填写的参数初始化
      // if (!isSearch.value) {
      //   dateRef.value.initTime(1)
      //   dateRef1.value.initTime(1)
      //   dateRef2.value.initTime(1)
      //   dateRef3.value.initTime(1)
      //   formData.value.customerInfo = null//客户信息
      //   formData.value.contractRejectPersonId = null//驳回人id
      //   formData.value.businessStaffId = isSaleman ? userId : ''//业务员id
      //   formData.value.contractStartTimeStart = cpagestatus.value == 2 ? null : formatDate(dateRef.value.start)//合同开始时间
      //   formData.value.contractStarTimeEnd = cpagestatus.value == 2 ? null : formatDate(dateRef.value.end)//合同结束时间
      //   formData.value.contractRejectTimeStart = cpagestatus.value == 2 ? formatDate(dateRef1.value.start) : null//驳回开始时间
      //   formData.value.contractRejectTimeEnd = cpagestatus.value == 2 ? formatDate(dateRef1.value.end) : null//驳回结束时间
      //   formData.value.submitContractTimeStart = cpagestatus.value == 3 || cpagestatus.value == 4 ? formatDate(dateRef2.value.start) : null//提交开始时间
      //   formData.value.submitContractTimeEnd = cpagestatus.value == 3 || cpagestatus.value == 4 ? formatDate(dateRef2.value.end) : null//提交结束时间
      //   formData.value.contractSignDateStart = cpagestatus.value == 4 ? formatDates(dateRef3.value.start) : null//签订开始时间
      //   formData.value.contractSignDateEnd = cpagestatus.value == 4 ? formatDates(dateRef3.value.end) : null//签订结束时间
      // }
      // if (formData.value.acColumn) {
        getList(cpagestatus.value);
      // }
    },
    {
      // immediate: true,
      deep: true, //开启深度监听,能够侦听到对象属性值的变化
    }
  )
})



function getList (num) {
  management({ status: cpagestatus.value, ...formData.value })
    .then((res) => {
      tableData.value = res.data.records;
      total.value = res.data.total;
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
}
const handleClick = (tab, event) => {
  cpagestatus.value = tab.paneName
  formData.value.contractStartTimeStart = cpagestatus.value == 2 ? null : formatDate(dateRef.value.start)//合同开始时间
  formData.value.contractStarTimeEnd = cpagestatus.value == 2 ? null : formatDate(dateRef.value.end)//合同结束时间
  formData.value.contractRejectTimeStart = cpagestatus.value == 2 ? formatDate(dateRef1.value.start) : null//驳回开始时间
  formData.value.contractRejectTimeEnd = cpagestatus.value == 2 ? formatDate(dateRef1.value.end) : null//驳回结束时间
  formData.value.submitContractTimeStart = cpagestatus.value == 3 || cpagestatus.value == 4 ? formatDate(dateRef2.value.start) : null//提交开始时间
  formData.value.submitContractTimeEnd = cpagestatus.value == 3 || cpagestatus.value == 4 ? formatDate(dateRef2.value.end) : null//提交结束时间
  formData.value.contractSignDateStart = cpagestatus.value == 4 ? formatDates(dateRef3.value.start) : null//签订开始时间
  formData.value.contractSignDateEnd = cpagestatus.value == 4 ? formatDates(dateRef3.value.end) : null//签订结束时间
  // resetQuery(tab.paneName)
  getList(cpagestatus.value)
  // console.log(tab.paneName)
}
const getTitle = () => {
  let name = mtxt?.value[0]?.label
  let t = ''
  if (cpagestatus.value == 1) {
    t = name
  } else if (cpagestatus.value == 2) {
    t = '重新上传' + name
  } else {
    t = '查看' + name
  }
  return t
}
//状态修改
function handleStatusChange (row) {
  // let text = row.status ? "启用" : "停用";
  // proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"客户吗?').then(function () {
  //   return changeStatus(row.userId, row.status);
  // }).then(() => {
  //   proxy.$modal.msgSuccess(text + "成功");
  // }).catch(function () {
  //   row.status = row.status ? false : true;
  // });
}
const handleClose = (done) => {
  ElMessageBox.confirm("确定关闭?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
rejecterlist().then(res => {
  rejlist.value = res.data
})
const draclick = (num) => {
  // newo.value.demofn()
  // setTimeout(() => {
  //   if(num==1){
  //     newo.value.initdata()
  //   }else{
  //     newo.value.setdata()
  //   }
  // }, 100);

  drawer.value = true
}
const editfn = (is, pid, procId, type, id, m, eNN,uid) => {
  istype.value = is
  processParentId.value = pid
  nid.value = id
  ctype.value = type
  contype.value = m
  userid.value=uid
  mtxt.value = crm_contract_type.value.filter(e => {
    return e.value == m
  })
  enn.value = eNN

  if (type == 'project_design_order') {
    // if(type=='project_design_order'){
    getcrmprojectdesignorderprocid(pid).then(res => {
      if (res.code === 200) {
        drawer.value = true
        detaildata.value = res.data
      }
    })
      .catch(err => {
        detaildata.value = null
      })
    // }



  } else if (type == 'bulk_order' || type == 'bulk_design_prod_order') {
    if (type == 'bulk_order') {
      bulkOrderProc(pid).then((res) => {
        drawer.value = true
        detaildata.value = res.data
      })
    } else if (type == 'bulk_design_prod_order') {
      bulkDesignProdOrderProc(pid).then((res) => {
        if (res.code === 200) {
          drawer.value = true
          detaildata.value = res.data
        }
      })
    }
    // if(is!=1){
    //   bulkcontract(procId).then(res=>{
    //     if(res.code===200){
    //       bulkdata.value=res.data
    //     }
    //   })
    //   .catch(err=>{
    //     bulkdata.value=null
    //   })
    // }
  }

  if (is != 1) {
    if (m == 1) {
      getdesignservicecontractid(procId).then(res => {
        if (res.code === 200) {
          rejdata.value = res.data
        }
      })
        .catch(err => {
          rejdata.value = null
        })
    } else {
      bulkcontract(procId).then(res => {
        if (res.code === 200) {
          bulkdata.value = res.data
        }
      })
        .catch(err => {
          bulkdata.value = null
        })
    }
    // getdesignservicecontractid(procId).then(res=>{
    //   if(res.code===200){
    //     rejdata.value=res.data
    //   }
    // })
    // .catch(err=>{
    //   rejdata.value=null
    // }) 
    // projectDesignTask(id).then(res=>{
    //   if(res.code===200){
    //     rejdata.value=res.data
    //   }
    // })
  }

  // if(type==1){
  //   getcrmprojectdesignorderprocid(pid).then(res=>{
  //     console.log('res',res);
  //     if(res.code===200){
  //       drawer.value = true
  //       detaildata.value=res.data
  //     }
  //   })
  //   .catch(err=>{
  //     detaildata.value=null
  //   })
  //   getdesignservicecontractid(procId).then(res=>{
  //     if(res.code===200){
  //       rejdata.value=res.data
  //     }
  //   })
  //   .catch(err=>{
  //     rejdata.value=null
  //   })
  // }else if(type==4){
  //   bulkOrderProc(pid).then(res=>{
  //     console.log('res',res);
  //     if(res.code===200){
  //       drawer.value = true
  //       detaildata.value=res.data
  //     }
  //   })
  //   .catch(err=>{
  //     detaildata.value=null
  //   })
  //   bulkcontract(procId).then(res=>{
  //     if(res.code===200){
  //       bulkdata.value=res.data
  //     }
  //   })
  //   .catch(err=>{
  //     bulkdata.value=null
  //   })
  // }

};
function cancelClick () {
  drawer.value = false;
  getList(cpagestatus.value)
}
function confirmClick (flag) {
  newo.value.confirmClick()
}
</script>

<style lang="scss" scoped>
.btnBox {
  text-align: right;
  padding-right: 38px;
}

.tool-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
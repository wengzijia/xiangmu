<template>
  <div>
    <!-- <div>客户确认</div> -->
    <listLayout :height="headHeight">
      <template #header>
        <el-form :inline="true" :model="formData" label-width="90px" ref="formRef">
          <el-form-item label="客户信息:" prop="customerInfo">
            <el-input v-model.trim="formData.customerInfo" placeholder="请输入客户编号/客户名称" clearable style="width:252px;" />
          </el-form-item>
          <el-form-item label="归属部门:" prop="acDataSepDeptId">
              <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
                <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          <el-form-item label="业务员:" prop="businessStaffId">
            <el-select v-model="formData.businessStaffId" placeholder="所有业务员" :disabled="isSaleman" clearable style="width:252px;">
              <el-option v-for="(item,i) in salesmanList" :key="i" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间:" prop="applyTime">
            <!-- <el-date-picker v-model="formData.applyTime" type="datetimerange" range-separator="→" start-placeholder="开始时间"
              end-placeholder="结束时间" style="width:360px;"></el-date-picker> -->
              <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.applyTime[0]"
                v-model:endTime="formData.applyTime[1]" ></dateTimePicker>
          </el-form-item>
          <el-form-item v-show="activeName == '2'" label="审核时间:" prop="customerConfirmTime">
            <!-- <el-date-picker v-model="formData.customerConfirmTime" type="datetimerange" range-separator="→" start-placeholder="开始时间"
              end-placeholder="结束时间" style="width:360px;"></el-date-picker> -->
              <dateTimePicker  ref="dateRef1"  :dateType="'datetimerange'" v-model:startTime="formData.customerConfirmTime[0]"
              v-model:endTime="formData.customerConfirmTime[1]" :isThreeMonths="false"></dateTimePicker>
          </el-form-item>
        </el-form>
        <div class="form-tool-bar">
          <div style="min-width:160px;width:160px;">
            <el-button @click="resetFormParams">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
        </div>
      </template>
      <template #table-header>
        <el-tabs v-model="activeName">
          <el-tab-pane label="待确认" name="1"></el-tab-pane>
          <el-tab-pane label="已确认" name="2"></el-tab-pane>
        </el-tabs>
      </template>
      <template #table-content="tableHeight">
        <el-table v-loading="loading" :data="tableData" :height="tableHeight.tableHeight" style="width: 100%;" row-key="id" ref="multipleTable">
          <el-table-column prop="orderNo" label="订单编号" width="180" />
          <!-- <el-table-column v-if="activeName == '2'" prop="modulesName" label="编号" width="120" /> -->
          <el-table-column prop="customerConfirmsType" label="类型" >
            <template #default="scope">
              <DictTag :value="scope.row.customerConfirmsType" :options="crm_customer_confirm_type" />
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="客户名称" />
          <el-table-column prop="orderType" label="订单类型" >
            <template #default="scope">
              <DictTag :value="scope.row.orderType" :options="crm_order_type" />
            </template>
          </el-table-column>
          <el-table-column prop="businessStaffName" label="业务员" />
          <el-table-column prop="applyTime" label="申请时间" >
            <template #default="scope">
            {{ parseDate(scope.row.applyTime) }}
            </template>
          </el-table-column>
          <!-- <el-table-column v-if="activeName == '2'" prop="customerConfirmsType" label="审核结果" >
            <template #default="scope">
              <DictTag style="display: inline-block;" :value="scope.row.customerConfirmsType"
              :options="crm_customer_confirm_status" />
            </template>
          </el-table-column> -->
          <el-table-column v-if="activeName == '2'" prop="customerConfirmPersonName" label="审核人" />
          <el-table-column v-if="activeName == '2'" prop="customerConfirmTime" label="审核时间" >
            <template #default="scope">
            {{ parseDate(scope.row.customerConfirmTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <div v-if="activeName == '2'">
                <el-link :underline="false" type="primary" @click="showDrawer(scope.row)">查看</el-link>
              </div>
              <div v-if="activeName == '1'">
                <el-link :underline="false" type="primary" @click="showDrawer(scope.row)">确认</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pagination>
          <pagination style="padding: 0 !important;margin: 0;" background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
            @pagination="handleSizeChange" :total="total" v-model:limit="formData.size" :pageSizes="[20, 30, 50, 100]" />
      </template>
    </listLayout>
    <el-drawer v-model="drawer" title="客户确认" :size="600" direction="rtl">
      <design v-if="drawerType=='1'" :id="id" :activeName="activeName" @closeDrawer="closeDrawer"></design>
      <proof v-if="drawerType=='2'" :id="id" :orderNo="orderNo" :activeName="activeName" @closeDrawer="closeDrawer"></proof>
      <bulkDesign v-if="drawerType=='3'" :id="id" :activeName="activeName" @closeDrawer="closeDrawer"></bulkDesign>
      <payment v-if="drawerType=='4'" :id="id" :activeName="activeName" @closeDrawer="closeDrawer"></payment>
    </el-drawer>
  </div>
</template>

<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import { computed, watch } from 'vue';
import { getConfirmsList, } from "@/api/crm/customer/index";
import { parseTime } from "@/utils/ruoyi"
import { ElMessage } from 'element-plus';
import design from "./components/design.vue"
import proof from "./components/proof.vue"
import bulkDesign from "./components/bulkDesign.vue"
import payment from "./components/payment.vue"
import { parseDate,formatDate } from "@/utils/index"
import useCrmOption from "@/store/modules/crmSelectOption"
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
import listLayout from "@/components/ParentView/listLayout.vue";
const [isSaleman,userId] = useIsCrmSaleman('crmCustomerBusinessStaff')
const option = useCrmOption()
const salesmanList = computed(()=>option.salesmanList)
// option.getOptionList('crmCustomerBusinessStaff')
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const dateRef = ref(null)
const dateRef1 = ref(null)
const headHeight = ref(160)//搜索表单高度

const data = reactive({
  formData: {
    current: 1,//页码
    size: 20,//分页大小
    businessStaffId:userId,//业务员
    poNo: null,//客户信息
    customerConfirmTime: ['',''],//审核时间
    applyTime:['',''],//申请时间
    // applyTime:[(new Date().getTime() - 1000 * 60 * 60 * 24 * 90),(new Date().getTime())],//申请时间
  },
});
const { formData,  } = toRefs(data);
const id = ref('')
const { proxy } = getCurrentInstance();
const {
  crm_order_type,
  crm_customer_confirm_type,
  crm_customer_confirm_status,
  crm_acColumn
} = proxy.useDict(
  "crm_order_type",
  "crm_customer_confirm_type",
  "crm_customer_confirm_status",
  "crm_acColumn"
);
const loading = ref(false)
const drawer = ref(false)
const tableData = ref([])
const activeName = ref('1')
const total = ref(0)
const drawerType = ref('')
const orderNo = ref('')
const multipleTable = ref(null)
const acDataSepDeptId = ref('')
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
watch(tableData,()=>{
  nextTick(()=>{
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
watch(activeName, (val) => {
  formData.value.customerConfirmTime[0]=null
  formData.value.customerConfirmTime[1]=null
  search()
  proxy.$nextTick(()=>{
    if(val=='1'){
      headHeight.value = 160
    }else{
      headHeight.value = 181
    }
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
  // formData.value.applyTime = [(new Date().getTime() - 1000 * 60 * 60 * 24 * 90),(new Date().getTime())]
  search();
}

//搜索
function search() {
  formData.value.current = 1//页码
  formData.value.size = 20//分页大小
  getList()
}

//获取列表
function getList() {
  loading.value = true
  let obj = {
    customerInfo:formData.value.customerInfo,
    businessStaffId:formData.value.businessStaffId,
    taskStatus:activeName.value,
    current:formData.value.current,
    size:formData.value.size
  }
  if (formData.value?.applyTime?.length) {
    obj.applyTimeStart =formData.value.applyTime[0]? formatDate(formData.value.applyTime[0]):formatDate(dateRef.value.start)
    obj.applyTimeEnd = formData.value.applyTime[1]?formatDate(formData.value.applyTime[1]):formatDate(dateRef.value.end)
  }
  if (formData.value?.customerConfirmTime?.length) {
    obj.customerConfirmTimeStart =formData.value.customerConfirmTime[0]&&activeName.value==2? formatDate(formData.value.customerConfirmTime[0]):''
    obj.customerConfirmTimeEnd =formData.value.customerConfirmTime[1]&&activeName.value==2? formatDate(formData.value.customerConfirmTime[1]):''
  }
  getConfirmsList(obj).then(res=>{
    if (res.code==200) {
      tableData.value = res.data.records
      total.value = res.data.total
    }
  }).finally(()=>{
    loading.value = false
  })
}

//打开抽屉
function showDrawer(data){
  drawer.value = true
  id.value = data.id
  orderNo.value = data.orderNo
  drawerType.value = data.customerConfirmsType
}
// onMounted(()=>{
//   getList()

// })
//页码/分页大小改变事件
function handleSizeChange(val) {
  getList()
}
//关闭抽屉
function closeDrawer(flag) {
  drawer.value = false
  getList()
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__header){
  margin-bottom: 0;
}
:deep(.el-drawer__body){
  padding-top: 10px;
}
.form-tool-bar{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
}
</style>
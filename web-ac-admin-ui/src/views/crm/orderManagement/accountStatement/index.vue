<template>
  <div>
    <el-card style="margin: 10px">
      <el-form
        inline
        :model="formData"
        class="demo-form-inline"
        label-width="120px"
        ref="queryRef"
      >
        <el-form-item label="客户信息:" prop="customerInfo">
          <el-input
            v-model="formData.customerInfo"
            placeholder="请输入客户编号/客户名称"
            clearable
            style="width: 252px"
          />
        </el-form-item>
        <el-form-item label="归属部门:" prop="acDataSepDeptId">
					  <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
              <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        <el-form-item label="业务员:" prop="businessStaffId">
          <el-select
            :disabled="isSaleman"
            v-model="formData.businessStaffId"
            placeholder="所有业务员"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option
								v-for="item in salesmanList"
								:key="item.userId"
								:label="item.nickName"
								:value="item.userId"
							/>
          </el-select>
        </el-form-item>
        
        <el-form-item label="驳回人:" prop="submitGeneralAccountStatementRejecterId" v-if="cpagestatus==2">
          <el-select
            v-model="formData.submitGeneralAccountStatementRejecterId"
            placeholder="所有驳回人"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option v-for="item in bdata" :key="item.assigneeId" :label="item.assigneeName" :value="item.assigneeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间:" v-show="cpagestatus!=2">
          <!-- <el-date-picker
            v-model="datePicker"
            type="datetimerange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 252px"
          ></el-date-picker> -->
          <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.applyTimeStart"
              v-model:endTime="formData.applyTimeEnd" ></dateTimePicker>
        </el-form-item>

        <el-form-item label="驳回时间:" v-show="cpagestatus==2">
          <!-- <el-date-picker
            v-model="datePicker2"
            type="datetimerange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 252px"
          ></el-date-picker> -->
          <dateTimePicker ref="dateRef1" :dateType="'datetimerange'" v-model:startTime="formData.rejectTimeStart"
              v-model:endTime="formData.rejectTimeEnd" ></dateTimePicker>
        </el-form-item>

        <el-form-item :label="cpagestatus==2?'上次提交人:':'提交人:'" prop="submitGeneralAccountStatementerId" v-show="cpagestatus!=1">
          <el-select
            v-model="formData.submitGeneralAccountStatementerId"
            placeholder="所有提交人"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option v-for="item in tdata" :key="item.assigneeId" :label="item.assigneeName" :value="item.assigneeId" />
          </el-select>
        </el-form-item>

        <el-form-item label="提交时间:" v-show="cpagestatus==3||cpagestatus==4||cpagestatus==5">
          <!-- <el-date-picker
            v-model="datePicker3"
            type="datetimerange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 252px"
          ></el-date-picker> -->

          <dateTimePicker ref="dateRef2" :dateType="'datetimerange'" v-model:startTime="formData.submitGeneralAccountStatementTimeStart"
              v-model:endTime="formData.submitGeneralAccountStatementTimeEnd" ></dateTimePicker>
        </el-form-item>

        
        
      </el-form>
      <div class="btnBox">
        <el-button @click="resetQuery('1')">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </el-card>
    <el-card style="margin: 10px">
      <div class="tool-bar">
        <el-tabs v-model="cpagestatus" class="demo-tabs" style="width:100%">
          <el-tab-pane label="待提交" name="1"></el-tab-pane>
          <el-tab-pane label="被驳回" name="2"></el-tab-pane>
          <el-tab-pane label="审核中" name="3"></el-tab-pane>
          <el-tab-pane label="客户确认中" name="4"></el-tab-pane>
          <el-tab-pane label="客户已确认" name="5"></el-tab-pane>
        </el-tabs>
        <!-- <div>
          <el-button>导出</el-button>
        </div> -->
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
      >
        <el-table-column prop="orderBusinessKey" label="订单编号" width="180" />
        <el-table-column prop="customerName" label="客户名称" width="180" />
        <el-table-column label="订单类型" width="140">
          <template #default="scope">
            <DictTag
              style="display: inline-block;"
              :value="scope.row.parentProcType"
              :options="crm_order_type"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="结算方式" width="140">
          <template #default="scope">
            <settlementMethod
              v-if="risklist?.more_settlement_method"
              :methodId="scope.row.settlementMethod"
              :methodList="risklist.more_settlement_method"
            />
          </template>
        </el-table-column> -->
        <el-table-column label="业务员" width="140">
          <template #default="scope">
            <div>{{ scope.row.businessStaffName || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="200">
          <template #default="scope">
            <div>{{ formatDate(scope.row.generalAccountStatementApplyTime) || "-" }}</div>
          </template>
        </el-table-column>

        <el-table-column label="驳回类型" width="140" v-if="cpagestatus==2">
          <template #default="scope">
            <DictTag
							style="display: inline-block"
							:value="scope.row.submitGeneralAccountStatementRejectType"
							:options="crm_statement_rejection"
						/>
          </template>
        </el-table-column>

        <el-table-column label="驳回时间" width="200" v-if="cpagestatus==2">
          <template #default="scope">
            <div>{{ formatDate(scope.row.submitGeneralAccountStatementRejectTime) || "-" }}</div>
          </template>
        </el-table-column>

        <el-table-column label="驳回原因" width="200" v-if="cpagestatus==2">
          <template #default="scope">
            <p style="max-height:170px;">
              {{scope.row.submitGeneralAccountStatementRejectReason}}
            </p>
          </template>
        </el-table-column>

        <el-table-column label="驳回人" width="140" v-if="cpagestatus==2">
          <template #default="scope">
            <div>{{ scope.row.submitGeneralAccountStatementRejecterName || "-" }}</div>
          </template>
        </el-table-column>

        <el-table-column :label="cpagestatus==2?'上次提交人':'提交人'" width="140" v-if="cpagestatus!=1">
          <template #default="scope">
            <div v-if="cpagestatus==2">{{ scope.row.lastSubmitGeneralAccountStatementerName || "-" }}</div>
            <div v-else>{{ scope.row.submitGeneralAccountStatementerName || "-" }}</div>
          </template>
        </el-table-column>

        <el-table-column label="提交时间" width="200" v-if="cpagestatus!=1&&cpagestatus!=2">
          <template #default="scope">
            <div>{{ formatDate(scope.row.submitGeneralAccountStatementTime) || "-" }}</div>
          </template>
        </el-table-column>
        
        
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-link v-if="cpagestatus==1||cpagestatus==2" :underline="false" type="primary" @click="editfn(1,scope.row.processParentId,scope.row.procId,scope.row.parentProcType,scope.row.id,scope.row.settlementMethod)">{{cpagestatus==1?'提交':'重新提交'}}</el-link>
            <!-- <el-link v-else :underline="false" type="primary" style="color:#999;">详情</el-link> -->
            <el-link v-else :underline="false" type="primary" @click="editfn(2,scope.row.processParentId,scope.row.procId,scope.row.parentProcType,scope.row.id,scope.row.settlementMethod)" style="margin-left: 8px">查看</el-link>
            <!-- <el-link v-else :underline="false" type="primary" style="margin-left: 8px;color:#999;">审核</el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" style="position: relative">
        <pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-model:page="formData.current"
          :total="total"
          v-model:limit="formData.size"
          :pageSizes="[20, 30, 50, 100]"
        />
      </div>
    </el-card>
    <el-drawer
      v-model="drawer"
      :title="getTitle(cpagestatus)"
      direction="rtl"
      :before-close="handleClose"
      size="600px"
    >
      <template #default>
        <div>
          <new-order
              ref="newo"
              :status="cpagestatus"
              :istype="istype"
              :risklist="risklist"
              @cancelClick="cancelClick"
              :detaildata="detaildata"
              :rejdata="rejdata"
              :bulkdata="bulkdata"
              :prodata="prodata"
              :bgoodsdata="bgoodsdata"
              :ctype="ctype"
              :nid="nid"
            >
          </new-order>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer=false">{{istype==2?'关闭':'取消'}}</el-button>
          <el-button type="primary" @click="confirmClick(true)" v-if="cpagestatus==1||cpagestatus==2">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
  
</template>

<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import { reactive, toRefs } from "vue";
import newOrder from './components/drawer.vue'
import { formatDate,formatDates,LastThreeMonths } from '@/utils';
import useUserStore from '@/store/modules/user'
import { management,getcrmprojectdesignorderprocid,getdesignservicecontractid,bulkcontract } from "@/api/crm/order/contract"
import { getSubmitGeneralAccountStatement } from "@/api/crm/order/detail";
import {
	bulkAllData,
} from '@/api/orderManagement/costComposition'
import { roleKey,bulkDesignProdOrderProc,bulkOrderProc } from '@/api/orderManagement/subOrder'
import {
  gradingCalculateConfig
} from "@/api/orderManagement/customer/index";
import { accountStatement } from "@/api/crm/order/contract"
import { ElMessageBox } from "element-plus";
import {
	proofingProcOrder,
} from '@/api/orderManagement/proofing'
import {
	assigneeType
} from '@/api/crm/finance/contract'
import useCrmOption from "@/store/modules/crmSelectOption"
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
const [isSaleman,userId] = useIsCrmSaleman('crmCustomerBusinessStaff')
const option = useCrmOption()
const salesmanList = computed(()=>option.salesmanList)
// option.getOptionList('crmCustomerBusinessStaff')
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const { proxy } = getCurrentInstance();
const {
  crm_order_type,
  crm_statement_rejection,
  crm_acColumn
} = proxy.useDict(
  "crm_order_type",
  "crm_statement_rejection",
  "crm_acColumn"
)
const risklist=ref(null)
gradingCalculateConfig().then(res=>{
  // console.log('res',res);
  risklist.value=res.data
})
const roles = computed(() => useUserStore().roles) //获取角色
const bdata=ref([])
const tdata=ref([])
const data = reactive({
  formData: {
    current: 1,
    size: 20,
    customerInfo: null, //客户信息
    submitGeneralAccountStatementRejecterId: null, //驳回人id
    businessStaffId: isSaleman ? userId : '', //业务员id
    submitGeneralAccountStatementRejecterId:null,//提交人id
    applyTimeStart: formatDate(new Date(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90)), //申请开始时间
    applyTimeEnd: formatDate(new Date(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000)), //申请结束时间
    rejectTimeStart: null, //驳回开始时间
    rejectTimeEnd: null, //驳回结束时间
    submitGeneralAccountStatementTimeStart: null, //提交开始时间
    submitGeneralAccountStatementTimeEnd: null, //提交结束时间
  },
});
const { formData } = toRefs(data);
const acDataSepDeptId = ref('')
option.setDeptId(formData.value.acDataSepDeptId);
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
function changeDept(val){
  option.setDeptId(val)
  formData.value.businessStaffId = null
}
assigneeType(1).then(res=>{
  bdata.value=res.data
})
assigneeType(2).then(res=>{
  tdata.value=res.data
})
const drawer = ref(false);
const istype = ref(1);
const isoperation = ref(1);
const processParentId = ref('')
const nid = ref('')
const detaildata = ref(null)
const rejdata = ref(null)
const bulkdata = ref(null)
const prodata = ref(null)
const bgoodsdata = ref(null)
const ctype = ref('project_design_order')
const dateRef  = ref(null)
const dateRef1  = ref(null)
const dateRef2  = ref(null)


const tableData = ref([]);
const editdata = ref(null)
const loading = ref(false);
const total = ref(0);
const isBusinessStaff = ref(false);
const drawerTitle = ref("新增客户");
const newo = ref(null)
const salesValue = ref('')
// const salesmanList = ref([])
const cpagestatus = ref('1')
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

const queryRef = ref(null)
/** 重置按钮操作 */
function resetQuery(num) {
  queryRef.value.resetFields()
  formData.value.acDataSepDeptId = deptDisabled.value?acDataSepDeptId.value:''
  switch (cpagestatus.value) {
    case '1':
      dateRef.value.initTime(1)
      dateRef1.value.initTime()
      dateRef2.value.initTime()
      break;
    case '2':
      dateRef.value.initTime()
      dateRef1.value.initTime(1)
      dateRef2.value.initTime()
      break;
  
    default:
      dateRef.value.initTime(1)
      dateRef1.value.initTime()
      dateRef2.value.initTime(1)
      break;
  }
  search()
}
//搜索
function search() {
  getList(cpagestatus.value)
}

onMounted(() => {
  /**
   * 监听对象数据的变化
   */
  watch(
    [
      () => formData.value.current,
      () => formData.value.size,
    ],
    (val, oval) => {
        getList();
    },
    {
      // immediate: true,
      deep: true, //开启深度监听,能够侦听到对象属性值的变化
    }
  )
})



const getTitle = (val) =>{
  let name=''
  if(val==1){
    name=`提交对账单`
  }else if(val==2){
    name="重新提交对账单"
  }else{
    name="查看"
  }
  return name
}
// getList(cpagestatus.value);
function getList(num) {
  accountStatement({status:cpagestatus.value,...formData.value})
    .then((res) => {
      tableData.value = res.data.records;
      total.value = res.data.total;
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
}

watch(cpagestatus,val=>{
  //1 待提交;2 被驳回;3 审核中;4 客户确认中;5 客户已确认;
  resetQuery() 
})


//状态修改
function handleStatusChange(row) {
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

const editfn = (is,id,procId,type,Nid,m='') => {
  istype.value=is
  processParentId.value=id
  ctype.value=type
  nid.value=Nid
  if(type=='project_design_order'||type=='bulk_design_prod_order'){
    if(type=='project_design_order'){
      getcrmprojectdesignorderprocid(id).then(res=>{
        if(res.code===200){
          drawer.value = true
          detaildata.value=res.data
        }
      })
      .catch(err=>{
        detaildata.value=null
      })
    }
    if(type=='bulk_design_prod_order'){
      bulkDesignProdOrderProc(id).then((res) => {
        if(res.code===200){
          drawer.value = true
          detaildata.value=res.data
        }
      })
      bulkAllData(id,{orderType:type}).then((res) => {
        bgoodsdata.value = res.data
      })
    } 
    
  }else if(type=='bulk_order'){
    bulkOrderProc(id).then((res) => {
      drawer.value = true
      detaildata.value=res.data
    })
    bulkAllData(id,{orderType:type}).then((res) => {
      bgoodsdata.value = res.data
      // console.log(res,'22');
    })
  }
  getSubmitGeneralAccountStatement(procId).then(res=>{
    if(res.code===200){
      rejdata.value=res.data
    }
  })
  .catch(err=>{
    rejdata.value=null
  })
  //打样流程
  proofingProcOrder(id,{orderType:type}).then(res=>{
    prodata.value=res.data
  }) 
  
  
};
function cancelClick() {
  getList(cpagestatus.value)
  drawer.value = false;
}
function confirmClick(flag) {
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
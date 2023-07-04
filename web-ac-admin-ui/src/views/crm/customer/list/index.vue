<template>
  <div>
    <el-card style="margin: 10px">
      <el-form inline :model="formData" class="ditem-form-inline" label-width="130px" ref="queryRef">
        <el-form-item label="客户信息:" prop="customerInfo">
          <el-input v-model="formData.customerInfo" placeholder="请输入客户编号/客户名称" clearable style="width: 252px" />
        </el-form-item>
        <el-form-item label="归属部门:" prop="acDataSepDeptId">
          <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled"
            @change="changeDept" style="width:252px;">
            <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务经理:" prop="businessStaffId">
          <el-select :disabled="isSaleman" v-model="formData.businessStaffId" placeholder="所有业务员" clearable filterable
            style="width: 252px">
            <el-option v-for="item in salesmanList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="绑定业务经理状态:" prop="bindingStatus">
          <el-select v-model="formData.bindingStatus" placeholder="所有类别" clearable filterable style="width: 252px">
            <el-option v-for="item in crm_custom_bind_status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户状态:" prop="customerStatus">
          <el-select v-model="formData.customerStatus" placeholder="所有类别" clearable filterable style="width: 252px">
            <el-option v-for="item in crm_custom_status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="账期申请状态:" prop="accountApplicationStatus">
          <el-select v-model="formData.accountApplicationStatus" placeholder="所有状态" clearable filterable style="width: 252px">
            <el-option v-for="item in crm_account_apply_status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户建档日期:">
          <el-date-picker v-model="datePicker" type="daterange" range-separator="→" start-placeholder="开始日期"
            end-placeholder="结束日期" style="width: 252px"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="btnBox">
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </el-card>
    <el-card style="margin: 10px">
      <div class="tool-bar">
        <div>客户信息列表</div>
        <div>
          <!-- <el-button @click="exportExcel">导出</el-button> -->
          <el-button @click="newCustomer">新增客户</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading" row-key="id">
        <el-table-column label="客户编号" width="180">
          <template #default="scope">
            <span @click="clickCopy(scope.row.customerNumber)">{{ scope.row.customerNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称">
          <template #default="scope">
            {{ scope.row.customerName }}
          </template>
        </el-table-column>
        <el-table-column label="账期申请状态" >
          <template #default="scope">
            <DictTag :value="scope.row.accountApplicationStatus" :options="crm_account_apply_status"></DictTag>
          </template>
        </el-table-column>
        <el-table-column label="建档日期">
          <template #default="scope">
            <div>{{ scope.row.customerEntryDate || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="绑定业务经理" >
          <template #default="scope">
            <div>{{ scope.row.bindingBusinessStaffName || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template #default="scope">
            <DictTag :value="scope.row.customerStatus" :options="crm_custom_status"></DictTag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-link :underline="false" type="primary" @click="showCustomerDetail(scope.row.id)">
              详情
            </el-link>
            <el-link style="margin-left: 8px;" v-if="scope.row.auditing&&scope.row.accountApplicationStatus!='1'" :underline="false" type="primary" @click="showCustomerDetail(scope.row.id,true)">
              提审详情
            </el-link>
            <el-link v-if="scope.row.accountApplicationStatus=='1'" :underline="false" type="primary" @click="apply(scope.row.id)" style="margin-left: 8px;">
              申请账期
            </el-link>
            <el-link :underline="false" type="primary" @click="modifyCustomerDetail(scope.row.id)" style="margin-left: 8px">修改信息</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" style="position: relative">
        <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
          @pagination="getList" :total="total" v-model:limit="formData.size" :pageSizes="[20, 30, 50, 100]" />
      </div>
    </el-card>
    <el-dialog v-model="dialogVisible" title="新增客户" width="900px" :before-close="handleClose" destroy-on-close>
      <el-form :model="customer" label-width="160px" ref="addRef" :rules="customerRuls">
        <el-form-item label="客户分类:" prop="customerClassify">
          <el-select v-model="customer.customerClassify" placeholder="请选择客户企业性质" style="width: 252px" filterable @change="changeCustomerClassify">
            <el-option v-for="item in crm_custom_type" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称:" prop="customerName">
          <div><el-input v-model="customer.customerName" :maxlength="customer.customerClassify == 2?10:50" show-word-limit style="width: 252px" /></div>
        </el-form-item>
        <el-form-item v-if="customer.customerClassify == 1" label="统一社会信用代码："
          prop="unifiedSocialCreditCode">
          <div style="display: flex;align-items:flex-start;">
            <el-input v-model="customer.unifiedSocialCreditCode" maxlength="30" placeholder="请输入统一社会信用代码" show-word-limit
              type="text" style="min-width: 252px;width: 252px;margin-right: 10px;" />
            <ImageUpload v-model="customer.unifiedSocialCreditCodeFileRichText"></ImageUpload>
          </div>
        </el-form-item>

        <el-form-item v-if="customer.customerClassify == 2" label="客户身份证号码：" prop="customerIdNumber">
          <div style="width:100%; display: flex;align-items:flex-start;">
            <el-input v-model="customer.customerIdNumber" maxlength="18" placeholder="请输入客户身份证号码" show-word-limit
              type="text" style="min-width: 252px;width: 252px;margin-right: 10px;" />
            <ImageUpload v-model="customer.customerIdNumberFileRichText"></ImageUpload>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addCustomer()">
            仅提交客户建档
          </el-button>
          <el-button type="primary" @click="addCustomer('more')">
            提交客户建档并申请账期
          </el-button>
        </span>
      </template>
    </el-dialog>
    <customerDialog v-if="customerVisible" :customer="customerInfo" :edit="edit" :dialogType="dialogType" :applyId="applyId" @closeDialog="closeDialog"></customerDialog>
  </div>
</template>

<script setup>
import { getCustomerList,getCrmCustomer,newCrmCustomer } from "@/api/crm/customer/newIndex"
import {
  GetCustomer,
  GetCustomerid,
  setenabled,
  exportCustomer,
customerDetail
} from "@/api/orderManagement/customer/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDate, formatDates, LastThreeMonths2 } from "@/utils";
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
import { parseTime } from "@/utils/ruoyi"
import useCrmOption from "@/store/modules/crmSelectOption"
import { useRouter } from "vue-router";
import customerDialog from "./components/customerDialog.vue"

const option = useCrmOption()
const salesmanList = computed(() => option.salesmanList)
const [isSaleman, userId] = useIsCrmSaleman("crmCustomerBusinessStaff");
const deptList = computed(() => option.deptList)
const deptDisabled = ref(false)
const { proxy } = getCurrentInstance();
const router = useRouter()
const { 
  crm_customercategory, 
  crm_acColumn, 
  crm_custom_type,
  crm_custom_bind_status,
  crm_custom_status,
  crm_account_apply_status
 } = proxy.useDict(
  "crm_customercategory",
  "crm_acColumn",
  "crm_custom_type",
  "crm_custom_bind_status",
  "crm_custom_status",
  "crm_account_apply_status"
);
const data = reactive({
  formData: {
    current: 1,
    size: 20,
    customerInfo: null, //客户信息
    acDataSepDeptId: null,//部门
    businessStaffId: isSaleman ? userId : '', //业务员id
    bindingStatus: null, //绑定业务经理状态
    customerStatus: null, //客户状态
    accountApplicationStatus:null,//账期申请状态
    customerEntryStartDate: LastThreeMonths2()[0], //客户建档日期开始日期
    customerEntryDateEndDate: LastThreeMonths2()[1], //客户建档日期结束日期
  },
  customer: {
  customerClassify: '',//客户分类
  customerName: '',//客户名称
  unifiedSocialCreditCode: '',//统一社会信用代码
  customerIdNumber: '',//身份证号
  unifiedSocialCreditCodeFileRichText: '',//身份证号附件
  customerIdNumberFileRichText: '',//统一社会信用代码附件
},
  customerInfo:{},
});
const datePicker = ref(LastThreeMonths2());
const { formData, customer, customerInfo } = toRefs(data);
const tableData = ref([]);
const loading = ref(false);
const total = ref(0);
const dialogVisible = ref(false)
const customerVisible = ref(false)
const edit = ref(false)
const dialogType = ref('view')

const acDataSepDeptId = ref('')
const applyId = ref('')
option.setDeptId(formData.value.acDataSepDeptId);
option.getDept().then(res => {
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
})
watch(crm_acColumn, (val) => {
  formData.value.acColumn = val.find(item => { return item.label == "acColumn" }).value
})
if (crm_acColumn.value.length > 0) {
  formData.value.acColumn = crm_acColumn.value.find(item => { return item.label == "acColumn" }).value
}
watch(dialogVisible,(val)=>{
  if (!val) {
    proxy.$refs["addRef"].resetFields()
  }
})
const customerRuls = reactive({
  customerClassify: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
  ],
  unifiedSocialCreditCode: [
    {
      required: true,
      message: '请输入统一社会信用代码',
      trigger: 'blur',
    },
  ],
  customerIdNumber: [
    {
      required: true,
      message: '请输入身份证号',
      trigger: 'blur',
    },
  ],
})
function changeDept(val) {
  option.setDeptId(val)
  formData.value.businessStaffId = null
}
//根据id获取客户详细信息
function getCustomerDetail(id,isAuditing){
  getCrmCustomer(id).then(res=>{
    if (res.code==200) {
      if(isAuditing) {
        customerInfo.value = res.data.newsetApplyDetail.deptAfter
        applyId.value = res.data.newsetApplyDetail.id
      }else{
        customerInfo.value = res.data
      }
      
      if (!res.data.management) {
        customerInfo.value.management = {
          "areaBrandAwareness": "",
          "countryClassification": "",
          "countryClassificationFileRichText": "",
          "countryName": "",
          "createBy": "",
          "createTime": "",
          "customerId": "",
          "customerManagementType": "",
          "customerSoldBrand": "",
          "deleted": true,
          "establishmentYearTime": null,
          "establishmentYearTimeFileRichText": "",
          "establishmentYears": null,
          "id": "",
          "industryBrandAwareness": "",
          "mainCustomerList": "",
          "mainCustomerListFileRichText": "",
          "previousYearSalesAmount": null,
          "updateBy": "",
          "updateTime": "",
          "yearSalesAmountFileRichText": ""
        }
      }
      // customerInfo.value.baseInfo.customerCreditQuota = res.data.baseInfo?.customerCreditQuota * 10000
      // customerInfo.value.management.previousYearSalesAmount = res.data.management?.previousYearSalesAmount * 10000
      // customerInfo.value.baseInfo.packagingDemandScale = res.data.baseInfo?.packagingDemandScale * 10000
      // customerInfo.value.baseInfo.registeredCapitalPaidAmount = res.data.baseInfo?.registeredCapitalPaidAmount * 10000
      // customerInfo.value.baseInfo.mortgagedAmount = res.data.baseInfo?.mortgagedAmount * 10000
      // customerInfo.value.baseInfo.customerFixedAssetsValuation = res.data.baseInfo?.customerFixedAssetsValuation * 10000
      // customerInfo.value.baseInfo.customerOwnedPropertyValuation = res.data.baseInfo?.customerOwnedPropertyValuation * 10000
      customerVisible.value = true
      if (dialogType.value != 'view'&&dialogType.value != 'viewApply') {
        edit.value = true
      }else{
        edit.value = false
      }
    }
  })
}
function closeDialog(){
  customerVisible.value = false
  getList()
}
//查看客户信息
function showCustomerDetail(id,isAuditing){
  if (isAuditing) {
    dialogType.value = 'viewApply'
  } else {
    dialogType.value = 'view'
  }
  getCustomerDetail(id,isAuditing)
}
//修改客户信息
function modifyCustomerDetail(id){
  dialogType.value = 'change'
  getCustomerDetail(id)
}
//申请账期
function apply(id){
  dialogType.value = 'apply'
  getCustomerDetail(id)
}
/** 重置按钮操作 */
function resetQuery() {
  data.formData = {
    current: 1,
    size: 20,
    customerInfo: null, //客户信息
    acDataSepDeptId: acDataSepDeptId.value,//部门
    businessStaffId: isSaleman ? userId : '', //业务员id
    bindingStatus: null, //绑定业务经理状态
    customerStatus: null, //客户状态
    accountApplicationStatus:null,//账期申请状态
    customerEntryStartDate: LastThreeMonths2()[0], //客户建档日期开始日期
    customerEntryDateEndDate: LastThreeMonths2()[1], //客户建档日期结束日期
  };
  datePicker.value = LastThreeMonths2();
  getList();
  // search();
}
//搜索
function search() {
  formData.value.current = 1; //页码
  formData.value.size = 20; //分页大小
  if (datePicker.value?.length > 0) {
    formData.value.customerEntryStartDate =
      formatDates(datePicker.value[0]) + " 00:00:00";
    formData.value.customerEntryDateEndDate =
      formatDates(datePicker.value[1]) + " 23:59:59";
  } else {
    formData.value.customerEntryStartDate =
      formData.value.customerEntryDateEndDate = null;
  }
  getList();
  // console.log("fff", formData.value);
}
getList();
function getList() {
  getCustomerList(formData.value)
    .then((res) => {
      tableData.value = res.data.records.map(e => {
        if (e.cooperativeServices) {
          e.cooperativeServices = e?.cooperativeServices.split(',')
        }
        return e
      });
      total.value = res.data.total;
      // console.log('GET分页查询订单', data.tabList)
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
}
function exportExcel() {
  if (!tableData.value?.length) {
    ElMessage.error('暂无数据导出')
    return
  }
  exportCustomer(formData.value, `客户列表${parseTime(new Date(), '{y}{m}{d}{h}{i}')}.xlsx`)
}
const handleStatusChange2 = (row) => {
  // console.log("row", row);

  return new Promise((resolve, reject) => {
    setenabled({
      enabled: !row.enabled,
      id: row.id,
    }).then((res) => {
      if (res.code === 200) {
        ElMessage({
          message: "成功",
          type: "success",
        });
        return resolve(true);
      } else {
        ElMessage({
          message: "设置失败",
          type: "error",
        });
        return reject(true);
      }
    });
  });
};

const clickCopy = (text) => {
  const save = function (evn) {
    evn.clipboardData.setData("text/plain", text);
    evn.preventDefault();
  };
  document.addEventListener("copy", save);
  document.execCommand("copy");
  ElMessage({
    message: "复制成功",
    type: "success",
  });
};

//打开新增客户弹窗
function newCustomer(data) {
  dialogVisible.value = true
  dialogType.value = 'add'
}
//关闭弹窗
const handleClose = (done) => {
  done()
}
const dialogForm = ref(null)
//新增客户
function addCustomer(more) {
  proxy.$refs["addRef"].validate(valid => {
    if (valid) {
      newCrmCustomer(customer.value).then(res=>{
        if (res.code==200) {
          if (more) {
            getCustomerDetail(res.data)
          }else{
            getList();
          }
        }
      }).finally(()=>{
        dialogVisible.value = false
      })      
    }
  })
}
function changeCustomerClassify(){
  customer.value.unifiedSocialCreditCode = null
  customer.value.unifiedSocialCreditCodeFileRichText = null
  customer.value.customerIdNumber = null
  customer.value.customerIdNumberFileRichText = null
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

:deep(.component-upload-image .el-upload--picture-card) {
  --el-upload-picture-card-size: 80px
}

:deep(.component-upload-image .is-success) {
  width: 80px;
  height: 80px;
}
</style>

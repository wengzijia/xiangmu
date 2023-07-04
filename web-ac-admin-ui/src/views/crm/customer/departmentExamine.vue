<template>
  <div>
    <list-layout>
      <template #header>
        <div class="top-bar" style="display: flex">
          <el-form
            inline
            :model="formData"
            class="demo-form-inline"
            label-width="120px"
            ref="queryRef"
          >
            <el-form-item label="客户信息" prop="customerInfo">
              <el-input
                v-model="formData.customerInfo"
                placeholder="请输入客户编号/客户名称"
                clearable
                style="width: 252px"
              />
            </el-form-item>
            <el-form-item label="申请部门" prop="acDataSepDeptId">
              <el-select
                v-model="formData.acDataSepDeptId"
                placeholder="所有部门"
                clearable
                :disabled="deptDisabled"
                @change="changeDept"
                style="width: 252px"
              >
                <el-option
                  v-for="item in option.deptList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="申请人" prop="bindingBusinessStaffId">
              <el-select
                :disabled="isSaleman"
                v-model="formData.applicantId"
                placeholder="所有业务经理"
                clearable
                filterable
                style="width: 252px"
              >
                <el-option
                  v-for="item in option.salesmanList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态" prop="customerGrading">
              <el-select
                v-model="formData.flag"
                class="m-2"
                placeholder="所有状态"
                style="width: 252px"
              >
                <el-option label="待审批" :value="false" />
                <el-option label="已审批" :value="true" />
              </el-select>
            </el-form-item>

            <el-form-item label="申请时间">
              <datePicker
                dateType="daterange"
                :isAddTime="true"
                :width="252"
                v-model:startTime="formData.deptAppleTimeStart"
                v-model:endTime="formData.deptAppleTimeEnd"
                :dateRange="30"
              ></datePicker>
            </el-form-item>
          </el-form>
          <div class="btnBox">
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="primary" @click="getList">搜索</el-button>
          </div>
        </div>
      </template>
      <template #table-header> 部门审批列表 </template>
      <template #table-content="scoped">
        <el-table
          :height="scoped.tableHeight"
          :data="tableData"
          style="width: 100%"
          row-key="id"
        >
          <el-table-column prop="customerNumber" label="客户编号" width="180" />
          <el-table-column prop="customerName" label="客户名称" />
          <el-table-column label="申请类型">
            <template #default="scope">
              <DictTag
                style="display: inline-block"
                :value="scope.row.applyType"
                :options="crm_custom_apply_type"
              />
            </template>
          </el-table-column>
          <el-table-column label="申请业务经理" width="140">
            <template #default="scope">
              <div>{{ scope.row.applicantName || "-" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" width="200">
            <template #default="scope">
              <div>{{ formatDate(scope.row.deptAppleTime) || "-" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="审批时间" width="200">
            <template #default="scope">
              <div>{{ formatDate(scope.row.deptApprovalTime) || "-" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template #default="scope">
              <DictText
                :value="scope.row.deptApprovalStatus"
                dict="crm_audit_status"
              ></DictText>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" v-if="tableType == 1">
            <template #default="scope">
              <el-link
                v-hasRole="['crmDeptManager']"
                :underline="false"
                type="primary"
                @click="getApplyDept(scope.row.id)"
                style="margin-left: 8px"
                >审核</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pagination>
        <pagination
          style="margin-top: 0; height: auto"
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-model:page="formData.current"
          @pagination="getList"
          :total="total"
          v-model:limit="formData.size"
          :pageSizes="[10, 20, 50, 100]"
        />
      </template>
    </list-layout>
    <el-dialog
      :title="dialogTitle"
      append-to-body
      v-model="showEdit"
      :width="customerInfo.applyType == 1 ? '920px' : '1840px'"
      top="50px"
      destroy-on-close
    >
      <el-tabs
        v-model="tabsActiveName"
        type="card"
        class="demo-tabs"
        @tab-click="getContactsList"
      >
        <el-tab-pane label="基本信息" name="basicInformation">
          <div
            :style="
              customerInfo.applyType == 2 ? 'height: 500px;overflow: auto;' : ''
            "
          >
            <div style="display: flex">
              <div
                v-if="customerInfo.applyType == 2 && resetInfo"
                style="flex: 1; margin: 0 10px"
              >
                <div class="basic-information-title">修改前</div>
                <basicInformation
                  :scroll="false"
                  v-model:customer="customerInfo.businessBefore"
                  :edit="false"
                  :creditQuotaEdit="false"
                ></basicInformation>
              </div>
              <div
                v-if="resetInfo"
                style="flex: 1; margin: 0 10px; overflow: hidden"
              >
                <div
                  class="basic-information-title"
                  v-if="customerInfo.applyType == 2"
									style='background-color: #95f204;'
                >
                  修改后
                </div>
                <basicInformation
                  :scroll="customerInfo.applyType == 1"
                  :beforeData="customerInfo.businessBefore"
                  v-model:customer="customerInfo.businessAfter"
                  :edit="false"
                  :creditQuotaEdit="true"
                  :applyId="customerInfo.id"
                >
                </basicInformation>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="联系信息" name="contacts">
          <div style="width: 920px">
            <contacts
              v-if="
                tabsActiveName == 'contacts' &&
                resetInfo &&
                customerBaseInfo.contactsList
              "
              v-model:customer="customerBaseInfo"
              :edit="false"
            ></contacts>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div
        style="display: flex; justify-content: space-between; padding: 10px 0"
      >
        <div>
          <!-- <el-button type='success'>同意业务经理绑定该客户</el-button> -->
        </div>
        <div>
          <el-button type="warning" @click="applyDept(false)"
            >退回修改</el-button
          >
          <el-button @click="resetInfoFun" v-if="customerInfo.applyType == 1"
            >取消本次编辑</el-button
          >
          <el-button type="primary" @click="applyDept(true)"
            >提交审批</el-button
          >
        </div>
      </div></el-dialog
    >
  </div>
</template>

<script setup>
import {
  getApplyDeptList,
  getCrmCustomerApply,
  getCrmCustomerApplyDept,
  getCrmCustomer,
} from "@/api/crm/customer/newIndex";
import useCrmOption from "@/store/modules/crmSelectOption";
import datePicker from "@/components/datePicker/index";
import {
  debounce,
  formatDate,
  formatDates,
  LastThreeMonths,
  LastThreeMonths2,
  crmChangePrice,
} from "@/utils";
import { ElMessage, ElLoading } from "element-plus";
import basicInformation from "@/views/crm/customer/list/components/basicInformation.vue";
import contacts from "@/views/crm/customer/list/components/contacts.vue";
const option = useCrmOption();
const acDataSepDeptId = ref("");
const deptDisabled = ref(false);
const isSaleman = ref(false);
const { proxy } = getCurrentInstance();
const { crm_audit_status, crm_custom_apply_type, crm_saleman, crm_acColumn } =
  proxy.useDict(
    "crm_audit_status",
    "crm_custom_apply_type",
    "crm_saleman",
    "crm_acColumn"
  );
option
  .getDept()
  .then((res) => {
    // if (res?.data) {
    //   formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    //   deptDisabled.value = true
    // }else{
    //   formData.value.acDataSepDeptId = option.deptList[0].id
    // }
    changeDept(formData.value.acDataSepDeptId);
  })
  .finally(() => {});



function changeDept(val) {
  option.setDeptId(val);
  console.log("option.deptList", option.deptList);
  formData.value.bindingBusinessStaffId = null;
  getList();
}
let fromOrgin = {
  flag: false, // 是否审核完成
  acDataSepDeptId: "", //部门id
  acColumn: "", //部门id
  customerInfo: "", //部门id
  bindingBusinessStaffId: "", //bindingBusinessStaffId
  deptAppleTimeStart: "", //部门id
  deptAppleTimeEnd: "", //部门id
  deptApprovalStatus: "", //部门id
  acDataSepDeptId: "", //部门id
  current: 1, // 页数
  size: 20, // 每页条数
};
const formData = ref({
  ...fromOrgin,
});
watch(crm_acColumn, (val) => {
  formData.value.acColumn = val.find((item) => {
    return item.label == "acColumn";
  }).value;
});
if (crm_acColumn.value.length > 0) {
  formData.value.acColumn = crm_acColumn.value.find((item) => {
    return item.label == "acColumn";
  }).value;
}
const total = ref(0); //表格的总数

// 重置数据
function resetQuery() {
  formData.value = { ...fromOrgin };
  getList();
}

let tableData = ref([]);
let tableType = ref("1");
let getList = () => {
  tableType.value = !formData.value.flag ? 1 : 2;
  getApplyDeptList(formData.value).then((res) => {
    console.log("getList", res);
    tableData.value = res.data.records;
    total.value = res.data.total;
  });
};

const tabsActiveName = ref("basicInformation");
const dialogTitle = ref("");
function getApplyDept(id) {
  tabsActiveName.value = "basicInformation";
  getCrmCustomerApply(id).then((res) => {
    if (!res.data.management) res.data.management = {};
    res.data.businessAfter = crmChangePrice(res.data.businessAfter, "cu");
    if (res.data.applyType == 1) {
      dialogTitle.value = "审核申请账期";
      res.data.businessBefore = {};
    } else {
      dialogTitle.value = "审核修改信息";
      res.data.businessBefore = crmChangePrice(res.data.businessBefore, "cu");
    }

    customerInfo.value = res.data;
    showEdit.value = true;
    resetInfo.value = true;
  });
}

const showEdit = ref(false);
const customerInfo = ref({});
const applyDept = debounce((flag) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "数据提交中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  getCrmCustomerApplyDept({
    baseInfo: {
      customerCreditQuota: crmChangePrice(
        Number(customerInfo.value.businessAfter.baseInfo.customerCreditQuota)
      ),
      moreSettlementMethodId:
        customerInfo.value.businessAfter.baseInfo.moreSettlementMethodId,
    },
    flag,
    id: customerInfo.value.id,
  }).then((res) => {
    showEdit.value = false;
    if (res.code == 200) {
      getList();
      if(flag){
        ElMessage.success("审批通过成功");
      } else{
        ElMessage.error("退回修改成功");
      }
      
    }
    loadingInstance.close();
  });
}, 200);

const resetInfo = ref(true);
// 取消本次编辑，重置信息
const resetInfoFun = function () {
  resetInfo.value = false;
  getApplyDept(customerInfo.value.id);
};

const contactsList = ref([]); //联系信息
const customerBaseInfo = ref({});
const getContactsList = () => {
  getCrmCustomer(customerInfo.value.customerId).then((res) => {
    console.log("customerInfo.value.id", customerInfo.value.id);
    customerBaseInfo.value = res.data;
  });
};
</script>

<style scoped lang="scss">
.header-form {
  flex: 1;
}
.btnBox {
  // flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  .el-button {
    margin: 0;
    margin-bottom: 18px;
    margin-left: 18px;
  }
}
.basic-information-title{
	background-color: #80ffff;
	text-align: center;
	// color: #fff;
	font-size: 16px;
	padding: 10px;
}
</style>

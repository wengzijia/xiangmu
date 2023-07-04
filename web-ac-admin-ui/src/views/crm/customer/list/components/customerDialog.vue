<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title=""
      width="960px"
      destroy-on-close
      :before-close="handleClose"
    >
      <div>
        <el-tabs
          v-model="activeName"
          type="card"
          style="height: 70vh; min-height: 360px"
          :before-leave="beforeLeave"
        >
          <el-tab-pane v-if="!(dialogType=='change'&&(customer.auditing||customer.accountApplicationStatus=='1'))" label="基本信息" name="1">
            <basicInformation
              v-if="activeName == '1'"
              :edit="edit"
              v-model:customer="customerForm"
              @isChange="isChange"
              :dialogType="dialogType"
              :applyId="customerForm.newsetApplyDetail?.id||applyId"
            ></basicInformation>
          </el-tab-pane>
          <el-tab-pane v-if="dialogType!='apply'" label="联系信息" name="2">
            <contacts
              v-if="activeName == '2'"
              :edit="edit"
              v-model:customer="customerForm"
              @isChange="isChange"
            ></contacts>
          </el-tab-pane>
          <!-- 下一期再做 -->
          <!-- <el-tab-pane label="开票信息" name="3"  @isChange="isChange">
                        <invoice :edit="edit" :customer="customerForm"></invoice>
                    </el-tab-pane>
                    <el-tab-pane label="收货信息" name="4"  @isChange="isChange">
                        <addressInfo :edit="edit" :customer="customerForm"></addressInfo>
                    </el-tab-pane> -->
        </el-tabs>
      </div>
      <template #footer>
        <span v-if="activeName == '1' && edit" class="dialog-footer">
          <el-button @click="cancel(true)">取消本次编辑</el-button>
          <el-button type="primary" @click="submitApproval">提交审批</el-button>
        </span>
        <span v-if="activeName == '2' && edit">
          <el-button @click="cancel(true)">取消本次编辑</el-button>
          <el-button type="primary" @click="submitContacts"
            >保存本次编辑</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import basicInformation from "./basicInformation.vue";
import contacts from "./contacts.vue";
import invoice from "./invoice.vue";
import addressInfo from "./addressInfo.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { modifyCrmCustomer } from "@/api/crm/customer/newIndex";
import { checkPhone } from "@/utils/form";

const props = defineProps({
  //客户信息
  customer: {
    type: Object,
    default: {},
  },
  //是否可编辑
  edit: {
    type: Boolean,
    default: false,
  },
  //弹窗类型
  dialogType: {
    type: String,
    default: "view",
  },
  applyId:{
    type: String,
    default: "",
  }
});
const data = reactive({
  customerForm: {},
  oldCustomerForm: {},
});
const { proxy } = getCurrentInstance();
const { customerForm, oldCustomerForm } = toRefs(data);
let obj = props.customer;
obj.baseInfo.customerCreditQuota =  props.customer.baseInfo.customerCreditQuota / 10000;
obj.management.previousYearSalesAmount = props.customer.management
  ?.previousYearSalesAmount
  ? props.customer.management.previousYearSalesAmount / 10000
  : null;
obj.baseInfo.packagingDemandScale = props.customer.baseInfo
  ?.packagingDemandScale
  ? props.customer.baseInfo.packagingDemandScale / 10000
  : null;
obj.baseInfo.registeredCapitalPaidAmount = props.customer.baseInfo
  ?.registeredCapitalPaidAmount
  ? props.customer.baseInfo.registeredCapitalPaidAmount / 10000
  : null;
obj.baseInfo.mortgagedAmount = props.customer.baseInfo?.mortgagedAmount
  ? props.customer.baseInfo.mortgagedAmount / 10000
  : null;
obj.baseInfo.customerFixedAssetsValuation = props.customer.baseInfo
  ?.customerFixedAssetsValuation
  ? props.customer.baseInfo.customerFixedAssetsValuation / 10000
  : null;
obj.baseInfo.customerOwnedPropertyValuation = props.customer.baseInfo
  ?.customerOwnedPropertyValuation
  ? props.customer.baseInfo.customerOwnedPropertyValuation / 10000
  : null;
customerForm.value = obj;
oldCustomerForm.value = JSON.parse(JSON.stringify(props.customer));
const dialogVisible = ref(true);
const tabsDisabled = ref(false); //禁止tabs切换
const emit = defineEmits();
const activeName = ref("1");
if (props.dialogType=='change'&&(props.customer.auditing||props.customer.accountApplicationStatus=='1')) {
  activeName.value = '2'
}
watch(dialogVisible, (val) => {
  if (!val) {
    emit("closeDialog");
  }
});
const handleClose = (done) => {
  if (!props.edit) {
    done();
    return;
  }
  ElMessageBox.confirm("确定放弃修改并关闭弹窗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      done();
    })
    .catch(() => {});
};
const params = {
  addressList: [],
  baseInfo: {},
  baseInfoUpdated: null,
  contactsList: [],
  id: 0,
  invoiceList: [],
  management: {},
  soldTypeList: [],
};
function submit() {
  let obj = {};
  for (let key in params) {
    let val = null;
    try {
      val = JSON.parse(JSON.stringify(customerForm.value[key]));
    } catch (error) {
      val = customerForm.value[key];
    }
    obj[key] = val;
  }
  

  if ( customerForm.value.management.establishmentYearTime) {
    obj.management.establishmentYearTime = Number(new Date(customerForm.value.management.establishmentYearTime).getFullYear())||null
  }else{
    obj.management.establishmentYearTime = null
  }
  obj.baseInfo.customerCreditQuota =
    customerForm.value.baseInfo.customerCreditQuota * 10000;
  obj.management.previousYearSalesAmount = customerForm.value.management
    ?.previousYearSalesAmount
    ? customerForm.value.management.previousYearSalesAmount * 10000
    : null;
  obj.baseInfo.packagingDemandScale = customerForm.value.baseInfo
    ?.packagingDemandScale
    ? customerForm.value.baseInfo.packagingDemandScale * 10000
    : null;
  obj.baseInfo.registeredCapitalPaidAmount = customerForm.value.baseInfo
    ?.registeredCapitalPaidAmount
    ? customerForm.value.baseInfo.registeredCapitalPaidAmount * 10000
    : null;
  obj.baseInfo.mortgagedAmount = customerForm.value.baseInfo?.mortgagedAmount
    ? customerForm.value.baseInfo.mortgagedAmount * 10000
    : null;
  obj.baseInfo.customerFixedAssetsValuation = customerForm.value.baseInfo
    ?.customerFixedAssetsValuation
    ? customerForm.value.baseInfo.customerFixedAssetsValuation * 10000
    : null;
  obj.baseInfo.customerOwnedPropertyValuation = customerForm.value.baseInfo
    ?.customerOwnedPropertyValuation
    ? customerForm.value.baseInfo.customerOwnedPropertyValuation * 10000
    : null;
  //基础信息是否发生修改
  if (!obj.baseInfoUpdated) {
    obj.baseInfoUpdated = false;
  }
  proxy.$modal.loading("正在提交数据，请稍候...");
  modifyCrmCustomer(obj)
    .then((res) => {
      if (res.code == 200) {
        dialogVisible.value = false;
      }
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
}
//提交审批
function submitApproval() {
  if (!customerForm.value.baseInfo?.moreSettlementMethodId) {
    ElMessage.error("请选择申请账期");
    return;
  }
  // if (!customerForm.value.baseInfo?.customerCreditQuota) {
  //   ElMessage.error("请填写申请授信额度");
  //   return;
  // }
  submit();
}
//是否修改了数据
function isChange(val) {
  tabsDisabled.value = val;
}
function beforeLeave(activeName, oldActiveName) {
  if (tabsDisabled.value) {
    return new Promise((resolve, reject) => {
      ElMessageBox.confirm("切换选项会放弃当前所有更改，是否放弃？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancel();
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  } else {
    return true;
  }
}
//取消编辑
function cancel(close) {
  customerForm.value = JSON.parse(JSON.stringify(oldCustomerForm.value));
  tabsDisabled.value = false;
  if (close) {
    dialogVisible.value = false;
  }
}
//保存联系信息
function submitContacts() {
  let flag = 0;
  if (customerForm.value.contactsList) {
    customerForm.value.contactsList.map((item, index) => {
      if ((!item.contactsName || !item.contactsPhone) && !flag) {
        flag = index + 1;
      }
    });
    let item = customerForm.value.contactsList.find( e=>{
      if(!checkPhone(e.contactsPhone)) return true
    })
    if(item){
      ElMessage.error(`请填写正确的电话号码`);
      return;
    }
    var phone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
    let cg = customerForm.value.contactsList.find( e=>{
      return  e.positionName=='采购岗'&&!phone.test(e.contactsPhone)
    })
    if(cg){
      ElMessage.error(`采购岗的联系号码必须是手机号`);
      return;
    }
    
  }
  if (flag) {
    ElMessage.error(`请完善联系人${flag}的信息`);
    return;
  }
  
  submit();
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  --el-dialog-margin-top: 50px;
}
</style>

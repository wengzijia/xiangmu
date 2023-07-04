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
          <el-select
            v-model="formData.acDataSepDeptId"
            placeholder="所有部门"
            clearable
            :disabled="deptDisabled"
            @change="changeDept"
            style="width: 252px"
          >
            <el-option
              v-for="item in deptList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务员:" prop="businessStaffId">
          <el-select
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

        <el-form-item label="订单信息:" prop="enabled">
          <el-input
            v-model="formData.orderInfo"
            placeholder="请输入订单编号/合同编号"
            clearable
            style="width: 252px"
          />
        </el-form-item>

        <el-form-item label="审核人:" prop="enabled">
          <el-select
            v-model="formData.financialAuditerId"
            placeholder="所有审核人"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option
              v-for="item in financialStaffList"
              :key="item.assigneeId"
              :label="item.assigneeName"
              :value="item.assigneeId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="提交时间:">
          <!-- <el-date-picker
						v-model="datePicker"
						type="datetimerange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 252px"
					></el-date-picker> -->
          <dateTimePicker
            ref="dateRef"
            :dateType="'datetimerange'"
            v-model:startTime="formData.paymentSubmitTimeStart"
            v-model:endTime="formData.paymentSubmitTimeEnd"
          >
          </dateTimePicker>
        </el-form-item>

        <el-form-item label="完结时间:">
          <!-- <el-date-picker
						v-model="datePicker2"
						type="datetimerange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 252px"
					></el-date-picker> -->
          <dateTimePicker
            ref="dateRef1"
            :dateType="'datetimerange'"
            :isThreeMonths="false"
            v-model:startTime="formData.financialAuditTimeStart"
            v-model:endTime="formData.financialAuditTimeEnd"
          >
          </dateTimePicker>
        </el-form-item>

        <!-- <el-form-item label="结算方式:" prop="enabled">
          <el-select
            v-model="formData.settlementMethod"
            placeholder="所有方式"
            clearable
            filterable
            style="width: 252px"
          >
            <el-option
              v-for="item in risklist?.more_settlement_method"
              :key="item.id"
              :label="item.optionDesc"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item label="尾款最晚日期:">
          <!-- <el-date-picker
						v-model="datePicker3"
						type="daterange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 252px"
					></el-date-picker> -->
          <dateTimePicker
            ref="dateRef2"
            :dateType="'datetimerange'"
            :isThreeMonths="false"
            v-model:startTime="formData.finalPaymentLatestDateStart"
            v-model:endTime="formData.finalPaymentLatestDateEnd"
          >
          </dateTimePicker>
        </el-form-item>
      </el-form>
      <div class="btnBox">
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </el-card>
    <el-card style="margin: 10px">
      <div class="tool-bar">
        <el-button @click="exportExcel">导出</el-button>
        <el-button
          type="primary"
          v-if="multipleSelection?.length"
          @click="editfn('3', multipleSelection[0])"
          >批量审核</el-button
        >
      </div>
      <el-table
        :data="tableData"
        ref="multipleTableRef"
        style="width: 100%"
        class="order"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
      >
        <el-table-column :selectable="selectable" :reserve-selection="true" type="selection" width="55" />
        <el-table-column prop="orderBusinessKey" label="订单编号" width="180" />

        <el-table-column label="合同编号" width="180">
          <template #header>
            合同编号
            <el-tooltip class="box-item" effect="dark" placement="bottom-end">
              <template #content
                >方案设计订单展示设计合同，<br />其他订单展示大货合同
              </template>
              <el-icon class="icons">
                <WarningFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <template #default="scope">
            <div>
              {{ scope.row.contractNo || "-" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="customerName" label="客户名称" width="180" />
        <el-table-column
          prop="orderTaxInclusiveTotalPrice"
          label="订单总价"
          width="180"
        >
          <template #default="scope">
            <div style="text-align: right; height: 100%; display: block">
              {{
                showMoney(
                  scope.row.orderTaxInclusiveTotalPrice
                    ? scope.row.orderTaxInclusiveTotalPrice
                    : "-"
                )
              }}
            </div>
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

        <el-table-column label="审核状态" width="140">
          <template #default="scope">
            <DictTag
              style="display: inline-block"
              :value="scope.row.financialAuditStatus"
              :options="crm_audit_status"
            />
          </template>
        </el-table-column>

        <el-table-column label="审核人" width="140">
          <template #default="scope">
            <div>{{ scope.row.financialAuditerName || "-" }}</div>
          </template>
        </el-table-column>

        <el-table-column label="提交时间" width="200">
          <template #default="scope">
            <div>
              {{ formatDate(scope.row.paymentSubmitTime) || "-" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="尾款最晚日期" width="200">
          <template #default="scope">
            <div>
              {{ formatDate(scope.row.finalPaymentLatestDate) || "-" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="完结时间" width="200">
          <template #default="scope">
            {{ formatDate(scope.row.financialAuditTime) || "-" }}
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-link
              v-if="scope.row.financialAuditStatus == 1"
              :underline="false"
              type="primary"
              @click="editfn('1', scope.row)"
              >审核</el-link
            >
            <el-link
              v-else
              :underline="false"
              type="info"
              @click="editfn('2', scope.row)"
              >查看</el-link
            >
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
      :title="istype === '1' ? '审核' : '审核结果'"
      direction="rtl"
      :before-close="handleClose"
      size="750px"
    >
      <template #default>
        <div>
          <drawerbox
            ref="newo"
            :istype="istype"
            :listdata="listdata"
            :detaildata="detaildata"
            :prodata="prodata"
            :bgoodsdata="bgoodsdata"
            :multipleSelection="multipleSelection"
            :risklist="risklist"
            @editfn="editfn"
            @cancelClick="cancelClick"
          >
          </drawerbox>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">{{
            istype == 1 ? "取消" : "关闭"
          }}</el-button>
          <el-button
            type="primary"
            @click="confirmClick(true)"
            v-if="istype == '1' || istype == '3'"
            >确定</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import dateTimePicker from "@/components/datePicker/index.vue";
import { reactive, toRefs } from "vue";
import drawerbox from "./components/drawer.vue";
import { formatDate, LastThreeMonths2 } from "@/utils";
import { parseTime } from '@/utils/ruoyi'
import useUserStore from "@/store/modules/user";
import {
  gradingCalculateConfig,
} from "@/api/orderManagement/customer/index";
import {
  FinancialAudit,
  getcrmprojectdesignorderprocid,
  exportFinancialAuditList,
} from "@/api/crm/order/contract";
import { bulkAllData } from "@/api/orderManagement/costComposition";
import {
  bulkDesignProdOrderProc,
  bulkOrderProc,
} from "@/api/orderManagement/subOrder";
import {ElMessage, ElMessageBox } from "element-plus";
import { proofingProcOrder } from "@/api/orderManagement/proofing";
import useCrmOption from "@/store/modules/crmSelectOption";
import { assigneeType } from "@/api/crm/finance/contract";
const option = useCrmOption();
const salesmanList = computed(() => option.salesmanList);
const financialStaffList = ref([]);
// option.getOptionList('crmCustomerBusinessStaff')
// option.getOptionList('crmFinancialStaff')
function getFinancialStaffList() {
  assigneeType(4).then((res) => {
    if (res.code == 200) {
      financialStaffList.value = res.data;
    }
  });
}
getFinancialStaffList();
const deptList = computed(() => option.deptList);
const deptDisabled = ref(false);

const { proxy } = getCurrentInstance();
const {
  crm_audit_status,
  // basic_approval_category,
  // crm_ContractPaginationStatus,
  crm_acColumn,
} = proxy.useDict(
  "crm_audit_status",
  // 'basic_approval_category',
  // 'crm_ContractPaginationStatus'
  "crm_acColumn"
);

const roles = computed(() => useUserStore().roles); //获取角色
const formData = ref({
  current: 1,
  size: 20,
  customerInfo: null, //客户信息
  orderInfo: null, //订单信息
  businessStaffId: null, //业务员id
  financialAuditerId: null, //审核人id
  settlementMethod: null, //结算方式
  paymentSubmitTimeStart: formatDate(LastThreeMonths2()[0]), //提交时间
  paymentSubmitTimeEnd: formatDate(LastThreeMonths2()[1]), //提交结束时间
  financialAuditTimeStart: null, //完结开始时间
  financialAuditTimeEnd: null, //完结结束时间
  finalPaymentLatestDateStart: null, //尾款开始时间
  finalPaymentLatestDateEnd: null, //尾款结束时间
  acColumn: null,
});
const drawer = ref(false);
const istype = ref("1");
const detaildata = ref(null);
const datePicker = ref(LastThreeMonths2());
const datePicker2 = ref([]);
const datePicker3 = ref([]);
const risklist = ref(null);
const tableData = ref([]);
const editdata = ref(null);
const loading = ref(false);
const total = ref(0);
const listdata = ref(null);
const prodata = ref(null);
const bgoodsdata = ref(null);
const drawerTitle = ref("新增客户");
const newo = ref(null);
const dateRef = ref(null);
const dateRef1 = ref(null);
const dateRef2 = ref(null);
const isSearch = ref(false);
const salesValue = ref("");
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
let dranum = ref(1);
const onSubmit = () => {
  console.log("submit!");
};
const multipleTableRef = ref(null);
const multipleSelection = ref(null);
function changeDept(val) {
  option.setDeptId(val);
  formData.value.businessStaffId = null;
}
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
const acDataSepDeptId = ref('')
option.setDeptId(formData.value.acDataSepDeptId);
option.getDept().then((res) => {
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true;
  }
}).finally(()=>{
  getList()
})
/** 重置按钮操作 */
function resetQuery() {
  // proxy.resetForm("formRef");
  dateRef.value.initTime(1);
  dateRef1.value.initTime();
  dateRef2.value.initTime();
  formData.value = {
    current: 1,
    size: 20,
    customerInfo: null, //客户信息
    orderInfo: null, //订单信息
    businessStaffId: null, //业务员id
    financialAuditerId: null, //审核人id
    settlementMethod: null, //结算方式
    paymentSubmitTimeStart: formatDate(dateRef.value.start), //提交时间
    paymentSubmitTimeEnd: formatDate(dateRef.value.end), //提交结束时间
    financialAuditTimeStart: null, //完结开始时间
    financialAuditTimeEnd: null, //完结结束时间
    finalPaymentLatestDateStart: null, //尾款开始时间
    finalPaymentLatestDateEnd: null, //尾款结束时间
    acColumn: crm_acColumn.value.find((item) => {
      return item.label == "acColumn";
    }).value,
    acDataSepDeptId:acDataSepDeptId.value
  };
  // datePicker.value = LastThreeMonths()
  // datePicker2.value = []
  // datePicker3.value = []
  // search();
}
watch(drawer,(val)=>{
  if (!val) {
    listdata.value = null
    detaildata.value = null
    prodata.value = null
    bgoodsdata.value = null
  }
})
//搜索
function search() {
  formData.value.current = 1 //页码
  // formData.value.size = 20 //分页大小
  // if (datePicker.value?.length > 0) {
  // 	formData.value.paymentSubmitTimeStart =
  // 		formatDate(datePicker.value[0])
  // 	formData.value.paymentSubmitTimeEnd =
  // 		formatDate(datePicker.value[1])
  // } else {
  // 	formData.value.paymentSubmitTimeStart =
  // 		formData.value.paymentSubmitTimeEnd = null
  // }
  // if (datePicker2.value?.length > 0) {
  // 	formData.value.financialAuditTimeStart =
  // 		formatDate(datePicker2.value[0])
  // 	formData.value.financialAuditTimeEnd =
  // 		formatDate(datePicker2.value[1])
  // } else {
  // 	formData.value.financialAuditTimeStart =
  // 		formData.value.financialAuditTimeEnd = null
  // }
  // if (datePicker3.value?.length > 0) {
  // 	formData.value.finalPaymentLatestDateStart =
  // 		formatDates(datePicker3.value[0]) + ' 00:00:00'
  // 	formData.value.finalPaymentLatestDateEnd =
  // 		formatDates(datePicker3.value[1]) + ' 23:59:59'
  // } else {
  // 	formData.value.finalPaymentLatestDateStart =
  // 		formData.value.finalPaymentLatestDateEnd = null
  // }
  isSearch.value = true;
  getList();
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
      // 判断没有点击筛选按钮时，之前填写的参数初始化
      // if (!isSearch.value) {
      //   dateRef.value.initTime(1);
      //   dateRef1.value.initTime();
      //   dateRef2.value.initTime();
      //   formData.value.customerInfo = null; //客户信息
      //   formData.value.orderInfo = null; //订单信息
      //   formData.value.businessStaffId = null; //业务员id
      //   formData.value.financialAuditerId = null; //审核人id
      //   formData.value.settlementMethod = null; //结算方式
      //   formData.value.paymentSubmitTimeStart = formatDate(
      //     dateRef.value.start
      //   ); //提交时间
      //   formData.value.paymentSubmitTimeEnd = formatDate(dateRef.value.end); //提交结束时间
      //   formData.value.financialAuditTimeStart = null; //完结开始时间
      //   formData.value.financialAuditTimeEnd = null; //完结结束时间
      //   formData.value.finalPaymentLatestDateStart = null; //尾款开始时间
      //   formData.value.finalPaymentLatestDateEnd = null; //尾款结束时间
      // }
      // if (formData.value.acColumn) {
        getList();
      // }
    },
    {
      // immediate: true,
      deep: true, //开启深度监听,能够侦听到对象属性值的变化
    }
  );
});

function getList() {
  FinancialAudit(formData.value)
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data.records;
        total.value = res.data.total;
      }
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
}
function exportExcel() {
	if(!tableData.value?.length){
		ElMessage.error('暂无数据导出')
		return
	}
  exportFinancialAuditList(formData.value, `订单确认审核列表${parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`);
}
const handleSelectionChange = (rows) => {
  // console.log("rows", rows);
  // if (rows.length&&rows[rows.length-1].financialAuditStatus==2) {
  // 	multipleTableRef.value.toggleRowSelection(rows[0], false)
  // 	return
  // }
  // if(rows[0].financialAuditStatus)
  if (rows.length && rows.length > 1) {
    let a = rows[0];
    let b = rows[rows.length - 1];
    if (b.contractNo != a.contractNo) {
      multipleTableRef.value.toggleRowSelection(b, false);
      return;
    }
  }
  multipleSelection.value = rows;
};

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
const draclick = (num) => {
  drawer.value = true;
};
gradingCalculateConfig().then((res) => {
  risklist.value = res.data;
});
const selectable = (row, index) => {
  if (row.financialAuditStatus == 1) {
    return true;
  }
};
const getRowKeys = (row) => {
  return row.id
}
const editfn = (is, e,han) => {
  istype.value = is;
  listdata.value = e;
  if(han){
		bgoodsdata.value=[]
		prodata.value=[]
	}
  // drawer.value = true
  if (
    e.parentProcType == "project_design_order" ||
    e.parentProcType == "bulk_design_prod_order"
  ) {
    if (e.parentProcType == "project_design_order") {
      getcrmprojectdesignorderprocid(e.processParentId)
        .then((res) => {
          if (res.code === 200) {
            drawer.value = true;
            detaildata.value = res.data;
          }
        })
        .catch((err) => {
          detaildata.value = null;
        });
    }
    if (e.parentProcType == "bulk_design_prod_order") {
      bulkDesignProdOrderProc(e.processParentId).then((res) => {
        if (res.code === 200) {
          drawer.value = true;
          detaildata.value = res.data;
        }
      });
      bulkAllData(e.processParentId, {
        orderType: e.parentProcType,
      }).then((res) => {
        bgoodsdata.value = res.data;
      });
    }
  } else if (e.parentProcType == "bulk_order") {
    bulkOrderProc(e.processParentId).then((res) => {
      drawer.value = true;
      detaildata.value = res.data;
    });
    bulkAllData(e.processParentId, { orderType: e.parentProcType }).then(
      (res) => {
        bgoodsdata.value = res.data;
      }
    );
  }
  //打样流程
  proofingProcOrder(e.processParentId, { orderType: e.parentProcType }).then(
    (res) => {
      prodata.value = res.data;
    }
  );
};
function cancelClick() {
  getList();
  multipleTableRef.value.clearSelection()
  drawer.value = false;
}
function confirmClick(flag) {
  newo.value.confirmClick();
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
  float: right;
}
:deep(.order .el-table__header-wrapper .el-checkbox) {
  display: none;
}
</style>

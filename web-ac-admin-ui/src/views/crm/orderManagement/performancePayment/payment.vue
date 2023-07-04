<template>
  <div>
    <listLayout :height="headHeight">
      <template #header class="artwork-workbench">
        <div class="top-bar subOrder">
          <el-form inline :model="formData" class="condition">
            <!-- 客户信息 -->
            <el-form-item label="客户信息:">
              <el-input
                style="width: 252px"
                clearable
                v-model="formData.customerInfo"
                placeholder="请输入客户编号/客户名称"
              />
            </el-form-item>
            <el-form-item label="归属部门:" prop="acDataSepDeptId">
              <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
                <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <!-- 业务员 -->

            <el-form-item label="业务员:">
              <el-select
                v-model="formData.businessStaffId"
                class="m-2"
                style="width: 252px"
                :disabled="isSaleman"
                placeholder="所有业务员"
                clearable
              >
                <el-option
                  v-for="item in salesmanList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>

            <!-- 订单生成时间 -->
            <el-form-item label="首付款最晚日期:">
              <el-date-picker
                style="width: 360px"
                v-model="firstPaymentTime"
                type="daterange"
                unlink-panels
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeFormat(firstPaymentTime, '1')"
              />
            </el-form-item>
            <el-form-item label="拖欠首付款:">
              <el-select
                v-model="formData.defaultFirstPayment"
                class="m-2"
                style="width: 252px"
                placeholder="所有状态"
                clearable
              >
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
              </el-select>
            </el-form-item>

            <el-form-item label="拖延尾款:">
              <el-select
                v-model="formData.defaultFinalPayment"
                class="m-2"
                style="width: 252px"
                placeholder="所有状态"
                clearable
              >
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="尾款最晚日期:">
              <el-date-picker
                style="width: 360px"
                v-model="finalPaymentTime"
                type="daterange"
                unlink-panels
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeFormat(finalPaymentTime, '2')"
              />
            </el-form-item>
            <el-form-item
              label="驳回时间:"
              v-if="formData.performancePaymentStatus == '2'"
            >
              <el-date-picker
                style="width: 360px"
                v-model="rejectTime"
                type="datetimerange"
                unlink-panels
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="defaultTime"
                @change="timeFormat(rejectTime, '3')"
              />
            </el-form-item>
            <el-form-item
              label="提交时间:"
              v-if="formData.performancePaymentStatus == '3'"
            >
              <el-date-picker
                style="width: 360px"
                v-model="submitTime"
                type="datetimerange"
                unlink-panels
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="defaultTime"
                @change="timeFormat(submitTime, '4')"
              />
            </el-form-item>
            <el-form-item
              label="完成时间:"
              v-if="formData.performancePaymentStatus == '4'"
            >
              <el-date-picker
                style="width: 360px"
                v-model="endTime"
                type="datetimerange"
                unlink-panels
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="defaultTime"
                @change="timeFormat(endTime, '5')"
              />
            </el-form-item>
            <el-form-item
              label="中止时间:"
              v-if="formData.performancePaymentStatus == '5'"
            >
              <el-date-picker
                style="width: 360px"
                v-model="closedTime"
                type="datetimerange"
                unlink-panels
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="defaultTime"
                @change="timeFormat(closedTime, '6')"
              />
            </el-form-item>
          </el-form>
          <div class="btnBox">
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="search">筛选</el-button>
          </div>
        </div>
      </template>
      <template #table-header class="artwork-workbench">
        <div class="titleBox">
          <el-menu
            :default-active="activeIndex"
            class="navMenu"
            mode="horizontal"
            :ellipsis="false"
            @select="handleSelect"
          >
            <el-menu-item
              :index="item.value"
              v-for="item in crm_performance_status"
              :key="item.id"
              >{{ item.label }}</el-menu-item
            >
          </el-menu>
          <div class="navRinght">
            <el-button @click="exportExcel">导出</el-button>
          </div>
        </div>
      </template>
      <template #table-content='tableHeight'>
        <el-table :data="tabList" style="width: 100%" :height="tableHeight.tableHeight" scrollbar-always-on>
          <el-table-column
            label="订单编号"
            width="210"
            prop="orderBusinessKey"
          ></el-table-column>
          <el-table-column
            label="客户名称"
            width="250"
            prop="customerName"
          ></el-table-column>
          <!-- <el-table-column label="结算方式" width="150">
            <template #default="scope">
              <settlementMethod :methodId="scope.row.settlementMethod" :methodList="methodList" />
            </template>
          </el-table-column> -->
          <el-table-column width="150">
            <template #header>
              合同总价
              <el-tooltip class="box-item" effect="dark" placement="bottom-end">
                <template #content>
                  <div>方案设计订单：方案设计费</div>
                  <div>大货订单：大货合同总价</div>
                  <div>大货设计生产订单：方案设计费+大货合同总价</div>
                </template>
                <el-icon class="icons">
                  <WarningFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <template #default="scope">
              <!-- <span>{{scope.row.contractTaxInclusiveTotalPrice?saveTwoBit(scope.row.contractTaxInclusiveTotalPrice):'-'}}</span> -->
              <div style="text-align: right; height: 100%; display: block">
                {{
                  showMoney(
                    scope.row.contractTaxInclusiveTotalPrice
                      ? scope.row.contractTaxInclusiveTotalPrice
                      : "-"
                  )
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单总价" width="150">
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

          <el-table-column label="首付款最晚日期" width="200">
            <template #default="scope">
              <span>{{
                scope.row.firstPaymentLatestDate
                  ? formatDates(scope.row.firstPaymentLatestDate)
                  : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="拖延首付款" width="130">
            <template #default="scope">
              <span :class="scope.row.defaultFirstPayment ? 'redColor' : ''">{{
                scope.row.defaultFirstPayment ? "是" : "否"
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="尾款最晚日期" width="200">
            <template #default="scope">
              <span>{{
                scope.row.finalPaymentLatestDate
                  ? formatDates(scope.row.finalPaymentLatestDate)
                  : "-"
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="拖延尾款" width="130">
            <template #default="scope">
              <span v-if="scope.row.paymentTaskCreated" :class="scope.row.defaultFinalPayment ? 'redColor' : ''">{{
                scope.row.defaultFinalPayment ? "是" : "否"
              }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="业务员"
            width="100"
            prop="businessStaffName"
          ></el-table-column>

          <el-table-column label="订单生成时间" width="200">
            <template #default="scope">
              <span>{{
                scope.row.orderStartTime
                  ? formatDate(scope.row.orderStartTime)
                  : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合计已付" width="150">
            <template #default="scope">
              <div style="text-align:right;">{{
                scope.row.paidAmount ? showMoney(scope.row.paidAmount) : "-"
              }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="驳回时间"
            width="200"
            v-if="formData.performancePaymentStatus == '2'"
          >
            <template #default="scope">
              <span>{{
                scope.row.paymentRejectTime
                  ? formatDate(scope.row.paymentRejectTime)
                  : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="提交时间"
            width="200"
            v-if="formData.performancePaymentStatus == '3'"
          >
            <template #default="scope">
              <span>{{
                scope.row.paymentSubmitTime
                  ? formatDate(scope.row.paymentSubmitTime)
                  : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="完成时间"
            width="200"
            v-if="formData.performancePaymentStatus == '4'"
          >
            <template #default="scope">
              <span>{{
                scope.row.endTime ? formatDate(scope.row.endTime) : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="中止时间"
            width="200"
            v-if="formData.performancePaymentStatus == '5'"
          >
            <template #default="scope">
              <span>{{
                scope.row.closedTime ? formatDate(scope.row.closedTime) : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-link
                type="primary"
                :underline="false"
                @click="gotoDetail(scope.row)"
                >详情</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pagination>
        <!-- <div class="laypage"> -->
          <pagination
            style="padding: 0 !important;margin: 0;"
            background
            layout="total, sizes, prev, pager, next, jumper"
            v-model:page="formData.current"
            :total="total"
            v-model:limit="formData.size"
            :pageSizes="[10, 20, 30, 50, 100]"
          />
        <!-- </div> -->
      </template>
    </listLayout>
  </div>
</template>

<script setup>
import {
  performancePaymentRecord,
  exportPaymentRecordList,
} from "@/api/orderManagement/performancePayment";
import {
  gradingCalculate,
} from "@/api/orderManagement/subOrder";
import useUserStore from "@/store/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDates, formatDate } from "@/utils/index";
import { useRouter } from "vue-router";
import useCrmOption from "@/store/modules/crmSelectOption";
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
import { parseTime } from '@/utils/ruoyi'
import listLayout from "@/components/ParentView/listLayout.vue";
const [isSaleman, userId] = useIsCrmSaleman("crmCustomerBusinessStaff");
const option = useCrmOption();
const salesmanList = computed(() => option.salesmanList);
// option.getOptionList('crmCustomerBusinessStaff')
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const router = useRouter()
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { crm_performance_status,crm_acColumn } = proxy.useDict(
  'crm_performance_status','crm_acColumn'
)
const roles = computed(() => useUserStore().roles) //获取角色
const defaultTime = [
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0,
    0,
    0
  ),
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59
  ),
]; // '00:00:00', '23:59:59'
const firstPaymentTime = ref([
    formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),
    formatDates(new Date().getTime() + 3600 * 1000 * 24 * 1),
  ])//s首付款时间
const data = reactive({
  formData: {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: "", //客户姓名,客户编号
    firstPaymentLatestDateStart: firstPaymentTime.value[0], //首付款最晚日期开始日期
    firstPaymentLatestDateEnd: firstPaymentTime.value[1], //首付款最晚日期结束日期
    finalPaymentLatestDateStart: "", //尾款最晚日期开始日期
    finalPaymentLatestDateEnd: "", //尾款最晚日期开始日期
    businessStaffId: userId, //业务员id
    performancePaymentStatus: "1", //履约付款状态
    defaultFirstPayment: "", //是否拖欠首付款
    defaultFinalPayment: "", //是否拖欠尾款
    closedTimeStart: "", //中止时间开始时间
    closedTimeEnd: "", //中止时间结束时间
    paymentRejectTimeStart: "", //付款进度驳回时间开始时间
    paymentRejectTimeEnd: "", //付款进度驳回时间结束时间
    paymentSubmitTimeStart: "", //付款进度提交时间开始时间
    paymentSubmitTimeEnd: "", //付款进度提交时间结束时间
    endTimeStart: "", //完成时间开始时间
    endTimeEnd: "", //完成时间结束时间
  },
  total: 0,
  finalPaymentTime: "", //尾款时间
  rejectTime: "", //驳回时间
  submitTime: "", //提交时间
  endTime: "", //完成时间
  closedTime: "", //中止时间
  tabList: [],
  methodList: [],
  isSearch: false,
  activeIndex: "1", //状态1=未完成，2=被驳回，3=审核中，4=已完成，5=已中止
  salesValue: "", //业务员的字典值
});
const {
  sateList,
  formData,
  finalPaymentTime,
  rejectTime,
  submitTime,
  endTime,
  closedTime,
  tabList,
  total,
  isSearch,
  activeIndex,
  salesValue,
  methodList,
} = toRefs(data)
watch(crm_acColumn,(val)=>{
  formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
const acDataSepDeptId = ref('')
option.setDeptId(formData.value.acDataSepDeptId);
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
}).finally(()=>{
  performancePaymentRecordFn();
})
const headHeight = ref(160)//搜索表单高度
// tab栏状态
const handleSelect = (key) => {
  
  formData.value.performancePaymentStatus = key;
  activeIndex.value = key;
  formData.value.current = 1; //当前页数
  rejectTime.value = "";
  submitTime.value = ""; //提交时间
  endTime.value = ""; //完成时间
  closedTime.value = ""; //中止时间
  formData.value.paymentRejectTimeStart = ""; //付款进度驳回时间开始时间
  formData.value.paymentRejectTimeEnd = ""; //付款进度驳回时间结束时间
  formData.value.paymentSubmitTimeStart = ""; //付款进度提交时间开始时间
  formData.value.paymentSubmitTimeEnd = ""; //付款进度提交时间结束时间
  formData.value.endTimeStart = ""; //完成时间开始时间
  formData.value.endTimeEnd = ""; //完成时间结束时间
  formData.value.closedTimeStart = ""; //中止时间开始时间
  formData.value.closedTimeEnd = ""; //中止时间结束时间
  formData.value.acColumn = crm_acColumn.value.find((item) => {
    return item.label == "acColumn";
  }).value;
  proxy.$nextTick(()=>{
    if(key==1){
      headHeight.value = 180
    }else{
      headHeight.value = 181
    }
  })
};
// 获取结算方式
const gradingCalculateFn = () => {
  gradingCalculate().then((res) => {
    methodList.value = res.data.more_settlement_method;
    // console.log('获取结算方式=====', methodList.value)
  });
};
gradingCalculateFn();
function changeDept(val) {
  option.setDeptId(val);
  formData.value.businessStaffId = null;
}
/**
 *crm订单流程视图--分页查询订单
 **/
const performancePaymentRecordFn = () => {
  performancePaymentRecord(formData.value)
    .then((res) => {
      tabList.value = res.data.records;
      total.value = res.data.total;
      // console.log('GET分页查询订单', data.tabList)
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
};

function exportExcel() {
	if(!tabList.value?.length){
		ElMessage.error('暂无数据导出')
		return
	}
  exportPaymentRecordList(formData.value, `履约付款管理列表-${crm_performance_status.value.find(item=>{return activeIndex.value == item.value}).label+parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`);
}

/**
 * 处理选着的时间格式
 **/
const timeFormat = (value, type) => {
  if (type == "1") {
    formData.value.firstPaymentLatestDateStart = value
      ? formatDates(value[0].getTime())
      : "";
    formData.value.firstPaymentLatestDateEnd = value
      ? formatDates(value[1].getTime())
      : "";
  } else if (type == "2") {
    formData.value.finalPaymentLatestDateStart = value
      ? formatDates(value[0].getTime())
      : "";
    formData.value.finalPaymentLatestDateEnd = value
      ? formatDates(value[1].getTime())
      : "";
  } else if (type == "3") {
    formData.value.paymentRejectTimeStart = value
      ? formatDate(value[0].getTime())
      : "";
    formData.value.paymentRejectTimeEnd = value
      ? formatDate(value[1].getTime())
      : "";
  } else if (type == "4") {
    formData.value.paymentSubmitTimeStart = value
      ? formatDate(value[0].getTime())
      : "";
    formData.value.paymentSubmitTimeEnd = value
      ? formatDate(value[1].getTime())
      : "";
  } else if (type == "5") {
    formData.value.endTimeStart = value ? formatDate(value[0].getTime()) : "";
    formData.value.endTimeEnd = value ? formatDate(value[1].getTime()) : "";
  } else if (type == "6") {
    formData.value.closedTimeStart = value
      ? formatDate(value[0].getTime())
      : "";
    formData.value.closedTimeEnd = value
      ? formatDate(value[1].getTime())
      : "";
  }
};
function saveTwoBit(num) {
  var result = parseFloat(num);
  result = Math.round(num * 100) / 100;
  return result;
}
/**
 * 筛选
 */
const search = () => {
  isSearch.value = true;
  performancePaymentRecordFn();
};
/**
 * 重置
 */
const reset = () => {
  firstPaymentTime.value = [
    formatDates(new Date().getTime() - 3600 * 1000 * 24 * 90),
    formatDates(new Date().getTime() + 3600 * 1000 * 24 * 1),
  ]; //开始时间
  finalPaymentTime.value = ""; //尾款时间
  rejectTime.value = ""; //驳回时间
  submitTime.value = ""; //提交时间
  endTime.value = ""; //完成时间
  closedTime.value = ""; //中止时间
  formData.value = {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: "", //客户姓名,客户编号
    firstPaymentLatestDateStart: firstPaymentTime.value[0], //首付款最晚日期开始日期
    firstPaymentLatestDateEnd: firstPaymentTime.value[1], //首付款最晚日期结束日期
    finalPaymentLatestDateStart: "", //尾款最晚日期开始日期
    finalPaymentLatestDateEnd: "", //尾款最晚日期开始日期
    businessStaffId: userId, //业务员id
    performancePaymentStatus: activeIndex.value, //履约付款状态
    defaultFirstPayment: '', //是否拖欠首付款
    defaultFinalPayment: '', //是否拖欠尾款
    closedTimeStart: '', //中止时间开始时间
    closedTimeEnd: '', //中止时间结束时间
    paymentRejectTimeStart: '', //付款进度驳回时间开始时间
    paymentRejectTimeEnd: '', //付款进度驳回时间结束时间
    paymentSubmitTimeStart: '', //付款进度提交时间开始时间
    paymentSubmitTimeEnd: '', //付款进度提交时间结束时间
    endTimeStart: '', //完成时间开始时间
    endTimeEnd: '', //完成时间结束时间
    acColumn:crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value,
    acDataSepDeptId:acDataSepDeptId.value
  }
}
/**
 * 查看详情
 **/
const gotoDetail = (item) => {
  // console.log('查看详情', item)
  router.push({
    path: "/crm/orderManagement/paymentDetail",
    query: {
      id: item.id,
    },
  });
};

/**
 * 监听对象数据的变化
 */
watch(
  [
    () => formData.value.size,
    () => formData.value.current,
    () => formData.value.performancePaymentStatus,
    () => formData.value.acColumn
  ],
  (val, oval) => {
    // console.log('id555555555监听对象数据的变化', val, 'ovaloval----', oval)
    // 判断没有点击筛选按钮时，之前填写的参数初始化
    performancePaymentRecordFn();
  },
  {
    // immediate: true,
    deep: true, //开启深度监听,能够侦听到对象属性值的变化
  }
);
// performancePaymentRecordFn();

/*
 *结束
 */
</script>

<style lang="scss" scoped>
.icons {
  color: #b3b3b3;
  font-size: 17px;
  vertical-align: sub;
  // margin-left: 10px;
  cursor: pointer;
}


  .top-bar {
    .btnBox {
      text-align: right;
      padding-right: 38px;
    }
  }

  .titleBox {
    user-select: none;
    position: relative;

    .navMenu {
      width: 100%;

      .flex-grow {
        flex-grow: 1;
      }
    }

    .navRinght {
      position: absolute;
      top: 13px;
      right: 0;
    }
  }

  // 分页
  .laypage {
    position: relative;
    display: flex;
    justify-content: right;
    margin-top: 20px;
  }

</style>
<style lang="scss">
.redColor {
  color: red;
}
.subOrder .el-form-item__label {
  font-weight: 700;
}

.is-align-center {
  .el-overlay-dialog {
    display: flex;

    .el-dialog {
      margin: auto;
    }
  }

  .btns {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;

    .btn {
      width: 200px;
      margin: 0;
      margin-bottom: 20px;
      height: 40px;
    }
  }
}
</style>

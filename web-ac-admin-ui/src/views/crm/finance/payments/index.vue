<template>
  <div>
    <el-card style="margin: 10px" class="artwork-workbench">
      <div class="top-bar subOrder">
        <el-form inline :model="formData" class="condition">
          <!-- 客户信息 -->
          <el-form-item label="客户信息:">
            <el-input style="width: 252px" clearable v-model="formData.customerInfo" placeholder="请输入客户编号/客户名称" />
          </el-form-item>
          <el-form-item label="归属部门:" prop="acDataSepDeptId">
					  <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
              <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- 业务员 -->

          <el-form-item label="业务员:">
            <el-select v-model="formData.businessStaffId" class="m-2" style="width: 252px" placeholder="所有业务员" clearable>
              <el-option v-for="item in salesmanList" :key="item.userId" :label="item.nickName" :value="item.userId" />
            </el-select>
          </el-form-item>
          <el-form-item label="提交时间:">
            <!-- <el-date-picker style="width: 360px" v-model="submitTime" type="datetimerange" unlink-panels
              range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(submitTime, '1')" /> -->
            <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.submitTimeStart"
              v-model:endTime="formData.submitTimeEnd"></dateTimePicker>
          </el-form-item>
          <el-form-item label="订单信息:">
            <el-input style="width: 252px" clearable v-model="formData.orderInfo" placeholder="请输入订单编号/付款流水单号" />
          </el-form-item>
          <el-form-item label="审核状态:">
            <el-select v-model="formData.auditStatus" class="m-2" style="width: 252px" placeholder="所有状态" clearable>
              <el-option v-for="item in crm_audit_status" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="实际付款时间:">
            <!-- <el-date-picker style="width: 360px" v-model="endTime" type="datetimerange" unlink-panels range-separator="→"
              start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFormat(endTime, '2')" /> -->
            <dateTimePicker ref="dateRef1" :dateType="'datetimerange'"
              v-model:startTime="formData.realityPaymentTimeStart" v-model:endTime="formData.realityPaymentTimeEnd"
              :isThreeMonths="false"></dateTimePicker>
          </el-form-item>
          <el-form-item label="是否删除:">
            <el-select v-model="formData.deleted" class="m-2" style="width: 252px" placeholder="所有状态" clearable>
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btnBox">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="search">筛选</el-button>
        </div>
      </div>
    </el-card>
    <el-card style="margin: 10px" class="artwork-workbench">
      <!-- 列表  -->
      <div class="outworkListBox">
        <el-table :data="paymentRecordList" style="width: 100%" scrollbar-always-on>
          <el-table-column label="订单编号" width="210" prop="orderBusinessKey"></el-table-column>
          <el-table-column label="客户名称" width="250" prop="customerName"></el-table-column>
          <el-table-column label="付款流水号" width="210" prop="paymentSerialNumber"></el-table-column>
          <el-table-column label="本单结算金额" width="210" prop="settlementAmount">
            <template #default="scope">
              <div style="text-align: right; height: 100%; display: block">
                {{
                  showMoney(
                    scope.row.settlementAmount
                      ? scope.row.settlementAmount
                      : "-"
                  )
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="实际付款时间" width="210">
            <template #default="scope">
              {{ formatDate(scope.row.realityPaymentTime) }}
            </template>
          </el-table-column>
          <el-table-column label="提交时间" width="210">
            <template #default="scope">
              {{ formatDate(scope.row.submitTime) }}
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="210">
            <template #default="scope">
              <DictText dict="crm_audit_status" :value="scope.row.auditStatus" />
            </template>
          </el-table-column>
          <el-table-column label="审核时间" width="210">
            <template #default="scope">
              {{ scope.row.auditTime ? formatDate(scope.row.auditTime) : "-" }}
            </template>
          </el-table-column>
          <el-table-column label="是否删除" width="210">
            <template #default="scope">
              {{ scope.row.deleted ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-link v-if="scope.row.auditStatus == '1' && !scope.row.deleted" type="primary" :underline="false"
                @click="auditPayment(scope.row, '1')">审核</el-link>
              <el-link v-else type="primary" :underline="false" @click="auditPayment(scope.row, '2')">查看</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="laypage">
          <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
            :total="total" v-model:limit="formData.size" :pageSizes="[10, 20, 30, 50, 100]" />
        </div>
      </div>
    </el-card>
    <paymentReview ref="paymentReviewRef" @lookPaymentRecord="lookPaymentRecordFn"></paymentReview>
  </div>
</template>

<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import { lookPaymentRecord } from '@/api/orderManagement/performancePayment'
import { BASE_FILE_URL } from '@/store/global-constant'
import paymentReview from './components/paymentReview.vue'
import { roleKey } from '@/api/orderManagement/subOrder'
import useUserStore from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/index'
import useCrmOption from "@/store/modules/crmSelectOption"
const option = useCrmOption()
const salesmanList = computed(()=>option.salesmanList)
const deptList = computed(()=> option.deptList)
const deptDisabled = ref(false)
const router = useRouter()
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { crm_audit_status,crm_acColumn } = proxy.useDict('crm_audit_status','crm_acColumn')

const roles = computed(() => useUserStore().roles) //获取角色
const paymentReviewRef = ref()
const dateRef = ref(null)
const dateRef1 = ref(null)

const data = reactive({
  formData: {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: '', //客户信息
    businessStaffId: '', //业务员id
    submitTimeStart: formatDate(new Date(new Date().toLocaleDateString()).getTime()-60*60*1000*24*90), //提交时间开始时间
    submitTimeEnd: formatDate(new Date(new Date().toLocaleDateString()).getTime()+60*60*1000*24-1000), //提交时间结束时间
    orderInfo: '', //订单信息
    auditStatus: '', //审核状态
    realityPaymentTimeStart: '', //实际付款时间开始时间
    realityPaymentTimeEnd: '', //实际付款时间结束时间
    deleted: '', //是否删除
    acColumn:null
  },
  total: 0,
  // salesmanList: [],
  // submitTime: [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)], //提交时间
  // endTime: '', //完成时间
  isSearch: false,
  salesValue: "", //业务员的字典值
  paymentRecordList: [],
});
const {
  formData,
  sateList,
  // salesmanList,
  // submitTime,
  // endTime,
  total,
  isSearch,
  salesValue,
  paymentRecordList,
} = toRefs(data);

// const allSalesmanModule = () => {
//   roleKey('crmCustomerBusinessStaff')
//     .then((res) => {
//       salesmanList.value = res.data
//     })
//     .catch((err) => {
//       // console.log('报错-----', err)
//       ElMessage.error(err.msg)
//     })
// }
// allSalesmanModule()
/**
 * 处理选着的时间格式
 **/
// const timeFormat = (value, type) => {
//   if (type == '1') {
//     formData.value.submitTimeStart = value ? formatDate(value[0].getTime()) : ''
//     formData.value.submitTimeEnd = value ? formatDate(value[1].getTime()) : ''
//   } else if (type == '2') {
//     formData.value.realityPaymentTimeStart = value ? formatDate(value[0].getTime()) : ''
//     formData.value.realityPaymentTimeEnd = value ? formatDate(value[1].getTime()) : ''
//   }
//   // console.log('formData------111', formData.value)
// }
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
  lookPaymentRecordFn();
})
function changeDept(val){
  option.setDeptId(val)
  formData.value.businessStaffId = null
}
/**
 * 筛选
 */
const search = () => {
  isSearch.value = true;
  lookPaymentRecordFn();
};
/**
 * 重置
 */
const reset = () => {
  dateRef.value.initTime(1);
  dateRef1.value.initTime();

  // submitTime.value = [formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90), formatDate(new Date().getTime() + 3600 * 1000 * 24 * 1)] //提交时间
  // endTime.value = '' //完成时间
  formData.value = {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerInfo: "", //客户信息
    businessStaffId: "", //业务员id
    submitTimeStart: formatDate(dateRef.value.start), //提交时间开始时间
    submitTimeEnd: formatDate(dateRef.value.end), //提交时间结束时间
    orderInfo: '', //订单信息
    auditStatus: '', //审核状态
    realityPaymentTimeStart: '', //实际付款时间开始时间
    realityPaymentTimeEnd: '', //实际付款时间结束时间
    deleted: '', //是否删除
    acColumn:crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value,
    acDataSepDeptId:acDataSepDeptId.value
  }
}
const auditPayment = (item, type) => {
  paymentReviewRef.value.paymentShow(item, type);
  //   console.log('item===',item,'type===',type);
};
// 分页查询付款凭证
const lookPaymentRecordFn = (type) => {
  if (type == 1) {
    // 不能直接使用对像赋值，会是使formData的栈值变化导致触发watch监听，
    formData.value.size = 10;
    formData.value.current = 1;
  }
  lookPaymentRecord(formData.value).then((res) => {
    paymentRecordList.value = res.data.records;
    total.value = res.data.total;
  });
};
onMounted(() => {
  /**
   * 监听对象数据的变化
   */
  watch(
    [() => formData.value.size, () => formData.value.current],
    (val, oval) => {
      lookPaymentRecordFn();
    },
    {
      // immediate: true,
      deep: true, //开启深度监听,能够侦听到对象属性值的变化
    }
  );
});
// lookPaymentRecordFn();

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

.artwork-workbench {
  .top-bar {
    .btnBox {
      text-align: right;
      padding-right: 38px;
    }
  }

  .titleBox {
    margin: 20px 0;
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
    display: flex;
    justify-content: right;
    margin-top: 20px;
  }
}
</style>
<style lang="scss">
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

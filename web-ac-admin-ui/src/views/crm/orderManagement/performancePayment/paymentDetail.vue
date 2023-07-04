<template>
  <div class="proofingContent">
    <el-card>
      <h4 style="font-size: 20px; position: relative">
        <span class="rightTxt">订单编号：</span>{{ paymentData.orderBusinessKey }}
        <div class="suppContract">
          <DictText dict="crm_performance_status" :value="paymentData.performancePaymentStatus" />
        </div>
      </h4>
      <ul class="userInfo">
        <li>
          <div>合同总价：</div>
          <div>
            {{ showMoney(paymentData.contractTaxInclusiveTotalPrice===''&&paymentData.contractTaxInclusiveTotalPrice===null?'-':(paymentData.contractTaxInclusiveTotalPrice))}}元
          </div>
        </li>
        <li>
          <div>订单总价：</div>
          <div>
            {{
              paymentProc &&
              paymentProc.orderTaxInclusiveTotalPrice!==''&&paymentProc.orderTaxInclusiveTotalPrice!==null
              ? showMoney(paymentProc.orderTaxInclusiveTotalPrice) + '元'
              : '-'
            }}
          </div>
        </li>
        <li>
          <div class="category">拖欠首付款：</div>
          <div>
            {{ paymentData.defaultFirstPayment ? '是' : '否' }}
          </div>
        </li>
        <li>
          <div class="category">拖欠尾款：</div>
          <div v-if="paymentData.paymentTaskCreated">
            {{ paymentData.defaultFinalPayment ? '是' : '否' }}
          </div>
          <div v-else>-</div>
        </li>
        <li>
          <div class="category">合计已付款：</div>
          <div>
            {{
              paymentData.paidAmount
              ? showMoney(paymentData.paidAmount) + '元'
              : '-'
            }}
          </div>
        </li>
      </ul>
    </el-card>
    <el-card style="margin: 10px">
      <template #header>
        <div class="paymentHeader">
          <span>预付款凭证</span>
          <el-button type="primary" v-if="
            paymentData.performancePaymentStatus == '1' ||
            paymentData.performancePaymentStatus == '2' 
          " @click="addPayment">新增付款凭证</el-button>
        </div>
      </template>
      <el-table :data="paymentRecordList" style="width: 100%" scrollbar-always-on>
        <el-table-column label="付款流水号" width="210" prop="paymentSerialNumber"></el-table-column>
        <el-table-column label="本单结算金额" width="200" prop="settlementAmount">
          <template #default="scope">
            {{ showMoney(scope.row.settlementAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="实际付款时间" width="210">
          <template #default="scope">
            {{ formatDate(scope.row.realityPaymentTime) }}
          </template>
        </el-table-column>
        <el-table-column label="付款凭证" width="130">
          <template #default="scope">
            <a style="color: #409eff" :href="BASE_FILE_URL + senseUrl(scope.row.paymentUrl)" target="_blank">查看</a>
          </template>
        </el-table-column>
        <el-table-column label="录入人" width="128" prop="recordPersonName"></el-table-column>
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
        <el-table-column label="是否删除" width="210">
          <template #default="scope">
            {{ scope.row.deleted ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <span class="downloadPayment" @click="singleDownloadFn(scope.row.paymentUrl)">下载付款凭证</span>
            <el-link v-if="!scope.row.deleted" type="primary" :underline="false" @click="
              deletePayment(
                scope.row.id,
                scope.row.auditStatus
              )
            " :disabled="
  (scope.row.auditStatus != '1' &&
  paymentData.performancePaymentStatus != '1' &&
  paymentData.performancePaymentStatus != '2') ||
  paymentData.performancePaymentStatus == '5'
">删除</el-link>
            <span v-if="scope.row.deleted" style="color: #ccc">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="submitOrder" v-if="
        paymentData.performancePaymentStatus == '1' ||
        paymentData.performancePaymentStatus == '2' 
      ">
        <el-button type="primary" @click="submitPaymentFn" :disabled="!paymentTaskCreated">提交订单审核</el-button>
      </div>
    </el-card>
    <el-card style="margin: 10px" v-if="rejectRecordList.length">
      <template #header>
        <div style="font-size: 20px">订单审核驳回记录</div>
      </template>
      <div class="reject" v-for="item in rejectRecordList" :key="item.id">
        <span>驳回时间：</span>
        <div>
          <div>{{ formatDate(item.paymentRejectTime) || '-' }}</div>
          <div>驳回人：{{ item.paymentRejecterName || '-' }}</div>
          <div>驳回原因：{{ item.paymentRejectReason || '-' }}</div>
        </div>
      </div>
    </el-card>
    <newPayment ref="newPaymentRef" @performancePaymentDetailsFn="performancePaymentDetailsFn"></newPayment>
  </div>
</template>
<script setup>
import { BASE_FILE_URL } from '@/store/global-constant'
import {
  performancePaymentDetails,
  deletePaymentRecord,
  submitPayment,
  rejectRecord,
} from '@/api/orderManagement/performancePayment'
import newPayment from './components/newPayment.vue'
import { formatDate,senseUrl } from '@/utils/index'
import { ElMessage } from 'element-plus'
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { crm_audit_status, crm_performance_status } = proxy.useDict(
  'crm_audit_status',
  'crm_performance_status'
)
const route = useRoute()
const newPaymentRef = ref()
const data = reactive({
  paymentData: '',
  paymentRecordList: [],
  paymentProc: '',
  paymentTaskId: '',
  rejectRecordList: [],
  paymentTaskCreated: false,
})
const {
  paymentRecordList,
  paymentData,
  paymentProc,
  paymentTaskId,
  rejectRecordList,
  paymentTaskCreated,
} = toRefs(data)
const singleDownloadFn = (paymentUrl) => {
  window.location.href =
    '/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName=' +
    paymentUrl
}
// 新增付款凭证
const addPayment = () => {
  newPaymentRef.value.paymentShow()
}
// 删除付款凭证记录
const deletePayment = (id, auditStatus) => {
  if (auditStatus == '1') {
    deletePaymentRecord(id).then((res) => {
      // console.log('res--=-=-=-=-=', res)
      if (res.code == 200) {
        performancePaymentDetailsFn()
        ElMessage.success('删除成功!')
      }
    })
  }
}
// 履约付款驳回记录
const rejectRecordFn = (procId) => {
  rejectRecord(procId).then((res) => {
    if (res.code == 200) {
      rejectRecordList.value = res.data
    }
  })
}
// 获得履约付款详情
const performancePaymentDetailsFn = () => {
  performancePaymentDetails(route.query.id).then((res) => {
    paymentData.value = res.data
    paymentProc.value = res.data.paymentProc
    paymentRecordList.value = res.data.paymentRecordList
    paymentTaskId.value = res.data.paymentTask?.id
    paymentTaskCreated.value = res.data.paymentTaskCreated
    // console.log('res545445----', res)
    // 工作流是否流到了付款进度节点
    if (res.data.paymentTaskCreated) {
      rejectRecordFn(res.data.paymentProc.id)
    }
  })
}
performancePaymentDetailsFn()

//  履约付款提交订单审核,提交对账进度节点
const submitPaymentFn = () => {
  let flag = paymentRecordList.value?.some(
    (e) => e.deleted == false && e.auditStatus == '1'
  )
  if (flag) {
    ElMessage.error('存在待审核付款凭证，待审核或删除后重试')
  } else {
    submitPayment(paymentTaskId.value).then((res) => {
      // console.log('履约付款提交订单审核', res)
      if (res.code == 200) {
        ElMessage.success('提交订单审核成功!')
        performancePaymentDetailsFn()
      }
    })
  }
}
function saveTwoBit (num) {
  var result = parseFloat(num);
  result = Math.round(num * 100) / 100;
  return result;
}
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.proofingContent {
  font-size: 14px;
}

.suppContract {
  width: 100px;
  height: 100px;
  color: #333;
  border: 1px dashed #333;
  border-radius: 50%;
  position: absolute;
  top: -22px;
  right: 0;
  text-align: center;
  line-height: 100px;
  transform: rotate(45deg);
}

.submitOrder {
  display: flex;
  justify-content: right;
  margin: 10px;
}

.rightTxt {
  display: inline-block;
  width: 100px;
  text-align: right;
}

.userInfo {
  display: flex;
  margin-top: 20px;
}

.userInfo li {
  flex: 0 0 210px;
}

.userInfo li>div {
  margin-top: 20px;
}

.userInfo li>div:last-child {
  font-size: 20px;
}

.userInfo .category {
  display: flex;
}

.userInfo .category .cateName {
  display: flex;
  flex-direction: column;
}

.reject {
  display: flex;
  margin-left: 30px;
  margin-top: 20px;
}

.reject div {
  margin-bottom: 20px;
}

// 分页
.laypage {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}

.paymentHeader {
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}

.downloadPayment {
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
</style>

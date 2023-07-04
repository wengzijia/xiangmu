<template>
  <div>
    <el-form v-if="drawerFormData.contractType == '1'" :model="formData" label-width="180px">
      <div>合同</div>
      <el-form-item label="设计服务合同:">
        <div style="word-break: break-all;">
          <span>{{formData.designServiceContractName}}</span>
          <singDownFile :url="formData.designServiceContractUrl"></singDownFile>
          <!-- <el-link :underline="false" :href="BASE_FILE_URL+formData.designServiceContractUrl" style="margin-left: 20px;">下载</el-link> -->
        </div>
      </el-form-item>
      <customerInfo :customer="customer" :methodList="methodList"/>
      <div>订单信息</div>
      <el-form-item label="订单类型:">
        <div>
          <DictTag :value="formData.parentProcType" :options="crm_order_type" />
        </div>
      </el-form-item>
      <!-- <el-form-item label="结算方式:">
        <div>
          <DictTag :value="formData.settlementMethod" :options="methodList" />
        </div>
      </el-form-item> -->
      <el-form-item label="合同编号:">
        <div>{{ formData.designServiceContractNo }}</div>
      </el-form-item>
      <el-form-item label="品类:">
        <div>{{ formData.categoryName }}</div>
      </el-form-item>
      <el-form-item v-if="formData.proofingQuantity" label="打样数量:">
        <div>{{ formData.proofingQuantity }}</div>
      </el-form-item>
      <el-form-item v-if="formData.bulkProdQuantity" label="大货生产数量:">
        <div>{{ formData.bulkProdQuantity }}</div>
      </el-form-item>
      <el-form-item label="设计服务费:">
        <div>{{ showMoney(formData.designServiceTaxInclusiveFee) }}(含税)</div>
      </el-form-item>
      <el-form-item label="设计服务报价成本预估表:">
        <div style="word-break: break-all;">{{ formData.designServiceCostEstimationTableName||'-' }} <singDownFile :url="formData.designServiceCostEstimationTableUrl"></singDownFile></div>
      </el-form-item>
      <!-- <el-form-item label="成本预估表:">
        <div>{{ formData.designServiceCostEstimationTableName||'-' }} <singDownFile :url="formData.designServiceCostEstimationTableUrl"></singDownFile></div>
      </el-form-item> -->
      <el-form-item label="税金:">
        <div>{{ showMoney(formData.designServiceTaxes) }}</div>
      </el-form-item>
      <el-form-item v-if="formData.invoiceEntity" label="开票主体:">
        <div>{{ formData.invoiceEntity }}</div>
      </el-form-item>
      <el-form-item label="业务员:">
        <div>{{ formData.businessStaffName }}</div>
      </el-form-item>
    </el-form>
    <el-form v-if="drawerFormData.contractType == '2'" :model="formData" label-width="180px">
      <div>合同</div>
      <el-form-item label="供应商打样合同:">
        <div style="word-break: break-all;">{{ formData.supplierContractName }} <singDownFile :url="formData.supplierContractUrl"></singDownFile></div>
      </el-form-item>
      <customerInfo :customer="customer" :methodList="methodList"/>
      <div>订单信息</div>
      <el-form-item label="打样工单号:">
        <div>{{ formData.businessKey }}</div>
      </el-form-item>
      <el-form-item label="订单类型:">
        <DictTag :value="formData.parentProcType" :options="crm_order_type" />
        <!-- <div>{{ formData.parentProcType }}</div> -->
      </el-form-item>
      <!-- <el-form-item label="订单报价预估成本:">
        <div style="word-break: break-all;">{{ formData.designServiceCostEstimationTableName||'-' }} <singDownFile :url="formData.designServiceCostEstimationTableUrl"></singDownFile></div>
      </el-form-item> -->
      <el-form-item v-if="formData.parentProcType!='bulk_order'" label="设计服务报价成本预估表:">
        <div style="word-break: break-all;">{{ formData.designServiceCostEstimationTableName||'-' }} <singDownFile :url="formData.designServiceCostEstimationTableUrl"></singDownFile></div>
      </el-form-item>
      <el-form-item label="打样供应商:">
        <div>{{ formData.proofingSupplierName }}</div>
      </el-form-item>
      <el-form-item label="供应商预估打样费:">
        <div>{{ showMoney(formData.supplierProofingTaxInclusiveFee) + ' (含税)' }}</div>
      </el-form-item>
      <el-form-item label="税金:">
        <div>{{ showMoney(formData.supplierProofingTaxes) }}</div>
      </el-form-item>
      <!-- <el-form-item label="系统预估打样费:">
        <div style="color:rgb(255, 102, 179)">{{ formData.estimateProofingFee || '-'}}</div>
      </el-form-item> -->
      <el-form-item label="品类:">
        <div>{{ formData.categoryName }}</div>
      </el-form-item>
      <el-form-item label="打样数量:">
        <div>{{ formData.proofingQuantity }}</div>
      </el-form-item>
      <el-form-item label="供应商成本核算表:">
        <div style="word-break: break-all;">{{ formData.supplierCostCalculateExcelName }}
          <singDownFile :url="formData.supplierCostCalculateExcelUrl"></singDownFile>
          <!-- <el-link :href="BASE_FILE_URL+formData.supplierCostCalculateExcelUrl">下载</el-link> -->
        </div>
      </el-form-item>
      <el-form-item label="预计货期:">
        <div>{{ formData.expectedDeliveryDate }}</div>
      </el-form-item>
    </el-form>
    <el-form v-if="drawerFormData.contractType == '3'" :model="formData" label-width="160px">
      <div>合同</div>
      <el-form-item label="供应商大货合同:">
        <div style="word-break: break-all;">{{ formData.supplierContractName }}
          <singDownFile :url="formData.supplierContractUrl"></singDownFile>
          <!-- <el-link :href="BASE_FILE_URL+formData.supplierContractUrl">下载</el-link> -->
        </div>
      </el-form-item>
      <customerInfo :customer="customer" :methodList="methodList"/>
      <div>订单信息</div>
      <el-form-item label="订单类型:">
        <DictTag :value="formData.parentProcType" :options="crm_order_type" />
        <!-- <div>{{ formData.parentProcType }}</div> -->
      </el-form-item>
      <el-form-item label="订单编号:">
        <div>{{ formData.orderBusinessKey }}</div>
      </el-form-item>
      <el-form-item label="大货工单号:">
        <div>{{ formData.bulkBusinessKey }}</div>
      </el-form-item>
      <el-form-item label="大货供应商:">
        <div>{{ formData.bulkSupplierName }}</div>
      </el-form-item>
      <el-form-item label="大货生产费:">
        <div>{{ showMoney(formData.bulkProdTaxInclusiveFee) + ' (含税)' }}</div>
      </el-form-item>
      <el-form-item label="税金:">
        <div>{{ showMoney(formData.bulkProdTaxes) }}</div>
      </el-form-item>
      <!-- <el-form-item label="系统预估大货生产费:">
        <div style="color:rgb(255, 102, 179)">{{ showMoney(formData.systemEstimateBulkProdFee) || '-'}}</div>
      </el-form-item> -->
      <el-form-item label="品类:">
        <span v-for="(item,i) in formData.categoryList">
          {{ item.goodsName }}<span v-if="i<formData.categoryList.length-1">/</span>
        </span>
        <!-- <div>{{ formData.categoryName }}</div> -->
      </el-form-item>
      <el-form-item label="大货生产数量:">
        <span v-for="(item,i) in formData.categoryList">
          {{ item.bulkProdQuantity }}<span v-if="i<formData.categoryList.length-1">/</span>
        </span>
        <!-- <div>{{ formData.proofingQuantity }}</div> -->
      </el-form-item>
      <el-form-item label="供应商成本核算表:">
        <div style="word-break: break-all;">{{ formData.costCalculateExcelName }}
          <singDownFile :url="formData.costCalculateExcelUrl"></singDownFile>
          <!-- <el-link :href="BASE_FILE_URL+formData.costCalculateExcelUrl">下载</el-link> -->
        </div>
      </el-form-item>
      <el-form-item label="供应商合同货期:">
        <div>{{ formData.supplierContractDeliveryDate }}</div>
      </el-form-item>
      <el-form-item label="大货物流费(预估):">
        <div>{{ showMoney(formData.bulkLogisticsTaxInclusiveFee) }}</div>
      </el-form-item>
    </el-form>
    <el-form v-if="drawerFormData.contractType == '4'" :model="formData" label-width="160px">
      <div>合同</div>
      <el-form-item label="合同/采购单:">
        <div style="word-break: break-all;">
          <span style="margin-right: 10px;">{{ formData.bulkContractName || '-' }}</span>
          <singDownFile :url="formData.bulkContractUrl"></singDownFile>
        </div>
      </el-form-item>
      <el-form-item label="合同总价:">
        <div>{{ showMoney(formData.contractTaxInclusiveTotalPrice) }}</div>
      </el-form-item>
      <el-form-item label="合同编号:">
        <div>{{ formData.bulkContractNo }}</div>
      </el-form-item>
      <el-form-item label="预计交货日期:">
        <div>
          <div>{{ formData.expectedDeliveryDate }}</div>
          <div>预计所需货期：<span style="color: red;">{{formData.expectedNeedDaysNumber}}</span> 天</div>
        </div>
      </el-form-item>
      <el-form-item label="合同签订日期:">
        <div>{{ formData.contractSignDate }}</div>
      </el-form-item>
      <el-form-item label="首付款比例:">
        <div>{{ parseInt(formData.firstPaymentRatio*100)||'30' }}%</div>
      </el-form-item>
      <el-form-item label="首付款最晚日期:">
        <div>{{ formData.firstPaymentLatestDate }}</div>
      </el-form-item>
      <el-form-item label="尾款最晚日期:">
        <div>{{ formData.finalPaymentLatestDate }}</div>
      </el-form-item>
      <customerInfo :customer="customer" :methodList="methodList"/>
      <div>订单信息</div>
      <el-form-item label="全成本核算表:">
        <div style="word-break: break-all;">{{ formData.allCostCalculateExcelName || '-'}}
          <singDownFile :url="formData.allCostCalculateExcelUrl"></singDownFile>
          <!-- <el-link :href="BASE_FILE_URL+formData.allCostCalculateExcelUrl">下载</el-link> -->
        </div>
      </el-form-item>
      <el-form-item label="方案设计成本费:" v-if="formData.designTaxInclusiveCostFee">
        <div>{{ showMoney(formData.designTaxInclusiveCostFee) }}</div>
      </el-form-item>
      <div>成本详情</div>
      <div>打样</div>
      <div v-for="item in formData.proof" :key="item.id">
        <el-form-item label="打样工单号:">
          <div>{{ item.businessKey}}</div>
        </el-form-item>
        <el-form-item label="品类:">
          <div>{{ item.categoryName }}</div>
        </el-form-item>
        <el-form-item label="打样数量:">
          <div>{{ item.proofingQuantity }}</div>
        </el-form-item>
        <el-form-item label="供应商预估打样费:">
          <div>{{ showMoney(item.supplierProofingTaxInclusiveFee) + ' (含税)'}}</div>
        </el-form-item>
        <el-form-item label="税金:">
          <div>{{ showMoney(item.supplierProofingTaxes) }}</div>
        </el-form-item>
        <el-form-item label="打样成本核算表:">
          <div style="word-break: break-all;">{{ item.supplierCostCalculateExcelName }}
            <singDownFile :url="item.supplierCostCalculateExcelUrl"></singDownFile>
            <!-- <el-link :href="BASE_FILE_URL+item.supplierCostCalculateExcelUrl">下载</el-link> -->
          </div>
        </el-form-item>
        <el-form-item label="打样物流费:">
          <div>{{ showMoney(item.logisticsTaxInclusiveFee) + ' (含税)'}}</div>
        </el-form-item>
        <el-form-item label="打样物流费税金:">
          <div>{{ showMoney(item.logisticsTaxes) }}</div>
        </el-form-item>
        <el-form-item label="打样物流单据:">
          <div style="word-break: break-all;">{{ item.logisticsDocumentsName }}
            <singDownFile :url="item.logisticsDocumentsUrl"></singDownFile>
            <!-- <el-link :href="BASE_FILE_URL+item.logisticsDocumentsUrl">下载</el-link> -->
          </div>
        </el-form-item>
      </div>
      <div>大货</div>
      <div v-for="item in formData.bulk" :key="item.id">
        <el-form-item label="大货工单号:">
          <div>{{ item.bulkBusinessKey }}</div>
        </el-form-item>
        <el-form-item label="品类:">
          <div>{{ item.categoryName }}</div>
        </el-form-item>
        <el-form-item label="大货生产数量:">
          <div>{{ item.bulkProdQuantity }}</div>
        </el-form-item>
        <el-form-item label="大货生产费:">
          <div>{{ showMoney(item.bulkProdTaxInclusiveFee) + ' (含税)'}}</div>
        </el-form-item>
        <el-form-item label="大货生产税金:">
          <div>{{ showMoney(item.bulkProdTaxes) }}</div>
        </el-form-item>
        
        <el-form-item label="大货物流费(预估):">
          <div>{{ showMoney(item.bulkLogisticsTaxInclusiveFee) + ' (含税)'}}</div>
        </el-form-item>
        <el-form-item label="大货物流费税金(预估):">
          <div>{{ showMoney(item.bulkLogisticsTaxes) }}</div>
        </el-form-item>
        <el-form-item label="大货成本核算表:">
          <div style="word-break: break-all;">{{ item.costCalculateExcelName }}
            <singDownFile :url="item.costCalculateExcelUrl"></singDownFile>
            <!-- <el-link :href="BASE_FILE_URL+item.costCalculateExcelUrl">下载</el-link> -->
          </div>
        </el-form-item>
      </div>
      
    </el-form>
    <div class="contract-history" style="margin:10px" v-if="drawerFormData.contractType == '1'&&auditHistory?.length">
      <div>驳回记录</div>
      <div v-for="item in auditHistory" :key="item.id" class="contract-history-box">
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回人:</div>
          <div style="flex: 1;">{{ item?.designServiceContractRejectPersonName }}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回原因:</div>
          <div style="flex: 1;">{{ item?.designServiceContractRejectReason}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回时间:</div>
          <div style="flex: 1;">{{ parseDate(item?.designServiceContractRejectTime)}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">合同:</div>
          <div style="flex: 1;word-break: break-all;">{{ item?.designServiceContractRejectName}}
            <singDownFile :url="item.designServiceContractRejectUrl"></singDownFile></div>
        </div>
      </div>
    </div>
    <div class="contract-history" style="margin:10px" v-if="drawerFormData.contractType == '2'&&auditHistory?.length">
      <div>驳回记录</div>
      <div v-for="item in auditHistory" :key="item.id" class="contract-history-box">
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回人:</div>
          <div style="flex: 1;">{{ item?.contractAuditPersonName}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回原因:</div>
          <div style="flex: 1;">{{ item?.contractAuditRejectReason}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回时间:</div>
          <div style="flex: 1;">{{ parseDate(item?.contractAuditTime)}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">合同:</div>
          <div style="flex: 1;word-break: break-all;">{{ item?.supplierContractName}}
            <singDownFile :url="item.supplierContractUrl"></singDownFile></div>
        </div>
      </div>
    </div>
    <div class="contract-history" style="margin:10px" v-if="drawerFormData.contractType == '3'&&auditHistory?.length">
      <div>驳回记录</div>
      <div v-for="item in auditHistory" :key="item.id" class="contract-history-box">
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回人:</div>
          <div style="flex: 1;">{{ item?.supplierContractAuditerName}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回原因:</div>
          <div style="flex: 1;">{{ item?.supplierContractAuditRejectReason}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回时间:</div>
          <div style="flex: 1;">{{ parseDate(item?.supplierContractAuditTime)}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">合同:</div>
          <div style="flex: 1;word-break: break-all;">{{ item?.supplierContractName}}
            <singDownFile :url="item.supplierContractUrl"></singDownFile></div>
        </div>
      </div>
    </div>
    <div class="contract-history" style="margin:10px" v-if="drawerFormData.contractType == '4'&&auditHistory?.length">
      <div>驳回记录</div>
      <div v-for="item in auditHistory" :key="item.id" class="contract-history-box">
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回人:</div>
          <div style="flex: 1;">{{ item?.bulkContractRejectPersonName}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回原因:</div>
          <div style="flex: 1;">{{ item?.bulkContractRejectReason}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">驳回时间:</div>
          <div style="flex: 1;">{{ parseDate(item?.bulkContractRejectTime)}}</div>
        </div>
        <div style="display: flex;margin-top: 6px;">
          <div class="history-label">合同:</div>
          <div style="flex: 1;word-break: break-all;">{{ item?.bulkContractRejectName}}
            <singDownFile :url="item.bulkContractRejectUrl"></singDownFile></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  getDesignOrderProc, 
  getDesignOrderTask, 
  getProofingCategory, 
  getProofingTask, 
  getBulkTask,
  getBulkProofingDetail,
  getBulkProc,
  getBulkDesignProc,
  getBulkDesignProcTask,
  getBulkDesignDetail
} from "@/api/crm/finance/contract";
import {gradingCalculate,customerdata} from '@/api/orderManagement/subOrder'
import { getProofingDetail } from "@/api/crm/supplyChain/proofing"
import { reactive, toRefs, watch } from "vue";
import {BASE_FILE_URL} from "@/store/global-constant"
import singDownFile from "@/components/singDownFile";
import { getDesignServiceContractAudit,getProofContractAudit,getSupplierContractAudit,getBulkContractAudit } from "@/api/crm/finance/history"
import { parseDate } from "@/utils/index"
import { getCustomerConfirmsDetail } from "@/api/crm/customer";
import customerInfo from "./customerInfo.vue"
const emit = defineEmits()
const { proxy } = getCurrentInstance()
const {
  crm_order_type
} = proxy.useDict(
  'crm_order_type'
)
const props = defineProps({
  drawerFormData: {
    type: Object,
    default: {}
  }
})
const { drawerFormData } = toRefs(props)
const data = reactive({
  formData: {},
  customer:{}
})
const { formData,customer } = toRefs(data)
const methodList = ref([])
const auditHistory = ref([])

watch(drawerFormData, (val,oldVal) => {
  if (!oldVal&&val.id) {
    switch (val.contractType) {
      case '1':
        // "1", "设计服务合同"
        if (val.parentProcType == 'project_design_order') {
          getDesing()
        }else if(val.parentProcType == 'bulk_design_prod_order'){
          getBulkDesing()
        }
        break;
      case '2':
        // "2", "供应商合同(打样)"
        supplierProof()
        break;
      case '3':
        // "3", "供应商合同(大货)"
        supplierBulk()
        break;
      case '4':
        // "4", "大货合同"
        getBulk()
        break;

      default:
        break;
    }
    getCustomerDetail()
  }
}, { deep: true, immediate: true })

//方案设计详情
function getDesing() {
  let proc = getDesignOrderProc(drawerFormData.value.processParentId)
  let task = getDesignOrderTask(drawerFormData.value.id)
  Promise.all([proc, task]).then(([res1, res2]) => {
    formData.value = { ...res1.data, ...res2.data, ...drawerFormData.value }
    emit('setDrawerFormData',formData.value)
  }).then(() => {
    formData.value.categoryName = formData.value.categoryList.map(item => {
      return item.goodsName
    }).join(' / ')
    formData.value.proofingQuantity = formData.value.categoryList.map(item => {
      return item.proofingQuantity
    }).join(' / ')
  })
  getDesignServiceContractAudit(drawerFormData.value.procId).then(res=>{
    if (res.code==200) {
      auditHistory.value = res.data
    }
  })
}
//供应商合同（打样）详情
function supplierProof() {
  let proc = getProofingDetail(drawerFormData.value.procId)
  let task = getProofingTask(drawerFormData.value.id)
  Promise.all([proc, task]).then(([res1, res2]) => {
    let obj = {
      categoryName: res1.data.categoryList.map(item => { return item.goodsName }).join('/'),
      proofingQuantity: res1.data.categoryList.map(item => { return item.proofingQuantity }).join('/'),
    }
    formData.value = { ...res1.data, ...res2.data, ...drawerFormData.value, ...obj }
    emit('setDrawerFormData',formData.value)
  })
  getProofContractAudit(drawerFormData.value.procId).then(res=>{
    if (res.code==200) {
      auditHistory.value = res.data
    }
  })
}
//大货合同详情
function getBulk(params) {
  let task = getBulkTask(drawerFormData.value.id)
  let proof = getBulkProofingDetail(drawerFormData.value.processParentId,{orderType:drawerFormData.value.parentProcType})
  let bulk = getBulkProc(drawerFormData.value.processParentId,{orderType:drawerFormData.value.parentProcType})
  Promise.all([task,proof,bulk]).then(([res1,res2,res3])=>{
    let proof = res2.data.map(item=>{
      item.categoryName = item.categoryList.map(e => { return e.goodsName }).join('/'); 
      item.proofingQuantity = item.categoryList.map(e => { return e.proofingQuantity }).join('/'); 
      return item
    })
    let bulk = res3.data.map(item=>{
      item.categoryName = item.categoryList.map(e => { return e.goodsName }).join('/'); 
      item.bulkProdQuantity = item.categoryList.map(e => { return e.bulkProdQuantity }).join('/'); 
      return item
    })
    formData.value = {...res1.data,proof:proof,bulk:bulk}
    emit('setDrawerFormData',formData.value)
  })
  getBulkContractAudit(drawerFormData.value.procId).then(res=>{
    if (res.code==200) {
      auditHistory.value = res.data
    }
  })
}
//供应商合同(大货)详情
function supplierBulk(){
  let task = getBulkDesignProcTask(drawerFormData.value.id)
  let proc = getBulkDesignProc(drawerFormData.value.procId)
  Promise.all([task,proc]).then(([res1,res2])=>{
    formData.value = {...res1.data,...res2.data}
    emit('setDrawerFormData',formData.value)
  })
  if (drawerFormData.value.bulkQuoteId) {
    getSupplierContractAudit(drawerFormData.value.bulkQuoteId).then(res=>{
      if (res.code==200) {
        auditHistory.value = res.data
      }
    })
  }
  
}
//大货方案设计详情
function getBulkDesing(){
  let proc = getBulkDesignDetail(drawerFormData.value.processParentId)
  let task = getDesignOrderTask(drawerFormData.value.id)
  Promise.all([proc, task]).then(([res1, res2])=>{
    let obj = {
      categoryName: res1.data.categoryList.map(item => { return item.goodsName }).join('/'),
      bulkProdQuantity: res1.data.categoryList.map(item => { return item.bulkProdQuantity }).join('/'),
    }
    formData.value = { ...res1.data, ...res2.data, ...drawerFormData.value, ...obj }
    emit('setDrawerFormData',formData.value)
  })
  getDesignServiceContractAudit(drawerFormData.value.procId).then(res=>{
    if (res.code==200) {
      auditHistory.value = res.data
    }
  })
}
// 获取结算方式
function gradingCalculateFn() {
	gradingCalculate().then((res) => {
		methodList.value = res.data.more_settlement_method.map(item=>{
      return {
        ...item,
        label:item.optionDesc,
        value:item.id,
        elTagType:''
      }
    })
	})
}
gradingCalculateFn()
function getCustomerDetail(){
  if (!drawerFormData.value.customerId) {
    return
  }
  customerdata(drawerFormData.value.customerId).then(res=>{
    customer.value = res.data
  })
}
</script>

<style lang="scss" scoped>
.contract-history{
  padding: 10px;
  border-radius: 4px;
  background-color: #f7f7f7;
}
.history-label{
  width: 120px;
  text-align: right;
  margin-right: 10px;
}
.contract-history-box{
  color: #606266;
  font-size: 14px;
  border: 1px solid #cecece;
  border-radius: 6px;
  margin-top: 10px;
}
</style>
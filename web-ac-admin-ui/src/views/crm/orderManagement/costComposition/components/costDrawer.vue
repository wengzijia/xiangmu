<template>
  <el-drawer v-model="costShow" direction="rtl" :title="costStructureStatus == 1 ? '上传成本构成' : '成本构成'" size="600px"
    @close="cancelClick">
    <template #default>
      <div>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="134px" class="demo-ruleForm"
          size="default" status-icon>
          <el-form-item label="全成本核算表：" prop="allCostCalculateExcelUrl">
            <crmFileUpload v-if="costStructureStatus == '1'" v-model:modelValue="
              ruleForm.allCostCalculateExcelUrl
            " name="上传文件" :fileType="['xlsx','xls']" :del="true" replace></crmFileUpload>
            <div v-if="costStructureStatus == '2'" class="flex1">
              <span class="fileNameHidden">{{
                ruleForm.allCostCalculateExcelName
              }}</span>
              <span class="fileDownload" @click="
                singleDownloadFn(
                  ruleForm.allCostCalculateExcelUrl
                )
              ">下载</span>
            </div>
          </el-form-item>
        </el-form>
        <h3 class="proofTitle">成本详情</h3>
        <div class="costDetails">
          <p style="font-size: 14px;" v-if="parentProcType!=='bulk_order' ">
            <span class="alignRight">方案设计成本费：</span>
            <span>{{showMoney(designTaxInclusiveCostFee)}} (含税)</span>
          </p>
          <h3 v-if="proofingList.length">打样</h3>
          <div v-for="item in proofingList" :key="item.id">
            <div style="margin-left: 36px">
              打样工单号：{{ item.businessKey }}
            </div>
            <div class="proofingInfo">
              <p>  
                <el-tooltip class="box-item" effect="dark" placement="top-end">
                  <template #content>
                    <span class="alignRight">品类：</span>
                    <span v-for="(e, i) in item.categoryList" :key="e.id">
                      <span>&nbsp;{{ i > 0 ? '/' : '' }}&nbsp;</span>{{ e.goodsName }}
                    </span>
                  </template>
                  <div class="hiddenTxt">
                    <span class="alignRight">品类：</span>
                    <span v-for="(e, i) in item.categoryList" :key="e.id">
                      <span>&nbsp;{{ i > 0 ? '/' : '' }}&nbsp;</span>{{ e.goodsName }}
                    </span>
                  </div>
                </el-tooltip>
              </p>
              <p>
                <span class="alignRight">打样数量：</span>
                <span v-for="(e, i) in item.categoryList" :key="e.id">
                  <span>&nbsp;{{ i > 0 ? '/' : '' }}&nbsp;</span>{{ e.proofingQuantity }}
                </span>
              </p>
              <p>
                <span class="alignRight">供应商打样费：</span>{{ showMoney(item.supplierProofingTaxInclusiveFee) }}
              </p>
              <p>
                <span class="alignRight">打样成本核算表：</span>
                <span class="fileNameHidden">{{
                  item.supplierCostCalculateExcelName
                }}</span>
                <span class="fileDownload" @click="
                  singleDownloadFn(
                    item.supplierCostCalculateExcelUrl
                  )
                ">下载</span>
              </p>
              <p>
                <span class="alignRight">打样物流费：</span>
                {{ showMoney(item.logisticsTaxInclusiveFee) }}
              </p>
              <p>
                <span class="alignRight">打样物流单据：</span>
                <span class="fileNameHidden">{{
                  item.logisticsDocumentsName
                }}</span>
                <span class="fileDownload" @click="
                  singleDownloadFn(
                    item.logisticsDocumentsUrl
                  )
                ">下载</span>
              </p>
              <p>
                <span class="alignRight">打样供应商发票：</span>
                <span class="fileNameHidden">{{
                  item.supplierInvoiceName
                }}</span>
                <span class="fileDownload" @click="
                  singleDownloadFn(
                    item.supplierInvoiceUrl
                  )
                ">下载</span>
              </p>
            </div>
          </div>
          <h3 v-if="bulkList.length">大货</h3>
          <div v-for="item in bulkList" :key="item.id">
            <div style="margin-left: 36px">
              大货工单号：{{ item.bulkBusinessKey }}
            </div>
            <div class="proofingInfo">
              <p>
                <el-tooltip class="box-item" effect="dark" placement="top-end">
                  <template #content>
                    <span class="alignRight">品类：</span><span v-for="(e, i) in item.categoryList" :key="e.id">
                      <span>&nbsp;{{ i > 0 ? '/' : '' }}&nbsp;</span>{{ e.goodsName }}</span>
                  </template>
                  <div class="hiddenTxt">
                    <span class="alignRight">品类：</span><span v-for="(e, i) in item.categoryList" :key="e.id">
                      <span>&nbsp;{{ i > 0 ? '/' : '' }}&nbsp;</span>{{ e.goodsName }}</span>
                  </div>
                </el-tooltip>


              </p>
              <p>
                <span class="alignRight">大货生产数量：</span><span v-for="(e, i) in item.categoryList" :key="e.id">
                  <span>&nbsp;{{ i > 0 ? '/' : '' }}&nbsp;</span>{{ e.bulkProdQuantity }}</span>
              </p>
              <p>
                <span class="alignRight">大货生产费：</span>{{ showMoney(item.bulkProdTaxInclusiveFee) }}
              </p>
              <p>
                <span class="alignRight">大货物流费：</span>
                {{ showMoney(item.bulkLogisticsTaxInclusiveFee)}}
              </p>
              <p>
                <span class="alignRight">大货成本核算表：</span>
                <span class="fileNameHidden">{{
                  item.costCalculateExcelName
                }}</span>
                <span class="fileDownload" @click="
                  singleDownloadFn(
                    item.costCalculateExcelUrl
                  )
                ">下载</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto" v-if="costStructureStatus == '1'">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">提交</el-button>
      </div>
      <div style="flex: auto" v-else>
        <el-button type="primary" @click="cancelClick">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>





// 域名
import { BASE_FILE_URL } from '@/store/global-constant'
import crmFileUpload from '@/components/FileUpload/crmFileUpload.vue'
import { ElMessage } from 'element-plus'
import {
  projectDesignOrderTask,
  bulkContractTask,
  proofingAllData,
  bulkAllData,
  projectDesignCost,
  bulkContractCost,
} from '@/api/orderManagement/costComposition'
import { validateForms } from '@/utils/form'
const emits = defineEmits(['costStructureFn'])
const ruleFormRef = ref()
const data = reactive({
  costShow: false,
  parentProcType: '', //订单类型
  costStructureStatus: '1', //上传状态还是已上传状态
  designTaxInclusiveCostFee: '', //方案设计成本费(含税)
  proofingList: [], //打样详情信息
  bulkList: [], //大货详情信息
})
const ruleForm = reactive({
  allCostCalculateExcelName: '', //全成本核算表名称
  allCostCalculateExcelUrl: '', //全成本核算表url
  id: '', //节点id
})
const {
  costShow,
  parentProcType,
  costStructureStatus,
  designTaxInclusiveCostFee,
  proofingList,
  bulkList,
} = toRefs(data)
const rules = reactive({
  allCostCalculateExcelUrl: [
    {
      required: true,
      message: '请上传全成本核算表',
      trigger: 'change',
    },
  ],
})
// 文件下载
const singleDownloadFn = (paymentUrl) => {
  window.location.href =
    '/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName=' +
    paymentUrl
}

// 通过订单id获得打样所有数据
const proofingAllDataFn = (orderId, orderType) => {
  proofingAllData(orderId, orderType).then((res) => {
    // console.log('获得打样所有数据res====', res)
    proofingList.value = res.data
  })
}
// 通过订单id获得大货流程
const bulkAllDataFn = (orderId, orderType) => {
  bulkAllData(orderId, orderType).then((res) => {
    // console.log('通过订单id获得大货流程res====', res)
    bulkList.value = res.data
  })
}
// 方案设计订单获取全成本核算表和方案设计成本费(含税)
const projectDesignOrderTaskFn = (id) => {
  projectDesignOrderTask(id).then((res) => {
    // console.log('方案设计订单全成本核算表和方案设计成本费', res)
    ruleForm.allCostCalculateExcelName = res.data.allCostCalculateExcelName
    ruleForm.allCostCalculateExcelUrl = res.data.allCostCalculateExcelUrl
    designTaxInclusiveCostFee.value = res.data.designTaxInclusiveCostFee
  })
}
// 大货订单全成本核算表和方案设计成本费
const bulkContractTaskFn = (id) => {
  bulkContractTask(id).then((res) => {
    // console.log('大货订单全成本核算表和方案设计成本费', res)
    ruleForm.allCostCalculateExcelName = res.data.allCostCalculateExcelName
    ruleForm.allCostCalculateExcelUrl = res.data.allCostCalculateExcelUrl
    designTaxInclusiveCostFee.value = res.data.designTaxInclusiveCostFee
  })
}

// 方案设计的成本构成
const projectDesignCostFn = () => {
  projectDesignCost(ruleForm).then((res) => {
    // console.log('projectDesignCost=方案设计的成本构成==', res)
    if (res.code == 200) {
      ElMessage({
        message: '上传成本构成成功',
        type: 'success',
      })
      cancelClick()
      emits('costStructureFn', 1)
    }
  })
}
// 大货订单和大货设计生产订单的成本构成
const bulkContractCostFn = () => {
  bulkContractCost(ruleForm).then((res) => {
    // console.log('大货订单和大货设计生产订单的成本构成==', res)
    if (res.code == 200) {
      ElMessage({
        message: '上传成本构成成功',
        type: 'success',
      })
      cancelClick()
      emits('costStructureFn', 1)
    }
  })
}
// 获取路径的名字
const fileName = (url) => {
  if (url) {
    let urlList = url.split('/')
    return urlList[urlList.length - 1].replace('filemanage', '')
  }
}
const cancelClick = () => {
  costShow.value = false
  ruleFormRef.value.resetFields()
}
const confirmClick = () => {
  let formRefs = [ruleFormRef.value]
  validateForms(formRefs)
    .then(() => {
      ruleForm.allCostCalculateExcelName = fileName(
        ruleForm.allCostCalculateExcelUrl
      )
      if (parentProcType.value == 'project_design_order') {
        projectDesignCostFn()
      } else {
        bulkContractCostFn()
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
const openCost = (item, status) => {
  costShow.value = true
  ruleForm.id = item.id
  parentProcType.value = item.parentProcType
  costStructureStatus.value = status
  // console.log('订单状态==', parentProcType.value)
  // 通过订单id获得打样所有数据
  proofingAllDataFn(item.processParentId, { orderType: item.parentProcType })
  if (parentProcType.value != 'project_design_order') {
    bulkAllDataFn(item.processParentId, { orderType: item.parentProcType })
  }
  if (parentProcType.value == 'project_design_order') {
    projectDesignOrderTaskFn(item.id)
  } else {
    bulkContractTaskFn(item.id)
  }
}
defineExpose({
  openCost,
})
</script>

<style scoped>
.costDetails {
  color: #333;
  margin-left: 50px;
}

.alignRight {
  display: inline-block;
  width: 130px;
  text-align: right;
}

.proofingInfo {
  margin-left: 40px;
  font-size: 14px;
  color: #606266;
}

.proofingInfo>p {
  display: flex;
  align-items: center;
}

.proofTitle {
  display: flex;
  align-content: center;
  color: #333;
}

.proofTitle::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 20px;
  margin-right: 10px;
  background: #ff3399;
}

.fileDownload {
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}

.fileNameHidden {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.flex1 {
  display: flex;
  align-items: center;
}

.hiddenTxt {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<template>
  <el-form label-width="130px" ref="dialogForm" v-if="istype == '1'">
    <div>审核</div>
    <el-form-item label="审核结果:" required>
      <div>
        <el-radio-group v-model="examine">
          <el-radio :label="0" size="large">审核不通过</el-radio>
          <el-radio :label="1" size="large">审核通过</el-radio>
        </el-radio-group>
      </div>
    </el-form-item>
    <el-form-item v-show="(examine == 0)" label="审核不通过原因:" required>
      <div>
        <el-input v-model.trim="remake" placeholder="请输入审核不通过原因" show-word-limit maxlength="300" clearable
          style="width:252px;" />
      </div>
    </el-form-item>
  </el-form>

  <el-form label-width="150px" v-else>
    <el-form-item label="审核结果:" required>
      <div>
        <DictTag
          style="display: inline-block"
          :value="voucher?.accountStatementAuditStatus"
          :options="basic_approval_status"
        />
      </div>
    </el-form-item>
    <el-form-item v-show="examine == 0&&voucher?.accountStatementAuditStatus==3" label="审核不通过原因:" required>
      <div style="word-break: break-all;">
        {{ voucher?.submitGeneralAccountStatementRejectReason || "-" }}
      </div>
    </el-form-item>
  </el-form>

  <el-form :model="formData" label-width="120px">
    <!-- <div>订单信息</div>
    <el-form-item label="设计服务合同:">
      <div>
        <span>{{ formData.designServiceContractName }}</span>
        <el-link
          :underline="false"
          :href="BASE_FILE_URL + formData.designServiceContractUrl"
          style="margin-left: 20px"
          >下载</el-link
        >
      </div>
    </el-form-item> -->
    <div>订单信息</div>
    <el-form-item label="订单总价:">
      <div>{{ showMoney(voucher?.orderTaxInclusiveTotalPrice || "-") }}</div>
    </el-form-item>
    <!-- <el-form-item label="结算方式:">
      <div>
        <settlementMethod
          v-if="risklist?.more_settlement_method"
          :methodId="detaildata?.settlementMethod"
          :methodList="risklist.more_settlement_method"
        />
      </div>
    </el-form-item> -->
    <el-form-item label="尾款最晚日期:">
      <div>{{ detaildata?.performancePaymentRecord?.finalPaymentLatestDate || "-" }}</div>
    </el-form-item>
  </el-form>


  <el-form :model="formData" label-width="120px">
    <div>对账单</div>
    <el-form-item label="对账单:">
      <div>
        <template v-if="voucher?.generalAccountStatementName.indexOf('.pdf')>-1||voucher?.generalAccountStatementName.indexOf('.xls')>-1">
          <span>{{voucher?.generalAccountStatementName}}</span>
        </template>
        <template v-else>
          <img v-if="voucher?.generalAccountStatementUrl.indexOf('.png')>-1||voucher?.generalAccountStatementUrl.indexOf('.jpg')>-1" width="150" :src="BASE_FILE_URL+voucher?.generalAccountStatementUrl" alt="">
        </template>
        <el-link v-if="voucher?.generalAccountStatementUrl" :underline="false" :href="BASE_FILE_URL+voucher?.generalAccountStatementUrl" style="color:#409eff;">下载</el-link>
      </div>
    </el-form-item>
    <el-form-item label="备注:">
      <div style="word-break: break-all;">
        {{voucher?.submitGeneralAccountStatementRemark||'-'}}
      </div>
    </el-form-item>
  </el-form>
  
  <el-form :model="formData" label-width="120px">
      <div>订单信息</div>
      <el-form-item label="大货合同:" v-if="detaildata?.procType!='project_design_order'">
        <div>
          <span>{{detaildata?.bulkContractProc?.bulkContractName || '-'}}</span>
          <el-link v-if="detaildata?.bulkContractProc?.bulkContractUrl" :underline="false" :href="BASE_FILE_URL+detaildata?.bulkContractProc?.bulkContractUrl" style="color:#409eff;">下载</el-link>
        </div>
      </el-form-item>
      
      <el-form-item label="设计服务合同:" v-if="detaildata?.procType!='bulk_order'">
        <div>
          <span>{{detaildata?.projectDesignProc?.designServiceContractName || '-'}}</span>
          <el-link v-if="detaildata?.projectDesignProc?.designServiceContractUrl" :underline="false" :href="BASE_FILE_URL+detaildata?.projectDesignProc?.designServiceContractUrl" style="color:#409eff;">下载</el-link>
        </div>
      </el-form-item>
      
      <el-form-item label="全成本核算表:" v-if="detaildata?.procType=='project_design_order'">
        <div>
          <span>{{detaildata?.allCostCalculateExcelName || '-'}}</span>
          <el-link v-if="detaildata?.allCostCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+detaildata?.allCostCalculateExcelUrl" style="color:#409eff;">下载</el-link>
        </div>
      </el-form-item>

      <el-form-item label="全成本核算表:" v-else>
        <div>
          <span>{{detaildata?.bulkContractProc?.allCostCalculateExcelName || '-'}}</span>
          <el-link v-if="detaildata?.bulkContractProc?.allCostCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+detaildata?.bulkContractProc?.allCostCalculateExcelUrl" style="color:#409eff;">下载</el-link>
        </div>
      </el-form-item>

      <!-- <el-form-item label="方案设计成本费:" v-if="detaildata?.procType!='bulk_order'">
        <div>
          {{detaildata?.projectDesignProc?.designTaxInclusiveCostFee}}
        </div>
      </el-form-item> -->

  </el-form>

  <el-form :model="formData" label-width="120px">
      <div>成本详情</div>
      <div style="margin-top:10px;">方案设计</div>
      <el-form-item label="方案设计成本费:" v-if="detaildata?.procType!='bulk_order'">
        <div>
          {{showMoney(detaildata?.projectDesignProc?.designTaxInclusiveCostFee)}}（含税）
        </div>
      </el-form-item>

  </el-form>

  <div v-if="prodata?.length">
    <h4 class="title">打样</h4>
    <el-form :model="formData" label-width="130px">
    <div v-for="(item, i) in prodata" :key="i">
      <!-- <p>
        <span class="alignRight"> 打样工单号：</span>
        {{ item?.businessKey || "-" }}
      </p> -->
      <el-form-item label="打样工单号：">
        <div>
          <span>
            {{ item?.businessKey || "-" }}
          </span>
        </div>
      </el-form-item>
      <!-- <p>
        <span class="alignRight"> 品类：</span>
        <span v-for="(citem,index) in item.categoryList" :key="citem">
          <span v-if="index!=0"> / </span>
          {{ citem.goodsName }}
        </span>
      </p> -->
      <el-form-item label="品类：">
        <div>
          <span v-for="(citem,index) in item.categoryList" :key="citem">
          <span v-if="index!=0"> / </span>
            {{ citem.goodsName }}
          </span>
        </div>
      </el-form-item>

      <!-- <p>
        <span class="alignRight"> 打样数量：</span>
        <span v-for="(citem,index) in item.categoryList" :key="citem"><span v-if="index!=0"> / </span>{{ citem.proofingQuantity }}</span>
      </p> -->

      <el-form-item label="打样数量：">
        <div>
          <span v-for="(citem,index) in item.categoryList" :key="citem"><span v-if="index!=0"> / </span>{{ citem.proofingQuantity }}</span>
        </div>
      </el-form-item>

      <el-form-item label="供应商打样费：">
        <div>
          <span>{{ showMoney(item?.supplierProofingTaxInclusiveFee) }}</span>
        </div>
      </el-form-item>

      <el-form-item label="打样成本核算表：">
        <div>
          <span>{{ item?.supplierCostCalculateExcelName || "-" }}</span>
          <el-link v-if="item?.supplierCostCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+item?.supplierCostCalculateExcelUrl" style="color:#409eff;">下载</el-link>
        </div>
      </el-form-item>

      <el-form-item label="打样物流费：">
        <div>
          <span>{{ showMoney(item?.logisticsTaxInclusiveFee) }}</span>
        </div>
      </el-form-item>

      <el-form-item label="打样物流单据：">
        <div>
          <span>{{ item?.logisticsDocumentsName || "-" }}</span>
          <el-link v-if="item?.logisticsDocumentsUrl" :underline="false" :href="BASE_FILE_URL+item?.logisticsDocumentsUrl" style="color:#409eff;">下载</el-link>
        </div>
      </el-form-item>

      <el-form-item label="打样供应商发票：">
        <div>
          <span>{{ item?.supplierInvoiceName || "-" }}</span>
          <el-link v-if="item?.supplierInvoiceUrl" :underline="false" :href="BASE_FILE_URL+item?.supplierInvoiceUrl" style="color:#409eff;">下载</el-link>

        </div>
      </el-form-item>

      
    </div>
    </el-form>
  </div>

  <div v-if="bgoodsdata?.length">
    <h4 class="title">大货</h4>
    <el-form :model="formData" label-width="130px">
    <div v-for="(item, i) in bgoodsdata" :key="i">

      <!-- <p>
        <span class="alignRight"> 大货工单号：</span>
        {{ item?.bulkBusinessKey || "-" }}
      </p> -->

      <el-form-item label="大货工单号：" v-if="detaildata?.procType!='project_design_order'">
        <div>
          <span>{{ item?.bulkBusinessKey || "-" }}</span>
        </div>
      </el-form-item>

      <el-form-item label="品类：" v-if="detaildata?.procType!='project_design_order'">
        <div>
          <span v-for="(citem,index) in item.categoryList" :key="citem"><span v-if="index!=0"> / </span>{{ citem.goodsName }}</span>
        </div>
      </el-form-item>

      <!-- <p>
        <span class="alignRight"> 品类：</span>
        <span v-for="(citem,index) in item.categoryList" :key="citem"
          ><span v-if="index!=0"> / </span>{{ citem.goodsName }}</span
        >
      </p> -->

      <el-form-item label="大货生产数量：" v-if="detaildata?.procType!='project_design_order'">
        <div>
          <span v-for="(citem,index) in item.categoryList" :key="citem"
          ><span v-if="index!=0"> / </span>{{ citem.bulkProdQuantity }}</span
        >
        </div>
      </el-form-item>
      <!-- <p>
        <span class="alignRight"> 大货生产数量：</span>
        <span v-for="(citem,index) in item.categoryList" :key="citem"
          ><span v-if="index!=0"> / </span>{{ citem.bulkProdQuantity }}</span
        >
      </p> -->

      <el-form-item label="大货生产费：" v-if="detaildata?.procType!='project_design_order'">
        <div>
          <span>{{ showMoney(item?.bulkProdTaxInclusiveFee) }}</span>
        </div>
      </el-form-item>
      <!-- <p>
        <span class="alignRight"> 大货生产费：</span>
        {{ showMoney(item?.bulkProdTaxInclusiveFee) }}
      </p> -->
      <el-form-item label="大货物流费：" v-if="detaildata?.procType!='project_design_order'">
        <div>
          <span>{{ showMoney(item?.bulkProductionProc?.bulkLogisticsTaxInclusiveFee) }}</span>
        </div>
      </el-form-item>
      <!-- <p>
        <span class="alignRight"> 大货物流费：</span>
        {{ showMoney(item?.bulkProductionProc?.bulkLogisticsTaxInclusiveFee) }}
      </p> -->
      <el-form-item label="大货成本核算表：" v-if="detaildata?.procType!='project_design_order'">
        <div>
          <span>{{ item?.costCalculateExcelName || "-" }}</span>
          <el-link  v-if="item?.costCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+item?.costCalculateExcelUrl" style="color:#409eff;">下载</el-link>
        </div>
      </el-form-item>
      <!-- <p>
        <span class="alignRight"> 大货成本核算表：</span>
        {{ item?.costCalculateExcelName || "-" }}
        <el-link  v-if="item?.costCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+item?.costCalculateExcelUrl" style="color:#409eff;">下载</el-link>
      </p> -->
      
    </div>
    </el-form>
  </div>
  
    
</template>

<script setup>
import { validateForms, checkPhone, debounce } from "@/utils/form";
import { onMounted, onUnmounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { PaymentTask } from '@/api/crm/finance/contract'
import { BASE_FILE_URL ,BASE_UPLOAD_FILE_URL} from "@/store/global-constant";
import settlementMethod from '@/components/settlementMethod/index.vue'
import { SetaccountStatementAudit } from '@/api/crm/finance/contract'
const { proxy } = getCurrentInstance();
const { basic_approval_status } = proxy.useDict(
  "basic_approval_status"
);
const props = defineProps({
  istype: {
    type: String,
    default: "1",
  },
  detaildata: {
    type: Object,
    default: null,
  },
  listdata: {
    type: Object,
  },
  prodata: {
  	type: Array,
  	default: null,
  },
  bgoodsdata: {
  	type: Array,
  	default: null,
  },
  risklist:{
    type:Object
  },
  cancelClick:{
    type:Function
  }
});
// 接收父组件传来的方法
const emits = defineEmits(["cancelClick"]);

const formSize = ref("default");
const ruleFormRef = ref("");
const examine = ref(0)//审核是否通过
const remake = ref('')//驳回原因
const formData = reactive({
  contractUrl: "",
  ContractNo: "",
  contractPrice: "",
  contractTaxes: "",
});
const voucher = ref(null);
onMounted(() => {
 PaymentTask(props?.listdata.id).then(res=>{
  if(res.code===200){
    voucher.value=res.data
  }
 })
});

const confirmClick = ()=>{
  if(examine.value===0&&!remake.value){
    ElMessage.error('请输入审核不通过原因')
    return
  }
  ElMessageBox.confirm(
  "操作立即生效是否继续？",
  '是否立即提交',
  )
  .then(() => {
    console.log('11111',11);
    SetaccountStatementAudit({
      id: props?.listdata.id||'',
      passed: examine.value===1?true:false,
      rejectReason: remake.value
    }).then(res=>{
      if(res.code===200){
        emits("cancelClick")
        ElMessage.success('成功')
      }
    })
  })
  .catch(() => {
  });
}
// onUnmounted(() => {
// });



defineExpose({
  confirmClick
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
}
.alignRight {
  display: inline-block;
  width: 180px;
  text-align: right;
  margin-bottom: 20px;
}
.widthRight {
  width: 80px;
  margin-bottom: 16px;
}
</style>

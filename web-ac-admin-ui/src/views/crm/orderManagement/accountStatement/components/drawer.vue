<template>
  <div class="lookDetail">
    <div>
      <div v-if="status==1||status==2">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item label="上传总对账单" prop="accsurl">
            <crmFileUpload
              v-model:modelValue="ruleForm.accsurl"
              name="立即上传"
              :fileType="['png', 'jpg', 'jpeg','pdf','xls','xlsx']"
              :fileSize="10"
              :del="true"
              replace
            ></crmFileUpload>
          </el-form-item>

          <el-form-item label="订单总价" prop="price">
            <!-- <el-input v-model="ruleForm.price" /> -->
            <el-input-number
              style="width:356px"
              class="numinp"
              :controls="false"
              v-model="ruleForm.price"
              placeholder="请输入本订单对账订单总价（含税）"
              :max="999999999.99"
              :precision="2" 
              :min="0"
            />
          </el-form-item>

          <el-form-item
            label="备注"
            prop="remarks"
          >
            <el-input
              v-model="ruleForm.remarks"
              maxlength="300"
              placeholder="请输入备注内容"
              show-word-limit
              type="textarea"
            />
          </el-form-item>

          <el-form-item
            label="尾款最晚日期"
          >
          <span style="color:#FF3399">{{detaildata?.projectDesignProc?.finalPaymentLatestDate ?? detaildata?.bulkContractProc?.finalPaymentLatestDate}}</span>
          </el-form-item>
          
          <!-- <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >Create</el-button
            >
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </el-form-item> -->
        </el-form>
      </div>

      <div v-else>
        <h4 class="title">对账单</h4>
        <el-form :model="formData" label-width="140px">
          <el-form-item label="对账单：">
            <div class="textwrap">
              {{voucher?.generalAccountStatementName ?? '-'}}
              <el-link v-if="voucher?.generalAccountStatementName" :underline="false" :href="BASE_FILE_URL+voucher?.generalAccountStatementUrl" style="color:#409eff;">下载</el-link>
            </div>
          </el-form-item>
          <el-form-item label="订单总价：">
            {{showMoney(voucher?.orderTaxInclusiveTotalPrice ?? '-')}}
          </el-form-item>

          <el-form-item label="备注：">
            <div>{{voucher?.submitGeneralAccountStatementRemark || '-'}}</div>
          </el-form-item>

          <el-form-item label="尾款最晚日期：">
            {{detaildata?.projectDesignProc?.finalPaymentLatestDate ?? detaildata?.bulkContractProc?.finalPaymentLatestDate}}
          </el-form-item>
        </el-form>
      </div>
      <el-form :model="formData" label-width="140px">
      <div style="max-width: 550px;">
        <h4 class="title">订单信息</h4>
          <!-- <p>
            <span class="alignRight"> 结算方式：</span>

            <settlementMethod
              v-if="risklist?.more_settlement_method"
              :methodId="detaildata?.performancePaymentRecord.settlementMethod"
              :methodList="risklist.more_settlement_method"
            />
          </p> -->

          <el-form-item label="设计服务合同：" v-if="ctype!='bulk_order'">
            <div class="textwrap">
              {{detaildata?.projectDesignProc?.designServiceContractName || '-'}}
              <el-link v-if="detaildata?.projectDesignProc?.designServiceContractUrl" :underline="false" :href="BASE_FILE_URL+detaildata?.projectDesignProc?.designServiceContractUrl" style="color:#409eff">下载</el-link>
            </div>
          </el-form-item>

          <el-form-item label="大货合同：" v-if="ctype!='project_design_order'">
            <div class="textwrap">
              {{detaildata?.bulkContractProc.bulkContractName || '-'}}
              <el-link v-if="detaildata?.bulkContractProc.bulkContractUrl" :underline="false" :href="BASE_FILE_URL+detaildata?.bulkContractProc.bulkContractUrl" style="color:#409eff">下载</el-link>
            </div>
          </el-form-item>
          
          <el-form-item label="全成本核算表：" v-if="ctype==='project_design_order'">
            <div class="textwrap">
              {{detaildata?.allCostCalculateExcelName || '-'}}
              <el-link v-if="detaildata?.allCostCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+detaildata?.allCostCalculateExcelUrl" style="color:#409eff">下载</el-link>
            </div>
          </el-form-item>

          <el-form-item label="全成本核算表：" v-else>
            <div class="textwrap">
              {{detaildata?.bulkContractProc.allCostCalculateExcelName || '-'}}
              <el-link v-if="detaildata?.bulkContractProc.allCostCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+detaildata?.bulkContractProc.allCostCalculateExcelUrl" style="color:#409eff">下载</el-link>
            </div>
          </el-form-item>

          <!-- <p v-if="ctype!='bulk_order'">
            <span class="alignRight">方案设计成本费：</span>
            {{detaildata?.projectDesignProc.designTaxInclusiveCostFee || '-'}}
          </p> -->
      </div>
      
      <div v-if="ctype!='bulk_order'">
        <h4 class="title">成本详情</h4>
        <h4 class="title">方案设计</h4>
          <el-form-item label="方案设计成本费：">
            <div>
              {{showMoney(detaildata?.projectDesignProc.designTaxInclusiveCostFee) }}
              <span v-if="detaildata?.projectDesignProc?.designTaxInclusiveCostFee">(含税)</span>
            </div>
          </el-form-item>
      </div>

      <el-form :model="formData" label-width="140px" v-if="prodata?.length">
        <h4 class="title">打样</h4>
        <div v-for="(item,i) in prodata" :key="i" style="max-width: 550px;">
          <el-form-item label="打样工单号：">
            <div>
              {{item?.businessKey || '-'}}
            </div>
          </el-form-item>
          <el-form-item label="品类：">
            <div>
              <span v-for="(citem,index) in item.categoryList" :key="citem">
                <span v-if="index!=0"> / </span>
                {{citem.goodsName}}
              </span>
            </div>
          </el-form-item>

          <el-form-item label="打样数量：">
            <div>
              <span v-for="(citem,index) in item.categoryList" :key="citem">
                <span v-if="index!=0"> / </span>
                {{citem.proofingQuantity}}
              </span>
            </div>
          </el-form-item>

          <el-form-item label="供应商打样费：">
            <div>
              {{showMoney(item?.supplierProofingTaxInclusiveFee)}}
            </div>
          </el-form-item>

          <el-form-item label="打样成本核算表：">
            <div class="textwrap">
              {{item?.supplierCostCalculateExcelName || '-'}}
              <el-link v-if="item?.supplierCostCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+item?.supplierCostCalculateExcelUrl" style="color:#409eff;">下载</el-link>
            </div>
          </el-form-item>
          <el-form-item label="打样物流费：">
            <div>
              {{showMoney(item?.logisticsTaxInclusiveFee)}}
            </div>
          </el-form-item>
          <el-form-item label="打样物流单据：">
            <div class="textwrap">
              {{item?.logisticsDocumentsName || '-'}}
              <el-link v-if="item?.logisticsDocumentsUrl" :underline="false" :href="BASE_FILE_URL+item?.logisticsDocumentsUrl" style="color:#409eff;">下载</el-link>
            </div>
          </el-form-item>
          <el-form-item label="打样供应商发票：">
            <div class="textwrap">
              {{item?.supplierInvoiceName || '-'}}
              <el-link v-if="item?.supplierInvoiceUrl" :underline="false" :href="BASE_FILE_URL+item?.supplierInvoiceUrl" style="color:#409eff;">下载</el-link>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <el-form :model="formData" label-width="140px" v-if="bgoodsdata?.length">
        <h4 class="title">大货</h4>
        <div v-for="(item,i) in bgoodsdata" :key="i">
          <el-form-item label="大货工单号：">
            {{item?.bulkBusinessKey || '-'}}
          </el-form-item>
          <el-form-item label="品类：">
            <span v-for="(citem,index) in item.categoryList" :key="citem">
              <span v-if="index!=0"> / </span>
              {{citem.goodsName}}
            </span>
          </el-form-item>
          <el-form-item label="大货生产数量：">
            <span v-for="(citem,index) in item.categoryList" :key="citem"><span v-if="index!=0"> / </span>{{citem.bulkProdQuantity}}</span>
          </el-form-item>
          <el-form-item label="大货生产费：">
            {{showMoney(item?.bulkProdTaxInclusiveFee) }}
          </el-form-item>
          <el-form-item label="大货成本核算表：">
            <div class="textwrap">
              {{item?.costCalculateExcelName || '-'}}
              <el-link v-if="item?.costCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+item?.costCalculateExcelUrl" style="color:#409eff;">下载</el-link>
            </div>
          </el-form-item>
          <el-form-item label="大货物流费：">
            {{showMoney(item?.bulkProductionProc.bulkLogisticsTaxInclusiveFee)}}
          </el-form-item>
          
        </div>
      </el-form>
      
      </el-form>

      <div v-if="status!=1&&rejdata&&rejdata.length > 0">
				<h4 class="title">驳回记录</h4>
				<div class="contactPerson" v-for="(item,index) in rejdata" :key="index">
					<el-form label-width="150px" :model="formData">
							<el-form-item label="驳回人：">
								{{ item.submitGeneralAccountStatementRejecterName||'-' }}
							</el-form-item>
							<el-form-item label="驳回原因：">
                <div>{{ item.submitGeneralAccountStatementRejectReason||'-' }}</div>
							</el-form-item>
							<el-form-item label="驳回时间：">
								{{ formatDate(item.submitGeneralAccountStatementRejectTime)||'-' }}
							</el-form-item>
							<el-form-item label="对账单：">
                <div>
                  {{ item.submitGeneralAccountStatementRejectName||'-' }}
                  <el-link v-if="item?.submitGeneralAccountStatementRejectUrl" :underline="false" :href="BASE_FILE_URL+item?.submitGeneralAccountStatementRejectUrl" style="color:#409eff;">下载</el-link>
                </div>
							</el-form-item>
					</el-form>
				</div>
			</div>

      <!-- 大货驳回记录 -->
      <!-- <div v-if="status!=1&&ctype!='project_design_order'&&bulkdata&&bulkdata.length > 0">
				<h4 class="title">驳回记录</h4>
				<div class="contactPerson">
					<ul v-for="(item,index) in bulkdata" :key="index">
						<li class="human">
							<p>
								<span class="alignRight widthRight"
									>驳回人：</span
								>{{ item.bulkContractRejectPersonName||'-' }}
							</p>
							<p>
								<span class="alignRight widthRight"
									>驳回原因：</span
								>{{ item.bulkContractRejectReason||'-' }}
							</p>
							<p>
								<span class="alignRight widthRight"
									>驳回时间：</span
								>{{ formatDate(item.bulkContractRejectTime)||'-' }}
							</p>
							<p>
								<span class="alignRight widthRight"
									>合同：</span
								>{{ item.bulkContractUrl||'-' }}
							</p>
						</li>
					</ul>
				</div>
			</div> -->
    </div>
  </div>
</template>

<script setup>
import {
  customerBaseInfo,
  crmProjectDesignOrderProc,
  crmBulkOrderProc,
  crmBulkDesignProdOrderProc,
  crmInvoiceConfig,
} from "@/api/orderManagement/subOrder";
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue";
import { BASE_FILE_URL } from "@/store/global-constant";
import { validateForms, checkPhone, debounce } from "@/utils/form";
import { onMounted, onUnmounted, computed } from "vue";
import { formatDate,formatDates } from '@/utils';
import { ElMessage, ElMessageBox } from "element-plus";
import { designservicecontract } from "@/api/crm/order/contract";
import { SubmitGeneralAccountStatement } from "@/api/crm/order/contract"
import { getFileName } from "@/utils/index";
import { PaymentTask } from '@/api/crm/finance/contract'
import settlementMethod from '@/components/settlementMethod/index.vue'
import {
  setcustomerapply,
  GetCustomer,
  SetCustomer,
} from "@/api/orderManagement/customer/index";
const { proxy } = getCurrentInstance();
const { crm_payment_type,crm_invoice_type } = proxy.useDict("crm_payment_type","crm_invoice_type");
const props = defineProps({
  status: {
    type: String,
    default: "1",
  },
  risklist: {
    type: Object,
  },
  detaildata: {
    type: Object,
    default: null,
  },
  cancelClick: {
    type: Function,
  },
  rejdata: {
  	type: Array,
  	default: null,
  },
  ctype: {
  	type: String,
  	default: '1',
  },
  nid:{
    type:String,
    default:''
  },
  prodata: {
  	type: Array,
  	default: null,
  },
  bgoodsdata: {
  	type: Array,
  	default: null,
  },
});
// 接收父组件传来的方法
const emits = defineEmits(["cancelClick"]);
const voucher = ref(null);
const formSize = ref("default");
const ruleFormRef = ref("");
const ruleForm = reactive({
  accsurl: "",
  price: null,
  remarks: "",
});
const formData=[]

const rules = reactive({
  accsurl: [
    {
      required: true,
      message: "请上传总对账单",
      trigger: "change",
    },
  ],
  price: [{ required: true, message: "请输入订单总价", trigger: "blur" }],
  
});
// 通过订单id获得打样数据，包括打样流程，打样流程品类
// const proofingProcOrderFn = (id,orderType) => {
// 	proofingProcOrder(id,{orderType}).then((res) => {
// 		console.log('res=======', res)
// 	})
// }

const submitForm = async (formEl) => {
  let prc=props.detaildata?.performancePaymentRecord?.contractTaxInclusiveTotalPrice
  if(!ruleForm.accsurl){
    ElMessage.error('请上传对账单')
    return
  }
  if(!ruleForm.price){
    ElMessage.error('请输入订单总价')
    return
  }
  if(prc&&ruleForm.price>prc){
    ElMessage.error('对账单总价不可大于合同总价')
    return
  }
  ElMessageBox.confirm(
  "确定提交审核吗？",
  '提交后需审核通过后才生效。',
  )
  .then(() => {
      
   SubmitGeneralAccountStatement({
    generalAccountStatementName:getFileName(ruleForm.accsurl),
    generalAccountStatementUrl:ruleForm.accsurl,
    id:props.nid,
    orderTaxInclusiveTotalPrice:ruleForm.price,
    submitGeneralAccountStatementRemark:ruleForm.remarks,
   }).then(res=>{
    if (res.code===200) {
      emits("cancelClick");
      ElMessage({
        type: 'success',
        message: '提交成功',
      })
    }
   })
    
  })
  .catch(() => {
    // catch error
  });
  // await formEl.validate((valid, fields) => {
  //   if (valid) {
  //     console.log("submit!");
  //   } else {
  //     console.log("error submit!", fields);
  //   }
  // });
};
// const submitFormfn = () => {
//   submitForm(ruleFormRef.value);
// };
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
onMounted(() => {
  if(props.status!=1){
    PaymentTask(props?.nid).then(res=>{
      if(res.code===200){
        voucher.value=res.data
      }
    })
    // ruleForm.contractUrl=props.detaildata?.designServiceContractUrl ?? ''
    // ruleForm.ContractNo=props.detaildata?.contractNo ?? ''
    // ruleForm.contractPrice=props.detaildata?.designServiceTaxInclusiveFee ?? ''
    // ruleForm.contractTaxes=props.detaildata?.designServiceTaxes ?? ''
  }

});
// onUnmounted(() => {
// });
// const options = Array.from({ length: 10000 }).map((_, idx) => ({
//   value: `${idx + 1}`,
//   label: `${idx + 1}`,
// }));

const confirmClick = () => {
  submitForm(ruleFormRef.value);
  // if(ruleForm.customerName&&ruleForm.moreSettlementMethod&&managementForm.customerManagementType&&managementForm.customerSoldType.length){
  //   ElMessageBox.confirm(
  //   "确定提交审核吗？",
  //   '提交后需审核通过后才生效。',
  //   )
  //   .then(() => {
  //     submitForm();
  //   })
  //   .catch(() => {
  //     // catch error
  //   });
  // }
  
};
defineExpose({
  confirmClick,
});
</script>

<style lang="scss" scoped>
.icons {
  color: #b3b3b3;
  font-size: 22px;
  vertical-align: middle;
  margin-left: 10px;
  cursor: pointer;
}
.lookDetail {
  display: flex;
}
.lookDetail :deep(.el-form-item__label) {
  font-weight: 700;
}

.customer {
  color: #b3b3b3;
  user-select: none;
}
.contactsbox {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 20px;
  .dialog-footer {
    text-align: right;
  }
}
ul,
li {
  list-style: none;
}
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
.human {
  width: 400px;
  margin: 10px;
  padding: 10px;
  padding-bottom: 0;
}
.contactPerson {
  max-width: 690px;
  display: flex;
  margin-right: 30px;
  overflow: auto;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 20px;
}
.invoice {
  width: 120px;
}
.laypage {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
.red {
  color: red;
}
.numinp :deep(.el-input__inner) {
    text-align: left !important;
}
.textwrap{
  white-space:normal;
  word-break:break-all;
  word-wrap:break-word; 
}
</style>

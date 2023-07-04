<template>
  <div>审核</div>
  <el-form label-width="150px" v-if="istype == '1'||istype == '3'">
    <el-form-item label="审核结果:" required>
      <div>
        <el-radio-group v-model="examine">
          <el-radio :label="0" size="large">审核不通过</el-radio>
          <el-radio :label="1" size="large">审核通过</el-radio>
        </el-radio-group>
      </div>
    </el-form-item>
    <el-form-item v-show="examine == 0" label="审核不通过原因:" required>
      <div>
        <el-input
          v-model.trim="remake"
          placeholder="请输入审核不通过原因"
          show-word-limit
          maxlength="100"
          clearable
          style="width: 252px"
        />
      </div>
    </el-form-item>
  </el-form>

  <el-form label-width="150px" v-else>
    <el-form-item label="审核结果:" required>
      <div>
        <DictTag
          style="display: inline-block"
          :value="listdata?.financialAuditStatus"
          :options="crm_audit_status"
        />
      </div>
    </el-form-item>
    <el-form-item v-show="examine == 0&&listdata?.financialAuditStatus==3" label="审核不通过原因:" required>
      <div>
        {{ listdata?.paymentRejectReason || "-" }}
      </div>
    </el-form-item>
  </el-form>

  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" v-if="istype==3">
    <el-tab-pane :label="aitem.orderBusinessKey" :name="aitem.orderBusinessKey" v-for="aitem in multipleSelection" :key="aitem.id"></el-tab-pane>
  </el-tabs>

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
      <div>{{ showMoney(detaildata?.orderTotalPrice || "-") }}</div>
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
  </el-form>

  <el-form label-width="120px" v-if="detaildata?.invoiceRecord?.invoiceList?.length">
    <div>开票信息</div>
    <el-table :data="detaildata?.invoiceRecord?.invoiceList" style="width: 100%" scrollbar-always-on>
				<el-table-column label="开票状态" prop="invoiceStatus" width="80">
					<template #default="scope">
						<DictTag :value="scope.row.invoiceStatus" :options="crm_invoice_status" />
					</template>
				</el-table-column>
				<el-table-column label="开票类型" prop="invoiceType" width="80">
					<template #default="scope">
						<DictText
								:value="scope.row.invoiceType"
								dict="crm_invoice_type"
							/>
					</template>
				</el-table-column>
        <el-table-column label="开票金额" prop="orderTaxInclusiveTotalPrice" width="150">
					<template #default="scope">
						<div style="text-align: right;">{{ showMoney(scope.row.orderTaxInclusiveTotalPrice) }}</div>
					</template>
				</el-table-column>
				<el-table-column label="开票时间" prop="invoiceEntity" width="180">
          <template #default="scope">
						<div style="text-align: right;">{{formatDate(scope.row?.invoiceTime) || "-"}}</div>
					</template>
        </el-table-column>
				<el-table-column label="凭证/物流单号" prop="invoiceUrl/logisticsNumber">
					<template #default="scope">
						<span v-if="scope.row?.invoiceUrl">
							<span v-if="scope.row?.invoiceName">{{ scope.row?.invoiceName }}<singDownFile :url="scope.row?.invoiceUrl" view style="margin-left: 6px;"/></span>
							<span v-else>
								<el-link :underline="false" type="primary" @click="showFile(scope.row?.invoiceUrl)">查看</el-link>
							</span>
						</span>
						<span v-else>{{ scope.row?.logisticsNumber||'-' }}</span>
					</template>
				</el-table-column>
			</el-table>
  </el-form>

    
  <div v-if="voucher?.length">
    <div style="text-align: left;">付款凭证</div>
    <div v-for="(item, index) in voucher" :key="index" class="category-box">
      <div
        style="
          border-bottom: #333 1px solid;
          font-size: 16px;
          line-height: 30px;
          padding: 0 20px;
        "
      >
        付款凭证{{ index + 1 || "-" }}
      </div>
      <div style="display: flex; padding: 10px">
        <div
          style="
            min-width: 120px;
            flex: 1;
            text-align: right;
            line-height: 40px;
            margin-right: 10px;
          "
        >
          <span style="color: #ff0036">*</span>上传付款凭证：
        </div>
        <div style="width: 270px;line-height: 35px; white-space: pre-wrap;word-break: break-all;word-wrap: break-word;">
          <span v-if="item?.paymentName.indexOf('.pdf')>-1||item?.paymentName.indexOf('.xls')>-1">{{item?.paymentName}}</span>
          <img width="150" :src="BASE_FILE_URL+item?.paymentUrl" alt="">
          <el-link v-if="item?.paymentUrl" :underline="false" :href="BASE_FILE_URL+item?.paymentUrl" style="margin-left: 20px;color:#409eff;">下载</el-link>
        </div>
      </div>

      <div style="display: flex; padding: 10px">
        <div
          style="
            min-width: 120px;
            flex: 1;
            text-align: right;
            line-height: 40px;
            margin-right: 10px;
          "
        >
          <span style="color: #ff0036">*</span>付款流水号：
        </div>
        <div style="width: 100%; line-height: 40px">{{item.paymentSerialNumber}}</div>
      </div>

      <div style="display: flex; padding: 10px">
        <div
          style="
            min-width: 120px;
            flex: 1;
            text-align: right;
            line-height: 40px;
            margin-right: 10px;
          "
        >
          <span style="color: #ff0036">*</span>实际付款金额：
        </div>
        <div style="width: 100%; line-height: 40px">{{showMoney(item.settlementAmount)}}</div>
      </div>

      <div style="display: flex; padding: 10px">
        <div
          style="
            min-width: 120px;
            flex: 1;
            text-align: right;
            line-height: 40px;
            margin-right: 10px;
          "
        >
          <span style="color: #ff0036">*</span>实际付款时间：
        </div>
        <div style="width: 100%; line-height: 40px">{{formatDate(item.realityPaymentTime)}}</div>
      </div>
    </div>
  </div>

  <el-form :model="formData" label-width="140px" v-if="prodata?.length">
    <h4 class="title">供应商相关发票：</h4>
    <h4 class="title">打样</h4>
    <div v-for="(item, i) in prodata" :key="i">
      <el-form-item label="打样工单号：">
        {{ item?.businessKey || "-" }}
      </el-form-item>
      <el-form-item label="打样供应商发票：">
        <div>
          {{ item?.supplierInvoiceName || "-" }}
          <el-link :underline="false" v-if="item?.supplierInvoiceUrl" :href="BASE_FILE_URL+item?.supplierInvoiceUrl" style="color:#409eff;">下载</el-link>
        </div>
      </el-form-item>
      <el-form-item label="品类：">
        <span v-for="(citem,index) in item.categoryList" :key="citem">
          <span v-if="index!=0"> / </span>
          {{ citem.goodsName }}
        </span>
      </el-form-item>
      <el-form-item label="打样数量：">
        <span v-for="(citem,index) in item.categoryList" :key="citem">
          <span v-if="index!=0"> / </span>
          {{ citem.proofingQuantity }}
        </span>
      </el-form-item>
      
    </div>
  </el-form>

  <el-form :model="formData" label-width="140px" v-if="bgoodsdata?.length">
    <h4 class="title">大货</h4>
    <div v-for="(item, i) in bgoodsdata" :key="i">
      <el-form-item label="大货工单号：">
        {{ item?.bulkBusinessKey || "-" }}
      </el-form-item>
      <el-form-item label="大货供应商发票：">
        <div style="white-space: pre-wrap;word-break: break-all;">
          {{ item?.bulkProductionProc?.supplierInvoiceName || "-" }}
          <el-link :underline="false" v-if="item?.bulkProductionProc?.supplierInvoiceUrl" :href="BASE_FILE_URL+item?.bulkProductionProc?.supplierInvoiceUrl" style="color:#409eff;">下载</el-link>
        </div>

      </el-form-item>
      <el-form-item label="品类：">
        <span v-for="(citem,index) in item.categoryList" :key="citem">
          <span v-if="index!=0"> / </span>
          {{ citem.goodsName }}
        </span>
      </el-form-item>
      <el-form-item label="大货生产数量：">
        <span v-for="(citem,index) in item.categoryList" :key="citem">
          <span v-if="index!=0"> / </span>
          {{ citem.bulkProdQuantity }}
        </span>
      </el-form-item>
      
    </div>
  </el-form>
  <el-dialog v-model="dialogVisible" title="发票凭证" destroy-on-close>
    <Editor v-model:html="dialogData" :edit="false"></Editor>
  </el-dialog>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDate,formatDates } from '@/utils'
import { BASE_FILE_URL ,BASE_UPLOAD_FILE_URL} from "@/store/global-constant";
import { RecordTaskRelation,financialAudit } from "@/api/crm/order/contract";
import settlementMethod from '@/components/settlementMethod/index.vue'
import Editor from "@/components/Editor"
const { proxy } = getCurrentInstance();
const { crm_payment_type, crm_invoice_type,crm_audit_status,crm_invoice_status } = proxy.useDict(
  "crm_payment_type",
  "crm_invoice_type",
  "crm_audit_status",
  "crm_invoice_status"
);
import singDownFile from "@/components/singDownFile"
const props = defineProps({
  istype: [Number,String],
  prodata: {
  	type: Array,
  	default: null,
  },
  bgoodsdata: {
  	type: Array,
  	default: null,
  },
  detaildata: {
    type: Object,
    default: null,
  },
  listdata: {
    type: Object,
  },
  multipleSelection:{
    type:Array
  },
  editfn:{
    type:Function
  },
  risklist:{
    type:Object
  },
  cancelClick:{
    type:Function
  }
});
// 接收父组件传来的方法
const emits = defineEmits(["cancelClick","editfn"]);

const formSize = ref("default");
const voucher = ref(null);
const ruleFormRef = ref("");
const examine = ref(0); //审核是否通过
const remake = ref(""); //驳回原因
const formData = reactive({
  contractUrl: "",
  ContractNo: "",
  contractPrice: "",
  contractTaxes: "",
});
const dialogData = ref('')
const dialogVisible = ref(false)
const activeName=ref('')
const { crm_logistics } = proxy.useDict(
  "crm_logistics"
);
function showFile(data){
	dialogVisible.value = true
	dialogData.value = data
  console.log('data',data);
}
const handleClick = (tab, event) => {
  emits("editfn",3,props?.multipleSelection[tab.index],1);
}
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
    let id =''
    if(props?.istype==1){
      id=[props.listdata.id]
    }else if(props?.istype==3){
      id =props.multipleSelection.map(e=>{
        let ids=e.id
        return ids
      })
    }
    financialAudit({
      idList: id||'',
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
    // catch error
  });
  // 
}

onMounted(() => {
  if(props?.istype=="3"){
    activeName.value=props?.multipleSelection[0].orderBusinessKey
  }
  RecordTaskRelation(props?.listdata?.id).then(res=>{
    if(res.code===200){
      voucher.value=res.data
    }
  })
});
// onUnmounted(() => {
// });

defineExpose({
  confirmClick
});
</script>

<style lang="scss" scoped>
.category-box {
  width: 420px;
  min-height: 300px;
  display: inline-block;
  margin: 12px 12px 12px 100px;
  border: #333 1px solid;
  border-radius: 10px;
  position: relative;
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
</style>

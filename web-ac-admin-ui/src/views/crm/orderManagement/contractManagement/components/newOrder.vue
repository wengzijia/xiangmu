<template>
  <div class="lookDetail">
    <div>
      <h4>
        <span v-if="status==1||status==2">上传</span>{{tepetxt+'合同'||''}}
      </h4>
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
          <el-form-item :label="contype=='4'?'合同/采购单':'设计服务合同'" prop="contractUrl">
            <div style="position: relative;">
              <crmFileUpload
                v-model:modelValue="ruleForm.contractUrl"
                name="立即上传"
                :fileType="['png', 'jpg', 'jpeg','pdf']"
                :fileSize="50"
                :del="true"
                replace
              ></crmFileUpload>
              <span v-if="contype=='4'" style="width:252px;position: absolute;top:0;left:120px;color:#999">请上传与客户签订的大货合同或采购单</span>
            </div>
            
          </el-form-item>

          <el-form-item label="合同编号" prop="ContractNo">
            <el-input 
                v-model="ruleForm.ContractNo"
                maxlength="50"
                show-word-limit
                placeholder="请输入合同编号"
                type="text"
            />
            
          </el-form-item>
          <el-form-item
            :label="contype == '1' ? '设计服务费' : '合同总价'"
            prop="contractPrice"
          >
            <div>
                <el-input-number class="numinp" style="width:250px;" :placeholder="`${contype == '1' ? '请输入设计服务费' : '请输入合同总价'}（${designServiceEntryFeeTaxInclusive ? '含税' : '不含税'}）`" @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false" v-model="ruleForm.contractPrice" />
                <el-checkbox v-model="designServiceEntryFeeTaxInclusive"
                  :label="`按${designServiceEntryFeeTaxInclusive ? '含税' : '不含税'}价录入`" size="large" />
              </div>
            <el-tooltip
							class="box-item"
							effect="dark"
							placement="bottom-end"
						>
							<template #content
								>与客户签订最终成交金额，包含设计、<br />打样费用(不包含物流费，含税)
							</template>
							<el-icon class="icons">
								<WarningFilled />
							</el-icon>
						</el-tooltip>
          </el-form-item>

          <el-form-item v-if="ruleForm.contractPrice">
            <template #label>
              <div style="width: 200px !important;">{{contype == '1' ? '设计服务费' : '合同总价'}}（{{ !designServiceEntryFeeTaxInclusive ? '含税' : '不含税'
              }}）：
              </div>
            </template>
            <span>{{ showMoney(whetherThePriceIncludesTax(designServiceEntryFeeTaxInclusive,
              ruleForm.contractPrice, detaildata.invoiceTaxRate, 2)) }}元</span>
          </el-form-item>
          <el-form-item v-if="ruleForm.contractPrice" label="税金："
            prop="designServiceTaxes">
            <span>{{ showMoney(whetherThePriceIncludesTax(designServiceEntryFeeTaxInclusive,
              ruleForm.contractPrice, detaildata?.invoiceTaxRate, 1)) }}元</span>
          </el-form-item>


          <!-- <el-form-item label="税金" prop="contractTaxes">
            <el-input-number class="numinp" style="width:250px;" placeholder="请输入税金" @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false" v-model="ruleForm.contractTaxes" />
          </el-form-item> -->
          <el-form-item
              v-if="status==2&&contype == '1'"
              prop="designServiceCostEstimationTableUrl"
            >
              <template #label>
                <div style="width: 200px !important">
                  设计服务费成本预估表：
                </div>
              </template>
              <crmFileUpload
                v-model:modelValue="designServiceCostEstimationTableUrl"
                name="上传表格"
                :fileType="['xlsx','xls']"
                :fileSize="5"
                :del="true"
                replace
              >
              </crmFileUpload>
            </el-form-item>

          <el-form-item v-if="(contype=='1'&&ctype!='bulk_design_prod_order')||contype=='4'" label="预计交货日期" prop="expectedDeliveryDate">
            <el-date-picker
              v-model="ruleForm.expectedDeliveryDate"
              type="date"
              style="width:100%"
              placeholder=""
            />
            <p style="margin: 0;" v-if="(status==1||status==2)&&enn">预计所需货期: <span style="color:red">{{enn}}</span>天</p>
          </el-form-item>

          <el-form-item label="合同签订日期" prop="contractSignDate">
            <el-date-picker
              v-model="ruleForm.contractSignDate"
              type="date"
              style="width:100%"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="首付款比例" prop="firstPaymentRatio">
            <el-input-number class="numinp" style="width:250px;" :disabled="contype==1?true:false" placeholder="请输入首付款比例" @keydown="userclearInput" :precision="0" :min="30" :max="100" :controls="false" v-model="ruleForm.firstPaymentRatio" />
            <span class="comspan" style="margin-left: 5px;">%</span>
          </el-form-item>

          <el-form-item v-if="(contype=='1'&&ctype!='bulk_design_prod_order')||contype=='4'" label="首付款最晚日期" prop="firstPaymentLatestDate">
            <el-date-picker
              v-model="ruleForm.firstPaymentLatestDate"
              type="date"
              style="width:100%"
              placeholder=""
            />
          </el-form-item>

          <el-form-item v-if="(contype=='1'&&ctype!='bulk_design_prod_order')||contype=='4'" label="尾款最晚日期" prop="finalPaymentLatestDate">
            <el-date-picker
              v-model="ruleForm.finalPaymentLatestDate"
              type="date"
              style="width:100%"
              placeholder=""
            />
          </el-form-item>

          <!-- <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >Create</el-button
            >
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </el-form-item> -->
        </el-form>
      </div>
  
      <el-form :model="formData" label-width="140px" v-else>
        <el-form-item label="设计服务合同：" v-if="contype=='1'">
          <div>
            {{taskdata?.designServiceContractName ?? '-'}}
            <el-link v-if="taskdata?.designServiceContractUrl" :underline="false" :href="BASE_FILE_URL+taskdata?.designServiceContractUrl" style="color:#409eff;">下载</el-link>
          </div>
        </el-form-item>
        <el-form-item label="采购单：" v-if="contype=='4'">
          <div>
            {{taskdata?.bulkContractName || '-'}}
            <el-link v-if="taskdata?.bulkContractUrl" :underline="false" :href="BASE_FILE_URL+taskdata?.bulkContractUrl" style="color:#409eff;">下载</el-link>
          </div>
        </el-form-item>
        <el-form-item label="合同编号：">
          {{taskdata?.bulkContractNo ?? taskdata?.designServiceContractNo}}
        </el-form-item>
        <el-form-item label="设计服务费：" v-if="contype=='1'">
          {{showMoney(taskdata?.designServiceTaxInclusiveFee ?? '-')}}
        </el-form-item>
        <el-form-item label="合同总价：" v-if="contype=='4'">
          {{showMoney(taskdata?.contractTaxInclusiveTotalPrice ?? taskdata?.contractTotalPrice)}}
        </el-form-item>
        <el-form-item label="税金：">
          {{showMoney(taskdata?.designServiceTaxes ?? taskdata?.contractTaxes)}}
        </el-form-item>
        <el-form-item label="预计交货日期：" v-if="(contype=='1'&&ctype!='bulk_design_prod_order')||contype=='4'">
          {{taskdata?.expectedDeliveryDate ?? '-'}}
        </el-form-item>
        <p label="预计所需货期" v-if="enn" style="margin-top:-30px;font-size:14px;"><span class="alignRight" style="width:140px;"></span>预计所需货期: <span style="color:red">{{enn}}</span>天</p>
        
        <el-form-item label="合同签订日期：">
          {{taskdata?.contractSignDate ?? taskdata?.contractSignDate}}
        </el-form-item>
        <el-form-item label="首付款比例：">
          {{taskdata?.firstPaymentRatio*100 || '-'}}
          <span v-show="taskdata?.firstPaymentRatio">%</span>
        </el-form-item>
        <el-form-item label="首付款最晚日期：" v-if="(contype=='1'&&ctype!='bulk_design_prod_order')||contype=='4'">
          {{taskdata?.firstPaymentLatestDate||'-'}}
        </el-form-item>
        <el-form-item label="尾款最晚日期：" v-if="(contype=='1'&&ctype!='bulk_design_prod_order')||contype=='4'">
          {{taskdata?.finalPaymentLatestDate||'-'}}
        </el-form-item>
      </el-form>
      <div v-if="contype=='1'">
        <h4 class="title">
          {{status==1?'成本核算':'订单信息'}}
          <el-link style="float:right;" v-if="status!=1" :underline="false" @click="router.push(`/crm/orderManagement/orderDetail?id=${detaildata?.id}&procType=${detaildata?.procType}&customerId=${detaildata?.customerId}`)" type="primary">订单详情>></el-link>
        </h4>
        <p v-if="ctype!='bulk_design_prod_order'">
          <span class="alignRight"> 结算方式：</span>
          <settlementMethod
            v-if="userdata?.baseInfo?.moreSettlementMethodId"
            :methodId="userdata?.baseInfo?.moreSettlementMethodId"
            :methodList="risklist?.more_settlement_method"
          />
          <span v-else>立结</span>
        </p>
        <p><span class="alignRight">品类：</span>
          <span v-for="(item,index) in detaildata?.categoryList" :key="item.categoryId">
            <span v-if="index!=0"> 、 </span>
            {{item.goodsName}}
          </span>
        </p>
        <p>
          <span class="alignRight">数量：</span>
          <span v-for="(item,index) in detaildata?.categoryList" :key="item.categoryId">
            <span v-if="index!=0"> / </span>
            {{item.proofingQuantity}}
          </span>
        </p>
        <p>
          <span class="alignRight">开票类型：</span>
          <DictTag
            style="display: inline-block;"
            :value="detaildata?.invoiceType"
            :options="crm_invoice_type"
          />
        </p>
        <p v-if="detaildata?.invoiceEntity">
          <span class="alignRight">开票主体：</span>
          <span v-if="detaildata.invoiceEntity">
              {{detaildata?.invoiceEntity||'-'}}
          </span>
          
        </p>
      </div>
      <div v-if="contype=='4'">
        <h4 class="title">
          {{status==1?'成本核算':'订单信息'}}
          <el-link style="float:right;" v-if="status!=1" :underline="false" @click="router.push(`/crm/orderManagement/orderDetail?id=${detaildata?.id}&procType=${detaildata?.procType}&customerId=${detaildata?.customerId}`)" type="primary">订单详情>></el-link>
        </h4>
        <el-form :model="formData" label-width="140px">

        <el-form-item label="结算方式：">
          <settlementMethod
            v-if="userdata?.baseInfo?.moreSettlementMethodId"
            :methodId="userdata?.baseInfo?.moreSettlementMethodId"
            :methodList="risklist?.more_settlement_method"
          />
          <span v-else>立结</span>
        </el-form-item>
        <el-form-item label="全成本核算表：" v-if="status==1">
          <div>
            {{detaildata?.bulkContractProc?.allCostCalculateExcelName}}
            <el-link v-if="detaildata?.bulkContractProc?.allCostCalculateExcelUrl" :underline="false" :href="BASE_FILE_URL+detaildata?.bulkContractProc?.allCostCalculateExcelUrl" style="color:#409eff">下载</el-link>
          </div>
          <!-- allCostCalculateExcelUrl -->
        </el-form-item>
        <el-form-item label="品类：">
          <span v-for="(item,index) in detaildata?.categoryList" :key="item.categoryId">
            <span v-if="index!=0"> / </span>
            {{item.goodsName}}
          </span>
        </el-form-item>
        <el-form-item label="数量：">
          <span v-for="(item,index) in detaildata?.categoryList" :key="item.categoryId">
            <span v-if="index!=0"> / </span>
            {{item.bulkProdQuantity}}
          </span>

        </el-form-item>
        <el-form-item label="开票类型：" v-if="status!=1">
          <DictTag
            style="display: inline-block;"
            :value="detaildata?.invoiceType"
            :options="crm_invoice_type"
          />
        </el-form-item>
        <el-form-item label="开票主体：" v-if="status!=1">{{detaildata?.invoiceEntity ?? '-'}}</el-form-item>
        </el-form>

      </div>

      <div v-if="contype=='1'&&rejdata&&rejdata.length > 0">
				<h4 class="title" v-if="rejdata&&rejdata.length > 0">驳回记录</h4>
        <el-form :model="formData" label-width="140px">
          <div class="contactPerson" v-for="(item,index) in rejdata" :key="index">
            <el-form-item label="驳回人：">
              {{ item.designServiceContractRejectPersonName||'-' }}
            </el-form-item>

            <el-form-item label="驳回原因：">
              <div style="float: right;width: 302px;">{{ item.designServiceContractRejectReason||'-' }}</div>
            </el-form-item>

            <el-form-item label="驳回时间：">
             {{ formatDate(item.designServiceContractRejectTime)||'-' }}
            </el-form-item>
            <el-form-item label="合同：">
              <div>
                {{ item.designServiceContractRejectName||'-' }}
                <el-link v-if="item.designServiceContractRejectUrl" :underline="false" :href="BASE_FILE_URL+item.designServiceContractRejectUrl" style="color:#409eff;">下载</el-link>
              </div>
            </el-form-item>
          </div>
        </el-form>
			</div>

      <!-- 大货驳回记录 -->
      <div v-if="contype=='4'&&bulkdata&&bulkdata.length > 0">
				<h4 class="title" v-if="bulkdata&&bulkdata.length > 0">驳回记录</h4>
					<el-form :model="formData" label-width="140px">
            <div class="contactPerson" v-for="(item,index) in bulkdata" :key="index">
                <el-form-item label="驳回人：">
                  {{ item.bulkContractRejectPersonName||'-' }}
                </el-form-item>
                <!-- <p>
                  <span class="alignRight widthRight"
                    >驳回原因：</span
                  >{{ item.bulkContractRejectReason||'-' }}
                </p> -->
                <el-form-item label="驳回原因：">
                  <div>{{ item.bulkContractRejectReason||'-' }}</div>
                </el-form-item>

                <el-form-item label="驳回时间：">
                  {{ formatDate(item.bulkContractRejectTime)||'-' }}
                </el-form-item>

                <el-form-item label="合同：">
                  <div>
                    {{ item.bulkContractRejectName||'-' }}
                    <el-link :underline="false" v-if="item.bulkContractRejectUrl" :href="BASE_FILE_URL+item.bulkContractRejectUrl" style="color:#409eff;">下载</el-link>
                  </div>
                </el-form-item>
            </div>
					</el-form>

			</div>


    </div>
  </div>
</template>

<script setup>
import {customerdata,gradingCalculate} from "@/api/orderManagement/subOrder";

import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue";
import { BASE_FILE_URL } from "@/store/global-constant";
import { validateForms, checkPhone, debounce } from "@/utils/form";
import { onMounted, onUnmounted, computed } from "vue";
import { formatDate,formatDates } from '@/utils';
import { ElMessage, ElMessageBox } from "element-plus";
import { designservicecontract,procbulkcontract } from "@/api/crm/order/contract";
import settlementMethod from '@/components/settlementMethod/index.vue'
import { gradingCalculateConfig } from "@/api/orderManagement/customer/index";
import { getFileName,whetherThePriceIncludesTax } from "@/utils/index";
import {
  projectDesignTask
} from '@/api/orderManagement/costComposition'
import {
  bulkContractTask
} from '@/api/orderManagement/costComposition'
import {
  projectreject,
  bulkreject
} from "@/api/orderManagement/customer/index";
const { proxy } = getCurrentInstance();
const router = useRouter()
const { crm_payment_type,crm_invoice_type } = proxy.useDict("crm_payment_type","crm_invoice_type");
const props = defineProps({
  status: {
    type: String,
    default: "1",
  },
  istype: [String, Number],
  isoperation: {
    type: Number,
    default: 1,
  },
  detaildata: {
    type: Object,
    default: null,
  },
  processParentId: {
    type: String,
  },
  rejdata: {
  	type: Array,
  	default: null,
  },
  bulkdata: {
  	type: Array,
  	default: null,
  },
  ctype:{
    type:String,
    default:'project_design_order'
  },
  nid:{
    type:String,
    default:''
  },
  cancelClick:{
    type:Function
  },
  mtxt:{
    type:Array
  },
  enn:{
    type:Number||String
  },
  contype:{
    type:String
  },
  userid:{
    type:String
  },
  methodList:{
    type:Array||null
  }
});
// 接收父组件传来的方法
const emits = defineEmits(["cancelClick"]);
const formSize = ref("default");
const ruleFormRef = ref("");
const ruleForm = reactive({
  contractUrl: "",
  ContractNo: "",
  contractPrice: null,
  contractTaxes: null,
  expectedDeliveryDate:"",//预计交货日期
  contractSignDate:"",//合同签订日期
  firstPaymentLatestDate:"",//首付款最晚日期
  finalPaymentLatestDate:"",//尾款最晚日期
  firstPaymentRatio:30,
  contractTaxInclusiveTotalPrice:null,
  contractTaxExclusiveTotalPrice:null
});
const designServiceEntryFeeTaxInclusive=ref(true)
const taskdata=ref({})
let tepetxt = computed(() => {
  return props?.contype === '1' ? "设计服务" : "大货";
})
const risklist=ref(null)
const validateDate = (rule, value, callback) => {
  let day = methodItem.value === null||methodItem.value === undefined ? 0 : methodItem.value?.rightInterval
  let p1=ruleForm.contractPrice*(1-ruleForm.firstPaymentRatio)
  let p2=userdata?.value?.statisticsInfo?.usableCreditQuota
  if (value == '') {
    callback(new Error('请选择尾款最晚日期'))
  } else {
    if (ruleForm.firstPaymentLatestDate&&p1>p2) {
      ruleForm.finalPaymentLatestDate = ruleForm.firstPaymentLatestDate
      callback(new Error('该客户可用授信额度不足，不得新增应收账款'))
    }
    if (ruleForm.expectedDeliveryDate === '') {
      ruleForm.finalPaymentLatestDate = ''
      callback(new Error('请先选择预计交货日期，再选择日期！'))
    }
    // if (new Date(ruleForm.expectedDeliveryDate).getTime() + 60 * 60 * 1000 * 24 * day < new Date(ruleForm.finalPaymentLatestDate).getTime()) {
    //   ruleForm.finalPaymentLatestDate = ''
    //   callback(new Error('尾款最晚日期不得晚于${交货日期+结算方式最大天数}'))
    // }
    if (
      new Date(ruleForm.expectedDeliveryDate).getTime() +
        60 * 60 * 1000 * 24 * day <
      new Date(ruleForm.finalPaymentLatestDate).getTime()
    ) {
      ruleForm.finalPaymentLatestDate = "";
      callback(new Error("尾款最晚日期不得晚于${交货日期+结算方式最大天数}"));
    }
    if (new Date(formatDates(value)).getTime() < new Date(formatDates(ruleForm.firstPaymentLatestDate)).getTime()) {
      ruleForm.finalPaymentLatestDate = ''
      callback(new Error('尾款最晚日期不能小于首付款最晚日期！'))
    }
    if (new Date(formatDates(new Date())).getTime() > new Date(formatDates(value)).getTime()) {
      ruleForm.finalPaymentLatestDate = ''
      callback(new Error('尾款最晚日期不得早于当前日期！'))
    }
    else {
      callback()
    }
  }
}
const validateFirstDate = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("请选择首付款最晚日期"));
  } else {
    if (
      new Date(value).getTime() >
      new Date(ruleForm.expectedDeliveryDate).getTime()
    ) {
      ruleForm.firstPaymentLatestDate = "";
      callback(new Error("首付款最晚日期不得晚于交货日期！"));
    } else {
      callback();
    }
  }
};
const designServiceCostEstimationTableUrl=ref('')
const rules = reactive({
  contractUrl: [
    {
      required: true,
      message: "请上传合同",
      trigger: "change",
    },
  ],
  ContractNo: [{ required: true, message: "请输入合同编号", trigger: "blur" }],
  contractPrice: [
    { required: true, message: `${props?.contype==='1'?'请输入设计服务费':'请输入合同总价'}`, trigger: "blur" },
  ],
  contractTaxes: [{ required: false, message: "请输入税金", trigger: "blur" }],
  expectedDeliveryDate: [
    {
      type: 'date',
      required: true,
      message: '请选择预计交货日期',
      trigger: 'change',
    },
  ],
  contractSignDate: [
    {
      type: 'date',
      required: true,
      message: '请选择合同签订日期',
      trigger: 'change',
    },
  ],
  firstPaymentLatestDate: [
    {
      required: true,
      validator: validateFirstDate,
      // message: '请选择首付款最晚日期',
      trigger: "blur",
    },
  ],
  finalPaymentLatestDate: [
    {
      required: true,
      validator: validateDate,
      trigger: 'blur',
    },
  ],
  contractTaxInclusiveTotalPrice: [
    {
      required: false,
      message: "含税",
      trigger: 'blur',
    },
  ],
  contractTaxExclusiveTotalPrice: [
    {
      required: false,
      message: "不含税",
      trigger: 'blur',
    },
  ],
});
const userdata=ref(null)
const methodItem=ref(null)
customerdata(props.userid).then(res=>{
  userdata.value=res.data
  methodItem.value = props.methodList.find(
    (item) => item.id == res.data.baseInfo?.moreSettlementMethodId
  )
})
const formData=[]
const fileName = (url) => {
  if (url) {
    let urlList = url.split("/");
    return urlList[urlList.length - 1].replace("filemanage", "");
  }
};
const taxValue = () => {
  ruleForm.contractTaxes=whetherThePriceIncludesTax(designServiceEntryFeeTaxInclusive.value, ruleForm.contractPrice, props.detaildata.invoiceTaxRate, 1)
  //含税
  if (designServiceEntryFeeTaxInclusive.value) {
    ruleForm.contractTaxInclusiveTotalPrice = parseFloat(ruleForm.contractPrice)
    ruleForm.contractTaxExclusiveTotalPrice = whetherThePriceIncludesTax(designServiceEntryFeeTaxInclusive.value, ruleForm.contractPrice, props.detaildata.invoiceTaxRate, 2)
  } else {
    // 不含税
    ruleForm.contractTaxExclusiveTotalPrice = parseFloat(ruleForm.contractPrice)
    ruleForm.contractTaxInclusiveTotalPrice = whetherThePriceIncludesTax(designServiceEntryFeeTaxInclusive.value, ruleForm.contractPrice, props.detaildata.invoiceTaxRate, 2)
  }
}
// 保留两位小数
const validateMoney = (rule, value, callback) => {
  let reg = /^[1-9]\d{0,11}(\.\d{1,2})?$/;
  // let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  if (value === "" || value === null) {
    callback(new Error("请输入包含税金额度"));
  } else {
    if (!reg.test(value)) {
      callback(new Error("整数最大12位，小数点最大2位"));
    } else {
      callback();
    }
  }
};
const validateMoney1 = (rule, value, callback) => {
  let reg1 = /^[1-9]\d{0,11}(\.\d{1,2})?$/;
  // let reg1 = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  if (value === "" || value === null) {
    callback(new Error("请输入设计服务费（含税）"));
  } else {
    if (!reg1.test(value)) {
      callback(new Error("整数最大12位，小数点最大2位"));
    } else {
      callback();
    }
  }
};

const submitForm = async (formEl) => {
  if (!formEl) return;
  // console.log(props.ctype);
  formEl.validate((valid) =>{
    if (valid) {
      for (let key in ruleForm) {
        if(props.ctype==='bulk_design_prod_order'){
          console.log(key);
          if(rules[key]?.[0].required ===true &&(key!='expectedDeliveryDate'&&key!='firstPaymentLatestDate'&&key!='finalPaymentLatestDate')&& (ruleForm[key]===""||ruleForm[key]===null)){
            ElMessage.error(rules[key]?.[0]?.message)
            return
          }  
        }else{
          if(rules[key]?.[0].required ===true&&(ruleForm[key]===""||ruleForm[key]===null)){
            ElMessage.error(rules[key]?.[0]?.message)
            return
          }
        }
      }
      ElMessageBox.confirm(
      "确定提交审核吗？",
      '提交后需审核通过后才生效。',
      )
      .then(() => {
        taxValue()
        let FPR=ruleForm?.firstPaymentRatio/100
        if(props.contype=='1'){
          let data={
              id:props.nid,
              designServiceContractUrl: ruleForm.contractUrl,
              designServiceContractName:getFileName(ruleForm.contractUrl),
              designServiceContractNo: ruleForm.ContractNo,
              designServiceTaxInclusiveFee: ruleForm.contractTaxInclusiveTotalPrice,
              designServiceTaxes: ruleForm.contractTaxes,
              firstPaymentRatio:FPR,
              contractSignDate:formatDates(ruleForm.contractSignDate),//合同签订日期
              designServiceEntryFee:ruleForm.contractPrice,
              designServiceEntryFeeTaxInclusive:designServiceEntryFeeTaxInclusive.value,
              designServiceTaxExclusiveFee:ruleForm.contractTaxExclusiveTotalPrice,
              invoiceTaxRate:props.detaildata.invoiceTaxRate,
              designServiceCostEstimationTableUrl:props.status==2?designServiceCostEstimationTableUrl.value:'',
              designServiceCostEstimationTableName:props.status==2?fileName(designServiceCostEstimationTableUrl.value):''
            }
          if(props.ctype!=='bulk_design_prod_order'){
            data={
              ...data,
              expectedDeliveryDate:props.ctype==='bulk_design_prod_order'?'':formatDates(ruleForm.expectedDeliveryDate),//预计交货日期
              contractSignDate:formatDates(ruleForm.contractSignDate),//合同签订日期
              firstPaymentLatestDate:props.ctype==='bulk_design_prod_order'?'':formatDates(ruleForm.firstPaymentLatestDate),//首付款最晚日期
              finalPaymentLatestDate:props.ctype==='bulk_design_prod_order'?'':formatDates(ruleForm.finalPaymentLatestDate),//尾款最晚日期
            }
          }
          designservicecontract(data).then(res=>{
            if (res.code===200) {
              emits("cancelClick");
              ElMessage({
                type: 'success',
                message: '提交成功',
              })
            }
          })
        }else if(props.contype=='4'){
          procbulkcontract({
            id:props.nid,
            bulkContractName:getFileName(ruleForm.contractUrl),
            bulkContractUrl: ruleForm.contractUrl,
            bulkContractNo: ruleForm.ContractNo,
            contractTaxInclusiveTotalPrice:ruleForm.contractTaxInclusiveTotalPrice,
            contractTaxExclusiveTotalPrice:ruleForm.contractTaxExclusiveTotalPrice,
            contractTaxes: ruleForm.contractTaxes,
            expectedDeliveryDate:formatDates(ruleForm.expectedDeliveryDate),//预计交货日期
            contractSignDate:formatDates(ruleForm.contractSignDate),//合同签订日期
            firstPaymentLatestDate:formatDates(ruleForm.firstPaymentLatestDate),//首付款最晚日期
            finalPaymentLatestDate:formatDates(ruleForm.finalPaymentLatestDate),//尾款最晚日期
            firstPaymentRatio:FPR,
            invoiceTaxRate:props.detaildata.invoiceTaxRate,
            contractTotalPriceEntryFeeTaxInclusive:designServiceEntryFeeTaxInclusive.value,
            contractTotalPriceEntryFee:ruleForm.contractPrice,
          }).then(res=>{
            if (res.code===200) {
              emits("cancelClick");
              ElMessage({
                type: 'success',
                message: '提交成功',
              })
            }
          })
        }  
        
      })
      .catch(() => {
        // catch error
      });
      
    }
  })
  // await formEl.validate((valid, fields) => {
  //   if (valid) {
  //     console.log("submit!");
  //   } else {
  //     console.log("error submit!", fields);
  //   }
  // });
};
const userclearInput = (e) => {
  let key = e.key;
  if (key === "e" || key === "E" || key === "+" || key === "-"|| key === ".") {
    e.returnValue = false;
    return false;
  }
  return true;
}
// const submitFormfn = () => {
//   submitForm(ruleFormRef.value);
// };
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
onMounted(() => {
  gradingCalculateConfig().then(res=>{
    risklist.value=res.data
  })
  if(props.status==1||props.status==2){
    if(props?.contype=='1'){
      ruleForm.contractUrl=props.detaildata?.designServiceContractUrl ?? null
      ruleForm.contractPrice=props.detaildata?.designServiceTaxInclusiveFee ?? null
    }else{
      ruleForm.contractUrl=props.detaildata?.bulkContractProc?.bulkContractUrl ||null
      ruleForm.contractPrice=props.detaildata?.contractTotalPrice ?? null
    }
    // ruleForm.ContractNo=props.detaildata?.contractNo ?? null
    ruleForm.contractTaxes=props.detaildata?.designServiceTaxes ?? null
  }
  if(props.status==2){
    if(props.contype==1){
      projectreject(props.nid).then(res=>{
        ruleForm.contractUrl=res.data.designServiceContractUrl,
        ruleForm.ContractNo=res.data.designServiceContractNo,
        ruleForm.contractPrice=res.data.designServiceEntryFee,
        ruleForm.contractTaxes=res.data.designServiceTaxes,
        ruleForm.expectedDeliveryDate=res.data.expectedDeliveryDate,
        ruleForm.contractSignDate=res.data.contractSignDate,
        ruleForm.firstPaymentLatestDate=res.data.firstPaymentLatestDate,
        ruleForm.finalPaymentLatestDate=res.data.finalPaymentLatestDate,
        ruleForm.firstPaymentRatio=(res.data.firstPaymentRatio*100)
        designServiceEntryFeeTaxInclusive.value=res.data.designServiceEntryFeeTaxInclusive
        ruleForm.contractTaxInclusiveTotalPrice=res.data.designServiceTaxInclusiveFee,
        ruleForm.contractTaxExclusiveTotalPrice=res.data.designServiceTaxExclusiveFee
        if(props.status==2){
          designServiceCostEstimationTableUrl.value=res.data.designServiceCostEstimationTableUrl
        }
      })
    }else if(props.contype==4){
      bulkreject(props.nid).then(res=>{
        ruleForm.contractUrl=res.data.bulkContractUrl,
        ruleForm.ContractNo=res.data.bulkContractNo,
        ruleForm.contractPrice=res.data.contractTotalPriceEntryFee,
        ruleForm.contractTaxes=res.data.contractTaxes,
        ruleForm.expectedDeliveryDate=res.data.expectedDeliveryDate,
        ruleForm.contractSignDate=res.data.contractSignDate,
        ruleForm.firstPaymentLatestDate=res.data.firstPaymentLatestDate,
        ruleForm.finalPaymentLatestDate=res.data.finalPaymentLatestDate,
        ruleForm.firstPaymentRatio=(res.data.firstPaymentRatio*100)
        designServiceEntryFeeTaxInclusive.value=res.data.contractTotalPriceEntryFeeTaxInclusive,
        ruleForm.contractTaxInclusiveTotalPrice=res.data.contractTaxInclusiveTotalPrice,
        ruleForm.contractTaxExclusiveTotalPrice=res.data.contractTaxExclusiveTotalPrice
        
      })
    }
  }
  if(props.contype==1){
    projectDesignTask(props.nid).then(res=>{
      if(res.code===200){
        taskdata.value=res.data
      }
    })
  }else{
    bulkContractTask(props.nid).then(res=>{
      taskdata.value=res.data
    })
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
  // width: 400px;
  margin: 10px;
  padding: 10px;
  padding-bottom: 0;
}
.contactPerson {
  max-width: 610px;
  // display: flex;
  // margin-right: 30px;
  overflow: auto;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-top: 20px;
}
.invoice {
  width: 120px;
}
.numinp :deep(.el-input__inner) {
    text-align: left !important;
}
.laypage {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
.red {
  color: red;
}

</style>

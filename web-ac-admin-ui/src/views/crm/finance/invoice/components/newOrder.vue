<template>
  <div class="lookDetail">
    <div>
      <div class="staus-tips" v-if="istype==3&&status==3">已取消</div>
      <!-- <Address v-model:province="province" v-model:city="city" v-model:district="district"  /> -->
      <!-- <button @click="province='上海市'"></button> -->
      <!-- <div v-if="status==1||status==2">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item :label="tepetxt + '合同'" prop="contractUrl">
            <crmFileUpload
              v-model:modelValue="ruleForm.contractUrl"
              name="立即上传"
              :fileType="['png', 'jpg', 'jpeg']"
              :fileSize="2"
              :del="true"
              replace
            ></crmFileUpload>
          </el-form-item>

          <el-form-item label="合同编号" prop="ContractNo">
            <el-input v-model="ruleForm.ContractNo" />
          </el-form-item>

          <el-form-item
            :label="istype === 1 ? '设计服务费' : '合同总价'"
            prop="contractPrice"
          >
            <el-input v-model="ruleForm.contractPrice" />
          </el-form-item>

          <el-form-item label="税金" prop="contractTaxes">
            <el-input v-model="ruleForm.contractTaxes" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >Create</el-button
            >
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </el-form-item>
        </el-form>
      </div> -->

      <div v-if="istype==1">
        <p>
          
          <span class="alignRight"> <span style="color:red;margin-right:5px;">*</span>选择开票订单：</span>
          <el-button @click="orderdialog=true">选择订单</el-button>
        </p>
        <p style="margin-left:180px" v-if="selectprice">已选{{multipleSelection.length}}笔订单，合计发票金额{{showMoney(selectprice)}}</p>
        <p>
          <span class="alignRight"><span style="color:red;margin-right:5px;">*</span>发票类型：</span>
          <DictTag
            v-if="dispdata[0]?.invoiceType"
            style="display: inline-block"
            :value="dispdata[0]?.invoiceType"
            :options="crm_invoice_type"
          />
          <span v-else>-</span>
        </p>
        <p>
          <span class="alignRight">开票主体：</span>
          {{ dispdata[0]?.invoiceEntity || "-" }}
        </p>
      </div>

      <div v-if="istype!=1" style="position: relative;">
        <p>
          <span class="alignRight">开票类型：</span>
          <DictTag
            style="display: inline-block"
            :value="Findata?.invoiceType"
            :options="crm_invoice_type"
          />
        </p>
        <p>
          <span class="alignRight">开票金额：</span>
          {{ showMoney(Findata?.invoiceAmount || "-") }}
        </p>
        <p v-if="status==3">
          <span class="alignRight">取消时间：</span>
          {{ formatDate(Findata?.cancelTime) || "-" }}
        </p>
        <p v-if="status==3">
          <span class="alignRight">取消人：</span>
          {{ Findata?.cancelerName || "-" }}
        </p>
      </div>

    </div>
  </div>

  <div v-if="istype!=1">
    <h4 class="titel">开票订单</h4>
    <el-table
      ref="multipleTableRef"
      :data="Findata?.relationList"
      style="width: 100%"
    >
      <el-table-column label="订单编号" width="120">
        <template #default="scope">{{ scope.row.orderNo }}</template>
      </el-table-column>
      <el-table-column property="contractNo" label="合同编号" width="120" />
      <el-table-column property="invoiceEntity" label="开票主体" />
      <el-table-column label="申请开票金额" width="120">
        <template #default="scope">{{ showMoney(scope.row.orderTaxInclusiveTotalPrice) }}</template>
      </el-table-column>

    </el-table>
  </div>


  <div v-if="invoicedata?.length">
    <h4 class="title">
      开票信息
      <el-link v-if="istype==1" style="float: right" :underline="false" type="primary" @click="invodatashow(1)">选择其他开票主体</el-link>
    </h4>
    <template v-if="istype==1">
      <!-- <p>
        <span class="alignRight"> 开票申请单编号：</span>
        {{ showinvoice?.businessKey || "-" }}
      </p> -->
      <p>
        <span class="alignRight"> 开票单位名称：</span>
        {{ showinvoice?.invoiceCompanyName || "-" }}
      </p>

      <p>
        <span class="alignRight">纳税人识别号：</span
        >{{ showinvoice?.taxpayerRegistrationNumber || "-" }}
      </p>

      <p>
        <span class="alignRight">邮箱：</span
        >{{ showinvoice?.invoiceEmail || "-" }}
      </p>

      <div style="display: flex;">
        <div class="alignRight">注册地址：</div>
        <div style="flex: 1;">{{ showinvoice?.invoiceRegisteredAddress||'-' }}</div>
      </div>

      <p>
        <span class="alignRight">联系电话：</span
        >{{ showinvoice?.invoicePhone || "-" }}
      </p>

      <p>
        <span class="alignRight">开户银行：</span
        >{{ showinvoice?.invoiceDepositBank || "-" }}
      </p>

      <p>
        <span class="alignRight">开户账号：</span
        >{{ showinvoice?.invoiceBankAccount || "-" }}
      </p>
    </template>
    
    <template v-else>
      <p>
        <span class="alignRight"> 开票申请单编号：</span>
        {{ Findata?.businessKey || "-" }}
      </p>
      <p>
        <span class="alignRight"> 开票主体：</span>
        {{ Findata?.invoiceEntity || "-" }}
      </p>
      <p>
        <span class="alignRight"> 开票单位名称：</span>
        {{ Findata?.invoiceCompanyName || "-" }}
      </p>

      <p>
        <span class="alignRight">纳税人识别号：</span
        >{{ Findata?.taxpayerRegistrationNumber || "-" }}
      </p>

      <p>
        <span class="alignRight">邮箱：</span
        >{{ Findata?.invoiceEmail || "-" }}
      </p>

      <div style="display: flex;">
        <div class="alignRight">注册地址：</div>
        <div style="flex: 1;">{{ Findata?.invoiceRegisteredAddress||'-' }}</div>
      </div>

      <p>
        <span class="alignRight">联系电话：</span
        >{{ Findata?.invoicePhone || "-" }}
      </p>

      <p>
        <span class="alignRight">开户银行：</span
        >{{ Findata?.invoiceDepositBank || "-" }}
      </p>

      <p>
        <span class="alignRight">开户账号：</span
        >{{ Findata?.invoiceBankAccount || "-" }}
      </p>
    </template>
    
    
  </div>
  

  <div v-if="istype==3">
    <template v-if="Findata?.invoiceType==1">
      <h4 class="title">
        发票凭证
      </h4>
      <p>
        <span class="alignRight">发票凭证：</span
        ><el-link :underline="false" type="primary" @click="showFile(Findata?.invoiceUrl)">查看</el-link>
        <!-- <span v-if="Findata?.invoiceUrl.indexOf('.pdf')>-1">
          {{Findata?.invoiceUrl}}
        </span> -->
        <!-- <iframe v-if="Findata?.invoiceUrl.indexOf('.pdf')>-1" :src="BASE_FILE_URL+Findata?.invoiceUrl" frameborder="0"></iframe> -->
        <!-- <span v-if="Findata?.invoiceUrl?.indexOf('<p>')>-1">
          <span style="margin-right: 6px;" v-html="Findata?.invoiceUrl"></span>
          <singDownFile :url="Findata?.invoiceUrl"/>
        </span>
        <img v-if="Findata?.invoiceName?.indexOf('.jpg')>-1||Findata?.invoiceName?.indexOf('.png')>-1" style="width:150px;" :src="BASE_FILE_URL+Findata?.invoiceUrl" alt="">
        <Editor v-if="!Findata?.invoiceName&&status!=2&&status!=3"  v-model:html="invoiceUrl" :edit="false"></Editor> -->
      </p>
    </template>
    <template v-else>
      <h4 class="title">
        发票物流号
      </h4>
      <p>
        <span class="alignRight">发票物流种类：</span>
        <DictTag style="display: inline-block;" :value="Findata?.logisticsType" :options="crm_logistics" />
      </p>
      <p>
        <span class="alignRight">发票物流单号：</span
        >
        {{Findata?.logisticsNumber||'-'}}
      </p>
    </template>
    
  </div>
		<el-dialog v-model="dialogVisible" title="发票凭证" destroy-on-close>
			<Editor v-model:html="dialogData" :edit="false"></Editor>
		</el-dialog>

  <div v-if="((istype==2&&invoiceType!=1)||istype==3)&&invoicedata?.length">
    <h4 class="title">
      发票邮寄地址
    </h4>
    <template v-if="istype==1">
      <p>
        <span class="alignRight"> 发票收货人：</span>
        {{ showinvoice?.invoiceConsigneeName ?? "-" }}
      </p>
      <p>
        <span class="alignRight"> 收货人电话：</span>
        {{ showinvoice?.invoiceConsigneePhone ?? "-" }}
      </p>

      <p>
        <span class="alignRight">发票收货省市区：</span>
        {{ showinvoice?.province||'-' }}
        {{ showinvoice?.city||'-' }}
        {{ showinvoice?.district||'-' }}
      </p>

      <div style="display: flex;">
        <div class="alignRight">收货详细地址：</div>
        <div style="flex: 1;">{{ showinvoice?.invoiceConsigneeAddress||'-' }}</div>
      </div>

    </template>
    <template v-else>
      <p>
        <span class="alignRight"> 发票收货人：</span>
        {{ Findata?.invoiceConsigneeName ?? "-" }}
      </p>
      <p>
        <span class="alignRight"> 收货人电话：</span>
        {{ Findata?.invoiceConsigneePhone ?? "-" }}
      </p>

      <p>
        <span class="alignRight">发票收货省市区：</span>
        {{ Findata?.province||'-' }}
        {{ Findata?.city||'-' }}
        {{ Findata?.district||'-' }}
      </p>

      <div style="display: flex;">
        <div class="alignRight">收货详细地址：</div>
        <div style="flex: 1;">{{ Findata?.invoiceConsigneeAddress||'-' }}</div>
      </div>
    </template>
    
  </div>


  <div v-if="istype==2&&invoiceType==1">
    <h4 class="title">
      上传发票凭证
    </h4>
    <el-form-item label="上传发票" prop="contractUrl" required>
      <Editor v-model:html="invoiceUrl" :placeholder="''" ></Editor>
      <!-- <crmFileUpload
        v-model:modelValue="invoiceUrl"
        name="立即上传"
        :fileType="['png', 'jpg', 'jpeg','pdf']"
        :fileSize="50"
        :del="true"
        replace
      ></crmFileUpload> -->
    </el-form-item>
  </div>

  <div v-if="istype==2&&invoiceType!=1">
    <h4 class="title">
      发票物流号
    </h4>
    <el-form-item label="发票物流单号" prop="" required>
      <el-input
        v-model="logisticsNumber"
        maxlength="50"
        placeholder="请输入发票物流单号"
        show-word-limit
        type="text"
      />
    </el-form-item>
    <el-form-item label="发票物流种类" prop="" required>
      <el-select
						v-model="logisticsType"
						placeholder="请选择发票物流"
						clearable
						filterable
						style="width: 252px"
					>
						<el-option
							v-for="item in crm_logistics"
							:key="item.id" 
							:label="item.label" 
							:value="item.value"
						/>
      </el-select>
    </el-form-item>
  </div>


  <div v-if="istype==1&&multipleSelection?.length">
    <h4 class="title">
      发票收货地址
      <!-- {{multipleSelection?.length}} -->
      <el-link v-if="invoicedata?.length" style="float: right" :underline="false" type="primary" @click="invodatashow(2)">选择其他发票收货地址</el-link>
    </h4>
    <el-form
      v-if="invoicedata?.length"
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <!-- <el-form-item :label="tepetxt + '合同'" prop="contractUrl">
        <crmFileUpload
          v-model:modelValue="ruleForm.contractUrl"
          name="立即上传"
          :fileType="['png', 'jpg', 'jpeg']"
          :fileSize="2"
          :del="true"
          replace
        ></crmFileUpload>
      </el-form-item> -->

      <el-form-item label="发票收货人" prop="invoiceConsigneeName">
        <el-input v-model="ruleForm.invoiceConsigneeName" />
      </el-form-item>

      <el-form-item
        label="收货人电话"
        prop="invoiceConsigneePhone"
      >
        <el-input v-model="ruleForm.invoiceConsigneePhone" />
      </el-form-item>
      
      <el-form-item label="发票收货省市区" prop="province">
        <Address v-model:province="ruleForm.province" v-model:city="ruleForm.city" v-model:district="ruleForm.district"  />
      </el-form-item>

      <el-form-item label="收货详细地址" prop="invoiceConsigneeAddress">
        <el-input 
            v-model="ruleForm.invoiceConsigneeAddress"
            maxlength="50"
            placeholder="收货详细地址"
            show-word-limit
            type="text"  />
        
      </el-form-item>

      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >Create</el-button
        >
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item> -->
    </el-form>
    <h4 v-else class="titelh4">
      请前往客户管理新增开票信息 
      <el-link style="font-size:18px;" :underline="false" type="primary" @click="router.push('/crm/customer/customer')">立即前往</el-link>
      
    </h4>
  </div>
  <el-dialog
    v-model="orderdialog"
    title="选择订单"
    width="50%"
  >
    <div class="mt-4">
      <el-input
        v-model="input"
        placeholder="请输入搜索关键词"
        class="input-with-select"
      >
        <template #prepend>
          <el-select v-model="select" placeholder="Select" style="width: 115px">
            <el-option label="订单编号" value="orderBusinessKeyKeyword" />
            <el-option label="客户昵称" value="customerNameKeyword" />
            <el-option label="客户编号" value="customerNumberKeyword" />
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" @click="searchfn" />
        </template>
      </el-input>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="orderdata"
      style="width: 100%"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" width="55" />
      <el-table-column label="客户信息" width="120">
        <template #default="scope">{{ scope.row.customerName }}</template>
      </el-table-column>
      <el-table-column property="orderBusinessKey" label="订单编号" width="120" />
      <el-table-column
        property="contractNo"
        label="合同编号"
        show-overflow-tooltip
      />
      <el-table-column property="invoiceEntity" label="开票主体" width="120" />
      <!-- <el-table-column property="invoiceType" label="开票类型" width="120" /> -->
      <el-table-column label="开票类型" width="120">
        <template #default="scope">
            <DictTag
							style="display: inline-block"
							:value="scope.row.invoiceType"
							:options="crm_invoice_type"
						/>
          </template>
      </el-table-column>
      
      <el-table-column property="businessStaffName" label="业务员" width="120" />
      <el-table-column label="订单总价" width="120">
        <template #default="scope">
          {{showMoney(scope.row.orderTaxInclusiveTotalPrice)}}
        </template>
      </el-table-column>
      <el-table-column label="已开票金额" width="120">
        <template #default="scope">
          {{showMoney(scope.row.finishInvoiceAmount)}}
        </template>
      </el-table-column>
      <el-table-column label="未开票金额" width="120">
        <template #default="scope">
          {{showMoney(scope.row.notApplyInvoiceAmount)}}
        </template>
      </el-table-column>
      <el-table-column label="申请开票金额" width="220">
        <template #default="scope">
          <el-input-number class="numinp" style="width:200px;" placeholder="请输入申请开票金额" @blur="inpblur(scope.row)" @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false" v-model="scope.row.ApplicationAmount" />
        </template>
      </el-table-column>

    </el-table>
    <div class="pages" style="position: relative">
      <pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        v-model:page="formData.current"
        @pagination="GetApplyInvoicefn"
        :total="total"
        v-model:limit="formData.size"
        :pageSizes="[10, 20, 50, 100]"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="orderdialog = false">取消</el-button>
        <el-button type="primary" @click="selectdetermine">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="infodialog"
    title="选择开票主体"
    width="50%"
  >    
    <div :class="{contactPerson:true,active:item.id==dialogradio}" v-for="(item, index) in invoicedata" :key="index" @click="dialogradio=item.id">
      <ul>
        <li>开票信息{{ index + 1 }}：</li>
        <li class="human">
          <template v-if="shouwinvonum==1">
          <p>
            <!-- <span class="alignRight widthRight">联系人：</span>{{ item.invoiceCompanyName||'-' }} -->
          </p>
          <p>
            <span class="alignRight invoice">开票单位名称：</span>{{ item.invoiceCompanyName||'-' }}
          </p>
          <p>
            <span class="alignRight invoice">纳税人识别号：</span>{{ item.taxpayerRegistrationNumber||'-' }}
          </p>
          <p>
            <span class="alignRight invoice">邮箱：</span>{{ item.invoiceEmail||'-' }}
          </p>
          <div style="display: flex;">
            <div class="alignRight invoice">注册地址：</div>
            <div style="flex: 1;">{{ item.invoiceRegisteredAddress||'-' }}</div>
          </div>
          <p>
            <span class="alignRight invoice">联系电话：</span>{{ item.invoicePhone||'-' }}</p>
          <p>
            <span class="alignRight invoice">开户银行：</span>{{ item.invoiceDepositBank||'-' }}
          </p>
          <p>
            <span class="alignRight invoice">开户账号：</span>{{ item.invoiceBankAccount||'-' }}
          </p>
          </template>
          <template v-if="shouwinvonum==2">
          <p>
            <span class="alignRight invoice">发票收货人：</span>{{ item.invoiceConsigneeName||'-' }}
          </p>
          <p>
            <span class="alignRight invoice">收货人电话：</span>{{ item.invoiceConsigneePhone||'-' }}
          </p>
          <p>
            <span class="alignRight invoice">省市区：</span>
            {{ item.city||'-' }}
            {{ item.province||'-' }}
            {{ item.district||'-' }}

          </p>
          <p>
            <span class="alignRight invoice">发票收货地址：</span>{{ item.invoiceConsigneeAddress||'-' }}
          </p>
          </template>
        </li>
        <!-- <li>
          <el-radio-group :value="dialogradio" class="ml-4">
            <el-radio label="1" size="large"></el-radio>
          </el-radio-group>
        </li> -->
      </ul>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="infodialog = false">取消</el-button>
        <el-button type="primary" @click="selectinvo"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
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
import { ElMessage, ElMessageBox } from "element-plus";
import Address from "@/components/address/address.vue"
import { getcrmprojectdesignorderprocid } from "@/api/crm/order/contract";
import { Search } from '@element-plus/icons-vue'
import { formatDate } from '@/utils'
import { getFileName } from "@/utils/index";
import singDownFile from "@/components/singDownFile"
import Editor from "@/components/Editor"
import {
  setcustomerapply,
  GetCustomer,
  SetCustomer,
} from "@/api/orderManagement/customer/index";
import { GetApplyInvoice,CustomerInvoice,InvoiceRecordApply,InvoiceRecord,FinancialInvoice } from "@/api/crm/finance/contract"
const { proxy } = getCurrentInstance();
const { crm_payment_type, crm_invoice_type,crm_logistics } = proxy.useDict(
  "crm_payment_type",
  "crm_invoice_type",
  "crm_logistics"
);
const props = defineProps({
  status: {
    type: String,
    default: "1",
  },
  istype: {
    type: Number,
    default: 1,
  },
  isoperation: {
    type: Number,
    default: 1,
  },
  cid: {
    type: String
  },
  processParentId: {
    type: String,
  },
  rejdata: {
    type: Array,
    default: null,
  },
  invoiceType: {
    type: String,
  },
  cancelClick:{
    type:Function
  },
  isSaleman:{
    type:Boolean
  },
  userId:[String,Number],
});
// 接收父组件传来的方法
const emits = defineEmits(["cancelClick"]);
const router = useRouter();
const formSize = ref("default");
const ruleFormRef = ref("");
const ruleForm = ref({
  invoiceConsigneeName: "",
  invoiceConsigneePhone: "",
  invoiceConsigneeAddress: "",
  province:"北京市",
  city:"北京市",
  district:"海淀区"
});
const province=ref('北京市')
const city=ref('北京市')
const district=ref('海淀区')
const total = ref(0);
const formData = reactive({
    current: 1,
    size: 10,
});
const invoiceUrl = ref('')
const logisticsNumber = ref('')

const input = ref('')
const select = ref('orderBusinessKeyKeyword')
const orderdialog = ref(false);
const infodialog = ref(false);
const dialogVisible = ref(false)
const dialogData = ref('')
const Findata = ref({})
const orderdata = ref([]);
const logisticsType=ref('')
// let tepetxt = (props.istype = computed(() => {
//   return props.istype === 1 ? "设计服务" : "大货";
// }));
const rules = reactive({
  invoiceConsigneeName: [
    {
      required: true,
      message: "请输入收货人姓名",
      trigger: "blur",
    },
  ],
  invoiceConsigneePhone: [{ required: true, message: "请输入收货人电话", trigger: "blur" }],
  province: [
    { required: true, message: "选择省市区", trigger: "change" },
  ],
  invoiceConsigneeAddress: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
});
const showinvoice = ref({})
const invoicedata = ref([
 
]);
const shouwinvonum=ref(0)
const dialogradio=ref('')
const multipleSelection=ref(null)
const dispdata=ref([])
const multipleTableRef = ref(null)

const getRowKeys = (row) => {
    return row.orderBusinessKey
}
const handleSelectionChange = (rows) => {
  if(rows.length&&rows.length>1){
    let a=rows[0]
    let b=rows[rows.length-1]
    // if(b.contractNo!=a.contractNo||b.customerId!=a.customerId||b.invoiceEntityId!=a.invoiceEntityId||b.invoiceEntity!=a.invoiceEntity){
    if(b.customerNumber!=a.customerNumber||b.invoiceEntity!=a.invoiceEntity||b.invoiceType!=a.invoiceType||b.invoiceEntityId!=a.invoiceEntityId){
      multipleTableRef.value.toggleRowSelection(b, false)
      return
    }
  }
  multipleSelection.value = rows
};
const selectprice=ref(0)
const selectdetermine = ()=>{
  if(!multipleSelection?.value?.length) return
  selectprice.value=0
  dispdata.value=multipleSelection.value
  // console.log('multipleSelection.value',ruleForm);
  if(multipleSelection?.value?.length){
    multipleSelection.value.forEach(e => {
      selectprice.value+=e.ApplicationAmount
    });
  }
  getCustomerInvoice(1)

  orderdialog.value = false
}
const invodatashow = (num) =>{
  shouwinvonum.value=num
  infodialog.value=true
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
function showFile(data){
	dialogVisible.value = true
	dialogData.value = data
}
const inpblur = (row)=>{
  console.log(row.ApplicationAmount);
  if(row.ApplicationAmount>row.notApplyInvoiceAmount){
    ElMessage.error('申请开票金额不能大于未开票金额')
    row.ApplicationAmount=row.notApplyInvoiceAmount
  }
}
const getText = (str) => {
  return str
    .replace(/<[^<p>]+>/g, '')  // 将所有<p>标签 replace ''
    .replace(/<[</p>$]+>/g, '')  // 将所有</p>标签 replace ''
    .replace(/&nbsp;/gi, '')  // 将所有 空格 replace ''
    .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
    .replace(/^\s*|\s*$/g,"")
}
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
const remark=ref('')
const submitForm = async (formEl) => {
  if(props.istype==1){
    if(!dispdata.value.length){
      ElMessage.error('请选择开票订单')
      return
    }
    if(!multipleSelection.value?.length){
      ElMessage.error('请填写发票收货地址信息')
      return
    }
    if(!ruleForm.value.invoiceConsigneeName){
      ElMessage.error('请输入发票收货人')
      return
    }
    if(!ruleForm.value.invoiceConsigneePhone){
      ElMessage.error('请输入收货人电话')
      return
    }
    if(!ruleForm.value.province||!ruleForm.value.city||!ruleForm.value.district){
      ElMessage.error('请选择省市区')
      return
    }
    if(!ruleForm.value.invoiceConsigneeAddress){
      ElMessage.error('请输入收货详细地址')
      return
    }
    let oList=multipleSelection.value.map(e=>{
      let obj={orderId:e.processParentId,procType:e.parentProcType,applyInvoiceAmount:e.ApplicationAmount}
      return obj
    })

    ElMessageBox.confirm("确定提交吗？",)
    .then(() => {
      InvoiceRecordApply(
        {
          ...ruleForm.value,
          orderList:oList,
          invoiceAmount:selectprice.value||'',
          invoiceBankAccount:showinvoice.value?.invoiceBankAccount||'',
          invoiceCompanyName:showinvoice.value?.invoiceCompanyName||'',
          invoiceDepositBank:showinvoice.value?.invoiceDepositBank||'',
          invoiceEmail:showinvoice.value?.invoiceEmail||'',
          invoicePhone:showinvoice.value?.invoicePhone||'',
          invoiceRegisteredAddress:showinvoice.value?.invoiceRegisteredAddress||'',
          taxpayerRegistrationNumber:showinvoice.value?.taxpayerRegistrationNumber||'',
        }
      ).then(res=>{
        if(res.code===200){
          emits("cancelClick")
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
  }
  if(props.istype==2){
    if((props.invoiceType==1&&!getText(invoiceUrl.value))){
      ElMessage.error('请填写发票凭证')
      return
    }
    if((props.invoiceType==2||props.invoiceType==3)&&!logisticsNumber.value){
      ElMessage.error('请输入物流单号')
      return
    }
    ElMessageBox.confirm("确定提交吗？",)
    .then(() => {
      FinancialInvoice(
        {
          id:props.processParentId,
          // invoiceName:getFileName(invoiceUrl.value),
          invoiceUrl:props.invoiceType==1?invoiceUrl.value:'',
          logisticsNumber:props.invoiceType!=1?logisticsNumber.value:'',
          logisticsType:props.invoiceType==2||props.invoiceType==3?logisticsType.value:''
        }
      ).then(res=>{
        if(res.code===200){
          emits("cancelClick")
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
  }
  

};
const selectinvo = () => {
  let data=invoicedata.value.filter(e=>{
    return e.id==dialogradio.value
  })
  if(shouwinvonum.value===1){
    showinvoice.value=data[0]
  }else if(shouwinvonum.value===2){
    ruleForm.value.invoiceConsigneeName=data[0].invoiceConsigneeName,
    ruleForm.value.invoiceConsigneePhone=data[0].invoiceConsigneePhone,
    ruleForm.value.invoiceConsigneeAddress=data[0].invoiceConsigneeAddress,
    ruleForm.value.province=data[0].province,
    ruleForm.value.city=data[0].city,
    ruleForm.value.district=data[0].district
  }
  infodialog.value = false
}
const submitFormfn = () => {
  submitForm(ruleFormRef.value);
};
const searchfn = () => {
  // console.log({[select.value]:input.value,...formData});
  let queryData=null
  if(props.isSaleman){
    queryData={[select.value]:input.value,...formData,'businessStaffId':props.userId}
  }else{
    queryData={[select.value]:input.value,...formData}
  }
  GetApplyInvoice(queryData).then(res=>{
    if(res.code===200){
      orderdata.value=res.data.records.map(e=>{
        e.ApplicationAmount=e.notApplyInvoiceAmount
        return e
      })
      total.value=res.data.total
    }
  })
}
const GetApplyInvoicefn = () => {
  let parmData=null
  if(props.isSaleman){
    parmData={[select.value]:input.value,...formData,'businessStaffId':props.userId}
  }else{
    parmData={[select.value]:input.value,...formData}
  }
  GetApplyInvoice(parmData).then(res=>{
    if(res.code===200){
      orderdata.value=res.data.records.map(e=>{
        e.ApplicationAmount=e.notApplyInvoiceAmount
        return e
      })
      total.value=res.data.total
    }
  })
};
const getCustomerInvoice=(num)=>{
  console.log('multipleSelection.value',multipleSelection.value);
  let idnum=''
  if(num===1){
    idnum=multipleSelection.value[0]?.customerId
  }else{
    idnum=props.cid;
  }
  CustomerInvoice(idnum).then(res=>{
    if(res.code===200){
      invoicedata.value=res.data
    }
    if(num===1&&invoicedata?.value?.length){
      ruleForm.value.invoiceConsigneeName=invoicedata.value[0].invoiceConsigneeName,
      ruleForm.value.invoiceConsigneePhone=invoicedata.value[0].invoiceConsigneePhone,
      ruleForm.value.invoiceConsigneeAddress=invoicedata.value[0].invoiceConsigneeAddress,
      ruleForm.value.province=invoicedata.value[0].province,
      ruleForm.value.city=invoicedata.value[0].city,
      ruleForm.value.district=invoicedata.value[0].district
      dialogradio.value=invoicedata.value[0].id
      console.log('1112',ruleForm.value);
    }
    showinvoice.value=invoicedata.value[0]

  })
  if(num===2||num===3){
    InvoiceRecord(props.processParentId).then(res=>{
      if(res.code===200){
        Findata.value=res.data
        // console.log('Findata.value',Findata.value);
      }
    })
  }
};
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
onMounted(() => {
  // console.log('props.status',orderdata.value[0].customerId);
  // 

  if(props.istype==1){
    GetApplyInvoicefn()
  }else if(props.istype==2){
    getCustomerInvoice(2)
  }else{
    getCustomerInvoice(3)
  }
  
  if (props.status == 1 || props.status == 2) {
    // ruleForm.contractUrl = props.detaildata?.designServiceContractUrl ?? "";
    // ruleForm.ContractNo = props.detaildata?.contractNo ?? "";
    // ruleForm.contractPrice =
    //   props.detaildata?.designServiceTaxInclusiveFee ?? "";
    // ruleForm.contractTaxes = props.detaildata?.designServiceTaxes ?? "";
  }
});
// onUnmounted(() => {
// });
// const options = Array.from({ length: 10000 }).map((_, idx) => ({
//   value: `${idx + 1}`,
//   label: `${idx + 1}`,
// }));

const confirmClick = () => {
  submitForm();
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
  invoicedata
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
  margin-bottom: 15px;
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
  // max-width: 610px;
  display: flex;
  margin-right: 30px;
  overflow: auto;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 10px;
  margin: 20px 0;
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
.active{
  border-color: red;
}
.titelh4{
  margin: 50px;;
  text-align: center;
  color: red;
}
.staus-tips{
  width: 70px;
  height: 70px;
  position: absolute;
  right: 60px;
  top: 60px;
  border: #b3b3b3 1px dashed;
  color: #b3b3b3;
  border-radius: 35px;
  text-align: center;
  line-height: 70px;
  font-size: 18px;
  user-select:none;
  transform:rotate(45deg);
  z-index: 99;
  background: #fff;
}
</style>

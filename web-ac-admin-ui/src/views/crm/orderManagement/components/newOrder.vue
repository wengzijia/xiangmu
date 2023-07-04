<template>
  <div class="lookDetail">
    <el-drawer v-model="isTable" direction="rtl" :title="orderType.orderTitle" size="600px" @close="cancelClick">
      <template #default>
        <div>
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="134px" class="demo-ruleForm"
            size="default" status-icon>
            <el-form-item label="选择客户：" prop="customerId">
              <el-select v-model="ruleForm.customerId" placeholder="请选择客户" style="width: 423px" clearable filterable>
                <div v-if="isMounted" v-infinite-scroll="load" style="overflow: auto; height: 200px">
                  <el-option v-for="item in customerList" :key="item.id" :label="item.baseInfo.customerName"
                    :value="item.baseInfo.customerId" @click="selectCustom(
                        item.baseInfo.customerNumber,
                        item.baseInfo.customerName,
                        item.baseInfo.moreSettlementMethodId
                      )
                      " />
                </div>
              </el-select>
            </el-form-item>

            <el-form-item v-if="orderType.type != '2'" label="设计服务合同：" prop="designServiceContractUrl">
              <crmFileUpload v-model:modelValue="ruleForm.designServiceContractUrl" name="上传合同"
                :fileType="['pdf', 'png', 'jpg', 'jpeg']" :fileSize="50" :del="true" replace>
              </crmFileUpload>
            </el-form-item>
            <el-form-item v-if="orderType.type != '2'" label="合同编号：" prop="designServiceContractNo">
              <el-input v-model="ruleForm.designServiceContractNo" maxlength="50" placeholder="请输入合同编号" show-word-limit
                type="text" />
            </el-form-item>
            <el-form-item label="品类：" prop="categoryList">
              <div class="catebox">
                <el-button @click="openCategory">选择品类</el-button>
                <p class="showCate" v-for="(e, i) in ruleForm.categoryList" :key="i">
                  {{ e.goodsName }}（数量：{{ e.proofingQuantity }}）
                </p>
              </div>
              <innerCategory ref="innerCategoryRef" @getCategoryList="getCategoryList" :formList="ruleForm.categoryList" :orderType="orderType.type">
              </innerCategory>
            </el-form-item>
            <!-- <el-form-item v-if="
              ruleForm.invoiceEntityList &&
              ruleForm.invoiceEntityList.length
            " label="开票类型：" prop="invoiceType"> -->
            <el-form-item label="开票类型：" prop="invoiceType">
              <div>
                <!-- <el-select v-model="ruleForm.invoiceType" placeholder="请选择开票类型" style="width: 370px" clearable filterable>
                  <el-option v-for="e in ruleForm.invoiceEntityList" :key="e.id" :label="invoiceTypeName(e.invoiceType)"
                    :value="e.invoiceType" />
                </el-select> -->
                <el-select v-model="ruleForm.invoiceType" class="m-2" style="width: 370px" placeholder="所有类型" 
                  @change="changeInvoiceType">
                  <el-option v-for="item in crm_invoice_type" :key="item.id" :label="item.label" :value="item.value" />
                </el-select>
                <el-tooltip class="box-item" effect="dark" placement="top-end">
                  <template #content>普票税点：3%<br />专票税点：13% </template>
                  <el-icon class="icons">
                    <WarningFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item v-if="crmInvoiceConfigList.length > 0" label="开票主体：" prop="invoiceEntity">
              <el-select v-model="ruleForm.invoiceEntity" placeholder="请选择开票主体 (与合同主体一致)" style="width: 423px" clearable
                filterable>
                <el-option v-for="e in crmInvoiceConfigList" :key="e.id" :label="e.invoiceEntity" :value="e.invoiceEntity"
                  @click="changeInvoiceEntity(e)" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="orderType.type != '2'" label="设计服务费：" prop="designServiceEntryFee">
              <!-- <div>
                <el-input style="width: 370px" v-model="ruleForm.designServiceTaxInclusiveFee" placeholder="请输入设计服务费（含税）"
                  maxlength="15" />
                <el-tooltip class="box-item" effect="dark" placement="top-end">
                  <template #content>与客户签订最终成交金额，包含设计、<br />打样费用（不包含物流费，含税）
                  </template>
                  <el-icon class="icons">
                    <WarningFilled />
                  </el-icon>
                </el-tooltip>
              </div> -->
              <div>
                <el-input style="width: 409px" v-model="ruleForm.designServiceEntryFee" :placeholder="`请输入设计服务费（${ruleForm.designServiceEntryFeeTaxInclusive
                    ? '含税'
                    : '不含税'
                  }）`" maxlength="15" />
                <el-checkbox v-model="ruleForm.designServiceEntryFeeTaxInclusive" :label="`按${ruleForm.designServiceEntryFeeTaxInclusive
                    ? '含税'
                    : '不含税'
                  }价录入`" size="large" />
              </div>
            </el-form-item>
            <el-form-item v-if="orderType.type != '2' && ruleForm.designServiceEntryFee">
              <template #label>
                <div style="width: 200px !important">
                  设计服务费（{{
                    !ruleForm.designServiceEntryFeeTaxInclusive
                    ? "含税"
                    : "不含税"
                  }}）：
                </div>
              </template>
              <span>{{
                whetherThePriceIncludesTax(
                  ruleForm.designServiceEntryFeeTaxInclusive,
                  ruleForm.designServiceEntryFee,
                  ruleForm.invoiceTaxRate,
                  2
                )
              }}元</span>
            </el-form-item>
            <el-form-item v-if="orderType.type != '2' && ruleForm.designServiceEntryFee" label="税金："
              prop="designServiceTaxes">
              <span>{{
                whetherThePriceIncludesTax(
                  ruleForm.designServiceEntryFeeTaxInclusive,
                  ruleForm.designServiceEntryFee,
                  ruleForm.invoiceTaxRate,
                  1
                )
              }}元</span>
            </el-form-item>

            <el-form-item v-if="orderType.type != '2'" prop="designServiceCostEstimationTableUrl">
              <template #label>
                <div style="width: 200px !important">
                  设计服务费成本预估表：
                </div>
              </template>
              <crmFileUpload v-model:modelValue="ruleForm.designServiceCostEstimationTableUrl
                  " name="上传表格" :fileType="['xlsx','xls']" :fileSize="5" :del="true" replace>
              </crmFileUpload>
            </el-form-item>
            <!-- <el-form-item v-if="orderType.type != '2'" label="税金：" prop="designServiceTaxes">
              <el-input v-model="ruleForm.designServiceTaxes"
                :placeholder="orderType.type == '1' ? '请输入包含税金额度' : '请输入设计费包含税金额度'" maxlength="15" />
            </el-form-item> -->
            <el-form-item v-if="orderType.type == '1'" label="预计交货日期：" prop="expectedDeliveryDate">
              <el-date-picker style="width: 423px" v-model="ruleForm.expectedDeliveryDate" type="date"
                placeholder="请选择预计交货日期" size="default" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item v-if="orderType.type != '2'" label="合同签订日期：" prop="contractSignDate">
              <el-date-picker style="width: 423px" v-model="ruleForm.contractSignDate" type="date" placeholder="请选择合同签订日期"
                size="default" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item v-if="orderType.type == '1'" label="首付款最晚日期：" prop="firstPaymentLatestDate">
              <el-date-picker style="width: 423px" v-model="ruleForm.firstPaymentLatestDate" type="date"
                placeholder="请选择首付款最晚日期" size="default" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item v-if="orderType.type == '1'" label="尾款最晚日期：" prop="finalPaymentLatestDate">
              <el-date-picker style="width: 423px" v-model="ruleForm.finalPaymentLatestDate" type="date"
                placeholder="请选择尾款最晚日期" size="default" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item v-if="orderType.type == '1'" label="结算方式：">
              <!-- <el-radio-group v-model="ruleForm.settlementMethod">
                <el-radio label="69">立结</el-radio>
                <el-radio v-if="
                  ruleForm.customerSettlementMethod &&
                  methodItem
                " :label="ruleForm.customerSettlementMethod">
                  <span>{{ methodItem.optionDesc }}</span>
                </el-radio>
              </el-radio-group> -->
              <span class="customer" v-if="ruleForm.customerSettlementMethod && methodItem">
                {{ methodItem.optionDesc }}
              </span>
              <span class="customer" v-else>立结</span>
            </el-form-item>

            <el-form-item v-if="orderType.type != '2'" label="业务员：" prop="businessStaffName">
              <span v-if="isRoles" class="customer">{{
                ruleForm.businessStaffName
              }}</span>
              <span v-else style="color:#ff0036">只有业务员才能新建订单</span>
              <!-- <el-select
                v-else
                v-model="ruleForm.businessStaffId"
                placeholder="请选择业务员"
                style="width: 423px"
                clearable
                filterable
              >
                <el-option
                  v-for="item in salesmanList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                  @click="getSalesman(item.nickName, item.userId, 1)"
                />
              </el-select> -->
            </el-form-item>
          </el-form>
          <h3 class="addrTxt">
            <p>
              收货地址<span class="addr">{{ orderType.addressTxt }}</span>
            </p>
            <el-button v-if="addressList.length > 0" style="height: 30px" @click="isAddress = true">选择其他收货地址</el-button>
          </h3>
          <el-form ref="addressFormRef" :model="addressForm" :rules="rules" label-width="120px" class="demo-addressForm"
            size="default" status-icon>
            <el-form-item label="收货人：" prop="consigneeName">
              <el-input v-model="addressForm.consigneeName" placeholder="请输入收货人" maxlength="50" />
            </el-form-item>
            <el-form-item label="联系电话：" prop="consigneePhone">
              <el-input v-model="addressForm.consigneePhone" placeholder="请输入联系电话" maxlength="13" />
            </el-form-item>
            <el-form-item label="省市区：" prop="address">
              <selectAddress v-model:address="addressForm.address" ref="addressRef"></selectAddress>
            </el-form-item>
            <el-form-item label="收货地址：" prop="consigneeAddress">
              <el-input v-model="addressForm.consigneeAddress" placeholder="请输入联系人详细地址" maxlength="50" />
            </el-form-item>
            <el-form-item v-if="orderType.type == '2'" label="业务员：" prop="businessStaffName">
              <span v-if="isRoles" class="customer">{{
                addressForm.businessStaffName
              }}</span>
              <span v-else style="color:#ff0036">只有业务员才能新建订单</span>
              <!-- <el-select
                v-if="!isRoles"
                v-model="addressForm.businessStaffId"
                placeholder="请选择业务员"
                style="width: 423px"
                clearable
                filterable
              >
                <el-option
                  v-for="item in saleList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                  @click="getSalesman(item.nickName, item.userId, 2)"
                />
              </el-select> -->
            </el-form-item>
          </el-form>
          <div class="is-align-center">
            <el-dialog v-model="isAddress" title="选择其他收货地址" width="600px">
              <ul class="addressBox">
                <li :class="addressIndex == index ? 'active' : ''" v-for="(item, index) in addressList" :key="item.id"
                  @click="addressIndex = index">
                  <el-icon class="selIcon" v-if="addressIndex == index">
                    <SuccessFilled />
                  </el-icon>
                  <p class="addrHead">
                    收货地址{{ toChineseNumber(index + 1) }}：
                  </p>
                  <div class="showInfo">
                    <p>
                      <span class="alignRight">收货人：</span>{{ item.consigneeName }}
                    </p>
                    <p>
                      <span class="alignRight">联系电话：</span>{{ item.consigneePhone }}
                    </p>
                    <p>
                      <span class="alignRight">收货地址：</span>
                      {{ item.province || "-" }}&nbsp;{{ item.city }}&nbsp;{{
                        item.district
                      }}&nbsp;{{ item.consigneeAddress }}
                    </p>
                  </div>
                </li>
              </ul>
              <template #footer>
                <span>
                  <el-button @click="isAddress = false">取消</el-button>
                  <el-button type="primary" @click="confirmAddress">确定</el-button>
                </span>
              </template>
            </el-dialog>
          </div>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick()" v-hasPermi="['@newOrder']">生成订单</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { formatDate,formatDates,getFileName, toChineseNumber, whetherThePriceIncludesTax } from "@/utils/index";

import innerCategory from "./innerCategory.vue";
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue";
import selectAddress from "@/components/selectAddress/index.vue";
import {
  customerEnabled,
  crmProjectDesignOrderProc,
  crmBulkOrderProc,
  crmBulkDesignProdOrderProc,
  crmInvoiceConfig,
  customerAddress,
} from "@/api/orderManagement/subOrder";
import { validateForms, checkPhone, debounce } from "@/utils/form";
import { onMounted, onUnmounted, watch } from "vue";
import { ElMessage, ElLoading } from "element-plus";

const { proxy } = getCurrentInstance();
const { crm_invoice_type } = proxy.useDict("crm_invoice_type");

const props = defineProps({
  salesmanList: {
    type: Array,
    default: [],
  },
  methodList: {
    type: Array,
    default: [],
  },
  isRoles: {
    type: Boolean,
    default: false,
  },
});
// 接收父组件传来的方法
const emits = defineEmits(["crmOrderProcView"]);
const ruleFormRef = ref();
const addressFormRef = ref();
const innerCategoryRef = ref();
const addressRef = ref();

let isTable = ref(false);
const orderType = reactive({
  orderTitle: "",
  type: null,
  addressTxt: "",
  invoiceName: "",
  customerList: [],
  crmInvoiceConfigList: [], //查询开票主体信息
  saleList: [],
  addressList: [],
  isAddress: false,
  addressIndex: 0,
  methodItem: "",
});

// 电话号码校验
const validatePhone = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入联系电话"));
  } else {
    // console.log('22222222---',value);
    if (checkPhone(value + "")) {
      callback();
    } else {
      callback(new Error("请输入有效的号码！"));
    }
  }
};
// 保留两位小数
const validateMoney = (rule, value, callback) => {
  let reg = /^[0-9]\d{0,11}(\.\d{1,2})?$/;
  if (value === "" || value === null) {
    callback(
      new Error(
        orderType.type == "1"
          ? "请输入包含税金额度"
          : "请输入设计费包含税金额度"
      )
    );
  } else {
    if (!reg.test(value)) {
      callback(new Error("整数最大12位，小数点最大2位"));
    } else {
      callback();
    }
  }
};
const validateMoney1 = (rule, value, callback) => {
  let reg1 = /^[0-9]\d{0,11}(\.\d{1,2})?$/;
  if (value === "" || value === null) {
    callback(
      new Error(
        `请输入设计服务费（${ruleForm.designServiceEntryFeeTaxInclusive ? "含税" : "不含税"
        }）`
      )
    );
  } else {
    if (ruleForm.invoiceType === "" || ruleForm.invoiceType === null) {
      callback(new Error(`请先选择开票类型！`));
    }
    if (
      ruleForm.invoiceType &&
      ruleForm.invoiceType != 4 &&
      !ruleForm.invoiceEntity
    ) {
      callback(new Error(`请先选择开票主体！`));
    }
    // console.log('整数最大12位，小数点最大2位===', value, reg1.test(value));
    if (!reg1.test(value)) {
      callback(new Error("整数最大12位，小数点最大2位"));
    } else {
      callback();
    }
  }
};
const validateNumber = (rule, value, callback) => {
  let reg2 = /^([1-9][0-9]*)$/; //正整数
  if (value === "" || value === null) {
    callback(new Error("请输入打样数量"));
  } else {
    if (!reg2.test(value)) {
      callback(new Error("请输入正整数"));
    } else {
      callback();
    }
  }
};
const validateCate = (rule, value, callback) => {
  if (value.length > 0) {
    // console.log('22222222-7777--', value)
    callback();
  } else {
    callback(new Error("请选择品类"));
  }
};
const validateAddress = (rule, value, callback) => {
  if (!value?.province) {
    callback(new Error("请选择省市区"));
  } else if(!value?.city){
    callback(new Error("请选择市和区"));
  }else if (!value?.district) {
    callback(new Error("请选择区"));
  } else {
    callback();
  }
};
const validateDate = (rule, value, callback) => {
  // console.log(54354354, ruleForm.customerSettlementMethod typeof === String);
  let day =
    ruleForm.customerSettlementMethod === null
      ? 0
      : methodItem.value?.rightInterval;

  // console.log(121212, formatDate(new Date(ruleForm.expectedDeliveryDate).getTime() + 60 * 60 * 1000 * 24 * day));
  // console.log(343434, formatDate(new Date(ruleForm.finalPaymentLatestDate).getTime()));
  // console.log('343434===', new Date(ruleForm.expectedDeliveryDate).getTime() + 60 * 60 * 1000 * 24 * day < new Date(ruleForm.finalPaymentLatestDate).getTime());

  if (value == "") {
    callback(new Error("请选择尾款最晚日期"));
  } else {
    if (ruleForm.customerSettlementMethod === "") {
      ruleForm.finalPaymentLatestDate = "";
      callback(new Error("请先选择客户，再选择日期！"));
    }
    if (ruleForm.expectedDeliveryDate === "") {
      ruleForm.finalPaymentLatestDate = "";
      callback(new Error("请先选择预计交货日期，再选择日期！"));
    }
    if (
      new Date(ruleForm.expectedDeliveryDate).getTime() +
      60 * 60 * 1000 * 24 * day <
      new Date(ruleForm.finalPaymentLatestDate).getTime()
    ) {
      ruleForm.finalPaymentLatestDate = "";
      callback(new Error("尾款最晚日期不得晚于${交货日期+结算方式最大天数}"));
    }
    if (
      new Date(formatDates(value)).getTime() <
      new Date(formatDates(ruleForm.firstPaymentLatestDate)).getTime()
    ) {
      ruleForm.finalPaymentLatestDate = "";
      callback(new Error("尾款最晚日期不能小于首付款最晚日期！"));
    }
    if (new Date(formatDates(new Date())).getTime() > new Date(formatDates(value)).getTime()) {
      ruleForm.finalPaymentLatestDate = "";
      callback(new Error("尾款最晚日期不得早于当前日期！"));
    } else {
      callback();
    }
  }
};
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

const ruleForm = reactive({
  customerId: "", //客户id
  customerName: "", //客户姓名
  designServiceContractUrl: "", //设计服务合同url
  designServiceContractNo: "", //设计服务合同编号
  designServiceContractName: "", //设计服务合同名称
  categoryList: [], //品类
  designServiceEntryFee: "", //设计服务费录入金额
  designServiceTaxExclusiveFee: "", //设计服务费(不含税)
  designServiceTaxInclusiveFee: "", //设计服务费(含税)
  designServiceEntryFeeTaxInclusive: true, //设计服务费录入金额是否含税
  invoiceTaxRate: 0, //开票税点
  designServiceTaxes: "", //设计服务税金
  designServiceCostEstimationTableUrl: "", //设计服务报价成本预估表url
  designServiceCostEstimationTableName: "", //设计服务报价成本预估表文件名
  invoiceType: "", //开票类型
  invoiceEntity: "", //开票主体
  invoiceEntityId: "", //开票主体id
  invoiceEntityList: [], //选择开票主体后获取开票类型
  businessStaffName: "", //业务员
  businessStaffId: "", //业务员id
  customerNumber: "", //客户编号
  // settlementMethod: '69', //结算方式
  customerSettlementMethod: "", //根据选择客户获取动态结算方式
  expectedDeliveryDate: "", //预计交货日期
  finalPaymentLatestDate: "", //尾款最晚日期
  firstPaymentLatestDate: "", //首付款最晚日期
  contractSignDate: "", //合同签订日期
});
const addressForm = reactive({
  consigneeName: "", //收货人
  consigneePhone: "", //联系电话
  businessStaffName: "", //业务员
  businessStaffId: "", //业务员id
  province: "", //省
  city: "", //市
  district: "", //区
  consigneeAddress: "", //收货详细地址
  addressType: "",
  address:null
});
const invoiceForm = reactive({
  invoiceCompanyName: "", //开票单位名称
  invoiceTaxpayerRegistrationNumber: "", //纳税人识别号
  invoiceEmail: "", //邮箱号
  invoiceRegisteredAddress: "", //注册地址
  invoicePhone: "", //联系电话
  invoiceDepositBank: "", //开户银行
  invoiceBankAccount: "", //开会账号
});
const rules = reactive({
  address: [
    {
      required: true,
      // message: '请选择',
      validator: validateAddress,
      trigger: "change",
    },
  ],
  expectedDeliveryDate: [
    {
      required: true,
      message: "请选择预计交货日期",
      trigger: "blur",
    },
  ],
  contractSignDate: [
    {
      required: true,
      message: "请选择合同签订日期",
      trigger: "blur",
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
      trigger: "blur",
    },
  ],
  customerId: [
    {
      required: true,
      message: "请选择客户",
      trigger: "blur",
    },
  ],
  // settlementMethod: [
  //   {
  //     // required: true,
  //     message: '请选择结算方式',
  //     trigger: 'change',
  //   },
  // ],
  designServiceContractUrl: [
    {
      required: true,
      message: "请上传设计服务合同文件",
      trigger: "change",
    },
  ],
  designServiceContractNo: [
    {
      required: true,
      message: "请输入合同编号",
      trigger: "blur",
    },
  ],
  categoryList: [
    {
      required: true,
      validator: validateCate,
      trigger: "change",
    },
  ],
  designServiceEntryFee: [
    {
      required: true,
      validator: validateMoney1,
      trigger: "change",
    },
  ],
  designServiceCostEstimationTableUrl: [
    {
      required: true,
      message: "请上传设计服务费成本预估表",
      trigger: "change",
    },
  ],
  designServiceTaxes: [
    {
      required: ruleForm.invoiceType == 4 ? false : true,
      validator: validateMoney,
      trigger: "change",
    },
  ],
  invoiceType: [
    {
      required: true,
      message: "请选择开票类型",
      trigger: "change",
    },
  ],
  invoiceEntity: [
    {
      required: ruleForm.invoiceType == 4 ? false : true,
      message: "请选择开票主体 (与合同主体一致)",
      trigger: "change",
    },
  ],
  businessStaffName: [
    {
      required: true,
      message: "请选择业务员",
      trigger: "change",
    },
  ],
  consigneeName: [
    {
      required: true,
      message: "请输入收货人",
      trigger: "blur",
    },
  ],
  consigneePhone: [
    {
      required: true,
      validator: validatePhone,
      trigger: "blur",
    },
  ],
  consigneeAddress: [
    {
      required: true,
      message: "请输入联系人详细地址",
      trigger: "blur",
    },
  ],
});

const {
  crmInvoiceConfigList,
  customerList,
  saleList,
  addressList,
  invoiceName,
  isAddress,
  addressIndex,
  methodItem,
} = toRefs(orderType);

const openCategory = () => {
  innerCategoryRef.value.handleOpen();
};
const getCategoryList = () => {
  ruleForm.categoryList = JSON.parse(JSON.stringify(innerCategoryRef.value.categoryList));
  // console.log('categoryList------', innerCategoryRef.value.categoryList)
};
const getSalesman = (nickName, userId, type) => {
  if (type == 1) {
    ruleForm.businessStaffId = userId;
    ruleForm.businessStaffName = nickName;
  } else {
    addressForm.businessStaffId = userId;
    addressForm.businessStaffName = nickName;
  }
};
// 分页查询客户基础信息的传参
const baseParms = reactive({
  size: 6,
  current: 1,
});
const isMounted = ref(false);
onUpdated(() => {
  if (isTable.value) {
    isMounted.value = true;
  } else {
    isMounted.value = false;
  }
});

function load() {
  baseParms.current += 1;
  customerBaseInfoFn();
}
// 确认选中的地址
const confirmAddress = () => {
  isAddress.value = false;
  addressForm.consigneeName =
    addressList.value[addressIndex.value].consigneeName; //收货人
  addressForm.consigneePhone =
    addressList.value[addressIndex.value].consigneePhone; //联系电话
  addressForm.consigneeAddress =
    addressList.value[addressIndex.value].consigneeAddress; //收货地址
    let address = {
      province:addressList.value[addressIndex.value].province,
      city:addressList.value[addressIndex.value].city,
      district:addressList.value[addressIndex.value].district
    }
    addressForm.address = address
  // addressForm.province = addressList.value[addressIndex.value].province;
  // addressForm.city = addressList.value[addressIndex.value].city;
  // addressForm.district = addressList.value[addressIndex.value].district;
};
const customerAddressFn = (id) => {
  customerAddress(id).then((res) => {
    if (res.code == 200) {
      addressList.value = res.data;
      addressForm.consigneeName =
        res.data.length > 0 ? res.data[0].consigneeName : ""; //收货人
      addressForm.consigneePhone =
        res.data.length > 0 ? res.data[0].consigneePhone : ""; //联系电话
      addressForm.consigneeAddress =
        res.data.length > 0 ? res.data[0].consigneeAddress : ""; //收货地址
        let address = {
        province: res.data.length > 0 ? res.data[0].province : "",
        city:res.data.length > 0 ? res.data[0].city : "",
        district:res.data.length > 0 ? res.data[0].district : ""
      }
      addressForm.address = address
      // addressForm.province = res.data.length > 0 ? res.data[0].province : "";
      // addressForm.city = res.data.length > 0 ? res.data[0].city : "";
      // addressForm.district = res.data.length > 0 ? res.data[0].district : "";
      // console.log('addressForm.consigneeName======', addressForm.province)
    }
  });
};
// 分页查询客户基础信息
const customerBaseInfoFn = () => {
  customerEnabled(baseParms)
    .then((res) => {
      customerList.value.push(...res.data.records);
    })
    .catch((err) => {
      console.log(err);
    });
};
customerBaseInfoFn();
// 查询开票主体
const crmInvoiceConfigFn = (type) => {
  crmInvoiceConfig(type).then((res) => {
    // console.log('开票主体数据--', res)
    crmInvoiceConfigList.value = res.data;
  });
};
// 封装返回开票类型
const invoiceTypeName = (type) => {
  let invoiceName = crm_invoice_type.value.find((item) => item.value == type);
  return invoiceName.label;
};
// 选择开票类型
const changeInvoiceType = (val) => {
    ruleForm.invoiceEntity = null;
    ruleForm.invoiceEntityId = null;
  
  if (val == 4) {
    ruleForm.invoiceTaxRate = 0;
    crmInvoiceConfigList.value = [];
  } else {
    crmInvoiceConfigFn(val);
  }
};
// 选择发票主体
const changeInvoiceEntity = (item) => {
  // console.log("ruleForm.invoiceEntity", ruleForm.invoiceEntity);
  // console.log("税点", item);
  ruleForm.invoiceTaxRate = item.taxRate;
  ruleForm.invoiceEntityId = item.id;

  // if (val) {
  //   let invoiceItem = crmInvoiceConfigList.value.find(
  //     (item) => item.invoiceEntity == val
  //   )
  //   ruleForm.invoiceEntityList = invoiceItem.invoiceTypeList
  //   ruleForm.invoiceType = invoiceItem.invoiceTypeList[0].invoiceType
  //   ruleForm.invoiceEntityId = invoiceItem.id
  // } else {
  //   ruleForm.invoiceEntityList = []
  //   ruleForm.invoiceType = ''
  //   ruleForm.invoiceEntityId = ''
  // }
};
const taxValue = () => {
  ruleForm.designServiceTaxes = whetherThePriceIncludesTax(
    ruleForm.designServiceEntryFeeTaxInclusive,
    ruleForm.designServiceEntryFee,
    ruleForm.invoiceTaxRate,
    1
  );
  // 含税
  if (ruleForm.designServiceEntryFeeTaxInclusive) {
    ruleForm.designServiceTaxInclusiveFee = parseFloat(
      ruleForm.designServiceEntryFee
    );
    ruleForm.designServiceTaxExclusiveFee = whetherThePriceIncludesTax(
      ruleForm.designServiceEntryFeeTaxInclusive,
      ruleForm.designServiceEntryFee,
      ruleForm.invoiceTaxRate,
      2
    );
  } else {
    // 不含税
    ruleForm.designServiceTaxExclusiveFee = parseFloat(
      ruleForm.designServiceEntryFee
    );
    ruleForm.designServiceTaxInclusiveFee = whetherThePriceIncludesTax(
      ruleForm.designServiceEntryFeeTaxInclusive,
      ruleForm.designServiceEntryFee,
      ruleForm.invoiceTaxRate,
      2
    );
  }
};
// 新增方案设计订单
const crmProjectDesignOrderProcFn = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  ruleForm.designServiceContractName = getFileName(
    ruleForm.designServiceContractUrl
  );
  ruleForm.designServiceCostEstimationTableName = getFileName(
    ruleForm.designServiceCostEstimationTableUrl
  );
  // 删除对象不需要传值的属性customerList,designFileUrl
  // delete ruleForm.designFileUrl
  delete ruleForm.invoiceEntityList;
  delete ruleForm.customerSettlementMethod;
  ruleForm.categoryList.map((item) => {
    delete item.isCategoryEdit;
    delete item.isCancel;
    delete item.designFileUrl;
    delete item.firstGoodsName; //每个的商品名称
    delete item.secondGoodsName; //每个的商品名称
    delete item.thirdGoodsName; //每个的商品名称
  });
  const objTarget = Object.assign({ ...addressForm }, ruleForm);
  // console.log("ruleForm---",ruleForm);
  // console.log("objTarget---",objTarget);
  crmProjectDesignOrderProc(objTarget)
    .then((res) => {
      if (res.code == 200) {
        loading.close()
        // isTable.value = false
        emits("crmOrderProcView", 1);
        cancelClick();
        ElMessage({
          message: "新增方案设计订单成功",
          type: "success",
        });
        // console.log('新增方案设计订单--', res)
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
// 新增大货订单
const crmBulkOrderProcFn = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  // 删除对象不需要传值的属性customerList,
  delete ruleForm.designServiceEntryFee;
  delete ruleForm.designServiceContractUrl;
  delete ruleForm.designServiceContractName;
  delete ruleForm.designServiceCostEstimationTableUrl;
  delete ruleForm.designServiceCostEstimationTableName;
  delete ruleForm.invoiceEntityList;
  delete ruleForm.designServiceContractNo;
  delete ruleForm.customerSettlementMethod;
  delete ruleForm.expectedDeliveryDate;
  delete ruleForm.finalPaymentLatestDate;
  delete ruleForm.firstPaymentLatestDate;
  delete ruleForm.contractSignDate;
  delete ruleForm.designServiceTaxExclusiveFee; //设计服务费(不含税)
  delete ruleForm.designServiceTaxInclusiveFee; //设计服务费(含税)
  ruleForm.categoryList.map((item) => {
    // 大货订单
    item.bulkProdQuantity = item.proofingQuantity;
    item.designFileName = getFileName(item.designFileUrl);
    delete item.proofingQuantity;
    delete item.designRequirementAttachment;
    delete item.designRequirementRtf;
    delete item.isCategoryEdit;
    delete item.isCancel;
    delete item.firstGoodsName; //每个的商品名称
    delete item.secondGoodsName; //每个的商品名称
    delete item.thirdGoodsName; //每个的商品名称
  });
  const objTarget = Object.assign({ ...ruleForm }, addressForm);
  // console.log('ruleForm---', ruleForm)
  // console.log('objTarget---', objTarget)
  crmBulkOrderProc(objTarget)
    .then((res) => {
      // console.log('crmBulkOrderProc-----', res)
      if (res.code == 200) {
        // isTable.value = false
        loading.close()
        emits("crmOrderProcView", 1);
        cancelClick();
        ElMessage({
          message: "新增大货订单成功",
          type: "success",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
// 新增大货设计生产订单
const crmBulkDesignProdOrderProcFn = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  ruleForm.designServiceContractName = getFileName(
    ruleForm.designServiceContractUrl
  );
  ruleForm.designServiceCostEstimationTableName = getFileName(
    ruleForm.designServiceCostEstimationTableUrl
  );
  // 删除对象不需要传值的属性
  // delete ruleForm.designFileUrl
  delete ruleForm.crmInvoiceConfigList;
  delete ruleForm.invoiceEntityList;
  delete ruleForm.customerSettlementMethod;
  delete ruleForm.expectedDeliveryDate;
  delete ruleForm.finalPaymentLatestDate;
  delete ruleForm.firstPaymentLatestDate;
  ruleForm.categoryList.map((item) => {
    item.bulkProdQuantity = item.proofingQuantity;
    delete item.proofingQuantity;
    delete item.isCategoryEdit;
    delete item.isCancel;
    delete item.designFileUrl;
    delete item.firstGoodsName; //每个的商品名称
    delete item.secondGoodsName; //每个的商品名称
    delete item.thirdGoodsName; //每个的商品名称
  });

  const objTarget = Object.assign({ ...addressForm }, ruleForm);
  // console.log('ruleForm---', ruleForm)
  // console.log('objTarget---', objTarget)
  crmBulkDesignProdOrderProc(objTarget)
    .then((res) => {
      // console.log('crmBulkDesignProdOrderProc---', res)
      if (res.code == 200) {
        loading.close()
        // isTable.value = false
        emits("crmOrderProcView", 1);
        cancelClick();
        ElMessage({
          message: "新增大货设计生产订单成功",
          type: "success",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
// 选择客户
const selectCustom = (customerNumber, customerName, moreSettlementMethodId) => {
  ruleForm.customerNumber = customerNumber;
  ruleForm.customerName = customerName;
  if (moreSettlementMethodId == "69") {
    ruleForm.customerSettlementMethod = null;
  } else {
    ruleForm.customerSettlementMethod = moreSettlementMethodId;
    methodItem.value = props.methodList.find(
      (item) => item.id == moreSettlementMethodId
    );
  }
  addressForm.province = "";
  addressForm.city = "";
  addressForm.district = "";
  addressRef.value.clearAddress();
  customerAddressFn(ruleForm.customerId);
};
// 取消按钮
const cancelClick = () => {
  isTable.value = false;
  if (!ruleFormRef.value || !addressFormRef.value) return;
  ruleFormRef.value.resetFields();
  addressFormRef.value.resetFields();
  addressForm.businessStaffId = "";
  ruleForm.businessStaffId = "";
  innerCategoryRef.value.categoryList = [];
  addressRef.value.clearAddress();
  addressList.value = [];
  ruleForm.invoiceEntityList = [];
  ruleForm.customerSettlementMethod = "";
  addressForm.province = "";
  addressForm.city = "";
  addressForm.district = "";
  ruleForm.designServiceCostEstimationTableName = "";
  ruleForm.designServiceCostEstimationTableUrl = "";

  // console.log("addressFormRef--",addressForm);
};
// 生成订单按钮
const confirmClick = () => {
  addressForm.province = addressForm.address.province;
  addressForm.city = addressForm.address.city;
  addressForm.district = addressForm.address.district;
  if (!addressForm.address.province||!addressForm.address.city||!addressForm.address.district) {
    ElMessage.error('请选择省市区')
    return
  }
  submitForm();
};
const submitForm = debounce(async () => {
  taxValue();
  let formRefs = [ruleFormRef.value, addressFormRef.value];
  validateForms(formRefs)
    .then(() => {
      if (orderType.type == "1") {
        crmProjectDesignOrderProcFn();
      } else if (orderType.type == "2") {
        crmBulkOrderProcFn();
      } else {
        crmBulkDesignProdOrderProcFn();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}, 100);
let timer = null;
//暴露给父组件的方法控制显示与隐藏
const dialogShow = (type, order, item) => {
  saleList.value = props.salesmanList;
  ruleForm.businessStaffName = props.isRoles ? item.nickName : ""; //业务员
  ruleForm.businessStaffId = props.isRoles ? item.userId : ""; //业务员id
  addressForm.businessStaffName = props.isRoles ? item.nickName : ""; //业务员
  addressForm.businessStaffId = props.isRoles ? item.userId : ""; //业务员id
  timer = setTimeout(() => {
    isTable.value = type;
  }, 210);
  if (order == 1) {
    orderType.orderTitle = "新建方案设计订单";
    orderType.type = "1";
    orderType.addressTxt = "（用于样品的收货地址）";
  } else if (order == 2) {
    orderType.orderTitle = "新建大货订单";
    orderType.type = "2";
    orderType.addressTxt = "（用于样品、大货的收货地址）";
  } else {
    orderType.orderTitle = "新建大货设计生产订单";
    orderType.type = "3";
    orderType.addressTxt = "（用于样品、大货的收货地址）";
  }
};
onUnmounted(() => {
  clearTimeout(timer);
});
defineExpose({
  dialogShow,
});
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
}

p {
  margin: 0;
  padding: 0;
}

.icons {
  color: #b3b3b3;
  font-size: 22px;
  vertical-align: middle;
  margin-left: 10px;
  cursor: pointer;
}

.lookDetail :deep(.el-form-item__label) {
  font-weight: 700;
}

.customer {
  color: #b3b3b3;
  user-select: none;
}

.showCate {
  font-size: 12px;
  color: #a8abb2;
  height: 20px;
}

.addrTxt {
  display: flex;
  justify-content: space-between;
}

.addr {
  font-size: 14px;
  color: #aaa;
}

.addressBox li {
  border: 1px solid #ddd;
  border-radius: 6px;
  margin: 10px 60px;
  cursor: pointer;
  position: relative;
  padding: 10px;
}

.addressBox .active {
  border: 1px solid #1890ff;
}

.addressBox .showInfo>p {
  margin: 14px 0;
}

.selIcon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 22px;
  color: #1890ff;
}

.alignRight {
  width: 100px;
  display: inline-block;
  text-align: right;
}

.addrHead {
  font-size: 18px;
  padding-left: 10px;
}
</style>

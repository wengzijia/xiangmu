<template>
  <el-card style="margin: 10px">
    <!-- 基本信息 -->
    <div v-show="tabType == '1'">
      <!-- 基础信息 -->
      <div>
        <h4 class="title">基础信息</h4>
        <p>
          <span class="alignRight">客户证照图像：</span>
          <img v-if="baseInfo" style="width: 64px; height: 64px; background: #ddd"
            :src="BASE_FILE_URL + baseInfo.licenseImageUrl" alt="" />
        </p>
        <p>
          <span class="alignRight">客户名称：</span>{{ baseInfo.customerName ? baseInfo.customerName : "-" }}
        </p>
        <p>
          <span class="alignRight">统一社会信用代码：</span>{{ baseInfo.unifiedSocialCreditCode || "-" }}
        </p>
        <p>
          <span class="alignRight">客户身份证号码：</span>{{ baseInfo.customerIdNumber || "-" }}
        </p>
        <div style="display: flex">
          <span class="alignRight">客户企业性质：</span>
          <DictText dict="crm_enterprisenature" :value="baseInfo.enterpriseNature"></DictText>
        </div>
        <p>
          <span class="alignRight">客户维护费用额度：</span>{{
            baseInfo.customerMaintenanceCostLimit
            ?showMoney( baseInfo.customerMaintenanceCostLimit) + "元"
            : "-"
          }}
        </p>
      </div>
      <!-- 联系人 -->
      <div v-if="contactsList.length > 0">
        <h4 class="title">联系人</h4>
        <div class="contactPerson">
          <ul v-for="(item, idx) in contactsList" :key="item.id">
            <li>联系人{{ toChineseNumber(idx + 1) }}：</li>
            <li class="human">
              <div v-if="item.pivotal" class="keyHuman">关键联系人</div>
              <p>
                <span class="alignRight widthRight">联系人：</span>{{ item.contactsName || "-" }}
              </p>
              <p>
                <span class="alignRight widthRight">联系电话：</span>{{ item.contactsPhone || "-" }}
              </p>
              <p>
                <span class="alignRight widthRight">省市区：</span>{{ item.province || "-" }}&nbsp;{{ item.city }}&nbsp;{{
                  item.district
                }}
              </p>
              <p>
                <span class="alignRight widthRight">联系地址：</span>{{ item.contactsAddress || "-" }}
              </p>
              <p>
                <span class="alignRight widthRight">联系邮编：</span>{{ item.contactsPostcode || "-" }}
              </p>
              <p>
                <span class="alignRight widthRight">职位：</span>{{ item.positionName || "-" }}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 开票信息 -->
      <div v-if="invoiceList.length > 0">
        <h4 class="title">开票信息</h4>
        <div class="contactPerson">
          <ul v-for="(e, i) in invoiceList" :key="e.id">
            <li>开票信息{{ toChineseNumber(i + 1) }}：</li>
            <li class="human">
              <p>
                <span class="alignRight invoice">开票单位名称：</span>{{ e.invoiceCompanyName || "-" }}
              </p>
              <p>
                <span class="alignRight invoice">纳税人识别号：</span>{{ e.taxpayerRegistrationNumber || "-" }}
              </p>
              <p>
                <span class="alignRight invoice">邮箱：</span>{{ e.invoiceEmail || "-" }}
              </p>
              <p>
                <span class="alignRight invoice">注册地址：</span>{{ e.invoiceRegisteredAddress || "-" }}
              </p>
              <p>
                <span class="alignRight invoice">联系电话：</span>{{ e.invoicePhone || "-" }}
              </p>
              <p>
                <span class="alignRight invoice">开户银行：</span>{{ e.invoiceDepositBank || "-" }}
              </p>
              <p>
                <span class="alignRight invoice">开户账号：</span>{{ e.invoiceBankAccount || "-" }}
              </p>
              <p>
                <span class="alignRight invoice">发票收货人：</span>{{ e.invoiceConsigneeName || "-" }}
              </p>
              <p>
                <span class="alignRight invoice">收货人电话：</span>{{ e.invoiceConsigneePhone || "-" }}
              </p>
              <p>
                <span class="alignRight invoice">发票省市区：</span>{{ e.province || "-" }}&nbsp;{{ e.city }}&nbsp;{{ e.district
                }}
              </p>
              <p>
                <span class="alignRight invoice">发票收货地址：</span>{{ e.invoiceConsigneeAddress || "-" }}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 收货地址 -->
      <div v-if="addressList.length > 0">
        <h4 class="title">收货地址</h4>
        <div class="contactPerson">
          <ul v-for="(val, index) in addressList" :key="val.id">
            <li>收货地址{{ toChineseNumber(index + 1) }}：</li>
            <li class="human">
              <p>
                <span class="alignRight widthRight">收货人：</span>{{ val.consigneeName || "-" }}
              </p>
              <p>
                <span class="alignRight widthRight">联系电话：</span>{{ val.consigneePhone || "-" }}
              </p>
              <p>
                <span class="alignRight widthRight">省市区：</span>{{ val.province || "-" }}&nbsp;{{ val.city }}&nbsp;{{
                  val.district
                }}
              </p>
              <p>
                <span class="alignRight widthRight">收货地址：</span>{{ val.consigneeAddress || "-" }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 客户经营信息 -->
    <div v-show="tabType == '2'">
      <div style="display: flex; margin-bottom: 12px">
        <span class="alignRight">客户经营类型：</span>
        <DictText dict="crm_customerbusinesstype" :value="management.customerManagementType"></DictText>
        <span v-if="!management.customerManagementType">-</span>
      </div>

      <div style="display: flex">
        <span class="alignRight">客户销售商品类别：</span>
        <template v-for="(item, index) in managementSoldTypeList" :key="item.id">
          <span style="margin-top: 2px" v-if="index > 0">&nbsp;{{ index > 0 ? "/" : "" }}&nbsp;</span>
          <DictText dict="crm_Categoryofgoodssoldbycustomers" :value="item.customerSoldType"></DictText>
        </template>
        <span v-if="!managementSoldTypeList.length">-</span>
      </div>
      <p>
        <span class="alignRight">客户销售商品品牌：</span>{{ management.customerSoldBrand || "-" }}
      </p>
      <p>
        <span class="alignRight">上年度销售额：</span>{{ showMoney(management.previousYearSalesAmount) || "-" }}
      </p>
      <div style="display: flex">
        <span class="alignRight">所在行业品牌知名度：</span>
        <DictText dict="crm_Brandawarenessintheindustry" :value="management.industryBrandAwareness"></DictText>
        <span v-if="!management.industryBrandAwareness">-</span>
      </div>
      <div style="display: flex">
        <span class="alignRight">所在地域品牌知名度：</span>
        <DictText dict="crm_Brandawarenessintheindustry" :value="management.areaBrandAwareness"></DictText>
        <span v-if="!management.areaBrandAwareness">-</span>
      </div>
    </div>
    <!-- 风险信息 -->
    <div v-show="tabType == '3'">
      <h4 class="title">账期信用风险</h4>
      <p>
        <span class="alignRight">按期回款单数/占比：</span>
        {{ statisticsInfo.scheduleSettlementNumber }}
        <span v-if="statisticsInfo.scheduleSettlementRatio">
          （{{ saveTwoBit(statisticsInfo.scheduleSettlementRatio * 100) }}%）
        </span>
      </p>
      <p>
        <span class="alignRight">3个月内回款/占比：</span>
        {{ statisticsInfo.withinThreeMonthsSettlementNumber }}
        <span v-if="statisticsInfo.withinThreeMonthsSettlementRatio">
          （{{
            saveTwoBit(statisticsInfo.withinThreeMonthsSettlementRatio * 100)
          }}%）
        </span>
      </p>
      <p>
        <span class="alignRight">3至6个月回款/占比：</span>
        {{ statisticsInfo.threeToSixMonthsSettlementNumber }}
        <span v-if="statisticsInfo.threeToSixMonthsSettlementRatio">
          （{{
            saveTwoBit(statisticsInfo.threeToSixMonthsSettlementRatio * 100)
          }}%）
        </span>
      </p>
      <p>
        <span class="alignRight">6个月以上回款/占比：</span>
        {{ statisticsInfo.moreThanSixMonthsSettlementNumber }}
        <span v-if="statisticsInfo.moreThanSixMonthsSettlementRatio">
          （{{
            saveTwoBit(statisticsInfo.moreThanSixMonthsSettlementRatio * 100)
          }}%）
        </span>
      </p>
      <p>
        <span class="alignRight">可用授信额度：</span>
        {{ showMoney(statisticsInfo.usableCreditQuota) }}
      </p>
      <p>
        <span class="alignRight">已用授信额度：</span>
        {{ showMoney(statisticsInfo.usedCreditQuota) }}
      </p>
      <p>
        <span class="alignRight">授信额度：</span>
        {{ showMoney(baseInfo.customerCreditQuota) }}
      </p>
      <h4 class="title">其他风险</h4>
      <p>
        <span class="alignRight">更多结算方式：</span>
        <settlementMethod v-if="baseInfo.moreSettlementMethodId" :methodId="baseInfo.moreSettlementMethodId" :methodList="methodList" />
        <span v-else>立结</span>
      </p>
      <p>
        <span class="alignRight">*是否有诉讼：</span>
        <settlementMethod :methodId="baseInfo.existLawsuitId" :methodList="lawsuitList" />
      </p>
      <p>
        <span class="alignRight">*成立时长：</span>
        <settlementMethod :methodId="baseInfo.establishedTimeId" :methodList="establishedList" />
      </p>
      <p>
        <span class="alignRight">*注册资金：</span>
        <settlementMethod :methodId="baseInfo.registeredCapitalId" :methodList="registeredList" />
      </p>
      <p>
        <span class="alignRight">*人员规模：</span>
        <settlementMethod :methodId="baseInfo.staffSizeId" :methodList="staffSizeList" />
      </p>
      <p>
        <span class="alignRight">*行业排名：</span>
        <settlementMethod :methodId="baseInfo.industryRankingId" :methodList="rankingList" />
      </p>
    </div>
    <!-- 客户交易记录 -->
    <div v-show="tabType == '4'">
      <h4 class="title">合计</h4>
      <p>
        <span class="alignRight">订单平均订单金额：</span>
        {{
          statisticsInfo.averageOrderAmount !== "" &&
          statisticsInfo.averageOrderAmount !== null
          ? saveTwoBit(statisticsInfo.averageOrderAmount)
          : "-"
        }}
        <el-tooltip v-if="statisticsInfo.averageOrderAmount" class="box-item" effect="dark" placement="top-start">
          <template #content>除已中止订单的平均订单金额，未完成订单时订单金额取合同金额，已完成订单取对账单金额。
          </template>
          <el-icon class="icons">
            <WarningFilled />
          </el-icon>
        </el-tooltip>
      </p>
      <p>
        <span class="alignRight">订单平均利润率：</span>
        {{
          statisticsInfo.averageOrderProfitRatio !== "" &&
          statisticsInfo.averageOrderProfitRatio !== null
          ? saveTwoBit(statisticsInfo.averageOrderProfitRatio * 100) + "%"
          : "-"
        }}
        <el-tooltip v-if="statisticsInfo.averageOrderProfitRatio" class="box-item" effect="dark" placement="top-start">
          <template #content>仅统计已完成订单 </template>
          <el-icon class="icons">
            <WarningFilled />
          </el-icon>
        </el-tooltip>
      </p>
      <p>
        <span class="alignRight">订单平均利润额：</span>
        {{
          statisticsInfo.averageOrderProfit !== "" &&
          statisticsInfo.averageOrderProfit !== null
          ? saveTwoBit(statisticsInfo.averageOrderProfit)
          : "-"
        }}
        <el-tooltip v-if="statisticsInfo.averageOrderProfit" class="box-item" effect="dark" placement="top-start">
          <template #content>仅统计已完成订单 </template>
          <el-icon class="icons">
            <WarningFilled />
          </el-icon>
        </el-tooltip>
      </p>
      <h4 class="title">订单</h4>
      <el-table :data="tabList" style="width: 100%">
        <el-table-column label="订单编号" width="180">
          <template #default="scope">
            <span>{{ scope.row.businessKey }}</span>
            <el-icon class="icons" v-if="scope.row.businessKey" v-copyText="scope.row.businessKey"
              v-copyText:callback="copyTextSuccess">
              <CopyDocument />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" width="150">
          <template #default="scope">
            <DictTag :value="scope.row.procType" :options="crm_order_type" />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="订单品类" width="150">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" placement="top-end">
              <template #content>{{ scope.row.categoryStr }} </template>
              <div class="hiddenTxt">
                {{ scope.row.categoryStr }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" :align="'right'">
          <template #default="scope">
            {{ scope.row.orderTotalPrice ? showMoney(scope.row.orderTotalPrice) : "-" }}
          </template>
        </el-table-column>
        <el-table-column width="150" :align="'right'">
          <template #header>
            合同总价
            <el-tooltip class="box-item" effect="dark" placement="top-end">
              <template #content>订单已审核通过的设计服务合同，<br />大货合同的合同金额之和
              </template>
              <el-icon class="icons">
                <WarningFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <template #default="scope">
            <span>{{
              scope.row.contractTotalPrice ? showMoney(scope.row.contractTotalPrice) : "-"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="profitRate" label="利润率" :align="'right'">
          <template #default="scope">
            <span v-if="scope.row.procStatus == 2">
              {{ saveTwoBit(scope.row.profitRate * 100)
              }}{{ scope.row.profitRate ? "%" : "" }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="profitAmount" label="利润金额" :align="'right'">
          <template #default="scope">
            {{ saveTwoBit(scope.row.profitAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态"><template #default="scope">
            <DictTag :value="scope.row.procStatus" :options="crm_order_status" />
          </template>
        </el-table-column>
        <el-table-column prop="businessStaffName" label="成单业务员" width="100" />
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-link type="primary" :underline="false" @click="gotoDetail(scope.row, scope.row.procType)">查看详情</el-link>
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
</template>

<script setup>
import settlementMethod from "@/components/settlementMethod/index.vue";
import { toChineseNumber } from "@/utils/index";
import { crmOrderProcView } from "@/api/orderManagement/subOrder";
// 域名
import { BASE_FILE_URL } from "@/store/global-constant";
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance();
const {
  crm_order_type,
  crm_order_status,
  crm_customerbusinesstype,
  crm_Categoryofgoodssoldbycustomers,
  crm_Brandawarenessintheindustry,
  crm_enterprisenature,
} = proxy.useDict(
  "crm_order_type",
  "crm_order_status",
  "crm_customerbusinesstype",
  "crm_Categoryofgoodssoldbycustomers",
  "crm_Brandawarenessintheindustry",
  "crm_enterprisenature"
);
const route = useRoute();
const router = useRouter();
const props = defineProps({
  tabType: {
    type: String,
    default: "",
  },
  contactsList: {
    type: Array,
    default: [],
  },
  invoiceList: {
    type: Array,
    default: [],
  },
  addressList: {
    type: Array,
    default: [],
  },
  baseInfo: {
    type: Object,
    default: null,
  },
  management: {
    type: Object,
    default: null,
  },
  statisticsInfo: {
    type: Object,
    default: null,
  },
  methodList: {
    type: Array,
    default: [],
  },
  lawsuitList: {
    type: Array,
    default: [],
  },
  establishedList: {
    type: Array,
    default: [],
  },
  rankingList: {
    type: Array,
    default: [],
  },
  registeredList: {
    type: Array,
    default: [],
  },
  staffSizeList: {
    type: Array,
    default: [],
  },
  managementSoldTypeList: {
    type: Array,
    default: [],
  },
});
const data = reactive({
  tabList: [],
  total: 0,
  formData: {
    size: 10, //单页显示多少条数据
    current: 1, //当前页数
    customerId: "", //客户id
  },
});

const { tabList, formData, total } = toRefs(data);
function saveTwoBit(num) {
  var result = parseFloat(num);
  result = Math.round(num * 100) / 100;
  return result;
}
/** 复制代码成功 */
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}
/**
 *crm订单流程视图--分页查询订单
 **/
const crmOrderProcViewFn = () => {
  formData.value.customerId = route.query.id;
  crmOrderProcView(formData.value)
    .then((res) => {
      tabList.value = res.data.records;
      total.value = res.data.total;
      // console.log('GET分页查询订单', data.tabList)
    })
    .catch((err) => {
      console.log("报错-----", err);
    });
};
/**
 * 监听对象数据的变化
 */
watch(
  [() => formData.value.size, () => formData.value.current],
  (val, oval) => {
    crmOrderProcViewFn();
  },
  {
    immediate: true,
    deep: true, //开启深度监听,能够侦听到对象属性值的变化
  }
);
/**
 * 查看详情
 **/
const gotoDetail = (item, procType) => {
  router.push(
    `/crm/orderManagement/orderDetail?id=${item.id}&procType=${procType}&customerId=${item.customerId}`
  );
};
</script>

<style scoped>
ul,
li {
  list-style: none;
}

.icons {
  color: #b3b3b3;
  font-size: 17px;
  vertical-align: sub;
  cursor: pointer;
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
  margin-bottom: 16px;
  flex: 0 0 100px;
}

.human {
  background: #f9f9f9;
  width: 400px;
  border: 1px solid #aaa;
  border-radius: 6px;
  margin: 10px;
  padding: 10px;
  padding-bottom: 0;
  position: relative;
}

.human>p {
  display: flex;
  line-break: anywhere;
}

.contactPerson {
  display: flex;
  margin-right: 30px;
  overflow: auto;
}

.invoice {
  flex: 0 0 100px;
}

.laypage {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}

.keyHuman {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 90px;
  height: 30px;
  background: #1890ff;
  line-height: 30px;
  text-align: center;
  color: #fff;
  border-radius: 4px;
}

.hiddenTxt {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

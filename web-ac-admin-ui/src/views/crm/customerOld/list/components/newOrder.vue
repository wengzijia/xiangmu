<template>
  <div class="lookDetail">
    <!-- <el-drawer
			v-model="isTable"
			direction="rtl"
			title="基础信息"
			size="600px"
			@close="cancelClick"
		>
    <template #default> -->
    <div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="150px"
        class="demo-ruleForm"
        size="default"
        status-icon
      >
      <el-form-item label="客户评级">
          <!-- <el-select
            v-model="ruleForm.customerGrading"
            placeholder="请选择客户评级"
            clearable
            filterable
          >
            <el-option
              v-for="emo in crm_Brandawarenessintheindustry"
              :key="emo.id"
              :label="emo.label"
              :value="emo.value"
            />

          </el-select> -->
          {{editdata?.statisticsInfo?.customerGrading||'暂未评级'}}
        </el-form-item>
        <h3>基础信息</h3>
        <el-form-item label="客户名称" required>
          <el-input
            v-model="ruleForm.customerName"
            maxlength="50"
            placeholder="客户名称"
            show-word-limit
            type="text"
          />
        </el-form-item>
        
        <el-form-item label="证照图像：">
          <crmFileUpload
            v-model:modelValue="ruleForm.licenseImageUrl"
            name="立即上传"
            :fileType="['png', 'jpg', 'jpeg','pdf']"
            :fileSize="50"
            :del="true"
            replace
          ></crmFileUpload>
        </el-form-item>
        
        <el-form-item label="企业性质：" required>
          <el-select
            v-model="ruleForm.enterpriseNature"
            placeholder="请选择客户企业性质"
            style="width: 423px"
            clearable
            filterable
            @change="enterchange(ruleForm.enterpriseNature)"
          >
            <el-option
              v-for="emo in crm_enterprisenature"
              :key="emo.id"
              :label="emo.label"
              :value="emo.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="ruleForm.enterpriseNature!=1&&ruleForm.enterpriseNature!=5"  label="统一社会信用代码：" prop="unifiedSocialCreditCode">
          <el-input
            v-model="ruleForm.unifiedSocialCreditCode"
            maxlength="50"
            placeholder="请输入统一社会信用代码"
            show-word-limit
            type="text"
          />
        </el-form-item>

        <el-form-item v-if="ruleForm.enterpriseNature==1" label="客户身份证号码：" prop="customerIdNumber">
          <el-input
            v-model="ruleForm.customerIdNumber"
            maxlength="18"
            placeholder="请输入客户身份证号码"
            show-word-limit
            type="text"
          />
        </el-form-item>

        <el-form-item
          label="客户维护费用额度："
          prop="customerMaintenanceCostLimit"
        >
          <!-- <el-input-number
            class="numinp"
            :controls="false"
            v-model="ruleForm.customerMaintenanceCostLimit"
            @keydown="clearInput"
            placeholder="请输入客户维护费用额度"
            max="999999999999"
          /> -->
            <el-input-number class="numinp" style="width:300px;" placeholder="请输入客户维护费用额度" @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false" v-model="ruleForm.customerMaintenanceCostLimit" />

          <span class="comspan">元</span>
        </el-form-item>

        <h3>风险信息</h3>
        
        <el-form-item label="更多结算方式：" v-if="risklist?.more_settlement_method">
          <el-radio-group v-model="ruleForm.moreSettlementMethodId">
            <template v-for="emo in risklist.more_settlement_method" :key="emo.id">
              <el-radio :label="emo.id" v-if="emo.optionDesc!='立结'">{{emo.optionDesc}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否有诉讼：" required>
          <el-select
            v-model="ruleForm.existLawsuitId"
            placeholder="请选择是否有诉讼"
            style="width: 423px"
            clearable
            filterable
          >
            <el-option
              v-for="emo in risklist?.exist_lawsuit"
              :key="emo.id"
              :label="emo.optionDesc"
              :value="emo.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="成立时长：" required>
          <el-select
            v-model="ruleForm.establishedTimeId"
            placeholder="请选择成立时长"
            style="width: 423px"
            clearable
            filterable
          >
            <el-option
              v-for="emo in risklist?.established_time"
              :key="emo.id"
              :label="emo.optionDesc"
              :value="emo.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="注册资金：" required>
          <el-select
            v-model="ruleForm.registeredCapitalId"
            placeholder="请选择注册资金"
            style="width: 423px"
            clearable
            filterable
          >
            <el-option
              v-for="emo in risklist?.registered_capital"
              :key="emo.id"
              :label="emo.optionDesc"
              :value="emo.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="人员规模：" required>
          <el-select
            v-model="ruleForm.staffSizeId"
            placeholder="请选择人员规模"
            style="width: 423px"
            clearable
            filterable
          >
            <el-option
              v-for="emo in risklist?.staff_size"
              :key="emo.id"
              :label="emo.optionDesc"
              :value="emo.id"
            />
          </el-select>
        </el-form-item>


        <el-form-item label="行业排名：" required>
          <el-select
            v-model="ruleForm.industryRankingId"
            placeholder="请选择行业排名"
            style="width: 423px"
            clearable
            filterable
          >
            <el-option
              v-for="emo in risklist?.industry_ranking"
              :key="emo.id"
              :label="emo.optionDesc"
              :value="emo.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="授信额度：" required>
          <el-input-number class="numinp" style="width:300px;" placeholder="请输入要申请的授信额度" @keydown="userclearInput" :precision="0" :min="0" :max="10000" :controls="false" v-model="ruleForm.customerCreditQuota" />
          <span class="comspan" style="left: 265px;">万元</span>

        </el-form-item>


      </el-form>
      <h3>
        联系人
        <el-button @click="contactsfn(1)" style="float: right"
          >编辑联系人</el-button
        >
      </h3>
      <div
        v-for="item in contacts"
        v-show="item.complete"
        :key="item.name"
        class="contactsbox"
      >
        <!-- v-show="item.complete" -->
        <template v-if="item.complete">
          <el-form-item
            :label="citem.name + '：'"
            v-for="citem in item.con"
            :key="citem.name"
            style="margin-bottom: 0"
          >
          <template v-if="citem.name==='省市区'">
            {{ citem.province||'-' }}
            {{ citem.city }}
            {{ citem.county }}
          </template>
          <template v-else-if="citem.name==='职位'">
            <DictTag
              v-if="citem.value"
              style="display: inline-block;"
              :value="citem.value"
              :options="crm_position"
            />
            <template v-else>
              -
            </template>
          </template>
          <template v-else>
            {{ citem.value||'-' }}
          </template>
          </el-form-item>
        </template>
        <el-tag
        v-if="item.pivotal"
          class="mx-1"
          effect="dark"
          size="large"
        >
          关键联系人
        </el-tag>
      </div>

      <!-- <el-form
        ref="addressFormRef"
        :model="riskForm"
        :rules="rules"
        label-width="150px"
        class="demo-addressForm"
        size="default"
        status-icon
      > -->
        

      <!-- </el-form> -->

      <h3>客户经营信息</h3>
      <el-form
        ref="addressFormRef"
        :model="managementForm"
        :rules="rules2"
        label-width="155px"
        class="demo-addressForm"
        size="default"
        status-icon
      >
        <el-form-item label="客户经营类型：" required>
          <el-select
            v-model="managementForm.customerManagementType"
            placeholder="请选择客户经营类型"
            clearable
            filterable
          >
            <el-option
              v-for="emo in crm_customerbusinesstype"
              :key="emo.id"
              :label="emo.label"
              :value="emo.value"
            />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="客户注册资本：">
          <el-input
            v-model="managementForm.customerRegisteredCapital"
            maxlength="50"
            placeholder="请输入客户注册资本"
            show-word-limit
            type="text"
          />
        </el-form-item> -->

        <el-form-item label="客户销售商品类别：" required>
          <el-select
            v-model="customerSoldType"
            multiple
            placeholder="请选择客户销售商品类别"
          >
            <el-option
              v-for="emo in crm_Categoryofgoodssoldbycustomers"
              :key="emo.id"
              :label="emo.label"
              :value="emo.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品类别其他备注：" v-if="customerSoldType.indexOf('7')>-1">
          <el-input
            v-model="custremark"
            maxlength="50"
            placeholder="请输入商品类别其他备注"
            show-word-limit
            type="text"
          />
        </el-form-item>

        <el-form-item label="客户销售商品品牌：">
          <el-input
            v-model="managementForm.customerSoldBrand"
            maxlength="50"
            placeholder="请输入客户销售商品品牌"
            show-word-limit
            type="text"
          />
        </el-form-item>

        <el-form-item label="上年度销售额：" required>
          <!-- <el-input
            v-model="managementForm.previousYearSalesAmount"
            maxlength="15"
            placeholder="请输入上年度销售额"
            show-word-limit
            @keyup="managementForm.previousYearSalesAmount=managementForm.previousYearSalesAmount.replace(/\D/g,'')"
            type="text"
          /> -->
          <el-input-number class="numinp" style="width:250px;" placeholder="请输入上年度销售额" @keydown="clearInput" :precision="2" :min="0" :max="999999999999.99" :controls="false" v-model="managementForm.previousYearSalesAmount" />

        </el-form-item>

        <el-form-item label="所在行业品牌知名度：">
          <el-select
            v-model="managementForm.industryBrandAwareness"
            placeholder="请选择所在行业品牌知名度"
            clearable
            filterable
          >
            <el-option
              v-for="emo in crm_Brandawarenessintheindustry"
              :key="emo.id"
              :label="emo.label"
              :value="emo.value"
            />
          </el-select>
          <el-tooltip
            class="box-item"
            effect="dark"
            placement="top-end"
          >
            <template #content
              >客户销售商品在行业中的知名度
            </template>
            <el-icon class="icons">
              <WarningFilled />
            </el-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="所在地域品牌知名度：">
          <el-select
            v-model="managementForm.areaBrandAwareness"
            placeholder="请选择所在地域品牌知名度"
            clearable
            filterable
          >
            <el-option
              v-for="emo in crm_Brandawarenessintheindustry"
              :key="emo.id"
              :label="emo.label"
              :value="emo.value"
            />
          </el-select>
          <el-tooltip
            class="box-item"
            effect="dark"
            placement="top-end"
          >
            <template #content
              >客户销售商品在当地知名度
            </template>
            <el-icon class="icons">
              <WarningFilled />
            </el-icon>
          </el-tooltip>
        </el-form-item>
      </el-form>

      <h3>
        开票信息
        <el-button @click="contactsfn(2)" style="float: right"
          >编辑开票信息</el-button
        >
      </h3>
      <div
        v-show="item.complete"
        v-for="item in Invoicing"
        :key="item.name"
        class="contactsbox"
      >
        <template v-if="item.complete">
          <el-form-item
            :label="citem.name + '：'"
            v-for="citem in item.con"
            :key="citem.name"
            style="margin-bottom: 0"
          >
            <template v-if="citem.name==='省市区'">
            {{ citem.province||'-' }}
            {{ citem.city }}
            {{ citem.county }}
          </template>
          <template v-else>
            {{ citem.value||'-' }}
          </template>
          </el-form-item>
        </template>
      </div>

      <h3>
        收货地址
        <el-button @click="contactsfn(3)" style="float: right"
          >编辑收货地址</el-button
        >
      </h3>
      <div
        v-for="item in addressinfo"
        v-show="item.complete"
        :key="item.name"
        class="contactsbox"
      >
        <!-- v-show="item.complete" -->
        <template v-if="item.complete">
          <el-form-item
            :label="citem.name + '：'"
            v-for="citem in item.con"
            :key="citem.name"
            style="margin-bottom: 0"
          >
          <template v-if="citem.name==='省市区'">
            {{ citem.province||'-' }}
            {{ citem.city }}
            {{ citem.county }}
          </template>
          <template v-else>
            {{ citem.value||'-' }}
          </template>
          </el-form-item>
        </template>
      </div>
    </div>
    <!-- </template>
    <template #footer> -->
      <el-form-item>
    <!-- <div style="position: fixed;bottom: 0;background:#fff;width:90%">
      <el-button @click="closedrefn">取消</el-button>
      <el-button type="primary" @click="confirmClick(ruleFormRef)">提交</el-button>
    </div> -->
    </el-form-item>
    <!-- </template> -->
    <!-- </el-drawer> -->
  </div>
  <el-dialog v-model="dialogFormVisible" :title="getTitle(isnum)">
    <div v-for="(item, index) in isinfo" :key="item.name" class="contactsbox">
      <p>
        {{getTitle(isnum)}}{{ index + 1
        }}<Edit
          v-if="item.complete && editstatus"
          style="width: 2em; height: 1.2em; margin-right: 8px; float: right"
          @click="dialogedit(item)"
        />
      </p>
      <el-form-item
        :label="citem.name+ '：'"
        v-for="citem in item.con"
        :key="citem.name"
        label-width="150px"
        :required="citem.req==1?true:false"
      >
        <template v-if="item.edit">

          <template v-if="citem.name==='职位'">
            <el-select
              v-model="citem.value"
              placeholder="请选择职位"
              clearable
              filterable
            >
              <el-option
                v-for="emo in crm_position"
                :key="emo.id"
                :label="emo.label"
                :value="emo.value"
              />
            </el-select>

            <!-- citem.value==20 -->
            <div v-if="citem.value==20" style="width:100%;margin-top:10px;">
              <el-input 
                style="width:214px;" 
                v-model="citem.remark"
                :maxlength="30"
                show-word-limit
                type="text"
                placeholder="请输入职位"
              />
            </div>
          </template>

          <template v-else-if="citem.name==='省市区'">
            <el-select v-model="citem.provinceId" placeholder="请选择" style="width:180px" @change="selectCity(citem,'province')">
              <el-option v-for="(sitem, index) in provinceList" :key="index" :label="sitem" :value="index + ''"> </el-option>
            </el-select>
            <el-select v-model="citem.cityId" placeholder="请选择" style="width:170px;margin-left:10px;" @change="selectCity(citem,'city')">
              <el-option v-for="(sitem, index) in cityList" :key="index" :label="sitem" :value="citem.provinceId + '_' + index"> </el-option>
            </el-select>
            <el-select v-model="citem.countyId" placeholder="请选择" style="width:170px;margin-left:10px;" @change="selectCity(citem,'county')">
              <el-option v-for="(sitem, index) in countyList" :key="index" :label="sitem" :value="citem.cityId + '_' + index"> </el-option>
            </el-select>
          </template>

          <template v-else>
            <el-input
              v-if="citem.name==='联系电话'||citem.name==='收货人电话'"
              v-model="citem.value"
              :maxlength="citem.max"
              show-word-limit
              type="text"
              @keyup="citem.value=citem.value.replace(/\D/g,'')"
              :placeholder="citem.tips"
            />
            <el-input
              v-else
              v-model="citem.value"
              :maxlength="citem.max"
              show-word-limit
              type="text"
              :placeholder="citem.tips"
            />
          </template>
          
        </template>

        <template v-else>
          <template v-if="citem.name==='省市区'">
            {{ citem.province||'-' }}
            {{ citem.city }}
            {{ citem.county }}
          </template>
          <template v-else-if="citem.name==='职位'">
            <DictTag
              v-if="citem.value"
              style="display: inline-block;"
              :value="citem.value"
              :options="crm_position"
            />
            <span v-else>
              -
            </span>
          </template>
          <template v-else>
            {{ citem.value||'-' }}
          </template>
        </template>

      </el-form-item>
      <p v-if="item.pivotal!==undefined">
        <el-checkbox style="margin-left:100px;" v-if="item.edit" v-model="item.pivotal" @change="cruxchange(index)" label="设为关键联系人" size="large" />
        <el-tag
          v-else-if="!item.edit&&item.pivotal"
          class="mx-1"
          effect="dark"
          size="large"
        >
          关键联系人
        </el-tag>
      </p>

      <div class="dialog-footer" v-if="item.edit">
        <el-button @click="submitcons(1, item)">取消</el-button>
        <el-button type="primary" @click="submitcons(2, item)">
          确定
        </el-button>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="addcons"> 新建{{getTitle(isnum)}} </el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
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
import { validateForms, checkPhone, debounce } from "@/utils/form";
import { onMounted, onUnmounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { AddCustomer, GetCustomer,SetCustomer,gradingCalculateConfig } from "@/api/orderManagement/customer/index";
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue";
import { getProvince, getCity, getAreaId, getAreaName } from '@/utils/city';
const { proxy } = getCurrentInstance();
const {
  crm_enterprisenature,
  crm_customerbusinesstype,
  crm_Categoryofgoodssoldbycustomers,
  crm_Brandawarenessintheindustry,
  crm_payment_type,
  crm_position
} = proxy.useDict(
  "crm_enterprisenature",
  "crm_customerbusinesstype",
  "crm_Categoryofgoodssoldbycustomers",
  "crm_Brandawarenessintheindustry",
  "crm_payment_type",
  "crm_position"
);
const props = defineProps({
  editdata: {
    type: Object,
    default: null,
  },
  dranum:{
    type:Number,
    default:1
  },
  closedre:{
    type:Function
  }
  // isRoles: {
  // 	type: Boolean,
  // 	default: false,
  // },
});
// 接收父组件传来的方法
const emits = defineEmits(["crmOrderProcView","closedre"]);
const ruleFormRef = ref();
const addressFormRef = ref();
let isTable = ref(true);
let dialogFormVisible = ref(false);
let editstatus = ref(true);
let isnum = ref(1);
let isinfo = ref([]);
let contacts = ref([
  {
    edit: true,
    complete: false,
    pivotal:false,
    con: [
      { name: "联系人", value: "", tips: "请输入联系人名称", max: 50,req:1 },
      { name: "联系电话", value: "", tips: "请输入联系电话", max: 11,req:1 },
      { name: "省市区", value: "" ,province:"", city:"", county:"", provinceId: "", cityId: "", countyId: "", tips: "请输入联系地址", max: 50,req:0 },
      { name: "详细地址", value: "", tips: "请输入联系地址", max: 50,req:0 },
      { name: "联系邮编", value: "", tips: "请输入联系人联系地址邮编", max: 50,req:0 },
      { name: "职位", value: "", tips: "请选择职位", max: 50,req:0,remark:"" },
      // { name: "关键", value: false, tips: "请选择职位", max: 50 }
    ],
  },
]);
let Invoicing = ref([
  {
    edit: true,
    complete: false,
    con: [
      { name: "开票单位名称", value: "", tips: "请输入开票单位名称", max: 50,req:1 },
      { name: "纳税人识别号", value: "", tips: "请输入纳税人识别号", max: 20,req:0 },
      { name: "邮箱", value: "", tips: "请输入开票邮箱", max: 50,req:0 },
      { name: "注册地址", value: "", tips: "请输入开票单位注册地址", max: 50,req:0 },
      { name: "联系电话", value: "", tips: "请输入开票单位联系电话", max: 11,req:0 },
      { name: "开户银行", value: "", tips: "请输入开票单位对公账户开户银行", max: 50,req:0 },
      { name: "开户账号", value: "", tips: "请输入开票单位对公银行账号", max: 50,req:0 },
      { name: "发票收货人", value: "", tips: "请输入发票收货人", max: 50,req:1 },
      { name: "收货人电话", value: "", tips: "请输入收货人电话", max: 11,req:1 },
      { name: "省市区", value: "", province:"", city:"", county:"",  provinceId: "", cityId: "", countyId: "", tips: "请输入联系地址", max: 50,req:0 },
      { name: "发票收货详细地址", value: "", tips: "请输入发票收货人详细地址", max: 50,req:0 },
    ],
  },
]);
let addressinfo = ref([
  {
    edit: true,
    complete: false,
    con: [
      { name: "联系人", value: "", tips: "请输入联系人名称", max: 50,req:1 },
      { name: "联系电话", value: "", tips: "请输入联系电话", max: 11,req:1 },
      { name: "省市区", value: "", province:"", city:"", county:"",  provinceId: "", cityId: "", countyId: "", tips: "请输入联系地址", max: 50,req:0 },
      { name: "收货详细地址", value: "", tips: "请输入收货地址", max: 50,req:0 },
    ],
  },
]);


const ruleForm = ref({
  // customerGrading:"", //客户评级
  customerName: "", //客户名称
  licenseImageUrl: "", //证照图像
  unifiedSocialCreditCode: "", //统一社会信用代码
  customerIdNumber: "", //客户身份证号码
  enterpriseNature: "", //企业性质
  customerMaintenanceCostLimit: null, //维护费用
  moreSettlementMethodId: "", //结算方式
  existLawsuitId:"",//诉讼ID
  establishedTimeId:"",//成立时间ID
  registeredCapitalId:"",//注册资金ID
  staffSizeId:"",//人员规模ID
  industryRankingId:"",//行业排名ID
  customerCreditQuota:null //授信额度
});

const managementForm = ref({
  customerManagementType: "", //客户经营类型
  // customerRegisteredCapital: "", //客户注册资本
  customerSoldBrand: "", //客户销售商品品牌
  industryBrandAwareness: "", //所在行业品牌知名度
  areaBrandAwareness: "", //所在地域品牌知名度
  previousYearSalesAmount:null, //上年度销售额
});

let customerSoldType=ref([]) //客户销售商品类别集合

const custremark=ref('')

const validatePhone = (value) => {
  if (value === "") {
    return false
  } else {
    // console.log('22222222---',value);
    if (checkPhone(value + "")) {
      return false
    } else {
      return false
    }
  }
  return true
};

const rules = reactive({
  req: [
    {
      required: true,
      message: '请输入',
      trigger: "change",
    },
  ],
 
  // quantity: [
  //   {
  //     required: true,
  //     // message: '请输入打样数量',
  //     validator: validateNumber,
  //     trigger: "blur",
  //   },
  //   { type: "number", message: "请输入数字" },
  // ],
  
});

const rules2 = reactive({
  customerManagementType: [
    {
      required: true,
    },
  ],
  
});

const provinceList=ref([])
const cityList=ref([])
const countyList=ref([])
const risklist=ref(null)
// const { crmInvoiceConfigList } = toRefs(ruleForm)


const selectCity = (item,type) =>{
  console.log('item',item);
  if (type === 'province') {
    item.cityId=item.countyId=''
    cityList.value=getCity(item.provinceId)
    countyList.value=[]
  } else if (type === 'city') {
    item.countyId=''
    countyList.value=getCity(item.cityId)
  }
};
const reqfn = () =>{
  let rform=ruleForm.value
  // if(!rform.customerGrading){
  //   ElMessage('请输入客户评级')
  //   return false
  // }
  if(!rform.customerName){
    ElMessage('请输入客户名称')
    return false
  }
  if(!rform.enterpriseNature){
    ElMessage('请选择企业性质')
    return false
  }
  if(!rform.existLawsuitId){
    ElMessage('请选择是否有诉讼')
    return false
  }
  if(!rform.establishedTimeId){
    ElMessage('请选择成立时长')
    return false
  }
  if(!rform.registeredCapitalId){
    ElMessage('请选择注册资金')
    return false
  }
  if(!rform.staffSizeId){
    ElMessage('请选择人员规模')
    return false
  }
  if(!rform.industryRankingId){
    ElMessage('请选择行业排名')
    return false
  }
  if(!rform.customerCreditQuota){
    ElMessage('请输入授信额度')
    return false
  }
  if(!managementForm.value.customerManagementType){
    ElMessage('请选择客户经营类型')
    return false
  }
  if(!customerSoldType.value.length){
    ElMessage('请选择客户销售商品类别')
    return false
  }
  if(!managementForm.value.previousYearSalesAmount){
    ElMessage('请输入上年度销售额')
    return false
  }
  return true
}
const userclearInput = (e) => {
  let key = e.key;
  if (key === "e" || key === "E" || key === "+" || key === "-"|| key === ".") {
    e.returnValue = false;
    return false;
  }
  return true;
}
const setdata = () =>{
  if (props.editdata) {
    console.log("editdata", props.editdata);
    if(props.editdata.baseInfo?.customerCreditQuota){
      props.editdata.baseInfo.customerCreditQuota=Number(props.editdata.baseInfo.customerCreditQuota)/10000
    }
    ruleForm.value = props.editdata.baseInfo;
    managementForm.value = props.editdata.management;
    if (props.editdata.managementSoldTypeList.length) {
      customerSoldType.value =
        props.editdata.managementSoldTypeList.map((e) => {
          if(e.customerSoldType==7){
            custremark.value=e.remark
          }
          return e.customerSoldType;
        });
    }
    if (props.editdata.contactsList.length) {
      console.log("props.editdata.contactsList", props.editdata.contactsList);
      contacts.value = props.editdata.contactsList.map((e) => {
        let p=''
        let c=''
        let co=''
        if(e.province){
          p=getAreaId('province', e.province)
        }
        if(e.city){
          c=getAreaId('city', e.city, p)
          cityList.value = getCity(p);
        }
        if(e.district){
          co=getAreaId('county', e.district, c)
          countyList.value = getCity(c);
        }
        let arr = {
          edit: false,
          complete: true,
          pivotal:e.pivotal,
          con: [
            {
              name: "联系人",
              value: e.contactsName,
              tips: "请输入联系人名称",
              max: 50,
              req:1
            },
            {
              name: "联系电话",
              value: e.contactsPhone,
              tips: "请输入联系电话",
              max: 11,
              req:1
            },
            { name: "省市区", value: "", province:e.province, city:e.city, county:e.district, provinceId: p, cityId: c, countyId: co, tips: "请输入联系地址", max: 50,req:0 },
            {
              name: "详细地址",
              value: e.contactsAddress,
              tips: "请输入联系地址",
              max: 50,
              req:0
            },
            {
              name: "联系邮编",
              value: e.contactsPostcode,
              tips: "请输入联系人联系地址邮编",
              max: 50,
              req:0
            },
            { name: "职位", value: e.positionName, tips: "请选择职位", max: 50,req:0,remark:"" },
            // { name: "关键", value: e.pivotal, tips: "请选择职位", max: 50 }
          ],
        };
        return arr;
      });
    }

    if (props.editdata.invoiceList.length) {
      console.log("props.editdata.contactsList", props.editdata.invoiceList);
      Invoicing.value = props.editdata.invoiceList.map((e) => {
        let p=''
        let c=''
        let co=''
        console.log('222',e.province);
        if(e.province){
          p=getAreaId('province', e.province)
          if(e.city){
            c=getAreaId('city', e.city, p)
            cityList.value = getCity(p);
            if(e.district){
              co=getAreaId('county', e.district, c)
              countyList.value = getCity(c);
            }
          }
        }
        
        let arr = {
          edit: false,
          complete: true,
          con: [
            { name: "开票单位名称", value: e.invoiceCompanyName, tips: "请输入开票单位名称", max: 50,req:1 },
            { name: "纳税人识别号", value: e.taxpayerRegistrationNumber, tips: "请输入纳税人识别号", max: 20,req:0 },
            { name: "邮箱", value: e.invoiceEmail, tips: "请输入开票邮箱", max: 50,req:0 },
            { name: "注册地址", value: e.invoiceRegisteredAddress, tips: "请输入开票单位注册地址", max: 50,req:0 },
            { name: "联系电话", value: e.invoicePhone, tips: "请输入开票单位联系电话", max: 11,req:0 },
            { name: "开户银行", value: e.invoiceDepositBank, tips: "请输入开票单位对公账户开户银行", max: 50,req:0 },
            { name: "开户账号", value: e.invoiceBankAccount, tips: "请输入开票单位对公银行账号", max: 50,req:0 },
            { name: "发票收货人", value: e.invoiceConsigneeName, tips: "请输入发票收货人", max: 50,req:1 },
            { name: "收货人电话", value: e.invoiceConsigneePhone, tips: "请输入收货人电话", max: 11,req:1 },
            { name: "省市区", value: "", province:e.province, city:e.city, county:e.district, provinceId: p, cityId: c, countyId: co, tips: "请输入联系地址", max: 50,req:0 },
            { name: "发票收货详细地址", value: e.invoiceConsigneeAddress, tips: "请输入发票收货人详细地址", max: 50,req:0 },
          ],
        };
        return arr;
      });
    }

    if (props.editdata.addressList.length) {
      console.log("props.editdata.contactsList", props.editdata.addressList);
      addressinfo.value = props.editdata.addressList.map((e) => {
        let p=''
        let c=''
        let co=''
        if(e.province){
          p=getAreaId('province', e.province)
        }
        if(e.city){
          c=getAreaId('city', e.city, p)
          cityList.value = getCity(p);
        }
        if(e.district){
          co=getAreaId('county', e.district, c)
          countyList.value = getCity(c);
        }
        let arr = {
          edit: false,
          complete: true,
          con: [
            { name: "联系人", value: e.consigneeName, tips: "请输入联系人名称", max: 50,req:1 },
            { name: "联系电话", value: e.consigneePhone, tips: "请输入联系电话", max: 11,req:1 },
            { name: "省市区", value: "", province:e.province, city:e.city, county:e.district, provinceId: p, cityId: c, countyId: co, tips: "请输入联系地址", max: 50,req:0 },
            { name: "详细地址", value: e.consigneeAddress, tips: "请输入收货地址", max: 50,req:0 },
          ],
        };
        return arr;
      });
    }
    
  }
}
const cruxchange = (index) =>{
  isinfo.value.forEach((e,i)=>{
    if(i!=index){
      e.pivotal=false
    }
  })
}
const initdata = () => {
  ruleForm.value = {
    // customerGrading:"", //客户评级
    customerName: "", //客户名称
    licenseImageUrl: "", //证照图像
    unifiedSocialCreditCode: "", //统一社会信用代码
    customerIdNumber: "", //客户身份证号码
    enterpriseNature: "", //企业性质
    customerMaintenanceCostLimit: null, //维护费用
    moreSettlementMethodId: "", //结算方式
    existLawsuitId:"",//诉讼ID
    establishedTimeId:"",//成立时间ID
    registeredCapitalId:"",//注册资金ID
    staffSizeId:"",//人员规模ID
    industryRankingId:"",//行业排名ID
    customerCreditQuota:null //授信额度
  };

  managementForm.value = {
    customerManagementType: "", //客户经营类型
    // customerRegisteredCapital: "", //客户注册资本
    customerSoldBrand: "", //客户销售商品品牌
    industryBrandAwareness: "", //所在行业品牌知名度
    areaBrandAwareness: "", //所在地域品牌知名度
    previousYearSalesAmount:null, //上年度销售额
  };
  customerSoldType.value = []

  contacts.value = [
    {
      edit: true,
      complete: false,
      pivotal:false,
      con: [
        { name: "联系人", value: "", tips: "请输入联系人名称", max: 50,req:1 },
        { name: "联系电话", value: "", tips: "请输入联系电话", max: 11,req:1 },
        { name: "省市区", value: "", province:"", city:"", county:"", provinceId: "", cityId: "", countyId: "", tips: "请输入联系地址", max: 50,req:0 },
        { name: "详细地址", value: "", tips: "请输入联系地址", max: 50,req:0 },
        { name: "联系邮编", value: "", tips: "请输入联系人联系地址邮编", max: 50,req:0 },
        { name: "职位", value: "", tips: "请选择职位", max: 50,req:0,remark:"" },
        // { name: "关键", value: false, tips: "请选择职位", max: 50 }
      ],
    },
  ]

  Invoicing.value=[
    {
      edit: true,
      complete: false,
      con: [
        { name: "开票单位名称", value: "", tips: "请输入开票单位名称", max: 50,req:1 },
        { name: "纳税人识别号", value: "", tips: "请输入纳税人识别号", max: 20,req:0 },
        { name: "邮箱", value: "", tips: "请输入开票邮箱", max: 50,req:0 },
        { name: "注册地址", value: "", tips: "请输入开票单位注册地址", max: 50,req:0 },
        { name: "联系电话", value: "", tips: "请输入开票单位联系电话", max: 11,req:0 },
        { name: "开户银行", value: "", tips: "请输入开票单位对公账户开户银行", max: 50,req:0 },
        { name: "开户账号", value: "", tips: "请输入开票单位对公银行账号", max: 50,req:0 },
        { name: "发票收货人", value: "", tips: "请输入发票收货人", max: 50,req:1 },
        { name: "收货人电话", value: "", tips: "请输入收货人电话", max: 11,req:1 },
        { name: "省市区", value: "", province:"", city:"", county:"", provinceId: "", cityId: "", countyId: "", tips: "请输入联系地址", max: 50,req:0 },
        { name: "发票收货详细地址", value: "", tips: "请输入发票收货人详细地址", max: 50,req:0 },
      ],
    },
  ];
  
  addressinfo.value =[
    {
      edit: true,
      complete: false,
      con: [
        { name: "联系人", value: "", tips: "请输入联系人名称", max: 50,req:1 },
        { name: "联系电话", value: "", tips: "请输入联系电话", max: 11,req:1 },
        { name: "省市区", value: "", province:"", city:"", county:"", provinceId: "", cityId: "", countyId: "", tips: "请输入联系地址", max: 50,req:0 },
        { name: "详细地址", value: "", tips: "请输入收货地址", max: 50,req:0 },
      ],
    },
  ]
     
};
const getTitle = (val) =>{
  let name=''
  if(val==1){
    name="联系人"
  }else if(val==2){
    name="开票信息"
  }else{
    name="收货地址"
  }
  return name
}
const enterchange = (num) =>{
  if(num==5){
    ruleForm.value.unifiedSocialCreditCode = "" 
    ruleForm.value.customerIdNumber = ""
  }
  
}
const submitcons = (is, item) => {
  // console.log('item',item);
  // console.log('info',isinfo.value);
  if(is==1&&!item.complete&&isinfo.value.length>1){
    isinfo.value=isinfo.value.slice(0, -1)
  }
  if(is==1&&!item.complete){
      return
  }
  let leng = true;
  // item.con.forEach((e) => {
  //   if (e.name==='省市区') {
  //     e.province = getAreaName('province', e.provinceId);
  //     e.city = getAreaName('city', e.cityId);
  //     e.county = getAreaName('county', e.countyId);
  //   }
  //   console.log(e);
  // });

  for(let i=0;i<item.con.length;i++){
    let e=item.con[i];
    if (e.req==1&&!e.value) {
      leng = false;
      ElMessage({
        message: e.tips,
        type: "error",
      });
      break
    }
    if (e.name==='省市区'&&e.provinceId&&e.cityId&&e.countyId) {
      e.province = getAreaName('province', e.provinceId);
      e.city = getAreaName('city', e.cityId);
      e.county = getAreaName('county', e.countyId);
    }
    
  }

  if (leng) {
    item.edit = false;
    item.complete = true;
  } else {
    return;
  }
  if (is === 1) {
    console.log(is);
    if (isnum.value == 1) {
      isinfo.value = JSON.parse(JSON.stringify(contacts.value));
    } else if (isnum.value == 2) {
      isinfo.value = JSON.parse(JSON.stringify(Invoicing.value));
    } else {
      isinfo.value = JSON.parse(JSON.stringify(addressinfo.value));
    }

  } else {
    if (isnum.value == 1) {
      let fnum=isinfo.value.findIndex(e=>{
        return e.pivotal
      })
      console.log("length", isinfo.value.length);
      console.log('fnum',fnum);
      if(isinfo.value.length>1&&fnum>0){
        let arr=JSON.parse(JSON.stringify(isinfo.value))
        arr[0] = arr.splice(fnum, 1, arr[0])[0]
        contacts.value=arr
      }else{
        contacts.value = JSON.parse(JSON.stringify(isinfo.value));
      }

      
    } else if (isnum.value == 2) {
      Invoicing.value = JSON.parse(JSON.stringify(isinfo.value));
    } else {
      addressinfo.value = JSON.parse(JSON.stringify(isinfo.value));
    }
    console.log("contacts", contacts.value);
  }

  editstatus.value = true;
  console.log("item", leng);
};
const addcons = () => {
  if (!isinfo.value[isinfo.value.length - 1].complete) return;
  if (isnum.value == 1) {
    isinfo.value.push({
      edit: true,
      complete: false,
      pivotal:false,
      con: [
        { name: "联系人", value: "", tips: "请输入联系人名称", max: 50,req:1 },
        { name: "联系电话", value: "", tips: "请输入联系电话", max: 11,req:1 },
        { name: "省市区", value: "", province:"", city:"", county:"", provinceId: "", cityId: "", countyId: "", tips: "请输入联系地址", max: 50,req:0 },
        { name: "详细地址", value: "", tips: "请输入联系地址", max: 50,req:0 },
        { name: "联系邮编", value: "", tips: "请输入联系人联系地址邮编", max: 50,req:0 },
        { name: "职位", value: "", tips: "请选择职位", max: 50,req:0,remark:"" },
      ],
    });
  } else if (isnum.value == 2) {
    isinfo.value.push({
      edit: true,
      complete: false,
      con: [
        { name: "开票单位名称", value: "", tips: "请输入开票单位名称", max: 50,req:1 },
        { name: "纳税人识别号", value: "", tips: "请输入纳税人识别号", max: 20,req:0 },
        { name: "邮箱", value: "", tips: "请输入开票邮箱", max: 50,req:0 },
        { name: "注册地址", value: "", tips: "请输入开票单位注册地址", max: 50,req:0 },
        { name: "联系电话", value: "", tips: "请输入开票单位联系电话", max: 11,req:0 },
        { name: "开户银行", value: "", tips: "请输入开票单位对公账户开户银行", max: 50,req:0 },
        { name: "开户账号", value: "", tips: "请输入开票单位对公银行账号", max: 50,req:0 },
        { name: "发票收货人", value: "", tips: "请输入发票收货人", max: 50,req:1 },
        { name: "收货人电话", value: "", tips: "请输入收货人电话", max: 11,req:1 },
        { name: "省市区", value: "", province:"", city:"", county:"", provinceId: "", cityId: "", countyId: "", tips: "请输入联系地址", max: 50,req:0 },
        {
          name: "发票收货详细地址",
          value: "",
          tips: "请输入发票收货人详细地址",
          max: 50,
        },
      ],
    });
  } else {
    isinfo.value.push({
      edit: true,
      complete: false,
      con: [
        { name: "联系人", value: "", tips: "请输入联系人名称", max: 50,req:1 },
        { name: "联系电话", value: "", tips: "请输入联系电话", max: 11,req:1 },
        { name: "省市区", value: "", province:"", city:"", county:"", provinceId: "", cityId: "", countyId: "", tips: "请输入联系地址", max: 50,req:0 },
        { name: "详细地址", value: "", tips: "请输入收货地址", max: 50,req:0 },
      ],
    });
  }
};
// const getSalesman = (nickName, userId, type) => {
//   if (type == 1) {
//     ruleForm.businessStaffId = userId;
//     ruleForm.businessStaffName = nickName;
//   } else {
//     riskForm.businessStaffId = userId;
//     riskForm.businessStaffName = nickName;
//   }
// };
// 分页查询客户基础信息的传参
const baseParms = reactive({
  size: 4,
  current: 1,
});
// const isMounted = ref(false);
// let timer = null;
onMounted(() => {
  // console.log('11111111111');
  // timer = setTimeout(() => {
  //   console.log(7898789789);
  //   isMounted.value = true;
  // }, 3500);
  gradingCalculateConfig().then(res=>{
    risklist.value=res.data
  })
  provinceList.value = getProvince();
});
onUnmounted(() => {
  // clearTimeout(timer);
});
// 选择客户信息滚动底部时调用接口
// const load = debounce(() => {
// 	// console.log('load---')
// 	baseParms.current += 1
// 	customerBaseInfoFn()
// }, 300)

function load() {
  baseParms.current += 1;
  customerBaseInfoFn();
}
const closedrefn = ()=>{
  emits("closedre",1);
}




const contactsfn = (is) => {
  dialogFormVisible.value = true;
  isnum.value = is;
  if (is === 1) {
    isinfo.value = JSON.parse(JSON.stringify(contacts.value));
  } else if (is === 2) {
    isinfo.value = JSON.parse(JSON.stringify(Invoicing.value));
  } else {
    isinfo.value = JSON.parse(JSON.stringify(addressinfo.value));
  }
  editstatus.value = true;
};



const dialogedit = (item) => {
  item.edit = true;
  editstatus.value = false;
  console.log("2", item.con);
  item.con.forEach(e=>{
    if(e.name==='省市区'){
      let p=e.provinceId
      let ci=e.cityId
      let co=e.countyId
      console.log(p);
      console.log(ci);
      console.log(co);
        if(p!=""&&p!=null&&p!=undefined){
          cityList.value=getCity(p)
          countyList.value=[]
        }
        if(ci!=""&&ci!=null&&ci!=undefined){
          countyList.value=getCity(ci)
        }
        // if(co!=""&&co!=null&&co!=undefined){
        //   selectCity(e,'county')
        // }
    }
  })
};


// 取消按钮
const cancelClick = () => {
  // ruleFormRef.value.resetFields();
  // addressFormRef.value.resetFields();


  // console.log("addressFormRef--",addressForm);
};
// 生成订单按钮
const confirmClick = () => {
  if(reqfn()){
    ElMessageBox.confirm(
    "确定提交审核吗？",
    '提交后需审核通过后才生效。',
    )
    .then(() => {
      submitForm();
    })
    .catch(() => {
      // catch error
    });
  }
  
};
const demofn = ()=>{
  console.log('ohh');
}
const submitForm = debounce(async () => {
  // let formRefs = [ruleFormRef.value, addressFormRef.value];
  let baseInfo =  JSON.parse(JSON.stringify(ruleForm.value));
  baseInfo.customerCreditQuota=Number(baseInfo.customerCreditQuota)*10000
  // console.log("contactsList2", baseInfo);
  
  // return
  let management = managementForm.value
  let soldTypeList = customerSoldType.value.map((e, i) => {
    let arr = {
      customerSoldType: e,
      remark:e==7?custremark.value:'',
      sortIndex: i,
    };
    return arr;
  });
  let contactsLists = contacts.value.filter((e) => {
    return e.complete;
  });
  // console.log('contactsList',contactsLists);
  let contactsList = contactsLists.map((e, i) => {
    let arr = {
      contactsName: e.con[0].value,
      contactsPhone: e.con[1].value,
      province:e.con[2].province,
      city:e.con[2].city,
      district:e.con[2].county,
      contactsAddress: e.con[3].value,
      contactsPostcode: e.con[4].value,
      positionName: e.con[5].value,
      pivotal: e.pivotal,
      sortIndex: i,
    };
    return arr;
  });

  let invoiceLists = Invoicing.value.filter((e) => {
    return e.complete;
  });
  let invoiceList = invoiceLists.map((e, i) => {
    let arr = {
      invoiceCompanyName: e.con[0].value,
			taxpayerRegistrationNumber: e.con[1].value,
			invoiceEmail: e.con[2].value,
			invoiceRegisteredAddress: e.con[3].value,
			invoicePhone: e.con[4].value,
			invoiceDepositBank: e.con[5].value,
			invoiceBankAccount: e.con[6].value,
			invoiceConsigneeName: e.con[7].value,
			invoiceConsigneePhone: e.con[8].value,
			province: e.con[9].province,
			city: e.con[9].city,
			district: e.con[9].county,
			invoiceConsigneeAddress: e.con[10].value,
      sortIndex: i,
    };
    return arr;
  });

  let addressLists = addressinfo.value.filter((e) => {
    return e.complete;
  });
  let addressList = addressLists.map((e, i) => {
    let arr = {
      consigneeName: e.con[0].value,
      consigneePhone: e.con[1].value,
      province:e.con[2].province,
      city:e.con[2].city,
      district:e.con[2].county,
      consigneeAddress: e.con[3].value,
      sortIndex: i,
    };
    return arr;
  });

  if(props.dranum===1){
    console.log('111',baseInfo);
    console.log('222',management);
    console.log('333',soldTypeList);
    console.log('444',contactsList);
    console.log('555',invoiceList);
    console.log('666',addressList);
    AddCustomer({
    baseInfo,
    management,
    soldTypeList,
    contactsList,
    invoiceList,
    addressList
  })
    .then((res) => {
      if(res.code===200){
        ElMessage({
          message: "成功",
          type: "success",
        });
        emits("closedre",2);
      }
      // else{
      //   ElMessage({
      //     message: "失败",
      //     type: "error",
      //   });
      // }
      console.log(res);
    })
    .catch((err) => {
      // ElMessage({
      //   message: "请求失败",
      //   type: "error",
      // });
    });
  }else{
    SetCustomer({
    baseInfo,
    id: props.editdata.id,
    management,
    soldTypeList,
    contactsList,
    invoiceList,
    addressList
  })
    .then((res) => {
      if(res.code===200){
        ElMessage({
          message: "成功",
          type: "success",
        });
        emits("closedre",2);
      }
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  }
  
}, 100);



defineExpose({
	setdata,
	initdata,
  closedrefn,
  confirmClick
})

</script>

<style lang="scss" scoped>
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
.contactsbox {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 20px;
  .dialog-footer {
    text-align: right;
  }
}
.numinp :deep(.el-input__inner) {
    text-align: left !important;
}
.numinp{
  width: 300px;
  position: relative;
}
.comspan{
  position: absolute;
  left: 280px;
}
</style>

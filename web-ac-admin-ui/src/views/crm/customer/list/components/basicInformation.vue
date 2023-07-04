<template>
  <el-scrollbar :style="'min-height: 364px;height:' + (scroll ? '66vh;' : '100%')">
    <div style="display: flex;justify-content: space-between;align-items: center;">
      <h3>基本信息</h3>
      <el-button style="margin-right: 20px;" v-if="applyId" type="primary" @click="exportExcel(applyId)">导出客户风险信息表</el-button>
    </div>
    <div class="customer-form" style="border-top: 1px solid #dcdfe6">
      <div class="customer-label">客户分类</div>
      <div class="customer-item">
        <!-- <el-input v-if="edit" v-model="customerForm.baseInfo.customerClassify" maxlength="50" placeholder="请选择客户分类" show-word-limit
                    type="text" style="width: 364px;margin-right: 10px;" /> -->
        <DictText :value="customerForm.baseInfo.customerClassify" dict="crm_custom_type"></DictText>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">客户名称</div>
      <div class="customer-item">
        <!-- <el-input v-if="edit" v-model="customerForm.baseInfo.customerName" maxlength="50" placeholder="请填写客户公司全称或客户姓名" show-word-limit
                    type="text" style="width: 364px;margin-right: 10px;" /> -->
        <span>{{ customerForm.baseInfo.customerName }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form" v-if="customerForm.baseInfo?.unifiedSocialCreditCode">
      <div class="customer-label">统一社会信用代码</div>
      <div class="customer-item">
        <!-- <el-input v-if="edit" v-model="customerForm.baseInfo.unifiedSocialCreditCode" maxlength="30" placeholder="请填写客户公司统一社会信用代码" show-word-limit
                    type="text" style="width: 364px;margin-right: 10px;" /> -->
        <span>{{ customerForm.baseInfo.unifiedSocialCreditCode }}</span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.unifiedSocialCreditCodeFileRichText
          " disabled></ImageUpload>
      </div>
    </div>
    <div class="customer-form" v-if="customerForm.baseInfo?.customerIdNumber">
      <div class="customer-label">客户身份证号码</div>
      <div class="customer-item">
        <!-- <el-input v-if="edit" v-model="customerForm.baseInfo.customerIdNumber" maxlength="18" placeholder="请填写客户身份证号码" show-word-limit
                    type="text" style="width: 364px;margin-right: 10px;" /> -->
        <span>{{ customerForm.baseInfo.customerIdNumber }}</span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.customerIdNumberFileRichText
          " disabled></ImageUpload>
      </div>
    </div>
    <div class="customer-form" v-if="customerForm.baseInfo.customerClassify == '1'">
      <div class="customer-label">统一社会信用代码证件有效期</div>
      <div class="customer-item">
        <dateTimePicker v-if="edit" :dateType="'daterange'" :isThreeMonths="false" v-model:startTime="customerForm.baseInfo.unifiedSocialCreditCodeValidStartDate
          " v-model:endTime="customerForm.baseInfo.unifiedSocialCreditCodeValidEndDate
    "></dateTimePicker>
        <span v-else :class="isRedKey?.unifiedSocialCreditCodeValidStartDate ||
          isRedKey?.unifiedSocialCreditCodeValidEndDate
          ? 'red'
          : ''
          ">
          <span v-show="customerForm.baseInfo.unifiedSocialCreditCodeValidStartDate &&
            customerForm.baseInfo.unifiedSocialCreditCodeValidEndDate
            ">
            {{
              customerForm.baseInfo.unifiedSocialCreditCodeValidStartDate +
              "——" +
              customerForm.baseInfo.unifiedSocialCreditCodeValidEndDate
            }}
          </span>
        </span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form" v-if="customerForm.baseInfo.customerClassify == '2'">
      <div class="customer-label">客户身份证号码有效期</div>
      <div class="customer-item">
        <dateTimePicker v-if="edit" :dateType="'daterange'" :isThreeMonths="false" v-model:startTime="customerForm.baseInfo.customerIdNumberValidStartDate
          " v-model:endTime="customerForm.baseInfo.customerIdNumberValidEndDate"></dateTimePicker>
        <span v-else :class="isRedKey?.customerIdNumberValidStartDate ||
          isRedKey?.customerIdNumberValidEndDate
          ? 'red'
          : ''
          ">
          <span v-show="customerForm.baseInfo.customerIdNumberValidStartDate &&
            customerForm.baseInfo.customerIdNumberValidEndDate
            ">
            {{
              customerForm.baseInfo.customerIdNumberValidStartDate +
              "——" +
              customerForm.baseInfo.customerIdNumberValidEndDate
            }}
          </span>
        </span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">法人名称</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.baseInfo.legalPersonName" maxlength="10" placeholder="请填写客户公司法人姓名"
          show-word-limit type="text" style="width: 364px; margin-right: 10px" />
        <span v-else :class="isRedKey?.legalPersonName ? 'red' : ''">{{
          customerForm.baseInfo.legalPersonName
        }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">法人证件号码</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.baseInfo.legalPersonIdNumber" maxlength="18"
          placeholder="请填写客户公司法人身份证号码" show-word-limit type="text" style="width: 364px; margin-right: 10px" />
        <span v-else :class="isRedKey?.legalPersonIdNumber ? 'red' : ''">{{
          customerForm.baseInfo.legalPersonIdNumber
        }}</span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.legalPersonIdNumberFileRichText
            " :disabled="!edit">
        </ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">法人证件号码有效期</div>
      <div class="customer-item">
        <dateTimePicker v-if="edit" :dateType="'daterange'" :isThreeMonths="false" v-model:startTime="customerForm.baseInfo.legalPersonIdNumberValidStartDate
          " v-model:endTime="customerForm.baseInfo.legalPersonIdNumberValidEndDate
    "></dateTimePicker>
        <span v-else :class="isRedKey?.legalPersonIdNumberValidStartDate ||
          isRedKey?.legalPersonIdNumberValidEndDate
          ? 'red'
          : ''
          ">
          <span v-show="customerForm.baseInfo.legalPersonIdNumberValidStartDate &&
            customerForm.baseInfo.legalPersonIdNumberValidEndDate
            ">
            {{
              customerForm.baseInfo.legalPersonIdNumberValidStartDate +
              "——" +
              customerForm.baseInfo.legalPersonIdNumberValidEndDate
            }}
          </span>
        </span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">客户详细地址</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.baseInfo.customerAddress" maxlength="100" placeholder="请填写客户公司的详细地址"
          show-word-limit type="textarea" style="width: 364px; " />
        <span v-else :class="isRedKey?.customerAddress ? 'red' : ''">{{
          customerForm.baseInfo.customerAddress
        }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <h3>经营信息</h3>
    <div class="customer-form" style="border-top: 1px solid #dcdfe6">
      <div class="customer-label">企业性质</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.baseInfo.enterpriseNature" placeholder="请选择客户公司企业性质"
          style="width: 364px" filterable>
          <el-option v-for="item in crm_enterprisenature" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <span v-else :class="isRedKey?.enterpriseNature ? 'red' : ''">
          <DictTag :class="isRedKey?.enterpriseNature ? 'red' : ''" :value="customerForm.baseInfo.enterpriseNature"
            :options="crm_enterprisenature"></DictTag>
        </span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.enterpriseNatureFileRichText
          " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">成立年份</div>
      <div class="customer-item">
        <el-date-picker v-if="edit" v-model="customerForm.management.establishmentYearTime" type="year"
          style="width: 364px" placeholder="请选择客户公司成立年份" @change="setEstablishmentYears" />
        <span v-else :class="isRedKey?.establishmentYearTime ? 'red' : ''">{{
          customerForm.management?.establishmentYearTime || ''
        }}</span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.management.establishmentYearTimeFileRichText
            " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">成立年限</div>
      <div class="customer-item">
        <span>{{
          customerForm.management?.establishmentYearTime ? (customerForm.management?.establishmentYears || '不足一年') : ''
        }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">成立年限分类</div>
      <div class="customer-item">
        <!-- <el-select disabled v-if="edit" v-model="customerForm.baseInfo.establishedTimeId" placeholder="请选择成立时长" style="width:364px"
                     filterable>
                    <el-option v-for="item in risklist?.established_time" :key="item.id" :label="item.optionDesc"
                        :value="item.id" />
                </el-select>
                <span v-else>{{ customerForm.baseInfo.establishedTimeId }}</span> -->
        <DictTag :class="isRedKey?.establishedTimeId ? 'red' : ''" :value="customerForm.baseInfo.establishedTimeId"
          :options="risklist?.established_time"></DictTag>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">人员规模</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.baseInfo.staffSizeId" placeholder="请选择人员规模" style="width: 364px"
          filterable>
          <el-option v-for="item in risklist?.staff_size" :key="item.id" :label="item.optionDesc" :value="item.id" />
        </el-select>
        <span v-else :class="isRedKey?.staffSizeId ? 'red' : ''">
          <DictTag :class="isRedKey?.staffSizeId ? 'red' : ''" :value="customerForm.baseInfo.staffSizeId"
            :options="risklist?.staff_size"></DictTag>
        </span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.staffSizeFileRichText" :disabled="!edit">
        </ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">行业排名</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.baseInfo.industryRankingId" placeholder="请选择行业排名"
          style="width: 364px" filterable>
          <el-option v-for="item in risklist?.industry_ranking" :key="item.id" :label="item.optionDesc"
            :value="item.id" />
        </el-select>
        <span v-else :class="isRedKey?.industryRankingId ? 'red' : ''">
          <DictTag :class="isRedKey?.industryRankingId ? 'red' : ''" :value="customerForm.baseInfo.industryRankingId"
            :options="risklist?.industry_ranking"></DictTag>
        </span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.industryRankingFileRichText" :disabled="!edit">
        </ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">所在行业品牌知名度</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.management.industryBrandAwareness" placeholder="请选择所在行业品牌知名度"
          style="width: 364px" filterable>
          <el-option v-for="item in crm_Brandawarenessintheindustry" :key="item.id" :label="item.label"
            :value="item.value" />
        </el-select>
        <span v-else :class="isRedKey?.industryBrandAwareness ? 'red' : ''">
          <DictTag :class="isRedKey?.industryBrandAwareness ? 'red' : ''"
            :value="customerForm.management.industryBrandAwareness" :options="crm_Brandawarenessintheindustry">
          </DictTag>
        </span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">所在地域品牌知名度</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.management.areaBrandAwareness" placeholder="请选择所在地域品牌知名度"
          style="width: 364px" filterable>
          <el-option v-for="item in crm_Brandawarenessintheindustry" :key="item.id" :label="item.label"
            :value="item.value" />
        </el-select>
        <span v-else :class="isRedKey?.areaBrandAwareness ? 'red' : ''">
          <DictTag :class="isRedKey?.areaBrandAwareness ? 'red' : ''" :value="customerForm.management.areaBrandAwareness"
            :options="crm_Brandawarenessintheindustry">
          </DictTag>
        </span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">客户经营类型</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.management.customerManagementType" placeholder="请选择客户经营类型"
          style="width: 364px" filterable>
          <el-option v-for="item in crm_customerbusinesstype" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <span v-else>
          <DictTag :class="isRedKey?.customerManagementType ? 'red' : ''"
            :value="customerForm.management.customerManagementType" :options="crm_customerbusinesstype">
          </DictTag>
        </span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">客户销售商品类别</div>
      <div class="customer-item" style="display:block;">
        <el-select v-if="edit||customerSoldType?.length" :disabled="!edit" multiple v-model="customerSoldType" placeholder="请选择客户销售商品类别" filterable
          style="width: 358px" @change="changeCustomerSoldType">
          <el-option v-for="item in crm_Categoryofgoodssoldbycustomers" :key="item.id" :label="item.label"
            :value="item.value" />
        </el-select>
        <el-input v-if="customerSoldType.indexOf('7') > -1&&edit" v-model="custremark" maxlength="200" placeholder="请填写客户销售商品类别"
          show-word-limit type="textarea" style="width: 364px; margin-right: 10px" />
        <!-- <span v-if="!edit">{{ customerSoldType.join(",") }}</span> -->
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">客户销售商品品牌</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.management.customerSoldBrand" maxlength="100"
          placeholder="请填写客户销售商品品牌" show-word-limit type="textarea" style="width: 364px; margin-right: 10px" />
        <span v-else :class="isRedKey?.customerSoldBrand ? 'red' : ''">{{
          customerForm.management?.customerSoldBrand
        }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">所在国别分类</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.management.countryClassification" placeholder="请选择客户经营类型"
          style="width: 364px" filterable>
          <el-option label="国内企业" value="国内企业" />
          <el-option label="国外企业" value="国外企业" />
        </el-select>
        <span v-else :class="isRedKey?.countryClassification ? 'red' : ''">{{
          customerForm.management?.countryClassification
        }}</span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.management.countryClassificationFileRichText
            " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <div class="customer-form" v-if="customerForm.management?.countryClassification == '国外企业'">
      <div class="customer-label">所在国别名称</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.management.countryName" maxlength="30" placeholder="请填写客户公司所在国别名称"
          show-word-limit type="text" style="width: 364px; margin-right: 10px" />
        <span v-else :class="isRedKey?.countryName ? 'red' : ''">{{
          customerForm.management.countryName
        }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">主要客户名单</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.management.mainCustomerList" maxlength="200"
          placeholder="请填写客户公司的主要客户名单" show-word-limit type="textarea" style="width: 364px; margin-right: 10px" />
        <span v-else :class="isRedKey?.mainCustomerList ? 'red' : ''">{{
          customerForm.management.mainCustomerList
        }}</span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.management.mainCustomerListFileRichText
            " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <h3>财务风险</h3>
    <div class="customer-form" style="border-top: 1px solid #dcdfe6">
      <div class="customer-label">客户纳税人分类</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.baseInfo.customerTaxpayerClassification" style="width: 364px"
          placeholder="请选择客户纳税人分类" filterable>
          <el-option label="小规模纳税人" value="小规模纳税人" />
          <el-option label="一般纳税人" value="一般纳税人" />
          <el-option label="个体户" value="个体户" />
        </el-select>
        <span v-else :class="isRedKey?.customerTaxpayerClassification ? 'red' : ''">{{
          customerForm.baseInfo.customerTaxpayerClassification }}</span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.customerTaxpayerClassificationFileRichText
          " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">年营收</div>
      <div class="customer-item">
        <el-input-number v-if="edit" class="numinp" style="width: 364px" placeholder="请输入年营收" @keydown="clearInput"
          :min="1" :precision="0" :max="9999999" :controls="false"
          v-model="customerForm.management.previousYearSalesAmount" @blur="changePreviousYearSalesAmount" />
        <span v-if="edit">万</span>
        <span v-else :class="isRedKey?.previousYearSalesAmount ? 'red' : ''">
          {{ customerForm.management.previousYearSalesAmount || "" }}
          <span v-if="customerForm.management.previousYearSalesAmount">万</span>
        </span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.management.yearSalesAmountFileRichText
          " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">年营收分类</div>
      <div class="customer-item">
        <DictTag :class="isRedKey?.previousYearSalesAmount ? 'red' : ''" :value="customerForm.baseInfo.annualRevenueClassification" :options="crm_customer_amount_of_money">
        </DictTag>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">包装需求规模</div>
      <div class="customer-item">
        <el-input-number v-if="edit" class="numinp" style="width: 364px" placeholder="请填写客户公司包装需求的金额规模"
          @keydown="clearInput" :precision="0" :min="1" :max="99999" :controls="false"
          v-model="customerForm.baseInfo.packagingDemandScale" @blur="changePackagingDemandScale" />
        <span v-if="edit">万</span>
        <span v-else :class="isRedKey?.packagingDemandScale ? 'red' : ''">
          {{ customerForm.baseInfo.packagingDemandScale || "" }}
          <span v-if="customerForm.baseInfo.packagingDemandScale">万</span>
        </span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">包装需求规模分类</div>
      <div class="customer-item">
        <DictTag :class="isRedKey?.previousYearSalesAmount ? 'red' : ''" :value="customerForm.baseInfo.packagingDemandScaleClassification"
          :options="crm_customer_amount_of_money"></DictTag>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">注册资金实缴金额</div>
      <div class="customer-item">
        <el-input-number v-if="edit" class="numinp" style="width: 364px" placeholder="请填写客户公司注册资金实缴金额"
          @keydown="clearInput" :precision="0" :min="1" :max="9999999" :controls="false"
          v-model="customerForm.baseInfo.registeredCapitalPaidAmount" @blur="changeRegisteredCapitalPaidAmount" />
        <span v-if="edit">万</span>
        <span v-else :class="isRedKey?.registeredCapitalPaidAmount ? 'red' : ''">
          {{ customerForm.baseInfo.registeredCapitalPaidAmount || "" }}
          <span v-if="customerForm.baseInfo.registeredCapitalPaidAmount">万</span>
        </span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.registeredCapitalPaidAmountFileRichText
          " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">注册资金实缴金额分类</div>
      <div class="customer-item">
        <DictTag :class="isRedKey?.previousYearSalesAmount ? 'red' : ''" :value="customerForm.baseInfo.registeredCapitalPaidAmountClassification
          " :options="risklist?.registered_capital"></DictTag>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">已抵押金额</div>
      <div class="customer-item">
        <el-input-number v-if="edit" class="numinp" style="width: 364px" placeholder="请填写客户公司已抵押金额" @keydown="clearInput"
          :precision="0" :min="0" :max="9999999" :controls="false" v-model="customerForm.baseInfo.mortgagedAmount"
          @blur="changeMortgagedAmount" />
        <span v-if="edit">万</span>
        <span v-else :class="isRedKey?.mortgagedAmount ? 'red' : ''">
          {{ customerForm.baseInfo.mortgagedAmount || "" }}
          <span v-if="customerForm.baseInfo.mortgagedAmount">万</span>
        </span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.mortgagedAmountFileRichText" :disabled="!edit">
        </ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">抵押情况描述</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.baseInfo.mortgageSituationDescription" maxlength="200"
          placeholder="请填写客户公司抵押情况" show-word-limit type="textarea" style="width: 364px; margin-right: 10px" />
        <span v-else :class="isRedKey?.mortgageSituationDescription ? 'red' : ''">{{
          customerForm.baseInfo.mortgageSituationDescription }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">抵押比例</div>
      <div class="customer-item">
        <span :class="isRedKey?.previousYearSalesAmount ? 'red' : ''">{{ customerForm.baseInfo.mortgageRatio
        }}<span v-if="customerForm.baseInfo?.mortgageRatio">%</span></span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.mortgageRatioFileRichText" :disabled="!edit">
        </ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">客户固定资产估价</div>
      <div class="customer-item">
        <el-input-number v-if="edit" class="numinp" style="width: 364px" placeholder="请填写客户公司固定资产估价" @keydown="clearInput"
          :precision="0" :min="1" :max="9999999" :controls="false"
          v-model="customerForm.baseInfo.customerFixedAssetsValuation" @blur="changeCustomerFixedAssetsValuation" />
        <span v-if="edit">万</span>
        <span v-else :class="isRedKey?.customerFixedAssetsValuation ? 'red' : ''">
          {{ customerForm.baseInfo.customerFixedAssetsValuation || "" }}
          <span v-if="customerForm.baseInfo.customerFixedAssetsValuation">万</span>
        </span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.customerFixedAssetsValuationFileRichText
          " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">客户固定资产估价分类</div>
      <div class="customer-item">
        <DictTag :class="isRedKey?.previousYearSalesAmount ? 'red' : ''" :value="customerForm.baseInfo.customerFixedAssetsValuationClassification
          " :options="crm_customer_amount_of_money"></DictTag>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">固定资产情况描述</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.baseInfo.fixedAssetsDescription" maxlength="200"
          placeholder="请填写客户公司固定资产情况" show-word-limit type="textarea" style="width: 364px; margin-right: 10px" />
        <span v-else :class="isRedKey?.fixedAssetsDescription ? 'red' : ''">{{
          customerForm.baseInfo.fixedAssetsDescription
        }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">客户自有房产估价</div>
      <div class="customer-item">
        <el-input-number v-if="edit" class="numinp" style="width: 364px" placeholder="请填写客户公司自有房产估计" @keydown="clearInput"
          :precision="0" :min="1" :max="9999999" :controls="false"
          v-model="customerForm.baseInfo.customerOwnedPropertyValuation" />
        <span v-if="edit">万</span>
        <span v-else :class="isRedKey?.customerOwnedPropertyValuation ? 'red' : ''">
        {{
          customerForm.baseInfo.customerOwnedPropertyValuation || ""
        }}
        <span v-if="customerForm.baseInfo.customerOwnedPropertyValuation">万</span>
        </span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.customerOwnedPropertyValuationFileRichText
            " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">自有房产情况描述</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.baseInfo.customerOwnedPropertyDescription" maxlength="200"
          placeholder="请填写客户公司自有房产情况" show-word-limit type="textarea" style="width: 364px; margin-right: 10px" />
        <span v-else :class="isRedKey?.customerOwnedPropertyDescription ? 'red' : ''">{{
          customerForm.baseInfo.customerOwnedPropertyDescription }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <h3>法务风险</h3>
    <div class="customer-form" style="border-top: 1px solid #dcdfe6">
      <div class="customer-label">是否有诉讼</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.baseInfo.existLawsuitId" style="width: 364px"
          placeholder="请选择客户公司是否有诉讼" filterable>
          <el-option v-for="item in risklist?.exist_lawsuit" :key="item.id" :label="item.optionDesc" :value="item.id" />
        </el-select>
        <span v-else :class="isRedKey?.existLawsuitId ? 'red' : ''">
          <DictTag :value="customerForm.baseInfo.existLawsuitId" :options="risklist?.exist_lawsuit"></DictTag>
        </span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.existLawsuitFileRichText" :disabled="!edit">
        </ImageUpload>
      </div>
    </div>
    <div class="customer-form">
      <div class="customer-label">诉讼情况描述</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.baseInfo.litigationSituationDescription" maxlength="200"
          placeholder="请填写客户公司诉讼情况" show-word-limit type="textarea" style="width: 364px; margin-right: 10px" />
        <span v-else :class="isRedKey?.litigationSituationDescription ? 'red' : ''">{{
          customerForm.baseInfo.litigationSituationDescription }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <div class="customer-form">
      <div class="customer-label">是否有行政处罚</div>
      <div class="customer-item">
        <el-select v-if="edit" v-model="customerForm.baseInfo.administrativePenalty" style="width: 364px"
          @change="customerForm.baseInfo.administrativePenaltyDescription = ''" placeholder="请选择客户公司是否有行政处罚" filterable>
          <el-option label="无" :value="false" />
          <el-option label="有" :value="true" />
        </el-select>
        <span v-else :class="isRedKey?.administrativePenalty ? 'red' : ''">{{
          customerForm.baseInfo.administrativePenalty === true ? '有' : '无' }}</span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.administrativePenaltyFileRichText
          " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <div class="customer-form" v-if="customerForm.baseInfo.administrativePenalty">
      <div class="customer-label">行政处罚描述</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.baseInfo.administrativePenaltyDescription" maxlength="200"
          placeholder="请填写行政处罚描述" show-word-limit type="textarea" style="width: 364px;" />
        <span v-else :class="isRedKey?.administrativePenaltyDescription ? 'red' : ''">{{
          customerForm.baseInfo.administrativePenaltyDescription }}</span>
      </div>
      <div class="customer-image"></div>
    </div>
    <h3>客户其他备注</h3>
    <div class="customer-form" style="border-top: 1px solid #dcdfe6">
      <div class="customer-label">客户其他备注</div>
      <div class="customer-item">
        <el-input v-if="edit" v-model="customerForm.baseInfo.customerOtherComments" maxlength="200"
          placeholder="请填写客户其他备注" show-word-limit type="textarea" style="width: 364px; " />
        <span v-else :class="isRedKey?.customerOtherComments ? 'red' : ''">{{
          customerForm.baseInfo.customerOtherComments
        }}</span>
      </div>
      <div class="customer-image">
        <ImageUpload v-model:modelValue="customerForm.baseInfo.customerOtherCommentsFileRichText
            " :disabled="!edit"></ImageUpload>
      </div>
    </div>
    <slot name="examine"></slot>
    <template v-if="dialogType != 'view'">
      <h3>客户授信信息</h3>
      <div class="customer-form" style="border-top: 1px solid #dcdfe6">
        <div class="customer-label">客户申请账期</div>
        <div class="customer-item">
          <el-select v-if="creditQuotaEdit || edit" v-model="customerForm.baseInfo.moreSettlementMethodId"
            style="width: 364px" placeholder="请选择客户申请账期" filterable>
            <el-option v-for="item in risklist.more_settlement_method" :key="item.id" :label="item.optionDesc"
              :value="item.id" />
          </el-select>
          <span v-else :class="isRedKey?.moreSettlementMethodId ? 'red' : ''">
            <DictTag :value="customerForm.baseInfo.moreSettlementMethodId" :options="risklist?.more_settlement_method">
            </DictTag>
          </span>
        </div>
        <div class="customer-image"></div>
      </div>

      <div class="customer-form">
        <div class="customer-label">客户申请授信额度</div>
        <div class="customer-item">
          <el-input-number v-if="creditQuotaEdit || edit" class="numinp" style="width: 364px" placeholder="请填写客户申请授信额度"
            @keydown="clearInput" :precision="0" :min="0" :max="9999999" :controls="false"
            v-model="customerForm.baseInfo.customerCreditQuota" />
          <span v-if="creditQuotaEdit || edit">万</span>
          <span v-else :class="isRedKey?.customerCreditQuota ? 'red' : ''">
            {{ customerForm.baseInfo.customerCreditQuota }}
            <span v-if="customerForm.baseInfo.customerCreditQuota">万</span>
          </span>
        </div>
        <div class="customer-image"></div>
      </div>
      <div class="customer-form" v-if="isFinanceExamine || customerForm.baseInfo.financeApprovalOaNumber">
        <div class="customer-label">财务审批OA单编号</div>
        <div class="customer-item">
          <el-input v-if="isFinanceExamine" v-model="customerForm.baseInfo.financeApprovalOaNumber" maxlength="50"
            placeholder="请填写财务审批OA单编号" show-word-limit type="text" style="width: 364px; margin-right: 10px" />
          <span v-else>{{ customerForm.baseInfo.financeApprovalOaNumber }}</span>
        </div>
        <div class="customer-image"></div>
      </div>
    </template>
    <template v-if="dialogType == 'view'">
      <h3>财务审批结论</h3>
      <div class="customer-form" style="border-top: 1px solid #dcdfe6">
        <div class="customer-label">已审批结算方式</div>
        <div class="customer-item">
          <span>
            <DictTag :value="customerForm.baseInfo.moreSettlementMethodId" :options="risklist?.more_settlement_method">
            </DictTag>
          </span>
        </div>
        <div class="customer-image"></div>
      </div>

      <div class="customer-form">
        <div class="customer-label">已审批授信额度</div>
        <div class="customer-item">
          <span>
            {{ customerForm.baseInfo.customerCreditQuota }}
            <span v-if="customerForm.baseInfo.customerCreditQuota">万</span>
          </span>
        </div>
        <div class="customer-image"></div>
      </div>
      <div class="customer-form" v-if="customerForm.newsetApplyDetail && customerForm.auditing">
        <div class="customer-label">申请内容</div>
        <div class="customer-item">
          <DictTag :value="customerForm.newsetApplyDetail?.deptAfter?.baseInfo.moreSettlementMethodId"
            :options="risklist?.more_settlement_method"></DictTag>
          <span>，额度{{ customerForm.newsetApplyDetail?.deptAfter?.baseInfo.customerCreditQuota/10000 }}</span>
          <span v-if="customerForm.newsetApplyDetail?.deptAfter?.baseInfo.customerCreditQuota">万</span>
        </div>
        <div class="customer-image" style="display:flex;align-items:center;justify-content:center;">
          <span>部门</span>
          <DictTag :value="customerForm.newsetApplyDetail?.deptApprovalStatus" :options="crm_audit_status"></DictTag>          
          <span v-if="customerForm.newsetApplyDetail?.deptApprovalStatus == '2'">-><span style="color:#ff0036;">财务审核中</span></span>
        </div>
      </div>
    </template>
  </el-scrollbar>
</template>

<script setup>
import dateTimePicker from "@/components/datePicker";
import { ElMessage, ElMessageBox } from "element-plus";
import { gradingCalculateConfig } from "@/api/orderManagement/customer/index";
import { exportCrmCustomer } from "@/api/crm/customer/newIndex"
const props = defineProps({
  //账期是否编辑
  creditQuotaEdit: {
    type: Boolean,
    default: false,
  },
  // 是否财务审批
  isFinanceExamine: {
    type: Boolean,
    default: false,
  },
  //是否编辑
  edit: {
    type: Boolean,
    default: false,
  },
  //客户信息
  customer: {
    type: Object,
    default: {},
  },
  //旧数据
  beforeData: {
    type: Object,
    default: {},
  },
  //是否滚动
  scroll: {
    type: Boolean,
    default: true,
  },
  dialogType: {
    type: String,
    default: 'edit',
  },
  //导出id
  applyId:{
    type:String,
    default:''
  }
});
const { customer } = toRefs(props);
const emit = defineEmits();
const data = reactive({
  customerForm: {},
  risklist: {},
  isRedKey: {},
});
const { customerForm, risklist, isRedKey } = toRefs(data);
if (customer.value) {
  customerForm.value = props.customer;
  if (!props.customer.baseInfo?.existLawsuitId) {
    customerForm.value.baseInfo.existLawsuitId = "8";
  }
  if (customerForm.value.management.establishmentYearTime) {
    customerForm.value.management.establishmentYearTime = String(customerForm.value.management.establishmentYearTime)
  }
  if (!props.edit && props.beforeData?.baseInfo) {
    for (const key in customerForm.value.baseInfo) {
      if (customerForm.value.baseInfo[key] != props.beforeData.baseInfo[key]) {
        isRedKey.value[key] = true;
      } else {
        isRedKey.value[key] = false;
      }
    }
    if(props.beforeData.management){
      for (const key in customerForm.value.management) {
        if (
          customerForm.value.management[key] != props.beforeData.management[key]
        ) {
          isRedKey.value[key] = true;
        } else {
          isRedKey.value[key] = false;
        }
      }
    }
   
  }
}
const customerSoldType = ref([]); //客户销售商品类别
const { proxy } = getCurrentInstance();
const {
  crm_customerbusinesstype,
  crm_Brandawarenessintheindustry,
  crm_Categoryofgoodssoldbycustomers,
  crm_enterprisenature,
  crm_customer_amount_of_money,
  crm_audit_status
} = proxy.useDict(
  "crm_customerbusinesstype",
  "crm_Brandawarenessintheindustry",
  "crm_Categoryofgoodssoldbycustomers",
  "crm_enterprisenature",
  "crm_customer_amount_of_money",
  "crm_audit_status"
);
gradingCalculateConfig().then((res) => {
  risklist.value = res.data;
  risklist.value.established_time = res.data.established_time.map((item) => {
    return {
      ...item,
      label: item.optionDesc,
      value: item.id,
      elTagType: "",
    };
  });
  risklist.value.registered_capital = res.data.registered_capital.map(
    (item) => {
      return {
        ...item,
        label: item.optionDesc,
        value: item.id,
        elTagType: "",
      };
    }
  );
  risklist.value.more_settlement_method = res.data.more_settlement_method.map(
    (item) => {
      return {
        ...item,
        label: item.optionDesc,
        value: item.id,
        elTagType: "",
      };
    }
  );
  risklist.value.exist_lawsuit = res.data.exist_lawsuit.map(
    (item) => {
      return {
        ...item,
        label: item.optionDesc,
        value: item.id,
        elTagType: "",
      };
    }
  );
  risklist.value.industry_ranking = res.data.industry_ranking.map(
    (item) => {
      return {
        ...item,
        label: item.optionDesc,
        value: item.id,
        elTagType: "",
      };
    }
  );
  risklist.value.staff_size = res.data.staff_size.map(
    (item) => {
      return {
        ...item,
        label: item.optionDesc,
        value: item.id,
        elTagType: "",
      };
    }
  );
});
onMounted(() => {
  watch(
    customerForm,
    (val) => {
      customerForm.value.baseInfoUpdated = true;
      emit("updated:customer", customerForm.value);
      emit("isChange", true);
    },
    {
      deep: true,
    }
  );
});
//选择成立日期时计算其他信息
function setEstablishmentYears(year) {
  let y =
    Number(new Date().getFullYear()) - Number(new Date(year).getFullYear());
  if (y < 0) {
    customerForm.value.management.establishmentYearTime = null;
    ElMessage.error("成立时间不能晚于当前日期！");
  }
  customerForm.value.management.establishmentYears = y
  //16:不足一年；15一至三年；14三至五年；13五年及以上
  customerForm.value.baseInfo.establishedTimeId =
    y < 1 ? "16" : y < 4 ? "15" : y < 6 ? "14" : "13";
}
//输入年营收后自动设置年营收分类
function changePreviousYearSalesAmount() {
  customerForm.value.baseInfo.annualRevenueClassification = setAmountOfMoney(
    customerForm.value.management.previousYearSalesAmount
  );
}
//输入包装需求规模后自动设置包装需求规模分类
function changePackagingDemandScale() {
  customerForm.value.baseInfo.packagingDemandScaleClassification =
    setAmountOfMoney(customerForm.value.baseInfo.packagingDemandScale);
}
//输入客户固定资产估价后自动设置客户固定资产估价分类
function changeCustomerFixedAssetsValuation() {
  customerForm.value.baseInfo.customerFixedAssetsValuationClassification =
    setAmountOfMoney(customerForm.value.baseInfo.customerFixedAssetsValuation);
}
//输入注册资金实缴金额后自动设置注册资金实缴金额分类
function changeRegisteredCapitalPaidAmount() {
  let val = customerForm.value.baseInfo.registeredCapitalPaidAmount;
  if (val > 0) {
    changeMortgagedAmount();
  }
  let index = [5000, 1000, 500, 100, 50, 0].findIndex(
    (e) => val > e || val == e
  );
  if (index == -1) {
    customerForm.value.baseInfo.registeredCapitalPaidAmountClassification = "";
  } else {
    customerForm.value.baseInfo.registeredCapitalPaidAmountClassification =
      risklist.value.registered_capital[index].id;
  }
}
//输入抵押金额后计算抵押比例
function changeMortgagedAmount() {
  if (
    customerForm.value.baseInfo?.registeredCapitalPaidAmount &&
    customerForm.value.baseInfo?.mortgagedAmount
  ) {
    customerForm.value.baseInfo.mortgageRatio = (
      (customerForm.value.baseInfo?.mortgagedAmount /
        customerForm.value.baseInfo?.registeredCapitalPaidAmount) *
      100
    ).toFixed(2);
  }else{
    customerForm.value.baseInfo.mortgageRatio = null
  }
}

function setAmountOfMoney(val) {
  if (!val) {
    return null;
  }
  let arr = [0, 50, 100, 500, 1000, 5000];
  let num = arr.findIndex((e) => val < e);
  if (num == -1) {
    num = 6;
  }
  return num;
}
const custremark = ref("");
function changeCustomerSoldType() {
  customerForm.value.soldTypeList = customerSoldType.value.map((e, i) => {
    let obj = {
      customerSoldType: e,
      remark: e == 7 ? custremark.value : "",
      sortIndex: i,
    };
    return obj;
  });
}
if (props.customer.managementSoldTypeList?.length) {
  customerSoldType.value = props.customer.managementSoldTypeList.map((e) => {
    if (e.customerSoldType == 7) {
      custremark.value = e.remark;
    }
    return e.customerSoldType;
  });
}else if (props.customer.soldTypeList?.length) {
  customerSoldType.value = props.customer.soldTypeList.map((e) => {
    if (e.customerSoldType == 7) {
      custremark.value = e.remark;
    }
    return e.customerSoldType;
  });
}
function exportExcel(id){
  exportCrmCustomer(id,'客户风险信息登记表.xlsx')
}
</script>

<style lang="scss" scoped>
.customer-form {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #dcdfe6;

  div {
    padding: 6px 2px;
  }

  .customer-label {
    width: 160px;
    border-left: 1px solid #dcdfe6;
    padding-left: 10px;
    position: relative;
  }

  .customer-item {
    width: 380px;
    display: flex;
    align-items: center;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    padding: 0px 10px;
  }

  .customer-image {
    flex: 1;
    border-right: 1px solid #dcdfe6;
  }
}

.red-star {
  position: absolute;
  left: 3px;
  color: #ff0036;
  line-height: 24px;
  user-select: none;
}

:deep(.component-upload-image .el-upload--picture-card) {
  --el-upload-picture-card-size: 80px;
}

:deep(.component-upload-image .is-success) {
  width: 80px;
  height: 80px;
}

.red {
  color: #ff0036;
}
</style>

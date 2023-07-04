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
      <div style="height:351px;">
				<h4 class="title">基础信息</h4>
				<p>
					<span class="alignRight">客户证照图像：</span>
					<img
						v-if="editdata.before.baseInfo.licenseImageUrl"
						style="width: 64px; height: 64px; background: #ddd"
						:src="BASE_FILE_URL + editdata.before.baseInfo.licenseImageUrl"
						alt=""
					/>
          <span v-else>-</span>
				</p>
				<p>
					<span class="alignRight">客户名称：</span
					>{{ editdata.before.baseInfo?.customerName||'-' }}
				</p>

        <p>
					<span class="alignRight">更多结算方式：</span
					>
          <settlementMethod
            v-if="editdata.before.baseInfo?.moreSettlementMethodId"
            :methodId="editdata.before.baseInfo?.moreSettlementMethodId"
            :methodList="risklist.more_settlement_method"
          />
          <span v-else>立结</span>
				</p>

				<p v-if="editdata.before.baseInfo?.enterpriseNature==2||editdata.before.baseInfo?.enterpriseNature==3||editdata.before.baseInfo?.enterpriseNature==4">
					<span class="alignRight">统一社会信用代码：</span
					>{{ editdata.before.baseInfo?.unifiedSocialCreditCode||'-' }}
				</p>
				<p v-if="editdata.before.baseInfo?.enterpriseNature==1">
					<span class="alignRight">客户身份证号码：</span
					>{{ editdata.before.baseInfo?.customerIdNumber||'-' }}
				</p>
				<p>
					<span class="alignRight">客户企业性质：</span
					><DictTag
            style="display: inline-block;"
            :value="
              editdata.before.baseInfo?.enterpriseNature
            "
            :options="crm_enterprisenature"
          />
				</p>
				<p>
					<span class="alignRight">客户维护费用额度：</span>
          {{ showMoney(editdata.before.baseInfo?.customerMaintenanceCostLimit) }}
          <span v-if="editdata.before.baseInfo?.customerMaintenanceCostLimit===null||editdata.before.baseInfo?.customerMaintenanceCostLimit===''">-</span>
          <template v-if="editdata.before.baseInfo?.customerMaintenanceCostLimit">元</template>
				</p>
			</div>

      <div v-if="editdata.before.contactsList.length > 0">
				<h4 class="title">联系人</h4>
				<div class="contactPerson" :style="editdata.after&&editdata.after.contactsList.length?'max-width:610px;':'max-width:100%'">
					<ul v-for="(item,index) in editdata.before.contactsList" :key="index" style="position: relative;">
						<li>联系人{{index+1}}：</li>
						<li class="human">
							<p>
								<span class="alignRight widthRight"
									>联系人：</span
								>{{ item?.contactsName||'-' }}
							</p>
							<p>
								<span class="alignRight widthRight"
									>联系电话：</span
								>{{ item?.contactsPhone||'-' }}
							</p>
              <p>
								<span class="alignRight widthRight"
									>省市区：</span
								>
                {{ item?.province||'-' }}

                {{ item?.city||'-' }}

                {{ item?.district||'-' }}
							</p>
							<div style="display: flex;">
								<div class="alignRight widthRight">联系地址：</div>
                <div style="flex: 1;">{{ item?.contactsAddress||'-' }}</div>
							</div>
							<p>
								<span class="alignRight widthRight"
									>联系邮编：</span
								>{{ item?.contactsPostcode||'-' }}
							</p>
              <p>
								<span class="alignRight widthRight"
									>职位：</span
								>
                <DictTag
                  v-if="item.positionName"
                  style="display: inline-block;"
                  :value="item.positionName"
                  :options="crm_position"
                />
                <template v-else>-</template>
							</p>
              <p v-if="item.pivotal" style="position: absolute;top: -20px;right: 10px;">
								<el-tag
                  class="mx-1"
                  effect="dark"
                  size="large"
                >
                  关键联系人
                </el-tag>
							</p>
						</li>
					</ul>
				</div>
			</div>

      <div style="width:610px;height:380px" v-if="!editdata.before.invoiceList&&editdata?.after?.invoiceList">
        <h4 class="title">开票信息</h4>
        无
      </div>
      <div v-if="editdata.before.invoiceList&&editdata.before.invoiceList.length > 0">
				<h4 class="title">开票信息</h4>
				<div class="contactPerson" :style="editdata.after&&(editdata.after.invoiceList&&editdata.after.invoiceList.length)?'max-width:610px;':'max-width:100%'">
					<ul v-for="(e,i) in editdata.before.invoiceList" :key="e.id">
						<li>开票信息{{i+1}}：</li>
						<li class="human">
							<p>
								<span class="alignRight invoice"
									>开票单位名称：</span
								>{{ e?.invoiceCompanyName||'-' }}
							</p>
							<p>
								<span class="alignRight invoice"
									>纳税人识别号：</span
								>{{ e?.taxpayerRegistrationNumber||'-' }}
							</p>
							<p>
								<span class="alignRight invoice">邮箱：</span
								>{{ e?.invoiceEmail||'-' }}
							</p>
              <div style="display: flex;">
								<div class="alignRight invoice">注册地址：</div>
                <div style="flex: 1;">{{ e?.invoiceRegisteredAddress||'-' }}</div>
							</div>
							<p>
								<span class="alignRight invoice"
									>联系电话：</span
								>{{ e?.invoicePhone||'-' }}
							</p>
              <div style="display: flex;">
								<div class="alignRight invoice">开户银行：</div>
                <div style="flex: 1;">{{ e?.invoiceDepositBank||'-' }}</div>
							</div>
							<p>
								<span class="alignRight invoice"
									>开户账号：</span
								>{{ e?.invoiceBankAccount||'-' }}
							</p>
							<p>
								<span class="alignRight invoice"
									>发票收货人：</span
								>{{ e?.invoiceConsigneeName||'-' }}
							</p>
							<p>
								<span class="alignRight invoice"
									>收货人电话：</span
								>{{ e?.invoiceConsigneePhone||'-' }}
							</p>
              <p>
								<span class="alignRight invoice"
									>省市区：</span
								>
                {{ e?.province ||'-' }}

                {{ e?.city ||'-' }}

                {{ e?.district ||'-' }}

							</p>
              <div class="textcon">
								<div class="alignRight invoice">发票收货地址：</div>
                <div style="flex: 1;">{{ e?.invoiceConsigneeAddress||'-' }}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>

      <div>
      <h4 class="title">客户经营信息</h4>
			<p>
				<span class="alignRight">客户经营类型：</span>
        <DictTag
            style="display: inline-block;"
            :value="
              editdata.before.management?.customerManagementType
            "
            :options="crm_customerbusinesstype"
          />
			</p>
			<!-- <p>
				<span class="alignRight">客户注册资本：</span
				>{{ editdata.before.management?.customerRegisteredCapital }}
			</p> -->
			<p v-if="editdata.before.soldTypeList.length">
				<span class="alignRight">客户销售商品类别：</span>
        <span v-for="item in editdata.before.soldTypeList" :key="item.sortIndex">
          <DictTag
            style="display: inline-block;margin-right:10px;"
            :value="
              item.customerSoldType
            "
            :options="crm_Categoryofgoodssoldbycustomers"
          />
        </span>
			</p>
			<p>
				<span class="alignRight">客户销售商品品牌：</span>
        {{ editdata.before.management?.customerSoldBrand||'-' }}
			</p>
      <p>
				<span class="alignRight">上年度销售额：</span
				>{{ showMoney(editdata.before.management?.previousYearSalesAmount)||'-' }}
			</p>
			<p>
				<span class="alignRight">所在行业品牌知名度：</span
				>
        <DictTag
            v-if="editdata.before.management?.industryBrandAwareness"
            style="display: inline-block;"
            :value="
              editdata.before.management?.industryBrandAwareness
            "
            :options="crm_Brandawarenessintheindustry"
          />
        <template v-else>-</template>
			</p>
			<p>
				<span class="alignRight">所在地域品牌知名度：</span
				>
        <DictTag
            v-if="editdata.before.management?.areaBrandAwareness"
            style="display: inline-block;"
            :value="
              editdata.before.management?.areaBrandAwareness
            "
            :options="crm_Brandawarenessintheindustry"
          />
        <template v-else>-</template>
			</p>

      <h4 class="title">其他风险</h4>

      <p>
					<span class="alignRight">更多结算方式：</span>
          <settlementMethod
            v-if="editdata.before.baseInfo?.moreSettlementMethodId"
            :methodId="editdata.before.baseInfo?.moreSettlementMethodId"
            :methodList="risklist.more_settlement_method"
          />
          <span v-else>立结</span>
      </p>

      <p v-if="editdata.before.baseInfo.existLawsuitId!==undefined">
				<span class="alignRight">是否有诉讼：</span>
        <settlementMethod
          v-if="risklist?.more_settlement_method"
          :methodId="editdata.before.baseInfo?.existLawsuitId"
          :methodList="risklist.exist_lawsuit"
        />
			</p>

      <p v-if="editdata.before.baseInfo.establishedTimeId!==undefined">
				<span class="alignRight">成立时长：</span>
        <settlementMethod
          v-if="risklist?.more_settlement_method"
          :methodId="editdata.before.baseInfo?.establishedTimeId"
          :methodList="risklist.established_time"
        />
			</p>

      <p v-if="editdata.before.baseInfo.registeredCapitalId!==undefined">
				<span class="alignRight">注册资金：</span>
        <settlementMethod
          v-if="risklist?.more_settlement_method"
          :methodId="editdata.before.baseInfo?.registeredCapitalId"
          :methodList="risklist.registered_capital"
        />
			</p>

      <p v-if="editdata.before.baseInfo.staffSizeId!==undefined">
				<span class="alignRight">人员规模：</span>
        <settlementMethod
          v-if="risklist?.staff_size"
          :methodId="editdata.before.baseInfo?.staffSizeId"
          :methodList="risklist.staff_size"
        />
			</p>

      <p v-if="editdata.before.baseInfo.industryRankingId!==undefined">
				<span class="alignRight">行业排名：</span>
        <settlementMethod
          v-if="risklist?.industry_ranking"
          :methodId="editdata.before.baseInfo?.industryRankingId"
          :methodList="risklist.industry_ranking"
        />
			</p>

      <p v-if="editdata.before.baseInfo.customerCreditQuota!==undefined">
				<span class="alignRight">授信额度：</span>
        {{showMoney(editdata.before.baseInfo?.customerCreditQuota)??'-'}}
			</p>

      <div style="width:460px;height:307px" v-if="!editdata.before.addressList&&editdata?.after?.addressList">
        <h4 class="title">收货地址</h4>
        无
      </div>

      <div v-if="editdata.before.addressList&&editdata.before.addressList.length > 0">
				<h4 class="title">收货地址</h4>
				<div class="contactPerson" :style="editdata.after&&(editdata.after.addressList&&editdata.after.addressList.length)?'max-width:610px;':'max-width:100%'">
					<ul v-for="(e,i) in editdata.before.addressList" :key="e.id">
						<li>收货地址{{i+1}}：</li>
						<li class="human">
							<p>
								<span class="alignRight invoice"
									>收货人：</span
								>{{ e?.consigneeName||'-' }}
							</p>
							<p>
								<span class="alignRight invoice"
									>联系电话：</span
								>{{ e?.consigneePhone||'-' }}
							</p>
              <p>
								<span class="alignRight invoice"
									>省市区：</span
								>
                {{ e?.province||'-' }}
                {{ e?.city||'-' }}
                {{ e?.district||'-' }}
							</p>
							<div class="textcon">
								<div class="alignRight invoice">收货详细地址：</div>
                <div style="flex: 1;">{{ e?.consigneeAddress||'-' }}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>

      

		</div>

    </div>

    <!-- 修改后 -->
    <div v-if="editdata.after">
      <div style="height:351px;">
				<h4 class="title">基础信息</h4>
				<p v-if="editdata.after.baseInfo">
					<span :class="{alignRight:true,red:editdata.after.baseInfo.licenseImageUrl!=editdata.before.baseInfo.licenseImageUrl}">客户证照图像：</span>
					<img
            v-if="editdata.after.baseInfo.licenseImageUrl"
						style="width: 64px; height: 64px; background: #ddd"
						:src="BASE_FILE_URL + editdata.after.baseInfo.licenseImageUrl"
						alt=""
					/>
          <span v-else>-</span>
				</p>
        <div v-if="editdata.after.baseInfo?.customerName">
          <p :class="{red:editdata.after.baseInfo.customerName!=editdata.before.baseInfo.customerName}">
            <span class="alignRight">客户名称：</span
            >{{ editdata.after.baseInfo?.customerName||'' }}
          </p>
        </div>
				
        <div>
          <p :class="{red:editdata.after.baseInfo.moreSettlementMethodId!=editdata.before.baseInfo.moreSettlementMethodId}">
            <span class="alignRight">更多结算方式：</span
            >
            <settlementMethod
             v-if="editdata.after.baseInfo?.moreSettlementMethodId"
              :methodId="editdata.after.baseInfo?.moreSettlementMethodId"
              :methodList="risklist.more_settlement_method"
            />
            <span v-else>立结</span>
          </p>
        </div>

        <div v-if="editdata.after.baseInfo?.enterpriseNature==2||editdata.after.baseInfo?.enterpriseNature==3||editdata.after.baseInfo?.enterpriseNature==4">
          <p :class="{red:editdata.after.baseInfo.unifiedSocialCreditCode!=editdata.before.baseInfo.unifiedSocialCreditCode}">
            <span class="alignRight">统一社会信用代码：</span
            >{{ editdata.after.baseInfo?.unifiedSocialCreditCode||'-' }}
          </p>
        </div>
				
        <div v-if="editdata.after.baseInfo?.enterpriseNature==1">
          <p :class="{red:editdata.after.baseInfo.customerIdNumber!=editdata.before.baseInfo.customerIdNumber}">
            <span class="alignRight">客户身份证号码：</span
            >{{ editdata.after.baseInfo?.customerIdNumber||'-' }}
          </p>
        </div>

				<div v-if="editdata.after.baseInfo?.enterpriseNature">
          <p :class="{red:editdata.after.baseInfo.enterpriseNature!=editdata.before.baseInfo.enterpriseNature}">
            <span class="alignRight">客户企业性质：</span>
            <DictTag
              style="display: inline-block;"
              :value="
                editdata.after.baseInfo?.enterpriseNature
              "
              :options="crm_enterprisenature"
            />
          </p>
        </div>
				<div>
          <p>
            <span class="alignRight">客户维护费用额度：</span>
            <span :class="{red:editdata?.after?.baseInfo?.customerMaintenanceCostLimit!=editdata?.before?.baseInfo?.customerMaintenanceCostLimit}">
              {{ showMoney(editdata.after?.baseInfo?.customerMaintenanceCostLimit) }}
              <span v-if="editdata.after.baseInfo?.customerMaintenanceCostLimit===null||editdata.after.baseInfo?.customerMaintenanceCostLimit===''">-</span>
              <template v-if="editdata.after.baseInfo?.customerMaintenanceCostLimit">元</template>
             </span>
          </p>
        </div>
        <!-- <div v-else style="height:30px;">
          <p>
            <span> </span>
          </p>
        </div> -->
				
			</div>
      <div v-if="editdata.after.contactsList.length > 0">
				<h4 class="title">联系人</h4>
				<div class="contactPerson">
					<ul v-for="(item,index) in editdata.after.contactsList" :key="item.id" style="position: relative;">
						<li>联系人{{index+1}}：</li>
						<li class="human">
							<p :class="{red:editdata.before.contactsList&&editdata.before.contactsList[index]&&item.contactsName==editdata.before.contactsList[index].contactsName?false:true}">
							<!-- <p > -->
								<span class="alignRight widthRight"
									>联系人：</span
								>{{ item?.contactsName||'-' }}
							</p>
							<p :class="{red:editdata.before.contactsList&&editdata.before.contactsList[index]&&item.contactsPhone==editdata.before.contactsList[index].contactsPhone?false:true}">
							<!-- <p > -->
								<span 
                  class="alignRight widthRight"
									>联系电话：</span
								>{{ item?.contactsPhone||'-' }}
							</p>
              <p>
								<span 
                  :class="{alignRight:true,widthRight:true,red:editdata.before.contactsList&&editdata.before.contactsList[index]&&item.province==editdata.before.contactsList[index].province?false:true}"
									>省市区：</span
								>
                <span :class="{red:editdata.before.contactsList&&editdata.before.contactsList[index]&&item.province==editdata.before.contactsList[index].province?false:true}"> {{ item?.province||'-' }} </span>
                <span :class="{red:editdata.before.contactsList&&editdata.before.contactsList[index]&&item.city==editdata.before.contactsList[index].city?false:true}" style="margin-left:8px;"> {{ item?.city||'-' }} </span>
                <span :class="{red:editdata.before.contactsList&&editdata.before.contactsList[index]&&item.district==editdata.before.contactsList[index].district?false:true}" style="margin-left:8px;"> {{ item?.district||'-' }} </span>
							</p>
							<div style="display: flex;" :class="{red:editdata.before.contactsList&&editdata.before.contactsList[index]&&item.contactsAddress==editdata.before.contactsList[index].contactsAddress?false:true}">
							<!-- <p > -->
								<div class="alignRight widthRight"
									>联系地址：</div
								>
                <div style="flex: 1;">
                  {{ item?.contactsAddress||'-' }}
                </div>
							</div>
							<p :class="{red:editdata.before.contactsList&&editdata.before.contactsList[index]&&item.contactsPostcode==editdata.before.contactsList[index].contactsPostcode?false:true}">
							<!-- <p > -->
								<span class="alignRight widthRight"
									>联系邮编：</span
								>{{ item?.contactsPostcode||'-' }}
							</p>
              <p :class="{red:editdata.before.contactsList&&editdata.before.contactsList[index]&&item.positionName==editdata.before.contactsList[index].positionName?false:true}">
							<!-- <p > -->
								<span class="alignRight widthRight">职位：</span>
                <DictTag
                  v-if="item.positionName"
                  style="display: inline-block;"
                  :value="item.positionName"
                  :options="crm_position"
                />
                <template v-else>-</template>
							</p>
              <p v-if="item.pivotal" style="position: absolute;top: -20px;right: 10px;">
								<el-tag
                  class="mx-1"
                  effect="dark"
                  size="large"
                >
                  关键联系人
                </el-tag>
							</p>
						</li>
					</ul>
				</div>
			</div>
      <div v-if="editdata.after.invoiceList&&editdata.after.invoiceList.length > 0">
				<h4 class="title">开票信息</h4>
				<div class="contactPerson">
					<ul v-for="(e,i) in editdata.after.invoiceList" :key="e.id">
						<li>开票信息{{i+1}}：</li>
						<li class="human">
							<p :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.invoiceCompanyName==editdata.before.invoiceList[i].invoiceCompanyName?false:true}">
								<span class="alignRight invoice"
									>开票单位名称：</span
								>{{ e?.invoiceCompanyName||'-' }}
							</p>
							<p :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.taxpayerRegistrationNumber==editdata.before.invoiceList[i].taxpayerRegistrationNumber?false:true}">
								<span class="alignRight invoice"
									>纳税人识别号：</span
								>{{ e?.taxpayerRegistrationNumber||'-' }}
							</p>
							<p :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.invoiceEmail==editdata.before.invoiceList[i].invoiceEmail?false:true}">
								<span class="alignRight invoice">邮箱：</span
								>{{ e?.invoiceEmail||'-' }}
							</p>
              <div style="display: flex;" :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.invoiceRegisteredAddress==editdata.before.invoiceList[i].invoiceRegisteredAddress?false:true}">
								<div class="alignRight invoice">注册地址：</div>
                <div style="flex: 1;">{{ e?.invoiceRegisteredAddress||'-' }}</div>
							</div>
							<p :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.invoicePhone==editdata.before.invoiceList[i].invoicePhone?false:true}">
								<span class="alignRight invoice"
									>联系电话：</span
								>{{ e?.invoicePhone||'-' }}
							</p>
              <div style="display: flex;" :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.invoiceDepositBank==editdata.before.invoiceList[i].invoiceDepositBank?false:true}">
								<div class="alignRight invoice">开户银行：</div>
                <div style="flex: 1;">{{ e?.invoiceDepositBank||'-' }}</div>
							</div>
							<p :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.invoiceBankAccount==editdata.before.invoiceList[i].invoiceBankAccount?false:true}">
								<span class="alignRight invoice"
									>开户账号：</span
								>{{ e?.invoiceBankAccount||'-' }}
							</p>
							<p :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.invoiceConsigneeName==editdata.before.invoiceList[i].invoiceConsigneeName?false:true}">
								<span class="alignRight invoice"
									>发票收货人：</span
								>{{ e?.invoiceConsigneeName||'-' }}
							</p>
							<p :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.invoiceConsigneePhone==editdata.before.invoiceList[i].invoiceConsigneePhone?false:true}">
								<span class="alignRight invoice"
									>收货人电话：</span
								>{{ e?.invoiceConsigneePhone||'-' }}
							</p>
              <p>
								<span 
                  :class="{alignRight:true,invoice:true,red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.province==editdata.before.invoiceList[i].province?false:true}"
									>省市区：</span
								>
                <span :class="{red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.province==editdata.before.invoiceList[i].province?false:true}"> {{ e?.province ||'-' }}</span>
                <span :class="{ml5:true,red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.city==editdata.before.invoiceList[i].city?false:true}"> {{ e?.city ||'-' }} </span>
                <span :class="{ml5:true,red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.district==editdata.before.invoiceList[i].district?false:true}"> {{ e?.district ||'-' }} </span>
							</p>
              <div :class="{textcon:true,red:editdata.before.invoiceList&&editdata.before.invoiceList[i]&&e.invoiceConsigneeAddress==editdata.before.invoiceList[i].invoiceConsigneeAddress?false:true}">
								<div class="alignRight invoice">发票收货地址：</div>
                <div style="flex: 1;">{{ e?.invoiceConsigneeAddress||'-' }}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
      <div>
      <h4 class="title">客户经营信息</h4>
			<p :class="{red:editdata.after.management.customerManagementType!=editdata.before.management.customerManagementType}">
				<span class="alignRight">客户经营类型：</span>
				
        <DictTag
            style="display: inline-block;"
            :value="
              editdata.after.management?.customerManagementType
            "
            :options="crm_customerbusinesstype"
          />
			</p>
			<!-- <p :class="{red:editdata.after.management.customerRegisteredCapital!=editdata.before.management.customerRegisteredCapital}">
				<span class="alignRight">客户注册资本：</span
				>{{ editdata.after.management?.customerRegisteredCapital||'-' }}
			</p> -->
			<p>
				<span class="alignRight">客户销售商品类别：</span>
        <span v-for="(item,index) in editdata.after.soldTypeList" :key="item.sortIndex">
          <DictTag
            style="display: inline-block;margin-right:10px;"
            :class="{red:editdata.before.soldTypeList[index]&&item.customerSoldType==editdata.before.soldTypeList[index].customerSoldType?false:true}"
            :value="
              item.customerSoldType
            "
            :options="crm_Categoryofgoodssoldbycustomers"
          />
        </span>
			</p>
			<p :class="{red:editdata.after.management.customerSoldBrand!=editdata.before.management.customerSoldBrand}">
				<span class="alignRight">客户销售商品品牌：</span
				>{{ editdata.after.management?.customerSoldBrand||'-' }}
			</p>
      <p :class="{red:editdata.after.management.previousYearSalesAmount!=editdata.before.management.previousYearSalesAmount}">
				<span class="alignRight">上年度销售额：</span
				>{{ showMoney(editdata.before.management?.previousYearSalesAmount)||'-' }}
			</p>
			<p :class="{red:editdata.after.management.industryBrandAwareness!=editdata.before.management.industryBrandAwareness}">
				<span class="alignRight">所在行业品牌知名度：</span
				>
        <DictTag
          v-if="editdata.after.management?.industryBrandAwareness"
          style="display: inline-block;"
          :value="
            editdata.after.management?.industryBrandAwareness
          "
          :options="crm_Brandawarenessintheindustry"
        />
        <template v-else>-</template>
			</p>
			<p :class="{red:editdata.after.management.areaBrandAwareness!=editdata.before.management.areaBrandAwareness}">
				<span class="alignRight">所在地域品牌知名度：</span
				>
        <DictTag
          v-if="editdata.after.management?.areaBrandAwareness"
          style="display: inline-block;"
          :value="
            editdata.after.management?.areaBrandAwareness
          "
          :options="crm_Brandawarenessintheindustry"
        />
        <template v-else>-</template>
			</p>

      <h4 class="title">其他风险</h4>


      <p v-if="editdata.before.baseInfo.moreSettlementMethodId!==undefined" :class="{red:editdata.after.baseInfo.moreSettlementMethodId!=editdata.before.baseInfo.moreSettlementMethodId}">
					<span class="alignRight">更多结算方式：</span>
          <settlementMethod
            v-if="editdata.after.baseInfo?.moreSettlementMethodId"
            :methodId="editdata.after.baseInfo?.moreSettlementMethodId"
            :methodList="risklist.more_settlement_method"
          />
          <span v-else>立结</span>
      </p>

      <p v-if="editdata.before.baseInfo.existLawsuitId!==undefined" :class="{red:editdata.after.baseInfo.existLawsuitId!=editdata.before.baseInfo.existLawsuitId}">
				<span class="alignRight">是否有诉讼：</span>
        <settlementMethod
          v-if="risklist?.more_settlement_method"
          :methodId="editdata.after.baseInfo?.existLawsuitId"
          :methodList="risklist.exist_lawsuit"
        />
			</p>

      <p v-if="editdata.before.baseInfo.establishedTimeId!==undefined" :class="{red:editdata.after.baseInfo.establishedTimeId!=editdata.before.baseInfo.establishedTimeId}">
				<span class="alignRight">成立时长：</span>
        <settlementMethod
          v-if="risklist?.more_settlement_method"
          :methodId="editdata.after.baseInfo?.establishedTimeId"
          :methodList="risklist.established_time"
        />
			</p>

      <p v-if="editdata.before.baseInfo.registeredCapitalId!==undefined" :class="{red:editdata.after.baseInfo.registeredCapitalId!=editdata.before.baseInfo.registeredCapitalId}">
				<span class="alignRight">注册资金：</span>
        <settlementMethod
          v-if="risklist?.more_settlement_method"
          :methodId="editdata.after.baseInfo?.registeredCapitalId"
          :methodList="risklist.registered_capital"
        />
			</p>

      <p v-if="editdata.before.baseInfo.staffSizeId!==undefined" :class="{red:editdata.after.baseInfo.staffSizeId!=editdata.before.baseInfo.staffSizeId}">
				<span class="alignRight">人员规模：</span>
        <settlementMethod
          v-if="risklist?.staff_size"
          :methodId="editdata.after.baseInfo?.staffSizeId"
          :methodList="risklist.staff_size"
        />
			</p>

      <p v-if="editdata.before.baseInfo.industryRankingId!==undefined" :class="{red:editdata.after.baseInfo.industryRankingId!=editdata.before.baseInfo.industryRankingId}">
				<span class="alignRight">行业排名：</span>
        <settlementMethod
          v-if="risklist?.industry_ranking"
          :methodId="editdata.after.baseInfo?.industryRankingId"
          :methodList="risklist.industry_ranking"
        />
			</p>

      <p v-if="editdata.before.baseInfo.customerCreditQuota!==undefined" :class="{red:editdata.after.baseInfo.customerCreditQuota!=editdata.before.baseInfo.customerCreditQuota}">
				<span class="alignRight">授信额度：</span>
        {{showMoney(editdata.after.baseInfo?.customerCreditQuota)??'-'}}
			</p>

      <div v-if="editdata.after.addressList&&editdata.after.addressList.length > 0">
				<h4 class="title">收货地址</h4>
				<div class="contactPerson">
					<ul v-for="(e,i) in editdata.after.addressList" :key="e.id">
						<li>收货地址{{i+1}}：</li>
						<li class="human">
							<p :class="{red:editdata.before.addressList&&editdata.before.addressList[i]&&e.consigneeName==editdata.before.addressList[i].consigneeName?false:true}">
								<span class="alignRight invoice"
									>收货人：</span
								>{{ e?.consigneeName||'-' }}
							</p>
							<p :class="{red:editdata.before.addressList&&editdata.before.addressList[i]&&e.consigneePhone==editdata.before.addressList[i].consigneePhone?false:true}">
								<span class="alignRight invoice"
									>联系电话：</span
								>{{ e?.consigneePhone||'-' }}
							</p>
              <p>
								<span 
                  :class="{alignRight:true,invoice:true,red:editdata.before.addressList&&editdata.before.addressList[i]&&e.province==editdata.before.addressList[i].province?false:true}"
									>省市区：</span
								>
                <span :class="{red:editdata.before.addressList&&editdata.before.addressList[i]&&e.province==editdata.before.addressList[i].province?false:true}"> {{ e?.province ||'-' }} </span>
                <span :class="{ml5:true,red:editdata.before.addressList&&editdata.before.addressList[i]&&e.city==editdata.before.addressList[i].city?false:true}"> {{ e?.city ||'-' }} </span>
                <span :class="{ml5:true,red:editdata.before.addressList&&editdata.before.addressList[i]&&e.district==editdata.before.addressList[i].district?false:true}"> {{ e?.district ||'-' }} </span>
							</p>
							<div class="textcon" :class="{red:editdata.before.addressList&&editdata.before.addressList[i]&&e.consigneeAddress==editdata.before.addressList[i].consigneeAddress?false:true}">
								<div class="alignRight invoice">收货详细地址：</div>
                <div style="flex: 1;">{{ e?.consigneeAddress||'-' }}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>

     

		</div>

    </div>
    <!-- </template>
    <template #footer> -->
    <!-- <div style="position: fixed;bottom: 0;background:#fff;width:58%;height:45px;padding-top:7px;" v-if="dranum===2">
      <el-button @click="confirmClick(false)">退回</el-button>
      <el-button type="primary" @click="confirmClick(true)">审核通过</el-button>
    </div> -->
    <!-- </template> -->
    <!-- </el-drawer> -->
  </div>
  <el-dialog v-model="dialogFormVisible" title="联系人">
    <div v-for="(item, index) in isinfo" :key="item.name" class="contactsbox">
      <p>
        收货地址{{ index + 1
        }}<Edit
          v-if="item.complete && editstatus"
          style="width: 2em; height: 1.2em; margin-right: 8px; float: right"
          @click="dialogedit(item)"
        />
      </p>
      <el-form-item
        :label="citem.name + '：'"
        v-for="citem in item.con"
        :key="citem.name"
      >
        <template v-if="item.edit">
          <el-input
            v-model="citem.value"
            :maxlength="citem.max"
            show-word-limit
            type="text"
            :placeholder="citem.tips"
          />
        </template>
        <template v-else>
          {{ citem.value }}
        </template>
      </el-form-item>
      <span class="dialog-footer" v-if="item.edit">
        <el-button @click="submitcons(1, item)">取消</el-button>
        <el-button type="primary" @click="submitcons(2, item)">
          确定
        </el-button>
      </span>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="addcons"> 新建地址 </el-button>
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
import { BASE_FILE_URL } from '@/store/global-constant'
import { validateForms, checkPhone, debounce } from "@/utils/form";
import { onMounted, onUnmounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { setcustomerapply, GetCustomer,SetCustomer,gradingCalculateConfig } from "@/api/orderManagement/customer/index";
import settlementMethod from '@/components/settlementMethod/index.vue'
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
  cancelClick:{
    type:Function
  }
  // isRoles: {
  // 	type: Boolean,
  // 	default: false,
  // },
});
// 接收父组件传来的方法
const emits = defineEmits(["cancelClick"]);
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
    con: [
      { name: "联系人", value: "", tips: "请输入联系人名称", max: 50 },
      { name: "联系电话", value: "", tips: "请输入联系电话", max: 11 },
      { name: "联系地址", value: "", tips: "请输入联系地址", max: 50 },
      { name: "联系邮编", value: "", tips: "请输入联系邮编", max: 50 },
    ],
  },
]);
let Invoicing = ref([
  {
    edit: true,
    complete: false,
    con: [
      { name: "开票单位名称", value: "", tips: "请输入联系人名称", max: 50 },
      { name: "纳税人识别号", value: "", tips: "请输入联系电话", max: 11 },
      { name: "邮箱", value: "", tips: "请输入联系地址", max: 50 },
      { name: "注册地址", value: "", tips: "请输入联系邮编", max: 50 },
      { name: "联系电话", value: "", tips: "请输入联系电话", max: 50 },
      { name: "开户银行", value: "", tips: "请输入开户银行", max: 50 },
      { name: "开户账号", value: "", tips: "请输入开户账号", max: 50 },
      { name: "发票收货人", value: "", tips: "请输入发票收货人", max: 50 },
      { name: "收货人电话", value: "", tips: "请输入收货人电话", max: 50 },
      { name: "发票收货地址", value: "", tips: "请输入发票收货地址", max: 50 },
    ],
  },
]);
let addressinfo = ref([
  {
    edit: true,
    complete: false,
    con: [
      { name: "联系人", value: "", tips: "请输入联系人名称", max: 50 },
      { name: "联系电话", value: "", tips: "请输入联系电话", max: 11 },
      { name: "收货地址", value: "", tips: "请输入收货地址", max: 50 },
    ],
  },
]);
const orderType = reactive({
  orderTitle: "",
  type: null,
  addreeTxt: "",
  invoiceName: "",
  customerList: [],
  crmInvoiceConfigList: [], //查询开票主体信息
  saleList: [],
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
const ruleForm = reactive({
  customerName: "",
  customerId: "", //客户id
  licenseImageUrl: "", //设计服务合同url
  unifiedSocialCreditCode: "", //统一社会信用代码
  customerIdNumber: "",
  designServiceContractName: "", //设计服务合同名称
  designFileUrl: "", //设计文件
  enterpriseNature: "", //企业性质
  quantity: "", //数量
  designServiceTaxInclusiveFee: "", //设计服务费(含税)
  customerMaintenanceCostLimit: "", //维护费用
  invoiceType: "", //开票类型
  invoiceEntity: "", //开票主体
  invoiceEntityList: "", //选择开票主体后获取开票类型
  designRequirementRtf: "", //需求说明
  designRequirementAttachment: "", //需求附件
  businessStaffName: "", //业务员
  businessStaffId: "", //业务员id
  customerNumber: "", //客户编号
  moreSettlementMethodId: "", //结算方式
  customerSettlementMethod: "", //根据选择客户获取动态结算方式
});
const riskForm = reactive({
  financialRisk: "",
  legalRisk: "",
});
const risklist=ref("")
const managementForm = reactive({
  customerManagementType: "",
  customerRegisteredCapital: "",
  customerSoldType: [],
  customerSoldBrand: "",
  industryBrandAwareness: "",
  areaBrandAwareness: "",
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
  customerName: [
    {
      required: true,
      message: "请输入客户名称",
      trigger: "blur",
    },
  ],
  moreSettlementMethodId: [
    {
      required: true,
      message: "请选择结算方式",
      trigger: "change",
    },
  ],
  licenseImageUrl: [
    {
      required: true,
      message: "请上传设计服务合同文件",
      trigger: "change",
    },
  ],
  unifiedSocialCreditCode: [
    {
      required: true,
      message: "请输入统一社会信用代码",
      trigger: "blur",
    },
  ],
  designFileUrl: [
    {
      required: true,
      message: "请上传设计文件",
      trigger: "change",
    },
  ],
  enterpriseNature: [
    {
      required: true,
      message: "请选择品类",
      trigger: "change",
    },
  ],
  quantity: [
    {
      required: true,
      // message: '请输入打样数量',
      validator: validateNumber,
      trigger: "blur",
    },
    { type: "number", message: "请输入数字" },
  ],
  designServiceTaxInclusiveFee: [
    {
      required: true,
      // message: '请输入设计服务费（含税）',
      validator: validateMoney1,

      trigger: "change",
    },
    // { type: 'number', message: '请输入数字' },
  ],
  customerMaintenanceCostLimit: [
    {
      required: true,
      // message: '维护费用',
      validator: validateMoney,

      trigger: "change",
    },
    // { type: 'number', message: '请输入数字' },
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
      required: true,
      message: "请选择开票主体",
      trigger: "change",
    },
  ],
  designRequirementRtf: [
    {
      required: true,
      message: "请输入设计需求",
      trigger: "blur",
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
    // { type: 'number', message: '请输入数字' },
  ],
  consigneeAddress: [
    {
      required: true,
      message: "请输入收货地址",
      trigger: "blur",
    },
  ],
});

// const { crmInvoiceConfigList } = toRefs(ruleForm)
const { crmInvoiceConfigList, customerList, saleList, invoiceName } =
  toRefs(orderType);
// 判断为业务员时，给参数赋值
// const isCustomer = () => {
// 	if (props.isRoles) {
// 		ruleForm.businessStaffId = saleList.value[0].userId
// 		ruleForm.businessStaffName = saleList.value[0].nickName
// 		addressForm.businessStaffId = saleList.value[0].userId
// 		addressForm.businessStaffName = saleList.value[0].nickName
// 	}
// }
// watch(isTable, (val) => {
// saleList.value = props.salesmanList
// isCustomer()
// console.log('orderType.saleList----', orderType.saleList)
// })
const setdata = () =>{
  
}
const initdata = () => {
  
     
};
const submitcons = (is, item) => {
  let leng = true;
  item.con.forEach((e) => {
    if (!e.value) {
      leng = false;
      return;
    }
  });
  if (leng) {
    item.edit = false;
    item.complete = true;
  } else {
    return;
  }
  if (is === 1) {
    console.log(is);
  } else {
    if (isnum.value == 1) {
      contacts.value = JSON.parse(JSON.stringify(isinfo.value));
      // console.log("isnum", isnum);
    } else if (isnum.value == 2) {
      Invoicing.value = JSON.parse(JSON.stringify(isinfo.value));
    } else {
      addressinfo.value = JSON.parse(JSON.stringify(isinfo.value));
    }
    // console.log("contacts", contacts.value);
  }

  editstatus.value = true;
  // console.log("item", leng);
};
const addcons = () => {
  if (!isinfo.value[isinfo.value.length - 1].complete) return;
  if (isnum.value == 1) {
    isinfo.value.push({
      edit: true,
      complete: false,
      con: [
        { name: "联系人", value: "", tips: "请输入联系人名称", max: 50 },
        { name: "联系电话", value: "", tips: "请输入联系电话", max: 11 },
        { name: "联系地址", value: "", tips: "请输入联系地址", max: 50 },
        { name: "联系邮编", value: "", tips: "请输入联系邮编", max: 50 },
      ],
    });
  } else if (isnum.value == 2) {
    isinfo.value.push({
      edit: true,
      complete: false,
      con: [
        { name: "开票单位名称", value: "", tips: "请输入联系人名称", max: 50 },
        { name: "纳税人识别号", value: "", tips: "请输入联系电话", max: 11 },
        { name: "邮箱", value: "", tips: "请输入联系地址", max: 50 },
        { name: "注册地址", value: "", tips: "请输入联系邮编", max: 50 },
        { name: "联系电话", value: "", tips: "请输入联系电话", max: 50 },
        { name: "开户银行", value: "", tips: "请输入开户银行", max: 50 },
        { name: "开户账号", value: "", tips: "请输入开户账号", max: 50 },
        { name: "发票收货人", value: "", tips: "请输入发票收货人", max: 50 },
        { name: "收货人电话", value: "", tips: "请输入收货人电话", max: 50 },
        {
          name: "发票收货地址",
          value: "",
          tips: "请输入发票收货地址",
          max: 50,
        },
      ],
    });
  } else {
    isinfo.value.push({
      edit: true,
      complete: false,
      con: [
        { name: "联系人", value: "", tips: "请输入联系人名称", max: 50 },
        { name: "联系电话", value: "", tips: "请输入联系电话", max: 11 },
        { name: "收货地址", value: "", tips: "请输入收货地址", max: 50 },
      ],
    });
  }
};
const getSalesman = (nickName, userId, type) => {
  if (type == 1) {
    ruleForm.businessStaffId = userId;
    ruleForm.businessStaffName = nickName;
  } else {
    riskForm.businessStaffId = userId;
    riskForm.businessStaffName = nickName;
  }
};
// 分页查询客户基础信息的传参
const baseParms = reactive({
  size: 4,
  current: 1,
});
const isMounted = ref(false);
let timer = null;
onMounted(() => {
  gradingCalculateConfig().then(res=>{
    // console.log('res',res);
    risklist.value=res.data
  })
  
});
onUnmounted(() => {
  clearTimeout(timer);
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

// 分页查询客户基础信息
const customerBaseInfoFn = () => {
	customerBaseInfo(baseParms)
		.then((res) => {
			customerList.value.push(...res.data.records)
		})
		.catch((err) => {
			console.log(err)
		})
}
customerBaseInfoFn()
// 查询开票主体
// const crmInvoiceConfigFn = () => {
// 	crmInvoiceConfig().then((res) => {
// console.log('开票主体数据--', res)
// crmInvoiceConfigList.value = res.data
// 	})
// }
// crmInvoiceConfigFn()
// 封装返回开票类型
const invoiceTypeName = (type) => {
  let invoiceName = crm_invoice_type.value.find((item) => item.value == type);
  // console.log("22222222",crm_invoice_type.value);
  // console.log("invoiceName---",invoiceName);
  return invoiceName.label;
};

const changeInvoiceEntity = (val) => {
  let invoiceItem = crmInvoiceConfigList.value.find(
    (item) => item.invoiceEntity == val
  );
  ruleForm.invoiceEntityList = invoiceItem.invoiceTypeList;
  ruleForm.invoiceType = invoiceItem.invoiceTypeList[0].invoiceType;
  // console.log('ruleForm.invoiceEntityList',ruleForm.invoiceEntityList);
  // console.log('ruleForm.invoiceType',ruleForm.invoiceType);
};
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
};
// 获取路径的名字
const fileName = (url) => {
  if (url) {
    let urlList = url.split("/");
    return urlList[urlList.length - 1].replace("filemanage", "");
  }
};

// 新增方案设计订单
const crmProjectDesignOrderProcFn = () => {
  ruleForm.designServiceContractName = fileName(ruleForm.licenseImageUrl);
  // 删除对象不需要传值的属性customerList,designFileUrl
  delete ruleForm.designFileUrl;
  delete ruleForm.invoiceEntityList;
  delete ruleForm.customerSettlementMethod;

  const objTarget = Object.assign({ ...riskForm }, ruleForm);
  // console.log("ruleForm---",ruleForm);
  // console.log("objTarget---",objTarget);
  crmProjectDesignOrderProc(objTarget)
    .then((res) => {
      if (res.code == 200) {
        // isTable.value = false
        // emits("crmOrderProcView", 1);
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
const dialogedit = (item) => {
  item.edit = true;
  editstatus.value = false;
  console.log("2", editstatus);
};
// 新增大货订单
const crmBulkOrderProcFn = () => {
  // 删除对象不需要传值的属性customerList,
  delete ruleForm.designServiceTaxInclusiveFee;
  delete ruleForm.designRequirementRtf;
  delete ruleForm.designRequirementAttachment;
  delete ruleForm.licenseImageUrl;
  delete ruleForm.designServiceContractName;
  delete ruleForm.invoiceEntityList;
  delete ruleForm.unifiedSocialCreditCode;
  delete ruleForm.customerSettlementMethod;
  delete ruleForm.customerMaintenanceCostLimit;
  const objTarget = Object.assign({ ...ruleForm }, riskForm);
  // console.log('ruleForm---', ruleForm)
  // console.log('objTarget---', objTarget)
  crmBulkOrderProc(objTarget)
    .then((res) => {
      // console.log('crmBulkOrderProc-----', res)
      if (res.code == 200) {
        // isTable.value = false
        // emits("crmOrderProcView", 1);
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
  ruleForm.designServiceContractName = fileName(ruleForm.licenseImageUrl);
  // 删除对象不需要传值的属性
  delete ruleForm.designFileUrl;
  delete ruleForm.crmInvoiceConfigList;
  delete ruleForm.invoiceEntityList;
  delete ruleForm.customerSettlementMethod;
  const objTarget = Object.assign({ ...riskForm }, ruleForm);
  // console.log('ruleForm---', ruleForm)
  // console.log('objTarget---', objTarget)
  crmBulkDesignProdOrderProc(objTarget)
    .then((res) => {
      // console.log('crmBulkDesignProdOrderProc---', res)
      if (res.code == 200) {
        // isTable.value = false
        // emits("crmOrderProcView", 1);
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
  ruleForm.customerSettlementMethod = moreSettlementMethodId;
  // console.log("ruleForm.customerSettlementMethod-",ruleForm.customerSettlementMethod);
};
// 取消按钮
const cancelClick = () => {
  isTable.value = false;
  if (!ruleFormRef.value || !addressFormRef.value) return;
  ruleFormRef.value.resetFields();
  addressFormRef.value.resetFields();
  addressForm.businessStaffId = "";
  ruleForm.businessStaffId = "";
  ruleForm.designRequirementAttachment = "";

  // console.log("addressFormRef--",addressForm);
};
// 生成订单按钮
const confirmClick = (flag) => {
  // console.log('ruleForm.----', ruleForm)
  // crmBulkDesignProdOrderProcFn()
  // console.log('fff',flag);
  submitForm(flag);
};
const demofn = ()=>{
  console.log('ohh');
}
const submitForm = debounce(async (flag) => {
  // let formRefs = [ruleFormRef.value, addressFormRef.value];
    setcustomerapply({
      flag: flag,
      id: props.editdata.id
    })
    .then((res) => {
      console.log(res);
    emits("cancelClick");
      if(res.code===200){
        emits("cancelClick");
        ElMessage({
          message: "成功",
          type: "success",
        });
      }
      // else{
      //   ElMessage({
      //     message: '失败',
      //     type: "error",
      //   });
      // }
      
    })
    .catch((err) => {
      console.log(err);
      // ElMessage({
      //   message: err,
      //   type: "error",
      // });
    });
  
}, 100);

//暴露给父组件的方法控制显示与隐藏
// const dialogShow = (type, order) => {
// 	isTable.value = type
// 	if (order == 1) {
// 		orderType.orderTitle = '新建方案设计订单'
// 		orderType.type = 1
// 		orderType.addreeTxt = '（用于样品的收货地址）'
// 	} else if (order == 2) {
// 		orderType.orderTitle = '新建大货订单'
// 		orderType.type = 2
// 		orderType.addreeTxt = '（用于样品、大货的收货地址）'
// 	} else {
// 		orderType.orderTitle = '新建大货设计生产订单'
// 		orderType.type = 3
// 		orderType.addreeTxt = '（用于样品、大货的收货地址）'
// 	}
// }

defineExpose({
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
.lookDetail{
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
	width: 165px;
	text-align: right;
	margin-bottom: 10px;
}
.widthRight {
	width: 80px;
	margin-bottom: 0;
}
.human {
	width: 400px;
	margin: 10px;
	padding: 10px;
	padding-bottom: 0;
}
.contactPerson {
  max-width: 610px;
  height: 341px;
	display: flex;
	margin-right: 30px;
	overflow: auto;
	background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 10px;
}
.invoice {
	width: 120px;
}
.laypage {
	display: flex;
	justify-content: right;
	margin-top: 20px;
}
.red{
  color: red;
}
.ml10{
  margin: 5px;
}
.textcon{
  display: flex;
  word-break: break-all
}
</style>

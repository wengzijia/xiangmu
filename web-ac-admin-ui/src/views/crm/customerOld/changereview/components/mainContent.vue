<template>
	<el-card style="margin: 10px">
		<!-- 基本信息 -->
		<div v-show="tabType == '1'">
			<!-- 基础信息 -->
			<div>
				<h4 class="title">基础信息</h4>
				<p>
					<span class="alignRight">客户证照图像：</span>
					<img
						v-if="baseInfo"
						style="width: 64px; height: 64px; background: #ddd"
						:src="BASE_FILE_URL + baseInfo.licenseImageUrl"
						alt=""
					/>
				</p>
				<p>
					<span class="alignRight">客户名称：</span
					>{{ baseInfo.customerName }}
				</p>
				<p>
					<span class="alignRight">统一社会信用代码：</span
					>{{ baseInfo.unifiedSocialCreditCode }}
				</p>
				<p>
					<span class="alignRight">客户身份证号码：</span
					>{{ baseInfo.customerIdNumber }}
				</p>
				<p>
					<span class="alignRight">客户企业性质：</span
					>{{ baseInfo.enterpriseNature }}
				</p>
				<p>
					<span class="alignRight">客户维护费用额度：</span
					>{{ baseInfo.customerMaintenanceCostLimit }}元
				</p>
			</div>
			<!-- 联系人 -->
			<div v-if="contactsList.length > 0">
				<h4 class="title">联系人</h4>
				<div class="contactPerson">
					<ul v-for="item in contactsList" :key="item.id">
						<li>联系人一：</li>
						<li class="human">
							<p>
								<span class="alignRight widthRight"
									>联系人：</span
								>{{ item.contactsName }}
							</p>
							<p>
								<span class="alignRight widthRight"
									>联系电话：</span
								>{{ item.contactsPhone }}
							</p>
							<p>
								<span class="alignRight widthRight"
									>联系地址：</span
								>{{ item.contactsAddress }}
							</p>
							<p>
								<span class="alignRight widthRight"
									>联系邮箱：</span
								>{{ item.contactsPostcode }}
							</p>
						</li>
					</ul>
				</div>
			</div>
			<!-- 开票信息 -->
			<div v-if="invoiceList.length > 0">
				<h4 class="title">开票信息</h4>
				<div class="contactPerson">
					<ul v-for="e in invoiceList" :key="e.id">
						<li>开票信息一：</li>
						<li class="human">
							<p>
								<span class="alignRight invoice"
									>开票单位名称：</span
								>{{ e.invoiceCompanyName }}
							</p>
							<p>
								<span class="alignRight invoice"
									>纳税人识别号：</span
								>{{ e.taxpayerRegistrationNumber }}
							</p>
							<p>
								<span class="alignRight invoice">邮箱：</span
								>{{ e.invoiceEmail }}
							</p>
							<p>
								<span class="alignRight invoice"
									>注册地址：</span
								>{{ e.invoiceRegisteredAddress }}
							</p>
							<p>
								<span class="alignRight invoice"
									>联系电话：</span
								>{{ e.invoicePhone }}
							</p>
							<p>
								<span class="alignRight invoice"
									>开户银行：</span
								>{{ e.invoiceDepositBank }}
							</p>
							<p>
								<span class="alignRight invoice"
									>开户账号：</span
								>{{ e.invoiceBankAccount }}
							</p>
							<p>
								<span class="alignRight invoice"
									>发票收货人：</span
								>{{ e.invoiceConsigneeName }}
							</p>
							<p>
								<span class="alignRight invoice"
									>收货人电话：</span
								>{{ e.invoiceConsigneePhone }}
							</p>
							<p>
								<span class="alignRight invoice"
									>发票收货地址：</span
								>{{ e.invoiceConsigneeAddress }}
							</p>
						</li>
					</ul>
				</div>
			</div>
			<!-- 收货地址 -->
			<div v-if="addressList.length > 0">
				<h4 class="title">收货地址</h4>
				<div class="contactPerson">
					<ul v-for="val in addressList" :key="val.id">
						<li>收货地址一：</li>
						<li class="human">
							<p>
								<span class="alignRight widthRight"
									>收货人：</span
								>{{ val.consigneeName }}
							</p>
							<p>
								<span class="alignRight widthRight"
									>联系电话：</span
								>{{ val.consigneePhone }}
							</p>
							<p>
								<span class="alignRight widthRight"
									>收货地址;</span
								>{{ val.consigneeAddress }}
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!-- 客户经营信息 -->
		<div v-show="tabType == '2'">
			<p>
				<span class="alignRight">客户经营类型：</span>
				{{ management.customerManagementType }}
			</p>
			<!-- <p>
				<span class="alignRight">客户注册资本：</span
				>{{ management.customerRegisteredCapital }}
			</p> -->
			<p>
				<span class="alignRight">客户销售商品类别：</span
				>{{ management.customerManagementType }}
			</p>
			<p>
				<span class="alignRight">客户销售商品品牌：</span
				>{{ management.customerSoldBrand }}
			</p>
			<p>
				<span class="alignRight">所在行业品牌知名度：</span
				>{{ management.industryBrandAwareness }}
			</p>
			<p>
				<span class="alignRight">所在地域品牌知名度：</span
				>{{ management.areaBrandAwareness }}
			</p>
		</div>
		<!-- 风险信息 -->
		<div v-show="tabType == '3'">
			<h4 class="title">账期信用风险</h4>
			<p>
				<span class="alignRight">按期回款单数/占比：</span>
				{{
					statisticsInfo.scheduleSettlementNumber /
					statisticsInfo.scheduleSettlementRatio
				}}
				（{{
					(statisticsInfo.scheduleSettlementNumber /
						statisticsInfo.scheduleSettlementRatio) *
					100
				}}%）
			</p>
			<p>
				<span class="alignRight">3个月内回款/占比：</span
				>{{
					statisticsInfo.withinThreeMonthsSettlementNumber /
					statisticsInfo.withinThreeMonthsSettlementRatio
				}}
				（{{
					(statisticsInfo.withinThreeMonthsSettlementNumber /
						statisticsInfo.withinThreeMonthsSettlementRatio) *
					100
				}}%）
			</p>
			<p>
				<span class="alignRight">3至6个月回款/占比：</span
				>{{
					statisticsInfo.threeToSixMonthsSettlementNumber /
					statisticsInfo.threeToSixMonthsSettlementRatio
				}}（{{
					(statisticsInfo.threeToSixMonthsSettlementNumber /
						statisticsInfo.threeToSixMonthsSettlementRatio) *
					100
				}}%）
			</p>
			<p>
				<span class="alignRight">6个月以上回款/占比：</span
				>{{
					statisticsInfo.moreThanSixMonthsSettlementNumber /
					statisticsInfo.moreThanSixMonthsSettlementRatio
				}}（{{
					(statisticsInfo.moreThanSixMonthsSettlementNumber /
						statisticsInfo.moreThanSixMonthsSettlementRatio) *
					100
				}}%）
			</p>
			<h4 class="title">其他风险</h4>
			<p>
				<span class="alignRight">是否存在财务风险：</span
				>{{ baseInfo.financialRisk ? '是' : '否' }}
			</p>
			<p>
				<span class="alignRight">是否存在法务风险：</span
				>{{ baseInfo.legalRisk ? '是' : '否' }}
			</p>
		</div>
		<!-- 客户交易记录 -->
		<div v-show="tabType == '4'">
			<h4 class="title">合计</h4>
			<p>
				<span class="alignRight">订单平均订单金额：</span
				>{{ statisticsInfo.averageOrderAmount }}
			</p>
			<p>
				<span class="alignRight">订单平均利润率：</span
				>{{ statisticsInfo.averageOrdreProfitRatio }}
			</p>
			<p>
				<span class="alignRight">订单平均利润额：</span
				>{{ statisticsInfo.averageOrdreProfit }}
			</p>
			<h4 class="title">订单</h4>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="date" label="订单编号" width="180" />
				<el-table-column prop="name" label="订单类型" width="180" />
				<el-table-column prop="address" label="订单品类" />
				<el-table-column prop="address" label="订单金额" />
				<el-table-column prop="address" label="利润率" />
				<el-table-column prop="address" label="利润金额" />
				<el-table-column prop="address" label="订单状态" />
				<el-table-column prop="address" label="成单业务员" />
				<el-table-column fixed="right" label="操作" width="100">
					<template #default="scope">
						<el-link
							type="primary"
							:underline="false"
							@click="gotoDetail(scope.row.id)"
							>查看详情</el-link
						>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<div class="laypage">
				<el-pagination
					v-model:currentPage="formData.current"
					v-model:page-size="formData.size"
					:page-sizes="[10, 20, 50, 100]"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				/>
			</div>
		</div>
	</el-card>
</template>

<script setup>
// 域名
import { BASE_FILE_URL } from '@/store/global-constant'
const { proxy } = getCurrentInstance()
const { crm_payment_type } = proxy.useDict('crm_payment_type')
const prop = defineProps({
	tabType: {
		type: String,
		default: '',
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
})
const data = reactive({
	tableData: [
		{
			date: '2016-05-03',
			name: 'Tom',
			address: 'No. 189, Grove St, Los Angeles',
		},
		{
			date: '2016-05-02',
			name: 'Tom',
			address: 'No. 189, Grove St, Los Angeles',
		},
		{
			date: '2016-05-04',
			name: 'Tom',
			address: 'No. 189, Grove St, Los Angeles',
		},
		{
			date: '2016-05-01',
			name: 'Tom',
			address: 'No. 189, Grove St, Los Angeles',
		},
	],
	total: 0,
	formData: {
		size: 10, //单页显示多少条数据
		current: 1, //当前页数
	},
})
const { tableData, formData, total } = toRefs(data)
/**
 * 查看详情
 **/
const gotoDetail = (id) => {
	console.log('查看详情', id)
}
</script>

<style scoped>
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
	background: #f9f9f9;
	width: 400px;
	border: 1px solid #aaa;
	border-radius: 6px;
	margin: 10px;
	padding: 10px;
	padding-bottom: 0;
}
.contactPerson {
	display: flex;
	margin-right: 30px;
	overflow: auto;
}
.invoice {
	width: 110px;
}
.laypage {
	display: flex;
	justify-content: right;
	margin-top: 20px;
}
</style>

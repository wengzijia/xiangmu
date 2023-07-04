<template>
	<div class="proofingContent">
		<el-card style="padding: 0 10px">
			<h4 style="font-size: 20px; position: relative">
				<span>订单编号：</span>{{ orderDetail.businessKey }}
				<div v-if="orderDetail.procStatus=='2'" class="suppContract">
					<span>已交付</span>
				</div>
				<div v-else class="suppContract">
					<span v-for="item in procList" :key="item.id" v-show="stateType == item.value">{{ item.label }}</span>
					<!-- <img src="" alt="" /> -->
				</div>
			</h4>
			<ul class="userInfo">
				<li>
					<p>数量：</p>
					<p class="wordsWeight">
						{{
							orderDetail.categoryQuantity
								? orderDetail.categoryQuantity
								: '-'
						}}
					</p>
				</li>
				<li>
					<p>平均成本单价：</p>
					<p class="wordsWeight">
						{{
							orderDetail?.statisticsInfo?.costUnitPrice
								? showMoney(orderDetail?.statisticsInfo?.costUnitPrice) + '元'
								: '-'
						}}
					</p>
				</li>
				<li>
					<p>成本总价：</p>
					<p class="wordsWeight">
						{{
							orderDetail?.statisticsInfo?.taxInclusiveCost
								? showMoney(orderDetail?.statisticsInfo?.taxInclusiveCost) + '元'
								: '-'
						}}
					</p>
				</li>
				<li>
					<p>订单总价：</p>
					<p class="wordsWeight">
						{{
							orderDetail.orderTotalPrice
								? showMoney(orderDetail.orderTotalPrice) + '元'
								: '-'
						}}
					</p>
				</li>
				<li>
					<p>利润率：</p>
					<p class="wordsWeight">
						{{ (orderDetail?.statisticsInfo?.orderProfitRatio||orderDetail?.statisticsInfo?.orderProfitRatio===0) ? (orderDetail?.statisticsInfo?.orderProfitRatio*100).toFixed(2)+'%' : '-' }}
					</p>
				</li>
			</ul>
		</el-card>
		<!-- 客户信息 -->
		<el-card class="box-card">
			<template #header>
				<span style="margin-left: 10px; font-size: 16px">客户信息</span>
			</template>
			<ul class="customerInfo">
				<li>
					<p>
						<span class="rightTxt">客户编号：</span>
						<el-link type="primary" :underline="false" @click="gotoCustomerDetail">{{orderDetail.customerNumber}}</el-link>
						<!-- <span>{{ orderDetail.customerNumber }}</span> -->
					</p>
					<p>
						<span class="rightTxt">客户联系人：</span>
						<span>{{
							contactsList?.length && contactsList[0].contactsName
								? contactsList[0].contactsName
								: '-'
						}}</span>
					</p>
				</li>
				<li>
					<p>
						<span class="rightTxt">客户名称：</span>
						<span>{{ orderDetail.customerName }}</span>
					</p>
					<p>
						<span class="rightTxt">客户联系电话：</span>
						<span>{{
							contactsList?.length && contactsList[0].contactsPhone
								? contactsList[0].contactsPhone
								: '-'
						}}</span>
					</p>
				</li>
				<li>
					<p>
						<span class="rightTxt">客户级别：</span>
						<span>{{
							 baseInfo?.customerGrading||'-'
						}}</span>
					</p>
				</li>
			</ul>
		</el-card>
		<!-- 订单详情 -->
		<el-card class="box-card">
			<template #header>
				<span style="margin-left: 10px; font-size: 16px">订单详情</span>
			</template>
			<ul class="customerInfo">
				<li>
					<div class="categoryType">
						<span class="rightTxt">订单品类：</span>
						<div v-if="route.query.procType=='project_design_order'">
							<p
								v-for="item in orderDetail.categoryList"
								:key="item.id"
							>
								{{ item.goodsName }} （打样数量：{{
									item.proofingQuantity
								}}）
							</p>
						</div>
						<div v-else>
							<p
								v-for="item in orderDetail.categoryList"
								:key="item.id"
							>
								{{ item.goodsName }} （大货生产数量：{{
									item.bulkProdQuantity
								}}）
							</p>
						</div>
					</div>
					<!-- <div style="display: flex">
						<span class="rightTxt">结算方式：</span>
						<span>
							<settlementMethod
								:methodId="orderDetail.settlementMethod"
                :methodList="methodList"
							/>
						</span>
					</div> -->
				</li>
				<li>
					<p style="display: flex">
						<span class="rightTxt">订单类型：</span>
						<span
							><DictText
								:value="orderDetail.procType"
								dict="crm_order_type"
						/></span>
					</p>
				</li>
				<li>
					<p>
						<span class="rightTxt">业务员：</span>
						<span>{{ orderDetail.businessStaffName }}</span>
					</p>
				</li>
			</ul>
		</el-card>
		<!-- 发票 -->
		<el-card class="box-card" v-if="orderDetail.invoiceType!=4">
			<template #header>
				<div class="cardHeader">
					<span style="margin-left: 10px; font-size: 16px">发票</span>
					<!-- <span class="icon"
						><el-icon style="margin-right: 6px"
							><WarningFilled /></el-icon
						>订单开票需要客户确认认可账单后才能申请开票</span
					> -->
				</div>
			</template>
			<div class="invoice-total">
				<h4 style="font-weight: 700">已开票金额：<span>{{showMoney(orderDetail.invoiceRecord?.finishInvoiceAmount)}}</span>元</h4>
				<h4 style="font-weight: 700">未申请开票金额：<span>{{showMoney(orderDetail.invoiceRecord?.notApplyInvoiceAmount)}}</span>元</h4>
				<h4 style="font-weight: 700">已申请开票金额：<span>{{showMoney(orderDetail.invoiceRecord?.waitInvoiceAmount)}}</span>元</h4>
			</div>
			<el-table :data="orderDetail.invoiceRecord?.invoiceList" style="width: 100%" scrollbar-always-on>
				<el-table-column label="开票申请单编号" prop="businessKey"></el-table-column>
				<el-table-column label="订单开票金额" prop="orderTaxInclusiveTotalPrice">
					<template #default="scope">
						<div style="text-align: right;">{{ showMoney(scope.row.orderTaxInclusiveTotalPrice) }}</div>
					</template>
				</el-table-column>
				<el-table-column label="开票状态" prop="invoiceStatus">
					<template #default="scope">
						<!-- <DictText
								:value="scope.row.invoiceStatus"
								dict="crm_invoice_status"
							/> -->
						<DictTag :value="scope.row.invoiceStatus" :options="crm_invoice_status" />
					</template>
				</el-table-column>
				<el-table-column label="开票类型" prop="invoiceType">
					<template #default="scope">
						<DictText
								:value="scope.row.invoiceType"
								dict="crm_invoice_type"
							/>
							<span v-if="!scope.row.invoiceType">-</span>
					</template>
				</el-table-column>
				<el-table-column label="开票主体" prop="invoiceEntity"></el-table-column>
				<el-table-column label="凭证/物流单号" prop="invoiceUrl/logisticsNumber">
					<template #default="scope">
						<span v-if="scope.row?.invoiceUrl">
							<span v-if="scope.row?.invoiceName">{{ scope.row?.invoiceName }}<singDownFile :url="scope.row?.invoiceUrl" view style="margin-left: 6px;"/></span>
							<span v-else>
								<el-link :underline="false" type="primary" @click="showFile(scope.row?.invoiceUrl)">查看</el-link>
							</span>
						</span>
						<span v-else>{{ scope.row?.logisticsNumber }}</span>
					</template>
				</el-table-column>
			</el-table>
			<!-- <h4 style="font-weight: 700">开票状态</h4>
			<ul class="customerInfo">
				<li>
					<p style="display: flex">
						<span class="rightTxt">开票状态：</span>
						<div>
							<DictText
								:value="orderDetail.invoiceStatus"
								dict="crm_invoice_status"
							/>
						</div>
					</p>

					<p>
						<span class="rightTxt">发票：</span>
						<span v-if="orderDetail.invoiceRecord&&(orderDetail.invoiceRecord?.logisticsNumber||orderDetail.invoiceRecord?.invoiceUrl)">
							{{ orderDetail.invoiceRecord?.logisticsNumber ||  getFileName(orderDetail.invoiceRecord?.invoiceUrl)}}
							<span v-if="orderDetail.invoiceRecord?.invoiceUrl"><singDownFile :url="orderDetail.invoiceRecord?.invoiceUrl" view/></span>
						</span>
						<span v-else>-</span>
					</p>
				</li>
				<li>
					<p style="display: flex">
						<span class="rightTxt">开票类型：</span>
						<div>
							<DictText
								:value="orderDetail.invoiceType"
								dict="crm_invoice_type"
							/>
						</div>
					</p>
				</li>
				<li>
					<p>
						<span class="rightTxt">开票主体：</span>
						<span>{{ orderDetail.invoiceEntity }}</span>
					</p>
				</li>
			</ul> -->
		</el-card>
		<!-- 订单进度 -->
		<el-card class="box-card">
			<template #header>
				<span style="margin-left: 10px; font-size: 16px">订单进度</span>
				<ul class="progressBox">
					<li v-for="(item, index) in procList" :key="item.id" :class="stateType == item.value ? 'active' : ''"
						@click="handleStatus(item.value,index)">
						<span class="step">{{ index + 1 }}</span>
						<span class="textBox"><span>{{ item.label }}</span>
							<el-icon style="font-size: 20px">
								<DArrowRight />
							</el-icon></span>
					</li>
				</ul>
			</template>
			<!-- <programProcess></programProcess> -->
			<template v-if="orderDetail.id">
				<conceptualDesign :orderDetail="orderDetail" v-if="stateType=='project_design'"></conceptualDesign>
				<orderCost :orderDetail="orderDetail" v-if="stateType=='cost_structure'"></orderCost>
				<proof :orderDetail="orderDetail" v-if="stateType=='proofing'"></proof>
				<valuation :orderDetail="orderDetail" v-if="stateType=='bulk_quote'"></valuation>
				<contract :orderDetail="orderDetail" v-if="stateType=='bulk_contract'"></contract>
				<design :orderDetail="orderDetail" v-if="stateType=='bulk_design'"></design>
				<production :orderDetail="orderDetail" v-if="stateType=='bulk_production'"></production>
				<payment :orderDetail="orderDetail" v-if="stateType=='payment'"></payment>
			</template>
		</el-card>
		<el-dialog v-model="dialogVisible" title="发票凭证" destroy-on-close>
			<Editor v-model:html="dialogData" :edit="false"></Editor>
		</el-dialog>
	</div>
</template>

<script setup>
import { getFileName } from '@/utils/index'
import settlementMethod from '@/components/settlementMethod/index.vue'
import { useRoute } from 'vue-router'
import conceptualDesign from './components/orderProc/procConceptualDesign.vue'
import proof from './components/orderProc/procProof.vue'
import valuation from './components/orderProc/procValuation.vue'
import contract from './components/orderProc/procContract.vue'
import design from './components/orderProc/procDesign.vue'
import production from './components/orderProc/procProduction.vue'
import orderCost from './components/orderProc/procOrderCost.vue'
import payment from './components/orderProc/procPayment.vue'
import {
	projectDesignOrderProc,
	bulkOrderProc,
	bulkDesignProdOrderProc,
  	gradingCalculate 
} from '@/api/orderManagement/subOrder'
import { customerDetail } from '@/api/orderManagement/customer/index'
import { watch } from 'vue'
import singDownFile from "@/components/singDownFile"
import Editor from "@/components/Editor"
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { 
	crm_project_design_order, 
	crm_bulk_design_prod_order,
	crm_bulk_order,
	crm_invoice_status
} = proxy.useDict(
	'crm_project_design_order',
	'crm_bulk_design_prod_order',
	'crm_bulk_order',
	'crm_invoice_status'
)
watch([crm_project_design_order,crm_bulk_design_prod_order,crm_bulk_order],()=>{
	setProcList()
})
const route = useRoute()
const router = useRouter()
const data = reactive({
	orderDetail: {},
})
const dialogData = ref('')
const { orderDetail } = toRefs(data)
const dialogVisible = ref(false)
const contactsList = ref([])
const methodList = ref([])
const baseInfo = ref('')
const stateType = ref('project_design')
const procList = ref([])
const procLength = ref(0)
// 获取结算方式
const gradingCalculateFn = () => {
	gradingCalculate().then((res) => {
		methodList.value = res.data.more_settlement_method
	})
}
gradingCalculateFn()
// 获得方案设计订单详情
const projectDesignOrderProcFn = (id) => {
	projectDesignOrderProc(id).then((res) => {
		if (res.code == 200) {
			orderDetail.value = res.data
			setStateType()
		}
	})
}
// 获得大货订单详情
const bulkOrderProcFn = (id) => {
	bulkOrderProc(id).then((res) => {
		orderDetail.value = res.data
		setStateType()
	})
}
// 获得大货设计生产订单详情
const bulkDesignProdOrderProcFn = (id) => {
	bulkDesignProdOrderProc(id).then((res) => {
		orderDetail.value = res.data
		setStateType()
	})
}
//查询客户信息
const customerDetailFn = (id) => {
	customerDetail(id).then((res) => {
		contactsList.value = res.data.contactsList
		baseInfo.value = res.data.statisticsInfo
	})
}
if (route.query.customerId) {
	customerDetailFn(route.query.customerId)
}
//获取订单详情
const getDetail = () => {
	switch (route.query.procType) {
		case 'project_design_order':
			// 获得方案设计订单详情
			projectDesignOrderProcFn(route.query.id)
			break;
		case 'bulk_order':
			//大货订单详情
			bulkOrderProcFn(route.query.id)
			break;
		case 'bulk_design_prod_order':
			//大货设计生产订单详情
			bulkDesignProdOrderProcFn(route.query.id)
			break;
	
		default:
			break;
	}
}
getDetail()
function showFile(data){
	dialogVisible.value = true
	dialogData.value = data
}
//订单已经流转到哪一步
const handleStatus = (val,index) => {
	if (!(index < procLength.value)) {
		return
	}
	stateType.value = val
}
//设置对应订单类型的订单流程
function setProcList(){
	procList.value = []
	switch (route.query.procType) {
		case 'project_design_order':
			procList.value = crm_project_design_order.value
			setStateType()
			break;
		case 'bulk_order':
			procList.value = crm_bulk_order.value
			setStateType()
			break;
		case 'bulk_design_prod_order':
			procList.value = crm_bulk_design_prod_order.value
			setStateType()
			break;
	
		default:
			break;
	}
}
setProcList()
//设置限制，不让切换到未流转的流程
function setStateType(){
	try {
		stateType.value = orderDetail.value.taskList[orderDetail.value.taskList.length-1].taskDefKey
		if (procList.value?.length) {
			procList.value.map((item,i)=>{
				if (item.value==stateType.value) {
					procLength.value = i+1
				}
			})
		}
	} catch (error) {
	}
	
}
//跳转到客户详情
function gotoCustomerDetail(){
	const url = router.resolve({
		path:'/crm/customer/customerDetail',
		query:{id:orderDetail.value.customerId}
	})
	window.open(url.href,'_blank')
}
</script>

<style scoped>
ul,
li {
	list-style: none;
	margin: 0;
	padding: 0;
}
p {
	margin: 0;
	padding: 0;
}
.proofingContent {
	font-size: 14px;
}
.suppContract {
	width: 100px;
	height: 100px;
	color: #333;
	border: 1px dashed #333;
	border-radius: 50%;
	position: absolute;
	top: -22px;
	right: 0;
	text-align: center;
	padding-top: 38px;
	transform: rotate(45deg);
}
.rightTxt {
	display: inline-block;
	width: 100px;
	text-align: right;
}
.userInfo {
	display: flex;
	margin-top: 20px;
}
.userInfo > li {
	padding: 3px 30px;
	border-right: 1px solid #ddd;
}
.wordsWeight {
	color: #333;
	font-size: 20px;
	margin-top: 10px;
}
.box-card {
	margin: 10px;
}
.customerInfo {
	display: flex;
}
.customerInfo > li {
	flex: 0 0 400px;
}
.customerInfo > li > p {
	margin-bottom: 24px;
}
.categoryType {
	display: flex;
	margin-bottom: 20px;
}
.proofingContent .cardHeader {
	display: flex;
	justify-content: space-between;
}
.proofingContent .cardHeader .icon {
	display: flex;
	align-items: center;
	color: #ff3399;
}
.progressBox {
	/* height: 60px; */
	padding: 20px 0;
	display: flex;
	user-select: none;
	color: #aaa;
	font-size: 18px;
	border-bottom: 1px solid #ddd;
}

.progressBox li {
	flex: 1;
	cursor: pointer;
	display: flex;
}

.step {
	padding: 10px 16px;
	border: 1px solid #aaa;
	border-radius: 50%;
	margin-right: 10px;
}

.textBox {
	display: flex;
	align-items: center;
}

.progressBox .active {
	color: #007feb;
}

.progressBox .active .step {
	border: 1px solid #007feb;
}
.invoice-total{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>

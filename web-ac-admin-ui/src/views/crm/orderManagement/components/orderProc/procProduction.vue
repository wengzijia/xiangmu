<template>
	<div>
		<el-menu
			:default-active="activeIndex"
			class="navMenu"
			mode="horizontal"
			:ellipsis="false"
			@select="handleSelect"
		>
			<el-menu-item :index="i+1" v-for="(e,i) in drawerFormData" :key="e.id"
				>大货工单号：{{ e.bulkBusinessKey }}</el-menu-item
			>
		</el-menu>
		<ul class="massProduction">
			<li
				v-show="index + 1 == activeIndex"
				v-for="(item, index) in drawerFormData"
				:key="item.id"
			>
				<div style="font-size: 18px">
					大货工单号：{{ item.bulkBusinessKey }}
				</div>
				<div class="everyInfo">
					<p style="display: flex">
						<span class="alignRight">发货状态：</span>
						<DictTag
							:value="item.bulkDeliveryStatus"
							:options="crm_delive_status"
						/>
					</p>
					<p>
						<span class="alignRight">物流单号：</span>
						<span v-if="item.logisticsNumber||item.logisticsNumber===0">{{ item.logisticsNumber }}</span>
						<span v-else>-</span>
					</p>
					<p>
						<span class="alignRight">物流费：</span>
						<span v-if="item.bulkLogisticsTaxInclusiveFee||item.bulkLogisticsTaxInclusiveFee===0">{{ showMoney(item.bulkLogisticsTaxInclusiveFee) }}</span>
						<span v-else>-</span>
					</p>
					<p>
						<span class="alignRight">物流费税金：</span>
						<span v-if="item.bulkLogisticsTaxes||item.bulkLogisticsTaxes===0">{{ showMoney(item.bulkLogisticsTaxes) }}</span>
						<span v-else>-</span>
					</p>
					<p>
						<span class="alignRight">物流单据：</span>
						<span style="margin-right: 10px">{{
							item.logisticsDocumentsName||'-'
						}}</span>
						<singDownFile
							:url="item.logisticsDocumentsUrl"
						></singDownFile>
					</p>
					<p>
						<span class="alignRight">收货人：</span>
						{{ orderDetail.consigneeName }}
					</p>
					<p>
						<span class="alignRight">收货人联系电话：</span>
						{{ orderDetail.consigneePhone }}
					</p>
					<p>
						<span class="alignRight">省市区：</span>
						{{(orderDetail.province?orderDetail.province+' ':'')+(orderDetail.city?orderDetail.city+' ':'')+(orderDetail.district?orderDetail.district+' ':'')}}
					</p>
					<p>
						<span class="alignRight">详细地址：</span>
						{{ orderDetail.consigneeAddress }}
					</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { getBulkProductionOrderProc } from '@/api/crm/order/detail'
import { useRoute } from 'vue-router'
import singDownFile from '@/components/singDownFile'
import crmProcStore from '@/store/modules/crmProc'
const { proxy } = getCurrentInstance()

const { crm_delive_status } = proxy.useDict('crm_delive_status')
const proc = crmProcStore()
const props = defineProps({
	orderDetail: {
		type: Object,
		default: {},
	},
})
const data = reactive({
	activeIndex: 1,
})
const { orderDetail } = toRefs(props)
const { activeIndex } = toRefs(data)
const route = useRoute()
const drawerFormData = computed(() => proc.production)
function handleSelect(val) {
	activeIndex.value = val
}
function getDetail() {
	if (!route.query.id) {
		return
	}
	proc.getProduction(route.query.id, {
		orderType: orderDetail.value.procType,
	})
}
getDetail()
</script>

<style lang="scss" scoped>
ul,
li {
	list-style: none;
}
.massProduction {
	margin: 20px 0;
	padding: 30px 20px;
	background: #f9f9f9;
}
.alignRight {
	display: inline-block;
	width: 120px;
	text-align: right;
}
.everyInfo > p {
	margin: 20px 0;
}
</style>

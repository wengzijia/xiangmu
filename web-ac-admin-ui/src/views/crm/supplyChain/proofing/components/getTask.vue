<template>
	<div class="lookDetail">
		<el-drawer v-model="isTask" direction="rtl" size="600px" title="领取打样任务" @close="cancelClick">
			<template #default>
				<div>
					<el-form :model="formData" :rules="rules" label-width="120px" ref="supplyRef">
						<el-form-item label="选择订单：" prop="orderId">
							<div class="btnSelect">
								<el-button style="border: 1px dashed #ccc" @click="selectOrder">
									{{
										taskData.type == 1
										? '选择订单'
										: '重新选择'
									}}
								</el-button>
								<p v-if="taskData.type == 2">
									订单编号：{{ businessKey }}
								</p>
							</div>
						</el-form-item>
						<el-form-item label="归属部门:" prop="dept">
									<el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
							<el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item label="供应链专员：" prop="supplyChainSpecialistId">
							<!-- <div v-if="isSupply">
								{{ formData.supplyChainSpecialistName }}
							</div> -->
							<el-select v-model="formData.supplyChainSpecialistId" class="m-2" :disabled="deptDisabled"
								style="width: 440px" placeholder="所有" clearable>
								<el-option v-for="item in proofSupplyList" :key="item.userId" :label="item.nickName"
									:value="item.userId" @click="selectSupply(item)" />
							</el-select>
						</el-form-item>
						<el-form-item label="选择品类：" v-show="taskData.type == 2" prop="categoryList">
							<el-table ref="multipleTableRef" :data="categoryList" style="width: 100%"
								@selection-change="handleSelectionChange">
								<el-table-column type="selection" width="55" />
								<el-table-column label="品类" property="goodsName" width="140">
								</el-table-column>
								<el-table-column property="proofingQuantity" label="数量" width="120" />
								<el-table-column label="待打样数量" width="120">
									<template #default="scope">{{
										scope.row.proofingQuantity -
										scope.row.proofingReceiveQuantity
									}}</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</el-form>

					<el-drawer v-model="innerDrawer" title="选择订单" :append-to-body="true" size="580px" @close="innerCancel">
						<div class="mt-4">
							<el-input v-model="requestParm.keyword" placeholder="请输入订单编号/客户名称" class="input-select"
								clearable>
								<template #prepend>
									<el-select v-model="requestParm.procType" class="m-2" style="width: 115px"
										placeholder="所有类型" clearable>
										<el-option v-for="item in crm_order_type" :key="item.id" :label="item.label"
											:value="item.value" />
									</el-select>
								</template>
								<template #append>
									<span style="cursor: pointer" @click="search">搜索</span>
								</template>
							</el-input>

							<!-- 订单列表  -->
							<div class="outworkListBox">
								<el-table :data="tabList" style="width: 100%" scrollbar-always-on>
									<!-- @current-change="handleCurrentChange" -->
									<el-table-column label="" width="40">
										<template #default="scope">
											<el-radio :label="scope.row.id" v-model="radio" @change="radioChange(
														scope.$index,
														scope.row
													)
													">&nbsp;</el-radio>
										</template>
									</el-table-column>
									<el-table-column label="订单编号" width="150" prop="businessKey"></el-table-column>
									<el-table-column label="客户名称" width="150" prop="customerName"></el-table-column>
									<el-table-column label="订单类型" width="140">
										<template #default="scope">
											<DictTag :value="scope.row.procType" :options="crm_order_type" />
										</template>
									</el-table-column>
									<el-table-column label="业务员" width="100" prop="businessStaffName"></el-table-column>
								</el-table>
								<!-- 分页 -->
								<div class="laypage">
									<el-pagination v-model:currentPage="requestParm.current
											" v-model:page-size="requestParm.size" :page-sizes="[10, 20, 50, 100]"
										layout="total, sizes, prev, pager, next, jumper" :total="total" />
								</div>
							</div>
						</div>
						<template #footer>
							<div style="flex: auto">
								<el-button @click="innerCancel">取消</el-button>
								<el-button type="primary" @click="innerConfirm">确认</el-button>
							</div>
						</template>
					</el-drawer>
				</div>
			</template>
			<template #footer>
				<div style="flex: auto">
					<el-button @click="cancelClick">取消</el-button>
					<el-button type="primary" @click="confirmClick">确认</el-button>
				</div>
			</template>
		</el-drawer>
	</div>
</template>

<script setup>
import { receivesTask } from '@/api/orderManagement/proofing'
import { validateForms } from '@/utils/form'
import { ElMessage, ElLoading } from 'element-plus'
import {
	crmOrderProcView,
	projectDesignOrderProc,
	bulkOrderProc,
	bulkDesignProdOrderProc,
} from '@/api/orderManagement/subOrder'
import { useIsCrmSaleman } from "@/hooks/selectCrmSaleman";
import useCrmOption from "@/store/modules/crmSelectOption";
const [isSupply, userId] = useIsCrmSaleman('crmProofingSupplyChainSpecialist')
const deptList = computed(()=> option.deptList)
const router = useRouter()
const option = useCrmOption()
const proofSupplyList = computed(() => option.proofSupplyList)
// 获取字典管理--配置的状态
const { proxy } = getCurrentInstance()
const { crm_order_type } = proxy.useDict('crm_order_type')
const supplyRef = ref()
const emits = defineEmits(['proofingProcFn'])
const taskData = reactive({
	isTask: false,
	innerDrawer: false,
	isSearch: false,
	radio: '',
	radioId: '',
	type: 1, //选择订单的状态
	businessKey: '', //订单id
	procType: '', //订单类型

	total: 0,
	tabList: [],
	categoryList: [],
	formData: {
		categoryList: [
			// {
			// 	orderCategoryId: '', //订单品类id
			// 	proofingQuantity: '', //打样数量
			// },
		],
		acDataSepDeptId:'',
		orderId: '', //订单id
		procType: '', //订单类型
		supplyChainSpecialistId: isSupply ? userId : "", //供应链专员id
		supplyChainSpecialistName: '', //供应链专员姓名
	},
	requestParm: {
		size: 10, //单页显示多少条数据
		current: 1, //当前页数
		procType: '', //订单类型
		keyword: '', //订单信息
		proofingReceiveStatus: '1', //待领取
	},
})
const {
	radio,
	formData,
	isTask,
	innerDrawer,
	isSearch,

	tabList,
	total,
	requestParm,
	businessKey,
	procType,
	radioId,
	categoryList,
} = toRefs(taskData)
const deptDisabled = ref(false)
const validateCate = (rule, value, callback) => {
	if (value.length > 0) {
		// console.log('22222222-7777--', value)
		callback()
	} else {
		callback(new Error('请选择品类'))
	}
}
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = res.data.id
    deptDisabled.value = true
  }
})
function changeDept(val) {
  option.setDeptId(val);
  formData.value.supplyChainSpecialistId = null;
}
const rules = reactive({
	orderId: [
		{
			required: true,
			message: '请选择订单',
			trigger: 'change',
		},
	],
	supplyChainSpecialistId: [
		{
			required: true,
			message: '请选择供应链专员',
			trigger: 'change',
		},
	],
	categoryList: [
		{
			required: true,
			validator: validateCate,
			trigger: 'change',
		},
	],
})

/**
 *crm订单流程视图--分页查询订单
 **/
const crmOrderProcViewFn = () => {
	crmOrderProcView(requestParm.value)
		.then((res) => {
			tabList.value = res.data.records
			total.value = res.data.total
			// console.log('GET分页查询订单', data.tabList)
		})
		.catch((err) => {
			console.log('报错-----', err)
		})
}
// crmOrderProcViewFn()
// 选中品类
const handleSelectionChange = (list) => {
	// console.log('2121322item--item---item434', list)
	formData.value.categoryList = []
	list.map((item) => {
		let obj = {
			orderCategoryId: item.id, //订单品类id
			proofingQuantity:
				item.proofingQuantity - item.proofingReceiveQuantity, //打样数量
		}
		formData.value.categoryList.push(obj)
	})
	// console.log('formData.value.categoryList---', formData.value.categoryList)
}

const taskShow = (item) => {
	isTask.value = true
	formData.value.supplyChainSpecialistId = isSupply ? userId : ''//供应链专员id
	// formData.value.supplyChainSpecialistName = isSupply ? item.nickName : '' //供应链专员姓名
}
const selectOrder = () => {
	innerDrawer.value = true
	radio.value = radioId.value
}
// 外部弹出的取消按钮
function cancelClick() {
	isTask.value = false
	businessKey.value = ''
	radioId.value = ''
	taskData.type = '1'
	supplyRef.value.resetFields()
}
// 选择供应链专员
const selectSupply = (item) => {
	formData.value.supplyChainSpecialistId = item.userId
	formData.value.supplyChainSpecialistName = item.nickName
}
//  供应链专员领取任务接口
const receivesTaskFn = () => {
  	formData.value.supplyChainSpecialistName = proofSupplyList.value.find((e) => e.userId == formData.value.supplyChainSpecialistId)?.nickName
	const loading = ElLoading.service({
		lock: true,
		text: '加载中',
		background: 'rgba(0, 0, 0, 0.7)',
	})
	receivesTask(formData.value).then((res) => {
		// console.log('领取任务4343', res.data)
		if (res.code == 200) {
			ElMessage({
				message: '领取任务成功',
				type: 'success',
			})
			cancelClick()
			emits('proofingProcFn', 1)
		}
	}).finally(()=>{
		loading.close()
	})
}
// 确认领取任务
function confirmClick() {
	let formRefs = [supplyRef.value]
	validateForms(formRefs)
		.then(() => {
			// console.log(111113333338888);
			receivesTaskFn()
		})
		.catch((err) => {
			console.log(err)
		})
}

/*** 筛选*/
const search = () => {
	isSearch.value = true
	crmOrderProcViewFn()
}
// 获得方案设计订单详情
const projectDesignOrderProcFn = (id) => {
	projectDesignOrderProc(id).then((res) => {
		if (res.code == 200) {
			categoryList.value = res.data.categoryList
		}
	})
}
// 获得大货订单详情
const bulkOrderProcFn = (id) => {
	bulkOrderProc(id).then((res) => {
		categoryList.value = res.data.categoryList
	})
}
// 获得大货设计生产订单详情
const bulkDesignProdOrderProcFn = (id) => {
	bulkDesignProdOrderProc(id).then((res) => {
		categoryList.value = res.data.categoryList
	})
}
const initData = () => {
	if (procType.value == 'project_design_order') {
		// 获得方案设计订单详情
		projectDesignOrderProcFn(radioId.value)
		// orderStatus.value="方案设计中"
	} else if (procType.value == 'bulk_order') {
		//大货订单详情
		bulkOrderProcFn(radioId.value)
		// orderStatus.value="打样中"
	} else if (procType.value == 'bulk_design_prod_order') {
		//大货设计生产订单详情
		bulkDesignProdOrderProcFn(radioId.value)
		// orderStatus.value="大货设计生产中"
	}
}
// 单选选中订单
function radioChange(index, row) {
	businessKey.value = row.businessKey //订单id
	procType.value = row.procType //订单类型
}
// 内部抽屉盒的取消按钮
function innerCancel() {
	innerDrawer.value = false
}
// 内部抽屉盒的确认按钮
function innerConfirm() {
	innerDrawer.value = false
	taskData.type = 2
	formData.value.orderId = radio.value //订单id
	formData.value.procType = procType.value //订单类型
	radioId.value = radio.value
	initData()
}
/**
 * 监听对象数据的变化
 */
watch(
	[
		() => requestParm.value.size,
		() => requestParm.value.current,
		() => isTask,
	],
	(val, oval) => {
		// // console.log('id555555555监听对象数据的变化', val, 'ovaloval----', oval)
		// // 判断没有点击筛选按钮时，之前填写的参数初始化
		if (!isSearch.value) {
			requestParm.value.procType = '' //订单类型
			requestParm.value.keyword = '' //订单信息
		}
		if (isTask.value) {
			crmOrderProcViewFn()
		}
	},
	{
		immediate: true,
		deep: true, //开启深度监听,能够侦听到对象属性值的变化
	}
)
defineExpose({
	taskShow,
})
</script>

<style scoped>
.lookDetail :deep(.el-form-item__label) {
	font-weight: 700;
}

.btnSelect>p {
	color: #ff3399;
	font-size: 12px;
	margin: 0;
}

.input-select {
	margin-bottom: 20px;
}

.laypage {
	display: flex;
	justify-content: right;
	margin-top: 20px;
}
</style>

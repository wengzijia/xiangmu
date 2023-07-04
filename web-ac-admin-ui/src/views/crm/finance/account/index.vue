<template>
    <div>
        <el-card style="margin: 10px">
            <!-- <div>合同审核</div> -->
            <el-form :inline="true" :model="formData" label-width="120px" ref="formRef">
                <el-form-item label="客户信息:" prop="customerInfo">
                    <el-input v-model.trim="formData.customerInfo" placeholder="请输入客户编号/客户名称" clearable
                        style="width:252px;" />
                </el-form-item>
                <el-form-item label="归属部门:" prop="acDataSepDeptId">
                    <el-select v-model="formData.acDataSepDeptId" placeholder="所有部门" clearable :disabled="deptDisabled" @change="changeDept" style="width:252px;">
                        <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="业务员:" prop="businessStaffId">
                    <el-select v-model="formData.businessStaffId" placeholder="所有业务员" clearable style="width:252px;">
                        <el-option v-for="item in salesmanList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="合同签订时间:" prop="apply">
                    <template #label>
                        <span style="font-weight: 700;">合同签订时间</span>
                    </template>
                    <dateTimePicker ref="dateRef" :dateType="'datetimerange'" v-model:startTime="formData.apply[0]"
                        v-model:endTime="formData.apply[1]"></dateTimePicker>
                </el-form-item>
                <el-form-item label="订单完成状态:" prop="orderStatus">
                    <el-select v-model="formData.orderStatus" placeholder="所有" clearable style="width:252px;">
                        <el-option v-show="items.label == '已完成'" v-for="items in crm_order_status" :key="items.id"
                            :label="items.label" :value="items.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="form-tool-bar">
                <div style="min-width:240px;width:240px;">
                    <el-button type="primary" @click="resetFormParams">重置</el-button>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="primary" @click="exportExcel">导出</el-button>
                </div>
            </div>
        </el-card>
        <el-card style="margin: 10px">
            <!-- <div style="text-align: right;margin-bottom:10px;"><el-button @click="exportExcel">导出</el-button></div> -->
            <el-table :data="tableData" style="width: 100%;height: 520px;" row-key="id" v-loading="loading"
                ref="multipleTable">
                <el-table-column prop="customerNumber" label="客户编号" width="100" />
                <el-table-column prop="customerName" label="客户名称" />
                <el-table-column prop="customerGrading" label="客户评级" />
                <el-table-column prop="customerCreditQuota" label="授信额度">
                    <template #default="scope">
                        <div style="text-align: right;">{{ showMoney(scope.row.customerCreditQuota) || '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="accountsCalculateOrderPrice" label="订单/合同金额合计">
                    <template #default="scope">
                        <div style="text-align: right;">{{ showMoney(scope.row.accountsCalculateOrderPrice) || '-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="paidAmount" label="已支付金额合计" width="120">
                    <template #default="scope">
                        <div style="text-align: right;">{{ showMoney(scope.row.paidAmount) || '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="unpaidAmount" label="待支付金额合计">
                    <template #default="scope">
                        <div style="text-align: right;">{{ showMoney(scope.row.unpaidAmount) || '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="usableCreditQuota" label="可用授信额度" width="160">
                    <template #default="scope">
                        <div style="text-align: right;">{{ showMoney(scope.row.usableCreditQuota) }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="nowDefaultAmount" label="逾期金额合计" width="160">
                    <template #default="scope">
                        <div style="text-align: right;">{{ showMoney(scope.row.nowDefaultAmount) || '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right">
                    <template #default="scope">
                        <div>
                            <el-link :underline="false" type="primary"
                                @click="viewOrderList(scope.row.customerId)">查看订单列表</el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pages" style="position: relative;">
                <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.current"
                    @pagination="handleSizeChange" :total="total" v-model:limit="formData.size"
                    :pageSizes="[20, 30, 50, 100]" />
            </div>
        </el-card>

        <el-dialog v-model="dialogVisible" title="订单列表" width="1400px" >
            <div>
                <el-table :data="orderTableData" style="width: 100%;height: 440px;" row-key="id" align-center v-loading="loading"
                    ref="multipleTable">
                    <el-table-column prop="customerNumber" label="客户编号" width="100" />
                    <el-table-column prop="customerName" label="客户名称" />
                    <el-table-column prop="orderBusinessKey" label="订单编号" />
                    <el-table-column prop="accountsContractNo" label="合同编号">
                        <template #default="scope">{{ scope.row.accountsContractNo || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="orderTaxInclusiveTotalPrice" label="订单总价">
                        <template #default="scope">
                            <div style="text-align: right;">{{ showMoney(scope.row.orderTaxInclusiveTotalPrice)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="accountsContractTaxInclusiveTotalPrice" label="合同总价">
                        <template #default="scope">
                            <div style="text-align: right;">{{ showMoney(scope.row.accountsContractTaxInclusiveTotalPrice) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paidAmount" label="已支付金额" width="100">
                        <template #default="scope">
                            <div style="text-align: right;">{{ showMoney(scope.row.paidAmount) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unpaidAmount" label="待支付金额" width="100">
                        <template #default="scope">
                            <div style="text-align: right;">{{ showMoney(scope.row.unpaidAmount) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="nowDefaultAmount" label="逾期金额" >
                        <template #default="scope">
                            <div style="text-align: right;">{{ showMoney(scope.row.nowDefaultAmount) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderStatus" label="订单状态" >
                        <template #default="scope"><DictTag :value="scope.row.orderStatus" :options="crm_order_status" /></template>
                    </el-table-column>
                    <el-table-column prop="accountsContractSignDate" label="合同签订日期" width="160">
                        <template #default="scope">{{ (scope.row.accountsContractSignDate) }}</template>
                    </el-table-column>
                    <el-table-column prop="businessStaffName" label="业务员" width="120"/>
                </el-table>
                <div class="pages" style="position: relative;">
                    <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="orderFormData.current"
                        @pagination="orderListHandleSizeChange" :total="orderListTotal" v-model:limit="orderFormData.size"
                        :pageSizes="[20, 30, 50, 100]" />
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">
                        关闭
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script setup>
import dateTimePicker from '@/components/datePicker/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { watch } from "vue";
import { parseTime } from "@/utils/ruoyi"
import { formatDate, } from '@/utils';
import useCrmOption from "@/store/modules/crmSelectOption"
import { getCustomerAccountList, getAccountsOrderList, exportOrderStatisticsList } from "@/api/crm/finance/account"
const option = useCrmOption()
const salesmanList = computed(() => option.salesmanList)
const deptList = computed(()=> option.deptList)
// option.getOptionList('crmCustomerBusinessStaff')

// getAuditList
const data = reactive({
    formData: {
        current: 1,//页码
        size: 20,//分页大小
        customerInfo: null,//客户信息
        acDataSepDeptId:null,//部门
        businessStaffId: null,//业务员
        apply: ['', ''],//申请时间
        orderStatus: '',//订单完成状态
        contractType: null,//结算方式
    },
    orderFormData: {
        current: 1,//页码
        size: 20,//分页大小
    }
});
const { formData, orderFormData } = toRefs(data);
const loading = ref(false)
const dialogVisible = ref(false)
const deptDisabled = ref(false)
const tableData = ref([])
const orderTableData = ref([])
const total = ref(0)
const orderListTotal = ref(0)
const customerId = ref('')
const { proxy } = getCurrentInstance();
const { crm_order_status,crm_acColumn } =
    proxy.useDict(
        'crm_order_status',
        'crm_acColumn'
    )
watch(crm_acColumn,(val)=>{
    formData.value.acColumn = val.find(item=>{return item.label=="acColumn"}).value
})
if (crm_acColumn.value.length>0) {
	formData.value.acColumn = crm_acColumn.value.find(item=>{return item.label=="acColumn"}).value
}
option.setDeptId(formData.value.acDataSepDeptId);
const acDataSepDeptId = ref('')
option.getDept().then(res=>{
  if (res?.data) {
    formData.value.acDataSepDeptId = acDataSepDeptId.value = res.data.id
    deptDisabled.value = true
  }
})
const multipleTable = ref(null)
const dateRef = ref(null)
watch(tableData, () => {
    nextTick(() => {
        multipleTable.value.setScrollTop(0)
        multipleTable.value.setScrollLeft(0)
    })
})
/**部门更改后更新业务员列表 */
function changeDept(val){
  option.setDeptId(val)
  formData.value.businessStaffId = null
}
/** 重置按钮操作 */
function resetFormParams() {
    proxy.resetForm("formRef");
    formData.value.acDataSepDeptId = acDataSepDeptId.value
    search();
}

//页码/分页大小改变事件
function handleSizeChange(val) {
    getList()
}

function orderListHandleSizeChange(val){
    getOrderList()
}

//搜索
function search() {
    formData.value.current = 1//页码
    formData.value.size = 20//分页大小
    getList()
}

function exportExcel() {
    if(!tableData.value?.length){
        ElMessage.error('暂无数据导出')
        return
    }
    let params = {
        ...formData.value
    }
    if (formData.value.apply?.length > 0) {
        params.accountsContractSigndateStart = formData.value.apply[0] ? formatDate(formData.value.apply[0]) : formatDate(dateRef.value.start)// + ' 00:00:00'
        params.accountsContractSigndateEnd = formData.value.apply[1] ? formatDate(formData.value.apply[1]) : formatDate(dateRef.value.end)// + ' 23:59:59'
    }
    exportOrderStatisticsList(params,`客户账款${parseTime(new Date(),'{y}{m}{d}{h}{i}')}.xlsx`)
}
function viewOrderList(id){
    customerId.value = id
    getOrderList()
}

//获取列表
function getList() {
    let params = {
        ...formData.value
    }
    if (formData.value.apply?.length > 0) {
        params.accountsContractSigndateStart = formData.value.apply[0] ? formatDate(formData.value.apply[0]) : formatDate(dateRef.value.start)// + ' 00:00:00'
        params.accountsContractSigndateEnd = formData.value.apply[1] ? formatDate(formData.value.apply[1]) : formatDate(dateRef.value.end)// + ' 23:59:59'
    }
    loading.value = true
    getCustomerAccountList(params).then(res => {
        if (res.code == 200) {
            tableData.value = res.data.records
            total.value = res.data.total
        }
    }).finally(() => {
        loading.value = false
    })
}
function getOrderList() {
    let params = {
        ...formData.value,
        customerId:customerId.value,
        current: orderFormData.value.current,//页码
        size: orderFormData.value.size,//分页大小
    }
    if (formData.value.apply?.length > 0) {
        params.accountsContractSigndateStart = formData.value.apply[0] ? formatDate(formData.value.apply[0]) : formatDate(dateRef.value.start)// + ' 00:00:00'
        params.accountsContractSigndateEnd = formData.value.apply[1] ? formatDate(formData.value.apply[1]) : formatDate(dateRef.value.end)// + ' 23:59:59'
    }
    loading.value = true
    dialogVisible.value = true
    getAccountsOrderList(params).then(res => {
        if (res.code == 200) {
            orderTableData.value = res.data.records
            orderListTotal.value = res.data.total
        }
    }).finally(() => {
        loading.value = false
    })
}
</script>
  
<style lang="scss" scoped>
.form-tool-bar {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 10px;
}
</style>
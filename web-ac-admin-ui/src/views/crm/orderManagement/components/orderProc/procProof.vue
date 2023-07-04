<template>
    <div>
        <div style="margin:20px 0;background-color: rgb(249, 249, 249);padding: 10px;border: 1px solid rgb(213, 213, 213);border-radius: 4px;">
            <div v-for="(item,i) in orderDetail.categoryList" :key="i">
                <div style="font-size: 16px;margin-top:10px;">{{ item.goodsName }}</div>
                <div style="display: flex;margin: 15px 0;">
                    <div style="width: 30%;">应打样数量：{{ item.proofingQuantity }}</div>
                    <div style="width: 30%;">打样已领取数量：{{ item.proofingReceiveQuantity }}</div>
                    <div style="width: 30%;display: flex;">
                        <span style="display: inline-block;width: 76px;">{{orderDetail.parentProcType=='bulk_order'?'客户文件':'设计方案'}}：</span>
                        <!-- <span>{{ item.designFileName || '-'}}</span>
                        <singDownFile :url="item.designFileUrl"/> -->
                        <div style="flex: 1;word-break: break-all;">
                            <div v-for="(url,index) in item.designFileUrl.split(',')" :key="index">
                                <span>{{ getFileName(url) || '-' }}</span>
                                <singDownFile :url="url"  style="margin-left: 10px;"/>
                                <br/>
                            </div> 
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <el-tabs v-model="activeName" class="demo-tabs" >
            <el-tab-pane v-for="(item,index) in drawerFormData" :key="index" :label="'打样工单号：'+item.businessKey" :name="index">
                <div style="display: flex;justify-content: space-between;align-items: center;padding: 0 20px;font-size: 18px;">
                    <div style="display: flex;width: 70%;">
                        <span>打样工单号：</span>
                        <div>
                            <div>{{ item.businessKey }}</div>
                            <span style="font-size: 14px;">品类：{{ item.goodsName }} <span style="margin-left: 10px;">数量：</span>{{ item.proofingQuantity }}</span>
                        </div>
                    </div>
                    <div>
                        <span>打样进度：</span>
                        <span>{{ item.taskList[item.taskList?.length-1].taskDefKey=='customer_confirms'&&item.taskList[item.taskList?.length-1].taskStatus==2?'已完成':item.taskList[item.taskList?.length-1].taskDefName }}</span>
                    </div>
                </div>
                <el-form :model="item" label-width="200px" ref="dialogForm">
                    <div>打样详情</div>
                    <el-form-item label="供应链专员:">
                        <span>{{ item.supplyChainSpecialistName || '-'}}</span>
                    </el-form-item>
                    <el-form-item label="领取时间:">
                        <span>{{ parseDate(item.receiveTime) || '-'}}</span>
                    </el-form-item>
                    <el-form-item label="打样供应商:">
                        <span>{{ proofTask.contract_with_supplier?.proofingSupplierName || '-'}}</span>
                    </el-form-item>
                    <el-form-item label="打样供应商合同:">
                        <span>{{ proofTask.contract_with_supplier?.supplierContractName || '-'}}</span>
                        <singDownFile :url="proofTask.contract_with_supplier?.supplierContractUrl" v-hasPermi="['@downFile']"/>
                    </el-form-item>
                    <el-form-item label="供应商预估打样费:">
                        <span v-if="proofTask.contract_with_supplier?.supplierProofingTaxInclusiveFee||proofTask.contract_with_supplier?.supplierProofingTaxInclusiveFee===0">
                            {{ showMoney(proofTask.contract_with_supplier?.supplierProofingTaxInclusiveFee)}}<span v-if="proofTask.contract_with_supplier?.supplierProofingTaxInclusiveFee">(含税)</span>
                        </span>
                        <span v-else>-</span>
                    </el-form-item>
                    <el-form-item label="税金:">
                        <span v-if="proofTask.contract_with_supplier?.supplierProofingTaxes||proofTask.contract_with_supplier?.supplierProofingTaxes===0">{{ showMoney(proofTask.contract_with_supplier?.supplierProofingTaxes)}}</span>
                        <span v-else>-</span>
                    </el-form-item>
                    <el-form-item label="供应商成本核算表:">
                        <span>{{ proofTask.contract_with_supplier?.supplierCostCalculateExcelName || '-'}}</span>
                        <singDownFile :url="proofTask.contract_with_supplier?.supplierCostCalculateExcelUrl" v-hasPermi="['@downFile']"/>
                    </el-form-item>
                    <el-form-item label="预计货期:">
                        <span>{{ proofTask.contract_with_supplier?.expectedDeliveryDate || '-'}}</span>
                    </el-form-item>
                    <div>打样发票</div>
                    <el-form-item label="供应商发票:">
                        <span>{{ proofTask.proofing_delivery?.supplierInvoiceName ||'-'}}</span>
                        <singDownFile :url="proofTask.proofing_delivery?.supplierInvoiceUrl" v-hasPermi="['@downFile']"/>
                    </el-form-item> 
                    <div>物流费用</div>
                    <el-form-item label="发货状态:">
                        <!-- <span>{{ item.logisticsNumber?'已发货':'暂未发货' }}</span> -->
                        <DictTag v-if="proofTask.proofing_delivery?.proofingDeliveryStatus" style="display: inline-block;" :value="proofTask.proofing_delivery?.proofingDeliveryStatus"
						:options="crm_delive_status" />
                        <span v-else>暂未发货</span>
                    </el-form-item> 
                    <el-form-item label="物流单号:">
                        <span>{{ proofTask.proofing_delivery?.logisticsNumber  || '-' }}</span>
                    </el-form-item> 
                    <el-form-item label="物流费:">
                        <span v-if="proofTask.proofing_delivery?.logisticsTaxInclusiveFee||proofTask.proofing_delivery?.logisticsTaxInclusiveFee===0">{{ showMoney(proofTask.proofing_delivery?.logisticsTaxInclusiveFee) }}<span v-if="item?.taskList[3]?.logisticsTaxInclusiveFee">(含税)</span></span>
                        <span v-else>-</span>
                    </el-form-item> 
                    <el-form-item label="税金:">
                        <span v-if="proofTask.proofing_delivery?.logisticsTaxes||proofTask.proofing_delivery?.logisticsTaxes===0">{{ showMoney(proofTask.proofing_delivery?.logisticsTaxes) }}</span>
                        <span v-else>-</span>
                    </el-form-item> 
                    <el-form-item label="物流单据:">
                        <span>{{ proofTask.proofing_delivery?.logisticsDocumentsName || '-' }}</span>
                        <singDownFile :url="proofTask.proofing_delivery?.logisticsDocumentsUrl"/>
                    </el-form-item> 
                    <div>收货地址</div>
                    <el-form-item label="收货人:">
                        <span>{{ orderDetail.consigneeName }}</span>
                    </el-form-item> 
                    <el-form-item label="收货人联系电话:">
                        <span>{{ orderDetail.consigneePhone }}</span>
                    </el-form-item> 
                    <el-form-item label="省市区:">
                        <span>{{ (orderDetail.province?orderDetail.province+' ':'')+(orderDetail.city?orderDetail.city+' ':'')+(orderDetail.district?orderDetail.district+' ':'') }}</span>
                    </el-form-item> 
                    <el-form-item label="详细地址:">
                        <span>{{ orderDetail.consigneeAddress }}</span>
                    </el-form-item>
                    <div>客户确认</div>
                    <el-form-item label="是否通过:">
                        <span v-if="proofTask.customer_confirms?.customerConfirmStatus">
                            <DictTag style="display: inline-block;" :value="proofTask.customer_confirms?.customerConfirmStatus"
                            :options="crm_customer_confirm_status" />
                        </span>
                        <span v-else>-</span>
                    </el-form-item> 
                    <el-form-item label="客户确认凭证:">
                        <span>{{ item.customerConfirmCertificateName || '-' }}</span>
                        <singDownFile :url="item.customerConfirmCertificateUrl"/>
                    </el-form-item> 
                    <el-form-item label="客户确认时间:">
                        <span>{{ parseDate(item.customerConfirmTime) }}</span>
                    </el-form-item> 
                </el-form>
            
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { getProofingOrderProc} from "@/api/crm/order/detail"
import { getFileName, parseDate } from "@/utils/index";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { useRoute } from 'vue-router'
import singDownFile from "@/components/singDownFile"
import crmProcStore from "@/store/modules/crmProc"
const proc = crmProcStore()
const props = defineProps({
    orderDetail: {
        type: Object,
        default: {}
    },
})
const { orderDetail } = toRefs(props)
const route = useRoute()
const { proxy } = getCurrentInstance()
const {
    crm_customer_confirm_status,
    crm_delive_status
} = proxy.useDict(
    "crm_customer_confirm_status",
    "crm_delive_status"
)
const activeName = ref(0)
const drawerFormData = computed(()=>proc.proof)
const processList = ref([
    {
        name: '供应商合同签订',
        taskDefKey:'contract_with_supplier'
    },
    {
        name: '合同部门审核',
        taskDefKey:'contract_dept_audit'
    },
    {
        name: '合同财务审核',
        taskDefKey:'contract_audit'
    },
    {
        name: '样品发货',
        taskDefKey:'proofing_delivery'
    },
    {
        name: '客户确认',
        taskDefKey:'customer_confirms'
    },
])
const data = reactive({
    proofTask:{
        contract_with_supplier:null,
        contract_dept_audit:null,
        contract_audit:null,
        proofing_delivery:null,
        customer_confirms:null,
    }
})
const { proofTask } = toRefs(data)
watch(activeName,(val)=>{
    proofTask.value = {
        contract_with_supplier:null,
        contract_dept_audit:null,
        contract_audit:null,
        proofing_delivery:null,
        customer_confirms:null,
    }
    setProcessList(val)
})
function getDetail(){
    if (!route.query.id) {
        return
    }
    proc.getProof(route.query.id, { orderType: orderDetail.value.procType }).then(()=>{
        setProcessList(0)
    })
}
getDetail()
function setProcessList(i){
    processList.value.map(item=>{
        let obj = drawerFormData.value[i].taskList.find(data=>{return data.taskDefKey===item.taskDefKey})
        if (obj) {
            proofTask.value[item.taskDefKey] = obj
        }
    })
}
</script>

<style lang="scss" scoped>

</style>
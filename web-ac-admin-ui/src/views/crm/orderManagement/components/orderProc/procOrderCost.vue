<template>
    <div style="padding-left: 10px;">
        <el-form  label-width="140px">
            <el-form-item label="全成本核算表:">
                <template #label>
                    <span><span>*</span>全成本核算表:</span>
                </template>
                <span v-if="orderDetail.allCostCalculateExcelUrl"><span style="margin-right: 10px;word-break: break-all;">{{ orderDetail.allCostCalculateExcelName || '-'}}</span><singDownFile :url="orderDetail.allCostCalculateExcelUrl" v-hasPermi="['@downFile']"/></span>
                <span v-else>待上传</span>
            </el-form-item>
            <div>设计服务费:</div>
            <el-form-item label="设计服务费:">
                <span> {{ showMoney(orderDetail.designServiceTaxInclusiveFee)+' (含税)'}}</span>
            </el-form-item>
            <div>打样成本</div>
        </el-form>
        <div class="poof-box" v-for="(item,index) in drawerFormData" :key="index">
            <div style="border-bottom: 1px solid #dcdfe6;line-height: 30px;">
                <span style="font-size: 16px;margin-left: 10px;">打样工单号：</span>
                <span>{{ item.businessKey }}</span>
            </div>
            <el-form  label-width="120px">
                <el-form-item label="品类:">
                    <span>{{ item.goodsName ||'-'}}</span>
                </el-form-item>
                <el-form-item label="打样数量:">
                    <span>{{ item.proofingQuantity ||'-'}}</span>
                </el-form-item>
                <el-form-item label="供应商打样费:">
                    <span>{{ showMoney(item.supplierProofingTaxInclusiveFee)  + ' (含税)'}}</span>
                </el-form-item>
                <el-form-item label="打样成本核算表:">
                    <span style="margin-right: 10px;word-break: break-all;">{{ item.supplierCostCalculateExcelName || '-' }}</span><singDownFile :url="item.supplierCostCalculateExcelUrl" v-hasPermi="['@downFile']"/>
                </el-form-item>
                <el-form-item label="打样物流费:">
                    <span>{{ showMoney(item.logisticsTaxInclusiveFee) + ' (含税)' }}</span>
                </el-form-item>
                <el-form-item label="打样物流单据:">
                    <span style="margin-right: 10px;word-break: break-all;">{{ item.logisticsDocumentsName || '-' }}</span><singDownFile :url="item.logisticsDocumentsUrl" v-hasPermi="['@downFile']"/>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
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
const drawerFormData = computed(()=>proc.proof)
function getDetail(){
    if (!route.query.id) {
        return
    }
    proc.getProof(route.query.id, { orderType: orderDetail.value.procType })
}
getDetail()
</script>

<style lang="scss" scoped>
.poof-box{
    width: 520px;
    margin-left: 30px;
    margin-top: 20px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
}
</style>
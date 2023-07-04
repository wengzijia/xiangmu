<template>
    <div>
        <div style="margin:20px 0;background-color: rgb(249, 249, 249);padding: 10px;border: 1px solid rgb(213, 213, 213);border-radius: 4px;">
            <div v-for="(item,i) in orderDetail.categoryList" :key="i">
                <div style="font-size: 16px;margin-top:10px;">{{ item.goodsName }}</div>
                <div style="display: flex;margin: 15px 0;">
                    <div style="width: 30%;">大货数量：{{ item.bulkProdQuantity }}</div>
                    <div style="width: 30%;">大货已领取数量：{{ item.bulkProdReceiveQuantity }}</div>
                    <!-- <div style="width: 30%;">方案设计文件：
                        <span>{{ item.designFileName || '-'}}</span>
                        <singDownFile :url="item.designFileUrl"/>
                    </div> -->
                    <div style="width: 30%;display: flex;">
                        <span style="width: 100px;">{{orderDetail.parentProcType=='bulk_order'?'客户文件':'设计方案'}}：</span>
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
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane v-for="(item,index) in drawerFormData" :key="index" :label="'大货工单号：'+item.bulkBusinessKey" :name="item.bulkBusinessKey">
                <div style="display: flex;justify-content: space-between;align-items: center;padding: 0 20px;font-size: 18px;">
                    <div style="display: flex;width: 50%;">
                        <span>大货工单号：</span>
                        <div>
                            <div>{{ item.bulkBusinessKey }}</div>
                            <span style="font-size: 14px;">品类：{{ item.goodsName }} <span style="margin-left: 10px;">数量：</span>{{ item.bulkProdQuantity }}</span>
                        </div>
                    </div>
                </div>
                <el-form :model="item" label-width="200px" ref="dialogForm">
                    <el-form-item label="供应商:">
                        <span>{{ item.bulkSupplierName || '-'}}</span>
                    </el-form-item>
                    <el-form-item label="成本核算表:">
                        <div style="word-break: break-all;">
                            <span>{{ item.costCalculateExcelName || '-'}}</span>
                            <singDownFile :url="item.costCalculateExcelUrl" v-hasPermi="['@downFile']"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="大货生产费:">
                        <span v-if="item.bulkProdTaxInclusiveFee||item.bulkProdTaxInclusiveFee===0">{{ showMoney(item.bulkProdTaxInclusiveFee)}}<span>(含税)</span></span>
                        <span v-else>-</span>
                    </el-form-item>
                    <el-form-item label="大货生产费税金:">
                        <span v-if="item.bulkProdTaxes||item.bulkProdTaxes===0">{{ showMoney(item.bulkProdTaxes)}}</span>
                        <span v-else>-</span>
                    </el-form-item>
                    <el-form-item label="大货物流费(预估):">
                        <span v-if="item.bulkLogisticsTaxInclusiveFee||item.bulkLogisticsTaxInclusiveFee===0">{{ showMoney(item.bulkLogisticsTaxInclusiveFee)}}<span>(含税)</span></span>
                        <span v-else>-</span>
                    </el-form-item>
                    <el-form-item label="大货物流费税金(预估):">
                        <span v-if="item.bulkLogisticsTaxes||item.bulkLogisticsTaxes===0">{{ showMoney(item.bulkLogisticsTaxes)}}</span>
                        <span v-else>-</span>
                    </el-form-item>
                </el-form>
            
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { getBulkQuoteOrderProc } from "@/api/crm/order/detail"
import { useRoute } from 'vue-router'
import singDownFile from "@/components/singDownFile"
import crmProcStore from "@/store/modules/crmProc"
import { getFileName,  } from "@/utils/index";
const proc = crmProcStore()
const props = defineProps({
    orderDetail: {
        type: Object,
        default: {}
    },
})
// const data = reactive({
//     drawerFormData:{}
// })
const { orderDetail } = toRefs(props)
// const { drawerFormData } = toRefs(data)
const activeName = ref('')
const route = useRoute()
const drawerFormData = computed(()=>proc.valuation)
function getDetail(){
    if (!route.query.id) {
        return
    }
    proc.getValuation(route.query.id, { orderType: orderDetail.value.procType }).then(()=>{
        if (drawerFormData.value&&drawerFormData.value.length) {
            activeName.value = drawerFormData.value[0].bulkBusinessKey
        }
    })
}
getDetail()
</script>

<style lang="scss" scoped>

</style>
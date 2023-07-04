<template>
    <div>
        <div>打样信息</div>
        <div style="margin: 10px 0;">
            <span>订单编号</span>
            <span>{{ orderNo }}</span>
        </div>
        <div v-for="(item,index) in drawerFormData" :key="index">
            <el-card>
                <el-form :model="item" label-width="120px" ref="dialogForm">
                    <el-form-item label="打样工单号:">
                        <span>{{ item.businessKey }}</span>
                    </el-form-item>
                    <el-form-item label="打样供应商:">
                        <span>{{ item.proofingSupplierName }}</span>
                    </el-form-item>
                    <el-form-item label="品类:">
                        <span>{{ item.goodsName }}</span>
                    </el-form-item>
                    <el-form-item label="打样数量:">
                        <span>{{ item.proofingQuantity }}</span>
                    </el-form-item>
                    <el-form-item label="打样物流单号:">
                        <span>{{ item.task.logisticsNumber }}</span>
                    </el-form-item>
                    <el-form-item label="打样供应商合同:">
                        <span style="margin-right: 10px;word-break: break-all;">{{ item.task.supplierContractName }}</span>
                        <singDownFile :url="item.task.supplierContractUrl"/>
                            <!-- <el-link v-if="item.task.supplierContractUrl" :underline="false" :href="BASE_FILE_URL + item.task.supplierContractUrl"
                                style="margin-left: 20px;">下载</el-link> -->
                    </el-form-item>
                    <el-form-item label="打样供应链专员:">
                        <span>{{ item.supplyChainSpecialistName }}</span>
                    </el-form-item>
                </el-form>
            </el-card>
            <div style="margin: 10px 0;">客户确认结果</div>
            <el-form :disabled="item.disabled" :model="item" label-width="120px" ref="dialogForm">
                <el-form-item label="是否通过:">
                    <template #label>
                        <span><span style="color:red">*</span>是否通过:</span>
                    </template>
                    <el-select v-model="item.passed" placeholder="请选择客户是否通过">
                        <el-option label="同意" :value="true" />
                        <el-option label="不同意" :value="false" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="item.passed" label="客户确认凭证：">
                    <template #label>
                        <span style="color: red;">* </span>
                        <span>客户确认凭证:</span>
                    </template>
                    <crmFileUpload style="width: 400px" v-model:modelValue="item.customerConfirmCertificateUrl"
                    :disabled="item.disabled" :showFile="item.disabled" replace
							name="上传确认凭证" :fileType="['jpg','jpeg','png']" :del="true" :fileSize="10" ></crmFileUpload>
                </el-form-item>
                <!-- <el-form-item v-if="activeName == '2'" label="客户确认凭证:">
                    <crmFileUpload v-if="drawerFormData?.task" style="width: 400px" v-model:modelValue="drawerFormData.task.customerConfirmCertificateUrl"
                    :disabled="drawerFormData.disabled" showFile down
                    name="上传确认凭证" :fileType="['jpg','jpeg','png']" :del="true" :fileSize="2"></crmFileUpload>
                </el-form-item> -->
                <el-form-item v-if="item.passed===false&&activeName == '1'" label="备注原因:">
                    <template #label>
                        <span><span style="color:red">*</span>备注原因:</span>
                    </template>
                    <el-input v-model.trim="item.customerConfirmRejectReason"  maxlength="300" show-word-limit/>
                </el-form-item>
                <el-form-item v-if="activeName == '2'&&item?.task?.customerConfirmStatus != '2'" label="备注原因:">
                    <div style="word-break:break-all;">{{ item?.task?.customerConfirmRejectReason ||'-'}}</div>
                </el-form-item>
                <el-form-item v-if="activeName == '2'" label="审核时间:">
                    <div>{{ parseDate(item?.task?.customerConfirmTime) }}</div>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="activeName == '1'&&drawerFormData?.length" class="form-tool-bar">
            <div style="min-width:160px;width:160px;">
                <el-button @click="clear">取消</el-button>
                 <el-button type="primary" @click="confirm">提交</el-button>
            </div>
        </div>
        <div v-if="activeName == '2'" class="form-tool-bar">
            <el-button @click="clear" type="primary">关闭</el-button>
        </div>
    </div>
</template>

<script setup>
import { getProofConfirmsDetail, confirmsProof} from "@/api/crm/customer/index";
import crmFileUpload from "@/components/FileUpload/crmFileUpload.vue";
import { getFileName, parseDate } from "@/utils/index";
import { ElMessage } from "element-plus";
import singDownFile from "@/components/singDownFile"
const props = defineProps({
    activeName: {
        type: String,
        default: ''
    },
    id:{
        type: String,
        default: ''
    },
    orderNo:{
        type: String,
        default: ''
    }
})
const emit = defineEmits()
const data = reactive({
    drawerFormData:[]
})
const taskList = ref([])
function getDetail(){
    if (!props.id) {
        return
    }
    getProofConfirmsDetail(props.id).then(res=>{
    if (res.code==200) {
      let obj = res.data
      if (obj.length) {
        obj.map(item=>{
            if (item.categoryList.length) {
                item.goodsName = item.categoryList.map(e=>{return e.goodsName}).filter(a=>a).join('/')
                item.proofingQuantity = item.categoryList.map(e=>{return e.proofingQuantity}).filter(a=>a).join('/')
            }else{
                item.categoryList = []
            }
            item.passed = item.task.customerConfirmStatus=='2'?true:item.task.customerConfirmStatus=='3'?false:''
            item.disabled = item.task.customerConfirmStatus*1>1?true:false
            return item
        })
        
      }
      drawerFormData.value = obj
    }
  })
}
getDetail()
const { drawerFormData } = toRefs(data)
function confirm(){
    let list = drawerFormData.value.map(item=>{
        if (!item.disabled) {
          let obj = {
                id:item.task.id,
                passed:item.passed,
                customerConfirmCertificateUrl:item?.customerConfirmCertificateUrl,
                customerConfirmCertificateName:item.customerConfirmCertificateUrl?getFileName(item.customerConfirmCertificateUrl):'',
                customerConfirmRejectReason:item?.customerConfirmRejectReason
            }
            return obj  
        }
    }).filter(a=>a)
    let flag = 0
    list.map((item,index)=>{
        if ((item.passed&&!item.customerConfirmCertificateUrl)||(!item.passed&&!item.customerConfirmRejectReason)||(item.passed!==true&&item.passed!==false)) {
            if (flag==0) {
                flag = index +1
            }
        }
    })
    if (flag) {
        let str = ''
        if(list[flag-1].passed){
            str = `请上传第${flag}个订单的客户确认凭证`
        }else{
            str = `请填写第${flag}个订单的备注原因`
        }
        ElMessage.error(str)
        return
    }
    confirmsProof({recordId:props.id,taskList:list}).then(res=>{
        if (res.code == 200) {
            ElMessage.success('提交成功！')
            emit('closeDrawer',true)
        }
    })
}
function clear() {
    emit('closeDrawer',false)
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
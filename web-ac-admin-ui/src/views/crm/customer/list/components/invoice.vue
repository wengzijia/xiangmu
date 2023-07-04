<template>
    <el-scrollbar style="height: 66vh;min-height: 360px;">
        <h3>开票信息{{ index }}</h3>
        <div class="customer-form" style="border-top: 1px solid #dcdfe6;">
            <div class="customer-label"><span class="red-star">*</span>开票单位名称</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入开票单位名称" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label">纳税人识别号</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入纳税人识别号" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label">邮箱</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入开票邮箱" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label">注册地址</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入开票单位注册地址" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label">联系电话</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入开票单位联系电话" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label">开户银行</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入开票单位对公账户开户银行" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label">开户账号</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入开票单位对公银行账号" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label"><span class="red-star">*</span>发票收货人</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入发票收货人" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label"><span class="red-star">*</span>收货人电话</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入收货人电话" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label">省市区</div>
            <div class="customer-item">
                <selectAddress v-if="edit" v-model:address="customerForm.address" ref="addressRef"></selectAddress>
                <span v-else>公司客户</span>
            </div>
        </div>
        <div class="customer-form" >
            <div class="customer-label">发票收货详细地址</div>
            <div class="customer-item">
                <el-input v-if="edit" v-model="customerForm" maxlength="50" placeholder="请输入发票收货人详细地址" show-word-limit
                    type="text" style="width: 252px;margin-right: 10px;" />
                <span v-else>公司客户</span>
            </div>
        </div>
    </el-scrollbar>
</template>

<script setup>
import selectAddress from "@/components/selectAddress/index.vue";
const props = defineProps({
    index:{
        type:Number,
        default:1
    },
    edit:{
        type:Boolean,
        default:false
    }
})
const data = reactive({
    customerForm: {}
})
const { customerForm } = toRefs(data)
</script>

<style lang="scss" scoped>
.customer-form {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #dcdfe6;

    div {
        padding: 6px 2px;
    }

    .customer-label {
        width: 160px;
        border-left: 1px solid #dcdfe6;
        padding-left: 10px;
        position: relative;
    }

    .customer-item {flex: 1;
        border-left: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
    }

}
.red-star{
    position: absolute;
    left: 3px;
    color: #ff0036;
    line-height:24px;
    user-select: none;
}
</style>
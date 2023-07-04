<template>
    <!-- 启动核算弹出框 -->
    <ACDialog title="切换账户" width="700px" v-model="accountingVisible" @close="accountingVisible = false"
        :close-on-click-modal="false">

        <div class="account-list">
            <div class="account-row" v-for="(item,index) in accountList" :key="item.manufacturerAccountId"
                :class="{ 'selected': selectedId == item.manufacturerAccountId }" @click="handleSelect(item)">
                <span class="radio">
                    <el-radio size="large" :label="item.manufacturerAccountId" v-model="selectedId">&nbsp;</el-radio>
                </span>
                <div class="account-info">
                    <div class="account-item"><label>账号{{index+1}}收款人:</label><span>{{ item.payeeName }}</span></div>
                    <div class="account-item"><label>账号{{index+1}}账号:</label><span>{{  item.paymentAccount}}</span></div>
                    <div class="account-item"><label>账号{{index+1}}开户行:</label><span>{{ item.paymentBank }}</span></div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="footer">
                <el-button class="search_button" type="primary" @click="handleSave(false)">
                    确定
                </el-button>
            </div>
        </template>
    </ACDialog>
</template>

<script setup>
import {getManufacturerDetail} from '@/api/modules/processor.js'
const { proxy: $vue } = getCurrentInstance()
const accountingVisible = ref(false)
const manufacturerId = ref('')
const selectedId  = ref(null)
//打开弹出框（供父级界面调用）
const openDialog = ({selectedAccountId,manufacturerID}) => {
    accountingVisible.value = true
    console.log('CCC',selectedAccountId)
    selectedId.value = selectedAccountId
    manufacturerId.value = manufacturerID
    loadAccountList()
}

defineExpose({
    openDialog
})

//加载账户列表
const accountList = ref([]);

const loadAccountList = async () => {
    let { code, data, message = '服务错误' } = await getManufacturerDetail(manufacturerId.value)
    if (code !== window.HTTP_SUCCESS) {
        return $vue.$message.error({ message })
    }
    let {manufacturerAccountList} = data
    accountList.value.length = 0
    accountList.value.push(...manufacturerAccountList)

    if(!selectedId.value){
        let findItems = manufacturerAccountList.filter(p=>p.isDefault)
        //console.log('bbb',manufacturerAccountList,manufacturerAccountList.filter(p=>p.isDefault))
        if(findItems.length){
            selectItem.value = findItems[0]
            selectedId.value =findItems[0].manufacturerAccountId
        }
    }else{
        let findItems = manufacturerAccountList.filter(p=>p.manufacturerAccountId== selectedId.value)
        //console.log('CCC',manufacturerAccountList,manufacturerAccountList.filter(p=>p.isDefault))
        if(findItems.length){
            selectItem.value = findItems[0]
        }
    }
}

//选定一个账户
const selectItem = ref({})
const handleSelect = (item) => {
    selectItem.value = item
    selectedId.value = item.manufacturerAccountId
}

//点击确定按钮
const emit = defineEmits(['changeAccount'])
const handleSave = async () => {
    emit('changeAccount', selectItem.value)
    accountingVisible.value = false
}



</script>

<style lang="scss" scoped>
.account-list {
    padding: 10px;
    max-height: 400px;
    overflow-y: scroll;

    .account-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 20px;
        margin-bottom: 16px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #E0E0E0;

        &:hover,
        &.selected {
            background: #F7F7F7;
            border-color: #38A28A;
        }
    }

    .radio {
        margin-right: 8px;
    }

    .account-info {}

    .account-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 12px;

        &:last-of-type {
            margin-bottom: 0;
        }

        &>label {
            font-size: 14px;
            color: #666;
            line-height: 21px;
            margin-right: 8px;
        }

        &>span {
            font-size: 14px;
            color: #333;
            line-height: 21px;
            flex: 1;
        }
    }
}

.footer {
    text-align: center;
}
</style>
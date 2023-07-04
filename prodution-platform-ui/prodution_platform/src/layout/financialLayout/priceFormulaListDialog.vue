<template>
    <div class="popupContainer">
        <el-dialog v-model="visible" :show-close="false" :destroy-on-close="true" :close-on-click-modal="false" >
            <template #header>
                <div class="hintBox">
                    <div class="text">提示</div>
                    <img class="closeImg" src="@/assets/images/close.png" alt="" @click="cancelBtn">
                </div>
            </template>
            <div class="hintContent">{{ dialogData.message }}</div>
            <div class="contentBox">
                <div class="tableBox">
                    <el-table :data="dialogData.data"  :header-cell-style="{ color: '#333' }" border>
                        <el-table-column prop="manufacturerName" label="加工商" min-width="140" align="center">
                            <template #default="scope">
                                <span>{{ scope.row.manufacturerName || '-' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="attributeName" label="工艺" width="100" align="center" />
                        <el-table-column prop="formulaDesc" label="公式详情" min-width="200" align="center" />
                        <el-table-column prop="version" label="版本" min-width="60" align="center" >
                            <template #default="scope">
                                <div style="color: #333;">{{  scope.row.version ? `V${scope.row.version}`: '-' }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ruleStatusVal" label="状态" width="100" align="center" />
                           
                        <el-table-column prop="enableTime" label="启用时间" width="170" align="center">
                            <template #default="scope">
                                <div style="color: #333;">{{ parseTime(scope.row.enableTime, '{y}-{m}-{d}') || '-' }}
                                </div>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                </div>
            </div>
            <footer>
                <div>
                    <el-button type="primary" class="search_button button" @click="successBtn">{{ confirm }}</el-button>
                    <el-button class="reset_button button" @click="cancelBtn">{{ cancel }}</el-button>
                </div>
            </footer>
        </el-dialog>
    </div>
</template>
  
<script name="priceFormulaListDialog" setup>
import { parseTime } from "@/utils/util"
import { ref } from 'vue'
const props = defineProps({
    dialogData: {
        type: Object,
        default: () => {
            return {
                message: '',
                data: []
            }
        }
    },
    confirm: {
        type: String,
        default: () => '确定'
    },
    cancel: {
        type: String,
        default: () => '取消'
    },


});
const visible = ref(true)
const emit = defineEmits(['setDialogBtn'])
const successBtn = () => {
   
    visible.value = false
    emit('setDialogBtn', true)
}
const cancelBtn = () => {
    visible.value = false
    emit('setDialogBtn', false)
}

</script>

<style lang="scss" scoped>
.popupContainer {
    &:deep(.el-dialog__header) {
        margin-right: 0;
        padding: 8px 24px;
        background-color: var(--vt-c-theme-colors);
        height: 40px;
        box-sizing: border-box;
        position: relative;
    }

    :deep(.el-dialog) {
        width: 62.5%;
        min-width: 700px;
        height: 53.4%;
        min-height: 300px;
        overflow: hidden;
        margin: 200px auto 0;
        padding-bottom: 80px;
        box-sizing: border-box;
    }
    .contentBox{
        padding-top: 16px;
        box-sizing: border-box;
    }
    .hintBox {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .text {
            color: #FFFFFF;
        }

        .closeImg {
            width: 30px;
            height: 30px;
            cursor: pointer;
        }
    }

    &:deep(.el-dialog__body) {
        padding: 16px 32px 32px 32px;
        box-sizing: border-box;
    }

    .hintContent {
        font-size: 14px;
        color: #333;
    }

    footer {
        width: 100%;
        background-color: #fff;
        height: 80px;
        position: absolute;
        left: 0;
        bottom: 0;
        padding-top: 16px;
        box-sizing: border-box;
        z-index: 99;
        >div {
            margin: 0 auto;
            text-align: center;
            .button {
                width: 96px;
                margin: 0 40px;
            }
        }

    }


}
</style>
<template>
    <div class="changePopupBox">
        <el-dialog v-model="dialogVisible" :title="changeHint.title" width="30%" destroy-on-close :show-close="false"
            :close-on-click-modal="false">
            <template v-if="changeHint.type == 1">
                <div class="cannotChange">
                    <template v-for="(value, key, index) in changeHint.hintData" :key="index">
                        <div class="item">{{ value }}</div>
                    </template>
                </div>
            </template>
            <template v-if="changeHint.type == 2">
                <div class="changeCostInfo" v-for="(item, index) in changeHint.hintData" :key="index">
                    <div>本次变更：<span style="color:red;">{{ item.poSn }}</span></div>
                    <!-- item.isOfflineQuotation 是否线下报价 -->
                    <div v-if="!item.isOfflineQuotation">变更内容系统生成差价单，
                        <span v-if="item.goodsPriceDiff >= 0">差价</span><span
                            v-if="item.goodsPriceDiff < 0">退款</span>金额为：<span style="color:red;">{{ item.goodsPriceDiff
                                + '元' }}</span>
                    </div>
                    <div v-else>变更内容系统需要在提交变更后生成人工报价单，由报价员人工报价，来对比变更前后价格来计算差价或退款。</div>
                    <div>变更单当前是<span style="color:red;">{{ '【' +
                        item.orderStatusName + '】' }}</span>状态，可能会有生产损耗费用和文件重做费用，费用金额以订单执行部门会审结果为准。</div>
                </div>
            </template>
            <template #footer>
                <el-button class="closePopup" v-if="changeHint.type == 1" @click="close">关闭</el-button>
                <template v-if="changeHint.type == 2">
                    <el-button class="confirmPopup" @click="confirm">确认提交</el-button>
                    <el-button class="cancelPopup" @click="close">
                        取消
                    </el-button>
                </template>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        default: false
    },
    changeHint: {
        type: Object,
        default: {
            type: '', // 类型  1 不可变更   2 变更费用信息
            title: '', // 标题
            hintData: {} // 提示数据
        }
    }
})
const emits = defineEmits(["update:dialogVisible", "confirm"]);
function close() {
    emits("update:dialogVisible", false);
}

function confirm() {
    emits("confirm")
}
</script>

<style lang="scss" scoped>
.changePopupBox {
    &:deep(.el-dialog__body) {
        padding-top: 0 !important;
        max-height: 50vh;
        overflow-y: auto;
    }

    .cannotChange {
        .item {
            margin-top: 20px;
        }
    }

    .changeCostInfo {
        padding: 20px 0;
    }

    .changeCostInfo:not(:last-child) {
        border-bottom: 1px dashed #333;
    }

    .closePopup {
        background-color: $bgColor;
        color: $color;
        border: $borColor;
    }

    .cancelPopup:focus,
    .cancelPopup:hover {
        background-color: transparent !important;
        color: #606266 !important;
        border: 1px solid $bgColor !important;
    }

    .confirmPopup {
        background-color: $bgColor;
        color: $color;
        border: $borColor;
    }

    &:deep(.el-dialog__footer) {
        text-align: center;
    }
}
</style>
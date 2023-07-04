<template>
    <el-dialog v-model="modelValue" :class="'ac-dialog'" :close-on-click-modal="closeOnClickModal" align-center v-bind="$attrs">
        <slot>内容</slot>
        <template #footer>
            <slot name="footer">
                <span class="ac-dialog-footer">
                    <el-button class="confirm-button" type="primary" @click="handleBtnClick(true)">
                        {{ primaryButtonText }}
                    </el-button>
                    <el-button class="cancel-button" @click="handleBtnClick(false)">{{secondaryButtonText}}</el-button>
                </span>
            </slot>
        </template>
    </el-dialog>
</template>

<script setup>
/**
 * 包装el-dialog
 * Dialog api参见：https://element-plus.gitee.io/zh-CN/component/dialog.html#%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95
 */
import { getCurrentInstance } from 'vue';
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
        required: false,
    },
    //主要按钮的文本
    primaryButtonText:{
        type: String,
        default: '确定',
        required: false,
    },
    //次要按钮的文本
    secondaryButtonText:{
        type: String,
        default: '取消',
        required: false,
    },
    //点击遮罩是否关闭
    closeOnClickModal:{
        type: Boolean,
        default: false,
        required: false,
    }
})

//const dialogClass = ;
const modelValue = ref(props.modelValue);

let {proxy}  = getCurrentInstance()

watch(() => props.modelValue, (n) => {
    modelValue.value = n
})

const emit = defineEmits(['update:modelValue', 'bottom-btn-click'])

//点击底部的按钮
const handleBtnClick = (confirm) => {
    emit('update:modelValue', confirm)
    emit('bottom-btn-click', { confirm })
}

//主动关闭方法
const close = () => {
    modelValue.value = false;
}

defineExpose({
    close
})
</script>

<style lang="scss">
.ac-dialog {

    .el-dialog__header {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-right: 0;
        background-color: var(--vt-c-theme-colors);
    }

    .el-dialog__title {
        font-size: 15px;
        font-weight: 600;
        color: #FFF;
    }

    .el-dialog__headerbtn {
        top: -4px;

        .el-dialog__close {
            font-size: 24px;
            color: #fff;
        }
    }
}

.ac-dialog-title {
    font-size: 16px;
    color: #333;
    line-height: 21px;
    margin: 16px 0;
}

.ac-dialog-footer {
    display: flex;
    justify-content: center;

    .el-button {
        margin: 0 40px;
    }

    .cancel-button {
        background-color: #fff !important;
        color: var(--vt-c-theme-colors) !important;
        border: 1px solid var(--vt-c-theme-colors) !important;
    }

    .cancel-button:hover,
    .confirm-button:hover {
        opacity: .75;
    }

    .confirm-button {
        background: var(--vt-c-theme-colors) !important;
        border-color: var(--vt-c-theme-colors) !important;
    }
}
</style>


<template>
    <transition name="msgbox">
        <div v-if="showModal" class="boxModal">
            <!-- 选项提示框 -->
            <div v-if="showModal" class="msgbox-container" :class="className">
                <header>
                    {{ title }}
                    <img class="close_button" src="@/assets/images/close.png" alt="" @click="cancelBtn">
                </header>
                <div class="content-body">
                    <div>{{ content }}</div>
                </div>
                <footer>
                    <div>
                        <el-button type="primary" class="search_button button" @click="successBtn">{{ confirm }}</el-button>
                        <el-button class="reset_button button" @click="cancelBtn">{{ cancel }}</el-button>
                    </div>
                </footer>
            </div>
        </div>
    </transition>
</template>
<script name="popupBox" setup>
import { onBeforeMount } from 'vue'
const props = defineProps({
    showModal: {//显示模态对话框
        type: Boolean,
        default: () => false
    },
    title: {
        type: String,
        default: () => '提示'
    },
    content: {
        type: String,
        default: () => '暂无提示内容'
    },
    confirm: {
        type: String,
        default: () => '确定'
    },
    cancel: {
        type: String,
        default: () => '取消'
    },
    className: {
        type: String,
        default: () => ''
    },
    timeout: {
        type: Number,
        default: () => 1500
    },
});

onBeforeMount(() => {
    //如果发现已经存在了就进行删除
    let node = document.querySelector(".boxModal");
    console.log(node)
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
})
// const emit = defineEmits(['setShowModal'])
const successBtn = () => {
    // props.showModal = false
    // emit('setShowModal', true)
}
const cancelBtn = () => {
    // props.showModal = false
    // emit('setShowModal', false)
}

</script>

<style lang="scss" scoped>
.boxModal {
    width: 100%;
    height: 100%;
    // background: rgba(196, 196, 196, 0.43);
    background: rgba(0, 0, 0, .5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
}

.msgbox-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    min-height: 280px;
    background: #fff;
    color: #555;
    transform: translate(-50%, -50%);
    z-index: 10000;

    header {
        height: 40px;
        line-height: 40px;
        background: var(--vt-c-theme-colors);
        font-size: 16px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #FFF;
        padding: 0 24px;
        box-sizing: border-box;
        position: relative;
        .close_button{
            position: absolute;
            width: 30px;
            height: 30px;
            right: 24px;
            top:50%;
            transform: translateY(-50%);
            cursor: pointer;
        };
    }

    .content-body {
        min-height: 160px;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        /*水平主轴居中*/
        align-items: center;

        /*垂直交叉轴居中*/
        div {
            font-size: 14px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #333;
        }
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
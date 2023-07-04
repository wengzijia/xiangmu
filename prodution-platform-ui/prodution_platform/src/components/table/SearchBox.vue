<template>
    <section class="ac-searchbox">
        <main ref="searchboxContent" class="ac-searchbox-content" :class="{ 'is-reverse': !boxOpened }">
            <slot></slot>
        </main>
        <footer class="ac-searchbox-switch" @click="handleToggle">
            <svg width="59" height="12" viewBox="0 0 59 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path class="icon-arrow-wrap"
                        d="M59 0C49 8 50.9411 12 41 12L18 12C8.05887 12 7 6.33333 0 -2.57897e-06L59 0Z"
                        :fill="boxOpened ? 'white' : 'var(--default-main-color)'" />
                    <path d="M33 4L29 8L25 4" :stroke="boxOpened ? 'var(--default-main-color)' : 'white'"
                        stroke-width="1.17" stroke-linejoin="round" class="icon-arrow"
                        :class="{ 'is-reverse': boxOpened }" />
                </g>
            </svg>
        </footer>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

//计算内容区域高度（为了配合css的动画）
const searchboxContent = ref(null);//ref
let contentEL;
const heightAutoAdjust = () => {
    if(contentEL.clientHeight){
        contentEL.style.height = "";
        contentEL.style.height = (contentEL.clientHeight) + 'px'
    }
}
onMounted(() => {
    contentEL = searchboxContent.value
    heightAutoAdjust()
    window.addEventListener("resize", () => heightAutoAdjust())
});

onUnmounted(() => {
    window.removeEventListener("resize", () => heightAutoAdjust())
})

//切换展开状态
const emit  = defineEmits(['toggleExpanded'])
const boxOpened = ref(true);
const overflowHidden = ref(false);
const handleToggle = () => {
    contentEL.style.overflow = (!boxOpened.value) ? 'visible' : 'hidden';
    boxOpened.value = !boxOpened.value
    let expanded = boxOpened.value
    console.log(2222)
    emit('toggleExpanded',expanded)
}
</script>

<style lang="scss">
.ac-searchbox {
    box-sizing: border-box;
    position: relative;
    margin-bottom: 16px;
    padding: 0 20px 0 20px;
    background-color: #fff;
    border-radius: 4px;
}

.ac-searchbox-content {
    padding-top: 20px;
    padding-bottom: 2px;
    opacity: 1;
    transition: all 0.3s ease-in;
    box-sizing: border-box;

    &.is-reverse {
        transition: all 0.3s ease-out;
        opacity: 0.5;
        height: 0 !important;
        padding-top: 0;
        padding-bottom: 0;
    }

    .select_top {
        padding-bottom: 0 !important;
    }

    .el-form-item__content {
        line-height: 29px;
    }

    .el-form-item__label {
        line-height: 29px;
        height: 29px;
    }

    .el-input {
        line-height: 29px;
        height: 29px;
    }

    .el-input__wrapper {
        line-height: 27px;
        height: 27px;
    }

    .el-input__inner {
        height: 27px;
        line-height: 27px;
    }
}

.ac-searchbox-switch {
    position: absolute;
    left: 50%;
    width: 51px;
    bottom: -12px;
    height: 12px;
    margin-left: -25px;
    background-color: #FFFFFF;
    border-radius: 0 0 25px 25px;
    text-align: center;
    z-index: 2;
    font-size: 0;
    cursor: pointer;
    //transition: transform var(--el-transition-duration);

    &:hover {
        opacity: 0.75;
    }

    /* .is-reverse {
        background-color: #FFFFFF;

        .icon-arrow {
            transform: rotateZ(-180deg);
        }
    }
 */

@function color($color, $hue: 0deg, $lightness: 0%, $saturation: 0%, $alpha: 0) {
    @return hsla(
        calc(#{hue($color)} + #{$hue}), 
        calc(#{lightness($color)} + #{$saturation}),
        calc(#{saturation($color)} + #{$lightness}),
        calc(#{alpha($color)} + #{$alpha}),
    );
}


    .icon-arrow-wrap:hover {
        fill: var(--default-main-color)!important;
        opacity: 0.45;
    }

    .icon-arrow {
        font-size: 12px;
        line-height: 12px;
        height: 1em;
        width: 1em;
        color: var(--default-main-color);
        transition: transform 0.5 ease-in;
        transform: rotateX(0);
        transform-origin: center;

        &.is-reverse {
            transform: rotateX(180deg);
        }
    }
}</style>
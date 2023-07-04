<template>
    <div class="distitle">
        <div>
        处理中：<span>{{ processing }}</span> 
        </div>
        <div>
        待处理：<span>{{ toBeProcessed }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    processing:{
        type:Number,
        default:0
    },
    toBeProcessed:{
        type:Number,
        default:0
    }
})
// const emits = defineEmits(['update:processing','update:toBeProcessed']);
</script>

<style lang="scss" scoped>

.distitle{
display: flex;
line-height: 32px;
div{
    margin-left: 16px;
    font-weight: 600;
    span{
    font-weight: 500;
    color: #F56C6C;
    }
}
}
</style>

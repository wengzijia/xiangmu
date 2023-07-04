<template>
    <section class="ac-table-title-bar">
        <slot name="left"></slot>
        <slot name="center"></slot>
        <slot name="right"></slot>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
</script>

<style lang="scss">
.ac-table-title-bar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -10px;
    line-height: 40px;
    font-size: 15px;
    font-weight: 600;
    color: #333;
}

.ac-table-title__button-group {
    display: inline-flex;
    .el-button.is-link {
        color: var(--default-main-color)!important;
        margin-right: 5px!important;
    }

    .el-button.is-link:focus, .el-button.is-link:hover {
        opacity: 0.75;
    }

    .el-icon,.svg-icon-spin {
        margin-right: 3px!important;
    }
}
</style>
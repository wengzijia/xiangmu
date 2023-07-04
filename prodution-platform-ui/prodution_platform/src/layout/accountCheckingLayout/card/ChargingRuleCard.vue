<template>
    <dl class="ac-description">
        <template v-if="rule.verison">
            <dt class="ac-description__label">版本:</dt>
            <dd class="ac-description__content">V{{ rule.verison }}</dd>
        </template>
        <dt class="ac-description__label">公式详情:</dt>
        <dd class="ac-description__content" style="white-space:normal;">
            {{ rule.detail }}
        </dd>
        <template v-if="rule.time">
            <dt class="ac-description__label">启用时间:</dt>
            <dd class="ac-description__content">{{ parseTime(rule.time, '{y}-{m}-{d}') }}</dd>
        </template>
    </dl>
</template>

<script setup>
import { parseTime } from '@/utils/util'
const props = defineProps({
    rule: {
        type: Object,
        required: true,
        default: () => ({})
    }
})
</script>

<style lang="scss">
.ac-description {
    margin: 0;
    padding: 0;
    display: flex;

    &__label {
        margin: 0;
        padding: 0;
        font-size: 14px;
        color: #333;
        line-height: 21px;
        white-space: nowrap;
        margin-right: 10px;
    }

    &__content {
        margin: 0;
        padding: 0;
        margin-right: 60px;
        font-size: 14px;
        color: #666;
        line-height: 21px;
        white-space: nowrap;
    }
}
</style>
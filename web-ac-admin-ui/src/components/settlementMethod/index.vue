<template>
  <span>
    {{ methodName ? methodName.optionDesc : '-' }}
  </span>
</template>

<script setup>
const props = defineProps({
  // 数据
  methodId: {
    type: String,
    default: '',
  },
  // 数据
  methodList: {
    type: Array,
    default: [],
  },
})
const methodName = computed(() => {
  if (props.methodId != '') {
    return props.methodList.find((item) => item.id == props.methodId)
  } else {
    return ''
  }
})
</script>

<style scoped></style>

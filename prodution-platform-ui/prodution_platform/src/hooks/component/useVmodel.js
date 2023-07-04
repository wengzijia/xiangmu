/**
 * vue3 自定义v-model
 * (vue3的setup语法如何自定义v-model为公用hooks)
 * 来源:https://www.zhangshengrong.com/p/x7XR9onzNz/
 
 使用方法：

 <!-- 子组件 childModel -->
<template>
  <input type="text" v-model="modelValue" />
  <input type="text" v-model="test" />
</template>
 
<script setup>
import { useVmodel } from "./hooks/useVmodel";

const props = defineProps({
  modelValue: String,
  test: String,
});
const emits = defineEmits('update:modelValue');
const modelValue = useVmodel(props);
const test = useVmodel(props, "test",emits);
</script>
 
<!-- 父组件 -->
<template>
  <Model v-model="modelValue" v-model:test="test" />
</template> 
 
<script setup>
import { ref, watch } from "vue";
import Model from "./childModel.vue";
 
const modelValue = ref("");
const test = ref("");
</script>
 */
import { ref, watch, getCurrentInstance } from "vue";
export function useVmodel(props, key = "modelValue", emit) {
  const vm = getCurrentInstance();
  const _emit = emit || vm?.emit;
  const event = `update:${key}`;
  const proxy = ref(props[key]);
  watch(
    () => proxy.value,
    (v) => _emit(event, v),
    { deep: true }
  );
  return proxy;
}
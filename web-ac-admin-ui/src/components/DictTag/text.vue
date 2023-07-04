<template>
  <div>
    <template v-for="(item, index) in options">
      <template v-if="values.includes(item.value)">
        <span
          :key="item.value"
          :index="index"
          :class="item.elTagClass"
        >{{ item.label }}</span>
        
      </template>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  // 数据
  options: {
    type: Array,
    default: [],
  },
  // 当前的值
  value: [Number, String, Array],
  dict:String
})
const { proxy } = getCurrentInstance();
const dict = proxy.useDict(props.dict);
const emits = defineEmits(["update:options", "update:value",'change']);
emits('update:options',dict[props.dict].value);
// console.log('dict[props.dict]',dict[props.dict].value)
let options = ref(dict[props.dict])
const values = computed(() => {
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)];
  } else {
    return [];
  }
})

</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
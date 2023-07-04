<!-- 
  <DictSelect  v-model="queryParams.status" :dict='"sys_normal_disable"' all></DictSelect>
  dict:字典类型
  all：是否添加全部这个选项  可自定义属性值{label:'全部2',value:'4445'}
 -->

<template>
  <div>
    <el-select
      v-model="refValue"
      :placeholder="placeholder"
      :size="props.size"
      @change="changeValues"
      :multiple="props.multiple"
      :clearable="props.clearable"
      popper-class="dictSelect"
    >
      <el-option
        v-for="(item, index) in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
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
  modelValue: [Number, String, Array],
  dict: String,
  size: {
    type: String,
    default: "default",
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  all: [String, Object, Boolean],
});
const { proxy } = getCurrentInstance();
const dict = proxy.useDict(props.dict);
const emits = defineEmits(["update:options", "update:modelValue", "change"]);
let options = ref();
watch(dict[props.dict], function (val) {
  setOptions(val)
});

function setOptions(val){
  if (props.all || props.all === "") {
    let obj;
    if (props.all.label) {
      obj = props.all;
    } else {
      obj = {
        label: "全部",
        value: "",
      };
    }
    options.value = [obj, ...val];
  } else {
    options.value = [...val];
  }
}


function changeValues(val) {
  emits("update:modelValue", val);
  emits("change", val);
}
let refValue = ref(null);
if (props.modelValue) {
  refValue.value = props.modelValue;
}

/** 监听props的数据，modelValue属性同步 */
watch(props, function (newVal) {
  if (newVal.modelValue != refValue.value) {
    refValue.value = newVal.modelValue;
  }
});
if(dict[props.dict]) setOptions(dict[props.dict].value)
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>

<template>
    <!--  <el-select :filter-method="searchFilter" clearable filterable placeholder="搜索加工商" no-match-text="无匹配项">
        <el-option v-for="item in processorArr" :key="item.manufacturerId" :label="item.manufacturerName"
            :value="item.manufacturerName" />
    </el-select> -->

    <filterable @dropFilterableChange="filterableChange" :manufacturerName="manufacturerName" :defaultValuelist="nameList"
        @dropFilterableSelect="filterableSelect" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAllManufacturerList2 } from "@/api/modules/processor";
import filterable from "@/layout/commonLayout/filterable.vue";
import { useVModel } from '@vueuse/core'

const props = defineProps({
    modelValue: String,
    industrialParkId: {
        type: String,
        default: () => null
    },
});

const emits = defineEmits(['update:modelValue', 'select'])
const manufacturerName = useVModel(props, 'modelValue', emits);

//加工商
const nameList = ref([])

/**
 * 获取 加工商名称
 */
async function getProcessorNameList() {
    let { code, data, message } = await getAllManufacturerList2({ industrialParkId: props.industrialParkId ? parseInt(props.industrialParkId) : null });
    if (code == '000000') {
        nameList.value = Object.keys(data).map((k) => ({ manufacturerName: data[k], manufacturerId: k }))
    } else {
        ElMessage.error(message)
    }
}

const filterableChange = (val) => {
    manufacturerName.value = val
    emits('select', {
        manufacturerId: null,
        manufacturerName: val
    })
}

const filterableSelect = (label, item) => {
    manufacturerName.value = label
    emits('select', item)
}

watch(() => props.industrialParkId, (n) => {
    getProcessorNameList()
})

watch(() => props.modelValue, (n) => {
    manufacturerName.value = n
})

onMounted(() => {
    getProcessorNameList()
});
</script>
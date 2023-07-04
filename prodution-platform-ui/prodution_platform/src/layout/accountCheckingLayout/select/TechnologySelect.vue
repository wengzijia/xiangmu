<template>
    <el-select multiple collapse-tags collapse-tags-tooltip placeholder="全部"  clearable>
        <el-option v-for="item in attributeList" :key="item.attributeId" :label="item.attributeName"
            :value="item.attributeId" />
    </el-select>
</template>

<script setup>

/**
 * 工艺选择
 */
import { onMounted, ref } from "vue";
import { getAttriList } from "@/api/modules/processor.js";

const attributeList = ref([]);
function getAttributeIdsList() {
    getAttriList().then(res => {
        if (res.code != '000000') return
        attributeList.value = res.data || []
    })
}
onMounted(() => {
    getAttributeIdsList()
});
</script>
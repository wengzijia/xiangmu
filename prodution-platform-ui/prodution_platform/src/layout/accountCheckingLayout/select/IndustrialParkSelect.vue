<template>
    <el-select v-model="industrialId" :clearable="clearable" placeholder="全部" class="pos-industrial"
        :class="{ 'static': static }" @change="selectPark">
        <el-option v-for="item in parkList" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getIndustrialParkListByAuthor } from "@/api/modules/processor";
import { useVmodel } from '@/hooks/component/useVmodel'

// 产业园切换
const parkList = ref([])

const props = defineProps({
    modelValue: {
        //type:Number,
        default: null,
    },
    //可清空的
    clearable: {
        type: Boolean,
        default: false
    },
    //静态的，不要绝对定位的
    static: {
        type: Boolean,
        default: false
    }
});

const industrialId = useVmodel(props);

const emits = defineEmits(['change', 'update:modelValue'])

const getParkList = () => {
    let temp = []
    getIndustrialParkListByAuthor().then(res => {
        if (res.data && res.data.length) {
            res.data.map(item => {
                temp.push({ label: item.parkName, value: item.id })
            })
            parkList.value = temp
            if (!props.static) {
                industrialId.value = temp[0].value
                emits('change', industrialId.value)
            }
        }
    })
}

const selectPark = () => {
    console.log(11111)
    emits('change', industrialId.value)
}

watch(() => props.modelValue, (n) => {
    //console.log(666, industrialId.value,n)
    industrialId.value = n && (n+'') || null
})

onMounted(() => {
    getParkList()
});
</script>

<style lang="scss" scoped>
.pos-industrial {
    width: 200px;
    position: absolute;
    top: 54px;
    right: 24px;

    &.static {
        position: initial;
    }
}
</style>
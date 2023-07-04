<template>
    <div class="ac-range-input">
        <el-input class="ac-range-input__input" :type="inputType" placeholder="请输入" v-model="state.min" @change="handleInputChange" @input="handleInput(1)"  clearable></el-input>
        <span>{{ unit }}</span>
        <span class="ac-range-input__separator">-</span>
        <el-input class="ac-range-input__input" :type="inputType"  placeholder="请输入" v-model="state.max" @change="handleInputChange" @input="handleInput(2)"  clearable></el-input>
        <span>{{ unit }}</span>
    </div>
</template>

<script setup>
import { reactive,unref } from 'vue'
import { ElMessage } from "element-plus";
import {trimToNumber,trimLastDigit} from '@/utils/util'

const props = defineProps({
    modelValue:{
        type: Array,
        default: [],
        required: true,
    },
    //业务名称：比如 差异率
    fieldName: {
        type: String,
        default: '',
        required: false,
    },
    //单位:比如 %，米
    unit: {
        type: String,
        default: '',
        required: false,
    },
    //输入框的类型:参见el-input的文档
    inputType: {
        type: String,
        default: 'text',
        required: false,
    },
   /*  //允许的最小值
    minValue: {
        type: [Number,String],
        default: '',
        required: false,
    },
    //允许的最大值
    maxValue: {
        type: [Number,String],
        default: '',
        required: false,
    }, */
    //最大值小于最小值的情况下的报错信息
    maxLessThenMinMessage:{
        type: String,
        default: '最大值不能小于最小值',
        required: false,
    }
});

const initState  =()=>{
    let [min,max] = props.modelValue
    return {
        min,max
    }
}
const state = reactive(initState())

watch(()=>props.modelValue,(n)=>{
    const [min,max] = n
    state.min = min
    state.max = max
})

const emit = defineEmits(['change','update:modelValue'])

/**
 * 输入框格式化
 */
const handleInput= (type)=>{
    //type: 1 最小值，2 最大值
    if(type ==1){
        state.min = trimToNumber(state.min,4,2,true)
    }else{
        state.max = trimToNumber(state.max,4,2,true)
    }
}

const handleInputChange =()=>{
    //输入确定后，截取尾部的小数点
    state.min = trimLastDigit(state.min)
    state.max = trimLastDigit(state.max)
    console.log(222,state.min,state.max)

    if(state.min && isNaN(state.min)){
        return ElMessage({
            showClose: true,
            message: `${props.fieldName}最小值必须是数字`,
            type: 'error',
        })
    }

    if(state.max && isNaN(state.max)){
        return ElMessage({
            showClose: true,
            message: `${props.fieldName}最大值必须是数字`,
            type: 'error',
        })
    }
    const {min,max} = unref(state)
    let minValue = Number.parseFloat(min);
    let maxValue = Number.parseFloat(max);
    const data = [min,max]
    emit('update:modelValue', data)
    emit('change', data)

    if(minValue && maxValue && maxValue<minValue){
       return ElMessage({
            showClose: true,
            message: `${props.fieldName}${props.maxLessThenMinMessage}`,
            type: 'error',
        })
    }
}

</script>


<style lang="scss">
.ac-range-input {
    display: inline-flex;
    &__input{
        max-width: 90px;
        margin:0 5px 0 0;
    }
    &__separator{
        margin:0 5px;
    }
}

</style>
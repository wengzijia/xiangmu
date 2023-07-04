<template>
    <div class="filterable_box">

        <el-form-item :label="label" class="manufacturerBox">
            <el-input v-model="manufacturerName" @input="searchChange" @focus="searchFocus" :placeholder="placeholder"
                @blur="searchBlur" clearable  style="width:192px" @compositionstart="handleCompositionstart" @compositionend="handleCompositionend"/>
            <div v-show="searchFocusFlag" class="item-manufacturerBox">
                <ul v-if="processorArr && processorArr.length > 0">
                    <li v-for="(item, index) in processorArr" :key="index"
                        :class="{ active: manufacturerName == item[keys] }"
                        @click.stop="selectManufacturerName(item[keys], item)">{{ item[keys] }}</li>
                </ul>
                <ul v-else class="noData">
                    <li>暂无数据</li>
                </ul>
                <span class="el-popper__arrow_yun"></span>
            </div>
        </el-form-item>

    </div>
</template>

<script name="filterable" setup>
import { ref } from "vue";
import { useDebounceFn } from '@vueuse/core'
const props = defineProps({
    manufacturerName: {
        type: String,
        default: () => null
    },
    defaultValuelist: {
        type: Array,
        default: () => []
    },
    label: {
        type: String,
        default: () => '加工商'
    },
    placeholder: {
        type: String,
        default: () => '请输入'
    },
    keys: {
        type: String,
        default: () => 'manufacturerName'
    }


});
let processorArr = ref(props.defaultValuelist)
let defaultValuelist = props.defaultValuelist //存放初始选项的搜索值

const manufacturerName = ref(props.manufacturerName)
const searchFocusFlag = ref(false)//加工商输入框是否获取焦点
watch(
    () => props.manufacturerName,
    (newVal, oldVal) => {
        manufacturerName.value = newVal
    }
)
watch(
    () => props.defaultValuelist,
    (newVal, oldVal) => {
        processorArr.value = newVal
        defaultValuelist = newVal
    }
)


/**
 * 加工商输入框获取焦点事件
 */
const searchFocus = () => {
    filterprocessorData(manufacturerName.value)
    searchFocusFlag.value = true
}
const emit = defineEmits(['dropFilterableChange', 'dropFilterableSelect'])
/**
 * 加工商输入框失去焦点事件
 */
const searchBlur = (e) => {
    //console.log('blur',e)
    setTimeout(() => {
        searchFocusFlag.value = false
    }, 200);
}
/**
 * 加工商输入框输入时触发
 */
const searchChange = useDebounceFn((e) => {
    console.log('input',e)
    filterprocessorData(e)
    emit('dropFilterableChange', e)
}, 50)

function filterprocessorData(val) {
    if (val) {
        processorArr.value = defaultValuelist.filter(item => {
            if (item[props.keys].includes(val)) return item
        })
    } else {
        processorArr.value = defaultValuelist
    }
}
/**
 * 加工商下拉框，用户选择某项点击事件
 * @param {*} val 
 */
const selectManufacturerName = (val, item) => {
    manufacturerName.value = val
    searchFocusFlag.value = false
    console.log('select',val,item)
    emit('dropFilterableChange', val)
    emit('dropFilterableSelect', val, item)////传递2个参数，接收方收到的是个数组

}

const handleCompositionstart=(e)=>{
    console.log('Compositionstart',e)
}

const handleCompositionend=(e)=>{
    console.log('Compositionend',e)
    //检测到待选字符（键盘上输入的字符，但是没有选定中文，这个时候e.data中有单引号）
    if(e.data && e.data.indexOf("'")>-1){
       //无法做什么。
    }
}
</script>

<style lang="scss" scoped>
.filterable_box {
    display: inline-block;

    .manufacturerBox {
        position: relative;

        .item-manufacturerBox {
            z-index: 2049;
            position: absolute;
            inset: 160px auto auto 298px;
            margin: 0px;
            left: 0;
            top: 0;
            width: 100%;
            padding-top: 46px;
            box-sizing: border-box;

            ul {
                padding: 0;
                margin: 0;
                cursor: pointer;
                background: var(--el-bg-color-overlay);
                border: 1px solid var(--el-border-color-light);
                box-shadow: var(--el-box-shadow-light);
                border-radius: 4px;
                max-height: 260px;
                padding: 6px 0;
                box-sizing: border-box;
                overflow: auto;

                >li {
                    padding-left: 20px;
                    box-sizing: border-box;
                    color: var(--el-text-color-regular);

                    &:hover {
                        background-color: var(--el-fill-color-light);
                    }
                }

                .active {
                    color: var(--el-color-primary);
                    background-color: var(--el-fill-color-light);
                }
            }

            .noData {
                color: var(--el-text-color-secondary);
                font-size: var(--el-select-font-size);
                text-align: center;

                >li {
                    padding-left: 0;
                    color: var(--el-text-color-secondary);
                    font-size: var(--el-select-font-size);
                    text-align: center;

                    &:hover {
                        background-color: #fff;
                    }
                }
            }


            .el-popper__arrow_yun {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: 40px;
                width: 10px;
                height: 10px;

                &::after {
                    content: '';
                    position: absolute;
                    display: block;
                    border-style: solid;
                    border-width: 0 10px 10px;
                    border-color: transparent transparent var(--el-bg-color-overlay);
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 100;
                }
            }

        }
    }
}
</style>
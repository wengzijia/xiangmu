<template>
    <div class="page_box">
        <!-- close-on-click-modal 设置点击空白是否可以关闭模态框-->
        <el-dialog v-model="centerDialogVisible" width="700px" :show-close="false" :close-on-click-modal="false"
            destroy-on-close>
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    {{ title }}
                    <span>
                        <el-icon size="16px" @click="handleResetSelecter(false)">
                            <CloseBold />
                        </el-icon>
                    </span>
                </div>
            </template>
            <div class="dialog_main">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="大版满版" name="first">
                        <ul class="checkBox">
                            <li v-for="(item, index) in options.first" :class="{ active: item.checked }"
                                @click="handleSelecter(index, 'first')">
                                <span>{{ item.attributeName }}</span>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="大版局部" name="second">
                        <ul class="checkBox">
                            <li v-for="(item, index) in options.second" :class="{ active: item.checked }"
                                @click="handleSelecter(index, 'second')">
                                <span>{{ item.attributeName }}</span>
                            </li>
                        </ul>
                    </el-tab-pane>

                    <el-tab-pane label="PO工艺" name="third">
                        <ul class="checkBox">
                            <li v-for="(item, index) in options.third" :class="{ active: item.checked }"
                                @click="handleSelecter(index, 'third')">
                                <span>{{ item.attributeName }}</span>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="组合工艺" name="fourth">
                        <ul class="checkBox">
                            <li v-for="(item, index) in options.fourth" :class="{ active: item.checked }"
                                @click="handleSelecter(index, 'fourth')">
                                <span>{{ item.attributeName }}</span>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="自定义工序" name="fifth">
                        <ul class="checkBox">
                            <li v-for="(item, index) in options.fifth" :class="{ active: item.checked }"
                                @click="handleSelecter(index, 'fifth')">
                                <span>{{ item.attributeName }}</span>
                            </li>
                        </ul>
                    </el-tab-pane>

                    
                </el-tabs>
                <div class="dialog-footer"><el-button type="primary" class="search_button"
                        @click="handleResetSelecter(true)">
                        确定
                    </el-button></div>
            </div>

        </el-dialog>
    </div>
</template>

<script name="attributeIdIndex" setup>
import { ref } from "vue";
import { getManufacturerAttList } from "@/api/modules/processor";
const centerDialogVisible = ref(true)
const props = defineProps({
    defaultCheck: {
        type: Object,
        default: () => {
            return []
        },
    },
    title: {
        type: String,
        default: () => "分配工艺",
    }
});

console.log('defaultCheck', props.defaultCheck)



const options = ref({
    first: [],
    second: [],
    third: [],
    fourth: []
})
//设置默认选中值
const setDefaultCheck = () => {
    for (let key in options.value) {
        const items = options.value[key]
        props.defaultCheck.forEach(val => {
            items.forEach(ele => {
                if (val.attributeId == ele.attributeId) return ele.checked = true
            });
        })
    }
}
//获取分配的工艺
getManufacturerAttList().then(res => {
    if (res.code != '000000') return ElMessage({
        showClose: true,
        message: res.message || '服务错误',
        type: 'error',
    })
    options.value = {
        first: res.data[0].manufacturerAttributeList,
        second: res.data[1].manufacturerAttributeList,
        third: res.data[2].manufacturerAttributeList,
        fourth: res.data[3].manufacturerAttributeList,
        fifth: res.data[4].manufacturerAttributeList
    }
    if(props.defaultCheck && props.defaultCheck.length > 0) setDefaultCheck()
})

const activeName = ref('first')
//点击选中以及取消选中功能
const handleSelecter = (index, key) => {
    options.value[key][index].checked = !options.value[key][index].checked
}
const emit = defineEmits(['dropDownValueChange'])
//点击确定按钮
const handleResetSelecter = (flag) => {
    centerDialogVisible.value = false
    const checkedList = []
    if (flag) {
        for (let key in options.value) {
            const items = options.value[key]
            items.forEach(ele => {
                if (ele.checked) checkedList.push(ele)
            });
        }
    }
    //如果flag:true,表示需要进行数据更换
    emit('dropDownValueChange', flag ? checkedList : props.defaultCheck || [])
}

const handleClick = (e) =>{
console.log('tab切换：',handleClick)
}
</script>

<style lang="scss" scoped>
.el-dialog__header {
    position: relative;
    width: 100%;

    .my-header {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 40px;
        background: var(--vt-c-theme-colors);
        line-height: 40px;
        padding: 0 24px;
        box-sizing: border-box;
        font-size: 16px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #FFF;

        span {
            position: absolute;
            right: 24px;
            height: 30px;
            width: 30px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .el-icon {
                color: #fff;
            }
        }

    }
}

.dialog_main {
    height: 440px;
    width: 100%;
    padding: 0 12px 80px;
    box-sizing: border-box;
    overflow: auto;
    position: relative;

    :deep(.el-tabs__header) {
        margin: 0;
    }

    .checkBox {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;

        >li {
            width: 100px;
            height: 25px;
            line-height: 25px;
            background: #FFFFFF;
            border-radius: 2px 2px 2px 2px;
            text-align: center;
            border: 1px solid #E0E0E0;
            font-size: 14px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #666;
            margin: 20px 20px 0 0;
            cursor: pointer;
        }

        >.active {
            border-color: var(--vt-c-theme-colors);
            color: var(--vt-c-theme-colors);
        }
    }

    .dialog-footer {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
}
</style>
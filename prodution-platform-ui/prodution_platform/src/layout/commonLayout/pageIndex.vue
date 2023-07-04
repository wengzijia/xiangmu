<template>
    <div class="page_box">
        <div class="page_total_box">共{{ totalCount }}条</div>
        <div class="page_size_box"> 每页
            <div class="page_size_selecter">
                <el-select v-model="pageData.pageSize" size="small" @change="handleSizeChange">
                    <el-option v-for="item in pageSizeArr" :key="item" :label="item" :value="item" />
                </el-select>
            </div>
            条
        </div>
        <el-pagination v-model:current-page="pageData.pageNumber" v-model:page-size="pageData.pageSize" small
            layout="prev, pager, next" :total="totalCount" class="pagination" @current-change="handleCurrentPageChange" />
        
        <div class="page_total_box">前往</div>
        <div class="page_size_box">
            <div class="page_size_selecter setPageNumber">
                <el-input v-model="goToPage" class="w-50 m-2" @input="handlePrice" @blur="setGOtoPage" size="small" />
            </div>
        </div>
        <div class="page_total_box">页</div>

        <!-- <el-pagination
            v-model:current-page="pageData.pageNumber"
            v-model:page-size="pageData.pageSize"
            :page-sizes="pageSizeArr"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
            /> -->

    </div>
</template>

<script name="pageIndex" setup>
import { ref } from "vue";
const props = defineProps({
    pageNumber: {
        type: Number,
        default: () => 1
    },
    pageSize: {
        type: Number,
        default: () => 15
    },
    totalCount: {
        type: Number,
        default: () => 0
    },
    pageSizeArr: {
        type: Array,
        default: () => [15, 30, 50, 100]
    },
});
const goToPage = ref(1)
const pageData = ref({
    pageNumber: props.pageNumber || 1,
    pageSize: props.pageSize || 15
})
//监控页码发生变化
watch(
    () => props.pageNumber,
    (newVal, oldVal) => {
        if (newVal != pageData.value.pageNumber) {
            pageData.value.pageNumber = newVal
            goToPage.value = newVal
        }
    }
)
//监控总数发生变化
watch(
    () => props.totalCount,
    (newVal, oldVal) => {
        if (newVal != pageData.value.totalCount) {
            pageData.value.totalCount = newVal
            // pageNumberArr.value = setPageNumberArr()
        }
    }
)




//计算当前总条数下，按照每页的条数，可以分为多少页
var setPageNumberArr = (flag) => {
    const { totalCount } = props
    const { pageSize } = pageData.value

    let totalPage = Math.ceil(totalCount / pageSize)
    if (flag) return totalPage
    let arr = []
    for (let i = 0; i < totalPage; i++) {
        arr.push({ pageNumber: i + 1, label: `第${i + 1}页` })
    }
    return arr
}
// var pageNumberArr = ref(setPageNumberArr())

const emit = defineEmits(['dropDownValueChange'])
// 点击切换页数
const handleCurrentPageChange = (current) => {
    pageData.value.pageNumber = current;
    goToPage.value = current
    emit('dropDownValueChange', pageData.value)

};
// 每页展示多少条数据
const handleSizeChange = (size) => {
    pageData.value.pageNumber = 1;
    pageData.value.pageSize = size;
    pageData.value.pageSizeChanged = true;
    goToPage.value = 1

    emit('dropDownValueChange', pageData.value)
};
/**
* 监听输入框事件，只允许输入正整数
* */
const handlePrice = (e) => {
    const number = e.replace(/[^\d]/g, '').replace(/^0{1,}/g, '')
    if (number < 1) return goToPage.value = 0
    goToPage.value = Number(number)
}
/**
 * 输入页数失去焦点事件
 */
const setGOtoPage = () => {
    if (goToPage.value == 0) goToPage.value = 1
    const totalPage = setPageNumberArr(true)
    if (goToPage.value > totalPage) goToPage.value = totalPage
    pageData.value.pageNumber = goToPage.value
    emit('dropDownValueChange', pageData.value)
}

</script>

<style lang="scss" scoped>
.page_box {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .page_total_box {
        margin-right: 8px;
        font-size: 12px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #3f4757;
    }

    .page_size_box {
        margin-right: 12px;
        display: flex;
        align-items: center;
        font-size: 12px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #3f4757;

        .page_size_selecter {
            width: 60px;
            margin: 0 3px;
        }

        .setPageNumber {
            width: 50px;
            // margin: 0 8px;
            margin: 0;
        }
    }

    .page_jump_box {
        width: 60px;
        margin-left: 8px;
    }

    :deep(.el-pager li.is-active) {
        border: 1px solid var(--vt-c-theme-colors);
    }
}

.el-select__popper.el-popper {
    .el-scrollbar__view .el-select-dropdown__list {
        .el-select-dropdown__item {
            color: var(--vt-c-theme-colors) !important;
        }
    }
}
</style>
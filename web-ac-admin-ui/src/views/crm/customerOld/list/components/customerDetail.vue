<template>
    <el-dialog v-model="dialogVisible" title="Tips" width="960px" :before-close="handleClose">
        <div>
            <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="1">
                    <div></div>
                </el-tab-pane>
                <el-tab-pane v-if="type!='add'" label="联系信息" name="2">Config</el-tab-pane>
                <el-tab-pane v-if="type!='add'" label="开票信息" name="3">Role</el-tab-pane>
                <el-tab-pane v-if="type!='add'" label="收货信息" name="4">Task</el-tab-pane>
            </el-tabs>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
const props = defineProps({
    //客户信息
    customer:{
        type:Object,
        default:{}
    },
    //弹窗类型 
    type:{
        type:String,
        default:'view'
    }
})
const dialogVisible = ref(true)
const emit = defineEmits()
watch(dialogVisible, val => {
    if (!val) {
        emit('closeDialog')
    }
})
const handleClose = (done) => {
    done()
}
</script>

<style lang="scss" scoped></style>
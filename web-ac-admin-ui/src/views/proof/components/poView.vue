<template>
    <span>
        <el-link :underline="false" @click="toOldAdmin(po,type)" :class="{colorblue:!copy}">
            {{ po }}
        </el-link>
        <el-link v-if="copy" :underline="false" v-copyText="po" v-copyText:callback="copyTextSuccess" style="margin-left: 6px;">
            <el-icon>
                <CopyDocument />
            </el-icon>
        </el-link>
    </span>
</template>

<script setup>
import {toOldAdmin} from "@/utils/index"
import { ElMessage } from 'element-plus';
const props = defineProps({
    poNo:{
        type:String,
        default:'-'
    },
    type:{
        type:String,
        default:'1'
    },
    copy:{
        type:Boolean,
        default:true
    }
})

const { poNo } = toRefs(props)
const po = computed(() => {
  if (props.type == '2'&&props.poNo.indexOf('PO')>-1) {
    return props.poNo.slice(2)
  } else {
    return props.poNo;
  }
})

//复制成功提示
function copyTextSuccess() {
  ElMessage({
    type: 'success',
    message: '复制成功',
  })
}
</script>

<style lang="scss" scoped>
    .colorblue{
        color: #409EFF;
    }
</style>
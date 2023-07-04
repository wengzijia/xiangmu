<template>
    <div>
        <span v-for="file in fileList" style="display: block;line-height:22px;">
            <span style="margin-right: 6px;">{{ getFileName(file) }}</span>
            <el-link v-if="file" :underline="false" type="primary" @click="dowFile(file)">{{view?'查看':'下载'}}</el-link>
        </span>
    </div>
</template>

<script setup>
import { toRefs } from 'vue';
import { getFileName } from '@/utils/index'
import { singleDownload } from '@/api/download'

const props = defineProps({
    url:{
        type:String,
        default:''
    },
    //查看/下载
    view:{
        type:Boolean,
        default:false
    }
})
const { view } = toRefs(props)
const fileList = ref([])
if (props.url) {
    fileList.value = props.url.split(',')
}
function dowFile(file){
    if (!file) {
        return
    }
    if (view.value) {
        let viewUrl = '/api/consumer/certifyFree/alibaba/oss/viewFile?fileName='+file
        window.open(viewUrl,'_blank')
        return
    }
    singleDownload({fileName:file})
}
</script>

<style lang="scss" scoped>

</style>
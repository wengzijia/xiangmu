<template>
    <el-link v-if="url" :underline="false" type="primary" @click="dowFile">{{view?'查看':'下载'}}</el-link>
</template>

<script setup>
import { toRefs } from 'vue';
import { getFileName } from '@/utils/index'
import { singleDownload } from '@/api/download'
import { ElMessage, ElLoading } from 'element-plus'
import { BASE_FILE_URL } from '@/store/global-constant'

const props = defineProps({
    url:{
        type:String,
        default:''
    },
    view:{
        type:Boolean,
        default:false
    }
})
let downloadLoadingInstance;
const { url,view } = toRefs(props)
function dowFile(){
    if (!url.value) {
        return
    }
    if (view.value) {
        let viewUrl = '/api/consumer/certifyFree/alibaba/oss/viewFile?fileName='+url.value
        window.open(viewUrl,'_blank')
        return
    }
    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    singleDownload({fileName:url.value})
    // .then(res=>{
    //     const blob = new Blob([res.data])
    //     saveAs(blob, getFileName(url.value))
    //     downloadLoadingInstance.close();
    // }).catch((r)=>{
    //     console.error(r)
    //     ElMessage.error('下载文件出现错误，请联系管理员！')
    //     downloadLoadingInstance.close();
    // })
}
</script>

<style lang="scss" scoped>

</style>
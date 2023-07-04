import { ElMessage } from "element-plus";


export default function(app) {
    //添加全局API
    app.config.globalProperties.$message = {
        success:(options)=>{
            ElMessage({
                type:'success',
                icon:false,
                ...options
            })
        },
        warning:(options)=>{
            ElMessage({
                type:'error',
                icon:false,
                ...options
            })
        },
        info:(options)=>{
            ElMessage({
                type:'info',
                icon:false,
                ...options
            })
        },
        error:(options)=>{
            ElMessage({
                type:'error',
                icon:false,
                ...options
            })
        },
    }

    // 参考
    //element-plus  message:   type	消息类型	'success' | 'warning' | 'info' | 'error'	'info'
}
import { createApp } from 'vue'
import msgBoxComponent from '@/layout/commonLayout/popup.vue'
const showModal = (options = {}) => {
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    const app = createApp(msgBoxComponent, {
        ...options, showModal: true,
    })
    app.mount(mountNode)
    const confirmBtn = mountNode.getElementsByClassName('search_button')[0]
    const cancelBtn =  mountNode.getElementsByClassName('reset_button')[0]
    const closeBtn = mountNode.getElementsByClassName('close_button')[0] 
    return new Promise((resolve, reject) => {
        confirmBtn.onclick = function(){
            resolve({type:'confirm'})
            remove()
        }
        cancelBtn.onclick = function(){
            resolve({type:'cancel'})
            remove()
        }
        closeBtn.onclick = function(){
            resolve({type:'cancel'})
            remove()
        }
    })
    function remove() {
        app.unmount(mountNode)
        document.body.removeChild(mountNode)
    }
}





export default function(createApp) {
    //添加全局API
    createApp.config.globalProperties.$yun = {
        showModal,
    }
}
// export default {
//     //添加全局API
//     showModal,
//     showToast,
//     showLoading
// }

// showMsgbox() {
//     this.$yun.showModal({
//         title: '温馨提示',
//         cancel: '取消',
//         content: '这里是消息弹出内容,这里是消息弹出内容,这里是消息弹出内容,这里是消息弹出内容,这里是消息弹出内容,这里是消息弹出内容,这里是消息弹出内容',
//         confirm: '确定',
//         className: 'pop-custom'
//     }).then(() => {
//         console.log("我点击了确定按钮")
//     }).catch((err) => {
//         console.log("error");
//     })
// }
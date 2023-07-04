<template>
  <div style="border: 1px solid #ccc">
    <Toolbar v-show="edit" style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor :style="'height:'+height+'px; overflow-y: hidden;'" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
      @onCreated="handleCreated" />
  </div>
</template>
<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { BASE_FILE_URL ,BASE_UPLOAD_FILE_URL} from "@/store/global-constant";
import { onBeforeUnmount, ref, shallowRef, onMounted, watch, defineProps, defineEmits } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { uploadefile } from "@/api/upload";
export default {
  components: { Editor, Toolbar },
  props: {
    //v-model:html
    html: {
      type: String,
      default: ''
    },
    //是否可编辑
    edit:{
      type:Boolean,
      default:true
    },
    //placeholder
    placeholder:{
      type: String,
      default: '请输入撤单备注内容...'
    },
    height:{
      type:Number,
      default:350
    }
  },
  setup(props, { emit }) {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref('')
 
    const toolbarConfig = {}
    const editorConfig = {
      placeholder: props.placeholder,
      readOnly: !props.edit,
      MENU_CONF: {
        uploadImage: {
          server: BASE_UPLOAD_FILE_URL(),
          customUpload: async (file, insertFn) => {
            const formData = new FormData()
            formData.append('file', file,new Date().getTime()+"_"+file.name)
            uploadefile(formData).then(res => {
              if (res.success) {
                insertFn(BASE_FILE_URL + res.data)
              }
            })
          },
        }
      },
    }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })
    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }
    watch(()=>props.html, (newValue, oldValue) => {
      if (newValue) {
        valueHtml.value = newValue
      }
    })
    watch(()=>props.edit, (newValue, oldValue) => {
      const editor = editorRef.value
      if (editor == null) return
      if (newValue) {
        editor.enable()
      }else{
        editor.disable()
      }
    })
    onMounted(() => {
      const editor = editorRef.value
      if (editor == null) return
      if (props.edit) {
        editor.enable()
      }else{
        editor.disable()
      }
    }),
    watch(valueHtml, (val) => {
      emit('update:html', val)
    })
    if (props.html) {
      valueHtml.value = props.html
    }
    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated
    };
  }
}
</script>
<style lang="scss">
// 去掉全屏
.w-e-toolbar .w-e-bar-item:last-child .w-e-menu-tooltip-v5{
    display: none;
}
</style> 
import { createApp,defineAsyncComponent } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import {ElInput,ElDrawer} from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

import "@/utils/ployfill" //去除谷歌浏览器的scroll、wheel等事件警告

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'
import { clearInput,showMoney } from "@/utils/index";

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'

// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 富文本内的图片放大组件
import HtmlImaagePriview from '@/components/HtmlImagePreview'
// 自定义树选择组件
import TreeSelect from '@/components/TreeSelect'
// 字典标签组件
import DictTag from '@/components/DictTag'
import DictSelect from '@/components/DictTag/select'
import DictText from '@/components/DictTag/text'
// 跟色跟样备注组件
import followInfoFlag from '@/components/fileTag/followInfoFlag.vue'

//布局插槽
import listLayout from "@/components/ParentView/listLayout.vue";
// import FileShow from "@/components/ParentView/FileShow.vue";
// import HistoryDialog from "@/components/ParentView/HistoryDialog.vue";
const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
app.config.globalProperties.clearInput = clearInput
app.config.globalProperties.showMoney = showMoney

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('DictSelect', DictSelect)
app.component('DictText', DictText)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component('HtmlImaagePriview', HtmlImaagePriview)
app.component('followInfoFlag', followInfoFlag)
app.component('listLayout', listLayout)
app.component('FileShow', defineAsyncComponent(() =>
  import('./components/proof/FileShow.vue')
))
app.component('HistoryDialog', defineAsyncComponent(() =>
  import('./components/proof/HistoryDialog.vue')
))
app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.component('svg-icon', SvgIcon)

directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})
ElDrawer.props.destroyOnClose.default = true;
// 全局的输入框字符串去除左右两边的空格
ElInput.mixins = [
  {
    watch:{
      "modelValue":function(value){
        if(value!=''&& typeof value ==='string'){
          let newValue = value.trim()
          if(this.modelValue!=newValue){
            this.$emit('update:modelValue',newValue)
          }
        }
      }
    }
  }
]
app.directive('el-select-loadmore',{
  mounted(el,binding){
      const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
      SELECTWRAP_DOM.addEventListener('scroll', function (){
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
              binding.value();
          }
      })
  }
})
app.mount('#app')

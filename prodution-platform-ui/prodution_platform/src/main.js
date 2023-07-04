import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import {routerParams} from "./router";
import { registerStore } from "@/stores";
import "element-plus/dist/index.css";
import "./assets/main.scss";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// import "@/utils/permission";
import svgIcon from '@/components/svgIcon/index.vue'
import 'virtual:svg-icons-register'
import popup from '@/assets/js/popup' 
import message from '@/assets/js/message' 
import { setLoginModule } from '@/utils/commonApi'



const routerHint = setLoginModule()
const router_redirect = routerParams()['router_'+routerHint] || router
console.log(router_redirect,'router_redirect')
const app = createApp(App);
app.use(router_redirect);
app.use(createPinia());
registerStore();
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(svgIcon);
app.use(popup);
app.use(message);
app.component('SvgIcon', svgIcon)

const btnList =['edit']
app.directive('hasPermission', {
  mounted(el,binding,vnode) {
    // console.log(binding.value,'ewewe')
    let flag = btnList.includes(binding.value)
    if(!flag) {
      // console.log(el.parentNode)
       el.parentNode && el.parentNode.removeChild(el)
    }
  }
})
app.mount("#app");

//全局通用：api返回成功错误码：6个0
window.HTTP_SUCCESS='000000'

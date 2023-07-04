import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './components/global.scss';
import Storage from 'vue-ls';
import { message } from '@/utils/resetMessage';
import { saveReport, setClientIP, setTimeDiff } from '@/utils/reported/reported';
setClientIP();
setTimeDiff();
// import './mock'
const options = {
  namespace: 'vuejs__', // key键前缀
  name: 'ls', // 命名Vue变量.[ls]或this.[$ls],
  storage: 'local' // 存储名称: session, local, memory
};

import './permission'; // permission control
import InitData from '@/utils/initData';
import './utils/directives.js';
Vue.config.productionTip = false;
Vue.use(Storage, options);
Vue.use(InitData);
Vue.use(ElementUI);
Vue.prototype.$message = message;
Vue.prototype.$report = saveReport;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

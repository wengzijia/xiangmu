import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
Vue.config.productionTip = false;
import * as VConsole from 'vconsole';
// console.log('VConsole',VConsole);
import websocket from './store/websocket'
Vue.prototype.$websocket = websocket;
if(process.env.NODE_ENV === 'development'){
  // window.devShowBool = true
  // const vConsole = new VConsole();
}
if(process.env.VUE_APP_MODE === 'test'){
  const vConsole = new VConsole();
  window.vConsole = vConsole
}

// console.log('window.navigator',window.navigator.appVersion);
// import { Col, Row,Cell,CellGroup ,Field,RadioGroup,
//   Radio,  } from 'vant';

import '@vant/touch-emulator';//vant组件桌面端适配
import '@/static/global.css'
import '@/static/base.css'
import vant from './components/Vant/index'
vant.plugins.forEach(e =>{
  Vue.use(e)
})
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Viewer.setDefaults({
  'inline':false,//是否直接展示
  'button':true, //右上角按钮
  "navbar": true, //底部缩略图
  "title": true, //当前图片标题
  "toolbar": {//底部工具栏
    zoomIn:1,//放大图片的按钮
    zoomOut:1,//缩小图片的按钮
    reset:1,//重置图片大小的按钮
    prev:1,//查看上一张图片的按钮
    next:1,//查看下一张图片的按钮
    play:0,//播放图片的按钮
    rotateLeft:1,//向左旋转图片的按钮
    rotateRight:1,//向右旋转图片的按钮
    flipHorizontal:0,//图片左右翻转的按钮
    flipVertical:0,//图片上下翻转的按钮
  }, 
  "tooltip": false, //显示缩放百分比
  "movable": true, //是否可以移动
  "zoomable": true, //是否可以缩放
  "rotatable": true, //是否可旋转
  "scalable": false, //是否可翻转
  "transition": true, //使用 CSS3 过度
  "fullscreen": false, //播放时是否全屏
  "keyboard": false, //是否支持键盘
  debug: false,
  url: 'data-source', // 设置大图片的 url
  defaultOptions: {
    zIndex: 9999
  },
})
Vue.use(Viewer);

// Vue.use(Row).use(Col).use(Cell).use(Field ).use(CellGroup ).use(RadioGroup).use(Radio)
// import '@/utils/permission';


// //获取原型对象上的push函数
// const originalPush = router.prototype.push
// //修改原型对象中的push方法
// router.prototype.push = function push(location) {
//    return originalPush.call(this, location).catch(err => err)
// }




new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

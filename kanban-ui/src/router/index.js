import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    redirect:'/login',
  },
  {
    path: "/login",
    name: "Login",
    meta:{title:'登录'},
    component:  () => import('@/views/Login.vue'),
  },
  {
    path: "/exportFile",
    name: "exportFile",
    meta:{title:'导出'},
    component:  () => import('@/views/exportFile.vue'),
  },
  {
    path: "/yunVersion",
    name: "yunVersion",
    meta:{title:'更改版本号'},
    component:  () => import('@/views/yunVersion.vue'),
  },
  {
    path: "/PunchIn",
    name: "PunchIn",
    meta:{title:'打卡'},
    component:  () => import('@/views/PunchIn.vue'),
  },
  {
    path: "/dieCutting",
    name: "dieCutting",
    meta:{title:'模切工序'},
    component:  () => import('@/views/dieCutting.vue'),
    redirect:'/orderInfo',
    children:[
      {
        path:"/orderInfo",
        name: "orderInfo",
        meta:{title:'当前订单'},
        component:() => import('@/views/dieCuttingModule//orderInfo.vue')
      },
      {
        path:"/orderList",
        name: "orderList",
        component:() => import('@/views/dieCuttingModule/orderList.vue'),
        redirect:'/orderList/producedList',
        children:[
          {
            path:"/orderList/producedList",
            name: "producedList",
            meta:{title:'待生产列表'},
            component:() => import('@/views/dieCuttingModule/listModule/producedList')
          },
          {
            path:"/orderList/errorList",
            name: "errorList",
            meta:{title:'异常列表'},
            component:() => import('@/views/dieCuttingModule/listModule/errorList')
          },{
            path:"/orderList/waitingList",
            name: "waitingList",
            meta:{title:'待排产列表'},
            component:() => import('@/views/dieCuttingModule/listModule/waitingList')
          },{
            path:"/orderList/finishedList",
            name: "finishedList",
            meta:{title:'已完成列表'},
            component:() => import('@/views//dieCuttingModule/listModule/finishedList')
          }
        ]
      }
    ]
  },

];



//解决路由跳转原路由或者刷新出错
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  base: process.env.VUE_APP_ROUTER_BASE_URL ,
  mode:'history',
  routes,
});

console.log(router)
export default router;

import { createRouter, createWebHistory } from "vue-router";
import { getToken, permissionsMenuFlag, setLoginModule,setAuthorityJudgment,userLoginOut } from '@/utils/commonApi'
import appStore from "@/stores/index.js";
import user from "@/router/module/user";
import admin from "@/router/module/admin";
import common from "@/router/module/common";
import industrialParkManage from "@/router/module/industrialPark";
import processorModule from "@/router/module/processor";
import financialModule from "@/router/module/financialModule";
import unitChargeRule from "@/router/module/unitChargeRule";
import errorModule from "@/router/module/error"
import accountCheckingModule from "@/router/module/accountChecking";

import workbenchModule from "@/router/module/workbench"
const routes = [...common, ...admin, ...user, ...processorModule, ...financialModule, ...industrialParkManage, ...unitChargeRule, ...errorModule, ...workbenchModule, ...accountCheckingModule]
// const routerListModule =['/gly','/cg','/cw','/boss']
const permissionFiltering = (to, from, router) => {
  console.log('to------:', to)
  console.log('from------:', from)
  
  const token = getToken()
  const routerHint = setLoginModule()
  console.log('当前登录模块----', routerHint)
  if (token) {
    //如果在token存在的情况下，用户想回到登录页，直接返回到个人中心页面'/viewWork',
    // if(to.path == '/') return routerHint ?  router.push({ path: "/user/userCenterSettings" }) :  router.replace({ path: '/workbench' })
    if(to.path == '/') return (routerHint&&setAuthorityJudgment()) ?  router.push({ path: "/viewWork" }) :  userLoginOut(false)
    //如果去当前视图工作台，判断当前视图是否有权限
    if(to.path =='/viewWork' && !setAuthorityJudgment()) return userLoginOut(false)
    //如果已经进入当前视图，但是又登录了其他视图模块，页面刷新或者跳转的时候，需要判断当前视图是否存在
    if(to.name != 'workbench'&&to.path != '/' && to.path != '/viewWork'&& !setAuthorityJudgment()) return userLoginOut(false)
    //如果输入的访问地址不在确定的几个视图中，进入到404页面，不管是登录过还是没登录过
    // if (!routerHint && to.path != '/404') return router.replace({ path: '/404' })
    //如果在token存在的情况下，进入的页面没有权限进入，且当前页面不是404的话，将页面调整到404
    // if (!permissionsMenuFlag(to.path) && to.path != '/404'&& to.path != '/workbench') return router.replace({ path: '/404' })
  } else {
    if(to.path == '/') return routerHint ?  true :  router.replace({ path: '/workbench' })
    // if (!routerHint && to.path != '/404'&&to.path !='/workbench') return router.replace({ path: '/404' })
  }

  return true
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const router_gly = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL + 'gly/'),
  routes,
});
const router_cg = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL + 'cg/'),
  routes,
});
const router_cw = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL + 'cw/'),
  routes,
});
const router_boss = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL + 'boss/'),
  routes,
})
router.beforeEach((to, from) => {
  console.log('路由进行了变化---router',)
  permissionFiltering(to, from, router)

})
router_gly.beforeEach((to, from) => {
  console.log('路由进行了变化--router_gly')
  permissionFiltering(to, from, router_gly)
})
router_cg.beforeEach((to, from) => {
  console.log('路由进行了变化--router_cg')
  permissionFiltering(to, from, router_cg)
})
router_cw.beforeEach((to, from) => {
  console.log('路由进行了变化--router_cw')
  permissionFiltering(to, from, router_cw)
})
router_boss.beforeEach((to, from) => {
  console.log('路由进行了变化--router_boss')
  permissionFiltering(to, from, router_boss)
})
export const routerParams = () => {
  return {
    router_gly, router_cg, router_cw, router_boss
  }
}

export default router; 

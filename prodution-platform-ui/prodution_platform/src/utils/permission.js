import router from "@/router";
// import { routerParams } from "@/router";
import appStore from "@/stores/index.js";
import { setToken, userLoginOut, getToken, permissionsMenuFlag, setLoginModule } from '@/utils/commonApi'
import { splitFullPath } from "@/utils/commonUtils";

const routerHints = setLoginModule()
// console.log(routerParams, 'routerParams')
const router_redirect = router //  routerParams()['router_'+routerHints] ||
console.log('路由进入当前页面路由导航钩子--', router_redirect)
// const whitPathList = ["Login"];
const whitPathList = ["/gly/", "/cg/", "/cw/", "/boss/", "/gly/Login", "/cg/Login", "/cw/Login", "/boss/Login"];
const whitLogin = ["/gly/", "/cg/", "/cw/", "/boss/", "/gly/login", "/cg/login", "/cw/login", "/boss/login", "/gly/Login", "/cg/Login", "/cw/Login", "/boss/Login"]
router.beforeEach((to, from) => {
  console.log("beforeEach--to", to);
  console.log("beforeEach--from", from);
  const token = getToken()
  const routerHint = setLoginModule()
  console.log('routerHint----', routerHint)
  // 白名单路由直接放行
  if (!token) {
    //如果没有token，想进入不是白名单的页面，直接返回到登录页
    // if (!whitPathList.includes(to.name)) {
    //   console.log('没有token并且在登录页',routerHint)
    //   router.push({ path: `/`, replace: true });
    //   return true
    // }
    if (!routerHint && to.path != '/404') {
      router_redirect.replace({ path: "/404" });
      return true
    }
    //如果进入的页面没有写的视图标记，并且进入的不是404页面，就进入到404页面中
    if (!whitPathList.includes(to.path) && !routerHint && to.path != '/404') {
      router_redirect.replace({ path: "/404" });
      return true
    } else if (!whitPathList.includes(to.path) && routerHint) {
      console.log('不是白名单的页面，需要返回登录页面，', routerHint)
      router_redirect.push({ path: `/${routerHint}/` })
      location.reload();
      return true
    }
    // router.push({ path: `/cw/` });
    console.log('没有token并且在登录页', routerHint)
    return true

  } else {
    console.log('to.path--:', to.path)
    if (!routerHint && to.path != '/404') {
      router_redirect.replace({ path: "/404" });
      return true
    }
    //如果token存在，并且页面是返回到登录页，需要打回到个人中心页面
    if (token && (whitPathList.includes(to.name) || whitLogin.includes(to.path))) {
      router_redirect.push({ path: "/user/userCenterSettings", replace: true });
      return true
    }
    if (!permissionsMenuFlag(to.path) && to.path != '/404') {
      router_redirect.replace({ path: "/404", replace: true });
      return true
    }
    appStore.useMenuStore.setCurrentMenuName(to?.meta?.menuTitle || "");
    appStore.useMenuStore.setDefaultActive(to.href);

  }

  // 登录状态逻辑-userInfo
  // const userInfo = appStore.useUserStore.getUserInfo();
  // const userInfo = getUserInfo()
  // 同步store和localstorage的userInfo;
  // if (userInfo) {
  //   appStore.useUserStore.setUserInfo(userInfo);
  //   setUserInfo(userInfo)
  // }

  //设置对应路由模块
  // const moduleName = splitFullPath(to.fullPath);
  // appStore.useMenuStore.setCurrentModue(moduleName[0]);

  // if (moduleName[0] !== "common" && moduleName[0] !== "user") {
  //   appStore.useMenuStore.setlastModuleName(moduleName[0]);
  // }

  // 返回 false 以取消导航

  // next()
  return true;
});

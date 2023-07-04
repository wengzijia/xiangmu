import router from './router'
import { ElMessage, ElMessageBox } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { checkToken } from '@/api/consumer/login'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import useAppStore from '@/store/modules/app'
import usePermissionStore from '@/store/modules/permission'
import checkAppNewVersion from '@/utils/checkAppNewVersion.js'
const BASE_ROUTER = import.meta.env.VITE_APP_ROUTER_BASE_URL
let appMode = import.meta.env.VITE_APP_ENV
let nextPath = appMode === 'production' ? '/' : '/login'

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/auth-redirect', '/bind', '/register'];
const checkTokenList = ['/designWorkOrder/details']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (from.path !== '/') {
    checkAppNewVersion()
  }
  if ((to.query.hidemenu && to.query.hidemenu == 1) || (to.query.hideMenu && to.query.hideMenu == 1)) {
    useAppStore().toggleSideBarHide(true, true)
  }
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title)
    // console.log('checkToken')

    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (useUserStore().roles.length === 0) {
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        useUserStore().getInfo().then(() => {
          isRelogin.show = false
          usePermissionStore().generateRoutes().then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(route => {
              if (!isHttp(route.path)) {
                router.addRoute(route) // 动态添加可访问路由表
              }
            })
            // console.log('6666',checkTokenList.findIndex(e => e==to.path))
            if (checkTokenList.findIndex(e => e == to.path) !== -1) {
              checkToken().then(res => {
                // console.log('res',res)
                if (res.code === '000000') {
                  next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
                } else {
                  isRelogin.show = true;
                  ElMessage.error(res.message)

                  loginOutFun(to.path)
                }
              }).catch((err) => {
                ElMessage.error(err)
                loginOutFun(to.path)
              })
            } else {
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            }

          })
        }).catch(err => {
          ElMessage.error(err)
          loginOutFun(to.path)
        })
      } else {
        if (checkTokenList.findIndex(e => e == to.path) !== -1) {
          checkToken().then(res => {
            console.log('res', res)
            if (res.code === "000000") {
              next()
            } else {
              loginOutFun(to.path)
            }
          }).catch((err) => {
            next()
          })
        } else {
          next()
        }
      }
    }
  } else {
    // 没有token
    // next()
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      // next({ path: nextPath })
      loginOutFun(to.path)
      NProgress.done()
    }
  }
})

// token失效通知旧后台登录
function invalidFn(path) {
  if (path.includes('/orderChange/')) {
    window.parent.postMessage({
      cmd: 'getToken',
      params: {
        url: `${window.origin}/admin/base/login.html`
      }
    }, "*")
    return true
  }
}

function loginOutFun(path) {
  ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning'
  }
  ).then(() => {
    if (invalidFn(path)) {
      return
    }
    isRelogin.show = false;
    useUserStore().logOut()
  }).catch(() => {
    if (invalidFn(path)) {
      return
    }
    isRelogin.show = false;
  });
}
router.afterEach(() => {
  NProgress.done()
})


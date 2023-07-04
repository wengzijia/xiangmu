import router from '@/router'
import store from '@/store'
import { Toast, Notify } from 'vant'
import { getToken,removeToken } from './auth'
import { setDocumentTitle} from '@/utils/domUtil';
import {checkToken} from '@/api'
/**
 * 不需要登录的页面
 */
const notLoginList = [
  "Login"
]
let isCheckToken = true
let num = 1
// router.beforeEach(async (to, from, next) => {
//   // 设置标题
//   // removeToken()
//   console.log('to',to);
//   // 根据token判断用户是否登录
//     const token = getToken()
//       if (notLoginList.indexOf(to.name) !== -1) {
//         console.log(notLoginList.indexOf(to.path))
//         next() // 白名单没有token也直接放行
//       }else if(token){
//       if(isCheckToken){//校验token
//         console.log('8848')
//         try {
//           let res =  await checkToken({})
//           if(res.success){
//             isCheckToken = false
//             await store.dispatch('GET_INFO')
//           }else{
//             removeToken()
//             await store.dispatch('DD_LOGIN')
//           }
//         } catch (error) {
//         }
//         next()
//       }else{
//         if(to.name=='QdLogin'){//如果登录了，前往登录页就直接跳到首页
//           next('/login')
//         }else{
//           next()
//         }
//       }
//     }else{
//       if(notLoginList.indexOf(to.name) === -1){
//         try {
//           await store.dispatch('DD_LOGIN')
//         } catch (error) {

//         }
//         next()
//       }else{
//         next()
//       }

//     }
//     // next()
//     console.log('to.meta',to)
//     setDocumentTitle(to.meta.title)


// })

// router.beforeEach((to, from, next) => {
//   const version = '1.2'
//   console.log(to)
//   const clientVersion = localStorage.getItem('_version_')
//   console.log('版本号---',clientVersion)
//   if(version != clientVersion){
//       localStorage.setItem('_version_', version)
//       console.log('版本不一致，重新加载。')
//       window.location.reload()
//   }
//   // window.location.reload()
//   next()
// })

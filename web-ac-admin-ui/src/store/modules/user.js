import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'
// let appMode = import.meta.env.VITE_APP_ENV
const BASE_ROUTER = import.meta.env.VITE_APP_ROUTER_BASE_URL
const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      name: '',
      avatar: '',
      roles: [],
      permissions: [],
      userInfo:{}
    }),
    actions: {
      // 登录
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            let data = res.data
            // 存储后台Token
            setToken(data.access_token)
            // 存储中台Token
            localStorage.setItem('Access-Token',data.java_token)
            this.token = data.access_token
            getInfo().then(res => {
              const user = res.user
              const avatar = (user.avatar == "" || user.avatar == null) ? defAva : user.avatar;
  
              if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                this.roles = res.roles
                this.permissions = res.permissions
                this.userInfo = res.user
              } else {
                this.roles = ['ROLE_DEFAULT']
              }
              this.name = user.userName
              this.avatar = avatar;
              localStorage.setItem('userInfo',JSON.stringify(res))
              resolve(res)
            }).catch(error => {
              reject(error)
            })
            resolve()
            
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          let userInfo = localStorage.getItem('userInfo')
          if(userInfo){
            let res = JSON.parse(userInfo)
            const user = res.user
              const avatar = (user.avatar == "" || user.avatar == null) ? defAva : user.avatar;
              if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                this.roles = res.roles
                this.permissions = res.permissions
                this.userInfo = res.user
              } else {
                this.roles = ['ROLE_DEFAULT']
              }
              this.name = user.userName
              this.avatar = avatar;
              resolve(res)
          }else{
            getInfo().then(res => {
              const user = res.user
              const avatar = (user.avatar == "" || user.avatar == null) ? defAva : user.avatar;
  
              if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                this.roles = res.roles
                this.permissions = res.permissions
                this.userInfo = res.user
              } else {
                this.roles = ['ROLE_DEFAULT']
              }
              this.name = user.userName
              this.avatar = avatar;
              localStorage.setItem('userInfo',JSON.stringify(res))
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          }
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          this.token = ''
          this.roles = []
          this.permissions = []
          removeToken()
          // if (appMode === 'production') {
            // location.href = window.location.origin + '/admin';
          // } else {
            location.href = window.location.origin + BASE_ROUTER +'login';
          // }
          resolve()
          // logout(this.token).then(() => {
          //   this.token = ''
          //   this.roles = []
          //   this.permissions = []
          //   removeToken()
          //   resolve()
          // }).catch(error => {
          //   reject(error)
          // })
        })
      }
    }
  })

export default useUserStore

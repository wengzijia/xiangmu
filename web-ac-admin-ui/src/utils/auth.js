import Cookies from 'js-cookie'

const TokenKey = 'aocai_token'

const ExpiresInKey = 'Admin-Expires-In'

const APP_VERSION = 'APP_VERSION'
// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }
export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey,token)
}

export function removeToken() {
  Cookies.remove('PHPSESSID')//退出登录的时候，需要php的登录信息也删除
  localStorage.removeItem('userInfo')
  localStorage.removeItem('Access-Token')
  return localStorage.removeItem(TokenKey)
}
export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}

export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}


export function getVersion() {
  return localStorage.getItem(APP_VERSION)
}

export function setVersion(version) {
  return localStorage.setItem(APP_VERSION,version)
}

export function removeVersion() {
  return localStorage.removeItem(APP_VERSION)
}
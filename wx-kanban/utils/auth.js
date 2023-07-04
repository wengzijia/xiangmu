const ACCESS_TOKEN = 'Access-Token'

export function getToken(){
  const token = wx.getStorageSync(ACCESS_TOKEN)
  return token;
}

export function setToken(token) {
 wx.setStorageSync(ACCESS_TOKEN,token)
}

export function removeToken() {
  wx.removeStorageSync(ACCESS_TOKEN);
}

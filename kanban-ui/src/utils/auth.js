import { ACCESS_TOKEN } from '@/store/global-constant';

export function getToken(){
  const token = localStorage.getItem(ACCESS_TOKEN)
  return token;
}

export function setToken(token) {
  localStorage.setItem(ACCESS_TOKEN,token)
}

export function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN);
}



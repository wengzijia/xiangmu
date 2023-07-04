

import {  setVersion,getVersion } from '@/utils/auth'
import axios from 'axios'
let env = import.meta.env
/**
 * 检查服务端是否已经更新，如果更新刷新页面
 * @returns 
 */
export default async function checkAppNewVersion() {
  // console.log('env',env)
  if(env.VITE_APP_ENV=='development') return
  const url = `/acwebadmin/version.json?t=${Date.now()}`
  let res = null
  try {
    res = await axios.get(url)
  } catch (err) {
    console.error('checkAppNewVersion error: ', err)
  }
  if (!res) return
  const version = res.data.version
  const localVersion = getVersion()
  if (localVersion && localVersion !== version) {
    setVersion(version)
    alert('系统版本已更新，需要刷新页面才可以正常使用，立即刷新？')
    window.location.reload()
  }
  setVersion(version)
}
 
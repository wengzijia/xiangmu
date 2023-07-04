import api from '@/api/index.js';
import {post,get,downloadFile } from '@/utils/request';
const {getSms,verifySms,machineList,logout,validDeviceStatus,exportOrder} = api.login
export const getVerifySmsCode = (parameter) =>{
    return post({url:getSms,data:parameter})
}
export const verifySmsCode = (parameter) =>{
    return post({url:verifySms,data:parameter})
}
export const getDeviceList = (parameter)=> {
    return post({url:machineList,data:parameter})
}
export const LogOut = (parameter) => {
    return get({url:logout,data:parameter})
}
export const setValidDeviceStatus = (id) => {
    return get({url:validDeviceStatus+id})
}
export const getDownloadFile = (params) => {
    return downloadFile({url:exportOrder,data:params})
}



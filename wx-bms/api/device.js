import { http } from "../utils/request.js"

// 添加设备
export function addDevice(param){
  return http({
    url:'/addSupplierDevice',
    method:'post',
    data:param
  })
}

// 获取设备列表
export function deviceList(){
  return http({
    url:'/supplierDeviceList',
    method:'post'
  })
}

// 编辑设备
export function editDevice(param){
  return http({
    url:'/editSupplierDevice',
    method:'post',
    data:param
  })
}

// 获取设备信息
export function deviceInfo(deviceId){
  return http({
    url:'/getSupplierDevice',
    method:'post',
    data:{
      device_id:deviceId
    }
  })
}
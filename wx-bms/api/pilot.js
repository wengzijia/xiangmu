import { http,requestUrl} from "../utils/request.js"

// 添加机长
export function addPilot(param){
  return http({
    url:"/addSupplierDeviceOperator",
    method:'post',
    data:param
  })
}

// 机长列表
export function pilotList(deviceId){
    return http({
      url:"/supplierDeviceOperatorList",
      method:'post',
      data:{
        device_id:deviceId
      }
    })
}

// 获取机长信息
export function pilotInfo(deviceId){
  return http({
    url:"/getSupplierDeviceOperator",
    method:'post',
    data:{
      operator_id:deviceId
    }
  })
}

// 上传图片地址
export const uploadImg = requestUrl+"/api/uploadImg"

// 编辑机长信息
export function editPilotInfo(param){
  return http({
    url:"/editSupplierDeviceOperator",
    method:'post',
    data:param
  })
}


// 获取机器生产状态
export function getSupplierDeviceProductionStatus(param){
  return http({
    url:"/getSupplierDeviceProductionStatus",
    method:'post',
    data:param
  })
}

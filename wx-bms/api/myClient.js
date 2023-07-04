import {http} from "../utils/request.js"

//  获取客户列表
export function getCustomerList(number){
  return http({
      url:  '/customerList',
      method:'post',
      data:{
        customer_type:number
      }
    });
}

//  添加客户
export function addClient(value){
  return http({
      url:  '/addCustomer',
      method:'post',
      data:{
        customer_name:value
      }
    });
}

// 编辑客户
export function editClient(number){
  return http({
      url:  '/editCustomerInfo',
      method:'post',
      data:{
        customer_id:number
      }
    });
}


// 编辑客户提交
export function editCustomerSubmit(client){
  return http({
      url:  '/editCustomerSubmit',
      method:'post',
      data:client
    });
}





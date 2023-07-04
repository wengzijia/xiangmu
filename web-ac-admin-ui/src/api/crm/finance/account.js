import request from "@/utils/request";
const BASE_URL = "/customer-crm";
import { download } from "@/utils/request";

/**
 * 分页查询客户账款
 */
export function getCustomerAccountList(params) {
  return request({
    url: BASE_URL + `/crm-order-statistics-info/accounts/customer`,
    method: "get",
    params,
  });
}
/**
 * 分页查询订单账款
 */
export function getAccountsOrderList(params) {
  return request({
    url: BASE_URL + `/crm-order-statistics-info/accounts/order`,
    method: "get",
    params,
  });
}

/**导出客户账款 */
export function exportOrderStatisticsList(data, name) {
  return download(`/customer-crm/crm-order-statistics-info/export`, data, name);
}

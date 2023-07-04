import request from "@/utils/request";
const BASE_URL = '/customer-crm'

/**匹配供应商*/
export function getSupplier(params) {
  return request({
    url: BASE_URL + `/crm-supplier/match`,
    method: "get",
    params
  });
}
import request from "@/utils/request2";
// 获得品类
export function getAllVoList(data) {
  return request({
    url: `/certifyFree/category/getAllVoList`,
    method: 'post',
    data,
  })
}
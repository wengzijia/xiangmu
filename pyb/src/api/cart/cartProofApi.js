import api from '@/api/index';
import { axios } from '@/utils/request';
//获取打样所有订单
export function getByUid(parameter) {
  return axios({
    url: api.cart.proof.getByUid,
    method: 'post',
    data: parameter
  });
}
//更新数量 与款数
export function updateNum(parameter) {
  return axios({
    url: api.cart.proof.updateNum,
    method: 'post',
    data: parameter
  });
}

//根据id删除某些打样订单
export function deleteById(parameter) {
  return axios({
    url: api.cart.proof.deleteById,
    method: 'post',
    data: parameter
  });
}
//批量删除打样订单
export function deleteByIds(parameter) {
  return axios({
    url: api.cart.proof.deleteByIds,
    method: 'post',
    data: parameter
  });
}
//修改打样订单选中状态
export function updateCheck(parameter) {
  return axios({
    url: api.cart.proof.updateCheck,
    method: 'post',
    data: parameter
  });
}
//根据用户id查询适配列表
export function adaptiveList(parameter) {
  return axios({
    url: api.cart.proof.adaptiveList,
    method: 'post',
    data: parameter
  });
}
//生成适配码
export function createAdaptive(parameter) {
  return axios({
    url: api.cart.proof.createAdaptive,
    method: 'post',
    data: parameter
  });
}
//删除适配码
export function deleteByAdaptive(parameter) {
  return axios({
    url: api.cart.proof.deleteByAdaptive,
    method: 'post',
    data: parameter
  });
}
// 新增购物车项
export function addCartReq(parameter) {
  return axios({
    url: api.cart.proof.addCart,
    method: 'post',
    data: parameter
  });
}

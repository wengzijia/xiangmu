import api from '@/api/index';
import { axios } from '@/utils/request';

export function getCartByUid(parameter) {
  return axios({
    url: api.cart.cart.getCartByUid,
    method: 'post',
    data: parameter
  });
}

export function add(parameter) {
  return axios({
    url: api.cart.cart.add,
    method: 'post',
    data: parameter
  });
}

export function updateIsFromCheck(parameter) {
  return axios({
    url: api.cart.cart.updateIsFromCheck,
    method: 'post',
    data: parameter
  });
}

export function update(parameter) {
  return axios({
    url: api.cart.cart.update,
    method: 'post',
    data: parameter
  });
}

export function del(parameter) {
  return axios({
    url: api.cart.cart.del,
    method: 'post',
    data: parameter
  });
}
export function addAdaptive(parameter) {
  return axios({
    url: api.cart.cart.addAdaptive,
    method: 'post',
    data: parameter
  });
}
export function delAdaptive(parameter) {
  return axios({
    url: api.cart.cart.delAdaptive,
    method: 'post',
    data: parameter
  });
}
//翻单已用
export function saveOrdersRepurchase(parameter) {
  return axios({
    url: api.cart.cart.saveOrdersRepurchase,
    method: 'post',
    data: parameter
  });
}
//修改状态
export function updateCheck(parameter) {
  return axios({
    url: api.cart.cart.updateCheck,
    method: 'post',
    data: parameter
  });
}
//适配列表
export function adaptiveList(parameter) {
  return axios({
    url: api.cart.cart.adaptiveList,
    method: 'post',
    data: parameter
  });
}
//添加适配列表
export function addAdaptiveList(parameter) {
  return axios({
    url: api.cart.cart.addAdaptiveList,
    method: 'post',
    data: parameter
  });
}
//添加适配打样收货地址
export function saveOrUpdate(parameter) {
  return axios({
    url: api.cart.cart.saveOrUpdate,
    method: 'post',
    data: parameter
  });
}
//删除适配打样收货地址
export function deleteByAdaptive(parameter) {
  return axios({
    url: api.cart.cart.deleteByAdaptive,
    method: 'post',
    data: parameter
  });
}
//添加到收藏
export function addByCartIds(parameter) {
  return axios({
    url: api.cart.cart.addByCartIds,
    method: 'post',
    data: parameter
  });
}
//添加到购物车
export function addCartByIds(parameter) {
  return axios({
    url: api.cart.cart.addCartByIds,
    method: 'post',
    data: parameter
  });
}
//删除收藏
export function deleteByIds(parameter) {
  return axios({
    url: api.cart.cart.deleteByIds,
    method: 'post',
    data: parameter
  });
}
//收藏列表
export function listCollect(parameter) {
  return axios({
    url: api.cart.cart.listCollect,
    method: 'post',
    data: parameter
  });
}
//拼版计价
export function priceOfMakeup(parameter) {
  return axios({
    url: api.cart.cart.priceOfMakeup,
    method: 'post',
    data: parameter
  });
}
//获取购物车数量
export function countCart(parameter) {
  return axios({
    url: api.cart.cart.countCart,
    method: 'post',
    data: parameter
  });
}
// 翻单添加购物车
// export function saveOrdersRepurchases(parameter) {
//   return axios({
//     url: api.cart.cart.saveOrdersRepurchases,
//     method: 'post',
//     data: parameter
//   });
// }

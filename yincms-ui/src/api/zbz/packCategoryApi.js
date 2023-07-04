import api from '@/api';
import { axios } from '@/utils/request';
// /**
//  * xmlToPdf
//  * @param data:{}
//  * @returns
//  */
export function xmlToPdf(parameter) {
  return axios({
    url: api.pack.classification.xmlToPdf,
    method: 'post',
    params: parameter
  });
}
//包装方案基础设计稿列表
export function listBasePack(parameter) {
  return axios({
    url: api.pack.classification.listBasePack,
    method: 'post',
    data: parameter
  });
}
//获取一二级分类
export function categoryList(parameter) {
  return axios({
    url: api.pack.classification.categoryList,
    method: 'post',
    data: parameter
  });
}
//获取商品分类,⽗分类id
export function currentCategoryList(parameter) {
  return axios({
    url: api.pack.classification.currentCategoryList,
    method: 'post',
    data: parameter
  });
}
//获取四，五级分类，商品的属性和风格
export function getAttributes(parameter) {
  return axios({
    url: api.pack.classification.getAttributes,
    method: 'post',
    data: parameter
  });
}
//获取 商品名称，商品规格，包装规格
export function attrRelationByCateId(parameter) {
  return axios({
    url: api.pack.catePage.attrRelationByCateId,
    method: 'post',
    data: parameter
  });
}
//获取 商品名称，商品规格，包装规格
export function formListByCateId(parameter) {
  return axios({
    url: api.pack.catePage.formListByCateId,
    method: 'post',
    data: parameter
  });
}
//分页获取方案
export function pagePackScheme(parameter) {
  return axios({
    url: api.pack.catePage.pagePackScheme,
    method: 'post',
    data: parameter
  });
}
//获取方案详情
export function getSchemeDetailBySchemeId(parameter) {
  return axios({
    url: api.pack.catePage.getSchemeDetailBySchemeId,
    method: 'post',
    data: parameter
  });
}
//用户包装方案设计稿列表
export function listPackByUid(parameter) {
  return axios({
    url: api.pack.catePage.listPackByUid,
    method: 'post',
    data: parameter
  });
}
//用户包装方案设计稿列表
export function updateDelState(parameter) {
  return axios({
    url: api.pack.catePage.updateDelState,
    method: 'post',
    data: parameter
  });
}
//按照多个id更新
export function deleteBatchById(parameter) {
  return axios({
    url: api.pack.catePage.deleteBatchById,
    method: 'post',
    data: parameter
  });
}
//通过分类ID获取所有父类及自身
export function getParentsByCategoryId(parameter) {
  return axios({
    url: api.pack.catePage.getParentsByCategoryId,
    method: 'post',
    data: parameter
  });
}
//通过分类ID获取所有父类及自身
export function getParentsByBackCategoryId(parameter) {
  return axios({
    url: api.pack.catePage.getParentsByBackCategoryId,
    method: 'post',
    data: parameter
  });
}
//获取热门方案通过分类父id
export function getHotSchemeListByCategoryPid(parameter) {
  return axios({
    url: api.pack.catePage.getHotSchemeListByCategoryPid,
    method: 'post',
    data: parameter
  });
}
//
// 连词搜索
export function getPackSchemeSearchName(parameter) {
  return axios({
    url: api.pack.catePage.getPackSchemeSearchName,
    method: 'post',
    data: parameter
  });
}
// 包装方案搜索
export function getPackSchemeSearch(parameter) {
  return axios({
    url: api.pack.catePage.getPackSchemeSearch,
    method: 'post',
    data: parameter
  });
}
//获取二级分类
export function getSecondCategories(parameter) {
  return axios({
    url: api.pack.catePage.getSecondCategories,
    method: 'post',
    data: parameter
  });
}
//计价
export function getPrice(parameter) {
  return axios({
    url: api.pack.price.getPrice,
    method: 'post',
    data: parameter
  });
}
//立即下单
export function buyNow(parameter) {
  return axios({
    url: api.pack.price.buyNow,
    method: 'post',
    data: parameter
  });
}
//增加或者更新定制化数据
export function addOrUpdateCustomization(parameter) {
  return axios({
    url: api.pack.catePage.addOrUpdateCustomization,
    method: 'post',
    data: parameter
  });
}
//增加或者更新定制化数据
export function AdSetting(parameter) {
  return axios({
    url: api.pack.catePage.AdSetting,
    method: 'post',
    data: parameter
  });
}
//获取热门分类列表
export function getHotCategoryList(parameter) {
  return axios({
    url: api.pack.catePage.getHotCategoryList,
    method: 'post',
    data: parameter
  });
}

//获取热门分类列表
export function downloadFile(parameter) {
  return axios({
    url: api.pack.catePage.downloadFile,
    method: 'post',
    data: parameter
  });
}

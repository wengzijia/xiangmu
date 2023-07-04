import { strEquals } from '@/utils/strUtil';

/**
 * 获取一级菜单
 * @param navList
 * @param cateId
 * @returns {*}
 */
export function getTopNav(navList, cateId) {
  for (let i = 0; i < navList.length; i++) {
    if (strEquals(navList[i].data.id, cateId)) {
      return navList[i];
    }
  }
}

/**
 * 获取二级菜单
 * @param navList
 * @param cateId
 * @param subCateId
 * @returns {*}
 */
export function getSubNav(navList, cateId, subCateId) {
  let topNav = getTopNav(navList, cateId);
  if (topNav) {
    for (let i = 0; i < topNav.children.length; i++) {
      if (strEquals(topNav.children[i].data.id, subCateId)) {
        return topNav.children[i].data;
      }
    }
  }
}

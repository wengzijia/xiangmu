import { getTopNav, getSubNav } from '@/utils/cateNavsUtil';

export function getSubCateId(that) {
  let subCateInfo = getSubNav(that.$store.getters.cutterCateNavs, that.$route.query.cateId, that.$route.query.subCateId);
  console.log(subCateInfo);
  return subCateInfo.moldCateId;
}

export function getCateId(that) {
  let subCateInfo = getTopNav(that.$store.getters.cutterCateNavs, that.$route.query.cateId);
  console.log(subCateInfo);
  return subCateInfo.data.moldCateId;
}

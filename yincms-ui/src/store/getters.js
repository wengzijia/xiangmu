const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.info,
  cartNum: state => state.user.cartNum,
  proofCartNum: state => state.user.proofCartNum,
  priceCateNavs: state => state.category.priceCateNavs,
  parentsId: state => state.category.parentsId,
  proofCateNavs: state => state.category.proofCateNavs,
  cutterCateNavs: state => state.category.cutterCateNavs,
  mouseParentsId: state => state.category.mouseParentsId,
  mouseTWOParentsId: state => state.category.mouseTWOParentsId,
  standardList: state => state.news.standardList,
  noticeList: state => state.news.noticeList,
  pinyibanHeaders: state => state.user.pinyibanHeaders
};

export default getters;

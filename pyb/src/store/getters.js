const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.info,
  cartNum: state => state.user.cartNum,
  proofCartNum: state => state.user.proofCartNum,
  priceCateNavs: state => state.category.priceCateNavs,
  proofCateNavs: state => state.category.proofCateNavs,
  cutterCateNavs: state => state.category.cutterCateNavs
};

export default getters;

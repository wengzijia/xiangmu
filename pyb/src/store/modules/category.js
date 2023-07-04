import { getAllVoList } from '@/api/category/categoryApi';
const category = {
  state: {
    priceCateNavs: [],
    proofCateNavs: [],
    cutterCateNavs: []
  },
  mutations: {
    SET_PRICE_CATE_NAVS: (state, priceCateNavs) => {
      state.priceCateNavs = priceCateNavs;
    },
    SET_PROOF_CATE_NAVS: (state, proofCateNavs) => {
      state.proofCateNavs = proofCateNavs;
    },
    SET_CUTTER_CATE_NAVS: (state, cutterCateNavs) => {
      state.cutterCateNavs = cutterCateNavs;
    }
  },
  actions: {
    // 获取分类菜单
    GetPriceCateNavs({ commit }) {
      return new Promise((resolve, reject) => {
        getAllVoList({ status: 1, pinyiban: 1 })
          .then(response => {
            const result = response.data;
            commit('SET_PRICE_CATE_NAVS', result);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取分类菜单
    GetProofCateNavs({ commit }) {
      return new Promise((resolve, reject) => {
        getAllVoList({ status: 1, proofStatus: 1 })
          .then(response => {
            const result = response.data;
            commit('SET_PROOF_CATE_NAVS', result);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取分类菜单
    GetCutterCateNavs({ commit }) {
      return new Promise((resolve, reject) => {
        getAllVoList({ moldStatus: 1 })
          .then(response => {
            const result = response.data;
            commit('SET_CUTTER_CATE_NAVS', result);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};

export default category;

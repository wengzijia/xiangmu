import { listByPids, getNotice } from '@/api/news/newsApi';
const news = {
  state: {
    standardList: [],
    noticeList: []
  },
  mutations: {
    SET_LIST: (state, { key, value }) => {
      state[key] = value;
    }
  },
  actions: {
    /**
     * 检验标准列表
     */
    getStandardList({ commit }) {
      return listByPids({ list: [9] }).then(res => {
        if (res.success) {
          commit('SET_LIST', {
            key: 'standardList',
            value: res.data[0].list.sort((a, b) => a.level - b.level).filter(item => item.name != '' && item.name != null)
          });
        }
      });
    },
    /**
     * 网站顶部系统通知
     */
    getTopNotice({ commit }) {
      return getNotice().then(res => {
        if (res.success) {
          commit('SET_LIST', {
            key: 'noticeList',
            value: res.data
          });
        }
        return res;
      });
    }
  }
};

export default news;

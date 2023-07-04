const iron = {
  state: {
    size: ''
  },
  mutations: {
    SET_SIZE_INFO: (state, size) => {
      state.size = size;
    }
  },
  actions: {
    sizeInfo({ commit }, size) {
      commit('SET_SIZE_INFO', size);
    }
  }
};

export default iron;

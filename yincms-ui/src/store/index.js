import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';
// default router permission control
// import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: modules,
  getters
});

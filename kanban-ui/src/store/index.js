import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';
import getters from './getters';
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex);
const store = new Vuex.Store({
  // ...
    modules: modules,
    getters,
    // plugins: [createPersistedState()]
    plugins: [createPersistedState()]
})
export default store
// export default new Vuex.Store({
//   modules: modules,
//   getters
// });

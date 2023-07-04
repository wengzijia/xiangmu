import { login, getCurrentUserInfo, logout, smsLogin } from '@/api/users/userApi.js';
import { countCart } from '@/api/cart/cartApi';
import { ACCESS_TOKEN, CURRENT_USER_INFO } from '@/store/global-constant';
import { encodingMobile } from '@/utils/strUtil';
import store from '@/store';
const user = {
  state: {
    token: '',
    info: null,
    cartNum: 0,
    proofCartNum: 0,
    activitys: '2022-08-09 00:00:00',
    activitye: '2022-09-08 18:00:00',
    activityDiscount: 0.85,
    activitystatus: true,
    pinyibanHeaders: {}
  },

  mutations: {
    SET_CART_NUM(state, cartNum) {
      state.cartNum = cartNum;
    },
    SET_PROOF_CART_NUM(state, proofCartNum) {
      state.proofCartNum = proofCartNum;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
    SET_HEADERS: (state, info) => {
      state.pinyibanHeaders = info;
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            const token = response.data;
            localStorage.setItem(ACCESS_TOKEN, token);
            localStorage.removeItem(CURRENT_USER_INFO);
            commit('SET_TOKEN', token);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 短信登录
    SmsLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        smsLogin(userInfo)
          .then(response => {
            const token = response.data;
            localStorage.setItem(ACCESS_TOKEN, token);
            localStorage.removeItem(CURRENT_USER_INFO);
            commit('SET_TOKEN', token);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取用户信息
    GetUserInfo({ commit }) {
      // if (localStorage.getItem(CURRENT_USER_INFO)) {
      //   commit('SET_INFO', JSON.parse(localStorage.getItem(CURRENT_USER_INFO)));
      // } else {
      return new Promise((resolve, reject) => {
        getCurrentUserInfo()
          .then(response => {
            const result = response.data;
            result.mobile2 = encodingMobile(response.data.mobile);
            commit('SET_INFO', result);
            // localStorage.setItem(CURRENT_USER_INFO, JSON.stringify(result));
            //获取购物车数量
            store.dispatch('CartCount').then(() => {});
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
      // }
    },
    // 登出
    Logout({ commit, state }) {
      return new Promise(resolve => {
        if (localStorage.getItem(ACCESS_TOKEN)) {
          logout(state.token).finally(() => {
            commit('SET_TOKEN', '');
            commit('SET_INFO', null);
            localStorage.removeItem(CURRENT_USER_INFO);
            localStorage.removeItem(ACCESS_TOKEN);
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    //获取购物车数量
    CartCount({ commit }) {
      countCart()
        .then(res => {
          if (res.success) {
            commit('SET_CART_NUM', res.data.cartCount);
            commit('SET_PROOF_CART_NUM', res.data.cartProofCount);
          }
        })
        .catch(err => {
          commit('SET_CART_NUM', 0);
          commit('SET_PROOF_CART_NUM', 0);
        });
    },
    getHeaders: ({ commit }, info = { sysType: 'pinyiban_wx' }) => {
      commit('SET_HEADERS', info);
    }
  }
};

export default user;

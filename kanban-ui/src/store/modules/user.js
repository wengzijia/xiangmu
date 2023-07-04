import { getUserInfo} from '@/api';//getDingTalkUserInfo, logout, smsLogin
import { setToken, removeToken } from '@/utils/auth'
import socket from '@/utils/webSocket'
import {  Toast } from 'vant'
import router from '@/router';
import{verifySmsCode} from '@/api/login.js'

const user = {
  state: {
      token: '',
      userInfo: {}
  },

  mutations: {
    SET_USER_INFO: (state, info) => {
      state.userInfo = info;
    }
  },
  actions: {
    // GET_INFO({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     getUserInfo({})
    //       .then(res => {
    //         if(res.success){
    //           // res.data.nickname.replace(res.data.nickname.slice(3,7),'****')
    //           const data = {...res.data,nickname2:res.data.nickname}
    //           commit('SET_USER_INFO', data)
    //           socket(data.ddUserid)
    //           resolve(data)
    //          }else{
    //           reject()
    //          }
    //       })
    //       .catch(err => {
    //         reject(err)
    //       })
    //   })
    // },
    SET_INFO({ state,commit },params) {
        commit('SET_USER_INFO', params)
    },
  }
};

export default user;

import { ref } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import router from "@/router";
const tokenName = 'yun_aocai_token'
const userInfoName = 'yun_aocai_userInfo'
export const useUserStore = defineStore("userStore", () => {
  const userInfo = ref({});
  const token = ref("");

  /****************************************** token相关逻辑 ******************************************/
  // 设置token
  const setUserToken = (data) => {
    const flag = localStorage.getItem("automaticValue") //判断用户是否勾选自动登录按钮
    flag ? localStorage.setItem(tokenName, data) : sessionStorage.setItem(tokenName, data)
    token.value = data;
  };

  // 获取token
  const getToken = () => {
    const flag = localStorage.getItem("automaticValue") //判断用户是否勾选自动登录按钮
    const tokenValue = flag ? localStorage.getItem(tokenName) : sessionStorage.getItem(tokenName)

    return tokenValue
  };
  /****************************************** token相关逻辑 ******************************************/

  /****************************************** userInfo相关逻辑 ******************************************/
  // 设置userInfo
  const setUserInfo = (data) => {
    localStorage.setItem(userInfoName, JSON.stringify(data));
    Object.assign(userInfo.value, data);
  };

  // 获取userInfo
  const getUserInfo = () => {
    const userInfoData = localStorage.getItem(userInfoName);

    if (userInfoData) {
      return JSON.parse(userInfoData);
    }

    return undefined;
  };
  /****************************************** userInfo相关逻辑 ******************************************/

  /****************************************** 退出登录逻辑 ******************************************/
  // const userLoginOut = () => {
  //   console.log("userLoginOut", router);
  //   // 清除本地缓存
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   router.push({ name: "Login" });
  //   // 退出登录
  //   api.loginOut();
  // };
  /****************************************** 退出登录逻辑 ******************************************/

  return {
    userInfo,
    setUserToken,
    getToken,
    setUserInfo,
    getUserInfo,
  };
});

<template>
  <div class="login">
    <div class="login-left"></div>
    <div style="position: relative;">
      <div class="login-logo"></div>
      <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
        <h3 class="title">工程管理平台</h3>
        <el-form-item prop="username" style="margin-top: 60px;" :error="error.user">
          <el-input
            v-model="loginForm.username"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="请输入用户名"
            style="height: 48px;"
          >
            <template #prefix>
              <img src="../assets/images/icon_user.png" style="width: 24px;height: 24px;margin-right: 20px;" alt="">
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-top: 32px;" :error="error.password">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
            style="height: 48px;"
          >
            <template #prefix>
              <img src="../assets/images/icon_password.png" style="width: 24px;height: 24px;margin-right: 20px" alt="">
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaEnabled" style="margin-top: 32px;" :error="error.code">
          <el-input
            v-model="loginForm.code"
            size="large"
            auto-complete="off"
            placeholder="请输入验证码"
            style="width: 216px;height: 48px;"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <img src="../assets/images/icon_code.png" style="width: 24px;height: 24px;margin-right: 20px" alt="">
            </template>
          </el-input>
          <div class="login-code">
            <el-button v-if="!codeUrl" @click="getCode" class="login-code-btn login-code-img login-font-size">获取验证码</el-button>
            <img v-else :src="codeUrl" @click="getCode" class="login-code-img"/>
          </div>
        </el-form-item>
        <el-checkbox v-if="isKeep" v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
        <el-form-item style="width:100%;margin-top: 74px;">
          <el-button
            :loading="loading"
            size="large"
            class="login-btn"
            @click.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div style="float: right;" v-if="register">
            <router-link class="link-type" :to="'/register'">立即注册</router-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span></span>
    </div>
  </div>
</template>

<script setup>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter();
const { proxy } = getCurrentInstance();
const error = ref({
  user: null,
  code: null,
  password: null
})
const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
  code: "",
  uuid: ""
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(false);
// 记住密码开关
const isKeep = ref(false)
const redirect = ref(undefined);

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore.login(loginForm.value).then(() => {
        router.push({ path: redirect.value || "/" });
      }).catch((err) => {
        error.value = {
          user: null,
          password: null,
          code: null
        }
        if (err.code == 515) {
          error.value.user = '用户不存在'
        } else if (err.code == 516) {
          error.value.password = '用户密码错误'
        } else if (err.code == 517) {
          error.value.code = '验证码错误'
        }
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
  });
}

function getCode() {
  return getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}
function getCookie() {
  if (!isKeep.value) {
    return
  }
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

getCode();
getCookie();
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login_backgroud.png");
  background-size: cover;
}
.title {
  margin: 0px;
  text-align: center;
  font-size: 28px;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
  font-weight: bold;
  color: #333333;
}

.login-form {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background: #ffffff;
  width: 450px;
  height: 518px;
  padding: 40px 45px 34px 45px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 128px;
  height: 48px;
  margin-left: 16px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 100%;
  width: 100%;
}
.login-code-btn {
  border-radius: 8px;
  color: #E60021;
  border: 1px solid #E60021;
}
.login-font-size {
  font-size: 16px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
}
.login-left {
  height: 518px;
  width: 450px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background-image: url("../assets/images/login_left.png");
}
.login-logo {
  background-image: url("../assets/images/login_logo.png");
  height: 62px;
  width: 112px;
  position: absolute;
  top: -85px;
  left: -74px;
}
.login-btn {
  font-size: 22px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  width:100%;
  background-color: #E60021;
  color: #fff;
  height: 54px;
  border-radius: 8px;
}

</style>
<style scoped>
:deep(.el-input__wrapper) {
  background-color: #f2f2f2;
  border-radius: 8px;
  box-shadow: 0 0 0 0px var(--el-input-border-color,var(--el-border-color)) inset;
  padding-left: 12px;
}
:deep(.el-input__inner) {
  font-size: 16px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #B5B5B5;
}
</style>
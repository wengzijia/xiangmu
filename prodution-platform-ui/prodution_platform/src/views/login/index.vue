<template>
  <div class="login_page">
    <div class="login_bg_box">
      <LoginBg />
    </div>
    <div class="login_main_container">
      <div class="login_box">
        <div class="logo_box">
          <!-- <el-image :src="logoImg" class="logo" /> -->
          <SvgIcon name="logoImg" color="var(--default-main-color)" w="110px" h="110px" />
        </div>
        <div class="title">生产管理平台</div>
        <div class="logo_box_content">
          <div class="change_login_way_btn" @click="handleChangeLoginWay(1, 2)">
            <!-- <img :src="changeLoginWayIcon" alt="" /> -->
            <SvgIcon :name="changeLoginWayIcon" color="var(--default-main-color)" w="56px" h="56px" />
          </div>
          <div v-show="!isPhonLogin" class="phone_login_box">
            <el-form ref="ruleFormRef" :model="formData" status-icon label-width="120px" class="demo-ruleForm">
              <el-form-item prop="mobile">
                <div class="input_item">
                  <div class="input_item_top">
                    <!-- <img class="input_icon" :src="phoneIcon" alt="" /> -->
                    <SvgIcon name="phoneIcon" color="var(--default-main-color)" w="30px" h="30px" />
                    <div class="input_title">手机号</div>
                  </div>
                  <div class="input_item_bottom">
                    <div class="input_left">86</div>
                    <el-input v-model.trim="formData.mobile" class="phone_input login_input" maxlength="11" 
                      placeholder="请输入手机号" />
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="verificationCode">
                <div class="input_item verificationCode_item">
                  <div class="input_item_top">
                    <!-- <img class="input_icon" :src="codeIcon" alt="" /> -->
                    <SvgIcon name="codeIcon" color="var(--default-main-color)" w="30px" h="30px" />
                    <div class="input_title">验证码</div>
                  </div>
                  <div class="input_item_bottom">
                    <el-input v-model.trim="formData.verificationCode" class="code_input login_input" maxlength="4"
                      placeholder="请输入验证码" />
                    <div class="input_right verificationCode_btn" :class="{
                      verificationCode_waiting: verificationCodeWaiting,
                    }" @click="getVerificationCode">
                      {{ codeText }}
                      <span v-if="verificationCodeWaiting" class="time_text" style="color: #999">
                        后重试
                      </span>
                    </div>
                  </div>
                </div>
              </el-form-item>

              <div class="auto_login_box">
                <!-- <el-checkbox class="auto_login_checked" @change="automaticLogin" v-model="automaticValue" label="自动登录" /> -->
              </div>
              <button class="login_btn" @click.prevent="handleLogin">
                登录
              </button>
            </el-form>

            <div class="other_login_way_box">
              <div class="other_login_btn" @click="handleChangeLoginWay(2, 1)">
                <img :src="dingCodeIcon" alt="" />
              </div>
              <div class="other_login_btn" @click="handleChangeLoginWay(2, 2)">
                <img :src="wechatCodeIcon" alt="" />
              </div>
            </div>
          </div>
          <div v-show="isPhonLogin && codeLoginType === 1" class="dingding_login_box code_login_box">
            <div class="code_login_title">使用钉钉扫码登录</div>
            <div class="login_code_box">
              <!-- <div>暂不支持钉钉扫码</div> -->
              <img v-if="authorizeCodeImg" :src="authorizeCodeImg" alt="" />
              <div v-if="QRcodeExpired" class="refreshCodeBox">
                <p>
                  <span>二维码已过期</span>
                  <span @click="handleChangeLoginWay(2, 1)">点击刷新</span>
                </p>
              </div>
            </div>
            <div class="change_code_way" @click="handleChangeLoginWay(2, 2)">
              <img class="code_icon" :src="wechatCodeIcon" alt="" />
              <span class="code_label">使用微信扫码登录</span>
            </div>
          </div>
          <div v-show="isPhonLogin && codeLoginType === 2" class="wechat_login_box code_login_box">
            <div class="code_login_title">使用微信扫码登录</div>
            <div class="login_code_box">
              <img v-if="authorizeCodeImg" :src="authorizeCodeImg" alt="" />
              <div v-if="QRcodeExpired" class="refreshCodeBox">
                <p>
                  <span>二维码已过期</span>
                  <span @click="handleChangeLoginWay(2, 2)">点击刷新</span>
                </p>
              </div>
            </div>
            <div class="change_code_way" @click="handleChangeLoginWay(2, 1)">
              <img class="code_icon" :src="dingCodeIcon" alt="" />
              <span class="code_label">使用钉钉扫码登录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script name="Login" setup>
import dingCodeIcon from "@/assets/images/ding_code_icon.png";
import wechatCodeIcon from "@/assets/images/wechat_code_icon.png";
import { ref, computed, reactive, nextTick } from "vue";
import { ElMessage } from "element-plus";
import api from "@/api";
import { useRouter } from "vue-router";
// import appStore from "@/stores/index.js";
import { useDebounceFn } from "@vueuse/core";
import { isMobile } from "@/utils/commonUtils";
import { setToken, setUserInfo,setMenuList,setAuthorityJudgment} from '@/utils/commonApi'
// const { setUserToken, setUserInfo } = appStore.useUserStore || {}
const router = useRouter();
const routerParams = router.currentRoute._value.query
// const routerParams = router.currentRoute._value.query.type||''
console.log('获取页面携带的入参：',routerParams)
localStorage.setItem("viewModule",routerParams.type||'')


let automaticValue = ref(localStorage.getItem("automaticValue") == 1 ? true : false) //自动登录
let QRcodeExpired = ref(false) //二维码是否过期
localStorage.setItem("automaticValue", 1);



/**
 * 
 * @param {切换自动登录} e 
 */
const automaticLogin = (e) => {
  console.log(e)
  automaticValue.value = e
  // localStorage.setItem("automaticValue", e ? 1 : 0);
  // localStorage.setItem("automaticValue", 1);
}
/********************************************** 切换登录方式逻辑 **********************************************/
let isPhonLogin = ref(false);
let codeLoginType = ref(1);
let changeLoginWayIcon = computed(() => {
  return isPhonLogin.value ?  'code_login_icon' : 'phone_login_icon' 
  
});

const handleChangeLoginWay = (type, codeType) => {
  QRcodeExpired.value = false
  authorizeCodeImg.value = "";
  authorizeCodeUuid.value = "";
  clearInterval(authorizeCodeTimer);
  authorizeCodeTimer = null;
  // 切回账号登录 type 1为账号登录
  if (type === 1 && isPhonLogin.value) {
    isPhonLogin.value = false;
    return;
  }

  isPhonLogin.value = true;
  // 切到二维码登录, codeType 1为钉钉登录, codeType 2为微信登录
  if (codeType === 1) {
    codeLoginType.value = codeType;
    // 钉钉登录
    handleGetAuthorizeCode(2,2);
    return;
  }

  if (codeType === 2) {
    codeLoginType.value = codeType;
    handleGetAuthorizeCode(1,2);
    // 微信登录
    return;
  }
};

// 获取授权二维码
let authorizeCodeImg = ref("");
let authorizeCodeUuid = ref("");
let authorizeCodeTimer = null;
// let authorizeCodeTimer = null;
const handleGetAuthorizeCode = (thirdType,type) => {
  const reqData = {
    thirdType: thirdType,
    type: type,
  };
  api.getUuidAndQrUrl(reqData).then((res) => {
    console.log("sendNoteLogin", res, res.data.qrURL);
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    authorizeCodeImg.value = res.data.qrURL;
    authorizeCodeUuid.value = res.data.uuid;
    getCheckUuidStatus(thirdType)
  }).catch(err => {
    return ElMessage.error('获取二维码失败');
  })
};

/**
 * 轮询，生成二维码之后，立即调用服务判断当前二维码是否扫描授权登录，在服务调用成功之后，间隔一秒钟重新调用一次
 */
var getCheckUuidStatus = (thirdType) => {
  const reqData = {
    type: 2,
    uuid: authorizeCodeUuid.value,
    thirdType
  };
  console.log("authorizeCodeTimer", reqData);
  api
    .checkUuidStatus(reqData)
    .then((res) => {

      if (res.code !== "000000") return ElMessage.error(res.message);
      const { qrStatus, token } = res.data || {}
      // 二维码失效
      if (qrStatus == 2) return QRcodeExpired.value = true
      // 扫码登录成功
      if (qrStatus == 1) {
        //用户登录成功，将后台返回的用户角色进行区分
        
        console.log("轮询:", res.data.qrStatus);
        // setUserToken(token); // 保存token
        // commonInfoApi.setToken(token)
        setToken(token)

        return getUserInfoData(1)
      }
      authorizeCodeTimer = setTimeout(() => {
        getCheckUuidStatus(thirdType)
      }, 1000);
    }).catch((err) => {

    });
}
/********************************************** 切换登录方式逻辑 **********************************************/

/********************************************** 账号登录方式逻辑 **********************************************/
let codeText = ref("获取验证码");
let verificationCodeWaiting = ref(false);
let verificationCodeTimer = null;
let verificationCodeTime = 60;

// 获取验证码
const getVerificationCode = useDebounceFn(() => {
  if (formData.mobile === "") {
    return ElMessage.warning("请输入手机号");
  }

  if (!isMobile(formData.mobile)) {
    return ElMessage.warning("请输入正确的手机号");
  }

  if (verificationCodeWaiting.value) {
    return ElMessage.warning("请勿重复获取");
  }

  const reqData = {
    language: "zh-cn",
    mobile: formData.mobile,
  };
  api
    .sendNoteLogin(reqData)
    .then((res) => {
      console.log("sendNoteLogin", res);
      if (res.code !== "000000") {
        verificationCodeWaiting.value = false;
        return ElMessage.error(res.message);
      }

      verificationCodeWaiting.value = true;

      codeText.value = `${verificationCodeTime}秒`;
      verificationCodeTime--;
      verificationCodeTimer = setInterval(() => {
        if (verificationCodeTime < 1) {
          verificationCodeWaiting.value = false;
          clearInterval(verificationCodeTimer);
          verificationCodeTimer = null;
          nextTick(() => {
            verificationCodeTime = 60;
            codeText.value = "获取验证码";
          });
        }

        codeText.value = `${verificationCodeTime}s`;
        verificationCodeTime--;
      }, 1000);
    })
    .catch((err) => {
      verificationCodeWaiting.value = false;
      return ElMessage.error(err);
    });
}, 500);

const formData = reactive({
  mobile: "",
  verificationCode: "",
});

const checkForm = () => {
  console.log(formData, formData.mobile);
  if (formData.mobile === "") {
    ElMessage.error({
      message: "手机号不能为空",
    });
    return false;
  }


  if (!isMobile(formData.mobile)) {
    ElMessage.warning("请输入正确的手机号");
    return false
  }

  if (formData.verificationCode === "") {
    ElMessage.error({
      message: "验证码不能为空",
    });
    return false;
  }

  return true;
};

const handleLogin = useDebounceFn(() => {
  let flag = checkForm();

  if (!flag) {
    return;
  }

  api.loginValidCode(formData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    // 保存token
    // commonInfoApi.setToken(res.data)
    // setUserToken(res.data);
    setToken(res.data)
    // 获取用户信息
    getUserInfoData();
    // 执行登录成功跳转逻辑

  });
}, 500);
/********************************************** 账号登录方式逻辑 **********************************************/
/********************************************** 获取用户信息逻辑 **********************************************/
/**
 * 
 * @param {登录类型} type 1--表示微信扫码登录；2--钉钉扫码登录
 */
var getUserInfoData = (type = 0) => {
  api.loginOkUserRoleAuthList().then((res) => {
    if (res.code !== "000000") return ElMessage.error(res.message);
    console.log('获取用户信息：', res.data)
    const {userRoleList,isIndustrFinance} = res.data || {}
    const options = setAuthorityJudgment(userRoleList,isIndustrFinance)
    console.log(options,'判断用户的权限组是否有返回')
    if(!options) {
      //如果用户没有权限，此时token已经存储，所以将存储的token删除掉
      setToken('')
      return ElMessage.error("暂无访问权限，请联系管理员添加！");
    }
    setUserInfo(res.data)
    localStorage.setItem('yun_login_type', type)
    setMenuList()
    const returnUrl = routerParams&&routerParams.redirect ? JSON.parse(routerParams.redirect): []
    if(returnUrl&&returnUrl.length>0){
      const commonValues = returnUrl.filter(value => options.includes(value))
      return router.push({path:commonValues[0]})
    } 
    setTimeout(() => { location.reload() }, 0)

  });
};
/********************************************** 获取用户信息逻辑 **********************************************/
</script>

<style lang="scss" scoped>
.login_page {
  // background-color: #e9f1ef;
  position: relative;

  .login_main_container {
    width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    height: 100vh;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }

  .login_bg_box {
    height: 100vh;
    position: absolute;
    left: 0;

    .login_bg {
      height: 100vh;
    }
  }

  .login_box {
    width: 480px;
    display: flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .logo {
      width: 110px;
      height: 110px;
      margin-bottom: 12px;
    }

    .title {
      margin-bottom: 20px;
      font-size: 32px;
      font-family: Source Han Sans CN-Bold, Source Han Sans CN;
      font-weight: bold;
      color: #333333;
      line-height: 38px;
    }

    .logo_box_content {
      width: 480px;
      height: 521px;
      background: #ffffff;
      box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.1);
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
      border: 1px solid #f0f0f0;
      position: relative;

      .change_login_way_btn {
        width: 56px;
        height: 56px;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;

        &:hover {
          opacity: 0.8;
        }

        >img {
          width: 100%;
          height: 100%;
        }
      }

      .phone_login_box {
        padding: 50px 40px 40px;

        :deep(.el-form-item) {
          margin-bottom: 0;
        }

        :deep(.el-form-item__content) {
          margin-left: 0 !important;
        }

        .input_item {
          display: flex;
          flex-direction: column;
          margin-bottom: 54px;

          &.verificationCode_item {
            margin-bottom: 0;
          }

          .input_item_top {
            height: 30px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;

            .input_icon {
              width: 30px;
              height: 30px;
            }

            .input_title {
              margin-left: 8px;
              font-size: 20px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              font-weight: 400;
              color: #333;
            }
          }

          .input_item_bottom {
            height: 58px;
            box-sizing: border-box;
            padding: 12px 0;
            border-bottom: 1px solid #c0c0c0;
            display: flex;
            align-items: center;

            .input_left {
              width: 50px;
              height: 34px;
              box-sizing: border-box;
              border-right: 1px solid #c0c0c0;
              font-size: 18px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              font-weight: 400;
              color: #333;
              display: flex;
              align-items: center;
            }


            .input_right {
              width: 130px;
              text-align: right;
              font-size: 18px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              font-weight: 400;
              color: var(--default-main-color);
              cursor: pointer;
              user-select: none;

              &.verificationCode_waiting {
                // opacity: 0.5;
              }
            }

            .login_input {
              border: none;
              outline: none;
              font-size: 18px;

              :deep(.el-input__wrapper) {
                box-shadow: none;

                .el-input__inner {
                  &::placeholder {
                    font-size: 18px;
                    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                    font-weight: 400;
                    color: #999;
                  }

                }
              }
            }

            // :deep(.el-input__inner) {
            //   &::placeholder {
            //     font-size: 18px;
            //     font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            //     font-weight: 400;
            //     color: #C0C0C0;
            //   }
            // }

            .phone_input {
              width: 354px;
              padding: 0 20px 0 16px;
              color: #333;
            }

            .code_input {
              width: 270px;
            }
          }
        }

        .auto_login_box {
          margin-bottom: 30px;

          :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
            background-color: var(--default-main-color);
            border-color: var(--default-main-color);
            display: flex;
            align-items: center;
            justify-content: center;

            &::after {
              left: 5px !important;
              top: 2px !important;
            }
          }

          :deep(.el-checkbox__inner) {
            width: 16px;
            height: 16px;
          }

          :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
            color: var(--default-main-color);
          }

          :deep(.el-checkbox__label) {
            font-size: 16px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #999999;
          }
        }

        .login_btn {
          width: 400px;
          height: 48px;
          margin-bottom: 30px;
          background: var(--default-main-color);
          border-radius: 8px 8px 8px 8px;
          outline: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;

          &:hover {
            opacity: 0.8;
          }
        }

        .other_login_way_box {
          display: flex;
          justify-content: center;
          align-items: center;

          .other_login_btn {
            width: 30px;
            height: 30px;
            cursor: pointer;
            margin-right: 20px;

            &:last-child {
              margin: 0;
            }

            &:hover {
              opacity: 0.8;
            }

            >img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .code_login_box {
        padding: 48px 90px 30px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .code_login_title {
          margin-bottom: 40px;
          font-size: 22px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #333333;
          line-height: 33px;
        }

        .login_code_box {
          width: 300px;
          height: 300px;
          margin-bottom: 40px;
          background-color: #fafafa;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          >img {
            width: 300px;
            height: 300px;
          }

          // &::after {
          //   content: '';
          //   position: absolute;
          //   width: 300px;
          //   height: 300px;
          //   // background-color: rgba(255,255,255, .5);
          //   background-color: rgba(255, 255, 255, .9);
          //   left: 0;
          //   top: 0;
          // }
          .refreshCodeBox {
            position: absolute;
            width: 300px;
            height: 300px;
            // background-color: rgba(255,255,255, .5);
            background-color: rgba(255, 255, 255, .9);
            left: 0;
            top: 0;

            >p {
              color: #353535;
              font-size: 14px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              text-align: center;

              >span {
                display: block;
                width: 160px;
                padding: 0 10px;
                box-sizing: border-box;
                line-height: 20px;
              }

              >span:last-child {
                cursor: pointer;
                color: #576b95;
                text-decoration: none;
              }
            }
          }




        }

        .change_code_way {
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }

          .code_icon {
            width: 30px;
            height: 30px;

            >img {
              width: 30px;
              height: 30px;
            }
          }

          .code_label {
            margin-left: 8px;
            font-size: 16px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: var(--default-main-color);
          }
        }
      }
    }
  }
}
</style>

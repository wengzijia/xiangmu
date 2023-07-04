<template>
  <div class="user_center_page">
    <CommonBreadCrumb :first="'个人中心'" :marginBottom="'16px'" />
    <div class="basic_info_box">
      <div class="blank_title_box">个人资料</div>
      <div class="basic_info_content">
        <div class="basic_info_content_left">
          <div class="pic_box">
            <img v-if="userDetail.userPortrait" class="avatar"
              :src="`http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/${userDetail.userPortrait}`" alt="" />
            <img v-if="!userDetail.userPortrait" src="@/assets/images/defualt_head_pic.png"
              style="width: 130px; height: 130px" alt="" />
          </div>
          <div ref="cutPicBoxRef" class="cut_pic_box" :style="{
            width: `${cutBoxData.width}px`,
            height: `${cutBoxData.height}px`,
          }">
            <div class="avatar_box" :style="{
              left: `${-cutBoxData.left}px`,
              top: `${-cutBoxData.top}px`,
            }">
              <img v-if="fileList.length" :src="fileList[0].url" alt="" />
            </div>
          </div>
          <div class="change_pic_btn">
            <Upload style="width: 12px; height: 12px; margin-right: 4px" />
            更换头像
            <div class="change_pic_btn_modal">
              <!-- :before-remove="beforeRemove"  -->
              <el-upload ref="uploadRef" v-model:file-list="fileList" class="avatar_upload" action="#" :limit="1"
                :auto-upload="false" list-type="picture" accept=".jpg,.image,.png,.jpeg">
                <el-button type="primary" style="opacity: 0">Click to upload</el-button>
                <template #file="{ file }">
                  <div></div>
                  <el-dialog v-model="isUploading" width="540" :show-close="false" :destroy-on-close="true"
                    :close-on-click-modal="false" :close-on-press-escape="false" :http-request="uploadAvatar">
                    <template #header>
                      <div class="dialog_header">
                        <div class="dialog_header_title">上传头像</div>
                        <div class="dialog_close_btn" @click="handleCloseUploadDialog">
                          <Close style="width: 24px; height: 24px" />
                        </div>
                      </div>
                      <div class="upload_dialog_content">
                        <div class="upload_dialog_body">
                          <div class="avatar_box">
                            <img :src="file.url" :style="{
                              width: imgSize.width,
                              height: imgSize.height,
                            }" alt="" />
                            <div class="cut_box_modal" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
                              @mouseup="handleMouseUp" @mouseleave="handleMouseLeave"></div>
                            <div class="avatar_box_modal">
                              <div class="avatar_box_modal_box">
                                <div class="cut_box" :style="{
                                  width: `300px`,
                                  height: `300px`,
                                  left: `${cutBoxData.left}px`,
                                  top: `${cutBoxData.top}px`,
                                }">
                                  <div class="cut_box_content">
                                    <span v-if="
                                      cutBoxData.width !== 0 &&
                                      cutBoxData.height !== 0
                                    " class="cut_box_position_box left_top" />
                                    <span v-if="
                                      cutBoxData.width !== 0 &&
                                      cutBoxData.height !== 0
                                    " class="cut_box_position_box left_bottom" />
                                    <span v-if="
                                      cutBoxData.width !== 0 &&
                                      cutBoxData.height !== 0
                                    " class="cut_box_position_box right_top" />
                                    <span v-if="
                                      cutBoxData.width !== 0 &&
                                      cutBoxData.height !== 0
                                    " class="cut_box_position_box right_bottom" />
                                    <span v-if="
                                      cutBoxData.width !== 0 &&
                                      cutBoxData.height !== 0
                                    " class="cut_box_position_box top_middle" />
                                    <span v-if="
                                      cutBoxData.width !== 0 &&
                                      cutBoxData.height !== 0
                                    " class="cut_box_position_box left_middle" />
                                    <span v-if="
                                      cutBoxData.width !== 0 &&
                                      cutBoxData.height !== 0
                                    " class="cut_box_position_box right_middle" />
                                    <span v-if="
                                      cutBoxData.width !== 0 &&
                                      cutBoxData.height !== 0
                                    " class="cut_box_position_box bottom_middle" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="upload_dialog_footer">
                          <el-button class="upload_btn" color="#338f7a" @click="sureUploadAvatar(file)">
                            确定
                          </el-button>
                          <el-button class="cancel_upload_btn" color="#fff" @click="handleCloseUploadDialog">
                            取消
                          </el-button>
                        </div>
                      </div>
                    </template>
                  </el-dialog>
                </template>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="basic_info_content_right">
          <div class="basic_info_item">
            <div class="basic_info_label">姓名</div>
            <div class="basic_info_val">{{ userDetail.userName }}</div>
            <div class="change_phone_btn" @click="handleShowMobileBox(true,'name')">
              修改姓名
            </div>
          </div>
          <div class="basic_info_item">
            <div class="basic_info_label">手机号</div>
            <div class="basic_info_val">{{ userDetail.userMobile }}</div>
            <div class="change_phone_btn" @click="handleShowMobileBox(true,'mobile')">
              更换手机号
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="acount_info_box">
      <div class="blank_title_box">账号设置</div>
      <div class="acount_info_decs_box">
        <div class="acount_info_decs_title">绑定第三方账号</div>
        <div class="acount_info_decs">绑定后可使用以下账号直接登录当前账户</div>
      </div>
      <div class="third_acount_item">
        <div class="third_acount_icon_box">
          <img v-if="!wechatInfo" src="@/assets/images/wechat_code_icon_2.jpg" alt="" />
          <img v-if="wechatInfo" src="@/assets/images/wechat_code_icon.png" alt="" />
        </div>
        <div v-if="!wechatInfo" class="third_acount_btn" @click="bindWechat">
          绑定微信
        </div>
        <div v-if="wechatInfo" class="third_acount_btn" @click="unBindWechat(1)">
          解除绑定
        </div>
        <div v-if="wechatInfo" class="third_acount_id">
          ID:{{ wechatInfo.nickName }}
        </div>
      </div>

      <div class="third_acount_item">
        <div class="third_acount_icon_box">
          <img v-if="!ddInfo" src="@/assets/images/ding_code_icon_2.jpg" alt="" />
          <img v-if="ddInfo" src="@/assets/images/ding_code_icon.png" alt=""
          />
        </div>
        <div v-if="!ddInfo" class="third_acount_btn" @click="bindDingDing">绑定钉钉</div>
        <div v-if="ddInfo" class="third_acount_btn" @click="unBindWechat(2)">解绑钉钉</div>
        <div v-if="ddInfo" class="third_acount_id">
          ID:{{ ddInfo.nickName }}
        </div>
      </div>
    </div>

    <div class="role_info_box">
      <div class="blank_title_box">角色信息</div>
      <div class="role_info_content">
        <div class="role_info_title">角色名称</div>
        <div class="role_info_val">{{ roleName }}</div>
      </div>
    </div>
    <el-dialog v-model="isShowMobileDialog" width="540" :show-close="false" :destroy-on-close="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header>
        <div class="dialog_header">
          <div class="dialog_header_title">{{!isReviseName?'更换手机号':'修改姓名'}}</div>
          <div class="dialog_close_btn" @click="closeDialog">
            <Close style="width: 24px; height: 24px" />
          </div>
        </div>
      </template>
      <div class="mobile_dialog_content">
        <div class="mobile_dialog_body">
          <el-form ref="mobileDialogFormRef" :model="mobileDialogForm" status-icon :rules="mobileDialogFormRule" v-if="!isReviseName"
            label-width="120px" class="demo-ruleForm">
            <el-form-item label="旧手机号" prop="oldMobile">
              <div class="mobile_dialog_item">
                <el-input v-model.trim="mobileDialogForm.oldMobile" maxlength="11" placeholder="请输入您的手机号" @blur="oldMobileBlur" @input="inputChange($event,'oldMobile')"/>
              </div>
            </el-form-item>
            <el-form-item label="新手机号" prop="newMobile">
              <div class="mobile_dialog_item">
                <el-input v-model.trim="mobileDialogForm.newMobile" maxlength="11" placeholder="请输入您的手机号" @input="inputChange($event,'newMobile')" />
              </div>
            </el-form-item>
            <el-form-item label="验证码" prop="verificationCode">
              <div class="mobile_dialog_item">
                <div class="mobile_dialog_code_box">
                  <el-input v-model.trim="mobileDialogForm.verificationCode" maxlength="4" placeholder="请输入验证码" @input="inputChange($event,'verificationCode')"  />
                </div>
                <div class="send_code_btn" @click="handleSendCode(mobileDialogFormRef)">
                  {{ codeText }}
                </div>
              </div>
            </el-form-item>
          </el-form>
          <el-form ref="nameDialogFormRef" :model="nameDialogForm" status-icon :rules="nameDialogFormRule" v-if="isReviseName" @submit.prevent
            label-width="120px" class="demo-ruleForm">
            <el-form-item label="新名称" prop="userName">
              <div class="mobile_dialog_item">
                <el-input v-model.trim="nameDialogForm.userName" maxlength="5" placeholder="请输入您的新名称" />
              </div>
            </el-form-item>
          
          </el-form>
        </div>
        <div class="mobile_dialog_footer">
          <!-- <el-button class="mobile_dialog_btn"  @click="handleBindMobile">
            确定
          </el-button>
          <el-button class="mobile_dialog_btn" color="#338f7a" @click="closeDialog">
            取消
          </el-button> -->
          <CommonSureBtn style="margin-right: 80px" @click="handleBindMobile" v-if="!isReviseName" />
          <CommonSureBtn style="margin-right: 80px" @click="handleReviseName" v-if="isReviseName"/>
          <CommonCancelBtn @click="closeDialog" />
          <!-- <CommonCancelBtn @click="handleShowMobileBox(false)" /> -->
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="isShowBindResult" width="540" :show-close="false" :destroy-on-close="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header>
        <div class="dialog_header">
          <div class="dialog_header_title">更换成功</div>
          <div class="dialog_close_btn" @click="handleCloseBindResult">
            <Close style="width: 24px; height: 24px" />
          </div>
        </div>
        <div class="message_dialog_content">
          <div class="message_dialog_body">
            手机号更换成功，身份过期需要重新登录
          </div>
          <div class="message_dialog_footer">
            <el-button class="message_dialog_btn" color="#338f7a" @click="handleCloseBindResult">
              确定
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="isShowBindError" width="540" :show-close="false" :destroy-on-close="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header>
        <div class="dialog_header">
          <div class="dialog_header_title">绑定失败</div>
          <div class="dialog_close_btn" @click="handleCloseBindError">
            <Close style="width: 24px; height: 24px" />
          </div>
        </div>
        <div class="message_dialog_content">
          <div class="message_dialog_body">绑定失败，请稍后重试</div>
          <div class="message_dialog_footer">
            <el-button class="message_dialog_btn" color="#338f7a" @click="handleCloseBindError">
              确定
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="isShowBindWechat" width="360" :show-close="false" :destroy-on-close="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header>
        <div class="dialog_header">
          <div class="dialog_header_title">绑定{{codeType == 1 ? '微信' : '钉钉'}}</div>
          <div class="dialog_close_btn" @click="closeBindWechat">
            <Close style="width: 24px; height: 24px" />
          </div>
        </div>
        <div class="bindWechat_dialog_content">
          <div class="wechat_qrcode_img">
            <img v-if="wechatQrcode" :src="wechatQrcode" alt="" />
            <div v-if="QRcodeExpired" class="refreshCodeBox">
              <p>
                <span>二维码已过期</span>
                <span v-if="codeType == 1" @click="bindWechat">点击刷新</span>
                <span v-if="codeType == 2" @click="bindDingDing">点击刷新</span>
              </p>
            </div>
          </div>
          <div class="wechat_qrcode_tips">请使用{{codeType == 1 ? '微信' : '钉钉'}}扫一扫</div>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="isShowUnbindWechat" width="500" :show-close="false" :destroy-on-close="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header>
        <div class="dialog_header">
          <div class="dialog_header_title">解除绑定</div>
          <div class="dialog_close_btn" @click="handleCloseUnbindWechat">
            <Close style="width: 24px; height: 24px" />
          </div>
        </div>
        <div class="message_dialog_content">
          <div class="message_dialog_body">确定要解除绑定吗？</div>
          <div class="message_dialog_footer">
            <el-button class="unbind_whchat_btn" color="#338f7a" @click="handleSureUnbindWechat">
              确定
            </el-button>
            <el-button class="cancel_unbind_whchat_btn" color="#fff" @click="handleCloseUnbindWechat">
              取消
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script name="UserCenter" setup>
import api from "@/api";
import { ElMessage } from "element-plus";
import { computed, onMounted, reactive, ref } from "vue";
import html2canvas from "html2canvas";
// import appStore from "@/stores/index.js";
import { isMobile } from "@/utils/commonUtils";
import { userLoginOut, getUserInfo, setUserInfo } from '@/utils/commonApi'
// const { setUserInfo } = appStore.useUserStore || {}
let QRcodeExpired = ref(false) //二维码是否过期
onMounted(() => {
  getUserDetail();
});

/********************************************** 获取用户信息 **********************************************/
const userDetail = reactive({});

const roleName = computed(() => {
  if (!userDetail?.userRoleList) {
    return "";
  }

  let roleNameStr = userDetail.userRoleList
    .map((item) => item.roleName)
    .join("、");

  return roleNameStr;
});

// const wechatInfo = computed(() => {
//   console.log(userDetail?.thirdLoginList,'qwerty')
//   if (!userDetail?.thirdLoginList) {
//     return undefined;
//   }

//   return userDetail?.thirdLoginList[0];
// });

let ddInfo = reactive({})
let wechatInfo = reactive({})
const getUserDetail = () => {
  // const userInfo = getUserInfo() ||{}
  // if(userInfo&&userInfo.userId) return Object.assign(userDetail, userInfo)
  const reqData = {
    // userId: 2,
    // userId: JSON.parse(localStorage.getItem("userInfo")).userId,
    userId: getUserInfo().userId,
  };
  // userDetail.userPortrait = ''
  api.getPersonalDetail(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }
    ddInfo = undefined
    wechatInfo =undefined
    Object.assign(userDetail, res.data);
    if (!userDetail?.thirdLoginList) {
      ddInfo = undefined
      wechatInfo =undefined
    }
    if(userDetail?.thirdLoginList) {
      userDetail?.thirdLoginList.forEach(item => {
        if(item.loginType == 2){
          ddInfo = item 
          // wechatInfo =undefined
        }else if(item.loginType == 1) {
          wechatInfo = item
          // ddInfo = undefined
        } else {
          ddInfo = undefined
          wechatInfo =undefined
        }
      })
    }
    userDetail.userPortrait += '?'+ new Date().getTime()
    getUserInfoData();
  });
};

const getUserInfoData = () => {
  api.loginOkUserRoleAuthList().then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    setUserInfo(res.data);
  });
};
/********************************************** 获取用户信息 **********************************************/

/********************************************** 更换手机号逻辑 **********************************************/
let mobileDialogFormRef = ref(null);
let nameDialogFormRef = ref(null);
let codeTimer = null;
let codeTime = ref(0);
const isShowMobileDialog = ref(false);

const mobileDialogForm = ref({
  oldMobile: "",
  newMobile: "",
  verificationCode: "",
});
const  nameDialogForm = ref({
  userName: ''
})
const isOldMoble= ref(false)
const oldMobileBlur = (value) => {
  // let userMobile = getUserInfo()
  let { userMobile } = getUserInfo()
  // console.log(userMobile,'val',value,mobileDialogForm.value.oldMobile == userMobile)
  if(mobileDialogForm.value.oldMobile != userMobile) {
    isOldMoble.value = true
  } else {
    isOldMoble.value = false
    mobileDialogFormRef.value.validateField("oldMobile", () => {
      isOldMoble.value = false;
    });
  }
}
const inputChange = (value,str) => {
  // console.log(value,str)
  mobileDialogForm.value[str] = value.replace(/[^\d]/g, '')  // 限制只能输入数字
}
const validateMobile = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("手机号不能为空"));
  } else if (!isMobile(value)) {
    callback(new Error("请输入正确手机号"));
  } else if (rule.field == 'newMobile' && isBind.value) {
    callback(new Error(bindText.value));
  } else if ( rule.field == 'oldMobile' && isOldMoble.value) {
    callback(new Error('手机号输入错误'));
  } else {
    callback();
  }
};

const validateCode = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("验证码不能为空"));
  } else {
    callback();
  }
};
const validateName = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("名称不能为空"));
  } else {
    callback();
  }
};

const mobileDialogFormRule = ref({
  oldMobile: [{ validator: validateMobile, trigger: "blur" }],
  newMobile: [{ validator: validateMobile, trigger: "blur" }],
  verificationCode: [{ validator: validateCode, trigger: "blur" }],
});
const nameDialogFormRule = {
  userName: [{validator:validateName, trigger: "blur"}]
} 

const isBind = ref(false);
const bindText = ref('')

const codeText = computed(() => {
  if (codeTime.value === 0) {
    return "发送验证码";
  }

  return `${codeTime.value}秒后可重发`;
});

const handleSendCode = () => {
  if (codeTimer) {
    return ElMessage.warning("不可重复获取验证码");
  }
  if(isOldMoble.value) {
    return ElMessage.warning("手机号输入错误");
  }
  mobileDialogFormRef.value.validateField("newMobile", (valid) => {
    console.log("validateField", valid);
    if (!valid) {
      return;
    }

    const reqData = {
      language: "zh-cn",
      mobile: mobileDialogForm.value.newMobile,
    };

    api.sendNoteBind(reqData).then((res) => {
      if (res.code != '000000') {
        isBind.value = true;
        bindText.value = res.message
        mobileDialogFormRef.value.validateField("newMobile", () => {
          isBind.value = false;
        });
        return;
      }
      //  else {
      //   isBind.value = false;
      //   mobileDialogFormRef.value.validateField("newMobile", () => {
      //     isBind.value = false;
      //   })
      // }

      if (!codeTimer) {
        clearInterval(codeTimer);
        codeTimer = null;
      }

      codeTime.value = 60;
      codeTimer = setInterval(() => {
        if (codeTime.value === 0) {
          clearInterval(codeTimer);
          codeTimer = null;
          return;
        }

        codeTime.value--;
      }, 1000);
    });
  });
};

const handleBindMobile = () => {
  const reqData = {
    mobile: mobileDialogForm.value.newMobile,
    oldMobile: mobileDialogForm.value.oldMobile,
    verificationCode: mobileDialogForm.value.verificationCode,
  };

  mobileDialogFormRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }

    api.changeBindMobile(reqData).then((res) => {
      console.log("changeBindMobile", res);
      
      // if (res.code === "O-0000232" || res.code === "O-0000233") {
      //   isShowBindError.value = true;
      // } else 
      if (res.code === "000000") {
        handleShowMobileBox(false);
        isShowMobileDialog.value = false;
        isShowBindResult.value = true;
        localStorage.clear();
      } else {
       return ElMessage({
                showClose: true,
                message: res.message,
                type: 'error',
                // offset: 230
              })
        // return ElMessage.error(res.message);
      }
    });
  });
};

const handleReviseName = () => {
  console.log(nameDialogForm)
  nameDialogFormRef.value.validate((valid) => {
    console.log(valid)
    if (!valid) {
      return false;
    }

    api.changeUserName(nameDialogForm.value).then((res) => {
      
      // if (res.code === "O-0000232" || res.code === "O-0000233") {
      //   isShowBindError.value = true;
      // } else
       if (res.code === "000000") {
        handleShowMobileBox(false);
        isShowMobileDialog.value = false;
        location.reload()
        // isShowBindResult.value = true;
        // localStorage.clear();
      } else {
        return ElMessage({
                showClose: true,
                message: res.message,
                type: 'error',
                // offset: 230
              })
      }
    });
  });
}
const isReviseName = ref(false)

const handleShowMobileBox = (type, str) => {
  if (type) {
    console.log(str)
    isShowMobileDialog.value = true;
    if(str === 'name') {
      isReviseName.value = true 
    } else {
      isReviseName.value = false 
    }
    return;
  }

 
  isShowMobileDialog.value = false;
  Object.assign(mobileDialogForm.value, {
    oldMobile: "",
    newMobile: "",
    verificationCode: "",
  });
  Object.assign(nameDialogForm.value, {
    userName: ''
  });
  
};

const isShowBindResult = ref(false);

const handleCloseBindResult = () => {
  isShowBindResult.value = false;
  userLoginOut();
};

const isShowBindError = ref(false);

const handleCloseBindError = () => {
  isShowBindError.value = false;
};

const closeDialog =() => {
  if(codeTime.value > 0) {
    isShowMobileDialog.value = false
  } else {
    handleShowMobileBox(false)
  } 
}
/********************************************** 更换手机号逻辑 **********************************************/

/********************************************** 绑定/解绑微信逻辑 **********************************************/
const isShowBindWechat = ref(false);
const isShowUnbindWechat = ref(false);
let wechatQrcode = ref("");
let authorizeCodeUuid = ref("");
let authorizeCodeTimer = null;

const bindWechat = () => {
  console.log("bindWechat");
  codeType.value = 1
  QRcodeExpired.value = false
  handleGetAuthorizeCode(1,1);
  isShowBindWechat.value = true;
};

const closeBindWechat = () => {
  QRcodeExpired.value = false
  clearInterval(authorizeCodeTimer);
  authorizeCodeTimer = null;
  isShowBindWechat.value = false;
};
const unBindType = ref(1)
const unBindWechat = (type) => {
  console.log("unBindWechat");
  unBindType.value = type
  isShowUnbindWechat.value = true;
};

const handleSureUnbindWechat = () => {
  // console.log("handleSureUnbindWechat", ddInfo.thirdLoginId);
  let reqData = {};
  if(unBindType.value ==1) {
    reqData = {
      thirdLoginId: wechatInfo.thirdLoginId,
    }
  } 
  if(unBindType.value ==2) {
    reqData = {
      thirdLoginId: ddInfo.thirdLoginId,
    }
  }
  api.unBindThirdLogin(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error();
    }

    isShowUnbindWechat.value = false;

    ElMessage.success("解绑成功");
    const loginType = localStorage.getItem('yun_login_type')
    if (loginType && loginType > 0) return userLoginOut()
    getUserDetail();
  });
};

const handleCloseUnbindWechat = () => {
  isShowUnbindWechat.value = false;
};

const codeType = ref(1)

// 获取授权二维码
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

    wechatQrcode.value = res.data.qrURL;
    authorizeCodeUuid.value = res.data.uuid;

    authorizeCodeTimer = setInterval(() => {
      const reqData = {
        type: 1,
        uuid: authorizeCodeUuid.value,
        thirdType: thirdType
      };

      api
        .checkUuidStatus(reqData)
        .then(async (res) => {
          // console.log("authorizeCodeTimer", res);
          if (res.code !== "000000") {
            console.log("1", res.data);
            clearInterval(authorizeCodeTimer);
            authorizeCodeTimer = null;
            return ElMessage.error(res.message);
          }

          if (res.data.qrStatus === 1) {
            console.log("2", res.data);
            // 登录成功,清除定时器
            clearInterval(authorizeCodeTimer);

            authorizeCodeTimer = null;
            isShowBindWechat.value = false;
            getUserDetail();
            return ElMessage.success("绑定成功");
          }

          if (res.data.qrStatus === 2) {
            QRcodeExpired.value = true
            console.log("3", res.data);
            // 二维码失效
            clearInterval(authorizeCodeTimer);
            authorizeCodeTimer = null;

            // isShowBindWechat.value = false;
            // return ElMessage.warning(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
          clearInterval(authorizeCodeTimer);
          authorizeCodeTimer = null;
        });
    }, 1000);
  });
};

/********************************************** 绑定/解绑微信逻辑 **********************************************/

/********************************************** 绑定/解绑钉钉逻辑 **********************************************/
const bindDingDing = () => {
  // return ElMessage.info("暂不开放");
  console.log("bindDD");
  codeType.value = 2
  QRcodeExpired.value = false
  handleGetAuthorizeCode(2,1);
  isShowBindWechat.value = true;
};
/********************************************** 绑定/解绑钉钉逻辑 **********************************************/

/********************************************** 上传图片逻辑 **********************************************/
const uploadRef = ref(null);
const cutPicBoxRef = ref(null);
const fileList = ref([]);
const cutting = ref(false);
const cutBoxData = ref({
  originLeft: 0,
  originTop: 0,
  width: 300,
  height: 300,
  left: 0,
  top: 0,
});

const imgSize = ref({
  width: "auto",
  height: "100%",
});

const imgChange = () => {
  let imgData = new Image();
  imgData.src = fileList.value[0].url;
  imgData.onload = () => {
    if (imgData.width > imgData.height) {
      imgSize.value.width = "100%";
      imgSize.value.height = `${(imgData.height / imgData.width) * 369}px`;
    } else {
      imgSize.value.width = "auto";
      imgSize.value.height = "100%";
    }
    if(imgData.width < 492) {
      imgSize.value.width = imgData.width + 'px';
    } 
    if(imgData.height < 369) {
      imgSize.value.height =   imgData.height + 'px'
    }
  };
};

const isUploading = computed(() => {
  if (fileList.value.length) {
    imgChange();
    return true;
  }

  return false;
});

const uploadAvatar = () => {
  uploadRef.value.submit();
};

const sureUploadAvatar = async (fileData) => {
  const canvas = await html2canvas(cutPicBoxRef.value);

  if (cutBoxData.value.width === 0 && cutBoxData.value.height === 0) {
    return ElMessage.warning("请先截取头像图片");
  }

  canvas.toBlob((blob) => {
    if (!blob) {
      return ElMessage.error("截图失败");
    }

    const newFile = new File([blob], fileData.name, {
      type: fileData.raw.type,
    });

    const reqData = {
      file: newFile,
    };

    api.uploadPortrait(reqData).then((res) => {
      if (res.code !== "000000") {
        return ElMessage.error(res.message);
      }
      handleCloseUploadDialog();
      getUserDetail();
    });
  });
};

const handleCloseUploadDialog = () => {
  Object.assign(cutBoxData.value, {
    originLeft: 0,
    originTop: 0,
    width: 300,
    height: 300,
    left: 0,
    top: 0,
  });
  uploadRef.value.clearFiles();
};

const handleMouseDown = (e) => {
  cutting.value = true;
  cutBoxData.value.originLeft = e.offsetX;
  cutBoxData.value.originTop = e.offsetY ;
  cutBoxData.value.left = e.offsetX -150;
  cutBoxData.value.top = e.offsetY -150;
  cutBoxData.value.width = 300;
  cutBoxData.value.height = 300;
  if(cutBoxData.value.top <0) {
    cutBoxData.value.top = 0
  }
  if(cutBoxData.value.left <0) {
    cutBoxData.value.left = 0
  }
  if(cutBoxData.value.top >69) {
    cutBoxData.value.top = 69
  }
  if(cutBoxData.value.left >192) {
    cutBoxData.value.left = 192
  }
};

const handleMouseMove = (e) => {
  if (!cutting.value) {
    return;
  }
  let width = 0;
  let height = 0;
  // width = Math.abs(e.offsetX - cutBoxData.value.originLeft);
  // height = Math.abs(e.offsetY - cutBoxData.value.originTop);

  // if (e.offsetX < cutBoxData.value.originLeft) {
  //   cutBoxData.value.left = e.offsetX;
  // }

  // if (e.offsetY < cutBoxData.value.originTop) {
  //   cutBoxData.value.top = e.offsetY;
  // }

  // cutBoxData.value.width = width;
  // cutBoxData.value.height = height;
  cutBoxData.value.left = e.offsetX -150;
  cutBoxData.value.top = e.offsetY -150;
  if(cutBoxData.value.top <0) {
    cutBoxData.value.top = 0
  }
  if(cutBoxData.value.left <0) {
    cutBoxData.value.left = 0
  }
  if(cutBoxData.value.top >69) {
    cutBoxData.value.top = 69
  }
  if(cutBoxData.value.left >192) {
    cutBoxData.value.left = 192
  }
};

const handleMouseUp = () => {
  cutting.value = false;
};

const handleMouseLeave = () => {
  cutting.value = false;
};

/********************************************** 上传图片逻辑 **********************************************/
</script>

<style lang="scss" scoped>
.user_center_page {
  height: 100%;
  box-sizing: border-box;
  padding: 16px 24px 16px;
  overflow: auto;

  .blank_title_box {
    height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #f2f2f2;
    font-size: 16px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 600;
    color: #333333;
    display: flex;
    align-items: center;
  }

  .basic_info_box {
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;

    .basic_info_content {
      height: 206px;
      margin-bottom: 16px;
      box-sizing: border-box;
      padding: 16px 20px 20px;
      display: flex;

      .basic_info_content_left {
        width: 130px;
        margin-right: 14px;

        .pic_box {
          width: 130px;
          height: 130px;
          margin-bottom: 8px;
          margin-right: 14px;
          background-color: #ebebeb;
          border-radius: 50%;
          overflow: hidden;

          .avatar {
            width: 100%;
            height: 100%;
          }
        }

        .change_pic_btn {
          width: 124px;
          height: 32px;
          box-sizing: border-box;
          font-size: 14px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          position: relative;

          .change_pic_btn_modal {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }

          &:hover {
            color: var(--default-main-color);
            border: 1px solid var(--default-main-color);
          }
        }

      }

      .basic_info_content_right {
        padding-top: 25px;

        .basic_info_item {
          min-width: 300px;
          min-height: 32px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          // user-select: none;

          .basic_info_label {
            min-width: 64px;
            margin-right: 12px;
            font-size: 14px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            text-align: right;
            color: #666666;
          }

          .basic_info_val {
            width: 120px;
            font-size: 14px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }

          .change_phone_btn {
            margin-left: 16px;
            font-size: 14px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: var(--default-main-color);
            cursor: pointer;

            &:hover {
              opacity: 0.7;
            }
          }
        }
      }
    }
  }

  .acount_info_box {
    margin-bottom: 16px;
    padding-bottom: 20px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;

    .acount_info_decs_box {
      padding: 16px 20px;

      .acount_info_decs_title {
        margin-bottom: 8px;
        font-size: 14px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #333333;
      }

      .acount_info_decs {
        font-size: 14px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #999999;
      }
    }

    .third_acount_item {
      height: 48px;
      margin-bottom: 20px;
      padding: 0 20px;
      display: flex;
      align-items: center;

      &:last-child {
        margin-bottom: 0;
      }

      .third_acount_icon_box {
        width: 48px;
        height: 48px;
        margin-right: 10px;
        background-color: #ddd;

        >img {
          width: 48px;
          height: 48px;
        }
      }

      .third_acount_btn {
        height: 34px;
        margin-right: 10px;
        padding: 0 16px;
        font-size: 14px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        background: #ebf5f3;
        border-radius: 4px;
        color: var(--default-main-color);
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          opacity: 0.7;
        }
      }

      .third_acount_id {
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
    }
  }

  .role_info_box {
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;

    .role_info_content {
      padding: 16px 20px 20px;
      display: flex;

      .role_info_title {
        width: 106px;
        height: 32px;
        padding: 0 12px;
        box-sizing: border-box;
        line-height: 32px;
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        text-align: right;
        color: #666666;
        flex-shrink: 0;
      }

      .role_info_val {
        font-size: 14px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #333333;
        line-height: 32px;
      }
    }
  }
}

.mobile_dialog_content {
  .mobile_dialog_body {
    // height: 138px;
    box-sizing: border-box;
    padding: 16px 0 0 0;

    .mobile_dialog_item {
      width: 354px;
      display: flex;
      align-items: center;

      .mobile_dialog_code_box {
        width: 216px;
        margin-right: 14px;
      }

      .send_code_btn {
        width: 124px;
        height: 32px;
        box-sizing: border-box;
        padding: 0 12px 0;
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }

  .mobile_dialog_footer {
    height: 64px;
    padding-top: 8px;
    box-sizing: border-box;
    // border-top: 1px solid;
    box-shadow: inset 0px 1px 0px 0px rgba(242, 242, 242, 0.7);
    display: flex;
    justify-content: center;

    .mobile_dialog_btn {
      padding: 8px 32px;
    }
  }
}

.message_dialog_content {
  .message_dialog_body {
    min-height: 144px;
    padding: 16px 24px;
    box-sizing: border-box;
    font-size: 16px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .message_dialog_footer {
    height: 96px;
    box-sizing: border-box;
    // box-shadow: inset 0px 1px 0px 0px rgba(242, 242, 242, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;

    .message_dialog_btn {
      padding: 8px 32px;
      border-color: var(--default-main-color);
      background-color: var(--default-main-color);
    }

    .unbind_whchat_btn {
      margin-right: 80px;
      padding: 8px 32px;
      border-color: var(--default-main-color);
      background-color: var(--default-main-color);
    }

    .cancel_unbind_whchat_btn {
      padding: 8px 32px;
      color: var(--default-main-color);
      border-color: var(--default-main-color);

      &:hover {
        opacity: 0.7;
      }
    }
  }
}

.upload_dialog_content {
  .upload_dialog_body {
    padding: 16px 24px;

    .avatar_box {
      width: 492px;
      height: 369px;
      background-color: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .cut_box_modal {
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
      }

      .avatar_box_modal {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;

        .avatar_box_modal_box {
          width: 100%;
          height: 100%;
          overflow: hidden;
          cursor: auto;
          position: relative;

          .cut_box {
            width: 0px;
            height: 0px;
            box-shadow: 0px 0px 0px 99999px rgba(0, 0, 0, 0.7);
            position: absolute;
            top: 50px;
            left: 60px;

            .cut_box_content {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 1px dashed #a59393;
              position: relative;

              .cut_box_position_box {
                width: 8px;
                height: 8px;
                box-sizing: border-box;
                background-color: rgba(0, 0, 0, 0.4);
                border: 1px solid #a2a2a5;
                position: absolute;

                &.left_top {
                  top: 0px;
                  left: 0px;
                  transform: translate(-50%, -50%);
                }

                &.left_bottom {
                  bottom: 0px;
                  left: 0px;
                  transform: translate(-50%, 50%);
                }

                &.right_top {
                  top: 0px;
                  right: 0px;
                  transform: translate(50%, -50%);
                }

                &.right_bottom {
                  bottom: 0px;
                  right: 0px;
                  transform: translate(50%, 50%);
                }

                &.top_middle {
                  top: 0px;
                  left: 50%;
                  transform: translate(-50%, -50%);
                }

                &.left_middle {
                  top: 50%;
                  left: 0px;
                  transform: translate(-50%, -50%);
                }

                &.right_middle {
                  top: 50%;
                  right: 0px;
                  transform: translate(50%, -50%);
                }

                &.bottom_middle {
                  bottom: 0px;
                  left: 50%;
                  transform: translate(-50%, 50%);
                }
              }
            }
          }
        }
      }
    }
  }

  .upload_dialog_footer {
    height: 64px;
    padding-top: 8px;
    box-sizing: border-box;
    // border-top: 1px solid;
    box-shadow: inset 0px 1px 0px 0px rgba(242, 242, 242, 0.7);
    display: flex;
    justify-content: center;

    .upload_btn {
      margin-right: 80px;
      padding: 8px 32px;
      // color: var(--default-main-color);
      border-color: var(--default-main-color);
      background-color: var(--default-main-color);
    }

    .cancel_upload_btn {
      padding: 8px 32px;
      color: var(--default-main-color);
      border-color: var(--default-main-color);

      &:hover {
        opacity: 0.7;
      }
    }
  }
}

.bindWechat_dialog_content {
  padding: 16px 40px 40px;

  .wechat_qrcode_img {
    width: 280px;
    height: 280px;
    margin-bottom: 16px;
    background-color: #f0f0f0;
    position: relative;

    >img {
      width: 100%;
      height: 100%;
    }

    .refreshCodeBox {
      position: absolute;
      width: 300px;
      height: 300px;
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

  .wechat_qrcode_tips {
    font-size: 16px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    text-align: center;
    color: #333333;
  }
}

:deep(.el-upload-list) {
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;

  >li {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
  }
}

:deep(.el-dialog__header) {
  padding: 0;
  margin: 0;
  user-select: none;

  .dialog_header {
    height: 40px;
    box-sizing: border-box;
    padding: 0 24px;
    background-color: var(--default-main-color);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .dialog_header_title {
      font-size: 16px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
    }

    .dialog_close_btn {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: #fff;

      &:hover {
        opacity: 0.7;
      }
    }
  }
}

:deep(.el-dialog__body) {
  padding: 0;
}

.cut_pic_box {
  width: 200px;
  height: 200px;
  background-color: #fff;
  overflow: hidden;
  position: fixed;
  left: -999999px;
  bottom: -999999px;
  z-index: 2000;

  .avatar_box {
    width: 492px;
    height: 369px;
    background-color: #f2f2f2;
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;

    >img {
      height: 100%;
    }
  }
}
</style>

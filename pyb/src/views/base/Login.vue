<!-- fengjianbo -->
<template>
  <!--main start-->
  <div class="w_login_0606">
    <div class="login_box">
      <div class="loginWap">
        <div class="loginCut flex">
          <span @click="changeLoginType('password')" :class="loginType === 'password' ? 'hover' : ''">密码登录</span>
          <span @click="changeLoginType('sms')" :class="loginType === 'sms' ? 'hover' : ''">短信登录</span>
        </div>
        <div class="loginTab">
          <!--密码登录-->
          <div class="loginTabox" v-if="loginType === 'password'" @keyup.enter="handleSubmit">
            <ul class="loginLs">
              <li>
                <el-input v-model="formData.username" placeholder="请输入手机号">
                  <template class="loginLb" slot="prepend"><i class="el-icon-user"></i></template>
                </el-input>
              </li>
              <li>
                <el-input type="password" v-model="formData.password" placeholder="请输入密码">
                  <template class="loginLb" slot="prepend"><i class="el-icon-lock"></i></template>
                </el-input>
              </li>
            </ul>
            <div class="loginItem flex" title="为了您的信息安全，请不要在公共电脑上使用此功能">
              <label class="flex">
                <el-checkbox v-model="formData.remember" true-label="1" false-label="0">下次自动登录</el-checkbox>
              </label>
            </div>
            <input @click="handleSubmit" type="submit" id="submit" value="密码登录" class="w_submit0606 loginBnt" />
            <div class="logCode flex">
              <router-link to="/getpassword">忘记登录密码？</router-link>
              <router-link to="/register">免费注册</router-link>
            </div>
          </div>
          <!--短信登录-->
          <div class="loginTabox" v-if="loginType === 'sms'">
            <ul class="loginLs">
              <li>
                <el-input v-model="formData.mobile" placeholder="请输入手机号">
                  <template slot="prepend"><i class="el-icon-phone-outline"></i></template>
                </el-input>
              </li>
              <li>
                <el-input v-model="formData.smsVerifyCode" placeholder="请输入短信验证码">
                  <template slot="prepend"><i class="el-icon-chat-dot-square"></i></template>
                </el-input>
                <el-button style="margin-left:10px;" :disabled="formData.mobile != '' && !formData.disabled ? false : true" @click="sendSmsMsg">{{ formData.sendCodeText }}</el-button>
              </li>
            </ul>
            <div class="loginItem flex" title="为了您的信息安全，请不要在公共电脑上使用此功能">
              <label class="flex">
                <el-checkbox v-model="formData.remember" true-label="1" false-label="0">下次自动登录</el-checkbox>
              </label>
              <router-link to="/register">免费注册</router-link>
            </div>
            <input type="submit" @click="handleSubmit" id="mobile_submit" value="短信登录" class="w_submit0606 loginBnt" />
            <div class="loginItem"></div>
          </div>
        </div>
        <div class="loginSt">
          <span class="loginStx">成交动态:</span>
          <div id="viewlist" class="scroll_vertical">
            <div class="box">
              <el-carousel direction="vertical" :autoplay="true" :loop="true">
                <el-carousel-item v-for="(item, index) in orderList" :key="index">
                  <li style="font-size: 12px">{{ item.consigneeName }} &nbsp;&nbsp; {{ item.mobile }} &nbsp;&nbsp; {{ item.name }} &nbsp;&nbsp; ￥{{ item.amount }}</li>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>
      </div>
      <!-- </form> -->
    </div>
  </div>
  <!--main end-->
</template>

<script>
import { sendLoginSmsVerifyCode } from '@/api/sms/verifyCodeApi';
import { mapActions } from 'vuex';
import { getOrderList } from '@/api/order/orderApi';
import { debounce } from '@/utils/utils';
export default {
  components: {},
  data() {
    return {
      formData: {
        username: '',
        password: '',
        remember: 0,
        mobile: '',
        smsVerifyCode: '',
        smsVerifyUuid: '',
        sendTime: 0,
        sendCodeText: '获取验证码',
        disabled: false
      },
      loginType: 'password',
      orderList: []
    };
  },
  methods: {
    ...mapActions(['Login', 'SmsLogin', 'Logout']),
    changeLoginType(type) {
      this.loginType = type;
    },
    sendSmsMsg() {
      const _this = this;
      sendLoginSmsVerifyCode({ mobile: this.formData.mobile }).then(res => {
        if (res.code === '000000') {
          this.formData.smsVerifyUuid = res.data;
          _this.formData.sendTime = 60;
          _this.formData.sendCodeText = _this.formData.sendTime + 's后重新获取';
          this.formData.disabled = true;
          _this.countdown();
        }
      });
    },
    countdown() {
      const _this = this;
      setTimeout(function() {
        _this.formData.sendTime = _this.formData.sendTime - 1;
        if (_this.formData.sendTime <= 0) {
          _this.formData.disabled = false;
          _this.formData.sendCodeText = '获取验证码';
        } else {
          _this.formData.sendCodeText = _this.formData.sendTime + 's后重新获取';
          _this.countdown();
        }
      }, 1000);
    },
    handleSubmit: debounce(function() {
      const { Login, SmsLogin } = this;
      // console.log("this",this);
      var _this = this;
      if (this.loginType === 'password') {
        const reqParam = {
          username: this.formData.username,
          password: this.formData.password,
          remember: this.formData.remember
        };
        Login(reqParam).then(res => {
          if (res.success) {
            _this.$message({ message: '登录成功', type: 'success' });
            _this.$router.push({ path: '/price/cartIndex?cateId=1&subCateId=15' });
          }
        });
      } else {
        const reqParam = {
          mobile: this.formData.mobile,
          smsVerifyCode: this.formData.smsVerifyCode,
          smsVerifyUuid: this.formData.smsVerifyUuid,
          remember: this.formData.remember
        };
        SmsLogin(reqParam).then(res => {
          if (res.success) {
            _this.$message({ message: '登录成功', type: 'success' });
            _this.$router.push({ path: '/price/cartIndex?cateId=1&subCateId=15' });
          }
        });
      }
    }, 300)
  },
  created() {
    getOrderList()
      .then(res => {
        this.orderList = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style scoped src="../../static/index/css/main.css" />
<style scoped src="../../static/login.css" />
<style scoped>
.verifyCodeImg {
  width: 116px;
  height: 40px;
  margin-top: -11px;
  cursor: pointer;
}
.w_login_0607 .login_box .w_zhuce_0607 .zhuce_list0607 {
  border: 0px;
}
.w_login_0606 {
  height: 650px;
}
/* 跑马灯开始 */
.scroll_vertical {
  width: 330px;
  float: left;
  padding-top: 5px;
  overflow: hidden;
}
.scroll_vertical .box {
  overflow: hidden;
  position: relative;
  height: 20px;
}
.scroll_vertical .list {
  position: absolute;
  top: 0;
  left: 0;
}
.scroll_vertical .list li {
  height: 20px;
  list-style: none;
  font-size: 12px;
}
/* 跑马灯结束 */
</style>

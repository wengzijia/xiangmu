<!-- fengjianbo -->
<template>
  <div class="w_login_0607">
    <div class="login_box register_box">
      <div class="login_content fr w_zhuce_0607">
        <h3 style="font-size:18px;font-weight:lighter;color:#808080;">
          会员注册
        </h3>
        <div class="zhuce_list0607" style="margin-top:22px;">
          <el-input v-model="formData.mobile" placeholder="请输入手机号">
            <template slot="prepend">手机号码</template>
          </el-input>
        </div>

        <div class="zhuce_list0607">
          <el-input v-model="formData.imgVerifyCode" placeholder="请输入注册验证码">
            <template slot="prepend">注册验证码</template>
            <template slot="append" class="imgVerify">
              <img v-bind:src="base64ImgData" class="verifyCodeImg" align="middle" @click="getVerifyImg" />
            </template>
          </el-input>
          <div class="clear"></div>
        </div>
        <div class="zhuce_list0607 zidingyi_yuanhu">
          <el-input v-model="formData.smsVerifyCode" placeholder="请输入手机验证码">
            <template slot="prepend">手机验证码</template>
            <template slot="append" class="imgVerify">
              <el-button
                type="primary"
                style="padding-left: 5px;padding-right: 5px;width: 110px;position: relative;left: 20px;border:0;"
                :disabled="formData.imgVerifyCode === '' || formData.mobile === '' || formData.disabled"
                @click="sendSmsVerifyCode"
                >{{ formData.sendCodeText }}</el-button
              >
            </template>
          </el-input>

          <div class="clear"></div>
        </div>
        <div class="zhuce_list0607">
          <el-input v-model="formData.pwd" type="password" placeholder="请输入密码" :show-password="true">
            <template slot="prepend">设置密码</template>
          </el-input>
          <div class="clear"></div>
        </div>
        <div class="flex" style="margin:15px 0;justify-content:space-between;align-items:center;">
          <span>
            <input style="vertical-align:sub;" name="is_agree" type="checkbox" checked="" />&nbsp;
            <router-link to="/news/detail?id=100">《拼一版用户注册协议》</router-link>
          </span>
          <router-link to="/login">会员登录</router-link>
        </div>
        <div style="width:100%;overflow: hidden;">
          <input style="text-align: center;" class="w_submit0606" value="会员注册" @click="handleSubmit" />
        </div>
      </div>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
import { getVerifyImageCode, verifyImageCode, sendRegSmsVerifyCode } from '@/api/sms/verifyCodeApi';
import { simpleRegistration } from '@/api/users/userApi';

export default {
  components: {},
  data() {
    return {
      base64ImgData: '',
      formData: {
        pwd: '',
        imgVerifyUuid: '',
        imgVerifyCode: '',
        smsVerifyCode: '',
        smsVerifyUuid: '',
        mobile: '',
        sendTime: 0,
        sendCodeText: '获取短信验证码',
        disabled: false
      }
    };
  },
  created() {
    this.getVerifyImg();
  },
  methods: {
    getVerifyImg() {
      getVerifyImageCode({}).then(res => {
        this.base64ImgData = 'data:image/jpeg;base64,' + res.data.base64ImgData;
        this.formData.imgVerifyUuid = res.data.uuid;
      });
    },
    verifyImageCode(success) {
      const _this = this;
      var reqParams = {
        imgVerifyUuid: _this.formData.imgVerifyUuid,
        imgVerifyCode: _this.formData.imgVerifyCode
      };
      verifyImageCode(reqParams).then(res => {
        if (res.code != '000000') {
          _this.$message({ message: res.message, type: 'error' });
        } else {
          if (success != null) {
            success();
          }
        }
      });
    },
    sendSmsVerifyCode() {
      var _this = this;
      _this.verifyImageCode(function() {
        var reqParams = {
          mobile: _this.formData.mobile,
          imgVerifyUuid: _this.formData.imgVerifyUuid,
          imgVerifyCode: _this.formData.imgVerifyCode
        };
        sendRegSmsVerifyCode(reqParams).then(res => {
          _this.formData.smsVerifyUuid = res.data;
          _this.$message({ message: '短信发送成功', type: 'success' });
          _this.formData.sendTime = 60;
          _this.formData.sendCodeText = _this.formData.sendTime + 's后重新获取';
          _this.formData.disabled = true;
          _this.countdown();
        });
      });
    },
    countdown() {
      const _this = this;
      setTimeout(function() {
        _this.formData.sendTime = _this.formData.sendTime - 1;
        if (_this.formData.sendTime <= 0) {
          _this.formData.disabled = false;
          _this.formData.sendCodeText = '获取短信验证码';
        } else {
          _this.formData.sendCodeText = _this.formData.sendTime + 's后重新获取';
          _this.countdown();
        }
      }, 1000);
    },
    handleSubmit() {
      const _this = this;
      simpleRegistration(_this.formData)
        .then(res => {
          if (res.code != '000000') {
            _this.$message({
              message: '注册失败,' + res.message,
              type: 'error'
            });
          } else {
            _this.$message({
              message: '注册成功',
              type: 'success'
            });
            _this.$router.push({ path: '/login' });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/index/user/css/main.css" />
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
.w_login_0607{height: 650px;}
</style>

<template>
  <div class="passBox comBox">
    <h1>找回密码</h1>
    <div class="flex passwdMain">
      <div class="passLeft">
        <ul>
          <li>
            <el-input v-model="formData.mobile" @input="inputChange('mobile')" placeholder="请输入注册时手机号码">
              <template slot="prepend"><div style="width:80px">手机号码</div></template>
            </el-input>
          </li>
          <span id="phone"></span>
          <li>
            <el-input v-model="formData.imgVerifyCode" @input="inputChange('imgVerifyCode')" placeholder="请输入注册验证码">
              <template slot="prepend"><div style="width:80px">注册验证码</div></template>
              <template slot="append" class="imgVerify">
                <img v-bind:src="base64ImgData" class="verifyCodeImg" align="middle" @click="getVerifyImg" />
              </template>
            </el-input>
          </li>
          <li>
            <el-input v-model="formData.smsVerifyCode" @input="inputChange('smsVerifyCode')" placeholder="请输入手机验证码">
              <template slot="prepend"><div style="width:80px">手机验证码</div></template>
              <template slot="append" class="imgVerify">
                <el-button class="imgVbtn" :disabled="formData.imgVerifyCode === '' || formData.mobile === '' || formData.disabled" @click="sendSmsVerifyCode">{{ formData.sendCodeText }}</el-button>
              </template>
            </el-input>
          </li>
          <li>
            <el-input v-model="formData.newPwd" type="password" @input="inputChange('newPwd')" placeholder="请输入新密码" :show-password="true">
              <template slot="prepend"><div style="width:80px">新密码</div></template>
            </el-input>
          </li>
          <li>
            <el-input v-model="formData.confirmNewPwd" type="password" @input="inputChange('confirmNewPwd')" placeholder="请输入确认新密码" :show-password="true">
              <template slot="prepend"><div style="width:80px">确认新密码</div></template>
            </el-input>
          </li>
        </ul>
        <el-button type="danger" id="modify" @click="handleSubmit">确认修改密码</el-button>
        <!-- <div class="passwdBnt" id="modify" @click="handleSubmit">确认修改密码</div> -->
      </div>
      <div class="passRt">
        <dl class="flex passLog">
          <dt class="el-icon-user"></dt>
          <dd>已有傲彩账号 <a href="/login" class="red">立即登录</a></dd>
        </dl>
        <dl class="flex passTel">
          <dt class="el-icon-phone-outline"></dt>
          <dd>
            <p>服务热线</p>
            <p>0755-3656-7904</p>
          </dd>
        </dl>
        <div class="prompt">
          <p>1、港澳台及海外客户请直接联系我司工作人员修改密码</p>
          <p>2、修改成功过后，您可以用新密码进行登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVerifyImageCode, verifyImageCode, sendRegSmsVerifyCode } from '@/api/sms/verifyCodeApi';
import { retrievePassword } from '@/api/users/userApi';

export default {
  name: 'Getpassword',
  data() {
    return {
      base64ImgData: '',
      formData: {
        mobile: '',
        newPwd: '',
        confirmNewPwd: '',
        imgVerifyCode: '',
        imgVerifyUuid: '',
        smsVerifyCode: '',
        smsVerifyUuid: '',
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
      retrievePassword(_this.formData)
        .then(res => {
          if (res.code != '000000') {
            _this.$message({
              message: '修改密码失败,' + res.message,
              type: 'error'
            });
          } else {
            _this.$message({
              message: '修改密码成功',
              type: 'success'
            });
            this.$router.push({ path: '/login' });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // input改变去除空格
    inputChange(type) {
      if (type == 'mobile') {
        this.formData.mobile = this.formData.mobile.replace(/\s+/g, '').slice(0, 11);
      } else if (type == 'imgVerifyCode') {
        this.formData.imgVerifyCode = this.formData.imgVerifyCode.replace(/\s+/g, '');
      } else if (type == 'smsVerifyCode') {
        this.formData.smsVerifyCode = this.formData.smsVerifyCode.replace(/\s+/g, '');
      } else if (type == 'newPwd') {
        this.formData.newPwd = this.formData.newPwd.replace(/\s+/g, '');
      } else if (type == 'confirmNewPwd') {
        this.formData.confirmNewPwd = this.formData.confirmNewPwd.replace(/\s+/g, '');
      }
    }
  }
};
</script>
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped>
.verifyCodeImg {
  width: 110px;
  height: 38px;
  cursor: pointer;
}
.passLeft li {
  height: 40px;
  line-height: 40px;
  border: 0px;
}
.w_login_0607 .login_box .w_zhuce_0607 .zhuce_list0607 {
  border: 0px;
}
</style>
<style>
.el-input .el-input-group__append {
  padding: 0px;
  width: 110px;
  background-color: #fff;
}
</style>

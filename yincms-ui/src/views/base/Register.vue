<!-- fengjianbo -->
<template>
  <div class="w_login_0607">
    <div class="login_box register_box">
      <div class="login_content fr w_zhuce_0607">
        <h3 style="font-size: 18px; font-weight: lighter; color: #808080">会员注册</h3>
        <div class="zhuce_list0607" style="margin-top: 22px">
          <el-input v-model="formData.mobile" @input="inputChange('mobile')" placeholder="请输入手机号">
            <template slot="prepend">手机号码</template>
          </el-input>
        </div>

        <div class="zhuce_list0607">
          <el-input v-model="formData.imgVerifyCode" @input="inputChange('imgVerifyCode')" placeholder="请输入注册验证码">
            <template slot="prepend">注册验证码</template>
            <template slot="append" class="imgVerify">
              <img v-bind:src="base64ImgData" class="verifyCodeImg" align="middle" @click="getVerifyImg" />
            </template>
          </el-input>
          <div class="clear"></div>
        </div>
        <div class="zhuce_list0607 zidingyi_yuanhu">
          <el-input v-model="formData.smsVerifyCode" @input="inputChange('smsVerifyCode')" placeholder="请输入手机验证码">
            <template slot="prepend">手机验证码</template>
            <template slot="append" class="imgVerify">
              <el-button
                type="primary"
                style="padding-left: 5px; padding-right: 5px; width: 110px; position: relative; left: 20px; border: 0"
                :disabled="formData.imgVerifyCode === '' || formData.mobile === '' || formData.disabled"
                @click="sendSmsVerifyCode"
                >{{ formData.sendCodeText }}</el-button
              >
            </template>
          </el-input>

          <div class="clear"></div>
        </div>
        <div class="zhuce_list0607">
          <el-input v-model="formData.pwd" type="password" @input="inputChange('pwd')" placeholder="请输入密码" :show-password="true">
            <template slot="prepend">设置密码</template>
          </el-input>
          <div class="clear"></div>
        </div>
        <div class="flex" style="margin: 15px 0; justify-content: space-between; align-items: center">
          <span>
            <input style="vertical-align: sub" name="is_agree" type="checkbox" checked="" />&nbsp;
            <router-link to="/news/detail?id=100">《傲彩用户注册协议》</router-link>
          </span>
          <router-link to="/login">会员登录</router-link>
        </div>
        <div style="width: 100%; overflow: hidden">
          <input style="text-align: center" type="button" class="w_submit0606" value="会员注册" @click="handleSubmit" />
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <!--address Modal Templates-->
    <el-dialog title="注册成功,完善用户资料" :visible.sync="dialogVisible" :before-close="handleClose" width="700px" close-on-press-escape>
      <div style="padding: 0px 20px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="form.contacts"></el-input>
          </el-form-item>
          <el-form-item label="省市区" prop="countyId" style="margin-top: 22px">
            <el-col :span="8">
              <el-select v-model="form.provinceId" placeholder="请选择" style="width: 180px" @change="selectCity($event, 'province')">
                <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="form.cityId" placeholder="请选择" style="width: 170px; margin-left: 10px" @change="selectCity($event, 'city')">
                <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="form.provinceId + '_' + index"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="form.countyId" placeholder="请选择" style="width: 170px; margin-left: 10px" @change="selectCity($event, 'county')">
                <el-option v-for="(item, index) in countyList" :key="index" :label="item" :value="form.cityId + '_' + index"> </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="QQ" prop="qq" style="margin-top: 22px">
            <el-input v-model="form.qq"></el-input>
          </el-form-item>
          <el-form-item label="推荐码" style="margin-top: 22px">
            <el-input v-model="form.referee"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handlerSubmit" style="margin-top: 22px">立即提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--invoice Modal Templates-->
  </div>
</template>

<script>
import { getVerifyImageCode, verifyImageCode, sendRegSmsVerifyCode } from '@/api/sms/verifyCodeApi';
import { simpleRegistration, registerExtend } from '@/api/users/userApi';
import { getProvince, getCity, getAreaId, getAreaName } from '@/utils/city';
import { debounce } from '@/utils/utils';
export default {
  components: {},
  data() {
    return {
      base64ImgData: '',
      dialogVisible: false,
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
      },
      rules: {
        qq: { required: true, message: '请输入QQ', trigger: 'blur' },
        contacts: { required: true, message: '请输入联系人', trigger: 'blur' },
        countyId: { required: true, message: '请选择省市区', trigger: 'change' }
      },
      form: { province: '', city: '', county: '', provinceId: '', cityId: '', countyId: '', contacts: '', qq: '', referee: '', uid: '' },
      provinceList: [],
      cityList: [],
      countyList: []
    };
  },
  created() {
    this.getVerifyImg();
    this.provinceList = getProvince();
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
    handleSubmit: debounce(function() {
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
            this.form.uid = res.data.id;
            this.dialogVisible = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }, 300),
    handleClose(done) {
      done();
      this.$router.push({ path: '/login' });
    },
    selectCity(val, type) {
      if (type === 'province') {
        this.$set(this.form, 'cityId', '');
        this.$set(this.form, 'countyId', '');
        this.$set(this, 'cityList', getCity(this.form.provinceId));
        this.$set(this, 'countyList', []);
      } else if (type === 'city') {
        this.$set(this.form, 'countyId', '');
        this.$set(this, 'countyList', getCity(this.form.cityId));
      }
    },
    handlerSubmit() {
      const formName = 'form';
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.form.provinceId) {
            this.$message({ type: 'error', message: '请选择省份' });
            return false;
          } else if (!this.form.cityId) {
            this.$message({ type: 'error', message: '请选择市' });
            return false;
          } else if (!this.form.countyId) {
            this.$message({ type: 'error', message: '请选择地区' });
            return false;
          }
          this.form.province = getAreaName('province', this.form.provinceId);
          this.form.city = getAreaName('city', this.form.cityId);
          this.form.county = getAreaName('county', this.form.countyId);
          this.form.city = this.form.province + '.' + this.form.city + '.' + this.form.county;
          registerExtend(this.form).then(() => {
            this.$message({ type: 'success', message: '注册成功' });
            this.$router.push({ path: '/login' });
          });
        }
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
      } else if (type == 'pwd') {
        this.formData.pwd = this.formData.pwd.replace(/\s+/g, '');
      }
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
</style>

<template>
  <el-dialog title="用户密码登录" :visible.sync="dialogVisible" width="380px" :before-close="handleClose" append-to-body>
    <el-form>
      <el-form-item>
        <el-input v-model="formData.username" @input="inputChange('username')" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="formData.password" @input="inputChange('password')" placeholder="请输入密码" type="password" @keyup.enter.native="handlerSubmit" />
      </el-form-item>
    </el-form>
    <div>
      <el-checkbox v-model="formData.remember" true-label="1" false-label="0">下次自动登录</el-checkbox>
      <div class="logLa" style="float: right">
        <el-link href="/getpassword">忘记密码？</el-link>
        <el-link href="/register">立即注册</el-link>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" style="width: 100%" @click="handlerSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'LoginForm',
  props: {
    dialogVisible: Boolean
  },
  data() {
    return {
      formData: { username: '', password: '', remember: '0' }
    };
  },
  methods: {
    ...mapActions(['Login']),
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    handlerSubmit() {
      const { Login } = this;
      var _this = this;
      const reqParam = {
        username: this.formData.username,
        password: this.formData.password,
        remember: this.formData.remember
      };
      Login(reqParam).then(res => {
        if (res.success) {
          window.location.reload();
        }
      });
    },
    // input改变去除空格
    inputChange(type) {
      if (type == 'username') {
        this.formData.username = this.formData.username.replace(/\s+/g, '');
      } else if (type == 'password') {
        this.formData.password = this.formData.password.replace(/\s+/g, '');
      }
    }
  }
};
</script>

<style scoped>
.el-form-item__content {
  line-height: 100%;
}
.logLa a:hover {
  color: #e60021;
  text-decoration: underline;
}
.logLa a::after {
  display: none;
}
</style>

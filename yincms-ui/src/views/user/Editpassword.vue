<!-- fengjianbo -->
<template>
  <div>
    <div class="UP_right_List">修改密码</div>
    <div class="Down_right_List">
      <el-form label-width="110px" ref="form" :model="form" style="width:400px;">
        <el-form-item label="旧密码">
          <el-input type="password" v-model="password" @input="inputChange('password')" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="newpassword" @input="inputChange('newpassword')" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="repassword" @input="inputChange('repassword')" placeholder="请再次输入密码" />
        </el-form-item>
      </el-form>
      <div class="sureButton">
        <el-button class="addsubmit" @click="handlerSubmit">立即提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { updatePassword } from '@/api/users/userApi';
export default {
  name: 'Editpassword',
  data() {
    return {
      form: {},
      password: '',
      newpassword: '',
      repassword: ''
    };
  },
  methods: {
    handlerSubmit() {
      const reqParam = { oldPwd: this.password, newPwd: this.newpassword, confirmNewPwd: this.repassword };
      updatePassword(reqParam).then(() => {
        this.$message({ message: '修改密码成功', type: 'success' });
      });
    },
    // input改变去除空格
    inputChange(type) {
      if (type == 'password') {
        this.password = this.password.replace(/\s+/g, '');
      } else if (type == 'newpassword') {
        this.newpassword = this.newpassword.replace(/\s+/g, '');
      } else if (type == 'repassword') {
        this.repassword = this.repassword.replace(/\s+/g, '');
      }
    }
  }
};
</script>
<style scoped src="../../static/index/user/css/all.css" />
<style scoped>
.all-information dd {
  width: 250px;
  float: left;
}
</style>

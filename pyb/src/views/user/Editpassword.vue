<!-- fengjianbo -->
<template>
  <div>
    <div class="UP_right_List">修改密码</div>
    <div class="Down_right_List">
      <el-form label-width="110px" ref="form" :model="form" style="width:400px;">
        <el-form-item label="旧密码">
          <el-input type="password" v-model="password" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="newpassword" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="repassword" placeholder="请再次输入密码" />
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
      // 包含数字和字母 6到20位之间 要求纯字母，纯数字或者混合都可以
      let reg = /^[0-9a-zA-Z]{6,20}$/;
      if (reg.test(this.newpassword) && reg.test(this.repassword)) {
        // console.log('新密码', reg.test(this.newpassword));
        // console.log('新密码', this.newpassword);
        // console.log('确认密码', this.repassword);
        if (this.newpassword == this.repassword) {
          const reqParam = { oldPwd: this.password, newPwd: this.newpassword, confirmNewPwd: this.repassword };
          updatePassword(reqParam).then(() => {
            this.$message({ message: '修改密码成功', type: 'success' });
          });
          this.password = "";
          this.newpassword = "";
          this.repassword = "";
        } else {
          this.$message({ message: ' 新密码和确认密码不一致', type: 'error' });
        }
      } else {
        this.$message({ message: ' 请输入密码6到20位之间', type: 'warning' });
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

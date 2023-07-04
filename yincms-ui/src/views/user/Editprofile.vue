<!-- fengjianbo -->
<template>
  <div>
    <div class="UP_right_List">账户设置</div>
    <div class="Down_right_List">
      <div class="topDistance phoneNub">
        <span class="leftList_font">手机号码：</span>
        <div class="manOr_women">
          <strong>{{ userInfo.username ? userInfo.username : '****' }}</strong>
        </div>
      </div>
      <div class="clear"></div>
      <div class="topDistance Name_Part">
        <span class="leftList_font">
          <em style="color:#C00;">*</em>
          用户名：
        </span>
        <div class="manOr_women">
          <el-input v-model="userInfo.nickname" placeholder="请输入昵称" />
        </div>
        <div class="manOr_women manOr_womenIcon">
          可用于登录，请牢记哦~
        </div>
      </div>
      <div class="clear"></div>
      <div class="topDistance itemSex">
        <span class="leftList_font checkSex">
          <em style="color:#C00;">*</em>
          性别：
        </span>
        <div class="manOr_women">
          <el-radio-group v-model="userInfo.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="3">保密</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="clear"></div>
      <div class="topDistance Birthday_List">
        <span class="leftList_font">生日：</span>
        <el-date-picker v-model="userInfo.birthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"> </el-date-picker>
      </div>
      <div class="clear"></div>
      <div class="clear"></div>
      <div class="sureButton">
        <el-button class="addsubmit" @click="handlerSubmit">立即提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUserInfo, updateAccountInfo } from '@/api/users/userApi';
export default {
  name: 'Editprofile',
  data() {
    return {
      userInfo: {}
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      getCurrentUserInfo().then(res => {
        this.$set(this, 'userInfo', res.data);
      });
    },
    handlerSubmit() {
      updateAccountInfo({
        nickname: this.userInfo.nickname,
        sex: this.userInfo.sex,
        birthday: this.userInfo.birthday
      }).then(res => {
        this.$message({ message: '修改成功', type: 'success' });
      });
    }
  }
};
</script>

<style scoped src="../../static/index/user/css/all.css" />

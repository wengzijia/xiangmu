<template>
  <div>
    <el-dialog title="提现教程" :visible.sync="dialogVisible" width="620px">
      <div class="inner">
        <iframe src="http://alifile.xiaocaiyin.com/qcxyztTest/uploads/packout/stylistFile/20230111/temp/30/IndividualRegistration.pdf#toolbar=0" style="height:500px;width:600px"></iframe>
      </div>
      <span slot="footer" class="footerBtn" v-if="isAccount">
        <el-button type="primary" @click="handleClose">我已注册，去设置收款账号</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'cashPopup',
  data() {
    return {
      dialogVisible: false,
      isAccount: false
    };
  },
  props: ['cashId'],
  created() {
    if (this.cashId) {
      this.isAccount = true;
    }
  },
  methods: {
    showDialog(type) {
      this.dialogVisible = true;
      if (type == 1) {
        this.isAccount = false;
      } else {
        this.isAccount = true;
      }
    },
    handleClose(done) {
      this.dialogVisible = false;
      this.$router.push('/user/certifiedDesigner?isCash=1');
    }
  }
};
</script>

<style scoped>
.inner {
  overflow: hidden;
  width: 580px;
}
.footerBtn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

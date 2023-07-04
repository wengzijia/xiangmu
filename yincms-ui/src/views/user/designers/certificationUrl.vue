<template>
  <div>正在生成合同剩余时间（{{ timer }}s）...</div>
</template>

<script>
import { getCertificationSync } from '@/api/users/designer';
// 引入下载的工具包
import QrCode from 'qrcode';
export default {
  name: 'certificationUrl',
  data() {
    return {
      timer: 3,
      time: null,
      time1: null
      // showCodeDialog: false
    };
  },
  created() {
    this.setTime();
    this.getCertificationSyncFn();
  },
  methods: {
    setTime() {
      let _this = this;
      this.time = setInterval(() => {
        _this.timer -= 1;
        if (_this.timer == 0) {
          _this.timer = 0;
          clearInterval(this.time);
        }
      }, 1000);
    },
    getCertificationSyncFn() {
      const parms = {
        personName: this.$route.query.personName,
        transactionNo: this.$route.query.transactionNo,
        authenticationType: this.$route.query.authenticationType,
        status: this.$route.query.status,
        sign: this.$route.query.sign
      };
      getCertificationSync(parms).then(res => {
        if (res.code == '000000') {
          this.time1 = setTimeout(() => {
            top.location = res.data;
          }, 6000);
          // console.log(3333333, res.data);
        }
      });
    }
  },
  beforeDestroy() {
    clearTimeout(this.time1);
    clearInterval(this.time);
  }
};
</script>

<style>
.code3 .el-dialog--center .el-dialog__body {
  padding: 0px 25px 40px;
}
</style>

<template>
  <div class="code2">
    <!-- 分享展示, 预览的二维码的弹层  -->
    <el-dialog :title="codeType == 1 ? '您还未完成实名认证' : '您还未完成签署协议'" width="450px" center :visible="showCodeDialog" @close="showCodeDialog = false">
      <p v-if="codeType == 2" class="words">实名认证后签署协议</p>
      <p v-if="codeType == 1" class="words">
        因合规性要求，设计师需要先实名认证，请本人进行<br />
        实名认证，系统以已认证身份信息为依据，认定作品<br />创作者及提现权益
      </p>
      <!-- 二维码 -->
      <!--放个容器控制一下居中-->
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
      <div class="btn" @click="$emit('gainRealSignMessageFn')">
        点击刷新
      </div>
      <p v-if="codeType == 2" style="text-align: center; margin: 10px;">
        请使用手机扫码签署协议
      </p>
      <p v-if="codeType == 1" style="text-align: center; margin: 10px;">
        请使用手机扫码进行实名认证
      </p>
    </el-dialog>
  </div>
</template>

<script>
// 引入下载的工具包
import QrCode from 'qrcode';
export default {
  name: 'showCode',
  data() {
    return {
      showCodeDialog: false,
      codeType: 1
    };
  },
  props: ['url'],
  methods: {
    code2Url(url, type) {
      console.log(12121212121212);
      this.codeType = type;
      // 判断url有没有值
      if (!url) return;
      // 这句代码会进行视图更新,但是视图更新操作会被包装到一个task里面(promise微任务 -> 宏任务)
      this.showCodeDialog = true;
      this.$nextTick(() => {
        // 如果这里 url 写的是网址, 就会跳转到对应网址 (二维码分享效果)
        QrCode.toCanvas(this.$refs.myCanvas, url);
        this.getDom();
      });
    },
    getDom() {
      this.$refs.myCanvas.style.height = 300 + 'px';
      this.$refs.myCanvas.style.width = 300 + 'px';
    }
  }
};
</script>

<style scoped>
.code2 .el-dialog--center .el-dialog__body {
  padding: 0px 25px 40px;
}
.words {
  margin-top: 10px;
  font-size: 12px;
  text-align: center;
}
.code2 .btn {
  width: 270px;
  height: 40px;
  color: #f00;
  border: 1px solid #ddd;
  cursor: pointer;
  margin: 10px auto;
  text-align: center;
  line-height: 40px;
  border-radius: 6px;
  user-select: none;
}
</style>

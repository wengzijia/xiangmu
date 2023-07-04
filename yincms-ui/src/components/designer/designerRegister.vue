<template>
  <div class="designTask">
    <div class="tital">
      <h2>加入傲彩，认证设计师兼职做设计任务</h2>
      <span class="share" @click="copy">分享</span>
    </div>
    <div class="bkgImg">
      <el-button class="btns" @click="moveInto">立即入驻</el-button>
    </div>
    <login-form :dialogVisible.sync="showLoginDialog"></login-form>
  </div>
</template>

<script>
import LoginForm from '@/components/common/LoginForm';

export default {
  name: 'designerRegister',
  props: ['showLoginDialog'],
  components: {
    LoginForm
  },
  data() {
    return {
      // showLoginDialog: false,
      //获取当前网站的网址
      windowUrl: window.location.href
    };
  },

  methods: {
    moveInto() {
      const token = localStorage.getItem('Access-Token');
      // console.log('token', token);
      if (!token) {
        this.showLoginDialog = true;
      } else {
        this.$router.push('/user/signing');
      }
    },
    //点击复制的方法兼容ios系统
    copy() {
      var domUrl = document.createElement('input');
      domUrl.value = '加入傲彩，认证设计师兼职做设计任务:' + this.windowUrl;
      domUrl.id = 'creatDom';
      document.body.appendChild(domUrl);
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        window.getSelection().removeAllRanges(); //这段代码必须放在前面否则无效
        var range = document.createRange();
        // 选中需要复制的节点
        range.selectNode(domUrl);
        // 执行选中元素
        window.getSelection().addRange(range);
        // 执行 copy 操作
        document.execCommand('copy');
        // 移除选中的元素
        window.getSelection().removeAllRanges();
      } else {
        domUrl.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
      }
      let creatDom = document.getElementById('creatDom');
      creatDom.parentNode.removeChild(creatDom);
      this.$message({
        message: '已复制链接，可以粘贴分享到群邀请更多设计师入驻傲彩！',
        type: 'success'
      });
    }
  }
};
</script>

<style scoped>
.designTask .bkgImg {
  width: 674px;
  height: 478px;
  /* background: pink; */
  background-image: url('../../static/mulindex/img/recruiting.png');
  background-repeat: no-repeat;
  background-size: cover;
  margin: 60px 0;
  position: relative;
  text-align: center;
  border-radius: 4px;
}
.designTask .btns {
  width: 142px;
  position: absolute;
  bottom: 60px;
  left: 86px;
  /* left: 266px; */
  background: #c81623;

  color: #fff;
  border: none;
}
.designTask .btns:hover {
  background: #e60021;
}
.designTask {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.designTask h2 {
  text-align: center;
}
.designTask .tital {
  position: relative;
}
.designTask .share {
  position: absolute;
  right: -274px;
  top: -30px;
  cursor: pointer;
}
.designTask .share:hover {
  color: #d0111b;
}
</style>

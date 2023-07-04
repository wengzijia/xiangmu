<template>
  <div>
    <el-header class="header-nav" style="height: auto;">
      <!-- <header-user-top></header-user-top> -->
      <div class="logo_div" style="height: 80px;">
        <div class="content">
          <h1>
            <a href="/" class="headTo">
              <img src="@/static/mulindex/img/image 1.png" />
              <div class="ours">
                <img src="@/static/mulindex/img/我的 (2) 1.png" style="margin-left: 10px;margin-right: 10px;" />
                <span class="txt">我的</span>
              </div>
            </a>
          </h1>
          <div class="clear"></div>
        </div>
      </div>
    </el-header>
    <el-main class="login-main">
      <div class="designTask">
        <div class="tital">
          <h2>加入傲彩，认证设计师兼职做设计任务</h2>
          <!-- <span class="share" @click="copy">分享</span> -->
        </div>
        <div class="bkgImg">
          <div class="shareTo" @click="copy">
            <img src="@/static/mulindex/img/分享 (3) 1.png" alt="" />
            <span>分享</span>
          </div>
          <el-button class="btns" @click="moveInto">立即入驻</el-button>
        </div>
        <login-form :dialogVisible.sync="showLoginDialog"></login-form>
      </div>
    </el-main>
  </div>
</template>

<script>
import LoginForm from '@/components/common/LoginForm';
import { getByUserId } from '@/api/users/designer';
import { getCurrentUserInfo } from '@/api/users/userApi';
export default {
  name: 'designerRegister',
  // props:['showLoginDialog'],
  components: {
    LoginForm
  },
  data() {
    return {
      uid: '',
      showLoginDialog: false,
      //获取当前网站的网址
      windowUrl: window.location.href
    };
  },
  created() {
    // this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      getCurrentUserInfo().then(res => {
        // this.$set(this, 'userInfo', res.data);
        if (res.code == '000000') {
          this.uid = res.data.id;
          // console.log('获取用户信息',this.uid);
          this.getByUserIdFn();
        }
      });
    },
    // 获取入驻用户信息
    getByUserIdFn() {
      getByUserId({ id: this.uid })
        .then(res => {
          // console.log('入驻用户信息22222', res);
          if (res.code == '000000') {
            // this.isCertified = res.data == null ? false : true;
            if (res.data.id == null) {
              this.$router.push('/user/signing');
            } else {
              this.$message.success('您已是入驻用户!');
              this.$router.push('/user/myTask');
            }
          }
        })
        .catch(err => {
          this.$router.push('/user/signing');
        });
    },
    moveInto() {
      const token = localStorage.getItem('Access-Token');
      // console.log('token', token);
      if (!token) {
        this.showLoginDialog = true;
      } else {
        // this.$router.push('/user/signing');
        this.getUserInfo();
      }
    },
    //点击复制的方法
    copy() {
      var domUrl = document.createElement('input');
      domUrl.value = '加入傲彩，认证设计师兼职做设计任务:' + this.windowUrl;
      domUrl.id = 'creatDom';
      document.body.appendChild(domUrl);
      domUrl.select(); // 选择对象
      document.execCommand('Copy'); // 执行浏览器复制命令
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
  width: 1040px;
  height: 645px;
  /* background: pink; */
  background-image: url('../../../static/mulindex/img/recruiting.png');
  background-repeat: no-repeat;
  background-size: cover;
  margin: 40px 0;
  position: relative;
  text-align: center;
  border-radius: 4px;
}
.shareTo {
  position: absolute;
  top: 28px;
  right: 26px;
  width: 82px;
  height: 32px;
  padding: 14px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #fff;
  background: #bc2a1d linear-gradient(270deg, #bc2a1d 0%, #e50131 87%);
  border-radius: 20px 20px 20px 20px;
  opacity: 1;
  border: 1px solid #ce2220;
  cursor: pointer;
}
.designTask .btns {
  width: 142px;
  height: 36px;
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
  padding-bottom: 70px;
  background: #f5f5f5;
}
.designTask h2 {
  text-align: center;
  font-size: 24px;
}
.designTask .tital {
  margin-top: 30px;
  position: relative;
}
.designTask .share {
  position: absolute;
  right: -130px;
  top: 30px;
  /* right: -274px;
  top: -30px; */
  cursor: pointer;
}
.designTask .share:hover {
  color: #d0111b;
}
.headTo {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ours {
  width: 82px;
  height: 32px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 20px 20px 20px 20px;
  opacity: 1;
  border: 1px solid #dcdfe6;
}
.txt {
  color: #939393;
  font-size: 14px;
  font-weight: normal;
}
</style>
<style scoped src="@/static/index/css/new/public.css" />
<style scoped src="@/static/index/css/main.css" />

<style scoped src="../../../static/login.css" />

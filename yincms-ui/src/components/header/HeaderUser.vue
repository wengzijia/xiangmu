<!-- fengjianbo -->
<template>
  <div id="topbar" style="position: relative;">
    <div class="flex comBox">
      <div class="topbarLt">
        <a href="/">傲彩首页</a>
        <span class="topbarLtSpn">哞，欢迎来做包装！</span>
        <span v-if="$store.getters.userInfo != null">
          <router-link to="/user/index">{{ $store.getters.userInfo.mobile2 }}</router-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="text" @click="logout">退出</el-link>
        </span>
        <div style="display:inline-block;padding-left:24px">
          <span><a href="https://www.iaocai.com/magichand" target="_blank" class="magichand">下载魔术手</a></span>
          <span style="cursor: pointer;"><a @click="toDesigner" class="magichand">设计师入驻</a></span>
          <!-- <span><a href="/user/designerRegister" target="_blank" class="magichand">设计师入驻</a></span> -->
          <!-- <span><a href="/plug/index" target="_blank" class="magichand xian">下载魔术手</a></span> -->
          <!-- <span><a href="/solution/index" target="_blank" class="magichand">下载模板</a></span> -->
          <!-- <span><a href="/preview/index" target="_blank" class="magichand" style="border:none">智能预检</a></span> -->
        </div>
      </div>
      <!-- <div class="newyearStyle" v-if="newHappy">
        <div class="newyear">
          <img src="@/static/mulindex/img/newYearSkin/lanternLeft.png" alt="" />
        </div>
        <div class="newyear01">
          <img src="@/static/mulindex/img/newYearSkin/lanternRight.png" alt="" />
        </div>
      </div> -->
      <ul class="flex topbarRt">
        <li class="topbarRtxt"><span>客服热线：0755-36567904</span> <span>18820487869</span></li>
        <!-- <li class="topbarRtxt" @click="$report({ channel: 101005, actionId: 1 })"> -->
        <li class="topbarRtxt" @click="qiyu">
          <!-- <a class="afterQq" href="//wpa1.qq.com/cPNJlL1B?_type=wpa&qidian=true" target="_blank"> <i class="icon icon-qq"></i> 售后QQ </a> -->
          <a class="afterQq" target="_blank" style="position: relative;"> <img src="@/static/service/service_icon.png" class="icon" style="position: relative;top: 5%;" alt=""> 售后客服 </a>
        </li>
        <li class="topbarLogin">
          <!--已登录-->
          <div v-if="$store.getters.userInfo != null" class="useLgBox">
            <el-menu mode="horizontal" class="userNav cart-nav" router active-text-color="#fff" text-color="#fff">
              <el-submenu index="1" popper-class="popUserNav">
                <template slot="title"><i class="el-icon-user"></i><router-link to="/user/index">用户中心</router-link></template>
                <el-menu-item index="/user/orderlist">我的订单</el-menu-item>
                <el-menu-item index="/user/userAddressList">收货地址</el-menu-item>
                <el-menu-item index="#" @click="logout">退出</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <!--未来登录-->
          <p v-else class="LgBox">
            <router-link to="/login" class="topbarLogSp">登录</router-link>
            <router-link to="/register">注册</router-link>
          </p>
        </li>
      </ul>
      <!-- 新年灯笼烟花 -->
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import store from '@/store';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { encodingMobile } from '@/utils/strUtil';
import { getByUserId } from '@/api/users/designer';
import YSF from '@neysf/qiyu-web-sdk';

export default {
  name: 'HeaderUser',
  data() {
    return { userInfo: null };
  },
  created() {
    // this.getUserInfo();
    const _this = this;
    
    YSF.init('e95a3b738998ec74addc44a5dde79710', {})
      .then(ysf => {
        _this.ysf = ysf;
      })
      .catch(error => {
        console.log('sdk加载失败---', error);
      });
  },
  methods: {
    ...mapActions(['Logout']),
    qiyu() {
      this.ysf('open');
    },
    logout() {
      const { Logout } = this;
      Logout({}).then(() => {
        this.$router.push({ path: '/' });
        window.location.reload();
      });
    },
    getUserInfo() {
      if (localStorage.getItem(ACCESS_TOKEN) != null) {
        store.dispatch('GetUserInfo').then(() => {
          this.userInfo = store.getters.userInfo;
          if (this.userInfo) {
            this.userInfo.mobile = encodingMobile(this.userInfo.mobile);
          }
        });
      }
    },
    toDesigner() {
      console.log('this.userInfo', this.userInfo);
      const token = localStorage.getItem('Access-Token');
      // console.log('token', token);
      if (token) {
        this.getByUserIdFn();
      } else {
        // this.$message.error('请先登录！');
        let routeUrl = this.$router.resolve({ path: '/user/designerRegister' });
        window.open(routeUrl.href, '_blank');
      }
    },
    getByUserIdFn() {
      getByUserId({ id: this.userInfo.id })
        .then(res => {
          // console.log('入驻用户信息22222', res);
          if (res.code == '000000') {
            // this.isCertified = res.data == null ? false : true;
            if (res.data == null) {
              let routeUrl = this.$router.resolve({ path: '/user/designerRegister' });
              window.open(routeUrl.href, '_blank');
            } else {
              // this.$message.success('您已是入驻用户!');
              let routeUrls = this.$router.resolve({ path: '/user/myTask' });
              window.open(routeUrls.href, '_blank');
            }
          }
        })
        .catch(err => {
          let routeUrl = this.$router.resolve({ path: '/user/designerRegister' });
          window.open(routeUrl.href, '_blank');
        });
    }
  }
};
</script>
<style lang="scss" src="../top-nav.scss"></style>
<style scoped>
/* 新年样式 ---start */
/* .newyearStyle {
  position: absolute;
} */
/* .newyearStyle img {
  width: 280px;
  height: 300px;
}
.newyear {
  display: block;
  position: absolute;
  left: 0px;
  top: 114px;
  z-index: 3;
}
.newyear01 {
  display: block;
  position: absolute;
  top: 114px;
  right: 0px;
  z-index: 3;
} */
/* 新年样式 ---endt */
.magichand {
  display: inline;
  color: #fff;
  font-size: 12px;
  padding: 0 15px;
  position: relative;
}
.magichand:hover {
  color: #fdedb9;
}
.xian::after {
  content: '';
  display: inline-block;
  position: absolute;
  right: 0;
  top: 2px;
  width: 1px;
  height: 13px;
  border-right: rgba(255, 255, 255, 0.5) 1px solid;
}
.magichand-box {
  display: inline-block;
}
</style>

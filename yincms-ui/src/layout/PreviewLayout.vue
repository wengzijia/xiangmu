<template>
  <div class="comBox" style="background-color: #fff;margin-top: 10px;margin-bottom: 10px;height: 800px">
    <div style="padding-top: 40px;">
      <el-container>
        <el-container>
          <el-aside width="200px">
            <el-menu :default-active="$route.path" exact router class="el-menu-vertical-demo">
              <el-menu-item index="/preview/index">
                <span slot="title">在线预检</span>
              </el-menu-item>
              <el-menu-item index="/preview/previewList">
                <span slot="title">预检列表</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/global-constant';
import store from '@/store';

export default {
  name: 'PreviewLeft',
  data() {
    return {};
  },
  methods: {
    //获取用户信息
    getUserInfo() {
      if (localStorage.getItem(ACCESS_TOKEN) != null) {
        store.dispatch('GetUserInfo').then(() => {
          console.log('store.getters.userInfo', store.getters.userInfo);
          if (store.getters.userInfo) {
            this.userInfo = store.getters.userInfo;
          }
        });
      }
    }
  },
  created() {
    this.getUserInfo();
  }
};
</script>

<style scoped>
.el-header,
.el-footer {
  color: #333;
  text-align: center;
}

.el-aside {
  color: #333;
  text-align: center;
  height: 100vh;
}

.el-main {
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.el-menu-item.is-active {
  color: red;
}
</style>

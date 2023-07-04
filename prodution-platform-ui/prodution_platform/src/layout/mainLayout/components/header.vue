<template>
  <div class="layout_header_box">
    <div class="layout_header_left" @click="handleToViewHome">
      <img class="logo" src="@/assets/images/header_logo.png" />
      <div class="platform_title">{{viewTItle ? '生产管理平台-' + viewTItle:'生产管理平台' }}</div>
    </div>
    <div class="layout_header_right" v-if="isShow">
      <el-config-provider :locale="locale">
        <div class="demo-color-block">
          <el-color-picker size="small" @change="changeColor" aria-label="确定" :predefine="predefineColors"
            v-model="themeColors" />
        </div>
      </el-config-provider>

      <div class="notice_box">
        <Bell color="#fff" />
      </div>
      <div class="layout_header_info">
        <el-dropdown>
          <div style="display: flex;">
            <div class="user_pic_box">
              <img v-if="userInfo?.userPortrait || getUserInfoVal.userPortrait" class="user_pic"
                :src="`http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/${userInfo?.userPortrait || getUserInfoVal.userPortrait}`"
                alt="" />
              <img v-if="!userInfo?.userPortrait && !getUserInfoVal.userPortrait" class="user_pic"
                src="@/assets/images/defualt_head_pic.png" alt="" />
            </div>
            <div class="user_name">{{ userInfo?.userName || getUserInfoVal.userName }}</div>
          </div>
          <template #dropdown>
            <div class="user_down_menu_list">
              <div class="user_down_menu_item down_menu_name">
                {{ userInfo?.userName || getUserInfoVal.userName }}
              </div>
              <div class="user_down_menu_item user_down_menu_btn down_menu_userCenter" @click="handleToUserDetail">
                个人中心
              </div>
              <div class="user_down_menu_item user_down_menu_btn down_menu_loginOut" @click="handleLoginOut">
                退出登录
              </div>
            </div>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script name="LayoutHeader" setup>
import { useRoute, useRouter } from "vue-router";
import { getToken, userLoginOut, getUserInfo, getMenuList, setSystemColors,setLoginModule } from '@/utils/commonApi'
import appStore from "@/stores/index.js";
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const { userInfo } = appStore.useUserStore || {}
const { setDefaultActive } = appStore.useMenuStore || {}
const getUserInfoVal = getUserInfo() //ref({})
const router = useRouter();
const route = useRoute();
const locale = ref(zhCn)
const predefineColors = ref(['#338f7a', '#089E7C'])
const isShow = ref(getToken() ? true : false)

const colorName = localStorage.getItem('aocai_system_theme_colors')
const themeColors = ref(colorName && colorName != 'null' ? colorName : '#338f7a') //设置主题颜色

const routerListModule = {
  gly: '管理员视图',
  cg: '采购视图',
  cw: '财务视图',
  boss: 'BOSS视图',
  404: '404'
}
const viewTItle = ref('')
const routerHint =  setLoginModule()
const location_href = window.location.href.split('/')
for (let key in routerListModule) {
  location_href.forEach(val => {
    if (val == key) viewTItle.value = routerListModule[key]
    // if (val == '404'&&!routerHint) isShow.value = false
    if (!routerHint) isShow.value = false
  })
}

//切换颜色
const changeColor = (e) => {
  console.log('切换颜色事件---：', e)
  if (e) {
    setSystemColors(e)
    themeColors.value = e
  }
}

/**
 * 点击回到没有个人中心的菜单路由页面
 */
const handleToViewHome = () => {
  return router.push({ path: `/` })
  if(!isShow.value) {
    if(!routerHint) return 
    return router.push({ path: `/` })
  } 
  let url = ''
  getMenuList().forEach(item => {
    if (item.meta.viewModule != 'userCenter') {
      if (!url) url = item.children[0].path
    }
  })
  console.log('退出个人中心--：', url)
  if (setDefaultActive) setDefaultActive(url)

  router.push(url)


};

/**
 * 跳转到个人中心页面
 */
const handleToUserDetail = () => {
  console.log(route.name)
  // if (route.name === "UserCenter") {
  //    return location.reload();
  // }
  // router.push({ name: "UserCenter" });
  router.push({ path: "/user/userCenterSettings" });

};

const handleLoginOut = () => {
  userLoginOut()
};
</script>

<style lang="scss" scoped>
.layout_header_box {
  height: 48px;
  padding: 0 24px;
  box-sizing: border-box;
  background-color: var(--default-main-color);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .layout_header_left {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;

    .logo {
      width: 34px;
      height: 34px;
      margin-right: 8px;
    }

    .platform_title {
      font-size: 18px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
    }
  }

  .layout_header_right {
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;

    .layout_header_info {
      display: flex;
      align-items: center;

      &:hover {
        opacity: 0.7;
      }
    }


    .notice_box {
      width: 24px;
      height: 24px;
      margin: 0 26px;
      cursor: pointer;
    }

    .user_pic_box {
      width: 30px;
      height: 30px;
      margin-right: 12px;
      background-color: #fafafa;
      border-radius: 50%;
      overflow: hidden;

      .user_pic {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .user_name {
      font-size: 16px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      cursor: pointer;
      height: 30px;
      line-height: 30px;

      &:hover {
        opacity: 0.7;
      }
    }

   :deep( .el-color-picker__color){
      border:0 !important;
    }
  }
}

.user_down_menu_list {
  // background-color: red;
  width: 120px;
  box-sizing: border-box;
  padding: 10px 0;

  .user_down_menu_item {
    height: 32px;
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;

    &.user_down_menu_btn {
      cursor: pointer;

      &:hover {
        opacity: 0.7;
        // background-color: #a1cec4;
        background-color: #f2f6f5;
      }
    }

    &.down_menu_name {
      font-size: 14px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: bold;
      color: #333;
    }
  }
}
</style>

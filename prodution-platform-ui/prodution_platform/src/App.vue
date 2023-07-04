

<template>
  <!-- <Transition name="fade" mode="out-in">
      <RouterView />
    </Transition> -->

  <router-view v-slot="{ Component }">
    <transition>
      <component :is="Component" />
    </transition>
  </router-view>
</template>



<script setup>
import { onMounted } from 'vue'
import { setSystemColors, setLoginModule,getToken,setAuthorityJudgment, permissionsMenuFlag } from "@/utils/commonApi"
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'

const router = useRouter()

//跳转首页
const goHome = (viewModule) => {
  window.noPagePermission = true
  setTimeout(() => {
    window.noPagePermission = false
    window.location.href = viewModule? ("/"+viewModule):'/workbench'
  }, 1500)  
}

/**
 * 检查页面权限
 */
const checkPagePermission = () => {
  const match = window.location.pathname.match(/^\/\w+(\/.*)/);
  let pagePath = (match && match.length > 1) ? match[1] : null;

  let whiteList = ['/workbench',"/"]
  if(!pagePath ||whiteList.indexOf(pagePath)>-1){
    return
  }
  //当前视图
  let viewModule = setLoginModule()
  if(!getToken() && viewModule){
    window.location.href = `/${viewModule}/`
    return
  }

  
  //检查视图权限
  if (!setAuthorityJudgment()) {
    ElMessage({ message: '暂无视图权限，请联系管理员！', type: 'warning' })
    goHome(viewModule)
    return
  }
  //检查路由权限
  if (pagePath && !permissionsMenuFlag(pagePath)) {
    ElMessage({ message: '暂无视图权限，请联系管理员！', type: 'warning' })
    goHome(viewModule)
  }
}

//fix:防止用户手工输入任意url可以访问到自己无权限的界面。
checkPagePermission()


onMounted(() => {
  // document.body.style.setProperty('--el-color-primary', 'var(--vt-c-theme-colors)');
  // setTimeout(() => {
  //   appStore.useSystemStore.setSystemColor("red");
  // }, 6000);
  setSystemColors()
});
</script>
<style >
/* 搜索按钮样式 */
.search_button {
  background: var(--vt-c-theme-colors) !important;
  border-color: var(--vt-c-theme-colors) !important;
}

.search_button:hover {
  opacity: .7;
}

/* 重置或者返回按钮样式 */
.el-button.reset_button,.el-button.reset_button:hover,.el-button.reset_button:focus {
  background-color: #fff !important;
  color: var(--vt-c-theme-colors) !important;
  border: 1px solid var(--vt-c-theme-colors) !important;
}

.reset_button:hover {
  opacity: .75;
}

ul,
li {
  list-style: none;
}

p {
  margin: 0;
}
</style>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.el-table--enable-row-hover) {
  .el-table__body tr:hover>td {
    background-color: #F7F9F8 !important;
  }
}

.el-button.is-plain {
  color: var(--vt-c-theme-colors)!important;
  border-color: var(--vt-c-theme-colors)!important;
}

//按钮鼠标悬停的样式
.el-button:hover,.el-button:focus {
  //color: var(--vt-c-theme-colors)!important;
  border-color: var(--vt-c-theme-colors)!important;
}

.el-button:hover {
  opacity: 0.75;
}

.el-table .cell{
  min-height: 25px;
}

.el-dialog__body{
  padding: 16px 25px!important;
}

.el-message-box__btns .el-button{
  color: var(--vt-c-theme-colors);
  border-color: var(--vt-c-theme-colors);
}

.el-message-box__btns .el-button--primary,
.el-message-box__btns .el-button--primary:active,
.el-message-box__btns .el-button--primary:hover,
.el-message-box__btns .el-button--primary:focus{
  background-color: var(--vt-c-theme-colors);
  border-color:var(--vt-c-theme-colors) ;
  border-width: 0;
  outline:0!important;
  color:#FFF;
}

.el-message-box__btns .el-button--primary:hover
{
 opacity: 0.75;
}

</style>


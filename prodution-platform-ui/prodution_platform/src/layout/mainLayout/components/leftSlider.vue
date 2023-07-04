<template>
  <div ref="layoutLeftSliderBox" class="layout_left_slider_box" :class="!isCollapse ? 'active' : 'active_sub_menu_box'">
    <div class="open_btn" @click="handleCollapse">
      <div class="open_btn_content">
        <div class="open_btn_top"></div>
        <div class="open_btn_bottom"></div>
        <div class="icon_box">
          <ArrowLeft v-show="!isCollapse" color="var(--default-main-color)" />
          <ArrowRight v-show="isCollapse" color="var(--default-main-color)" />
        </div>
      </div>
    </div>
    <el-menu :default-active="defaultActive||appStore.useMenuStore?.defaultActive" class="layout_menu_box" text-color="#333"
      active-text-color="var(--default-main-color)" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
      <el-sub-menu v-for="(item, index) in getFirstLevelMenu()" :key="item.meta.menuMark" :index="String(index)"
        :class="{ menu_active_box: current == index }">
        <template #title>
          <div class="menu_title_box">
            <div class="icon_box">
              <SvgIcon :name="item.icon" color="var(--default-main-color)" v-if="current == index" />
              <SvgIcon :name="item.icon" v-else />
            </div>
            <div v-show="!isCollapse" class="title_label">
              {{ item.meta.title}}
            </div>
          </div>
        </template>
        <el-menu-item v-for="menuData in getChildrenMenu(item.children)" :key="menuData.meta.menuMark"
          :index="menuData.meta.menuMark" class="menu_item_label_box" @click="selectMenuItem(menuData, index)">
          <div class="menu_item_label">{{ menuData.meta.menuTitle }}</div>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script name="LayoutLeftSlider" setup>
import appStore from "@/stores/index.js";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
// import router from "@/router";
import {getMenuList,setAuthorityJudgment} from "@/utils/commonApi"
const { setCurrentMenuName } = appStore.useMenuStore || {}

let current = ref(null) //标记菜单点击的是哪个
const router = useRouter();

const layoutLeftSliderBox = ref(null);


/********************************************** 菜单初始化 **********************************************/
// 获取子菜单
const getChildrenMenu = computed(() => (children) => {
  if (!children) return [];
  let menuArr = children.filter((item) => item?.meta?.isMenu === true);
  return menuArr;
});


/********************************************** 菜单初始化 **********************************************/

/********************************************** 菜单相关方法 **********************************************/

const emit = defineEmits(['dropDownValueChange'])
let isCollapse = ref(false);
const handleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  emit('dropDownValueChange', isCollapse.value)
};
const defaultActive = ref()

/**
 * 菜单展开
 * @param {*} key 一级菜单的下标
 * @param {*} keyPath 一级菜单子集中选中的子级下标
 */
const handleOpen = (key, keyPath) => {
  if (current.value != 0 && !current.value) current.value = key
};
/**
 * 菜单收起
 * @param {*} key 
 * @param {*} keyPath 
 */
const handleClose = (key, keyPath) => {

};

/**
 * 处理一级菜单
 */

const getFirstLevelMenu = computed(() => () => {
 
  const getCurrentMouduleRouter =  getMenuList()
  const urlList = []
  //如果菜单选中的默认值为空，通过渲染的菜单列表以及当前页面路由确定选中的菜单栏
  //console.log(appStore.useMenuStore?.defaultActive )
  defaultActive.value = router.currentRoute.value.path || appStore.useMenuStore?.defaultActive 
  //console.log(' defaultActive.value----:', defaultActive.value)
  if (getCurrentMouduleRouter && getCurrentMouduleRouter.length > 0) {
    //当出现个人中心的时候，其他菜单权限不展示
    defaultActive.value == `/user/userCenterSettings` ?
      getCurrentMouduleRouter.forEach(element => {
        if (element.redirect == `/user/userCenterSettings`) urlList.push(element)
      }) :
      getCurrentMouduleRouter.forEach(element => {
        if (element.redirect != `/user/userCenterSettings`) {
          if (element.meta.isMenu) urlList.push(element) 
        }
      })
  }
  urlList.forEach((item, index) => {
    const {children} = item||{}
    //console.log(children)
    children.forEach(val=>{
      if(val.path==defaultActive.value)current.value = index 
    })
  })
  return urlList
})
/**
 * 获取父级菜单的子类
 */
const selectMenuItem = (item, index) => {
  current.value = index
  router.push({ name: item.name })
  // if (setDefaultActive) setDefaultActive(url)
  // setCurrentMenuName(item.meta.menuTitle);
};
/********************************************** 菜单相关方法 **********************************************/
</script>

<style lang="scss" scoped>
.layout_left_slider_box {
  width: 64px;
  height: 100% !important;
  box-sizing: border-box;
  background-color: #fff;
  position: relative;
  transition: width 0.7s;
  overflow-y: hidden;
  overflow-x: hidden;

  &.active {
    width: 200px;
  }

  .open_btn {
    width: 18px;
    height: 60px;
    box-sizing: border-box;
    padding: 14px 0;
    position: absolute;
    top: 50%;
    right: -18px;

    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    .open_btn_content {
      width: 18px;
      height: 40px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      .open_btn_top {
        border-top: 5px solid transparent;
        border-right: 9px solid transparent;
        border-bottom: 5px solid #fff;
        border-left: 9px solid #fff;
        position: absolute;
        top: -10px;
        left: 0;
      }

      .open_btn_bottom {
        border-top: 5px solid #fff;
        border-right: 9px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 9px solid #fff;
        position: absolute;
        bottom: -10px;
        left: 0;
      }

      .icon_box {
        width: 18px;
        height: 18px;
      }
    }
  }

  .layout_menu_box {
    border-right: none;

    :deep(.el-sub-menu__title) {
      &:hover {
        background-color: #f2f6f5;
      }
    }

    .menu_title_box {
      width: 100%;
      height: 56px;
      display: flex;
      align-items: center;


      .icon_box {
        width: 22px;
        height: 22px;
        margin-right: 8px;
        display: flex;
      }

      .title_label {
        font-size: 16px;
        // font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;


      }
    }


    .menu_item_label_box {
      padding-left: 50px !important;

      &:hover {
        background-color: #f2f6f5;
      }

      .menu_item_label {
        font-size: 14px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        // font-weight: 100;
        color: #666;
      }
    }


    :deep(.menu_item_label_box.is-active) {
      background-color: #f2f6f5;
      border-right: 3px solid;
    }

    .menu_active_box {
      .title_label {
        color: var(--default-main-color) !important;
        // font-weight: 600;
      }


      :deep(.menu_item_label_box.is-active) {
        .menu_item_label {
          // font-weight: 600;
          color: var(--default-main-color) !important;
        }
      }

      .icon_box {
        color: var(--default-main-color) !important;
      }

      :deep(.el-sub-menu__icon-arrow) {
        color: var(--default-main-color) !important;
      }

    }



    :deep(.el-sub-menu.is-active) {
      border-right: 3px solid var(--default-main-color);
      // animation: lit .5s;
      // animation-delay: .5s;
      background-color: #f2f6f5;
    }

    :deep(.el-sub-menu.is-active.is-opened) {
      border-right: 0;
      background-color: #fff;
    }



  }

}
.layout_left_slider_box:hover{
  overflow-y: auto;
}

</style>

<template>
  <div class="layout_box">
    <LayoutHeader />
    <div class="layout_container_box">

      <LayoutLeftSlider  @dropDownValueChange="fruitValueChange"  />
      <div class="layout_main_container" :class="{layout_main_active: isCollapse }">

      <!-- <LayoutLeftSlider @getMenuWidth="getMenuWidth" />
      <LayoutMainContainer :menuWidth="menuWidth" />
      <div ref="layoutMainContainer" class="layout_main_container"> -->

        <RouterView />
      </div>
    </div>
  </div>
</template>

<script name="Layout" setup>
import LayoutHeader from "@/layout/mainLayout/components/header.vue";
import LayoutLeftSlider from "@/layout/mainLayout/components/leftSlider.vue";
// import LayoutLeftSlider from "@/layout/mainLayout/components/menuSilder.vue";

import {ref} from "vue";
//菜单栏展开与收起
let isCollapse = ref(false);
const fruitValueChange = (e) => {
  isCollapse.value = e
}


// import LayoutMainContainer from "@/layout/mainLayout/components/layoutMainContainer.vue";
// import { ref } from "vue";
// const menuWidth = ref(200);

// const getMenuWidth = (data) => {
//   menuWidth.value = data ? 64 : 200;
//   console.log(menuWidth.value);
// };

</script>

<style lang="scss" scoped>
.layout_box {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f7f7f7;
  position: relative;

  .layout_container_box {

    width: 100%;
    min-width: 1200px;
    height: calc(100vh - 48px);
    display: flex;
    overflow: auto;
    .layout_main_left{
      width: 64px;
    }
    .layout_main_container {
      height: 100%;
      width: calc(100% - 200px);
      
    }
    .layout_main_active{
      width: calc(100% - 64px);
    }
  }
}
</style>

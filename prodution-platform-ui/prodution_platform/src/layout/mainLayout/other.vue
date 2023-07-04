<template>
    <div class="layout_box">
      <LayoutHeader />
      <div class="layout_container_box">
        <div class="layout_main_container" >
          <RouterView />
        </div>
      </div>
    </div>
  </template>
  
  <script name="LayoutOther" setup>
  import LayoutHeader from "@/layout/mainLayout/components/header.vue";
  import {ref} from "vue";
  //菜单栏展开与收起
 
  
  
 
  
  </script>
  
  <style lang="scss" scoped>
  .layout_box {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    background-color: #f7f7f7;
    position: relative;
    .layout_container_box {
      width: 100%;
      min-width: 1200px;
      height: calc(100vh - 48px);
    //   display: flex;
    //   overflow: auto;
      
      .layout_main_container {
        height: 100%;
        width: 100%;
      }
      
    }
  }
  </style>
  
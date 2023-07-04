<template>
  <div class="common_breadCrumb_box" :style="{ marginBottom: marginBottom }">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item class="">{{ first }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ currentMenuName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script name="CommonBreadCrumb" setup>
import { ArrowRight } from "@element-plus/icons-vue";
import appStore from "@/stores";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const props = defineProps({
  first: {
    type: String,
    required: true,
  },
  second: {
    type: String,
    required: false,
  },
  marginBottom: {
    type: String,
    default: () => "0px",
  },
  path:{
    type: String,
    default: () => ''
  },
  isClick:{
    type:Boolean,
    default:()=>false

  }
});

// let { currentMenuName } = storeToRefs(appStore.useMenuStore);
const router = useRouter()
// const {meta} = router.currentRoute.value
// console.log( router.currentRoute.value,'111111')
// if(!currentMenuName)currentMenuName = meta.menuTitle
// console.log('获取菜单值',currentMenuName)
const currentMenuName = computed(p=>{return props.second || router.currentRoute.value.meta.menuTitle})
</script>

<style lang="scss" scoped>
.common_breadCrumb_box{
  :deep(.el-breadcrumb__inner){
    color:#666 !important;
    &:hover{
      color:var(--default-main-color) !important;
    }
  }

  :deep(.el-icon.el-breadcrumb__separator){
    color:#666 !important;
  }
}
</style>

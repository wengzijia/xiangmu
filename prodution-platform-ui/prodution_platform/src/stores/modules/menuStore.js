import { ref, computed } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
// import routerMap from "@/utils/maps/routerMap";

export const useMenuStore = defineStore("menuStore", () => {
  /*************************************************** 动态设置模块路由逻辑 ***************************************************/
  const currentModule = ref("");
  const currentRoutes = ref([]);

  const getCurrentMouduleRouter = computed(() => {
    if (!currentModule.value) {
      return [];
    }

    // const currentMenuData = router.options.routes.filter((item) => {
    //   return item.meta.type === currentModule.value;
    // });

    const currentMenuData = router.options.routes.filter((item) => {
      return item.meta.type !== "common";
    });

    return currentMenuData;
  });

  const setCurrentModue = (data) => {
    localStorage.setItem("currentModule", data);
    currentModule.value = data;
  };
  /*************************************************** 动态设置模块路由逻辑 ***************************************************/

  /*************************************************** 当前路由逻辑 ***************************************************/
  // 当前路由名称
  const currentMenuName = ref("");
  const defaultActive = ref("");

  const setCurrentMenuName = (current) => {
    currentMenuName.value = current;
  };

  /**
   * 设置默认选中的路由名称
   * @param {*} current 
   */
  const setDefaultActive = (current) => {
    defaultActive.value = current;
  };

  /**
   * 获取菜单路由
   */
  const getCurrentMenuName = computed(() => {
    return currentMenuName.value;
  });
  /*************************************************** 当前路由逻辑 ***************************************************/

  /*************************************************** 历史视图模块 ***************************************************/
  const lastModuleName = ref("");
  const lastViewName = ref("");

  const setlastModuleName = (data) => {
    localStorage.setItem("lastModuleName", data);
    lastModuleName.value = data;
    router.options.routes.map((item) => {
      if (item.meta?.activeMenu == data) {
        localStorage.setItem("lastViewName", item.meta?.viewName);
        lastViewName.value = item.meta?.viewName;
      }
    });
  };
  /*************************************************** 历史视图模块 ***************************************************/

  return {
    currentMenuName,
    getCurrentMenuName,
    setCurrentMenuName,
    setDefaultActive,
    currentModule,
    setCurrentModue,
    defaultActive,
    currentRoutes,
    getCurrentMouduleRouter,
    lastModuleName,
    setlastModuleName,
  };
});

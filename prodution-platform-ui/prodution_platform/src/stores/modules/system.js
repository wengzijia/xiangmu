import { ref, computed } from "vue";
import { defineStore } from "pinia";

/**
 * 改变系统主题色事件
 */
export const useSystemStore = defineStore("system", () => {
  const oldDefaultMainColor = ref("#338f7a");
  const defaultMainColor = ref("#338f7a");

  const setSystemColor = (color) => {
    oldDefaultMainColor.value = defaultMainColor.value;
    defaultMainColor.value = color;

    document.documentElement.style.setProperty(
      "--default-main-color",
      color,
      "important"
    );
  };

  return {
    oldDefaultMainColor,
    defaultMainColor,
    setSystemColor,
  };
});

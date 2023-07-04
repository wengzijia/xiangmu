import { useCounterStore } from "@/stores/counter";
import { useMenuStore } from "./modules/menuStore";
import { useUserStore } from "./modules/userStore";
import { useSystemStore } from "@/stores/modules/system";

const appStore = {};



// const appStore =  {
//   useCounterStore: useCounterStore(),
//   useMenuStore : useMenuStore(),
//   useUserStore : useUserStore(),
//   useSystemStore : useSystemStore(),
// };

export const registerStore = () => {
  appStore.useCounterStore = useCounterStore();
  appStore.useMenuStore = useMenuStore();
  appStore.useUserStore = useUserStore();
  appStore.useSystemStore = useSystemStore();
};

export default appStore;

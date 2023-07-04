export const common = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      activeMenu: "common",
      viewModlue:'common',//财务视图--计价标准模块
    },
  },
];

export default common;

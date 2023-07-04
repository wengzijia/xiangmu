export const user = [
  {
    path: "/user",
    component: () => import("@/layout/mainLayout/index.vue"),
    icon: 'userCenter',
    redirect: "/user/userCenterSettings",
    meta: {
      isMenu: true,
      title: "个人中心",
      menuMark: "/user",
      activeMenu: "/user",
      viewModule:'userCenter',//个人中心模块
    },
    children: [
      {
        path: "/user/userCenterSettings",
        name: "UserCenter",
        component: () => import("@/views/userCenter/index.vue"),
        meta: {
          isMenu: true,
          menuTitle: "个人中心设置",
          menuMark: "/user/userCenterSettings",
        },
      },
    ],
  },
];

export default user;

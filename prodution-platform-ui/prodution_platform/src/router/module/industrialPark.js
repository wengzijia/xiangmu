export const industrialParkManage = [
  {
    path: "/industrialParkManage",
    component: () => import("@/layout/mainLayout/index.vue"),
    name: "ProductManage",
    icon: 'industrialPark',
    redirect: "/industrialParkManage/industrialParkList",
    meta: {
      isMenu: true,
      title: "产业园管理",
      menuMark: "/industrialParkManage",
      activeMenu: "/industrialParkManage",
      viewName: "生产副总视图",
      viewModule:'industrialParkManage' //产业园管理模块
    },
    children: [
      {
        path: "/industrialParkManage/industrialParkList",
        name: "IndustrialParkList",
        component: () =>
          import("@/views/industrialParkManage/industrialParkList/index.vue"),
        meta: {
          isMenu: true,
          menuTitle: "产业园列表",
          menuMark: "/industrialParkManage/industrialParkList",
        }
      },

    ],
  },
  {
    path: "/industrialParkManage",
    component: () => import("@/layout/mainLayout/other.vue"),
    redirect: "/industrialParkManage/industrialParkAdd",
    meta: {
      isMenu: false,
      title: "产业园管理",
      menuMark: "/industrialParkManage",
      type: "industrialPark",
      viewName: "生产副总视图",
      viewModule:'industrialParkManage' //产业园管理模块
    },
    children: [
      {
        path: "/industrialParkManage/industrialParkAdd",
        name: "industrialParkAdd",
        component: () =>
          import("@/views/industrialParkManage/industrialParkAdd/index.vue"),
        meta: {
          isMenu: false,
          menuTitle: "添加产业园",
          menuMark: "/industrialParkManage/industrialParkAdd",
        }
      },
      {
        path: "/industrialParkManage/industrialParkEdit",
        name: "industrialParkEdit",
        component: () =>
          import("@/views/industrialParkManage/industrialParkEdit/index.vue"),
        meta: {
          isMenu: false,
          menuTitle: "产业园编辑",
          menuMark: "/industrialParkManage/industrialParkEdit",
        }
      }
      
    ],
  },


  // {
  //   path: "/industrialParkManage/industrialParkAdd",
  //   name: "industrialParkAdd",
  //   component: () =>
  //     import("@/views/industrialParkManage/industrialParkAdd/index.vue"),
  //   meta: {
  //     isMenu: false,
  //     menuTitle: "添加产业园",
  //     menuMark: "/industrialParkManage/industrialParkAdd",
  //   }
  // },
  // {
  //   path: "/industrialParkManage/industrialParkEdit",
  //   name: "industrialParkEdit",
  //   component: () =>
  //     import("@/views/industrialParkManage/industrialParkEdit/index.vue"),
  //   meta: {
  //     isMenu: false,
  //     menuTitle: "产业园编辑",
  //     menuMark: "/industrialParkManage/industrialParkEdit",
  //   }
  // }

];

export default industrialParkManage;

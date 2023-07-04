export const admin = [
  {
    path: "/admin",
    component: () => import("@/layout/mainLayout/index.vue"),
    name: "Admin",
    redirect: "/admin/userManage",
    icon:'systemSetting',
    meta: {
      isMenu: true,
      title: "系统权限配置",
      menuMark: "/admin",
      activeMenu: "/admin",
      viewName: "管理员视图",
      viewModule:'systemAdministrator',//系统管理员模块
    },
    children: [
      {
        path: "/admin/userManage",
        name: "UserManage",
        component: () => import("@/views/admin/userManage/index.vue"),
        meta: {
          isMenu: true,
          menuTitle: "用户管理",
          menuMark: "/admin/userManage",
        },
      },
      {
        path: "/admin/roleManage",
        name: "roleManage",
        component: () => import("@/views/admin/roleManage/index.vue"),
        meta: {
          isMenu: true,
          menuTitle: "角色权限管理",
          menuMark: "/admin/roleManage",
        },
      },
      {
        path: "/admin/menuManage",
        name: "menuManage",
        component: () => import("@/views/admin/menuManage/index.vue"),
        meta: {
          isMenu: true,
          menuTitle: "菜单管理",
          menuMark: "/admin/menuManage",
        },
      },
     
      // {
      //   path: "/admin/userDetail",
      //   name: "UserDetail",
      //   component: () => import("@/views/admin/userDetail/index.vue"),
      //   meta: {
      //     isMenu: false,
      //     menuTitle: "用户信息详情页",
      //     menuMark: "/admin/userDetail",
      //   },
      // },
      // {
      //   path: "/admin/addNewUser",
      //   name: "AddNewUser",
      //   component: () => import("@/views/admin/addNewUser/index.vue"),
      //   meta: {
      //     isMenu: false,
      //     menuTitle: "用户信息详情页",
      //     menuMark: "/admin/addNewUser",
      //   },
      // },
    ],
  },
  {
    path: "/admin",
    component: () => import("@/layout/mainLayout/other.vue"),
    redirect: "/admin/userDetail",
    meta: {
      isMenu: false,
      title: "系统权限配置",
      menuMark: "/admin",
      activeMenu: "/admin",
      viewName: "管理员视图",
      viewModule:'systemAdministrator',//系统管理员模块
    },
    children: [
      {
        path: "/admin/userDetail",
        name: "UserDetail",
        component: () => import("@/views/admin/userDetail/index.vue"),
        meta: {
          isMenu: false,
          menuTitle: "用户信息详情页",
          menuMark: "/admin/userDetail",
        },
      }
    ],
  },
  {
    path: "/admin",
    component: () => import("@/layout/mainLayout/other.vue"),
    redirect: "/admin/addNewUser",
    meta: {
      isMenu: false,
      title: "系统权限配置",
      menuMark: "/admin",
      activeMenu: "/admin",
      viewName: "管理员视图",
      viewModule:'systemAdministrator',//系统管理员模块
    },
    children: [
      {
        path: "/admin/addNewUser",
        name: "AddNewUser",
        component: () => import("@/views/admin/addNewUser/index.vue"),
        meta: {
          isMenu: false,
          menuTitle: "用户信息详情页",
          menuMark: "/admin/addNewUser",
        },
      },
    ],
  },
 
  
];

export default admin;

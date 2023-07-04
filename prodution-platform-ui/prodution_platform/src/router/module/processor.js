export const processorModule = [
  {
    path: "/processor",//加工商模块
    component: () => import("@/layout/mainLayout/index.vue"),
    redirect: "/processor/processorList",
    icon: 'processor',
    name:'Processor',
    meta: { 
      isMenu: true, 
      title: "加工商管理", 
      menuMark: "/processor",
      activeMenu:"/processor",
      viewModule:'processor' //加工商管理模块
    },
    children: [
      {
        path: "/processor/processorList",
        name: "ProcessorList",
        component: () => import("@/views/processorModule/processorList.vue"),
        meta: {
          isMenu: true,
          menuTitle: "加工商列表",
          menuMark: "/processor/processorList",
        },
      },
    ],
  },
  {
    path: "/processor",//加工商模块
    component: () => import("@/layout/mainLayout/other.vue"),
    redirect: "/processorModule/addProcessor",
    meta: { 
      isMenu: false, 
      title: "加工商管理", 
      menuMark: "/processor",
      viewModule:'processor' //加工商管理模块
    },
    children: [
      {
        path: "/processorModule/addProcessor",
        name: "AddProcessor",
        component: () => import("@/views/processorModule/addProcessor.vue"),
        meta: {
          isMenu: true,
          menuTitle: "添加加工商",
          menuMark: "/processorModule/addProcessor",
        },
      },

    ],
  },

];

export default processorModule;

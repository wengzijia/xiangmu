
export const workbenchModule = [
    {
        path: "/workbench",
        name: "workbench",
        component: () => import("@/views/workbench/index.vue"),
        meta: {
          activeMenu: "workbenchModule",
          viewModlue:'workbenchModule',
        },
    },
    {
        path: "/viewWork",//加工商模块
        component: () => import("@/layout/mainLayout/other.vue"),
        redirect: "/viewWork",
        meta: {
            isMenu: false,
            title: "工作台",
            activeMenu: "workbenchModule",
            viewModlue:'workbenchModule',
        },
        children: [
            {
                path: "/viewWork",
                name: "viewWork",
                component: () => import("@/views/workbench/viewWork.vue"),
                meta: {
                    isMenu: true,
                    menuTitle: "viewWork",
                    menuMark: "/viewWork",
                },
            },
            {
                path: "/pendingList",
                name: "pendingList",
                component: () => import("@/views/workbench/pendingList.vue"),
                meta: {
                    isMenu: true,
                    menuTitle: "pendingList",
                    menuMark: "/pendingList",
                },
            },

        ],
    },
];

export default workbenchModule;


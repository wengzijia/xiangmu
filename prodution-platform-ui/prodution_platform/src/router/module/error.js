
export const errorModule = [
    {
        path: "/404",//加工商模块
        component: () => import("@/layout/mainLayout/other.vue"),
        redirect: "/404",
        meta: {
            isMenu: false,
            title: "加工商管理",
            menuMark: "/404",
            viewModule: 'errorModule' //加工商管理模块
        },
        children: [
            {
                path: "/404",
                name: "404",
                component: () => import("@/views/errorModule/404.vue"),
                meta: {
                    isMenu: true,
                    menuTitle: "404",
                    menuMark: "/404",
                },
            },

        ],
    },
];

export default errorModule;


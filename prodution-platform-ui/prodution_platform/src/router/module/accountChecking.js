export const accountCheckingModule = [
    {
      path: "/accountChecking",//财务视图--生产加工对账模块
      name:'accountChecking',
      icon: 'monthlyStatement',
      component: () => import("@/layout/mainLayout/index.vue"),
      redirect: "/accountChecking/monthlyStatementList",
      meta: { 
        isMenu: true, 
        title: "生产加工对账", 
        menuMark: "/accountChecking",
        activeMenu:'/accountChecking',
        viewName: "生产加工对账",
        viewModule:'accountChecking',//财务视图--生产加工对账模块
      },
      children: [
        {
          path: "/accountChecking/monthlyStatementList",
          name: "monthlyStatementList",
          component: () => import("@/views/accountChecking/monthlyStatement/monthlyStatementList.vue"),
          meta: {
            isMenu: true,
            menuTitle: "月结账单列表",
            menuMark: "/accountChecking/monthlyStatementList",
          },
        },
        {
          path: "/accountChecking/abnormalProcessFee",
          name: "abnormalProcessFee",
          component: () => import("@/views/accountChecking/abnormalProcessFee/index.vue"),
          meta: {
            isMenu: true,
            menuTitle: "加工费异常列表",
            menuMark: "/accountChecking/abnormalProcessFee",
          },
        },
        {
          path: "/accountChecking/settlementList",
          name: "settlementList",
          component: () => import("@/views/accountChecking/settlement/settlementList.vue"),
          meta: {
            isMenu: true,
            menuTitle: "结款单列表",
            menuMark: "/accountChecking/settlementList",
          },
        },
      ],
    },
    {
      path: "/accountChecking",//财务视图--生产加工对账模块
      icon: 'priceAllocation',
      component: () => import("@/layout/mainLayout/other.vue"),
      redirect: "/accountChecking/editRecordTable",
      meta: { 
        isMenu: false, 
        title: "生产加工对账", 
        menuMark: "/accountChecking",
        activeMenu:'/accountChecking',
        viewName: "生产加工对账",
        viewModule:'accountChecking',//财务视图--生产加工对账模块
      },
      children: [
        {
          path: "/accountChecking/editRecordTable",
          name: "editRecordTable",
          component: () => import("@/views/accountChecking/monthlyStatement/editRecordTable.vue"),
        },
      ],
    },
    {
      path: "/accountChecking",
      component: () => import("@/layout/mainLayout/other.vue"),
      redirect: "/accountChecking/monthlyStatementDetail",
      meta: {
        isMenu: false,
        title: "生产加工对账",
        menuMark: "/accountChecking",
        type: "accountChecking",
        viewName: "生产加工对账",
        viewModule:'accountChecking',//财务视图--计价标准模块
      },
      children: [
        {
          path: "/accountChecking/monthlyStatementDetail",
          name: "monthlyStatementDetail",
          component: () => import("@/views/accountChecking/monthlyStatement/monthlyStatementDetail/monthlyStatementDetail.vue"),
          meta: {
            isMenu: true,
            menuTitle: "月结账单详情",
            menuMark: "/accountChecking/monthlyStatementDetail",
          },
        },
        {
          path: "/accountChecking/settlementDetail",
          name: "settlementDetail",
          component: () => import("@/views/accountChecking/settlement/settlementDetail/settlementDetail.vue"),
          meta: {
            isMenu: false,
            menuTitle: "结款单详情",
            menuMark: "/accountChecking/settlementDetail",
          },
        },
        {
          path: "/accountChecking/settlement/chargingRules",
          name: "settlementChargingRules",
          component: () => import("@/views/accountChecking/settlement/settlementDetail/chargingRules.vue"),
          meta: {
            isMenu: false,
            menuTitle: "结款单详情",
            menuMark: "/accountChecking/settlement/chargingRules",
          },
        },
      ],
    },
  ];
  
  export default accountCheckingModule;
  
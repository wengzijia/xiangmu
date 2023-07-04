export const financialModule = [
    {
      path: "/financial",//财务视图--计价标准模块
      name:'Financial',
      icon: 'priceAllocation',
      component: () => import("@/layout/mainLayout/index.vue"),
      redirect: "/financial/priceFormulaList",
      meta: { 
        isMenu: true, 
        title: "计价标准配置", 
        menuMark: "/financial",
        activeMenu:'/financial',
        viewModule:'financial',//财务视图--计价标准模块
      },
      children: [
        {
          path: "/financial/priceFormulaList",
          name: "PriceFormulaList",
          component: () => import("@/views/financialModule//priceAllocationModule/priceFormulaList.vue"),
          meta: {
            isMenu: true,
            menuTitle: "计价公式列表",
            menuMark: "/financial/priceFormulaList",
          },
        },
        {
          path: "/financial/formulaConfiguration",
          name: "FormulaConfiguration",
          component: () => import("@/views/financialModule//priceAllocationModule/formulaConfiguration.vue"),
          meta: {
            isMenu: true,
            menuTitle: "加工商公式配置",
            menuMark: "/financial/formulaConfiguration",
          },
        },
        {
          path: "/financial/priceRuleList",
          name: "PriceRuleList",
          component: () => import("@/views/financialModule//priceAllocationModule/priceRuleList.vue"),
          meta: {
            isMenu: true,
            menuTitle: "单价计费规则列表",
            menuMark: "/financial/priceRuleList",
          },
        },
        {
          path: "/financial/ruleAuditList",
          name: "RuleAuditList",
          component: () => import("@/views/financialModule//priceAllocationModule/ruleAuditList.vue"),
          meta: {
            isMenu: true,
            menuTitle: "单价计费规则审核",
            menuMark: "/financial/ruleAuditList",
          },
        },
      ],
    },
    {
      path: "/financial",
      component: () => import("@/layout/mainLayout/other.vue"),
      redirect: "/financial/chargingDetail",
      meta: {
        isMenu: false,
        title: "系统权限配置",
        menuMark: "/financial",
        type: "financial",
        viewName: "财务视图",
        viewModule:'financial',//财务视图--计价标准模块
      },
      children: [
        {
          path: "/financial/chargingDetail",
          name: "chargingDetail",
          component: () => import("@/views/financialModule/priceAllocationModule/chargingDetail.vue"),
          meta: {
            isMenu: false,
            menuTitle: "计费规则详情",
            menuMark: "/financial/chargingDetail",
          },
        },
      ],
    },
  ];
  
  export default financialModule;
  
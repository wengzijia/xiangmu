export const unitChargeRule = [
  {
    path: "/unitChargeRule",
    component: () => import("@/layout/mainLayout/index.vue"),
    name: "unitChargeRule",
    icon: 'unitChargeRule',
    redirect: "/unitChargeRule/unitChargeRuleListCG",
    meta: {
      isMenu: true,
      title: "计费规则配置",
      menuMark: "/unitChargeRule",
      activeMenu: "/unitChargeRule",
      viewName: "计费规则配置",
      viewModule:"unitChargeRule"
    },
    children: [
      {
        path: "/unitChargeRule/unitChargeRuleListCG",
        name: "unitChargeRuleListCG",
        component: () =>
          import("@/views/unitChargeRule/unitChargeRuleListCG.vue"),
        meta: {
          isMenu: true,
          menuTitle: "单价计费规则列表",
          menuMark: "/unitChargeRule/unitChargeRuleListCG"
        }
      },

      {
        path: "/unitChargeRule/unitChargeRuleListCW",
        name: "unitChargeRuleListCW",
        component: () =>
          import("@/views/unitChargeRule/unitChargeRuleListCW.vue"),
        meta: {
          isMenu: true,
          menuTitle: "单价计费规则列表",
          menuMark: "/unitChargeRule/unitChargeRuleListCW"
        }
      },

      {
        path: "/unitChargeRule/unitChargeRuleListAuditCGJL",
        name: "unitChargeRuleListAuditCGJL",
        component: () =>
          import("@/views/unitChargeRule/unitChargeRuleListAuditCGJL.vue"),
        meta: {
          isMenu: true,
          menuTitle: "单价计费规则审核",
          menuMark: "/unitChargeRule/unitChargeRuleListAuditCGJL"
        }
      },

      {
        path: "/unitChargeRule/unitChargeRuleListAuditCWB",
        name: "unitChargeRuleListAuditCWB",
        component: () =>
          import("@/views/unitChargeRule/unitChargeRuleListAuditCWB.vue"),
        meta: {
          isMenu: true,
          menuTitle: "单价计费规则审核",
          menuMark: "/unitChargeRule/unitChargeRuleListAuditCWB"
        }
      },


    ],
  },
  {
    path: "/unitChargeRule",
    component: () => import("@/layout/mainLayout/other.vue"),
    redirect: "/unitChargeRule/unitChargeRuleCGDetail",
    meta: {
      isMenu: false,
      title: "计费规则配置",
      menuMark: "/unitChargeRule",
      type: "unitChargeRule",
      viewName: "计费规则配置",
      viewModule:"unitChargeRule"
    },
    children: [
      {
        path: "/unitChargeRule/unitChargeRuleCGDetail",
        name: "unitChargeRuleCGDetail",
        component: () =>
          import("@/views/unitChargeRule/unitChargeRuleCGDetail.vue"),
        meta: {
          isMenu: true,
          menuTitle: "单价计费规则详情",
          menuMark: "/unitChargeRule/unitChargeRuleCGDetail"
        }
      },
      {
        path: "/unitChargeRule/unitChargeRuleAuditCGJLDetail",
        name: "unitChargeRuleAuditCGJLDetail",
        component: () =>
          import("@/views/unitChargeRule/unitChargeRuleAuditCGJLDetail.vue"),
        meta: {
          isMenu: true,
          menuTitle: "单价计费规则审核详情",
          menuMark: "/unitChargeRule/unitChargeRuleAuditCGJLDetail"
        }
      },
      {
        path: "/unitChargeRule/unitChargeRuleCWDetail",
        name: "unitChargeRuleCWDetail",
        component: () =>
          import("@/views/unitChargeRule/unitChargeRuleCWDetail.vue"),
        meta: {
          isMenu: true,
          menuTitle: "单价计费规则详情",
          menuMark: "/unitChargeRule/unitChargeRuleCWDetail"
        }
      },
      {
        path: "/unitChargeRule/unitChargeRuleAuditCWDetail",
        name: "unitChargeRuleAuditCWBLDetail",
        component: () =>
          import("@/views/unitChargeRule/unitChargeRuleAuditCWDetail.vue"),
        meta: {
          isMenu: true,
          menuTitle: "单价计费规则审核详情",
          menuMark: "/unitChargeRule/unitChargeRuleAuditCWDetail"
        }
      },
      {
        path: "/unitChargeRule/historyVersionList",
        name: "historyVersionList",
        component: () =>
          import("@/views/unitChargeRule/historyVersionList.vue"),
        meta: {
          isMenu: true,
          menuTitle: "单价计费规则历史版本",
          menuMark: "/unitChargeRule/historyVersionList"
        }
      }
    ]
  }
];


export default unitChargeRule;

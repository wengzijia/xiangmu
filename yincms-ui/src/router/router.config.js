/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    redirect: '/price/cartIndex',
    component: () => import('@/layout/IndexLayout'),
    children: [
      {
        path: '/index/index',
        name: 'mainIndex',
        component: () => import('@/views/index/Index')
      },
      // {
      //   path: '/ironActivity',
      //   name: 'ironActivity',
      //   component: () => import('@/views/ironActivity/Index')
      // },
      // {
      //   path: '/disposable',
      //   name: 'disposable',
      //   component: () => import('@/views/disposable/Index')
      // },
      // {
      //   path: '/packing',
      //   name: 'packing',
      //   component: () => import('@/views/packing/index')
      // },
      // {
      //   path: '/PackagingDemand',
      //   name: 'PackagingDemand',
      //   component: () => import('@/views/packing/PackagingDemand')
      // },
      {
        path: '/price/priceValuationLayout',
        name: 'priceValuationLayout',
        component: () => import('@/layout/ValuationLayout'),
        children: [
          {
            path: '/price/index',
            name: 'priceIndex',
            component: () => import('@/views/price/Index')
          },
          {
            path: '/price/cartIndex',
            name: 'cartPriceIndex',
            component: () => import('@/views/price/CartIndex')
          },
          {
            path: '/price/cartonIndex',
            name: 'cartonPriceIndex',
            component: () => import('@/views/price/CartonIndex')
          },
          {
            path: '/price/specialBoxList',
            name: 'specialBoxList',
            component: () => import('@/views/price/SpecialBoxList')
          },
          {
            path: '/price/explainIndex',
            name: 'priceExplainIndex',
            component: () => import('@/views/price/ExplainIndex')
          },
          {
            path: '/price/HardcoverQuotation',
            name: 'priceH',
            component: () => import('@/views/price/HardcoverQuotation2')
          },
          {
            path: '/price/HardcoverQuotation3',
            name: 'HardcoverQuotation3',
            component: () => import('@/views/price/HardcoverQuotation3')
          }
        ]
      },

      {
        path: '/price/HardcoverQuotation2',
        name: 'HardcoverQuotation2',
        component: () => import('@/views/price/HardcoverQuotation2')
      },
      {
        path: '/price/proofValuationLayout',
        name: 'proofValuationLayout',
        component: () => import('@/layout/ProofValuationLayout'),
        children: [
          {
            path: '/proof/index',
            name: 'proofIndex',
            component: () => import('@/views/proof/Index')
          },
          {
            path: '/proof/originalIndex',
            name: 'originalIndex',
            component: () => import('@/views/proof/originalIndex')
          },
          {
            path: '/proof/HardcoverQuotation',
            name: 'proofH',
            component: () => import('@/views/proof/HardcoverQuotation')
          }
        ]
      },
      {
        path: '/cutter/cutterLayout',
        name: 'cutterLayout',
        component: () => import('@/layout/CutterLayout'),
        children: [
          {
            path: '/cutter/index',
            name: 'cutterIndex',
            component: () => import('@/views/cutter/Index')
          },

          {
            path: '/cutter/cardNew',
            name: 'cutterCardNew',
            component: () => import('@/views/cutter/CardNew')
          },
          {
            path: '/cutter/canbodyNew',
            name: 'cutterCardNew',
            component: () => import('@/views/cutter/canbodyNew')
          },
          {
            path: '/cutter/groupAttrInfo',
            name: 'groupAttrInfo',
            component: () => import('@/views/cutter/GroupAttrInfo')
          },
          {
            path: '/cutter/cardOld',
            name: 'cutterCardOld',
            component: () => import('@/views/cutter/CardOld')
          }
        ]
      },
      {
        path: '/plug/index',
        name: 'plugIndex',
        component: () => import('@/views/plug/Index'),
        meta: {
          title: '傲彩包装魔术手'
        }
      },
      {
        path: '/preview/PreviewLayout',
        name: 'PreviewLayout',
        meta: {
          title: '傲彩智能预检'
        },
        component: () => import('@/layout/PreviewLayout'),
        children: [
          {
            path: '/preview/index',
            name: 'previewIndex',
            component: () => import('@/views/preview/Index')
          },
          {
            path: '/preview/previewList',
            name: 'previewList',
            component: () => import('@/views/preview/previewList')
          }
        ]
      },
      {
        path: '/service/originalGetpay',
        name: 'originalGetpay',
        component: () => import('@/views/order/OriginalGetpay'),
        meta: {
          title: '订单支付'
        }
      },
      {
        path: '/plug/explain',
        name: 'plugExplain',
        component: () => import('@/views/plug/Explain'),
        meta: {
          title: '傲彩包装魔术手'
        }
      },
      {
        path: '/plug/install',
        name: 'plugInstall',
        component: () => import('@/views/plug/Install'),
        meta: {
          title: '傲彩包装魔术手'
        }
      },
      // {
      //   path: '/solution/index',
      //   name: 'solutionIndex',
      //   meta: {
      //     title: '包装设计_包装设计图片_包装设计模板',
      //     keywords: '包装设计,包装设计图,包装设计图片,包装设计模板',
      //     description: '傲彩包装设计模板频道-专业提供化妆品包装、电子产品包装、医药保健品包装、食品包装、茶叶包装、酒包装等包装设计模板下载服务，5000个包装设计模板，免费下载。'
      //   },
      //   component: () => import('@/views/solution/Index')
      // },
      {
        path: '/solution/detail',
        name: 'solutionDetail',
        meta: {
          title: '包装设计_包装设计图片_包装设计模板',
          keywords: '包装设计,包装设计图,包装设计图片,包装设计模板',
          description: '傲彩包装设计模板频道-专业提供化妆品包装、电子产品包装、医药保健品包装、食品包装、茶叶包装、酒包装等包装设计模板下载服务，5000个包装设计模板，免费下载。'
        },
        component: () => import('@/views/solution/Detail')
      },
      {
        path: '/solution/getPay',
        name: 'solutionGetPay',
        component: () => import('@/views/solution/GetPay')
      },
      {
        path: '/goods/goodsDesc',
        name: 'goodsDesc',
        component: () => import('@/views/goods/GoodsDesc')
      },
      {
        path: '/news/detail',
        name: 'newsDetail',
        component: () => import('@/views/news/NewsDetail.vue')
      },
      {
        path: '/producer/index',
        name: 'producerIndex',
        component: () => import('@/views/producer/Index.vue')
      },
      {
        path: '/producer/joinProducer',
        name: 'joinProducer',
        component: () => import('@/views/producer/JoinProducer.vue')
      },
      {
        path: '/zbz/index',
        name: 'zbzIndex',
        component: () => import('@/views/zbz/index')
      },

      {
        path: '/zbz/list',
        name: 'zbzList',
        component: () => import('@/views/zbz/listComponents/index')
      },

      {
        path: '/zbz/buynow',
        name: 'zbzBuyNow',
        component: () => import('@/views/zbz/details/BuyNow')
      },
      {
        path: '/zbz/detail',
        name: 'zbzDetail',
        component: () => import('@/views/zbz/details/Detail')
      },
      {
        path: '/packagingSolution/packagingSolution',
        name: 'packagingSolution',
        component: () => import('@/views/packagingSolution/packagingSolution.vue')
      },
      {
        path: '/packagingSolution/packageDetails',
        name: 'packageDetails',
        component: () => import('@/views/packagingSolution/packageDetails/index')
      },
      {
        path: '/packagingSolution/packageList',
        name: 'packageList',
        component: () => import('@/views/packagingSolution/packageList/index')
      },
      {
        path: '/packagingSolution/searchResults',
        name: 'searchResults',
        component: () => import('@/views/packagingSolution/packageList/searchResults')
      },
      {
        path: '/packagingSolution/listsPackes',
        name: 'listsPackes',
        component: () => import('@/views/packagingSolution/packageList/listsPackes')
      }
    ]
  },
  {
    path: '/base/web/qiyu',
    name: 'webqiyu',
    component: () => import('@/views/base/qiyu')
  },
  {
    path: '/price/cartIndex2',
    name: 'cartPriceIndex2',
    component: () => import('@/views/price/CartIndex2')
  },
  {
    path: '/price/index2',
    name: 'priceIndex2',
    component: () => import('@/views/price/Index2')
  },
  {
    path: '/isCms/index',
    name: 'isCMSIndex',
    component: () => import('@/views/price/Index3_isCms')
  },
  {
    path: '/isCms/cartIndex',
    name: 'cartIsCMSIndex',
    component: () => import('@/views/price/CartIndex3_isCms')
  },
  {
    path: '/isCms/hardcoverQuotation',
    name: 'priceH',
    component: () => import('@/views/price/HardcoverQuotation2_isCms')
  },
  {
    path: '/isCms/specialBoxList',
    name: 'isCMSBoxList',
    component: () => import('@/views/price/SpecialBoxList_isCms')
  },
  {
    path: '/isCms/explainIndex',
    name: 'isCMSExplainIndex',
    component: () => import('@/views/price/ExplainIndex_isCms')
  },
  {
    path: '/proof/IndexIframe',
    name: 'isCMSExplainIndex',
    component: () => import('@/views/proof/IndexIframe')
  },

  {
    path: '/price/explainIndex2',
    name: 'priceExplainIndex',
    component: () => import('@/views/price/ExplainIndex')
  },
  {
    path: '/isCms/cartonIndex',
    name: 'isCMSPriceIndex',
    component: () => import('@/views/price/CartonIndex_isCms')
  },
  {
    path: '/preview/previewDetails',
    name: 'previewDetails',
    component: () => import('@/views/preview/PreviewDetailsPdf'),
    meta: {
      title: '傲彩智能预检详情'
    }
  },
  {
    path: '/tin3D',
    name: 'tin3D',
    component: () => import('@/views/cutter/tin3D')
  },
  {
    path: '/loginLayout',
    name: 'loginLayout',
    redirect: '/login',
    component: () => import('@/layout/LoginLayout.vue'),
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/base/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('../views/base/Register.vue')
      },
      {
        path: '/getpassword',
        name: 'getpassword',
        component: () => import('../views/base/Getpassword.vue')
      }
    ]
  },
  {
    path: '/myDesign',
    name: 'myDesign',
    component: () => import('../layout/myDesign'),
    children: [
      {
        path: '/user/myTask',
        name: 'myTask',
        component: () => import('../views/user/designers/myTask')
      },
      {
        path: '/user/financial',
        name: 'financial',
        component: () => import('../views/user/designers/financial')
      },

      {
        path: '/user/certifiedDesigner',
        name: 'certifiedDesigner',
        component: () => import('../views/user/designers/certifiedDesigner')
      }
    ]
  },
  {
    path: '/user/lookDetail',
    name: 'lookDetail',
    component: () => import('../views/user/designers/lookDetail')
  },
  {
    path: '/user/designerRules',
    name: 'designerRules',
    component: () => import('../views/user/designers/designerRules')
  },
  {
    path: '/user/designerRegister',
    name: 'designerRegister',
    component: () => import('../views/user/designers/designerRegister')
  },
  {
    path: '/user/signing',
    name: 'signing',
    component: () => import('../views/user/designers/signing')
  },
  {
    path: '/user/designContract',
    name: 'designContract',
    component: () => import('../views/user/designers/designContract')
  },
  {
    path: '/user/designerAgreen',
    name: 'designerAgreen',
    component: () => import('../views/user/designers/designerAgreen')
  },
  {
    path: '/user/shareToDesigner',
    name: 'shareToDesigner',
    component: () => import('../views/user/designers/shareToDesigner')
  },
  {
    path: '/user/taskOperation',
    name: 'taskOperation',
    component: () => import('../views/user/designers/taskOperation')
  },
  {
    path: '/user/certificationUrl',
    name: 'certificationUrl',
    component: () => import('../views/user/designers/certificationUrl')
  },
  {
    path: '/user/taskHall',
    name: 'taskHall',
    component: () => import('../views/user/designers/taskHall')
  },
  {
    path: '/userLayout',
    name: 'userLayout',
    component: () => import('../layout/UserLayout'),
    children: [
      {
        path: '/user/index',
        name: 'userIndex',
        component: () => import('../views/user/Index')
      },
      {
        path: '/user/editprofile',
        name: 'userEditprofile',
        component: () => import('../views/user/Editprofile')
      },
      {
        path: '/user/editpassword',
        name: 'userEditpassword',
        component: () => import('../views/user/Editpassword')
      },
      {
        path: '/user/aptitude',
        name: 'aptitude',
        component: () => import('../views/user/Aptitude')
      },
      {
        path: '/user/orderlist',
        name: 'orderlist',
        component: () => import('../views/user/OrderList')
      },
      {
        path: '/user/offlineorderlist',
        name: 'offlineorderlist',
        component: () => import('../views/user/offlineOrderlist')
      },
      {
        path: '/user/orderdetail',
        name: 'orderdetail',
        component: () => import('../views/user/OrderDetail')
      },
      {
        path: '/user/invoice',
        name: 'userInvoice',
        component: () => import('../views/user/Invoice')
      },
      {
        path: '/user/designerlist',
        name: 'designerlist',
        component: () => import('../views/user/Designerlist')
      },
      {
        path: '/user/inquirylist',
        name: 'inquirylist',
        component: () => import('../views/user/inquirylist')
      },
      {
        path: '/user/inquiryDetail',
        name: 'inquirylist',
        component: () => import('../views/user/inquiryDetail')
      },
      {
        path: '/user/demandlist',
        name: 'userDemandList',
        component: () => import('../views/user/DemandList')
      },
      {
        path: '/user/demanddetail',
        name: 'userDemandDetail',
        component: () => import('../views/user/DemandDetail')
      },
      {
        path: '/user/designdetail',
        name: 'DesignDetail',
        component: () => import('../views/user/DesignDetail')
      },
      {
        path: '/user/userAddressList',
        name: 'userAddressList',
        component: () => import('../views/user/UserAddressList')
      },
      {
        path: '/user/userBonusList',
        name: 'userBonusList',
        component: () => import('../views/user/UserBonusList')
      },
      {
        path: '/user/userBonusExchange',
        name: 'userBonusExchange',
        component: () => import('../views/user/UserBonusExchange')
      },
      {
        path: '/user/templateList',
        name: 'userTemplateList',
        component: () => import('../views/user/TemplateList')
      },
      {
        path: '/user/designAddress',
        name: 'userDesignAddress',
        component: () => import('../views/user/DesignAddress')
      },
      {
        path: '/user/balance',
        name: 'userBalance',
        component: () => import('../views/user/Balance')
      }
    ]
  },
  {
    path: '/cart/cartLayout',
    name: 'cartLayout',
    component: () => import('@/layout/CartLayout'),
    children: [
      {
        path: '/cart/proof',
        name: 'cartProof',
        component: () => import('../views/cart/CartProof')
      },
      {
        path: '/cart/proofAdaptive',
        name: 'proofAdaptive',
        component: () => import('../views/cart/CartProofAdaptive')
      },
      {
        path: '/cart/index',
        name: 'cartIndex',
        component: () => import('../views/cart/CartIndex')
      },
      {
        path: '/cart/indexAdaptive',
        name: 'CartIndexAdaptive',
        component: () => import('../views/cart/CartIndexAdaptive')
      },
      {
        path: '/cart/checkorder',
        name: 'cartCheckOrder',
        component: () => import('../views/cart/CheckOrder')
      },
      {
        path: '/cart/checkproof',
        name: 'cartCheckProof',
        component: () => import('../views/cart/CheckProof')
      },
      {
        path: '/cart/indexPanel',
        name: 'CartIndexPanel',
        component: () => import('../views/cart/CartIndexPanel')
      },
      {
        path: '/service/getpay',
        name: 'orderGetpay',
        component: () => import('../views/order/Getpay')
      },
      {
        path: '/service/getcylpay',
        name: 'orderGetCylpay',
        component: () => import('../views/order/Getcylpay')
      },
      {
        path: '/order/getfile',
        name: 'orderGetFile',
        component: () => import('../views/order/Getfile')
      },
      {
        path: '/order/requrchaseOrder',
        name: 'requrchaseOrder',
        component: () => import('../views/cart/RequrchaseOrder')
      },
      {
        path: '/service/getinvoicepay',
        name: 'getInvoicePay',
        component: () => import('../views/order/GetInvoicePay')
      },
      {
        path: '/service/getcylpaytogether',
        name: 'getcylpaytogether',
        component: () => import('../views/order/GetcylpayTogether')
      },
      {
        path: '/service/getinvoicepaytogether',
        name: 'getinvoicepaytogether',
        component: () => import('../views/order/GetInvoicePayTogether')
      }
    ]
  },
  {
    path: '/realNameCert',
    name: 'realNameCert',
    component: () => import('../views/realNameCert/realNameCert')
  },
  {
    path: '/introduction/pack-index',
    redirect: '/introduction/pack-makeup',
    children: [
      {
        path: '/introduction/pack-makeup',
        name: 'introductionPackMakeup',
        component: () => import('@/views/packagingSolution/introduction/makeup.vue')
      },
      {
        path: '/introduction/pack-festival',
        name: 'introductionPackFestival',
        component: () => import('@/views/packagingSolution/introduction/festival.vue')
      },
      {
        path: '/introduction/pack-digital',
        name: 'introductionPackDigital',
        component: () => import('@/views/packagingSolution/introduction/digital.vue')
      }
    ],
    name: 'introductionPackIndex',
    component: () => import('@/views/packagingSolution/introduction/index.vue')
  },
  {
    path: '/introduction/wap/pack-festival',
    name: 'introductionPackWAPFestival',
    component: () => import('@/views/packagingSolution/introduction/wap/festival.vue')
  },
  {
    path: '/introduction/wap/pack-digital',
    name: 'introductionPackWAPDigital',
    component: () => import('@/views/packagingSolution/introduction/wap/digital.vue')
  },
  {
    path: '/introduction/wap/pack-makeup',
    name: 'introductionPackWAPMakeup',
    component: () => import('@/views/packagingSolution/introduction/wap/makeup.vue')
  },
  {
    path: '/introduction/wap/pack-plan',
    name: 'introductionPackPlan',
    component: () => import('@/views/packagingSolution/introduction/wap/packPlan.vue')
  },
  {
    path: '/introduction/wap/pack-search',
    name: 'introductionPackSearch',
    component: () => import('@/views/packagingSolution/introduction/wap/search.vue')
  },
  {
    path: '/service/diffpay',
    name: 'DiffPay',
    component: () => import('../views/order/Diffpay')
  },
  {
    path: '/errorPage',
    name: 'errorPage',
    component: () => import('@/views/base/ErrorPage')
  },
  {
    path: '*',
    name: '*',
    redirect: '/errorPage'
  }
];

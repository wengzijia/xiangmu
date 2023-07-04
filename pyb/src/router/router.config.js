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
            path: '/price/specialBoxList',
            name: 'specialBoxList',
            component: () => import('@/views/price/SpecialBoxList')
          },
          {
            path: '/price/explainIndex',
            name: 'priceExplainIndex',
            component: () => import('@/views/price/ExplainIndex')
          }
        ]
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
          title: '拼一版包装魔术手'
        }
      },
      {
        path: '/full/fullPageIndex',
        name: 'fullPageIndex',
        component: () => import('@/views/full/FullPageIndex'),
        meta: {
          title: '整版报价'
        }
      },
      {
        path: '/plug/explain',
        name: 'plugExplain',
        component: () => import('@/views/plug/Explain'),
        meta: {
          title: '拼一版包装魔术手'
        }
      },
      {
        path: '/plug/install',
        name: 'plugInstall',
        component: () => import('@/views/plug/Install'),
        meta: {
          title: '拼一版包装魔术手'
        }
      },
      {
        path: '/solution/index',
        name: 'solutionIndex',
        meta: {
          title: '包装设计_包装设计图片_包装设计模板',
          keywords: '包装设计,包装设计图,包装设计图片,包装设计模板',
          description: '拼一版包装设计模板频道-专业提供化妆品包装、电子产品包装、医药保健品包装、食品包装、茶叶包装、酒包装等包装设计模板下载服务，5000个包装设计模板，免费下载。'
        },
        component: () => import('@/views/solution/Index')
      },
      {
        path: '/solution/detail',
        name: 'solutionDetail',
        meta: {
          title: '包装设计_包装设计图片_包装设计模板',
          keywords: '包装设计,包装设计图,包装设计图片,包装设计模板',
          description: '拼一版包装设计模板频道-专业提供化妆品包装、电子产品包装、医药保健品包装、食品包装、茶叶包装、酒包装等包装设计模板下载服务，5000个包装设计模板，免费下载。'
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
      }
    ]
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
      },
      {
        path: '/user/editionOrderList',
        name: 'userEditionOrderList',
        component: () => import('../views/user/EditionOrderList')
      },
      {
        path: '/user/editionOrderDetails',
        name: 'editionOrderDetails',
        component: () => import('../views/user/EditionOrderDetails')
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
        path: '/service/getcylpayTogether',
        name: 'GetcylpayTogether',
        component: () => import('../views/order/GetcylpayTogether')
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
        path: '/cart/checkEdition',
        name: 'checkEdition',
        component: () => import('../views/cart/CheckEdition')
      },
      {
        path: '/service/getinvoicepaytogether',
        name: 'getinvoicepaytogether',
        component: () => import('../views/order/GetInvoicePayTogether')
      },
      {
        path: '/service/editionPay',
        name: 'editionPay',
        component: () => import('../views/order/EditionPay')
      }
    ]
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

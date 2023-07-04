const BASE_URL = '/api/consumer';
const api = {
  order: {
    order: {
      createOrder: BASE_URL + '/order/miniOrders/createOrder',
      createPayQrCode: BASE_URL + '/order/miniOrders/createPayQrCode',
      cancelOrder: BASE_URL + '/order/miniOrders/cancelOrder',
      cancelFile: BASE_URL + '/order/miniSupplierOrders/cancelConfirmFile',
      saveOrUpdateDoc: BASE_URL + '/user/miniOrderComDocuments/addOrUpdateOrderDocuments',
      getOrderList: BASE_URL + '/certifyFree/order/miniSupplierOrders/getOrderList',
      updateName: BASE_URL + '/order/miniOrdersGoods/updateName',
      prepressNotes: BASE_URL + '/order/miniSupplierOrders/prepressNotes'
    },
    orderTogether: {
      createOrder: BASE_URL + '/order/miniOrdersTogether/createOrder',
      createPayQrCode: BASE_URL + '/order/miniOrdersTogether/createPayQrCode',
      // 专项支付
      createPayQrCode2: BASE_URL + '/order/miniOrdersTogether/createPayQrCode2',
      getOrderByOrderNo: BASE_URL + '/order/miniOrdersTogether/getOrderByOrderNo'
    },
    supplierOrders: {
      getStatusStatisticsCount: BASE_URL + '/order/miniSupplierOrders/getStatusStatisticsCount',
      getAllSupplierOrder: BASE_URL + '/order/miniSupplierOrders/getAllSupplierOrder',
      findAssociationGoodsById: BASE_URL + '/order/miniSupplierOrders/findAssociationGoodsById',
      queryOrderClassify: BASE_URL + '/order/miniSupplierOrders/queryOrderClassify',
      updatePdfFile: BASE_URL + '/order/miniSupplierOrders/updatePdfFile',
      getOrderDetails: BASE_URL + '/order/miniSupplierOrders/getOrderDetails',
      getSupplierOrderDetails: BASE_URL + '/order/miniSupplierOrders/getSupplierOrderDetails',
      confirmSampleSend: BASE_URL + '/order/miniSupplierOrders/send',
      confirmHardcoverSend: BASE_URL + '/order/miniSupplierOrders/sendBymic',
      confirmBlisterSend: BASE_URL + '/order/miniSupplierOrders/sendByXiSu',
      listFlipOrder: BASE_URL + '/order/miniSupplierOrders/listFlipOrder',
      editFileLook: BASE_URL + '/order/miniSupplierOrders/editFileLook'
    },
    orderRefund: {
      createOrderRefund: BASE_URL + '/order/miniOrdersRefund/createOrderRefund',
      getOrderRefundStatus: BASE_URL + '/order/miniOrdersRefund/getOrderRefundStatus'
    },
    ordersRefund: {
      createOrderRefund: BASE_URL + '/order/miniOrdersRefund/createOrderRefund'
    },
    proofOrder: {
      adaptationOrder: BASE_URL + '/proof/miniProofOrder/adaptationOrder',
      ProofOrderSend: BASE_URL + '/proof/miniProofOrder/proofOrderSend'
    },
    templateOrder: {
      getUserTemplateOrder: BASE_URL + '/template/miniTemplateOrder/getUserTemplateOrder'
    },
    orderGetcylpay: {
      getPayQrCode: BASE_URL + '/order/miniOrders/createPayQrCode',
      // 专项支付
      getPayQrCode02: BASE_URL + '/order/miniOrders/createPayQrCode2',
      getOrderInfo: BASE_URL + '/order/miniOrders/getOrderByOrderNo',
      miniOrdersBalancePay: BASE_URL + '/order/miniOrders/balancePay',
      miniOrdersCancelBalancePay: BASE_URL + '/order/miniOrders/cancelBalancePay'
    },
    orderGetpay: {
      getPayQrCode: BASE_URL + '/proof/miniProof/createPayQrCode',
      getOrderInfo: BASE_URL + '/proof/miniProof/getProofOrderByOrderNo',
      miniProofBalancePay: BASE_URL + '/proof/miniProof/balancePay',
      miniProofCancelBalancePay: BASE_URL + '/proof/miniProof/cancelBalancePay'
    },
    getFile: {
      getMiniOrderDetail: BASE_URL + '/order/miniSupplierOrders/getOrderDetails'
    },
    diff: {
      getOrderByOrderNo: BASE_URL + '/order/miniDiffOrder/getOrderByOrderNo',
      createQrCode: BASE_URL + '/order/miniDiffOrder/createPayQrCode',
      useBalance: BASE_URL + '/order/miniDiffOrder/balancePay'
    },
    edition: {
      addEditionOrder: BASE_URL + '/order/miniEditionOrder/addEditionOrder',
      createPayQrCode: BASE_URL + '/order/miniEditionOrder/createPayQrCode',
      checkEdition: BASE_URL + '/order/miniEditionOrder/checkEdition',
      getOrderByOrderNo: BASE_URL + '/order/miniEditionOrder/getOrderByOrderNo'
    },
    editionSubOrder: {
      orderList: BASE_URL + '/order/miniEditionSuborder/orderList',
      ordersDetails: BASE_URL + '/order/miniEditionSuborder/ordersDetails',
      updatePdfFile: BASE_URL + '/order/miniEditionSuborder/updatePdfFile',
      editionFiles: BASE_URL + '/order/miniEditionSuborder/editionFiles'
    }
  },
  users: {
    user: {
      login: BASE_URL + '/certifyFree/user/login',
      smsLogin: BASE_URL + '/certifyFree/user/smsLogin',
      simpleRegistration: BASE_URL + '/certifyFree/user/simpleRegistration',
      retrievePassword: BASE_URL + '/certifyFree/user/retrievePassword',
      checkToken: BASE_URL + '/certifyFree/user/checkToken',
      logout: BASE_URL + '/certifyFree/user/logout',
      getCurrentUserInfo: BASE_URL + '/users/user/getCurrentUserInfo',
      getCurrentUserNav: BASE_URL + '/users/user/getCurrentUser',
      updateAccountInfo: BASE_URL + '/users/user/updateAccountInfo',
      updatePassword: BASE_URL + '/users/user/updatePassword',
      getDbUserInfo: BASE_URL + '/users/user/getDbUserInfo'
    },
    sender: {
      getByUid: BASE_URL + '/user/miniUsersSender/getByUid'
    },
    userBonus: {
      getUserBonusList: BASE_URL + '/user/miniUserBonus/getUserBonusList',
      receiveUserBonus: BASE_URL + '/user/miniUserBonus/receiveUserBonus'
    },
    userComDocuments: {
      getDocumentsByUid: BASE_URL + '/user/miniComDocuments/getDocumentsByUid',
      saveOrUpdate: BASE_URL + '/user/miniComDocuments/saveOrUpdate',
      updateDefault: BASE_URL + '/user/miniComDocuments/updateDefault',
      getById: BASE_URL + '/user/miniComDocuments/getById',
      deleteById: BASE_URL + '/user/miniComDocuments/deleteById',
      deleteByIds: BASE_URL + '/user/miniComDocuments/deleteByIds',
      getDefault: BASE_URL + '/user/miniComDocuments/getDefault',
      uploadDocumentsFile: BASE_URL + '/user/miniComDocuments/uploadDocumentsFile'
    },
    userInvoice: {
      getByUid: BASE_URL + '/user/miniInvoice/getByUid',
      updateDefault: BASE_URL + '/user/miniInvoice/updateDefault',
      saveOrUpdate: BASE_URL + '/user/miniInvoice/saveOrUpdate',
      deleteById: BASE_URL + '/user/miniInvoice/deleteById',
      getById: BASE_URL + '/user/miniInvoice/getById',
      getDefault: BASE_URL + '/user/miniInvoice/getDefault',
      getInvoiceCodeByWord: BASE_URL + '/user/miniInvoice/getInvoiceCodeByWord'
    },
    userInvoiceAddress: {
      getByUid: BASE_URL + '/user/miniInvoiceAddress/getByUid',
      update: BASE_URL + '/user/miniInvoiceAddress/update',
      save: BASE_URL + '/user/miniInvoiceAddress/save'
    },
    address: {
      getMyList: BASE_URL + '/users/address/getMyList',
      saveOrUpdate: BASE_URL + '/users/address/saveOrUpdate',
      deleteById: BASE_URL + '/users/address/deleteById',
      getById: BASE_URL + '/users/address/getById'
    },
    userDemandList: {
      getAllProofOrder: BASE_URL + '/proof/miniProofOrder/getAllProofOrder'
    },
    designAddress: {
      getMyList: BASE_URL + '/proof/miniDesignAddress/getMyList',
      saveOrUpdate: BASE_URL + '/proof/miniDesignAddress/saveOrUpdate',
      deleteById: BASE_URL + '/proof/miniDesignAddress/deleteById',
      getById: BASE_URL + '/proof/miniDesignAddress/getById'
    },
    accountLog: {
      listByUid: BASE_URL + '/user/miniUserAccountLog/listByUid'
    }
  },
  sms: {
    verifyCode: {
      getVerifyImageCode: BASE_URL + '/certifyFree/verifyCode/getVerifyImageCode',
      verifyImageCode: BASE_URL + '/certifyFree/verifyCode/verifyImageCode',
      sendLoginSmsVerifyCode: BASE_URL + '/certifyFree/verifyCode/sendLoginSmsVerifyCode',
      sendRegSmsVerifyCode: BASE_URL + '/certifyFree/verifyCode/sendRegSmsVerifyCode'
    }
  },
  category: {
    category: {
      getAllCategoryList: BASE_URL + '/certifyFree/category/getAllCategoryList',
      findCategoryById: BASE_URL + '/certifyFree/category/findCategoryById',
      getProofCategory: BASE_URL + '/certifyFree/category/getProofCategory',
      getCategoryByPagerId: BASE_URL + '/certifyFree/category/getCategoryByPagerId',
      getAllVoList: BASE_URL + '/certifyFree/category/getAllVoList',
      getAllNavs: BASE_URL + '/certifyFree/category/getAllNavs'
    }
  },
  product: {
    attr: {
      getVoList: BASE_URL + '/certifyFree/attrGroup/getVoList',
      getTreeVoList: BASE_URL + '/certifyFree/attrGroup/getTreeVoList',
      getAttrList: BASE_URL + '/certifyFree/attrGroup/getAttrList',
      getById: BASE_URL + '/certifyFree/attrGroup/getById',
      getAttrById: BASE_URL + '/certifyFree/attrGroup/getAttrById',
      saveOrUpdate: BASE_URL + '/certifyFree/attrGroup/saveOrUpdate',
      addGroup: BASE_URL + '/certifyFree/attrGroup/addGroup',
      addGroupAttr: BASE_URL + '/certifyFree/attrGroup/addGroupAttr',
      deleteById: BASE_URL + '/certifyFree/attrGroup/deleteById',
      deleteAttrById: BASE_URL + '/certifyFree/attrGroup/deleteAttrById',
      deleteAttrByIds: BASE_URL + '/certifyFree/attrGroup/deleteAttrByIds',
      copyAttrInfo: BASE_URL + '/certifyFree/attrGroup/copyAttrInfo',
      getGroupList: BASE_URL + '/certifyFree/attrGroup/getGroupList',
      updateBatchById: BASE_URL + '/certifyFree/attrGroup/updateBatchById',
      getBySubBindId: BASE_URL + '/certifyFree/attrGroup/getBySubBindId',
      getByGoodsId: BASE_URL + '/certifyFree/attrGroup/getByGoodsId',
      checkPantone: BASE_URL + '/certifyFree/attrGroup/checkPantone',
      computeSize: BASE_URL + '/certifyFree/attrGroup/computeSize'
    }
  },
  pay: {
    alipay: {
      getPayQrCode: BASE_URL + '/pay/alipay/getPayQrCode',
      orderQuery: BASE_URL + '/pay/alipay/orderQuery'
    },
    huabei: {
      getPayQrCode: BASE_URL + '/pay/huabei/getPayQrCode',
      orderQuery: BASE_URL + '/pay/huabei/orderQuery'
    },
    wxpay: {
      getPayQrCode: BASE_URL + '/pay/wxpay/getPayQrCode',
      orderQuery: BASE_URL + '/pay/wxpay/orderQuery'
    }
  },
  template: {
    cate: {
      getByParentId: BASE_URL + '/certifyFree/template/miniTemplateCate/getByParentId',
      getById: BASE_URL + '/certifyFree/template/miniTemplateCate/getById'
    },
    template: {
      getById: BASE_URL + '/certifyFree/template/getById',
      getTemplatePage: BASE_URL + '/certifyFree/template/miniTemplate/getTemplatePage',
      downloadTemplateFile: BASE_URL + '/template/miniTemplate/downloadTemplateFile'
    },
    fields: {
      getByParentId: BASE_URL + '/certifyFree/template/miniTemplateFields/getByParentId',
      getById: BASE_URL + '/certifyFree/template/miniTemplateFields/getById'
    },
    order: {
      createTemplateOrder: BASE_URL + '/template/miniTemplateOrder/createTemplateOrder',
      createPayQrCode: BASE_URL + '/template/miniTemplateOrder/createPayQrCode',
      getByOrderNo: BASE_URL + '/template/miniTemplateOrder/getByOrderNo'
    }
  },
  goods: {
    miniGoodsCate: {
      getCategory: BASE_URL + '/certifyFree/miniGoodsCate/getCategory',
      getSubCategoryByPid: BASE_URL + '/certifyFree/miniGoodsCate/getSubCategoryByPid'
    },
    miniGoods: {
      getById: BASE_URL + '/certifyFree/goods/miniGoods/getById',
      getSubCategoryGoods: BASE_URL + '/certifyFree/goods/miniGoods/getSubCategoryGoods',
      getPriceSubCategoryGoods: BASE_URL + '/certifyFree/goods/miniGoods/getPriceSubCategoryGoods',
      getDescById: BASE_URL + '/certifyFree/goods/miniGoods/getDescById'
    }
  },
  proof: {
    proofOrder: {
      createPayQrCode: BASE_URL + '/proof/miniProof/createPayQrCode'
    },
    designerExtend: {
      getDefaultDesigner: BASE_URL + '/certifyFree/proof/miniDesignerExtend/getDefaultDesigner'
    }
  },
  cart: {
    cart: {
      getCartByUid: BASE_URL + '/cart/getCartByUid',
      add: BASE_URL + '/cart/add',
      update: BASE_URL + '/cart/update',
      del: BASE_URL + '/cart/del',
      addAdaptive: BASE_URL + '/cart/addAdaptive',
      delAdaptive: BASE_URL + '/cart/delAdaptive',
      saveOrdersRepurchase: BASE_URL + '/order/miniSupplierOrders/saveOrdersRepurchase',
      updateCheck: BASE_URL + '/cart/updateCheck',
      adaptiveList: BASE_URL + '/cart/adaptiveList',
      addAdaptiveList: BASE_URL + '/cart/addAdaptiveList',
      saveOrUpdate: BASE_URL + '/cart/miniProofAdaptiveAddress/saveOrUpdate',
      deleteByAdaptive: BASE_URL + '/cart/miniProofAdaptiveAddress/deleteByAdaptive',
      addByCartIds: BASE_URL + '/cart/miniCartCollectbox/addByCartIds',
      addCartByIds: BASE_URL + '/cart/miniCartCollectbox/addCartByIds',
      deleteByIds: BASE_URL + '/cart/miniCartCollectbox/deleteByIds',
      listCollect: BASE_URL + '/cart/miniCartCollectbox/listCollect',
      priceOfMakeup: BASE_URL + '/cart/priceOfMakeup',
      countCart: BASE_URL + '/cart/countCart',
      saveOrdersRepurchases: BASE_URL + '/cart/saveOrdersRepurchase'
    },
    proof: {
      getByUid: BASE_URL + '/cart/miniCartProof/getByUid',
      updateNum: BASE_URL + '/cart/miniCartProof/updateNum',
      deleteByIds: BASE_URL + '/cart/miniCartProof/deleteByIds',
      deleteById: BASE_URL + '/cart/miniCartProof/deleteById',
      updateCheck: BASE_URL + '/cart/miniCartProof/updateCheck',
      createAdaptive: BASE_URL + '/cart/miniCartProof/createAdaptive',
      deleteByAdaptive: BASE_URL + '/cart/miniCartProof/deleteByAdaptive',
      adaptiveList: BASE_URL + '/cart/miniCartProof/adaptiveList',
      addCart: BASE_URL + '/cart/miniCartProof/addCart'
    },
    checkOrder: {
      getMyAddress: BASE_URL + '/users/address/getMyList',
      getMyAddressById: BASE_URL + '/users/address/getById',
      deleteAddressById: BASE_URL + '/users/address/deleteById',
      saveOrUpdateAddress: BASE_URL + '/users/address/saveOrUpdate',
      // setAddressDefault: BASE_URL + '/users/address/setDefault',
      getMiniSampleAddress: BASE_URL + '/user/miniSampleAddress/getByUid',
      saveMiniSampleAddress: BASE_URL + '/user/miniSampleAddress/save',
      deleteMiniSampleAddress: BASE_URL + '/user/miniSampleAddress/deleteById',
      modifyMiniSampleAddress: BASE_URL + '/user/miniSampleAddress/update',
      getSenderInfo: BASE_URL + '/user/miniUsersSender/getByUid',
      saveSenderInfo: BASE_URL + '/user/miniUsersSender/save',
      setSenderDefault: BASE_URL + '/user/miniUsersSender/updateDefault',
      getShippingMode: BASE_URL + '/order/miniAttr/getShippingMode',
      // 创建订单
      createOrder: BASE_URL + '/order/miniOrders/createOrder',
      // 翻单
      getReOrderInfo: BASE_URL + '/order/miniAttr/getReorderCartData',
      updateReOrder: BASE_URL + '/order/miniReorderGoods/editReorderGoods',
      //整版订单添加购物车
      addEdition: BASE_URL + '/cart/miniCartEdition/addEdition',
      //计算购物车数据
      checkEdition: BASE_URL + '/order/miniEditionOrder/checkEdition',
      // 整版报价创建订单
      addEditionOrder: BASE_URL + '/order/miniEditionOrder/addEditionOrder'
    },
    checkProof: {
      getMyAddress: BASE_URL + '/proof/miniDesignAddress/getMyList',
      getMyAddressById: BASE_URL + '/proof/miniDesignAddress/getById',
      deleteAddressById: BASE_URL + '/proof/miniDesignAddress/deleteById',
      saveOrUpdateAddress: BASE_URL + '/proof/miniDesignAddress/saveOrUpdate',
      setAddressDefault: BASE_URL + '/proof/miniDesignAddress/setDefault',
      countCart: BASE_URL + '/proof/miniProof/countCart',
      commitCheckProof: BASE_URL + '/proof/miniProof/addProof'
    }
  },
  news: {
    getById: BASE_URL + '/certifyFree/news/miniPosts/getById',
    listByPids: BASE_URL + '/certifyFree/news/miniPosts/listByPids',
    listByIds: BASE_URL + '/certifyFree/news/miniPosts/listByIds'
  },
  price: {
    invoke: BASE_URL + '/certifyFree/price/invoke',
    editionInvoke: BASE_URL + '/certifyFree/edition/invoke',
    proofGetPrice: BASE_URL + '/certifyFree/proof/getPrice'
  },
  producer: {
    saveProducer: BASE_URL + '/certifyFree/produce/miniAgentApply/saveProducer'
  },
  home: {
    getCount: BASE_URL + '/certifyFree/home/miniKeyValue/getCount',
    listOrder: BASE_URL + '/certifyFree/home/miniKeyValue/listOrder',
    addFrom: BASE_URL + '/certifyFree/home/miniKeyValue/addFrom'
  },
  editionOne: {
    getPrice: BASE_URL + '/certifyFree/editionOne/getPCPrice',
    getLose: BASE_URL + '/certifyFree/editionOne/getLose'
  }
};
export default api;

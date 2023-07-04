export const searchArr = [
  {
    label: '优惠券码',
    key: 'promotionCode',
    type: 'input'
  }, {
  //   label: '优惠券计划名称',
  //   key: 'planName',
  //   type: 'input'
  // }, {
  //   label: '优惠券类型',
  //   key: 'couponType',
  //   value: 'customer_repair_coupon',
  //   type: 'select',
  //   arr: [
  //     {
  //       label: '全部',
  //       value: ''
  //     }
  //   ]
  // }, {
    label: '领取人类型',
    key: 'receiverType',
    type: 'select',
    arr: [
      {
        label: '全部',
        value: ''
      }, {
        label: '客户',
        value: 0
      }, {
        label: '客服',
        value: 1
      }, {
        label: '业务',
        value: 2
      }
    ]
  }, {
    label: '领取人',
    key: 'receiverPersonId',
    type: 'input'
  }, {
    label: '使用用户',
    key: 'usePersonId',
    type: 'input'
  }, {
    label: '使用订单号',
    key: 'orderNo',
    type: 'input'
  }, {
    label: '领取时间',
    key: 'datePicker',
    type: 'datePicker',
    start: 'beginReceiverTime',
    end: 'endReceiverTime'
  }
]

export const listArr =  [
  {
    label: '优惠券码',
    key: 'promotionCode',
  }, {
    label: '优惠券计划名称',
    key: 'planName',
  }, {
    label: '优惠券类型',
    key: 'couponTypeName',
    // width: '280'
  }, {
    label: '优惠券状态',
    key: 'couponStatusName',
    // width: '280'
  }, {
    label: '领取人类型',
    key: 'receiverTypeName',
    // width: '280'
  }, {
    label: '领取人',
    key: 'receiverPersonPhone',
    // width: '280'
  }, {
    label: '领取时间',
    key: 'receiverTime',
    width: '155'
  }, {
    label: '持有人',
    key: 'possessorPhone',
    // width: '280'
  }, {
    label: '使用用户',
    key: 'usePersonPhone',
    // width: '280'
  }, {
    label: '使用时间',
    key: 'useTime',
    width: '155'
  }, {
    label: '使用订单',
    key: 'orderNo',
    width: '200'
  }, {
    label: '优惠金额',
    key: 'useMoney',
    // width: '280'
  },
]
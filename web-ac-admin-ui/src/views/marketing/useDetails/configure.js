export const searchArr = [
  {
    label: '优惠券计划名称',
    key: 'planName',
    type: 'input'
  },{
    label: '优惠券类型',
    key: 'couponType',
    type: 'select',
    arr: [
      {
        label: '全部',
        value: ''
      }
    ]
  },{
    label: '使用时间',
    key: 'datePicker',
    type: 'datePicker',
    start: 'beginUseTime',
    end: 'endUseTime'
  }
]

export const listArr =  [
  {
    label: '优惠券码',
    key: 'promotionCode',
  },
  {
    label: '优惠券计划名称',
    key: 'planName',
  },
  {
    label: '优惠券类型',
    key: 'couponTypeName',
    // width: '280'
  },
  {
    label: '使用订单类型',
    key: 'useOrderType',
    // width: '280'
  },
  {
    label: '使用订单号',
    key: 'orderNo',
    // width: '280'
  },
  {
    label: '优惠金额',
    key: 'useMoney',
    // width: '280'
  },
  {
    label: '使用用户',
    key: 'usePerson',
    // width: '280'
  },
  {
    label: '使用时间',
    key: 'useTime',
    // width: '280'
  }
]
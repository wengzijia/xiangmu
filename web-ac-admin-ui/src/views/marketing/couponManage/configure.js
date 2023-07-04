export const searchArr = [
  {
    label: '优惠券计划编号',
    key: 'planSerial',
    type: 'input'
  }, {
    label: '优惠券计划名称',
    key: 'planName',
    type: 'input'
  }, {
    label: '优惠券类型',
    key: 'couponType',
    type: 'select',
    arr: [
      {
        label: '全部',
        value: ''
      }
    ]
  }, {
    label: '使用订单类型',
    key: 'orderCodeType',
    type: 'select',
    arr: [
      {
        label: '全部',
        value: ''
      }
    ]
  }, {
    label: '发行状态',
    key: 'issueStatus',
    type: 'select',
    arr: [
      {
        label: '全部',
        value: ''
      }, {
        label: '待审核',
        value: 1
      }, {
        label: '启用',
        value: 2
      }, {
        label: '终止',
        value: 3
      }, {
        label: '完结',
        value: 6
      }
    ]
  }
]

export const listArr =  [
  {
    label: '优惠券计划编号',
    key: 'planSerial',
    width: '140'
  }, {
    label: '优惠券计划名称',
    key: 'planName',
    width: '150'
  }, {
    label: '优惠券类型',
    key: 'couponTypeName',
    width: '120'
  }, {
    label: '使用平台',
    key: 'systemType',
    width: '100'
  }, {
    label: '使用订单类型',
    key: 'orderCodeTypeName',
    width: '110'
  }, {
    label: '金额类型',
    key: 'discountType',
    width: '140'
  }, {
    label: '有效期',
    key: 'useEffectivityType',
    width: '310'
  }, {
    label: '预计营销费用',
    key: 'roughlyMoney',
    width: '110'
  }, {
    label: '已领取费用',
    key: 'receivedMoney',
    width: '100'
  }, {
    label: '已使用费用',
    key: 'spentMoney',
    width: '100'
  }, {
    label: '发行数量',
    key: 'totalTensor',
    width: '100'
  }, {
    label: '已领取量',
    key: 'alreadyReceivedTensor',
    width: '100'
  }, {
    label: '已使用量',
    key: 'spentTensor',
    width: '100'
  }, {
    label: '发行状态',
    key: 'status',
    width: '80',
    fixed: 'right'
  }, {
    label: '操作列',
    key: 'yue',
    width: '200',
    fixed: 'right'
  }
]
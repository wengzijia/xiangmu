import store from '@/store'

export const finishedList=()=>{//已完成列表
    return finishedData['type_'+store.state.device.attributeId]
}

export const errorList=()=>{//异常列表
    return errorData['type_'+store.state.device.attributeId]
}

export const waitingList=()=>{//待排产列表
    return waitingData['type_'+store.state.device.attributeId]
}

export const producedList=()=>{//待生产列表
    return producedData['type_'+store.state.device.attributeId]
}

export const orderInfoHeaderLeft=()=>{//当前订单左边部分展示内容
    return headerLeftData['type_'+store.state.device.attributeId]
}

export const getNextOrderInfo=()=>{//当前订单下一订单展示内容
    return nextOrderData['type_'+store.state.device.attributeId]
}

export const getJumpOptions=()=>{//获取跳单原因选项卡
    return jumpOptions['type_'+store.state.device.attributeId]
}
export const getTransferOptions=()=>{//获取转单原因选项卡
    return transferOptions['type_'+store.state.device.attributeId]
}

export const getPDFTitle=()=>{//PDF规章制度查看文字
   const title = {
        type_2:'覆膜标准操作规程',
        type_4:'模切/击凹凸标准操作规程',
        type_5:'粘盒+包装标准操作规程',
        type_6:'烫金标准操作规程',
        type_10:'贴窗标准操作规程',
        type_48:'',
        type_64:'丝印标准操作规程',
    }
    return title['type_'+store.state.device.attributeId]
}

export const getErrorTypesArr=()=>{//获取异常报备中异常类型模块
    const errorList = errorTypesArr['type_'+store.state.device.attributeId] || []
    return  errorList.concat([{name:'15',value:'上工序下机数不对'},{name:'1',value:'其他'}])
}

//已完成列表
var finishedData = {
    type_2: [
        {name:'覆膜类型',value:'subclassTypeName'},
        {name:'纸张尺寸',value:'paperSize'},
        {name:'印刷下机数',value:'nearCount'},
        {name:'完成数量',value:'onCount'},
        {name:'完成日期',value:'onFinishTime'},
    ],
    type_4: [
        {name:'上工序下机数',value:'nearCount'},
        {name:'大版尺寸',value:'paperSize'},
        {name:'工序类型',value:'attributeName'},
        {name:'完成数量',value:'onCount'},
        {name:'完成日期',value:'onFinishTime'},
    ],
    type_5: [
        {name:'上工序下机数',value:'nearCount'},
        {name:'完成数量',value:'onCount'},
        {name:'完成日期',value:'onFinishTime'},
    ],
    type_6: [
        {name:'上工序下机数',value:'nearCount'},
        {name:'纸张尺寸',value:'paperSize'},
        {name:'烫金颜色',value:'subclassTypeName'},
        {name:'完成数量',value:'onCount'},
        {name:'完成日期',value:'onFinishTime'},
    ],
    type_10: [
        {name:'贴窗类型',value:'subclassTypeName'},
        {name:'贴窗尺寸',value:'paperSize'},
        {name:'上工序下机数',value:'nearCount'},
        {name:'完成数量',value:'onCount'},
        {name:'完成日期',value:'onFinishTime'},
    ],
    type_64: [
        {name:'上工序下机数',value:'nearCount'},
        {name:'大版尺寸',value:'paperSize'},
        {name:'丝印类型',value:'subclassTypeName'},
        {name:'完成数量',value:'onCount'},
        {name:'完成日期',value:'onFinishTime'},
    ],
    type_48: [
        {name:'PO个数',value:'onCount'},
        {name:'上工序下机数',value:'nearCount'},
        {name:'完成数量',value:'onCount'},
        {name:'完成日期',value:'onFinishTime'},
    ]
}

//异常列表
var errorData = {
    type_2: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'覆膜类型'},
            {name:'纸张尺寸'},
            {name:'异常类型'},
            {name:'异常数量'},
            {name:'异常备注'},
            {name:'异常图片'},
        ],
        keysArr:[
            {value:'subclassTypeName'},
            {value:'paperSize'},
            {value:'lossTypeName'},
            {value:'lossNum'},
            {value:'reason'},
        ]
    },
    type_4: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'上工序下机数'},
            {name:'大版尺寸'},
            {name:'工序类型'},
            {name:'异常类型'},
            {name:'异常数量'},
            {name:'异常备注'},
            {name:'异常图片'},
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'paperSize'},
            {value:'attributeName'},
            {value:'lossTypeName'},
            {value:'lossNum'},
            {value:'reason'},
        ]
    },
    type_5: {
        titleArr:[
            {name:''},
            {name:'PO号'},
            {name:'上工序下机数'},
            {name:'异常类型'},
            {name:'异常数量'},
            {name:'异常备注'},
            {name:'异常图片'},
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'lossTypeName'},
            {value:'lossNum'},
            {value:'reason'},
        ]
    },
    type_6: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'上工序下机数'},
            {name:'纸张尺寸'},
            {name:'异常类型'},
            {name:'异常数量'},
            {name:'异常备注'},
            {name:'异常图片'},
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'paperSize'},
            {value:'lossTypeName'},
            {value:'lossNum'},
            {value:'reason'},
        ]
    },
    type_10: {
        titleArr:[
            {name:''},
            {name:'PO号'},
            {name:'贴窗类型'},
            {name:'贴窗尺寸'},
            {name:'异常类型'},
            {name:'异常数量'},
            {name:'异常备注'},
            {name:'异常图片'},
        ],
        keysArr:[
            {value:'subclassTypeName'},
            {value:'paperSize'},
            {value:'lossTypeName'},
            {value:'lossNum'},
            {value:'reason'},
        ]
    },
    type_64: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'上工序下机数'},
            {name:'大版尺寸'},
            {name:'异常类型'},
            {name:'异常数量'},
            {name:'异常备注'},
            {name:'异常图片'},
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'paperSize'},
            {value:'lossTypeName'},
            {value:'lossNum'},
            {value:'reason'},
        ]
    },
    type_48: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'PO个数'},
            {name:'异常类型'},
            {name:'异常数量'},
            {name:'异常备注'},
            {name:'异常图片'},
        ],
        keysArr:[
            {value:'lossNum'},
            {value:'lossTypeName'},
            {value:'lossNum'},
            {value:'reason'},
        ]
    },
 
}

//待排产列表
var waitingData = {
    type_2: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'覆膜类型'},
            {name:'纸张尺寸'},
            {name:'印张数'},
            {name:'剩余晾干时间'},
            {name:'交货日期'}
          
        ],
        keysArr:[
            {value:'subclassTypeName'},
            {value:'paperSize'},
            {value:'nearCount'},
            {value:'dryingTimeLength'},
            {value:'deliveryDateTime'}
        ]
    },
    type_4: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'上工序下机数'},
            {name:'大版尺寸'},
            {name:'工序类型'},
            {name:'上工序名称'},
            {name:'剩余晾干时间'},
            {name:'交货日期'}
          
        ],
        keysArr:[//deliveryDateTime
            {value:'nearCount'},
            {value:'paperSize'},
            {value:'attributeName'},
            {value:'nearAttributeName'},
            {value:'dryingTimeLength'},
            {value:'deliveryDateTime'}
        ]
    },
    type_6: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'上工序下机数'},
            {name:'纸张尺寸'},
            {name:'烫金颜色'},
            {name:'上工序名称'},
            {name:'剩余晾干时间'},
            {name:'交货日期'}
          
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'paperSize'},
            {value:'attributeName'},
            {value:'nearAttributeName'},
            {value:'dryingTimeLength'},
            {value:'deliveryDateTime'}
        ]
    },
    type_64: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'上工序下机数'},
            {name:'大版尺寸'},
            {name:'丝印类型'},
            {name:'上工序名称'},
            {name:'剩余晾干时间'},
            {name:'交货日期'}
          
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'paperSize'},
            {value:'subclassTypeName'},
            {value:'nearAttributeName'},
            {value:'dryingTimeLength'},
            {value:'deliveryDateTime'}
        ]
    }
   
}

//待生产列表
var producedData = {
    type_2: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'覆膜类型'},
            {name:'纸张尺寸'},
            {name:'印刷下机数'},
            {name:'截止时间'},
            {name:'交货日期'}
        ],
        keysArr:[
            {value:'subclassTypeName'},
            {value:'paperSize'},
            {value:'nearCount'},
            {value:'deadtime'},
            {value:'deliveryDateTime'}
        ]
    },
    type_4: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'上工序下机数'},
            {name:'大版尺寸'},
            {name:'工序类型'},
            {name:'截止时间'},
            {name:'交货日期'}
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'paperSize'},
            {value:'attributeName'},
            {value:'deadtime'},
            {value:'deliveryDateTime'},
        ]
    },
    type_5: {
        titleArr:[
            {name:''},
            {name:'PO号'},
            {name:'盒型'},
            {name:'粘位'},
            {name:'展开尺寸'},
            {name:'订单量'},
            {name:'上工序数'},
            {name:'截止时间'},
            {name:'交货日期'}
        ],
        keysArr:[
            {value:'subclassTypeName'},
            {value:'stickyPositionName'},
            {value:'paperSize'},
            {value:'orderNum'},
            {value:'nearCount'},
            {value:'deadtime'},
            {value:'deliveryDateTime'},
        ]
    },
    type_6: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'上工序下机数'},
            {name:'订单数量'},
            {name:'纸张尺寸'},
            {name:'烫金颜色'},
            {name:'截止时间'},
            {name:'交货日期'}
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'orderNum'},
            {value:'paperSize'},
            {value:'subclassTypeName'},
            {value:'deadtime'},
            {value:'deliveryDateTime'},
        ]
    },
    type_10: {
        titleArr:[
            {name:''},
            {name:'PO号'},
            {name:'贴窗类型'},
            {name:'贴窗尺寸'},
            {name:'上工序下机数'},
            {name:'订单数量'},
            {name:'截止时间'},
            {name:'交货日期'}
        ],
        keysArr:[
            {value:'subclassTypeName'},
            {value:'paperSize'},
            {value:'nearCount'},
            {value:'orderNum'},
            {value:'deadtime'},
            {value:'deliveryDateTime'}
        ]
    },
    type_64: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'上工序下机数'},
            {name:'大版尺寸'},
            {name:'订单数量'},
            {name:'丝印类型'},
            {name:'截止时间'},
            {name:'交货日期'}
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'paperSize'},
            {value:'orderNum'},
            {value:'subclassTypeName'},
            {value:'deadtime'},
            {value:'deliveryDateTime'}
        ]
    },
    type_48: {
        titleArr:[
            {name:''},
            {name:'大版编号'},
            {name:'PO个数'},
            {name:'上工序下机数'},
            {name:'订单数量'},
            {name:'截止时间'}
        ],
        keysArr:[
            {value:'nearCount'},
            {value:'nearCount'},
            {value:'orderNum'},
            {value:'deadtime'},
        ]
    }
}

//当前订单页面头部左边框
var headerLeftData = {
    type_2: [
        {name:'大版编号：',value:'groupSn'},
        {name:'覆膜类型：',value:'subclassTypeName'},
        {name:'订单数量：',value:'orderNumStr'},
        {name:'纸张尺寸：',value:'paperSize'},
        {name:'印刷下机数：',value:'nearCount'},
        {name:'交货日期：',value:'deliveryDateTime'},
    ],
    type_4: [
        {name:'大版编号：',value:'groupSn'},
        {name:'订单数量：',value:'orderNumStr'},
        {name:'上工序下机数：',value:'nearCount'},
        {name:'大版尺寸：',value:'paperSize'},
        {name:'工序类型：',value:'otherCraftInfo'},
        {name:'交货日期：',value:'deliveryDateTime'},
    ],
    type_5: [
        {name:'PO号：',value:'poSns'},
        {name:'盒型：',value:'subclassTypeName'},
        {name:'展开尺寸：',value:'paperSize'},
        {name:'订单数量：',value:'orderNumStr'},
        {name:'上工序下机数：',value:'nearCount'},
        {name:'交货日期：',value:'deliveryDateTime'},
    ],
    type_6: [
        {name:'大版编号：',value:'groupSn'},
        {name:'上工序下机数：',value:'nearCount'},
        {name:'订单数量：',value:'orderNumStr'},
        {name:'纸张尺寸：',value:'paperSize'},
        {name:'烫金颜色：',value:'subclassTypeName'},
        {name:'交货日期：',value:'deliveryDateTime'},
    ],
    type_10: [
        {name:'PO号：',value:'poSns'},
        {name:'贴窗类型：',value:'subclassTypeName'},
        {name:'贴窗尺寸：',value:'paperSize'},
        {name:'上工序下机数：',value:'nearCount'},
        {name:'订单数量：',value:'orderNumStr'},
        {name:'交货日期：',value:'deliveryDateTime'},
    ],
    type_64: [
        {name:'大版编号：',value:'groupSn'},
        {name:'上工序下机数：',value:'nearCount'},
        {name:'订单数量：',value:'orderNumStr'},
        {name:'大版尺寸：',value:'paperSize'},
        {name:'丝印类型：',value:'subclassTypeName'},
        {name:'交货日期：',value:'deliveryDateTime'},
    ],
}

//当前订单页面下一订单
var nextOrderData = {
    type_2: [
        {value:'subclassTypeName'},
        {value:'paperSize'},
        {value:'nearCount'},
        {value:'deadTime'},
        {value:'deliveryDateTime'}
    ],
    type_4: [
        {value:'orderNum'},
        {value:'nearCount'},
        {value:'paperSize'},
        {value:'otherCraftInfo'},
        {value:'deadTime'},
        {value:'deliveryDateTime'}
    ],
    type_5: [
        {value:'subclassTypeName'},
        {value:'stickyPositionName'},
        {value:'paperSize'},
        {value:'orderNum'},
        {value:'nearCount'},
        {value:'deadTime'},
        {value:'deliveryDateTime'}
    ],
    type_6: [
        {value:'subclassTypeName'},
        {value:'paperSize'},
        {value:'orderNum'},
        {value:'nearCount'},
        {value:'deadTime'},
        {value:'deliveryDateTime'}
    ],
    type_10: [
        {value:'subclassTypeName'},
        {value:'paperSize'},
        {value:'nearCount'},
        {value:'orderNum'},
        {value:'deadTime'},
        {value:'deliveryDateTime'}
    ],
    type_64: [
        {value:'nearCount'},
        {value:'orderNum'},
        {value:'paperSize'},
        {value:'subclassTypeName'},
        {value:'deadTime'},
        {value:'deliveryDateTime'}
    ],
    type_48: [
        {value:'paperSize'},
        {value:'nearCount'},
        {value:'orderNum'},
        {value:'deadTime'}
    ]
}

//跳单原因选项
var jumpOptions = {
    type_2:[
        {value:'未晾干'}, 
        {value:'材料未到'},
        {value:'排产顺序不合理'},
        {value:'其他'}
    ],
    type_4:[
        {value:'未晾干'}, 
        {value:'材料未到'},
        {value:'排产顺序不合理'},
        {value:'其他'}
    ],
    type_5:[
        {value:'材料未到'},
        {value:'排产顺序不合理'},
        {value:'其他'}
    ],
    type_6:[
        {value:'未晾干'}, 
        {value:'材料未到'},
        {value:'排产顺序不合理'},
        {value:'其他'}
    ],
    type_10:[
        {value:'材料未到'},
        {value:'排产顺序不合理'},
        {value:'其他'}
    ],
    type_64:[
        {value:'材料未到'},
        {value:'排产顺序不合理'},
        {value:'其他'}
    ],
    type_48:[
        {value:'材料未到'},
        {value:'排产顺序不合理'},
        {value:'其他'}
    ]
    
}

const causeOptions = [
    {value:'设备不支持'}, 
    {value:'设备故障'},
    {value:'排产顺序不合理'},
    {value:'超过产能'},
    {value:'排产不均匀'},
    {value:'被抢单'},
    {value:'其他'}
]

//转单原因选项
var transferOptions = {
    type_2:causeOptions,
    type_4:causeOptions,
    type_5: [
        {value:'粘位标记错误'},
        {value:'设备不支持'}, 
        {value:'设备故障'},
        {value:'排产顺序不合理'},
        {value:'超过产能'},
        {value:'排产不均匀'},
        {value:'被抢单'},
      
        {value:'其他'}
    ],
    type_6: [
        {value:'设备不支持'}, 
        {value:'设备故障'},
        {value:'排产顺序不合理'},
        {value:'排产不均匀'},
        {value:'超过产能'},
        {value:'其他'}
    ],
    type_10:causeOptions,
    type_64: [
        {value:'设备不支持'}, 
        {value:'设备故障'},
        {value:'排产顺序不合理'},
        {value:'排产不均匀'},
        {value:'超过产能'},
        {value:'其他'}
    ],
    type_48:causeOptions,
}

//异常类型选项
var errorTypesArr = {
    type_2:[
        {name:'0',value:'覆错膜'},
        {name:'4',value:'原材料未到'},
        {name:'8',value:'印刷不合格'},
        {name:'9',value:'纸张粘花'},
        {name:'10',value:'找不到货'}
       
    ],
    type_4:[
        {name:'4',value:'原材料未到'},
        {name:'16',value:'刀模错误'},
    ],
    type_5:[
        {name:'5',value:'超线'},
        {name:'6',value:'喇叭口'},
        {name:'7',value:'上下线不齐'},
        {name:'13',value:'转手工'},
        {name:'14',value:'不用粘'}
       
    ],
    type_6:[
        {name:'11',value:'烫金板不合格'},
        {name:'12',value:'纸张变形'}
       
    ],
    type_10:[
        {name:'2',value:'数量不足'}
        
    ],
    type_64:[],
    type_48:[
        {name:'3',value:'除废打坏'},
        {name:'2',value:'数量不足'},
    ]
}







  
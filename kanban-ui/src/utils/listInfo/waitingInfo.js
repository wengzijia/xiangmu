import {getcraftTypes,disposeImgs} from "@/utils/utils";
/**
 * 
 * @param {返回处理后的数据} data
 * @returns 
 */
 function defaultFunc(data){
    if(data.code&&data.code != '000000') return data
    const listArr =   []
    if(data&&data.length > 0 ){
        data.forEach(item => {
          item.attributeName = getcraftTypes(item.attributeId)
          item.nearAttributeName = getcraftTypes(item.nearAttributeId)
          item.paperSize = item.paperLength&&item.paperWidth&&item.paperUnit ?  item.paperLength + '*' + item.paperWidth + item.paperUnit : '0*0mm'
          item.imgArr = disposeImgs(item)
          if(item.onFinishTime)item.onFinishTime = item.onFinishTime.substring(5,16)
          let deliveryDateTime ='暂无'
          if(item.deliveryDate)deliveryDateTime = item.deliveryDate.substring(5, 10)
          item.deliveryDateTime = deliveryDateTime
          if(item.subclassTypeName)item.subclassTypeName = item.subclassTypeName.replace(/,/g,'/')
          if( !item.deviceId || item.deviceId== 'null' ) listArr.push(item) //待排产数据都是不应该有设备id的，如果分配了设备id就不应该在待排产上出现
        })
    }
    return {list:listArr}
}
//待排产列表数据处理
var setWaitingInfo = {
    type_2:(arrList)=>{//覆膜数据处理
       return defaultFunc(arrList)
    },
    type_4:(arrList)=>{//模切数据处理
        return defaultFunc(arrList)
    },
    type_6:(arrList)=>{//烫金数据处理
        return defaultFunc(arrList)
    },
    type_64:(arrList)=>{//丝印数据处理
        return defaultFunc(arrList)
    },
}

export default setWaitingInfo
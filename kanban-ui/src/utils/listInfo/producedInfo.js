import {getcraftTypes,disposeImgs} from "@/utils/utils";
let attributeId_5 =['异型盒','左边','右边']

/**
 * 
 * @param {返回处理后的数据} data
 * @returns 
 */
 function defaultFunc(data,id){
  console.log('待生产列表：',data)
  if(data.code&&data.code != '000000') return data
  const todayList =data && data.todayProductList && data.todayProductList.length>0 ? data.todayProductList :[]//今日订单列表
  const tomorrowList = data&& data.tomorrowProductList&& data.tomorrowProductList.length > 0 ? data.tomorrowProductList : [] //明日订单列表
  
  if(todayList.length > 0  ){
    todayList.forEach(item=>{
      let str = item.deadline ? item.deadline.substring(5, 16) :''
      item.deadtime = str
      if(item.deliveryDate)item.deliveryDateTime = item.deliveryDate.substring(5, 10)
      item.attributeName = getcraftTypes(item.attributeId)
      //判断当前是否是强制排产的订单
      if(item.forcedSchedulingFlag==1&&item.currentAttName){
        item.nearCount = item.currentAttName 
        item.redFlag = true
      }
      item.paperSize = item.paperLength&&item.paperWidth&&item.paperUnit ?  item.paperLength + '*' + item.paperWidth + item.paperUnit : '0*0mm'
      item.imgArr = disposeImgs(item)
      if(item.subclassTypeName)item.subclassTypeName = item.subclassTypeName.replace(/,/g,'/')
      if(id==5){
        item.stickyPositionName = attributeId_5[item.stickyPosition] || ''
        item.delayIdentificationSign=item.delayIdentification==1?true:false
      }
      
    })
  }
  
  if(tomorrowList.length>0){
    tomorrowList.forEach(item => {
      let str = item.deadline.substring(5, 16)
      item.deadtime = str
      if(item.deliveryDate)item.deliveryDateTime = item.deliveryDate.substring(5, 10)
      item.attributeName = getcraftTypes(item.attributeId)
      item.paperSize = item.paperLength&&item.paperWidth&&item.paperUnit ?  item.paperLength + '*' + item.paperWidth + item.paperUnit : '0*0mm'
      item.imgArr = disposeImgs(item)
      if(item.subclassTypeName)item.subclassTypeName = item.subclassTypeName.replace(/,/g,'/')
      if(id==5){
        item.stickyPositionName = attributeId_5[item.stickyPosition] || ''
        item.delayIdentificationSign=item.delayIdentification==1?true:false
      }

    })
  }
  
  return {todayList,tomorrowList}
}

//异常列表数据处理
var setProducedInfo = {
  type_2:(data)=>{//覆膜数据处理
    return defaultFunc(data)
  },
  type_4:(data)=>{//模切数据处理
    return defaultFunc(data)
  },
  type_5:(data)=>{//粘盒数据处理
    return defaultFunc(data,5)
  },
  type_6:(data)=>{//烫金数据处理
    return defaultFunc(data)
  },
  type_10:(data)=>{//贴窗数据处理
   return defaultFunc(data)
  },
  type_48:(data)=>{//除废数据处理
    return defaultFunc(data)
  },
  type_64:(data)=>{//模切数据处理
    return defaultFunc(data)
  },
}
export default setProducedInfo
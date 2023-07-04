import {getcraftTypes,disposeImgs} from "@/utils/utils";
/**
 * 
 * @param {返回处理后的数据} data
 * @returns 
 */
 function defaultFunc(data){
    if(data.code&&data.code != '000000') return data
    if(data.length > 0  ){
        data.forEach(item => {
            item.attributeName = getcraftTypes(item.attributeId)
            item.paperSize = item.paperLength&&item.paperWidth&&item.paperUnit ?  item.paperLength + '*' + item.paperWidth + item.paperUnit : '0*0mm'
            item.imgArr = disposeImgs(item)
            item.onFinishTime = item.onFinishTime.substring(5,16)
            if(item.subclassTypeName)item.subclassTypeName = item.subclassTypeName.replace(/,/g,'/')
        })
    }
    return {list:data}
}
const setFinishedInfo = {
    type_2:(arrList)=>{//覆膜数据处理
        return defaultFunc(arrList)
    },
    type_4:(arrList)=>{//模切数据处理
        return defaultFunc(arrList)
    },
    type_5:(arrList)=>{//粘盒数据处理
        return defaultFunc(arrList)
    },
    type_6:(arrList)=>{//烫金数据处理
        return defaultFunc(arrList)
    },
    type_10:(arrList)=>{//贴窗数据处理
        return defaultFunc(arrList)
    },
    type_48:(arrList)=>{//除废数据处理
        return defaultFunc(arrList)
    },
    type_64:(arrList)=>{//丝印数据处理
        return defaultFunc(arrList)
    },
}
export default setFinishedInfo


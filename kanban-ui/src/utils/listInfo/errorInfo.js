import {getcraftTypes,disposeImgs} from "@/utils/utils";
import store from '@/store'
const errorTypeOPtions=['覆错膜','其他','数量不足','除废打坏','原材料未到','超线','喇叭口','上下线不齐','印刷不合格','纸张粘花','找不到货','烫金板不合格','纸张变形',
'转手工','不用粘','上工序下机数不对','刀模错误']

/**
 * 
 * @param {获取异常类型} type 
 * @returns 
 */
function getLossTypeName(type){
    if(type != '0' && !type) return '无'
    const arr = type.indexOf(',') ? type.split(',') : [type]
    let nameArr = []
    arr.forEach(item=>{
        nameArr.push(errorTypeOPtions[item])
    })
    return nameArr.toString()
}
/**
 * 
 * @param {返回处理后的数据} data
 * @returns 
 */
function defaultFunc(data){
    if(data.code&&data.code != '000000') return data
    const listArr = []
    if(data.length > 0  ){
        data.forEach(item => {
            item.attributeName = getcraftTypes(item.attributeId)
            const imgArr = item.photoPath1
            if(imgArr) item.photoPath1 = imgArr.indexOf(',') > -1 ? imgArr.split(',') : [imgArr]
            item.lossTypeName = getLossTypeName(item.attributeExceptionType) 
            item.lossNum = item.lossNum || '全部'
            item.imgArr = disposeImgs(item)
            item.paperSize = item.paperLength&&item.paperWidth&&item.paperUnit ?  item.paperLength + '*' + item.paperWidth + item.paperUnit : '0*0mm'
            if(item.subclassTypeName)item.subclassTypeName = item.subclassTypeName.replace(/,/g,'/')
            listArr.push(item)
        })
    }
    return {list:listArr}
}
//异常列表数据处理
var setErrorInfo = {
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

export default setErrorInfo

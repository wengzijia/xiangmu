import {post,get} from '@/utils/request';
//isLoading:true;表示当前接口调用的时候禁用正在加载的提示框

/**
 * 计价标准配置--计价公式列表查询
 */
 export const getValuationFormulaPage = (data) => {
    return post({url: `/api/mes/settle/formula/valuationFormula/getValuationFormulaPage`,data})
}

/**
 * 计价标准配置--计价公式启用或者禁用
 */
 export const updateExprStatus = (data) => {
    return post({url: `/api/mes/settle/formula/valuationFormula/updateExprStatus`,data})
}
/**
 * 计价标准配置--计价公式启用或者禁用时进行验证，是否有加工商正在使用当前公式
 */
 export const validExprStatus = (data) => {
    return post({url: `/api/mes/settle/formula/valuationFormula/validExprStatus`,data})
}




/**
 * 计价标准配置--加工商公式配置列表查询
 */
 export const getManufacturerValuationFormulaPage = (data) => {
    return post({url: `/api/mes/settle/formula/valuationFormulaManufacturer/getManufacturerValuationFormulaPage`,data})
}

/**
 * 计价标准配置--计价公式关联加工商时，通过工艺id选择当前加工商下面的产业园信息
 */
 export const getManufacturerWithAtt = (attributeId) => {
    return get({url: `/api/mes/courtship/manufacturer/getManufacturerWithAtt/${attributeId}`,isLoading:true})
}

/**
 * 计价标准配置--计价公式关联加工商时，选择或者删除加工商，需要判断当前删除或者选择的加工商是否关联过其他计价公式
 */
 export const getPreRelationManufacturerInfo = (data) => {
    return post({url: `/api/mes/settle/formula/valuationFormulaManufacturer/getPreRelationManufacturerInfo`,data})
}

/**
 * 计价标准配置--计价公式关联加工商
 */
 export const relationManufacturers = (data) => {
    return post({url: `/api/mes/settle/formula/valuationFormulaManufacturer/relationManufacturers`,data})
}














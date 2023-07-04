import {post,get} from '@/utils/request';
//isLoading:true;表示当前接口调用的时候禁用正在加载的提示框

/**
 * 添加加工商时，输入电话号码，需要对电话号码进行校验
 */
 export const checkAndGetByMobile = (mobile) => {
    return get({url: `/api/mes/courtship/manufacturer/checkAndGetByMobile/${mobile}`,isLoading:true})
}

/**
 * 通过id获取省市区数据
 */
export const getRegionListByPid = (id) => {
    return get({url: `/api/mes/courtship/park/region/getRegionListByPid/${id}`,isLoading:true})
}

/**
 * 获取分配的工艺--分四个维度--工艺类型：1--大版满版；2--大版局部；3--PO工艺；4--组合工艺
 */
export const getManufacturerAttList = (id) => {
    return get({url: `/api/mes/courtship/manufacturer/getManufacturerAttList`})
}
/**
 * 获取分配的工艺--不区分维度
 */
 export const getAttriList = (data) => {
    return post({url: `/api/mes/courtship/attribute/attList`,data,isLoading:true})
}

/**
 * 产业园列表查询
 */
 export const getIndustrialParkList = (data) => {
    return post({url: `/api/mes/courtship/park/industrialPark/getIndustrialParkList`,data,isLoading:true})
}

/**
 * 根据权限查询产业园表列表
 * @returns 
 */
export const getIndustrialParkListByAuthor =(data)=>{
    return post({url:'/api/mes/courtship/park/industrialPark/getIndustrialParkListByAuthor',data,isLoading:true})
}

/**
 * 新增加工商数据
 */
 export const saveManufacturerInfo = (data) => {
    return post({url: `/api/mes/courtship/manufacturer/saveManufacturerInfo`,data,isLoading:true})
}
/**
 * 编辑加工商数据
 */
 export const updateManufacturerInfo = (data) => {
    return post({url: `/api/mes/courtship/manufacturer/updateManufacturerInfo`,data})
}

/**
 * 加工商列表--只是查加工商名称数据
 */
 export const getAllManufacturerList = (data) => {
    // return post({url: `/api/mes/courtship/manufacturer/getAllManufacturerList`,data,isLoading:true}) 
    // return post({url: `/api/mes/settle/formula/billRule/getRuleManufacturerList`,data,isLoading:true})
    // /api/mes/courtship/manufacturer/getAllManufacturerListWithDisable
    return get({url: `/api/mes/courtship/manufacturer/getAllManufacturerListWithDisable`,data,isLoading:true})  
}

/**
 * 加工商列表查询--表格数据
 */
 export const getManufacturerPage = (data) => {
    return post({url: `/api/mes/courtship/manufacturer/getManufacturerPage`,data})
}

/**
 * 通过id获取当前加工商的详细信息
 */
 export const getManufacturerDetail = (manufacturerId) => {
    return get({url: `/api/mes/courtship/manufacturer/getManufacturerDetail/${manufacturerId}`})
}

/**
 * 根据产业园和工艺id获取加工商列表
 */
export const getAllManufacturerList2 = (data) => {
    return post({url: `/api/mes/courtship/manufacturer/getManufacturerList`,data,isLoading:true})  
}







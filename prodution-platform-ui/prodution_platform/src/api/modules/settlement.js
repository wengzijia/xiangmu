import { request } from '@/utils/request';


/* ==================结款单列表================== */
/**
 * 结款单列表
 * @param {*} data 
 * @returns 
 */
export function settlementList(data) {
    return request({
        //url: "/api/mes/settle/formula/valuationFormula/getValuationFormulaPage",
        url:'/api/mes/settle/bill/settlement/page',
        method: "Post",
        data
    });
};

/**
 * 启动结款=> 查询结款信息
 * @param {*} data 
 * @returns 
 */
export function getSettlementInfo(data) {
    return request({
        url: "/api/mes/settle/bill/settlement/getSettlementInfo",
        method: "Post",
        data
    });
}


/**
 * 启动结款=> 查询结款信息
 * @param {*} data 
 * @returns 
 */
export function getDetail(data) {
    return request({
        url: `/api/mes/settle/bill/settlement/getDetail/${data.id}`,
        method: "Post",
        data
    });
}

//

/**
 * 结款单详情=> 查询基本信息
 * @param {*} data 
 * @returns 
 */
export function getBaseInfo(data) {
    return request({
        url: `/api/mes/settle/bill/settlement/getBaseInfo/${data.id}`,
        method: "Post",
        data
    });
}



/**
 * 结款单详情=> 结款单明细=>提交审核
 * @param {*} data 
 * @returns 
 */
export function submitSettlement(data) {
    return request({
        url: "/api/mes/settle/bill/settlement/submitAudit",
        method: "Post",
        data
    });
}
/**
 * 结款单详情=> 结款单明细=>财务审核
 * @param {*} data 
 * @returns 
 */
export function auditSettlement(data) {
    return request({
        url: "/api/mes/settle/bill/settlement/audit",
        method: "Post",
        data
    });
}

/**
 * 结款单详情=> 结款单明细=>修改
 * @param {*} data 
 * @returns 
 */
export function updateSettlement(data) {
    return request({
        url: "/api/mes/settle/bill/settlement/update",
        method: "PUT",
        data
    });
}



/**
 * 结款单详情=> 结款单明细 =>账号列表
 * @param {*} data 
 * @returns 
 */
export function queryAccountList(data) {
    return request({
        url: "/api/mes/settle/formula/valuationFormula/getValuationFormulaPage",
        method: "Post",
        data
    });
};

/**
 * 结款单详情=> 结款单明细 =>切换账号
 * @param {*} data 
 * @returns 
 */
/* export function changeAccount(data) {
    return request({
        url: "/api/mes/settle/formula/valuationFormula/getValuationFormulaPage",
        method: "Post",
        data
    });
}; */
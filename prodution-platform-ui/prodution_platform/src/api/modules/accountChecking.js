import { request } from '@/utils/request';
import axios  from 'axios';

/* // for test
export function testApi(data) {
    return request({
        url: "/api/mes/settle/formula/valuationFormula/getValuationFormulaPage",
        method: "Post",
        data
    });
}; */


/* ==================月结对账列表================== */
/**
 * 月结对账列表
 * @param {*} data 
 * @returns 
 */
export function msList(data) {
    return request({
        url: "/api/mes/settle/bill/mainBill/page",
        method: "Post",
        data
    });
};

/**
 * 月结主账单详情
 * @param {*} data 
 * @returns 
 */
export function mainBillDetail(data) {
    return request({
        url: `/api/mes/settle/bill/mainBill/getDetail/${data.billId}`,
        method: "Post",
        data
    });
};



/**
 * 月结对账列表-导出
 * @param {*} data 
 * @returns 
 */
import { getToken } from '@/utils/commonApi'
import * as blobDownload from '@/utils/blobDownload'
export function msExport(data) {
    const token = getToken()  // || '0cc428fd1fcd4d7cbdb81fc802fd6723_sms'
    return new Promise((resolve,reject)=>{
        axios({
            url: `/api/mes/settle/bill/billDetail/exportBill`,
            baseURL: import.meta.env.VITE_APP_BASE_API,
            method: 'POST',
            data,
            headers: {'Content-Type':'application/json','token':token},
            responseType: 'arraybuffer'
           }).then( res => {
            if(blobDownload.isStream(res)) {
              let fileName = blobDownload.getFileName(res)
              blobDownload.download(res, fileName)
              resolve(res, fileName)
            } else if(res.headers['content-type'].includes('application/json')) {
              let enc = new TextDecoder('utf-8')
              resolve( JSON.parse(enc.decode(new Uint8Array(res.data))))
            }
          }).catch( err => {
            reject(err)
          })
    })
};

/**
 * 月结对账列表-导出-统计条数
 * @param {*} data 
 * @returns 
 */
export function msBillStatistics(data) {
    return request({
        url: `/api/mes/settle/bill/billDetail/statistQuantity/${data.billId}`,
        method: "Post",
        data
    });
};

/* ==================月结对账详情列表================== */

/**
 * 月结对账详情列表
 * @param {*} data 
 * @returns 
 */
export function msDetailList(data) {
    return request({
        url: "/api/mes/settle/bill/billDetail/page",
        //url: "/api/mes/settle/formula/valuationFormula/getValuationFormulaPage",
        method: "Post",
        data
    });
};
/**
 * 月结对账详情列表-添加备注
 * @param {*} data 
 * @returns 
 */
export function appendRemark(data) {
    return request({
        url: "/api/mes/settle/bill/billDetail/addRemark",
        method: "Post",
        data
    });
};

/**
 * 月结对账详情列表-启动核算前置状态检查
 * @param {*} data 
 * @returns 
 */
export function preBillAuditCheck(data) {
    return request({
        url:'/api/mes/settle/bill/billDetail/preBillAuditCheck',
        method: "Post",
        data
    });
};

/**
 * 月结对账详情列表-启动核算
 * @param {*} data 
 * @returns 
 */
export function startAccounting(data) {
    return request({
        url:'/api/mes/settle/bill/billDetail/billAudit',
        method: "Post",
        data
    });
};

/**
 * 月结对账详情列表-预结算检查
 * @param {*} data 
 * @returns 
 */
export function preSettlementCheck(data) {
    return request({
        url:'/api/mes/settle/bill/settlement/preSettlementCheck',
        method: "Post",
        data
    });
};

/**
 * 月结对账详情列表-启动结算
 * @param {*} data 
 * @returns 
 */
export function startSettlement(data) {
    return request({
        url:'/api/mes/settle/bill/settlement/initiateSettlement',
        method: "Post",
        data
    });
};


/**
 * 月结对账详情列表-导出
 * @param {*} data 
 * @returns 
 */
export function msDetailExport(data) {
    return request({
        url: `/api/mes/settle/bill/billDetail/exportExcel/${data.billId}`,
        method: "Post",
        data
    });
};

/* ==================月结对账详情列表=>查看================== */

/**
 * 结对账详情列表=>查看 - 审核
 * @param {*} data 
 * @returns 
 */
export function msDetail(data) {
    return request({
        url:`/api/mes/settle/bill/billDetail/getDetail`,
        method: "Post",
        data
    });
};

/**
 * 结对账详情列表=>查看 - 审核
 * @param {*} data 
 * @returns 
 */
export function auditAccounting(data) {
    return request({
        url:'/api/mes/settle/bill/billDetail/billAudit',
        method: "Post",
        data
    });
};

/**
 * 结对账详情列表=>查看 - 保存
 * @param {*} data 
 * @returns 
 */
export function saveBill(data) {
    return request({
        url:'/api/mes/settle/bill/billDetail/modifyBillDetail',
        method: "Post",
        data
    });
};


/*************************异常列表***************************/

// 修改记录列表
export function getOperatePage(data) {
    return request({
        url: "/api/mes/settle/bill/billDetail/getOperatePage",
        method: "Post",
        data
    });
};
// 提交审核
export function billAudit(data) {
    return request({
        url: "/api/mes/settle/bill/billDetail/billAudit",
        method: "Post",
        data
    });
};

// 确认结款上传凭证
export function uploadFile(data) {
    return request({
        url: "/api/mes/settle/file/uploadFile",
        method: "Post",
        data,
        headers: {
          "Content-Type": "multipart/form-data; charset=UTF-8",
        },
    });
};
// 确认结款提交凭证
export function confirmSettlement(data) {
    return request({
        url: "/api/mes/settle/bill/settlement/confirmSettlement",
        method: "Post",
        data
    });
};


import { request } from '@/utils/request';

// 获取加工商列表
export function getAllManufacturerList(data) {
    return request({
        // url: "/api/mes/courtship/manufacturer/getAllManufacturerList",//旧地址
        url: "/api/mes/settle/formula/billRule/getRuleManufacturerList",//新地址--2023-03-10
        method: "Post",
        data
    });
};

// 获取工艺列表
export function getAttList(data) {
    return request({
        url: "/api/mes/courtship/attribute/attList",
        method: "Post",
        data
    });
};

// 获取单价计费规则列表分页查询
export function getBillRulePage(data) {
    return request({
        url: "/api/mes/settle/formula/billRule/getBillRulePage",
        method: "Post",
        data
    });
};

// 获取单价计费规则表详细信息
export const getParkDetail = (data) => {
    return request({
        url: `/api/mes/settle/formula/billRule/getBillRuleDetail/${data.id}`,
        method: "Post"
    });
};

// 提交审核
export const submitAudit = (data) => {
    return request({
        url: `/api/mes/settle/formula/billRule/submitAudit`,
        method: "Post",
        data
    });
};

// 更新单价计费规则
export const updateBillRule = (data) => {
    return request({
        url: `/api/mes/settle/formula/billRule/updateBillRule`,
        method: "Post",
        data
    });
};

// 单价计费规则-新增版本
export const addBillRuleVersion = (data) => {
    return request({
        url: `/api/mes/settle/formula/billRule/addBillRuleVersion`,
        method: "Post",
        data
    });
};

// 查询单价计费规则审核记录
export const getAuditRecordList = (data) => {
    return request({
        url: `/api/mes/settle/formula/auditRecord/getAuditRecordList/${data.id}`,
        method: "Post",
        // params
    });
};

// 历史版本分页查询
export const getBillRuleHisPage = (data) => {
    return request({
        url: `/api/mes/settle/formula/billRule/getBillRuleHisPage`,
        method: "Post",
        data
    });
};

// 历史版本分页查询
export const getBillRuleHisPageHttp = (data) => {
    return request({
        url: `/api/mes/settle/formula/billRule/getBillRuleHisPage`,
        method: "Post",
        data
    });
};
// 历史版本分页查询
export const auditBillRuleHttp = (data) => {
    return request({
        url: `/api/mes/settle/formula/billRule/auditBillRule`,
        method: "Post",
        data
    });
};

// 获取单价计费规则列表分页查询--排序
export function getUnitBillRuleListHttp(data) {
    return request({
        url: "/api/mes/settle/formula/billRule/getBillRulePageForAudit",
        method: "Post",
        data
    });
};


// 查询账单单价计费规则表详细信息
export function getBillRuleDetailByOrder(data) {
    return request({
        url: "/api/mes/settle/formula/billRule/getBillRuleDetailByOrder",
        method: "Post",
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export default {
    getAllManufacturerList,
    getAttList,
    getBillRulePage,
    getBillRuleHisPageHttp,
    auditBillRuleHttp,
    getParkDetail,
    submitAudit,
    updateBillRule,
    addBillRuleVersion,
    getAuditRecordList,
    getBillRuleHisPage,
    getUnitBillRuleListHttp,
}
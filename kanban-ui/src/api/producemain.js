import api from '@/api/index.js';
import {post,get} from '@/utils/request';
export const getProduceMainDetail = (id) => {
    return get({url: api.produce.getMainData + id})
}
export const getDeviceList = (parameter) => {
    return post({url:  api.machine.machineList,data:parameter})
}
export const transformDevice = (parameter) => {
    return post({url: api.machine.transformDevice,data:parameter})
}
export const switchProductStatus = (parameter) => {
    return post({url:  api.machine.switchProductStatus,data:parameter})
}
export const recordExceptionInfo = (parameter) => {
    return post({url: api.error.recordExceptionInfo ,data:parameter})
}
export const fileUpload = (parameter) => {
    return post({url: api.pic.picUpload,data:parameter})
}
export const lockOrder = (parameter) => {
    return post({url:  api.produce.lockOrder,data:parameter})
}
export const skipOrder = (parameter) => {
    return post({url: api.produce.skipOrder,data:parameter})
}
export const lockOrSkipOrder = (parameter) => {
    return post({url: api.produce.lockOrSkipOrder,data:parameter})
}
export const checkProducingOrder = (id) => {
    return get({url: api.produce.checkLocked + id})
}
export const getPdfFile = (parameter) => {
    return get({url: api.pdf.getPdf})
}
export const recordReasons = (parameter) => {
    return post({url: api.record.recordReason,data:parameter})
}
export const recordTime = (parameter) => {
    return post({url: api.record.recordTime,data:parameter})
}
export const getValidBeiRelatedStatus = (parameter) => {
    return post({url:  api.produce.validBeiRelatedStatus,data:parameter})
}


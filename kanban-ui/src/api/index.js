import {lockOrSkipOrder} from "@/api/producemain";

export * from './user'
import { BASEURL } from '@/store/global-constant'

const api = {
    login:{
        getSms:BASEURL+'/sms/sendNoteLogin',
        verifySms:BASEURL+'/certifyFree/mesUser/LoginExamineVerificationCode',
        machineList:BASEURL+'/record/punch/getDevices',//获取加工商的机器列表
        logout:BASEURL+'/certifyFree/mesUser/loginOut',
        validDeviceStatus:BASEURL+'/record/punch/validDeviceStatus/',//登录的时候判断当前机器是否正常下班
        exportOrder:BASEURL+'/file/exportOrder',//导出文档
    },
    punchin:{
        // getOperators:BASEURL+'/record/punch/getOperators/',// 旧接口  获取设备人员列表 {deviceId}--通过机器id获取
        getOperators:BASEURL+'/record/punch/getOperatorsBySupplierId/',//新接口  获取设备人员列表 {supplierId}--通过加工商id获取
        punch:BASEURL+'/record/punch/confirm'  //上下班打卡服务：punchType-0 表示上班；1表示下班
    },
    produce:{
        getMainData:BASEURL+'/order/mesBwGroupOrder/getInfoByGroupId/',//通过mainId获取当前订单数据
        checkLocked:BASEURL+'/order/mesBwGroupOrder/getIngByDeviceId/',//通过deviceid获取当前订单数据
        lockOrder:BASEURL+'/order/mesBwGroupOrder/lockTheMainIdToDevice',
        skipOrder:BASEURL+'/order/mesBwGroupOrder/skipTheOrder',//跳单
        lockOrSkipOrder:BASEURL+'/order/mesBwGroupOrder/lockOrSkipFirstTobeScheduledOrder',
        validBeiRelatedStatus:BASEURL + '/order/mesBwGroupOrder/validBeiRelatedStatus'
    },
    machine:{
        machineList:BASEURL+'/record/punch/getDevices',
        transformDevice:BASEURL+'/order/mesBwGroupOrder/transformDevice',
        switchProductStatus:BASEURL+'/order/mesBwGroupOrder/switchProductStatus',
    },
    error:{
        recordExceptionInfo:BASEURL+'/record/mesMachiningProcessLoss/recordExceptionInfo',
    },
    pic:{
        picUpload:'/api/bw/alibaba/oss/uploadFile',

    },
    list:{
        inlineList:BASEURL+'/order/mesBwGroupOrder/tobeProductList',
        errorList:BASEURL+'/record/mesMachiningProcessLoss/getProcessLossList',
        tobeScheduledList:BASEURL+'/order/mesBwGroupOrder/tobeScheduledList',
        errorReproduce:BASEURL+'/record/mesMachiningProcessLoss/resumeProductFromException/',
        chooseTobeScheduledOrder:BASEURL+'/order/mesBwGroupOrder/chooseTobeScheduledOrder',
        getFinishList:BASEURL+'/order/mesBwGroupOrder/finishProductList',
    },
    pdf:{
        getPdf:BASEURL+'/file/downloadSOP',
    },
    record:{
        recordReason:BASEURL+'/record/operate/recordSkipReason',
        recordTime:BASEURL+'/record/operate/recordRenderTime'
    }
}
export default api;

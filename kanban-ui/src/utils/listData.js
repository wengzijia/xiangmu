import {getFinshedList,getProduceErrorList,getScheduledList,getProduceInlineList} from "@/api/producelist";
import setFinishedInfo from "@/utils/listInfo/finishedInfo"
import setErrorInfo from "@/utils/listInfo/errorInfo"
import setWaitingInfo from "@/utils/listInfo/waitingInfo"
import setProducedInfo from "@/utils/listInfo/producedInfo"
import store from '@/store'
import {Toast} from 'vant'

const attributeIdArr = [2,4,5,6,10,48,64]
/**
 * 已完成列表
 * @returns 返回处理后的数据
 */
export const finishedListInfo=(val)=>{
    let {attributeId,deviceOperatorId,currentDeviceId,searchValue} = store.state.device
    if(attributeIdArr.indexOf(attributeId) == -1) attributeId = 4
    Toast.loading('加载中')
    const params ={attId:attributeId,deviceOperatorId,deviceId:currentDeviceId}
    if(attributeId==5)params.no = val || searchValue
    return new Promise((resolve, reject) => {
        getFinshedList(params).then(res=>{
            Toast.clear()
            const {code,data,message} = res
            if(attributeId==5&&(code=='910020'||code=='999999'))  return resolve(setFinishedInfo['type_'+attributeId](res))
            if(code !== '000000') return Toast.fail(message || '接口异常。')
            const arrList = data || {}
            resolve(setFinishedInfo['type_'+attributeId](arrList))
        },err=>{
            Toast.fail(err.message || '接口异常。')
        })
    })
}


/**
 * 异常列表
 * @returns 返回处理后的数据
 */
export const errorListInfo=(val)=>{
    let {attributeId,currentDeviceId,searchValue} = store.state.device
    if(attributeIdArr.indexOf(attributeId) == -1) attributeId = 4
    Toast.loading('加载中')
    const params = {attId:attributeId,deviceId:currentDeviceId}
    if(attributeId==5)params.no = val ||  searchValue
    return new Promise((resolve, reject) => {
        getProduceErrorList(params).then(res=>{
            Toast.clear()
            const {code,data,message} = res
            if(attributeId==5&&(code=='910020'||code=='999999'))  return resolve(setFinishedInfo['type_'+attributeId](res))
            if(code !== '000000') return Toast.fail(message || '接口异常。')
            const arrList = data || []
            resolve(setErrorInfo['type_'+attributeId](arrList))
        },err=>{
            Toast.fail(err.message || '接口异常。')
        })
    })
}

/**
 * 待排产列表
 * @returns 返回处理后的数据
 */
 export const waitingListInfo=(flag,val)=>{
    let {attributeId,searchValue} = store.state.device
    if(attributeIdArr.indexOf(attributeId) == -1) attributeId = 4
    if(flag)Toast.loading('加载中')
    const params = {attId:attributeId}
    if(attributeId==5)params.no =val || searchValue
    return new Promise((resolve, reject) => {
        getScheduledList(params).then(res=>{
            Toast.clear()
            const {code,data,message} = res
            if(attributeId==5&&(code=='910020'||code=='999999')) return  resolve(setProducedInfo['type_'+attributeId](res))
            if(code !== '000000') return Toast.fail(message || '接口异常。')
            const arrList = data || []
            resolve(setWaitingInfo['type_'+attributeId](arrList))
        },err=>{
            Toast.fail(err.message || '接口异常。')
        })
    })

}


/**
 * 待生产列表
 * @returns 返回处理后的数据
 */
 export const producedListInfo=(flag,val)=>{
    let {attributeId,currentDeviceId,searchValue} = store.state.device
    if(attributeIdArr.indexOf(attributeId) == -1) attributeId = 4
    if(flag)Toast.loading('加载中')
    const params = {attId:attributeId,deviceId: currentDeviceId}
    if(attributeId==5)params.no =val || searchValue
    return new Promise((resolve, reject) => {
        getProduceInlineList(params).then(res=>{
            Toast.clear()
            const {code,data,message} = res
            if(attributeId==5&&(code=='910020'||code=='999999')) return  resolve(setProducedInfo['type_'+attributeId](res))
            if(code !== '000000') return Toast.fail(message || '接口异常。')
            const arrList = data || {}
            resolve(setProducedInfo['type_'+attributeId](arrList))
        },err=>{
            Toast.fail(err.message || '接口异常。')
        })
    })

}


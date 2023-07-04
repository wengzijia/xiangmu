import { numberFloor } from '@/utils/number'

/**
 * 计算差异率
 * @param {Number or  null} afterValue 
 * @param {Number or Zero} beforeValue 
 * @returns 
 */
export function calcVariance(afterValue, beforeValue) {
    /**
     * 差异率 = （改后 -初始）/ 初始 *100%
        特殊值：
        1） 初始为0 ，改后有值，那么 差异金额 = 改后, 差异率 = 100%
        2） 初始有值，改后为0 ，那么 差异金额 = 改后- 初始，差异率 = -100%
        3） 初始为0，改后为0 ，那么 差异金额 = 改后- 初始，差异率 = 0%
        4） 改后为空，那么 差异金额 =0，差异率为 0%
     */
    const afterNumber = Number.parseFloat(afterValue)
    const beforeNumber = Number.parseFloat(beforeValue || 0)

    let varianceNum = '0.00' //差异金额
    let varianceRate = '0.00' //差异率
    if (!Number.isNaN(afterNumber)) {
        varianceNum = (afterNumber - beforeNumber).toFixed(2)
        if (beforeValue == 0 && afterNumber!=0) {
            //1） 初始为0 ，改后有值，那么 差异金额 = 改后, 差异率 = 100%
            varianceRate = afterNumber>0 ? '100.00':'-100.00'
        } else if (beforeValue == 0 && afterNumber==0) {
            //3） 初始为0，改后为0 ，那么 差异金额 = 改后- 初始，差异率 = 0%
            varianceRate = '0.00' 
        } else {
            //2） 初始有值，改后为0 ，那么 差异金额 = 改后- 初始，差异率 = -100%
            varianceRate =numberFloor(varianceNum *100 / beforeNumber).toFixed(2)
        }
    }else{
        //4） 改后为空，那么 差异金额 =0，差异率为 0%
        varianceNum = '0.00' 
        varianceRate = '0.00' 
    }

    return { varianceNum, varianceRate }
}
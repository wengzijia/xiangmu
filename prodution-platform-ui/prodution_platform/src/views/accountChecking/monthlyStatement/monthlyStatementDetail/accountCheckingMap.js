import { defaultZero } from '@/utils/util.js'

//翻译列表字段（长（改后）、宽（改后））
const renderLengthAndwidth = function (row, key) {
    //长（改后）、宽（改后）：未修改时显示”--“，若只修改其中一个，另外一个展示”初始“值
    if (!row.afterLength && !row.afterWidth) {
        return '--'
    } else {
        return row[key] || '初始'
    }
}

/**
 * 根据工艺-控制列表中的动态字段
 * @param {*} attributeId 工艺
 */
export function dynamicFieldsForMonthlyStatement(attributeId){
    //公共字段：对账单号、账单日期、大版/PO号、总金额、加工费（初始）、加工费（修改）、差异金额、差异率、额外费用、最低消费、订单数量、良品数；
    // 个性字段：
    //覆膜：    单价（平方），长（初始），宽（初始），平方数（初始），长（改后），宽（改后），平方数（改后）
    //过油：    单价（元/张）、单价（元/平方）、长（初始）、宽（初始）、平方数（初始）、长（改后）、宽（改后）、平方数（改后）；
    //烫金：    单价（元/张）；
    //对裱卡纸: 同 过油
    //对裱坑纸: 同 过油
    //击凸:     单价（元/张）、调机费;
    //模切:     同 击凸
    //贴窗:     调机费、材料费、单价（元/个）、贴窗类型、长（初始）、宽（初始）、长（改后）、宽（改后）;
    //粘盒:     单价（元/个）;

    let yunitPricePF = {label:'单价（平方）',prop:'unitPrice',minWidth:120,render:(scope)=>defaultZero(scope.row.unitPrice)} 
    let yunitPriceYZ = {label:'单价（张）',prop:'unitPrice',minWidth:120,render:(scope)=>defaultZero(scope.row.unitPrice)} 
    let yunitPriceYG = {label:'单价（个）',prop:'unitPrice',minWidth:120,render:(scope)=>defaultZero(scope.row.unitPrice)} 
    let length = {label:'长（初始）',prop:'length',minWidth:120,render:(scope)=>defaultZero(scope.row.length,'--')} 
    let width = {label:'宽（初始）',prop:'width',minWidth:120,render:(scope)=>defaultZero(scope.row.width,'--')} 
    let squareNum = {label:'平方数（初始）',prop:'squareNum',minWidth:140}
    let afterLength = {label:'长（改后）',prop:'afterLength',minWidth:120,render:(scope)=>renderLengthAndwidth(scope.row, 'afterLength')} 
    let afterWidth = {label:'宽（改后）',prop:'afterWidth',minWidth:120,render:(scope)=>renderLengthAndwidth(scope.row, 'afterWidth')} 
    let afterSquareNum = {label:'平方数（改后）',prop:'afterSquareNum',minWidth:140,render:(scope)=>defaultZero(scope.row.afterSquareNum, '--')}
    let machineAdjustCost = {label:'调机费',prop:'unitPrice',minWidth:120,render:(scope)=>defaultZero(scope.row.unitPrice, '--')}
    let  materialCost = {label:'材料费',prop:'unitPrice',minWidth:120,render:(scope)=>defaultZero(scope.row.unitPrice, '--')}
    let attributeSubclassName = {label:'贴窗类型',prop:'attributeSubclassName',minWidth:120}
    const fieldsMap = {
        2:[yunitPricePF,length,width,squareNum,afterLength,afterWidth,afterSquareNum],//覆膜
        3:[yunitPriceYZ,yunitPricePF,length,width,squareNum,afterLength,afterWidth,afterSquareNum],//过油
        6:[yunitPriceYZ],//烫金
        11:[yunitPriceYZ,yunitPricePF,length,width,squareNum,afterLength,afterWidth,afterSquareNum],//对裱卡纸
        28:[yunitPriceYZ,yunitPricePF,length,width,squareNum,afterLength,afterWidth,afterSquareNum],//对裱坑纸
        7:[yunitPriceYZ,machineAdjustCost],//击凸
        4:[yunitPriceYZ,machineAdjustCost],//模切
        10:[machineAdjustCost,materialCost,yunitPriceYG,attributeSubclassName,length,width,afterLength,afterWidth],//贴窗
        5:[yunitPriceYG],//粘盒
    }
    return fieldsMap[attributeId]
}
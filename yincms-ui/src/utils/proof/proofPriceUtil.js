import { endWith, startWith, strEquals } from '@/utils/strUtil';
import { checkPantone, computeSize, getByGoodsId, getBySubBindId, getVoList } from '@/api/product/attrApi';
import { craftInputAttr, craftRadioAttr } from '@/utils/price/craftUtil';
import { commonViewList, cartCustomCommonList, pitSbhCommonList, tkksCommonItem, tagCommonList, ysslCommonItem, outerBoxAtrrValue, hardcoverBoxCommonList, evaSbhCommonList, hardcoverBoxCommonListOne } from './proofCommonListData';
import { addCartReq } from '@/api/cart/cartProofApi';
import store from '@/store';
import { getSubNav, getTopNav } from '@/utils/cateNavsUtil';
import { setDocumentTitle } from '@/utils/domUtil';
import { numFilter } from '@/utils/proof/proofNumFilter';
import { setdecimal } from '@/utils/utils';
let that = null;

/**
 * 初始化组件
 * @param that
 */
export function priceInitUtil(_that) {
  that = _that;
}

/**
 * 转换为groupVoList
 * @param list
 */
export function toGroupVoList() {
  that.formVoList.sort(listSort);
  that.groupVoList = [];
  const list = that.formVoList;
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let tempItem = null;
    if (item.miniZtAttrGroup.groupName == null) {
      item.miniZtAttrGroup.groupName = '';
    }
    for (let j = 0; j < that.groupVoList.length; j++) {
      let groupItem = that.groupVoList[j];

      if (item.miniZtAttrGroup.groupName === groupItem.name) {
        if (groupItem.sortOrder > item.miniZtAttrGroup.sortOrder) {
          groupItem.sortOrder = item.miniZtAttrGroup.sortOrder;
        }
        tempItem = groupItem;
        break;
      }
    }
    if (tempItem == null) {
      tempItem = {
        name: item.miniZtAttrGroup.groupName,
        sortOrder: item.miniZtAttrGroup.sortOrder,
        list: []
      };
      that.groupVoList.push(tempItem);
    }
    tempItem.list.push(item);
  }
}

/**
 * 复制分组属性(复选)
 */
export function addCopyGroupCk(parentAttrId) {
  let tempList = [];
  let maxSort = 0;
  let maxLevel = 0;
  for (let i = 0; i < that.formVoList.length; i++) {
    const groupItem = that.formVoList[i];
    if (parentAttrId === groupItem.miniZtAttrGroup.parentAttrId) {
      if (endWith(groupItem.miniZtAttrGroup.code, '_COPY')) {
        tempList = [];
        break;
      }
      if (groupItem.miniZtAttrGroup.sortOrder > maxSort) {
        maxSort = groupItem.miniZtAttrGroup.sortOrder;
        maxLevel = groupItem.miniZtAttrGroup.parentLevel;
      }
      const newItem = JSON.parse(JSON.stringify(groupItem));
      newItem.miniZtAttrGroup.code = newItem.miniZtAttrGroup.code + '_COPY';
      tempList.push(newItem);
    }
  }
  // 遍历复制的属性对复制属性进行修改
  for (let i = 0; i < tempList.length; i++) {
    tempList[i].copyId = tempList[i].miniZtAttrGroup.id;
    tempList[i].miniZtAttrGroup.sortOrder = maxSort + i + 1;
    tempList[i].miniZtAttrGroup.id = tempList[i].miniZtAttrGroup.id + that.copyIdStart;
    for (let j = 0; j < tempList[i].attrList.length; j++) {
      tempList[i].attrList[j].id = tempList[i].attrList[j].id + that.copyIdStart;
      tempList[i].attrList[j].groupId = tempList[i].miniZtAttrGroup.id;
      tempList[i].attrList[j].actualValue = tempList[i].attrList[j].actualValue.replace('1', '2');
    }
    tempList[i].copy = true;
    let isAddVo = true;
    for (let j = 0; j < that.voList.length; j++) {
      if (tempList[i].miniZtAttrGroup.id === that.voList[j].miniZtAttrGroup.id) {
        isAddVo = false;
      }
    }
    if (isAddVo) {
      that.voList.push(tempList[i]);
    }
    that.formVoList.push(tempList[i]);
  }
  that.formVoList.sort(listSort);
  toGroupVoList();
  that.priceValuation();
}

/**
 * 删除组(复选)
 * @param {Object} pid
 */
export function removeCopyGroupCk(param) {
  let pid = param.pid;
  let copyIndex = param.copyIndex;
  let parentAttrId = param.parentAttrId;
  let isCopy = param.isCopy;
  if (!isCopy) {
    for (let prop in that.formData.checkBoxSelectValues) {
      let array = that.formData.checkBoxSelectValues[prop];
      for (let i = 0; i < array.length; i++) {
        const attrId = array[i].split('_')[1];
        if (strEquals(attrId, parentAttrId)) {
          array.splice(i, 1);
        }
      }
    }
  }
  for (let i = 0; i < that.formVoList.length; i++) {
    if (that.formVoList[i].miniZtAttrGroup.parentAttrId === parentAttrId) {
      if (copyIndex) {
        if (isCopy && endWith(that.formVoList[i].miniZtAttrGroup.code, copyIndex + '_COPY')) {
          that.formVoList.splice(i, 1);
          i--;
        }
      } else {
        if (isCopy && endWith(that.formVoList[i].miniZtAttrGroup.code, '_COPY')) {
          that.formVoList.splice(i, 1);
          i--;
        } else if (!isCopy) {
          that.formVoList.splice(i, 1);
          i--;
        }
      }
    }
  }
  toGroupVoList();
  that.$set(that.formData, 'oldCheckBoxSelectVals', JSON.parse(JSON.stringify(that.formData.checkBoxSelectValues)));
  that.priceValuation();
}

/**
 * 复制分组属性(单选)
 */
export function addCopyGroupRd(groupId, max) {
  let tempList = [];
  let maxSort = 0;
  let maxLevel = 0;
  let copyNum = 0;
  let groupInfo = getGroupById(groupId);
  for (let i = 0; i < that.formVoList.length; i++) {
    const groupItem = that.formVoList[i];
    if (startWith(groupItem.miniZtAttrGroup.code, groupInfo.miniZtAttrGroup.code)) {
      copyNum++;
    }
  }
  if (copyNum >= max) {
    that.$message({ type: 'error', message: '最多增加' + max + '层' });
    return false;
  }
  for (let i = 0; i < that.formVoList.length; i++) {
    const groupItem = that.formVoList[i];
    if (groupId === groupItem.miniZtAttrGroup.id) {
      if (groupItem.miniZtAttrGroup.sortOrder > maxSort) {
        maxSort = groupItem.miniZtAttrGroup.sortOrder;
        maxLevel = groupItem.miniZtAttrGroup.parentLevel;
      }
      const newItem = JSON.parse(JSON.stringify(groupItem));
      newItem.miniZtAttrGroup.code = newItem.miniZtAttrGroup.code + '_' + copyNum + '_COPY';
      tempList.push(newItem);
    }
  }
  // 遍历复制的属性对复制属性进行修改
  for (let i = 0; i < tempList.length; i++) {
    tempList[i].copyId = tempList[i].miniZtAttrGroup.id;
    tempList[i].miniZtAttrGroup.sortOrder = maxSort + i + 1;
    tempList[i].miniZtAttrGroup.name = groupInfo.miniZtAttrGroup.actualValue + (copyNum + 1);
    tempList[i].miniZtAttrGroup.id = tempList[i].miniZtAttrGroup.id + that.copyIdStart + copyNum;
    for (let j = 0; j < tempList[i].attrList.length; j++) {
      tempList[i].attrList[j].id = tempList[i].attrList[j].id + that.copyIdStart + copyNum;
      tempList[i].attrList[j].groupId = tempList[i].miniZtAttrGroup.id;
      tempList[i].attrList[j].actualValue = tempList[i].attrList[j].actualValue.replace('1', copyNum + 1 + '');
    }
    tempList[i].copyIndex = copyNum;
    tempList[i].copy = true;

    let isAddVo = true;
    for (let j = 0; j < that.voList.length; j++) {
      if (tempList[i].miniZtAttrGroup.id === that.voList[j].miniZtAttrGroup.id) {
        isAddVo = false;
      }
    }
    if (isAddVo) {
      that.voList.push(tempList[i]);
    }
    that.formVoList.push(tempList[i]);
  }
  that.formVoList.sort(listSort);
  toGroupVoList();
  that.priceValuation();
}
/**
 * 删除组(单选)
 * @param {Object} pid
 */
export function removeCopyGroupRd(param) {
  let id = param.id;
  let isCopy = param.isCopy;
  if (!isCopy) {
    delete that.formData.radioSelectValues[id];
    for (let i = 0; i < that.formVoList.length; i++) {
      if (that.formVoList[i].copy && that.formVoList[i].copyId === id) {
        that.formVoList.splice(i, 1);
        i--;
      }
    }
  } else {
    for (let i = 0; i < that.formVoList.length; i++) {
      if (that.formVoList[i].miniZtAttrGroup.id === id) {
        that.formVoList.splice(i, 1);
        i--;
        break;
      }
    }
  }
  toGroupVoList();
  that.priceValuation();
}
/**
 * 公用数据修改
 * @returns {Promise<string>}
 */
export async function commonDataChange() {
  const formData = that.formData;
  let inputValues = formData.inputValues;
  let radioSelectValues = formData.radioSelectValues;
  let checkBoxSelectValues = formData.checkBoxSelectValues;
  const groupValueList = [];
  // 单选框
  for (let i = 0; i < that.formVoList.length; i++) {
    for (let var1 in radioSelectValues) {
      const splits = radioSelectValues[var1].split('_');
      const groupId = splits[0];
      const attrId = splits[1];
      const attrItem = getGroupAttr(attrId, groupId);
      if (strEquals(that.formVoList[i].miniZtAttrGroup.id, attrItem.groupId)) {
        if (attrItem.actualValue) {
          craftRadioAttr(attrItem, groupValueList);
          groupValueList.push(attrItem.actualValue);
        }
      }
    }
  }
  // 文本输入框
  for (let i = 0; i < that.formVoList.length; i++) {
    const item = that.formVoList[i];
    if (item.miniZtAttrGroup.groupType === 'input') {
      if (item.miniZtAttrGroup.name === '印刷数量') {
        continue;
      }
      let str = '';
      const isrn = craftInputAttr(item, groupValueList, inputValues);
      if (isrn === '-1') {
        return false;
      } else if (isrn === '0') {
        if (strEquals(item.miniZtAttrGroup.code, 'SP_ZDCC_ZDCC')) {
          str = item.miniZtAttrGroup.actualValue + '_';
        } else {
          if (item.miniZtAttrGroup.actualValue) {
            str = item.miniZtAttrGroup.actualValue + ':';
          } else {
            str = item.miniZtAttrGroup.name + ':';
          }
        }

        let isAdd = false;
        for (let var1 in inputValues) {
          if (inputValues[var1]) {
            const splits = var1.split('_');
            const groupId = splits[0];
            const attrId = splits[1];
            const attrItem = getGroupAttr(attrId, groupId);
            if (attrItem && strEquals(attrItem.groupId, item.miniZtAttrGroup.id)) {
              str += inputValues[var1] + '_';
              isAdd = true;
            }
          }
        }
        if (isAdd) {
          groupValueList.push(str.substring(0, str.length - 1));
        }
      }
    }
  }
  // 多选框
  for (let i = 0; i < that.formVoList.length; i++) {
    const item = that.formVoList[i];
    for (let var1 in checkBoxSelectValues) {
      for (let j = 0; j < checkBoxSelectValues[var1].length; j++) {
        const splits = checkBoxSelectValues[var1][j].split('_');
        const groupId = splits[0];
        const attrId = splits[1];
        const attrItem = getGroupAttr(attrId, groupId);
        if (strEquals(item.miniZtAttrGroup.id, attrItem.groupId)) {
          if (endWith(item.miniZtAttrGroup.code, '_SS_XZ') || endWith(item.miniZtAttrGroup.code, '_SSS_XZ')) {
            for (let k = 0; k < groupValueList.length; k++) {
              if (groupValueList[k].indexOf('印刷颜色:') !== -1) {
                groupValueList[k] += '_' + attrItem.actualValue;
                break;
              }
            }
          } else {
            if (attrItem.actualValue) {
              groupValueList.push(attrItem.actualValue);
            }
          }
        }
      }
    }
  }
  let strValue = '';
  for (let i = 0; i < groupValueList.length; i++) {
    strValue += groupValueList[i] + ';';
  }
  if (that.formData.yslx === 'dm') {
    strValue += await getPantoneStr(that.formData.dmys, '专色');
    if (that.formData.dmys.jybm && that.formData.dmys.jybmVal) {
      strValue += '加印白墨;';
    }
  } else {
    strValue += await getPantoneStr(that.formData.zmys, '正面专色');
    strValue += await getPantoneStr(that.formData.fmys, '反面专色');
    if (that.formData.zmys.jybm && that.formData.zmys.jybmVal) {
      strValue += '正面加印白墨;';
    }
    if (that.formData.fmys.jybm && that.formData.fmys.jybmVal) {
      strValue += '反面加印白墨;';
    }
  }
  if (that.formData.sgYsys.scCount > 0) {
    strValue += await getPantoneStr2(that.formData.sgYsys, '上盖印刷专色');
  }
  if (that.formData.xgYsys.scCount > 0) {
    strValue += await getPantoneStr2(that.formData.xgYsys, '下盖印刷专色');
  }
  // if (that.formData.bqys.scCount > 0) {
  //   strValue += await getPantoneStr(that.formData.bqys, '裱卡专色1');
  // }
  return strValue;
}
export function getOtherMsg() {
  if (strEquals(that.cateId, '13')) {
    that.formData.zcjgpb = '';
    let tempStr = 0;
    for (let i = 0; i < that.formVoList.length; i++) {
      for (let var1 in that.formData.radioSelectValues) {
        const splits = that.formData.radioSelectValues[var1].split('_');
        const groupId = splits[0];
        const attrId = splits[1];
        const groupItem = getGroupById(groupId);
        if (
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('印刷层材质') !== -1) ||
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('复合层材质') !== -1) ||
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('热封底层材质') !== -1)
        ) {
          const attrItem = getGroupAttr(attrId, groupId);
          if (strEquals(that.formVoList[i].miniZtAttrGroup.id, attrItem.groupId)) {
            if (attrItem.actualValue && attrItem.actualValue.indexOf(':')) {
              const str = attrItem.actualValue.split(':')[1];
              tempStr += parseFloat(str.split('_')[1].substring(0, str.split('_')[1].length - 1));
              that.formData.zcjgpb += ' ' + attrItem.actualValue.split(':')[1] + ' +';
            }
          }
        } else if (groupItem.miniZtAttrGroup.code === 'LL') {
          const attrItem = getGroupAttr(attrId, groupId);
          that.formData.zipval = attrItem.actualValue === '拉链:无' ? '0' : '1';
        }
      }
    }
    if (that.formData.zcjgpb) {
      that.formData.zcjgpb = that.formData.zcjgpb.substring(0, that.formData.zcjgpb.length - 1);
      that.formData.zcjgpb += '(' + tempStr + 'c)';
    }
  } else if (strEquals(that.cateId, '2')) {
    that.formData.zcjgpb = '';
    for (let i = 0; i < that.formVoList.length; i++) {
      for (let var1 in that.formData.radioSelectValues) {
        const splits = that.formData.radioSelectValues[var1].split('_');
        const groupId = splits[0];
        const attrId = splits[1];
        // const groupItem = getGroupById(groupId);
        const attrItem = getGroupAttr(attrId, groupId);
        if (endWith(attrItem.code, 'XZ')) {
          that.formData.zcjgpb = attrItem.actualValue;
        }
      }
    }
    console.log('that.formData.zcjgpb', that.formData.zcjgpb);
  } else if (strEquals(that.cateId, '70')) {
    that.formData.zcjgpb = '';
    let strCode = '';
    for (let i = 0; i < that.formVoList.length; i++) {
      for (let var1 in that.formData.radioSelectValues) {
        const splits = that.formData.radioSelectValues[var1].split('_');
        const groupId = splits[0];
        const attrId = splits[1];
        const groupItem = getGroupById(groupId);
        if (
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('坑纸类型') !== -1) ||
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('面纸材质') !== -1) ||
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('芯纸') !== -1) ||
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('里纸材质') !== -1) ||
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('外层芯纸') !== -1) ||
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('隔纸') !== -1) ||
          (groupItem.miniZtAttrGroup.name && groupItem.miniZtAttrGroup.name.indexOf('外层芯纸') !== -1)
        ) {
          const attrItem = getGroupAttr(attrId, groupId);
          if (strEquals(that.formVoList[i].miniZtAttrGroup.id, attrItem.groupId)) {
            if (attrItem.actualValue) {
              if (outerBoxAtrrValue[attrItem.actualValue]) {
                strCode += outerBoxAtrrValue[attrItem.actualValue];
              }
              that.formData.zcjgpb += ' ' + attrItem.actualValue + ' +';
            }
          }
        }
      }
    }
    if (that.formData.zcjgpb) {
      that.formData.zcjgpb = that.formData.zcjgpb.substring(0, that.formData.zcjgpb.length - 1) + '' + strCode;
    }
  }
}
/**
 * 计价方法
 */
export async function commonValuation() {
  let isComputeSize = isReInSize();
  let totalInCount = that.totalInCount;
  let inCount = 0;
  let sizeCount = 0;
  getOtherMsg();
  if (!that.formData.goodAttrVo.id) {
    return false;
  }
  for (const argumentsKey in that.commonFormData.inputValues) {
    let groupId = argumentsKey.split('_')[0];
    let attrId = argumentsKey.split('_')[1];
    let commonGroupItem = getCommonGroupItem(groupId);
    let commonAttrItem = getCommonAttrItem(groupId, attrId);
    if (strEquals(commonAttrItem?.code, 'goodAx') && parseInt(that.commonFormData.inputValues[argumentsKey]) == 0) {
      sizeCount++;
      totalInCount--;
    } else if (that.commonFormData.inputValues[argumentsKey] && parseInt(that.commonFormData.inputValues[argumentsKey]) > 0) {
      // if (parseInt(argumentsKey.split('_')[1]) <= 7) {
      //   sizeCount++;
      // }
      if (commonGroupItem && endWith(commonGroupItem.code, 'SIZE')) {
        sizeCount++;
        inCount++;
      } else if (commonGroupItem && endWith(commonGroupItem.code, 'YSSL')) {
        inCount++;
      } else if (commonGroupItem && endWith(commonGroupItem.code, 'TKKS')) {
        inCount++;
      }
      // inCount++;
    }
  }
  console.log('尺寸应输:' + that.sizeInCount, '尺寸实输:' + sizeCount, '总应输:' + totalInCount, '总实输:' + inCount, '是否计算尺寸:' + isComputeSize);
  if (that.sizeInCount === sizeCount) {
    for (let i = 0; i < that.commonVoList.length; i++) {
      if (that.commonVoList[i].code === 'YSSL') {
        const attrItem = that.commonVoList[i].attrList[0];
        that.priceFormData.yssl = that.commonFormData.inputValues[attrItem.groupId + '_' + attrItem.id];
      } else if (that.commonVoList[i].code === 'TKKS') {
        const attrItem = that.commonVoList[i].attrList[0];
        that.priceFormData.tkks = that.commonFormData.inputValues[attrItem.groupId + '_' + attrItem.id];
      }
    }
    const attrList = that.commonVoList[0].attrList;
    let resultData = { success: true };
    if (isComputeSize) {
      let reqParam = { id: that.formData.goodAttrVo.id };
      for (let j = 0; j < attrList.length; j++) {
        if (that.commonFormData.inputValues[attrList[j].groupId + '_' + attrList[j].id]) {
          reqParam[attrList[j].code] = that.commonFormData.inputValues[attrList[j].groupId + '_' + attrList[j].id];
        }
      }
      // 计算尺寸
      resultData = await computeSize(reqParam).then(res => {
        return res;
      });

      if (resultData.success) {
        if (strEquals(that.cateId, '3')) {
          that.$set(that.formData.goodSize, 'otherMap', resultData.data.otherMap);
          for (let i = 0; i < that.commonVoList.length; i++) {
            if (that.commonVoList[i].code === 'W_INPUT') {
              that.$set(that.commonFormData.inputValues, that.commonVoList[i].attrList[0].groupId + '_' + that.commonVoList[i].attrList[0].id, resultData.data.otherMap.outlong);
              that.$set(that.commonFormData.inputValues, that.commonVoList[i].attrList[1].groupId + '_' + that.commonVoList[i].attrList[1].id, resultData.data.otherMap.outwidth);
              that.$set(that.commonFormData.inputValues, that.commonVoList[i].attrList[2].groupId + '_' + that.commonVoList[i].attrList[2].id, resultData.data.otherMap.outheight);
            }
          }
        } else {
          that.$set(that.formData.goodSize, 'goodAl', resultData.data.goodAl);
          that.$set(that.formData.goodSize, 'goodAw', resultData.data.goodAw);
        }
      }
      let isCheck = checkMax(resultData.data.goodAl, resultData.data.goodAw);
      if (!isCheck) {
        return '';
      }
    }
    //卡盒  坑盒  自定义盒型 展开面积计算
    if ((strEquals(that.cateId, '1') && strEquals(that.subCateId, '24')) || (strEquals(that.cateId, '2') && strEquals(that.subCateId, '32'))) {
      let isCheck = checkMax(that.commonFormData.inputValues['1_1'], that.commonFormData.inputValues['1_2']);
      if (!isCheck) {
        return '';
      }
    }

    if (resultData.success) {
      if (inCount >= totalInCount) {
        let strVal = '';
        for (let i = 0; i < that.commonVoList.length; i++) {
          if (endWith(that.commonVoList[i].code, 'SIZE')) {
            if (that.commonVoList[i].actualValue) {
              strVal += that.commonVoList[i].actualValue + ':';
            } else {
              strVal += that.commonVoList[i].name + ':';
            }
            for (let j = 0; j < that.commonVoList[i].attrList.length; j++) {
              if (that.commonFormData.inputValues[that.commonVoList[i].attrList[j].groupId + '_' + that.commonVoList[i].attrList[j].id] != null) {
                strVal += setdecimal(that.commonFormData.inputValues[that.commonVoList[i].attrList[j].groupId + '_' + that.commonVoList[i].attrList[j].id]) + '_';
              }
            }
            strVal = strVal.substring(0, strVal.length - 1);
            strVal += ';';
          }
        }
        strVal = strVal.substring(0, strVal.length - 1);
        strVal += ';';
        return strVal;
      }
    }
  }
  return '';
}
/**
 * 获取潘通色
 */
export async function getPantoneStr2(obj, name) {
  if (obj.scCount > 0) {
    let isrn = true;
    await checkPantone({ list: obj.pantoneList }).then(res => {
      if (res.code === '980003') {
        obj.pantone = '';
        that.$message({ type: 'error', message: res.message });
        isrn = false;
      }
      return res;
    });
    if (isrn) {
      obj.pantone = '';
      for (let i = 0; i < obj.pantoneList.length; i++) {
        if (obj.pantoneList[i]) {
          obj.pantone += name + (i + 1) + ':' + obj.pantoneList[i] + ';';
        }
      }
    }
  } else {
    obj.pantone = '';
  }
  return obj.pantone;
}
/**
 * 获取潘通色
 */
export async function getPantoneStr(obj, name) {
  if (obj.scCount > 0) {
    let isrn = true;
    await checkPantone({ list: obj.pantoneList }).then(res => {
      if (res.code === '980003') {
        obj.pantone = '';
        that.$message({ type: 'error', message: res.message });
        isrn = false;
      }
      return res;
    });
    if (isrn) {
      obj.pantone = name + ':' + obj.scCount;
      for (let i = 0; i < obj.pantoneList.length; i++) {
        if (i > obj.scCount) {
          break;
        }
        if (obj.pantoneList[i]) {
          obj.pantone += ',' + obj.pantoneList[i];
        }
      }
      obj.pantone += ';';
    }
  } else {
    obj.pantone = '';
  }
  return obj.pantone;
}

/**
 * 重新设置输入文本框长度
 */
export function reSetSize() {
  let isSize = isReInSize();
  if (!isSize) {
    that.sizeInCount = 0;
    that.totalInCount = 0;
  } else {
    that.totalInCount = that.sizeInCount;
  }
  for (let i = 0; i < that.commonVoList.length; i++) {
    if (!isSize) {
      if (endWith(that.commonVoList[i].code, 'SIZE')) {
        that.sizeInCount += that.commonVoList[0].attrList.length;
        that.totalInCount += that.commonVoList[0].attrList.length;
      }
    }
    if (endWith(that.commonVoList[i].code, 'YSSL')) {
      that.totalInCount += 1;
    } else if (endWith(that.commonVoList[i].code, 'TKKS')) {
      that.totalInCount += 1;
    }
  }
}

/**
 * 搜索
 * @param that
 * @param pid
 * @returns {[]}
 */
export function getGroupSubItem(pid) {
  const _voList = that.voList;
  let list = [];
  let length = _voList.length - 1;
  for (let i = length; i >= 0; i--) {
    const formGroupItem = _voList[i];
    if (strEquals(formGroupItem.miniZtAttrGroup.pid, pid)) {
      list.push(formGroupItem);
      for (let j = length; j >= 0; j--) {
        const formGroupItem1 = _voList[j];
        if (formGroupItem1 != null && formGroupItem1.miniZtAttrGroup != null && formGroupItem1.miniZtAttrGroup.pid === formGroupItem.miniZtAttrGroup.id) {
          const subList = getGroupSubItem(formGroupItem.miniZtAttrGroup.id);
          list = list.concat(subList);
          break;
        }
      }
    }
  }
  return list;
}
/**
 * 搜索
 * @param that
 * @param pid
 * @returns {[]}
 */
export function getGroupById(id) {
  const _voList = that.voList;
  for (let i = 0; i < _voList.length; i++) {
    const formGroupItem = _voList[i];
    if (strEquals(formGroupItem.miniZtAttrGroup.id, id)) {
      return formGroupItem;
    }
  }
  return null;
}
/**
 * 按照属性id获取
 * @param attrId
 * @param groupId
 * @returns {*}
 */
export function getGroupAttr(attrId, groupId) {
  const item = getGroupById(groupId);
  if (item) {
    for (let inx in item.attrList) {
      if (strEquals(item.attrList[inx].id, attrId)) {
        return item.attrList[inx];
      }
    }
  }
}
/**
 * 删除组
 * @param {Object} pid
 */
export function deleteGroupItem(pid) {
  const list = getGroupSubItem(pid);
  for (var i = 0; i < list.length; i++) {
    for (var j = 0; j < that.formVoList.length; j++) {
      if (strEquals(list[i].miniZtAttrGroup.id, that.formVoList[j].miniZtAttrGroup.id)) {
        //  清空旧选中的多选内容,防止删除之后再次回显选中的时候无法显示依赖属性组
        if (that.formData.oldCheckBoxSelectVals[list[i].miniZtAttrGroup.id]) {
          that.$set(that.formData.oldCheckBoxSelectVals, list[i].miniZtAttrGroup.id, null);
        }
        that.formVoList.splice(j, 1);
        break;
      }
    }
  }
  toGroupVoList();
}
/**
 * 复选框选择
 */
export function checkboxSelect(param) {
  let event = param.event;
  let code = param.code;
  let id = 0;
  let isAdd = true;
  if (that.formData.oldCheckBoxSelectVals[code] != null) {
    const diff = that.formData.checkBoxSelectValues[code].concat(that.formData.oldCheckBoxSelectVals[code]).filter((cur, i, arr) => {
      return arr.indexOf(cur) === arr.lastIndexOf(cur);
    });
    id = diff[0];
    if (that.formData.checkBoxSelectValues[code].length <= that.formData.oldCheckBoxSelectVals[code].length) {
      // 减少
      isAdd = false;
    }
  } else {
    id = that.formData.checkBoxSelectValues[code][0];
  }
  if (!id) {
    console.log('大萨达是的撒');
    return false;
  }
  const splits = id.split('_');
  const groupId = splits[0];
  const attrId = splits[1];
  const groupItem = getGroupById(groupId);
  const maxSelect = groupItem.miniZtAttrGroup.maxSelect;
  const minSelect = groupItem.miniZtAttrGroup.minSelect;
  if (maxSelect && minSelect) {
    if (that.formData.checkBoxSelectValues[code].length > maxSelect) {
      that.$message({ type: 'error', message: '最多可选择' + maxSelect + '个，如要继续，请取消当前选中的某一个选项' });
      that.$set(that.formData, 'checkBoxSelectValues', JSON.parse(JSON.stringify(that.formData.oldCheckBoxSelectVals)));
      return false;
    } else if (that.formData.checkBoxSelectValues[code].length < minSelect) {
      that.$set(that.formData, 'checkBoxSelectValues', JSON.parse(JSON.stringify(that.formData.oldCheckBoxSelectVals)));
      that.$message({ type: 'error', message: '请完善印刷颜色信息' });
      return false;
    }
  } else if (maxSelect) {
    if (that.formData.checkBoxSelectValues[code].length > maxSelect) {
      that.$set(that.formData, 'checkBoxSelectValues', JSON.parse(JSON.stringify(that.formData.oldCheckBoxSelectVals)));
      that.$message({ type: 'error', message: '最多可选择' + maxSelect + '个，如要继续，请取消当前选中的某一个选项' });
      return false;
    }
  }
  that.$set(that.formData, 'oldCheckBoxSelectVals', JSON.parse(JSON.stringify(that.formData.checkBoxSelectValues)));
  if (isAdd) {
    const attrItem = getGroupAttr(attrId, groupId);
    if (endWith(attrItem.code, '_TJ')) {
      that.$message({ type: 'warning', message: '请务必选择烫金颜色及填写烫金尺寸' });
    } else if (endWith(attrItem.code, '_JT')) {
      that.$message({ type: 'warning', message: '请务必填写击凸尺寸' });
    } else if (endWith(attrItem.code, '_JBUV')) {
      that.$message({ type: 'warning', message: '请务必填写局部UV尺寸' });
    } else if (endWith(attrItem.code, '_JA')) {
      that.$message({ type: 'warning', message: '请务必填写击凹尺寸' });
    } else if (endWith(attrItem.code, '_TC')) {
      that.$message({ type: 'warning', message: '请务必填写贴窗尺寸及选择窗口离折线距离' });
    } else if (endWith(attrItem.code, '_BK')) {
      // isAddBK改为true,用于组件内判断选择了裱卡，用于取消和禁用双面印刷和背面处理的选中
      if (that.$refs['ProofMajor']) that.$set(that.$refs['ProofMajor'], 'isAddBK', true);
      that.$message({ type: 'warning', message: '请务必完善裱卡信息' });
    } else if (endWith(attrItem.code, '_YW')) {
      that.$message({ type: 'warning', message: '请务必完善压纹信息' });
    } else if (endWith(attrItem.code, '_DK')) {
      that.$message({ type: 'warning', message: '请务必完善吊扣信息' });
    } else if (endWith(attrItem.code, 'ZJGY_CPJA')) {
      that.$message({ type: 'warning', message: '请务必填写成品击凹尺寸' });
    }
    loadDefaultGroup(attrItem.groupId, attrItem.id);
  } else {
    // 判断是否是增加工艺的选择修改
    if (that.$refs['ProofMajor'] && that.$refs['ProofMajor'].isAddBK && endWith(groupItem.miniZtAttrGroup.code, 'TJGY')) {
      // 当前没有选中，吧双面印刷和背面处理的禁止选中状态取消
      if (event.length == 0) {
        that.$set(that.$refs['ProofMajor'], 'isAddBK', false);
      } else {
        // 查找选择的值里面有没有裱卡，如果裱卡被取消选中，就吧双面印刷和背面处理的禁止选中状态取消
        let id = that.formData.checkBoxSelectValues[code].find(e => {
          let attrItem = groupItem.attrList.find(s => e === s.groupId + '_' + s.id);
          return endWith(attrItem.code, '_BK');
        });
        that.$set(that.$refs['ProofMajor'], 'isAddBK', id ? true : false);
      }
    }
    removeSubGroup(attrId);
  }
  that.formVoList.sort(listSort);
  toGroupVoList();
  that.priceValuation();
}
/**
 * 单选内容选择事件
 * @param {Object} event
 */
export function radioSelect(event) {
  const splits = event.split('_');
  const groupId = splits[0];
  const attrId = splits[1];
  const attrItem = getGroupAttr(attrId, groupId);
  if (strEquals(that.cateId, '70')) {
    if (strEquals(attrItem.code, 'DYLX_DCPY_YSYS_W')) {
      that.formData.ysm.scCount = 0;
    } else if (strEquals(attrItem.code, 'DYLX_DCPY_YSYS_SS') || strEquals(attrItem.code, 'DYLX_DCPY_YSYS_DS')) {
      that.formData.ysm.scCount = 1;
    }
  }
  that.formData.yslx = attrItem.code.indexOf('SMYS') > -1 ? 'sm' : 'dm';
  // console.log('yslx',attrItem.code.indexOf('SMYS'));
  // console.log('yslx',that.formData.yslx);
  const list = getGroupSubItem(attrItem.groupId);
  for (let i = 0; i < list.length; i++) {
    delete that.formData.radioSelectValues[list[i].miniZtAttrGroup.id];
  }
  deleteGroupItem(attrItem.groupId);
  loadDefaultGroup(attrItem.groupId, attrItem.id);
  that.formVoList.sort(listSort);
  toGroupVoList();
  that.priceValuation();
  let isShow = false;
  for (let p in that.formData.radioSelectValues) {
    const selectValue = that.formData.radioSelectValues[p + ''];
    const groupId = selectValue.split('_')[0];
    const attrId = selectValue.split('_')[1];
    const attrItem = getGroupAttr(attrId, groupId);
    // strEquals(attrItem.code, 'ZZCZ_NPZ') ||
    if (
      strEquals(attrItem.code, 'ZZCZ_JYKZL') ||
      strEquals(attrItem.code, 'ZZCZ_NPZL') ||
      strEquals(attrItem.code, 'ZZCZ_TZZL') ||
      strEquals(attrItem.code, 'ZZCZ_YKZ') ||
      strEquals(attrItem.code, 'ZZCZ_JKZ') ||
      strEquals(attrItem.code, 'ZZCZ_JYKZ') ||
      strEquals(attrItem.code, 'ZZCZ_QNPZ') ||
      strEquals(attrItem.code, 'MZCZ_YKZ') ||
      strEquals(attrItem.code, 'MZCZ_JKZ') ||
      strEquals(attrItem.code, 'MZCZ_NPZ') ||
      strEquals(attrItem.code, 'DYLX_DCPY') ||
      strEquals(attrItem.code, 'DYLX_DTGY')
    ) {
      isShow = true;
      break;
    }
  }
  that.formData.dmys.jybm = isShow;
  that.formData.zmys.jybm = isShow;
  that.formData.fmys.jybm = isShow;
  if (endWith(attrItem.code, '_DJGBY')) {
    isShow = false;
    that.formData.dmys.jybm = isShow;
    that.formData.zmys.jybm = isShow;
    that.formData.fmys.jybm = isShow;
  }
  for (let p in that.formData.radioSelectValues) {
    const selectValue = that.formData.radioSelectValues[p + ''];
    const groupId = selectValue.split('_')[0];
    const attrId = selectValue.split('_')[1];
    const attrItem = getGroupAttr(attrId, groupId);
    if (that.cateId == 1) {
      if (attrItem.name === '粉灰纸') {
        that.formData.dmys.jybm && that.$set(that.formData.dmys, 'jybm', false);
        break;
      }
      if (attrItem.name === '单铜纸' || attrItem.name === '双铜纸' || attrItem.name === '白珠光纸' || attrItem.code === '粉灰纸') {
        that.formData.dmys.jybm && that.$set(that.formData.dmys, 'jybm', false);
        that.formData.zmys.jybm && that.$set(that.formData.zmys, 'jybm', false);
        that.formData.fmys.jybm && that.$set(that.formData.fmys, 'jybm', false);
        break;
      }
    }
    if (that.cateId == 2) {
      if (attrItem.name === '金银卡纸') {
        that.$set(that.formData.dmys, 'jybm', true);
        break;
      }
    }
    if (that.cateId == 6) {
      if (attrItem.name === '单铜纸' || attrItem.name === '双铜纸') {
        that.formData.dmys.jybm && that.$set(that.formData.dmys, 'jybm', false);
        that.formData.zmys.jybm && that.$set(that.formData.zmys, 'jybm', false);
        that.formData.fmys.jybm && that.$set(that.formData.fmys, 'jybm', false);
        break;
      }
    }
  }
}
/**
 * 单选内容选择事件
 * @param {Object} event
 */
export function selectSelect(event) {
  const splits = event.split('_');
  const groupId = splits[0];
  const attrId = splits[1];
  const attrItem = getGroupAttr(attrId, groupId);
  const list = getGroupSubItem(attrItem.groupId);
  for (let i = 0; i < list.length; i++) {
    delete that.formData.selectSelectValues[list[i].miniZtAttrGroup.id];
  }
  deleteGroupItem(attrItem.groupId);
  loadDefaultGroup(attrItem.groupId, attrItem.id);
  that.formVoList.sort(listSort);
  toGroupVoList();
  that.priceValuation();
}
/**
 * 删除关联分组
 */
export function removeSubGroup(attrId) {
  for (let i = that.formVoList.length - 1; i >= 0; i--) {
    let formVoItem = that.formVoList[i];
    if (strEquals(formVoItem.miniZtAttrGroup.parentAttrId, attrId)) {
      for (let j = 0; j < formVoItem.attrList.length; j++) {
        removeSubGroup(formVoItem.attrList[j].id);
      }
      that.formVoList.splice(i, 1);
    }
  }
  toGroupVoList();
}
/**
 * 加载分组
 * @param {Object} pid
 */
export function loadFormGroup(pid) {
  for (let i = 0; i < that.voList.length; i++) {
    const groupItem = that.voList[i];
    if (strEquals(groupItem.miniZtAttrGroup.pid, pid)) {
      if (strEquals(groupItem.miniZtAttrGroup.groupType, 'radio')) {
        if (groupItem.miniZtAttrGroup.required && groupItem.attrList != null && groupItem.attrList.length > 0) {
          let attr = getDefaultAttr(groupItem.attrList, groupItem.miniZtAttrGroup.defaultSelect, true);
          loadDefaultGroup(attr.groupId, attr.id);
          that.$set(that.formData.radioSelectValues, groupItem.miniZtAttrGroup.id, groupItem.miniZtAttrGroup.id + '_' + attr.id);
        }
      } else if (strEquals(groupItem.miniZtAttrGroup.groupType, 'checkbox')) {
        getCheckboxDefault(groupItem);
      } else if (strEquals(groupItem.miniZtAttrGroup.groupType, 'select')) {
        let attr = getDefaultAttr(groupItem.attrList, groupItem.miniZtAttrGroup.defaultSelect, true);
        if (attr === null) {
          attr = groupItem.attrList[0];
        }
        loadDefaultGroup(attr.groupId, attr.id);
        that.$set(that.formData.selectSelectValues, groupItem.miniZtAttrGroup.id, groupItem.miniZtAttrGroup.id + '_' + attr.id);
      } else if (strEquals(groupItem.miniZtAttrGroup.groupType, 'input')) {
        const attrList = groupItem.attrList;
        if (attrList.length > 0) {
          for (let j = 0; j < attrList.length; j++) {
            if (attrList[j].defaultValue) {
              that.$set(that.formData.inputValues, attrList[j].groupId + '_' + attrList[j].id, attrList[j].defaultValue);
            }
          }
        }
      }
      that.formVoList.push(groupItem);
    }
  }
  toGroupVoList();
}
/**
 * 加载默认的分组
 * @param {Object} pid
 * @param {Object} parentAttrId
 */
export function loadDefaultGroup(pid, parentAttrId) {
  for (let i = 0; i < that.voList.length; i++) {
    const groupItem = that.voList[i];
    if (strEquals(groupItem.miniZtAttrGroup.pid, pid) && strEquals(parentAttrId, groupItem.miniZtAttrGroup.parentAttrId)) {
      if (groupItem.attrList != null && groupItem.attrList.length > 0) {
        that.formVoList.push(groupItem);
        if (strEquals(groupItem.miniZtAttrGroup.groupType, 'radio')) {
          let attr = getDefaultAttr(groupItem.attrList, groupItem.miniZtAttrGroup.defaultSelect, true);
          that.$set(that.formData.radioSelectValues, groupItem.miniZtAttrGroup.id, groupItem.miniZtAttrGroup.id + '_' + attr.id);
          loadDefaultGroup(attr.groupId, attr.id);
        } else if (strEquals(groupItem.miniZtAttrGroup.groupType, 'select')) {
          let attr = getDefaultAttr(groupItem.attrList, groupItem.miniZtAttrGroup.defaultSelect, true);
          that.$set(that.formData.radioSelectValues, groupItem.miniZtAttrGroup.id, groupItem.miniZtAttrGroup.id + '_' + attr.id);
          loadDefaultGroup(attr.groupId, attr.id);
        } else if (strEquals(groupItem.miniZtAttrGroup.groupType, 'checkbox')) {
          getCheckboxDefault(groupItem);
        } else if (strEquals(groupItem.miniZtAttrGroup.groupType, 'input')) {
          const attrList = groupItem.attrList;
          if (attrList.length > 0) {
            for (let j = 0; j < attrList.length; j++) {
              if (attrList[j].defaultValue) {
                that.$set(that.formData.inputValues, attrList[j].groupId + '_' + attrList[j].id, attrList[j].defaultValue);
              }
            }
          }
        }
      }
    }
  }
  toGroupVoList();
}
export function getCheckboxDefault(groupItem) {
  that.$set(that.formData.checkBoxSelectValues, groupItem.miniZtAttrGroup.id, []);
  if (groupItem.miniZtAttrGroup.defaultSelect) {
    let defaultIds = groupItem.miniZtAttrGroup.defaultSelect.split(',');
    if (defaultIds.length > 0) {
      let selectList = [];
      for (let j = 0; j < defaultIds.length; j++) {
        if (defaultIds[j]) {
          let attr = getDefaultAttr(groupItem.attrList, defaultIds[j], false);
          if (attr) {
            selectList.push(groupItem.miniZtAttrGroup.id + '_' + attr.id);
            loadDefaultGroup(attr.groupId, attr.id);
          }
        }
      }
      that.$set(that.formData.checkBoxSelectValues, groupItem.miniZtAttrGroup.id, selectList);
    }
  }
}
export function getDefaultAttr(attrList, defaultSelect, isDefault) {
  let attr = null;
  if (defaultSelect) {
    for (let j = 0; j < attrList.length; j++) {
      const tempAttr = attrList[j];
      if (strEquals(tempAttr.id, defaultSelect)) {
        attr = tempAttr;
        return attr;
      }
    }
  }
  if (isDefault && attrList.length > 0) {
    attr = attrList[0];
  }
  return attr;
}
/**
 * 数值修改
 * @param val
 * @param data
 * @returns {boolean}
 */
export function numberChange(val, data, type) {
  let isYssl = false;
  if (data.dataKey) {
    let groupId = data.dataKey.split('_')[0];
    let attrId = data.dataKey.split('_')[1];
    let groupItem = getCommonGroupItem(groupId);
    if (groupItem.code === 'YSSL') {
      isYssl = true;
    }
  }
  if (isYssl) {
    if (!isNaN(parseFloat(data.data[data.dataKey]))) {
      if (data.max && parseInt(data.data[data.dataKey]) > data.max) {
        that.$message({ type: 'error', message: '最大数量不能超过' + data.max + '个' });
        that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
        data.data[data.dataKey] = '';
        return false;
      } else if (data.min && parseInt(data.data[data.dataKey]) < data.min) {
        that.$message({ type: 'error', message: '最小数量不能超过' + data.min + '个' });
        that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
        data.data[data.dataKey] = '';
        return false;
      }
      that.priceValuation();
    } else {
      that.$message({ type: 'error', message: '输入内容不正确,请重新输入' });
      that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      data.data[data.dataKey] = '';
      return false;
    }
  } else {
    if (!isNaN(parseFloat(data.data[data.dataKey]))) {
      if (strEquals(that.subCateId, '36') || strEquals(that.subCateId, '37') || strEquals(that.subCateId, '38')) {
        if (data.max && parseInt(data.data[data.dataKey]) > data.max) {
          that.$message({ type: 'error', message: '已经超出' + data.max + 'mm' });
          that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
          data.data[data.dataKey] = '';
          return false;
        } else if (data.min && parseInt(data.data[data.dataKey]) < data.min) {
          that.$message({ type: 'error', message: '已经小于' + data.min + 'mm' });
          that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
          data.data[data.dataKey] = '';
          return false;
        }
      }
      // if (data.max && parseInt(data.data[data.dataKey]) > data.max) {
      //   that.$message({ type: 'error', message: data.name + '超出' + data.max + 'mm' });
      //   that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      //   data.data[data.dataKey] = '';
      //   return false;
      // } else if (data.min && parseInt(data.data[data.dataKey]) < data.min) {
      //   that.$message({ type: 'error', message: data.name + '已经小于' + data.min + 'mm' });
      //   that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      //   data.data[data.dataKey] = '';
      //   return false;
      // }
      that.priceValuation();
    } else {
      that.$message({ type: 'error', message: '输入内容不正确,请重新输入' });
      that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      data.data[data.dataKey] = '';
      return false;
    }
  }
}
export function checkMax(finish_long, finish_wide) {
  if (finish_long * 1 > 1 && finish_wide * 1 > 1) {
    if (strEquals(that.cateId, '1') || strEquals(that.cateId, '2')) {
      if (strEquals(that.subCateId, '24') || strEquals(that.subCateId, '32')) {
        if (!checkSize(finish_long, finish_wide, 1500, 1200)) {
          that.$message({ type: 'error', message: '展开尺寸不能大于1500*1200' });
          return false;
        }
      } else {
        if (!checkSize(finish_long, finish_wide, 1000, 700)) {
          that.$message({ type: 'error', message: '展开尺寸不能大于1000*700' });
          return false;
        }
      }
    } else if (strEquals(that.cateId, '4') || strEquals(that.cateId, '7')) {
      if (!checkSize(finish_long, finish_wide, 1000, 600)) {
        that.$message({ type: 'error', message: '展开尺寸不能大于1000*600' });
        return false;
      }
    } else if (strEquals(that.cateId, '8')) {
      //胶片盒
      if (!checkSize(finish_long, finish_wide, 570, 780)) {
        that.$message({ type: 'error', message: '展开尺寸不能大于780*570' });
        return false;
      }
    } else if (strEquals(that.cateId, '70')) {
      //外箱
      if ((that.$route.query.subCateId == '71' || that.$route.query.subCateId == '72' || that.$route.query.subCateId == '74') && !checkSize(finish_long, finish_wide, 2230, 1390)) {
        that.$message({ type: 'error', message: '展开尺寸不能超出2230*1390' });
        return false;
      }
      if ((that.$route.query.subCateId == '73' || that.$route.query.subCateId == '75') && !checkSize(finish_long, finish_wide, 1490, 990)) {
        that.$message({ type: 'error', message: '展开尺寸不能超出1490*990' });
        return false;
      }
    } else {
      if (!checkSize(finish_long, finish_wide, 1000, 600)) {
        that.$message({ type: 'error', message: '展开尺寸不能大于1000*600' });
        return false;
      }
      console.log('finish_long', finish_long);
      console.log('finish_wide', finish_wide);
    }
    return true;
  } else {
    return false;
  }
}
/**
 * 判断尺寸
 **/
export function checkSize(long, wide, maxLong, maxWide) {
  if ((long * 1 <= maxLong * 1 && wide * 1 <= maxWide * 1) || (long * 1 <= maxWide * 1 && wide * 1 <= maxLong * 1)) {
    return true;
  } else {
    //去除展开尺寸 超过限制
    // that.formData.goodSize.goodAl = 0;
    // that.formData.goodSize.goodAw = 0;
    return false;
  }
}
/**
 * 数值修改
 * @param val
 * @param data
 * @returns {boolean}
 */
export function otherInputChange(val, data) {
  // dataKey
  let integer = /^(-|\+)?\d+$/; //输入整数(包括0)的正则，解决不能输入负号问题
  if (integer.test(data.data[data.dataKey])) {
    if (data.code === 'TKKS') {
      const maxNum = 900 * 700;
      if (!isReInSize()) {
        for (let i = 0; i < that.commonVoList.length; i++) {
          if (endWith(that.commonVoList[i].code, 'SIZE')) {
            const commonAttrList = that.commonVoList[i].attrList;
            const goodAl = that.commonFormData.inputValues[that.commonVoList[i].id + '_' + commonAttrList[0].id];
            const goodAw = that.commonFormData.inputValues[that.commonVoList[i].id + '_' + commonAttrList[1].id];
            if (parseInt(goodAl) * parseInt(goodAw) * parseInt(val) > maxNum) {
              data.data[data.dataKey] = '1';
              that.$message({ type: 'error', message: '对不起，超过最大数量了' });
              return false;
            }
            //
          }
        }
      } else {
        if (that.formData.goodSize.goodAl > 0) {
          if (that.formData.goodSize.goodAl * that.formData.goodSize.goodAw * parseInt(val) > maxNum) {
            data.data[data.dataKey] = '1';
            that.$message({ type: 'error', message: '对不起，超过最大数量了' });
            return false;
          }
        } else {
          that.$message({ type: 'error', message: '请先填写必要参数' });
          data.data[data.dataKey] = '1';
          return false;
        }
      }
    }
    that.priceValuation();
  } else {
    that.$message({ type: 'error', message: '输入内容出错' });
    data.data[data.dataKey] = '1';
    return false;
  }
}
/**
 * 排序
 * @param {Object} a
 * @param {Object} b
 */
export function listSort(a, b) {
  return a.miniZtAttrGroup.sortOrder - b.miniZtAttrGroup.sortOrder;
}
export function getCommonSuffix(data) {
  that.formData.appendsDesc = {
    goodAl: 'x',
    goodAw: 'x',
    goodAd: 'x',
    goodAt: 'x',
    goodAx: 'x',
    goodAh: 'x',
    goodAr: 'x'
  };
  if (data.goodAr === 1) {
    that.formData.appendsDesc.goodAr = 'mm';
  } else if (data.goodAh === 1) {
    that.formData.appendsDesc.goodAh = 'mm';
  } else if (data.goodAx === 1) {
    that.formData.appendsDesc.goodAx = 'mm';
  } else if (data.goodAt === 1) {
    that.formData.appendsDesc.goodAt = 'mm';
  } else if (data.goodAd === 1) {
    that.formData.appendsDesc.goodAd = 'mm';
  } else if (data.goodAw === 1) {
    that.formData.appendsDesc.goodAw = 'mm';
  } else if (data.goodAl === 1) {
    that.formData.appendsDesc.goodAl = 'mm';
  }
}
/**
 * 添加购物车
 */
export function addCart(type) {
  // if (that.subCateId === '24') {
  //   if (!that.priceFormData.agreement) {
  //     that.$message({ type: 'error', message: '请选择免责声明' });
  //     return false;
  //   }
  // }
  that.formData.loading = true;
  delayedAddCart(type);
}
export function priceSynFunction(funParams) {
  setTimeout(function() {
    if (!that.priceFormData.priceProgress) {
      funParams();
    } else {
      priceSynFunction(funParams);
    }
  }, 100);
}
export function delayedAddCart(type) {
  setTimeout(function() {
    if (!that.priceFormData.priceProgress) {
      if (parseFloat(that.priceFormData.price) <= 0) {
        that.$message({ type: 'error', message: '请完善计价信息' });
        that.formData.loading = false;
        return false;
      }
      if (!type) {
        type = '0';
      }

      if (!that.formData.goodAttr) {
        that.$message({ type: 'error', message: '请完善计价信息' });
      } else {
        const param = {
          data: {
            once: type,
            num: that.priceFormData.yssl,
            totalTime: that.priceFormData.time_normal,
            fnumber: that.priceFormData.tkks,
            goodsId: that.formData.goodAttrVo.id,
            goodsAttr: that.formData.goodAttr,
            goodsTotal: that.priceFormData.price,
            type: that.paperId
          }
          // fnumber: "1"
          // goodsAttr: "成品尺寸:100_100_100;展开尺寸:415.00_330.00;打样类型:打成品样;刀模服务:无;设计制作:无;调色服务:无;纸张材质:单铜纸_350;表面处理:哑胶;印刷颜色:多色_CMYK;是否粘盒:粘;是否割样:是;"
          // goodsId: 938
          // number: "1"
          // type: 101
        };
        // 用户行为记录
        that.$report({
          channel: 121000 + Number(that.$route.query.subCateId),
          actionId: type == '0' ? 3 : 2,
          param: JSON.stringify({
            goodsId: that.formData.goodAttrVo.id,
            price: that.priceFormData.price,
            num: that.priceFormData.yssl
          })
        });
        addCartReq(param)
          .then(() => {
            //获取购物车数量
            store.dispatch('CartCount').then(() => {});
            that.formData.loading = false;
            if (strEquals(type, '1')) {
              that.$router.push({ path: '/cart/checkproof?isCart=0' });
            } else {
              that.$message({ type: 'success', message: '添加购物车成功!' });
            }
          })
          .catch(() => {
            that.formData.loading = false;
          });
      }
    } else {
      delayedAddCart();
    }
  }, 300);
}
/**
 * 获取公用的表单信息
 * @param cateId
 * @param subCateId
 * @returns {*}
 */
export function getCommonVoList(cateId, subCateId) {
  let newList = [];
  if (
    (strEquals(cateId, '1') && strEquals(subCateId, '24')) ||
    (strEquals(cateId, '2') && strEquals(subCateId, '32')) ||
    (strEquals(cateId, '8') && strEquals(subCateId, '61')) ||
    (strEquals(cateId, '5') && strEquals(subCateId, '40')) ||
    (strEquals(cateId, '5') && strEquals(subCateId, '41'))
  ) {
    newList = JSON.parse(JSON.stringify(cartCustomCommonList));
    newList.push(JSON.parse(JSON.stringify(tkksCommonItem)));
  } else if (strEquals(cateId, '2') && strEquals(subCateId, '31')) {
    newList = JSON.parse(JSON.stringify(pitSbhCommonList));
    newList.push(JSON.parse(JSON.stringify(tkksCommonItem)));
  } else if (strEquals(cateId, '9')) {
    if (strEquals(subCateId, '48')) {
      newList = JSON.parse(JSON.stringify(commonViewList));
    } else {
      newList = JSON.parse(JSON.stringify(cartCustomCommonList));
    }
  } else if (strEquals(cateId, '4') && strEquals(subCateId, '34')) {
    newList = JSON.parse(JSON.stringify(cartCustomCommonList));
  } else if (strEquals(cateId, '4') && (strEquals(subCateId, '36') || strEquals(subCateId, '37') || strEquals(subCateId, '38'))) {
    newList = JSON.parse(JSON.stringify(evaSbhCommonList));
    newList.push(JSON.parse(JSON.stringify(ysslCommonItem)));
  } else if (strEquals(cateId, '7') && strEquals(subCateId, '44')) {
    newList = JSON.parse(JSON.stringify(commonViewList));
  } else if (strEquals(cateId, '7') && strEquals(subCateId, '55')) {
    newList = [];
    newList.push(JSON.parse(JSON.stringify(ysslCommonItem)));
  } else if ((strEquals(cateId, '11') && strEquals(subCateId, '51')) || (strEquals(cateId, '12') && strEquals(subCateId, '52'))) {
    newList = [];
    newList.push(JSON.parse(JSON.stringify(ysslCommonItem)));
  } else if (strEquals(cateId, '10')) {
    newList = [];
    newList.push(JSON.parse(JSON.stringify(ysslCommonItem)));
    newList.push(JSON.parse(JSON.stringify(tkksCommonItem)));
  } else if (strEquals(cateId, '4') && strEquals(subCateId, '35')) {
    newList = JSON.parse(JSON.stringify(cartCustomCommonList));
    newList.push(JSON.parse(JSON.stringify(tkksCommonItem)));
  } else if ((strEquals(cateId, '6') && strEquals(subCateId, '42')) || (strEquals(cateId, '6') && strEquals(subCateId, '43'))) {
    newList = JSON.parse(JSON.stringify(tagCommonList));
    newList.push(JSON.parse(JSON.stringify(tkksCommonItem)));
  } else if (strEquals(cateId, '70')) {
    newList = JSON.parse(JSON.stringify(hardcoverBoxCommonListOne));
    newList[0].name = '成品内尺寸';
    newList[0].actualValue = '成品内尺寸';
  } else if (strEquals(cateId, '3') && strEquals(subCateId, '33')) {
    newList = JSON.parse(JSON.stringify(hardcoverBoxCommonList));
  } else {
    newList = JSON.parse(JSON.stringify(commonViewList));
    if (!strEquals(cateId, '4')) {
      newList.push(JSON.parse(JSON.stringify(tkksCommonItem)));
    }
  }
  // numFilter(newList[1].attrList[0], '', that);
  return newList;
}
/**
 * 获取菜单名称
 */
export function getSubName() {
  let topNav = getTopNav(store.getters.proofCateNavs, that.cateId);
  let subNav = getSubNav(store.getters.proofCateNavs, that.cateId, that.subCateId);
  that.cateName = topNav.data.name;
  that.paperId = subNav.paperId;
  setDocumentTitle(that.cateName + '打样-傲彩');
  if (subNav) {
    that.subCateName = subNav.name;
  }
}
/**
 * 分类修改
 * @param {Object} val
 */
export async function getCateVoList(bindId) {
  that.formData.loading = true;
  await getVoList({
    bindType: that.bindType,
    bindId: bindId,
    whereBindId: that.whereBindId,
    whereGoodsId: that.whereGoodsId
  }).then(res => {
    that.voList = [];
    that.formVoList = [];
    const dataList = res.data;
    if (dataList != null && dataList.length > 0) {
      that.voList = dataList;
      loadFormGroup(0);
      that.formData.loading = false;
      getOtherMsg();
    }
  });
}
/**
 * 按照pagerId获取分类id
 */
export function getPagerCate() {
  that.cateId = that.$route.query.cateId;
  if (!that.cateId) {
    that.cateId = '1';
  }
  if (that.$route.query.subCateId) {
    that.subCateId = that.$route.query.subCateId;
  }
  if (that.$route.query.gid) {
    that.goodsId = that.$route.query.gid;
  }
  that.clearData();
}
/**
 * 分类修改
 */
export async function cateChange() {
  if (that.subCateIds.includes(that.cateId)) {
    await getCateVoList(that.subCateId);
  } else {
    await getCateVoList(that.cateId);
  }
}
export function getAttrValue(cateId, subCateId, strVal) {
  if (strEquals(cateId, '70')) {
    // 品类:外箱;成品内尺寸:100_100_100;展开尺寸:450.00_230.00;纸张类型:单坑;B坑;120g牛卡;120g高强芯;120g高强芯;120g牛卡;印刷颜色:单色_青色;粘合:胶粘;0;
    const startIndex = strVal.indexOf('纸张类型:') + 8;
    const endIndex = strVal.indexOf('印刷颜色:');
    let substr = strVal.substring(startIndex, endIndex);
    const splitStrs = substr.split(';');
    let strCode = '';
    for (let i = 0; i < splitStrs.length; i++) {
      if (outerBoxAtrrValue[splitStrs[i]]) {
        strCode += outerBoxAtrrValue[splitStrs[i]];
      }
    }
    let newStr = '纸张材质:' + substr.replace(/;/g, '_') + strCode;
    return strVal.substring(0, startIndex) + newStr + strVal.substring(endIndex - 1);
  }
  return '';
}
/**
 * 获取商品属性
 */
export async function getGoodAttrInfo() {
  if (that.goodsId) {
    await getByGoodsId({ id: that.goodsId }).then(res => {
      that.$set(that.formData, 'goodAttrVo', res.data);
      if (isReInSize()) {
        that.sizeInCount = res.data.goodAr + res.data.goodAh + res.data.goodAx + res.data.goodAt + res.data.goodAd + res.data.goodAw + res.data.goodAl;
      }
      getCommonSuffix(res.data);
    });
  } else {
    await getBySubBindId({ id: that.subCateId }).then(res => {
      that.$set(that.formData, 'goodAttrVo', res.data);
      if (isReInSize()) {
        that.sizeInCount = res.data.goodAr + res.data.goodAh + res.data.goodAx + res.data.goodAt + res.data.goodAd + res.data.goodAw + res.data.goodAl;
      }
      getCommonSuffix(res.data);
    });
  }
}

/**
 * 是否重新计算应输入文本框大小
 * @returns {boolean}
 */
/**
 * 是否重新计算应输入文本框大小
 * @returns {boolean}
 */
export function isReInSize() {
  if (
    (strEquals(that.cateId, '1') && strEquals(that.subCateId, '24')) ||
    (strEquals(that.cateId, '2') && strEquals(that.subCateId, '31')) ||
    (strEquals(that.cateId, '2') && strEquals(that.subCateId, '32')) ||
    (strEquals(that.cateId, '3') && strEquals(that.subCateId, '33')) ||
    (strEquals(that.cateId, '4') && strEquals(that.subCateId, '34')) ||
    (strEquals(that.cateId, '4') && strEquals(that.subCateId, '35')) ||
    (strEquals(that.cateId, '4') && strEquals(that.subCateId, '36')) ||
    (strEquals(that.cateId, '4') && strEquals(that.subCateId, '37')) ||
    (strEquals(that.cateId, '4') && strEquals(that.subCateId, '38')) ||
    (strEquals(that.cateId, '5') && strEquals(that.subCateId, '40')) ||
    (strEquals(that.cateId, '5') && strEquals(that.subCateId, '41')) ||
    (strEquals(that.cateId, '6') && strEquals(that.subCateId, '42')) ||
    (strEquals(that.cateId, '6') && strEquals(that.subCateId, '43')) ||
    (strEquals(that.cateId, '7') && strEquals(that.subCateId, '55')) ||
    (strEquals(that.cateId, '8') && strEquals(that.subCateId, '61')) ||
    (strEquals(that.cateId, '9') && strEquals(that.subCateId, '46')) ||
    (strEquals(that.cateId, '9') && strEquals(that.subCateId, '47')) ||
    strEquals(that.cateId, '10') ||
    (strEquals(that.cateId, '11') && strEquals(that.subCateId, '51')) ||
    (strEquals(that.cateId, '12') && strEquals(that.subCateId, '52'))
  ) {
    return false;
  } else {
    return true;
  }
}
/**
 * 加载默认
 */
export function loadCommonDefault() {
  for (let i = 0; i < that.commonVoList.length; i++) {
    const commonVo = that.commonVoList[i];
    for (let j = 0; j < commonVo.attrList.length; j++) {
      const attrItem = commonVo.attrList[j];
      if (attrItem.defaultValue !== null && attrItem.defaultValue !== undefined) {
        that.$set(that.commonFormData.inputValues, attrItem.groupId + '_' + attrItem.id, attrItem.defaultValue);
      }
    }
  }
}
export function getCommonGroupItem(groupId) {
  for (let i = 0; i < that.commonVoList.length; i++) {
    if (strEquals(that.commonVoList[i].id, groupId)) {
      return that.commonVoList[i];
    }
  }
  return null;
}
export function getCommonAttrItem(groupId, attrId) {
  let commonGroupItem = getCommonGroupItem(groupId);
  if (commonGroupItem) {
    for (let i = 0; i < commonGroupItem.attrList.length; i++) {
      if (strEquals(commonGroupItem.attrList[i].id, attrId)) {
        return commonGroupItem.attrList[i];
      }
    }
  }
  return null;
}
export const defaultYs = { scCount: 0, pantoneList: [], pantone: '', jybm: false, jybmVal: false };
export const defaultFormData = {
  tabType: '0', // 0:快捷,1:专业报价
  whereBindId: '',
  whereGoodsId: '',
  cateId: '0',
  parentId: '0',
  subCateId: '',
  goodsId: '',
  copyIdStart: 100000000,
  subCateIds: ['4', '5', '6', '7', '9'], // 绑定的子级分类pagerId配置
  voList: [],
  formData: {
    loading: true,
    inputValues: {},
    radioSelectValues: {},
    checkBoxSelectValues: {},
    oldCheckBoxSelectVals: {},
    selectSelectValues: {},
    zcjgpb: '', // 见坑纸信息
    yslx: 'dm', // 印刷类型,dm:单面印刷,sm:双面印刷
    dmys: { ...defaultYs }, // 单面印刷数据
    zmys: { ...defaultYs },
    fmys: { ...defaultYs },
    // bqys: { ...defaultYs },
    ysm: {
      scCount: 1,
      value: '',
      list: [
        { widthVal: 0, longVal: 0 },
        { widthVal: 0, longVal: 0 },
        { widthVal: 0, longVal: 0 },
        { widthVal: 0, longVal: 0 },
        { widthVal: 0, longVal: 0 },
        { widthVal: 0, longVal: 0 }
      ]
    }, // 单面印刷数据
    sgYsys: { ...defaultYs },
    xgYsys: { ...defaultYs },
    showLoginDialog: false,
    goodSize: { goodAl: 0, goodAw: 0, otherMap: {} },
    goodAttr: '',
    goodAttrVo: {
      id: 938,
      goodAl: 0,
      goodAw: 0,
      goodAd: 0,
      goodAh: 0,
      goodAr: 0,
      goodAt: 0,
      goodAx: 0
    },
    appendsDesc: {}
  },
  sizeInCount: 0, // 需要输入的尺寸文本框数量
  totalInCount: 0, // 总共需要输入文本框数量
  commonVoList: [], // 公用部分属性
  commonFormData: { inputValues: {} },
  formVoList: [],
  groupVoList: [],
  priceFormData: {},
  cateNavs: [],
  subCateName: '',
  cateName: '',
  pagerId: 0
};
export const defaultPriceFormData = {
  provinceId: '',
  cityId: '',
  yssl: 0,
  tkks: 1,
  out_time: '',
  cate: 1,
  price: 0,
  time: 0,
  type: 101
};

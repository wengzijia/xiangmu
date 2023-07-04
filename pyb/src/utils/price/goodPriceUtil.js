import { endWith, startWith, strEquals } from '@/utils/strUtil';
import { checkPantone, computeSize, getByGoodsId, getBySubBindId, getVoList } from '@/api/product/attrApi';
import { craftInputAttr, craftRadioAttr } from '@/utils/price/craftUtil';
import { commonViewList, cartCustomCommonList, pitSbhCommonList, tkksCommonItem, tagCommonList, ysslCommonItem, outerBoxAtrrValue, hardcoverBoxCommonList } from '@/utils/price/priceCommonListData';
import { add } from '@/api/cart/cartApi';
import store from '@/store';
import { getTopNav, getSubNav } from '@/utils/cateNavsUtil';
import { setDocumentTitle, setKeywords } from '@/utils/domUtil';
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
  if (parentAttrId == 31506) {
    that.$set(that.formData.radioSelectValues, 100007162, '100007162_100031524');
  }
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
  console.log('parentAttrId', parentAttrId);
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
    // 点击取消压纹，隐藏纹路信息内容
    if (!isCopy && (strEquals(that.formVoList[i].miniZtAttrGroup.id, '7178') || strEquals(that.formVoList[i].miniZtAttrGroup.id, '7177'))) {
      that.formVoList.splice(i, 1);
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
  console.log('id1234 ', id);
  console.log('id ', id);
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
  that.formVoList.sort(listSort);
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
  groupValueList.shift();
  //   console.log('groupValueList2222', groupValueList);
  // 文本输入框
  for (let i = 0; i < that.formVoList.length; i++) {
    const item = that.formVoList[i];
    if (item.miniZtAttrGroup.groupType === 'input') {
      if (item.miniZtAttrGroup.name === '印刷数量') {
        continue;
      }
      let str = '';
      const isrn = craftInputAttr(item, groupValueList, inputValues);
      if (!isrn) {
        if (item.miniZtAttrGroup.actualValue) {
          if (endWith(item.miniZtAttrGroup.code, 'BBFS_ZDY_ZDY_TK')) {
            str = '下盖包边方式:';
          } else {
            str = item.miniZtAttrGroup.actualValue + ':';
          }
        } else {
          if (endWith(item.miniZtAttrGroup.code, 'BBFS_ZDY_ZDY_TK')) {
            str = '下盖包边方式:';
          } else {
            str = item.miniZtAttrGroup.name + ':';
          }
        }
        for (let var1 in inputValues) {
          if (inputValues[var1]) {
            const splits = var1.split('_');
            const groupId = splits[0];
            const attrId = splits[1];
            const attrItem = getGroupAttr(attrId, groupId);
            if (attrItem && strEquals(attrItem.groupId, item.miniZtAttrGroup.id)) {
              if (endWith(item.miniZtAttrGroup.code, 'BBFS_ZDY_ZDY_TK')) {
                if (parseInt(inputValues[var1]) < 15) {
                  that.$message({ type: 'error', message: '无效的包边数值，不能少于15MM' });
                  return false;
                }
                str += '包边' + inputValues[var1] + 'MM_';
              } else {
                str += inputValues[var1] + '_';
              }
            }
          }
        }
        groupValueList.push(str.substring(0, str.length - 1));
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
  // console.log(that.formData.yslx, that.formData.zmys.jybm, that.formData.zmys.jybmVal);
  if (that.formData.whiteInk) {
    if (that.formData.dmys.jybmVal) {
      strValue += '加印白墨;';
    }
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
  if (that.formData.bqys.scCount > 0) {
    strValue += await getPantoneStr(that.formData.bqys, '裱卡专色1');
  }
  //   console.log('字符串', strValue);
  return strValue;
}
export function getOtherMsg() {
  if (strEquals(that.cateId, '13')) {
    that.formData.zcjgpb = '';
    let tempStr = 0;
    console.log('formVoList', that.formVoList.length);
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
  } else if (strEquals(that.cateId, '70')) {
    that.formData.zcjgpb = '';
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
              that.formData.zcjgpb += ' ' + attrItem.actualValue + ' +';
            }
          }
        }
      }
    }
    if (that.formData.zcjgpb) {
      that.formData.zcjgpb = that.formData.zcjgpb.substring(0, that.formData.zcjgpb.length - 1);
    }
  }
}

/**
 * 拼一版计价方法
 */
export async function commonValuationNew() {
  let isComputeSize = isReInSize();
  //   console.log('输入文本框长度', isComputeSize);
  // let totalInCount = that.sizeInCount + 2;
  let totalInCount = that.totalInCount;
  // if (strEquals(that.cateId, '8')) {
  //   totalInCount = that.sizeInCount + 1;
  // }
  // if (strEquals(that.cateId, '3')) {
  //   totalInCount = that.sizeInCount + 1;
  // }
  // if (strEquals(that.cateId, '7') && strEquals(that.subCateId, '55')) {
  //   totalInCount = that.sizeInCount + 1;
  // }
  let inCount = 0;
  let sizeCount = 0;
  getOtherMsg();
  if (!that.formData.goodAttrVo.id) {
    return false;
  }
  //   console.log('数量数量数量', that.commonFormData.inputValues);
  //   console.log('数量数量数量33333', that.commonVoList);
  for (const argumentsKey in that.commonFormData.inputValues) {
    if (that.commonFormData.inputValues[argumentsKey] && parseInt(that.commonFormData.inputValues[argumentsKey]) > 0) {
      if (parseInt(argumentsKey.split('_')[1]) <= 7) {
        sizeCount++;
      }
      inCount++;
    }
  }
  //   console.log('有几个输入框', sizeCount);
  //   console.log('尺寸应输', that.sizeInCount);
  that.sizeInCount = sizeCount;
  // console.log('输入', '尺寸应输:' + that.sizeInCount, '尺寸实输:' + sizeCount, '总应输:' + totalInCount, '总实输:' + inCount);
  if (that.sizeInCount === 2) {
    //   if (that.sizeInCount === 3) {
    // console.log('印刷数量YSSL', that.priceFormData.yssl);

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
      reqParam['zipval'] = that.formData.zipval;
      reqParam['sysType'] = 'pinyiban';
      //console.log(inCount)
      if (inCount >= 3) {
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
                strVal += that.commonFormData.inputValues[that.commonVoList[i].attrList[j].groupId + '_' + that.commonVoList[i].attrList[j].id] + '_';
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
 * 计价方法
 */
export async function commonValuation() {
  let isComputeSize = isReInSize();
  // let totalInCount = that.sizeInCount + 2;
  let totalInCount = that.totalInCount;
  // if (strEquals(that.cateId, '8')) {
  //   totalInCount = that.sizeInCount + 1;
  // }
  // if (strEquals(that.cateId, '3')) {
  //   totalInCount = that.sizeInCount + 1;
  // }
  // if (strEquals(that.cateId, '7') && strEquals(that.subCateId, '55')) {
  //   totalInCount = that.sizeInCount + 1;
  // }
  let inCount = 0;
  let sizeCount = 0;
  getOtherMsg();
  if (!that.formData.goodAttrVo.id) {
    return false;
  }
  //   console.log("输入的值",that.commonFormData.inputValues);
  for (const argumentsKey in that.commonFormData.inputValues) {
    if (that.commonFormData.inputValues[argumentsKey] && parseInt(that.commonFormData.inputValues[argumentsKey]) > 0) {
      if (parseInt(argumentsKey.split('_')[1]) <= 7) {
        sizeCount++;
      }
      inCount++;
    }
  }

  // console.log('输入', '尺寸应输:' + that.sizeInCount, '尺寸实输:' + sizeCount, '总应输:' + totalInCount, '总实输:' + inCount);
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
      reqParam['zipval'] = that.formData.zipval;
      reqParam['sysType'] = 'pinyiban';
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
                strVal += that.commonFormData.inputValues[that.commonVoList[i].attrList[j].groupId + '_' + that.commonVoList[i].attrList[j].id] + '_';
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
        // isrn = false;
      }
      return res;
    });
    if (isrn) {
      obj.pantone = '';
      for (let i = 0; i < obj.scCount; i++) {
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
        // isrn = false;
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
        console.log();
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
 * 搜索
 * @param that
 * @param pid
 * @returns {[]}
 */
export function getGroupByParentAttrId(parentAttrId) {
  const _voList = that.voList;
  const attrList = [];
  for (let i = 0; i < _voList.length; i++) {
    const formGroupItem = _voList[i];
    if (strEquals(formGroupItem.miniZtAttrGroup.parentAttrId, parentAttrId)) {
      attrList.push(formGroupItem);
    }
  }
  return attrList;
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
        that.formVoList.splice(j, 1);
        break;
      }
    }
  }
  toGroupVoList();
}
export function inputChange(param) {
  const splits = param.id.split('_');
  const groupId = splits[0];
  const attrId = splits[1];
  const groupItem = getGroupById(groupId);
  const attrItem = getGroupAttr(attrId, groupId);
  if (isNaN(parseFloat(param.value))) {
    that.$message({ type: 'error', message: groupItem.miniZtAttrGroup.name + '不能大于' + attrItem.maxValue });
    that.$set(that.formData.inputValues, param.id, attrItem.maxValue + '');
  } else {
    if (attrItem.maxValue && attrItem.minValue) {
      if (parseInt(param.value) <= parseInt(attrItem.maxValue) && parseInt(param.value) >= parseInt(attrItem.minValue)) {
        that.changeParam();
      } else {
        if (parseInt(param.value) > parseInt(attrItem.maxValue)) {
          that.$message({ type: 'error', message: groupItem.miniZtAttrGroup.name + '不能大于' + attrItem.maxValue });
          that.$set(that.formData.inputValues, param.id, attrItem.maxValue + '');
        } else if (parseInt(param.value) < parseInt(attrItem.minValue)) {
          that.$message({ type: 'error', message: groupItem.miniZtAttrGroup.name + '不能小于' + attrItem.minValue });
          that.$set(that.formData.inputValues, param.id, attrItem.minValue + '');
        }
      }
    }
  }
}
/**
 * 复选框选择
 */
export function checkboxSelect(param) {
  let event = param.event;
  let code = param.code;
  let id = 0;
  let isAdd = true;
  //   console.log('复选框选择1', event);
  //   console.log('复选框选择2', code);
  //   console.log('复选框选择', that.formData.checkBoxSelectValues);
  if (that.formData.checkBoxSelectValues[code].length > 1) {
    that.formData.showMsg = true;
  } else {
    that.formData.showMsg = false;
  }
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
    return false;
  }
  that.$set(that.formData, 'oldCheckBoxSelectVals', JSON.parse(JSON.stringify(that.formData.checkBoxSelectValues)));
  const splits = id.split('_');
  const groupId = splits[0];
  const attrId = splits[1];
  const groupItem = getGroupById(groupId);
  const maxSelect = groupItem.miniZtAttrGroup.maxSelect;
  const minSelect = groupItem.miniZtAttrGroup.minSelect;
  if (maxSelect && minSelect) {
    if (that.formData.checkBoxSelectValues[code].length > maxSelect) {
      that.$message({ type: 'error', message: '最多可选择' + maxSelect + '个，如要继续，请取消当前选中的某一个选项' });
      return false;
    } else if (that.formData.checkBoxSelectValues[code].length < minSelect) {
      that.$message({ type: 'error', message: '请完善印刷颜色信息' });
      return false;
    }
  }
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
      that.$message({ type: 'warning', message: '请务必完善裱卡信息' });
    } else if (endWith(attrItem.code, '_YW')) {
      that.$message({ type: 'warning', message: '请务必完善压纹信息' });
    } else if (endWith(attrItem.code, '_DK')) {
      that.$message({ type: 'warning', message: '请务必完善吊扣信息' });
    }
    loadDefaultGroup(attrItem.groupId, attrItem.id);
  } else {
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
  console.log('单选内容选择事件event', event);
  const splits = event.split('_');
  const groupId = splits[0];
  const attrId = splits[1];
  const groupItem = getGroupById(groupId);
  const attrItem = getGroupAttr(attrId, groupId);
  // console.log('单选内容选择事件attrId', attrId);

  // 控制在银卡纸时，显示加印白墨
  if (strEquals(attrId, '31479')) {
    that.formData.whiteInk = true;
  }
  if (strEquals(attrId, '31476') || strEquals(attrId, '31477')) {
    that.formData.whiteInk = false;
  }
  // 跟实物样为是时,显示内容
  if (strEquals(attrId, '33976')) {
    that.formData.flag = true;
  }
  if (strEquals(attrId, '33975') || strEquals(attrId, '31476') || strEquals(attrId, '31477')) {
    that.formData.flag = false;
  }

  if (strEquals(that.cateId, '1') && endWith(attrItem.code, 'YSXZ_W')) {
    that.formData.dmys.jybmVal = false;
  }
  if (strEquals(that.cateId, '1') && endWith(attrItem.code, 'SMYS_ZM_W')) {
    that.formData.zmys.jybmVal = false;
  }
  if (strEquals(that.cateId, '1') && endWith(attrItem.code, 'SMYS_FM_W')) {
    that.formData.fmys.jybmVal = false;
  }
  if (strEquals(that.cateId, '70')) {
    if (strEquals(attrItem.code, 'YSYS_W')) {
      that.formData.ysm.scCount = 0;
    } else if (strEquals(attrItem.code, 'YSYS_SS') || strEquals(attrItem.code, 'YSYS_DS')) {
      that.formData.ysm.scCount = 1;
    }
  }
  if (strEquals(groupItem.miniZtAttrGroup.code, 'YSYS')) {
    that.formData.yslx = endWith(attrItem.code, 'SMYS') ? 'sm' : 'dm';
  }
  const list = getGroupSubItem(attrItem.groupId);
  console.log('list', list);
  for (let i = 0; i < list.length; i++) {
    delete that.formData.radioSelectValues[list[i].miniZtAttrGroup.id];
  }
  deleteGroupItem(attrItem.groupId);
  loadDefaultGroup(attrItem.groupId, attrItem.id);
  that.formVoList.sort(listSort);
  let isShow = false;
  let isRemove = 0;
  for (let p in that.formData.radioSelectValues) {
    const selectValue = that.formData.radioSelectValues[p + ''];
    const groupId = selectValue.split('_')[0];
    const attrId = selectValue.split('_')[1];
    const attrItem = getGroupAttr(attrId, groupId);
    if (strEquals(that.cateId, '2') && endWith(groupItem.miniZtAttrGroup.code, 'BMCL')) {
      isRemove = radioSelectDelAttr(attrItem, isRemove, ['BMCL_GJ', 'BMCL_CGM', 'BMCL_W', 'BMCL_GY'], 'ZJGY', '_JBUV');
    } else if (strEquals(that.cateId, '3') && endWith(groupItem.miniZtAttrGroup.code, 'SG_MZBMCL')) {
      isRemove = radioSelectDelAttr(attrItem, isRemove, ['SG_FGHM'], 'SGMZGY', '_TJ');
    }
    if (
      strEquals(attrItem.code, 'ZZCZ_JYKZL') ||
      strEquals(attrItem.code, 'ZZCZ_NPZL') ||
      strEquals(attrItem.code, 'ZZCZ_TZZL') ||
      strEquals(attrItem.code, 'ZZCZ_YKZ') ||
      strEquals(attrItem.code, 'ZZCZ_JKZ') ||
      strEquals(attrItem.code, 'ZZCZ_NPZ') ||
      strEquals(attrItem.code, 'ZZCZ_QNPZ') ||
      strEquals(attrItem.code, 'MZCZ_YKZ') ||
      strEquals(attrItem.code, 'MZCZ_JKZ') ||
      strEquals(attrItem.code, 'MZCZ_NPZ') ||
      strEquals(that.cateId, '13')
    ) {
      isShow = true;
      break;
    }
  }
  if (isRemove === 1 && strEquals(that.cateId, '2') && endWith(groupItem.miniZtAttrGroup.code, 'BMCL')) {
    for (let i = 0; i < that.formVoList.length; i++) {
      if (strEquals(that.formVoList[i].miniZtAttrGroup.code, 'ZJGY')) {
        const voGroupItem = getGroupById(that.formVoList[i].miniZtAttrGroup.id);
        that.$set(that.formVoList[i], 'attrList', JSON.parse(JSON.stringify(voGroupItem.attrList)));
      }
    }
  }
  if (isRemove === 1 && strEquals(that.cateId, '3') && endWith(groupItem.miniZtAttrGroup.code, 'SG_MZBMCL')) {
    for (let i = 0; i < that.formVoList.length; i++) {
      if (strEquals(that.formVoList[i].miniZtAttrGroup.code, 'SGMZGY')) {
        const voGroupItem = getGroupById(that.formVoList[i].miniZtAttrGroup.id);
        that.$set(that.formVoList[i], 'attrList', JSON.parse(JSON.stringify(voGroupItem.attrList)));
      }
    }
  }

  that.formData.dmys.jybm = isShow;
  that.formData.zmys.jybm = isShow;
  that.formData.fmys.jybm = isShow;
  toGroupVoList();
  that.priceValuation();
}
export function radioSelectDelAttr(attrItem, isRemove, includeCodes, groupCode, removeEndWithCode) {
  isRemove = isRemove === 0 ? 1 : isRemove;
  for (let i = 0; i < includeCodes.length; i++) {
    if (endWith(attrItem.code, includeCodes[i])) {
      isRemove = 2;
      for (let i = 0; i < that.formVoList.length; i++) {
        if (strEquals(that.formVoList[i].miniZtAttrGroup.code, groupCode)) {
          const tempAttrList = that.formVoList[i].attrList;
          for (let j = 0; j < tempAttrList.length; j++) {
            if (endWith(tempAttrList[j].code, removeEndWithCode)) {
              deleteGroupItem(that.formVoList[i].attrList[j].groupId);
              that.formVoList[i].attrList.splice(j, 1);
              that.$set(that.formData.checkBoxSelectValues, that.formVoList[i].attrList[j].groupId, []);
              that.$set(that.formData.oldCheckBoxSelectVals, that.formVoList[i].attrList[j].groupId, []);
              // console.log(that.formData.checkBoxSelectValues[that.formVoList[i].attrList[j].groupId]);
              break;
            }
          }
        }
      }
    }
  }
  return isRemove;
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
      that.formVoList.push(JSON.parse(JSON.stringify(groupItem)));
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
  //   console.log('voList', that.voList);
  for (let i = 0; i < that.voList.length; i++) {
    const groupItem = that.voList[i];
    // console.log("88888",groupItem.miniZtAttrGroup.pid, pid);
    // console.log("99999",parentAttrId, groupItem.miniZtAttrGroup.parentAttrId);
    if (strEquals(groupItem.miniZtAttrGroup.pid, pid) && strEquals(parentAttrId, groupItem.miniZtAttrGroup.parentAttrId)) {
      if (groupItem.attrList != null && groupItem.attrList.length > 0) {
        that.formVoList.push(JSON.parse(JSON.stringify(groupItem)));
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
  for (let i = 0; i < groupItem.attrList.length; i++) {
    if (strEquals(that.subCateId, '23') && !strEquals(that.goodsId, '823') && groupItem.attrList[i].name === '磁铁') {
      groupItem.attrList.splice(i, 1);
      i = i - 1;
      break;
    }
  }
  if (groupItem.miniZtAttrGroup.pid > 0) {
    const parentGroup = getGroupById(groupItem.miniZtAttrGroup.pid);
    if (parentGroup.attrList) {
      for (let i = 0; i < parentGroup.attrList.length; i++) {
        const groupList = getGroupByParentAttrId(parentGroup.attrList[i].id);
        for (let j = 0; j < groupList.length; j++) {
          that.$set(that.formData.checkBoxSelectValues, groupList[j].miniZtAttrGroup.id, []);
        }
      }
    }
  }

  // console.log('getCheckboxDefault', groupItem, parentGroup, that.formData.checkBoxSelectValues);
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
      that.$set(that.formData.oldCheckBoxSelectVals, groupItem.miniZtAttrGroup.id, selectList);
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
export function otherInputChange(val, data) {
  //   console.log('输入值val', val);
  //   console.log('data', data);
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
    } else if (data.code === 'YSSL') {
      if (strEquals(that.subCateId, '51') && parseInt(val) < 2500) {
        data.data[data.dataKey] = '2500';
      } else if (strEquals(that.subCateId, '52')) {
        if (parseInt(val) < 1000) {
          data.data[data.dataKey] = '1000';
        } else {
          data.data[data.dataKey] = '' + Math.ceil(parseInt(val) / 1000) * 1000;
        }
      } else if (strEquals(that.subCateId, '55')) {
        const attr = [100, 200, 500, 1000, 2000, 3000, 5000, 10000];
        if (parseInt(val) > 10000) {
          if (parseInt(val) % 100 != 0) {
            data.data[data.dataKey] = '100';
            that.$message({ type: 'error', message: '数量必须是100的整数倍数' });
          }
        } else {
          for (let i = 0; i < attr.length; i++) {
            if (parseInt(val) <= attr[i]) {
              data.data[data.dataKey] = attr[i] + '';
              break;
            }
          }
        }
      } else if (strEquals(that.cateId, '70')) {
        if (parseInt(val) < 50) {
          that.$message({ type: 'error', message: '50个起印' });
          data.data[data.dataKey] = '50';
        }
      } else if (strEquals(that.cateId, '5') && strEquals(that.subCateId, '40')) {
        if (parseInt(val) < 1) {
          that.$message({ type: 'error', message: '1个起印' });
          data.data[data.dataKey] = '1';
        }
      } else if (parseInt(val) < 1000) {
        that.$message({ type: 'error', message: '1000个起印' });
        data.data[data.dataKey] = '1000';
      }
      if (strEquals(that.cateId, '1')) {
        if (parseInt(val) > 1000) {
          data.data[data.dataKey] = '' + Math.ceil(parseInt(val) / 1000) * 1000;
        }
        console.log('key值222', data.data[data.dataKey]);
      }
      if (strEquals(that.subCateId, '49')) {
        if (parseInt(val) > 100) {
          data.data[data.dataKey] = '' + Math.ceil(parseInt(val) / 500) * 500;
        }
      }
    }
    // console.log('YSSL666666');
    that.priceValuation();
  } else {
    that.$message({ type: 'error', message: '输入内容出错' });
    data.data[data.dataKey] = '1';
    return false;
  }
}
/**
 * 数值修改
 * @param val
 * @param data
 * @returns {boolean}
 */
export function numberChange(val, data) {
  // console.log("数值val111", val);
  // console.log("数值修改", data);
  if (strEquals(data.code, 'goodAx') && parseFloat(val) === 0) {
    that.priceValuation();
    return false;
  } else if (!isNaN(parseFloat(data.data[data.dataKey]))) {
    if (data.max && parseInt(data.data[data.dataKey]) > data.max) {
      // that.$message({ type: 'error', message: groupItem.miniZtAttrGroup.name + '不能大于' + attrItem.maxValue });
      that.$message({ type: 'error', message: '已经超出' + data.max });
      data.data[data.dataKey] = '';
      that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      return false;
    } else if (data.min && parseInt(data.data[data.dataKey]) < data.min) {
      that.$message({ type: 'error', message: '已经小于' + data.min });
      data.data[data.dataKey] = data.min;
      that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
      return false;
    }
    // const groupId = data.dataKey.split('_')[0];
    if (that.commonVoList[0].code === 'N_SIZE') {
      const l1 = data.data['1_1'];
      const l2 = data.data['1_2'];
      const l3 = data.data['1_3'];
      if (l2 > l1) {
        that.$message({ type: 'error', message: '宽不能大于长' });
        that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
        return false;
      }
      if (l2 < l3) {
        that.$message({ type: 'error', message: '宽不能小于高' });
        that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
        return false;
      }
      // const attr1 = that.commonVoList[0].attrList[0];
      // const attr2 = that.commonVoList[0].attrList[1];
      // const attr3 = that.commonVoList[0].attrList[2];
      // if (attr2)
    }
    that.priceValuation();
  } else {
    that.$message({ type: 'error', message: '输入内容不正确,请重新输入' });
    that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
    data.data[data.dataKey] = '';
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
  if (that.subCateId === '24') {
    if (!that.priceFormData.agreement) {
      that.$message({ type: 'error', message: '请选择免责声明' });
      return false;
    }
  }
  that.formData.loading = true;
  delayedAddCart(type);
}
export function delayedAddCart(type) {
  setTimeout(function() {
    if (!that.priceFormData.priceProgress) {
      if (parseFloat(that.priceFormData.total_price) <= 0) {
        that.$message({ type: 'error', message: '请完善计价信息' });
        that.formData.loading = false;
        return false;
      }
      if (!type) {
        type = '0';
      }
      if (!that.formData.goodAttr) {
        that.$message({ type: 'error', message: '请完善计价信息' });
        that.formData.loading = false;
      } else {
        // console.log('货期时间999', that.priceFormData.tatolTime);
        const totalTime = strEquals(that.priceFormData.extends, '0') ? that.priceFormData.time_fast : that.priceFormData.time_normal;

        const param = {
          miniCart: {
            isfrom: type,
            num: that.priceFormData.yssl,
            // totalTime: that.priceFormData.tatolTime,
            totalTime: totalTime,
            goodsId: that.formData.goodAttrVo.id,
            goodsAttr: that.formData.goodAttr,
            goodsTotal: that.priceFormData.total_price,
            extendsStr: that.priceFormData.extends
          },
          number: that.priceFormData.tkks
        };
        console.log(param);
        add(param)
          .then(() => {
            if (strEquals(type, '1')) {
              that.$router.push({ path: '/cart/checkorder?isCart=0' });
            } else {
              that.$message({ type: 'success', message: '添加购物车成功!' });
            }
            // 获取购物车数量
            store.dispatch('CartCount').then(() => {});
            that.formData.loading = false;
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
    (strEquals(cateId, '1') && strEquals(subCateId, '15')) ||
    (strEquals(cateId, '1') && strEquals(subCateId, '16')) ||
    (strEquals(cateId, '1') && strEquals(subCateId, '17')) ||
    (strEquals(cateId, '1') && strEquals(subCateId, '18')) ||
    (strEquals(cateId, '1') && strEquals(subCateId, '19')) ||
    (strEquals(cateId, '1') && strEquals(subCateId, '20')) ||
    (strEquals(cateId, '1') && strEquals(subCateId, '21')) ||
    (strEquals(cateId, '1') && strEquals(subCateId, '22')) ||
    (strEquals(cateId, '1') && strEquals(subCateId, '23')) ||
    (strEquals(cateId, '1') && strEquals(subCateId, '24'))
  ) {
    newList = JSON.parse(JSON.stringify(cartCustomCommonList));

    // if (!strEquals(cateId, '8')) {
    //   //newList.push(JSON.parse(JSON.stringify(tkksCommonItem)));
    // }
  } else if (strEquals(cateId, '2') && strEquals(subCateId, '31')) {
    newList = JSON.parse(JSON.stringify(pitSbhCommonList));
    //newList.push(JSON.parse(JSON.stringify(tkksCommonItem)));
  } else if (strEquals(cateId, '9')) {
    if (strEquals(subCateId, '48')) {
      newList = JSON.parse(JSON.stringify(commonViewList));
      newList[0].actualValue = '成品尺寸';
      newList[0].name = '成品尺寸';
      newList[0].attrList[0].name = '开页长';
      newList[0].attrList[0].inputTips = '开页长';
      newList[0].attrList[1].name = '书脊高';
      newList[0].attrList[1].inputTips = '书脊高';
    } else {
      newList = JSON.parse(JSON.stringify(cartCustomCommonList));
    }
  } else if (strEquals(cateId, '4') && strEquals(subCateId, '34')) {
    newList = JSON.parse(JSON.stringify(cartCustomCommonList));
  } else if (strEquals(cateId, '7') && strEquals(subCateId, '44')) {
    newList = JSON.parse(JSON.stringify(commonViewList));
  } else if (strEquals(cateId, '7') && strEquals(subCateId, '55')) {
    newList = [];
    newList.push(JSON.parse(JSON.stringify(ysslCommonItem)));
  } else if ((strEquals(cateId, '11') && strEquals(subCateId, '51')) || (strEquals(cateId, '12') && strEquals(subCateId, '52'))) {
    newList = [];
    newList.push(JSON.parse(JSON.stringify(ysslCommonItem)));
  } else if (strEquals(cateId, '10') && strEquals(subCateId, '49')) {
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
    newList = JSON.parse(JSON.stringify(commonViewList));
    newList[0].name = '成品内尺寸';
    newList[0].actualValue = '成品内尺寸';
  } else if (strEquals(cateId, '3') && strEquals(subCateId, '33')) {
    newList = JSON.parse(JSON.stringify(hardcoverBoxCommonList));
  } else {
    newList = JSON.parse(JSON.stringify(commonViewList));

    if (strEquals(subCateId, '69')) {
      newList[0].attrList[0].name = '全展宽';
      newList[0].attrList[0].inputTips = '全展宽';
      newList[0].attrList[0].name = '高';
      newList[0].attrList[1].inputTips = '高';
      newList[1].attrList[0].suffix = '轮转';
    }
    if (strEquals(subCateId, '62') || strEquals(subCateId, '66') || strEquals(subCateId, '67') || strEquals(subCateId, '68')) {
      newList[0].attrList[3].name = '半展';
      newList[0].attrList[3].inputTips = '半展';
    }
    if (strEquals(subCateId, '65') || strEquals(subCateId, '68')) {
      newList[0].attrList[5].name = '封位';
      newList[0].attrList[5].inputTips = '封位';
    }
    if (!strEquals(cateId, '8') && !strEquals(cateId, '4')) {
      newList.push(JSON.parse(JSON.stringify(tkksCommonItem)));
    }
  }
  return newList;
}
/**
 * 获取菜单名称
 */
export function getSubName() {
  let topNav = getTopNav(store.getters.priceCateNavs, that.cateId);
  let subNav = getSubNav(store.getters.priceCateNavs, that.cateId, that.subCateId);
  that.cateName = topNav.data.name;
  that.formData.cateName = topNav.data.name;
  if (subNav) {
    that.paperId = subNav.paperId;
    that.subCateName = subNav.name;
    that.formData.subCateName = subNav.name;
    console.log('subNavsubNavsubNav', subNav);
    setDocumentTitle(subNav.title);
    setKeywords(subNav.keywords, subNav.description);
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
      //   console.log('voList', that.voList);
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
  that.goodsId = '';
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
    console.log('纸张材质:', newStr);
    return strVal.substring(0, startIndex) + newStr + strVal.substring(endIndex - 1);
  } else if (strEquals(cateId, '2') && strEquals(subCateId, '31')) {
    // 品类:外箱;成品内尺寸:100_100_100;展开尺寸:450.00_230.00;纸张类型:单坑;B坑;120g牛卡;120g高强芯;120g高强芯;120g牛卡;印刷颜色:单色_青色;粘合:胶粘;0;
    if (strVal.indexOf('加手提:') !== -1) {
      const startIndex = strVal.indexOf('加手提:') + 4;
      const endIndex = strVal.indexOf('驳数:') - 1;
      let substr = strVal.substring(startIndex, endIndex);
      let newStr = '' + substr.replace(/;/g, '_');
      return strVal.substring(0, startIndex) + newStr + strVal.substring(endIndex);
    }
  }
  return strVal;
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
export function isReInSize() {
  if (
    //(strEquals(that.cateId, '1') && strEquals(that.subCateId, '24')) ||
    (strEquals(that.cateId, '2') && strEquals(that.subCateId, '31')) ||
    (strEquals(that.cateId, '2') && strEquals(that.subCateId, '32')) ||
    (strEquals(that.cateId, '4') && strEquals(that.subCateId, '34')) ||
    (strEquals(that.cateId, '4') && strEquals(that.subCateId, '35')) ||
    (strEquals(that.cateId, '5') && strEquals(that.subCateId, '40')) ||
    (strEquals(that.cateId, '5') && strEquals(that.subCateId, '41')) ||
    (strEquals(that.cateId, '6') && strEquals(that.subCateId, '42')) ||
    (strEquals(that.cateId, '6') && strEquals(that.subCateId, '43')) ||
    (strEquals(that.cateId, '7') && strEquals(that.subCateId, '55')) ||
    (strEquals(that.cateId, '8') && strEquals(that.subCateId, '61')) ||
    (strEquals(that.cateId, '9') && strEquals(that.subCateId, '46')) ||
    (strEquals(that.cateId, '9') && strEquals(that.subCateId, '47')) ||
    (strEquals(that.cateId, '10') && strEquals(that.subCateId, '49')) ||
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
    cateName: '',
    subCateName: '',
    showMsg: false,
    flag: false,
    whiteInk: false,
    loading: true,
    zcjgpb: '',
    inputValues: {},
    radioSelectValues: {},
    checkBoxSelectValues: {},
    oldCheckBoxSelectVals: {},
    selectSelectValues: {},
    yslx: 'dm', // 印刷类型,dm:单面印刷,sm:双面印刷
    dmys: { ...defaultYs }, // 单面印刷数据
    zmys: { ...defaultYs },
    fmys: { ...defaultYs },
    bqys: { ...defaultYs },
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
  priceProgress: false,
  provinceId: '',
  cityId: '',
  yssl: 0,
  tkks: 1,
  extends: '1',
  boxmoney: '0',
  common_time: 0,
  days: 0,
  days_fast: 5,
  days_normal: 7,
  days_slow: 0,
  editfee: 0,
  msg: '',
  out_time: '',
  percentV: 1,
  price_fast: '0',
  price_member: '0',
  price_normal: '0',
  price_old: '0',
  price_slow: '0',
  tatolTime: 168,
  savemoney: '0.00',
  shipping_fee: '0.00',
  time_fast: 120,
  time_normal: 168,
  time_slow: 0,
  total_price: '0',
  weight: 0,
  price1: '0.00',
  price2: '0.00',
  price3: '0.00',
  price5: '0.00',
  price10: '0.00'
};

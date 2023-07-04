import { startWith, endWith, strEquals } from '@/utils/strUtil';

let that = null;

/**
 * 初始化组件
 * @param that
 */
export function craftInitUtil(_that) {
  that = _that;
}
export function isCopyCraft(code) {
  if (endWith(code, 'TJ_TK') || endWith(code, 'TJ_TK_COPY')) {
    return true;
  } else if (endWith(code, 'BBFF_TK') || endWith(code, 'BBFF_TK_COPY')) {
    return true;
  } else if (endWith(code, 'TTFF_TK') || endWith(code, 'TTFF_TK_COPY')) {
    return true;
  } else if (endWith(code, '_JT') || endWith(code, '_JT_COPY')) {
    return true;
  } else if (endWith(code, '_FDJT') || endWith(code, '_FDJT_COPY')) {
    return true;
  } else if (endWith(code, '_DBJT') || endWith(code, '_DBJT_COPY')) {
    return true;
  } else if (endWith(code, '_JBUV') || endWith(code, '_JBUV_COPY')) {
    return true;
  } else if (endWith(code, '_JA') || endWith(code, '_JA_COPY')) {
    return true;
  }
  return false;
}
export function craftRadioAttr(attrItem, groupValueList) {
  if (endWith(attrItem.code, '_DKLX_TMDK')) {
    groupValueList.push('吊扣颜色:无');
    return true;
  }
  return false;
}
/**
 * 工艺
 */
export function craftInputAttr(item, groupValueList, inputValues) {
  if (endWith(item.miniZtAttrGroup.code, 'TJ_TK') || endWith(item.miniZtAttrGroup.code, 'TJ_TK_COPY')) {
    return tangjin(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, 'TTFF_TK') || endWith(item.miniZtAttrGroup.code, 'TTFF_TK_COPY')) {
    return fdtangjin(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, 'BBFF_TK') || endWith(item.miniZtAttrGroup.code, 'BBFF_TK_COPY')) {
    return dbtangjin(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, '_JT') || endWith(item.miniZtAttrGroup.code, '_JT_COPY')) {
    return jitu(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, '_FDJT') || endWith(item.miniZtAttrGroup.code, '_FDJT_COPY')) {
    return fdjitu(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, '_DBJT') || endWith(item.miniZtAttrGroup.code, '_DBJT_COPY')) {
    return dbjitu(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, '_JBUV') || endWith(item.miniZtAttrGroup.code, '_JBUV_COPY')) {
    return juBuUv(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, '_JA') || endWith(item.miniZtAttrGroup.code, '_JA_COPY')) {
    return jiao(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, '_TC')) {
    return tiechuang(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, '_TCCC')) {
    return tiechuang2(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, 'NTJWKD')) {
    return requiredInput(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, 'XGBBFS_ZDY_BB')) {
    return requiredInput(item, groupValueList, inputValues, 'MM');
  } else if (endWith(item.miniZtAttrGroup.code, '_BSEVA') || endWith(item.miniZtAttrGroup.code, '_HSEVA') || endWith(item.miniZtAttrGroup.code, '_BSZZM') || endWith(item.miniZtAttrGroup.code, '_HSZZM')) {
    return ntcl(item, groupValueList, inputValues);
  } else if (endWith(item.miniZtAttrGroup.code, 'CS_SZZD')) {
    return requiredInput2(item, groupValueList, inputValues);
  } else if (item.miniZtAttrGroup.parentAttrName === '自定义工艺') {
    return zdygy(item, groupValueList, inputValues);
  }
  return '0';
}
/**
 * 贴窗
 */
export function requiredInput2(item, groupValueList, inputValues, append) {
  const attrList = item.attrList;
  let str = '';
  for (let i = 0; i < attrList.length; i++) {
    if (inputValues[attrList[i].groupId + '_' + attrList[i].id]) {
      str += inputValues[attrList[i].groupId + '_' + attrList[i].id] + '_';
    }
  }
  if (str.indexOf('_') === -1) {
    str = '';
    that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
    return '-1';
  } else {
    let newStr = '加手提:';
    //加手提:低弹纱绳_红色_38
    for (let i = 0; i < groupValueList.length; i++) {
      if (groupValueList[i].indexOf('加手提:') !== -1) {
        newStr += groupValueList[i].split(':')[1] + '_';
        groupValueList.splice(i, 1);
        i--;
      }
    }
    if (append) {
      groupValueList.push(newStr + str.substring(0, str.length - 1) + append);
    } else {
      groupValueList.push(newStr + str.substring(0, str.length - 1));
    }
  }
  return '1';
}
/**
 * 贴窗
 */
export function requiredInput(item, groupValueList, inputValues, append) {
  const attrList = item.attrList;
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  let str = name + ':';
  for (let i = 0; i < attrList.length; i++) {
    if (inputValues[attrList[i].groupId + '_' + attrList[i].id]) {
      str += inputValues[attrList[i].groupId + '_' + attrList[i].id] + '_';
    }
  }
  if (str.indexOf('_') === -1) {
    str = '';
    that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
    return '-1';
  } else {
    if (append) {
      groupValueList.push(str.substring(0, str.length - 1) + append);
    } else {
      groupValueList.push(str.substring(0, str.length - 1));
    }
  }
  return '1';
}
/**
 * 内托材料
 */
export function ntcl(item, groupValueList, inputValues) {
  let count = 1;
  for (let i = 0; i < groupValueList.length; i++) {
    if (groupValueList[i].indexOf('内托材料') !== -1) {
      count++;
    }
  }
  const attrList = item.attrList;
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  let str = '内托材料' + count + ':' + name + '_';
  for (let i = 0; i < attrList.length; i++) {
    if (inputValues[attrList[i].groupId + '_' + attrList[i].id]) {
      str += inputValues[attrList[i].groupId + '_' + attrList[i].id] + '_';
    }
  }
  if (countSubstr(str, '_', false) < 3) {
    str = '';
    that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
    return '-1';
  } else {
    groupValueList.push(str.substring(0, str.length - 1));
  }
  return '1';
}

/**
 *
 * @param str
 * @param substr
 * @param isIgnore 是否忽略大小写!
 * @returns {number}
 */
function countSubstr(str, substr, isIgnore) {
  var count;
  var reg = '';
  if (isIgnore == true) {
    reg = '/' + substr + '/gi';
  } else {
    reg = '/' + substr + '/g';
  }
  reg = eval(reg);
  if (str.match(reg) == null) {
    count = 0;
  } else {
    count = str.match(reg).length;
  }
  return count;
}
/**
 * 贴窗
 */
export function tiechuang2(item, groupValueList, inputValues) {
  const attrList = item.attrList;
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  let str = name + ':';
  for (let i = 0; i < attrList.length; i++) {
    if (inputValues[attrList[i].groupId + '_' + attrList[i].id]) {
      str += inputValues[attrList[i].groupId + '_' + attrList[i].id] + '_';
    }
  }
  if (countSubstr(str, '_', false) < 2) {
    str = '';
    that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
    return '-1';
  } else {
    groupValueList.push(str.substring(0, str.length - 1));
  }
  return '1';
}
/**
 * 贴窗
 */
export function tiechuang(item, groupValueList, inputValues) {
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  let str = name + ':';
  for (let var1 in inputValues) {
    if (inputValues[var1] != null && inputValues[var1] !== '') {
      const groupId = var1.split('_')[0];
      const attrId = var1.split('_')[1];
      const attrItem = getGroupAttr(attrId, groupId);
      if (attrItem) {
        if (attrItem.groupId && attrItem.groupId === item.miniZtAttrGroup.id) {
          str += inputValues[var1] + '_';
        }
      }
    }
  }

  if (countSubstr(str, '_', false) >= 2) {
    groupValueList.push(str.substring(0, str.length - 1));
  } else {
    that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
    return '-1';
  }
  return '1';
}
/**
 * 击凹
 */
export function jiao(item, groupValueList, inputValues) {
  return jitu(item, groupValueList, inputValues);
}

/**
 * 局部uv
 */
export function juBuUv(item, groupValueList, inputValues) {
  return jitu(item, groupValueList, inputValues);
}
/**
 * 击凸
 * @param item
 * @param groupValueList
 * @param inputValues
 */
export function jitu(item, groupValueList, inputValues) {
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  let str = (item.copy ? name + '2' : name + '1') + ':';
  for (let var1 in inputValues) {
    if (inputValues[var1] != null && inputValues[var1] !== '') {
      const groupId = var1.split('_')[0];
      const attrId = var1.split('_')[1];
      const attrItem = getGroupAttr(attrId, groupId);
      if (attrItem) {
        if (attrItem.groupId && attrItem.groupId === item.miniZtAttrGroup.id) {
          str += inputValues[var1] + '_';
        }
      }
    }
  }
  if (countSubstr(str, '_', false) >= 2) {
    groupValueList.push(str.substring(0, str.length - 1));
  } else {
    that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
    return '-1';
  }
  return '1';
}

export function fdjitu(item, groupValueList, inputValues) {
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  let str = (item.copy ? name + '2' : name + '1') + ':';
  for (let var1 in inputValues) {
    if (inputValues[var1] != null && inputValues[var1] !== '') {
      const groupId = var1.split('_')[0];
      const attrId = var1.split('_')[1];
      const attrItem = getGroupAttr(attrId, groupId);
      if (attrItem) {
        if (attrItem.groupId && attrItem.groupId === item.miniZtAttrGroup.id) {
          str += inputValues[var1] + '_';
        }
      }
    }
  }
  if (countSubstr(str, '_', false) >= 2) {
    groupValueList.push(str.substring(0, str.length - 1));
  } else {
    that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
    return '-1';
  }
  return '1';
}

export function dbjitu(item, groupValueList, inputValues) {
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  let str = (item.copy ? name + '2' : name + '1') + ':';
  for (let var1 in inputValues) {
    if (inputValues[var1] != null && inputValues[var1] !== '') {
      const groupId = var1.split('_')[0];
      const attrId = var1.split('_')[1];
      const attrItem = getGroupAttr(attrId, groupId);
      if (attrItem) {
        if (attrItem.groupId && attrItem.groupId === item.miniZtAttrGroup.id) {
          str += inputValues[var1] + '_';
        }
      }
    }
  }
  if (countSubstr(str, '_', false) >= 2) {
    groupValueList.push(str.substring(0, str.length - 1));
  } else {
    that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
    return '-1';
  }
  return '1';
}

export function zdygy(item, groupValueList, inputValues) {
  if (inputValues[item.attrList[0]?.groupId + '_' + item.attrList[0]?.id]) {
    groupValueList.push(item.miniZtAttrGroup.actualValue + ':' + inputValues[item.attrList[0]?.groupId + '_' + item.attrList[0]?.id]);
  } else {
    that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
    return '-1';
  }
  return '1';
}
/**
 * 烫金
 * @param item
 * @param groupValueList
 * @param inputValues
 */
export function tangjin(item, groupValueList, inputValues) {
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  for (let j = 0; j < groupValueList.length; j++) {
    if (startWith(groupValueList[j], name)) {
      if ((!item.copy && groupValueList[j].indexOf('烫金1:Foil') !== -1) || (item.copy && groupValueList[j].indexOf('烫金2:Foil') !== -1)) {
        for (let var1 in inputValues) {
          if (inputValues[var1] != null && inputValues[var1] !== '') {
            const groupId = var1.split('_')[0];
            const attrId = var1.split('_')[1];
            const attrItem = getGroupAttr(attrId, groupId);
            if (attrItem && strEquals(attrItem.groupId, item.miniZtAttrGroup.id)) {
              // if (!item.copy && startWith(groupValueList[j], '烫金1:Foil')) {
              //   groupValueList[j] += '_' + inputValues[var1];
              // } else if (item.copy && startWith(groupValueList[j], '烫金2:Foil')) {
              //   groupValueList[j] += '_' + inputValues[var1];
              // }
              groupValueList[j] += '_' + inputValues[var1];
            }
          }
        }
        if (countSubstr(groupValueList[j], '_', false) < 2) {
          groupValueList.splice(j, 1);
          that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
          return '-1';
        }
      }
    }
  }
  return '1';
}

export function fdtangjin(item, groupValueList, inputValues) {
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  for (let j = 0; j < groupValueList.length; j++) {
    if (startWith(groupValueList[j], name)) {
      if ((!item.copy && groupValueList[j].indexOf('烫金浮雕1:Foil') !== -1) || (item.copy && groupValueList[j].indexOf('烫金浮雕2:Foil') !== -1)) {
        for (let var1 in inputValues) {
          if (inputValues[var1] != null && inputValues[var1] !== '') {
            const groupId = var1.split('_')[0];
            const attrId = var1.split('_')[1];
            const attrItem = getGroupAttr(attrId, groupId);
            if (attrItem && strEquals(attrItem.groupId, item.miniZtAttrGroup.id)) {
              // if (!item.copy && startWith(groupValueList[j], '烫金1:Foil')) {
              //   groupValueList[j] += '_' + inputValues[var1];
              // } else if (item.copy && startWith(groupValueList[j], '烫金2:Foil')) {
              //   groupValueList[j] += '_' + inputValues[var1];
              // }
              groupValueList[j] += '_' + inputValues[var1];
            }
          }
        }
        if (countSubstr(groupValueList[j], '_', false) < 2) {
          groupValueList.splice(j, 1);
          that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
          return '-1';
        }
      }
    }
  }
  return '1';
}

export function dbtangjin(item, groupValueList, inputValues) {
  let name = item.miniZtAttrGroup.actualValue !== null && item.miniZtAttrGroup.actualValue !== '' ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.name;
  for (let j = 0; j < groupValueList.length; j++) {
    if (startWith(groupValueList[j], name)) {
      if ((!item.copy && groupValueList[j].indexOf('烫金对裱1:Foil') !== -1) || (item.copy && groupValueList[j].indexOf('烫金对裱2:Foil') !== -1)) {
        for (let var1 in inputValues) {
          if (inputValues[var1] != null && inputValues[var1] !== '') {
            const groupId = var1.split('_')[0];
            const attrId = var1.split('_')[1];
            const attrItem = getGroupAttr(attrId, groupId);
            if (attrItem && strEquals(attrItem.groupId, item.miniZtAttrGroup.id)) {
              // if (!item.copy && startWith(groupValueList[j], '烫金1:Foil')) {
              //   groupValueList[j] += '_' + inputValues[var1];
              // } else if (item.copy && startWith(groupValueList[j], '烫金2:Foil')) {
              //   groupValueList[j] += '_' + inputValues[var1];
              // }
              groupValueList[j] += '_' + inputValues[var1];
            }
          }
        }
        if (countSubstr(groupValueList[j], '_', false) < 2) {
          groupValueList.splice(j, 1);
          that.$message({ type: 'error', message: '请完善' + item.miniZtAttrGroup.name + '信息' });
          return '-1';
        }
      }
    }
  }
  return '1';
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

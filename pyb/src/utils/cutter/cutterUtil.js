//获取属性
import { getVoList } from '@/api/product/attrApi';
import { endWith, startWith, strEquals } from '@/utils/strUtil';
let that = null;

/**
 * 初始化组件
 * @param that
 */
export function cutterInitUtil(_that) {
  that = _that;
}
export async function getCurVoList() {
  await getVoList({
    bindType: that.bindType,
    bindId: that.gCateId,
    whereBindId: that.gSubCateId,
    whereGoodsId: that.gid
  })
    .then(res => {
      if (res.success) {
        var dataList = res.data;
        that.voList = dataList;
        loadFormGroup(0);
        that.formVoList.sort(function(a, b) {
          return a.miniZtAttrGroup.sortOrder - b.miniZtAttrGroup.sortOrder;
        });
      } else {
        console.log(res.message);
      }
    })
    .catch(err => {});
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
}
export function searchByAttrId(attrId) {
  for (let i = 0; i < that.voList.length; i++) {
    const item = that.voList[i];
    for (let inx in item.attrList) {
      if (attrId == item.attrList[inx].id) {
        return item.attrList[inx];
      }
    }
  }
}

export function dataChange() {
  const formData = that.formData;
  var inputValues = formData.inputValues;
  var radioSelectValues = formData.radioSelectValues;
  var selectSelectValues = formData.selectSelectValues;
  console.log(radioSelectValues);
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
          groupValueList.push(attrItem.actualValue);
        }
      }
    }
  }
  // 文本输入框
  for (let i = 0; i < that.formVoList.length; i++) {
    const item = that.formVoList[i];
    if (item.miniZtAttrGroup.groupType === 'input') {
      let str = '';
      for (let var1 in inputValues) {
        const splits = var1.split('_');
        const groupId = splits[0];
        const attrId = splits[1];
        const attrItem = getGroupAttr(attrId, groupId);
        if (attrItem && strEquals(attrItem.groupId, item.miniZtAttrGroup.id)) {
          if (inputValues[var1]) {
            str += attrItem.name + '=' + inputValues[var1] + '&';
          } else {
            str += attrItem.name + '=0&';
          }
        }
      }
      groupValueList.push(str.substring(0, str.length - 1));
    }
  }
  // 下拉框
  for (let i = 0; i < that.formVoList.length; i++) {
    for (let var1 in selectSelectValues) {
      const splits = selectSelectValues[var1].split('_');
      const groupId = splits[0];
      const attrId = splits[1];
      const attrItem = getGroupAttr(attrId, groupId);
      if (strEquals(that.formVoList[i].miniZtAttrGroup.id, attrItem.groupId)) {
        if (attrItem.actualValue) {
          groupValueList.push(attrItem.actualValue);
        }
      }
    }
  }
  var strValue = '';
  for (let i = 0; i < groupValueList.length; i++) {
    strValue += groupValueList[i] + '&';
  }
  that.datastr = strValue.substring(0, strValue.length - 1);
  console.log(strValue);
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
      if (parseFloat(param.value) <= parseFloat(attrItem.maxValue) && parseFloat(param.value) >= parseFloat(attrItem.minValue)) {
        that.changeParam();
      } else {
        if (parseFloat(param.value) > parseFloat(attrItem.maxValue)) {
          that.$message({ type: 'error', message: groupItem.miniZtAttrGroup.name + '不能大于' + attrItem.maxValue });
          that.$set(that.formData.inputValues, param.id, attrItem.maxValue + '');
        } else if (parseFloat(param.value) < parseFloat(attrItem.minValue)) {
          that.$message({ type: 'error', message: groupItem.miniZtAttrGroup.name + '不能小于' + attrItem.minValue });
          that.$set(that.formData.inputValues, param.id, attrItem.minValue + '');
        }
      }
    } else {
      that.changeParam();
    }
  }
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
  const list = getGroupSubItem(attrItem.groupId);
  for (let i = 0; i < list.length; i++) {
    delete that.formData.radioSelectValues[list[i].miniZtAttrGroup.id];
  }
  deleteGroupItem(attrItem.groupId);
  loadDefaultGroup(attrItem.groupId, attrItem.id);
  that.formVoList.sort(listSort);
  that.changeParam();
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
  that.changeParam();
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
 * 排序
 * @param {Object} a
 * @param {Object} b
 */
export function listSort(a, b) {
  return a.miniZtAttrGroup.sortOrder - b.miniZtAttrGroup.sortOrder;
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
          that.$set(that.formData.selectSelectValues, groupItem.miniZtAttrGroup.id, groupItem.miniZtAttrGroup.id + '_' + attr.id);
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

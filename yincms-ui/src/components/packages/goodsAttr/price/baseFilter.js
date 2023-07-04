const filteringConditions = [
  {
    name: '背面处理',
    subCateId: 17
  },
  {
    name: '粘合',
    subCateId: 73
  }
];
/**
 * list 过滤器过滤指定的条件
 * @param {Object}} list
 */
export function listFilter(list, that) {
  // console.log('this.formVoList', listIn);
  if (list.length > 0) {
    let subCateId = that.subCateId;
    for (let index = 0; index < list.length; index++) {
      let item = list[index];
      filterVal(list, index, item, subCateId);
    }
  }
}

function filterVal(list, index, item, subCateId) {
  for (let _con of filteringConditions) {
    if (item.miniZtAttrGroup.name == _con.name && subCateId == _con.subCateId) {
      list.splice(index, 1);
    }
  }
}

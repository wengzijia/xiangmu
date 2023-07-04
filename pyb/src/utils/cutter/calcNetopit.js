var relationSelect = [];

export function buildSelect(voList) {
  if (voList != undefined && voList.length > 0) {
    buildElementList(voList, 'NTZZCZ', 'NTZZKZ');
    buildElementList(voList, 'WHZZCZ', 'WHZZKZ');
  }
}

/**
 * 构建内托选项
 * @param {Object} voList
 */
export function buildElementList(voList, mainCode, SubCode) {
  let tempMain = [];
  let tempSub = [];
  // debugger;
  for (let vo of voList) {
    if (vo.miniZtAttrGroup.code == mainCode) {
      tempMain = vo.attrList;
    } else if (vo.miniZtAttrGroup.code == SubCode) {
      tempSub.push(vo);
    }
  }
  // console.log('---------- temp --------------');
  // console.log(tempMain);
  // console.log(tempSub);
  // 拼接数据
  let temp = [];
  for (let vo of tempMain) {
    for (let inx of tempSub) {
      if (vo.id == inx.miniZtAttrGroup.parentAttrId) {
        temp.push({ select: vo, values: inx.attrList });
      }
    }
  }
  relationSelect[mainCode] = temp;
  // console.log('----------- relSelect -----------');
  // console.log(relationSelect);
}

/**
 *  获取材质属性
 * @param {Object} selectList
 */
function getMapValue(selectList, mainCode) {
  // 主选项
  // debugger;
  let index = 0;
  let mainId = 0;
  let subId = 0;
  for (let i in selectList) {
    if (index == 0) {
      mainId = selectList[i].split('_')[1];
    } else if (index == 1) {
      subId = selectList[i].split('_')[1];
    }
    index++;
  }
  // debugger;
  for (let vo of relationSelect[mainCode]) {
    if (vo.select.id == mainId) {
      for (let bo of vo.values) {
        if (bo.id == subId) {
          return { paperMaterial: vo.select.actualValue, paperWeight: bo.actualValue };
        }
      }
    }
  }
}

/**
 * 计算内托展开长度和外盒成品尺寸
 * @param {Object} hardcover_size  类型
 * @param {Object} length
 * @param {Object} width
 * @param {Object} height
 * @param {Object} voList
 * @param {Object} selectValues
 */
export function calcNetopitSize(hardcover_size, entityAttr, length, width, height, voList, selectValues) {
  // elementList = voList;
  // debugger;
  if (Object.keys(relationSelect) == 0) {
    return 0;
  }
  let valuesList = Object.values(selectValues);
  let gaObj = getMapValue(valuesList.splice(0, 2), 'NTZZCZ');
  let galObj = getMapValue(valuesList.splice(valuesList.length - 2, valuesList.length), 'WHZZCZ');
  let page_type = gaObj.paperMaterial;
  console.log(gaObj);
  console.log(galObj);

  let long = length;
  let wide = width;
  let heigh = height;

  let make_long = length;
  let make_wide = width;
  let make_height = height;

  let entity_long = length;
  let entity_wide = width;
  let entity_height = height;
  console.log('----------------- voList ----------------');
  console.log(voList);
  console.log(selectValues);

  let GA = getExpGA(gaObj);
  let CAL = getExpCAL(galObj);
  let N1 = getExpN1(height);
  let N2 = getExpN2(entityAttr);

  //尺寸类型 0:内托尺寸,1:外盒尺寸 2:实体尺寸
  if (hardcover_size == 0) {
    make_long = parseFloat(long) + parseFloat(GA);
    make_wide = parseFloat(wide) + parseFloat(GA);
    make_height = parseFloat(height) + parseFloat(GA) + parseFloat(CAL) * 2 + 0.5;
  }

  if (hardcover_size == 1) {
    long = parseFloat(make_long) - parseFloat(GA);
    wide = parseFloat(make_wide) - parseFloat(GA);
    height = parseFloat(make_height) - parseFloat(GA) - parseFloat(CAL) * 2 - 0.5;
  }

  if (hardcover_size == 2) {
    long = parseFloat(entity_long) + parseFloat(N1) + parseFloat(N2);
    wide = parseFloat(entity_wide) + parseFloat(N1) + parseFloat(N2);
    height = parseFloat(entity_height) + parseFloat(N1) + parseFloat(N2) + 0.5;
    make_long = parseFloat(long) + parseFloat(GA);
    make_wide = parseFloat(wide) + parseFloat(GA);
    make_height = parseFloat(height) + parseFloat(GA) + parseFloat(CAL) * 2 + 0.5;
  }

  let area_long = 0;
  let area_wide = 0;
  if (page_type == 'page_type=aoa7') {
    area_long = parseFloat(long) + 2 * parseFloat(wide);
    area_wide = parseFloat(height) * 2 - 0.5 + parseFloat(wide) * 2;
  } else {
    area_long = 2 * parseFloat(long) + 2 * parseFloat(wide);
    area_wide = parseFloat(height) + 2 * parseFloat(wide);
  }
  var area = area_long + 'mm * ' + area_wide + 'mm';
  var area2 = make_long + 'mm * ' + make_wide + 'mm * ' + make_height + 'mm';
  return { opensizecls: area, opensizecls2: area2, make_long: make_long, make_wide: make_wide, make_height: make_height };
}

//内托长宽放位
function getExpGA(page) {
  // debugger;
  var AOA = page.paperMaterial.substr(page.paperMaterial.length - 1, 1);
  let pit_weight = page.paperWeight.split('=');
  let weight = 0;
  let cardboard_weight = 0;
  if (pit_weight[0] == 'cardboard_weight') {
    cardboard_weight = pit_weight[1];
  } else if (pit_weight[0] == 'pit_weight') {
    weight = pit_weight[1];
  }
  if (weight == 0) {
    weight = 'aob1';
  }
  if (cardboard_weight == 0) {
    cardboard_weight = 'aoc1';
  }
  var GA = 0;
  // debugger;
  var AOB = weight.substr(weight.length - 1, 1);
  var AOC = cardboard_weight.substr(cardboard_weight.length - 1, 1);
  if ((AOA == 1 && AOB == 1) || (AOA == 2 && AOB == 1) || (AOA == 1 && AOB == 2)) {
    GA = 2;
  }
  if ((AOA == 2 && AOB == 2) || (AOA == 1 && AOB == 4) || (AOA == 5 && AOB == 2) || (AOA == 3 && AOB == 3)) {
    GA = 2.5;
  }
  if ((AOA == 6 && AOB == 2) || (AOA == 2 && AOB == 4) || (AOA == 4 && AOB == 3)) {
    GA = 3;
  }
  if ((AOA == 7 && AOC == 1) || (AOA == 7 && AOC == 2) || (AOA == 7 && AOC == 3)) {
    GA = 1.5;
  }
  return GA;
}

function getExpCAL(page) {
  // debugger;
  let A = page.paperWeight.split('=')[1];
  let sum = 0;
  let num = A.substr(2, 1);
  let sun = A.substr(0, 1);
  if (0 <= num && num < 5) {
    sum = 0.5;
  } else if (5 <= num && num < 10) {
    sum = 1;
  }
  let CAL = sun + sum;
  return CAL;
}

//实物放位1
function getExpN1(heigh) {
  var height = heigh;
  var N1 = 0;
  if (height < 45) {
    N1 = 1.5;
  }
  if (height >= 45) {
    N1 = 2;
  }
  return N1;
}

//实物放位1
function getExpN2(type) {
  var SW = 'sw1';
  SW = type;

  var N2;
  if (SW == 'sw1') {
    N2 = 0;
  }
  if (SW == 'sw2') {
    N2 = 0.5;
  }
  return N2;
}

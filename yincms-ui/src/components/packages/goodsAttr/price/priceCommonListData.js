/**
 * 卡盒自定义公用数据
 * @type {({groupType: string, code: string, name: string, actualValue: string, id: number, attrList: [{code: string, groupId: number, name: string, id: number, suffix: string, inputTips: string}, {code: string, groupId: number, name: string, id: number, suffix: string, inputTips: string}]}|{groupType: string, code: string, name: string, id: number, attrList: [{code: string, defaultValue: string, groupId: number, name: string, id: number, suffix: string, inputTips: string}]}|{groupType: string, code: string, name: string, id: number, attrList: [{code: string, defaultValue: string, groupId: number, name: string, id: number, suffix: string, inputTips: string}]})[]}
 */
export const cartCustomCommonList = [
  {
    groupType: 'input',
    code: 'SIZE',
    name: '展开尺寸',
    actualValue: '展开尺寸',
    id: 100,
    attrList: [
      { id: 101, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 100 },
      { id: 102, code: 'goodAw', suffix: 'mm', name: '宽', inputTips: '宽', groupId: 100 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 5000,
    attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5000 }]
  }
];
/**
 * 卡盒自定义公用数据
 * @type {({groupType: string, code: string, name: string, actualValue: string, id: number, attrList: [{code: string, groupId: number, name: string, id: number, suffix: string, inputTips: string}, {code: string, groupId: number, name: string, id: number, suffix: string, inputTips: string}]}|{groupType: string, code: string, name: string, id: number, attrList: [{code: string, defaultValue: string, groupId: number, name: string, id: number, suffix: string, inputTips: string}]}|{groupType: string, code: string, name: string, id: number, attrList: [{code: string, defaultValue: string, groupId: number, name: string, id: number, suffix: string, inputTips: string}]})[]}
 */
export const tagCommonList = [
  {
    groupType: 'input',
    code: 'SIZE',
    name: '吊牌尺寸',
    actualValue: '展开尺寸',
    id: 100,
    attrList: [
      { id: 101, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 100 },
      { id: 102, code: 'goodAw', suffix: 'mm', name: '宽', inputTips: '宽', groupId: 100 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 5000,
    attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5000 }]
  }
];
/**
 * 公用部分list数据
 */
export const commonViewList = [
  {
    groupType: 'input',
    code: 'SIZE',
    name: '成品外尺寸',
    actualValue: '成品尺寸',
    id: 100,
    attrList: [
      { id: 101, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 100 },
      { id: 102, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 100 },
      { id: 103, code: 'goodAd', suffix: 'x', name: '高', inputTips: '高', groupId: 100 },
      { id: 104, code: 'goodAt', suffix: 'x', name: '局部高度', inputTips: '局部高度', groupId: 100 },
      { id: 105, code: 'goodAx', suffix: 'x', name: '壁厚', inputTips: '壁厚', groupId: 100 },
      { id: 106, code: 'goodAh', suffix: 'x', name: '天盖高', inputTips: '天盖高', groupId: 100 },
      { id: 107, code: 'goodAr', suffix: 'x', name: '半径', inputTips: '半径', groupId: 100 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 5000,
    attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5000 }]
  }
];
/**
 * 外箱刀卡list数据
 */
export const commonViewSwordList = [
  {
    groupType: 'input',
    code: 'SIZE',
    name: '刀卡一尺寸',
    actualValue: '刀卡一尺寸',
    id: 100,
    attrList: [
      { id: 101, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 100 },
      { id: 102, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 100 },
      { id: 103, code: 'goodAd', suffix: 'x', name: '高', inputTips: '高', groupId: 100 },
      { id: 104, code: 'goodAt', suffix: 'x', name: '局部高度', inputTips: '局部高度', groupId: 100 },
      { id: 105, code: 'goodAx', suffix: 'x', name: '壁厚', inputTips: '壁厚', groupId: 100 },
      { id: 106, code: 'goodAh', suffix: 'x', name: '天盖高', inputTips: '天盖高', groupId: 100 },
      { id: 107, code: 'goodAr', suffix: 'x', name: '半径', inputTips: '半径', groupId: 100 }
    ]
  },
  {
    groupType: 'input',
    name: '刀卡一数量',
    code: 'YSSL',
    id: 5000,
    attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5000 }]
  },
  {
    groupType: 'input',
    code: 'TWO_SIZE',
    name: '刀卡二尺寸',
    actualValue: '成品二尺寸',
    id: 200,
    attrList: [
      { id: 201, code: 'goodAls', suffix: 'x', name: '长', inputTips: '长', groupId: 200 },
      { id: 202, code: 'goodAws', suffix: 'mm', name: '宽', inputTips: '宽', groupId: 200 }
    ]
  },

  {
    groupType: 'input',
    name: '刀卡二数量',
    code: 'TKKS',
    id: 9000,
    attrList: [{ id: 9001, code: 'TKKS', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 9000 }]
  }
];
/**
 * 公用部分list数据
 */
export const hardcoverBoxCommonList = [
  {
    groupType: 'input',
    code: 'N_SIZE',
    name: '成品内尺寸',
    actualValue: '成品内尺寸',
    id: 100,
    attrList: [
      { id: 101, code: 'goodAl', suffix: 'x', name: '内长', inputTips: '内长', groupId: 100, min: 45, max: 9999 },
      { id: 102, code: 'goodAw', suffix: 'x', name: '内宽', inputTips: '内宽', groupId: 100, min: 45, max: 9999 },
      { id: 103, code: 'goodAd', suffix: 'x', name: '内高', inputTips: '内高', groupId: 100, min: 20, max: 250 }
    ]
  },
  {
    groupType: 'input',
    code: 'W_INPUT',
    name: '成品外尺寸',
    actualValue: '成品外尺寸',
    id: 200,
    attrList: [
      { id: 201, code: 'goodAl', suffix: 'x', name: '外长', inputTips: '外长', groupId: 200 },
      { id: 202, code: 'goodAw', suffix: 'x', name: '外宽', inputTips: '外宽', groupId: 200 },
      { id: 203, code: 'goodAd', suffix: 'x', name: '外高', inputTips: '外高', groupId: 200 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 5000,
    attrList: [{ id: 5001, code: 'YSSL', defaultValue: '20', suffix: '个', name: '个', inputTips: '个', groupId: 5000, min: 20, max: 99999 }]
  }
];
/**
 * 公用部分list数据
 */
export const pitSbhCommonList = [
  {
    groupType: 'input',
    code: 'BJ1_SIZE',
    name: '部件一展开尺寸',
    actualValue: '部件一展开尺寸',
    id: 100,
    attrList: [
      { id: 101, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 100 },
      { id: 102, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 100 }
    ]
  },
  {
    groupType: 'input',
    code: 'BJ2_SIZE',
    name: '部件二展开尺寸',
    actualValue: '部件二展开尺寸',
    id: 200,
    attrList: [
      { id: 201, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 200 },
      { id: 202, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 200 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 5000,
    attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5000 }]
  }
];
/**
 * 公用部分list数据
 */
export const evaSbhCommonList = [
  {
    groupType: 'input',
    code: 'BJ1_SIZE',
    name: '部件一成品尺寸',
    actualValue: '部件一成品尺寸',
    id: 100,
    attrList: [
      { id: 101, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 100, min: 10, max: 3000 },
      { id: 102, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 100, min: 10, max: 1500 },
      { id: 103, code: 'goodAd', suffix: 'mm', name: '高', inputTips: '高', groupId: 100, min: 2, max: 60 }
    ]
  }
];
export const tkksCommonItem = {
  groupType: 'input',
  name: '同款款数',
  code: 'TKKS',
  id: 9000,
  attrList: [{ id: 9001, code: 'TKKS', defaultValue: '1', suffix: '款', name: '款', inputTips: '款', groupId: 9000 }]
};
export const ysslCommonItem = {
  groupType: 'input',
  name: '印刷数量',
  code: 'YSSL',
  id: 5000,
  attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5000 }]
};
export const dgslCommonItem = {
  groupType: 'input',
  name: '订购数量',
  code: 'YSSL',
  id: 5000,
  attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5000 }]
};
export const ysbsCommonItem = [
  {
    groupType: 'input',
    name: '购买箱数',
    code: 'YSSL',
    id: 5000,
    attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '箱', name: '箱', inputTips: '箱', groupId: 5000, min: 1 }]
  }
];

export const ysbsCommonItemOne = [
  {
    groupType: 'input',
    name: '购买数量',
    code: 'YSSL',
    id: 5000,
    attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '个', name: '个', inputTips: '个', groupId: 5000 }]
  }
];
export const outerBoxAtrrValue = {
  '120g牛卡': 'A',
  '150g牛卡': 'K',
  '90g牛卡': 'B',
  '140g牛卡白': 'W',
  '160g优质牛卡': 'F',
  // '160g牛卡': 'K',
  '90g普芯': '3',
  '110g普芯': '6',
  '120g高强芯': '4',
  '100g高强芯': '4',
  '140g高强芯': '5',
  '50g普芯': '1'
};

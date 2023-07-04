/**
 * 公用部分list数据
 */
export const evaSbhCommonList = [
  {
    groupType: 'input',
    code: 'BJ1_SIZE',
    name: '成品尺寸',
    actualValue: '成品尺寸',
    id: 1,
    attrList: [
      { id: 1, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 1, min: 10, max: 3000 },
      { id: 2, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 1, min: 10, max: 1500 },
      { id: 3, code: 'goodAd', suffix: 'mm', name: '高', inputTips: '高', groupId: 1, min: 2, max: 60 }
    ]
  }
];
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
    id: 1,
    attrList: [
      { id: 1, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 1 },
      { id: 2, code: 'goodAw', suffix: 'mm', name: '宽', inputTips: '宽', groupId: 1 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 2,
    attrList: [{ id: 8, code: 'YSSL', defaultValue: '1', suffix: '个', name: '个', inputTips: '个', groupId: 2, min: 1, max: 50 }]
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
    id: 1,
    attrList: [
      { id: 1, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 1 },
      { id: 2, code: 'goodAw', suffix: 'mm', name: '宽', inputTips: '宽', groupId: 1 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 2,
    attrList: [{ id: 8, code: 'YSSL', defaultValue: '1', suffix: '个', name: '个', inputTips: '个', groupId: 2, min: 1, max: 50 }]
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
    id: 1,
    attrList: [
      { id: 1, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 1 },
      { id: 2, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 1 },
      { id: 3, code: 'goodAd', suffix: 'x', name: '高', inputTips: '高', groupId: 1 },
      { id: 4, code: 'goodAt', suffix: 'x', name: '局部高度', inputTips: '局部高度', groupId: 1 },
      { id: 5, code: 'goodAx', suffix: 'x', name: '壁厚', inputTips: '壁厚', groupId: 1 },
      { id: 6, code: 'goodAh', suffix: 'x', name: '天盖高', inputTips: '天盖高', groupId: 1 },
      { id: 7, code: 'goodAr', suffix: 'x', name: '半径', inputTips: '半径', groupId: 1 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 2,
    attrList: [{ id: 8, code: 'YSSL', defaultValue: '1', suffix: '个', name: '个', inputTips: '个', groupId: 2, min: 1, max: 50 }]
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
    id: 1,
    attrList: [
      { id: 1, code: 'goodAl', suffix: 'x', name: '内长', inputTips: '内长', groupId: 1 },
      { id: 2, code: 'goodAw', suffix: 'x', name: '内宽', inputTips: '内宽', groupId: 1 },
      { id: 3, code: 'goodAd', suffix: 'x', name: '内高', inputTips: '内高', groupId: 1 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 2,
    attrList: [{ id: 8, code: 'YSSL', defaultValue: '1', suffix: '个', name: '个', inputTips: '个', groupId: 2, min: 1, max: 5 }]
  }
];

/**
 * 公用部分list数据
 */
export const hardcoverBoxCommonListOne = [
  {
    groupType: 'input',
    code: 'SIZE',
    name: '成品内尺寸',
    actualValue: '成品内尺寸',
    id: 1,
    attrList: [
      { id: 1, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 1 },
      { id: 2, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 1 },
      { id: 3, code: 'goodAd', suffix: 'x', name: '高', inputTips: '高', groupId: 1 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 2,
    attrList: [{ id: 8, code: 'YSSL', defaultValue: '2', suffix: '个', name: '个', inputTips: '个', groupId: 2, min: 2, max: 2 }]
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
    id: 1,
    attrList: [
      { id: 1, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 1 },
      { id: 2, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 1 }
    ]
  },
  {
    groupType: 'input',
    code: 'BJ2_SIZE',
    name: '部件二展开尺寸',
    actualValue: '部件二展开尺寸',
    id: 2,
    attrList: [
      { id: 3, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 2 },
      { id: 4, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 2 }
    ]
  },
  {
    groupType: 'input',
    name: '印刷数量',
    code: 'YSSL',
    id: 3,
    attrList: [{ id: 8, code: 'YSSL', defaultValue: '1', suffix: '个', name: '个', inputTips: '个', groupId: 3, min: 1, max: 50 }]
  }
];
export const tkksCommonItem = {
  groupType: 'input',
  name: '同款款数',
  code: 'TKKS',
  id: 3,
  attrList: [{ id: 9, code: 'TKKS', defaultValue: '1', suffix: '款', name: '款', inputTips: '款', groupId: 3 }]
};
export const ysslCommonItem = {
  groupType: 'input',
  name: '印刷数量',
  code: 'YSSL',
  id: 2,
  attrList: [{ id: 8, code: 'YSSL', defaultValue: '1', suffix: '个', name: '个', inputTips: '个', groupId: 2, min: 1, max: 50 }]
};
export const outerBoxAtrrValue = {
  '120g牛卡': 'A',
  '90g牛卡': 'B',
  '140g牛卡白': 'W',
  '160g优质牛卡': 'G',
  '160g牛卡': 'K',
  '90g普芯': '3',
  '120g高强芯': '5',
  '100g高强芯': '4',
  '140g高强芯': '6'
};

import { strEquals } from '@/utils/strUtil';

let that = null;

/**
 * 初始化组件
 * @param that
 */
export function quickInitUtil(_that) {
  that = _that;
}
/**
 * 卡纸快捷报价单选
 * @param event
 */
export function cartQuickRadioClick(event) {
  if (event <= 5) {
    for (const key in that.quickFormData.radioSelectValues) {
      if (!strEquals(event, that.quickFormData.radioSelectValues[key])) {
        delete that.quickFormData.radioSelectValues[key];
      }
    }
    for (let i = 0; i < that.quickVoList.length; i++) {
      if (that.quickVoList[i].parentAttrId === event) {
        that.$set(that.quickFormData.radioSelectValues, event + 1, that.quickVoList[i].attrList[0].id);
        break;
      }
    }
  }
}
/**
 * 外箱快捷报价单选
 * @param event
 */
export function quickRadioClick(event) {
  if (event <= 3) {
    for (const key in that.quickFormData.radioSelectValues) {
      if (!strEquals(event, that.quickFormData.radioSelectValues[key])) {
        if (key <= 4) {
          delete that.quickFormData.radioSelectValues[key];
        }
      }
    }
    for (let i = 0; i < that.quickVoList.length; i++) {
      if (that.quickVoList[i].parentAttrId === event) {
        that.$set(that.quickFormData.radioSelectValues, event + 1, that.quickVoList[i].attrList[0].id);
        break;
      }
    }
  } else {
    if (event == 14) {
      for (let i = 0; i < that.quickVoList.length; i++) {
        that.quickVoList[7].show = false;
        if (that.quickVoList[i].id == 7) {
          that.quickVoList[i].show = true;
        }
        if (that.quickVoList[i].parentAttrId === event) {
          console.log('that.quickVoList[i].attrList[0].id', that.quickVoList[i].attrList[0].id);
          that.$set(that.quickFormData.radioSelectValues, that.quickVoList[i].id, that.quickVoList[i].attrList[0].id);
          break;
        }
      }
      if (that.ysm.scCount == 0) {
        that.ysm.scCount = 1;
      }
      delete that.quickFormData.radioSelectValues[8];
    } else if (event == 15) {
      for (let i = 0; i < that.quickVoList.length; i++) {
        if (that.quickVoList[i].id == 8) {
          that.quickVoList[i].show = true;
        }
        if (that.quickVoList[i].id == 7) {
          that.quickVoList[i].show = false;
        }
        if (that.quickVoList[i].parentAttrId === event) {
          that.$set(that.quickFormData.radioSelectValues, that.quickVoList[i].id, [that.quickVoList[i].attrList[0].id, that.quickVoList[i].attrList[1].id]);
          break;
        }
      }
      if (that.ysm.scCount == 0) {
        that.ysm.scCount = 1;
      }
      delete that.quickFormData.radioSelectValues[7];
    } else if (event == 16) {
      that.quickVoList[6].show = false;
      that.quickVoList[7].show = false;
      that.ysm.scCount = 0;
      delete that.quickFormData.radioSelectValues[7];
      delete that.quickFormData.radioSelectValues[8];
    }
  }
}
/**
 * 快捷报价卡盒list数据
 * @type {({groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, id: number}, {code: string, groupId: number, name: string, id: number}, {code: string, groupId: number, name: string, id: number}]}|{groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}]}|{groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}]}|{groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}]})[]}
 */
export const quickViewList = [
  {
    groupType: 'radio',
    name: '纸张材质',
    id: 1,
    parentAttrId: 0,
    attrList: [
      { id: 1, getid: '4759_22625', code: 'DTZ_350G', name: '单铜纸0.45mm (305g~350g)', groupId: 1 },
      { id: 2, getid: '4759_22626', code: 'DTZ_400G', name: '单铜纸0.51mm (345g~400g)', groupId: 1 },
      { id: 3, getid: '4774_30853', code: 'YKZ_375G', name: '银卡纸375g(0.53mm)', groupId: 1 }
      // { id: 4, code: 'DTZ_230G', name: '粉灰纸230g', groupId: 1 },
      // { id: 5, code: 'DTZ_320G', name: '粉灰纸320g', groupId: 1 }
    ]
  },
  {
    groupType: 'radio',
    name: '印刷表处理',
    code: 'YSBCL',
    id: 2,
    parentAttrId: 1,
    attrList: [
      { id: 6, getid: '4759_22625', code: 'DTZ_350G', name: '四色印刷+哑胶', actualValue: '表面处理:哑胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 7, getid: '4759_22625', code: 'DTZ_400G', name: '四色印刷+光胶', actualValue: '表面处理:光胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 8, getid: '4759_22625', code: 'DTZ_400G', name: '四色印刷+光油', actualValue: '表面处理:光油;印刷颜色:多色_CMYK', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '印刷表处理',
    code: 'YSBCL',
    id: 3,
    parentAttrId: 2,
    attrList: [
      { id: 9, getid: '4759_22626', code: 'DTZ_350G', name: '四色印刷+哑胶', actualValue: '表面处理:哑胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 10, getid: '4759_22626', code: 'DTZ_400G', name: '四色印刷+光胶', actualValue: '表面处理:光胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 11, getid: '4759_22626', code: 'DTZ_400G', name: '四色印刷+光油', actualValue: '表面处理:光油;印刷颜色:多色_CMYK', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '印刷表处理',
    code: 'YSBCL',
    id: 4,
    parentAttrId: 3,
    attrList: [
      { id: 12, getid: '4774_30853', code: 'DTZ_350G', name: '四色印刷+白墨+逆向UV', actualValue: '纸张材质:银卡纸_375;表面处理:逆向UV;加印白墨;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 13, getid: '4774_30853', code: 'DTZ_400G', name: '四色印刷+白墨+UV光油', actualValue: '纸张材质:银卡纸_375;表面处理:UV光油;加印白墨;印刷颜色:多色_CMYK', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '印刷表处理',
    code: 'YSBCL',
    id: 5,
    parentAttrId: 4,
    attrList: [
      { id: 14, code: 'DTZ_350G', name: '粉灰纸230g+四色印刷+哑胶', actualValue: '纸张材质:粉灰纸_230;表面处理:哑胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 15, code: 'DTZ_400G', name: '粉灰纸230g+四色印刷+光胶', actualValue: '纸张材质:粉灰纸_230;表面处理:光胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 16, code: 'DTZ_400G', name: '粉灰纸230g+四色印刷+光油', actualValue: '纸张材质:粉灰纸_230;表面处理:光油;印刷颜色:多色_CMYK', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '印刷表处理',
    code: 'YSBCL',
    id: 6,
    parentAttrId: 5,
    attrList: [
      { id: 17, code: 'DTZ_350G', name: '粉灰纸320g+四色印刷+哑胶', actualValue: '纸张材质:粉灰纸_320;表面处理:哑胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 18, code: 'DTZ_400G', name: '粉灰纸320g+四色印刷+光胶', actualValue: '纸张材质:粉灰纸_320;表面处理:光胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 19, code: 'DTZ_400G', name: '粉灰纸320g+四色印刷+光油', actualValue: '纸张材质:粉灰纸_320;表面处理:光油;印刷颜色:多色_CMYK', groupId: 2 }
    ]
  }
];

/**
 * 快捷报价外箱list数据
 * @type {({groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, id: number}, {code: string, groupId: number, name: string, id: number}, {code: string, groupId: number, name: string, id: number}]}|{groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}]}|{groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}]}|{groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}]})[]}
 */
export const quickViewCartonLists = [
  {
    groupType: 'radio',
    name: '纸张类型',
    code: 'ZZLX',
    id: 1,
    parentAttrId: 0,
    show: true,
    attrList: [
      { id: 1, code: 'DTZ_350G', name: '单坑(三层)', actualValue: '纸张类型:单坑', groupId: 1 },
      { id: 2, code: 'DTZ_400G', name: '双坑(五层)', actualValue: '纸张类型:双坑', groupId: 1 },
      { id: 3, code: 'YKZ_375G', name: '三坑(七层)', actualValue: '纸张类型:三坑', groupId: 1 }
    ]
  },
  {
    groupType: 'radio',
    name: '纸张材质',
    code: 'YSBCL',
    id: 2,
    parentAttrId: 1,
    show: true,
    attrList: [
      { id: 4, code: 'DTZ_350G', name: 'B坑+120g牛卡+90g普芯+120g牛卡_A3A', actualValue: '纸张材质:B坑_120g牛卡_90g普芯_120g牛卡_A3A', groupId: 2 },
      { id: 5, code: 'DTZ_400G', name: 'B坑+140g牛卡白+90g普芯+120g牛卡_W3A', actualValue: '纸张材质:B坑_140g牛卡白_90g普芯_120g牛卡_W3A', groupId: 2 },
      { id: 6, code: 'DTZ_350G', name: 'E坑+120g牛卡+90g普芯+120g牛卡_A3A', actualValue: '纸张材质:E坑_120g牛卡_90g普芯_120g牛卡_A3A', groupId: 2 },
      { id: 7, code: 'DTZ_400G', name: 'E坑+140g牛卡白+90g普芯+120g牛卡_W3A', actualValue: '纸张材质:E坑_140g牛卡白_90g普芯_120g牛卡_W3A', groupId: 2 },
      { id: 31, code: 'DTZ_400G', name: 'E坑+150g牛卡+110g普芯+150牛卡_K6K', actualValue: '纸张材质:E坑_150g牛卡_110g普芯_150牛卡_K6K', groupId: 2 },
      { id: 32, code: 'DTZ_400G', name: 'E坑+150g牛卡+90g普芯+120牛卡_K3A', actualValue: '纸张材质:E坑_150g牛卡_90g普芯_120牛卡_K3A', groupId: 2 },
      { id: 25, code: 'DTZ_350G', name: 'C坑+120g牛卡+90g普芯+120g牛卡_A3A', actualValue: '纸张材质:C坑_120g牛卡_90g普芯_120g牛卡_A3A', groupId: 2 },
      { id: 26, code: 'DTZ_400G', name: 'C坑+140g牛卡白+90g普芯+120g牛卡_W3A', actualValue: '纸张材质:C坑_140g牛卡白_90g普芯_120g牛卡_W3A', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '纸张材质',
    code: 'YSBCL',
    id: 3,
    parentAttrId: 2,
    show: true,
    attrList: [
      { id: 8, code: 'DTZ_350G', name: 'BC坑+120g牛卡+90g普芯_50g普芯_90g普芯+90g牛卡_A313B', actualValue: '纸张材质:BC坑_120g牛卡_90g普芯_50g普芯_90g普芯_90g牛卡_A313B', groupId: 2 },
      { id: 9, code: 'DTZ_400G', name: 'BC坑+140g牛卡白+90g普芯_50g普芯_90g普芯+120g牛卡_A313A', actualValue: '纸张材质:BC坑_140g牛卡白_90g普芯_50g普芯_90g普芯_120g牛卡_A313A', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '纸张材质',
    code: 'YSBCL',
    id: 4,
    parentAttrId: 3,
    show: true,
    attrList: [{ id: 10, code: 'DTZ_400G', name: 'BCB坑+160g牛卡+90g普芯+50g普芯+90g普芯+50g普芯+90g普芯+120g牛卡_K31313A', actualValue: '纸张材质:BCB坑_160g牛卡_90g普芯_50g普芯_90g普芯_50g普芯_90g普芯_120g牛卡_K31313A', groupId: 2 }]
  },
  {
    groupType: 'radio',
    name: '粘合',
    code: 'YSBCLS',
    id: 5,
    show: true,
    attrList: [
      { id: 11, code: 'DTZ_400G', name: '胶粘', actualValue: '粘合:胶粘', groupId: 2 },
      { id: 12, code: 'DTZ_400G', name: '打钉', actualValue: '粘合:打钉', groupId: 2 },
      { id: 13, code: 'DTZ_400G', name: '无', actualValue: '粘合:无', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '印刷颜色',
    code: 'YSYS',
    id: 6,
    show: true,
    attrList: [
      { id: 14, code: 'DTZ_400G', name: '单色', actualValue: '印刷颜色:单色', groupId: 2 },
      { id: 15, code: 'DTZ_400G', name: '双色', actualValue: '印刷颜色:双色', groupId: 2 },
      { id: 16, code: 'DTZ_400G', name: '无', actualValue: '印刷颜色:无', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '',
    code: 'YSDS',
    id: 7,
    parentAttrId: 14,
    show: false,
    attrList: [
      { id: 17, code: 'DTZ_400G', name: '青色(C)', actualValue: '_青色', groupId: 2 },
      { id: 18, code: 'DTZ_400G', name: '品红(M)', actualValue: '_品红', groupId: 2 },
      { id: 19, code: 'DTZ_400G', name: '黄色(Y)', actualValue: '_黄色', groupId: 2 },
      { id: 20, code: 'DTZ_400G', name: '黑色(K)', actualValue: '_黑色', groupId: 2 }
    ]
  },
  {
    groupType: 'checkbox',
    name: '',
    code: 'YSSS',
    id: 8,
    parentAttrId: 15,
    show: false,
    attrList: [
      { id: 21, code: 'DTZ_400G', name: '青色(C)', actualValue: '_青色', groupId: 2 },
      { id: 22, code: 'DTZ_400G', name: '品红(M)', actualValue: '_品红', groupId: 2 },
      { id: 23, code: 'DTZ_400G', name: '黄色(Y)', actualValue: '_黄色', groupId: 2 },
      { id: 24, code: 'DTZ_400G', name: '黑色(K)', actualValue: '_黑色', groupId: 2 }
    ]
  }
];

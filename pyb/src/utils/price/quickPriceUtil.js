import {strEquals} from "@/utils/strUtil";

let that = null;

/**
 * 初始化组件
 * @param that
 */
export function quickInitUtil(_that) {
  that = _that;
}

/**
 * 快捷报价单选
 * @param event
 */
export function quickRadioClick(event) {
  if (event <= 3) {
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
 * 快捷报价list数据
 * @type {({groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, id: number}, {code: string, groupId: number, name: string, id: number}, {code: string, groupId: number, name: string, id: number}]}|{groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}]}|{groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}]}|{groupType: string, name: string, parentAttrId: number, id: number, attrList: [{code: string, groupId: number, name: string, actualValue: string, id: number}, {code: string, groupId: number, name: string, actualValue: string, id: number}]})[]}
 */
export const quickViewList = [
  {
    groupType: 'radio',
    name: '纸张材质',
    id: 1,
    parentAttrId: 0,
    attrList: [
      { id: 1, code: 'DTZ_350G', name: '单铜纸350g', groupId: 1 },
      { id: 2, code: 'DTZ_400G', name: '单铜纸400g', groupId: 1 },
      { id: 3, code: 'YKZ_375G', name: '银卡纸375g', groupId: 1 }
    ]
  },
  {
    groupType: 'radio',
    name: '印刷表处理',
    code: 'YSBCL',
    id: 2,
    parentAttrId: 1,
    attrList: [
      { id: 4, code: 'DTZ_350G', name: '单铜纸350g+四色印刷+哑胶', actualValue: '纸张材质:单铜纸_350;表面处理:哑胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 5, code: 'DTZ_400G', name: '单铜纸350g+四色印刷+光胶', actualValue: '纸张材质:单铜纸_350;表面处理:光胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 6, code: 'DTZ_400G', name: '单铜纸350g+四色印刷+光油', actualValue: '纸张材质:单铜纸_350;表面处理:光油;印刷颜色:多色_CMYK', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '印刷表处理',
    code: 'YSBCL',
    id: 3,
    parentAttrId: 2,
    attrList: [
      { id: 7, code: 'DTZ_350G', name: '单铜纸400g+四色印刷+哑胶', actualValue: '纸张材质:单铜纸_400;表面处理:哑胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 8, code: 'DTZ_400G', name: '单铜纸400g+四色印刷+光胶', actualValue: '纸张材质:单铜纸_400;表面处理:光胶;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 9, code: 'DTZ_400G', name: '单铜纸400g+四色印刷+光油', actualValue: '纸张材质:单铜纸_400;表面处理:光油;印刷颜色:多色_CMYK', groupId: 2 }
    ]
  },
  {
    groupType: 'radio',
    name: '印刷表处理',
    code: 'YSBCL',
    id: 4,
    parentAttrId: 3,
    attrList: [
      { id: 10, code: 'DTZ_350G', name: '银卡纸375g+四色印刷+白墨+逆向UV', actualValue: '纸张材质:银卡纸_375;表面处理:逆向UV;加印白墨;印刷颜色:多色_CMYK', groupId: 2 },
      { id: 11, code: 'DTZ_400G', name: '银卡纸375g+四色印刷+白墨+UV光油', actualValue: '纸张材质:银卡纸_375;表面处理:UV光油;加印白墨;印刷颜色:多色_CMYK', groupId: 2 }
    ]
  }
];

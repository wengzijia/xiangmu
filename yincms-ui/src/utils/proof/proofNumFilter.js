import { strEquals } from '@/utils/strUtil';
import { defaultFormData, defaultPriceFormData } from '@/utils/proof/proofPriceUtil';
const filteringConditions = [
  {
    cateId: '2',
    max: 6
  },
  {
    subCateId: '39',
    max: 5
  }
];
const numFilteringConditions = [
  {
    cateId: '1',
    max: 50
  },
  {
    cateId: '1',
    attr: '单铜纸',
    max: 50
  },
  {
    cateId: '1',
    attr: '粉灰纸',
    max: 50
  },
  {
    cateId: '1',
    attr: '银卡纸',
    max: 20
  },
  {
    cateId: '1',
    attr: '金卡纸',
    max: 20
  },
  {
    cateId: '1',
    attr: '哑银卡纸',
    max: 20
  },
  {
    cateId: '1',
    attr: '拉丝银',
    max: 20
  },
  {
    cateId: '1',
    attr: '镭射银',
    max: 20
  },
  {
    cateId: '1',
    attr: '浅牛卡纸',
    max: 10
  },
  {
    cateId: '1',
    attr: '美国牛卡纸',
    max: 10
  },
  {
    cateId: '1',
    attr: '南雄精牛纸',
    max: 10
  },
  {
    cateId: '2',
    max: 6
  },
  {
    cateId: '3',
    max: 5
  },
  {
    cateId: '6',
    max: 50
  },
  {
    cateId: '7',
    max: 10
  },
  {
    cateId: '4',
    subCateId: '34',
    max: 50
  },
  {
    cateId: '4',
    subCateId: '36',
    max: 5
  },
  {
    cateId: '4',
    subCateId: '37',
    max: 5
  },
  {
    cateId: '4',
    subCateId: '38',
    max: 5
  },
  {
    cateId: '4',
    subCateId: '39',
    max: 5
  }
];
/**
 * list 过滤器过滤指定的条件
 * @param {Object}} list
 */
export async function numFilter(item, strVal, that, yssl) {
  let subCateId = that.$route.query.subCateId;
  let cateId = that.$route.query.cateId;
  return filterVal(item, strVal, cateId, subCateId, that, yssl);
}

function filterVal(item, strVal, cateId, subCateId, that, yssl) {
  var attrFlagNum = 0;
  var subCateIdNum = 0;
  var cateIdNum = 0;
  var attrName = '';
  for (let _con of numFilteringConditions) {
    let attrFlag = _con.attr ? _con.attr : false;
    if (cateId == _con.cateId) {
      if (attrFlag) {
        if (strVal.indexOf(_con.attr) != -1) {
          attrFlagNum = _con.max;
          attrName = _con.attr;
        }
      }
      if (subCateId == _con.subCateId) {
        subCateIdNum = _con.max;
      }
      cateIdNum = _con.max;
    }
  }
  if (attrFlagNum > 0 || subCateIdNum > 0 || cateIdNum > 0) {
    item.max = attrFlagNum > 0 ? attrFlagNum : subCateIdNum > 0 ? subCateIdNum : cateIdNum;
    console.log(yssl, item.max);
  }
  if (yssl > item.max) {
    that.$message({ type: 'error', message: attrName + '最大数量不能超过' + item.max + '个' });
    // that.priceFormData = JSON.parse(JSON.stringify(defaultPriceFormData));
    that.priceFormData.yssl = 1;
    return false;
  }
  return true;
}

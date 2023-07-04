import { computed } from "vue";
import { sortByLetterMap } from "./maps/commonMap";


/**
 * @param { String } fullPath
 * @returns { undefined | String }
 * @describe 接收一个fullPath类型URL字符串，返回一个根据 / 切割的数组
 */
export const splitFullPath = (fullPath) => {
  if (!fullPath) {
    return undefined;
  }

  return fullPath.substring(1).split("/");
};

/**
 * @param { String } mobile
 * @returns { Boolean }
 * @describe 接收手机号字符串, 判断是否符合手机号格式，返回Boolean值
 */
export const isMobile = (mobile) => {
  if (!mobile) {
    return false;
  }

  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;

  return reg.test(mobile);
};

/**
 * @param { String } str
 * @returns { Boolean }
 * @describe 接收字符串, 判断是否符合字母、中文、数字、下划线格式，返回Boolean值
 */
export const isLegitimateString = (str) => {
  if (!str) {
    return false;
  }

  const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;

  return reg.test(str);
};

/**
 * @param { String } text
 * @param { Number } index
 * @returns { String }
 * @describe 接收参数text, index, 返回根据字母后置排序的文本，超出字母数排序从头起排，添加no序号
 */
export const getSortByLetterText = computed(() => (text, index) => {
  if (!text) {
    return "";
  }

  let mapIndex = index + 1;

  if (mapIndex > 25) {
    let no = parseInt(index / 25, 10);
    mapIndex = (index % 25) + 1;
    return `${text}${sortByLetterMap[mapIndex]}${no}`;
  } else {
    return `${text}${sortByLetterMap[mapIndex]}`;
  }
});






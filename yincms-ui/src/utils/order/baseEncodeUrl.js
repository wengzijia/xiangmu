const baseUrl = 'http://alifile.xiaocaiyin.com/';
const downloadUrl = '/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName=';

/**
 * 字符串连接，取尾部进行字符串编码的转换
 *
 * @param {object} url
 */
export function encodeUrlSpecial(url) {
  if (url) {
    if (typeof url == 'string') {
      var sourceUrl = url;
      let sourceUrl01 = replaceAll(sourceUrl, '#', '%23');
      let sourceUrl02 = replaceAll(sourceUrl01, ';', '%3B');
      let sourceUrl03 = replaceAll(sourceUrl02, '+', '%2B');
      return sourceUrl03;
    }
  }
  return url;
}

function replaceAll(str, nSymobls, oSymbols) {
  if (str == undefined || str == null || str == '') {
    return '';
  }
  let ls = str.split(nSymobls);
  let newStr = '';
  for (let i = 0; i < ls.length; i++) {
    if (i < ls.length - 1) {
      newStr += ls[i] + oSymbols;
    } else {
      newStr += ls[i];
    }
  }
  return newStr;
}

/**
 * 下载或者查看
 * @param {string} url
 */
export function downloadOrView(url) {
  if (url) {
    const reg = /\.(mp4|ARD|ai|zip|cdr|dxf|psd|eps)$/;
    const extension = reg.test(url);
    if (extension) {
      return downloadUrl + url;
    } else {
      return baseUrl + url;
    }
  }
  return '';
}

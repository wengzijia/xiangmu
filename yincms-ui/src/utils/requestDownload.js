import axios from 'axios';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { Message } from 'element-ui';
export function downloadFile(url, parameter, callback) {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const queryArgs = {
    url,
    method: 'post',
    data: parameter,
    responseType: 'blob',
    headers: {
      token: token,
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      withCredentials: true
    }
  };
  // tips: 这里直接返回的是response整体!
  return axios
    .request(queryArgs)
    .then(response => {
      if (response.headers['content-type'].indexOf('application/json') != -1) {
        const blob = new Blob([response.data], { type: 'application/json' });
        var reader = new FileReader();
        reader.readAsText(blob, 'utf-8');
        reader.onload = function() {
          const data = JSON.parse(this.result);
          callback(data);
        };
      } else {
        convertRes2Blob(response);
      }
    })
    .catch(err => console.log(err));
}
export function convertRes2Blob(response) {
  // 提取文件名
  let contentDisposition = response.headers['content-disposition'];
  let split = contentDisposition.split(';');
  let fileName = 'temp.pdf';
  for (let index in split) {
    if (split[index].indexOf('=') !== -1) {
      let item = split[index].split('=');
      if (item[0] === 'fileName') {
        fileName = item[1];
        break;
      }
    }
  }
  // 将二进制流转为blob
  const blob = new Blob([response.data], { type: 'application/octet-stream' });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(fileName));
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob);
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', decodeURI(fileName));
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    // 挂载a标签
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL);
  }
}

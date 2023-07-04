/**
 * 用于辅助导出文件 
 * (用于ajax post请求直接返回bold文件流的方式导出)
 * 
 * 示例：
  import { getToken } from '@/utils/commonApi'
  import * as blobDownload from '@/utils/blobDownload'
  export function msExport(data) {
      const token = getToken()  // || '0cc428fd1fcd4d7cbdb81fc802fd6723_sms'
      return new Promise((resolve,reject)=>{
          axios({
              url: `/api/mes/settle/bill/billDetail/exportBill`,
              baseURL: import.meta.env.VITE_APP_BASE_API,
              method: 'POST',
              data,
              headers: {'Content-Type':'application/json','token':token},
              responseType: 'arraybuffer'
            }).then( res => {
              if(blobDownload.isStream) {
                let fileName = blobDownload.getFileName()
                blobDownload.download(res, fileName)
                resolve(res, fileName)
              } else if(res.headers['content-type'].includes('application/json')) {
                let enc = new TextDecoder('utf-8')
                resolve(enc.decode(new Uint8Array(res.data)))
              }
            }).catch( err => {
              reject(err)
            })
      })
  };
 * /

/**
 * 检验返回数据是否是文件流
 * @param {*} res 
 * @returns 
 */
export function isStream(res){
  console.log(6666,res.headers['content-type'],res);
  return  res.headers['content-type'].includes('application/octet-stream')
}

/**
 * 获取文件名称
 * @param {*} res 
 */
export function getFileName(res){
  // /* 截取头部获取文件名 utf8转中文 */
  let str = res.headers['content-disposition']
  return decodeURI(str.split('=')[1].split('.xls')[0])
}

/**
 * 导出文件 
 * (bold文件流方式导出)
 * @param {*} res 
 * @param {*} fileName 
 */
export function download(res, fileName) {
    var blob = new Blob([res.data])
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = (e) => {
      const a = document.createElement('a')
      a.download = `${fileName}.xls`
      a.href = e.target.result
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
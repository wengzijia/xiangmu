import {downloadZip,download} from  '@/utils/request2'

// 单个下载
export function singleDownload(address) {
  return download('/alibaba/oss/downloadFile',address)
}


// 文件压缩下载
export function zipDownload(data,filename=new Date().getTime()+'.zip') {
  return downloadZip("/alibaba/oss/zipDownload",data,filename);
}
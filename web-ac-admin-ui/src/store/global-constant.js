import {parseTime} from '@/utils/ruoyi'
import useUserStore from '@/store/modules/user'
export const BASE_FILE_URL = "https://alifile.xiaocaiyin.com/"; 
export const BASE_UPLOAD_FILE_URL = function(folderRoot='filemanage'){
  return '/api/consumer/alibaba/oss/uploadFile?folder='+folderRoot+'/'+useUserStore().userInfo.userId+'/'+parseTime(new Date(),'{y}{m}/')+new Date().getTime()+'/'
}
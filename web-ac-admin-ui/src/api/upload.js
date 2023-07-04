import request from '@/utils/request2'
import {BASE_UPLOAD_FILE_URL} from "@/store/global-constant";


export function uploadefile(data,folder) {
  let url = BASE_UPLOAD_FILE_URL(folder)
    return request({
      url: url.replace('/api/consumer',''),
      method: "post",
      data,
      headers:{repeatSubmit:false}
    });
  }
import {http} from "../utils/request.js"
const BESA_URL = `/consumer`;


// 获取展厅信息
export function geinInformation(data){
  return http({
      url: BESA_URL+'/picture/enterprise/miniWechatPictureAdSetting/geinInformation?enterpriseCode='+data.enterpriseCode,
      method:'post',
      data
    });
}



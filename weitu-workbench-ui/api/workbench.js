import {http} from "../utils/request.js"
const BESA_URL = `/consumer`;

// 获取当前登录用户信息(详细)
export function geinPictureUserInfo(data){
  return http({
      url: BESA_URL + '/user/miniWechatPictureUser/weChat/geinPictureUserInfo',
      method:'post',
      data
    });
}

// 企业管理员获取我的访问记录(我的访客)
export function gainEnterpriseAdministrator(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureVisitorRecord/gainEnterpriseAdministrator',
      method:'post',
      data
    });
}

// 企业管理员获取企业访客
export function gainCorporateVisitor(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureVisitorRecord/gainCorporateVisitor',
      method:'post',
      data
    });
}

// 获取营销模板
export function gainEnterpriseTemplate(data){
  return http({
      url: BESA_URL + '/picture/miniWechatPictureEnterpriseTemplate/gainEnterpriseTemplate',
      method:'post',
      data
    });
}

// 获取模板详情
export function gainPdfChangeImgTemplate(data){
  return http({
      url: BESA_URL + '/picture/miniWechatPictureEnterpriseTemplate/gainPdfChangeImgTemplate',
      method:'post',
      data
    });
}

// 获取当前微信小程序用户的推荐码
export function getWeChatMiniReferralCode(data){
  return http({
      url: BESA_URL + '/user/miniWechatPictureUser/weChat/getWeChatMiniReferralCode',
      method:'post',
      data
    });
}
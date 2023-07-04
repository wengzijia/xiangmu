import { getTopNav, getSubNav } from '@/utils/cateNavsUtil';
import store from '@/store';
export function getSubCateId(that) {
  let subCateInfo = getSubNav(that.$store.getters.cutterCateNavs, that.$route.query.cateId, that.$route.query.subCateId);
  console.log(subCateInfo);
  return subCateInfo.moldCateId;
}

export function getCateId(that) {
  let subCateInfo = getTopNav(that.$store.getters.cutterCateNavs, that.$route.query.cateId);
  console.log(subCateInfo);
  return subCateInfo.data.moldCateId;
}

export function reported(actionId, channel) {
  var postData = {
    actionId: actionId || 0,
    appId: 1,
    channel: channel || 0,
    // channelName: channelName||'',
    // appName:'傲彩官网',
    // actionName:actionName||'',
    // desc: '',
    // extId: 0,
    // ip: '8.8.8.8',
    // param: '',
    // timestramp: 0,
    uid: store?.getters?.userInfo?.id || ''
    // version: 0
  };
  console.log('store', postData);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/v1/action/reported', true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify(postData));
}

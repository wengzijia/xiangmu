import request from '@/utils/request2';

// 验证aocai.cn的token是否过期
export function checkToken() {
  return request({
    url: '/certifyFree/user/checkToken',
    method: 'post',
    headers:{repeatSubmit:false }
  })
}

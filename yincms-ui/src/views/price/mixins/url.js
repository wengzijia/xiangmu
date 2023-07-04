export function iframeUrl () {
  // console.log('环境判断', process.env.NODE_ENV);
  let url
  let origin = window.origin
  // console.log('origin', origin);
  if (process.env.NODE_ENV == 'development') { // 开发环境
    url = '*'
  } else if (origin == 'https://www.aocai.cn') { // 正式环境
    url = 'https://admin.aocai.cn' // 后台正式环境
  } else if (origin == 'http://192.168.1.222:8000') { // 测试环境不针对发送
    url = '*' // 测试环境
  } else if (origin == 'http://192.168.1.222:8001') { // 测试环境不针对发送
    url = '*' // 测试环境
  } else if (origin == 'http://test.aocai.cn:10002') { // 测试环境不针对发送
    url = '*' // 测试环境
  } else if (origin == 'http://dev.aocai.cn:10002') { // 测试环境不针对发送
    url = '*' // 测试环境
  } else if (origin == 'http://dev2.xiaocaiyin.com:10002') { // 测试环境不针对发送
    url = '*' // 测试环境
  }
  return url
}
export function isReceive(url) {
  let receive = false;
  let origin = window.origin; // 当前的 ip 地址
  let urls = [
    // iframe 接收的域名
    'https://admin.aocai.cn' // 后台正式环境
    // 'http://192.168.1.222' // 后台测试环境
  ]
  if (process.env.NODE_ENV == 'development') {
    // 开发环境
    receive = true;
  } else if (origin == 'https://www.aocai.cn' && urls.findIndex(e => e == url) != -1) {
    // 如果是正式环境则判断是否在名单里面
    receive = true;
  } else if (origin != 'https://www.aocai.cn') {
    // 非正式则测试  测试默认为 true
    receive = true;
  }
  return receive;
}

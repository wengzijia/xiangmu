import store from '@/store'
export const setDocumentTitle = function(title) {
  document.title = title;
  const ua = navigator.userAgent;
  const html = document.getElementsByTagName('html')[0];
  html.lang = 'zh_CN';
  console.log('title',title);
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe');
    i.src = '/favicon.ico';
    i.style.display = 'none';
    i.onload = function() {
      setTimeout(function() {
        i.remove();
      }, 9);
    };
    document.body.appendChild(i);
  }
  
  
};
export const setKeywords = function(keywords, description) {
  if (keywords) {
    const i = document.createElement('meta');
    i.name = 'keywords';
    i.content = keywords;
    document.head.appendChild(i);
  }
  if (description) {
    const i = document.createElement('meta');
    i.name = 'description';
    i.content = description;
    document.head.appendChild(i);
  }
};

/**
 * 钉钉设置页面title
 * @param {string} title 页面的头部内容
 */
export const ddSetDomTitle = function(title){
  if(store.state.user.isShowNav!==1){
    window.dd.biz.navigation.setTitle({
      title:title||'拼一版' ,//控制标题文本，空字符串表示显示默认文本
      onSuccess : function(result) {
        console.log('setTitle',result);
        store.dispatch('IS_SHOW_NAV',0)
          /*结构
          {
          }*/
      },
      onFail : function(err) {
        console.log('setTitle',err);
        setDocumentTitle(title||'拼一版')
        store.dispatch('IS_SHOW_NAV',1)
      }
    });
  }else{

    setDocumentTitle(title||'拼一版')
  }
}



export const domTitle = '拼一版';

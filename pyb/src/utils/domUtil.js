export const setDocumentTitle = function(title) {
  document.title = title;
  // console.log('document',document.title);
  const ua = navigator.userAgent;
  const html = document.getElementsByTagName('html')[0];
  html.lang = 'zh_CN';
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
    let i = document.querySelector('meta[name="keywords"]');
    if (!i) {
      i = document.createElement('meta');
      i.name = 'keywords';
      i.content = keywords;
      document.head.appendChild(i);
    } else {
      i.name = 'keywords';
      i.content = keywords;
    }
  }
  if (description) {
    let i = document.querySelector('meta[name="description"]');
    if (!i) {
      i = document.createElement('meta');
      i.name = 'description';
      i.content = description;
      document.head.appendChild(i);
    } else {
      i.name = 'description';
      i.content = description;
    }
  }
};

export const domTitle = '拼一版';

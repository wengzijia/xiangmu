/****
 ****傲彩手机端
 ****安卓开发工程师王冰冰qq:809479912@qq.com
 ****联系电话:18191424883
 ****官网:www.xiaocayin.com  主要js
 ****/
(function() {
  //分类筛选项
  $('#spanA_201711031443>a').bind('click', function() {
    $(this)
      .addClass('selected')
      .siblings()
      .removeClass('selected');
  });
  /*筛选start*/
  $(function() {
    //滑屏
    $('#wbb91-connect_11291351').on('click', function() {
      $('div.slide-mask').show();
      $('aside.slide-wrapper-11291354').addClass('moved');
      $('body').css('overflow-y', 'hidden');
    });
    //取消退出
    $('a.wbb-yinshuaciazhi-top-a').click(function() {
      $('aside.slide-wrapper-11291354').removeClass('moved');
      $('div.slide-mask').hide();
      $('body').css('overflow-y', 'auto');
    });
    //确定
    $('a.wbb-yinshuaciazhi-top-b').click(function() {
      $('aside.slide-wrapper-11291354').removeClass('moved');
      $('div.slide-mask').hide();
      $('body').css('overflow-y', 'auto');
    });
  });
  /*筛选end*/
})();

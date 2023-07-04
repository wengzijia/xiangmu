<!-- fengjianbo -->
<template>
  <div>
    <div class="footBottom">
      <div class="comBox">
        <p class="footBottomPt">
          <router-link to="/news/detail?id=169" >文件规范要求</router-link>
          <router-link to="/news/detail?id=63">彩盒检验标准</router-link>
          <router-link to="/news/detail?id=97">联系我们</router-link>
        </p>
        <p class="footBicp"><a href="//beian.miit.gov.cn" rel="nofollow" target="_blank">粤ICP备17066124号</a><span>|</span>版权所有 深圳市七彩祥云信息技术有限公司</p>
        <!-- <p class="footBicp" style="font-size:14px;color:#ccc">拼一版智能报价系统、智能刀模系统、智能拼版系统已经取得国家软件著作权与专利证书，受国家法律保护，<span style="color:red">未经许可，冒用必究！</span></p> -->
        <!--        <p>拼一版智能报价系统、智能刀模系统、智能拼版系统已经取得国家软件著作权与专利证书，受国家法律保护，<span class="red">未经许可，冒用必究！</span></p>-->
        <div class="footBimgBx">
          <a href="//cn.unionpay.com/" class="footBimg1"></a>
          <a href="//www.alipay.com/" class="footBimg2"></a>
          <a href="//szcert.ebs.org.cn/12d872e3-f165-4c0c-8c62-1b9d9ac92bba" class="footBimg3"></a>
        </div>
      </div>
    </div>
    <div class="livechat-girl animated" @mousemove="hoverMove(false)" @mouseout="hoverOut(false)">
      <a href="//wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDgyMjAwNl80NzE5OTVfODAwODIyMDA2XzJf" target="_blank" class="im-qq qq-a" title="在线QQ客服">
        <img class="girl" src="@/static/active/images/en_3.png" />
        <div :class="'livechat-hint rd-notice-tooltip rd-notice-type-success rd-notice-position-left single-line ' + (showClass ? 'show_hint' : '')">
          <div class="rd-notice-content">嘿，我来帮您！</div>
        </div>
      </a>
      <div :class="'animated-circles' + (showClass ? ' animated' : '')">
        <div class="circle c-1"></div>
        <div class="circle c-2"></div>
        <div class="circle c-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FootBottom',
  data() {
    return {
      showClass: false
    };
  },
  created() {
    const _this = this;
    setInterval(function() {
      _this.showClass = !_this.showClass;
    }, 3000);
  },
  methods: {
    hoverMove(val) {
      const _this = this;
      _this.showClass = true;
    },
    hoverOut(val) {
      const _this = this;
      _this.showClass = false;
    }
  }
};
</script>
<style scoped src="../../static/index/css/new/public.css" />
<style scoped src="../../static/active/css/css.css" />

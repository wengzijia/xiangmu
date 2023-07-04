<!-- fengjianbo -->
<template>
  <div>
    <div class="Awbanner">
      <div class="Aw_cont">
        <div class="AwbannerTxt">
          <h2>傲彩包装魔术手</h2>
          <p class="AwbannerTxt_p"><span class="red">免费</span>的Adobe Illustrator包装专业插件</p>
          <div class="AwbannerTxtDv">
            <a href="https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/uploads/plugin/xiaocaiyin.exe" download="傲彩包装魔术手.exe" class="AwbannerTxt_bnt">立即下载</a>
            <!--<span  class="Txtips">适用版本  Adobe Illustrator CC 2017 <br/>Adobe Illustrator CC 2018</span>-->
            <span class="Txtips" style="font-size: 17px;">windows系统专用</span>
          </div>
          <div class="AwbannerTxt_f16"><router-link to="/plug/install" target="_blank">安装教程</router-link> | <router-link to="/plug/explain" target="_blank">使用说明</router-link></div>
        </div>
      </div>
    </div>
    <!--banner-->

    <div class="Awaper">
      <ul class="Awaper_cont">
        <li class="Awaper_file">
          <div class="Awaper_cont-left" :style="Awaper_file_left">
            <em></em>
            <h3>新建包装文件</h3>
            <h6>自动内嵌盒型结构，直接<span class="red">省去</span>包装结构设计</h6>
            <p>从<span class="red">盒型</span>新建文件、从模板新建文件，无论专业<br />包装设计师，还是包装设计小白，都可轻松开始包装设计工作</p>
          </div>
          <div class="Awaper_cont-right" :style="Awaper_file_right"></div>
        </li>

        <li class="Awaper_make">
          <div class="Awaper_cont-left" :style="Awaper_make_right">
            <em></em>
            <h3>包装制作</h3>
            <h6>开发集成了<span class="red">80多种</span>文件设计、文件制作、印前<span class="red">拼版</span>功能</h6>
            <p>基于<span class="red">60000份</span>包装设计文稿的处理工作，我们重新思考了设计、<br />制作、拼版的工作，让工作成为享受</p>
          </div>
          <div class="Awaper_cont-right" :style="Awaper_make_left"></div>
        </li>

        <li class="Awaper_order">
          <div class="Awaper_cont-left" :style="Awaper_order_left">
            <em></em>
            <h3>报价下单</h3>
            <h6>单款自拼报价、多款混拼报价，<span class="red">100个</span>起印，一键下单</h6>
            <p>一键报出订单<span class="red">总价</span>、包装单价、生产货期、物流费用，多种品类，<br />一键下单，在线支付，<span class="red">准时</span>交付，保证质量，<br />琐碎的生产交付工作交给我们！</p>
          </div>
          <div class="Awaper_cont-right" :style="Awaper_order_right"></div>
        </li>
      </ul>

      <div class="Awfoot">
        <div class="Aw_cont">
          <h2>傲彩包装魔术手</h2>
          <h3><span class="red">免费</span>的Adobe Illustrator包装专业插件</h3>
          <a href="https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/uploads/plugin/xiaocaiyin.exe" download="傲彩包装魔术手.exe" class="Awfoot_bnt"> 立即下载 <i class="el-icon-download"></i> </a>
          <p>已有<span class="red">68500人</span>在使用</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Awaper_file_left: '',
      Awaper_file_right: '',
      Awaper_make_left: '',
      Awaper_make_right: '',
      Awaper_order_left: '',
      Awaper_order_right: ''
    };
  },
  methods: {
    handleScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop; // 滚动条偏移量
      var _this = this;
      if (this.Awaper_file_left == '' && scrollTop > 200) {
        var timesRun1 = -800;
        var interval1 = setInterval(function() {
          timesRun1 += 25;
          _this.Awaper_file_left = 'left: ' + timesRun1 + 'px; visibility: visible;';
          _this.Awaper_file_right = 'right:' + timesRun1 + 'px; visibility: visible;';
          if (timesRun1 > 0) {
            clearInterval(interval1);
          }
        }, 10);
      }
      if (this.Awaper_make_left == '' && scrollTop > 500) {
        var timesRun2 = -800;
        var interval2 = setInterval(function() {
          timesRun2 += 25;
          _this.Awaper_make_left = 'left: ' + timesRun2 + 'px; visibility: visible;';
          _this.Awaper_make_right = 'right:' + timesRun2 + 'px; visibility: visible;';
          if (timesRun2 > 0) {
            clearInterval(interval2);
          }
        }, 10);
      }
      if (this.Awaper_order_left == '' && scrollTop > 1100) {
        var timesRun3 = -800;
        var interval3 = setInterval(function() {
          timesRun3 += 25;
          _this.Awaper_order_left = 'left: ' + timesRun3 + 'px; visibility: visible;';
          _this.Awaper_order_right = 'right:' + timesRun3 + 'px; visibility: visible;';
          if (timesRun3 > 0) {
            clearInterval(interval3);
          }
        }, 10);
      }
    }
  },
  created() {
    var _this = this;
    var timesRun1 = -800;
    var interval1 = setInterval(function() {
      timesRun1 += 25;
      _this.Awaper_file_left = 'left: ' + timesRun1 + 'px; visibility: visible;';
      _this.Awaper_file_right = 'right:' + timesRun1 + 'px; visibility: visible;';
      if (timesRun1 > 0) {
        clearInterval(interval1);
      }
    }, 10);
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll); // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
  }
};
</script>
<style scope src="../../static/index/css/plug.css?202003031631" />
<style scope src="../../static/mulindex/css/fonts.css" />
<style scope src="../../static/mulindex/css/public.css" />
<style scoped></style>

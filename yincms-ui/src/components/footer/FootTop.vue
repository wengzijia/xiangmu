<!-- fengjianbo -->
<template>
  <div class="footTop">
    <div class="comBox">
      <ul class="footEnsure">
        <li><img src="@/static/mulindex/img/foot1.png" /></li>
        <li><img src="@/static/mulindex/img/foot2.png" /></li>
        <li><img src="@/static/mulindex/img/foot3.png" /></li>
        <li><img src="@/static/mulindex/img/foot4.png" /></li>
      </ul>
      <div class="footTxtBx">
        <ul class="footTxtUl">
          <li>
            <h2>使用指南</h2>
            <div>
              <router-link to="/news/detail?id=2" target="_blank"><span @click="$report({ channel: 101000, actionId: 1 })">常见问题</span></router-link>
              <!--<router-link to="/news/detail?id=3" target="_blank">联系客服</router-link>-->
              <router-link to="/news/detail?id=6" target="_blank"><span @click="$report({ channel: 101000, actionId: 2 })">新手指南</span></router-link>
              <router-link to="/news/detail?id=10" target="_blank"><span @click="$report({ channel: 101000, actionId: 3 })">3D打样要求</span></router-link>
              <router-link to="/news/detail?id=13" target="_blank"><span @click="$report({ channel: 101000, actionId: 4 })">确认订单教程</span></router-link>
              <router-link to="/news/detail?id=117" target="_blank"><span @click="$report({ channel: 101000, actionId: 5 })">下载与打开刀模</span></router-link>
              <router-link to="/news/detail?id=158" target="_blank"><span @click="$report({ channel: 101000, actionId: 6 })">打样订单下单规范</span></router-link>
            </div>
          </li>
          <li>
            <h2>下单须知</h2>
            <div>
              <router-link to="/news/detail?id=17" target="_blank"><span @click="$report({ channel: 101001, actionId: 1 })">物流配送说明</span></router-link>
              <!-- <router-link to="/news/detail?id=65" target="_blank"><span>印刷色差说明</span></router-link> -->
              <router-link to="/news/detail?id=92" target="_blank"><span @click="$report({ channel: 101001, actionId: 2 })">印刷资质要求与模板</span></router-link>
              <router-link to="/news/detail?id=93" target="_blank"><span @click="$report({ channel: 101001, actionId: 3 })">商品包装与收货须知</span></router-link>
              <router-link to="/news/detail?id=95" target="_blank"><span @click="$report({ channel: 101001, actionId: 4 })">规范化文件与刀模说明</span></router-link>
              <router-link to="/news/detail?id=137" target="_blank"><span @click="$report({ channel: 101001, actionId: 5 })">生产货期计算说明</span></router-link>
              <router-link to="/news/detail?id=139" target="_blank"><span @click="$report({ channel: 101001, actionId: 6 })">支付与发票须知</span></router-link>
              <!--<router-link to="/news/detail?id=157" target="_blank"><span>文件处理规范</span></router-link>-->
            </div>
          </li>
          <li>
            <h2>售后服务</h2>
            <div>
              <router-link to="/news/detail?id=21" target="_blank"><span @click="$report({ channel: 101002, actionId: 1 })">退货与退款须知</span></router-link>
              <router-link to="/news/detail?id=23" target="_blank"><span @click="$report({ channel: 101002, actionId: 2 })">售后服务流程</span></router-link>
              <router-link to="/news/detail?id=118" target="_blank"><span @click="$report({ channel: 101002, actionId: 3 })">质量问题免费重做</span></router-link>
              <router-link to="/news/detail?id=138" target="_blank"><span @click="$report({ channel: 101002, actionId: 4 })">出货超时赔付承诺</span></router-link>
              <router-link to="/news/detail?id=175" target="_blank"><span @click="$report({ channel: 101002, actionId: 5 })">纸类包装仓储与存放须知</span></router-link>
            </div>
          </li>
          <li>
            <h2>包装设计模板</h2>
            <div>
              <router-link to="/news/detail?id=15" target="_blank"><span @click="$report({ channel: 101003, actionId: 1 })">设计模板购买说明</span></router-link>
              <router-link to="/news/detail?id=18" target="_blank"><span @click="$report({ channel: 101003, actionId: 2 })">设计模板版权声明</span></router-link>
              <router-link to="/news/detail?id=19" target="_blank"><span @click="$report({ channel: 101003, actionId: 3 })">包装设计师招募</span></router-link>
              <router-link to="/news/detail?id=147" target="_blank"><span @click="$report({ channel: 101003, actionId: 4 })">设计模板上传规范</span></router-link>
            </div>
          </li>
        </ul>
        <div class="footTel">
          <h1>0755-36567904</h1>
          <p class="footTelTime">
            周一至周五：08:30-21:00<br />
            周六至周日：09:00-18:00
          </p>
          <div class="footTContact"  @click="$report({ channel: 101005, actionId: 3 });qiyu()"><span class="icon icon-contact"></span>联系客服</div>
          <!-- <div class="footTelWx"> -->
          <!-- <p><img src="@/static/mulindex/img/index/wx02.png" /></p> -->
          <!-- <p><img src="@/static/mulindex/img/index/wx.png" /></p> -->
          <!-- <p class="footTelWtxt">扫一扫 就能下单</p> -->
          <!-- </div> -->
        </div>
      </div>
      <div class="footTxtQt">
        <span class="footTxtQtSpn">质量标准</span>
        <div class="footTxtQtDv" v-if="$store.getters.standardList.length == 0">
          <router-link to="/news/detail?id=63" target="_blank"><span>彩盒检验标准</span></router-link>
          <router-link to="/news/detail?id=143" target="_blank"><span>精装盒检验标准</span></router-link>
          <router-link to="/news/detail?id=144" target="_blank"><span>胶片盒检验标准</span></router-link>
          <router-link to="/news/detail?id=145" target="_blank"><span>软包装检验标准</span></router-link>
          <router-link to="/news/detail?id=146" target="_blank"><span>铁盒铁罐检验标准</span></router-link>
          <router-link to="/news/detail?id=160" target="_blank"><span>微坑普通材质检验标准</span></router-link>
          <!--          <router-link to="/news/detail?id=153" target="_blank"><span>内托检验标准</span></router-link>-->
          <router-link to="/news/detail?id=179" target="_blank"><span>内托-珍珠棉检验标准</span></router-link>
          <router-link to="/news/detail?id=153" target="_blank"><span>内托-海绵检验标准</span></router-link>
          <router-link to="/news/detail?id=180" target="_blank"><span>内托-EVA检验标准</span></router-link>
          <router-link to="/news/detail?id=154" target="_blank"><span>打样检验标准</span></router-link>
          <router-link to="/news/detail?id=155" target="_blank"><span>吸塑检验标准</span></router-link>
          <router-link to="/news/detail?id=156" target="_blank"><span>纸杯检验标准</span></router-link>
          <router-link to="/news/detail?id=159" target="_blank"><span>吊牌检验标准</span></router-link>
          <router-link to="/news/detail?id=162" target="_blank"><span>纸箱检验标准</span></router-link>
          <router-link to="/news/detail?id=200" target="_blank"><span>标签检验标准</span></router-link>
          <router-link to="/news/detail?id=201" target="_blank"><span>说明书检验标准</span></router-link>
        </div>
        <div class="footTxtQtDv" v-else>
          <template v-for="item in $store.getters.standardList">
            <router-link v-if="item.name != '' && item.name != null" :key="item.id" :to="'/news/detail?id=' + item.id" target="_blank">
              <span @click="$report({ channel: 101004, actionId: 1, param: JSON.stringify({ url: '/news/detail?id=' + item.id }) })">
                {{ item.name }}
              </span></router-link
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qiyu from '@/mixins/qiyu';

export default {
  name: 'FootTop',
  mixins: [qiyu],
  created() {
    if (this.$store.getters.standardList.length == 0) {
      this.$store.dispatch('getStandardList');
    }
  }
 
};
</script>
<style scoped src="../../static/index/css/new/public.css" />
<style scoped>
.footTxtQt a {
  white-space: normal;
}
</style>

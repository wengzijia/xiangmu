<!-- fengjianbo -->
<template>
  <el-container class="login" style="background-color: #eff2f9 ;position: relative;">
    <el-header class="header-nav" style="height: auto;">
      <header-user-nav-top></header-user-nav-top>
      <header-user-nav-bottom></header-user-nav-bottom>
    </el-header>
    <el-container class="allChange_key" style="margin-top:25px;">
      <el-main class="login-main" style="padding-left: 10px; width:500px">
        <div class="designContract">
          <h2>委托设计协议</h2>
          <div class="content">
            <p class="textIndent">
              因设计师在傲彩网（简称平台）平台有偿接受傲彩网指派的设计工作，设计师的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束和平台任务规则。
            </p>
            <p class="textIndent">
              本协议可由傲彩网随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本网站查阅最新版协议条款。在傲彩修改协议条款后，如果用户不接受修改后的条款，请立即停止使用傲彩提供的服务，设计师继续使用傲彩提供的服务将被视为接受修改后的协议。
            </p>

            <p class="textIndent">
              1、设计师为独立承担民事责任的民事主体，是自我管理、自担成本、自负盈亏并为平台提供设计服务的个体经营者，有意愿及能力接受平台委托创作并设计图片、模板、平面设计、素材、3D模型、动画、视频、盒型和包装（统称“设计作品”或“作品”）。
            </p>

            <p class="textIndent">
              2、平台委托设计师设计的所有作品均属于委托作品。平台对设计师交付成功的设计作品以及设计作品中的素材享有著作权等知识产权及法律允许范围内的所有权益。对于提交至傲彩网站的作品，未经平台书面许可，设计师不得行使作品的著作权的任何内容，包括但不限于将作品的著作权转让给第三方、向第三方出售等。
            </p>
            <p class="textIndent">
              3、设计师承诺提交的作品（含作品中的插画等素材）是由设计师独立原创完成，不存在任何权利纠纷，没有违反民法典、著作权法、商标法、广告法及其它有关法律、法规的规定，不侵害任何第三方的合法权利（包括但不限于第三方的著作权等任何知识产权、名誉权、姓名权、肖像权等中国法律规定的相关权利）。
            </p>
            <p class="textIndent">
              4、设计师保证该作品（含作品中的插画等素材）系原创且未在任何其他平台或场合公开发布和使用，也未向任何第三方转让著作权或出售作品，平台为该作品的唯一和最早使用者，如有违反，设计师同意平台有权视情况将设计师的全部作品下架，设计师还应根据平台认定的违约作品数量按照
              5000元/件向平台赔偿并退回违约作品对应的设计费用；除此之外，设计师还应退还平台向设计师支付的全部下架作品对应的设计费用，并承担由此给平台造成的全部损失，包括但不限于直接损失、间接损失及平台为维护权利支出的律师费、诉讼费、保全费等。
            </p>
            <p class="textIndent">
              5、平台如果收到有关设计师的作品内容涉及侵权或其他纠纷的投诉、通知或人民法院、检察院、公安机构、市场监督管理局、知识产权局等有关机关、机构的法律文书，在平台将该等事件通知设计师后，设计师应及时解决相关问题及并承担由此产生的相应法律责任。平台有权要求设计师赔偿由此给平台造成的直接和间接的损失，平台有权选择解除本协议，且平台有权要求设计师退还平台已支付的全部设计费用并按照本协议约定承担违约责任并赔偿损失。
            </p>
            <p class="textIndent">
              6、平台向设计师提供的盒型、平面图、字体、包装模板、插画、图片、矢量图、图标等素材、资料等仅供设计师向平台的提交作品使用，不代表任何权利的许可和转让，设计师不得将平台向设计师提供的字体、插画、图片、矢量图、图标等素材或包装模板授权或出售给任何第三方使用。设计师在履行本协议过程中获取的平台或傲彩网站信息（包括但不限于：设计任务、创意思路、商业秘密、素材库素材等）应当保密，设计师不得进行私自存储、泄露或用于本协议外的其他用途。
            </p>
            <p class="textIndent">
              7、设计师对未交付成功的作品可自行处置，但作品中包含的傲彩网站的素材等信息应删除或替换，不得为提供傲彩网站设计服务之外的任何目的使用。对于平台支付设计费用的作品，该等作品的知识产权归属不以作品完成或完成支付为必要条件，设计师开始设计该等作品之日起，平台即获得该等作品在约定范围内的所有权利。
            </p>
            <p class="textIndent">
              8、双方承诺对委托过程中获得或知悉的对方商业秘密及其他技术和经营信息负有保密义务，并不得使用该商业秘密和信息。因为一方的行为，使另一方遭受任何名誉、声誉或经济上的、直接或间接的损失，则受损失一方可以要求对方赔偿由此造成的一切损失，且受损失一方有权解除本协议。
            </p>
            <p class="textIndent">9、本协议终止，不影响上述条款的效力，上述条款不因本协议的终止而失效。</p>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-footer class="footer">
      <foot-top></foot-top>
      <foot-bottom></foot-bottom>
    </el-footer>
  </el-container>
</template>
<script>
import FootTop from '@/components/footer/FootTop';
import FootBottom from '@/components/footer/FootBottom';
import HeaderUserNavTop from '@/components/header/HeaderUserNavTop';
import HeaderUserNavBottom from '@/components/header/HeaderUserNavBottom';
export default {
  components: {
    FootTop,
    FootBottom,
    HeaderUserNavTop,
    HeaderUserNavBottom
  },
  name: 'IndexLayout',
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
.designContract {
  background: #fff;
  padding: 20px;
}
.designContract h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 26px;
}
.content {
  font-size: 16px;
  color: #999999;
}
.define {
  color: #333333;
  padding: 4px;
  margin: 20px 0;
  border-bottom: 1px solid #f1f1f1;
}
.designContract .textIndent {
  text-indent: 2em;
  line-height: 32px;
}
.uls {
  margin-top: 90px;
  display: flex;
  justify-content: space-between;
  color: #333333;
  padding: 30px;
}
.uls li {
  flex: 1;
  line-height: 40px;
}
</style>
<style scoped src="@/static/mulindex/css/public.css"></style>
<style scoped src="@/static/mulindex/css/fonts.css"></style>
<style scoped src="@/static/index/user/css/all.css" />
<!--<style scoped src="../../static/index/css/main.css" />-->
<style scoped src="../../../static/login.css" />
<style src="../../../static/index/user/css/reset.css" />

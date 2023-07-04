<!-- fengjianbo -->
<template>
  <div>
    <div class="comBox">
      <div id="cutterLayer">
        <div class="downLyWaper">
          <!--left-->
          <div class="downLyLt">
            <!-- 大图begin -->
            <div class="spec-preview">
              <span class="jqzoom">
                <img v-if="bodyimg" class="imAge" :src="bodyimg" />

                <div v-if="frame_show" style="line-height: 0vw;">
                  <iframe name="knife_3d" :src="this.src" class="knife_3d" id="knife_1" style="width: 842px;height: 578px;"></iframe>
                </div>
              </span>
            </div>
            <!-- 缩略图begin -->
            <div class="spec-scroll">
              <div class="items">
                <ul>
                  <!-- <li :class="imgnum == '0' ? 'current' : ''" @click="preview(0)">
                    <img :src="'/' + data.imagesPath" style="background-color: #fff" />
                  </li> -->
                  <li :class="imgnum == '1' ? 'current' : ''" @click="preview(1)">
                    <img :src="data.photoPath2" style="background-color: #fff" />
                  </li>
                  <li v-if="data.cutterObjFile" :class="imgnum == '2' ? 'current' : ''" @click="preview(2)">
                    <input class="itext" type="hidden" :value="data.knifeUrl" />
                    <div class="specIon"><span class="icon icon-3d"></span></div>
                    <img :src="data.photoPath1" />
                  </li>
                  <!-- <li>
                    <input class="itext" type="hidden" :value="12" />
                    <div class="specIon"><span class="icon icon-3d"></span></div>
                    <img :src="666" />
                  </li> -->
                </ul>
              </div>
            </div>
          </div>
          <!--right-->
          <div class="downLyRt">
            <div class="downLyRt_t">
              <h6>{{ data.tinName }}</h6>
              <p class="bodycon">刀模编号：{{ data.modelSn }}</p>
              <p class="bodycon">尺寸：{{ data.size }}</p>
            </div>
            <div class="flex geRtBtnDv" style="width:40%;margin:20px 0 0 120px">
              <div class="joinShoping" v-if="false">
                <a href="javascript:;" @click="download()" class="buybtn btnCart curr card_knife_download"> <em class="icon icon-down"></em>立即下单 </a>
              </div>
              <div
                class="joinShoping"
                @click="
                  $report({
                    channel: 121049,
                    actionId: 3,
                    param: JSON.stringify($route.query)
                  })
                "
              >
                <a :href="data.cutterPdf" class="buybtn btnCart curr card_knife_download" download=""> <em class="icon icon-down"></em>下载文件 </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { byModelSn } from '@/api/goods/miniGoodsApi';

//3d模型渲染,引入three.js

var scene;
var rotating = true;

export default {
  data() {
    return {
      data: {},
      bodyimg: '',
      frame_show: '',
      imgnum: 1,
      src: '/tin3D'
    };
  },
  created() {
    this.getbyModelSn();
  },
  methods: {
    getbyModelSn() {
      byModelSn({ id: this.$route.query.id }).then(res => {
        this.data = res.data;
        // this.bodyimg = '/' + res.data['imagesPath'];
        this.bodyimg = res.data['photoPath2'];
        this.src = '/tin3D?objname=' + res.data['cutterObjFile'];
      });
    },
    preview(num) {
      if (num == '2') {
        this.imgnum = 2;
        this.bodyimg = false;
        this.frame_show = true;
        this.type = '3d';
      } else if (num == '1') {
        this.imgnum = 1;
        this.bodyimg = true;
        this.frame_show = false;
        this.bodyimg = this.data.photoPath2;
      } else if (num == '0') {
        this.imgnum = 0;
        this.bodyimg = true;
        this.frame_show = false;
        this.bodyimg = '/' + this.data['imagesPath'];
      }
    }
  }
};
</script>

<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/mulindex/css/index_new.css" />
<style scoped src="../../static/mulindex/css/attr.css" />
<style scoped>
.hiddencanvas {
  display: none;
}
.bodycon {
  font-size: 14px;
  color: #000;
  line-height: 40px;
}
#glFullscreen {
  width: 100%;
  height: 100vh;
  min-width: 640px;
  min-height: 360px;
  position: relative;
  overflow: hidden;
  z-index: 0;
}
#example {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000000;
}
#feedback {
  color: darkorange;
}
#dat {
  user-select: none;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 200;
}
</style>

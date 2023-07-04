<template>
  <div>
    <div class="comBox">
      <div class="lookTile">{{ goodsInfo.name }}产品详情</div>
      <div class="daySbox">
        <ul class="daySboxUl">
          <li
            :class="goodsVisible ? 'curr' : ''"
            @click="
              goodsVisible = true;
              paperVisible = false;
              orderVisible = false;
            "
          >
            商品详情
          </li>
          <li
            :class="paperVisible ? 'curr' : ''"
            @click="
              goodsVisible = false;
              paperVisible = true;
              orderVisible = false;
            "
          >
            <template v-if="goodsInfo.goodsTag == 11">胶片盒工艺</template>
            <template v-else-if="goodsInfo.goodsTag == 13">软包装工艺</template>
            <template v-else-if="goodsInfo.goodsTag == 10">铁罐工艺</template>
            <template v-else-if="goodsInfo.goodsTag == 19">吸塑工艺</template>
            <template v-else-if="this.$route.query.gid == 1574">注塑杯工艺</template>
            <template v-else>纸品工艺</template>
          </li>
          <li
            :class="orderVisible ? 'curr' : ''"
            @click="
              goodsVisible = false;
              paperVisible = false;
              orderVisible = true;
            "
          >
            下单须知
          </li>
        </ul>
        <div class="daySboxCot goodsImg">
          <div v-show="goodsVisible" v-html="goodsInfo.content"></div>
          <template v-if="goodsInfo.goodsTag == 13"
            ><!--软包start-->
            <div v-show="paperVisible">
              <img src="/uploads/images/products/softmaterial_01.jpg" />
              <img src="/uploads/images/products/softmaterial_02.jpg" />
              <img src="/uploads/images/products/softmaterial_03.jpg" />
              <img src="/uploads/images/products/softmaterial_04.jpg" />
              <img src="/uploads/images/products/softmaterial_05.jpg" />
              <img src="/uploads/images/products/softmaterial_06.jpg" />
            </div>
            <div v-show="orderVisible">
              <img src="/uploads/images/products/w_0617_028.png" />
              <img src="/uploads/images/products/w_0617_029.png" />
              <img src="/uploads/images/products/w_0617_030.png" />
              <img src="/uploads/images/products/w_0617_031.png" />
              <img src="/uploads/images/products/w_0617_032.png" />
            </div>
            <!--软包end-->
          </template>
          <template v-else-if="goodsInfo.goodsTag == 10"
            ><!--铁罐start-->
            <div v-show="paperVisible">
              <img src="/uploads/images/products/tinbox_material_210623.png" />
            </div>
            <div v-show="orderVisible">
              <img src="/uploads/images/products/w_0617_028.png" />
              <img src="/uploads/images/products/w_0617_029.png" />
              <img src="/uploads/images/products/w_0617_030.png" />
              <img src="/uploads/images/products/w_0617_031.png" />
              <img src="/uploads/images/products/w_0617_032.png" />
            </div>
            <!--精装盒-->
          </template>
          <template v-else-if="$route.query.gid == 1620 || $route.query.gid == 1617 || $route.query.gid == 1619 || $route.query.gid == 1616"
            ><!--铁罐start-->
            <div v-show="paperVisible">
              <img src="/uploads/images/products/精装盒_纸品工艺_切图2.jpg" />
            </div>
            <div v-show="orderVisible">
              <img src="/uploads/images/products/精装盒_下单须知.jpg" />
            </div>
            <!--铁罐end-->
          </template>
          <template v-else>
            <div v-show="paperVisible">
              <img src="/uploads/images/products/w_xhipin_0714001.png" />
              <img src="/uploads/images/products/w_xhipin_0714002.png" />
              <img src="/uploads/images/products/w_xhipin_0714003.png" />
              <img src="/uploads/images/products/w_xhipin_0714004.png" />
              <img src="/uploads/images/products/w_xhipin_0714005.png" />
              <img src="/uploads/images/products/w_xhipin_0714006.png" />
              <img src="/uploads/images/products/w_xhipin_0714007.png" />
              <img src="/uploads/images/products/w_xhipin_0714008.png" />
              <img src="/uploads/images/products/w_xhipin_0714009.png" />
            </div>
            <div v-show="orderVisible">
              <img src="/uploads/images/products/w_0617_028.png" />
              <img src="/uploads/images/products/w_0617_029.png" />
              <img src="/uploads/images/products/w_0617_030.png" />
              <img src="/uploads/images/products/w_0617_031.png" />
              <img src="/uploads/images/products/w_0617_032.png" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDescById } from '@/api/goods/miniGoodsApi';

export default {
  data() {
    return {
      goodsVisible: true,
      paperVisible: false,
      orderVisible: false,
      goodsInfo: {}
    };
  },
  methods: {},
  created() {
    getDescById({ id: this.$route.query.gid })
      .then(res => {
        console.log(res.data);
        if (res.data != null) {
          this.goodsInfo = res.data;
        } else {
          this.$router.push({ path: '/' });
        }
      })
      .catch(err => {
        this.$router.push({ path: '/' });
        console.log(err);
      });
  }
};
</script>
<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/mulindex/css/index.css" />
<style scoped src="../../static/mulindex/css/attr.css" />

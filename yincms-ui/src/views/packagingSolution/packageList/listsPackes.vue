<template>
  <div class="graybj" id="app">
    <!--banner-->
    <div class="packgeText">
      <img src="@/static/mulindex/img/packgeText.jpg" alt="" />
      <!-- <Carousel :boxWidth="boxWidth" :imgWidth="imgWidth" :imgList="indexList" :initIndex="0" :loop="true" :auto="true" :autoTime="2000"></Carousel> -->
    </div>

    <!--banner end-->
    <el-main class="comBox axnMain" style="position: relative;">
      <div class="axnWrap">
        <el-row :gutter="10">
          <el-col class="axnEcol" :span="6" v-for="(vo, index) in productList" :key="index" style="cursor: pointer;">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div @click="routeToProduct(vo.id)">
                <p class="axnEcoImg"><img :src="alifileUrl + vo.thumbnail" /></p>
                <div class="axnEcoltx">
                  <h3>{{ vo.schemeName }}</h3>
                  <div class=" axnEcolBt priceCenter" style="text-align: center;">
                    <span class="axnEcolBtsp  size"><i style="font-size: 18px;">￥</i>{{ vo.price }}<i style="font-size: 14px;color: #999;margin-left: 10px;">元/套起</i></span>
                    <!-- <el-button type="text" class="button">30天成交{{ vo.salesCount / 10000 }}万</el-button> -->
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-if="productList.length == 0" class="noDatas">找不到相关数据~~</div>
        <!-- <el-pagination background class="axnPag" @current-change="handleCurrentChange" :current-page="parmsData.pageNumber" :page-size="parmsData.pageSize" layout="total, prev, pager, next, jumper" :total="totalCount"> </el-pagination> -->
      </div>
    </el-main>

    <!--导航分类-->
    <div class="axnFixed" v-show="false">
      <div class="axnFixedW">
        <div class="axnFixedL">
          <a href="" class="curr"><i class="icon icon-shipin"></i>食品</a>
          <a href=""><i class="icon icon-huaz"></i>化妆品</a>
          <a href=""><i class="icon icon-dianzi"></i>电子产品</a>
          <a href=""><i class="icon icon-yyao"></i>医药保健品</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Carousel from '@/components/banner/carousel';
import { categoryList, AdSetting } from '@/api/zbz/packCategoryApi';
import { getHotSchemeListByCategoryPid } from '@/api/zbz/packCategoryApi';
import { path } from 'zrender';

export default {
  name: 'ZbzIndex',
  components: {
    // Carousel
    // ZbzIndexBanner
    // SpecialEvents,
    // HotCategory
  },
  data() {
    return {
      alifileUrl: 'http://alifile.xiaocaiyin.com/',
      // 轮番图片
      indexList: [
        {
          img: null
        }
      ],
      imgWidth: 1240,
      boxWidth: 1240,
      titleList: [{ name: '热门推荐', id: 0 }],
      sectId: null,
      show1: false,
      show2: false,
      totalCount: 0,
      productList: [
        {
          adapter: 'uploads/file/package/202204/625541aab2fcc/面膜_果冻_30g-7片装_抽屉盒.pdf',
          addtime: 1649755894,
          adminid: 22857,
          baseId: 64,
          cateId: 684,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 65,
          goodsTag: '0',
          id: 13,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '密封,保冷,避光',
          packId: 65,
          planId: 59,
          price: 1.88,
          receiveTime: 1649760514,
          receiveUid: 22857,
          remarks: null,
          saleCount: 0,
          schemeName: '面膜_水蜜桃乳酸菌保湿面膜_30g_5片装_密封,保冷,避光_卷膜_日式',
          schemeNo: 'AO1030013',
          sdCategoryId: null,
          status: '0',
          styleId: 8,
          thumbnail: 'uploads/file/VO202204/VO/skin_13/水蜜桃乳酸菌保湿面膜-组合.png',
          verifyStatus: 1,
          verifyTime: 1649760567
        },
        {
          adapter: 'uploads/file/package/202204/6253ef0d83105/面膜_果冻_25g-7片装_抽屉盒.pdf',
          addtime: 1649668097,
          adminid: 22857,
          baseId: 42,
          cateId: 684,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 54,
          goodsTag: '0',
          id: 2,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防摔,环保',
          packId: 43,
          planId: 46,
          price: 5.13,
          receiveTime: 1649668121,
          receiveUid: 22857,
          remarks: null,
          saleCount: 0,
          schemeName: '面膜_果冻贴片式面膜_25g_7片装_防摔,环保_卷膜_设计师自选',
          schemeNo: 'AO1030002',
          sdCategoryId: null,
          status: '0',
          styleId: 1,
          thumbnail: 'uploads/file/VO202204/VO/skin_2/仙人掌补水保湿凝胶面膜-组合.png',
          verifyStatus: 1,
          verifyTime: 1649668131
        },

        {
          adapter: 'uploads/file/package/202204/62554b11567e4/面膜_果冻_30g-7片装_一体成型盒.pdf',
          addtime: 1649757152,
          adminid: 22857,
          baseId: 69,
          cateId: 684,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 67,
          goodsTag: '0',
          id: 15,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '密封,保冷,避光',
          packId: 70,
          planId: 62,
          price: 1.78,
          receiveTime: 1649760508,
          receiveUid: 22857,
          remarks: '<p>盒形重新上传</p>',
          saleCount: 0,
          schemeName: '面膜_牛油果盈润保湿面膜_30g_7片装_密封,保冷,避光_卷膜_艺术',
          schemeNo: 'AO1030015',
          sdCategoryId: null,
          status: '0',
          styleId: 3,
          thumbnail: 'uploads/file/VO202204/VO/skin_15/牛油果盈润保湿面膜-组合.png',
          verifyStatus: 1,
          verifyTime: 1649766982
        },
        {
          adapter: 'uploads/file/package/202204/6254190aa55b6/面膜_果冻_25g-7片装_一体成型盒.pdf',
          addtime: 1649678810,
          adminid: 22857,
          baseId: 48,
          cateId: 684,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 57,
          goodsTag: '0',
          id: 6,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '环保',
          packId: 49,
          planId: 51,
          price: 5.28,
          receiveTime: 1649678830,
          receiveUid: 22857,
          remarks: null,
          saleCount: 1,
          schemeName: '面膜_雪域矢车菊滋润面膜_25g_7片装_环保_卷膜_田园',
          schemeNo: 'AO1030006',
          sdCategoryId: null,
          status: '0',
          styleId: 4,
          thumbnail: 'uploads/file/VO202204/VO/skin_6/雪域矢车菊滋润面膜-组合.png',
          verifyStatus: 1,
          verifyTime: 1649678839
        },
        {
          adapter: 'uploads/file/package/202205/6273d6f1cd932/面膜_25g_薄膜胶带_卡盒-平粘盒_5片装.pdf',
          addtime: 1651759083,
          adminid: 23319,
          baseId: 125,
          cateId: 684,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 95,
          goodsTag: '13,1,2',
          id: 47,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '密封,保冷,避光',
          packId: 126,
          planId: 96,
          price: 2.19,
          receiveTime: 1651759294,
          receiveUid: 22857,
          remarks: null,
          saleCount: 0,
          schemeName: '面膜_小雏菊修护面膜_25g_5片装_密封,保冷,避光_三边封袋_艺术',
          schemeNo: 'AO1030028',
          sdCategoryId: '53,18,44',
          status: '0',
          styleId: 3,
          thumbnail: 'uploads/file/VO202205/VO/skin_34/面膜_25g_薄膜胶带_卡盒-抽屉盒_5片装-组合0052.png',
          verifyStatus: 1,
          verifyTime: 1651759329
        },
        {
          adapter: 'uploads/file/package/202205/6273c51094740/面膜_小布丁果冻_5g-14粒装__双插盒.pdf',
          addtime: 1651754701,
          adminid: 22857,
          baseId: 119,
          cateId: 684,
          categoryId: '4,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 92,
          goodsTag: '15,1,2',
          id: 43,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '环保',
          packId: 120,
          planId: 93,
          price: 2.04,
          receiveTime: 1651755447,
          receiveUid: 22857,
          remarks: null,
          saleCount: 0,
          schemeName: '面膜_小布丁果冻_5g-14粒装_5g_14杯装_环保_吸塑内托_中式',
          schemeNo: 'AO1030024',
          sdCategoryId: '39,15,44',
          status: '0',
          styleId: 7,
          thumbnail: 'uploads/file/VO202205/VO/skin_31/面膜_小布丁果冻_5g-14粒装__双插盒.png',
          verifyStatus: 1,
          verifyTime: 1651755500
        },
        {
          adapter: 'uploads/file/package/202205/6273ac11e0f83/面膜_小布丁果冻_5g-7粒装__抽屉盒.pdf',
          addtime: 1651751367,
          adminid: 22857,
          baseId: 113,
          cateId: 684,
          categoryId: '4,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 89,
          goodsTag: '15,1,2',
          id: 41,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '密封,避光',
          packId: 114,
          planId: 90,
          price: 1.74,
          receiveTime: 1651751523,
          receiveUid: 22857,
          remarks: null,
          saleCount: 1,
          schemeName: '面膜_小布丁果冻_5g-7粒装_5g_7杯装_密封,避光_吸塑内托_中式',
          schemeNo: 'AO1030022',
          sdCategoryId: '39,20,44',
          status: '0',
          styleId: 7,
          thumbnail: 'uploads/file/VO202205/VO/skin_29/面膜_小布丁果冻_5g-7粒装__抽屉盒.png',
          verifyStatus: 1,
          verifyTime: 1651755488
        },
        {
          adapter: 'uploads/file/package/202205/627f1d2c2b22b/面膜_小布丁果冻_5g-14粒装_天地盖-露底.pdf',
          addtime: 1652498040,
          adminid: 23319,
          baseId: 292,
          cateId: 716,
          categoryId: '4,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 179,
          goodsTag: '15,1,2',
          id: 131,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '密封,避光',
          packId: 293,
          planId: 181,
          price: 3.1,
          receiveTime: 1652498057,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '面膜_面膜_小布丁果冻_5g-14粒装_天地盖-露底_5g_14杯装_密封,避光_吸塑内托天地盒_艺术',
          schemeNo: 'AP1040001',
          sdCategoryId: '39,21,44',
          status: '0',
          styleId: 3,
          thumbnail: 'uploads/file/VO202205/VO/skin_106/面膜_小布丁果冻_5g-14粒装_天地盖-露底.png',
          verifyStatus: 1,
          verifyTime: 1652498065
        },
        {
          adapter: 'uploads/file/package/202204/625532614c32d/面膜_果冻_30g-5片装_抽屉盒.pdf',
          addtime: 1649751029,
          adminid: 22857,
          baseId: 58,
          cateId: 684,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 62,
          goodsTag: '0',
          id: 10,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '环保',
          packId: 59,
          planId: 56,
          price: 2.22,
          receiveTime: 1649760523,
          receiveUid: 22857,
          remarks: null,
          saleCount: 3,
          schemeName: '面膜_胶原蛋白面膜_30g_5片装_环保_卷膜_中式',
          schemeNo: 'AO1030010',
          sdCategoryId: null,
          status: '0',
          styleId: 7,
          thumbnail: 'uploads/file/VO202204/VO/skin_10/胶原蛋白面膜-组合.png',
          verifyStatus: 1,
          verifyTime: 1649760585
        },
        {
          adapter: 'uploads/file/package/202205/6275e04a0d818/面膜片_25g_薄膜胶袋_卡盒-抽屉盒_20片装.pdf',
          addtime: 1651892675,
          adminid: 23319,
          baseId: 143,
          cateId: 684,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 104,
          goodsTag: '13,1,2',
          id: 73,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '密封,保冷,避光',
          packId: 177,
          planId: 122,
          price: 4.29,
          receiveTime: 1651892687,
          receiveUid: 23319,
          remarks: null,
          saleCount: 1,
          schemeName: '面膜_补水保湿面膜_25g_20片装_密封,保冷,避光_三边封袋_艺术',
          schemeNo: 'AO1030041',
          sdCategoryId: '53,20,44',
          status: '0',
          styleId: 3,
          thumbnail: 'uploads/file/VO202205/VO/skin_51/面膜_25g_薄膜胶带_卡盒-抽屉盒_5片装-组合0019.png',
          verifyStatus: 1,
          verifyTime: 1651892693
        },
        {
          adapter: 'uploads/file/package/202205/6274df1cf0236/面膜_25g_薄膜胶带_卡盒-抽屉盒_5片装.pdf',
          addtime: 1651826697,
          adminid: 23319,
          baseId: 151,
          cateId: 684,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 108,
          goodsTag: '13,1,2',
          id: 59,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '密封,保冷,避光',
          packId: 152,
          planId: 109,
          price: 2.85,
          receiveTime: 1651826709,
          receiveUid: 23319,
          remarks: null,
          saleCount: 1,
          schemeName: '面膜_舒敏保湿丝滑面膜_25g_5片装_密封,保冷,避光_三边封袋_艺术',
          schemeNo: 'AO1030039',
          sdCategoryId: '53,20,44',
          status: '0',
          styleId: 3,
          thumbnail: 'uploads/file/VO202205/VO/skin_60/面膜_25g_薄膜胶带_卡盒-抽屉盒_5片装-组合0019.png',
          verifyStatus: 1,
          verifyTime: 1651826717
        },
        {
          adapter: 'uploads/file/package/202205/6274cbba180bd/面膜片_25g_薄膜胶袋_卡盒_天地盖_10片装-4.pdf',
          addtime: 1651821811,
          adminid: 23319,
          baseId: 139,
          cateId: 684,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 102,
          goodsTag: '13,1,2',
          id: 54,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '密封,防水,避光',
          packId: 140,
          planId: 103,
          price: 3.42,
          receiveTime: 1651823837,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '面膜_紧致抗皱_25g_5片装_密封,防水,避光_三边封袋_艺术',
          schemeNo: 'AO1030034',
          sdCategoryId: '53,21,44',
          status: '0',
          styleId: 3,
          thumbnail: 'uploads/file/VO202205/VO/skin_61/面膜片_25g_紧致抗皱-天地盒_10片装.png',
          verifyStatus: 1,
          verifyTime: 1651823890
        },
        {
          adapter: 'uploads/file/package/202205/627b9c1f8f1ef/茶叶_普洱茶_357g_茶饼_一体成型盒盖前外插安全扣-3饼装.pdf',
          addtime: 1652268650,
          adminid: 23319,
          baseId: 274,
          cateId: 1410,
          categoryId: '13,2,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 170,
          goodsTag: '13,7,2',
          id: 122,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 275,
          planId: 172,
          price: 1.95,
          receiveTime: 1652268658,
          receiveUid: 23319,
          remarks: null,
          saleCount: 3,
          schemeName: '普洱茶_茶叶_普洱茶_357g_茶饼_一体成型盒盖前外插安全扣-3饼装_357g_3片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0050',
          sdCategoryId: '62,28,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_89/茶叶_普洱茶_357g_茶饼_一体成型盒盖前外插安全扣-3饼装.png',
          verifyStatus: 1,
          verifyTime: 1652268665
        },
        {
          adapter: 'uploads/file/package/202205/6276319891542/茶叶_普洱茶_357g_茶饼_一体成型盒盖前外插常规-2饼装.pdf',
          addtime: 1651913384,
          adminid: 23319,
          baseId: 202,
          cateId: 1410,
          categoryId: '13,2,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 134,
          goodsTag: '13,7,2',
          id: 84,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 203,
          planId: 133,
          price: 2.16,
          receiveTime: 1651913395,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '普洱茶_茶叶_普洱茶_,357g_茶饼_一体成型盒盖前外插常规-2饼装_357g_2片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0024',
          sdCategoryId: '62,28,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_69/茶叶_普洱茶_357g_茶饼_一体成型盒盖前外插常规-2饼装.png',
          verifyStatus: 1,
          verifyTime: 1651913407
        },
        {
          adapter: 'uploads/file/package/202205/6275f2cc9c1b3/茶叶_普洱茶_357g_茶饼_双插盒-1饼装 .pdf',
          addtime: 1651897446,
          adminid: 23319,
          baseId: 188,
          cateId: 1410,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 127,
          goodsTag: '13,1,2',
          id: 78,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 189,
          planId: 127,
          price: 2.92,
          receiveTime: 1651897457,
          receiveUid: 23319,
          remarks: null,
          saleCount: 3,
          schemeName: '普洱茶_茶叶_普洱茶_357g_茶饼_双插盒-1饼装_357g_1片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0019',
          sdCategoryId: '62,15,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_56/茶叶_普洱茶_357g_茶饼_双插盒-1饼装-组合.png',
          verifyStatus: 1,
          verifyTime: 1651897469
        },
        {
          adapter: 'uploads/file/package/202205/6274e5c25cc94/8g_中封风琴袋(真空)_抽屉卡盒_10包.pdf',
          addtime: 1651828594,
          adminid: 23319,
          baseId: 153,
          cateId: 541,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 109,
          goodsTag: '13,1,2',
          id: 61,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,密封,防水,避光',
          packId: 154,
          planId: 110,
          price: 2.85,
          receiveTime: 1651830363,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '铁观音_茶叶_8g_中封风琴袋(真空)_抽屉卡盒_10包_8g_10袋装_防潮,密封,防水,避光_中封风琴袋_艺术',
          schemeNo: 'AJ4010013',
          sdCategoryId: '66,20,44',
          status: '0',
          styleId: 3,
          thumbnail: 'uploads/file/VO202205/VO/skin_67/8g_中封风琴袋(真空)_抽屉卡盒_10包.png',
          verifyStatus: 1,
          verifyTime: 1651830390
        },
        {
          adapter: 'uploads/file/package/202205/627636bf1bbdb/茶叶_普洱茶_100g_茶饼_卡盒_一体成型盒_盖前外插安全扣-1饼装.pdf',
          addtime: 1651916868,
          adminid: 23319,
          baseId: 204,
          cateId: 1410,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 135,
          goodsTag: '13,1,2',
          id: 85,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 205,
          planId: 134,
          price: 2.51,
          receiveTime: 1651923254,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '普洱茶_茶叶_普洱茶_100g_茶饼_卡盒_一体成型盒_盖前外插安全扣-1饼装_100g_1片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0025',
          sdCategoryId: '62,19,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_70/茶叶_普洱茶_357g_茶饼_抽屉盒-2饼装-组合.png',
          verifyStatus: 1,
          verifyTime: 1651923263
        },
        {
          adapter: 'uploads/file/package/202205/62788286e8ecc/茶叶_普洱茶_100g_茶饼_卡盒-抽屉盒单抽-2饼装.pdf',
          addtime: 1652065690,
          adminid: 23319,
          baseId: 208,
          cateId: 1410,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 137,
          goodsTag: '13,1,2',
          id: 87,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '',
          packId: 209,
          planId: 136,
          price: 3.45,
          receiveTime: 1652065794,
          receiveUid: 23319,
          remarks: null,
          saleCount: 1,
          schemeName: '普洱茶_普洱-老班章_100g_茶饼_卡盒-抽屉盒单抽-2饼装_100g_2片装__自立袋_国潮',
          schemeNo: '0027',
          sdCategoryId: '62,20,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_72/茶叶_普洱茶_100g_茶饼_卡盒-抽屉盒单抽-2饼装-组合.png',
          verifyStatus: 1,
          verifyTime: 1652065802
        },
        {
          adapter: 'uploads/file/package/202205/62787ccbada85/茶叶_普洱茶_100g_茶饼_卡盒-抽屉盒-3饼装  .pdf',
          addtime: 1652064240,
          adminid: 23319,
          baseId: 206,
          cateId: 1410,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 136,
          goodsTag: '13,1,2',
          id: 86,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 207,
          planId: 135,
          price: 1.54,
          receiveTime: 1652064265,
          receiveUid: 23319,
          remarks: null,
          saleCount: 5,
          schemeName: '普洱茶_普洱-冰岛_100g_茶饼_卡盒-抽屉盒-3饼装_100g_3片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0026',
          sdCategoryId: '62,20,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_71/茶叶_普洱茶_100g_茶饼_卡盒-抽屉盒-3饼装-组合.png',
          verifyStatus: 1,
          verifyTime: 1652064286
        },
        {
          adapter: 'uploads/file/package/202205/6275026a718e8/茶叶_普洱茶_357g_茶饼_抽屉盒-3饼装(正确）.pdf',
          addtime: 1651836119,
          adminid: 23319,
          baseId: 165,
          cateId: 1410,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 115,
          goodsTag: '13,1,2',
          id: 67,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 166,
          planId: 116,
          price: 3.72,
          receiveTime: 1651836127,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '普洱茶_茶叶_普洱茶_357g_茶饼_抽屉盒-3饼装_357g_3片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0009',
          sdCategoryId: '62,20,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_40/未标题-1.png',
          verifyStatus: 1,
          verifyTime: 1651836134
        },
        {
          adapter: 'uploads/file/package/202205/62760e3d576d6/茶叶_普洱茶_357g_茶饼_天地盖盒-1饼装.pdf',
          addtime: 1651905107,
          adminid: 23319,
          baseId: 190,
          cateId: 1410,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 128,
          goodsTag: '13,1,2',
          id: 79,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 191,
          planId: 128,
          price: 3.39,
          receiveTime: 1651905755,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '普洱茶_茶叶_普洱茶_357g_茶饼_天地盖盒-1饼装_357g_1片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0020',
          sdCategoryId: '62,21,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_62/茶叶_普洱茶_357g_茶饼_天地盖盒-1饼装-组合.png',
          verifyStatus: 1,
          verifyTime: 1651905780
        },
        {
          adapter: 'uploads/file/package/202205/62761e735fc01/茶叶_普洱茶_357g_茶饼_天地盖盒-2饼装 .pdf',
          addtime: 1651910171,
          adminid: 23319,
          baseId: 194,
          cateId: 1410,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 130,
          goodsTag: '13,1,2',
          id: 80,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 195,
          planId: 129,
          price: 3.85,
          receiveTime: 1651910240,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '普洱茶_茶叶_普洱茶_357g_茶饼_天地盖盒-2饼装_357g_2片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0021',
          sdCategoryId: '62,21,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_63/茶叶_普洱茶_357g_茶饼_天地盖盒-2饼装-组合.png',
          verifyStatus: 1,
          verifyTime: 1651910252
        },
        {
          adapter: 'uploads/file/package/202205/6274fe6244949/茶叶_普洱茶_357g_茶饼_抽屉盒-2饼装  .pdf',
          addtime: 1651835099,
          adminid: 23319,
          baseId: 163,
          cateId: 1410,
          categoryId: '13,1,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 114,
          goodsTag: '13,1,2',
          id: 66,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 164,
          planId: 115,
          price: 3.53,
          receiveTime: 1651835111,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '普洱茶_茶叶_普洱茶_357g_茶饼_抽屉盒-2饼装_357g_2片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0008',
          sdCategoryId: '62,20,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_38/未标题-1.png',
          verifyStatus: 1,
          verifyTime: 1651835119
        },
        {
          adapter: 'uploads/file/package/202205/62762a3646e29/茶叶_普洱茶_357g_茶饼_一体成型盒盖前外插常规-1饼装.pdf',
          addtime: 1651911764,
          adminid: 23319,
          baseId: 198,
          cateId: 1410,
          categoryId: '13,2,7',
          composeId: 0,
          description: null,
          designList: null,
          formId: 132,
          goodsTag: '13,7,2',
          id: 82,
          isShow: 1,
          mould: '',
          mould3d: null,
          note: '',
          packAttr: '防潮,防水,避光,环保',
          packId: 199,
          planId: 131,
          price: 5.99,
          receiveTime: 1651911775,
          receiveUid: 23319,
          remarks: null,
          saleCount: 0,
          schemeName: '普洱茶_茶叶_普洱茶_357g_茶饼_一体成型盒盖前外插常规-1饼装_357g_1片装_防潮,防水,避光,环保_自立袋_国潮',
          schemeNo: '0023',
          sdCategoryId: '62,28,44',
          status: '0',
          styleId: 5,
          thumbnail: 'uploads/file/VO202205/VO/skin_68/茶叶_普洱茶_357g_茶饼_一体成型盒盖前外插常规-1饼装.png',
          verifyStatus: 1,
          verifyTime: 1651911781
        }
      ],
      options: []
    };
  },
  watch: {
    show1: function(value) {
      let _this = this;

      if (value) {
        _this.show2 = value;
      } else {
        setTimeout(() => {
          _this.show2 = value;
        }, 1000);
      }
    }
  },

  computed: {
    listHeight: function() {
      let _this = this;

      if (!_this.show1) return 50;

      let len = _this.options.length;

      console.log('len / 6).ceil', Math.ceil(len / 8));

      return 50 * Math.ceil(len / 8);
    }
  },

  created() {
    // this.getListAll();
    // this.categoryListFn();
    // this.getHotSchemeListByCategoryPidFn();
  },
  mounted() {
    let _this = this;
    // _this.resize();
    // window.onresize =  _this.resize()

    window.addEventListener('resize', () => {
      _this.resize();
    });
  },
  methods: {
    // 获取窗口尺寸
    resize() {
      this.imgWidth = document.documentElement.clientWidth;
      // console.log('获取窗口尺寸', this.imgWidth);
    },
    tabChange() {
      this.show1 = !this.show1;
    },
    //   获取一二级分类
    categoryListFn() {
      categoryList().then(res => {
        this.options = res.data;
        // console.log(' this.options', this.options);
      });
    },
    // 商品列表
    getHotSchemeListByCategoryPidFn(id) {
      getHotSchemeListByCategoryPid({ pid: id, language: 'zh-cn' })
        .then(res => {
          // this.productList = res.data;
          //   this.totalCount = res.totalCount;
          // console.log('productList666', this.productList);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 一二级跳转
    changeCate(val) {
      //   console.log('一二级跳转', val);
      //   console.log(val[1]);
      this.$router.push({ path: '/packagingSolution/packageList', query: { id: val[1] } });
      // let routeUrls = this.$router.resolve({ path: '/packagingSolution/packageList', query: { id: val[1] } });
      // window.open(routeUrls.href, '_blank');
    },
    /**
     * 跳转到商品详情页
     * @param {number} id -商品id
     */
    routeToProduct(id) {
      let routeUrl = this.$router.resolve({ path: '/packagingSolution/packageDetails', query: { id: id } });
      window.open(routeUrl.href, '_blank');
    },
    /**
     * 获取轮播图图片
     */
    getListAll() {
      AdSetting().then(res => {
        if (res.code === '000000') {
          // console.log('轮播图22', res);
          this.indexList = res.data.indexList;
          this.indexList.map(item => {
            item.img = this.alifileUrl + item.coverPath;
          });
        }
      });
    }
  }
};
</script>
<style>
.graybj {
  /* background-color: #3f4bc5 !important; */
  /* padding-top: 4px; */
}
.graybj .packgeText {
  width: 1240px;
  margin: 20px auto;
  margin-bottom: 10px;
}
.graybj .el-cascader-node.in-active-path,
.graybj .el-cascader-node.is-active,
.graybj .el-cascader-node.is-active {
  color: #c41b20;
}
.graybj .el-cascader-menu__wrap {
  height: 430px;
  font-size: 18px;
  /* line-height: 400px; */
}
.graybj .el-cascader-node {
  height: 50px;
}
.graybj .title_seach {
  /* display: flex; */
}
.graybj .title_seach .txtList {
  /* height: 86px; */
  background: #fff;
  font-size: 16px;
  display: flex;
  /* align-items: center; */
  /* justify-content: space-between; */
  flex-wrap: wrap;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 6px;
  padding-bottom: 14px;
  padding-top: 22px;
  transition: all 1s;
}

/* .graybj .title_seach .upviews .txtList:hover {
  height: auto;
}
.graybj .title_seach .onviews  .txtList:hover{
  height: 86px;
} */
.graybj .title_seach .txtList li {
  width: 130px;
  height: 40px;
  border: 1px solid #c41b20;
  margin-right: 20px;
  padding: 8px 10px;
  box-sizing: border-box;
  border-radius: 20px;
  color: #c41b20;
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.5s;
}
.graybj .title_seach .txtList li.active {
  color: #fff;
  background: #f00;
  border: 1px solid #f00;
}
/* .graybj .title_seach .txtList li:hover {
  background: #f00;
  color: #fff;
} */
.graybj .title_seach .txtList .more {
  /* width: 40px; */
  height: 40px;
  border: 1px solid #999;
  line-height: 20px;
  text-align: center;
  margin: 0;
  /* font-size: 20px; */
  /* border-radius: 6px; */
  /* font-weight: 700; */
  background: #fff;
  color: #999;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
}
.axnEcoltx .priceCenter .size {
  font-size: 36px;
}
.noDatas {
  font-size: 16px;
  color: #999;
  width: 200px;
  height: 313px;
  margin: 20px auto;
  text-align: center;
  line-height: 313px;
}
</style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />

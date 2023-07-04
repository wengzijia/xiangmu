<!-- fengjianbo -->
<template>
  <div>
    <!-- <div v-loading="loading"> -->
    <div class="gray grayHead"></div>
    <div id="cutterLayer">
      <div class="downLyWaper" style="padding-top: 30px;background-color: #fff;">
        <div class="comBox">
          <div class="headTitle">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-show="titleList[0]" v-for="(k, i) in titleList" :key="i" :to="'/packagingSolution/packageList?id=' + k.id">{{ k.name }}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="packageRightData"
                ><span style="font-weight: 700;">{{ packageRightData.title }}</span></el-breadcrumb-item
              >
            </el-breadcrumb>
            <span style="color:#aaaabb">NO:{{ schemeNo }}</span>
          </div>
          <package-left ref="packageLeft" :updateDate="updateDate" :packageLeftDta="packageLeftDta" :model_preview_3d="model_preview_3d" :custom_preview_3d="custom_preview_3d" :goodsList="goodsList" :play="play" :getDom="getDom"></package-left>
          <div style="position: relative;">
            <!-- :provinceList="provinceList"
            :cityList="cityList"
            :countyList="countyList" -->
            <package-right
              :options="options"
              :goodsList="goodsList"
              :selectChecked="selectChecked"
              :lookDetails="lookDetails"
              :radioSelected="radioSelected"
              :selectCity="selectCity"
              :buyParms="buyParms"
              :packageRightData="packageRightData"
              :sendFormData="sendFormData"
              :inputChang="inputChang"
              :changeStatus="changeStatus"
              :purchaseNow="purchaseNow"
              :deleteBatchByIdFn="deleteBatchByIdFn"
              :handlerValue="handlerValue"
              :getPriceFn="getPriceFn"
              ref="packageRight"
              @resetPrice="resetUnitPrice"
            ></package-right>
            <!-- 显示放大图片 -->
            <div class="largeImage" ref="bigBox" v-if="packageLeftDta.isShow">
              <img ref="bimg" :src="imgSrc + packageLeftDta.bigImg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <check-detail :dialogTitle="dialogTitle" :dialogVisible1="dialogVisible" :detailsList="detailsList" @handleClose1="handleClose"></check-detail>
      <login-form :dialogVisible.sync="showLoginDialog"></login-form>
      <div class="gray"></div>
    </div>
  </div>
</template>

<script>
import packageDetails from './mixins/packageDetails';
export default {
  mixins: [packageDetails]
};
</script>

<style scoped>
.largeImage {
  height: 620px;
  width: 620px;
  border: 1px solid #ccc;
  background: #fff;
  position: absolute;
  top: 0;
  left: 530px;
  z-index: 7;
  overflow: hidden;
  display: none;
}
.largeImage > img {
  /* width: 100%; */
  /* height: 100%; */
  position: absolute;
}
.gray {
  width: 100%;
  height: 30px;
  background: #f5f5f5;
}
.grayHead {
  height: 20px;
}
.comBox .headTitle {
  padding: 20px 0;
  /* text-align: right; */
  display: flex;
  justify-content: space-between;
}
</style>
<style>
.headTitle .el-breadcrumb__inner.is-link:hover {
  color: #e9333f;
}
</style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/public.css" />
<style scoped src="@/static/mulindex/css/index_new.css" />
<style scoped src="@/static/mulindex/css/attr.css" />
/* <style scoped src="@/static/mulindex/css/packag_details.css" /> */

<!-- fengjianbo -->
<template>
  <div v-resize="monResize">
    <el-row>
      <el-col v-loading="formData.loading">
        <div class="comBox guigeBox cardBox needhide" v-if="$route.query.subCateId == 127">
          <div class="guigeLt">
            <h1 class="flex guigeH1">
              <span class="geH1Lt">精装盒-定制精装盒规格选择 </span>
              <span class="lookBnt"><router-link :to="'/goods/goodsDesc?gid=' + formData.goodAttrVo.id" target="_blank">查看产品详情</router-link></span>
            </h1>
            <!-- <price-commontwo ref="childMethod" :fdata="fdata"></price-commontwo> -->
            <div class="dcardtabB">
              <div class="guigeImg" style="top: 68px">
                <img @mouseout="abc(false)" :class="showClass ? 'rotatemg' : ''" src="@/static/index/img/hardcover.png" />
              </div>
              <el-form class="guigeTop" ref="formData" :model="fdata" label-width="130px" @submit.native.prevent size="small" style="min-height: 130px; height: 130px">
                <br />
                <el-form-item :required="true" key="common" label="订购数量">
                  <div>
                    <div class="flex inputBx">
                      <div class="inputBxrow inputBxrowSize">
                        <el-input v-model="fdata.num" style="width: 180px" size="small">
                          <template slot="append">套</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item :required="true" label="设计稿">
                  <el-radio-group class="EattrMgroup" size="small" v-model="fdata.dnum" button-style="solid">
                    <el-row class="Eattrrow">
                      <el-radio-button size="small" label="有设计稿或包装样">有设计稿或包装样</el-radio-button>
                    </el-row>
                    <!-- <el-row class="Eattrrow">
                      <el-radio-button size="small" label="有包装样品">有包装样品</el-radio-button>
                    </el-row> -->
                    <el-row class="Eattrrow">
                      <el-radio-button size="small" label="需要包装设计">需要包装设计</el-radio-button>
                    </el-row>
                  </el-radio-group>
                </el-form-item>
                <br />
                <el-form-item label="描述设计需求" v-if="fdata.dnum == '需要包装设计'">
                  <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" placeholder="请描述您希望包装达成什么效果；如：这款产品主打创新和科技感... 包装需要突出科技和创新... 要显得高端大气... 主色调为红色..." v-model="fdata.textarea">
                  </el-input>
                </el-form-item>
                <el-form-item label="上传文件" v-if="fdata.dnum == '有设计稿或包装样'">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="MyHeader"
                    action="/api/consumer/proof/miniProof/uploadProofFile"
                    :on-change="handlechange"
                    :on-success="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :limit="1"
                    :auto-upload="false"
                  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item :required="true" label="产品名称">
                  <el-input style="width: 200px" placeholder="输入产品名称" v-model="fdata.productname"> </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <PriceRighttwo class="fixedstatus" :priceFormData.sync="priceFormData" :hardcover="hardcover"></PriceRighttwo>
        </div>
        <div class="comBox guigeBox cardBox needhide" v-else>
          <div class="guigeLt">
            <!-- <h1 class="flex guigeH1">
              <span class="geH1Lt"><span v-if="$route.query.disposable" @click="$router.push('/disposable')" style="cursor: pointer">一次性餐饮包装--</span>{{ cateName }}-{{ subCateName }}规格选择 </span>
              <span class="lookBnt" v-if="$route.query.cateId != '122'"><router-link :to="'/goods/goodsDesc?gid=' + formData.goodAttrVo.id" target="_blank">查看产品详情</router-link></span>
            </h1> -->
            <!-- 公用部分 -->
            <price-common
              ref="PriceCommon"
              :number-change="numberChange"
              :addCommonSize="addCommonSize"
              :removeCommonSize="removeCommonSize"
              :otherInputChange="otherInputChange"
              :form-data.sync="formData"
              :common-form-data.sync="commonFormData"
              :common-vo-list.sync="commonVoList"
              :price-valuation="priceValuation"
            ></price-common>
            <!-- 专业报价 -->
            <price-major
              :priceValuation="priceValuation"
              :removeCopyGroupCk="removeCopyGroupCk"
              :addCopyGroupCk="addCopyGroupCk"
              :addCopyGroupRd="addCopyGroupRd"
              :removeCopyGroupRd="removeCopyGroupRd"
              :radioSelect="radioSelect"
              :selectSelect="selectSelect"
              :checkboxSelect="checkboxSelect"
              :form-data.sync="formData"
              :form-vo-list.sync="formVoList"
              :bindType="bindType"
              :SLXNumName="SLXNum"
              @setX="changeSLX"
              @event1="change($event)"
              :getraradiofn="getraradiofn"
              :priceFormData.sync="priceFormData"
              :addService="addService"
            ></price-major>
          </div>
          <div class="fixedstatus"></div>
          <price-right
            class="fixedstatus"
            :style="'margin-top:' + marginnum + 'px;display:none;'"
            :newlist="newlist"
            :loadingstatus="loadingstatus"
            ref="PriceRight"
            :priceFormData.sync="priceFormData"
            :addCart="addCart"
            :addQuote="addQuote"
            :priceValuation="priceValuation"
          ></price-right>
        </div>
        <!-- <login-form :dialogVisible.sync="formData.showLoginDialog"></login-form> -->
      </el-col>
    </el-row>
    <!-- <el-button @click="sendMessage">测试</el-button> -->
    <!-- <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <p style="text-align: center">询价单提交成功，我们会尽快联系您~</p>
      <p style="text-align: center">若您有其他的需求点击联系<a class="red" href="//wpa1.qq.com/cPNJlL1B?_type=wpa&qidian=true" target="_blank">在线客服</a></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogbtn">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import priceMixins from './mixins/Index';
import entiretyIframe from './mixins/entiretyIframe';
export default {
  mixins: [priceMixins, entiretyIframe],
  data() {
    return {};
  },
  mounted() {
    this.priceFormData.radioService = '';
    this.bis1 = '';
    document.querySelector('.guigeLt').style.minHeight = '0';
  }
};
</script>
<style>
.fixedclass {
  position: fixed;
  top: 46px;
  background: #fff;
  z-index: 99;
  border: 1px solid #dbe0e4;
}
</style>
<style src="../../static/mulindex/css/public.css"></style>
<style src="../../static/mulindex/css/attr.css"></style>

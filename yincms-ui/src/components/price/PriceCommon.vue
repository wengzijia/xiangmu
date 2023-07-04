<template>
  <div class="cardtabB">
    <div class="guigeImg" :style="$route.query.cateId == 10 || $route.query.cateId == 152 ? 'display: none;' : ''">
      <img :src="formData.goodAttrVo.coverPath" @mouseout="abc(false)" :class="showClass ? 'rotatemg' : ''" />
    </div>

    <el-form class="guigeTop" ref="formData" :model="formData" label-width="130px" @submit.native.prevent size="small">
      <el-form-item required label="名片尺寸" v-show="$route.query.cateId === '143' && $route.query.subCateId == '144'">
        <div>长90mm*宽54mm</div>
      </el-form-item>
      <template v-for="(item, index) in commonVoList">
        <!-- 共用部分 -->
        <el-form-item :required="true" :key="'common_' + index" :label="item.name" v-show="ifhide(item)">
          <template slot="label">
            {{ item.name }}
            <el-tooltip v-if="item.code === 'TKKS' && $route.query.subCateId !== '85'" width="200" class="item" effect="light" placement="top-start">
              <div slot="content">同款指参数工艺及数量相同，仅设计稿内容不同的{{ $route.query.cateId === '13' ? formData.subCateName : formData.cateName }}</div>
              <em class="guigeTis">?</em>
            </el-tooltip>
          </template>
          <!-- 成品外尺寸 -->
          <div v-if="item.groupType === 'input'">
            <!-- <div class="flex inputBx" v-if="item.code === 'SIZE'"> -->
            <!-- 删除 flex 因后台管理系统引用页面时布局错位，并调查现存页面也并未用到样式该样式 -->
            <div class="inputBx" v-if="item.code === 'SIZE'">
              <template v-if="formData.goodAttrVo.id">
                <!-- 展开尺寸 -->
                <template v-for="attr in item.attrList">
                  <div class="inputBxrow inputBxrowSize" :key="attr.id" v-if="formData.goodAttrVo.id && formData.goodAttrVo[attr.code] === 1">
                    <el-input
                      v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]"
                      :placeholder="attr.inputTips"
                      style="width: 180px;"
                      size="small"
                      @change="
                        numberChange($event, { data: commonFormData.inputValues, code: attr.code, name: attr.name, dataKey: attr.groupId + '_' + attr.id, min: formData.goodAttrVo[attr.code + 'Min'], max: formData.goodAttrVo[attr.code + 'Max'] })
                      "
                    >
                      <template v-if="$route.query.subCateId == '24' || $route.query.subCateId == '32'" slot="append">{{ attr.suffix }}</template>
                      <template v-else slot="append">{{ formData.goodAttrVo[attr.code] === 1 ? formData.appendsDesc[attr.code] : attr.suffix }}</template>
                    </el-input>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="inputBxrow" v-for="attr in item.attrList" :key="attr.id">
                  <el-input v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small" @change="priceValuation">
                    <template slot="append">{{ attr.suffix }}</template>
                  </el-input>
                </div>
              </template>
            </div>
            <div class="flex inputBx" v-else>
              <div class="inputBxrow" v-for="(attr, i) in item.attrList" :key="i">
                <el-input
                  v-if="attr.max"
                  v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]"
                  :placeholder="attr.inputTips"
                  size="small"
                  @change="numberChange($event, { data: commonFormData.inputValues, name: attr.name, dataKey: attr.groupId + '_' + attr.id, min: attr.min, max: $route.query.subCateId == 38 && i == 2 ? '200' : attr.max }, 'yssl')"
                >
                  <template slot="append">{{ attr.suffix }}</template>
                </el-input>
                <!--                <el-input-->
                <!--                  v-else-if="$route.query.cateId == '86' && item.code === 'SL_X'"-->
                <!--                  v-model="SLXNumValue"-->
                <!--                  :placeholder="attr.inputTips"-->
                <!--                  :disabled="true"-->
                <!--                  size="small"-->
                <!--                  @change="otherInputChange($event, { data: commonFormData.inputValues, code: item.code, name: attr.name, dataKey: attr.groupId + '_' + attr.id })"-->
                <!--                >-->
                <!--                  <template slot="append" v-if="$route.query.subCateId == '87' || $route.query.subCateId == '88'">套</template>-->
                <!--                  <template slot="append" v-else-if="$route.query.subCateId == '89' || $route.query.subCateId == '90'">个</template>-->
                <!--                  <template slot="append" v-else>{{ attr.suffix }}</template>-->
                <!--                </el-input>-->
                <!-- 印刷数量 -->
                <el-input
                  v-else
                  :placeholder="attr.inputTips"
                  size="small"
                  v-model="commonFormData.inputValues[attr.groupId + '_' + attr.id]"
                  @change="otherInputChange($event, { data: commonFormData.inputValues, code: item.code, name: attr.name, dataKey: attr.groupId + '_' + attr.id })"
                >
                  <template v-if="($route.query.subCateId == '31' && attr.id == '102') || ($route.query.subCateId == '31' && attr.id == '202')" slot="append">mm</template>
                  <template v-else slot="append">{{ attr.suffix }}</template>
                </el-input>
                <span v-if="item.code === 'YSSL' && $route.query.cateId === '70' && $route.query.subCateId !== '85' && $route.query.subCateId !== '96'" style="font-size: 10px;color: #9a9a9a">（100个起订）</span>
                <span v-if="item.code === 'YSSL' && $route.query.cateId === '3'" style="font-size: 10px;color: #9a9a9a">（20个起订）</span>
                <span v-if="item.code === 'YSSL' && ($route.query.cateId === '5' || $route.query.cateId === '6' || $route.query.cateId === '9')" style="font-size: 12px;color: #F00">
                  <template v-if="$route.query.subCateId === '101'">
                    （100个起印，订购数量不能超过3000个）
                  </template>
                  <template v-else>
                    （该品类无备品，请评估下单数量）
                  </template>
                </span>
              </div>
              <span
                v-if="$route.query.isCms && item.code === 'BJ1_SIZE' && ($route.query.subCateId === '36' || $route.query.subCateId === '37' || $route.query.subCateId === '38')"
                @click="addCommonSize"
                class="setParts addPart el-icon-plus"
                title="增加部件"
              ></span>
              <span v-else-if="item.code === 'BJ1_SIZE' && ($route.query.subCateId === '36' || $route.query.subCateId === '37' || $route.query.subCateId === '38')" @click="addCommonSize" class="setParts addPart icon icon-add" title="增加部件">
                <i v-if="$route.query.parts" class="el-icon-circle-plus-outline" style="font-size: 23px;margin: -2px -2px 0 -2px;"></i>
              </span>

              <span
                v-if="$route.query.isCms && (item.code === 'BJ2_SIZE' || item.code === 'BJ3_SIZE' || item.code === 'BJ4_SIZE') && ($route.query.subCateId === '36' || $route.query.subCateId === '37' || $route.query.subCateId === '38')"
                @click="removeCommonSize"
                class="setParts delPart el-icon-close"
                title="删除部件"
              ></span>
              <span
                v-else-if="(item.code === 'BJ2_SIZE' || item.code === 'BJ3_SIZE' || item.code === 'BJ4_SIZE') && ($route.query.subCateId === '36' || $route.query.subCateId === '37' || $route.query.subCateId === '38')"
                @click="removeCommonSize"
                class="setParts delPart icon icon-colse"
                title="删除部件"
              >
                <i v-if="$route.query.parts" class="el-icon-circle-close" style="font-size: 23px;margin: -2px -2px 0 -2px;"></i>
              </span>
            </div>
            <span v-if="item.code === 'YSSL' && $route.query.subCateId === '55'" class="plspn f12 C9">(可输入100,200,500,1000,2000,3000,5000,10000以上的10000整数倍)</span>
            <span v-if="item.code === 'YSSL' && $route.query.cateId === '10'" class="plspn f12 C9">(5000个起订)</span>
            <span v-if="item.code === 'YSSL' && ($route.query.subCateId === '51' || $route.query.subCateId === '120')" class="plspn f12 C9">(1000个起订,可输入1000整数倍)</span>
            <span v-if="item.code === 'YSSL' && $route.query.subCateId === '82'" class="plspn f12 C9">(光杯500个起订,定制5000个起订,可输入500整数倍;)</span>
            <span v-if="item.code === 'YSSL' && $route.query.subCateId === '52'" class="plspn f12 C9">(1000个起订,可输入1000,2000,3000,5000；10000以上的1000整数倍)</span>
          </div>
        </el-form-item>
        <el-form-item v-show="item.code === 'SIZE' && $route.query.cateId === '1' && $route.query.subCateId !== '24' && validData() && formData.goodSize.goodAl" :key="'common_size_warning' + index" label="温馨提示" class="red">
          <p>当尺寸盒型长超过高1/3或宽超过高1/2，存在喇叭口风险，建议修改盒型或更改开盒方向！</p>
        </el-form-item>
        <!-- 展开尺寸大小 -->
        <el-form-item v-if="item.code === 'SIZE' && formData.goodSize.goodAl && $route.query.subCateId !== '85' && $route.query.subCateId !== '96' && $route.query.subCateId !== '24'" :key="'common_size_' + index" label="展开尺寸">
          {{ formData.goodSize.goodAl }}mm*{{ formData.goodSize.goodAw }}mm
        </el-form-item>
        <!--        <el-form-item v-if="item.code === 'SIZE' && formData.goodSize.goodAl && $route.query.subCateId === '85'" :key="'common_size_' + index" label="刀卡1展开尺寸"> {{ formData.goodSize.goodAl }}mm*{{ formData.goodSize.goodAw }}mm </el-form-item>-->
        <!--        <el-form-item v-if="item.code === 'TWO_SIZE' && formData.goodSizeTwo.goodAl && $route.query.subCateId === '85'" :key="'common_size_tow_' + index" label="刀卡2展开尺寸">-->
        <!--          {{ formData.goodSizeTwo.goodAl }}mm*{{ formData.goodSizeTwo.goodAw }}mm-->
        <!--        </el-form-item>-->
      </template>
      <!-- 名片和联单说明 -->
      <el-form-item label="说明:" v-show="$route.query.cateId === '143' && $route.query.subCateId == '144'">
        <div style="width:400px;color:#898989;">印刷名片100张起订，每100张为一盒，下单数量1000张内按100增加，数量1000以上，按500来增加，5000以上，按照每1000来增加</div>
      </el-form-item>
      <el-form-item label="说明:" v-show="$route.query.cateId === '145' && $route.query.subCateId == '146'">
        <div style="width:400px;color:#898989;">印刷数量联单50本起订，按50本、100本及100倍数来下单</div>
      </el-form-item>
      <p v-if="$route.query.cateId == 122" style="margin-left:66px;color:#606266">盒子尺寸 {{ msize }}mm</p>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PriceCommon',
  props: {
    commonVoList: Array,
    commonFormData: Object,
    formData: Object,
    priceValuation: Function,
    numberChange: Function,
    otherInputChange: Function,
    addCommonSize: Function,
    removeCommonSize: Function
  },
  data() {
    return {
      showClass: false,
      SLXNumValue: 0,
      msize: sessionStorage.getItem('size') || ''
    };
  },
  methods: {
    abc(val) {
      const _this = this;
      _this.showClass = true;
      setTimeout(function() {
        _this.showClass = false;
      }, 800);
    },
    setSLXNumValue(val) {
      this.SLXNumValue = val;
    },
    //尺寸不对进行提示
    validData() {
      let l = this.commonFormData.inputValues['100_101'];
      let w = this.commonFormData.inputValues['100_102'];
      let h = this.commonFormData.inputValues['100_103'];
      if (l / h >= 1.3 || w / h >= 1.5) {
        return true;
      }
    },
    // 后台管理系统不需要显示数量，但是整体逻辑中需要数量，特此添加此补丁
    ifhide(item) {
      if (this.$route.query.isnum) {
        // isnum 线下报价 页面嵌套需要数量
        return true;
      }
      let arr = ['印刷数量', '每套数量', '同款款数'];
      if (this.$route.query.isCms && (arr.indexOf(item.name) != -1 ? true : false)) {
        return false;
      }
      return true;
    }
  }
};
</script>
<style>
.inputBx {
  width: 75%;
  display: block;
}
.inputBxrow {
  display: inline-block;
  height: 32px;
}
.inputBxrowSize:nth-child(4) {
  margin-top: 15px;
  border-left: 1px solid #dcdfe6;
}
</style>

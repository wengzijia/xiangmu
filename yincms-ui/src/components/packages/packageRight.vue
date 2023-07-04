<template>
  <div class="downLyRt tipsBkg">
    <div class="size" style="padding: 0 0 30px 30px">
      <h2>{{ packageRightData.title }}</h2>
      <div style="margin: 20px 0">
        <p v-if="packageRightData.formName">
          <span class="littleHead">适用商品：</span>
          <span style="color: #424242">{{ packageRightData.formName }}</span>
        </p>
        <p style="margin-top: 10px" v-if="packageRightData.attribute">
          <span class="littleHead">商品规格：</span>
          <span style="color: #424242">{{ packageRightData.attribute }}</span>
        </p>
        <!-- <p v-if="packageRightData.formSize !== '' && packageRightData.formSize !== null && packageRightData.formSize != 0 && packageRightData.formSize != '0_0_0'" style="color:#7d7d7d;font-size: 12px;margin-top:6px">
          <span>商品尺寸：</span>
          <span>{{ replaceAll(packageRightData.formSize, '_', ' x ') }}mm</span>
        </p> -->
      </div>
      <!-- 分割线 -->
      <el-divider v-if="packageRightData.isCustomized == 0"></el-divider>
      <!-- <ul class="tabs"> -->
      <ul class="tabs" v-if="packageRightData.isCustomized != 0">
        <li :class="tabsType == 1 ? 'active' : ''" @click="selectBox(1)">经典款</li>
        <li :class="tabsType == 2 ? 'active' : ''" @click="selectBox(2)">定制款</li>
      </ul>

      <!-- 经典款的包装方案组成： -->
      <div v-show="tabsType == 1">
        <div class="littleHead">包装方案组成：</div>
        <div class="checkbox" v-for="(items, index) in goodsList" :key="items.id">
          <el-checkbox v-model="items.checked" style="margin-right: 10px" @change="selectChecked(items.id)"></el-checkbox>
          <div class="check_right">
            <div class="check_tile">
              <span>{{ items.newName }}</span>
              <p>
                单价：<span style="color: #ff0000">￥{{ !items.checked || items.price == null ? '0.00' : items.price }}</span>
              </p>
            </div>
            <div class="check_size">
              <!-- <div> -->
              <!-- <span v-if="items.strSize.length != 0">成品外尺寸：{{ replaceAll(items.strSize[0], '_', ' x ') }}mm</span> -->
              <div class="acounts">
                <span>每套数量：{{ items.number }}个</span>
              </div>
              <!-- </div> -->
              <p class="look" @click="lookDetails(items)">查看参数＞</p>
            </div>
            <el-divider style="margin-top: 10px" v-if="index + 1 !== goodsList.length"></el-divider>
          </div>
        </div>
      </div>
      <!-- 定制款的包装方案组成： -->
      <div v-show="tabsType == 2" class="bigCustom">
        <!-- <div v-show="tabsType == 2 && packageRightData.isCustomized != 0" class="bigCustom"> -->
        <div class="customBox">
          <p class="customHead">包装方案组成：</p>
          <ul class="customStyle">
            <li v-for="(custom, index) in goodsList" :key="custom.id" :class="customId == null ? (packageRightData.customId == custom.id ? 'curr' : '') : customId == custom.id ? 'curr' : ''" @click="getGoodsInfo(custom, index)">
              <el-checkbox
                v-model="custom.checked"
                @change="selectChecked(custom.id)"
                @click.native="
                  event => {
                    event.stopPropagation();
                  }
                "
                style="margin-right: 10px"
              ></el-checkbox>
              <span style="color: #3a3a3a">{{ custom.newName }}</span>
            </li>
          </ul>
        </div>
        <div class="customSize">
          <p>已选-{{ composeName == null ? textName(packageRightData.newName) : textName(composeName) }} {{ goodsType != 'CheckDetail' ? '可选' : '' }}材质工艺参数：</p>
          <div>
            <span style="margin-right: 18px">每套数量: {{ composeNumber == null ? packageRightData.composeNumber : composeNumber }}个</span>
            <span
              >单价：<span style="color: #ca151d">￥{{ getGoodsPrice(goodsList[composeIndex]) }}</span>
            </span>
          </div>
        </div>
        <!-- 分割线 -->
        <el-divider></el-divider>
        <!-- 定制选项 ---插入组件部分-->
        <div class="otherParams">
          <!-- <goods-attr-cart></goods-attr-cart> -->
          <template v-for="(custom, index) in checkedGoodsList">
            <component
              :key="custom.id"
              v-if="custom.toComponent && custom.toComponent != '' && custom.toComponent != 'CheckDetail'"
              v-show="customId == custom.id"
              v-bind:is="custom.toComponent"
              :baseIds="baseIds"
              :activeCustomId="customId"
              :customId="custom.id"
              :oldFormData="custom.oldFormData"
              @setGoodsAttr="
                e => {
                  setGoodsAttr(e, index);
                }
              "
            ></component>
            <component v-if="custom.toComponent == 'CheckDetail'" v-show="customId == custom.id" v-bind:is="custom.toComponent" :key="custom.id" :detailsList="custom.attrList"></component>
          </template>
          <!-- <component v-bind:is="goodsType" ></component> -->
          <!-- <div>
            <span style="color:#606266;margin-right:18px">成品外尺寸</span>
            <span style="color:#3A3A3A;">155X75X165mm <span style="color:#606266;">(展开尺寸：480X260mm)</span></span>
          </div>
          <div style="display: flex;margin-top:10px">
            <span style="color:#606266;margin-right:32px;">纸张材质</span>
            <ul style="display: flex;">
              <li class="itemsParams">单铜纸</li>
              <li class="itemsParams" style="border: 1px solid #A4A4A4;">粉灰纸</li>
            </ul>
          </div>
          <div style="display: flex;margin-top:10px">
            <span style="color:#606266;margin-right:32px;">印刷颜色</span>
            <ul style="display: flex;">
              <li class="itemsParams">普通印刷</li>
              <li class="itemsParams" style="border: 1px solid #A4A4A4;">双面印刷</li>
            </ul>
          </div> -->
        </div>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <div class="littleHead styles">
        <span>包装设计风格：</span>
        <div v-if="packageRightData.isCustom" class="editor">
          <span>我要自定义设计</span>
          <span class="editorBtn" @click="editorVisible = true">
            <img style="width: 16px" src="@/static/mulindex/img/editor.png" alt="" />
            <span style="margin-left: 6px">去编辑></span>
          </span>
        </div>
      </div>
      <div style="display: flex">
        <div class="ordinary">
          <!-- <span class="txt">普通图案：</span> -->
          <ul v-if="packageRightData.ordImg[0]">
            <li v-for="(item, index) in packageRightData.ordImg" :key="index" @click="radioSelected(item.id, 'ord', item.designVideo, item.goodsImg.watermark)">
              <div :class="['imgs', packageRightData.ordflag && item.id == packageRightData.ordId ? 'active' : '']">
                <!-- <div :class="['imgs', packageRightData.ordflag && item.id == packageRightData.ordId ? 'active' : '']" v-show="index < 3 || imgShow1"> -->
                <img class="sImages" :src="imgSrc + item.goodsImg.firstThumbnail" alt="" />
              </div>
              <div class="iconSet">
                <span>{{ item.styleName }}</span>
              </div>
            </li>

            <!-- <li class="open" v-if="packageRightData.ordImg.length > 3" @click="openImg(1)">
                    <div v-if="!imgShow1">
                      <span style="margin-left: 3px;">展开</span>
                      <span class="el-icon-arrow-down" style="margin-left: 8px;"></span>
                    </div>
                    <div v-if="imgShow1">
                      <span style="margin-left: 3px;">收起</span>
                      <span class="el-icon-arrow-up" style="margin-left: 8px;"></span>
                    </div>
                  </li> -->
          </ul>
          <!-- </div> -->
          <!-- <div class="ordinary" v-if="packageRightData.excImg.length"> -->
          <!-- <span class="txt"> 独家图案：</span> -->
          <ul v-if="packageRightData.excImg.length">
            <li v-for="(k, i) in packageRightData.excImg" :key="i" @click="radioSelected(k.id, 'exc', k.designVideo, k.goodsImg.watermark)">
              <div :class="['imgs', packageRightData.excflag && k.id == packageRightData.excId ? 'active' : '']">
                <!-- <div :class="['imgs', packageRightData.excflag && k.id == packageRightData.excId ? 'active' : '']" v-show="i < 3 || imgShow2"> -->
                <img class="sImages" :src="imgSrc + k.goodsImg.firstThumbnail" alt="" />
              </div>
              <div class="iconSet">
                <span>{{ k.styleName }}</span>
              </div>
            </li>
            <!-- <li class="open" v-if="packageRightData.excImg.length > 3" @click="openImg(2)">
                    <div v-if="!imgShow2">
                      <span style="margin-left: 3px;">展开</span>
                      <span class="el-icon-arrow-down" style="margin-left: 8px;"></span>
                    </div>
                    <div v-if="imgShow2">
                      <span style="margin-left: 3px;">收起</span>
                      <span class="el-icon-arrow-up" style="margin-left: 8px;"></span>
                    </div>
                  </li> -->
          </ul>
        </div>
        <!-- 自定义设计 -->
        <div class="ordinary" v-if="packageRightData.customList">
          <ul>
            <li class="myselft" v-for="(cus, index) in packageRightData.customList" :key="cus.id" @click="radioSelected(cus.id, 'cus', cus.customVal)">
              <div :class="['imgs', 'originEditor', packageRightData.cusFlag && cus.id == packageRightData.cusId ? 'active' : '']">
                <img class="sImages" :src="imgSrc + cus.customVal[0].previewImg" alt="" />
                <div style="margin-right: 6px">
                  <p>自定义设计{{ index > 0 ? index : '' }}</p>
                  <p style="color: #8a8a8c; font-size: 12px">来源编辑器</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <p class="tips" v-if="packageRightData.excImg.length"><span style="color: red">*</span> 独家图案仅销售一次，出售后立即下架，再也不担心撞盒了</p>
      <!-- 分割线 -->
      <el-divider></el-divider>

      <div class="backgrd">
        <div>
          <span style="margin-right: 30px">打样适配</span>
          <!-- <span style="color:#828688">默认需打样，满10000元赚送打样</span> -->
          <el-radio-group v-model="buyParms.isAdaptiveProof">
            <el-radio :label="1" style="color: #101010">需要</el-radio>
            <el-radio :label="0" style="color: #101010">不需要</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="backgrd">
        <form class="flex areBox" action="" style="align-items: center">
          <span class="cityBox">配送城市</span>
          <!-- <div class="layui-form-item" style="flex:none">
            <el-select size="small" v-model="sendFormData.provinceId" placeholder="请选择省份" style="width: 130px" @change="selectCity($event, 'province')">
              <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
            </el-select>
          </div>
          <div class="layui-form-item" style="flex:none">
            <el-select size="small" v-model="sendFormData.cityId" placeholder="请选择城市" style="width: 130px" @change="selectCity($event, 'city')">
              <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="sendFormData.provinceId + '_' + index"> </el-option>
            </el-select>
          </div>
          <div class="layui-form-item" v-if="false">
              <el-select size="small" v-model="sendFormData.countyId" placeholder="请选择区/县" style="width: 130px" @change="selectCity($event, 'county')">
                <el-option v-for="(item, index) in countyList" :key="index" :label="item" :value="sendFormData.cityId + '_' + index"> </el-option>
              </el-select>
            </div> -->
          <div class="addressValue">
            <el-cascader style="width: 320px" :props="options" @change="handlerValue" placeholder="请选择配送地区"></el-cascader>
          </div>
        </form>
        <div class="send_fee">
          <!-- <p class="sends">
                    <span>出货时间:</span>
                    <span>{{ time }}小时（{{ day }}天）</span>
                  </p> -->
          <p class="fees">
            <span style="margin-right: 44px">物流费</span>
            <span class="red" v-if="packageRightData.fee === '910007'">该地区不支持配送</span>
            <span style="color: #f00" v-else>￥{{ packageRightData.fee == 0 ? '0.00' : packageRightData.fee }}</span>
          </p>
        </div>
      </div>
      <div class="backgrd">
        <div class="mount">
          <span class="nums">订购数量</span>
          <el-input placeholder="请输入订购数量" v-model.number="packageRightData.sum" size="small" style="width: 190px" @blur="inputChang" @change="changeStatus">
            <template slot="append">套</template>
          </el-input>
          <span style="color: #aeaeae; font-size: 12px">（{{ packageRightData.minNumber }}起订）</span>
        </div>
        <div class="buy_now">
          <p>
            <span style="color: #101010; font-weight: normal; margin-right: 58px">总价</span>
            <span style="color: #ff0000; font-size: 12px; font-weight: 700">￥</span>
            <span style="color: #ff0000; font-size: 20px; font-weight: 700">{{ packageRightData.totalOld == 0 ? '0.00' : packageRightData.totalOld + Number(packageRightData.fee) }}</span>
          </p>
        </div>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <button class="btns" @click="purchaseNow">立即下单</button>
      <!-- <button v-if="disableFlag" class="btns" @click="purchaseNow">立即下单</button>
              <el-button v-else type="danger" disabled style=" width:100%">危险按钮</el-button> -->
      <ul class="muchTips">
        <!-- <li>温馨提示</li> -->
        <li>
          <div class="geRtSection"><span class="point"></span> 输入的订购数量不能低于您包装方案组成选中的组件的起订量；</div>
          <div class="geRtSection" style="margin-top: 6px">
            <span class="point"></span> 20点前确认，当天20点开始计算；20点后确认，次日20点开始计算；周日和节假日不计货期。
            <a href="/news/detail?id=102" class="bule">计时规则</a>
          </div>
        </li>
      </ul>
    </div>
    <div class="message" :style="'opacity:' + packageRightData.messageTips + ';'">
      <i class="el-message__icon el-icon-warning"></i>最低起订量为<span style="color: #f00">{{ packageRightData.minNumber }}</span
      >个
    </div>
    <div class="message" :style="'opacity:' + packageRightData.payNumbers + ';'"><i class="el-message__icon el-icon-warning"></i>请输入订购数量</div>

    <el-dialog title="提示" center :visible.sync="editorVisible" width="500px">
      <span>{{ packageRightData.customFlag ? '当前方案已生成【自定义设计】，你确认要再编辑吗？' : ' 当前方案没有【自定义设计】，你确认要编辑去自定义设计吗？' }}</span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button v-if="packageRightData.customFlag" type="primary" @click="confirmEditor(1)">在原基础上再设计</el-button>
        <el-button v-if="packageRightData.customFlag" type="primary" @click="confirmEditor(2)">删除后重新设计</el-button>
        <el-button v-if="!packageRightData.customFlag" type="primary" @click="confirmEditor(3)">确认编辑</el-button> -->
        <a v-if="packageRightData.customFlag" :href="url + $route.query.id + '&isFirst=0' + '&key=' + packageRightData.customList[0].customVal[0].designNo" style="color: #fff"
          ><el-button type="primary" class="bkgBth" @click="confirmEditor(1)">原基础上再设计</el-button></a
        >
        <a v-if="packageRightData.customFlag" :href="url + $route.query.id + '&isFirst=1'" style="color: #fff; margin-left: 10px"><el-button type="primary" class="deletStyle" @click="confirmEditor(2)">删除后重新设计</el-button></a>
        <a v-if="!packageRightData.customFlag" :href="url + $route.query.id + '&isFirst=1'" style="color: #fff"><el-button type="primary" class="bkgBth" @click="confirmEditor(3)">确认编辑</el-button></a>
        <el-button class="cancelBtn" @click="editorVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { replaceAll } from '@/utils/objectUtil';
import { strEquals } from '@/utils/strUtil';
import goodsAttrCart from './goodsAttr/HardcoverQuotation.vue';
import HardcoverQuotation from './goodsAttr/HardcoverQuotation.vue';
import Index from './goodsAttr/Index.vue';
import CartIndex from './goodsAttr/CartIndex.vue';
import ExplainIndex from './goodsAttr/ExplainIndex.vue';
import CartonIndex from './goodsAttr/CartonIndex.vue';
import CheckDetail from './checkDetail2.vue';
import { debounce } from '@/utils/utils';
import axios from 'axios';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { getAllVoList } from '@/api/category/categoryApi';
import { updateDelState } from '@/api/zbz/packCategoryApi';

export default {
  components: {
    // goodsAttrCart: goodsAttrCart,
    Index,
    CartIndex,
    CartonIndex,
    HardcoverQuotation,
    ExplainIndex,
    CheckDetail
  },
  name: 'packageRight',
  props: {
    options: Object,
    goodsList: Array,
    // provinceList: Array,
    // cityList: Array,
    // countyList: Array,
    selectChecked: Function,
    lookDetails: Function,
    radioSelected: Function,
    handlerValue: Function,
    buyParms: Object,
    // customList: Array,
    packageRightData: Object,
    sendFormData: Object,
    inputChang: Function,
    changeStatus: Function,
    purchaseNow: Function,
    // selectCity: Function,
    getPriceFn: Function,
    deleteBatchByIdFn: Function
  },
  data() {
    return {
      imgSrc: 'http://alifile.xiaocaiyin.com/',
      // url: ' http://192.168.1.222/editthree/design?id=',
      url: '/editthree/design?id=',
      tabsType: 1,
      customId: null,
      composeName: null,
      composeNumber: null,
      composePrice: null,
      composeIndex: 0,
      // customList: [],
      goodsType: '',
      baseIds: {
        cateId: '',
        subCateId: '',
        goodsId: ''
      },
      checkedGoodsList: [],
      goodsIsPackIds: {},
      // textTips: '当前方案没有【自定义设计】，你确认要编辑去自定义设计吗？',
      editorVisible: false
      // customFlag: false //是否已经有自定义风格
    };
  },
  methods: {
    replaceAll,
    confirmEditor(type) {
      this.editorVisible = false;
      if (type == 2) {
        this.deleteBatchByIdFn();
      }
      if (type == 1) {
        this.updateDelStateFn();
      }
    },
    selectBox(type) {
      if (this.tabsType != type) {
        this.$report({
          channel: 161003,
          actionId: type
        });
      }
      this.tabsType = type;
      // 是否弹出登录框  0  不弹   1 弹
      this.getPriceFn(1);
    },
    textName(str) {
      if (!str) str = '';
      let arr = str?.split('_');
      if (arr != undefined) {
        return arr[arr?.length - 1];
      }
    },
    updateDelStateFn() {
      const parms = {
        data: {
          designNo: this.packageRightData.customList[0].customVal[0].designNo
        }
      };
      updateDelState(parms).then(res => {
        // console.log('updateEditorDesignState', res);
      });
    },
    // czj 获取商品的旧数据，用于回显
    getGoodsInfo(custom, index) {
      let _this = this;
      if (!custom.goodUrl) {
        return;
      }
      const token = localStorage.getItem(ACCESS_TOKEN);
      const queryArgs = {
        url: '/api/consumer/certifyFree/alibaba/oss/getDownloadFile',
        method: 'get',
        params: {
          fileName: custom.goodUrl
        },
        headers: {
          token: token
        }
      };
      axios(queryArgs).then(res => {
        // console.log('res', res.data);
        let toComponent = _this.toComponent(custom.categoryId, custom.sdCategoryId, _this.goodsIsPackIds[custom.goodsId]);
        custom.toComponent = toComponent;
        custom.oldFormData = res.data;
        _this.customId = custom.id;
        _this.composeName = custom.composeName;
        _this.composePrice = custom.price;
        _this.composeNumber = custom.number;
        _this.baseIds = {
          cateId: custom.categoryId + '',
          subCateId: custom.sdCategoryId + '',
          goodsId: custom.goodsId + ''
        };
        // console.log('ddddd', custom);
        // console.log('getGoodsInfo', toComponent);
        _this.goodsType = toComponent;
        _this.$set(_this.checkedGoodsList, index, JSON.parse(JSON.stringify(custom)));
        _this.composeIndex = index;
        // console.log(_this.checkedGoodsList);
      });
    },
    // czj 设置goodsAttr数据
    setGoodsAttr(item, index) {
      let _this = this;
      console.log('item', item);
      console.log('item', index);
      // 获取旧的展开尺寸数据
      let str = _this.goodsList[index].goodsAttr.split(';').find(e => e.indexOf('展开尺寸') != -1);
      let goodsAttr = item
        .split(';')
        .map(e => {
          if (e.indexOf('展开尺寸') != -1) {
            return str;
          }
          return e;
        })
        .join(';');
      _this.$set(_this.goodsList[index], 'goodsAttr2', goodsAttr);
      _this.$nextTick(() => {
        _this.$emit('resetPrice', index);
      });
      console.log('_this.goodsList', _this.goodsList);
    },
    /**
     * 根据id判断该分类使用的组件，并返回组件名称
     */
    toComponent(cateId, subCateId, isPack) {
      let url = '';
      if (!isPack) return 'CheckDetail';
      if (strEquals(cateId, '1')) {
        if (strEquals(subCateId, '24')) {
          url = 'Index';
        } else {
          url = 'CartIndex';
        }
      } else if (strEquals(cateId, '2')) {
        url = 'Index';
      } else if (strEquals(subCateId, '128') || strEquals(subCateId, '129') || strEquals(subCateId, '130') || strEquals(subCateId, '137') || strEquals(subCateId, '138')) {
        url = 'HardcoverQuotation';
      } else if (strEquals(cateId, '9')) {
        url = 'ExplainIndex';
      } else if (strEquals(cateId, '8') && strEquals(subCateId, '61')) {
        url = 'Index';
      } else if (strEquals(cateId, '13')) {
        url = 'ExplainIndex';
      } else if (strEquals(cateId, '70')) {
        url = 'CartonIndex';
      } else {
        if (strEquals(subCateId, '82')) {
          url = 'ExplainIndex';
        } else {
          url = 'Index';
        }
      }
      return url;
    },
    /** 获取商品价格 */
    getGoodsPrice(goods) {
      return goods ? goods.price2 || goods.price || '0.00' : '0.00';
    },
    getAllVoListFun() {
      getAllVoList({ isPack: '1' })
        .then(res => {
          let data = res.data;
          let goodsIds = {};
          function treeList(list, ids) {
            for (let index = 0; index < list.length; index++) {
              if (list[index].children.length > 0) treeList(list[index].children, ids);
              if (list[index].data.goodsId && list[index].data.goodsId != 0) ids[list[index].data.goodsId] = list[index].data.isPack;
              // if(!list[index].data.goodsId&&list[index].data.goodsId != 0) console.log(list[index])
            }
          }

          treeList(data, goodsIds);
          this.goodsIsPackIds = goodsIds;
        })
        .catch(error => {});
    }
  },
  watch: {
    // czj  监听goodsList的变化，因为goodsList是异步获取到数据的，可能在created的时候是一个空数组，
    goodsList: {
      deep: true,
      handler: function(newVal, oldVal) {
        let _this = this;
        if (oldVal.length == 0 || oldVal[0].id != newVal[0].id) {
          _this.checkedGoodsList = JSON.parse(JSON.stringify(newVal));
          if (_this.checkedGoodsList[0].toComponent != 'CheckDetail') _this.getGoodsInfo(_this.checkedGoodsList[0], 0);
          // _this.getGoodsInfo(_this.checkedGoodsList[0], 0);
        }
      }
    }
  },
  created() {
    this.getAllVoListFun();
  }
};
</script>

<style scoped>
.ordinary li {
  position: relative;
}

/* 可注释样式 start */
.otherParams .itemsParams {
  width: 70px;
  height: 34px;
  background: #ffffff;
  border-radius: 1px;
  border: 1px solid #ca151d;
  line-height: 34px;
  text-align: center;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

/*可注释样式  end */
.bkgBth {
  background-color: #e9333f;
  border-color: #e9333f;
}

.deletStyle {
  background-color: #fff;
  border-color: #e9333f;
  color: #e9333f;
}

.cancelBtn {
  margin-left: 10px;
}

.originEditor {
  display: flex;
}

.muchTips {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.geRtSection {
  display: flex;
  align-items: center;
}

.point {
  /* padding: 1px; */
  /* border: 1px solid #bcbcbc; */
  width: 4px;
  height: 4px;
  display: inline-block;
  background: #777;
  border-radius: 50%;
  margin-right: 6px;
}

.tabs {
  margin-top: 18px;
  display: flex;
  /* align-items: center; */
}

.tabs > li {
  width: 355px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #ccc;
  box-sizing: border-box;
  cursor: pointer;
}

.tabs > li.active {
  background: #e9333f;
  border: 1px solid #e9333f;
  color: #fff;
}

.downLyRt {
  background: #fff !important;
  width: 700px !important;
  position: relative;
}

.downLyRt .styles {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.downLyRt .styles .editor {
  display: flex;
  align-items: center;
  color: #7d7d7d;
  font-weight: normal;
}

.downLyRt .styles .editor .editorBtn {
  width: 103px;
  height: 26px;
  cursor: pointer;
  color: #1580bd;
  padding: 6px 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: url('../../static/mulindex/img/editorbox.png') no-repeat;
  background-size: cover;
  margin-left: 10px;
}

.downLyRt .littleHead {
  margin-top: 10px;
  font-size: 14px;
  color: #101010;
  font-weight: 700;
}

.downLyRt .message {
  position: absolute;
  bottom: 240px;
  left: 24%;
  transform: translateY(-50%);
  background-color: #fdf6ec;
  border-color: #faecd8;
  transition: opacity 0.3s, transform 0.4s, top 0.4s;
  padding: 10px 15px 10px 15px;
  color: #e6a23c;
  box-sizing: border-box;
  border-width: 1px;
  border-radius: 4px;
  border-style: solid;
}
</style>
<style>
.tipsBkg .el-dialog__title {
  font-size: 16px;
  font-weight: 700;
}

.tipsBkg .cancelBtn:focus,
.tipsBkg .cancelBtn:hover {
  color: #606266;
  background-color: #fff;
  border: 1px solid #dcdfe6;
}

.checkbox .el-checkbox__inner,
.customStyle .el-checkbox__inner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.checkbox .el-checkbox__inner::after,
.customStyle .el-checkbox__inner::after {
  width: 4px;
  height: 9px;
  top: 1px;
  left: 5px;
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
}

/* .checkbox .el-checkbox__inner {
  border-radius: 50%;
} */
.customStyle .el-checkbox__input.is-checked .el-checkbox__inner,
.customStyle .el-checkbox__input.is-indeterminate .el-checkbox__inner,
.checkbox .el-checkbox__input.is-checked .el-checkbox__inner,
.checkbox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #e9333f;
  border-color: #e9333f;
  border-radius: 50%;
}

.customStyle .el-checkbox__input.is-checked + .el-checkbox__label,
.checkbox .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #e9333f;
}

.customStyle .el-checkbox.is-bordered.is-checked,
.checkbox .el-checkbox.is-bordered.is-checked {
  border-color: #e9333f;
  border-radius: 50%;
}

.customStyle .el-checkbox__input.is-focus .el-checkbox__inner,
.checkbox .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #dcdfe6;
  border-radius: 50%;
}

.customStyle .el-checkbox__inner:hover,
.checkbox .el-checkbox__inner:hover {
  border-color: #e9333f;
  border-radius: 50%;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #101010;
}

.backgrd .el-radio__input.is-checked .el-radio__inner {
  border-color: #e9333f;
  background: #e9333f;
}

.backgrd .el-radio__inner:hover {
  border-color: #e9333f;
  border-radius: 50%;
}

.addressValue .el-cascader .el-input .el-input__inner:focus,
.addressValue .el-cascader .el-input.is-focus .el-input__inner {
  border-color: #ff0036;
}

.el-cascader-node.in-active-path,
.el-cascader-node.is-active,
.el-cascader-node.is-selectable.in-checked-path {
  color: #ff0036;
}
</style>

<style scoped src="@/static/mulindex/css/fonts.css" />

<style scoped src="@/static/mulindex/css/public.css" />

<style scoped src="@/static/mulindex/css/index_new.css" />

<style scoped src="@/static/mulindex/css/attr.css" />

<style scoped src="@/static/mulindex/css/packag_details.css" />

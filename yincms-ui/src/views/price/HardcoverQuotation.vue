<!-- fengjianbo -->
<template>
  <div class="hardcover">
    <el-row>
      <el-col>
        <div class="comBox guigeBox cardBox needhide">
          <div class="guigeLt">
            <div class="cardtabT flex">
              <h1 class="flex guigeH1" style="width: 100%">
                <span class="geH1Lt">精装盒-{{ titleobj.name }} </span><span class="lookBnt"><a :href="'/goods/goodsDesc?gid=' + goodsId" class="" target="_blank">查看产品详情</a></span>
              </h1>
            </div>
            <div class="EattrMbox">
              <!-- <div class="guigeImg tgimg">
                <img src="" alt="" />
              </div> -->

              <div class="laybox" v-for="(v, m) in common" :key="m" style="padding: 5px 0" v-show="data2.length">
                <div class="EattrLab" style="line-height: 31px">
                  <span class="red">*</span>
                  {{ v.name }}：
                </div>
                <el-row class="flex inputBx Layerinpts">
                  <div class="inputBxrow" v-for="(vv, mm) in v.attrList" :key="mm">
                    <el-input v-model="priceFormData[vv.val]" :placeholder="vv.name" size="small" @change="sizechange(vv.groupId)">
                      <template slot="append"> {{ vv.suffix }} </template>
                    </el-input>
                  </div>
                </el-row>
              </div>

              <el-form class="EattrMain" ref="formData" :model="formData" label-width="10px" @submit.native.prevent size="small">
                <template v-for="(item, index) in data2">
                  <el-form-item :key="index">
                    <!-- <template slot="label"> -->
                    <div class="eattrtitle" style="padding-top: 5px; text-indent: 1em">
                      <!-- <span class="red">*</span> -->
                      {{ item.miniZtAttrGroup.name }}{{ item.miniZtAttrGroup.code.split('_')[1] == 1 ? '' : item.miniZtAttrGroup.code.split('_')[1] }}
                      <el-button v-if="item.miniZtAttrGroup.code.indexOf('add') > -1" @click="addlay(item)" class="titlebtn">添加</el-button>
                      <el-button type="danger" v-if="item.miniZtAttrGroup.code.indexOf('remove') > -1" @click="removelay(item, index)" class="titlebtn">删除</el-button>
                    </div>
                    <!-- </template> -->
                    <div v-for="(citem, i) in item.attrList" :key="i" class="laybox" v-show="citem.miniZtAttrGroup.actualValue != 'title'">
                      <div :class="citem.miniZtAttrGroup.showName ? 'laycon' : 'laycon childactive'">
                        <div :class="!citem.miniZtAttrGroup.showName && citem.miniZtAttrGroup.code.indexOf('CHILD') != -1 ? 'laychild childactive3' : 'laychild'">
                          <div :class="citem.miniZtAttrGroup.showName ? 'EattrLab' : !citem.miniZtAttrGroup.showName && citem.miniZtAttrGroup.code.indexOf('CHILD') != -1 ? 'EattrLab  bgcolor' : 'EattrLab  bgcolor2'">
                            <span class="red" v-if="citem.miniZtAttrGroup.required === 1">*</span>
                            {{ citem.miniZtAttrGroup.name }}
                          </div>

                          <!-- 文本框 -->
                          <el-row class="flex inputBx Layerinpts" v-if="strEquals(citem.miniZtAttrGroup.groupType, 'input')">
                            <div class="inputBxrow" v-for="attr in citem.attrList" :key="attr.id">
                              <el-input v-model="inputdata[citem.miniZtAttrGroup.id + '_' + attr.id]" :placeholder="attr.inputTips" size="small" @change="inpchange(attr.name, citem.miniZtAttrGroup.id + '_' + attr.id)">
                                <template slot="append"> {{ attr.suffix }} </template>
                              </el-input>
                            </div>
                          </el-row>

                          <!-- 单选框 -->
                          <div class="flex" v-else-if="strEquals(citem.miniZtAttrGroup.groupType, 'radio')">
                            <el-radio-group class="EattrMgroup" size="small" v-model="radiodata[citem.miniZtAttrGroup.id]" button-style="solid" @change="radiochange({ event: $event, child: citem.miniZtAttrGroup.actualValue, index: index, i: i })">
                              <el-row class="Eattrrow" v-for="attr in citem.attrList" :key="'attr_' + attr.id">
                                <el-radio-button size="small" :label="attr.groupId + '_' + attr.id">
                                  {{ attr.name }}
                                  <!-- {{ attr.groupId }},{{ attr.id }} -->
                                </el-radio-button>
                              </el-row>
                            </el-radio-group>
                            <!-- <span v-if="citem.miniZtAttrGroup.actualValue == 'child'">
                              <el-button type="danger" @click="radiocancel(citem.miniZtAttrGroup.id, index)">取消</el-button>
                            </span> -->
                            <!-- <span v-if="citem.miniZtAttrGroup.code.indexOf('btn') > -1">
                              <el-button type="danger" @click="addchild(citem, i)">新增</el-button>
                            </span>
                            <span v-else-if="citem.miniZtAttrGroup.code.indexOf('del') > -1">
                              <el-button type="danger" @click="delchild(index, i)">删除</el-button>
                            </span> -->
                          </div>

                          <!-- 复选框 -->
                          <div class="flex" v-else-if="strEquals(citem.miniZtAttrGroup.groupType, 'checkbox')">
                            <template v-if="citem.miniZtAttrGroup.code.indexOf('parent') > -1">
                              <el-row class="Eattrrow" v-for="(attr, i) in citem.attrList" :key="i">
                                <el-checkbox-button :label="attr.id.toString()" v-model="parentdata" :disabled="i == 0 || i == 2 ? true : false" @change="parentchange($event, attr.id, attr.name)"> {{ attr.name }} </el-checkbox-button>
                              </el-row>
                            </template>
                            <!-- <el-checkbox-group class="EattrMgroup" size="small" v-model="parentdata" v-if="citem.miniZtAttrGroup.code.indexOf('parent') > -1">
                              <el-row class="Eattrrow" v-for="attr in citem.attrList" :key="'attr_' + attr.id">
                                <el-checkbox-button :label="attr.id.toString()" :true-label="attr.id" :false-label="attr.id" @change="parentchange"> {{ attr.name }}{{ attr.id }} </el-checkbox-button>
                              </el-row>
                            </el-checkbox-group> -->
                            <el-row class="Eattrrow" v-for="cattr in citem.attrList" :key="'attr_' + cattr.id" v-else>
                              <el-checkbox-button :label="cattr.groupId + '_' + cattr.id" v-model="checkdata[citem.miniZtAttrGroup.id]" @change="childchange($event, cattr.id, index, i, cattr.groupId)">
                                {{ cattr.name }}
                              </el-checkbox-button>
                            </el-row>
                            <!-- <el-checkbox-group class="EattrMgroup" size="small" v-model="checkdata[citem.miniZtAttrGroup.id]" v-else>
                              <el-row class="Eattrrow" v-for="attr in citem.attrList" :key="'attr_' + attr.id">
                                <el-checkbox-button :label="citem.miniZtAttrGroup.id + '_' + attr.id"> {{ attr.name }} </el-checkbox-button>
                              </el-row>
                            </el-checkbox-group> -->
                          </div>

                          <!-- 下拉选择框 -->
                          <div v-else-if="strEquals(citem.miniZtAttrGroup.groupType, 'select')">
                            <div v-if="citem.miniZtAttrGroup.actualValue == 'linkage'">
                              <el-cascader v-if="citem.attrList.length" v-model="cascaderdata[citem.miniZtAttrGroup.id]" :options="citem.attrList" :key="citem.attrList.length" :props="{ value: 'name', label: 'name' }" @change="getprice">
                                <template slot-scope="{ node, data }">
                                  <span>{{ data.name }}</span>
                                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                                </template>
                              </el-cascader>
                            </div>
                            <el-select size="small" v-model="selectdata[citem.miniZtAttrGroup.id]" placeholder="请选择" style="width: 150px" @change="getprice" v-else>
                              <el-option v-for="(attr, aindex) in citem.attrList" :key="aindex" :label="attr.name" :value="attr.groupId + '_' + attr.id"> </el-option>
                            </el-select>
                          </div>

                          <span v-if="citem.miniZtAttrGroup.code.indexOf('YSFS') > -1">
                            <span class="yszs">印刷颜色</span>
                            <el-select size="small" v-model="printing[citem.miniZtAttrGroup.id]" placeholder="请选择" style="width: 120px" @change="getprice">
                              <el-option label="四色印刷" :value="citem.miniZtAttrGroup.code.indexOf('ML') > -1 ? '面纸1印刷颜色:四色印刷;' : '衬纸印刷颜色:四色印刷;'"></el-option>
                              <el-option label="双色印刷" :value="citem.miniZtAttrGroup.code.indexOf('ML') > -1 ? '面纸1印刷颜色:双色印刷;' : '衬纸印刷颜色:双色印刷;'"></el-option>
                              <el-option label="单色印刷" :value="citem.miniZtAttrGroup.code.indexOf('ML') > -1 ? '面纸1印刷颜色:单色印刷;' : '衬纸印刷颜色:单色印刷;'"></el-option>
                              <el-option label="无" value=""></el-option>
                            </el-select>
                            <span class="yszs">专色数量</span>
                            <el-select size="small" v-model="spot[citem.miniZtAttrGroup.id]" placeholder="请选择" style="width: 120px" @change="getprice">
                              <el-option label="0" value=""></el-option>
                              <el-option label="1" :value="citem.miniZtAttrGroup.code.indexOf('ML') > -1 ? '面纸1专色:1;' : '衬纸专色:1;'"></el-option>
                              <el-option label="2" :value="citem.miniZtAttrGroup.code.indexOf('ML') > -1 ? '面纸1专色:2;' : '衬纸专色:2;'"></el-option>
                              <el-option label="3" :value="citem.miniZtAttrGroup.code.indexOf('ML') > -1 ? '面纸1专色:3;' : '衬纸专色:3;'"></el-option>
                              <el-option label="4" :value="citem.miniZtAttrGroup.code.indexOf('ML') > -1 ? '面纸1专色:4;' : '衬纸专色:4;'"></el-option>
                            </el-select>
                          </span>
                        </div>
                      </div>
                      <div class="laycon childactive" style="text-indent: 3em;" v-if="citem.miniZtAttrGroup.name == '圆磁对数'">
                        <div class="laychild">
                          <div class="flex">
                            温馨提示：1粒磁铁+1片铁片组合为一对
                          </div>
                        </div>
                      </div>
                    </div>

                    <template v-if="index == 0">
                      <div class="laybox">
                        <div class="laycon">
                          <div class="laychild">
                            <div class="EattrLab">结构</div>
                            <div class="flex">
                              <el-radio-group class="EattrMgroup" size="small" v-model="dew" button-style="solid">
                                <el-row class="Eattrrow">
                                  <el-radio-button size="small" @click.native.prevent="sizechange(100, 1)" label="1"> 露腰 </el-radio-button>
                                </el-row>
                              </el-radio-group>
                              <el-radio-group class="EattrMgroup" size="small" v-model="dew" button-style="solid" @change="sizechange(100)">
                                <el-row class="Eattrrow">
                                  <el-radio-button size="small" @click.native.prevent="sizechange(100, 2)" label="2"> 露底 </el-radio-button>
                                </el-row>
                              </el-radio-group>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="laybox" v-if="dew">
                        <div class="laycon">
                          <div class="laychild">
                            <div class="EattrLab">露{{ dew == 1 ? '腰' : '底' }}高度</div>
                            <div class="flex">
                              <el-row class="flex inputBx Layerinpts">
                                <div class="inputBxrow">
                                  <el-input v-model="dewinp" placeholder="高" size="small" @change="sizechange(100)">
                                    <template slot="append"> mm </template>
                                  </el-input>
                                </div>
                              </el-row>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-form-item>
                </template>
              </el-form>
            </div>
            <div class="laybox" style="margin-left: 10px;margin-top:-12px;" v-show="data2.length">
              <div class="laycon">
                <div class="laychild">
                  <div class="EattrLab" style="line-height: 36px"><span class="red">*</span>组合方式</div>
                  <div class="flex">
                    <el-radio-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice">
                      <el-row class="Eattrrow">
                        <el-radio-button size="small" label="组合方式:粘接;"> 粘接 </el-radio-button>
                      </el-row>
                    </el-radio-group>
                    <el-radio-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice">
                      <el-row class="Eattrrow">
                        <el-radio-button size="small" label="组合方式:铆接;"> 铆接 </el-radio-button>
                      </el-row>
                    </el-radio-group>
                    <el-radio-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice">
                      <el-row class="Eattrrow">
                        <el-radio-button size="small" label="组合方式:绑定;"> 绑定 </el-radio-button>
                      </el-row>
                    </el-radio-group>
                    <el-radio-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice">
                      <el-row class="Eattrrow">
                        <el-radio-button size="small" label="组合方式:锁定;"> 锁定 </el-radio-button>
                      </el-row>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
            <!-- 整体配件 -->
            <div class="laybox" style="margin-left: 10px;margin-top:-12px;" v-show="data2.length">
              <div class="laycon">
                <div class="laychild">
                  <div class="EattrLab" style="line-height: 36px"><span class="red">*</span>整体配件</div>
                  <div class="flex">
                    <el-checkbox-group class="EattrMgroup" size="small" v-model="entiretyGroup" button-style="solid">
                      <el-row class="Eattrrow" v-for="item in entiretyList" :key="item.id">
                        <el-checkbox-button size="small" :label="item.name"> {{ item.name }} </el-checkbox-button>
                      </el-row>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
            <el-form class="EattrMain" label-width="10px">
              <template v-for="item in entiretyList">
                <el-form-item :key="item.id" v-if="item.isShow">
                  <div class="eattrtitle" style="padding-top: 5px; text-indent: 1em">整体配件 - {{ item.name }}</div>
                  <iframe :ref="item.id" :id="item.id" height="500px" width="100%" allowTransparency="true" frameBorder="0" scrolling="no" :src="item.url"></iframe>
                </el-form-item>
              </template>
            </el-form>
          </div>
          <HardRight class="fixedstatus" ref="HardRight" :getprice="getprice" :priceFormData.sync="priceFormData" @cartfn="cartfn"></HardRight>
        </div>
      </el-col>
    </el-row>
    <!-- <el-button @click="sub">提交</el-button> -->
    <login-form :dialogVisible.sync="loginstatus"></login-form>
  </div>
</template>

<script>
import { getVoList } from '@/api/product/attrApi';
import { strEquals, startWith } from '@/utils/strUtil';
import HardRight from '@/components/price/HardRight';
import { getAreaName } from '@/utils/city';
import { priceInvoke, getShippingFee, computeSize } from '@/api/price/priceApi';
import { add, updateIsFromCheck } from '@/api/cart/cartApi';
import LoginForm from '@/components/common/LoginForm';
import { checkToken } from '@/api/users/userApi';
import { getBySubBindId } from '@/api/product/attrApi';
import { getSubNav } from '@/utils/cateNavsUtil';
import entirety from './mixins/entirety';
export default {
  mixins: [entirety],
  components: { HardRight, LoginForm },

  data() {
    return {
      formData: {},
      radiodata: {},
      inputdata: {},
      checkdata: {},
      selectdata: {},
      parentdata: [],
      cascaderdata: {},
      titleobj: {},
      goodsId: '',
      group: '',
      loginstatus: false,
      common: [
        {
          groupType: 'input',
          code: 'SIZE',
          name: '成品外尺寸',
          actualValue: '成品尺寸',
          id: 100,
          attrList: [
            { id: 101, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 100, val: 'long' },
            { id: 102, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 100, val: 'wide' },
            { id: 103, code: 'goodAd', suffix: 'mm', name: '高', inputTips: '高', groupId: 100, val: 'hign' }
          ]
        },
        {
          groupType: 'input',
          name: '订单数量',
          code: 'YSSL',
          id: 5000,
          attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '套', name: '套', inputTips: '套', groupId: 5000, val: 'num' }]
        },
        {
          groupType: 'input',
          name: '同款数量',
          code: 'YSSL',
          id: 6000,
          attrList: [{ id: 6001, code: 'TKSL', defaultValue: '0', suffix: '套', name: '套', inputTips: '套', groupId: 6000, val: 'same' }]
        }
      ],
      spot: {},
      demo5: '',
      demo6: '',
      maxobj: {},
      data: [],
      data2: [],
      data3: [],
      printing: {},
      parentchangedata: [],
      subCateId: this.$route.query.subCateId,
      wxattr: '',
      wxnum: 0,
      wxprice: 0,
      jzattr: '',
      dew: '',
      dewinp: 0,
      priceFormData: {
        num: 0,
        long: '',
        wide: '',
        hign: '',
        same: 1,
        extends: '1',
        priceProgress: false,
        provinceId: '',
        cityId: '',
        yssl: 0,
        tkks: 1,
        boxmoney: '0',
        common_time: 0,
        days: 0,
        days_fast: 0,
        days_normal: 5,
        days_slow: 7,
        editfee: 0,
        msg: '',
        out_time: '',
        percentV: 1,
        price_fast: '0',
        price_member: '0',
        price_normal: '0',
        price_old: 0,
        price_slow: '0',
        pro: '0',
        savemoney: '0.00',
        shipping_fee: 0,
        time_fast: 0,
        time_normal: 120,
        time_slow: 168,
        total_price: 0,
        weight: 0
      },
      initprice: {
        num: 0,
        long: '',
        wide: '',
        hign: '',
        same: 1,
        extends: '1',
        priceProgress: false,
        provinceId: '',
        cityId: '',
        yssl: 0,
        tkks: 1,
        boxmoney: '0',
        common_time: 0,
        days: 0,
        days_fast: 0,
        days_normal: 5,
        days_slow: 7,
        editfee: 0,
        msg: '',
        out_time: '',
        percentV: 1,
        price_fast: '0',
        price_member: '0',
        price_normal: '0',
        price_old: '0',
        price_slow: '0',
        pro: '0',
        savemoney: '0.00',
        shipping_fee: 0,
        time_fast: 0,
        time_normal: 120,
        time_slow: 168,
        total_price: 0,
        weight: 0
      },
      classidstr: '129,33,130',
      classid: ''
    };
  },
  created() {
    this.getdata();
    this.getByGoodsIdfn();
    checkToken().then(res => {
      if (res.code != '000000') {
        this.loginstatus = true;
      }
    });
  },
  mounted() {
    const scrollDiv = document.querySelector('body');
    this.fixednum = document.querySelector('.fixedstatus').clientHeight;
    const divclass = document.querySelector('.fixedstatus');
    const guigeRtWrap = document.querySelector('.guigeRtWrap').clientHeight;
    scrollDiv.onscroll = function() {
      const divheight = document.querySelector('.guigeLt').clientHeight;
      if (document.documentElement.scrollTop > 350) {
        if (document.documentElement.scrollTop > divheight + 350 - guigeRtWrap) {
          divclass.style.marginTop = divheight - guigeRtWrap + 'px';
        } else {
          divclass.style.marginTop = document.documentElement.scrollTop - 350 + 'px';
        }
      } else {
        divclass.style.marginTop = 0;
      }
    };
  },
  watch: {
    $route(to) {
      this.initial();

      // this.$router.go(0)
    }
  },
  methods: {
    ...{ strEquals },
    getdata() {
      getVoList({
        bindType: 'cate',
        bindId: this.$route.query.subCateId,
        // bindId: '128',
        whereBindId: '',
        whereGoodsId: ''
      }).then(res => {
        this.data = res.data;
        // this.setdata()
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].miniZtAttrGroup.actualValue == 'linkage') {
            for (let j = 0; j < this.data[i].attrList.length; j++) {
              if (this.data[i].attrList[j].actualValue) {
                let larr = this.data[i].attrList[j].actualValue.split('_');
                this.data[i].attrList[j].children = [];
                for (let obj in larr) {
                  this.data[i].attrList[j].children.push({ name: larr[obj] });
                }
              }
            }
          }
          if (this.data[i].miniZtAttrGroup.name == '表面处理') {
            // console.log('radio',this.data[i].miniZtAttrGroup.pid);
            this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].miniZtAttrGroup.id + '_' + this.data[i].attrList[0].id);
            // this.radiodata['8378']='8378_34333'
          }
          if (this.data[i].miniZtAttrGroup.actualValue == 'title') {
            this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].miniZtAttrGroup.id + '_' + this.data[i].attrList[0].id);
          }
          // if(this.data[i].miniZtAttrGroup.name=='尺寸'){
          //   this.data[i].attrList.forEach(e => {
          //     this.$set(this.maxobj,e.groupId+'_'+e.id,999)
          //   });
          // }
          // if (this.classidstr.indexOf(this.$route.query.subCateId) > -1) {
          //   if (this.data[i].miniZtAttrGroup.code == 'BJ_parent') {
          //     this.data[i].attrList[0].name = this.classid;
          //   }
          //   if (this.data[i].miniZtAttrGroup.name == '皮壳') {
          //     this.data[i].miniZtAttrGroup.name = this.classid;
          //   }
          //   if (this.data[i].miniZtAttrGroup.name == '部件' && this.data[i].attrList[0].actualValue == '部件:皮壳') {
          //     this.data[i].attrList[0].actualValue = '部件:'+this.classid;
          //   }
          // }
        }
        this.data2 = res.data.filter(e => {
          return e.miniZtAttrGroup.actualValue == 'layer';
        });
        let layeridstr = this.data2.map(v => {
          return v.miniZtAttrGroup.id;
        });
        // console.log(layeridstr.indexOf(8371));

        // console.log('data2',this.data2)
        for (let i = 0; i < this.data.length; i++) {
          // console.log(111,this.data2[i].miniZtAttrGroup.id);
          if (layeridstr.indexOf(this.data[i].miniZtAttrGroup.pid) > -1) {
            // console.log('if',this.data[i]);
            // console.log('of',layeridstr.indexOf(this.data[i].miniZtAttrGroup.pid));
            this.data2[layeridstr.indexOf(this.data[i].miniZtAttrGroup.pid)].attrList.push(this.data[i]);
            // this.data2[layeridstr.indexOf(this.data[i].miniZtAttrGroup.pid)].attrList.push(...this.data[i])
          }
        }

        this.getparent();
        this.getCheckboxDefault();
        this.data3 = JSON.parse(JSON.stringify(this.data2));
        let shoushop = res.data[1].miniZtAttrGroup.defaultSelect;
        // console.log('shoushop', shoushop);
        for (let a = this.data2.length - 1; a >= 0; a--) {
          if (!this.data2[a].miniZtAttrGroup.reminder || shoushop.indexOf(this.data2[a].miniZtAttrGroup.reminder) == -1) {
            if (a == 0) continue;
            this.data2.splice(a, 1);
          }
        }
        this.titleobj = getSubNav(this.$store.getters.priceCateNavs, this.$route.query.cateId, this.$route.query.subCateId, this.$route.path.indexOf('/price'));
        console.log('data2', this.data2);
        // console.log('data', this.data);
        // console.log('data3', this.data3);
        // console.log('maxobj', this.maxobj);

        // for(let i=0;i<res.data.length;i++){
        //   if(res.data[i].miniZtAttrGroup.actualValue=='layer'){
        //     let idnum=res.data[i].miniZtAttrGroup.id
        //     let idlist=this.data.filter(e=>{
        //       return e.miniZtAttrGroup.pid==idnum
        //     })
        //     this.data[i].attrList.push(...idlist)
        //   }
        // }
        // console.log(this.data);
      });
    },
    initial() {
      // this.$set(this, 'formVoList', []);
      // this.$set(this, 'voList', []);
      this.$set(this, 'radiodata', {});
      this.$set(this, 'inputdata', {});
      this.$set(this, 'checkdata', {});
      this.$set(this, 'selectdata', {});
      this.$set(this, 'cascaderdata', {});
      this.$set(this, 'printing', {});
      this.$set(this, 'spot', {});
      this.$set(this, 'parentdata', []);
      this.$set(this, 'data', []);
      this.$set(this, 'data2', []);
      this.$set(this, 'data3', []);
      this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(this.initprice)));
      this.getdata();
      this.getByGoodsIdfn();
      // if (this.$route.query.subCateId == '101') {
      //   this.priceFormData.time_normal = 168;
      //   this.priceFormData.days_normal = 7;
      // }
    },
    // setdata(){
    //   if(this.$route.query.subCateId==129){
    //     for(let i=0;i<this.data.length;i++){
    //       if(this.data[i].miniZtAttrGroup.name=='皮壳'){
    //         console.log('set',this.data[i]);
    //       }
    //     }
    //   }
    // },
    getByGoodsIdfn() {
      getBySubBindId({ id: this.$route.query.subCateId }).then(res => {
        if (res.code == '000000') {
          this.goodsId = res.data.id;
        }
      });
    },
    demofn(fi, i, child, pid) {
      // const splits = this.radiodata[pid].split('_');
      // const groupId = splits[0];
      // const attrId = splits[1];
    },
    addlay(data) {
      // console.log('length', data);
      let savedata = this.paretnlength(data.miniZtAttrGroup.name);
      let savename = savedata.map(e => {
        return e.miniZtAttrGroup.name;
      });
      let savecode = savedata.map(e => {
        return e.miniZtAttrGroup.code;
      });
      // console.log('savename', savecode);
      for (let i = 0; i < this.data3.length; i++) {
        if (savename.indexOf(this.data3[i].miniZtAttrGroup.name) > -1) {
          // console.log('this.data3[i]', this.data3[i]);
          if (savecode.indexOf(this.data3[i].miniZtAttrGroup.code) == -1) {
            // console.log('ifif', this.data3[i]);
            // console.log('11this.data3[i]', this.data3[i]);
            this.data2.push(this.data3[i]);
            this.data2.sort(this.sortlayer);
            setTimeout(() => {
              this.getprice();
            }, 500);
            return;
          } else {
            console.log('else12321');
          }
        }
      }
      // if(this.paretnlength(data.miniZtAttrGroup.name)>=3){
      //   this.$message({
      //     message: '添加数量不能大于3',
      //     type: 'error'
      //   });
      //   return
      // }

      // this.data2.sort(this.sortlayer);
    },
    // addchild(item, i) {
    //   let hidedata = this.data.filter(e => {
    //     return e.miniZtAttrGroup.pid == item.miniZtAttrGroup.id;
    //   });
    //   let newhdata = JSON.parse(JSON.stringify(hidedata));
    //   let newitem = JSON.parse(JSON.stringify(item));
    //   for (let i = 0; i < newhdata.length; i++) {
    //     newhdata[i].miniZtAttrGroup.pid = item.miniZtAttrGroup.id + 9000;
    //   }
    //   newitem.miniZtAttrGroup.id = newitem.miniZtAttrGroup.id + 9000;
    //   newitem.miniZtAttrGroup.code = newitem.miniZtAttrGroup.code.replace('btn', 'del');
    //   this.$set(newitem.miniZtAttrGroup, 'child', []);
    //   this.data2[i].attrList.push(newitem);
    //   this.data2.sort(this.sortlayer);
    //   console.log('item', newitem, i);
    //   console.log('hidedata', newhdata);
    //   console.log('data', this.data);
    // },
    commonDataChange() {
      let inputValues = this.inputdata;
      let radioSelectValues = this.radiodata;
      let checkBoxSelectValues = this.checkdata;
      let selectSelectValues = this.selectdata;
      const groupValueList = [];
      // that.formVoList.sort(listSort);
      // console.log('formVoList',radioSelectValues)
      // 单选框
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          for (let var1 in radioSelectValues) {
            const splits = radioSelectValues[var1].split('_');
            const groupId = splits[0];
            const attrId = splits[1];
            const attrItem = this.getGroupAttr(attrId, groupId);
            if (strEquals(this.data2[i].attrList[j].miniZtAttrGroup.id, attrItem.groupId)) {
              if (attrItem.actualValue) {
                // craftRadioAttr(attrItem, groupValueList);
                groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + attrItem.actualValue + ';');
              }
            }
          }
        }
      }

      //下拉选择框
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          for (let var1 in selectSelectValues) {
            const splits = selectSelectValues[var1].split('_');
            const groupId = splits[0];
            const attrId = splits[1];
            const attrItem = this.getGroupAttr(attrId, groupId);
            if (strEquals(this.data2[i].attrList[j].miniZtAttrGroup.id, attrItem.groupId)) {
              if (attrItem.actualValue) {
                let sy = this.data2[i].attrList[j].miniZtAttrGroup.code.indexOf('PTTJYS') > -1 ? '' : ';';
                groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + attrItem.actualValue + sy);
              }
            }
          }
        }
      }

      // 文本输入框
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          const item = this.data2[i].attrList[j];
          if (item.miniZtAttrGroup.groupType == 'input') {
            let str = '';
            if (item.miniZtAttrGroup.actualValue) {
              str = item.miniZtAttrGroup.code.indexOf('TJCC_CHILD') > -1 ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.actualValue + ':';
            } else {
              str = item.miniZtAttrGroup.name + ':';
            }

            for (let var1 in inputValues) {
              if (inputValues[var1]) {
                const splits = var1.split('_');
                const groupId = splits[0];
                const attrId = splits[1];
                const attrItem = this.getGroupAttr(attrId, groupId);
                if (attrItem && strEquals(attrItem.groupId, item.miniZtAttrGroup.id)) {
                  str += inputValues[var1] + '_';
                }
              }
            }
            groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + str.substring(0, str.length - 1) + ';');

            if (item.miniZtAttrGroup.code.indexOf('TJ_TK_CHILD') > -1) {
              this.tjin(item, groupValueList, inputValues);
            }
            // }
          }
        }
      }

      // 复选框
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          const item = this.data2[i].attrList[j];
          for (let var1 in checkBoxSelectValues) {
            // console.log(checkBoxSelectValues[var1]);
            for (let j = 0; j < checkBoxSelectValues[var1].length; j++) {
              const splits = checkBoxSelectValues[var1][j].split('_');
              const groupId = splits[0];
              const attrId = splits[1];
              const attrItem = this.getGroupAttr(attrId, groupId);
              if (strEquals(item.miniZtAttrGroup.id, attrItem.groupId)) {
                if (attrItem.actualValue) {
                  groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + attrItem.actualValue + ';');
                }
              }
            }
          }
        }
      }

      //级联
      // for (let c in this.cascaderdata) {
      //   const splits = c.split('_');
      //   const groupId = splits[0];
      //   const attrId = splits[1];
      //   console.log('c',c)
      //   groupValueList.push(groupId+this.cascaderdata[c][0]+'_'+this.cascaderdata[c][1] + ';');
      // }
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          const item = this.data2[i].attrList[j];
          if (item.miniZtAttrGroup.actualValue == 'linkage') {
            if (this.cascaderdata[item.miniZtAttrGroup.id]) {
              groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + item.miniZtAttrGroup.reminder + this.cascaderdata[item.miniZtAttrGroup.id][0] + '_' + this.cascaderdata[item.miniZtAttrGroup.id][1].replace(/g/, '') + ';');
            }
          }
          if (this.printing[item.miniZtAttrGroup.id]) {
            groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + this.printing[item.miniZtAttrGroup.id]);
          }
          if (this.spot[item.miniZtAttrGroup.id]) {
            groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + this.spot[item.miniZtAttrGroup.id]);
          }
        }
      }
      // console.log('groupValueList', groupValueList);
      return groupValueList;
    },
    tjin(item, groupValueList, inputValues) {
      let obj = {};
      let obj2 = {};
      let arr = [];
      for (let j = 0; j < groupValueList.length; j++) {
        if (groupValueList[j].indexOf('烫金') > -1) {
          let id = groupValueList[j].split('_')[0];
          if (groupValueList[j].indexOf('面纸烫金') !== -1) {
            if (!obj[id]) {
              obj[id] = '';
            }
            obj[id] += groupValueList[j].replace(id + '_面纸烫金尺寸:', '');
          }
          if (groupValueList[j].indexOf('衬纸烫金') !== -1) {
            if (!obj2[id]) {
              obj2[id] = '';
            }
            obj2[id] += groupValueList[j].replace(id + '_衬纸烫金尺寸:', '');
          }
        }
      }
      for (let a = groupValueList.length - 1; a >= 0; a--) {
        if (groupValueList[a].indexOf('烫金') > -1) {
          groupValueList.splice(a, 1);
        }
      }
      for (let a in obj) {
        arr.push(obj[a]);
      }
      for (let a in obj2) {
        arr.push(obj2[a]);
      }
      groupValueList.push(...arr);
      // console.log('tjin', groupValueList);
      // let tj = [];
      // let tjcc = [];
      // for (let sel = 0; sel < groupValueList.length; sel++) {
      //   if (groupValueList[sel].indexOf('面纸烫金1烫金') > -1) {
      //     tj.push(groupValueList[sel]);
      //     groupValueList.splice(sel, 1);
      //   }
      //   if (groupValueList[sel].indexOf('普通烫金尺寸') > -1) {
      //     tjcc.push(groupValueList[sel]);
      //     groupValueList.splice(sel, 1);
      //   }
      // }

      // for (let i = 0; i < tj.length; i++) {
      //   if (tjcc[i]) {
      //     var index = tjcc[i].lastIndexOf(':');
      //     console.log('tjcc[i].lastIndexOf()', index);
      //     var ssr = tjcc[i].substring(index + 1, tjcc[i].length);
      //     tj[i] = tj[i] + ssr;
      //   }
      // }
      // groupValueList.push(...tj);
    },
    getGroupAttr(attrId, groupId) {
      const item = this.getGroupById(groupId);
      if (item) {
        for (let inx in item.attrList) {
          if (strEquals(item.attrList[inx].id, attrId)) {
            return item.attrList[inx];
          }
        }
      }
    },
    getGroupById(id) {
      const _voList = this.data;
      for (let i = 0; i < _voList.length; i++) {
        const formGroupItem = _voList[i];
        if (strEquals(formGroupItem.miniZtAttrGroup.id, id)) {
          return formGroupItem;
        }
      }
      return null;
    },
    setchilidchange(data, index, cindex) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].miniZtAttrGroup.groupType == 'checkbox') {
          this.$set(this.checkdata, this.data2[index].attrList[cindex].miniZtAttrGroup.id, []);
        }
      }
    },
    removelay(data, i) {
      // console.log('data', data.attrList);
      // for (let i = 0; i < data.attrList.length; i++) {
      //   if (data.attrList[i].miniZtAttrGroup.groupType == 'radio') {
      //     delete this.radiodata[data.attrList[i].miniZtAttrGroup.id];
      //   }
      // }
      // console.log('i', i);
      this.data2.splice(i, 1);
      this.getprice();
      // this.radiodata[]
    },
    radiocancel(id, index) {
      if (id) {
        this.deleteGroupItem(id, index);
        this.radiodata[id] = '';
      }
    },
    // delchild(index, i) {
    //   console.log(index, i);
    //   this.data2[index].attrList.splice(i, 1);
    // },
    sizechange(gid, name) {
      // console.log(123);
      if (name) {
        if (this.dew == name) {
          this.dew = '';
        } else {
          this.dew = name;
        }
      }
      if (gid == 100 && this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign) {
        // console.log(this.dew);
        // console.log(this.dewinp);
        computeSize({
          goodAd: this.priceFormData.hign,
          goodAh: 0,
          goodAl: this.priceFormData.long,
          goodAr: 0,
          goodAt: 0,
          goodAw: this.priceFormData.wide,
          goodAx: 0,
          goodBottom: this.dew == 2 ? this.dewinp : 0,
          goodWaist: this.dew == 1 ? this.dewinp : 0,
          id: this.goodsId,
          zipval: 0
        }).then(res => {
          // console.log(res);
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].miniZtAttrGroup.name == '尺寸') {
              // console.log(this.data[i]);
              for (let j = 0; j < this.data[i].attrList.length; j++) {
                // console.log(this.data[i].attrList[j].groupId + '_' + this.data[i].attrList[j].id, j);
                // this.inputdata[this.data[i].attrList[j].groupId+'_'+this.data[i].attrList[j].id]=res.data.otherMap['CC_ONE'][j]
                this.$set(this.inputdata, this.data[i].attrList[j].groupId + '_' + this.data[i].attrList[j].id, res.data.otherMap[this.data[i].miniZtAttrGroup.code][j]);
                this.$set(this.maxobj, this.data[i].attrList[j].groupId + '_' + this.data[i].attrList[j].id, res.data.otherMap[this.data[i].miniZtAttrGroup.code][j]);
              }
            }
          }
          this.getprice();
        });
      } else {
        this.getprice();
      }
    },
    inpchange(name, id) {
      if (name == '尺寸' && this.maxobj[id] && this.inputdata[id] > this.maxobj[id]) {
        this.$set(this.inputdata, id, this.maxobj[id]);
        this.$message({ type: 'error', message: '已经超出尺寸' });
        // console.log(this.maxobj);
        // console.log(id);
      }
      this.getprice();
    },
    childchange(e, id, i, ci, gid) {
      // console.log(e, id, i, ci, gid);
      let isid = '';
      if (e) {
        let data = this.data.filter(v => {
          return v.miniZtAttrGroup.parentAttrId == id;
        });
        this.data2[i].attrList.push(...data);
        this.data2[i].attrList.sort(this.sortlayer);
      } else {
        // console.log('cccc', this.data2[i].attrList[ci]);
        for (let a = 0; a < this.data2[i].attrList.length; a++) {
          if (this.data2[i].attrList[a].miniZtAttrGroup.pid == gid) {
            isid = this.data2[i].attrList[a].miniZtAttrGroup.id;
          }
        }
        // console.log('isid', isid);
        for (let a = this.data2[i].attrList.length - 1; a >= 0; a--) {
          if (this.data2[i].attrList[a].miniZtAttrGroup.parentAttrId == id) {
            // console.log('chilidchang', this.data2[i].attrList[a].miniZtAttrGroup.id);
            for (let b = this.data2[i].attrList.length - 1; b >= 0; b--) {
              // console.log('changchilid', this.data2[i].attrList[b]);
              if (this.data2[i].attrList[b].miniZtAttrGroup.pid == this.data2[i].attrList[a].miniZtAttrGroup.id) {
                this.data2[i].attrList.splice(b, 1);
              }
            }
            this.checkdata[this.data2[i].attrList[a].miniZtAttrGroup.id] = [];
            this.data2[i].attrList.splice(a, 1);
          }
        }
        // for (let a = this.data2[i].attrList.length - 1; a >= 0; a--) {
        //   if (this.data2[i].attrList[a].miniZtAttrGroup.parentAttrId == id) {
        //     delete this.radiodata[this.data2[i].attrList[a].miniZtAttrGroup.id];
        //     this.checkdata[this.data2[i].attrList[a].miniZtAttrGroup.id] = [];
        //     console.log('checkarr', this.checkdata[this.data2[i].attrList[a].miniZtAttrGroup.id]);
        //     this.data2[i].attrList.splice(a, 1);
        //   }
        // }
      }
      this.getprice();
    },
    radiochange(e) {
      // console.log('eee', e);
      const splits = e.event.split('_');
      const groupId = splits[0];
      const attrId = splits[1];
      const child = e.child;
      const index = e.index;
      const cindex = e.i;
      // console.log(child);
      if (child == 'child') {
        // if(attrId==34327){
        //   this.$set(this.data2[index].attrList[cindex].miniZtAttrGroup, 'child', this.resdata2);
        // }else{
        //   this.$set(this.data2[index].attrList[cindex].miniZtAttrGroup, 'child', this.resdata);
        // }
        // let hidedata = this.data.filter(e => {
        //   return e.miniZtAttrGroup.parentAttrId == attrId;
        // });
        // this.$set(this.data2[index].attrList[cindex].miniZtAttrGroup, 'child', hidedata);
        // this.setchilidchange(hidedata, index, cindex);
        // this.data2[index].findIndex(i=>{
        //   return i.miniZtAttrGroup.code.
        // })

        const list = this.getGroupSubItem(groupId);
        for (let i = 0; i < list.length; i++) {
          if (list[i].miniZtAttrGroup.name != '表面处理') {
            delete this.radiodata[list[i].miniZtAttrGroup.id];
          }
          this.checkdata[list[i].miniZtAttrGroup.id] = [];
          // this.cascaderdata[list[i].miniZtAttrGroup.id] = [];
        }

        this.deleteGroupItem(groupId, index);
        this.loadDefaultGroup(groupId, attrId, index);
        this.data2[index].attrList.sort(this.sortlayer);
        // console.log('data2', this.data2);
      }
      this.getprice();
    },
    loadDefaultGroup(pid, parentAttrId, index) {
      for (let i = 0; i < this.data.length; i++) {
        const groupItem = this.data[i];
        // console.log('parentAttrId', parentAttrId);
        // console.log('groupItem.miniZtAttrGroup.parentAttrId', groupItem.miniZtAttrGroup.parentAttrId);
        if (groupItem.miniZtAttrGroup.pid == pid && parentAttrId == groupItem.miniZtAttrGroup.parentAttrId) {
          if (groupItem.attrList != null && groupItem.attrList.length > 0) {
            // console.log('ppppp', pid, parentAttrId);
            this.data2[index].attrList.push(JSON.parse(JSON.stringify(groupItem)));
            if (groupItem.miniZtAttrGroup.groupType == 'radio') {
              let attr = this.getDefaultAttr(groupItem.attrList, groupItem.miniZtAttrGroup.defaultSelect, true);
              this.loadDefaultGroup(attr.groupId, attr.id, index);
            }
          }
        }
      }
      this.data2.sort(this.sortlayer);
    },

    deleteGroupItem(pid, index) {
      const list = this.getGroupSubItem(pid);
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < this.data2[index].attrList.length; j++) {
          if (list[i].miniZtAttrGroup.id == this.data2[index].attrList[j].miniZtAttrGroup.id) {
            this.data2[index].attrList.splice(j, 1);
            break;
          }
        }
      }
      this.data2.sort(this.sortlayer);
    },
    getGroupSubItem(pid) {
      const _voList = this.data;
      let list = [];
      let length = _voList.length - 1;
      for (let i = length; i >= 0; i--) {
        const formGroupItem = _voList[i];
        if (formGroupItem.miniZtAttrGroup.pid == pid) {
          list.push(formGroupItem);
          for (let j = length; j >= 0; j--) {
            const formGroupItem1 = _voList[j];
            if (formGroupItem1 != null && formGroupItem1.miniZtAttrGroup != null && formGroupItem1.miniZtAttrGroup.pid === formGroupItem.miniZtAttrGroup.id) {
              const subList = this.getGroupSubItem(formGroupItem.miniZtAttrGroup.id);
              list = list.concat(subList);
              break;
            }
          }
        }
      }
      return list;
    },
    getDefaultAttr(attrList, defaultSelect, isDefault) {
      let attr = null;
      if (defaultSelect) {
        for (let j = 0; j < attrList.length; j++) {
          const tempAttr = attrList[j];
          if (tempAttr.id == defaultSelect) {
            attr = tempAttr;
            return attr;
          }
        }
      }
      if (isDefault && attrList.length > 0) {
        attr = attrList[0];
      }
      return attr;
    },
    datastatus() {
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          if (this.data2[i].attrList[j].miniZtAttrGroup.required) {
            if (this.data2[i].attrList[j].miniZtAttrGroup.groupType == 'radio') {
              if (!this.radiodata[this.data2[i].attrList[j].miniZtAttrGroup.id]) {
                return;
              }
            }

            if (this.data2[i].attrList[j].miniZtAttrGroup.groupType == 'select' && this.data2[i].attrList[j].miniZtAttrGroup.actualValue != 'linkage') {
              if (!this.selectdata[this.data2[i].attrList[j].miniZtAttrGroup.id]) {
                return;
              }
            }

            if (this.data2[i].attrList[j].miniZtAttrGroup.groupType == 'select' && this.data2[i].attrList[j].miniZtAttrGroup.actualValue == 'linkage') {
              if (!this.cascaderdata[this.data2[i].attrList[j].miniZtAttrGroup.id]) {
                return;
              }
            }

            if (this.data2[i].attrList[j].miniZtAttrGroup.groupType == 'input') {
              for (let inp = 0; inp < this.data2[i].attrList[j].attrList.length; inp++) {
                if (!this.inputdata[this.data2[i].attrList[j].miniZtAttrGroup.id + '_' + this.data2[i].attrList[j].attrList[inp].id]) {
                  return;
                }
              }
            }

            if (this.data2[i].attrList[j].miniZtAttrGroup.groupType == 'checkbox') {
              if (this.checkdata[this.data2[i].attrList[j].miniZtAttrGroup.id].length == 0) {
                return;
              }
            }
          }
        }
      }
      return true;
    },
    datastatus2() {
      let arr = this.getstr(this.commonDataChange());
      console.log('arr', arr);
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf('配件') == -1) {
          if (arr[i].indexOf('面纸材质1') == -1 && arr[i].indexOf('纸板材质') == -1 && arr[i].indexOf('中纤板材质') == -1 && arr[i].indexOf('海绵厚度') == -1 && arr[i].indexOf('衬纸材质') == -1) {
            return false;
          }
        }
      }
      return true;
    },
    getCheckboxDefault(groupItem) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].miniZtAttrGroup.groupType == 'checkbox' && this.data[i].miniZtAttrGroup.code.indexOf('parent') == -1) {
          this.$set(this.checkdata, this.data[i].miniZtAttrGroup.id, []);
        }
      }
      // if (groupItem.miniZtAttrGroup.pid > 0) {
      //   const parentGroup = getGroupById(groupItem.miniZtAttrGroup.pid);
      //   if (parentGroup.attrList) {
      //     for (let i = 0; i < parentGroup.attrList.length; i++) {
      //       const groupList = getGroupByParentAttrId(parentGroup.attrList[i].id);
      //       for (let j = 0; j < groupList.length; j++) {
      //         that.$set(that.formData.checkBoxSelectValues, groupList[j].miniZtAttrGroup.id, []);
      //       }
      //     }
      //   }
      // }
      // that.$set(that.formData.checkBoxSelectValues, groupItem.miniZtAttrGroup.id, []);
      // if (groupItem.miniZtAttrGroup.defaultSelect) {
      //   let defaultIds = groupItem.miniZtAttrGroup.defaultSelect.split(',');
      //   if (defaultIds.length > 0) {
      //     let selectList = [];
      //     for (let j = 0; j < defaultIds.length; j++) {
      //       if (defaultIds[j]) {
      //         let attr = getDefaultAttr(groupItem.attrList, defaultIds[j], false);
      //         if (attr) {
      //           selectList.push(groupItem.miniZtAttrGroup.id + '_' + attr.id);
      //           loadDefaultGroup(attr.groupId, attr.id);
      //         }
      //       }
      //     }
      //     that.$set(that.formData.checkBoxSelectValues, groupItem.miniZtAttrGroup.id, selectList);
      //     that.$set(that.formData.oldCheckBoxSelectVals, groupItem.miniZtAttrGroup.id, selectList);
      //   }
      // }
    },
    paretnlength(snama) {
      let l = this.data2.filter(e => {
        return e.miniZtAttrGroup.name.indexOf(snama) > -1;
      });
      return l;
    },
    sortlayer(a, b) {
      return a.miniZtAttrGroup.sortOrder - b.miniZtAttrGroup.sortOrder;
    },
    parentchange(e, id, name) {
      // console.log(e,id,name);
      if (e) {
        let addlist = this.data3.filter(v => {
          return v.miniZtAttrGroup.reminder == id;
        });
        this.data2.push(...addlist);
        this.data2.sort(this.sortlayer);
      } else {
        for (let a = this.data2.length - 1; a >= 0; a--) {
          if (this.data2[a].miniZtAttrGroup.reminder == id || this.data2[a].miniZtAttrGroup.name == name) {
            this.data2.splice(a, 1);
          }
        }
      }
      this.getprice();
    },
    getparent() {
      let pdata = this.data.filter(e => {
        return e.miniZtAttrGroup.code.indexOf('parent') > -1;
      });
      let defaultIds = pdata[0].miniZtAttrGroup.defaultSelect.split(',');
      this.parentdata = defaultIds;
      // console.log('pdata', this.parentdata);
    },
    cartfn() {
      if (this.datastatus() && this.datastatus2() && this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign && this.priceFormData.num && this.priceFormData.total_price > 0 && this.group) {
        const param = {
          miniCart: {
            num: this.priceFormData.num,
            ischeck: 1,
            isfrom: 2,
            totalTime: '360',
            goodsId: this.goodsId,
            goodsAttr: this.jzattr,
            goodsTotal: this.priceFormData.total_price
            // extendsStr: that.priceFormData.extends
          },
          number: this.priceFormData.same
        };
        const param2 = {
          miniCart: {
            num: this.wxnum,
            ischeck: 1,
            isfrom: 2,
            totalTime: '120',
            goodsId: 1546,
            goodsAttr: this.wxattr,
            goodsTotal: this.wxprice
            // extendsStr: that.priceFormData.extends
          },
          number: 1
        };
        updateIsFromCheck({ data: 2 }).then(r => {
          if (r.code == '000000') {
            add(param)
              .then(res => {
                if (res.code == '000000') {
                  add(param2).then(v => {
                    if (v.code == '000000') {
                      let routeData = this.$router.resolve({ path: '/cart/checkorder', query: { isCart: 2 } });
                      window.open(routeData.href, '_blank');
                      // this.$router.push({ path: '/cart/checkorder?isCart=2' });
                    }
                  });
                }
              })
              .catch(() => {
                console.log(1);
              });
          }
        });
      } else {
        this.$message({
          message: '请完善计价参数',
          type: 'error'
        });
      }
    },
    getstr(list) {
      let obj = {};
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        let index = list[i].indexOf('_');
        if (!obj[list[i].substring(0, index)]) {
          obj[list[i].substring(0, index)] = '';
        }

        obj[list[i].substring(0, index)] += list[i].slice(index + 1);

        // list[i].replace(id, '')
      }

      for (let a in obj) {
        // console.log('a',a);
        arr.push(obj[a].replace(new RegExp(a + '_', 'gm'), ''));
      }
      return arr;
    },
    getprice() {
      console.log('datastatus', this.datastatus());
      // this.datastatus2()
      console.log('datastatus2', this.datastatus2());
      if (this.datastatus() && this.datastatus2() && this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign && this.priceFormData.num && this.group) {
        let data = this.getstr(this.commonDataChange())
          .toString()
          .replace(/,/g, '|#|');
        let city = '';
        let dew = this.dew == 1 ? '露腰高度:' : '露底高度:';
        let dewinp = dew + this.dewinp + ';';
        // console.log('dewinp', dewinp);
        // if(this.dew&&this.dewinp){
        //   dew=this.dew==1?'露腰高度:'+this.dewinp+';'
        // }
        // let zkcc = '展开尺寸:' + this.priceFormData.long + '_' + this.priceFormData.wide + '_' + this.priceFormData.hign + ';' + (this.priceFormData.pro == '1' ? '打样:需要;' : '') + (this.dewinp ? dewinp : '');
        let zkcc = '展开尺寸:' + this.priceFormData.long + '_' + this.priceFormData.wide + '_' + this.priceFormData.hign + ';打样:需要;' + this.group + (this.dew && this.dewinp ? dewinp : '');
        this.jzattr = zkcc + '|#|' + data;
        if (this.priceFormData.provinceId !== '') {
          city += getAreaName('province', this.priceFormData.provinceId);
        }
        if (this.priceFormData.cityId !== '') {
          if (city !== '') {
            city += ' ';
          }
          city += getAreaName('city', this.priceFormData.cityId);
        }
        priceInvoke({
          city: '',
          fnumber: this.priceFormData.same,
          goodsAttr: this.jzattr,
          // goodsAttrs: data,
          goodsId: this.goodsId,
          number: this.priceFormData.num
        })
          .then(res => {
            if (res.code == '970006') {
              this.loginstatus = true;
              return;
            }
            if (res.code == '999999') {
              console.log('9999999999999999999999999999');
            }
            if (res.code != '000000') {
              this.priceFormData.total_price = 0;
              return;
            }
            // if (res.code == '000000') {
            let cc = '成品内尺寸:' + res.data.priceInfo.boxLength + '_' + res.data.priceInfo.boxWide + '_' + res.data.priceInfo.boxHeight + ';展开尺寸:' + res.data.priceInfo.goodAl + '_' + res.data.priceInfo.goodAw + ';';
            this.wxattr = '品类:外箱;' + cc + '纸张类型:三坑;纸张材质:BCB坑_160g牛卡_90g普芯_50g普芯_90g普芯_50g普芯_90g普芯_120g牛卡_K31313A;粘合:胶粘;印刷颜色:无;0;';
            this.wxnum = res.data.priceInfo.boxNumber < 50 ? 50 : res.data.priceInfo.boxNumber;
            priceInvoke({
              cextends: '0',
              city: '',
              fnumber: 1,
              goodsAttr: this.wxattr,
              goodsId: 1546,
              number: this.wxnum
            })
              .then(prc => {
                if (res.code != '000000') {
                  this.priceFormData.total_price = 0;
                  this.priceFormData.price_old = 0;
                  return;
                }
                this.wxprice = prc.data.total_price;
                if (this.priceFormData.cityId) {
                  getShippingFee({
                    fnumber: 1,
                    weight: res.data.weight + prc.data.weight,
                    city: city,
                    goodsAttr: '品类:外箱'
                  }).then(shi => {
                    if (shi.code == '000000') {
                      this.priceFormData.total_price = res.data.total_price + prc.data.total_price;
                      this.priceFormData.weight = res.data.weight + prc.data.weight;
                      this.priceFormData.shipping_fee = shi.data;
                      this.priceFormData.price_old = res.data.price_old + prc.data.price_old;
                    } else {
                      this.priceFormData.total_price = 0;
                      this.priceFormData.price_old = 0;
                    }
                  });
                } else {
                  this.priceFormData.total_price = res.data.total_price + prc.data.total_price;
                  this.priceFormData.weight = res.data.weight + prc.data.weight;
                  this.priceFormData.price_old = res.data.price_old + prc.data.price_old;
                  this.priceFormData.shipping_fee = prc.data.shipping_fee;
                }
              })
              .catch(err2 => {
                console.log('errerrerrerr2222', err2);
              });
            // this.priceFormData = Object.assign({}, this.priceFormData, res.data);
            // } else {
            //   console.log('zhixing');
            //   this.priceFormData.total_price=0
            //   this.$message({
            //     message: res.message,
            //     type: 'error'
            //   });
            // }
          })
          .catch(err => {
            this.priceFormData.total_price = 0;
            this.priceFormData.price_old = 0;
            // console.log('errerrerrerr111', err);
          });
        console.log('data1', data);
      } else {
        this.priceFormData.total_price = 0;
        this.priceFormData.price_old = 0;
      }
    },
    sub() {
      console.log('单选', this.radiodata);
      console.log('下拉', this.selectdata);
      console.log('多选', this.checkdata);
      console.log('inp', this.inputdata);
      console.log('级联', this.cascaderdata);
      this.commonDataChange();
    }
  }
  // computed: {
  //   parentlength() {
  //     return function (nama) {
  //       let l = this.data2.filter(e => {
  //         return e.miniZtAttrGroup.name == nama;
  //       });
  //       return l.length;
  //     };
  //   }
  // }
};
</script>
<style src="@/static/mulindex/css/attr.css"></style>
<style scoped>
.laybox {
  background: #eee;
  display: flex;
  flex-wrap: wrap;
}
.childbox {
  display: flex;
  padding: 5px 0;
  flex-wrap: wrap;
}
.EattrLab {
  background: #eee;
  width: 100px;
  text-align: right;
  margin-right: 8px;
}
.cEattrLab {
  background: #fff;
  width: 100px;
  text-align: right;
  margin-right: 8px;
}
.eattrtitle {
  background: #eee;
  font-size: 18px;
  font-weight: bold;
}
.flexwrap {
  flex-wrap: wrap;
}
.cbox {
  background: #fff;
  margin-left: 110px;
  border-radius: 10px;
}
.bgcolor {
  background: #eee;
  width: 82px;
  height: 40px;
  overflow: hidden;
  line-height: 37px;
}
.bgcolor2 {
  background: #fff;
}
.childactive2 {
  margin-left: 110px;
  margin-right: 10px;
}
.childactive {
  margin-left: 110px;
  margin-right: 10px;
  background: #fff;
}
.childactive3 {
  margin-left: 50px;
  margin-right: 10px;
  background: #eee;
}
.laycon {
  display: flex;
  width: 100%;
  padding: 5px 0;
}
.laychild {
  display: flex;
  width: 100%;
}
.fixedclass {
  position: fixed;
  top: 100px;
}
.titlebtn {
  float: right;
  margin-right: 5px;
}
.yszs {
  margin: 0 10px;
}
.EattrMain .Eattrrow {
  margin-bottom: 0;
}
</style>

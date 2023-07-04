<!-- fengjianbo -->
<template>
  <div>
    <div class="cardWaper ztBox">
      <div class="comBox guigeBox">
        <!--left-->
        <div class="guigeLt">
          <div class="cardtabB">
            <h1 class="flex guigeH1">
              <span class="geH1Lt">请填写以下信息：</span>
              <span class="lookBnt">
                <el-link :underline="false" @click="jupview">下单须知<i class="el-icon-view el-icon--right"></i></el-link
              ></span>
            </h1>
            <div class="guigeImg">
              <img src="@/static/images/edition_info.png" />
              <div class="biGeImg"><img src="@/static/images/edition_info.png" /></div>
            </div>
            <ul class="guigeTop">
              <li>
                <div class="flex">
                  <label class="guigeLabel">
                    <span class="red sRed">*</span>
                    开纸尺寸:
                  </label>
                  <form name="boxForm" id="boxForm" method="post">
                    <div class="guigeTopDv">
                      <input type="text" name="finish_long" placeholder="长" v-model="finish_long" @blur="IsNumber('finish_long', finish_long)" />
                      <span class="guige-sign">×</span>
                      <input type="text" name="finish_wide" placeholder="宽" v-model="finish_wide" @blur="IsNumber('finish_wide', finish_wide)" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </form>
                  <div class="goodssize curr" data-val=""></div>
                  <div class="opensize curr" data-val=""></div>
                </div>
              </li>
              <li class="flex">
                <label class="guigeLabel">
                  <span class="red sRed">*</span>
                  印张数量:
                </label>
                <div class="guigeTopDv">
                  <input
                    type="text"
                    name="number"
                    v-model="number"
                    @blur="
                      IsNumber('number', number);
                      getLoseOne(number, 1, losenum);
                    "
                    placeholder="请输入数量"
                  />
                  <span class="guige-sign">张</span>
                </div>
                <span class="plspn f12 C9">1张起印</span>
              </li>

              <li class="flex">
                <label class="guigeLabel">
                  <span class="red sRed">*</span>
                  同版版数:
                  <el-tooltip class="guigeTis" placement="bottom" effect="light">
                    <div style="width:240px;line-height:16px;color:#666666" slot="content">指开纸尺寸一致、拼版模数一致、每模结构一致、印数一致、仅设计稿内容不同的相同大版</div>
                    <el-button style="padding:0">?</el-button>
                  </el-tooltip>
                </label>
                <div class="guigeTopDv">
                  <input type="text" name="fnumber" v-model="fnumber" value="1" @blur="IsNumber('fnumber', fnumber)" />
                  <span class="guige-sign">版</span>
                </div>
              </li>

              <li class="flex">
                <label class="guigeLabel">
                  <span class="red sRed">*</span>
                  放损:
                </label>
                <div class="guigeTopDv">
                  <input
                    type="text"
                    name="losenum"
                    v-model="losenum"
                    @blur="
                      IsNumber('losenum', losenum, 250);
                      getLoseOne(number, 1, losenum);
                    "
                    placeholder="印刷放损"
                  />
                  <span class="guige-sign">张</span>
                </div>
                <span class="plspn f12 C9 sosotx"><font class="red">温馨提示：</font>减少放损数量无法确保实际交货数量</span>
              </li>
              <li class="flex">
                <label class="guigeLabel">
                  <span class="red sRed">*</span>
                  刀线长度:
                </label>
                <div class="guigeTopDv">
                  <input type="text" name="cutline" v-model="cutline" @blur="IsNumber('cutline', cutline)" placeholder="请输入整版刀线长度" />
                  <span class="guige-sign">mm</span>
                </div>
              </li>
              <li class="flex">
                <label class="guigeLabel">
                  <span class="red sRed">*</span>
                  模数:
                </label>
                <div class="guigeTopDv">
                  <input type="text" name="moldnum" v-model="moldnum" @blur="IsNumber('moldnum', moldnum)" placeholder="请输入整版模数" />
                  <span class="guige-sign">模</span>
                </div>
              </li>

              <!--纸张类别-->
              <li class="flex">
                <label class="guigeLabel"><span class="red sRed">*</span> 纸张材质: </label>
                <dl class="gAttrList atrNon">
                  <dd class="groupDv materialCate">
                    <a
                      v-for="(vo, index) in material"
                      :key="index"
                      :class="index == materialEd ? 'attrTag curr' : 'attrTag'"
                      @click="
                        materialClick();
                        materialEd = index;
                        priceValuation();
                      "
                      >{{ index }}</a
                    >
                  </dd>
                </dl>
              </li>

              <li class="flex">
                <label class="guigeLabel"><span class="red sRed"></span> &nbsp; </label>
                <dl class="gAttrList atrNon" id="paperMaterial">
                  <dd class="groupDv">
                    <a
                      v-for="(vo, index) in material[materialEd]['materialSub']"
                      :key="index"
                      :class="index == materialSubId ? 'attrTag curr' : 'attrTag'"
                      @click="
                        materialSubId = index;
                        priceValuation();
                      "
                      >{{ vo.label }}</a
                    >
                  </dd>
                </dl>
              </li>
            </ul>
            <!--属性-->
            <div class="guigeFoot">
              <ul class="attrMain needhide" style="padding-top: 8px">
                <li class="flex" v-if="materialEd == '金银卡纸'">
                  <label class="guigeLabel"><span class="red sRed">*</span> 跟实物样: </label>
                  <dl class="gAttrList atrNon">
                    <dd class="groupDv">
                      <a
                        v-for="(vo, index) in material[materialEd]['physical']"
                        :key="index"
                        :class="index == physicalId ? 'attrTag curr' : 'attrTag'"
                        @click="
                          physicalId = index;
                          priceValuation();
                        "
                        >{{ vo.val }}</a
                      >
                    </dd>
                  </dl>
                </li>
                <li v-if="physicalId == 1">
                  <label class="guigeLabel"> </label>
                  <dl class="gAttrList atrNon">
                    <dd class="groupDv">
                      <p style="color: #666666; line-height: 20px">
                        请下载跟样表格，填写对应信息并打印，将跟样表格与样品快递至傲彩佛山办公室；避免耽误生产货期，建议您选择顺丰寄付，傲彩跟样工程师一律拒收到付件，请知悉！
                        <a href="/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName=qcxyztTest/exlfile/拼一版样品信息表.xlsx" style="color: red"><u>点击下载</u></a>
                        <img style="width: 32px; vertical-align: middle" src="@/static/assets/img/gestureleft.jpg" alt="" />
                      </p>
                      <p style="color: #999999">地址：佛山市南海区里水镇里官路59号朝辉产业园 <span style="margin-left: 20px">联系人：张先生 13632713295</span></p>
                    </dd>
                  </dl>
                </li>

                <li>
                  <label class="guigeLabel"><span class="red sRed">*</span> 印刷表处理: </label>
                  <dl class="gAttrList atrNon surfacediv">
                    <dd class="kgTab cardAbox">
                      <p v-for="(vo, index) in material[materialEd]['materialSurface']" :key="index">
                        <a
                          :class="index == materialSurfaceId ? 'attrTag curr' : 'attrTag'"
                          @click="
                            materialSurfaceId = index;
                            priceValuation();
                          "
                          ><span class="materialKey">{{ material[materialEd]['materialSub'][materialSubId]['label'] }}</span
                          >{{ vo.label }}</a
                        >
                      </p>
                    </dd>
                  </dl>
                </li>
                <li>
                  <label class="guigeLabel"></label>
                  <div class="sohxt f12 C9"><span class="red">温馨提示:</span>【如果有后道工艺，请联系客服报价】</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--left end-->
        <!--right-->
        <div class="guigeRt">
          <div class="guigeRtWrap">
            <h2 class="guigeRtH2">价格&货期</h2>
            <div class="geRtList">
              <ul class="guigeRtUl">
                <ol class="flex">
                  <span>出货时间</span>
                  <span>价格</span>
                </ol>
                <li>
                  <div class="flex geRtime curr">
                    <label class="layui-form-item geRtimeLt dateSel">
                      <em class="dateH" value="0"></em>
                      <span class="dayNormal">{{ editionPrice.time }}小时（{{ editionPrice.dayTime }}天）</span>
                    </label>
                    <div class="extra en">
                      <p class="moneyNormal">￥{{ editionPrice.price }}</p>
                      <p class="f12 C7 unitNormal">单价:{{ editionPrice.unitPrice }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 配送费用 -->
            <div class="geRtList sohtbox">
              <div class="geRtotalBox">
                <p class="flex geRtotal" style="font-weight: normal; padding-bottom: 20px">
                  <span class="ztspb">总计:</span
                  ><span id="price_total"
                    ><font>￥{{ editionPrice.price }}</font></span
                  >
                </p>
                <!-- <p class="flex geRtotal" style="color:#e60021;"><span class="ztspb">预付款:</span><span id="premoney"><font>￥0.00</font></span> </p> -->
              </div>
              <div class="flex geRtBtnDv">
                <a href="javascript:;" class="joinShoping buybtn btnCart curr" @click="immediatelyOrder">立即下单</a>
              </div>
            </div>
          </div>
        </div>
        <!--right end-->
      </div>
      <div class="comBox ztabox">
        <h4>费用明细表</h4>
        <table class="ztabox_tb" style="width: 60%">
          <tr>
            <th width="20%">加工</th>
            <th width="20%">加工类别</th>
            <th width="20%">单价</th>
            <th width="20%">最低消费</th>
          </tr>
          <tr>
            <td class="tb1" rowspan="2">印刷</td>
            <td>四开普通机</td>
            <td>30元/千张</td>
            <td>240元</td>
          </tr>
          <tr>
            <td>对开普通机</td>
            <td>50元/千张</td>
            <td>350元</td>
          </tr>
          <tr>
            <td class="tb1" rowspan="2">表处理</td>
            <td>哑胶</td>
            <td>0.43元/㎡</td>
            <td>80元</td>
          </tr>
          <tr>
            <td>光胶</td>
            <td>0.35元/㎡</td>
            <td>80元</td>
          </tr>
          <tr>
            <td class="tb1">啤</td>
            <td>加工费</td>
            <td>0.06元/张</td>
            <td>150元</td>
          </tr>
          <!-- <tr>
              <td>刀线</td>
              <td>10元/米</td>
              <td></td>
          </tr> -->
          <tr>
            <td class="tb1">粘</td>
            <td>机器粘</td>
            <td>0.01元/个</td>
            <td>30元</td>
          </tr>
        </table>

        <table class="ztabox_tb" style="width: 39.5%; margin-left: 0.5%">
          <tr>
            <th width="20%">加工类别</th>
            <th width="20%">单价</th>
            <th width="20%">最低消费</th>
          </tr>
          <tr>
            <td>四开UV机</td>
            <td>180元/千张</td>
            <td>800元</td>
          </tr>
          <tr>
            <td>对开UV机</td>
            <td>250元/千张</td>
            <td>1000元</td>
          </tr>
          <tr>
            <td>光油</td>
            <td>0.16元/㎡</td>
            <td>100元</td>
          </tr>
          <tr>
            <td>哑油</td>
            <td>0.6元/㎡</td>
            <td>200元</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
      <div class="comBox">
        <div class="zTxtsBox">
          <a name="ztop"></a>
          <h3>下单须知:</h3>
          <div>
            <p>1、印刷生产文件须用户处理制作，本公司不做二次检查与处理，不对刀模尺寸和成型进行验证，因文件和拼版问题导致的质量问题恕不负责；</p>
            <p>2、请尽量避免同一位置工艺叠加，因工艺叠加产生的问题本公司不予受理；</p>
            <p>3、设计文件如有三色或四色混合(浅灰、灰、深灰、黑)、暗红色、浅红色、墨绿色、蓝紫色、深紫色、深褐色、咖啡色等难印颜色，建议专色印刷，否则出现色差问题不予受理；</p>
            <p>4、文件中如有专色、烫金、击凸、贴窗以及特殊盒型需要手工粘盒 则费用另计；</p>
            <p>5、网站默认放损印张保证数量误差±5%，如果客户更改放损印张，数量误差将±20%；</p>
            <p>6、货期计算：每天晚上20点截单，开始计货期，20点后付款订单从次日计算货期；数量每满一万货期多加一天，工艺每多一道货期多加一天。</p>
            <p>7、如因不可预测因素，如自然灾害、政府限电等因素造成货期延误，敬请谅解。</p>
          </div>
        </div>
      </div>
    </div>
    <login-form :dialogVisible.sync="showLoginDialog"></login-form>
  </div>
</template>

<script>
import { addEdition } from '../../api/cart/cartCheckOrderApi';
import { getPrice, getLose } from '../../api/price/editionOneApi';
import LoginForm from '@/components/common/LoginForm';
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      showLoginDialog: false,
      finish_long: '',
      finish_wide: '',
      number: '',
      fnumber: 1,
      losenum: 0,
      cutline: '',
      moldnum: '',
      materialEd: '单铜纸',
      materialSubId: 0,
      materialSurfaceId: 0,
      physicalId: 0,
      material: {
        单铜纸: {
          materialSub: [
            {
              label: '单铜纸350g(0.45mm)',
              attr: '单铜纸_350'
            },
            {
              label: '单铜纸400g(0.51mm)',
              attr: '单铜纸_400'
            },
            {
              label: '单铜纸300g(0.38mm)',
              attr: '单铜纸_300'
            },
            {
              label: '单铜纸250g(0.32mm)',
              attr: '单铜纸_250'
            }
          ],
          materialSurface: [
            {
              label: '+四色印刷+哑胶',
              surface: '哑胶',
              color: '多色_CMYK',
              whiteInk: ''
            },
            {
              label: '+四色印刷+光胶',
              surface: '光胶',
              color: '多色_CMYK',
              whiteInk: ''
            },
            {
              label: '+四色印刷+光油',
              surface: '光油',
              color: '多色_CMYK',
              whiteInk: ''
            }
          ]
        },
        // 高松纸: {
        //   materialSub: [
        //     {
        //       label: '高松纸 325g(0.45mm)',
        //       attr: '单铜纸_325'
        //     },
        //     {
        //       label: '超高松纸 305g(0.45mm)',
        //       attr: '单铜纸_305'
        //     },
        //     {
        //       label: '高松黄底 230g (0.33mm)',
        //       attr: '单铜纸_230'
        //     },
        //     {
        //       label: '高松黄底 275g (0.39mm)',
        //       attr: '单铜纸_275'
        //     },
        //     {
        //       label: '高松黄底 320g (0.45mm)',
        //       attr: '单铜纸_320'
        //     },
        //     {
        //       label: '高松黄底 360g (0.52mm)',
        //       attr: '单铜纸_360'
        //     }
        //   ],
        //   materialSurface: [
        //     {
        //       label: '+四色印刷+哑胶',
        //       surface: '哑胶',
        //       color: '多色_CMYK',
        //       whiteInk: ''
        //     },
        //     {
        //       label: '+四色印刷+光胶',
        //       surface: '光胶',
        //       color: '多色_CMYK',
        //       whiteInk: ''
        //     },
        //     {
        //       label: '+四色印刷+光油',
        //       surface: '光油',
        //       color: '多色_CMYK',
        //       whiteInk: ''
        //     }
        //   ]
        // },
        金银卡纸: {
          materialSub: [
            {
              label: '银卡纸375g(0.53mm)',
              attr: '银卡纸_375'
            },
            {
              label: '金卡纸375g(0.53mm)',
              attr: '金卡纸_375'
            }
          ],
          materialSurface: [
            {
              label: '+四色印刷+白墨+逆向UV',
              surface: '逆向UV',
              color: '多色_CMYK',
              whiteInk: '加印白墨'
            },
            {
              label: '+四色印刷+白墨+UV光油',
              surface: 'UV光油',
              color: '多色_CMYK',
              whiteInk: '加印白墨'
            }
          ],
          physical: [
            {
              val: '无'
            },
            {
              val: '是'
            }
          ]
        }
      },
      editionPrice: {
        price: 0.0,
        unitPrice: 0.0,
        time: 0,
        dayTime: 0
      }
    };
  },
  methods: {
    materialClick() {
      this.materialSubId = 0;
      this.materialSurfaceId = 0;
      this.physicalId = 0;
    //   this.priceValuation();
    },
    IsNumber(thad, number, specify) {
      if (isNaN(number) || number * 1 < 1) {
        this.$message({
          type: 'error',
          message: '请输入正确的数值!'
        });
        this[thad] = 1;
        if (specify) {
          this[thad] = specify;
        }
      }
      if (this.finish_long > 1000 || this.finish_wide > 700) {
        this.$message({
          type: 'error',
          message: '印张尺寸不能超出1000*700!'
        });
        this.editionPrice.price = 0;
        this.editionPrice.time = 0;
        this.editionPrice.dayTime = 0;
        this.editionPrice.unitPrice = 0;
        return false;
      }
      this.priceValuation();
    },
    getLoseOne(number, type, lose) {
      var data = {
        type: type == '' ? 1 : type,
        number: number == '' ? 1 : number,
        lose: lose
      };
      getLose(data)
        .then(res => {
          if (res.code == '000000') {
            this.losenum = res.data;
          } else {
            this.$message({ type: 'error', message: '修改放损数量失败' });
          }
        })
        .catch(res => {
          console.log(res.message);
        });
    },
    //计价
    priceValuation() {
      if (!this.finish_long || !this.finish_wide || !this.number || !this.fnumber || !this.losenum || !this.cutline || !this.moldnum) {
        this.editionPrice.price = 0;
        this.editionPrice.unitPrice = 0;
        return false;
      }
      let strVal = this.getStrVal();
      console.log(strVal);
      var data = {
        fnumber: this.fnumber,
        goodsAttr: strVal,
        number: this.number,
        type: 101
      };
      getPrice(data)
        .then(res => {
          // console.log('整帮价格', res);

          if (res.code == '000000') {
            this.editionPrice.price = res.data.price;
            this.editionPrice.unitPrice = (this.editionPrice.price / this.number).toFixed(2);
            this.editionPrice.time = res.data.time;
            this.editionPrice.dayTime = Math.ceil(res.data.time / 24);
          } else {
            if (res.code === '970006') {
              this.showLoginDialog = true;
            } else {
              this.$message({ type: 'error', message: '请求计价失败' });
            }
          }
        })
        .catch(res => {
          console.log(res.message);
        });
    },
    //拼接参数
    getStrVal() {
      let strVal = '';
      strVal += '开纸尺寸:' + this.finish_long + '*' + this.finish_wide + 'mm;';
      strVal += '放损:' + this.losenum + ';';
      strVal += '刀线长度:' + this.cutline + 'mm;';
      strVal += '模数:' + this.moldnum + ';';
      strVal += '纸张材质:' + this.material[this.materialEd]['materialSub'][this.materialSubId]['attr'] + ';';
      if (this.materialEd != '单铜纸') {
        if (this.material['金银卡纸']['physical'][this.physicalId]['val'] === '是') {
          strVal += '跟实物样:' + this.material['金银卡纸']['physical'][this.physicalId]['val'] + ';';
        }
      }
      strVal += '表面处理:' + this.material[this.materialEd]['materialSurface'][this.materialSurfaceId]['surface'] + ';';
      strVal += '印刷颜色:' + this.material[this.materialEd]['materialSurface'][this.materialSurfaceId]['color'] + ';';
      if (this.material[this.materialEd]['materialSurface'][this.materialSurfaceId]['whiteInk']) {
        strVal += this.material[this.materialEd]['materialSurface'][this.materialSurfaceId]['whiteInk'] + ';';
      }
      return strVal;
    },
    jupview() {
      this.$el.querySelector('.zTxtsBox').scrollIntoView();
    },
    immediatelyOrder() {
      if (!this.finish_long || !this.finish_wide || !this.number || !this.fnumber || !this.losenum || !this.cutline || !this.moldnum || !this.editionPrice.price) {
        this.$message({
          type: 'error',
          message: '请先完善报价!'
        });
        return false;
      }
      var data = {
        goodsAttr: this.getStrVal(),
        number: this.number,
        moldNum: this.moldnum
      };
      addEdition(data)
        .then(res => {
          this.$router.push({ path: '/cart/checkedition?isCart=0' });
        })
        .catch(res => {});
    }
  }
};
</script>
<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/mulindex/css/index.css" />
<style scoped src="../../static/mulindex/css/attr.css" />
<style scoped src="../../static/mulindex/css/attrss.css" />

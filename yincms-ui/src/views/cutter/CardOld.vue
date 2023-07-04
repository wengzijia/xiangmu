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
                <img v-if="isCurr < 3" class="imAge" :src="isCurr == 1 ? data.photoPath1 : data.photoPath2" />
                <div v-if="isCurr == 3" style="line-height: 0vw;">
                  <div>
                    <iframe name="knife_3d" :src="src" class="knife_3d" id="knife_1" style="width: 842px;height: 578px;"></iframe>
                  </div>
                </div>
              </span>
            </div>
            <!-- 缩略图begin -->
            <div class="spec-scroll">
              <div class="items">
                <ul>
                  <li :class="[isCurr == 1 ? 'current' : '']">
                    <img :src="data.photoPath1" @click="isCurr = 1" style="background-color: #FFF;" />
                  </li>
                  <li :class="[isCurr == 2 ? 'current' : '']">
                    <img :src="data.photoPath2" @click="isCurr = 2" style="background-color: #FFF;" />
                  </li>
                  <li
                    v-if="gSubCateId == 271 || gSubCateId == 267"
                    :class="[isCurr == 3 ? 'current' : '']"
                    @click="
                      isCurr = 3;
                      knife3d();
                    "
                  >
                    <input class="itext" type="hidden" :value="data.knifeUrl" />
                    <div class="specIon"><span class="icon icon-3d"></span></div>
                    <img :src="data.photoPath1" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!--right-->
          <div class="downLyRt">
            <div class="downLyRt_t">
              <h6>{{ data.name }}</h6>
              <span>刀模编号：{{ data.goodsSn }}</span>
            </div>
            <ul class="attrMain">
              <template v-if="gSubCateId == 254 || gSubCateId == 250 || gSubCateId == 253">
                <li>
                  <div class="guigeTopDv">
                    <input type="text" name="length" class="bags_dimension" @change="validateParame" placeholder="0" v-model="finishLong" />
                    <span class="guige-sign">×</span>
                    <input type="text" name="width" class="bags_dimension" @change="validateParame" placeholder="0" v-model="finishWide" />
                    <span class="guige-sign">×</span>
                    <input type="text" name="height" class="bags_dimension" @change="validateParame" placeholder="0" v-model="finishHeight" />
                    <span class="guige-sign">mm</span>
                  </div>
                </li>
              </template>
              <template v-if="gSubCateId == 253">
                <li>
                  <label class="guigeLabel"> <span class="red sRed">*</span>盖高： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame" placeholder="0" v-model="finishH" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
              </template>
              <template v-if="gSubCateId == 254">
                <li v-if="data.goodsAttrVo.goodAt">
                  <label class="guigeLabel"> <span class="red sRed">*</span>局部高度： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame" placeholder="0" v-model="finishT" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
                <li v-if="data.goodsAttrVo.goodAx > 0">
                  <label class="guigeLabel"> <span class="red sRed">*</span>壁厚： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame" placeholder="0" v-model="finishX" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
                <li v-if="data.goodsAttrVo.goodAh > 0">
                  <label class="guigeLabel"> <span class="red sRed">*</span>盖高： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame" placeholder="0" v-model="finishH" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
                <li v-if="data.goodsAttrVo.goodAr > 0">
                  <label class="guigeLabel"> <span class="red sRed">*</span>半径： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame" placeholder="0" v-model="finishR" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
              </template>
              <template v-if="gSubCateId == 268">
                <li class="cardOldLi" s>
                  <label class="guigeLabel"> 纸张材质： </label>
                  <div class="downLyRtxt Background_color">
                    <span class="downCor Knife_skin curr" style="width: auto;height: auto">260g原纸+18g淋膜</span>
                  </div>
                </li>
                <li class="cardOldLi">
                  <label class="guigeLabel"> 规格： </label>
                  <div class="downLyRtxt Background_color">
                    <span class="downCor Knife_skin curr" style="width: auto;height: auto">{{ Specifications }}盎司纸杯</span>
                  </div>
                </li>
              </template>
              <template v-if="gSubCateId == 270">
                <li class="cardOldLi" s>
                  <label class="guigeLabel"> 尺寸: </label>
                  <div class="downLyRtxt Background_color">
                    <span class="downCor Knife_skin curr" style="width: auto;height: auto">{{ Specifications }} mm</span>
                  </div>
                </li>
                <li class="cardOldLi">
                  <label class="guigeLabel"> 规格： </label>
                  <div class="downLyRtxt Background_color">
                    <span class="downCor Knife_skin curr" style="width: auto;height: auto">{{ random }} 抽</span>
                  </div>
                </li>
              </template>
              <template v-if="gSubCateId == 279">
                <li class="cardOldLi" s>
                  <label class="guigeLabel"> 尺寸: </label>
                  <div class="downLyRtxt Background_color">
                    <span class="downCor Knife_skin curr" style="width: auto;height: auto">58*18.5*89 mm</span>
                  </div>
                </li>
                <li class="cardOldLi">
                  <label class="guigeLabel"> 规格： </label>
                  <div class="downLyRtxt Background_color">
                    <span class="downCor Knife_skin curr" style="width: auto;height: auto">55 张</span>
                  </div>
                </li>
              </template>
              <template v-if="gSubCateId == 267">
                <li class="cardOldLi">
                  <label class="guigeLabel"> 材质： </label>
                  <div class="downLyRtxt Background_color">
                    <span class="downCor Knife_skin curr" style="width: auto;height: auto">0.23MM马口铁</span>
                  </div>
                </li>
                <li class="cardOldLi">
                  <label class="guigeLabel"> 规格： </label>
                  <div class="downLyRtxt Background_color">
                    <span v-if="id == 1572" class="downCor Knife_skin curr" style="width: auto;height: auto">半斤装(直径85*163MM)</span>
                    <span v-if="id == 1571" class="downCor Knife_skin curr" style="width: auto;height: auto">1斤装(直径115*210MM)</span>
                    <span v-if="id == 1570" class="downCor Knife_skin curr" style="width: auto;height: auto">2斤装(直径135*244MM)</span>
                  </div>
                </li>
              </template>
              <template v-if="gSubCateId == 254">
                <li class="think_one">
                  <label class="guigeLabel"><span class="red sRed">*</span> 纸张材质: </label>
                  <div class="downLyRtxt">
                    <el-select v-model="Material254Value" size="small" @change="Material254Change">
                      <el-option v-for="item in Material254" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </li>
                <li class="think_one">
                  <label class="guigeLabel"><span class="red sRed">*</span> 纸张克重/厚度: </label>
                  <div class="downLyRtxt">
                    <el-select v-model="Weight254Value" size="small" @change="Weight254Change">
                      <el-option v-for="item in Weight254[Material254Value]" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </li>
              </template>
              <template v-if="gSubCateId == 250 || gSubCateId == 253">
                <li class="think_one">
                  <label class="guigeLabel"><span class="red sRed">*</span> 纸张材质: </label>
                  <div class="downLyRtxt">
                    <el-select v-model="Material250Value" size="small" @change="Material250Change">
                      <el-option v-for="item in Material250" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </li>
                <li class="think_one">
                  <label class="guigeLabel"><span class="red sRed">*</span> 纹理方向: </label>
                  <div class="downLyRtxt">
                    <el-select v-model="Direction250Value" size="small" @change="Direction250Change">
                      <el-option v-for="item in Direction" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </li>
              </template>
              <!--              软包装-->
              <template v-if="gSubCateId == 271 || gSubCateId == 267">
                <li v-if="data.goodsAttrVo.goodAl > 0">
                  <label class="guigeLabel"> <span class="red sRed">*</span>软包装高： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame('finishLong', 100)" placeholder="0" v-model="finishLong" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
                <li v-if="data.goodsAttrVo.goodAw > 0">
                  <label class="guigeLabel"> <span class="red sRed">*</span>软包装宽： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame('finishWide', 120)" placeholder="0" v-model="finishWide" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
                <li v-if="data.goodsAttrVo.goodAt > 0">
                  <label class="guigeLabel"> <span class="red sRed">*</span>半展： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame('finishT', 40)" placeholder="0" v-model="finishT" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
                <li v-if="data.goodsAttrVo.goodAh > 0">
                  <label class="guigeLabel"> <span class="red sRed">*</span>封位： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame('finishH', 20)" placeholder="0" v-model="finishH" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
                <li v-if="id == 984 || id == 985 || id == 990">
                  <label class="guigeLabel"> <span class="red sRed">*</span>热边封宽度： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="checkSoftVal(5, 100, 'banding')" placeholder="0" v-model="banding" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
                <li v-if="id != 984">
                  <label class="guigeLabel">底部热封边大小： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="checkSoftVal(5, 100, 'backcover')" placeholder="0" v-model="backcover" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
                <li>
                  <label class="guigeLabel" style="line-height: initial;"> 成袋角度： <br /><span style="font-size: 8px">(范围4-10,直角为0)</span></label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="checkSoftVal(4, 10, 'angle')" placeholder="0" v-model="angle" />
                      <span class="guige-sign">mm</span>
                      <!--                      <span>(范围4-10，直角为0)</span>-->
                      <!--                      <span class="fl">mm</span><span class="fl softTips">(范围4-10，直角为0)</span>-->
                    </div>
                  </div>
                </li>
                <li class="think_one">
                  <label class="guigeLabel"><span class="red sRed">*</span> 飞机孔选择: </label>
                  <div class="downLyRtxt">
                    <el-select v-model="AircraftHoleValue" size="small" @change="Weight254Change">
                      <el-option v-for="item in AircraftHole" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </li>
                <li class="think_one">
                  <label class="guigeLabel"><span class="red sRed">*</span> 拉链选择: </label>
                  <div class="downLyRtxt">
                    <el-select v-model="ZipperValue" size="small" @change="Weight254Change">
                      <el-option v-for="item in Zipper" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </li>
                <template v-if="ZipperValue == 'SY'">
                  <li>
                    <label class="guigeLabel"> <span class="red sRed">*</span>拉链中心距顶： </label>
                    <div class="downLyRtxt Background_color">
                      <div class="guigeTopDv">
                        <input type="text" name="height" class="bags_dimension" @change="checkSoftVal(20, 80, 'zipdistance')" placeholder="0" v-model="zipdistance" />
                        <span class="guige-sign">mm</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <label class="guigeLabel"> <span class="red sRed">*</span>拉链高度： </label>
                    <div class="downLyRtxt Background_color">
                      <div class="guigeTopDv">
                        <input type="text" name="height" class="bags_dimension" @change="checkSoftVal(10, 80, 'zipheight')" placeholder="0" v-model="zipheight" />
                        <span class="guige-sign">mm</span>
                      </div>
                    </div>
                  </li>
                </template>
                <li class="think_one">
                  <label class="guigeLabel"><span class="red sRed">*</span> 易撕口选择: </label>
                  <div class="downLyRtxt">
                    <el-select v-model="EasyTearValue" size="small" @change="Weight254Change">
                      <el-option v-for="item in EasyTear" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </li>
                <li v-if="EasyTearValue == 'SA'">
                  <label class="guigeLabel"> <span class="red sRed">*</span>易撕口距离： </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="height" class="bags_dimension" @change="validateParame" placeholder="0" v-model="easydistance" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
              </template>
            </ul>

            <div class="flex geRtBtnDv">
              <a class="joinShoping buybtn btnCart curr bags_knife_download" @click="DownloadKnifeMold"> <em class="icon icon-down"></em>下载刀模 </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getById, getSubCategoryGoods } from '@/api/goods/miniGoodsApi';
import { getSubCateId } from '@/utils/goodsUtil';
export default {
  data() {
    return {
      data: {
        goodsAttrVo: {}
      },
      isCurr: 1,
      gSubCateId: 0,
      id: 0,
      link: 'https://admin.aocai.cn',
      finishLong: '',
      finishWide: '',
      finishHeight: '',
      finishT: '',
      finishX: '',
      finishH: '',
      finishR: '',
      Specifications: '', //规格
      random: 0, //抽纸数
      Material254: [
        {
          value: '单铜纸',
          label: '单铜纸'
        },
        {
          value: '金银卡纸',
          label: '金银卡纸'
        },
        {
          value: '牛卡',
          label: '牛卡'
        }
      ],
      Weight254: {
        单铜纸: [
          {
            value: '0.35',
            label: '250g(0.35mm)'
          },
          {
            value: '0.41',
            label: '300g(0.41mm)'
          },
          {
            value: '0.48',
            label: '350g(0.48mm)'
          },
          {
            value: '0.55',
            label: '400g(0.55mm)'
          }
        ],
        金银卡纸: [
          {
            value: '0.32',
            label: '235g(0.32mm)'
          },
          {
            value: '0.35',
            label: '255g(0.35mm)'
          },
          {
            value: '0.37',
            label: '275g(0.37mm)'
          },
          {
            value: '0.44',
            label: '325g(0.44mm)'
          },
          {
            value: '0.5',
            label: '375g(0.5mm)'
          },
          {
            value: '0.57',
            label: '425g(0.57mm)'
          }
        ],
        牛卡: [
          {
            value: '0.23',
            label: '180g美牛(0.23mm)'
          },
          {
            value: '0.47',
            label: '350g美牛(0.47mm)'
          },
          {
            value: '0.199',
            label: '150g浅牛(0.19mm)'
          },
          {
            value: '0.49',
            label: '350g浅牛(0.4mm)'
          },
          {
            value: '0.19',
            label: '150g红牛(0.19mm)'
          },
          {
            value: '0.4',
            label: '350g红牛(0.4mm)'
          }
        ]
      },
      Material254Value: '单铜纸',
      Weight254Value: '0.35',
      Direction: [
        {
          value: 'Y',
          label: '垂直纹理'
        },
        {
          value: 'X',
          label: '水平纹理'
        }
      ],
      Material250: [
        {
          value: 'E',
          label: 'E坑'
        },
        {
          value: 'F',
          label: 'F坑'
        }
      ],
      Material250Value: 'E',
      Direction250Value: 'Y',
      banding: '',
      backcover: '',
      angle: '',
      AircraftHole: [
        {
          value: 'W',
          label: '无'
        },
        {
          value: 'C',
          label: '圆孔'
        },
        {
          value: 'S',
          label: '飞机孔'
        }
      ],
      AircraftHoleValue: 'W',
      Zipper: [
        {
          value: 'SN',
          label: '无'
        },
        {
          value: 'SY',
          label: '是'
        }
      ],
      ZipperValue: 'SN',
      EasyTear: [
        {
          value: 'SO',
          label: '无'
        },
        {
          value: 'SA',
          label: 'V字型'
        }
      ],
      EasyTearValue: 'SO',
      zipdistance: '',
      zipheight: '',
      easydistance: '',
      type_box: '',
      type: 13,
      src: ''
    };
  },
  methods: {
    getById() {
      this.id = this.$route.query.gid;
      this.gSubCateId = this.$route.query.gSubCateId;
      getById({ id: this.id })
        .then(res => {
          if (res.success) {
            this.data = res.data;
            var description = '';
            var deArray = [];
            if (this.gSubCateId == 270) {
              description = res.data.description;
              deArray = description.split('_');
              this.Specifications = deArray[0];
              this.random = deArray[1];
            }
            if (this.gSubCateId == 268) {
              description = res.data.description;
              deArray = description.split('_');
              this.Specifications = deArray[0];
            }
            // 984 box1  985 box2  988 box5  989 6 990 7 991 8
            if (this.gSubCateId == 271) {
              this.finishLong = 100;
              this.finishWide = 100;
              this.finishT = 50;
              this.zipdistance = 35;
              this.zipheight = 12;
              this.easydistance = 10;
              this.banding = 5;
              this.angle = 4;
              this.backcover = 5;
              this.finishH = 6;
              if (this.id == 984) {
                this.type_box = 'box1';
              } else if (this.id == 985) {
                this.type_box = 'box2';
              } else if (this.id == 988) {
                this.type_box = 'box5';
              } else if (this.id == 989) {
                this.type_box = 'box6';
              } else if (this.id == 990) {
                this.type_box = 'box7';
              } else if (this.id == 991) {
                this.type_box = 'box8';
              }
            }
            console.log(6666, res.data);
          } else {
            console.log(res.message);
          }
        })
        .catch(err => {});
    },
    //3d渲染
    knife3d() {
      console.log(544);
      var width = this.finishLong;
      var length = this.finishWide;
      var height = this.finishT;
      var zipper = this.zipdistance;
      var zipper_length = this.zipheight;
      var easy = this.easydistance;
      var banding = this.banding;
      var angle = this.angle;
      var plain = this.AircraftHoleValue;
      var shape = this.EasyTearValue;
      var zip = this.ZipperValue;
      if (zip == 'SN') {
        zipper = 0;
        zipper_length = 0;
      }
      var type_box = this.type_box;
      var type = this.type;
      if (type_box == 'box7' && shape == 'SO') {
        shape = 'SA';
        easy = 0;
      }
      this.src =
        'https://admin.aocai.cn/index.php/index/cutter/php_knife?length=' +
        length +
        '&width=' +
        width +
        '&height=' +
        height +
        '&easy=' +
        easy +
        '&zipper=' +
        zipper +
        '&zipper_length=' +
        zipper_length +
        '&banding=' +
        banding +
        '&angle=' +
        angle +
        '&plain=' +
        plain +
        '&shape=' +
        shape +
        '&zip=' +
        zip +
        '&type=' +
        type +
        '&type_box=' +
        type_box;
      console.log(this.src);
    },
    DownloadKnifeMold() {
      var url = this.link;
      var finish_long = this.finishLong;
      var finish_wide = this.finishWide;
      var finish_height = this.finishHeight;
      var finish_h = this.finishH;
      var a = 0;
      if (this.gSubCateId == 268) {
        //纸杯
        url += this.data.cutterPath;
      } else if (this.gSubCateId == 270 || this.gSubCateId == 279) {
        url = 'https://aocai.cn/' + this.data.cutterPath;
        console.log(url, this.data);
      } else if (this.gSubCateId == 267) {
        //铁罐
        url += '/index.php/index/cutting/DownTissue.html?type=tintank&id=' + this.id;
      } else if (this.gSubCateId == 254) {
        //卡盒-特殊盒型

        if (finish_long <= 0 || finish_wide <= 0 || finish_height <= 0) {
          this.$message({
            type: 'error',
            message: '长宽高不能为空'
          });
          return false;
        }
        a = this.validateParame();
        if (a == 1) {
          return false;
        }
        if (this.data.standard == 'a') {
          this.$message({
            type: 'error',
            message: '刀模正在开发中，请耐心等待'
          });
          return false;
        }
        var zhike = this.Weight254Value;
        //因value值同名 所以后缀加了个9 现将9去除
        if (zhike == '0.199') {
          zhike = '0.19';
        }
        if (zhike == '0.49') {
          zhike = '0.4';
        }
        url += '/index.php/index/cutting/download_card.html?zhizhang=' + this.Material254Value + '&finish_long=' + finish_long + '&finish_wide=' + finish_wide + '&finish_height=' + finish_height + '&zhike=' + zhike + '&goods_sn=' + this.data.goodsSn;
      } else if (this.gSubCateId == 250 || this.gSubCateId == 253) {
        //坑盒-平粘盒

        if (finish_long <= 0 || finish_wide <= 0 || finish_height <= 0) {
          this.$message({
            type: 'error',
            message: '长宽高不能为空'
          });
          return false;
        }

        if (this.gSubCateId == 253) {
          if (finish_h <= 0) {
            this.$message({
              type: 'error',
              message: '盖高不能为空'
            });
            return false;
          }
        }
        a = this.validateParame();
        if (a == 1) {
          return false;
        }
        if (this.data.standard == 'a') {
          this.$message({
            type: 'error',
            message: '刀模正在开发中，请耐心等待'
          });
          return false;
        }
        url +=
          '/index.php/index/cutting/download_card.html?zhizhang=' +
          this.Material250Value +
          '&finish_long=' +
          finish_long +
          '&finish_wide=' +
          finish_wide +
          '&finish_height=' +
          finish_height +
          '&zhike=' +
          this.Direction250Value +
          '&goods_sn=' +
          this.data.goodsSn;
      } else if (this.gSubCateId == 271) {
        //软包装
        var height = this.finishLong;
        var long = this.finishWide;
        var width = this.finishT;
        var zipper = this.zipdistance;
        var length = this.zipheight;
        var easy = this.easydistance;
        var banding = this.banding;
        var angle = this.angle;
        var plain = this.AircraftHoleValue;
        var shape = this.EasyTearValue;
        var zip = this.ZipperValue;
        var goods_id = this.id;
        width = width == 'undefined' ? 0 : width;
        finish_h = finish_h == 'undefined' ? 0 : finish_h;
        banding = banding == 'undefined' ? 0 : banding;

        if (zip == 'SN') {
          zipper = 0;
          length = 0;
        }

        // 984 box1  985 box2  988 box5  989 6 990 7 991 8

        if (height == '') {
          this.$message({
            type: 'error',
            message: '成品尺寸高不能为空 '
          });
          return false;
        }
        if (long == '') {
          this.$message({
            type: 'error',
            message: '成品尺寸宽不能为空 '
          });
          return false;
        }
        console.log('banding', banding);
        banding = 5;
        if (banding == 0) {
          this.$message({
            type: 'error',
            message: '请输入热边封宽度 '
          });
          return false;
        }
        a = this.validateParame();
        if (a == 1) {
          return false;
        }
        url +=
          '/index.php/index/cutter/download_softpack.html?cls=' +
          goods_id +
          '&height=' +
          height +
          '&long=' +
          long +
          '&width=' +
          width +
          '&finish_h=' +
          finish_h +
          '&zipper=' +
          zipper +
          '&length=' +
          length +
          '&easy=' +
          easy +
          '&banding=' +
          banding +
          '&angle=' +
          angle +
          '&plain=' +
          plain +
          '&shape=' +
          shape +
          '&zip=' +
          zip;
        console.log(url);
      }
      window.location.href = url;
      // 用户行为记录
      this.$report({
        channel: 131000 + Number(this.$route.query.subCateId),
        actionId: 3,
        param: JSON.stringify(this.$route.query)
      });
      //window.open(url, '_blank');
    },
    Material254Change(e) {
      console.log(e);
      this.Material254Value = e;
      this.Weight254Value = this.Weight254[e][0].value;
    },
    Weight254Change(e) {
      this.Weight254Value = e;
      this.knife3d();
    },
    Material250Change(e) {
      this.Material250Value = e;
    },
    Direction250Change(e) {
      this.Direction250Value = e;
    },
    checkSoftVal(min, max, e) {
      var _val = this[e];
      var _max = max;
      var _min = min;
      _val = _val * 1;
      console.log(2421);
      console.log(_val);
      if (isNaN(_val)) {
        this.$message({
          type: 'error',
          message: '请输入正确的数值 '
        });
        this[e] = 0;
        return false;
      }
      if (_val == 0) {
        this.knife3d();
        return true;
      }
      if (_val < _min * 1) {
        this.$message({
          type: 'error',
          message: '小于最小值 ' + _min
        });
        this[e] = _min;
        this.knife3d();
        return false;
      }
      if (_val > _max) {
        this.$message({
          type: 'error',
          message: '超出最大值 ' + _max
        });
        this[e] = _max;
        this.knife3d();
        return false;
      }
      this.knife3d();
      return true;
    },
    validateParame(obj, val) {
      var data = this.data;
      var goodsAttrVo = this.data.goodsAttrVo;
      var finish_long = this.finishLong;
      var finish_wide = this.finishWide;
      var finish_height = this.finishHeight;
      var finish_t = this.finishT;
      var finish_x = this.finishX;
      var finish_h = this.finishH;
      var finish_r = this.finishR;

      var long_max = data.longMax;
      var width_max = data.widthMax;
      var height_max = data.heightMax;
      var long_min = data.longMin;
      var width_min = data.widthMin;
      var height_min = data.heightMin;

      var t_min = goodsAttrVo.goodAtMin;
      var t_max = goodsAttrVo.goodAtMax;
      var x_min = goodsAttrVo.goodAxMin;
      var x_max = goodsAttrVo.goodAxMax;
      var h_min = goodsAttrVo.goodAhMin;
      var h_max = goodsAttrVo.goodAhMax;
      var r_min = goodsAttrVo.goodArMin;
      var r_max = goodsAttrVo.goodArMax;
      //

      if (parseInt(finish_long) > parseInt(long_max) && long_max > 0) {
        this.$message({
          type: 'error',
          message: '盒子长不能大于' + long_max + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_wide) > parseInt(width_max) && width_max > 0) {
        this.$message({
          type: 'error',
          message: '盒子宽不能大于' + width_max + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_height) > parseInt(height_max) && height_max > 0) {
        this.$message({
          type: 'error',
          message: '盒子高不能大于' + height_max + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_long) < parseInt(long_min) && long_min > 0) {
        this.$message({
          type: 'error',
          message: '盒子长不能小于' + long_min + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_wide) < parseInt(width_min) && width_min > 0) {
        this.$message({
          type: 'error',
          message: '盒子宽不能小于' + width_min + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_height) < parseInt(height_min) && height_min > 0) {
        this.$message({
          type: 'error',
          message: '盒子高不能小于' + height_min + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }

      if (parseInt(finish_t) < parseInt(t_min) && t_min > 0) {
        this.$message({
          type: 'error',
          message: '盒子局部高度不能小于' + t_min + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_t) > parseInt(t_max) && t_max > 0) {
        if (this.gSubCateId == 271) {
          this.$message({
            type: 'error',
            message: '半展不能大于' + t_max + 'mm'
          });
        } else {
          this.$message({
            type: 'error',
            message: '盒子局部高度不能大于' + t_max + 'mm'
          });
        }
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_x) < parseInt(x_min) && x_min > 0) {
        this.$message({
          type: 'error',
          message: '盒子壁厚不能小于' + x_min + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_x) > parseInt(x_max) && x_max > 0) {
        this.$message({
          type: 'error',
          message: '盒子壁厚不能大于' + x_max + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_h) < parseInt(h_min) && h_min > 0) {
        this.$message({
          type: 'error',
          message: '盒子盖高不能小于' + h_min + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_h) > parseInt(h_max) && h_max > 0) {
        if (this.gSubCateId == 271) {
          this.$message({
            type: 'error',
            message: '封位' + h_max + 'mm'
          });
        } else {
          this.$message({
            type: 'error',
            message: '盒子盖高不能大于' + h_max + 'mm'
          });
        }

        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_r) < parseInt(r_min) && r_min > 0) {
        this.$message({
          type: 'error',
          message: '盒子半径不能小于' + r_min + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      if (parseInt(finish_r) > parseInt(r_max) && r_max > 0) {
        this.$message({
          type: 'error',
          message: '盒子半径不能大于' + r_max + 'mm'
        });
        if (obj) {
          this[obj] = val;
        }
        this.knife3d();
        return 1;
      }
      this.knife3d();
      if (typeof finish_t != 'undefined' && finish_t < 1) {
        return false;
      }

      if (typeof finish_x != 'undefined' && finish_x < 1) {
        return false;
      }

      if (typeof finish_h != 'undefined' && finish_h < 1) {
        return false;
      }

      if (typeof finish_r != 'undefined' && finish_r < 1) {
        return false;
      }

      if (finish_long != '' && finish_wide != '' && finish_height != '') {
        return true;
      }
    }
  },
  watch: {
    $route(to) {
      this.getById();
    }
  },
  created() {
    this.getById();
  }
};
</script>

<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/mulindex/css/index_new.css" />
<style scoped src="../../static/mulindex/css/attr.css" />

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
                <img class="imAge" v-if="imAge_show" :src="data.photoPath1" />

                <canvas v-for="item in totalPage" :key="item" :id="'the-canvas' + item" :class="canvas_show ? 'pdf-content ' : 'pdf-content hiddencanvas'"></canvas>

                <div v-if="frame_show" style="line-height: 0vw;">
                  <iframe name="knife_3d" :src="this.src" class="knife_3d" id="knife_1" style="width: 842px;height: 578px;"></iframe>
                </div>
              </span>
            </div>
            <!-- 缩略图begin -->
            <div class="spec-scroll">
              <div class="items">
                <ul>
                  <li :class="imAge_show ? 'current' : ''">
                    <img :src="data.photoPath1" @click="preview()" style="background-color: #FFF;" />
                  </li>
                  <li :class="canvas_show ? 'current' : ''">
                    <img :src="data.photoPath2" @click="model_preview_pdf(this, 1)" style="background-color: #FFF;" />
                  </li>
                  <li :class="frame_show ? 'current' : ''" @click="model_preview_3d(this, 2)">
                    <input class="itext" type="hidden" :value="data.knifeUrl" />
                    <div class="specIon"><span class="icon icon-3d"></span></div>
                    <img :src="data.photoPath1" />
                  </li>

                  <!--                  <li v-if="this.gSubCateId == '245' || this.gSubCateId == '244'" onclick="model_preview_card(this,2)">-->
                  <!--                    <input class="itext" type="hidden" :value="data.knifeUrl" />-->
                  <!--                    <div class="specIon"><span class="icon icon-3d"></span></div>-->
                  <!--                    <img :src="data.photoPath1" />-->
                  <!--                  </li>-->
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
              <li v-if="folder === 'hardcover' || folder == 'hardcoverBook' || folder == 'hardcoverFence' || folder == 'hardcoverDrawer'">
                <label class="guigeLabel"><span class="red sRed">*</span> 成品尺寸: </label>
                <div class="downLyRtxt">
                  <select class="cotInpt Hardcover hardcover_size" v-model="hardCoverAttr" @change="changeMm">
                    <option value="0">内尺寸</option>
                    <option value="1">外尺寸</option>
                  </select>
                </div>
              </li>
              <li v-if="folder == 'netopit'">
                <label class="guigeLabel"><span class="red sRed">*</span> 成品尺寸: </label>
                <div class="downLyRtxt">
                  <select class="cotInpt Hardcover hardcover_size netoPit_hardcover_size" v-model="netopitAttr" @change="changeMm">
                    <option value="0">内托尺寸</option>
                    <option value="1">外盒尺寸</option>
                    <option value="2">实体尺寸</option>
                  </select>
                </div>
              </li>
              <li>
                <div class="guigeTopDv">
                  <input type="text" name="length" @change="changeMm()" class="card_dimension" placeholder="80" v-model="length" />
                  <span class="guige-sign">×</span>
                  <input type="text" name="width" @change="changeMm()" class="card_dimension" placeholder="60" v-model="width" />
                  <span class="guige-sign">×</span>
                  <input type="text" name="height" @change="changeMm()" class="card_dimension" placeholder="120" v-model="height" />
                  <span class="guige-sign">mm</span>
                </div>
              </li>
              <li v-show="folder == 'netopit'" class="opensizecls" style="display: none">
                <span class="maxRt_sp guigeLabel">
                  内托展开长度：
                </span>
                <div class="maxRt_Dv">
                  <div class="masize">
                    <span class="fl unfoldsize C9">{{ noteCalcAttr.opensizecls }}</span>
                  </div>
                </div>
              </li>
              <li>
                <label class="guigeLabel"> 纯种底色 </label>
                <div class="downLyRtxt Background_color">
                  <span :class="iconIndex == 0 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(0)"><img src="@/static/3d/img/aocai.jpg"/></span>
                  <span :class="iconIndex == 1 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(1)"><img src="@/static/3d/img/jin_A.jpg"/></span>
                  <span :class="iconIndex == 2 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(2)"><img src="@/static/3d/img/niu_A.jpg"/></span>
                  <span :class="iconIndex == 3 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(3)"><img src="@/static/3d/img/pink_A.jpg"/></span>
                  <span :class="iconIndex == 4 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(4)"><img src="@/static/3d/img/qing_A.jpg"/></span>
                  <span :class="iconIndex == 5 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(5)"><img src="@/static/3d/img/red_A.jpg"/></span>
                  <span :class="iconIndex == 6 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(6)"><img src="@/static/3d/img/wa_A.jpg"/></span>
                  <span :class="iconIndex == 7 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(7)"><img src="@/static/3d/img/yin_A.jpg"/></span>
                </div>
              </li>
              <cutter-major :formData.sync="formData" :formVoList="formVoList" :changeParam="changeParam" :selectSelect="selectSelect" :radioSelect="radioSelect" :inputChange="inputChange"></cutter-major>
              <!-- 内托属性 -->
              <li v-show="netopitAttr == 2" class="entity_one" style="display: none">
                <label class="guigeLabel"><span class="red sRed">*</span> 实物种类: </label>
                <div class="downLyRtxt">
                  <select class="cotInpt  netoPit_entity_one" @change="changeMm" v-model="notepitEnityType">
                    <option value="sw1">瓶子或其他单只物体</option>
                    <option value="sw2">多包面膜袋</option>
                  </select>
                </div>
              </li>
              <li v-show="folder == 'netopit'" class="opensizecls2" style="display: none">
                <span class="maxRt_sp guigeLabel">
                  外盒成品尺寸：
                </span>
                <div class="maxRt_Dv">
                  <div class="masize">
                    <span class="fl unfoldsize2 C9">{{ noteCalcAttr.opensizecls2 }}</span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="flex geRtBtnDv">
              <a href="javascript:;" class="buybtn goCart getBuy" style="display: none">一键3D</a>
              <div class="joinShoping" v-if="this.gSubCateId == '254'">
                <!--uncultivated_download ： 未开发-->
                <a href="javascript:;" @click="download()" class="buybtn btnCart curr uncultivated_download"> <em class="icon icon-down"></em>下载刀模 </a>
              </div>
              <div class="joinShoping" v-if="this.gSubCateId != '254'">
                <a href="javascript:;" @click="download()" class="buybtn btnCart curr card_knife_download"> <em class="icon icon-down"></em>下载刀模 </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getById } from '@/api/goods/miniGoodsApi';
import CutterMajor from '@/components/cutter/CutterMajor';
import { getCurVoList, dataChange, cutterInitUtil, selectSelect, radioSelect, inputChange } from '@/utils/cutter/cutterUtil';
import { getFolder, knife_pdf, knife_3d, knifeDownload, getInputStr } from '@/utils/cutter/knifeUtil';
import { calcNetopitSize, buildSelect } from '@/utils/cutter/calcNetopit';
export default {
  components: { CutterMajor },
  data() {
    return {
      cateId: 0,
      subCateId: '',
      gCateId: 0,
      gid: 0,
      gSubCateId: 0,
      folder: 'cardBox', //下载刀模路径
      data: [], //商品所有属性
      cateType: 'goodsCate',
      bindType: 'goodsCate',
      whereBindId: '',
      whereGoodsId: '',
      voList: [],
      imAge_show: true,
      canvas_show: false,
      frame_show: false,
      reqLock: false,
      formData: {
        inputValues: {},
        radioSelectValues: {},
        selectSelectValues: {}
      },
      formVoList: [],
      totalPage: 1, //pdf分页
      length: 80, //长
      width: 60, //宽
      height: 120, //高
      defaultLength: 80, //长
      defaultWidth: 60, //宽
      defaultHeight: 120, //高
      type: 'img', //判断是pdf还是3d或img
      threeInputStr: '', //输入框3d参数拼接字符串,自行手动拼接除动态参数外参数
      inputStr: '', //输入框参数拼接字符串,自行手动拼接除动态参数外参数
      datastr: '', //动态参数拼接字符串
      imgSrc: encodeURIComponent('/static/3d/img/aocai.jpg'), ///static/3d/img/aocai.jpg
      iconIndex: 0, //3d皮肤切换
      src: '', //3d路径
      hardCoverAttr: 0, //精装天地盖内外尺寸控制
      netopitAttr: 0, // 内托盒型
      notepitEnityType: 'sw1', // 内托实体类型
      noteCalcAttr: { opensizecls: '', opensizecls2: '' }
    };
  },
  async created() {
    cutterInitUtil(this);
    this.cateId = this.$route.query.cateId;
    this.subCateId = this.$route.query.subCateId;
    this.gCateId = this.$route.query.gCateId;
    this.gSubCateId = this.$route.query.gSubCateId;
    this.gid = this.$route.query.gid;
    this.folder = getFolder(this.cateId, this.gSubCateId, this.gid);
    await this.getGoodsById();
    this.defaultValue();
    await getCurVoList();
    this.changeParam();
    buildSelect(this.voList);
    this.computedNetopitArea();
    // this.activeExpandNotepit();
  },
  watch: {},
  methods: {
    ...{ selectSelect, radioSelect, inputChange },
    //获取文件夹方法,用于区分不同
    //下载刀模
    download() {
      knifeDownload(this, window.location);
    },
    //改变图标
    changeIcon(index) {
      var iconArr = ['/static/3d/img/aocai.jpg', '/static/3d/img/jin_A.jpg', '/static/3d/img/niu_A.jpg', '/static/3d/img/pink_A.jpg', '/static/3d/img/qing_A.jpg', '/static/3d/img/red_A.jpg', '/static/3d/img/wa_A.jpg', '/static/3d/img/yin_A.jpg'];
      console.log(1111, index, iconArr[index]);
      this.iconIndex = index;
      this.imgSrc = encodeURIComponent(iconArr[index]);
      knife_3d(this, this.cateId, this.gSubCateId, this.gid);
    },
    changeParam() {
      dataChange();
      this.computedNetopitArea();
      this.check_knife();
      if (this.type == '3d') {
        knife_3d(this, this.cateId, this.gSubCateId, this.gid);
      }
      if (this.type == 'pdf') {
        knife_pdf(this, this.cateId, this.gSubCateId, this.gid);
      }
    },
    defaultValue() {
      //卡盒
      if (this.cateId == 1) {
        if (this.gSubCateId == '241' || this.gSubCateId == '240' || this.gSubCateId == '242' || this.gSubCateId == '264' || this.gSubCateId == '239') {
          this.length = 80;
          this.width = 60;
          this.height = 120;
          this.defaultLength = 80;
          this.defaultWidth = 60;
          this.defaultHeight = 120;
        } else if (this.gSubCateId == '245' || this.gSubCateId == '244' || this.gSubCateId == '254') {
          this.length = 140;
          this.width = 55;
          this.height = 120;
          this.defaultLength = 140;
          this.defaultWidth = 55;
          this.defaultHeight = 120;
        } else if (this.gSubCateId == '243') {
          this.length = 120;
          this.width = 80;
          this.height = 40;
          this.defaultLength = 120;
          this.defaultWidth = 80;
          this.defaultHeight = 40;
        }
      }

      //坑盒
      if (this.cateId == 2) {
        if (this.gSubCateId == '251') {
          if (this.data.goodsSn == 'W_YT_BOX06') {
            this.length = 90;
            this.width = 60;
            this.height = 33;
            this.defaultLength = 90;
            this.defaultWidth = 60;
            this.defaultHeight = 33;
          } else {
            this.length = 90;
            this.width = 60;
            this.height = 33;
            this.defaultLength = 90;
            this.defaultWidth = 60;
            this.defaultHeight = 33;
          }
        } else if (this.gSubCateId == '233') {
          this.length = 120;
          this.width = 120;
          this.height = 150;
          this.defaultLength = 120;
          this.defaultWidth = 120;
          this.defaultHeight = 150;
        } else if (this.gSubCateId == '253') {
          this.length = 200;
          this.width = 200;
          this.height = 100;
          this.defaultLength = 200;
          this.defaultWidth = 200;
          this.defaultHeight = 100;
        } else {
          this.length = 80;
          this.width = 60;
          this.height = 120;
          this.defaultLength = 80;
          this.defaultWidth = 60;
          this.defaultHeight = 120;
        }
      }


      //胶片盒
      if (this.cateId == 8) {
        this.length = 60;
        this.width = 43;
        this.height = 120;
        this.defaultLength = 60;
        this.defaultWidth = 43;
        this.defaultHeight = 120;
      }

      //精装盒
      if (this.cateId == 3) {
        this.length = 100;
        this.width = 100;
        this.height = 50;
        this.defaultLength = 100;
        this.defaultWidth = 100;
        this.defaultHeight = 50;
      }

      //内托
      if (this.cateId == 4) {
        this.length = 80;
        this.width = 60;
        this.height = 120;
        this.defaultLength = 80;
        this.defaultWidth = 60;
        this.defaultHeight = 120;
      }

      //手袋
      if (this.cateId == 7) {
        this.length = 200;
        this.width = 80;
        this.height = 200;
        this.defaultLength = 200;
        this.defaultWidth = 80;
        this.defaultHeight = 200;
      }

      //手提盒
      if (this.cateId == 2 && this.gSubCateId == 233) {
        this.length = 200;
        this.width = 120;
        this.height = 150;
        this.defaultLength = 200;
        this.defaultWidth = 120;
        this.defaultHeight = 150;
      }

      getInputStr(this);
    },
    //获取商品/刀模信息
    async getGoodsById() {
      await getById({ id: this.gid })
        .then(res => {
          if (res.success) {
            this.data = res.data;
          } else {
            console.log(res.message);
          }
        })
        .catch(err => {});
    },
    preview() {
      this.imAge_show = true;
      this.canvas_show = false;
      this.frame_show = false;
      this.type = 'img';
    },
    changeMm() {
      this.computedNetopitArea();
      this.check_knife();
      getInputStr(this);
      if (this.type == '3d') {
        knife_3d(this, this.cateId, this.gSubCateId, this.gid);
      }
      if (this.type == 'pdf') {
        knife_pdf(this, this.cateId, this.gSubCateId, this.gid);
      }
    },
    check_knife() {
      console.log(111, this.datastr);
      //判断壁厚
      var str = this.datastr;
      if (str.indexOf('ground_up') != -1) {
        var ground_up = 0;
        var ground_down = 0;
        var ground_left = 0;
        var ground_right = 0;
        var strArr = str.split('&');
        for (var i = 0, l = strArr.length; i < l; i++) {
          var str2 = strArr[i];
          if (str2.indexOf('ground_up') != -1) {
            ground_up = parseFloat(str2.substring(str2.lastIndexOf('=') + 1));
          }
          if (str2.indexOf('ground_down') != -1) {
            ground_down = parseFloat(str2.substring(str2.lastIndexOf('=') + 1));
          }
          if (str2.indexOf('ground_left') != -1) {
            ground_left = parseFloat(str2.substring(str2.lastIndexOf('=') + 1));
          }
          if (str2.indexOf('ground_right') != -1) {
            ground_right = parseFloat(str2.substring(str2.lastIndexOf('=') + 1));
          }
        }
        if (ground_left > ground_up || ground_left > ground_down || ground_right > ground_down || ground_right > ground_up) {
          this.$message({
            message: '左右壁厚要小于上下壁厚',
            type: 'error'
          });
        }
      }
      this.length = parseFloat(this.length);
      this.width = parseFloat(this.width);
      this.height = parseFloat(this.height);
      if (this.length > this.data.longMax && this.data.longMax > 0) {
        //layer.msg('盒子长不能大于' + this.data.longMax + 'mm');
        this.$message({
          message: '盒子长不能大于' + this.data.longMax + 'mm',
          type: 'error'
        });
        this.length = this.defaultLength;
        return false;
      }

      if (this.length < this.data.longMin && this.data.longMin > 0) {
        //layer.msg('盒子长不能大于' + this.data.longMax + 'mm');
        this.$message({
          message: '盒子长不能小于' + this.data.longMin + 'mm',
          type: 'error'
        });
        this.length = this.defaultLength;
        return false;
      }

      if (this.width > this.data.widthMax && this.data.widthMax > 0) {
        //layer.msg('盒子长不能大于' + this.data.longMax + 'mm');
        this.$message({
          message: '盒子宽不能大于' + this.data.widthMax + 'mm',
          type: 'error'
        });
        this.width = this.defaultWidth;
        return false;
      }

      if (this.width < this.data.widthMin && this.data.widthMin > 0) {
        //layer.msg('盒子长不能大于' + this.data.longMax + 'mm');
        this.$message({
          message: '盒子宽不能小于' + this.data.widthMin + 'mm',
          type: 'error'
        });
        this.width = this.defaultWidth;
        return false;
      }

      if (this.height > this.data.heightMax && this.data.heightMax > 0) {
        //layer.msg('盒子长不能大于' + this.data.longMax + 'mm');
        this.$message({
          message: '盒子高不能大于' + this.data.heightMax + 'mm',
          type: 'error'
        });
        this.height = this.defaultHeight;
        return false;
      }

      if (this.height < this.data.heightMin && this.data.heightMin > 0) {
        //layer.msg('盒子长不能大于' + this.data.longMax + 'mm');
        this.$message({
          message: '盒子高不能小于' + this.data.heightMin + 'mm',
          type: 'error'
        });
        this.height = this.defaultHeight;
        return false;
      }
      console.log(12345, this.length, this.width);
      if (this.length < this.width && this.height > 0) {
        //layer.msg('盒子长不能大于' + this.data.longMax + 'mm');
        this.$message({
          message: '盒子长不能小于宽',
          type: 'error'
        });
        this.width = this.defaultWidth;
        this.length = this.defaultLength;
        return false;
      }
      //手袋(特殊)
      if (this.cateId == 7) {
        if (this.height < this.width && this.height > 0) {
          //layer.msg('盒子长不能大于' + this.data.longMax + 'mm');
          this.$message({
            message: '盒子高不能小于宽',
            type: 'error'
          });
          this.width = this.defaultWidth;
          this.length = this.defaultLength;
          return false;
        }
      }
      //壁厚判断

      // if (this.length) > this.data.longMax && long_max > 0) {
      //   layer.msg('盒子长不能大于' + long_max + 'mm', { icon: 2 });
      //   $("input[name='length']").val('80');
      //   return false;
      // }
      // if (parseInt(width) > parseInt(width_max) && width_max > 0) {
      //   layer.msg('盒子宽不能大于' + width_max + 'mm', { icon: 2 });
      //   $("input[name='width']").val('60');
      //   return false;
      // }
      // if (parseInt(height) > parseInt(height_max) && height_max > 0) {
      //   layer.msg('盒子高不能大于' + height_max + 'mm', { icon: 2 });
      //   $("input[name='height']").val('120');
      //   return false;
      // }
      // if (parseInt(length) < parseInt(long_min) && long_min > 0) {
      //   layer.msg('盒子长不能小于' + long_min + 'mm', { icon: 2 });
      //   $("input[name='length']").val('80');
      //   return false;
      // }
      // if (parseInt(width) < parseInt(width_min) && width_min > 0) {
      //   layer.msg('盒子宽不能小于' + width_min + 'mm', { icon: 2 });
      //   $("input[name='width']").val('60');
      //   return false;
      // }
      // if (parseInt(height) < parseInt(height_min) && height_min > 0) {
      //   layer.msg('盒子高不能小于' + height_min + 'mm', { icon: 2 });
      //   $("input[name='height']").val('120');
      //   return false;
      // }
      // if (parseInt(length) < parseInt(width) && height_min > 0) {
      //   layer.msg('盒子长不能小于宽', { icon: 2 });
      //   $("input[name='length']").val('80');
      //   $("input[name='width']").val('60');
      //   return false;
      // }
    },
    //切换pdf图标
    model_preview_pdf(img, num) {
      this.imAge_show = false;
      this.canvas_show = true;
      this.frame_show = false;
      this.type = 'pdf';
      this.check_knife();
      knife_pdf(this, this.cateId, this.gSubCateId, this.gid);
    },
    //点击3D图标
    model_preview_3d(img, num) {
      this.imAge_show = false;
      this.canvas_show = false;
      this.frame_show = true;
      this.type = '3d';
      console.log(1111, this.url);
      knife_3d(this, this.cateId, this.gSubCateId, this.gid);
    },
    // 计算内托展开长度和外盒
    computedNetopitArea() {
      if (this.folder == 'netopit') {
        let length = this.length;
        let width = this.width;
        let height = this.height;
        if (length && width && height && this.voList.length > 0) {
          this.noteCalcAttr = calcNetopitSize(this.netopitAttr, this.notepitEnityType, length, width, height, this.voList, this.formData.selectSelectValues);
        }
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
</style>

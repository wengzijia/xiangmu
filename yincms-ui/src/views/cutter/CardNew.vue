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
                  <iframe name="knife_3d" v-if="!showIframe2" :src="this.src" class="knife_3d" id="knife_1" style="width: 842px;height: 578px;"></iframe>
                  <iframe name="knife_3d" v-else :src="this.src2" class="knife_3d" id="knife_1" style="width: 842px;height: 578px;"></iframe>
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
                  <li v-if="isShow3DIframe" :class="frame_show ? 'current' : ''" @click="model_preview_3d(this, 2)">
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
            <div class="my-tab-box" v-if="isShow3DIframe">
              <div @click="tabChange(0)" :class="tabActive === 0 ? 'tab-active' : ''">
                下载刀模
              </div>
              <div @click="tabChange(1)" :class="tabActive === 1 ? 'tab-active' : ''">
                3D软打样
              </div>
            </div>
            <div v-if="tabActive === 0">
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
                <li v-if="tabActive === 0 && isShow3DIframe">
                  <label class="guigeLabel"> 纯种底色 </label>
                  <div class="downLyRtxt Background_color">
                    <span :class="iconIndex === 0 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(0)"><img src="@/static/3d/img/aocai.jpg"/></span>
                    <span :class="iconIndex == 1 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(1)"><img src="@/static/3d/img/jin_A.jpg"/></span>
                    <span :class="iconIndex == 2 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(2)"><img src="@/static/3d/img/niu_A.jpg"/></span>
                    <span :class="iconIndex == 3 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(3)"><img src="@/static/3d/img/pink_A.jpg"/></span>
                    <span :class="iconIndex == 4 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(4)"><img src="@/static/3d/img/qing_A.jpg"/></span>
                    <span :class="iconIndex == 5 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(5)"><img src="@/static/3d/img/red_A.jpg"/></span>
                    <span :class="iconIndex == 6 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(6)"><img src="@/static/3d/img/wa_A.jpg"/></span>
                    <span :class="iconIndex == 7 ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeIcon(7)"><img src="@/static/3d/img/yin_A.jpg"/></span>
                  </div>
                </li>

                <cutter-major :formData.sync="formData" :formVoList="formVoList" :changeParam="changeParam" :selectSelect="selectSelect" :radioSelect="radioSelect" :inputChange="inputChange" :tparam="tparam"></cutter-major>
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
            <div v-else-if="tabActive === 1">
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
                  <label class="guigeLabel"> 设计图列表 </label>
                  <div class="downLyRtxt Background_color" v-if="skinList.length > 0 && hideUploadBtn && tabActive === 1">
                    <template>
                      <span v-for="(item, index) in skinList" :key="index" :class="skinIndex === index ? 'downCor Knife_skin curr' : 'downCor Knife_skin'" @click="changeSkin(index)"><img :src="'http://alifile.xiaocaiyin.com/' + item"/></span>
                    </template>
                  </div>
                </li>
                <li v-if="hideUploadBtn && tabActive === 1">
                  <!-- <label class="guigeLabel">平面设计图 </label> -->
                  <div class="downLyRtxt Background_color" style="width: 100%;text-align: center;">
                    <el-button v-if="userInfo == null" size="small" class="upload-btn" icon="el-icon-upload" @click="isShowLogin = true">上传平面设计图</el-button>
                    <el-upload v-else class="avatar-uploader" style="width: 100%;" accept=".JPG,.PNG,.JPEG" action="" :show-file-list="false" :auto-upload="false" :on-change="getCutterImgFile">
                      <!-- <img v-if="skinList.length > 0 && skinIndex !== '' && skinList[skinIndex]" :src="'http://alifile.xiaocaiyin.com/' + skinList[skinIndex]" class="avatar" /> -->
                      <el-button size="small" class="upload-btn" icon="el-icon-upload">上传平面设计图</el-button>
                    </el-upload>

                    <!-- <el-upload v-else accept=".JPG,.PNG,.JPEG" class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false" :on-change="getCutterImgFile">

                    <el-button size="small" icon="el-icon-upload">上传平面设计图</el-button>
                  </el-upload> -->
                    <div style="color: #ff0036;text-align: left;">
                      1.请选择jpg/png格式。<br />
                      2.文件大小不得超过100M。<br />
                      3.请注意设计图的盒型以及尺寸是否与刀模一致。
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <login-form :dialogVisible.sync="isShowLogin"></login-form>
    <el-dialog title="上传刀模平面设计图" :visible.sync="isShowUpload" :close-on-click-modal="false" width="650px" class="uploader-dialog">
      <div style="display:flex;justify-content: space-between;align-items: flex-end;">
        <el-upload class="avatar-uploader" style="" accept=".JPG,.PNG,.JPEG" action="" :show-file-list="false" :auto-upload="false" :on-change="getCutterImgFile">
          <!-- <img v-if="skinList.length > 0 && skinIndex !== '' && skinList[skinIndex]" :src="'http://alifile.xiaocaiyin.com/' + skinList[skinIndex]" class="avatar" /> -->
          <img v-if="fileFromDataURl" :src="fileFromDataURl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div style="height: 100px;">
          <el-button class="confim-upload-btn" style="" type="primary" @click="uploadFileFun">确 定</el-button>
          <el-button class="close-upload-btn" style="" @click="isShowUpload = false">取 消</el-button>
        </div>
      </div>
      <div style="color: #ff0036;">
        1.请选择jpg/png格式并且文件大小不超过100M的平面设计图。<br />
        2.请注意设计图的盒型以及尺寸是否与刀模一致，如不一致会导致设计图无法精准贴合3D模型
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getById } from '@/api/goods/miniGoodsApi';
import CutterMajor from '@/components/cutter/CutterMajor';
import { getCurVoList, dataChange, cutterInitUtil, selectSelect, radioSelect, inputChange } from '@/utils/cutter/cutterUtil';
import { getFolder, knife_pdf, knife_3d, knife_3d2, knifeDownload, getInputStr } from '@/utils/cutter/knifeUtil';
import { calcNetopitSize, buildSelect } from '@/utils/cutter/calcNetopit';
import { uploadFile } from '@/api/category/categoryApi';
import { getUid } from '@/utils/utils';
import { ACCESS_TOKEN } from '@/store/global-constant';
import store from '@/store';
import LoginForm from '@/components/common/LoginForm';
export default {
  components: { CutterMajor, LoginForm },
  data() {
    return {
      imageUrl: '',
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
      skinIndex: 0,
      skinList: [],
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
      src2: '',
      showIframe2: false,
      hardCoverAttr: 0, //精装天地盖内外尺寸控制
      netopitAttr: 0, // 内托盒型
      notepitEnityType: 'sw1', // 内托实体类型
      noteCalcAttr: { opensizecls: '', opensizecls2: '' },
      userInfo: null,
      isShowLogin: false,
      isShowUpload: false,
      fileFromData: null,
      fileFromDataURl: '',
      tabActive: 0,
      isShow3DIframe: true,
      tparam: {
        t1: '',
        t2: '',
        t3: '',
        t4: ''
      }
    };
  },
  async created() {
    if (this.$route.query.cateId == 70) {
      this.isShow3DIframe = false; //是否显示隐藏3D页面，用来判断与3D有关的东西是否显示
    }
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
    this.getUserInfo();
    // this.activeExpandNotepit();
  },
  computed: {
    hideUploadBtn() {
      let _this = this;
      let ids = [
        {
          cateId: 3,
          subCateId: 33
        },
        {
          cateId: 2,
          subCateId: 30
        },
        {
          cateId: 13,
          subCateId: 78
        },
        {
          cateId: 1,
          subCateId: 21
        },
        {
          cateId: 1,
          subCateId: 20
        }
      ];
      if (!ids.find(e => e.cateId == _this.cateId && e.subCateId == _this.subCateId)) {
        return true;
      }

      return false;
    }
  },
  watch: {},
  methods: {
    tabChange(e) {
      this.tabActive = e;
    },

    getUserInfo() {
      if (localStorage.getItem(ACCESS_TOKEN) != null) {
        store.dispatch('GetUserInfo').then(() => {
          this.userInfo = store.getters.userInfo;
        });
      }
    },
    getCutterImgFile(file) {
      let _this = this;
      let maxSize = 1024 * 1024 * 100;
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
        _this.$message.error('请上传jpg/png格式的图片');
      } else if (file.size > maxSize) {
        _this.$message.error('请上传图片大小不超过100M的图片');
      } else {
        console.log('file,', file);
        _this.fileFromData = file;
        _this.fileFromDataURl = window.URL.createObjectURL(file.raw);
        this.uploadFileFun();
      }
    },
    uploadFileFun() {
      let _this = this;
      let file = _this.fileFromData;
      let fromdata = new FormData();
      let rawName = file.raw.name.split('.');
      fromdata.append('file', file.raw, rawName[rawName.length - 1] ? getUid() + '.' + rawName[rawName.length - 1] : rawName);
      // fromdata.append('folder', '3dcutterskin');
      uploadFile(fromdata, { folder: '3dCutterSkin/' })
        .then(res => {
          console.log('fromdata', res);
          _this.skinList.push(res.data);
          knife_3d2(_this, _this.cateId, _this.gSubCateId, _this.gid, res.data);
          _this.showIframe2 = true;
          _this.skinIndex = _this.skinList.length - 1;
          _this.iconIndex = '';
          _this.isShowUpload = false;
          _this.model_preview_3d();
        })
        .catch(err => {
          console.log('error', err);
        });
      // 用户行为记录
      this.$report({
        channel: 131000 + Number(this.$route.query.subCateId),
        actionId: 4,
        param: JSON.stringify(this.$route.query)
      });
    },
    ...{ selectSelect, radioSelect, inputChange },
    //获取文件夹方法,用于区分不同
    //下载刀模
    download() {
      // 用户行为记录
      this.$report({
        channel: 131000 + Number(this.$route.query.subCateId),
        actionId: 3,
        param: JSON.stringify(this.$route.query)
      });
      knifeDownload(this, window.location);
    },
    changeSkin(index) {
      this.skinIndex = index;
      knife_3d2(this, this.cateId, this.gSubCateId, this.gid, this.skinList[index]);
      this.showIframe2 = true;
      this.iconIndex = '';
    },
    //改变图标
    changeIcon(index) {
      var iconArr = ['/static/3d/img/aocai.jpg', '/static/3d/img/jin_A.jpg', '/static/3d/img/niu_A.jpg', '/static/3d/img/pink_A.jpg', '/static/3d/img/qing_A.jpg', '/static/3d/img/red_A.jpg', '/static/3d/img/wa_A.jpg', '/static/3d/img/yin_A.jpg'];
      console.log(1111, index, iconArr[index]);
      this.iconIndex = index;
      this.skinIndex = '';
      this.imgSrc = encodeURIComponent(iconArr[index]);
      knife_3d(this, this.cateId, this.gSubCateId, this.gid);
      this.showIframe2 = false;
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
      //外箱
      if (this.cateId == 70) {
        if (this.gSubCateId == '287') {
          // 一体成型盒
          this.length = this.defaultLength = 200;
          this.width = this.defaultWidth = 100;
          this.height = this.defaultHeight = 50;
        } else if (this.gSubCateId == '283' || this.gSubCateId == '284') {
          // 平口箱、全封口箱
          this.length = this.defaultLength = 300;
          this.width = this.defaultWidth = 200;
          this.height = this.defaultHeight = 200;
        } else if (this.gSubCateId == '286') {
          // 刀卡&平卡
          this.length = this.defaultLength = 50;
          this.width = this.defaultWidth = 30;
          this.height = this.defaultHeight = 40;
        }
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
      // console.log(12345, this.length, this.width);
      let boxarr=[239,240,241,242,249,264,247,277,248,250,260]
      if (this.length < this.width && this.height > 0 && !boxarr.includes(Number(this.gSubCateId))) {
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
          this.noteCalcAttr = calcNetopitSize(this.netopitAttr, this.notepitEnityType, length, width, height, this.voList, this.formData.selectSelectValues, this.$route.query.gid);
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
.uploader-dialog .avatar-uploader {
  text-align: center;
}
.avatar-uploader >>> .el-upload {
  /* border: 1px dashed #d9d9d9; */
  /* border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden; */
  width: 100%;
}
.avatar-uploader >>> .el-upload:hover {
  border-color: #ff0036;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 378px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 378px;
  height: 178px;
  display: block;
}
.downLyRtxt .upload-btn {
  color: #606266;
  background-color: #fff;
  width: 100%;
  height: 60px;
  background-color: #ff0036;
  font-size: 18px;
  color: #fff;
  border-radius: 4px;
}
.downLyRtxt .upload-btn:hover {
  /* border-color: #ff0036; */
  /* color: #606266; */
  /* background-color: #fff; */
}
.uploader-dialog .confim-upload-btn {
  width: 100%;
  margin: 0;
  background-color: #ff0036;
  border-color: #ff0036;
}
.uploader-dialog .confim-upload-btn:hover {
  background-color: #ea0032;
}
.uploader-dialog .close-upload-btn {
  width: 100%;
  margin: 0;
  margin-top: 10px;
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
}
.uploader-dialog .close-upload-btn:hover {
  border-color: #ff0036;
}
.my-tab-box {
  display: flex;
  justify-content: space-around;
  width: 100%;
  border: 1px solid #ff0036;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
  height: 35px;
  line-height: 35px;
}
.my-tab-box div {
  flex: 1;
  text-align: center;
  color: #777;
  transition: all 0.1s ease;
}
.my-tab-box div:hover {
  cursor: pointer;
}
.my-tab-box .tab-active {
  background-color: #ff0036;
  color: #fff;
}
</style>

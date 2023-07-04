<!-- fengjianbo -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="comBox guigeBox cardBox needhide">
          <div class=" container  guigeLt">
            <div class="flex cardtabT ">
              <!-- <span class="geH1Lt">原创设计 </span> -->
              <ul class="car_ul cardtabT_ul ">
                <li :class="tabType === '0' ? 'curr' : ''" @click="originalDesign('0')">
                  基础盒型原创设计
                </li>
                <li :class="tabType === '1' ? 'curr' : ''" @click="originalDesign('1')">
                  精装盒原创设计
                </li>
              </ul>
            </div>
            <div class="cardtabB ">
              <!-- <ul class="attrMain" v-show="tabType === '0'">
                <li>
                  <label class="guigeLabel"> <span class="red sRed">*</span>设计数量 </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="number" v-model="number" class="bags_dimension" @input="numberChange()" />
                      <span class="guige-sign">个</span>
                    </div>
                  </div>
                </li>
                <li>
                  <label class="guigeLabel"> 选择盒型 </label>
                  <div class="downLyRtxt Background_color">
                    <div class="downLyRtxt" style="width: 60%">
                      <el-select v-model="chooseCategory" size="small" @change="subCateChange">
                        <el-option label="选择盒型" value="-1"> </el-option>
                        <el-option v-for="(item, index) in subCateList" :key="index" :label="item.name" :value="index"> </el-option>
                      </el-select>
                    </div>
                  </div>
                </li>
                <li>
                  <label class="guigeLabel"> 成品尺寸 </label>
                  <div class="downLyRtxt Background_color">
                    <div class="guigeTopDv">
                      <input type="text" name="length" v-model="length" class="bags_dimension" placeholder="长" @input="judgeSize(length)" />
                      <span class="guige-sign">×</span>
                      <input type="text" name="width" v-model="width" class="bags_dimension" placeholder="宽" @input="judgeSize(width)" />
                      <span class="guige-sign">×</span>
                      <input type="text" name="height" v-model="height" class="bags_dimension" placeholder="高" @input="judgeSize(height)" />
                      <span class="guige-sign">mm</span>
                    </div>
                  </div>
                </li>
              </ul> -->
              <ul class="attrMain" v-show="tabType === '0'">
                <el-form :model="baseForm" :rules="rules" ref="baseForm" label-width="143px" class="demo-ruleForm">
                  <el-form-item label="选择盒型" prop="chooseCategory">
                    <div class="downLyRtxt Background_color">
                      <div class="downLyRtxt" style="width: 60%">
                        <el-select v-model="baseForm.chooseCategory" size="small" @change="subCateChange">
                          <el-option label="选择盒型" value="-1"> </el-option>
                          <el-option v-for="(item, index) in subCateList" :key="index" :label="item.name" :value="index"> </el-option>
                        </el-select>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="成品尺寸">
                    <div class="downLyRtxt Background_color">
                      <div class="guigeTopDv" style="width: 400px;">
                        <input type="text" name="length" v-model="baseForm.productSize.lengths" class="bags_dimension" placeholder="长" @input="judgeSize(baseForm.productSize.lengths)" />
                        <span class="guige-sign">×</span>
                        <input type="text" name="width" v-model="baseForm.productSize.width" class="bags_dimension" placeholder="宽" @input="judgeSize(baseForm.productSize.width)" />
                        <span class="guige-sign">×</span>
                        <input type="text" name="height" v-model="baseForm.productSize.height" class="bags_dimension" placeholder="高" @input="judgeSize(baseForm.productSize.height)" />
                        <span class="guige-sign">mm</span>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="需求描述" prop="desc1">
                    <el-input class="inputs" type="textarea" :rows="4" placeholder="说明包装的结构及尺寸要求，商品形态，商品包装个数要求，注意放置方向，想要的设计风格等" resize="none" v-model="baseForm.desc1" @change="inputChange"> </el-input>
                  </el-form-item>
                  <el-form-item label="客户文件">
                    <div style="width:340px">
                      <el-upload
                        class="upload-demo"
                        multiple
                        :headers="headers"
                        action="/api/consumer/designer/miniPackOut/uploadFile?file=taskDesignerpdf"
                        :before-upload="file => beforeUploadFile(file, 'pdf')"
                        :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList)"
                        :on-remove="(file, fileList) => handleRemove(file, fileList)"
                      >
                        <div class="upLoading">
                          <i style="margin-right: 10px;" class="el-icon-upload2"></i>
                          <span>点击上传文件</span>
                        </div>
                        <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                        <div slot="tip" class="upWords el-upload__tip">注：请上传能表达您的需求的文件，可支持多文件上传</div>
                      </el-upload>
                    </div>
                  </el-form-item>
                  <el-form-item label="合规性文件">
                    <div class="curstomFiles">
                      <div class="opt layui-form">
                        <el-radio>{{ defaultDoc.companyname }}</el-radio>
                      </div>
                      <div class="btns">
                        <button class="m_btn" @click.prevent="isDocListVisible = true">使用其他合规性文件</button>
                      </div>
                    </div>
                    <p class="tips">注：若您要求的设计中有注册商标内容请务必上传商标信息及授权书</p>
                  </el-form-item>
                </el-form>
              </ul>
              <div v-show="tabType === '1'" style="margin-top:24px">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="143px" class="demo-ruleForm">
                  <el-form-item label="设计种类" prop="name">
                    <ul>
                      <li class="li_one">
                        <ul class="mounts">
                          <li :class="wordstype == 1 ? 'active' : ''" @click="selctDesign(1)">
                            <p class="words">方案设计</p>
                            <p class="words_bottom">提供商品样品</p>
                          </li>
                          <li :class="wordstype == 2 ? 'active' : ''" @click="selctDesign(2)">
                            <p class="words">平面设计</p>
                            <p class="words_bottom">提供参照盒子样品</p>
                          </li>
                          <li :class="wordstype == 3 ? 'active' : ''" @click="selctDesign(3)">
                            <p class="words">平面设计</p>
                            <p class="words_bottom">提供参照客户文件</p>
                          </li>
                        </ul>
                      </li>
                      <p class="tips">{{ wordsTxt }}</p>
                    </ul>
                  </el-form-item>
                  <el-form-item label="需求描述" prop="desc">
                    <el-input class="inputs" type="textarea" :rows="4" placeholder="说明包装的结构及尺寸要求，商品形态，商品包装个数要求，注意放置方向，想要的设计风格等" resize="none" v-model="ruleForm.desc" @change="inputChange"> </el-input>
                  </el-form-item>
                  <el-form-item label="客户文件">
                    <div style="width:340px">
                      <el-upload
                        class="upload-demo"
                        multiple
                        :headers="headers"
                        action="/api/consumer/designer/miniPackOut/uploadFile?file=taskDesignerpdf"
                        :before-upload="file => beforeUploadFile(file, 'pdf')"
                        :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList)"
                        :on-remove="(file, fileList) => handleRemove(file, fileList)"
                      >
                        <div class="upLoading">
                          <i style="margin-right: 10px;" class="el-icon-upload2"></i>
                          <span>点击上传文件</span>
                        </div>
                        <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                        <div slot="tip" class="upWords el-upload__tip">注：请上传能表达您的需求的文件，可支持多文件上传</div>
                      </el-upload>
                    </div>
                  </el-form-item>
                  <el-form-item label="合规性文件">
                    <div class="curstomFiles">
                      <div class="opt layui-form">
                        <el-radio>{{ defaultDoc.companyname }}</el-radio>
                      </div>
                      <div class="btns">
                        <button class="m_btn" @click.prevent="isDocListVisible = true">使用其他合规性文件</button>
                      </div>
                    </div>
                    <p class="tips">注：若您要求的设计中有注册商标内容请务必上传商标信息及授权书</p>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
          <div class="guigeRt">
            <div class="guigeRtWrap">
              <h2 class="guigeRtH2">设计类型：原创设计</h2>
              <div class="geRtList">
                <h4>打样店地址</h4>
                <div class="dayC7">
                  <p>地址：广东省.佛山市.南海区里水镇麻奢后街傲彩包装产业园A栋打样店A5门</p>
                  <p>联系人：杜思诗 18218517565</p>
                  <p v-if="tabType === '1'">如您材质太特殊需加工定做，需您提供打样材料或按加工定做费用补齐差价；</p>
                </div>
              </div>
            </div>
            <div class="geRtList">
              <h4>温馨提示</h4>
              <div class="geRtSection">
                <p v-if="tabType === '0'" style="color: red;font-size: 12px;padding-bottom: 10px">1、 原创设计单价300元/个，免费打成品样1个</p>
                <p v-else style="color: red;font-size: 12px;padding-bottom: 10px">1、原创方案设计单价1000元，原创平面设计500元，免费打成品样2个</p>
                <p style="color: red;font-size: 12px;padding-bottom: 10px">
                  2、 原创设计是专门为傲彩客户提供的增值服务，只提供给客户照片或PPT文档，收取的费用低于成本价，旨在促成大货订单,故用于生产的源文件仅用于在傲彩下大货使用，恕不对外提供，不便之处，敬请理解。
                </p>
                <p>3、 周日休息，订单顺延至下周一处理，请提前下单，带来不便请见谅。</p>
              </div>
            </div>
            <div class="geRtList">
              <p class="flex geRtotal">
                总计:<span id="price_total">￥{{ totalPrice }}</span>
              </p>
              <div class="flex geRtBtnDv">
                <a href="javascript:void(0)" class="getBuy gobtn" @click="submitOrder()">立即下单</a>
              </div>
            </div>
          </div>
        </div>
        <login-form :dialogVisible.sync="showLoginDialog"></login-form>
      </el-col>
    </el-row>
    <user-document-list :dialogTableVisible="isDocListVisible" @addDoc="showDo" @showListDialog="changeDocList"></user-document-list>
    <user-document-dialog :dialogVisible="isDocVisible" @showDialog="changeDocVisible"></user-document-dialog>
  </div>
</template>

<script>
import UserDocumentDialog from '@/views/cart/userDocumentDialog/index';
import UserDocumentList from '@/views/cart/userDocumentList/index';
import LoginForm from '@/components/common/LoginForm';
import { findCategoryById } from '@/api/category/categoryApi';
import { addOriginalDesignOrder } from '@/api/cart/cartCheckProofApi';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { getDefault } from '@/api/users/userComDocumentsApi';
import { setdecimal } from '@/utils/utils';
export default {
  components: {
    LoginForm,
    'user-document-dialog': UserDocumentDialog,
    'user-document-list': UserDocumentList
  },
  data() {
    return {
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      // 资质弹窗是否显示
      isDocVisible: false,
      textarea: '',
      // 资质列表弹窗是否显示
      isDocListVisible: false,
      wordsTxt: '注：请邮寄您的商品样品给到我们，设计师将会按商品样品进行包装方案原创设计，并免费赠送打样',
      wordstype: 1,
      ruleForm: {
        name: '',
        desc: ''
      },
      baseForm: {
        desc1: '',
        chooseCategory: '-1',
        productSize: {
          lengths: '',
          width: '',
          height: ''
        }
      },
      rules: {
        name: [{ required: true }],
        // region: [{ required: true, message: '请输入需求描述' }],
        desc: [{ required: true, message: '请输入需求描述', trigger: 'blur' }],
        desc1: [{ required: true, message: '请输入需求描述', trigger: 'blur' }],
        chooseCategory: [{ required: true, message: '请选择盒型', trigger: 'blur' }]
        // productSize: [{ required: true, message: '请输入成品尺寸', trigger: 'blur' }]
      },
      tabType: '0',
      subCateList: [],
      chooseCategory: '-1',
      chooseCategoryId: 0,
      chooseName: '',
      number: 1,
      totalPrice: 0,
      length: '',
      width: '',
      height: '',
      showLoginDialog: false,
      defaultDoc: '',
      comDocumentsId: 0, //合规性文件Id
      imgList1: [],
      imgList: []
    };
  },
  created() {
    this.findCategoryById();
    this.getDefaultDoc();
  },

  methods: {
    showPrice(price) {
      if (this.ruleForm.desc != '' && this.ruleForm.desc != null) {
        if (!localStorage.getItem(ACCESS_TOKEN)) {
          this.showLoginDialog = true;
          return false;
        }
        this.totalPrice = price;
      } else {
        this.totalPrice = 0;
      }
    },
    selctDesign(type) {
      this.wordstype = type;
      if (type == 1) {
        this.wordsTxt = '注：请邮寄您的商品样品给到我们，设计师将会按商品样品进行包装方案原创设计，并免费赠送打样';
        this.showPrice(1000);
      } else if (type == 2) {
        this.wordsTxt = '注：请邮寄您的盒子样品给到我们，设计师将会按照盒子的结构进行平面设计，并免费赠送打样';
        this.showPrice(500);
      } else {
        this.wordsTxt = '注：请上传您的客户文件给到我们，设计师会按照客户文件的结构进行平面设计，并免费赠送打样';
        this.showPrice(500);
      }
    },
    inputChange() {
      // console.log('baseForm.desc1', this.baseForm.desc1, this.baseForm.desc1 === null);
      if (this.tabType == '0') {
        this.imputedPrice();
      } else {
        if (this.wordstype == 1) {
          this.showPrice(1000);
        } else {
          this.showPrice(500);
        }
      }
    },
    //上传文件的判断
    beforeUploadFile(file, type) {
      var fileName = file.name;
      // const fileSize = file.size / 1024 / 1024 < 50;
      // console.log('type333', type);
      // if (type == 'pdf') {
      //   const reg = /\.(psd|pdf|cdr)$/;
      //   const extension = reg.test(fileName);
      //   if (!extension) {
      //     this.$message({
      //       message: '上传文件只能是 ai、psd、pdf、cdr格式!',
      //       type: 'warning'
      //     });
      //   }
      //   // if (!fileSize) {
      //   //   this.$message({
      //   //     message: '上传文件大小不能超过 50MB!',
      //   //     type: 'warning'
      //   //   });
      //   // }
      //   return extension;
      // }
      // else {
      //   const reg1 = /\.(jpg|png)$/;
      //   const extension1 = reg1.test(fileName);
      //   if (!extension1) {
      //     this.$message({
      //       message: '上传文件只能是 jpg、png格式!',
      //       type: 'warning'
      //     });
      //   }
      //   return extension1;
      // }

      // return extension && fileSize;
    },
    //上传成功的方法
    uploadSuccess(response, file, fileList, type, fId) {
      // console.log(file);
      if (this.tabType == '0') {
        this.imgList1.push(response.data);
      } else {
        this.imgList.push(response.data);
      }
      // console.log('this.imgList1', this.imgList1);
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      // console.log('handleRemove--fileList', fileList);
      if (this.tabType == '0') {
        this.imgList1 = [];
        fileList.map(item => {
          this.imgList1.push(item.response.data);
        });
      } else {
        this.imgList = [];
        fileList.map(item => {
          this.imgList.push(item.response.data);
        });
      }
      // console.log('this.imgList3333', this.imgList);
    },
    changeDocList() {
      if (this.isDocListVisible) {
        this.isDocListVisible = !this.isDocListVisible;
        if (!this.isDocListVisible) {
          this.getDefaultDoc();
        }
      }
    },
    showDo() {
      // 关闭窗口
      this.isDocListVisible = false;
      // 显示上传文件窗口
      this.isDocVisible = true;
    },
    changeDocVisible() {
      if (this.isDocVisible) {
        this.isDocVisible = !this.isDocVisible;
        this.getDefaultDoc();
      }
    },
    // 获取默认用户资质
    getDefaultDoc() {
      if (!localStorage.getItem(ACCESS_TOKEN)) {
        this.showLoginDialog = true;
        return false;
      }
      getDefault()
        .then(res => {
          // console.log('3333', res);
          this.comDocumentsId = res.data.id;
          if (res.code === '000000') {
            this.defaultDoc = res.data;
          } else {
            this.defaultDoc = '';
          }
        })
        .catch(error => {
          console.log(error.message);
        });
    },
    findCategoryById() {
      let params = {
        pid: 1,
        proofStatus: 1,
        status: 1
      };
      findCategoryById(params).then(res => {
        this.subCateList = res.data;
        // console.log(res.data);
      });
    },
    // numberChange() {
    //   if (!/(^[1-9]\d*$)/.test(this.number)) {
    //     this.totalPrice = 0;
    //     this.$message({
    //       type: 'error',
    //       message: '设计数量请输入整数!'
    //     });
    //     return false;
    //   }
    //   if (this.number > 10) {
    //     this.number = 10;
    //     this.$message({
    //       type: 'error',
    //       message: '设计数量请不能超过10!'
    //     });
    //   }
    //   this.imputedPrice();
    // },
    subCateChange(index) {
      if (index == -1) {
        this.chooseName = '';
        this.chooseCategoryId = 0;
        this.totalPrice = 0;
        return false;
      } else {
        // console.log('chooseCategory', this.subCateList[index]);
        this.chooseName = this.subCateList[index].name;
        this.chooseCategoryId = this.subCateList[index].id;
      }
      this.imputedPrice();
    },
    imputedPrice() {
      // console.log('totalPrice', this.totalPrice);

      // if (this.number == 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '请输入设计数量!'
      //   });
      //   return false;
      // }
      if (this.chooseCategoryId == 0) {
        this.totalPrice = 0;
        return false;
      }
      // if (!this.baseForm.productSize.lengths || !this.baseForm.productSize.width || !this.baseForm.productSize.height) {
      //   this.totalPrice = 0;
      //   return false;
      // }
      // console.log('this.baseForm.productSize', this.baseForm.productSize);
      if (this.baseForm.desc1 == '' || this.baseForm.desc1 == null) {
        this.totalPrice = 0;
        return false;
      }
      if (!localStorage.getItem(ACCESS_TOKEN)) {
        this.showLoginDialog = true;
        return false;
      }
      this.totalPrice = this.number * 300;
    },
    judgeSize(number) {
      if (isNaN(number) || number * 1 < 1) {
        this.$message({
          type: 'error',
          message: '尺寸请输入正确的数值!'
        });
        this.totalPrice = 0;
        return false;
      }
      // this.imputedPrice();
    },
    originalDesign(type) {
      this.tabType = type;
      if (this.tabType == '1') {
        this.inputChange();
      } else {
        if (this.number !== 0 || this.number !== null || this.number !== '') {
          this.imputedPrice();
        } else {
          this.totalPrice = 0;
        }
      }
      // 用户行为记录
      this.$report({
        channel: 112000,
        actionId: this.tabType == '0' ? 2 : 3
      });
    },
    submitOrder() {
      if (!localStorage.getItem(ACCESS_TOKEN)) {
        this.showLoginDialog = true;
        return false;
      }
      let params;
      if (this.tabType === '0') {
        if (this.chooseCategoryId == 0) {
          this.$message({
            type: 'error',
            message: '请选择盒型!'
          });
          return false;
        }
        if (this.baseForm.desc1 == '' || this.baseForm.desc1 == null) {
          this.$message({
            type: 'error',
            message: '请输入需求描述!'
          });
          return false;
        }
        if (this.number == 0) {
          this.$message({
            type: 'error',
            message: '请输入设计数量!'
          });
          return false;
        }
        if (!/(^[1-9]\d*$)/.test(this.number)) {
          this.totalPrice = 0;
          this.$message({
            type: 'error',
            message: '设计数量请输入整数!'
          });
          return false;
        }

        var strVal = '';
        // if (this.length || this.width || this.height) {
        if (this.baseForm.productSize.lengths || this.baseForm.productSize.width || this.baseForm.productSize.height) {
          if (!this.baseForm.productSize.lengths || !this.baseForm.productSize.width || !this.baseForm.productSize.height) {
            this.$message({
              type: 'error',
              message: '请将尺寸填写完整后再提交!'
            });
            return false;
          }
          if (isNaN(this.baseForm.productSize.lengths) || this.baseForm.productSize.lengths * 1 < 1) {
            this.$message({
              type: 'error',
              message: '尺寸请输入正确的数值!'
            });
            return false;
          }
          if (isNaN(this.baseForm.productSize.width) || this.baseForm.productSize.width * 1 < 1) {
            this.$message({
              type: 'error',
              message: '尺寸请输入正确的数值!'
            });
            return false;
          }
          if (isNaN(this.baseForm.productSize.height) || this.baseForm.productSize.height * 1 < 1) {
            this.$message({
              type: 'error',
              message: '尺寸请输入正确的数值!'
            });
            return false;
          }
          strVal = '成品尺寸:' + setdecimal(this.baseForm.productSize.lengths) + '_' + setdecimal(this.baseForm.productSize.width) + '_' + setdecimal(this.baseForm.productSize.height) + ';';
          // strVal = '成品尺寸:' + this.length + '_' + this.width + '_' + this.height + ';';
        }
        //  else {
        //   this.$message({
        //     type: 'error',
        //     message: '请输入成品尺寸!'
        //   });
        //   return false;
        // }
        // console.log(this.chooseCategoryId);
        params = {
          cateId: this.chooseCategoryId, //盒型
          number: this.number, //数量
          comDocumentsId: this.comDocumentsId, //合规性文件Id
          orderType: 10, //订单类别10.原创设计订单(平面设计) 6.结构设计 7.方案设计 9精装盒原创设计订单
          openSize: strVal, //成品尺寸
          imgList: this.imgList1, //商品图片
          memo: this.baseForm.desc1 //描述
        };
      } else if (this.tabType === '1') {
        if (this.ruleForm.desc == '' || this.ruleForm.desc == null) {
          this.$message({
            type: 'error',
            message: '请输入需求描述!'
          });
          return false;
        }
        if (this.wordstype == 3 && this.imgList.length == 0) {
          this.$message({
            type: 'error',
            message: '请上传客户文件!'
          });
          return false;
        }
        params = {
          cateId: 0, //盒型
          number: 1, //数量
          comDocumentsId: this.comDocumentsId, //合规性文件Id
          hardcoverKind: this.wordstype, //精装盒设计类开型1方案设计2平面设计参照盒子样品3平面设计客户文件
          orderType: 9, //订单类别5.原创设计订单(平面设计) 6.结构设计 7.方案设计 9精装盒原创设计订单
          imgList: this.imgList, //商品图片
          memo: this.ruleForm.desc //描述
        };
      }
      this.$report({
        channel: 112000,
        actionId: this.tabType == '0' ? 4 : 5,
        params: {
          price: this.totalPrice
        }
      });
      addOriginalDesignOrder(params).then(res => {
        // console.log(res);
        this.$router.push({ path: '/service/originalGetpay', query: { orderNo: res.data.orderNo, subOrderId: res.data.subOrderNo } });
      });
    }
  }
};
</script>
<style scoped>
.car_ul li {
  width: 180px;
}
.mounts {
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
}
.mounts li {
  width: 140px;
  height: 70px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #dcdfe6;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}
.mounts li:hover {
  cursor: pointer;
}
.mounts li.active {
  border: 1px solid #ff0000;
}
.mounts .words {
  height: 28px;
  color: #333;
}
.mounts .words_bottom {
  height: 28px;
  color: #777;
}
.cardtabB .inputs {
  width: 669px;
}
.cardtabB .upLoading {
  width: 110px;
  height: 30px;
  line-height: 30px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #ff0000;
  color: #ff0000;
  font-size: 12px;
  /* margin-top: 20px; */
}
.cardtabB .upWords {
  font-size: 14px;
  color: #999;
  margin-top: 0;
}
.tips {
  color: #999;
}
</style>
<style>
.curstomFiles .el-radio__input.is-checked .el-radio__inner {
  border-color: #d0111b;
  background: #d0111b;
}
.curstomFiles .el-radio__input.is-checked + .el-radio__label {
  color: #666;
}
.curstomFiles .m_btn {
  width: 126px;
  height: 30px;
  background: #fcfcfc;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  font-size: 12px;
  color: #666;
}
.guigeLabel {
  padding-right: 10px;
}
</style>

<!-- fengjianbo -->
<template>
  <el-main>
    <div class="useMainRt">
      <div class="or_tipsT">
        <h5>友情提醒：</h5>
        <p>1、用CorelDRAW 软件设计的文件请导出PDF格式上传文件，否则CDR格式文件会延时处理，因CDR格式文件产生的质量问题由客户自行承担</p>
        <p>2、如您的设计文件中有"R"或"TM"的商标，请务必提供商标注册复印件和授权委托书（<router-link :to="'/news/detail?id=92'">样本</router-link>），以免耽误您订单印刷</p>
        <p>3、如您的设计文件中使用了三色或四色混合(浅灰、灰、深灰、黑)、暗红色、墨绿色、蓝紫色、深紫色、深褐色、咖啡色等，建议您先在本平台打样跟色，否则，出现色差平台概不负责。</p>
        <p>4、因为屏幕为RGB格式，印刷为CMYK格式，3D颜色仅供参考，不作为大货验收颜色。</p>
        <p>5、设计文件为CDR文件，因软件版本差异可能存在显示不统一的情况，为保证生产正确性需再上传jpg/png图片格式的设计稿用于校验。<router-link :to="'/uploads/editor/file/CDR_Tutorials.pdf'" target="_blank">查看教程</router-link></p>
      </div>
      <!--订单进度-->
      <div class="barBox">
        <ul class="barBoxT">
          <li class="flex bFirst">
            <div class="barList a1">
              <h3>提交询价单</h3>
              <div class="stepNo">1</div>
              <p v-text="orderInfo.createTime"></p>
            </div>
            <div class="barList a2">
              <h3>生成报价单</h3>
              <div class="stepNo">2</div>
              <p></p>
            </div>
            <div class="barList a3">
              <h3>付款成功</h3>
              <div class="stepNo">3</div>
              <p></p>
            </div>
            <div class="barList a4">
              <h3>发货成功</h3>
              <div class="stepNo">4</div>
              <p></p>
            </div>
            <div class="barList a5">
              <h3>收货成功</h3>
              <div class="stepNo">5</div>
              <p></p>
            </div>
          </li>
        </ul>
        <div class="ofBox" v-if="orderInfo.status === 'nopaid'">
          <h6>
            当前订单状态： <span class="org">下单成功</span>，请及时付款
            <a @click="toPayCheckorder" target="_blank" class="saveBtns saveImg1" style="left:10px;width:82px;">立即付款</a>
          </h6>
        </div>
      </div>
      <!--订单信息-->
      <div class="infoBox">
        <div :class="switchTopShow == 0 ? 'infoBoxTop' : 'infoBoxTops'" @click="switchTopShow = 0"><a>订单详情</a></div>
        <div :class="switchTopShow == 1 ? 'infoBoxTop' : 'infoBoxTops'" @click="switchTopShow = 1"><a>订单进度</a></div>
        <div class="infoBox_cont">
          <template v-if="switchTopShow == 0">
            <ul class="flex inforUl">
              <li>
                <h3>基本信息</h3>
                <p class="inp">
                  <label class="inpL">订单号：</label>
                  <span class="inpR" v-text="orderInfo.orderNo"></span>
                </p>
                <p class="inp">
                  <label class="inpL">支付方式：</label>
                  <span class="inpR" v-if="orderInfo.payType === 'alipay'">支付宝</span>
                  <span class="inpR" v-else-if="orderInfo.payType === 'wxpay'">微信</span>
                  <span class="inpR" v-else>其它</span>
                </p>
                <p class="inp">
                  <label class="inpL">配送方式：</label>
                  <span class="inpR" v-text="orderInfo.shippingName"></span>
                </p>
                <p class="inp">
                  <label class="inpL">收货地址：</label>
                  <span class="inpR">{{ orderInfo.consigneeName }} {{ orderInfo.mobile }} {{ orderInfo.province }} {{ orderInfo.city }} {{ orderInfo.county }} {{ orderInfo.address }} </span>
                </p>
                <p class="inp">
                  <label class="inpL">订单备注：</label>
                  <span class="inpR" v-text="orderInfo.memo"></span>
                </p>
                <p class="inp">
                  <label class="inpL">发票：</label>
                  <span class="inpR"> </span>
                </p>
                <table class="Consignee_List" v-if="activeMiniInvocieExist">
                  <tr>
                    <td class="left_Consignee" style="width:100px">发票类型</td>
                    <td class="right_Consignee" v-if="miniInvoiceVo.invoiceType === 1">增值税发票</td>
                    <td v-else>普通发票</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">发票抬头</td>
                    <td class="right_Consignee">{{ miniInvoiceVo.invoiceName }}</td>
                  </tr>
                  <tbody v-if="miniInvoiceVo.invoiceType === 1">
                    <tr>
                      <td
                        class="left_Consi
                    gnee"
                      >
                        单位名称
                      </td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceName"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">纳税人码</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.invoiceCode"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">注册地址</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.invoiceAddress"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">注册电话</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.mobile"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">开户银行</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.invoiceBank"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">银行账户</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.invoiceBankcode"></td>
                    </tr>
                  </tbody>
                </table>
                <table class="Consignee_List" v-else>
                  <tr>
                    <td colspan="2">不开发票</td>
                  </tr>
                </table>
              </li>
              <li>
                <h3>合规文件</h3>
                <div class="compbox" v-if="miniComDocumentsVo != null">
                  <form action="" method="post" id="picform">
                    <div class="inp">
                      <template v-if="miniComDocumentsVo.companyname != null && miniComDocumentsVo.companyname != ''">
                        <label class="compLa">营业执照名称：</label>
                        <span class="disedTxt" v-text="miniComDocumentsVo.companyname"></span>
                        <input type="hidden" name="companyname" v-model="miniComDocumentsVo.companyname" />
                      </template>
                      <template v-else>
                        <label class="compLa">营业执照名称：</label>
                        <input type="text" class="compInput" name="companyname" v-model="companyName" />
                      </template>
                      <template v-if="miniComDocumentsVo.companyimg != null && miniComDocumentsVo.companyimg != ''">
                        <span class="leftPic"
                          ><a :href="baseUrl + miniComDocumentsVo.companyimg" target="_blank"><img src="../../static/index/img/picture.png"/></a
                        ></span>
                        <input type="hidden" name="companyimg" v-text="miniComDocumentsVo.companyimg" />
                      </template>
                      <template v-else>
                        <p>
                          <span class="pass-portrait-openimg-1025">
                            <el-upload
                              class="uploadCompanyimg"
                              :headers="headers"
                              action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
                              :before-upload="beforeUploadImg"
                              :on-success="(response, file, fileList) => uploadImgSuccess('companyimg', response, file, fileList)"
                              :on-error="uploadError"
                              :data="uploadDocData"
                              accept=".png,.jpeg,.jpg,.gif,.bmp"
                            >
                              <el-button size="small" type="primary" class="filesBnt">上传文件</el-button>
                            </el-upload>
                          </span>
                        </p>
                      </template>
                    </div>
                    <div class="inp">
                      <template v-if="miniComDocumentsVo.brandname != null && miniComDocumentsVo.brandname != ''">
                        <label class="compLa">品牌名称：</label>
                        <span class="disedTxt" v-text="miniComDocumentsVo.brandname"></span>
                        <input type="hidden" name="brandname" v-model="miniComDocumentsVo.brandname" />
                      </template>
                      <template v-else>
                        <label class="compLa">品牌名称：</label>
                        <input type="text" class="compInput" name="brandname" v-model="brandName" />
                      </template>
                      <template v-if="miniComDocumentsVo.brandimg != null && miniComDocumentsVo.brandimg != ''">
                        <span class="leftPic"
                          ><a :href="baseUrl + miniComDocumentsVo.brandimg" target="_blank"><img src="../../static/index/img/picture.png"/></a
                        ></span>
                        <input type="hidden" name="brandimg" v-text="miniComDocumentsVo.brandimg" />
                      </template>
                      <template v-else>
                        <p>
                          <span class="pass-portrait-openimg-1025">
                            <el-upload
                              class="uploadBrandname"
                              :headers="headers"
                              action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
                              :before-upload="beforeUploadImg"
                              :on-success="(response, file, fileList) => uploadImgSuccess('brandimg', response, file, fileList)"
                              :on-error="uploadError"
                              :data="uploadDocData"
                              accept=".png,.jpeg,.jpg,.gif,.bmp"
                            >
                              <el-button size="small" type="primary" class="filesBnt">上传文件</el-button>
                            </el-upload>
                          </span>
                        </p>
                      </template>
                    </div>
                    <div class="inp">
                      <template v-if="miniComDocumentsVo.codename != null && miniComDocumentsVo.codename != ''">
                        <label class="compLa">条形码：</label>
                        <span class="disedTxt" v-text="miniComDocumentsVo.codename"></span>
                        <input type="hidden" name="codename" v-model="miniComDocumentsVo.codename" />
                      </template>
                      <template v-else>
                        <label class="compLa">条形码：</label>
                        <input type="text" class="compInput" name="codename" v-model="codeName" />
                      </template>
                      <template v-if="miniComDocumentsVo.codeimg != null && miniComDocumentsVo.codeimg != ''">
                        <span class="leftPic"
                          ><a :href="baseUrl + miniComDocumentsVo.codeimg" target="_blank"><img src="../../static/index/img/picture.png"/></a
                        ></span>
                        <input type="hidden" name="codeimg" v-model="miniComDocumentsVo.codeimg" />
                      </template>
                      <template v-else>
                        <p>
                          <span class="pass-portrait-openimg-1025">
                            <el-upload
                              class="uploadCodename"
                              :headers="headers"
                              action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
                              :before-upload="beforeUploadImg"
                              :on-success="(response, file, fileList) => uploadImgSuccess('codeimg', response, file, fileList)"
                              :on-error="uploadError"
                              :data="uploadDocData"
                              accept=".png,.jpeg,.jpg,.gif,.bmp"
                            >
                              <el-button size="small" type="primary" class="filesBnt">上传文件</el-button>
                            </el-upload>
                          </span>
                        </p>
                      </template>
                    </div>
                    <div
                      class="inp"
                      v-if="
                        miniComDocumentsVo.companyname === null ||
                          miniComDocumentsVo.companyname === '' ||
                          miniComDocumentsVo.companyimg === null ||
                          miniComDocumentsVo.companyimg === '' ||
                          miniComDocumentsVo.brandname === null ||
                          miniComDocumentsVo.brandname === '' ||
                          miniComDocumentsVo.brandimg === null ||
                          miniComDocumentsVo.brandimg === '' ||
                          miniComDocumentsVo.codename === null ||
                          miniComDocumentsVo.codename === '' ||
                          miniComDocumentsVo.codeimg === null ||
                          miniComDocumentsVo.codeimg === ''
                      "
                    >
                      <input type="button" class="saveBtns saveImg1" style="background-color:#eee;border-color:#cacaca;color:#666;" @click="addDocument" value="保存" />
                    </div>
                  </form>
                </div>
              </li>
            </ul>
            <template v-if="miniDiffOrder">
              <ul class="flex inforUl" v-for="diff in miniDiffOrder" :key="diff.id">
                <li>
                  <h3>补差价订单</h3>
                  <p class="inp">
                    <span class="inpL">差价单号：</span>
                    <span class="inpR" v-text="diff.orderNo"></span>
                  </p>
                  <p class="inp">
                    <span class="inpL">差价金额：</span>
                    <span class="inpR" v-text="diff.diffMoney"></span>
                  </p>
                  <p class="inp">
                    <span class="inpL">差价描述：</span>
                    <span class="inpR" v-text="diff.diffDesc"></span>
                  </p>
                  <p class="inp">
                    <span class="inpL">支付状态：</span>
                    <span class="inpR" v-if="diff.status === 'paid'">
                      已支付
                    </span>
                    <span class="red" v-else>
                      未支付
                    </span>
                  </p>
                  <p class="inp" v-if="diff.status != 'paid'">
                    <span class="inpL"> <el-button size="mini" @click="toPayDiffOrder(diff.orderNo)">去付款</el-button></span>
                  </p>
                </li>
              </ul>
            </template>
            <div class="use_listBox">
              <ul class="detailds">
                <ol class="itemListZ">
                  <span class="t1">货品</span>
                  <span class="t2">文件</span>
                  <span class="t3">单价(元)</span>
                  <span class="t4">数量(个)</span>
                  <span class="t5">货品总价(元)</span>
                </ol>
                <li class="ttBox">
                  <div class="itemaBox">
                    <div class="itema" v-for="goods in orderGoods" :key="goods.id">
                      <div class="s1">
                        <dl class="flex orderInfoDL">
                          <dt class="DLimg"><img v-bind:src="goods.coverPath" /></dt>
                          <dd class="orderInfo_t">
                            <h6>
                              <a href="" target="_blank" v-if="!goods.customName" v-text="goods.name"> </a>
                              <a href="" target="_blank" v-else v-text="goods.customName"></a>
                            </h6>
                            <p class="orderInfo_tC C9" title="" v-text="goods.goodsAttr"></p>
                            <p class="red" v-if="goods.goodsId != 1546 && goods.goodsId != 1547 && goods.goodsId != 1548 && goods.goodsId != 1549 && goods.goodsId != 1550">生产货期：{{ goods.day * 24 }}小时 ({{ goods.day }}天)</p>
                          </dd>
                        </dl>
                      </div>
                      <div class="s2">
                        <div class="s2div">
                          <a v-bind:href="baseUrl + png" target="_blank">[查看上传文件]</a><br />
                          <span class="gree">文件未确认</span>
                        </div>
                      </div>
                      <div class="s3">{{ goods.price }}元</div>
                      <div class="s4">{{ goods.num }}</div>
                    </div>
                  </div>
                  <div class="s5">{{ orderInfo.goodsAmount }}</div>
                </li>
              </ul>
              <div class="mo_money">
                <div v-if="orderInfo.bonusMoney > 0 && orderInfo.bonusUseType === 0">
                  <p>抵现金额：-{{ orderInfo.bonusMoney }} 元</p>
                </div>
                <p>运费：{{ orderInfo.shippingFee }}元</p>
                <p>
                  订单金额：<b class="red mo_moneyB">{{ orderInfo.amount - (orderInfo.bonusUseType == 1 ? 0 : orderInfo.bonusMoney) }}</b> 元
                </p>
              </div>
            </div>
          </template>
          <ul class="flex inforUl" v-if="switchTopShow == 1">
            <li style="width:100%;">
              <h3>订单进度</h3>
              <div class="inlogBox">
                <table class="Consignee_List">
                  <div style="margin-bottom: 5px">
                    <el-radio-group v-model="radio1" @change="selectedPOsn" text-color="#ff0036" fill="#ff0036">
                      <el-radio-button v-for="(vo, index) in orderGoods" :key="index" :label="index"> {{ vo.customName ? vo.customName : vo.name }} 进度</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div>
                    <tr>
                      <td width="100px">快递公司</td>
                      <td width="90%" v-if="currentTrackRecords.expressNo">{{ currentTrackRecords.miniOrderGoodsShipment['expressType'] }}</td>
                      <td width="90%" v-else>未发货</td>
                    </tr>
                    <tr>
                      <td>配送方式</td>
                      <td v-if="orderInfo.shippingName">{{ orderInfo.shippingName }}</td>
                      <td v-else>未发货</td>
                    </tr>
                    <tr>
                      <td>快递单号</td>
                      <td v-if="currentTrackRecords.expressNo">{{ currentTrackRecords.expressNo }}</td>
                      <td v-else>未发货</td>
                    </tr>
                    <!--物流追踪信息-->
                    <tr v-show="trackRecords">
                      <td colspan="2">
                        <div id="map" style="max-height: 320px;overflow:auto;">
                          <el-timeline class="trackBox" :reverse="reverse">
                            <template v-for="(trackInfo, index) in currentTrackRecords.trackRecord">
                              <el-timeline-item size="large" :key="index" :timestamp="formatSecond(trackInfo.trackTime)" v-if="index == 0" icon="el-icon-truck">
                                {{ trackInfo.trackDetail }}
                              </el-timeline-item>
                              <el-timeline-item size="large" :key="index" v-else :timestamp="formatSecond(trackInfo.trackTime)">
                                {{ trackInfo.trackDetail }}
                              </el-timeline-item>
                            </template>
                            <el-timeline-item v-for="(trackInfos, indexs) in currentTrackRecords.factoryRecord" :timestamp="trackInfos.machining_time" size="large" :key="'pppp' + indexs">
                              {{ trackInfos.machining_name }}
                            </el-timeline-item>
                          </el-timeline>
                        </div>
                      </td>
                    </tr>
                  </div>
                </table>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import { confirmSample, confirmHardcover, confirmBliter, fileLookStatus } from '@/api/order/supplierOrdersApi';
import { getAllProofOrder } from '@/api/users/userDemandApi';
import { formatSecond } from '@/utils/timeUtil';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { cancelConfirmFile, addDoc, modifityPdfNote } from '@/api/order/orderApi';
import { encodeUrlSpecial, downloadOrView } from '@/utils/order/baseEncodeUrl';

export default {
  computed: {
    activeMiniInvocieExist: function() {
      if (this.miniInvoiceVo == null || Object.keys(this.miniInvoiceVo).length == 0 || this.miniInvoiceVo.invoiceType == null) {
        return false;
      } else {
        return true;
      }
    },
    activeCompanyName: function() {
      if (this.miniComDocumentsVo.companyname) {
        return this.miniComDocumentsVo.companyname;
      } else {
        return this.companyName;
      }
    },
    activeBrandName: function() {
      if (this.miniComDocumentsVo.brandname) {
        return this.miniComDocumentsVo.brandname;
      } else {
        return this.brandName;
      }
    },
    activeCodeName: function() {
      if (this.miniComDocumentsVo.codename) {
        return this.miniComDocumentsVo.codename;
      } else {
        return this.codeName;
      }
    }
  },
  data() {
    return {
      reverse: false,
      activities: [],
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      orderInfo: [],
      miniComDocumentsVo: [],
      adaptiveInfo: [],
      ordersRefundsInfo: [],
      orderGoods: [],
      miniInvoiceVo: [],
      trackRecords: [],
      miniDiffOrder: [],
      orderNo: '',
      imageUrl: '',
      sdrdialog: false,
      // 吸塑时间
      blisterCreateTime: 1587811952,
      // 精装盒时间
      hardcoverCreateTime: 1587571200,
      // 鼠标悬停
      tipHover: false,
      //
      companyName: '',
      brandName: '',
      codeName: '',
      uploadDocData: { folder: 'uploads/picture' },
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      fileUrl: 'http://alifile.xiaocaiyin.com/',
      // pdf 修改窗口
      dialogVisible: false,
      // pdf 数据
      pdfNotes: [],
      pdfDocId: '',
      diffDialog: false,
      po_sn: '',
      currentTrackRecords: [],
      radio1: 0,
      switchTopShow: 0,
      cdrid: ''
    };
  },
  created() {
    // console.log(this.$route.query.orderNo);
    this.orderNo = this.$route.query.id;
    this.getAllOrder(this.$route.query.id);
  },
  methods: {
    ...{ formatSecond, encodeUrlSpecial, downloadOrView },
    getAllOrder(orderNo) {
      const reqParam = {
        orderNo: orderNo
      };
      getAllProofOrder(reqParam)
        .then(res => {
          var _this = this;
          if (res.code === '000000') {
            this.$set(this, 'orderInfo', res.data);
            this.$set(this, 'miniComDocumentsVo', res.data.miniComDocumentsVo);
            this.$set(this, 'adaptiveInfo', res.data.adaptiveInfo);
            this.$set(this, 'ordersRefundsInfo', res.data.ordersRefundsInfo);
            this.$set(this, 'orderGoods', res.data.children);
            this.$set(this, 'miniInvoiceVo', res.data.miniInvoiceVo);
            this.$set(this, 'trackRecords', res.data.trackRecords);
            this.$set(this, 'miniDiffOrder', res.data.miniDiffOrder);
            // console.log('--------------- orderGoods -------------------');
            // console.log(encodeURI('#合成纸-四色--光胶-600个_reported.png'));
            // console.log('orderInfo', this.orderInfo);
            console.log(res.data.trackRecords);
            console.log(res.data.trackRecords[0]);
            console.log(res.data.children);
            console.log(res.data.children[0]);
            var po_sn = res.data.children[0].poSn;
            if (po_sn) {
              this.$set(this, 'currentTrackRecords', res.data.trackRecords[po_sn]);
              this.po_sn = po_sn;
            }
          } else {
            _this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选择po_sn获取物流信息
    selectedPOsn(index) {
      var po_sn = this.orderGoods[index].poSn;
      document.getElementById('map').scrollTop = 0;
      // console.log(po_sn);
      if (po_sn) {
        this.$set(this, 'currentTrackRecords', this.trackRecords[po_sn]);
      } else {
        this.$set(this, 'currentTrackRecords', []);
      }
    },
    //上传文件的判断
    beforeUpload(file) {
      var fileName = file.name;
      const reg = /\.(pdf|ai|cdr|psd|eps|dxf|jpg|tiff|png|gif|zip)$/;
      const extension = reg.test(fileName);
      const isLt2M = file.size / 1024 / 1024 <= 200;
      if (!extension) {
        this.$message({ type: 'error', message: "上传文件格式只能是 'pdf','ai','cdr','psd','eps','dxf','jpg','tiff', 'png', 'gif', 'zip'" });
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 200MB!');
      }
      return extension && isLt2M;
    },
    //上传成功的方法
    uploadSuccess(response, file, fileList, id) {
      if (response.code === '000000') {
        this.cdrid = id;
        console.log('第一个上传成功', id);
        if (file.name.lastIndexOf('.cdr') > -1) {
          console.log('yes');
          this.sdrdialog = true;
        }
        this.$message({
          type: 'success',
          message: '上传成功'
        });
        this.getAllOrder(this.orderNo);
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    //上传失败执行的方法
    uploadError(err, file, fileList) {
      this.$message({
        type: 'error',
        message: err
      });
    },
    // 去支付
    toPayCheckorder() {
      // debugger;
      let order = this.orderInfo;
      let invoiceType = order.miniInvoiceVo.invoiceType;
      // console.log('order', order);
      if (invoiceType === 1) {
        this.$router.push({ path: '/service/getinvoicepay', query: { orderNo: order.mainSn, paytype: 'normal' } });
      } else {
        this.$router.push({ path: '/service/getcylpay', query: { orderNo: order.mainSn, paytype: 'normal' } });
      }
    },
    orderDone(orderGoodsId, orderId, supOrderId) {
      this.$confirm(
        '尊敬的客户：因为屏幕为RGB格式，印刷为CMYK格式，3D颜色仅供参考，不作为大货验收颜色。请您认真检查订单文件、订单信息，订单的3D效果及文件内容和工艺内容，盒形结构， 一旦确认，印刷文件立刻进入上机生产，无法再做任何修改，并一律不处理文件产生的质量问题与退货退款，请您确保已经一 一仔细确认。',
        '确认文件操作声明！',
        {
          confirmButtonText: '是的，我已确认无误',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let param = {
            orderGoodsId: orderGoodsId,
            orderId: orderId,
            supOrderId: supOrderId
          };
          confirmSample(param).then(res => {
            // debugger;
            if (res.code == '000000') {
              this.$message({ type: 'success', message: res.message });
            } else {
              this.$message({ type: 'error', message: '失败' });
            }
            this.reflashGoods();
          });
        })
        .catch(() => {});
    },
    // 吸塑
    orderDoneByxisu(orderGoodsId, orderId, supOrderId) {
      // debugger;
      this.$confirm('尊敬的客户：请您认真检查样品质量， 一旦确认，立刻进入上机生产，无法再做任何修改，并一律不处理产生的质量问题与退货退款，请您确保已经一 一仔细确认。', '确认吸塑样品操作声明！', {
        confirmButtonText: '是的，我已确认无误',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = {
            orderGoodsId: orderGoodsId,
            orderId: orderId,
            supOrderId: supOrderId
          };
          confirmBliter(param).then(res => {
            if (res.code == '000000') {
              this.$message({ type: 'success', message: res.message });
            } else {
              this.$message({ type: 'error', message: '失败' });
            }
            this.reflashGoods();
          });
        })
        .catch(() => {});
    },
    //cdr
    sdrUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
      const whiteList = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error('上传图片只能是 jpg、png格式', 'error');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!');
      }
      return isLt2M && whiteList.indexOf(fileSuffix) > -1;
    },
    sdrSuccess(response, file, fileList) {
      if (response.success) {
        this.$message({
          type: 'success',
          message: '上传成功'
        });
        this.sdrdialog = false;
        this.getAllOrder(this.orderNo);
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    cdrPreview(file) {
      var fileName = file.name;
      const reg = /\.(jpg|png)$/;
      const extension = reg.test(fileName);
      const isLt2M = file.size / 1024 / 1024 <= 200;
      if (!extension) {
        this.$message({ type: 'error', message: "上传文件格式只能是 'jpg','png'" });
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 200MB!');
      }
      if (extension && isLt2M) {
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },
    upcdrimg(id) {
      console.log(id);
      this.cdrid = id;
      this.sdrdialog = true;
      this.imageUrl = '';
    },
    // 精装盒
    orderDoneBymic(orderGoodsId, orderId, supOrderId) {
      this.$confirm('尊敬的客户：请您认真检查样品质量， 一旦确认，立刻进入上机生产，无法再做任何修改，并一律不处理产生的质量问题与退货退款，请您确保已经一 一仔细确认。', '确认样品操作声明', {
        confirmButtonText: '是的，我已确认无误',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = {
            orderGoodsId: orderGoodsId,
            orderId: orderId,
            supOrderId: supOrderId
          };
          confirmHardcover(param).then(res => {
            if (res.code == '000000') {
              this.$message({ type: 'success', message: res.message });
            } else {
              this.$message({ type: 'error', message: '失败' });
            }
            this.reflashGoods();
          });
        })
        .catch(() => {});
    },
    cancelConfirmTime(id) {
      this.$confirm('确定要撤回确认文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var param = {
            data: id
          };
          cancelConfirmFile(param)
            .then(res => {
              if (res.code === '000000') {
                this.$message({
                  type: 'success',
                  message: res.message
                });
                this.getAllOrder(this.orderNo);
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    //上传文件的判断
    beforeUploadImg(file) {
      var fileName = file.name;
      const reg = /\.(png|jpeg|jpg|gif|bmp)$/;
      const extension = reg.test(fileName);
      const fileSize = file.size / 1024 / 1024 < 1;
      if (!extension) {
        this.$message({
          message: '上传文件只能是 png、jepg、jpg、gif、bmp格式!',
          type: 'warning'
        });
      }
      if (!fileSize) {
        this.$message({
          message: '上传文件大小不能超过 1MB!',
          type: 'warning'
        });
      }
      return extension && fileSize;
    },
    //上传成功的方法
    uploadImgSuccess(img, response, file, fileList) {
      if (response.code === '000000') {
        console.log('img,file', img, file);
        if (img === 'companyimg') {
          this.miniComDocumentsVo.companyimg = response.data;
        } else if (img === 'brandimg') {
          this.miniComDocumentsVo.brandimg = response.data;
        } else if (img === 'codeimg') {
          this.miniComDocumentsVo.codeimg = response.data;
        }
        this.$message({
          type: 'success',
          message: '上传成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    //添加修改共用方法
    addDocument() {
      if (this.companyname == '') {
        this.$message({
          type: 'error',
          message: '公司名称不能为空'
        });
        return false;
      }
      const reqParam = {
        miniComDocuments: {
          id: this.returnObjectEmpty(this.miniComDocumentsVo.id),
          name: this.returnObjectEmpty(this.miniComDocumentsVo.name),
          companyname: this.activeCompanyName,
          companyimg: this.returnObjectEmpty(this.miniComDocumentsVo.companyimg),
          brandname: this.activeBrandName,
          brandimg: this.returnObjectEmpty(this.miniComDocumentsVo.brandimg),
          codename: this.activeCodeName,
          codeimg: this.returnObjectEmpty(this.miniComDocumentsVo.codeimg)
        },
        orderId: this.returnObjectEmpty(this.orderInfo.parentId)
      };
      // debugger;
      // console.log(reqParam);
      addDoc(reqParam)
        .then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.getAllOrder(this.orderNo);
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改pdf备注文件
    prepressnotes(docId) {
      this.pdfDocId = docId;
      // 获取pdf数据
      modifityPdfNote({ docId: docId, isPost: 0 })
        .then(res => {
          if (res.code === '000000') {
            this.pdfNotes = res.data;
            // console.log(this.pdfNotes);
            this.dialogVisible = true;
          }
        })
        .catch(error => {
          this.dialogVisible = true;
          console.log(error.message);
        });
    },
    // pdf 确认窗口
    pdfConfirm(docId) {
      debugger;
      let data = { docId: docId, isPost: 1 };
      modifityPdfNote(data)
        .then(res => {
          // console.log(res.data);
          this.dialogVisible = false;
          this.reflashGoods();
        })
        .catch(() => {
          this.dialogVisible = false;
          this.reflashGoods();
        });
    },
    lookFileStatus(goodsId, val) {
      if (goodsId != undefined && goodsId != null && val != undefined && val != null) {
        fileLookStatus({
          isLook: val,
          orderGoodsId: goodsId
        }).then(res => {
          console.log(res);
          this.reflashGoods();
        });
      }
    },
    returnObjectEmpty(obj) {
      if (obj) {
        return obj;
      }
      return '';
    },
    // 刷新商品
    reflashGoods() {
      this.getAllOrder(this.orderNo);
    },
    warningPDF() {
      this.warningWindow01('请先查看PDF修改内容后，才能操作哦!');
    },
    warning3D() {
      this.warningWindow01('请先查看文件，再查看3d，最后确认文件.');
    },
    warningFile() {
      this.warningWindow01('请先查看文件，最后确认效果.');
    },
    // 警告窗口
    warningWindow01(message) {
      this.$message({ type: 'warning', message: message });
    },
    handleClose(done) {
      done();
    },
    // 部件上传文件参数
    uploadData(id, fileUrl, orderNo, index) {
      let data = {};
      // console.log(index);
      if (index == 0) {
        data['isPdf'] = 1;
      }
      data['orderDocId'] = id;
      data['folder'] = fileUrl;
      data['orderNo'] = orderNo;
      return data;
    },
    // 补差价
    toPayDiffOrder(orderNo) {
      // this.diffDialog = true;
      let routerPath = { path: '/user/orderdetail', query: { orderNo: this.orderInfo.orderNo } };
      sessionStorage.setItem('cachePath', JSON.stringify(routerPath));
      this.$router.push({ path: '/service/diffpay', query: { orderNo: orderNo } });
    }
    // diffClose() {
    //   this.diffDialog = false;
    // }
  }
};
</script>
<style scoped src="../../static/index/user/css/all.css" />
<style scoped src="../../static/index/user/css/reset.css" />
<style scoped src="../../static/index/user/css/foot.css" />
<style scoped src="../../static/index/user/css/main.css" />
<style scoped src="../../static/agent/css/sweetalert.css" />
<style scoped src="../../static/mulindex/css/fonts.css?v=202003051652" media="all" />
<style scoped src="../../static/mulindex/css/public.css?v=202003051652" media="all" />
<style scoped src="../../static/mulindex/css/user.css" media="all" />
<style type="text/css">
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: #ffffff !important;
  border-color: #ff0036 !important;
  /*box-shadow: -1px 0 0 0 red !important;*/
}
.trackBox li:first-child .el-timeline-item__node {
  background: #ff0036 !important;
  width: 30px !important;
  height: 30px !important;
  left: -9px !important;
  top: -5px !important;
}
.el-timeline-item__icon {
  font-size: 22px !important;
}

::-webkit-scrollbar-track-piece {
  background-color: #fff;
  -webkit-border-radius: 0;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  height: 50px;
  background-color: #b8b8b8;
  -webkit-border-radius: 6px;
  outline: 2px solid #fff;
  outline-offset: -2px;
  border: 2px solid #fff;
  filter: alpha(opacity = 50);
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
  opacity: 0.5;
}
::-webkit-scrollbar-thumb:hover {
  height: 50px;
  background-color: #878987;
  -webkit-border-radius: 6px;
}

.trackBox {
  padding: 20px 20px 0 !important;
}
.trackBox li {
  margin: 0 !important;
  line-height: 20px;
  text-indent: 0;
  width: inherit !important;
}
.trackBox li:first-child .el-timeline-item__node {
  background: #ff0036;
}
.trackBox li:first-child .el-timeline-item__content {
  color: #ff0036;
}
.wbb1022File {
  cursor: pointer;
}

.payOrder {
  padding: 10px 15px;
}

.paydiv {
  width: 150px;
  margin: 25px auto 0;
}

.floatleft {
  float: left;
}

.right_Consignee .floatleft {
  top: 6px;
  margin-right: 10px;
}

.tableprompt {
  border: 1px solid #ededed;
  margin-top: 20px;
  background-color: #fff;
  position: relative;
  font-size: 14px;
  padding: 20px;
  color: #d0111b;
}

.textval {
  padding: 2px;
  width: 200px;
}

.saveImg {
  background-color: #009688;
  border: medium none;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  padding: 0 25px;
  text-align: center;
}

.foldStyle,
.foldStyle a {
  margin: 18px;
}

.foldStyle a {
  line-height: 16px;
}

.serialNo {
  background-color: #00a65a;
  color: #fff;
  border-radius: 0.25em;
  display: inline;
  font-size: 75%;
  font-weight: 700;
  padding: 0.3em 0.6em;
  text-align: center;
  vertical-align: baseline;
  white-space: nowrap;
}

.guigeTis {
  background-color: #d9d9d9;
  width: 14px;
  height: 14px;
  border: 1px solid #c9c9c9;
  display: inline-block;
  border-radius: 16px;
  position: relative;
  top: 1px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}

.rightBtn05 {
  width: 75px;
  height: 20px;
  line-height: 20px;
  color: #00cc33;
  border: 1px #00cc33 solid;
  background: #fff;
  margin: 0 auto;
}
.leftC {
  width: 100px;
}
label {
  display: inline-block;
  font-weight: 700;
  margin-bottom: 5px;
  max-width: 100%;
  font-size: 12px;
}
.thumbnail {
  margin-bottom: 0px;
}
.hidden {
  display: none;
}
.note_info img {
  width: 300px;
}
.gocenter {
  text-align: center;
}
.infoBoxTops {
  height: 28px;
  line-height: 28px;
  padding: 0 16px;
  /*border: 1px solid #acb1ba;*/
  display: inline-block;
  position: relative;
  /*bottom: -1px;*/
  font-weight: 700;
  font-size: 14px;
  border-bottom: 0;
  cursor: pointer;
  background-color: #f0f2f5;
}
.infoBoxTop a {
  color: red !important;
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  text-indent: 0;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<!-- fengjianbo -->
<template>
  <el-main>
    <div class="useMainRt">
      <div class="or_tipsT">
        <h5>友情提醒：</h5>
        <p>1、用CorelDRAW 软件设计的文件请导出PDF格式上传文件，否则CDR格式文件会延时处理，因CDR格式文件产生的质量问题由客户自行承担</p>
        <p>2、如您的设计文件中有"R"或"TM"的商标，请务必提供商标注册复印件和授权委托书（<a href="{:url('index/post', ['id'=>92])}" target="_blank">样本</a>），以免耽误您订单印刷</p>
        <p>3、如您的设计文件中使用了三色或四色混合(浅灰、灰、深灰、黑)、暗红色、墨绿色、蓝紫色、深紫色、深褐色、咖啡色等，建议您先在本平台打样跟色，否则，出现色差平台概不负责。</p>
        <p>4、因为屏幕为RGB格式，印刷为CMYK格式，3D颜色仅供参考，不作为大货验收颜色。</p>
      </div>
      <!--订单进度-->
      <div class="barBox" v-if="orderInfo.status != 'cancel'">
        <ul class="barBoxT">
          <li class="flex bFirst" v-if="orderInfo.status === 'nopaid'">
            <div class="barList a1">
              <h3>提交订单</h3>
              <div class="stepNo">1</div>
              <p>{{ formatSecond(orderInfo.addtime) }}</p>
            </div>
            <div class="barList a2">
              <h3>付款成功</h3>
              <div class="stepNo">2</div>
              <p></p>
            </div>
            <div class="barList a3">
              <h3>确认成功</h3>
              <div class="stepNo">3</div>
              <p></p>
            </div>
            <div class="barList a5">
              <h3>自提</h3>
              <div class="stepNo">4</div>
              <p></p>
            </div>
          </li>
          <li class="flex bTwo" v-if="orderInfo.status === 'paid' || orderInfo.status === 'paidpart'">
            <div class="barList a1">
              <h3>提交订单</h3>
              <div class="stepNo"></div>
              <p>{{ formatSecond(orderInfo.addtime) }}</p>
            </div>
            <div class="barList a2">
              <h3>付款成功</h3>
              <div class="stepNo">2</div>
              <p v-if="orderInfo.payTime != '' && orderInfo.payTime != null">{{ formatSecond(orderInfo.payTime) }}</p>
            </div>
            <div class="barList a3">
              <h3>确认成功</h3>
              <div class="stepNo">3</div>
              <p></p>
            </div>
            <div class="barList a5">
              <h3>自提</h3>
              <div class="stepNo">4</div>
              <p></p>
            </div>
          </li>
          <li class="flex bFour" v-if="orderInfo.status === 'shipped'">
            <div class="barList a1">
              <h3>提交订单</h3>
              <div class="stepNo"></div>
              <p>{{ formatSecond(orderInfo.addtime) }}</p>
            </div>
            <div class="barList a2">
              <h3>付款成功</h3>
              <div class="stepNo"></div>
              <p v-if="orderInfo.payTime != '' && orderInfo.payTime != null">{{ formatSecond(orderInfo.payTime) }}</p>
            </div>
            <div class="barList a3">
              <h3>确认成功</h3>
              <div class="stepNo"></div>
              <p v-if="orderInfo.confirmTime != '' && orderInfo.confirmTime != null">{{ formatSecond(orderInfo.confirmTime) }}</p>
            </div>
            <div class="barList a5">
              <h3>自提</h3>
              <div class="stepNo">4</div>
              <p v-if="orderInfo.shipTime != '' && orderInfo.shipTime != null" v-text="orderInfo.shipTime"></p>
            </div>
          </li>
          <li class="flex bFive" v-if="orderInfo.status === 'completed'">
            <div class="barList a1">
              <h3>提交订单</h3>
              <div class="stepNo"></div>
              <p>{{ formatSecond(orderInfo.addtime) }}</p>
            </div>
            <div class="barList a2">
              <h3>付款成功</h3>
              <div class="stepNo"></div>
              <p v-if="orderInfo.payTime != '' && orderInfo.payTime != null">{{ formatSecond(orderInfo.payTime) }}</p>
            </div>
            <div class="barList a3">
              <h3>确认成功</h3>
              <div class="stepNo"></div>
              <p v-if="orderInfo.confirmTime != '' && orderInfo.confirmTime != null">{{ formatSecond(orderInfo.confirmTime) }}</p>
            </div>
            <div class="barList a5">
              <h3>自提</h3>
              <div class="stepNo">4</div>
              <p v-if="orderInfo.shipTime != '' && orderInfo.shipTime != null" v-text="orderInfo.shipTime"></p>
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
        <div class="infoBoxTop">订单详情</div>
        <div class="infoBox_cont">
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
                <span class="inpR" v-else>-</span>
              </p>
              <p class="inp">
                <label class="inpL">配送方式：</label>
                <span class="inpR">自提</span>
              </p>
              <p class="inp">
                <label class="inpL">联系人信息：</label>
                <span class="inpR">{{ orderInfo.consigneeName }}&nbsp;&nbsp;&nbsp;{{ orderInfo.mobile }} </span>
              </p>
              <p class="inp">
                <label class="inpL">订单备注：</label>
                <span class="inpR" v-text="orderInfo.remark"></span>
              </p>
            </li>
          </ul>
          <template v-if="false">
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
                  <span class="inpL"> <button class="layui-btn layui-btn-danger layui-btn-sm diff_pay" @click="toPayDiffOrder(diff.orderNo)">去付款</button></span>
                </p>
              </li>
            </ul>
          </template>
          <div class="use_listBox">
            <ul class="detailds">
              <ol class="itemListZ">
                <span class="t1">货品</span>
                <span class="t2">大版文件</span>
                <!-- <span class="t2">刀模文件</span> -->
                <span class="t3">单价(元)</span>
                <span class="t4">数量</span>
                <span class="t5">货品总价(元)</span>
              </ol>
              <li class="ttBox">
                <div class="itemaBox">
                  <div class="itema" v-for="(goods, index) in orderGoods" :key="index">
                    <div class="s1">
                      <dl class="flex orderInfoDL">
                        <dd class="orderInfo_t">
                          <p class="orderInfo_tC C9" title="" v-text="goods.goodsAttr"></p>
                          <p class="red">生产货期：{{ goods.totalTime }}小时 ({{ goods.totalTime / 24 }}天)</p>
                        </dd>
                      </dl>
                    </div>
                    <div class="s2">
                      <div class="s2div">
                        <template v-if="goods.fileUrl != '' && goods.fileUrl != null">
                          <!--                          <template v-if="goods.fileStatus === 2">-->
                          <!--                            <span class="gree">[{$goods.file_desc}]</span><br />-->
                          <!--                            <el-upload-->
                          <!--                              class="uploadCompanyimg1"-->
                          <!--                              :headers="headers"-->
                          <!--                              action="/api/consumer/order/miniEditionSuborder/updatePdfFile"-->
                          <!--                              :data="{ folder: 'uploads/agent', orderNo: orderInfo.orderNo }"-->
                          <!--                              :before-upload="beforeUpload"-->
                          <!--                              :on-success="uploadSuccess"-->
                          <!--                              :on-error="uploadError"-->
                          <!--                              accept=".pdf"-->
                          <!--                            >-->
                          <!--                              <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt" style="margin-top:6px;">点击上传</el-button>-->
                          <!--                            </el-upload>-->
                          <!--                            <span v-text="showUploadUrl"></span>-->
                          <!--                          </template>-->
                          <template v-if="goods.fileStatus === 3"> <br />[文件已上传]<br /> </template>
                          <template v-else>
                            <br />
                            <a v-bind:href="baseUrl + goods.fileUrl" target="_blank" class="lookBnt">[查看上传文件] </a><br />

                            <span class="filesBnt upfilePdf" @click="showEditionDetails(orderInfo.orderNo)"> 查看文件信息</span>
                          </template>
                        </template>
                        <template v-else>
                          <span class="gree">[请上传PDF文件]</span><br />
                          <span class="filesBnt upfilePdf" @click="showEditionDetails(orderInfo.orderNo)">
                            上传文件
                          </span>
                        </template>
                      </div>
                    </div>
                    <div style="line-height: 170px;" class="s3">{{ goods.amount }}元</div>
                    <div style="line-height: 170px;" class="s4" v-text="goods.number"></div>
                  </div>
                </div>
                <div class="s5" v-text="orderInfo.amount"></div>
              </li>
            </ul>
            <div class="mo_money">
              <p>
                订单金额：<b class="red mo_moneyB">{{ orderInfo.amount }}</b> 元
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--right end-->
    <el-dialog customClass="customWidth" title="整版明细" :visible.sync="dialogVisible" :before-close="handleClose">
      <div class="filesbox">
        <!--        <form action="" id="poform" method="POST">-->
        <div class="use_listBox">
          <ul class="detailds">
            <ol class="itemListZ">
              <div class="f1" style="width: 30%">PO</div>
              <div class="f5">模数</div>
              <div class="f3">生产备注(后工艺等)</div>
              <div class="f4 receiverInfo">收货人</div>
              <div class="f4 receiverInfo">收货地址</div>
              <div class="f4 receiverInfo">联系电话</div>
              <div class="f5 receiverInfo">发货数量</div>
            </ol>
            <li id="insertHere">
              <template v-if="poList">
                <div class="itema addNext" v-for="(list, index) in poList" :key="index">
                  <div class="f1" style="width: 30%">
                    <span class="operateBtn addMore" @click="addPo(orderInfo.orderNo, 1)" v-if="index === 0">增加</span><span class="operateBtn delThis" @click="delPo(index)" v-else>删除</span>
                    <input type="text" name="poSn" readonly="readonly" v-model="list.poSn" />
                  </div>
                  <div class="f5" style="margin-right: 20px;"><font class="red">*</font><input type="text" name="moldNum" placeholder="模数" v-model="list.moldNum" style="padding-left: 5px;" /></div>
                  <div class="f3"><input type="text" name="productnote" placeholder="生产信息" v-model="list.productnote" style="padding-left: 5px;" /></div>
                </div>
              </template>
            </li>
          </ul>
        </div>
        <div class="s2div">
          <el-upload
            class="uploadCompanyimg1"
            :headers="headers"
            action="/api/consumer/order/miniEditionSuborder/updatePdfFile"
            :data="{ folder: 'uploads/agent', orderNo: orderInfo.orderNo }"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            accept=".pdf"
          >
            <el-button type="primary" plain style="padding: 7px 60px;margin-top: 10px">点击上传</el-button>
          </el-upload>
          <span v-text="showUploadUrl"></span>
          <br />
          <template v-if="ordersGoodsInfo.fileStatus === 3"> <br />[文件已上传]<br /> </template>
          <a :href="baseUrl + ordersGoodsInfo.fileUrl" target="_blank" v-else-if="ordersGoodsInfo.fileUrl">[查看pdf文件]</a><br />
        </div>
        <div class="flex geRtBtnDv" style="width:20%;margin:20px auto 0;">
          <input type="hidden" name="order_no" value="{$order_no|default=''}" />
          <a href="javascript:;" @click="editEditionOrderGoods(orderInfo.orderNo)" class="joinShoping curr subform">立即提交</a>
        </div>
        <!--        </form>-->
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
import { ordersDetails, editionFiles } from '@/api/order/editionSubOrderApi';
import { formatSecond } from '@/utils/timeUtil';
import { ACCESS_TOKEN } from '@/store/global-constant';
export default {
  computed: {},
  data() {
    return {
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      orderInfo: [],
      orderGoods: [],
      miniDiffOrder: [],
      orderNo: '',
      // 鼠标悬停
      tipHover: false,
      baseUrl: '/api/consumer/certifyFree/alibaba/oss/viewFile?fileName=',
      fileUrl: 'http://alifile.xiaocaiyin.com/',
      // pdf 修改窗口
      dialogVisible: false,
      poList: [],
      diffDialog: false,
      ordersGoodsInfo: {},
      showUploadUrl: ''
    };
  },
  created() {
    this.orderNo = this.$route.query.orderNo;
    this.getAllOrder(this.orderNo);
  },
  methods: {
    ...{ formatSecond },
    getAllOrder(orderNo) {
      const reqParam = {
        data: orderNo
      };
      ordersDetails(reqParam)
        .then(res => {
          var _this = this;
          if (res.code === '000000') {
            this.$set(this, 'orderInfo', res.data);
            this.$set(this, 'orderGoods', res.data.miniEditionGoodsInfo);
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
    //上传文件的判断
    beforeUpload(file) {
      var fileName = file.name;
      const reg = /\.(pdf)$/;
      const extension = reg.test(fileName);
      if (!extension) {
        this.$message({ type: 'error', message: "上传文件格式只能是 'pdf'" });
      }
      return extension;
    },
    //上传成功的方法
    uploadSuccess(response, file) {
      if (response.code === '000000') {
        this.$message({
          type: 'success',
          message: '上传成功'
        });
        this.showUploadUrl = file.name;
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
      // console.log(this.orderInfo);
      this.$router.push({ path: '/service/editionPay', query: { orderNo: this.orderInfo.parentOrderNo } });
    },
    // 展示整版po详情
    showEditionDetails(orderNo) {
      this.orderNo = orderNo;
      // 获取po数据
      editionFiles({ orderNo: orderNo, isPost: 0 })
        .then(res => {
          if (res.code === '000000') {
            this.ordersGoodsInfo = res.data.info;
            if (res.data.poList[0]) {
              this.poList = res.data.poList;
            } else {
              this.poList = [];
              let data = { poSn: 'PO' + orderNo + '-1-1' };
              this.poList.push(data);
            }
            console.log(this.poList);
            this.dialogVisible = true;
          }
        })
        .catch(error => {
          this.dialogVisible = true;
          console.log(error.message);
        });
    },
    // 刷新商品
    reflashGoods() {
      this.getAllOrder(this.orderNo);
    },
    // 警告窗口
    warningWindow01(message) {
      this.$message({ type: 'warning', message: message });
    },
    handleClose(done) {
      done();
    },
    // 补差价
    toPayDiffOrder(orderNo) {
      // this.diffDialog = true;
      let routerPath = { path: '/user/orderdetail', query: { orderNo: this.orderInfo.orderNo } };
      sessionStorage.setItem('cachePath', JSON.stringify(routerPath));
      this.$router.push({ path: '/service/diffpay', query: { orderNo: orderNo } });
    },
    // diffClose() {
    //   this.diffDialog = false;
    // }
    addPo(orderNo, isAdd) {
      let count = 0;
      if (isAdd != null && isAdd > 0) {
        let data = { poSn: 'PO' };
        this.poList.push(data);
      }
      for (let list of this.poList) {
        count++;
        this.$set(list, 'poSn', 'PO' + orderNo + '-' + this.poList.length + '-' + count);
      }
    },
    delPo(index) {
      this.poList.splice(index, 1);
      this.addPo(this.orderNo);
    },
    editEditionOrderGoods(orderNo) {
      let poSns = [];
      let moldNum = [];
      let note = [];
      for (let list of this.poList) {
        if (!list.moldNum) {
          this.$message({
            type: 'error',
            message: '模数不能为空'
          });
          return;
        }
        moldNum.push(list.moldNum);
        if (list.productnote) {
          note.push(list.productnote);
        } else {
          note.push('');
        }
        if (list.poSn) {
          poSns.push(list.poSn);
        } else {
          poSns.push('');
        }
      }
      // 获取pdf数据
      editionFiles({ orderNo: orderNo, isPost: 1, poSns: poSns, moldNum: moldNum, note: note, fileUrl: this.showUploadUrl })
        .then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '执行成功'
            });
            this.dialogVisible = true;
          }
        })
        .catch(error => {
          console.log(error.message);
        });
    }
  }
};
</script>
<style scoped>
.el-upload__input {
  display: none;
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
</style>
<style scoped src="../../static/index/user/css/all.css" />
<style scoped src="../../static/index/user/css/reset.css" />
<!-- <style scoped src="../../static/index/user/css/all.css?0621" /> -->
<style scoped src="../../static/index/user/css/foot.css" />
<style scoped src="../../static/index/user/css/main.css" />
<style scoped src="../../static/agent/css/sweetalert.css" />
<!-- <style scoped src="../../static/index/css/new/public.css" /> -->
<style scoped src="../../static/mulindex/css/fonts.css?v=202003051652" media="all" />
<style scoped src="../../static/mulindex/css/public.css?v=202003051652" media="all" />
<style scoped src="../../static/mulindex/css/user.css" media="all" />

<!--整版明细弹窗style-->
<style scoped>
.customWidth {
  width: 50%;
  hight: 80%;
}
.wbb1022File {
  cursor: pointer;
}
.use_listBox {
  padding-bottom: 20px;
}
.use_listBox li {
  display: block;
  background-color: #fff;
  width: 100%;
}
.itemListZ,
.itema {
  display: flex;
  width: 100%;
}
.itema {
  padding: 12px 0;
  text-align: center;
}
.itema input {
  border: 1px solid #e6e6e6;
  line-height: 28px;
}
.operateBtn {
  padding: 2px 8px;
  background-color: #e6e6e6;
  border-radius: 12px;
  cursor: pointer;
  margin-right: 4px;
}
.f1 {
  width: 20%;
}
.f2 {
  width: 15%;
}
.f3 {
  width: 25%;
}
.f4 {
  width: 25%;
}
.f5 {
  width: 10%;
}
.filesbox {
  padding: 20px;
}
.ttBox .s2 {
  position: relative;
}
.ttBox .s2div {
  /* margin-top: 62px; */
  margin-top: calc(100% - (56%-25px));
}

.filesbox .s2div {
  text-align: center;
  width: 20%;
  margin: 0 auto;
  align-items: center;
}
.filesbox .joinShoping {
  margin-left: 0;
}
.filesbox .filesBnt {
  padding: 0;
  line-height: 40px;
  width: 100%;
}
.hide {
  display: none;
}
.f1 input {
  width: 170px;
}
.f5 input {
  width: 70px;
}
.f3 input {
  width: 270px;
}
.fileupload .wbb1022File {
  width: 100%;
  height: 100%;
}
.receiverInfo {
  display: none;
}
</style>
<style scoped src="../../static/index/user/css/all.css?0621" />
<style scoped src="../../static/mulindex/css/attr.css?v=11" media="all" />
<style scoped src="../../static/index/css/new/public.css" />

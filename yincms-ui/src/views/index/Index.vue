<!-- fengjianbo -->
<template>
  <div>
    <div class="InbannerBox">
      <!--banner-->
      <div id="imageShow">
        <div class="block">
          <el-carousel height="400px" trigger="click">
            <!-- <el-carousel-item v-for="(vo, index) in carouselList" :key="index" :style="'background: url(' + vo + ') no-repeat cover;'"> -->
            <el-carousel-item v-for="(vo, index) in carouselList" :key="index" :style="'background: url(' + vo + ') no-repeat center;background-size:100% 100%;'">
              <!--              <img :src="vo" style="position: absolute;" />-->
              <!-- <div v-if="index == 0" class="bannerHover" style="width:100%;height:400px;" @click="toPage"></div> -->
              <div v-if="index == 0" class="bannerHover" style="width:100%;height:100%;" @click="toPage"></div>
              <div v-if="index == 1" class="bantxt">
                <p class="bantxt_p">
                  今日已下
                  <span>{{ CountInfo.orderToday }}</span> 个订单， <span>{{ CountInfo.agentOnline }}</span> 个包装用户在线，累计已有 <span>{{ CountInfo.agentNum }}</span> 个包装用户加入
                </p>
                <div class="bantxt_dv" v-if="$store.getters.userInfo == null">
                  <router-link to="/login">登录</router-link>
                  <router-link to="/register">注册</router-link>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- 新年样式 -->
      <!-- <div class="newyearStyle">
        <div class="newyear">
          <img src="@/static/mulindex/img/newYearSkin/newLeft.png" alt="" />
        </div>
        <div class="newyear01">
          <img src="@/static/mulindex/img/newYearSkin/newRight.png" alt="" />
        </div>
      </div> -->
    </div>
    <!--流程-->
    <div class="flowBox"></div>
    <div v-if="$store.getters.userInfo != null">
      <div class="flex comBoxs" style="align-items: self-start;">
        <div class="myWaperL">
          <div class="myformBx">
            <div class="myform">
              <input type="text" name="box" placeholder="请输入关键字" class="myforInpt" v-model="goodsName" />
              <button type="submit" class="myforBtn" @click="searchClick"><i class="icon icon-search"></i>搜索</button>
            </div>
          </div>
          <template v-if="listFlipOrderList.length > 0">
            <ul class="myList">
              <li v-for="(vo, index) in listFlipOrderList" :key="index">
                <p class="myListL"><img :src="vo.coverPath" /></p>
                <div class="myListZ" style="width:740px;">
                  <div class="myListZtile">
                    <p class="myListZti">{{ vo.name }}</p>
                    <span>{{ vo.customName }}</span>
                    <span class="myLabelBtn icon icon-ebit" data-id="{$vo.id}" @click="customLabel(vo.id)">自定义标签</span>
                  </div>
                  <!--商品属性-->
                  <p class="C9 attr">{{ vo.goodsAttr }}</p>
                  <p class="myListZtx">{{ vo.createtime }}</p>
                </div>
                <div class="myListR" style="width: 160px;">
                  <!-- <a href="javascript:void(0)" class="placeOrder" @click="placeOrder(vo.id)">一键下单</a> -->
                  <a href="javascript:void(0)" class="myListRbnt again" @click="newPrice(vo.cateId, vo.subCateId)"><i class="icon icon-again"></i>重新报价</a>
                </div>
              </li>
            </ul>
            <!--分页-->
            <div class="pageBox">
              <el-pagination background layout="prev, pager, next" :hide-on-single-page="value" :total="totalCount" :page-size="pageSize" :current-page="pageNumber" @current-change="handleCurrentChange"></el-pagination>
            </div>
          </template>
          <template v-else>
            <div class="nyBox">
              <img src="../../static/mulindex/img/non.png" />
              <p>您还没有任何下单信息记录</p>
              <router-link to="/price/cartIndex" class="nyBtn">现在去下单</router-link>
            </div>
          </template>
        </div>
        <!--        <div v-else class="nyBox">-->
        <!--          <img src="../../static/mulindex/img/non.png" />-->
        <!--          <p>您还没有任何下单信息记录</p>-->
        <!--          <router-link to="/price/cartIndex" class="nyBtn">现在去下单</router-link>-->
        <!--        </div>-->
      </div>
      <!--自定义标签 弹层-->
    </div>

    <div v-else>
      <!--产品-->
      <div class="advBox">
        <div class="comBox">
          <h4 class="advTitle">
            我们以 <b>智能技术</b> 为驱动，已帮 <span class="timer count-number" data-to="14882" data-speed="1500">{{ CountInfo.agentNum }}</span> 个客户完成
            <span class="timer count-number" data-to="685032" data-speed="1500">{{ CountInfo.orderCount }}</span> 个包装小订单，实现了以下提升：
          </h4>
          <ul class="flex advUl">
            <li>
              <p class="advPtx1">78%</p>
              <span>接单效率提升</span>
            </li>
            <li>
              <p class="advPtx2">70%</p>
              <span>小订单价格降低</span>
            </li>
            <li>
              <p class="advPtx3">86%</p>
              <span>交货准时率提升</span>
            </li>
            <li>
              <p class="advPtx4">95%</p>
              <span>产品质量提升</span>
            </li>
            <li>
              <p class="advPtx5">65%</p>
              <span>销售利润增长</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="datBox">
        <div class="comBox">
          <h3 class="glH3">全球15万+企业首选的包装定制服务平台</h3>
          <p class="glpt">设计打样、大货生产，一站式包装解决方案就上傲彩</p>
          <ul class="flex globUl">
            <li><i class="gIcn1"></i>服务国家和地区 <span class="globUSpn">180</span></li>
            <li><i class="gIcn2"></i>全球用户数 <span class="globUSpn">150000</span></li>
            <li><i class="gIcn3"></i>每日订单数 <span class="globUSpn">600</span></li>
            <li><i class="gIcn4"></i>订单交货最快交期 <span class="globUSpn">72H</span></li>
          </ul>
        </div>
      </div>
      <div class="globaBox">
        <div class="comBox">
          <!--left-->
          <div class="Lgbox">
            <h4>实时订单</h4>
            <div class="LgboxLst">
              <div class="flex LgboxLstTop">
                <span class="ww1">客户</span>
                <span class="ww2">时间</span>
                <span class="ww3">订单号</span>
                <span class="ww4">品类</span>
                <span class="ww5">数量</span>
                <span class="ww6">交期</span>
                <span class="ww7">金额</span>
              </div>
              <div class="Lmaquee">
                <ul :style="'margin-top:' + top + 'px;'">
                  <li v-for="(vo, index) in listOrder" :key="index">
                    <span class="ww1">{{ vo.name }}</span>
                    <span class="ww2">{{ vo.time }}</span>
                    <span class="ww3">{{ vo.order }}</span>
                    <span class="ww4">{{ vo.box }}</span>
                    <span class="ww5">{{ vo.quantity }}pcs</span>
                    <span class="ww6"
                      ><i class="timH"
                        ><s>{{ vo.delivery }}</s
                        >H</i
                      ></span
                    >
                    <span class="ww7 org">￥{{ vo.price }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!--right-->
          <div class="xnith">
            <div class="rgbox">
              <div class="world-map">
                <div title="" class="country-area" style="left: 124px;top: 107px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 155px; top: 164px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 256px; top: 303px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 139px; top: 211px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 399px; top: 125px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 373px; top: 163px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>

                <div title="" class="country-area" style="left: 428px; top: 253px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 633px; top: 281px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 626px; top: 257px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 518px; top: 97px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 671px; top: 161px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
                <div title="" class="country-area" style="left: 694px; top: 173px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>

                <div title="" class="country-area" style="left: 732px; top: 342px;">
                  <div class="country-point">
                    <div class="point point-1"></div>
                    <div class="point point-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="partBox">
          <div class="comBox">
            <h6>合作伙伴</h6>
            <ul>
              <li><img src="/uploads/img/index/part1.jpg" /></li>
              <li><img src="/uploads/img/index/part2.jpg" /></li>
              <li><img src="/uploads/img/index/part3.jpg" /></li>
              <li><img src="/uploads/img/index/part4.jpg" /></li>
              <li><img src="/uploads/img/index/part5.jpg" /></li>
              <li><img src="/uploads/img/index/part6.jpg" /></li>
              <li><img src="/uploads/img/index/part7.jpg" /></li>
              <li><img src="/uploads/img/index/part8.jpg" /></li>
              <li><img src="/uploads/img/index/part9.jpg" /></li>
              <li><img src="/uploads/img/index/part10.jpg" /></li>
              <li><img src="/uploads/img/index/part11.jpg" /></li>
              <li><img src="/uploads/img/index/part12.jpg" /></li>
              <li><img src="/uploads/img/index/part13.jpg" /></li>
              <li><img src="/uploads/img/index/part14.jpg" /></li>
              <li><img src="/uploads/img/index/part15.jpg" /></li>
              <li><img src="/uploads/img/index/part16.jpg" /></li>
              <li><img src="/uploads/img/index/part17.jpg" /></li>
              <li><img src="/uploads/img/index/part18.jpg" /></li>
            </ul>
          </div>
        </div>
      </div>
      <!--生产基地-->
      <div class="comBox center-tx OEMbox">
        <div class="OEMtitle">
          <h6>傲彩，生产基地</h6>
          <p>傲彩已在<span class="red">广州、深圳、东莞、中山、佛山、江门建立8大生产基地</span></p>
          <router-link to="/producer/index" target="_blank" class="OEMBnt">生产商加盟</router-link>
        </div>
        <ul class="flex OEMul">
          <li>
            <div class="OEMulImg"><img src="../../static/index/img/index/TB1gIYFt7yWBuNjy0FpXXassXXa-760-460.jpg" /></div>
            <p class="OEMulPt">海德堡5+1对开机</p>
          </li>
          <li>
            <div class="OEMulImg"><img src="../../static/index/img/index/TB1UO52okyWBuNjy0FpXXassXXa-760-460.jpg" /></div>
            <p class="OEMulPt">罗兰7+1UV对开机</p>
          </li>
          <li>
            <div class="OEMulImg"><img src="../../static/index/img/mmexport1546672211919.jpg" /></div>
            <p class="OEMulPt">惠普indigo 12000</p>
          </li>
        </ul>
      </div>
      <div class="inforWap">
        <div class="flex comBox">
          <div class="aboutBox">
            <h3>关于我们</h3>
            <div class="flex aboutoZ">
              <div class="inforL">
                <h1>关于<span class="red">傲彩</span>，你知道多少？</h1>
                <ul>
                  <li><i></i><span>在线报价：输入尺寸，选择材质工艺，1秒在线报价</span></li>
                  <li><i></i><span>智能刀模：300款刀模图，免费在线下载</span></li>
                  <li><i></i><span>数码打样：8小时出样，大货跟色跟样</span></li>
                  <li><i></i><span>品类齐全：卡纸盒、胶片盒、精装盒、内托、标签、吊牌、手提袋、说明书、纸杯、纸巾盒…包材一站式采购</span></li>
                  <li><i></i><span>源头工厂：小订单价格比市场直降70%，质量问题免费重印</span></li>
                  <li><i></i><span>全球供应：服务180+国家和地区，150000+行业客户</span></li>
                </ul>
                <p class="inforLimg"><img src="/uploads/img/index/tel.jpg" /></p>
              </div>
              <ul class="inforR">
                <li>
                  <a href="https://tech.ifeng.com/c/7qFjAmyKom1" target="_blank">
                    <h6>● 傲彩荣获中国印刷业“创新十强”</h6>
                    <p class="txt">傲彩凭借智能包装报价系统、智能包装刀模系统、智能包装拼版系统等行业创新技术，荣获2019年中国印刷业“创新十强”</p>
                    <p class="inforRtime">发布时间：2019-09-25</p>
                  </a>
                </li>
                <li>
                  <a href="http://www.ebrun.com/20180821/293129.shtml" target="_blank">
                    <h6>● 傲彩获1000万元天使投资</h6>
                    <p class="txt">小批量包装印刷供应链电商平台傲彩完成1000万元天使轮融资,本轮融资投资方是顶聚投资,这是国内包装印刷电商行业获得的首次融资。</p>
                    <p class="inforRtime">发布时间：2018-08-21</p>
                  </a>
                </li>
                <li>
                  <a href="http://www.keyin.cn/news/ysqy/201804/04-1110193.shtml" target="_blank">
                    <h6>● 傲彩荣获2018年中国印刷互联网“新锐奖”</h6>
                    <p class="txt">2018中国印刷业互联网创新节暨第六届中国印刷电商年会在北京拉开帷幕，傲彩凭借独特的商业模式与包装行业技术突破，荣获“中国印刷互联网新锐奖”。</p>
                    <p class="inforRtime">发布时间：2018-04-04</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="proBox">
            <h3>常见问题</h3>
            <ul>
              <li @click="h5icon = 1" :class="[h5icon == 1 ? 'curr' : '']">
                <h5><i class="h5icon">?</i>你们是平台，不是直接厂家吗?<em :class="[h5icon == 1 ? 'icon icon-arrow_up' : 'icon icon-arrow_d']"></em></h5>
                <p :class="[h5icon == 1 ? 'anstx' : 'anstx hide']">我们是直接厂家，而且跟我们做配套生产的都是源头工厂，平台上线的包材都是厂家直供价。</p>
              </li>
              <li @click="h5icon = 2" :class="[h5icon == 2 ? 'curr' : '']">
                <h5><i class="h5icon">?</i>质量问题可以重印吗？<em :class="[h5icon == 2 ? 'icon icon-arrow_up' : 'icon icon-arrow_d']"></em></h5>
                <p :class="[h5icon == 2 ? 'anstx' : 'anstx hide']">我们承诺质量问题免费重印，出货超时按照平台规则赔付，详情可咨询在线客服了解。</p>
              </li>
              <li @click="h5icon = 3" :class="[h5icon == 3 ? 'curr' : '']">
                <h5><i class="h5icon">?</i>能开增值税发票吗？<em :class="[h5icon == 3 ? 'icon icon-arrow_up' : 'icon icon-arrow_d']"></em></h5>
                <p :class="[h5icon == 3 ? 'anstx' : 'anstx hide']">可以，在提交订单页面选择发票类型，填写开票资料即可，发票邮寄费用由我们承担。</p>
              </li>
              <li @click="h5icon = 4" :class="[h5icon == 4 ? 'curr' : '']">
                <h5><i class="h5icon">?</i>网站付款支持哪些方式？<em :class="[h5icon == 4 ? 'icon icon-arrow_up' : 'icon icon-arrow_d']"></em></h5>
                <p :class="[h5icon == 4 ? 'anstx' : 'anstx hide']">支持支付宝、微信支付、 花呗、信用卡和各大银行的网上银行业务。</p>
              </li>
              <li @click="h5icon = 5" :class="[h5icon == 5 ? 'curr' : '']">
                <h5><i class="h5icon">?</i>每天下单截止时间是几点？<em :class="[h5icon == 5 ? 'icon icon-arrow_up' : 'icon icon-arrow_d']"></em></h5>
                <p :class="[h5icon == 5 ? 'anstx' : 'anstx hide']">平台支持24小时在线下单，客服值班时间8:30-20:00。</p>
              </li>
              <ol>
                <router-link to="/news/detail?id=6" target="_blank">新手指南</router-link>
                <router-link to="/news/detail?id=23" target="_blank">售后服务</router-link>
                <router-link to="/news/detail?id=17" target="_blank">物流配送</router-link>
                <router-link to="/news/detail?id=2" target="_blank" class="proMore">查看更多 <i>>></i></router-link>
              </ol>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listFlipOrder } from '@/api/order/supplierOrdersApi';
import { updateName } from '@/api/order/orderApi';
import { getCount, listOrder, addFrom } from '@/api/home/homeApi';
import { strEquals } from '@/utils/strUtil';
import { formatSecond } from '@/utils/timeUtil';
import { saveOrdersRepurchase } from '@/api/cart/cartApi';
import store from '@/store';
export default {
  data() {
    return {
      top: 0,
      value: true,
      goodsName: '',
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      h5icon: 1,
      CountInfo: [],
      listFlipOrderList: [],
      listOrder: [],
      carouselList: [
        // require('../../static/mulindex/img/index/banner_21_7_2.png'),
        // require('../../static/mulindex/img/index/banner00.jpg'),
        // require('../../static/mulindex/img/newYearSkin/newBanner.png'),
        // require('../../static/mulindex/img/index/bnner02.jpg'),
        // require('../../static/mulindex/img/index/banner0.jpg')
        require('../../static/mulindex/img/index/banner1.png'),
        require('../../static/mulindex/img/index/banner2.png')
      ],
      couplets: true,
      show3: false,
      show2: true,
      times: null
    };
  },
  mounted() {
    let _this = this;
    // _this.resize();
    // window.onresize = function() {
    //   _this.resize();
    // };
  },
  // 方法
  methods: {
    getCount() {
      getCount()
        .then(res => {
          if (res.success) {
            this.$set(this, 'CountInfo', res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    listOrders() {
      listOrder()
        .then(res => {
          if (res.success) {
            this.$set(this, 'listOrder', res.data);
            var arr = this.listOrder;
            var _this = this;
            setInterval(function() {
              _this.top = _this.top - 0.1;
              if (_this.top <= -34) {
                _this.top = 0;
                var arr1 = arr[0];
                arr.splice(0, 1);
                arr.push(arr1);
                _this.listOrder = arr;
              }
            }, 5);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addFrom() {
      var from = this.$route.query.from ? this.$route.query.from : '';
      var data = {
        data: from,
        language: 'zh-cn'
      };
      addFrom(data)
        .then(res => {
          console.log(999);
        })
        .catch(err => {
          console.log(err);
        });
    },
    listFlipOrder() {
      var data = {
        goodsName: this.goodsName,
        language: 'zh-cn',
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };
      listFlipOrder(data)
        .then(res => {
          this.$set(this, 'listFlipOrderList', res.data.map(e => {
            e.createtime = formatSecond(e.createtime)
            return e
          }));
          this.totalCount = res.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    toPage() {
      let categoryUrl = this.$router.resolve({ name: 'ironActivity' });
      window.open(categoryUrl.href, '_blank');
    },
    //自定义名字
    customLabel(id) {
      this.$prompt('', '自定义标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          var data = {
            customName: value,
            orderGoodsId: id
          };
          updateName(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: '添加成功'
              });
              this.listFlipOrder();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    //一键下单
    placeOrder(id) {
      var data = {
        language: 'zh-cn',
        orderGoodsId: id
      };
      saveOrdersRepurchase(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '添加到购物车成功!'
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //搜索
    searchClick() {
      this.pageNumber = 1;
      this.pageSize = 10;
      this.listFlipOrder();
    },
    //分页
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.listFlipOrder();
    },
    //重新报价
    newPrice(cateId, subCateId) {
      var url = '';
      if (strEquals(cateId, '1')) {
        if (strEquals(subCateId, '23')) {
          url = '/price/specialBoxList?cateId=' + cateId + '&subCateId=' + subCateId;
        } else if (strEquals(subCateId, '24')) {
          url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
        } else {
          url = '/price/cartIndex?cateId=' + cateId + '&subCateId=' + subCateId;
        }
      } else if (strEquals(cateId, '2')) {
        if (strEquals(subCateId, '29') || strEquals(subCateId, '30')) {
          url = '/price/specialBoxList?cateId=' + cateId + '&subCateId=' + subCateId;
        } else if (strEquals(subCateId, '31') || strEquals(subCateId, '32')) {
          url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
        } else {
          url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
        }
      } else if (strEquals(cateId, '9')) {
        url = '/price/explainIndex?cateId=' + cateId + '&subCateId=' + subCateId;
      } else if (strEquals(cateId, '8') && strEquals(subCateId, '61')) {
        url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
      } else if (strEquals(cateId, '13')) {
        url = '/price/explainIndex?cateId=' + cateId + '&subCateId=' + subCateId;
      } else if (strEquals(cateId, '70')) {
        url = '/price/cartonIndex?cateId=' + cateId + '&subCateId=' + subCateId;
      } else {
        if (strEquals(subCateId, '82')) {
          url = '/price/explainIndex?cateId=' + cateId + '&subCateId=' + subCateId;
        } else {
          url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
        }
      }
      this.$router.push({ path: url });
    }
  },
  // 初始化组件事件,具体请看vue的生命周期
  created() {
    this.getCount();
    if (store.getters.userInfo != null) {
      this.listFlipOrder();
    } else {
      this.listOrders();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建 vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      //判断是否是刷新   其他页面跳转需要调用添加
      console.log('from.path', from.path);
      if (from.path != '/') {
        vm.addFrom();
      }
    });
  }
};
</script>

<style scoped>
/* 新年样式 ---start */
/* .newyearStyle img {
  width: 300px;
  height: 500px;
}
.newyear {
  display: block;
  position: absolute;
  left: 0;
  top: 240px;
  z-index: 3;
}
.newyear01 {
  display: block;
  position: absolute;
  top: 240px;
  right: 0;
  z-index: 3;
} */
/* 新年样式 ---endt */

.bannerHover:hover {
  cursor: pointer;
}
.coupletsGif {
  position: fixed;
  bottom: 114px;
  right: 80px;
  z-index: 99;
  cursor: pointer;
}
.coupletsGif img {
  width: 130px;
}
.coupletsText {
  position: fixed;
  bottom: 106px;
  right: 82px;
  z-index: 90;
  cursor: pointer;
}
.coupletsText img {
  height: 209px;
  overflow: hidden;
}
</style>
<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/mulindex/css/index.css" />

<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/layui/dist/css/layui.css">-->
<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/css/fonts.css?v={$timestamp}">-->
<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/css/public.css" media="all">-->
<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/css/index.css" media="all">-->

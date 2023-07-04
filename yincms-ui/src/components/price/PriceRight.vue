<template>
  <div class="guigeRt">
    <div class="guigeRtWrap">
      <h2 class="guigeRtH2" v-if="topNav && subNav && isCmsHidden()">{{ topNav.name }}-{{ subNav.name }}报价</h2>
      <div class="geRtList">
        <h4 v-if="$route.query.cateId != 1">价格</h4>
        <ul class="guigeRtUl" :style="$route.query.cateId == 1 ? 'margin-top:20px;' : ''">
          <ol class="flex">
            <span>出货时间</span>
            <span v-if="$route.query.cateId != 1">价格</span>
          </ol>
          <li>
            <!--            <div v-if="$route.query.cateId === '70'">-->
            <!--              <div :class="'flex geRtime' + ' curr'">-->
            <!--                <label class="layui-form-item geRtimeLt dateSel">-->
            <!--                  <em class="dateH" value="0"></em>-->
            <!--                  <span class="dayNormal">具体货期请咨询客服</span>-->
            <!--                </label>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div v-else>  && priceFormData.yssl * SLXNumValue < 20000 -->
            <!-- 判断三天短货期 -->
            <div v-if="(strEquals(priceFormData.cextends, '4')) && $route.query.cateId === '1'">
              <div :class="'flex geRtime' + (strEquals(priceFormData.extends, '4') ? ' curr' : '')" @click="selectExtends('4')">
                <label class="layui-form-item geRtimeLt dateSel">
                  <em class="dateH" value="4"></em>
                  <span class="daySlow">{{ priceFormData.time_slow }}小时（{{ priceFormData.days_slow }}天）</span>
                </label>
              </div>
            </div>

            <div v-if="(strEquals(priceFormData.cextends, '5')) && $route.query.cateId === '1'">
              <div :class="'flex geRtime' + (strEquals(priceFormData.extends, '5') ? ' curr' : '')" @click="selectExtends('5')">
                <label class="layui-form-item geRtimeLt dateSel">
                  <em class="dateH" value="5"></em>
                  <span class="daySlow">{{ priceFormData.time_slow }}小时（{{ priceFormData.days_slow }}天）</span>
                </label>
              </div>
            </div>

            

            <template v-if="!strEquals(priceFormData.cextends, '4')&&!strEquals(priceFormData.cextends, '5')">
              <!-- 延迟货期 -->
              <div
                v-if="$route.query.cateId === '1' || (priceFormData.yssl < 10000 && $route.query.cateId === '13') || (priceFormData.yssl < 10000 && $route.query.cateId === '4' && $route.query.subCateId === '35') || $route.query.subCateId == 42"
                :class="'flex geRtime' + (strEquals(priceFormData.extends, '1') ? ' curr' : '')"
                @click="selectExtends('1')"
              >
                <label class="layui-form-item geRtimeLt dateSel">
                  <em class="dateH" value="1"></em>
                  <span class="daySlow">{{ priceFormData.time_slow }}小时（{{ priceFormData.days_slow }}天）</span>
                </label>
                <div class="extra en" v-if="$route.query.cateId != 1">
                  <p class="moneySlow">
                    <span v-if="goodsIdsCheckList[goodsId] && priceFormData.price_slow > 0">
                      <span style="margin-right:10px;color:red;">￥{{ getDiscountPrice(priceFormData.price_slow) }}</span>
                      <span style="text-decoration: line-through;color:#999">￥{{ priceFormData.price_slow || 0 }}</span>
                    </span>
                    <span v-else style="font-weight: bold;">¥{{ priceFormData.price_slow }}</span>
                  </p>
                  <p class="f12 C7 unitSlow">单价:{{ getUnitPrice(priceFormData.price_slow, priceFormData.yssl * priceFormData.tkks) }}</p>
                </div>
              </div>
              <!-- 正常货期 -->
              <div :class="'flex geRtime' + (strEquals(priceFormData.extends, '0') ? ' curr' : '')" @click="selectExtends('0')" :name="$route.query.cateId == '1' && priceFormData.yssl >= 10000 ? 'hidename' : ''">
                <label class="layui-form-item geRtimeLt dateSel">
                  <em class="dateH" value="0"></em>
                  <span class="dayNormal" v-if="$route.query.cateId == '86' || $route.query.cateId == '121'"
                    >{{ priceFormData.time_normal == 0 ? 48 : priceFormData.time_normal }}小时（{{ priceFormData.days_normal == 0 ? 2 : priceFormData.days_normal }}天)</span
                  >
                  <span class="dayNormal" v-else>{{ priceFormData.time_normal == 0 ? 120 : priceFormData.time_normal }}小时（{{ priceFormData.days_normal == 0 ? 5 : priceFormData.days_normal }}天）</span>
                  <!--                <span class="dayNormal">{{ priceFormData.time_normal }}小时（{{ priceFormData.days_normal }}天）</span>-->
                </label>
                <div class="extra en" v-if="$route.query.cateId != 1">
                  <p class="moneyNormal">
                    <span v-if="goodsIdsCheckList[goodsId] && priceFormData.price_normal > 0">
                      <span style="margin-right:10px;color:red;">￥{{ getDiscountPrice(priceFormData.price_normal) }}</span>
                      <span style="text-decoration: line-through;color:#999">￥{{ priceFormData.price_normal || 0 }}</span>
                    </span>
                    <span v-else style="font-weight: bold;">￥{{ priceFormData.price_normal || 0 }}</span>
                  </p>
                  <template v-if="$route.query.subCateId === '85'">
                    <!--                  <p class="f12 C7 unitNormal">刀卡1单价:{{ getUnitPrice(priceFormData.knifeCardPrice1, priceFormData.yssl) }}</p>-->
                    <!--                  <p class="f12 C7 unitNormal">刀卡2单价:{{ getUnitPrice(priceFormData.knifeCardPrice2, priceFormData.tkks) }}</p>-->
                  </template>
                  <template v-else>
                    <p class="f12 C7 unitNormal">
                      {{ SLXNumValue > 0 ? '单价(套):' + getUnitPrice(priceFormData.price_normal, priceFormData.yssl * SLXNumValue) : '单价:' + getUnitPrice(priceFormData.price_normal, priceFormData.yssl * priceFormData.tkks) }}
                    </p>
                  </template>
                </div>
              </div>
              <!-- 牛皮纸增加短货期 -->
              <div v-if="isShort && ((formData.goodSize.goodAl < 785 && formData.goodSize.goodAw < 545) || (formData.goodSize.goodAl < 545 && formData.goodSize.goodAw < 785))">
                <!-- v-if="$route.query.cateId == 1 && priceFormData.days_kraft > 0" -->
                <div v-if="$route.query.cateId == 1" :class="'flex geRtime' + (strEquals(priceFormData.extends, '3') ? ' curr' : '')" @click="selectExtends('3')" :name="$route.query.cateId == '1' && priceFormData.yssl >= 10000 ? 'hidename' : ''">
                  <label class="layui-form-item geRtimeLt dateSel">
                    <em class="dateH" value="3"></em>
                    <span class="dayNormal">{{ priceFormData.days_kraft > 0 ? priceFormData.days_kraft * 24 : 144 }}小时（{{ priceFormData.days_kraft > 0 ? priceFormData.days_kraft : 6 }}天）</span>
                  </label>
                </div>
              </div>
            </template>
          </li>
        </ul>
      </div>

      <!-- <div class="rightdetailsbox">
        <div class="rightdetails">
          <p style="width:100%;float:left">
            <span style="float:left;">纸张克重</span>
            <span style="float:right;">价格</span>
          </p>
          <div>
            <el-radio-group v-model="radio" @change="PaperChange">
              <div style="line-height:30px" v-for="(n,i) in newlist" :key="i"><el-radio :label="n.actualValue">{{n.name}}</el-radio><p>{{n.price}}</p></div>
            </el-radio-group>
          </div>
          
        </div>
      </div> -->
      <!-- <div class="geRtList geRtListkg" v-if="$route.query.cateId == 1 || $route.query.cateId == 2">
        <ul class="guigeRtUl">
          <ol class="flex" style="padding: 0 10px">
            <span>包装服务</span>
          </ol>
          <li style="min-height:46px">
            <div class="radio_box">
              <el-radio-group v-model="priceFormData.radioService" @change="addService(1, $event)">
                <div :class="['geRtListkglist', 'packServe', priceFormData.radioService == '盒子扎皮筋' ? 'active' : '']">
                  <el-radio :label="'盒子扎皮筋'" class="labelr">盒子扎皮筋</el-radio>
                </div>
                <div :class="['geRtListkglist', 'packServe', priceFormData.radioService == '盒子扎纸带' ? 'active' : '']">
                  <el-radio :label="'盒子扎纸带'" class="labelr">盒子扎纸带</el-radio>
                </div> -->
      <!-- <div class="geRtListkglist">
                  <el-radio :label="'外箱套蛇皮袋'" class="labelr">外箱套蛇皮袋</el-radio>
                </div> -->
      <!-- </el-radio-group>
            </div>
          </li>
          <li style="min-height:46px">
            <div class="radio_box">
              <el-checkbox-group v-model="priceFormData.checkedService" @change="addService(2, $event)">
                <div class="geRtListkglist packServe" style="line-height: 30px;background-color: #fff ; border-bottom: 1px solid #f5f5f5;">
                  <el-checkbox label="1">外箱套蛇皮袋</el-checkbox>
                </div> -->
      <!-- <div class="geRtListkglist packServe" style="line-height: 30px;background-color: #fff ;">
                  <el-checkbox label="2">外箱贴标签</el-checkbox>
                </div> -->
      <!-- </el-checkbox-group>
            </div>
          </li>
        </ul>
      </div> -->
      <div class="geRtList geRtListkg" v-if="$route.query.cateId == 1 && newlist.length >= 1">
        <ul class="guigeRtUl">
          <ol class="flex" style="padding: 0 10px">
            <span>纸张克重</span>
            <span>价格</span>
          </ol>
          <li style="min-height:46px" v-loading="loadingstatus">
            <div v-if="newlist.length == 1">
              <div class="geRtListkglist" v-for="(n, i) in newlist" :key="i" style="line-height:45px;">
                <span style="color:#000;font-weight: bold">{{ n.name }}</span>
                <div style="line-height: 15px; float: right; margin: 4px 10px 0 0">
                  <p style="text-align: right;font-weight: bold;">
                    <span v-if="goodsIdsCheckList[goodsId] && n.price">
                      <span style="margin-right:10px;color:red;">￥{{ getDiscountPrice(n.price) }}</span>
                      <span style="text-decoration: line-through;color:#999">￥{{ n.price || 0 }}</span>
                    </span>
                    <span v-else style="font-weight: bold;">￥{{ n.price || 0 }}</span>
                  </p>
                  <p style="text-align: right;color:#606266;font-size:12px">单价:{{ getUnitPrice(n.price, priceFormData.yssl * priceFormData.tkks) }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <el-radio-group v-model="radio" @change="PaperChange" :disabled="this.$route.query.isCms === 'edit' && this.$route.query.flat === 'true'">
                <div class="geRtListkglist" v-for="(n, i) in newlist" :key="i">
                  <el-radio :label="n.actualValue" class="labelr">{{ n.name }}</el-radio>
                  <div class="el-radio__label" style="line-height: 15px; float: right; margin: 4px 10px 0 0">
                    <p style="text-align: right;font-weight: bold;">
                      <span v-if="goodsIdsCheckList[goodsId] && n.price">
                        <span style="margin-right:10px;color:red;">￥{{ getDiscountPrice(n.price) }}</span>
                        <span style="text-decoration: line-through;color:#999">￥{{ n.price || 0 }}</span>
                      </span>
                      <span v-else style="font-weight: bold;">￥{{ n.price || 0 }}</span>
                    </p>
                    <p style="text-align: right;color:#606266;font-size:12px">单价:{{ getUnitPrice(n.price, priceFormData.yssl * priceFormData.tkks) }}</p>
                  </div>
                </div>
              </el-radio-group>
            </div>
          </li>
        </ul>
      </div>
      <div style="margin-bottom:20px;" v-if="$route.query.cateId == 1 && !isCmsHidden()"></div>
      <!-- 货期规则 -->
      <div class="geRtList" v-if="isCmsHidden()">
        <h4>货期规则</h4>
        <div class="geRtSection" v-if="$route.query.cateId == '86' || $route.query.cateId == '121'">
          20点前确认，当天20点开始计算；20点后确认，次日开始计算；周日和节假日不计货期。
          <br />
          <p style="color: red" v-if="priceFormData.yssl * SLXNumValue > 19999">2万套48小时内发货，高于2万套请联系右下角人工客服确定货期。</p>
          <a href="/news/detail?id=102" class="bule">计时规则</a>
        </div>
        <div class="geRtSection" v-else>
          20点前确认，当天20点开始计算；20点后确认，次日20点开始计算；周日和节假日不计货期。
          <a href="/news/detail?id=102" class="bule">计时规则</a>
        </div>
        <div class="geRtSection chap red" v-if="$route.query.subCateId === '24'">
          <span class="red">温馨提示：</span><br />
          1、本通道仅限于用您自主设计的卡盒盒型刀模图进行下单，如文件导致的问题，责任自负；<br />
          2、本通道报价、货期只能作为参考，实际价格与生产货期以我司客服反馈为准 ；<br />
          3、本通道仅限卡盒下单，非卡盒品类在此下单不退款不生产，请您谅解；<br />
          4、建议按照对应盒型报价下单，价格比此通道更优惠，祝您下单愉快！
        </div>
        <div class="geRtSection chap red" v-if="$route.query.cateId === '5'">
          <span class="red">温馨提示：</span><br />
          本平台的生产原材料为优质的不干胶材料，但由于不同的标签材质有不同的用途，及针对不同的使用场景，客人在下单大货前， 需自己做好产品与标签的适配工作。
        </div>
        <div class="geRtSection" v-if="$route.query.subCateId === '24'">
          <p class="agree_check">
            <label>
              <!--              <input type="checkbox" name="agree" class="colored-danger btnCheckAll" value="1">-->
              <el-checkbox v-model="priceFormData.agreement" />
              <span class="text"></span>
            </label>
            <span>我已了解并同意以上免责声明</span>
          </p>
        </div>
      </div>
      <!-- 配送费用 -->

      <div class="geRtList" v-if="isCmsHidden()">
        <h4>配送费用</h4>
        <div class="costBox">
          <!-- <form class="flex areBox" action="">
            <div class="layui-form-item">
              <el-select size="small" v-model="priceFormData.provinceId" placeholder="请选择" style="width: 100px"
                @change="selectCity($event, 'province')">
                <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''">
                </el-option>
              </el-select>
            </div>
            <div class="layui-form-item">
              <el-select size="small" v-model="priceFormData.cityId" placeholder="请选择城市" style="width: 100px"
                @change="selectCity($event, 'city')">
                <el-option v-for="(item, index) in cityList" :key="index" :label="item"
                  :value="priceFormData.provinceId + '_' + index"> </el-option>
              </el-select>
            </div>
            <div class="layui-form-item">
              <el-select size="small" v-model="priceFormData.countyId" placeholder="请选择区/县" style="width: 100px"
                @change="selectCity($event, 'county')">
                <el-option v-for="(item, index) in countyList" :key="index" :label="item"
                  :value="priceFormData.cityId + '_' + index"> </el-option>
              </el-select>
            </div>
          </form> -->
          <div class="addressValue">
            <el-cascader ref="cascaderHandle" style="width: 320px;" :props="options" @change="handlerValue" placeholder="请选择配送地区"></el-cascader>
          </div>
          <div class="flex geRtkg">
            <span class="C9 kgColor goodsWeight">重量:{{ priceFormData.weight }}kg</span>
            <span class="red" v-if="priceFormData.shipping_fee === 0 && priceFormData.total_price > 0 && priceFormData.countyId">该地区不支持配送</span>
            <div v-else>
              <!--免运费活动-->
              <template v-if="isRemoteCity()">
                <span class="red en shipfee">¥{{ priceFormData.shipping_fee }}</span>
              </template>
              <template v-else>
                <div>
                  <div class="black en shipfee" style="text-decoration: line-through; text-align: right">¥{{ priceFormData.shipping_fee }}9999</div>
                  <div class="red en shipfee" style="margin-top: 5px">运费：¥{{ priceFormData.shipping_fee - getShippeFreePrice(priceFormData.shipping_fee) }}</div>
                </div>
              </template>
            </div>
          </div>
          <div class="flex geRtExpect">
            <i></i>
            <div class="geRtExpectxt">
              <p>预计发货</p>
              <p id="out_time">{{ priceFormData.out_time }}</p>
              <!-- <p class="red">临近年关，且因疫情影响，货期会有2-3天的波动</p> -->
            </div>
          </div>
        </div>
      </div>
      <div class="geRtList" v-if="isCmsHidden()">
        <div class="geRtotalBox" v-if="currentUser.vipRank <= 0 || currentUser.vipRank > 6">
          <p class="flex geRtotal" style="justify-content: space-between">
            <span
              >总计:
              <span id="price_total">
                <!--免运费活动-->
                <template v-if="isRemoteCity()"> ￥{{ getDiscountPrice(priceFormData.total_price) + priceFormData.shipping_fee }} </template>
                <template v-else>￥{{ getDiscountPrice(priceFormData.total_price) + priceFormData.shipping_fee - getShippeFreePrice(priceFormData.shipping_fee) }}</template>
              </span>
            </span>
            <span v-if="strJsonLength(priceFormData.goodsAttrMap) > 0" class="red en shipfee" @click="dialogVisible = true">报价单</span>
          </p>
        </div>
        <div class="geRtotalBox" v-else-if="currentUser.vipRank">
          <div class="yuanPrice">
            <div class="flex priceDv">
              <span class="priceDvL"><i></i>普通会员</span>
              <span class="priceDvR">
                <font id="price_old">
                  <!--免运费活动-->
                  <template v-if="isRemoteCity()"> ￥{{ priceFormData.price_old + priceFormData.shipping_fee }} </template>
                  <template v-else>￥{{ priceFormData.price_old + priceFormData.shipping_fee - getShippeFreePrice(priceFormData.shipping_fee) }}</template>
                </font>
              </span>
            </div>
          </div>
          <div class="geRtotal">
            <div class="flex priceDv">
              <span class="priceDvL"
                ><i class="vicon"></i>您的V{{ currentUser.vipRank }}会员价
                <div class="guigeTis">
                  ?
                  <div class="geTipstxt">
                    <s></s>
                    <div class="vipstx">
                      <p class="flex"><span>1.</span> <span>从2019年7月1日开始计算累计PO数量，PO数量不含标签</span></p>
                      <p class="flex"><span>2.</span> <span>线下报价订单不享受本优惠政策、卡盒特殊材质不享受优惠</span></p>
                      <p class="flex"><span>3.</span> <span>第1次下单PO不参与优惠，商品交付后开始计数</span></p>
                      <p class="flex"><span>4.</span> <span>物流费、税金不参与优惠</span></p>
                      <p class="flex"><span>5.</span> <span>会员到期：2025-05-04</span></p>
                    </div>
                  </div>
                </div>
              </span>
              <span class="priceDvR red">
                <font id="price_limit">
                  <template v-if="isRemoteCity()"> ￥{{ priceFormData.total_price + priceFormData.shipping_fee }} </template>
                  <template v-else>￥{{ priceFormData.total_price + priceFormData.shipping_fee - getShippeFreePrice(priceFormData.shipping_fee) }}</template>
                </font>
              </span>
            </div>
          </div>
          <p class="yuantiptxt">恭喜您获得傲彩的V{{ currentUser.vipRank }}会员等级，您将享受{{ rank[currentUser.vipRank] }}折的折扣，会员到期：2025-05-04</p>
          <!-- <p class="yuantiptxt">比普通会员优惠<span class="red">9%</span></p> -->
        </div>
        <div class="price" :style="priceFormData.total_price > 10000 && $route.query.cateId === '1' ? '' : 'display: none'">
          <input type="text" v-model="quoteMobile" class="quotemobile priceIput" placeholder="请输入您的电话号码" />
          <button @click="addQuote(quoteMobile, priceFormData.total_price)" class="priceBtn">申请人工核价</button>
          <br />
          <span class="priceTips">订单价格＞1万元，可申请人工核价，价格更优惠，输入联系电话，傲彩包装顾问将与您联系</span>
        </div>
        <div v-if="$route.query.cateId === '3'" style="color: red; font-size: 12px; padding-bottom: 10px">
          精装盒系统报价未完善，请点击右下角QQ客服人工报价
        </div>
        <!-- <p class="upPriceTips hide">抗击疫情，限时折扣！</p> -->
        <div class="flex geRtBtnDv">
          <a href="javascript:;" :disabled="priceFormData.submitProgress" @click="addCart('1')" class="buybtn goCart getBuy">立即购买</a>
          <a href="javascript:;" @click="addCart('0')" class="joinShoping buybtn btnCart curr"><i></i>加入购物车</a>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="850px" v-dialogDrag :close-on-click-modal="false" append-to-body>
      <div id="pdfDom" style="margin-top: -30px">
        <div style="color: black; margin: 0 10% 40px">
          <div style="text-align: left">
            <img src="@/static/index/img/quotation.png" style="width: 200px" />
          </div>
          <p style="text-align: center; font-size: 27px">报价单</p>
          <div style="text-align: right; margin-top: 20px">
            <div style="margin-bottom: 10px">
              <span style="padding: 5px 0">联系人：</span>
              <input type="text" style="border-bottom: 1px solid; width: 140px" />
            </div>
            <div style="margin-bottom: 10px">
              <span style="padding: 5px 0">电话：</span>
              <input type="text" style="border-bottom: 1px solid; width: 140px" />
            </div>
          </div>
          <table border="1 " width="100%" style="border-collapse: collapse; margin: 20px 0">
            <tbody>
              <tr class="tabHard">
                <td width="10% ">商品名称</td>
                <td width="10% ">项目</td>
                <td width="25% ">内容</td>
                <td width="10% ">数量</td>
                <td width="15% ">金额</td>
              </tr>
              <template>
                <tr v-for="(vo, index, number) in priceFormData.goodsAttrMap" :key="number">
                  <td v-show="number == 0" width="10% " :rowspan="strJsonLength(priceFormData.goodsAttrMap)">{{ topNav.name }}-{{ subNav.name }}</td>
                  <td width="10% " v-if="index == '烫金1'">烫金</td>
                  <td width="10% " v-else-if="index == '局部UV1'">局部UV</td>
                  <td width="10% " v-else-if="index == '击凸1'">击凸</td>
                  <td width="10% " v-else-if="index == '击凹1'">击凹</td>
                  <td width="10% " v-else>{{ index }}</td>
                  <td width="25% " v-if="vo == 'cross'">单面贴窗</td>
                  <td width="25% " v-else-if="vo == 'cross2'">跨二面贴窗</td>
                  <td width="25% " v-else-if="vo == 'cross3'">跨三面贴窗</td>
                  <td width="25% " v-else>{{ vo }}</td>
                  <td v-if="number == 0" width="10% " :rowspan="strJsonLength(priceFormData.goodsAttrMap)">{{ priceFormData.priceInfoMap.totalNum }}</td>
                  <td v-if="number == 0" width="15% " :rowspan="strJsonLength(priceFormData.goodsAttrMap)">{{ priceFormData.total_price }}元</td>
                </tr>
              </template>
              <tr>
                <td width="10% ">配送方式</td>
                <td width="10% " colspan="2"></td>
                <td width="10% ">运费预估</td>
                <td width="15% ">
                  <template v-if="isRemoteCity()"> {{ priceFormData.shipping_fee }}元 </template>
                  <template v-else>
                    <span> {{ priceFormData.shipping_fee - getShippeFreePrice(priceFormData.shipping_fee) }}元 </span>
                  </template>
                </td>
              </tr>
              <tr>
                <td width="10% ">货期</td>
                <td width="15% " colspan="2">{{ priceFormData.days }}天</td>
                <td width="10% ">总金额</td>
                <td width="15% ">
                  <!--免运费活动-->
                  <template v-if="isRemoteCity()"> {{ priceFormData.total_price + priceFormData.shipping_fee }} </template>
                  <template v-else>￥{{ priceFormData.total_price + priceFormData.shipping_fee - getShippeFreePrice(priceFormData.shipping_fee) }}</template
                  >元
                </td>
              </tr>
            </tbody>
          </table>
          <div style="margin-bottom: 10px">
            <span>备注：</span>
            <input type="text" style="border-bottom: 1px solid; width: 600px" />
          </div>
          <div>
            <span v-if="priceFormData.priceInfoMap">报价时间：{{ priceFormData.priceInfoMap.today }}</span>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 30px">
        <el-button type="danger" @click="quotation">下载报价单</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { ACCESS_TOKEN } from '@/store/global-constant';
import store from '@/store';
import { strEquals, strJsonLength } from '@/utils/strUtil';
import { getCity, getProvince } from '@/utils/city';
import { getSubNav, getTopNav } from '@/utils/cateNavsUtil';
import { getPaper } from '@/api/product/attrApi';
import { getDiscountByGoodsId } from '@/api/order/orderApi';
import { debounce } from '@/utils/utils';
export default {
  name: 'PriceRight',
  props: {
    priceFormData: Object,
    formData: Object,
    isShort: Boolean,
    addCart: Function,
    addQuote: Function,
    priceValuation: Function,
    newlist: Array,
    newid: String,
    loadingstatus: Boolean,
    goodsId: Number
  },
  data() {
    return {
      options: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          let provinceList = [];
          if (level == 0) {
            provinceList = getProvince();
          }
          if (level == 1) {
            provinceList = getCity(node.value);
          }
          if (level == 2) {
            provinceList = getCity(node.value);
          }
          let nodes = provinceList.map((item, index) => ({
            value: level == 0 ? index + '' : node.value + '_' + index,
            label: item,
            leaf: level >= 2
          }));
          resolve(nodes);
        }
      },
      checkList: ['复选框 A'],
      SLXNumValue: 0,
      quoteMobile: '',
      radio: '纸张材质:单铜纸_350',
      // radioService: '扎皮筋',
      currentUser: {},
      // loading:true,
      // provinceList: [],
      // cityList: [],
      // countyList: [],
      cateNavs: [],
      paperlist: [],
      zhflag: true,
      // newlist: [],
      topNav: { name: '' },
      subNav: { name: '' },
      // '0'  => '0',
      //   '1'  => '9.6',
      //   '2'  => '9.5',
      //   '3'  => '9.4',
      //   '4'  => '9.3',
      //   '5'  => '9.2',
      //   '6'  => '9',
      rank: {
        1: '9.9',
        2: '9.8',
        3: '9.7',
        4: '9.6',
        5: '9.5',
        6: '9.4'
      },
      dialogVisible: false,
      //"青海省", "台湾省", "内蒙古", "西藏", "香港", "澳门", "新疆"
      remoteCity: ['', '28', '33', '6', '25', '31', '32', '30'],
      goodsIdsCheckList: {}
    };
  },
  watch: {
    $route() {
      this.$refs.cascaderHandle.checkedValue = '';
      this.topNav = getTopNav(this.cateNavs, this.$route.query.cateId, this.$route.path.indexOf('/price')).data || {};
      this.subNav = getSubNav(this.cateNavs, this.$route.query.cateId, this.$route.query.subCateId, this.$route.path.indexOf('/price')) || {};
      this.ubdateextends();
    }
    // 'priceFormData.cextends':function(val){
    //   if(val){
    //     this.priceFormData.extends=val;
    //   }
    // }
    // loadingstatus() {
    //   this.goodsIdsCheck();
    // },
    // 'priceFormData.total_price': function() {
    //   this.goodsIdsCheck();
    // }
  },
  created() {
    // this.provinceList = getProvince();
    if (localStorage.getItem(ACCESS_TOKEN) != null) {
      if (store.getters.userInfo != null && store.getters.userInfo.id) {
        this.setUserInfo();
      } else {
        store.dispatch('GetUserInfo').then(() => {
          this.setUserInfo();
        });
      }
    }
    if (store.getters.priceCateNavs.length === 0) {
      store.dispatch('GetPriceCateNavs').then(() => {
        this.cateNavs = store.getters.priceCateNavs;
        if (this.$route.query.cateId && this.$route.query.subCateId) {
          this.topNav = getTopNav(this.cateNavs, this.$route.query.cateId, this.$route.path.indexOf('/price'))?.data;
          this.subNav = getSubNav(this.cateNavs, this.$route.query.cateId, this.$route.query.subCateId, this.$route.path.indexOf('/price'));
        }
      });
    } else {
      this.cateNavs = store.getters.priceCateNavs;
      if (this.$route.query.cateId && this.$route.query.subCateId) {
        this.topNav = getTopNav(this.cateNavs, this.$route.query.cateId, this.$route.path.indexOf('/price')).data;
        this.subNav = getSubNav(this.cateNavs, this.$route.query.cateId, this.$route.query.subCateId, this.$route.path.indexOf('/price'));
      }
    }
    // getPaper({ data: '4759_22625' }).then(res => {
    //   this.newlist = res.data;
    //   this.loading=false
    // });
    // getPaper({data:'4759_22625'}).then(res=>{
    //   this.paperlist=res.data
    // })
    // if(this.$route.query.cateId=='1'&&this.$route.query.subCateId=='24'){
    //   this.zhflag=false
    // }
    this.ubdateextends();
  },
  methods: {
    ...{ strEquals, strJsonLength },
    setUserInfo() {
      let _this = this;
      _this.currentUser = store.getters.userInfo;
      if (_this.currentUser.vipRank > 6 && _this.currentUser.vipRank <= 10) {
        _this.currentUser.vipRank = 6;
      }
    },
    goodsIdsCheck: debounce(function(list) {
      let _this = this;
      let time = new Date().getTime(); //获取当前的时间戳
      // console.log('(_this.$store.state.user.activitye',_this.$store.state.user.activitye)
      let maxTime = new Date(_this.$store.state.user.activitye).getTime(); //最后的弹窗时间，超过弹窗时间不显示
      if (time > maxTime) return;
      getDiscountByGoodsId({
        list: [_this.goodsId]
      }).then(res => {
        // console.log('getDiscountByGoodsId', res);
        if (res.success) {
          // _this.goodsIdsCheckList = res.data;
        }
      });
    }, 500),
    setSLXNumValue(val) {
      this.SLXNumValue = val;
    },
    getUnitPrice(price, num) {
      if (price > 0 && num > 0) {
        return (price / num).toFixed(2);
      }
      return 0;
    },
    /**
     * 2022.6.11-2022.7.10
     * 商品首单活动 折扣价
     */
    getDiscountPrice(price) {
      let _this = this;
      return _this.goodsIdsCheckList[_this.goodsId] ? Math.ceil(price * 0.9) : price;
      // return  Math.ceil(price*0.9)
    },
    selectExtends(val) {
      if (!strEquals(val, this.priceFormData.extends)) {
        this.priceFormData.extends = val;
        this.priceValuation(this.radio);
      }
      // console.log('this.priceFormData.extends==',this.priceFormData.extends);
    },
    ubdateextends() {
      if (this.$route.query.cateId == 1 || this.$route.query.subCateId == 42) {
        this.priceFormData.extends = '1';
      }
    },
    handlerValue(val) {
      this.priceFormData.provinceId = val ? val[0] : '';
      this.priceFormData.cityId = val ? val[1] : '';
      this.priceFormData.countyId = val ? val[2] : '';
      console.log('val', val);
      this.priceFormData.total_price = 0;
      this.priceValuation(this.radio);
    },
    // selectCity (val, type) {
    //   if (type === 'province') {
    //     this.$set(this.priceFormData, 'cityId', '');
    //     this.$set(this, 'cityList', getCity(this.priceFormData.provinceId));
    //   }
    //   if (type === 'province') {
    //     this.$set(this.priceFormData, 'cityId', '');
    //     this.$set(this, 'cityList', getCity(this.priceFormData.provinceId));
    //   }
    //   if (type === 'province') {
    //     this.$set(this.priceFormData, 'cityId', '');
    //     this.$set(this.priceFormData, 'countyId', '');
    //     this.$set(this, 'cityList', getCity(this.priceFormData.provinceId));
    //     this.$set(this, 'countyList', []);
    //   } else if (type === 'city') {
    //     this.$set(this.priceFormData, 'countyId', '');
    //     this.$set(this, 'countyList', getCity(this.priceFormData.cityId));
    //   }
    //   this.priceValuation(this.radio);
    // },
    // // 新增服务
    // addService(type, val) {
    //   if (type == 1) {
    //     if (!strEquals(val, this.priceFormData.radioService)) {
    //       this.$set(this.priceFormData, 'radioService', val);
    //     }
    //   } else {
    //     console.log('新增服务val', val);
    //     this.$set(this.priceFormData, 'checkedService', val);
    //   }
    //   // console.log('新增服务', this.priceFormData.radioService);
    //   this.priceValuation(this.radio);
    // },
    PaperChange() {
      this.getDiscountPrice();
      this.priceValuation(this.radio);
    },
    PaperChange2() {
      this.priceValuation(this.radio);
    },
    getraradio() {
      return this.radio;
    },
    setradio(data) {
      this.radio = data;
    },
    // zhupdate1(){
    //   this.zhflag=false
    // },
    // zhupdate2(){
    //   this.zhflag=true
    // },
    emptyId() {
      this.radio = '';
    },
    //报价单html2Canvas
    quotation(index) {
      var title = '傲彩报价单';
      var scroll = document.documentElement.scrollTop || document.body.scrollTop;
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true,
        taintTest: false,
        useCORS: true,
        dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
        scale: 4 //按比例增加分辨率
      }).then(function(canvas) {
        // document.body.scrollTop = scroll;
        // document.documentElement.scrollTop = scroll;
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        let PDF = new JsPDF('', 'pt', 'a4');
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }

        PDF.save(title + '.pdf');
      });
    },
    //是否偏远地区
    isRemoteCity() {
      let today = new Date();
      let startDate = new Date(this.$store.state.user.activitys);
      let endDate = new Date(this.$store.state.user.activitye);
      if (today < startDate || today > endDate) {
        return true;
      }
      if (this.remoteCity.indexOf(this.priceFormData.provinceId) > -1) {
        return true;
      }
      return this.$store.state.user.activitystatus;
    },
    getShippeFreePercent() {
      let today = new Date();
      let startDate = new Date(this.$store.state.user.activitys);
      let endDate = new Date(this.$store.state.user.activitye);
      if (today < startDate || today > endDate) {
        return;
      }
      if (this.remoteCity.indexOf(this.priceFormData.provinceId) > -1) {
        return;
      }
      if (this.priceFormData.provinceId == '19') {
        return 0.3;
      } else {
        return 0.8;
      }
    },
    getShippeFreePrice(shippefee) {
      return shippefee * this.getShippeFreePercent() - 2000 > 0 ? 2000 : Math.floor(shippefee * this.getShippeFreePercent());
    },
    // 当是后台管理系统访问时，隐藏不必要的展示
    isCmsHidden() {
      if (this.$route.query.isCms) return false;
      return true;
    }
  }
};
</script>
<style>
.radio_box .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #ff0036;
  border-color: #ff0036;
}

.radio_box .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #000;
  font-weight: bold;
}

.radio_box .el-checkbox__inner:hover {
  border-color: #ff0036;
}

.radio_box .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #ff0036;
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
<style scoped>
.geRtListkg {
  margin-top: 20px;
}

.geRtListkg li {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-top: 0;
  border-bottom: 0;
  padding: 0;
}

.radio_box {
  background-color: #edeef0;
  padding: 12px;
  cursor: pointer;
}

.geRtListkglist {
  width: 309px;
  height: 45px;
  line-height: 55px;
  border-bottom: 1px solid #e0e0e0;
  padding-left: 10px;
}

.active {
  font-weight: bold;
  background-color: #fff !important;
  border-bottom: 1px solid #edeef0;
}

.packServe {
  width: 296px;
  border-bottom: none;
  line-height: 40px;
  box-sizing: border-box;
  padding: 10px 20px 10px 14px;
  background: #f5f5f5;
}

.labelr .el-radio__input {
  display: none;
}

.radio_box {
  background-color: #edeef0;
  padding: 12px;
  cursor: pointer;
}

.active {
  font-weight: bold;
  background-color: #fff !important;
  border-bottom: 1px solid #edeef0;
}

.packServe {
  width: 296px;
  border-bottom: none;
  line-height: 40px;
  box-sizing: border-box;
  padding: 10px 20px 10px 14px;
  background: #f5f5f5;
}

.labelr .el-radio__input {
  display: none;
}

.radio_box {
  background-color: #edeef0;
  padding: 12px;
  cursor: pointer;
}
</style>

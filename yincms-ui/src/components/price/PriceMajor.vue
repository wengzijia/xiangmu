<template>
  <div class="EattrMbox">
    <div class="guigeImg tgimg" v-if="tgimg" :style="$route.query.disposable ? 'width:200px' : ''">
      <img :src="tgimg" alt="" />
    </div>
    <el-form class="EattrMain" ref="formData" :model="formData" label-width="130px" @submit.native.prevent size="small">
      <template v-for="(item, index) in formVoList">
        <!-- 微坑盒拼版印刷提示 -->
        <div :key="'pbyhts' + index" v-if="item.miniZtAttrGroup.code == 'YSLX_PBYS_MZCZ'" style="margin-left: 64px; margin-bottom: 20px; font-size: 12px">
          <span style="color: red">温馨提示：</span>拼版印刷500个起订，100个递增，超过1000个按照1000个递增印刷数量，专版印刷100个起订。
        </div>
        <!-- <template v-if="endWith(item.miniZtAttrGroup.code, 'ZJGY_BK_YSYS') && formData.bkstatus">
          <el-form-item :key="'bkczkz_' + index" label="裱卡按钮:">
            <template slot="label">
              <div class="EattrLab">
                <span class="red">*</span>
                裱卡材质/克重
              </div>
            </template>
            <div class="Eattrrow el-row">
              <label role="radio" aria-checked="true" tabindex="0" class="el-radio-button el-radio-button--small is-active" size="small">
                <input type="radio" tabindex="-1" class="el-radio-button__orig-radio" value="15310_48642" />
                <span class="el-radio-button__inner" style="border-color: #e60021"> {{ formData.bkkg }}g </span>
              </label>
            </div>
          </el-form-item>

          <el-form-item :key="'bkbmcl_' + index" label="表面处理:">
            <template slot="label">
              <div class="EattrLab">
                <span class="red">*</span>
                表面处理
              </div>
            </template>
            <div class="Eattrrow el-row">
              <label role="radio" aria-checked="true" tabindex="0" class="el-radio-button el-radio-button--small is-active" size="small">
                <input type="radio" tabindex="-1" class="el-radio-button__orig-radio" value="15310_48642" />
                <span class="el-radio-button__inner" style="border-color: #e60021">
                  {{ formData.bkbmcl }}
                </span>
              </label>
            </div>
          </el-form-item>
        </template> -->
        <template>
          {{ endWith(item.miniZtAttrGroup.code, 'SL') ? setX(item.attrList[0].name) : '' }}
        </template>
        <el-form-item :key="'reminderbkz_' + index" v-if="strEquals($route.query.cateId, '2') && strEquals(item.miniZtAttrGroup.code, 'ZJGY')" label="见坑纸信息:">
          <template slot="label">
            <div class="EattrLab">
              <span class="red">*</span>
              见坑纸信息
            </div>
          </template>
          {{ formData.zcjgpb }}
        </el-form-item>
        <el-form-item :key="'reminderwx_' + index" v-if="strEquals($route.query.cateId, '70') && strEquals(item.miniZtAttrGroup.code, 'YSYS')">
          <template slot="label">
            <div class="EattrLab">
              <span class="red">*</span>
              材质信息
            </div>
          </template>
          {{ formData.zcjgpb }}
        </el-form-item>
        <!--  -->
        <el-form-item :key="'reminder3_' + index" v-if="strEquals($route.query.cateId, '2') && strEquals(item.miniZtAttrGroup.code, 'GY_TC')">
          <div class="Emtils">温馨提示：平台贴窗材质为PET，离折线≥15mm，用厚度为0.15±0.03mm胶片； 离折线＜12mm，用厚度为0.10±0.02mm胶片</div>
        </el-form-item>
        <el-form-item :key="'reminder2_' + index" v-if="strEquals($route.query.cateId, '1') && strEquals(item.miniZtAttrGroup.code, 'ZJGY')">
          <div class="Pantips"><span class="red">温馨提示:</span> 如果您的设计文件中使用了三色或四色混合(浅灰、灰、深灰、黑)、暗红色、浅红色、墨绿色、蓝紫色、深紫色、深褐色、咖啡色等色，建议您选择专色印刷，否则出现色差问题不予受理。</div>
        </el-form-item>
        <el-form-item v-if="item.miniZtAttrGroup.reminder != null && item.miniZtAttrGroup.reminder !== ''" :key="'reminder_' + index">
          <div class="Emtils">
            {{ item.miniZtAttrGroup.reminder }}
          </div>
        </el-form-item>
        <el-form-item
          :key="index"
          :class="strEquals(item.miniZtAttrGroup.actualValue, 'isshow') ? 'ishow' : ''"
          :name="($route.query.disposable && endWith(item.miniZtAttrGroup.code, 'HX')) || hidefu(item.miniZtAttrGroup.name, $route.query.subCateId, $route.query.cateId) ? 'hidename' : ''"
        >
          <!--工艺 弹层-->
          <template slot="label">
            <div class="EattrLab" :class="item.miniZtAttrGroup.actualValue == 'is' && item.miniZtAttrGroup.code.indexOf(msize) > 0 ? 'titlenone' : ''">
              <!-- :class="$route.query.cateId==122&&item.attrList[0].prefix.indexOf(msize)==-1&&item.attrList[0].prefix!='all'? 'titlenone1':''" -->
              <!-- {{msize}} -->

              <!--              不展示数据-->
              <template v-if="strEquals($route.query.cateId, '86') || strEquals($route.query.cateId, '121')">
                <span class="red" v-if="item.miniZtAttrGroup.required === 1 && !endWith(item.miniZtAttrGroup.code, 'SL') && item.miniZtAttrGroup.showName === 1">*</span>
                {{ item.miniZtAttrGroup.showName === 1 && !endWith(item.miniZtAttrGroup.code, 'SL') ? item.miniZtAttrGroup.name : '' }}
              </template>
              <template v-else>
                <span class="red" v-if="item.miniZtAttrGroup.required === 1 && item.miniZtAttrGroup.showName === 1">*</span>
                <!--                <span class="red" v-if="$route.query.cateId==10&&item.miniZtAttrGroup.name=='材质'">*</span>-->
                {{ item.miniZtAttrGroup.showName === 1 ? item.miniZtAttrGroup.name : '' }}
                <el-tooltip v-if="$route.query.cateId == 10 && endWith(item.miniZtAttrGroup.code, 'TGCC')" width="200" class="item" effect="light" placement="top-start">
                  <div slot="content">{{ item.miniZtAttrGroup.bindId == 94 ? '请输入直径，傲彩为您推荐尺寸相近铁罐' : '请输入长宽，傲彩为您推荐尺寸相近铁盒' }}</div>
                  <em class="guigeTis">?</em>
                </el-tooltip>
                <p style="line-height: 5px" v-if="$route.query.cateId == 10 && endWith(item.miniZtAttrGroup.code, 'TGCC')">{{ item.miniZtAttrGroup.bindId == 94 ? '(直径*高)' : '(长*宽*高)' }}</p>
              </template>
            </div>
            <div v-if="endWith(item.miniZtAttrGroup.code, 'YSBH')">
              <a style="color: red" href="/goods/goodsDesc?gid=919" target="_blank">(查看颜色详情)</a>
            </div>
            <div v-if="false && endWith(item.miniZtAttrGroup.code, 'WLXX')">
              <a style="color: red" href="javascript:void(0)" @click="dialogVisible = true">(查看压纹详情)</a>
            </div>
            <div v-if="strEquals(item.miniZtAttrGroup.code, 'BMCL_BRB_FBYS')">
              <span class="viewVeins charpieTips" @click="fbysDialogVisible = true">(查看绒布颜色参照)</span>
            </div>
          </template>
          <!-- 文本框 -->
          <el-row class="flex inputBx Layerinpts" style="flex-wrap: wrap" v-if="strEquals(item.miniZtAttrGroup.groupType, 'input')">
            <!-- <div class="inputBxrow" v-for="attr in item.attrList" :key="attr.id">
              <el-input v-model="formData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small" @change="priceValuation">
                <template slot="append">{{ attr.suffix }}</template>
              </el-input>
            </div> -->
            <template v-if="endWith(item.miniZtAttrGroup.code, 'TGCC')">
              <div class="inputBxrow tgcc" v-for="attr in item.attrList" :key="attr.id">
                <el-input
                  :style="attr.suffix ? '' : 'width:130px'"
                  v-model="formData.inputValues[attr.groupId + '_' + attr.id]"
                  :disabled="disabledflag"
                  :placeholder="attr.inputTips"
                  size="small"
                  @focus="inpfocus"
                  @input="tgchange(attr, attr.groupId + '_' + attr.id)"
                >
                  <template slot="append" v-if="attr.suffix">{{ attr.suffix }}</template>
                </el-input>
              </div>
              <!-- 非后台访问 -->
              <span class="anew" v-if="anewflag && !$route.query.isCms" @click="anewfn">重新筛选</span>
              <!-- 后台访问 -->
              <span class="anew" v-if="($route.query.isCms && noFlatDisabled) || $route.query.isnum" @click="anewfn">重新筛选</span>
              <div style="float: left; width: 100%; margin-top: 10px" v-if="cclist.length > 0">
                <!-- <el-radio-group class="EattrMgroup" size="small" v-model="formData.radioSelectValues[item.miniZtAttrGroup.id]" @change="radioSelect" button-style="solid"> -->
                <div v-for="(citem, i) in cclist" :key="i" style="float: left">
                  <el-radio-group class="EattrMgroup" size="small" v-model="ccdata" button-style="solid" @change="tgclick(citem)">
                    <el-row class="Eattrrow">
                      <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                        <template slot="content">
                          <!-- <div class="EattrMtips"><img width="100%" :src="citem.imagesPath?'/' + citem.imagesPath:citem.photoPath1" alt="" /></div> -->
                          <div class="EattrMtips"><img width="100%" :src="citem.imagesPath ? 'https://aocai.cn/' + citem.imagesPath : 'https://aocai.cn' + citem.photoPath1" alt="" /></div>
                        </template>
                        <el-radio-button size="small" :label="citem.id">{{ citem.size }}</el-radio-button>
                      </el-tooltip>
                    </el-row>
                  </el-radio-group>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="inputBxrow" v-for="attr in item.attrList" :key="attr.id">
                <el-input-number
                  v-if="$route.query.subCateId == '120'"
                  :style="attr.suffix ? '' : 'width:130px'"
                  v-model="formData.inputValues[attr.groupId + '_' + attr.id]"
                  :placeholder="attr.inputTips"
                  size="small"
                  @change="priceValuation"
                  :min="0"
                  :step="100"
                  step-strictly
                >
                  <template slot="append" v-if="attr.suffix">{{ attr.suffix }}</template>
                </el-input-number>
                <el-input
                  v-else
                  :style="attr.suffix ? '' : 'width:378px'"
                  v-model="formData.inputValues[attr.groupId + '_' + attr.id]"
                  :disabled="noFlatDisabled"
                  :placeholder="attr.inputTips"
                  size="small"
                  @keyup.native="inpkey(attr.groupId + '_' + attr.id)"
                  @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '', formData.inputValues[attr.groupId + '_' + attr.id], attr.suffix, attr.groupId + '_' + attr.id)"
                >
                  <template slot="append" v-if="attr.suffix">{{ attr.suffix }}</template>
                </el-input>
              </div>
            </template>
            <!-- <div>
              <p>demo</p>
            </div> -->

            <div class="group-copy-div" v-if="isCopyCraft(item.miniZtAttrGroup.code) && !endWith(item.miniZtAttrGroup.code, '_COPY')">
              <el-button size="mini" round type="danger" @click="addCopyGroupCk(item.miniZtAttrGroup.parentAttrId)" :disabled="readioDisabled(item)">增加{{ item.miniZtAttrGroup.name }}</el-button>
              <el-button size="mini" round type="info" @click="removeCopyGroupCk({ pid: item.miniZtAttrGroup.pid, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: false })" :disabled="readioDisabled(item)"
                >取消{{ item.miniZtAttrGroup.name }}</el-button
              >
            </div>

            <div class="group-copy-div" v-if="isCopyCraft(item.miniZtAttrGroup.code) && endWith(item.miniZtAttrGroup.code, '_COPY')">
              <el-button size="mini" round type="info" :disabled="readioDisabled(item)" @click="removeCopyGroupCk({ pid: item.miniZtAttrGroup.pid, copyIndex: item.copyIndex, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: true })"
                >删除</el-button
              >
            </div>
          </el-row>

          <!-- 单选框 -->
          <div class="flex" v-else-if="strEquals(item.miniZtAttrGroup.groupType, 'radio')" :class="item.miniZtAttrGroup.showName === 0 ? 'oAtrLayer' : ''">
            <!-- 塑料盒尺寸样式 :style="strEquals($route.query.cateId, '86') && endWith(item.miniZtAttrGroup.code, 'CC') ? 'border: 1px solid #dbe0e4;padding: 20px 0 20px 20px;height:120px;overflow-y:scroll' : ''"-->
            <el-radio-group class="EattrMgroup" size="small" v-model="formData.radioSelectValues[item.miniZtAttrGroup.id]" @change="radioSelect" button-style="solid">
              <el-row class="Eattrrow" v-for="attr in item.attrList" :key="'attr_' + attr.id">
                <template v-if="attr.remark != '' && attr.remark != null">
                  <!-- 后台访问不需要 显示图片说明 -->
                  <el-tooltip width="200" v-if="!$route.query.isCms" class="item" effect="light" placement="top-start" :enterable="$route.query.cateId == 86 || $route.query.cateId == 121 ? false : true">
                    <template slot="content">
                      <div class="EattrMtips" @click="consultantService" v-html="convertRemark(attr.remark)"></div>
                    </template>
                    <el-radio-button size="small" :disabled="readioDisabled(item, attr)" :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-radio-button>
                  </el-tooltip>
                  <el-radio-button :disabled="readioDisabled(item, attr)" size="small" v-else :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-radio-button>
                </template>
                <!--                不展示数据-->
                <template v-else-if="(strEquals($route.query.cateId, '86') || strEquals($route.query.cateId, '121')) && endWith(item.miniZtAttrGroup.code, 'SL')"></template>
                <template v-else>
                  <template>
                    <el-radio-button size="small" @click.native.prevent="clickitem(attr.groupId + '_' + attr.id, item.miniZtAttrGroup.id, attr.inputTips)" :label="attr.groupId + '_' + attr.id" v-if="endWith(item.miniZtAttrGroup.code, 'QTGY_CK')">
                      {{ attr.name }}
                      <!-- {{ item.miniZtAttrGroup.pid }} -->
                    </el-radio-button>

                    <template v-else-if="$route.query.cateId == 122">
                      <template v-if="attr.defaultValue == 'img'">
                        <el-tooltip width="200" class="item" effect="light" placement="top-start" v-show="attr.prefix.indexOf(msize) > -1 || attr.prefix == 'all'" :enterable="false">
                          <template slot="content">
                            <div class="EattrMtips">
                              <img
                                width="100%"
                                :src="attr.name + msize + '.png'"
                                v-if="
                                  item.miniZtAttrGroup.code == 'HZYS' ||
                                    attr.actualValue == '盒内搭配:空盒' ||
                                    attr.actualValue == '上层:空盒' ||
                                    attr.actualValue == '下层:空盒' ||
                                    attr.actualValue == '上层内盒:空盒' ||
                                    attr.actualValue == '下层内盒:空盒'
                                "
                              />
                              <img width="100%" :src="attr.name" v-else />
                              <p>{{ attr.actualValue.substring(attr.actualValue.lastIndexOf(':') + 1, attr.actualValue.length) }}</p>
                            </div>
                          </template>
                          <el-radio-button size="small" :label="attr.groupId + '_' + attr.id" :class="attr.defaultValue == 'img' ? 'padd' : ''">
                            <img
                              width="50px"
                              height="50px"
                              :src="attr.name + msize + '.png'"
                              v-if="
                                item.miniZtAttrGroup.code == 'HZYS' ||
                                  attr.actualValue == '盒内搭配:空盒' ||
                                  attr.actualValue == '上层:空盒' ||
                                  attr.actualValue == '下层:空盒' ||
                                  attr.actualValue == '上层内盒:空盒' ||
                                  attr.actualValue == '下层内盒:空盒'
                              "
                            />
                            <!-- <img width="50px" :src="attr.name+msize+'.png'" v-else-if=""> -->
                            <img width="50px" height="50px" :src="attr.name" v-else />
                            <!-- <template v-else>{{ attr.name }}</template> -->
                          </el-radio-button>
                        </el-tooltip>
                      </template>
                      <template v-else>
                        <el-radio-button size="small" :label="attr.groupId + '_' + attr.id" style="margin-top: 12px">
                          {{ attr.name }}
                        </el-radio-button>
                      </template>
                    </template>

                    <el-radio-button size="small" :disabled="item.miniZtAttrGroup.name == '品类' && $route.query.cateId == 13 ? ($route.query.flat == 'true' ? true : false) : readioDisabled(item, attr)" :label="attr.groupId + '_' + attr.id" v-else>
                      {{ attr.name }}
                      <!-- {{attr.id}}
                      {{attr.groupId}} -->
                    </el-radio-button>
                  </template>
                </template>
              </el-row>
              <div class="group-copy-div1" v-if="strEquals(item.miniZtAttrGroup.code, 'FHCCZ')">
                <el-button round size="mini" type="danger" :disabled="readioDisabled(item)" @click="addCopyGroupRd(item.miniZtAttrGroup.id, 4)">增加复合层</el-button>
                <el-button round size="mini" type="info" :disabled="readioDisabled(item)" @click="removeCopyGroupRd({ id: item.miniZtAttrGroup.id, copyIndex: 0, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: false })">取消复合层</el-button>
                <div style="clear: both"></div>
              </div>
              <div class="group-copy-div1" v-if="startWith(item.miniZtAttrGroup.code, 'FHCCZ') && endWith(item.miniZtAttrGroup.code, '_COPY')">
                <el-button round size="mini" type="info" :disabled="readioDisabled(item)" @click="removeCopyGroupRd({ id: item.miniZtAttrGroup.id, copyIndex: item.copyIndex, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: true })"
                  >删除</el-button
                >
              </div>
            </el-radio-group>
            <!-- 专色 -->
            <span class="colorNumbr" v-if="(strEquals($route.query.cateId, '8') || strEquals($route.query.subCateId, '40')) && strEquals(item.miniZtAttrGroup.code, 'YSYS')">
              <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨" :disabled="noFlatDisabled">加印白墨</el-checkbox-button>
            </span>
            <span v-if="item.miniZtAttrGroup.code == 'YSLX_PBYS_BMCL'">(备注:如需光胶或哑胶选专版印刷)</span>
            <span v-if="item.miniZtAttrGroup.code == 'YSLX_PBYS_QCP'">(备注:如需圆角或异形选专版印刷)</span>
            <!-- 折页说明书表面处理显示 -->
            <span v-if="item.miniZtAttrGroup.code == 'YSLX_PBYS_BMCL_T'">(备注:如需过胶,请选择专版印刷)</span>
            <!-- 微坑盒拼版印刷面纸材质显示 -->
            <span v-if="item.miniZtAttrGroup.code == 'YSLX_PBYS_MZCZ'" style="color: red">(更多材质或需考虑坑纹方向请选专版印刷)</span>
            <!-- 卡纸盒自定义盒型粘合显示 -->
            <span v-if="item.miniZtAttrGroup.name == '粘合' && strEquals($route.query.subCateId, '24')">(此粘合是指粘口位的粘合工艺)</span>
            <span v-if="strEquals(bindType, 'cate')">
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'SGYSYS')">
                专色数量:
                <el-select v-model="formData.sgYsys.scCount" style="width: 100px" @change="priceValuation" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'XGYSYS')">
                专色数量:
                <el-select v-model="formData.xgYsys.scCount" style="width: 100px" @change="priceValuation" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'YSXZ')">
                <el-checkbox-button @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" :disabled="noFlatDisabled" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨"
                  >加印白墨</el-checkbox-button
                >
                专色数量:
                <el-select v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'BK_YSYS') && showBKYSYS">
                专色数量:
                <el-select v-model="formData.bqys.scCount" style="width: 100px" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'ZJGY_YSYS')">
                专色数量:
                <el-select v-model="formData.bqys.scCount" style="width: 100px" @change="priceValuation" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span
                class="colorNumbr"
                v-if="
                  ((strEquals($route.query.cateId, '2') && item.miniZtAttrGroup.parentAttrName != '裱卡') ||
                    (strEquals($route.query.cateId, '4') && strEquals($route.query.subCateId, '35') && item.miniZtAttrGroup.code == 'YSYS') ||
                    (strEquals($route.query.cateId, '9') && strEquals($route.query.subCateId, '46') && formData.radioSelectValues['6668'] && formData.radioSelectValues['6668'].indexOf('6668_29877') > -1) ||
                    (strEquals($route.query.cateId, '9') && strEquals($route.query.subCateId, '47') && formData.radioSelectValues['6705'] && formData.radioSelectValues['6705'].indexOf('6705_30004') > -1) ||
                    (strEquals($route.query.cateId, '81') && strEquals($route.query.subCateId, '82')) ||
                    strEquals($route.query.cateId, '70') ||
                    strEquals($route.query.cateId, '13')) &&
                    endWith(item.miniZtAttrGroup.code, 'YSYS')
                "
              >
                <el-checkbox-button
                  @change="priceValuation"
                  class="major-check"
                  :disabled="noFlatDisabled"
                  v-if="formData.dmys.jybm && !(strEquals($route.query.cateId, '9') && (strEquals($route.query.subCateId, '46') || strEquals($route.query.subCateId, '47')))"
                  v-model="formData.dmys.jybmVal"
                  label="加印白墨"
                  >加印白墨</el-checkbox-button
                >
                专色数量:
                <el-select v-if="strEquals($route.query.cateId, '81') && strEquals($route.query.subCateId, '82')" :disabled="noFlatDisabled" v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation()">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                  <el-option label="5" :value="5"></el-option>
                  <el-option label="6" :value="6"></el-option>
                </el-select>
                <el-select v-else v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option v-if="$route.query.cateId !== '2'" label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="strEquals($route.query.cateId, '10') && endWith(item.miniZtAttrGroup.code, 'YSYS')">
                <!--                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>-->
                <el-checkbox-button @change="priceValuation" :disabled="noFlatDisabled" class="major-check" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
                专色数量:
                <el-select v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'SMYS_ZM')">
                <el-checkbox-button @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" class="major-check" v-if="formData.zmys.jybm" v-model="formData.zmys.jybmVal" :disabled="noFlatDisabled" label="加印白墨"
                  >加印白墨</el-checkbox-button
                >
                专色数量:
                <el-select v-model="formData.zmys.scCount" style="width: 100px" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'SMYS_FM')">
                <el-checkbox-button @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" class="major-check" v-if="formData.fmys.jybm" v-model="formData.fmys.jybmVal" :disabled="noFlatDisabled" label="加印白墨"
                  >加印白墨</el-checkbox-button
                >
                专色数量:
                <el-select v-model="formData.fmys.scCount" style="width: 100px" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>

              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'BJYGY_BK_YSYS1')">
                <!-- <el-checkbox-button @change="priceValuation()" class="major-check" v-if="formData.zmys.jybm" v-model="formData.zmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button> -->
                专色数量:
                <el-select v-model="formData.bj1ys.scCount" style="width: 100px" @change="priceValuation()" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'BJEGY_BK_YSYS2')">
                <!-- <el-checkbox-button @change="priceValuation()" class="major-check" v-if="formData.fmys.jybm" v-model="formData.fmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button> -->
                专色数量:
                <el-select v-model="formData.bj2ys.scCount" style="width: 100px" @change="priceValuation()" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <!-- 传统标签 -->
              <span class="colorNumbr" v-if="strEquals($route.query.cateId, '5') && strEquals($route.query.subCateId, '41') && endWith(item.miniZtAttrGroup.code, 'YSYS')">
                专色数量:
                <!-- 印刷颜色:多色 (CMYK) -->
                <el-select v-if="formData.radioSelectValues['6448'] && formData.radioSelectValues['6448'].includes('6448_29118')" v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation()" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                </el-select>
                <!-- 印刷颜色:无 -->
                <el-select v-if="formData.radioSelectValues['6448'] && formData.radioSelectValues['6448'].includes('6448_65444')" v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation()" :disabled="noFlatDisabled">
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                  <el-option label="5" :value="5"></el-option>
                  <el-option label="6" :value="6"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="strEquals($route.query.cateId, '70') && endWith(item.miniZtAttrGroup.code, 'YSYS')">
                印刷面:
                <el-select v-model="formData.ysm.scCount" style="width: 100px" @change="ysmChange" :disabled="noFlatDisabled">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                  <el-option label="5" :value="5"></el-option>
                  <el-option label="6" :value="6"></el-option>
                </el-select>
              </span>
            </span>
          </div>

          <!-- 复选框 -->
          <div v-else-if="strEquals(item.miniZtAttrGroup.groupType, 'checkbox')">
            <!-- {{endWith(item.miniZtAttrGroup.id, '7745')}} -->
            <el-checkbox-group class="EattrMgroup" size="small" v-model="formData.checkBoxSelectValues[item.miniZtAttrGroup.id]" :disabled="noFlatDisabled" @change="checkboxSelect({ event: $event, code: item.miniZtAttrGroup.id })">
              <el-row class="Eattrrow" v-for="attr in item.attrList" :key="'attr_' + attr.id">
                <template v-if="attr.remark !== '' && attr.remark != null">
                  <el-tooltip class="item" effect="light" placement="top-start">
                    <template slot="content">
                      <div class="EattrMtips" @click="consultantService" v-html="convertRemark(attr.remark)"></div>
                    </template>
                    <el-checkbox-button :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-checkbox-button>
                  </el-tooltip>
                </template>
                <el-checkbox-button size="small" v-show="attr.prefix.indexOf(msize) > -1 || attr.prefix == 'all'" :class="attr.defaultValue == 'img' ? 'padd' : ''" :label="attr.groupId + '_' + attr.id" v-else-if="$route.query.cateId == 122">
                  <template v-if="attr.defaultValue == 'img'"><img width="50px" :src="attr.name"/></template>
                  <template v-else>{{ attr.name }}</template>
                  <!-- {{attr.prefix}} -->
                </el-checkbox-button>
                <el-checkbox-button
                  v-else
                  :label="attr.groupId + '_' + attr.id"
                  :class="$route.query.subCateId == 28 && attr.id == '53504' && formData.radioSelectValues[5896] == '5896_32267' ? 'hideclass' : ''"
                  :disabled="readioDisabled(item, attr)"
                  >{{ attr.name }}</el-checkbox-button
                >
              </el-row>
            </el-checkbox-group>
            <span class="colorNumbr" v-if="strEquals($route.query.cateId, '10') && item.miniZtAttrGroup.code == 'YSGY'">
              <!-- <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button> -->
              专色数量:
              <!-- <el-select v-model="formData.fmys.scCount" style="width: 100px" @change="priceValuation"> -->
              <el-select v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation" :disabled="readioDisabled(item)">
                <el-option label="0" :value="0"></el-option>
                <el-option label="1" :value="1"></el-option>
                <el-option label="2" :value="2"></el-option>
                <el-option label="3" :value="3"></el-option>
                <el-option label="4" :value="4"></el-option>
              </el-select>
            </span>
          </div>

          <!-- 下拉选择框 -->
          <div v-else-if="strEquals(item.miniZtAttrGroup.groupType, 'select')">
            <span v-if="endWith(item.miniZtAttrGroup.code, '_YWXX') || endWith(item.miniZtAttrGroup.code, '_WLXX')" class="show-ywxx" @click="showEmboss(item, formData.selectSelectValues)"> 去压纹详情选择 >> </span>
            <br />
            <el-select size="small" filterable v-model="formData.selectSelectValues[item.miniZtAttrGroup.id]" placeholder="请选择" :disabled="noFlatDisabled" @change="selectSelect">
              <el-option v-for="(attr, aindex) in item.attrList" :key="aindex" :label="attr.name" :value="attr.groupId + '_' + attr.id"> </el-option>
            </el-select>
            <!-- <template v-if="$route.query.cateId==10&&$route.query.subCateId==95">
              <el-select size="small" v-model="formData.selectSelectValues[item.miniZtAttrGroup.id]" placeholder="请选择" @change="selectSelect">
                <el-option v-for="(attr, aindex) in item.attrList" :key="aindex" :label="attr.name" :value="attr.groupId + '_' + attr.id"> </el-option>
              </el-select>
            </template> -->
          </div>
          <div v-if="endWith(item.miniZtAttrGroup.code, '_YWXX') || endWith(item.miniZtAttrGroup.code, '_WLXX')" class="ywxx-img" @click="previewImg(item, formData.selectSelectValues)">
            <!-- <div v-html="embossRemark(item, formData.selectSelectValues)"></div> -->
          </div>
          <div v-if="strEquals(item.miniZtAttrGroup.code, 'BMCL_BRB_BRCS')">
            <span class="velvetTimesTips f12 C9">默认同一产品多次裱绒为同一颜色,如有不同请联系<span style="cursor: pointer;" class="red" @click="qiyu">在线客服</span>进行备注,给您造成不便敬请谅解</span>
          </div>
          <!-- 潘通色号 -->
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'SGYSYS') && formData.sgYsys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.sgYsys.scCount" :key="item" v-model="formData.sgYsys.pantoneList[index]" @change="priceValuation" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'XGYSYS') && formData.xgYsys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.xgYsys.scCount" :key="item" v-model="formData.xgYsys.pantoneList[index]" @change="priceValuation" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'YSXZ') && formData.dmys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.dmys.scCount" :key="item" v-model="formData.dmys.pantoneList[index]" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'BK_YSYS') && formData.bqys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.bqys.scCount" :key="item" v-model="formData.bqys.pantoneList[index]" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'ZJGY_YSYS') && formData.bqys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.bqys.scCount" :key="item" v-model="formData.bqys.pantoneList[index]" @change="priceValuation" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>
          <div
            class="PantoneDv"
            v-if="
              ((strEquals($route.query.cateId, '2') && item.miniZtAttrGroup.code == 'YSYS') ||
                (strEquals($route.query.cateId, '4') && strEquals($route.query.subCateId, '35') && item.miniZtAttrGroup.code == 'YSYS') ||
                (strEquals($route.query.cateId, '9') && strEquals($route.query.subCateId, '46') && formData.radioSelectValues['6668'] && formData.radioSelectValues['6668'].indexOf('6668_29877') > -1) ||
                (strEquals($route.query.cateId, '9') && strEquals($route.query.subCateId, '47') && formData.radioSelectValues['6705'] && formData.radioSelectValues['6705'].indexOf('6705_30004') > -1) ||
                strEquals($route.query.cateId, '10') ||
                (strEquals($route.query.cateId, '81') && strEquals($route.query.subCateId, '82')) ||
                // 传统标签
                (strEquals($route.query.cateId, '5') && strEquals($route.query.subCateId, '41')) ||
                strEquals($route.query.cateId, '70') ||
                strEquals($route.query.cateId, '13')) &&
                endWith(item.miniZtAttrGroup.code, 'YSYS') &&
                formData.dmys.scCount > 0
            "
          >
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.dmys.scCount" :key="item" v-model="formData.dmys.pantoneList[index]" @change="priceValuation" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'SMYS_ZM') && formData.zmys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.zmys.scCount" :key="item" v-model="formData.zmys.pantoneList[index]" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'SMYS_FM') && formData.fmys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.fmys.scCount" :key="item" v-model="formData.fmys.pantoneList[index]" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>

          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'BJYGY_BK_YSYS1') && formData.bj1ys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.bj1ys.scCount" :key="item" v-model="formData.bj1ys.pantoneList[index]" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'BJEGY_BK_YSYS2') && formData.bj2ys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.bj2ys.scCount" :key="item" v-model="formData.bj2ys.pantoneList[index]" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>

          <!-- <div class="PantoneDv ddd" v-if="endWith(item.miniZtAttrGroup.code, 'YSGY') && formData.dmys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" v-for="(item, index) in formData.dmys.scCount" :key="item" v-model="formData.dmys.pantoneList[index]" @change="priceValuation" />
          </div> -->
          <div class="PantoneDv" v-if="strEquals($route.query.cateId, '70') && endWith(item.miniZtAttrGroup.code, 'YSYS')">
            <ul>
              <li class="flex inputBx onetx" v-for="(item, index) in formData.ysm.scCount" :key="index">
                <label>实际印刷尺寸{{ index + 1 }}</label>
                <el-input class="PantoneDvtx noMrgin" :disabled="noFlatDisabled" v-model="formData.ysm.list[index]['longVal']" @change="priceValuation"> <template slot="append" s>x</template>实际印刷尺寸 </el-input>
                <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-model="formData.ysm.list[index]['widthVal']" @change="priceValuation">
                  <template slot="append">mm</template>
                </el-input>
              </li>
            </ul>
          </div>
          <div v-show="formData.showMsg && index === formVoList.length - 1" style="width: 100%; display: flex">温馨提示：请尽量避免同一位置工艺叠加，因工艺叠加产生的问题本公司不予受理。</div>
          <div v-if="formData.showDydz && strEquals(item.miniZtAttrGroup.code, 'ZZCZ_JYKZL_GSWY')">
            请下载跟样表格，填写对应信息并打印，将跟样表格与样品快递至傲彩佛山办公室；避免耽误生产货期，建议您选择顺丰寄付，傲彩跟样工程师一律拒收到付件，请知悉！
            <a href="/uploads/傲彩样品信息表.xlsx" target="_blank" class="gtrTipsBtn">点击下载</a><img src="@/static/assets/img/gestureleft.jpg" width="32" />
            <p>
              <span>地址：佛山市南海区里水镇里里官路大朗工业区福致工业园办公楼1楼 </span>
              <span style="padding-left: 30px">联系人：孙先生 18998826009</span>
            </p>
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'YSGY') && formData.dmys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" :disabled="noFlatDisabled" v-for="(item, index) in formData.dmys.scCount" :key="item" v-model="formData.dmys.pantoneList[index]" @change="priceValuation" />
            <p class="toolbox">
              <span class="red">*</span>官方默认以潘通色卡版本“
              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                <template slot="content">
                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
                </template>
                <span class="tooltext">Pantone LCC, 2019.</span>
              </el-tooltip>
              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
            </p>
          </div>
        </el-form-item>
        <el-form-item :key="'reminderwx_' + index" v-if="index == formVoList.length - 1 && ($route.query.subCateId === '85' || $route.query.subCateId === '96')">
          <template slot="label">
            <div class="EattrLab">
              <span class="red">*</span>
              材质信息
            </div>
          </template>
          {{ formData.zcjgpb }}
        </el-form-item>
        <el-form-item :key="'reminder3_' + index" v-if="item.miniZtAttrGroup.parentAttrName === '自定义工艺'">
          <div class="Pantips"><span class="red">温馨提示:</span> 请准确描述自定义工艺，生产环节需先理解工艺再评估报价，待订单重新计价后再支付</div>
        </el-form-item>
      </template>
      <!-- <el-form-item v-if="$route.query.cateId == 1 || $route.query.cateId == 2"> -->
      <el-form-item v-if="$route.query.cateId == 1" >
        <template slot="label">
          <div class="EattrLab"><span class="red">*</span>包装服务</div>
        </template>
        <div style="display: flex">
          <!-- 单选框 -->
          <el-radio-group size="small" class="EattrMgroup" v-model="priceFormData.radioService" @change="addService(1, $event)">
            <el-row class="Eattrrow">
              <el-radio-button :label="'盒子扎皮筋'">盒子扎皮筋</el-radio-button>
            </el-row>
            <el-row class="Eattrrow">
              <el-radio-button :label="'盒子扎纸带'">盒子扎纸带</el-radio-button>
            </el-row>
          </el-radio-group>
          <!-- 复选款 -->
          <el-checkbox-group v-model="priceFormData.checkedService" @change="addService(2, $event)">
            <el-row class="Eattrrow">
              <el-checkbox-button class="addwhite" label="1">外箱套蛇皮袋</el-checkbox-button>
            </el-row>
            <!-- <el-row class="Eattrrow">
                      <el-checkbox-button class=" addwhite" label="2">外箱贴标签</el-checkbox-button>
                    </el-row> -->
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" top="20px" width="1250px" title="压纹详情" :before-close="handleClose">
      <el-scrollbar style="height: 750px">
        <div class="veinsDesc">
          <img src="/uploads/images/veins01.jpg" width="1200" />
          <img src="/uploads/images/veins02.jpg" width="1200" />
        </div>
      </el-scrollbar>
    </el-dialog>
    <el-dialog :visible.sync="fbysDialogVisible" top="20px" width="1250px" title="绒布的颜色参照" :before-close="handleClose">
      <el-scrollbar style="height: 750px">
        <img src="/uploads/editor/image/20190821/1566358720689864.jpg" />
      </el-scrollbar>
    </el-dialog>
    <attrSelect :visible.sync="embossVisible" v-if="embossVisible" :value.sync="formData.selectSelectValues[embossId]" :attrList="embossAttrList"></attrSelect>
    <el-image ref="previewImg" :preview-src-list="[previewImgSrc]"></el-image>
  </div>
</template>

<script>
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { isCopyCraft } from '@/utils/price/craftUtil';
import { reSetSize, cateChange, deleteGroupItem, loadDefaultGroup } from '@/utils/price/goodPriceUtil';
import { querySizeData } from '@/api/price/priceApi';
import embossMixins from '@/mixins/emboss';
import qiyu from '@/mixins/qiyu';
export default {
  mixins: [embossMixins, qiyu],
  name: 'PriceMajor',
  props: {
    priceFormData: Object,
    addService: Function,
    formVoList: Array,
    formData: Object,
    priceValuation: Function,
    removeCopyGroupCk: Function,
    addCopyGroupCk: Function,
    addCopyGroupRd: Function,
    removeCopyGroupRd: Function,
    radioSelect: Function,
    selectSelect: Function,
    checkboxSelect: Function,
    bindType: String,
    getraradiofn: Function,
    disabledObj: {
      type: Object,
      default: () => {
        return {
          disabledArr: [],
          pDisabledArr: [],
          pass: []
        };
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      fbysDialogVisible: false,

      data: {
        addNumber: 5,
        dataLength: 10,
        goodsId: 0,
        maxScope: 100,
        minScope: 0,
        sizeLong: 0,
        sizeWidth: 0,
        type: ''
      },
      cclist: [],
      ccnum: [],
      ccdata: '',
      csize: '',
      cwidth: '',
      tgimg: '',
      newinput: [],
      newinput2: [],
      anewflag: false,
      timer: null,
      hxid: '',
      disabledflag: false,
      msize: '',
      isAddBK: false,
      mshape: '180,220,250,245,320,360',
      showBKYSYS: true,
      noFlatDisabled: false // 后台访问时，控制是否编辑
    };
  },
  mounted() {
    // if (this.$route.query.subCateId == 94) {
    //   setTimeout(() => {
    //     document.querySelector('.tgcc:nth-child(2)').style.display = 'none';
    //   }, 500);
    // }
    // setTimeout(() => {
    //   this.tgimg = this.formVoList;
    // }, 500);
    // console.log(sessionStorage.getItem("size"));
    if (this.$route.query.cateId == 122) {
      if (sessionStorage.getItem('size')) {
        this.msize = sessionStorage.getItem('size').substring(0, 3);
      }
      if (sessionStorage.getItem('img')) {
        this.tgimg = sessionStorage.getItem('img');
        this.formData.goodAttrVo.coverPath = this.tgimg;
      }
    }
    // this.cclist = [];
    // this.ccdata = '';
    // this.tgimg = '';
    // this.anewflag = false;
    // document.querySelector('.tgcc:nth-child(2) .el-input-group__append').innerHTML='mm';
    // console.log( document.querySelector(".inputBx").document.querySelectorAll('.inputBxrow')[3], this.formVoList);
    // setTimeout(() => {
    //   console.log('item', this.formVoList);
    //   this.newinput = this.formVoList.filter(e => {
    //     return e.miniZtAttrGroup.code == 'TGCC';
    //   });
    //   console.log(9999, this.newinput[0]);
    //   for (let i = 0; i < this.newinput[0].attrList.length; i++) {
    //     console.log('1111', this.newinput[0].attrList[i]);
    //     this.newinput2.push({
    //       data:this.newinput[0].attrList[i].groupId+'_'+this.newinput[0].attrList[i].id
    //     })
    //   }
    //   console.log(this.newinput2)
    // }, 500);
    // this.$nextTick(()=>{
    //   console.log(111,this.formVoList)
    // })
  },
  methods: {
    ...{ startWith, endWith, strEquals },
    ...{ isCopyCraft },
    ...{ reSetSize },
    handleClose(done) {
      done();
    },
    inpfocus() {
      this.newinput2 = [];
      setTimeout(() => {
        this.newinput = this.formVoList.filter(e => {
          return e.miniZtAttrGroup.code == 'TGCC';
        });
        // console.log('this.newinput[0]', this.newinput[0]);
        for (let i = 0; i < this.newinput[0].attrList.length; i++) {
          this.newinput2.push({
            data: this.newinput[0].attrList[i].groupId + '_' + this.newinput[0].attrList[i].id
          });
        }
        this.data.goodsId = this.formData.goodAttrVo.id;
        // console.log('this.formData', this.formData);
      }, 100);
    },
    tgchange(data, num) {
      // console.log('tgchange', data);
      if (data.name == '长') {
        this.data.sizeLong = this.formData.inputValues[num];
      } else if (data.name == '宽') {
        this.data.sizeWidth = this.formData.inputValues[num];
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        querySizeData(this.data).then(res => {
          this.cclist = res.data;
        });
      }, 300);
    },
    hidefu(name, id, cateId) {
      let flag = true;
      if (name == '印刷类型' && (id == '29' || id == '30' || id == '31' || cateId == 2)) {
        flag = true;
      } else {
        flag = false;
      }
      return flag;
    },
    tgclick(data) {
      console.log('tgclick', this.ccdata);
      this.disabledflag = true;
      if (this.$route.query.subCateId == 94) {
        document.querySelector('.tgcc:nth-child(2)').style.display = 'inline-block';
      } else {
        document.querySelector('.tgcc:nth-child(3)').style.display = 'inline-block';
      }
      this.hxid = '盒型标识:' + data.id + ';';
      this.$emit('event1', this.hxid);
      this.ccnum = data.size.split('x');
      for (let i = 0; i < this.newinput2.length; i++) {
        this.formData.inputValues[this.newinput2[i].data] = this.ccnum[i];
      }
      // console.log(111,this.newinput2)
      // console.log('data',data)
      this.tgimg = '/' + data.imagesPath;
      this.anewflag = true;
      // this.cclist = [];
      this.priceValuation();
    },
    clickitem(e, n, nid) {
      if (this.$route.query.isCms === 'edit' && this.$route.query.flat === 'false') {
        return;
      }
      let flagdel = null;
      this.formData.radioSelectValues[n] == e;
      // e === this.formData.radioSelectValues[n] ? (this.formData.radioSelectValues[n] = "") : (this.formData.radioSelectValues[n] = e);
      // e === this.formData.radioSelectValues[n] ? (delete this.formData.radioSelectValues[n]) : (this.formData.radioSelectValues[n] = e);
      if (e == this.formData.radioSelectValues[n]) {
        delete this.formData.radioSelectValues[n];
        try {
          document.querySelector('.ishow').style.display = 'none';
        } catch (err) {
          //在此处理错误
        }

        // cateChange();
        flagdel = false;
        // console.log('eee',this.formData.checkBoxSelectValues[8073]);
      } else {
        this.formData.radioSelectValues[n] = e;
        flagdel = true;
        try {
          document.querySelector('.ishow').style.display = 'block';
        } catch (err) {
          //在此处理错误
        }
      }
      // this.formData.checkBoxSelectValues[n] = null;
      // console.log(n);

      // e === this.formData.radioSelectValues[n] ? (delete this.formData.radioSelectValues[n]) : (this.formData.radioSelectValues[n] = e);
      // console.log('eee', e,n, nid);
      this.radioSelect(e, flagdel, nid);
    },
    inpkey(id) {
      this.formData.inputValues[id].indexOf('自定义') > -1 && this.$set(this.formData.inputValues, id, this.formData.inputValues[id].replace(/自定义/g, ''));
      this.formData.inputValues[id].indexOf('；') > -1 && this.$set(this.formData.inputValues, id, this.formData.inputValues[id].replace(/；/g, ''));
      this.formData.inputValues[id].indexOf('#') > -1 && this.$set(this.formData.inputValues, id, this.formData.inputValues[id].replace(/#/g, ''));
      this.formData.inputValues[id].indexOf(';') > -1 && this.$set(this.formData.inputValues, id, this.formData.inputValues[id].replace(/;/g, ''));
      this.formData.inputValues[id].indexOf('：') > -1 && this.$set(this.formData.inputValues, id, this.formData.inputValues[id].replace(/：/g, ''));
      this.formData.inputValues[id].indexOf(':') > -1 && this.$set(this.formData.inputValues, id, this.formData.inputValues[id].replace(/:/g, ''));
    },
    anewfn() {
      this.disabledflag = false;
      // if (this.$route.query.subCateId == 94) {
      //   document.querySelector('.tgcc:nth-child(2)').style.display = 'none';
      // } else {
      //   document.querySelector('.tgcc:nth-child(3)').style.display = 'none';
      // }
      // document.querySelector('.tgcc:nth-child(3)').style.display = 'none';
      // console.log(this.formData.inputValues);
      this.formData.inputValues = {};
      this.cclist = [];
      this.ccdata = '';
      this.tgimg = '';
      this.anewflag = false;
      this.hxid = '';
      this.$emit('event1', this.hxid);
      this.priceValuation();
    },
    ysmChange() {
      if (this.formData.ysm.scCount <= 0) {
        let isError = false;
        for (let p in this.formData.radioSelectValues) {
          const selectValue = this.formData.radioSelectValues[p + ''];
          // console.log('selectValue', selectValue);
          if (strEquals(selectValue.split('_')[1], '29860') || strEquals(selectValue.split('_')[1], '29861')) {
            isError = true;
          }
        }
        if (isError) {
          this.$message({ type: 'error', message: '有印刷，印刷面不能为0' });
          return false;
        }
      }
      this.priceValuation();
    },
    setX(val) {
      this.$emit('setX', val);
    },
    readioDisabled(item = {}, attr = {}) {
      let _this = this;
      // 判断是否选中裱卡，这个字段会在goodPriceUtil.js的checkboxSelect函数内被修改
      // 判断是否是背面处理的数组
      if (item.miniZtAttrGroup.name == '背面处理' && attr.code) {
        // 选中裱卡，背面处理不能选选择
        if (_this.isAddBK && attr.actualValue != '背面处理:无') {
          return true;
        } else {
          if (_this.isAddBK) {
            // 选中'背面处理:无'这个按钮
            let newAttr = attr;
            let newId = newAttr.groupId + '_' + newAttr.id;
            if (_this.formData.radioSelectValues[newAttr.groupId] != newId) {
              _this.$set(_this.formData.radioSelectValues, newAttr.groupId + '', newId);
              setTimeout(() => {
                deleteGroupItem(newAttr.groupId);
                loadDefaultGroup(newAttr.groupId, newAttr.id);
              }, 1);
            }
          }
          return false;
        }
      }
      if (attr.code && _this.endWith(attr.code, 'YSYS_SMYS')) {
        if (_this.isAddBK) {
          // 判断是否是双面印刷，选择裱卡的时候不可以双面印刷
          let newAttr = item.attrList.find(e => e.code != 'YSYS_SMYS');
          let newId = newAttr.groupId + '_' + newAttr.id;
          if (_this.formData.radioSelectValues[newAttr.groupId] != newId) {
            _this.$set(_this.formData.radioSelectValues, newAttr.groupId + '', newId);
            _this.formData.yslx = 'dm';
            setTimeout(() => {
              deleteGroupItem(newAttr.groupId);
              loadDefaultGroup(newAttr.groupId, newAttr.id);
            }, 1);
          }
          return true;
        } else {
          return false;
        }
      }
      // 传统吊牌
      if (_this.$route.query.subCateId == 42) {
        if (_this.formData.checkBoxSelectValues[15299].indexOf('15299_48591') > -1 && attr.id == 48865) return true;
        // 不能印刷的表面处理
        let notPrint = {
          '15447': [49041], // 单铜纸-逆向UV，印刷颜色只能是无，也不可添加专色
          '15456': [49114], // 15456_49114 银卡纸-开窗膜
          '15459': [49123, 49129], // 15459 金卡纸-表面处理， 49129开窗膜 ，49123 哑油
          '15465': [49146, 49149, 49150, 49152], // 15465 拉丝银-表面处理 49146 哑油 49149 预涂光膜 49150 预涂哑膜 49152 开窗膜
          '15468': [49161, 49164, 49165, 49167] // 15468 镭射银-表面处理 49161 哑油 49164 预涂光膜 49165 预涂哑膜 49167 开窗膜
        };
        // 必须印刷的表面处理
        // let mustPrint = {
        //   '15459': [73123] // 15459 金卡纸-表面处理， 73123 UV哑油
        // };
        // 印刷颜色按钮（多色，单色按钮）
        if (attr.id == 48639 || attr.id == 48640) {
          if (_this.isCardPrint(notPrint)) {
            _this.$set(_this.formData.bqys, 'scCount', 0);
            _this.showBKYSYS = false;
            return true;
          } else {
            _this.showBKYSYS = true;
            return false;
          }
        }
        // 印刷颜色按钮（无按钮）
        // if (attr.id == 48641) {
        //   if (_this.isCardPrint(mustPrint)) {
        //     return true;
        //   }
        // }
        // 表面处理按钮
        if (notPrint[attr.groupId] && notPrint[attr.groupId].find(e => e == attr.id)) {
          let ysys = _this.formData.radioSelectValues[15309];
          if (ysys == '15309_48639' || ysys == '15309_48640') return true;
        }
        // 表面处理按钮，判断是否是必须印刷，
        // if (mustPrint[attr.groupId] && mustPrint[attr.groupId].find(e => e == attr.id)) {
        //   let ysys = _this.formData.radioSelectValues[15309];
        //   if (ysys == '15309_48641') return true;
        // }
      }
      // 是否为后台访问
      if (!this.$route.query.isCms) {
        return false;
      }
      // 新增 并且非平面
      if (this.$route.query.isCms === 'add' && this.$route.query.flat === 'false') {
        return false;
      }
      let disabled = false;
      // 新增/编辑 并且是平面
      if (this.disabledObj.pass.find(e => e === item.miniZtAttrGroup.name)) {
        disabled = false;
      } else if (this.disabledObj.pDisabledArr.find(e => e === item.miniZtAttrGroup.pname) || this.disabledObj.disabledArr.find(e => e === item.miniZtAttrGroup.name)) {
        disabled = true;
      }
      // 编辑 并且非平面
      if (this.$route.query.isCms == 'edit' && this.$route.query.flat == 'false') {
        this.noFlatDisabled = true;
        return !disabled;
      }

      return disabled;
    },
    /**
     * 判断传进来的信息里面的数据是否有被选中
     * @param obj 传进来的信息
     * @returns 返回一个布尔值
     */
    isCardPrint(obj) {
      let _this = this;
      let bool = false;
      // 判断当前按钮是否被选中
      for (const key in obj) {
        if (_this.formData.radioSelectValues[key]) {
          let item = obj[key].find(e => {
            let val = key + '_' + e;
            return _this.formData.radioSelectValues[key] == val;
          });
          if (item) {
            bool = true;
            return bool;
          }
        }
      }
      return bool;
    }
  },
  watch: {
    'formData.ysm.scCount': {
      handler() {
        reSetSize();
      }
    },
    $route: {
      handler() {
        if (this.$route.query.subCateId == 93 || this.$route.query.subCateId == 94 || this.$route.query.subCateId == 95) {
          // console.log(111)
          this.cclist = [];
          this.ccdata = '';
          this.anewflag = false;
          this.disabledflag = false;
          this.data.sizeLong = 0;
          this.data.sizeWidth = 0;
        }
        // if (this.$route.query.subCateId == 94) {
        //   setTimeout(() => {
        //     document.querySelector('.tgcc:nth-child(2)').style.display = 'none';
        //   }, 500);
        // }
        this.tgimg = '';
        this.isAddBK = false;
      }
      // deep: true,
    }
  }
};
</script>

<style>
.group-copy-div1 {
  margin-left: 10px;
  position: relative;
  display: inline-block;
  top: 4px;
}
.group-copy-div {
  margin-left: 10px;
  position: relative;
  display: inline-block;
  top: -1px;
}
.noMrgin {
  margin-right: 0;
}
.noMrgin .el-input-group__append {
  border-right: 0 !important;
}
.tgimg {
  top: 70px;
}
/* .tgcc:nth-child(3) {
  display: none;
} */
.anew {
  margin-left: 20px;
  cursor: pointer;
  text-decoration: underline;
}
label {
  box-shadow: none !important;
}
.EattrMgroup .padd span {
  padding: 2px;
}
.titlenone {
  display: none;
}
div[name='hidename'] {
  display: none;
}
.PantoneDv .el-button:hover {
  background-color: #fff !important;
}
.tooltext {
  color: red;
  cursor: pointer;
}
.toolbox {
  margin-top: 10px;
}
.hideclass {
  display: none;
}
/* .el-tooltip__popper.is-dark{
  background: #fff;
  border:1px solid #eee;
}
.popper__arrow{
  border-top-color: #fff !important;
} */
.show-ywxx {
  margin-left: 0px;
  color: #ff0036;
}
.show-ywxx:hover {
  cursor: pointer;
}
.el-image__error {
  display: none;
}
.ywxx-img {
  margin-top: 10px;
  width: 100px;
}
.ywxx-img img {
  width: 100%;
  height: 100%;
}
.ywxx-img:hover {
  cursor: zoom-in;
}
</style>

<template>
  <div class="hardcover packages-cart-box">
    <el-row>
      <el-col>
        <div class="guigeBox cardBox needhide">
          <goods-size-info :goodsSizeInfo="goodsSizeInfo"></goods-size-info>
          <div class="guigeLt">
            <!-- <div class="cardtabT flex">
              <h1 class="flex guigeH1" style="width: 100%">
                <span class="geH1Lt">精装盒-{{ titleobj.name }} </span><span class="lookBnt"><a :href="'/goods/goodsDesc?gid=' + goodsId" class="" target="_blank">查看产品详情</a></span>
              </h1>
            </div> -->
            <div class="EattrMbox" style="padding-bottom: 0">
              <!-- <div class="guigeImg tgimg">
                <img src="" alt="" />
              </div> -->
              <div v-if="false">
                <div class="laybox hsize" v-for="(v, m) in common" :key="m" v-show="data2.length">
                  <div class="EattrLab" style="line-height: 31px; font-size: 13px">
                    <span class="red" v-if="$route.path == '/price/HardcoverQuotation'">*</span>
                    {{ v.name }}
                    <!-- 同款款数问号悬浮提示 -->
                    <el-tooltip v-if="v.name == '同款款数' && $route.path == '/price/HardcoverQuotation'" width="200" class="item" effect="light" placement="top-start">
                      <div slot="content">同款指参数工艺及数量相同，仅设计稿内容不同的精装盒</div>
                      <em class="guigeTis">?</em>
                    </el-tooltip>
                  </div>
                  <el-row class="flex inputBx Layerinpts">
                    <div class="inputBxrow" v-for="(vv, mm) in v.attrList" :key="mm">
                      <el-input v-model="priceFormData[vv.val]" :placeholder="vv.name" size="small" @change="sizechange(vv.groupId, '', vv.val, priceFormData[vv.val])">
                        <template slot="append"> {{ vv.suffix }} </template>
                      </el-input>
                      <!-- 精装盒设计打样 -->
                      <!-- <el-input v-model="priceFormData[vv.val]" :placeholder="vv.name" size="small" :disabled="vv.val == 'num'" v-if="$route.path == '/proof/HardcoverQuotation'" @change="sizechange(vv.groupId, '', vv.val, priceFormData[vv.val])">
                        <template slot="append"> {{ vv.suffix }} </template>
                      </el-input> -->
                    </div>
                  </el-row>
                </div>
              </div>

              <el-form class="EattrMain attr-from" ref="formData" :model="formData" @submit.native.prevent size="small">
                <template v-for="(item, index) in data2">
                  <el-form-item
                    :key="index"
                    :style="item.miniZtAttrGroup.name == '皮壳' || item.miniZtAttrGroup.name == '柜桶' ? 'margin-bottom:0px;padding-bottom:8px;' : 'margin-top: 10px;padding-bottom:8px;:#fafafa;'"
                    v-if="item.miniZtAttrGroup.isPack == 1 && item.miniZtAttrGroup.name != '部件信息'"
                  >
                    <!-- && item.miniZtAttrGroup.name != '部件信息' -->
                    <div class="eattrtitle" style="font-size: 16px; padding-top: 5px; text-indent: 1em" v-if="item.miniZtAttrGroup.code.indexOf('add') > -1 && isshow(item.miniZtAttrGroup.groupName)">
                      {{ item.miniZtAttrGroup.name }}
                    </div>
                    <!-- <template slot="label"> -->
                    <div
                      :class="['eattrtitle', item.miniZtAttrGroup.name == '抽屉' ? 'spacing' : '']"
                      :style="
                        (item.miniZtAttrGroup.code.indexOf('add') > -1 && isshow(item.miniZtAttrGroup.groupName)) || item.miniZtAttrGroup.code.indexOf('remove') > -1
                          ? 'padding-top: 5px; text-indent: 3em;color:#333;font-size: 15px;'
                          : 'padding-top: 5px; text-indent: 1em'
                      "
                    >
                      <!-- <span class="red">*</span> -->
                      {{ item.miniZtAttrGroup.name }}{{ isshow(item.miniZtAttrGroup.groupName) ? item.miniZtAttrGroup.code.split('_')[1] : '' }}
                      <!-- {{ item.miniZtAttrGroup.id }} -->
                      <!-- <el-button type="danger" round v-if="item.miniZtAttrGroup.code.indexOf('add') > -1 && isshow(item.miniZtAttrGroup.groupName)" @click="addlay(item.miniZtAttrGroup.name)" class="titlebtn"
                        >添加{{ item.miniZtAttrGroup.name }}{{ item.miniZtAttrGroup.name == '抽屉' || item.miniZtAttrGroup.name == '柜桶' ? '数量' : '层' }}</el-button
                      >
                      <el-button type="info" round v-if="item.miniZtAttrGroup.code.indexOf('remove') > -1" @click="removelay(item, index, item.miniZtAttrGroup.name)" class="titlebtn"
                        >取消{{ item.miniZtAttrGroup.name }}{{ item.miniZtAttrGroup.name == '抽屉' || item.miniZtAttrGroup.name == '柜桶' ? '' : '层' }}</el-button
                      > -->
                    </div>
                    <!-- </template>  v-show="citem.miniZtAttrGroup.actualValue != 'title'-->
                    <!-- v-show="citem.miniZtAttrGroup.actualValue != 'title'" -->
                    <div v-for="(citem, i) in item.attrList" :key="i" class="laybox" v-show="citem.miniZtAttrGroup.actualValue != 'title'">
                      <div v-if="citem.miniZtAttrGroup.isPack == 1">
                        <!-- <div v-if="citem.miniZtAttrGroup.code.indexOf('btn') > -1" style="text-indent: 3em;font-size: 15px;color: rgb(51, 51, 51);font-weight: 700;">
                        <span v-if="!citem.miniZtAttrGroup.groupName || citem.miniZtAttrGroup.groupName == '1_1' || citem.miniZtAttrGroup.groupName == '2_1' || citem.miniZtAttrGroup.groupName == '3_1' || citem.miniZtAttrGroup.groupName == '4_1'"></span>
                        <span v-else>面料</span> 
                      </div> -->
                        <!-- {{i}} -->
                        <div v-if="citem.miniZtAttrGroup.showName == 0" v-show="showStartBorder(item.attrList, i)" class="laycon childactive" style="border-top:1px solid #eee;width: 100%;"></div>
                        <div :class="citem.miniZtAttrGroup.showName ? 'laycon' : 'laycon childactive'" v-if="citem.miniZtAttrGroup.reminder != 'hide'" :style="i == 0 ? 'border-top:1px solid #eee' : ''">
                          <div :class="!citem.miniZtAttrGroup.showName && citem.miniZtAttrGroup.code.indexOf('CHILD') != -1 ? 'laychild childactive3' : 'laychild'">
                            <div
                              v-show="citem.miniZtAttrGroup.name != ' '"
                              :class="citem.miniZtAttrGroup.showName ? 'EattrLab' : !citem.miniZtAttrGroup.showName && citem.miniZtAttrGroup.code.indexOf('CHILD') != -1 ? 'EattrLab  bgcolor' : 'EattrLab  bgcolor2'"
                            >
                              <!-- {{ citem.miniZtAttrGroup.id }} -->
                              <span class="red" v-if="citem.miniZtAttrGrouep && citem.miniZtAttrGrouep.required === 1">*</span>
                              <span class="titlename">{{ citem.miniZtAttrGroup.name }}{{ citem.miniZtAttrGroup.parentAttrId }}</span>
                              <span v-if="citem.miniZtAttrGroup.name == '面料'" style="float: right">
                                <template v-if="item.miniZtAttrGroup.groupName.split('_')[1] > 1">
                                  {{ citem.miniZtAttrGroup.code.split('_')[2] ? citem.miniZtAttrGroup.code.split('_')[2] : '1' }}
                                </template>
                              </span>
                              <!-- {{citem.miniZtAttrGroup.sortOrder}} -->
                              <!-- 查看压纹详情 -->
                              <div v-if="citem.miniZtAttrGroup.name == '纹理信息'">
                                <a style="color: red" href="javascript:void(0)" @click="dialogVisible = true">(查看压纹详情)</a>
                              </div>
                            </div>

                            <!-- 文本框 -->
                            <el-row class="flex inputBx Layerinpts" v-if="strEquals(citem.miniZtAttrGroup.groupType, 'input')" style="">
                              <div class="inputBxrow" v-for="attr in citem.attrList" :key="attr.id">
                                <el-input
                                  :style="attr.suffix ? '' : 'width:130px'"
                                  v-model="inputdata[citem.miniZtAttrGroup.id + '_' + attr.id]"
                                  :placeholder="attr.inputTips"
                                  size="small"
                                  @change="inpchange(attr.name, citem.miniZtAttrGroup.id + '_' + attr.id, index, i)"
                                >
                                  <template slot="append" v-if="attr.suffix"> {{ attr.suffix }} </template>
                                </el-input>
                                <!-- {{citem.miniZtAttrGroup.id + '_' + attr.id}} -->
                              </div>
                            </el-row>

                            <!-- 单选框 -->
                            <div class="flex" v-else-if="strEquals(citem.miniZtAttrGroup.groupType, 'radio')">
                              <!-- {{citem}} -->
                              <el-radio-group
                                class="EattrMgroup"
                                size="small"
                                v-model="radiodata[citem.miniZtAttrGroup.id]"
                                button-style="solid"
                                @change="radiochange({ event: $event, child: citem.miniZtAttrGroup.actualValue, index: index, i: i, name: citem.miniZtAttrGroup.name })"
                              >
                                <el-row class="Eattrrow" v-for="attr in citem.attrList" :key="'attr_' + attr.id">
                                  <template v-if="attr.isPack == 1">
                                    <template v-if="attr.remark && attr.remark != '<p><br></p>'">
                                      <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                                        <template slot="content">
                                          <div class="EattrMtips" v-html="attr.remark"></div>
                                        </template>
                                        <el-radio-button size="small" :label="attr.groupId + '_' + attr.id" :disabled="attr.status == 0 ? true : false">{{ attr.name }}--{{ attr.groupId + '_' + attr.id }} </el-radio-button>
                                      </el-tooltip>
                                    </template>
                                    <el-radio-button v-else size="small" :label="attr.groupId + '_' + attr.id" :disabled="attr.status == 0 ? true : false">
                                      {{ attr.name }}--{{ attr.groupId + '_' + attr.id }}+{{ citem.miniZtAttrGroup.actualValue }}+{{ index }}+{{ i }}+{{ citem.miniZtAttrGroup.name }}
                                      <!-- {{ attr.groupId }},{{ attr.id }} -->
                                    </el-radio-button>
                                  </template>
                                </el-row>
                              </el-radio-group>
                              <span class="colorNumbr" style="padding: 0" v-if="citem.miniZtAttrGroup.parentAttrName == 'UV印刷'">
                                <!-- <el-checkbox-button @change="getprice" class="major-check" v-model="jybm[citem.miniZtAttrGroup.id]" label="加印白墨">加印白墨</el-checkbox-button> -->
                                <!-- <el-radio-group class="EattrMgroup" size="small" v-model="jybm[citem.miniZtAttrGroup.id]" button-style="solid" v-if="subCateId == 128 || subCateId == 138">
                                <el-row class="Eattrrow">
                                  <el-radio-button size="small" @click.native.prevent="jybmfn(citem.miniZtAttrGroup.id, citem.miniZtAttrGroup.actualValue + '加印白墨')" label="1"> 加印白墨 </el-radio-button>
                                </el-row>
                              </el-radio-group> -->
                                <span class="colorNumbr" @click="jybmfn(citem.miniZtAttrGroup.id, citem.miniZtAttrGroup.actualValue + '加印白墨;')">
                                  <div :class="jybm[citem.miniZtAttrGroup.id] ? 'jybmclass redclass' : 'jybmclass'">加印白墨</div>
                                </span>
                              </span>
                              <!-- <span style="line-height: 35px" v-if="radiocan(citem.miniZtAttrGroup.name)"> -->
                              <!-- <el-button type="danger" @click="radiocancel(citem.miniZtAttrGroup.id, index)">取消</el-button> -->
                              <!-- <el-button style="color:red" icon="el-icon-close" size="mini" circle @click="radiocancel(citem.miniZtAttrGroup.id, index)"></el-button> -->
                              <!-- <i class="el-icon-circle-close" style="font-size: 18px; color: red" circle @click="radiocancel(citem.miniZtAttrGroup.id, index, i, citem.miniZtAttrGroup.actualValue, citem.miniZtAttrGroup.name)"></i> -->
                              <!-- </span> -->
                              <!-- <span v-if="false && citem.miniZtAttrGroup.code.indexOf('btn') > -1"> -->
                              <!-- <span
                                v-if="citem.miniZtAttrGroup.groupName.split('_')[1]==1"
                              ></span> -->
                              <!-- <el-button
                                v-if="citem.miniZtAttrGroup.groupName && citem.miniZtAttrGroup.groupName.split('_')[1] > 1"
                                size="mini"
                                style="color: red; background: rgba(255, 255, 255, 0); border: 1px solid red"
                                round
                                @click="addchild(citem.miniZtAttrGroup.id + 12356, index, citem)"
                                >添加面料层</el-button
                              > -->
                              <!-- </span> -->
                              <!-- <span v-else-if="citem.miniZtAttrGroup.code.indexOf('del') > -1">
                                <el-button type="info" size="mini" round @click="delchild(citem, index, i)">取消面料层</el-button>
                              </span> -->
                            </div>

                            <!-- 复选框 -->
                            <div class="flex" v-else-if="strEquals(citem.miniZtAttrGroup.groupType, 'checkbox')">
                              <template v-if="citem.miniZtAttrGroup.code.indexOf('parent') > -1">
                                <el-row class="Eattrrow" v-for="(attr, i) in citem.attrList" :key="i">
                                  <el-checkbox-button :label="attr.id.toString()" v-if="attr.isPack == 1" v-model="parentdata" :disabled="dbdfn(attr.name, subCateId)" @change="parentchange($event, attr.id, attr.name)">
                                    {{ attr.name }}{{ attr.id + '---' + attr.name }}
                                  </el-checkbox-button>
                                </el-row>
                              </template>
                              <!-- <el-checkbox-group class="EattrMgroup" size="small" v-model="parentdata" v-if="citem.miniZtAttrGroup.code.indexOf('parent') > -1">
                              <el-row class="Eattrrow" v-for="attr in citem.attrList" :key="'attr_' + attr.id">
                                <el-checkbox-button :label="attr.id.toString()" :true-label="attr.id" :false-label="attr.id" @change="parentchange"> {{ attr.name }}{{ attr.id }} </el-checkbox-button>
                              </el-row>
                            </el-checkbox-group> -->

                              <el-row class="Eattrrow" v-for="cattr in citem.attrList" :key="'attr_' + cattr.id" v-else>
                                <template v-if="cattr.remark && cattr.remark != '<p><br></p>'">
                                  <el-tooltip class="item" effect="light" placement="top-start">
                                    <template slot="content">
                                      <div class="EattrMtips" v-html="cattr.remark"></div>
                                    </template>
                                    <el-checkbox-button
                                      v-if="cattr.isPack == 1"
                                      :label="cattr.groupId + '_' + cattr.id"
                                      v-model="checkdata[citem.miniZtAttrGroup.id]"
                                      @change="childchange($event, cattr.id, index, i, cattr.groupId, citem.miniZtAttrGroup.name)"
                                      >{{ cattr.name }}</el-checkbox-button
                                    >
                                  </el-tooltip>
                                </template>
                                <template v-else>
                                  <el-checkbox-button
                                    v-if="cattr.isPack == 1"
                                    :label="cattr.groupId + '_' + cattr.id"
                                    v-model="checkdata[citem.miniZtAttrGroup.id]"
                                    @change="childchange($event, cattr.id, index, i, cattr.groupId, citem.miniZtAttrGroup.name)"
                                    :disabled="cattr.status == 0 ? true : false"
                                  >
                                    {{ cattr.name }}
                                    <!-- {{ cattr.groupId }},{{ cattr.id }} -->
                                  </el-checkbox-button>
                                </template>
                              </el-row>
                              <!-- <el-checkbox-group class="EattrMgroup" size="small" v-model="checkdata[citem.miniZtAttrGroup.id]" v-else>
                              <el-row class="Eattrrow" v-for="attr in citem.attrList" :key="'attr_' + attr.id">
                                <el-checkbox-button :label="citem.miniZtAttrGroup.id + '_' + attr.id"> {{ attr.name }} </el-checkbox-button>
                              </el-row>
                            </el-checkbox-group> -->
                            </div>

                            <!-- 下拉选择框 -->
                            <div v-else-if="strEquals(citem.miniZtAttrGroup.groupType, 'select')">
                              <!-- <div v-if="citem.miniZtAttrGroup.actualValue == 'linkage'">
                              <el-cascader v-if="citem.attrList.length" v-model="cascaderdata[citem.miniZtAttrGroup.id]" :options="citem.attrList" :key="citem.attrList.length" :props="{ value: 'name', label: 'name' }" @change="getprice">
                                <template slot-scope="{ node, data }">
                                  <span>{{ data.name }}</span>
                                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                                </template>
                              </el-cascader>
                            </div> -->
                              <el-select
                                size="small"
                                v-model="selectdata[citem.miniZtAttrGroup.id]"
                                placeholder="请选择"
                                style="width: 150px"
                                @change="selchange({ event: $event, child: citem.miniZtAttrGroup.actualValue, index: index, i: i, name: citem.miniZtAttrGroup.name })"
                              >
                                <template v-for="(attr, aindex) in citem.attrList">
                                  <el-option v-if="attr.isPack == 1" :key="aindex" :label="attr.name" :value="attr.groupId + '_' + attr.id"> </el-option>
                                </template>
                              </el-select>
                              <!-- {{citem.miniZtAttrGroup.id}} -->
                            </div>
                            <!-- <span>
                            {{spot[citem.miniZtAttrGroup.id]}}
                          </span> -->
                            <span v-if="citem.miniZtAttrGroup.code.indexOf('YSYS') > -1">
                              <span class="yszs">专色数量</span>
                              <!-- {{ spot[citem.miniZtAttrGroup.id] }} -->
                              <!-- <el-select size="small" v-model="spot[citem.miniZtAttrGroup.id]" placeholder="请选择" style="width: 120px" @change="spotchange(citem.miniZtAttrGroup.id,spot[citem.miniZtAttrGroup.id][6],citem.miniZtAttrGroup.actualValue)"> -->
                              <el-select
                                size="small"
                                v-model="spot[citem.miniZtAttrGroup.id]"
                                placeholder="请选择"
                                style="width: 120px"
                                @change="spotchange(citem.miniZtAttrGroup.id, spot[citem.miniZtAttrGroup.id], citem.miniZtAttrGroup.actualValue)"
                              >
                                <!-- <el-option label="0" value=""></el-option>
                              <el-option label="1" :value="citem.miniZtAttrGroup.actualValue + '专色:1@x;'"></el-option>
                              <el-option label="2" :value="citem.miniZtAttrGroup.actualValue + '专色:2@x@x;'"></el-option>
                              <el-option label="3" :value="citem.miniZtAttrGroup.actualValue + '专色:3@x@x@x;'"></el-option>
                              <el-option label="4" :value="citem.miniZtAttrGroup.actualValue + '专色:4@x@x@x@x;'"></el-option> -->
                                <el-option label="0" :value="0"></el-option>
                                <el-option label="1" :value="1"></el-option>
                                <el-option label="2" :value="2"></el-option>
                                <el-option label="3" :value="3"></el-option>
                                <el-option label="4" :value="4"></el-option>
                              </el-select>
                            </span>
                            <span v-if="citem.miniZtAttrGroup.code.indexOf('ZMYS') > -1">
                              <span class="yszs">正面专色数量</span>
                              <el-select
                                size="small"
                                v-model="spot[citem.miniZtAttrGroup.id]"
                                placeholder="请选择"
                                style="width: 120px"
                                @change="spotchange(citem.miniZtAttrGroup.id, spot[citem.miniZtAttrGroup.id], citem.miniZtAttrGroup.actualValue + '正面')"
                              >
                                <!-- <el-option label="0" value=""></el-option>
                              <el-option label="1" :value="citem.miniZtAttrGroup.actualValue + '正面专色:1@x;'"></el-option>
                              <el-option label="2" :value="citem.miniZtAttrGroup.actualValue + '正面专色:2@x@x;'"></el-option>
                              <el-option label="3" :value="citem.miniZtAttrGroup.actualValue + '正面专色:3@x@x@x;'"></el-option>
                              <el-option label="4" :value="citem.miniZtAttrGroup.actualValue + '正面专色:4@x@x@x@x;'"></el-option> -->
                                <el-option label="0" :value="0"></el-option>
                                <el-option label="1" :value="1"></el-option>
                                <el-option label="2" :value="2"></el-option>
                                <el-option label="3" :value="3"></el-option>
                                <el-option label="4" :value="4"></el-option>
                              </el-select>
                            </span>
                            <!-- <span v-if="citem.miniZtAttrGroup.code.indexOf('FMYS') > -1">
                            <span class="yszs">反面专色数量</span>
                            <el-select
                              size="small"
                              v-model="spot[citem.miniZtAttrGroup.id]"
                              placeholder="请选择"
                              style="width: 120px"
                              @change="spotchange(citem.miniZtAttrGroup.id, spot[citem.miniZtAttrGroup.id], citem.miniZtAttrGroup.actualValue + '反面')"
                            >
                              <el-option label="0" value=""></el-option>
                              <el-option label="1" :value="1"></el-option>
                              <el-option label="2" :value="2"></el-option>
                              <el-option label="3" :value="3"></el-option>
                              <el-option label="4" :value="4"></el-option>
                            </el-select>
                          </span> -->
                          </div>
                        </div>
                        <!-- 烫金颜色提示 -->
                        <div class="laycon childactive3" style="backgroundColor:#ffffff;font-size:12px;padding:0;" v-if="citem.miniZtAttrGroup.name == '烫金颜色'">
                          <div class="laychild childactive3">
                            <span style="color:red;">*温馨提示：</span>
                            <span>若须以您提供的颜色纹理为准，请先邮寄您的样品给傲彩，由傲彩产生金料颜色编号供您下订单时录入。</span>
                          </div>
                        </div>
                        <!-- 专色潘通色号 -->
                        <template v-if="citem.miniZtAttrGroup.pname == '印刷方式' && spot[citem.miniZtAttrGroup.id]">
                          <div class="laycon childactive">
                            <div class="EattrLab  bgcolor2" style="margin-left:90px;"><span class="titlename">是否寄送色卡</span></div>
                            <el-button @click="spotclick(citem.miniZtAttrGroup.id, true)" :class="spotis[citem.miniZtAttrGroup.id] ? 'borderred' : ''">是</el-button>
                            <el-button @click="spotclick(citem.miniZtAttrGroup.id, false)" :class="!spotis[citem.miniZtAttrGroup.id] ? 'borderred' : ''">否</el-button>
                          </div>
                          <div class="laycon childactive" style="flex-wrap: wrap; text-indent: 8em; color: #666">
                            <div v-if="spot[citem.miniZtAttrGroup.id]" style="display: flex">
                              <div class="yszs"><span style="color:red;">*温馨提示：</span>请填写PANTONE色号:</div>
                              <el-input
                                style="text-indent: 0em; width: 90px; margin-right: 8px"
                                :disabled="spotis[citem.miniZtAttrGroup.id]"
                                v-for="(sv, si) in parseInt(spot[citem.miniZtAttrGroup.id])"
                                v-model="spotinp[citem.miniZtAttrGroup.id][si + 1]"
                                :key="si"
                                @change="getprice"
                              ></el-input>
                            </div>
                            <p style="margin-top: 10px">
                              <span class="red">*</span>官方默认以潘通色卡版本“
                              <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                                <template slot="content">
                                  <div class="EattrMtips" style="width: 400px"><img width="400px" src="@/static/index/img/Patone.jpg" alt="" /></div>
                                </template>
                                <span style="color: red; cursor: pointer">Pantone LCC, 2019.</span>
                              </el-tooltip>
                              ”为准，若须以您自有色卡为准，请邮寄您的色卡给傲彩。
                            </p>
                          </div>
                        </template>

                        <div class="laycon childactive" style="text-indent: 3.6em; font-size: 12px" v-if="citem.miniZtAttrGroup.name == '圆磁对数'">
                          <div class="laychild">
                            <div><span class="red">*温馨提示：</span>1枚磁铁+1枚铁片组合为一对，磁铁安装在内盒，铁片安装在皮壳</div>
                          </div>
                        </div>
                        <!-- 包边 -->
                        <div class="laycon " style="text-indent: 3.8em; font-size: 12px;margin-top: -5px;padding:0;" v-if="citem.miniZtAttrGroup.name == '包边高度'">
                          <div class="laychild">
                            <div><span class="red">*温馨提示：</span>包边高度应不小于20MM并且小于盒子高度，不录入默认包到底</div>
                          </div>
                        </div>
                        <!-- 书型盒内盒方磁提示 -->
                        <div class="laycon childactive" style="text-indent: 3.6em; font-size: 12px;margin-top: -5px;padding:0;" v-if="citem.miniZtAttrGroup.code == 'PJ_FC_FCDS_NH'">
                          <div class="laychild">
                            <div><span class="red">*温馨提示：</span>2枚磁铁组合为一对，1枚安装在内盒，1枚安装在皮壳</div>
                          </div>
                        </div>
                        <!-- 平口天地盒天盖方磁提示 -->
                        <div class="laycon childactive" style="text-indent: 3.6em; font-size: 12px;margin-top: -5px;padding:0;" v-if="citem.miniZtAttrGroup.code == 'PJ_FC_FCDS_TG'">
                          <div class="laychild">
                            <div><span class="red">*温馨提示：</span>2枚磁铁组合为一对，1枚安装在天盖，1枚安装在地盒</div>
                          </div>
                        </div>
                        <!-- 抽屉盒柜桶方磁提示 -->
                        <div class="laycon childactive" style="text-indent: 3.6em; font-size: 12px;margin-top: -5px;padding:0;" v-if="citem.miniZtAttrGroup.code == 'PJ_FC_FCDS_GT'">
                          <div class="laychild">
                            <div><span class="red">*温馨提示：</span>2枚磁铁组合为一对，1枚安装在柜桶，1枚安装在抽屉</div>
                          </div>
                        </div>
                        <!-- 特种纸提示 -->
                        <div class="laycon childactive" style="text-indent: 5.7em; font-size: 12px;padding: 0;" v-if="citem.miniZtAttrGroup.name == '材质' && citem.miniZtAttrGroup.parentAttrName == '特种纸'">
                          <div class="laychild">
                            <div><span class="red">*温馨提示：</span>若须以您提供的颜色纹理为准，请先邮寄您的样品给傲彩，由傲彩产生物料编号供您下订单时录入。</div>
                          </div>
                        </div>
                        <!-- 灰底色板提示 -->
                        <div class="laycon childactive" style="text-indent: 9em; font-size: 12px;padding: 0;" v-if="citem.miniZtAttrGroup.name.trim() == '' && citem.miniZtAttrGroup.parentAttrName == '灰底色板'">
                          <div class="laychild">
                            <div><span class="red">*温馨提示：</span>若须以您提供的颜色纹理为准，请先邮寄您的样品给傲彩，由傲彩产生物料编号供您下订单时录入。</div>
                          </div>
                        </div>
                        <!-- 压纹提示 -->
                        <div class="laycon childactive" style="text-indent: 5.7em; font-size: 12px;padding: 0;" v-if="citem.miniZtAttrGroup.name == '压纹'">
                          <div class="laychild">
                            <div><span class="red">*温馨提示：</span>若须以您提供的颜色纹理为准，请先邮寄您的样品给傲彩，由傲彩产生纹理编号供您下订单时录入。</div>
                          </div>
                        </div>
                        <!-- 配件方磁、圆磁以外提示 -->
                        <div class="laycon childactive" style="text-indent: 3.6em; font-size: 12px;padding: 0;" v-if="citem.miniZtAttrGroup.name == '物料编号' && citem.miniZtAttrGroup.pname == '配件'">
                          <div class="laychild">
                            <div><span class="red">*温馨提示：</span>若须以您提供的配件样式为准，请先邮寄您的样品给傲彩，由傲彩产生物料编号供您下订单时录入。</div>
                          </div>
                        </div>
                        <div v-if="citem.miniZtAttrGroup.showName == 0" v-show="showEndBorder(item.attrList, i)" class="laycon childactive" style="border-bottom:1px solid #eee;width: 100%;"></div>
                      </div>
                    </div>

                    <template v-if="index == 0">
                      <div class="laybox" v-if="subCateId != 129">
                        <div class="laycon">
                          <div class="laychild">
                            <div class="EattrLab" style="font-size: 13px">结构</div>
                            <div class="flex">
                              <el-radio-group class="EattrMgroup" size="small" v-model="dew" button-style="solid" v-if="subCateId == 128 || subCateId == 138">
                                <el-row class="Eattrrow">
                                  <el-radio-button size="small" @click.native.prevent="sizechange(100, 1)" label="1"> 露腰 </el-radio-button>
                                </el-row>
                              </el-radio-group>
                              <el-radio-group class="EattrMgroup" size="small" v-model="dew" button-style="solid" @change="sizechange(100)" v-if="subCateId == 128 || subCateId == 137">
                                <el-row class="Eattrrow">
                                  <el-radio-button size="small" @click.native.prevent="sizechange(100, 2)" label="2"> 露底 </el-radio-button>
                                </el-row>
                              </el-radio-group>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="laybox" v-if="dew">
                        <div class="laycon">
                          <div class="laychild">
                            <div class="EattrLab">露{{ dew == 1 ? '腰' : '底' }}高度</div>
                            <div class="flex">
                              <el-row class="flex inputBx Layerinpts">
                                <div class="inputBxrow">
                                  <el-input v-model="dewinp" placeholder="高" size="small" @change="sizechange(100)">
                                    <template slot="append"> mm </template>
                                  </el-input>
                                </div>
                              </el-row>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-form-item>
                </template>
              </el-form>
            </div>

            <div v-show="false && data2.length">
              <div class="eattrtitle" style="margin-top: 10px; padding-top: 10px; text-indent: 1em">组装工艺</div>
              <div class="laybox">
                <div class="laycon">
                  <div class="laychild">
                    <div class="EattrLab" style="line-height: 36px; font-size: 13px"><span class="red">*</span>组装工艺</div>
                    <div class="flex">
                      <!-- <el-radio-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice">
                        <el-row class="Eattrrow">
                          <el-radio-button size="small" label="组装工艺:粘接;"> 需要粘接 </el-radio-button>
                        </el-row>
                      </el-radio-group>
                      <el-radio-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice" v-if="subCateId != 128 && subCateId != 138">
                        <el-row class="Eattrrow">
                          <el-radio-button size="small" label="组装工艺:无"> 不需粘接 </el-radio-button>
                        </el-row>
                      </el-radio-group> -->
                      <!-- <el-row class="Eattrrow" >
                        <el-checkbox-button label="组装工艺:粘接;" v-model="group" :disabled="false" @change="getprice"> 粘接 </el-checkbox-button>
                        <el-checkbox-button label="组装工艺:冲孔;" v-model="group" :disabled="false" @change="getprice"> 冲孔 </el-checkbox-button>
                      </el-row> -->
                      <el-checkbox-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice">
                        <el-row class="Eattrrow">
                          <el-checkbox-button size="small" label="粘接" :disabled="subCateId == '128' || subCateId == '138' ? true : false"> 粘接 </el-checkbox-button>
                        </el-row>
                        <el-row class="Eattrrow">
                          <el-checkbox-button size="small" label="冲孔"> 冲孔 </el-checkbox-button>
                        </el-row>
                      </el-checkbox-group>

                      <!-- <el-radio-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice">
                        <el-row class="Eattrrow">
                          <el-radio-button size="small" label="组合方式:绑定;"> 绑定 </el-radio-button>
                        </el-row>
                      </el-radio-group>
                      <el-radio-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice">
                        <el-row class="Eattrrow">
                          <el-radio-button size="small" label="组合方式:锁定;"> 锁定 </el-radio-button>
                        </el-row>
                      </el-radio-group> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="laybox" v-if="group.indexOf('冲孔') > -1" style="padding-bottom:8px;">
              <div class="laycon childactive">
                <div class="laychild">
                  <div class="EattrLab  bgcolor2"><span class="red">*</span><span class="titlename" style="line-height:32px;">冲孔数量</span></div>
                  <div class="flex">
                    <el-row class="flex inputBx Layerinpts">
                      <div class="inputBxrow">
                        <el-input v-model="hole" placeholder="" size="small" @change="getprice">
                          <template slot="append"> 孔 </template>
                        </el-input>
                      </div>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>

            <!-- 整体配件 -->
            <div v-show="false && data2.length">
              <div class="eattrtitle" style="padding-top: 10px; text-indent: 1em; margin-top: 10px">整体配件</div>
              <div class="laybox">
                <!-- <div class="laybox" style="margin-left: 10px; margin-top: -12px" v-if="false"> -->
                <div class="laycon">
                  <div class="laychild">
                    <div class="EattrLab" style="line-height: 36px;font-size:13px;">配件品类</div>
                    <div class="flex">
                      <el-checkbox-group class="EattrMgroup" size="small" v-model="entiretyGroup" button-style="solid" @change="pachange">
                        <el-row class="Eattrrow" v-for="item in entiretyList" :key="item.id">
                          <el-checkbox-button size="small" :label="item.name"> {{ item.name }} </el-checkbox-button>
                        </el-row>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-form class="EattrMain" style="margin-top:0;">
              <template v-for="item in entiretyList">
                <el-form-item :key="item.id" v-if="item.isShow" class="ztpj" style="margin-bottom:0 !important;">
                  <div class="eattrtitle" style="padding-top: 5px; text-indent: 3.6em;font-size:13px;line-height:40px;">配件品类 - {{ item.name }}</div>
                  <iframe :ref="item.id" :id="item.id" height="500px" width="100%" allowTransparency="true" frameBorder="0" scrolling="no" :src="item.url"></iframe>
                  <!-- @load -->
                </el-form-item>
              </template>
            </el-form>

            <div v-show="data2.length" v-if="routername == 'priceH'">
              <div class="eattrtitle" style="padding-top: 10px; text-indent: 1em; margin-top: 10px">增值服务</div>
              <div class="laybox">
                <div class="laycon">
                  <div class="laychild">
                    <div class="EattrLab" style="line-height: 36px; font-size: 13px"><span class="red">*</span>包装服务</div>
                    <div class="flex">
                      <el-radio-group class="EattrMgroup" size="small" v-model="pack" button-style="solid">
                        <el-row class="Eattrrow">
                          <el-radio-button size="small" label="平口箱外箱"> 平口箱外箱 </el-radio-button>
                        </el-row>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-button @click="sub">提交</el-button> -->
    <!-- 压纹详情图片弹窗 -->
    <el-dialog :visible.sync="dialogVisible" top="20px" width="1250px" title="压纹详情" :before-close="handleClose">
      <el-scrollbar style="height: 750px">
        <div class="veinsDesc">
          <img src="/uploads/images/veins01.jpg" width="1200" />
          <img src="/uploads/images/veins02.jpg" width="1200" />
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { getVoList, getBySubBindId, checkPantone } from '@/api/product/attrApi';
import { strEquals, startWith } from '@/utils/strUtil';
import { getAreaName } from '@/utils/city';
import { priceInvoke, getShippingFee, computeSize } from '@/api/price/priceApi';
import { add, updateIsFromCheck } from '@/api/cart/cartApi';
import { addCartReq } from '@/api/cart/cartProofApi';
import { checkToken } from '@/api/users/userApi';
import { proofGetPrice } from '@/api/price/proofApi';
import { getSubNav } from '@/utils/cateNavsUtil';
import entirety from '@/views/price/mixins/entirety.js';
import { defaultCheckbox, entiretyList } from '@/utils/json/HardcoverQuotation';

import setFormData from './mixins/setFromData.js';
export default {
  name: 'HardcoverQuotation',
  mixins: [entirety, setFormData],
  data() {
    return {
      formData: {},
      radiodata: {},
      inputdata: {},
      checkdata: {},
      selectdata: {},
      parentdata: [],
      cascaderdata: {},
      spotis: {},
      pack: '平口箱外箱',
      sizeobj: {},
      titleobj: { name: '' },
      goodsId: '',
      hole: 0,
      group: ['粘接'],
      loginstatus: false,
      routername: this.$route.name,
      common: [
        {
          groupType: 'input',
          code: 'SIZE',
          name: '成品外尺寸',
          actualValue: '成品尺寸',
          id: 100,
          attrList: [
            { id: 101, code: 'goodAl', suffix: 'x', name: '长', inputTips: '长', groupId: 100, val: 'long' },
            { id: 102, code: 'goodAw', suffix: 'x', name: '宽', inputTips: '宽', groupId: 100, val: 'wide' },
            { id: 103, code: 'goodAd', suffix: 'mm', name: '高', inputTips: '高', groupId: 100, val: 'hign' }
          ]
        },
        {
          groupType: 'input',
          name: '单款数量',
          code: 'YSSL',
          id: 5000,
          attrList: [{ id: 5001, code: 'YSSL', defaultValue: '0', suffix: '套', name: '套', inputTips: '套', groupId: 5000, val: 'num' }]
        },
        {
          groupType: 'input',
          name: '同款款数',
          code: 'YSSL',
          id: 6000,
          attrList: [{ id: 6001, code: 'TKSL', defaultValue: '0', suffix: '款', name: '款', inputTips: '款', groupId: 6000, val: 'same' }]
        }
      ],
      spot: {},
      spotinp: {},
      spotnum: {},
      snum: 4,
      jybm: {},
      maxobj: {},
      data: [],
      data2: [],
      data3: [],
      printing: {},
      parentchangedata: [],
      subCateId: this.subCateId,
      wxattr: '',
      wxnum: 0,
      wxprice: 0,
      jzattr: '',
      dew: '',
      dewinp: 0,
      priceFormData: {
        num: 0,
        long: '',
        wide: '',
        hign: '',
        same: 1,
        extends: '1',
        priceProgress: false,
        provinceId: '',
        cityId: '',
        yssl: 0,
        tkks: 1,
        boxmoney: '0',
        common_time: 0,
        days: 0,
        days_fast: 0,
        days_normal: 15,
        days_slow: 7,
        editfee: 0,
        msg: '',
        out_time: '',
        percentV: 1,
        price_fast: '0',
        price_member: '0',
        price_normal: '0',
        price_old: 0,
        price_slow: '0',
        pro: '0',
        savemoney: '0.00',
        shipping_fee: 0,
        time_fast: 0,
        time_normal: 360,
        time_slow: 168,
        total_price: 0,
        weight: 0
      },
      initprice: {
        num: 0,
        long: '',
        wide: '',
        hign: '',
        same: 1,
        extends: '1',
        priceProgress: false,
        provinceId: '',
        cityId: '',
        yssl: 0,
        tkks: 1,
        boxmoney: '0',
        common_time: 0,
        days: 0,
        days_fast: 0,
        days_normal: 15,
        days_slow: 7,
        editfee: 0,
        msg: '',
        out_time: '',
        percentV: 1,
        price_fast: '0',
        price_member: '0',
        price_normal: '0',
        price_old: '0',
        price_slow: '0',
        pro: '0',
        savemoney: '0.00',
        shipping_fee: 0,
        time_fast: 0,
        time_normal: 360,
        time_slow: 168,
        total_price: 0,
        weight: 0
      },
      classidstr: '129,33,130',
      classid: '',
      copyp: 10000,
      addarr: [],
      parts: '',
      timer: null,
      timer2: null,
      boxobj: {},
      infoobj: {},
      tjarr: [],
      dialogVisible: false, // 压纹详情图片是否显示
      fnumber: 1, // 同款款数
      boxstr: '内盒,柜桶,抽屉,天盖,地盒',
      defaultCheckbox
    };
  },
  created() {
    let _this = this;
    console.log(' _this.baseIds', _this.baseIds);
    _this.cateId = _this.baseIds.cateId;
    _this.subCateId = _this.baseIds.subCateId;
    _this.goodsId = _this.baseIds.goodsId;
    _this.whereBindId = _this.subCateId;
    // 设计打样 订单数量
    // if (this.$route.path == '/proof/HardcoverQuotation') {
    //   this.priceFormData.num = 1;
    // }

    let formData = JSON.parse(JSON.stringify(_this.oldFormData));
    _this.$set(_this, 'priceFormData', formData.commonFormDatainputValue);
    console.log(' formData.formDatainputValue', formData.formDatainputValue);
    _this.setFormData(formData.commonFormDatainputValue, formData.formDatainputValue);
    _this.getdata();
    // getVoList({
    //   bindType: 'cate',
    //   bindId: this.subCateId,
    //   // bindId: '128',
    //   whereBindId: '',
    //   whereGoodsId: ''
    // }).then(res => {
    //   console.log(res.data);
    // });
    this.getByGoodsIdfn();

    // checkToken().then(res => {
    //   if (res.code != '000000') {
    //     this.loginstatus = true;
    //   }
    // });
  },
  mounted() {
    // const scrollDiv = document.querySelector('body');
    // this.fixednum = document.querySelector('.fixedstatus').clientHeight;
    // const divclass = document.querySelector('.fixedstatus');
    // const guigeRtWrap = document.querySelector('.guigeRtWrap').clientHeight;
    // scrollDiv.onscroll = () => {
    //   const divheight = document.querySelector('.guigeLt')?.clientHeight;
    //   if (document.documentElement.scrollTop > 350) {
    //     if (document.documentElement.scrollTop > divheight + 350 - guigeRtWrap) {
    //       divclass.style.marginTop = divheight - guigeRtWrap + 'px';
    //     } else {
    //       divclass.style.marginTop = document.documentElement.scrollTop - 350 + 'px';
    //     }
    //   } else {
    //     divclass.style.marginTop = 0;
    //   }
    // };
    let _this = this;
  },
  watch: {},
  methods: {
    setFormData(commonFormDatainputValue, formDatainputValue) {
      console.log('数据回显', commonFormDatainputValue, formDatainputValue);
      let _this = this;
      if (!commonFormDatainputValue || !formDatainputValue) {
        return;
      }
      // 精品盒回显
      _this.$set(_this, 'priceFormData', commonFormDatainputValue);
      _this.$set(_this, 'inputdata', formDatainputValue.inputdata); // 子集输入框
      _this.$set(_this, 'radiodata', formDatainputValue.radiodata);
      _this.$set(_this, 'checkdata', formDatainputValue.checkdata);
      _this.$set(_this, 'selectdata', formDatainputValue.selectdata);
      // let arr =  formDatainputValue.data2.filter(e => e.miniZtAttrGroup.name!='部件信息').map(e => e.miniZtAttrGroup.id)
      // console.log('data2', arr);
      // let obj = {}
      // for (const key in formDatainputValue.checkdata) {
      //   if(formDatainputValue.checkdata[key].length>0){
      //     obj[key] = formDatainputValue.checkdata[key]
      //   }
      // }
      // console.log('objobjobjobj',obj)
      let newData2 = [];
      console.log(' _this.data');
      let idsObj = {};
      function test(arr, attrList) {
        for (const index in arr) {
          let item2 = arr[index];
          let item = _this.data.find(e => e.miniZtAttrGroup.name === item2.miniZtAttrGroup?.name);
          let key = '';
          let isPack = 0;
          if (item) {
            if (item2.miniZtAttrGroup) {
              item2.miniZtAttrGroup.isPack = item.miniZtAttrGroup.isPack;
              isPack = item2.miniZtAttrGroup.isPack;
              key = item2.miniZtAttrGroup.id;
              // if(isPack==1&&idsObj[arr[index].miniZtAttrGroup.pid]===0) item2.miniZtAttrGroup.isPack = 0;
              if (arr[index].miniZtAttrGroup.code.indexOf('YSYS') > -1) {
                console.log('dddcccccccccccccccccccc', item2);
                console.log('dddcccccccccccccccccccc', idsObj);
              }
            }
          } else {
            arr[index].isPack = attrList.find(e => e.name === item2.name)?.isPack;
            isPack = arr[index].isPack;
          }
          idsObj[key] = isPack;
          // console.log('.isPack', arr[index]);
          if (item2.attrList?.length > 0) {
            test(item2.attrList, item.attrList);
          }
        }
      }
      // test(formDatainputValue.data2);
      // _this.$set(_this, 'data2', formDatainputValue.data2);
      // _this.$set(_this, 'data', formDatainputValue.data);
      // _this.$set(_this, 'data3', formDatainputValue.data);
      // _this.$set(_this, 'data2', newData2);
      console.log('data2', newData2);
    },
    showStartBorder(list, i) {
      // console.log('item',item)
      let startIndex = list.findIndex(e => e.miniZtAttrGroup.showName == 1);
      let endIndex = list.findLastIndex(e => e.miniZtAttrGroup.showName == 1);
      // console.log('startIndex', startIndex);
      // console.log('endIndex', endIndex);
      if (i == 0) {
        return true;
      } else {
        return list[i - 1].miniZtAttrGroup.showName == 1;
      }
    },
    showEndBorder(list, i) {
      // console.log('item',item)
      let startIndex = list.findIndex(e => e.miniZtAttrGroup.showName == 1);
      let endIndex = list.findLastIndex(e => e.miniZtAttrGroup.showName == 1);
      // console.log('startIndex', startIndex);
      // console.log('endIndex', endIndex);
      let item = list[i + 1];
      if (!item) return true;
      return list[i + 1].miniZtAttrGroup.showName == 1;
    },
    ...{ strEquals },
    // 修改iframe
    getdata() {
      let _this = this;
      getVoList({
        bindType: 'cate',
        bindId: this.subCateId,
        // bindId: '129',
        // isPack: 1,
        whereBindId: '',
        whereGoodsId: ''
      }).then(res => {
        let getobj = JSON.parse(JSON.stringify(res.data));
        this.data = res.data;
        // this.setdata()
        let layid = [];
        for (let i = 0; i < this.data.length; i++) {
          // for (let j = 0; j < this.data[i].attrList.length; j++) {
          //   if (this.data[i].miniZtAttrGroup.actualValue == 'linkage') {
          //     if (this.data[i].attrList[j].actualValue) {
          //       let larr = this.data[i].attrList[j].actualValue.split('_');
          //       this.data[i].attrList[j].children = [];
          //       for (let obj in larr) {
          //         this.data[i].attrList[j].children.push({ name: larr[obj] });
          //       }
          //     }
          //   }
          // }
          if (this.data[i].miniZtAttrGroup.actualValue == 'layer') {
            layid.push(this.data[i].miniZtAttrGroup.id);
          }
          // if (this.data[i].miniZtAttrGroup.name == '表面处理') {
          //   this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].miniZtAttrGroup.id + '_' + this.data[i].attrList[0].id);
          // }
          if (this.data[i].miniZtAttrGroup.actualValue == 'title') {
            this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].miniZtAttrGroup.id + '_' + this.data[i].attrList[0].id);
          }
          // if(this.data[i].miniZtAttrGroup.name=='尺寸'){
          //   this.data[i].attrList.forEach(e => {
          //     this.$set(this.maxobj,e.groupId+'_'+e.id,999)
          //   });
          // }
          // if (this.classidstr.indexOf(this.subCateId) > -1) {
          //   if (this.data[i].miniZtAttrGroup.code == 'BJ_parent') {
          //     this.data[i].attrList[0].name = this.classid;
          //   }
          //   if (this.data[i].miniZtAttrGroup.name == '皮壳') {
          //     this.data[i].miniZtAttrGroup.name = this.classid;
          //   }
          //   if (this.data[i].miniZtAttrGroup.name == '部件' && this.data[i].attrList[0].actualValue == '部件:皮壳') {
          //     this.data[i].attrList[0].actualValue = '部件:'+this.classid;
          //   }
          // }
        }
        this.data2 = getobj.filter(e => {
          return e.miniZtAttrGroup.actualValue == 'layer';
        });
        let layeridstr = this.data2.map(v => {
          return v.miniZtAttrGroup.id;
        });

        // console.log(layeridstr.indexOf(8371));

        // console.log('data2',this.data2)
        for (let i = 0; i < this.data.length; i++) {
          // console.log(111,this.data2[i].miniZtAttrGroup.id);
          if (layeridstr.indexOf(this.data[i].miniZtAttrGroup.pid) > -1) {
            // console.log('if',this.data[i]);
            // console.log('of',layeridstr.indexOf(this.data[i].miniZtAttrGroup.pid));
            this.data2[layeridstr.indexOf(this.data[i].miniZtAttrGroup.pid)].attrList.push(this.data[i]);
            // this.data2[layeridstr.indexOf(this.data[i].miniZtAttrGroup.pid)].attrList.push(...this.data[i])
          }
        }

        // this.getparent();
        this.data3 = JSON.parse(JSON.stringify(this.data2));
        console.log(
          '面料',
          getobj.filter(e => e.miniZtAttrGroup.name == '面料')
        );
        // 默认选中部件
        let defaultCheckboxArr = this.defaultCheckbox[this.subCateId] || [];
        for (let index = 0; index < defaultCheckboxArr.length; index++) {
          let i = _this.data3.findIndex(e => defaultCheckboxArr[index].name === e.miniZtAttrGroup.name);
          if (i != -1) {
            this.copypart(defaultCheckboxArr[index].id, i, this.data3[i].miniZtAttrGroup.groupName, this.data3[i].miniZtAttrGroup.name);
          }
        }
        console.log('arrarrarrarrarr', defaultCheckboxArr);
        // let index1 = this.data3.findIndex(e => defaultCheckboxArr.find(s => s.name === e.miniZtAttrGroup.name))
        // let index2 = this.data3.findIndex((e, index) => index != index1 && defaultCheckboxArr.find(s => s === e.miniZtAttrGroup.name));
        // let index3 = this.data3.findIndex((e, index) => index != index1 && index != index2 && defaultCheckboxArr.find(s => s === e.miniZtAttrGroup.name));
        // console.log('index1', index1)
        // this.copypart(15652, index1, this.data3[index1].miniZtAttrGroup.groupName, this.data3[index1].miniZtAttrGroup.name);
        // this.copypart(35652, index2, this.data3[index2].miniZtAttrGroup.groupName, this.data3[index2].miniZtAttrGroup.name);
        // if (this.$route.query.subCateId == 138) {
        //   this.copypart(45652, index3, this.data3[index3].miniZtAttrGroup.groupName, this.data3[index3].miniZtAttrGroup.name);
        // }
        console.log(
          'getobj',
          getobj.filter(e => e.miniZtAttrGroup.name === '部件')
        );
        let shoushop = getobj.find(e => e.miniZtAttrGroup.name === '部件' && e.miniZtAttrGroup.pname === '根目录')?.miniZtAttrGroup.defaultSelect;
        for (let a = this.data2.length - 1; a >= 0; a--) {
          if (!this.data2[a].miniZtAttrGroup.reminder || shoushop.indexOf(this.data2[a].miniZtAttrGroup.reminder) == -1) {
            if (a == 0) continue;
            this.data2.splice(a, 1);
          }
        }

        this.$store.dispatch('GetPriceCateNavs').then(res => {
          console.log('res', res);
          console.log('dddd', this.$store.getters.priceCateNavs);
          console.log(getSubNav(res.data, this.cateId, this.subCateId, 1));
          this.titleobj = getSubNav(this.$store.getters.priceCateNavs, this.cateId, this.subCateId, 1);
        });

        let oldFormDataCopy = JSON.parse(JSON.stringify(_this.oldFormData));
        console.log('当前最新的属性数据', getobj);
        console.log('旧数据', oldFormDataCopy.formDatainputValue.parentdata);
        // _this.$set(_this, 'parentdata', oldFormDataCopy.formDatainputValue.parentdata);
        let oldData2 = oldFormDataCopy.formDatainputValue.data2;
        let newData2 = [];
        let newData = [];
        let newCzjData = [];
        // 使用旧的data2数据进行遍历，再去查询最新的属性数据，得到新的data2，以防止数据更新了，data2的数据使用的还是旧的数据
        function getNewData2(attrList, newDataAttrList) {
          for (let index = 0; index < attrList.length; index++) {
            let newItem = {};
            let item = attrList[index];
            if (item.miniZtAttrGroup) {
              // 判断是否是根目录
              if (item.miniZtAttrGroup.pid == 0 && item.miniZtAttrGroup.pname == '根目录' && item.miniZtAttrGroup.reminder) {
                _this.parentdata.push(item.miniZtAttrGroup.reminder); //根目录就吧把选中的值放入parentdata
              }
              // 在最新请求到的数据里面查询旧数据ID是否存在
              let data = getobj.find(e => e.miniZtAttrGroup.id == item.miniZtAttrGroup.id);

              // 查询不到可能是ID被转换了
              if (!data) {
                if (item.addi) {
                  //判断是否是被添加的部件，例：部件:皮壳2,那么这个数据的ID就需要减去item.addi * 5000在查找
                  data = getobj.find(e => item.miniZtAttrGroup.id - item.addi * 5000 == e.miniZtAttrGroup.id);
                } else {
                  // 如果是非添加的部件，就需要减去原ID再10000然后余15430判断是否是等于0，等于则证明这个数据就是原数据
                  data = getobj.find(e => (item.miniZtAttrGroup.id - e.miniZtAttrGroup.id - 10000) % 15430 === 0);
                }
              }
              if (data) {
                // 结构出旧数据data2里面的属性，这些属性是需要的，剩下的属性要取最新的
                // newCzjData.push(data);
                let { id, parentAttrName, parentAttrId, parentLevel, pid, pname, actualValue, reminder, code, sortOrder } = item.miniZtAttrGroup;
                newItem = {
                  miniZtAttrGroup: { ...data.miniZtAttrGroup, id, parentAttrName, parentAttrId, parentLevel, pid, pname, actualValue, reminder, code, sortOrder },
                  attrList: []
                };
                // 判断舒服是添加的值，例：面料2
                if (item.addnum) {
                  newItem.addnum = item.addnum;
                }
                // 判断是否是被添加的部件，例：部件:皮壳2
                if (item.addi) {
                  newItem.addi = item.addi;
                }
                // 判断attrList是否有数据
                newCzjData.push(item);
                if (item.attrList.length) {
                  // 判断到了最后一级，最后一级的数据没有miniZtAttrGroup属性，没到最后一级就递归
                  if (item.attrList[0].miniZtAttrGroup) {
                    getNewData2(item.attrList, newItem.attrList, index);
                  } else {
                    // 最后一级的attrList
                    for (let index2 = 0; index2 < data.attrList.length; index2++) {
                      let item2 = data.attrList[index2];
                      // 通过旧数据data2的id计算得出数据
                      let attr = item.attrList.find(e => (e.id - item2.id - 10000) % 15430 === 0);
                      if (!attr) {
                        // 差不多可能是不需要计算就可以查询数据
                        attr = item.attrList.find(e => e.id == item2.id);
                      }
                      if (attr) {
                        // 判断实际值是否一样
                        if (attr.actualValue !== item2.actualValue) {
                          let reg = new RegExp(`面料[\\d]{0,}`, 'g');
                          let retArr = attr.actualValue.match(reg);
                          // 实际值有可能是多个面料导致的不一致，但是也有可能是修改了实际值，所以需要截取data2里面的面料1或面料2的字段，用于替换在新字段里面
                          if (retArr && retArr.length && attr.actualValue) {
                            item2.actualValue = item2.actualValue.replace(reg, retArr[0]);
                          } else {
                            // 不一样也有可能是因为是皮壳2这种添加的部件
                            if (item2.name == '部件') {
                              item2.actualValue = attr.actualValue;
                            }
                          }
                        }
                        newItem.attrList.push({ ...item2, id: attr.id, groupId: attr.groupId });
                      }
                    }
                  }
                }
                newDataAttrList.push(newItem);
              }
            }
          }
        }
        getNewData2(oldData2, newData2);
        getNewData2(oldFormDataCopy.formDatainputValue.data, newData);
        _this.$set(_this, 'data2', newData2);
        _this.$set(_this, 'data', newData);
        console.log('最新的DATA2', newData2);
        // let ssss = new Set( newCzjData.map(e=> JSON.stringify(e)))
        console.log('最新的DATA', newData);
      });
    },
    initial() {
      this.$set(this, 'radiodata', {});
      this.$set(this, 'inputdata', {});
      this.$set(this, 'checkdata', {});
      this.$set(this, 'selectdata', {});
      this.$set(this, 'spotis', {});
      this.$set(this, 'copyp', 10000);
      this.$set(this, 'dew', '');
      this.$set(this, 'dewinp', 0);
      this.$set(this, 'hole', 0);
      this.$set(this, 'group', ['粘接']);
      this.$set(this, 'entiretyList', entiretyList);
      this.$set(this, 'entiretyGroup', []);
      this.$set(this, 'printing', {});
      this.$set(this, 'spot', {});
      this.$set(this, 'jybm', {});
      this.$set(this, 'parentdata', []);
      this.$set(this, 'data', []);
      this.$set(this, 'data2', []);
      this.$set(this, 'data3', []);
      this.$set(this, 'fnumber', 1);
      this.$set(this, 'priceFormData', JSON.parse(JSON.stringify(this.initprice)));
      this.getdata();
      this.getByGoodsIdfn();
      // if (this.subCateId == '101') {
      //   this.priceFormData.time_normal = 168;
      //   this.priceFormData.days_normal = 7;
      // }
    },
    // setdata(){
    //   if(this.subCateId==129){
    //     for(let i=0;i<this.data.length;i++){
    //       if(this.data[i].miniZtAttrGroup.name=='皮壳'){
    //         console.log('set',this.data[i]);
    //       }
    //     }
    //   }
    // },
    copypart(id, index, num = 1, name = '') {
      this.copyp = this.copyp + 15430;
      this.addarr = [];
      // console.log('this.copyp', this.copyp);
      let partlist = [];
      if (name == '内围框') {
        partlist = [JSON.parse(JSON.stringify(this.data2[0].attrList[1])), JSON.parse(JSON.stringify(this.data2[0].attrList[2]))];
      } else if (name == '外连接' || name == '内连接') {
        partlist = [JSON.parse(JSON.stringify(this.data2[0].attrList[1]))];
      } else {
        partlist = JSON.parse(JSON.stringify(this.data2[0].attrList));
        partlist.shift();
      }
      // console.log('partlist', partlist);
      for (let i = 0; i < partlist.length; i++) {
        partlist[i].miniZtAttrGroup.pid = id;
        partlist[i].miniZtAttrGroup.id = partlist[i].miniZtAttrGroup.id + this.copyp;
        partlist[i].miniZtAttrGroup.reminder = '';
        partlist[i].miniZtAttrGroup.pname = name;
        for (let j = 0; j < partlist[i].attrList.length; j++) {
          this.lookupdata(partlist[i].attrList[j].groupId, partlist[i].attrList[j].id, name);
          partlist[i].attrList[j].groupId = partlist[i].miniZtAttrGroup.id;
          partlist[i].attrList[j].id = partlist[i].attrList[j].id + this.copyp;
        }
        if (partlist[i].miniZtAttrGroup.name == '面料') {
          partlist[i].miniZtAttrGroup.groupName = num;
        }
        // if ((partlist[i].miniZtAttrGroup.pname == '面顶贴' || partlist[i].miniZtAttrGroup.pname == '皮壳') && partlist[i].miniZtAttrGroup.name == '芯板' && partlist[i].miniZtAttrGroup.reminder != 'hide') {
        //   console.log('mmmmmmm', partlist[i]);
        // }
        // if (partlist[i].miniZtAttrGroup.name == '芯板' && partlist[i].miniZtAttrGroup.pname == '面顶贴') {
        //   console.log('partlist[i]',partlist[i]);
        // }
      }
      // console.log('partlist', partlist);
      // console.log('addarr', this.data2[1].attrList);

      this.data2[index].attrList.push(...partlist);
      this.data.push(...partlist);

      for (let ii = 0; ii < this.addarr.length; ii++) {
        this.addarr[ii].miniZtAttrGroup.pid = this.addarr[ii].miniZtAttrGroup.pid + this.copyp;
        this.addarr[ii].miniZtAttrGroup.id = this.addarr[ii].miniZtAttrGroup.id + this.copyp;
        this.addarr[ii].miniZtAttrGroup.parentAttrId = this.addarr[ii].miniZtAttrGroup.parentAttrId + this.copyp;
        for (let jj = 0; jj < this.addarr[ii].attrList.length; jj++) {
          this.lookupdata(this.addarr[ii].attrList[jj].groupId, this.addarr[ii].attrList[jj].id, name);
          this.addarr[ii].attrList[jj].groupId = this.addarr[ii].miniZtAttrGroup.id;
          this.addarr[ii].attrList[jj].id = this.addarr[ii].attrList[jj].id + this.copyp;
          // if (this.addarr[ii].miniZtAttrGroup.pname == '芯板' && this.addarr[ii].attrList[jj].name == 'V槽') {
          //   console.log(this.addarr[ii]);
          // }
        }
      }
      this.data.push(...this.addarr);
      this.data2[index].attrList.sort(this.sortlayer);
    },
    lookupdata(pid, parentAttrId, name) {
      let str = '皮壳,面顶贴,天盖,柜桶';
      for (let i = 0; i < this.data.length; i++) {
        const groupItem = this.data[i];
        if (groupItem.miniZtAttrGroup.pid == pid && parentAttrId == groupItem.miniZtAttrGroup.parentAttrId) {
          if (groupItem.attrList != null && groupItem.attrList.length > 0) {
            if ((groupItem.miniZtAttrGroup.name == '是否裱盒内围' && this.boxstr.indexOf(name) == -1) || (groupItem.miniZtAttrGroup.name == '是否加海绵' && str.indexOf(name) == -1)) {
              continue;
            }
            this.addarr.push(JSON.parse(JSON.stringify(groupItem)));
            // if(groupItem.miniZtAttrGroup.groupType=='checkbox'){
            //   this.$set(this.checkdata,groupItem.miniZtAttrGroup.id,[])
            // }
            // console.log(groupItem.miniZtAttrGroup.name);
            // if (groupItem.miniZtAttrGroup.groupType == 'radio') {
            //   let attr = this.getDefaultAttr(groupItem.attrList, groupItem.miniZtAttrGroup.defaultSelect, true);
            //   this.lookupdata(attr.groupId, attr.id);
            // }
          }
        }
      }
    },
    getByGoodsIdfn() {
      getBySubBindId({ id: this.subCateId }).then(res => {
        if (res.code == '000000') {
          this.goodsId = res.data.id;
          this.infoobj = res.data;
        }
      });
    },
    demofn(fi, i, child, pid) {
      // const splits = this.radiodata[pid].split('_');
      // const groupId = splits[0];
      // const attrId = splits[1];
    },
    addlay(name) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        let index = this.data3.findIndex(v => {
          return v.miniZtAttrGroup.name == name;
        });
        let data = this.data3[index];
        const num = data.miniZtAttrGroup.groupName.split('_');
        const pnum = num[0];
        const cnum = num[1];
        let numlist = this.data2.filter(v => {
          return v.miniZtAttrGroup.name == name;
        });
        // console.log('numlist',numlist);
        if (pnum <= numlist.length) {
          this.$message({ type: 'error', message: '已经最大添加值' });
          return;
        }
        if (name == '柜桶') {
          // console.log('柜桶', numlist.length);
          let ctlist = this.data2.filter(v => {
            return v.miniZtAttrGroup.name == '抽屉';
          });
          if (numlist.length + 1 > ctlist.length) {
            this.$message({ type: 'error', message: '抽屉数量必须不少于柜桶数量' });
            return;
          } else {
            console.log(1);
          }
        }
        this.addarr = [];
        if (!data.addi) {
          data.addi = 1;
        }
        data.addi = numlist.length + 1;
        // console.log('data.addi', data.addi);
        const newItem = JSON.parse(JSON.stringify(data));
        newItem.miniZtAttrGroup.code = newItem.miniZtAttrGroup.code.replace('_1_add', '_' + data.addi + '_remove');
        newItem.miniZtAttrGroup.sortOrder = newItem.miniZtAttrGroup.sortOrder + data.addi;
        newItem.miniZtAttrGroup.id = newItem.miniZtAttrGroup.id + 5000 * data.addi;
        for (let i = 0; i < newItem.attrList.length; i++) {
          newItem.attrList[i].miniZtAttrGroup.pid = newItem.miniZtAttrGroup.id;
          newItem.attrList[i].miniZtAttrGroup.id = newItem.attrList[i].miniZtAttrGroup.id + 5000 * data.addi;
          newItem.attrList[i].miniZtAttrGroup.parentAttrId = newItem.attrList[i].miniZtAttrGroup.parentAttrId + 5000 * data.addi;
          for (let j = 0; j < newItem.attrList[i].attrList.length; j++) {
            this.lookupdata(newItem.attrList[i].attrList[j].groupId, newItem.attrList[i].attrList[j].id, name);
            newItem.attrList[i].attrList[j].groupId = newItem.attrList[i].miniZtAttrGroup.id;
            newItem.attrList[i].attrList[j].id = newItem.attrList[i].attrList[j].id + 5000 * data.addi;
          }
          if (newItem.attrList[i].miniZtAttrGroup.name == '部件') {
            newItem.attrList[i].attrList[0].actualValue = newItem.attrList[i].attrList[0].actualValue.replace('1', data.addi);
            this.$set(this.radiodata, newItem.attrList[i].miniZtAttrGroup.id, newItem.attrList[i].miniZtAttrGroup.id + '_' + newItem.attrList[i].attrList[0].id);
          }
          if (newItem.attrList[i].miniZtAttrGroup.name == '尺寸') {
            newItem.attrList[i].miniZtAttrGroup.actualValue = newItem.attrList[i].miniZtAttrGroup.actualValue.replace('1', data.addi);
          }
          this.data.push(newItem.attrList[i]);
        }
        this.data2.push(newItem);
        for (let ii = 0; ii < this.addarr.length; ii++) {
          this.addarr[ii].miniZtAttrGroup.pid = this.addarr[ii].miniZtAttrGroup.pid + 5000 * data.addi;
          this.addarr[ii].miniZtAttrGroup.id = this.addarr[ii].miniZtAttrGroup.id + 5000 * data.addi;
          this.addarr[ii].miniZtAttrGroup.parentAttrId = this.addarr[ii].miniZtAttrGroup.parentAttrId + 5000 * data.addi;
          for (let jj = 0; jj < this.addarr[ii].attrList.length; jj++) {
            this.lookupdata(this.addarr[ii].attrList[jj].groupId, this.addarr[ii].attrList[jj].id, name);
            this.addarr[ii].attrList[jj].groupId = this.addarr[ii].miniZtAttrGroup.id;
            this.addarr[ii].attrList[jj].id = this.addarr[ii].attrList[jj].id + 5000 * data.addi;
            // console.log('data2add',this.addarr[ii].attrList[jj].name);
          }
        }

        this.data.push(...this.addarr);
        this.copypart(81250, this.data2.length - 1, data.miniZtAttrGroup.groupName, data.miniZtAttrGroup.name);
        this.data2.sort(this.sortlayer);
        this.setchilidchange(this.data);
        this.setsize();
        this.getprice();
        // console.log('data', this.data);
      }, 500);

      // let savedata = this.paretnlength(data.miniZtAttrGroup.name);
      // let savename = savedata.map(e => {
      //   return e.miniZtAttrGroup.name;
      // });
      // let savecode = savedata.map(e => {
      //   return e.miniZtAttrGroup.code;
      // });
      // for (let i = 0; i < this.data3.length; i++) {
      //   if (savename.indexOf(this.data3[i].miniZtAttrGroup.name) > -1) {
      //     if (savecode.indexOf(this.data3[i].miniZtAttrGroup.code) == -1) {
      //       this.data2.push(this.data3[i]);
      //       this.data2.sort(this.sortlayer);
      //       setTimeout(() => {
      //         this.getprice();
      //       }, 500);
      //       return;
      //     } else {
      //       console.log('else12321');
      //     }
      //   }
      // }
    },
    colorblur(val) {
      console.log(val);
    },
    addchild(id, index, citem) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        const num = citem.miniZtAttrGroup.groupName.split('_');
        const cnum = num[1];
        let mlength = this.data2[index].attrList.filter(v => {
          return v.miniZtAttrGroup.name == '面料';
        });
        console.log('partlist', cnum <= mlength.length);
        if (cnum <= mlength.length || citem.miniZtAttrGroup.groupName == '') {
          this.$message({ type: 'error', message: '已经最大添加值' });
          return;
        }
        this.copyp = this.copyp + 15430;
        this.addarr = [];
        if (!citem.addnum) {
          citem.addnum = 1;
        }
        citem.addnum = mlength.length + 1;
        // console.log('this.copyp', citem.addnum * 1000);
        let partlist = (partlist = JSON.parse(JSON.stringify([this.data2[0].attrList[1]])));
        for (let i = 0; i < partlist.length; i++) {
          partlist[i].miniZtAttrGroup.reminder = '';
          partlist[i].miniZtAttrGroup.pid = id;
          partlist[i].miniZtAttrGroup.id = partlist[i].miniZtAttrGroup.id + this.copyp;
          partlist[i].miniZtAttrGroup.sortOrder = partlist[i].miniZtAttrGroup.sortOrder + citem.addnum * 1000;
          partlist[i].miniZtAttrGroup.code = partlist[i].miniZtAttrGroup.code.replace('ML_btn', 'ML_del_' + citem.addnum);
          for (let j = 0; j < partlist[i].attrList.length; j++) {
            this.lookupdata(partlist[i].attrList[j].groupId, partlist[i].attrList[j].id);
            partlist[i].attrList[j].groupId = partlist[i].miniZtAttrGroup.id;
            partlist[i].attrList[j].id = partlist[i].attrList[j].id + this.copyp;
          }
        }
        // console.log('partlist', partlist);
        // console.log('addarr', this.data2[1].attrList);

        this.data2[index].attrList.push(...partlist);
        this.data.push(...partlist);

        for (let ii = 0; ii < this.addarr.length; ii++) {
          this.addarr[ii].miniZtAttrGroup.pid = this.addarr[ii].miniZtAttrGroup.pid + this.copyp;
          this.addarr[ii].miniZtAttrGroup.id = this.addarr[ii].miniZtAttrGroup.id + this.copyp;
          this.addarr[ii].miniZtAttrGroup.parentAttrId = this.addarr[ii].miniZtAttrGroup.parentAttrId + this.copyp;
          this.addarr[ii].miniZtAttrGroup.sortOrder = this.addarr[ii].miniZtAttrGroup.sortOrder + citem.addnum * 1000;
          // console.log(this.addarr[ii].miniZtAttrGroup.actualValue);
          if (this.addarr[ii].miniZtAttrGroup.actualValue) {
            this.addarr[ii].miniZtAttrGroup.actualValue = this.addarr[ii].miniZtAttrGroup.actualValue.replace(/面料1/g, '面料' + citem.addnum);
          }
          for (let jj = 0; jj < this.addarr[ii].attrList.length; jj++) {
            this.lookupdata(this.addarr[ii].attrList[jj].groupId, this.addarr[ii].attrList[jj].id);
            this.addarr[ii].attrList[jj].groupId = this.addarr[ii].miniZtAttrGroup.id;
            this.addarr[ii].attrList[jj].id = this.addarr[ii].attrList[jj].id + this.copyp;
            this.addarr[ii].attrList[jj].sortOrder = this.addarr[ii].attrList[jj].sortOrder + citem.addnum * 1000;
            if (this.addarr[ii].attrList[jj].actualValue) {
              this.addarr[ii].attrList[jj].actualValue = this.addarr[ii].attrList[jj].actualValue.replace(/面料1/g, '面料' + citem.addnum);
            }
          }
        }
        this.data.push(...this.addarr);
        this.data2[index].attrList.sort(this.sortlayer);
        this.setchilidchange(this.data);
        this.getprice();
        // console.log(this.data);
        // console.log(this.data2);
      }, 500);
    },

    commonDataChange() {
      let inputValues = this.inputdata;
      let radioSelectValues = this.radiodata;
      let checkBoxSelectValues = this.checkdata;
      let selectSelectValues = this.selectdata;
      const groupValueList = [];
      this.tjarr = [];
      let pbox = {};
      // that.formVoList.sort(listSort);
      // console.log('formVoList',radioSelectValues)
      // 单选框
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          for (let var1 in radioSelectValues) {
            // console.log(radioSelectValues[var1]);
            const splits = radioSelectValues[var1].split('_');
            const groupId = splits[0];
            const attrId = splits[1];
            const attrItem = this.getGroupAttr(attrId, groupId);
            if (attrItem && strEquals(this.data2[i].attrList[j].miniZtAttrGroup.id, attrItem.groupId)) {
              if (attrItem.actualValue) {
                // if (attrItem.actualValue.indexOf('部件') > -1) {
                //   console.log('bjbj', attrItem.actualValue[attrItem.actualValue.length - 1], this.data2[i].miniZtAttrGroup.code.split('_')[1]);
                //   if (attrItem.actualValue[attrItem.actualValue.length - 1] == this.data2[i].miniZtAttrGroup.code.split('_')[1]) {
                //     groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + attrItem.actualValue + ';');
                //   }
                // } else {
                if (this.boxstr.indexOf(this.data2[i].miniZtAttrGroup.name) > -1 && this.data2[i].attrList[j].miniZtAttrGroup.name == '纸板材质') {
                  groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + attrItem.actualValue + ';打角:是;');
                } else {
                  groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + attrItem.actualValue + ';');
                }
                // }
              }
            }
          }
        }
      }

      //下拉选择框
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          for (let var1 in selectSelectValues) {
            const splits = selectSelectValues[var1].split('_');
            const groupId = splits[0];
            const attrId = splits[1];
            const attrItem = this.getGroupAttr(attrId, groupId);
            if (attrItem && strEquals(this.data2[i].attrList[j].miniZtAttrGroup.id, attrItem.groupId)) {
              if (attrItem.actualValue) {
                if (attrItem.actualValue.indexOf('滚烫') > -1 || attrItem.actualValue.indexOf('浮雕烫') > -1 || attrItem.actualValue.indexOf('烫金') > -1) {
                  this.tjarr.push(this.data2[i].miniZtAttrGroup.id + '-' + this.data2[i].attrList[j].miniZtAttrGroup.parentAttrId + '_' + attrItem.actualValue);
                } else {
                  // let sy = this.data2[i].attrList[j].miniZtAttrGroup.code.indexOf('PTTJYS') > -1 ? '' : ';';
                  groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + attrItem.actualValue + ';');
                }
              }
            }
          }
        }
      }

      // 文本输入框
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          const item = this.data2[i].attrList[j];
          if (item.miniZtAttrGroup.groupType == 'input') {
            let str = '';
            if (item.miniZtAttrGroup.actualValue) {
              str = item.miniZtAttrGroup.code.indexOf('TJCC_CHILD') > -1 ? item.miniZtAttrGroup.actualValue : item.miniZtAttrGroup.actualValue + ':';
            } else {
              str = item.miniZtAttrGroup.name + ':';
            }

            for (let var1 in inputValues) {
              if (inputValues[var1]) {
                const splits = var1.split('_');
                const groupId = splits[0];
                const attrId = splits[1];
                const attrItem = this.getGroupAttr(attrId, groupId);
                if (attrItem && strEquals(attrItem.groupId, item.miniZtAttrGroup.id)) {
                  if (this.boxstr.indexOf(this.data2[i].miniZtAttrGroup.name) > -1 && item.miniZtAttrGroup.name == '尺寸') {
                    // console.log(inputValues[var1]);
                    if (inputValues[var1] >= 400) {
                      pbox[this.data2[i].miniZtAttrGroup.id] = this.data2[i].miniZtAttrGroup.id + '_糊盒:手工;';
                    } else {
                      if (!pbox[this.data2[i].miniZtAttrGroup.id]) {
                        pbox[this.data2[i].miniZtAttrGroup.id] = this.data2[i].miniZtAttrGroup.id + '_糊盒:机器;';
                      }
                    }
                  }
                  str += inputValues[var1] + '_';
                }
              }
            }
            if (item.miniZtAttrGroup.name == '滚烫尺寸' || item.miniZtAttrGroup.name == '浮雕烫尺寸' || item.miniZtAttrGroup.name == '烫金尺寸') {
              this.tjarr.push(this.data2[i].miniZtAttrGroup.id + '-' + this.data2[i].attrList[j].miniZtAttrGroup.parentAttrId + '_' + str.substring(0, str.length - 1) + ';');
            } else if (item.miniZtAttrGroup.name == '海绵尺寸') {
              let hstr = str.substring(0, str.length - 1);
              // console.log(this.data2[i].miniZtAttrGroup.id + '_' + str.substring(0, str.length - 1) + ';海绵卡材质:粉灰纸_250;'+hstr.replace('卡','')+';海绵厚度:3;');
              groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + str.substring(0, str.length - 1) + ';海绵卡材质:粉灰纸_250;海绵卡定型模切:面板;' + hstr.replace('卡', '') + ';海绵厚度:3;');
            } else if (item.miniZtAttrGroup.name == '包边高度') {
              let ml = this.data2[i].attrList.filter(n => {
                return n.miniZtAttrGroup.name == '面料';
              });
              // let gd=[]
              let gstr = str.length > 8 ? str.substring(0, str.length - 1) : '面料1包边:包到底';
              for (let v = 0; v < ml.length; v++) {
                groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + gstr.replace('面料1', '面料' + (v + 1)) + ';');
              }
            } else {
              groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + str.substring(0, str.length - 1) + ';');
            }
            // else if(this.boxstr.indexOf(this.data2[i].miniZtAttrGroup.name)>-1&&item.miniZtAttrGroup.name=='尺寸'){
            //   console.log('str',str);
            //   groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + str.substring(0, str.length - 1) + ';');
            // }
            // if (item.miniZtAttrGroup.code.indexOf('TJ_TK_CHILD') > -1) {
            //   this.tjin(item, groupValueList, inputValues);
            // }
          }
        }
      }

      // 复选框
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          const item = this.data2[i].attrList[j];
          for (let var1 in checkBoxSelectValues) {
            // console.log(checkBoxSelectValues[var1]);
            for (let j = 0; j < checkBoxSelectValues[var1].length; j++) {
              const splits = checkBoxSelectValues[var1][j].split('_');
              const groupId = splits[0];
              const attrId = splits[1];
              const attrItem = this.getGroupAttr(attrId, groupId);
              // console.log(attrId,groupId);
              // console.log(attrItem);
              if (attrItem && strEquals(item.miniZtAttrGroup.id, attrItem.groupId)) {
                if (attrItem.actualValue) {
                  groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + attrItem.actualValue + ';');
                }
              }
            }
          }
        }
      }

      //级联
      // for (let c in this.cascaderdata) {
      //   const splits = c.split('_');
      //   const groupId = splits[0];
      //   const attrId = splits[1];
      //   console.log('c',c)
      //   groupValueList.push(groupId+this.cascaderdata[c][0]+'_'+this.cascaderdata[c][1] + ';');
      // }
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          const item = this.data2[i].attrList[j];
          // if (item.miniZtAttrGroup.actualValue == 'linkage') {
          //   if (this.cascaderdata[item.miniZtAttrGroup.id]) {
          //     groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + item.miniZtAttrGroup.reminder + this.cascaderdata[item.miniZtAttrGroup.id][0] + '_' + this.cascaderdata[item.miniZtAttrGroup.id][1].replace(/g/, '') + ';');
          //   }
          // }
          // if (this.printing[item.miniZtAttrGroup.id]) {
          //   groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + this.printing[item.miniZtAttrGroup.id]);
          // }
          if (this.jybm[item.miniZtAttrGroup.id]) {
            groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + this.jybm[item.miniZtAttrGroup.id]);
          }
          if (this.spotinp[item.miniZtAttrGroup.id] && this.spotinp[item.miniZtAttrGroup.id].length) {
            groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + this.spotinp[item.miniZtAttrGroup.id].toString().replace(/,/g, '@') + ';');
          }
        }
      }
      let parr = Object.values(pbox);
      if (parr.length) {
        groupValueList.push(...parr);
      }
      // let pboxlist=[...new Set(pbox),...new Set(pbox2)]
      // console.log('groupValueList', groupValueList);
      return groupValueList;
    },
    tjin(data) {
      // let groupValueList = JSON.parse(JSON.stringify(data));
      // let arr2 = [];
      // let arr3 = [];
      // let obj = {};
      // let obj2 = {};
      // for (let i = 0; i < groupValueList.length; i++) {
      //   if (groupValueList[i].indexOf('烫金') > -1) {
      //     if (groupValueList[i].indexOf('面料') > -1) {
      //       if (groupValueList[i].indexOf('尺寸') > -1) {
      //         arr2.push(groupValueList[i]);
      //       } else {
      //         arr3.push(groupValueList[i]);
      //       }
      //     }
      //     if (groupValueList[i].indexOf('内衬') > -1) {
      //       let id = groupValueList[i].split('_')[0];
      //       if (!obj2[id]) {
      //         obj2[id] = '';
      //       }
      //       obj2[id] += groupValueList[i].replace(id + '_内衬烫金尺寸:', '');
      //     }
      //   }
      // }
      // for (let j = 0; j < arr3.length; j++) {
      //   if (!arr3[j] || !arr2[j]) {
      //     return;
      //   }
      //   let id = arr3[j].split('_')[0];
      //   let index = arr3[j].indexOf('_');
      //   arr3[j] = arr3[j] + arr2[j].substring(index + 9, arr2[j].length);
      //   if (!obj[id]) {
      //     obj[id] = '';
      //   }
      //   obj[id] += arr3[j];
      // }
      // for (let a = groupValueList.length - 1; a >= 0; a--) {
      //   if (groupValueList[a].indexOf('烫金') > -1) {
      //     groupValueList.splice(a, 1);
      //   }
      // }
      // for (let n in obj) {
      //   // console.log(obj[n]);
      //   if (obj[n]) {
      //     groupValueList.push(obj[n]);
      //   }
      // }
      // for (let a in obj2) {
      //   // console.log('obj2[a]',obj2[a]);
      //   if (obj2[a]) {
      //     groupValueList.push(obj2[a]);
      //   }
      // }
      // console.log('arr2', arr2);
      // console.log('arr3', arr3);
      // console.log('groupValueList',groupValueList);
      // return groupValueList;
    },
    spotclick(id, is) {
      this.spotis[id] = is;
      let str = [this.spotinp[id][0]];
      if (is) {
        for (let i = 0; i < this.spot[id]; i++) {
          this.$set(this.spotinp[id], i + 1, '颜色看样');
        }
      } else {
        this.$set(this.spotinp, [id], str);
      }
      this.getprice();
      // console.log(this.spot);
      // console.log(this.spotinp);
    },
    dbdfn(i, id) {
      let is = false,
        _this = this;
      this.defaultCheckbox[id].find(e => e.name == i);
      // if (i == 0 || i == 2 || (id == 138 && i == 3)) {
      //   is = true;
      // }
      // console.log('defaultCheckboxdefaultCheckboxdefaultCheckbox3421asdas', this.defaultCheckbox[id]);
      // console.log('defaultCheckboxdefaultCheckboxdefaultCheckbox', this.defaultCheckbox[id].find(e => e.name == i) ? true : false);
      return this.defaultCheckbox[id].find(e => e.name == i) ? true : false;
    },
    getGroupAttr(attrId, groupId) {
      const item = this.getGroupById(groupId);
      if (item) {
        for (let inx in item.attrList) {
          if (strEquals(item.attrList[inx].id, attrId)) {
            return item.attrList[inx];
          }
        }
      }
    },
    getGroupById(id) {
      const _voList = this.data;
      for (let i = 0; i < _voList.length; i++) {
        const formGroupItem = _voList[i];
        if (strEquals(formGroupItem.miniZtAttrGroup.id, id)) {
          return formGroupItem;
        }
      }
      return;
    },
    setchilidchange(data, index, cindex) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].miniZtAttrGroup.groupType == 'checkbox') {
          if (!this.checkdata[data[i].miniZtAttrGroup.id]) {
            this.$set(this.checkdata, data[i].miniZtAttrGroup.id, []);
          }
        }
      }
    },
    removelay(data, i, name) {
      if (this.timer2) {
        clearTimeout(this.timer2);
        this.timer2 = null;
      }
      this.timer2 = setTimeout(() => {
        let arr = this.data2.map(e => {
          let list = e.miniZtAttrGroup.name;
          return list;
        });
        let index = arr.lastIndexOf(name);
        let data2 = this.data2[index];
        // console.log('arr', data2);
        for (let i = 0; i < data2.attrList.length; i++) {
          this.removedata2(data2.attrList[i].miniZtAttrGroup.id, data2.attrList[i].miniZtAttrGroup.name);
          // console.log(data2.attrList[i].miniZtAttrGroup.id, data2.attrList[i].miniZtAttrGroup.name);
          for (let j = 0; j < data2.attrList[i].attrList.length; j++) {
            // console.log('1111', data2.attrList[i].attrList[j].name, data2.attrList[i].attrList[j].groupId);
            this.removedata(data2.attrList[i].attrList[j].id, data2.attrList[i].attrList[j].name);
          }
        }
        setTimeout(() => {
          this.data2.splice(index, 1);
          this.getprice();
          // console.log(this.data);
        }, 200);
      }, 500);
    },
    removedata(pid) {
      for (let i = this.data.length - 1; i >= 0; i--) {
        if (this.data[i].miniZtAttrGroup.parentAttrId == pid) {
          for (let j = this.data[i].attrList.length - 1; j >= 0; j--) {
            if (this.data[i].attrList[j]) {
              this.removedata(this.data[i].attrList[j].id);
            }
          }
          this.data.splice(i, 1);

          // break;
        }
      }
    },
    removedata2(id, name) {
      for (let j = 0; j < this.data.length; j++) {
        if (this.data[j].miniZtAttrGroup.id == id && this.data[j].miniZtAttrGroup.name == name) {
          this.data.splice(j, 1);
          // break;
        }
      }
    },
    radiocancel(id, index, i, child, name) {
      if (id && this.radiodata[id]) {
        this.deleteGroupItem(id, index);
        this.radiodata[id] = '';
        if (name == '印刷' || name == '过油覆膜') {
          this.btnlimit(index, i, child, '', name, id);
        }
        this.getprice();
      }
    },
    radiocan(name) {
      let flag = true;
      if (name == '内衬' || name == '芯板' || name == '印刷' || name == '过油覆膜') {
        flag = true;
      } else {
        flag = false;
      }
      return flag;
    },
    delchild(data, index, i) {
      if (this.timer2) {
        clearTimeout(this.timer2);
        this.timer2 = null;
      }
      this.timer2 = setTimeout(() => {
        // console.log('data', i);
        let arr = this.data2[index].attrList.map(e => {
          let list = e.miniZtAttrGroup.name;
          return list;
        });
        let ii = arr.lastIndexOf('面料');
        let data2 = this.data2[index].attrList[ii];
        this.removedata2(data2.miniZtAttrGroup.id, data2.miniZtAttrGroup.name);
        for (let j = 0; j < data2.attrList.length; j++) {
          // console.log('1111', data2.attrList[j].name);
          this.removedata(data2.attrList[j].id, data2.attrList[j].name);
          this.remove2data(data2.attrList[j].id, index);
        }
        this.data2[index].attrList.splice(ii, 1);
        this.getprice();
        // console.log(this.data);
        // console.log(this.data2);
      }, 500);
    },
    remove2data(id, index) {
      for (let i = this.data2[index].attrList.length - 1; i >= 0; i--) {
        if (this.data2[index].attrList[i].miniZtAttrGroup.parentAttrId == id) {
          for (let a = this.data2[index].attrList[i].attrList.length - 1; a >= 0; a--) {
            this.remove2data(this.data2[index].attrList[i].attrList[a].id, index);
          }
          this.data2[index].attrList.splice(i, 1);
        }
      }
    },

    sizechange(gid, name, val, num) {
      // 大货同款款数限制
      if (val == 'same') {
        if (this.$route.path == '/price/HardcoverQuotation') {
          // console.log('num', num);
          if (num < 1) {
            // console.log('输入内容出错');
            this.$message({ type: 'error', message: '输入内容出错' });
            num = this.priceFormData[val] = 1;
          }
          if (this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign) {
            if (num > 4) {
              this.$message({ type: 'error', message: '对不起，超过最大数量了' });
              num = this.priceFormData[val] = 1;
            }
          } else {
            if (num > 1) {
              this.$message({ type: 'error', message: '请先填写必要参数' });
              num = this.priceFormData[val] = 1;
            }
          }
        }
        this.fnumber = num;
      }
      if (name) {
        if (this.dew == name) {
          this.dew = '';
        } else {
          this.dew = name;
        }
      }
      if (val == 'num') {
        let n = 5;
        if (this.routername == 'priceH') {
          n = 100;
        } else {
          n = 1;
          // if (this.priceFormData.num > 50) {
          //   this.priceFormData.num = 50;
          //   this.$message({ type: 'error', message: '最大数量不能超过50' });
          // }
        }
        if (this.priceFormData.num < n) {
          this.priceFormData.num = n;
          this.$message({ type: 'error', message: n + '个起印' });
        }
      }
      // if (val == 'long' || val == 'wide' || val == 'hign') {
      //   if (this.infoobj.goodAlMax < this.priceFormData.long) {
      //     this.priceFormData.long = '';
      //     this.$message({ type: 'error', message: '已经超出' + this.infoobj.goodAlMax });
      //   }
      // }
      // if (val == 'wide') {
      //   if (this.infoobj.goodAwMax < this.priceFormData.wide) {
      //     this.priceFormData.wide = '';
      //     this.$message({ type: 'error', message: '已经超出' + this.infoobj.goodAwMax });
      //   }
      // }
      // if (val == 'hign') {
      //   if (this.infoobj.goodAdMax < this.priceFormData.hign) {
      //     this.priceFormData.hign = '';
      //     this.$message({ type: 'error', message: '已经超出' + this.infoobj.goodAdMax });
      //   }
      // }

      if (gid == 100 && this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign) {
        // console.log(this.dew);
        // console.log(this.dewinp);
        computeSize({
          goodAd: this.priceFormData.hign,
          goodAh: 0,
          goodAl: this.priceFormData.long,
          goodAr: 0,
          goodAt: 0,
          goodAw: this.priceFormData.wide,
          goodAx: 0,
          goodBottom: this.dew == 2 ? this.dewinp : 0,
          goodWaist: this.dew == 1 ? this.dewinp : 0,
          id: this.goodsId,
          // id: 1616,
          zipval: 0
        }).then(res => {
          // console.log(res);
          this.sizeobj = res.data.otherMap;
          this.setsize();
          this.getprice();
        });
      } else {
        this.getprice();
      }
    },
    setsize() {
      if (this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].miniZtAttrGroup.name == '尺寸') {
            // console.log(this.data[i]);
            for (let j = 0; j < this.data[i].attrList.length; j++) {
              this.$set(this.inputdata, this.data[i].attrList[j].groupId + '_' + this.data[i].attrList[j].id, this.sizeobj[this.data[i].miniZtAttrGroup.code]?.[j]);
              this.$set(this.maxobj, this.data[i].attrList[j].groupId + '_' + this.data[i].attrList[j].id, this.sizeobj[this.data[i].miniZtAttrGroup.code]?.[j]);
            }
          }
        }
      }
    },
    spotchange(id, num, val) {
      // if(!this.spotinp[id]||num==0) {
      this.$set(this.spotinp, id, []);
      this.$set(this.spotis, id, false);
      // }
      if (num > 0) {
        this.$set(this.spotinp[id], [0], val + '专色:' + num);
      }
      this.getprice();
    },
    inpchange(name, id, index, i) {
      // console.log(this.priceFormData.hign);
      if (name == '尺寸' && this.maxobj[id] && this.inputdata[id] > this.maxobj[id]) {
        this.$set(this.inputdata, id, this.maxobj[id]);
        this.$message({ type: 'error', message: '已经超出尺寸' });
        // console.log(this.maxobj);
        // console.log(id);
      }
      if (name == '包边高度') {
        let gfid = this.data2[index].attrList[i - 1].attrList[2].groupId;
        let gid = this.data2[index].attrList[i - 1].attrList[2].id;
        // console.log(this.inputdata[gfid+'_'+gid]);
        if (this.inputdata[id] < 20) {
          this.$set(this.inputdata, id, null);
          this.$message({ type: 'error', message: '包边高度不能小于20MM' });
          // console.log(this.inputdata[id]);
        }
        if (this.inputdata[gfid + '_' + gid] && this.inputdata[id] > this.inputdata[gfid + '_' + gid]) {
          this.$set(this.inputdata, id, null);
          this.$message({ type: 'error', message: '包边高度不能大于盒子高度' });
        }
      }
      // if(name=='包边高度'){
      //   let gfid=this.data2[index].attrList[i-1].attrList[2].groupId
      //   let gid=this.data2[index].attrList[i-1].attrList[2].id;
      //   console.log(this.inputdata[gfid+'_'+gid]);

      // }
      this.getprice();
    },
    childchange(e, id, i, ci, gid, name) {
      // console.log(e, id, i, ci, gid,name);
      let isid = '';
      if (e) {
        // console.log(1);
        // console.log(this.data2[i].attrList);
        let data = this.data.filter(v => {
          return v.miniZtAttrGroup.parentAttrId == id;
        });
        this.data2[i].attrList.push(...data);
        this.data2[i].attrList.sort(this.sortlayer);
      } else {
        // console.log('111',id);
        // console.log('cccc', this.data2[i].attrList[ci]);
        for (let a = 0; a < this.data2[i].attrList.length; a++) {
          if (this.data2[i].attrList[a].miniZtAttrGroup.pid == gid) {
            isid = this.data2[i].attrList[a].miniZtAttrGroup.id;
          }
        }
        // console.log('isid', isid);
        for (let a = this.data2[i].attrList.length - 1; a >= 0; a--) {
          // console.log(this.data2[i].attrList[a].miniZtAttrGroup.parentAttrId, id);
          if (this.data2[i].attrList[a].miniZtAttrGroup.parentAttrId == id) {
            // console.log('chilidchang', this.data2[i].attrList[a].miniZtAttrGroup.id);
            if (name == '烫金') {
              if (this.inputdata[this.data2[i].attrList[a].miniZtAttrGroup.id + '_' + this.data2[i].attrList[a].attrList[0].id]) {
                this.$set(this.inputdata, this.data2[i].attrList[a].miniZtAttrGroup.id + '_' + this.data2[i].attrList[a].attrList[0].id, '');
              }
              if (this.inputdata[this.data2[i].attrList[a].miniZtAttrGroup.id + '_' + this.data2[i].attrList[a].attrList[1].id]) {
                this.$set(this.inputdata, this.data2[i].attrList[a].miniZtAttrGroup.id + '_' + this.data2[i].attrList[a].attrList[1].id, '');
              }
              if (this.selectdata[this.data2[i].attrList[a].miniZtAttrGroup.id]) {
                this.$set(this.selectdata, this.data2[i].attrList[a].miniZtAttrGroup.id, '');
              }
            }
            // this.$set(this.inputdata)
            for (let b = this.data2[i].attrList.length - 1; b >= 0; b--) {
              // console.log(this.data2[i].attrList[a].miniZtAttrGroup.name);
              if (this.data2[i].attrList[b].miniZtAttrGroup.pid == this.data2[i].attrList[a].miniZtAttrGroup.id) {
                // console.log(this.data2[i].attrList[b].miniZtAttrGroup.name);
                if (this.data2[i].attrList[b].miniZtAttrGroup.name == '颜色编号') {
                  this.$set(this.inputdata, this.data2[i].attrList[b].miniZtAttrGroup.id + '_' + this.data2[i].attrList[b].attrList[0].id, '');
                }
                this.data2[i].attrList.splice(b, 1);
              }
            }
            this.checkdata[this.data2[i].attrList[a].miniZtAttrGroup.id] = [];
            this.data2[i].attrList.splice(a, 1);
          }
        }
        // for (let a = this.data2[i].attrList.length - 1; a >= 0; a--) {
        //   if (this.data2[i].attrList[a].miniZtAttrGroup.parentAttrId == id) {
        //     delete this.radiodata[this.data2[i].attrList[a].miniZtAttrGroup.id];
        //     this.checkdata[this.data2[i].attrList[a].miniZtAttrGroup.id] = [];
        //     console.log('checkarr', this.checkdata[this.data2[i].attrList[a].miniZtAttrGroup.id]);
        //     this.data2[i].attrList.splice(a, 1);
        //   }
        // }
      }
      this.getprice();
    },
    jybmfn(id, val) {
      if (this.jybm[id]) {
        this.$set(this.jybm, id, '');
      } else {
        this.$set(this.jybm, id, val);
      }
      this.getprice();
    },
    pachange() {
      for (let i = 0; i < this.entiretyList.length; i++) {
        if (this.entiretyGroup.indexOf(this.entiretyList[i].name) > -1) {
          this.entiretyList[i].isShow = true;
        } else {
          this.entiretyList[i].isShow = false;
          this.entiretyList[i].goodsInfo.totalPrice = 0;
        }
      }
      this.getprice();
    },
    btnlimit(index, i, child, attrId, name, groupId) {
      if (name == '印刷' && child != '特种纸') {
        let { id, gid, conindex, fid, fgid } = this.findobj(index, i, '过油覆膜', 1, child, 0);
        if (!this.radiodata[id]) {
          this.$set(this.data2[index].attrList[conindex].attrList[0], 'status', 1);
          return;
        }
        if (this.radiodata[id] == id + '_' + gid) {
          if (this.radiodata[fid] == fid + '_' + fgid) {
            let sid = this.data2[index].attrList[conindex].attrList[1].id;
            let gid = this.data2[index].attrList[conindex].attrList[1].groupId;
            // console.log(this.data2[index].attrList[conindex].attrList[0]);
            this.$set(this.radiodata, gid, gid + '_' + sid);
            this.radiochange({ event: gid + '_' + sid, child, index, i: conindex, name: '过油覆膜' });
          }
          this.$set(this.data2[index].attrList[conindex].attrList[0], 'status', 0);
        } else {
          // console.log(1);
          this.$set(this.data2[index].attrList[conindex].attrList[0], 'status', 1);
        }
      }
      if (name == '过油覆膜') {
        let { id, gid, conindex, fid, fgid } = this.findobj(index, i, '压纹', 0, child, 0);
        let list = this.findobj(index, i, '丝印', 0, child, 0);
        if (!this.radiodata[groupId]) {
          this.$set(this.data2[index].attrList[conindex].attrList[0], 'status', 1);
          this.$set(this.data2[index].attrList[conindex].attrList[1], 'status', 1);
          this.$set(this.data2[index].attrList[list.conindex].attrList[0], 'status', 1);
          return;
        }
        // console.log(list);
        let id1 = this.data2[index].attrList[i].attrList[2].id;
        // let id2 = this.data2[index].attrList[conindex].attrList[2].id;
        if (this.radiodata[groupId] != groupId + '_' + id1) {
          this.$set(this.data2[index].attrList[conindex].attrList[0], 'status', 0);
          this.$set(this.data2[index].attrList[conindex].attrList[1], 'status', 0);
          this.$set(this.data2[index].attrList[list.conindex].attrList[0], 'status', 0);
          // console.log(this.data2[index].attrList[conindex].attrList[0].name);
          // console.log(this.data2[index].attrList[conindex].attrList[1].name);
          // if (this.radiodata[fid] && this.radiodata[fid] != fid + '_' + id2) {
          if (this.radiodata[fid]) {
            this.radiocancel(fid, index, i, this.data2[index].attrList[conindex].miniZtAttrGroup.actualValue, '');
            // this.$set(this.radiodata, fid, fid + '_' + id2);
            // this.radiochange({ event: fid + '_' + id2, child, index, i: conindex, name: '压纹' });
          }
          // console.log('gggg', this.checkdata[list.fid], list.fid + '_' + list.fgid);
          if (this.checkdata[list.fid].length && this.checkdata[list.fid].indexOf(list.fid + '_' + list.fgid) > -1) {
            let sindex = this.checkdata[list.fid].indexOf(list.fid + '_' + list.fgid);
            this.childchange(false, list.fgid, index, i, list.fid);
            // console.log(list);
            this.checkdata[list.fid].splice(sindex, 1);
          }
        } else {
          this.$set(this.data2[index].attrList[conindex].attrList[0], 'status', 1);
          this.$set(this.data2[index].attrList[conindex].attrList[1], 'status', 1);
          this.$set(this.data2[index].attrList[list.conindex].attrList[0], 'status', 1);
        }

        // let id1=this.data2[index].attrList[conindex].
        // // console.log(id, gid, conindex, fid, fgid);
        // if (this.radiodata[id] == id + '_' + gid) {
        //   console.log('过油覆膜2');
        //   if (this.radiodata[fid] == fid + '_' + fgid) {
        //     console.log('过油覆膜3');
        //     this.$set(this.data2[index].attrList[i + 1].attrList[0], 'status', 0);
        //     this.$set(this.data2[index].attrList[i + 1].attrList[1], 'status', 0);
        //   }

        // }
      }
      // if(name=='丝印'){

      // }
    },
    findobj(index, i, name, findi, val, f) {
      // console.log(val, name);
      let id = this.data2[index].attrList[i].miniZtAttrGroup.id;
      let gid = this.data2[index].attrList[i].attrList[findi] ? this.data2[index].attrList[i].attrList[findi].id : this.data2[index].attrList[i].attrList[0].id;
      let conindex = this.data2[index].attrList.findIndex(n => {
        return n.miniZtAttrGroup.actualValue == val && n.miniZtAttrGroup.name == name;
      });
      // console.log(conindex);
      let fid = this.data2[index].attrList[conindex].miniZtAttrGroup.id;
      let fgid = this.data2[index].attrList[conindex].attrList[f].id;
      return { id, gid, conindex, fid, fgid };
    },
    selchange(e) {
      const splits = e.event.split('_');
      const groupId = splits[0];
      const attrId = splits[1];
      const child = e.child;
      const index = e.index;
      const cindex = e.i;
      // const list = this.getGroupSubItem(groupId);
      // for (let i = 0; i < list.length; i++) {
      //   if (list[i].miniZtAttrGroup.groupType == 'radio') {
      //     delete this.radiodata[list[i].miniZtAttrGroup.id];
      //   }
      //   this.checkdata[list[i].miniZtAttrGroup.id] = [];
      // }
      this.deleteGroupItem(groupId, index);
      this.loadDefaultGroup(groupId, attrId, index);
      this.data2[index].attrList.sort(this.sortlayer);
      this.getprice();
    },
    radiochange(e) {
      // console.log('eee', e);

      const splits = e.event.split('_');
      const groupId = splits[0];
      const attrId = splits[1];
      const child = e.child;
      const index = e.index;
      const cindex = e.i;
      // if (child == 'child') {
      const list = this.getGroupSubItem(groupId);
      for (let i = 0; i < list.length; i++) {
        if (list[i].miniZtAttrGroup.groupType == 'radio') {
          delete this.radiodata[list[i].miniZtAttrGroup.id];
        }
        this.checkdata[list[i].miniZtAttrGroup.id] = [];
      }
      // console.log(attrId);
      this.deleteGroupItem(groupId, index);
      this.loadDefaultGroup(groupId, attrId, index);
      this.data2[index].attrList.sort(this.sortlayer);
      // }
      if (e.name == '印刷' || e.name == '过油覆膜') {
        this.btnlimit(e.index, e.i, child, attrId, e.name, groupId);
      }
      // console.log('zss');
      this.getprice();
    },
    loadDefaultGroup(pid, parentAttrId, index) {
      for (let i = 0; i < this.data.length; i++) {
        const groupItem = this.data[i];
        // console.log('parentAttrId', parentAttrId);
        // console.log('groupItem.miniZtAttrGroup.parentAttrId', groupItem.miniZtAttrGroup.parentAttrId);
        if (groupItem.miniZtAttrGroup.pid == pid && parentAttrId == groupItem.miniZtAttrGroup.parentAttrId) {
          if (groupItem.attrList != null && groupItem.attrList.length > 0) {
            // console.log('ppppp', pid, parentAttrId);
            this.data2[index].attrList.push(JSON.parse(JSON.stringify(groupItem)));
            // if (groupItem.miniZtAttrGroup.groupType == 'radio') {
            //   let attr = this.getDefaultAttr(groupItem.attrList, groupItem.miniZtAttrGroup.defaultSelect, true);
            //   this.loadDefaultGroup(attr.groupId, attr.id, index);
            // }
          }
        }
        if (this.data[i].miniZtAttrGroup.pname == '材质' && this.data[i].miniZtAttrGroup.parentAttrId == parentAttrId) {
          this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].attrList[0].groupId + '_' + this.data[i].attrList[0].id);
        }
        if (this.data[i].miniZtAttrGroup.pname == '印刷方式' && this.data[i].miniZtAttrGroup.parentAttrId == parentAttrId) {
          this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].attrList[0].groupId + '_' + this.data[i].attrList[0].id);
        }
        if (this.data[i].miniZtAttrGroup.parentAttrName == '单色' && this.data[i].miniZtAttrGroup.parentAttrId == parentAttrId) {
          this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].attrList[0].groupId + '_' + this.data[i].attrList[0].id);
        }
        if (this.data[i].miniZtAttrGroup.pname == '纸板材质' && this.data[i].miniZtAttrGroup.parentAttrId == parentAttrId) {
          this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].attrList[0].groupId + '_' + this.data[i].attrList[0].id);
        }
        if (this.data[i].miniZtAttrGroup.parentAttrName == '单色' && this.data[i].miniZtAttrGroup.parentAttrId == parentAttrId) {
          this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].attrList[0].groupId + '_' + this.data[i].attrList[0].id);
        }
        if (this.data[i].miniZtAttrGroup.name == '盒内围样式' && this.data[i].miniZtAttrGroup.parentAttrId == parentAttrId) {
          this.$set(this.radiodata, this.data[i].miniZtAttrGroup.id, this.data[i].attrList[0].groupId + '_' + this.data[i].attrList[1].id);
        }
        // if (this.data[i].miniZtAttrGroup.name == '定型' && this.data[i].miniZtAttrGroup.parentAttrId == parentAttrId) {
        //   this.$set(this.checkdata, this.data[i].miniZtAttrGroup.id, [this.data[i].attrList[0].groupId + '_' + this.data[i].attrList[0].id]);
        // }
      }
      this.data2.sort(this.sortlayer);
    },

    deleteGroupItem(pid, index) {
      const list = this.getGroupSubItem(pid);
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < this.data2[index].attrList.length; j++) {
          if (list[i].miniZtAttrGroup.id == this.data2[index].attrList[j].miniZtAttrGroup.id) {
            this.data2[index].attrList.splice(j, 1);
            break;
          }
        }
      }
      this.data2.sort(this.sortlayer);
    },
    getGroupSubItem(pid) {
      const _voList = this.data;
      let list = [];
      let length = _voList.length - 1;
      for (let i = length; i >= 0; i--) {
        const formGroupItem = _voList[i];
        if (formGroupItem.miniZtAttrGroup.pid == pid) {
          list.push(formGroupItem);
          for (let j = length; j >= 0; j--) {
            const formGroupItem1 = _voList[j];
            if (formGroupItem1 != null && formGroupItem1.miniZtAttrGroup != null && formGroupItem1.miniZtAttrGroup.pid === formGroupItem.miniZtAttrGroup.id) {
              const subList = this.getGroupSubItem(formGroupItem.miniZtAttrGroup.id);
              list = list.concat(subList);
              break;
            }
          }
        }
      }
      return list;
    },
    padchange(name) {
      if (name == '正面') {
        return true;
      } else {
        return false;
      }
    },
    getDefaultAttr(attrList, defaultSelect, isDefault) {
      let attr = null;
      if (defaultSelect) {
        for (let j = 0; j < attrList.length; j++) {
          const tempAttr = attrList[j];
          if (tempAttr.id == defaultSelect) {
            attr = tempAttr;
            return attr;
          }
        }
      }
      if (isDefault && attrList.length > 0) {
        attr = attrList[0];
      }
      return attr;
    },
    datastatus() {
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < this.data2[i].attrList.length; j++) {
          if (this.data2[i].attrList[j].miniZtAttrGroup.required) {
            if (this.data2[i].attrList[j].miniZtAttrGroup.groupType == 'radio') {
              // console.log(this.data2[i].attrList[j].miniZtAttrGroup.name);
              if (this.data2[i].attrList[j].miniZtAttrGroup.pname == '印刷方式' && this.spot[this.data2[i].attrList[j].miniZtAttrGroup.id]) {
                this.spotinp[this.data2[i].attrList[j].miniZtAttrGroup.id] = this.spotinp[this.data2[i].attrList[j].miniZtAttrGroup.id].filter(e => e);
                // console.log('eeeeeeeeeee',this.spotinp[this.data2[i].attrList[j].miniZtAttrGroup.id]);
                // console.log(this.spot[this.data2[i].attrList[j].miniZtAttrGroup.id]+1,this.spotinp[this.data2[i].attrList[j].miniZtAttrGroup.id].length);
                if (this.spot[this.data2[i].attrList[j].miniZtAttrGroup.id] + 1 != this.spotinp[this.data2[i].attrList[j].miniZtAttrGroup.id].length) {
                  console.log('专色');
                  return;
                }
              }
              if (!this.radiodata[this.data2[i].attrList[j].miniZtAttrGroup.id] && this.data2[i].attrList[j].miniZtAttrGroup.reminder != 'hide') {
                console.log('radio', this.data2[i].attrList[j].miniZtAttrGroup.name);
                return;
              }
            }

            if (this.data2[i].attrList[j].miniZtAttrGroup.groupType == 'select') {
              if (!this.selectdata[this.data2[i].attrList[j].miniZtAttrGroup.id]) {
                console.log('select', this.selectdata);
                return;
              }
            }

            if (this.data2[i].attrList[j].miniZtAttrGroup.groupType == 'input') {
              for (let inp = 0; inp < this.data2[i].attrList[j].attrList.length; inp++) {
                if (!this.inputdata[this.data2[i].attrList[j].miniZtAttrGroup.id + '_' + this.data2[i].attrList[j].attrList[inp].id]) {
                  console.log('input');
                  return;
                }
              }
            }

            if (this.data2[i].attrList[j].miniZtAttrGroup.groupType == 'checkbox') {
              if (this.checkdata[this.data2[i].attrList[j].miniZtAttrGroup.id].length == 0) {
                console.log('checkbox');
                return;
              }
            }
          }
        }
      }
      return true;
    },
    datastatus2() {
      this.parts = '';
      for (let i = 0; i < this.entiretyList.length; i++) {
        if (this.entiretyList[i].goodsInfo.totalPrice && this.entiretyList[i].isShow) {
          this.parts += this.entiretyList[i].goodsAttr + this.entiretyList[i].goodsInfo.goodsAttr;
        }
      }
      if (this.parts.indexOf('配件品类:吸塑内托') > -1 || this.parts.indexOf('配件品类:双插盒') > -1 || this.parts.indexOf('配件品类:自定义盒型') > -1) {
        if (this.group.indexOf('冲压') == -1) {
          this.group.push('冲压');
        }
      } else {
        if (this.group.indexOf('冲压') > -1) {
          this.group.splice(this.group.indexOf('冲压'), 1);
        }
      }

      return true;
    },
    getCheckboxDefault(groupItem) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].miniZtAttrGroup.groupType == 'checkbox' && this.data[i].miniZtAttrGroup.code.indexOf('parent') == -1) {
          this.$set(this.checkdata, this.data[i].miniZtAttrGroup.id, []);
        }
      }
    },
    paretnlength(snama) {
      let l = this.data2.filter(e => {
        return e.miniZtAttrGroup.name.indexOf(snama) > -1;
      });
      return l;
    },
    sortlayer(a, b) {
      return a.miniZtAttrGroup.sortOrder - b.miniZtAttrGroup.sortOrder;
    },
    parentchange(e, id, name) {
      // console.log(e, id, name);
      if (e) {
        let addlist = this.data3.filter(v => {
          return v.miniZtAttrGroup.reminder == id;
        });
        this.data2.push(...addlist);
        this.data2.sort(this.sortlayer);

        let index = this.data2.findIndex(v => {
          return v.miniZtAttrGroup.name == name;
        });
        if (this.data2[index].attrList.length <= 2 || this.data2[index].attrList[2].miniZtAttrGroup.name != '面料') {
          this.copypart(addlist[0].miniZtAttrGroup.id + 12356, index, addlist[0].miniZtAttrGroup.groupName, addlist[0].miniZtAttrGroup.name);
          this.setchilidchange(this.data);
        }
      } else {
        for (let a = this.data2.length - 1; a >= 0; a--) {
          if (this.data2[a].miniZtAttrGroup.reminder == id || this.data2[a].miniZtAttrGroup.name == name) {
            this.data2.splice(a, 1);
          }
        }
      }
      this.getprice();
    },
    getparent() {
      let _this = this;
      _this.$nextTick(() => {
        let pdata = _this.data.filter(e => {
          return e.miniZtAttrGroup.code.indexOf('parent') > -1;
        });
        let defaultIds = pdata[0].miniZtAttrGroup.defaultSelect.split(',');
        _this.parentdata = defaultIds;
      });
      // console.log('pdata', this.parentdata);
    },
    cartfn() {
      if (this.datastatus() && this.datastatus2() && this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign && this.priceFormData.num && this.priceFormData.total_price > 0) {
        let cc = '成品内尺寸:' + this.boxobj.boxLength + '_' + this.boxobj.boxWide + '_' + this.boxobj.boxHeight + ';展开尺寸:' + this.boxobj.goodAl + '_' + this.boxobj.goodAw + ';';
        let wxnum = this.boxobj.boxNumber;
        let work = this.boxobj.boxNumber >= 50 ? '纸张类型:双坑;纸张材质:BC坑_150g牛卡_130g普芯_50g普芯_130g普芯_150g牛卡_K818K;粘合:胶粘;印刷颜色:无;0;' : '';
        let wxattr = '|#|部件:包装服务;品类:平口箱;' + cc + work + '数量:' + wxnum + ';堆叠方式:' + this.boxobj.StackingWay + ';';
        const param = {
          miniCart: {
            num: this.priceFormData.num,
            ischeck: 1,
            isfrom: 2,
            totalTime: '360',
            goodsId: this.goodsId,
            // goodsId: 1616,
            goodsAttr: this.jzattr + wxattr,
            goodsTotal: this.priceFormData.total_price
            // extendsStr: that.priceFormData.extends
          },
          number: this.fnumber
        };
        updateIsFromCheck({ data: 2 }).then(r => {
          if (r.code == '000000') {
            add(param)
              .then(res => {
                if (res.code == '000000') {
                  let routeData = this.$router.resolve({ path: '/cart/checkorder', query: { isCart: 2 } });
                  window.open(routeData.href, '_blank');
                  // this.$router.push({ path: '/cart/checkorder?isCart=2' });
                }
              })
              .catch(() => {
                console.log(1);
              });
          }
        });
      } else {
        this.$message({
          message: '请完善计价参数',
          type: 'error'
        });
      }
    },
    cartfnProof() {
      if (this.datastatus() && this.datastatus2() && this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign && this.priceFormData.num && this.priceFormData.price > 0 && this.fnumber > 0) {
        const param = {
          data: {
            once: 1,
            num: this.priceFormData.num,
            totalTime: '360',
            fnumber: this.fnumber,
            goodsId: this.goodsId,
            goodsAttr: this.jzattr,
            goodsTotal: this.priceFormData.price,
            type: this.titleobj.paperId
          }
        };
        addCartReq(param)
          .then(() => {
            this.formData.loading = false;
            this.$router.replace({ path: '/cart/checkproof?isCart=0' });
          })
          .catch(() => {
            this.formData.loading = false;
          });
      } else {
        this.$message({
          message: '请完善计价参数',
          type: 'error'
        });
      }
    },
    isshow(num) {
      if (num.split('_')[0] > 1) {
        return true;
      } else {
        return false;
      }
    },
    isshow2(name) {
      if (name == '内盒' || name == '柜筒' || name == '抽屉' || name == '天盖' || name == '地盒') {
        return false;
      } else {
        return true;
      }
    },
    getstr(list) {
      let obj = {};
      let arr = [];
      // let obj2={}
      let arr1 = [];
      let arr2 = [];
      let strid = '';

      for (let i = 0; i < list.length; i++) {
        let index = list[i].indexOf('_');
        if (!obj[list[i].substring(0, index)]) {
          obj[list[i].substring(0, index)] = '';
        }

        obj[list[i].substring(0, index)] += list[i].slice(index + 1);
      }
      if (this.tjarr.length) {
        for (let i = 0; i < this.tjarr.length; i++) {
          if (this.tjarr[i].indexOf('尺寸') > -1) {
            arr2.push(this.tjarr[i].replace('尺寸:', ''));
          } else {
            arr1.push(this.tjarr[i] + '_');
          }
        }
        for (let j = 0; j < arr1.length; j++) {
          let index = arr1[j].indexOf('-');
          let idindex = arr1[j].indexOf('_');
          if (!obj[arr1[j].substring(0, index)]) {
            obj[arr1[j].substring(0, index)] = '';
          }
          obj[arr1[j].substring(0, index)] += arr1[j].slice(idindex + 1) + arr2[j].slice(idindex + 1);
        }
      }

      for (let a in obj) {
        // if (obj[a].indexOf('皮壳')) {
        // strid = '17347';
        // }
        if (this.subCateId == '128' && obj[a].indexOf('圆磁') > -1) {
          obj['17347'] += '裱合工艺:贴片_铁片;';
        }
        if (obj[a].indexOf('配件方磁规格') > -1) {
          let objid = '';
          if (this.subCateId == '128') {
            objid = '17347';
          } else if (this.subCateId == '138') {
            objid = '17784';
          } else if (this.subCateId == '129') {
            objid = '15944';
          }
          obj[objid] += '裱合工艺:贴片_方磁;';
        }
        // if ((obj[a].indexOf('部件:皮壳') > -1 && obj[a].indexOf('V槽角度') > -1) || (obj[a].indexOf('部件:面顶贴') > -1 && obj[a].indexOf('V槽角度') > -1)) {
        //   obj[a] = obj[a].replace(/V槽角度:90/g, 'V槽角度:120');
        // }
        if (obj[a].indexOf('面料2') > -1 || obj[a].indexOf('芯板') > -1 || obj[a].indexOf('内衬材质') > -1) {
          obj[a] += '裱合工艺:裱纸;';
        }
        // if(obj[a].indexOf('活页规格')>-1||obj[a].indexOf('护角规格')>-1||obj[a].indexOf('把手规格')>-1){
        //   if(this.group.indexOf('铆接')==-1){
        //     this.group.push('铆接')
        //     console.log(this.group);
        //   }
        // }else{
        //   console.log('else',this.group.indexOf('铆接')>-1);
        //   if(this.group.indexOf('铆接')>-1){
        //     this.group.splice(this.group.indexOf('铆接'), 1)
        //   }
        // }

        // setTimeout(() => {
        // arr.push(obj[a].replace(new RegExp(a + '_', 'gm'), ''));
        // }, 0);
      }
      // console.log(obj);
      return Object.values(obj);
    },
    getprice() {
      // console.log('datastatus', this.datastatus());
      // this.datastatus2()
      // console.log('this.datastatus2()', this.datastatus2());
      // console.log('jybm', this.jybm);
      let bool = false;
      if (bool) return;
      console.log('计价datastatus', this.datastatus());
      console.log('计价datastatus2', this.datastatus2());
      console.log('计价long', this.priceFormData.long);
      console.log('计价wide', this.priceFormData.wide);
      console.log('计价hign', this.priceFormData.hign);
      console.log('计价num', this.priceFormData.num);
      console.log('计价fnumber', this.fnumber > 0);
      if (this.datastatus() && this.datastatus2() && this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign && this.priceFormData.num && this.fnumber > 0) {
        let data = this.getstr(this.commonDataChange())
          .toString()
          .replace(/,/g, '|#|');

        if (data.indexOf('专色') > -1) {
          data = data.replace(/@/g, ',');
        }
        if (data.indexOf('活页规格') > -1 || data.indexOf('护角规格') > -1 || data.indexOf('把手规格') > -1) {
          if (this.group.indexOf('铆接') == -1) {
            this.group.push('铆接');
          }
        } else {
          // console.log('else',this.group.indexOf('铆接')>-1);
          if (this.group.indexOf('铆接') > -1) {
            this.group.splice(this.group.indexOf('铆接'), 1);
          }
        }
        let city = '';
        let dew = this.dew == 1 ? '露腰高度:' : '露底高度:';
        let dewinp = dew + this.dewinp + ';';
        let lstr = this.group.length ? '组装工艺:' + this.group.toString() + ';' : '';
        let kstr = this.hole && this.group.indexOf('冲孔') > -1 ? '冲孔数量:' + this.hole + ';' : '';
        // console.log('dewinp', dewinp);
        // if(this.dew&&this.dewinp){
        //   dew=this.dew==1?'露腰高度:'+this.dewinp+';'
        // }
        // let zkcc = '展开尺寸:' + this.priceFormData.long + '_' + this.priceFormData.wide + '_' + this.priceFormData.hign + ';' + (this.priceFormData.pro == '1' ? '打样:需要;' : '') + (this.dewinp ? dewinp : '');
        // console.log('this.group', this.group);
        let zkcc = '成品外尺寸:' + this.priceFormData.long + '_' + this.priceFormData.wide + '_' + this.priceFormData.hign + ';打样:需要;' + lstr + kstr + (this.dew && this.dewinp ? dewinp : '');
        this.jzattr = zkcc + '|#|' + data + this.parts;
        console.log(this.jzattr);
        if (this.priceFormData.provinceId !== '') {
          city += getAreaName('province', this.priceFormData.provinceId);
        }
        if (this.priceFormData.cityId !== '') {
          if (city !== '') {
            city += ' ';
          }
          city += getAreaName('city', this.priceFormData.cityId);
        }
        this.$emit('setGoodsAttr', this.jzattr);
        // if (this.routername == 'priceH') {
        //   priceInvoke({
        //     city: '',
        //     fnumber: this.fnumber,
        //     goodsAttr: this.jzattr,
        //     // goodsAttrs: data,
        //     goodsId: this.goodsId,
        //     // goodsId: 1616,
        //     number: this.priceFormData.num
        //   })
        //     .then(res => {
        //       if (res.code == '970006') {
        //         this.loginstatus = true;
        //         return;
        //       }
        //       if (res.code == '999999') {
        //         console.log('9999999999999999999999999999');
        //       }
        //       if (res.code != '000000') {
        //         this.priceFormData.total_price = 0;
        //         return;
        //       }
        //       // if (res.code == '000000') {
        //       // let cc = '成品内尺寸:' + res.data.priceInfo.boxLength + '_' + res.data.priceInfo.boxWide + '_' + res.data.priceInfo.boxHeight + ';展开尺寸:' + res.data.priceInfo.goodAl + '_' + res.data.priceInfo.goodAw + ';';
        //       // this.wxattr = '品类:外箱;' + cc + '纸张类型:三坑;纸张材质:BCB坑_160g牛卡_90g普芯_50g普芯_90g普芯_50g普芯_90g普芯_120g牛卡_K31313A;粘合:胶粘;印刷颜色:无;0;';
        //       // this.wxnum = res.data.priceInfo.boxNumber < 50 ? 50 : res.data.priceInfo.boxNumber;

        //       if (this.priceFormData.cityId) {
        //         getShippingFee({
        //           fnumber: 1,
        //           weight: res.data.weight,
        //           city: city,
        //           goodsAttr: '品类:外箱'
        //         }).then(shi => {
        //           if (shi.code == '000000') {
        //             this.priceFormData.total_price = res.data.total_price;
        //             this.priceFormData.weight = res.data.weight;
        //             this.priceFormData.shipping_fee = shi.data;
        //             // this.priceFormData.out_time = res.data.out_time
        //             this.priceFormData.price_old = res.data.price_old;
        //           } else {
        //             this.priceFormData.total_price = 0;
        //             this.priceFormData.price_old = 0;
        //             this.priceFormData.out_time = '';
        //           }
        //         });
        //       } else {
        //         this.priceFormData.total_price = res.data.total_price;
        //         this.priceFormData.time_normal = res.data.time_normal;
        //         this.priceFormData.days_normal = res.data.days_normal;
        //         this.priceFormData.weight = res.data.weight;
        //         // this.priceFormData.out_time = res.data.out_time
        //         this.priceFormData.price_old = res.data.price_old;
        //         // this.priceFormData.shipping_fee = prc.data.shipping_fee;
        //       }
        //       this.boxobj = res.data.priceInfo;
        //       // this.priceFormData = Object.assign({}, this.priceFormData, res.data);
        //       // } else {
        //       //   console.log('zhixing');
        //       //   this.priceFormData.total_price=0
        //       //   this.$message({
        //       //     message: res.message,
        //       //     type: 'error'
        //       //   });
        //       // }
        //     })
        //     .catch(err => {
        //       this.priceFormData.total_price = 0;
        //       this.priceFormData.price_old = 0;
        //       // this.priceFormData.out_time = ''
        //       // console.log('errerrerrerr111', err);
        //     });
        // } else {
        //   let typenum = 302;
        //   if (this.subCateId == 128) {
        //     typenum = 302;
        //   } else if (this.subCateId == 137) {
        //     typenum = 303;
        //   } else if (this.subCateId == 138) {
        //     typenum = 304;
        //   } else if (this.subCateId == 129) {
        //     typenum = 305;
        //   }
        //   proofGetPrice({ goodsId: this.goodsId, goodsAttr: this.jzattr, number: this.priceFormData.num, fnumber: this.fnumber, type: this.titleobj.sortOrder })
        //     .then(res => {
        //       if (res.code === '970006') {
        //         this.formData.showLoginDialog = true;
        //       } else {
        //         this.priceFormData = Object.assign({}, this.priceFormData, res.data);
        //         // this.formData.goodAttr = strVal;
        //       }
        //       this.priceFormData.priceProgress = false;
        //     })
        //     .catch(res => {
        //       this.priceFormData.priceProgress = false;
        //     });
        // }

        // console.log('data1', data);
      } else {
        this.priceFormData.total_price = 0;
        this.priceFormData.price = 0;
        this.priceFormData.price_old = 0;
        // this.$emit('setGoodsAttr', '');
      }
    },
    sub() {
      console.log(this.data);
      console.log(this.data2);
      console.log('单选', this.radiodata);
      // console.log('下拉', this.selectdata);
      // console.log('多选', this.checkdata);
      // console.log('inp', this.inputdata);
      // this.commonDataChange();
    },
    // 关闭压纹详情图片
    handleClose(done) {
      done();
    }
  }
  // computed: {
  //   parentlength() {
  //     return function (nama) {
  //       let l = this.data2.filter(e => {
  //         return e.miniZtAttrGroup.name == nama;
  //       });
  //       return l.length;
  //     };
  //   }
  // }
};
</script>
<!--<style src="@/static/mulindex/css/attr.css"></style>-->
<style scoped>
.laybox {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
}
.childbox {
  display: flex;
  padding: 5px 0;
  flex-wrap: wrap;
}
.EattrLab {
  background: #fff;
  width: 100px;
  text-align: right;
  margin-right: 8px;
  /* margin-left: 15px; */
}
.EattrLab span {
  font-size: 13px;
}
.cEattrLab {
  background: #fff;
  width: 100px;
  text-align: right;
  margin-right: 8px;
}
.titlename {
  text-align: left;
  max-width: 80px;
  height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.eattrtitle {
  background: #fff;
  font-size: 16px;
  font-weight: 700;
}
.flexwrap {
  flex-wrap: wrap;
}
.cbox {
  background: #fff;
  margin-left: 110px;
  border-radius: 10px;
}
.bgcolor {
  background: #fafafa;
  width: 86px;
  height: auto;
  overflow: hidden;
  line-height: 32px;
  flex: none;
}
.bgcolor2 {
  background: #fff;
}
.laycon.childactive3,
.laycon.childactive {
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

.childactive2 {
  margin-left: 110px;
  margin-right: 10px;
}
.childactive {
  margin-left: 110px;
  margin-right: 10px;
  background: #fff;
}
.childactive3 {
  margin-left: 110px;
  margin-right: 10px;
  padding: 5px 0 5px 10px;
  background: #fafafa;
  margin-top: -10px;

  /* flex-wrap: wrap; */
}
.laycon {
  display: flex;
  width: 100%;
  padding: 5px 0;
}
.laychild {
  display: flex;
  width: 100%;
}
.fixedclass {
  position: fixed;
  top: 100px;
}
.jybmclass {
  border: 1px solid #dcdfe6;
  background: #fff;
  height: 31px;
  line-height: 29px;
  padding: 0 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
}
.titlebtn {
  float: right;
  margin-right: 5px;
}
.yszs {
  margin: 0 10px;
}
.EattrMain .Eattrrow {
  margin-bottom: 0;
}
.EattrMain > .el-form-item {
  border: 1px dotted #eee;
}
.redclass {
  position: relative;
  border: 1px solid red;
}
.hide {
  display: none !important;
}
.cardtabT {
  background-color: #fff;
  margin-bottom: 5px;
}
.spacing {
  margin-top: -12px;
}
.hsize:first-child {
  padding: 20px 0 0 30px;
}
.borderred {
  border: 1px solid red;
  position: relative;
}
/*
.borderred::after{
    content: '';
    width: 12px;
    height: 12px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAYElEQVQokWP86iPBQCzg2iL3n4kUxSCaKA0wxURpQFZMUAO6YrwasCnGqQGr4v8nsWsAK4ZKoivG0IBiMkwRjGY0R9WAohgqia4YrgGrm2GKkBSDuf8ZzLCGBlbAwMAAABdyI9WXoiwfAAAAAElFTkSuQmCC) no-repeat right bottom;
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 0;
} */
.hsize {
  padding: 10px 0 0 30px;
}
.hsize:last-child {
  padding: 10px 0 14px 30px;
}
.spotinpbox {
  width: 120px;
}
</style>
<style>
.ztpj .el-form-item__content {
  line-height: 0;
}
</style>

<style lang="scss">
.packages-cart-box {
  .attr-from {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
    .el-form-item {
      .Eattrrow {
        float: left;
        // margin-bottom: 8px;
      }
      .Eattrrow .el-checkbox-button,
      .Eattrrow .el-radio-button {
        margin-right: 12px;
        position: relative;
      }
      .Eattrrow .el-checkbox-button.is-checked:first-child .el-checkbox-button__inner,
      .Eattrrow .el-radio-button__orig-radio:checked + .el-radio-button__inner,
      .major-check.is-checked .el-checkbox-button__inner {
        border-color: #ca151d;
        color: #ca151d;
      }
      .Eattrrow .el-checkbox-button__inner:hover {
        color: #ca151d;
      }
      .el-radio-button__inner,
      .el-checkbox-button__inner {
        border-radius: 0px;
        background-color: #fff;
        font-size: 14px;
      }
      .inputBx .el-input-group {
        background-color: #f5f7fa;
        width: 150px !important;
      }
      .inputBx .el-input__inner {
        border-radius: 0;
      }
      .inputBx .el-input-group__append,
      .inputBx .el-input-group__prepend {
        border-radius: 0;
      }
      .inputBxrow:not(:first-child) .el-input-group--append .el-input__inner {
        border-left: 0;
      }
      .PantoneDvtx {
        width: 120px;
        margin-right: 8px;
      }
      .PantoneDv > label {
        display: block;
      }
      .el-input__inner {
        border-radius: 0;
      }
    }

    .PantoneDv {
      color: #666;
      li {
        padding-bottom: 12px;
        label {
          margin-right: 5px;
        }
        .PantoneDvtx {
          margin-right: 0;
        }
      }
      li:last-child {
        padding-bottom: 0;
      }
    }
  }
}
/*提示*/
.el-tooltip__popper.is-light {
  border: 1px solid #dcdfe6 !important;
}
.el-tooltip__popper.is-light[x-placement^='bottom'] .popper__arrow {
  border-bottom-color: #dcdfe6 !important;
}
.el-tooltip__popper.is-light[x-placement^='top'] .popper__arrow {
  border-top-color: #dcdfe6 !important;
}
.EattrMtips {
  width: 300px;
}
.EattrMtips p:first-child {
  font-size: 14px;
  color: #333;
  padding: 4px 0 8px;
}
.EattrMtips p {
  font-size: 12px;
  color: #999;
  line-height: 22px;
}
.EattrMtips img {
  padding: 12px 0;
}
.EattrMtips a {
  color: #e60021;
}
</style>

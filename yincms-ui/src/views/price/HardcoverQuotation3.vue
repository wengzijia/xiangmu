<template>
  <div class="hardcover">
    <el-row>
      <el-col>
        <div class="comBox guigeBox cardBox needhide">
          <div class="guigeLt">
            <div class="cardtabT flex">
              <h1 class="flex guigeH1" style="width: 100%">
                <span class="geH1Lt">精装盒-{{ titleobj.name }} </span><span class="lookBnt"><a :href="'/goods/goodsDesc?gid=' + goodsId" class="" target="_blank">查看产品详情</a></span>
              </h1>
            </div>
            <div class="EattrMbox" style="padding-bottom: 0">
              <!-- <div class="guigeImg tgimg">
                <img src="" alt="" />
              </div> -->
              <div>
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
                      <el-input v-model="priceFormData[vv.val]" :placeholder="vv.name" size="small" v-if="$route.path == '/price/HardcoverQuotation'" @change="sizechange(vv.groupId, '', vv.val, priceFormData[vv.val])">
                        <template slot="append"> {{ vv.suffix }} </template>
                      </el-input>
                      <!-- 精装盒设计打样 -->
                      <el-input v-model="priceFormData[vv.val]" :placeholder="vv.name" size="small" :disabled="vv.val == 'num'" v-if="$route.path == '/proof/HardcoverQuotation'" @change="sizechange(vv.groupId, '', vv.val, priceFormData[vv.val])">
                        <template slot="append"> {{ vv.suffix }} </template>
                      </el-input>
                    </div>
                  </el-row>
                </div>
              </div>

              <el-form class="EattrMain" ref="formData" :model="formData" @submit.native.prevent size="small">
                <template v-for="(item, index) in data2">
                  <el-form-item
                    :key="index"
                    :style="item.miniZtAttrGroup.name == '皮壳' || item.miniZtAttrGroup.name == '柜桶' ? 'margin-bottom:0px;border:0px;padding-bottom:8px;background-color:#fafafa;' : 'margin-top: 10px;padding-bottom:8px;background-color:#fafafa;'"
                  >
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
                      <el-button type="danger" round v-if="item.miniZtAttrGroup.code.indexOf('add') > -1 && isshow(item.miniZtAttrGroup.groupName)" @click="addlay(item.miniZtAttrGroup.name)" class="titlebtn"
                        >添加{{ item.miniZtAttrGroup.name }}{{ item.miniZtAttrGroup.name == '抽屉' || item.miniZtAttrGroup.name == '柜桶' ? '数量' : '层' }}</el-button
                      >
                      <el-button type="info" round v-if="item.miniZtAttrGroup.code.indexOf('remove') > -1" @click="removelay(item, index, item.miniZtAttrGroup.name)" class="titlebtn"
                        >取消{{ item.miniZtAttrGroup.name }}{{ item.miniZtAttrGroup.name == '抽屉' || item.miniZtAttrGroup.name == '柜桶' ? '' : '层' }}</el-button
                      >
                    </div>
                    <!-- </template>  v-show="citem.miniZtAttrGroup.actualValue != 'title'-->
                    <div v-for="(citem, i) in item.attrList" :key="i" class="laybox" v-show="citem.miniZtAttrGroup.actualValue != 'title'">
                      <!-- <div v-if="citem.miniZtAttrGroup.code.indexOf('btn') > -1" style="text-indent: 3em;font-size: 15px;color: rgb(51, 51, 51);font-weight: 700;">
                        <span v-if="!citem.miniZtAttrGroup.groupName || citem.miniZtAttrGroup.groupName == '1_1' || citem.miniZtAttrGroup.groupName == '2_1' || citem.miniZtAttrGroup.groupName == '3_1' || citem.miniZtAttrGroup.groupName == '4_1'"></span>
                        <span v-else>面料</span> 
                      </div> -->
                      <div :class="citem.miniZtAttrGroup.showName ? 'laycon' : 'laycon childactive'" v-if="citem.miniZtAttrGroup.reminder != 'hide'">
                        <div :class="!citem.miniZtAttrGroup.showName && citem.miniZtAttrGroup.code.indexOf('CHILD') != -1 ? 'laychild childactive3' : 'laychild'">
                          <div
                            v-show="citem.miniZtAttrGroup.name != ' '"
                            :class="citem.miniZtAttrGroup.showName ? 'EattrLab' : !citem.miniZtAttrGroup.showName && citem.miniZtAttrGroup.code.indexOf('CHILD') != -1 ? 'EattrLab  bgcolor' : 'EattrLab  bgcolor2'"
                          >
                            <!-- {{ citem.miniZtAttrGroup.id }} -->
                            <span class="red" v-if="citem.miniZtAttrGroup.required === 1">*</span>
                            <span class="titlename">{{ citem.miniZtAttrGroup.name }}</span>
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
                          <el-row class="flex inputBx Layerinpts" v-if="strEquals(citem.miniZtAttrGroup.groupType, 'input')">
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
                              <!-- {{citem.miniZtAttrGroup.code}} -->
                            </div>
                            <el-button
                              type="danger"
                              round
                              style="height:30px;margin-left:15px;"
                              v-if="(citem.miniZtAttrGroup.name == '烫金尺寸' || citem.miniZtAttrGroup.name == '滚烫尺寸' || citem.miniZtAttrGroup.name == '浮雕烫尺寸') && citem.miniZtAttrGroup.code.indexOf('DEL') == -1"
                              @click="addgilding(citem, index, i)"
                              >增加{{ citem.miniZtAttrGroup.parentAttrName == '普通烫金' ? '烫金' : citem.miniZtAttrGroup.parentAttrName }}</el-button
                            >
                            <el-button
                              type="info"
                              round
                              style="height:30px;margin-left:15px;"
                              v-if="(citem.miniZtAttrGroup.name == '烫金尺寸' || citem.miniZtAttrGroup.name == '滚烫尺寸' || citem.miniZtAttrGroup.name == '浮雕烫尺寸') && citem.miniZtAttrGroup.code.indexOf('DEL') > -1"
                              @click="delgilding(citem, index, i)"
                              >删除{{ citem.miniZtAttrGroup.parentAttrName == '普通烫金' ? '烫金' : citem.miniZtAttrGroup.parentAttrName }}</el-button
                            >
                            <el-button
                              type="danger"
                              round
                              style="height:30px;margin-left:15px;"
                              v-if="(citem.miniZtAttrGroup.name == '击凸' || citem.miniZtAttrGroup.name == '击凹' || citem.miniZtAttrGroup.name == '深压纹') && citem.miniZtAttrGroup.code.indexOf('DEL') == -1"
                              @click="minaddgilding(citem, index, i)"
                              >增加{{ citem.miniZtAttrGroup.parentAttrName == '普通烫金' ? '烫金' : citem.miniZtAttrGroup.parentAttrName }}</el-button
                            >
                            <el-button
                              type="info"
                              style="height:30px;margin-left:15px;"
                              round
                              v-if="(citem.miniZtAttrGroup.name == '击凸' || citem.miniZtAttrGroup.name == '击凹' || citem.miniZtAttrGroup.name == '深压纹') && citem.miniZtAttrGroup.code.indexOf('DEL') > -1"
                              @click="mindelgilding(citem, index, i)"
                              >删除{{ citem.miniZtAttrGroup.parentAttrName == '普通烫金' ? '烫金' : citem.miniZtAttrGroup.parentAttrName }}</el-button
                            >
                          </el-row>

                          <!-- 单选框 -->
                          <div class="flex" v-else-if="strEquals(citem.miniZtAttrGroup.groupType, 'radio')">
                            <el-radio-group
                              class="EattrMgroup"
                              size="small"
                              v-model="radiodata[citem.miniZtAttrGroup.id]"
                              button-style="solid"
                              @change="radiochange({ event: $event, child: citem.miniZtAttrGroup.actualValue, index: index, i: i, name: citem.miniZtAttrGroup.name })"
                            >
                              <el-row class="Eattrrow" v-for="attr in citem.attrList" :key="'attr_' + attr.id">
                                <template v-if="attr.remark && attr.remark != '<p><br></p>'">
                                  <el-tooltip width="200" class="item" effect="light" placement="top-start" :enterable="false">
                                    <template slot="content">
                                      <div class="EattrMtips" v-html="attr.remark"></div>
                                    </template>
                                    <el-radio-button size="small" :label="attr.groupId + '_' + attr.id" :disabled="attr.status == 0 ? true : false">{{ attr.name }} </el-radio-button>
                                  </el-tooltip>
                                </template>
                                <el-radio-button v-else size="small" :label="attr.groupId + '_' + attr.id" :disabled="attr.status == 0 ? true : false">
                                  {{ attr.name }}
                                  <!-- {{ attr.groupId }},{{ attr.id }} -->
                                </el-radio-button>
                              </el-row>
                            </el-radio-group>
                            <span class="colorNumbr" style="padding: 0" v-if="citem.miniZtAttrGroup.parentAttrName == 'UV印刷'">
                              <!-- <el-checkbox-button @change="getprice" class="major-check" v-model="jybm[citem.miniZtAttrGroup.id]" label="加印白墨">加印白墨</el-checkbox-button> -->
                              <!-- <el-radio-group class="EattrMgroup" size="small" v-model="jybm[citem.miniZtAttrGroup.id]" button-style="solid" v-if="$route.query.subCateId == 128 || $route.query.subCateId == 138">
                                <el-row class="Eattrrow">
                                  <el-radio-button size="small" @click.native.prevent="jybmfn(citem.miniZtAttrGroup.id, citem.miniZtAttrGroup.actualValue + '加印白墨')" label="1"> 加印白墨 </el-radio-button>
                                </el-row>
                              </el-radio-group> -->
                              <span class="colorNumbr" @click="jybmfn(citem.miniZtAttrGroup.id, citem.miniZtAttrGroup.actualValue + '加印白墨;')">
                                <div :class="jybm[citem.miniZtAttrGroup.id] ? 'jybmclass redclass' : 'jybmclass'">加印白墨</div>
                              </span>
                            </span>
                            <span style="line-height: 35px" v-if="radiocan(citem.miniZtAttrGroup.name)">
                              <!-- <el-button type="danger" @click="radiocancel(citem.miniZtAttrGroup.id, index)">取消</el-button> -->
                              <!-- <el-button style="color:red" icon="el-icon-close" size="mini" circle @click="radiocancel(citem.miniZtAttrGroup.id, index)"></el-button> -->
                              <i class="el-icon-circle-close" style="font-size: 18px; color: red" circle @click="radiocancel(citem.miniZtAttrGroup.id, index, i, citem.miniZtAttrGroup.actualValue, citem.miniZtAttrGroup.name)"></i>
                            </span>
                            <span v-if="citem.miniZtAttrGroup.code.indexOf('btn') > -1">
                              <!-- <span
                                v-if="citem.miniZtAttrGroup.groupName.split('_')[1]==1"
                              ></span> -->
                              <el-button
                                v-if="citem.miniZtAttrGroup.groupName && citem.miniZtAttrGroup.groupName.split('_')[1] > 1"
                                size="mini"
                                style="color: red; background: rgba(255, 255, 255, 0); border: 1px solid red"
                                round
                                @click="addchild(citem.miniZtAttrGroup.id + 12356, index, citem)"
                                >添加面料层</el-button
                              >
                            </span>
                            <span v-else-if="citem.miniZtAttrGroup.code.indexOf('del') > -1">
                              <el-button type="info" size="mini" round @click="delchild(citem, index, i)">取消面料层</el-button>
                            </span>
                          </div>

                          <!-- 复选框 -->
                          <div class="flex" v-else-if="strEquals(citem.miniZtAttrGroup.groupType, 'checkbox')">
                            <template v-if="citem.miniZtAttrGroup.code.indexOf('parent') > -1">
                              <el-row class="Eattrrow" v-for="(attr, i) in citem.attrList" :key="i">
                                <el-checkbox-button :label="attr.id.toString()" v-model="parentdata" :disabled="dbdfn(attr.name, $route.query.subCateId)" @change="parentchange($event, attr.id, attr.name)"> {{ attr.name }} </el-checkbox-button>
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
                                  <el-checkbox-button :label="cattr.groupId + '_' + cattr.id" v-model="checkdata[citem.miniZtAttrGroup.id]" @change="childchange($event, cattr.id, index, i, cattr.groupId, citem.miniZtAttrGroup.name)">{{
                                    cattr.name
                                  }}</el-checkbox-button>
                                </el-tooltip>
                              </template>
                              <el-checkbox-button
                                v-else
                                :label="cattr.groupId + '_' + cattr.id"
                                v-model="checkdata[citem.miniZtAttrGroup.id]"
                                @change="childchange($event, cattr.id, index, i, cattr.groupId, citem.miniZtAttrGroup.name)"
                                :disabled="cattr.status == 0 ? true : false"
                              >
                                {{ cattr.name }}
                                <!-- {{ cattr.groupId }},{{ cattr.id }} -->
                              </el-checkbox-button>
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
                              <el-option v-for="(attr, aindex) in citem.attrList" :key="aindex" :label="attr.name" :value="attr.groupId + '_' + attr.id"> </el-option>
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
                            <el-select size="small" v-model="spot[citem.miniZtAttrGroup.id]" placeholder="请选择" style="width: 120px" @change="spotchange(citem.miniZtAttrGroup.id, spot[citem.miniZtAttrGroup.id], citem.miniZtAttrGroup.actualValue)">
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
                                <div class="EattrMtips" style="width: 400px"><img width="400px" src="../../static/index/img/Patone.jpg" alt="" /></div>
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
                          <div><span class="red">*温馨提示：</span>包边高度应不小于15mm并且小于盒子高度，不录入默认包到底</div>
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
                          <div>
                            <span class="red"> *温馨提示：</span>若须以您提供的颜色纹理为准，请先邮寄您的样品给傲彩，由傲彩产生物料编号供您下订单时录入。
                            <p style="line-height:10px;height:23px;">如您材质太特殊需加工定做，需您按加工定做费用补齐差价；</p>
                          </div>
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
                    </div>

                    <template v-if="index == 0">
                      <div class="laybox" v-if="$route.query.subCateId != 129">
                        <div class="laycon">
                          <div class="laychild">
                            <div class="EattrLab" style="font-size: 13px">结构</div>
                            <div class="flex">
                              <el-radio-group class="EattrMgroup" size="small" v-model="dew" button-style="solid" v-if="$route.query.subCateId == 128 || $route.query.subCateId == 138">
                                <el-row class="Eattrrow">
                                  <el-radio-button size="small" @click.native.prevent="sizechange(100, 1)" label="1"> 露腰 </el-radio-button>
                                </el-row>
                              </el-radio-group>
                              <el-radio-group class="EattrMgroup" size="small" v-model="dew" button-style="solid" @change="sizechange(100)" v-if="$route.query.subCateId == 128 || $route.query.subCateId == 137">
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

            <div v-show="data2.length">
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
                      <el-radio-group class="EattrMgroup" size="small" v-model="group" button-style="solid" @change="getprice" v-if="$route.query.subCateId != 128 && $route.query.subCateId != 138">
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
                          <el-checkbox-button size="small" label="粘接" :disabled="$route.query.subCateId == '128' || $route.query.subCateId == '138' ? true : false"> 粘接 </el-checkbox-button>
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
            <div v-show="data2.length">
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
                      <el-radio-group class="EattrMgroup" size="small" v-model="pack" button-style="solid" @change="getprice">
                        <el-row class="Eattrrow">
                          <el-radio-button size="small" label="平口箱外箱"> 平口箱外箱 </el-radio-button>
                        </el-row>
                      </el-radio-group>
                      <el-radio-group class="EattrMgroup" size="small" v-model="pack" button-style="solid" @change="getprice">
                        <el-row class="Eattrrow">
                          <el-radio-button size="small" label="定制外包装箱"> 定制外包装箱 </el-radio-button>
                        </el-row>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <HardRight class="fixedstatus" ref="HardRight" :getprice="getprice" :priceFormData.sync="priceFormData" @cartfn="cartfn" :title="this.titleobj" v-if="routername == 'priceH'"></HardRight>
          <ProofRight class="fixedstatus" ref="HardRight" :getprice="getprice" :priceFormData.sync="priceFormData" @cartfnProof="cartfnProof" :title="this.titleobj" v-else></ProofRight>
        </div>
      </el-col>
    </el-row>
    <!-- <el-button @click="sub">提交</el-button> -->
    <login-form :dialogVisible.sync="loginstatus"></login-form>
    <proof-designer v-if="routername !== 'priceH'"></proof-designer>
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
import HardRight from '@/components/price/HardRight';
import ProofRight from '@/components/price/ProofRight';
import { getAreaName } from '@/utils/city';
import { priceInvoke, getShippingFee, computeSize } from '@/api/price/priceApi';
import { add, updateIsFromCheck } from '@/api/cart/cartApi';
import { addCartReq } from '@/api/cart/cartProofApi';
import LoginForm from '@/components/common/LoginForm';
import { checkToken } from '@/api/users/userApi';
import { proofGetPrice } from '@/api/price/proofApi';
import { getSubNav } from '@/utils/cateNavsUtil';
import entirety from './mixins/entirety';
import ProofDesigner from '@/views/proof/ProofDesigner';
import { defaultCheckbox, entiretyList } from '@/utils/json/HardcoverQuotation';
export default {
  mixins: [entirety],
  components: { HardRight, LoginForm, ProofRight, ProofDesigner },
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
      subCateId: this.$route.query.subCateId,
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
        weight: 0,
        realWeight: 0
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
      defaultCheckbox,
      originalDataList: [] //初始的属性数据
    };
  },
  created() {
    let _this = this;
    // 设计打样 订单数量
    if (_this.$route.path == '/proof/HardcoverQuotation') {
      _this.priceFormData.num = 1;
    }
    _this.getdata();
    _this.getByGoodsIdfn();
    checkToken().then(res => {
      if (res.code != '000000') {
        _this.loginstatus = true;
      }
    });
  },
  mounted() {
    const scrollDiv = document.querySelector('body');
    this.fixednum = document.querySelector('.fixedstatus').clientHeight;
    const divclass = document.querySelector('.fixedstatus');
    const guigeRtWrap = document.querySelector('.guigeRtWrap').clientHeight;
    scrollDiv.onscroll = () => {
      const divheight = document.querySelector('.guigeLt')?.clientHeight;
      if (document.documentElement.scrollTop > 350) {
        if (document.documentElement.scrollTop > divheight + 350 - guigeRtWrap) {
          divclass.style.marginTop = divheight - guigeRtWrap + 'px';
        } else {
          divclass.style.marginTop = document.documentElement.scrollTop - 350 + 'px';
        }
      } else {
        divclass.style.marginTop = 0;
      }
    };
  },
  watch: {
    $route(to) {
      this.subCateId = this.$route.query.subCateId;
      this.initial();
      // this.$router.go(0)
      // 设计打样 订单数量
      if (this.$route.path == '/proof/HardcoverQuotation') {
        this.priceFormData.num = 1;
      }
    }
  },
  methods: {
    ...{ strEquals },
    // 修改iframe
    /**
     * czj
     * 获取商品的基础属性信息
     */
    getdata() {
      let _this = this;
      getVoList({
        bindType: 'cate',
        bindId: this.$route.query.subCateId,
        // bindId: '129',
        whereBindId: '',
        whereGoodsId: ''
      }).then(res => {
        let strData = JSON.stringify(res.data);
        let getobj = JSON.parse(strData);
        _this.originalDataList = JSON.parse(strData);
        _this.data = res.data;
        let layerArr = [];
        for (let i = 0; i < _this.data.length; i++) {
          // 获取部件的全部属性数据
          if (_this.data[i].miniZtAttrGroup.actualValue == 'layer') {
            layerArr.push(_this.data[i]);
          }
          // 获取部件的按钮数据
          if (_this.data[i].miniZtAttrGroup.code.indexOf('parent') > -1) {
            _this.parentdata = _this.data[i].miniZtAttrGroup.defaultSelect.split(',');
          }
          // 选中部件：部件:内盒
          if (_this.data[i].miniZtAttrGroup.actualValue == 'title') {
            _this.$set(_this.radiodata, _this.data[i].miniZtAttrGroup.id, _this.data[i].miniZtAttrGroup.id + '_' + _this.data[i].attrList[0].id);
          }
          // 复选框加空数组，防止后面赋值报错
          if (_this.data[i].miniZtAttrGroup.groupType == 'checkbox' && _this.data[i].miniZtAttrGroup.code.indexOf('parent') == -1) {
            _this.$set(_this.checkdata, _this.data[i].miniZtAttrGroup.id, []);
          }
        }
        // data3保存最初的全部的部件数据，用于部件选择的时候把相关的数据插入到data2
        _this.data3 = JSON.parse(JSON.stringify(layerArr));
        let newData2 = []; //data2的数据，用于在页面上渲染
        // data3的attrlist里插入相关联的数据据，并且newData2插入值
        _this.data3 = _this.data3.map((item, i) => {
          let arr = _this.data.filter(e => e.miniZtAttrGroup.pid === item.miniZtAttrGroup.id);
          item.attrList.push(...arr);
          if (i == 0 || (item.miniZtAttrGroup.reminder && _this.parentdata.findIndex(s => s == item.miniZtAttrGroup.reminder) != -1)) {
            newData2.push(item);
          }
          return item;
        });
        _this.data2 = JSON.parse(JSON.stringify(newData2));
        // 设置页面标题
        if (this.routername == 'priceH') {
          this.titleobj = getSubNav(this.$store.getters.priceCateNavs, this.$route.query.cateId, this.$route.query.subCateId, this.$route.path.indexOf('/price'));
        } else {
          this.titleobj = getSubNav(this.$store.getters.proofCateNavs, this.$route.query.cateId, this.$route.query.subCateId);
        }
        // 使用定时器，进入异步，防止初始化的时候，页面的空白时间过长
        setTimeout(() => {
          for (let i = 0; i < _this.data2.length; i++) {
            let e = _this.data2[i];
            if (i != 0) {
              let oldIndex = _this.data3.findIndex(c => c.miniZtAttrGroup.id === e.miniZtAttrGroup.id);
              _this.copypart(oldIndex * 10000 + 5652, i, e.miniZtAttrGroup.groupName, e.miniZtAttrGroup.name);
            }
          }
        }, 1);
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
      // if (this.$route.query.subCateId == '101') {
      //   this.priceFormData.time_normal = 168;
      //   this.priceFormData.days_normal = 7;
      // }
    },
    // setdata(){
    //   if(this.$route.query.subCateId==129){
    //     for(let i=0;i<this.data.length;i++){
    //       if(this.data[i].miniZtAttrGroup.name=='皮壳'){
    //         console.log('set',this.data[i]);
    //       }
    //     }
    //   }
    // },
    /**
     * czj
     * 把通用的面料、芯板、内衬等通用的相关数据插入到copy一份
     * @param {*} id
     * @param {*} index
     * @param {*} num
     * @param {*} name
     */
    copypart(id, index, num = 1, name = '') {
      let _this = this;
      let copypNum = (_this.copyp = _this.copyp + 15430);
      _this.addarr = [];
      // 部件通用数据
      let partlist = [];
      if (name == '内围框') {
        partlist = _this.data2[0].attrList.filter(e => e.miniZtAttrGroup.name === '面料' || e.miniZtAttrGroup.name === '芯板');
      } else if (name == '外连接' || name == '内连接') {
        partlist = _this.data2[0].attrList.filter(e => e.miniZtAttrGroup.name === '面料');
      } else {
        partlist = _this.data2[0].attrList.filter(e => e.miniZtAttrGroup.name !== '部件');
      }
      partlist = JSON.parse(JSON.stringify(partlist));
      // 这2个部件里面的芯板把中纤板去掉
      if (name == '内围框' || name == '面顶贴') {
        partlist = partlist.map(newItem => {
          if (newItem.miniZtAttrGroup.name === '芯板') {
            newItem.attrList = newItem.attrList.filter(e => e.name != '中纤板');
          }
          return newItem;
        });
      }
      let newAddArr = [];
      for (let i = 0; i < partlist.length; i++) {
        partlist[i].miniZtAttrGroup.pid = id;
        partlist[i].miniZtAttrGroup.id = partlist[i].miniZtAttrGroup.id + copypNum;
        partlist[i].miniZtAttrGroup.reminder = '';
        partlist[i].miniZtAttrGroup.pname = name;
        partlist[i].miniZtAttrGroup.copypNum = copypNum;
        for (let j = 0; j < partlist[i].attrList.length; j++) {
          newAddArr.push(..._this.lookupdata(partlist[i].attrList[j].groupId, partlist[i].attrList[j].id, name));
          partlist[i].attrList[j].groupId = partlist[i].miniZtAttrGroup.id;
          partlist[i].attrList[j].id = partlist[i].attrList[j].id + copypNum;
        }
        if (partlist[i].miniZtAttrGroup.name == '面料') {
          partlist[i].miniZtAttrGroup.groupName = num;
        }
      }
      _this.data2[index].attrList.push(...partlist);
      _this.data2[index].attrList.sort(_this.sortlayer);
      setTimeout(() => {
        for (let ii = 0; ii < newAddArr.length; ii++) {
          newAddArr[ii].miniZtAttrGroup.pid = newAddArr[ii].miniZtAttrGroup.pid + copypNum;
          newAddArr[ii].miniZtAttrGroup.id = newAddArr[ii].miniZtAttrGroup.id + copypNum;
          newAddArr[ii].miniZtAttrGroup.parentAttrId = newAddArr[ii].miniZtAttrGroup.parentAttrId + copypNum;
          newAddArr[ii].miniZtAttrGroup.copypNum = copypNum;
          for (let jj = 0; jj < newAddArr[ii].attrList.length; jj++) {
            newAddArr.push(..._this.lookupdata(newAddArr[ii].attrList[jj].groupId, newAddArr[ii].attrList[jj].id, name));
            newAddArr[ii].attrList[jj].groupId = newAddArr[ii].miniZtAttrGroup.id;
            newAddArr[ii].attrList[jj].id = newAddArr[ii].attrList[jj].id + copypNum;
          }
        }
        _this.data.push(...partlist);
        _this.data.push(...newAddArr);
      }, 1);
    },
    /**
     * czj
     * 查找属性的依赖属性数据病返回数组
     * @param {*} pid
     * @param {*} parentAttrId
     * @param {*} name
     */
    lookupdata(pid, parentAttrId, name) {
      let _this = this;
      let str = '皮壳,面顶贴,天盖,柜桶';
      let list = _this.originalDataList.filter(groupItem => {
        if (groupItem.miniZtAttrGroup.pid == pid && parentAttrId == groupItem.miniZtAttrGroup.parentAttrId) {
          if (groupItem.attrList != null && groupItem.attrList.length > 0) {
            if ((groupItem.miniZtAttrGroup.name == '盒内围样式' && _this.boxstr.indexOf(name) == -1) || (groupItem.miniZtAttrGroup.name == '是否加海绵' && str.indexOf(name) == -1)) {
              return false;
            }
            return true;
          }
        }
        return false;
      });
      return JSON.parse(JSON.stringify(list));
    },
    getByGoodsIdfn() {
      getBySubBindId({ id: this.$route.query.subCateId }).then(res => {
        if (res.code == '000000') {
          this.goodsId = res.data.id;
          this.infoobj = res.data;
        }
      });
    },
    /**
     * czj
     * 添加部件
     * @param {*} name 部件名称
     */
    addlay(name) {
      let _this = this;
      if (_this.timer === true) return;
      // 添加部件的时候，清空之前的计价结果
      _this.priceFormData.total_price = 0;
      _this.priceFormData.price = 0;
      _this.priceFormData.price_old = 0;
      _this.timer = true; //用于判断此次操作是否完成，完成时改为false，防止多次点击
      let newAddArr = []; //用于接收最新要添加到data的数据的数组
      let data = _this.data3.find(v => {
        return v.miniZtAttrGroup.name == name;
      }); //查找需要添加的部件
      const num = data.miniZtAttrGroup.groupName.split('_');
      const pnum = num[0]; //部件最大可添加数量
      const cnum = num[1];
      let numlist = _this.data2.filter(v => {
        return v.miniZtAttrGroup.name == name;
      }); //查找当前被添加的部件已经有多少个
      if (pnum <= numlist.length) {
        _this.$message({ type: 'error', message: '已经最大添加值' });
        _this.timer = false;
        return;
      }
      if (name == '柜桶') {
        let ctlist = _this.data2.filter(v => {
          return v.miniZtAttrGroup.name == '抽屉';
        });
        if (numlist.length + 1 > ctlist.length) {
          _this.$message({ type: 'error', message: '抽屉数量必须不少于柜桶数量' });
          _this.timer = false;
          return;
        }
      }
      data.addi = numlist.length + 1;
      const newItem = JSON.parse(JSON.stringify(data));
      newItem.miniZtAttrGroup.code = newItem.miniZtAttrGroup.code.replace('_1_add', '_' + data.addi + '_remove');
      newItem.miniZtAttrGroup.sortOrder = newItem.miniZtAttrGroup.sortOrder + data.addi;
      newItem.miniZtAttrGroup.id = newItem.miniZtAttrGroup.id + 5000 * data.addi;
      newItem.miniZtAttrGroup.copypNum = _this.copyp + 15430; //此次添加部件的一个标识，用于在删除部件的时候快速找到相关数据，加15430是因为下面会调用copypart函数，要与里面的数据的copypNum值一致
      for (let i = 0; i < newItem.attrList.length; i++) {
        newItem.attrList[i].miniZtAttrGroup.pid = newItem.miniZtAttrGroup.id;
        newItem.attrList[i].miniZtAttrGroup.id = newItem.attrList[i].miniZtAttrGroup.id + 5000 * data.addi;
        newItem.attrList[i].miniZtAttrGroup.parentAttrId = newItem.attrList[i].miniZtAttrGroup.parentAttrId + 5000 * data.addi;
        for (let j = 0; j < newItem.attrList[i].attrList.length; j++) {
          newAddArr.push(...JSON.parse(JSON.stringify(_this.lookupdata(newItem.attrList[i].attrList[j].groupId, newItem.attrList[i].attrList[j].id, name))));
          newItem.attrList[i].attrList[j].groupId = newItem.attrList[i].miniZtAttrGroup.id;
          newItem.attrList[i].attrList[j].id = newItem.attrList[i].attrList[j].id + 5000 * data.addi;
        }
        if (newItem.attrList[i].miniZtAttrGroup.name == '部件') {
          newItem.attrList[i].attrList[0].actualValue = newItem.attrList[i].attrList[0].actualValue.replace('1', data.addi);
          _this.$set(_this.radiodata, newItem.attrList[i].miniZtAttrGroup.id, newItem.attrList[i].miniZtAttrGroup.id + '_' + newItem.attrList[i].attrList[0].id);
        }
        if (newItem.attrList[i].miniZtAttrGroup.name == '尺寸') {
          newItem.attrList[i].miniZtAttrGroup.actualValue = newItem.attrList[i].miniZtAttrGroup.actualValue.replace('1', data.addi);
        }
      }
      _this.data.push(...newItem.attrList);
      _this.data2.push(newItem);
      _this.data2.sort(_this.sortlayer);
      _this.timer = false;
      // 使用定时器，使里面的处理变为异步的，防止页面卡顿，因为是异步的，所以无法像之前那样使用this.addarr这个数组，改为使用newAddArr数组
      setTimeout(() => {
        for (let ii = 0; ii < newAddArr.length; ii++) {
          newAddArr[ii].miniZtAttrGroup.pid = newAddArr[ii].miniZtAttrGroup.pid + 5000 * data.addi;
          newAddArr[ii].miniZtAttrGroup.id = newAddArr[ii].miniZtAttrGroup.id + 5000 * data.addi;
          newAddArr[ii].miniZtAttrGroup.parentAttrId = newAddArr[ii].miniZtAttrGroup.parentAttrId + 5000 * data.addi;
          newAddArr[ii].miniZtAttrGroup.copypNum = newItem.miniZtAttrGroup.copypNum;
          for (let jj = 0; jj < newAddArr[ii].attrList.length; jj++) {
            newAddArr.push(..._this.lookupdata(newAddArr[ii].attrList[jj].groupId, newAddArr[ii].attrList[jj].id, name));
            newAddArr[ii].attrList[jj].groupId = newAddArr[ii].miniZtAttrGroup.id;
            newAddArr[ii].attrList[jj].id = newAddArr[ii].attrList[jj].id + 5000 * data.addi;
          }
        }
        _this.data.push(...newAddArr);
        _this.copypart(
          81250,
          _this.data2.findIndex(e => e.miniZtAttrGroup.id == newItem.miniZtAttrGroup.id),
          data.miniZtAttrGroup.groupName,
          data.miniZtAttrGroup.name
        );
        _this.setchilidchange(_this.data);
        _this.setsize();
      }, 10);
    },
    /**
     * czj
     * 添加面料
     * @param {*} id
     * @param {*} index
     * @param {*} citem
     */
    addchild(id, index, citem) {
      let _this = this;
      if (_this.timer === true) return;
      _this.priceFormData.total_price = 0;
      _this.priceFormData.price = 0;
      _this.priceFormData.price_old = 0;
      _this.timer = true;
      const num = citem.miniZtAttrGroup.groupName.split('_');
      const cnum = num[1];
      let mlength = _this.data2[index].attrList.filter(v => {
        return v.miniZtAttrGroup.name == '面料';
      });
      if (cnum <= mlength.length || citem.miniZtAttrGroup.groupName == '') {
        _this.$message({ type: 'error', message: '已经最大添加值' });
        _this.timer = false;
        return;
      }
      let copypNum = (_this.copyp = _this.copyp + 15430);
      this.addarr = [];
      let newAddArr = [];
      citem.addnum = mlength.length + 1;
      let partlist = JSON.parse(JSON.stringify(_this.data2[0].attrList.filter(e => e.miniZtAttrGroup.name === '面料')));
      for (let i = 0; i < partlist.length; i++) {
        partlist[i].miniZtAttrGroup.reminder = '';
        partlist[i].miniZtAttrGroup.pid = id;
        partlist[i].miniZtAttrGroup.id = partlist[i].miniZtAttrGroup.id + copypNum;
        partlist[i].miniZtAttrGroup.sortOrder = partlist[i].miniZtAttrGroup.sortOrder + citem.addnum * 1000;
        partlist[i].miniZtAttrGroup.code = partlist[i].miniZtAttrGroup.code.replace('ML_btn', 'ML_del_' + citem.addnum);
        for (let j = 0; j < partlist[i].attrList.length; j++) {
          newAddArr.push(..._this.lookupdata(partlist[i].attrList[j].groupId, partlist[i].attrList[j].id));
          partlist[i].attrList[j].groupId = partlist[i].miniZtAttrGroup.id;
          partlist[i].attrList[j].id = partlist[i].attrList[j].id + copypNum;
        }
        partlist[i].miniZtAttrGroup.copypNum = copypNum;
      }
      _this.data2[index].attrList.push(...partlist);
      _this.data2[index].attrList.sort(_this.sortlayer);
      _this.timer = false;
      setTimeout(() => {
        for (let ii = 0; ii < newAddArr.length; ii++) {
          newAddArr[ii].miniZtAttrGroup.copypNum = copypNum;
          newAddArr[ii].miniZtAttrGroup.pid = newAddArr[ii].miniZtAttrGroup.pid + copypNum;
          newAddArr[ii].miniZtAttrGroup.id = newAddArr[ii].miniZtAttrGroup.id + copypNum;
          newAddArr[ii].miniZtAttrGroup.parentAttrId = newAddArr[ii].miniZtAttrGroup.parentAttrId + copypNum;
          newAddArr[ii].miniZtAttrGroup.sortOrder = newAddArr[ii].miniZtAttrGroup.sortOrder + citem.addnum * 1000;
          if (newAddArr[ii].miniZtAttrGroup.actualValue) {
            newAddArr[ii].miniZtAttrGroup.actualValue = newAddArr[ii].miniZtAttrGroup.actualValue.replace(/面料1/g, '面料' + citem.addnum);
          }
          for (let jj = 0; jj < newAddArr[ii].attrList.length; jj++) {
            newAddArr.push(..._this.lookupdata(newAddArr[ii].attrList[jj].groupId, newAddArr[ii].attrList[jj].id));
            newAddArr[ii].attrList[jj].groupId = newAddArr[ii].miniZtAttrGroup.id;
            newAddArr[ii].attrList[jj].id = newAddArr[ii].attrList[jj].id + copypNum;
            newAddArr[ii].attrList[jj].sortOrder = newAddArr[ii].attrList[jj].sortOrder + citem.addnum * 1000;
            if (newAddArr[ii].attrList[jj].actualValue) {
              newAddArr[ii].attrList[jj].actualValue = newAddArr[ii].attrList[jj].actualValue.replace(/面料1/g, '面料' + citem.addnum);
            }
          }
        }
        _this.data.push(...newAddArr);
        _this.data.push(...partlist);
        _this.setchilidchange(_this.data);
      }, 10);
    },
    /**
     * czj
     * 数据拼接
     */
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
          const item = this.data2[i].attrList[j];
          if (item.miniZtAttrGroup.groupType === 'radio') {
            // 单选框
            for (let var1 in radioSelectValues) {
              // console.log(radioSelectValues[var1]);
              const splits = radioSelectValues[var1].split('_');
              const groupId = splits[0];
              const attrId = splits[1];
              // console.log('item.miniZtAttrGroup == groupId', item.miniZtAttrGroup.id == groupId);
              if (item.miniZtAttrGroup.id == groupId) {
                const attrItem = item.attrList.find(e => e.id == attrId);
                // console.log('attrItem',attrItem)
                // const attrItem = this.getGroupAttr(attrId, groupId);
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
          } else if (this.data2[i].attrList[j].miniZtAttrGroup.groupType === 'select') {
            //下拉选择框
            for (let var1 in selectSelectValues) {
              const splits = selectSelectValues[var1].split('_');
              const groupId = splits[0];
              const attrId = splits[1];
              if (item.miniZtAttrGroup.id == groupId) {
                const attrItem = item.attrList.find(e => e.id == attrId);
                // const attrItem = this.getGroupAttr(attrId, groupId);
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
          } else if (item.miniZtAttrGroup.groupType == 'input') {
            // 文本输入框
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
                // const attrItem = this.getGroupAttr(attrId, groupId);
                if (strEquals(groupId, item.miniZtAttrGroup.id)) {
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
          } else if (item.miniZtAttrGroup.groupType === 'checkbox') {
            for (let var1 in checkBoxSelectValues) {
              // console.log(checkBoxSelectValues[var1]);
              for (let j = 0; j < checkBoxSelectValues[var1].length; j++) {
                const splits = checkBoxSelectValues[var1][j].split('_');
                const groupId = splits[0];
                const attrId = splits[1];
                // const attrItem = this.getGroupAttr(attrId, groupId);
                // console.log(attrId,groupId);
                // console.log(attrItem);
                if (item.miniZtAttrGroup.id == groupId) {
                  const attrItem = item.attrList.find(e => e.id == attrId);
                  if (attrItem && strEquals(item.miniZtAttrGroup.id, attrItem.groupId)) {
                    if (attrItem.actualValue) {
                      groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + attrItem.actualValue + ';');
                    }
                  }
                }
              }
            }
          }
          if (this.jybm[item.miniZtAttrGroup.id]) {
            groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + this.jybm[item.miniZtAttrGroup.id]);
          }
          if (this.spotinp[item.miniZtAttrGroup.id] && this.spotinp[item.miniZtAttrGroup.id].length) {
            groupValueList.push(this.data2[i].miniZtAttrGroup.id + '_' + this.spotinp[item.miniZtAttrGroup.id].toString().replace(/,/g, '@') + ';');
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

      let parr = Object.values(pbox);
      if (parr.length) {
        groupValueList.push(...parr);
      }
      // let pboxlist=[...new Set(pbox),...new Set(pbox2)]
      // console.log('groupValueList', groupValueList);
      return groupValueList;
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
    addgilding(data, pi) {
      let gid = data.miniZtAttrGroup.parentAttrId;
      let sortnum = data.miniZtAttrGroup.sortOrder;
      let addlist = [];
      let cid = null;
      let cobj = null;
      let num = 23456;
      let str = '';
      for (let i = 0; i < this.data2[pi].attrList.length; i++) {
        if (this.data2[pi].attrList[i].miniZtAttrGroup.parentAttrId === gid) {
          if (this.data2[pi].attrList[i].miniZtAttrGroup.code.indexOf('_DEL') > -1) {
            return;
          }
          addlist.push(JSON.parse(JSON.stringify(this.data2[pi].attrList[i])));
          cid = this.data2[pi].attrList[i].attrList[12] && this.data2[pi].attrList[i].attrList[12].id;
          if (cid && data.miniZtAttrGroup.code.indexOf('_ADD') == -1) {
            for (let j = 0; j < this.data.length; j++) {
              if (this.data[j].miniZtAttrGroup.parentAttrId === cid) {
                cobj = JSON.parse(JSON.stringify(this.data[j]));
                cobj.miniZtAttrGroup.id = cobj.miniZtAttrGroup.id + num;
                cobj.attrList[0].groupId = cobj.miniZtAttrGroup.id;
                cobj.attrList[0].id = cobj.attrList[0].id + num;
                break;
              }
            }
          }
        }
      }

      if (data.miniZtAttrGroup.code.indexOf('_ADD') == -1) {
        data.miniZtAttrGroup.code = data.miniZtAttrGroup.code + '_ADD';
      }

      for (let a = 0; a < addlist.length; a++) {
        addlist[a].miniZtAttrGroup.id = addlist[a].miniZtAttrGroup.id + num;
        addlist[a].miniZtAttrGroup.sortOrder = sortnum + (a + 1);
        if (addlist[a].miniZtAttrGroup.groupType == 'select') {
          str = addlist[a].miniZtAttrGroup.parentAttrName == '普通烫金' ? '烫金' : addlist[a].miniZtAttrGroup.parentAttrName;
        }
        // if(addlist[a].miniZtAttrGroup.actualValue=='尺寸'){
        addlist[a].miniZtAttrGroup.code = addlist[a].miniZtAttrGroup.code + '_DEL';
        for (let b = 0; b < addlist[a].attrList.length; b++) {
          addlist[a].attrList[b].groupId = addlist[a].miniZtAttrGroup.id;
          addlist[a].attrList[b].id = addlist[a].attrList[b].id + num;
          if (str && addlist[a].attrList[b].actualValue) {
            addlist[a].attrList[b].actualValue = addlist[a].attrList[b].actualValue.replace(str + '1', str + '2');
            if (cobj && cobj.miniZtAttrGroup.actualValue.indexOf(str + '2') == -1) {
              cobj.miniZtAttrGroup.actualValue = cobj.miniZtAttrGroup.actualValue.replaceAll(str + '1', str + '2');
              cobj.miniZtAttrGroup.parentAttrId = addlist[0].attrList[12].id + num;
              cobj.miniZtAttrGroup.pid = cobj.miniZtAttrGroup.pid + num;
              cobj.miniZtAttrGroup.code = cobj.miniZtAttrGroup.code + '_DEL';
              cobj.miniZtAttrGroup.sortOrder = sortnum + 1;
            }
          }
        }
      }

      this.data2[pi].attrList.push(...addlist);
      if (cobj) {
        this.data.push(...addlist, cobj);
      }
      this.data2[pi].attrList.sort(this.sortlayer);
      // console.log('this.data2[pi]',this.data2[pi]);
      // console.log('addlist',addlist);
      // console.log('cobj',cobj);
      // console.log('data',this.data);
      this.getprice();
    },
    minaddgilding(data, pi) {
      let gid = data.miniZtAttrGroup.parentAttrId;
      let sortnum = data.miniZtAttrGroup.sortOrder;
      let addlist = [];
      let num = 23456;
      let str = data.miniZtAttrGroup.name;
      for (let i = 0; i < this.data2[pi].attrList.length; i++) {
        if (this.data2[pi].attrList[i].miniZtAttrGroup.parentAttrId === gid) {
          if (this.data2[pi].attrList[i].miniZtAttrGroup.code.indexOf('_DEL') > -1) {
            return;
          }
          addlist.push(JSON.parse(JSON.stringify(this.data2[pi].attrList[i])));
        }
      }

      for (let a = 0; a < addlist.length; a++) {
        addlist[a].miniZtAttrGroup.id = addlist[a].miniZtAttrGroup.id + num;
        addlist[a].miniZtAttrGroup.sortOrder = sortnum + (a + 1);
        addlist[a].miniZtAttrGroup.code = addlist[a].miniZtAttrGroup.code + '_DEL';
        addlist[a].miniZtAttrGroup.actualValue = addlist[a].miniZtAttrGroup.actualValue.replace(str + '1', str + '2');
        for (let b = 0; b < addlist[a].attrList.length; b++) {
          addlist[a].attrList[b].groupId = addlist[a].miniZtAttrGroup.id;
          addlist[a].attrList[b].id = addlist[a].attrList[b].id + num;
        }
      }

      if (data.miniZtAttrGroup.code.indexOf('_ADD') == -1) {
        data.miniZtAttrGroup.code = data.miniZtAttrGroup.code + '_ADD';
        this.data.push(...addlist);
      }
      this.data2[pi].attrList.push(...addlist);
      this.data2[pi].attrList.sort(this.sortlayer);
      // console.log('this.data2[pi]',this.data2[pi]);
      // console.log('addlist',addlist);
      // console.log('data',this.data);
      this.getprice();
    },
    delgilding(data, pi) {
      let gid = data.miniZtAttrGroup.parentAttrId;
      let delid = 0;
      for (let i = this.data2[pi].attrList.length - 1; i >= 0; i--) {
        if (this.data2[pi].attrList[i].miniZtAttrGroup.parentAttrId === gid) {
          if (this.data2[pi].attrList[i].miniZtAttrGroup.code.indexOf('_DEL') > -1) {
            if (this.data2[pi].attrList[i].miniZtAttrGroup.groupType === 'select') {
              this.$set(this.selectdata, this.data2[pi].attrList[i].miniZtAttrGroup.id, '');
              delid = this.data2[pi].attrList[i].attrList[12].id;
            }
            this.data2[pi].attrList.splice(i, 1);
          }
        }
      }
      if (delid) {
        let dindex = this.data2[pi].attrList.findIndex(e => e.miniZtAttrGroup.parentAttrId == delid);
        if (dindex > -1) {
          this.data2[pi].attrList.splice(dindex, 1);
        }
      }
      // console.log('delid',de1lid);
      this.getprice();
    },
    mindelgilding(data, pi) {
      let gid = data.miniZtAttrGroup.parentAttrId;
      for (let i = this.data2[pi].attrList.length - 1; i >= 0; i--) {
        if (this.data2[pi].attrList[i].miniZtAttrGroup.parentAttrId === gid) {
          if (this.data2[pi].attrList[i].miniZtAttrGroup.code.indexOf('_DEL') > -1) {
            this.data2[pi].attrList.splice(i, 1);
          }
        }
      }
      this.getprice();
    },
    /**
     * 取消添加的部件
     * @param {*} item
     * @param {*} i
     * @param {*} name
     */
    removelay(item, i, name) {
      let _this = this;
      if (_this.timer2 === true) return;
      _this.timer2 = true;
      let index = _this.data2.findLastIndex(e => {
        return e.miniZtAttrGroup.name === name;
      });
      _this.data = _this.data.filter(e => !_this.data2[index].attrList.find(item => e.miniZtAttrGroup.id === item.miniZtAttrGroup.id));
      _this.data2.splice(index, 1);
      if (name === '抽屉') {
        let chouti = _this.data2.filter(e => {
          return e.miniZtAttrGroup.name === '抽屉';
        });
        let guitong = _this.data2.filter(e => {
          return e.miniZtAttrGroup.name === '柜桶';
        });
        if (guitong.length > chouti.length) {
          let index2 = _this.data2.findLastIndex(e => {
            return e.miniZtAttrGroup.name === '柜桶';
          });
          _this.data = _this.data.filter(e => !_this.data2[index2].attrList.find(item => e.miniZtAttrGroup.id === item.miniZtAttrGroup.id));
          _this.data2.splice(index2, 1);
        }
      }
      _this.getprice();
      _this.timer2 = false;
    },
    // removedata(pid) {
    //   for (let i = this.data.length - 1; i >= 0; i--) {
    //     if (this.data[i].miniZtAttrGroup.parentAttrId == pid) {
    //       for (let j = this.data[i].attrList.length - 1; j >= 0; j--) {
    //         if (this.data[i].attrList[j]) {
    //           this.removedata(this.data[i].attrList[j].id);
    //         }
    //       }
    //       this.data.splice(i, 1);

    //       // break;
    //     }
    //   }
    // },
    // removedata2(id, name) {
    //   for (let j = 0; j < this.data.length; j++) {
    //     if (this.data[j].miniZtAttrGroup.id == id && this.data[j].miniZtAttrGroup.name == name) {
    //       this.data.splice(j, 1);
    //       // break;
    //     }
    //   }
    // },
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
      if (name == '内衬' || name == '芯板' || name == '印刷' || name == '过油覆膜' || name == '压纹') {
        flag = true;
      } else {
        flag = false;
      }
      return flag;
    },
    /**
     * czj
     * 取消添加的面料，把相关的数据清除
     * @param {*} item
     * @param {*} index
     * @param {*} i
     */
    delchild(item, index, i) {
      let _this = this;
      if (this.timer2) {
        return;
      }
      _this.timer2 = true;
      _this.data = _this.data.filter(e => e.miniZtAttrGroup.copypNum !== item.miniZtAttrGroup.copypNum);
      _this.data2[index].attrList = _this.data2[index].attrList.filter(e => e.miniZtAttrGroup.copypNum !== item.miniZtAttrGroup.copypNum);
      _this.timer2 = false;
    },
    // remove2data(id, index) {
    //   for (let i = this.data2[index].attrList.length - 1; i >= 0; i--) {
    //     if (this.data2[index].attrList[i].miniZtAttrGroup.parentAttrId == id) {
    //       for (let a = this.data2[index].attrList[i].attrList.length - 1; a >= 0; a--) {
    //         this.remove2data(this.data2[index].attrList[i].attrList[a].id, index);
    //       }
    //       this.data2[index].attrList.splice(i, 1);
    //     }
    //   }
    // },

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
        if (this.inputdata[id] < 15) {
          this.$set(this.inputdata, id, null);
          this.$message({ type: 'error', message: '包边高度不能小于15MM' });
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
      let _this = this;
      if (e) {
        let data = _this.data.filter(v => {
          return v.miniZtAttrGroup.parentAttrId == id;
        });
        this.data2[i].attrList.push(...data);
        this.data2[i].attrList.sort(this.sortlayer);
      } else {
        for (let a = this.data2[i].attrList.length - 1; a >= 0; a--) {
          if (this.data2[i].attrList[a].miniZtAttrGroup.parentAttrId == id) {
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
            for (let b = this.data2[i].attrList.length - 1; b >= 0; b--) {
              if (this.data2[i].attrList[b].miniZtAttrGroup.pid == this.data2[i].attrList[a].miniZtAttrGroup.id) {
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
    /**
     * czj
     * @param {*} e
     */
    radiochange(e) {
      const _this = this;
      const splits = e.event.split('_');
      const groupId = splits[0];
      const attrId = splits[1];
      const child = e.child;
      const index = e.index;
      const cindex = e.i;
      _this.deleteGroupItem(groupId, index);
      _this.loadDefaultGroup(groupId, attrId, index);
      _this.data2[index].attrList.sort(_this.sortlayer);
      if (e.name == '印刷' || e.name == '过油覆膜') {
        _this.btnlimit(e.index, e.i, child, attrId, e.name, groupId);
      }
      _this.getprice();
    },
    /**
     * czj
     * 获取相关数据
     * @param {*} pid
     * @param {*} parentAttrId
     * @param {*} index
     */
    loadDefaultGroup(pid, parentAttrId, index) {
      let _this = this;
      const _voList = _this.data;
      let arr = [];
      for (let i = 0; i < _voList.length; i++) {
        const groupItem = _voList[i];
        if (groupItem.miniZtAttrGroup.pid == pid && parentAttrId == groupItem.miniZtAttrGroup.parentAttrId) {
          if (groupItem.attrList != null && groupItem.attrList.length > 0) {
            arr.push(groupItem);
          }
        }
        if (groupItem.miniZtAttrGroup.parentAttrId == parentAttrId) {
          if (groupItem.miniZtAttrGroup.pname == '材质' || groupItem.miniZtAttrGroup.pname == '印刷方式' || groupItem.miniZtAttrGroup.pname == '纸板材质' || groupItem.miniZtAttrGroup.parentAttrName == '单色') {
            _this.$set(_this.radiodata, groupItem.miniZtAttrGroup.id, groupItem.attrList[0].groupId + '_' + groupItem.attrList[0].id);
          } else if (groupItem.miniZtAttrGroup.name == '盒内围样式') {
            _this.$set(_this.radiodata, groupItem.miniZtAttrGroup.id, groupItem.attrList[0].groupId + '_' + groupItem.attrList[1].id);
          }
        }
      }
      _this.data2[index].attrList.push(...JSON.parse(JSON.stringify(arr)));
    },
    /**
     * czj
     * 删除相关数据
     * @param {*} pid
     * @param {*} index
     */
    deleteGroupItem(pid, index) {
      let _this = this;
      // 查找与之相关联的数据，如果arr的长度为0这不需要进行删除相关数据的查询操作
      let arr = _this.data2[index].attrList.filter(e => e.miniZtAttrGroup.pid == pid);
      if (arr.length > 0) {
        const list = _this.getGroupSubItem(pid, index);
        for (let i = 0; i < list.length; i++) {
          if (list[i].miniZtAttrGroup.groupType == 'radio') {
            delete _this.radiodata[list[i].miniZtAttrGroup.id];
          }
          _this.checkdata[list[i].miniZtAttrGroup.id] = [];
        }
        _this.data2[index].attrList = _this.data2[index].attrList.filter(item => {
          return !list.find(e => e.miniZtAttrGroup.id === item.miniZtAttrGroup.id);
        });
      }
    },
    /**
     * czj
     * 获取this.data2[index].attrList里面与pid相关联的数据，之前是查询data，
     * 现改为查询data2[index].attrlist这样减少遍历次数
     * @param {*} pid
     * @param {*} index
     */
    getGroupSubItem(pid, index) {
      const _this = this;
      let list = [];
      let length = _this.data2[index].attrList.length - 1;
      for (let i = length; i >= 0; i--) {
        const formGroupItem = _this.data2[index].attrList[i];
        if (formGroupItem.miniZtAttrGroup.pid == pid) {
          let arr = _this.data2[index].attrList.filter(formGroupItem1 => formGroupItem1 != null && formGroupItem1.miniZtAttrGroup != null && formGroupItem1.miniZtAttrGroup.pid === formGroupItem.miniZtAttrGroup.id);
          list.push(...[formGroupItem, ...arr]);
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
                console.log('select');
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
    /**
     * czj
     * 选择部件
     * @param {*} e
     * @param {*} id
     * @param {*} name
     */
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
        // 选择新部件的时候，不需要立即重新计价
        this.priceFormData.total_price = 0;
        this.priceFormData.price = 0;
        this.priceFormData.price_old = 0;
      } else {
        for (let a = this.data2.length - 1; a >= 0; a--) {
          if (this.data2[a].miniZtAttrGroup.reminder == id || this.data2[a].miniZtAttrGroup.name == name) {
            this.data2.splice(a, 1);
          }
        }
        this.getprice();
      }
    },
    // getparent() {
    //   let _this = this;
    //   _this.$nextTick(() => {
    //     let pdata = _this.data.filter(e => {
    //       return e.miniZtAttrGroup.code.indexOf('parent') > -1;
    //     });
    //     let defaultIds = pdata[0].miniZtAttrGroup.defaultSelect.split(',');
    //     _this.parentdata = defaultIds;
    //   });
    //   // console.log('pdata', this.parentdata);
    // },
    cartfn() {
      if (this.datastatus() && this.datastatus2() && this.priceFormData.long && this.priceFormData.wide && this.priceFormData.hign && this.priceFormData.num && this.priceFormData.total_price > 0) {
        let cc = '成品内尺寸:' + this.boxobj.boxLength + '_' + this.boxobj.boxWide + '_' + this.boxobj.boxHeight + ';展开尺寸:' + this.boxobj.goodAl + '_' + this.boxobj.goodAw + ';';
        let wxnum = this.boxobj.boxNumber;
        let work = this.boxobj.boxNumber >= 50 ? '纸张类型:双坑;纸张材质:BC坑_150g牛卡_130g普芯_50g普芯_130g普芯_150g牛卡_K818K;粘合:胶粘;印刷颜色:无;0;' : '';
        let wxattr = this.pack == '平口箱外箱' ? '|#|部件:包装服务;品类:平口箱;' + cc + work + '数量:' + wxnum + ';堆叠方式:' + this.boxobj.StackingWay + ';' : '';
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
        if (this.$route.query.subCateId == '128' && obj[a].indexOf('圆磁') > -1) {
          obj['17347'] += '裱合工艺:贴片_铁片;';
        }
        if (obj[a].indexOf('配件方磁规格') > -1) {
          let objid = '';
          if (this.$route.query.subCateId == '128') {
            objid = '17347';
          } else if (this.$route.query.subCateId == '138') {
            objid = '17784';
          } else if (this.$route.query.subCateId == '129') {
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
        let wxattr = this.pack == '平口箱外箱' ? '' : '|#|部件:包装服务;品类:定制外包装箱;';
        this.jzattr = zkcc + '|#|' + data + this.parts + wxattr;
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
        if (this.routername == 'priceH') {
          priceInvoke({
            city: '',
            fnumber: this.fnumber,
            goodsAttr: this.jzattr,
            // goodsAttrs: data,
            goodsId: this.goodsId,
            // goodsId: 1616,
            number: this.priceFormData.num
          })
            .then(res => {
              if (res.code == '970006') {
                this.loginstatus = true;
                return;
              }
              if (res.code == '999999') {
                console.log('9999999999999999999999999999');
              }
              if (res.code != '000000') {
                this.priceFormData.total_price = 0;
                return;
              }
              // if (res.code == '000000') {
              // let cc = '成品内尺寸:' + res.data.priceInfo.boxLength + '_' + res.data.priceInfo.boxWide + '_' + res.data.priceInfo.boxHeight + ';展开尺寸:' + res.data.priceInfo.goodAl + '_' + res.data.priceInfo.goodAw + ';';
              // this.wxattr = '品类:外箱;' + cc + '纸张类型:三坑;纸张材质:BCB坑_160g牛卡_90g普芯_50g普芯_90g普芯_50g普芯_90g普芯_120g牛卡_K31313A;粘合:胶粘;印刷颜色:无;0;';
              // this.wxnum = res.data.priceInfo.boxNumber < 50 ? 50 : res.data.priceInfo.boxNumber;

              if (this.priceFormData.cityId) {
                getShippingFee({
                  fnumber: 1,
                  weight: res.data.weight,
                  city: city,
                  goodsAttr: '品类:外箱'
                }).then(shi => {
                  if (shi.code == '000000') {
                    this.priceFormData.total_price = res.data.total_price;
                    this.priceFormData.weight = res.data.weight;
                    this.priceFormData.shipping_fee = shi.data;
                    // this.priceFormData.out_time = res.data.out_time
                    this.priceFormData.price_old = res.data.price_old;
                  } else {
                    this.priceFormData.total_price = 0;
                    this.priceFormData.price_old = 0;
                    this.priceFormData.out_time = '';
                  }
                });
              } else {
                this.priceFormData.total_price = res.data.total_price;
                this.priceFormData.time_normal = res.data.time_normal;
                this.priceFormData.days_normal = res.data.days_normal;
                this.priceFormData.realWeight = res.data.realWeight;
                // this.priceFormData.out_time = res.data.out_time
                this.priceFormData.price_old = res.data.price_old;
                // this.priceFormData.shipping_fee = prc.data.shipping_fee;
              }
              this.boxobj = res.data.priceInfo;
              // this.priceFormData = Object.assign({}, this.priceFormData, res.data);
              // } else {
              //   console.log('zhixing');
              //   this.priceFormData.total_price=0
              //   this.$message({
              //     message: res.message,
              //     type: 'error'
              //   });
              // }
            })
            .catch(err => {
              this.priceFormData.total_price = 0;
              this.priceFormData.price_old = 0;
              // this.priceFormData.out_time = ''
              // console.log('errerrerrerr111', err);
            });
        } else {
          let typenum = 302;
          if (this.$route.query.subCateId == 128) {
            typenum = 302;
          } else if (this.$route.query.subCateId == 137) {
            typenum = 303;
          } else if (this.$route.query.subCateId == 138) {
            typenum = 304;
          } else if (this.$route.query.subCateId == 129) {
            typenum = 305;
          }
          proofGetPrice({ goodsId: this.goodsId, goodsAttr: this.jzattr, number: this.priceFormData.num, fnumber: this.fnumber, type: this.titleobj.sortOrder })
            .then(res => {
              if (res.code === '970006') {
                this.formData.showLoginDialog = true;
              } else {
                this.priceFormData = Object.assign({}, this.priceFormData, res.data);
                // this.formData.goodAttr = strVal;
              }
              this.priceFormData.priceProgress = false;
            })
            .catch(res => {
              this.priceFormData.priceProgress = false;
            });
        }

        // console.log('data1', data);
      } else {
        this.priceFormData.total_price = 0;
        this.priceFormData.price = 0;
        this.priceFormData.price_old = 0;
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
  background: #fafafa;
  display: flex;
  flex-wrap: wrap;
}
.childbox {
  display: flex;
  padding: 5px 0;
  flex-wrap: wrap;
}
.EattrLab {
  background: #fafafa;
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
  max-width: 91px;
  height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.eattrtitle {
  background: #fafafa;
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
  margin-left: 108px;
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

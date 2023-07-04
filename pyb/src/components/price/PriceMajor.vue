<template>
  <div class="EattrMbox">
    <el-form class="EattrMain" ref="formData" :model="formData" label-width="130px" @submit.native.prevent size="small">
      <template v-for="(item, index) in formVoList">
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
        <el-form-item :key="'qq_' + index" v-if="strEquals($route.query.cateId, '1') && strEquals(item.miniZtAttrGroup.code, 'WJXG')">
          <div class="Pantips"><span class="red">温馨提示:</span>如果您选择“是”，我们会按照拼一版规范修改您的文件；选择“否”，我们将不做任何处理。</div>
        </el-form-item>

        <el-form-item v-if="item.miniZtAttrGroup.reminder != null && item.miniZtAttrGroup.reminder !== '' && (item.miniZtAttrGroup.id == 7165 || item.miniZtAttrGroup.id == 7167)" :key="'reminder_' + index">
          <div class="Emtils">
            <span style="color: red">温馨提示</span>
            {{ item.miniZtAttrGroup.reminder }}
          </div>
        </el-form-item>

        <el-form-item :key="index">
          <!--工艺 弹层-->
          <template slot="label">
            <div class="EattrLab">
              <span class="red" v-if="item.miniZtAttrGroup.required === 1 && item.miniZtAttrGroup.showName === 1">*</span>
              {{ item.miniZtAttrGroup.showName === 1 ? item.miniZtAttrGroup.name : '' }}
            </div>
            <div v-if="endWith(item.miniZtAttrGroup.code, 'YSBH')">
              <a style="color: red" href="/goods/goodsDesc?gid=919" target="_blank">(查看颜色详情)</a>
            </div>
            <div class="lookMages" v-if="endWith(item.miniZtAttrGroup.code, 'YWBH')">
              <!-- <div v-if="endWith(item.miniZtAttrGroup.code, 'WLXX')"> -->
              <a style="color: red" href="javascript:void(0)" @click="dialogVisible = true">(查看压纹详情)</a>
            </div>
          </template>
          <!-- 文本框 -->
          <el-row class="flex inputBx Layerinpts" v-if="strEquals(item.miniZtAttrGroup.groupType, 'input')">
            <div class="inputBxrow" v-for="attr in item.attrList" :key="attr.id">
              <el-input v-model="formData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small" @change="priceValuation">
                <template slot="append">{{ attr.suffix }}</template>
              </el-input>
            </div>

            <div class="group-copy-div" v-if="isCopyCraft(item.miniZtAttrGroup.code) && !endWith(item.miniZtAttrGroup.code, '_COPY')">
              <el-button size="mini" round type="danger" v-if="!strEquals(item.miniZtAttrGroup.id, '7167')" @click="addCopyGroupCk(item.miniZtAttrGroup.parentAttrId)">增加{{ item.miniZtAttrGroup.name }}</el-button>
              <el-button size="mini" round type="info" @click="removeCopyGroupCk({ pid: item.miniZtAttrGroup.pid, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: false })">取消{{ item.miniZtAttrGroup.name }}</el-button>
            </div>

            <div class="group-copy-div" v-if="isCopyCraft(item.miniZtAttrGroup.code) && endWith(item.miniZtAttrGroup.code, '_COPY')">
              <el-button size="mini" round type="info" @click="removeCopyGroupCk({ pid: item.miniZtAttrGroup.pid, copyIndex: item.copyIndex, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: true })">删除</el-button>
            </div>
            <span style="margin-left: 8px; color: red" v-if="item.attrList[0].groupId == 8363">温馨提示：双面胶只按要求位置粘好双面胶,不撕双面胶衬纸。</span>
            <!-- <span style="margin-left: 8px; color: red" v-if="item.attrList[0].groupId == 8363">温馨提示：双面胶只按要求位置粘好双面胶,不撕双面胶衬纸。</span> -->
          </el-row>

          <!-- 单选框 -->
          <div class="flex" v-else-if="strEquals(item.miniZtAttrGroup.groupType, 'radio')" :class="item.miniZtAttrGroup.showName === 0 ? 'oAtrLayer' : ''">
            <el-radio-group class="EattrMgroup" size="small" v-model="formData.radioSelectValues[item.miniZtAttrGroup.id]" @change="radioSelect" button-style="solid">
              <el-row class="Eattrrow" v-for="attr in item.attrList" :key="'attr_' + attr.id">
                <template v-if="attr.remark != '' && attr.remark != null">
                  <el-tooltip width="200" class="item" effect="light" placement="top-start">
                    <template slot="content">
                      <div class="EattrMtips" v-html="attr.remark">{{ attr.remark }}</div>
                    </template>
                    <el-radio-button size="small" :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-radio-button>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-radio-button size="small" :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-radio-button>
                  <span class="colorNumbr" v-if="formData.whiteInk && strEquals(attr.id, '31496')">
                    <el-checkbox-button @change="priceValuation" class="major-check" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
                  </span>
                </template>
              </el-row>

              <div class="group-copy-div" v-if="isCopyCraft(item.miniZtAttrGroup.code) && !endWith(item.miniZtAttrGroup.code, '_COPY')">
                <el-button size="mini" round type="info" @click="removeCopyGroupCk({ pid: item.miniZtAttrGroup.pid, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: false })">取消{{ item.miniZtAttrGroup.parentAttrName }}</el-button>
              </div>

              <div class="group-copy-div1" v-if="strEquals(item.miniZtAttrGroup.code, 'FHCCZ')">
                <el-button round size="mini" type="danger" @click="addCopyGroupRd(item.miniZtAttrGroup.id, 4)">增加复合层</el-button>
                <el-button round size="mini" type="info" @click="removeCopyGroupRd({ id: item.miniZtAttrGroup.id, copyIndex: 0, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: false })">取消复合层</el-button>
                <div style="clear: both"></div>
              </div>
              <div class="group-copy-div1" v-if="startWith(item.miniZtAttrGroup.code, 'FHCCZ') && endWith(item.miniZtAttrGroup.code, '_COPY')">
                <el-button round size="mini" type="info" @click="removeCopyGroupRd({ id: item.miniZtAttrGroup.id, copyIndex: item.copyIndex, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: true })">删除</el-button>
              </div>
            </el-radio-group>
            <!-- 提示信息 -->
            <span v-if="item.attrList[0].groupId == 8364" style="color: red">温馨提示：粘性要求比较高的产品建议用油性胶。</span>

            <!-- 专色 -->

            <span class="colorNumbr" v-if="strEquals($route.query.cateId, '8') && strEquals(item.miniZtAttrGroup.code, 'YSYS')">
              <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
            </span>

            <span v-if="strEquals(bindType, 'pinyiban')">
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'SGYSYS')">
                专色数量:
                <el-select v-model="formData.sgYsys.scCount" style="width: 100px" @change="priceValuation">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'XGYSYS')">
                专色数量:
                <el-select v-model="formData.xgYsys.scCount" style="width: 100px" @change="priceValuation">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'YSXZ')">
                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
                专色数量:
                <el-select v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'BK_YSYS')">
                专色数量:
                <el-select v-model="formData.bqys.scCount" style="width: 100px" @change="priceValuation">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="!strEquals(item.miniZtAttrGroup.id, '7173')">
                <span
                  v-if="
                    (strEquals($route.query.cateId, '1') ||
                      strEquals($route.query.cateId, '2') ||
                      (strEquals($route.query.cateId, '4') && strEquals($route.query.subCateId, '35')) ||
                      (strEquals($route.query.cateId, '6') && strEquals($route.query.subCateId, '42')) ||
                      (strEquals($route.query.cateId, '9') && strEquals($route.query.subCateId, '46')) ||
                      strEquals($route.query.cateId, '70') ||
                      strEquals($route.query.cateId, '13')) &&
                      endWith(item.miniZtAttrGroup.code, 'YSYS')
                  "
                >
                  <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
                  专色数量:
                  <el-select v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation">
                    <el-option label="0" :value="0"></el-option>
                    <el-option label="1" :value="1"></el-option>
                    <el-option label="2" :value="2"></el-option>
                    <el-option label="3" :value="3"></el-option>
                    <el-option v-if="$route.query.cateId !== '2'" label="4" :value="4"></el-option>
                  </el-select>
                </span>
              </span>

              <span class="colorNumbr" v-if="strEquals($route.query.cateId, '10') && strEquals($route.query.subCateId, '49') && endWith(item.miniZtAttrGroup.code, 'YSYS')">
                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
                专色数量:
                <el-select v-model="formData.dmys.scCount" style="width: 100px" @change="priceValuation">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'SMYS_ZM')">
                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.zmys.jybm" v-model="formData.zmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
                专色数量:
                <el-select v-model="formData.zmys.scCount" style="width: 100px" @change="priceValuation">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'SMYS_FM')">
                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.fmys.jybm" v-model="formData.fmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
                专色数量:
                <el-select v-model="formData.fmys.scCount" style="width: 100px" @change="priceValuation">
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                  <el-option label="4" :value="4"></el-option>
                </el-select>
              </span>
              <span class="colorNumbr" v-if="strEquals($route.query.cateId, '70') && endWith(item.miniZtAttrGroup.code, 'YSYS')">
                印刷面:
                <el-select v-model="formData.ysm.scCount" style="width: 100px" @change="ysmChange">
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
          <!-- <el-form-item v-if="item.miniZtAttrGroup.id == 8248">
            <div v-if="formData.flag" style="display: block">
              <p style="color: #666666; line-height: 20px">
                请下载跟样表格，填写对应信息并打印，将跟样表格与样品快递至傲彩佛山办公室；避免耽误生产货期，建议您选择顺丰寄付，傲彩跟样工程师一律拒收到付件，请知悉！
                <a href="/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName=qcxyztTest/exlfile/拼一版样品信息表.xlsx" style="color: red"><u>点击下载</u></a>
                <img style="width: 32px; vertical-align: middle" src="@/static/assets/img/gestureleft.jpg" alt="" />
              </p>
              <p style="color: #999999">地址：佛山市南海区里水镇里官路59号朝辉产业园 <span style="margin-left: 20px">联系人：张先生 13632713295</span></p>
            </div>
          </el-form-item> -->
          <!-- 复选框 -->
          <div v-else-if="strEquals(item.miniZtAttrGroup.groupType, 'checkbox')">
            <el-checkbox-group class="EattrMgroup" size="small" v-model="formData.checkBoxSelectValues[item.miniZtAttrGroup.id]" @change="checkboxSelect({ event: $event, code: item.miniZtAttrGroup.id })">
              <el-row class="Eattrrow" v-for="attr in item.attrList" :key="'attr_' + attr.id">
                <template v-if="attr.remark !== '' && attr.remark != null">
                  <el-tooltip class="item" effect="light" placement="top-start">
                    <template slot="content">
                      <div class="EattrMtips" v-html="attr.remark">{{ attr.remark }}</div>
                    </template>
                    <el-checkbox-button :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-checkbox-button>
                  </el-tooltip>
                </template>
                <el-checkbox-button v-else :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-checkbox-button>
              </el-row>
            </el-checkbox-group>
          </div>

          <!-- 下拉选择框 -->
          <div v-else-if="strEquals(item.miniZtAttrGroup.groupType, 'select')">
            <el-select size="small" v-model="formData.selectSelectValues[item.miniZtAttrGroup.id]" placeholder="请选择" @change="selectSelect">
              <el-option v-for="(attr, aindex) in item.attrList" :key="aindex" :label="attr.name" :value="attr.groupId + '_' + attr.id"> </el-option>
            </el-select>
          </div>

          <!-- 潘通色号 -->
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'SGYSYS') && formData.sgYsys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" v-for="(item, index) in formData.sgYsys.scCount" :key="item" v-model="formData.sgYsys.pantoneList[index]" @change="priceValuation" />
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'XGYSYS') && formData.xgYsys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" v-for="(item, index) in formData.xgYsys.scCount" :key="item" v-model="formData.xgYsys.pantoneList[index]" @change="priceValuation" />
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'YSXZ') && formData.dmys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" v-for="(item, index) in formData.dmys.scCount" :key="item" v-model="formData.dmys.pantoneList[index]" @change="priceValuation" />
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'BK_YSYS') && formData.bqys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" v-for="(item, index) in formData.bqys.scCount" :key="item" v-model="formData.bqys.pantoneList[index]" @change="priceValuation" />
          </div>
          <div class="PantoneDv" v-if="!strEquals(item.miniZtAttrGroup.id, '7173')">
            <div
              v-if="
                (strEquals($route.query.cateId, '1') ||
                  strEquals($route.query.cateId, '2') ||
                  (strEquals($route.query.cateId, '4') && strEquals($route.query.subCateId, '35')) ||
                  (strEquals($route.query.cateId, '6') && strEquals($route.query.subCateId, '42')) ||
                  (strEquals($route.query.cateId, '9') && strEquals($route.query.subCateId, '46')) ||
                  (strEquals($route.query.cateId, '10') && strEquals($route.query.subCateId, '49')) ||
                  strEquals($route.query.cateId, '70') ||
                  strEquals($route.query.cateId, '13')) &&
                  endWith(item.miniZtAttrGroup.code, 'YSYS') &&
                  formData.dmys.scCount > 0
              "
            >
              <label>请填写PANTONE色号:</label>
              <el-input class="PantoneDvtx" v-for="(item, index) in formData.dmys.scCount" :key="item" v-model="formData.dmys.pantoneList[index]" @change="priceValuation" />
            </div>
          </div>

          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'SMYS_ZM') && formData.zmys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" v-for="(item, index) in formData.zmys.scCount" :key="item" v-model="formData.zmys.pantoneList[index]" @change="priceValuation" />
          </div>
          <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'SMYS_FM') && formData.fmys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" v-for="(item, index) in formData.fmys.scCount" :key="item" v-model="formData.fmys.pantoneList[index]" @change="priceValuation" />
          </div>
          <div class="PantoneDv" v-if="strEquals($route.query.cateId, '70') && endWith(item.miniZtAttrGroup.code, 'YSYS')">
            <ul>
              <li v-for="(item, index) in formData.ysm.scCount" :key="index">
                <label>实际印刷尺寸{{ index + 1 }}</label>
                <el-input class="PantoneDvtx" v-model="formData.ysm.list[index]['longVal']" @change="priceValuation">
                  <template slot="append">x</template>
                </el-input>
                <el-input class="PantoneDvtx" v-model="formData.ysm.list[index]['widthVal']" @change="priceValuation">
                  <template slot="append">mm</template>
                </el-input>
              </li>
            </ul>
          </div>
          <!-- <div v-if="formData.showMsg && index === formVoList.length - 1">温馨提示：请尽量避免同一位置工艺叠加，因工艺叠加产生的问题本公司不予受理。</div> -->
        </el-form-item>
      </template>
    </el-form>

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
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { isCopyCraft } from '@/utils/price/craftUtil';
export default {
  name: 'PriceMajor',
  props: {
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
    bindType: String
  },
  watch: {},
  data() {
    return {
      dialogVisible: false
    };
  },
  created() {
    console.log('formVoList66666', this.formVoList);
    console.log('formData', this.formData);
  },
  methods: {
    ...{ startWith, endWith, strEquals },
    ...{ isCopyCraft },
    handleClose(done) {
      done();
    },

    ysmChange() {
      if (this.formData.ysm.scCount <= 0) {
        let isError = false;
        for (let p in this.formData.radioSelectValues) {
          const selectValue = this.formData.radioSelectValues[p + ''];
          console.log('selectValue', selectValue);
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
    }
  }
};
</script>

<style scoped>
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
.lookMages {
  line-height: 4px;
}
</style>

<template>
  <div class="EattrMbox">
    <el-form class="EattrMain" ref="formData" :model="formData" label-width="140px" @submit.native.prevent size="small">
      <template v-for="(item, index) in formVoList">
        <el-form-item v-if="item.miniZtAttrGroup.reminder != null && item.miniZtAttrGroup.reminder !== ''" :key="'reminder_' + index">
          <div class="Emtils">
            {{ item.miniZtAttrGroup.reminder }}
          </div>
        </el-form-item>
        <el-form-item :key="index">
          <template slot="label">
            <div class="EattrLab">
              <span class="red" v-if="item.miniZtAttrGroup.required === 1 && item.miniZtAttrGroup.showName === 1">*</span>
              {{ item.miniZtAttrGroup.showName === 1 ? item.miniZtAttrGroup.name : '' }}
              <div v-if="strEquals(item.miniZtAttrGroup.code, 'BMCL_BRB_FBYS')">
                <span class="viewVeins charpieTips" @click="fbysDialogVisible = true">(查看绒布颜色参照)</span>
              </div>
            </div>
          </template>
          <el-row class="flex inputBx Layerinpts" v-if="strEquals(item.miniZtAttrGroup.groupType, 'input')">
            <div class="flex inputBxrow" v-for="attr in item.attrList" :key="attr.id">
              <span style="padding: 0px 5px" v-if="attr.prefix">{{ attr.prefix }}</span>
              <el-input
                style="width: 100px"
                v-model="formData.inputValues[attr.groupId + '_' + attr.id]"
                :placeholder="attr.inputTips"
                size="small"
                @change="priceValuation(formData.inputValues[attr.groupId + '_' + attr.id], attr.suffix, attr.groupId + '_' + attr.id)"
              >
                <template slot="append" v-if="attr.suffix">{{ attr.suffix }}</template>
              </el-input>
            </div>

            <div class="group-copy-div" v-if="isCopyCraft(item.miniZtAttrGroup.code) && !endWith(item.miniZtAttrGroup.code, '_COPY')">
              <el-button round size="mini" type="danger" @click="addCopyGroupCk(item.miniZtAttrGroup.parentAttrId)">增加{{ item.miniZtAttrGroup.name }}</el-button>
              <el-button round size="mini" type="info" @click="removeCopyGroupCk({ pid: item.miniZtAttrGroup.pid, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: false })">取消{{ item.miniZtAttrGroup.name }}</el-button>
            </div>
            <div class="group-copy-div" v-if="isCopyCraft(item.miniZtAttrGroup.code) && endWith(item.miniZtAttrGroup.code, '_COPY')">
              <el-button round size="mini" type="info" @click="removeCopyGroupCk({ pid: item.miniZtAttrGroup.pid, copyIndex: item.copyIndex, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: true })">删除</el-button>
            </div>
          </el-row>

          <!-- 单选框 -->
          <div class="flex" v-else-if="strEquals(item.miniZtAttrGroup.groupType, 'radio')" :class="item.miniZtAttrGroup.showName === 0 ? 'oAtrLayer' : ''">
            <el-radio-group class="EattrMgroup" size="small" v-model="formData.radioSelectValues[item.miniZtAttrGroup.id]" @change="radioSelect" button-style="solid">
              <el-row class="Eattrrow" v-for="attr in item.attrList" :key="'attr_' + attr.id">
                <template v-if="attr.remark != '' && attr.remark != null">
                  <el-tooltip class="item" effect="light" placement="top-start">
                    <template slot="content">
                      <div class="EattrMtips" @click="consultantService" v-html="convertRemark(attr.remark)"></div>
                    </template>
                    <el-radio-button size="small" :label="attr.groupId + '_' + attr.id" :disabled="readioDisabled(item, attr)">{{ attr.name }}</el-radio-button>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-radio-button size="small" :label="attr.groupId + '_' + attr.id" :disabled="readioDisabled(item, attr)">{{ attr.name }}</el-radio-button>
                </template>
              </el-row>
              <div class="group-copy-div1" v-if="strEquals(item.miniZtAttrGroup.code, 'FHCCZ')">
                <el-button round size="mini" type="danger" @click="addCopyGroupRd(item.miniZtAttrGroup.id, 4)">增加复合层</el-button>
                <el-button round size="mini" type="info" @click="removeCopyGroupRd({ id: item.miniZtAttrGroup.id, copyIndex: 0, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: false })">取消复合层</el-button>
                <div style="clear: both"></div>
              </div>
              <div class="group-copy-div1" v-if="startWith(item.miniZtAttrGroup.code, 'FHCCZ') && endWith(item.miniZtAttrGroup.code, '_COPY')">
                <el-button round size="mini" type="info" @click="removeCopyGroupRd({ id: item.miniZtAttrGroup.id, copyIndex: item.copyIndex, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: true })">删除</el-button>
              </div>
            </el-radio-group>

            <!-- 专色 -->
            <span v-if="strEquals($route.query.cateId, '8') && endWith(item.miniZtAttrGroup.code, 'YSYS')">
              <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
            </span>
            <span v-if="strEquals(bindType, 'proof')">
              <span
                class="colorNumbr"
                v-if="
                  ((strEquals($route.query.cateId, '4') && strEquals($route.query.subCateId, '35')) || (strEquals($route.query.cateId, '9') && strEquals($route.query.subCateId, '46')) || strEquals($route.query.cateId, '70')) &&
                    endWith(item.miniZtAttrGroup.code, 'YSYS')
                "
              >
                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
              </span>
            </span>

            <span v-if="strEquals(bindType, 'proof')">
              <span
                class="colorNumbr"
                v-if="
                  (strEquals($route.query.cateId, '1') || strEquals($route.query.cateId, '2') || strEquals($route.query.cateId, '6')) &&
                    (endWith(item.miniZtAttrGroup.pname, '印刷颜色') || endWith(item.miniZtAttrGroup.pname, '印刷方式') || endWith(item.miniZtAttrGroup.name, '印刷颜色')) &&
                    item.miniZtAttrGroup.code.indexOf('_DMYS') > -1
                "
              >
                <!-- <span v-if="item.miniZtAttrGroup.code.indexOf('DTZ')>-1||item.miniZtAttrGroup.code.indexOf('_BZGZ')>-1"></span>
                <template v-else>
                  <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨{{item.miniZtAttrGroup.code.indexOf('DTZ')>-1}}</el-checkbox-button>
                </template> -->
                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨<!--{{formData.dmys.jybm}}{{formData.dmys.jybmVal}}--></el-checkbox-button>
              </span>
            </span>

            <span v-if="strEquals(bindType, 'proof')">
              <span class="colorNumbr" v-if="(strEquals($route.query.cateId, '1') || strEquals($route.query.cateId, '6')) && item.miniZtAttrGroup.parentAttrName == '双面印刷' && item.miniZtAttrGroup.code.indexOf('_SMYS_ZM') > -1">
                <!-- <span v-if="item.miniZtAttrGroup.code.indexOf('DTZ')>-1||item.miniZtAttrGroup.code.indexOf('DTZ')>-1"></span>
                <template v-else>
                  <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.zmys.jybm" v-model="formData.zmys.jybmVal" label="加印白墨">加印白墨正面{{item.miniZtAttrGroup.code.indexOf('DTZ')>-1}}</el-checkbox-button>
                </template> -->
                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.zmys.jybm" v-model="formData.zmys.jybmVal" label="加印白墨">加印白墨<!--{{formData.zmys.jybm}}{{formData.zmys.jybmVal}}--></el-checkbox-button>
              </span>
            </span>

            <span v-if="strEquals(bindType, 'proof')">
              <span class="colorNumbr" v-if="(strEquals($route.query.cateId, '1') || strEquals($route.query.cateId, '6')) && item.miniZtAttrGroup.parentAttrName == '双面印刷' && item.miniZtAttrGroup.code.indexOf('_SMYS_FM') > -1">
                <!-- <span v-if="item.miniZtAttrGroup.code.indexOf('DTZ')>-1||item.miniZtAttrGroup.code.indexOf('DTZ')>-1"></span>
                <template v-else>
                  <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.fmys.jybm" v-model="formData.fmys.jybmVal" label="加印白墨">加印白墨反面{{item.miniZtAttrGroup.code.indexOf('DTZ')>-1}}</el-checkbox-button>
                </template> -->
                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.fmys.jybm" v-model="formData.fmys.jybmVal" label="加印白墨">加印白墨<!--{{formData.fmys.jybm}}{{formData.fmys.jybmVal}}--></el-checkbox-button>
              </span>
            </span>
            <!-- 添加工艺裱卡 -->
            <!-- <span class="colorNumbr" v-if="endWith(item.miniZtAttrGroup.code, 'BK_YSYS')">
              专色数量:
              <el-select v-model="formData.bqys.scCount" style="width: 100px" @change="priceValuation($route.query.cateId == 1 ? getraradiofn() : '')">
                <el-option label="0" :value="0"></el-option>
                <el-option label="1" :value="1"></el-option>
                <el-option label="2" :value="2"></el-option>
                <el-option label="3" :value="3"></el-option>
                <el-option label="4" :value="4"></el-option>
              </el-select>
            </span> -->
          </div>
          <!-- 复选框 -->
          <div v-else-if="strEquals(item.miniZtAttrGroup.groupType, 'checkbox')">
            <el-checkbox-group class="EattrMgroup" size="small" v-model="formData.checkBoxSelectValues[item.miniZtAttrGroup.id]" @change="checkboxSelect({ event: $event, code: item.miniZtAttrGroup.id })">
              <el-row class="Eattrrow" v-for="attr in item.attrList" :key="'attr_' + attr.id">
                <template v-if="attr.remark !== '' && attr.remark != null">
                  <el-tooltip class="item" effect="light" placement="top-start">
                    <template slot="content">
                      <div class="EattrMtips" @click="consultantService" v-html="convertRemark(attr.remark)"></div>
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
          <div v-if="strEquals(item.miniZtAttrGroup.code, 'BMCL_BRB_BRCS')">
            <span class="velvetTimesTips f12 C9">默认同一产品多次裱绒为同一颜色,如有不同请联系<span style="cursor: pointer;" class="red" @click="qiyu">在线客服</span>进行备注,给您造成不便敬请谅解</span>
          </div>
          <!-- 潘通色号(添加工艺裱卡) -->
          <!-- <div class="PantoneDv" v-if="endWith(item.miniZtAttrGroup.code, 'BK_YSYS') && formData.bqys.scCount > 0">
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" v-for="(item, index) in formData.bqys.scCount" :key="item" v-model="formData.bqys.pantoneList[index]" @change="priceValuation" />
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
          </div> -->
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
          <div
            v-if="
              (strEquals($route.query.cateId, '2') ||
                (strEquals($route.query.cateId, '4') && strEquals($route.query.subCateId, '35')) ||
                (strEquals($route.query.cateId, '6') && strEquals($route.query.subCateId, '42')) ||
                (strEquals($route.query.cateId, '9') && strEquals($route.query.subCateId, '46')) ||
                (strEquals($route.query.cateId, '10') && strEquals($route.query.subCateId, '49')) ||
                strEquals($route.query.cateId, '70')) &&
                endWith(item.miniZtAttrGroup.code, 'YSYS') &&
                formData.dmys.scCount > 0
            "
          >
            <label>请填写PANTONE色号:</label>
            <el-input class="PantoneDvtx" v-for="(item, index) in formData.dmys.scCount" :key="item" v-model="formData.dmys.pantoneList[index]" @change="priceValuation" />
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
                <label style="padding: 0px 5px">实际印刷尺寸{{ index + 1 }}</label>
                <el-input class="PantoneDvtx" v-model="formData.ysm.list[index]['longVal']" @change="priceValuation">
                  <template slot="append">x</template>
                </el-input>
                <el-input class="PantoneDvtx" v-model="formData.ysm.list[index]['widthVal']" @change="priceValuation">
                  <template slot="append">mm</template>
                </el-input>
              </li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item :key="'reminder2_' + index" v-if="item.miniZtAttrGroup.name == '反面' || item.miniZtAttrGroup.name == '背面处理'">
          <div class="Pantips"><span class="red">温馨提示:</span> 由于打样与大货生产的工艺不同，同等材质如需背面印刷或其他表处理，打样成品较大货成品厚约0.2mm。</div>
        </el-form-item>
        <el-form-item :key="'reminderbkz_' + index" v-if="strEquals($route.query.cateId, '2') && (strEquals($route.query.subCateId, '28') || strEquals($route.query.subCateId, '32')) && endWith(item.miniZtAttrGroup.code, 'LZ_XZ')" label="见坑纸信息:">
          <template slot="label">
            <div class="EattrLab">
              <span class="red">*</span>
              见坑纸信息
            </div>
          </template>
          {{ formData.zcjgpb }}
        </el-form-item>
      </template>
    </el-form>
    <el-dialog :visible.sync="fbysDialogVisible" top="20px" width="1250px" title="绒布的颜色参照" :before-close="handleClose">
      <el-scrollbar style="height: 750px">
        <img src="/uploads/editor/image/20190821/1566358720689864.jpg" />
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { isCopyCraft } from '@/utils/price/craftUtil';
import { deleteGroupItem, loadDefaultGroup } from '@/utils/proof/proofPriceUtil';
import qiyu from '@/mixins/qiyu';
export default {
  name: 'PriceMajor',
  mixins: [qiyu],
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
  watch: {
    $route: {
      handler() {
        this.isAddBK = false;
      }
    }
  },
  data() {
    return {
      isAddBK: false,
      fbysDialogVisible: false
    };
  },
  methods: {
    ...{ startWith, endWith, strEquals },
    ...{ isCopyCraft },
    handleClose(done) {
      done();
    },
    jybmfn(code) {
      // this.formData.dmys.jybmVal=""
      console.log(code);
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
      return false;
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
</style>

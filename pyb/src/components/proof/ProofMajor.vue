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
            </div>
          </template>
          <el-row class="flex inputBx Layerinpts" v-if="strEquals(item.miniZtAttrGroup.groupType, 'input')">
            <div class="flex inputBxrow" v-for="attr in item.attrList" :key="attr.id">
              <span style="padding: 0px 5px;" v-if="attr.prefix">{{ attr.prefix }}</span>
              <el-input style="width:100px;" v-model="formData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small" @change="priceValuation">
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
                      <div class="EattrMtips" v-html="attr.remark">{{ attr.remark }}</div>
                    </template>
                    <el-radio-button size="small" :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-radio-button>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-radio-button size="small" :label="attr.groupId + '_' + attr.id">{{ attr.name }}</el-radio-button>
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
                  (strEquals($route.query.cateId, '2') ||
                    strEquals($route.query.cateId, '1') ||
                    (strEquals($route.query.cateId, '4') && strEquals($route.query.subCateId, '35')) ||
                    (strEquals($route.query.cateId, '6') && strEquals($route.query.subCateId, '42')) ||
                    (strEquals($route.query.cateId, '9') && strEquals($route.query.subCateId, '46')) ||
                    strEquals($route.query.cateId, '70')) &&
                    endWith(item.miniZtAttrGroup.code, 'YSYS')
                "
              >
                <el-checkbox-button @change="priceValuation" class="major-check" v-if="formData.dmys.jybm" v-model="formData.dmys.jybmVal" label="加印白墨">加印白墨</el-checkbox-button>
              </span>
            </span>
          </div>
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
                <label style="padding: 0px 5px;">实际印刷尺寸{{ index + 1 }}</label>
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
      </template>
    </el-form>
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
    return {};
  },
  methods: {
    ...{ startWith, endWith, strEquals },
    ...{ isCopyCraft }
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

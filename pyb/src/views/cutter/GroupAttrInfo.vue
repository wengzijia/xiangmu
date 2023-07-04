<template>
  <div>
    <el-form ref="formData" :model="formData" label-width="130px" size="small" @submit.native.prevent>
      <el-form-item label="搜索条件">
        <el-checkbox-group v-model="whereSwitchs">
          <el-checkbox label="1">绑定id</el-checkbox>
          <el-checkbox label="2">商品id</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="绑定查询" :inlist="true">
        <el-input style="width:150px" placeholder="绑定id" v-if="whereSwitchs.indexOf('1') != -1" v-model="whereBindId" @change="cateChange" />
        <el-input style="width:150px" placeholder="商品id" v-if="whereSwitchs.indexOf('2') != -1" v-model="whereGoodsId" @change="cateChange" />
      </el-form-item>
      <el-form-item label="是否绑定子级:">
        <el-switch v-model="subCateSwitch" />
      </el-form-item>
      <el-form-item label="分类id:">
        <el-radio-group v-model="cateId" size="mini">
          <el-radio-button v-for="(item, index) in cateList" :key="index" :label="item.id">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="子级分类id:" v-if="subCateSwitch">
        <el-radio-group v-model="subCateId">
          <el-radio-button v-for="(item, index) in subCateList" :key="index" :label="item.id">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-for="(item, index) in formVoList" :label="(item.miniZtAttrGroup.showName == 1 ? item.miniZtAttrGroup.name : '') + (item.miniZtAttrGroup.required == 1 ? '*' : '')" :key="index">
        <div v-if="item.miniZtAttrGroup.groupType == 'input'">
          <div style="float: left;" v-for="attr in item.attrList" :key="attr.id">
            <el-input v-model="formData.inputValues[attr.id]" :placeholder="attr.inputTips" style="width: 120px;" size="small"></el-input>
            <el-tag class="data_item_suffix" type="info" size="small">{{ attr.suffix }}</el-tag>
          </div>
        </div>
        <div v-else-if="item.miniZtAttrGroup.groupType == 'radio'">
          <el-radio-group size="small" v-model="formData.radioSelectValues[item.miniZtAttrGroup.id]" @change="radioSelect" button-style="solid">
            <span v-for="attr in item.attrList" :key="'attr_' + attr.id">
              <template v-if="attr.remark != '' && attr.remark != null">
                <el-tooltip class="item" effect="light" placement="top-start">
                  <template slot="content">
                    <span v-html="attr.remark">{{ attr.remark }}</span>
                  </template>
                  <el-radio-button :label="attr.id">{{ attr.name }}</el-radio-button>
                </el-tooltip>
              </template>
              <template v-else>
                <el-radio-button :label="attr.id">{{ attr.name }}</el-radio-button>
              </template>
            </span>
          </el-radio-group>
        </div>
        <div v-else-if="item.miniZtAttrGroup.groupType == 'checkbox'">
          <el-checkbox-group size="small" v-model="formData.checkBoxSelectValues[item.miniZtAttrGroup.id]" @change="checkboxSelect($event, item.miniZtAttrGroup.id)">
            <span v-for="attr in item.attrList" :key="'attr_' + attr.id">
              <template v-if="attr.remark != '' && attr.remark != null">
                <el-tooltip class="item" effect="light" placement="top-start">
                  <template slot="content">
                    <span v-html="attr.remark">{{ attr.remark }}</span>
                  </template>
                  <el-checkbox-button :label="attr.id">{{ attr.name }}</el-checkbox-button>
                </el-tooltip>
              </template>
              <el-checkbox-button v-else :label="attr.id">{{ attr.name }}</el-checkbox-button>
            </span>
          </el-checkbox-group>
        </div>

        <div v-else-if="item.miniZtAttrGroup.groupType == 'select'">
          <el-select size="small" v-model="formData.selectSelectValues[item.miniZtAttrGroup.id]" placeholder="请选择" @change="selectSelect">
            <el-option v-for="(attr, index) in item.attrList" :key="index" :label="attr.name" :value="attr.id"> </el-option>
          </el-select>
        </div>
        <div v-if="item.miniZtAttrGroup.reminder != null && item.miniZtAttrGroup.reminder != ''">
          {{ item.miniZtAttrGroup.reminder }}
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// @ is an alias to /src
import { getVoList } from '@/api/product/attrApi';
import { findCategoryById, getAllCategoryList, getProofCategory } from '@/api/category/categoryApi';
export default {
  name: 'itemForm',

  data() {
    return {
      bindType: 'goodsCate',
      reqLock: false,
      whereSwitchs: [],
      whereBindId: '',
      whereGoodsId: '',
      checkboxs: [],
      cateId: '',
      cateList: [],
      subCateSwitch: false,
      subCateList: [],
      subCateId: '',
      voList: [],
      formData: {
        inputValues: {},
        radioSelectValues: {},
        checkBoxSelectValues: {},
        oldCheckBoxSelectVals: {},
        selectSelectValues: {}
      },
      formVoList: []
    };
  },
  created() {
    this.getCateList();
  },
  mounted() {},
  watch: {
    formData: {
      handler(newName, oldName) {
        this.dataChange(newName, oldName);
      },
      deep: true,
      immediate: true
    },
    cateId: {
      handler(newVal) {
        this.formVoList = [];
        this.voList = [];
        if (this.subCateSwitch) {
          this.getSubCateList();
        } else {
          this.cateChange(newVal);
        }
      }
    },
    subCateId: {
      handler() {
        this.formVoList = [];
        this.voList = [];
        if (this.subCateSwitch) {
          this.cateChange();
        }
      }
    },
    subCateSwitch: {
      handler() {
        this.formVoList = [];
        this.voList = [];
        if (this.subCateSwitch) {
          this.getSubCateList();
        }
        this.cateChange();
      }
    }
  },
  methods: {
    getSubCateList() {
      let params = { pid: this.cateId };
      if (this.bindType == 'proof') {
        params.proofStatus = 1;
      }
      findCategoryById(params).then(res => {
        this.subCateList = res.data;
        if (res.data.length > 0) {
          this.subCateId = res.data[0].id;
        }
      });
    },

    getCateId() {
      const _this = this;
      let cateId = _this.cateId;
      if (_this.subCateSwitch) {
        cateId = _this.subCateId;
      }
      return cateId;
    },
    /**
     * 分类修改
     * @param {Object} val
     */
    cateChange() {
      const _this = this;
      if (!_this.reqLock) {
        _this.voList = [];
        _this.formVoList = [];
        getVoList({
          bindType: this.bindType,
          bindId: _this.getCateId(),
          whereBindId: _this.whereBindId,
          whereGoodsId: _this.whereGoodsId
        }).then(res => {
          var dataList = res.data;
          _this.voList = dataList;
          _this.loadFormGroup(0);
          _this.formVoList.sort(function(a, b) {
            return a.miniZtAttrGroup.sortOrder - b.miniZtAttrGroup.sortOrder;
          });
          _this.reqLock = false;
        });
      }
    },
    /**
     * 查询子类
     * @param {Object} pid
     */
    findSubItem(pid) {
      const _this = this;
      const _voList = _this.voList;
      var list = [];
      let length = _voList.length - 1;
      for (let i = length; i >= 0; i--) {
        const formGroupItem = _voList[i];
        if (formGroupItem.miniZtAttrGroup.pid == pid) {
          list.push(formGroupItem);
          for (let j = length; j >= 0; j--) {
            const formGroupItem1 = _voList[j];
            if (formGroupItem1 != null && formGroupItem1.miniZtAttrGroup != null && formGroupItem1.miniZtAttrGroup.pid == formGroupItem.miniZtAttrGroup.id) {
              const subList = _this.findSubItem(formGroupItem.miniZtAttrGroup.id);
              list = list.concat(subList);
              break;
            }
          }
        }
      }
      return list;
    },
    /**
     * 删除组
     * @param {Object} pid
     */
    deleteGroupItem(pid) {
      const _this = this;
      const list = _this.findSubItem(pid);
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < _this.formVoList.length; j++) {
          if (list[i].miniZtAttrGroup.id == _this.formVoList[j].miniZtAttrGroup.id) {
            _this.formVoList.splice(j, 1);
            break;
          }
        }
      }
    },
    searchByAttrId(attrId) {
      const _this = this;
      for (let i = 0; i < _this.voList.length; i++) {
        const item = _this.voList[i];
        for (let inx in item.attrList) {
          if (attrId == item.attrList[inx].id) {
            return item.attrList[inx];
          }
        }
      }
    },
    // 复选框选择
    checkboxSelect(event, code) {
      const _this = this;
      let id = 0;
      let isAdd = true;
      if (_this.formData.oldCheckBoxSelectVals[code] != null) {
        id = _this.formData.checkBoxSelectValues[code].concat(_this.formData.oldCheckBoxSelectVals[code]).filter((cur, i, arr) => {
          return arr.indexOf(cur) === arr.lastIndexOf(cur);
        })[0];
        if (_this.formData.checkBoxSelectValues[code].length <= _this.formData.oldCheckBoxSelectVals[code].length) {
          // 减少
          isAdd = false;
        }
      } else {
        id = _this.formData.checkBoxSelectValues[code][0];
      }
      if (isAdd) {
        const attrItem = _this.searchByAttrId(id);
        _this.loadDefaultGroup(attrItem.groupId, attrItem.id);
      } else {
        _this.removeSubGroup(id);
      }
      _this.formVoList.sort(_this.listSort);
      _this.formData.oldCheckBoxSelectVals = JSON.parse(JSON.stringify(_this.formData.checkBoxSelectValues));
    },

    removeSubGroup(attrId) {
      const _this = this;
      for (let i = _this.formVoList.length - 1; i >= 0; i--) {
        let formVoItem = _this.formVoList[i];
        if (formVoItem.miniZtAttrGroup.parentAttrId == attrId) {
          for (let j = 0; j < formVoItem.attrList.length; j++) {
            _this.removeSubGroup(formVoItem.attrList[j].id);
          }
          _this.formVoList.splice(i, 1);
        }
      }
    },
    dataChange() {
      const _this = this;
      const formData = _this.formData;
      var inputValues = formData.inputValues;
      var radioSelectValues = formData.radioSelectValues;
      console.log(radioSelectValues);
      // var checkBoxSelectValues = formData.checkBoxSelectValues;
      const groupValueList = [];
      // 文本输入框
      for (let i = 0; i < _this.formVoList.length; i++) {
        const item = _this.formVoList[i];
        if (item.miniZtAttrGroup.groupType == 'input') {
          var str = item.miniZtAttrGroup.name + ':';
          for (let var1 in inputValues) {
            if (inputValues[var1] != null && inputValues[var1] != '') {
              const attrItem = _this.searchByAttrId(var1);
              if (attrItem.groupId == item.miniZtAttrGroup.id) {
                str += '_' + inputValues[var1];
              }
            }
          }
          groupValueList.push(str);
        }
      }
      // 单选框
      for (let var1 in radioSelectValues) {
        const attrItem = _this.searchByAttrId(radioSelectValues[var1]);
        if (attrItem != null) {
          groupValueList.push(attrItem.actualValue);
        }
      }
      var strValue = '';
      for (let i = 0; i < groupValueList.length; i++) {
        strValue += groupValueList[i] + ';';
      }
      console.log(strValue);
    },
    /**
     * 单选内容选择事件
     * @param {Object} event
     */
    selectSelect(event, p1) {
      console.log(event, p1);
      const val1 = event;
      const _this = this;
      const attrItem = _this.searchByAttrId(val1);
      const list = _this.findSubItem(attrItem.groupId);
      for (let i = 0; i < list.length; i++) {
        delete _this.formData.selectSelectValues[list[i].miniZtAttrGroup.id];
      }
      _this.deleteGroupItem(attrItem.groupId);
      _this.loadDefaultGroup(attrItem.groupId, attrItem.id);
      _this.formVoList.sort(_this.listSort);
      console.log('formVoLists', _this.formVoList);
    },
    /**
     * 单选内容选择事件
     * @param {Object} event
     */
    radioSelect(event, p1) {
      console.log(event, p1);
      const val1 = event;
      const _this = this;
      const attrItem = _this.searchByAttrId(val1);
      const list = _this.findSubItem(attrItem.groupId);
      for (let i = 0; i < list.length; i++) {
        delete _this.formData.radioSelectValues[list[i].miniZtAttrGroup.id];
      }
      _this.deleteGroupItem(attrItem.groupId);
      _this.loadDefaultGroup(attrItem.groupId, attrItem.id);
      _this.formVoList.sort(_this.listSort);
      console.log('formVoLists', _this.formVoList);
    },
    /**
     * 排序
     * @param {Object} a
     * @param {Object} b
     */
    listSort(a, b) {
      return a.miniZtAttrGroup.sortOrder - b.miniZtAttrGroup.sortOrder;
    },
    /**
     * 加载分组
     * @param {Object} pid
     */
    loadFormGroup(pid) {
      const _this = this;
      for (let i = 0; i < _this.voList.length; i++) {
        const groupItem = _this.voList[i];
        if (groupItem.miniZtAttrGroup.pid == pid) {
          if (groupItem.miniZtAttrGroup.groupType == 'radio') {
            if (groupItem.attrList != null && groupItem.attrList.length > 0) {
              const attr = groupItem.attrList[0];
              _this.loadDefaultGroup(attr.groupId, attr.id);
              _this.$set(_this.formData.radioSelectValues, groupItem.miniZtAttrGroup.id, attr.id);
            }
          } else if (groupItem.miniZtAttrGroup.groupType == 'checkbox') {
            _this.$set(_this.formData.checkBoxSelectValues, groupItem.miniZtAttrGroup.id, []);
          } else if (groupItem.miniZtAttrGroup.groupType == 'select') {
            const attr = groupItem.attrList[0];
            _this.loadDefaultGroup(attr.groupId, attr.id);
            _this.$set(_this.formData.selectSelectValues, groupItem.miniZtAttrGroup.id, attr.id);
          }
          _this.formVoList.push(groupItem);
        }
      }
    },
    /**
     * 加载默认的分组
     * @param {Object} pid
     * @param {Object} parentAttrId
     */
    loadDefaultGroup(pid, parentAttrId) {
      const _this = this;
      for (let i = 0; i < _this.voList.length; i++) {
        const groupItem = _this.voList[i];
        if (groupItem.miniZtAttrGroup.pid == pid && parentAttrId == groupItem.miniZtAttrGroup.parentAttrId) {
          if (groupItem.attrList != null && groupItem.attrList.length > 0) {
            const attr = groupItem.attrList[0];
            _this.formVoList.push(groupItem);
            if (groupItem.miniZtAttrGroup.groupType == 'radio') {
              _this.$set(_this.formData.radioSelectValues, groupItem.miniZtAttrGroup.id, attr.id);
              _this.loadDefaultGroup(attr.groupId, attr.id);
            } else if (groupItem.miniZtAttrGroup.groupType == 'select') {
              _this.$set(_this.formData.radioSelectValues, groupItem.miniZtAttrGroup.id, attr.id);
              _this.loadDefaultGroup(attr.groupId, attr.id);
            } else if (groupItem.miniZtAttrGroup.groupType == 'checkbox') {
              _this.$set(_this.formData.checkBoxSelectValues, groupItem.miniZtAttrGroup.id, []);
            }
          }
        }
      }
    }
  }
};
</script>
<style>
.data_item {
  margin-top: 10px;
}

.data_item_label {
  padding-right: 5px;
  width: 150px;
  display: inline-block;
  text-align: right;
}

.data_item_suffix {
  height: 28px !important;
  line-height: 28px !important;
}

.ant-form-item {
  margin-bottom: 10px !important;
}

.el-form-item__content {
  text-align: left;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
</style>

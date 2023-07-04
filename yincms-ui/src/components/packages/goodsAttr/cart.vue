<template>
  <div class="packages-cart-box">
    <el-form ref="form" class="attr-from" label-width="110px" v-if="formList.length > 0">
      <template>
        <el-form-item v-for="(item, index) in formList" :key="item.miniZtAttrGroup.id" :label="item.miniZtAttrGroup.name">
          <!-- <el-input v-if="item.miniZtAttrGroup.groupType == 'input'" v-model="formData.inputValues[item.miniZtAttrGroup.id]"></el-input> -->
          <div class="attr-from-item-box">
            <!-- 文本框 -->
            <div v-if="item.miniZtAttrGroup.groupType == 'input'" class="input-box">
              <div class="inputBxrow" v-for="attr in item.attrList" :key="attr.id">
                <el-input-number v-if="subCateId == '120'" v-model="formData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small" @change="priceValuation" :min="0" :step="100" step-strictly>
                  <template slot="append">{{ attr.suffix }}</template>
                </el-input-number>
                <el-input v-else v-model="formData.inputValues[attr.groupId + '_' + attr.id]" :placeholder="attr.inputTips" size="small">
                  <template slot="append">{{ attr.suffix }}</template>
                </el-input>
              </div>
            </div>
            <!-- 单选 -->
            <div v-if="item.miniZtAttrGroup.groupType == 'radio' && item.attrList.length > 0">
              <el-radio-group @change="e => radioChange(e, item, index)" v-model="formData.radioSelectValues[item.miniZtAttrGroup.id]">
                <el-radio v-for="item2 in item.attrList" :key="item2.id" :label="item2.id + ''" border>{{ item2.name }}</el-radio>
              </el-radio-group>
            </div>
            <!-- 复选 -->
            <div v-if="item.miniZtAttrGroup.groupType == 'checkbox' && item.attrList.length > 0">
              <el-checkbox-group @change="e => checkboxChange(e, item, index)" v-model="formData.checkBoxSelectValues[item.miniZtAttrGroup.id]">
                <el-checkbox v-for="item2 in item.attrList" :key="item2.id" :label="item2.id + ''" border>{{ item2.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <!-- 增加按钮 -->
            <div class="group-copy-div" style="display: inline-block;" v-if="isCopyCraft(item.miniZtAttrGroup.code) && !endWith(item.miniZtAttrGroup.code, '_COPY')">
              <el-button size="mini" round type="danger" @click="addCopyGroupCk(item)">
                <!-- @click="addCopyGroupCk(item.miniZtAttrGroup.parentAttrId)" -->
                增加{{ item.miniZtAttrGroup.name }}</el-button
              >
              <el-button size="mini" round type="info">
                <!--  @click="removeCopyGroupCk({ pid: item.miniZtAttrGroup.pid, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: false })"  -->
                取消{{ item.miniZtAttrGroup.name }}</el-button
              >
            </div>
            <div class="group-copy-div" v-if="isCopyCraft(item.miniZtAttrGroup.code) && endWith(item.miniZtAttrGroup.code, '_COPY')">
              <el-button size="mini" round type="info">
                <!-- @click="removeCopyGroupCk({ pid: item.miniZtAttrGroup.pid, copyIndex: item.copyIndex, parentAttrId: item.miniZtAttrGroup.parentAttrId, isCopy: true })" -->
                删除</el-button
              >
            </div>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { getVoList } from '@/api/product/attrApi';
import { startWith, endWith, strEquals } from '@/utils/strUtil';
import { isCopyCraft } from '@/utils/price/craftUtil';
export default {
  data() {
    return {
      attrList: [],
      formList: [],
      formData: {
        radioSelectValues: {},
        checkBoxSelectValues: {},
        inputValues: {}
      },
      subCateId: ''
    };
  },
  methods: {
    isCopyCraft,
    startWith,
    endWith,
    strEquals,
    getCartList() {
      getVoList({ bindType: 'cate', bindId: '1', whereBindId: '15', isPack: 1 }).then(res => {
        console.log('reess', res);
        let attrList = res.data;
        this.attrList = attrList;
        this.changeAttrList();
        // let formData = {
        //   radioSelectValues: {},
        //   checkBoxSelectValues: {},
        //   inputValues: {}
        // };
        // let formList = [];
        // function setFormData(item) {
        //   if (item.miniZtAttrGroup.groupType == 'radio') {
        //     let arr = (item.miniZtAttrGroup.defaultSelect + '').split(',');
        //     formData.radioSelectValues[item.miniZtAttrGroup.id] = arr[arr.length - 1];
        //   } else if (item.miniZtAttrGroup.groupType == 'checkbox') {
        //     formData.checkBoxSelectValues[item.miniZtAttrGroup.id] = [];
        //   } else if (item.miniZtAttrGroup.groupType == 'input') {
        //     formData.inputValues[item.miniZtAttrGroup.id] = '';
        //   }
        //   if (item.attrList.length > 0) {
        //     formList.push(item);
        //   }
        // }
        // for (const item of attrList) {
        //   if (item.miniZtAttrGroup.parentAttrId === 0) {
        //     setFormData(item);
        //   } else if (formData.radioSelectValues[item.miniZtAttrGroup.pid] == item.miniZtAttrGroup.parentAttrId) {
        //     setFormData(item);
        //   }
        // }
        // this.formList = formList;
        // this.formData = formData;
      });
    },
    radioChange(value, item, index) {
      //   let _this = this;

      //   let formData = {
      //     radioSelectValues: {},
      //     checkBoxSelectValues: {},
      //     inputValues: {}
      //   };
      //   let formList = [];
      //   function setFormData(item) {
      //     if (item.miniZtAttrGroup.groupType == 'radio') {
      //       let arr = item.miniZtAttrGroup.defaultSelect ? (item.miniZtAttrGroup.defaultSelect + '').split(',') : [item.attrList[0]?.id + ''];
      //       let v = _this.formData.radioSelectValues[item.miniZtAttrGroup.id] || arr[arr.length - 1];
      //       formData.radioSelectValues[item.miniZtAttrGroup.id] = v + '';
      //     } else if (item.miniZtAttrGroup.groupType == 'checkbox') {
      //       formData.checkBoxSelectValues[item.miniZtAttrGroup.id] = _this.formData.checkBoxSelectValues[item.miniZtAttrGroup.id] || [];
      //     } else if (item.miniZtAttrGroup.groupType == 'input') {
      //       formData.inputValues[item.miniZtAttrGroup.id] = '';

      //     }
      //     if (item.attrList.length > 0) {
      //       formList.push(item);
      //     }
      //   }
      //   for (const item of _this.attrList) {
      //     if (item.miniZtAttrGroup.parentAttrId === 0) {
      //       setFormData(item);
      //     } else if (formData.radioSelectValues[item.miniZtAttrGroup.pid] == item.miniZtAttrGroup.parentAttrId) {
      //       setFormData(item);
      //     }
      //     if (item.miniZtAttrGroup.groupType == 'checkbox' && formData.checkBoxSelectValues[item.miniZtAttrGroup.id]) {
      //       for (const item2 of formData.checkBoxSelectValues[item.miniZtAttrGroup.id]) {
      //         let o = formList.find(e => e.miniZtAttrGroup.parentAttrId == item2);
      //         if (!o) {
      //           let arr = _this.attrList.filter(e => e.miniZtAttrGroup.parentAttrId == item2);
      //           for (const obj of arr) {
      //             setFormData(obj);
      //           }
      //         }
      //       }
      //     }
      //   }
      //   console.log('formListformListformList', formList);
      //   console.log('formData', formData);
      //   _this.formData = formData;
      //   _this.formList = formList;
      this.changeAttrList();
    },
    checkboxChange() {
      // let _this = this;
      // let formData = {
      //   radioSelectValues: {},
      //   checkBoxSelectValues: {},
      //   inputValues: {}
      // };
      // let formList = [];
      // function setFormData(item) {
      //   if (item.miniZtAttrGroup.groupType == 'radio') {
      //     let arr = item.miniZtAttrGroup.defaultSelect ? (item.miniZtAttrGroup.defaultSelect + '').split(',') : [item.attrList[0]?.id + ''];
      //     formData.radioSelectValues[item.miniZtAttrGroup.id] = _this.formData.radioSelectValues[item.miniZtAttrGroup.id] || arr[arr.length - 1];
      //   } else if (item.miniZtAttrGroup.groupType == 'checkbox') {
      //     formData.checkBoxSelectValues[item.miniZtAttrGroup.id] = _this.formData.checkBoxSelectValues[item.miniZtAttrGroup.id] || [];
      //     console.log('8888666666', formData.checkBoxSelectValues);
      //   } else if (item.miniZtAttrGroup.groupType == 'input') {
      //     formData.inputValues[item.miniZtAttrGroup.id] = '';
      //   }
      //   if (item.attrList.length > 0) {
      //     console.log('dddd', formList);
      //     formList.push(item);
      //   }
      // }
      // for (const item of _this.attrList) {
      //   if (item.miniZtAttrGroup.parentAttrId === 0) {
      //     setFormData(item);
      //   } else if (formData.radioSelectValues[item.miniZtAttrGroup.pid] == item.miniZtAttrGroup.parentAttrId) {
      //     setFormData(item);
      //   }
      //   if (item.miniZtAttrGroup.groupType == 'checkbox' && formData.checkBoxSelectValues[item.miniZtAttrGroup.id]) {
      //     for (const item2 of formData.checkBoxSelectValues[item.miniZtAttrGroup.id]) {
      //       let o = formList.find(e => e.miniZtAttrGroup.parentAttrId == item2);
      //       if (!o) {
      //         console.log(
      //           'item2',
      //           _this.attrList.find(e => e.miniZtAttrGroup.parentAttrId == item2)
      //         );
      //         let arr = _this.attrList.filter(e => e.miniZtAttrGroup.parentAttrId == item2);
      //         for (const obj of arr) {
      //           setFormData(obj);
      //         }
      //       }
      //     }
      //   }
      // }
      // _this.formData = formData;
      // _this.formList = formList;
      this.changeAttrList();
    },
    changeAttrList() {
      let _this = this;
      let formData = {
        radioSelectValues: {},
        checkBoxSelectValues: {},
        inputValues: {}
      };
      let formList = [];
      function setFormData(item) {
        if (item.miniZtAttrGroup.groupType == 'radio') {
          let arr = item.miniZtAttrGroup.defaultSelect ? (item.miniZtAttrGroup.defaultSelect + '').split(',') : [item.attrList[0]?.id + ''];
          formData.radioSelectValues[item.miniZtAttrGroup.id] = _this.formData.radioSelectValues[item.miniZtAttrGroup.id] || arr[arr.length - 1];
        } else if (item.miniZtAttrGroup.groupType == 'checkbox') {
          formData.checkBoxSelectValues[item.miniZtAttrGroup.id] = _this.formData.checkBoxSelectValues[item.miniZtAttrGroup.id] || [];
          console.log('8888666666', formData.checkBoxSelectValues);
        } else if (item.miniZtAttrGroup.groupType == 'input') {
          for (const attr of item.attrList) {
            let key = attr.groupId + '_' + attr.id;
            formData.inputValues[key] = _this.formData.inputValues[key] || '';
          }
        }
        if (item.attrList.length > 0) {
          let index = formList.findLastIndex(e => {
            return e.miniZtAttrGroup.sortOrder < item.miniZtAttrGroup.sortOrder;
          });
          console.log('index', index);
          if (index != -1) {
            let i = index + 1;
            formList.splice(i, 0, item);
          } else {
            formList.push(item);
          }
        }
      }
      for (const item of _this.attrList) {
        if (item.miniZtAttrGroup.parentAttrId === 0) {
          setFormData(item);
        } else if (formData.radioSelectValues[item.miniZtAttrGroup.pid] == item.miniZtAttrGroup.parentAttrId) {
          setFormData(item);
        }
        if (item.miniZtAttrGroup.groupType == 'checkbox' && formData.checkBoxSelectValues[item.miniZtAttrGroup.id]) {
          for (const item2 of formData.checkBoxSelectValues[item.miniZtAttrGroup.id]) {
            let o = formList.find(e => e.miniZtAttrGroup.parentAttrId == item2);
            if (!o) {
              console.log(
                'item2',
                _this.attrList.find(e => e.miniZtAttrGroup.parentAttrId == item2)
              );
              let arr = _this.attrList.filter(e => e.miniZtAttrGroup.parentAttrId == item2);
              for (const obj of arr) {
                setFormData(obj);
              }
            }
          }
        }
      }
      _this.formData = formData;
      _this.formList = formList;
    },
    isShow(item) {
      let _this = this;
      let obj = {
        radio: 'radioSelectValues',
        checkbox: 'checkBoxSelectValues',
        input: 'inputValues'
      };
      return _this.formData[obj[item.miniZtAttrGroup.groupType]][item.miniZtAttrGroup.id];
    },
    addCopyGroupCk(item) {
      console.log('item', item);
      let attr = JSON.parse(JSON.stringify(item));
      attr.miniZtAttrGroup = {
        ...attr.miniZtAttrGroup,
        id: ''
      };
    }
  },
  created() {
    this.getCartList();
  }
};
</script>

<style lang="scss">
.packages-cart-box {
  .attr-from {
    .el-form-item {
      margin-bottom: 0px;

      .el-form-item__content {
        margin-bottom: 10px;
        line-height: 1;
      }
      .el-form-item__label {
        line-height: 34px;
      }
      .attr-from-item-box {
        display: flex;
      }
      // 单选和多选按钮样式
      .el-radio.is-bordered.is-checked,
      .el-checkbox.is-bordered.is-checked {
        border-color: #ca151d;
        .el-radio__label,
        .el-checkbox__label {
          color: #ca151d;
        }
      }
      .el-radio,
      .el-checkbox {
        padding: 0px 14px 0 14px;
        border-radius: 0;
        height: 34px;
        margin-right: 0px;
        .el-radio__label,
        .el-checkbox__label {
          padding-left: 0;
          line-height: 34px;
        }
      }
      .el-radio,
      .el-checkbox {
      }
      .el-radio__input,
      .el-checkbox__input {
        display: none;
      }
      //文本框
      .input-box {
        width: auto;
        display: flex;
        .inputBxrow:not(:first-child) .el-input-group--append .el-input__inner {
          border-left: 0;
        }
        .el-input__inner {
          width: 100px;
        }
        .el-input__inner,
        .el-input-group__append {
          border-radius: 0;
        }
        .el-input__inner:focus {
          box-shadow: none;
        }
      }
    }
  }
}
</style>

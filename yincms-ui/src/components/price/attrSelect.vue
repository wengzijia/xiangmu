<!-- :close-on-press-escape="false"  :close-on-click-modal="false" -->
<template>
  <el-dialog custom-class="ywxx-dialog" :visible.sync="visible" append-to-body top="20px" width="840px" :before-close="handleClose">
    <template slot="title">
      压纹详情
      <el-input class="ywxx-search" size="mini" placeholder="输入压纹关键字或者编号搜索" v-model.trim="searchValue">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </template>

    <div style="padding: 5px 0;">
      <!-- <span v-if="keywords.length">可以点击这些分类快速搜索：</span> -->
      <!-- <spanclass="keywords"></spanclass=> -->
      <el-tabs v-model="tabsActiveName" @tab-click="tabsHandleClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane v-for="(item, index) in keywords" :key="index" :label="item" :name="item"></el-tab-pane>
      </el-tabs>
    </div>
    <el-scrollbar style="height: 450px" class="ywxx-box">
      <el-radio-group v-if="radioAttrList.length" v-model="attrRadio" size="small" class="EattrMgroup">
        <el-row :class="attrRadio == item.groupId + '_' + item.id ? 'Eattrrow radio-eattrrow' : 'Eattrrow'" v-for="(item, index) in radioAttrList" :key="index">
          <div class="remark">
            <el-image :src="item.imgUrl" :preview-src-list="[item.imgUrl]"></el-image>
            <img class="zoom-in-img" :src="zoomInImg" />
          </div>
          <el-radio-button :label="item.groupId + '_' + item.id">
            <!-- <div v-html="item.remark" class="remark"></div> -->
            <div class="radio-box">
              <div class="radio-img-box">
                <img :class="attrRadio == item.groupId + '_' + item.id ? 'show-radio-img radio-img' : 'radio-img'" :src="checkboxImg" alt="" />
              </div>
              <div>
                <div class="attr-text">{{ item.name }}</div>
                <div class="attr-code">编号:{{ item.actualValueCode }}</div>
              </div>
            </div>
          </el-radio-button>
        </el-row>
      </el-radio-group>
      <div v-else class="null-text">{{ nullText }}</div>
    </el-scrollbar>
    <div style="text-align:right;" v-if="attrRadio && radioAttrList.length">
      <el-button class="confirm-ywxx" @click="confirm">确认选择</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { debounce } from '@/utils/utils';
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    attrList: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchValue: '',
      radioAttrList: [],
      attrRadio: '',
      previewSrcList: [],
      sourceAttrList: [],
      nullText: '请输入压纹关键字搜索~',
      keywords: [],
      tabsActiveName: 'all',
      checked: false,
      zoomInImg: require('@/static/index/img/zoom-in.png'),
      checkboxImg: require('@/static/index/img/checkbox.png')
    };
  },
  watch: {
    searchValue: function(newval) {
      let _this = this;
      if (newval.length > 1) {
        _this.tabsActiveName = 'all';
        _this.updateRadioAttrList(newval);
      } else {
        _this.radioAttrList = [];
      }
    }
  },

  methods: {
    /**  tabs切换 */
    tabsHandleClick() {
      let _this = this;
      if (_this.tabsActiveName != 'all') {
        _this.updateRadioAttrList(_this.tabsActiveName);
      } else {
        _this.radioAttrList = _this.sourceAttrList.filter((e, i) => {
          return i < 10;
        });
      }
    },
    /**  dialog关闭事件 */
    handleClose() {
      // 查询是否点开查看了纹理的大图，如果在查看大图，就阻止dialog关闭
      let isShowImg = document.querySelector('.el-image-viewer__wrapper');
      if (!isShowImg) this.$emit('update:visible', false);
    },
    /** 确认选择，更新选择数据并关闭dialog */
    confirm() {
      this.$emit('update:value', this.attrRadio);
      this.$emit('update:visible', false);
    },

    // previewImg() {
    //   let _this = this;
    //   let obj = _this.radioAttrList.find(e => e.groupId + '_' + e.id === _this.attrRadio);
    //   this.previewImgSrc = obj.imgUrl;
    //   if (_this.$refs.previewImg) {
    //     this.$refs.previewImg.clickHandler();
    //   }
    // },
    /** 更新数组 */
    updateRadioAttrList: debounce(function(newval) {
      let _this = this;
      _this.attrRadio = '';
      _this.radioAttrList = _this.sourceAttrList.filter(e => {
        return e.name.indexOf(newval) != -1 || e.actualValueCode == newval;
      });
      if (_this.radioAttrList.length == 0) {
        _this.nullText = '没有找到符合条件的数据，请检查并重新输入正确的压纹关键字。';
      }
    }, 300)
  },
  created() {
    let _this = this;
    if (_this.sourceAttrList.length == 0) {
      _this.sourceAttrList = _this.attrList.map(e => {
        if (e.remark) {
          let srcReg = /src=['"]?([^'"]*)['"]?/i; // 匹配图片中的src
          let arr = e.remark.match(srcReg);
          if (arr.length && arr[1]) {
            e.imgUrl = arr[1];
          }
          if (e.remark.indexOf('style="object-fit:none;') == -1) {
            e.remark = e.remark.replace(/style="/, 'style="object-fit:none;');
          }
        } else {
          e.imgUrl = '';
        }
        let cartArr = e.name.split('-');
        if (cartArr.length > 1) {
          let cart = cartArr[0];
          if (_this.keywords.indexOf(cart) == -1) {
            _this.keywords.push(cart);
          }
          e.cart = cart;
        }
        if (e.actualValue) {
          let codeArr = e.actualValue.split(':');
          if (codeArr.length > 1) {
            e.actualValueCode = codeArr[1];
          }
        }
        e.checked = false;
        return e;
      });
      // console.log(' _this.sourceAttrList', _this.sourceAttrList);
      _this.radioAttrList = _this.sourceAttrList.filter((e, i) => {
        return i < 10;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.confirm-ywxx {
  background-color: #ff0036;
  border-color: #ff0036;
  color: #fff;
  border-radius: 2px;
  font-size: 16px;
  margin-top: 10px;
  text-align: right;
}
.confirm-ywxx:hover {
  background-color: #ea0032;
  border-color: #ea0032;
}
.ywxx-box {
  .el-radio--mini {
    height: auto;
  }
  .remark {
    width: 140px;
    height: 140px;
    // min-height: 100px;
    overflow: hidden;
    position: relative;
    // border-radius: 4px;
    .zoom-in-img {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 28px;
      display: none;
    }
    .el-image {
      display: initial;
    }
  }
  .remark:hover .zoom-in-img {
    display: inline-block;
  }
  .remark:hover {
    // cursor: zoom-in;
  }

  .attr-text {
    color: #333333;
    padding-bottom: 5px;
    width: 120px;
    white-space: normal;
    font-size: 14px;
    line-height: 16px;
  }
  .attr-code {
    color: #777777;
    font-size: 12px;
  }
  .null-text {
    font-size: 18px;
    text-align: center;
    color: #c0c4cc;
    margin-top: 60px;
  }
}
.ywxx-dialog {
  .keywords {
    margin-right: 5px;
  }
  .keywords:hover {
    cursor: pointer;
    color: #ff0036;
  }
}
</style>

<style lang="scss">
.ywxx-box .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.ywxx-box {
  .Eattrrow {
    border: 1px solid #dcdfe6;
    padding: 3px;
    margin: 6px 6px;
    border-radius: 4px;
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      box-shadow: none;
    }
  }
  .Eattrrow.radio-eattrrow {
    border-color: #e60021;
  }
  .Eattrrow .el-radio-button__orig-radio:checked + .el-radio-button__inner::after {
    display: none;
  }

  .Eattrrow .el-radio-button,
  .Eattrrow .el-checkbox-button {
    margin: 0px;
  }
  .el-image__preview {
    cursor: zoom-in;
  }
  .radio-box {
    display: flex;
    padding: 5px 0;
  }
  .radio-img-box {
    flex: 1;
    width: 18px;
    height: 18px;
    border-radius: 3px 3px 3px 3px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    margin-right: 2px;
  }
  .radio-img {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.3s linear 0s; /*一般用 all 代替所有要过渡的属性名称*/
    -ms-transition: all 0.3s linear 0s; /*兼容IE10+*/
    -moz-transform: all 0.3s linear 0s; /*兼容 Firefox */
    -o-transition: all 0.3s linear 0s; /* 兼容Opera */
    -webkit-transform: all 0.3s linear 0s; /* 兼容Safari and Chrome */
  }
  .radio-img.show-radio-img {
    opacity: 1;
  }
}
.ywxx-box .el-radio-button--small .el-radio-button__inner {
  padding: 0px !important;
  text-align: left;
  border: none;
}

.ywxx-box .Eattrrow {
  float: none;
}
.ywxx-box .EattrMgroup {
  display: flex;
  flex-wrap: wrap;
}
.ywxx-dialog .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 10px;
}
.ywxx-dialog .el-dialog__header {
  padding-bottom: 0px;
  font-size: 18px;
}
.ywxx-dialog .el-image__error {
  display: none;
}
.ywxx-dialog .el-tabs__nav-scroll {
  padding-left: 10px;
}
.ywxx-search {
  // margin-bottom: 10px;
  width: 300px;
  margin-left: 20px;
}

.ywxx-dialog .el-tabs__item.is-active,
.ywxx-dialog .el-tabs__item:hover {
  color: #ff0036;
}
.ywxx-dialog .el-tabs__active-bar {
  background-color: #ff0036;
}
.ywxx-box .el-image-viewer__btn.el-image-viewer__close .el-icon-circle-close {
  color: #fff;
}
</style>

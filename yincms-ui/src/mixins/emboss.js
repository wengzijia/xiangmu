//  <attrSelect :visible.sync="embossVisible" v-if="embossVisible" :value.sync='formData.selectSelectValues[embossId]' :attrList="embossAttrList"></attrSelect>
import attrSelect from '@/components/price/attrSelect.vue';
import { endWith } from '@/utils/strUtil';
export default {
  components: { attrSelect },
  data() {
    return {
      embossVisible: false,
      embossAttrList: [],
      embossId: '',
      previewImgSrc: '',
      oldEmboss: ''
    };
  },
  watch: {
    embossVisible: function(newVal) {
      if (!newVal) {
        let _this = this;
        if (_this.formData.selectSelectValues) {
          let newEmboss = _this.formData.selectSelectValues[_this.embossId];
          if (_this.oldEmboss != newEmboss) {
            _this.selectSelect(newEmboss);
          }
        } else {
          let newEmboss = _this.selectdata[_this.embossId];
          if (newEmboss && _this.oldEmboss != newEmboss) {
            _this.getprice();
          }
        }
      }
    }
  },
  methods: {
    endWith,
    previewImg(item, selectSelectValues) {
      let _this = this;
      if (selectSelectValues[item.miniZtAttrGroup.id]) {
        let attr = item.attrList.find(e => e.groupId + '_' + e.id === selectSelectValues[item.miniZtAttrGroup.id]);
        let srcReg = /src=['"]?([^'"]*)['"]?/i; // 匹配图片中的src
        let arr = attr.remark.match(srcReg);
        if (arr.length && arr[1]) {
          _this.previewImgSrc = arr[1];
        } else {
          _this.previewImgSrc = '';
          return;
        }
        if (_this.$refs.previewImg) {
          _this.$refs.previewImg.clickHandler();
        }
      }
    },
    /**
     * 获取压纹的选中信息已及修改备注的样式
     * @param {} item
     */
    embossRemark: function(item, selectSelectValues) {
      let _this = this;
      // console.log('formData', _this.formData);
      if (selectSelectValues && selectSelectValues[item.miniZtAttrGroup.id]) {
        let attr = item.attrList.find(e => e.groupId + '_' + e.id === selectSelectValues[item.miniZtAttrGroup.id]);
        if (attr) {
          let remark = attr.remark.replace(/style="/, 'style="'); //object-fit:none;
          return remark;
        }
      }
      return '';
    },
    showEmboss(item) {
      let _this = this;
      _this.embossId = item.miniZtAttrGroup.id;
      if (_this.formData.selectSelectValues) {
        _this.oldEmboss = _this.formData.selectSelectValues[_this.embossId];
      } else if (_this.selectdata) {
        _this.oldEmboss = _this.selectdata[_this.embossId];
      }
      _this.embossAttrList = item.attrList;
      _this.embossVisible = true;
    }
  }
};

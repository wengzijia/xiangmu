<template>
  <div>
    <div class="priceLst hardList priceTop" style="padding-left:40px;">
      <div class="flex" style="align-items:center;padding-bottom:10px;">
        <span class="geH1Lt">包装组合</span>
        <el-row>
          <el-col> {{ activeCombination.comTitle }} </el-col>
        </el-row>
      </div>
      <div class="flex">
        <span class="geH1Lt">订购数量</span>
        <el-row :gutter="30">
          <el-col :span="16">
            <el-input placeholder="500" v-model="orderNumber" size="medium" @change="changeNumber(orderNumber)">
              <template slot="append">套</template>
            </el-input>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-form ref="form" v-model="form" label-width="110px">
      <el-row class="priceLst hardList" v-for="(item, index) in activeCombination.list" :key="index">
        <div v-for="(value, key) in item" :key="key">
          <h2 class="hardH2" v-if="key === 'title'">
            <el-checkbox v-model="form.checked" :label="dataArray[index].id" checked
              ><span class="geH1Lt">{{ value }}</span></el-checkbox
            >
          </h2>
          <el-form-item :label="key" v-else>
            <el-row class="LstRow">
              {{ value }}
            </el-row>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { replaceAll } from '@/utils/objectUtil';

export default {
  name: 'GoodsAttributes',
  props: {
    dataArray: {
      type: Array,
      default: function() {
        return [];
      }
    },
    form: {
      type: Object
    }
  },
  computed: {
    // 包装组合
    activeCombination() {
      let _list = this.dataArray;
      let _attr = { comTitle: '', list: [] };
      if (_list.length > 0) {
        for (let _index = 0; _index < _list.length; _index++) {
          let _content = _list[_index].content.split(';');
          // 键值分散
          let _attriObj = {};
          // 增加title
          _attriObj['title'] = _list[_index].title;
          for (let _el of _content) {
            if (_el) {
              let _e = _el.split(':');
              if (_el.length > 1) {
                // 判断是否是数字
                let _value = _e[1];
                if (_value.indexOf('_') !== -1) {
                  // 是否包含中文
                  if (/.*[\u4e00-\u9fa5]+.*$/.test(_value)) {
                    // 是否包含数字
                    if (/\d/.test(_value)) {
                      _attriObj[_e[0]] = replaceAll(_value, '_', '') + 'g';
                    } else {
                      _attriObj[_e[0]] = replaceAll(_value, '_', '');
                    }
                  } else {
                    _attriObj[_e[0]] = replaceAll(_value, '_', 'x') + 'mm';
                  }
                } else {
                  _attriObj[_e[0]] = _value;
                }
              }
            }
          }
          // 增加到数组中
          _attr.list.push(_attriObj);
          if (_index === _list.length - 1) {
            _attr.comTitle += _list[_index].title;
          } else {
            _attr.comTitle += _list[_index].title + '+';
          }
        }
      }
      console.log('_attr', _attr);
      return _attr;
    }
  },
  data() {
    return {
      // 订购数量 checked: [ids]
      // form: { orderNumber: '', checked: [] }
      orderNumber: ''
    };
  },
  methods: {
    ...{ replaceAll },
    // 改变数量
    changeNumber(number) {
      // 数量在 500 到 1 000 000 之间
      // debugger;
      if (number < 500) {
        this.orderNumber = 500;
      }
      if (number > 1000000) {
        this.orderNumber = 1000000;
      }
      this.form.orderNumber = this.orderNumber;
      console.log('this.form', this.form);
    }
  }
};
</script>
<style>
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #e60021;
  border-color: #e60021;
}
.el-checkbox__input.is-focus,
.el-checkbox__input.is-focus .el-checkbox__inner,
.el-checkbox__input:hover .el-checkbox__inner {
  border-color: #e60021;
}
</style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/attr.css" />
<style scoped src="@/static/mulindex/css/shop.css" />

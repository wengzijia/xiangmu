<template>
  <div class="myStyle pack-params-main">
    <div class="pack-params-box">
      <div style="font-weight: 500;color: #000000;font-size: 17px;">
        <!-- {{ designGoods.boxName }} -->
      </div>
      <div v-for="(item, index) in goodsAttr" :key="index" style="margin-bottom:5px;">
        <div v-if="item[0] == '部件'" style="font-weight: 500;color: #000000;font-size: 17px;line-height:22px;padding-top: 5px;">{{ item[0] }}:{{ item[1] }}</div>
        <div v-else style="display: flex;font-size: 15px;line-height:22px;margin-bottom: 2px;">
          <div style="color: #AAAAAA;flex: .4;">
            {{ item[0] }}
          </div>
          <div style="color:#333333;flex: .6;">
            {{ item[1] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    designGoods: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      goodsAttr: [],
      goodsAttr2: '',
      // designGoods: {}
    };
  },
  created() {
    let _this = this;
    let designGoods = _this.designGoods
    if (designGoods) {
      if (designGoods.goodsId != 1616 && designGoods.goodsId != 1617 && designGoods.goodsId != 1619 && designGoods.goodsId != 1620) {
        _this.goodsAttr = designGoods.goodsAttr
          .split(';')
          .map(e => {
            let arr = e.split(':');
            if (arr[0] && arr[1] && arr[0].indexOf('尺寸') != -1) {
              arr[1] = arr[1].replaceAll('_', 'x') + 'mm';
            }
            return arr;
          })
          .filter(e => e.length > 1);
      } else {
        let arr = designGoods.goodsAttr.split('|#|').map(e => {
          return e
            .split(';')
            .map(e => {
              let arr = e.split(':');
              if (arr[0] && arr[1] && arr[0].indexOf('尺寸') != -1) {
                arr[1] = arr[1].replaceAll('_', 'x') + 'mm';
              }
              return arr;
            })
            .filter(e => e.length > 1);
        });
        arr.forEach(e => {
          _this.goodsAttr.push(...e);
        });
        // console.log('arr',arr)
      }
    }
  }
};
</script>

<style>
.myStyle.pack-params-main {
  /* min-height: 100vh; */
  background: #f5f7fe;
  box-sizing: border-box;
  /* padding: 18px; */
}
.myStyle .pack-params-box {
  background: #fff;
  padding: 14px;
}
</style>

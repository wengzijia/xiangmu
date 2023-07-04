<!-- fengjianbo -->
<template>
  <div style="background-color: #e5c7a1; padding-bottom: 85px">
    <div class="InbannerBox">
      <div id="imageShow" :style="'height:842px;background: url(' + bannerImg + ') no-repeat center;'"></div>
    </div>
    <div class="comBox">
      <div class="disposable-box" v-for="item in carouselList" :key="item.url">
        <div class="disposable-imgbox" @click="go(item.cateId, item.subCateId, item.egg ? true : false, item.url)"><img :src="item.url" alt="" srcset="" /></div>
        <div class="disposablebox">
          <div>{{ item.text }}</div>
          <button @click="go(item.cateId, item.subCateId, item.egg ? item.egg : '')">立即定制</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ironInfoList from '@/utils/ironData';
import { addFrom } from '@/api/home/homeApi';

export default {
  // components: { Brick },
  data() {
    return {
      top: 0,
      value: true,
      goodsName: '',
      totalCount: 0,
      bannerImg: require('../../static/disposable/index/餐饮专题_02.jpg'),
      titleImg: require('../../static/ironActivity/index/titleBg.png'),
      pageNumber: 1,
      pageSize: 10,
      h5icon: 1,
      CountInfo: [],
      listFlipOrderList: [],
      listOrder: [],
      carouselList: [
        {
          url: require('../../static/disposable/index/餐饮专题_07.jpg'),
          text: '果切/沙拉盒',
          cateId: 86,
          subCateId: 87
        },
        {
          url: require('../../static/disposable/index/餐饮专题_05.jpg'),
          text: '水果包装盒',
          cateId: 86,
          subCateId: 88
        },
        {
          url: require('../../static/disposable/index/餐饮专题_11.jpg'),
          text: '鸡蛋盒',
          cateId: 86,
          subCateId: 88,
          egg: true
        },
        {
          url: require('../../static/disposable/index/餐饮专题_12.jpg'),
          text: '饮品杯',
          cateId: 81,
          subCateId: 82
        },
        {
          url: require('../../static/disposable/index/餐饮专题_15.jpg'),
          text: '生鲜熟食托盘',
          cateId: 121,
          subCateId: 89
        },
        {
          url: require('../../static/disposable/index/餐饮专题_16.jpg'),
          text: '定制手提袋',
          cateId: 7,
          subCateId: 44
        },
        {
          url: require('../../static/disposable/index/餐饮专题_19.jpg'),
          text: '纸杯',
          cateId: 11,
          subCateId: 51
        },
        {
          url: require('../../static/disposable/index/餐饮专题_20.jpg'),
          text: '固定尺寸手提袋',
          cateId: 7,
          subCateId: 55
        },
        {
          url: require('../../static/disposable/index/餐饮专题_23.jpg'),
          text: '纸碗',
          cateId: 90,
          subCateId: 120
        }
      ],
      ironInfoList: ironInfoList
    };
  },
  // 方法
  methods: {
    go(tcateId, tsubCateId, egg, imgurl) {
      let _this = this;
      // await sessionStorage.setItem('size', _this.goodsInfo.size);
      // sessionStorage.setItem('img', imgurl);
      let categoryUrl = '';
      if (egg) {
        categoryUrl = _this.$router.resolve({ name: 'priceIndex', query: { cateId: tcateId, subCateId: tsubCateId, disposable: true, egg: true } });
      } else if (tcateId == 81 && tsubCateId == 82) {
        categoryUrl = _this.$router.resolve({ path: '/price/explainIndex', query: { cateId: tcateId, subCateId: tsubCateId, disposable: true } });
      } else {
        categoryUrl = _this.$router.resolve({ name: 'priceIndex', query: { cateId: tcateId, subCateId: tsubCateId, disposable: true } });
      }
      window.open(categoryUrl.href, '_blank');
    },
    addFrom() {
      var from = this.$route.query.from ? this.$route.query.from : '';
      var data = {
        data: from,
        language: 'zh-cn'
      };
      addFrom(data)
        .then(res => {
          console.log(999);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  // 初始化组件事件,具体请看vue的生命周期
  created() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建 vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      //判断是否是刷新   其他页面跳转需要调用添加
      console.log('from.path', from.path);
      if (from.path != '/') {
        vm.addFrom();
      }
    });
  }
};
</script>

<style scoped>
.comBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.disposable-box {
  width: 606px;
  height: 460px;
  background: rgb(175, 165, 165);
  margin-top: 30px;
}
.disposable-imgbox {
  cursor: pointer;
  width: 100%;
  height: 370px;
}
.disposable-imgbox img {
  width: 606px;
  height: 370px;
}
.disposablebox {
  width: 100%;
  height: 90px;
  background-color: #fff;
  box-sizing: border-box;
  font-size: 20px;
  padding: 30px 16px;
  display: flex;
  justify-content: space-between;
}
.disposablebox button {
  cursor: pointer;
  outline: none;
  border: none;
  width: 134px;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  background-color: #ff0036;
  color: #fff;
}
.brickBox {
  /* border: 1px solid red; */
  padding-bottom: 115px;
}
.brickContenBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.brickContenBox > div {
  margin-bottom: 14px;
}
.ironTitle {
  width: 100%;
  height: 102px;
  line-height: 114px;
  font-size: 28px;
  text-align: center;
  color: #fff;
  margin: 30px 0;
}
</style>
<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/mulindex/css/index.css" />

<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/layui/dist/css/layui.css">-->
<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/css/fonts.css?v={$timestamp}">-->
<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/css/public.css" media="all">-->
<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/css/index.css" media="all">-->

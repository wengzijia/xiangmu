<!-- fengjianbo -->
<template>
  <div style="background-color: #8f1a25;padding-bottom:85px;">
    <div class="InbannerBox">
      <div id="imageShow" :style="'height:784px;background: url(' + bannerImg + ') no-repeat center;'"></div>
    </div>
    <div class="comBox">
      <div v-for="(item, index) in ironInfoList" :key="index" class="brickBox">
        <div class="ironTitle" :style="'background: url(' + titleImg + ') no-repeat center;'">{{ item.title }}</div>
        <div class="brickContenBox"><Brick v-for="(item2, index2) in item.list" :key="index2" :goodsInfo="item2"></Brick></div>
      </div>
    </div>
  </div>
</template>

<script>
import { listFlipOrder } from '@/api/order/supplierOrdersApi';
import { updateName } from '@/api/order/orderApi';
import { getCount, listOrder, addFrom } from '@/api/home/homeApi';
import { strEquals } from '@/utils/strUtil';

import ironInfoList from '@/utils/ironData';
import Brick from '@/components/brick/brick';
import store from '@/store';
export default {
  components: { Brick },
  data() {
    return {
      top: 0,
      value: true,
      goodsName: '',
      totalCount: 0,
      bannerImg: require('../../static/ironActivity/index/banner.jpg'),
      titleImg: require('../../static/ironActivity/index/titleBg.png'),
      pageNumber: 1,
      pageSize: 10,
      h5icon: 1,
      CountInfo: [],
      listFlipOrderList: [],
      listOrder: [],
      carouselList: [require('../../static/mulindex/img/index/banner00.jpg'), require('../../static/mulindex/img/index/banner0.jpg'), require('../../static/mulindex/img/index/bnner02.jpg')],
      ironInfoList: ironInfoList
    };
  },
  // 方法
  methods: {
    getCount() {
      getCount()
        .then(res => {
          if (res.success) {
            this.$set(this, 'CountInfo', res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    listOrders() {
      listOrder()
        .then(res => {
          if (res.success) {
            this.$set(this, 'listOrder', res.data);
            var arr = this.listOrder;
            var _this = this;
            setInterval(function() {
              _this.top = _this.top - 0.1;
              if (_this.top <= -34) {
                _this.top = 0;
                var arr1 = arr[0];
                arr.splice(0, 1);
                arr.push(arr1);
                _this.listOrder = arr;
              }
            }, 5);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    },
    listFlipOrder() {
      var data = {
        goodsName: this.goodsName,
        language: 'zh-cn',
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };
      listFlipOrder(data)
        .then(res => {
          this.$set(this, 'listFlipOrderList', res.data);
          this.totalCount = res.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //自定义名字
    customLabel(id) {
      this.$prompt('', '自定义标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          var data = {
            customName: value,
            orderGoodsId: id
          };
          updateName(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: '添加成功'
              });
              this.listFlipOrder();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },

    //搜索
    searchClick() {
      this.pageNumber = 1;
      this.pageSize = 10;
      this.listFlipOrder();
    },
    //分页
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.listFlipOrder();
    },
    //重新报价
    newPrice(cateId, subCateId) {
      var url = '';
      if (strEquals(cateId, '1')) {
        if (strEquals(subCateId, '23')) {
          url = '/price/specialBoxList?cateId=' + cateId + '&subCateId=' + subCateId;
        } else if (strEquals(subCateId, '24')) {
          url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
        } else {
          url = '/price/cartIndex?cateId=' + cateId + '&subCateId=' + subCateId;
        }
      } else if (strEquals(cateId, '2')) {
        if (strEquals(subCateId, '29') || strEquals(subCateId, '30')) {
          url = '/price/specialBoxList?cateId=' + cateId + '&subCateId=' + subCateId;
        } else if (strEquals(subCateId, '31') || strEquals(subCateId, '32')) {
          url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
        } else {
          url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
        }
      } else if (strEquals(cateId, '9')) {
        url = '/price/explainIndex?cateId=' + cateId + '&subCateId=' + subCateId;
      } else if (strEquals(cateId, '8') && strEquals(subCateId, '61')) {
        url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
      } else if (strEquals(cateId, '13')) {
        url = '/price/explainIndex?cateId=' + cateId + '&subCateId=' + subCateId;
      } else if (strEquals(cateId, '70')) {
        url = '/price/cartonIndex?cateId=' + cateId + '&subCateId=' + subCateId;
      } else {
        if (strEquals(subCateId, '82')) {
          url = '/price/explainIndex?cateId=' + cateId + '&subCateId=' + subCateId;
        } else {
          url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
        }
      }
      this.$router.push({ path: url });
    }
  },
  // 初始化组件事件,具体请看vue的生命周期
  created() {
    this.getCount();
    if (store.getters.userInfo != null) {
      this.listFlipOrder();
    } else {
      this.listOrders();
    }
  },
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

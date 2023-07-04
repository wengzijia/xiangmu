<template>
  <div>
    <div class="comBox">
      <div class="brickBox">
        <div class="ironTitle">畅销爆品从包装设计开始</div>
        <div class="brickContenBox">
          <div class="brick" v-for="(item, index) in ironInfoList" :key="index">
            <div class="brick-img-box">
              <h1>{{ item.title }}</h1>
              <!-- <p>{{item.description}}</p> -->
              <div class="packingtxt" v-html="item.description"></div>
              <div class="box-info" style="margin-top: 60px">
                <div class="price-box">
                  <div class="price"><span>￥</span>{{ item.price }}<span>元</span></div>
                </div>
              </div>
              <div class="packingtxt" v-html="item.introduce"></div>
            </div>
            <p class="packingbtn" @click="$router.push('/PackagingDemand?orderType=' + item.orderType)"><button>立即设计</button></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listFlipOrder } from '@/api/order/supplierOrdersApi';
import { updateName } from '@/api/order/orderApi';
import { getCount, listOrder, addFrom } from '@/api/home/homeApi';
import { strEquals } from '@/utils/strUtil';

import { listAll } from '@/api/goods/miniGoodsApi';
import store from '@/store';
export default {
  name: 'packing',
  components: {},
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
      ironInfoList: [
        {
          picUrl: '人工智能设计',
          price: '9.90',
          size: '190*52',
          subCateId: 123,
          specList: ['一斤大月饼']
        },
        {
          picUrl: '人工智能设计',
          price: '15.90',
          size: '230*65',
          subCateId: 123,
          specList: ['2斤（1000g）大饼', '4粒装小60-80g月饼', '4粒装小60-80g月饼']
        },
        {
          picUrl: '人工智能设计',
          price: '19.90',
          size: '280*65',
          subCateId: 123,
          specList: ['3斤（1500g）大饼', '4粒装小60-80g月饼', '4粒装大80-120g月饼']
        }
      ]
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
    }
  },
  // 初始化组件事件,具体请看vue的生命周期
  created() {
    listAll().then(res => {
      console.log(res.data);
      this.ironInfoList = res.data;
    });
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
  margin: 30px 0;
}
.packingtxt {
  line-height: 25px;
  margin-top: 30px;
  font-size: 16px;
}
.brick {
  width: 390px;
  height: 500px;
  background-color: #fff;
  box-sizing: border-box;
}
.brick-img-box {
  margin: 30px auto;
  width: 80%;
  height: 350px;
  text-align: center;
  box-sizing: border-box;
}
.brick-img-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.box-info {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 15px;
}
.price-box {
  display: flex;
  justify-content: space-between;
  line-height: 32px;
}
.price {
  color: #ff0036;
  font-size: 32px;
  font-weight: bold;
  margin: auto;
}
.price span {
  font-size: 14px;
}
.packingbtn {
  text-align: center;
}
.brick .packingbtn button {
  border: none;
  outline: none;
  width: 200px;
  height: 40px;
  color: #fff;
  background: url('../../static/upload/images/packing.png') no-repeat;
  border-radius: 5px;
  font-size: 15px;
  line-height: 32px;
}
.price-box button:hover {
  background-color: #ee0030;
}
.info > div {
  line-height: 25px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
}
.info > div:hover {
  cursor: default;
}
.info > div::before {
  content: '·';
  font-size: 15px;
  font-weight: 700;
  margin-right: 6px;
}
.brick-img-box:hover {
  cursor: pointer;
}
button:hover {
  cursor: pointer;
}
</style>
<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/mulindex/css/index.css" />

<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/layui/dist/css/layui.css">-->
<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/css/fonts.css?v={$timestamp}">-->
<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/css/public.css" media="all">-->
<!--<link rel="stylesheet" href="STATIC_PATH/mulindex/css/index.css" media="all">-->

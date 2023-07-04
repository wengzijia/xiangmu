<template>
  <div class="brick">
    <div class="brick-img-box" @click="go">
      <img :src="goodsInfo.picUrl" alt="" />
    </div>
    <div class="box-info">
      <div class="price-box">
        <div class="price">
          ￥<span>{{ goodsInfo.price }}</span>
        </div>
        <button @click="go">立即购买</button>
      </div>
      <div class="info">
        <div v-for="(item, index) in goodsInfo.specList" :key="index" :title="item">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsInfo: {
      type: Object,
      default: () => {
        return {
          picUrl: '',
          price: '',
          size: '',
          subCateId: '',
          specList: []
        };
      }
    }
  },
  methods: {
    async go() {
      let _this = this;
      // http://localhost:8000/price/index?cateId=122&subCateId=123
      await sessionStorage.setItem('size', _this.goodsInfo.size);
      await sessionStorage.setItem('img', _this.goodsInfo.picUrl);
      let categoryUrl = _this.$router.resolve({ name: 'priceIndex', query: { cateId: 122, subCateId: _this.goodsInfo.subCateId } });
      window.open(categoryUrl.href, '_blank');
    }
  }
};
</script>

<style scoped>
.brick {
  width: 300px;
  height: 430px;
  background-color: #fff;
  box-sizing: border-box;
}
.brick-img-box {
  width: 300px;
  height: 300px;
  /* background-color: #e8e8e8; */
  font-size: 0;
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
  font-size: 14px;
}
.price span {
  font-size: 20px;
}

.price-box button {
  border: none;
  outline: none;
  width: 96px;
  height: 32px;
  color: #fff;
  background-color: #ff0036;
  border-radius: 16px;
  font-size: 16px;
  line-height: 30px;
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

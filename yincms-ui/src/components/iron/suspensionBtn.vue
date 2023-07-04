<template>
  <div class="suspensionBtn" @click="go">
    <img src="../../static/ironActivity/index/suspension.png" alt="" />
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
      let categoryUrl = _this.$router.resolve({ name: 'ironActivity' });
      window.open(categoryUrl.href, '_blank');
    }
  }
};
</script>

<style scoped>
.suspensionBtn {
  width: 130px;
  position: fixed;
  bottom: 260px;
  right: 0px;

  border-radius: 50%;
  z-index: 99999;
}
.suspensionBtn:hover {
  cursor: pointer;
}
.suspensionBtn img {
  width: 100%;
  object-fit: contain;
}
</style>

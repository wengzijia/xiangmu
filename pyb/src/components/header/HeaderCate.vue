<!-- fengjianbo -->
<template>
  <div class="menuNav">
    <div class="flex comBox navWaper">
      <ul class="flex menuUl">
        <li v-for="(item, index) in cateNavs" :key="index" :class="item.data.id + '' === cateId ? 'cur' : ''">
          <router-link :to="getUrl(item)" :class="item.data.id + '' === cateId ? 'menuLink' : ''">
            {{ item.data.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import { strEquals } from '@/utils/strUtil';
export default {
  name: 'HeaderUser',
  props: {
    cateType: String,
    cateId: String,
    subCateId: String
  },
  data() {
    return {
      cateNavs: []
    };
  },
  created() {
    this.getCateNavs();
    console.log("cateType",this.cateType);
    console.log("this.cateNavs",this.cateNavs);
  },
  methods: {
    getUrl(cateItem) {
      let url = '';
      if (this.cateType === 'cate') {
        if (strEquals(cateItem.data.id, '9')) {
          url = '/price/explainIndex';
        } else if (strEquals(cateItem.data.id, '2')) {
          url = '/price/index';
        } else if (strEquals(cateItem.data.id, '1')) {
          url = '/price/cartIndex';
        } else if (strEquals(cateItem.data.id, '13')) {
          url = '/price/explainIndex';
        } else if (strEquals(cateItem.data.id, '3')) {
          url = '/price/explainIndex';
        } else {
          url = '/price/index';
        }
      } else if (this.cateType === 'proof') {
        url = '/proof/index';
      } else {
        url = '/cutter/index';
      }
      url += '?cateId=' + cateItem.data.id;
      if (cateItem.children.length > 0) {
        url += '&subCateId=' + cateItem.children[0].data.id;
      }
      return url;
    },
    getCateNavs() {
      const _this = this;
      if (_this.cateType === 'cate') {
        if (store.getters.priceCateNavs === null || store.getters.priceCateNavs.length === 0) {
          store.dispatch('GetPriceCateNavs').then(() => {
            this.cateNavs = store.getters.priceCateNavs;
            console.log("  this.cateNavs",  this.cateNavs);
          });
        } else {
          this.cateNavs = store.getters.priceCateNavs;
        }
      } else if (_this.cateType === 'proof') {
        if (store.getters.proofCateNavs === null || store.getters.proofCateNavs.length === 0) {
          store.dispatch('GetProofCateNavs').then(() => {
            this.cateNavs = store.getters.proofCateNavs;
          });
        } else {
          this.cateNavs = store.getters.proofCateNavs;
        }
      } else if (_this.cateType === 'goodsCate') {
        if (store.getters.cutterCateNavs === null || store.getters.cutterCateNavs.length === 0) {
          store.dispatch('GetCutterCateNavs').then(() => {
            this.cateNavs = store.getters.cutterCateNavs;
          });
        } else {
          this.cateNavs = store.getters.cutterCateNavs;
        }
      }
    }
  }
};
</script>

<style scoped>
.menuUl .cur {
  background-color: #c41b20;
}
</style>

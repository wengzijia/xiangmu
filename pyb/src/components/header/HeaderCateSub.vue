<template>
  <div class="menuSubox">
    <div class="comBox">
      <div>
        <ul class="flex menuSubUl">
          <template v-for="item in cateNavs">
            <template v-if="strEquals(cateId, item.data.id)">
              <li v-for="(subItem, index) in item.children" :key="index" :class="subItem.data.id + '' === subCateId ? 'curr' : ''">
                <router-link :to="toUrl(cateId, subItem.data.id)">
                  <p class="kaIcn kaImg1"><img :src="'/' + subItem.data.coverPath" /></p>
                  <p>{{ subItem.data.name }}</p>
                </router-link>
              </li>
            </template>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { strEquals } from '@/utils/strUtil';
import store from '@/store';
export default {
  name: 'HeaderCateSub',
  props: {
    cateId: String,
    bindType: {
      type: String,
      default: 'cate'
    },
    subCateId: String
  },
  data() {
    return {
      subCateList: [],
      cateNavs: []
    };
  },
  created() {
    this.getSubCateList();
  },
  watch: {
    cateId: {
      handler() {
        this.getSubCateList();
      }
    }
  },
  methods: {
    ...{ strEquals },
    toUrl(cateId, subCateId) {
      let url = '';
      if (this.bindType === 'cate') {
        if (strEquals(cateId, '1')) {
          if (strEquals(subCateId, '23')) {
            url = '/price/specialBoxList?cateId=' + cateId + '&subCateId=' + subCateId;
          } else if (strEquals(subCateId, '25')) {
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
        } else {
          url = '/price/index?cateId=' + cateId + '&subCateId=' + subCateId;
        }
      } else if (this.bindType === 'proof') {
        url = '/proof/index?cateId=' + cateId + '&subCateId=' + subCateId;
      } else {
        url = '/cutter/index?cateId=' + cateId + '&subCateId=' + subCateId;
      }

      return url;
      // this.$emit('toPage', { cateId: cateId, subCateId: subCateId });
      // this.$emit('update:subCateId', '');
      // this.$router.push({ path: this.$route.path + '?cateId=' + cateId + '&subCateId=' + subCateId });
    },
    getSubCateList() {
      const _this = this;
      if (_this.bindType === 'cate') {
        if (store.getters.priceCateNavs === null || store.getters.priceCateNavs.length === 0) {
          store.dispatch('GetPriceCateNavs').then(() => {
            this.cateNavs = store.getters.priceCateNavs;
          });
        } else {
          this.cateNavs = store.getters.priceCateNavs;
        }
      } else if (_this.bindType === 'proof') {
        if (store.getters.proofCateNavs === null || store.getters.proofCateNavs.length === 0) {
          store.dispatch('GetProofCateNavs').then(() => {
            this.cateNavs = store.getters.proofCateNavs;
          });
        } else {
          this.cateNavs = store.getters.proofCateNavs;
        }
      } else if (_this.bindType === 'goodsCate') {
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
.menuSubUl li a {
  position: absolute;
  width: 100%;
}
</style>

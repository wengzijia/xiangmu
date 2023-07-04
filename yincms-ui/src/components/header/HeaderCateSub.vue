<template>
  <div class="menuSubox" v-if="!isOriginal" v-show="$route.query.cateId != '122'" :class="$route.query.disposable ? 'navhide' : ''">
    <div class="comBox">
      <div>
        <ul class="flex menuSubUl" v-if="cateNavs.length">
          <template v-if="$route.path.indexOf('/price') === -1">
            <template v-for="item in cateNavs">
              <template v-if="strEquals(cateId, item.data.id) && item.children">
                <li v-for="(subItem, index) in item.children" :key="index" :class="subItem.data.id + '' === subCateId ? 'curr' : ''" @click="reportCate(subItem.data.id)">
                  <router-link :to="toUrl(cateId, subItem.data.id)" >
                    <p class="kaIcn kaImg1"><img :src="'/' + subItem.data.coverPath" /></p>
                    <p>{{ subItem.data.name }}</p>
                  </router-link>
                </li>
              </template>
            </template>
          </template>
          <template v-else>
            <template v-for="item in cateNavs[$store.getters.mouseParentsId > -1 ? $store.getters.mouseParentsId : parentsId]['children']">
              <template v-if="strEquals($store.getters.mouseTWOParentsId > -1 ? $store.getters.mouseTWOParentsId : cateId, item.data.id)">
                <li v-for="(subItem, index) in item.children" :key="index" :class="subItem.data.id + '' === subCateId ? 'curr' : ''" @click="reportCate(subItem.data.id)">
                  <router-link :to="toUrl($store.getters.mouseTWOParentsId > -1 ? $store.getters.mouseTWOParentsId : cateId, subItem.data.id)" >
                    <p class="kaIcn kaImg1"><img :src="'/' + subItem.data.coverPath" /></p>
                    <p>{{ subItem.data.name }}</p>
                  </router-link>
                </li>
              </template>
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
      cateNavs: [],
      isOriginal: false,
      parentsId: 0
    };
  },
  created() {
    var path = this.$route.path;
    this.isOriginal = false;
    if (path == '/proof/originalIndex') {
      this.isOriginal = true;
    }
    // if (this.$route.query.cateId == 3 && this.$route.query.subCateId == 128) {
    //   store.dispatch('GetPriceCateNavs').then(() => {
    //     this.$set(this,'cateNavs',store.getters.priceCateNavs)
    //     this.setParentsId();
    //   });
    // } else {
    this.getSubCateList();
    this.setParentsId();
    this.reportCate(this.subCateId);
    // }
  },
  watch: {
    cateId: {
      handler() {
        this.getSubCateList();
        var path = this.$route.path;
        this.isOriginal = false;
        if (path == '/proof/originalIndex') {
          this.isOriginal = true;
        }
        this.setParentsId();
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
        } else if (strEquals(subCateId, '128') || strEquals(subCateId, '129') || strEquals(subCateId, '130') || strEquals(subCateId, '137') || strEquals(subCateId, '138')) {
          url = '/price/HardcoverQuotation?cateId=' + cateId + '&subCateId=' + subCateId;
        }
        // else if (strEquals(subCateId, '130')) {
        //   url = '/price/HardcoverQuotation2?cateId=' + cateId + '&subCateId=' + subCateId;
        // }
        else if (strEquals(cateId, '9')) {
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
      } else if (this.bindType === 'proof') {
        if (strEquals(subCateId, '128') || strEquals(subCateId, '137') || strEquals(subCateId, '138') || strEquals(subCateId, '129')) {
          url = '/proof/HardcoverQuotation?cateId=' + cateId + '&subCateId=' + subCateId;
        } else {
          url = '/proof/index?cateId=' + cateId + '&subCateId=' + subCateId;
        }
      } else {
        url = '/cutter/index?cateId=' + cateId + '&subCateId=' + subCateId;
      }

      return url;
      // this.$emit('toPage', { cateId: cateId, subCateId: subCateId });
      // this.$emit('update:subCateId', '');
      // this.$router.push({ path: this.$route.path + '?cateId=' + cateId + '&subCateId=' + subCateId });
    },
    reportCate(subCateId) {
      // 用户行为记录
      console.log('subCateId', subCateId);
      if (this.bindType === 'cate'){
        this.$report({
          channel: 111000 + Number(subCateId),
          actionId: 1
        });
      } else if (this.bindType === 'proof') {
        this.$report({
          channel: 121000 + Number(subCateId),
          actionId: 1
        });
      } else {
        this.$report({
          channel: 131000 + Number(subCateId),
          actionId: 1
        });
      }
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
    },
    //获取祖宗分类id
    setParentsId() {
      if (this.$route.path.indexOf('/price') > -1) {
        for (var i = 0; i < this.cateNavs.length; i++) {
          for (var n = 0; n < this.cateNavs[i].children.length; n++) {
            if (this.cateNavs[i].children[n].data.id == this.cateId) {
              this.parentsId = i;
              store.commit('SET_PARENTSID', i);
            }
          }
        }
      }
      // console.log('parentsId2', this.parentsId);
    }
  }
};
</script>

<style scoped></style>

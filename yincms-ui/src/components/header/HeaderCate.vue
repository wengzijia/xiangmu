<!-- fengjianbo -->
<template>
  <div v-show="$route.query.cateId != '122'" :class="$route.query.disposable ? 'navhide' : ''">
    <!--    <div class="menuNav menuNavTop" v-if="$route.path.indexOf('/price') > -1">-->
    <!--      <div class="flex comBox navWaper">-->
    <!--        <ul class="flex menuUl">-->
    <!--          <li class="cur"><a>商品类包装</a></li>-->
    <!--          <li><a>餐饮类包装</a></li>-->
    <!--          <li><a>生鲜类包装</a></li>-->
    <!--          <li><a>物流类包装</a></li>-->
    <!--          <li><a>其他类包装</a></li>-->
    <!--        </ul>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="menuNav menuNavTop" v-if="$route.path.indexOf('/price') > -1">
      <div class="flex comBox navWaper">
        <ul class="flex menuUl" style="background-color: #111111;">
          <li
            v-for="(item, index) in cateNavs"
            :key="index"
            :class="$store.getters.mouseParentsId > -1 ? (index + '' == $store.getters.mouseParentsId ? 'cur' : '') : index + '' == parentsId ? 'cur' : ''"
            @mouseover="mouseOver(index)"
            style="margin-right:40px"
          >
            <a style="width: 110px;">{{ item.data.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="menuNav menuNavBot">
      <div class="flex comBox navWaper">
        <ul class="flex menuUl" v-if="$route.path.indexOf('/price') === -1">
          <li v-for="(item, index) in cateNavs" :key="index" :class="item.data.id + '' === cateId && !isOriginal ? 'cur' : ''" style="background-color: #292929;">
            <router-link :to="getUrl(item)" :class="item.data.id + '' === cateId && !isOriginal ? 'menuLink' : ''">
              {{ item.data.name }}
            </router-link>
          </li>
          <li v-if="isOriginal || isProof">
            <a href="/proof/originalIndex" :class="isOriginal ? 'cur' : ''">
              原创设计
            </a>
          </li>
        </ul>
        <ul class="flex menuUl" v-else>
          <template v-if="cateNavs.length">
            <li
              v-for="(item, index) in cateNavs[$store.getters.mouseParentsId > -1 ? $store.getters.mouseParentsId : parentsId].children"
              :key="index"
              :class="$store.getters.mouseTWOParentsId > -1 ? (item.data.id + '' == $store.getters.mouseTWOParentsId ? 'cur' : '') : item.data.id + '' === cateId ? 'cur' : ''"
              @mouseover="mouseOverTwo(item.data.id)"
              style="background-color: #292929;margin-top: 2px;"
              v-show="item.data.id != 122"
            >
              <router-link
                :to="getUrl(item)"
                :class="
                  $store.getters.mouseTWOParentsId > -1
                    ? item.data.id + '' == $store.getters.mouseTWOParentsId
                      ? 'menuLink'
                      : item.data.id + '' === cateId
                      ? 'curr-router-link-exact-active'
                      : ''
                    : item.data.id + '' === cateId
                    ? 'menuLink curr-router-link-exact-active'
                    : ''
                "
              >
                {{ item.data.name }}</router-link
              >
            </li>
          </template>
        </ul>
      </div>
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
      cateNavs: [],
      isOriginal: false,
      isProof: false,
      mouseParentsIdS: 0,
      parentsId: 0
    };
  },
  created() {
    this.getCateNavs();
    var path = this.$route.path;
    this.isOriginal = false;
    if (path == '/proof/originalIndex') {
      this.isOriginal = true;
    } else if (path == '/proof/index') {
      this.isProof = true;
    }
    this.setParentsId();
  },
  watch: {
    $route() {
      var path = this.$route.path;
      this.isOriginal = false;
      if (path == '/proof/originalIndex') {
        this.isOriginal = true;
      } else if (path == '/proof/index') {
        this.isProof = true;
      }
      this.setParentsId();
    }
  },
  methods: {
    getUrl(cateItem) {
      let url = '';
      if (this.cateType === 'cate') {
        // else if (strEquals(cateItem.data.id, '3')) {
        //   url = '/price/explainIndex';
        // }
        if (strEquals(cateItem.data.id, '9')) {
          url = '/price/explainIndex';
        } else if (strEquals(cateItem.data.id, '2')) {
          url = '/price/index';
        } else if (strEquals(cateItem.data.id, '1')) {
          url = '/price/cartIndex';
        } else if (strEquals(cateItem.data.id, '13')) {
          url = '/price/explainIndex';
        } else if (strEquals(cateItem.data.id, '81')) {
          url = '/price/explainIndex';
        } else if (strEquals(cateItem.data.id, '70')) {
          url = '/price/cartonIndex';
        } else if (strEquals(cateItem.data.id, '3')) {
          url = '/price/HardcoverQuotation';
        } else {
          url = '/price/index';
        }
      } else if (this.cateType === 'proof') {
        if (strEquals(cateItem.data.id, '3')) {
          url = '/proof/HardcoverQuotation';
        } else {
          url = '/proof/index';
        }
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
    },
    //获取祖宗分类id
    setParentsId() {
      if (this.$route.path.indexOf('/price') > -1) {
        for (var i = 0; i < this.cateNavs.length; i++) {
          for (var n = 0; n < this.cateNavs[i].children.length; n++) {
            if (this.cateNavs[i].children[n].data.id == this.cateId) {
              this.parentsId = i;
            }
          }
        }
      }
    },
    mouseOver(index) {
      if (store.getters.mouseParentsId != index) {
        store.commit('SET_MOUSE_CATE_NAVS', index);
        store.commit('SET_MOUSETWO_CATE_NAVS', this.cateNavs[store.getters.mouseParentsId].children[0].data.id);
      }

      // store.commit('SET_MOUSE_CATE_NAVS', index);
      // if (index != this.parentsId) {
      //   //默认第一个展示
      //   store.commit('SET_MOUSETWO_CATE_NAVS', this.cateNavs[store.getters.mouseParentsId].children[0].data.id);
      // } else {
      //   store.commit('SET_MOUSETWO_CATE_NAVS', this.cateId);
      // }
    },
    mouseOverTwo(index) {
      store.commit('SET_MOUSETWO_CATE_NAVS', index);
    }
  }
};
</script>

<style scoped>
.menuUl .cur {
  background-color: #c41b20;
}
.menuUl .cur1 {
  color: #c41b20;
}
</style>

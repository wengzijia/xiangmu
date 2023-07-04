// fengjianbo
import router from './router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import { setDocumentTitle, domTitle, setKeywords } from '@/utils/domUtil';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { checkToken } from '@/api/users/userApi';
import store from '@/store';
NProgress.configure({ showSpinner: false }); // NProgress Configuration
const loginList = [
  'userIndex',
  'userEditprofile',
  'userEditpassword',
  'userBalance',
  'userDesignAddress',
  'userTemplateList',
  'userBonusExchange',
  'userBonusList',
  'userAddressList',
  'userDemandDetail',
  'userDemandList',
  'userInvoice',
  'orderdetail',
  'orderlist',
  'aptitude',
  'solutionGetPay',
  'cartIndex',
  'cartProof',
  'proofAdaptive',
  'CartIndexAdaptive',
  'cartCheckOrder',
  'cartCheckProof',
  'CartIndexPanel',
  'orderGetpay',
  'orderGetCylpay',
  'orderGetFile'
]; // 需要登录的url
function loginNext(to, from, next) {
  checkToken()
    .then(res => {
      if (res.code === '970007') {
        localStorage.removeItem(ACCESS_TOKEN);
        store.commit('SET_TOKEN', '');
        store.commit('SET_INFO', {});
        noLoginNext(to, from, next);
      } else {
        if (!store.getters.userInfo.id) {
          store.dispatch('GetUserInfo').then(() => {
            if (!store.getters.cartNum) {
              store.dispatch('CartCount').then(() => {
                noLoginNext(to, from, next);
              });
            } else {
              noLoginNext(to, from, next);
            }
          });
        } else {
          if (!store.getters.cartNum) {
            store.dispatch('CartCount').then(() => {
              noLoginNext(to, from, next);
            });
          } else {
            noLoginNext(to, from, next);//1234
          }
        }
      }
    })
    .catch(res => {
      next();
    });
}
function noLoginNext(to, from, next) {
  // 在免登录白名单，直接进入
  let priceList = ['priceIndex', 'cartPriceIndex', 'specialBoxList', 'priceExplainIndex'];
  let proofList = ['proofIndex'];
  let cutterList = ['cutterIndex', 'cutterCardNew', 'groupAttrInfo', 'cutterCardOld'];
  if (priceList.indexOf(to.name) !== -1) {
    if (store.getters.priceCateNavs.length === 0) {
      store.dispatch('GetPriceCateNavs').then(res => {
        next();
      });
    } else {
      next();
    }
  } else if (proofList.indexOf(to.name) !== -1) {
    if (store.getters.proofCateNavs.length === 0) {
      store.dispatch('GetProofCateNavs').then(res => {
        next();
      });
    } else {
      next();
    }
  } else if (cutterList.indexOf(to.name) !== -1) {
    if (store.getters.cutterCateNavs.length === 0) {
      store.dispatch('GetCutterCateNavs').then(res => {
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}
router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  console.log('to.meta.title',to);
  if (to.meta && to.meta.title) {
    setDocumentTitle(to.meta.title);
    setKeywords(to.meta.keywords, to.meta.description);
  } else {
    setDocumentTitle(`拼一版(www.pinyiban.com) - 做包装上拼一版`);
    setKeywords(
      '拼一版网,小彩印,包装盒,包装盒设计,坑盒,卡盒,胶片盒,瓦楞盒,手提袋,彩盒,精装盒,手工盒,铁罐,铁盒,纸罐,塑料盒,纸盒,塑料罐,免费刀模,刀模下载,彩盒打样,吸塑内托,珍珠棉内托，EVA内托，标签,吊牌,内托,说明书,小批量包装定制',
      '拼一版网（原小彩印 ） 是小批量包装定制、全品类包装印刷电商平台，包装盒定制，打样跟色，急速出货，超时免单，质量问题免单重印，1个起做，1秒报价，1键下单，刀模免费下载，包括化妆品盒、茶叶盒、食品盒、蛋糕盒、卡盒、坑盒、精装盒、纸盒、纸罐，铁盒，铁罐、塑料盒，塑料罐，手提袋、纸杯等。'
    );
  }
  if (loginList.includes(to.name)) {
    // 需要登录
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
      loginNext(to, from, next);
    }
  } else {
    if (to.name === 'login') {
      next();
    } else {
      if (localStorage.getItem(ACCESS_TOKEN)) {
        loginNext(to, from, next);
      } else {
        noLoginNext(to, from, next);
      }
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
// router.onError((error) => {
//   const pattern = /Loading chunk (\d)+ failed/g;
//   const isChunkLoadFailed = error.message.match(pattern);
//   const targetPath = router.history.pending.fullPath;
//   if (isChunkLoadFailed) {
//     router.replace(targetPath);
//   }
// });

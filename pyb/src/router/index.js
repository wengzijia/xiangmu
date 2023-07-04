import Vue from 'vue';
import VueRouter from 'vue-router';
import { constantRouterMap } from './router.config';
Vue.use(VueRouter);

const routes = constantRouterMap;

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes
});

export default router;

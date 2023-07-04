<template>
  <div class="helpbj">
    <div class="mainBx">
      <div class="comBox">
        <div class="helpBox">
          <!--左-->
          <el-aside width="252" class="helpLt">
            <h2 class="helpLtH2">帮助中心</h2>
            <el-menu :default-openeds="defarrt">
              <li v-for="(vo, index) in news" :key="index">
                <el-submenu :index="index + ''">
                  <template slot="title">
                    <div class="helpLtNav">
                      {{ vo.title }}
                    </div>
                  </template>
                  <el-menu-item-group>
                    <div class="helpLtMudv">
                      <el-menu-item v-for="(item, index) in vo.list" :key="index" index="index">
                        <router-link :class="id === item.id ? 'curr' : ''" :alt="item.title" :to="'/news/detail?id=' + item.id">{{ item.title }}</router-link>
                      </el-menu-item>
                    </div>
                  </el-menu-item-group>
                </el-submenu>
              </li>
            </el-menu>
          </el-aside>
          <!--右-->
          <el-main>
            <div class="helpRg">
              <h3 class="helpRgtile" v-html="detail.title"></h3>
              <div class="helpRgTxt" v-html="detail.content"></div>
            </div>
          </el-main>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getById, listByPids } from '@/api/news/newsApi';

export default {
  data() {
    return {
      id: 0,
      news: [
        {
          title: '联系我们',
          list: [
            {
              id: 97,
              title: '联系客服'
            }
          ]
        },
        {
          title: '文件规范要求',
          list: [
            {
              id: 169,
              title: '文件规范要求'
            }
          ]
        },
        {
          title: '质量检验标准',
          list: [
            {
              id: 63,
              title: '彩盒检验标准'
            }
          ]
        }
      ],
      detail: { title: '未查询到相关数据', content: '' },
      defarrt: ['0', '1', '2', '3', '4', '5', '6']
    };
  },
  methods: {
    getDesc() {
      getById({ id: this.id })
        .then(res => {
          if (res.data != null) {
            this.detail = res.data;
          } else {
            this.detail = { title: '未查询到相关数据', content: '' };
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    $route(to) {
      this.id = parseInt(this.$route.query.id);
    },
    id: {
      handler() {
        this.getDesc();
      }
    }
  },
  mounted() {
    this.id = parseInt(this.$route.query.id);
    // listByPids({ list: [1, 9, 14, 20, 64, 140] })
    //   .then(res => {
    //     console.log(res.data);
    //     this.news = res.data;
    //
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    this.getDesc();
  },
  created() {}
};
</script>
<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/index/css/new/help.css" />
<style>
.helpRgTxt img {
  max-width: 100%;
}
.helpbj .el-submenu__title,
.helpbj .el-menu-item {
  height: 40px;
  line-height: 40px;
  width: 252px;
}
.el-menu-item is-active .curr {
  background: #fff4f4;
  color: #e60021;
}
</style>

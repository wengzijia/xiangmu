<template>
  <!--菜单弹层-->
  <ul class="LookNavUl hide">
    <li v-for="(item, index) in categoryList" :key="index" @mouseover="selected(index)" :class="selectedParent(index)">
      <a :href="'/zbz/list?zbzCateId=' + item.data.id" class="LookNav_a"
        ><span>{{ item.data.title }}</span
        ><em class="el-icon-arrow-right"></em
      ></a>
      <div class="LookNavList">
        <div class="LookNavLbx">
          <i class="el-icon-caret-top LookIcon"></i>
          <ul v-for="(col, index) in item.childrenList" :key="index + 100">
            <li v-for="(category, index) in col" :key="index + 1000">
              <a :href="'/zbz/list?zbzCateId=' + item.data.id + '&zbzSubCateId=' + category.id"
                ><img :src="alifileUrl + category.coverPath" /><span class="texts">{{ category.title }}</span></a
              >
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
import { allCate } from '@/api/zbz/zbzNavApi';

export default {
  name: 'MultiLevelMenu',
  data() {
    return {
      categoryList: [],
      // 是否選中
      isSelected: 0,
      alifileUrl: 'http://alifile.xiaocaiyin.com/'
    };
  },
  created() {
    this.getNavList(0);
  },
  methods: {
    // 選中
    selected(index) {
      this.isSelected = index;
      // console.log(this.isSelected);
    },
    // 取消
    selectedParent(index) {
      if (index === this.isSelected) {
        return 'curr';
      }
      return ' ';
    },
    getNavList(id) {
      this.getCategory(id);
    },
    // 获取分类数据
    getCategory(id) {
      if (!id) {
        id = 0;
      }
      let param = {
        language: 'zh-cn',
        pid: id
      };
      allCate(param).then(res => {
        if (res.code === '000000') {
          // console.log('res.data', res.data);
          let _list = res.data;
          this.categoryList = _list;
          for (let _el of _list) {
            let mainList = _el.children;
            let cateList = [[]];
            let _cateIndex = 0;
            let count = 0;
            for (let _index = 0; _index < mainList.length; _index++) {
              count++;
              if (count < 8) {
                cateList[_cateIndex].push(mainList[_index]);
              } else {
                _cateIndex++;
                cateList[_cateIndex] = [];
                count = 0;
              }
            }
            _el['childrenList'] = cateList;
          }
          // console.log(this.categoryList);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />

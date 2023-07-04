<template>
  <div class="cascaderModel">
    <ul class="uls" @mouseenter="cascaderMousemove()" @mouseleave="cascadermouseout()">
      <li :class="[selIndex == i && isShow ? 'hover' : '', dataList.length - 1 == i && isShow && selIndex == i ? 'hovers' : '']" v-for="(e, i) in dataList" :key="i" @mouseenter="selectMousemove(i)">
        <div class="lis">
          <img v-if="e.getImg" :src="imgSrc + e.getImg" />
          <img v-else :src="e.staticImg" />
          <!-- <img src="../../static/mulindex/img/美妆.个护清洁.png" /> -->
          <div class="navBox">
            <div class="titleText">
              <p>
                <span v-for="(vo, idx) in e.packWebCategories" :key="vo.id" @click="linkTo(vo.id)">
                  {{ idx > 0 ? ' | ' : '' }}
                  <span class="first">{{ vo.name }}</span>
                </span>
              </p>
              <span class="el-icon-arrow-right"></span>
            </div>

            <p class="navBottom">
              <span v-for="(v1, idx1) in e.topPackWebCategories" :key="v1.id" @click="linkTo(v1.id)">
                {{ idx1 > 0 ? ' | ' : '' }}
                <span class="navStatus">{{ v1.name }}</span>
              </span>
            </p>
          </div>
        </div>
      </li>
    </ul>
    <!-- <div class="two_three"> -->
    <div class="two_three" ref="rightMain" @mouseenter="cascaderMousemove(1)" @mouseleave="cascadermouseout(2)">
      <div class="advertising">
        <a class="goto" v-for="vol in advertList" :key="vol.id" :href="vol.href" target="_blank">
          <span>{{ vol.title }}</span
          ><span class="el-icon-arrow-right"></span>
        </a>
      </div>
      <ul class="home" v-show="vo.children != null" v-for="vo in rightList" :key="vo.id">
        <li class="mainer">
          <div class="lefts">
            <span class="seletWord" @click="linkTo(vo.id)">{{ vo.name }}</span>
            <span class="rights el-icon-arrow-right"></span>
          </div>
          <div class="rightChildren">
            <span :class="[emo.schemeNum == 0 ? 'grayColor' : '', 'seletWord', 'everyItem']" style="" v-for="emo in vo.children" :key="emo.id + 'v'" @click="linkTo(emo.id)"> {{ emo.name }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { categoryList } from '@/api/zbz/packCategoryApi';

export default {
  data() {
    return {
      imgSrc: 'http://alifile.xiaocaiyin.com/',
      iconList: [
        require('../../static/mulindex/img/美妆.个护清洁.png'),
        require('../../static/mulindex/img/3C数码,电器.png'),
        require('../../static/mulindex/img/节庆,商务礼品.png'),
        require('../../static/mulindex/img/茗茶,酒类.png'),
        require('../../static/mulindex/img/食品,生鲜水果.png'),
        require('../../static/mulindex/img/医药保健,计生情趣.png')
      ],
      dataList: [],
      advertList: [],
      selIndex: null,
      rightList: [],
      mouseType: '',
      isShow: false
    };
  },
  props: {
    cateMap: Object
  },
  watch: {
    selIndex(index) {
      console.log('改动了index', index);
      this.rightList = [];
      this.dataList[index].packWebCategories.map((e, i) => {
        if (e.children) {
          this.rightList.push(...e.children);
        }
      });
    }
  },
  created() {
    this.categoryListFn();
  },
  methods: {
    //   获取一二级分类
    categoryListFn() {
      let _this = this;
      categoryList().then(res => {
        _this.dataList = res.data == null ? [] : res.data;
        _this.dataList.map((item, index) => {
          if (item.packWebCategories[0].logoPath != '' || item.packWebCategories[0].logoPath != null) {
            item.getImg = item.packWebCategories[0].logoPath;
          } else {
            item.getImg = item.packWebCategories[1].logoPath;
          }
          item.staticImg = _this.iconList[index];
        });
        // console.log(' 处理的数据dataList', _this.dataList);
      });
    },
    // 移入
    cascaderMousemove(type) {
      this.mouseType = type;
      this.isShow = true;
      this.$nextTick(function() {
        this.$refs.rightMain.style.display = 'block';
      });
    },
    // 移出
    cascadermouseout(valType) {
      if (this.mouseType != 1 || valType == 2) {
        this.$nextTick(function() {
          this.$refs.rightMain.style.display = 'none';
          this.isShow = false;
        });
      }
      // else{
      // }
    },
    // 移入传递id
    selectMousemove(idx) {
      let _this = this;
      _this.selIndex = idx;
      _this.advertList = _this.cateMap == null ? [] : _this.cateMap[idx + 1];
      // console.log('cateMap---', _this.cateMap);
      // console.log('advertList', _this.advertList);
      // console.log('移入的idx', idx);
    },
    linkTo(id) {
      let rUrl = this.$router.resolve({ path: '/packagingSolution/packageList', query: { id: id } });
      window.open(rUrl.href, '_blank');
      this.$report({ channel: 161000, actionId: 3, param: JSON.stringify({ id }) });
    }
  }
};
</script>

<style scoped>
.grayColor {
  color: #a9a9a9;
}
.cascaderModel {
  display: flex;
  position: relative;
  user-select: none;
}
.seletWord:hover {
  color: #c41b20;
  cursor: pointer;
  user-select: none;
}
.cascaderModel .uls {
  display: block;
  width: 236px;
  /* width: 267px; */
  height: 420px;
  background: #fff;
  color: #333333;
  /* overflow: hidden; */
  box-sizing: border-box;
  position: relative;
  z-index: 5;
}
.cascaderModel .uls li {
  height: 70px;
  box-sizing: border-box;
  cursor: pointer;
}
.cascaderModel .uls li:nth-child(n + 2) {
  border-top: 1px solid #ddd;
}
.cascaderModel .uls .hover {
  height: 70px;
  width: 238px;
  background: #fff;
  border-top: 1px solid #ddd;
  box-sizing: border-box;
}
.cascaderModel .uls .hovers {
  border-bottom: 1px solid #ddd;
}
/* .cascaderModel .uls .hover .titleText {
  color: #c41b20;
} */
.cascaderModel .uls .lis {
  height: 70px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  margin: 0 10px;
}
.cascaderModel .uls .lis > img {
  height: 30px;
  width: 30px;
  margin-right: 10px;
}
.cascaderModel .uls li .navBox {
  flex: 1;
}
.cascaderModel .uls li .titleText {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 6px;
}
.cascaderModel .uls li .navBottom > span .navStatus:hover,
.cascaderModel .uls li .titleText .first:hover {
  color: #c41b20;
  cursor: pointer;
}
.cascaderModel .uls li .navBottom {
  color: #7f7f7f;
  font-size: 12px;
  user-select: none;
}
.two_three {
  width: 820px;
  min-height: 420px;
  position: absolute;
  left: 237px;
  z-index: 4;
  background: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  /* box-shadow: 2px 0 5px rgb(0 0 0 / 30%); */
  display: none;
}
.two_three .advertising {
  display: flex;
}
.two_three .advertising .goto {
  padding: 6px;
  margin: 0 10px 10px 0;
  text-align: center;
  background: #333;
  color: #fff;
}
.two_three .advertising .goto:hover {
  background: #c41b20;
}
.two_three .home {
  margin: 10px 0;
  display: flex;
}
.two_three .mainer {
  width: 100%;
  color: #333333;
  font-weight: 700;
  flex-shrink: 0;
  display: flex;
  /* align-items: center; */
}
.two_three .home .rightChildren {
  width: 100%;
  color: #666666;
  flex-wrap: wrap;
  font-weight: normal;
  line-height: 26px;
  overflow: hidden;
}
.two_three .home .rightChildren .everyItem {
  margin-right: 10px;
  float: left;
  white-space: nowrap;
}
.two_three .lefts {
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  /* align-items: center; */
  margin-top: 2px;
  min-width: 80px;
  justify-content: right;
}
.two_three .rights {
  font-weight: 700;
  margin-right: 10px;
  margin-top: 4px;
}
</style>

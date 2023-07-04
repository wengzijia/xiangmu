<template>
  <div class="canbody">
    <el-main>
      <div class="comBox">
        <div class="downBox">
          <div class="canbodytitle">
            <div style="margin: 10px 0 0 0" class="bodybox">
              <p class="bodytitle">罐形:</p>
              <el-radio-group v-model="checkboxGroup2" size="medium" @change="typechange" style="margin-top:4px">
                <el-radio-button v-for="city in cities" :label="city.id" :key="city.name">{{ city.name }}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="bodybox">
              <p class="bodytitle">尺寸:</p>
              <div class="flex inputBx" style="margin-top:4px">
                <div class="inputBxrow inputBxrowSize" v-if="checkboxGroup2 == '圆形'">
                  <span style="padding: 0 10px">长</span>
                  <el-input v-model="Lval" style="width: 50px" size="small" @blur="sizeblur('sizeLong', Lval)" @keyup.enter.native="$event.target.blur">
                    <template slot="append">mm</template>
                  </el-input>
                  <span style="padding: 0 10px">直径</span>
                  <el-input v-model="Hval" style="width: 50px" size="small" @blur="sizeblur('sizeHeight', Hval)" @keyup.enter.native="$event.target.blur">
                    <template slot="append">mm</template>
                  </el-input>
                </div>

                <div class="inputBxrow inputBxrowSize" v-else>
                  <span style="padding: 0 10px">长</span>
                  <el-input v-model="Lval" style="width: 50px" size="small" @blur="sizeblur('sizeLong', Lval)" @keyup.enter.native="$event.target.blur">
                    <template slot="append">mm</template>
                  </el-input>
                  <span style="padding: 0 10px">宽</span>
                  <el-input v-model="Wval" style="width: 50px" size="small" @blur="sizeblur('sizeWidth', Wval)" @keyup.enter.native="$event.target.blur">
                    <template slot="append">mm</template>
                  </el-input>
                  <span style="padding: 0 10px">高</span>
                  <el-input v-model="Hval" style="width: 50px" size="small" @blur="sizeblur('sizeHeight', Hval)" @keyup.enter.native="$event.target.blur">
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </div>
            </div>
            <!-- <div class="bodybox">
              <p class="bodytitle">用途:</p>
              <el-checkbox-group v-model="checkboxGroup2" size="medium">
                <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div class="bodybox">
              <p class="bodytitle">用途:</p>
              <el-checkbox-group v-model="checkboxGroup2" size="medium">
                <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox-button>
              </el-checkbox-group>
            </div> -->
          </div>
          <ul style="margin: 20px 0 0 0">
            <li style="height: 348px;" v-for="(item, index) in goodsList" :key="index" :class="index + '' == imgindex ? 'curr' : ''" @mouseenter="imageOver(index)" @mouseleave="imageLeave(index)" @click.stop="toPage(item)">
              <p class="downImg DKimg">
                <img :src="item.photoPath2" />
              </p>
              <h3>{{ item.type }}</h3>
              <h3 v-if="item.goodsName">{{ item.goodsName }}</h3>
              <h3>{{ item.size }}</h3>
              <h3 v-if="false">罐体编号：{{ item.modelSn }} <button class="copybtn" @click.stop="copyShaneUrl(item.modelSn)">复制</button></h3>
              <div class="flex downHide">
                <!-- <router-link to="/ironActivity" target="_blank"> -->
                <!-- <div class="downHdv">
                    <span>下载次数: {{ item.clickCount }}</span>
                    <span class="downBnt">免费下载</span>
                  </div> -->
                <!-- </router-link> -->
              </div>
            </li>
          </ul>
          <div class="pageBox">
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="value" :total="totalCount" :page-size="data.pageSize" :current-page="data.pageNo" @current-change="handleCurrentChange"></el-pagination>
          </div>
          <p v-if="goodsList.length == 0" class="buttomtxt">暂时没有找到你需要的罐体去咨询客服人员或去定制罐体</p>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import { queryData } from '@/api/goods/miniGoodsApi';
export default {
  name: 'canbody',
  props: {},
  data() {
    return {
      goodsList: [],
      imgindex: -1,
      checkboxGroup2: '',
      cities: [
        { name: '全部', id: '' },
        { name: '方形', id: '方形' },
        { name: '圆形', id: '圆形' },
        { name: '异形', id: '异形' }
      ],
      data: {
        pageNo: 1,
        pageSize: 12,
        sizeHeight: 0,
        sizeLong: 0,
        sizeWidth: 0
      },
      value: true,
      totalCount: 0,
      Lval: '',
      Wval: '',
      Hval: ''
    };
  },
  created() {
    this.getqueryData();
  },
  methods: {
    toPage(item) {
      // 用户行为记录
      this.$report({
        channel: 131000 + Number(this.$route.query.subCateId),
        actionId: 2,
        param: JSON.stringify({
          id: item.id
        })
      });
      this.$router.push('/cutter/canbodyNew?cateId=10&subCateId=' + this.$route.query.subCateId + '&id=' + item.id);
    },
    getqueryData() {
      queryData(this.data).then(res => {
        this.goodsList = res.data.map(e => {
          e.newimg = '/' + e.imagesPath;
          return e;
        });

        this.totalCount = res.totalCount;
      });
    },
    copyShaneUrl(shareLink) {
      var input = document.createElement('input'); // 直接构建input
      input.value = shareLink; // 设置内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand('Copy'); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      this.$message({
        message: '已复制罐体编号快去下单吧~',
        type: 'success'
      });
    },
    handleCurrentChange(pageNumber) {
      this.data.pageNo = pageNumber;
      this.getqueryData();
    },
    sizeblur(size, val) {
      this.data.pageNo = 1;
      if (val == '') {
        this.data[size] = 0;
      } else {
        this.data[size] = val;
      }

      this.getqueryData();
    },
    typechange() {
      this.data.pageNo = 1;
      this.data.type = this.checkboxGroup2;
      this.getqueryData();
    },
    imageOver(index) {
      // this.goodsList[index].temp = this.goodsList[index].newimg;
      // if (this.goodsList[index].photoPath2) {
      //   this.goodsList[index].newimg = this.goodsList[index].photoPath2;
      // }
      // this.imgindex = index;
    },
    imageLeave(index) {
      // this.goodsList[index].newimg = this.goodsList[index].temp;
      // this.imgindex = -1;
    }
  }
};
</script>
<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/mulindex/css/index_new.css" />
<style scoped>
.bodytitle {
  width: 100px;
  float: left;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-right: 1px solid #bbb;
  background: #fff;
}
.downImg {
  cursor: pointer;
}
.bodybox {
  display: flex;
  border: 1px solid #bbb;
  border-bottom: 0;
  background: #f4f4f4;
}
.bodybox:last-child {
  border-bottom: 1px solid #bbb;
}
.downBox h3 {
  padding: 0;
}
.copybtn {
  background: #fff;
  border: 1px solid #eee;
}
.buttomtxt {
  width: 1240px;
  height: 300px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
}
</style>

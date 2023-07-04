<!-- fengjianbo -->
<template>
  <el-container class="login" style="background-color: #eff2f9 ;position: relative;">
    <el-header class="header-nav" style="height: auto;">
      <header-user-nav-top></header-user-nav-top>
      <header-user-nav-bottom></header-user-nav-bottom>
    </el-header>
    <el-container class="allChange_key" style="margin-top:25px;">
      <el-main class="login-main bkg" style=" width:500px">
        <div class="firstPart ">
          <div class="types">
            <span class="tLeft">模型品类:</span>
            <ul class="modelType">
              <li
                :class="taskHallQarms.categoryId == null && taskHallQarms.ifEntirety == null ? 'selcted' : ''"
                @click="
                  taskHallQarms.categoryId = null;
                  taskHallQarms.ifEntirety = null;
                  taskHallQarms.pageNumber = 1;
                "
              >
                全部
              </li>
              <li
                :class="taskHallQarms.ifEntirety == 1 && taskHallQarms.categoryId == null ? 'selcted' : ''"
                @click="
                  taskHallQarms.ifEntirety = 1;
                  taskHallQarms.categoryId = null;
                  taskHallQarms.pageNumber = 1;
                "
              >
                整体方案
              </li>
              <li
                v-for="item in modelList"
                :key="item.categoryId"
                :class="item.categoryId == taskHallQarms.categoryId ? 'selcted' : ''"
                @click="
                  taskHallQarms.categoryId = item.categoryId;
                  taskHallQarms.ifEntirety = null;
                  taskHallQarms.pageNumber = 1;
                "
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <div class="types design">
            <span class="tLeft" style="width: 110px;">设计类型:</span>
            <ul class="modelType ">
              <li
                :class="taskHallQarms.outType == null ? 'selcted' : ''"
                @click="
                  taskHallQarms.outType = null;
                  taskHallQarms.pageNumber = 1;
                "
              >
                全部
              </li>
              <li
                :class="taskHallQarms.outType == 0 ? 'selcted' : ''"
                @click="
                  taskHallQarms.outType = 0;
                  taskHallQarms.pageNumber = 1;
                "
              >
                包装平面设计
              </li>
              <li
                :class="taskHallQarms.outType == 1 ? 'selcted' : ''"
                @click="
                  taskHallQarms.outType = 1;
                  taskHallQarms.pageNumber = 1;
                "
              >
                平面设计
              </li>
              <li
                :class="taskHallQarms.outType == 2 ? 'selcted' : ''"
                @click="
                  taskHallQarms.outType = 2;
                  taskHallQarms.pageNumber = 1;
                "
              >
                3D设计
              </li>
            </ul>
          </div>
        </div>
        <div class="share">
          <a href="/user/myTask" target="_blank" style="font-size: 14px;margin-right: 20px;">我的任务</a>
          <span @click="copy()">分享任务</span>
        </div>
        <div class=" contentPart">
          <div class="sort">
            <ul class="txtSort">
              <li
                :class="taskHallQarms.addTime == null ? 'active' : ''"
                @click="
                  taskHallQarms.addTime = null;
                  taskHallQarms.pageNumber = 1;
                "
              >
                默认排序
              </li>
              <li
                :class="taskHallQarms.addTime == 1 ? 'active' : ''"
                @click="
                  taskHallQarms.addTime = 1;
                  taskHallQarms.pageNumber = 1;
                "
              >
                按发布时间
              </li>
              <li
                :class="taskHallQarms.addTime == 2 ? 'active' : ''"
                @click="
                  taskHallQarms.addTime = 2;
                  taskHallQarms.pageNumber = 1;
                "
              >
                按截稿时间
              </li>
            </ul>
            <div class="toLook">
              <el-input
                placeholder="请输入任务编号或者任务名称搜索"
                v-model="outName"
                @change="
                  taskHallQarms.outName = outName;
                  taskHallQarms.pageNumber = 1;
                "
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="
                    taskHallQarms.outName = outName;
                    taskHallQarms.pageNumber = 1;
                  "
                ></el-button>
              </el-input>
            </div>
          </div>
          <el-row v-if="taskHallList.length > 0" :gutter="10">
            <el-col :span="6" v-for="todo in taskHallList" :key="todo.id" style="cursor: pointer">
              <a style="padding-top: 14px;" :href="'/user/shareToDesigner?outNo=' + todo.outNo" target="_blank">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                  <img :src="baseUrl + todo.faceImg" class="image" />
                  <div class="pdg">
                    <p class="txtSize txtHead">{{ todo.outName }}</p>
                    <!-- <p :class="['txtSize', todo.requirement == '' ? 'txtBottom' : '']" v-html="todo.requirement == '' ? '无' : todo.requirement"></p> -->
                    <p class="txtHead" style=" font-weight: normal; color: #999;">
                      <span style="color:#e60021"
                        >￥<span style="font-size: 36px;">{{ todo.price }}</span></span
                      >
                      起
                    </p>
                  </div>
                </el-card>
              </a>
            </el-col>
          </el-row>
          <div class="undata" v-else>暂无数据~~</div>
        </div>

        <el-pagination
          style="text-align: center;"
          :hide-on-single-page="true"
          background
          @current-change="handleCurrentChange"
          :current-page="taskHallQarms.pageNumber"
          :page-size="taskHallQarms.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </el-main>
      <login-form :dialogVisible.sync="showLoginDialog"></login-form>
    </el-container>
    <el-footer class="footer">
      <foot-top></foot-top>
      <foot-bottom></foot-bottom>
    </el-footer>
  </el-container>
</template>
<script>
import LoginForm from '@/components/common/LoginForm';
import FootTop from '@/components/footer/FootTop';
import FootBottom from '@/components/footer/FootBottom';
import HeaderUserNavTop from '@/components/header/HeaderUserNavTop';
import HeaderUserNavBottom from '@/components/header/HeaderUserNavBottom';
import { getCategoryPrice, getTaskHallPage, getCategoryTaskHall } from '@/api/users/designer';

export default {
  components: {
    FootTop,
    FootBottom,
    HeaderUserNavTop,
    HeaderUserNavBottom,
    LoginForm
  },
  name: 'shareToDesigner',
  data() {
    return {
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      showLoginDialog: false,
      taskdetailList: [],
      //获取当前网站的网址
      windowUrl: window.location.href,
      totalCount: 0,
      modelList: [],
      taskHallList: [],
      outName: '',
      taskHallQarms: {
        addTime: null, //1 按发布时间 2 按截稿时间
        categoryId: null, //模型品类
        outName: '', //外发任务名称
        outType: null, //外发设计类型0平面设计
        pageNumber: 1, //页数
        pageSize: 16, //页大小
        ifEntirety: null
      }
    };
  },
  created() {
    this.moveInto();
  },
  watch: {
    taskHallQarms: {
      handler() {
        this.getTaskHallPageFn();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 获取任务大厅分页列表-模型品类
    getCategoryPriceFn() {
      getCategoryPrice().then(res => {
        // console.log('getCategoryPrice模型品类', res);
        this.modelList = res.data;
      });
    },
    // 获取任务大厅分页列表-模型品类
    // getCategoryTaskHallFn() {
    //   getCategoryTaskHall(this.taskHallQarms).then(res => {
    //     // console.log('getCategoryTaskHall', res);
    //     this.modelList = res.data;
    //   });
    // },
    // 获取任务大厅分页列表
    getTaskHallPageFn() {
      getTaskHallPage(this.taskHallQarms).then(res => {
        this.taskHallList = res.data;
        this.totalCount = res.totalCount;
        // console.log('获取任务大厅分页列表', res);
      });
    },
    //点击复制的方法兼容ios系统
    copy() {
      var domUrl = document.createElement('input');
      domUrl.value = '加入傲彩，认证设计师兼职做设计任务:' + this.windowUrl;
      domUrl.id = 'creatDom';
      document.body.appendChild(domUrl);
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        window.getSelection().removeAllRanges(); //这段代码必须放在前面否则无效
        var range = document.createRange();
        // 选中需要复制的节点
        range.selectNode(domUrl);
        // 执行选中元素
        window.getSelection().addRange(range);
        // 执行 copy 操作
        document.execCommand('copy');
        // 移除选中的元素
        window.getSelection().removeAllRanges();
      } else {
        domUrl.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
      }
      let creatDom = document.getElementById('creatDom');
      creatDom.parentNode.removeChild(creatDom);
      this.$message({
        message: '已复制链接，可以粘贴分享到群邀请更多设计师入驻傲彩！',
        type: 'success'
      });
    },
    // 判断是否登录
    moveInto() {
      const token = localStorage.getItem('Access-Token');
      // console.log('token', token);
      if (!token) {
        this.showLoginDialog = true;
      } else {
        this.getCategoryPriceFn();
        // this.getTaskHallPageFn();
      }
    },
    handleCurrentChange(pageNumber) {
      this.taskHallQarms.pageNumber = pageNumber;
      // this.getTaskHallPageFn();
    }
  }
};
</script>
<style>
.bkg .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #e60021;
}
.toLook .el-input__inner {
  height: 36px;
  /* font-size: 13px; */
}

.contentPart .el-row :last-child {
  margin-bottom: 10px;
}
</style>
<style scoped>
.bkg {
  background: #fff;
  padding: 20px;
  padding-top: 30px;
  color: #333;
}
.firstPart {
  font-size: 14px;
}
.firstPart .types {
  display: flex;
}

.firstPart .design {
  margin-top: 30px;
}
.firstPart .modelType {
  display: flex;
  flex-wrap: wrap;
}
.firstPart .modelType li {
  margin-right: 30px;
  cursor: pointer;
  margin-bottom: 10px;
}
.toLook {
  width: 300px;
}
.share {
  width: 100%;
  font-size: 14px;
  display: inline-block;
  text-align: right;
  /* justify-content: right; */
  padding: 10px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}
.share > span:hover {
  cursor: pointer;
  color: #e60021;
}
.firstPart .modelType li.selcted,
.firstPart .modelType li:hover {
  color: #e60021;
}
.firstPart .tLeft {
  flex: 0 0 86px;
  font-weight: 700;
  cursor: none;
  font-size: 15px;
}
.contentPart {
  font-size: 14px;
}
.contentPart .txtSort {
  display: flex;
  align-items: center;
}
.contentPart .txtSort li {
  font-size: 16px;
  display: inline-block;
  padding: 6px;
  color: #666;
  font-weight: 700;
  font-family: '微软雅黑', serif;
  margin-right: 40px;
  cursor: pointer;
}
.contentPart .txtSort li.active {
  border-bottom: 2px solid #e8e8e8;
  border-color: #e60021;
  color: #e60021;
}
.contentPart .sort {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}
.contentPart .txtSize {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* color: #999; */
}
.contentPart .txtBottom {
  margin-bottom: 10px;
}
.image {
  width: 100%;
  height: 280px;
  display: block;
}
.pdg {
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 10px;
}
.txtHead {
  font-size: 16px;
  color: #333;
  font-weight: 700;
  margin-bottom: 10px;
}
.undata {
  margin: 0 auto;
  height: 300px;
  width: 300px;
  line-height: 300px;
  text-align: center;
  font-size: 16px;
  color: #ccc;
}
</style>
<style scoped src="@/static/mulindex/css/public.css"></style>
<style scoped src="@/static/mulindex/css/fonts.css"></style>
<style scoped src="@/static/index/user/css/all.css" />
<!--<style scoped src="../../static/index/css/main.css" />-->
<style scoped src="../../../static/login.css" />
<style src="../../../static/index/user/css/reset.css" />

<template>
  <div>
    <!--    <div v-if="!userInfo.id" style="margin-top:300px; ">-->
    <!--      <span style="cursor: pointer" @click="login">请先<a style="color: #0a6999">登录</a>查看预检数据</span>-->
    <!--    </div>-->
    <!--    <el-table v-else :data="tableData" style="width: 100%">-->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="文件名">
        <template slot-scope="scope">
          <a :href="'/preview/previewDetails?reportId=' + scope.row.reportId" v-if="scope.row.isOK == 1" target="_blank" style="color:#000;text-decoration:none;">
            {{ scope.row.pdfName }}
          </a>
          <span v-else>
            {{ scope.row.pdfName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          {{ progress[scope.row.progress] }}
        </template>
      </el-table-column>
      <el-table-column label="结果" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.progress > 2">{{ standard[scope.row.isOK] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报告" width="180">
        <template slot-scope="scope">
          <span
            v-if="scope.row.progress > 2 && scope.row.isOK == '1'"
            :class="scope.row.isOK == '0' ? 'ultyes' : 'noultyes'"
            style="cursor: pointer"
            @click="
              // 用户行为埋点
              $report({
                channel: 151001,
                actionId: 2
              })
            "
          >
            <a :href="'/preview/previewDetails?reportId=' + scope.row.reportId" v-if="scope.row.isOK == 1" target="_blank" style="color:red;text-decoration:none;">
              查看报告
            </a>
          </span>
          <span v-if="scope.row.progress > 2 && scope.row.isOK == '0'"> 通过 </span>
        </template>
      </el-table-column>
    </el-table>
    <login-form :dialogVisible.sync="showLoginDialog"></login-form>
  </div>
</template>
<script>
import { getReportList } from '@/api/preview/previewApi';
import { ACCESS_TOKEN } from '@/store/global-constant';
import store from '@/store';
import { encodingMobile } from '@/utils/strUtil';
import LoginForm from '@/components/common/LoginForm';

export default {
  components: {
    LoginForm
  },
  data() {
    return {
      tableData: [],
      progress: ['已上传PDF文件', '待预检', '预检中', '预检完成', '预检异常'],
      standard: ['合格', '不合格'],
      // standards: ['通过', '不通过'],
      userInfo: {},
      showLoginDialog: false,
      page: 1,
      size: 10
    };
  },
  methods: {
    login() {
      this.showLoginDialog = true;
    },
    //获取用户信息
    getUserInfo() {
      if (localStorage.getItem(ACCESS_TOKEN) != null) {
        store.dispatch('GetUserInfo').then(() => {
          this.userInfo = store.getters.userInfo;
          // console.log('store.getters.userInfo', store.getters.userInfo);
          if (this.userInfo) {
            this.getReportList();
            this.userInfo.mobile = encodingMobile(this.userInfo.mobile);
          }
        });
      }
    },
    getReportList() {
      var data = {
        page: this.page,
        size: this.size,
        uid: this.userInfo.id
      };
      getReportList(data)
        .then(res => {
          console.log(res);
          if (res.code == '000000') {
            this.tableData = res.data;
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '功能维护中，请稍候再试'
          });
          console.log('err', err);
        });
    }
  },
  created() {
    this.getUserInfo();
    // 用户行为埋点
    this.$report({
      channel: 151001,
      actionId: 1
    });
  }
};
</script>
<style scoped>
.noultyes {
  color: red;
}
.ultyes {
  color: #67c23a;
}
</style>

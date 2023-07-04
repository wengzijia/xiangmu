<template>
  <div class="mytask">
    <div>
      <!-- <div v-if="isCertified"> -->
      <div class="list-head">
        <div style="font-size:16px">任务列表</div>
        <div>
          <a href="/user/taskHall" target="_blank" style="margin-right: 20px;cursor: pointer;font-size: 14px;">任务大厅</a>
          <span class="aboutOur" @click="qrCodeVisible = true">
            <em class="guigeTis " width="200" aria-describedby="el-tooltip-4570" tabindex="0">?</em>
            联系我们
          </span>
        </div>
      </div>
      <div class="tabHead">
        <ul class="listTabs">
          <li :class="taskParms.status == null ? 'active' : ''" @click="selectSatus(null)">全部</li>
          <li :class="taskParms.status == 1 ? 'active' : ''" @click="selectSatus(1)">设计中</li>
          <li :class="taskParms.status == 2 ? 'active' : ''" @click="selectSatus(2)">审核中</li>
          <li :class="taskParms.status == 3 ? 'active' : ''" @click="selectSatus(3)">已完成</li>
          <li :class="taskParms.status == 4 ? 'active' : ''" @click="selectSatus(4)">已结束</li>
        </ul>
        <div class="seach">
          <el-input placeholder="请输入任务单号或任务名称搜索" v-model="input" clearable @change="inputChange"> <el-button slot="append" icon="el-icon-search"></el-button></el-input>
        </div>
      </div>
      <div class="cainter">
        <el-table :data="tableData" :header-cell-style="{ background: '#f5f7fa' }" @row-click="row => $router.push('/user/taskOperation?id=' + row.id)" style="width: 100%;font-size:13px">
          <template slot="empty"> 没有匹配的任务单 </template>
          <el-table-column prop="drawSn" label="任务单号" width="100"> </el-table-column>
          <!-- <el-table-column prop="outName" label="任务" width="80"> </el-table-column> -->
          <el-table-column prop="model" label="模型品类">
            <template slot-scope="scope">
              <span style="text-align:center" v-for="(item, index) in scope.row.baseGoodsIdList" :key="item.baseGoodsId">{{ index > 0 ? ' | ' : '' }}{{ item.modelName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="设计类型" width="100">
            <template slot-scope="scope">
              <span style="text-align:center">{{ scope.row.outType == 0 ? '包装平面设计' : scope.row.outType == 1 ? '平面设计' : '3D设计' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="金额（元）" width="100">
            <template slot-scope="scope">
              <span style="text-align:center">￥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" width="95">
            <template slot-scope="scope">
              <span style="text-align:center">{{ formatDateSecond(scope.row.startTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="截止时间" width="95">
            <template slot-scope="scope">
              <span style="text-align:center">{{ formatDateSecond(scope.row.endTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="交付稿件" width="95">
            <template slot-scope="scope">
              <span v-if="scope.row.outDrawChidNumber > 0" class="sample" @click.stop="allDocumentFn(scope.row.id)">
                文件
              </span>
              <!-- <div v-for="value in scope.row.miniPackOutDrawChidVoList" :key="value.drawChId" @click.stop="() => 11">
                <div v-for="emo in value.miniPackOutDocumentsList" :key="emo.id">
                  <p>
                    <a class="sample" :href="baseUrl + emo.miniPackOutDocuments.jpgUrl" target="_blank">{{ fileName(emo.miniPackOutDocuments.jpgUrl) }}</a>
                  </p>
                  <p>
                    <a class="sample" :href="baseUrl + emo.miniPackOutDocuments.pdfUrl" target="_blank">{{ fileName(emo.miniPackOutDocuments.pdfUrl) }}</a>
                  </p>
                </div>
              </div> -->
            </template>
          </el-table-column>
          <el-table-column label="状态" width="85">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0" style="text-align:center">设计中</span>
              <span v-if="scope.row.status == 1 || scope.row.status == 2" style="text-align:center">审核中</span>
              <span v-if="scope.row.status == 3" style="text-align:center">已完成</span>
              <span v-if="scope.row.status == 4" style="text-align:center">未完成结束</span>
              <span v-if="scope.row.status == 5" style="text-align:center">未通过结束</span>
              <span v-if="scope.row.status == 6" style="text-align:center">关闭结束</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0" class="looks" @click.stop="$router.push('/user/taskOperation?id=' + scope.row.id)">编辑</span>
              <span v-else class="looks" @click.stop="$router.push('/user/taskOperation?id=' + scope.row.id)">查看</span>
              <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
              <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="w_page_0528 pages" style="padding: 30px 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          :page-size="taskParms.pageSize"
          :current-page="taskParms.pageNumber"
          :hide-on-single-page="true"
          @current-change="getPageData"
          @prev-click="getPageData"
          @next-click="getPageData"
        ></el-pagination>
        <!-- :hide-on-single-page="true" -->
      </div>
      <el-dialog title="联系我们" center :visible.sync="qrCodeVisible" width="440px">
        <img src="@/static/mulindex/img/linkOur.png" alt="" />
      </el-dialog>
    </div>
    <!-- <div v-else>
      <designer-register></designer-register>
    </div> -->
  </div>
</template>

<script>
// import designerRegister from '@/components/designer/designerRegister.vue';
import { getByUserId } from '@/api/users/designer';
import { getCurrentUserInfo } from '@/api/users/userApi';
import { getStylistTaskList, deliveryDownload, allDocument } from '@/api/users/designer';
import { formatDateSecond } from '@/utils/timeUtil';
export default {
  components: {
    // designerRegister
  },
  data() {
    return {
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      qrCodeVisible: false,
      isCertified: false, //判断是否入驻注册
      // pageNumber: 1,
      pageSize: 10,
      totalCount: 1,
      input: '',
      // taskStatus: null,
      // outName: '',
      tableData: [],
      uid: '',
      taskParms: {
        outName: '', //搜索名
        pageNumber: 1, //页数
        pageSize: 10, //页大小
        status: null //状态 空=全部,1设计中2审核中3已完成4已结束
      }
    };
  },
  created() {
    this.getUserInfo();
  },
  watch: {
    taskParms: {
      handler() {
        this.getStylistTaskListFn();
      },
      deep: true
    }
  },
  methods: {
    ...{ formatDateSecond },
    // 设计师下载已上传的设计稿-全部份数
    allDocumentFn(id) {
      // console.log('id', id);
      allDocument({ outDrawId: id }).then(res => {
        // console.log('全部份数', res);
      });
    },
    // 获取用户信息
    getUserInfo() {
      getCurrentUserInfo().then(res => {
        // this.$set(this, 'userInfo', res.data);
        if (res.code == '000000') {
          this.uid = res.data.id;
          // console.log('获取用户信息',this.uid);
          this.getByUserIdFn();
        }
      });
    },
    // 获取入驻用户信息
    getByUserIdFn() {
      getByUserId({ id: this.uid })
        .then(res => {
          // console.log('入驻用户信息22222', res);
          if (res.code == '000000') {
            // this.isCertified = res.data == null ? false : true;
            if (res.data.id == null) {
              this.$router.replace('/user/designerRegister');
            } else {
              this.getStylistTaskListFn();
            }
          }
        })
        .catch(err => {
          this.$router.replace('/user/designerRegister');
        });
    },
    // 获取路径的名字
    fileName(url) {
      if (url) {
        let urlList = url.split('/');
        return urlList[urlList?.length - 1];
      }
    },
    // 设计师我的任务列表-交付稿件下载
    // deliveryDownloadFn(drawChId, id, outNo) {
    //   const parms = {
    //     drawChId: drawChId,
    //     id: id,
    //     outNo: outNo
    //   };
    //   deliveryDownload(parms).then(res => {
    //     console.log('交付稿件下载', res, res);
    //   });
    // },

    // 设计师我的任务列表
    getStylistTaskListFn() {
      getStylistTaskList(this.taskParms)
        .then(res => {
          if (res.code == '000000') {
            this.tableData = res.data;
            console.log('任务列表', this.tableData);
            this.totalCount = res.totalCount;
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    },
    // 状态数据
    selectSatus(type) {
      this.taskParms.status = type;
      this.taskParms.pageNumber = 1;
      this.taskParms.outName = null;
      this.input = null;
      console.log('this.taskParms.taskStatus', this.taskParms.taskStatus);
    },
    // 搜索数据
    inputChange(val) {
      this.taskParms.outName = val;
      this.taskParms.pageNumber = 1;
    },
    // 分页数据
    getPageData(page) {
      this.taskParms.pageNumber = page;
    }
  }
};
</script>
<style>
.pages .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #e60021;
  font-weight: normal;
}
</style>
<style scoped>
.mytask {
  background: #fff;
  font-size: 14px;
  color: #333;
  padding: 20px;
}
.sample:hover {
  color: #e60021;
  border-bottom: 1px solid #e60021;
  cursor: pointer;
}
.mytask .list-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #818181;
}

.mytask .tabHead {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  margin-bottom: 15px;
}
.tabHead .seach {
  /* width: 300px; */
  flex: 0 0 300px;
}
.tabHead .listTabs {
  flex: 1;
  display: flex;
}
.tabHead .listTabs li {
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  padding: 12px 20px;
  color: #666;
  /* border-bottom: 2px solid #e8e8e8; */
  /* position: relative;
  bottom: -2px; */
  font-weight: 700;
  font-family: '微软雅黑', serif;
}
.tabHead .listTabs li:hover {
  color: #e60021;
}
.tabHead .listTabs li.active {
  border-bottom: 2px solid #e8e8e8;
  border-color: #e60021;
  color: #e60021;
}
.looks {
  cursor: pointer;
}
.looks:hover {
  color: #e60021;
  border-bottom: 1px solid #e60021;
}
.mytask .list-head .aboutOur {
  /* background: #f3f6ff; */
  cursor: pointer;
  padding: 6px;
  /* border-radius: 6px; */
  color: #6b6d71;
}
.mytask .list-head .aboutOur:hover {
  color: #d0111b;
}
.guigeTis {
  background-color: #d9d9d9;
  width: 14px;
  height: 14px;
  border: 1px solid #c9c9c9;
  display: inline-block;
  border-radius: 16px;
  position: relative;
  top: 1px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  vertical-align: top;
}
</style>
<style src="@/static/index/user/css/main.css" />

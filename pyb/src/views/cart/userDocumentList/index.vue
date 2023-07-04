<template>
  <el-dialog title="资质信息" :visible.sync="dialogTableVisible" :before-close="handleClose" width="30%">
    <el-row>
      <el-col class="flex" style="justify-content: space-between;display:flex;">
        <el-button size="small" @click="addDocument">添加资质</el-button>
        <el-button size="small" @click="mangerDocument" style="margin-left: 50%">管理资质</el-button>
      </el-col>
    </el-row>
    <el-table border id="table" ref="singleTable" st :data="userAllDocuments" v-infinite-scroll="load" highlight-current-row @current-change="handleCurrentChange" :show-header="false" style="width: 100%;margin-top:10px;" max-height="300">
      <el-table-column property="invoiceType" width="50px">
        <template slot-scope="scope">
          <el-radio-group v-model="radio">
            <el-radio :label="scope.row.id">{{ scope.row.none }}</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <span>{{ '公司名称 ' + scope.row.companyname }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col style="margin:10px 0;">
        <el-button size="medium" type="danger" @click="setDefault">立即提交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getComDocumentsByUid, updateDefault } from '@/api/users/userComDocumentsApi';

export default {
  name: 'UserDocumentList',
  computed: {
    activeMaxPage: function() {
      if (this.totalCount <= 0) {
        return 0;
      }
      return this.totalCount / this.pageSize;
    }
  },
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      userAllDocuments: [],
      pageNumber: '',
      pageSize: '',
      totalCount: '',
      radio: 0
    };
  },
  created() {
    this.getDocuments(0, 18);
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
      this.radio = val.id;

    },
    addDocument() {
      this.$emit('addDoc');
    },
    mangerDocument() {
      this.$router.push('/user/aptitude');
    },
    getDocuments(pageNumber, pageSize) {
      var _this = this;
      const reqParam = {
        data: {
          pageNumber: pageNumber,
          pageSize: pageSize
        }
      };
      getComDocumentsByUid(reqParam)
        .then(res => {
          if (res.code === '000000') {
            this.userAllDocuments = res.data;
            this.pageNumber = res.pageNumber;
            this.pageSize = res.pageSize;
            this.totalCount = res.totalCount;
          } else {
            _this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    //修改默认信息
    setDefault() {
      if (this.radio > 0) {
        let id = this.radio;
        const reqParam = {
          id: id
        };
        updateDefault(reqParam)
          .then(res => {
            if (res.code === '000000') {
              this.$message({
                type: 'success',
                message: '设置成功'
              });
              this.handleClose();
            } else {
              this.$message({
                type: 'error',
                message: res.message
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    handleClose() {
      this.$emit('showListDialog');
      // done();
    },
    getPageData(page) {
      this.getDocuments(page, this.pageSize);
    },
    load() {
      this.loading = true;
      if (this.pageNumber <= this.activeMaxPage) {
        this.pageNumber += 1;
        getComDocumentsByUid({ pageNumber: this.pageNumber, pageSize: this.pageSize }).then(res => {
          if (res.data != null) {
            this.userAllDocuments.push.apply(this.userAllDocuments, res.data);
            this.loading = false;
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>

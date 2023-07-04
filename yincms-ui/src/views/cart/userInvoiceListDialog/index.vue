<template>
  <el-dialog title="发票管理" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-row>
      <el-col class="flex" style="justify-content: space-between;display:flex;">
        <el-button @click="addInvoice" size="small">添加增值发票</el-button>
        <el-button size="small"><router-link to="/user/invoice">管理发票</router-link></el-button>
      </el-col>
    </el-row>
    <el-table border id="table" ref="singleTable" st :data="invoiceList" v-infinite-scroll="load" highlight-current-row @current-change="handleCurrentChange" :show-header="false" style="width: 100%;margin-top:10px;" max-height="300">
      <el-table-column property="invoiceType" width="200px">
        <template slot-scope="scope">
          <el-radio-group v-model="radio">
            <el-radio :label="scope.row.id">{{ scope.row.invoiceType }}</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column property="invoiceName" width="328px"></el-table-column>
    </el-table>
    <div style="padding: 10px 5px; justify-content: space-between;display: flex;">
      <div>
        <div v-if="isInvoiceCategory" style="    margin: 6px 0;font-size: 16px;">
          <span>发票类型：</span>
          <el-radio v-model="invoiceCategory" label="2">电子发票</el-radio>
          <el-radio v-model="invoiceCategory" label="1">纸质发票</el-radio>
        </div>
      </div>
      <el-row class="dialog-footer">
        <el-button type="danger" @click="setDefaultInvoice" size="medium">确 定</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { getInvoiceByUid, updateDefault } from '@/api/users/userInvoiceApi';

export default {
  name: 'UserInvoiceListDialog',
  computed: {
    activeMaxPage: function() {
      if (this.totalCount <= 0) {
        return 0;
      }
      return this.totalCount / this.pageSize;
    }
  },
  props: {
    activeVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    reGoodsInfoList: {
      type: Function
    }
  },
  data() {
    return {
      dialogVisible: this.activeVisible,
      invoiceList: [],
      currentRow: null,
      checked: '',
      pageNumber: 1,
      pageSize: 8,
      totalCount: 0,
      loading: false,
      // 单选按钮
      radio: 0,
      invoiceCategory: 0,
      isInvoiceCategory: true
    };
  },
  mounted() {
    this.listInvoice();
    // console.log(this.$el.getElementsByClassName('el-table'));
    // this.$el.getElementsByClassName('el-table').addEventListener('scroll', this.handleScroll);
  },
  watch: {
    activeVisible: function(n, o) {
      this.dialogVisible = this.activeVisible;
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
      if (val.invoiceType == '增值普通发票') {
        this.isInvoiceCategory = true;
      } else {
        this.isInvoiceCategory = false;
        this.invoiceCategory = 0;
      }
    },
    handleClose() {
      this.$emit('close');
    },
    setDefaultInvoice() {
      if (this.currentRow == null) {
        this.$message({
          type: 'error',
          message: '请选择发票!'
        });
        return false;
      }
      if (this.isInvoiceCategory && this.invoiceCategory == 0) {
        this.$message({
          type: 'error',
          message: '请选择发票类型!'
        });
        return false;
      }
      this.$confirm('确定要设置为默认吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateDefault({ data: { id: this.currentRow.id, invoiceCategory: this.invoiceCategory } })
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });
                this.$emit('updateInvoice');
                this.handleClose();
                if (this.reGoodsInfoList) {
                  this.reGoodsInfoList();
                }
              } else {
                this.$message({
                  type: 'error',
                  message: '设置失败!'
                });
              }
            })
            .catch(err => {
              // console.log(err);
              this.$message({
                type: 'error',
                message: '设置失败!'
              });
            });
        })
        .catch(() => {});
    },
    addInvoice() {
      this.$emit('addInvoice');
    },
    listInvoice() {
      getInvoiceByUid({ pageNumber: this.pageNumber, pageSize: this.pageSize })
        .then(res => {
          if (res.data != null) {
            this.totalCount = res.totalCount;
            res.data.forEach(item => {
              item.invoiceType = item.invoiceType == 0 ? '增值普通发票' : '增值专用发票';
            });
            this.$set(this, 'invoiceList', res.data);
            // console.log(this.invoiceList);
          } else {
            this.$set(this, 'invoiceList', [{ componeyName: '未查询到相关数据', content: '' }]);
          }
        })
        .catch(err => {
          // console.log(err);
        });
    },
    load() {
      this.loading = true;
      if (this.pageNumber <= this.activeMaxPage) {
        this.pageNumber += 1;
        getInvoiceByUid({ pageNumber: this.pageNumber, pageSize: this.pageSize }).then(res => {
          if (res.data != null) {
            res.data.forEach(item => {
              item.invoiceType = item.invoiceType == 0 ? '增值普通发票' : '增值专用发票';
            });
            this.invoiceList.push.apply(this.invoiceList, res.data);
            this.loading = false;
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>

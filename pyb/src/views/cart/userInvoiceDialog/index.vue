<template>
  <el-dialog title="发票信息" :visible.sync="visible" :before-close="handleCloseDialog">
    <div class="modal-body">
      <div class="qualification_information" style="margin:0 80px;">
        <el-tabs v-model="invoiceTypeTab" type="card" @tab-click="handleClick($event)" ref="invoice">
          <el-tab-pane label="普通发票" :name="invoiceTypeName[0]">
            <!--普通发票-->
            <div>
              <el-form :model="invoiceFromDataZero.invoiceVo" :rules="rules" ref="invoiceForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="发票抬头：" :label-width="formLabelWidth" prop="invoiceName">
                  <el-input v-model="invoiceFromDataZero.invoiceVo.invoiceName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号：" :label-width="formLabelWidth" prop="invoiceCode">
                  <el-input v-model="invoiceFromDataZero.invoiceVo.invoiceCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" @click="submitForm('invoiceForm')">提交</el-button>
                  <el-button @click="resetForm('invoiceForm')">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="增值税发票" :name="invoiceTypeName[1]">
            <!--增值税发票-->
            <el-form :model="invoiceFromDataOne.invoiceVo" :rules="rules" ref="invoiceOneForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="单位名称：" :label-width="formLabelWidth" prop="invoiceName">
                <el-input v-model="invoiceFromDataOne.invoiceVo.invoiceName" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="纳税人识别号：" :label-width="formLabelWidth" prop="invoiceCode">
                <el-input v-model="invoiceFromDataOne.invoiceVo.invoiceCode" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="注册地址：" :label-width="formLabelWidth" prop="invoiceAddress">
                <el-input v-model="invoiceFromDataOne.invoiceVo.invoiceAddress" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="注册电话：" :label-width="formLabelWidth" prop="invoiceMobile">
                <el-input v-model="invoiceFromDataOne.invoiceVo.invoiceMobile" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="开户银行：" :label-width="formLabelWidth" prop="invoiceBank">
                <el-input v-model="invoiceFromDataOne.invoiceVo.invoiceBank" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="银行账户：" :label-width="formLabelWidth" prop="invoiceBankcode">
                <el-input v-model="invoiceFromDataOne.invoiceVo.invoiceBankcode" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="danger" @click="submitForm('invoiceOneForm')">提交</el-button>
                <el-button @click="resetForm('invoiceOneForm')">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div class="clear"></div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getInvoiceByUid, saveOrUpdate } from '@/api/users/userInvoiceApi';

export default {
  name: 'UserInvoiceDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    invoiceType: {
      type: String,
      default: '0',
      required: true
    }
  },
  data() {
    return {
      invoices: [],
      invoiceFromDataZero: {
        invoiceType: '0',
        defaultTemp: '1',
        invoiceVo: {
          invoiceName: ''
        }
      },
      invoiceFromDataOne: {
        invoiceType: '1',
        defaultTemp: '1',
        invoiceVo: {
          invoiceName: ''
        }
      },
      pageNumber: 1,
      pageSize: 6,
      value: true,
      totalCount: 0,
      formLabelWidth: '140px',
      rules: {
        invoiceName: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        invoiceCode: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
        invoiceAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
        invoiceMobile: [{ required: true, message: '请输入注册电话', trigger: 'blur' }],
        invoiceBank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        invoiceBankcode: [{ required: true, message: '请输入银行账户', trigger: 'blur' }]
      },
      invoiceTypeName: ['0', '1'],
      invoiceTypeTab: '0'
    };
  },
  methods: {
    listInvoice() {
      getInvoiceByUid({ pageNumber: this.pageNumber, pageSize: this.pageSize })
        .then(res => {
          if (res.data != null) {
            this.totalCount = res.totalCount;
            this.$set(this, 'invoices', res.data);
          } else {
            this.$set(this, 'invoices', [{ title: '未查询到相关数据', content: '' }]);
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    changeActive(e) {
      e.target.querySelector('.rightLink').style.cssText += 'display:block';
    },
    removeActive(e) {
      e.target.querySelector('.rightLink').style.cssText += 'display:none';
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.listInvoice();
    },
    openEditInvoiceDialog(data) {
      this.dialogFormVisible = true;
      if (data.invoiceType == 1) {
        this.$set(this, 'invoiceFromDataOne', JSON.parse(JSON.stringify(data)));
        this.invoiceFromDataOne.invoiceVo.invoiceName = data.invoiceName;
        this.invoiceFromDataZero.id = data.id;
        this.invoiceFromDataZero.defaultTemp = data.defaultTemp;
        this.invoiceType = data.invoiceType + '';
      } else {
        this.$set(this, 'invoiceFromDataZero', JSON.parse(JSON.stringify(data)));
        this.invoiceFromDataZero.invoiceVo.invoiceName = data.invoiceName;
        this.invoiceFromDataOne.id = data.id;
        this.invoiceFromDataOne.defaultTemp = data.defaultTemp;
        this.invoiceType = data.invoiceType + '';
      }
    },
    handleCloseDialog(done) {
      this.resetForm();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.invoiceType === '1') {
            this.saveOrUpdateInvoice({ data: this.invoiceFromDataOne });
          } else {
            this.saveOrUpdateInvoice({ data: this.invoiceFromDataZero });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.invoiceFromDataZero = {
        invoiceType: '0',
        defaultTemp: '1',
        invoiceVo: {
          invoiceName: ''
        }
      };
      this.invoiceFromDataOne = {
        invoiceType: '1',
        defaultTemp: '1',
        invoiceVo: {
          invoiceName: ''
        }
      };
      this.$emit('close');
    },
    saveOrUpdateInvoice(data) {
      // console.log(data);
      saveOrUpdate(data)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '保存失败!'
            });
          }
          this.resetForm();
        })
        .catch(err => {
          // console.log(err);
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        });
      this.resetForm();
    },
    handleClick($event) {
      // console.log($event);
      this.$emit('handleClick', $event.name);
    }
  },
  watch: {
    invoiceType: function(n, o) {
      this.invoiceTypeTab = this.invoiceType;
      // console.log(this.invoiceType);
    }
  }
};
</script>
<style lang="scss" scoped></style>

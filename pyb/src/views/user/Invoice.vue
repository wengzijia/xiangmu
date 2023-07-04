<template>
  <div>
    <!--main-->
    <div class="change_key" style="padding: 0 0">
      <div class="right_List" style="float: none">
        <div class="UP_right_List">发票信息</div>
        <div class="Down_right_List allInvoice01">
          <div class="allInvoice">
            <div class="invoiceHd">
              <button type="button" class="btnBlue editinfo" @click="openEditInvoiceDialog(invoiceFromDataZero)">
                新增发票信息
              </button>
              <!-- <span>
                最多可保存<em style="color: #c00;">20</em>个，您还可以添加 <em style="color: #c00;">{{ 20 - totalCount }}</em
                >个
              </span> -->
            </div>
            <div v-if="invoices != null && invoices.length > 0">
              <div class="invoice_Main" v-for="(vo, index) in invoices" :key="index" @mouseenter="changeActive($event)" @mouseleave="removeActive($event)">
                <div class="forkIcon delit" data-id="vo.id"></div>
                <ul>
                  <li class="Hd_Bold">
                    增票发票信息
                    <div v-if="vo.defaultTemp === 1">
                      <span style="color:#c00">已默认</span>
                    </div>
                  </li>
                  <div v-if="vo.invoiceType == 0">
                    <li>发票抬头：{{ vo.invoiceName }}</li>
                    <li>纳税人识别码：{{ vo.invoiceVo.invoiceCode }}</li>
                  </div>
                  <div v-else>
                    <li>单位名称：{{ vo.invoiceName }}</li>
                    <li>纳税人识别码：{{ vo.invoiceVo.invoiceCode }}</li>
                    <li>注册地址：{{ vo.invoiceVo.invoiceAddress }}</li>
                    <li>注册电话：{{ vo.invoiceVo.invoiceMobile }}</li>
                    <li>开户银行：{{ vo.invoiceVo.invoiceBank }}</li>
                    <li>银行账户：{{ vo.invoiceVo.invoiceBankcode }}</li>
                  </div>
                </ul>
                <div class="rightLink">
                  <span v-if="vo.defaultTemp == 0">
                    <a v-if="vo.defaultTemp == 0" href="javascript:;" @click="setDefaultInvoice(vo.id)" class="rightLink_font rightLink_font01 setdefault">设为默认</a>
                  </span>
                  <span v-if="vo.invoiceType < 1">
                    <a href="javascript:;" @click="openEditInvoiceDialog(vo)" class="rightLink_font editit">编辑</a>
                  </span>
                  <span v-else>
                    <el-button class="rightLink_font editit" type="text" @click="openEditInvoiceDialog(vo)">编辑</el-button>
                  </span>
                  <span v-if="vo.defaultTemp == 0"><a href="javascript:;" @click="deleteInvoice(vo.id)" class="rightLink_font rightLink_font01 delit">删除</a></span>
                </div>
              </div>
            </div>
            <div v-else></div>
          </div>
          <!--分页-->
          <div class="w_page_0528">
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="value" :total="totalCount" :page-size="pageSize" :current-page="pageNumber" @current-change="handleCurrentChange"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--main end-->
    <!--dialog start-->
    <el-dialog class="invocieLayer" width="850px" title="发票信息" :visible.sync="dialogFormVisible" :before-close="handleCloseDialog">
      <div class="modal-body">
        <div class="qualification_information" style="margin:0 20px;">
          <el-tabs v-model="invoiceType" type="card" @tab-click="handleClick($event)">
            <el-tab-pane label="普通发票" :name="'0'">
              <!--普通发票-->
              <div>
                <el-form :model="invoiceFromDataZero.invoiceVo" :rules="rules" ref="invoiceForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="发票抬头：" :label-width="formLabelWidth" prop="invoiceName">
                    <el-input v-model="invoiceFromDataZero.invoiceVo.invoiceName" autocomplete="off">
                      <el-button slot="append" @click="ObtainNumber(invoiceFromDataZero.invoiceVo.invoiceName)"><span style="color: red">获取税号</span></el-button>
                    </el-input>
                    <el-card class="box-card" v-if="isBoxCard">
                      <div v-for="(vo, index) in obtainNumberList" :key="index" class="cardText item">
                        <div @click="creditCodeClick(index, 0)">
                          <div class="cardTextLeft">{{ vo.name }}</div>
                          <div class="cardTextRight">{{ vo.creditCode }}</div>
                        </div>
                      </div>
                    </el-card>
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
            <el-tab-pane label="增值税发票" :name="'1'">
              <!--增值税发票-->
              <el-form :model="invoiceFromDataOne.invoiceVo" :rules="rules" ref="invoiceOneForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="单位名称：" :label-width="formLabelWidth" prop="invoiceName">
                  <el-input v-model="invoiceFromDataOne.invoiceVo.invoiceName" autocomplete="off">
                    <el-button slot="append" @click="ObtainNumber(invoiceFromDataOne.invoiceVo.invoiceName)"><span style="color: red">获取税号</span></el-button>
                  </el-input>
                  <el-card class="box-card" v-if="isBoxCard">
                    <div v-for="(vo, index) in obtainNumberList" :key="index" class="cardText item">
                      <div @click="creditCodeClick(index, 1)">
                        <div class="cardTextLeft">{{ vo.name }}</div>
                        <div class="cardTextRight">{{ vo.creditCode }}</div>
                      </div>
                    </div>
                  </el-card>
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
    <!--dialog end-->
  </div>
</template>
<script>
import { deleteById, getInvoiceByUid, saveOrUpdate, updateDefault, getInvoiceCodeByWord } from '@/api/users/userInvoiceApi';

export default {
  data() {
    return {
      invoices: [],
      invoiceFromDataZero: {
        invoiceType: '0',
        invoiceVo: {
          invoiceName: '',
          invoiceCode: ''
        }
      },
      invoiceFromDataOne: {
        invoiceType: '1',
        invoiceVo: {
          invoiceName: '',
          invoiceCode: ''
        }
      },
      invoiceType: '0',
      pageNumber: 1,
      pageSize: 6,
      value: true,
      totalCount: 0,
      dialogFormVisible: false,
      formLabelWidth: '140px',
      rules: {
        invoiceName: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        invoiceCode: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
        invoiceAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
        invoiceMobile: [{ required: true, message: '请输入注册电话', trigger: 'blur' }],
        invoiceBank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        invoiceBankcode: [{ required: true, message: '请输入银行账户', trigger: 'blur' }]
      },
      invoiceTypeTab: '0',
      isBoxCard: false,
      obtainNumberList: [
        {
          name: '未获取到，请输入详细公司名',
          creditCode: ''
        }
      ]
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
          console.log(err);
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
        invoiceVo: {
          invoiceName: ''
        }
      };
      this.invoiceFromDataOne = {
        invoiceType: '1',
        invoiceVo: {
          invoiceName: ''
        }
      };
      this.isBoxCard = false;
      this.dialogFormVisible = false;
    },
    saveOrUpdateInvoice(data) {
      saveOrUpdate(data)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.listInvoice();
          } else {
            this.$message({
              type: 'error',
              message: '保存失败!'
            });
          }
          this.resetForm();
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        });
      this.dialogFormVisible = false;
    },
    setDefaultInvoice(id) {
      this.$confirm('确定要设置为默认吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateDefault({ data:{id: id} })
            .then(res => {
              if (res.success) {
                this.listInvoice();
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: '设置失败!'
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: 'error',
                message: '设置失败!'
              });
            });
        })
        .catch(() => {});
    },
    ObtainNumber(code) {
      const loading = this.$loading({
        lock: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var data = {
        data: code,
        language: 'zh-cn'
      };
      getInvoiceCodeByWord(data)
        .then(res => {
          loading.close();
          console.log(res);
          if (res.success) {
            if (res.data) {
              this.obtainNumberList = res.data;
              this.isBoxCard = true;
            } else {
              this.isBoxCard = false;
            }
          }
        })
        .catch(err => {
          this.isBoxCard = false;
          loading.close();
        });
    },
    //选择对应公司
    creditCodeClick(index, type) {
      if (type > 0) {
        this.invoiceFromDataOne.invoiceVo.invoiceCode = this.obtainNumberList[index].creditCode;
        this.invoiceFromDataOne.invoiceVo.invoiceName = this.obtainNumberList[index].name;
      } else {
        this.invoiceFromDataZero.invoiceVo.invoiceCode = this.obtainNumberList[index].creditCode;
        this.invoiceFromDataZero.invoiceVo.invoiceName = this.obtainNumberList[index].name;
      }
      console.log('invoiceFromDataZero', this.invoiceFromDataZero);
      console.log('invoiceFromDataone', this.invoiceFromDataOne);
      this.isBoxCard = false;
    },
    handleClick($event) {
      // console.log($event);
      this.$emit('handleClick', $event.name);
      this.isBoxCard = false;
    },
    deleteInvoice(id) {
      this.$confirm('确定要删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(() => {
          deleteById({ id: id })
            .then(res => {
              if (res.success) {
                this.listInvoice();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.listInvoice();
  },
  created() {}
};
</script>

<style scoped src="../../static/index/user/css/reset.css" />
<style scoped src="../../static/index/user/css/all.css" />
<style scoped src="../../static/index/user/css/foot.css" />
<style scoped src="../../static/index/user/css/main.css" />
<style scoped>
.box-card {
  position: absolute;
  height: 144px;
  z-index: 100;
  width: 99.4%;
  border: 1px solid #eaeaea;
  overflow: auto;
  font-size: 13px;
}
.el-card__body {
  padding: 10px !important;
}
.cardText {
  position: relative;
  top: -10px;
  cursor: pointer;
  line-height: 34px;
}

.cardTextLeft {
  display: inline-block;
  width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cardTextRight {
  display: inline-block;
  width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

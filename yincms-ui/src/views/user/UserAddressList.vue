<template>
  <div>
    <div class="UP_right_List">收货地址</div>
    <div class="Down_right_List allInvoice01">
      <div class="allInvoice">
        <div class="invoiceHd2">
          <span>
            <em style="font-weight:600; color:#333;">现有收货地址</em>
            <!-- (最多可保存<em style="color: #c00;">10</em>个，您还可以添加<em style="color: #c00;">{{ 10 - addressList.length }}</em -->
            <!-- >个) -->
          </span>
        </div>
        <div class="addNew_List">
          <ul class="wbb1207Addreceiptaddressdiv">
            <li class="wbb1201Receiptaddress wbb1208box fl" v-for="(item, index) in addressList" :key="index">
              <ul class="wbb1201Receiptaddress-ul2">
                <li>
                  <span class="wbb1201Small1"><img src="@/static/index/user/images/wbb120102.png"/></span>
                  <span class="consigneename">{{ item.consigneeName }}</span>
                  <a class="fr delAddressFlag" @click="deleteAddress(item.id)" href="javascript:;" style="margin-right:15px;"><img src="@/static/index/user/images/wbb120107.png"/></a>
                </li>
                <li>
                  <span class="fl wbb1201Small1"><img src="@/static/index/user/images/wbb120103.png"/></span>&nbsp;
                  <span class="fl" style="width:220px;"
                    ><label class="province">{{ item.province }}</label
                    >.<label class="city">{{ item.city }}</label
                    >.<label class="county">{{ item.county }}</label
                    >.<label class="detailedaddress">{{ item.address }}</label></span
                  >
                  <div class="clear"></div>
                </li>
                <li>
                  <span class="wbb1201Small1"><img src="@/static/index/user/images/wbb120104.png"/></span>&nbsp;<span class="mobile">{{ item.mobile }}</span>
                </li>
                <!-- <li><span class="wbb1201Small1"><img src="/images/wbb120105.png" /></span>&nbsp;<span>收货时间不限</span></li> -->
                <a href="javascript:;" data-id="14" class="wbb1201Modify1 fr" @click="showDetail($event, item.id)">编辑</a>
              </ul>
              <div class="clear"></div>
            </li>
            <li data-toggle="modal" @click="showDetail($event)" id="addNewAddressBtn" class="wbb1207Addreceiptaddressli1 wbb1208box fl"></li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="收货地址" width="700px" @close="closeForm('form')">
      <div style="padding: 0px 20px;">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="收货人" prop="consigneeName">
            <el-input v-model="form.consigneeName" maxlength="15"></el-input>
            <label style="color: #f00; font-size: 12px;">* 请填写实名，国家规定收件人实名制，否则后果自负</label>
          </el-form-item>
          <el-form-item label="省市区" prop="countyId">
            <el-col :span="8">
              <el-select v-model="form.provinceId" placeholder="请选择" style="width:180px" @change="selectCity($event, 'province')">
                <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="form.cityId" placeholder="请选择" style="width:170px;margin-left:10px;" @change="selectCity($event, 'city')">
                <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="form.provinceId + '_' + index"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="form.countyId" placeholder="请选择" style="width:170px;margin-left:10px;" @change="selectCity($event, 'county')">
                <el-option v-for="(item, index) in countyList" :key="index" :label="item" :value="form.cityId + '_' + index"> </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" @input="form.address = form.address.replace(/\s+/g, '')"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handlerSubmit">立即提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMyList, getById, saveOrUpdate, deleteById } from '@/api/users/userAddressApi';
import { getProvince, getCity, getAreaId, getAreaName } from '@/utils/city';
export default {
  name: 'userAddressList',
  data() {
    // 手机号验证
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      }
    };
    return {
      addressList: [],
      dialogVisible: false,
      form: { province: '', city: '', county: '', provinceId: '', cityId: '', countyId: '', mobile: '' },
      rules: {
        consigneeName: { required: true, message: '请输入收货人', trigger: 'blur' },
        address: { required: true, message: '请输入地址', trigger: 'blur' },
        mobile: { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur' },
        countyId: { required: true, message: '请选择省市区', trigger: 'change' }
      },
      provinceList: [],
      cityList: [],
      countyList: []
    };
  },
  watch: {},
  created() {
    this.getAddressList();
    this.provinceList = getProvince();
  },
  methods: {
    selectCity(val, type) {
      if (type === 'province') {
        this.$set(this.form, 'cityId', '');
        this.$set(this.form, 'countyId', '');
        this.$set(this, 'cityList', getCity(this.form.provinceId));
        this.$set(this, 'countyList', []);
      } else if (type === 'city') {
        this.$set(this.form, 'countyId', '');
        this.$set(this, 'countyList', getCity(this.form.cityId));
      }
    },
    getAddressList() {
      getMyList({}).then(res => {
        this.addressList = res.data;
      });
    },
    showDetail(event, id) {
      if (id) {
        getById({ id: id }).then(res => {
          this.$set(this, 'form', res.data);
          if (this.form.province) {
            this.$set(this.form, 'provinceId', getAreaId('province', this.form.province));
          }
          if (this.form.city) {
            this.$set(this.form, 'cityId', getAreaId('city', this.form.city, this.form.provinceId));
            this.cityList = getCity(this.form.provinceId);
          }
          if (this.form.county) {
            this.$set(this.form, 'countyId', getAreaId('county', this.form.county, this.form.cityId));
            this.countyList = getCity(this.form.cityId);
          }
        });
      } else {
        this.$set(this, 'form', {});
      }
      this.dialogVisible = true;
    },
    deleteAddress(id) {
      this.$alert('确定删除该记录吗', '信息', {
        showCancelButton: true,
        showClose: false,
        cancelButtonClass: 'btn-custom-cancel',
        callback: action => {
          if (action === 'confirm') {
            deleteById({ id: id }).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getAddressList();
            });
          }
        }
      });
    },
    closeForm(formName) {
      this.$refs[formName].resetFields();
    },
    handlerSubmit() {
      const formName = 'form';
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.form.provinceId) {
            this.$message({ type: 'error', message: '请选择省份' });
            return false;
          } else if (!this.form.cityId) {
            this.$message({ type: 'error', message: '请选择市' });
            return false;
          } else if (!this.form.countyId) {
            this.$message({ type: 'error', message: '请选择地区' });
            return false;
          }
          this.form.province = getAreaName('province', this.form.provinceId);
          this.form.city = getAreaName('city', this.form.cityId);
          this.form.county = getAreaName('county', this.form.countyId);
          saveOrUpdate({ data: this.form }).then(() => {
            this.$message({ type: 'success', message: '操作成功' });
            this.dialogVisible = false;
            this.closeForm(formName);
            this.getAddressList();
          });
        }
      });
    }
  }
};
</script>

<style scoped src="../../static/index/user/css/wbb1125showye.css"></style>
<style scoped src="../../static/index/user/css/all.css" />
<style>
body {
  font-family: '微软雅黑', HELVETICA;
}
</style>

<template>
  <el-dialog :visible.sync="visibleDialog" :title="dialogTitle" width="700px" @close="closeForm('dialogForm')">
    <div style="padding: 0px 20px;">
      <el-form ref="dialogForm" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="收货人" prop="formData">
          <el-input v-model="dialogForm.contacts"></el-input>
          <label style="color: #f00; font-size: 12px;">* 请填写实名，国家规定收件人实名制，否则后果自负</label>
        </el-form-item>
        <el-form-item label="省市区" prop="formData[1]" style="margin-top: 20px">
          <el-select v-model="dialogForm.provinceId" placeholder="请选择" style="width:180px" @change="selectSCity($event, 'province')">
            <el-option style="padding-left: 15px" v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
          </el-select>
          <el-select v-model="dialogForm.cityId" placeholder="请选择" style="width:180px" @change="selectSCity($event, 'city')">
            <el-option style="padding-left: 15px" v-for="(item, index) in cityList" :key="index" :label="item" :value="dialogForm.provinceId + '_' + index"> </el-option>
          </el-select>
          <el-select v-model="dialogForm.countyId" placeholder="请选择" style="width:180px" @change="selectSCity($event, 'county')">
            <el-option style="padding-left: 15px" v-for="(item, index) in countyList" :key="index" :label="item" :value="dialogForm.cityId + '_' + index"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address" style="margin-top: 20px">
          <el-input v-model="dialogForm.address" @input="dialogForm.address = dialogForm.address.replace(/\s+/g, '')"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" style="margin-top: 20px">
          <el-input v-model="dialogForm.mobile"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <el-button style="width: 95px;height: 35px;" type="danger" @click="handlerSubmit">立即提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import { getProvince, getCity, getAreaId, getAreaName } from '@/utils/city';

export default {
  name: 'AddrDialog',
  props: {
    activeVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    dialogTitle: {
      type: String,
      default: '',
      required: true
    },
    formData: {
      type: Object,
      default: null,
      required: false
    },
    hasModify: {
      type: Boolean,
      default: false,
      required: true
    },
    rules: {
      type: Object,
      default: null,
      required: false
    },
    // 回调方法
    commitCallback: {
      type: Function
    }
  },
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
      visibleDialog: false,
      dialogForm: { province: '', city: '', county: '', provinceId: '', cityId: '', countyId: '', mobile: '' },
      provinceList: [],
      cityList: [],
      countyList: []
    };
  },
  watch: {
    activeVisible: function(n, o) {
      this.visibleDialog = this.activeVisible;
    }
  },
  created() {
    this.provinceList = getProvince();
  },
  methods: {
    handlerSubmit() {
      debugger;
      if (!this.dialogForm.provinceId) {
        this.$message({ type: 'error', message: '请选择省份' });
        return false;
      } else if (!this.dialogForm.cityId) {
        this.$message({ type: 'error', message: '请选择市' });
        return false;
      } else if (!this.dialogForm.countyId) {
        this.$message({ type: 'error', message: '请选择地区' });
        return false;
      }
      this.dialogForm.province = getAreaName('province', this.dialogForm.provinceId);
      this.dialogForm.city = getAreaName('city', this.dialogForm.cityId);
      this.dialogForm.county = getAreaName('county', this.dialogForm.countyId);
      this.commitCallback({ data: this.dialogForm }).then(() => {
        this.$message({ type: 'success', message: '操作成功' });
        this.closeForm('dialogForm');
      });
    },
    showDialog() {
      if (!this.hasModify) {
        this.$set(this, 'form', {});
      } else {
        let city = this.formData.city.split('-');
        if (city.length === 3) {
          let provinceId = getAreaId('province', city[0]);
          let cityId = getAreaId('city', city[1], provinceId);
          this.$set(this.dialogForm, 'provinceId', provinceId);
          this.$set(this.dialogForm, 'cityId', cityId);
          this.cityList = getCity(provinceId);
          this.$set(this.dialogForm, 'countyId', getAreaId('county', city[2], cityId));
          this.countyList = getCity(cityId);
          this.$set(this.dialogForm, 'contacts', this.formData.contacts);
          this.$set(this.dialogForm, 'address', this.formData.address);
          this.$set(this.dialogForm, 'mobile', this.formData.mobile);
        }
      }
    },
    selectCity(val, type) {
      console.log('----------------------------');
      if (type === 'province') {
        this.$set(this.dialogForm, 'cityId', '');
        this.$set(this.dialogForm, 'countyId', '');
        this.$set(this, 'cityList', getCity(this.dialogForm.provinceId));
        this.$set(this, 'countyList', []);
      } else if (type === 'city') {
        this.$set(this.dialogForm, 'countyId', '');
        this.$set(this, 'countyList', getCity(this.dialogForm.cityId));
      }
    },
    selectSCity(val, type) {
      console.log('----------------------------');
      if (type === 'province') {
        this.$set(this.dialogForm, 'cityId', '');
        this.$set(this.dialogForm, 'countyId', '');
        this.$set(this, 'cityList', getCity(this.dialogForm.provinceId));
        this.$set(this, 'countyList', []);
      } else if (type === 'city') {
        this.$set(this.dialogForm, 'countyId', '');
        this.$set(this, 'countyList', getCity(this.dialogForm.cityId));
      }
    },
    closeForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit('close');
    }
  }
};
</script>
<style lang="scss" scoped></style>

<template>
  <el-main>
    <div class="w_0908_topimg">
      <div class="w_0908_mask"></div>
    </div>
    <div class="advantage_2" style="padding:50px 0;">
      <div class="main_1200_0915">
        <div class="zhuce_jjr">
          <el-form ref="form" :model="formData" :rules="rules" label-width="120px" style="width: 750px">
            <div class="steptwo">
              <el-form-item label="所在地区" prop="countyId" class="colorDd2727">
                <el-col :span="8">
                  <el-select v-model="formData.provinceId" placeholder="省份" @change="selectCity($event, 'province')">
                    <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="formData.cityId" placeholder="地级市" style="margin-left:12px;" @change="selectCity($event, 'city')">
                    <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="formData.provinceId + '_' + index"> </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="formData.countsyId" placeholder="市,县级市,区" style="margin-left:12px;" @change="selectCity($event, 'county')">
                    <el-option v-for="(item, index) in countyList" :key="index" :label="item" :value="formData.cityId + '_' + index"> </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="formData.companyName"></el-input>
              </el-form-item>
              <el-form-item label="年产能规模" prop="business">
                <el-select v-model="formData.business" placeholder="请选择">
                  <el-option label="10万以下" value="10万以下"> </el-option>
                  <el-option label="10万-100万" value="10万-100万"> </el-option>
                  <el-option label="100万-500万" value="100万-500万"> </el-option>
                  <el-option label="1000万以上" value="1000万以上"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系人姓名" prop="contacts">
                <el-input v-model="formData.contacts"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="tel">
                <el-input v-model="formData.tel"></el-input>
              </el-form-item>
              <el-form-item label="QQ号码" prop="qq">
                <el-input v-model="formData.qq"></el-input>
              </el-form-item>
              <el-form-item label="公司地址" prop="address">
                <el-input v-model="formData.address" @input="formData.address = formData.address.replace(/\s+/g, '')"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="imgVerifyCode">
                <el-input v-model="formData.imgVerifyCode">
                  <template slot="append">
                    <img :src="'data:image/jpeg;base64,' + baseImg" id="captcha" @click="getImageCode" style="cursor:pointer;height:34px;position:relative;top:2px;" title="点击刷新" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" style="width:120px;" @click="handlerSubmit">确认提交</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import { getVerifyImageCode } from '@/api/sms/verifyCodeApi';
import { getProvince, getCity, getAreaId, getAreaName } from '@/utils/city';
import { saveProducer } from '@/api/producer/producerApi';

export default {
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
    const validateQQ = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入正确的QQ号'));
      } else {
        if (!/[1-9][0-9]{4,}/.test(value)) {
          callback(new Error('请输入正确的QQ号'));
        } else {
          callback();
        }
      }
    };
    return {
      baseImg: '',
      provinceList: [],
      cityList: [],
      countyList: [],
      formData: { province: '', city: '', county: '', provinceId: '', cityId: '', countyId: '', tel: '', imgVerifyUuid: '' },
      rules: {
        companyName: { required: true, message: '请输入公司名称', trigger: 'blur' },
        business: { required: true, message: '请选择产能规模', trigger: 'change' },
        contacts: { required: true, message: '请输入联系人姓名', tigger: 'blur' },
        address: { required: true, message: '请输入地址', trigger: 'blur' },
        tel: { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur' },
        qq: { validator: validateQQ, message: '请输入正确的QQ号', trigger: 'blur' },
        countyId: { required: true, message: '请选择省市区', trigger: 'change' },
        imgVerifyCode: { required: true, message: '请输入验证码', tigger: 'blur' }
      }
    };
  },
  methods: {
    getImageCode() {
      getVerifyImageCode()
        .then(res => {
          this.baseImg = res.data.base64ImgData;
          this.$set(this.formData, 'imgVerifyUuid', res.data.uuid);
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '请重新获取!'
          });
          console.log(err);
        });
    },
    selectCity(val, type) {
      if (type === 'province') {
        this.$set(this.formData, 'cityId', '');
        this.$set(this.formData, 'countyId', '');
        this.$set(this, 'cityList', getCity(this.formData.provinceId));
        this.$set(this, 'countyList', []);
      } else if (type === 'city') {
        this.$set(this.formData, 'countyId', '');
        this.$set(this, 'countyList', getCity(this.formData.cityId));
      }
    },
    closeForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: '/' });
    },
    handlerSubmit() {
      const formName = 'form';
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.formData.provinceId) {
            this.$message({ type: 'error', message: '请选择省份' });
            return false;
          } else if (!this.formData.cityId) {
            this.$message({ type: 'error', message: '请选择市' });
            return false;
          } else if (!this.formData.countyId) {
            this.$message({ type: 'error', message: '请选择地区' });
            return false;
          }
          this.formData.province = getAreaName('province', this.formData.provinceId);
          this.formData.city = getAreaName('city', this.formData.cityId);
          this.formData.county = getAreaName('county', this.formData.countyId);
          saveProducer(this.formData)
            .then(res => {
              this.$message({ type: 'success', message: '操作成功,请耐心等待审核' });
              this.dialogVisible = false;
              this.closeForm(formName);
              this.getAddressList();
            })
            .catch(err => {
              this.getImageCode();
            });
        }
      });
    }
  },
  created() {
    this.getImageCode();
    this.provinceList = getProvince();
  }
};
</script>

<!--引用通用样式-->
<style scope src="../../static/index/css/reset.css" />
<style scope src="../../static/index/css/main.css" />
<style scope src="../../static/index/css/base.css" />
<style scope src="../../static/index/css/common.css" />
<style scope src="../../static/mulindex/css/public.css" />

<template>
  <el-dialog :visible.sync="hasVisibleSample" title="寄样地址" width="700px" @close="closeForm('sampleForm')">
    <div style="padding: 0px 20px;">
      <el-form ref="sampleForm" :model="sampleForm" :rules="rules" label-width="80px">
        <el-form-item label="收货人" prop="consigneeName">
          <el-input v-model="sampleForm.consigneeName"></el-input>
        </el-form-item>
        <el-form-item label="省市区" prop="countyId" style="margin-top: 20px">
          <el-select v-model="sampleForm.provinceId" placeholder="请选择" style="width:180px" @change="selectSCity($event, 'province')">
            <el-option style="padding-left: 15px" v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
          </el-select>
          <el-select v-model="sampleForm.cityId" placeholder="请选择" style="width:180px" @change="selectSCity($event, 'city')">
            <el-option style="padding-left: 15px" v-for="(item, index) in cityList" :key="index" :label="item" :value="sampleForm.provinceId + '_' + index"> </el-option>
          </el-select>
          <el-select v-model="sampleForm.countyId" placeholder="请选择" style="width:180px" @change="selectSCity($event, 'county')">
            <el-option style="padding-left: 15px" v-for="(item, index) in countyList" :key="index" :label="item" :value="sampleForm.cityId + '_' + index"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address" style="margin-top: 20px">
          <el-input v-model="sampleForm.address" @input="sampleForm.address = sampleForm.address.replace(/\s+/g, '')"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" style="margin-top: 20px">
          <el-input v-model="sampleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <el-button style="width: 95px;height: 35px;" type="danger" @click="handlerSubmitSample">立即提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import { getProvince, getCity, getAreaId, getAreaName } from '@/utils/city';

export default {
  name: 'AddressComponent',
  props: {
    // 传递的值
    form: {
      type: Object,
      default: () => {}
    },
    // 提交方法
    commitFunc: Function
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped></style>

<template>
  <div>
    <describe v-show="active == 0" :active="active" @changeactive="changes" :getDdata="getDdata" ref="describe" />
    <uploadimg v-show="active == 1" :active="active" @changeactive="changes" :getUdata="getUdata" ref="uploadimg" />
    <placeorder v-show="active == 2" :active="active" @changeactive="changes" :addOriginalDesignOrderfn="addOriginalDesignOrderfn" ref="placeorder" />
    <!-- <placeorder :active="active" @changeactive="changes" :addOriginalDesignOrderfn="addOriginalDesignOrderfn" ref="placeorder" /> -->
    <!-- <button @click="demofn">12</button> -->
    <div class="bottomactive">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="设计需求描述"></el-step>
        <el-step title="上传素材文件"></el-step>
        <el-step title="提交订单"></el-step>
      </el-steps>
    </div>
    <login-form :dialogVisible.sync="uploadDisabled"></login-form>
  </div>
</template>
<script>
import { listFlipOrder } from '@/api/order/supplierOrdersApi';
import { updateName } from '@/api/order/orderApi';
import { getCount, listOrder, addFrom } from '@/api/home/homeApi';
import { strEquals } from '@/utils/strUtil';

import ironInfoList from '@/utils/ironData';
import { ACCESS_TOKEN } from '@/store/global-constant';
import LoginForm from '@/components/common/LoginForm';
import store from '@/store';
import { addOriginalDesignOrder } from '@/api/goods/miniGoodsApi';
import describe from '@/components/packing/describe';
import uploadimg from '@/components/packing/uploadimg';
import placeorder from '@/components/packing/placeorder';
export default {
  name: 'PackagingDemand',
  components: { describe, uploadimg, placeorder, LoginForm },
  data() {
    return {
      memo: '',
      openSize: '',
      imgList: [],
      logoFileList: [],
      textFileList: [],
      structFile: '',
      customName: '',
      active: 0,
      userInfo: '',
      uploadDisabled: false
    };
  },
  // 方法
  methods: {
    addFrom() {
      var from = this.$route.query.from ? this.$route.query.from : '';
      var data = {
        data: from,
        language: 'zh-cn'
      };
      addFrom(data)
        .then(res => {
          console.log(999);
        })
        .catch(err => {
          console.log(err);
        });
    },
    changes(val) {
      this.active = val;
    },
    demofn() {
      console.log(this.memo);
      console.log(this.openSize);
      console.log(this.imgList);
      console.log(this.logoFileList);
      console.log(this.textFileList);
      console.log(this.structFile);
      console.log(this.customName);
    },
    getUserInfo() {
      if (localStorage.getItem(ACCESS_TOKEN) != null) {
        store.dispatch('GetUserInfo').then(() => {
          if (store.getters.userInfo) {
            this.userInfo = store.getters.userInfo;
          } else {
            this.uploadDisabled = true;
          }
        });
      } else {
        this.uploadDisabled = true;
      }
    },
    getDdata() {
      this.memo = this.$refs.describe.textarea;
      this.openSize = this.$refs.describe.input + '_' + this.$refs.describe.input2 + '_' + this.$refs.describe.input3;
      this.customName = this.$refs.describe.shopname;
    },
    getUdata() {
      this.imgList = this.$refs.uploadimg.imgarr;
      this.logoFileList = this.$refs.uploadimg.logoFileList;
      this.textFileList = this.$refs.uploadimg.textFileList;
      this.structFile = this.$refs.uploadimg.structFile;
    },
    addOriginalDesignOrderfn(data) {
      if (this.memo && this.openSize && this.imgList) {
        addOriginalDesignOrder({
          orderType: this.$route.query.orderType,
          memo: this.memo,
          customName: this.customName,
          openSize: this.openSize,
          imgList: this.imgList,
          logoFileList: this.logoFileList,
          textFileList: this.textFileList,
          structFile: this.structFile,
          number: 1
          // consigneeName: data.name,
          // mobile: data.phone,
          // address: data.address
        }).then(res => {
          console.log(res);
          this.$router.push({ path: '/service/getpay', query: { orderNo: res.data.orderNo, subOrderId: res.data.subOrderNo, design: true } });
        });
      }
    }
  },
  // 初始化组件事件,具体请看vue的生命周期
  created() {
    this.getUserInfo();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建 vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      //判断是否是刷新   其他页面跳转需要调用添加
      console.log('from.path', from.path);
      if (from.path != '/') {
        vm.addFrom();
      }
    });
  }
};
</script>
<style src="../../static/mulindex/css/attr.css" />
<style scoped>
.bottomactive {
  /* position: fixed; */
  width: 1240px;
  /* left: 0; */
  /* right: 0; */
  /* bottom: 10px; */
  margin: auto;
  margin-bottom: 50px;
}
</style>

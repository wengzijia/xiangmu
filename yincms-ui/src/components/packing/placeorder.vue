<template>
  <div>
    <div class="comBox">
      <div class="brickBox">
        <div class="brickContenBox">
          <div class="brick">
            <div class="brick-img-box">
              <h2 v-if="$route.query.orderType == 5">专业设计师会在 <span style="color: red">48小时内</span> 完成平面设计，并联系给您</h2>
              <h2 v-if="$route.query.orderType == 6">包装结构设计师在 <span style="color: red">6小时内</span> 完成结构设计，并联系您</h2>
              <h2 v-if="$route.query.orderType == 7">专业包装规划师会在收到样品的 <span style="color: red">72小时内</span> 完成设计，并联系给您</h2>
              <!-- <p>已有结构设计文件 需要专业设计师进行设计</p> -->
            </div>
            <!-- <div class="box-info" v-if="$route.query.orderType==7"> -->
            <div class="box-info" style="margin-top:100px">
              <div class="price-box">
                <div class="price">
                  <p style="margin: auto"><span style="font-size: 16px; color: #000; font-weight: 400;">设计费用：</span><span>￥</span>{{ $route.query.orderType | pricefilter }}<span>元</span></p>
                  <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" style="margin-top:30px">
                    <el-form-item label="联系人" prop="name">
                      <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone">
                      <el-input v-model="ruleForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="样品寄回地址" prop="address">
                      <el-input v-model="ruleForm.address"></el-input>
                    </el-form-item>
                  </el-form> -->
                </div>
              </div>
            </div>
            <p class="packingbtn"><button @click="upper">上一步</button><button @click="submitForm('ruleForm')">提交订单</button></p>
            <div style="width: 65%; margin: 20px auto">
              <template v-if="$route.query.orderType == 6">
                <p><span style="color: red">*</span>若您的商品外观复杂为了保证成盒，请寄样品给我们，寄样地址订单详情页。</p>
                <p style="margin-top: 10px"><span style="color: red">*</span>提交订单后可在个人中心查看设计文件</p>
                <p style="margin-top: 10px">
                  <span style="color: red">*</span>
                  包装结构设计是专为傲彩客户提供的增值服务，只提供照片或PPT文档，收取的费用低于成本价，旨在促成大货订单，故用于生产的源文件仅用于在傲彩下大货使用，恕不对外提供，不便之处，敬请理解。
                </p>
              </template>
              <template v-if="$route.query.orderType == 5">
                <p><span style="color: red">*</span>提交订单后可在个人中心查看设计文件</p>
                <p style="margin-top: 10px">
                  <span style="color: red">*</span>
                  包装平面设计是专为傲彩客户提供的增值服务，只提供照片或PPT文档，收取的费用低于成本价，旨在促成大货订单，故用于生产的源文件仅用于在傲彩下大货使用，恕不对外提供，不便之处，敬请理解。
                </p>
              </template>
              <template v-if="$route.query.orderType == 7">
                <p><span style="color: red">*</span>提交订单后请寄样品给我们，寄样地址在订单详情页。</p>
                <p style="margin-top: 10px">
                  <span style="color: red">*</span>包装方案设计是专为傲彩客户提供的增值服务，只提供照片或PPT文档，收取的费用低于成本价，旨在促成大货订单，故用于生产的源文件仅用于在傲彩下大货使用，恕不对外提供，不便之处，敬请理解。
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'uploadimg',
  props: {
    active: Number,
    addOriginalDesignOrderfn: Function
  },
  components: {},
  data() {
    return {
      ruleForm: {
        name: '',
        phone: '',
        address: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入您的地址', trigger: 'blur' },
          { min: 6, max: 30, message: '请输入正确的地址', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // dnext(){
    //   this.addOriginalDesignOrderfn()
    // },
    upper() {
      this.$emit('changeactive', 1);
    },
    submitForm(formName) {
      // if(this.$route.query.orderType==7){
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       this.addOriginalDesignOrderfn(this.ruleForm)
      //     } else {
      //       console.log('error submit!!');
      //       return false;
      //     }
      //   });
      // }else{
      // this.addOriginalDesignOrderfn(this.ruleForm)
      this.addOriginalDesignOrderfn();
      // }
    }
  },
  filters: {
    pricefilter(val) {
      return val == 5 ? 300 : val == 6 ? 50 : 1000;
    }
  }
};
</script>
<style src="../../static/mulindex/css/attr.css" />
<style>
.comBox .el-input-group__append {
  width: 25px;
  padding: 0 5px;
  text-align: center;
}
</style>
<style scoped>
.brickBox {
  /* border: 1px solid red; */
  margin-top: 50px;
  padding-bottom: 50px;
}
.brickContenBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.brickContenBox > div {
  margin-bottom: 14px;
}
.ironTitle {
  width: 100%;
  height: 102px;
  line-height: 114px;
  font-size: 28px;
  text-align: center;
  margin: 30px 0;
}
.brick {
  width: 1240px;
  min-height: 500px;
  padding-bottom: 22px;
  background-color: #fff;
  box-sizing: border-box;
}
.brick-img-box {
  margin: 30px auto;
  text-align: center;
  box-sizing: border-box;
}
.brick-img-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.box-info {
  width: 65%;
  margin: auto;
  box-sizing: border-box;
  padding: 8px 15px;
}
.price-box {
  display: flex;
  flex-flow: row wrap;
  /* justify-content: space-between; */
  line-height: 32px;
}
.price-box p {
  color: red;
  font-size: 35px;
  font-weight: bold;
}
.price-box span {
  font-size: 14px;
}
.price {
  color: #ff0036;
  font-size: 14px;
  margin: auto;
}
.price span {
  font-size: 14px;
}
.packingbtn {
  text-align: center;
  margin: 100px 0 100px 0;
}
.brick .packingbtn button {
  outline: none;
  width: 120px;
  height: 40px;
  background: #ffefe6;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  margin-right: 30px;
  color: #ff610d;
  border: 1px solid #ff610d;
  border-radius: 50px;
}
.brick .packingbtn button:nth-child(2) {
  background: url('../../static/upload/images/packing2.png') no-repeat;
  border: none;
  color: #fff;
  background-size: 100% 100%;
}
.price-box button:hover {
  background-color: #ee0030;
}
.info > div {
  line-height: 25px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
}
.info > div:hover {
  cursor: default;
}
.info > div::before {
  content: '·';
  font-size: 15px;
  font-weight: 700;
  margin-right: 6px;
}
.brick-img-box:hover {
  cursor: pointer;
}
button:hover {
  cursor: pointer;
}
.ptext {
  width: 700px;
  /* height: 300px; */
}
</style>
